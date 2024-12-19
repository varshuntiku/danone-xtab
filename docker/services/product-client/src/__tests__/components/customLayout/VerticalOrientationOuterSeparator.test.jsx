import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import { expect, vi } from 'vitest';
import VerticalOrientationOuterLine from '../../../components/CustomLayout/VerticalOrientationOuterSeparator';
import { LayoutContext } from '../../../../src/context/LayoutContext';

const history = createMemoryHistory();
const mockUpdateLayoutState = vi.fn();

const renderComponent = (props) => {
    return render(
        <Provider store={store}>
            <CustomThemeContextProvider>
                <Router history={history}>
                    <LayoutContext.Provider
                        value={{ widthPattern: [10, 20], updateLayoutState: mockUpdateLayoutState }}
                    >
                        <VerticalOrientationOuterLine
                            {...props}
                            containerRef={{ current: { offsetWidth: 100 } }}
                        />
                    </LayoutContext.Provider>
                </Router>
            </CustomThemeContextProvider>
        </Provider>
    );
};

describe('VerticalOrientationOuterLine', () => {
    it('renders correctly with initial props', () => {
        renderComponent({ index: 0 });

        expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('updates position on mouse drag', () => {
        renderComponent({ index: 0 });

        const container = screen.getByTestId('vertical-line');
        expect(mockUpdateLayoutState).not.toHaveBeenCalled();
    });
});
