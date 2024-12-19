import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import Diagnosis from '../../../../components/Diagnoseme/pages/diagnosis';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import store from 'store/store';
import '@testing-library/jest-dom';

import { vi } from 'vitest';
const history = createMemoryHistory();
const renderWithRedux = (component) => {
    return {
        ...render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>{component}</Router>
                </CustomThemeContextProvider>
            </Provider>
        ),
        store
    };
};

describe('Diagnosis Component', () => {
    const props = {
        activeStep: 0,
        handleNextStep: vi.fn(),
        handleBackStep: vi.fn(),
        handleChange: vi.fn(),
        steps: ['Step 1', 'Step 2']
    };

    test('renders without crashing', () => {
        renderWithRedux(<Diagnosis {...props} />);
        expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Age')).toBeInTheDocument();
        expect(screen.getByText('Gender')).toBeInTheDocument();
    });

    test('handles name input change', () => {
        renderWithRedux(<Diagnosis {...props} />);
        const nameInput = screen.getByPlaceholderText('Name');
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        expect(props.handleChange).toHaveBeenCalledWith('step1', 'name', 'John Doe');
    });

    test('shows validation message if name is invalid', () => {
        renderWithRedux(<Diagnosis {...props} />);
        const nameInput = screen.getByPlaceholderText('Name');
        fireEvent.change(nameInput, { target: { value: 'John123' } });
        expect(screen.getByText('Please entert the valid name')).toBeInTheDocument();
    });

    test('handles age input change', () => {
        renderWithRedux(<Diagnosis {...props} />);
        const ageInput = screen.getByPlaceholderText('Age');
        fireEvent.change(ageInput, { target: { value: '25' } });
        expect(props.handleChange).toHaveBeenCalledWith('step1', 'age', '25');
    });

    test('shows validation message if age is invalid', () => {
        renderWithRedux(<Diagnosis {...props} />);
        const ageInput = screen.getByPlaceholderText('Age');
        fireEvent.change(ageInput, { target: { value: '200' } });
        expect(screen.getByText('Please enter the valid age')).toBeInTheDocument();
    });

    test('handles gender selection', () => {
        renderWithRedux(<Diagnosis {...props} />);
        const maleRadio = screen.getByLabelText('Male');
        fireEvent.click(maleRadio);
        expect(props.handleChange).toHaveBeenCalledWith('step1', 'gender', 'male');
    });

    test('shows validation message if gender is not selected', () => {
        const modifiedProps = {
            ...props,
            handleNextStep: vi.fn()
        };
        renderWithRedux(<Diagnosis {...modifiedProps} />);
        fireEvent.click(screen.getByText('Next'));
        expect(screen.getByText('Please select the gender')).toBeInTheDocument();
    });

    test('renders Symptoms component if symptomsPage is true', () => {
        renderWithRedux(<Diagnosis {...props} />);
        expect(screen.queryByText('Symptoms')).not.toBeInTheDocument();
    });
});
