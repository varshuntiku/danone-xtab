import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

import { verifyAuth, setAutoRefreshActionToken } from '../../services/auth';
import * as Sentry from '@sentry/react';
import { getGeoPlugin } from '../../services/matomo';

const LoginPage = lazy(() => import('../../pages/login/login-page'));
const MainPage = lazy(() => import('../MainPage'));
const ForgotPassword = lazy(() => import('../ForgotPassword'));
import { AuthContext } from '../../auth/AuthContext';
import { logoutUser } from '../../util';
import initiate_socket_connect from '../../util/initiate_socket';
import { connect } from 'react-redux';
import { resetAuthentication } from 'store/index';

import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import LoginPopup from '../misc/LoginPopup';

class Home extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            loading: false,
            auth_response: false
        };
    }

    componentDidMount() {
        // this.props.history.index = 0
        let account = this.context.getAccount();
        let token = localStorage.getItem('local.access.token.key');
        if (account || token) {
            this.setState({
                loading: false
            });
            this.props.onVerifyAuth(true);
        }
        verifyAuth({
            callback: this.onVerifyAuthResponse
        });
        // this.inactivityTime();

        window.addEventListener('storage', (event) => {
            if (event.key === 'logout-event' && event.newValue === 'started') {
                this.props.history.push({
                    pathname: '/',
                    exact: true,
                    state: { logout: true }
                });
            }
        });
    }

    inactivityTime = () => {
        let time;
        const resetTimer = () => {
            clearTimeout(time);
            time = setTimeout(
                async () => {
                    const logoutResponse = await logoutUser();
                    if (logoutResponse?.status == 'success') {
                        this.props.history.push({
                            pathname: '/',
                            exact: true,
                            state: { logout: true }
                        });
                    }
                },
                2000 * 60 * 60
            );
        };
        resetTimer();
        document.onmousemove = resetTimer;
        document.onkeydown = resetTimer;
        document.onkeyup = resetTimer;
    };

    onVerifyAuthResponse = (response_data) => {
        if (response_data.status === 'success') {
            this.context.setUser(response_data);

            setAutoRefreshActionToken();

            localStorage.setItem('nac.access.token', response_data.nac_access_token);

            sessionStorage.setItem(
                'user_name',
                response_data.first_name + ' ' + response_data.last_name
            );
            sessionStorage.setItem('user_email', response_data.username);
            sessionStorage.setItem('user_id', response_data?.user_id);

            Sentry.configureScope(function (scope) {
                scope.setUser({
                    email: response_data.username
                });
            });

            getGeoPlugin();
            initiate_socket_connect(response_data.username);
            this.setState({
                auth_response: response_data,
                loading: false
            });
            this.props.onVerifyAuth(true);
        } else {
            if (response_data.loggedOutTokenError) {
                localStorage.clear();
            }
            this.context.setUser(null);
            this.setState({
                loading: false
            });
            this.props.onVerifyAuth(false);
        }
    };

    onLogin = () => {
        this.setState({ loading: true });
        verifyAuth({
            callback: this.onVerifyAuthResponse
        });
    };

    render() {
        return (
            <Suspense
                fallback={
                    <CodxCircularLoader center size={60} data-testid="codx-circular-loader" />
                }
            >
                {this.props.refreshTokenExpired === 'expired' ? (
                    <Route component={() => <LoginPopup />} />
                ) : this.props.authenticated ? (
                    <MainPage auth_response={this.state.auth_response} />
                ) : (
                    <Switch>
                        [
                        <Route
                            key="forgotpassword"
                            path="/forgotpassword"
                            component={(props) => <ForgotPassword {...props} />}
                        />
                        ,
                        <Route component={(props) => <LoginPage parent_obj={this} {...props} />} />]
                    </Switch>
                )}
            </Suspense>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authenticated: state.authData.authenticated,
        refreshTokenExpired: state.authData.refreshTokenExpired
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onVerifyAuth: (authData) => dispatch(resetAuthentication(authData))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
