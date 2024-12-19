import React, { useState, useEffect, Fragment, useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { IconButton, Tooltip, Typography } from '@material-ui/core';
import { Badge, Button, Menu, MenuItem } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { AlertTitle } from '@material-ui/lab';
// import { fetch_socket_connection } from 'util/initiate_socket';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { getNotifications, setNotifications } from 'store/index';
import Notification from '../Nuclios/assets/Notification';
import { UserInfoContext } from 'context/userInfoContent';
import ScreenFilterIcon from '../../assets/Icons/ScreenFilterIcon';
import Avatar from '@material-ui/core/Avatar';
import { ReactComponent as AlertsAvatar } from '../../assets/img/alerts-avatar.svg';
import { ReactComponent as NoNotificationsIcon } from '../../assets/img/NoNotificationsIcon.svg';
import CloseIcon from '../../assets/Icons/CloseBtn';
import AlertDate from './AlertDate';
import { markAllNotificationRead } from '../../services/alerts';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { editApprovalStatus } from '../../services/comments';
const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 60%)`;
    return color;
};
const hexToRgba = (hex, alpha = 1) => {
    let r = 0,
        g = 0,
        b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
const useStyles = makeStyles((theme) => ({
    anchorOriginTopRight: {
        top: '7% !important',
        width: 'full'
    },
    snackbarAlert: {
        // border: '1px solid ' + theme.palette.text.titleText,
        borderRadius: '0px !important',
        backgroundColor: theme.palette.background.modelBackground,
        '& .MuiSvgIcon-root': {
            color: '#FE6A9C'
        },
        '& .MuiAlert-message': {
            color: theme.palette.text.titleText
        },
        '& .MuiAlert-action': {
            alignItems: 'start'
        }
    },
    platformSnackbar: {
        border: '0px !important',
        position: 'relative',
        top: '10px',
        backgroundColor: theme.palette.primary.contrastText,
        '& .MuiSvgIcon-root': {
            color: '#FE6A9C'
        },
        '& .MuiAlert-message': {
            color: theme.palette.primary.dark
        },
        '& .MuiAlert-action': {
            alignItems: 'start'
        }
    },
    snackbarAlertTitle: {
        fontSize: '2rem',
        '&:hover': {
            '& $snackbarAlertMessage': {
                opacity: 1,
                visibility: 'visible',
                maxHeight: '300px',
                transition: 'max-height 2s,opacity 0.5s ease-in'
            }
        },
        cursor: 'pointer'
    },
    notificationDescription: {
        fontSize: '1.8rem',
        cursor: 'default'
    },
    additionaldetail: {
        color: '#FE6A9C'
    },
    notificationDate: {
        fontSize: '1.5rem'
    },
    appNavBarNotificationBadge: {
        '& .MuiBadge-anchorOriginTopRightRectangle': {
            top: '1.51rem',
            right: '1.2rem',
            position: 'absolute'
        },
        '& .MuiBadge-badge': {
            width: '1.72rem',
            height: '1.72rem',
            backgroundColor: '#DA4141',
            borderRadius: '50%',
            minWidth: '1.72rem',
            color: '#FFFFFF',
            border: '1px solid #FFFFFF',
            fontSize: '1.2rem',
            fontFamily: 'graphik',
            fontWeight: '400',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    },

    notificationPanelAlert: {
        backgroundColor: 'transparent',
        width: '100%',
        '& .MuiSvgIcon-root': {
            color: '#FE6A9C'
        },
        '& .MuiAlert-message': {
            color: theme.palette.text.titleText
        },
        '& .MuiAlert-action': {
            alignItems: 'flex-start'
        },
        '&:hover': {
            '& $notificationPanelCard': {
                opacity: 1,
                maxHeight: '500px',
                transition: 'max-height 2s,opacity 0.5s ease-in'
            }
        }
    },
    notificationViewAll: {
        color: theme.palette.border.tableDivider,
        width: 'auto',
        bottom: '0',
        marginLeft: '2rem',
        marginTop: '1rem',
        '& .MuiButton-label': {
            fontSize: '1.7rem',
            textDecoration: 'underline'
        },
        '&:hover': {
            color: theme.palette.border.tableDivider,
            background: 'none'
        }
    },

    emptyNotification: {
        color: theme.palette.text.default,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem'
    },
    notificationPanelCard: {
        color: theme.palette.text.default,
        opacity: 0,
        maxHeight: 0
    },
    unreadNotification: {
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        '& .MuiSvgIcon-root': {
            color: '#FE6A9C'
        },
        '& .MuiAlert-message': {
            color: theme.palette.text.titleText
        },
        '& .MuiAlert-action': {
            alignItems: 'flex-start'
        },
        '&:hover': {
            '& $notificationPanelCard': {
                opacity: 1,
                maxHeight: '500px',
                transition: 'max-height 2s,opacity 0.5s ease-in'
            }
        }
    },
    snackbarAlertMessage: {
        opacity: 0,
        visibility: 'hidden',
        maxHeight: 0,
        fontSize: '1.5rem',
        marginBottom: '1rem',
        pointerEvents: 'none'
    },
    snackbarAlertExpand: {
        color: theme.palette.primary.contrastText,
        marginBottom: '1rem',
        '&:hover': {
            '& $snackbarAlertMessage': {
                opacity: 1,
                maxHeight: '300px',
                visibility: 'visible',
                transition: 'max-height 2s,opacity 0.5s ease-in'
            }
        }
    },
    alertClose: {
        // marginLeft: 'auto',
        width: '10rem',
        cursor: 'pointer',
        textAlign: 'center',
        fontSize: '2rem',
        marginTop: '3rem',
        marginRight: '1rem !important',
        padding: '1rem'
    },
    alertIcon: {
        color: 'red'
    },
    notificationButton: {
        padding: 0,
        margin: 0,
        '& svg': {
            fill: theme.palette.text.default,
            color: theme.palette.text.default
        }
    },
    iconTooltip: {
        fontSize: '1.6rem',
        padding: '0.4rem 1rem',
        position: 'relative',
        top: '-2rem',
        left: '0.5rem',
        backgroundColor: theme.Toggle.DarkIconBg,
        '@media(max-width:1500px)': {
            top: '-3rem'
        }
    },
    arrow: {
        '&:before': {
            backgroundColor: theme.Toggle.DarkIconBg
        }
    },
    menu: {
        '& .MuiList-padding': {
            padding: 0
        },
        '& .MuiMenuItem-root': {
            width: '15rem',
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.6rem',
            color: theme.palette.text.default,
            padding: '1rem !important',
            paddingLeft: '1.6rem !important',
            height: '4.5rem',
            minHeight: '4.5rem',
            fontFamily: theme.body.B5.fontFamily,
            '&:hover': {
                backgroundColor: theme.palette.background.selected
            }
        }
    },
    filterPane: {
        marginTop: '1.5rem',
        display: 'flex',
        width: 'full',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: theme.palette.text.default
    },
    filterButton: {
        cursor: 'pointer',
        display: 'inline-flex',
        '& svg': {
            color: theme.palette.text.contrastText,
            width: '1.5rem',
            height: '1.8rem'
        }
    },
    filterValue: {
        marginLeft: '0.2rem',
        display: 'inline-flex',
        fontSize: '1.8rem',
        fontWeight: 500,
        letterSpacing: '0.5px'
    },
    alertItem: {
        display: 'flex',
        alignItems: 'start',
        width: '100%'
    },
    alertData: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: '1.5rem',
        fontFamily: theme.body.B5.fontFamily,
        width: '100%'
    },
    taskContent: {
        display: 'flex'
    },
    display: { display: 'block' },
    avatar: {
        width: 30,
        height: 30,
        marginRight: theme.spacing(2),
        fontSize: '1.7rem',
        color: '#ffff !important',
        fontWeight: 500
    },
    alertsAvatar: {
        '& svg': {
            width: 30,
            height: 30,
            marginRight: theme.spacing(2),
            stroke: theme.palette.text.contrastText
        }
    },
    message: {
        fontSize: '1.5rem',
        lineHeight: '1.9rem',
        fontWeight: 500,
        display: 'block',
        textOverflow: 'ellipsis',
        width: 'full'
    },
    widget_name: {
        fontSize: '1.5rem',
        lineHeight: '1.9rem',
        fontWeight: 400,
        display: 'block',
        textOverflow: 'ellipsis',
        width: 'full'
    },
    noNotifications: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto',
        height: 'auto',
        fontSize: '1.8rem',
        fontWeight: '500',
        fontFamily: theme.body.B5.fontFamily,
        color: theme.palette.text.contrastText,
        letterSpacing: '0.5px',
        marginTop: '20rem',
        marginBottom: '20rem'
    },
    lightFont: {
        fontWeight: 400
    },
    closeButton: {
        margin: '0 !important',
        marginRight: '-0.8rem  !important',
        padding: '0.8rem',
        '& svg': {
            fill: theme.palette.text.contrastText,
            width: '1.4rem',
            height: '1.4rem'
        }
    },
    notificationHeaderWrapper: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between'
    },
    notificationPanelHeader: {
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: '2.4rem',
        display: 'inline-flex'
    },
    notificationPanelDivider: {
        display: 'flex',
        alignItems: 'center',
        margin: '0',
        padding: '0'
    },

    dividerLeft: {
        borderBottom: '4px solid ' + theme.palette.text.contrastText
    },

    dividerRight: {
        flexGrow: 1,
        borderBottom: '1px solid ' + theme.palette.border.loginGrid
    },
    settingsIcon: {
        '& svg': {
            fontSize: theme.layoutSpacing(18),
            marginLeft: theme.layoutSpacing(8),
            cursor: 'pointer'
        }
    },
    buttonContainer: {
        display: 'flex',
        gap: '1.3rem'
    },
    acceptButton: {
        width: '4rem',
        marginTop: '0.6rem',
        color: theme.button.applyButton.color,
        borderColor: theme.palette.text.sidebarSelected,
        backgroundColor: theme.palette.text.sidebarSelected,
        fontFamily: theme.body.B1.fontFamily,
        fontSize: theme.layoutSpacing(16),
        fontWeight: 500,
        letterSpacing: theme.layoutSpacing(0.5),
        '&:hover': {
            borderColor: theme.palette.text.sidebarSelected,
            backgroundColor: theme.palette.text.sidebarSelected,
            color: theme.button.applyButton.color
        },
        height: theme.layoutSpacing(33),
        padding: `${theme.layoutSpacing(8)} ${theme.layoutSpacing(24)}`
    },

    denyButton: {
        width: '4rem',
        marginTop: '0.6rem',
        borderColor: theme.palette.text.sidebarSelected,
        border: '1px solid rgba(34, 0, 71, 1)',
        padding: `${theme.layoutSpacing(8)} ${theme.layoutSpacing(24)}`,
        height: theme.layoutSpacing(33)
    },
    viewMoreButton: {
        color: theme.palette.text.default,
        fontWeight: '500',
        fontSize: '1.5rem',
        borderBottom: '0.3rem solid rgba(43, 112, 194, 1)',
        padding: '0.1rem',
        marginLeft: '6.8rem'
    },
    taskApproved: {
        paddingTop: '3rem',
        display: 'flex',
        justifyContent: 'space-between'
    },
    statusContainer: {
        marginRight: '0.1rem'
    },
    acceptanceContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginRight: '0.1rem',
        paddingTop: '3rem'
    },
    dialogTitle: {
        fontSize: '2.6rem',
        width: '60%',
        letterSpacing: '1.5px',
        color: theme.palette.text.default,
        display: 'flex',
        fontFamily: 'Graphik Compact',
        alignItems: 'center',
        gap: '1rem',
        '& svg': {
            width: '2.6rem',
            height: '2.6rem',
            fill: theme.palette.text.contrastText
        }
    },
    dialogContent: {
        fontSize: '1.67rem',
        fontWeight: '400',
        lineHeight: '2rem',
        letterSpacing: '0.5px'
    },
    cancel: {
        marginBottom: '2.4rem'
    },
    proceed: {
        marginBottom: '2.4rem',
        marginRight: '1.6rem'
    }
}));

const StyledMenu = withStyles((theme) => ({
    paper: {
        boxShadow: '2px 8px 24px 3px rgba(0, 0, 0, 0.2)',
        borderRadius: '0px',
        position: 'relative',
        top: '20rem',
        padding: '2rem',
        width: '60rem',
        backgroundColor: theme.palette.background.modelBackground,
        '& .MuiList-padding': {
            padding: 0
        },
        minHeight: 'auto'
    }
}))((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        display: 'block',
        border: 'none',
        borderBottom: `1px solid ${hexToRgba(theme.palette.border.loginGrid, 0.4)}`,
        whiteSpace: 'break-spaces',
        padding: '1rem 0 1rem 0',
        '&:focus': {
            backgroundColor: theme.palette.primary.light,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white
            }
        }
    }
}))(MenuItem);

function Alert({ autoHideDuration, onClose, ...props }) {
    useEffect(() => {
        if (autoHideDuration > -1) {
            setTimeout(() => {
                onClose();
            }, autoHideDuration);
        }
    }, [autoHideDuration, onClose]);

    return <MuiAlert severity="warning" variant="filled" {...props} />;
}

function NotificationPopup(props) {
    const [alertNotification, setAlertNotification] = useState(new Map());
    const { notification } = props;
    const classes = useStyles();

    useEffect(() => {
        setAlertNotification((prev) => new Map([...prev, [notification?.id, { ...notification }]]));
    }, [notification]);

    const handleCloseNotification = (k) => {
        //props.notificationClose(k)
        setAlertNotification((prev) => {
            const newState = new Map(prev);
            newState.delete(k);
            return newState;
        });
    };

    const handleAlertClose = (e, closeAlert) => {
        e.stopPropagation();
        closeAlert();
    };

    return (
        <Snackbar
            open={alertNotification.size > 0 ? true : false}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            classes={{ anchorOriginTopRight: classes.anchorOriginTopRight }}
            className={classes.notificationSnackbar}
        >
            <div style={{ display: 'flex', gridGap: '1rem', flexDirection: 'column' }}>
                {[...alertNotification.keys()].map((k, i) => (
                    <Alert
                        key={i + 'alert'}
                        severity="warning"
                        elevation={6}
                        variant="filled"
                        onClick={props.onClick.bind(null, alertNotification.get(k)['type'] || null)}
                        onClose={handleCloseNotification.bind(null, k)}
                        className={clsx(classes.snackbarAlert, classes.notificationDescription)}
                        autoHideDuration={120000}
                    >
                        <AlertTitle className={classes.snackbarAlertTitle}>
                            {alertNotification.get(k)['widget_name'] ||
                                alertNotification.get(k)['title']}
                            <br />{' '}
                            {alertNotification.get(k)['message'] && (
                                <span className={classes.snackbarAlertExpand}>
                                    {' '}
                                    &nbsp; view more...
                                </span>
                            )}
                            <Typography variant="h4" className={classes.snackbarAlertMessage}>
                                {alertNotification.get(k)['message']}
                            </Typography>
                        </AlertTitle>
                        <Button
                            variant="contained"
                            onClick={(e) =>
                                handleAlertClose(e, handleCloseNotification.bind(null, k))
                            }
                            className={classes.alertClose}
                        >
                            Close
                        </Button>
                    </Alert>
                ))}
            </div>
        </Snackbar>
    );
}

function NotificationPreview(props) {
    const { NavBarIconButton } = props;
    const classes = useStyles();
    const [notification, setNotification] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const curNotificationsData = {
        notifications: props.app_id
            ? props.notificationData?.notifications
            : props.notificationData?.platformNotifications,
        count: props.app_id ? props.notificationData?.count : props.notificationData?.platformCount
    };
    // const socket = fetch_socket_connection();
    const userContext = useContext(UserInfoContext);
    const [filterValue, setFilterValue] = useState('All');
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [filteredNotifications, setFilteredNotifications] = useState(
        curNotificationsData?.notifications
    );
    const theme = useTheme();
    useEffect(() => {
        // establishSocketConnection();
        const source = new EventSource(
            `${import.meta.env['REACT_APP_NUCLIOS_BACKEND_API']}/sse/${props.app_id}/${
                userContext['user_id']
            }`
        );

        source.onmessage = (event) => {
            notificationMessage(JSON.parse(event.data));
        };

        source.onerror = () => {
            if (source.readyState === EventSource.CLOSED) {
                source.close();
            } else {
                source.close();
            }
        };

        return () => {
            source.close();
            // socket['socket_product']?.removeListener('app_notification');
            // socket['socket_product']?.removeListener('platform_notification');
            // socket.removeListener('banner')
        };
    }, [props.app_id]);

    useEffect(() => {
        getNavNotification();
    }, []);
    useEffect(() => {
        // Initialize filtered notifications with all notifications
        setFilteredNotifications(
            curNotificationsData.notifications?.filter(
                (notification) => notification && !notification.is_read
            )
        );
    }, [curNotificationsData.notifications]);

    useEffect(() => {
        if (filterValue?.trim() === 'All')
            setTimeout(() => handleFilterValueClick(filterValue), 300);
        else handleFilterValueClick(filterValue);
    }, [filterValue]);

    const getNavNotification = () => {
        if (props.app_id) {
            const payload = {
                app_id: props.app_id
            };
            props.getNotifications(payload);
        }
        if (!props.app_id) {
            props.getNotifications({});
        }
    };

    // const establishSocketConnection = () => {
    //     if (!socket['socket_product']?.hasListeners('app_notification')) {
    //         socket['socket_product']?.on('app_notification', notificationMessage);
    //     }
    //     if (!socket['socket_product']?.hasListeners('platform_notification')) {
    //         socket['socket_product']?.on('platform_notification', pushPlatformNotification);
    //     }
    //     if (!socket['socket_product']?.hasListeners('banner')) {
    //         socket['socket_product']?.on('banner', () => {
    //             //TODO
    //         });
    //     }
    // };

    const notificationMessage = (data) => {
        if (data.app_id === props.app_id) {
            setNotification(data);
            props.setNotifications(data);
        }
    };

    // const pushPlatformNotification = (data) => {
    //     // if (data.app_id === props.app_id) {
    //     setNotification({ ...data, type: 'platform_notification' });
    //     props.setNotifications({ ...data, type: 'platform_notification' });
    //     // }
    // };

    const notificationClickHandler = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopupClick = (type = null) => {
        props.history.push({
            pathname:
                type !== 'Platform'
                    ? '/app/' + props?.app_id + '/notifications/list'
                    : '/platform-notifications'
        });
    };

    const handleFilterValueClick = (value) => {
        setMenuAnchorEl(null);
        const localFiltered = curNotificationsData?.notifications?.filter(
            (notification) => notification && !notification.is_read
        );

        if (!['All', 'Others'].includes(value?.trim())) {
            if (['Comments'].includes(value?.trim()))
                setFilteredNotifications(() =>
                    localFiltered?.filter((notification) =>
                        ['Comments', 'Mentions'].includes(notification?.type)
                    )
                );
            else
                setFilteredNotifications(() =>
                    localFiltered?.filter((notification) => notification?.type === value)
                );
        } else if (value?.trim() == 'Others') {
            setFilteredNotifications(() =>
                localFiltered?.filter((notification) => {
                    return (
                        notification?.type !== 'Alerts' &&
                        notification?.type !== 'Comments' &&
                        notification?.type !== 'Mentions' &&
                        notification?.type !== 'Task'
                    );
                })
            );
        }
        //all
        else setFilteredNotifications(localFiltered);
    };
    const handleNotificationsClose = () => {
        setFilterValue('All');
        setAnchorEl(null);
    };
    const markAsReadHandler = (notifications) => {
        markAllNotificationRead({
            payload: { notifications },
            callback: () => onResponseMarkNotificationsRead(notifications)
        });
    };

    const onResponseMarkNotificationsRead = (notifications) => {
        let count = 0;
        const tempNotifications = structuredClone(curNotificationsData);
        const notificationItem = tempNotifications?.notifications?.map((item) => {
            if (notifications?.includes(item.id)) {
                if (!item?.is_read) {
                    item.is_read = true;
                    count += 1;
                }
            }
            return item;
        });
        const updatedNotificationData = {};
        if (props.app_info) {
            updatedNotificationData['count'] = tempNotifications?.count - count;
            updatedNotificationData['notifications'] = [...notificationItem];
        } else {
            updatedNotificationData['count'] = tempNotifications?.count - count;
            updatedNotificationData['notifications'] = [...notificationItem];
            updatedNotificationData['type'] = 'platform_notification';
        }
        props.setNotifications(updatedNotificationData);
    };

    const handleNotificationsClick = (notification, read) => {
        if (
            notification?.link &&
            (notification?.type == 'Mentions' ||
                notification?.type == 'Comments' ||
                notification?.type == 'Task')
        )
            window.open(`${notification?.link}`, '_blank');
        else if (notification?.type !== 'Platform') {
            props.history.push({ pathname: '/app/' + props.app_id + '/notifications/list' });
        } else props.history.push({ pathname: '/platform-notifications' });

        if (read) markAsReadHandler([notification?.id]);
    };

    const editAcceptApproval = async (approval_id, status) => {
        let payloadsend = { payload: { approval_id: approval_id, status: status } };
        await editApprovalStatus(payloadsend);
        setFilteredNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
                notification.approval_id === approval_id
                    ? { ...notification, approval_status: status }
                    : notification
            )
        );
    };

    return (
        <Fragment>
            {
                <Fragment>
                    <Tooltip
                        title={'Notification'}
                        classes={{ tooltip: classes.iconTooltip, arrow: classes.arrow }}
                        arrow
                    >
                        <NavBarIconButton
                            aria-label="nav-notification"
                            onClick={notificationClickHandler}
                            className={classes.notificationButton}
                        >
                            <Badge
                                badgeContent={curNotificationsData?.count}
                                className={classes.appNavBarNotificationBadge}
                            >
                                <Notification width="4.5rem" height="4.5rem" />
                            </Badge>
                        </NavBarIconButton>
                    </Tooltip>
                    <StyledMenu
                        id="customized-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleNotificationsClose}
                        className={classes.notificationMenu}
                    >
                        <span className={classes.notificationHeaderWrapper}>
                            <Typography variant="h4" className={classes.notificationPanelHeader}>
                                Notifications
                            </Typography>
                            <IconButton
                                className={classes.closeButton}
                                onClick={handleNotificationsClose}
                            >
                                <CloseIcon />
                            </IconButton>
                        </span>
                        <span className={classes.filterPane}>
                            <Typography className={classes.filterValue}>{filterValue}</Typography>
                            <div>
                                <span
                                    onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                                    className={classes.filterButton}
                                    aria-controls="filter-menu"
                                    aria-haspopup="true"
                                >
                                    <ScreenFilterIcon color={theme.palette.text.contrastText} />
                                </span>
                                <span
                                    onClick={() => {
                                        setAnchorEl(null);
                                        props.history.push({
                                            pathname: props.app_id
                                                ? '/app/' + props.app_id + '/notifications/list'
                                                : '/platform-notifications',
                                            state: 'subscription_open'
                                        });
                                    }}
                                    className={classes.settingsIcon}
                                >
                                    <SettingsOutlinedIcon />
                                </span>
                            </div>
                        </span>
                        <Menu
                            id="filter-menu"
                            anchorEl={menuAnchorEl}
                            keepMounted
                            className={classes.menu}
                            open={Boolean(menuAnchorEl)}
                            onClose={() => setMenuAnchorEl(null)}
                            getContentAnchorEl={null}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    setMenuAnchorEl(null);
                                    setFilterValue('All');
                                }}
                            >
                                All
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setFilterValue('Mentions');
                                }}
                            >
                                @Mentions
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setFilterValue('Alerts');
                                }}
                            >
                                Alerts
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setFilterValue('Comments');
                                }}
                            >
                                Comments
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setFilterValue('Task');
                                }}
                            >
                                Tasks
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setFilterValue('Others');
                                }}
                            >
                                Others
                            </MenuItem>
                        </Menu>
                        <div className={classes.notificationPanelDivider}>
                            <div
                                className={classes.dividerLeft}
                                style={{
                                    width:
                                        filterValue == 'All'
                                            ? '4rem'
                                            : ['Alerts', 'Others'].includes(filterValue)
                                            ? '8rem'
                                            : '11rem'
                                }}
                            ></div>
                            <div className={classes.dividerRight}></div>
                        </div>
                        {filteredNotifications?.slice(0, 10)?.map((notification, index) => {
                            return (
                                <StyledMenuItem
                                    key={index}
                                    onClick={() => handleNotificationsClick(notification, true)}
                                >
                                    <div className={classes.alertItem}>
                                        {notification?.type == 'Alerts' ? (
                                            <span className={classes.alertsAvatar}>
                                                <AlertsAvatar />
                                            </span>
                                        ) : (
                                            <Avatar
                                                className={classes.avatar}
                                                classes={{}}
                                                style={{
                                                    backgroundColor: stringToColor(
                                                        notification?.shared_by?.trim()?.length
                                                            ? notification.shared_by
                                                                  ?.trim()
                                                                  ?.toUpperCase()
                                                            : 'System'
                                                    )
                                                }}
                                            >
                                                {notification?.shared_by?.trim()?.length
                                                    ? notification.shared_by
                                                          ?.trim()
                                                          ?.toUpperCase()
                                                          ?.charAt(0)
                                                    : 'S'}
                                            </Avatar>
                                        )}
                                        <div className={classes.alertData}>
                                            <Typography className={classes.message}>
                                                {notification?.message}
                                            </Typography>
                                            <Typography className={classes.widget_name}>
                                                {' '}
                                                {notification?.widget_name || notification.title}{' '}
                                            </Typography>
                                        </div>
                                        <AlertDate createdAt={notification?.triggered_at} />
                                    </div>
                                    {notification.type === 'Task' &&
                                    notification.approval_status === 'pending' ? (
                                        <div className={classes.taskContent}>
                                            <div className={classes.acceptanceContainer}>
                                                <Button
                                                    className={classes.viewMoreButton}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        handleNotificationsClick(
                                                            notification,
                                                            true
                                                        );
                                                    }}
                                                >
                                                    View Details
                                                </Button>
                                                <div className={classes.buttonContainer}>
                                                    <Button
                                                        className={classes.acceptButton}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            editAcceptApproval(
                                                                notification.approval_id,
                                                                'Approved'
                                                            );
                                                        }}
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        className={classes.denyButton}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            editAcceptApproval(
                                                                notification.approval_id,
                                                                'Denied'
                                                            );
                                                        }}
                                                    >
                                                        Deny
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                    {notification.type === 'Task' &&
                                    notification.approval_status !== 'pending' ? (
                                        <div className={classes.taskApproved}>
                                            <Button
                                                className={classes.viewMoreButton}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleNotificationsClick(notification, true);
                                                }}
                                            >
                                                View Details
                                            </Button>
                                            <span
                                                style={{
                                                    color:
                                                        notification.approval_status === 'Approved'
                                                            ? '#008063'
                                                            : notification.approval_status ===
                                                              'Denied'
                                                            ? 'red'
                                                            : 'inherit',
                                                    border: '0.1rem solid',
                                                    borderColor:
                                                        notification.approval_status === 'Approved'
                                                            ? '#008063'
                                                            : notification.approval_status ===
                                                              'Denied'
                                                            ? 'red'
                                                            : 'transparent',
                                                    padding: '5px 10px',
                                                    borderRadius: '5px',
                                                    fontWeight: '500'
                                                }}
                                                className={classes.statusContainer}
                                            >
                                                {notification.approval_status}
                                            </span>
                                        </div>
                                    ) : null}
                                </StyledMenuItem>
                            );
                        })}
                        {filteredNotifications?.length < 1 && (
                            <div className={classes.noNotifications}>
                                <span>
                                    <NoNotificationsIcon />
                                </span>
                                <span className={classes.lightFont}>You&apos;re all caught up</span>
                                <span>
                                    You have no new notifications
                                    {`${filterValue !== 'All' ? ' with the current filter' : ''}`}
                                </span>
                            </div>
                        )}
                        {filteredNotifications?.length < 1 && (
                            <div className={classes.notificationPanelDivider}>
                                <div className={classes.dividerRight}></div>
                            </div>
                        )}
                        <Button
                            onClick={() => {
                                setAnchorEl(null);
                                props.history.push({
                                    pathname: props.app_id
                                        ? '/app/' + props.app_id + '/notifications/list'
                                        : '/platform-notifications'
                                });
                            }}
                            className={classes.notificationViewAll}
                            type="text"
                            fullWidth
                            aria-label="View all notifications"
                        >
                            View All
                        </Button>
                    </StyledMenu>
                </Fragment>
            }
            {Object.keys(notification).length > 0 && (
                <NotificationPopup notification={notification} onClick={handlePopupClick} />
            )}
        </Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        notificationData: state.notificationData
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getNotifications: (payload) => dispatch(getNotifications(payload)),
        setNotifications: (payload) => dispatch(setNotifications(payload))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationPreview);
