import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store/store';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { vi } from 'vitest';
import LLMExperiments from '../../../components/llmWorkbench/LLMExperiments';
const history = createMemoryHistory();

vi.mock('../../../services/llmWorkbench/llm-workbench', () => ({
    getCustomTableHeader: vi.fn().mockResolvedValue([])
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
                    <LLMExperiments history={history} />
                </Router>
            </CustomThemeContextProvider>
        </Provider>
    );
};

describe('LLMExperiments Component', () => {
    it('should render without crashing', () => {
        setup();
        expect(screen.getByText(/Finetuning/i)).toBeInTheDocument();
        expect(screen.getByText(/DataTable/i)).toBeInTheDocument();
    });

    it('should display snackbar on error', async () => {
        vi.mock('../../../services/llmWorkbench/llm-workbench', () => ({
            getCustomTableHeader: vi
                .fn()
                .mockRejectedValue(new Error('Failed to load Experiments! Please try again'))
        }));

        setup();

        await waitFor(() => {
            expect(screen.getByText(/CustomSnackbar/i)).toBeInTheDocument();
        });
    });
});
