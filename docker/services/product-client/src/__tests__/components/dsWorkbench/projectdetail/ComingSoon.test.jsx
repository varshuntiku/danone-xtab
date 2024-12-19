import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { expect, vi } from 'vitest';
import ComingSoon from '../../../../components/dsWorkbench/projectDetail/ComingSoon';
import { Provider } from 'react-redux';
import store from 'store/store';
import { Router } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import '@testing-library/jest-dom/extend-expect';
import comingSoonBgLight from '../../../../assets/img/AskNuclios_LightBg.png';
import comingSoonBgDark from '../../../../assets/img/AskNuclios_DarkBg.png';

const lightTheme = createTheme({
    props: { mode: 'light' },
    palette: {
        border: { LoginInpBorder: '#dcdcdc' },
        text: { revamp: '#000000' }
    },
    typography: {
        h1: {
            fontWeight: 700,
            fontFamily: 'Arial'
        }
    }
});

const darkTheme = createTheme({
    props: { mode: 'dark' },
    palette: {
        border: { LoginInpBorder: '#555555' },
        text: { revamp: '#ffffff' }
    },
    typography: {
        h1: {
            fontWeight: 700,
            fontFamily: 'Arial'
        }
    }
});

describe('ComingSoon Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders correctly with light theme', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <ThemeProvider theme={lightTheme}>
                        <Router history={createMemoryHistory()}>
                            <ComingSoon />
                        </Router>
                    </ThemeProvider>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('Coming Soon')).toBeInTheDocument();

        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', expect.stringContaining('coming_soon_bg_light.png'));
    });

    test('renders correctly with dark theme', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <ThemeProvider theme={darkTheme}>
                        <Router history={createMemoryHistory()}>
                            <ComingSoon />
                        </Router>
                    </ThemeProvider>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('Coming Soon')).toBeInTheDocument();

        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', expect.stringContaining('coming_soon_bg_dark.png'));
    });

    test('applies correct styles based on light theme', () => {
        const { container } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <ThemeProvider theme={lightTheme}>
                        <Router history={createMemoryHistory()}>
                            <ComingSoon />
                        </Router>
                    </ThemeProvider>
                </CustomThemeContextProvider>
            </Provider>
        );

        const rootDiv = container.querySelector('div');
        expect(rootDiv).toHaveStyle(`background-image: url(${comingSoonBgLight})`);
    });

    test('applies correct styles based on dark theme', () => {
        const { container } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <ThemeProvider theme={darkTheme}>
                        <Router history={createMemoryHistory()}>
                            <ComingSoon />
                        </Router>
                    </ThemeProvider>
                </CustomThemeContextProvider>
            </Provider>
        );

        const rootDiv = container.querySelector('div');
        expect(rootDiv).toHaveStyle(`background-image: url(${comingSoonBgDark})`);
    });
});
