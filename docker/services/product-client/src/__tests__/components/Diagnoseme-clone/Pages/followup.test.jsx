import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import Followup from '../../../../components/Diagnoseme-clone/pages/followup';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import store from 'store/store';
import '@testing-library/jest-dom';

import { vi } from 'vitest';
const history = createMemoryHistory();
describe('Followup Component', () => {
    test('renders the Followup component with the correct text', () => {
        render(<Followup />);
        const followupText = screen.getByText('FOLLOW UP - IN PROGRESS');
        expect(followupText).toBeInTheDocument();
    });

    test('renders the Typography component with the correct variant', () => {
        render(<Followup />);
        const typographyElement = screen.getByText('FOLLOW UP - IN PROGRESS');
        expect(typographyElement.tagName).toBe('H2');
    });
});
