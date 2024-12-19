import { withStyles } from '@material-ui/core';
import React from 'react';
import glowAroundAnimationStyles from './styles';

const GlowAroundAnimation = ({ classes }) => {
    return (
        <svg className={classes.glowAround}>
            <rect pathLength={100} className={classes.glowAround__blur}></rect>
            <rect pathLength={100} className={classes.glowAround__line}></rect>
        </svg>
    );
};

export default withStyles(glowAroundAnimationStyles, { withTheme: true })(GlowAroundAnimation);
