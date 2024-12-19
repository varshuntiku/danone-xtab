import React, { lazy, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { withThemeContext } from '../themes/customThemeContext';
import { create_slug, getApp } from 'services/app';
import CustomBottomNavigation from './BottomNavigation';
import mobileAppStyle from 'assets/jss/mobileAppStyle';
import sanitizeHtml from 'sanitize-html-react';
import AppContext from 'context/appContext';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import LinearProgressBar from './LinearProgressBar';
import AccessDenied from 'components/AccessDenied.jsx';
import PageNotFound from 'components/PageNotFound.jsx';
import MobileAppNavbar from './MobileAppNavbar';
const MobileAppScreen = lazy(() => import('./MobileAppScreen'));

import * as _ from 'underscore';
import { decodeHtmlEntities } from '../util/decodeHtmlEntities';

const MobileApp = (props) => {
    const classes = props.classes;

    const [appId] = useState(props?.match?.params?.app_id ? props.match.params.app_id : false);
    const [appInfo, setAppInfo] = useState(false);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageNotFound, setPageNotFound] = useState(false);
    const [pageNotFoundMessage, setPageNotFoundMessage] = useState('');
    const [accessDenied, setAccessDenied] = useState(false);
    const isRestrictedUser = props.is_restricted_user;
    const pathPrefix = props.location.pathname.includes('m-app') ? 'm-app' : 'app';

    useEffect(() => {
        getAppData();
        // document.getElementById('zenToggle').style.display = 'none';
    }, []);

    const getAppData = () => {
        setLoading(true);

        getApp({
            app_id: appId,
            callback: onResponseGetAppData
        });
    };

    const onResponseGetAppData = (response_data) => {
        if (response_data.status && response_data.status === 'error') {
            setLoading(false);
            setPageNotFound(true);
            setPageNotFoundMessage(response_data.message);
        } else {
            if (response_data.restricted_app) {
                setLoading(false);
                setAccessDenied(true);
            } else {
                response_data.screens = _.sortBy(response_data.screens, function (screen_info) {
                    return screen_info.screen_index;
                });
                props.themeContext.changeTheme(props.themeContext.mode, response_data.theme_id);

                let app_info = response_data;
                let app_routes = getRoutes(app_info);

                if (!app_routes) {
                    setPageNotFound(true);
                    setPageNotFoundMessage('Page not found');
                } else {
                    setAppInfo(app_info);
                    setRoutes(app_routes);
                }
                setLoading(false);
            }
        }
    };

    const getScreenRange = (
        screens = [],
        first_level_slug = '',
        second_level_slug = '',
        third_level_slug = ''
    ) => {
        let slug1Match = false;
        let slug2Match = false;
        let slug3Match = false;

        let startIndex = 0;
        let endIndex = 0;

        let active_level = -1;

        let i = 0;

        if (!first_level_slug) {
            first_level_slug = create_slug(screens[0].screen_name);
        }

        for (; i < screens.length; i++) {
            const screen = screens[i];
            const screen_name = create_slug(screen.screen_name);
            const screen_level = screen.level || 0;
            if (screen_level !== active_level) {
                active_level = screen_level;
                startIndex = i;
            }

            if (screen_name === first_level_slug && screen_level == 0) {
                slug1Match = true;
                break;
            }
        }

        if (!slug1Match) {
            return null;
        }

        if (!second_level_slug && i < screens.length - 1) {
            const screen = screens[i + 1];
            const screen_name = create_slug(screen.screen_name);
            const screen_level = screen.level || 0;
            if (screen_level > active_level) {
                second_level_slug = screen_name;
            }
        }

        if (second_level_slug) {
            for (; i < screens.length; i++) {
                const screen = screens[i];
                const screen_name = create_slug(screen.screen_name);
                const screen_level = screen.level || 0;
                if (screen_level !== active_level) {
                    active_level = screen_level;
                    startIndex = i;
                }

                if (screen_name === second_level_slug) {
                    slug2Match = true;
                    break;
                }
            }
        }

        if (second_level_slug && !slug2Match) {
            return null;
        }

        if (!third_level_slug && i < screens.length - 1) {
            const screen = screens[i + 1];
            const screen_name = create_slug(screen.screen_name);
            const screen_level = screen.level || 0;
            if (screen_level > active_level) {
                third_level_slug = screen_name;
            }
        }

        if (third_level_slug) {
            for (; i < screens.length; i++) {
                const screen = screens[i];
                const screen_name = create_slug(screen.screen_name);
                const screen_level = screen.level || 0;
                if (screen_level !== active_level) {
                    active_level = screen_level;
                    startIndex = i;
                }

                if (screen_name === third_level_slug) {
                    slug3Match = true;
                    break;
                }
            }
        }

        if (third_level_slug && !slug3Match) {
            return null;
        }

        for (; i < screens.length; i++) {
            const screen = screens[i];
            const screen_level = screen.level || 0;
            if (screen_level === active_level) {
                endIndex = i;
            } else if (screen_level > active_level) {
                endIndex -= 1;
                break;
            } else {
                break;
            }
        }

        return {
            startIndex,
            endIndex,
            active_level,
            slugs: [first_level_slug, second_level_slug, third_level_slug]
        };
    };

    const getRoutes = (app_info) => {
        let url_slugs = [];
        if (
            props.location.pathname.endsWith('/' + pathPrefix + '/' + appId + '/') ||
            props.location.pathname.endsWith('/' + pathPrefix + '/' + appId)
        ) {
            url_slugs = [];
        } else {
            url_slugs = props.location.pathname
                .replace('/' + pathPrefix + '/' + appId + '/', '||||')
                .split('||||')[1]
                .split('/');
        }

        let app_routes = [];
        let current_first_level = false;
        let current_second_level = false;
        let current_third_level = false;

        const screens = app_info.screens;

        const screensRange = getScreenRange(
            screens,
            url_slugs[0] || false,
            url_slugs[1] || false,
            url_slugs[2] || false
        );

        if (!screensRange) {
            return null;
        }

        let currentScreenIndex = screensRange?.['startIndex'];

        while (currentScreenIndex <= screensRange?.['endIndex']) {
            const screenItem = screens[currentScreenIndex];

            if (!screenItem.level) {
                current_first_level = screenItem;

                let original_href =
                    '/' + pathPrefix + '/' + appId + '/' + create_slug(screenItem.screen_name);
                original_href = sanitizeHtml(original_href);
                let href = original_href;

                app_routes.push({
                    screen_item: screenItem,
                    original_href: original_href,
                    href: href,
                    show_title: true,
                    level: 0
                });
            } else if (screenItem.level === 1) {
                // current_first_level = screens[screensRange?.['startIndex'] - 1];
                current_second_level = screenItem;
                let i = screensRange?.['startIndex'] - 1;
                for (; i >= 0; i--) {
                    const curScreenLevel = screens[i].level || 0;
                    if (curScreenLevel < current_second_level.level) {
                        break;
                    }
                }
                current_first_level = screens[i];

                let original_href =
                    '/' +
                    pathPrefix +
                    '/' +
                    appId +
                    '/' +
                    create_slug(current_first_level.screen_name) +
                    '/' +
                    create_slug(current_second_level.screen_name);
                original_href = sanitizeHtml(original_href);
                let href = original_href;

                app_routes.push({
                    screen_item: screenItem,
                    original_href: original_href,
                    href: href,
                    show_title: true,
                    level: 1
                });
            } else if (screenItem.level === 2) {
                if (screens[screensRange?.['startIndex'] - 1].level === 1) {
                    // current_first_level = screens[screensRange?.['startIndex'] - 2];
                    current_second_level = screens[screensRange?.['startIndex'] - 1];
                    current_third_level = screenItem;
                    let i = screensRange?.['startIndex'] - 2;
                    for (; i >= 0; i--) {
                        const curScreenLevel = screens[i].level || 0;
                        if (curScreenLevel < current_second_level.level) {
                            break;
                        }
                    }
                    current_first_level = screens[i];
                } else if (!screens[screensRange?.['startIndex'] - 1].level) {
                    current_first_level = screens[screensRange?.['startIndex'] - 1];
                    current_third_level = screenItem;
                }

                let original_href =
                    '/' +
                    pathPrefix +
                    '/' +
                    appId +
                    '/' +
                    create_slug(current_first_level['screen_name']) +
                    '/' +
                    (current_second_level
                        ? create_slug(current_second_level['screen_name']) + '/'
                        : '') +
                    create_slug(current_third_level['screen_name']);
                original_href = sanitizeHtml(original_href);
                let href = original_href;

                app_routes.push({
                    screen_item: screenItem,
                    original_href: original_href,
                    href: href,
                    show_title: true,
                    level: 2
                });
            }

            currentScreenIndex++;
        }

        app_routes = _.sortBy(app_routes, function (route_item) {
            return route_item.screen_index;
        });

        if (url_slugs.length === 0 && screens?.length > 0 && app_routes?.length > 0) {
            props.history.replace(app_routes[0]['href']);
        }

        if (
            screensRange?.['active_level'] > 0 &&
            url_slugs.length < screensRange?.['active_level'] + 1
        ) {
            let href =
                '/' +
                pathPrefix +
                '/' +
                appId +
                '/' +
                screensRange?.['slugs'].filter(Boolean).join('/');
            let sanitizedHref = decodeHtmlEntities(sanitizeHtml(href));
            props.history.replace(sanitizedHref);
        }

        return app_routes;
    };

    return (
        <React.Fragment>
            {appInfo ? (
                <div key="mdom-container" className={classes.mDomContainer}>
                    {loading ? (
                        <CodxCircularLoader size={60} center />
                    ) : (
                        <AppContext.Provider value={{ app_info: appInfo }}>
                            <div key="mbody-container" className={classes.mBodyContainer}>
                                <CssBaseline />
                                <MobileAppNavbar appName={appInfo.name} />
                                <div id="mwrapper" className={classes.mWrapper}>
                                    <div id="mBodyContent" className={classes.mBodyContent}>
                                        {loading ? (
                                            <div className={classes.mAppLoader}>
                                                <LinearProgressBar />
                                            </div>
                                        ) : (
                                            <Switch>
                                                <Route
                                                    exact
                                                    path={`/${pathPrefix}/:app_id/:first_level_slug`}
                                                    render={(routeProps) => (
                                                        <MobileAppScreen
                                                            key={props.location.key}
                                                            routes={routes}
                                                            app_info={appInfo}
                                                            logged_in_user_info={
                                                                props.logged_in_user_info
                                                            }
                                                            {...routeProps}
                                                        />
                                                    )}
                                                />
                                                <Route
                                                    exact
                                                    path={`/${pathPrefix}/:app_id/:first_level_slug/:second_level_slug`}
                                                    render={(routeProps) => (
                                                        <MobileAppScreen
                                                            key={props.location.key}
                                                            routes={routes}
                                                            app_info={appInfo}
                                                            logged_in_user_info={
                                                                props.logged_in_user_info
                                                            }
                                                            {...routeProps}
                                                        />
                                                    )}
                                                />
                                                <Route
                                                    exact
                                                    path={`/${pathPrefix}/:app_id/:first_level_slug/:second_level_slug/:third_level_slug`}
                                                    render={(routeProps) => (
                                                        <MobileAppScreen
                                                            key={props.location.key}
                                                            routes={routes}
                                                            app_info={appInfo}
                                                            logged_in_user_info={
                                                                props.logged_in_user_info
                                                            }
                                                            {...routeProps}
                                                        />
                                                    )}
                                                />
                                            </Switch>
                                        )}
                                    </div>
                                </div>

                                <CustomBottomNavigation
                                    is_restricted_user={isRestrictedUser}
                                    app_id={appId}
                                    app_info={appInfo}
                                    routes={routes}
                                    user_permissions={props.user_permissions}
                                    {...props}
                                />
                            </div>
                        </AppContext.Provider>
                    )}
                </div>
            ) : (
                <div key="mdom-container" className={classes.mDomContainer}>
                    <AppContext.Provider value={{ app_info: appInfo }}>
                        <div key="mbody-container" className={classes.mBodyContainer}>
                            <CssBaseline />
                            <MobileAppNavbar />
                            <div className={classes.mBody}>
                                {loading ? <LinearProgressBar /> : ''}
                                {pageNotFound ? (
                                    <PageNotFound message={pageNotFoundMessage} />
                                ) : accessDenied ? (
                                    <AccessDenied />
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </AppContext.Provider>
                </div>
            )}
        </React.Fragment>
    );
};

export default withStyles(
    (theme) => ({
        ...mobileAppStyle(theme)
    }),
    { withTheme: true }
)(withThemeContext(MobileApp));
