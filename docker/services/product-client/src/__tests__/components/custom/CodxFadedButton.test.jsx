import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import FadedButton from '../../../components/custom/CodxFadedButton';
import { vi } from 'vitest';

const history = createMemoryHistory();
describe('FadedButton Component', () => {
    const mockOnChange = vi.fn();
    const elementProps = {
        id: 'test-id',
        label: 'Test Label',
        margin: '10px'
    };
    const classes = {
        button: 'test-button-class'
    };

    it('renders the button with the correct label', () => {
        const { getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <FadedButton
                        elementProps={elementProps}
                        classes={classes}
                        onChange={mockOnChange}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(getByText('Test Label')).toBeInTheDocument();
    });

    it('applies the correct margin to the Box', () => {
        const { container } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <FadedButton
                        elementProps={elementProps}
                        classes={classes}
                        onChange={mockOnChange}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        const boxElement = container.firstChild;

        expect(boxElement).toHaveStyle('margin: 10px');
    });

    it('applies the correct class to the button', () => {
        const { getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <FadedButton
                        elementProps={elementProps}
                        classes={classes}
                        onChange={mockOnChange}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        const buttonElement = getByText('Test Label');

        expect(buttonElement).toHaveClass('test-button-class');
    });

    it('toggles state and calls onChange with correct arguments on button click', () => {
        const { getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <FadedButton
                        elementProps={elementProps}
                        classes={classes}
                        onChange={mockOnChange}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        const buttonElement = getByText('Test Label');

        fireEvent.click(buttonElement);
        expect(mockOnChange).toHaveBeenCalledWith('test-id', false);

        fireEvent.click(buttonElement);
        expect(mockOnChange).toHaveBeenCalledWith('test-id', true);
    });
});
