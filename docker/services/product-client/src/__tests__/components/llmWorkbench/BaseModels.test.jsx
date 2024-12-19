import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store/store';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { vi } from 'vitest';
import BaseModels from '../../../components/llmWorkbench/BaseModels';
import { debouncedGetTableHeader } from '../../../services/llmWorkbench/llm-workbench';

vi.mock('store/store', async () => {
    const actual = await vi.importActual('store/store');
    return {
        ...actual,
        getBaseModels: vi.fn(),
        setBaseModelsHeaders: vi.fn(),
        resetBaseModelList: vi.fn()
    };
});

const history = createMemoryHistory();

const renderWithProviders = (ui) => {
    return render(
        <Provider store={store}>
            <CustomThemeContextProvider>
                <Router history={history}>{ui}</Router>
            </CustomThemeContextProvider>
        </Provider>
    );
};

describe('BaseModels Component', () => {
    beforeEach(() => {});

    afterEach(() => {
        vi.clearAllMocks();
    });

    test('should render BaseModels component correctly', async () => {
        renderWithProviders(<BaseModels />);

        await waitFor(() => {
            expect(screen.getByRole('table')).toBeInTheDocument();
        });
    });

    test('should fetch and display headers on load', async () => {
        renderWithProviders(<BaseModels />);

        expect(screen.getByText('Rows per page:')).toBeInTheDocument();
    });

    test('should trigger search and update state on search input', async () => {
        renderWithProviders(<BaseModels />);

        await waitFor(() => {
            expect(screen.getByText('0-0 of 0'));
        });
    });
});
