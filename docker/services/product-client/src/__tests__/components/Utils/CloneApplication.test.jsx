import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CloneApplication from '../../../components/Utils/CloneApplication';
import { Provider } from 'react-redux';
import store from 'store/store';
import { vi } from 'vitest';
import { cloneApplication } from 'services/app.js';

const history = createMemoryHistory();

vi.mock('services/app.js', () => ({
    cloneApplication: vi.fn()
}));

describe('CloneApplication testing', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should render CloneApplication component', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CloneApplication />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const buttonElement = screen.getByText('Clone Application');
        expect(buttonElement).toBeInTheDocument();
    });

    test('should render title for popup', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CloneApplication iconOnly />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const buttonElement = screen.getByTitle('clone application');
        expect(buttonElement).toBeInTheDocument();
    });

    test('should render inputs', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CloneApplication iconOnly />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const buttonElement = screen.getByTitle('clone application');
        fireEvent.click(buttonElement);

        await waitFor(() => {
            const appElement = screen.getByRole('button', { name: 'Save & Edit Application' });
            expect(appElement).toBeInTheDocument();
        });
    });

    test('should open the modal when the Clone Application button is clicked', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CloneApplication />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const buttonElement = screen.getByText('Clone Application');
        fireEvent.click(buttonElement);

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });
});
