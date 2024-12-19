import { fireEvent, render, screen, waitFor } from '@testing-library/preact';
import QueryInput from '../../../src/component/queryInput/QueryInput';
import RootContextProvider from '../../../src/context/rootContext';
import MainService from '../../../src/service/mainService';
import QueryService from '../../../src/service/queryService';
import ViewModeContextProvider from '../../../src/context/viewModeContext';
import { SideWorkspaceContext } from '../../../src/model/SideWorkspace';


// window.SpeechRecognition = jest.fn().mockImplementation(() => ({
//     start: jest.fn(),
//     stop: jest.fn(),
//     onstart: jest.fn(),
//     onresult: jest.fn()
// }));

describe('QueryInput test', () => {
    let mainService, queryService, makeQuery;

    beforeEach(() => {
        mainService = new MainService();
        queryService = new QueryService(mainService);
        makeQuery = jest.fn();
        queryService.makeQuery = makeQuery;
    });

    const renderComponent = () => {
        return render(
            <RootContextProvider value={{ mainService, queryService, suggested_queries: [] }}>
                <ViewModeContextProvider
                    value={{
                        popper: false,
                        popperOpened: false,
                        popperExpanded: false,
                        variant: "fullscreen",
                        openSideWorkspace: false,
                        handleOpenSideWorkspace: () => { },
                        closeSideWorkspace: () => { },
                        handleExpand: () => { },
                        sideWorkspaceContext: SideWorkspaceContext.PINNED_RESPONSES
                    }}
                >
                    <QueryInput />
                </ViewModeContextProvider>
            </RootContextProvider>
        );
    };

    test('component should render text input', async () => {
        renderComponent();
        const input = screen.getByPlaceholderText('Type your query...');

        expect(input).toBeTruthy();
        fireEvent.input(input, { target: { value: 'summarize data' } });

        const sendBtn = screen.getByTitle("send");
        expect(sendBtn).toBeTruthy();
        fireEvent.submit(sendBtn);

        await waitFor(() => {
            expect(queryService.makeQuery).toHaveBeenCalledWith("summarize data", "text", null, "", []);
        });
    });

    test('component should render file input', async () => {
        mainService.enableFileInput.value = true;
        mainService.inputConfig.value = {
            max_files: 5,
            max_file_size: 25 * 1024, // 25 MB
            accepted_file_type: ['.txt', '.pdf']
        };

        renderComponent();

        const input = screen.getByPlaceholderText('Type your query...');
        fireEvent.input(input, { target: { value: 'summarize data' } });

        const fileInput = screen.getByTestId('file-input');
        expect(fileInput).toBeTruthy();

        const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
        fireEvent.change(fileInput, { target: { files: [file] } });

        const sendBtn = screen.getByTitle("send");
        fireEvent.click(sendBtn);

        await waitFor(() => {
            expect(queryService.makeQuery).toHaveBeenCalledWith("summarize data", "text", "file_input", "", [file]);
        });
    });

    // test('component should handle voice input', async () => {
    //     renderComponent();
    //     const micButton = screen.getByTitle('Use microphone');
    //     fireEvent.click(micButton);

    //     // await waitFor(() => {
    //     // expect(screen.getByTitle('listening')).toBeTruthy();
    //     // });

    //     const recognition = (window as any).SpeechRecognition.mock.instances[0];
    //     recognition.onresult({ results: [[{ transcript: 'voice command' }]] });

    //     const input = screen.getByPlaceholderText('Type your query...');
    //     await waitFor(() => {
    //         expect(input).toBe(' voice command');
    //     });
    // });

    test('component should handle drag and drop file upload', async () => {
        mainService.enableFileInput.value = true;
        mainService.inputConfig.value = {
            max_files: 5,
            max_file_size: 25 * 1024, // 25 MB
            accepted_file_type: ['.txt', '.pdf']
        };

        renderComponent();

        const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
        const dropZone = document.getElementById('drop-zone');

        fireEvent.dragOver(dropZone);
        fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

        await waitFor(() => {
            expect(screen.getByText('1 file uploaded. Maximum limit 5 files')).toBeTruthy();
        });
    });

    test('component should show snackbar for file limit reached', async () => {
        mainService.enableFileInput.value = true;
        mainService.inputConfig.value = {
            max_files: 1,
            max_file_size: 25 * 1024, // 25 MB
            accepted_file_type: ['.txt', '.pdf']
        };

        renderComponent();

        const files = [
            new File(['file content'], 'file1.txt', { type: 'text/plain' }),
            new File(['file content'], 'file2.txt', { type: 'text/plain' })
        ];
        const fileInput = screen.getByTestId('file-input');
        fireEvent.change(fileInput, { target: { files } });

        await waitFor(() => {
            expect(screen.getByText('Maximum of 1 files should be uploaded')).toBeTruthy();
        });
    });

    test('component should handle stopping query fetch', async () => {
        queryService.stopQueryFetch.value = true;
        const dispatchEventSpy = jest.spyOn(queryService.eventTarget, 'dispatchEvent');

        renderComponent();

        const stopBtn = screen.getByTitle('Stop');
        expect(stopBtn).toBeTruthy();
        fireEvent.click(stopBtn);

        await waitFor(() => {
            expect(dispatchEventSpy).toHaveBeenCalledWith("queryInput:stop");
        });
    });
});
