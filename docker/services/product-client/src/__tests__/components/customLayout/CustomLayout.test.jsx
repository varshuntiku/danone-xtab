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
const history = createMemoryHistory();

const mockLayoutContext = {
    widthPattern: { 1: [4] },
    heightPattern: {},
    updateLayoutState: vi.fn()
};

describe('CustomLayout Component', () => {
    const handleGraphTypeChange = vi.fn();
    const handleOrientationChange = vi.fn();
    const handleGraphWHPatternChange = vi.fn();
    const setKpiCount = vi.fn();
    const onSaveClick = vi.fn();
    const onCancel = vi.fn();

    it('should render correctly with initial props', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <LayoutContext.Provider value={mockLayoutContext}>
                        <Router history={createMemoryHistory()}>
                            <CustomLayout
                                handleGraphTypeChange={handleGraphTypeChange}
                                handleOrientationChange={handleOrientationChange}
                                handleGraphWHPatternChange={handleGraphWHPatternChange}
                                setKpiCount={setKpiCount}
                                kpiCount={0}
                                onSaveClick={onSaveClick}
                                onCancel={onCancel}
                                disabled={false}
                            />
                        </Router>
                    </LayoutContext.Provider>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('Custom Settings')).toBeInTheDocument();
    });

    it('should call onSaveClick when Save button is clicked', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <LayoutContext.Provider value={mockLayoutContext}>
                        <Router history={createMemoryHistory()}>
                            <CustomLayout
                                handleGraphTypeChange={handleGraphTypeChange}
                                handleOrientationChange={handleOrientationChange}
                                handleGraphWHPatternChange={handleGraphWHPatternChange}
                                setKpiCount={setKpiCount}
                                kpiCount={0}
                                onSaveClick={onSaveClick}
                                onCancel={onCancel}
                                disabled={false}
                            />
                        </Router>
                    </LayoutContext.Provider>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByText('Save Custom Layout'));
        expect(onSaveClick).toHaveBeenCalled();
    });

    it('should call onCancel when Cancel button is clicked', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <LayoutContext.Provider value={mockLayoutContext}>
                        <Router history={createMemoryHistory()}>
                            <CustomLayout
                                handleGraphTypeChange={handleGraphTypeChange}
                                handleOrientationChange={handleOrientationChange}
                                handleGraphWHPatternChange={handleGraphWHPatternChange}
                                setKpiCount={setKpiCount}
                                kpiCount={0}
                                onSaveClick={onSaveClick}
                                onCancel={onCancel}
                                disabled={false}
                            />
                        </Router>
                    </LayoutContext.Provider>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByText('Cancel'));
        expect(onCancel).toHaveBeenCalled();
    });

    it('should reset addWidget state on orientation change', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <LayoutContext.Provider value={mockLayoutContext}>
                        <Router history={createMemoryHistory()}>
                            <CustomLayout
                                handleGraphTypeChange={handleGraphTypeChange}
                                handleOrientationChange={handleOrientationChange}
                                handleGraphWHPatternChange={handleGraphWHPatternChange}
                                setKpiCount={setKpiCount}
                                kpiCount={0}
                                onSaveClick={onSaveClick}
                                onCancel={onCancel}
                                disabled={false}
                            />
                        </Router>
                    </LayoutContext.Provider>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(mockLayoutContext.updateLayoutState).toHaveBeenCalledWith('heightPattern', [], 0);
        expect(handleGraphTypeChange).toHaveBeenCalledWith('', 0);
    });
});
