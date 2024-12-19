import React, { lazy, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { getUserAppId, getUserSpecialAccess } from 'services/auth.js';
import { UserInfoContext } from '../context/userInfoContent';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import DiagnosemeHome from 'components/Diagnoseme/home';
import DiagnosemeHomeClone from 'components/Diagnoseme-clone/home';

const App = lazy(() => import('./App'));
const MobileApp = lazy(() => import('./MobileApp'));
const DashboardWrapper = lazy(() => import('./Dashboard'));
import ProblemsDashboard from 'layouts/ProblemsDashboard';
import NewPlatformDashboard from 'components/NewPlatformDashboard.jsx';
import ApplicationDashboard from '../components/ApplicationDashboard';
const FlowConfigurator = lazy(() => import('./connectedSystem/FlowConfigurator/FlowConfigurator'));
const UserDashboard = lazy(() => import('./userDashboard/UserDashboard'));
const PDFrameWork = lazy(() => import('./porblemDefinitionFramework/PDFramework'));
const ResetPassword = lazy(() => import('./ResetPassword'));
const PlatformNotificationWorkspace = lazy(() =>
    import('./alert-dialog/PlatformNotificationWorkspace')
);
const UtilsDashboard = lazy(() => import('./Utils/UtilsDashboard'));
const Reports = lazy(() => import('../layouts/Reports'));
const Matomo = lazy(() => import('./Matomo'));
const DashboardsWrapper = lazy(() => import('./DashboardsWrapper'));
const LLMWorkbench = lazy(() => import('pages/llm-workbench/llm-workbench'));
import { isMobileDevice } from 'common/utils';
const DSWorkbench = lazy(() => import('./dsWorkbench/DSWorkbench'));

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        // TODO: remove this once dark theme is enabled on prod
        // localStorage.setItem('codx-products-theme','light')
        // this.env = import.meta.env['REACT_APP_ENV'];
        // if (this.env === 'uat' || this.env === 'prod') {
        //     localStorage.setItem('codx-products-theme', 'light');
        // }
        this.state = {
            user_info: props.auth_response || false,
            is_restricted_user: props.auth_response.is_restricted_user || false,
            user_permissions: props.auth_response.feature_access || false,
            app_access_error: false,
            app_id: false,
            landing_url: '',
            special_urls: [],
            loading: true,
            dataFetched: false
        };
        this.isMobile = isMobileDevice();
    }

    componentDidMount() {
        if (this.state.is_restricted_user) {
            getUserAppId({
                callback: this.onResponseAppId
            });
        } else {
            getUserSpecialAccess({
                callback: this.onResponseGetSpecialAccess
            });
        }
        // socket.emit('user_session', this.props.auth_response.username);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.auth_response != this.props.auth_response) {
            this.setState({
                user_info: this.props.auth_response,
                is_restricted_user: this.props.auth_response.is_restricted_user,
                user_permissions: this.props.auth_response.feature_access
            });
        }
    }

    onResponseAppId = (response_data) => {
        if (response_data.status === 'success' && response_data.app_id) {
            this.setState({
                loading: false,
                app_id: response_data.app_id,
                landing_url: encodeURI(response_data.landing_url),
                dataFetched: true
            });

            if (response_data.app_id.length === undefined) {
                this.props.history.push('/app/' + response_data.app_id);
            } else if (response_data.app_id.length >= 1) {
                this.props.history.push(this.state.landing_url);
            }
        } else {
            this.setState({
                loading: false,
                app_id: false,
                landing_url: '',
                app_access_error: true,
                special_urls: [],
                dataFetched: true
            });
        }
    };

    onResponseGetSpecialAccess = (response_data) => {
        this.setState({
            loading: false,
            special_urls: response_data.special_access_urls || [],
            dataFetched: true
        });
    };

    render() {
        if (this.state.loading || !this.state.dataFetched) {
            return <CodxCircularLoader center size={60} />;
        }
        return (
            <UserInfoContext.Provider value={this.state.user_info}>
                <Suspense fallback={<CodxCircularLoader center size={60} />}>
                    <Switch>
                        {[
                            !this.state.is_restricted_user
                                ? [
                                      <Route
                                          exact
                                          key="dashboard_industry"
                                          path="/dashboard/:industry"
                                          component={(props) => (
                                              <DashboardWrapper
                                                  user_permissions={this.state.user_permissions}
                                                  {...props}
                                              >
                                                  <ProblemsDashboard {...props} />
                                              </DashboardWrapper>
                                          )}
                                      />,
                                      <Route
                                          exact
                                          key="dashboard_industry_function"
                                          path="/dashboard/:industry/:function"
                                          component={(props) => (
                                              <DashboardWrapper
                                                  user_permissions={this.state.user_permissions}
                                                  {...props}
                                              >
                                                  <ApplicationDashboard
                                                      user_permissions={this.state.user_permissions}
                                                      {...props}
                                                  />
                                              </DashboardWrapper>
                                          )}
                                      />,
                                      <Route
                                          exact
                                          key="dashboard"
                                          path="/dashboard"
                                          render={(props) => (
                                              <DashboardWrapper
                                                  user_permissions={this.state.user_permissions}
                                                  {...props}
                                              >
                                                  <NewPlatformDashboard {...props} />
                                              </DashboardWrapper>
                                          )}
                                      />,
                                      <Route
                                          key="platform_utils"
                                          path="/platform-utils"
                                          render={(props) => {
                                              return (
                                                  <UtilsDashboard
                                                      {...props}
                                                      is_restricted_user={
                                                          this.state.is_restricted_user
                                                      }
                                                      user_permissions={this.state.user_permissions}
                                                  />
                                              );
                                          }}
                                      />,
                                      <Route
                                          key="ds-workbench"
                                          path="/ds-workbench"
                                          render={(props) => (
                                              <DSWorkbench
                                                  {...props}
                                                  is_restricted_user={this.state.is_restricted_user}
                                                  user_permissions={this.state.user_permissions}
                                              />
                                          )}
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
                                      />
                                  ]
                                : this.state.app_id.length
                                ? [
                                      <Route
                                          exact
                                          key="dashboard_industry_function"
                                          path="/dashboard/:industry/:function"
                                          component={(props) => (
                                              <DashboardWrapper
                                                  user_permissions={this.state.user_permissions}
                                                  {...props}
                                              >
                                                  <ApplicationDashboard
                                                      user_permissions={this.state.user_permissions}
                                                      forRestrictedUser={
                                                          this.state.is_restricted_user
                                                      }
                                                      {...props}
                                                  />
                                              </DashboardWrapper>
                                          )}
                                      />
                                  ]
                                : [],
                            <Route
                                key="password_reset"
                                path="/resetpassword"
                                component={(props) => (
                                    <ResetPassword
                                        is_restricted_user={this.state.is_restricted_user}
                                        {...props}
                                    />
                                )}
                            />,
                            import.meta.env?.['REACT_APP_ENABLE_LLMWORKBENCH'] ? (
                                <Route
                                    key="llmworkbench"
                                    path="/llmworkbench"
                                    render={(props) => (
                                        <LLMWorkbench
                                            user_permissions={this.state.user_permissions}
                                            user_info={this.state.user_info}
                                            {...props}
                                        />
                                    )}
                                />
                            ) : (
                                []
                            ),
                            <Route
                                key="my_dashboard"
                                path="/my-dashboard"
                                render={(props) => (
                                    <UserDashboard
                                        user_permissions={this.state.user_permissions}
                                        is_restricted_user={this.state.is_restricted_user}
                                        {...props}
                                    />
                                )}
                            />,
                            <Route
                                key="flow-configurator"
                                path="/flow-configurator"
                                render={(props) => (
                                    <FlowConfigurator
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
                                        logged_in_user_info={this.state.user_info?.username}
                                        user_permissions={this.state.user_permissions}
                                        is_restricted_user={this.state.is_restricted_user}
                                        {...props}
                                    />
                                )}
                            />,
                            <Route
                                key="m-app"
                                path="/m-app/:app_id"
                                render={(props) => (
                                    <MobileApp
                                        logged_in_user_info={this.state.user_info?.username}
                                        user_permissions={this.state.user_permissions}
                                        is_restricted_user={this.state.is_restricted_user}
                                        user_info={this.state.user_info}
                                        {...props}
                                    />
                                )}
                            />,
                            <Route
                                key="app-configure"
                                path="/app-configure/:app_id"
                                render={(props) => (
                                    <App
                                        logged_in_user_info={this.state.user_info?.username}
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
                                        logged_in_user_info={this.props.logged_in_user_info}
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
                            <Route
                                key="dashboards"
                                path="/dashboards/:dashboard_id"
                                component={(props) => <DashboardsWrapper {...props} />}
                            />,
                            <Route
                                key="connected-systems"
                                path="/connected-system/:conn_system_dashboard_id"
                                component={(props) => <DashboardsWrapper {...props} />}
                            />,
                            <Route
                                key="custom-dashboards"
                                path="/custom-dashboards/:dashboard_url"
                                component={(props) => <DashboardsWrapper {...props} />}
                            />,
                            <Route
                                key="custom-dashboards"
                                path="/diagnoseme"
                                component={(props) => <DiagnosemeHome {...props} />}
                            />,
                            <Route
                                key="custom-dashboards"
                                path="/diagnoseme-clone"
                                component={(props) => <DiagnosemeHomeClone {...props} />}
                            />,
                            // Added redirects since the dashboard routing has been generalized
                            <Redirect
                                key="healthcare-dashboard"
                                from="/healthcare-dashboard"
                                to="/custom-dashboards/healthcare-dashboard"
                            />,
                            <Redirect
                                key="retail-media-sell-dashboard"
                                from="/retail-media-sell-dashboard"
                                to="/custom-dashboards/retail-media-sell-dashboard"
                            />,
                            <Redirect
                                key="retail-media-buy-dashboard"
                                from="/retail-media-buy-dashboard"
                                to="/custom-dashboards/retail-media-buy-dashboard"
                            />
                        ]}
                        {this.state.is_restricted_user &&
                        !(this.state.app_id instanceof Array) &&
                        this.state.app_id ? (
                            <Redirect to={'/app/' + this.state.app_id} />
                        ) : this.state.is_restricted_user && this.state.app_id.length >= 1 ? (
                            <Redirect to={this.state.landing_url} />
                        ) : this.state.is_restricted_user ? (
                            <Redirect to={'/my-dashboard'} />
                        ) : import.meta.env['REACT_APP_COPILOT_ADMIN_CLIENT'] ? (
                            <Redirect to={'/platform-utils'} />
                        ) : (
                            <Redirect to={'/dashboard'} />
                        )}
                    </Switch>
                </Suspense>
            </UserInfoContext.Provider>
        );
    }
}
