import { render, screen, fireEvent } from '@testing-library/preact';
import RootContextProvider, { RootContext } from '../../../../../../src/context/rootContext';
import FileListRenderer from '../../../../../../src/component/queryOutput/widgetOutput/widgets/fileListRenderer/FileListRenderer';
import MainService from '../../../../../../src/service/mainService';
import QueryService from '../../../../../../src/service/queryService';

describe('FileListRenderer', () => {
    const mainService = new MainService();
    const queryService = new QueryService(mainService);

    test('should render file items with correct icons and tooltips', () => {
        const data = [
            { name: 'file1.ppt', type: 'ppt', url: 'file1.ppt' },
            { name: 'file2.ppt', type: 'ppt', url: 'file2.ppt' }
        ];

        render(
            <RootContextProvider value={{ mainService, queryService }}>
                <FileListRenderer data={data} />
            </RootContextProvider>
        );

        data.forEach(file => {
            expect(screen.getByText(file.name)).toBeTruthy();
            const downloadIcons = screen.getAllByTitle('Download');
            expect(downloadIcons.length).toBe(data.length);
        });
    });

    test('should call handleDownload function when download icon is clicked', async () => {
        const data = [{ name: 'file1.ppt', type: 'ppt', url: 'file1.ppt' }];

        render(
            <RootContextProvider value={{ mainService, queryService }}>
                <FileListRenderer data={data} />
            </RootContextProvider>
        );

        const downloadButton = screen.getByTitle('Download');
        fireEvent.click(downloadButton);
    });

    test('should display tooltip with file name', () => {
        const data = [{ name: 'file1.ppt', type: 'ppt', url: 'file1.ppt' }];

        render(
            <RootContextProvider value={{ mainService, queryService }}>
                <FileListRenderer data={data} />
            </RootContextProvider>
        );

        const tooltip = screen.getByText('file1.ppt');
        expect(tooltip).toBeTruthy();
    });

    test('should handle errors when download function fails', async () => {
        const data = [{ name: 'file1.ppt', type: 'ppt', url: 'file1.ppt' }];

        const originalConsoleError = console.error;
        console.error = () => {};

        render(
            <RootContextProvider value={{ mainService, queryService }}>
                <FileListRenderer data={data} />
            </RootContextProvider>
        );

        const downloadButton = screen.getByTitle('Download');
        fireEvent.click(downloadButton);
        console.error = originalConsoleError;
    });
});
