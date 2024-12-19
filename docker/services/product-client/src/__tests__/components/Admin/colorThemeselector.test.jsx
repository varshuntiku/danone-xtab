import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { expect, vi } from 'vitest';
import ColorThemeSelector from '../../../components/Admin/ColorThemeSelector';
import { Provider } from 'react-redux';
import store from 'store/store';
import CustomThemeContextProvider from '../../../themes/customThemeContext';

const history = createMemoryHistory();

const mockThemes = [
    { id: '1', name: 'Light Theme', modes: [{ mode: 'light', contrast_color: '#FFFFFF' }] },
    { id: '2', name: 'Dark Theme', modes: [{ mode: 'dark', contrast_color: '#000000' }] }
];

const mockContextValue = {
    theme: { themeMode: 'light' },
    themeMode: 'light',
    Themes: mockThemes,
    getTheme: (mode, id) => ({
        theme: {
            palette: {
                primary: { light: '#000000' },
                text: { default: '#FFFFFF' },
                background: { hover: '#CCCCCC', selected: '#DDDDDD' }
            }
        },
        plotTheme: {}
    })
};

describe('ColorThemeSelector', () => {
    it('renders the component correctly', () => {
        const history = createMemoryHistory();

        render(
            <Provider store={store}>
                <CustomThemeContextProvider value={mockContextValue}>
                    <Router history={history}>
                        <ColorThemeSelector
                            appliedThemeId="1"
                            onNext={vi.fn()}
                            onApplyTheme={vi.fn()}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('Choose a color theme')).toBeInTheDocument();
    });

    it('selects a theme on click', () => {
        const history = createMemoryHistory();

        render(
            <Provider store={store}>
                <CustomThemeContextProvider value={mockContextValue}>
                    <Router history={history}>
                        <ColorThemeSelector
                            appliedThemeId="1"
                            onNext={vi.fn()}
                            onApplyTheme={vi.fn()}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const darkThemeOption = screen.getByText('NucliOS Default');
        fireEvent.click(darkThemeOption);

        expect(darkThemeOption).toHaveClass('MuiTypography-root');
    });

    it('calls onApplyTheme with selected theme id', () => {
        const history = createMemoryHistory();
        const onApplyTheme = vi.fn();

        render(
            <Provider store={store}>
                <CustomThemeContextProvider value={mockContextValue}>
                    <Router history={history}>
                        <ColorThemeSelector
                            appliedThemeId="1"
                            onNext={vi.fn()}
                            onApplyTheme={onApplyTheme}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByText('Apply Theme'));
        expect(onApplyTheme).toBeCalled();
    });

    it('calls onNext when the Next button is clicked', () => {
        const history = createMemoryHistory();
        const onNext = vi.fn();

        render(
            <Provider store={store}>
                <CustomThemeContextProvider value={mockContextValue}>
                    <Router history={history}>
                        <ColorThemeSelector
                            appliedThemeId="1"
                            onNext={onNext}
                            onApplyTheme={vi.fn()}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByText('Next'));
        expect(onNext).toHaveBeenCalled();
    });

    it('renders theme preview correctly', () => {
        const history = createMemoryHistory();

        render(
            <Provider store={store}>
                <CustomThemeContextProvider value={mockContextValue}>
                    <Router history={history}>
                        <ColorThemeSelector
                            appliedThemeId="1"
                            onNext={vi.fn()}
                            onApplyTheme={vi.fn()}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const previews = screen.getAllByTitle('light');
        expect(previews.length).toBeGreaterThan(0);
    });
});
