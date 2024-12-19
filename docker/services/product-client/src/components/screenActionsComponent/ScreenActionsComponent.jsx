import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { getScreenActionSettings } from '../../services/screen';
import ActionButton from './actionComponents/ActionButton';
import { DownloadLink } from './actionComponents/DownloadLink';
import PopupForm from './actionComponents/PopupForm';
import { TextList } from './actionComponents/TextList';
import { ToasterNotification } from './actionComponents/ToasterNotification';
import { WidgetListModal } from './actionComponents/WidgetListModal';
import ToggleSwitch from '../custom/CodxToggleSwitch';
import { makeStyles, IconButton, Popover, Box } from '@material-ui/core';
import { ReactComponent as MoreIcon } from './assets/MoreIcon.svg';
import { ReactComponent as CloseIcon } from './assets/CloseIcon.svg';
import { ReactComponent as CommentMoreIcon } from './assets/CommentMoreIcon.svg';
import Tooltip from '@material-ui/core/Tooltip';
import { ReactComponent as CommentIcon } from '../../assets/img/CommentButton.svg';
import CodxComponentMarquee from 'components/Experimental/codxComponentMarquee/codxComponentMarquee';

const useStyles = makeStyles((theme) => ({
    screenActionsHidden: {
        display: 'none !important'
    },
    commentsTab: {
        color: theme.palette.text.contrastText,
        display: 'flex',
        position: 'absolute',
        right: '1rem',
        // top: "6rem", //
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        fontSize: '2rem',
        fontWeight: '500',
        // marginRight: "1rem",
        padding: '1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        '& svg': {
            width: '2rem',
            height: '2rem',
            stroke: `${theme.palette.text.contrastText} !important`,
            fill: theme.palette.text.constratText
        },
        '&:hover': {
            background: theme.palette.background.selected
        }
    },
    commentsTabOnSelected: {
        color: theme.palette.text.contrastText,
        display: 'flex',
        right: '1rem',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        fontSize: '2rem',
        fontWeight: '500',
        padding: '1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        '& svg': {
            width: '2rem',
            height: '2rem',
            stroke: `${theme.palette.text.contrastText} !important`,
            fill: theme.palette.text.constratText
        },
        '&:hover': {
            background: theme.palette.background.selected
        }
    },
    moreVertClass: {
        color: theme.palette.text.contrastText,
        right: '1rem',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        fontSize: '2rem',
        fontWeight: '500',
        padding: '1rem',
        borderRadius: '4px',
        position: 'relative',
        marginLeft: '2rem',
        cursor: 'pointer',
        '& svg': {
            width: '2rem',
            height: '2rem',
            stroke: `${theme.palette.text.contrastText} !important`,
            fill: theme.palette.text.constratText
        },
        '&:hover': {
            background: theme.palette.background.selected
        }
    },
    commentsTabOpen: {
        background: theme.palette.background.menuItemFocus,
        '&:hover': {
            background: theme.palette.background.menuItemFocus
        }
    },
    popoverContent: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: theme.spacing(1),
        gap: theme.spacing(1),
        width: 'auto',
        maxWidth: '90vw',
        justifyContent: 'space-between',
        minWidth: '7vh'
    },
    iconButton: {
        padding: '0rem',
        top: '0.8rem',
        right: '0.8rem',
        zIndex: 2,
        '&:hover': {
            background: 'none'
        }
    },
    closeButton: {
        height: '3rem',
        width: '3rem'
    },
    moreButton: {
        height: '3rem',
        width: '3rem'
    },
    commentMoreButton: {
        height: '3rem',
        width: '3rem'
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
    }
}));

export default function ScreenActionsComponent({
    screen_id,
    app_id,
    selected_filter,
    preview,
    onDownloadPDF,
    onDownloadPNG,
    commentsOpen,
    askNucliosOpen,
    handleClick,
    commentEnabled,
    breadcrumb,
    updateScreenTab,
    isTabNavBar,
    ...props
}) {
    const [actionSettings, setActionSettings] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const classes = useStyles();
    const isPopoverOpen = Boolean(anchorEl);
    const tabNavBarCount = actionSettings?.actions?.filter(
        (action) => action.position?.portal === 'tab_nav_bar'
    )
    useEffect(() => {
        (async () => {
            const res = await getScreenActionSettings({
                app_id: app_id,
                screen_id: screen_id,
                selected_filter: selected_filter
            });
            setActionSettings(res);
        })();
    }, [screen_id, app_id, selected_filter]);

    const commentSpan = () => {
        return (
            <span
                key="comment_icon"
                onClick={handleClick}
                className={`${(commentsOpen || askNucliosOpen) && actionSettings?.actions.length >= 2 && tabNavBarCount?.length>=2
                        ? classes.moreVertClass
                        : commentsOpen || askNucliosOpen
                            ? classes.commentsTabOnSelected
                            : classes.commentsTab
                    }
                ${commentsOpen ? classes.commentsTabOpen : ''}`}
            >
                <CommentIcon />
                {!((commentsOpen || askNucliosOpen) && actionSettings?.actions.length >= 2 && tabNavBarCount?.length>=2) && 
                    'Collaboration'}
            </span>
        );
    };
    const showCommentIcon = () => {
        return commentEnabled ? (
            actionSettings?.actions.length >= 2 && (commentsOpen || askNucliosOpen) && tabNavBarCount.length>=2 ? (
                <Tooltip
                    title="Collaborator"
                    classes={{ tooltip: classes.iconTooltip, arrow: classes.arrow }}
                    arrow
                >
                    {commentSpan()}
                </Tooltip>
            ) : (
                commentSpan()
            )
        ) : null;
    };

    useEffect(() => {
        actionSettings?.actions?.map((el) => {
            if ((el.position?.portal !== 'tab_nav_bar' && tabNavBarCount?.length<2) || !showCommentIcon()) {
                    updateScreenTab(true);
            }
            else{
                if(isTabNavBar){
                    updateScreenTab(false)
                }
            }
        })
    },[actionSettings])

    const screenActions = (el, isLastAction) => {
        const screenactionArray = [
            el.component_type === 'popup_form' && (
                <PopupForm
                    key={'popup_form'}
                    screen_id={screen_id}
                    app_id={app_id}
                    action_type={el.action_type}
                    params={
                        props.toggleCheck
                            ? el.params.toggleRight || el.params
                            : el.params.toggleLeft || el.params
                    }
                />
            ),
            el.component_type === 'button' && (
                <ActionButton
                    key={'action_button'}
                    screen_id={screen_id}
                    app_id={app_id}
                    id={'action_button'}
                    action_type={el.action_type}
                    params={el.params}
                />
            ),
            el.component_type === 'download_link' && (
                <DownloadLink
                    key={'download_link'}
                    screen_id={screen_id}
                    app_id={app_id}
                    action_type={el.action_type}
                    params={el.params}
                    onDownloadPDF={onDownloadPDF}
                    onDownloadPNG={onDownloadPNG}
                    actionSettings={actionSettings}
                    commentsOpen={commentsOpen}
                    askNucliosOpen={askNucliosOpen}
                    fileName={el.fileName}
                    tabNavBarCount={tabNavBarCount}
                />
            ),
            el.component_type === 'content_link' && (
                <DownloadLink
                    key={'content_link'}
                    screen_id={screen_id}
                    app_id={app_id}
                    action_type={el.action_type}
                    params={el.params}
                    onDownloadPDF={onDownloadPDF}
                    onDownloadPNG={onDownloadPNG}
                    actionSettings={actionSettings}
                    fileName={el.fileName}
                    commentsOpen={commentsOpen}
                    askNucliosOpen={askNucliosOpen}
                    tabNavBarCount={tabNavBarCount}
                />
            ),
            el.component_type === 'filecontent_link' && (
                <DownloadLink
                    key={'filecontent_link'}
                    screen_id={screen_id}
                    app_id={app_id}
                    action_type={el.action_type}
                    params={el.params}
                    onDownloadPDF={onDownloadPDF}
                    onDownloadPNG={onDownloadPNG}
                    actionSettings={actionSettings}
                    fileName={el.fileName}
                    commentsOpen={commentsOpen}
                    askNucliosOpen={askNucliosOpen}
                    tabNavBarCount={tabNavBarCount}
                />
            ),
            el.component_type === 'notification' && (
                <ToasterNotification
                    key={'notification'}
                    screen_id={screen_id}
                    app_id={app_id}
                    action_type={el.action_type}
                    params={el.params}
                    aria-label="notification"
                />
            ),
            el.component_type === 'text_list' && (
                <TextList
                    key={'text_list'}
                    screen_id={screen_id}
                    app_id={app_id}
                    action_type={el.action_type}
                    params={el.params}
                />
            ),
            el.component_type === 'widget_list_modal' && (
                <WidgetListModal
                    key={'text_list'}
                    screen_id={screen_id}
                    app_id={app_id}
                    action_type={el.action_type}
                    params={el.params}
                />
            ),
            el.component_type === 'marquee_slider' && (
                <CodxComponentMarquee
                    key={'marquee_slider'}
                    screen_id={screen_id}
                    app_id={app_id}
                    action_type={el.action_type}
                    params={{ ...el.params, ...el.position }}
                />
            ),
            el.component_type === 'toggle_switch' && (
                <ToggleSwitch
                    key={'toggle_switch'}
                    onChange={props.toggleChange}
                    elementProps={el.params}
                    classes={el.params?.classes ? el.params?.classes : ''}
                    data-testid="toggle-switch"
                />
            ),
            isLastAction && breadcrumb && el.position?.portal === 'tab_nav_bar' && showCommentIcon()
        ].filter(Boolean);
        return (
            screenactionArray
        )
    };

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const MoreVert = (isLastAction) => {
        if (!isLastAction) return null;
    
        if (tabNavBarCount?.length < 2) return null;
        return (
            <>
                <IconButton
                    aria-label={isPopoverOpen ? 'close options' : 'more options'}
                    onClick={isPopoverOpen ? handlePopoverClose : handlePopoverOpen}
                    className={classes.iconButton}
                >
                    {isPopoverOpen ? (
                        <CloseIcon className={classes.closeButton} />
                    ) : commentsOpen ? (
                        <Tooltip
                            title="Options"
                            classes={{ tooltip: classes.iconTooltip, arrow: classes.arrow }}
                            arrow
                        >
                            <CommentMoreIcon className={classes.commentMoreButton} />
                        </Tooltip>
                    ) : (
                        <Tooltip
                            title="Options"
                            classes={{ tooltip: classes.iconTooltip, arrow: classes.arrow }}
                            arrow
                        >
                            <MoreIcon className={classes.moreButton} />
                        </Tooltip>
                    )}
                </IconButton>
                <Popover
                    open={isPopoverOpen}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: 'right',
                    }}
                    PaperProps={{
                        style: {
                            width: 'auto',
                            maxWidth: '90vw',
                        },
                    }}
                >
                    <Box className={classes.popoverContent}>
                    {tabNavBarCount?.map((el, index) => (
                        <div key={index} className={classes.popoverActionItem}>
                            {screenActions(el, index === tabNavBarCount?.length - 1)}
                        </div>
                    ))}
                    </Box>
                </Popover>
            </>
        );
    };

    if (actionSettings?.actions) {
    
        return (
            <>
                {actionSettings.actions.map((el, i) => {
                    return (
                        <ScreenActionPositionWrapper
                            key={i}
                            position={el.position}
                            preview={preview}
                            component_type={el.component_type}
                        >
                            {((breadcrumb && commentsOpen) || askNucliosOpen) &&
                                tabNavBarCount?.length >= 2 &&
                                el.position?.portal === 'tab_nav_bar'
                                ? MoreVert(i === actionSettings?.actions.length - 1)
                                : screenActions(el, i === actionSettings?.actions.length - 1)}
                        </ScreenActionPositionWrapper>
                    );
                })}

                {/* {props.displayGuides && (
                    <ScreenActionPositionWrapper
                        key="userGuide"
                        position={{ portal: 'tab_nav_bar' }}
                        preview={preview}
                    >
                        <UserGuide app_id={app_id} screen_id={screen_id} onData={videoRender} />
                    </ScreenActionPositionWrapper>
                )} */}
            </>
        );
    } else {
        return (
            <>
                {/* {props.displayGuides && (
                    <ScreenActionPositionWrapper
                        key="userGuide"
                        position={{ portal: 'tab_nav_bar' }}
                        preview={preview}
                    >
                        <UserGuide app_id={app_id} screen_id={screen_id} onData={videoRender} />
                    </ScreenActionPositionWrapper>
                )} */}
            </>
        );
    }
}

function ScreenActionPositionWrapper({ children, position, preview, component_type }) {
    const domNode = document.getElementById(
        preview ? `preview_screen_action-${position.portal}` : `screen_action-${position.portal}`
    );
    if (component_type === 'popup_form') {
        if (domNode) {
            domNode.style['top'] = '6rem';
            domNode.style['right'] = '1.1rem';
        }
    } else {
        if (position.style) {
            for (const property in position.style) {
                if (domNode) domNode.style[property] = position.style[property];
            }
        }
    }

    if (domNode) {
        return ReactDOM.createPortal(children, domNode);
    } else return null;
}