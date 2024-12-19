import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import VerifyCodeForm from '../../../components/Forms/VerifyCodeForm';
import { validateOtp, createVerificationCode } from '../../../services/passwordManager';

vi.mock('../../../services/passwordManager', () => ({
    validateOtp: vi.fn(),
    createVerificationCode: vi.fn()
}));

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render VerifyCodeForm Component', () => {
        const { getByText, getByTestId } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <VerifyCodeForm />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Verify your code')).toBeInTheDocument();
    });
    test('Should show error if OTP length is incorrect on submission', async () => {
        const { getByText, getByTestId } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <VerifyCodeForm />
                </Router>
            </CustomThemeContextProvider>
        );
        const verifyButton = screen.getByLabelText('Verify Code');
        fireEvent.click(verifyButton);
        expect(
            await screen.findByText(
                'A verification code has been shared to your email. Please provide it to proceed further.'
            )
        ).toBeInTheDocument();
    });
    test('Should show error if OTP length is incorrect on submission', async () => {
        const { getByText, getByTestId } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <VerifyCodeForm />
                </Router>
            </CustomThemeContextProvider>
        );
        const verifyButton = screen.getByLabelText('Verify Code');
        fireEvent.click(verifyButton);
        expect(await screen.findByText('Did not recieve code')).toBeInTheDocument();
    });
    test('Should update OTP input value', () => {
        const { getByText, getByTestId } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <VerifyCodeForm />
                </Router>
            </CustomThemeContextProvider>
        );
        const otpInputs = screen.getAllByRole('textbox');
        expect(otpInputs).toHaveLength(6);
        otpInputs.forEach((input, index) => {
            fireEvent.change(input, { target: { value: String(index + 1) } });
            expect(input).toHaveValue(String(index + 1));
        });
    });
    test('Should update timeOver state on timer finish', () => {
        const { getByText, getByTestId } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <VerifyCodeForm />
                </Router>
            </CustomThemeContextProvider>
        );
        const timerElement = screen.getByText(/This page will timeout after/);
        fireEvent.click(timerElement);
        expect(screen.getByText('Resend Code?')).not.toBeDisabled();
    });

    test('Should enable the Verify Code button when all OTP fields are filled', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <VerifyCodeForm />
                </Router>
            </CustomThemeContextProvider>
        );
        const otpFields = screen.getAllByRole('textbox');
        const verifyButton = screen.getByRole('button', { name: /Verify Code/i });

        fireEvent.change(otpFields[0], { target: { value: '1' } });
        fireEvent.change(otpFields[1], { target: { value: '2' } });
        fireEvent.change(otpFields[2], { target: { value: '3' } });
        fireEvent.change(otpFields[3], { target: { value: '4' } });
        fireEvent.change(otpFields[4], { target: { value: '5' } });
        fireEvent.change(otpFields[5], { target: { value: '6' } });

        expect(verifyButton).not.toBeDisabled();
    });
    test('Should handle OTP validation error with attempts remaining', async () => {
        validateOtp.mockRejectedValue({
            response: {
                data: {
                    message: 'Invalid code',
                    attemptsLeft: 3
                }
            }
        });

        const { getByText, getByTestId } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <VerifyCodeForm />
                </Router>
            </CustomThemeContextProvider>
        );
        const otpFields = screen.getAllByRole('textbox');
        otpFields.forEach((field, index) => {
            fireEvent.change(field, { target: { value: String(index + 1) } });
        });

        fireEvent.click(screen.getByRole('button', { name: /Verify Code/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid code')).toBeInTheDocument();
            expect(screen.getByText('3 attempt(s) remaining')).toBeInTheDocument();
        });
    });
});
