import React, { useEffect, useState } from 'react';
import LoginLayout from 'layouts/login/login-layout';
import LoginContext from 'context/login-context';
// import UserLogin from 'components/compound/user-login/user-login';
import AuthLoader from 'components/shared/auth-loader/auth-loader';
import UserLogin from 'components/compound/user-login/user-login-redesign';
import { makeStyles } from '@material-ui/core/styles';
import background from 'assets/img/login_bg.svg';
import darkBackground from 'assets/img/dark_login_bg.png';
import { CssBaseline } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    loginContainer: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 10,
        backgroundColor:
            localStorage.getItem('codx-products-theme') === 'dark' ? '#0E0617' : 'none',
        '&:before': {
            ...(localStorage.getItem('codx-products-theme') !== 'dark'
                ? { backgroundImage: `url(${background})` }
                : {
                      backgroundImage: `url(${darkBackground})`
                  }),
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            content: '" "',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: -10,
            animation:
                localStorage.getItem('codx-products-theme') === 'dark'
                    ? '$darkBackgroundAnimate 4000ms ease-in-out infinite'
                    : '$backgroundAnimate 5400ms ease infinite',
            animationDelay:
                localStorage.getItem('codx-products-theme') === 'dark' ? '5400ms' : '200ms'
        }
    },
    '@keyframes backgroundAnimate': {
        '25%': {
            opacity: 0.6
        },
        '50%': {
            opacity: 0.3
        },
        '75%': {
            opacity: 0.3
        },
        '95%': {
            opacity: 0.6
        },
        '100%': {
            opacity: 1
        }
    },
    '@keyframes darkBackgroundAnimate': {
        '25%': {
            opacity: 1
        },
        '50%': {
            opacity: 0.8
        },
        '75%': {
            opacity: 0.5
        },
        '100%': {
            opacity: 0.3
        }
    }
}));

const LoginPage = (props) => {
    const loadState = props?.parent_obj?.state?.loading;

    const [loading, setLoading] = useState(loadState);
    const classes = useStyles();

    useEffect(() => {
        setLoading(loadState);
    }, [loadState]);

    const value = {
        selected_industry: props?.match?.params?.industry || false,
        selected_app_id: props?.match?.params?.app_id || false,
        onLogin: props?.parent_obj?.onLogin,
        logout: props?.logout
    };

    if (
        props?.location?.pathname?.startsWith('/app/') &&
        !isNaN(parseInt(props.location.pathname.slice(5)))
    ) {
        const location = props.location.pathname;
        const appID = location.split('/')[2];
        if (/^\d+$/.test(appID)) {
            value['selected_app_id'] = appID;
        }
    }

    return (
        <div className={classes.loginContainer}>
            <CssBaseline />
            <LoginContext.Provider value={value}>
                <LoginLayout>{!loading ? <UserLogin /> : <AuthLoader />}</LoginLayout>
            </LoginContext.Provider>
        </div>
    );
};

export default LoginPage;
