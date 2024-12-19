import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import { expect, vi } from 'vitest';
import VerticalLine from '../../../components/CustomLayout/VerticalLine';
import { LayoutContext } from '../../../../src/context/LayoutContext';

const history = createMemoryHistory();
const mockUpdateLayoutState = vi.fn();

const renderComponent = (props) => {
    return render(
        <Provider store={store}>
            <CustomThemeContextProvider>
                <Router history={history}>
                    <LayoutContext.Provider
                        value={{
                            widthPattern: [
                                [10, 20],
                                [30, 40]
                            ],
                            updateLayoutState: mockUpdateLayoutState
                        }}
                    >
                        <VerticalLine {...props} parentRef={{ current: { offsetWidth: 100 } }} />
                    </LayoutContext.Provider>
                </Router>
            </CustomThemeContextProvider>
        </Provider>
    );
};

describe('VerticalLine', () => {
    it('renders correctly with initial props', () => {
        renderComponent({ position: 50, rowIndex: 0, columnIndex: 0, sumUntilIndex: () => 10 });

        expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('should correctly update hoverInfo when mouse moves', () => {
        renderComponent({ position: 50, rowIndex: 0, columnIndex: 0, sumUntilIndex: () => 10 });

        const container = screen.getByTestId('vertical-line');
        fireEvent.mouseDown(container);

        act(() => {
            fireEvent.mouseMove(window, { clientX: 150 });
        });

        act(() => {
            fireEvent.mouseUp(window);
        });

        expect(screen.getByText('10')).toBeInTheDocument();
    });
});
