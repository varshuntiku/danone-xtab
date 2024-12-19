import React from 'react';
import AppWidgetExpandableTable from '../../app-expandable-table/appWidgetExpandableTable';
// import healthCareExpandableTableParams from './healthCareExpandableTable.json';

function HirarchyTable(tabelJosn) {
    // const tableParams = hirchyTableParams;
    // const tableParams = healthCareExpandableTableParams;
    return (
        <React.Fragment>
            {/* <GridTable params={tableParams} /> */}
            <AppWidgetExpandableTable params={tabelJosn.tabelJosn} />
        </React.Fragment>
    );
}
export default HirarchyTable;
