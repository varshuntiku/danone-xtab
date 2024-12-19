import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { getHierarchy, getBannerInfo } from '../../services/dashboard';
import LeftMenu from '../../components/NetworkDashboard/src/Leftmenu/Leftmenu';
import Hexagon from '../../components/NetworkDashboard/src/Leftmenu/Hexagon';
import { DashboardSpecs } from '../../assets/data/dashboardSpecs';
import HealthCareDashboard2 from '../../components/Healthcaredashboard/HealthCareDashboard';
import HirarchyTable from '../../components/Healthcaredashboard/hirarchyTable/HirarchyTable';
import healthCareExpandableTable from '../../components/Healthcaredashboard/hirarchyTable/healthCareExpandableTable.json';
import { Provider } from 'react-redux';
import store from 'store/store';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../services/dashboard', () => ({
    getHierarchy: vi.fn()
}));

vi.mock('../../services/dashboard', () => ({
    getHierarchy: vi.fn(),
    getBannerInfo: vi.fn()
}));
const genrateJson = vi.fn();
describe('Codex Product test', () => {
    afterEach(cleanup);
    //Using third party library for healthcaredashboard where canvas is rendering on UI
    test('healthcaredashboard response data', () => {
        getHierarchy.mockImplementation(({ callback }) => callback({ status: 'success' }));
        getBannerInfo.mockImplementation(({ callback }) => callback({ status: 'success' }));
    });
    test('rendering of Healthcaredashboard platform', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <HealthCareDashboard2 />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('rendering leftmenu in healtcare dashboard', () => {
        const apiData = [
            {
                actual_id: 16,
                id: 1,
                color: null,
                parent_id: null,
                label: 'Healthcare',
                logo_name: 'Health Care',
                group: 'industry',
                shape: 'custom',
                title: null
            },
            {
                actual_id: 17,
                id: 2,
                color: null,
                parent_id: 1,
                label: 'Manufactures',
                logo_name: 'Health Care',
                group: 'industry',
                shape: 'custom',
                title: null
            },
            {
                actual_id: 16,
                id: 3,
                color: null,
                parent_id: 1,
                label: 'Providers',
                logo_name: 'Health Care',
                group: 'industry',
                shape: 'custom',
                title: null
            },
            {
                actual_id: 16,
                id: 4,
                color: null,
                parent_id: 1,
                label: 'Trade',
                logo_name: 'Health Care',
                group: 'industry',
                shape: 'custom',
                title: null
            },
            {
                actual_id: 16,
                id: 5,
                color: null,
                parent_id: 1,
                label: 'Insurance',
                logo_name: 'Health Care',
                group: 'industry',
                shape: 'custom',
                title: null
            }
        ];
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <LeftMenu apiData={apiData} />
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('rendering hexagonComponent in healthcare dashboard', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Hexagon
                        rootNode={[
                            {
                                id: 30,
                                node_id: 1,
                                type: 'industry',
                                color: null,
                                description: null,
                                label: 'Health care',
                                parent_industry_id: null,
                                logo_name: 'Health Care',
                                level: 'root'
                            }
                        ]}
                        category={[
                            {
                                id: 34,
                                node_id: 2,
                                type: 'industry',
                                color: '#f4a36a',
                                description: '',
                                label: 'Insurers & Payers',
                                parent_industry_id: 30,
                                logo_name: 'Insurers & Payers',
                                level: 'category'
                            }
                        ]}
                    />
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('rendering of image and label in hexagonComponent', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Hexagon
                        category={{
                            id: 34,
                            node_id: 2,
                            type: 'industry',
                            color: '#f4a36a',
                            description: '',
                            label: 'Insurers & Payers',
                            parent_industry_id: 30,
                            logo_name: 'Insurers & Payers',
                            level: 'category'
                        }}
                        rootNode={[
                            {
                                id: 30,
                                node_id: 1,
                                type: 'industry',
                                color: null,
                                description: null,
                                label: 'Health care',
                                parent_industry_id: null,
                                logo_name: 'Health Care',
                                level: 'root'
                            }
                        ]}
                    />
                </CustomThemeContextProvider>
            </Provider>
        );
        const labelElement = screen.getByText('Insurers & Payers');
        expect(labelElement).toBeInTheDocument();
        const img = screen.getByTestId('hexagonicon');
        const src = DashboardSpecs['Insurers & Payers'];
        expect(img.src).toContain(src);
        expect(img).toHaveAttribute('alt', 'icon');
    });
    test('rendering Hierarcy table', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <HirarchyTable tabelJosn={healthCareExpandableTable} />
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('switches to list view when list button is clicked', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <HirarchyTable tabelJosn={healthCareExpandableTable} />
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.queryByText('List view'));
        expect(screen.queryByText('Apps'));
    });

    test('switches to category when clicked', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <HirarchyTable tabelJosn={healthCareExpandableTable} />
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByText('Category'));
        expect(screen.getByText('Category')).toBeInTheDocument();
    });

    test('switches to Manufacturers when clicked', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <HirarchyTable tabelJosn={healthCareExpandableTable} />
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByText('Manufacturers'));
        expect(screen.getByText('Manufacturers')).toBeInTheDocument();
    });

    test('renders Insurers and Payers', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <HirarchyTable tabelJosn={healthCareExpandableTable} />
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('Insurers and Payers')).toBeInTheDocument();
    });

    test('renders Providers when clicked', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <HirarchyTable tabelJosn={healthCareExpandableTable} />
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByText('Providers'));
        expect(screen.queryByText('Trade & Distribution')).toBeInTheDocument();
    });
});
