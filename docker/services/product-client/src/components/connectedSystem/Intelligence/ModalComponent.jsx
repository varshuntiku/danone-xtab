import React from 'react';
import { Dialog, DialogTitle, IconButton, DialogContent } from '@material-ui/core';
import CloseIcon from '../../../assets/Icons/CloseBtn';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import connSysModelComponentStyle from 'assets/jss/connSysModelComponentStyle.jsx';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import clsx from 'clsx';
const useStyles = makeStyles((theme) => ({
    ...connSysModelComponentStyle(theme)
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
    modalStakeHolder,
    sepratorClassName = ''
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
            {sepratorClassName ? <hr className={sepratorClassName} /> : null}
            <DialogContent className={dialogContentClassName || classes.dailogContent}>
                <IconButton
                    title="Close"
                    onClick={closeDailog}
                    className={dialogCloseButtonClassName || classes.dialogCloseIcon}
                >
                    <CloseIcon fontSize="large" />
                </IconButton>
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default ModalComponent;
