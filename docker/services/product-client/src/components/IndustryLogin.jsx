import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

import TabComponent from 'components/TabComponent/Tabs.jsx';

import loginStyle from 'assets/jss/loginStyle.jsx';

// import Logo from 'assets/img/logo.png';

class IndustryLogin extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.state = {
            selected_industry:
                props.match && props.match.params.industry ? props.match.params.industry : false
        };
    }

    render() {
        const { classes } = this.props;

        return !this.state.selected_industry ? (
            ''
        ) : (
            <div className={classes.container}>
                <Grid container direction="row" justify="center" spacing={0}>
                    <Grid item xs={8}>
                        <Grid container direction="row" justifyContent="center" spacing={0}>
                            <Grid item xs={12}>
                                <img src={''} alt="Customer logo" className={classes.logo} />
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
                            <TabComponent
                                history={this.props.history}
                                selected_industry={this.state.selected_industry}
                            />
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

IndustryLogin.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(
    (theme) => ({
        ...loginStyle(theme)
    }),
    { withTheme: true }
)(IndustryLogin);
