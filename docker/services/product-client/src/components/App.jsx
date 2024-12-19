import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Breadcrumbs, BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import appStyle from 'assets/jss/appStyle.jsx';
import breadcrumbStyle from 'assets/jss/breadcrumbStyle.jsx';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import AppNavBar from 'components/AppNavBar.jsx';
import SideBar from 'components/SideBar.jsx';
import AppDashboard from 'components/AppDashboard.jsx';
import AppScreen from 'components/AppScreen.jsx';
import AppAdmin from 'components/AppAdmin.jsx';
import ReportsList from 'layouts/ReportsList.jsx';
import ReportDetails from 'layouts/ReportDetails.jsx';
import MinervaDashboard from 'components/minerva/MinervaDashboard.jsx';
import MinervaDashboard2 from 'components/minerva/MinervaDashboard2.jsx';
import MinervaDashboardv2 from 'components/minerva2/MinervaDashboardv2.jsx';
import ObjectivesDashboard from 'components/navigator/ObjectivesDashboard.jsx';
// import Matomo from "components/Matomo.jsx";
import ObjectivesSteps from 'components/navigator/ObjectivesSteps.jsx';
import { CreateStory } from '../components/createStory/CreateStory';
import { getApp, create_slug } from 'services/app.js';
import PreviewPublishedStory from './previewPublishedStory/PreviewPublishedStory';

import AccessDenied from 'components/AccessDenied.jsx';
import PageNotFound from 'components/PageNotFound.jsx';

import { withThemeContext } from '../themes/customThemeContext';
import AppContext from '../context/appContext';

import AlertsWorkspace from './alert-dialog/AlertsWorkspace';
// import NotificationPreview from "./alert-dialog/NotificationPreview";
import AppAdminModuleUsers from 'components/Admin/Users.jsx';
import AppAdminModuleUserRoles from 'components/Admin/UserRoles.jsx';
import MinervaChatbot from 'components/minerva/MinervaChatbot.jsx';
import AppUserMessage from './AppUserMessage';
import NotificationWorkspace from './alert-dialog/NotificationWorkspace.jsx';
import { logMatomoEvent } from '../services/matomo';
import { getMatomoPvid, clearMinervaSession, setWidgetOpenIdState } from 'store/index';
import { connect } from 'react-redux';
import sanitizeHtml from 'sanitize-html-react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clsx from 'clsx';
import { Typography } from '@material-ui/core';
import { ReactComponent as CommentIcon } from '../assets/img/CommentButton.svg';
import CommentsDrawer from './Comments/CommentsDrawer.jsx';
import { withRouter } from 'react-router-dom';
import CustomSnackbar from 'components/CustomSnackbar.jsx';
import StoryPanel from './StoryPanel';
import * as _ from 'underscore';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            loading: false,
            app_id: props.match && props.match.params.app_id ? props.match.params.app_id : false,
            app_info: false,
            drawer_open: true,
            routes: false,
            appscreen_configure_link: false,
            page_not_found: false,
            stepperScreens: {},
            activeStep: 0,
            page_not_found_message: '',
            GPTinfo: {
                screen_id: undefined,
                data_items: []
            },
            DS_Bookmark: false,
            DS_Download: false,
            drawerCon: false,
            FilterValues: false,
            minervaBtnInView: false,
            minervaBtnFloat: false,
            videoOpen: false,
            videoOptions: '',
            askNucliosOpen: false,
            askNucliosFullScreen: false,
            commentsOpen: false,
            scenarioDrawerOpen: false,
            enableHighlight: false,
            selectedScenarios: [],
            commentScreenId: null,
            openId: null,
            shouldOpen: true,
            shouldOpenLibrary: false,
            commentEnabled: false,
            filter_id: null,
            filterScreenId: null,
            filterWidgetId: null,
            filterCommentId: null,
            linkType: null,
            notification: {},
            navigationDisabled: false,
            screenName: null,
            loadingOnSubscription: false,
            previous_screen_data: [],
            progress_bar_config: null,
            prev_active_Step: 0,
            widgetComment: false,
            isTabNavBar: false,
            shouldScenarioLibraryOpen: false,
            screenIdCollab: null,
            sidebarOpen: !this.state?.app_info?.modules?.top_navbar  ? true : null
        };
        this.createStoriesRef = null;
        this.handleClick = this.handleClick.bind(this);
    }

    updateRoutes(routes) {
        this.setState({ routes });

    }
    updateWidgetComment = () => {
        this.setState({
            widgetComment: !(this.state.widgetComment),
            commentsOpen: false,
            askNucliosOpen: false,
            askNucliosFullScreen: false,
        });
    }
    updateScreenTab = (state) => {
        this.setState({
            isTabNavBar : state
        })
    }
    refreshApp(app_id, goto_app) {
        this.setState({
            loading: true,
            app_info: false
        });

        getApp({
            app_id: app_id ? app_id : this.state.app_id,
            callback: this.onResponseGetApp,
            goto_app: goto_app
        });
    }
    handleClick() {
        this.setState({
            commentsOpen: true,
            askNucliosOpen: false,
            shouldOpen: false,
            widgetComment: false
        });

    }
    refreshAppSilent = async (app_id, goto_app) => {
        return await getApp({
            app_id: app_id ? app_id : this.state.app_id,
            callback: this.onResponseGetApp,
            goto_app: goto_app
        });
    };

    setGPTinfo = (screen_id, data_items) => {
        this.setState({
            GPTinfo: {
                screen_id: screen_id,
                data_items: data_items
            }
        });
    };
    commentCloseHandler = () => {
        this.setState(
            {
                commentsOpen: false,
                widgetComment: false,
                shouldOpen: false,
                filterCommentId: null,
                filterWidgetId: null,
                filterScreenId: null,
                linkType: null,
                navigationDisabled: true
            },
            () => {
                this.props.setWidgetOpenIdState({ widget_value_id: null, widget_name: null });
            }
        );
    };
    shouldOpenHandler = () => {
        this.setState({
            shouldOpen: false
        });
    };

    shouldOpenLibraryHandler = (value, comments = null, scenarioDrawer = null, filterCommentId = null) => {
        this.setState({
            shouldOpenLibrary: value,
            commentsOpen: comments !== null ? false : this.state.commentsOpen,
            scenarioDrawerOpen: scenarioDrawer !== null ? true : this.state.scenarioDrawerOpen,
            filterCommentId: filterCommentId || this.state.filterCommentId,
        });
    };

    shouldScenarioFullMode = (value) => {
        this.setState({
            sidebarOpen: value
        })
    }

    componentDidMount() {
        this.props.getMatomoPvid('app');
        this.refreshApp();
        const htmlTag = document.querySelector('html');
        htmlTag.style.scrollBehavior = 'initial';
        setInterval(() => {
            if (htmlTag.scrollTop > 0) {
                htmlTag.scrollTop = 0;
            }
        }, 50);

    }

    componentDidUpdate(prevProps, prevState) {
        var prev_app_id =
            prevProps.match && prevProps.match.params.app_id
                ? prevProps.match.params.app_id
                : false;
        var new_app_id =
            this.props.match && this.props.match.params.app_id
                ? this.props.match.params.app_id
                : false;
        if (prev_app_id !== new_app_id) {
            this.setState({
                app_id: new_app_id,
                loading: true,
                app_info: false
            });

            this.refreshApp(new_app_id);
        } else {
            if (
                this.props.matomo?.pv_id !== prevProps.matomo?.pv_id &&
                !this.props.location?.pathname?.includes('/stories/')
            ) {
                logMatomoEvent({
                    action_name: 'App',
                    url: window.location.href,
                    urlref: window.location.href,
                    pv_id: this.props.matomo.pv_id
                });
            }
            if (this.props.location.pathname !== prevProps.location.pathname) {
                this.props.getMatomoPvid('app');
                this.onResponseGetApp(this.state.app_info || {});
            }
        }
        const query = new URLSearchParams(this.props.location.search);
        const filter_id = query.get('filters');

        if (filter_id && filter_id !== prevState.filter_id) {
            this.setState({
                filter_id: filter_id,
            });
        }

        if (this.state.filterCommentId === null && prevState.filterCommentId) {
            this.setState({
                filterCommentId: prevState.filterCommentId,
                enableHighlight: true
            })
        }
    }



    onResponseGetApp = (response_data) => {
        if (response_data.status && response_data.status === 'error') {
            this.setState({
                loading: false,
                page_not_found: true,
                page_not_found_message: response_data.message
            });
        } else {
            if (response_data.restricted_app) {
                this.setState({
                    loading: false,
                    access_denied: true
                });
            } else {
                response_data.screens = _.sortBy(response_data.screens, function (screen_info) {
                    return screen_info.screen_index;
                });
                // this.props.themeContext.changeTheme(
                //     this.props.themeContext.mode,
                //     response_data.theme_id
                // );
                // TODO: remove this once dark theme is enabled on prod

                //  this.props.themeContext.changeTheme('light', null); //Remove this once dark theme is approved
                // if (
                //     import.meta.env['REACT_APP_ENV'] === 'uat' ||
                //     import.meta.env['REACT_APP_ENV'] === 'prod'
                // ) {
                //     this.props.themeContext.changeTheme('light', null); //Remove this once dark theme is approved
                // } else {
                this.props.themeContext.changeTheme(
                    this.props.themeContext.mode,
                    response_data.theme_id
                );
                // }

                localStorage.removeItem('select-all-charts');
                let goto_app = response_data.goto_app;
                delete response_data.goto_app;
                let app_info = response_data;
                let routes = this.getRoutes(app_info);
                const firstSelected = routes.find((route) => route.selected);
                this.setState({screenIdCollab : firstSelected ? firstSelected.screen_item.id : null});
                const screenWithSteps = this.getStepperScreens(app_info?.screens);
                let is_screen_configure = false;

                if (this.props.location.pathname.indexOf('app-configure') !== -1) {
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

                this.setState({
                    loading: false,
                    app_info: app_info,
                    routes: routes,
                    appscreen_configure_link: configure_link,
                    appscreen_link: screen_link,
                    is_screen_configure: is_screen_configure,
                    stepperScreens: screenWithSteps,
                    loadingOnSubscription: false
                });

                if (goto_app) {
                    this.props.history.push('/app/' + app_info.id);
                }
            }
        }
    };

    getRoutes = (app_info) => {
        var is_screen_configure = false;
        var url_slugs = [];
        if (
            this.props.location.pathname.endsWith('/app/' + this.state.app_id + '/') ||
            this.props.location.pathname.endsWith('/app/' + this.state.app_id) ||
            this.props.location.pathname.endsWith('/app-configure/' + this.state.app_id + '/') ||
            this.props.location.pathname.endsWith('/app-configure/' + this.state.app_id)
        ) {
            url_slugs = [];
        } else {
            if (this.props.location.pathname.indexOf('app-configure') !== -1) {
                is_screen_configure = true;
                url_slugs = this.props.location.pathname
                    .replace('/app-configure/' + this.state.app_id + '/', '||||')
                    .split('||||')[1]
                    .split('/');
            } else {
                url_slugs = this.props.location.pathname
                    .replace('/app/' + this.state.app_id + '/', '||||')
                    .split('||||')[1]
                    .split('/');
            }
        }
        var routes = [];
        var current_first_level = false;
        var current_second_level = false;
        // eslint-disable-next-line no-unused-vars
        var current_third_level = false;

        const screens = this.props.appScreens?.length ? this.props.appScreens : app_info.screens;

        _.each(
            screens,
            function (screen_item, i) {
                if (!screen_item.level) {
                    current_first_level = screen_item;
                    current_second_level = false;
                    current_third_level = false;

                    let original_href =
                        (is_screen_configure ? '/app-configure/' : '/app/') +
                        this.state.app_id +
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
                            this.props.inProgressScreenId === screen_item.id
                                ? true
                                : url_slugs.length >= 0 &&
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
                        this.state.app_id +
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
                        this.state.app_id +
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
    getStepperScreens = (screens) => {
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

    getBreadcrumbs = () => {
        const { classes } = this.props;

        var sidebar_links = [];

        _.each(
            this.state.routes,
            function (route_item) {
                if (route_item.screen_item.hidden) {
                    return;
                }
                if (route_item.level === 2 && route_item.show) {
                    sidebar_links.push(
                        <BreadcrumbsItem
                            key={route_item.screen_item.screen_name + '_breadcrumb'}
                            className={
                                (route_item.selected
                                    ? classes.breadcrumbTabItemContainerSelected
                                    : classes.breadcrumbTabItemContainer) +
                                ' ' +
                                classes.breadcrumbTabItem
                            }
                            to={route_item.href}
                            title={
                                route_item.screen_item?.screen_description ||
                                route_item.screen_item?.screen_name
                            }
                        >
                            {route_item.screen_item.screen_name}
                        </BreadcrumbsItem>
                    );
                }
            },
            this
        );

        return sidebar_links;
    };

    handleStoriesCount = () => {
        if (this.createStoriesRef?.current?.updateChartsCount) {
            this.createStoriesRef.current.updateChartsCount();
        }
    };

    selectAllCharts = () => {
        this.setState({});
    };

    onResponseAddORCreateStory = () => {
        this.setState((prevState) => ({
            app_info: {
                ...prevState.app_info,
                story_count: prevState.app_info['story_count'] + 1
            }
        }));
    };

    shouldRenderStoriesActionPanel = () => {
        const is_stories = this.props.location.pathname.includes(
            '/app/' + this.state.app_id + '/stories'
        );
        const is_admin = this.props.location.pathname.includes(
            '/app/' + this.state.app_id + '/admin'
        );
        const is_app_configure = this.props.location.pathname.includes(
            '/app-configure/' + this.state.app_id
        );
        const is_app_dashboard = this.props.location.pathname.endsWith(
            '/app/' + this.state.app_id + '/dashboard'
        );
        const is_minerva_dashboard_v1 = this.props.location.pathname.endsWith(
            '/app/' + this.state.app_id + '/ask-nuclios-v1'
        );
        const is_ask_nuclios_dashboard = this.props.location.pathname.endsWith(
            '/app/' + this.state.app_id + '/ask-nuclios'
        );
        const is_navigator = this.props.location.pathname.includes(
            '/app/' + this.state.app_id + '/objectives'
        );
        const is_alerts = this.props.location.pathname.includes(
            '/app/' + this.state.app_id + '/alerts'
        );
        const is_user_mgmt = this.props.location.pathname.includes(
            '/app/' + this.state.app_id + '/user-mgmt'
        );
        const is_notifications = this.props.location.pathname.includes(
            '/app/' + this.state.app_id + '/notifications'
        );

        return (
            !is_stories &&
            !is_admin &&
            !is_app_configure &&
            !is_app_dashboard &&
            !is_ask_nuclios_dashboard &&
            !is_minerva_dashboard_v1 &&
            !is_navigator &&
            !is_alerts &&
            !is_user_mgmt &&
            !is_notifications
        );
    };


    toggleComments = (tabs, comments, actions) => {
        if (tabs && comments && actions && !this.state.isTabNavBar) {
            const hasActionPresent = actions.some(
                action => action.selected && action.screen_item && action.screen_item.screen_actions_present === true
            );
            return hasActionPresent;
        }
        return false;
    };

   
    shouldRenderSideBar = () => {
        const is_minerva = this.props.location.pathname.includes(
            '/app/' + this.state.app_id + '/minerva'
        );
        const is_ask_nuclios = this.props.location.pathname.includes(
            '/app/' + this.state.app_id + '/ask-nuclios'
        );
        const is_navigator = this.props.location.pathname.includes(
            '/app/' + this.state.app_id + '/objectives'
        );

        return !is_minerva && !is_navigator && !is_ask_nuclios;
    };

    shouldRenderAskNuclios = () => {
        const is_admin = this.props.location.pathname.includes(
            '/app/' + this.state.app_id + '/admin'
        );

        if (is_admin && this.state.askNucliosOpen) {
            this.setState({
                askNucliosOpen: false,
                commentsOpen: false,
                widgetComment: false
            });
        }
        return !is_admin;
    };

    scenarioLibraryOpen = (value) => {
        this.setState({ shouldScenarioLibraryOpen: value });
    }

    openScenarioLibary = () => {
        return this.state.shouldScenarioLibraryOpen;
    }

    flexDirectionClasses = () => {
        let { classes } = this.props;
        let directionClasses = '';
        let top_navbar = this.state?.app_info?.modules?.top_navbar;
        if (this.state.askNucliosOpen) {
            directionClasses = classes.appContainerAskNuclios + ' ' + classes.appContainerSmall;
            if (!top_navbar) {
                directionClasses += ' ' + classes.appContainerRow;
            }
        }
        if (this.state?.commentsOpen) {
            directionClasses = classes.appContainerAskNuclios + ' ' + classes.appContainerCommentSmall;
            if (!top_navbar) {
                directionClasses += ' ' + classes.appContainerRow;
            }
            return directionClasses;
        }
        if (this.state.widgetComment) {
            directionClasses = classes.appContainerAskNuclios + ' ' + classes.appContainerCommentSmall;
            if (!top_navbar) {
                directionClasses += ' ' + classes.appContainerRow;
            }
            return directionClasses;
        }

        else if (this.shouldRenderAskNuclios()) {
            if (top_navbar) {
                directionClasses = this.state.askNucliosOpen ? (classes.appContainerAskNuclios + ' ' + classes.appContainerSmall) : (classes.appContainerAskNuclios)
            } else {
                if (this.state.askNucliosOpen || this.state.commentsOpen) {
                    directionClasses = classes.appContainerRow + ' ' + classes.appContainerSmall;
                }
                else {
                    directionClasses = classes.appContainerRow
                }
            }
        } else if (!this.shouldRenderAskNuclios()) {
            directionClasses = classes.appContainerRow;
        }
        return directionClasses;
    };

    onEditScreenConfig = () => {
        if (this.state.routes.length > 0) {
            let selected_screen_id = '';
            _.each(this.state.routes, function (route_item) {
                if (route_item.selected === true) {
                    selected_screen_id = route_item.screen_item.id;
                }
            });
            this.props.history.push(
                '/app/' + this.state.app_info.id + '/admin/screens/' + selected_screen_id
            );
        } else {
            this.props.history.push('/app/' + this.state.app_info.id + '/admin/screens');
        }
    };

    onExitScreenConfig = () => {
        this.props.history.push(this.props.location.pathname.replace('/app-configure/', '/app/'));
    };

    handleStepper = (action, current, step) => {
        //null check for finish step
        if (step) {
            this.props.history.push({
                pathname: this.props.location.pathname.replace(
                    '/' + create_slug(current),
                    '/' + create_slug(step)
                ),
                screenNavigationData: Array.from(
                    new Set(this.state?.previous_screen_data?.map((item) => JSON.stringify(item)))
                ).map((item) => JSON.parse(item))
            });
        }
        if (action === 'back') {
            this.setState((prevState) => ({
                ...prevState,
                activeStep: prevState.activeStep - 1
            }));
        } else {
            this.setState((prevState) => ({
                ...prevState,
                activeStep: prevState.activeStep + 1,
                prev_active_Step: prevState.activeStep + 1
            }));
        }
    };

    handleDirectStepperClick = (step, currScreen, NextScreen, back) => {
        if (step || step == 0) {
            this.props.history.push({
                pathname: this.props.location.pathname.replace(
                    '/' + create_slug(currScreen),
                    '/' + create_slug(NextScreen)
                ),
                screenNavigationData: Array.from(
                    new Set(this.state?.previous_screen_data?.map((item) => JSON.stringify(item)))
                ).map((item) => JSON.parse(item))
            });
        }
        if (!back) {
            this.setState((prevState) => ({
                ...prevState,
                prev_active_Step: step
            }));
        }
        this.setState((prevState) => ({
            ...prevState,
            activeStep: step
        }));
    };

    setActiveStep = (val) => {
        this.setState({
            activeStep: val
        });
    };
    setCommentEnabled = (commentEnabled, screenName) => {
        this.setState({
            commentEnabled,
            screenName
        });
    };
    setCommentFilters = (resp) => {
        if (resp['comment']) {
            this.setState(
                {
                    filterCommentId: resp['comment'],
                    filterWidgetId: resp['widget'],
                    filterScreenId: resp['screen'],
                    linkType: resp['linkType'],
                    commentsOpen: true,
                    askNucliosOpen: false,
                    widgetComment: false
                },
                () => {
                    this.props?.setWidgetOpenIdState({
                        widget_id: resp['widget'],
                        widget_name: resp['widget_name']
                    });
                }
            );
        }
    };

    componentWillUnmount() {
        document.title = 'NucliOS';
        this.props.themeContext.changeTheme(this.props.themeContext.mode, null);
        this.props.clearMinervaSession();
        window.Minerva?.clean();
    }

    DS_ClickHandle = (val) => {
        switch (val) {
            case 'Bookmark':
                this.setState({
                    DS_Bookmark: !this.state.DS_Bookmark,
                    DS_Download: false
                });
                break;
            case 'Download':
                this.setState({
                    DS_Bookmark: false,
                    DS_Download: !this.state.DS_Download
                });
                break;
        }
    };

    drawerCondition = (status = !this.state.drawerCon) => {
        this.setState({
            ...this.state,
            drawerCon: status
        });
    };
    setFilterValue = (value) => {
        this.setState({
            FilterValues: value
        });
    };
    videoRender = (data) => {
        this.setState({
            videoOptions: data,
            videoOpen: true
        });
    };

    videoClose = () => {
        this.setState({ videoOpen: false });
    };

    getScreenPath = () => {
        let screen_index = -1;
        for (let i = 0; i < this.state.app_info['screens'].length; i++) {
            if (
                !this.state.app_info['screens'][i]?.hidden &&
                this.state.app_info['screens'][i]?.level == null
            ) {
                return i;
            }
        }
        return screen_index;
    };

    getPath = () => {
        const screen_index = this.getScreenPath();
        return screen_index != -1 ? this.state.routes[screen_index]['href'] : '';
    };
    hideMinervaBtn = (e) => {
        e.stopPropagation();
        this.setState({
            minervaBtnInView: false
        });
    };
    showItemOnHover = (item, v) => {
        item.forEach((item) => {
            const route = this.state.routes.find((el) => el.screen_item.id === item);
            route.show = v;
        });
        this.setState({ routes: [...this.state.routes] });
    };
    handleMouseHover = () => {
        this.setState({ minervaBtnInView: true, minervaBtnFloat: false });
    };
    onSaveSubscriptionHandler = () => {
        this.refreshAppSilent(this.state.app_id);
    };

    setScreenProgressData = (data, action) => {
        this.setState((prevState) => ({
            previous_screen_data:
                action === 'finish' ? [] : [...(prevState?.previous_screen_data || []), ...data]
        }));
        if (action === 'finish') {
            const current_screen =
                this.state?.stepperScreens[this.state.GPTinfo.screen_id]?.at(-1)['screen_name'];
            const first_screen =
                this.state?.stepperScreens[this.state.GPTinfo.screen_id]?.at(0)['screen_name'];
            this.setState(
                {
                    prev_active_Step: 0
                },
                () => {
                    setTimeout(() => {
                        this.props.history.push({
                            pathname: this.props.location.pathname.replace(
                                '/' + create_slug(current_screen),
                                '/' + create_slug(first_screen)
                            )
                        });
                    }, 1500);
                }
            );
        }
    };

    setProgressBarConfDetails = (data) => {
        this.setState({
            progress_bar_config: data || null
        });
    };





    render() {
        const { classes, is_restricted_user } = this.props;
        const path = this.props?.location?.pathname?.split('/');
        const alert = this?.props?.location?.pathname?.includes('alerts');
        const stories = this?.props?.location?.pathname?.includes('stories');
        const adminScreen = this?.props?.location?.pathname?.includes('admin');
        const top_navbar = this.state?.app_info?.modules?.top_navbar;
        const widgetOpenId = this.props?.widgetOpenId;
        this.createStoriesRef = React.createRef();
        let checkCollaborator = (breadcrumbs) => {
            return (
                this.props?.screenId && !this.state?.app_info?.modules?.top_navbar &&
                this.shouldRenderStoriesActionPanel() &&
                this.state.commentEnabled
                &&
                !this.toggleComments(
                    breadcrumbs.length > 0,
                    this.state.commentEnabled,
                    this.state.routes
                )
            )
        }
        if (this.state.app_info) {
            document.title = this.state.app_info['name'];
            const breadcrumbs = this.getBreadcrumbs();
            const isIframe = window.location.href !== window.parent.location.href;

            // if (isIframe) document.getElementById('zenToggle').style.display = 'none';

            return (
                <div key="dom-container" className={classes.domContainer}>
                    {this.state.loading ? (
                        <CodxCircularLoader data-testid="loader" size={60} center />
                    ) : (
                        <AppContext.Provider value={{ app_info: this.state.app_info }}>
                            <div key="body-container" className={classes.bodyContainer}>
                                <CssBaseline />
                                {!isIframe ? (
                                    <AppNavBar
                                        app_info={this.state.app_info}
                                        appscreen_configure_link={
                                            this.state.appscreen_configure_link
                                        }
                                        appscreen_link={this.state.appscreen_link}
                                        is_screen_configure={this.state.is_screen_configure}
                                        parent={this}
                                        is_restricted_user={is_restricted_user}
                                        user_permissions={this.props.user_permissions}
                                        DS_ClickHandle={(val) => this.DS_ClickHandle(val)}
                                        drawerCon={this.state.drawerCon}
                                        GPTinfo={this.state.GPTinfo}
                                        top_navbar={top_navbar}
                                        videoOptions={this.state.videoOptions}
                                        videoOpen={this.state.videoOpen}
                                        videoRender={this.videoRender}
                                        videoClose={this.videoClose}
                                        askNucliosOpen={this.state.askNucliosOpen}
                                        togglePopup={() => {
                                            this.setState({
                                                askNucliosOpen: !this.state.askNucliosOpen,
                                                commentsOpen: false,
                                                widgetComment: false
                                            });
                                        }}
                                        shouldRenderAskNuclios={this.shouldRenderAskNuclios()}
                                        scenarioLibraryOpen={this.scenarioLibraryOpen}
                                        commentsOpen={this.state.commentsOpen}
                                        widgetComment={this.state.widgetComment}
                                    />
                                ) : null}
                                <div
                                    id="wrapper"
                                    className={`
                                        ${!top_navbar
                                            ? classes.wrapper
                                            : adminScreen
                                                ? classes.wrapper
                                                : classes.wrapperOne
                                        }
                                        ${this.state.askNucliosOpen ? classes.flexWrapper : ''}`}
                                    style={isIframe ? { height: 'calc(100% - 4rem)' } : {}}
                                >
                                    <div className={this.flexDirectionClasses()}>
                                        {!isIframe &&
                                            this.state.app_info &&
                                            this.state.app_info.modules &&
                                            this.shouldRenderSideBar() ? (
                                            <div
                                                id="sidebar"
                                                className={clsx(
                                                    this.state.drawerCon
                                                        ? classes.drawerClose
                                                        : classes.drawer,
                                                    top_navbar && !adminScreen
                                                        ? classes.topnav_container
                                                        : ''
                                                )}
                                            >
                                                <SideBar
                                                    parent={this}
                                                    is_restricted_user={is_restricted_user}
                                                    hide={
                                                        top_navbar
                                                            ? false
                                                            : this.state?.app_info?.modules
                                                                ?.fullscreen_mode
                                                    }
                                                    app_id={this.state.app_id}
                                                    app_info={this.state.app_info}
                                                    routes={this.state.routes}
                                                    user_permissions={this.props.user_permissions}
                                                    drawerCon={this.drawerCondition}
                                                    top_navbar={top_navbar}
                                                    adminScreen={adminScreen}
                                                    showItemOnHover={this.showItemOnHover}
                                                    drawerCondtion={this.state.drawerCon}
                                                    appScreens={this.props.appScreens}
                                                    history={this.props.history}
                                                    askNucliosOpen={this.state.askNucliosOpen}
                                                    commentsOpen={this.state.commentsOpen}
                                                    rawScreens={
                                                        this.props.appScreens?.length
                                                            ? this.props.appScreens
                                                            : this.state.app_info?.screens
                                                    }
                                                    widgetComment={this.state.widgetComment}
                                                    shouldScenarioFullMode={this.shouldScenarioFullMode}
                                                />
                                            </div>
                                        ) : null}

                                        <div
                                            id="bodyContent"
                                            className={`${classes.bodyContent} ${top_navbar ? classes.topnav_bodyContent : ''
                                                }`}
                                        >
                                            {top_navbar && this.props?.screenId && this.state.commentEnabled &&
                                                this.shouldRenderStoriesActionPanel() ?
                                                <div className={classes.commentAndStoriesPane}>
                                                    {this.props?.screenId &&
                                                        this.state.commentEnabled === true
                                                        ? (
                                                            <span
                                                                className={`${(this.state?.commentsOpen && !this.state.widgetComment)
                                                                    ? classes.commentsTabOnSelected
                                                                    : classes.commentsTab} `}
                                                                onClick={() => {
                                                                    this.setState({
                                                                        commentsOpen: true,
                                                                        askNucliosOpen: false,
                                                                        shouldOpen: false

                                                                    });
                                                                }}
                                                            >
                                                                <CommentIcon></CommentIcon>{' '}
                                                                Collaboration
                                                            </span>
                                                        ) : null}

                                                </div>
                                                : null}
                                            {/* <NotificationPreview place="notificationDisplay" /> */}
                                            {this.state.app_id === '26' ? (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        width: '4rem',
                                                        right: '0.5rem',
                                                        top: '6.2rem',
                                                        zIndex: '1000'
                                                    }}
                                                >
                                                    {/* <ChatGPTSummary
                                                    app_id={this.state.app_id}
                                                    screen_id={this.state.GPTinfo.screen_id}
                                                    data_items={this.state.GPTinfo.data_items}
                                                /> */}
                                                </div>
                                            ) : null}
                                            {top_navbar &&
                                                path?.length > 4 &&
                                                !adminScreen &&
                                                !alert &&
                                                !stories ? (
                                                <div className={classes.subScreenBreadCrumb}>
                                                    <span className={classes.screen}>
                                                        {path[3]}
                                                    </span>
                                                    <span className={classes.rightIcon}>
                                                        <ChevronRightIcon />
                                                    </span>
                                                    <span className={classes.subscreen}>
                                                        {path[4]}
                                                    </span>

                                                </div>
                                            ) : null}
                                            {breadcrumbs.length && !top_navbar ? (
                                                <div
                                                    className={
                                                        breadcrumbs.length > 0
                                                            ? classes.breadcrumbTabsContainer
                                                            : classes.breadcrumbTabsContainerEmpty
                                                    }
                                                    style={{ display: 'flex' }}
                                                >
                                                    <Breadcrumbs
                                                        container={'div'}
                                                        separator={''}
                                                        item={NavLink}
                                                        compare={(a, b) =>
                                                            a.to.split('//').length -
                                                            b.to.split('//').length
                                                        }
                                                        containerProps={{
                                                            style: {
                                                                display: 'flex',
                                                                alignItems: 'flex-end',
                                                                paddingTop: '0.2rem',
                                                                marginLeft: '1.6rem',
                                                                gap: '3.56rem',
                                                                borderBottom:
                                                                    breadcrumbs?.length > 0
                                                                        ? localStorage.getItem(
                                                                            'codx-products-theme'
                                                                        ) === 'dark'
                                                                            ? '1px solid #FFF0EE26'
                                                                            : '1px solid #CFB3CD'
                                                                        : 'none'
                                                            }
                                                        }}
                                                    />
                                                    {breadcrumbs}
                                                    {/* portal to render screen level action components */}
                                                    <div
                                                        key={`${this.state.commentEnabled}`}
                                                        id="screen_action-tab_nav_bar"
                                                        style={{
                                                            display: 'flex',
                                                            flex: 1,
                                                            height: '100%',
                                                            justifyContent: 'flex-end',
                                                            gap: '0.5rem',
                                                            alignItems: 'center',
                                                            marginRight: this.state.commentEnabled && (!this.state.commentsOpen && !this.state.askNucliosOpen && !this.state.widgetComment)
                                                                ? '18rem'
                                                                : '0rem'
                                                        }}
                                                    />
                                                    {/* <div
                                                id="screen_action-floater"
                                                style={{
                                                    position: 'fixed',
                                                    padding: '0.5rem',
                                                    zIndex: '100'
                                                }}
                                            /> */}
                                                    {/* {!isIframe ? (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '0.5rem',
                                                        gap: '1rem'
                                                    }}
                                                >
                                                    {this.shouldRenderStoriesActionPanel() && (
                                                        <ChatGPTSummary
                                                            app_id={this.state.app_id}
                                                            screen_id={this.state.GPTinfo.screen_id}
                                                            data_items={
                                                                this.state.GPTinfo.data_items
                                                            }
                                                        />
                                                    )}
                                                    <AppConfigWrapper
                                                        appConfig={AppConfigOptions.data_story}
                                                    >
                                                        {this.shouldRenderStoriesActionPanel() ? (
                                                            <CreateStoriesActionPanel
                                                                {...other}
                                                                ref={this.createStoriesRef}
                                                                selectAllCharts={
                                                                    this.selectAllCharts
                                                                }
                                                                onResponseAddORCreateStory={
                                                                    this.onResponseAddORCreateStory
                                                                }
                                                                app_info={this.state.app_info}
                                                                logged_in_user_info={
                                                                    this.props.logged_in_user_info
                                                                }
                                                            ></CreateStoriesActionPanel>
                                                        ) : null}
                                                    </AppConfigWrapper>
                                                    {this.props.user_permissions?.app_publish ? (
                                                        this.props.location.pathname.indexOf(
                                                            'app-configure'
                                                        ) !== -1 ? (
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                onClick={this.onExitScreenConfig}
                                                                title={'Exit Screen Config'}
                                                                endIcon={<CancelIcon />}
                                                                aria-label="Exit"
                                                            >
                                                                Exit
                                                            </Button>
                                                        ) : this.props.location.pathname.includes(
                                                            '/app/' + this.state.app_id + '/admin'
                                                        ) ||
                                                            this.props.location.pathname.includes(
                                                                '/app/' +
                                                                this.state.app_id +
                                                                '/minerva'
                                                            ) ? (
                                                            ''
                                                        ) : (
                                                            <Button
                                                                className={classes.configureButton}
                                                                variant="outlined"
                                                                size="small"
                                                                onClick={this.onEditScreenConfig}
                                                                title={'Edit Screen Config'}
                                                                startIcon={<SettingsIcon />}
                                                                aria-label="Configure"
                                                            >
                                                                Configure
                                                            </Button>
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                            ) : null} */}
                                                    {checkCollaborator(breadcrumbs)
                                                        ? (

                                                            <span
                                                                className={`${this.state?.commentsOpen && !this.state.widgetComment
                                                                    ? classes.commentsTabOnSelected
                                                                    : classes.commentsTab}`}
                                                                onClick={() => {
                                                                    this.setState({
                                                                        commentsOpen: true,
                                                                        askNucliosOpen: false,
                                                                        shouldOpen: false
                                                                    });
                                                                }}
                                                            >
                                                                <CommentIcon /> Collaboration
                                                            </span>

                                                        ) : null}
                                                </div>
                                            ) : null}
                                            {this.state.app_info?.modules?.data_story &&
                                                this.shouldRenderStoriesActionPanel() ? (
                                                <StoryPanel
                                                    {...this.props}
                                                    ref={this.createStoriesRef}
                                                    selectAllCharts={this.selectAllCharts}
                                                    onResponseAddORCreateStory={
                                                        this.onResponseAddORCreateStory
                                                    }
                                                    app_info={this.state.app_info}
                                                    logged_in_user_info={
                                                        this.props.logged_in_user_info
                                                    }
                                                    commentsOpen={this.state.commentsOpen}
                                                    askNucliosOpen={this.state.askNucliosOpen}
                                                    widgetComment={this.state.widgetComment}
                                                />
                                            ) : null}
                                            <div
                                                id="screen_action-floater"
                                                style={{
                                                    position: 'fixed',
                                                    padding: '0.5rem',
                                                    zIndex: '100'
                                                }}
                                            />
                                            {!breadcrumbs?.length && !top_navbar && this.props?.screenId && this.shouldRenderStoriesActionPanel() &&
                                                this.state.commentEnabled === true ? (
                                                <div className={classes.commentAndStoriesPane}>
                                                    {/* <AppConfigWrapper
                                                    appConfig={AppConfigOptions.data_story}
                                                >
                                                    {this.shouldRenderStoriesActionPanel() ? (
                                                        <div className={classes.selectAllItems}>
                                                            <CreateStoriesActionPanel
                                                                ref={this.createStoriesRef}
                                                                {...this.props}
                                                                selectAllCharts={
                                                                    this.selectAllCharts
                                                                }
                                                                onResponseAddORCreateStory={
                                                                    this.onResponseAddORCreateStory
                                                                }
                                                                app_info={this.state.app_info}
                                                            ></CreateStoriesActionPanel>
                                                        </div>
                                                    ) : null}
                                                </AppConfigWrapper> */}
                                                    {this.props?.screenId &&
                                                        this.shouldRenderStoriesActionPanel() && this.state.commentEnabled &&
                                                        !this.toggleComments(
                                                            breadcrumbs.length > 0,
                                                            this.state.commentEnabled,
                                                            this.state.routes
                                                        )
                                                        ? (
                                                            <span
                                                                className={`${(this.state?.commentsOpen && !this.state.widgetComment)
                                                                    ? classes.commentsTabOnSelected
                                                                    : classes.commentsTab} `}
                                                                onClick={() => {
                                                                    this.setState({
                                                                        commentsOpen: true,
                                                                        askNucliosOpen: false,
                                                                        shouldOpen: false
                                                                    });
                                                                }}
                                                            >
                                                                <CommentIcon></CommentIcon>{' '}
                                                                Collaboration
                                                            </span>

                                                        ) : null}

                                                </div>
                                            ) : null}

                                            {this.state.loading ? (
                                                <div className={classes.appMainLoader}>
                                                    <CodxCircularLoader size={60} center />
                                                </div>
                                            ) : (
                                                <Switch>
                                                    {this.state.app_info?.modules?.dashboard ? (
                                                        <Route
                                                            exact
                                                            path="/app/:app_id/dashboard"
                                                            render={(props) => (
                                                                <AppDashboard
                                                                    key={props.location.key}
                                                                    routes={this.state.routes}
                                                                    app_info={this.state.app_info}
                                                                    drawerCon={this.state.drawerCon}
                                                                    history={this.props.history}
                                                                    {...props}
                                                                />
                                                            )}
                                                        />
                                                    ) : (
                                                        ''
                                                    )}

                                                    {this.state.app_info?.modules?.data_story ? (
                                                        <Route
                                                            exact
                                                            path="/app/:app_id/stories/list"
                                                            render={(props) => (
                                                                <ReportsList
                                                                    key={props.location.key}
                                                                    app_info={this.state.app_info}
                                                                    logged_in_user_info={
                                                                        this.props
                                                                            .logged_in_user_info
                                                                    }
                                                                    {...props}
                                                                />
                                                            )}
                                                        />
                                                    ) : null}
                                                    {this.state.app_info?.modules?.data_story ? (
                                                        <Route
                                                            exact
                                                            path="/app/:app_id/stories/:story_id/details"
                                                            render={(props) => (
                                                                <ReportDetails
                                                                    key={props.location.key}
                                                                    {...props}
                                                                    app_info={this.state.app_info}
                                                                />
                                                            )}
                                                        />
                                                    ) : null}
                                                    {this.state.app_info?.modules?.data_story ? (
                                                        <Route
                                                            exact
                                                            path="/app/:app_id/stories/:story_id/edit"
                                                            render={(props) => (
                                                                <CreateStory
                                                                    key={props.location.key}
                                                                    {...props}
                                                                    app_info={this.state.app_info}
                                                                    logged_in_user_info={
                                                                        this.props
                                                                            .logged_in_user_info
                                                                    }
                                                                />
                                                            )}
                                                        />
                                                    ) : null}
                                                    {this.state.app_info?.modules?.data_story ? (
                                                        <Route
                                                            exact
                                                            path="/app/:app_id/stories/:story_id/published-preview"
                                                            render={(props) => (
                                                                <PreviewPublishedStory
                                                                    key={props.location.key}
                                                                    {...props}
                                                                    app_info={this.state.app_info}
                                                                />
                                                            )}
                                                        />
                                                    ) : null}

                                                    {this.state.app_info['modules']['alerts'] ? (
                                                        <Route
                                                            exact
                                                            path="/app/:app_id/alerts/list"
                                                            render={(props) => (
                                                                <AlertsWorkspace
                                                                    key={props.location.key}
                                                                    app_info={this.state.app_info}
                                                                    routes={this.state.routes}
                                                                    {...props}
                                                                    width={'lg'}
                                                                />
                                                            )}
                                                        />
                                                    ) : (
                                                        ''
                                                    )}

                                                    <Route
                                                        exact
                                                        path="/app/:app_id/notifications/list"
                                                        component={(props) => (
                                                            <NotificationWorkspace
                                                                refreshAppSilent={
                                                                    this.onSaveSubscriptionHandler
                                                                }
                                                                loadingOnSubscription={
                                                                    this.state.loadingOnSubscription
                                                                }
                                                                handleLoading={() =>
                                                                    this.setState({
                                                                        loadingOnSubscription: true
                                                                    })
                                                                }
                                                                app_info={this.state.app_info}
                                                                routes={this.state.routes}
                                                                {...props}
                                                                width={'lg'}
                                                            />
                                                        )}
                                                    />
                                                    {this.state.app_info.modules.user_mgmt ? (
                                                        <Route
                                                            path="/app/:app_id/user-mgmt/user-roles"
                                                            render={(props) => (
                                                                <AppAdminModuleUserRoles
                                                                    key={props.location.key}
                                                                    app_info={this.state.app_info}
                                                                    config={
                                                                        this.state.admin_details
                                                                    }
                                                                    {...props}
                                                                />
                                                            )}
                                                        />
                                                    ) : null}
                                                    {this.state.app_info.modules.user_mgmt ? (
                                                        <Route
                                                            path="/app/:app_id/user-mgmt/users"
                                                            render={(props) => (
                                                                <AppAdminModuleUsers
                                                                    key={props.location.key}
                                                                    app_info={this.state.app_info}
                                                                    config={
                                                                        this.state.admin_details
                                                                    }
                                                                    {...props}
                                                                />
                                                            )}
                                                        />
                                                    ) : null}

                                                    {this.props?.user_permissions?.app_publish ? (
                                                        <Route
                                                            path="/app/:app_id/admin"
                                                            render={(props) => (
                                                                <AppAdmin
                                                                    app_info={this.state.app_info}
                                                                    {...props}
                                                                    user_permissions={
                                                                        this.props?.user_permissions
                                                                    }
                                                                    parent_obj={this}
                                                                    logged_in_user_info={
                                                                        this.props
                                                                            .logged_in_user_info
                                                                    }
                                                                    setGPTinfo={this.setGPTinfo}
                                                                />
                                                            )}
                                                        />
                                                    ) : null}
                                                    <Redirect
                                                        exact
                                                        from={`/app/${this.state.app_info.id}/minerva`}
                                                        to={`/app/${this.state.app_info.id}/ask-nuclios`}
                                                    />
                                                    <Redirect
                                                        exact
                                                        from={`/app/${this.state.app_info.id}/minerva_v1`}
                                                        to={`/app/${this.state.app_info.id}/ask-nuclios-v1`}
                                                    />
                                                    <Redirect
                                                        exact
                                                        from={`/app/${this.state.app_info.id}/minerva-v2`}
                                                        to={`/app/${this.state.app_info.id}/ask-nuclios-v2`}
                                                    />
                                                    <Route
                                                        exact
                                                        path="/app/:app_id/ask-nuclios"
                                                        render={(props) => (
                                                            <MinervaDashboard2
                                                                key={props.location.key}
                                                                app_info={this.state.app_info}
                                                                handleStoriesCount={
                                                                    this.handleStoriesCount
                                                                }
                                                                {...props}
                                                            />
                                                        )}
                                                    />
                                                    <Route
                                                        exact
                                                        path="/app/:app_id/ask-nuclios-v2"
                                                        render={(props) => (
                                                            <MinervaDashboardv2
                                                                key={props.location.key}
                                                                app_info={this.state.app_info}
                                                                handleStoriesCount={
                                                                    this.handleStoriesCount
                                                                }
                                                                {...props}
                                                            />
                                                        )}
                                                    />
                                                    <Route
                                                        exact
                                                        path="/app/:app_id/ask-nuclios-v1"
                                                        render={(props) => (
                                                            <MinervaDashboard
                                                                key={props.location.key}
                                                                app_info={this.state.app_info}
                                                                handleStoriesCount={
                                                                    this.handleStoriesCount
                                                                }
                                                                {...props}
                                                            />
                                                        )}
                                                    />
                                                    <Route
                                                        exact
                                                        path="/app/:app_id/objectives"
                                                        render={(props) => (
                                                            <ObjectivesDashboard
                                                                key={props.location.key}
                                                                {...props}
                                                                app_info={this.state.app_info}
                                                                logged_in_user_info={
                                                                    this.props.logged_in_user_info
                                                                }
                                                                setGPTinfo={this.setGPTinfo}
                                                            />
                                                        )}
                                                    />
                                                    {/* <Route
                                                                exact
                                                                path="/app/:app_id/analytics"
                                                                component={(props) => (
                                                                <Matomo {...props} app_info={this.state.app_info} />
                                                                )}
                                                            /> */}

                                                    <Route
                                                        exact
                                                        path="/app/:app_id/objectives/:objective_id/steps"
                                                        render={(props) => (
                                                            <ObjectivesSteps
                                                                key={props.location.key}
                                                                {...props}
                                                                app_info={this.state.app_info}
                                                                logged_in_user_info={
                                                                    this.props.logged_in_user_info
                                                                }
                                                                setGPTinfo={this.setGPTinfo}
                                                            />
                                                        )}
                                                    />
                                                    <Route
                                                        exact
                                                        path="/app/:app_id/:first_level_slug"
                                                        render={(props) => (
                                                            <AppScreen
                                                                key={props.location.key}
                                                                routes={this.state.routes}
                                                                app_info={this.state.app_info}
                                                                breadcrumbs_empty={true}
                                                                breadcrumb={breadcrumbs.length}
                                                                setFilterValue={this.setFilterValue}
                                                                handleStoriesCount={
                                                                    this.handleStoriesCount
                                                                }
                                                                logged_in_user_info={
                                                                    this.props.logged_in_user_info
                                                                }
                                                                stepperScreens={
                                                                    this.state.stepperScreens
                                                                }
                                                                activeStep={this.state.activeStep}
                                                                previousActiveStep={
                                                                    this.state.prev_active_Step
                                                                }
                                                                handleStepper={this.handleStepper}
                                                                handleDirectStepperClick={
                                                                    this.handleDirectStepperClick
                                                                }
                                                                setActiveStep={this.setActiveStep}
                                                                setCommentEnabled={
                                                                    this.setCommentEnabled
                                                                }
                                                                filter_id={this.state.filter_id}
                                                                setCommentFilters={
                                                                    this.setCommentFilters
                                                                }
                                                                navigationDisabled={
                                                                    this.state.navigationDisabled
                                                                }
                                                                setGPTinfo={this.setGPTinfo}
                                                                DS_Bookmark={this.state.DS_Bookmark}
                                                                DS_Download={this.state.DS_Download}
                                                                DS_ClickHandle={(val) =>
                                                                    this.DS_ClickHandle(val)
                                                                }
                                                                top_navbar={top_navbar}
                                                                videoOptions={
                                                                    this.state.videoOptions
                                                                }
                                                                videoOpen={this.state.videoOpen}
                                                                videoRender={this.videoRender}
                                                                videoClose={this.videoClose}
                                                                setScreenProgressData={(
                                                                    data,
                                                                    action
                                                                ) =>
                                                                    this.setScreenProgressData(
                                                                        data,
                                                                        action
                                                                    )
                                                                }
                                                                setProgressBarConfDetails={(data) =>
                                                                    this.setProgressBarConfDetails(
                                                                        data
                                                                    )
                                                                }
                                                                progress_bar_config={
                                                                    this.state.progress_bar_config
                                                                }
                                                                refreshApp={(app_id) =>
                                                                    this.refreshApp(app_id)
                                                                }
                                                                history={this.props.history}
                                                                askNucliosOpen={
                                                                    this.state.askNucliosOpen
                                                                }
                                                                commentsOpen={
                                                                    this.state.commentsOpen
                                                                }
                                                                handleClick={this.handleClick}
                                                                commentEnabled={this.state.commentEnabled}
                                                                widgetComment={this.state.widgetComment}
                                                                updateWidgetComment={this.updateWidgetComment}
                                                                screenIdCollab={this.state.screenIdCollab}
                                                                filterCommentId={this.state.filterCommentId}
                                                                onClose={this.commentCloseHandler}
                                                                shouldOpenLibrary={this.state.shouldOpenLibrary}
                                                                shouldOpenLibraryHandler={this.shouldOpenLibraryHandler}
                                                                enableHighlight={this.state.enableHighlight}
                                                                scenarioDrawerOpen={this.state.scenarioDrawerOpen}
                                                                shouldOpenHandler={this.shouldOpenHandler}
                                                                sidebarOpen={this.state.sidebarOpen}
                                                                updateScreenTab={this.updateScreenTab}
                                                                isTabNavBar={this.state.isTabNavBar}
                                                      
                                                                {...props}
                                                            />
                                                        )}
                                                    />
                                                    <Route
                                                        exact
                                                        path="/app/:app_id/:first_level_slug/:second_level_slug"
                                                        render={(props) => (
                                                            <AppScreen
                                                                key={props.location.key}
                                                                routes={this.state.routes}
                                                                app_info={this.state.app_info}
                                                                breadcrumb={breadcrumbs.length}
                                                                setFilterValue={this.setFilterValue}
                                                                handleStoriesCount={
                                                                    this.handleStoriesCount
                                                                }
                                                                logged_in_user_info={
                                                                    this.props.logged_in_user_info
                                                                }
                                                                stepperScreens={
                                                                    this.state.stepperScreens
                                                                }
                                                                activeStep={this.state.activeStep}
                                                                previousActiveStep={
                                                                    this.state.prev_active_Step
                                                                }
                                                                handleStepper={this.handleStepper}
                                                                handleDirectStepperClick={
                                                                    this.handleDirectStepperClick
                                                                }
                                                                setActiveStep={this.setActiveStep}
                                                                setCommentEnabled={
                                                                    this.setCommentEnabled
                                                                }
                                                                filter_id={this.state.filter_id}
                                                                setCommentFilters={
                                                                    this.setCommentFilters
                                                                }
                                                                navigationDisabled={
                                                                    this.state.navigationDisabled
                                                                }
                                                                setGPTinfo={this.setGPTinfo}
                                                                DS_Bookmark={this.state.DS_Bookmark}
                                                                DS_Download={this.state.DS_Download}
                                                                DS_ClickHandle={(val) =>
                                                                    this.DS_ClickHandle(val)
                                                                }
                                                                top_navbar={top_navbar}
                                                                videoOptions={
                                                                    this.state.videoOptions
                                                                }
                                                                videoOpen={this.state.videoOpen}
                                                                videoRender={this.videoRender}
                                                                videoClose={this.videoClose}
                                                                setScreenProgressData={(
                                                                    data,
                                                                    action
                                                                ) =>
                                                                    this.setScreenProgressData(
                                                                        data,
                                                                        action
                                                                    )
                                                                }
                                                                setProgressBarConfDetails={(data) =>
                                                                    this.setProgressBarConfDetails(
                                                                        data
                                                                    )
                                                                }
                                                                progress_bar_config={
                                                                    this.state.progress_bar_config
                                                                }
                                                                askNucliosOpen={
                                                                    this.state.askNucliosOpen
                                                                }
                                                                commentsOpen={
                                                                    this.state.commentsOpen
                                                                }
                                                                handleClick={this.handleClick}
                                                                commentEnabled={this.state.commentEnabled}
                                                                appId={this.state?.app_id}
                                                                screenId={this.props?.screenId}
                                                                widget_id={widgetOpenId}
                                                                onClose={this.commentCloseHandler}
                                                                shouldOpen={this.state.shouldOpen}
                                                                shouldOpenHandler={
                                                                    this.shouldOpenHandler
                                                                }
                                                                shouldOpenLibrary={this.state.shouldOpenLibrary}
                                                                shouldOpenLibraryHandler={this.shouldOpenLibraryHandler}
                                                                enableHighlight={this.state.enableHighlight}
                                                                filterWidgetId={
                                                                    this.state.filterWidgetId
                                                                }
                                                                filterCommentId={
                                                                    this.state.filterCommentId
                                                                }
                                                                filterScreenId={
                                                                    this.state.filterScreenId
                                                                }
                                                                linkType={this.state.linkType}
                                                                screenName={this.state.screenName}
                                                                widgetComment={this.state.widgetComment}
                                                                updateWidgetComment={this.updateWidgetComment}
                                                                updateScreenTab={this.updateScreenTab}
                                                                isTabNavBar={this.state.isTabNavBar}
                                                                {...props}
                                                                scenarioLibraryOpen={this.state.shouldOpenLibrary}
                                                                scenarioDrawerOpen={this.state.scenarioDrawerOpen}
                                                                shouldScenarioLibraryOpen={this.state.shouldScenarioLibraryOpen}
                                                                openScenarioLibary={this.openScenarioLibary()}
                                                                screenIdCollab={this.state.screenIdCollab}
                                                                sidebarOpen={this.state.sidebarOpen}
                                                            />
                                                        )}
                                                    />
                                                    <Route
                                                        exact
                                                        path="/app/:app_id/:first_level_slug/:second_level_slug/:third_level_slug"
                                                        render={(props) => (
                                                            <AppScreen
                                                                key={props.location.key}
                                                                routes={this.state.routes}
                                                                app_info={this.state.app_info}
                                                                breadcrumb={breadcrumbs.length}
                                                                setFilterValue={this.setFilterValue}
                                                                handleStoriesCount={
                                                                    this.handleStoriesCount
                                                                }
                                                                logged_in_user_info={
                                                                    this.props.logged_in_user_info
                                                                }
                                                                stepperScreens={
                                                                    this.state.stepperScreens
                                                                }
                                                                activeStep={this.state.activeStep}
                                                                previousActiveStep={
                                                                    this.state.prev_active_Step
                                                                }
                                                                handleStepper={this.handleStepper}
                                                                handleDirectStepperClick={
                                                                    this.handleDirectStepperClick
                                                                }
                                                                setActiveStep={this.setActiveStep}
                                                                setCommentEnabled={
                                                                    this.setCommentEnabled
                                                                }
                                                                filter_id={this.state.filter_id}
                                                                setCommentFilters={
                                                                    this.setCommentFilters
                                                                }
                                                                navigationDisabled={
                                                                    this.state.navigationDisabled
                                                                }
                                                                setGPTinfo={this.setGPTinfo}
                                                                DS_Bookmark={this.state.DS_Bookmark}
                                                                DS_Download={this.state.DS_Download}
                                                                DS_ClickHandle={(val) =>
                                                                    this.DS_ClickHandle(val)
                                                                }
                                                                top_navbar={top_navbar}
                                                                videoOptions={
                                                                    this.state.videoOptions
                                                                }
                                                                videoOpen={this.state.videoOpen}
                                                                videoRender={this.videoRender}
                                                                videoClose={this.videoClose}
                                                                setScreenProgressData={(
                                                                    data,
                                                                    action
                                                                ) =>
                                                                    this.setScreenProgressData(
                                                                        data,
                                                                        action
                                                                    )
                                                                }
                                                                setProgressBarConfDetails={(data) =>
                                                                    this.setProgressBarConfDetails(
                                                                        data
                                                                    )
                                                                }
                                                                progress_bar_config={
                                                                    this.state.progress_bar_config
                                                                }
                                                                askNucliosOpen={
                                                                    this.state.askNucliosOpen
                                                                }
                                                                commentsOpen={
                                                                    this.state.commentsOpen
                                                                }
                                                                handleClick={this.handleClick}
                                                                commentEnabled={this.state.commentEnabled}
                                                                widgetComment={this.state.widgetComment}
                                                                updateWidgetComment={this.updateWidgetComment}
                                                                filterCommentId={
                                                                    this.state.filterCommentId
                                                                }
                                                                screenIdCollab={this.state.screenIdCollab}
                                                                onClose={this.commentCloseHandler}
                                                                shouldOpenLibrary={this.state.shouldOpenLibrary}
                                                                shouldOpenLibraryHandler={this.shouldOpenLibraryHandler}
                                                                enableHighlight={this.state.enableHighlight}
                                                                scenarioDrawerOpen={this.state.scenarioDrawerOpen}
                                                                shouldOpenHandler={this.shouldOpenHandler}
                                                                sidebarOpen={this.state.sidebarOpen}
                                                                updateScreenTab={this.updateScreenTab}
                                                                isTabNavBar={this.state.isTabNavBar}
                                                                {...props}
                                                            />
                                                        )}
                                                    />

                                                    {this.state.app_info?.modules?.dashboard ? (
                                                        <Redirect
                                                            to={
                                                                '/app/' +
                                                                this.state.app_info['id'] +
                                                                '/dashboard'
                                                            }
                                                        />
                                                    ) : this.state.app_info['screens'] &&
                                                        this.state.app_info['screens'].length > 0 &&
                                                        this.state.routes &&
                                                        this.state.routes.length > 0 ? (
                                                        <Redirect to={this.getPath()} />
                                                    ) : (
                                                        ''
                                                    )}

                                                    <Route
                                                        exact
                                                        path="/app/:app_id"
                                                        component={(props) => (
                                                            <AppUserMessage
                                                                key={props.location.key}
                                                                routes={this.state.routes}
                                                                app_info={this.state.app_info}
                                                                {...props}
                                                            />
                                                        )}
                                                    />
                                                </Switch>
                                            )}
                                            {top_navbar &&
                                                !adminScreen &&
                                                ((this.state.app_info?.modules?.minerva?.enabled &&
                                                    this.state.app_info?.modules?.minerva?.tenant_id) ||
                                                    (this.state.app_info?.modules?.copilot?.enabled &&
                                                        this.state.app_info?.modules?.copilot
                                                            ?.app_id)) ? (
                                                <></>
                                            ) : // <div
                                                //     className={`${
                                                //         !this.state.minervaBtnInView
                                                //             ? classes.topnav_minerva
                                                //             : classes.topnav_minerva_inView
                                                //     }
                                                //          ${
                                                //              this.state.minervaBtnFloat
                                                //                  ? classes.topnav_minervaFloat
                                                //                  : ''
                                                //          }
                                                //         `}
                                                //     onMouseEnter={this.handleMouseHover}
                                                // >
                                                //     {this.state.minervaBtnInView &&
                                                //     !this.state.minervaBtnFloat ? (
                                                //         <div
                                                //             className={classes.removeIcon}
                                                //             onClick={this.hideMinervaBtn}
                                                //                data-testid="remove"
                                                //         >
                                                //             <RemoveIcon />
                                                //         </div>
                                                //     ) : null}
                                                //     {!this.state.minervaBtnInView ? (
                                                //         <MinervaIcon className={classes.icon} data-testid="minerva-button" />
                                                //     ) : null}
                                                //     <MinervaChatbot
                                                //         app_info={this.state.app_info}
                                                //         top_navbar={top_navbar}
                                                //         minervaBtnInView={
                                                //             this.state.minervaBtnInView
                                                //         }
                                                //         minervaBtnFloat={this.state.minervaBtnFloat}
                                                //         closePopup={() =>
                                                //             this.setState({ minervaBtnFloat: true })
                                                //         }
                                                //     />
                                                // </div>
                                                null}
                                            {top_navbar &&
                                                !adminScreen &&
                                                !path.includes('dashboard') ? (
                                                <div className={classes.footer}>
                                                    <div className={classes.footer_first}>
                                                        <div className={classes.footer_logo}>
                                                            <div className={classes.maskIcon}></div>
                                                        </div>
                                                        {(!this.state.hideSideBar ||
                                                            this.state.hoverSideBar) && (
                                                                <Typography
                                                                    className={classes.footer_text}
                                                                >
                                                                    MathCo
                                                                </Typography>
                                                            )}
                                                        <Typography
                                                            className={classes.footer_version}
                                                        >
                                                            {import.meta.env['REACT_APP_VERSION']}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                    {this.shouldRenderAskNuclios() && (
                                        <div
                                            className={`${this.state.askNucliosOpen &&
                                                classes.askNucliosContainer
                                                }
                                             ${this.state.askNucliosFullScreen &&
                                                classes.askNucliosFullScreen
                                                }`}
                                        >
                                            {((this.state.app_info?.modules?.minerva?.enabled &&
                                                this.state.app_info?.modules?.minerva?.tenant_id) ||
                                                (this.state.app_info?.modules?.copilot?.enabled &&
                                                    this.state.app_info?.modules?.copilot
                                                        ?.app_id)) && (
                                                    <MinervaChatbot
                                                        app_info={this.state.app_info}
                                                        top_navbar={top_navbar}
                                                        fullHeight
                                                        // minervaBtnInView={this.state.minervaBtnInView}
                                                        // minervaBtnFloat={this.state.minervaBtnFloat}
                                                        closePopup={() =>
                                                            this.setState({
                                                                askNucliosOpen: false,
                                                                askNucliosFullScreen: false,
                                                                commentsOpen: false,
                                                                widgetComment: false,

                                                            })
                                                        }
                                                        openPopup={() =>
                                                            this.setState({ askNucliosOpen: true, commentsOpen: false, widgetComment: false, })
                                                        }
                                                        toggleFullScreen={() => {
                                                            this.setState({
                                                                askNucliosFullScreen:
                                                                    !this.state.askNucliosFullScreen
                                                            });
                                                        }}
                                                    />
                                                )}
                                        </div>
                                    )}
                                    {(((this.state.commentsOpen) &&
                                        (this.props?.screenId || this.state.screenIdCollab)) ||
                                        (this.props?.screenId && Boolean(widgetOpenId))) &&
                                        this.shouldRenderStoriesActionPanel() ? (
                                        <CommentsDrawer
                                            appId={this.state?.app_id}
                                            screenId={this.props?.screenId ? this.props.screenId : this.state.screenIdCollab}
                                            widget_id={widgetOpenId}
                                            onClose={this.commentCloseHandler}
                                            shouldOpen={this.state.shouldOpen}
                                            shouldOpenHandler={this.shouldOpenHandler}
                                            filterWidgetId={this.state.filterWidgetId}
                                            filterCommentId={this.state.filterCommentId}
                                            filterScreenId={this.state.filterScreenId}
                                            linkType={this.state.linkType}
                                            screenName={this.state.screenName}
                                            app_info={this.state.app_info}
                                            widgetComment={this.state.widgetComment}
                                            updateWidgetComment={this.updateWidgetComment}
                                            askNucliosOpen={this.state.askNucliosOpen}
                                            shouldOpenLibrary={this.state.shouldOpenLibrary}
                                            shouldOpenLibraryHandler={this.shouldOpenLibraryHandler}
                                        />
                                    ) : null}
                                </div>

                                <CustomSnackbar
                                    open={this.state.notification?.message}
                                    autoHideDuration={2000}
                                    onClose={() => this.setState({ notification: {} })}
                                    severity={this.state.notification?.severity}
                                    message={this.state.notification?.message}
                                />
                            </div>
                            {/* <Footer key="footer" /> */}
                        </AppContext.Provider>
                    )}
                </div>
            );
        } else {
            return (
                <div key="dom-container" className={classes.domContainer}>
                    {this.state.loading ? <CodxCircularLoader size={60} center /> : ''}
                    {this.state.page_not_found ? (
                        <PageNotFound message={this.state.page_not_found_message} />
                    ) : this.state.access_denied ? (
                        <AccessDenied />
                    ) : (
                        ''
                    )}
                </div>
            );
        }
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        matomo: state.matomo,
        appScreens: state.appScreen.appScreens,
        inProgressScreenId: state.appScreen.inProgressScreenId,
        activeScreenId: state.appScreen.activeScreenId,
        screenId: state.createStories.screenId,
        widgetOpenId: state.createStories.widgetOpenId
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getMatomoPvid: (pageType) => dispatch(getMatomoPvid(pageType)),
        clearMinervaSession: () => dispatch(clearMinervaSession()),
        setWidgetOpenIdState: (widgetCred) => dispatch(setWidgetOpenIdState(widgetCred))
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
    withStyles(
        (theme) => ({
            ...appStyle(theme),
            ...breadcrumbStyle(theme),
            configureButton: {
                margin: '0rem 1rem'
            }
        }),
        { withTheme: true }
    )(withThemeContext(withRouter(App)))
);
