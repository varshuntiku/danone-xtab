import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ManageFunctions from '../../../components/Utils/ManageFunctions.jsx';
import { createFunction, updateFunction } from '../../../services/dashboard.js';
import { functions } from 'underscore';
import { vi } from 'vitest';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

vi.mock('../../../services/dashboard', () => ({
    createFunction: vi.fn(),
    updateFunction: vi.fn()
}));

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

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    //Update and Save
    test('Should render layouts ManageFunctions Component', () => {
        updateFunction.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ManageFunctions {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByTitle('Manage Function'));
        expect(screen.getByText('Update Function')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });

    //Create and Save
    test('Should render layouts ManageFunctions Component 1', () => {
        createFunction.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ManageFunctions {...Props1} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Create New' }));
        expect(screen.getByText('Create New Function')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });

    //Create and Close
    test('Should render layouts ManageFunctions Component 2', () => {
        createFunction.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ManageFunctions {...Props1} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Create New' }));
        expect(screen.getByTitle('Close')).toBeInTheDocument();
        fireEvent.click(screen.getByTitle('Close'));
    });

    // Create and Canelling
    test('Should render layouts ManageFunctions Component 3', () => {
        createFunction.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ManageFunctions {...Props1} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Create New' }));
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    });

    //Create and Cancel 2
    test('Should render layouts ManageFunctions Component 4', () => {
        createFunction.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ManageFunctions {...Props1} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Create New' }));
        expect(screen.getByText('Create New Function')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    });

    //Update and Cancel
    test('Should render layouts ManageFunctions Component 5', () => {
        updateFunction.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ManageFunctions {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByTitle('Manage Function'));
        expect(screen.getByText('Update Function')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    });

    //Update and Close
    test('Should render layouts ManageFunctions Component 6', () => {
        updateFunction.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ManageFunctions {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByTitle('Manage Function'));
        expect(screen.getByText('Update Function')).toBeInTheDocument();
        expect(screen.getByTitle('Close')).toBeInTheDocument();
        fireEvent.click(screen.getByTitle('Close'));
    });

    //Create New and Save With No Order Value
    test('Should render layouts ManageFunctions Component 7', () => {
        createFunction.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ManageFunctions {...Props2} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Create New' }));
        expect(screen.getByText('Create New Function')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });

    test('Should render layouts ManageFunctions Component 8', () => {
        updateFunction.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ManageFunctions {...Props3} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Create New' }));
        expect(screen.getByText('Create New Function')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });

    test('Should render layouts ManageFunctions Component 9', () => {
        updateFunction.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ManageFunctions {...Props4} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByTitle('Manage Function'));
        expect(screen.getByText('Update Function')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });
});

const Props = {
    classes: {},
    function: {},
    createNewFunction: false,
    functionsData: [],
    industriesData: [],
    refreshFunctionsList: () => {}
};

const Props1 = {
    classes: {},
    function: {},
    createNewFunction: true,
    functionsData: [],
    industriesData: [],
    refreshFunctionsList: () => {}
};
const Props2 = {
    classes: {},
    function: {
        description: 'test Merchandising & Store Ops',
        function_id: 3,
        function_name: 'Merchandising & Store Ops',
        industry_id: 1,
        logo_name: 'RetailMerchandisingIcon'
    },
    createNewFunction: true,
    functionsData: [],
    industriesData: [],
    refreshFunctionsList: () => {}
};

const Props3 = {
    classes: {},
    function: {
        description: '',
        function_id: '',
        function_name: '',
        industry_id: '',
        logo_name: ''
    },
    createNewFunction: true,
    functionsData: [],
    industriesData: [],
    refreshFunctionsList: () => {}
};

const Props4 = {
    classes: {},
    function: {
        description: 'test Merchandising & Store Ops',
        function_id: 3,
        function_name: 'Merchandising & Store Ops',
        industry_id: 1,
        logo_name: 'RetailMerchandisingIcon',
        order: 'ABS',
        parent_function_id: 1
    },
    createNewFunction: false,
    functionsData: [],
    industriesData: [],
    refreshFunctionsList: () => {}
};
