import { fireEvent, render, screen } from '@testing-library/preact';
import MainService from '../../../../src/service/mainService';
import QueryService from '../../../../src/service/queryService';
import RootContextProvider from '../../../../src/context/rootContext';
import QueryItemContextProvider from '../../../../src/context/queryItemContext';
import WidgetOutput from '../../../../src/component/queryOutput/widgetOutput/WidgetOutput';
import ViewModeContextProvider from '../../../../src/context/viewModeContext';

describe('WidgetOutput test', () => {
    test('component should render', () => {
        const params = {
            widgets: [
                [{ type: "card", value: {}, title: "card title", name: "name 1" }],
                [{ type: "dataTable", value: { data: { columns: [], values: [[]] } }, name: "", title: "dataTable title" }],
                [{ type: "chart", value: { data: [], layout: [] }, name: "", title: "chart test" }],
                [{ type: "text", value: "text value", name: "", title: "" }],
                [{ type: "markdown", value: "markdown value", name: "", title: "" }],
                [{ type: "input-form", value: {}, name: "", title: "input-form test" }],
                [{ type: "card", value: {}, title: "card title" }],
                [{ type: "card", value: {} }],
                { title: "input-form test" },
                {},
                [{
                    type: "imageList", value: [
                        {
                            url: "https://www.kasandbox.org/programming-images/avatars/leaf-blue.png",
                            caption: "blue leaf"
                        },
                        {
                            url: "https://www.kasandbox.org/programming-images/avatars/leaf-green.png",
                            caption: "green leaf"
                        }
                    ], title: "imageList title", name: ""
                }]
            ]
        };
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const mockQuery = { output: { response: { widgets: params.widgets } } }; // Mocked query structure
        const { container } = render(<RootContextProvider value={{ mainService, queryService }}>
            <ViewModeContextProvider value={{
                popper: false,
                popperOpened: false,
                popperExpanded: false,
                variant: "fullscreen-mini",
                openSideWorkspace: true,
                handleOpenSideWorkspace: () => { },
                closeSideWorkspace: () => { },
                sideWorkspaceContext: 0,
                handleExpand: () => { }
            }}>
                <QueryItemContextProvider value={{ query: mockQuery, citationEnabled: false }}>
                    <WidgetOutput data={params} />
                </QueryItemContextProvider>
            </ViewModeContextProvider>
        </RootContextProvider>);
        expect(container.textContent).toContain("card title");
        expect(container.textContent).toContain("dataTable title");
        expect(container.textContent).toContain("chart test");
        expect(container.textContent).toContain("text value");
        expect(container.textContent).toContain("markdown value");
        expect(container.textContent).toContain("input-form test");
        expect(container.textContent).toContain("Unknown component.");
        expect(container.textContent).toContain("imageList title")
    });

    test('component should render :select option', () => {
        const params = {
            widgets: [
                [{ type: "card", value: {}, title: "card title 1", name: "name 1" }, { type: "chart", value: {}, title: "card title 2", name: "name 2" }],
            ]
        };
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const mockQuery = { output: { response: { widgets: params.widgets } } }; // Mocked query structure
        const { container } = render(<RootContextProvider value={{ mainService, queryService }}>
            <QueryItemContextProvider value={{ query: mockQuery, citationEnabled: false }}>
                <ViewModeContextProvider value={{
                    popper: false,
                    popperOpened: false,
                    popperExpanded: false,
                    variant: "fullscreen-mini",
                    openSideWorkspace: true,
                    handleOpenSideWorkspace: () => { },
                    closeSideWorkspace: () => { },
                    sideWorkspaceContext: 0,
                    handleExpand: () => { }
                }}>
                    <WidgetOutput data={params} />
                </ViewModeContextProvider>
            </QueryItemContextProvider>
        </RootContextProvider>);
        expect(container.textContent).toContain("card title 1");
        expect(container.textContent).not.toContain("card title 2");
        fireEvent.change(screen.getByLabelText('widget select'), { target: { value: "name 2" } })
        expect(container.textContent).not.toContain("card title 1");
        expect(container.textContent).toContain("card title 2");
    });
});
