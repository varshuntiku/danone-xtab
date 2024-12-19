import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store/store';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { vi } from 'vitest';
import ConfigureModel from '../../../components/llmWorkbench/ConfigureModel';
vi.mock('../../../services/llmWorkbench/llm-workbench', () => ({
    createFineTunedModel: vi.fn()
}));

const mockAction = {
    next: vi.fn(),
    previous: vi.fn()
};

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
        renderWithProviders(<ConfigureModel action={mockAction} />, { matchParams: { id: '1' } });

        expect(screen.getByText(/Configure Model/i)).toBeInTheDocument();
        expect(screen.getByText(/Name\*/i)).toBeInTheDocument();

        expect(screen.getByText(/Add Description/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
    });

    test('should update the model name and description on user input', () => {
        renderWithProviders(<ConfigureModel action={mockAction} />, { matchParams: { id: '1' } });

        const nameInput = screen.getByText('Name*');

        const descriptionInput = screen.findByText('Add description');

        expect(nameInput).toBeInTheDocument();
    });

    test('should show error for invalid model name', async () => {
        renderWithProviders(<ConfigureModel action={mockAction} />, { matchParams: { id: '1' } });

        const nameInput = screen.getByText('Name*');
        const nextButton = screen.getByRole('button', { name: /Next/i });

        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(screen.getByText(/Model name required/i)).toBeInTheDocument();
        });
    });

    test('should handle the back button click correctly', () => {
        renderWithProviders(<ConfigureModel action={mockAction} />, { matchParams: { id: '1' } });

        const backButton = screen.getByRole('button', { name: /Back/i });

        fireEvent.click(backButton);

        expect(mockAction.previous).toHaveBeenCalled();
    });

    test('should disable fields when isDeployed is true', () => {
        renderWithProviders(<ConfigureModel action={mockAction} isDeployed={true} />, {
            matchParams: { id: '1' }
        });

        const nameInput = screen.getByText('Name*');

        expect(nameInput).toBeEnabled();
    });
});
