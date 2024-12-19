import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { logoutUser } from '../util';
import { AuthContext } from 'auth/AuthContext';
import { useDispatch } from 'react-redux';
import { resetAuthentication } from 'store/index';
import { Button, Drawer, IconButton, List, ListItem, Typography } from '@material-ui/core';
import ThemeToggle from 'themes/ThemeToggle';
import { ReactComponent as FolderImage } from 'assets/img/folder_icon.svg';
import { ReactComponent as GalleryImage } from 'assets/img/gallery_icon.svg';
import { ReactComponent as ProfileImage } from 'assets/img/profile_icon.svg';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        borderTop: '1px solid rgba(151, 151, 151, 0.4)',
        backgroundColor: theme.palette.primary.dark
    },

    bottomNavigationLink: {
        color: theme.palette.text.default,
        '& .MuiBottomNavigationAction-wrapper': {
            '& .MuiBottomNavigationAction-label': {
                fontSize: '2.5rem',
                [theme.breakpoints.up('lg')]: {
                    fontSize: '1.5rem'
                },
                [theme.breakpoints.between('sm', 'md')]: {
                    fontSize: '1.9rem'
                }
            },
            '& .MuiSvgIcon-root': {
                [theme.breakpoints.up('lg')]: {
                    fontSize: '2rem'
                },
                [theme.breakpoints.between('xs', 'md')]: {
                    fontSize: '3rem'
                }
            },
            '& svg': {
                fill: theme.palette.text.default
            }
        },
        '&.MuiBottomNavigationAction-root.Mui-selected': {
            color: theme.palette.text.contrastText,
            '& svg': {
                fill: theme.palette.text.contrastText
            }
        }
    },
    screenImage: {
        width: '3rem',
        height: '3rem',
        [theme.breakpoints.up('lg')]: {
            width: '15%',
            height: 'auto'
        },
        [theme.breakpoints.between('xs', 'sm')]: {
            width: '20%',
            height: 'auto'
        }
    },
    accountDrawer: {
        '& .MuiDrawer-paper': {
            height: '90vh'
        }
    },
    drawerList: {
        padding: '1.5rem'
    },
    accountHeader: {
        color: theme.palette.text.default,
        '& .MuiTypography-h3': {
            fontSize: '2.5rem',
            [theme.breakpoints.down('sm')]: {
                fontSize: '2.9rem'
            }
        }
    },
    accountUserDetail: {
        color: theme.palette.text.default,
        gridGap: '1.5rem',

        [theme.breakpoints.down('xs')]: {
            gridGap: '2.5rem'
        },
        '& .MuiTypography-h4': {
            fontSize: '1.5rem',
            [theme.breakpoints.down('sm')]: {
                fontSize: '2.5rem'
            }
        }
    },
    closeDrawer: {
        display: 'flex',
        justifyContent: 'center',
        '& .Mui-IconButton-root': {
            padding: '0.5rem',
            marginRight: '0rem'
        }
    },
    accountAction: {
        '& .MuiButton-label': {
            fontSize: '1.5rem',
            [theme.breakpoints.down('sm')]: {
                fontSize: '1.8rem'
            },
            [theme.breakpoints.down('xs')]: {
                fontSize: '2.2rem'
            }
        }
    },
    icon: {
        fontSize: '5rem'
    }
}));

export default function CustomBottomNavigation(props) {
    const classes = useStyles();

    const [navigationLinks, setNavigationLinks] = useState([]);
    const [activeNavigation, setActiveNavigation] = useState(0);
    const [accountDrawer, setAccountDrawer] = useState(false);
    const authContext = useContext(AuthContext);
    const dispatch = useDispatch();

    useEffect(() => {
        setNavigationLinks(props.routes ? props.routes : []);
        if (props.routes) {
            const active_route_index = props.routes?.findIndex(
                (route_item) => route_item?.href === props.location.pathname
            );
            setActiveNavigation(active_route_index === -1 ? 0 : active_route_index);
        }
    }, [props.routes]);

    const getScreenIcon = (image_name, screen_id) => {
        if (image_name) {
            if (image_name === 'folder') {
                return (
                    <FolderImage
                        className={classes.screenImage}
                        alt={'Folder Image ' + screen_id}
                    />
                );
            } else if (image_name === 'gallery') {
                return (
                    <GalleryImage
                        className={classes.screenImage}
                        alt={'Gallery Image ' + screen_id}
                    />
                );
            }
        }
    };

    const logout = async () => {
        const logoutResponse = await logoutUser(authContext, props.history);
        if (logoutResponse?.status == 'success') {
            dispatch(resetAuthentication(false));
            authContext.setUser(null);
            props.history.push('/');
        }
    };

    return (
        <React.Fragment>
            <BottomNavigation
                value={activeNavigation}
                onChange={(event, newValue) => {
                    if (newValue === navigationLinks.length) {
                        setAccountDrawer(true);
                    } else {
                        setActiveNavigation(newValue);
                        props.history.push(navigationLinks[newValue].original_href);
                    }
                }}
                showLabels
                className={classes.root}
            >
                {navigationLinks?.map((route_item) => {
                    return (
                        !route_item?.screen_item?.hidden && (
                            <BottomNavigationAction
                                icon={getScreenIcon(
                                    route_item?.screen_item?.screen_image,
                                    route_item?.screen_item?.id
                                )}
                                key={route_item?.screen_item?.screen_name}
                                label={route_item?.screen_item?.screen_name}
                                className={classes.bottomNavigationLink}
                            />
                        )
                    );
                })}

                <BottomNavigationAction
                    key="account"
                    label="Account"
                    className={classes.bottomNavigationLink}
                    icon={<ProfileImage className={classes.screenImage} />}
                />
            </BottomNavigation>
            <Drawer
                variant="persistent"
                anchor="bottom"
                open={accountDrawer}
                className={classes.accountDrawer}
            >
                <List className={classes.drawerList}>
                    <div className={classes.closeDrawer}>
                        <IconButton
                            onClick={() => {
                                setAccountDrawer(false);
                            }}
                        >
                            <KeyboardArrowDownIcon className={classes.icon} />
                        </IconButton>
                    </div>
                    <ListItem className={classes.accountUserDetail}>
                        <Typography variant="h4">
                            {props.user_info.first_name} {props.user_info.last_name}
                        </Typography>
                    </ListItem>
                    <ListItem className={classes.accountUserDetail}>
                        <Typography variant="h4">{props.user_info.username}</Typography>
                    </ListItem>
                    <ListItem>
                        <ThemeToggle />
                    </ListItem>
                    <ListItem>
                        <Button
                            className={classes.accountAction}
                            variant="text"
                            startIcon={<ExitToAppIcon fontSize="large" />}
                            onClick={() => {
                                logout();
                            }}
                            aria-label="Logout"
                        >
                            Logout
                        </Button>
                    </ListItem>
                </List>
            </Drawer>
        </React.Fragment>
    );
}
