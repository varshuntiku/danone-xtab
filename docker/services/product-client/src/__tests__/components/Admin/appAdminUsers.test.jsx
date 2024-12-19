import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import Users from '../../../components/Admin/Users';
import { Provider } from 'react-redux';
import store from 'store/store';
import { getAppUserRoles } from '../../../services/admin_users';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../../services/admin_users', async () => {
    const functions = await vi.importActual('../../../services/admin_users');
    return {
        ...functions,
        getAppUserRoles: vi.fn()
    };
});

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts ObjectivesDashboard Component', () => {
        getAppUserRoles.mockImplementation(({ callback }) => callback([{ id: 1, name: 'test' }]));
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Users
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{
                                id: 1,
                                blueprint_link: 'test/test/test123',
                                modules: { responsibilities: ['test', 'test'] }
                            }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
});
