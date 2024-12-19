import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import DocumentRenderer from '../../../components/document-renderer/DocumentRederer';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import store from 'store/store';
import '@testing-library/jest-dom';

import { vi } from 'vitest';

const history = createMemoryHistory();
describe('DocumentRenderer Component', () => {
    const mockDocuments = [
        { path: '/path/to/document1.pdf', filename: 'document1.pdf' },
        { name: 'document2.pdf', type: 'application/pdf', size: 12345 }
    ];

    beforeEach(() => {
        global.URL.createObjectURL = vi.fn(() => 'mocked-url');
        global.URL.revokeObjectURL = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders correctly with document paths', () => {
        render(<DocumentRenderer documents={[mockDocuments[0]]} />);
    });

    it('calls createObjectURL for documents without paths', () => {
        render(<DocumentRenderer documents={[mockDocuments[1]]} />);

        expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
    });

    it('cleans up object URLs on unmount', () => {
        const { unmount } = render(<DocumentRenderer documents={[mockDocuments[1]]} />);

        unmount();

        expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mocked-url');
    });
});
