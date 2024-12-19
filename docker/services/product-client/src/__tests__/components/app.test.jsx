import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import App from '../../components/App';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { getApp, create_slug } from '../../services/app';
import { Provider } from 'react-redux';
import store from 'store/store';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../services/app', () => ({
    getApp: vi.fn(),
    create_slug: vi.fn()
    // (screen_name) => {
    //   if (!screen_name) {
    //     return false;
    //   }

    //   return encodeURIComponent(screen_name.trim().replace('&', '').replace('/', '').replace('\\', '').replace(/ {2}/g, ' ').replace(/ /g,'-').toLowerCase());
    // }
}));

// vi.mock('../../components/CreateStoriesActionPanel', ()=> (props)=>{
//   return(
//       <>
//           CreateStoriesActionPanel Mock component
//       </>
//   )
// })

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render without APP ID Component', () => {
        const location = { pathname: '/app/26' };
        const match = {
            params: {}
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <App location={location} match={match} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render APP ID Component', () => {
        const location = { pathname: '/app/49/' };
        const match = {
            params: {
                app_id: 49
            }
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <App location={location} match={match} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test("Should render 'We couldn’t find this page'", () => {
        const location = { pathname: '/app/26' };
        const match = {
            params: {
                app_id: 26
            }
        };
        const onResponseGetApp = vi.fn();
        onResponseGetApp.mockResolvedValueOnce({});
        getApp.mockImplementation(({ callback }) => callback({ status: 'error' }));
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <App location={location} match={match} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('oops', { exact: false })).toBeInTheDocument();
    });
});
