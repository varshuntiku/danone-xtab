import React, { useContext, useEffect, useState } from 'react';
import Applications from '../../Utils/Applications';
import { makeStyles } from '@material-ui/core';
import CustomSnackbar from 'components/CustomSnackbar';
import DSSideBar from '../Applications/DSSideBar';
import { getIds } from '../Applications/utils';
import { getApp, create_slug } from 'services/app.js';
import sanitizeHtml from 'sanitize-html-react';
import * as _ from 'underscore';
import { CustomThemeContext, withThemeContext } from 'themes/customThemeContext';
import { withStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    createAppBtn: {
        top: theme.spacing(0.4),
        height: theme.spacing(6),
        lineHeight: theme.spacing(6)
    }
}));

function DSApplications(props) {
    const { projectId, dsAppConfig, user_permissions, isAdminRoute } = props;
    const { projectDetailsState, setProjectDetailsState } = dsAppConfig;
    const classes = useStyles();
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notification, setNotification] = useState({});
    const [state, setState] = useState({
        loading: false,
        app_id: null,
        project_id: null,
        item_name: ''
    });
    const { changeTheme } = useContext(CustomThemeContext);

    useEffect(() => {
        let idConfig = getIds();
        if (idConfig && idConfig.app_id) {
            setState((prevState) => ({
                ...prevState,
                loading: true,
                app_id: idConfig.app_id,
                project_id: idConfig.project_id,
                item_name: idConfig.item_name
            }));
            getApp({
                app_id: idConfig.app_id || state.app_id,
                callback: onResponseGetApp,
                goto_app: false
            });
        }
        if (!idConfig && !projectDetailsState.showAppAdmin) {
            setState((prevState) => ({
                ...prevState,
                loading: false
            }));
        }
    }, []);

    if (projectDetailsState.showAppAdmin) {
        props.match.params['appid'] = projectDetailsState.selectedRow.id;
        props.history.push({
            pathname: `/ds-workbench/project/${props.projectId}/deploy/applications/app/${projectDetailsState.selectedRow.id}/admin/overview`
        });
        setProjectDetailsState((prevState) => ({
            ...prevState,
            showAppAdmin: false
        }));
    }

    const onResponseGetApp = (response_data) => {
        if (response_data.status && response_data.status === 'error') {
            setState((prevState) => ({
                ...prevState,
                loading: false
            }));
            setNotificationOpen(true);
            setNotification({
                message: 'Failed to get Application',
                severity: 'error'
            });
        } else {
            if (response_data.restricted_app) {
                setState({
                    loading: false,
                    access_denied: true
                });
            } else {
                response_data.screens = _.sortBy(response_data.screens, function (screen_info) {
                    return screen_info.screen_index;
                });
                changeTheme(props.themeContext.themeMode, response_data.theme_id);

                localStorage.removeItem('select-all-charts');
                delete response_data.goto_app;
                let app_info = response_data;
                let routes = getRoutes(app_info);
                const screenWithSteps = getStepperScreens(app_info?.screens);
                let is_screen_configure = false;

                if (props.location.pathname.indexOf('app-configure') !== -1) {
                    is_screen_configure = true;
                }

                var configure_link = false;
                var screen_link = false;
                var appscreen_configure_link_details = _.filter(routes, function (route_item) {
                    return route_item.selected;
                });

                if (is_screen_configure) {
                    if (
                        appscreen_configure_link_details &&
                        appscreen_configure_link_details.length > 0 &&
                        appscreen_configure_link_details[
                            appscreen_configure_link_details.length - 1
                        ].href
                    ) {
                        configure_link =
                            appscreen_configure_link_details[
                                appscreen_configure_link_details.length - 1
                            ].href;
                        screen_link = appscreen_configure_link_details[
                            appscreen_configure_link_details.length - 1
                        ].href.replace('/app-configure/', '/app/');
                    }
                } else {
                    if (
                        appscreen_configure_link_details &&
                        appscreen_configure_link_details.length > 0 &&
                        appscreen_configure_link_details[
                            appscreen_configure_link_details.length - 1
                        ].href
                    ) {
                        configure_link = appscreen_configure_link_details[
                            appscreen_configure_link_details.length - 1
                        ].href.replace('/app/', '/app-configure/');
                        screen_link =
                            appscreen_configure_link_details[
                                appscreen_configure_link_details.length - 1
                            ].href;
                    }
                }

                setState((prevState) => ({
                    ...prevState,
                    loading: false,
                    app_info: app_info,
                    routes: routes,
                    appscreen_configure_link: configure_link,
                    appscreen_link: screen_link,
                    is_screen_configure: is_screen_configure,
                    stepperScreens: screenWithSteps
                }));
            }
        }
    };

    const getRoutes = (app_info) => {
        var is_screen_configure = false;
        let appId = app_info.id;
        var url_slugs = [];
        var routes = [];
        var current_first_level = false;
        var current_second_level = false;
        // eslint-disable-next-line no-unused-vars
        var current_third_level = false;

        const screens = app_info.screens;
        _.each(
            screens,
            function (screen_item, i) {
                if (!screen_item.level) {
                    current_first_level = screen_item;
                    current_second_level = false;
                    current_third_level = false;

                    let original_href =
                        (is_screen_configure ? '/app-configure/' : '/app/') +
                        appId +
                        '/' +
                        create_slug(screen_item.screen_name);
                    original_href = sanitizeHtml(original_href);
                    let href = original_href;
                    if (screens[i + 1] && screens[i + 1].level === 1) {
                        href += '/' + create_slug(screens[i + 1].screen_name);
                        if (screens[i + 2] && screens[i + 2].level === 2) {
                            href += '/' + create_slug(screens[i + 2].screen_name);
                            if (screens[i + 3] && screens[i + 3].level === 3) {
                                href += '/' + create_slug(screens[i + 3].screen_name);
                            }
                        }
                        if (screens[i + 2] && screens[i + 2].level === 3) {
                            href += '/' + create_slug(screens[i + 2].screen_name);
                        } else if (
                            screens[i + 3] &&
                            screens[i + 3].level === 3 &&
                            screens[i + 1].level !== 1
                        ) {
                            href += '/' + create_slug(screens[i + 3].screen_name);
                        }
                    } else if (screens[i + 1] && screens[i + 1].level === 2) {
                        href += '/' + create_slug(screens[i + 1].screen_name);
                        if (screens[i + 2] && screens[i + 2].level === 3) {
                            href += '/' + create_slug(screens[i + 2].screen_name);
                        }
                    } else if (screens[i + 1] && screens[i + 1].level === 3) {
                        href += '/' + create_slug(screens[i + 1].screen_name);
                    }

                    routes.push({
                        screen_item: screen_item,
                        selected:
                            url_slugs.length >= 0 &&
                            url_slugs.length < 3 &&
                            create_slug(screen_item.screen_name) === url_slugs[0],
                        original_href: original_href,
                        href: href,
                        show: true,
                        show_title: true,
                        expanded:
                            url_slugs.length >= 0 &&
                            url_slugs.length > 2 &&
                            create_slug(screen_item.screen_name) === url_slugs[0],
                        level: 0
                    });
                } else if (screen_item.level === 1) {
                    let original_href =
                        (is_screen_configure ? '/app-configure/' : '/app/') +
                        appId +
                        '/' +
                        create_slug(current_first_level.screen_name) +
                        '/' +
                        create_slug(screen_item.screen_name);
                    original_href = sanitizeHtml(original_href);
                    let href = original_href;

                    if (screens[i + 1] && screens[i + 1].level === 2) {
                        href += '/' + create_slug(screens[i + 1].screen_name);
                        if (screens[i + 2] && screens[i + 2].level === 3) {
                            href += '/' + create_slug(screens[i + 2].screen_name);
                        }
                    } else if (screens[i + 1] && screens[i + 1].level === 3) {
                        href += '/' + create_slug(screens[i + 1].screen_name);
                    }

                    current_second_level = screen_item;
                    current_third_level = false;

                    routes.push({
                        screen_item: screen_item,
                        selected:
                            url_slugs.length >= 1 &&
                            create_slug(screen_item.screen_name) === url_slugs[1],
                        original_href: original_href,
                        href: href,
                        level: 1,
                        show: create_slug(current_first_level.screen_name) === url_slugs[0]
                    });
                } else if (screen_item.level === 2) {
                    let original_href =
                        (is_screen_configure ? '/app-configure/' : '/app/') +
                        appId +
                        '/' +
                        create_slug(current_first_level['screen_name']) +
                        '/' +
                        (current_second_level
                            ? create_slug(current_second_level['screen_name']) + '/'
                            : '') +
                        create_slug(screen_item['screen_name']);

                    original_href = sanitizeHtml(original_href);

                    let href = original_href;

                    if (screens[i + 1] && screens[i + 1].level === 3) {
                        href += '/' + create_slug(screens[i + 1].screen_name);
                    }

                    current_third_level = screen_item;

                    let show = false;

                    if (url_slugs.length === 3 && current_second_level) {
                        show =
                            create_slug(current_first_level.screen_name) === url_slugs[0] &&
                            create_slug(current_second_level.screen_name) === url_slugs[1];
                    } else if (url_slugs.length === 2 && !current_second_level) {
                        show = create_slug(current_first_level.screen_name) === url_slugs[0];
                    }

                    routes.push({
                        screen_item: screen_item,
                        selected:
                            (url_slugs.length === 2 &&
                                url_slugs[1] === create_slug(screen_item.screen_name)) ||
                            (url_slugs.length === 3 &&
                                url_slugs[2] === create_slug(screen_item.screen_name)),
                        original_href: original_href,
                        href: href,
                        level: 2,
                        show: show
                    });
                }
            },
            this
        );

        routes = _.sortBy(routes, function (route_item) {
            return route_item.screen_index;
        });
        let i = 0;
        while (i < routes.length) {
            let subScreenFound = false;
            if (!routes[i].level) {
                let j = i + 1;
                while (j < routes.length && routes[j].level) {
                    if (routes[j].level === 1) {
                        subScreenFound = true;
                        break;
                    }
                    j++;
                }
                routes[i].expandable = subScreenFound;
                i = j;
            } else {
                i++;
            }
        }
        return routes;
    };

    const getStepperScreens = (screens) => {
        // Function to transform steps data structure into {screenID1: [{step1},{step2}]}
        let transformedStepObj = {};
        let stepperScreensID = [];
        let stepperScreens = [];
        for (let index = 0; index <= screens?.length; index++) {
            const element = screens[index];
            if (element?.level && element?.level === 3) {
                stepperScreensID.push(element.id);
                stepperScreens.push(element);
            } else {
                for (const key of stepperScreensID) {
                    transformedStepObj[key] = stepperScreens;
                }
                stepperScreensID = [];
                stepperScreens = [];
            }
        }
        return transformedStepObj;
    };

    const refreshAppSilent = async (appId) => {
        return await getApp({
            app_id: state.app_id || appId,
            callback: onResponseGetApp,
            goto_app: false
        });
    };
    const parent_obj = {
        refreshAppSilent,
        state,
        setState
    };

    return (
        <React.Fragment>
            {projectDetailsState.showAppAdmin || isAdminRoute ? (
                <DSSideBar
                    dsAppConfig={dsAppConfig}
                    app_info={state.app_info}
                    parent_obj={parent_obj}
                />
            ) : (
                <Applications
                    isDsWorkbench={true}
                    dsAppConfig={dsAppConfig}
                    projectId={projectId}
                    user_permissions={user_permissions}
                    classes={classes}
                    setProjectDetailsState={setProjectDetailsState}
                    setNotification={setNotification}
                    setNotificationOpen={setNotificationOpen}
                />
            )}

            <CustomSnackbar
                open={notificationOpen && notification?.message}
                autoHideDuration={3000}
                onClose={setNotificationOpen.bind(null, false)}
                severity={notification?.severity || 'success'}
                message={notification?.message}
            />
        </React.Fragment>
    );
}

export default withStyles()(withThemeContext(DSApplications));
