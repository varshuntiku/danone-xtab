import { Box, Divider, Grid, Typography, makeStyles, useTheme } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import GridTable from 'components/gridTable/GridTable';
import createPlotlyComponent from 'react-plotly.js/factory';
import clsx from 'clsx';
import Footer from 'components/Footer';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import {
    getExperimentDetailById,
    getCheckpointEvaluationResult,
    getErrorMetrics,
    getExperimentResultById
} from 'services/llmWorkbench/llm-workbench';
import t from 'config/textContent/llmWorkbench.json';
import PageNotFound from 'components/PageNotFound';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';

const useStyles = makeStyles((theme) => ({
    container: {
        background: theme.palette.primary.dark,
        position: 'relative',
        padding: theme.spacing(1),
        paddingBottom: 0,
        marginRight: theme.spacing(1.3),
        '& + div': {
            paddingTop: 0,
            overflow: 'scroll'
            // maxHeight: '100%'
        },
        '&:after': {
            content: '" "',
            position: 'absolute',
            height: 0,
            width: 'calc(100% - 0.5rem)',
            right: 0,
            bottom: 0,
            borderBottom: '1px solid ' + theme.palette.separator.grey
        }
    },
    tabContainer: {
        background: theme.palette.primary.dark,
        borderRadius: theme.spacing(1),
        boxSizing: 'border-box',
        display: 'flex',
        color: theme.palette.text.default
    },
    tab: {
        borderRadius: theme.spacing(1) + ' ' + theme.spacing(1) + ' 0 0',
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(4),
        fontSize: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        cursor: 'pointer',
        transition: '0.5s',
        borderBottom: '3px solid transparent',
        lineHeight: '1.8rem',
        '&:hover': {
            color: theme.palette.primary.contrastText
        },
        letterSpacing: '0.8px'
    },
    activeTab: {
        borderBottom: `3px solid ${theme.palette.primary.contrastText}`,
        color: theme.palette.primary.contrastText,
        fontWeight: '500'
    },
    gridContainer: {
        position: 'relative'
    },
    gridBody: {
        height: '100%',
        width: 'auto',
        position: 'relative',
        margin: '0 0.5rem',
        padding: 0,
        borderBottom: `1px solid ${theme.palette.separator.grey}`,
        '& .MuiGrid-item > div': {
            borderRight: `1px solid ${theme.palette.separator.grey}`,
            padding: `0 ${theme.layoutSpacing(24)} ${theme.layoutSpacing(4)}`,
            height: '100%'
        },
        '& .MuiGrid-item:last-child > div': {
            borderRight: 'none',
            paddingRight: theme.layoutSpacing(16)
        },
        '& .MuiGrid-item:first-child > div': {
            paddingLeft: theme.layoutSpacing(16)
        },
        '& .MuiGrid-item': {
            height: '100%',
            padding: `${theme.layoutSpacing(16)} 0`
        }
    },
    label: {
        fontSize: theme.spacing(2.2),
        fontWeight: '500',
        color: theme.palette.text.titleText
    },
    value: {
        fontSize: '1.8rem',
        fontWeight: '400',
        color: theme.palette.text.titleText
    },
    widgetContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2.6rem'
    },
    gridGraphcontainer: {
        height: '75%',
        position: 'relative'
    },
    gridGraphBody: {
        position: 'relative',
        '& div': {
            boxShadow: 'none'
        },
        [theme.breakpoints.down(theme.breakpoints.values.desktop_sm)]: {
            padding: '1.5rem 0'
        },
        borderBottom: `1px solid ${theme.palette.separator.grey}`,
        display: 'flex',
        // alignItems: 'center',
        justifyContent: 'flex-start',
        height: '78%',
        margin: '1rem',
        maxWidth: '99.2%',
        flexDirection: 'column'
    },
    gridTableBody: {
        position: 'relative',
        '& div': {
            boxShadow: 'none'
        },
        margin: '3rem',
        [theme.breakpoints.down(theme.breakpoints.values.desktop_sm)]: {
            padding: '1.5rem 0'
        },
        flex: 1.15,
        flexDirection: 'column',
        alignSelf: 'center',
        justifySelf: 'center',
        display: 'flex',
        gap: '1.5rem',
        // alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottom: `1px solid ${theme.palette.separator.grey}`
    },
    gridParentContainer: {
        padding: '0 6rem',
        margin: 0
        // gap: 0,
        // paddingBottom: '4rem'
        // width: 'auto',
    },
    graphPlot: {
        width: '100%',
        height: '80%',
        position: 'relative',
        display: 'block !important'
    },
    graph: {
        borderBottom: `1px solid ${theme.palette.separator.grey}`,
        width: '100%',
        flex: 1.5,
        alignSelf: 'center',
        justifySelf: 'center',
        padding: '0rem 6rem',
        display: 'flex',
        // alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '1.5rem',
        flexDirection: 'column'
    },
    overviewContainer: {
        margin: '0 1rem',
        height: '79%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    expName: {
        fontSize: '1.8rem',
        fontWeight: 500,
        color: theme.palette.text.titleText
    },
    heading: {
        fontSize: '2rem',
        fontWeight: 500,
        color: theme.palette.primary.contrastText,
        paddingBottom: '0.7rem'
    },
    info: {
        fontSize: '1.8rem',
        color: theme.palette.text.titleText,
        letterSpacing: '0.4px'
    },
    infoContainer: {
        marginTop: '2rem',
        marginBottom: '1rem'
    },
    backLink: {
        position: 'absolute',
        left: 27,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '1rem',
        textDecoration: 'none',
        cursor: 'pointer',
        '&:hover span': {
            textDecoration: 'underline'
        }
    },
    backTitle: {
        color: theme.palette.text.titleText,
        fontSize: '1.8rem',
        fontWeight: 500
    },
    reevaluate: {
        position: 'absolute',
        right: 40,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '1rem',
        textDecoration: 'none',
        color: theme.palette.text.titleText,
        fontSize: '2rem',
        fontWeight: '500',
        fontFamily: 'Graphik Compact',
        cursor: 'pointer'
    }
}));
const FinetuningReports = (props) => {
    const [loading, setLoading] = useState(false);
    const [expWidgetDetails, setExpWidgetDetails] = useState([]);
    const [overViewTableData, setOverviewTableData] = useState([]);
    const [deepDiveTableData, setDeepDiveTableData] = useState([]);
    const [graphData, setGraphData] = useState([]);
    const [annotations, setAnnotations] = useState([]);
    const [error, setError] = useState(false);
    const [expDetails, setExpDetails] = useState(null);
    const [shapes, setShapes] = useState([]);
    const [fields, setFields] = useState([]);
    const { modelId } = props.match.params;
    let checkpointName;
    if (props.match.params) checkpointName = props.match.params.checkpointName;
    const theme = useTheme();

    const trimFloatValue = (value) => {
        return parseFloat(value).toFixed(2);
    };

    const formatData = (exp, evaluationResult, allErrorMetrics) => {
        const formatedWidgetData = [];
        let keys = [];
        if (evaluationResult?.error_metrics)
            keys = Object.keys(evaluationResult?.error_metrics?.[0]);
        const metricName = allErrorMetrics.find((metric) => metric.id === exp.error_metric_type)?.[
            'name'
        ];
        formatedWidgetData.push(
            { label: 'Status', value: exp.status },
            { label: 'Base Model', value: exp.base_model },
            {
                label: metricName,
                value: `${trimFloatValue(evaluationResult?.error_metrics?.[0]?.[keys?.[1]]) || '0'}`
            },
            { label: 'GPU Cost', value: `$${exp.compute.estimated_cost}/hr` },
            {
                label: 'Time taken',
                value: evaluationResult.train_loss.slice(-1)[0]['elapsed_time']
            }
        );
        setExpDetails(exp);
        setExpWidgetDetails(formatedWidgetData);
        // const formatedOverviewTableData = response?.error_metrics?.map((item) => {
        //     const convertedItem = {};
        //     for (let key in item) {
        //         convertedItem[key] = String(item[key]);
        //     }
        //     return convertedItem;
        // });
        const metrics = evaluationResult.error_metrics || [];
        const errorMetrics = metrics.map((metric) => {
            const _metric = {
                name: metricName || exp.error_metric_type
            };
            Object.entries(metric).forEach((entry) => {
                _metric[entry[0]] = `${entry[1]}`;
            });
            return _metric;
        });
        keys = Object.keys(errorMetrics[0]);
        errorMetrics[0][keys[1]] = trimFloatValue(errorMetrics[0][keys[1]]);
        errorMetrics[0][keys[2]] = trimFloatValue(errorMetrics[0][keys[2]]);
        setOverviewTableData(errorMetrics);
        setDeepDiveTableData(evaluationResult.eval_results);

        setFields(Object.keys(errorMetrics[0]));
        let max = -1;
        const graphData = evaluationResult.train_loss.reduce(
            (acc, item) => {
                acc['x'].push(item.current_steps);
                acc['y'].push(item.loss);
                max = Math.max(max, item.loss);
                return acc;
            },
            { x: [], y: [], annotations: [], shapes: [] }
        );
        max += 1;
        const limit = graphData.x[graphData.x.length - 1];
        const save_steps = exp.settings.save_steps;
        for (let i = save_steps; i <= limit; i += save_steps) {
            graphData['annotations'].push({
                x: i,
                y: max + 0.15,
                xref: 'x',
                yref: 'y',
                text: `C${parseInt(i / save_steps)}`,
                showarrow: false,
                font: {
                    family: 'Arial, sans-serif',
                    size: 15,
                    color: 'rgba(46, 205, 170, 1)'
                }
            });
            graphData['shapes'].push({
                line: {
                    color: 'rgba(46, 205, 170, 1)',
                    dash: 'line',
                    width: 1
                },
                type: 'line',
                x0: i,
                x1: i,
                y0: 0,
                y1: max
            });
        }
        const validationLossPlotData = evaluationResult.train_loss.reduce(
            (acc, item) => {
                acc['x'].push(item.current_steps);
                acc['y'].push(item.eval_loss);
                return acc;
            },
            { x: [], y: [] }
        );

        setAnnotations(graphData.annotations);
        setShapes(graphData.shapes);
        setGraphData([
            {
                x: graphData.x,
                y: graphData.y,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Training Loss'
            },
            {
                x: validationLossPlotData.x,
                y: validationLossPlotData.y,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Validation Loss',
                marker: {
                    color: theme.palette.background.infoError
                }
            }
        ]);
    };
    const fetchCheckpointEvaluationResult = async () => {
        const [experimentDetails, { data: evaluationResult }, allErrorMetrics] = await Promise.all([
            getExperimentDetailById(modelId),
            getCheckpointEvaluationResult(modelId, checkpointName),
            getErrorMetrics()
        ]);
        formatData(experimentDetails, evaluationResult, allErrorMetrics);
    };
    const fetchExperimentResult = async () => {
        const [experimentDetails, { data: finalResult }, allErrorMetrics] = await Promise.all([
            getExperimentDetailById(modelId),
            getExperimentResultById(modelId),
            getErrorMetrics()
        ]);
        const evaluationResult = { ...finalResult, eval_results: finalResult?.deep_dive };
        formatData(experimentDetails, evaluationResult, allErrorMetrics);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(false);
                if (props.match.params.checkpointName) {
                    await fetchCheckpointEvaluationResult();
                } else {
                    await fetchExperimentResult();
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
                setError(true);
            }
        };
        fetchData();
    }, [modelId]);
    const layout = {
        xaxis: {
            title: {
                text: 'Steps',
                font: {
                    family: 'Graphik,Graphik Compact,Arial,sans-serif',
                    color: theme.palette.primary.contrastText,
                    size: 13.723199999999999
                },
                standoff: 16
            },
            tickfont: {
                family: 'Graphik,Graphik Compact,Arial,sans-serif',
                color: theme.palette.text.titleText,
                size: 13.723199999999999
            },
            automargin: true,
            line: {
                color: '#220047'
            },
            gridcolor: theme.palette.primary.light,
            // linecolor: theme.palette.text.titleText,
            // range: [10,100],
            zerolinecolor: '#220047'
        },
        yaxis: {
            title: {
                text: 'Loss',
                font: {
                    family: 'Graphik,Graphik Compact,Arial,sans-serif',
                    color: theme.palette.primary.contrastText,
                    size: 13.723199999999999
                },
                standoff: 16
            },
            tickfont: {
                family: 'Graphik,Graphik Compact,Arial,sans-serif',
                color: theme.palette.text.titleText,
                size: 13.723199999999999
            },
            automargin: true,
            line: {
                color: '#220047'
            },
            gridcolor: theme.palette.primary.light,
            // linecolor: theme.palette.text.titleText,
            zerolinecolor: '#220047'
        },
        autosize: true,
        font: {
            family: 'Graphik Compact',
            color: '#220047',
            size: 13.723199999999999
        },
        hoverlabel: {
            font: {
                family: 'Graphik,Graphik Compact,Arial,sans-serif',
                size: 13.723199999999999
            }
        },
        margin: {
            t: 10,
            r: 1,
            l: 0,
            b: 10
        },
        legend: {
            orientation: 'h',
            y: -0.24,
            x: 0,
            font: {
                family: 'Graphik,Graphik Compact,Arial,sans-serif',
                color: theme.palette.primary.contrastText,
                size: 16
            },
            bgColor: '#F5F5F5',
            tracegroupgap: 10
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        geo: {
            bgcolor: '#FFFFFF',
            subunitcolor: '#220047'
        },
        shapes,
        annotations,
        colorway: [
            theme.palette.primary.contrastText,
            '#FFA497',
            '#C9DEF4',
            '#DCCFBB',
            '#2ECDAA',
            '#FECAD3',
            '#DDC3FE',
            '#DEF3A2',
            '#B3EEE1',
            '#F490C2'
        ],
        responsive: true
    };
    const getLabel = () => {
        return overViewTableData?.[0]?.[fields[0]];
    };
    const getAccuracyField = () => {
        return overViewTableData?.[0]?.[fields[0]]?.toLowerCase().split(' ').join('_');
    };

    const Plot = createPlotlyComponent(window.Plotly);
    const tablePropsDeepdive = {
        groupHeaders: [],
        coldef: [
            {
                headerName: 'Instruction',
                field: 'instruction'
            },
            {
                headerName: 'Actual Response',
                field: 'output'
            },
            {
                headerName: 'Untrained Model Response',
                field: 'Untrained_model_result'
            },
            {
                headerName: 'Trained Model Response',
                field: 'Trained_model_result'
            },
            {
                headerName: `${getLabel()} Untrained`,
                field: getAccuracyField() + '_untrained'
            },
            {
                headerName: `${getLabel()} Trained`,
                field: getAccuracyField() + '_trained'
            }
        ],
        gridOptions: {
            tableSize: 'medium',
            tableMaxHeight: '54vh'
        }
    };
    const tableProps = {
        groupHeaders: [],
        coldef: [
            {
                headerName: 'Error Metric',
                field: 'name'
            },
            {
                headerName: 'Untrained Model',
                field: fields[1]
            },
            {
                headerName: 'Trained Model',
                field: fields[2]
            }
        ],
        gridOptions: {
            tableSize: 'medium',
            tableMaxHeight: '70vh'
        }
    };
    const classes = useStyles();
    const [activeTab, setActiveTab] = useState('Overview');
    return (
        <>
            {error ? (
                <PageNotFound message="Experiment result not found or does not exist" />
            ) : loading ? (
                <CodxCircularLoader size={60} center />
            ) : (
                <Box
                    height="93%"
                    style={{
                        borderLeft: `1px solid ${theme.palette.separator.grey}`,
                        marginLeft: '1.3rem',
                        borderRight: `1px solid ${theme.palette.separator.grey}`
                    }}
                >
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <div className={classes.backLink} onClick={props.history.goBack}>
                            <ArrowBackIosRoundedIcon />
                            <span className={classes.backTitle}>{'Back'}</span>
                        </div>
                        <Typography variant="h4" className={classes.expName}>
                            {checkpointName
                                ? `${expDetails?.name} : ${checkpointName}`
                                : expDetails?.name}
                        </Typography>
                    </Box>
                    <Divider
                        style={{
                            backgroundColor: theme.palette.separator.grey,
                            width: '99%',
                            margin: '1rem'
                        }}
                    />
                    <div className={classes.container}>
                        <div className={classes.tabContainer}>
                            <div
                                className={`${classes.tab} ${
                                    activeTab == 'Overview' && classes.activeTab
                                }`}
                                onClick={() => setActiveTab('Overview')}
                            >
                                Overview
                            </div>
                            <div
                                className={`${classes.tab} ${
                                    activeTab == 'Deep dive' && classes.activeTab
                                }`}
                                onClick={() => setActiveTab('Deep dive')}
                            >
                                Deep dive
                            </div>
                        </div>
                    </div>
                    <div className={classes.gridContainer}>
                        <Grid container spacing={3} className={classes.gridBody}>
                            {expWidgetDetails?.map((item, i) => {
                                return (
                                    <Grid item xs key={i}>
                                        <div className={classes.widgetContainer}>
                                            <Typography variant="h4" className={classes.label}>
                                                {item.label}
                                            </Typography>
                                            <Typography variant="h4" className={classes.value}>
                                                {item.value}
                                            </Typography>
                                        </div>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </div>
                    {activeTab === 'Overview' && (
                        <div className={classes.overviewContainer}>
                            <Grid
                                container
                                justifyContent="center"
                                spacing={1}
                                style={{ paddingLeft: '1rem' }}
                                className={` ${classes.gridParentContainer} ${classes.gridTableBody}`}
                            >
                                <Box className={classes.infoContainer}>
                                    <Typography variant="h4" className={classes.heading}>
                                        {t.finetuning_results.overview.table.heading}
                                    </Typography>
                                    <Typography variant="h4" className={classes.info}>
                                        {t.finetuning_results.overview.table.info}
                                    </Typography>
                                </Box>
                                <GridTable
                                    params={{
                                        rowData: overViewTableData,
                                        coldef: undefined,
                                        ...tableProps
                                    }}
                                />
                            </Grid>
                            <div
                                style={{ paddingLeft: '1rem', paddingBottom: '3rem' }}
                                className={classes.graph}
                            >
                                <Box className={classes.infoContainer}>
                                    <Typography variant="h4" className={classes.heading}>
                                        {t.finetuning_results.overview.graph.heading}
                                    </Typography>
                                    <Typography variant="h4" className={classes.info}>
                                        {t.finetuning_results.overview.graph.info}
                                    </Typography>
                                </Box>
                                <Plot
                                    data={graphData}
                                    layout={layout}
                                    config={{ displayModeBar: false, responsive: true }}
                                    className={clsx(classes.graphPlot)}
                                    useResizeHandler={true}
                                />
                            </div>
                        </div>
                    )}
                    {activeTab === 'Deep dive' && (
                        <Box
                            style={{ margin: '1rem', paddingLeft: '1rem' }}
                            className={`${classes.gridGraphBody}  ${classes.gridParentContainer}`}
                        >
                            <Box className={classes.infoContainer}>
                                <Typography variant="h4" className={classes.heading}>
                                    {t.finetuning_results.deep_dive.table.heading}
                                </Typography>
                                <Typography variant="h4" className={classes.info}>
                                    {t.finetuning_results.deep_dive.table.info}
                                </Typography>
                            </Box>
                            <GridTable
                                params={{
                                    rowData: deepDiveTableData,
                                    coldef: undefined,
                                    ...tablePropsDeepdive
                                }}
                            />
                        </Box>
                    )}
                </Box>
            )}
            <Footer key="footer" />
        </>
    );
};

export default FinetuningReports;
