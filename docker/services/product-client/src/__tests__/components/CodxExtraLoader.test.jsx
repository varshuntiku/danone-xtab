import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { expect, vi } from 'vitest';
import CodxExtraLoader from '../../components/CodxExtraLoader';
import { Provider } from 'react-redux';
import store from 'store/store';

const history = createMemoryHistory();

describe('CodxExtraLoader', () => {
    it('should render without crashing', () => {
        const { container } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CodxExtraLoader />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(container).toBeInTheDocument();
    });
    it('should apply center class when params.center is true', () => {
        const { container } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CodxExtraLoader params={{ center: true }} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        console.log(container.innerHTML);
        expect(container.getElementsByClassName('.center'));
    });
    it('should apply custom size to loader', () => {
        const { container } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CodxExtraLoader params={{ size: '50px' }} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const loader = container.querySelector('svg');
        expect(loader).toHaveAttribute('height', '50px');
        expect(loader).toHaveAttribute('width', '50px');
    });
    it('should display loaderText when provided', () => {
        const { getByText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <CodxExtraLoader
                            params={{ loaderText: 'Loading...', loaderTextSize: '3rem' }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        const textElement = getByText('Loading...');
        expect(textElement).toBeInTheDocument();
        expect(textElement).toHaveStyle('font-size: 3rem');
    });
});
