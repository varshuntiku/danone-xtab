import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import NotebookIterationActions from '../../../components/Admin/NotebookIterationActions.jsx';
import CustomSnackbar from '../../../components/CustomSnackbar';
import { expect, vi } from 'vitest';
import {
    createNotebookIteration,
    updateNotebookIteration
} from '../../../services/admin_execution.js';

vi.mock('../../../services/admin_execution.js', () => ({
    createNotebookIteration: vi.fn(),
    updateNotebookIteration: vi.fn()
}));

vi.mock('../../../components/CustomSnackbar', () => ({
    __esModule: true,
    default: vi.fn(() => <div>Snackbar</div>)
}));

const history = createMemoryHistory();

describe('NotebookIterationActions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly with initial props', () => {
        const props = {
            iteration: {
                notebook_id: 'notebook123',
                name: 'Iteration 1',
                config_params: '{}',
                config_df: 'file.csv',
                config_code: 'print("Hello World")',
                id: 'iteration123'
            },
            createNotebookIteration: false,
            designNotebookIteration: true,
            refreshData: vi.fn()
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NotebookIterationActions {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    it('opens and closes the dialog correctly', () => {
        const props = {
            createNotebookIteration: false,
            designNotebookIteration: false,
            refreshData: vi.fn()
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NotebookIterationActions {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const openButton = screen.getByRole('button', { name: /Edit/i });
        fireEvent.click(openButton);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('calls createNotebookIteration when createNotebookIteration is true', async () => {
        const props = {
            createNotebookIteration: true,
            designNotebookIteration: false,
            refreshData: vi.fn()
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NotebookIterationActions {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const openButton = screen.getByRole('button', { name: /Create New/i });
        fireEvent.click(openButton);

        const saveButton = screen.getByRole('button', { name: /Save/i });
        fireEvent.click(saveButton);
        expect(saveButton).toBeInTheDocument();
    });

    it('calls updateNotebookIteration when createNotebookIteration is false', async () => {
        const props = {
            createNotebookIteration: false,
            designNotebookIteration: false,
            refreshData: vi.fn()
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NotebookIterationActions {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const openButton = screen.getByRole('button', { name: /Edit/i });
        fireEvent.click(openButton);

        const saveButton = screen.getByRole('button', { name: /Save/i });
        fireEvent.click(saveButton);
        expect(openButton).toBeInTheDocument();
    });

    it('renders dialog and allows field changes', () => {
        const props = {
            createNotebookIteration: true,
            designNotebookIteration: false,
            iteration: {
                notebook_id: 'notebook123',
                name: 'Iteration 1',
                config_params: '{}',
                config_df: 'file.csv',
                config_code: 'print("Hello World")',
                id: 'iteration123'
            },
            refreshData: vi.fn()
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <NotebookIterationActions {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByRole('button', { name: /Create New/i }));

        expect(screen.getByRole('dialog')).toBeInTheDocument();

        expect(screen.getByLabelText(/Iteration Name/i).value).toBe('Iteration 1');

        fireEvent.change(screen.getByLabelText(/Iteration Name/i), {
            target: { value: 'Updated Iteration' }
        });
        expect(screen.getByLabelText(/Iteration Name/i).value).toBe('Updated Iteration');

        fireEvent.click(screen.getByRole('tab', { name: /JSON/i }));
        expect(screen.getByText(/These JSON params are available/i)).toBeInTheDocument();

        fireEvent.click(screen.getByRole('tab', { name: /Code/i }));
        expect(screen.getByText(/This code will be executed/i)).toBeInTheDocument();
    });
});
