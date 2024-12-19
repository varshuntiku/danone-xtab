import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import Functions from '../../../components/Utils/Functions';
import {
    getFunctionsList,
    deleteFunction,
    getIndustriesList
} from '../../../services/dashboard.js';
import { Provider } from 'react-redux';
import store from 'store/store';
import { vi } from 'vitest';

vi.mock('../../../services/dashboard', () => ({
    getIndustriesList: vi.fn(),
    getFunctionsList: vi.fn(),
    deleteFunction: vi.fn()
}));
vi.mock('../../../components/Utils/ManageFunctions', () => {
    return {
        default: (props) => <>Mock Manage Functions Component</>
    };
});

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts Functions Component', () => {
        getFunctionsList.mockImplementation(({ callback }) =>
            callback([
                {
                    description: 'test Merchandising & Store Ops',
                    function_id: 3,
                    function_name: 'Merchandising & Store Ops',
                    industry_id: 1,
                    industry_name: 'Retail',
                    logo_name: 'RetailMerchandisingIcon',
                    order: 3
                }
            ])
        );
        deleteFunction.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Functions {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render layouts Functions Component', () => {
        getFunctionsList.mockImplementation(({ callback }) =>
            callback([
                {
                    description: 'test Merchandising & Store Ops',
                    function_id: 3,
                    function_name: 'Merchandising & Store Ops',
                    industry_id: 1,
                    industry_name: 'Retail',
                    logo_name: 'RetailMerchandisingIcon',
                    order: 3
                }
            ])
        );
        deleteFunction.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Functions {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should handle pagination in Functions component', () => {
        getFunctionsList.mockImplementation(({ callback }) =>
            callback([
                {
                    description: 'test Merchandising & Store Ops',
                    function_id: 3,
                    function_name: 'Merchandising & Store Ops',
                    industry_id: 1,
                    industry_name: 'Retail',
                    logo_name: 'RetailMerchandisingIcon',
                    order: 3
                },
                {
                    description: 'test Finance',
                    function_id: 4,
                    function_name: 'Finance',
                    industry_id: 2,
                    industry_name: 'Finance',
                    logo_name: 'FinanceIcon',
                    order: 4
                },
                {
                    description: 'test HR',
                    function_id: 5,
                    function_name: 'HR',
                    industry_id: 3,
                    industry_name: 'Human Resources',
                    logo_name: 'HRIcon',
                    order: 5
                }
            ])
        );

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Functions {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
});

const Props = {
    classes: {}
};
