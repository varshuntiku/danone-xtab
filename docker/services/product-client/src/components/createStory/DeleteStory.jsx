import React, { useCallback, useContext, useState } from 'react';
import { Close, DeleteOutline } from '@material-ui/icons';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    alpha,
    FormControlLabel,
    FormGroup,
    IconButton,
    makeStyles,
    Typography
} from '@material-ui/core';
import CustomSnackbar from '../CustomSnackbar';
import clsx from 'clsx';
import { withRouter } from 'react-router';
import { deleteReport } from '../../services/reports';
import { DeleteStoryContext } from './deleteStoryContext';

const useStyles = makeStyles((theme) => ({
    paper: {
        background: theme.palette.primary.main
    },
    title: {
        background: theme.palette.primary.dark
    },
    appsList: {
        maxHeight: '350px',
        overflowY: 'auto',
        '& svg': {
            width: '2.5rem',
            height: '2.5rem'
        }
    },
    listItem: {
        borderBottom: `1px solid ${alpha(theme.palette.primary.contrastText, 0.4)}`,
        paddingLeft: 0
    },
    labelRoot: {
        width: 'fit-content'
    },
    label: {
        fontSize: '1.5rem'
    },
    btn: {
        borderRadius: '100px',
        padding: '0.7rem 5rem'
    }
}));

function DeleteStory({ story = { name: '', id: 0, apps: [] }, classes }) {
    const classNames = useStyles();
    const [open, setOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false });
    const multipleApps = story.apps.length > 1;
    const [selectedApps, setSelectedApps] = useState(
        story.apps.map((a) => ({ data: a, checked: !multipleApps }))
    );
    const [disableDoneBtn, setDisableDoneBtn] = useState(false);

    const { onDeleteStoryDone, onDeleteStoryFail } = useContext(DeleteStoryContext);

    const handleCancel = useCallback(() => {
        setOpen(false);
    }, []);

    const deleteCb = useCallback(() => {
        setSnackbar({ open: true, message: 'Deleted successfully!', severity: 'success' });
        setDisableDoneBtn(false);
        onDeleteStoryDone();
        setOpen(false);
    }, [onDeleteStoryDone]);

    const handleDelete = useCallback(() => {
        try {
            setDisableDoneBtn(true);

            const storiesList = {
                stories_list: JSON.stringify([
                    {
                        story_id: story.story_id,
                        app_ids: selectedApps.filter((a) => a.checked).map((a) => a.data.id)
                    }
                ])
            };

            deleteReport({
                story_id: story.story_id,
                payload: storiesList,
                callback: deleteCb
            });
        } catch (error) {
            setDisableDoneBtn(false);
            setSnackbar({
                open: true,
                message: 'Failed to deleted stroy! Please try again.',
                severity: 'error'
            });
            onDeleteStoryFail();
        }
    }, [story, deleteCb, selectedApps, onDeleteStoryFail]);

    const onCheckboxChange = useCallback((checked, el) => {
        el.checked = checked;
        setSelectedApps((s) => [...s]);
    }, []);

    return [
        <IconButton
            key={1}
            title="delete story"
            onClick={setOpen.bind(null, true)}
            className={clsx(classes.iconBtn)}
            aria-label="delete story"
        >
            <DeleteOutline fontSize="large" />
        </IconButton>,
        <Dialog
            key={2}
            open={open}
            onClose={setOpen.bind(null, false)}
            fullWidth
            maxWidth={multipleApps ? 'md' : 'sm'}
            aria-labelledby="delete-story-title"
            aria-describedby="delete-story-dialog-content"
        >
            <DialogTitle className={classNames.title} disableTypography id="delete-story-title">
                <Typography
                    variant="h4"
                    style={{ fontSize: '2.5rem', letterSpacing: '0.1em', opacity: 0.8 }}
                >
                    Delete Story
                </Typography>
                <IconButton
                    title="Close"
                    onClick={setOpen.bind(null, false)}
                    style={{ position: 'absolute', top: '4px', right: 0 }}
                    className={classNames.actionIcon}
                >
                    <Close fontSize="large" />
                </IconButton>
            </DialogTitle>
            <DialogContent style={{ minHeight: '100px' }} id="delete-story-dialog-content">
                <Typography
                    variant="h3"
                    style={{ fontSize: '1.8rem', opacity: 0.8, margin: '1em 0' }}
                >
                    {multipleApps
                        ? `Are you sure you want to delete "${story.name}" from the selected apps?`
                        : `Are you sure you want to delete "${story.name}"?`}
                </Typography>
                {multipleApps && (
                    <FormGroup className={classNames.appsList}>
                        {selectedApps.map((el, i) => (
                            <FormControlLabel
                                key={i}
                                classes={{
                                    root: classNames.labelRoot,
                                    label: classNames.label
                                }}
                                control={
                                    <Checkbox
                                        checked={el.checked}
                                        onChange={onCheckboxChange.bind(null, !el.checked, el)}
                                        name="app selection"
                                        color="primary"
                                    />
                                }
                                label={el.data.name}
                            />
                        ))}
                    </FormGroup>
                )}
            </DialogContent>
            <DialogActions style={{ padding: '8px 24px 24px' }}>
                <div style={{ flex: 1 }}></div>
                <Button
                    className={classNames.btn}
                    variant="outlined"
                    onClick={handleCancel}
                    aria-label="Cancel"
                >
                    Cancel
                </Button>
                <Button
                    title="share"
                    disabled={disableDoneBtn || !selectedApps.filter((a) => a.checked).length}
                    className={classNames.btn}
                    variant="contained"
                    onClick={handleDelete}
                    aria-label="Delete"
                >
                    {multipleApps ? 'Done' : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>,
        <CustomSnackbar
            key={3}
            message={snackbar.message}
            open={snackbar.open}
            autoHideDuration={2000}
            onClose={setSnackbar.bind(null, { ...snackbar, open: false })}
            severity={snackbar.severity}
        />
    ];
}

export default withRouter(DeleteStory);
