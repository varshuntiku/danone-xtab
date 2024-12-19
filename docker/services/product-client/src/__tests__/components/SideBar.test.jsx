import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import SideBar from '../../components/SideBar';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import store from 'store/store';
import { vi } from 'vitest';
import { Provider } from 'react-redux';

const history = createMemoryHistory();

vi.mock('../../components/minerva/MinervaChatbot', () => {
    return {
        default: (props) => <div>Minerva chat bot</div>
    };
});

describe('SideBar Component Tests', () => {
    afterEach(cleanup);

    const defaultProps = {
        parent: {
            props: { location: { pathname: '/app/26/dashboard' } },
            context: 'Object',
            refs: 'Object',
            updater: 'Object',
            onResponseGetApp: 'fn()',
            replaceUrl: 'fn()',
            setRouteUrl: 'fn()',
            getRoutes: 'fn()',
            getBreadcrumbs: 'fn()',
            handleStoriesCount: 'fn()',
            selectAllCharts: 'fn()',
            onResponseAddORCreateStory: 'fn()',
            shouldRenderStoriesActionPanel: 'fn()',
            shouldRenderSideBar: 'fn()',
            state: 'Object',
            createStoriesRef: 'Object',
            _reactInternalFiber: 'Object',
            _reactInternalInstance: 'Object',
            isReactComponent: 'Object',
            setState: 'fn()',
            forceUpdate: 'fn()'
        },
        is_restricted_user: false,
        app_id: '26',
        app_info: {
            id: 26,
            name: 'Integrated Demand Forecasting',
            theme: 'blue',
            screens: 'Array[31]',
            modules: 'Object',
            industry: 'CPG',
            function: 'Supply Chain',
            description: 'Forecast demand and potential growth opportunity',
            blueprint_link: '/projects/2/design',
            config_link: '/projects/2/case-studies/78/notebooks/101/app-configs/10/edit',
            approach_url: false,
            logo_url: false,
            small_logo_url: false,
            story_count: 8,
            restricted_app: false,
            is_user_admin: true,
            permissions: false
        },
        routes: [
            {
                screen_item: {
                    id: 101,
                    screen_index: 0,
                    screen_name: 'Demand Analysis',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: null,
                    graph_type: null,
                    horizontal: null,
                    rating_url: 'https://www.google.com/',
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                selected: false,
                original_href: '/app/26/demand analysis',
                href: '/app/26/demand analysis/size  opportunity/demand sizing',
                show: true,
                show_title: false,
                expanded: false,
                collapsed: true
            },
            {
                screen_item: {
                    id: 102,
                    screen_index: 1,
                    screen_name: 'Size & Opportunity',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                selected: false,
                original_href: '/app/26/demand analysis/size  opportunity',
                href: '/app/26/demand analysis/size  opportunity/demand sizing',
                level: 1,
                show: true,
                show_title: false
            },
            {
                screen_item: {
                    id: 103,
                    screen_index: 2,
                    screen_name: 'Demand Sizing',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: '2-1',
                    horizontal: null,
                    rating_url: null,
                    widget_count: 7,
                    screen_filters_values: false,
                    action_settings: false
                },
                selected: true,
                original_href: '/app/26/demand analysis/size  opportunity/demand sizing',
                href: '/app/26/demand analysis/size  opportunity/demand sizing',
                level: 2,
                show: true,
                show_title: true
            },
            {
                screen_item: {
                    id: 104,
                    screen_index: 3,
                    screen_name: 'Opportunity Breakdown',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 2,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 5,
                    screen_filters_values: false,
                    action_settings: false
                },
                selected: false,
                original_href: '/app/26/demand analysis/size  opportunity/opportunity breakdown',
                href: '/app/26/demand analysis/size  opportunity/opportunity breakdown',
                level: 2,
                show: true,
                show_title: true
            },
            {
                screen_item: {
                    id: 105,
                    screen_index: 4,
                    screen_name: 'Pattern Analysis',
                    screen_description: null,
                    screen_filters_open: null,
                    screen_image: null,
                    level: 1,
                    graph_type: null,
                    horizontal: null,
                    rating_url: null,
                    widget_count: 0,
                    screen_filters_values: false,
                    action_settings: false
                },
                selected: false,
                original_href: '/app/26/demand analysis/pattern analysis',
                href: '/app/26/demand analysis/pattern analysis/characteristics',
                level: 1,
                show: true,
                show_title: false
            }
        ]
    };

    test('Should render the SideBar component with default props', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <SideBar {...defaultProps} location={{ pathname: '/app/26/dashboard' }} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText(/Demand Analysis/i)).toBeInTheDocument();
    });

    test('Should render footer content when sidebar is not hidden', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <SideBar {...defaultProps} location={{ pathname: '/app/26/dashboard' }} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('MathCo')).toBeInTheDocument();
        expect(screen.getByText(import.meta.env['REACT_APP_VERSION'])).toBeInTheDocument();
    });

    test('Should display the right scroll button when showRightScroll is true', () => {
        const props = { ...defaultProps, showRightScroll: true };
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <SideBar {...props} location={{ pathname: '/app/26/dashboard' }} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const rightScrollButton = screen.getByRole('button');
        expect(rightScrollButton).toBeInTheDocument();
    });

    test('Should highlight the default active item', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <SideBar {...defaultProps} location={{ pathname: '/app/26/dashboard' }} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render the sidebar title', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <SideBar {...defaultProps} location={{ pathname: '/app/26/dashboard' }} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render all expected sidebar items', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <SideBar {...defaultProps} location={{ pathname: '/app/26/dashboard' }} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText(/Demand Analysis/i)).toBeInTheDocument();
    });
});
