import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AppWidgetAssumptions from '../../components/AppWidgetAssumptions';
import CustomThemeContextProvider from '../../themes/customThemeContext';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render AppScreen Component', () => {
        const props = {
            large: true,
            params: {
                assumptions: {
                    data: [
                        {
                            direction: 'clockwise',
                            hole: 0.55,
                            labels: 'Array[2]',
                            marker: 'Object',
                            sort: false,
                            textinfo: 'none',
                            textposition: 'none',
                            type: 'pie',
                            values: 'Array[2]'
                        },
                        {
                            direction: 'clockwise',
                            hole: 0.7,
                            labels: 'Array[2]',
                            marker: 'Object',
                            sort: false,
                            textinfo: 'none',
                            textposition: 'none',
                            type: 'pie',
                            values: 'Array[2]'
                        },
                        {
                            direction: 'clockwise',
                            hole: 0.85,
                            labels: 'Array[2]',
                            marker: 'Object',
                            sort: false,
                            textinfo: 'none',
                            textposition: 'none',
                            type: 'pie',
                            values: 'Array[2]'
                        }
                    ],
                    layout: {
                        legend: {
                            orientation: 'v',
                            yanchor: 'center',
                            xanchor: 'left',
                            y: 0.5,
                            x: 1,
                            font: 'Object'
                        },
                        autosize: true,
                        font: {
                            family: '"Roboto", "Helvetica", "Arial", sans-serif',
                            color: '#000',
                            size: 9.216
                        },
                        hoverlabel: { font: 'Object' },
                        xaxis: {
                            tickfont: 'Object',
                            title: 'Object',
                            automargin: true,
                            line: 'Object',
                            zerolinecolor: '#000'
                        },
                        yaxis: {
                            tickfont: 'Object',
                            title: 'Object',
                            automargin: true,
                            line: 'Object',
                            zerolinecolor: '#000'
                        },
                        yaxis2: {
                            tickfont: 'Object',
                            title: 'Object',
                            automargin: true,
                            line: 'Object',
                            zerolinecolor: '#000'
                        },
                        paper_bgcolor: '#FFFFFF',
                        plot_bgcolor: '#FFFFFF',
                        geo: { bgcolor: '#FFFFFF', subunitcolor: '#000' },
                        shapes: [],
                        annotations: [],
                        margin: { t: 10, r: 0, l: 0, b: 30 }
                    }
                }
            },
            theme: {
                breakpoints: 'Object',
                direction: 'ltr',
                mixins: 'Object',
                overrides: 'Object',
                palette: 'Object',
                props: 'Object',
                shadows: 'Array[25]',
                typography: 'Object',
                spacing: 'spacing()',
                shape: 'Object',
                transitions: 'Object',
                zIndex: 'Object',
                htmlFontSize: 10
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetAssumptions {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render AppScreen Component With GantChart icon', () => {
        const props = {
            large: true,
            params: {
                assumptions: {
                    trigger_icon: 'gant-chart',
                    data: [
                        {
                            direction: 'clockwise',
                            hole: 0.55,
                            labels: 'Array[2]',
                            marker: 'Object',
                            sort: false,
                            textinfo: 'none',
                            textposition: 'none',
                            type: 'pie',
                            values: 'Array[2]'
                        },
                        {
                            direction: 'clockwise',
                            hole: 0.7,
                            labels: 'Array[2]',
                            marker: 'Object',
                            sort: false,
                            textinfo: 'none',
                            textposition: 'none',
                            type: 'pie',
                            values: 'Array[2]'
                        },
                        {
                            direction: 'clockwise',
                            hole: 0.85,
                            labels: 'Array[2]',
                            marker: 'Object',
                            sort: false,
                            textinfo: 'none',
                            textposition: 'none',
                            type: 'pie',
                            values: 'Array[2]'
                        }
                    ],
                    layout: {
                        legend: {
                            orientation: 'v',
                            yanchor: 'center',
                            xanchor: 'left',
                            y: 0.5,
                            x: 1,
                            font: 'Object'
                        },
                        autosize: true,
                        font: {
                            family: '"Roboto", "Helvetica", "Arial", sans-serif',
                            color: '#000',
                            size: 9.216
                        },
                        hoverlabel: { font: 'Object' },
                        xaxis: {
                            tickfont: 'Object',
                            title: 'Object',
                            automargin: true,
                            line: 'Object',
                            zerolinecolor: '#000'
                        },
                        yaxis: {
                            tickfont: 'Object',
                            title: 'Object',
                            automargin: true,
                            line: 'Object',
                            zerolinecolor: '#000'
                        },
                        yaxis2: {
                            tickfont: 'Object',
                            title: 'Object',
                            automargin: true,
                            line: 'Object',
                            zerolinecolor: '#000'
                        },
                        paper_bgcolor: '#FFFFFF',
                        plot_bgcolor: '#FFFFFF',
                        geo: { bgcolor: '#FFFFFF', subunitcolor: '#000' },
                        shapes: [],
                        annotations: [],
                        margin: { t: 10, r: 0, l: 0, b: 30 }
                    }
                }
            },
            theme: {
                breakpoints: 'Object',
                direction: 'ltr',
                mixins: 'Object',
                overrides: 'Object',
                palette: 'Object',
                props: 'Object',
                shadows: 'Array[25]',
                typography: 'Object',
                spacing: 'spacing()',
                shape: 'Object',
                transitions: 'Object',
                zIndex: 'Object',
                htmlFontSize: 10
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetAssumptions {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render AppScreen Component With YellowBulb icon and insights label', () => {
        const props = {
            large: true,
            params: {
                assumptions: {
                    trigger_icon: 'yellow-bulb',
                    trigger_label: 'Insights',
                    data: [
                        {
                            direction: 'clockwise',
                            hole: 0.55,
                            labels: 'Array[2]',
                            marker: 'Object',
                            sort: false,
                            textinfo: 'none',
                            textposition: 'none',
                            type: 'pie',
                            values: 'Array[2]'
                        },
                        {
                            direction: 'clockwise',
                            hole: 0.7,
                            labels: 'Array[2]',
                            marker: 'Object',
                            sort: false,
                            textinfo: 'none',
                            textposition: 'none',
                            type: 'pie',
                            values: 'Array[2]'
                        },
                        {
                            direction: 'clockwise',
                            hole: 0.85,
                            labels: 'Array[2]',
                            marker: 'Object',
                            sort: false,
                            textinfo: 'none',
                            textposition: 'none',
                            type: 'pie',
                            values: 'Array[2]'
                        }
                    ],
                    layout: {
                        legend: {
                            orientation: 'v',
                            yanchor: 'center',
                            xanchor: 'left',
                            y: 0.5,
                            x: 1,
                            font: 'Object'
                        },
                        autosize: true,
                        font: {
                            family: '"Roboto", "Helvetica", "Arial", sans-serif',
                            color: '#000',
                            size: 9.216
                        },
                        hoverlabel: { font: 'Object' },
                        xaxis: {
                            tickfont: 'Object',
                            title: 'Object',
                            automargin: true,
                            line: 'Object',
                            zerolinecolor: '#000'
                        },
                        yaxis: {
                            tickfont: 'Object',
                            title: 'Object',
                            automargin: true,
                            line: 'Object',
                            zerolinecolor: '#000'
                        },
                        yaxis2: {
                            tickfont: 'Object',
                            title: 'Object',
                            automargin: true,
                            line: 'Object',
                            zerolinecolor: '#000'
                        },
                        paper_bgcolor: '#FFFFFF',
                        plot_bgcolor: '#FFFFFF',
                        geo: { bgcolor: '#FFFFFF', subunitcolor: '#000' },
                        shapes: [],
                        annotations: [],
                        margin: { t: 10, r: 0, l: 0, b: 30 }
                    }
                }
            },
            theme: {
                breakpoints: 'Object',
                direction: 'ltr',
                mixins: 'Object',
                overrides: 'Object',
                palette: 'Object',
                props: 'Object',
                shadows: 'Array[25]',
                typography: 'Object',
                spacing: 'spacing()',
                shape: 'Object',
                transitions: 'Object',
                zIndex: 'Object',
                htmlFontSize: 10
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetAssumptions {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render AppScreen Component', () => {
        const props = {
            classes: {
                assumptionsIconContainer: 'AppWidgetAssumptions-assumptionsIconContainer-969',
                assumptionsIcon: 'AppWidgetAssumptions-assumptionsIcon-970',
                assumptionsIconLargeContainer:
                    'AppWidgetAssumptions-assumptionsIconLargeContainer-971',
                assumptionsIconLarge: 'AppWidgetAssumptions-assumptionsIconLarge-972',
                closeButton: 'AppWidgetAssumptions-closeButton-973',
                assumptionDialogContent: 'AppWidgetAssumptions-assumptionDialogContent-974'
            },
            large: true,
            params: {
                assumptions: {
                    insight_data: [
                        {
                            label: 'Lowest Demand',
                            severity: 'warning',
                            value: 'Week 265 (Post-Christmas Week 2017)'
                        },
                        {
                            label: 'Highest Demand',
                            severity: 'success',
                            value: 'Week 232 (Black Friday Week)'
                        },
                        {
                            label: 'Seasonal Spikes',
                            severity: 'success',
                            value: 'Mar, Aug, Nov (End of Season)'
                        },
                        { label: 'Seasonal Troughs', severity: 'warning', value: 'Dec, Jan' },
                        { label: 'Most Volatile months', value: 'Nov, Dec' },
                        { label: 'Cyclical pattern observed repeats at about 3 years interval' }
                    ],
                    insight_label: 'Alerts'
                }
            },
            theme: {
                breakpoints: 'Object',
                direction: 'ltr',
                mixins: 'Object',
                overrides: 'Object',
                palette: 'Object',
                props: 'Object',
                shadows: 'Array[25]',
                typography: 'Object',
                spacing: 'spacing()',
                shape: 'Object',
                transitions: 'Object',
                zIndex: 'Object',
                htmlFontSize: 10
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetAssumptions {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render AppScreen Component', () => {
        const props = {
            classes: {
                assumptionsIconContainer: 'AppWidgetAssumptions-assumptionsIconContainer-1149',
                assumptionsIcon: 'AppWidgetAssumptions-assumptionsIcon-1150',
                assumptionsIconLargeContainer:
                    'AppWidgetAssumptions-assumptionsIconLargeContainer-1151',
                assumptionsIconLarge: 'AppWidgetAssumptions-assumptionsIconLarge-1152',
                closeButton: 'AppWidgetAssumptions-closeButton-1153',
                assumptionDialogContent: 'AppWidgetAssumptions-assumptionDialogContent-1154'
            },
            large: true,
            params: {
                assumptions: {
                    table_data: [
                        ['A', 'Seasonal', '8', '2', '9', '19'],
                        ['A', 'Linear', '3', '4', '5', '12'],
                        ['A', 'Stable', '4', '5', '6', '15'],
                        ['A', 'Erratic', '6', '7', '8', '21'],
                        ['B', 'Seasonal', '8', '5', '7', '19'],
                        ['B', 'Linear', '5', '6', '7', '12'],
                        ['B', 'Stable', '8', '9', '7', '15'],
                        ['B', 'Erratic', '7', '8', '6', '21']
                    ],
                    table_headers: [
                        'Pareto',
                        'Pattern',
                        'Variability/High',
                        'Variability/Medium',
                        'Variability/Low',
                        'Total'
                    ]
                }
            },
            theme: {
                breakpoints: 'Object',
                direction: 'ltr',
                mixins: 'Object',
                overrides: 'Object',
                palette: 'Object',
                props: 'Object',
                shadows: 'Array[25]',
                typography: 'Object',
                spacing: 'spacing()',
                shape: 'Object',
                transitions: 'Object',
                zIndex: 'Object',
                htmlFontSize: 10
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetAssumptions {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render AppScreen Component', () => {
        const props = {
            classes: {
                assumptionsIconContainer: 'AppWidgetAssumptions-assumptionsIconContainer-431',
                assumptionsIcon: 'AppWidgetAssumptions-assumptionsIcon-432',
                assumptionsIconLargeContainer:
                    'AppWidgetAssumptions-assumptionsIconLargeContainer-433',
                assumptionsIconLarge: 'AppWidgetAssumptions-assumptionsIconLarge-434',
                closeButton: 'AppWidgetAssumptions-closeButton-435',
                assumptionDialogContent: 'AppWidgetAssumptions-assumptionDialogContent-436'
            },
            large: true,
            params: {
                assumptions: {
                    flow_table: {
                        name: 'Optimized Inventory Levels',
                        data: [
                            {
                                name: 'RDCs',
                                table_headers: [
                                    'Regional Distribution Centres',
                                    'Recom. Base Inventory',
                                    'Recom. Safety Stock'
                                ],
                                table_data: [
                                    { cols: ['RDC 1', '9k Units', '2k Units'], rowspan: 4 },
                                    { cols: ['RDC 1', '6k Units', '3k Units'], rowspan: 2 }
                                ]
                            },
                            'Object',
                            'Object'
                        ],
                        callouts: ['Object', 'Object']
                    },
                    simulator: {
                        name: 'Inputs',
                        options: {
                            button_name: 'Change inputs to Optimize',
                            fields: 'Array[2]',
                            readonly_headers: 'Array[2]',
                            split: '1-1'
                        }
                    }
                }
            },
            theme: {
                breakpoints: 'Object',
                direction: 'ltr',
                mixins: 'Object',
                overrides: 'Object',
                palette: 'Object',
                props: 'Object',
                shadows: 'Array[25]',
                typography: 'Object',
                spacing: 'spacing()',
                shape: 'Object',
                transitions: 'Object',
                zIndex: 'Object',
                htmlFontSize: 10
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetAssumptions {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render AppScreen Component', () => {
        const props = {
            large: false,
            params: {
                assumptions: {
                    value: {}
                }
            }
        };
        const { getByText, debug, container } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetAssumptions {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        // expect(screen.getByLabelText('info-icon')).toBeInTheDocument()
        // fireEvent.click(screen.getByLabelText('info-icon'))
    });
    test('Should render component without info button', () => {
        const props = {
            large: true,
            hideInfoButton: true,
            params: {
                assumptions: {
                    flow_table: {
                        name: 'Optimized Inventory Levels',
                        data: [
                            {
                                name: 'RDCs',
                                table_headers: [
                                    'Regional Distribution Centres',
                                    'Recom. Base Inventory',
                                    'Recom. Safety Stock'
                                ],
                                table_data: [
                                    { cols: ['RDC 1', '9k Units', '2k Units'], rowspan: 4 },
                                    { cols: ['RDC 1', '6k Units', '3k Units'], rowspan: 2 }
                                ]
                            },
                            'Object',
                            'Object'
                        ],
                        callouts: ['Object', 'Object']
                    },
                    simulator: {
                        name: 'Inputs',
                        options: {
                            button_name: 'Change inputs to Optimize',
                            fields: 'Array[2]',
                            readonly_headers: 'Array[2]',
                            split: '1-1'
                        }
                    }
                }
            },
            theme: {
                breakpoints: 'Object',
                direction: 'ltr',
                mixins: 'Object',
                overrides: 'Object',
                palette: 'Object',
                props: 'Object',
                shadows: 'Array[25]',
                typography: 'Object',
                spacing: 'spacing()',
                shape: 'Object',
                transitions: 'Object',
                zIndex: 'Object',
                htmlFontSize: 10
            }
        };
        const { queryByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetAssumptions {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(queryByLabelText('info-icon')).not.toBeInTheDocument();
    });

    test('Should render AppWidgetAssumptions component with assumptions', () => {
        const props = {
            params: {
                assumptions: {
                    title: 'Test Title',
                    description: 'Test Description',
                    trigger_label: 'Trigger',
                    trigger_icon: 'gant-chart',
                    assumption_variant: 'popover'
                }
            },
            classes: {},
            isKpi: false,
            dataStory: false
        };

        const { getByRole } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetAssumptions {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(getByRole('button', { name: /Trigger/i })).toBeInTheDocument();
    });
    test('Should handle long description by opening a dialog instead of popover', () => {
        const props = {
            params: {
                assumptions: {
                    title: 'Test Title',
                    description: 'Test Description',
                    trigger_label: 'Trigger',
                    trigger_icon: 'gant-chart',
                    assumption_variant: 'popover'
                }
            },
            classes: {},
            isKpi: false,
            dataStory: false
        };
        const { getByRole, getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetAssumptions {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const triggerElement = getByText('Trigger');
        fireEvent.click(triggerElement);
        expect(getByText('Test Title')).toBeInTheDocument();
        expect(getByText('Test Description')).toBeInTheDocument();
    });
    test('Should handle assumption_variant dialog by opening a dialog with the correct content', () => {
        const props = {
            params: {
                assumptions: {
                    title: 'Dialog Title',
                    description: 'Dialog Description',
                    trigger_label: 'Open Dialog',
                    trigger_icon: 'info',
                    assumption_variant: 'dialog'
                }
            },
            classes: {},
            isKpi: false,
            dataStory: false
        };

        const { getByText, getByRole } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetAssumptions {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        const triggerElement = getByText('Open Dialog');
        fireEvent.click(triggerElement);

        expect(getByText('Dialog Title')).toBeInTheDocument();
        expect(getByText('Dialog Description')).toBeInTheDocument();
    });
});
