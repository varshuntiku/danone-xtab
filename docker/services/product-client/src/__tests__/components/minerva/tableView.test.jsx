import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import DataTable from '../../../components/minerva/tableView';
import { vi } from 'vitest';
const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts DataTable Component', () => {
        const handleRequestSort = vi.fn();
        const props = {
            tableData: [
                [
                    642249869.8570938, 304865418.4946289, 236043426.3100586, 115761280.9508667,
                    33177264.272094727
                ],
                ['waterhut', 'drinksjet', 'icex', 'sodax', 'softella']
            ],
            tableHead: ['sum_net_revenue', 'brand']
            /* graphData: {
                data: {
                    columns: ['sum_net_revenue', 'brand'],
                    values: [
                        [642249869.8570938, 304865418.4946289, 236043426.3100586, 115761280.9508667, 33177264.272094727],
                        ['waterhut', 'drinksjet', 'icex', 'sodax', 'softella']
                    ]
                }
            } */
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DataTable {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const sortButton = screen.getByRole('button', { name: 'BRAND' });
        fireEvent.click(sortButton);
    });
});
