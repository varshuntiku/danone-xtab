import React from 'react';
import { Dialog, DialogTitle, IconButton, DialogContent } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import connSysRedesignModelComponentStyle from 'assets/jss/connSysRedesignModelCompStyle.jsx';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import clsx from 'clsx';
const useStyles = makeStyles((theme) => ({
    ...connSysRedesignModelComponentStyle(theme)
}));

const ModalComponent = ({
    title = '',
    children,
    openDialogue,
    setOpenDialogue,
    maxWidth,
    fullScreen = false,
    dialogTitleClassName,
    dialogContentClassName,
    dialogCloseButtonClassName,
    modalStakeHolder
}) => {
    const classes = useStyles();
    const theme = useTheme();

    let defaultMaxWidth = 'md';
    const lgScreen = useMediaQuery(theme.breakpoints.up('xl'));
    defaultMaxWidth = !lgScreen ? 'md' : 'lg';

    const closeDailog = () => {
        setOpenDialogue(false);
    };

    return (
        <Dialog
            open={openDialogue}
            maxWidth={maxWidth || defaultMaxWidth}
            fullScreen={fullScreen}
            onClose={closeDailog}
            className={clsx(
                classes.dialogWrapper,
                modalStakeHolder ? classes.dialogWrapperForModal : 'none'
            )}
            aria-labelledby={title}
        >
            <DialogTitle className={dialogTitleClassName || classes.dialogTitle} id={title}>
                {title}
            </DialogTitle>
            <DialogContent className={dialogContentClassName || classes.dailogContent}>
                <IconButton
                    title="Close"
                    onClick={closeDailog}
                    className={dialogCloseButtonClassName || classes.dialogCloseIcon}
                >
                    <Close fontSize="large" />
                </IconButton>
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default ModalComponent;
