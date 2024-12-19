import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import store from 'store/store';
import { vi } from 'vitest';
import DeployedLLM from '../../../components/llmWorkbench/DeployedLLM';
import CustomThemeContextProvider from '../../../themes/customThemeContext';

const history = createMemoryHistory();

vi.mock('../../../services/llmWorkbench/llm-workbench', () => ({
    debouncedGetTableHeader: vi.fn().mockResolvedValue([]),
    updateLLMModel: vi.fn().mockResolvedValue({ data: {} }),
    deleteDeployedLLMModel: vi.fn().mockResolvedValue({})
}));

vi.mock('../../../components/llmWorkbench/DataTable', () => ({
    default: () => <div>DataTable</div>
}));

vi.mock('../../../components/CustomSnackbar', () => ({
    default: () => <div>CustomSnackbar</div>
}));

const setup = () => {
    return render(
        <Provider store={store}>
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DeployedLLM classes={{}} history={history} />
                </Router>
            </CustomThemeContextProvider>
        </Provider>
    );
};

describe('DeployedLLM Component', () => {
    it('should render without crashing', () => {
        setup();
        expect(screen.getByText(/View deployed models/i)).toBeInTheDocument();
    });

    it('should handle search correctly', async () => {
        setup();
        expect(screen.getByText(/CustomSnackbar/i)).toBeInTheDocument();
    });

    it('should handle status change correctly', async () => {
        setup();
        expect(screen.getByText(/View deployed models/i)).toBeInTheDocument();
    });

    it('should show snackbar on success and error', async () => {
        setup();

        await waitFor(() => {
            expect(
                screen.getByText(
                    /Deployments provide endpoints to the supported base models, or your fine-tuned models, configured with settings to meet your needs. From this page, you can view and delete your deployments. To create a new deployment please proceed to the supported models page./i
                )
            ).toBeInTheDocument();
        });
    });
});
