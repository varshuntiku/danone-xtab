import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ManageIndustry from '../../../components/Utils/ManageIndustry.jsx';
import { createIndustry, updateIndustry } from '../../../services/dashboard.js';
import { vi } from 'vitest';

vi.mock('../../../services/dashboard', () => ({
    getIndustriesList: vi.fn(),
    createIndustry: vi.fn(),
    updateIndustry: vi.fn(),
    validateOrder: vi.fn()
}));

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts ManageIndustry Component', () => {
        updateIndustry.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageIndustry {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByTitle('Manage Industry'));
        expect(screen.getByText('Update Industry')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });

    test('Should render layouts ManageIndustry Component 1', () => {
        updateIndustry.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageIndustry {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByTitle('Manage Industry'));
        expect(screen.getByText('Update Industry')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    });

    test('Should render layouts ManageIndustry Component 2', () => {
        createIndustry.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageIndustry {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Create New' }));
        expect(screen.getByText('Create New Industry')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });

    test('Should render layouts ManageIndustry Component 3', () => {
        createIndustry.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageIndustry {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Create New' }));
        expect(screen.getByText('Create New Industry')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    });

    test('Should render layouts ManageIndustry Component 4', () => {
        createIndustry.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageIndustry {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Create New' }));
        expect(screen.getByTitle('Close')).toBeInTheDocument();
        fireEvent.click(screen.getByTitle('Close'));
    });

    test('Should render layouts ManageIndustry Component 5', () => {
        updateIndustry.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageIndustry {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByTitle('Manage Industry'));
        expect(screen.getByText('Update Industry')).toBeInTheDocument();
        expect(screen.getByTitle('Close')).toBeInTheDocument();
        fireEvent.click(screen.getByTitle('Close'));
    });

    test('Should render layouts ManageIndustry Component 6', () => {
        createIndustry.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageIndustry {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Create New' }));
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    });

    test('Should render layouts ManageIndustry Component 7', () => {
        createIndustry.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageIndustry {...Props2} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Create New' }));
        expect(screen.getByText('Create New Industry')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    });

    test('Should render layouts ManageIndustry Component 8', () => {
        createIndustry.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageIndustry {...Props2} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Create New' }));
        expect(screen.getByTitle('Close')).toBeInTheDocument();
        fireEvent.click(screen.getByTitle('Close'));
    });

    test('Should render layouts ManageIndustry Component 9', () => {
        createIndustry.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageIndustry {...Props5} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Create New' }));
        expect(screen.getByText('Create New Industry')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });

    test('Should render layouts ManageIndustry Component 10', () => {
        updateIndustry.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageIndustry {...Props4} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByTitle('Manage Industry'));
        expect(screen.getByText('Update Industry')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });

    test('Should not allow to create Industry with same name', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageIndustry {...Props6} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: 'Create New' }));
        expect(screen.getByText('Create New Industry')).toBeInTheDocument();
        expect(screen.getByDisplayValue('test')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    });
});

const Props = {
    classes: {},
    industry: {
        id: 1,
        industry_name: 'Retail',
        logo_name: 'Retail',
        order: 1
    },
    createNewIndustry: false,
    industriesData: [],
    refreshIndustryList: () => {}
};
const Props1 = {
    classes: {},
    industry: {
        id: 1,
        industry_name: 'Retail',
        logo_name: 'Retail',
        order: 1
    },
    createNewIndustry: true,
    industriesData: [],
    refreshIndustryList: () => {}
};

const Props2 = {
    classes: {},
    industry: {
        id: 1,
        industry_name: 'Retail',
        logo_name: 'Retail'
    },
    createNewIndustry: true,
    industriesData: [],
    refreshIndustryList: () => {}
};

const Props3 = {
    classes: {},
    industry: {
        industry_name: '',
        logo_name: '',
        order: '',
        horizon: ''
    },
    createNewIndustry: true,
    industriesData: [],
    refreshIndustryList: () => {}
};

const Props4 = {
    classes: {},
    industry: {
        id: 2,
        industry_name: 'Retail',
        logo_name: 'Retail',
        order: 'AS',
        parent_industry_id: 1
    },
    createNewIndustry: false,
    industriesData: [],
    refreshIndustryList: () => {}
};

const Props5 = {
    classes: {},
    industry: {
        id: 2,
        industry_name: 'Retail',
        logo_name: 'Retail',
        order: 'AS',
        parent_industry_id: 1
    },
    createNewIndustry: true,
    industriesData: [],
    refreshIndustryList: () => {}
};

const Props6 = {
    classes: {},
    industry: {
        id: 2,
        industry_name: 'test',
        logo_name: 'Retail',
        horizon: 'vertical',
        order: 9,
        parent_industry_id: 1
    },
    createNewIndustry: true,
    industriesData: [
        {
            id: 2,
            industry_name: 'test',
            logo_name: 'Retail',
            order: 'AS',
            parent_industry_id: 1
        }
    ],
    refreshIndustryList: () => {}
};
