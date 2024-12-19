import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import { expect, vi } from 'vitest';
import HorizontalLine from '../../../components/CustomLayout/HorizontalLine';
import { LayoutContext } from '../../../../src/context/LayoutContext';

const history = createMemoryHistory();

const mockLayoutContext = {
    heightPattern: [10, 10],
    updateLayoutState: vi.fn()
};

describe('HorizontalLine Component', () => {
    it('should render correctly with initial props', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={createMemoryHistory()}>
                        <LayoutContext.Provider value={mockLayoutContext}>
                            <HorizontalLine index={0} containerHeight={50} />
                        </LayoutContext.Provider>
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByTestId('hover-info')).toHaveTextContent('50');
    });

    it('should display hover info on hover', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={createMemoryHistory()}>
                        <LayoutContext.Provider value={mockLayoutContext}>
                            <HorizontalLine index={0} containerHeight={50} />
                        </LayoutContext.Provider>
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const container = screen.getByTestId('horizontal-line');
        fireEvent.mouseDown(container);
        expect(screen.getByTestId('hover-info')).toHaveTextContent('50');
    });

    it('should call updateLayoutState with correct values on mouse move', async () => {
        const updateLayoutStateMock = vi.fn();
        const contextValue = {
            ...mockLayoutContext,
            updateLayoutState: updateLayoutStateMock
        };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={createMemoryHistory()}>
                        <LayoutContext.Provider value={contextValue}>
                            <HorizontalLine index={0} containerHeight={50} />
                        </LayoutContext.Provider>
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const container = screen.getByTestId('horizontal-line');
        fireEvent.mouseDown(container);

        fireEvent.mouseMove(window, { clientY: 100 });
        fireEvent.mouseUp(window);

        expect(updateLayoutStateMock).not.toBeCalled();
    });

    it('should update hover info correctly on mouse move', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={createMemoryHistory()}>
                        <LayoutContext.Provider value={mockLayoutContext}>
                            <HorizontalLine index={0} containerHeight={50} />
                        </LayoutContext.Provider>
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const container = screen.getByTestId('horizontal-line');
        fireEvent.mouseDown(container);

        fireEvent.mouseMove(window, { clientY: 100 });
        expect(screen.getByTestId('hover-info')).toHaveTextContent('50');
    });

    it('should handle mouse up event correctly', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={createMemoryHistory()}>
                        <LayoutContext.Provider value={mockLayoutContext}>
                            <HorizontalLine index={0} containerHeight={50} />
                        </LayoutContext.Provider>
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const container = screen.getByTestId('horizontal-line');
        fireEvent.mouseDown(container);

        fireEvent.mouseMove(window, { clientY: 100 });
        fireEvent.mouseUp(window);
    });
});
