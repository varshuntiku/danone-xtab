import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { ManageResponsibility } from '../../../../components/Admin/ModuleComponents/ManageResponsibility';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { editAppModules } from '../../../../services/app.js';
import { updateAppUserResponsibilities } from '../../../../services/app_admin.js';
import { vi } from 'vitest';

vi.mock('../../../../services/app.js', () => ({
    editAppModules: vi.fn()
}));

vi.mock('../../../../services/app_admin.js', () => ({
    updateAppUserResponsibilities: vi.fn()
}));

const history = createMemoryHistory();

describe('Codex ManageResponsibility test', () => {
    afterEach(cleanup);

    test('Should render Manage Responsibility Popup', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageResponsibility {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Manage Responsibilities')).toBeInTheDocument();
    });

    test('Should render existing Responsibilities in Popup', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageResponsibility {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('resp 1')).toBeInTheDocument();
    });

    test('Should disable Save button when there is no change in responsibility', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageResponsibility {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
        const saveBtn = screen.getByRole('button', { name: 'Save' });
        expect(saveBtn).toBeDisabled();
    });

    test('Should disable Add button when there is no input in textbox', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageResponsibility {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
        const addBtn = screen.getByRole('button', { name: 'Add' });
        expect(addBtn).toBeDisabled();
    });

    test('Should save the new responsibilities', () => {
        editAppModules.mockImplementation(({ callback }) => callback({ status: 'success' }));
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageResponsibility {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
        const textbox = screen.getByRole('textbox');
        fireEvent.change(textbox, { target: { value: 'resp 3' } });
        const addBtn = screen.getByRole('button', { name: 'Add' });
        fireEvent.click(addBtn);
        const saveBtn = screen.getByRole('button', { name: 'Save' });
        fireEvent.click(saveBtn);
    });

    test('Should show the error message when duplicate responsibility has been entered', () => {
        editAppModules.mockImplementation(({ callback }) => callback({ status: 'success' }));
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageResponsibility {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
        const textbox = screen.getByRole('textbox');
        fireEvent.change(textbox, { target: { value: 'resp 1' } });
        const addBtn = screen.getByRole('button', { name: 'Add' });
        expect(addBtn).toBeDisabled();
        expect(getByText('Responsibility already exists')).toBeInTheDocument();
    });

    test('Should remove the existing responsibilities', () => {
        editAppModules.mockImplementation(({ callback }) => callback({ status: 'success' }));
        updateAppUserResponsibilities.mockImplementation(({ callback }) =>
            callback({ message: 'Successfully updated' })
        );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ManageResponsibility {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByRole('button', { name: 'resp 1' })).toBeInTheDocument();
        const chipEl = screen.getByRole('button', { name: 'resp 1' });

        expect(chipEl.getElementsByClassName('MuiChip-deleteIcon')[0]).toBeInTheDocument();
        const deleteIcon = chipEl.getElementsByClassName('MuiChip-deleteIcon')[0];
        fireEvent.click(deleteIcon);

        expect(chipEl).not.toBeInTheDocument();

        const saveBtn = screen.getByRole('button', { name: 'Save' });
        fireEvent.click(saveBtn);
    });
});

const Props = {
    open: true,
    app_id: 26,
    classes: {},
    responsibilities: [],
    onDialogClose: () => {}
};

const Props1 = {
    open: true,
    app_id: 26,
    classes: {},
    responsibilities: ['resp 1', 'resp 2'],
    onDialogClose: () => {}
};
