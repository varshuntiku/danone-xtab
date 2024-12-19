import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Route, Switch, Redirect } from 'react-router-dom';
import { verifyAuth, getUserAppId, getUserSpecialAccess } from 'services/auth.js';
import loginStyle from 'assets/jss/loginStyle.jsx';
import * as Sentry from '@sentry/react';
import { getGeoPlugin } from '../services/matomo';
import { logout, setAutoRefreshActionToken } from '../services/auth';
import { UserInfoContext } from '../context/userInfoContent';
import AuthLoader from 'components/shared/auth-loader/auth-loader';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';

const App = lazy(() => import('./App'));
const Dashboard = lazy(() => import('./Dashboard'));
const NetworkDashboard = lazy(() => import('./NetworkDashboard/src/NetworkDashboard'));
const UserDashboard = lazy(() => import('./userDashboard/UserDashboard'));
const PDFrameWork = lazy(() => import('./porblemDefinitionFramework/PDFramework'));
const ForgotPassword = lazy(() => import('./ForgotPassword'));
const ResetPassword = lazy(() => import('./ResetPassword'));
const PlatformNotificationWorkspace = lazy(() =>
    import('./alert-dialog/PlatformNotificationWorkspace')
);
const UtilsDashboard = lazy(() => import('./Utils/UtilsDashboard'));
const Reports = lazy(() => import('../layouts/Reports'));
const Matomo = lazy(() => import('./Matomo'));
const LoginPage = lazy(() => import('../pages/login/login-page'));
import DashboardsWrapper from './DashboardsWrapper';

class CodxProducts extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            loading: true,
            authenticated: false,
            user_info: false,
            is_restricted_user: false,
            app_access_error: false,
            user_permissions: false,
            app_id: false,
            landing_url: '',
            special_urls: []
        };
    }

    componentDidMount() {
        verifyAuth({
            callback: this.onVerifyAuthResponse
        });
        this.inactivityTime();
    }

    inactivityTime = () => {
        let time;
        const resetTimer = () => {
            clearTimeout(time);
            time = setTimeout(
                () => {
                    if (!this.props.location.pathname.startsWith('/logout')) {
                        logout({
                            callback: () => {
                                this.props.history.push('/logout');
                            }
                        });
                    }
                },
                1000 * 60 * 60
            );
        };
        resetTimer();
        document.onmousemove = resetTimer;
        document.onkeydown = resetTimer;
        document.onkeyup = resetTimer;
    };

    onVerifyAuthResponse = (response_data) => {
        if (response_data.status === 'success') {
            setAutoRefreshActionToken();
            localStorage.setItem('nac.access.token', response_data.nac_access_token);
            // socket.emit('user_session', response_data.username);
            sessionStorage.setItem(
                'user_name',
                response_data.first_name + ' ' + response_data.last_name
            );
            sessionStorage.setItem('user_email', response_data.username);

            Sentry.configureScope(function (scope) {
                scope.setUser({
                    email: response_data.username
                });
            });
            if (response_data.is_restricted_user) {
                this.setState({
                    authenticated: true,
                    loading: true,
                    is_restricted_user: true,
                    user_permissions: response_data.feature_access,
                    user_info: response_data
                });

                getUserAppId({
                    callback: this.onResponseAppId
                });
            } else {
                this.setState({
                    user_permissions: response_data.feature_access,
                    user_info: response_data
                });

                getUserSpecialAccess({
                    callback: this.onResponseGetSpecialAccess
                });
            }
            getGeoPlugin();
            if (window.location.pathname.indexOf('/logout') >= 0) {
                this.props.history.push(window.location.pathname.replace('/logout', ''));
            }
        } else {
            this.setState({
                authenticated: false,
                loading: false,
                is_restricted_user: false,
                app_access_error: false,
                app_id: false,
                landing_url: '',
                special_urls: [],
                user_permissions: response_data.feature_access,
                user_info: response_data
            });
        }
    };

    onResponseAppId = (response_data) => {
        if (response_data.status === 'success' && response_data.app_id) {
            this.setState({
                loading: false,
                app_id: response_data.app_id,
                landing_url: encodeURI(response_data.landing_url),
                app_access_error: false
            });

            if (window.location.pathname.includes('login') || window.location.pathname === '') {
                if (response_data.app_id.length === undefined) {
                    this.props.history.push('/app/' + response_data.app_id);
                } else if (response_data.app_id.length >= 1) {
                    this.props.history.push(this.state.landing_url);
                }
            }
        } else {
            this.setState({
                authenticated: false,
                loading: false,
                app_id: false,
                landing_url: '',
                app_access_error: true,
                special_urls: []
            });
        }
    };

    onResponseGetSpecialAccess = (response_data) => {
        this.setState({
            authenticated: true,
            loading: false,
            special_urls: response_data.special_access_urls || []
        });

        if (
            window.location.pathname.indexOf('/logout') === -1 &&
            window.location.pathname.indexOf('/login/app') === -1
        ) {
            this.props.history.push(window.location.pathname.replace('login', 'dashboard'));
        } else if (
            window.location.pathname.indexOf('/logout') === -1 &&
            window.location.pathname.indexOf('/login/app') === 0
        ) {
            this.props.history.push(window.location.pathname.replace('/login', ''));
        }
    };

    onLogout = () => {
        this.setState({
            authenticated: false,
            loading: false,
            is_restricted_user: false,
            app_access_error: false,
            app_id: false,
            landing_url: '',
            special_urls: []
        });

        if (window.location.pathname.indexOf('/logout') === 0) {
            this.props.history.push(window.location.pathname.replace('logout', 'login'));
        }
    };

    onLogin = (is_restricted_user) => {
        verifyAuth({
            callback: this.onVerifyAuthResponse
        });

        if (!is_restricted_user) {
            if (
                window.location.pathname.indexOf('/logout') === -1 &&
                window.location.pathname.indexOf('/login/app') === -1
            ) {
                this.props.history.push(window.location.pathname.replace('login', 'dashboard'));
            }
        } else {
            window.location.reload();
        }

        if (
            window.location.pathname.indexOf('/logout') === -1 &&
            window.location.pathname.indexOf('/login/app') === 0
        ) {
            this.props.history.push(window.location.pathname.replace('/login', ''));
        }
    };

    render() {
        if (!this.state.loading) {
            return (
                <UserInfoContext.Provider value={this.state.user_info}>
                    <Suspense fallback={<CodxCircularLoader center size={60} />}>
                        <Switch>
                            {this.state.authenticated
                                ? [
                                      !this.state.is_restricted_user
                                          ? [
                                                <Route
                                                    exact
                                                    key="dashboard_industry"
                                                    path="/dashboard/:industry"
                                                    component={(props) => (
                                                        <Dashboard
                                                            user_permissions={
                                                                this.state.user_permissions
                                                            }
                                                            {...props}
                                                        />
                                                    )}
                                                />,
                                                <Route
                                                    exact
                                                    key="dashboard_industry_function"
                                                    path="/dashboard/:industry/:function"
                                                    component={(props) => (
                                                        <Dashboard
                                                            user_permissions={
                                                                this.state.user_permissions
                                                            }
                                                            {...props}
                                                        />
                                                    )}
                                                />,
                                                <Route
                                                    exact
                                                    key="dashboard"
                                                    path="/dashboard"
                                                    render={(props) => (
                                                        <Dashboard
                                                            user_permissions={
                                                                this.state.user_permissions
                                                            }
                                                            {...props}
                                                        />
                                                    )}
                                                />
                                            ]
                                          : this.state.app_id.length
                                          ? [
                                                <Route
                                                    exact
                                                    key="dashboard_industry_function"
                                                    path="/dashboard/:industry/:function"
                                                    component={(props) => (
                                                        <Dashboard
                                                            user_permissions={
                                                                this.state.user_permissions
                                                            }
                                                            forRestrictedUser={
                                                                this.state.is_restricted_user
                                                            }
                                                            {...props}
                                                        />
                                                    )}
                                                />
                                            ]
                                          : [],
                                      <Route
                                          key="password_reset"
                                          path="/resetpassword"
                                          component={(props) => <ResetPassword {...props} />}
                                      />,
                                      <Route
                                          key="projects"
                                          path="/projects"
                                          render={(props) => (
                                              <PDFrameWork
                                                  user_permissions={this.state.user_permissions}
                                                  user_info={this.state.user_info}
                                                  {...props}
                                              />
                                          )}
                                      />,
                                      <Route
                                          key="my_dashboard"
                                          path="/my-dashboard"
                                          render={(props) => (
                                              <UserDashboard
                                                  user_permissions={this.state.user_permissions}
                                                  {...props}
                                              />
                                          )}
                                      />,
                                      <Route
                                          key="app"
                                          path="/app/:app_id"
                                          render={(props) => (
                                              <App
                                                  logged_in_user_info={
                                                      this.state.user_info?.username
                                                  }
                                                  user_permissions={this.state.user_permissions}
                                                  is_restricted_user={this.state.is_restricted_user}
                                                  {...props}
                                              />
                                          )}
                                      />,
                                      <Route
                                          key="app-configure"
                                          path="/app-configure/:app_id"
                                          render={(props) => (
                                              <App
                                                  logged_in_user_info={
                                                      this.state.user_info?.username
                                                  }
                                                  is_restricted_user={this.state.is_restricted_user}
                                                  user_permissions={this.state.user_permissions}
                                                  {...props}
                                              />
                                          )}
                                      />,
                                      <Route
                                          key="stories"
                                          path="/stories"
                                          render={(props) => (
                                              <Reports
                                                  {...props}
                                                  logged_in_user_info={
                                                      this.props.logged_in_user_info
                                                  }
                                              />
                                          )}
                                      />,
                                      <Route
                                          key="platform_utils"
                                          path="/platform-utils"
                                          render={(props) => <UtilsDashboard {...props} />}
                                      />,
                                      <Route
                                          key="logout_industry"
                                          exact
                                          path="/logout/:industry"
                                          component={(props) => (
                                              <LoginPage
                                                  logout={true}
                                                  parent_obj={this}
                                                  {...props}
                                              />
                                          )}
                                      />,
                                      <Route
                                          key="logout_app"
                                          exact
                                          path="/logout/app/:app_id"
                                          component={(props) => (
                                              <LoginPage
                                                  logout={true}
                                                  parent_obj={this}
                                                  {...props}
                                              />
                                          )}
                                      />,
                                      <Route
                                          key="logout"
                                          exact
                                          path="/logout"
                                          component={(props) => (
                                              <LoginPage
                                                  logout={true}
                                                  parent_obj={this}
                                                  {...props}
                                              />
                                          )}
                                      />,
                                      <Route
                                          key="lumos"
                                          exact
                                          path="/lumos"
                                          component={(props) => <Matomo {...props} />}
                                      />,
                                      <Route
                                          key="healthcare-dashboard"
                                          exact
                                          path="/healthcare-dashboard"
                                          component={(props) => (
                                              <NetworkDashboard
                                                  user_permissions={this.state.user_permissions}
                                                  user_info={this.state.user_info}
                                                  parent_obj={this}
                                                  {...props}
                                              />
                                          )}
                                      />,
                                      <Route
                                          key="platform-notifications"
                                          path="/platform-notifications"
                                          render={(props) => (
                                              <PlatformNotificationWorkspace
                                                  user_permissions={this.state.user_permissions}
                                                  user_info={this.state.user_info}
                                                  {...props}
                                              />
                                          )}
                                      />,
                                      /* <Route exact path="/codx-components" component={(props) => <CodxComponentsDemo />} /> */

                                      // Generalised dashboards routes
                                      <Route
                                          key="dashboards"
                                          path="/dashboards/:dashboard_id"
                                          component={(props) => <DashboardsWrapper {...props} />}
                                      />,
                                      <Route
                                          key="custom-dashboards"
                                          path="/custom-dashboards/:dashboard_url"
                                          component={(props) => <DashboardsWrapper {...props} />}
                                      />
                                  ]
                                : ''}
                            <Route
                                key="login_industry"
                                exact
                                path="/login/:industry"
                                component={(props) => <LoginPage parent_obj={this} {...props} />}
                            />
                            <Route
                                key="login_app"
                                exact
                                path="/login/app/:app_id"
                                component={(props) => <LoginPage parent_obj={this} {...props} />}
                            />
                            <Route
                                key="login"
                                exact
                                path="/login"
                                component={(props) => <LoginPage parent_obj={this} {...props} />}
                            />
                            {/* <Route exact path="/healthcare-dashboard" component={(props) => <NetworkDashboard parent_obj={this} {...props} />} /> */}
                            {/* <Route exact path="/healthcare-dashboard2" component={(props) => <NetworkDashboard parent_obj={this} {...props} />} /> */}
                            {this.state.authenticated ? (
                                this.state.is_restricted_user &&
                                !(this.state.app_id instanceof Array) &&
                                this.state.app_id ? (
                                    <Redirect to={'/app/' + this.state.app_id} />
                                ) : this.state.is_restricted_user &&
                                  this.state.app_id.length >= 1 ? (
                                    <Redirect to={this.state.landing_url} />
                                ) : import.meta.env['REACT_APP_COPILOT_ADMIN_CLIENT'] ? (
                                    <Redirect to={'/platform-utils'} />
                                ) : (
                                    <Redirect to={'/dashboard'} />
                                )
                            ) : (
                                [
                                    <Route
                                        key="forgotpassword"
                                        path="/forgotpassword"
                                        component={ForgotPassword}
                                    />,
                                    <Route
                                        key="appLogin"
                                        path="/app/:app_id"
                                        component={(props) => (
                                            <LoginPage parent_obj={this} {...props} />
                                        )}
                                    />,
                                    <Route
                                        key="Logout"
                                        path="/logout/app/:app_id"
                                        component={(props) => (
                                            <LoginPage parent_obj={this} {...props} />
                                        )}
                                    />,
                                    <Route
                                        key="main"
                                        path="/"
                                        component={(props) => (
                                            <LoginPage parent_obj={this} {...props} />
                                        )}
                                    />
                                ]
                            )}
                        </Switch>
                    </Suspense>
                </UserInfoContext.Provider>
            );
        } else {
            return <AuthLoader />;
        }
    }
}

CodxProducts.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(
    (theme) => ({
        ...loginStyle(theme)
    }),
    { withTheme: true }
)(CodxProducts);
