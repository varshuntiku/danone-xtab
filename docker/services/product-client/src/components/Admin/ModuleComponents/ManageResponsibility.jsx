import React, { Fragment, useEffect, useState } from 'react';
import {
    Typography,
    Button,
    DialogContent,
    Dialog,
    DialogTitle,
    TextField,
    DialogActions,
    Chip,
    ThemeProvider
} from '@material-ui/core';
import { textCompTheme } from '../../dynamic-form/inputFields/textInput';
import CustomSnackbar from '../../CustomSnackbar';

import { editAppModules } from 'services/app.js';
import { updateAppUserResponsibilities } from 'services/admin_users.js';

export function ManageResponsibility(props) {
    const classes = props.classes;
    const existingResponsbility = props.responsibilities || [];
    const [open, setOpen] = useState(props.open);
    const [responsibility, setResponsibility] = useState('');
    const [responsibilities, setResponsibilities] = useState(existingResponsbility);
    const [disableSave, setDisableSave] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });
    const [deletedResponsibilities, setDeletedResponsibilities] = useState([]);

    useEffect(() => {
        const isSameRes =
            existingResponsbility.length === responsibilities.length &&
            responsibilities.every((res) => existingResponsbility.includes(res));
        setDisableSave(isSameRes);
    }, [responsibilities]);

    const handleSaveResponsibilities = () => {
        const app_modules = {
            responsibilities: responsibilities
        };
        editAppModules({
            app_id: props.app_id,
            payload: app_modules,
            callback: onResponseSaveResponsibilities
        });
    };

    const onResponseSaveResponsibilities = (response_data) => {
        setSnackbar({
            open: true,
            message:
                response_data?.status === 'success'
                    ? 'Responsibilities Saved Successfully'
                    : 'There was an error in saving responsibilities. Please try after some time',
            severity: response_data?.status || 'error'
        });
        handleDialogClose('save');

        if (response_data?.status === 'success' && deletedResponsibilities.length) {
            updateAppUserResponsibilities({
                app_id: props.app_id,
                payload: { deleted_responsibilities: deletedResponsibilities },
                callback: onResponseUpdateAppUserResponsibilities
            });
        }
    };

    const onResponseUpdateAppUserResponsibilities = () => {};

    const handleDialogClose = (reason) => {
        setOpen(false);
        setResponsibility('');
        if (reason !== 'save') {
            props.onDialogClose(existingResponsbility);
        }
    };

    const handleSnackbarState = () => {
        setSnackbar({
            open: false,
            message: '',
            severity: 'info'
        });
        props.onDialogClose(responsibilities);
    };

    return (
        <Fragment>
            <Dialog
                maxWidth="md"
                open={open}
                onClose={(e, reason) => {
                    if (reason !== 'backdropClick') {
                        handleDialogClose(reason);
                    }
                }}
                aria-labelledby="manage-responsibilities"
                aria-describedby="responsibilities-content"
                className={classes.resDialog}
            >
                <DialogTitle id="manage-responsibilities">Manage Responsibilities</DialogTitle>
                <DialogContent
                    className={classes.resDialogContent}
                    dividers
                    id="responsibilities-content"
                >
                    <div className={classes.addResponsibility}>
                        <ThemeProvider theme={textCompTheme}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Add Responsibilities"
                                value={responsibility}
                                onChange={(e) => {
                                    setResponsibility(e.target.value);
                                }}
                                helperText={
                                    responsibilities.includes(responsibility)
                                        ? 'Responsibility already exists'
                                        : ' '
                                }
                                error={responsibilities.includes(responsibility)}
                                id="add responsibilities"
                            />
                        </ThemeProvider>

                        <Button
                            onClick={() => {
                                setResponsibilities([...responsibilities, responsibility]);
                                setResponsibility('');
                            }}
                            disabled={!responsibility || responsibilities.includes(responsibility)}
                            variant="contained"
                            aria-label="Add"
                        >
                            {' '}
                            Add{' '}
                        </Button>
                    </div>
                    <Typography variant="h5">Added responsibilities appears below</Typography>
                    <div className={classes.availableResponsibility}>
                        {responsibilities.map((res) => (
                            <Chip
                                variant="outlined"
                                key={res}
                                label={res}
                                onDelete={() => {
                                    const updatedResponsibilities = responsibilities.filter(
                                        (r) => r !== res
                                    );
                                    setDeletedResponsibilities([...deletedResponsibilities, res]);
                                    setResponsibilities(updatedResponsibilities);
                                }}
                            />
                        ))}
                    </div>
                    {deletedResponsibilities.length ? (
                        <div className={classes.importantNote}>
                            Note: Deleting saved responsibility will remove it for the user as well.
                        </div>
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            handleDialogClose('cancel');
                        }}
                        aria-label="Cancel"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveResponsibilities}
                        variant="contained"
                        disabled={disableSave}
                        aria-label="Save"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <CustomSnackbar
                key="app-admin-module-responsibility"
                message={snackbar.message}
                open={snackbar.open}
                autoHideDuration={1000}
                onClose={() => {
                    handleSnackbarState();
                }}
                severity={snackbar.severity}
            />
        </Fragment>
    );
}
