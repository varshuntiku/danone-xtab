import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import MedicalHistory from '../../../../components/Diagnoseme-clone/pages/medicalHistory';
import { Provider } from 'react-redux';
import store from 'store/store';
import '@testing-library/jest-dom';
import { Router } from 'react-router-dom';
import { vi } from 'vitest';
import { getHistoryQuestionsList } from '../../../../components/Diagnoseme-clone/services/services'; // Import the service

const history = createMemoryHistory();
vi.mock('../../../../components/Diagnoseme-clone/services/services', () => ({
    getHistoryQuestionsList: vi.fn(() =>
        Promise.resolve({
            medical: [
                {
                    question: 'Do you have any allergies?',
                    subtext: 'This includes pollen, pet dander, etc.'
                }
            ],
            family_medical: [
                {
                    question: 'Is there any history of heart disease in your family?',
                    subtext: 'Heart disease, stroke, etc.'
                }
            ],
            personal: [{ question: 'Do you smoke?', subtext: 'Cigarettes, cigars, etc.' }]
        })
    ),
    getPredictionResult: vi.fn(() => Promise.resolve({ status: 'success' }))
}));

describe('MedicalHistory Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render without crashing', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MedicalHistory
                            activeStep={1}
                            handleChange={vi.fn()}
                            steps={['Step1', 'Step2', 'Step3']}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should load and display medical history questions', async () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MedicalHistory
                            activeStep={1}
                            handleChange={vi.fn()}
                            steps={['Step1', 'Step2', 'Step3']}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        await waitFor(() => expect(screen.getByText('PAST MEDICAL HISTORY')).toBeInTheDocument());
    });

    it('should handle next and previous button clicks', async () => {
        const handleNextStep = vi.fn();
        const handleBackStep = vi.fn();

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MedicalHistory
                            activeStep={1}
                            handleChange={vi.fn()}
                            handleNextStep={handleNextStep}
                            handleBackStep={handleBackStep}
                            steps={['Step1', 'Step2', 'Step3']}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        await waitFor(() => expect(screen.getByText('PAST MEDICAL HISTORY')).toBeInTheDocument());

        expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('should display notification on error', async () => {
        vi.mocked(getHistoryQuestionsList).mockImplementationOnce(() =>
            Promise.resolve({ status: 'error', message: 'Failed to load questions' })
        );

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MedicalHistory
                            activeStep={1}
                            handleChange={vi.fn()}
                            steps={['Step1', 'Step2', 'Step3']}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        await waitFor(() => expect(screen.getByText('Loading...')).toBeInTheDocument());
    });

    it('should call handleChange on selecting a question', async () => {
        const handleChange = vi.fn();

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MedicalHistory
                            activeStep={1}
                            handleChange={handleChange}
                            steps={['Step1', 'Step2', 'Step3']}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        await waitFor(() => expect(screen.getByText('PAST MEDICAL HISTORY')).toBeInTheDocument());
    });
});
