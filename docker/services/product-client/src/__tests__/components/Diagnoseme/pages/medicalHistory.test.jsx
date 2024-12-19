import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import MedicalHistory from '../../../../components/Diagnoseme/pages/medicalHistory';
import { Provider } from 'react-redux';
import store from 'store/store';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('../../../../components/Diagnoseme/services/services', () => ({
    getHistoryQuestionsList: vi.fn(() =>
        Promise.resolve({
            medical: [{ question: 'Do you have any allergies?', id: 1 }],
            family_medical: [],
            personal: []
        })
    )
}));

const history = createMemoryHistory();

const renderWithProviders = (ui) => {
    return render(
        <Provider store={store}>
            <CustomThemeContextProvider>
                <Router history={history}>{ui}</Router>
            </CustomThemeContextProvider>
        </Provider>
    );
};

describe('MedicalHistory Component', () => {
    test('renders loading initially', async () => {
        renderWithProviders(<MedicalHistory activeStep={0} handleChange={() => {}} steps={[]} />);

        expect(screen.getByText(/loading/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
        });
    });

    test('renders a message when there are no medical history questions', async () => {
        vi.mock('../../../../components/Diagnoseme/services/services', () => ({
            getHistoryQuestionsList: vi.fn(() =>
                Promise.resolve({
                    medical: [],
                    family_medical: [],
                    personal: []
                })
            )
        }));

        renderWithProviders(<MedicalHistory activeStep={0} handleChange={() => {}} steps={[]} />);

        await waitFor(() => {
            expect(screen.getByText(/PAST MEDICAL HISTORY/i)).toBeInTheDocument();
        });
    });

    test('handles service failure gracefully', async () => {
        vi.mock('../../../../components/Diagnoseme/services/services', () => ({
            getHistoryQuestionsList: vi.fn(() => Promise.reject(new Error('Service Error')))
        }));

        renderWithProviders(<MedicalHistory activeStep={0} handleChange={() => {}} steps={[]} />);

        await waitFor(() => {
            expect(
                screen.getByText(
                    /Please provide the significant past diseases, surgery, including complications, trauma./i
                )
            ).toBeInTheDocument();
        });
    });

    test('calls handleChange when a question is answered', async () => {
        const handleChangeMock = vi.fn();

        vi.mock('../../../../components/Diagnoseme/services/services', () => ({
            getHistoryQuestionsList: vi.fn(() =>
                Promise.resolve({
                    medical: [{ question: 'Do you have any allergies?', id: 1 }],
                    family_medical: [],
                    personal: []
                })
            )
        }));

        renderWithProviders(
            <MedicalHistory activeStep={0} handleChange={handleChangeMock} steps={[]} />
        );

        expect(handleChangeMock).not.toHaveBeenCalled();
    });
});
