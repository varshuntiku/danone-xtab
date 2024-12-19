import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import FullScreenMessage from '../../../components/Admin/FullScreenMessage';
import { Provider } from 'react-redux';
import store from 'store/store';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts ObjectivesDashboard Component', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <FullScreenMessage
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1, blueprint_link: 'test/test/test123' }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
});
