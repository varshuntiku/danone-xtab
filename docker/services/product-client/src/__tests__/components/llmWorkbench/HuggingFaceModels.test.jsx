import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store/store';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { vi } from 'vitest';
import HuggingFaceModels from '../../../components/llmWorkbench/HuggingFaceModels';

vi.mock('../../../components/llmWorkbench/Tasks', () => ({
    __esModule: true,
    default: () => <div>Tasks Component</div>
}));

vi.mock('../../../components/llmWorkbench/Models', () => ({
    __esModule: true,
    default: () => <div>Models Component</div>
}));

const history = createMemoryHistory();

describe('HuggingFaceModels Component', () => {
    test('should render Tasks and Models components', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <HuggingFaceModels />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText(/Tasks Component/i)).toBeInTheDocument();

        expect(screen.getByText(/Models Component/i)).toBeInTheDocument();
    });
});
