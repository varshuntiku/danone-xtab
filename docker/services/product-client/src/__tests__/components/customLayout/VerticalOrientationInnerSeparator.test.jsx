import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import { act } from '@testing-library/react';
import { expect, vi } from 'vitest';
import VerticalOrientationInnerLine from '../../../components/CustomLayout/VerticalOrientationInnerSeparator';
import { LayoutContext } from '../../../../src/context/LayoutContext';

const history = createMemoryHistory();

const mockUpdateLayoutState = vi.fn();

const renderComponent = (props) => {
    const contextValue = {
        heightPattern: [
            [20, 30],
            [40, 50]
        ],
        updateLayoutState: mockUpdateLayoutState
    };

    return render(
        <Provider store={store}>
            <CustomThemeContextProvider>
                <Router history={history}>
                    <LayoutContext.Provider value={contextValue}>
                        <VerticalOrientationInnerLine
                            {...props}
                            parentRef={{ current: { offsetHeight: 500 } }}
                        />
                    </LayoutContext.Provider>
                </Router>
            </CustomThemeContextProvider>
        </Provider>
    );
};

describe('VerticalOrientationInnerLine', () => {
    it('renders correctly with initial props', () => {
        renderComponent({ position: 40, columnIndex: 0, rowIndex: 1, addWidget: [1] });
        expect(screen.getByTestId('hover-info')).toHaveTextContent('30');
    });

    it('should correctly update hoverInfo when mouse is dragged', () => {
        renderComponent({ position: 40, columnIndex: 0, rowIndex: 1, addWidget: [1] });

        const container = screen.getByTestId(`container-1`);
        fireEvent.mouseDown(container);

        act(() => {
            fireEvent.mouseMove(window, { clientY: 300 });
            fireEvent.mouseUp(window);
        });

        expect(screen.getByTestId('hover-info')).toHaveTextContent(/^\d+$/);
    });

    it('should set isDragging to false on mouse up', () => {
        renderComponent({ position: 40, columnIndex: 0, rowIndex: 1, addWidget: [1] });

        const container = screen.getByTestId(`container-1`);
        fireEvent.mouseDown(container);

        act(() => {
            fireEvent.mouseMove(window, { clientY: 300 });
            fireEvent.mouseUp(window);
        });

        expect(screen.getByTestId('hover-info')).toHaveTextContent(/^\d+$/);
    });
});
