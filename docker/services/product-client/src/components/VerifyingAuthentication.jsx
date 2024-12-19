import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, CssBaseline } from '@material-ui/core';
import { ReactComponent as CodxLogo } from 'assets/img/codx-new-logo.svg';
import Footer from 'components/Footer.jsx';
import LinearProgressBar from 'components/LinearProgressBar.jsx';

export default function VerifyingAuthentication({ classes, state }) {
    return (
        <div className={classes.bodyContainer}>
            <CssBaseline />
            <div className={classes.body}>
                <div className={classes.container}>
                    <Grid container direction="row" justifyContent="center" spacing={0}>
                        <Grid item xs={8}>
                            <Grid container direction="row" justifyContent="center" spacing={0}>
                                <Grid item xs={12}>
                                    {state.logo_url ? (
                                        <img
                                            src={state.logo_url}
                                            alt="Customer logo"
                                            className={state.logo_classname}
                                        />
                                    ) : (
                                        <div className={classes.emptyCustomerLogo}></div>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography
                                        variant="h1"
                                        component="h2"
                                        className={classes.text}
                                    >
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
                                <CodxLogo className={classes.loginLogo} alt="customer logo" />
                                <br />
                                <Typography className={classes.authLoadingText}>
                                    Verifying authentication ...
                                </Typography>
                                <LinearProgressBar />
                                <Typography className={classes.authLoadingText}></Typography>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
            <Footer type="login" />
        </div>
    );
}
VerifyingAuthentication.propTypes = {
    classes: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired
};
