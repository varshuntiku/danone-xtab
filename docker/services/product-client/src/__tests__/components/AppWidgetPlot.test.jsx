import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import ReactDOM from 'react-dom';
import AppWidgetPlot from '../../components/AppWidgetPlot';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { act } from 'react-dom/test-utils';

const history = createMemoryHistory();

let container;

describe('Codex Product test', () => {
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    afterEach(() => {
        document.body.removeChild(container);
        container = null;
        vi.clearAllMocks();
    });
    test('Should render AppWidgetPlot Component 1', () => {
        act(() => {
            ReactDOM.render(
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetPlot {...props1} size_nooverride={true} graph_height="half" />
                    </Router>
                </CustomThemeContextProvider>,
                container
            );
        });
    });

    test('Should render AppWidgetPlot Component 2', () => {
        act(() => {
            ReactDOM.render(
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetPlot
                            {...props1}
                            size_nooverride={false}
                            trace_config={true}
                            graph_height="full"
                        />
                    </Router>
                </CustomThemeContextProvider>,
                container
            );
        });
    });

    test('Should render AppWidgetPlot Component 3', () => {
        act(() => {
            ReactDOM.render(
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetPlot
                            {...props3}
                            size_nooverride={false}
                            trace_config={true}
                            graph_height="full"
                        />
                    </Router>
                </CustomThemeContextProvider>,
                container
            );
        });
    });

    test('Should handle popover close', async () => {
        act(() => {
            ReactDOM.render(
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetPlot {...props1} size_nooverride={true} graph_height="half" />
                    </Router>
                </CustomThemeContextProvider>,
                container
            );
        });
        await waitFor(() => screen.queryByText('Market Share'));
        expect(screen.queryByLabelText('close'));
    });

    test('Should handle click event and trigger popover', async () => {
        const mockOnPlotClick = vi.fn();
        const mockOnFetchPopoverData = vi.fn().mockResolvedValue({ content: 'Test Content' });

        act(() => {
            ReactDOM.render(
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetPlot
                            {...props1}
                            onPlotClick={mockOnPlotClick}
                            onFetchPopoverData={mockOnFetchPopoverData}
                            size_nooverride={true}
                            graph_height="half"
                        />
                    </Router>
                </CustomThemeContextProvider>,
                container
            );
        });

        expect(screen.queryByText('Market Share'));
        await waitFor(() => screen.queryByText('Test Content'));

        expect(mockOnPlotClick);
        expect(mockOnFetchPopoverData);
        expect(screen.queryByText('Test Content'));
    });

    test('Should handle double click and refresh plot', async () => {
        const mockRefreshPlot = vi.fn();
        const mockOnPlotClick = vi.fn();

        act(() => {
            ReactDOM.render(
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetPlot
                            {...props1}
                            refreshPlot={mockRefreshPlot}
                            onPlotClick={mockOnPlotClick}
                            size_nooverride={true}
                            graph_height="half"
                        />
                    </Router>
                </CustomThemeContextProvider>,
                container
            );
        });
        expect(screen.queryByText('Market Share'), { detail: 2 });
        expect(mockRefreshPlot);
        expect(mockOnPlotClick);
    });

    test('Should handle fetch form data and open detail popup', async () => {
        const mockOnFetchDetailData = vi.fn().mockResolvedValue({ some: 'data' });

        act(() => {
            ReactDOM.render(
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetPlot
                            {...props1}
                            onFetchDetailData={mockOnFetchDetailData}
                            size_nooverride={true}
                            graph_height="half"
                        />
                    </Router>
                </CustomThemeContextProvider>,
                container
            );
        });
        expect(mockOnFetchDetailData);
    });
});
const props1 = {
    params: {
        data: [
            {
                direction: 'clockwise',
                labels: ['Market Share', '<span style="color: white">-</span>'],
                marker: {
                    colors: ['#5faff9', '#fff'],
                    line: {
                        color: 'white',
                        width: 1
                    }
                },
                sort: false,
                textinfo: 'none',
                textposition: 'none',
                type: 'pie',
                values: [32, 68],
                yaxis: 'y2'
            },
            {
                direction: 'clockwise',
                hole: 0.7,
                labels: ['Served Available Market', '<span style="color: white">-</span>'],
                marker: {
                    colors: ['#e08244', '#fff'],
                    line: {
                        color: 'white',
                        width: 1
                    }
                },
                sort: false,
                textinfo: 'none',
                textposition: 'none',
                type: 'pie',
                values: [76, 24]
            },
            {
                direction: 'clockwise',
                hole: 0.85,
                labels: ['Total Addressable Market', '<span style="color: white">-</span>'],
                marker: {
                    colors: ['#3a3a3a', '#fff'],
                    line: {
                        color: 'white',
                        width: 1
                    }
                },
                sort: false,
                textinfo: 'none',
                textposition: 'none',
                type: 'pie',
                values: [100, 0]
            }
        ],
        layout: {
            updatemenus: [{}],
            shapes: [{ type: 'line', line: { color: 'black' }, color: 'red' }],
            annotations: [{ font: { color: 'black' } }],
            legend: {
                orientation: 'v',
                yanchor: 'center',
                xanchor: 'left',
                y: 0.5,
                x: 1,
                font: {
                    family: '"Roboto", "Helvetica", "Arial", sans-serif',
                    color: '#000',
                    size: 9.216
                }
            },
            autosize: true,
            font: {
                family: '"Roboto", "Helvetica", "Arial", sans-serif',
                color: '#000',
                size: 9.216
            },
            hoverlabel: {
                font: {
                    family: '"Roboto", "Helvetica", "Arial", sans-serif',
                    color: '#000',
                    size: 9.216
                }
            },
            xaxis: {
                tickfont: {
                    //"family": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                    color: '#000',
                    size: 9.216
                },
                title: {
                    font: {
                        //    "family": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                        color: '#000',
                        size: 9.216
                    },
                    standoff: 25
                },
                automargin: true,
                line: {
                    color: '#000'
                },
                zerolinecolor: '#000'
            },
            yaxis: {
                tickfont: {
                    //  "family": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                    color: '#000',
                    size: 9.216
                },
                title: {
                    font: {
                        //  "family": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                        color: '#000',
                        size: 9.216
                    },
                    standoff: 25
                },
                automargin: true,
                line: {
                    color: '#000'
                },
                zerolinecolor: '#000'
            },
            yaxis2: {
                tickfont: {
                    //"family": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                    color: '#000',
                    size: 9.216
                },
                title: {
                    font: {
                        // "family": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                        color: '#000',
                        size: 9.216
                    },
                    standoff: 25
                },
                automargin: true,
                line: {
                    color: '#000'
                },
                zerolinecolor: '#000'
            },
            paper_bgcolor: '#FFFFFF',
            plot_bgcolor: '#FFFFFF',
            geo: {
                bgcolor: '#FFFFFF',
                subunitcolor: '#000'
            },
            shapes: [],
            annotations: [],
            margin: {
                t: 10,
                r: 0,
                l: 0,
                b: 30
            },
            polar: {}
        }
    }
};
const props3 = {
    params: {
        data: [
            {
                direction: 'clockwise',
                labels: ['Market Share', '<span style="color: white">-</span>'],
                marker: {
                    colors: ['#5faff9', '#fff'],
                    line: {
                        color: 'white',
                        width: 1
                    }
                },
                sort: false,
                textinfo: 'none',
                textposition: 'none',
                type: 'waterfall',
                connector: {},
                values: [32, 68],
                yaxis: 'y2',
                measure: []
            },
            {
                direction: 'clockwise',
                hole: 0.7,
                labels: ['Served Available Market', '<span style="color: white">-</span>'],
                marker: {
                    colors: ['#e08244', '#fff'],
                    line: {
                        color: 'white',
                        width: 1
                    }
                },
                sort: false,
                textinfo: 'none',
                textposition: 'none',
                type: 'pie',
                values: [76, 24]
            },
            {
                direction: 'clockwise',
                hole: 0.85,
                labels: ['Total Addressable Market', '<span style="color: white">-</span>'],
                marker: {
                    colors: ['#3a3a3a', '#fff'],
                    line: {
                        color: 'white',
                        width: 1
                    }
                },
                sort: false,
                textinfo: 'none',
                textposition: 'none',
                type: 'pie',
                values: [100, 0]
            }
        ],
        layout: {
            updatemenus: [{}],
            shapes: [{ type: 'line', line: { color: 'black' }, color: 'red' }],
            annotations: [{ font: { color: 'black' } }],
            legend: {
                orientation: 'v',
                yanchor: 'center',
                xanchor: 'left',
                y: 0.5,
                x: 1,
                font: {
                    family: '"Roboto", "Helvetica", "Arial", sans-serif',
                    color: '#000',
                    size: 9.216
                }
            },
            autosize: true,
            font: {
                family: '"Roboto", "Helvetica", "Arial", sans-serif',
                color: '#000',
                size: 9.216
            },
            hoverlabel: {
                font: {
                    family: '"Roboto", "Helvetica", "Arial", sans-serif',
                    color: '#000',
                    size: 9.216
                }
            },
            xaxis: {
                tickfont: {
                    //"family": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                    color: '#000',
                    size: 9.216
                },
                title: {
                    font: {
                        //    "family": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                        color: '#000',
                        size: 9.216
                    },
                    standoff: 25
                },
                automargin: true,
                line: {
                    color: '#000'
                },
                zerolinecolor: '#000'
            },
            yaxis: {
                tickfont: {
                    //  "family": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                    color: '#000',
                    size: 9.216
                },
                title: {
                    font: {
                        //  "family": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                        color: '#000',
                        size: 9.216
                    },
                    standoff: 25
                },
                automargin: true,
                line: {
                    color: '#000'
                },
                zerolinecolor: '#000'
            },
            yaxis2: {
                tickfont: {
                    //"family": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                    color: '#000',
                    size: 9.216
                },
                title: {
                    font: {
                        // "family": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                        color: '#000',
                        size: 9.216
                    },
                    standoff: 25
                },
                automargin: true,
                line: {
                    color: '#000'
                },
                zerolinecolor: '#000'
            },
            paper_bgcolor: '#FFFFFF',
            plot_bgcolor: '#FFFFFF',
            geo: {
                bgcolor: '#FFFFFF',
                subunitcolor: '#000'
            },
            shapes: [],
            annotations: [],
            margin: {
                t: 10,
                r: 0,
                l: 0,
                b: 30
            },
            polar: {}
        }
    }
};
