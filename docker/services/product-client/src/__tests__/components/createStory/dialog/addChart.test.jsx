import React from 'react';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import AddCharts from '../../../../components/createStory/dialog/addChart';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts AddCharts Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AddCharts
                        selectedGraph={data.selectedGraph}
                        nameFlag={data.nameFlag}
                        onGraphDataChange={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByLabelText('add'));
        act(() => {
            screen.getByLabelText('secondary checkbox').click();
            fireEvent.change(screen.getByLabelText('secondary checkbox'), {
                target: { checked: true }
            });
        });
        fireEvent.click(screen.getByRole('button', { name: 'Done' }));
        fireEvent.click(screen.getByLabelText('add'));
        fireEvent.click(screen.getByLabelText('close'));
    });
});

const data = {
    selectedGraph: {
        396: {
            content_id: 396,
            name: ' sales across top products',
            metadata: { test_key_1: 'test_val_1', test_key_2: 'test_val_2' },
            value: '{"data": {"values": [["14.75M"]], "columns": ["sum_volume"]}, "layout": {}}',
            app_screen_id: null,
            app_screen_widget_id: null,
            is_label: false,
            app_screen_widget_value_id: null
        }
    },
    nameFlag: false
};
