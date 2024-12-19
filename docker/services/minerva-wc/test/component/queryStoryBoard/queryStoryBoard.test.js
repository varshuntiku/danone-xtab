import { fireEvent, render, screen, waitFor } from '@testing-library/preact';
import QueryStoryBoard from '../../../src/component/queryStoryBoard/QueryStoryBoard';
import RootContextProvider from '../../../src/context/rootContext';
import ViewModeContextProvider from '../../../src/context/viewModeContext';
import MainService from '../../../src/service/mainService';
import QueryService from '../../../src/service/queryService';
import { QueryServiceEvents } from '../../../src/model/Events';
import { SideWorkspaceContext } from '../../../src/model/SideWorkspace';

describe('QueryStoryBoard test', () => {
    const mainService = new MainService();
    const queryService = new QueryService(mainService);

    test('should render the component with Create Presentation tab', () => {
        render(
            <RootContextProvider value={{ mainService, queryService }}>
                <ViewModeContextProvider value={{
                    popper: false,
                    popperOpened: false,
                    popperExpanded: false,
                    variant: "fullscreen",
                    openSideWorkspace: false,
                    handleOpenSideWorkspace: () => {},
                    closeSideWorkspace: () => {},
                    handleExpand: () => {},
                    sideWorkspaceContext: SideWorkspaceContext.PINNED_RESPONSES
                }}>
                    <QueryStoryBoard />
                </ViewModeContextProvider>
            </RootContextProvider>
        );
        expect(screen.getByText('Create Presentation')).toBeTruthy();
        expect(screen.getByText('Include All Conversations')).toBeTruthy();
    });

    test('should activate tab on click', () => {
        render(
            <RootContextProvider value={{ mainService, queryService }}>
                <ViewModeContextProvider value={{
                    popper: false,
                    popperOpened: false,
                    popperExpanded: false,
                    variant: "fullscreen",
                    openSideWorkspace: false,
                    handleOpenSideWorkspace: () => {},
                    closeSideWorkspace: () => {},
                    handleExpand: () => {},
                    sideWorkspaceContext: SideWorkspaceContext.PINNED_RESPONSES
                }}>
                    <QueryStoryBoard />
                </ViewModeContextProvider>
            </RootContextProvider>
        );
        const tab = screen.getByText('Create Presentation');
        fireEvent.click(tab);
    });

    test('should handle view in chat correctly',  async () => {
        const query1 = {
            id: 572,
            input: 'sales across brands1',
            output: {
                type: 'sql',
                response: {
                    text: 'The sales data shows the total sales for each brand...',
                    sql_query: '\n## SQL Query\n\n```python\nif True:\n   print("Hello world")```\n\n',
                    widgets: [
                        {
                            name: 'dataTable',
                            type: 'dataTable',
                            title: 'sales across brands1',
                            value: {
                                data: { values: [['sodax']], columns: ['brand'] },
                                layout: {},
                            },
                        },
                    ],
                    processed_query: 'sales across brands1',
                },
            },
            window_id: 60,
            feedback: null,
        };

        const query2 = {
            id: 573,
            input: 'sales across brands2',
            output: {
                type: 'sql',
                response: {
                    text: 'The sales data shows the total sales for each brand...',
                    sql_query: '\n## SQL Query\n\n```python\nif True:\n   print("Hello world")```\n\n',
                    widgets: [
                        {
                            name: 'dataTable',
                            type: 'dataTable',
                            title: 'sales across brands2',
                            value: {
                                data: { values: [['sodax']], columns: ['brand'] },
                                layout: {},
                            },
                        },
                    ],
                    processed_query: 'sales across brands2',
                },
            },
            window_id: 60,
            feedback: null,
        };

        const jumptoQuery = jest.fn();
        queryService.eventTarget.addEventListener(QueryServiceEvents.JUMP_TO_QUERY, jumptoQuery);
        queryService.queries.value = [query1, query2];

        const dispatchEventMock = jest.spyOn(queryService.eventTarget, 'dispatchEvent');

        const { container } = render(
            <RootContextProvider value={{ mainService, queryService }}>
                <ViewModeContextProvider value={{
                    popper: false,
                    popperOpened: false,
                    popperExpanded: false,
                    variant: 'fullscreen-mini',
                    openSideWorkspace: true,
                    handleOpenSideWorkspace: () => { },
                    closeSideWorkspace: () => { },
                    sideWorkspaceContext: 0,
                    handleExpand: () => { },
                }}>
                    <QueryStoryBoard />
                </ViewModeContextProvider>
            </RootContextProvider>
        );

        queryService.eventTarget.dispatchEvent(QueryServiceEvents.JUMP_TO_QUERY, { detail: { id: 573 } });

        await waitFor(() => {
            expect(dispatchEventMock).toHaveBeenCalledWith(QueryServiceEvents.JUMP_TO_QUERY, expect.objectContaining({
                detail: expect.objectContaining({ id: 573 })
            }));
            expect(jumptoQuery).toHaveBeenCalledWith(expect.objectContaining({
                detail: expect.objectContaining({ id: 573 })
            }));
        }, { timeout: 250 });
    });

    test('should include all conversations on icon click and enable generate outline button when atleast one query is selected', () => {
        const query1 = {
            id: 572,
            input: 'sales across brands1',
            output: {
                type: 'sql',
                response: {
                    text: 'The sales data shows the total sales for each brand...',
                    sql_query: '\n## SQL Query\n\n```python\nif True:\n   print("Hello world")```\n\n',
                    widgets: [
                        {
                            name: 'dataTable',
                            type: 'dataTable',
                            title: 'sales across brands1',
                            value: {
                                data: { values: [['sodax']], columns: ['brand'] },
                                layout: {},
                            },
                        },
                    ],
                    processed_query: 'sales across brands1',
                },
            },
            window_id: 60,
            feedback: null,
            selected: false
        };

        const query2 = {
            id: 573,
            input: 'sales across brands2',
            output: {
                type: 'sql',
                response: {
                    text: 'The sales data shows the total sales for each brand...',
                    sql_query: '\n## SQL Query\n\n```python\nif True:\n   print("Hello world")```\n\n',
                    widgets: [
                        {
                            name: 'dataTable',
                            type: 'dataTable',
                            title: 'sales across brands2',
                            value: {
                                data: { values: [['sodax']], columns: ['brand'] },
                                layout: {},
                            },
                        },
                    ],
                    processed_query: 'sales across brands2',
                },
            },
            window_id: 60,
            feedback: null,
            selected: false
        };

        queryService.queries.value = [query1, query2];

        const { container } = render(
            <RootContextProvider value={{ mainService, queryService }}>
                <ViewModeContextProvider value={{
                    popper: false,
                    popperOpened: false,
                    popperExpanded: false,
                    variant: "fullscreen",
                    openSideWorkspace: false,
                    handleOpenSideWorkspace: () => {},
                    closeSideWorkspace: () => {},
                    handleExpand: () => {},
                    sideWorkspaceContext: SideWorkspaceContext.PINNED_RESPONSES
                }}>
                    <QueryStoryBoard />
                </ViewModeContextProvider>
            </RootContextProvider>
        );

        const includeAllIcon = container.querySelector('button > svg');
        fireEvent.click(includeAllIcon);

        expect(queryService.queries.value).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 572, selected: true }),
                expect.objectContaining({ id: 573, selected: true })
            ])
        );

        const generateOutlineButton = screen.getByRole('button', { name: /generate outline/i });
        expect(generateOutlineButton.hasAttribute('disabled')).toBe(false);
    });

    test('should not render Generate Outline button if no queries are selected', () => {
        const query1 = {
            id: 572,
            input: 'sales across brands1',
            output: {
                type: 'sql',
                response: {
                    text: 'The sales data shows the total sales for each brand...',
                    sql_query: '\n## SQL Query\n\n```python\nif True:\n   print("Hello world")```\n\n',
                    widgets: [
                        {
                            name: 'dataTable',
                            type: 'dataTable',
                            title: 'sales across brands1',
                            value: {
                                data: { values: [['sodax']], columns: ['brand'] },
                                layout: {},
                            },
                        },
                    ],
                    processed_query: 'sales across brands1',
                },
            },
            window_id: 60,
            feedback: null,
            selected: false
        };

        const query2 = {
            id: 573,
            input: 'sales across brands2',
            output: {
                type: 'sql',
                response: {
                    text: 'The sales data shows the total sales for each brand...',
                    sql_query: '\n## SQL Query\n\n```python\nif True:\n   print("Hello world")```\n\n',
                    widgets: [
                        {
                            name: 'dataTable',
                            type: 'dataTable',
                            title: 'sales across brands2',
                            value: {
                                data: { values: [['sodax']], columns: ['brand'] },
                                layout: {},
                            },
                        },
                    ],
                    processed_query: 'sales across brands2',
                },
            },
            window_id: 60,
            feedback: null,
            selected: false
        };

        queryService.queries.value = [query1, query2];

        const { container } = render(
            <RootContextProvider value={{ mainService, queryService }}>
                <ViewModeContextProvider value={{
                    popper: false,
                    popperOpened: false,
                    popperExpanded: false,
                    variant: "fullscreen",
                    openSideWorkspace: false,
                    handleOpenSideWorkspace: () => {},
                    closeSideWorkspace: () => {},
                    handleExpand: () => {},
                    sideWorkspaceContext: SideWorkspaceContext.PINNED_RESPONSES
                }}>
                    <QueryStoryBoard />
                </ViewModeContextProvider>
            </RootContextProvider>
        );

        const generateOutlineButton = screen.queryByRole('button', { name: /generate outline/i });
        expect(generateOutlineButton).toBeNull();
    });
});
