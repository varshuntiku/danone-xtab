import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store/store';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { vi } from 'vitest';
import MenuHexagon from '../../../../components/Healthcaredashboard/components/MenuHexagon';
const history = createMemoryHistory();
vi.mock('../data', () => ({
    icons: {
        'Health care': '/path/to/healthcare/icon',
        Industry1: '/path/to/industry1/icon',
        default: '/path/to/default/icon'
    }
}));

describe('MenuHexagon Component', () => {
    let clickedHexagon, setShow, setPosition;

    beforeEach(() => {
        clickedHexagon = vi.fn();
        setShow = vi.fn();
        setPosition = vi.fn();
    });

    it('renders with the correct category name and icon', () => {
        const category = { name: 'Health care', color: '#000' };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MenuHexagon
                            category={category}
                            clickedHexagon={clickedHexagon}
                            setShow={setShow}
                            setPosition={setPosition}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const icon = screen.getByAltText('icon');
        const text = screen.getByText('Health care');

        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute(
            'src',
            '/src/components/Healthcaredashboard/icons/HealthCare.svg'
        );
        expect(text).toBeInTheDocument();
    });

    it('applies the correct styles based on category color', () => {
        const category = { name: 'Industry1', color: '#FF5733' };

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MenuHexagon
                            category={category}
                            clickedHexagon={clickedHexagon}
                            setShow={setShow}
                            setPosition={setPosition}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('Industry1'));
    });
});
