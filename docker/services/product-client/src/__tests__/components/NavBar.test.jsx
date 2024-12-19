import React from 'react';
import { render, screen, cleanup, fireEvent, queryByText } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import NavBar from '../../components/NavBar';
import { Provider } from 'react-redux';
import store from 'store/store';
import { UserInfoContext } from 'context/userInfoContent';

const history = createMemoryHistory();

const nac_context = {
    nac_roles: [
        {
            name: 'app-admin',
            id: 2,
            permissions: [
                {
                    name: 'CREATE_PREVIEW_APP',
                    id: 2
                }
            ]
        }
    ]
};

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render Navbar Component', () => {
        //const props = { "parent_obj": { "props": "Object", "context": "Object", "refs": "Object", "updater": "Object", "onResponseGetScreen": "fn()", "getLabels": "fn()", "getGraphs": "fn()", "getWidgetData": "fn()", "onApplySimulator": "fn()", "onSimulatorApplyDrilldown": "fn()", "state": "Object", "_reactInternalFiber": "Object", "_reactInternalInstance": "Object", "isReactComponent": "Object", "setState": "fn()", "forceUpdate": "fn()" }, "app_id": "269", "screen_id": 6781, "title": "INVENTORY REVIEW", "details": { "id": 18115, "widget_index": 0, "widget_key": "Inventory Review", "is_label": false, "config": "Object" }, "selected_filters": { "Region": { "options": ["All"], "checked": "All", "label": "Region" }, "Category": { "options": ["Air Conditioner", "Mobiles", "Refrigerator", "Tablets", "Washing Machines"], "checked": "Air Conditioner", "label": "Category" }, "Year": { "options": ["2018", "2019", "2020", "2021"], "checked": "2018", "label": "Year" }, "Month": { "options": ["Q1", "Q2"], "checked": "Q1", "label": "Month" }, "Product": { "options": ["Product 1"], "checked": "Product 1", "label": "Product" } }, "simulator_apply": false, "graph_height": "full", "screen_filter_settings": false, "data": { "data": { "widget_value_id": 1124755, "value": { "flow_table": { "name": "Total Inventory Management Cost", "sub_title": "£2m [12% YoY]", "sub_title_direction": "up", "data": [{ "name": "RDCs", "incoming_text": "Forecast Demand: 20k Units", "table_headers": ["Regional Distribution Centres", "On Hand Inventory", "Estimated Demand"], "table_data": [{ "cols": ["RDC 1", "14k Units", "5k Units"], "rowspan": 4 }, { "cols": ["RDC 2", "10k Units", "7k Units"], "rowspan": 2 }] }, { "name": "DCs", "incoming_text": "Forecast Demand: 6k Units", "table_headers": ["Distribution Centres", "On Hand Inventory", "Estimated Demand"], "table_data": ["Object", "Object", "Object"] }, "Object"] } }, "simulated_value": false } } }
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NavBar {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render Navbar1 Component', () => {
        const props = {
            ...Props,
            apps: [
                {
                    app_link: true,
                    approach_url: false,
                    blueprint_link: 'false',
                    config_link: 'false',
                    contact_email: '',
                    data_story_enabled: false,
                    description: 'false',
                    function: 'Finance & Procurement',
                    id: 293,
                    industry: 'CPG',
                    name: '',
                    problem: false,
                    problem_area: false
                },
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
                }
            ],
            history: history
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NavBar {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const profileBtn = screen.getByLabelText('profile');
        expect(profileBtn).toBeInTheDocument();
        fireEvent.mouseEnter(profileBtn);
        const logoutBtn = screen.getByLabelText('logout');
        expect(logoutBtn).toBeInTheDocument();
        fireEvent.click(logoutBtn);
    });
    test('Should render Navbar2 Component', () => {
        const props = {
            ...Props,
            apps: [
                {
                    app_link: true,
                    approach_url: false,
                    blueprint_link: 'false',
                    config_link: 'false',
                    contact_email: '',
                    data_story_enabled: false,
                    description: 'false',
                    function: 'Finance & Procurement',
                    id: 293,
                    industry: 'CPG',
                    name: '',
                    problem: false,
                    problem_area: false
                },
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
                }
            ],
            match: {
                params: {}
            },
            history: history
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NavBar {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const profileBtn = screen.getByLabelText('profile');
        expect(profileBtn).toBeInTheDocument();
        fireEvent.mouseEnter(profileBtn);
        const logoutBtn = screen.getByLabelText('logout');
        expect(logoutBtn).toBeInTheDocument();
        fireEvent.click(logoutBtn);
    });
    test('Should render Navbar3 Component', () => {
        const props = {
            ...Props,
            apps: [
                {
                    app_link: true,
                    approach_url: false,
                    blueprint_link: 'false',
                    config_link: 'false',
                    contact_email: '',
                    data_story_enabled: false,
                    description: 'false',
                    function: 'Finance & Procurement',
                    id: 293,
                    industry: 'CPG',
                    name: 'Forecasting 1',
                    problem: false,
                    problem_area: false
                },
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
                    problem: 'Commodity Price Forecasting',
                    problem_area: 'Pricing'
                }
            ],
            location: { pathname: '/dashboard/CPG', search: '', hash: '', key: 'p309ya' }
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NavBar {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        // const searchBox = screen.getByPlaceholderText('Search by function name');
        // expect(searchBox).toBeInTheDocument();
        // fireEvent.change(searchBox, { target: { value: 'F' } });
        // fireEvent.mouseDown(document);
        // fireEvent.change(searchBox, { target: { value: 'application' } });
        // fireEvent.mouseDown(document);
        // fireEvent.change(searchBox, { target: { value: 'Forecast' } });
        // const closeIcon = screen.getByLabelText('close');
        // expect(closeIcon).toBeInTheDocument();
        // fireEvent.click(closeIcon);
    });

    test('Should render Navbar5 Component', async () => {
        const props = {
            ...Props,
            apps: [
                {
                    app_link: true,
                    approach_url: false,
                    blueprint_link: 'false',
                    config_link: 'false',
                    contact_email: '',
                    data_story_enabled: false,
                    description: 'false',
                    function: 'Finance & Procurement',
                    id: 293,
                    industry: 'CPG',
                    name: 'Forecasting 1',
                    problem: false,
                    problem_area: false
                },
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
                    problem: 'Commodity Price Forecasting',
                    problem_area: 'Pricing'
                },
                {
                    app_link: true,
                    approach_url: false,
                    blueprint_link: '/projects/2/design',
                    config_link: '/projects/2/case-studies/78/notebooks/101/app-configs/10/edit',
                    contact_email: 'ranjith@themathcompany.com',
                    data_story_enabled: false,
                    description: 'Forecast demand and potential growth opportunity',
                    function: 'Supply Chain',
                    id: 26,
                    industry: 'CPG',
                    name: 'Integrated Demand Forecasting',
                    problem: 'Integrated Demand Forecasting',
                    problem_area: 'Planning'
                }
            ],
            location: { pathname: '/dashboard/CPG', search: '', hash: '', key: 'p309ya' },
            history: history
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NavBar {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const profileIcon = screen.getByLabelText('profile');
        expect(profileIcon).toBeInTheDocument();
        fireEvent.mouseEnter(profileIcon);
        fireEvent.click(screen.getByRole('presentation').firstChild);
        fireEvent.click(profileIcon);
        const menuItem = screen.getByText('Platform Utils');
        fireEvent.click(menuItem);
    });
    test('Should render Navbar6 Component', () => {
        const props = {
            ...Props,
            apps: [
                {
                    app_link: true,
                    approach_url: false,
                    blueprint_link: 'false',
                    config_link: 'false',
                    contact_email: '',
                    data_story_enabled: false,
                    description: 'false',
                    function: 'Finance & Procurement',
                    id: 293,
                    industry: 'CPG',
                    name: 'Forecasting 1',
                    problem: false,
                    problem_area: false
                },
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
                    problem: 'Commodity Price Forecasting',
                    problem_area: 'Pricing'
                },
                {
                    app_link: true,
                    approach_url: false,
                    blueprint_link: '/projects/2/design',
                    config_link: '/projects/2/case-studies/78/notebooks/101/app-configs/10/edit',
                    contact_email: 'ranjith@themathcompany.com',
                    data_story_enabled: false,
                    description: 'Forecast demand and potential growth opportunity',
                    function: 'Supply Chain',
                    id: 26,
                    industry: 'CPG',
                    name: 'Integrated Demand Forecasting',
                    problem: 'Integrated Demand Forecasting',
                    problem_area: 'Planning'
                }
            ],
            location: { pathname: '/dashboard/CPG', search: '', hash: '', key: 'p309ya' },
            history: history
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserInfoContext.Provider value={nac_context}>
                            <NavBar {...props} />
                        </UserInfoContext.Provider>
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const addApp = screen.queryByRole('button', { name: 'Add Application' });
        expect(addApp).not.toBeInTheDocument();
        // expect(screen.getByRole('button', { name: 'Add'})).toBeInTheDocument()
        // expect(screen.getByRole('button', { name: 'Cancel'})).toBeInTheDocument()
        // fireEvent.click(screen.getByRole('button', { name: 'Add'}))
    });
    test('Should render Navbar7 Component', () => {
        const props = {
            ...Props,
            apps: [
                {
                    app_link: true,
                    approach_url: false,
                    blueprint_link: 'false',
                    config_link: 'false',
                    contact_email: '',
                    data_story_enabled: false,
                    description: 'false',
                    function: 'Finance & Procurement',
                    id: 293,
                    industry: 'CPG',
                    name: 'Forecasting 1',
                    problem: false,
                    problem_area: false
                },
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
                    problem: 'Commodity Price Forecasting',
                    problem_area: 'Pricing'
                },
                {
                    app_link: true,
                    approach_url: false,
                    blueprint_link: '/projects/2/design',
                    config_link: '/projects/2/case-studies/78/notebooks/101/app-configs/10/edit',
                    contact_email: 'ranjith@themathcompany.com',
                    data_story_enabled: false,
                    description: 'Forecast demand and potential growth opportunity',
                    function: 'Supply Chain',
                    id: 26,
                    industry: 'CPG',
                    name: 'Integrated Demand Forecasting',
                    problem: 'Integrated Demand Forecasting',
                    problem_area: 'Planning'
                }
            ],
            location: { pathname: '/dashboard/CPG', search: '', hash: '', key: 'p309ya' },
            history: history
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NavBar {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const reportsBtn = screen.getByLabelText('reports');
        expect(reportsBtn).toBeInTheDocument();
        fireEvent.click(reportsBtn);
    });
    test('Should render Navbar8 Component', () => {
        const props = {
            ...Props,
            apps: [
                {
                    app_link: true,
                    approach_url: false,
                    blueprint_link: 'false',
                    config_link: 'false',
                    contact_email: '',
                    data_story_enabled: false,
                    description: 'false',
                    function: 'Finance & Procurement',
                    id: 293,
                    industry: 'CPG',
                    name: 'Forecasting 1',
                    problem: false,
                    problem_area: false
                },
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
                    problem: 'Commodity Price Forecasting',
                    problem_area: 'Pricing'
                },
                {
                    app_link: true,
                    approach_url: false,
                    blueprint_link: '/projects/2/design',
                    config_link: '/projects/2/case-studies/78/notebooks/101/app-configs/10/edit',
                    contact_email: 'ranjith@themathcompany.com',
                    data_story_enabled: false,
                    description: 'Forecast demand and potential growth opportunity',
                    function: 'Supply Chain',
                    id: 26,
                    industry: 'CPG',
                    name: 'Integrated Demand Forecasting',
                    problem: 'Integrated Demand Forecasting',
                    problem_area: 'Planning'
                }
            ],
            location: { pathname: '/dashboard/CPG', search: '', hash: '', key: 'p309ya' },
            match: {
                params: {
                    app_id: 26
                }
            },
            history: history
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NavBar {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const profileBtn = screen.getByLabelText('profile');
        expect(profileBtn).toBeInTheDocument();
        fireEvent.mouseEnter(profileBtn);
        const logoutBtn = screen.getByLabelText('logout');
        expect(logoutBtn).toBeInTheDocument();
        fireEvent.click(logoutBtn);
    });
    test('Should render NavBar with a specific pathname', () => {
        const props = {
            ...Props,
            apps: [],
            location: { pathname: '/dashboard/Finance', search: '', hash: '', key: 'abc123' },
            history: history
        };
        const { getByText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NavBar {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.queryByText('Finance Dashboard'));
    });
    test('Should open and close the profile dropdown menu on hover and click', () => {
        const props = {
            ...Props,
            apps: [],
            history: history
        };
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NavBar {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const profileBtn = screen.getByLabelText('profile');
        expect(profileBtn).toBeInTheDocument();

        fireEvent.mouseEnter(profileBtn);
        expect(screen.queryByText('Profile'));

        fireEvent.click(profileBtn);
        expect(screen.queryByText('Logout'));

        fireEvent.click(screen.queryByText('Logout'));
        expect(screen.queryByText('Login'));
    });
    test('Should render specific elements based on conditional logic', () => {
        const props = {
            ...Props,
            Condition: true,
            history: history
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NavBar {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.queryByText('Conditional Element Text'));
    });
    test('Should handle edge cases based on certain conditions', () => {
        const props = {
            ...Props,
            Condition: true,
            history: history
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NavBar {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.queryByText('Edge Case Element Text'));
    });
    test('Should handle specific user interaction triggering the method', () => {
        const props = {
            ...Props,
            history: history
        };

        const { getByText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NavBar {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.queryByText('Result of Interaction'));
        expect(screen.queryByText('Interactable Element Text'));
    });
    test('Should handle final edge case or rendering condition', () => {
        const props = {
            ...Props,
            finalCondition: true,
            history: history
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NavBar {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.queryByText('Final Condition Element Text'));
    });
});

const Props = {
    apps: false,
    user_permissions: {
        admin: true,
        all_projects: true,
        app: true,
        case_studies: false,
        environments: false,
        my_projects: true,
        my_projects_only: false,
        rbac: true,
        widget_factory: true,
        app_publish: true
    },
    match: {
        // isExact: true,
        params: {
            industry: 'CPG',
            function: 'Supply Chain'
        }
        // path: "/dashboard/:industry",
        // url: "/dashboard/CPG",
    },
    location: { pathname: '/dashboard/CPG/Supply Chain', search: '', hash: '', key: 'p309ya' }
};
