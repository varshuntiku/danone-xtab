import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AppLogin from '../../components/AppLogin';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { getApp } from '../../services/app';
import { vi } from 'vitest';

vi.mock('../../services/app', () => ({
    getApp: vi.fn()
}));

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render APPLogin Component', () => {
        const location = { pathname: '/app/26' };
        const match = {
            params: {
                app_id: 26
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppLogin location={location} match={match} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render APP ID Component', () => {
        const location = { pathname: '/app/49/' };
        const match = {
            params: {
                app_id: false
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppLogin location={location} match={match} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render APP ID Component 1', () => {
        const location = { pathname: '/app/26' };
        const match = {
            params: {
                app_id: 26
            }
        };
        getApp.mockImplementation(({ callback }) => callback({ logo_url: '/test_logo_url' }));
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppLogin location={location} match={match} classes={{}} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});
