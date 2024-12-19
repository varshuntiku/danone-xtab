import React, { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';

import NavBar from 'components/NavBar.jsx';
import Sidebar from 'components/connectedSystemRedesign/Admin/SideBar.jsx';
import Overview from 'components/connectedSystemRedesign/Admin/Overview.jsx';
import Tabs from 'components/connectedSystemRedesign/Admin/Tabs.jsx';
import Goals from 'components/connectedSystemRedesign/Admin/Goals.jsx';
import Initiatives from 'components/connectedSystemRedesign/Admin/Initiatives.jsx';
import Drivers from 'components/connectedSystemRedesign/Admin/Drivers.jsx';
import BusinessProcesses from 'components/connectedSystemRedesign/Admin/BusinessProcesses.jsx';
import BusinessProcessTemplates from 'components/connectedSystemRedesign/Admin/BusinessProcessTemplates.jsx';
import connSystemDashboardAdminStyle from 'assets/jss/connSystemDashboardAdminStyle.jsx';

const useStyles = makeStyles(connSystemDashboardAdminStyle);
function AdminHome(props) {
    const classes = useStyles();
    const { connSystemDashboardId } = props;
    const { drawerCon } = useState(false);

    return (
        <div className={classes.connSystemDashboardContainer}>
            <div className={classes.connSystemDashboardBody}>
                <NavBar classList={classes} />
                <div id="wrapper" className={classes.wrapper}>
                    <div id="sidebar" className={drawerCon ? classes.drawerClose : classes.drawer}>
                        <Sidebar dashboardId={connSystemDashboardId} />
                    </div>
                    <div id="bodyContent" className={classes.bodyContent}>
                        <div className={classes.appAdminContainer}>
                            <Switch>
                                <Route
                                    path="/connected-system/:connSystemDashboardId/admin/overview"
                                    render={(props) => (
                                        <Overview
                                            connSystemDashboardId={connSystemDashboardId}
                                            {...props}
                                        />
                                    )}
                                />
                                <Route
                                    path="/connected-system/:connSystemDashboardId/admin/tabs"
                                    render={(props) => (
                                        <Tabs
                                            connSystemDashboardId={connSystemDashboardId}
                                            {...props}
                                        />
                                    )}
                                />
                                <Route
                                    path="/connected-system/:connSystemDashboardId/admin/goals"
                                    render={(props) => (
                                        <Goals
                                            connSystemDashboardId={connSystemDashboardId}
                                            {...props}
                                        />
                                    )}
                                />
                                <Route
                                    path="/connected-system/:connSystemDashboardId/admin/initiatives"
                                    render={(props) => (
                                        <Initiatives
                                            connSystemDashboardId={connSystemDashboardId}
                                            {...props}
                                        />
                                    )}
                                />
                                <Route
                                    path="/connected-system/:connSystemDashboardId/admin/drivers"
                                    render={(props) => (
                                        <Drivers
                                            connSystemDashboardId={connSystemDashboardId}
                                            {...props}
                                        />
                                    )}
                                />
                                <Route
                                    path="/connected-system/:connSystemDashboardId/admin/business-processes"
                                    render={(props) => (
                                        <BusinessProcesses
                                            connSystemDashboardId={connSystemDashboardId}
                                            {...props}
                                        />
                                    )}
                                />
                                <Route
                                    path="/connected-system/:connSystemDashboardId/admin/business-process-templates"
                                    render={(props) => (
                                        <BusinessProcessTemplates
                                            connSystemDashboardId={connSystemDashboardId}
                                            {...props}
                                        />
                                    )}
                                />
                                <Redirect
                                    from="/connected-system/:connSystemDashboardId/admin"
                                    to="/connected-system/:connSystemDashboardId/admin/overview"
                                />
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminHome;
