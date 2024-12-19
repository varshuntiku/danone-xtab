import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import GraphView from '../../../components/minerva/graphView.jsx';
import { getChartObject } from '../../../services/minerva';
import store from 'store/store';
import { Provider } from 'react-redux';
import { vi } from 'vitest';

vi.mock('../../../services/minerva', () => ({
    getChartObject: vi.fn()
}));

const mockLocalStorage = (function () {
    let store = {
        'create-stories-payload': [
            [
                '26',
                [
                    {
                        name: 'VOLUME OPPORTUNITY 2020',
                        description: '',
                        app_id: '26',
                        app_screen_id: 103,
                        app_screen_widget_id: 486,
                        graph_data: '',
                        filter_data: ''
                    }
                ]
            ]
        ]
    };

    return {
        getItem: function (key) {
            return JSON.stringify(store[key]) || null;
        },
        setItem: function (key, value) {
            store[key] = value.toString();
        },
        removeItem: function (key) {
            delete store[key];
        },
        clear: function () {
            store = {};
        }
    };
})();

const history = createMemoryHistory();

describe('Codex Product test', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage
        });
    });
    afterEach(cleanup);

    test('Should render layouts GraphView Component', () => {
        const props = {
            app_info: {
                id: 26,
                modules: {
                    minerva: {
                        tenant_id: 'cpg'
                    }
                }
            },
            deleteViz: () => {},
            handleStoriesCount: () => {},
            graphData: {
                chartObject: [{ name: 'bar', fig_object: null }],
                chartList: ['chart 1'],
                chart: {
                    chart_type: ['bar', 'pie', 'dataTable'],
                    combination: ['categorical', 'continuous'],
                    defaultChart: 'bar',
                    title: 'revenue across brands'
                },
                question: 'revenue across brands',
                selectedChart: 'bar',
                sqlQuery:
                    'SELECT sum(cpgmain.net_revenue) AS sum_net_revenue, cpgmain.brand \nFROM cpgmain GROUP BY cpgmain.brand ORDER BY sum(cpgmain.net_revenue) DESC'
            },
            tabId: 0
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <GraphView {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts GraphView Component 1', () => {
        const props = {
            app_info: {
                id: 26,
                modules: {
                    minerva: {
                        tenant_id: 'cpg'
                    }
                }
            },
            deleteViz: () => {},
            handleStoriesCount: () => {},
            graphData: {
                chartObject: [{ name: 'pie', fig_object: { layout: {} } }],
                chartList: ['chart 1'],
                chart: {
                    chart_type: ['bar', 'pie', 'dataTable'],
                    combination: ['categorical', 'continuous'],
                    defaultChart: 'bar',
                    title: 'revenue across brands'
                },
                question: 'revenue across brands',
                selectedChart: 'pie',
                sqlQuery:
                    'SELECT sum(cpgmain.net_revenue) AS sum_net_revenue, cpgmain.brand \nFROM cpgmain GROUP BY cpgmain.brand ORDER BY sum(cpgmain.net_revenue) DESC'
            },
            tabId: 0
        };
        getChartObject.mockImplementation(({ callback }) =>
            callback({
                data: [
                    {
                        marker: {
                            color: '#8A8AF28d',
                            line: { color: '#8A8AF2', width: 1.5 }
                        },
                        name: 'brand',
                        type: 'bar',
                        x: ['waterhut', 'drinksjet', 'icex', 'sodax', 'softella'],
                        y: [
                            642249869.8570938, 304865418.4946289, 236043426.3100586,
                            115761280.9508667, 33177264.272094727
                        ]
                    }
                ],
                layout: {
                    automargin: true,
                    autosize: true,
                    barmode: 'bar',
                    colorway: (9)[
                        ('#8A8AF2',
                        '#F5956B',
                        '#65D7C5',
                        '#F2D862',
                        '#5BBAE5',
                        '#BBE673',
                        '#de577b',
                        '#D3C6F7',
                        '#3C90A9')
                    ],
                    font: { family: 'Roboto', color: '#FFFFFF' },
                    hoverlabel: { font: { size: 17 } },
                    hovermode: 'closest',
                    legend: {
                        orientation: 'h',
                        title: {
                            font: { color: '#FFFFFF', family: 'Roboto' },
                            text: 'brand'
                        },
                        'traceorder ': 'normal',
                        valign: 'top',
                        x: 1,
                        xanchor: 'auto',
                        y: 1.1,
                        yanchor: 'auto'
                    },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    showlegend: true,
                    title: {
                        text: 'REVENUE ACROSS BRANDS',
                        font: { color: '#FFFFFF', family: 'Roboto' }
                    },
                    xaxis: {
                        title: { font: { color: '#FFFFFF', family: 'Roboto' }, text: 'BRAND' },
                        autorange: true,
                        showgrid: false,
                        gridwidth: 0.1
                    },
                    yaxis: {
                        title: {
                            font: { color: '#FFFFFF', family: 'Roboto' },
                            text: 'SUM_NET_REVENUE'
                        },
                        autorange: true,
                        gridwidth: 0.1,
                        showgrid: true,
                        gridcolor: '#213244'
                    }
                }
            })
        );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <GraphView {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByLabelText('chart-type'));
        fireEvent.click(screen.getByRole('presentation').firstChild);
        expect(screen.getByText('pie')).toBeInTheDocument();
        fireEvent.click(screen.getByText('pie'));
    });

    test('Should render layouts GraphView Component 2', async () => {
        const props = {
            app_info: {
                id: 26,
                modules: {
                    minerva: {
                        tenant_id: 'cpg'
                    }
                }
            },
            deleteViz: () => {},
            handleStoriesCount: () => {},
            graphData: {
                chartObject: [{ name: 'bar', fig_object: null }],
                chartList: ['chart 1'],
                chart: {
                    chart_type: ['bar', 'pie', 'dataTable'],
                    combination: ['categorical', 'continuous'],
                    defaultChart: 'bar',
                    title: 'revenue across brands'
                },
                question: 'revenue across brands',
                selectedChart: 'bar',
                sqlQuery:
                    'SELECT sum(cpgmain.net_revenue) AS sum_net_revenue, cpgmain.brand \nFROM cpgmain GROUP BY cpgmain.brand ORDER BY sum(cpgmain.net_revenue) DESC'
            },
            tabId: 0
        };
        getChartObject.mockImplementation(({ callback }) =>
            callback({
                data: [
                    {
                        marker: {
                            color: '#8A8AF28d',
                            line: { color: '#8A8AF2', width: 1.5 }
                        },
                        name: 'brand',
                        type: 'bar',
                        x: ['waterhut', 'drinksjet', 'icex', 'sodax', 'softella'],
                        y: [
                            642249869.8570938, 304865418.4946289, 236043426.3100586,
                            115761280.9508667, 33177264.272094727
                        ]
                    }
                ],
                layout: {
                    automargin: true,
                    autosize: true,
                    barmode: 'bar',
                    colorway: (9)[
                        ('#8A8AF2',
                        '#F5956B',
                        '#65D7C5',
                        '#F2D862',
                        '#5BBAE5',
                        '#BBE673',
                        '#de577b',
                        '#D3C6F7',
                        '#3C90A9')
                    ],
                    font: { family: 'Roboto', color: '#FFFFFF' },
                    hoverlabel: { font: { size: 17 } },
                    hovermode: 'closest',
                    legend: {
                        orientation: 'h',
                        title: {
                            font: { color: '#FFFFFF', family: 'Roboto' },
                            text: 'brand'
                        },
                        'traceorder ': 'normal',
                        valign: 'top',
                        x: 1,
                        xanchor: 'auto',
                        y: 1.1,
                        yanchor: 'auto'
                    },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    showlegend: true,
                    title: {
                        text: 'REVENUE ACROSS BRANDS',
                        font: { color: '#FFFFFF', family: 'Roboto' }
                    },
                    xaxis: {
                        title: { font: { color: '#FFFFFF', family: 'Roboto' }, text: 'BRAND' },
                        autorange: true,
                        showgrid: false,
                        gridwidth: 0.1
                    },
                    yaxis: {
                        title: {
                            font: { color: '#FFFFFF', family: 'Roboto' },
                            text: 'SUM_NET_REVENUE'
                        },
                        autorange: true,
                        gridwidth: 0.1,
                        showgrid: true,
                        gridcolor: '#213244'
                    }
                }
            })
        );
        const { getByText, debug, rerender } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <GraphView {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const props1 = {
            ...props,
            graphData: {
                chartObject: [{ name: 'bar', fig_object: null }],
                chart: {
                    chart_type: ['bar', 'pie', 'dataTable'],
                    combination: ['categorical', 'continuous'],
                    defaultChart: 'bar',
                    title: 'sales across brands'
                },
                chartList: ['chart 1'],
                question: 'sales across brands',
                selectedChart: 'bar',
                sqlQuery:
                    'SELECT sum(cpgmain.net_revenue) AS sum_net_revenue, cpgmain.brand \nFROM cpgmain GROUP BY cpgmain.brand ORDER BY sum(cpgmain.net_revenue) DESC'
            }
        };
        rerender(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <GraphView {...props1} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        //fireEvent.click(screen.getByLabelText('chart-type'))
        //expect(screen.getByRole('checkbox')).toBeInTheDocument()
    });
});
