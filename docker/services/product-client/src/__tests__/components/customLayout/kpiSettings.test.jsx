import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import { expect, vi } from 'vitest';
import CustomLayout from '../../../components/CustomLayout/CustomLayout';
import { LayoutContext } from '../../../../src/context/LayoutContext';
import KPISettings from '../../../components/CustomLayout/KpiSettings';
import '@testing-library/jest-dom/extend-expect';

const history = createMemoryHistory();
describe('KPISettings Component', () => {
    it('renders correctly', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={createMemoryHistory()}>
                        <KPISettings
                            kpiCount={3}
                            setKpiCount={vi.fn()}
                            rows={2}
                            setRows={vi.fn()}
                            orientation="Horizontal"
                            setOrientation={vi.fn()}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('KPI Settings')).toBeInTheDocument();

        expect(screen.getByText('Widget Settings')).toBeInTheDocument();
    });

    it('does not increment KPI count above 6', async () => {
        const setKpiCount = vi.fn();
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={createMemoryHistory()}>
                        <KPISettings
                            kpiCount={6}
                            setKpiCount={setKpiCount}
                            rows={2}
                            setRows={vi.fn()}
                            orientation="Horizontal"
                            setOrientation={vi.fn()}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('Widget Settings')).toBeInTheDocument();
    });

    it('does not increment KPI count above 6', () => {
        const setKpiCount = vi.fn();
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={createMemoryHistory()}>
                        <KPISettings
                            kpiCount={6}
                            setKpiCount={setKpiCount}
                            rows={2}
                            setRows={vi.fn()}
                            orientation="Horizontal"
                            setOrientation={vi.fn()}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByRole('button', { name: /Horizontal/i }));
        expect(setKpiCount).not.toHaveBeenCalled();
    });

    it('shows and hides orientation info popup', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={createMemoryHistory()}>
                        <KPISettings
                            kpiCount={3}
                            setKpiCount={vi.fn()}
                            rows={2}
                            setRows={vi.fn()}
                            orientation="Horizontal"
                            setOrientation={vi.fn()}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByTestId('info-icon-orientation'));
        expect(screen.getByText('Orientation')).toBeVisible();
    });

    it('shows and hides section info popup', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={createMemoryHistory()}>
                        <KPISettings
                            kpiCount={3}
                            setKpiCount={vi.fn()}
                            rows={2}
                            setRows={vi.fn()}
                            orientation="Horizontal"
                            setOrientation={vi.fn()}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByTestId('info-icon-section'));
        expect(screen.getByText('Sections')).toBeVisible();
    });
});
