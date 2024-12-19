import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CommentEdit from './CommentEdit';
import AttachmentCard from './AttachmentCard';
import CodxPopupDialog from '../../components/custom/CodxPoupDialog';
import {
    status,
    bookmark,
    commentDeleteStateChange,
    addFilter,
    saveThreadLevelSetting
} from '../../services/comments';
import CustomSnackbar from '../../components/CustomSnackbar.jsx';
import DateDisplay from './DateDisplay.jsx';
import { ReactComponent as ResolvedIcon } from '../../assets/img/ResolvedIcon.svg';
import sanitizeHtml from 'sanitize-html-react';
import ReplyAdd from './ReplyAdd.jsx';
import Reply from './Reply.jsx';
import { Button, Tooltip } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useSelector } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import { editApprovalStatus } from '../../services/comments';
import { getNotifications } from 'services/alerts';
import { useDispatch } from 'react-redux';

function stringToColor(string) {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}

const useStyles = makeStyles((theme) => ({
    commentContainer: {
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        marginBottom: theme.spacing(2),
        color: theme.palette.text.default
    },
    header: {
        display: 'flex',
        alignItems: 'center'
    },
    content: {
        paddingLeft: '5rem',
        fontSize: '1.6rem'
    },
    avatar: {
        width: 30,
        height: 30,
        marginRight: theme.spacing(2),
        backgroundColor: (props) => stringToColor(props.userName),
        color: 'white'
    },
    avatarWrapper: {
        width: '5rem'
    },
    name: {
        fontSize: '1.5rem',
        fontWeight: 500
    },
    textField: {
        width: '100%'
    },
    editIcon: {
        visibility: 'hidden',
        padding: '0.5rem'
    },
    commentHovered: {
        '&:hover $editIcon': {
            visibility: 'visible',
            padding: '0.5rem',
            '& svg': {
                width: '1.6rem',
                height: '1.6rem'
            }
        }
    },
    divider: {
        borderTop: `1px solid ${theme.palette.divider}`,
        margin: `${theme.spacing(1)}px 0`
    },
    iconButton: {
        padding: '0.5rem',
        '& svg': {
            width: '2rem',
            height: '2rem'
        }
    },
    bookmarkIcon: {
        display: 'flex',
        padding: '0.5rem',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        '& svg': {
            width: '2rem',
            height: '2rem'
        }
    },
    resolveIcon: {
        display: 'flex',
        padding: '0.5rem',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        '& svg': {
            fill: theme.palette.text.contrastText,
            width: '2rem',
            height: '2rem'
        }
    },
    bookMark: {
        stroke: theme.palette.text.contrastText,
        fill: 'none',
        width: '2rem',
        height: '2rem'
    },
    bookMarkFilled: {
        stroke: theme.palette.text.contrastText,
        fill: theme.palette.text.contrastText,
        width: '2rem',
        height: '2rem'
    },
    menuIcon: {
        padding: '0.5rem',
        '& svg': {
            width: '2rem',
            height: '2rem'
        }
    },
    bookmarkResolveContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '0.5rem'
    },
    notificationButton: {
        margin: 0,
        cursor: 'pointer',
        padding: '1rem',
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        '& svg': {
            stroke: `${theme.palette.text.default} !important`,
            fill: `none !important`,
            fontSize: theme.layoutSpacing(18),
            marginRight: theme.layoutSpacing(4)
        }
    },
    subscriptionEnabled: {
        '& svg': {
            fill: `${theme.palette.text.default} !important`,
            fontSize: theme.layoutSpacing(18),
            marginRight: theme.layoutSpacing(4)
        }
    },
    iconBar: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'left',
        marginLeft: 'auto',
        marginBottom: '0.6rem'
    },
    firstIconBar: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    approverContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    toolsContainer: { display: 'flex' },
    menu: {
        '& .MuiList-padding': {
            padding: 0
        },
        '& .MuiListItem-button:hover': {
            background: theme.palette.background.selected
        }
    },
    menuItem: {
        padding: '1rem !important',
        height: '4.5rem',
        minHeight: '4.5rem'
    },
    attachmentContainer: {
        paddingLeft: theme.spacing(6),
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    content2: {
        fontSize: '1.67rem',
        fontWeight: '400',
        lineHeight: '2rem',
        letterSpacing: '0.5px'
    },
    resolved: {
        padding: '0.5rem',
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${theme.palette.background.selected} !important`,
        '& svg': {
            fill: theme.palette.text.contrastText,
            width: '2rem',
            height: '2rem'
        }
    },
    pulsatingCircle: {
        width: '1.5rem',
        height: '1.5rem',
        borderRadius: '50%',
        position: 'relative',
        marginLeft: '0.5rem',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '0.5rem',
            height: '0.5rem',
            borderRadius: '50%',
            backgroundColor: theme.palette.text.contrastText,
            transform: 'translate(-50%, -50%)',
            zIndex: 1
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '1.5rem',
            height: '1.5rem',
            borderRadius: '50%',
            backgroundColor: theme.palette.text.contrastText,
            opacity: 0.4,
            animation: '$pulse 2s infinite',
            transform: 'translate(-50%, -50%)',
            zIndex: 0
        }
    },
    '@keyframes pulse': {
        '0%': {
            transform: 'translate(-50%, -50%) scale(0.33)',
            opacity: 0.4
        },
        '70%': {
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 0.4
        },
        '100%': {
            transform: 'translate(-50%, -50%) scale(0.33)',
            opacity: 0.4
        }
    },
    mention: {
        fontWeight: '500',
        fontFamily: 'Graphik',
        color: theme.palette.border.tableDivider,
        fontSize: '1.6rem !important'
    },
    pulseContainer: {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        gap: '1rem'
    },
    notificationMessage: {
        fontSize: '1.4rem',
        color: theme.palette.text.default,
        fontWeight: '500'
    },
    replyAddContainer: {
        display: 'flex',
        alignItems: 'start',
        paddingLeft: theme.spacing(6),
        marginTop: theme.spacing(2)
    },
    replyAvatar: {
        width: 30,
        height: 30,
        marginRight: theme.spacing(2),
        marginTop: theme.spacing(1.5),
        backgroundColor: (props) => stringToColor(props.currentUser),
        color: 'white'
    },
    replyContainer: {
        display: 'flex',
        alignItems: 'start',
        flexDirection: 'column',
        paddingLeft: '5rem',
        marginTop: theme.spacing(2)
    },
    showButton: {
        color: theme.palette.border.tableDivider,
        display: 'flex !important',
        fontSize: '1.3rem !important',
        alignItems: 'bottom',
        '& .MuiButton-label': {
            fontSize: '1.4rem !important'
        },
        '&:hover': {
            background: 'none',
            color: theme.palette.border.tableDivider
        },
        '& svg': {
            marginLeft: '0.5rem',
            stroke: theme.palette.border.tableDivider,
            width: '2rem',
            height: '2rem'
        }
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
    },
    dialogRoot: {
        margin: theme.spacing(2),
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        paddingLeft: 0,
        paddingRight: 0,
        display: 'flex',
        justifyContent: 'space-between',
        '& .MuiTypography-caption': {
            fontSize: '1.75rem'
        },
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`
    },
    dialogPaper: {
        width: '25%',
        backdropFilter: 'blur(2rem)',
        borderRadius: 'unset'
    },
    closeButton: {
        width: '4rem',
        height: '4rem',
        padding: '0',
        marginRight: '-0.4rem',
        '& svg': {
            fill: theme.palette.text.contrastText,
            width: '2rem',
            height: '2rem'
        }
    },
    progress: {
        position: 'absolute',
        color: theme.palette.text.contrastText,
        stroke: theme.palette.text.contrastText,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
    container: {
        display: 'flex',
        gap: '0.4rem'
    },
    list: {
        cursor: 'pointer',
        color: theme.palette.text.default,
        fontSize: '1.6rem',
        fontFamily: theme.body.B1.fontFamily
    },
    statusApproved: {
        background: 'rgba(0, 128, 99, 0.1)',
        padding: '0.7rem 1.4rem',
        borderRadius: '2.11rem',
        color: '#008063',
        marginLeft: '0.3rem',
        marginTop: '-0.8rem',
        fontSize: '1.4rem'
    },
    statusDenied: {
        background: 'rgba(214, 72, 72, 0.1)',
        padding: '0.7rem 1.4rem',
        borderRadius: '2.11rem',
        color: '#D64848',
        marginLeft: '0.3rem',
        marginTop: '-0.8rem',
        fontSize: '1.4rem'
    },
    approverDetails: {
        width: 'auto',
        display: 'flex',
        gap: '0.5rem',
        top: '0.8rem',
        justifyContent: 'center',
        alignItems: 'center'
    },
    parentContainer: {
        position: 'absolute',
        left: '6rem',
        top: '-3rem',
        zIndex: 999
    },
    approvalContainer: {
        top: '-2rem',
        left: '-5rem',
        padding: '1.1rem 1.7rem',
        backgroundColor: 'white',
        border: '1px solid rgba(231, 233, 236, 1)',
        borderRadius: '0.57rem',
        boxShadow: '0px 2px 34px 0px rgba(190, 188, 192, 0.2)',
        display: 'none',
        zIndex: 999,
        width: '30.4rem',
        fontFamily: theme.body.B1.fontFamily
    },
    approvalContainerVisible: {
        display: 'block',
        left: 0
    },
    approverRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.4rem 0'
    },
    approvalAvatar: {
        width: '2.8rem',
        height: '2.8rem',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.5rem',
        color: 'white',
        backgroundColor: '#ddd'
    },
    nameContainer: {
        flex: 1,
        marginLeft: '0.4rem',
        fontSize: '1.4rem',
        fontWeight: '400',
        color: theme.palette.text.default
    },
    statusBadge: {
        width: '9rem',
        textAlign: 'center',
        fontSize: '1.4rem',
        fontWeight: '400',
        padding: '4px 8px',
        backgroundColor: '#fef6e0',
        borderRadius: '2.7rem',
        color: '#d19c45',
        textTransform: 'capitalize'
    },
    statusBadgeUser: {
        fontSize: '1.4rem',
        fontWeight: '400',
        padding: '4px 8px',
        backgroundColor: '#fef6e0',
        borderRadius: '2.7rem',
        color: '#d19c45',
        textTransform: 'capitalize',
        marginTop: '-0.5rem',
        fontFamily: theme.body.B1.fontFamily
    },
    buttonContainer: {
        display: 'flex',
        gap: '0.8rem',
        justifyContent: 'center'
    },
    acceptButton: {
        width: '5.2rem',
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
        width: '5.2rem',
        borderColor: theme.palette.text.sidebarSelected,
        border: '1px solid rgba(34, 0, 71, 1)',
        padding: `${theme.layoutSpacing(8)} ${theme.layoutSpacing(24)}`,
        height: theme.layoutSpacing(33)
    },
    scenarioDetails: {
        marginTop: '2rem',
        fontFamily: theme.body.B1.fontFamily,
        fontSize: '1.5rem'
    },
    scenarioName: {
        color: 'grey'
    },
    scenarioList: {
        color: theme.palette.text.default,
        fontWeight: '500',
        marginLeft: '0.3rem'
    }
}));

const Comment = ({
    comment,
    users,
    onRemoveComment,
    shouldOpen,
    refreshComments,
    filterCommentId,
    linkType,
    screenName,
    widget_name,
    screenId,
    app_info,
    mode,
    approvals,
    user_id,
    created_by,
    scenario_list,
    isScenarioLibrary,
    enableHighlight
}) => {
    const userInfo = sessionStorage.getItem('user_name');
    const userFirstName = userInfo?.trim().split(' ')[0];
    const classes = useStyles({
        userName: comment.user_name?.trim()?.split(' ')?.[0]?.toLowerCase() || '',
        currentUser: userFirstName?.toLowerCase() || ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [sanitizedComment, setSanitizedComment] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(comment.bookmarked);
    const [isResolved, setIsResolved] = useState(comment.status == 'resolved' ? true : false);
    const [userId, setUserId] = useState(null);
    const [notificationOpen, setNotification] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogApprove, setDialogApprove] = useState(false);
    const [highlight, setHighlight] = useState(false);
    const [showAllReplies, setShowAllReplies] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingValues, setLoadingValues] = useState({});
    const [subscription_setting, setSubscriptionSetting] = useState(comment?.subscription_setting);
    const [isHovered, setIsHovered] = useState(false);
    const [approval, setApproval] = useState('pending');
    const [approvalId, setApprovalId] = useState(0);
    const widget_id = useSelector((state) => state.createStories.widgetOpenId);
    const screenLevelFilterState = useSelector(
        (state) => state.createStories.screenLevelFilterState
    );
    const approvedCount = (approvals ?? []).filter(
        (approver) => approver.status === 'Approved'
    ).length;
    const deniedCount = (approvals ?? []).filter((approver) => approver.status === 'Denied').length;
    const totalApprovers = approvals?.length ?? 0;
    const dispatch = useDispatch();
    const screenSubscriptionDisbled =
        app_info?.screens?.find((screen) => screen.id === screenId)?.subscription_setting === 'off';
    const replies =
        comment?.replies && comment?.replies?.length
            ? showAllReplies
                ? comment?.replies
                : comment?.replies?.slice(comment?.replies?.length - 2)
            : [];

    useEffect(() => {
        if (!comment || !comment.comment_text) {
            setSanitizedComment('');
            return;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(comment.comment_text, 'text/html');

        doc.querySelectorAll('span.mention').forEach((span) => {
            span.innerHTML = span.innerHTML.replace(/^@/, '');
            span.classList.add(classes.mention);
        });

        const updatedHtml = doc.body.innerHTML;

        const sanitizedHtml = sanitizeHtml(updatedHtml, {
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'span'],
            allowedAttributes: {
                a: ['href'],
                span: ['class', 'data-id']
            }
        });

        setSanitizedComment(sanitizedHtml);
    }, [comment.comment_text]);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('user_id');
        if (storedUserId) {
            setUserId(Number(storedUserId));
        }
    }, []);

    useEffect(() => {
        if (
            (filterCommentId !== undefined || filterCommentId !== null) &&
            filterCommentId == comment?.id
        ) {
            setHighlight(true);
            const timer = setTimeout(() => {
                setHighlight(false);
            }, 20000);
            return () => clearTimeout(timer);
        }
    }, [filterCommentId, comment?.id, enableHighlight]);

    const statusChange = async () => {
        const resolved = isResolved;
        try {
            setLoadingValues({ resolve: true });
            setIsResolved(() => !resolved);
            const params = {
                payload: {
                    comment_id: comment?.id,
                    status: resolved ? 'unresolved' : 'resolved'
                }
            };
            await status(params);

            setNotification({
                severity: 'success',
                message: `Comment ${resolved ? 'set back to "unresolved"' : 'resolved'}`
            });
            onRemoveComment(comment.id, resolved ? 'unresolved' : 'resolved');
            setLoadingValues({ resolve: false });
        } catch (err) {
            setLoadingValues({ resolve: false });
            console.error(err);
            setIsResolved(() => resolved);
            setNotification({
                severity: 'warning',
                message: 'error while changing status'
            });
        }
    };

    const bookmarkChange = async () => {
        const ismarked = isBookmarked;
        try {
            setLoadingValues({ bookmark: true });
            setIsBookmarked(() => !ismarked);
            const params = {
                payload: {
                    comment_id: comment?.id,
                    bookmarked: !ismarked
                }
            };
            await bookmark(params);
            setNotification({
                severity: 'success',
                message: `Comment ${ismarked ? ' is off the bookmarked list' : 'bookmarked'}`
            });
            setLoadingValues({ bookmark: false });
        } catch (err) {
            setLoadingValues({ bookmark: false });
            setIsBookmarked(() => ismarked);
            console.error(err);
            setNotification({
                severity: 'warning',
                message: 'error while bookmarking comment'
            });
        }
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        // Save logic here
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleBookmarkToggle = () => {
        bookmarkChange();
    };

    const handleResolveToggle = () => {
        statusChange();
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleCopyLink = async () => {
        const filters = {};
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        url.search = '';
        filters['url'] = url;
        filters['linkType'] = 'copy';
        filters['comment'] = comment.id;
        if (widget_id) {
            filters['widget'] = widget_id;
            filters['widget_name'] = widget_name;
        } else filters['screen'] = comment?.app_screen_id;
        filters['selected_filters'] = screenLevelFilterState;
        try {
            const payload = {
                filters: filters
            };
            setLoading(true);
            const filterId = await addFilter(payload);
            if (!filterId) throw new Error('Error while generating link');
            url.searchParams.set('filters', filterId);
            navigator.clipboard
                .writeText(url.href)
                .then(() => {
                    setNotification({
                        severity: 'success',
                        message: 'Comment link copied'
                    });
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                    setNotification({
                        severity: 'error',
                        message: 'Error  while copying the comment link'
                    });
                });
        } catch (err) {
            setLoading(false);
            console.error(err);
            setNotification({
                severity: 'error',
                message: 'Error  while generating the comment link'
            });
        }
    };

    const confirmHandler = async () => {
        try {
            setLoading(true);
            await commentDeleteStateChange(comment.id, comment.deleted_at ? 'undelete' : 'delete');
            onRemoveComment(comment.id, comment.deleted_at ? 'undelete' : 'delete');
            setLoading(false);
        } catch (err) {
            setNotification({
                severity: 'error',
                message: 'Comment Deleted'
            });
            console.error('err');
            setLoading(false);
        }
    };

    let dialogContent = (
        <span className={classes.dialogContent}>
            <span>{`Are you sure you want to ${
                comment?.deleted_at ? 'Undelete' : 'Delete'
            } this comment thread ?`}</span>
            <br></br>
            <br></br>
        </span>
    );
    let dialogTitle = <span className={classes.dialogTitle}>Delete Thread</span>;
    const alertDialogActions = (
        <>
            <Button
                variant="outlined"
                onClick={() => setDialogOpen(false)}
                className={classes.cancel}
                aria-label="Cancel"
            >
                Cancel
            </Button>
            <Button
                aria-label="Delete Comment"
                variant="contained"
                className={classes.proceed}
                onClick={() => {
                    confirmHandler();
                }}
            >
                yes, Proceed
            </Button>
        </>
    );

    let dialogApproveContent = (
        <span className={classes.dialogContent}>
            <span>{`Are you sure you want to ${approval} this request?`}</span>
            <br></br>
            <br></br>
        </span>
    );
    let dialogApproveTitle = <span className={classes.dialogTitle}>Confirmation</span>;
    const alertDialogApproveActions = (
        <>
            <Button
                variant="outlined"
                onClick={() => setDialogApprove(false)}
                className={classes.cancel}
                aria-label="Cancel"
            >
                Cancel
            </Button>
            {approval === 'accept' ? (
                <Button
                    aria-label="Yes"
                    variant="contained"
                    className={classes.proceed}
                    onClick={() => {
                        editAcceptApproval(approvalId, 'Approved');
                    }}
                >
                    Accept
                </Button>
            ) : (
                <Button
                    aria-label="Yes"
                    variant="contained"
                    className={classes.proceed}
                    onClick={() => {
                        editAcceptApproval(approvalId, 'Denied');
                    }}
                >
                    Deny
                </Button>
            )}
        </>
    );

    const handleThreadLevelSubscription = () => {
        setLoadingValues({ subscription_setting: true });
        const payload = {
            comment_id: comment.id,
            subscription_setting: !subscription_setting,
            callback: onSaveSubscription
        };
        saveThreadLevelSetting(payload);
    };

    const onSaveSubscription = (severity) => {
        if (severity === 'success') {
            setSubscriptionSetting((preValue) => !preValue);
            setNotification({
                severity: 'success',
                message: `Successfully  ${
                    subscription_setting ? 'disabled' : 'enabled'
                } thread notification`
            });
        } else {
            setNotification({
                severity: 'error',
                message: `Could not save thread notification`
            });
        }
        setLoadingValues({ subscription_setting: false });
    };

    const editAcceptApproval = async (approval_id, status) => {
        setDialogApprove(false);
        let payloadsend = { payload: { approval_id: approval_id, status: status } };
        await editApprovalStatus(payloadsend);
        refreshComments();
        dispatch(getNotifications({ payload: { app_id: app_info.id } }));
    };

    const approvalPopup = (value, approval_id) => {
        setApprovalId(approval_id);
        setApproval(value);
        setDialogApprove(true);
    };

    return (
        <div
            className={`${classes.commentContainer} ${
                userId == comment.created_by ? classes.commentHovered : ''
            }`}
        >
            <div className={classes.bookmarkResolveContainer}>
                {highlight && (shouldOpen || isScenarioLibrary) ? (
                    <div className={classes.pulseContainer}>
                        <div className={classes.pulsatingCircle}></div>
                        {linkType === 'new' ? (
                            <span className={classes.notificationMessage}>1 New Message</span>
                        ) : isScenarioLibrary && linkType !== 'new' ? (
                            <span className={classes.notificationMessage}>1 New Message</span>
                        ) : null}
                    </div>
                ) : null}

                <div className={classes.iconBar} disabled={loading}>
                    <div className={classes.firstIconBar}>
                        {screenSubscriptionDisbled ? (
                            <IconButton
                                onClick={handleThreadLevelSubscription}
                                className={`${classes.notificationButton} ${
                                    subscription_setting ? classes.subscriptionEnabled : ''
                                }`}
                            >
                                {loadingValues['subscription_setting'] ? (
                                    <CircularProgress
                                        className={classes.progress}
                                        center
                                        size={20}
                                    />
                                ) : (
                                    <NotificationsIcon />
                                )}
                            </IconButton>
                        ) : null}
                        <div className={classes.approverContainer}>
                            {mode === 'task' && (
                                <div className={classes.container}>
                                    {created_by === user_id ? (
                                        approvals.some(
                                            (approver) =>
                                                Number(approver.user_id) === Number(user_id) &&
                                                approver.status === 'pending'
                                        ) ? (
                                            approvals.map((approver) => {
                                                if (
                                                    Number(approver.user_id) === Number(user_id) &&
                                                    approver.status === 'pending'
                                                ) {
                                                    return (
                                                        <div
                                                            className={classes.buttonContainer}
                                                            key={approver.id}
                                                        >
                                                            <Button
                                                                className={classes.acceptButton}
                                                                onClick={() =>
                                                                    approvalPopup(
                                                                        'accept',
                                                                        approver.id
                                                                    )
                                                                }
                                                            >
                                                                Accept
                                                            </Button>
                                                            <Button
                                                                className={classes.denyButton}
                                                                onClick={() =>
                                                                    approvalPopup(
                                                                        'deny',
                                                                        approver.id
                                                                    )
                                                                }
                                                            >
                                                                Deny
                                                            </Button>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })
                                        ) : (
                                            <div className={classes.approverDetails}>
                                                <PeopleAltOutlinedIcon fontSize="large" />
                                                <span
                                                    className={classes.list}
                                                    onMouseEnter={handleMouseEnter}
                                                    onMouseLeave={handleMouseLeave}
                                                >
                                                    {approvedCount}/{totalApprovers}
                                                </span>
                                                {approvedCount === totalApprovers &&
                                                deniedCount === 0 ? (
                                                    <span className={classes.statusApproved}>
                                                        Approved
                                                    </span>
                                                ) : deniedCount === totalApprovers &&
                                                  approvedCount === 0 ? (
                                                    <span className={classes.statusDenied}>
                                                        Denied
                                                    </span>
                                                ) : null}
                                            </div>
                                        )
                                    ) : (
                                        <>
                                            {approvals.some(
                                                (approver) =>
                                                    Number(approver.user_id) === Number(user_id) &&
                                                    approver.status === 'pending'
                                            )
                                                ? approvals.map((approver) => {
                                                      if (
                                                          Number(approver.user_id) ===
                                                              Number(user_id) &&
                                                          approver.status === 'pending'
                                                      ) {
                                                          return (
                                                              <div
                                                                  className={
                                                                      classes.buttonContainer
                                                                  }
                                                                  key={approver.id}
                                                              >
                                                                  <Button
                                                                      className={
                                                                          classes.acceptButton
                                                                      }
                                                                      onClick={() =>
                                                                          approvalPopup(
                                                                              'accept',
                                                                              approver.id
                                                                          )
                                                                      }
                                                                  >
                                                                      Accept
                                                                  </Button>
                                                                  <Button
                                                                      className={classes.denyButton}
                                                                      onClick={() =>
                                                                          approvalPopup(
                                                                              'deny',
                                                                              approver.id
                                                                          )
                                                                      }
                                                                  >
                                                                      Deny
                                                                  </Button>
                                                              </div>
                                                          );
                                                      }
                                                      return null;
                                                  })
                                                : approvals.map((approver) => {
                                                      if (
                                                          Number(approver.user_id) ===
                                                          Number(user_id)
                                                      ) {
                                                          return (
                                                              <div
                                                                  className={
                                                                      classes.approverDetails
                                                                  }
                                                                  key={approver.id}
                                                              >
                                                                  <PeopleAltOutlinedIcon fontSize="large" />
                                                                  <span
                                                                      key={approver.id}
                                                                      className={classes.list}
                                                                      onMouseEnter={
                                                                          handleMouseEnter
                                                                      }
                                                                      onMouseLeave={
                                                                          handleMouseLeave
                                                                      }
                                                                  >
                                                                      <span>{`${approvedCount}/${totalApprovers}`}</span>
                                                                  </span>
                                                                  <div
                                                                      className={
                                                                          classes.statusBadgeUser
                                                                      }
                                                                      style={{
                                                                          backgroundColor:
                                                                              approver.status ===
                                                                              'Approved'
                                                                                  ? 'rgba(0, 128, 99, 0.1)'
                                                                                  : approver.status ===
                                                                                    'pending'
                                                                                  ? '#fff3cd'
                                                                                  : approver.status ===
                                                                                    'Denied'
                                                                                  ? 'rgba(214, 72, 72, 0.1)'
                                                                                  : '#e9ecef',
                                                                          color:
                                                                              approver.status ===
                                                                              'Approved'
                                                                                  ? '#008063'
                                                                                  : approver.status ===
                                                                                    'pending'
                                                                                  ? '#856404'
                                                                                  : approver.status ===
                                                                                    'Denied'
                                                                                  ? '#D64848'
                                                                                  : '#6c757d'
                                                                      }}
                                                                  >
                                                                      {approver.status}
                                                                  </div>
                                                              </div>
                                                          );
                                                      }
                                                      return null;
                                                  })}
                                        </>
                                    )}
                                    <div className={classes.parentContainer}>
                                        <div
                                            className={`${classes.approvalContainer} ${
                                                isHovered ? classes.approvalContainerVisible : ''
                                            }`}
                                        >
                                            {Array.isArray(approvals) && approvals.length > 0
                                                ? approvals.map((approver) => (
                                                      <div
                                                          key={approver.id}
                                                          className={classes.approverRow}
                                                      >
                                                          <Avatar
                                                              className={classes.approvalAvatar}
                                                              style={{
                                                                  backgroundColor: stringToColor(
                                                                      approver.name?.trim()?.length
                                                                          ? approver.name
                                                                          : 'System'
                                                                  )
                                                              }}
                                                          >
                                                              {approver.initials ||
                                                                  approver.name
                                                                      .slice(0, 2)
                                                                      .toUpperCase()}
                                                          </Avatar>
                                                          <div className={classes.nameContainer}>
                                                              {approver.name}
                                                          </div>
                                                          <div
                                                              className={classes.statusBadge}
                                                              style={{
                                                                  backgroundColor:
                                                                      approver.status === 'Approved'
                                                                          ? 'rgba(0, 128, 99, 0.1)'
                                                                          : approver.status ===
                                                                            'pending'
                                                                          ? '#fff3cd'
                                                                          : approver.status ===
                                                                            'Denied'
                                                                          ? 'rgba(214, 72, 72, 0.1)'
                                                                          : '#e9ecef',
                                                                  color:
                                                                      approver.status === 'Approved'
                                                                          ? '#008063'
                                                                          : approver.status ===
                                                                            'pending'
                                                                          ? '#856404'
                                                                          : approver.status ===
                                                                            'Denied'
                                                                          ? '#D64848'
                                                                          : '#6c757d'
                                                              }}
                                                          >
                                                              {approver.status}
                                                          </div>
                                                      </div>
                                                  ))
                                                : null}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={classes.toolsContainer}>
                        <Tooltip
                            title={isResolved && !loading ? 'Unresolve' : 'Resolve'}
                            classes={{ tooltip: classes.iconTooltip, arrow: classes.arrow }}
                            arrow
                        >
                            <IconButton
                                className={isResolved ? classes.resolved : classes.resolveIcon}
                                onClick={handleResolveToggle}
                                disabled={loading || comment.deleted_at}
                            >
                                {' '}
                                {loadingValues['resolve'] ? (
                                    <CircularProgress
                                        className={classes.progress}
                                        center
                                        size={34}
                                    />
                                ) : null}
                                {isResolved && !loading ? (
                                    <ResolvedIcon color="primary" />
                                ) : (
                                    <ResolvedIcon />
                                )}
                            </IconButton>
                        </Tooltip>
                        <Tooltip
                            title="Bookmark"
                            classes={{ tooltip: classes.iconTooltip, arrow: classes.arrow }}
                            arrow
                        >
                            <IconButton
                                className={classes.bookmarkIcon}
                                onClick={handleBookmarkToggle}
                                disabled={loading || comment.deleted_at || isResolved}
                            >
                                {loadingValues['bookmark'] ? (
                                    <CircularProgress
                                        className={classes.progress}
                                        center
                                        size={34}
                                    />
                                ) : null}
                                {
                                    <BookmarkIcon
                                        className={`${
                                            isBookmarked ? classes.bookMarkFilled : classes.bookMark
                                        }`}
                                    />
                                }
                            </IconButton>
                        </Tooltip>
                        <Tooltip
                            title="Options"
                            classes={{ tooltip: classes.iconTooltip, arrow: classes.arrow }}
                            arrow
                        >
                            <IconButton className={classes.menuIcon} onClick={handleMenuOpen}>
                                <MoreVertIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        className={classes.menu}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right'
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left'
                        }}
                        getContentAnchorEl={null}
                    >
                        <MenuItem
                            className={classes.menuItem}
                            onClick={handleCopyLink}
                            disabled={comment?.deleted_at || isResolved || loading}
                            data-testid="CopyLink"
                        >
                            Copy Link
                        </MenuItem>
                        {comment.created_by === userId && (
                            <MenuItem
                                disabled={loading}
                                className={classes.menuItem}
                                onClick={() => {
                                    setDialogOpen(true);
                                }}
                            >{`${
                                comment?.deleted_at ? 'Undelete Thread' : 'Delete Thread'
                            }`}</MenuItem>
                        )}
                    </Menu>
                </div>
            </div>
            <div className={classes.header}>
                <span className={classes.avatarWrapper}>
                    <Avatar className={classes.avatar}>
                        {comment.user_name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                </span>
                <Typography className={classes.name}>{comment.user_name}</Typography>
                <DateDisplay createdAt={comment.created_at} />
            </div>
            {isEditing ? (
                <CommentEdit
                    commentText={''}
                    onChange={() => {}}
                    onSave={handleSaveClick}
                    onCancel={handleCancelClick}
                />
            ) : (
                <>
                    <Typography
                        variant="body2"
                        className={classes.content}
                        dangerouslySetInnerHTML={{ __html: sanitizedComment }}
                    />
                    {comment.attachments && comment.attachments.length > 0 && (
                        <div className={classes.attachmentContainer}>
                            {comment.attachments
                                .slice(0, 3)
                                .map((item) => JSON.parse(item))
                                .map((attachment, index) => (
                                    <AttachmentCard
                                        key={index}
                                        fileUrl={attachment?.url}
                                        fileName={attachment.name}
                                        fileSize={attachment.size}
                                    />
                                ))}
                        </div>
                    )}
                </>
            )}
            {scenario_list?.length > 0 && (
                <div className={classes.scenarioDetails}>
                    <span className={classes.scenarioName}>Scenarios:</span>
                    <span className={classes.scenarioList}>{scenario_list.join(', ')}</span>
                </div>
            )}

            {replies?.length ? (
                <div className={classes.replyContainer}>
                    {comment.replies?.length >= 3 ? (
                        <Button
                            className={classes.showButton}
                            onClick={() => setShowAllReplies((prev) => !prev)}
                        >
                            {`${showAllReplies ? 'show less' : 'show all replies'}`}
                            {showAllReplies ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </Button>
                    ) : null}

                    {replies?.map((reply, index) => {
                        return (
                            <Reply
                                key={index}
                                reply={reply}
                                comment={comment}
                                index={index}
                            ></Reply>
                        );
                    })}
                </div>
            ) : null}
            {!isResolved && !comment.deleted_at ? (
                <div className={classes.replyAddContainer}>
                    <Avatar className={classes.replyAvatar}>
                        {userFirstName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <ReplyAdd
                        comment={comment}
                        users={users}
                        userName={userFirstName}
                        refreshComments={refreshComments}
                        widget_id={widget_id}
                        screenName={screenName}
                        widget_name={widget_name}
                    />
                </div>
            ) : null}
            <CustomSnackbar
                open={notificationOpen?.message}
                autoHideDuration={2000}
                onClose={() => setNotification({})}
                severity={notificationOpen?.severity}
                message={notificationOpen?.message}
            />
            <CodxPopupDialog
                open={dialogOpen}
                setOpen={setDialogOpen}
                onClose={() => setDialogOpen(false)}
                dialogTitle={dialogTitle}
                dialogContent={dialogContent}
                dialogActions={alertDialogActions}
                maxWidth="xs"
                dialogClasses={classes}
            />
            <CodxPopupDialog
                open={dialogApprove}
                setOpen={setDialogApprove}
                onClose={() => setDialogApprove(false)}
                dialogTitle={dialogApproveTitle}
                dialogContent={dialogApproveContent}
                dialogActions={alertDialogApproveActions}
                maxWidth="xs"
                dialogClasses={classes}
            />
        </div>
    );
};

export default Comment;
