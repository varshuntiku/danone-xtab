import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import CodxProducts from '../../components/CodxProducts';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import {
    verifyAuth,
    getUserAppId,
    getUserSpecialAccess,
    setAutoRefreshActionToken
} from '../../services/auth';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../services/auth', () => ({
    verifyAuth: vi.fn(),
    getUserAppId: vi.fn(),
    getUserSpecialAccess: vi.fn(),
    setAutoRefreshActionToken: vi.fn()
}));

vi.mock('../../components/Dashboard', () => {
    return { default: (props) => <div>Mocked Dashboard Component</div> };
});
vi.mock('../../layouts/Reports', () => {
    return { default: (props) => <div>Mocked Reports Layout</div> };
});
vi.mock('../../components/App', () => {
    return { default: (props) => <div>Mocked App Component</div> };
});
vi.mock('../../components/Utils/UtilsDashboard', () => {
    return { default: (props) => <div>Mocked Utils Dashboard Component</div> };
});
vi.mock('../../pages/login/login-page', () => {
    return { default: (props) => <div>Mocked login page Component</div> };
});
vi.mock('../../components/Footer', () => {
    return { default: (props) => <div>Mocked Footer Component</div> };
});
vi.mock('../../components/LinearProgressBar', () => {
    return { default: (props) => <div>Mocked LinearProgressBar Component</div> };
});

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render Codex Product Component', () => {
        verifyAuth.mockImplementation(({ callback }) => callback({ status: 'failed' }));
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxProducts />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render Codex Product1 Component', () => {
        verifyAuth.mockImplementation(({ callback }) => callback({ status: 'success' }));
        getUserSpecialAccess.mockImplementation(({ callback }) =>
            callback({ special_access_urls: ['/app/26'] })
        );
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxProducts history={history} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render Codex Product2 Component', () => {
        verifyAuth.mockImplementation(({ callback }) => callback({ status: 'success' }));
        getUserSpecialAccess.mockImplementation(({ callback }) =>
            callback({ special_access_urls: ['/app/26'] })
        );
        window.history.pushState({}, '', '/login/app');
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxProducts history={history} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render Codex Product3 Component', () => {
        verifyAuth.mockImplementation(({ callback }) =>
            callback({ status: 'success', is_restricted_user: true })
        );
        getUserAppId.mockImplementation(({ callback }) => callback({ status: 'failed' }));
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxProducts />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render Codex Product4 Component', () => {
        verifyAuth.mockImplementation(({ callback }) =>
            callback({ status: 'success', is_restricted_user: true })
        );
        getUserAppId.mockImplementation(({ callback }) =>
            callback({ status: 'success', app_id: [26], landing_url: '/app/26/' })
        );
        window.history.pushState({}, '', '/login');
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxProducts history={history} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render Codex Product5 Component', () => {
        verifyAuth.mockImplementation(({ callback }) =>
            callback({ status: 'success', is_restricted_user: true })
        );
        getUserAppId.mockImplementation(({ callback }) =>
            callback({ status: 'success', app_id: 26 })
        );
        window.history.pushState({}, '', '/login');
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxProducts history={history} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render Codex Product6 Component', () => {
        verifyAuth.mockImplementation(({ callback }) => callback({ status: 'failed' }));
        history.push('/login/CPG');
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxProducts history={history} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render Codex Product7 Component', () => {
        verifyAuth.mockImplementation(({ callback }) => callback({ status: 'failed' }));
        history.push('/login/app/26');
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxProducts history={history} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render Codex Product8 Component', () => {
        verifyAuth.mockImplementation(({ callback }) => callback({ status: 'failed' }));
        history.push('/login');
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxProducts history={history} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    // test('Should render Codex Product Component', () => {
    //   verifyAuth.mockImplementation(({ callback }) => callback({ status: 'success', is_restricted_user: false }))
    //   getUserSpecialAccess.mockImplementation(({ callback }) => callback({ special_access_urls: ['/dashboard/CPG'] }))
    //   //history.push('/CPG')
    //   const { getByText, debug } = render(
    //     <CustomThemeContextProvider>
    //       <Router history={history}>
    //         <CodxProducts history={history}/>
    //       </Router>
    //     </CustomThemeContextProvider>
    //   )
    // });
});
