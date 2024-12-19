import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import UserActions from '../../../components/Admin/UserActions';
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
                        <UserActions
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1, blueprint_link: 'test/test/test123' }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByTitle('Manage User'));

        expect(screen.getByLabelText('Email ID *')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Save'));
    });

    test('Should render layouts ObjectivesDashboard Component', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserActions
                            user={{ user_roles: [1, 2, 3, 4] }}
                            screen_id={1}
                            app_id={1}
                            params={{}}
                            app_info={{ id: 1, blueprint_link: 'test/test/test123' }}
                            createNewUser={true}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByText('Create New'));
        fireEvent.click(screen.getByTitle('Close'));
        fireEvent.click(screen.getByText('Create New'));
        fireEvent.change(screen.getByLabelText('Last Name *'), { target: { value: 'test name' } });
        fireEvent.change(screen.getByLabelText('First Name *'), { target: { value: 'test name' } });

        fireEvent.click(screen.getByText('Save'));
    });
    test('Should render CustomSnackbar with correct props', () => {
        const props = {
            open: true,
            message: 'Test message',
            autoHideDuration: 2000,
            onClose: vi.fn(),
            severity: 'success'
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UserActions {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
});
