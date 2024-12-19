import React from 'react';
import { AppBar, Toolbar, Typography, withStyles } from '@material-ui/core';
import { ReactComponent as CodxLogo } from 'assets/img/codx-new-logo.svg';
import mathco_darkbg_logo from 'assets/img/mathco-logo-darkbg.png';
import mathco_lightbg_logo from 'assets/img/mathco-logo-lightbg.png';
import { withThemeContext } from '../themes/customThemeContext';
import mobileAppNavStyle from '../assets/jss/mobileAppNavStyle';

const MobileAppNav = (props) => {
    const classes = props.classes;
    let localstorage_theme = localStorage.getItem('codx-products-theme');

    return (
        <AppBar position="static" className={classes.appNavBar}>
            <Toolbar>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <CodxLogo alt="codex-logo" className={classes.codxLogo} />
                    <a href="https://themathcompany.com">
                        <img
                            src={
                                localstorage_theme === 'dark'
                                    ? mathco_darkbg_logo
                                    : mathco_lightbg_logo
                            }
                            alt="logo"
                            style={{ height: '2.5rem', width: '15rem' }}
                        />
                    </a>
                </div>
                {props.appName && (
                    <Typography className={classes.appNavBarTitle} variant="h4" noWrap>
                        {props.appName}
                    </Typography>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default withStyles(
    (theme) => ({
        ...mobileAppNavStyle(theme)
    }),
    { withTheme: true }
)(withThemeContext(MobileAppNav));
