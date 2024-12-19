import React, { useState, useEffect } from 'react';
import IntelligenceRedesignTabStyle from './IntelligenceRedesignTabStyle';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import BorderContainer from '../ValueTab/BorderContainer';
import DriversLeftSection from '../DriversLeftSection';
// import ConnSystemsContext from '../ConnectedSystemsContext';
import ValueSolutions from '../ValueTab/ValueSolutions';
import ProcessSection from './ProcessSection';
import { ReactComponent as Progress } from 'assets/img/connProgressIcon.svg';
import { ReactComponent as Calender } from 'assets/img/connCalender.svg';
// import LinearProgress from '@material-ui/core/LinearProgress';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import Skeleton from '@material-ui/lab/Skeleton';
import { getDashboardTabData, getDriverDetails } from 'services/connectedSystem_v2';

const useStyles = makeStyles(IntelligenceRedesignTabStyle);
function IntelligenceRedesignTab(props) {
    // const connSystemData = useContext(ConnSystemsContext);
    const { connSystemDashboardId, connSystemDashboardTabId, dashboardCode } = props;
    const [drivers, setDrivers] = useState([]);

    const [kpis, setKPIs] = useState([]);
    const [insightsData, setInsightsData] = useState([]);
    const [tools, setTools] = useState([]);
    const [loadingIntelligence, setLoadingIntelligence] = useState(true);
    const [loadingBusinessProcesses, setLoadingBusinessProcesses] = useState(true);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetchIntelligence();
        fetchBusinessProcesses();
    }, []);

    const fetchIntelligence = async () => {
        getDashboardTabData({
            connSystemDashboardTabId: connSystemDashboardTabId,
            callback: onResponseIntelligence
        });
    };

    const onResponseIntelligence = (response) => {
        setKPIs(response.kpis);
        setInsightsData(response.insights);
        setTools(response.tools);
        setLoadingIntelligence(false);
    };

    const fetchBusinessProcesses = async () => {
        getDriverDetails({
            connSystemDashboardId: connSystemDashboardId,
            callback: onResponseBusinessProcesses
        });
    };

    const onResponseBusinessProcesses = (response) => {
        setDrivers(response);
        setLoadingBusinessProcesses(false);
    };

    const onHandleDriver = (item, index) => {
        setSelected(index);
        setSelectedDriver(item);
    };
    const classes = useStyles();

    // const VerticalLinearProgress = (props) => {
    //     return <LinearProgress {...props} className={classes.root} variant="determinate" />;
    // };

    return loadingIntelligence || loadingBusinessProcesses ? (
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
        <div className={classes.intelligenceTab}>
            <BorderContainer top right left classesProp={classes.overViewHeading}>
                <Typography className={classes.overviewText}>
                    {kpis?.label ? kpis?.label : 'Overview'}
                </Typography>
                <div className={classes.calenderSection}>
                    <Calender />
                    <Typography className={classes.dateText}>18 Sep - 24 Sep 23</Typography>
                </div>
            </BorderContainer>
            <div className={classes.intiativeSection}>
                {kpis?.items?.map((item, index) => (
                    <BorderContainer
                        top
                        bottom
                        left
                        right={index + 1 === kpis.items.length ? true : false}
                        stylesProp={{ width: '25%', height: '100%' }}
                        key={item?.id}
                    >
                        <div className={classes.contentSection}>
                            <div className={classes.topSection}>
                                <Typography className={classes.contentName}>{item.name}</Typography>
                                <div className={classes.topContent}>
                                    <Typography className={classes.record}>
                                        {item.record}
                                    </Typography>
                                    {item?.record && item?.progress && (
                                        <div className={classes.leftSection}>
                                            <Progress />
                                            <Typography className={classes.progressText}>
                                                {item.progress}
                                            </Typography>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={classes.bottomSection}>
                                {item?.data.map((item, index) => (
                                    <div className={classes.bottomContent} key={index}>
                                        <Typography className={classes.dataName}>
                                            {item.name}
                                        </Typography>
                                        <Typography className={classes.dataValue}>
                                            {item.value}
                                        </Typography>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </BorderContainer>
                ))}
            </div>
            <div className={classes.driverSection}>
                <DriversLeftSection
                    drivers={drivers}
                    selectedDriver={selectedDriver}
                    onHandleDriver={onHandleDriver}
                    selected={selected}
                />
                <ProcessSection dashboardCode={dashboardCode} selectedDriver={selectedDriver} />
            </div>
            <div className={classes.solutionSection}>
                <div className={classes.solutionsInsight}>
                    <ValueSolutions
                        actions={{ solutions: true }}
                        close={false}
                        solutionsHeading={insightsData?.label ? insightsData.label : 'Insights'}
                        solutionsRight={false}
                        insights={true}
                        insightsData={insightsData.items}
                        styles={{ width: '22.2vw', height: 192 }}
                        valueTab={false}
                    />
                </div>
                <div className={classes.solutionsTools}>
                    <ValueSolutions
                        actions={{ solutions: true }}
                        close={false}
                        solutionsHeading={tools?.label ? tools.label : 'Tools'}
                        styles={{ width: '18.1vw', height: 192 }}
                        bottomBorder={false}
                        insightsData={tools.items}
                        solutionsLeft={false}
                        valueTab={false}
                    />
                </div>
            </div>
        </div>
    );
}

export default IntelligenceRedesignTab;
