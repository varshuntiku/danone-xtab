import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { expect, vi } from 'vitest';
import ConfigureDevelop from '../../../../components/dsWorkbench/projectDetail/ConfigureDevelop';
import { Provider } from 'react-redux';
import store from 'store/store';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import '@testing-library/jest-dom/extend-expect';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { getJpHubToken } from '../../../../services/project.js';

const history = createMemoryHistory();

vi.mock('../../../../services/project', () => ({
    getJpHubToken: vi.fn()
}));

vi.mock('../../../../components/CodxCircularLoader', () => ({
    default: () => <div data-testid="circularload"></div>
}));
vi.mock('../../../../components/CustomSnackbar', () => ({
    default: ({ open, onClose, message, severity }) =>
        open ? (
            <div data-testid="snackbar" role="alert">
                {message}
            </div>
        ) : null
}));

import.meta.env = {
    REACT_APP_JPHUB_URL: 'http://localhost:8000'
};

const lightTheme = createTheme({
    props: { mode: 'light' },
    palette: {
        text: { default: '#000000' }
    },
    typography: {
        title: {
            h1: {
                fontWeight: 700,
                fontFamily: 'Arial'
            }
        },
        body: {
            B1: {
                fontFamily: 'Arial'
            }
        }
    }
});

describe('ConfigureDevelop Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders with instructions initially', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <ThemeProvider theme={lightTheme}>
                        <ConfigureDevelop projectId={1} />
                    </ThemeProvider>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('Instructions')).toBeInTheDocument();
        expect(screen.getByText(/Please use Google Chrome or Microsoft Edge/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Load JupyterLab' })).toBeInTheDocument();
    });

    test('shows loader when loading and hides instructions', async () => {
        getJpHubToken.mockResolvedValueOnce({ token: 'mockToken' });

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <ThemeProvider theme={lightTheme}>
                        <ConfigureDevelop projectId={1} />
                    </ThemeProvider>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Load JupyterLab' }));

        expect(screen.queryByText('Instructions')).not.toBeInTheDocument();
        expect(screen.getByTestId('circularload')).toBeInTheDocument();
    });

    test('shows snackbar on token fetch error', async () => {
        getJpHubToken.mockRejectedValueOnce(new Error('Failed to load'));

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <ThemeProvider theme={lightTheme}>
                        <ConfigureDevelop projectId={1} />
                    </ThemeProvider>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Load JupyterLab' }));

        await waitFor(() => {
            expect(screen.getByTestId('snackbar')).toBeInTheDocument();
            expect(screen.getByTestId('snackbar')).toHaveTextContent('Failed to load. Try again.');
        });
    });
});
