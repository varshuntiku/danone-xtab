import { queries, render, screen } from '@testing-library/preact';
import QueryOutputItem from '../../../../src/component/queryOutput/queryOutputItem/QueryOutputItem';
import { StatusType } from '../../../../src/model/Query';
import RootContextProvider from '../../../../src/context/rootContext';
import MainService from '../../../../src/service/mainService';
import QueryService from '../../../../src/service/queryService';
import ViewModeContextProvider from '../../../../src/context/viewModeContext';
describe('QueryOutputItem test', () => {
    test('component should render', () => {
        const params = {
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
                                "data": {
                                    "values": [
                                        [
                                            "sodax",
                                            "icex",
                                            "drinksjet",
                                            "softella",
                                            "waterhut"
                                        ],
                                        [
                                            769336,
                                            1276128,
                                            3834760,
                                            180672,
                                            5738560
                                        ]
                                    ],
                                    "columns": [
                                        "brand",
                                        "total_sales"
                                    ]
                                },
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
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
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
                <QueryOutputItem query={params} />
            </ViewModeContextProvider>
        </RootContextProvider>);
        expect(container.textContent).toContain("sales across brands");
    });

    // test('component should render: skeleton', () => {
    //     const params = {
    //         "id": 572,
    //         "input": "sales across brands",
    //         "window_id": 60,
    //         "feedback": 1,
    //         "status": StatusType.pending
    //     }
    //     const mainService = new MainService();
    //     const queryService = new QueryService(mainService);
    //     const { container } = render(<RootContextProvider value={{mainService, queryService}}>
    //         <QueryOutputItem query={params} />
    //         </RootContextProvider>);
    //     expect(screen.getAllByLabelText("skeleton")).toBeTruthy();
    // });
    // test('component should render: skeleton: rejected status', () => {
    //     const params = {
    //         "id": 572,
    //         "input": "sales across brands",
    //         "window_id": 60,
    //         "feedback": 1,
    //         "status": StatusType.rejected
    //     }
    //     const mainService = new MainService();
    //     const queryService = new QueryService(mainService);
    //     const { container } = render(<RootContextProvider value={{mainService, queryService}}>
    //         <QueryOutputItem query={params} />
    //         </RootContextProvider>);
    //     expect(screen.queryByLabelText("skeleton")).toBeFalsy();
    // });
    test('component should render: chat popper view', () => {
        const params = {
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
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
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
                <QueryOutputItem query={params} chatPopperView={true} />
            </ViewModeContextProvider>
        </RootContextProvider>);
        expect(container.textContent).toContain("Open Visual Result");
    });

    test('component should render: progress_message', () => {
        const params = {
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
            "feedback": null,
            "status": StatusType.pending,
            "progress_message": "in progress"
        }
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
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
                <QueryOutputItem query={params} chatPopperView={true} />
            </ViewModeContextProvider>
        </RootContextProvider>);
        expect(container.textContent).toContain("in progress");
    });
    // test('component should render: progress_percentage', () => {
    //     const params = {
    //         "id": 572,
    //         "input": "sales across brands",
    //         "output": {
    //             "type": "sql",
    //             "response": {
    //                 "text": "The sales data shows the total sales for each brand. The highest sales were recorded by \"waterhut\" with 5.7 million, followed by \"drinksjet\" with 3.8 million. \"icex\" had sales of 1.3 million, while \"sodax\" and \"softella\" had lower sales of 769 thousand and 180 thousand respectively. Based on these numbers, the business should focus on promoting \"waterhut\" and \"drinksjet\" as they are the top-selling brands. Additionally, they could consider strategies to increase sales for \"sodax\" and \"softella\" to improve their performance.",
    //                 "widgets": [
    //                     {
    //                         "name": "dataTable",
    //                         "type": "dataTable",
    //                         "title": "sales across brands",
    //                         "value": {
    //                             "data": {"values": [["sodax"]],"columns": ["brand"]},
    //                             "layout": {}
    //                         }
    //                     }
    //                 ],
    //                 "processed_query": "sales across brands"
    //             }
    //         },
    //         "window_id": 60,
    //         "feedback": null,
    //         "status": StatusType.pending,
    //         "progress_message": "in progress",
    //         "progress_percentage": 30
    //     }
    //     const mainService = new MainService();
    //     const queryService = new QueryService(mainService);
    //     const { container } = render(<RootContextProvider value={{mainService, queryService}}>
    //         <QueryOutputItem query={params} />
    //         </RootContextProvider>);
    //     expect(container.textContent).toContain("30%");
    // });
    test('component should render: no sql_query', () => {
        const params = {
            "id": 572,
            "input": "sales across brands",
            "output": {
                "type": "sql",
                "response": {
                    "text": "The sales data shows the total sales for each brand. The highest sales were recorded by \"waterhut\" with 5.7 million, followed by \"drinksjet\" with 3.8 million. \"icex\" had sales of 1.3 million, while \"sodax\" and \"softella\" had lower sales of 769 thousand and 180 thousand respectively. Based on these numbers, the business should focus on promoting \"waterhut\" and \"drinksjet\" as they are the top-selling brands. Additionally, they could consider strategies to increase sales for \"sodax\" and \"softella\" to improve their performance.",
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
            "feedback": null,
            "status": StatusType.resolved,
        }
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
                    <QueryOutputItem query={params} />
                </ViewModeContextProvider>
            </RootContextProvider>);
        expect(screen.queryByTitle("help")).toBeFalsy();
    });

    test('component should render: no sql_query', () => {
        const params = {
            "id": 572,
            "input": "sales across brands",
            "output": {
                "type": "sql",
                "response": {
                    "text": "The sales data shows the total sales for each brand. The highest sales were recorded by \"waterhut\" with 5.7 million, followed by \"drinksjet\" with 3.8 million. \"icex\" had sales of 1.3 million, while \"sodax\" and \"softella\" had lower sales of 769 thousand and 180 thousand respectively. Based on these numbers, the business should focus on promoting \"waterhut\" and \"drinksjet\" as they are the top-selling brands. Additionally, they could consider strategies to increase sales for \"sodax\" and \"softella\" to improve their performance.",
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
            "feedback": null,
            "status": StatusType.resolved,
        }
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
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
                <QueryOutputItem query={params} />
            </ViewModeContextProvider>
        </RootContextProvider>);
        expect(screen.queryByTitle("help")).toBeFalsy();
    });
});
