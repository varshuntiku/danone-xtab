import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { expect, vi } from 'vitest';
import SavedScenarioPopup from '../../components/SavedScenarioPopup';
import { Provider } from 'react-redux';
import { SavedScenarioContext } from '../../components/AppScreen';
import store from 'store/store';

vi.mock('../../assets/Icons/CloseBtn', () => ({
    __esModule: true,
    default: () => <div data-testid="close-icon">Close Icon</div>,
}));

vi.mock('../../components/SavedScenarioPopupTable', () => ({
    __esModule: true,
    default: () => <div data-testid="scenario-table">Scenario Table</div>,
}));

vi.mock('assets/Icons/editicon.svg', () => ({
    ReactComponent: () => <div data-testid="edit-icon">Edit Icon</div>,
}));

describe('SavedScenarioPopup Component', () => {
    const mockClosePopup = vi.fn();
    const mockSetIsEditingParent = vi.fn();
    const mockUpdateEditingFields = vi.fn();

    const defaultProps = {
        SavedScenarioprops: {
            present_scenario: [{ header: 'Header 1', inputs: [{ label: 'Var1', value: 1.23 }] }],
            compare_scenario: [{ inputs: [{ label: 'Var1', value: 1.10 }] }],
            table_header: 'Test Header',
            id: 1,
            description: [
                { base: 'Base description' },
                { scenario: 'Scenario description' },
            ],
            savedscenerios: [{ id: 1, scenarios_json: ['Scenario 1'] }],
            name: 'Scenario Name',
        },
        updateEditingFields: mockUpdateEditingFields,
        setIsEditingParent: mockSetIsEditingParent,
    };

    const renderComponent = (props = {}) =>
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={createMemoryHistory()}>
                        <SavedScenarioContext.Provider value={{ closePopup: mockClosePopup }}>
                            <SavedScenarioPopup {...defaultProps} {...props} />
                        </SavedScenarioContext.Provider>
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('triggers edit functionality when Edit button is clicked', () => {
        renderComponent();

        const editButton = screen.getByRole('button', { name: /edit icon/i });
        expect(editButton).toBeInTheDocument();

        fireEvent.click(editButton);

        expect(mockClosePopup).toHaveBeenCalled();
        expect(mockSetIsEditingParent).toHaveBeenCalledWith(true);
    });

    it('renders the table header', () => {
        renderComponent();

        const header = screen.getByText('Test Header');
        expect(header).toBeInTheDocument();
    });

    it('displays scenarios in the scenario table', () => {
        renderComponent();

        const scenarioTable = screen.getByTestId('scenario-table');
        expect(scenarioTable).toBeInTheDocument();
    });

    it('closes the popup when the close icon is clicked', () => {
        renderComponent();

        const closeIcon = screen.getByTestId('close-icon');
        fireEvent.click(closeIcon);

        expect(mockClosePopup).toHaveBeenCalled();
    });

    it('calls updateEditingFields when component is re-rendered with a new scenario', () => {
        const { rerender } = renderComponent();

        rerender(
            <Provider store={store}>
            <CustomThemeContextProvider>
                <Router history={createMemoryHistory()}>
                    <SavedScenarioContext.Provider value={{ closePopup: mockClosePopup }}>
            <SavedScenarioPopup
                {...defaultProps}
                SavedScenarioprops={{
                    ...defaultProps.SavedScenarioprops,
                    id: 2,
                    name: 'Updated Scenario Name',
                }}
            />
            </SavedScenarioContext.Provider></Router></CustomThemeContextProvider></Provider>
        );

        expect(mockUpdateEditingFields).toBeCalled()
    });

    it('displays the scenario description correctly', () => {
        renderComponent();

        const baseDescription = screen.getByText('Base description');
        const scenarioDescription = screen.getByText('Scenario description');

        expect(baseDescription).toBeInTheDocument();
        expect(scenarioDescription).toBeInTheDocument();
    });

  

    it('renders the close icon', () => {
        renderComponent();

        const closeIcon = screen.getByTestId('close-icon');
        expect(closeIcon).toBeInTheDocument();
    });

    it('handles missing description gracefully', () => {
        const missingDescriptionProps = {
            ...defaultProps,
            SavedScenarioprops: {
                ...defaultProps.SavedScenarioprops,
                description: [],
            },
        };

        renderComponent(missingDescriptionProps);

        expect(screen.queryByText('Base description')).not.toBeInTheDocument();
        expect(screen.queryByText('Scenario description')).not.toBeInTheDocument();
    });
});
