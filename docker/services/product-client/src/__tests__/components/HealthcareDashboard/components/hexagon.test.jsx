import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import IconEditor from '../../../../components/gridTable/IconEditor';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';
import Hexagon from '../../../../components/Healthcaredashboard/components/hexagon';
const history = createMemoryHistory();

vi.mock('../data', () => ({
    icons: {
        health: 'health-icon.png',
        fitness: 'fitness-icon.png'
    }
}));

describe('Hexagon Component', () => {
    it('should render correctly with category props', () => {
        const category = { name: 'fitness', color: '#FF5733' };

        render(<Hexagon category={category} clickedHexagon={vi.fn()} />);

        expect(screen.getByText('fitness')).toBeInTheDocument();
    });
});
