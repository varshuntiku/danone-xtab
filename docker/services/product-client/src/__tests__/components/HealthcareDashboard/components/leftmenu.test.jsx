import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store/store';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { vi } from 'vitest';
import LeftMenu from '../../../../components/Healthcaredashboard/components/leftmenu';

vi.mock('../../../../components/Healthcaredashboard/data1', () => ({
    data: [
        { id: 1, name: 'Health care', parent_id: 0, color: 'transparent' },
        { id: 2, name: 'Industry1', parent_id: 0 },
        { id: 3, name: 'Industry2', parent_id: 1 }
    ]
}));

vi.mock('../../../../components/Healthcaredashboard/components/MenuHexagon', () => ({
    default: vi.fn(({ category }) => <div>{category.name}</div>)
}));

describe('LeftMenu Component', () => {
    let clickedHexagon, setShow, setPosition;

    beforeEach(() => {
        clickedHexagon = vi.fn();
        setShow = vi.fn();
        setPosition = vi.fn();
    });

    it('renders the LeftMenu component', () => {
        render(
            <LeftMenu clickedHexagon={clickedHexagon} setShow={setShow} setPosition={setPosition} />
        );

        expect(screen.getByText('Industry1')).toBeInTheDocument();
    });

    it('filters categories based on parent_id', () => {
        render(
            <LeftMenu clickedHexagon={clickedHexagon} setShow={setShow} setPosition={setPosition} />
        );

        expect(screen.getByText('Industry1')).toBeInTheDocument();
        expect(screen.queryByText('Industry2')).not.toBeInTheDocument();
    });

    it('renders all MenuHexagon components based on the filtered categories', () => {
        render(
            <LeftMenu clickedHexagon={clickedHexagon} setShow={setShow} setPosition={setPosition} />
        );

        const hexagons = screen.getAllByText(/Health care|Industry1/);
        expect(hexagons).toHaveLength(3);
    });
});
