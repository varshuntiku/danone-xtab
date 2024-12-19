import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import UserAppsList from '../../../components/userDashboard/UserAppsList';
import { Provider } from 'react-redux';
import store from 'store/store';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { vi } from 'vitest';
const history = createMemoryHistory();

describe('UserAppsList', () => {
    afterEach(cleanup);
    beforeEach(() => {
        const observe = vi.fn();

        window.IntersectionObserver = vi.fn(function () {
            this.observe = observe;
        });
    });

    test("Should render 'No apps available' when the apps array length is 0", () => {
        const props = {};
        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserAppsList {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('No apps available', { exact: false })).toBeInTheDocument();
    });

    test('Should render functions and application for selected industry and function ', () => {
        const props = {
            data: {
                apps: [
                    {
                        app_link: false,
                        approach_url: false,
                        blueprint_link: false,
                        config_link: false,
                        contact_email: 'ranjith@themathcompany.com',
                        data_story_enabled: false,
                        description:
                            'Forecast commodity price changes to enable procurement at optimal range',
                        function: 'Finance & Procurement',
                        id: 40,
                        industry: 'CPG',
                        name: 'Commodity Price Forecasting',
                        problem: 'Commodity Price Forecasting',
                        problem_area: 'Pricing'
                    },
                    {
                        app_link: true,
                        approach_url: false,
                        blueprint_link: '/projects/2/design',
                        config_link:
                            '/projects/2/case-studies/78/notebooks/101/app-configs/10/edit',
                        contact_email: 'ranjith@themathcompany.com',
                        data_story_enabled: false,
                        description: 'Forecast demand and potential growth opportunity',
                        function: 'Supply Chain',
                        id: 26,
                        industry: 'CPG',
                        name: 'Integrated Demand Forecasting',
                        problem: 'Integrated Demand Forecasting',
                        problem_area: 'Planning'
                    },
                    {
                        app_link: true,
                        approach_url: false,
                        blueprint_link: '/projects/1/design',
                        config_link: '/projects/1/case-studies/97/notebooks/131/app-configs/7/edit',
                        contact_email: 'Lalatendu.Sahu@themathcompany.com',
                        data_story_enabled: false,
                        description: 'Optimize spends across channels and regions to maximize ROI',
                        function: false,
                        id: 24,
                        industry: 'CPG',
                        name: 'Market Mix Optimization',
                        problem: 'Market Mix Modeling',
                        problem_area: 'Strategy'
                    },
                    {
                        app_link: true,
                        approach_url: `${
                            import.meta.env['REACT_APP_STATIC_DATA_ASSET']
                        }/codex-products-local/CPG - Marketing and Media Planning.pptx?se=2022-01-27T08%3A03%3A40Z&sp=r&sv=2018-03-28&sr=b&sig=0W%2BhX53V7oyZ49Rh/WHeGmoQu8yfFVx5uPw5RBpUIX0%3D`,
                        blueprint_link: '/projects/1/design',
                        config_link: '/projects/1/case-studies/92/notebooks/114/app-configs/8/edit',
                        contact_email: 'ashwin@themathcompany.com',
                        data_story_enabled: false,
                        description:
                            'Optimize spend across channels / media vehicles to maximize RoI',
                        function: 'Marketing',
                        id: 49,
                        industry: 'CPG',
                        name: 'Marketing & Media Planner',
                        problem: 'Marketing & Media Planner',
                        problem_area: 'Strategy'
                    },
                    {
                        app_link: false,
                        approach_url: false,
                        blueprint_link: false,
                        config_link: false,
                        contact_email: 'ranjith@themathcompany.com',
                        data_story_enabled: false,
                        description: 'Labour and capacity planning to optimize cost of operations',
                        function: 'Supply Chain',
                        id: 30,
                        industry: 'CPG',
                        name: 'Capacity Planning',
                        problem: 'Capacity Planning',
                        problem_area: 'Logistics'
                    }
                ],
                industries: [
                    {
                        horizon: 'vertical',
                        id: 1,
                        industry_name: 'Retail',
                        logo_name: 'Retail',
                        order: 1
                    },
                    {
                        horizon: 'vertical',
                        id: 2,
                        industry_name: 'Insurance',
                        logo_name: 'Insurance',
                        order: 2
                    },
                    {
                        horizon: 'vertical',
                        id: 3,
                        industry_name: 'CPG',
                        logo_name: 'CPG',
                        order: 3
                    }
                ],
                functions: [
                    {
                        description: 'Merchandising & Store Ops',
                        function_id: 3,
                        function_name: 'Merchandising & Store Ops',
                        industry_id: 1,
                        industry_name: 'Retail',
                        logo_name: 'RetailMerchandisingIcon',
                        order: 3
                    },
                    {
                        description: 'Pricing',
                        function_id: 4,
                        function_name: 'Pricing',
                        industry_id: 1,
                        industry_name: 'Retail',
                        logo_name: 'RetailPricingIcon',
                        order: 4
                    },
                    {
                        description: 'Marketing',
                        function_id: 5,
                        function_name: 'Marketing',
                        industry_id: 1,
                        industry_name: 'Retail',
                        logo_name: 'RetailMarketingIcon',
                        order: 5
                    },
                    {
                        description: 'Customer & Digital Insights',
                        function_id: 6,
                        function_name: 'Customer & Digital Insights',
                        industry_id: 1,
                        industry_name: 'Retail',
                        logo_name: 'RetailCustomerInsightsIcon',
                        order: 6
                    },
                    {
                        description: 'Underwriting & Pricing',
                        function_id: 7,
                        function_name: 'Underwriting & Pricing',
                        industry_id: 2,
                        industry_name: 'Insurance',
                        logo_name: 'InsuranceUnderwritingPricingIcon',
                        order: 1
                    },
                    {
                        description: 'Claims Management',
                        function_id: 8,
                        function_name: 'Claims Management',
                        industry_id: 2,
                        industry_name: 'Insurance',
                        logo_name: 'InsuranceClaimsIcon',
                        order: 2
                    },
                    {
                        description: 'Marketing & Customer Insights',
                        function_id: 9,
                        function_name: 'Marketing & Customer Insights',
                        industry_id: 2,
                        industry_name: 'Insurance',
                        logo_name: 'InsuranceMarketingCustomerIcon',
                        order: 3
                    },
                    {
                        description: 'Distribution',
                        function_id: 10,
                        function_name: 'Distribution',
                        industry_id: 2,
                        industry_name: 'Insurance',
                        logo_name: 'InsuranceDistributionIcon',
                        order: 4
                    },
                    {
                        description: 'Strategy & Planning',
                        function_id: 11,
                        function_name: 'Strategy & Planning',
                        industry_id: 3,
                        industry_name: 'CPG',
                        logo_name: 'CPGStrategyPlanningIcon',
                        order: 1
                    },
                    {
                        description: 'Finance & Procurement',
                        function_id: 12,
                        function_name: 'Finance & Procurement',
                        industry_id: 3,
                        industry_name: 'CPG',
                        logo_name: 'CPGFinanceProcurementIcon',
                        order: 2
                    },
                    {
                        description: 'Supply Chain',
                        function_id: 13,
                        function_name: 'Supply Chain',
                        industry_id: 3,
                        industry_name: 'CPG',
                        logo_name: 'CPGSupplyChainIcon',
                        order: 3
                    },
                    {
                        description: 'Marketing',
                        function_id: 14,
                        function_name: 'Marketing',
                        industry_id: 3,
                        industry_name: 'CPG',
                        logo_name: 'CPGMarketingIcon',
                        order: 4
                    }
                ]
            }
        };
        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserAppsList {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('CPG')).toBeInTheDocument();
        const industryCard = screen.getByText('CPG');
        fireEvent.click(industryCard);
        expect(screen.getByText('Supply Chain')).toBeInTheDocument();
        const functionCard = screen.getByText('Supply Chain');
        fireEvent.click(functionCard);
    });

    test('Should navigate according to selected breadcrumb', () => {
        const props = {
            data: {
                apps: [
                    {
                        app_link: false,
                        approach_url: false,
                        blueprint_link: false,
                        config_link: false,
                        contact_email: 'ranjith@themathcompany.com',
                        data_story_enabled: false,
                        description:
                            'Forecast commodity price changes to enable procurement at optimal range',
                        function: 'Finance & Procurement',
                        id: 40,
                        industry: 'CPG',
                        name: 'Commodity Price Forecasting',
                        problem: 'Commodity Price Forecasting',
                        problem_area: 'Pricing'
                    },
                    {
                        app_link: true,
                        approach_url: false,
                        blueprint_link: '/projects/2/design',
                        config_link:
                            '/projects/2/case-studies/78/notebooks/101/app-configs/10/edit',
                        contact_email: 'ranjith@themathcompany.com',
                        data_story_enabled: false,
                        description: 'Forecast demand and potential growth opportunity',
                        function: 'Supply Chain',
                        id: 26,
                        industry: 'CPG',
                        name: 'Integrated Demand Forecasting',
                        problem: 'Integrated Demand Forecasting',
                        problem_area: 'Planning'
                    },
                    {
                        app_link: true,
                        approach_url: false,
                        blueprint_link: '/projects/1/design',
                        config_link: '/projects/1/case-studies/97/notebooks/131/app-configs/7/edit',
                        contact_email: 'Lalatendu.Sahu@themathcompany.com',
                        data_story_enabled: false,
                        description: 'Optimize spends across channels and regions to maximize ROI',
                        function: false,
                        id: 24,
                        industry: 'CPG',
                        name: 'Market Mix Optimization',
                        problem: 'Market Mix Modeling',
                        problem_area: 'Strategy'
                    },
                    {
                        app_link: true,
                        approach_url: `${
                            import.meta.env['REACT_APP_STATIC_DATA_ASSET']
                        }/codex-products-local/CPG - Marketing and Media Planning.pptx?se=2022-01-27T08%3A03%3A40Z&sp=r&sv=2018-03-28&sr=b&sig=0W%2BhX53V7oyZ49Rh/WHeGmoQu8yfFVx5uPw5RBpUIX0%3D`,
                        blueprint_link: '/projects/1/design',
                        config_link: '/projects/1/case-studies/92/notebooks/114/app-configs/8/edit',
                        contact_email: 'ashwin@themathcompany.com',
                        data_story_enabled: false,
                        description:
                            'Optimize spend across channels / media vehicles to maximize RoI',
                        function: 'Marketing',
                        id: 49,
                        industry: 'CPG',
                        name: 'Marketing & Media Planner',
                        problem: 'Marketing & Media Planner',
                        problem_area: 'Strategy'
                    },
                    {
                        app_link: false,
                        approach_url: false,
                        blueprint_link: false,
                        config_link: false,
                        contact_email: 'ranjith@themathcompany.com',
                        data_story_enabled: false,
                        description: 'Labour and capacity planning to optimize cost of operations',
                        function: 'Supply Chain',
                        id: 30,
                        industry: 'CPG',
                        name: 'Capacity Planning',
                        problem: 'Capacity Planning',
                        problem_area: 'Logistics'
                    }
                ],
                industries: [
                    {
                        horizon: 'vertical',
                        id: 1,
                        industry_name: 'Retail',
                        logo_name: 'Retail',
                        order: 1
                    },
                    {
                        horizon: 'vertical',
                        id: 2,
                        industry_name: 'Insurance',
                        logo_name: 'Insurance',
                        order: 2
                    },
                    {
                        horizon: 'vertical',
                        id: 3,
                        industry_name: 'CPG',
                        logo_name: 'CPG',
                        order: 3
                    }
                ],
                functions: [
                    {
                        description: 'Merchandising & Store Ops',
                        function_id: 3,
                        function_name: 'Merchandising & Store Ops',
                        industry_id: 1,
                        industry_name: 'Retail',
                        logo_name: 'RetailMerchandisingIcon',
                        order: 3
                    },
                    {
                        description: 'Pricing',
                        function_id: 4,
                        function_name: 'Pricing',
                        industry_id: 1,
                        industry_name: 'Retail',
                        logo_name: 'RetailPricingIcon',
                        order: 4
                    },
                    {
                        description: 'Marketing',
                        function_id: 5,
                        function_name: 'Marketing',
                        industry_id: 1,
                        industry_name: 'Retail',
                        logo_name: 'RetailMarketingIcon',
                        order: 5
                    },
                    {
                        description: 'Customer & Digital Insights',
                        function_id: 6,
                        function_name: 'Customer & Digital Insights',
                        industry_id: 1,
                        industry_name: 'Retail',
                        logo_name: 'RetailCustomerInsightsIcon',
                        order: 6
                    },
                    {
                        description: 'Underwriting & Pricing',
                        function_id: 7,
                        function_name: 'Underwriting & Pricing',
                        industry_id: 2,
                        industry_name: 'Insurance',
                        logo_name: 'InsuranceUnderwritingPricingIcon',
                        order: 1
                    },
                    {
                        description: 'Claims Management',
                        function_id: 8,
                        function_name: 'Claims Management',
                        industry_id: 2,
                        industry_name: 'Insurance',
                        logo_name: 'InsuranceClaimsIcon',
                        order: 2
                    },
                    {
                        description: 'Marketing & Customer Insights',
                        function_id: 9,
                        function_name: 'Marketing & Customer Insights',
                        industry_id: 2,
                        industry_name: 'Insurance',
                        logo_name: 'InsuranceMarketingCustomerIcon',
                        order: 3
                    },
                    {
                        description: 'Distribution',
                        function_id: 10,
                        function_name: 'Distribution',
                        industry_id: 2,
                        industry_name: 'Insurance',
                        logo_name: 'InsuranceDistributionIcon',
                        order: 4
                    },
                    {
                        description: 'Strategy & Planning',
                        function_id: 11,
                        function_name: 'Strategy & Planning',
                        industry_id: 3,
                        industry_name: 'CPG',
                        logo_name: 'CPGStrategyPlanningIcon',
                        order: 1
                    },
                    {
                        description: 'Finance & Procurement',
                        function_id: 12,
                        function_name: 'Finance & Procurement',
                        industry_id: 3,
                        industry_name: 'CPG',
                        logo_name: 'CPGFinanceProcurementIcon',
                        order: 2
                    },
                    {
                        description: 'Supply Chain',
                        function_id: 13,
                        function_name: 'Supply Chain',
                        industry_id: 3,
                        industry_name: 'CPG',
                        logo_name: 'CPGSupplyChainIcon',
                        order: 3
                    },
                    {
                        description: 'Marketing',
                        function_id: 14,
                        function_name: 'Marketing',
                        industry_id: 3,
                        industry_name: 'CPG',
                        logo_name: 'CPGMarketingIcon',
                        order: 4
                    }
                ]
            }
        };
        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserAppsList {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('CPG')).toBeInTheDocument();
        const industryCard = screen.getByText('CPG');
        fireEvent.click(industryCard);
        expect(screen.getByLabelText('home')).toBeInTheDocument();
        const homeBtn = screen.getByLabelText('home');
        fireEvent.click(homeBtn);
    });
});
