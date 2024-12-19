import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Grid } from '@material-ui/core';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5,
        marginTop: 5
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700]
    },
    bar: {
        borderRadius: 5,
        backgroundColor: (props) => props.severity
    }
}))(LinearProgress);

const useStyles = makeStyles({
    root: {
        flexGrow: 1
    }
});

export default function AppCustomizedProgressBars(props) {
    const classes = useStyles();
    const value = props.data['value'].toFixed(2);
    return (
        <Grid container direction="row" className={classes.root}>
            <Grid item xs={8}>
                <BorderLinearProgress
                    variant="determinate"
                    severity={props.data['severity'] === 'up' ? '#4CAF56' : '#D91E18'}
                    value={value}
                />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={3}>
                {value + '%'}
            </Grid>
        </Grid>
    );
}
