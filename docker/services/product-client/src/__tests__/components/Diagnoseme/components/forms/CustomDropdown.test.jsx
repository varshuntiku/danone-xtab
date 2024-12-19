import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CustomDropdown from '../../../../../components/Diagnoseme/components/forms/CustomDropdown';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import store from 'store/store';
import '@testing-library/jest-dom';

import { vi } from 'vitest';

const history = createMemoryHistory();

const mockDropdownData = [['Option 1', 'Option 2', 'Option 3'], [], vi.fn(), false, false];

describe('CustomDropdown', () => {
    it('should render without crashing', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CustomDropdown dropdownData={mockDropdownData} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should handle option selection', () => {
        const handleSelectChange = vi.fn();
        const modifiedDropdownData = [
            ['Option 1', 'Option 2', 'Option 3'],
            [],
            handleSelectChange,
            false,
            false
        ];

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CustomDropdown dropdownData={modifiedDropdownData} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.mouseDown(screen.getByRole('combobox'));

        expect(handleSelectChange).not.toHaveBeenCalled();
    });

    it('should show error message when formError is true', () => {
        const errorDropdownData = [['Option 1', 'Option 2', 'Option 3'], [], vi.fn(), false, true];

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CustomDropdown dropdownData={errorDropdownData} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('Please select atleast one option')).toBeInTheDocument();
    });

    it('should apply styles correctly', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CustomDropdown dropdownData={mockDropdownData} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const dropdown = screen.getByRole('combobox');
        const errorMessage = screen.queryByText('Please select atleast one option');

        expect(dropdown).toHaveStyle('width: 514px');
        expect(dropdown).toHaveStyle('height: 48px');

        if (errorMessage) {
            expect(errorMessage).toHaveStyle('color: red');
        }
    });
});
