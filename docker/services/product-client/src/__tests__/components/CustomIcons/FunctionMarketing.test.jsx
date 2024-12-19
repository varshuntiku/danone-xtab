import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import FunctionMarketing from '../../../components/CustomIcons/FunctionMarketing';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts FunctionMarketing  Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <FunctionMarketing {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});

const Props = {};
