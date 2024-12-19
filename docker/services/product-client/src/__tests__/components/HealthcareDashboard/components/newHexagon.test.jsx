import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store/store';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { vi } from 'vitest';
import Newhexagon from '../../../../components/Healthcaredashboard/components/newhexagon';
const history = createMemoryHistory();

describe('Newhexagon Component', () => {
    it('renders correctly with given props', () => {
        render(<Newhexagon data="/path/to/icon.svg" color="#FF5733" />);

        const imgElement = screen.getByAltText('icon');
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', '/path/to/icon.svg');
        expect(imgElement).toHaveClass('makeStyles-img-4');
    });

    it('applies default background color if none is provided', () => {
        render(<Newhexagon data="/path/to/icon.svg" />);

        const imgElement = screen.getByAltText('icon');
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', '/path/to/icon.svg');
    });
});
