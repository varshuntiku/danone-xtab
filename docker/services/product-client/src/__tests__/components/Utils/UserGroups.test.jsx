import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { getUserGroupsList } from '../../../services/user_groups';
import UserGroups from '../../../components/Utils/UserGroups';
import { vi } from 'vitest';

vi.mock('../../../services/user_groups', () => ({
    getUserGroupsList: vi.fn()
}));

vi.mock('../../../components/Utils/ManageUserGroups', () => {
    return { default: (props) => <> Mock Manage User Group Component</> };
});

const history = createMemoryHistory();

describe('UserGroups Component Tests', () => {
    afterEach(cleanup);

    test('Should render layout of User Groups Component', () => {
        getUserGroupsList.mockImplementation(async () => [
            {
                id: 2,
                name: 'super-user',
                app: true,
                case_studies: true,
                my_projects_only: null,
                my_projects: true,
                all_projects: true,
                widget_factory: true,
                environments: true,
                app_publish: true,
                rbac: true,
                user_group_type: 'SYSTEM',
                created_by: '--'
            },
            {
                id: 1,
                name: 'default-user',
                app: true,
                case_studies: null,
                my_projects_only: null,
                my_projects: null,
                all_projects: null,
                widget_factory: null,
                environments: null,
                app_publish: null,
                rbac: false,
                user_group_type: 'SYSTEM',
                created_by: '--'
            }
        ]);
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserGroups {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('Name')).toBeInTheDocument();
    });

    test('Should not render Create New button if superUserAccess is false', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserGroups {...Props} userPermissions={{ rbac: false }} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.queryByText('Create New')).toBeNull();
    });

    test('Should fetch and render user groups', async () => {
        const userGroups = [
            {
                id: 2,
                name: 'super-user',
                app: true,
                case_studies: true,
                my_projects_only: null,
                my_projects: true,
                all_projects: true,
                widget_factory: true,
                environments: true,
                app_publish: true,
                rbac: true,
                user_group_type: 'SYSTEM',
                created_by: '--'
            }
        ];
        getUserGroupsList.mockImplementation(async () => userGroups);

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserGroups {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(await screen.findByText('super-user')).toBeInTheDocument();
    });

    test('Should handle search input changes', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserGroups {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );

        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'super-user' } });

        expect(searchInput.value).toBe('super-user');
    });
});

const Props = {
    classes: {},
    setActionButtons: () => {},
    userPermissions: {}
};
