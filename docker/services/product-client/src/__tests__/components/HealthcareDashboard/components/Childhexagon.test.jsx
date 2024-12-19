import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import IconEditor from '../../../../components/gridTable/IconEditor';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';
import ChildHexagon from '../../../../components/Healthcaredashboard/components/ChildHexagon';
const history = createMemoryHistory();

vi.mock('../data', () => ({
    icons: {
        health: 'health-icon.png',
        fitness: 'fitness-icon.png'
    }
}));

describe('ChildHexagon Component', () => {
    it('should render correctly with category props', () => {
        const category = { name: 'fitness', color: '#FF5733' };

        render(<ChildHexagon category={category} />);

        expect(screen.getByText('fitness')).toBeInTheDocument();
    });
});
