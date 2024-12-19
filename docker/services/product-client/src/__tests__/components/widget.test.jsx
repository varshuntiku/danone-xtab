import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store/store';
import { act } from 'react-dom/test-utils';
import Widget from '../../components/Widget';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import AppWidgetFlowTable from '../../components/AppWidgetFlowTable';
import Calendar from '../../components/custom-calendar/Calendar';
const history = createMemoryHistory();

const mockParams = {
    dropdownIconsStyle: {
        width: '20px',
        height: '20px',
        position: 'relative',
        right: '10px',
        top: '5px'
    },
    legends: [{ id: 'legend1', style: { borderColor: 'red', borderWidth: '2px' } }],
    rowHeadData: [{ id: 'row1', head: 'Row 1', subhead: ['Sub 1'] }],
    columnHeadData: [{ id: 'col1', head: 'Column 1' }],
    cellsData: { row1: { col1: { icons: [], options: { option1: true } } } },
    isSingleSelect: true,
    displayIcons: true,
    settings: { iconsPerCell: 3 },
    iconsList: [{ iconName: 'check', iconsInputProps: {}, toolTipTitle: 'Check Icon' }]
};
const mockOnAction = vi.fn();

vi.mock('../../components/custom-calendar/calendar', () => ({
    default: () => <div data-testid="Calendar" />
}));

vi.mock('../../components/gridTable/GridTable', () => ({
    default: () => <div data-testid="GridTable" />
}));

vi.mock('../../components/AppWidgetKpi', () => ({
    default: () => <div data-testid="AppWidgetKpi" />
}));

vi.mock('../../components/AppWidgetPlot', () => ({
    default: () => <div data-testid="AppWidgetPlot" />
}));

vi.mock('../../components/AppWidgetTable', () => ({
    default: () => <div data-testid="AppWidgetTable" />
}));

vi.mock('../../components/AppWidgetInsights', () => ({
    default: () => <div data-testid="AppWidgetInsights" />
}));

vi.mock('../../components/AppWidgetFlowTable', () => ({
    default: () => <div data-testid="AppWidgetFlowTable" />
}));

vi.mock('../../components/app-expandable-table/appWidgetExpandableTable', () => ({
    default: () => <div data-testid="AppWidgetExpandableTable" />
}));

vi.mock('../../components/AppWidgetGanttTable', () => ({
    default: () => <div data-testid="AppWidgetGanttTable" />
}));

describe('Widget Component', () => {
    it('renders Calendar component when data is of type Calendar', () => {
        const data = { isCalendar: true };
        const { getByTestId } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Widget data={data} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(getByTestId('Calendar')).toBeInTheDocument();
    });

    it('renders GridTable component when data is of type GridTable', () => {
        const data = { is_grid_table: true, tableProps: {} };
        const { getByTestId } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Widget data={data} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(getByTestId('GridTable')).toBeInTheDocument();
    });

    it('renders AppWidgetKpi component when data is of type KPI', () => {
        const data = { is_kpi: true };
        const { getByTestId } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Widget data={data} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(getByTestId('AppWidgetKpi')).toBeInTheDocument();
    });

    it('renders AppWidgetPlot component when data is of type Plot', () => {
        const data = { data: {}, layout: {} };
        const { getByTestId } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Widget data={data} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(getByTestId('AppWidgetPlot')).toBeInTheDocument();
    });

    it('renders AppWidgetTable component when data is of type Table', () => {
        const data = { table_data: [], table_headers: [] };
        const { getByTestId } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Widget data={data} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(getByTestId('AppWidgetTable')).toBeInTheDocument();
    });

    it('renders AppWidgetInsights component when data is of type Insights', () => {
        const data = { insight_data: {} };
        const { getByTestId } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Widget data={data} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(getByTestId('AppWidgetInsights')).toBeInTheDocument();
    });

    it('renders AppWidgetFlowTable component when data is of type FlowTable', () => {
        const data = { flow_table: true };
        const { getByTestId } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Widget data={data} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(getByTestId('AppWidgetFlowTable')).toBeInTheDocument();
    });

    it('renders AppWidgetExpandableTable component when data is of type ExpandableTable', () => {
        const data = { isExpandable: true };
        const { getByTestId } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Widget data={data} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(getByTestId('AppWidgetExpandableTable')).toBeInTheDocument();
    });

    it('renders AppWidgetGanttTable component when data is of type GanttTable', () => {
        const data = { is_gantt_table: true };
        const { getByTestId } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Widget data={data} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(getByTestId('AppWidgetGanttTable')).toBeInTheDocument();
    });

    it('renders CustomTypography component when data is of type CustomTypography', () => {
        const data = { isCustomTypography: true, content: 'Test' };
        const { getByText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Widget data={data} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(getByText('Test')).toBeInTheDocument();
    });

    it('renders HTML content when data is of type HTML', () => {
        const data = '<!DOCTYPE html><html><body>Test</body></html>';
        const { container } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Widget data={data} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(container.querySelector('object')).toBeInTheDocument();
    });

    it('renders plain value when data.value is present', () => {
        const data = { value: 'Plain Value' };
        const { getByText } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Widget data={data} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(getByText('Plain Value')).toBeInTheDocument();
    });

    it('renders null when data does not match any condition', () => {
        const data = {};
        const { container } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <Widget data={data} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(container.firstChild).toBeNull();
    });
});
