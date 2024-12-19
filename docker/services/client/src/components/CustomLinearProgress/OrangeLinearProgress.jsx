import React from 'react';
// import { darken } from '@material-ui/core';
import { ReactComponent as RosaryLoader } from 'assets/img/codx_loader_rosary.svg';
import withStyles from "@material-ui/core/styles/withStyles";
import LoaderStyles from '../CodxCircularLoader/CodxCircularLoadetStyles'

function CodxCircularLoader({ center, size = 60, ...props }) {
    const {classes} = props;
    return (
        <RosaryLoader
            height={size}
            width={size}
            {...props}
            className={classes.loader}
        />
    );
}

export default withStyles(LoaderStyles)(CodxCircularLoader);
