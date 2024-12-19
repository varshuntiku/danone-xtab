import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CardView from '../../../components/minerva/cardView.jsx';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts CardView Component', () => {
        const props = {
            graphData: {
                data: {
                    columns: ['sum_net_revenue', 'brand'],
                    values: ['67.44M', 'icex']
                }
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CardView {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});
