import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store/store';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { vi } from 'vitest';
import Industries from '../../../../components/Healthcaredashboard/components/Industries';

vi.mock('../../../../components/Healthcaredashboard/data', () => ({
    data: [
        { id: 1, name: 'Industry1', parent_id: null },
        { id: 2, name: 'Industry2', parent_id: 1 }
    ],
    dataicons: {
        Category1: {
            Key1: 'icon1.svg',
            Key2: 'icon2.svg',
            Key3: 'icon3.svg',
            Key4: 'icon4.svg',
            Key5: 'icon5.svg'
        }
    },
    childicons: {
        Category1: ['icon1', 'icon2', 'icon3']
    }
}));

vi.mock('../../../../components/Healthcaredashboard/components/leftmenu', () => ({
    default: vi.fn(() => <div>LeftMenu Component</div>)
}));
vi.mock('../../../../components/Healthcaredashboard/components/ChildHexagon', () => ({
    default: vi.fn(() => <div>ChildHexagon Component</div>)
}));
vi.mock('../../../../components/Healthcaredashboard/components/Box', () => ({
    default: vi.fn(() => <div>Box Component</div>)
}));
vi.mock('../../../../components/Healthcaredashboard/components/Newhexagon', () => ({
    default: vi.fn(() => <div>Newhexagon Component</div>)
}));

describe('Industries Component', () => {
    let category;

    beforeEach(() => {
        category = { name: 'Category1', color: 'blue' };
    });

    it('renders the Industries component', () => {
        render(<Industries clickedHexagon={null} category={category} />);
        expect(screen.getByText('LeftMenu Component')).toBeInTheDocument();
        expect(screen.getByText('ChildHexagon Component')).toBeInTheDocument();
    });

    it('displays the Box component when show.displayTop is true', () => {
        render(<Industries clickedHexagon={null} category={category} />);

        expect(screen.getByText('LeftMenu Component')).toBeInTheDocument();
    });

    it('calls closeBox when cancel icon is clicked', () => {
        render(<Industries clickedHexagon={null} category={category} />);

        expect(screen.queryByText('Box Component')).not.toBeInTheDocument();
    });

    it('handles level 5 icons correctly', () => {
        category = { name: 'Category1', color: 'blue', level: 5 };
        render(<Industries clickedHexagon={null} category={category} />);

        expect(screen.getByText('ChildHexagon Component')).toBeInTheDocument();
    });
});
