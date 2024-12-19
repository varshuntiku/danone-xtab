import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import createPlotlyComponent from 'react-plotly.js/factory';
import { ReactComponent as CheckCircle } from 'assets/img/checkCircle.svg';
import { ReactComponent as ErrorCircle } from 'assets/img/errorCircle.svg';
import { ReactComponent as Group } from 'assets/img/group.svg';
import { ReactComponent as Info } from 'assets/img/info.svg';
import KpiCard from 'components/connectedSystem/KpiCard';
import ModalComponent from './ModalComponent';

import connectedSystemIntelligenceModelsStyle from 'assets/jss/connectedSystemIntelligenceModelsStyle.jsx';

const useStyles = makeStyles((theme) => ({
    ...connectedSystemIntelligenceModelsStyle(theme)
}));

export default function ModelsTable({ modelsViewData, modelsMetadata, kpiPopupData }) {
    const classes = useStyles();
    const [openMetadataDialogue, setOpenMetadataDialogue] = useState(false);
    const [openKpiDialogue, setOpenKpiDialogue] = useState(false);
    const Plotly = window.Plotly;
    const Plot = createPlotlyComponent(Plotly);
    const theme = localStorage.getItem('codx-products-theme');

    const openMetadataModal = () => {
        setOpenMetadataDialogue(true);
    };

    const openKpiModal = () => {
        setOpenKpiDialogue(true);
    };

    const renderTableCell = (type, cellData, index, classNamesStr = '') => {
        switch (type) {
            case 'text':
                return (
                    <TableCell className={classes.tableContentCell} key={`text-${index}`}>
                        {cellData}
                    </TableCell>
                );
            case 'name':
                return (
                    <TableCell className={classes.tableContentCell} key={`text-${index}`}>
                        <div className={classes.modelNameStyle}>
                            {cellData.name}
                            <Info onClick={openKpiModal} className={classes.infoIconStyle} />
                        </div>
                        <div
                            className={classes.modelDetailsStyle}
                        >{`${cellData.segment} | ${cellData.service} | ${cellData.version}`}</div>
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
                        <Group />
                    </TableCell>
                );
            case 'metadata_availability':
                return (
                    <TableCell className={`${classes.tableContentCell}`} key={`text-${index}`}>
                        {cellData ? (
                            <div className={classes.metadataStyle}>
                                Yes
                                <Info
                                    className={classes.infoIconStyle}
                                    onClick={openMetadataModal}
                                />
                            </div>
                        ) : (
                            <div className={classes.metadataStyle}>No</div>
                        )}
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

    const renderTable = (tableData) => {
        return (
            <TableContainer className={classes.tableStyle}>
                <Table>
                    <TableHead>
                        <TableRow className={classes.tableHeadRow}>
                            {tableData.columns.map((column, index) => {
                                let classNamesStr = '';
                                if (column.id === 'name')
                                    classNamesStr = classes.firstColCustomStyle;
                                if (column.id === 'service_health')
                                    classNamesStr = classes.secondColCustomStyle;

                                return renderTableCell(
                                    'column_head',
                                    column.name,
                                    index,
                                    classNamesStr
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow className={classes.fillerRowStyle} />
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
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    const renderKpiCards = () => {
        return (
            <div className={classes.kpiDiv}>
                <Grid container spacing={2}>
                    {kpiPopupData.map((item, index) => (
                        <Grid item key={index} xs={4}>
                            <KpiCard
                                item={item}
                                bottomFullWidth={true}
                                background={
                                    theme === 'dark' ? '#091F3A' : 'rgba(255, 255, 255, 0.50)'
                                }
                                title={{
                                    fontSize: '2rem',
                                    fontWeight: '500',
                                    paddingLeft: '1rem',
                                    color: theme === 'dark' ? '#ffffffd6' : '#000000b5'
                                }}
                                border={'0.5px solid #3468CA99'}
                                height={'15rem'}
                                graphHeight={'100%'}
                                graphWidth={'100%'}
                                layoutWidth={200}
                                layoutHeight={70}
                            />
                        </Grid>
                    ))}
                </Grid>
            </div>
        );
    };

    return (
        <>
            <Typography className={classes.titleStyle}>Models View</Typography>
            {renderTable(modelsViewData)}
            <ModalComponent
                title={'Model Metadata'}
                openDialogue={openMetadataDialogue}
                setOpenDialogue={setOpenMetadataDialogue}
                dialogContentClassName={classes.metadataDialogContentStyle}
            >
                {renderTable(modelsMetadata)}
            </ModalComponent>
            <ModalComponent
                title={'KPI Details'}
                openDialogue={openKpiDialogue}
                setOpenDialogue={setOpenKpiDialogue}
                dialogContentClassName={classes.kpiDialogContentStyle}
            >
                {renderKpiCards()}
            </ModalComponent>
        </>
    );
}
