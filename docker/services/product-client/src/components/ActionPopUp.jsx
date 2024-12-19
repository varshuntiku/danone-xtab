import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    popup: {
        position: 'absolute',
        bottom: '101%',
        left: '70%',
        transform: 'translateX(-50%)',
        background: theme.palette.background.dataStoryBar,
        padding: '0.75rem',
        borderRadius: '8px',
        boxShadow: '0px 6px 16px 0px rgba(0, 0, 0, 0.2)',
        zIndex: 10001,
        width: 'max-content',
        cursor: 'pointer'
    }
}));

const Popup = ({ children }) => {
    const classes = useStyles();

    return <div className={classes.popup}>{children}</div>;
};

export default Popup;
