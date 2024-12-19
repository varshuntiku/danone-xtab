import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CustomRadio from '../../../../components/dynamic-form/inputFields/radio';
import { vi } from 'vitest';
import { ThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import store from 'store/store';
const history = createMemoryHistory();

describe('CustomRadio Component', () => {
    let mockOnChange;
    let defaultParams;

    beforeEach(() => {
        mockOnChange = vi.fn();
        defaultParams = {
            value: false,
            name: 'test-radio',
            label: 'Test Label',
            helperText: 'Test helper text',
            disabled: false,
            inline: false
        };
    });

    it('renders the radio button and label correctly', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CustomRadio onChange={mockOnChange} params={defaultParams} />
                </Router>
            </CustomThemeContextProvider>
        );

        const radio = screen.getByRole('radio', { name: 'Test Label' });
        const label = screen.getByText('Test Label');
        const helperText = screen.getByText('Test helper text');

        expect(radio).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(helperText).toBeInTheDocument();
    });

    it('calls onChange when the radio button is clicked', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CustomRadio onChange={mockOnChange} params={defaultParams} />
                </Router>
            </CustomThemeContextProvider>
        );

        const radio = screen.getByRole('radio', { name: 'Test Label' });
        fireEvent.click(radio);

        expect(mockOnChange).toHaveBeenCalledWith(true);
    });

    it('disables the radio button when the disabled prop is true', () => {
        const disabledParams = { ...defaultParams, disabled: true };
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CustomRadio onChange={mockOnChange} params={disabledParams} />
                </Router>
            </CustomThemeContextProvider>
        );

        const radio = screen.getByRole('radio', { name: 'Test Label' });
        expect(radio).toBeDisabled();
    });
});
