import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import {
    createUserGroups,
    updateUserGroups,
    deleteUserGroups
} from '../../../services/user_groups';
import ManageUserGroups from '../../../components/Utils/ManageUserGroups';
import { vi } from 'vitest';

vi.mock('../../../services/user_groups', () => ({
    createUserGroups: vi.fn(),
    updateUserGroups: vi.fn(),
    deleteUserGroups: vi.fn()
}));

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts Manage User Groups Component', () => {
        updateUserGroups.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageUserGroups {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Update User Group')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    test('Should render layouts Manage User Groups Component 1', () => {
        updateUserGroups.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageUserGroups {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Update User Group')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    });

    test('Should render layouts Manage UserGroups Component 2', () => {
        createUserGroups.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageUserGroups {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Create New User Group')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });

    test('Should render layouts Manage UserGroups Component 3', () => {
        createUserGroups.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageUserGroups {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Create New User Group')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    });

    test('Should render layouts Manage UserGroups Component 4', () => {
        createUserGroups.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageUserGroups {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Create New User Group')).toBeInTheDocument();
        expect(screen.getByTitle('Close')).toBeInTheDocument();
        fireEvent.click(screen.getByTitle('Close'));
    });

    test('Should render layouts Manage UserGroups Component 5', () => {
        updateUserGroups.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageUserGroups {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Update User Group')).toBeInTheDocument();
        expect(screen.getByTitle('Close')).toBeInTheDocument();
        fireEvent.click(screen.getByTitle('Close'));
    });

    test('Should render layouts Manage UserGroups Component with delete modal', () => {
        updateUserGroups.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageUserGroups {...Props2} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Delete User Group?')).toBeInTheDocument();
        expect(screen.getByTitle('Close')).toBeInTheDocument();
        fireEvent.click(screen.getByTitle('Close'));
    });

    test('Should render layouts Manage UserGroups Component with delete modal and delete group', () => {
        updateUserGroups.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageUserGroups {...Props2} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Delete User Group?')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    });
});

const Props = {
    classes: {},
    open: true,
    userGroupData: {
        id: 4,
        name: 'test 4',
        app: true,
        case_studies: false,
        my_projects_only: false,
        my_projects: false,
        all_projects: false,
        widget_factory: false,
        environments: false,
        app_publish: false,
        rbac: true,
        user_group_type: 'USER CREATED',
        created_by: 'Vishwas C'
    },
    handleModalClose: () => {},
    manageMode: 'edit',
    setSnackbar: () => {}
};
const Props1 = {
    classes: {},
    open: true,
    userGroupData: {
        name: '',
        app: false,
        case_studies: false,
        my_projects_only: false,
        my_projects: false,
        all_projects: false,
        widget_factory: false,
        environments: false,
        app_publish: false,
        rbac: false
    },
    handleModalClose: () => {},
    manageMode: 'create',
    setSnackbar: () => {}
};

const Props2 = {
    classes: {},
    open: true,
    userGroupData: {
        id: 4,
        name: 'test',
        app: false,
        case_studies: false,
        my_projects_only: false,
        my_projects: false,
        all_projects: false,
        widget_factory: false,
        environments: false,
        app_publish: false,
        rbac: false
    },
    handleModalClose: () => {},
    manageMode: 'delete',
    setSnackbar: () => {}
};
