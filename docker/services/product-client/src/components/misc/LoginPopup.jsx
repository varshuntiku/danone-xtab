import { Dialog, DialogContent, DialogTitle, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setRefreshTokenExpired } from 'store/index';

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
        height: '100vh',
        background: theme.palette.primary.dark
    },
    popupContent: {
        padding: theme.spacing(5, 2),
        fontSize: theme.spacing(2),
        color: theme.palette.text.default,
        textAlign: 'center'
    },
    redirectButton: {
        color: theme.palette.text.default,
        fontWeight: 'bold',
        textDecoration: 'underline'
    }
}));

const LoginPopup = () => {
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(setRefreshTokenExpired('to login'));
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className={classes.container}>
            <Dialog
                open={true}
                aria-labelledby="login-session-expired"
                aria-describedby="redirect-to-login"
            >
                <DialogTitle className={classes.popuppHeader} id="login-session-expired">
                    Session Expired
                </DialogTitle>
                <DialogContent className={classes.popupContent} id="redirect-to-login">
                    {`Your session has expired. You will be redirected to the login page.`}
                    <br />
                    {`If not
                    automatically redirected click `}
                    <a
                        className={classes.redirectButton}
                        href="#"
                        onClick={() => dispatch(setRefreshTokenExpired('to login'))}
                    >
                        here.
                    </a>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LoginPopup;
