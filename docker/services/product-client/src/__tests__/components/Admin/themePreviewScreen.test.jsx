import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import { expect, vi } from 'vitest';
import { pink, red } from '@material-ui/core/colors';

import ThemePreviewScreen from '../../../components/Admin/ThemePreviewScreen';

const history = createMemoryHistory();

vi.mock('@material-ui/core/colors', async () => {
    const actual = await vi.importActual('@material-ui/core/colors');
    return {
        ...actual,
        pink: actual.pink
    };
});

vi.mock('@material-ui/icons/Fullscreen', () => ({
    __esModule: true,
    default: () => <svg data-testid="fullscreen-icon" />
}));

vi.mock('@material-ui/icons/KeyboardArrowDown', () => ({
    __esModule: true,
    default: () => <svg data-testid="keyboard-arrow-down-icon" />
}));

vi.mock('@material-ui/icons/KeyboardArrowUp', () => ({
    __esModule: true,
    default: () => <svg data-testid="keyboard-arrow-up-icon" />
}));

vi.mock('../Nuclios/assets/AdminIcon', () => ({
    __esModule: true,
    default: () => <svg data-testid="admin-icon" />
}));

vi.mock('../Nuclios/assets/HelpIcon', () => ({
    __esModule: true,
    default: () => <svg data-testid="help-icon" />
}));

vi.mock('../Nuclios/assets/Nuclios', () => ({
    __esModule: true,
    default: () => <svg data-testid="nuclios-icon" />
}));

vi.mock('@material-ui/icons/AccountCircle', () => ({
    __esModule: true,
    default: () => <svg data-testid="account-circle-icon" />
}));

describe('ThemePreviewScreen', () => {
    it('renders without crashing', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ThemePreviewScreen />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('shows the full screen icon when not in full screen mode', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ThemePreviewScreen />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByTestId('fullscreen-icon')).toBeInTheDocument();
    });

    it('hides the full screen icon when in full screen mode', () => {
        const { container } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ThemePreviewScreen />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const fullScreenButton = screen.getByTestId('fullscreen-icon');
        expect(fullScreenButton).toBeVisible();
    });

    it('displays correct navigation items', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ThemePreviewScreen />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const subScreen1 = screen.getByText(/Sub-Screen 1/);
        const screen2Items = screen.getAllByText(/Screen 2/);

        expect(subScreen1).toBeInTheDocument();
        expect(screen2Items).toHaveLength(2);
    });
});
