import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CustomRadioButtons from '../../../../../components/Diagnoseme-clone/components/forms/CustomRadioButtons';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import store from 'store/store';
import '@testing-library/jest-dom';

import { vi } from 'vitest';

const history = createMemoryHistory();

describe('CustomRadioButtons Component', () => {
    const mockRadioButtonData = ['radio1', 'Yes', vi.fn(), false];

    const mockRadioButtonDataWithError = ['radio1', '', vi.fn(), true];

    it('renders without crashing', () => {
        render(<CustomRadioButtons radioButtonData={mockRadioButtonData} />);

        expect(screen.getByRole('radio', { name: /Yes/i })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: /No/i })).toBeInTheDocument();
    });

    it('displays the correct radio value as selected', () => {
        render(<CustomRadioButtons radioButtonData={mockRadioButtonData} />);

        const yesRadio = screen.getByRole('radio', { name: /Yes/i });
        const noRadio = screen.getByRole('radio', { name: /No/i });

        expect(yesRadio).toBeChecked();
        expect(noRadio).not.toBeChecked();
    });

    it('calls handleRadioValueChange when a different radio option is selected', () => {
        render(<CustomRadioButtons radioButtonData={mockRadioButtonData} />);

        const noRadio = screen.getByRole('radio', { name: /No/i });
        fireEvent.click(noRadio);

        expect(mockRadioButtonData[2]).toHaveBeenCalled();
    });

    it('displays an error message when radioError is true', () => {
        render(<CustomRadioButtons radioButtonData={mockRadioButtonDataWithError} />);

        expect(screen.getByText('Please select one option')).toBeInTheDocument();
    });

    it('does not display an error message when radioError is false', () => {
        render(<CustomRadioButtons radioButtonData={mockRadioButtonData} />);

        expect(screen.queryByText('Please select one option')).not.toBeInTheDocument();
    });
});
