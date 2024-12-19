import React, { useState } from 'react';
import SideBar from '../../SideBar';
import AppNavBar from '../../AppNavBar';
import { Route, Switch } from 'react-router-dom';
import LandingPage from '../landingPage';
import UploadReports from '../pages/uploadReports';
import Followup from '../pages/followup';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    domContainer: {
        height: '100%',
        position: 'relative'
    },
    bodyContainer: {
        height: '100%',
        position: 'relative'
    },
    body: {
        height: 'calc(100% - ' + theme.spacing(13) + ')',
        marginBottom: theme.spacing(5),
        marginLeft: theme.spacing(30),
        overflowY: 'auto',
        position: 'relative',
        transition: 'all 500ms'
    },
    fullScreenBody: {
        height: 'calc(100% - ' + theme.spacing(13) + ')',
        marginBottom: theme.spacing(5),
        marginLeft: theme.spacing(7),
        overflowY: 'auto',
        position: 'relative',
        transition: 'all 500ms'
    },
    wrapper: {
        display: 'flex',
        height: 'calc(100% - 5.4rem)',
        width: '100%',
        paddingRight: theme.layoutSpacing(16),
        paddingBottom: theme.layoutSpacing(8),
        background: theme.palette.background.paper
    },
    bodyContent: {
        height: 'auto',
        width: '100%',
        overflow: 'hidden',
        background: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        marginTop: theme.layoutSpacing(8)
    },
    codxLogo: {
        height: theme.spacing(4),
        margin: theme.spacing(1, 0),
        fill: theme.palette.primary.contrastText + ' !important'
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start'
    },
    appMainLoader: {
        marginTop: theme.spacing(2)
    },
    storiesActionItems: {
        display: 'flex',
        alignItems: 'center'
    },
    selectedItems: {
        fontWeight: 500,
        fontSize: theme.spacing(2.5),
        color: theme.palette.text.titleText,
        marginRight: theme.spacing(2)
    },
    createReport: {
        marginRight: theme.spacing(2),
        cursor: 'pointer',
        '& circle': {
            fill: theme.palette.primary.contrastText + ' !important'
        }
    },
    downloadReport: {
        marginRight: theme.spacing(2),
        '& circle': {
            fill: theme.palette.primary.contrastText + ' !important'
        }
    },
    selectAllButton: {
        transform: 'scale(2)',
        padding: 'unset',
        marginRight: theme.spacing(2)
    },
    drawer: {
        width: 'calc(100% - 82.5%)'
    },
    drawerClose: {
        width: '3.025%',
        transition: 'width 300ms ease'
    }
}));

export default function DiagnosemeSideBar() {
    const classes = useStyles();

    const [drawerCon, setDrawerCon] = useState(false);

    const drawerCondition = () => {
        setDrawerCon(!setDrawerCon);
    };

    const sideBarProps = {
        parent: 'App',
        hide: false,
        is_restricted_user: false,
        app_info: {
            name: 'diagnosemeSample',
            screens: [
                {
                    screen_index: 0,
                    screen_name: 'Home'
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
                    screen_name: 'Start Diagnosis',
                    hidden: false
                },
                selected: false,
                original_href: '/diagnoseme/landingpage',
                href: '/diagnoseme/diagnosis',
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
                    screen_name: 'Upload Reports',
                    hidden: false
                },
                selected: false,
                original_href: '/diagnoseme/uploadReports',
                href: '/diagnoseme/uploadReports',
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
                    screen_name: 'Follow Up',
                    hidden: false
                },
                selected: false,
                original_href: '/diagnoseme/Followup',
                href: '/diagnoseme/Followup',
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
    };

    const appNavBarProps = {
        app_info: {
            name: 'Diagnoseme',
            modules: {
                dashboard: false,
                user_guide: true
            }
        },
        parent: 'App',
        user_permissions: {
            app: true,
            case_studies: false,
            my_projects: true,
            my_projects_only: true,
            all_projects: true,
            widget_factory: true,
            environments: true,
            rbac: true,
            admin: true,
            app_publish: true
        }
    };

    return (
        <div key="dom-container" className={classes.domContainer} data-testid="diagnoseme-sidebar">
            <div key="body-container" className={classes.bodyContainer}>
                <CssBaseline />
                <AppNavBar
                    app_info={appNavBarProps.app_info}
                    appscreen_configure_link={appNavBarProps.appscreen_configure_link}
                    appscreen_link={appNavBarProps.appscreen_link}
                    is_screen_configure={appNavBarProps.is_screen_configure}
                    parent={appNavBarProps.parent}
                    is_restricted_user={appNavBarProps.is_restricted_user}
                    user_permissions={appNavBarProps.user_permissions}
                    DS_ClickHandle={(val) => this.DS_ClickHandle(val)}
                    drawerCon={drawerCon}
                />
                <div className={classes.wrapper}>
                    <div id="sidebar" className={drawerCon ? classes.drawerClose : classes.drawer}>
                        <SideBar
                            parent={sideBarProps.parent}
                            is_restricted_user={sideBarProps.is_restricted_user}
                            hide={sideBarProps.hide}
                            app_id={sideBarProps.app_id}
                            app_info={sideBarProps.app_info}
                            routes={sideBarProps.routes}
                            user_permissions={sideBarProps.user_permissions}
                            drawerCon={drawerCondition}
                        />
                    </div>
                    <div id="bodyContent" className={classes.bodyContent}>
                        <Switch>
                            <Route
                                exact
                                path="/diagnoseme/diagnosis"
                                render={() => <LandingPage />}
                            />
                            <Route
                                exact
                                path="/diagnoseme/landingpage"
                                render={() => <LandingPage />}
                            />
                            <Route
                                exact
                                path="/diagnoseme/uploadReports"
                                render={() => <UploadReports />}
                            />
                            <Route exact path="/diagnoseme/followup" render={() => <Followup />} />
                            <Route exact path="/diagnoseme" render={() => <LandingPage />} />
                        </Switch>
                    </div>
                </div>
            </div>
        </div>
    );
}
