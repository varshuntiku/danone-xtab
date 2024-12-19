import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import store from 'store/store';
import AppWidgetDropdownView from '../../components/AppWidgetDropdownView';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../components/AppWidgetGraph', () => {
    return {
        default: (props) => (
            <>
                App Widget Graph Mock component
                {
                    <button onClick={() => (props.onClick = {})} aria-label="test button">
                        Test onClick
                    </button>
                }
            </>
        )
    };
});

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render AppWidgetDropDownView Component', () => {
        const props = {
            parent_obj: {
                props: 'Object',
                context: 'Object',
                refs: 'Object',
                updater: 'Object',
                onResponseGetScreen: 'fn()',
                getLabels: 'fn()',
                getGraphs: 'fn()',
                getWidgetData: 'fn()',
                onApplySimulator: 'fn()',
                onSimulatorApplyDrilldown: 'fn()',
                state: 'Object',
                _reactInternalFiber: 'Object',
                _reactInternalInstance: 'Object',
                isReactComponent: 'Object',
                setState: 'fn()',
                forceUpdate: 'fn()'
            },
            app_id: '269',
            screen_id: 6781,
            title: 'INVENTORY REVIEW',
            details: {
                id: 18115,
                widget_index: 0,
                widget_key: 'Inventory Review',
                is_label: false,
                config: 'Object'
            },
            selected_filters: {
                Region: { options: ['All'], checked: 'All', label: 'Region' },
                Category: {
                    options: [
                        'Air Conditioner',
                        'Mobiles',
                        'Refrigerator',
                        'Tablets',
                        'Washing Machines'
                    ],
                    checked: 'Air Conditioner',
                    label: 'Category'
                },
                Year: { options: ['2018', '2019', '2020', '2021'], checked: '2018', label: 'Year' },
                Month: { options: ['Q1', 'Q2'], checked: 'Q1', label: 'Month' },
                Product: { options: ['Product 1'], checked: 'Product 1', label: 'Product' }
            },
            simulator_apply: false,
            graph_height: 'full',
            screen_filter_settings: false,
            widgetData: {
                data: {
                    widget_value_id: 1124755,
                    value: {
                        views: ['test', 'test'],
                        options: ['option1', 'option2', 'option3']
                    },
                    simulated_value: false
                }
            },
            onStateUpdateRequest: () => {},
            updateDataStateKey: () => {}
        };
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetDropdownView {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
});
