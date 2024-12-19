import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import logo from 'assets/img/mathco-logo.png';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    appBar: {
        top: 'auto',
        bottom: 0,
        boxShadow: 'none',
        backgroundColor: 'transparent'
    },
    root: {
        backgroundColor: 'transparent'
    },
    grow: {
        flexGrow: 1
    },
    a: {
        // color: theme.palette.primary.main,
        textDecoration: 'none',
        backgroundColor: 'transparent',
        '& img': {
            marginTop: theme.spacing(0.5),
            height: theme.spacing(2),
            float: 'right',
            paddingRight: theme.spacing(17)
        }
    },
    footerCopyText: {
        float: 'left',
        color: '#6CF0C2',
        paddingTop: theme.spacing(0.5),
        paddingRight: theme.spacing(1)
    }
}));

export default function BottomAppBar() {
    const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar variant="dense" className={classes.root}>
                    <Grid container direction="row">
                        <Grid item xs={9} sm={9} md={9} lg={9} xl={9}></Grid>
                        <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                            <Typography className={classes.footerCopyText} variant="h5">
                                &copy; Contact us
                            </Typography>
                        </Grid>
                        <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                            <a href="https://themathcompany.com" className={classes.a}>
                                <img src={logo} alt="logo" />
                            </a>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}
