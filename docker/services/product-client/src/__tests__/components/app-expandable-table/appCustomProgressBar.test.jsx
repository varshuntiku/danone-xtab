import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import AppCustomizedProgressBars from '../../../components/app-expandable-table/appCustomProgressBar.jsx';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts AppCustomizedProgressBars Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppCustomizedProgressBars {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});

const Props = {
    data: { value: 1212.323 }
};
