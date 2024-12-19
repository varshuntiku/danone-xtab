import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import { withRouter } from 'react-router-dom';

import NavBar from 'components/NavBar.jsx';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import Skeleton from '@material-ui/lab/Skeleton';
import connSystemDashboardStyle from 'assets/jss/connSystemRedesignDashboardStyle.jsx';

import FoundationRedesignTab from './Foundation/FoundationRedesignTab';
import ValueTab from 'components/connectedSystemRedesign/ValueTab';
// import { getRedesignConnSystemData } from 'services/connectedSystem';

import IntelligenceRedesignTab from 'components/connectedSystemRedesign/Intelligence/IntelligenceRedesignTab';
import BorderContainer from './ValueTab/BorderContainer';
// import ConnSystemsContext from 'components/connectedSystemRedesign/ConnectedSystemsContext';
import StrategyRedesign from './Strategy/StrategyRedesign';
import { getDashboardTabs } from '../../services/connectedSystem_v2';
import { Typography } from '@material-ui/core';

const ConnectedSystemDashboardRedesign = (props) => {
    const { classes, connSystemDashboardId, dashboardCode, ...newProps } = props;

    const [selectedTab, setSelectedTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [tabs, setTabs] = useState(false);
    const [selectedInitiative, setSelectedInitiative] = useState(null);

    useEffect(() => {
        fetchConnSystemDashboardTabs();
    }, []);

    const fetchConnSystemDashboardTabs = async () => {
        if (connSystemDashboardId) {
            getDashboardTabs({
                connSystemDashboardId: connSystemDashboardId,
                callback: onResponseGetDashboardTabs
            });
        } else {
            setLoading(false);
        }
    };

    const onResponseGetDashboardTabs = (response_data) => {
        setTabs(response_data);
        setLoading(false);
    };

    const getSelectedTabBody = () => {
        const dashboard_tab = tabs.find((tab_item, tab_index) => tab_index === selectedTab);

        if (dashboard_tab) {
            switch (dashboard_tab.tab_type) {
                case 'Strategy':
                    return (
                        <StrategyRedesign
                            setSelectedTab={setSelectedTab}
                            connSystemDashboardId={connSystemDashboardId}
                            connSystemDashboardTabId={dashboard_tab.id}
                            setSelectedInitiative={setSelectedInitiative}
                        />
                    );
                case 'Value':
                    return (
                        <ValueTab
                            connSystemDashboardId={connSystemDashboardId}
                            connSystemDashboardTabId={dashboard_tab.id}
                            dashboardCode={dashboardCode}
                            selectedInitiative={selectedInitiative}
                        />
                    );
                case 'Intelligence':
                    return (
                        <IntelligenceRedesignTab
                            dashboardCode={dashboardCode}
                            connSystemDashboardId={connSystemDashboardId}
                            connSystemDashboardTabId={dashboard_tab.id}
                        />
                    );
                case 'Foundation':
                    return (
                        <FoundationRedesignTab
                            dashboardCode={dashboardCode}
                            connSystemDashboardId={connSystemDashboardId}
                            connSystemDashboardTabId={dashboard_tab.id}
                        />
                    );
            }
        } else {
            return '';
        }
    };
    // const connSystemData = getRedesignConnSystemData();
    return (
        // <ConnSystemsContext.Provider value={connSystemData}>
        <div className={classes.connSystemDashboardContainer}>
            <NavBar
                classList={classes}
                connSystemDashboardId={connSystemDashboardId}
                {...newProps}
            />
            <div className={classes.connSystemDashboardBody}>
                {loading ? (
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
                ) : connSystemDashboardId ? (
                    <>
                        <BorderContainer left right top>
                            <div className={classes.connSystemDashboardTabContainer2}>
                                {tabs.map((tab_item, tab_index) => (
                                    <div
                                        key={tab_item.name}
                                        className={`${classes.connSystemDashboardTabLabel} ${
                                            selectedTab === tab_index &&
                                            classes.connSystemDashboardTabLabelSelected
                                        }`}
                                        onClick={() => setSelectedTab(tab_index)}
                                    >
                                        {tab_item.name}
                                    </div>
                                ))}
                            </div>
                        </BorderContainer>
                        <div className={classes.connSystemGridContainer}>
                            {getSelectedTabBody()}
                        </div>
                    </>
                ) : (
                    <Typography variant="h3">Dashboard not configured.</Typography>
                )}
            </div>
            <div className={classes.footer_first}>
                {/* <div className={classes.footer_logo}>
                    <Typography className={classes.copyRight}>C</Typography>
                </div>
                <Typography className={classes.footer_text}>TheMathCompany</Typography> */}
                <span className={classes.footer_version}>
                    {import.meta.env['REACT_APP_VERSION']}{' '}
                </span>
            </div>
        </div>
        // </ConnSystemsContext.Provider>
    );
};

ConnectedSystemDashboardRedesign.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withRouter(
    withStyles(
        (theme) => ({
            ...connSystemDashboardStyle(theme)
        }),
        { withTheme: true }
    )(ConnectedSystemDashboardRedesign)
);
