import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store/store';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { vi } from 'vitest';
import ConfigureModel from '../../../components/llmWorkbench/ConfigureLLMModel';

const history = createMemoryHistory();

const mockAction = {
    next: vi.fn(),
    previous: vi.fn()
};

vi.mock('store/store', async () => {
    const actual = await vi.importActual('store/store');
    return {
        ...actual,
        setActiveDeployedModel: vi.fn()
    };
});

const renderWithProviders = (ui, { route = '/', matchParams = {} } = {}) => {
    const history = createMemoryHistory({ initialEntries: [route] });

    const defaultProps = {
        match: { params: matchParams }
    };

    return render(
        <Provider store={store}>
            <CustomThemeContextProvider>
                <Router history={history}>{React.cloneElement(ui, defaultProps)}</Router>
            </CustomThemeContextProvider>
        </Provider>
    );
};

describe('ConfigureModel Component', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    test('should render correctly and display UI elements', () => {
        renderWithProviders(<ConfigureModel action={mockAction} />, {
            matchParams: { id: '1', experiment_id: '123', checkpoint_name: 'checkpoint-1' }
        });

        expect(screen.getByText(/Configure Model/i)).toBeInTheDocument();
        expect(screen.getByText(/Name\*/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Eg: my-model/i)).toBeInTheDocument();
        expect(screen.getByText(/Add Description/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
    });

    test('should update the model name and description on user input', () => {
        renderWithProviders(<ConfigureModel action={mockAction} />, {
            matchParams: { id: '1', experiment_id: '123', checkpoint_name: 'checkpoint-1' }
        });

        const nameInput = screen.getByTestId('model-name');
        const descriptionInput = screen.getByTestId('model-description');

        fireEvent.change(nameInput, { target: { value: 'my-new-model' } });
        fireEvent.change(descriptionInput, { target: { value: 'This is a description' } });

        expect(nameInput.value).toBe('my-new-model');
        expect(descriptionInput.value).toBe('This is a description');
    });

    test('should handle the back button click correctly', () => {
        renderWithProviders(<ConfigureModel action={mockAction} />, {
            matchParams: { id: '1', experiment_id: '123', checkpoint_name: 'checkpoint-1' }
        });

        const backButton = screen.getByRole('button', { name: /Back/i });

        fireEvent.click(backButton);

        expect(mockAction.previous).toHaveBeenCalled();
    });

    test('should disable fields when isDeployed is true', () => {
        renderWithProviders(<ConfigureModel action={mockAction} isDeployed={true} />, {
            matchParams: { id: '1', experiment_id: '123', checkpoint_name: 'checkpoint-1' }
        });

        const nameInput = screen.getByTestId('model-name');
        const descriptionInput = screen.getByTestId('model-description');

        expect(nameInput).toBeDisabled();
        expect(descriptionInput).toBeDisabled();
    });
});
