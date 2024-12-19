import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DynamicForm from './dynamic-form';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import CustomButton from './inputFields/customButton';

const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content'
    },
    formControl: {
        marginTop: theme.spacing(2),
        minWidth: 120
    },
    formControlLabel: {
        marginTop: theme.spacing(1)
    },
    dialogWrapper: {
        '& .MuiDialogContent-root': {
            // background: theme.palette.primary.main,
        }
    },
    root: {
        margin: 0,
        padding: theme.spacing(2),
        '& .MuiTypography-caption': {
            fontSize: '1.75rem'
        }
    },
    title: {
        fontSize: theme.spacing(3.5),
        letterSpacing: '1.5px',
        color: theme.palette.text.titleText,
        opacity: '0.8'
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    },
    button: {
        borderRadius: theme.spacing(1.875),
        fontSize: theme.spacing(2.5),
        lineHeight: theme.spacing(2),
        textTransform: 'none',
        fontWeight: '500'
    }
}));

const DialogTitle = (props) => {
    const classes = useStyles();
    const { children, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6" className={classes.title}>
                {children}
            </Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
};

export default function FormDialog() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <React.Fragment>
            <Button color="primary" onClick={handleClickOpen} aria-label="Open Form">
                Open Form
            </Button>
            <Dialog
                className={classes.dialogWrapper}
                fullWidth={true}
                maxWidth={'md'}
                open={open}
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                aria-describedby="dynamic-form-content"
            >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Upload Document
                </DialogTitle>
                <DialogContent id="dynamic-form-content">
                    <DynamicForm />
                </DialogContent>
                <DialogActions>
                    <CustomButton
                        onClickFunction={handleClose}
                        classes={classes}
                        field_info={{
                            variant: 'outlined',
                            size: 'large',
                            disabled: '',
                            component: 'span'
                        }}
                        buttonName={'Cancel'}
                    />
                    <CustomButton
                        onClickFunction={handleClose}
                        classes={classes}
                        field_info={{
                            variant: 'contained',
                            size: 'large',
                            disabled: '',
                            component: 'span'
                        }}
                        buttonName={'Upload'}
                    />
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
