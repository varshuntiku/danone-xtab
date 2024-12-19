import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import UserRoleActions from '../../../components/Admin/UserRoleActions';
import { Provider } from 'react-redux';
import store from 'store/store';
import { updateUserRole, createUserRole } from '../../../services/admin_users';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../../services/admin_users', () => ({
    updateUserRole: vi.fn(),
    createUserRole: vi.fn(() =>
        Promise.reject({ response: { data: { error: 'Creation failed' } } })
    )
}));

describe('Codex Product test', () => {
    afterEach(cleanup);
    test('Should render layouts ObjectivesDashboard Component', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserRoleActions
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1, blueprint_link: 'test/test/test123' }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByTitle('Manage User Role'));
        fireEvent.click(screen.getByText('Cancel'));
        fireEvent.click(screen.getByTitle('Manage User Role'));
        fireEvent.click(screen.getByTitle('Close'));
    });

    test('Should render layouts ObjectivesDashboard Component', () => {
        createUserRole.mockImplementation(() => {
            throw 'error';
        });
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserRoleActions
                            createNewUserRole={true}
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_modules={{ id: 1, screen_name: 'testscreen' }}
                            app_info={{ id: 1, blueprint_link: 'test/test/test123' }}
                            user_role={{ permissions: ['admin', 'testing'] }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByText('Create New'));
        fireEvent.change(screen.getByLabelText('Role Name'), { target: { value: 'test name' } });
        fireEvent.click(screen.getByText('Save'));
    });

    test('Should render layouts ObjectivesDashboard Component', () => {
        updateUserRole.mockImplementation(({ callback }) => {
            callback();
        });
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserRoleActions
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1, blueprint_link: 'test/test/test123' }}
                            user_role={{ permissions: ['admin', 'testing'] }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByTitle('Manage User Role'));
        fireEvent.change(screen.getByLabelText('Role Name'), { target: { value: 'test name' } });
        fireEvent.click(screen.getByText('Save'));
    });

    test('Save button is disabled if required fields are not filled', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserRoleActions
                            createNewUserRole={true}
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_modules={{ id: 1, screen_name: 'testscreen' }}
                            app_info={{ id: 1, blueprint_link: 'test/test/test123' }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByText('Create New'));

        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    test('Calls createUserRole with correct data', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserRoleActions
                            createNewUserRole={true}
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_modules={{ id: 1, screen_name: 'testscreen' }}
                            app_info={{ id: 1, blueprint_link: 'test/test/test123' }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByText('Create New'));
        fireEvent.change(screen.getByLabelText('Role Name'), { target: { value: 'test name' } });
        fireEvent.click(screen.getByText('Save'));

        expect(createUserRole).toHaveBeenCalledWith({
            payload: {
                name: 'test name',
                permissions: ['admin', 'testing'],
                app_id: 1
            },
            callback: expect.any(Function)
        });
    });
    test('Form fields reset on close', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserRoleActions
                            createNewUserRole={true}
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_modules={{ id: 1, screen_name: 'testscreen' }}
                            app_info={{ id: 1, blueprint_link: 'test/test/test123' }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByText('Create New'));
        fireEvent.change(screen.getByLabelText('Role Name'), { target: { value: '' } });
        fireEvent.click(screen.getByTitle('Close'));

        fireEvent.click(screen.getByText('Create New'));
        expect(screen.getByLabelText('Role Name').value).toBe('');
    });
});
