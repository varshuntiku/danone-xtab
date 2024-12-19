import React, { useState, useEffect } from 'react';
import { Typography, Grid, makeStyles } from '@material-ui/core';
import { ReactComponent as SelectDriverImage } from 'assets/img/SelectDriver.svg';
import { KeyboardArrowRight, ArrowDropUp, Info } from '@material-ui/icons';
import { ReactComponent as CalenderMonthOutlined } from 'assets/img/connCalender.svg';
import createPlotlyComponent from 'react-plotly.js/factory';
import IntelligenceRedesignTabStyle from './IntelligenceRedesignTabStyle';
import Logo from 'components/Nuclios/assets/logoIcon.svg';
// import ConnSystemsContext from '../ConnectedSystemsContext';
import ModelsTable from './ModelsTableRedesign';
import DrawerIcon from './DrawerIcon';
import BorderContainer from '../ValueTab/BorderContainer';
// import LinearProgress from '@material-ui/core/LinearProgress';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import Skeleton from '@material-ui/lab/Skeleton';
import { getBusinessProcessData } from 'services/connectedSystem_v2';

const useStyles = makeStyles((theme) => ({
    ...IntelligenceRedesignTabStyle(theme)
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
            height: props?.plotHeight || '30%',
            width: props?.plotWidth || '80%',
            marginLeft: '1rem',
            position: 'relative'
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
            <Plot
                data={data?.data}
                layout={{
                    margin: props?.margin || { l: 0, r: 0, t: 0, b: 0 },
                    paper_bgcolor: 'rgb(0,0,0,0)',
                    plot_bgcolor: 'rgb(0,0,0,0)',
                    yaxis: props?.layout?.yaxis
                        ? {
                              visible: props?.layout?.yaxis,
                              ticks: 'outside',
                              tickcolor: 'white',
                              ticklen: 15,
                              side: 'left'
                          }
                        : { visible: false },
                    xaxis: props?.layout?.xaxis
                        ? { visible: props?.layout?.xaxis }
                        : { visible: false },
                    shapes: data?.shapes,
                    annotations: data?.data[0].annotations,
                    grid: { rows: 1, columns: 2 },
                    showlegend: data?.showLegend || false,
                    autosize: true,
                    legend: data?.legend,
                    bargroupgap: 0.3
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
            {data?.verticalLabel && (
                <Typography className={` ${classes.graphLabel} ${classes.graphLabelVertical}`}>
                    {data?.verticalLabel}
                </Typography>
            )}
        </div>
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
    const [selectedTab, setSelectedTab] = useState(0);
    const classes = useStyles();
    const [modelsViewData, setModelsViewData] = useState({});
    const [modelsMetadata, setModelsMetadata] = useState({});
    const [overViewTabData, setOverViewTabData] = useState({});
    const [analyticsTabData, setAnalyticsTabData] = useState({});
    const [loading, setLoading] = useState(true);
    const [drawer, setDrawer] = useState(false);
    const handleDrawer = () => {
        setDrawer(!drawer);
    };
    const theme = localStorage.getItem('codx-products-theme');

    useEffect(() => {
        fetchIntelligence();
    }, []);

    const fetchIntelligence = async () => {
        getBusinessProcessData({
            connSystemBusinessProcessId: selectedBusinessProcess,
            callback: onResponseBusinessProcessData
        });
    };

    const onResponseBusinessProcessData = (response) => {
        setSolutions(response.intelligence_config.solutions);
        if (response.intelligence_config.solutions.length > 0) {
            setSelectedSolution(0);
            setModelsViewData(response.intelligence_config.solutions[0].modelsViewData);
            setModelsMetadata(response.intelligence_config.solutions[0].modelsMetadata);
            setOverViewTabData(response.intelligence_config.solutions[0].overViewTabData);
            setAnalyticsTabData(response.intelligence_config.solutions[0].analyticsTabData);
        }
        setLoading(false);
    };

    const ProcessDataContainer = () => {
        const HeaderInfo = (props) => {
            return (
                <React.Fragment>
                    <Typography
                        className={`${classes.cardHeading} ${
                            props?.infoIcon && classes.infoHolder
                        }`}
                    >
                        {props?.data?.title}
                        {props?.infoIcon && <Info className={classes.infoIcon} />}
                    </Typography>
                    {props?.data?.info && (
                        <Typography
                            className={`${classes.cardHeading} ${classes.consumptionSubHeading}`}
                        >
                            {props?.icon && (
                                <CalenderMonthOutlined className={classes.calenderIcon} />
                            )}{' '}
                            {props?.data?.info}
                        </Typography>
                    )}
                    {props?.icon && (
                        <Typography className={`${classes.cardHeading} ${classes.numberHeading}`}>
                            {props?.data?.value}
                        </Typography>
                    )}
                </React.Fragment>
            );
        };

        const OverviewTabDataContainer = (props) => {
            const OverViewTabData = props?.data;
            const consumptionData = OverViewTabData?.consumptionData;
            const costData = OverViewTabData?.costData;
            const consumptionDetailsData = OverViewTabData?.consumptionDetailsData;
            const riskData = OverViewTabData?.riskData;
            return (
                <React.Fragment>
                    <div className={classes.tabDataContainerLevel}>
                        <div className={classes.topHalfContainerLevel}>
                            <div className={classes.dataContainersLevel}>
                                <HeaderInfo data={consumptionData} />
                                <PlotlyGraph
                                    data={consumptionData.graph}
                                    margin={{ l: 200, t: 0, r: 0, b: 10 }}
                                    maxWidth={'140%'}
                                    layout={{ yaxis: true }}
                                />
                                <div className={classes.sideBarValueContainer}>
                                    {consumptionData?.values.map((val, index) => (
                                        <Typography
                                            key={`bragValue${index}`}
                                            className={`${classes.cardHeading} ${classes.consumptionSubHeading}`}
                                        >
                                            {val}
                                        </Typography>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={classes.separtorLine}></div>
                        <div item xs={6} className={classes.topHalfContainer2Level}>
                            <div className={classes.costFillContainer}>
                                <HeaderInfo data={costData} />
                                <PlotlyGraph
                                    data={costData?.graph}
                                    margin={{ l: 10, t: 10, r: 0, b: 0 }}
                                    maxWidth={'100%'}
                                />
                            </div>
                            <div className={classes.costDetailsHolder}>
                                {costData?.costDetails?.map((val, index) => (
                                    <React.Fragment key={`costDetail${index}`}>
                                        <Typography
                                            className={`${classes.cardHeading} ${classes.consumptionSubHeading}`}
                                        >
                                            {val?.title}
                                        </Typography>
                                        <Typography
                                            className={`${classes.cardHeading} ${classes.costDetailsSubHeading}`}
                                        >
                                            {val?.value}
                                        </Typography>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={classes.tabDataContainer2Level}>
                        <div className={classes.overViewbottomHalfContainer}>
                            <div className={classes.consumptionDetailsLeftContainer}>
                                <div className={classes.appLoginDetailsContainer}>
                                    <HeaderInfo data={consumptionDetailsData[0]} icon />
                                </div>
                                <div className={classes.appLoginDetailsContainer}>
                                    <HeaderInfo data={consumptionDetailsData[1]} icon />
                                </div>
                            </div>
                            <div
                                className={classes.separtorLine}
                                style={{ '--marginBottom': '-0.75rem' }}
                            ></div>
                            <div className={classes.consumptionDetailsRightContainer}>
                                <div className={classes.appLoginDetailsContainer}>
                                    <HeaderInfo data={consumptionDetailsData[2]} icon />
                                </div>
                                <div className={classes.appLoginDetailsContainer}>
                                    <HeaderInfo data={consumptionDetailsData[3]} icon />
                                </div>
                            </div>
                        </div>
                        <div
                            className={classes.separtorLine}
                            style={{ '--marginBottom': '-0.75rem' }}
                        ></div>
                        <div className={classes.overViewBottomHalfContainer2}>
                            <div className={classes.appLoginContainer}>
                                <div className={classes.overviewProgressContainer}>
                                    <HeaderInfo data={riskData} />
                                    <div className={classes.progressHolder}>
                                        {[...Array(Math.floor(riskData?.riskLevel / 10) * 2)].map(
                                            (i) => (
                                                <span
                                                    key={`progressBlockGreen${i}`}
                                                    className={classes.progressBlock}
                                                ></span>
                                            )
                                        )}
                                        {[
                                            ...Array(
                                                Math.floor((100 - riskData?.riskLevel) / 10) * 2
                                            )
                                        ].map((i) => (
                                            <span
                                                key={`progressBlock${i}`}
                                                className={classes.progressBlockUnfill}
                                            ></span>
                                        ))}
                                    </div>
                                    <div className={classes.legendVerticalFlex}>
                                        <div
                                            className={classes.overviewProgressLegend}
                                            key={'legend '}
                                        >
                                            <div
                                                className={classes.legendBox}
                                                style={{
                                                    backgroundColor: `${riskData.legendColor}`
                                                }}
                                            ></div>
                                            <Typography className={classes.legendText}>
                                                Risk Level
                                            </Typography>
                                        </div>
                                        <Typography
                                            className={`${classes.cardHeading} ${classes.numberHeading}`}
                                        >
                                            {' '}
                                            {riskData?.riskLevel}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={classes.separtorLine}
                                style={{ '--marginBottom': '-0.75rem' }}
                            ></div>
                            <div className={classes.appLoginContainer}>
                                {riskData?.riskScores.map((val, index) => (
                                    <div
                                        key={`riskScore${index}`}
                                        className={classes.appLoginDetailsContainer}
                                    >
                                        <HeaderInfo icon infoIcon data={val} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        };

        const AnalyticsDataContainer = (props) => {
            const analyticsTabData = props?.data;
            const pipelineModelData = analyticsTabData?.pipelineModelData;
            const accuracyData = analyticsTabData?.accuracyData;
            const anomalies = analyticsTabData?.anomalies;
            return (
                <React.Fragment>
                    <Grid container spacing={2} className={classes.tabDataContainer}>
                        <Grid item xs={4} className={classes.topHalfContainer}>
                            <div className={classes.dataContainers}>
                                <HeaderInfo data={pipelineModelData} />
                                <div className={classes.fillContainer}>
                                    <PlotlyGraph
                                        data={pipelineModelData?.graph}
                                        margin={{ l: 0, t: 10, r: 0, b: 10 }}
                                        maxWidth={'130%'}
                                        maxHeight={'200%'}
                                    />
                                    <div className={classes.legendHorizontalFlex}>
                                        {pipelineModelData?.legends.map((val, index) => (
                                            <div
                                                className={classes.legendVerticalFlex}
                                                key={`pipelinelegend${index}`}
                                            >
                                                <div className={classes.legend} key={'legend '}>
                                                    <div
                                                        className={classes.legendBox}
                                                        style={{ backgroundColor: `${val?.color}` }}
                                                    ></div>
                                                    <Typography className={classes.legendText}>
                                                        {val?.title}
                                                    </Typography>
                                                </div>
                                                <Typography
                                                    className={`${classes.cardHeading} ${classes.costDetailsSubHeading}`}
                                                >
                                                    {val?.value}
                                                </Typography>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={8} className={classes.topHalfContainer2}>
                            {pipelineModelData?.driftLatencyDetails.map((val, index) => (
                                <div
                                    key={`driftdetails${index}`}
                                    className={`${classes.analyticsTopDriftContainers} ${
                                        index == 0 && classes.driftBorderContainer
                                    }`}
                                >
                                    <div className={classes.fillContainer3}>
                                        <HeaderInfo data={val} />
                                        <PlotlyGraph
                                            data={val?.graph}
                                            margin={{ l: 20, t: 10, r: 0, b: 0 }}
                                            maxWidth={'200%'}
                                            maxHeight={'180%'}
                                        />
                                    </div>
                                    <div className={classes.detectionVerticalFlex}>
                                        {val?.details.map((detail, key) => (
                                            <React.Fragment key={`detectionratecontainer${key}`}>
                                                <Typography
                                                    className={`${classes.cardHeading} ${classes.consumptionSubHeading}`}
                                                >
                                                    {detail?.title}
                                                </Typography>
                                                <div className={classes.rateFlex}>
                                                    <Typography
                                                        className={`${classes.cardHeading} ${classes.analyticsNumberHeading}`}
                                                    >
                                                        {detail?.value}
                                                    </Typography>
                                                    <Typography
                                                        className={`${classes.cardHeading} ${classes.indicatorText} ${classes.indicatorIconText}`}
                                                    >
                                                        {
                                                            <ArrowDropUp
                                                                className={classes.arrowUpIcon}
                                                            />
                                                        }
                                                        {detail?.indicator}
                                                    </Typography>
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </Grid>
                    </Grid>
                    <div className={classes.separatorHolder}>
                        <div className={classes.customSeparator} style={{ '--width': '33%' }}></div>
                        <div
                            className={classes.customSeparator}
                            style={{ '--width': '32.3%' }}
                        ></div>
                        <div
                            className={classes.customSeparator}
                            style={{ '--width': '33.333%' }}
                        ></div>
                    </div>
                    <Grid container spacing={2} className={classes.tabDataContainer2}>
                        <Grid item xs={4} className={classes.bottomHalfContainer}>
                            <div className={classes.dataContainers}>
                                <div className={classes.overviewProgressContainer}>
                                    <div className={classes.accuracyHeaderContainer}>
                                        <HeaderInfo data={accuracyData} />
                                        <Typography className={classes.accuracyTotal}>
                                            Total Models{' '}
                                            <span className={classes.accuracyTotalValue}>05</span>
                                        </Typography>
                                    </div>
                                    <div className={classes.progressHolder}>
                                        {accuracyData?.legends?.map((val) =>
                                            [
                                                ...Array(
                                                    Math.floor((Number(val?.value) / 13) * 100)
                                                )
                                            ].map((i) => (
                                                <span
                                                    key={`progressBlockGreen${i}`}
                                                    className={classes.progressBlock}
                                                    style={{ '--color': val?.color }}
                                                ></span>
                                            ))
                                        )}
                                    </div>
                                    <div className={classes.accuracyRateFlex}>
                                        {accuracyData?.legends.map((val, index) => (
                                            <div
                                                className={classes.verticalFlex}
                                                key={`accuracylegend${index}`}
                                            >
                                                <div className={classes.legend}>
                                                    <div
                                                        className={classes.legendBox}
                                                        style={{ backgroundColor: val?.color }}
                                                    ></div>
                                                    <Typography className={classes.legendText}>
                                                        {val?.title}
                                                    </Typography>
                                                </div>
                                                <Typography
                                                    className={`${classes.cardHeading} ${classes.costDetailsSubHeading}`}
                                                >
                                                    {' '}
                                                    {val?.value}
                                                </Typography>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={8} className={classes.bottomHalfContainer2}>
                            <div className={classes.analyticsBottomGraphHolder}>
                                <div className={classes.fillContainer3}>
                                    <HeaderInfo data={anomalies} />
                                    <PlotlyGraph
                                        data={anomalies?.graph}
                                        margin={{ l: 10, t: 0, r: 0, b: 10 }}
                                        maxWidth={'250%'}
                                        maxHeight={'150%'}
                                        plotWidth={'70%'}
                                        plotHeight={'70%'}
                                    />
                                </div>
                            </div>
                            <div className={classes.analyticsBottomGraphDetails}>
                                <div className={classes.analyticsBottomGraphDetailsTop}>
                                    <Typography
                                        className={`${classes.cardHeading} ${classes.anomalySubHeading}`}
                                    >
                                        {anomalies?.details?.title}{' '}
                                        <span className={classes.anomalyValue}>
                                            {anomalies?.details?.value}
                                        </span>
                                    </Typography>
                                    <Typography
                                        className={`${classes.cardHeading} ${classes.anomalySubHeading}`}
                                    >
                                        {' '}
                                        Current Month:{' '}
                                        <CalenderMonthOutlined className={classes.calenderIcon} />
                                        {anomalies?.details?.month}
                                    </Typography>
                                </div>
                                <div className={classes.customSeparator}></div>
                                <div className={classes.analyticsBottomGraphDetailsBottom}>
                                    {anomalies?.details?.kpis.map((val, index) => (
                                        <div
                                            className={classes.anomalyVerticalFlex}
                                            key={`anomaliesDetails${index}`}
                                        >
                                            <Typography
                                                className={`${classes.cardHeading} ${classes.consumptionSubHeading}`}
                                            >
                                                {val?.title}
                                            </Typography>
                                            <div className={classes.anomalyRateFlex}>
                                                <Typography
                                                    className={`${classes.cardHeading} ${classes.analyticsNumberHeading}`}
                                                >
                                                    {val?.value}
                                                </Typography>
                                                <Typography
                                                    className={`${classes.cardHeading} ${classes.indicatorText} ${classes.indicatorIconText}`}
                                                >
                                                    {
                                                        <ArrowDropUp
                                                            className={classes.arrowUpIcon}
                                                        />
                                                    }
                                                    {val?.indicator}
                                                </Typography>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </React.Fragment>
            );
        };

        // const connSystemData = useContext(ConnSystemsContext);
        return (
            <div className={classes.processSectionContainer}>
                <div className={classes.tabsContainer}>
                    <Typography
                        onClick={() => {
                            setSelectedTab(0);
                        }}
                        className={`${classes.tabHeading} ${
                            selectedTab == 0 && classes.selectedTab
                        }`}
                    >
                        OVERVIEW
                    </Typography>
                    <Typography
                        onClick={() => {
                            setSelectedTab(1);
                        }}
                        className={`${classes.tabHeading} ${
                            selectedTab == 1 && classes.selectedTab
                        }`}
                    >
                        ANALYTICS OPS
                    </Typography>
                </div>
                {selectedTab == 0 ? (
                    <OverviewTabDataContainer data={overViewTabData} />
                ) : (
                    <AnalyticsDataContainer data={analyticsTabData} />
                )}
            </div>
        );
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
                <Grid item className={classes.graphDataContainer}>
                    {drawer ? (
                        <div>
                            <ModelsTable
                                modelsViewData={modelsViewData}
                                modelsMetadata={modelsMetadata}
                            />
                        </div>
                    ) : (
                        <ProcessDataContainer />
                    )}
                    <div
                        className={`${classes.drawerIcon} ${
                            drawer ? classes.swingIcon : classes.swingIconLeft
                        }`}
                        onClick={handleDrawer}
                    >
                        <DrawerIcon color={theme === 'light' ? '#220047' : '#FFFFFF'} />
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
                Select a driver and business process to view the intelligence health and metrics
            </Typography>
        </div>
    ) : (
        <DriverProcess dashboardCode={props.dashboardCode} selectedDriver={props.selectedDriver} />
    );
};

export default ProcessSection;
