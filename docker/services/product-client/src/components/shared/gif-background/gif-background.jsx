import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(() => ({
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        '& img': {
            width: '100%',
            objectFit: 'center'
        }
    }
}));

const GifBackground = () => {
    const classes = useStyles();
    return (
        <div className={classes.backgroundContainer}>
            <img src="https://media.tenor.com/lCz7qXcoTSMAAAAC/data-world-circle.gif" alt="" />
        </div>
    );
};

export default GifBackground;
