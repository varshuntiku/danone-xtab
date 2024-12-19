import React from 'react';
import PropTypes from 'prop-types';
import {
    withStyles,
    AppBar,
    IconButton,
    Toolbar,
    Typography,
    Button,
    Tooltip,
    Popover,
    ListItem,
    ListItemIcon,
    ListItemText,
    ClickAwayListener
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { withRouter } from 'react-router-dom';
import appNavBarStyle from 'assets/jss/appNavBarStyle.jsx';
import breadcrumbStyle from 'assets/jss/breadcrumbStyle.jsx';
import AppConfigWrapper, { AppConfigOptions } from '../hoc/appConfigWrapper';
import ThemeToggle from '../themes/ThemeToggle';
import { Link } from 'react-router-dom';
import NotificationPreview from './alert-dialog/NotificationPreview.jsx';
import { logoutUser } from '../util';
import { AuthContext } from 'auth/AuthContext';
import { connect } from 'react-redux';
import { resetAuthentication, setWidgetData } from 'store/index';
import MenuBar from './misc/MenuBar';
import Nuclios from './Nuclios/assets/Nuclios';
import HelpIcon from './Nuclios/assets/HelpIcon';
import ChatGPTSummary from 'components/ChatGPTSummary';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import MenuBookRoundedIcon from '@material-ui/icons/MenuBookRounded';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import BuildIcon from '@material-ui/icons/Build';
import { ReactComponent as UserGuideIcon } from 'assets/img/userguideIcon.svg';
import { ReactComponent as AlertButtonIcon } from 'assets/img/alert-btn.svg';
import UserGuide from './UserGuide.jsx';
import clsx from 'clsx';
import DraggableWidgets from 'components/DraggableWidgets.jsx';
import AskNucliosButton from 'components/minerva/AskNucliosButton';
import CustomSnackbar from './CustomSnackbar';

import Stories from './Nuclios/assets/Stories';

const NavBarIconButton = withStyles((theme) => ({
    colorPrimary: {
        color: theme.palette.primary.contrastText
    }
}))(IconButton);

//initializing the flag outside the comp for proper mounting updates
let listenersAdded = false;
class AppNavBar extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.props = props;
        this.popoverAnchor = React.createRef();
        this.moreMenuItems = React.createRef();
        this.rearrangeWidgets = React.createRef();
        this.state = {
            opened: false,
            anchorEl: null,
            openPopover: false,
            menuPopover: false,
            UserGuide: false,
            renderTheme: false,
            showRearrangeWidgetsToolbox: false,
            showNotification: false
        };
        this.handleBodyClick = this.handleBodyClick.bind(this);
    }
  
    componentDidMount() {
        if (!listenersAdded) {
            listenersAdded = true;
            document.body.addEventListener('click', this.handleBodyClick);
            try {
                window.zE('webWidget', 'hide');
                window.zE('webWidget:on', 'open', () => {
                    this.setState({ opened: true });
                });
                window.zE('webWidget:on', 'close', () => {
                    // window.zE('webWidget', 'hide');
                    this.setState({ opened: false });
                    const state = window.zE('webWidget:get', 'display');
                    if (state == 'launcher') {
                        window.zE('webWidget', 'reset');
                        window.zE('webWidget', 'hide');
                    } else {
                        window.zE('webWidget', 'hide');
                    }
                });
            } catch (err) {
                console.error('Error while adding helpdesk service', err);
            }
        }
    }
    componentWillUnmount() {
        //we are closing the helpdesk widget if the navbar is unmounted...
        if (typeof window.zE === 'function') {
            try {
                window.zE('webWidget', 'close');
            } catch (err) {
                console.error('Error toggling the web widget:', err);
            }
            // We can remove the zendesk listeners here, if the API supports it in the future.
        }
        //we are removing the click listener
        document.body.removeEventListener('click', this.handleBodyClick);
        listenersAdded = false;
    }

    handleBodyClick(event) {
        let launcherIframe = document.getElementById('webWidget');
        let helpButton = document.querySelector('.helpButton');

        if (event.target === launcherIframe || launcherIframe?.contains(event.target)) {
            //we don't want anything to happen if the click was made inside the launcher or widget, we just stop the event propogation
            event.stopPropagation();
            return;
        }
        if (this.state.opened && helpButton && !helpButton.contains(event.target)) {
            //this is when  the click truly occurs outside i.e outside both, the help button and the zendesk widget
            //we will now close the widget
            window.zE('webWidget', 'close');
            event.stopPropagation();
        }
    }

    handleHelpIconClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ menuPopover: false }, () => {
            if (window.zE) {
                window.zE('webWidget', 'show');
                setTimeout(() => {
                    window.zE('webWidget', 'toggle');
                }, 1000);
            } else {
                console.warn('Zendesk widget is not initialized yet.');
            }
        });
        //as we are hiding the original launcher inside  pageInit file.. we must show it before toggling to open
        // window.zE('webWidget', 'show');
        // window.zE('webWidget', 'toggle');
    };

    shouldRenderLogo = () => {
        const is_minerva = this.props.location.pathname.includes(
            '/app/' + this.props.app_info.id + '/minerva'
        );
        const is_ask_nuclios = this.props.location.pathname.includes(
            '/app/' + this.props.app_info.id + '/ask-nuclios'
        );
        const is_navigator = this.props.location.pathname.includes(
            '/app/' + this.props.app_info.id + '/objectives'
        );

        return is_minerva || is_navigator || is_ask_nuclios;
    };

    logout = async () => {
        const logoutResponse = await logoutUser(this.context, this.props.history);
        if (logoutResponse?.status == 'success') {
            if (this.props.app_info.id) {
                sessionStorage.setItem('last_app_id', this.props.app_info.id);
            }
            this.props.resetAuth(false);
            this.context.setUser(null);
            this.props.history.push('/');
        }
    };

    renderAdvancedFeatureLinks = () => {
        const { classes, parent } = this.props;
        const app_id = this.props?.app_info?.id;
        const { app_info } = this.props;
        const is_stories = parent?.props?.location.pathname.includes('/app/' + app_id + '/stories');

        const is_alerts = parent?.props?.location.pathname.includes('/app/' + app_id + '/alerts');

        var advanced_feature_links = [];

        if (app_info.modules.data_story && this.props.app_info.story_count) {
            advanced_feature_links.push(
                <AppConfigWrapper key={'stories'} appConfig={AppConfigOptions.data_story}>
                    <ListItem
                        className={is_stories ? classes.selectedNavLink : classes.navLink}
                        button
                        component={Link}
                        to={'/app/' + app_id + '/stories/list'}
                    >
                        <ListItemIcon className={classes.advancedIconRoot}>
                            <Stories
                                color={this.props.theme.palette.text.default}
                                width="2.1rem"
                                height="2.1rem"
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography
                                    variant="h5"
                                    className={
                                        is_stories
                                            ? classes.sidebarLinkTextSelected
                                            : classes.sidebarLinkText
                                    }
                                >
                                    {'Stories'}
                                </Typography>
                            }
                        />
                    </ListItem>
                </AppConfigWrapper>
            );
        }

        if (this.props.app_info.modules?.alerts) {
            advanced_feature_links.push(
                <ListItem
                    key="alert"
                    className={is_stories ? classes.selectedNavLink : classes.navLink}
                    component={Link}
                    to={'/app/' + app_id + '/alerts/list'}
                >
                    <ListItemIcon className={classes.advancedIconRoot}>
                        <AlertButtonIcon className={classes.alertIcon} />
                    </ListItemIcon>
                    {!this.state.hideSideBar && (
                        <ListItemText
                            primary={
                                <Typography
                                    variant="h5"
                                    className={
                                        is_alerts
                                            ? classes.sidebarLinkTextSelected
                                            : classes.sidebarLinkText
                                    }
                                >
                                    {'Alerts'}
                                </Typography>
                            }
                        />
                    )}
                </ListItem>
            );
        }
        return advanced_feature_links;
    };
    showAdvanceFeat = (e) => {
        this.setState({
            openPopover: true,
            anchorEl: e.currentTarget
        });
    };
    closeAdvanceFeat = () => {
        this.setState({
            openPopover: false
        });
    };
    showMoreMenuItems = () => {
        this.setState({
            menuPopover: true
        });
    };
    closeMoreMenuItems = () => {
        this.setState({
            menuPopover: false,
            UserGuide: false
        });
    };
    showRearrangeWidgetsHandler = () => {
        this.setState((prevState) => ({
            showRearrangeWidgetsToolbox: !prevState.showRearrangeWidgetsToolbox
        }));
    };
    closeRearrangeWidgets = () => {
        this.setState({ showRearrangeWidgetsToolbox: false });
    };
    updateNotificationStatus = (status) => {
        this.setState({ showNotification: status });
    };

    render() {
        const {
            classes,
            app_info,
            appscreen_link,
            is_screen_configure,
            parent,
            is_restricted_user,
            top_navbar
        } = this.props;

        let local_storage_theme = localStorage.getItem('codx-products-theme');

        if (!local_storage_theme) {
            local_storage_theme = 'dark';
        }
        const advanceFeatures = this.renderAdvancedFeatureLinks();
        const admin_link_icon = classes.adminLinkIcon;

        // eslint-disable-next-line no-unused-vars
        let logout_link = '/logout/' + app_info.industry;

        if (app_info.id || (app_info.modules && app_info.modules.user_mgmt)) {
            // eslint-disable-next-line no-unused-vars
            logout_link = '/logout/app/' + app_info.id;
        }
        let dashboard_link = is_restricted_user
            ? '/my-dashboard'
            : '/dashboard' + app_info.industry
            ? '/' + app_info.industry
            : '';

        if (app_info.modules && app_info.modules.user_mgmt) {
            dashboard_link = '/app/' + app_info.id;
        }

        const is_admin = parent.props?.location?.pathname.includes(
            '/app/' + app_info.id + '/admin'
        );
        const is_minerva_dashboard = parent.props?.location?.pathname.includes(
            '/app/' + app_info.id + '/ask-nuclios'
        );

        const menubarProps = {
            history: this.props.history,
            hideProfile: this.props.hideProfile,
            is_restricted_user: this.props.is_restricted_user,
            user_permissions: this.props.user_permissions,
            app_info: this.props.app_info,
            GPTinfo: this.props.GPTinfo
        };
        return (
            <div className={classes.appBarContainer}>
                <AppBar position="static" className={classes.appBarNoSideNav}>
                    <Toolbar className={classes.toolBar}>
                        <div
                            className={`${
                                !this.props.drawerCon
                                    ? `${classes.mainLogo} ${
                                          (this.props.askNucliosOpen || this.props.commentsOpen || this.props.widgetComment) ? classes.mainLogoCollapsed : ''
                                      }`
                                    : `${classes.mainLogo1} ${classes.mainLogo1Collapsed}  ${
                                           (this.props.askNucliosOpen || this.props.commentsOpen || this.props.widgetComment) ? classes.mainLogoCollapsed : ''
                                      }`
                            } ${top_navbar ? classes.topnav_mainLogo : ''}
                            `}
                        >
                            <Link
                                key={'main_dashboard_link'}
                                to={dashboard_link}
                                className={classes.mainLogoLink}
                                aria-label="NucliOs-Dashboard"
                            >
                                {app_info.small_logo_url ? (
                                    <div className={classes.customerLogoWrapper}>
                                        <img
                                            src={app_info.small_logo_url}
                                            className={classes.customerLogoImg}
                                            alt="Customer Logo"
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <Nuclios
                                            color={this.props.theme.palette.text.contrastText}
                                            className={classes.codxLogo}
                                        />
                                    </div>
                                )}
                            </Link>
                        </div>

                        <div
                            className={
                                !this.props.drawerCon
                                    ? classes.applicationTitle
                                    : classes.applicationTitle1
                            }
                        >
                            <div className={classes.appName}>
                                {!is_minerva_dashboard && (
                                    <Typography
                                        className={classes.appNavBarTitle}
                                        variant="h4"
                                        noWrap
                                    >
                                        {app_info.name}
                                        {!is_admin ? (
                                            <span className={classes.appNavBarScreenName}>
                                                {app_info?.modules?.dashboard &&
                                                this.props?.location?.pathname.endsWith(
                                                    `/app/${this.props.app_info.id}/dashboard`
                                                )
                                                    ? 'Home'
                                                    : this.props.activeScreenDetails?.screen_name}
                                            </span>
                                        ) : null}
                                    </Typography>
                                )}
                            </div>
                            <div className={classes.configurationSection}>
                                <div className={classes.configurations}>
                                    {this.props.shouldRenderAskNuclios &&
                                        ((this.props.app_info?.modules?.minerva?.enabled &&
                                            this.props.app_info?.modules?.minerva?.tenant_id) ||
                                            (this.props.app_info?.modules?.copilot?.enabled &&
                                                this.props.app_info?.modules?.copilot?.app_id)) && (
                                            <AskNucliosButton
                                                togglePopup={this.props.togglePopup}
                                            />
                                        )}
                                    {!is_admin && advanceFeatures.length  && this.props?.app_info?.modules?.top_navbar ? (
                                        <div
                                            ref={this.popoverAnchor}
                                            className={clsx(
                                                classes.advancedFeatures,
                                                this.state.openPopover
                                                    ? classes.hoverAdvanceFeat
                                                    : ''
                                            )}
                                            onMouseEnter={(e) => this.showAdvanceFeat(e)}
                                            onMouseLeave={this.closeAdvanceFeat}
                                        >
                                            <span>
                                                Advanced Features{' '}
                                                {!this.state.openPopover ? (
                                                    <KeyboardArrowDownIcon />
                                                ) : (
                                                    <KeyboardArrowUpIcon />
                                                )}
                                            </span>
                                        </div>
                                    ) : null}
                                    {!is_admin && advanceFeatures.length && this.props?.app_info?.modules?.top_navbar ? (
                                        <Popover
                                            open={this.state.openPopover}
                                            anchorEl={this.popoverAnchor.current}
                                            onClose={this.closeAdvanceFeat}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left'
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left'
                                            }}
                                            className={classes.popover}
                                            classes={{
                                                paper: classes.popoverContent
                                            }}
                                            disableRestoreFocus
                                            PaperProps={{
                                                onMouseEnter: this.showAdvanceFeat,
                                                onMouseLeave: this.closeAdvanceFeat
                                            }}
                                        >
                                            {advanceFeatures}
                                        </Popover>
                                    ) : null}

                                    <Tooltip
                                        title={''}
                                        classes={{
                                            tooltip: classes.iconTooltip,
                                            arrow: classes.arrow
                                        }}
                                        arrow
                                    >
                                        <div className={classes.hoverChatGpt}>
                                            <ChatGPTSummary
                                                app_id={this.props.app_info.id}
                                                screen_id={this.props.GPTinfo?.screen_id || '26'}
                                                data_items={this.props.GPTinfo?.data_items || []}
                                            />
                                        </div>
                                    </Tooltip>
                                    {app_info?.modules?.alerts ? (
                                        <NotificationPreview
                                            app_id={app_info.id}
                                            NavBarIconButton={NavBarIconButton}
                                            history={this.props.history}
                                            scenarioLibraryOpen={this.props.scenarioLibraryOpen}
                                        />
                                    ) : null}
                                    {!is_admin ? (
                                        <div className={classes.hover}>
                                            <BuildIcon
                                                onClick={this.showRearrangeWidgetsHandler}
                                                ref={this.rearrangeWidgets}
                                                className={classes.toolIcon}
                                            />
                                        </div>
                                    ) : null}
                                    <Popover
                                        open={this.state.showRearrangeWidgetsToolbox}
                                        anchorEl={this.rearrangeWidgets.current}
                                        onClose={this.closeRearrangeWidgets}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left'
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center'
                                        }}
                                        className={classes.popover}
                                        classes={{
                                            paper: classes.popoverContent
                                        }}
                                        disableRestoreFocus
                                        PaperProps={{
                                            style: {
                                                marginTop: '10px',
                                                borderRadius: '10px'
                                            }
                                        }}
                                    >
                                        {this.props.activeScreenWidgets &&
                                        this.props.activeScreenWidgets.length ? (
                                            <DraggableWidgets
                                                history={this.props.history}
                                                closeRearrangeWidgets={this.closeRearrangeWidgets}
                                                widgets={this.props.activeScreenWidgets}
                                                appId={this.props.app_info.id}
                                                screenId={this.props.activeScreenId}
                                                updateNotificationStatus={
                                                    this.updateNotificationStatus
                                                }
                                            />
                                        ) : (
                                            <ClickAwayListener
                                                onClickAway={this.closeRearrangeWidgets}
                                            >
                                                <div className={classes.noWidgetsMsgWrapper}>
                                                    Please setup widgets to access this feature
                                                </div>
                                            </ClickAwayListener>
                                        )}
                                    </Popover>
                                    <CustomSnackbar
                                        open={this.state.showNotification}
                                        autoHideDuration={3000}
                                        onClose={() => this.updateNotificationStatus(false)}
                                        severity="success"
                                        message="Dashboard has been updated successfully."
                                        classNames={
                                            this.props.askNucliosOpen 
                                                ? { root: classes.snackbarPosition }
                                                : {}
                                        }
                                    />
                                    <div
                                        className={`${classes.hover} ${
                                            this.state.menuPopover ? classes.selectedMoreMenu : ''
                                        }`}
                                    >
                                        <MoreVertIcon
                                            onMouseEnter={this.showMoreMenuItems}
                                            ref={this.moreMenuItems}
                                            onMouseLeave={this.closeMoreMenuItems}
                                            className={classes.moreIcon}
                                        />
                                        <Popover
                                            open={this.state.menuPopover}
                                            anchorEl={this.moreMenuItems.current}
                                            onClose={this.closeMoreMenuItems}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left'
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right'
                                            }}
                                            className={classes.popover}
                                            classes={{
                                                paper: classes.popoverContent
                                            }}
                                            disableRestoreFocus
                                            PaperProps={{
                                                style: {
                                                    marginTop: '10px',
                                                    marginLeft: '10px'
                                                },
                                                onMouseEnter: this.showMoreMenuItems,
                                                onMouseLeave: this.closeMoreMenuItems
                                            }}
                                        >
                                            <ListItem
                                                className={clsx(classes.menuItemLink, 'helpButton')}
                                                button
                                                onClick={(e) => this.handleHelpIconClick(e)}
                                            >
                                                <ListItemIcon className={classes.advancedIconRoot}>
                                                    <HelpIcon
                                                        className={admin_link_icon}
                                                        color={`${this.props.theme.palette.text.default}`}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    disableTypography
                                                    primary={
                                                        <Typography
                                                            variant="h5"
                                                            className={classes.sidebarLinkText}
                                                        >
                                                            Help
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                            <hr className={classes.separtorLine} />
                                            {app_info.modules?.application_manual_url &&
                                                app_info.modules?.manual_url && (
                                                    <ListItem
                                                        className={classes.menuItemLink}
                                                        button
                                                        onClick={() => {
                                                            window.open(
                                                                app_info.modules?.manual_url,
                                                                '_blank'
                                                            );
                                                        }}
                                                    >
                                                        <ListItemIcon
                                                            className={classes.advancedIconRoot}
                                                        >
                                                            <MenuBookRoundedIcon
                                                                fontSize="large"
                                                                className={admin_link_icon}
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            disableTypography
                                                            primary={
                                                                <Typography
                                                                    variant="h5"
                                                                    className={
                                                                        classes.sidebarLinkText
                                                                    }
                                                                >
                                                                    App Manual
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItem>
                                                )}
                                            <ListItem
                                                className={`${classes.menuItemLink} ${
                                                    this.state.UserGuide ? classes.selected : ''
                                                }`}
                                                button
                                                onClick={() => this.setState({ UserGuide: true })}
                                            >
                                                <ListItemIcon className={classes.advancedIconRoot}>
                                                    <UserGuideIcon
                                                        fontSize="large"
                                                        className={admin_link_icon}
                                                    />
                                                </ListItemIcon>
                                                <UserGuide
                                                    app_id={app_info.id}
                                                    screen_id={this.props?.GPTinfo?.screen_id}
                                                    onData={this.props.videoRender}
                                                    closeMoreOptions={this.closeMoreMenuItems}
                                                />
                                            </ListItem>
                                        </Popover>
                                    </div>
                                    {is_screen_configure
                                        ? [
                                              <NavigateNextIcon
                                                  key="configure-breadcrumb"
                                                  className={classes.appNavBarTitleBreadcrumbIcon}
                                                  fontSize="large"
                                              ></NavigateNextIcon>,
                                              <Typography
                                                  key="configure-breadcrumb-title"
                                                  className={classes.appNavBarTitle}
                                                  variant="h4"
                                              >
                                                  {'Screen Configuration'}
                                              </Typography>,
                                              <Button
                                                  key={'appNavBarExitConfigureButton'}
                                                  className={classes.appNavBarExitConfigureButton}
                                                  classes={{
                                                      label: classes.appNavBarExitConfigureButtonLabel
                                                  }}
                                                  onClick={() =>
                                                      this.props.history.push(appscreen_link)
                                                  }
                                                  variant={'contained'}
                                                  aria-label="Exit"
                                              >
                                                  Exit
                                              </Button>
                                          ]
                                        : ''}
                                    {is_admin
                                        ? [
                                              <NavigateNextIcon
                                                  key="admin-breadcrumb"
                                                  className={classes.appNavBarTitleBreadcrumbIcon}
                                                  fontSize="large"
                                              ></NavigateNextIcon>,
                                              <Typography
                                                  key="admin-breadcrumb-title"
                                                  className={classes.appNavBarTitle}
                                                  variant="h4"
                                              >
                                                  {'Admin'}
                                              </Typography>
                                          ]
                                        : ''}
                                </div>
                                {this.state.renderTheme ? <ThemeToggle /> : null}
                                <div className={classes.separtor}></div>
                                <MenuBar
                                    {...menubarProps}
                                    is_admin={is_admin}
                                    showDashboardNotification={false}
                                />
                            </div>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

AppNavBar.propTypes = {
    classes: PropTypes.object.isRequired,
    app_info: PropTypes.object.isRequired
};

const mapDispatchToProps = (dispatch) => {
    return {
        resetAuth: (authData) => dispatch(resetAuthentication(authData)),
        setActiveScreenWidgets: (payload) => dispatch(setWidgetData(payload))
    };
};

const mapStateToProps = (state) => {
    return {
        activeScreenId: state.appScreen.activeScreenId,
        activeScreenWidgets: state.appScreen.activeScreenWidgets,
        activeScreenDetails: state.appScreen.activeScreenDetails
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    withRouter(
        withStyles(
            (theme) => ({
                ...appNavBarStyle(theme),
                ...breadcrumbStyle(theme)
            }),
            { withTheme: true }
        )(AppNavBar)
    )
);
