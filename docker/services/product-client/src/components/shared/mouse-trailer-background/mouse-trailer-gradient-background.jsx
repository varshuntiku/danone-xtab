import { withStyles } from '@material-ui/core';
import React from 'react';
import mouseTrailerBackgroundStyles from './styles';

const MouseTrailerGradientBackground = ({ classes }) => {
    return <div id="mouse-trailer-gradient-background" className={classes.container}></div>;
};

export default withStyles(mouseTrailerBackgroundStyles, { withTheme: true })(
    MouseTrailerGradientBackground
);

export const updateGradient = (e) => {
    const { currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const container = document.getElementById('mouse-trailer-gradient-background');
    container.style.setProperty('--gradient-x', x + 'px');
    container.style.setProperty('--gradient-y', y + 'px');
};
