import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ChatView from '../../../components/minerva/chatView.jsx';
import {
    getProcessedQuestion
    // getQueryMetadata,
    // getQueryRecommendations
} from '../../../services/minerva';
import { vi } from 'vitest';

vi.mock('../../../services/minerva', () => ({
    getProcessedQuestion: vi.fn()
    // getQueryMetadata: vi.fn(),
    // getQueryRecommendations: vi.fn()
}));

const history = createMemoryHistory();

describe('Codex Product test', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'speechSynthesis', {
            value: { pending: false, speaking: false, paused: false, onvoiceschanged: null }
        });
    });

    afterEach(cleanup);

    test('Should render layouts ChatView Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatView setVizMetaData={() => {}} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts ChatView 1 Component', async () => {
        const props = {
            app_info: {
                modules: {
                    minerva: {
                        tenant_id: 'cpg'
                    }
                }
            },
            parent: 'dashboard',
            setVizMetaData: () => {}
        };
        // getQueryMetadata.mockImplementation(({ callback }) =>
        //     callback(
        //         'revenue across brands',
        //         {
        //             final_str: {
        //                 groupby: [
        //                     {
        //                         end_index: 20,
        //                         func: null,
        //                         name: 'brand',
        //                         start_index: 15,
        //                         table: 'cpgmain'
        //                     }
        //                 ],
        //                 having: { filter: [], logic: 'and' },
        //                 limit: null,
        //                 orderby: [
        //                     {
        //                         end_index: 6,
        //                         func: 'sum',
        //                         name: 'net_revenue',
        //                         order: 'desc',
        //                         start_index: 0,
        //                         table: 'cpgmain'
        //                     }
        //                 ],
        //                 select: [
        //                     {
        //                         end_index: 6,
        //                         func: 'sum',
        //                         name: 'net_revenue',
        //                         order: 'desc',
        //                         start_index: 0,
        //                         table: 'cpgmain'
        //                     },
        //                     {
        //                         end_index: 20,
        //                         func: null,
        //                         name: 'brand',
        //                         start_index: 15,
        //                         table: 'cpgmain'
        //                     }
        //                 ],
        //                 where: {}
        //             },
        //             query: 'SELECT sum(cpgmain.net_revenue) AS sum_net_revenue, cpgmain.brand \nFROM cpgmain GROUP BY cpgmain.brand ORDER BY sum(cpgmain.net_revenue) DESC',
        //             question: 'revenue across brands',
        //             time_filter_str: {
        //                 groupby: [],
        //                 orderby: [],
        //                 select: [],
        //                 where: {}
        //             }
        //         },
        //         {
        //             chart: {
        //                 chart_type: ['bar', 'pie', 'dataTable'],
        //                 combination: ['categorical', 'continuous'],
        //                 defaultChart: 'bar',
        //                 title: 'revenue across brands'
        //             },
        //             sql_query:
        //                 'SELECT sum(cpgmain.net_revenue) AS sum_net_revenue, cpgmain.brand \nFROM cpgmain GROUP BY cpgmain.brand ORDER BY sum(cpgmain.net_revenue) DESC',
        //             summary: {
        //                 key: [
        //                     'Max value of sum_net_revenue occurs at:',
        //                     'Min value of sum_net_revenue occurs at:'
        //                 ],
        //                 value: ["['waterhut' '642.25M']", "['softella' '33.18M']"]
        //             },
        //             summaryTemplate:
        //                 "Maximum value of net revenue occurs at: 'waterhut 642.25M'. Minimum value of net revenue occurs at: 'softella 33.18M'."
        //         }
        //     )
        // );
        getProcessedQuestion.mockImplementation(({ callback }) =>
            callback('revenue across brands', {
                output: {
                    response: {
                        text: 'text'
                    }
                },
                final_str: {
                    groupby: [
                        {
                            end_index: 20,
                            func: null,
                            name: 'brand',
                            start_index: 15,
                            table: 'cpgmain'
                        }
                    ],
                    having: { filter: [], logic: 'and' },
                    limit: null,
                    orderby: [
                        {
                            end_index: 6,
                            func: 'sum',
                            name: 'net_revenue',
                            order: 'desc',
                            start_index: 0,
                            table: 'cpgmain'
                        }
                    ],
                    select: [
                        {
                            end_index: 6,
                            func: 'sum',
                            name: 'net_revenue',
                            order: 'desc',
                            start_index: 0,
                            table: 'cpgmain'
                        },
                        {
                            end_index: 20,
                            func: null,
                            name: 'brand',
                            start_index: 15,
                            table: 'cpgmain'
                        }
                    ],
                    where: {}
                },
                query: 'SELECT sum(cpgmain.net_revenue) AS sum_net_revenue, cpgmain.brand \nFROM cpgmain GROUP BY cpgmain.brand ORDER BY sum(cpgmain.net_revenue) DESC',
                question: 'revenue across brands',
                time_filter_str: {
                    groupby: [],
                    orderby: [],
                    select: [],
                    where: {}
                }
            })
        );
        // getQueryRecommendations.mockImplementation(({ callback }) =>
        //     callback(['revenue across channel for softella', 'revenue across channel for waterhut'])
        // );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatView {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.change(screen.getByTestId('query'), {
            target: { value: 'revenue across brands' }
        });
        fireEvent.keyDown(screen.getByTestId('query'), { keyCode: 13 });
    });

    test('Should render layouts ChatView 2 Component', async () => {
        const props = {
            app_info: {
                modules: {
                    minerva: {
                        tenant_id: 'cpg'
                    }
                }
            },
            parent: 'dashboard',
            setVizMetaData: () => {}
        };
        getProcessedQuestion.mockImplementation(({ failureCallback }) => failureCallback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatView {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.change(screen.getByTestId('query'), {
            target: { value: 'revenue across brands' }
        });
        // fireEvent.click(screen.getByLabelText('send-query'))
    });

    test('Should render layouts ChatView 3 Component', async () => {
        const props = {
            app_info: {
                modules: {
                    minerva: {
                        tenant_id: 'cpg'
                    }
                }
            },
            parent: 'dashboard',
            setVizMetaData: () => {}
        };
        // getQueryMetadata.mockImplementation(({ callback }) =>
        //     callback(
        //         'revenue across brands',
        //         {
        //             final_str: {
        //                 groupby: [
        //                     {
        //                         end_index: 20,
        //                         func: null,
        //                         name: 'brand',
        //                         start_index: 15,
        //                         table: 'cpgmain'
        //                     }
        //                 ],
        //                 having: { filter: [], logic: 'and' },
        //                 limit: null,
        //                 orderby: [
        //                     {
        //                         end_index: 6,
        //                         func: 'sum',
        //                         name: 'net_revenue',
        //                         order: 'desc',
        //                         start_index: 0,
        //                         table: 'cpgmain'
        //                     }
        //                 ],
        //                 select: [
        //                     {
        //                         end_index: 6,
        //                         func: 'sum',
        //                         name: 'net_revenue',
        //                         order: 'desc',
        //                         start_index: 0,
        //                         table: 'cpgmain'
        //                     },
        //                     {
        //                         end_index: 20,
        //                         func: null,
        //                         name: 'brand',
        //                         start_index: 15,
        //                         table: 'cpgmain'
        //                     }
        //                 ],
        //                 where: {}
        //             },
        //             query: 'SELECT sum(cpgmain.net_revenue) AS sum_net_revenue, cpgmain.brand \nFROM cpgmain GROUP BY cpgmain.brand ORDER BY sum(cpgmain.net_revenue) DESC',
        //             question: 'revenue across brands',
        //             time_filter_str: {
        //                 groupby: [],
        //                 orderby: [],
        //                 select: [],
        //                 where: {}
        //             }
        //         },
        //         {
        //             chart: {
        //                 chart_type: ['bar', 'pie', 'dataTable'],
        //                 combination: ['categorical', 'continuous'],
        //                 defaultChart: 'bar',
        //                 title: 'revenue across brands'
        //             },
        //             sql_query:
        //                 'SELECT sum(cpgmain.net_revenue) AS sum_net_revenue, cpgmain.brand \nFROM cpgmain GROUP BY cpgmain.brand ORDER BY sum(cpgmain.net_revenue) DESC',
        //             summary: {
        //                 key: [
        //                     'Max value of sum_net_revenue occurs at:',
        //                     'Min value of sum_net_revenue occurs at:'
        //                 ],
        //                 value: ["['waterhut' '642.25M']", "['softella' '33.18M']"]
        //             },
        //             summaryTemplate:
        //                 "Maximum value of net revenue occurs at: 'waterhut 642.25M'. Minimum value of net revenue occurs at: 'softella 33.18M'."
        //         }
        //     )
        // );
        getProcessedQuestion.mockImplementation(({ callback }) =>
            callback('revenue across brands', {
                output: {
                    response: {
                        text: 'text'
                    }
                },
                final_str: {
                    groupby: [
                        {
                            end_index: 20,
                            func: null,
                            name: 'brand',
                            start_index: 15,
                            table: 'cpgmain'
                        }
                    ],
                    having: { filter: [], logic: 'and' },
                    limit: null,
                    orderby: [
                        {
                            end_index: 6,
                            func: 'sum',
                            name: 'net_revenue',
                            order: 'desc',
                            start_index: 0,
                            table: 'cpgmain'
                        }
                    ],
                    select: [
                        {
                            end_index: 6,
                            func: 'sum',
                            name: 'net_revenue',
                            order: 'desc',
                            start_index: 0,
                            table: 'cpgmain'
                        },
                        {
                            end_index: 20,
                            func: null,
                            name: 'brand',
                            start_index: 15,
                            table: 'cpgmain'
                        }
                    ],
                    where: {}
                },
                query: 'SELECT sum(cpgmain.net_revenue) AS sum_net_revenue, cpgmain.brand \nFROM cpgmain GROUP BY cpgmain.brand ORDER BY sum(cpgmain.net_revenue) DESC',
                question: 'revenue across brands',
                time_filter_str: {
                    groupby: [],
                    orderby: [],
                    select: [],
                    where: {}
                }
            })
        );
        // getQueryRecommendations.mockImplementation(({ callback }) =>
        //     callback(['revenue across channel for softella', 'revenue across channel for waterhut'])
        // );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatView {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.change(screen.getByTestId('query'), {
            target: { value: 'revenue across brands' }
        });
        fireEvent.keyDown(screen.getByTestId('query'), { keyCode: 13 });
    });

    test('Should render layouts ChatView 4 Component', async () => {
        const props = {
            app_info: {
                modules: {
                    minerva: {
                        tenant_id: 'cpg'
                    }
                }
            },
            parent: 'chatBot',
            setVizMetaData: () => {},
            setMessageList: () => {}
        };
        // getQueryMetadata.mockImplementation(({ callback }) =>
        //     callback(
        //         'revenue across brands',
        //         {
        //             final_str: {
        //                 groupby: [
        //                     {
        //                         end_index: 20,
        //                         func: null,
        //                         name: 'brand',
        //                         start_index: 15,
        //                         table: 'cpgmain'
        //                     }
        //                 ],
        //                 having: { filter: [], logic: 'and' },
        //                 limit: null,
        //                 orderby: [
        //                     {
        //                         end_index: 6,
        //                         func: 'sum',
        //                         name: 'net_revenue',
        //                         order: 'desc',
        //                         start_index: 0,
        //                         table: 'cpgmain'
        //                     }
        //                 ],
        //                 select: [
        //                     {
        //                         end_index: 6,
        //                         func: 'sum',
        //                         name: 'net_revenue',
        //                         order: 'desc',
        //                         start_index: 0,
        //                         table: 'cpgmain'
        //                     },
        //                     {
        //                         end_index: 20,
        //                         func: null,
        //                         name: 'brand',
        //                         start_index: 15,
        //                         table: 'cpgmain'
        //                     }
        //                 ],
        //                 where: {}
        //             },
        //             query: 'SELECT sum(cpgmain.net_revenue) AS sum_net_revenue, cpgmain.brand \nFROM cpgmain GROUP BY cpgmain.brand ORDER BY sum(cpgmain.net_revenue) DESC',
        //             question: 'revenue across brands',
        //             time_filter_str: {
        //                 groupby: [],
        //                 orderby: [],
        //                 select: [],
        //                 where: {}
        //             }
        //         },
        //         {
        //             chart: {
        //                 chart_type: ['bar', 'pie', 'dataTable'],
        //                 combination: ['categorical', 'continuous'],
        //                 defaultChart: 'bar',
        //                 title: 'revenue across brands'
        //             },
        //             sql_query:
        //                 'SELECT sum(cpgmain.net_revenue) AS sum_net_revenue, cpgmain.brand \nFROM cpgmain GROUP BY cpgmain.brand ORDER BY sum(cpgmain.net_revenue) DESC',
        //             summary: {
        //                 key: [
        //                     'Max value of sum_net_revenue occurs at:',
        //                     'Min value of sum_net_revenue occurs at:'
        //                 ],
        //                 value: ["['waterhut' '642.25M']", "['softella' '33.18M']"]
        //             },
        //             summaryTemplate:
        //                 "Maximum value of net revenue occurs at: 'waterhut 642.25M'. Minimum value of net revenue occurs at: 'softella 33.18M'."
        //         }
        //     )
        // );
        getProcessedQuestion.mockImplementation(({ callback }) =>
            callback('revenue across brands', {
                output: {
                    response: {
                        text: 'text'
                    }
                },
                final_str: {
                    groupby: [
                        {
                            end_index: 20,
                            func: null,
                            name: 'brand',
                            start_index: 15,
                            table: 'cpgmain'
                        }
                    ],
                    having: { filter: [], logic: 'and' },
                    limit: null,
                    orderby: [
                        {
                            end_index: 6,
                            func: 'sum',
                            name: 'net_revenue',
                            order: 'desc',
                            start_index: 0,
                            table: 'cpgmain'
                        }
                    ],
                    select: [
                        {
                            end_index: 6,
                            func: 'sum',
                            name: 'net_revenue',
                            order: 'desc',
                            start_index: 0,
                            table: 'cpgmain'
                        },
                        {
                            end_index: 20,
                            func: null,
                            name: 'brand',
                            start_index: 15,
                            table: 'cpgmain'
                        }
                    ],
                    where: {}
                },
                query: 'SELECT sum(cpgmain.net_revenue) AS sum_net_revenue, cpgmain.brand \nFROM cpgmain GROUP BY cpgmain.brand ORDER BY sum(cpgmain.net_revenue) DESC',
                question: 'revenue across brands',
                time_filter_str: {
                    groupby: [],
                    orderby: [],
                    select: [],
                    where: {}
                }
            })
        );
        // getQueryRecommendations.mockImplementation(({ callback }) =>
        //     callback(['revenue across channel for softella', 'revenue across channel for waterhut'])
        // );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatView {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts ChatView 5 Component', async () => {
        const props = {
            app_info: {
                modules: {
                    minerva: {
                        tenant_id: 'cpg'
                    }
                }
            },
            parent: 'dashboard',
            setVizMetaData: () => {}
        };
        // getQueryMetadata.mockImplementation(({ callback }) =>
        //     callback(
        //         'revenue across brands',
        //         {
        //             final_str: {
        //                 groupby: [
        //                     {
        //                         end_index: 20,
        //                         func: null,
        //                         name: 'brand',
        //                         start_index: 15,
        //                         table: 'cpgmain'
        //                     }
        //                 ],
        //                 having: { filter: [], logic: 'and' },
        //                 limit: null,
        //                 orderby: [
        //                     {
        //                         end_index: 6,
        //                         func: 'sum',
        //                         name: 'net_revenue',
        //                         order: 'desc',
        //                         start_index: 0,
        //                         table: 'cpgmain'
        //                     }
        //                 ],
        //                 select: [
        //                     {
        //                         end_index: 6,
        //                         func: 'sum',
        //                         name: 'net_revenue',
        //                         order: 'desc',
        //                         start_index: 0,
        //                         table: 'cpgmain'
        //                     },
        //                     {
        //                         end_index: 20,
        //                         func: null,
        //                         name: 'brand',
        //                         start_index: 15,
        //                         table: 'cpgmain'
        //                     }
        //                 ],
        //                 where: {}
        //             },
        //             query: 'SELECT sum(cpgmain.net_revenue) AS sum_net_revenue, cpgmain.brand \nFROM cpgmain GROUP BY cpgmain.brand ORDER BY sum(cpgmain.net_revenue) DESC',
        //             question: 'revenue across brands',
        //             time_filter_str: {
        //                 groupby: [],
        //                 orderby: [],
        //                 select: [],
        //                 where: {}
        //             }
        //         },
        //         {
        //             chart: {
        //                 chart_type: ['bar', 'pie', 'dataTable'],
        //                 combination: ['categorical', 'continuous'],
        //                 defaultChart: 'bar',
        //                 title: 'revenue across brands'
        //             },
        //             sql_query:
        //                 'SELECT sum(cpgmain.net_revenue) AS sum_net_revenue, cpgmain.brand \nFROM cpgmain GROUP BY cpgmain.brand ORDER BY sum(cpgmain.net_revenue) DESC',
        //             summary: {
        //                 key: [
        //                     'Max value of sum_net_revenue occurs at:',
        //                     'Min value of sum_net_revenue occurs at:'
        //                 ],
        //                 value: ["['waterhut' '642.25M']", "['softella' '33.18M']"]
        //             },
        //             summaryTemplate:
        //                 "Maximum value of net revenue occurs at: 'waterhut 642.25M'. Minimum value of net revenue occurs at: 'softella 33.18M'."
        //         }
        //     )
        // );
        getProcessedQuestion.mockImplementation(({ callback }) =>
            callback('revenue across brands', {
                output: {
                    response: {
                        text: 'text'
                    }
                },
                final_str: {
                    groupby: [
                        {
                            end_index: 20,
                            func: null,
                            name: 'brand',
                            start_index: 15,
                            table: 'cpgmain'
                        }
                    ],
                    having: { filter: [], logic: 'and' },
                    limit: null,
                    orderby: [
                        {
                            end_index: 6,
                            func: 'sum',
                            name: 'net_revenue',
                            order: 'desc',
                            start_index: 0,
                            table: 'cpgmain'
                        }
                    ],
                    select: [
                        {
                            end_index: 6,
                            func: 'sum',
                            name: 'net_revenue',
                            order: 'desc',
                            start_index: 0,
                            table: 'cpgmain'
                        },
                        {
                            end_index: 20,
                            func: null,
                            name: 'brand',
                            start_index: 15,
                            table: 'cpgmain'
                        }
                    ],
                    where: {}
                },
                query: 'SELECT sum(cpgmain.net_revenue) AS sum_net_revenue, cpgmain.brand \nFROM cpgmain GROUP BY cpgmain.brand ORDER BY sum(cpgmain.net_revenue) DESC',
                question: 'revenue across brands',
                time_filter_str: {
                    groupby: [],
                    orderby: [],
                    select: [],
                    where: {}
                }
            })
        );

        // getQueryRecommendations.mockImplementation(({ callback }) =>
        //     callback(['revenue across channel for softella', 'revenue across channel for waterhut'])
        // );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ChatView history={history} {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.click(screen.getByLabelText('ArrowBackIos'));
    });
});
