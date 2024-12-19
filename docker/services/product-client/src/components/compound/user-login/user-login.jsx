import React, { useContext, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core';
import { getAppLogo } from 'services/app';
import EmailLoginForm from '../forms/login/email-login-form';
import SsoLoginForm from '../forms/login/sso-login-form';
import { ReactComponent as PrismLogo } from 'assets/img/prism_white_logo.svg';
import userLoginStyles from './styles';
import LoginContext from 'context/login-context';
import GlowAroundAnimation from 'components/shared/glow-around/glow-around-animation';
import MouseTrailerGradientBackground, {
    updateGradient
} from 'components/shared/mouse-trailer-background/mouse-trailer-gradient-background';
import { PublicAuthConnector } from 'auth/AuthContext';
import { stopAutoRefreshAccessToken } from 'services/auth';
import Nuclios from 'components/Nuclios/assets/Nuclios';

const UserLogin = ({ classes }) => {
    const loginContext = useContext(LoginContext);
    // eslint-disable-next-line no-unused-vars
    const [logo_classname, setLogo_classname] = useState(false);
    const [logo_url, setLogo_url] = useState(false);
    const [loading, setLoading] = useState(true);
    const logo_app_id = sessionStorage.getItem('last_app_id');

    useEffect(() => {
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
    }, []);

    const onResponseGetApp = (response_data) => {
        setLogo_classname(response_data['logo_url'] ? classes.customerLogoBig : classes.logo);
        setLogo_url(response_data['logo_url'] ? response_data['logo_url'] : false);
        setLoading(false);
    };

    return (
        !loading && (
            <>
                <div className={classes.container} onMouseMove={updateGradient}>
                    {loginContext.selected_industry === 'Revenue Management' ? (
                        <PrismLogo alt="customer logo" />
                    ) : (loginContext.selected_app_id || logo_app_id) && logo_url ? (
                        <img src={logo_url} alt="customer logo" />
                    ) : (
                        <Nuclios alt="Logo" />
                    )}

                    <SsoLoginForm />
                    <div className={classes.seperator}>Or Login with Email</div>
                    <EmailLoginForm />
                    <GlowAroundAnimation />
                    <MouseTrailerGradientBackground />
                </div>
            </>
        )
    );
};

export default withStyles(userLoginStyles)(UserLogin);
