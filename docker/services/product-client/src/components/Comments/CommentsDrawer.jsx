import React, { useEffect, useState } from 'react';
import {
    IconButton,
    makeStyles,
    useTheme,
    Menu,
    MenuItem,
    Checkbox,
    Button,
    Divider,
    Tooltip,
    CircularProgress,
    Select,
    InputBase
} from '@material-ui/core';
import CloseIcon from '../../assets/Icons/CloseBtn';
import ScreenFilterIcon from '../../assets/Icons/ScreenFilterIcon';
import { getComments } from '../../services/comments';
import CommentAdd from './CommentAdd';
import { getUsers } from '../../services/project';
import CommentsList from './CommentsList';
import CodxCircularLoader from '../../components/CodxCircularLoader.jsx';
import NoComments from './NoComments';
import ResetIcon from '@material-ui/icons/Refresh';
import CustomSnackbar from '../../components/CustomSnackbar.jsx';
import { useSelector } from 'react-redux';
import Badge from '@material-ui/core/Badge';
import { KeyboardArrowDown } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    body: {
        position: 'fixed',
        right: '-50rem',
        bottom: 0,
        zIndex: '9999',
        width: '25.55%',
        height: '95%',
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.border.loginGrid}`,
        padding: '1.5rem',
        paddingTop: '0',
        transition: 'right 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column'
    },
    bodyVisible: {
        right: 0
    },
    commentTitle: {
        fontSize: '2.2rem',
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.default,
        fontWeight: '500'
    },
    titlePane: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`,
        minHeight: '5rem'
    },
    closeButton: {
        margin: '0 !important',
        padding: '0.8rem',
        '& svg': {
            fill: theme.palette.text.contrastText,
            width: '1.6rem',
            height: '1.6rem'
        }
    },
    filterButton: {
        margin: '0 !important',
        padding: '0.8rem',
        position: 'relative',
        '& svg': {
            width: '2rem',
            height: '2rem'
        }
    },
    badge: {
        backgroundColor: theme.palette.border.tableDivider,
        color: '#ffffff',
        top: '0px',
        right: '0px',
        fontSize: '1.3rem',
        display: 'flex',
        alignItems: 'center',
        height: '1.8rem',
        minHeight: '1.8rem',
        width: '1.8rem',
        minWidth: '1.8rem'
    },
    addCommentContainer: {
        marginTop: '2rem',
        fontSize: '1.6rem',
        color: theme.palette.text.default,
        letterSpacing: '0.5px'
    },
    dropdownMenu: {
        padding: 0,
        margin: 0,
        fontFamily: theme.body.B5.fontFamily,
        '& .MuiList-padding': {
            padding: 0
        }
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '1.3rem',
        color: theme.palette.text.default,
        padding: '1rem !important',
        height: '4.5rem',
        minHeight: '4.5rem',
        fontFamily: theme.body.B5.fontFamily,
        '&:hover': {
            background: 'none'
        }
    },
    buttonMenuItem: {
        width: 'full',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
        fontSize: '1.3rem',
        height: '4.5rem',
        minHeight: '4.5rem',
        color: theme.palette.text.default,
        '&:hover': {
            background: 'none'
        }
    },
    checkbox: {
        marginRight: '0.1rem',
        color: theme.palette.text.contrastText,
        padding: '1rem'
    },
    resetButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
        width: '70%',
        height: '3rem',
        textTransform: 'none',
        background: 'none',
        fontSize: '1.3rem',
        color: theme.palette.text.contrastText,
        '& svg': {
            width: '1.8rem',
            height: '1.8rem'
        }
    },
    buttonDivider: {
        backgroundColor: theme.palette.border.loginGrid
    },
    progress: {
        color: theme.palette.text.contrastText,
        stroke: theme.palette.text.contrastText
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
    subtitlePanel: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '0.2rem',
        marginTop:'-0.3rem',
        height:'2.5rem'
    },
    subTitleDropdown: {
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: '500',
        fontSize: '2rem',
        cursor: 'pointer',
        width: 'fit-content',
        underline:'none'
    },
    selectIcon: {
        fontSize: '3rem',
        color: theme.palette.text.default
    },
    dropdownItemConversation:{
        '&.Mui-selected': {
            backgroundColor:'#DFEBF8'
        },
        '&.Mui-selected:hover': {
            backgroundColor: '#F2F5F5',
        },
        minHeight: '5rem',
        marginTop:'-1.2rem',
    },
    dropdownItemTask:{
        '&.Mui-selected': {
            backgroundColor:'#DFEBF8'
        },
        '&.Mui-selected:hover': {
            backgroundColor: '#F2F5F5',
        },
        minHeight: '5rem',
        marginBottom:'-1.3rem',
    }
}));

const CommentsDrawer = (props) => {
    const classes = useStyles();
    const {
        onClose,
        appId,
        screenId,
        shouldOpen,
        shouldOpenHandler,
        shouldOpenLibraryHandler,
        filterWidgetId,
        filterCommentId,
        filterScreenId,
        linkType,
        screenName,
        app_info,
        isScenarioLibrary,
        askNucliosOpen,
        enableHighlight
    } = props;
    const widget_id = useSelector((state) => state.createStories.widgetOpenId);
    const widget_name = useSelector((state) => state.createStories.widgetOpenName);
    const [visible, setVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resolved, setResolved] = useState(null);
    const [unresolved, setUnresolved] = useState(null);
    const [bookmarked, setBookmarked] = useState(null);
    const [deleted, setDeleted] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationOpen, setNotification] = useState({});
    const theme = useTheme();
    const filtersApplied = resolved || unresolved || bookmarked == true || deleted == true;
    const [filtersCount, setFiltersCount] = useState(0);
    const [view, setView] = useState('conversation');
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const usersResponse = await getUsers();
            setUsers(usersResponse);
        } catch (error) {
            setNotification({
                severity: 'warning',
                message: 'Error while fetching users'
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
        return () => {
            onClose();
        };
    }, []);
  
    useEffect(() => {
        if (askNucliosOpen === true) {
            handleClose(); 
        }
    }, [askNucliosOpen]);

    useEffect(() => {
        if(isScenarioLibrary){
            refreshComments();
        }
            
    }, [isScenarioLibrary]);
    

    useEffect(() => {
        let getCommentParams = {
            payload: {
                app_id: appId,
                app_screen_id: screenId,
                widget_id: widget_id,
                include_deleted: deleted,
                bookmarked: bookmarked,
                resolved: resolved,
                unresolved: unresolved
            }
        };
        sendReq(getCommentParams);
    }, [resolved, unresolved, bookmarked, deleted]);

    useEffect(() => {
        const count = [resolved, unresolved, bookmarked, deleted].reduce(
            (acc, curr) => acc + (curr !== null ? 1 : 0),
            0
        );
        setFiltersCount(count);
    }, [resolved, unresolved, bookmarked, deleted]);

    const sendReq = async (getCommentParams, from = 'default') => {
        try {
            setLoading(true);
            const data = await getComments(getCommentParams);
            let commentsArray = data['comments'];
            if (filterCommentId) {
                const matchingComment = commentsArray.find(comment =>
                    comment.id === filterCommentId &&
                    Array.isArray(comment.scenario_list) &&
                    comment.scenario_list.length > 0
                );
                if (matchingComment) {
                    shouldOpenLibraryHandler(true, null, true, filterCommentId);
                }
            }

            if (isScenarioLibrary) {
                commentsArray = commentsArray.filter(comment => 
                    Array.isArray(comment.scenario_list) && comment.scenario_list.length > 0
                );
            }
            else{
                commentsArray = commentsArray.filter(comment => 
                    comment.scenario_list === null || (Array.isArray(comment.scenario_list) && comment.scenario_list.length === 0)
                );
            }
    
            if (from == 'add') {
                setBookmarked(null);
                setDeleted(null);
                setResolved(null);
                setUnresolved(null);
                setComments(commentsArray);
            } 
            if (from !== 'add'){
                setComments(commentsArray);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setNotification({
                severity: 'warning',
                message: 'Error while fetching comments'
            });
        }
    };
    

    const refreshComments = (from = 'default') => {  
        let getCommentParams = {
            payload: {
                app_id: appId,
                app_screen_id: screenId,
                widget_id: widget_id,
                include_deleted: deleted,
                bookmarked: bookmarked,
                resolved: resolved,
                unresolved: unresolved
            }
        };
        if (from !== 'reply') shouldOpenHandler();
        sendReq(getCommentParams, from);
    };

    useEffect(() => {
        setVisible(true);

        if (props.screenId && props.screenId !== screenId) {
            setVisible(false);
            onClose();
        }

        return () => {
            setVisible(false);
            onClose();
        };
    }, [props?.screenId]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
        if (props.onCloseDrawer) {
            props.onCloseDrawer();
        }
        shouldOpenHandler();
        
        if(props.widgetComment){
        props.updateWidgetComment();
        }
    };

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const handleCheckboxChange = (event, filter) => {
        const isChecked = event.target.checked;
        switch (filter) {
            case 'bookmarked':
                setBookmarked(isChecked ? true : null);
                break;
            case 'resolved':
                setResolved(isChecked ? 'resolved' : null);
                if (isChecked) setUnresolved(null);
                break;
            case 'unresolved':
                setUnresolved(isChecked ? 'unresolved' : null);
                if (isChecked) setResolved(null);
                break;
            case 'deleted':
                setDeleted(isChecked ? true : null);
                break;
            default:
                break;
        }
    };

    const handleReset = () => {
        setBookmarked(null);
        setDeleted(null);
        setResolved(null);
        setUnresolved(null);
    };

    const removeComment = (id, type) => {
        const newComments = comments.filter((item) => item?.id !== id);
        setComments(newComments);
        shouldOpenHandler();
        setNotification({
            severity: 'success',
            message: `${
                type == 'delete'
                    ? 'Comment Deleted'
                    : type == 'undelete'
                    ? 'Comment Removed From Deleted Threads'
                    : type == 'resolved'
                    ? 'Comment resolved'
                    : 'Comment unresolved'
            }`
        });
    };
    return (
        <div className={`${classes.body} ${visible ? classes.bodyVisible : ''}`}>
            <div className={classes.titlePane}>
                <span className={classes.commentTitle}>Collaborator</span>
                <span>
                    <Tooltip
                        title="Filters"
                        classes={{ tooltip: classes.iconTooltip, arrow: classes.arrow }}
                        arrow
                    >
                        <IconButton className={classes.filterButton} onClick={handleFilterClick}>
                            <Badge badgeContent={filtersCount} classes={{ badge: classes.badge }}>
                                <ScreenFilterIcon color={theme.palette.text.contrastText} />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleFilterClose}
                        className={classes.dropdownMenu}
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
                        {[
                            {
                                label: 'Bookmarked',
                                value: bookmarked === true,
                                filter: 'bookmarked'
                            },
                            {
                                label: 'Resolved',
                                value: resolved == 'resolved',
                                filter: 'resolved'
                            },
                            {
                                label: 'Unresolved',
                                value: unresolved == 'unresolved',
                                filter: 'unresolved'
                            },
                            { label: 'Deleted', value: deleted === true, filter: 'deleted' }
                        ].map((item, index) => (
                            <MenuItem key={index} className={classes.menuItem} disabled={loading}>
                                <Checkbox
                                    checked={item.value}
                                    onChange={(e) => handleCheckboxChange(e, item.filter)}
                                    className={classes.checkbox}
                                />
                                {item.label}
                            </MenuItem>
                        ))}
                        <Divider className={classes.buttonDivider} />
                        <MenuItem className={classes.buttonMenuItem} onClick={handleReset}>
                            {loading ? (
                                <span>
                                    <CircularProgress
                                        className={classes.progress}
                                        center
                                        size={20}
                                    />
                                </span>
                            ) : null}
                            <Button className={classes.resetButton}>
                                <ResetIcon style={{ marginRight: '0.5rem' }} />
                                Reset
                            </Button>
                        </MenuItem>
                    </Menu>
                    <Tooltip
                        title="Close"
                        classes={{ tooltip: classes.iconTooltip, arrow: classes.arrow }}
                        arrow
                    >
                        <IconButton className={classes.closeButton} onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </span>
            </div>
            <div className={classes.addCommentContainer}>
                <div className={classes.subtitlePanel}>
                    <label htmlFor="viewSelect">Add Text</label>
                    <Select
                        id="viewSelect"
                        value={view}
                        onChange={(e) => setView(e.target.value)}
                        className={classes.subTitleDropdown}
                        IconComponent={KeyboardArrowDown}
                        input={<InputBase disableUnderline />}
                        classes={{
                            icon: classes.selectIcon
                        }}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    
                                }
                            },
                            getContentAnchorEl: null,
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'left'
                            },
                            transformOrigin: {
                                vertical: 'top',
                                horizontal: 'left'
                            }
                        }}
                    >
                        <MenuItem
                            key="conversation"
                            value="conversation"
                            className={classes.dropdownItemConversation}
                        >
                            Conversation
                        </MenuItem>
                        <MenuItem key="task" value="task" className={classes.dropdownItemTask}>
                            Task
                        </MenuItem>
                    </Select>
                </div>
                {view === 'conversation' && (
                    <CommentAdd
                        users={users}
                        screenId={screenId}
                        appId={appId}
                        refreshComments={refreshComments}
                        widget_id={widget_id}
                        filterWidgetId={filterWidgetId}
                        filterCommentId={filterCommentId}
                        filterScreenId={filterScreenId}
                        linkType={linkType}
                        screenName={screenName}
                        widget_name={widget_name}
                        mode="conversation"
                        selectedScenarios={props.selectedScenarios ? props.selectedScenarios : []}
                    />
                )}
                {view === 'task' && (
                    <CommentAdd
                        users={users}
                        screenId={screenId}
                        appId={appId}
                        refreshComments={refreshComments}
                        widget_id={props.widget_id}
                        filterWidgetId={props.filterWidgetId}
                        filterCommentId={props.filterCommentId}
                        filterScreenId={props.filterScreenId}
                        linkType={props.linkType}
                        screenName={props.screenName}
                        widget_name={props.widget_name}
                        mode="task"
                        selectedScenarios={props.selectedScenarios ? props.selectedScenarios : []}
                    />
                )}
            </div>
            {loading ? <CodxCircularLoader center size={60} /> : null}
                <CommentsList
                    comments={comments}
                    users={users}
                    onRemoveComment={removeComment}
                    shouldOpen={shouldOpen}
                    refreshComments={refreshComments}
                    filterWidgetId={filterWidgetId}
                    filterCommentId={filterCommentId}
                    filterScreenId={filterScreenId}
                    linkType={linkType}
                    screenName={screenName}
                    widget_name={widget_name}
                    screenId={screenId}
                    app_info={app_info}
                    isScenarioLibrary={isScenarioLibrary}
                    shouldOpenLibraryHandler={shouldOpenLibraryHandler}
                    enableHighlight={enableHighlight}
                />
            {!comments?.length && !loading ? <NoComments filtersApplied={filtersApplied} /> : null}
            <CustomSnackbar
                open={notificationOpen?.message}
                autoHideDuration={2000}
                onClose={() => setNotification({})}
                severity={notificationOpen?.severity}
                message={notificationOpen?.message}
            />
        </div>
    );
};

export default CommentsDrawer;
