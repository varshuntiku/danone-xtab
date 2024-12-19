import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AppWidgetGraph from '../../components/AppWidgetGraph';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { Provider } from 'react-redux';
import store from 'store/store';
import { ZoomIn } from '@material-ui/icons';
import { EnlargedView } from '../../components/AppWidgetGraph';
import CustomLegends from '../../components/custom/CustomLegends';
import Error from '@material-ui/icons/Error';
import CircularProgress from '@material-ui/core/CircularProgress';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    const props = {
        classes: {
            graphLoader: 'AppWidgetGraph-graphLoader-151',
            graphLoaderIcon: 'AppWidgetGraph-graphLoaderIcon-152',
            graphLoaderColor: 'AppWidgetGraph-graphLoaderColor-153',
            skeletonWave: 'AppWidgetGraph-skeletonWave-154',
            graphBody: 'AppWidgetGraph-graphBody-155',
            graphWrapper: 'AppWidgetGraph-graphWrapper-156',
            graphHalfWrapper: 'AppWidgetGraph-graphHalfWrapper-157',
            graphLabel: 'AppWidgetGraph-graphLabel-158',
            graphActionsBar: 'AppWidgetGraph-graphActionsBar-159',
            actionsBarItem: 'AppWidgetGraph-actionsBarItem-160',
            actionsBarItemLeftContainer: 'AppWidgetGraph-actionsBarItemLeftContainer-161',
            downloadButton: 'AppWidgetGraph-downloadButton-162',
            graphActions: 'AppWidgetGraph-graphActions-163',
            graphContainer: 'AppWidgetGraph-graphContainer-164',
            halfSearchBar: 'AppWidgetGraph-halfSearchBar-165',
            simulateButton: 'AppWidgetGraph-simulateButton-166',
            simulatorButtons: 'AppWidgetGraph-simulatorButtons-167',
            simulatorTableHeaders: 'AppWidgetGraph-simulatorTableHeaders-168',
            simulatorTableHeaderText: 'AppWidgetGraph-simulatorTableHeaderText-169',
            simulatorTableCell: 'AppWidgetGraph-simulatorTableCell-170',
            simulatorTableCellText: 'AppWidgetGraph-simulatorTableCellText-171',
            simulatorTableCellInput: 'AppWidgetGraph-simulatorTableCellInput-172',
            simulatorTableFirstColCell: 'AppWidgetGraph-simulatorTableFirstColCell-173',
            simulatorTableFirstColCellText: 'AppWidgetGraph-simulatorTableFirstColCellText-174',
            graphSimulatorContainer: 'AppWidgetGraph-graphSimulatorContainer-175',
            graphSimulatorHalfContainer: 'AppWidgetGraph-graphSimulatorHalfContainer-176',
            simulatorBodyContainer: 'AppWidgetGraph-simulatorBodyContainer-177',
            simulatorBodyContainerMultiple: 'AppWidgetGraph-simulatorBodyContainerMultiple-178',
            simulatorFormDivider: 'AppWidgetGraph-simulatorFormDivider-179',
            simulatorSliderLabel: 'AppWidgetGraph-simulatorSliderLabel-180',
            simulatorSliderInput: 'AppWidgetGraph-simulatorSliderInput-181',
            simulatorSliderInputBox: 'AppWidgetGraph-simulatorSliderInputBox-182',
            simulatorSectionHeader: 'AppWidgetGraph-simulatorSectionHeader-183',
            simulatorOptimizeCellLabel: 'AppWidgetGraph-simulatorOptimizeCellLabel-184',
            simulatorOptimizeCellInput: 'AppWidgetGraph-simulatorOptimizeCellInput-185',
            graphFilterMenuItem: 'AppWidgetGraph-graphFilterMenuItem-186',
            graphFilterMenuItemSelected: 'AppWidgetGraph-graphFilterMenuItemSelected-187',
            graphFilterMenuSearchItem: 'AppWidgetGraph-graphFilterMenuSearchItem-188',
            graphFilterMenuSearchInput: 'AppWidgetGraph-graphFilterMenuSearchInput-189',
            graphFilterMenuSearchIcon: 'AppWidgetGraph-graphFilterMenuSearchIcon-190',
            filterMenuContainer: 'AppWidgetGraph-filterMenuContainer-191',
            gridTableBody: 'AppWidgetGraph-gridTableBody-192',
            graphOptionContainer: 'AppWidgetGraph-graphOptionContainer-193',
            graphOptionLabel: 'AppWidgetGraph-graphOptionLabel-194',
            graphOptionValue: 'AppWidgetGraph-graphOptionValue-195',
            graphOptionValueType: 'AppWidgetGraph-graphOptionValueType-196',
            graphOptionIcon: 'AppWidgetGraph-graphOptionIcon-197',
            graphOptionMenu: 'AppWidgetGraph-graphOptionMenu-198',
            storyCheckbox: 'AppWidgetGraph-storyCheckbox-199',
            downloadButtonSingleTable: 'AppWidgetGraph-downloadButtonSingleTable-200'
        },
        parent_obj: {
            props: 'Object',
            context: 'Object',
            refs: 'Object',
            updater: 'Object',
            onResponseGetScreen: 'fn()',
            getLabels: 'fn()',
            getGraphs: 'fn()',
            getWidgetData: 'fn()',
            onApplySimulator: 'fn()',
            onSimulatorApplyDrilldown: 'fn()',
            state: 'Object',
            _reactInternalFiber: 'Object',
            _reactInternalInstance: 'Object',
            isReactComponent: 'Object',
            setState: 'fn()',
            forceUpdate: 'fn()'
        },
        app_id: '269',
        screen_id: 6781,
        title: 'INVENTORY REVIEW',
        details: {
            id: 18115,
            widget_index: 0,
            widget_key: 'Inventory Review',
            is_label: false,
            config: 'Object'
        },
        selected_filters: {
            Region: { options: ['All'], checked: 'All', label: 'Region' },
            Category: {
                options: [
                    'Air Conditioner',
                    'Mobiles',
                    'Refrigerator',
                    'Tablets',
                    'Washing Machines'
                ],
                checked: 'Air Conditioner',
                label: 'Category'
            },
            Year: { options: ['2018', '2019', '2020', '2021'], checked: '2018', label: 'Year' },
            Month: { options: ['Q1', 'Q2'], checked: 'Q1', label: 'Month' },
            Product: { options: ['Product 1'], checked: 'Product 1', label: 'Product' }
        },
        simulator_apply: false,
        graph_height: 'full',
        screen_filter_settings: false,
        data: {
            widget_enlarge: true,
            data: {
                widget_value_id: 1124755,
                value: {
                    layout: { updatemenus: [{ position: 'bm' }] },
                    flow_table: {
                        name: 'Total Inventory Management Cost',
                        sub_title: '£2m [12% YoY]',
                        sub_title_direction: 'up',
                        data: [
                            {
                                name: 'RDCs',
                                incoming_text: 'Forecast Demand: 20k Units',
                                table_headers: [
                                    'Regional Distribution Centres',
                                    'On Hand Inventory',
                                    'Estimated Demand'
                                ],
                                table_data: [
                                    { cols: ['RDC 1', '14k Units', '5k Units'], rowspan: 4 },
                                    { cols: ['RDC 2', '10k Units', '7k Units'], rowspan: 2 }
                                ]
                            },
                            {
                                name: 'DCs',
                                incoming_text: 'Forecast Demand: 6k Units',
                                table_headers: [
                                    'Distribution Centres',
                                    'On Hand Inventory',
                                    'Estimated Demand'
                                ],
                                table_data: ['Object', 'Object', 'Object']
                            },
                            'Object'
                        ]
                    }
                },
                simulated_value: false
            }
        }
    };

    test('Should render AppScreen Component 1', () => {
        const props = {
            classes: {
                graphLoader: 'AppWidgetGraph-graphLoader-151',
                graphLoaderIcon: 'AppWidgetGraph-graphLoaderIcon-152',
                graphLoaderColor: 'AppWidgetGraph-graphLoaderColor-153',
                skeletonWave: 'AppWidgetGraph-skeletonWave-154',
                graphBody: 'AppWidgetGraph-graphBody-155',
                graphWrapper: 'AppWidgetGraph-graphWrapper-156',
                graphHalfWrapper: 'AppWidgetGraph-graphHalfWrapper-157',
                graphLabel: 'AppWidgetGraph-graphLabel-158',
                graphActionsBar: 'AppWidgetGraph-graphActionsBar-159',
                actionsBarItem: 'AppWidgetGraph-actionsBarItem-160',
                actionsBarItemLeftContainer: 'AppWidgetGraph-actionsBarItemLeftContainer-161',
                downloadButton: 'AppWidgetGraph-downloadButton-162',
                graphActions: 'AppWidgetGraph-graphActions-163',
                graphContainer: 'AppWidgetGraph-graphContainer-164',
                halfSearchBar: 'AppWidgetGraph-halfSearchBar-165',
                simulateButton: 'AppWidgetGraph-simulateButton-166',
                simulatorButtons: 'AppWidgetGraph-simulatorButtons-167',
                simulatorTableHeaders: 'AppWidgetGraph-simulatorTableHeaders-168',
                simulatorTableHeaderText: 'AppWidgetGraph-simulatorTableHeaderText-169',
                simulatorTableCell: 'AppWidgetGraph-simulatorTableCell-170',
                simulatorTableCellText: 'AppWidgetGraph-simulatorTableCellText-171',
                simulatorTableCellInput: 'AppWidgetGraph-simulatorTableCellInput-172',
                simulatorTableFirstColCell: 'AppWidgetGraph-simulatorTableFirstColCell-173',
                simulatorTableFirstColCellText: 'AppWidgetGraph-simulatorTableFirstColCellText-174',
                graphSimulatorContainer: 'AppWidgetGraph-graphSimulatorContainer-175',
                graphSimulatorHalfContainer: 'AppWidgetGraph-graphSimulatorHalfContainer-176',
                simulatorBodyContainer: 'AppWidgetGraph-simulatorBodyContainer-177',
                simulatorBodyContainerMultiple: 'AppWidgetGraph-simulatorBodyContainerMultiple-178',
                simulatorFormDivider: 'AppWidgetGraph-simulatorFormDivider-179',
                simulatorSliderLabel: 'AppWidgetGraph-simulatorSliderLabel-180',
                simulatorSliderInput: 'AppWidgetGraph-simulatorSliderInput-181',
                simulatorSliderInputBox: 'AppWidgetGraph-simulatorSliderInputBox-182',
                simulatorSectionHeader: 'AppWidgetGraph-simulatorSectionHeader-183',
                simulatorOptimizeCellLabel: 'AppWidgetGraph-simulatorOptimizeCellLabel-184',
                simulatorOptimizeCellInput: 'AppWidgetGraph-simulatorOptimizeCellInput-185',
                graphFilterMenuItem: 'AppWidgetGraph-graphFilterMenuItem-186',
                graphFilterMenuItemSelected: 'AppWidgetGraph-graphFilterMenuItemSelected-187',
                graphFilterMenuSearchItem: 'AppWidgetGraph-graphFilterMenuSearchItem-188',
                graphFilterMenuSearchInput: 'AppWidgetGraph-graphFilterMenuSearchInput-189',
                graphFilterMenuSearchIcon: 'AppWidgetGraph-graphFilterMenuSearchIcon-190',
                filterMenuContainer: 'AppWidgetGraph-filterMenuContainer-191',
                gridTableBody: 'AppWidgetGraph-gridTableBody-192',
                graphOptionContainer: 'AppWidgetGraph-graphOptionContainer-193',
                graphOptionLabel: 'AppWidgetGraph-graphOptionLabel-194',
                graphOptionValue: 'AppWidgetGraph-graphOptionValue-195',
                graphOptionValueType: 'AppWidgetGraph-graphOptionValueType-196',
                graphOptionIcon: 'AppWidgetGraph-graphOptionIcon-197',
                graphOptionMenu: 'AppWidgetGraph-graphOptionMenu-198',
                storyCheckbox: 'AppWidgetGraph-storyCheckbox-199',
                downloadButtonSingleTable: 'AppWidgetGraph-downloadButtonSingleTable-200'
            },
            parent_obj: {
                props: 'Object',
                context: 'Object',
                refs: 'Object',
                updater: 'Object',
                onResponseGetScreen: 'fn()',
                getLabels: 'fn()',
                getGraphs: 'fn()',
                getWidgetData: 'fn()',
                onApplySimulator: 'fn()',
                onSimulatorApplyDrilldown: 'fn()',
                state: 'Object',
                _reactInternalFiber: 'Object',
                _reactInternalInstance: 'Object',
                isReactComponent: 'Object',
                setState: 'fn()',
                forceUpdate: 'fn()'
            },
            app_id: '269',
            screen_id: 6781,
            title: 'INVENTORY REVIEW',
            details: {
                id: 18115,
                widget_index: 0,
                widget_key: 'Inventory Review',
                is_label: false,
                config: 'Object'
            },
            selected_filters: {
                Region: { options: ['All'], checked: 'All', label: 'Region' },
                Category: {
                    options: [
                        'Air Conditioner',
                        'Mobiles',
                        'Refrigerator',
                        'Tablets',
                        'Washing Machines'
                    ],
                    checked: 'Air Conditioner',
                    label: 'Category'
                },
                Year: { options: ['2018', '2019', '2020', '2021'], checked: '2018', label: 'Year' },
                Month: { options: ['Q1', 'Q2'], checked: 'Q1', label: 'Month' },
                Product: { options: ['Product 1'], checked: 'Product 1', label: 'Product' }
            },
            simulator_apply: false,
            graph_height: 'full',
            screen_filter_settings: false,
            data: {
                data: {
                    widget_value_id: 1124755,
                    value: {
                        layout: { updatemenus: [{ position: 'bm' }] },
                        flow_table: {
                            name: 'Total Inventory Management Cost',
                            sub_title: '£2m [12% YoY]',
                            sub_title_direction: 'up',
                            data: [
                                {
                                    name: 'RDCs',
                                    incoming_text: 'Forecast Demand: 20k Units',
                                    table_headers: [
                                        'Regional Distribution Centres',
                                        'On Hand Inventory',
                                        'Estimated Demand'
                                    ],
                                    table_data: [
                                        { cols: ['RDC 1', '14k Units', '5k Units'], rowspan: 4 },
                                        { cols: ['RDC 2', '10k Units', '7k Units'], rowspan: 2 }
                                    ]
                                },
                                {
                                    name: 'DCs',
                                    incoming_text: 'Forecast Demand: 6k Units',
                                    table_headers: [
                                        'Distribution Centres',
                                        'On Hand Inventory',
                                        'Estimated Demand'
                                    ],
                                    table_data: ['Object', 'Object', 'Object']
                                },
                                'Object'
                            ]
                        }
                    },
                    simulated_value: false
                }
            }
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetGraph {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render AppScreen Component 2', () => {
        const props = {
            parent_obj: {
                props: 'Object',
                context: 'Object',
                refs: 'Object',
                updater: 'Object',
                onResponseGetScreen: 'fn()',
                getLabels: 'fn()',
                getGraphs: 'fn()',
                getWidgetData: 'fn()',
                onApplySimulator: 'fn()',
                onSimulatorApplyDrilldown: 'fn()',
                state: 'Object',
                _reactInternalFiber: 'Object',
                _reactInternalInstance: 'Object',
                isReactComponent: 'Object',
                setState: 'fn()',
                forceUpdate: 'fn()'
            },
            app_id: '26',
            screen_id: 103,
            title: 'TREND - INDUSTRY VOLUME & COMPANY VOLUME',
            details: {
                id: 489,
                widget_index: 1,
                widget_key: 'Trend - Industry Volume & Company Volume',
                is_label: false,
                config: 'Object'
            },
            selected_filters: {
                'Time Frame': 'Object',
                Region: { options: ['USA'], checked: 'USA', label: 'Region' },
                Industry: { options: ['Beer'], checked: 'Beer', label: 'Industry' },
                Category: { options: ['All'], checked: 'All', label: 'Category' },
                'Sub Category': 'Object'
            },
            simulator_apply: false,
            graph_height: 'half',
            screen_filter_settings: false,
            data: {
                data: {
                    widget_value_id: 1098,
                    value: {
                        data: {
                            widget_value_id: 1099,
                            value: {
                                data: [
                                    {
                                        colorscale: [
                                            [0.0, '#636efa'],
                                            [1.0, '#636efa']
                                        ],
                                        geo: 'geo',
                                        hovertemplate:
                                            'Growth=Below Industry growth<br>locations=%{location}<extra></extra>',
                                        locationmode: 'USA-states',
                                        locations: [
                                            'AK',
                                            'AR',
                                            'CT',
                                            'DE',
                                            'HI',
                                            'ID',
                                            'IA',
                                            'KS',
                                            'ME',
                                            'MS',
                                            'MT',
                                            'NE',
                                            'NV',
                                            'NH',
                                            'NM',
                                            'ND',
                                            'OK',
                                            'OR',
                                            'RI',
                                            'SD',
                                            'UT',
                                            'VT',
                                            'WV',
                                            'WY'
                                        ],
                                        name: 'Below Industry growth',
                                        showlegend: true,
                                        showscale: false,
                                        type: 'choropleth',
                                        z: [
                                            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                            1, 1, 1, 1, 1
                                        ]
                                    },
                                    {
                                        colorscale: [
                                            [0.0, '#EF553B'],
                                            [1.0, '#EF553B']
                                        ],
                                        geo: 'geo',
                                        hovertemplate:
                                            'Growth=On-Par Industry growth<br>locations=%{location}<extra></extra>',
                                        locationmode: 'USA-states',
                                        locations: [
                                            'AL',
                                            'AZ',
                                            'CO',
                                            'FL',
                                            'GA',
                                            'IL',
                                            'IN',
                                            'KY',
                                            'LA',
                                            'MD',
                                            'MA',
                                            'MI',
                                            'MN',
                                            'MO',
                                            'NC',
                                            'OH',
                                            'PA',
                                            'SC',
                                            'TN',
                                            'VA',
                                            'WI'
                                        ],
                                        name: 'On-Par Industry growth',
                                        showlegend: true,
                                        showscale: false,
                                        type: 'choropleth',
                                        z: [
                                            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                            1, 1
                                        ]
                                    },
                                    {
                                        colorscale: [
                                            [0.0, '#00cc96'],
                                            [1.0, '#00cc96']
                                        ],
                                        geo: 'geo',
                                        hovertemplate:
                                            'Growth=Above Industry growth<br>locations=%{location}<extra></extra>',
                                        locationmode: 'USA-states',
                                        locations: ['CA', 'NJ', 'NY', 'TX', 'WA'],
                                        name: 'Above Industry growth',
                                        showlegend: true,
                                        showscale: false,
                                        type: 'choropleth',
                                        z: [1, 1, 1, 1, 1]
                                    }
                                ],
                                layout: {
                                    geo: {
                                        center: {},
                                        domain: { x: [0.0, 1.0], y: [0.0, 1.0] },
                                        scope: 'usa'
                                    },
                                    legend: { title: { text: 'Growth' }, tracegroupgap: 0 },
                                    margin: { t: 60 },
                                    template: {
                                        data: {
                                            bar: [
                                                {
                                                    error_x: { color: '#2a3f5f' },
                                                    error_y: { color: '#2a3f5f' },
                                                    marker: {
                                                        line: { color: '#E5ECF6', width: 0.5 }
                                                    },
                                                    type: 'bar'
                                                }
                                            ],
                                            barpolar: [
                                                {
                                                    marker: {
                                                        line: { color: '#E5ECF6', width: 0.5 }
                                                    },
                                                    type: 'barpolar'
                                                }
                                            ],
                                            carpet: [
                                                {
                                                    aaxis: {
                                                        endlinecolor: '#2a3f5f',
                                                        gridcolor: 'white',
                                                        linecolor: 'white',
                                                        minorgridcolor: 'white',
                                                        startlinecolor: '#2a3f5f'
                                                    },
                                                    baxis: {
                                                        endlinecolor: '#2a3f5f',
                                                        gridcolor: 'white',
                                                        linecolor: 'white',
                                                        minorgridcolor: 'white',
                                                        startlinecolor: '#2a3f5f'
                                                    },
                                                    type: 'carpet'
                                                }
                                            ],
                                            choropleth: [
                                                {
                                                    colorbar: { outlinewidth: 0, ticks: '' },
                                                    type: 'choropleth'
                                                }
                                            ],
                                            contour: [
                                                {
                                                    colorbar: { outlinewidth: 0, ticks: '' },
                                                    colorscale: [
                                                        [0.0, '#0d0887'],
                                                        [0.1111111111111111, '#46039f'],
                                                        [0.2222222222222222, '#7201a8'],
                                                        [0.3333333333333333, '#9c179e'],
                                                        [0.4444444444444444, '#bd3786'],
                                                        [0.5555555555555556, '#d8576b'],
                                                        [0.6666666666666666, '#ed7953'],
                                                        [0.7777777777777778, '#fb9f3a'],
                                                        [0.8888888888888888, '#fdca26'],
                                                        [1.0, '#f0f921']
                                                    ],
                                                    type: 'contour'
                                                }
                                            ],
                                            contourcarpet: [
                                                {
                                                    colorbar: { outlinewidth: 0, ticks: '' },
                                                    type: 'contourcarpet'
                                                }
                                            ],
                                            heatmap: [
                                                {
                                                    colorbar: { outlinewidth: 0, ticks: '' },
                                                    colorscale: [
                                                        [0.0, '#0d0887'],
                                                        [0.1111111111111111, '#46039f'],
                                                        [0.2222222222222222, '#7201a8'],
                                                        [0.3333333333333333, '#9c179e'],
                                                        [0.4444444444444444, '#bd3786'],
                                                        [0.5555555555555556, '#d8576b'],
                                                        [0.6666666666666666, '#ed7953'],
                                                        [0.7777777777777778, '#fb9f3a'],
                                                        [0.8888888888888888, '#fdca26'],
                                                        [1.0, '#f0f921']
                                                    ],
                                                    type: 'heatmap'
                                                }
                                            ],
                                            heatmapgl: [
                                                {
                                                    colorbar: { outlinewidth: 0, ticks: '' },
                                                    colorscale: [
                                                        [0.0, '#0d0887'],
                                                        [0.1111111111111111, '#46039f'],
                                                        [0.2222222222222222, '#7201a8'],
                                                        [0.3333333333333333, '#9c179e'],
                                                        [0.4444444444444444, '#bd3786'],
                                                        [0.5555555555555556, '#d8576b'],
                                                        [0.6666666666666666, '#ed7953'],
                                                        [0.7777777777777778, '#fb9f3a'],
                                                        [0.8888888888888888, '#fdca26'],
                                                        [1.0, '#f0f921']
                                                    ],
                                                    type: 'heatmapgl'
                                                }
                                            ],
                                            histogram: [
                                                {
                                                    marker: {
                                                        colorbar: { outlinewidth: 0, ticks: '' }
                                                    },
                                                    type: 'histogram'
                                                }
                                            ],
                                            histogram2d: [
                                                {
                                                    colorbar: { outlinewidth: 0, ticks: '' },
                                                    colorscale: [
                                                        [0.0, '#0d0887'],
                                                        [0.1111111111111111, '#46039f'],
                                                        [0.2222222222222222, '#7201a8'],
                                                        [0.3333333333333333, '#9c179e'],
                                                        [0.4444444444444444, '#bd3786'],
                                                        [0.5555555555555556, '#d8576b'],
                                                        [0.6666666666666666, '#ed7953'],
                                                        [0.7777777777777778, '#fb9f3a'],
                                                        [0.8888888888888888, '#fdca26'],
                                                        [1.0, '#f0f921']
                                                    ],
                                                    type: 'histogram2d'
                                                }
                                            ],
                                            histogram2dcontour: [
                                                {
                                                    colorbar: { outlinewidth: 0, ticks: '' },
                                                    colorscale: [
                                                        [0.0, '#0d0887'],
                                                        [0.1111111111111111, '#46039f'],
                                                        [0.2222222222222222, '#7201a8'],
                                                        [0.3333333333333333, '#9c179e'],
                                                        [0.4444444444444444, '#bd3786'],
                                                        [0.5555555555555556, '#d8576b'],
                                                        [0.6666666666666666, '#ed7953'],
                                                        [0.7777777777777778, '#fb9f3a'],
                                                        [0.8888888888888888, '#fdca26'],
                                                        [1.0, '#f0f921']
                                                    ],
                                                    type: 'histogram2dcontour'
                                                }
                                            ],
                                            mesh3d: [
                                                {
                                                    colorbar: { outlinewidth: 0, ticks: '' },
                                                    type: 'mesh3d'
                                                }
                                            ],
                                            parcoords: [
                                                {
                                                    line: {
                                                        colorbar: { outlinewidth: 0, ticks: '' }
                                                    },
                                                    type: 'parcoords'
                                                }
                                            ],
                                            pie: [{ automargin: true, type: 'pie' }],
                                            scatter: [
                                                {
                                                    marker: {
                                                        colorbar: { outlinewidth: 0, ticks: '' }
                                                    },
                                                    type: 'scatter'
                                                }
                                            ],
                                            scatter3d: [
                                                {
                                                    line: {
                                                        colorbar: { outlinewidth: 0, ticks: '' }
                                                    },
                                                    marker: {
                                                        colorbar: { outlinewidth: 0, ticks: '' }
                                                    },
                                                    type: 'scatter3d'
                                                }
                                            ],
                                            scattercarpet: [
                                                {
                                                    marker: {
                                                        colorbar: { outlinewidth: 0, ticks: '' }
                                                    },
                                                    type: 'scattercarpet'
                                                }
                                            ],
                                            scattergeo: [
                                                {
                                                    marker: {
                                                        colorbar: { outlinewidth: 0, ticks: '' }
                                                    },
                                                    type: 'scattergeo'
                                                }
                                            ],
                                            scattergl: [
                                                {
                                                    marker: {
                                                        colorbar: { outlinewidth: 0, ticks: '' }
                                                    },
                                                    type: 'scattergl'
                                                }
                                            ],
                                            scattermapbox: [
                                                {
                                                    marker: {
                                                        colorbar: { outlinewidth: 0, ticks: '' }
                                                    },
                                                    type: 'scattermapbox'
                                                }
                                            ],
                                            scatterpolar: [
                                                {
                                                    marker: {
                                                        colorbar: { outlinewidth: 0, ticks: '' }
                                                    },
                                                    type: 'scatterpolar'
                                                }
                                            ],
                                            scatterpolargl: [
                                                {
                                                    marker: {
                                                        colorbar: { outlinewidth: 0, ticks: '' }
                                                    },
                                                    type: 'scatterpolargl'
                                                }
                                            ],
                                            scatterternary: [
                                                {
                                                    marker: {
                                                        colorbar: { outlinewidth: 0, ticks: '' }
                                                    },
                                                    type: 'scatterternary'
                                                }
                                            ],
                                            surface: [
                                                {
                                                    colorbar: { outlinewidth: 0, ticks: '' },
                                                    colorscale: [
                                                        [0.0, '#0d0887'],
                                                        [0.1111111111111111, '#46039f'],
                                                        [0.2222222222222222, '#7201a8'],
                                                        [0.3333333333333333, '#9c179e'],
                                                        [0.4444444444444444, '#bd3786'],
                                                        [0.5555555555555556, '#d8576b'],
                                                        [0.6666666666666666, '#ed7953'],
                                                        [0.7777777777777778, '#fb9f3a'],
                                                        [0.8888888888888888, '#fdca26'],
                                                        [1.0, '#f0f921']
                                                    ],
                                                    type: 'surface'
                                                }
                                            ],
                                            table: [
                                                {
                                                    cells: {
                                                        fill: { color: '#EBF0F8' },
                                                        line: { color: 'white' }
                                                    },
                                                    header: {
                                                        fill: { color: '#C8D4E3' },
                                                        line: { color: 'white' }
                                                    },
                                                    type: 'table'
                                                }
                                            ]
                                        },
                                        layout: {
                                            annotationdefaults: {
                                                arrowcolor: '#2a3f5f',
                                                arrowhead: 0,
                                                arrowwidth: 1
                                            },
                                            coloraxis: { colorbar: { outlinewidth: 0, ticks: '' } },
                                            colorscale: {
                                                diverging: [
                                                    [0, '#8e0152'],
                                                    [0.1, '#c51b7d'],
                                                    [0.2, '#de77ae'],
                                                    [0.3, '#f1b6da'],
                                                    [0.4, '#fde0ef'],
                                                    [0.5, '#f7f7f7'],
                                                    [0.6, '#e6f5d0'],
                                                    [0.7, '#b8e186'],
                                                    [0.8, '#7fbc41'],
                                                    [0.9, '#4d9221'],
                                                    [1, '#276419']
                                                ],
                                                sequential: [
                                                    [0.0, '#0d0887'],
                                                    [0.1111111111111111, '#46039f'],
                                                    [0.2222222222222222, '#7201a8'],
                                                    [0.3333333333333333, '#9c179e'],
                                                    [0.4444444444444444, '#bd3786'],
                                                    [0.5555555555555556, '#d8576b'],
                                                    [0.6666666666666666, '#ed7953'],
                                                    [0.7777777777777778, '#fb9f3a'],
                                                    [0.8888888888888888, '#fdca26'],
                                                    [1.0, '#f0f921']
                                                ],
                                                sequentialminus: [
                                                    [0.0, '#0d0887'],
                                                    [0.1111111111111111, '#46039f'],
                                                    [0.2222222222222222, '#7201a8'],
                                                    [0.3333333333333333, '#9c179e'],
                                                    [0.4444444444444444, '#bd3786'],
                                                    [0.5555555555555556, '#d8576b'],
                                                    [0.6666666666666666, '#ed7953'],
                                                    [0.7777777777777778, '#fb9f3a'],
                                                    [0.8888888888888888, '#fdca26'],
                                                    [1.0, '#f0f921']
                                                ]
                                            },
                                            colorway: [
                                                '#636efa',
                                                '#EF553B',
                                                '#00cc96',
                                                '#ab63fa',
                                                '#FFA15A',
                                                '#19d3f3',
                                                '#FF6692',
                                                '#B6E880',
                                                '#FF97FF',
                                                '#FECB52'
                                            ],
                                            font: { color: '#2a3f5f' },
                                            geo: {
                                                bgcolor: 'white',
                                                lakecolor: 'white',
                                                landcolor: '#E5ECF6',
                                                showlakes: true,
                                                showland: true,
                                                subunitcolor: 'white'
                                            },
                                            hoverlabel: { align: 'left' },
                                            hovermode: 'closest',
                                            mapbox: { style: 'light' },
                                            paper_bgcolor: 'white',
                                            plot_bgcolor: '#E5ECF6',
                                            polar: {
                                                angularaxis: {
                                                    gridcolor: 'white',
                                                    linecolor: 'white',
                                                    ticks: ''
                                                },
                                                bgcolor: '#E5ECF6',
                                                radialaxis: {
                                                    gridcolor: 'white',
                                                    linecolor: 'white',
                                                    ticks: ''
                                                }
                                            },
                                            scene: {
                                                xaxis: {
                                                    backgroundcolor: '#E5ECF6',
                                                    gridcolor: 'white',
                                                    gridwidth: 2,
                                                    linecolor: 'white',
                                                    showbackground: true,
                                                    ticks: '',
                                                    zerolinecolor: 'white'
                                                },
                                                yaxis: {
                                                    backgroundcolor: '#E5ECF6',
                                                    gridcolor: 'white',
                                                    gridwidth: 2,
                                                    linecolor: 'white',
                                                    showbackground: true,
                                                    ticks: '',
                                                    zerolinecolor: 'white'
                                                },
                                                zaxis: {
                                                    backgroundcolor: '#E5ECF6',
                                                    gridcolor: 'white',
                                                    gridwidth: 2,
                                                    linecolor: 'white',
                                                    showbackground: true,
                                                    ticks: '',
                                                    zerolinecolor: 'white'
                                                }
                                            },
                                            shapedefaults: { line: { color: '#2a3f5f' } },
                                            ternary: {
                                                aaxis: {
                                                    gridcolor: 'white',
                                                    linecolor: 'white',
                                                    ticks: ''
                                                },
                                                baxis: {
                                                    gridcolor: 'white',
                                                    linecolor: 'white',
                                                    ticks: ''
                                                },
                                                bgcolor: '#E5ECF6',
                                                caxis: {
                                                    gridcolor: 'white',
                                                    linecolor: 'white',
                                                    ticks: ''
                                                }
                                            },
                                            title: { x: 0.05 },
                                            xaxis: {
                                                automargin: true,
                                                gridcolor: 'white',
                                                linecolor: 'white',
                                                ticks: '',
                                                title: { standoff: 15 },
                                                zerolinecolor: 'white',
                                                zerolinewidth: 2
                                            },
                                            yaxis: {
                                                automargin: true,
                                                gridcolor: 'white',
                                                linecolor: 'white',
                                                ticks: '',
                                                title: { standoff: 15 },
                                                zerolinecolor: 'white',
                                                zerolinewidth: 2
                                            }
                                        }
                                    }
                                }
                            },
                            simulated_value: false
                        }
                    },
                    simulated_value: false
                }
            }
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetGraph {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render AppScreen Component 3', () => {
        const props = {
            alert_enable: true,
            app_id: '26',
            data: {
                data: {
                    widget_value_id: 1097,
                    value: {
                        data: [
                            {
                                direction: 'clockwise',
                                hole: 0.55,
                                labels: ['Market Share', '<span style="color: white">-</span>'],
                                marker: {
                                    colors: ['#5faff9', '#fff'],
                                    line: { color: 'white', width: 1 }
                                },
                                sort: false,
                                textinfo: 'none',
                                textposition: 'none',
                                type: 'pie',
                                values: [32, 68]
                            },
                            {
                                direction: 'clockwise',
                                hole: 0.7,
                                labels: [
                                    'Served Available Market',
                                    '<span style="color: white">-</span>'
                                ],
                                marker: {
                                    colors: ['#e08244', '#fff'],
                                    line: { color: 'white', width: 1 }
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
                                labels: [
                                    'Total Addressable Market',
                                    '<span style="color: white">-</span>'
                                ],
                                marker: {
                                    colors: ['#3a3a3a', '#fff'],
                                    line: { color: 'white', width: 1 }
                                },
                                sort: false,
                                textinfo: 'none',
                                textposition: 'none',
                                type: 'pie',
                                values: [100, 0]
                            }
                        ],
                        layout: {
                            legend: { traceorder: 'reversed' },
                            template: {
                                data: {},
                                layout: {}
                            },
                            updatemenus: [
                                {
                                    position: 'bm',
                                    active: 0,
                                    buttons: [
                                        {
                                            args: [
                                                {
                                                    visible: [
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false
                                                    ]
                                                }
                                            ],
                                            label: 'Price',
                                            method: 'update'
                                        },
                                        {
                                            args: [
                                                {
                                                    visible: [
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false
                                                    ]
                                                }
                                            ],
                                            label: 'RPI',
                                            method: 'update'
                                        }
                                    ],
                                    direction: 'down',
                                    name: 'Metric',
                                    pad: {
                                        r: 10,
                                        t: 10
                                    },
                                    showactive: false,
                                    x: 0.1,
                                    xanchor: 'left',
                                    y: 1.5,
                                    yanchor: 'top',
                                    hideMenus: {
                                        Price: ['Competitor']
                                    }
                                }
                            ]
                        }
                    },
                    simulated_value: false
                }
            },
            dataProvided: true,
            details: {
                config: {
                    legend: false,
                    prefix: false,
                    subtitle: false,
                    title: false,
                    traces: false,
                    value_factor: false
                },
                id: 488,
                is_label: false,
                widget_index: 0,
                widget_key: 'Market Opportunity'
            },
            graph_height: 'half',
            parent_obj: {},
            screenId: 103,
            screen_filter_settings: false,
            screen_id: 103,
            screens: [],
            simulator_apply: false,
            source: 'Integrated Demand Forecasting >> Demand Sizing >> MARKET OPPORTUNITY',
            title: 'MARKET OPPORTUNITY',
            selected_filters: {
                Category: {
                    checked: 'All',
                    label: 'Category',
                    options: ['All']
                },
                Industry: {
                    checked: 'Beer',
                    label: 'Industry',
                    options: ['Beer']
                },
                Region: {
                    checked: 'USA',
                    label: 'Region',
                    options: ['USA']
                },
                'Sub Category': {
                    checked: 'All',
                    label: 'Sub Category',
                    options: ['All']
                },
                'Time Frame': {
                    checked: 'CY 2020',
                    label: 'Time Frame',
                    options: ['CY 2020']
                }
            }
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetGraph {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render AppScreen Component 4', () => {
        const props = {
            alert_enable: true,
            app_id: '26',
            data: {
                data: {
                    widget_value_id: 1097,
                    value: {
                        data: [
                            {
                                direction: 'clockwise',
                                hole: 0.55,
                                labels: ['Market Share', '<span style="color: white">-</span>'],
                                marker: {
                                    colors: ['#5faff9', '#fff'],
                                    line: { color: 'white', width: 1 }
                                },
                                sort: false,
                                textinfo: 'none',
                                textposition: 'none',
                                type: 'pie',
                                values: [32, 68]
                            },
                            {
                                direction: 'clockwise',
                                hole: 0.7,
                                labels: [
                                    'Served Available Market',
                                    '<span style="color: white">-</span>'
                                ],
                                marker: {
                                    colors: ['#e08244', '#fff'],
                                    line: { color: 'white', width: 1 }
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
                                labels: [
                                    'Total Addressable Market',
                                    '<span style="color: white">-</span>'
                                ],
                                marker: {
                                    colors: ['#3a3a3a', '#fff'],
                                    line: { color: 'white', width: 1 }
                                },
                                sort: false,
                                textinfo: 'none',
                                textposition: 'none',
                                type: 'pie',
                                values: [100, 0]
                            }
                        ],
                        layout: {
                            legend: { traceorder: 'reversed' },
                            template: {
                                data: {},
                                layout: {}
                            },
                            updatemenus: [
                                {
                                    position: 'bm',
                                    active: 0,
                                    buttons: [
                                        {
                                            args: [
                                                {
                                                    visible: [
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false
                                                    ]
                                                }
                                            ],
                                            label: 'Price',
                                            method: 'update'
                                        },
                                        {
                                            args: [
                                                {
                                                    visible: [
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false,
                                                        false
                                                    ]
                                                }
                                            ],
                                            label: 'RPI',
                                            method: 'update'
                                        }
                                    ],
                                    direction: 'down',
                                    name: 'Metric',
                                    pad: {
                                        r: 10,
                                        t: 10
                                    },
                                    showactive: false,
                                    x: 0.1,
                                    xanchor: 'left',
                                    y: 1.5,
                                    yanchor: 'top',
                                    hideMenus: {
                                        Price: ['Competitor']
                                    }
                                }
                            ]
                        }
                    },
                    simulated_value: false
                }
            },
            dataProvided: true,
            details: {
                config: {
                    legend: false,
                    prefix: false,
                    subtitle: false,
                    title: false,
                    traces: false,
                    value_factor: false
                },
                id: 488,
                is_label: false,
                widget_index: 0,
                widget_key: 'Market Opportunity'
            },
            graph_height: 'half',
            parent_obj: {},
            screenId: 103,
            screen_filter_settings: false,
            screen_id: 103,
            screens: [],
            simulator_apply: false,
            source: 'Integrated Demand Forecasting >> Demand Sizing >> MARKET OPPORTUNITY',
            title: 'MARKET OPPORTUNITY',
            selected_filters: {
                Category: {
                    checked: 'All',
                    label: 'Category',
                    options: ['All']
                },
                Industry: {
                    checked: 'Beer',
                    label: 'Industry',
                    options: ['Beer']
                },
                Region: {
                    checked: 'USA',
                    label: 'Region',
                    options: ['USA']
                },
                'Sub Category': {
                    checked: 'All',
                    label: 'Sub Category',
                    options: ['All']
                },
                'Time Frame': {
                    checked: 'CY 2020',
                    label: 'Time Frame',
                    options: ['CY 2020']
                }
            }
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetGraph {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should display error message and icon when error occurs', () => {
        const props = {
            classes: {
                graphLoader: 'AppWidgetGraph-graphLoader-151',
                graphLoaderIcon: 'AppWidgetGraph-graphLoaderIcon-152',
                graphLoaderColor: 'AppWidgetGraph-graphLoaderColor-153',
                skeletonWave: 'AppWidgetGraph-skeletonWave-154',
                graphBody: 'AppWidgetGraph-graphBody-155',
                graphWrapper: 'AppWidgetGraph-graphWrapper-156',
                graphHalfWrapper: 'AppWidgetGraph-graphHalfWrapper-157',
                graphLabel: 'AppWidgetGraph-graphLabel-158',
                graphActionsBar: 'AppWidgetGraph-graphActionsBar-159',
                actionsBarItem: 'AppWidgetGraph-actionsBarItem-160',
                actionsBarItemLeftContainer: 'AppWidgetGraph-actionsBarItemLeftContainer-161',
                downloadButton: 'AppWidgetGraph-downloadButton-162',
                graphActions: 'AppWidgetGraph-graphActions-163',
                graphContainer: 'AppWidgetGraph-graphContainer-164',
                halfSearchBar: 'AppWidgetGraph-halfSearchBar-165',
                simulateButton: 'AppWidgetGraph-simulateButton-166',
                simulatorButtons: 'AppWidgetGraph-simulatorButtons-167',
                simulatorTableHeaders: 'AppWidgetGraph-simulatorTableHeaders-168',
                simulatorTableHeaderText: 'AppWidgetGraph-simulatorTableHeaderText-169',
                simulatorTableCell: 'AppWidgetGraph-simulatorTableCell-170',
                simulatorTableCellText: 'AppWidgetGraph-simulatorTableCellText-171',
                simulatorTableCellInput: 'AppWidgetGraph-simulatorTableCellInput-172',
                simulatorTableFirstColCell: 'AppWidgetGraph-simulatorTableFirstColCell-173',
                simulatorTableFirstColCellText: 'AppWidgetGraph-simulatorTableFirstColCellText-174',
                graphSimulatorContainer: 'AppWidgetGraph-graphSimulatorContainer-175',
                graphSimulatorHalfContainer: 'AppWidgetGraph-graphSimulatorHalfContainer-176',
                simulatorBodyContainer: 'AppWidgetGraph-simulatorBodyContainer-177',
                simulatorBodyContainerMultiple: 'AppWidgetGraph-simulatorBodyContainerMultiple-178',
                simulatorFormDivider: 'AppWidgetGraph-simulatorFormDivider-179',
                simulatorSliderLabel: 'AppWidgetGraph-simulatorSliderLabel-180',
                simulatorSliderInput: 'AppWidgetGraph-simulatorSliderInput-181',
                simulatorSliderInputBox: 'AppWidgetGraph-simulatorSliderInputBox-182',
                simulatorSectionHeader: 'AppWidgetGraph-simulatorSectionHeader-183',
                simulatorOptimizeCellLabel: 'AppWidgetGraph-simulatorOptimizeCellLabel-184',
                simulatorOptimizeCellInput: 'AppWidgetGraph-simulatorOptimizeCellInput-185',
                graphFilterMenuItem: 'AppWidgetGraph-graphFilterMenuItem-186',
                graphFilterMenuItemSelected: 'AppWidgetGraph-graphFilterMenuItemSelected-187',
                graphFilterMenuSearchItem: 'AppWidgetGraph-graphFilterMenuSearchItem-188',
                graphFilterMenuSearchInput: 'AppWidgetGraph-graphFilterMenuSearchInput-189',
                graphFilterMenuSearchIcon: 'AppWidgetGraph-graphFilterMenuSearchIcon-190',
                filterMenuContainer: 'AppWidgetGraph-filterMenuContainer-191',
                gridTableBody: 'AppWidgetGraph-gridTableBody-192',
                graphOptionContainer: 'AppWidgetGraph-graphOptionContainer-193',
                graphOptionLabel: 'AppWidgetGraph-graphOptionLabel-194',
                graphOptionValue: 'AppWidgetGraph-graphOptionValue-195',
                graphOptionValueType: 'AppWidgetGraph-graphOptionValueType-196',
                graphOptionIcon: 'AppWidgetGraph-graphOptionIcon-197',
                graphOptionMenu: 'AppWidgetGraph-graphOptionMenu-198',
                storyCheckbox: 'AppWidgetGraph-storyCheckbox-199',
                downloadButtonSingleTable: 'AppWidgetGraph-downloadButtonSingleTable-200'
            },
            parent_obj: {
                props: 'Object',
                context: 'Object',
                refs: 'Object',
                updater: 'Object',
                onResponseGetScreen: 'fn()',
                getLabels: 'fn()',
                getGraphs: 'fn()',
                getWidgetData: 'fn()',
                onApplySimulator: 'fn()',
                onSimulatorApplyDrilldown: 'fn()',
                state: 'Object',
                _reactInternalFiber: 'Object',
                _reactInternalInstance: 'Object',
                isReactComponent: 'Object',
                setState: 'fn()',
                forceUpdate: 'fn()'
            },
            app_id: '269',
            screen_id: 6781,
            title: 'INVENTORY REVIEW',
            details: {
                id: 18115,
                widget_index: 0,
                widget_key: 'Inventory Review',
                is_label: false,
                config: 'Object'
            },
            selected_filters: {
                Region: { options: ['All'], checked: 'All', label: 'Region' },
                Category: {
                    options: [
                        'Air Conditioner',
                        'Mobiles',
                        'Refrigerator',
                        'Tablets',
                        'Washing Machines'
                    ],
                    checked: 'Air Conditioner',
                    label: 'Category'
                },
                Year: { options: ['2018', '2019', '2020', '2021'], checked: '2018', label: 'Year' },
                Month: { options: ['Q1', 'Q2'], checked: 'Q1', label: 'Month' },
                Product: { options: ['Product 1'], checked: 'Product 1', label: 'Product' }
            },
            simulator_apply: false,
            graph_height: 'full',
            screen_filter_settings: false,
            data: {
                data: {
                    widget_value_id: 1124755,
                    value: {
                        layout: { updatemenus: [{ position: 'bm' }] },
                        flow_table: {
                            name: 'Total Inventory Management Cost',
                            sub_title: '£2m [12% YoY]',
                            sub_title_direction: 'up',
                            data: [
                                {
                                    name: 'RDCs',
                                    incoming_text: 'Forecast Demand: 20k Units',
                                    table_headers: [
                                        'Regional Distribution Centres',
                                        'On Hand Inventory',
                                        'Estimated Demand'
                                    ],
                                    table_data: [
                                        { cols: ['RDC 1', '14k Units', '5k Units'], rowspan: 4 },
                                        { cols: ['RDC 2', '10k Units', '7k Units'], rowspan: 2 }
                                    ]
                                },
                                {
                                    name: 'DCs',
                                    incoming_text: 'Forecast Demand: 6k Units',
                                    table_headers: [
                                        'Distribution Centres',
                                        'On Hand Inventory',
                                        'Estimated Demand'
                                    ],
                                    table_data: ['Object', 'Object', 'Object']
                                },
                                'Object'
                            ]
                        }
                    },
                    simulated_value: false
                }
            }
        };
        const { container } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetGraph {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const element = container.querySelector('.AppWidgetGraph-graphActionsBar-159');
        expect(element).toBeInTheDocument();
    });
});
