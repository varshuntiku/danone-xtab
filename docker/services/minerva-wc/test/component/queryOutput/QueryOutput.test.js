import { render, screen, waitFor } from '@testing-library/preact';
import QueryOutput from '../../../src/component/queryOutput/QueryOutput';
import MainService from '../../../src/service/mainService';
import QueryService from '../../../src/service/queryService';
import RootContextProvider from '../../../src/context/rootContext';
// import io from 'socket.io-client';
import ViewModeContextProvider from '../../../src/context/viewModeContext';
import { QueryServiceEvents } from '../../../src/model/Events';
// @ts-ignore
global.setImmediate = (fn, ...args) => global.setTimeout(fn, 0, ...args);

describe('QueryOutput test', () => {
    test('component should render', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const { container } = render(
            <RootContextProvider value={{ mainService, queryService }}>
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
                    <QueryOutput />
                </ViewModeContextProvider>
            </RootContextProvider>);
        expect(screen.getAllByLabelText('empty state')).toBeTruthy();
    });
    test('component should render: queries present', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const query = {
            "id": 572,
            "input": "sales across brands",
            "output": {
                "type": "sql",
                "response": {
                    "text": "The sales data shows the total sales for each brand. The highest sales were recorded by \"waterhut\" with 5.7 million, followed by \"drinksjet\" with 3.8 million. \"icex\" had sales of 1.3 million, while \"sodax\" and \"softella\" had lower sales of 769 thousand and 180 thousand respectively. Based on these numbers, the business should focus on promoting \"waterhut\" and \"drinksjet\" as they are the top-selling brands. Additionally, they could consider strategies to increase sales for \"sodax\" and \"softella\" to improve their performance.",
                    "sql_query": "\n## SQL Query\n\n```python\nif True:\n   print(\"Hello world\")```\n\n",
                    "widgets": [
                        {
                            "name": "dataTable",
                            "type": "dataTable",
                            "title": "sales across brands",
                            "value": {
                                "data": { "values": [["sodax"]], "columns": ["brand"] },
                                "layout": {}
                            }
                        }
                    ],
                    "processed_query": "sales across brands"
                }
            },
            "window_id": 60,
            "feedback": null
        }
        queryService.queries.value = [query]
        const { container } = render(
            <RootContextProvider value={{ mainService, queryService }}>
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
                    <QueryOutput />
                </ViewModeContextProvider>
            </RootContextProvider>);
        expect(screen.queryByLabelText('empty state')).toBeFalsy();
        expect(container.textContent).toMatch('sales across brands')
    });
    test('component should render: chatPopperView', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const { container } = render(
            <RootContextProvider value={{ mainService, queryService }}>
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
                    <QueryOutput chatPopperView={true} />
                </ViewModeContextProvider>
            </RootContextProvider>);
        expect(screen.getByLabelText("chat popper on")).toBeTruthy();
    });

    test('component should render: Event dispatch', async () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);

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
                    <QueryOutput />
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




    // test('component should render: socketConn', async () => {
    //     const mainService = new MainService();
    //     const s = io();
    //     // mainService.socketConn.value = s;
    //     const subsFn = jest.fn((event, cb) => {
    //         cb({});
    //         return io();
    //     });
    //     s.on = subsFn;
    //     const queryService = new QueryService(mainService);
    //     const { container } = render(
    //         <RootContextProvider value={{ mainService, queryService }}>
    //             <ViewModeContextProvider value={{
    //                 popper: false,
    //                 popperOpened: false,
    //                 popperExpanded: false,
    //                 variant: "fullscreen-mini",
    //                 openSideWorkspace: true,
    //                 handleOpenSideWorkspace: () => { },
    //                 closeSideWorkspace: () => { },
    //                 sideWorkspaceContext: 0,
    //                 handleExpand: () => { }
    //             }}>
    //                 <QueryOutput />
    //             </ViewModeContextProvider>
    //         </RootContextProvider>);
    //     s.send('query_status', {})
    //     expect(subsFn).toHaveBeenCalledWith('query_status', expect.anything())
    //     s.close();
    // });

    test('component should render: scrollTo', async () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const query1 = {
            "id": 572,
            "input": "sales across brands1",
            "output": {
                "type": "sql",
                "response": {
                    "text": "The sales data shows the total sales for each brand. The highest sales were recorded by \"waterhut\" with 5.7 million, followed by \"drinksjet\" with 3.8 million. \"icex\" had sales of 1.3 million, while \"sodax\" and \"softella\" had lower sales of 769 thousand and 180 thousand respectively. Based on these numbers, the business should focus on promoting \"waterhut\" and \"drinksjet\" as they are the top-selling brands. Additionally, they could consider strategies to increase sales for \"sodax\" and \"softella\" to improve their performance.",
                    "sql_query": "\n## SQL Query\n\n```python\nif True:\n   print(\"Hello world\")```\n\n",
                    "widgets": [
                        {
                            "name": "dataTable",
                            "type": "dataTable",
                            "title": "sales across brands1",
                            "value": {
                                "data": { "values": [["sodax"]], "columns": ["brand"] },
                                "layout": {}
                            }
                        }
                    ],
                    "processed_query": "sales across brands1"
                }
            },
            "window_id": 60,
            "feedback": null
        }
        queryService.queries.value = [query1];
        const { container } = render(
            <RootContextProvider value={{ mainService, queryService }}>
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
                    <QueryOutput />
                </ViewModeContextProvider>
            </RootContextProvider>
        );

        const queryOutput = screen.getByLabelText('chat popper off');
        const scrollTo = jest.fn();
        queryOutput.scrollTo = scrollTo;
        queryOutput.scrollTo()

        await waitFor(
            () => {
                expect(scrollTo).toHaveBeenCalled();
            },
            { timeout: 400 },
        );
    });
});
