import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
    no_screen_msg: {
        color: theme.palette.text.default,
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        top: '50%',
        left: '50%'
    }
}));
export default function FullScreenMessage({ text }) {
    const classes = useStyles();
    return (
        <Typography align="center" variant="h4" className={classes.no_screen_msg}>
            {text}
        </Typography>
    );
}
