import React from 'react';
import AppWidgetExpandableTable from './app-expandable-table/appWidgetExpandableTable';
import AppWidgetFlowTable from './AppWidgetFlowTable';
import AppWidgetGanttTable from './AppWidgetGanttTable';
import AppWidgetInsights from './AppWidgetInsights';
import AppWidgetKpi from './AppWidgetKpi';
import AppWidgetPlot from './AppWidgetPlot';
import AppWidgetTable from './AppWidgetTable';
import Calendar from './custom-calendar/calendar';
import GridTable from './gridTable/GridTable';

export default function Widget({ data, ...props }) {
    const isTable = (params) => {
        return params && (params.multiple_tables || (params.table_data && params.table_headers));
    };

    const isExpandableTable = (params) => {
        return params && params.isExpandable;
    };

    const isPlot = (params) => {
        return params && params.data && params.layout;
    };

    const isInsights = (params) => {
        return params && params.insight_data && params.insight_label;
    };

    const isFlowTable = (params) => {
        return params && params.flow_table;
    };

    const isHTML = (params) => {
        return params && typeof params === 'string' && params.indexOf('DOCTYPE html') > -1;
    };

    const isGanttTable = (params) => {
        return params && params.is_gantt_table;
    };

    const isKPI = (params) => {
        return params?.is_kpi;
    };

    const isGridTable = (params) => {
        return params?.is_grid_table;
    };

    const isCalendar = (params) => {
        return params.isCalendar;
    };

    if (isCalendar(data)) {
        return <Calendar params={data} />;
    } else if (isGridTable(data)) {
        return <GridTable params={data.tableProps} />;
    } else if (isKPI(data)) {
        return <AppWidgetKpi params={data} />;
    } else if (isPlot(data)) {
        return <AppWidgetPlot params={data} />;
    } else if (isTable(data)) {
        return <AppWidgetTable params={data} />;
    } else if (isInsights(data)) {
        return <AppWidgetInsights params={data} />;
    } else if (isFlowTable(data)) {
        return <AppWidgetFlowTable params={data} parent_obj={this} />;
    } else if (isExpandableTable(data)) {
        return <AppWidgetExpandableTable params={data} />;
    } else if (isGanttTable(data)) {
        return <AppWidgetGanttTable params={data} />;
    } else if (isHTML(data)) {
        return (
            <object
                aria-label={'app-widget-html-content'}
                style={{ height: '100%', width: '100%' }}
                data={'data:text/html,' + encodeURIComponent(data)}
            ></object>
        );
    } else if (data.value) {
        return data.value;
    } else {
        return null;
    }
}
