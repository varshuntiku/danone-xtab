import React from 'react';
import PropTypes from 'prop-types';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

import footerStyle from 'assets/jss/footerStyle';
import { Typography } from '@material-ui/core';
// import logo from "assets/img/mathco-logo.svg";
// import mathco_darkbg_logo from 'assets/img/mathco-logo-darkbg.png';
// import mathco_lightbg_logo from 'assets/img/mathco-logo-lightbg.png';
import CodxNewLogo from '../assets/Icons/CodxNewLogo';
import clsx from 'clsx';

function Footer({ ...props }) {
    const { classes, type } = props;

    var localstorage_theme = localStorage.getItem('codx-products-theme');
    // var logo = mathco_lightbg_logo;

    if (localstorage_theme && localstorage_theme === 'dark' && type !== 'login') {
        // logo = mathco_darkbg_logo;
    }

    return (
        <div
            className={clsx(
                props.login ? classes.footerContainer : classes.containerFluid,
                props.extraClasses?.container,
                props.projects ? classes.projectsFooter : ''
            )}
        >
            {/* <span className={classes.footerVersionText}>
                    {import.meta.env['REACT_APP_VERSION']}{' '}
                </span> */}
            <a href="https://themathcompany.com" className={classes.a}>
                {/* <img src={logo} alt="logo" /> */}
                <div className={classes.footer_first}>
                    <div className={props.login ? classes.footer_logo : ''}>
                        {props.login ? (
                            <Typography className={classes.copyRight}>C</Typography>
                        ) : (
                            <span className={classes.newLogo}>
                                <CodxNewLogo />
                            </span>
                        )}
                    </div>
                    <Typography
                        className={clsx(
                            classes.footer_text,
                            props.login ? classes.loginFootertext : ''
                        )}
                    >
                        {props.login ? 'TheMathCompany' : 'MathCo'}
                    </Typography>
                    <span className={classes.footer_version}>
                        {import.meta.env['REACT_APP_VERSION']}{' '}
                    </span>
                </div>
            </a>
        </div>
    );
}

Footer.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(
    (theme) => ({
        ...footerStyle(theme)
    }),
    { withTheme: true }
)(Footer);
