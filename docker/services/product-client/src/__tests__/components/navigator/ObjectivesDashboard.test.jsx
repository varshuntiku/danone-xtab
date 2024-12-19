import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ObjectivesDashboard from '../../../components/navigator/ObjectivesDashboard';
import store from 'store/store';
import { Provider } from 'react-redux';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts ObjectivesDashboard Component', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ObjectivesDashboard
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1 }}
                            app_info="testinfo"
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
});
