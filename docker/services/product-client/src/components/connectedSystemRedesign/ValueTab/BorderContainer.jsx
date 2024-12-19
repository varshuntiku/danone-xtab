import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    border: {
        position: 'relative'
        // height: '100%'
    },
    borderLeft: {
        borderLeft: '1px solid ' + theme.palette.separator.grey
    },
    borderRight: {
        borderRight: '1px solid ' + theme.palette.separator.grey
    },
    borderTop: {
        borderTop: '1px solid ' + theme.palette.separator.grey
    },
    borderBottom: {
        borderBottom: '1px solid ' + theme.palette.separator.grey
    },
    corner: {
        width: '10px',
        aspectRatio: 1,
        borderRadius: '50%',
        background: theme.palette.primary.dark,
        position: 'absolute'
    },
    cornerLeft: {
        left: -5
    },
    cornerRight: {
        right: -5
    },
    cornerTop: {
        top: -5
    },
    cornerBottom: {
        bottom: -5
    }
}));

const BorderContainer = ({
    children,
    left,
    right,
    top,
    bottom,
    classesProp,
    stylesProp,
    hideleftTop = false,
    hideleftBottom = false,
    hideRightTop = false,
    hideRightBottom = false
}) => {
    const classes = useStyles();

    return (
        <div
            className={`${classes.border} ${left && classes.borderLeft}  ${
                right && classes.borderRight
            }  ${top && classes.borderTop}  ${bottom && classes.borderBottom} ${classesProp}`}
            style={{ ...stylesProp }}
        >
            {hideleftTop ? null : (
                <div
                    className={`${classes.corner} ${classes.cornerLeft} ${classes.cornerTop}`}
                ></div>
            )}
            {hideleftBottom ? null : (
                <div
                    className={`${classes.corner} ${classes.cornerLeft} ${classes.cornerBottom}`}
                ></div>
            )}
            {hideRightTop ? null : (
                <div
                    className={`${classes.corner} ${classes.cornerRight} ${classes.cornerTop}`}
                ></div>
            )}
            {hideRightBottom ? null : (
                <div
                    className={`${classes.corner} ${classes.cornerRight} ${classes.cornerBottom}`}
                ></div>
            )}
            {children}
        </div>
    );
};

export default BorderContainer;
