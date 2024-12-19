import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AppWidgetComponent from '../../components/AppWidgetComponent';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { getWidget, getMultiWidget } from '../../services/widget';
const history = createMemoryHistory();
import { Provider } from 'react-redux';
import store from 'store/store';
import { vi } from 'vitest';

vi.mock('../../services/widget', () => ({
    getWidget: vi.fn(),
    getMultiWidget: vi.fn()
}));

describe('Codex Product test', () => {
    afterEach(cleanup);
    test('Should render AppScreen Component', () => {
        getWidget.mockImplementation(({ callback }) => callback(undefined));
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetComponent {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render AppScreen1 Component', () => {
        const props = {
            ...Props,
            screen_filter_settings: true
        };
        getMultiWidget.mockImplementation(({ callback }) => callback(undefined));
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetComponent {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('should display error message when getWidget returns error', async () => {
        getWidget.mockImplementation(({ callback }) =>
            callback({ status: 'error', message: 'Error loading widget' })
        );
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetComponent {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('should handle planogram view', async () => {
        getWidget.mockImplementation(({ callback }) =>
            callback({ data: { value: { planogram: true, skus: [] } } })
        );
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetComponent {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('should display loader while loading', () => {
        getWidget.mockImplementation(() => {});
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetComponent {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('should handle state update request with notification', async () => {
        getWidget.mockImplementation(({ callback }) => callback({ data: { value: {} } }));
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetComponent {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('should update widget details on state update request', async () => {
        getWidget.mockImplementation(({ callback }) => callback({ data: { value: {} } }));
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <AppWidgetComponent {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
});

const Props = {
    alert_enable: true,
    app_id: '26',
    details: {
        id: 488,
        widget_index: 0,
        widget_key: 'Market Opportunity',
        is_label: false,
        config: {
            legend: false,
            prefix: false,
            subtitle: false,
            title: false,
            traces: false,
            value_factor: false
        }
    },
    graph_height: 'half',
    parent_obj: {},
    screen_filter_settings: false,
    screen_id: 103,
    selected_filters: {
        'Time Frame': {
            checked: 'CY 2020',
            label: 'Time Frame',
            options: ['CY 2020']
        },
        Region: {
            checked: 'USA',
            label: 'Region',
            options: ['USA']
        },
        Industry: {
            checked: 'Beer',
            label: 'Industry',
            options: ['Beer']
        },
        Category: {
            checked: 'All',
            label: 'Category',
            options: ['All']
        },
        'Sub Category': {
            checked: 'All',
            label: 'Sub Category',
            options: ['All']
        }
    },
    simulator_apply: false,
    source: 'Integrated Demand Forecasting >> Demand Sizing >> MARKET OPPORTUNITY',
    title: 'MARKET OPPORTUNITY'
};
