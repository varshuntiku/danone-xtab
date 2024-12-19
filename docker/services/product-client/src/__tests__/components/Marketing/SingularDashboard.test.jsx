import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { Provider } from 'react-redux';
import store from 'store/store';
import { createMemoryHistory } from 'history';
import SingularDashboard from '../../../components/Marketing/SingularDashboard.jsx';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts SingularDashboard Component', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <SingularDashboard history={history} {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByLabelText('list')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('list'));
    });
    test('Should render layouts SingularDashboard Component 1', () => {
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <SingularDashboard history={history} {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByLabelText('list')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('list'));
        fireEvent.click(screen.getByLabelText('grid'));
        fireEvent.click(screen.getByLabelText('position-top'));
    });
    test('Should render and handle grid and list view toggles', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <SingularDashboard history={history} {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByLabelText('grid')).toHaveClass('MuiButton-contained');
        expect(screen.queryByLabelText('list')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('list'));
        expect(screen.getByLabelText('list')).toHaveClass('MuiButton-contained');
        expect(screen.queryByLabelText('grid')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('grid'));
        expect(screen.getByLabelText('grid')).toHaveClass('MuiButton-contained');
        expect(screen.queryByLabelText('list')).toBeInTheDocument();
    });
});

const Props = {
    classes: {},
    apps: [
        {
            id: 1,
            app_link: true,
            name: 'test app 1',
            description: 'test description',
            function: 'Supply Chain'
            //function:['Finance & Procurement', 'Supply Chain', 'Pricing', 'Marketing'],
        }
    ],
    functions: [
        {
            id: 1,
            function_name: 'Supply Chain'
        },
        {
            id: 2,
            function_name: 'test'
        },
        {
            id: 3,
            function_name: 'test2'
        },
        {
            id: 4,
            function_name: 'test3'
        }
    ]
};
