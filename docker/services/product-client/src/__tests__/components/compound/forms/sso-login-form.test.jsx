import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import LoginFormSSO from '../../../../components/compound/forms/login/sso-login-form';
import { AuthContext } from 'auth/AuthContext';

const history = createMemoryHistory();

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

describe('Codex Product test', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage
        });
    });
    afterEach(cleanup);

    test('Should render layouts LoginFormSSO Component', () => {
        const { getByText, debug } = render(
            <AuthContext.Provider value={{ login: () => {} }}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <LoginFormSSO {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </AuthContext.Provider>
        );
        expect(screen.getByRole('button', { name: 'Login with Microsoft' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Login with Microsoft' }));
    });
});

const Props = {
    classes: {},
    selected_industry: false
};
