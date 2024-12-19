import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import createPlotlyComponent from 'react-plotly.js/factory';
import { ReactComponent as CheckCircle } from 'assets/img/redesign_check.svg';
import { ReactComponent as ErrorCircle } from 'assets/img/redesign_error.svg';
import { ReactComponent as Info } from 'assets/img/redesign_info.svg';
import { ReactComponent as Logs } from 'assets/img/logs.svg';

import connectedSystemRedesignModelsStyle from 'assets/jss/connSystemRedesignModelStyle.jsx';

const useStyles = makeStyles((theme) => ({
    ...connectedSystemRedesignModelsStyle(theme)
}));

export default function ModelsTable({ modelsViewData }) {
    const classes = useStyles();
    const Plotly = window.Plotly;
    const Plot = createPlotlyComponent(Plotly);
    const theme = localStorage.getItem('codx-products-theme');

    const openMetadataModal = () => {
        // setOpenMetadataDialogue(true);
    };

    const openKpiModal = () => {
        // setOpenKpiDialogue(true);
    };

    const renderTableCell = (type, cellData, index, classNamesStr = '') => {
        switch (type) {
            case 'text':
                return (
                    <TableCell className={classes.tableContentCell} key={`text-${index}`}>
                        {cellData}
                    </TableCell>
                );
            case 'boolean':
                return (
                    <TableCell className={classes.tableContentCell} key={`text-${index}`}>
                        {cellData ? <CheckCircle /> : <ErrorCircle />}
                    </TableCell>
                );
            case 'plotly': {
                return (
                    <TableCell className={classes.tableContentCell} key={`text-${index}`}>
                        <Plot
                            data={cellData.data}
                            layout={{
                                margin: { l: 0, r: 0, t: 0, b: 0 },
                                paper_bgcolor: 'rgb(0,0,0,0)',
                                plot_bgcolor: 'rgb(0,0,0,0)',
                                yaxis: { visible: false },
                                xaxis: { visible: false },
                                grid: { rows: 1, columns: 1 },
                                showlegend: false,
                                width: '80',
                                height: '30'
                            }}
                            config={{
                                displayModeBar: false,
                                responsive: true,
                                staticPlot: true
                            }}
                            useResizeHandler={true}
                        />
                    </TableCell>
                );
            }
            case 'logs':
                return (
                    <TableCell className={classes.tableContentCell} key={`text-${index}`}>
                        <Logs />
                    </TableCell>
                );
            case 'metadata_availability':
                return (
                    <TableCell className={`${classes.tableContentCell}`} key={`text-${index}`}>
                        {cellData ? (
                            <div className={classes.metadataStyle}>
                                Yes
                                <Info className={classes.infoIconStyle} />
                            </div>
                        ) : (
                            <div className={classes.metadataStyle}>No</div>
                        )}
                    </TableCell>
                );
            case 'column_head':
                return (
                    <TableCell
                        className={`${classes.tableHeadCell} ${classNamesStr} ${
                            cellData === 'Logs' ||
                            cellData === 'Activity' ||
                            cellData === 'Accuracy' ||
                            cellData === 'Drift' ||
                            cellData === 'Service Health'
                                ? classes.centerAlign
                                : ''
                        }`}
                        key={`text-${index}`}
                    >
                        {cellData}
                    </TableCell>
                );
            case 'data_update_frequency':
                return (
                    <TableCell className={`${classes.tableContentCell}`} key={`text-${index}`}>
                        <div className={classes.metadataStyle}>
                            {cellData}
                            <Info className={classes.infoIconStyle} onClick={openMetadataModal} />
                        </div>
                    </TableCell>
                );
            case 'model_update_frequency':
                return (
                    <TableCell className={`${classes.tableContentCell}`} key={`text-${index}`}>
                        <div className={classes.metadataStyle}>
                            {cellData}
                            <Info className={classes.infoIconStyle} onClick={openMetadataModal} />
                        </div>
                    </TableCell>
                );
        }
    };

    const renderTable = (tableData) => {
        return (
            <TableContainer className={classes.tableStyle2} style={{ flexFlow: 1 }}>
                <Table className={classes.tableHolder}>
                    <TableHead>
                        <div className={`${classes.outer} ${classes.outerBottom}`}>
                            <div className={classes.inner2}>
                                <TableRow className={classes.tableHeadRow}>
                                    {tableData.columns.slice(1).map((column, index) => {
                                        let classNamesStr = '';

                                        return renderTableCell(
                                            'column_head',
                                            column.name,
                                            index,
                                            classNamesStr
                                        );
                                    })}
                                </TableRow>
                            </div>
                        </div>
                    </TableHead>
                    <TableBody className={classes.bodyHeight}>
                        <div className={classes.bodyHeight}>
                            <div className={classes.inner3}>
                                {tableData.data.map((row, i) => {
                                    return (
                                        <TableRow
                                            key={i}
                                            className={
                                                theme === 'dark'
                                                    ? i % 2 === 0
                                                        ? classes.tableContentRow
                                                        : ''
                                                    : classes.rowLightStyle
                                            }
                                        >
                                            {Object.keys(row).map((cellData, index) => {
                                                return renderTableCell(
                                                    tableData.columns[index]['type'],
                                                    row[cellData],
                                                    index
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </div>
                        </div>
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    const renderTableCell1 = (type, cellData, index, classNamesStr = '') => {
        switch (type) {
            case 'text':
                return (
                    <TableCell className={classes.tableContentCell} key={`text-${index}`}>
                        {cellData}
                    </TableCell>
                );
            case 'name':
                return (
                    <TableCell className={classes.tableContentCellLeft} key={`text-${index}`}>
                        <div className={classes.modelNameStyle}>
                            {cellData.name}
                            <Info onClick={openKpiModal} className={classes.infoIconStyle} />
                        </div>
                        <div
                            className={classes.modelDetailsStyle}
                        >{`${cellData.segment} | ${cellData.service} | ${cellData.version}`}</div>
                    </TableCell>
                );
            case 'column_head':
                return (
                    <TableCell
                        className={`${classes.tableHeadCell} ${classNamesStr}`}
                        key={`text-${index}`}
                    >
                        {cellData}
                    </TableCell>
                );
        }
    };
    const renderTable1 = (tableData) => {
        return (
            <TableContainer className={classes.tableStyle1}>
                <Table>
                    <TableHead>
                        <div className={classes.outer}>
                            <div className={classes.inner}>
                                <TableRow className={classes.tableHeadRow}>
                                    {tableData.columns.slice(0, 1).map((column, index) => {
                                        let classNamesStr = '';

                                        return renderTableCell1(
                                            'column_head',
                                            column.name,
                                            index,
                                            classNamesStr
                                        );
                                    })}
                                </TableRow>
                            </div>
                        </div>
                    </TableHead>
                    <TableBody>
                        <div className={`${classes.outer} ${classes.outerBottom}`}>
                            <div className={classes.inner}>
                                {tableData.data.map((row, i) => {
                                    return (
                                        <TableRow
                                            key={i}
                                            className={
                                                theme === 'dark'
                                                    ? i % 2 === 0
                                                        ? classes.tableContentRow
                                                        : ''
                                                    : classes.rowLightStyle
                                            }
                                        >
                                            {Object.keys(row).map((cellData, index) => {
                                                return renderTableCell1(
                                                    tableData.columns[index]['type'],
                                                    row[cellData],
                                                    index
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </div>
                        </div>
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <div>
            <Typography className={classes.titleStyle}>Models View</Typography>
            <div className={classes.tableContainer}>
                {renderTable1(modelsViewData)}
                {renderTable(modelsViewData)}
            </div>
        </div>
    );
}
