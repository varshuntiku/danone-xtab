import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import Industry from '../../../components/Utils/Industry.jsx';
import { getIndustriesList, deleteIndustry } from '../../../services/dashboard.js';
import { Provider } from 'react-redux';
import store from 'store/store';
import { vi } from 'vitest';

vi.mock('../../../services/dashboard', () => ({
    getIndustriesList: vi.fn(),
    deleteIndustry: vi.fn()
}));
vi.mock('../../../components/Utils/ManageIndustry', () => {
    return {
        default: (props) => (
            <>
                Mock Manage Industry Component
                {/* <button aria-label='refresh' onClick={props.refreshFunctionsList()}>Refresh Function</button> */}
            </>
        )
    };
});

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts Industry Component', () => {
        getIndustriesList.mockImplementation(({ callback }) =>
            callback([
                {
                    horizon: 'vertical',
                    id: 1,
                    industry_name: 'Retail',
                    logo_name: 'Retail',
                    order: 1
                }
            ])
        );
        deleteIndustry.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Industry {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        // expect(screen.getByTitle('delete industry')).toBeInTheDocument()
        // fireEvent.click(screen.getByTitle('delete industry'))
        // expect(screen.getByRole('button',{ name: 'Cancel'})).toBeInTheDocument()
        // fireEvent.click(screen.getByRole('button',{ name: 'Cancel'}))
    });

    test('Should render layouts Industry Component', () => {
        getIndustriesList.mockImplementation(({ callback }) =>
            callback([
                {
                    horizon: 'vertical',
                    id: 1,
                    industry_name: 'Retail',
                    logo_name: 'Retail',
                    order: 1
                }
            ])
        );
        deleteIndustry.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Industry {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        // expect(screen.getByTitle('delete industry')).toBeInTheDocument()
        // fireEvent.click(screen.getByTitle('delete industry'))
        // expect(screen.getByRole('button',{ name: 'Delete'})).toBeInTheDocument()
        // fireEvent.click(screen.getByRole('button',{ name: 'Delete'}))
    });
});

const Props = {
    classes: {}
};
