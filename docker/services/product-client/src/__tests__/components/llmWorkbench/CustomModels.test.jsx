import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store/store';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { vi } from 'vitest';
import CustomModels from '../../../components/llmWorkbench/CustomModels';
const history = createMemoryHistory();
vi.mock('@material-ui/icons/BackupOutlined', () => ({
    __esModule: true,
    default: vi.fn(() => <div data-testid="backup-icon" />)
}));

describe('CustomModels Component', () => {
    test('should render the component with all UI elements', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CustomModels />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText(/Upload Model/i)).toBeInTheDocument();
        expect(screen.getByTestId('backup-icon')).toBeInTheDocument();
        expect(screen.getByText(/Drag & drop a file or/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Browse/i })).toBeInTheDocument();
        expect(screen.getByText(/File_one/i)).toBeInTheDocument();
        expect(screen.getByText(/File_two/i)).toBeInTheDocument();
    });

    test('should trigger browse button click', () => {
        const mockOnClick = vi.fn();
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CustomModels />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const browseButton = screen.getByRole('button', { name: /Browse/i });

        browseButton.onclick = mockOnClick;
        fireEvent.click(browseButton);

        expect(mockOnClick).toHaveBeenCalled();
    });

    test('should handle file upload', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CustomModels />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const fileInput = screen.getByRole('heading', { name: /Upload Model/i });

        const file = new File(['sample'], 'sample.txt', { type: 'text/plain' });

        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(fileInput.files.length).toBe(1);
        expect(fileInput.files[0].name).toBe('sample.txt');
    });
});
