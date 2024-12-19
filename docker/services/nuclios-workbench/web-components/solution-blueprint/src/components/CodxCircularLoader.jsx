import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { darken } from '@material-ui/core';
import { ReactComponent as RosaryLoader } from 'src/assets/img/codx_loader_rosary.svg';

const useStyles = makeStyles((theme) => ({
    loader: {
        fill: darken(theme.palette.text.default, 0.1),
        zIndex: 1
    },
    center: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }
}));
export default function CodxCircularLoader({ center, size = 60, ...props }) {
    const classes = useStyles();

    return (
        <RosaryLoader
            height={size}
            width={size}
            {...props}
            data-testid="spinner"
            className={clsx(classes.loader, { [classes.center]: center })}
        />
    );

    // return <CircularLoader height={height} width={width} className={clsx(classes.loader, {[classes.center]: center})} {...props} />
}
