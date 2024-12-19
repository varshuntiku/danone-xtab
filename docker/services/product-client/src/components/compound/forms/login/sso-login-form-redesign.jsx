import React, { useContext } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import LoginContext from 'context/login-context';
import loginStyle from './styles-redesign';
import { AuthContext } from 'auth/AuthContext';
import { loginSAML } from 'services/auth';

const useStyles = makeStyles(loginStyle);

const SsoLoginForm = ({ loginConfig }) => {
    const loginContext = useContext(LoginContext);
    const authContext = useContext(AuthContext);
    const classes = useStyles({
        isDark: localStorage.getItem('codx-products-theme') === 'dark'
    });

    const loginWithSSO = async () => {
        localStorage.setItem('industry', loginContext.selected_industry);
        let response = await authContext.login();
        if (response == 'SUCCESS') {
            loginContext.onLogin();
            sessionStorage.setItem('last_app_id', '');
        }
    };

    const loginWithSAMLSSO = () => {
        loginSAML({
            callback: (resp) => window.open(resp.url, '_parent')
        });
    };

    return (
        <React.Fragment>
            {loginConfig.sso?.is_enabled && (
                <Button
                    id="login"
                    variant="contained"
                    fullWidth
                    onClick={loginWithSSO}
                    classes={{
                        root: classes.ssoButton
                    }}
                    aria-label="SSO Login"
                >
                    {loginConfig.sso.config_data?.display_name
                        ? loginConfig.sso.config_data?.display_name
                        : 'SSO Login'}
                </Button>
            )}
            {loginConfig.saml?.is_enabled && (
                <Button
                    id="login"
                    variant="contained"
                    fullWidth
                    onClick={loginWithSAMLSSO}
                    classes={{
                        root: classes.ssoButton
                    }}
                    aria-label="SAML Login"
                >
                    {loginConfig.saml.config_data?.display_name
                        ? loginConfig.saml.config_data?.display_name
                        : 'SAML Login'}
                </Button>
            )}
        </React.Fragment>
    );
};

export default SsoLoginForm;
