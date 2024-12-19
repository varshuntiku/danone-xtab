import React from 'react';
import { render, screen, cleanup, fireEvent, getByLabelText } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ResetPasswordForm from '../../../components/Forms/ResetPasswordForm';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render ResetPasswordForm Component', () => {
        const { getByText, getByTestId } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ResetPasswordForm />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByPlaceholderText('Enter Current Password')).toBeInTheDocument();
        const oldPasswordInput = screen.getByPlaceholderText('Enter Current Password');
        fireEvent.change(oldPasswordInput, { target: { value: 'test123old' } });
        expect(screen.getByPlaceholderText('Enter New Password')).toBeInTheDocument();
        const newPasswordInput = screen.getByPlaceholderText('Enter New Password');
        fireEvent.change(newPasswordInput, { target: { value: 'test123' } });
        expect(screen.getByPlaceholderText('Confirm New Password')).toBeInTheDocument();
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm New Password');
        fireEvent.change(confirmPasswordInput, { target: { value: 'test123' } });
        fireEvent.click(screen.getByText('Change Password'));
    });
    test('Should handle empty password fields', () => {
        const { getByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ResetPasswordForm />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.click(screen.getByText('Change Password'));
    });
    test('Should handle password mismatch', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ResetPasswordForm />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter Current Password'), {
            target: { value: 'test123old' }
        });
        fireEvent.change(screen.getByPlaceholderText('Enter New Password'), {
            target: { value: 'test123' }
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), {
            target: { value: 'test124' }
        });
        fireEvent.click(screen.getByText('Change Password'));
        expect(screen.getByText('New and confirm password do not match')).toBeInTheDocument();
    });
    test('Should handle short password length', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ResetPasswordForm />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter New Password'), {
            target: { value: '123' }
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), {
            target: { value: '123' }
        });
        fireEvent.click(screen.getByText('Change Password'));
        expect(screen.getByText('Password should have 4 or more characters')).toBeInTheDocument();
    });
    test('Should handle short password length', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ResetPasswordForm />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter New Password'), {
            target: { value: '123' }
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), {
            target: { value: '123' }
        });
        fireEvent.click(screen.getByText('Change Password'));
        expect(screen.getByText('Password should have 4 or more characters')).toBeInTheDocument();
    });
});
