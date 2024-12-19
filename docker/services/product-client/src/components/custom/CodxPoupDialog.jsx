import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '../../assets/Icons/CloseBtn';
import Typography from '@material-ui/core/Typography';
import { DialogContent, DialogActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import DialogContentText from '@material-ui/core/DialogContentText';

const styles = makeStyles((theme) => ({
    '@keyframes zoominoutsinglefeatured': {
        '0%': {
            transform: 'scale(0.5,0.5)'
        },
        '100%': {
            transform: 'scale(1,1)'
        }
    },

    dialogBackdrop: {
        animation: `$zoominoutsinglefeatured 0.8s forwards `,
        '& .MuiBackdrop-root': {
            backgroundColor: 'unset'
        }
    },
    root: {
        margin: 0,
        backgroundColor: theme.palette.background.table
    },
    dialogContent: {
        border: '1px solid' + theme.palette.primary.contrastText,
        borderBottom: 'none',
        borderTop: 'none'
    },
    dialogActions: {
        color: theme.palette.background.table,
        border: '1px solid' + theme.palette.primary.contrastText,
        borderBottomLeftRadius: 'inherit',
        borderBottomRightRadius: 'inherit',
        alignContent: 'center',
        justifyContent: 'center'
    }
}));

const DialogTitle = (props) => {
    const classes = props.classes || styles();
    const classNames = props.styles;
    const { children, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6" className={classNames.dialogTitle}>
                {children}
            </Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classNames.closeButton} onClick={onClose}>
                    <CloseIcon className={classNames.closeIcon} fontSize="large" />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
};

export default function CodxPopupDialog(props) {
    const {
        open,
        setOpen,
        dialogTitle,
        dialogContent,
        dialogActions,
        maxWidth,
        dialogClasses,
        onClose,
        sectionDivider,
        property,
        snackbar
    } = props;
    const classes = dialogClasses || styles();

    const handleClose = (reason = '') => {
        if (reason === 'backdropClick') {
            return;
        }

        if (property) {
            setOpen({
                ...open,
                [property]: false
            });
        } else {
            setOpen(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => handleClose(props.reason)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth={maxWidth}
            classes={{ paper: classes.dialogPaper }}
        >
            {dialogTitle && (
                <DialogTitle
                    id="alert-dialog-title"
                    classes={{ root: classes.dialogRoot }}
                    styles={{
                        dialogTitle: classes.dialogTitle,
                        closeButton: classes.closeButton,
                        closeIcon: classes.closeIcon
                    }}
                    onClose={onClose}
                >
                    {dialogTitle}
                </DialogTitle>
            )}
            {dialogContent && (
                <DialogContent className={classes.dialogContentSection} dividers={sectionDivider}>
                    <DialogContentText
                        id="alert-dialog-description"
                        className={classes.dialogContent}
                    >
                        {dialogContent}
                    </DialogContentText>
                </DialogContent>
            )}
            {dialogActions && (
                <DialogActions className={classes.dialogActionSection}>
                    {dialogActions}
                </DialogActions>
            )}
            {snackbar && snackbar}
        </Dialog>
    );
}
