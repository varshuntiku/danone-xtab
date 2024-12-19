import React from 'react';
import { Typography, withStyles } from '@material-ui/core';
import animatedHeaderStyles from './styles';

const AnimatedHeader = ({ classes }) => {
    return (
        <Typography variant="h1" className={classes.header}>
            <span className={classes.header__fixedText}>Translating Data Into</span>
            <div className={classes.header__dynamicContainer}>
                <ul className={classes.header__dynamicText}>
                    <li>Solutions</li>
                    <li>Insights</li>
                    <li>Applications</li>
                    <li>Outcomes</li>
                </ul>
            </div>
        </Typography>
    );
};

export default withStyles(animatedHeaderStyles, { withTheme: true })(AnimatedHeader);
