import React, { useEffect, useState } from 'react';
import SideBar from '../../SideBar';
import sidebarStyle from 'assets/jss/sidebarStyle.jsx';
import { makeStyles } from '@material-ui/core';
import { Route, Switch } from 'react-router-dom';
import { getIds } from '../Applications/utils';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import clsx from 'clsx';
import AppAdminOverview from 'components/Admin/Overview.jsx';
import AppAdminModules from 'components/Admin/Modules.jsx';
import AppAdminModuleUserRoles from 'components/Admin/UserRoles.jsx';
import AppAdminScreens from 'components/Admin/AppAdminScreens';
import AppAdminCreateVersion from 'components/Admin/CreateVersion.jsx';

const useStyles = makeStyles((theme) => ({
    ...sidebarStyle(theme),
    domContainer: {
        height: '100%',
        position: 'relative',
        background: theme.palette.background.pureWhite
    },
    bodyContainer: {
        height: '100%',
        position: 'relative',
        '@media (max-height: 600px)': {
            height: 'calc(100% - 6rem)'
        },
        '@media (max-height: 560px)': {
            height: 'calc(100% - 12rem)'
        }
    },
    root: {
        width: theme.layoutSpacing(269),
        transition: 'width 300ms ease'
    },
    wrapper: {
        display: 'flex',
        height: '100%',
        width: '100%',
        paddingRight: theme.layoutSpacing(16),
        paddingBottom: theme.layoutSpacing(8),
        background: theme.palette.background.paper
    },
    toggleButton: {
        '& svg': {
            fill: theme.palette.text.revamp
        },
        '&:hover': {
            '& svg': {
                fill: theme.Toggle.DarkIconColor
            }
        }
    },
    defaultTextColor: {
        fill: theme.palette.text.default
    },
    closeMode: {
        width: theme.layoutSpacing(40),
        minWidth: theme.layoutSpacing(40)
    },
    drawerHidden1: {
        width: '100%',
        flexShrink: 0,
        height: '100%',
        transition: 'all 500ms smooth',
        '&:hover': {
            transition: 'width 600ms ease'
        }
    },
    drawerHidden: {
        width: '30% !important',
        flexShrink: 0,
        height: '100%',
        transition: 'all 500ms smooth'
    },
    drawerPaper2: {
        paddingBottom: theme.layoutSpacing(4)
    },
    drawerIconHidden: {
        width: '3.4rem',
        height: '3.4rem'
    },
    disabled: {
        opacity: '0.6',
        filter: 'grayscale(0.8)',
        cursor: 'not-allowed'
    },
    drawer: {
        width: 'calc(100% - 82.5%)'
    },
    drawerClose: {
        width: '3.025%',
        transition: 'width 300ms ease'
    },
    bodyContent: {
        height: '100%',
        width: 'calc(100% - 17.5%)',
        overflow: 'auto',
        background: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        marginTop: theme.layoutSpacing(7)
    },
    bodyContentFullWidth: {
        width: '100% !important'
    }
}));

function DSSideBar(props) {
    const classes = useStyles();
    const [drawerCon, setDrawerCon] = useState(false);
    const { dsAppConfig, app_info, parent_obj } = props;
    const { projectDetailsState } = dsAppConfig;
    const [sideBarProps, setSideBarProps] = useState({});
    const [loading, setLoading] = useState(true);

    const drawerCondition = () => {
        setDrawerCon(!drawerCon);
    };

    useEffect(() => {
        const ids = getIds();
        const project_id = ids.project_id;
        const app_id = ids.app_id;
        const item_name = ids.item_name;

        setSideBarProps({
            parent: 'App',
            hide: false,
            is_restricted_user: false,
            app_id: app_id,
            app_info: {
                projectId: project_id,
                name: projectDetailsState.selectedRow?.name || '',
                id: app_id,
                screens: [
                    {
                        screen_index: 0,
                        screen_name: 'Applications'
                    }
                ],
                modules: {
                    dashboard: true
                },
                is_user_admin: true
            },
            routes: [
                {
                    screen_item: {
                        id: 56717,
                        screen_index: 0,
                        screen_name: 'Overview',
                        hidden: false
                    },
                    selected: item_name === 'overview',
                    selectedClass: 'selectedTxt',
                    original_href:
                        '/ds-workbench/project/' +
                        project_id +
                        '/deploy/applications/app/' +
                        app_id +
                        '/admin/overview',
                    href:
                        '/ds-workbench/project/' +
                        project_id +
                        '/deploy/applications/app/' +
                        app_id +
                        '/admin/overview',
                    show: true,
                    show_title: true,
                    expanded: false,
                    level: 0,
                    expandable: false
                },
                {
                    screen_item: {
                        id: 56717,
                        screen_index: 0,
                        screen_name: 'Modules',
                        hidden: false
                    },
                    selected: item_name === 'modules' || item_name === 'user-mgmt',
                    selectedClass: 'selectedTxt',
                    original_href:
                        '/ds-workbench/project/' +
                        project_id +
                        '/deploy/applications/app/' +
                        app_id +
                        '/admin/modules',
                    href:
                        '/ds-workbench/project/' +
                        project_id +
                        '/deploy/applications/app/' +
                        app_id +
                        '/admin/modules',
                    show: true,
                    show_title: true,
                    expanded: false,
                    level: 0,
                    expandable: false
                },
                {
                    screen_item: {
                        id: 56717,
                        screen_index: 0,
                        screen_name: 'Screens',
                        hidden: false
                    },
                    selected: item_name === 'screens',
                    selectedClass: 'selectedTxt',
                    original_href:
                        '/ds-workbench/project/' +
                        project_id +
                        '/deploy/applications/app/' +
                        app_id +
                        '/admin/screens',
                    href:
                        '/ds-workbench/project/' +
                        project_id +
                        '/deploy/applications/app/' +
                        app_id +
                        '/admin/screens',
                    show: true,
                    show_title: true,
                    expanded: false,
                    level: 0,
                    expandable: false
                },
                {
                    screen_item: {
                        id: 56717,
                        screen_index: 0,
                        screen_name: 'Configure',
                        hidden: false
                    },
                    selected: item_name === 'configure',
                    selectedClass: 'selectedTxt',
                    original_href:
                        '/ds-workbench/project/' +
                        project_id +
                        '/deploy/applications/app/' +
                        app_id +
                        '/admin/configure',
                    href:
                        '/ds-workbench/project/' +
                        project_id +
                        '/deploy/applications/app/' +
                        app_id +
                        '/admin/configure',
                    show: true,
                    show_title: true,
                    expanded: false,
                    level: 0,
                    expandable: false
                }
            ],
            user_permissions: {
                admin: true,
                all_projects: true,
                app: true,
                app_publish: true,
                case_studies: false,
                environments: true,
                my_projects: true,
                my_projects_only: true,
                rbac: true,
                widget_factory: true
            }
        });
        setLoading(false);
    }, []);

    return (
        <React.Fragment>
            <div key="dom-container" className={classes.domContainer}>
                {loading ? (
                    <CodxCircularLoader size={60} center />
                ) : (
                    <div key="body-container" className={classes.bodyContainer}>
                        <div id="wrapper" className={classes.wrapper}>
                            <div
                                id="sidebar"
                                className={drawerCon ? classes.drawerClose : classes.drawer}
                            >
                                <SideBar
                                    parent={sideBarProps.parent}
                                    is_restricted_user={sideBarProps.is_restricted_user}
                                    hide={sideBarProps.hide}
                                    app_id={sideBarProps.app_id}
                                    app_info={sideBarProps.app_info}
                                    routes={sideBarProps.routes}
                                    user_permissions={sideBarProps.user_permissions}
                                    drawerCon={drawerCondition}
                                    isDsWorkbench={true}
                                />
                            </div>
                            <div
                                id="screen_action-floater"
                                style={{
                                    position: 'fixed',
                                    padding: '0.5rem',
                                    zIndex: '100'
                                }}
                            />
                            {app_info ? (
                                <div
                                    id="bodyContent"
                                    className={
                                        drawerCon
                                            ? clsx(
                                                  classes.bodyContainer,
                                                  classes.bodyContentFullWidth
                                              )
                                            : classes.bodyContent
                                    }
                                >
                                    <div className={classes.appAdminContainer}>
                                        <Switch>
                                            <Route
                                                exact
                                                path="/ds-workbench/project/:projectId/deploy/applications/app/:appId/admin/overview"
                                                render={(p) => (
                                                    <AppAdminOverview
                                                        app_info={app_info}
                                                        parent_obj={parent_obj}
                                                        {...p}
                                                        isDsWorkbench={true}
                                                    />
                                                )}
                                            />
                                            <Route
                                                exact
                                                path="/ds-workbench/project/:projectId/deploy/applications/app/:appId/admin/modules"
                                                render={(p) => (
                                                    <AppAdminModules
                                                        app_info={app_info}
                                                        parent_obj={parent_obj}
                                                        {...p}
                                                        isDsWorkbench={true}
                                                    />
                                                )}
                                            />
                                            <Route
                                                exact
                                                path="/ds-workbench/project/:projectId/deploy/applications/app/:appId/user-mgmt/user-roles"
                                                render={(p) => (
                                                    <AppAdminModuleUserRoles
                                                        key={p.location.key}
                                                        app_info={app_info}
                                                        config={app_info}
                                                        {...p}
                                                        parent_obj={parent_obj}
                                                        isDsWorkbench={true}
                                                    />
                                                )}
                                            />
                                            <Route
                                                exact
                                                path="/ds-workbench/project/:projectId/deploy/applications/app/:appId/admin/screens/:screen_id"
                                                render={(p) => (
                                                    <AppAdminScreens
                                                        app_info={app_info}
                                                        parent_obj={parent_obj}
                                                        {...p}
                                                        isDsWorkbench={true}
                                                    />
                                                )}
                                            />
                                            <Route
                                                exact
                                                path="/ds-workbench/project/:projectId/deploy/applications/app/:appId/admin/screens"
                                                render={(p) => (
                                                    <AppAdminScreens
                                                        app_info={app_info}
                                                        parent_obj={parent_obj}
                                                        {...p}
                                                        isDsWorkbench={true}
                                                    />
                                                )}
                                            />
                                            <Route
                                                exact
                                                path="/ds-workbench/project/:projectId/deploy/applications/app/:appId/admin/configure"
                                                render={(p) => (
                                                    <AppAdminCreateVersion
                                                        app_info={app_info}
                                                        parent_obj={parent_obj}
                                                        {...p}
                                                    />
                                                )}
                                            />
                                        </Switch>
                                    </div>
                                </div>
                            ) : (
                                <CodxCircularLoader size={60} center />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
}

export default DSSideBar;
