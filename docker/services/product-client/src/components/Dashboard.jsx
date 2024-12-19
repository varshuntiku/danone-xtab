import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

import NavBar from 'components/NavBar.jsx';
import Footer from 'components/Footer.jsx';
import dashboardStyle from 'assets/jss/dashboardStyle.jsx';

const useStyles = makeStyles(dashboardStyle);

const DashboardWrapper = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.dashboardContainer}>
            <div
                className={
                    props.match.path === '/dashboard'
                        ? classes.bodyContainer
                        : classes.functionBodyContainer
                }
            >
                <CssBaseline />
                <NavBar {...props} user_permissions={props.user_permissions} apps={[]}></NavBar>
                <div className={classes.body}>{props.children}</div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardWrapper;
