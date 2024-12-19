import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import AppScreenNavigate from '../../../../components/gridTable/cell-renderer/AppScreenNavigate';

const history = createMemoryHistory();

describe('AppScreenNavigate Component', () => {
    afterEach(cleanup);

    const paramsWithButton = {
        button: {
            variant: 'contained',
            size: 'medium',
            text: 'Navigate'
        },
        value: 'destination',
        filterState: {},
        hideFilter: false
    };

    const paramsWithLink = {
        link: true,
        title: 'Navigate',
        text: 'Click here',
        value: 'destination',
        color: 'contrast',
        filterState: {},
        hideFilter: false
    };

    const paramsWithIconButton = {
        value: 'destination',
        filterState: {},
        hideFilter: false
    };

    const renderComponent = (params) => {
        return render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenNavigate params={params} />
                </Router>
            </CustomThemeContextProvider>
        );
    };

    test('Should render Button', () => {
        renderComponent(paramsWithButton);
        const button = screen.getByRole('button', { name: /navigate/i });
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        expect(history.location.pathname).toBe('/app/undefined/destination');
    });

    test('Should render Link', () => {
        renderComponent(paramsWithLink);
        const link = screen.getByText(/click here/i);
        expect(link).toBeInTheDocument();
        fireEvent.click(link);
        expect(history.location.pathname).toBe('/app/undefined/destination');
    });

    test('Should render IconButton', () => {
        renderComponent(paramsWithIconButton);
        const iconButton = screen.getByRole('button');
        expect(iconButton).toBeInTheDocument();
        fireEvent.click(iconButton);
        expect(history.location.pathname).toBe('/app/undefined/destination');
    });
});
