import {
    Divider,
    Drawer,
    IconButton,
    ListItem,
    ListItemText,
    Typography,
    makeStyles,
    withStyles
} from '@material-ui/core';
import { useEffect, useRef, useState } from 'react';
import sidebarStyle from 'assets/jss/sidebarStyle.jsx';
import { Link, withRouter } from 'react-router-dom';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '../Nuclios/assets/Collapse';
import Home from '../Nuclios/assets/HomeIcon';
import { matchPath } from 'react-router-dom';
import { generatePath } from 'react-router-dom';
import clsx from 'clsx';
import { dswAppRoutes } from './dswConstants';

const useStyles = makeStyles((theme) => ({
    ...sidebarStyle(theme),
    root: {
        width: theme.layoutSpacing(269),
        transition: 'width 300ms ease'
    },
    toggleButton: {
        '& svg': {
            fill: theme.palette.text.revamp
        },
        '&:hover': {
            '& svg': {
                fill: theme.Toggle.DarkIconColor
            }
        }
    },
    defaultTextColor: {
        fill: theme.palette.text.default
    },
    closeMode: {
        width: theme.layoutSpacing(40),
        minWidth: theme.layoutSpacing(40)
    },
    drawerHidden1: {
        width: '100%',
        flexShrink: 0,
        height: '100%',
        transition: 'all 500ms smooth',
        '&:hover': {
            transition: 'width 600ms ease'
        }
    },
    drawerPaper2: {
        paddingBottom: theme.layoutSpacing(4)
    },
    drawerIconHidden: {
        width: '3.4rem',
        height: '3.4rem'
    },
    disabled: {
        opacity: '0.6',
        filter: 'grayscale(0.8)',
        cursor: 'not-allowed'
    }
}));

function SideNav({ screens: _screens = [], location, pathParams, onChange, dsAppConfig }) {
    const classes = useStyles();
    const [hoverSidebar, setHoverSidebar] = useState(false);
    const [hideSidebar, setHideSidebar] = useState(false);
    const [screens, setScreens] = useState(_screens);
    const pathName = location.pathname;
    const screensRef = useRef(_screens);

    useEffect(() => {
        setScreens(_screens);
    }, [_screens]);

    useEffect(() => {
        screensRef.current = screens;
    }, [screens]);

    const processScreens = (expanded, index, screens) => {
        const newScreens = [...screens];
        newScreens[index].expanded = expanded;
        for (let i = index + 1; i < newScreens.length && newScreens[i].level == 1; i++) {
            newScreens[i].hidden = !expanded;
        }
        return newScreens;
    };

    useEffect(() => {
        const s = screensRef.current;
        const index = s.findIndex((el) => matchPath(pathName, { path: el.path }));
        if (index >= 0) {
            const newScreens = processScreens(true, index, s);
            const exact_index = s.findIndex(
                (el) => matchPath(pathName, { path: el.path })?.isExact
            );
            const route_index = dswAppRoutes.findIndex(
                (el) => matchPath(pathName, { path: el })?.isExact
            );
            newScreens.forEach((el) => (el.selected = false));
            newScreens[index].selected = true;
            // newScreens[exact_index].selected = true;
            exact_index >= 0 && (newScreens[exact_index].selected = true);
            if (exact_index === -1 && route_index !== -1) {
                const applications_index = s.findIndex(
                    (el) => el.title.toLowerCase() === 'applications'
                );
                applications_index >= 0 && (newScreens[applications_index].selected = true);
            }
            setScreens(newScreens);
        }
        dsAppConfig.setProjectDetailsState((prevState) => ({
            ...prevState,
            showAppAdmin: false
        }));
    }, [pathName]);

    const toggleSideBar = (status) => {
        setHoverSidebar(!status);
        setHideSidebar(status);
    };

    const handleScreenExpand = (expanded, index) => {
        const newScreens = processScreens(expanded, index, screens);
        if (onChange) {
            onChange(newScreens);
        }
        setScreens(newScreens);
    };

    return (
        <div
            id="sidebar"
            className={clsx(classes.root, hideSidebar && !hoverSidebar ? classes.closeMode : '')}
        >
            <Drawer
                open={true}
                variant="persistent"
                anchor="left"
                className={classes.drawer}
                onMouseEnter={() => {
                    if (hideSidebar) {
                        setHoverSidebar(true);
                    }
                }}
                onMouseLeave={() => {
                    if (hideSidebar) {
                        setHoverSidebar(false);
                    }
                }}
                classes={{
                    paper: clsx(classes.drawerPaper, classes.drawerPaper2)
                }}
            >
                <div
                    className={
                        !hideSidebar
                            ? classes.sidebarLinksContainer
                            : classes.sidebarLinksContainerHidden
                    }
                >
                    <div>
                        <div
                            className={
                                !hideSidebar || hoverSidebar
                                    ? classes.homeSectionDrawer
                                    : classes.homeSectionDrawerHide
                            }
                        >
                            {!hideSidebar || hoverSidebar ? (
                                <div className={classes.homeSectionBackground1}>
                                    <Link
                                        to={'/ds-workbench/'}
                                        className={
                                            !hideSidebar || hoverSidebar
                                                ? classes.homeSection
                                                : classes.homeSectionHidden
                                        }
                                    >
                                        <Home className={classes.defaultTextColor} />
                                        <Typography
                                            className={clsx(
                                                !hideSidebar || hoverSidebar
                                                    ? classes.homeSectionText
                                                    : classes.drawerCollapseHidden,
                                                classes.homeSectionNotSelected
                                            )}
                                        >
                                            Home
                                        </Typography>
                                    </Link>
                                </div>
                            ) : null}
                            <RenderToggleIcon
                                toggleSideBar={toggleSideBar}
                                classes={classes}
                                hideSidebar={hideSidebar}
                                hoverSidebar={hoverSidebar}
                            />
                        </div>
                        {!hideSidebar || hoverSidebar ? (
                            <div
                                className={
                                    !hoverSidebar
                                        ? classes.applicationScreenContainer
                                        : classes.appScreenContainerOnHover
                                }
                            >
                                {screens.map((el, i) => {
                                    if (el.hidden) {
                                        return null;
                                    }
                                    if (!el.level) {
                                        return (
                                            <ListItem
                                                key={el.path}
                                                className={clsx(
                                                    el.selected
                                                        ? !hideSidebar || hoverSidebar
                                                            ? classes.selectedNavLink
                                                            : classes.selectedNavLinkHidden
                                                        : !hideSidebar || hoverSidebar
                                                        ? classes.navLink
                                                        : classes.navLinkHidden,
                                                    el.disabled ? classes.disabled : ''
                                                )}
                                                button
                                                component={
                                                    el.expandable || el.disabled ? 'div' : Link
                                                }
                                                to={generatePath(el.path, pathParams)}
                                                onClick={() =>
                                                    el.expandable
                                                        ? handleScreenExpand(!el.expanded, i)
                                                        : null
                                                }
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography
                                                            variant="h5"
                                                            className={
                                                                el.selected || el.expanded
                                                                    ? !hideSidebar || hoverSidebar
                                                                        ? classes.sidebarLinkTextSelected
                                                                        : classes.sidebarLinkTextSelectedHidden1
                                                                    : !hideSidebar || hoverSidebar
                                                                    ? classes.sidebarLinkText
                                                                    : classes.sidebarLinkTextHide
                                                            }
                                                        >
                                                            {el.title}
                                                            {el.expandable ? (
                                                                el.expanded ? (
                                                                    <ExpandLessIcon
                                                                        fontSize={'large'}
                                                                        className={
                                                                            classes.expandIcon
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <ExpandMoreIcon
                                                                        fontSize={'large'}
                                                                        className={
                                                                            classes.expandIcon
                                                                        }
                                                                    />
                                                                )
                                                            ) : null}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        );
                                    } else if (el.level == 1) {
                                        return (
                                            <div key={el.path} className={classes.screenLevel}>
                                                <ListItem
                                                    className={clsx(
                                                        el.selected
                                                            ? `${
                                                                  classes.selectedNavLinkLevelTwo1
                                                              } ${
                                                                  !hideSidebar || hoverSidebar
                                                                      ? classes.selectedNavLinkLevelTwoHidden
                                                                      : null
                                                              }`
                                                            : `${classes.navLinkLevelTwo1} ${
                                                                  !hideSidebar || hoverSidebar
                                                                      ? classes.selectedNavLinkLevelTwoHidden
                                                                      : null
                                                              }`,
                                                        el.disabled ? classes.disabled : ''
                                                    )}
                                                    button
                                                    component={el.disabled ? 'div' : Link}
                                                    to={generatePath(el.path, pathParams)}
                                                >
                                                    <ListItemText
                                                        primary={
                                                            <Typography
                                                                variant="h5"
                                                                className={
                                                                    el.selected
                                                                        ? `${
                                                                              classes.sidebarLinkTextSecondSelected
                                                                          } ${
                                                                              !hideSidebar ||
                                                                              hoverSidebar
                                                                                  ? classes.sidebarLinkTextSecondSelectedHidden
                                                                                  : null
                                                                          }`
                                                                        : `${
                                                                              classes.sidebarLinkTextSecond
                                                                          } ${
                                                                              !hideSidebar ||
                                                                              hoverSidebar
                                                                                  ? classes.sidebarLinkTextSecondSelectedHidden
                                                                                  : null
                                                                          }`
                                                                }
                                                            >
                                                                {el.title}
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItem>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        ) : null}
                    </div>
                </div>
                <div>
                    <Divider className={classes.siderbarDivider} />
                    <div
                        className={
                            !hideSidebar || hoverSidebar ? classes.footer : classes.footerHidden
                        }
                    >
                        <div className={classes.footer_first}>
                            <div className={classes.footer_logo}>
                                <div className={classes.maskIcon}></div>
                            </div>
                            {(!hideSidebar || hoverSidebar) && (
                                <Typography className={classes.footer_text}>MathCo</Typography>
                            )}
                        </div>
                        {(!hideSidebar || hoverSidebar) && (
                            <Typography className={classes.footer_version}>
                                {import.meta.env['REACT_APP_VERSION']}
                            </Typography>
                        )}
                    </div>
                </div>
            </Drawer>
        </div>
    );
}

const NavBarIconButton = withStyles((theme) => ({
    colorPrimary: {
        color: theme.palette.primary.contrastText
    }
}))(IconButton);

const RenderToggleIcon = ({ toggleSideBar, classes, hideSidebar, hoverSidebar }) => {
    return (
        <div
            id="drawerButton"
            className={!hideSidebar || hoverSidebar ? classes.drawerIcon : classes.drawerIconHidden}
        >
            <NavBarIconButton
                edge="end"
                title={hideSidebar ? 'Open Sidebar' : 'Collapse Menu'}
                onClick={() => {
                    toggleSideBar(!hideSidebar);
                }}
                className={clsx(classes.toggleIcon, classes.toggleButton)}
            >
                <div className={classes.drawerIconGroup}>
                    <div className={hideSidebar ? classes.collapseHidden : ''}>
                        <Collapse />
                    </div>
                </div>
            </NavBarIconButton>
        </div>
    );
};

export default withRouter(SideNav);
