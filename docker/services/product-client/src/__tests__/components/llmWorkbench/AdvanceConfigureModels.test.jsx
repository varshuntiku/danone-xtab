import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store/store';
import { configureStore } from '@reduxjs/toolkit';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { vi } from 'vitest';
import {
    getAdvancedModelConfig,
    updateFineTunedModelAdvanvcedConfig
} from '../../../services/llmWorkbench/llm-workbench';
import ConfigureModel from '../../../components/llmWorkbench/AdvanceConfigureModel';
vi.mock('services/llmWorkbench/llm-workbench');

const history = createMemoryHistory();
const renderWithProviders = (ui, { store } = {}) => {
    return render(
        <Provider store={store}>
            <CustomThemeContextProvider>
                <Router history={history}>{ui}</Router>
            </CustomThemeContextProvider>
        </Provider>
    );
};

describe('ConfigureModel component', () => {
    beforeEach(() => {
        getAdvancedModelConfig.mockResolvedValue({
            data: {
                training_methods: [
                    { id: 'method1', label: 'Method 1', configuration: [] },
                    { id: 'method2', label: 'Method 2', configuration: [] }
                ],
                common: [],
                virtual_machine: { options: [{ id: 'vm1', label: 'VM 1' }] }
            }
        });
        updateFineTunedModelAdvanvcedConfig.mockResolvedValue({});
    });

    test('should load and display model configuration', async () => {
        renderWithProviders(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ConfigureModel
                            action={{ next: vi.fn(), previous: vi.fn() }}
                            classes={{}}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>,
            { store }
        );

        await waitFor(() => {
            expect(screen.getByText('Advanced Configuration')).toBeInTheDocument();
        });

        expect(screen.getByText('Training Method *')).toBeInTheDocument();
        expect(screen.getByText('Method 1')).toBeInTheDocument();
    });

    test('should handle next action with valid inputs', async () => {
        const nextMock = vi.fn();
        renderWithProviders(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ConfigureModel
                            action={{ next: nextMock, previous: vi.fn() }}
                            classes={{}}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>,
            { store }
        );

        await waitFor(() => {
            expect(screen.getByText('Training Method *')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            expect(updateFineTunedModelAdvanvcedConfig).not.toHaveBeenCalled();
        });
    });

    test('should show error when required fields are missing', async () => {
        getAdvancedModelConfig.mockResolvedValueOnce({
            data: {
                training_methods: [
                    {
                        id: 'method1',
                        label: 'Method 1',
                        configuration: [{ id: 'config1', label: 'Config 1', required: true }]
                    }
                ],
                common: [],
                virtual_machine: { options: [{ id: 'vm1', label: 'VM 1' }] }
            }
        });

        renderWithProviders(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ConfigureModel
                            action={{ next: vi.fn(), previous: vi.fn() }}
                            classes={{}}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>,
            { store }
        );

        await waitFor(() => {
            expect(screen.getByText('VM 1')).toBeInTheDocument();
        });
    });
});
