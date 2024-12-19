import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import AppWidgetPreLoader from '../../components/AppWidgetPreLoader';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render AppWidgetPreLoader Component', () => {
        const props = {
            params: {
                preLoader: {
                    type: 'popup-confirmation',
                    message: 'test message',
                    triggerButton: {
                        name: 'test open'
                    },
                    popup: {
                        header: 'test header',
                        closeButton: true,
                        content: 'test content',
                        contentActions: [{ name: 'test content actions' }],
                        actions: [{ name: 'test actions', closePopup: true }]
                    }
                }
            },
            onAction: () => {}
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetPreLoader {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByRole('button', { name: 'test open' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'test open' }));
        fireEvent.click(screen.getByRole('button', { name: 'test content actions' }));
        fireEvent.click(screen.getByRole('button', { name: 'test actions' }));
    });
    test('Should render AppWidgetPreLoader 1 Component', () => {
        const props = {
            params: {
                preLoader: {}
            },
            onAction: () => {}
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetPreLoader {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});
