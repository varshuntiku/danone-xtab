import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    content: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        color: theme.palette.text.default
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

export default function PageNotFound(props) {
    const classes = useStyles();

    return (
        <div className={classes.content}>
            <h1 className={classes.heading}>oops!</h1>
            <p className={classes.description}>{props.message}</p>
        </div>
    );
}
