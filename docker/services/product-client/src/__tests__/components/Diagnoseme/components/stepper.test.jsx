import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import StepperForm from '../../../../components/Diagnoseme/components/stepper';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import store from 'store/store';
import '@testing-library/jest-dom';

import { vi } from 'vitest';

const history = createMemoryHistory();

describe('StepperForm', () => {
    it('renders without crashing', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <StepperForm />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
        expect(screen.getByText('Symptoms / Associated Symptoms')).toBeInTheDocument();
        expect(screen.getByText('Lifestyle / Medical History')).toBeInTheDocument();
    });
});
