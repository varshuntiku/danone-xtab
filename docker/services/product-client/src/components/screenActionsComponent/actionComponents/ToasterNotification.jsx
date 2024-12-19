import React, { useState } from 'react';
import { triggerActionHandler } from '../../../services/screen';
import { useEffect } from 'react';
import CustomSnackbar from '../../CustomSnackbar';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    snackbarRoot: {
        maxWidth: 'none'
    }
}));

export function ToasterNotification({ screen_id, app_id, params, action_type }) {
    const [notification, setNotification] = useState();
    const [open, setOpen] = useState();
    const classes = useStyles();

    useEffect(() => {
        if (params.fetch_on_load) {
            triggerActionHandler({
                screen_id,
                app_id,
                payload: {
                    action_type,
                    action_params: null,
                    filter_state: JSON.parse(
                        sessionStorage.getItem('app_screen_filter_info_' + app_id + '_' + screen_id)
                    )
                },
                callback: (d) => {
                    setNotification(d);
                    if (d.message) {
                        setOpen(true);
                    }
                }
            });
        }
    }, [params.fetch_on_load, screen_id, app_id, action_type]);

    return (
        <CustomSnackbar
            open={open}
            onClose={setOpen.bind(null, false)}
            anchorOrigin={params.anchorOrigin}
            severity={params.severity}
            message={notification?.message}
            TransitionComponent={Fade}
            classNames={{ root: classes.snackbarRoot }}
        />
    );
}
