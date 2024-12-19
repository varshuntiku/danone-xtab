import React from 'react';
import { render, screen, cleanup, act, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AppScreen from '../../components/AppScreen';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { Provider, connect } from 'react-redux';
import store from 'store/store';
import {
    setScreenId,
    getScreenWidgets,
    getGraphData,
    setScreenLevelFilterState
} from '../../store/index';

import {
    getWidgets,
    getScreenUserGuide,
    getScreenActionSettings,
    getScreenConfig
} from '../../services/screen';
const history = createMemoryHistory();
import { vi } from 'vitest';

vi.mock('../../components/AppScreenFilters.jsx', () => {
    return { default: (props) => <> Mocked App Screen Filters</> };
});

vi.mock('../../services/app', async () => ({
    ...(await vi.importActual('../../services/app'))
}));

const mockProps = {
    classes: {},
    app_info: { modules: { user_guide: true } },
    videoOpen: false,
    videoOptions: {},
    activeStep: 0,
    preview_screen_id: null,
    handleStepper: vi.fn(),
    videoClose: vi.fn()
};

const MockedAppScreen = connect(
    (state) => ({ widgetData: state.appScreen.widgetData }),
    (dispatch) => ({
        setScreenId: (screenId) => dispatch(setScreenId(screenId)),
        getWidgets: (payload) => dispatch(getScreenWidgets(payload)),
        getGraphData: (payload) => dispatch(getGraphData(payload)),
        setScreenLevelFilterState: (payload) => dispatch(setScreenLevelFilterState(payload))
    })
)(AppScreen);
vi.mock('../../services/screen', () => ({
    getWidgets: vi.fn(),
    getScreenUserGuide: vi.fn(),
    getScreenActionSettings: vi.fn(),
    getScreenConfig: vi.fn()
}));

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render AppScreen Component', () => {
        const app_info = {
            id: 26,
            name: 'Integrated Demand Forecasting',
            theme: 'blue',
            screens: [
                {
                    id: 128,
                    screen_index: 27,
                    screen_name: 'Growth Lever Simulation',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: null,
                    graph_type: null,
                    horizontal: null,
                    rating_url: 'https://www.google.com/',
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 131,
                    screen_index: 30,
                    screen_name: 'Goal Oriented Simulation',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: 'https://www.themathcompany.com/',
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 101,
                    screen_index: 0,
                    screen_name: 'Demand Analysis',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: null,
                    graph_type: null,
                    horizontal: null,
                    rating_url: 'https://www.google.com/',
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 102,
                    screen_index: 1,
                    screen_name: 'Size & Opportunity',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 103,
                    screen_index: 2,
                    screen_name: 'Demand Sizing',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '2-1',
                    horizontal: null,
                    rating_url: null,
                    widget_count: 7,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 104,
                    screen_index: 3,
                    screen_name: 'Opportunity Breakdown',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 5,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 105,
                    screen_index: 4,
                    screen_name: 'Pattern Analysis',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 106,
                    screen_index: 5,
                    screen_name: 'Characteristics',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '1-2',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 3,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 107,
                    screen_index: 6,
                    screen_name: 'Portfolio Segmentation',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 4,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 108,
                    screen_index: 7,
                    screen_name: 'Exception Analysis',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 1,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 109,
                    screen_index: 8,
                    screen_name: 'Velocity',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 4,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 110,
                    screen_index: 9,
                    screen_name: 'Forecast',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: null,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 111,
                    screen_index: 10,
                    screen_name: 'Industry',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 112,
                    screen_index: 11,
                    screen_name: 'Baseline Forecast',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '1-2',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 7,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 113,
                    screen_index: 12,
                    screen_name: 'Driver (Leading Indicator) Forecast',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '1-2',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 3,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 114,
                    screen_index: 13,
                    screen_name: 'Impact Analysis',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '1-2',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 3,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 115,
                    screen_index: 14,
                    screen_name: 'Driver Interactions',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 116,
                    screen_index: 15,
                    screen_name: 'Category',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 117,
                    screen_index: 16,
                    screen_name: 'Baseline Forecast',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '1-2',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 7,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 118,
                    screen_index: 17,
                    screen_name: 'Driver (Leading Indicator) Forecast',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '1-2',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 3,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 119,
                    screen_index: 18,
                    screen_name: 'Impact Analysis',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '1-2',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 3,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 120,
                    screen_index: 19,
                    screen_name: 'Driver Interactions',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 121,
                    screen_index: 20,
                    screen_name: 'SKU',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 122,
                    screen_index: 21,
                    screen_name: 'Baseline Forecast',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '1-2',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 7,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 123,
                    screen_index: 22,
                    screen_name: 'Driver (Leading Indicator) Forecast',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '1-1',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 2,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 124,
                    screen_index: 23,
                    screen_name: 'Impact Analysis',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '1-2',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 3,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 125,
                    screen_index: 24,
                    screen_name: 'Driver Interactions',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 126,
                    screen_index: 25,
                    screen_name: 'Collaborative Planning',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: null,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 127,
                    screen_index: 26,
                    screen_name: 'Business Planning Support',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 1,
                    graph_type: '1-1',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 6,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 129,
                    screen_index: 28,
                    screen_name: 'Build Scenario',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 1,
                    graph_type: '1-1',
                    horizontal: true,
                    rating_url: 'https://www.google.com/',
                    widget_count: 6,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 130,
                    screen_index: 29,
                    screen_name: 'Compare Scenarios',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 1,
                    graph_type: '3-1',
                    horizontal: true,
                    rating_url: '',
                    widget_count: 4,
                    screen_filters_values: false,
                    action_settings: false
                }
            ],
            modules: {
                dashboard: true,
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
                user_mgmt: false,
                data_story: true,
                minerva: { enabled: true, tenent_id: 'cpg' }
            },
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
        };
        const match = {
            path: '/app/:app_id/:first_level_slug/:second_level_slug/:third_level_slug',
            url: '/app/26/forecast/industry/driver (leading indicator) forecast',
            isExact: true,
            params: {
                app_id: '26',
                first_level_slug: 'forecast',
                second_level_slug: 'industry',
                third_level_slug: 'driver (leading indicator) forecast'
            }
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppScreen app_info={app_info} match={match} setFilterValue={() => {}} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render AppScreen1 Component', () => {
        const app_info = {
            id: 261,
            name: 'Marketing Media Mix Planner',
            theme: 'blue',
            screens: [
                {
                    id: 6365,
                    screen_index: 0,
                    screen_name: 'Data Health Tracker',
                    screen_description: 'false',
                    screen_filters_open: false,
                    screen_image: 'false',
                    level: null,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 6366,
                    screen_index: 1,
                    screen_name: 'Data Source Assessment',
                    screen_description: 'false',
                    screen_filters_open: false,
                    screen_image: 'false',
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 1,
                    screen_filters_values: {
                        dataValues: [
                            {
                                widget_filter_index: 0,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Product Line',
                                widget_tag_label: 'Product Line',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Danone',
                                    'Blue House',
                                    'Red House',
                                    'Tailored Nutrition',
                                    'Competition'
                                ]
                            },
                            {
                                widget_filter_index: 1,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Brand',
                                widget_tag_label: 'Brand',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Danone',
                                    'Dumex PWD',
                                    'Dumex RTD',
                                    'Nutricia PWD',
                                    'Nutricia RTD',
                                    'Tailored Nutrition'
                                ]
                            },
                            {
                                widget_filter_index: 2,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Marketing Channels',
                                widget_tag_label: 'Marketing Channels',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'ATL',
                                    'BTL',
                                    'Digital',
                                    'Medical Marketing'
                                ]
                            },
                            {
                                widget_filter_index: 3,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Touchpoints',
                                widget_tag_label: 'Touchpoints',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Radio',
                                    'TV',
                                    'Sampling',
                                    'Trade Premium',
                                    'Facebook',
                                    'Google Search',
                                    'Recommendation Program',
                                    'Conference'
                                ]
                            },
                            {
                                widget_filter_index: 4,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Drivers',
                                widget_tag_label: 'Drivers',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Baseline',
                                    'Incremental Sales',
                                    'Sales',
                                    'Volume'
                                ]
                            },
                            {
                                widget_filter_index: 5,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: false,
                                widget_filter_multiselect: false,
                                widget_tag_key: 'Time Period',
                                widget_tag_label: 'Time Period',
                                widget_tag_input_type: 'select',
                                widget_tag_value: ['Jun 2020']
                            }
                        ],
                        defaultValues: {
                            'Product Line': ['Danone'],
                            Brand: ['All'],
                            'Marketing Channels': ['All'],
                            Touchpoints: ['All'],
                            Drivers: ['All'],
                            'Time Period': 'Jun 2020'
                        }
                    },
                    action_settings: false
                },
                {
                    id: 6367,
                    screen_index: 2,
                    screen_name: 'Historical Overview',
                    screen_description: 'false',
                    screen_filters_open: false,
                    screen_image: 'false',
                    level: null,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 6368,
                    screen_index: 3,
                    screen_name: 'Market Overview',
                    screen_description: 'false',
                    screen_filters_open: false,
                    screen_image: 'false',
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 5,
                    screen_filters_values: {
                        dataValues: [
                            {
                                widget_filter_index: 0,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Product Line',
                                widget_tag_label: 'Product Line',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Danone',
                                    'Blue House',
                                    'Red House',
                                    'Tailored Nutrition',
                                    'Competition'
                                ]
                            },
                            {
                                widget_filter_index: 1,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Brand',
                                widget_tag_label: 'Brand',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Danone',
                                    'Dumex PWD',
                                    'Dumex RTD',
                                    'Nutricia PWD',
                                    'Nutricia RTD',
                                    'Tailored Nutrition'
                                ]
                            },
                            {
                                widget_filter_index: 2,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Marketing Channels',
                                widget_tag_label: 'Marketing Channels',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'ATL',
                                    'BTL',
                                    'Digital',
                                    'Medical Marketing'
                                ]
                            },
                            {
                                widget_filter_index: 3,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Touchpoints',
                                widget_tag_label: 'Touchpoints',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Radio',
                                    'TV',
                                    'Sampling',
                                    'Trade Premium',
                                    'Facebook',
                                    'Google Search',
                                    'Recommendation Program',
                                    'Conference'
                                ]
                            },
                            {
                                widget_filter_index: 4,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Drivers',
                                widget_tag_label: 'Drivers',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Baseline',
                                    'Incremental Sales',
                                    'Sales',
                                    'Volume'
                                ]
                            },
                            {
                                widget_filter_index: 5,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: false,
                                widget_filter_multiselect: false,
                                widget_tag_key: 'Time Period',
                                widget_tag_label: 'Time Period',
                                widget_tag_input_type: 'select',
                                widget_tag_value: ['Jun 2020']
                            }
                        ],
                        defaultValues: {
                            'Product Line': ['Danone'],
                            Brand: ['All'],
                            'Marketing Channels': ['All'],
                            Touchpoints: ['All'],
                            Drivers: ['All'],
                            'Time Period': 'Jun 2020'
                        }
                    },
                    action_settings: false
                },
                {
                    id: 6369,
                    screen_index: 4,
                    screen_name: 'Spends Overview',
                    screen_description: 'false',
                    screen_filters_open: false,
                    screen_image: 'false',
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 5,
                    screen_filters_values: {
                        dataValues: [
                            {
                                widget_filter_index: 0,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Product Line',
                                widget_tag_label: 'Product Line',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Danone',
                                    'Blue House',
                                    'Red House',
                                    'Tailored Nutrition',
                                    'Competition'
                                ]
                            },
                            {
                                widget_filter_index: 1,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Brand',
                                widget_tag_label: 'Brand',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Danone',
                                    'Dumex PWD',
                                    'Dumex RTD',
                                    'Nutricia PWD',
                                    'Nutricia RTD',
                                    'Tailored Nutrition'
                                ]
                            },
                            {
                                widget_filter_index: 2,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Marketing Channels',
                                widget_tag_label: 'Marketing Channels',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'ATL',
                                    'BTL',
                                    'Digital',
                                    'Medical Marketing'
                                ]
                            },
                            {
                                widget_filter_index: 3,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Touchpoints',
                                widget_tag_label: 'Touchpoints',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Radio',
                                    'TV',
                                    'Sampling',
                                    'Trade Premium',
                                    'Facebook',
                                    'Google Search',
                                    'Recommendation Program',
                                    'Conference'
                                ]
                            },
                            {
                                widget_filter_index: 4,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Drivers',
                                widget_tag_label: 'Drivers',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Baseline',
                                    'Incremental Sales',
                                    'Sales',
                                    'Volume'
                                ]
                            },
                            {
                                widget_filter_index: 5,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: false,
                                widget_filter_multiselect: false,
                                widget_tag_key: 'Time Period',
                                widget_tag_label: 'Time Period',
                                widget_tag_input_type: 'select',
                                widget_tag_value: ['Jun 2020']
                            }
                        ],
                        defaultValues: {
                            'Product Line': ['Danone'],
                            Brand: ['All'],
                            'Marketing Channels': ['All'],
                            Touchpoints: ['All'],
                            Drivers: ['All'],
                            'Time Period': 'Jun 2020'
                        }
                    },
                    action_settings: false
                },
                {
                    id: 6370,
                    screen_index: 5,
                    screen_name: 'Other Factors',
                    screen_description: 'false',
                    screen_filters_open: false,
                    screen_image: 'false',
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 1,
                    screen_filters_values: {
                        dataValues: [
                            {
                                widget_filter_index: 0,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Product Line',
                                widget_tag_label: 'Product Line',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Danone',
                                    'Blue House',
                                    'Red House',
                                    'Tailored Nutrition',
                                    'Competition'
                                ]
                            },
                            {
                                widget_filter_index: 1,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Brand',
                                widget_tag_label: 'Brand',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Danone',
                                    'Dumex PWD',
                                    'Dumex RTD',
                                    'Nutricia PWD',
                                    'Nutricia RTD',
                                    'Tailored Nutrition'
                                ]
                            },
                            {
                                widget_filter_index: 2,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Marketing Channels',
                                widget_tag_label: 'Marketing Channels',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'ATL',
                                    'BTL',
                                    'Digital',
                                    'Medical Marketing'
                                ]
                            },
                            {
                                widget_filter_index: 3,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Touchpoints',
                                widget_tag_label: 'Touchpoints',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Radio',
                                    'TV',
                                    'Sampling',
                                    'Trade Premium',
                                    'Facebook',
                                    'Google Search',
                                    'Recommendation Program',
                                    'Conference'
                                ]
                            },
                            {
                                widget_filter_index: 4,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Drivers',
                                widget_tag_label: 'Drivers',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Baseline',
                                    'Incremental Sales',
                                    'Sales',
                                    'Volume'
                                ]
                            },
                            {
                                widget_filter_index: 5,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: false,
                                widget_filter_multiselect: false,
                                widget_tag_key: 'Time Period',
                                widget_tag_label: 'Time Period',
                                widget_tag_input_type: 'select',
                                widget_tag_value: ['Jun 2020']
                            }
                        ],
                        defaultValues: {
                            'Product Line': ['Danone'],
                            Brand: ['All'],
                            'Marketing Channels': ['All'],
                            Touchpoints: ['All'],
                            Drivers: ['All'],
                            'Time Period': 'Jun 2020'
                        }
                    },
                    action_settings: false
                },
                {
                    id: 6371,
                    screen_index: 6,
                    screen_name: 'Performance Highlights',
                    screen_description: 'false',
                    screen_filters_open: false,
                    screen_image: 'false',
                    level: null,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 6372,
                    screen_index: 7,
                    screen_name: 'Performance Summary',
                    screen_description: 'false',
                    screen_filters_open: false,
                    screen_image: 'false',
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 5,
                    screen_filters_values: {
                        dataValues: [
                            {
                                widget_filter_index: 0,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Product Line',
                                widget_tag_label: 'Product Line',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Danone',
                                    'Blue House',
                                    'Red House',
                                    'Tailored Nutrition',
                                    'Competition'
                                ]
                            },
                            {
                                widget_filter_index: 1,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Brand',
                                widget_tag_label: 'Brand',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Danone',
                                    'Dumex PWD',
                                    'Dumex RTD',
                                    'Nutricia PWD',
                                    'Nutricia RTD',
                                    'Tailored Nutrition'
                                ]
                            },
                            {
                                widget_filter_index: 2,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Marketing Channels',
                                widget_tag_label: 'Marketing Channels',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'ATL',
                                    'BTL',
                                    'Digital',
                                    'Medical Marketing'
                                ]
                            },
                            {
                                widget_filter_index: 3,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Touchpoints',
                                widget_tag_label: 'Touchpoints',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Radio',
                                    'TV',
                                    'Sampling',
                                    'Trade Premium',
                                    'Facebook',
                                    'Google Search',
                                    'Recommendation Program',
                                    'Conference'
                                ]
                            },
                            {
                                widget_filter_index: 4,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Drivers',
                                widget_tag_label: 'Drivers',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Baseline',
                                    'Incremental Sales',
                                    'Sales',
                                    'Volume'
                                ]
                            },
                            {
                                widget_filter_index: 5,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: false,
                                widget_filter_multiselect: false,
                                widget_tag_key: 'Time Period',
                                widget_tag_label: 'Time Period',
                                widget_tag_input_type: 'select',
                                widget_tag_value: ['Jun 2020']
                            }
                        ],
                        defaultValues: {
                            'Product Line': ['Danone'],
                            Brand: ['All'],
                            'Marketing Channels': ['All'],
                            Touchpoints: ['All'],
                            Drivers: ['All'],
                            'Time Period': 'Jun 2020'
                        }
                    },
                    action_settings: false
                },
                {
                    id: 6373,
                    screen_index: 8,
                    screen_name: 'Performance Details',
                    screen_description: 'false',
                    screen_filters_open: false,
                    screen_image: 'false',
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 1,
                    screen_filters_values: {
                        dataValues: [
                            {
                                widget_filter_index: 0,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Product Line',
                                widget_tag_label: 'Product Line',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Danone',
                                    'Blue House',
                                    'Red House',
                                    'Tailored Nutrition',
                                    'Competition'
                                ]
                            },
                            {
                                widget_filter_index: 1,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Brand',
                                widget_tag_label: 'Brand',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Danone',
                                    'Dumex PWD',
                                    'Dumex RTD',
                                    'Nutricia PWD',
                                    'Nutricia RTD',
                                    'Tailored Nutrition'
                                ]
                            },
                            {
                                widget_filter_index: 2,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Marketing Channels',
                                widget_tag_label: 'Marketing Channels',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'ATL',
                                    'BTL',
                                    'Digital',
                                    'Medical Marketing'
                                ]
                            },
                            {
                                widget_filter_index: 3,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Touchpoints',
                                widget_tag_label: 'Touchpoints',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Radio',
                                    'TV',
                                    'Sampling',
                                    'Trade Premium',
                                    'Facebook',
                                    'Google Search',
                                    'Recommendation Program',
                                    'Conference'
                                ]
                            },
                            {
                                widget_filter_index: 4,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Drivers',
                                widget_tag_label: 'Drivers',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Baseline',
                                    'Incremental Sales',
                                    'Sales',
                                    'Volume'
                                ]
                            },
                            {
                                widget_filter_index: 5,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: false,
                                widget_filter_multiselect: false,
                                widget_tag_key: 'Time Period',
                                widget_tag_label: 'Time Period',
                                widget_tag_input_type: 'select',
                                widget_tag_value: ['Jun 2020']
                            }
                        ],
                        defaultValues: {
                            'Product Line': ['Danone'],
                            Brand: ['All'],
                            'Marketing Channels': ['All'],
                            Touchpoints: ['All'],
                            Drivers: ['All'],
                            'Time Period': 'Jun 2020'
                        }
                    },
                    action_settings: false
                },
                {
                    id: 6374,
                    screen_index: 9,
                    screen_name: 'Budget Optimizer',
                    screen_description: 'false',
                    screen_filters_open: false,
                    screen_image: 'false',
                    level: null,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 6375,
                    screen_index: 10,
                    screen_name: 'Recommended Spends',
                    screen_description: 'false',
                    screen_filters_open: false,
                    screen_image: 'false',
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 6,
                    screen_filters_values: {
                        dataValues: [
                            {
                                widget_filter_index: 0,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Product Line',
                                widget_tag_label: 'Product Line',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Danone',
                                    'Blue House',
                                    'Red House',
                                    'Tailored Nutrition',
                                    'Competition'
                                ]
                            },
                            {
                                widget_filter_index: 1,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Brand',
                                widget_tag_label: 'Brand',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Danone',
                                    'Dumex PWD',
                                    'Dumex RTD',
                                    'Nutricia PWD',
                                    'Nutricia RTD',
                                    'Tailored Nutrition'
                                ]
                            },
                            {
                                widget_filter_index: 2,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Marketing Channels',
                                widget_tag_label: 'Marketing Channels',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'ATL',
                                    'BTL',
                                    'Digital',
                                    'Medical Marketing'
                                ]
                            },
                            {
                                widget_filter_index: 3,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Touchpoints',
                                widget_tag_label: 'Touchpoints',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Radio',
                                    'TV',
                                    'Sampling',
                                    'Trade Premium',
                                    'Facebook',
                                    'Google Search',
                                    'Recommendation Program',
                                    'Conference'
                                ]
                            },
                            {
                                widget_filter_index: 4,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Drivers',
                                widget_tag_label: 'Drivers',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Baseline',
                                    'Incremental Sales',
                                    'Sales',
                                    'Volume'
                                ]
                            },
                            {
                                widget_filter_index: 5,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: false,
                                widget_filter_multiselect: false,
                                widget_tag_key: 'Time Period',
                                widget_tag_label: 'Time Period',
                                widget_tag_input_type: 'select',
                                widget_tag_value: ['Jun 2020']
                            }
                        ],
                        defaultValues: {
                            'Product Line': ['Danone'],
                            Brand: ['All'],
                            'Marketing Channels': ['All'],
                            Touchpoints: ['All'],
                            Drivers: ['All'],
                            'Time Period': 'Jun 2020'
                        }
                    },
                    action_settings: false
                },
                {
                    id: 6376,
                    screen_index: 11,
                    screen_name: 'Build Scenario',
                    screen_description: 'false',
                    screen_filters_open: false,
                    screen_image: 'false',
                    level: 1,
                    graph_type: '1-3',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 4,
                    screen_filters_values: {
                        dataValues: [
                            {
                                widget_filter_index: 0,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Product Line',
                                widget_tag_label: 'Product Line',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Danone',
                                    'Blue House',
                                    'Red House',
                                    'Tailored Nutrition',
                                    'Competition'
                                ]
                            },
                            {
                                widget_filter_index: 1,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Brand',
                                widget_tag_label: 'Brand',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Danone',
                                    'Dumex PWD',
                                    'Dumex RTD',
                                    'Nutricia PWD',
                                    'Nutricia RTD',
                                    'Tailored Nutrition'
                                ]
                            },
                            {
                                widget_filter_index: 2,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Marketing Channels',
                                widget_tag_label: 'Marketing Channels',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'ATL',
                                    'BTL',
                                    'Digital',
                                    'Medical Marketing'
                                ]
                            },
                            {
                                widget_filter_index: 3,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Touchpoints',
                                widget_tag_label: 'Touchpoints',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Radio',
                                    'TV',
                                    'Sampling',
                                    'Trade Premium',
                                    'Facebook',
                                    'Google Search',
                                    'Recommendation Program',
                                    'Conference'
                                ]
                            },
                            {
                                widget_filter_index: 4,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Drivers',
                                widget_tag_label: 'Drivers',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Baseline',
                                    'Incremental Sales',
                                    'Sales',
                                    'Volume'
                                ]
                            },
                            {
                                widget_filter_index: 5,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: false,
                                widget_filter_multiselect: false,
                                widget_tag_key: 'Time Period',
                                widget_tag_label: 'Time Period',
                                widget_tag_input_type: 'select',
                                widget_tag_value: ['Jun 2020']
                            }
                        ],
                        defaultValues: {
                            'Product Line': ['Danone'],
                            Brand: ['All'],
                            'Marketing Channels': ['All'],
                            Touchpoints: ['All'],
                            Drivers: ['All'],
                            'Time Period': 'Jun 2020'
                        }
                    },
                    action_settings: false
                },
                {
                    id: 6377,
                    screen_index: 12,
                    screen_name: 'Compare Scenarios',
                    screen_description: 'false',
                    screen_filters_open: false,
                    screen_image: 'false',
                    level: 1,
                    graph_type: '3-3-1',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 7,
                    screen_filters_values: {
                        dataValues: [
                            {
                                widget_filter_index: 0,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Product Line',
                                widget_tag_label: 'Product Line',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Danone',
                                    'Blue House',
                                    'Red House',
                                    'Tailored Nutrition',
                                    'Competition'
                                ]
                            },
                            {
                                widget_filter_index: 1,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Brand',
                                widget_tag_label: 'Brand',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Danone',
                                    'Dumex PWD',
                                    'Dumex RTD',
                                    'Nutricia PWD',
                                    'Nutricia RTD',
                                    'Tailored Nutrition'
                                ]
                            },
                            {
                                widget_filter_index: 2,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Marketing Channels',
                                widget_tag_label: 'Marketing Channels',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'ATL',
                                    'BTL',
                                    'Digital',
                                    'Medical Marketing'
                                ]
                            },
                            {
                                widget_filter_index: 3,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Touchpoints',
                                widget_tag_label: 'Touchpoints',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Radio',
                                    'TV',
                                    'Sampling',
                                    'Trade Premium',
                                    'Facebook',
                                    'Google Search',
                                    'Recommendation Program',
                                    'Conference'
                                ]
                            },
                            {
                                widget_filter_index: 4,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Drivers',
                                widget_tag_label: 'Drivers',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Baseline',
                                    'Incremental Sales',
                                    'Sales',
                                    'Volume'
                                ]
                            },
                            {
                                widget_filter_index: 5,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: false,
                                widget_filter_multiselect: false,
                                widget_tag_key: 'Time Period',
                                widget_tag_label: 'Time Period',
                                widget_tag_input_type: 'select',
                                widget_tag_value: ['Jun 2020']
                            }
                        ],
                        defaultValues: {
                            'Product Line': ['Danone'],
                            Brand: ['All'],
                            'Marketing Channels': ['All'],
                            Touchpoints: ['All'],
                            Drivers: ['All'],
                            'Time Period': 'Jun 2020'
                        }
                    },
                    action_settings: false
                },
                {
                    id: 6378,
                    screen_index: 13,
                    screen_name: 'Response Curves',
                    screen_description: 'false',
                    screen_filters_open: false,
                    screen_image: 'false',
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 4,
                    screen_filters_values: {
                        dataValues: [
                            {
                                widget_filter_index: 0,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Product Line',
                                widget_tag_label: 'Product Line',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Danone',
                                    'Blue House',
                                    'Red House',
                                    'Tailored Nutrition',
                                    'Competition'
                                ]
                            },
                            {
                                widget_filter_index: 1,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Brand',
                                widget_tag_label: 'Brand',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Danone',
                                    'Dumex PWD',
                                    'Dumex RTD',
                                    'Nutricia PWD',
                                    'Nutricia RTD',
                                    'Tailored Nutrition'
                                ]
                            },
                            {
                                widget_filter_index: 2,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Marketing Channels',
                                widget_tag_label: 'Marketing Channels',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'ATL',
                                    'BTL',
                                    'Digital',
                                    'Medical Marketing'
                                ]
                            },
                            {
                                widget_filter_index: 3,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Touchpoints',
                                widget_tag_label: 'Touchpoints',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'OOH',
                                    'Radio',
                                    'Lavender Royalty',
                                    'CRM (Birthday Pack)',
                                    'Facebook',
                                    'TV Digital',
                                    'Recommendation Program',
                                    'Detailing Call'
                                ]
                            },
                            {
                                widget_filter_index: 4,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: true,
                                widget_filter_multiselect: true,
                                widget_tag_key: 'Drivers',
                                widget_tag_label: 'Drivers',
                                widget_tag_input_type: 'select',
                                widget_tag_value: [
                                    'All',
                                    'Baseline',
                                    'Incremental Sales',
                                    'Sales',
                                    'Volume'
                                ]
                            },
                            {
                                widget_filter_index: 5,
                                widget_filter_function: false,
                                widget_filter_function_parameter: false,
                                widget_filter_hierarchy_key: false,
                                widget_filter_isall: false,
                                widget_filter_multiselect: false,
                                widget_tag_key: 'Time Period',
                                widget_tag_label: 'Time Period',
                                widget_tag_input_type: 'select',
                                widget_tag_value: ['Jun 2020']
                            }
                        ],
                        defaultValues: {
                            'Product Line': ['Danone'],
                            Brand: [
                                'All',
                                'Danone',
                                'Dumex PWD',
                                'Dumex RTD',
                                'Nutricia PWD',
                                'Nutricia RTD',
                                'Tailored Nutrition'
                            ],
                            'Marketing Channels': ['Digital'],
                            Touchpoints: [
                                'All',
                                'OOH',
                                'Radio',
                                'Lavender Royalty',
                                'CRM (Birthday Pack)',
                                'Facebook',
                                'TV Digital',
                                'Recommendation Program',
                                'Detailing Call'
                            ],
                            Drivers: ['All', 'Baseline', 'Incremental Sales', 'Sales', 'Volume'],
                            'Time Period': 'Jun 2020'
                        }
                    },
                    action_settings: false
                }
            ],
            modules: {
                dashboard: false,
                filter_settings: false,
                fullscreen_mode: false,
                user_mgmt: false,
                data_story: true
            },
            industry: null,
            function: null,
            description: null,
            blueprint_link: null,
            config_link: null,
            approach_url: false,
            logo_url: `${
                import.meta.env['REACT_APP_STATIC_DATA_ASSET']
            }/codex-products-test/danone_logo.png?se=2021-10-29T07%3A25%3A52Z&sp=r&sv=2018-03-28&sr=b&sig=2ugD3A1qnROYZhH3qUuc9ZeSmLVhuD%2BA5CjREVJTZ3Y%3D`,
            small_logo_url: `${
                import.meta.env['REACT_APP_STATIC_DATA_ASSET']
            }/codex-products-test/danone_logo.png?se=2021-10-29T07%3A25%3A52Z&sp=r&sv=2018-03-28&sr=b&sig=2ugD3A1qnROYZhH3qUuc9ZeSmLVhuD%2BA5CjREVJTZ3Y%3D`,
            story_count: 0,
            restricted_app: false,
            is_user_admin: true,
            permissions: false
        };
        const match = {
            path: '/app/:app_id/:first_level_slug/:second_level_slug',
            url: '/app/261/historical overview/spends overview',
            isExact: true,
            params: {
                app_id: '261',
                first_level_slug: 'historical overview',
                second_level_slug: 'spends overview'
            }
        };

        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppScreen app_info={app_info} match={match} setFilterValue={() => {}} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render AppScreen2 Component', () => {
        const app_info = {
            id: 26,
            name: 'Integrated Demand Forecasting',
            theme: 'blue',
            screens: [
                {
                    id: 128,
                    screen_index: 27,
                    screen_name: 'Growth Lever Simulation',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: null,
                    graph_type: null,
                    horizontal: null,
                    rating_url: 'https://www.google.com/',
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 131,
                    screen_index: 30,
                    screen_name: 'Goal Oriented Simulation',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: 'https://www.themathcompany.com/',
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 101,
                    screen_index: 0,
                    screen_name: 'Demand Analysis',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: null,
                    graph_type: null,
                    horizontal: null,
                    rating_url: 'https://www.google.com/',
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 102,
                    screen_index: 1,
                    screen_name: 'Size & Opportunity',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 103,
                    screen_index: 2,
                    screen_name: 'Demand Sizing',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '2-1',
                    horizontal: null,
                    rating_url: null,
                    widget_count: 7,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 104,
                    screen_index: 3,
                    screen_name: 'Opportunity Breakdown',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 5,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 105,
                    screen_index: 4,
                    screen_name: 'Pattern Analysis',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 106,
                    screen_index: 5,
                    screen_name: 'Characteristics',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '1-2',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 3,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 107,
                    screen_index: 6,
                    screen_name: 'Portfolio Segmentation',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 4,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 108,
                    screen_index: 7,
                    screen_name: 'Exception Analysis',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 1,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 109,
                    screen_index: 8,
                    screen_name: 'Velocity',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 4,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 110,
                    screen_index: 9,
                    screen_name: 'Forecast',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: null,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 111,
                    screen_index: 10,
                    screen_name: 'Industry',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 112,
                    screen_index: 11,
                    screen_name: 'Baseline Forecast',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '1-2',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 7,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 113,
                    screen_index: 12,
                    screen_name: 'Driver (Leading Indicator) Forecast',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '1-2',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 3,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 114,
                    screen_index: 13,
                    screen_name: 'Impact Analysis',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '1-2',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 3,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 115,
                    screen_index: 14,
                    screen_name: 'Driver Interactions',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 116,
                    screen_index: 15,
                    screen_name: 'Category',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 117,
                    screen_index: 16,
                    screen_name: 'Baseline Forecast',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '1-2',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 7,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 118,
                    screen_index: 17,
                    screen_name: 'Driver (Leading Indicator) Forecast',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '1-2',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 3,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 119,
                    screen_index: 18,
                    screen_name: 'Impact Analysis',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '1-2',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 3,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 120,
                    screen_index: 19,
                    screen_name: 'Driver Interactions',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 121,
                    screen_index: 20,
                    screen_name: 'SKU',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 122,
                    screen_index: 21,
                    screen_name: 'Baseline Forecast',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '1-2',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 7,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 123,
                    screen_index: 22,
                    screen_name: 'Driver (Leading Indicator) Forecast',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '1-1',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 2,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 124,
                    screen_index: 23,
                    screen_name: 'Impact Analysis',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '1-2',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 3,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 125,
                    screen_index: 24,
                    screen_name: 'Driver Interactions',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 126,
                    screen_index: 25,
                    screen_name: 'Collaborative Planning',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: null,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 127,
                    screen_index: 26,
                    screen_name: 'Business Planning Support',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 1,
                    graph_type: '1-1',
                    horizontal: true,
                    rating_url: null,
                    widget_count: 6,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 129,
                    screen_index: 28,
                    screen_name: 'Build Scenario',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 1,
                    graph_type: '1-1',
                    horizontal: true,
                    rating_url: 'https://www.google.com/',
                    widget_count: 6,
                    screen_filters_values: false,
                    action_settings: false
                },
                {
                    id: 130,
                    screen_index: 29,
                    screen_name: 'Compare Scenarios',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 1,
                    graph_type: '3-1',
                    horizontal: true,
                    rating_url: '',
                    widget_count: 4,
                    screen_filters_values: false,
                    action_settings: false
                }
            ],
            modules: {
                dashboard: true,
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
                user_mgmt: false,
                data_story: true,
                minerva: { enabled: true, tenent_id: 'cpg' }
            },
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
        };
        const match = {
            path: '/app/:app_id/:first_level_slug/:second_level_slug/:third_level_slug',
            url: '/app/26/forecast/industry/driver (leading indicator) forecast',
            isExact: true,
            params: {
                app_id: '26',
                first_level_slug: 'forecast',
                second_level_slug: 'industry',
                third_level_slug: 'driver (leading indicator) forecast'
            }
        };
        const props = {
            objectivesSteps: [
                <p>Objective 1</p>,
                <p>Objective 2</p>,
                <p>Objective 3</p>,
                <p>Objective 4</p>,
                <p>Objective 5</p>
            ],
            activeStep: 0,
            setFilterValue: () => {}
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppScreen
                            app_info={app_info}
                            match={match}
                            navigator={true}
                            {...props}
                            setFilterValue={() => {}}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render AppScreen3 Component', () => {
        const props = {
            app_info: {
                approach_url: false,
                blueprint_link: null,
                config_link: null,
                description: null,
                function: null,
                id: 261,
                industry: null,
                is_app_user: false,
                is_user_admin: true,
                logo_url: `${
                    import.meta.env['REACT_APP_STATIC_DATA_ASSET']
                }/codex-products-test/danone_logo.png?se=2022-01-24T13%3A50%3A58Z&sp=r&sv=2018-03-28&sr=b&sig=5JbfdvMCefxdpFJZ%2BAjSBU5EoIWi2zup6Zfi0dX7jQg%3D`,
                modules: {
                    dashboard: false,
                    filter_settings: false,
                    fullscreen_mode: false,
                    user_mgmt: false,
                    data_story: true
                },
                name: 'Marketing Media Mix Planner',
                permissions: false,
                restricted_app: false,
                screens: [
                    {
                        action_settings: false,
                        graph_type: null,
                        horizontal: null,
                        id: 6365,
                        level: null,
                        rating_url: null,
                        screen_auto_refresh: null,
                        screen_description: 'false',
                        screen_filters_open: false,
                        screen_filters_values: false,
                        screen_image: 'false',
                        screen_index: 0,
                        screen_name: 'Data Health Tracker',
                        widget_count: 0
                    },
                    {
                        action_settings: false,
                        graph_type: null,
                        horizontal: null,
                        id: 6366,
                        level: 1,
                        rating_url: null,
                        screen_auto_refresh: null,
                        screen_description: 'false',
                        screen_filters_open: false,
                        screen_filters_values: {
                            dataValues: [
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 0,
                                    widget_filter_isall: true,
                                    widget_filter_multiselect: true,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Product Line',
                                    widget_tag_label: 'Product Line',
                                    widget_tag_value: [
                                        'All',
                                        'Danone',
                                        'Blue House',
                                        'Red House',
                                        'Tailored Nutrition',
                                        'Competition'
                                    ]
                                },
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 1,
                                    widget_filter_isall: true,
                                    widget_filter_multiselect: true,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Brand',
                                    widget_tag_label: 'Brand',
                                    widget_tag_value: [
                                        'All',
                                        'Danone',
                                        'Dumex PWD',
                                        'Dumex RTD',
                                        'Nutricia PWD',
                                        'Nutricia RTD',
                                        'Tailored Nutrition'
                                    ]
                                },
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 2,
                                    widget_filter_isall: true,
                                    widget_filter_multiselect: true,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Marketing Channels',
                                    widget_tag_label: 'Marketing Channels',
                                    widget_tag_value: [
                                        'All',
                                        'ATL',
                                        'BTL',
                                        'Digital',
                                        'Medical Marketing'
                                    ]
                                },
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 3,
                                    widget_filter_isall: true,
                                    widget_filter_multiselect: true,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Touchpoints',
                                    widget_tag_label: 'Touchpoints',
                                    widget_tag_value: [
                                        'All',
                                        'Radio',
                                        'TV',
                                        'Sampling',
                                        'Trade Premium',
                                        'Facebook',
                                        'Google Search',
                                        'Recommendation Program',
                                        'Conference'
                                    ]
                                },
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 4,
                                    widget_filter_isall: true,
                                    widget_filter_multiselect: true,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Drivers',
                                    widget_tag_label: 'Drivers',
                                    widget_tag_value: [
                                        'All',
                                        'Baseline',
                                        'Incremental Sales',
                                        'Sales',
                                        'Volume'
                                    ]
                                },
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 5,
                                    widget_filter_isall: false,
                                    widget_filter_multiselect: false,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Time Period',
                                    widget_tag_label: 'Time Period',
                                    widget_tag_value: ['Jun 2020']
                                }
                            ],
                            defaultValues: {
                                Brand: ['All'],
                                Drivers: ['All'],
                                'Marketing Channels': ['All'],
                                'Product Line': ['Danone'],
                                'Time Period': 'Jun 2020',
                                Touchpoints: ['All']
                            }
                        },
                        screen_image: 'false',
                        screen_index: 1,
                        screen_name: 'Data Source Assessment',
                        widget_count: 1
                    }
                ],
                small_logo_url: `${
                    import.meta.env['REACT_APP_STATIC_DATA_ASSET']
                }/codex-products-test/danone_logo.png?se=2022-01-24T13%3A50%3A58Z&sp=r&sv=2018-03-28&sr=b&sig=5JbfdvMCefxdpFJZ%2BAjSBU5EoIWi2zup6Zfi0dX7jQg%3D`,
                story_count: 0,
                theme: 'blue',
                user_mgmt_access: false
            },
            getGraphData: () => {},
            getWidgets: () => {},
            handleStoriesCount: () => {},
            history: history,
            location: {
                hash: '',
                key: 'g3omg3',
                pathname: '/app/261/data-health-tracker/data-source-assessment',
                search: ''
            },
            match: {
                isExact: true,
                params: {
                    app_id: '261',
                    first_level_slug: 'data-health-tracker',
                    second_level_slug: 'data-source-assessment'
                },
                path: '/app/:app_id/:first_level_slug/:second_level_slug',
                url: '/app/261/data-health-tracker/data-source-assessment'
            },
            routes: [
                {
                    expanded: false,
                    href: '/app/261/data-health-tracker/data-source-assessment',
                    original_href: '/app/261/data-health-tracker',
                    screen_item: {
                        action_settings: false,
                        graph_type: null,
                        horizontal: null,
                        id: 6365,
                        level: null,
                        rating_url: null,
                        screen_auto_refresh: null,
                        screen_description: 'false',
                        screen_filters_open: false,
                        screen_filters_values: false,
                        screen_image: 'false',
                        screen_index: 0,
                        screen_name: 'Data Health Tracker',
                        widget_count: 0
                    },
                    selected: true,
                    show: true,
                    show_title: false
                },
                {
                    href: '/app/261/data-health-tracker/data-source-assessment',
                    level: 1,
                    original_href: '/app/261/data-health-tracker/data-source-assessment',
                    screen_item: {
                        action_settings: false,
                        graph_type: null,
                        horizontal: null,
                        id: 6366,
                        level: 1,
                        rating_url: null,
                        screen_auto_refresh: null,
                        screen_description: 'false',
                        screen_filters_open: false,
                        screen_filters_values: {
                            dataValues: [
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 0,
                                    widget_filter_isall: true,
                                    widget_filter_multiselect: true,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Product Line',
                                    widget_tag_label: 'Product Line',
                                    widget_tag_value: [
                                        'All',
                                        'Danone',
                                        'Blue House',
                                        'Red House',
                                        'Tailored Nutrition',
                                        'Competition'
                                    ]
                                },
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 1,
                                    widget_filter_isall: true,
                                    widget_filter_multiselect: true,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Brand',
                                    widget_tag_label: 'Brand',
                                    widget_tag_value: [
                                        'All',
                                        'Danone',
                                        'Dumex PWD',
                                        'Dumex RTD',
                                        'Nutricia PWD',
                                        'Nutricia RTD',
                                        'Tailored Nutrition'
                                    ]
                                },
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 2,
                                    widget_filter_isall: true,
                                    widget_filter_multiselect: true,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Marketing Channels',
                                    widget_tag_label: 'Marketing Channels',
                                    widget_tag_value: [
                                        'All',
                                        'ATL',
                                        'BTL',
                                        'Digital',
                                        'Medical Marketing'
                                    ]
                                },
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 3,
                                    widget_filter_isall: true,
                                    widget_filter_multiselect: true,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Touchpoints',
                                    widget_tag_label: 'Touchpoints',
                                    widget_tag_value: [
                                        'All',
                                        'Radio',
                                        'TV',
                                        'Sampling',
                                        'Trade Premium',
                                        'Facebook',
                                        'Google Search',
                                        'Recommendation Program',
                                        'Conference'
                                    ]
                                },
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 4,
                                    widget_filter_isall: true,
                                    widget_filter_multiselect: true,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Drivers',
                                    widget_tag_label: 'Drivers',
                                    widget_tag_value: [
                                        'All',
                                        'Baseline',
                                        'Incremental Sales',
                                        'Sales',
                                        'Volume'
                                    ]
                                },
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 5,
                                    widget_filter_isall: false,
                                    widget_filter_multiselect: false,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Time Period',
                                    widget_tag_label: 'Time Period',
                                    widget_tag_value: ['Jun 2020']
                                }
                            ],
                            defaultValues: {
                                Brand: ['All'],
                                Drivers: ['All'],
                                'Marketing Channels': ['All'],
                                'Product Line': ['Danone'],
                                'Time Period': 'Jun 2020',
                                Touchpoints: ['All']
                            }
                        },
                        screen_image: 'false',
                        screen_index: 1,
                        screen_name: 'Data Source Assessment',
                        widget_count: 1
                    },
                    selected: true,
                    show: true,
                    show_title: true
                }
            ],
            setScreenId: () => {},
            setFilterValue: () => {}
        };

        getWidgets.mockImplementation(({ callback }) =>
            callback([
                {
                    config: {
                        action_link: false,
                        assumptions_header: false,
                        color_nooverride: false,
                        filters_open: false,
                        legend: false,
                        prefix: false,
                        size_nooverride: false,
                        subtitle: false,
                        title: false,
                        traces: false,
                        value_factor: false
                    },
                    id: 17750,
                    is_label: false,
                    widget_index: 0,
                    widget_key: 'Data Assessment'
                }
            ])
        );
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppScreen setFilterValue={() => {}} {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render AppScreen4 Component', async () => {
        const props = {
            app_info: {
                approach_url: false,
                blueprint_link: null,
                config_link: null,
                description: null,
                function: null,
                id: 261,
                industry: null,
                is_app_user: false,
                is_user_admin: true,
                logo_url: `${
                    import.meta.env['REACT_APP_STATIC_DATA_ASSET']
                }/codex-products-test/danone_logo.png?se=2022-01-24T13%3A50%3A58Z&sp=r&sv=2018-03-28&sr=b&sig=5JbfdvMCefxdpFJZ%2BAjSBU5EoIWi2zup6Zfi0dX7jQg%3D`,
                modules: {
                    dashboard: false,
                    filter_settings: false,
                    fullscreen_mode: false,
                    user_mgmt: false,
                    data_story: true
                },
                name: 'Marketing Media Mix Planner',
                permissions: false,
                restricted_app: false,
                screens: [
                    {
                        action_settings: false,
                        graph_type: null,
                        horizontal: null,
                        id: 6365,
                        level: null,
                        rating_url: null,
                        screen_auto_refresh: true,
                        screen_description: 'false',
                        screen_filters_open: false,
                        screen_filters_values: false,
                        screen_image: 'false',
                        screen_index: 0,
                        screen_name: 'Data Health Tracker',
                        widget_count: 0
                    },
                    {
                        action_settings: false,
                        graph_type: null,
                        horizontal: null,
                        id: 6366,
                        level: 1,
                        rating_url: null,
                        screen_auto_refresh: true,
                        screen_description: 'false',
                        screen_filters_open: false,
                        screen_filters_values: {
                            dataValues: [
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 0,
                                    widget_filter_isall: true,
                                    widget_filter_multiselect: true,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Product Line',
                                    widget_tag_label: 'Product Line',
                                    widget_tag_value: [
                                        'All',
                                        'Danone',
                                        'Blue House',
                                        'Red House',
                                        'Tailored Nutrition',
                                        'Competition'
                                    ]
                                },
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 1,
                                    widget_filter_isall: true,
                                    widget_filter_multiselect: true,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Brand',
                                    widget_tag_label: 'Brand',
                                    widget_tag_value: [
                                        'All',
                                        'Danone',
                                        'Dumex PWD',
                                        'Dumex RTD',
                                        'Nutricia PWD',
                                        'Nutricia RTD',
                                        'Tailored Nutrition'
                                    ]
                                },
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 2,
                                    widget_filter_isall: true,
                                    widget_filter_multiselect: true,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Marketing Channels',
                                    widget_tag_label: 'Marketing Channels',
                                    widget_tag_value: [
                                        'All',
                                        'ATL',
                                        'BTL',
                                        'Digital',
                                        'Medical Marketing'
                                    ]
                                },
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 3,
                                    widget_filter_isall: true,
                                    widget_filter_multiselect: true,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Touchpoints',
                                    widget_tag_label: 'Touchpoints',
                                    widget_tag_value: [
                                        'All',
                                        'Radio',
                                        'TV',
                                        'Sampling',
                                        'Trade Premium',
                                        'Facebook',
                                        'Google Search',
                                        'Recommendation Program',
                                        'Conference'
                                    ]
                                },
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 4,
                                    widget_filter_isall: true,
                                    widget_filter_multiselect: true,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Drivers',
                                    widget_tag_label: 'Drivers',
                                    widget_tag_value: [
                                        'All',
                                        'Baseline',
                                        'Incremental Sales',
                                        'Sales',
                                        'Volume'
                                    ]
                                },
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 5,
                                    widget_filter_isall: false,
                                    widget_filter_multiselect: false,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Time Period',
                                    widget_tag_label: 'Time Period',
                                    widget_tag_value: ['Jun 2020']
                                }
                            ],
                            defaultValues: {
                                Brand: ['All'],
                                Drivers: ['All'],
                                'Marketing Channels': ['All'],
                                'Product Line': ['Danone'],
                                'Time Period': 'Jun 2020',
                                Touchpoints: ['All']
                            }
                        },
                        screen_image: 'false',
                        screen_index: 1,
                        screen_name: 'Data Source Assessment',
                        widget_count: 1
                    }
                ],
                small_logo_url: `${
                    import.meta.env['REACT_APP_STATIC_DATA_ASSET']
                }/codex-products-test/danone_logo.png?se=2022-01-24T13%3A50%3A58Z&sp=r&sv=2018-03-28&sr=b&sig=5JbfdvMCefxdpFJZ%2BAjSBU5EoIWi2zup6Zfi0dX7jQg%3D`,
                story_count: 0,
                theme: 'blue',
                user_mgmt_access: false
            },
            getGraphData: () => {},
            getWidgets: () => {},
            handleStoriesCount: () => {},
            history: history,
            location: {
                hash: '',
                key: 'g3omg3',
                pathname: '/app/261/data-health-tracker/data-source-assessment',
                search: ''
            },
            match: {
                isExact: true,
                params: {
                    app_id: '261',
                    first_level_slug: 'data-health-tracker',
                    second_level_slug: 'data-source-assessment'
                },
                path: '/app/:app_id/:first_level_slug/:second_level_slug',
                url: '/app/261/data-health-tracker/data-source-assessment'
            },
            routes: [
                {
                    expanded: false,
                    href: '/app/261/data-health-tracker/data-source-assessment',
                    original_href: '/app/261/data-health-tracker',
                    screen_item: {
                        action_settings: false,
                        graph_type: null,
                        horizontal: null,
                        id: 6365,
                        level: null,
                        rating_url: null,
                        screen_auto_refresh: null,
                        screen_description: 'false',
                        screen_filters_open: false,
                        screen_filters_values: false,
                        screen_image: 'false',
                        screen_index: 0,
                        screen_name: 'Data Health Tracker',
                        widget_count: 0
                    },
                    selected: true,
                    show: true,
                    show_title: false
                },
                {
                    href: '/app/261/data-health-tracker/data-source-assessment',
                    level: 1,
                    original_href: '/app/261/data-health-tracker/data-source-assessment',
                    screen_item: {
                        action_settings: false,
                        graph_type: null,
                        horizontal: null,
                        id: 6366,
                        level: 1,
                        rating_url: null,
                        screen_auto_refresh: null,
                        screen_description: 'false',
                        screen_filters_open: false,
                        screen_filters_values: {
                            dataValues: [
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 0,
                                    widget_filter_isall: true,
                                    widget_filter_multiselect: true,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Product Line',
                                    widget_tag_label: 'Product Line',
                                    widget_tag_value: [
                                        'All',
                                        'Danone',
                                        'Blue House',
                                        'Red House',
                                        'Tailored Nutrition',
                                        'Competition'
                                    ]
                                },
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 1,
                                    widget_filter_isall: true,
                                    widget_filter_multiselect: true,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Brand',
                                    widget_tag_label: 'Brand',
                                    widget_tag_value: [
                                        'All',
                                        'Danone',
                                        'Dumex PWD',
                                        'Dumex RTD',
                                        'Nutricia PWD',
                                        'Nutricia RTD',
                                        'Tailored Nutrition'
                                    ]
                                },
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 2,
                                    widget_filter_isall: true,
                                    widget_filter_multiselect: true,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Marketing Channels',
                                    widget_tag_label: 'Marketing Channels',
                                    widget_tag_value: [
                                        'All',
                                        'ATL',
                                        'BTL',
                                        'Digital',
                                        'Medical Marketing'
                                    ]
                                },
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 3,
                                    widget_filter_isall: true,
                                    widget_filter_multiselect: true,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Touchpoints',
                                    widget_tag_label: 'Touchpoints',
                                    widget_tag_value: [
                                        'All',
                                        'Radio',
                                        'TV',
                                        'Sampling',
                                        'Trade Premium',
                                        'Facebook',
                                        'Google Search',
                                        'Recommendation Program',
                                        'Conference'
                                    ]
                                },
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 4,
                                    widget_filter_isall: true,
                                    widget_filter_multiselect: true,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Drivers',
                                    widget_tag_label: 'Drivers',
                                    widget_tag_value: [
                                        'All',
                                        'Baseline',
                                        'Incremental Sales',
                                        'Sales',
                                        'Volume'
                                    ]
                                },
                                {
                                    widget_filter_function: false,
                                    widget_filter_function_parameter: false,
                                    widget_filter_hierarchy_key: false,
                                    widget_filter_index: 5,
                                    widget_filter_isall: false,
                                    widget_filter_multiselect: false,
                                    widget_tag_input_type: 'select',
                                    widget_tag_key: 'Time Period',
                                    widget_tag_label: 'Time Period',
                                    widget_tag_value: ['Jun 2020']
                                }
                            ],
                            defaultValues: {
                                Brand: ['All'],
                                Drivers: ['All'],
                                'Marketing Channels': ['All'],
                                'Product Line': ['Danone'],
                                'Time Period': 'Jun 2020',
                                Touchpoints: ['All']
                            }
                        },
                        screen_image: 'false',
                        screen_index: 1,
                        screen_name: 'Data Source Assessment',
                        widget_count: 1
                    },
                    selected: true,
                    show: true,
                    show_title: true
                }
            ],
            setScreenId: () => {},
            setFilterValue: () => {}
        };

        getWidgets.mockImplementation(({ callback }) =>
            callback([
                {
                    config: {
                        action_link: false,
                        assumptions_header: false,
                        color_nooverride: false,
                        filters_open: false,
                        legend: false,
                        prefix: false,
                        size_nooverride: false,
                        subtitle: false,
                        title: false,
                        traces: false,
                        value_factor: false
                    },
                    id: 17750,
                    is_label: false,
                    widget_index: 0,
                    widget_key: 'Data Assessment'
                }
            ])
        );
        vi.useFakeTimers();
        const { getByText, debug, rerender } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppScreen setFilterValue={() => {}} {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        act(() => {
            vi.advanceTimersByTime(1000);
        });
    });
    it('should render loading state with spinner', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MockedAppScreen {...mockProps} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const spinnerElements = document.getElementsByClassName('widgetContent');
        expect(spinnerElements.length).toBe(0);
    });

    it('should render empty message when no widgets and not loading', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MockedAppScreen {...mockProps} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    it('should render video player if videoOpen is true', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MockedAppScreen {...{ ...mockProps, videoOpen: true }} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    it('should display snackbar notifications', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MockedAppScreen
                            {...{
                                ...mockProps,
                                state: {
                                    ...mockProps.state,
                                    notificationOpen: true,
                                    notification: { severity: 'success', message: 'Test message' }
                                }
                            }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    it('does not render widgets when loading is true', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppScreen
                            classes={{}}
                            app_info={{}}
                            breadcrumbs_empty={false}
                            breadcrumb={[]}
                            top_navbar={false}
                            loading={true}
                            {...mockProps}
                            widget_type="not-app"
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.queryByTestId('widgets-container')).not.toBeInTheDocument();
    });
    it('renders top navbar if top_navbar is true', () => {
        const { container } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppScreen
                            classes={{ gridContainerWithBottomBorder: 'top-navbar' }}
                            app_info={{}}
                            breadcrumbs_empty={false}
                            breadcrumb={[]}
                            top_navbar={true}
                            loading={false}
                            widget_type="not-app"
                            {...mockProps}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const elements = container.getElementsByClassName('gridContainerWithBottomBorder');

        expect(elements.length).toBe(0);
    });
});
