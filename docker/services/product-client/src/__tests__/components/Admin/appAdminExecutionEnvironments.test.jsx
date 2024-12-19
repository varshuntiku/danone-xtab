import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ExecutionEnvironments from '../../../components/Admin/ExecutionEnvironments';
import AppAdminExecutionEnvironments from '../../../components/Admin/ExecutionEnvironments';
import { Provider } from 'react-redux';
import store from 'store/store';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts ObjectivesDashboard Component', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ExecutionEnvironments
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1 }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render AppAdminExecutionEnvironments component', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdminExecutionEnvironments app_info={{ id: 1 }} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(
            screen.getByText('Select an environment to run your application on')
        ).toBeInTheDocument();
    });

    test('Save Environment button should be disabled initially', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdminExecutionEnvironments app_info={{ id: 1 }} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const saveButton = screen.getByLabelText('Save Enivronment');
        expect(saveButton).toBeDisabled();
    });

    test('Should show a snackbar message when environment is updated', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppAdminExecutionEnvironments app_info={{ id: 1 }} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
});
