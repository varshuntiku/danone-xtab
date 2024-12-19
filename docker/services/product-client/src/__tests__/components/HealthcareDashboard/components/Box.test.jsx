import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import IconEditor from '../../../../components/gridTable/IconEditor';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';
import Box from '../../../../components/Healthcaredashboard/components/Box';
const history = createMemoryHistory();

vi.mock('./card', () => ({
    __esModule: true,
    default: ({ color, children }) => <div style={{ backgroundColor: color }}>{children}</div>
}));

describe('Box Component', () => {
    it('should render correctly with provided props', () => {
        const functions = {
            icon: 'icon-url.png',
            children: [
                { id: 1, name: 'Function 1', color: 'red' },
                { id: 2, name: 'Function 2', color: 'blue' }
            ]
        };
        const subfunctions = { functionheading: '', subfunctions: [], show: false };
        const setSubfunctions = vi.fn();

        render(
            <Box
                functions={functions}
                subfunctions={subfunctions}
                setSubfunctions={setSubfunctions}
            />
        );

        expect(screen.getByAltText('icon')).toHaveAttribute('src', 'icon-url.png');

        expect(screen.getByText('Function 1')).toBeInTheDocument();
        expect(screen.getByText('Function 2')).toBeInTheDocument();
    });

    it('should display subfunctions when show is true', () => {
        const functions = {
            icon: 'icon-url.png',
            children: [{ id: 1, name: 'Function 1', color: 'red' }]
        };
        const subfunctions = {
            functionheading: 'Function 1',
            subfunctions: [{ id: 1, name: 'Subfunction 1', color: 'green' }],
            show: true
        };
        const setSubfunctions = vi.fn();

        render(
            <Box
                functions={functions}
                subfunctions={subfunctions}
                setSubfunctions={setSubfunctions}
            />
        );

        expect(screen.getByText('Subfunction 1')).toBeInTheDocument();
    });
});
