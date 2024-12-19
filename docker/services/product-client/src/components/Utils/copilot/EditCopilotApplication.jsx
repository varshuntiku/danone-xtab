import React, { Fragment } from 'react';
import { Button, IconButton } from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';

export function ManageCopilotApplication({
    copilotAppId,
    copilotAppName,
    onDeleteCopilotApplication,
    ...props
}) {
    const createNewCopilotApplication = copilotAppId ? false : true;

    const onRemoveApplication = (id) => {
        onDeleteCopilotApplication(id);
    };

    if (createNewCopilotApplication) {
        return (
            <Button
                key="create"
                variant="contained"
                onClick={() => {
                    props.history.push('/platform-utils/copilot/create');
                }}
                startIcon={<AddCircleOutlineOutlinedIcon />}
                aria-label="Create New"
            >
                Create Ask NucliOS Application
            </Button>
        );
    } else {
        return (
            <Fragment>
                <IconButton
                    key="preview"
                    onClick={() => {
                        props.history.push('/platform-utils/copilot/preview/' + copilotAppId);
                    }}
                    aria-label="Preview"
                    title="Preview Application"
                >
                    <VisibilityIcon fontSize="large" />
                </IconButton>
                <IconButton
                    key="edit"
                    onClick={() => {
                        props.history.push(`/platform-utils/copilot/edit/${copilotAppId}?step=1`);
                    }}
                    aria-label="Edit"
                    title="Edit Application"
                >
                    <EditIcon fontSize="large" />
                </IconButton>
                <ConfirmPopup
                    onConfirm={() => onRemoveApplication(copilotAppId)}
                    title="Remove Ask NucliOS Application"
                    subTitle={
                        <>
                            Are you sure to remove <b>{copilotAppName}</b>?
                        </>
                    }
                >
                    {(triggerConfirm) => (
                        <IconButton
                            edge="end"
                            size="medium"
                            aria-label="delete"
                            onClick={triggerConfirm}
                            title="Delete Application"
                        >
                            <DeleteOutlinedIcon fontSize="large" style={{ color: 'red' }} />
                        </IconButton>
                    )}
                </ConfirmPopup>
            </Fragment>
        );
    }
}
