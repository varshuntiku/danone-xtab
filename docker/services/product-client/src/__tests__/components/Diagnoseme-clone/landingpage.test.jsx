import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import LandingPage from '../../../components/Diagnoseme-clone/landingPage';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import store from 'store/store';
import '@testing-library/jest-dom';

import { vi } from 'vitest';

const history = createMemoryHistory();

describe('LandingPage', () => {
    it('should render welcome message and button initially', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <LandingPage />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('Welcome to')).toBeInTheDocument();
        expect(screen.getByText('Diagnoseme')).toBeInTheDocument();
        expect(screen.getByText('Your self-care solution.')).toBeInTheDocument();
        expect(screen.getByText('Take care of your health with')).toBeInTheDocument();
        expect(screen.getByText('our user-friendly health-care test app,')).toBeInTheDocument();
        expect(screen.getByText('putting wellness in your hands')).toBeInTheDocument();

        const startButton = screen.getByText('Start Diagnosis');
        expect(startButton).toBeInTheDocument();
    });

    it('should render StepperForm when Start Diagnosis button is clicked', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <LandingPage />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const startButton = screen.getByText('Start Diagnosis');
        fireEvent.click(startButton);

        await waitFor(() => {
            expect(screen.getByText('1')).toBeInTheDocument();
        });
    });
});
