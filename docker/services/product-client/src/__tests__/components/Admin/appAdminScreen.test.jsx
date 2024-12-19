import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AppAdminScreens from '../../../components/Admin/AppAdminScreens';
import CustomThemeContextProvider from '../../../themes/customThemeContext';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

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

    const config = {
        id: 10,
        name: 'Integrated Demand Forecasting',
        environment_id: 1,
        contact_email: 'ranjith@themathcompany.com',
        config: {
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
                user_mgmt: false
            },
            screens: [
                {
                    graph_type: '2-1',
                    name: 'Demand Analysis',
                    no_graphs: 3,
                    no_labels: 3,
                    settings: []
                },
                { level: 1, name: 'Size & Opportunity' },
                {
                    graph_type: '2-1',
                    level: 2,
                    name: 'Demand Sizing',
                    no_graphs: 3,
                    no_labels: 4,
                    settings: [
                        {
                            component: 'Demand Sizing',
                            item: 'Industry Volume 2019',
                            item_index: 0,
                            item_is_label: true,
                            name: 'Size & Opportunity',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        },
                        {
                            component: 'Demand Sizing',
                            item: 'Portfolio Volume 2019',
                            item_index: 1,
                            item_is_label: true,
                            name: 'Size & Opportunity',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        },
                        {
                            component: 'Demand Sizing',
                            item: 'Volume Opportunity 2020',
                            item_index: 2,
                            item_is_label: true,
                            name: 'Size & Opportunity',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        },
                        {
                            component: 'Demand Sizing',
                            item: 'Value Opportunity 2020',
                            item_index: 3,
                            item_is_label: true,
                            name: 'Size & Opportunity',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        },
                        {
                            component: 'Demand Sizing',
                            item: 'Market Opportunity',
                            item_index: 0,
                            item_is_label: false,
                            name: 'Size & Opportunity',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        },
                        {
                            component: 'Demand Sizing',
                            item: 'Trend - Industry Volume & Company Volume',
                            item_index: 1,
                            item_is_label: false,
                            name: 'Size & Opportunity',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        },
                        {
                            component: 'Demand Sizing',
                            item: 'Demand growth across regions',
                            item_index: '002',
                            item_is_label: false,
                            name: 'Size & Opportunity',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        }
                    ]
                },
                {
                    level: 2,
                    name: 'Opportunity Breakdown',
                    no_graphs: 1,
                    no_labels: 4,
                    settings: [
                        {
                            component: 'Opportunity Breakdown',
                            item: 'Industry Volume 2019',
                            item_index: 0,
                            item_is_label: true,
                            name: 'Size & Opportunity',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        },
                        {
                            component: 'Opportunity Breakdown',
                            item: 'Portfolio Volume 2019',
                            item_index: 1,
                            item_is_label: true,
                            name: 'Size & Opportunity',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        },
                        {
                            component: 'Opportunity Breakdown',
                            item: 'Volume Opportunity 2020',
                            item_index: 2,
                            item_is_label: true,
                            name: 'Size & Opportunity',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        },
                        {
                            component: 'Opportunity Breakdown',
                            item: 'Value Opportunity 2020',
                            item_index: 3,
                            item_is_label: true,
                            name: 'Size & Opportunity',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        },
                        {
                            component: 'Opportunity Breakdown',
                            item: 'Share of Demand & Sales',
                            item_index: 0,
                            item_is_label: false,
                            name: 'Size & Opportunity',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        }
                    ]
                },
                { level: 1, name: 'Pattern Analysis' },
                {
                    graph_type: '1-2',
                    horizontal: true,
                    level: 2,
                    name: 'Characteristics',
                    no_graphs: 3,
                    no_labels: 0,
                    settings: [
                        {
                            component: 'Characteristics',
                            item: 'Demand And Cyclicity',
                            item_index: 0,
                            item_is_label: false,
                            name: 'Pattern Analysis',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            title: 'DEMAND TREND & CYCLICITY ANALYSIS',
                            traces: [
                                { index: 1, type: 'dot' },
                                { index: 3, type: 'dot' }
                            ],
                            type: 'Reports'
                        },
                        {
                            component: 'Characteristics',
                            item: 'Seasonality heatmap',
                            item_index: '001',
                            item_is_label: false,
                            name: 'Pattern Analysis',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        },
                        {
                            component: 'Characteristics',
                            item: 'callouts',
                            item_index: '101',
                            item_is_label: false,
                            name: 'Pattern Analysis',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            title: 'ALERTS',
                            type: 'Reports'
                        }
                    ]
                },
                {
                    level: 2,
                    name: 'Portfolio Segmentation',
                    no_graphs: 4,
                    no_labels: 0,
                    settings: [
                        {
                            component: 'Portfolio Segmentation',
                            item: 'Pareto of SKUs in portfolio',
                            item_index: 0,
                            item_is_label: false,
                            name: 'Pattern Analysis',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        },
                        {
                            component: 'Portfolio Segmentation',
                            item: '% SKUs with variability of Demand',
                            item_index: 1,
                            item_is_label: false,
                            name: 'Pattern Analysis',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        },
                        {
                            component: 'Portfolio Segmentation',
                            item: 'Patterns of SKUs in portfolio',
                            item_index: 2,
                            item_is_label: false,
                            name: 'Pattern Analysis',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        },
                        {
                            component: 'Portfolio Segmentation',
                            item: 'Portfolio Segments',
                            item_index: 3,
                            item_is_label: false,
                            name: 'Pattern Analysis',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        }
                    ]
                },
                {
                    level: 2,
                    name: 'Exception Analysis',
                    no_graphs: 1,
                    no_labels: 0,
                    settings: [
                        {
                            component: 'Exception Analysis',
                            item: 'Analysis',
                            item_index: 0,
                            item_is_label: false,
                            name: 'Pattern Analysis',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        }
                    ]
                },
                {
                    level: 2,
                    name: 'Velocity',
                    no_graphs: 4,
                    no_labels: 0,
                    settings: [
                        {
                            component: 'Velocity',
                            item: 'Regions with high velocity',
                            item_index: 0,
                            item_is_label: false,
                            name: 'Pattern Analysis',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        },
                        {
                            component: 'Velocity',
                            item: 'Comparison of Velocity',
                            item_index: 1,
                            item_is_label: false,
                            name: 'Pattern Analysis',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        },
                        {
                            component: 'Velocity',
                            item: 'Velocity Analysis',
                            item_index: 2,
                            item_is_label: false,
                            name: 'Pattern Analysis',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Reports'
                        },
                        {
                            component: 'Velocity',
                            item: 'callouts',
                            item_index: 3,
                            item_is_label: false,
                            name: 'Pattern Analysis',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            title: 'ALERTS',
                            type: 'Reports'
                        }
                    ]
                },
                { name: 'Forecast' },
                { level: 1, name: 'Industry' },
                {
                    graph_type: '1-2',
                    horizontal: true,
                    level: 2,
                    name: 'Baseline Forecast',
                    no_graphs: 3,
                    no_labels: 4,
                    settings: [
                        {
                            component: 'Baseline Forecast',
                            item: 'Industry Volume 2019',
                            item_index: 0,
                            item_is_label: true,
                            name: 'Industry',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Baseline Forecast',
                            item: 'Portfolio Volume 2019',
                            item_index: 1,
                            item_is_label: true,
                            name: 'Industry',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Baseline Forecast',
                            item: 'Volume Opportunity 2020',
                            item_index: 2,
                            item_is_label: true,
                            name: 'Industry',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Baseline Forecast',
                            item: 'Value Opportunity 2020',
                            item_index: 3,
                            item_is_label: true,
                            name: 'Industry',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Baseline Forecast',
                            item: '3 Year Baseline Forecast',
                            item_index: 0,
                            item_is_label: false,
                            name: 'Industry',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            traces: [
                                { index: 5, type: 'dot' },
                                { index: 1, type: 'dot' }
                            ],
                            type: 'Forecasts'
                        },
                        {
                            component: 'Baseline Forecast',
                            item: 'Forecast Analysis',
                            item_index: '001',
                            item_is_label: false,
                            name: 'Industry',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Baseline Forecast',
                            item: 'callouts',
                            item_index: '101',
                            item_is_label: false,
                            name: 'Industry',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            title: 'ALERTS',
                            type: 'Forecasts'
                        }
                    ]
                },
                {
                    graph_type: '1-2',
                    horizontal: true,
                    level: 2,
                    name: 'Driver (Leading Indicator) Forecast',
                    no_graphs: 3,
                    no_labels: 0,
                    settings: [
                        {
                            component: 'Driver Forecast',
                            item: 'Driver Trend & Variance : Personal Income',
                            item_index: 0,
                            item_is_label: false,
                            name: 'Industry',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Driver Forecast',
                            item: 'Details',
                            item_index: '001',
                            item_is_label: false,
                            name: 'Industry',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            title: 'INDIVIDUAL DRIVER ANALYSIS',
                            type: 'Forecasts'
                        },
                        {
                            component: 'Driver Forecast',
                            item: 'callouts',
                            item_index: '101',
                            item_is_label: false,
                            name: 'Industry',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            title: 'KEY CALLOUTS',
                            type: 'Forecasts'
                        }
                    ]
                },
                {
                    graph_type: '1-2',
                    horizontal: true,
                    level: 2,
                    name: 'Impact Analysis',
                    no_graphs: 3,
                    no_labels: 0,
                    settings: [
                        {
                            component: 'Impact Analysis',
                            item: 'Driver Impact Analysis',
                            item_index: 0,
                            item_is_label: false,
                            name: 'Industry',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Impact Analysis',
                            item: 'Impact Analysis',
                            item_index: '001',
                            item_is_label: false,
                            name: 'Industry',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Impact Analysis',
                            item: 'Driver Impact Over time',
                            item_index: '101',
                            item_is_label: false,
                            name: 'Industry',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        }
                    ]
                },
                { level: 2, name: 'Driver Interactions' },
                { level: 1, name: 'Category' },
                {
                    graph_type: '1-2',
                    horizontal: true,
                    level: 2,
                    name: 'Baseline Forecast',
                    no_graphs: 3,
                    no_labels: 4,
                    settings: [
                        {
                            component: 'Baseline Forecast',
                            item: 'Industry Volume 2019',
                            item_index: 0,
                            item_is_label: true,
                            name: 'Category',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Baseline Forecast',
                            item: 'Portfolio Volume 2019',
                            item_index: 1,
                            item_is_label: true,
                            name: 'Category',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Baseline Forecast',
                            item: 'Volume Opportunity 2020',
                            item_index: 2,
                            item_is_label: true,
                            name: 'Category',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Baseline Forecast',
                            item: 'Value Opportunity 2020',
                            item_index: 3,
                            item_is_label: true,
                            name: 'Category',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Baseline Forecast',
                            item: '3 Year Baseline Forecast',
                            item_index: 0,
                            item_is_label: false,
                            name: 'Category',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            traces: [
                                { index: 1, type: 'dot' },
                                { index: 5, type: 'dot' }
                            ],
                            type: 'Forecasts'
                        },
                        {
                            component: 'Baseline Forecast',
                            item: 'Individual Driver Analysis',
                            item_index: '001',
                            item_is_label: false,
                            name: 'Category',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Baseline Forecast',
                            item: 'callouts',
                            item_index: '101',
                            item_is_label: false,
                            name: 'Category',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            title: 'ALERTS',
                            type: 'Forecasts'
                        }
                    ]
                },
                {
                    graph_type: '1-2',
                    horizontal: true,
                    level: 2,
                    name: 'Driver (Leading Indicator) Forecast',
                    no_graphs: 3,
                    no_labels: 0,
                    settings: [
                        {
                            component: 'Driver Forecast',
                            item: 'Driver Trend & Variance : Personal Income',
                            item_index: 0,
                            item_is_label: false,
                            name: 'Category',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Driver Forecast',
                            item: 'Individual Driver Analysis',
                            item_index: '001',
                            item_is_label: false,
                            name: 'Category',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Driver Forecast',
                            item: 'callouts',
                            item_index: '101',
                            item_is_label: false,
                            name: 'Category',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            title: 'KEY CALLOUTS',
                            type: 'Forecasts'
                        }
                    ]
                },
                {
                    graph_type: '1-2',
                    horizontal: true,
                    level: 2,
                    name: 'Impact Analysis',
                    no_graphs: 3,
                    no_labels: 0,
                    settings: [
                        {
                            component: 'Impact Analysis',
                            item: 'Driver Impact Analysis',
                            item_index: 0,
                            item_is_label: false,
                            name: 'Category',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Impact Analysis',
                            item: 'Impact Analysis',
                            item_index: '001',
                            item_is_label: false,
                            name: 'Category',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Impact Analysis',
                            item: 'Driver Impact Over time',
                            item_index: '101',
                            item_is_label: false,
                            name: 'Category',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        }
                    ]
                },
                { level: 2, name: 'Driver Interactions' },
                { level: 1, name: 'SKU' },
                {
                    graph_type: '1-2',
                    horizontal: true,
                    level: 2,
                    name: 'Baseline Forecast',
                    no_graphs: 3,
                    no_labels: 4,
                    settings: [
                        {
                            component: 'Baseline Forecast',
                            item: 'Industry Volume 2019',
                            item_index: 0,
                            item_is_label: true,
                            name: 'SKU',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Baseline Forecast',
                            item: 'Portfolio Volume 2019',
                            item_index: 1,
                            item_is_label: true,
                            name: 'SKU',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Baseline Forecast',
                            item: 'Volume Opportunity 2020',
                            item_index: 2,
                            item_is_label: true,
                            name: 'SKU',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Baseline Forecast',
                            item: 'Value Opportunity 2020',
                            item_index: 3,
                            item_is_label: true,
                            name: 'SKU',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Baseline Forecast',
                            item: '3 Year Baseline Forecast',
                            item_index: 0,
                            item_is_label: false,
                            name: 'SKU',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            traces: [
                                { index: 1, type: 'dot' },
                                { index: 5, type: 'dot' }
                            ],
                            type: 'Forecasts'
                        },
                        {
                            component: 'Baseline Forecast',
                            item: 'Individual Driver Analysis',
                            item_index: '001',
                            item_is_label: false,
                            name: 'SKU',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Baseline Forecast',
                            item: 'callouts',
                            item_index: '101',
                            item_is_label: false,
                            name: 'SKU',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            title: 'ALERTS',
                            type: 'Forecasts'
                        }
                    ]
                },
                {
                    graph_type: '1-1',
                    horizontal: true,
                    level: 2,
                    name: 'Driver (Leading Indicator) Forecast',
                    no_graphs: 2,
                    no_labels: 0,
                    settings: [
                        {
                            component: 'Driver Forecast',
                            item: 'Driver Trend & Variance : Personal Income',
                            item_index: 0,
                            item_is_label: false,
                            name: 'SKU',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Driver Forecast',
                            item: 'callouts',
                            item_index: '001',
                            item_is_label: false,
                            name: 'SKU',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            title: 'KEY CALLOUTS',
                            type: 'Forecasts'
                        }
                    ]
                },
                {
                    graph_type: '1-2',
                    horizontal: true,
                    level: 2,
                    name: 'Impact Analysis',
                    no_graphs: 3,
                    no_labels: 0,
                    settings: [
                        {
                            component: 'Impact Analysis',
                            item: 'Driver Impact Analysis',
                            item_index: 0,
                            item_is_label: false,
                            name: 'SKU',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Impact Analysis',
                            item: 'Impact Analysis',
                            item_index: '001',
                            item_is_label: false,
                            name: 'SKU',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        },
                        {
                            component: 'Impact Analysis',
                            item: 'Driver Impact Over time',
                            item_index: '101',
                            item_is_label: false,
                            name: 'SKU',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Forecasts'
                        }
                    ]
                },
                { level: 2, name: 'Driver Interactions' },
                { name: 'Collaborative Planning' },
                {
                    graph_type: '1-1',
                    horizontal: true,
                    level: 1,
                    name: 'Business Planning Support',
                    no_graphs: 2,
                    no_labels: 4,
                    settings: [
                        {
                            component: 'Business Planning Support',
                            item: 'Industry Volume 2019',
                            item_index: 0,
                            item_is_label: true,
                            name: 'Collaborative Planning',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Planning'
                        },
                        {
                            component: 'Business Planning Support',
                            item: 'Portfolio Volume 2019',
                            item_index: 1,
                            item_is_label: true,
                            name: 'Collaborative Planning',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Planning'
                        },
                        {
                            component: 'Business Planning Support',
                            item: 'Volume Opportunity 2020',
                            item_index: 2,
                            item_is_label: true,
                            name: 'Collaborative Planning',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Planning'
                        },
                        {
                            component: 'Business Planning Support',
                            item: 'Value Opportunity 2020',
                            item_index: 3,
                            item_is_label: true,
                            name: 'Collaborative Planning',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Planning'
                        },
                        {
                            component: 'Business Planning Support',
                            item: 'Forecast vs 1YP and 3YP',
                            item_index: 0,
                            item_is_label: false,
                            name: 'Collaborative Planning',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            title: 'FORECAST : 1YP VS 3YP',
                            type: 'Planning'
                        },
                        {
                            component: 'Business Planning Support',
                            item: 'Price Vs. Forecast',
                            item_index: '001',
                            item_is_label: false,
                            name: 'Collaborative Planning',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Planning'
                        }
                    ]
                },
                { name: 'Growth Lever Simulation' },
                {
                    graph_type: '1-1',
                    horizontal: true,
                    level: 1,
                    name: 'Build Scenario',
                    no_graphs: 2,
                    no_labels: 4,
                    settings: [
                        {
                            component: 'Build Scenario',
                            item: 'Sales-Volume',
                            item_index: 0,
                            item_is_label: true,
                            name: 'Growth Lever Simulation',
                            simulator_component: 'Build Scenario',
                            simulator_item: 'Sales-Volume Scenario',
                            simulator_name: 'Growth Lever Simulation',
                            simulator_type: 'Simulate & Optimize',
                            type: 'Simulate & Optimize'
                        },
                        {
                            component: 'Build Scenario',
                            item: 'Revenue',
                            item_index: 1,
                            item_is_label: true,
                            name: 'Growth Lever Simulation',
                            simulator_component: 'Build Scenario',
                            simulator_item: 'Revenue Scenario',
                            simulator_name: 'Growth Lever Simulation',
                            simulator_type: 'Simulate & Optimize',
                            type: 'Simulate & Optimize'
                        },
                        {
                            component: 'Build Scenario',
                            item: 'Deviation from 1YP',
                            item_index: 2,
                            item_is_label: true,
                            name: 'Growth Lever Simulation',
                            simulator_component: 'Build Scenario',
                            simulator_item: 'Deviation from 1YP Scenario',
                            simulator_name: 'Growth Lever Simulation',
                            simulator_type: 'Simulate & Optimize',
                            type: 'Simulate & Optimize'
                        },
                        {
                            component: 'Build Scenario',
                            item: 'Estimated Reversal Cost',
                            item_index: 3,
                            item_is_label: true,
                            name: 'Growth Lever Simulation',
                            simulator_component: 'Build Scenario',
                            simulator_item: 'Estimated Reversal Cost Scenario',
                            simulator_name: 'Growth Lever Simulation',
                            simulator_type: 'Simulate & Optimize',
                            type: 'Simulate & Optimize'
                        },
                        {
                            component: 'Build Scenario',
                            item: 'Levers',
                            item_index: 0,
                            item_is_label: false,
                            name: 'Growth Lever Simulation',
                            simulator_component: 'Build Scenario',
                            simulator_item: 'Levers',
                            simulator_name: 'Growth Lever Simulation',
                            simulator_type: 'Simulate & Optimize',
                            type: 'Simulate & Optimize'
                        },
                        {
                            component: 'Build Scenario',
                            item: '3 Year Baseline Forecast',
                            item_index: '001',
                            item_is_label: false,
                            name: 'Growth Lever Simulation',
                            simulator_component: 'Build Scenario',
                            simulator_item: '3 Year Baseline Forecast Scenario',
                            simulator_name: 'Growth Lever Simulation',
                            simulator_type: 'Simulate & Optimize',
                            traces: [{ index: 1, type: 'dot' }],
                            type: 'Simulate & Optimize'
                        }
                    ]
                },
                {
                    graph_type: '3-1',
                    horizontal: true,
                    level: 1,
                    name: 'Compare Scenarios',
                    no_graphs: 4,
                    no_labels: 0,
                    settings: [
                        {
                            component: 'Compare Scenarios',
                            item: 'Scenario 1 : Outcome',
                            item_index: 0,
                            item_is_label: false,
                            name: 'Growth Lever Simulation',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Simulate & Optimize'
                        },
                        {
                            component: 'Compare Scenarios',
                            item: 'Scenario 2 : Outcome',
                            item_index: 1,
                            item_is_label: false,
                            name: 'Growth Lever Simulation',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Simulate & Optimize'
                        },
                        {
                            component: 'Compare Scenarios',
                            item: 'Scenario 3 : Outcome',
                            item_index: 2,
                            item_is_label: false,
                            name: 'Growth Lever Simulation',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            type: 'Simulate & Optimize'
                        },
                        {
                            component: 'Compare Scenarios',
                            item: '3 Year Baseline Forecast',
                            item_index: '003',
                            item_is_label: false,
                            name: 'Growth Lever Simulation',
                            simulator_component: false,
                            simulator_item: false,
                            simulator_name: false,
                            simulator_type: false,
                            traces: [{ index: 1, type: 'dot' }],
                            type: 'Simulate & Optimize'
                        }
                    ]
                },
                { level: 1, name: 'Goal Oriented Simulation' }
            ],
            theme: 'blue'
        }
    };

    test('Should render AppAdmin Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminScreens app_info={app_info} config={config} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render AppAdmin Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppAdminScreens app_info={app_info} />
                </Router>
            </CustomThemeContextProvider>
        );

        //fireEvent.click(screen.getByText("Add Page"))
    });
});
