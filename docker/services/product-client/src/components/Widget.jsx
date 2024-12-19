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
import CustomTypography from './Experimental/CustomTypography';

export default function Widget({ data, onDrilledData, color_nooverride, ...props }) {
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
        return params && params.insight_data;
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
    const isCustomTypography = (params) => {
        return params.isCustomTypography;
    };

    if (isCalendar(data)) {
        return <Calendar params={data} {...props} data-testid="Calendar" />;
    } else if (isGridTable(data)) {
        return (
            <GridTable
                params={data.tableProps}
                onDrilledData={onDrilledData}
                {...props}
                data-testid="GridTable"
            />
        );
    } else if (isKPI(data)) {
        return <AppWidgetKpi params={data} {...props} data-testid="AppWidgetKpi" />;
    } else if (isPlot(data)) {
        return (
            <AppWidgetPlot
                params={data}
                {...props}
                color_nooverride={color_nooverride}
                data-testid="AppWidgetPlot"
            />
        );
    } else if (isTable(data)) {
        return <AppWidgetTable params={data} {...props} data-testid="AppWidgetTable" />;
    } else if (isInsights(data)) {
        return <AppWidgetInsights params={data} {...props} data-testid="AppWidgetInsights" />;
    } else if (isFlowTable(data)) {
        return (
            <AppWidgetFlowTable
                params={data}
                parent_obj={this}
                {...props}
                data-testid="AppWidgetFlowTable"
            />
        );
    } else if (isExpandableTable(data)) {
        return (
            <AppWidgetExpandableTable
                params={data}
                {...props}
                data-testid="AppWidgetExpandableTable"
            />
        );
    } else if (isGanttTable(data)) {
        return <AppWidgetGanttTable params={data} {...props} data-testid="AppWidgetGanttTable" />;
    } else if (isCustomTypography(data)) {
        return <CustomTypography params={data.content} {...props} />;
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
