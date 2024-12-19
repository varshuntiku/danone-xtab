import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    makeStyles,
    Typography
} from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    dialog: {
        border: `1px solid ${theme.palette.primary.contrastText}`
    },
    content: {
        color: theme.palette.text.default
    },
    title: {
        background: theme.palette.background.dialogTitle,
        color: theme.palette.text.default
    },
    button: {
        background: theme.palette.primary.contrastText,
        padding: `${theme.spacing(0.5)} ${theme.spacing(7)}`
    }
}));

export const CustomDialog = ({ isOpen, handleClose, title, subtitle, children }) => {
    const classes = useStyles();
    return (
        <>
            <Dialog
                PaperProps={{
                    className: classes.dialog
                }}
                fullWidth
                maxWidth="xs"
                open={isOpen}
                arai-labelledby="max-width-dialog-title"
                aria-describedby="custom-dialog-content"
            >
                <DialogTitle className={classes.title} id="max-width-dialog-title">
                    <Typography variant="h4">{title}</Typography>
                </DialogTitle>
                <DialogContent id="custom-dialog-content">
                    <DialogContentText className={classes.content} variant="h5">
                        {subtitle}
                    </DialogContentText>
                    {children}
                </DialogContent>
                <DialogActions>
                    <Button
                        className={classes.button}
                        onClick={handleClose}
                        variant="contained"
                        aria-label="Close"
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
CustomDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    children: PropTypes.element.isRequired
};
