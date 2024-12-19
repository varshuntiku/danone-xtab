import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AppWidgetKpi from '../../components/AppWidgetKpi';
import CustomThemeContextProvider from '../../themes/customThemeContext';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);
    test('Should render AppScreen Component', () => {
        const props = {
            params: {
                data: {
                    value: {
                        value: '37 %',
                        extra_dir: 'down',
                        is_kpi: true
                    }
                }
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetKpi {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render AppScreen Component', () => {
        const props = {
            params: {
                data: {
                    value: {
                        value: '37 %',
                        extra_dir: 'up',
                        is_kpi: true
                    }
                }
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetKpi {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render AppScreen Component', () => {
        const props = {
            params: {
                data: {
                    value: {
                        value: '37 %',
                        extra_dir: 'up',
                        is_kpi: true,
                        extra_value: '40%'
                    }
                }
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetKpi {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render AppScreen Component', () => {
        const props = {
            params: {
                data: false
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetKpi {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render with extra_dir as null', () => {
        const props = {
            params: {
                data: {
                    value: '37 %',
                    extra_dir: null,
                    is_kpi: true
                }
            }
        };
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AppWidgetKpi {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});
