import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

import TabComponent from 'components/TabComponent/Tabs.jsx';

import loginStyle from 'assets/jss/loginStyle.jsx';

// import Logo from 'assets/img/logo.png';

import { getApp } from 'services/app.js';

class AppLogin extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.state = {
            logo_url: false,
            logo_classname: false,
            selected_app_id:
                props.match && props.match.params.app_id ? props.match.params.app_id : false
        };
    }

    componentDidMount() {
        this.setState({
            loading: true
        });

        getApp({
            app_id: this.state.selected_app_id,
            callback: this.onResponseGetApp
        });
    }

    onResponseGetApp = (response_data) => {
        const { classes } = this.props;

        this.setState({
            logo_classname: response_data['logo_url'] ? classes.customerLogoBig : classes.logo,
            logo_url: response_data['logo_url'] ? response_data['logo_url'] : ''
        });
    };

    render() {
        const { classes } = this.props;

        return !this.state.selected_app_id ? (
            ''
        ) : (
            <div className={classes.container}>
                <Grid container direction="row" justify="center" spacing={0}>
                    <Grid item xs={8}>
                        <Grid container direction="row" justify="center" spacing={0}>
                            <Grid item xs={12}>
                                {this.state.logo_url ? (
                                    <img
                                        src={this.state.logo_url}
                                        alt="Customer logo"
                                        className={this.state.logo_classname}
                                    />
                                ) : (
                                    <div className={classes.emptyCustomerLogo}></div>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h1" component="h2" className={classes.text}>
                                    Translating data into
                                    <div className={classes.animationWrapper}>
                                        <ul className={classes.serviceName}>
                                            <li>Solutions</li>
                                            <li>Applications</li>
                                            <li>Insights</li>
                                            <li>Outcomes</li>
                                        </ul>
                                    </div>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <div className={classes.loginBody}>
                            <TabComponent selected_app_id={this.state.selected_app_id} />
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

AppLogin.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(
    (theme) => ({
        ...loginStyle(theme)
    }),
    { withTheme: true }
)(AppLogin);
