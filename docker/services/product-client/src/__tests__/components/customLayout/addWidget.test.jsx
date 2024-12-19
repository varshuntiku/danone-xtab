import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import { expect, vi } from 'vitest';
import AddWidget from '../../../components/CustomLayout/AddWidget';
import { LayoutContext } from '../../../../src/context/LayoutContext';

const history = createMemoryHistory();
const mockLayoutContext = {
    widthPattern: { 1: [4] }
};

describe('AddWidget Component', () => {
    it('should render correctly with initial props', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <LayoutContext.Provider value={mockLayoutContext}>
                        <Router history={history}>
                            <AddWidget addWidget={{}} setAddWidget={vi.fn()} row={1} />
                        </Router>
                    </LayoutContext.Provider>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('Add Widget')).toBeInTheDocument();
    });

    it('should open the dialog on button click', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <LayoutContext.Provider value={mockLayoutContext}>
                        <Router history={history}>
                            <AddWidget addWidget={{}} setAddWidget={vi.fn()} row={1} />
                        </Router>
                    </LayoutContext.Provider>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByText('Add Widget'));
        expect(screen.getByText('Add Widgets')).toBeInTheDocument();
    });

    it('should close the dialog on close icon click', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <LayoutContext.Provider value={mockLayoutContext}>
                        <Router history={history}>
                            <AddWidget addWidget={{}} setAddWidget={vi.fn()} row={1} />
                        </Router>
                    </LayoutContext.Provider>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByText('Add Widget'));

        expect(screen.queryByText('Number of Sections')).toBeInTheDocument();
    });

    it('should add widget and close dialog on Add button click', () => {
        const setAddWidgetMock = vi.fn();
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <LayoutContext.Provider value={mockLayoutContext}>
                        <Router history={history}>
                            <AddWidget addWidget={{}} setAddWidget={setAddWidgetMock} row={1} />
                        </Router>
                    </LayoutContext.Provider>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByText('Add Widget'));
        fireEvent.change(screen.getByLabelText(/input number/i), { target: { value: '2' } });
        fireEvent.click(screen.getByText('Add'));
        expect(setAddWidgetMock).toHaveBeenCalledWith(1, { 1: 2 });
        expect(screen.queryByText('Add Widgets')).not.toBeInTheDocument();
    });

    it('should start with initial state', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <LayoutContext.Provider value={mockLayoutContext}>
                        <Router history={history}>
                            <AddWidget addWidget={{}} setAddWidget={vi.fn()} row={1} />
                        </Router>
                    </LayoutContext.Provider>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('Add Widget')).toBeInTheDocument();
        expect(screen.queryByText('Add Widgets')).not.toBeInTheDocument();
    });

    it('should use the widthPattern from context', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <LayoutContext.Provider value={mockLayoutContext}>
                        <Router history={history}>
                            <AddWidget addWidget={{}} setAddWidget={vi.fn()} row={1} />
                        </Router>
                    </LayoutContext.Provider>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('Add Widget')).toBeInTheDocument();
    });
});
