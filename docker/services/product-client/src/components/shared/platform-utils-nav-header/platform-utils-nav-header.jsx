import { makeStyles } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    navigation1: {
        display: 'flex',
        position: 'relative',
        padding: theme.spacing(2) + ' ' + theme.spacing(4),
        paddingTop: '0.8rem',
        borderBottom: '1px solid ' + theme.IndustryDashboard.border.light,
        '& svg': {
            fontSize: theme.spacing(2.5)
        }
    },
    navigation2: {
        display: 'flex',
        position: 'relative',
        padding: '0.5rem',
        borderBottom: '1px solid ' + theme.IndustryDashboard.border.light,
        '& svg': {
            fontSize: theme.spacing(2.5)
        }
    },
    navigation3: {
        display: 'flex',
        position: 'relative',
        padding: theme.spacing(2) + ' ' + theme.spacing(4),
        paddingTop: '0.8rem',
        borderBottom: '1px solid ' + theme.IndustryDashboard.border.light,
        '& svg': {
            fontSize: theme.spacing(2.5)
        }
    },
    navigationLink: {
        display: 'flex',
        position: 'absolute',
        height: '100%',
        top: 0,
        left: theme.spacing(4),
        color: theme.palette.text.revamp,
        fontFamily: theme.body.B5.fontFamily,
        fontSize: theme.layoutSpacing(18),
        textDecoration: 'none',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: theme.layoutSpacing(36),
        alignItems: 'center',
        '& svg': {
            color: theme.palette.text.revamp,
            fontSize: theme.spacing(2.5),
            marginRight: '1rem',
            marginBottom: '0.2rem'
        }
    },
    title: {
        margin: 'auto',
        color: theme.palette.text.revamp,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(24),
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: 'normal',
        letterSpacing: '1px',
        marginBottom: '0.3rem'
    },
    title1: {
        width: '100%'
    },
    backTitle: {
        marginBottom: '0.3rem'
    },
    actionsContainer: {
        position: 'absolute',
        top: theme.layoutSpacing(-3.8),
        right: theme.spacing(4),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing(2),
        height: '100%',
        '& svg': {
            fill: theme.palette.text.btnTextColor
        }
    }
}));

const UtilsNavigation = (props) => {
    const classes = useStyles();
    const { isDsWorkbench } = props;
    return (
        <div
            className={
                props?.children
                    ? classes.navigation2
                    : isDsWorkbench
                    ? classes.navigation3
                    : classes.navigation1
            }
        >
            {!isDsWorkbench && (
                <Link
                    className={classes.navigationLink}
                    to={props?.path}
                    title={'Back To ' + props?.backTo}
                >
                    <ArrowBackIosRoundedIcon />
                    <div className={classes.backTitle}>
                        {props?.backTo && 'Back to ' + props?.backTo}
                    </div>
                </Link>
            )}

            {props?.children ? (
                <div className={classes.title}>{props?.children}</div>
            ) : (
                <div
                    className={isDsWorkbench ? clsx(classes.title, classes.title1) : classes.title}
                >
                    {props?.title}
                </div>
            )}
            <div className={classes.actionsContainer}>{props?.actionButtons}</div>
        </div>
    );
};

export default UtilsNavigation;
