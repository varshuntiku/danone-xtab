import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import RightFullScreenPopup from '../../../../components/Diagnoseme-clone/pages/reportPopup';
import { Provider } from 'react-redux';
import store from 'store/store';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

const history = createMemoryHistory();

vi.mock('../../../../components/Diagnoseme/assets/img/medical_department1.png', () => '');
vi.mock('assets/img/connCalender.svg', () => ({
    ReactComponent: (props) => <svg {...props} />
}));
vi.mock('../../../../components/Diagnoseme/assets/img/stethoscope.svg', () => ({
    ReactComponent: (props) => <svg {...props} />
}));
vi.mock('../../../../components/Diagnoseme/assets/img/lab-test.svg', () => ({
    ReactComponent: (props) => <svg {...props} />
}));

describe('RightFullScreenPopup Component', () => {
    test('renders the popup with all expected text and elements', () => {
        render(<RightFullScreenPopup onClose={() => {}} />);

        expect(screen.getByText('Insulinoma')).toBeInTheDocument();
        expect(screen.getByText('Seek Medical Help')).toBeInTheDocument();
        expect(screen.getByText('Department')).toBeInTheDocument();
        expect(screen.getByText('Supporting Symptoms')).toBeInTheDocument();
        expect(screen.getByText('Recommended Lab Tests for Insulinoma')).toBeInTheDocument();
        expect(screen.getByText('Headache, Blurry vision, Runny None')).toBeInTheDocument();
        expect(screen.getByText('Recommended Consultation:')).toBeInTheDocument();
        expect(screen.getByText('Schedule Lab test')).toBeInTheDocument();
        expect(screen.getByText('Schedule Appointment')).toBeInTheDocument();
    });

    test('renders the list of recommended lab tests', () => {
        render(<RightFullScreenPopup onClose={() => {}} />);

        const labTests = [
            'Blood Glucose test',
            'Fasting Test',
            'C-Peptide Test',
            'Proinsulin Levels',
            'CT Scan or MRI',
            'Endoscopic Ultrasound',
            'Insulin Antibody test',
            'Positron Emission Tomography',
            'Selective Arterial Calcium Stimulation Test (SACST)'
        ];

        labTests.forEach((test) => {
            expect(screen.getByText(test)).toBeInTheDocument();
        });
    });

    test('calls the onClose function when close button is clicked', () => {
        const onCloseMock = vi.fn();
        render(<RightFullScreenPopup onClose={onCloseMock} />);

        const closeButton = screen.getByLabelText('close');
        fireEvent.click(closeButton);

        expect(onCloseMock).toHaveBeenCalled();
    });

    test('renders the department image', () => {
        render(<RightFullScreenPopup onClose={() => {}} />);

        const image = screen.getByRole('img');
        expect(image).toBeInTheDocument();
    });

    test('renders the consultation information correctly', () => {
        render(<RightFullScreenPopup onClose={() => {}} />);

        const consultationInfo = screen.getAllByText('Dr. Laura Miller, MD (Doctor of Medicine)');
        expect(consultationInfo.length).toBe(2);
    });

    test('renders the schedule buttons with correct labels', () => {
        render(<RightFullScreenPopup onClose={() => {}} />);

        const scheduleLabTestButton = screen.getByText('Schedule Lab test');
        const scheduleAppointmentButton = screen.getByText('Schedule Appointment');

        expect(scheduleLabTestButton).toBeInTheDocument();
        expect(scheduleAppointmentButton).toBeInTheDocument();
    });
});
