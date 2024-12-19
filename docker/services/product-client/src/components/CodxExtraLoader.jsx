import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { darken } from '@material-ui/core';
import { ReactComponent as Loader } from 'assets/img/codx-circular-loader.svg';

const useStyles = makeStyles((theme) => ({
    loader: {
        fill: darken(theme.palette.primary.contrastText, 0.1),
        zIndex: 1
    },
    center: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    loaderText: {
        color: theme.palette.text.default,
        fontSize: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));
export default function CodxExtraLoader({ params, ...props }) {
    const classes = useStyles();

    return (
        <div className={clsx(classes.loader, { [classes.center]: params?.center })}>
            <Loader height={params?.size} width={params?.size} {...props} />
            {params?.loaderText && (
                <p
                    className={classes.loaderText}
                    style={{ fontSize: params?.loaderTextSize ? params?.loaderTextSize : '' }}
                >
                    {params?.loaderText}
                </p>
            )}
        </div>
    );
}
