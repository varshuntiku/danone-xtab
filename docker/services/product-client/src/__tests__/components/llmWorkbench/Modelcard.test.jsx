import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store/store';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { vi } from 'vitest';
import ModelCard from '../../../components/llmWorkbench/ModelCard';
const history = createMemoryHistory();
vi.mock('@material-ui/core', async () => {
    const actual = await vi.importActual('@material-ui/core');
    return {
        ...actual,
        Box: ({ children }) => <div>{children}</div>,
        Typography: ({ children }) => <div>{children}</div>,
        makeStyles: () => (style) => ({})
    };
});

vi.mock('@material-ui/icons/GetApp', () => ({
    __esModule: true,
    default: () => <svg data-testid="get-app-icon" />
}));

vi.mock('@material-ui/icons/FavoriteBorderRounded', () => ({
    __esModule: true,
    default: () => <svg data-testid="favorite-border-icon" />
}));

describe('ModelCard Component', () => {
    const model = {
        id: '123',
        avatarUrl: 'http://example.com/avatar.jpg',
        pipeline_tag: 'test-tag',
        lastModified: '2024-07-01T12:00:00Z',
        downloads: 1500,
        likes: 250
    };

    const renderComponent = () => {
        const history = createMemoryHistory();
        return render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ModelCard model={model} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    };

    test('should render ModelCard with model data', () => {
        renderComponent();

        expect(screen.getByText('123')).toBeInTheDocument();
        expect(screen.getByText('Test Tag')).toBeInTheDocument();

        expect(screen.getByText('1.5k')).toBeInTheDocument();
        expect(screen.getByText('250')).toBeInTheDocument();
        expect(screen.getByTestId('get-app-icon')).toBeInTheDocument();
        expect(screen.getByTestId('favorite-border-icon')).toBeInTheDocument();
    });

    test('should format data correctly', () => {
        const { container } = renderComponent();
        const formattedData = container.textContent;
        expect(formattedData).toContain('1.5k');
        expect(formattedData).toContain('250');
    });

    test('should format pipeline tag correctly', () => {
        const { container } = renderComponent();
        const formattedTag = container.textContent;
        expect(formattedTag).toContain('Test Tag');
    });
});
