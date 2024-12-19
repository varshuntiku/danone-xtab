import React, { useContext, useEffect, useState } from 'react';
import { Typography, withStyles } from '@material-ui/core';
import { getAppLogo } from 'services/app';
import EmailLoginForm from '../forms/login/email-login-form-redesign';
import SsoLoginForm from '../forms/login/sso-login-form-redesign';
import { ReactComponent as PrismLogo } from 'assets/img/prism_white_logo.svg';
import userLoginStyles from './redesign-styles';
import LoginContext from 'context/login-context';
import { PublicAuthConnector } from 'auth/AuthContext';
import { stopAutoRefreshAccessToken } from 'services/auth';
import Nuclios from 'components/Nuclios/assets/Nuclios';
import { getLoginConfig } from 'services/auth';
import { loginSAMLToken } from 'services/auth';
import CustomSnackbar from 'components/CustomSnackbar.jsx';
import { withRouter } from 'react-router-dom';

const UserLogin = ({ classes, ...props }) => {
    const loginContext = useContext(LoginContext);
    // eslint-disable-next-line no-unused-vars
    const [logo_classname, setLogo_classname] = useState(false);
    const [logo_url, setLogo_url] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loginConfig, setLoginConfig] = useState({});
    const [notification, setNotification] = useState({
        message: '',
        severity: 'error',
        open: false
    });
    const logo_app_id = sessionStorage.getItem('last_app_id');

    useEffect(() => {
        if (new URLSearchParams(window.location.search).get('saml_login') === 'true') {
            loginSAMLToken({
                callback: onLoginSAMLTokenCallback
            });
            props.history.push(props.location.pathname);
        } else if (new URLSearchParams(window.location.search).get('saml_login') === 'false') {
            props.history.push(props.location.pathname);
            setNotification({
                message: 'SAML login failed',
                severity: 'error',
                open: true
            });
        } else {
            getLoginConfig({
                callback: (response) => {
                    let enabledLogin = {};
                    response.map((config) => (enabledLogin[config.config_name] = config));
                    setLoginConfig(enabledLogin);
                    setLoading(false);
                }
            });

            const { logout, selected_app_id } = loginContext;

            if ((selected_app_id && !logout) || logo_app_id) {
                getAppLogo({
                    app_id: selected_app_id || logo_app_id,
                    callback: onResponseGetApp
                });
            } else if (logout) {
                setLoading(false);
                localStorage.removeItem('local.refresh.token.key');
                localStorage.removeItem('local.access.token.exp');
                localStorage.removeItem('nac.access.token');
                if (localStorage.getItem('local.access.token.key')) {
                    // db user logout
                    localStorage.removeItem('local.access.token.key');
                    stopAutoRefreshAccessToken();
                } else {
                    // azure ad user logout
                    localStorage.removeItem('local.access.token.key');
                    PublicAuthConnector.authContext.logout();
                }
            } else {
                setLoading(false);
            }
        }
    }, []);

    const onLoginSAMLTokenCallback = (resp) => {
        setLoading(false);
        if (resp.status === 'error') {
            console.log(resp.message);
        } else {
            localStorage.setItem('local.access.token.key', resp.access_token);
            localStorage.setItem('local.refresh.token.key', resp.refresh_token);
            localStorage.setItem('local.access.token.exp', resp.exp);
            localStorage.setItem('local.saml.user.id', resp.user_id);
            loginContext.onLogin(resp.is_restricted_user);
            sessionStorage.setItem('last_app_id', '');
        }
    };

    const onResponseGetApp = (response_data) => {
        setLogo_classname(response_data['logo_url'] ? classes.customerLogoBig : classes.logo);
        setLogo_url(response_data['logo_url'] ? response_data['logo_url'] : false);
        setLoading(false);
    };

    return (
        !loading && (
            <>
                <div className={classes.container}>
                    <CustomSnackbar
                        open={notification?.message}
                        autoHideDuration={2000}
                        onClose={() =>
                            setNotification({ message: '', severity: 'error', open: false })
                        }
                        severity={notification?.severity}
                        message={notification?.message}
                    />
                    {error && (
                        <Typography className={classes.errortext} variant="h5">
                            {error}
                        </Typography>
                    )}
                    {loginContext.selected_industry === 'Revenue Management' ? (
                        <div className={classes.logo}>
                            <PrismLogo alt="customer logo" />
                        </div>
                    ) : (loginContext.selected_app_id || logo_app_id) && logo_url ? (
                        <div className={classes.logo}>
                            <img src={logo_url} alt="customer logo" />
                        </div>
                    ) : (
                        <div className={classes.logo}>
                            <Nuclios alt="Logo" />
                        </div>
                    )}

                    <SsoLoginForm loginConfig={loginConfig} />
                    {loginConfig.email_password?.is_enabled && (
                        <>
                            {(loginConfig.sso?.is_enabled || loginConfig.saml?.is_enabled) && (
                                <div className={classes.seperator}>Or</div>
                            )}
                            <EmailLoginForm setError={setError} error={error} />
                        </>
                    )}
                </div>
            </>
        )
    );
};

export default withStyles(userLoginStyles)(withRouter(UserLogin));
