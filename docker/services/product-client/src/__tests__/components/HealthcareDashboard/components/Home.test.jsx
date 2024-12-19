import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import IconEditor from '../../../../components/gridTable/IconEditor';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';
import Home from '../../../../components/Healthcaredashboard/components/Home';
const history = createMemoryHistory();

vi.mock('../data1', () => ({
    data: [
        { id: 0, name: 'Category 1', color: '#FF5733', parent_id: 0 },
        { id: 1, name: 'Category 2', color: '#33FF57', parent_id: 0 },
        { id: 2, name: 'Category 3', color: '#5733FF', parent_id: 0 },
        { id: 3, name: 'Category 4', color: '#FF33A5', parent_id: 0 }
    ]
}));

vi.mock('../connectors/landingconnector.svg', () => 'mock-svg-url');

describe('Home Component', () => {
    it('should render correctly with Hexagon components', () => {
        const clickedHexagon = vi.fn();

        render(<Home clickedHexagon={clickedHexagon} />);

        expect(screen.getByText('Manufacturers')).toBeInTheDocument();

        expect(screen.getByText('Health care')).toBeInTheDocument();
    });

    it('should pass the clickedHexagon function to Hexagon components', () => {
        const clickedHexagon = vi.fn();

        render(<Home clickedHexagon={clickedHexagon} />);

        expect(clickedHexagon).not.toHaveBeenCalled();
    });
});
