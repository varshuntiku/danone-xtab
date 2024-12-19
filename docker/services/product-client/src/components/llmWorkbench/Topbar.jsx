import React, { useMemo } from 'react';
import { AppBar, Toolbar, Typography, useTheme, Tooltip, withStyles } from '@material-ui/core';
import ThemeToggle from 'themes/ThemeToggle';
import MenuBar from 'components/misc/MenuBar';
import Nuclios from '../../components/Nuclios/assets/Nuclios';
import appNavBarStyle from '../../assets/jss/appNavBarStyle';
import HelpIcon from '.././Nuclios/assets/HelpIcon';
import { Link } from 'react-router-dom';

const exceptions = ['results', 'status'];

const Topbar = ({ classes, ...props }) => {
    const currentPath = window.location.pathname;
    const theme = useTheme();
    const isException = useMemo(() => exceptions.some((ex) => currentPath?.includes(ex)), []);
    return (
        <div className={classes.appBarContainer}>
            <AppBar position="static" className={classes.appBarNoSideNav}>
                <Toolbar className={classes.toolBar}>
                    <div className={isException ? classes.mainLogo2 : classes.mainLogo}>
                        <Link
                            key={'main_dashboard_link'}
                            to={'/'}
                            className={classes.mainLogoLink}
                            aria-label="main-dashboard"
                        >
                            <Nuclios
                                color={theme.palette.text.default}
                                className={classes.codxLogo}
                            />
                        </Link>
                    </div>
                    <div
                        className={classes.applicationTitle}
                        style={{ marginLeft: isException ? '0' : '2.32rem' }}
                    >
                        <div className={classes.appName}>
                            <Typography
                                className={classes.appNavBarTitle}
                                variant="h4"
                                noWrap
                                style={{ display: isException ? 'none' : '' }}
                            >
                                LLM Workbench
                                <sup>α</sup>
                            </Typography>
                        </div>
                        <div className={classes.configurationSection}>
                            <div className={classes.configurations}>
                                <Tooltip
                                    title={'Help'}
                                    classes={{
                                        arrow: classes.arrow,
                                        tooltip: classes.iconTooltip
                                    }}
                                    arrow
                                >
                                    <div className={classes.hover}>
                                        {/* <SearchIcon className={classes.navBarIcon} /> */}
                                        <HelpIcon
                                            className={classes.navBarIcon}
                                            color={`${theme.palette.text.default}95`}
                                        />
                                    </div>
                                </Tooltip>
                                <ThemeToggle />
                            </div>
                            <div className={classes.separtor}></div>
                            <MenuBar
                                {...props}
                                showDashboardNotification={false}
                                classes={classes}
                            />
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default withStyles(appNavBarStyle, { withTheme: true })(Topbar);
