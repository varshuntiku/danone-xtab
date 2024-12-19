import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import DateRenderer from '../../../../components/gridTable/cell-renderer/dateRenderer';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts DateRenderer Component', () => {
        const params = {
            value: '01/21/2022',
            format: 'MM/DD/YYYY'
        };

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DateRenderer params={params} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts DateRenderer Component 1', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DateRenderer params={{}} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts DateRenderer Component 2', () => {
        const params = {
            value: '01/21/2022'
        };

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DateRenderer params={params} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});
