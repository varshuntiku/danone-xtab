import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import UploadReports from '../../../../components/Diagnoseme/pages/uploadReports';
import { Provider } from 'react-redux';
import store from 'store/store';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

const history = createMemoryHistory();

describe('UploadReports Component', () => {
    test('renders the component with the correct text', () => {
        render(<UploadReports />);

        expect(screen.getByText('UPLOAD REPORTS - IN PROGRESS')).toBeInTheDocument();
    });

    test('renders Typography with correct variant', () => {
        render(<UploadReports />);

        const typography = screen.getByText('UPLOAD REPORTS - IN PROGRESS');
        expect(typography).toBeInTheDocument();
    });
});
