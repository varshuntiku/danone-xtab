import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store/store';
import { act } from 'react-dom/test-utils';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import MultiSelectPopupMenu from '../../components/MultiSelectPopupMenu';

const history = createMemoryHistory();

describe('MultiSelectPopupMenu', () => {
    const defaultProps = {
        menuHeight: 400,
        zoomLevel: 1.0,
        type: 'grid',
        columns: [{ key: 'Option 1' }, { key: 'Option 2' }, { key: 'Option 3' }],
        onChangeFilterMenu: vi.fn()
    };

    it('should render without crashing', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MultiSelectPopupMenu {...defaultProps} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByTitle('dropdown-multi-select-menu-popup')).toBeInTheDocument();
    });

    it('should open and close the menu on icon click', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MultiSelectPopupMenu {...defaultProps} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const button = screen.getByTitle('Filter');
        fireEvent.click(button);

        expect(screen.getByRole('listbox')).toBeVisible();
    });

    it('should handle select all functionality', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MultiSelectPopupMenu {...defaultProps} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByTitle('Filter'));

        fireEvent.doubleClick(screen.getByText('SELECT ALL'));

        await waitFor(() => {
            const checkboxes = screen.getAllByRole('checkbox');
            checkboxes.forEach((checkbox) => {
                expect(checkbox).toBeChecked();
            });
        });

        expect(defaultProps.onChangeFilterMenu).toHaveBeenCalledWith(
            ['Option 1', 'Option 2', 'Option 3'],
            defaultProps.columns
        );
    });

    it('should handle individual item selection and deselection', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MultiSelectPopupMenu {...defaultProps} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        fireEvent.click(screen.getByTitle('Filter'));

        fireEvent.doubleClick(screen.getByText('Option 1'));

        await waitFor(() => {
            expect(
                screen.getByText('Option 1').closest('li').querySelector('input[type="checkbox"]')
            ).toBeChecked();
        });
    });
});
