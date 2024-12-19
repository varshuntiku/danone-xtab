import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import Applications from '../../../components/Utils/Applications.jsx';
import { getAllApps, getIndustriesList, getFunctionsList } from '../../../services/dashboard.js';
import { Provider } from 'react-redux';
import store from 'store/store';
import { UserInfoContext } from 'context/userInfoContent';
import { vi } from 'vitest';

vi.mock('../../../services/dashboard', () => ({
    getAllApps: vi.fn(),
    getIndustriesList: vi.fn(),
    getFunctionsList: vi.fn()
}));

vi.mock('../../../components/Utils/ManageApplications', () => {
    return {
        default: (props) => (
            <>
                Mock Manage Applications Component
                {/* <button aria-label='refresh' onClick={props.refreshFunctionsList()}>Refresh Function</button> */}
            </>
        )
    };
});

const history = createMemoryHistory();

const nac_context = {
    nac_roles: [
        {
            name: 'app-admin',
            id: 2,
            permissions: [
                {
                    name: 'CLONING_OF_APPLICATION',
                    id: 2
                }
            ]
        }
    ]
};

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts Applications Component', () => {
        getAllApps.mockImplementation(({ callback }) =>
            callback({
                data: [
                    {
                        blueprint_link: '/projects/7/design',
                        config_link: '/problem/Retail/Customer%20Segmentation',
                        description:
                            'Identification of customers "at-risk" to plan retention efforts',
                        function: 'Marketing & Customer Insights',
                        id: 10,
                        industry: 'Insurance',
                        logo_url: false,
                        name: '"At-risk" Customer Prediction',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    },
                    {
                        blueprint_link: false,
                        config_link: false,
                        description: false,
                        function: false,
                        id: 161,
                        industry: false,
                        logo_url: false,
                        name: 'ARIMA Documentation',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    },
                    {
                        blueprint_link: false,
                        config_link: false,
                        description:
                            'Monitoring and segmenting key accounts - prescriptions, effectiveness etc.',
                        function: 'Distribution',
                        id: 126,
                        industry: 'Pharma',
                        logo_url: false,
                        name: 'Account Management',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    },
                    {
                        blueprint_link: false,
                        config_link: false,
                        description: false,
                        function: false,
                        id: 203,
                        industry: false,
                        logo_url: false,
                        name: 'Aegon',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    },
                    {
                        blueprint_link: false,
                        config_link: false,
                        description: 'After sales support to enhance CSAT and NPS',
                        function: 'Consumption Layer',
                        id: 305,
                        industry: 'Customer Analytics',
                        logo_url: false,
                        name: 'After Sales Customer Support',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    },
                    {
                        blueprint_link: false,
                        config_link: false,
                        description: 'Holistic channel & broker performance management',
                        function: 'Distribution',
                        id: 15,
                        industry: 'Insurance',
                        logo_url: false,
                        name: 'Agency Performance Suite',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    },
                    {
                        blueprint_link: false,
                        config_link: false,
                        description: false,
                        function: false,
                        id: 170,
                        industry: false,
                        logo_url: false,
                        name: 'Animated ',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    },
                    {
                        blueprint_link: false,
                        config_link: false,
                        description: false,
                        function: false,
                        id: 276,
                        industry: false,
                        logo_url: false,
                        name: 'Ashish Sharma',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    },
                    {
                        blueprint_link: false,
                        config_link: false,
                        description: 'Predictive maintenance enabled by analytics on IoT data',
                        function: 'Manufacturing & Engineering',
                        id: 56,
                        industry: 'Automotive',
                        logo_url: false,
                        name: 'Assembly Line Fault Predictor',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    },
                    {
                        blueprint_link: false,
                        config_link: false,
                        description: 'Predictive maintenance enabled by analytics on IoT data',
                        function: 'Manufacturing & Engineering',
                        id: 97,
                        industry: 'Manufacturing',
                        logo_url: false,
                        name: 'Assembly Line Fault Predictor',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    },
                    {
                        blueprint_link: false,
                        config_link:
                            '/projects/127/case-studies/128/notebooks/190/app-configs/16/edit',
                        description:
                            'Improve shopper metrics, rationalize SKUs & drive topline growth',
                        function: 'Revenue Management',
                        id: 35,
                        industry: 'CPG',
                        logo_url: false,
                        name: 'Assortment & Distribution Optimization',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    }
                ],
                count: 11
            })
        );
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserInfoContext.Provider value={nac_context}>
                            <Applications {...Props} />
                        </UserInfoContext.Provider>
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByLabelText('Next page')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('Next page'));
        fireEvent.click(screen.getByLabelText('Previous page'));
    });
    // test('Should render layouts Applications Component', () => {
    //     getAllApps.mockImplementation(({callback})=>callback(
    //         [
    //             {
    //                 blueprint_link: "/projects/7/design",
    //                 config_link: "/problem/Retail/Customer%20Segmentation",
    //                 description: "Identification of customers \"at-risk\" to plan retention efforts",
    //                 function: "Marketing & Customer Insights",
    //                 id: 10,
    //                 industry: "Insurance",
    //                 logo_url: false,
    //                 name: "\"At-risk\" Customer Prediction",
    //                 small_logo_url: false
    //             }
    //         ]
    //     ))
    //     const { getByText, debug } = render(
    //         <CustomThemeContextProvider>
    //             <Router history={history}>
    //                 <Applications {...Props} />
    //             </Router>
    //         </CustomThemeContextProvider>
    //     )

    //     fireEvent.click(screen.getByLabelText('edit'))
    // });

    test('Should render layouts Applications Component 1', () => {
        getAllApps.mockImplementation(({ callback }) =>
            callback({
                data: [
                    {
                        blueprint_link: '/projects/7/design',
                        config_link: '/problem/Retail/Customer%20Segmentation',
                        description:
                            'Identification of customers "at-risk" to plan retention efforts',
                        function: 'Marketing & Customer Insights',
                        id: 10,
                        industry: 'Insurance',
                        logo_url: false,
                        name: '"At-risk" Customer Prediction',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    },
                    {
                        blueprint_link: false,
                        config_link: false,
                        description: false,
                        function: false,
                        id: 161,
                        industry: false,
                        logo_url: false,
                        name: 'ARIMA Documentation',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    },
                    {
                        blueprint_link: false,
                        config_link: false,
                        description:
                            'Monitoring and segmenting key accounts - prescriptions, effectiveness etc.',
                        function: 'Distribution',
                        id: 126,
                        industry: 'Pharma',
                        logo_url: false,
                        name: 'Account Management',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    },
                    {
                        blueprint_link: false,
                        config_link: false,
                        description: false,
                        function: false,
                        id: 203,
                        industry: false,
                        logo_url: false,
                        name: 'Aegon',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    },
                    {
                        blueprint_link: false,
                        config_link: false,
                        description: 'After sales support to enhance CSAT and NPS',
                        function: 'Consumption Layer',
                        id: 305,
                        industry: 'Customer Analytics',
                        logo_url: false,
                        name: 'After Sales Customer Support',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    },
                    {
                        blueprint_link: false,
                        config_link: false,
                        description: 'Holistic channel & broker performance management',
                        function: 'Distribution',
                        id: 15,
                        industry: 'Insurance',
                        logo_url: false,
                        name: 'Agency Performance Suite',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    },
                    {
                        blueprint_link: false,
                        config_link: false,
                        description: false,
                        function: false,
                        id: 170,
                        industry: false,
                        logo_url: false,
                        name: 'Animated ',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    },
                    {
                        blueprint_link: false,
                        config_link: false,
                        description: false,
                        function: false,
                        id: 276,
                        industry: false,
                        logo_url: false,
                        name: 'Ashish Sharma',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    },
                    {
                        blueprint_link: false,
                        config_link: false,
                        description: 'Predictive maintenance enabled by analytics on IoT data',
                        function: 'Manufacturing & Engineering',
                        id: 56,
                        industry: 'Automotive',
                        logo_url: false,
                        name: 'Assembly Line Fault Predictor',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    },
                    {
                        blueprint_link: false,
                        config_link: false,
                        description: 'Predictive maintenance enabled by analytics on IoT data',
                        function: 'Manufacturing & Engineering',
                        id: 97,
                        industry: 'Manufacturing',
                        logo_url: false,
                        name: 'Assembly Line Fault Predictor',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    },
                    {
                        blueprint_link: false,
                        config_link:
                            '/projects/127/case-studies/128/notebooks/190/app-configs/16/edit',
                        description:
                            'Improve shopper metrics, rationalize SKUs & drive topline growth',
                        function: 'Revenue Management',
                        id: 35,
                        industry: 'CPG',
                        logo_url: false,
                        name: 'Assortment & Distribution Optimization',
                        small_logo_url: false,
                        environment: 'preview',
                        industry_id: 1
                    }
                ],
                count: 11
            })
        );
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserInfoContext.Provider value={nac_context}>
                            <Applications {...Props} />
                        </UserInfoContext.Provider>
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getAllByRole('textbox')[0]).toBeInTheDocument();
        const search = screen.getAllByRole('textbox')[0];
        fireEvent.change(search, { target: { value: 'customer' } });
    });
});

const Props = {
    classes: {}
};
