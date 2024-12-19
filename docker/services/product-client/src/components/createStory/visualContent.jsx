import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import AppWidgetInsights from './../AppWidgetInsights';
import AppWidgetPlot from './../AppWidgetPlot';
import AppWidgetTable from './../AppWidgetTable.jsx';
import KpiWidget from './dialog/kpiWidget';

const styles = () => ({
    gridTableBody: {
        width: '100%',
        // height: theme.spacing(66),
        height: '100%'
        // overflowY: 'auto'
    }
});
export default function VisualContents(props) {
    const classes = makeStyles(styles)();
    const isTable = (params) => {
        return params && (params.multiple_tables || (params.table_data && params.table_headers));
    };

    const isPlot = (params) => {
        return params && params.data && params.layout;
    };

    const isInsights = (params) => {
        return params && params.insight_data;
    };

    const renderVisualContent = (item) => {
        let widget = !item.value ? item.graph_data : JSON.parse(item.value);
        if (isInsights(widget)) {
            return <AppWidgetInsights params={widget} preview={true} />;
        }

        if (isPlot(widget)) {
            return (
                <div style={{ height: '350px', width: 'auto' }}>
                    <AppWidgetPlot
                        params={widget}
                        graph_height={'half'}
                        size_nooverride={false}
                        color_nooverride={false}
                    />
                </div>
            );
        }
        if (isTable(widget)) {
            return (
                <div className={classes.gridTableBody}>
                    <AppWidgetTable params={widget} />
                </div>
            );
        }

        if (
            item.is_label ||
            item.graph_data?.extra_dir ||
            item.graph_data?.variant ||
            item.graph_data?.value
        ) {
            let kpiItem = { ...item.graph_data, name: item.name };
            return <KpiWidget params={widget} item={item.graph_data ? kpiItem : item} />;
        }
    };

    return <div>{renderVisualContent(props.item)}</div>;
}
