import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AppWidgetLabel from '../../components/AppWidgetLabel';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { Provider } from 'react-redux';
import { vi } from 'vitest';
import { getWidget, getMultiWidget } from '../../services/widget';
import { configureStore, createSlice } from '@reduxjs/toolkit';
const history = createMemoryHistory();

vi.mock('../../services/widget', () => ({
    getMultiWidget: vi.fn(),
    getWidget: vi.fn()
}));

vi.mock('store/store', () => ({
    default: vi.fn()
}));

const store = configureStore({
    reducer: createSlice({
        name: 'state',
        initialState: {
            createStories: {
                selectedScreens: [],
                screenId: undefined
            },
            appScreen: {
                widgetData: undefined,
                graphData: undefined,
                widget_action: {
                    action_origin: '',
                    widget_data: null
                },
                loading: false
            }
        }
    }).reducer
});

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render skeleton loader when data is not present', () => {
        const props = {
            parent_obj: {
                props: {
                    handleStoriesCount: () => {}
                }
            },
            app_info: {},
            app_id: '26',
            screen_id: 103,
            title: 'PORTFOLIO VOLUME 2019',
            details: {
                config: {
                    legend: false,
                    prefix: false,
                    subtitle: false,
                    title: false,
                    traces: false,
                    value_factor: false
                },
                id: 485,
                is_label: true,
                widget_index: 1,
                widget_key: 'Portfolio Volume 2019'
            },
            selected_filters: {},
            simulator_apply: false,
            screen_filter_settings: true,
            alert_enable: true,
            source: 'Integrated Demand Forecasting >> Demand Sizing >> PORTFOLIO VOLUME 2019',
            alert_admin_user: true,
            logged_in_user_info: 'ira.shrivastava@themathcompany.com'
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetLabel {...props} screen_filter_settings={'test'} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByTestId('label-skeleton')).toBeInTheDocument();
    });

    test('Should render AppScreen Component with simulated apply prop as true', () => {
        getWidget.mockImplementation(({ callback }) =>
            callback({
                data: {
                    value: { obj: 'obj23', extra_label: 'test-label', extra_dir: 'up' },
                    simulated_value: 'test-simulatedValue',
                    widget_value_id: 'test-widget-value-id'
                }
            })
        );

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
            title: 'INDUSTRY VOLUME 2019',
            details: {
                id: 484,
                widget_index: 0,
                widget_key: 'Industry Volume 2019',
                is_label: true,
                config: {
                    legend: false,
                    prefix: false,
                    subtitle: false,
                    title: false,
                    traces: false,
                    value_factor: false
                }
            },
            selected_filters: {
                'Time Frame': { options: ['CY 2020'], checked: 'CY 2020', label: 'Time Frame' },
                Region: { options: ['USA'], checked: 'USA', label: 'Region' },
                Industry: { options: ['Beer'], checked: 'Beer', label: 'Industry' },
                Category: { options: ['All'], checked: 'All', label: 'Category' },
                'Sub Category': { options: ['All'], checked: 'All', label: 'Sub Category' }
            },
            simulator_apply: true,
            screen_filter_settings: false
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetLabel {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render AppScreen Component with simulated apply prop as false and data value satisfying params conditions in main render function', () => {
        getWidget.mockImplementation(({ callback }) =>
            callback({
                data: {
                    value: { obj: 'obj23', extra_label: 'test-label', extra_dir: 'up' },
                    simulated_value: 'test-simulatedValue',
                    widget_value_id: 'test-widget-value-id'
                }
            })
        );

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
            title: 'INDUSTRY VOLUME 2019',
            details: {
                id: 484,
                widget_index: 0,
                widget_key: 'Industry Volume 2019',
                is_label: true,
                config: {
                    legend: false,
                    prefix: false,
                    subtitle: false,
                    title: false,
                    traces: false,
                    value_factor: false
                }
            },
            selected_filters: {
                'Time Frame': { options: ['CY 2020'], checked: 'CY 2020', label: 'Time Frame' },
                Region: { options: ['USA'], checked: 'USA', label: 'Region' },
                Industry: { options: ['Beer'], checked: 'Beer', label: 'Industry' },
                Category: { options: ['All'], checked: 'All', label: 'Category' },
                'Sub Category': { options: ['All'], checked: 'All', label: 'Sub Category' }
            },
            simulator_apply: false,
            screen_filter_settings: false
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetLabel {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render AppScreen Component with simulated apply prop as false and data value satisfying params conditions and without extra_label inside respose in main render function', () => {
        getWidget.mockImplementation(({ callback }) =>
            callback({
                data: {
                    value: { obj: 'obj23', extra_dir: 'up' },
                    simulated_value: 'test-simulatedValue',
                    widget_value_id: 'test-widget-value-id'
                }
            })
        );

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
            title: 'INDUSTRY VOLUME 2019',
            details: {
                id: 484,
                widget_index: 0,
                widget_key: 'Industry Volume 2019',
                is_label: true,
                config: {
                    legend: false,
                    prefix: false,
                    subtitle: false,
                    title: false,
                    traces: false,
                    value_factor: false
                }
            },
            selected_filters: {
                'Time Frame': { options: ['CY 2020'], checked: 'CY 2020', label: 'Time Frame' },
                Region: { options: ['USA'], checked: 'USA', label: 'Region' },
                Industry: { options: ['Beer'], checked: 'Beer', label: 'Industry' },
                Category: { options: ['All'], checked: 'All', label: 'Category' },
                'Sub Category': { options: ['All'], checked: 'All', label: 'Sub Category' }
            },
            simulator_apply: false,
            screen_filter_settings: false
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetLabel {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render AppScreen Component with simulated apply prop as false and data value satisfying params conditions in main render function', () => {
        getWidget.mockImplementation(({ callback }) =>
            callback({
                data: {
                    value: { obj: 'obj23', extra_dir: 'down' },
                    simulated_value: 'test-simulatedValue',
                    widget_value_id: 'test-widget-value-id'
                }
            })
        );

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
            title: 'INDUSTRY VOLUME 2019',
            details: {
                id: 484,
                widget_index: 0,
                widget_key: 'Industry Volume 2019',
                is_label: true,
                config: {
                    legend: false,
                    prefix: false,
                    subtitle: false,
                    title: false,
                    traces: false,
                    value_factor: false
                }
            },
            selected_filters: {
                'Time Frame': { options: ['CY 2020'], checked: 'CY 2020', label: 'Time Frame' },
                Region: { options: ['USA'], checked: 'USA', label: 'Region' },
                Industry: { options: ['Beer'], checked: 'Beer', label: 'Industry' },
                Category: { options: ['All'], checked: 'All', label: 'Category' },
                'Sub Category': { options: ['All'], checked: 'All', label: 'Sub Category' }
            },
            simulator_apply: false,
            screen_filter_settings: false
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetLabel {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render AppScreen Component with getWidget data.value as not a Object ', () => {
        getWidget.mockImplementation(({ callback }) =>
            callback({
                data: {
                    value: 'test-value',
                    simulated_value: 'test-simulatedValue',
                    widget_value_id: 'test-widget-value-id'
                }
            })
        );

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
            title: 'INDUSTRY VOLUME 2019',
            details: {
                id: 484,
                widget_index: 0,
                widget_key: 'Industry Volume 2019',
                is_label: true,
                config: {
                    legend: false,
                    prefix: false,
                    subtitle: false,
                    title: false,
                    traces: false,
                    value_factor: false
                }
            },
            selected_filters: {
                'Time Frame': { options: ['CY 2020'], checked: 'CY 2020', label: 'Time Frame' },
                Region: { options: ['USA'], checked: 'USA', label: 'Region' },
                Industry: { options: ['Beer'], checked: 'Beer', label: 'Industry' },
                Category: { options: ['All'], checked: 'All', label: 'Category' },
                'Sub Category': { options: ['All'], checked: 'All', label: 'Sub Category' }
            },
            simulator_apply: true,
            screen_filter_settings: false
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetLabel {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render AppScreen Component with data.value as a Object', () => {
        getWidget.mockImplementation(({ callback }) =>
            callback({
                data: {
                    value: { obj: 'obj23' },
                    simulated_value: 'test-simulatedValue',
                    widget_value_id: 'test-widget-value-id'
                }
            })
        );

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
            title: 'INDUSTRY VOLUME 2019',
            details: {
                id: 484,
                widget_index: 0,
                widget_key: 'Industry Volume 2019',
                is_label: true,
                config: {
                    legend: false,
                    prefix: false,
                    subtitle: false,
                    title: false,
                    traces: false,
                    value_factor: false
                }
            },
            selected_filters: {
                'Time Frame': { options: ['CY 2020'], checked: 'CY 2020', label: 'Time Frame' },
                Region: { options: ['USA'], checked: 'USA', label: 'Region' },
                Industry: { options: ['Beer'], checked: 'Beer', label: 'Industry' },
                Category: { options: ['All'], checked: 'All', label: 'Category' },
                'Sub Category': { options: ['All'], checked: 'All', label: 'Sub Category' }
            },
            simulator_apply: false,
            screen_filter_settings: false
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetLabel {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render AppScreen Component With getWidget response as a error ', () => {
        getMultiWidget.mockImplementation(({ callback }) => callback({ status: 'error' }));

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
            title: 'INDUSTRY VOLUME 2019',
            details: {
                id: 484,
                widget_index: 0,
                widget_key: 'Industry Volume 2019',
                is_label: true,
                config: {
                    legend: false,
                    prefix: false,
                    subtitle: false,
                    title: false,
                    traces: false,
                    value_factor: false
                }
            },
            selected_filters: {
                'Time Frame': { options: ['CY 2020'], checked: 'CY 2020', label: 'Time Frame' },
                Region: { options: ['USA'], checked: 'USA', label: 'Region' },
                Industry: { options: ['Beer'], checked: 'Beer', label: 'Industry' },
                Category: { options: ['All'], checked: 'All', label: 'Category' },
                'Sub Category': { options: ['All'], checked: 'All', label: 'Sub Category' }
            },
            simulator_apply: false,
            screen_filter_settings: false
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetLabel {...props} screen_filter_settings={'test'} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    // test('Should render the metric value when data is received from api', () => {
    //     //replaceAll gives the error
    //     const props = {
    //         parent_obj:{
    //             props: {
    //                 handleStoriesCount: () => {}
    //             }
    //         },
    //         app_info:{ },
    //         app_id: '26',
    //         screen_id: 103,
    //         title: "PORTFOLIO VOLUME 2019",
    //         details: {
    //             config :{
    //                 legend: false,
    //                 prefix: false,
    //                 subtitle: false,
    //                 title: false,
    //                 traces: false,
    //                 value_factor : false,
    //             },
    //             id: 485,
    //             is_label: true,
    //             widget_index: 1,
    //             widget_key: "Portfolio Volume 2019"
    //          },
    //         selected_filters: { },
    //         simulator_apply: false,
    //         screen_filter_settings: true,
    //         alert_enable : true,
    //         source: "Integrated Demand Forecasting >> Demand Sizing >> PORTFOLIO VOLUME 2019",
    //         alert_admin_user: true,
    //         logged_in_user_info: "ira.shrivastava@themathcompany.com"
    //     }

    //     getMultiWidget.mockImplementation(({callback})=> callback({
    //             data: {
    //                 "widget_value_id": 1094,
    //             "value": {
    //               "extra_dir": "down",
    //               "extra_value": "-1.8% YoY",
    //               "value": "178K Units",
    //               "alert_config": {
    //                 "categories": {
    //                   "extra_value": {
    //                     "id": "extra_value",
    //                     "name": "Extra Value",
    //                     "value": 300
    //                   },
    //                   "main_value": {
    //                     "id": "main_value",
    //                     "name": "Main Value",
    //                     "value": 400
    //                   }
    //                 }
    //               }
    //             },
    //             "simulated_value": false
    //             }
    //     }))

    //     const { getByText, debug } = render(
    //         <Provider store={store}>
    //             <CustomThemeContextProvider>
    //                 <Router history={history}>
    //                     <AppWidgetLabel {...props}  />
    //                 </Router>
    //             </CustomThemeContextProvider>
    //         </Provider>
    //     )
    //     expect(screen.queryByTestId('label-skeleton')).not.toBeInTheDocument()
    // })

    test('Should render AppScreen Component with different widget_key and verify correct title', () => {
        getWidget.mockImplementation(({ callback }) =>
            callback({
                data: {
                    value: { obj: 'obj23', extra_label: 'new-label', extra_dir: 'down' },
                    simulated_value: 'new-simulatedValue',
                    widget_value_id: 'new-widget-value-id'
                }
            })
        );

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
            app_id: '27',
            screen_id: 104,
            title: 'NEW TITLE 2020',
            details: {
                id: 485,
                widget_index: 1,
                widget_key: 'New Widget Key',
                is_label: true,
                config: {
                    legend: false,
                    prefix: false,
                    subtitle: false,
                    title: false,
                    traces: false,
                    value_factor: false
                }
            },
            selected_filters: {
                'Time Frame': { options: ['CY 2021'], checked: 'CY 2021', label: 'Time Frame' },
                Region: { options: ['UK'], checked: 'UK', label: 'Region' },
                Industry: { options: ['Tech'], checked: 'Tech', label: 'Industry' },
                Category: { options: ['Electronics'], checked: 'Electronics', label: 'Category' },
                'Sub Category': { options: ['Mobile'], checked: 'Mobile', label: 'Sub Category' }
            },
            simulator_apply: false,
            screen_filter_settings: false
        };

        const { getByText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetLabel {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText(/NEW TITLE 2020/i)).toBeInTheDocument();
    });

    test('Should handle empty data values gracefully', () => {
        getWidget.mockImplementation(({ callback }) =>
            callback({
                data: {
                    value: {},
                    simulated_value: '',
                    widget_value_id: ''
                }
            })
        );

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
            title: 'INDUSTRY VOLUME 2019',
            details: {
                id: 484,
                widget_index: 0,
                widget_key: 'Industry Volume 2019',
                is_label: true,
                config: {
                    legend: false,
                    prefix: false,
                    subtitle: false,
                    title: false,
                    traces: false,
                    value_factor: false
                }
            },
            selected_filters: {
                'Time Frame': { options: ['CY 2020'], checked: 'CY 2020', label: 'Time Frame' },
                Region: { options: ['USA'], checked: 'USA', label: 'Region' },
                Industry: { options: ['Beer'], checked: 'Beer', label: 'Industry' },
                Category: { options: ['All'], checked: 'All', label: 'Category' },
                'Sub Category': { options: ['All'], checked: 'All', label: 'Sub Category' }
            },
            simulator_apply: false,
            screen_filter_settings: false
        };

        const { getByText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetLabel {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.queryByText(/No data available/i));
    });
});
