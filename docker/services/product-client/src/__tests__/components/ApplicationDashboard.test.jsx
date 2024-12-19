import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import ApplicationDashboard from '../../components/ApplicationDashboard';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { Provider } from 'react-redux';
import store from 'store/store';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);
    test('Should render ApplicationDashboard Component', () => {
        const props = {
            match: { params: { industry: 'Retail' } },
            forRestrictedUser: false,
            apps: [
                {
                    id: 3,
                    name: 'Customer Loyalty Segmentation',
                    contact_email: 'shridhar@themathcompany.com',
                    industry: 'Retail',
                    function: 'Customer & Digital Insights',
                    problem_area: 'Customer Insights',
                    problem: 'Customer Loyalty Segmentation',
                    config_link: '/projects/4/case-studies/100/notebooks/235/app-configs/3/edit',
                    blueprint_link: '/projects/7/design',
                    description:
                        'Loyalty based segmentation & assessment of customer lifetime Value',
                    app_link: true,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 45,
                    name: 'GSNFR Optimization',
                    contact_email: 'ranjith@themathcompany.com',
                    industry: 'Retail',
                    function: 'Finance & Procurement',
                    problem_area: 'Finance',
                    problem: 'GSNFR Optimization',
                    config_link: false,
                    blueprint_link: false,
                    description: 'Track GSNFR cost, assess compliance & drive cost optimization',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 2,
                    name: 'Integrated Demand Forecasting',
                    contact_email: 'shridhar@themathcompany.com',
                    industry: 'Retail',
                    function: 'Supply Chain',
                    problem_area: 'Planning',
                    problem: 'Integrated Demand Forecasting',
                    config_link: '/projects/1/case-studies/10/notebooks/208/app-configs/2/edit',
                    blueprint_link: '/projects/2/design',
                    description:
                        'Forecast demand and plan supply chain operations to handle it effectively',
                    app_link: true,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 1,
                    name: 'Marketing & Media Planner',
                    contact_email: 'ashwin@themathcompany.com',
                    industry: 'Retail',
                    function: 'Marketing',
                    problem_area: 'Strategy',
                    problem: 'Market Mix Modeling',
                    config_link: '/projects/2/case-studies/91/notebooks/177/app-configs/8/edit',
                    blueprint_link: '/projects/1/design',
                    description: 'Optimize spend across channels / media vehicles to maximize RoI',
                    app_link: true,
                    approach_url: false,
                    data_story_enabled: true
                },
                {
                    id: 4,
                    name: 'Pricing Optimization',
                    contact_email: 'shridhar@themathcompany.com',
                    industry: 'Retail',
                    function: 'Pricing',
                    problem_area: 'Pricing',
                    problem: 'Pricing Optimization',
                    config_link: '/projects/4/case-studies/95/notebooks/122/app-configs/4/edit',
                    blueprint_link: '/projects/4/design',
                    description:
                        'Differential pricing strategy based on product market price sensitivity',
                    app_link: true,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 18,
                    name: 'Product Affinity Analyser',
                    contact_email: 'sahana@themathcompany.com',
                    industry: 'Retail',
                    function: 'Merchandising & Store Ops',
                    problem_area: 'Assortment',
                    problem: 'Product Affinity Analysis',
                    config_link: '/problem/Retail/Product%20affinity%20analysis',
                    blueprint_link: '/projects/32/design',
                    description:
                        'Co-Merchandise, Substitute , Reduce stock-out & optimize product placement',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 19,
                    name: 'Campaign Effectiveness',
                    contact_email: 'sahana@themathcompany.com',
                    industry: 'Retail',
                    function: 'Marketing',
                    problem_area: 'Advertising',
                    problem: 'Campaign Effectiveness',
                    config_link: false,
                    blueprint_link: false,
                    description:
                        'Test and learn tool to design. develop & measure campaign effectiveness',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 36,
                    name: 'Inventory Management',
                    contact_email: 'ranjith@themathcompany.com',
                    industry: 'Retail',
                    function: 'Supply Chain',
                    problem_area: 'Inventory',
                    problem: 'Inventory Management',
                    config_link: false,
                    blueprint_link: false,
                    description: 'Understand timing and volume of deliveries from store to DC',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 20,
                    name: 'Markdown Optimization',
                    contact_email: 'sahana@themathcompany.com',
                    industry: 'Retail',
                    function: 'Pricing',
                    problem_area: 'Pricing',
                    problem: 'Markdown Optimization',
                    config_link: '/problem/Retail/Dynamic%20Pricing',
                    blueprint_link: '/projects/36/design',
                    description: 'Dynamic pricing strategy based on promotion performance',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 47,
                    name: 'Personalization & Recommendation',
                    contact_email: 'ranjith@themathcompany.com',
                    industry: 'Retail',
                    function: 'Customer & Digital Insights',
                    problem_area: 'Personalization',
                    problem: 'Personalization & Recommendation',
                    config_link: false,
                    blueprint_link: false,
                    description: 'Custom offering, Next best action to drive customer engagement',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 22,
                    name: 'SKU Rationalization',
                    contact_email: 'sahana@themathcompany.com',
                    industry: 'Retail',
                    function: 'Merchandising & Store Ops',
                    problem_area: 'Assortment',
                    problem: 'Dynamic Pricing',
                    config_link: false,
                    blueprint_link: false,
                    description:
                        'Identify products to be discontinued & pricing strategy during clearance',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 46,
                    name: 'Supplier Risk Analytics',
                    contact_email: 'ranjith@themathcompany.com',
                    industry: 'Retail',
                    function: 'Finance & Procurement',
                    problem_area: 'Procurement',
                    problem: 'Supplier Risk Analytics',
                    config_link: '/projects/110/case-studies/111/notebooks/172/app-configs/11/edit',
                    blueprint_link: '/projects/46/design',
                    description:
                        'Monitor & analyze supplier performance, predict risk & plan lead time',
                    app_link: true,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 37,
                    name: 'Digital Channel Performance Analysis',
                    contact_email: 'ranjith@themathcompany.com',
                    industry: 'Retail',
                    function: 'Customer & Digital Insights',
                    problem_area: 'Advertising',
                    problem: 'Digital Channel Performance Analysis',
                    config_link: false,
                    blueprint_link: false,
                    description: 'Sales attribution & evaluation of channel performance',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 21,
                    name: 'Promotion Effectiveness',
                    contact_email: 'sahana@themathcompany.com',
                    industry: 'Retail',
                    function: 'Pricing',
                    problem_area: 'Assortment',
                    problem: 'Promotion Effectiveness',
                    config_link: '/problem/Retail/Promotion%20Optimization',
                    blueprint_link: '/projects/3/design',
                    description:
                        'Assess effectiveness of in store promotion towards driving topline/ volume growth',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 48,
                    name: 'Route Optimization',
                    contact_email: 'ranjith@themathcompany.com',
                    industry: 'Retail',
                    function: 'Supply Chain',
                    problem_area: 'Logistics',
                    problem: 'Route Optimization',
                    config_link: false,
                    blueprint_link: false,
                    description:
                        'Optimize fleet route distances & fuel consumption to reduce leakage',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 38,
                    name: 'Store Clustering',
                    contact_email: 'ranjith@themathcompany.com',
                    industry: 'Retail',
                    function: 'Merchandising & Store Ops',
                    problem_area: 'In-store',
                    problem: 'Store Clustering',
                    config_link: false,
                    blueprint_link: false,
                    description: 'Cluster stores of similar profile to plan strategic actions',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 111,
                    name: 'Customer Support Planning',
                    contact_email: 'ranjith@themathcompany.com',
                    industry: 'Retail',
                    function: 'Customer & Digital Insights',
                    problem_area: false,
                    problem: 'Customer Support Planning',
                    config_link: false,
                    blueprint_link: false,
                    description:
                        'Workforce scheduling and optimization for effective cal center support',
                    app_link: true,
                    approach_url: false,
                    data_story_enabled: true
                }
            ]
        };

        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ApplicationDashboard {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render ApplicationDashboard Component', () => {
        const props = {
            match: { params: { industry: 'Retail' } },
            forRestrictedUser: true,
            apps: [
                {
                    id: 3,
                    name: 'Customer Loyalty Segmentation',
                    contact_email: 'shridhar@themathcompany.com',
                    industry: 'Retail',
                    function: 'Customer & Digital Insights',
                    problem_area: 'Customer Insights',
                    problem: 'Customer Loyalty Segmentation',
                    config_link: '/projects/4/case-studies/100/notebooks/235/app-configs/3/edit',
                    blueprint_link: '/projects/7/design',
                    description:
                        'Loyalty based segmentation & assessment of customer lifetime Value',
                    app_link: true,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 45,
                    name: 'GSNFR Optimization',
                    contact_email: 'ranjith@themathcompany.com',
                    industry: 'Retail',
                    function: 'Finance & Procurement',
                    problem_area: 'Finance',
                    problem: 'GSNFR Optimization',
                    config_link: false,
                    blueprint_link: false,
                    description: 'Track GSNFR cost, assess compliance & drive cost optimization',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 2,
                    name: 'Integrated Demand Forecasting',
                    contact_email: 'shridhar@themathcompany.com',
                    industry: 'Retail',
                    function: 'Supply Chain',
                    problem_area: 'Planning',
                    problem: 'Integrated Demand Forecasting',
                    config_link: '/projects/1/case-studies/10/notebooks/208/app-configs/2/edit',
                    blueprint_link: '/projects/2/design',
                    description:
                        'Forecast demand and plan supply chain operations to handle it effectively',
                    app_link: true,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 1,
                    name: 'Marketing & Media Planner',
                    contact_email: 'ashwin@themathcompany.com',
                    industry: 'Retail',
                    function: 'Marketing',
                    problem_area: 'Strategy',
                    problem: 'Market Mix Modeling',
                    config_link: '/projects/2/case-studies/91/notebooks/177/app-configs/8/edit',
                    blueprint_link: '/projects/1/design',
                    description: 'Optimize spend across channels / media vehicles to maximize RoI',
                    app_link: true,
                    approach_url: false,
                    data_story_enabled: true
                },
                {
                    id: 4,
                    name: 'Pricing Optimization',
                    contact_email: 'shridhar@themathcompany.com',
                    industry: 'Retail',
                    function: 'Pricing',
                    problem_area: 'Pricing',
                    problem: 'Pricing Optimization',
                    config_link: '/projects/4/case-studies/95/notebooks/122/app-configs/4/edit',
                    blueprint_link: '/projects/4/design',
                    description:
                        'Differential pricing strategy based on product market price sensitivity',
                    app_link: true,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 18,
                    name: 'Product Affinity Analyser',
                    contact_email: 'sahana@themathcompany.com',
                    industry: 'Retail',
                    function: 'Merchandising & Store Ops',
                    problem_area: 'Assortment',
                    problem: 'Product Affinity Analysis',
                    config_link: '/problem/Retail/Product%20affinity%20analysis',
                    blueprint_link: '/projects/32/design',
                    description:
                        'Co-Merchandise, Substitute , Reduce stock-out & optimize product placement',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 19,
                    name: 'Campaign Effectiveness',
                    contact_email: 'sahana@themathcompany.com',
                    industry: 'Retail',
                    function: 'Marketing',
                    problem_area: 'Advertising',
                    problem: 'Campaign Effectiveness',
                    config_link: false,
                    blueprint_link: false,
                    description:
                        'Test and learn tool to design. develop & measure campaign effectiveness',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 36,
                    name: 'Inventory Management',
                    contact_email: 'ranjith@themathcompany.com',
                    industry: 'Retail',
                    function: 'Supply Chain',
                    problem_area: 'Inventory',
                    problem: 'Inventory Management',
                    config_link: false,
                    blueprint_link: false,
                    description: 'Understand timing and volume of deliveries from store to DC',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 20,
                    name: 'Markdown Optimization',
                    contact_email: 'sahana@themathcompany.com',
                    industry: 'Retail',
                    function: 'Pricing',
                    problem_area: 'Pricing',
                    problem: 'Markdown Optimization',
                    config_link: '/problem/Retail/Dynamic%20Pricing',
                    blueprint_link: '/projects/36/design',
                    description: 'Dynamic pricing strategy based on promotion performance',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 47,
                    name: 'Personalization & Recommendation',
                    contact_email: 'ranjith@themathcompany.com',
                    industry: 'Retail',
                    function: 'Customer & Digital Insights',
                    problem_area: 'Personalization',
                    problem: 'Personalization & Recommendation',
                    config_link: false,
                    blueprint_link: false,
                    description: 'Custom offering, Next best action to drive customer engagement',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 22,
                    name: 'SKU Rationalization',
                    contact_email: 'sahana@themathcompany.com',
                    industry: 'Retail',
                    function: 'Merchandising & Store Ops',
                    problem_area: 'Assortment',
                    problem: 'Dynamic Pricing',
                    config_link: false,
                    blueprint_link: false,
                    description:
                        'Identify products to be discontinued & pricing strategy during clearance',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 46,
                    name: 'Supplier Risk Analytics',
                    contact_email: 'ranjith@themathcompany.com',
                    industry: 'Retail',
                    function: 'Finance & Procurement',
                    problem_area: 'Procurement',
                    problem: 'Supplier Risk Analytics',
                    config_link: '/projects/110/case-studies/111/notebooks/172/app-configs/11/edit',
                    blueprint_link: '/projects/46/design',
                    description:
                        'Monitor & analyze supplier performance, predict risk & plan lead time',
                    app_link: true,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 37,
                    name: 'Digital Channel Performance Analysis',
                    contact_email: 'ranjith@themathcompany.com',
                    industry: 'Retail',
                    function: 'Customer & Digital Insights',
                    problem_area: 'Advertising',
                    problem: 'Digital Channel Performance Analysis',
                    config_link: false,
                    blueprint_link: false,
                    description: 'Sales attribution & evaluation of channel performance',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 21,
                    name: 'Promotion Effectiveness',
                    contact_email: 'sahana@themathcompany.com',
                    industry: 'Retail',
                    function: 'Pricing',
                    problem_area: 'Assortment',
                    problem: 'Promotion Effectiveness',
                    config_link: '/problem/Retail/Promotion%20Optimization',
                    blueprint_link: '/projects/3/design',
                    description:
                        'Assess effectiveness of in store promotion towards driving topline/ volume growth',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 48,
                    name: 'Route Optimization',
                    contact_email: 'ranjith@themathcompany.com',
                    industry: 'Retail',
                    function: 'Supply Chain',
                    problem_area: 'Logistics',
                    problem: 'Route Optimization',
                    config_link: false,
                    blueprint_link: false,
                    description:
                        'Optimize fleet route distances & fuel consumption to reduce leakage',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 38,
                    name: 'Store Clustering',
                    contact_email: 'ranjith@themathcompany.com',
                    industry: 'Retail',
                    function: 'Merchandising & Store Ops',
                    problem_area: 'In-store',
                    problem: 'Store Clustering',
                    config_link: false,
                    blueprint_link: false,
                    description: 'Cluster stores of similar profile to plan strategic actions',
                    app_link: false,
                    approach_url: false,
                    data_story_enabled: false
                },
                {
                    id: 111,
                    name: 'Customer Support Planning',
                    contact_email: 'ranjith@themathcompany.com',
                    industry: 'Retail',
                    function: 'Customer & Digital Insights',
                    problem_area: false,
                    problem: 'Customer Support Planning',
                    config_link: false,
                    blueprint_link: false,
                    description:
                        'Workforce scheduling and optimization for effective cal center support',
                    app_link: true,
                    approach_url: false,
                    data_story_enabled: true
                }
            ]
        };

        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ApplicationDashboard {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
});
