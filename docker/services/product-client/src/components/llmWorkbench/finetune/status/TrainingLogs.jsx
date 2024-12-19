import React from 'react';
import { Box, Dialog, DialogContent, Divider, IconButton, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import Typography from 'components/elements/typography/typography';

const useStyles = makeStyles((theme) => ({
    text: {
        textTransform: 'none!important',
        color: theme.palette.primary.contrastText
    },
    dialog: {
        margin: 'auto',
        maxWidth: '75%'
    },
    dialogContent: {
        height: '75vh',
        maxHeight: '75vh',
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
        paddingBottom: theme.spacing(4)
    },
    code: {
        flex: 1,
        whiteSpace: 'pre-wrap',
        '&::before': {
            counterReset: 'listing'
        },
        '& code': {
            fontSize: theme.spacing(2),
            color: theme.palette.text.contrastText,
            counterIncrement: 'listing',
            textAlign: 'left',
            float: 'left',
            clear: 'left',
            padding: `${theme.spacing(1)}`,
            '&::before': {
                content: 'counter(listing) ". "',
                display: 'inline-block',
                float: 'left',
                height: theme.spacing(4),
                paddingLeft: 'auto',
                marginLeft: 'auto',
                textAlign: 'right'
            }
        }
    }
}));

const TrainingLogs = ({ logs = [], open, setOpen }) => {
    const classes = useStyles();
    return (
        <Dialog fullWidth open={open} className={classes.dialog}>
            <DialogContent className={classes.dialogContent}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h1" className={classes.text}>
                        Training Logs
                    </Typography>
                    <IconButton onClick={() => setOpen(false)}>
                        <CloseIcon fontSize="large" />
                    </IconButton>
                </Box>
                <Divider />`
                {logs?.length ? (
                    <Box flex={1} style={{ overflowY: 'auto' }}>
                        <pre className={classes.code}>
                            {logs?.map((log, i) => (
                                <code key={i}>{log.split(',').join(', ')}</code>
                            ))}
                        </pre>
                    </Box>
                ) : (
                    <Box flex={1} display="flex" justifyContent="center" alignItems="center">
                        <Typography variant="k6" className={classes.text}>
                            No logs
                        </Typography>
                    </Box>
                )}
                `
            </DialogContent>
        </Dialog>
    );
};

export default TrainingLogs;
