import React from 'react';
import { IconButton } from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';
import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';
import { deleteApp } from 'services/app';
import * as _ from 'underscore';

function DeleteApplications(props) {
    const { dsAppConfig, row, setNotification, setNotificationOpen, fetchApplicationsList } = props;

    const deleteApplication = () => {
        deleteApp({
            appId: row.id,
            callback: onResponseDeleteApp
        });
    };

    const onResponseDeleteApp = (status = 'success') => {
        if (status === 'error') {
            setNotificationOpen(true);
            setNotification({
                message: 'Failed to delete Application',
                severity: 'error'
            });
        } else {
            setNotificationOpen(true);
            setNotification({
                message: 'Application deleted successfully',
                severity: 'success'
            });
            _.delay(
                () => {
                    fetchApplicationsList({
                        project_id: dsAppConfig.projectDetailsState.projectId
                    });
                },
                500,
                ''
            );
        }
    };

    return (
        <React.Fragment>
            <ConfirmPopup
                title={<span>Delete App</span>}
                subTitle={
                    <>
                        Are you sure you want to Delete <b>{row.name || ''}</b> ?
                    </>
                }
                cancelText="No"
                confirmText="Yes"
                onConfirm={deleteApplication}
            >
                {(triggerConfirm) => (
                    <IconButton
                        key={'Delete Application'}
                        title="Delete Application"
                        onClick={triggerConfirm}
                        aria-label="delete"
                    >
                        <DeleteOutline fontSize="large" style={{ color: 'red' }} />
                    </IconButton>
                )}
            </ConfirmPopup>
        </React.Fragment>
    );
}

export default DeleteApplications;
