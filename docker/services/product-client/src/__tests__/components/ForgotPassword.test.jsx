import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import ForgotPassword from '../../components/ForgotPassword';
import httpClient from '../../services/httpClient';
import { createVerificationCode, validateOtp, updatePassword } from 'services/passwordManager';
import { vi } from 'vitest';

vi.mock('../../services/passwordManager', () => ({
    createVerificationCode: vi.fn(),
    validateOtp: vi.fn(),
    updatePassword: vi.fn()
}));

const history = createMemoryHistory();

const props = {
    history: {
        goBack: () => {}
    }
};

describe('MainLogin Component', () => {
    afterEach(cleanup);

    test('Should render ForgotPassword Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ForgotPassword {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    });

    test('Should render ForgotPasswordEmailForm, VerifiyCodeForm and RestPasswordForm Components', async () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ForgotPassword {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        createVerificationCode.mockImplementation(() => ({
            headers: {
                userid: 1
            }
        }));
        expect(screen.getByText('Forgot Password')).toBeInTheDocument();
        const emailInput = screen.getByPlaceholderText('example@domain.com');
        fireEvent.change(emailInput, { target: { value: 'test@mail.com' } });
        let button = screen.getByRole('button', {
            name: 'Send verification code'
        });
        fireEvent.click(button);
        await new Promise((r) => setTimeout(r, 1000));

        validateOtp.mockImplementation(() => ({
            headers: {
                password_token: 'abcdefghijklmnopqrstuvwxyz'
            }
        }));
        expect(screen.getByText('Verify your code')).toBeInTheDocument();
        const otpInput = screen.queryByLabelText('otp_container').firstChild;
        fireEvent.paste(otpInput, {
            clipboardData: {
                getData: () => '123456'
            }
        });
        button = screen.getByRole('button', { name: 'Verify Code' });
        fireEvent.click(button);
        await new Promise((r) => setTimeout(r, 1000));

        updatePassword.mockImplementation(() => ({
            data: {
                message: 'Success'
            }
        }));
        const newPassword = screen.getByPlaceholderText('Enter New Password');
        const confirmPassword = screen.getByPlaceholderText('Confirm New Password');
        fireEvent.change(newPassword, { target: { value: 'Test123*' } });
        fireEvent.change(confirmPassword, { target: { value: 'Test123*' } });
        button = screen.getByRole('button', {
            name: 'Reset Password'
        });
        fireEvent.click(button);
        await new Promise((r) => setTimeout(r, 1000));
        expect(screen.getByText('Success')).toBeInTheDocument();
    });
});
