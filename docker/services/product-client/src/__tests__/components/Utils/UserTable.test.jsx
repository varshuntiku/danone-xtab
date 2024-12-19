import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import UserTable from '../../../components/Utils/UserTable.jsx';
import { deleteUser, editUser, getUserDetails, getAllApps } from '../../../services/dashboard.js';
import { vi } from 'vitest';

vi.mock('../../../services/dashboard', () => ({
    deleteUser: vi.fn(),
    editUser: vi.fn(),
    getUserDetails: vi.fn(),
    getAllApps: vi.fn()
}));

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render UserTable Component', () => {
        deleteUser.mockImplementation(({ callback }) => callback());
        editUser.mockImplementation(({ callback }) => callback());
        getUserDetails.mockImplementation(({ callback }) =>
            callback([
                {
                    email_address: 'asd@sad.com',
                    first_name: 'asd',
                    id: 485,
                    last_name: 'asd',
                    restricted_user: false,
                    user_groups: [1, 6, 5],
                    nac_user_roles: [1]
                }
            ])
        );
        getAllApps.mockImplementation(({ callback }) =>
            callback([
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
            ])
        );
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserTable {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const searchBox = screen.getAllByRole('textbox', { type: 'text' });
        expect(searchBox.length).toBe(3);
    });

    test('Should not display CodxCircularLoader when loading is false', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserTable {...Props} loading={false} />
                </Router>
            </CustomThemeContextProvider>
        );

        const loader = screen.queryByRole('progressbar');
        expect(loader).toBeNull();
    });

    test('Should not show Clear Search button when searchText is empty', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserTable {...Props} searchText="" />
                </Router>
            </CustomThemeContextProvider>
        );

        const clearButton = screen.queryByRole('button', { name: /clear search/i });
        expect(clearButton).toBeNull();
    });
});

const Props = {
    classes: {},
    fetchAllUsers: () => {},
    rowsData: [
        {
            created_at: '07 April, 2022 12:50',
            email_address: 'drum@drum.com',
            first_name: 'First Name',
            id: 1,
            last_name: 'Last name',
            restricted_user: ['Yes'],
            user_group: ['default-user'],
            nac_user_roles: ['APP ADMIN']
        }
    ],
    userGroups: [
        {
            all_projects: false,
            app: true,
            app_publish: false,
            case_studies: true,
            created_by: 'Random Name',
            environments: false,
            id: 8,
            my_projects: false,
            my_projects_only: true,
            name: 'COACH',
            rbac: false,
            user_group_type: 'USER CREATED',
            widget_factory: false
        }
    ],
    userRoles: [
        {
            id: 1,
            name: 'Role 1',
            permissions: ['CLONING_OF_APPLICATION', 'RESET_ALL_APP'],
            user_role_type: 'SYSTEM',
            created_by: '--'
        }
    ]
};
