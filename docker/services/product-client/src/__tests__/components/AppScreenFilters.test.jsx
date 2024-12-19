import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AppScreenFilters from '../../components/AppScreenFilters';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { getFilters } from '../../services/filters';
import { vi } from 'vitest';

vi.mock('../../services/filters', () => ({
    getFilters: vi.fn()
}));

const history = createMemoryHistory();

global.document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document
    }
});

const mockSessionStorage = (function () {
    let store = {
        app_filter_info_26: {
            Category: 'All',
            Industry: 'Beer',
            Region: 'USA',
            'Sub Category': 'All',
            'Time Frame': 'CY 2020'
        }
    };

    return {
        getItem: function (key) {
            return JSON.stringify(store[key] || null);
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

describe('Codex Product test', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'sessionStorage', {
            value: mockSessionStorage
        });
    });
    afterEach(cleanup);
    test('Should render AppScreenFilter Component', () => {
        const props = {
            classes: {
                appBar: 'AppScreenFilters-appBar-136',
                filterToolbar: 'AppScreenFilters-filterToolbar-137',
                filterButton: 'AppScreenFilters-filterButton-138',
                filterToolbarButton: 'AppScreenFilters-filterToolbarButton-139',
                filterRadioLabel: 'AppScreenFilters-filterRadioLabel-140',
                grow: 'AppScreenFilters-grow-141',
                hide: 'AppScreenFilters-hide-142',
                iconButtonProgress: 'AppScreenFilters-iconButtonProgress-143',
                filtersGridBody: 'AppScreenFilters-filtersGridBody-144',
                filterCategoryBody: 'AppScreenFilters-filterCategoryBody-145',
                filterOptionContainer: 'AppScreenFilters-filterOptionContainer-146',
                filterOptionHeader: 'AppScreenFilters-filterOptionHeader-147',
                filterOptionValue: 'AppScreenFilters-filterOptionValue-148',
                filterFormControl: 'AppScreenFilters-filterFormControl-149',
                filterToolbarLabel: 'AppScreenFilters-filterToolbarLabel-150',
                radio: 'AppScreenFilters-radio-151',
                radioChecked: 'AppScreenFilters-radioChecked-152'
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
            app_id: '26',
            screen_id: 103,
            app_info: {
                id: 26,
                name: 'Integrated Demand Forecasting',
                theme: 'blue',
                screens: 'Array[31]',
                modules: 'Object',
                industry: 'CPG',
                function: 'Supply Chain',
                description: 'Forecast demand and potential growth opportunity',
                blueprint_link: '/projects/2/design',
                config_link: '/projects/2/case-studies/78/notebooks/101/app-configs/10/edit',
                approach_url: false,
                logo_url: false,
                small_logo_url: false,
                story_count: 8,
                restricted_app: false,
                is_user_admin: true,
                permissions: false
            },
            open: false,
            theme: {
                breakpoints: 'Object',
                direction: 'ltr',
                mixins: 'Object',
                overrides: 'Object',
                palette: {
                    text: {
                        default: '#220047'
                    }
                },
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
                    <AppScreenFilters {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render AppScreenFilter1 Component', () => {
        const app_info = {
            approach_url: false,
            blueprint_link: '/projects/2/design',
            config_link: '/projects/2/case-studies/78/notebooks/101/app-configs/10/edit',
            description: 'Forecast demand and potential growth opportunity',
            function: 'Supply Chain',
            id: 26,
            industry: 'CPG',
            is_user_admin: true,
            logo_url: false,
            modules: {
                alerts: true,
                dashboard: false,
                filter_settings: {
                    Brand: {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Brand',
                        parent: 'Sub Category'
                    },
                    Category: {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Category',
                        parent: 'Industry'
                    },
                    Industry: {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Industry',
                        parent: 'Region'
                    },
                    Region: {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Region',
                        parent: 'Time Frame'
                    },
                    'Sub Category': {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Sub Category',
                        parent: 'Category'
                    },
                    'Time Frame': {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Time Frame',
                        parent: ''
                    }
                },
                filters: true,
                navigator: { enabled: true },
                user_mgmt: false
            },
            name: 'Integrated Demand Forecasting',
            permissions: false,
            restricted_app: false,
            screens: [
                {
                    action_settings: false,
                    graph_type: null,
                    horizontal: null,
                    id: 101,
                    level: null,
                    rating_url: null,
                    screen_auto_refresh: null,
                    screen_description: null,
                    screen_filters_open: null,
                    screen_filters_values: false,
                    screen_image: null,
                    screen_index: 0,
                    screen_name: 'Demand Analysis',
                    widget_count: 0
                }
            ],
            small_logo_url: false,
            story_count: 0,
            theme: 'blue'
        };
        const props = {
            classes: {
                appBar: 'AppScreenFilters-appBar-136',
                filterToolbar: 'AppScreenFilters-filterToolbar-137',
                filterButton: 'AppScreenFilters-filterButton-138',
                filterToolbarButton: 'AppScreenFilters-filterToolbarButton-139',
                filterRadioLabel: 'AppScreenFilters-filterRadioLabel-140',
                grow: 'AppScreenFilters-grow-141',
                hide: 'AppScreenFilters-hide-142',
                iconButtonProgress: 'AppScreenFilters-iconButtonProgress-143',
                filtersGridBody: 'AppScreenFilters-filtersGridBody-144',
                filterCategoryBody: 'AppScreenFilters-filterCategoryBody-145',
                filterOptionContainer: 'AppScreenFilters-filterOptionContainer-146',
                filterOptionHeader: 'AppScreenFilters-filterOptionHeader-147',
                filterOptionValue: 'AppScreenFilters-filterOptionValue-148',
                filterFormControl: 'AppScreenFilters-filterFormControl-149',
                filterToolbarLabel: 'AppScreenFilters-filterToolbarLabel-150',
                radio: 'AppScreenFilters-radio-151',
                radioChecked: 'AppScreenFilters-radioChecked-152'
            },
            parent_obj: {
                props: {
                    location: { pathname: '/app/26/objectives/' }
                },
                context: 'Object',
                refs: 'Object',
                updater: 'Object',
                onResponseGetScreen: 'fn()',
                getLabels: 'fn()',
                getGraphs: 'fn()',
                getWidgetData: () => {},
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
            app_info: app_info,
            open: false,
            theme: {
                breakpoints: 'Object',
                direction: 'ltr',
                mixins: 'Object',
                overrides: 'Object',
                palette: {
                    text: {
                        default: '#220047'
                    }
                },
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
        //mockSessionStorage.getItem('app_filter_info_26')
        getFilters.mockImplementation(({ callback }) =>
            callback({
                values: [
                    {
                        Category: 'All',
                        Industry: 'Beer',
                        Region: 'USA',
                        'Sub Category': 'All',
                        'Time Frame': 'CY 2020'
                    },
                    {
                        Category: 'All',
                        Industry: 'Beer',
                        Region: 'USA',
                        'Sub Category': 'All',
                        'Time Frame': 'CY 2020'
                    }
                ],
                topics: {
                    Category: ['All'],
                    Industry: ['Beer'],
                    Region: ['USA'],
                    'Sub Category': ['All'],
                    'Time Frame': ['CY 2020']
                }
            })
        );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenFilters {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(
            screen.getByText('You can not change the filter selections', { exact: false })
        ).toBeInTheDocument();
        expect(screen.getByLabelText('default-filter')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('default-filter'));
    });
    test('Should render AppScreenFilter2 Component', () => {
        const app_info = {
            approach_url: false,
            blueprint_link: '/projects/2/design',
            config_link: '/projects/2/case-studies/78/notebooks/101/app-configs/10/edit',
            description: 'Forecast demand and potential growth opportunity',
            function: 'Supply Chain',
            id: 26,
            industry: 'CPG',
            is_user_admin: true,
            logo_url: false,
            modules: {
                alerts: true,
                dashboard: false,
                filter_settings: {
                    Brand: {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Brand',
                        parent: 'Sub Category'
                    },
                    Category: {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Category',
                        parent: 'Industry'
                    },
                    Industry: {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Industry',
                        parent: 'Region'
                    },
                    Region: {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Region',
                        parent: 'Time Frame'
                    },
                    'Sub Category': {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Sub Category',
                        parent: 'Category'
                    },
                    'Time Frame': {
                        enabled: false,
                        exclude: [],
                        include: '',
                        label: 'Time Frame',
                        parent: ''
                    }
                },
                filters: true,
                //navigator: { enabled: true },
                user_mgmt: false
            },
            name: 'Integrated Demand Forecasting',
            permissions: {
                data: {
                    'Time Frame': 'CY 2020'
                }
            },
            restricted_app: false,
            screens: [
                {
                    action_settings: false,
                    graph_type: null,
                    horizontal: null,
                    id: 101,
                    level: null,
                    rating_url: null,
                    screen_auto_refresh: null,
                    screen_description: null,
                    screen_filters_open: null,
                    screen_filters_values: false,
                    screen_image: null,
                    screen_index: 0,
                    screen_name: 'Demand Analysis',
                    widget_count: 0
                }
            ],
            small_logo_url: false,
            story_count: 0,
            theme: 'blue'
        };
        const props = {
            parent_obj: {
                props: {
                    location: { pathname: '/app/26' }
                },
                context: 'Object',
                refs: 'Object',
                updater: 'Object',
                onResponseGetScreen: 'fn()',
                getLabels: 'fn()',
                getGraphs: 'fn()',
                getWidgetData: () => {},
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
            app_info: app_info,
            open: false,
            theme: {
                breakpoints: 'Object',
                direction: 'ltr',
                mixins: 'Object',
                overrides: 'Object',
                palette: {
                    text: {
                        default: '#220047'
                    }
                },
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
        getFilters.mockImplementation(({ callback }) =>
            callback({
                values: [
                    {
                        Category: 'All',
                        Industry: 'Beer',
                        Region: 'USA',
                        'Sub Category': 'All',
                        'Time Frame': 'CY 2020'
                    },
                    {
                        Category: 'All',
                        Industry: 'Beer',
                        Region: 'USA',
                        'Sub Category': 'All',
                        'Time Frame': 'CY 2020'
                    }
                ],
                topics: {
                    Category: ['All'],
                    Industry: ['Beer'],
                    //Region: ['USA'],
                    'Sub Category': ['All'],
                    'Time Frame': ['CY 2020']
                }
            })
        );
        //mockSessionStorage.getItem('app_filter_info_26')
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenFilters {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByLabelText('filters')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('filters'));
        expect(screen.getByLabelText('apply filter')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('apply filter'));
    });
    test('Should render AppScreenFilter3 Component', () => {
        const app_info = {
            approach_url: `${
                import.meta.env['REACT_APP_STATIC_DATA_ASSET']
            }/codex-products-local/CPG - Marketing and Media Planning.pptx?se=2022-01-17T08%3A12%3A42Z&sp=r&sv=2018-03-28&sr=b&sig=iOAtTCH409ZKCpDcdiawyJ44Yog69q4Iiwthmqgp9Ak%3D`,
            blueprint_link: '/projects/1/design',
            config_link: '/projects/1/case-studies/92/notebooks/114/app-configs/8/edit',
            description: 'Optimize spend across channels / media vehicles to maximize RoI',
            function: 'Marketing',
            id: 49,
            industry: 'CPG',
            is_user_admin: true,
            logo_url: false,
            modules: {
                dashboard: false,
                filter_settings: {
                    Brand: {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Brand',
                        parent: 'Portfolio'
                    },
                    Channel: {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Channel',
                        parent: 'Brand'
                    },
                    Geography: {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Geography',
                        parent: 'Timeframe'
                    },
                    Portfolio: {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Portfolio',
                        parent: 'Geography'
                    },
                    Timeframe: {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Timeframe',
                        parent: ''
                    }
                },
                filters: true,
                user_mgmt: false
            },
            name: 'Marketing & Media Planner',
            permissions: false,
            restricted_app: false,
            // permissions: {
            //   data: {
            //     'Time Frame': 'CY 2020'
            //   }
            // },
            screens: [
                {
                    action_settings: false,
                    graph_type: null,
                    horizontal: null,
                    id: 89,
                    level: null,
                    rating_url: null,
                    screen_auto_refresh: null,
                    screen_description: null,
                    screen_filters_open: null,
                    screen_filters_values: false,
                    screen_image: null,
                    screen_index: 0,
                    screen_name: 'Review KPIs',
                    widget_count: 0
                }
            ],
            small_logo_url: false,
            story_count: 0,
            theme: 'blue'
        };
        const props = {
            parent_obj: {
                props: {
                    location: { pathname: '/app/49' }
                },
                context: 'Object',
                refs: 'Object',
                updater: 'Object',
                onResponseGetScreen: 'fn()',
                getLabels: 'fn()',
                getGraphs: 'fn()',
                getWidgetData: () => {},
                onApplySimulator: 'fn()',
                onSimulatorApplyDrilldown: 'fn()',
                state: 'Object',
                _reactInternalFiber: 'Object',
                _reactInternalInstance: 'Object',
                isReactComponent: 'Object',
                setState: 'fn()',
                forceUpdate: 'fn()'
            },
            app_info: app_info
        };
        getFilters.mockImplementation(({ callback }) =>
            callback({
                values: [
                    {
                        Geography: 'Mexico',
                        Timeframe: 'CY 2020'
                    },
                    {
                        Geography: 'Mexico',
                        Timeframe: 'CY 2020'
                    }
                ],
                topics: {
                    Geography: ['Mexico'],
                    Timeframe: ['CY 2020']
                }
            })
        );
        //mockSessionStorage.getItem('app_filter_info_26')
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenFilters {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByLabelText('filters')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('filters'));
        expect(screen.getByLabelText('close filter')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('close filter'));
    });
    test('Should render AppScreenFilter4 Component', () => {
        const app_info = {
            approach_url: false,
            blueprint_link: '/projects/2/design',
            config_link: '/projects/2/case-studies/78/notebooks/101/app-configs/10/edit',
            description: 'Forecast demand and potential growth opportunity',
            function: 'Supply Chain',
            id: 26,
            industry: 'CPG',
            is_user_admin: true,
            logo_url: false,
            modules: {
                alerts: true,
                dashboard: false,
                filter_settings: {
                    Brand: {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Brand',
                        parent: 'Sub Category'
                    },
                    Category: {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Category',
                        parent: 'Industry'
                    },
                    Industry: {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Industry',
                        parent: 'Region'
                    },
                    Region: {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Region',
                        parent: 'Time Frame'
                    },
                    'Sub Category': {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Sub Category',
                        parent: 'Category'
                    },
                    'Time Frame': {
                        enabled: true,
                        exclude: [],
                        include: '',
                        label: 'Time Frame',
                        parent: ''
                    }
                },
                filters: true,
                navigator: { enabled: true },
                user_mgmt: false
            },
            name: 'Integrated Demand Forecasting',
            permissions: false,
            restricted_app: false,
            screens: [
                {
                    action_settings: false,
                    graph_type: null,
                    horizontal: null,
                    id: 101,
                    level: null,
                    rating_url: null,
                    screen_auto_refresh: null,
                    screen_description: null,
                    screen_filters_open: null,
                    screen_filters_values: false,
                    screen_image: null,
                    screen_index: 0,
                    screen_name: 'Demand Analysis',
                    widget_count: 0
                }
            ],
            small_logo_url: false,
            story_count: 0,
            theme: 'blue'
        };
        const props = {
            classes: {
                appBar: 'AppScreenFilters-appBar-136',
                filterToolbar: 'AppScreenFilters-filterToolbar-137',
                filterButton: 'AppScreenFilters-filterButton-138',
                filterToolbarButton: 'AppScreenFilters-filterToolbarButton-139',
                filterRadioLabel: 'AppScreenFilters-filterRadioLabel-140',
                grow: 'AppScreenFilters-grow-141',
                hide: 'AppScreenFilters-hide-142',
                iconButtonProgress: 'AppScreenFilters-iconButtonProgress-143',
                filtersGridBody: 'AppScreenFilters-filtersGridBody-144',
                filterCategoryBody: 'AppScreenFilters-filterCategoryBody-145',
                filterOptionContainer: 'AppScreenFilters-filterOptionContainer-146',
                filterOptionHeader: 'AppScreenFilters-filterOptionHeader-147',
                filterOptionValue: 'AppScreenFilters-filterOptionValue-148',
                filterFormControl: 'AppScreenFilters-filterFormControl-149',
                filterToolbarLabel: 'AppScreenFilters-filterToolbarLabel-150',
                radio: 'AppScreenFilters-radio-151',
                radioChecked: 'AppScreenFilters-radioChecked-152'
            },
            parent_obj: {
                props: {
                    location: { pathname: '/app/26/objectives/' }
                },
                context: 'Object',
                refs: 'Object',
                updater: 'Object',
                onResponseGetScreen: 'fn()',
                getLabels: 'fn()',
                getGraphs: 'fn()',
                getWidgetData: () => {},
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
            app_info: app_info,
            open: false,
            theme: {
                breakpoints: 'Object',
                direction: 'ltr',
                mixins: 'Object',
                overrides: 'Object',
                palette: {
                    text: {
                        default: '#220047'
                    }
                },
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
        //mockSessionStorage.getItem('app_filter_info_26')
        getFilters.mockImplementation(({ callback }) =>
            callback({
                values: [
                    {
                        Category: 'All',
                        Industry: 'Beer',
                        Region: 'USA',
                        'Sub Category': 'All',
                        'Time Frame': 'CY 2020'
                    },
                    {
                        Category: 'All',
                        Industry: 'Beer',
                        Region: 'USA',
                        'Sub Category': 'All',
                        'Time Frame': 'CY 2020'
                    }
                ],
                topics: {
                    Category: ['All'],
                    Industry: ['Beer'],
                    Region: ['USA'],
                    'Sub Category': ['All'],
                    'Time Frame': ['CY 2020']
                }
            })
        );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenFilters {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(
            screen.getByText('You can not change the filter selections', { exact: false })
        ).toBeInTheDocument();
        expect(screen.getByLabelText('selection-filter')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('selection-filter'));
    });
});
