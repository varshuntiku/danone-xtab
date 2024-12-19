import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import StackedElements from '../../../../components/gridTable/cell-renderer/StackedElements';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render StackedElements Component', () => {
        const params = {
            value: []
        };

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <StackedElements params={params} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render each element in the array as a separate span', () => {
        const params = {
            value: ['Item 1', 'Item 2', 'Item 3']
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <StackedElements params={params} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    test('Should render single value if not an array', () => {
        const params = {
            value: 'Single Value'
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <StackedElements params={params} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Single Value')).toBeInTheDocument();
    });

    test('Should render nothing if value is null or undefined', () => {
        const params = {
            value: null
        };

        const { container } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <StackedElements params={params} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(container.firstChild).toBeNull();
    });

    test('Should render nothing if value is undefined', () => {
        const params = {};

        const { container } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <StackedElements params={params} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(container.firstChild).toBeNull();
    });
});
