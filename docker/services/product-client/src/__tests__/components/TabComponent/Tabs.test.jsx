import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import NavTabs from '../../../components/TabComponent/Tabs.jsx';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts NavTabs Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <NavTabs {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});

const Props = {
    classes: {},
    selected_industry: 'Revenue Management'
};
