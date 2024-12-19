import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import dashboardStyle from 'assets/jss/dashboardStyle.jsx';
// import { ReactComponent as CodxLogo } from 'assets/img/codx-new-logo.svg';
import AddAppPopup from './screenActionsComponent/actionComponents/AddAppPopup';
import Stories from './Nuclios/assets/Stories';
import { AppBar, Toolbar, Box, Button, Tooltip, Typography } from '@material-ui/core';
import clsx from 'clsx';
import MenuBar from './misc/MenuBar';
import { UserInfoContext } from 'context/userInfoContent';
import Nuclios from './Nuclios/assets/Nuclios';
import { getApps } from 'services/dashboard';
import HelpIcon from './Nuclios/assets/HelpIcon';
import AdminIcon from './Nuclios/assets/AdminIcon';
import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';
// import ReleaseBanner from 'components/shared/announcements/release-banner';

import * as _ from 'underscore';
import { decodeHtmlEntities } from 'util/decodeHtmlEntities';

let listenersAdded = false;
class NavBar extends React.Component {
    static contextType = UserInfoContext;
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            search_value: '',
            search_options: [],
            hideSearchContainer: true,
            singularDashboard: false,
            profileMenu: null,
            industry:
                props.match && props.match.params.industry ? props.match.params.industry : false,
            function:
                props.match && props.match.params.function ? props.match.params.function : false,
            industries: [],
            apps: [],
            opened: false
        };
        this.searchOptionsContainerRef = React.createRef();
        this.noRecordsContainerRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        if (this.props.match && this.props.match.params.industry) {
            if (this.props.match.params.industry === 'Codx Revenue Management') {
                this.setState({
                    singularDashboard: true
                });
            }
            getApps({
                industry: decodeURIComponent(this.props.match.params.industry),
                callback: (response_data) => {
                    this.setState({
                        apps: decodeHtmlEntities(response_data)
                    });
                }
            });
        }

        ['mousedown', 'keydown'].forEach((event) =>
            document.addEventListener(event, this.handleClickOutside, false)
        );
        if (!listenersAdded) {
            listenersAdded = true;
            document.body.addEventListener('click', (e) =>
                this.handleBodyClick(e, this.state.opened)
            );
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
        ['mousedown', 'keydown'].forEach((event) =>
            document.removeEventListener(event, this.handleClickOutside, false)
        );
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

    handleBodyClick(event, opened) {
        let launcherIframe = document.getElementById('webWidget');
        let helpButton = document.querySelector('.helpButton');

        if (event.target === launcherIframe || launcherIframe?.contains(event.target)) {
            //we don't want anything to happen if the click was made inside the launcher or widget, we just stop the event propogation
            event.stopPropagation();
            return;
        }
        if (opened && helpButton && !helpButton.contains(event.target)) {
            //this is when  the click truly occurs outside i.e outside both, the help button and the zendesk widget
            //we will now close the widget
            window.zE('webWidget', 'close');
            event.stopPropagation();
        }
    }

    handleHelpIconClick = () => {
        //as we are hiding the original launcher inside  pageInit file.. we must show it before toggling to open
        if (window.zE) {
            window.zE('webWidget', 'show');
            setTimeout(() => {
                window.zE('webWidget', 'toggle');
            }, 1000);
        } else {
            console.warn('Zendesk widget is not initialized yet.');
        }
    };

    handleClickOutside(event) {
        if (
            this.searchOptionsContainerRef.current &&
            !this.searchOptionsContainerRef.current.contains(event.target)
        ) {
            this.setState({
                hideSearchContainer: false,
                search_options: []
            });
        }
        if (
            this.noRecordsContainerRef.current &&
            !this.noRecordsContainerRef.current.contains(event.target)
        ) {
            this.setState({
                hideSearchContainer: false,
                search_options: []
            });
        }
    }

    searchText = (full_string, search_string) => {
        if (!full_string) {
            return false;
        } else {
            if (search_string.length < 3) {
                return full_string.toLowerCase().indexOf(search_string.toLowerCase()) === 0;
            } else {
                return (
                    full_string.toLowerCase().indexOf(search_string.toLowerCase()) === 0 ||
                    full_string.toLowerCase().indexOf(' ' + search_string.toLowerCase()) > 0 ||
                    full_string.toLowerCase().indexOf('/' + search_string.toLowerCase()) > 0 ||
                    full_string.toLowerCase().indexOf(',' + search_string.toLowerCase()) > 0 ||
                    full_string.toLowerCase().indexOf(':' + search_string.toLowerCase()) > 0
                );
            }
        }
    };

    navigatetoSearchOption = (search_option) => {
        if (search_option.link && search_option.enabled) {
            window.open(search_option.link, '_blank');
        }
    };

    closeSearch = () => {
        this.setState({
            search_value: '',
            search_options: []
        });
    };

    onChangeSearchValue = (event) => {
        var search_options = [];

        if (this.state.apps && this.props?.match?.params?.industry) {
            if (event.target.value !== '') {
                var apps = this.state.apps;
                var selected_industry = this.props.match.params.industry;
                var functions = _.map(
                    _.filter(
                        _.unique(
                            _.map(apps, function (app) {
                                return app.function;
                            })
                        ),
                        function (func) {
                            return this.searchText(func, event.target.value);
                        },
                        this
                    ),
                    function (filtered_func) {
                        return {
                            type: 'function',
                            enabled: true,
                            link: '/dashboard/' + selected_industry + '/' + filtered_func,
                            name: filtered_func
                        };
                    },
                    this
                );

                var problems = _.map(
                    _.filter(
                        _.filter(
                            apps,
                            function (app) {
                                if (this.props.user_permissions?.app_publish) {
                                    return true;
                                } else {
                                    return app.environment === 'prod';
                                }
                            },
                            this
                        ),
                        function (app) {
                            return (
                                app.function &&
                                app.function !== '' &&
                                this.searchText(app.name, event.target.value)
                            );
                        },
                        this
                    ),
                    function (filtered_app) {
                        return {
                            type: 'app',
                            enabled: filtered_app.app_link ? true : false,
                            link: '/app/' + filtered_app.id,
                            name: filtered_app.name,
                            function: filtered_app.function,
                            environment: filtered_app.environment
                        };
                    },
                    this
                );

                search_options = _.union(functions, problems);
                this.setState({
                    hideSearchContainer: true
                });
            }
        }

        this.setState({
            search_value: event.target.value,
            search_options: search_options
        });
    };

    handleClick = (event) => {
        this.setState({
            profileMenu: event.currentTarget
        });
    };

    handleClose = () => {
        this.setState({
            profileMenu: null
        });
    };

    navigateTo = () => {
        if (this.props.history !== undefined) this.props.history.push('/platform-utils');
    };

    render() {
        const { user_permissions } = this.props;
        const { classes } = this.props;
        const is_admin = this.props?.location?.pathname?.includes('admin');
        const updatedClasses = { ...this.props.classList, ...classes };
        // const projectScreen = window.location.pathname.startsWith("/projects")

        // var input_props = {
        //     'aria-label': 'search',
        //     value: this.state.search_value,
        //     onChange: this.onChangeSearchValue
        // };

        var local_storage_theme = localStorage.getItem('codx-products-theme');

        if (!local_storage_theme) {
            local_storage_theme = 'dark';
        }
        const dashboardLogo = import.meta.env['REACT_APP_DASHBOARD_LOGO'];
        const menubarProps = {
            history: this.props.history,
            hideProfile: this.props.hideProfile,
            is_restricted_user: this.props.is_restricted_user,
            user_permissions: this.props.user_permissions
        };

        return [
            <AppBar
                key={'industryAppBar'}
                position="relative"
                className={[
                    updatedClasses.industryAppBar,
                    this.state.singularDashboard ? updatedClasses.animateAppBar : null,
                    this.props.gridView ? classes.gridView : ''
                ].join(' ')}
            >
                <Toolbar>
                    <div className={classes.nucliosLogoWrapper}>
                        <Link
                            key={'main_dashboard_link'}
                            to={
                                import.meta.env['REACT_APP_COPILOT_ADMIN_CLIENT']
                                    ? '/platform-utils'
                                    : '/dashboard'
                            }
                            aria-label="Main Dashboard"
                        >
                            {dashboardLogo ? (
                                <img
                                    alt="dashboard-logo"
                                    src={dashboardLogo}
                                    className={updatedClasses.customerCodxLogo}
                                />
                            ) : (
                                <Nuclios
                                    color={this.props.theme.palette.primary.contrastText}
                                    className={classes.codxLogo}
                                />
                            )}
                        </Link>
                    </div>
                    {this.props.title ? (
                        <div className={classes.titleWrapper}>
                            <Typography className={classes.appNavBarTitle} variant="h4" noWrap>
                                {this.props.title}
                            </Typography>
                        </div>
                    ) : (
                        ''
                    )}
                    {/* <ReleaseBanner /> */}
                    <div className={updatedClasses.themeIcons}></div>
                    <div className={updatedClasses.grow} />

                    {/* <ThemeToggle /> */}
                    {/* {this.props.match && this.props.match.params.industry
                        ? [
                              <div
                                  key={'search_container'}
                                  className={updatedClasses.toolbarSearch}
                              >
                                  <InputBase
                                      placeholder="Search application or function"
                                      classes={{
                                          root: updatedClasses.toolbarInputRoot,
                                          input:
                                              local_storage_theme === 'dark'
                                                  ? updatedClasses.toolbarInput
                                                  : updatedClasses.toolbarInputlight
                                      }}
                                      inputProps={input_props}
                                  />
                                  <Search
                                      fontSize="large"
                                      className={updatedClasses.toolbarSearchIcon}
                                  />
                                  {this.state.search_value ? (
                                      <Close
                                          aria-label="close"
                                          fontSize="large"
                                          className={updatedClasses.toolbarCloseSearchIcon}
                                          onClick={this.closeSearch}
                                      />
                                  ) : null}
                                  {this.state.search_options.length > 0 ? (
                                      [
                                          <div
                                              key={'toolbarSearchOptionsContainer'}
                                              ref={this.searchOptionsContainerRef}
                                              className={
                                                  updatedClasses.toolbarSearchOptionsContainer
                                              }
                                          >
                                              {_.map(
                                                  this.state.search_options,
                                                  function (search_option, search_option_index) {
                                                      return (
                                                          <div
                                                              key={
                                                                  'search_option_' +
                                                                  search_option_index
                                                              }
                                                              className={
                                                                  search_option_index ===
                                                                  this.state.search_options.length -
                                                                      1
                                                                      ? updatedClasses.toolbarSearchOptionLast
                                                                      : updatedClasses.toolbarSearchOption
                                                              }
                                                              onClick={() =>
                                                                  this.navigatetoSearchOption(
                                                                      search_option
                                                                  )
                                                              }
                                                          >
                                                              {search_option.type === 'app'
                                                                  ? [
                                                                        <div
                                                                            key="appname"
                                                                            className={
                                                                                updatedClasses.toolbarSearchOptionApp
                                                                            }
                                                                        >
                                                                            {search_option.name}
                                                                            {user_permissions?.app_publish ? (
                                                                                <span
                                                                                    className={clsx(
                                                                                        search_option.environment ===
                                                                                            'prod'
                                                                                            ? updatedClasses.prodBadge
                                                                                            : '',
                                                                                        updatedClasses.envBadge
                                                                                    )}
                                                                                >
                                                                                    {
                                                                                        search_option.environment
                                                                                    }
                                                                                </span>
                                                                            ) : null}
                                                                        </div>,
                                                                        <div
                                                                            key="functionname"
                                                                            className={
                                                                                updatedClasses.toolbarSearchOptionFunction
                                                                            }
                                                                        >
                                                                            {search_option.function}
                                                                        </div>,
                                                                        <br key="br" />
                                                                    ]
                                                                  : [
                                                                        <div
                                                                            key="function name"
                                                                            className={
                                                                                updatedClasses.toolbarSearchOptionFunction
                                                                            }
                                                                        >
                                                                            {search_option.name}
                                                                        </div>,
                                                                        <br key="br" />
                                                                    ]}
                                                              <ArrowForwardIos
                                                                  className={
                                                                      updatedClasses.toolbarSearchOptionIcon
                                                                  }
                                                              />
                                                          </div>
                                                      );
                                                  },
                                                  this
                                              )}
                                          </div>
                                      ]
                                  ) : this.state.search_value &&
                                    !this.state.search_options.length &&
                                    this.state.hideSearchContainer ? (
                                      <div
                                          ref={this.noRecordsContainerRef}
                                          className={updatedClasses.toolbarSearchOptionsContainer}
                                      >
                                          NO RECORDS FOUND
                                      </div>
                                  ) : (
                                      ''
                                  )}
                              </div>,
                              <IconButton key={'toolbar_favourties'} title="Favourites">
                                  <StarBorder fontSize="large" />
                              </IconButton>
                          ]
                        : ''} */}
                    <Box display="flex" gridGap="0.5rem" alignItems="center">
                        {/* {!projectScreen && this.state?.industries?.length ? <PopupForm key={"add_application_form"} params={popup_form_params} /> : null} */}
                        {user_permissions?.app_publish &&
                        this.context.nac_roles[0]?.permissions.find(
                            (permission) => permission.name === 'CREATE_PREVIEW_APP'
                        ) ? (
                            <AddAppPopup
                                {...this.props}
                                user_permissions={user_permissions}
                                apps={this.state.apps}
                            ></AddAppPopup>
                        ) : null}
                    </Box>
                    {!this.props.is_restricted_user && this.props.connSystemDashboardId && (
                        <Tooltip
                            title={'Admin'}
                            classes={{
                                tooltip: classes.iconTooltip,
                                arrow: classes.arrow
                            }}
                            arrow
                        >
                            <div className={classes.hover}>
                                <Link
                                    to={
                                        '/connected-system/' +
                                        this.props.connSystemDashboardId +
                                        '/admin'
                                    }
                                    aria-label="conn-system-admin"
                                >
                                    <AdminIcon
                                        className={classes.navBarIcon}
                                        color={`${this.props.theme.palette.text.default}`}
                                    />
                                </Link>
                            </div>
                        </Tooltip>
                    )}
                    {this.props.showHardReloadBtn && (
                        <ConfirmPopup
                            onConfirm={this.props.onHardReload}
                            confirmText="Yes"
                            cancelText="No"
                            // title="Hard Reload"
                            title="Do you want to refresh for updates ?"
                            subTitle={
                                <>
                                    <span>Your unsaved work will be lost,</span>
                                    <br />
                                    <span>Do you wish to continue?</span>
                                </>
                            }
                        >
                            {(triggerConfirm) => (
                                <Button
                                    variant="contained"
                                    className={`${updatedClasses.triggerNavButton} ${classes.projectBtn}`}
                                    onClick={triggerConfirm}
                                    aria-label="Refresh Jupyter lab"
                                >
                                    Refresh Jupyter lab
                                </Button>
                            )}
                        </ConfirmPopup>
                    )}
                    {!this.props.is_restricted_user &&
                    !import.meta.env['REACT_APP_COPILOT_ADMIN_CLIENT'] &&
                    !location.pathname.startsWith('/projects') ? (
                        <>
                            {!this.props.isDsWorkbench && (
                                <Button
                                    variant="contained"
                                    className={`${updatedClasses.triggerNavButton} ${classes.projectBtn}`}
                                    component={Link}
                                    to={'/projects'}
                                    aria-label="Projects"
                                >
                                    Projects
                                </Button>
                            )}
                        </>
                    ) : null}
                    {this.props.match && this.props.match.params.industry ? (
                        <div
                            aria-label="reports"
                            title="Reports"
                            onClick={() => {
                                this.props.history.push('/stories');
                            }}
                            className={classes.storyIcon}
                        >
                            <Stories
                                color={this.props.theme.palette.text.default}
                                width="2.5rem"
                                height="2.5rem"
                            />
                        </div>
                    ) : null}
                    <Tooltip
                        title={'Help'}
                        classes={{
                            arrow: classes.arrow,
                            tooltip: classes.iconTooltip
                        }}
                        arrow
                    >
                        <div
                            className={clsx(classes.hover, 'helpButton')}
                            onClick={() => this.handleHelpIconClick()}
                        >
                            {/* <SearchIcon className={classes.navBarIcon} /> */}
                            <HelpIcon
                                className={classes.navBarIcon}
                                color={`${this.props.theme.palette.icons.topNav}`}
                            />
                        </div>
                    </Tooltip>
                    <div className={classes.separtor}></div>
                    <MenuBar
                        {...menubarProps}
                        is_admin={!is_admin}
                        showDashboardNotification={false}
                    />
                </Toolbar>
            </AppBar>
        ];
    }
}

NavBar.propTypes = {
    classes: PropTypes.object.isRequired
};

const styles = () => ({
    menu: {
        top: '5rem !important'
    }
});

export default withStyles(
    (theme) => ({
        ...styles(theme),
        ...dashboardStyle(theme)
    }),
    { withTheme: true }
)(NavBar);
