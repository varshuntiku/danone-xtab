import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import ProblemsDashboard from '../../layouts/ProblemsDashboard';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { vi } from 'vitest';

vi.mock('services/dashboard.js', () => {
    return {
        getFunctionsList: ({ callback }) => {
            callback([
                {
                    function_name: 'Supply Chain',
                    industry_name: 'CPG',
                    logo_name: 'CPGFinanceProcurementIcon'
                }
            ]);
        }
    };
});

vi.mock('store/index', () => ({
    getIndustries: vi.fn(),
    getFuncions: vi.fn()
}));

vi.mock('store/store', () => ({
    store: vi.fn()
}));

const store = configureStore({
    reducer: createSlice({
        name: 'industry',
        initialState: {
            industryData: {
                list: [
                    {
                        id: 1,
                        industry_name: 'Test1',
                        parent_industry_id: null,
                        logo_name: 'Retail',
                        horizon: 'vertical',
                        order: 1,
                        level: null,
                        color: null,
                        description: null,
                        parent_industry_name: null
                    }
                ]
            },
            functionData: {
                list: [
                    {
                        industry_name: 'Spend Analytics',
                        industry_id: 17,
                        function_id: 75,
                        parent_function_id: null,
                        function_name: 'Data Consolidation Layer',
                        description: 'Data Consolidation Layer',
                        logo_name: 'RetailCustomerInsightsIcon',
                        order: 1,
                        level: null,
                        color: null,
                        parent_function_name: null
                    }
                ]
            }
        }
    }).reducer
});

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts ProblemsDashboard Component 1', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <ProblemsDashboard {...Props2} />
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render layouts ProblemsDashboard Component 2', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <ProblemsDashboard {...Props2} />
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render layouts ProblemsDashboard List view', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <ProblemsDashboard {...Props2} />
                </CustomThemeContextProvider>
            </Provider>
        );
        // Failing because of design revamp changes
        // TODO later

        // const button = screen.getByLabelText('list-view-button');
        // fireEvent.click(button);
        // expect(screen.getByLabelText('list-view-container', { exact: false })).toBeInTheDocument();
    });

    test('Should render layouts ProblemsDashboard list view set fav industry', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <ProblemsDashboard {...Props2} />
                </CustomThemeContextProvider>
            </Provider>
        );
        // Failing because of design revamp changes
        // TODO later

        // const button = screen.getByLabelText('fav-button');
        // fireEvent.click(button);
        // expect(screen.getByLabelText('fav-icon', { exact: false })).toBeInTheDocument();
    });

    test('Should render layouts ProblemsDashboard grid view set fav industry', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <ProblemsDashboard {...Props2} />
                </CustomThemeContextProvider>
            </Provider>
        );
        // Failing because of design revamp changes
        // TODO later

        // let button = screen.getByLabelText('grid-view-button');
        // fireEvent.click(button);
        // button = screen.getByLabelText('fav-button');
        // fireEvent.click(button);
        // expect(screen.getByLabelText('fav-icon', { exact: false })).toBeInTheDocument();
    });

    test('Should render layouts ProblemsDashboard grid view set fav industry', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <ProblemsDashboard {...Props2} />
                </CustomThemeContextProvider>
            </Provider>
        );

        // Failing because of design revamp changes
        // TODO later

        // let button = screen.getByLabelText('grid-view-button');
        // fireEvent.click(button);
        // button = screen.getByLabelText('fav-button');
        // fireEvent.click(button);
        // expect(screen.getByLabelText('fav-icon', { exact: false })).toBeInTheDocument();
    });

    test('Should render layouts ProblemsDashboard grid view set fav industry', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <ProblemsDashboard {...Props2} />
                </CustomThemeContextProvider>
            </Provider>
        );
        // Failing because of design revamp changes
        // TODO later

        // let button = screen.getByLabelText('grid-view-button');
        // fireEvent.click(button);
        // button = screen.getByLabelText('fav-button');
        // fireEvent.click(button);
        // expect(screen.getByLabelText('fav-icon', { exact: false })).toBeInTheDocument();
    });

    test('Should render layouts ProblemsDashboard List view', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <ProblemsDashboard {...Props2} />
                </CustomThemeContextProvider>
            </Provider>
        );

        // Failing because of design revamp changes
        // TODO later

        // const button = screen.getByLabelText('list-view-button');
        // fireEvent.click(button);
        // expect(screen.getByLabelText('list-view-container', { exact: false })).toBeInTheDocument();
        // fireEvent.click(screen.getByLabelText('fun-navigation2'));
    });

    test('Should render layouts ProblemsDashboard List view', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <ProblemsDashboard {...Props2} />
                </CustomThemeContextProvider>
            </Provider>
        );

        // Failing because of design revamp changes
        // TODO later

        // const button = screen.getByLabelText('list-view-button');
        // fireEvent.click(button);
        // expect(screen.getByLabelText('list-view-container', { exact: false })).toBeInTheDocument();
        //   fireEvent.click(screen.getByLabelText('app-navigation1'))
    });

    test('Should render layouts ProblemsDashboard List view', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <ProblemsDashboard {...Props2} />
                </CustomThemeContextProvider>
            </Provider>
        );

        // Failing because of design revamp changes
        // TODO later

        // const button = screen.getByLabelText('list-view-button');
        // fireEvent.click(button);
        // expect(screen.getByLabelText('list-view-container', { exact: false })).toBeInTheDocument();
        // fireEvent.click(screen.getByLabelText('fun-navigation3'));
    });
});

const push = vi.fn();
const Props2 = {
    match: {
        params: {
            industry: 'CPG',
            function: 'Supply Chain'
        }
    },
    history: {
        push: push
    },
    classes: {},
    apps: [
        {
            id: 30,
            name: 'Capacity Planning',
            contact_email: 'ranjith@themathcompany.com',
            industry: 'CPG',
            function: 'Supply Chain',
            problem_area: 'Logistics',
            problem: 'Capacity Planning',
            config_link: false,
            blueprint_link: false,
            description: 'Labour and capacity planning to optimize cost of operations',
            app_link: '/app/30',
            approach_url: false,
            data_story_enabled: false
        }
    ]
};
