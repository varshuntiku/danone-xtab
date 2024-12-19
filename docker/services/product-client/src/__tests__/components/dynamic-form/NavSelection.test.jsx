import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import NavSelection from '../../../components/dynamic-form/NavSelection';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

const history = createMemoryHistory();
describe('NavSelection Component', () => {
    const mockHandleValueChange = vi.fn();
    const item = { value: true };
    const elemntProps = { helperText: 'Please select a navigation option' };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should render LeftNav and TopNav components', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <NavSelection
                        item={item}
                        elemntProps={elemntProps}
                        handleValueChange={mockHandleValueChange}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('Left Navigation')).toBeInTheDocument();
        expect(screen.getByText('Top Navigation')).toBeInTheDocument();
    });

    test('should handle LeftNav click and change state', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <NavSelection
                        item={item}
                        elemntProps={elemntProps}
                        handleValueChange={mockHandleValueChange}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        const leftNavElement = screen.getByText('Left Navigation').parentElement;
        fireEvent.click(leftNavElement);

        expect(item.value).toBe(false);
        expect(mockHandleValueChange).toHaveBeenCalledWith(elemntProps);
    });

    test('should handle TopNav click and change state', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <NavSelection
                        item={item}
                        elemntProps={elemntProps}
                        handleValueChange={mockHandleValueChange}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        const topNavElement = screen.getByText('Top Navigation').parentElement;
        fireEvent.click(topNavElement);

        expect(item.value).toBe(true);
        expect(mockHandleValueChange).toHaveBeenCalledWith(elemntProps);
    });

    test('should display helper text when selected is null', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <NavSelection
                        item={{ value: null }}
                        elemntProps={elemntProps}
                        handleValueChange={mockHandleValueChange}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('Please select a navigation option')).toBeInTheDocument();
    });
});
