import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AppAdmin from '../../components/AppAdmin';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { getAdminDetails, getAdminDetailsFromId } from 'services/admin.js';
import { Provider } from 'react-redux';
import store from 'store/store';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../services/admin', () => ({
    getAdminDetails: vi.fn(),
    getAdminDetailsFromId: vi.fn()
}));
vi.mock('../../components/Admin/Overview', () => {
    return { default: (props) => <div>Mocked Overview Component</div> };
});
vi.mock('../../components/Admin/Modules', () => {
    return { default: (props) => <div> Mocked Modules Component</div> };
});
vi.mock('../../components/Admin/AppAdminScreens', () => {
    return { default: (props) => <div> Mocked Screen Component</div> };
});
vi.mock('../../components/Admin/Pipelines', () => {
    return { default: (props) => <div> Mocked Pipelines Component</div> };
});
vi.mock('../../components/Admin/Design', () => {
    return { default: (props) => <div> Mocked Design Component</div> };
});
vi.mock('../../components/Admin/Iterations', () => {
    return { default: (props) => <div> Mocked Iterations Component</div> };
});

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render AppAdmin Component', () => {
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

        getAdminDetailsFromId.mockImplementation(({ callback }) =>
            callback({
                app_info: app_info,
                config_link_details: [
                    '',
                    'projects',
                    '2',
                    'case-studies',
                    '78',
                    'notebooks',
                    '101',
                    'app-configs',
                    '10',
                    'edit'
                ]
            })
        );
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdmin app_info={app_info} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render AppAdmin1 Component', () => {
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
            approach_url: false,
            logo_url: false,
            small_logo_url: false,
            story_count: 8,
            restricted_app: false,
            is_user_admin: true,
            permissions: false
        };
        getAdminDetails.mockImplementation(({ callback }) =>
            callback({
                app_info: app_info,
                config_link_details: [
                    '',
                    'projects',
                    '2',
                    'case-studies',
                    '78',
                    'notebooks',
                    '101',
                    'app-configs',
                    '10',
                    'edit'
                ]
            })
        );
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdmin app_info={app_info} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render AppAdmin2 Component', () => {
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
            approach_url: false,
            logo_url: false,
            small_logo_url: false,
            story_count: 8,
            restricted_app: false,
            is_user_admin: true,
            permissions: false
        };
        getAdminDetails.mockImplementation(({ callback }) =>
            callback({
                app_info: app_info,
                config_link_details: [
                    '',
                    'projects',
                    '2',
                    'case-studies',
                    '78',
                    'notebooks',
                    '101',
                    'app-configs',
                    '10',
                    'edit'
                ]
            })
        );
        history.push('/app/26/admin/overview');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdmin app_info={app_info} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render AppAdmin3 Component', () => {
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
            approach_url: false,
            logo_url: false,
            small_logo_url: false,
            story_count: 8,
            restricted_app: false,
            is_user_admin: true,
            permissions: false
        };
        getAdminDetails.mockImplementation(({ callback }) =>
            callback({
                app_info: app_info,
                config_link_details: [
                    '',
                    'projects',
                    '2',
                    'case-studies',
                    '78',
                    'notebooks',
                    '101',
                    'app-configs',
                    '10',
                    'edit'
                ]
            })
        );
        history.push('/app/26/admin/modules');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdmin app_info={app_info} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render AppAdmin4 Component', () => {
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
            approach_url: false,
            logo_url: false,
            small_logo_url: false,
            story_count: 8,
            restricted_app: false,
            is_user_admin: true,
            permissions: false
        };
        getAdminDetails.mockImplementation(({ callback }) =>
            callback({
                app_info: app_info,
                config_link_details: [
                    '',
                    'projects',
                    '2',
                    'case-studies',
                    '78',
                    'notebooks',
                    '101',
                    'app-configs',
                    '10',
                    'edit'
                ]
            })
        );
        history.push('/app/26/admin/pipelines');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdmin app_info={app_info} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render AppAdmin5 Component', () => {
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
            approach_url: false,
            logo_url: false,
            small_logo_url: false,
            story_count: 8,
            restricted_app: false,
            is_user_admin: true,
            permissions: false
        };
        getAdminDetails.mockImplementation(({ callback }) =>
            callback({
                app_info: app_info,
                config_link_details: [
                    '',
                    'projects',
                    '2',
                    'case-studies',
                    '78',
                    'notebooks',
                    '101',
                    'app-configs',
                    '10',
                    'edit'
                ]
            })
        );
        history.push('/app/26/admin/screens');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdmin app_info={app_info} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render AppAdmin6 Component', () => {
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
            approach_url: false,
            logo_url: false,
            small_logo_url: false,
            story_count: 8,
            restricted_app: false,
            is_user_admin: true,
            permissions: false
        };
        getAdminDetails.mockImplementation(({ callback }) =>
            callback({
                app_info: app_info,
                config_link_details: [
                    '',
                    'projects',
                    '2',
                    'case-studies',
                    '78',
                    'notebooks',
                    '101',
                    'app-configs',
                    '10',
                    'edit'
                ]
            })
        );
        history.push('/app/26/admin/iterations');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdmin app_info={app_info} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render AppAdmin Overview Component', () => {
        const app_info = { id: 26, name: 'Test App' };

        history.push('/app/26/admin/overview');
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdmin app_info={app_info} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('Mocked Overview Component')).toBeInTheDocument();
    });

    test('Should render AppAdmin Modules Component', () => {
        const app_info = { id: 26, name: 'Test App' };

        history.push('/app/26/admin/modules');
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdmin app_info={app_info} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('Mocked Modules Component')).toBeInTheDocument();
    });

    test('Should render AppAdmin Blueprint component with iteration params', () => {
        const app_info = { id: 26, name: 'Test App' };
        history.push('/app/26/admin/noteboooks/1/iterations/2/design');
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdmin app_info={app_info} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('Mocked Design Component')).toBeInTheDocument();
    });
    test('Should redirect to overview when no valid route matches', () => {
        const app_info = { id: 26, name: 'Test App' };

        history.push('/app/26/admin/invalid-route');
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdmin app_info={app_info} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('Mocked Overview Component')).toBeInTheDocument();
    });
});
