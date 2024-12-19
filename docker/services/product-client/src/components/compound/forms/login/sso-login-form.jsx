import React, { useContext } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import LoginContext from 'context/login-context';
import loginStyle from './styles';
import { AuthContext } from 'auth/AuthContext';

const useStyles = makeStyles(loginStyle);

const SsoLoginForm = () => {
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

    return (
        <React.Fragment>
            <Button
                variant="contained"
                id="loginMicrosoft"
                fullWidth
                onClick={loginWithSSO}
                classes={{
                    root: classes.ssoButton
                }}
                aria-label="Login with Microsoft"
            >
                Login with Microsoft
            </Button>
        </React.Fragment>
    );
};

export default SsoLoginForm;
