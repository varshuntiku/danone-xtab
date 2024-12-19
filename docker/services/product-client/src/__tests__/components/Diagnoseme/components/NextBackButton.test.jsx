import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import NextBackButtonComponent from '../../../../components/Diagnoseme/components/NextBackButtonComponent';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import store from 'store/store';
import '@testing-library/jest-dom';

import { vi } from 'vitest';

describe('NextBackButtonComponent', () => {
    const mockHandleBack = vi.fn();
    const mockHandleNext = vi.fn();

    const buttonData = [
        1, // activeStep
        mockHandleBack, // handleBack
        mockHandleNext, // handleNext
        ['Step 1', 'Step 2', 'Step 3'] // steps
    ];

    it('should render without crashing', () => {
        render(<NextBackButtonComponent buttonData={buttonData} />);

        expect(screen.getByText('Back')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('should display "Finish" on the Next button when activeStep is the last step', () => {
        const buttonDataWithLastStep = [
            2, // activeStep (last step for a 3-step process)
            mockHandleBack,
            mockHandleNext,
            ['Step 1', 'Step 2', 'Step 3']
        ];

        render(<NextBackButtonComponent buttonData={buttonDataWithLastStep} />);

        expect(screen.getByText('Finish')).toBeInTheDocument();
    });

    it('should call handleBack when Back button is clicked', () => {
        render(<NextBackButtonComponent buttonData={buttonData} />);

        fireEvent.click(screen.getByText('Back'));
        expect(mockHandleBack).toHaveBeenCalled();
    });

    it('should call handleNext when Next button is clicked', () => {
        render(<NextBackButtonComponent buttonData={buttonData} />);

        fireEvent.click(screen.getByText('Next'));
        expect(mockHandleNext).toHaveBeenCalled();
    });

    it('should apply correct styles to buttons', () => {
        render(<NextBackButtonComponent buttonData={buttonData} />);

        const backButton = screen.getByText('Back');
        const nextButton = screen.getByText('Next');

        expect(backButton).toHaveClass('MuiButton-label');
        expect(nextButton).not.toHaveClass('marginRight');
    });
});
