import React from 'react';
import { Typography } from '@material-ui/core';
import { darken } from '@material-ui/core';
import { ReactComponent as RosaryLoader } from 'assets/img/codx_loader_rosary.svg';

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        display: 'flex',
        justifyContent: 'center',
        height: '80vh',
        alignItems: 'center'
    },
    fontSize2: {
        fontSize: '2rem',
        marginRight: '0.5rem',
        marginBottom: '0.4rem',
        color: theme.palette.text.default
    },
    loader: {
        fill: darken(theme.palette.text.default, 0.1),
        zIndex: 1
    }
}));

function CustomLoadMask({ size = 20, loadMaskMsg = 'Loading...', ...props }) {
    const classes = useStyles();
    const classNames = props.className
        ? clsx(classes.mainContainer, props.className)
        : classes.mainContainer;
    return (
        <div className={classNames}>
            <Typography variant="subtitle2" className={classes.fontSize2}>
                {loadMaskMsg}
            </Typography>
            <RosaryLoader height={size} width={size} {...props} className={classes.loader} />
        </div>
    );
}

export default CustomLoadMask;
