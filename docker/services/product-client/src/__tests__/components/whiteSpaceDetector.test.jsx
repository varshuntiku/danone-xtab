import CustomThemeContextProvider from '../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store/store';

import '@testing-library/jest-dom';
import WhiteSpaceDetector from '../../components/WhiteSpaceDetector';

const history = createMemoryHistory();

const defaultProps = {
    params: {
        dropdownIconsStyle: {},
        legends: [],
        rowHeadData: [],
        columnHeadData: [],
        cellsData: {},
        iconsList: [],
        displayIcons: false,
        isSingleSelect: false
    },
    onAction: vi.fn()
};
describe('WhiteSpaceDetector', () => {
    it('should render without crashing', () => {
        render(<WhiteSpaceDetector {...defaultProps} />);

        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should handle icon component rendering correctly', () => {
        const { container } = render(<WhiteSpaceDetector {...defaultProps} />);

        const icons = container.querySelectorAll('img');
        expect(icons.length).toBe(0);
    });

    it('should handle dropdown changes correctly', () => {
        const { container } = render(<WhiteSpaceDetector {...defaultProps} />);

        const selectElement = container.querySelector('select');
        if (selectElement) {
            fireEvent.change(selectElement, { target: { value: 'new-value' } });
        }
    });
});
