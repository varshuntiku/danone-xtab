import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import NavBar from '../NavBar';
import NotificationWorkspace from './NotificationWorkspace';

const useStyles = makeStyles((theme) => ({
    platformWorkspace: {
        backgroundColor: theme.palette.background.default,
        height: 'calc(100% - ' + theme.spacing(8.1) + ')'
    }
}));

export default function PlatformNotificationWorkspace(props) {
    const classes = useStyles();
    return (
        <Fragment>
            <NavBar key={'platform-notification-navbar'} {...props} apps={[]} />
            <div className={classes.platformWorkspace}>
                <NotificationWorkspace {...props} width={'md'} />
            </div>
        </Fragment>
    );
}
