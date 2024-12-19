import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import glowingButtonStyles from './styles';

const useStyles = makeStyles(glowingButtonStyles);

const GlowingButton = ({ text, loginButtonDisabled, ...props }) => {
    const classes = useStyles({
        isDark: localStorage.getItem('codx-products-theme') === 'dark'
    });
    return (
        <Button
            variant="contained"
            id="loginEmail"
            fullWidth
            disabled={loginButtonDisabled}
            className={classes.loginButtonEmail}
            classes={{
                root: !loginButtonDisabled && classes.loginButtonEmailRoot
            }}
            {...props}
            aria-label={text}
        >
            {text}
        </Button>
    );
};

export default GlowingButton;
