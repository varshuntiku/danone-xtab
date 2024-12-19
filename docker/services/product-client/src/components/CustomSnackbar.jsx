import React from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    alpha,
    IconButton,
    makeStyles,
    Slide,
    Snackbar,
    Typography,
    Button
} from '@material-ui/core';
import { CheckCircle, Warning, Error, Info } from '@material-ui/icons';
import clsx from 'clsx';
import CloseIcon from 'assets/Icons/CloseBtn';

const Severity = {
    success: {
        icon: <CheckCircle />,
        bgColor: '#00A582'
    },
    warning: {
        icon: <Warning />,
        bgColor: '#ff9800'
    },
    info: {
        icon: <Info />,
        bgColor: '#a3cfff'
    },
    error: {
        icon: <Error />,
        bgColor: '#ff655a'
    },
    datascout: {
        icon: <CheckCircle />,
        bgColor: false,
        text: true
    },
    default: {
        icon: <Info />,
        bgColor: false
    }
};

const useStyle = makeStyles((theme) => ({
    root: {
        maxWidth: theme.layoutSpacing(500),
        left: 'unset',
        right: theme.layoutSpacing(16),
        minWidth: theme.layoutSpacing(457)
    },
    rootWithSnackbarAction: {
        '& $messageStyle': {
            fontSize: theme.layoutSpacing(14),
            fontWeight: 400,
            lineHeight: theme.layoutSpacing(20)
        },
        '& $boxRoot': {
            padding: theme.layoutSpacing(12, 14)
        },
        '& $closeBtn': {
            position: 'relative',
            left: theme.layoutSpacing(6)
        }
    },
    boxRoot: (props) => ({
        background: props.bgColor || theme.palette.background.paper,
        color: theme.palette.text.white,
        padding: `${theme.layoutSpacing(20)} ${theme.layoutSpacing(28)}`,
        gap: theme.layoutSpacing(24),
        width: '100%'
    }),
    severityIcon: () => ({
        fontSize: theme.layoutSpacing(32),
        color: theme.palette.text.white
    }),
    closeBtn: () => ({
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.2)
        },
        fontSize: '2.5rem',
        '& svg': {
            fill: theme.palette.text.white,
            width: theme.layoutSpacing(16),
            height: theme.layoutSpacing(16)
        },
        padding: theme.layoutSpacing(8)
    }),
    messageStyle: {
        fontSize: '2rem'
    },
    snackbarContentContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        gridGap: theme.layoutSpacing(24),
        alignItems: 'center',
        width: '100%'
    },
    snackbarActionWrapper: {
        alignSelf: 'flex-end'
    },
    actionButton: {
        fontSize: theme.layoutSpacing(14),
        fontWeight: 500,
        lineHeight: theme.layoutSpacing(16),
        letterSpacing: theme.layoutSpacing(1.25),
        textDecoration: 'underline',
        backgroundColor: 'transparent !important',

        color: theme.palette.text.white,

        '& .MuiButton-label': {
            textTransform: 'uppercase'
        },

        '&:hover': {
            color: theme.palette.text.white
        }
    }
}));

function TransitionRight(props) {
    return <Slide {...props} direction="left" />;
}
/**
 * Provides brief customized notifications.
 * @summary It informs user of a process that an app has performed or will perform which appears temporarily and doesn't interrupt the user experience.
 * It is used when we want to alert the user of a process through a custom notification which hides automatically after set duration.
 * @param {object} props -  open, message, onClose, autoHideDuration, TransitionComponent, anchorOrigin, severity, showCloseButton, classNames.
 */
export default function CustomSnackbar({
    open,
    message,
    onClose,
    autoHideDuration,
    TransitionComponent = TransitionRight,
    anchorOrigin = { vertical: 'top', horizontal: 'right' },
    severity = 'default',
    showCloseButton = true,
    classNames,
    actionText,
    onActionClick,
    ...props
}) {
    const variation = Severity[severity];
    const classes = useStyle(variation);
    const severityIcon = React.cloneElement(variation.icon, {
        className: classes.severityIcon
    });
    return (
        <Snackbar
            open={open}
            onClose={onClose}
            autoHideDuration={autoHideDuration}
            anchorOrigin={anchorOrigin}
            className={clsx(
                classes.root,
                classNames?.root,
                actionText ? classes.rootWithSnackbarAction : ''
            )}
            TransitionComponent={TransitionComponent}
        >
            <Box
                height="100%"
                width="100%"
                className={classes.boxRoot}
                display="flex"
                // justifyContent="space-between"
                borderRadius="4px"
                alignItems="center"
                // gridGap={'3rem'}
                padding={'0.8rem 0 0.8rem 2rem'}
                flexDirection="column"
            >
                <div className={classes.snackbarContentContainer} data-testid="snackbar">
                    {severityIcon}
                    {props.link ? (
                        <Link
                            to={props.link}
                            className={classes.anchorLink}
                            style={{ color: 'inherit' }}
                        >
                            <Typography
                                variant="h4"
                                color="inherit"
                                className={classes.messageStyle}
                            >
                                {message}
                            </Typography>
                        </Link>
                    ) : (
                        <Typography variant="h4" color="inherit" className={classes.messageStyle}>
                            {message}
                        </Typography>
                    )}
                    <div style={{ flex: 1 }} />
                    {showCloseButton ? (
                        <IconButton className={classes.closeBtn} size="small" onClick={onClose}>
                            <CloseIcon fontSize="inherit" aria-label="close-snackbar" />
                        </IconButton>
                    ) : (
                        <React.Fragment />
                    )}
                </div>

                {actionText ? (
                    <div className={classes.snackbarActionWrapper}>
                        <Button
                            variant="text"
                            className={classes.actionButton}
                            onClick={onActionClick}
                        >
                            {actionText}
                        </Button>
                    </div>
                ) : null}
            </Box>
        </Snackbar>
    );
}
