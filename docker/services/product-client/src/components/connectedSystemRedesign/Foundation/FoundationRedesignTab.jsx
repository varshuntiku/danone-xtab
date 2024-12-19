import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BorderContainer from '../ValueTab/BorderContainer';
import IntiativeRedesign from './IntiativeRedesign';
import DriversLeftSection from '../DriversLeftSection';
// import ConnSystemsContext from '../ConnectedSystemsContext';
import ValueSolutions from '../ValueTab/ValueSolutions';
import FoundationTabRedesignStyle from 'assets/jss/FoundationTabRedesignStyle';
import ProcessSection from './ProcessSection';
// import LinearProgress from '@material-ui/core/LinearProgress';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import Skeleton from '@material-ui/lab/Skeleton';
import { getDashboardTabData, getDriverDetails } from 'services/connectedSystem_v2';

const useStyles = makeStyles(FoundationTabRedesignStyle);

function FoundationRedesignTab(props) {
    // const connSystemData = useContext(ConnSystemsContext);
    const { connSystemDashboardId, connSystemDashboardTabId, dashboardCode } = props;

    const [drivers, setDrivers] = useState([]);
    const [kpis, setKPIs] = useState([]);
    const [insightsData, setInsightsData] = useState([]);
    const [tools, setTools] = useState([]);
    const [loadingFoundation, setLoadingFoundation] = useState(true);
    const [loadingBusinessProcesses, setLoadingBusinessProcesses] = useState(true);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetchFoundation();
        fetchBusinessProcesses();
    }, []);

    const fetchFoundation = async () => {
        getDashboardTabData({
            connSystemDashboardTabId: connSystemDashboardTabId,
            callback: onResponseFoundation
        });
    };

    const onResponseFoundation = (response) => {
        setKPIs(response.kpis);
        setInsightsData(response.insights);
        setTools(response.tools);
        setLoadingFoundation(false);
    };

    const fetchBusinessProcesses = async () => {
        getDriverDetails({
            connSystemDashboardId: connSystemDashboardId,
            callback: onResponseDrivers
        });
    };

    const onResponseDrivers = (response) => {
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

    return loadingFoundation || loadingBusinessProcesses ? (
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
        <div className={classes.foundationTab}>
            <BorderContainer top right left bottom>
                <Typography className={classes.overviewText}>
                    {kpis?.label ? kpis?.label : 'Overview'}
                </Typography>
            </BorderContainer>
            <BorderContainer right bottom left classesProp={classes.intiativeSection1}>
                {kpis?.items?.map((el, index) => (
                    <div
                        className={
                            typeof el?.data === 'object'
                                ? classes.intiativeSectionLarge
                                : classes.intiativeSection
                        }
                        key={el?.id}
                    >
                        <IntiativeRedesign data={el} key={el.id} />
                        {index + 1 !== kpis.items.length && (
                            <div className={classes.separtor}></div>
                        )}
                    </div>
                ))}
            </BorderContainer>
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
                <div className={classes.insightsSection}>
                    <ValueSolutions
                        actions={{ solutions: true }}
                        close={false}
                        solutionsHeading={insightsData?.label ? insightsData.label : 'Insights'}
                        solutionsRight={false}
                        insights={true}
                        insightsData={insightsData.items}
                        styles={{ width: '14.8vw', height: 192 }}
                        valueTab={false}
                    />
                </div>
                <div className={classes.toolsSection}>
                    <ValueSolutions
                        actions={{ solutions: true }}
                        close={false}
                        solutionsHeading={tools?.label ? tools.label : 'Tools'}
                        styles={{ width: '18vw', height: 192 }}
                        bottomBorder={false}
                        solutionsLeft={false}
                        insightsData={tools.items}
                        valueTab={false}
                    />
                </div>
            </div>
        </div>
    );
}

export default FoundationRedesignTab;
