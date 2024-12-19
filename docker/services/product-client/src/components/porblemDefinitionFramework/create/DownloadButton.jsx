import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    makeStyles,
    Typography
} from '@material-ui/core';
import React from 'react';
import { useState } from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import clsx from 'clsx';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    dialogRoot: {
        minWidth: '300px',
        background: theme.palette.primary.light
    },
    titleRoot: {
        background: theme.palette.primary.dark
    },
    colorContrast: {
        color: theme.palette.primary.contrastText
    },
    colorDefault: {
        color: theme.palette.text.default
    },
    letterSpacing1: {
        letterSpacing: '0.02em'
    },
    fontSize1: {
        fontSize: '2rem'
    },
    fontSize2: {
        fontSize: '1.6rem'
    },
    closeButton: {
        cursor: 'pointer',
        float: 'right',
        position: 'relative',
        top: '0.5rem'
    },
    downloadButton: {
        '&.Mui-disabled svg': {
            opacity: 0.4,
            color: theme.palette.grey[500]
        }
    }
}));

export default function DownloadButton({ disabled, onDownload }) {
    const classes = useStyles();
    const [open, setOpen] = useState();
    const handleDone = () => {
        setOpen(false);
        onDownload();
    };
    return (
        <>
            <IconButton
                disabled={disabled}
                className={classes.downloadButton}
                onClick={() => setOpen(true)}
                size="small"
                aria-label="Download"
            >
                <GetAppIcon fontSize="large" />
            </IconButton>
            <Dialog
                open={open}
                classes={{
                    paper: classes.dialogRoot
                }}
                aria-labelledby="download-as"
                aria-describedby="download-content"
            >
                <DialogTitle disableTypography className={classes.titleRoot} id="download-as">
                    <Typography
                        variant="body1"
                        className={clsx(classes.title, classes.colorDefault, classes.fontSize1)}
                    >
                        Download As
                        <CloseIcon
                            fontSize="large"
                            aria-label="close"
                            className={classes.closeButton}
                            onClick={() => setOpen(false)}
                        />
                    </Typography>
                </DialogTitle>
                <DialogContent id="download-content">
                    <Typography
                        variant="body1"
                        className={clsx(classes.colorDefault, classes.fontSize2)}
                    >
                        Centralised Frameworks
                    </Typography>
                    <br />
                    <br />
                    <br />
                    <Typography
                        variant="body1"
                        className={clsx(classes.colorDefault, classes.fontSize2)}
                    >
                        Download as PPT
                    </Typography>
                    <hr style={{ opacity: 0.4 }} />
                    <br />
                    <br />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setOpen(false)}
                        aria-label="Cancel"
                    >
                        Cancel
                    </Button>
                    <Button variant="contained" size="small" onClick={handleDone} aria-label="Done">
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
