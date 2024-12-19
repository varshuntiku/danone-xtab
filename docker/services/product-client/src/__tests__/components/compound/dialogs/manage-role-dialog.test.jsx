import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from 'themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { createRole, getRoleById, updateRole, deleteRole } from 'services/role';
import ManageRoleDialog from 'components/compound/dialogs/manage-role-dialog';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../../../services/role', () => ({
    createRole: vi.fn(),
    getRoleById: vi.fn(),
    updateRole: vi.fn(),
    deleteRole: vi.fn()
}));

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should create a new user role', () => {
        createRole.mockImplementation(() => {});
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageRoleDialog {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByLabelText('role-name')).toBeInTheDocument();
        expect(screen.getByLabelText('permission-cloning_of_application')).toBeInTheDocument();
        const emailInput = screen.getByLabelText('role-name');
        fireEvent.change(emailInput, { target: { value: 'Cutom Role 1' } });
        const checkbox = screen.getByLabelText('permission-cloning_of_application');
        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    });

    test('Should update a user role', async () => {
        getRoleById.mockImplementation(() => ({
            data: {
                id: 1,
                name: 'Custom Role 1',
                permissions: ['CLONING_OF_APPLICATION']
            }
        }));
        updateRole.mockImplementation(() => {});
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageRoleDialog {...{ ...Props, isEdit: true, roleId: 1 }} />
                </Router>
            </CustomThemeContextProvider>
        );
        await setTimeout(() => {}, 1000);
        waitFor(() => {
            expect(screen.getByLabelText('role-name')).toBeInTheDocument();
            expect(screen.getByLabelText('permission-cloning_of_application')).toBeInTheDocument();
            const emailInput = screen.getByLabelText('role-name');
            fireEvent.change(emailInput, { target: { value: 'Cutom Role 1 Edited' } });
            const checkbox = screen.getByLabelText('permission-cloning_of_application');
            expect(checkbox).toBeChecked();
            fireEvent.click(checkbox);
            expect(checkbox).not.toBeChecked();
            fireEvent.click(screen.getByRole('button', { name: 'Save' }));
        });
    });

    test('Should delete a user role', async () => {
        getRoleById.mockImplementation(() => ({
            data: {
                id: 1,
                name: 'Custom Role 1',
                permissions: ['CLONING_OF_APPLICATION']
            }
        }));
        deleteRole.mockImplementation(() => {});
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageRoleDialog {...{ ...Props, isEdit: true, roleId: 1 }} />
                </Router>
            </CustomThemeContextProvider>
        );
        await setTimeout(() => {}, 1000);
        waitFor(() => {
            expect(screen.getByLabelText('role-name')).toBeInTheDocument();
            expect(screen.getByLabelText('permission-cloning_of_application')).toBeInTheDocument();
            expect(screen.getByLabelText('permission-cloning_of_application')).toBeChecked();
            fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
        });
    });
});

const Props = {
    isEdit: false,
    roleId: null,
    showDialog: true,
    setShowDialog: () => {},
    reloadData: () => {},
    permissions: [
        {
            id: 1,
            name: 'CLONING_OF_APPLICATION',
            created_by: '--'
        },
        {
            id: 2,
            name: 'RESET_ALL_APP',
            created_by: '--'
        }
    ]
};
