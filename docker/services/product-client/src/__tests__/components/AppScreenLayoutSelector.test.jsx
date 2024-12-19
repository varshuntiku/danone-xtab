import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AppScreenLayoutSelector from '../../components/AppScreenLayoutSelector';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { describe, it, afterEach, expect, vi } from 'vitest';

const history = createMemoryHistory();

describe('AppScreenLayoutSelector Component Tests', () => {
    afterEach(cleanup);

    const defaultProps = {
        classes: {
            layoutGridRoot: 'layoutGridRoot',
            layoutGrid: 'layoutGrid',
            layoutGridTile: 'layoutGridTile'
        },
        layout_metrics: false,
        layout_visuals: false,
        selected_layout: null,
        layout_options: [],
        custom_layout: false,
        editDisabled: false,
        editMode: true,
        onChange: vi.fn()
    };

    it('Should render AppScreenLayoutSelector component', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenLayoutSelector {...defaultProps} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByTestId('app-screen-layout')).toBeInTheDocument();
    });

    it('Should handle layout option click', () => {
        const props = {
            ...defaultProps,
            layout_options: [
                { no_labels: 1, no_graphs: 2, graph_type: '1-1', graph_size: '', vertical: true }
            ]
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenLayoutSelector {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        const layoutOption = screen.getByTestId('layout-option-0');
        expect(layoutOption).toBeInTheDocument();

        fireEvent.click(layoutOption);
    });
    it('Should update layout options on prop change', () => {
        const { rerender } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenLayoutSelector {...defaultProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const newProps = {
            ...defaultProps,
            layout_options: [
                { no_labels: 2, no_graphs: 3, graph_type: '2-2', graph_size: '', vertical: false }
            ]
        };

        rerender(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenLayoutSelector {...newProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByTestId('layout-option-0')).toBeInTheDocument();
    });

    it('Should scroll to selected layout when component mounts', () => {
        const props = {
            ...defaultProps,
            layout_options: [
                { no_labels: 1, no_graphs: 2, graph_type: '1-1', graph_size: '', vertical: true }
            ],
            selected_layout: { no_labels: 1, no_graphs: 2, graph_type: '1-1' }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenLayoutSelector {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        const selectedLayoutElement = screen.getByTestId('layout-option-0');
        expect(selectedLayoutElement).toBeInTheDocument();
    });
    it('Should handle custom layout options', () => {
        const props = {
            ...defaultProps,
            custom_layout: true,
            layout_options: {
                no_labels: 2,
                no_graphs: 3,
                graph_type: '2-2',
                graph_width: '2',
                graph_height: '2'
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenLayoutSelector {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        const layoutOption = screen.getByTestId('layout-option-0');
        expect(layoutOption).toBeInTheDocument();
    });

    it('Should not display any layout options when layout_options is empty', () => {
        const props = {
            ...defaultProps,
            layout_options: []
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenLayoutSelector {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.queryByTestId('layout-option-0')).toBeNull();
    });

    it('Should filter layout options based on layout_metrics and layout_visuals', () => {
        const props = {
            ...defaultProps,
            layout_metrics: 1,
            layout_visuals: 2,
            layout_options: [
                { no_labels: 1, no_graphs: 2, graph_type: '1-1' },
                { no_labels: 2, no_graphs: 2, graph_type: '2-2' },
                { no_labels: 1, no_graphs: 3, graph_type: '1-2' }
            ]
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenLayoutSelector {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByTestId('layout-option-0')).toBeInTheDocument();
        expect(screen.queryByTestId('layout-option-1')).toBeNull();
        expect(screen.queryByTestId('layout-option-2')).toBeNull();
    });
    it('Should update layout options when props change', () => {
        const { rerender } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenLayoutSelector {...defaultProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const newProps = {
            ...defaultProps,
            layout_options: [{ no_labels: 3, no_graphs: 1, graph_type: '3-1' }]
        };

        rerender(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppScreenLayoutSelector {...newProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        const updatedLayoutOption = screen.getByTestId('layout-option-0');
        expect(updatedLayoutOption).toBeInTheDocument();
    });
});
