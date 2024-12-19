import React from 'react';
import {
    render,
    screen,
    cleanup,
    fireEvent,
    waitForElement,
    waitFor
} from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import BulkUserCreation from '../../../components/Utils/BulkUserCreation.jsx';
import { Provider } from 'react-redux';
import store from 'store/store';

import {
    bulkUserUpload,
    addUser,
    getUsers,
    getUserGroups,
    getAllApps
} from '../../../services/dashboard.js';
import { vi } from 'vitest';
import { getAllRoles } from 'services/role';

vi.mock('../../../services/dashboard', async () => {
    const functions = await vi.importActual('../../../services/dashboard');
    return {
        ...functions,
        addUser: vi.fn(),
        getUserGroups: vi.fn(),
        getAllApps: vi.fn(),
        getUsers: vi.fn()
    };
});

vi.mock('../../../services/role', async () => {
    const functions = await vi.importActual('../../../services/role');
    return {
        ...functions,
        getAllRoles: vi.fn()
    };
});

vi.mock('../../../components/Utils/UserTable', () => {
    return { default: (props) => <>Mock User Table Component</> };
});

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts BulkUserCreation Component', () => {
        getUsers.mockImplementation(async () => [
            {
                first_name: 'new',
                last_name: 'name',
                email_address: 'newname@gmail.com',
                created_at: '2022-07-15 20:24:41.615 +0530',
                restricted_user: [],
                user_groups: [],
                user_apps: [],
                nac_user_roles: []
            }
        ]);
        getUserGroups.mockImplementation(async () => [
            {
                id: 1,
                name: 'default_user'
            }
        ]);
        getAllRoles.mockImplementation(async () => ({
            data: [
                {
                    id: 1,
                    name: 'Role 1',
                    permissions: ['CLONING_OF_APPLICATION', 'RESET_ALL_APP'],
                    user_role_type: 'SYSTEM',
                    created_by: '--'
                }
            ]
        }));
        getAllApps.mockImplementation(({ callback }) =>
            callback({
                data: [
                    {
                        id: 12,
                        name: 'manu',
                        app_user_id: 2
                    },
                    {
                        id: 13,
                        name: 'app',
                        app_user_id: 3
                    }
                ]
            })
        );

        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <BulkUserCreation {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('should toggle Restricted User switch correctly', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <BulkUserCreation {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('should toggle Default 14 Days Window switch when Restricted User is checked', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <BulkUserCreation {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('should handle App selection and search correctly', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <BulkUserCreation {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('should handle Cancel button click', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <BulkUserCreation {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('should handle Save button click', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <BulkUserCreation {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
});

const Props = {
    classes: {},
    setActionButtons: () => {}
};
