import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { expect, vi } from 'vitest';

import { Provider } from 'react-redux';
import store from 'store/store';
import TypingAnimation from '../../components/TypingAnimation.jsx';

const history = createMemoryHistory();

vi.mock('@material-ui/core', () => ({
    alpha: (color, alpha) => `${color}${alpha}`,
    makeStyles: (styles) => () => styles({ palette: { text: { default: '#000' } } })
}));

describe('TypingAnimation Component', () => {
    it('should render correctly with the default props', () => {
        const history = createMemoryHistory();

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <TypingAnimation text="Hello, world!" speed="medium" enableCaret={false} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.queryByText('Hello, world!')).not.toBeInTheDocument();
    });
    it('should animate the text correctly', async () => {
        const history = createMemoryHistory();

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <TypingAnimation text="Hello" speed="fast" enableCaret={false} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        await waitFor(
            () => {
                expect(screen.getByText('Hello')).toBeInTheDocument();
            },
            { timeout: 2000 }
        );
    });

    it('should display the caret when enableCaret is true', async () => {
        const history = createMemoryHistory();

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <TypingAnimation text="Hello" speed="medium" enableCaret={true} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('H')).toBeInTheDocument();
        });

        expect(screen.getByTestId('caret')).toBeInTheDocument();
    });

    it('should not display the caret when enableCaret is false', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <TypingAnimation text="Hello" speed="medium" enableCaret={false} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('H')).toBeInTheDocument();
        });

        expect(screen.queryByRole('presentation')).toBeNull();
    });
});
