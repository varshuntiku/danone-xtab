import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    card: {
        fontSize: '1.3rem',
        fontWeight: '500',
        border: '1px solid #f4a460',
        borderRadius: '5px',
        textAlign: 'center',
        padding: '5px'
    }
}));
export default function Card(props) {
    const classes = useStyles();

    return (
        <div className={classes.card} style={{ backgroundColor: props.color }}>
            {props.children}
        </div>
    );
}
