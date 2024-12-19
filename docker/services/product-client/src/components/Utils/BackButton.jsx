import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(() => ({
    moduleItem: {
        float: 'left',
        width: '50px',
        borderRadius: '0.5px',
        margin: '20px',
        cursor: 'pointer',
        position: 'relative',
        textAlign: 'center'
    }
}));

export default function BackButton() {
    const classes = useStyles();
    return (
        <Link to={'/platform-utils'}>
            <div className={classes.moduleItem}>
                <ArrowBackIosRoundedIcon fontSize="large"></ArrowBackIosRoundedIcon>
            </div>
        </Link>
    );
}
