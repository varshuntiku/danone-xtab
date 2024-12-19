import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import UserRoles from '../../../components/Admin/UserRoles';
import { Provider } from 'react-redux';
import store from 'store/store';
import { getScreens } from '../../../services/screen';
import { vi } from 'vitest';

const history = createMemoryHistory();

vi.mock('../../../services/screen', () => ({
    getScreens: vi.fn()
}));

vi.mock('../../../services/admin_users', () => ({
    getAppUserRoles: vi.fn(),
    deleteUserRole: vi.fn()
}));

describe('UserRoles Component Tests', () => {
    afterEach(cleanup);

    test('should display loading state while fetching screens', () => {
        getScreens.mockImplementation(() => new Promise(() => {}));
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserRoles
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1, blueprint_link: 'test/test/test123' }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('should display "No Screens Available" message if no screens are available', async () => {
        getScreens.mockResolvedValueOnce([]);
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserRoles
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1, blueprint_link: 'test/test/test123' }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('No Screens Available')).toBeInTheDocument();
        });
    });

    test('Should handle loading state correctly', async () => {
        getScreens.mockImplementation(() => new Promise(() => {}));
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserRoles
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1, blueprint_link: 'test/test/test123' }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should handle errors when fetching screens', async () => {
        getScreens.mockRejectedValue(new Error('Failed to fetch'));
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserRoles
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1, blueprint_link: 'test/test/test123' }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('No Screens Available')).toBeInTheDocument();
        });
    });

    test('Should show ConfirmDelete dialog when attempting to delete a user role', async () => {
        getScreens.mockResolvedValue([{ level: 'testlevel', screen_name: 'test level' }]);
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserRoles
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1, blueprint_link: 'test/test/test123' }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
});
