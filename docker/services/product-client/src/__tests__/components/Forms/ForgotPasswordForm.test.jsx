import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ForgotPasswordForm from '../../../components/Forms/ForgotPasswordForm';
import { updatePassword } from '../../../services/passwordManager';
import Timer from '../../../components/misc/Timer';
import CustomSnackbar from '../../../components/CustomSnackbar';
import CustomDialog from '../../../components/custom/CustomDialog';

vi.mock('../../../services/passwordManager', () => ({
    updatePassword: vi.fn()
}));

const history = createMemoryHistory();

describe('ForgotPasswordForm Component Tests', () => {
    afterEach(cleanup);

    test('Should render ForgotPasswordForm Component', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ForgotPasswordForm email="test@example.com" />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByPlaceholderText('Enter New Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm New Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument();
    });

    test('Should handle input changes and form submission', async () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ForgotPasswordForm email="test@example.com" />
                </Router>
            </CustomThemeContextProvider>
        );

        const newPasswordInput = screen.getByPlaceholderText('Enter New Password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm New Password');

        fireEvent.change(newPasswordInput, { target: { value: 'test123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'test123' } });

        fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

        await waitFor(() => {
            expect(updatePassword).toHaveBeenCalled();
        });
    });

    test('Should show validation errors for short passwords', async () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ForgotPasswordForm email="test@example.com" />
                </Router>
            </CustomThemeContextProvider>
        );

        const newPasswordInput = screen.getByPlaceholderText('Enter New Password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm New Password');

        fireEvent.change(newPasswordInput, { target: { value: '123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: '123' } });

        fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

        await waitFor(() => {
            expect(
                screen.getByText('Password should have 4 or more characters')
            ).toBeInTheDocument();
        });
    });

    test('Should show validation error if passwords do not match', async () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ForgotPasswordForm email="test@example.com" />
                </Router>
            </CustomThemeContextProvider>
        );

        const newPasswordInput = screen.getByPlaceholderText('Enter New Password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm New Password');

        fireEvent.change(newPasswordInput, { target: { value: 'test123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });

        fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

        await waitFor(() => {
            expect(screen.getByText('New and confirm password do not match')).toBeInTheDocument();
        });
    });

    test('Should show a success message when passwords are updated successfully', async () => {
        updatePassword.mockResolvedValue({
            status: true,
            data: { message: 'Password updated successfully' }
        });

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ForgotPasswordForm email="test@example.com" />
                </Router>
            </CustomThemeContextProvider>
        );

        const newPasswordInput = screen.getByPlaceholderText('Enter New Password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm New Password');
        const resetButton = screen.getByRole('button', { name: 'Reset Password' });

        fireEvent.change(newPasswordInput, { target: { value: 'test123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'test123' } });
        fireEvent.click(resetButton);

        await waitFor(() => {
            expect(screen.getByText('Password updated successfully')).toBeInTheDocument();
        });
    });

    test('Should show an error message if password update fails', async () => {
        updatePassword.mockResolvedValue({
            status: false,
            data: { message: 'Failed to update password' }
        });

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ForgotPasswordForm email="test@example.com" />
                </Router>
            </CustomThemeContextProvider>
        );

        const newPasswordInput = screen.getByPlaceholderText('Enter New Password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm New Password');
        const resetButton = screen.getByRole('button', { name: 'Reset Password' });

        fireEvent.change(newPasswordInput, { target: { value: 'test123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'test123' } });
        fireEvent.click(resetButton);

        await waitFor(() => {
            expect(screen.getByText('Failed to update password')).toBeInTheDocument();
        });
    });

    test('Should handle Snackbar notifications', async () => {
        updatePassword.mockResolvedValue({
            status: true,
            data: { message: 'Password updated successfully' }
        });

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ForgotPasswordForm email="test@example.com" />
                </Router>
            </CustomThemeContextProvider>
        );

        const newPasswordInput = screen.getByPlaceholderText('Enter New Password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm New Password');
        const resetButton = screen.getByRole('button', { name: 'Reset Password' });

        fireEvent.change(newPasswordInput, { target: { value: 'test123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'test123' } });
        fireEvent.click(resetButton);

        await waitFor(() => {
            expect(screen.getByText('Password updated successfully')).toBeInTheDocument();
        });
    });
});
