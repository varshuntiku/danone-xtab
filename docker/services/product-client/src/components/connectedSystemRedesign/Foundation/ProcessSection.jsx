import React, { useState, useEffect } from 'react';
import { Typography, Grid, makeStyles } from '@material-ui/core';
import FoundationTabRedesignStyle from 'assets/jss/FoundationTabRedesignStyle';
import { ReactComponent as SelectDriverImage } from 'assets/img/SelectDriver.svg';
import { KeyboardArrowRight, ArrowDropUp } from '@material-ui/icons';
import CalenderTodayOutlined from '@material-ui/icons/CalendarTodayOutlined';
import createPlotlyComponent from 'react-plotly.js/factory';
import Logo from 'components/Nuclios/assets/logoIcon.svg';
import BorderContainer from '../ValueTab/BorderContainer';
// import ConnSystemsContext from '../ConnectedSystemsContext';
// import LinearProgress from '@material-ui/core/LinearProgress';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import Skeleton from '@material-ui/lab/Skeleton';
import { getBusinessProcessData } from 'services/connectedSystem_v2';

const useStyles = makeStyles((theme) => ({
    ...FoundationTabRedesignStyle(theme)
}));

const PlotlyGraph = (props) => {
    const useStyles2 = makeStyles(() => ({
        connSystemCardPlot: {
            height: props?.maxHeight || '200%',
            width: props?.maxWidth || '100%',
            marginLeft: '0rem',
            marginTop: '1rem',
            '& .js-fill': {
                fill: 'url(#graph-gradient) !important'
            }
        },
        plotlyHolder: {
            height: props?.plotHeight || '100%',
            width: props?.plotWidth || '30%',
            marginLeft: '1rem',
            minWidth: props?.minWidth || '12rem'
        }
    }));
    const classes = useStyles();
    const classes2 = useStyles2();
    const Plot = createPlotlyComponent(window.Plotly);
    const data = props?.data;
    return (
        <div
            className={`${classes2.plotlyHolder} ${props.customPlotlyWrapperClasses}`}
            key={'plotly '}
        >
            <Typography className={classes.cardHeading}>{data?.title}</Typography>
            <Plot
                data={data?.data}
                layout={{
                    margin: props?.margin || { l: 0, r: 0, t: 0, b: 0 },
                    paper_bgcolor: 'rgb(0,0,0,0)',
                    plot_bgcolor: 'rgb(0,0,0,0)',
                    yaxis: props?.layout?.yaxis
                        ? { visible: props?.layout?.yaxis }
                        : { visible: false },
                    xaxis: props?.layout?.xaxis
                        ? { visible: props?.layout?.xaxis }
                        : { visible: false },
                    shapes: data?.shapes,
                    annotations: data?.annotations,
                    grid: { rows: 1, columns: 2 },
                    showlegend: data?.showLegend || false,
                    autosize: true,
                    legend: data?.legend
                }}
                config={{
                    displayModeBar: false,
                    responsive: true,
                    staticPlot: true
                }}
                className={`${classes2.connSystemCardPlot} ${props?.customPlotlyClasses}`}
                useResizeHandler={true}
            />
            {data?.label && <Typography className={classes.graphLabel}>{data?.label}</Typography>}
        </div>
    );
};

const DateContainer = (props) => {
    const classes = useStyles();
    const data = props?.data;
    return (
        <React.Fragment>
            <Typography
                className={`${classes.cardHeading} ${props?.subHeading && classes.subHeading}`}
            >
                {data?.title}
            </Typography>
            <div className={classes.horizontalContainer}>
                <Typography className={`${classes.cardHeading} ${classes.monthHeading}`}>
                    {data?.period}
                </Typography>
                <Typography
                    className={`${classes.cardHeading} ${classes.indicatorText} ${
                        props?.indicator && classes.indicatorIconText
                    }`}
                >
                    {props?.indicator && <ArrowDropUp className={classes.arrowUpIcon} />}
                    {data?.indicator}
                </Typography>
            </div>
            <div className={classes.horizontalContainer}>
                <CalenderTodayOutlined className={classes.calenderIcon} />
                <Typography className={`${classes.cardHeading} ${classes.dateHeading}`}>
                    {data?.date}
                </Typography>
            </div>
        </React.Fragment>
    );
};

const DriverProcess = (props) => {
    const { selectedDriver } = props;

    // const connSystemData = useContext(ConnSystemsContext);
    const processList = selectedDriver?.business_processes;
    const [selectedBusinessProcess] = useState(processList.length > 0 ? processList[0].id : false);
    const [selectedSolution, setSelectedSolution] = useState(false);
    const [solutions, setSolutions] = useState([]);
    // const [subProcessList] = processData?.subProcessList;

    const [loading, setLoading] = useState(true);
    const [graphs, setGraphs] = useState(false);
    const [kpiData, setKpiData] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        fetchFoundation();
    }, []);

    const fetchFoundation = async () => {
        getBusinessProcessData({
            connSystemBusinessProcessId: selectedBusinessProcess,
            callback: onResponseBusinessProcessData
        });
    };

    const onResponseBusinessProcessData = (response) => {
        setSolutions(response.foundation_config.solutions);
        if (response.intelligence_config.solutions.length > 0) {
            setSelectedSolution(0);
            setGraphs(response.foundation_config.solutions[0].graphs);
            setKpiData(response.foundation_config.solutions[0].kpiData);
        }
        setLoading(false);
    };

    // const VerticalLinearProgress = (props) => {
    //     return <LinearProgress {...props} className={classes.root} variant="determinate" />;
    // };

    return loading ? (
        <>
            <Skeleton
                variant="rect"
                animation="wave"
                component="div"
                width="100%"
                height="100%"
                className={classes.skeletonWave}
            />
            <CodxCircularLoader center size={60} />
        </>
    ) : (
        <React.Fragment>
            <Grid container className={classes.driverProcessContainer}>
                <BorderContainer right classesProp={classes.processHolder}>
                    {processList.map((el) => {
                        if (el.id === selectedBusinessProcess) {
                            return [
                                <Typography className={classes.processHighlight} key={el.id}>
                                    {el.name}
                                    <KeyboardArrowRight className={classes.arrowRight} />
                                </Typography>,
                                solutions.map((solution_el, solution_el_index) => {
                                    if (solution_el_index === selectedSolution) {
                                        return (
                                            <Typography
                                                key={`${solution_el_index}`}
                                                className={`${classes.processHighlight} ${classes.processSelectedHighlight}`}
                                            >
                                                <img
                                                    src={Logo}
                                                    className={classes.logo}
                                                    alt="logo"
                                                />{' '}
                                                {solution_el.name}
                                            </Typography>
                                        );
                                    } else {
                                        return (
                                            <Typography
                                                key={`subProcess${solution_el_index}`}
                                                className={`${classes.processHighlight} ${classes.subprocessText}`}
                                            >
                                                {solution_el.name}
                                            </Typography>
                                        );
                                    }
                                })
                            ];
                        } else {
                            return [
                                <Typography
                                    key={el.id}
                                    className={`${classes.processHighlight} ${classes.processUnHighlight}`}
                                >
                                    {el.name} <KeyboardArrowRight className={classes.arrowRight} />
                                </Typography>
                            ];
                        }
                    })}
                </BorderContainer>
                <Grid item xs={9} className={classes.graphDataContainer}>
                    <PlotlyGraph
                        data={graphs.graph1}
                        margin={{ t: 30, b: 0, l: 2, r: 0 }}
                        maxWidth={'185%'}
                        maxHeight={'85%'}
                        plotWidth={'100%'}
                        minWidth={'25rem'}
                    />
                    <div className={classes.verticalFlex}>
                        <div className={classes.verticalContainer}>
                            <DateContainer data={kpiData[0]} />
                        </div>
                        <span className={classes.separator}></span>
                        <div className={`${classes.verticalContainer} ${classes.bottomContainer}`}>
                            <DateContainer data={kpiData[1]} />
                        </div>
                    </div>

                    <div className={classes.verticalFlex}>
                        <div
                            className={`${classes.horizontalContainer} ${classes.graphHorizontal}`}
                        >
                            <PlotlyGraph
                                customPlotlyWrapperClasses={classes.plotlyHalfHolder}
                                data={graphs.graph2}
                                maxHeight={'50%'}
                                maxWidth={'200%'}
                            />
                            <div className={classes.verticalSubContainer}>
                                <DateContainer indicator={true} subHeading data={kpiData[2]} />
                            </div>
                            <div className={classes.verticalSubContainer}>
                                <DateContainer indicator={true} subHeading data={kpiData[3]} />
                            </div>
                        </div>
                        <span className={classes.separator}></span>
                        <div
                            className={`${classes.horizontalContainer} ${classes.graphHorizontal} ${classes.bottomContainer} `}
                        >
                            <div className={classes.legend} key={'legend '}>
                                <div
                                    className={classes.legendBox}
                                    style={{
                                        backgroundColor: `${graphs.graph3?.legends[0]?.color}`
                                    }}
                                ></div>
                                <Typography className={classes.legendText}>
                                    {graphs.graph3?.legends[0]?.text}
                                </Typography>
                            </div>
                            <div className={classes.legend2} key={'legend '}>
                                <div
                                    className={classes.legendBox}
                                    style={{
                                        backgroundColor: `${graphs.graph3?.legends[1]?.color}`
                                    }}
                                ></div>
                                <Typography className={classes.legendText}>
                                    {graphs.graph3?.legends[1]?.text}
                                </Typography>
                            </div>
                            <Typography className={classes.centerText}>68</Typography>
                            <PlotlyGraph
                                customPlotlyWrapperClasses={classes.plotlyHalfHolder}
                                data={graphs.graph3}
                                maxHeight={'70%'}
                                maxWidth={'350%'}
                                margin={{ r: 0, t: 0, b: 0, l: 0 }}
                            />
                            <div className={classes.verticalSubContainer}>
                                <DateContainer subHeading data={kpiData[4]} />
                            </div>
                            <div className={classes.verticalSubContainer}>
                                <DateContainer subHeading data={kpiData[5]} />
                            </div>
                        </div>
                    </div>
                </Grid>
                <div className={classes.separatorBottom}></div>
            </Grid>

            <span className={classes.separatorVertical}></span>
        </React.Fragment>
    );
};

const ProcessSection = (props) => {
    const classes = useStyles();
    return !props.selectedDriver ? (
        <div className={classes.initialData}>
            <SelectDriverImage />
            <Typography className={classes.textHeading}>
                Select a driver and business process to view foundational health and metrics
            </Typography>
        </div>
    ) : (
        <DriverProcess dashboardCode={props.dashboardCode} selectedDriver={props.selectedDriver} />
    );
};

export default ProcessSection;
