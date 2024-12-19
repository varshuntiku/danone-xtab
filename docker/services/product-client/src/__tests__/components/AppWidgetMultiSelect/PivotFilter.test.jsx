import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import PivotFilter from '../../../components/AppWidgetMultiSelect/PivotFilter';
import { Provider } from 'react-redux';
import store from 'store/store';
import { vi } from 'vitest';

const history = createMemoryHistory();

const mockPivotInfo = [
    { key: '1', label: 'Pivot 1', type: '', order: 1 },
    { key: '2', label: 'Pivot 2', type: '', order: 2 }
];

const onChange = vi.fn();

describe('PivotFilter', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the component correctly', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PivotFilter pivotInfo={mockPivotInfo} onChange={onChange} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('Filters')).toBeInTheDocument();
        expect(screen.getByText('Rows')).toBeInTheDocument();
        expect(screen.getByText('Columns')).toBeInTheDocument();
        expect(screen.getByText('Pivot 1')).toBeInTheDocument();
        expect(screen.getByText('Pivot 2')).toBeInTheDocument();
    });

    it('handles drag and drop correctly', () => {
        const dataTransfer = {
            setData: vi.fn(),
            getData: vi.fn().mockReturnValue('1')
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <PivotFilter pivotInfo={mockPivotInfo} onChange={onChange} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const pivotItem = screen.getByText('Pivot 1');
        const dropZoneFilters = screen.getByText('Filters');

        fireEvent.dragStart(pivotItem, { dataTransfer });
        fireEvent.drop(dropZoneFilters, { dataTransfer });

        expect(dataTransfer.setData).toHaveBeenCalledWith('text', '1');
        expect(onChange).toHaveBeenCalled();
    });
});
