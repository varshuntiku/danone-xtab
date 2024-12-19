import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import MultiSelectDropdown from '../../../components/custom/CodxMultiSelectDropdown';
import { vi } from 'vitest';
const history = createMemoryHistory();

describe('MultiSelectDropdown Component', () => {
    const elementProps = {
        id: 'testDropdown',
        label: 'Test Dropdown',
        options: ['Option 1', 'Option 2', 'Option 3'],
        defaultValue: ['Option 1'],
        width: '300px',
        margin: '10px'
    };

    const mockOnChange = vi.fn();

    it('renders correctly with the given options', () => {
        const { getByLabelText, getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <MultiSelectDropdown elementProps={elementProps} onChange={mockOnChange} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(getByText('Select KPI')).toBeInTheDocument();

        expect(getByText('Option 1')).toBeInTheDocument();
    });

    it('applies the correct styles to the Box', () => {
        const { container } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <MultiSelectDropdown elementProps={elementProps} onChange={mockOnChange} />
                </Router>
            </CustomThemeContextProvider>
        );

        const boxElement = container.firstChild;

        expect(boxElement).toHaveStyle('width: 300px');
        expect(boxElement).toHaveStyle('margin: 10px');
    });

    it('renders with no options selected if defaultValue is not provided', () => {
        const elementPropsNoDefaultValue = {
            ...elementProps,
            defaultValue: []
        };

        const { getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <MultiSelectDropdown
                        elementProps={elementPropsNoDefaultValue}
                        onChange={mockOnChange}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        const selectElement = getByText('Select KPI');
        expect(selectElement).toHaveTextContent('Select KPI');
    });
});
