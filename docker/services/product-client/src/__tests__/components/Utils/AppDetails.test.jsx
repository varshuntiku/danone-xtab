import React from 'react';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import AppDetails from '../../../components/Utils/AppDetails.jsx';
import { editAppdetails } from '../../../services/app.js';
import { getFunctionsList } from '../../../services/dashboard.js';
import { getIndustriesList } from '../../../services/dashboard.js';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';

vi.mock('../../../services/dashboard', () => ({
    getFunctionsList: vi.fn(),
    getIndustriesList: vi.fn()
}));
vi.mock('../../../services/app', () => ({
    editAppdetails: vi.fn()
}));

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts AppDetails Component', () => {
        getFunctionsList.mockImplementation(({ callback }) =>
            callback([
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
                }
            ])
        );
        getIndustriesList.mockImplementation(({ callback }) =>
            callback([
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
                }
            ])
        );
        editAppdetails.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppDetails {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByLabelText('Application Name')).toBeInTheDocument();
        const appName = screen.getByLabelText('Application Name');
        fireEvent.change(appName, { target: { value: 'test app' } });

        // const industryName = screen.getByTestId('industry')
        // const {getByDisplayValue} = within(industryName)
        // const industry = getByDisplayValue('Insurance')
        // fireEvent.change(industry, {target: {value: 'cpg'}})

        expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
        const saveBtn = screen.getByRole('button', { name: 'Save changes' });
        fireEvent.click(saveBtn);
    });

    test('Should render layouts AppDetails Component', async () => {
        getFunctionsList.mockImplementation(({ callback }) =>
            callback([
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
                    description: 'Merchandising & Store Ops',
                    function_id: 3,
                    function_name: 'Merchandising & Store Ops',
                    industry_id: 1,
                    industry_name: 'Retail',
                    logo_name: 'RetailMerchandisingIcon',
                    order: 3
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
                    description: 'Sourcing',
                    function_id: 18,
                    function_name: 'Sourcing',
                    industry_id: 4,
                    industry_name: 'Manufacturing',
                    logo_name: 'AutomotiveProcurementIcon',
                    order: 1
                },
                {}
            ])
        );
        getIndustriesList.mockImplementation(({ callback }) =>
            callback([
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
                }
            ])
        );
        editAppdetails.mockImplementation(() => {
            throw Error;
        });
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppDetails {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByLabelText('Application Name')).toBeInTheDocument();
        const appName = screen.getByLabelText('Application Name');
        fireEvent.change(appName, { target: { value: 'test app' } });

        //expect(screen.getByText('Function')).toBeInTheDocument()

        // const industryName = screen.getByTestId('industry')
        // const {getByDisplayValue} = within(industryName)
        // const industry = getByDisplayValue('Insurance')
        // fireEvent.change(industry, {target: {value: 'cpg'}})

        expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
        const saveBtn = screen.getByRole('button', { name: 'Save changes' });
        fireEvent.click(saveBtn);
    });
});

const Props = {
    classes: {},
    location: {
        state: {
            app_info: {
                blueprint_link: '/projects/7/design',
                config_link: '/problem/Retail/Customer%20Segmentation',
                description: 'Identification of customers "at-risk" to plan retention efforts',
                function: 'Marketing & Customer Insights',
                id: 10,
                industry: 'Insurance',
                logo_url: false,
                name: '"At-risk" Customer Prediction',
                small_logo_url: false
            }
        }
    }
};
