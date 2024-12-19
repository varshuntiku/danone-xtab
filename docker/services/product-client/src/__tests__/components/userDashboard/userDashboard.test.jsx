import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import UserDashboard from '../../../components/userDashboard/UserDashboard';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import {
    getUserAppsHierarchy,
    getDashboardsList,
    getBannerInfo
} from '../../../services/dashboard';
import { Provider } from 'react-redux';
import store from 'store/store';
import { vi } from 'vitest';

vi.mock('../../../services/dashboard', () => ({
    getUserAppsHierarchy: vi.fn(),
    getDashboardsList: vi.fn(),
    getBannerInfo: vi.fn()
}));

const history = createMemoryHistory();

describe('UserDashboard', () => {
    afterEach(cleanup);

    test('Should render UserDashboard Component', () => {
        getUserAppsHierarchy.mockImplementation(() => {
            [];
        });
        getDashboardsList.mockImplementation(() => {
            [];
        });
        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserDashboard />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render UserDashboard Component 1', () => {
        getUserAppsHierarchy.mockImplementation(({ callback }) => {
            throw 'error';
        });
        getDashboardsList.mockImplementation(() => {
            [];
        });
        const { getByText, debug, getByLabelText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserDashboard />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
});
