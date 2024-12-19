import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    makeStyles,
    Typography
} from '@material-ui/core';
import React, { useState } from 'react';
import LibraryBooksOutlinedIcon from '@material-ui/icons/LibraryBooksOutlined';
import { Close } from '@material-ui/icons';
import clsx from 'clsx';

const useStyle = makeStyles((theme) => ({
    fontDefaultColor: {
        color: theme.palette.text.default
    },
    fontTitle: {
        fontSize: '2.5rem'
    },
    fontContent: {
        fontSize: '1.6rem'
    },
    noLayout: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '500px',
        textAlign: 'center',
        gap: '1rem'
    },
    avator: {
        color: theme.palette.text.default,
        backgroundColor: theme.palette.primary.main,
        width: '15rem',
        height: '15rem',
        '& svg': {
            fontSize: '7rem'
        }
    },
    dialogContent: {
        minHeight: '100px'
    }
}));

export default function AppWidgetPreLoader({ params, onAction }) {
    const data = params.preLoader;
    const [open, setOpen] = useState(false);
    // const [notification, setNotification] = useState({});
    // const [notificationOpen, setNotificationOpen] = useState(false);
    const classes = useStyle();

    const handleActions = (el) => {
        const { isCancel, closePopup } = el;
        onAction(el);
        if (isCancel || closePopup) {
            setOpen(false);
        }
    };

    if (data.type === 'popup-confirmation') {
        return (
            <Box>
                <Box className={classes.noLayout} position="absolute">
                    <Avatar className={classes.avator}>
                        <LibraryBooksOutlinedIcon />
                    </Avatar>
                    <Typography variant="h4" className={classes.fontDefaultColor}>
                        {data.message}
                    </Typography>
                    <Button
                        variant={data.triggerButton?.variant || 'outlined'}
                        onClick={setOpen.bind(null, true)}
                        aria-label={data.triggerButton?.name || 'trigger button'}
                    >
                        {data.triggerButton?.name}
                    </Button>
                </Box>
                <Dialog
                    open={open}
                    fullWidth
                    maxWidth={data.modalSize || 'sm'}
                    aria-labelledby={data.popup?.header || 'preloader-dialog-title'}
                    aria-describedby="preloader-dialog-content"
                >
                    <DialogTitle
                        className={clsx(classes.fontDefaultColor, classes.fontTitle)}
                        disableTypography
                        id={data.popup?.header || 'preloader-dialog-title'}
                    >
                        {data.popup?.header}
                        {data.popup?.closeButton ? (
                            <IconButton
                                title="Close"
                                onClick={setOpen.bind(null, false)}
                                style={{ position: 'absolute', top: '4px', right: 0 }}
                                aria-label="Close"
                            >
                                <Close fontSize="large" />
                            </IconButton>
                        ) : null}
                    </DialogTitle>
                    <DialogContent className={classes.dialogContent} id="preloader-dialog-content">
                        <DialogContentText
                            className={clsx(classes.fontDefaultColor, classes.fontContent)}
                        >
                            {data.popup?.content}
                        </DialogContentText>
                        <Box display="flex" justifyContent="center" gridGap="1rem" flexWrap="wrap">
                            {data.popup?.contentActions?.map((el, i) => (
                                <Button
                                    key={i}
                                    variant={el?.variant || 'outlined'}
                                    onClick={handleActions.bind(null, el)}
                                    aria-label={el?.text || el?.name}
                                >
                                    {el?.text || el?.name}
                                </Button>
                            ))}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        {data.popup?.actions?.map((el, i) => (
                            <Button
                                key={i}
                                variant={el?.variant || 'outlined'}
                                onClick={handleActions.bind(null, el)}
                                aria-label={el?.text || el?.name}
                            >
                                {el?.text || el?.name}
                            </Button>
                        ))}
                    </DialogActions>
                </Dialog>
            </Box>
        );
    } else {
        return null;
    }
}
