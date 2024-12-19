import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from 'themes/customThemeContext';
import { getAppLogo } from 'services/app';
import LoginPage from 'pages/login/login-page';
import { vi } from 'vitest';

const history = createMemoryHistory();
vi.mock('../../services/app', () => ({
    getAppLogo: vi.fn()
}));

const mockLocalStorage = (function () {
    let store = {};

    return {
        getItem: function (key) {
            return store[key] || null;
        },
        setItem: function (key, value) {
            store[key] = value.toString();
        },
        removeItem: function (key) {
            delete store[key];
        },
        clear: function () {
            store = {};
        }
    };
})();

describe('Login Page Component', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage
        });
    });
    afterEach(cleanup);
    test('Should render LoginPage Component', () => {
        const match = {
            params: {
                industry: false,
                app_id: 26,
                logout: false
            }
        };
        getAppLogo.mockImplementation(({ callback }) =>
            callback({ logo_url: 'https://testing_logo_url.com' })
        );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <LoginPage match={match} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render LoginPage1 Component', () => {
        const match = {
            params: {
                industry: false,
                app_id: false,
                logout: true
            }
        };
        getAppLogo.mockImplementation(({ callback }) =>
            callback({ logo_url: 'https://testing_logo_url.com' })
        );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <LoginPage match={match} logout={true} parent_obj={{ onLogout: () => {} }} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});
