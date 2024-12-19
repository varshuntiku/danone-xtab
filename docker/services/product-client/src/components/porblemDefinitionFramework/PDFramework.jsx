import React, { useContext, useEffect } from 'react';
// import clsx from 'clsx';
import { CssBaseline, makeStyles } from '@material-ui/core';
import NavBar from '../NavBar';
import PDFrameWorkSideBar from './PDFrameworkSideBar';
import { Redirect, Route, Switch } from 'react-router-dom';
import PDFrameWorkProjects from './PDFramworkProjects';
import PDFrameworkCreateProject from './create/PDFrameworkCreateProject';
// import { useMatomo } from '@datapunt/matomo-tracker-react';
import { connect } from 'react-redux';
import { getMatomoPvid } from 'store/index';
import { logMatomoEvent } from '../../services/matomo';
import { CustomThemeContext } from 'themes/customThemeContext';

const useStyles = makeStyles((theme) => ({
    bodyContainer: {
        height: '99%',
        position: 'relative'
    },
    body: {
        height: `calc(100% - ${theme.spacing(12)})`,
        marginLeft: theme.spacing(30)
    },
    bodyFullScreen: {
        height: `calc(100% - ${theme.spacing(12)})`
    }
}));

function PDFrameWork({ user_permissions, user_info, ...props }) {
    const classes = useStyles();
    const { changeTheme } = useContext(CustomThemeContext);
    // const {location} = window;
    // const fullBody = location.pathname.includes('create') || location.pathname.endsWith("edit");
    const fullBody = true;
    // const { trackPageView } = useMatomo()
    useEffect(() => {
        changeTheme('light', null);
        props.getMatomoPvid('PDFramework');
    }, []);
    useEffect(() => {
        if (props.matomo?.pv_id) {
            logMatomoEvent({
                action_name: 'PDFramework',
                url: window.location.href,
                urlref: window.location.href,
                pv_id: props.matomo.pv_id
            });
        }
    }, [props.matomo.pv_id]);
    return (
        <div className={classes.bodyContainer}>
            <CssBaseline />
            <PDFrameWorkSideBar fullBody={fullBody} />
            <NavBar {...props} user_permissions={user_permissions} apps={[]}></NavBar>
            <div className={fullBody ? classes.bodyFullScreen : classes.body}>
                <Switch>
                    <Route
                        exact
                        path="/projects/list"
                        render={(props) => (
                            <PDFrameWorkProjects user_permissions={user_permissions} {...props} />
                        )}
                    />
                    <Route
                        exact
                        path="/projects/:projectId/edit"
                        render={(props) => (
                            <PDFrameworkCreateProject
                                user_info={user_info}
                                user_permissions={user_permissions}
                                {...props}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/projects/:projectId/view"
                        render={(props) => (
                            <PDFrameworkCreateProject
                                user_info={user_info}
                                user_permissions={user_permissions}
                                {...props}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/projects/:projectId/version/:versionId/edit"
                        render={(props) => (
                            <PDFrameworkCreateProject
                                user_info={user_info}
                                user_permissions={user_permissions}
                                {...props}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/projects/:projectId/version/:versionId/view"
                        render={(props) => (
                            <PDFrameworkCreateProject
                                user_info={user_info}
                                user_permissions={user_permissions}
                                {...props}
                            />
                        )}
                    />
                    {user_permissions.all_projects ||
                    user_permissions.my_projects_only ||
                    user_permissions.my_projects ? (
                        <Route
                            exact
                            path="/projects/create"
                            render={(props) => (
                                <PDFrameworkCreateProject
                                    user_info={user_info}
                                    user_permissions={user_permissions}
                                    {...props}
                                />
                            )}
                        />
                    ) : null}
                    <Redirect to="/projects/list" />
                </Switch>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        matomo: state.matomo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getMatomoPvid: (pageType) => dispatch(getMatomoPvid(pageType))
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
    PDFrameWork
);
