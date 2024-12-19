import React, { useContext, useState, useEffect, useRef } from 'react';
import { Box, IconButton, withStyles, MenuItem, Typography, Popover } from '@material-ui/core';
import AppsIcon from '@material-ui/icons/Apps';
import LockIcon from '@material-ui/icons/Lock';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import NotificationPreview from 'components/alert-dialog/NotificationPreview';

import { logoutUser } from '../../util';
import { AuthContext } from 'auth/AuthContext';
import { useDispatch } from 'react-redux';
import { resetAuthentication } from 'store/index';
import { ReactComponent as OwnerImage } from '../../assets/img/navbar_profile.svg';
import { getProfilePhoto, getProfilePhotoSAML } from '.././../services/user_identity';
import ThemeToggle from '../../themes/ThemeToggle';
import AdminIcon from '../Nuclios/assets/AdminIcon';
import { ReactComponent as ThemeIcon } from '../../assets/img/theme.svg';
import { Link } from 'react-router-dom';
import sanitizeHtml from 'sanitize-html-react';

const NavBarIconButton = withStyles((theme) => ({
    colorPrimary: {
        color: theme.palette.primary.contrastText
    }
}))(IconButton);

const MenuBar = (props) => {
    // classes is default parameter while using withStyles
    const classes = { ...props.classes, ...props.classList };
    const [profileMenu, setProfileMenu] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const profileRef = useRef();
    const theme = localStorage.getItem('codx-products-theme');
    const userInfo = sessionStorage.getItem('user_name');
    const isPasswordLogin = localStorage.getItem('local.access.token.key');

    const authContext = useContext(AuthContext);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!profilePhoto) {
            (async () => {
                const samlUserId = localStorage.getItem('local.saml.user.id');

                if (samlUserId) {
                    const photo = await getProfilePhotoSAML(samlUserId);
                    const sanitizedPhoto = sanitizeHtml(photo);
                    setProfilePhoto(sanitizedPhoto);
                } else {
                    try {
                        const photo = await getProfilePhoto();
                        if (photo) {
                            const sanitizedPhoto = sanitizeHtml(photo);
                            setProfilePhoto(sanitizedPhoto);
                        }
                    } catch (err) {
                        // console.error(`Error while fetching user's profile picture! ${err}`);
                    }
                }
            })();
        }
    }, []);

    const logout = async () => {
        const logoutResponse = await logoutUser(authContext, props.history);
        if (logoutResponse?.status == 'success') {
            dispatch(resetAuthentication(false));
            authContext.setUser(null);
            props.history.push('/');
        }
    };

    const handleClick = (event) => {
        setProfileMenu(event.currentTarget);
    };

    const handleClose = () => {
        setProfileMenu(null);
    };

    const navigateTo = () => {
        props.history.push('/platform-utils');
    };

    const navigateToResetPassword = () => {
        props.history.push('/resetpassword');
    };

    const navigateToMicrosoftProfile = () => {
        window.open('https://myaccount.microsoft.com', '__blank');
    };

    return (
        <Box display="flex" gridGap="0.5rem" alignItems="center" className={classes.box}>
            {props.showDashboardNotification ? (
                <NotificationPreview NavBarIconButton={NavBarIconButton} history={props.history} />
            ) : null}
            {!props.hideProfile && (
                <div
                    aria-label="profile"
                    title="Profile"
                    onMouseEnter={handleClick}
                    onMouseLeave={handleClose}
                    className={profileMenu ? classes.menuHover : classes.menuIcon}
                    ref={profileRef}
                >
                    {!profilePhoto ? (
                        <OwnerImage className={classes.profileIcon} />
                    ) : (
                        <img src={profilePhoto} alt="profile" className={classes.profilePic} />
                    )}
                </div>
            )}
            <Popover
                className={classes.menu}
                id="simple-menu"
                anchorEl={profileRef.current}
                open={Boolean(profileMenu)}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        pointerEvents: 'auto'
                    },
                    onMouseEnter: handleClick,
                    onMouseLeave: handleClose
                }}
                PopoverClasses={{
                    root: { pointerEvents: 'none', padding: 0 }
                }}
            >
                <MenuItem className={classes.menuItem}>
                    <span className={classes.userLogo}>
                        {userInfo?.split(' ')[0][0]}
                        {userInfo?.split(' ')[1][0]}
                    </span>
                    <Typography variant="h4" className={classes.userName}>
                        {userInfo}
                    </Typography>
                </MenuItem>
                <hr className={classes.separtorLine} />
                {!props?.is_admin && props?.user_permissions?.app_publish ? (
                    <Link
                        to={
                            '/app/' +
                            props?.app_info?.id +
                            '/admin/screens/' +
                            props?.GPTinfo?.screen_id
                        }
                        aria-label="app-admin"
                        className={classes.linkStyle}
                    >
                        <MenuItem className={classes.menuItem}>
                            <AdminIcon
                                fontSize="large"
                                color={`${props.theme.palette.text.revamp}`}
                            />
                            Admin
                        </MenuItem>
                    </Link>
                ) : null}
                {!props.is_restricted_user &&
                (props.user_permissions?.app_publish || props.user_permissions?.admin) ? (
                    <MenuItem className={classes.menuItem} onClick={navigateTo}>
                        <AppsIcon fontSize="large" className={classes.iconStyle} /> Platform Utils
                    </MenuItem>
                ) : null}
                <MenuItem className={classes.menuItem}>
                    <ThemeIcon className={classes.themeIcon} />{' '}
                    {theme === 'light' ? 'Dark' : 'Light'} Theme{' '}
                    <span className={classes.themeBtn}>
                        {' '}
                        <ThemeToggle />
                    </span>
                </MenuItem>
                {isPasswordLogin && (
                    <MenuItem className={classes.menuItem} onClick={navigateToResetPassword}>
                        <LockIcon fontSize="large" className={classes.iconStyle} /> Update Password
                    </MenuItem>
                )}
                {/* Ternary operator will be removed once the UI is ready for non SSO */}
                {!isPasswordLogin ? (
                    <MenuItem className={classes.menuItem} onClick={navigateToMicrosoftProfile}>
                        <SettingsIcon fontSize="large" className={classes.iconStyle} /> Account
                        Settings
                    </MenuItem>
                ) : null}
                <hr className={classes.separtorLine} />
                <MenuItem aria-label="logout" className={classes.menuItem} onClick={logout}>
                    <ExitToAppIcon fontSize="large" className={classes.iconStyle} /> Logout
                </MenuItem>
            </Popover>
        </Box>
    );
};

const styles = (theme) => ({
    box: {
        marginLeft: '1rem'
    },
    menuIcon: {
        padding: theme.layoutSpacing(4.5),
        '& svg': {
            stroke: theme.palette.text.default
        }
    },
    iconStyle: {
        fill: theme.palette.text.default
    },
    menuHover: {
        backgroundColor: theme.palette.background.menuItemFocus,
        display: 'flex',
        justifyContent: 'center',
        padding: theme.layoutSpacing(4.5),
        borderRadius: '50%',
        paddingLeft: theme.layoutSpacing(6),
        '& svg': {
            stroke: theme.palette.text.default
        }
    },
    menu: {
        top: theme.spacing(4.6) + ' !important',
        '& .MuiPopover-paper': {
            overflow: 'visible !important'
        },
        '& .MuiList-padding': {
            padding: 0
        },
        pointerEvents: 'none'
    },
    menubarProfile: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        marginRight: theme.spacing(0.5),
        marginLeft: theme.spacing(0.5)
    },
    userName: {
        fontSize: theme.layoutSpacing(13.1) + ' !important',
        fontWeight: '500' + ' !important',
        fontFamily: theme.body.B5.fontFamily + ' !important'
    },
    menuItem: {
        display: 'flex',
        gap: theme.spacing(1.5),
        fontSize: theme.layoutSpacing(13.1) + ' !important',
        fontWeight: '400' + ' !important',
        fontFamily: theme.body.B5.fontFamily + ' !important',
        padding: theme.layoutSpacing(10.5),
        minWidth: theme.layoutSpacing(250),
        color: theme.palette.text.revamp + ' !important',
        '&:nth-last-child(2)': {
            paddingBottom: theme.spacing(2)
        },
        '& .MuiSvgIcon-root': {
            color: theme.palette.primary.contrastText + ' !important'
        },
        '&:hover': {
            backgroundColor: theme.palette.background.menuItemHover
        }
    },
    separtorLine: {
        border: `1px solid ${theme.palette.border.loginGrid}`,
        borderBottom: 'none',
        width: 'calc(100% - 16px)',
        marginTop: 0,
        marginBottom: 0
    },
    profilePic: {
        width: theme.layoutSpacing(32),
        height: theme.layoutSpacing(32),
        borderRadius: '50%'
    },
    linkStyle: {
        textDecoration: 'none'
    },
    themeBtn: {
        position: 'absolute',
        right: theme.layoutSpacing(13.5)
    },
    themeIcon: {
        fill: theme.palette.text.revamp + '!important'
    },
    userLogo: {
        fontSize: theme.layoutSpacing(18),
        background: theme.palette.background.profileHover,
        color: theme.palette.text.profileText,
        fontWeight: '500',
        padding: theme.layoutSpacing(2),
        width: theme.layoutSpacing(36),
        height: theme.layoutSpacing(36),
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textTransform: 'uppercase'
    }
});

export default withStyles(styles, { withTheme: true })(MenuBar);
