import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Lock } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    content: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white'
    },
    heading: {
        textAlign: 'center',
        fontSize: theme.spacing(5)
    },
    description: {
        textAlign: 'center',
        fontSize: theme.spacing(3)
    }
}));

export default function AccessDenied() {
    const classes = useStyles();

    return (
        <div className={classes.content}>
            <Lock fontSize="large" style={{ 'font-size': '5rem' }} />
            <p className={classes.description}>{"You don't have permissions to view this page."}</p>
        </div>
    );
}
