import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import LoginFormEmail from '../../../components/Forms/LoginFormEmail';
import { login } from '../../../services/auth';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../../services/auth', () => ({
    login: vi.fn()
}));
const mockLocalStorage = (function () {
    let store = {};

    return {
        getItem: function (key) {
            return store[key] || null;
        },
        setItem: function (key, value) {
            store[key] = value ? value.toString() : null;
        },
        removeItem: function (key) {
            delete store[key];
        },
        clear: function () {
            store = {};
        }
    };
})();

describe('Codex Product test', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage
        });
    });
    afterEach(cleanup);

    test('Should render layouts LoginFormEmail Component', () => {
        login.mockImplementation(({ callback }) =>
            callback({ status: 'error', message: 'Wrong Credentials' })
        );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <LoginFormEmail {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByPlaceholderText('email.name@domain.com')).toBeInTheDocument();
        const emailInput = screen.getByPlaceholderText('email.name@domain.com');
        fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
        expect(screen.getByPlaceholderText('*********')).toBeInTheDocument();
        const passwordInput = screen.getByPlaceholderText('*********');
        fireEvent.change(passwordInput, { target: { value: 'test123' } });
        expect(screen.getByLabelText('password')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('password'));
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    });

    test('Should render layouts LoginFormEmail Component 1', () => {
        login.mockImplementation(({ callback }) =>
            callback({
                status: 'success',
                access_token: 'rand0mAcc35sT0k3n',
                refresh_token: 'rand0mR37r35hT0k3n',
                is_restricted_user: false
            })
        );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <LoginFormEmail {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByPlaceholderText('email.name@domain.com')).toBeInTheDocument();
        const emailInput = screen.getByPlaceholderText('email.name@domain.com');
        fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
        expect(screen.getByPlaceholderText('*********')).toBeInTheDocument();
        const passwordInput = screen.getByPlaceholderText('*********');
        fireEvent.change(passwordInput, { target: { value: 'test123' } });
        expect(screen.getByLabelText('password')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('password'));
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    });
});

const Props = {
    classes: {},
    parent_obj: {
        onLogin: () => {}
    }
};
