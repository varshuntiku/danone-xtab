import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import ScreensLitView from '../../../components/Admin/ScreensListView';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);
    test('rendering ScreenListView component', () => {
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

        const screens = [
            {
                id: 101,
                name: 'Demand Analysis',
                screen_index: 0,
                level: 0,
                hidden: null
            },
            {
                id: 102,
                name: 'Size & Opportunity',
                screen_index: 1,
                level: 1,
                hidden: null
            },
            {
                id: 103,
                name: 'Demand Sizing',
                screen_index: 2,
                level: 2,
                hidden: null
            },
            {
                id: 104,
                name: 'Opportunity Breakdown',
                screen_index: 3,
                level: 2,
                hidden: null
            },
            {
                id: 105,
                name: 'Pattern Analysis',
                screen_index: 4,
                level: 1,
                hidden: null
            },
            {
                id: 106,
                name: 'Characteristics',
                screen_index: 5,
                level: 2,
                hidden: null
            },
            {
                id: 107,
                name: 'Portfolio Segmentation',
                screen_index: 6,
                level: 2,
                hidden: null
            },
            {
                id: 108,
                name: 'Exception Analysis',
                screen_index: 7,
                level: 2,
                hidden: null
            },
            {
                id: 109,
                name: 'Velocity',
                screen_index: 8,
                level: 2,
                hidden: null
            },
            {
                id: 110,
                name: 'Forecast',
                screen_index: 9,
                level: 0,
                hidden: null
            },
            {
                id: 111,
                name: 'Industry',
                screen_index: 10,
                level: 1,
                hidden: null
            },
            {
                id: 112,
                name: 'Baseline Forecast',
                screen_index: 11,
                level: 2,
                hidden: null
            },
            {
                id: 113,
                name: 'Driver (Leading Indicator) Forecast',
                screen_index: 12,
                level: 2,
                hidden: null
            },
            {
                id: 114,
                name: 'Impact Analysis',
                screen_index: 13,
                level: 2,
                hidden: null
            }
        ];
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ScreensLitView app_info={app_info} unsavedValues={{}} screens={screens} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test(' rendering of input with screen_config value', () => {
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

        const screens = [
            {
                id: 101,
                name: 'Demand Analysis',
                screen_index: 0,
                level: 0,
                hidden: null
            },
            {
                id: 102,
                name: 'Size & Opportunity',
                screen_index: 1,
                level: 1,
                hidden: null
            },
            {
                id: 103,
                name: 'Demand Sizing',
                screen_index: 2,
                level: 2,
                hidden: null
            },
            {
                id: 104,
                name: 'Opportunity Breakdown',
                screen_index: 3,
                level: 2,
                hidden: null
            },
            {
                id: 105,
                name: 'Pattern Analysis',
                screen_index: 4,
                level: 1,
                hidden: null
            },
            {
                id: 106,
                name: 'Characteristics',
                screen_index: 5,
                level: 2,
                hidden: null
            },
            {
                id: 107,
                name: 'Portfolio Segmentation',
                screen_index: 6,
                level: 2,
                hidden: null
            },
            {
                id: 108,
                name: 'Exception Analysis',
                screen_index: 7,
                level: 2,
                hidden: null
            },
            {
                id: 109,
                name: 'Velocity',
                screen_index: 8,
                level: 2,
                hidden: null
            },
            {
                id: 110,
                name: 'Forecast',
                screen_index: 9,
                level: 0,
                hidden: null
            },
            {
                id: 111,
                name: 'Industry',
                screen_index: 10,
                level: 1,
                hidden: null
            },
            {
                id: 112,
                name: 'Baseline Forecast',
                screen_index: 11,
                level: 2,
                hidden: null
            },
            {
                id: 113,
                name: 'Driver (Leading Indicator) Forecast',
                screen_index: 12,
                level: 2,
                hidden: null
            },
            {
                id: 114,
                name: 'Impact Analysis',
                screen_index: 13,
                level: 2,
                hidden: null
            }
        ];
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ScreensLitView app_info={app_info} unsavedValues={{}} screens={screens} />
                </Router>
            </CustomThemeContextProvider>
        );
        const saveButtonElement = screen.getByRole('button', { name: 'Save Screens' });
        expect(saveButtonElement).toBeInTheDocument();
        const mainScreentext = screen.getByText('Main Screen');
        expect(mainScreentext).toBeInTheDocument();
        const input = screen.getByDisplayValue('Impact Analysis');
        expect(input).toBeInTheDocument();
        const [btn] = screen.getAllByLabelText('more');
        expect(btn).toBeInTheDocument();
    });
    test('rendering menu and displaying different options  on clicking  more button', () => {
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

        const screens = [
            {
                id: 101,
                name: 'Demand Analysis',
                screen_index: 0,
                level: 0,
                hidden: null
            },
            {
                id: 102,
                name: 'Size & Opportunity',
                screen_index: 1,
                level: 1,
                hidden: null
            },
            {
                id: 103,
                name: 'Demand Sizing',
                screen_index: 2,
                level: 2,
                hidden: null
            },
            {
                id: 104,
                name: 'Opportunity Breakdown',
                screen_index: 3,
                level: 2,
                hidden: null
            },
            {
                id: 105,
                name: 'Pattern Analysis',
                screen_index: 4,
                level: 1,
                hidden: null
            }
        ];
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ScreensLitView app_info={app_info} unsavedValues={{}} screens={screens} />
                </Router>
            </CustomThemeContextProvider>
        );

        const [btn] = screen.getAllByLabelText('more');
        expect(btn).toBeInTheDocument();
        fireEvent.click(btn);
        const [listItemOne] = screen.getAllByText('Set to Main Screen');
        expect(listItemOne).toBeInTheDocument();
        const [listItemTwo] = screen.getAllByText('Set to Sub Screen');
        expect(listItemTwo).toBeInTheDocument();
        const [listItemThree] = screen.getAllByText('Set to Tab');
        expect(listItemThree).toBeInTheDocument();
        const [listItemFour] = screen.getAllByText('Remove Screen');
        expect(listItemFour).toBeInTheDocument();
        const [listItemFive] = screen.getAllByText('Set to Screen Stepper');
        expect(listItemFive).toBeInTheDocument();
    });
    test('rendering confirm pop up on clicking remove screen option', () => {
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

        const screens = [
            {
                id: 101,
                name: 'Demand Analysis',
                screen_index: 0,
                level: 0,
                hidden: null
            },
            {
                id: 102,
                name: 'Size & Opportunity',
                screen_index: 1,
                level: 1,
                hidden: null
            },
            {
                id: 103,
                name: 'Demand Sizing',
                screen_index: 2,
                level: 2,
                hidden: null
            },
            {
                id: 104,
                name: 'Opportunity Breakdown',
                screen_index: 3,
                level: 2,
                hidden: null
            },
            {
                id: 105,
                name: 'Pattern Analysis',
                screen_index: 4,
                level: 1,
                hidden: null
            }
        ];
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ScreensLitView app_info={app_info} unsavedValues={{}} screens={screens} />
                </Router>
            </CustomThemeContextProvider>
        );

        const [btn] = screen.getAllByLabelText('more');
        expect(btn).toBeInTheDocument();
        fireEvent.click(btn);
        const [listItemOne] = screen.getAllByText('Set to Main Screen');
        expect(listItemOne).toBeInTheDocument();
        const [listItemTwo] = screen.getAllByText('Set to Sub Screen');
        expect(listItemTwo).toBeInTheDocument();
        const [listItemThree] = screen.getAllByText('Set to Tab');
        expect(listItemThree).toBeInTheDocument();
        const [listItemFour] = screen.getAllByText('Remove Screen');
        expect(listItemFour).toBeInTheDocument();
        const [listItemFive] = screen.getAllByText('Set to Screen Stepper');
        expect(listItemFive).toBeInTheDocument();
        fireEvent.click(listItemFour);
        const popUpTitle = screen.getByText('Remove Screen?');
        expect(popUpTitle).toBeInTheDocument();
        const popuptext = screen.getByText('Are you sure you want to remove');
        expect(popuptext).toBeInTheDocument();
        const CancelBtn = screen.getByRole('button', { name: 'Cancel' });
        expect(CancelBtn).toBeInTheDocument();
        const RemoveBtn = screen.getByRole('button', { name: 'Remove' });
        expect(RemoveBtn).toBeInTheDocument();
    });
    test('testing save screen button which is diabled when valueChanged will be false', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ScreensLitView
                        app_info={{}}
                        unsavedValues={{}}
                        screens={[]}
                        valueChanged={false}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        const saveBtn = screen.getByRole('button', { name: 'Save Screens' });
        expect(saveBtn).toBeInTheDocument();
        expect(saveBtn).toBeDisabled();
    });
    test('testing save screen button which has to be diabled when valueChanged will be false', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ScreensLitView
                        app_info={{}}
                        unsavedValues={{}}
                        screens={[]}
                        valueChanged={false}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        const saveBtn = screen.getByRole('button', { name: 'Save Screens' });
        expect(saveBtn).toBeInTheDocument();
        expect(saveBtn).toBeDisabled();
    });
    test('testing save screen button which has to be not diabled when valueChanged will be true', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ScreensLitView
                        app_info={{}}
                        unsavedValues={{}}
                        screens={[]}
                        valueChanged={true}
                        editMode
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        const saveBtn = screen.getByRole('button', { name: 'Save Screens' });
        expect(saveBtn).toBeInTheDocument();
        expect(saveBtn).not.toBeDisabled();
    });
});
