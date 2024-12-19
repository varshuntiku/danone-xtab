import React, { useCallback, useEffect, useState } from 'react';
import { Box, CssBaseline, makeStyles } from '@material-ui/core';
import NavBar from 'components/NavBar.jsx';
import UserAppsList from './UserAppsList';
import CodxCircularLoader from '../CodxCircularLoader';
import { getUserAppsHierarchy, getDashboardsList } from 'services/dashboard.js';

const useStyles = makeStyles((theme) => ({
    bodyContainer: {
        height: '100%',
        position: 'relative'
    },
    body: {
        height: `calc(100% - ${theme.spacing(12)})`
    }
}));

export default function UserDashboard({ user_permissions, is_restricted_user, ...props }) {
    const classes = useStyles();
    const [appsDataLoading, setAppsDataLoading] = useState(false);
    const [appsData, setAppsData] = useState();
    const [dashboardsData, setDashboardsData] = useState();

    const loadUserApps = useCallback(async () => {
        try {
            setAppsDataLoading(true);
            const res = await getUserAppsHierarchy();
            setAppsData(res);
            setAppsDataLoading(false);
        } catch (err) {
            setAppsDataLoading(false);
        }
    }, []);

    const fetchDashboardsList = useCallback(() => {
        getDashboardsList({
            callback: loadUserDashboard
        });
    }, []);

    const loadUserDashboard = (response_data) => {
        setDashboardsData(response_data);
    };

    useEffect(() => {
        loadUserApps();
        fetchDashboardsList();
    }, [loadUserApps, fetchDashboardsList]);

    return (
        <div className={classes.bodyContainer}>
            <CssBaseline />
            <NavBar
                {...props}
                user_permissions={user_permissions}
                is_restricted_user={is_restricted_user}
                apps={[]}
            ></NavBar>
            <div className={classes.body}>
                <Box display="flex" flexDirection="column" gridGap="2rem" height="100%">
                    {appsDataLoading ? (
                        <CodxCircularLoader size={60} center />
                    ) : (
                        <UserAppsList
                            {...props}
                            data={appsData}
                            user_permissions={user_permissions}
                            is_restricted_user={is_restricted_user}
                            dashboardsData={dashboardsData}
                        />
                    )}
                </Box>
            </div>
        </div>
    );
}
