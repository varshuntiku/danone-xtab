import React from 'react';
import clsx from 'clsx';
import {
    /*Button, CssBaseline, */ Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Typography
} from '@material-ui/core';
import { ReactComponent as CodxLogo } from 'assets/img/codx-new-logo.svg';
import { Link /*, useLocation*/ } from 'react-router-dom';
import sidebarStyle from '../../assets/jss/sidebarStyle';
import ExtensionIcon from '@material-ui/icons/Extension';

const useStyles1 = makeStyles((theme) => ({
    bodyContainer: {
        height: '100%',
        position: 'relative'
    },
    body: {
        height: `calc(100% - ${theme.spacing(12)})`
    },

    colorContrast: {
        color: theme.palette.primary.contrastText
    },
    colorDefault: {
        color: theme.palette.text.default
    },
    fontSize1: {
        fontSize: '1.6rem'
    },
    fontSize2: {
        fontSize: '1.2rem'
    },
    LinkIconSelected: {
        color: theme.palette.primary.dark
    },
    navLink: {
        borderRadius: '4px'
    },
    sidebarLinkTextSelected: {
        color: theme.palette.primary.dark,
        fontWeight: 700
    },
    selectedNavLink: {
        background: theme.palette.primary.contrastText,
        '&:hover': {
            opacity: 0.7,
            backgroundColor: theme.palette.primary.contrastText
        }
    },
    sidebarLinksContainer: {
        padding: '2rem'
    }
}));

const useStyles = makeStyles(sidebarStyle);

export default function PDFrameWorkSideBar({ fullBody }) {
    const classes = useStyles();
    const classes1 = useStyles1();
    const location = window.location;
    const projectSeleced = location.pathname === '/projects/list';
    if (fullBody) {
        return null;
    }
    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={true}
            classes={{
                paper: classes.drawerPaper
            }}
        >
            <div className={classes.drawerHeader} aria-label="Codx Logo">
                <Link to={'/'}>
                    <CodxLogo className={classes.codxLogo} />
                </Link>
            </div>

            <List className={clsx(classes.sidebarLinksContainer, classes1.sidebarLinksContainer)}>
                <ListItem
                    className={clsx(
                        projectSeleced ? classes1.selectedNavLink : classes.navLink,
                        classes1.navLink
                    )}
                    button
                    component={Link}
                    key={'home'}
                    to="/projects"
                >
                    <ListItemIcon className={classes.advancedIconRoot}>
                        <ExtensionIcon
                            className={
                                projectSeleced
                                    ? classes1.LinkIconSelected
                                    : classes.dashboardLinkIcon
                            }
                            fontSize="large"
                        />
                    </ListItemIcon>
                    <ListItemText
                        disableTypography
                        primary={
                            <Typography
                                variant="h5"
                                className={
                                    projectSeleced
                                        ? classes1.sidebarLinkTextSelected
                                        : classes.sidebarLinkText
                                }
                            >
                                Projects
                            </Typography>
                        }
                    />
                </ListItem>
            </List>
        </Drawer>
    );
}
