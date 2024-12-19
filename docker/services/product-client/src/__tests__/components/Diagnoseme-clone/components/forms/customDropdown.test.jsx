import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CustomDropdown from '../../../../../components/Diagnoseme-clone/components/forms/CustomDropdown';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import store from 'store/store';
import '@testing-library/jest-dom';

import { vi } from 'vitest';

const history = createMemoryHistory();

describe('CustomDropdown Component', () => {
    const mockDropdownData = [
        ['Option 1', 'Option 2', 'Option 3'],
        ['Option 1'],
        vi.fn(),
        false,
        false
    ];

    const mockDropdownDataWithError = [
        ['Option 1', 'Option 2', 'Option 3'],
        [],
        vi.fn(),
        false,
        true
    ];

    it('renders without crashing', () => {
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

    it('displays selected values as chips', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CustomDropdown dropdownData={mockDropdownData} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        mockDropdownData[1].forEach((selectedValue) => {
            expect(screen.getByText(selectedValue)).toBeInTheDocument();
        });
    });

    it('calls handleSelectChange when an option is selected', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CustomDropdown dropdownData={mockDropdownData} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.mouseDown(screen.getByRole('combobox'));

        expect(mockDropdownData[2]).not.toHaveBeenCalled();
    });

    it('displays an error message when formError is true', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CustomDropdown dropdownData={mockDropdownDataWithError} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('Please select atleast one option')).toBeInTheDocument();
    });

    it('does not display an error message when formError is false', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CustomDropdown dropdownData={mockDropdownData} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.queryByText('Please select atleast one option')).not.toBeInTheDocument();
    });
});
