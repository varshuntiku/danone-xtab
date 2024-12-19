import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendIcon from '@material-ui/icons/Send';
import CancelIcon from '@material-ui/icons/Cancel';
import DescriptionIcon from '@material-ui/icons/Description';
import LinearProgress from '@material-ui/core/LinearProgress';
import { MentionsInput, Mention } from 'react-mentions';
import { upload_file } from '../../common/utils';
import { addReply } from '../../services/comments.js';
import CustomSnackbar from '../../components/CustomSnackbar.jsx';
import { CircularProgress, Tooltip } from '@material-ui/core';
import UserListItem from './UserListItem';
import GetAppIcon from '@material-ui/icons/GetApp';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    replyBox: {
        marginTop: '1.2rem',
        width: '100%',
        padding: '0.8rem',
        boxSizing: 'border-box',
        transition: 'border 0.3s, height 0.3s',
        height: '4rem',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        marginBottom: '2rem',
        color: theme.palette.text.default,
        border: `1.5px solid ${theme.palette.border.grey}`,
        borderRadius: '3px',
        '&.focused': {
            border: `1.5px solid ${theme.palette.border.tableDivider}`,
            height: 'auto',
            minHeight: '14rem',
            borderRadius: '3px'
        }
    },
    textFieldWrapper: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    mentionInput: {
        minHeight: '6rem',
        width: '100%',
        border: 'none',
        outline: 'none',
        resize: 'none',
        fontSize: '1.6rem',
        lineHeight: '2rem',
        '& textarea': {
            border: 'none',
            color: `${theme.palette.text.default}`,
            outline: 'none',
            fontSize: '1.6rem',
            lineHeight: '2rem',
            letterSpacing: '0.5px'
        },
        '& textarea:focus': {
            border: 'none',
            outline: 'none'
        },
        '& .mention': {
            fontWeight: '400 !important',
            color: theme.palette.border.tableDivider,
            fontSize: '1.6rem !important',
            zIndex: '2000 !important',
            backgroundColor: theme.palette.background.paper,
            '& $.textarea': {
                color: `transparent !important`
            }
        },
        '& .mention__suggestions__list': {
            marginTop: '20px !important',
            zIndex: 1000,
            minHeight: '20rem',
            overflowY: 'auto'
        }
    },
    divider: {
        display: 'none',
        borderTop: `1px solid ${theme.palette.border.loginGrid}`,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    dividerFocused: {
        display: 'block'
    },
    actionButtons: {
        display: 'none',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '3rem'
    },
    actionButtonsFocused: {
        display: 'flex'
    },
    iconButton: {
        padding: theme.spacing(1)
    },
    rotatedAttachIcon: {
        transform: 'rotate(45deg)',
        width: '2.4rem',
        height: '2.4rem'
    },
    emojiIcon: {
        width: '2.4rem',
        height: '2.4rem'
    },
    sendButton: {
        padding: theme.spacing(0.5),
        '& .MuiSvgIcon-root': {
            width: '2.5rem',
            height: '2.5rem'
        }
    },
    attachmentContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        overflowY: 'auto',
        marginTop: '1.6rem'
    },
    attachmentCard: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
        width: '100%',
        height: '4rem',
        border: 'none',
        backgroundColor: `${theme.palette.background.attachment}`,
        borderRadius: '2px',
        padding: theme.spacing(1),
        position: 'relative'
    },
    fileIcon: {
        width: '1.6rem',
        height: '1.6rem'
    },
    fileName: {
        flexGrow: 1,
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        fontSize: '1.3rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '40%',
        maxWidth: '45%'
    },
    fileSize: {
        flexGrow: 1,
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        fontSize: '1.3rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '25%',
        maxWidth: '30%'
    },
    cancelIcon: {
        width: '1.6rem',
        height: '1.6rem'
    },
    downloadIcon: {
        width: '1.6rem',
        height: '1.6rem'
    },
    loadingBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        '& .MuiLinearProgress-barColorPrimary': {
            backgroundColor: theme.palette.text.contrastText
        }
    },
    warningText: {
        marginTop: '0.5rem',
        fontSize: '1.3rem',
        color: 'gray'
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

const AttachmentCard = ({ attachment, onDelete, isUploading, uploadProgress }) => {
    const classes = useStyles();
    const trimmedFileName =
        attachment?.name?.length > 20
            ? attachment?.name.substring(0, 20) + '...'
            : attachment?.name;

    return (
        <div className={classes.attachmentCard}>
            <DescriptionIcon className={classes.fileIcon} />
            <span className={classes.fileName}>{trimmedFileName}</span>
            <span className={classes.fileSize}>{attachment?.size}</span>
            {isUploading ? (
                <>
                    <span>{uploadProgress}%</span>
                    <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                        className={classes.loadingBar}
                    />
                </>
            ) : (
                <>
                    <IconButton size="small" href={attachment?.url} download>
                        <GetAppIcon className={classes.downloadIcon} />
                    </IconButton>
                    <IconButton size="small" onClick={onDelete}></IconButton>
                    <IconButton size="small" onClick={onDelete}>
                        <CancelIcon className={classes.cancelIcon} />
                    </IconButton>
                </>
            )}
        </div>
    );
};
const ReplyAdd = (props) => {
    const classes = useStyles(props);
    const [isFocused, setIsFocused] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [taggedUsers, setTaggedUsers] = useState([]);
    const [uploadingAttachment, setUploadingAttachment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [addingReply, setAdding] = useState(false);
    const [reply, setReply] = useState('');
    const [notificationOpen, setNotification] = useState({});
    const fileRef = useRef(null);
    const screenLevelFilterState = useSelector(
        (state) => state.createStories.screenLevelFilterState
    );
    const copyCommentLink = () => {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);

        url.search = '';
        return url.href;
    };

    useEffect(() => {
        let interval;

        if (loading) {
            interval = setInterval(() => {
                setUploadingAttachment((prev) => {
                    if (prev?.progress < 80) {
                        return { ...prev, progress: prev.progress + 20 };
                    }
                    return prev;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 500 * 1024) {
            setNotification({
                severity: 'warning',
                message: 'File size exceeds 500KB'
            });
            return;
        }

        event.target.value = null;

        const newAttachment = {
            name: file.name ?? 'anonymous',
            size: (file.size / 1024).toFixed(2) + ' KB',
            progress: 0
        };

        setLoading(true);
        setUploadingAttachment(newAttachment);

        const url = await upload_file(file);

        const attachment = {
            ...newAttachment,
            url: url.data?.path,
            progress: 100
        };

        setLoading(false);
        setUploadingAttachment(null);
        setAttachments((prev) => [...prev, attachment]);
    };

    const handleDeleteAttachment = (index) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleMentionChange = (event, newValue, newPlainTextValue, mentions) => {
        setReply(newValue);
        const newTaggedUsers = mentions.map((mention) => Number(mention.id));
        setTaggedUsers(newTaggedUsers);
    };
    const generateFiltersId = () => {
        const filters = {};
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);

        //clear if anything is present already
        url.search = '';
        filters['url'] = url;
        filters['linkType'] = 'new';
        if (props.widget_id) {
            filters['widget'] = props?.widget_id;
            filters['widget_name'] = props?.widget_name;
        } else filters['screen'] = props.screenId;
        filters['selected_filters'] = screenLevelFilterState;
        return filters;
    };

    const uploadReply = async () => {
        try {
            setAdding(true);
            let replyParams = {
                payload: {
                    comment_id: props.comment.id,
                    reply_text: reply,
                    attachments: attachments?.map((item) => JSON.stringify(item)),
                    tagged_users: taggedUsers,
                    link: copyCommentLink(),
                    filters: generateFiltersId(),
                    screen_name: props?.screenName,
                    widget_name: props?.widget_name
                }
            };
            await addReply(replyParams);
            setReply('');
            setAttachments([]);
            setTaggedUsers([]);
            setAdding(false);
            setIsFocused(false);
            setNotification({
                severity: 'success',
                message: 'Reply added successfully'
            });
            props?.refreshComments('reply');
        } catch (err) {
            setAdding(false);
            setNotification({
                severity: 'error',
                message: 'Error while adding a reply'
            });
            console.error(err);
        }
    };
    const handleKeyDown = (event) => {
        if (event.ctrlKey && event.key === 'Enter') {
            uploadReply();
        }
    };

    return (
        <div
            className={`${classes.replyBox} ${isFocused ? 'focused' : ''}`}
            onFocus={() => setIsFocused(true)}
        >
            <div className={classes.textFieldWrapper}>
                <MentionsInput
                    value={reply}
                    onChange={handleMentionChange}
                    className={classes.mentionInput}
                    placeholder="Add a reply"
                    style={{ border: 'none', outline: 'none' }}
                    onKeyDown={handleKeyDown}
                    allowSpaceInQuery={true}
                    suggestionsPortalHost={document.body}
                >
                    <Mention
                        trigger="@"
                        data={(search) => {
                            const searchParts = search?.trim()?.toLowerCase()?.split(' ');
                            return props.users
                                .filter((user) =>
                                    searchParts.every((part) =>
                                        user.name?.toLowerCase()?.includes(part)
                                    )
                                )
                                ?.slice(0, 3)
                                .map((user) => ({
                                    id: user.id,
                                    display: `${user?.name}`,
                                    ...user
                                }));
                        }}
                        appendSpaceOnAdd={true}
                        className="mention"
                        renderSuggestion={(entry, search, highlightedDisplay, index, focused) => (
                            <UserListItem
                                key={entry.id}
                                user={entry} // Now passing the full user object
                                highlightedDisplay={highlightedDisplay}
                                focused={focused}
                            />
                        )}
                        markup="<span class='mention' data-id='__id__'>@__display__</span>"
                    />
                </MentionsInput>
                <div className={classes.attachmentContainer}>
                    {loading && uploadingAttachment && (
                        <AttachmentCard
                            attachment={uploadingAttachment}
                            isUploading={true}
                            uploadProgress={uploadingAttachment.progress}
                        />
                    )}
                    {attachments.map((attachment, index) => (
                        <AttachmentCard
                            key={attachment.name}
                            attachment={attachment}
                            onDelete={() => handleDeleteAttachment(index)}
                            isUploading={false}
                        />
                    ))}
                </div>
                {attachments.length + (loading ? 1 : 0) > 0 && (
                    <div className={classes.warningText}>Maximum up to 3 files</div>
                )}
            </div>
            <div className={`${classes.divider} ${isFocused ? classes.dividerFocused : ''}`} />
            <div
                className={`${classes.actionButtons} ${
                    isFocused ? classes.actionButtonsFocused : ''
                }`}
            >
                <div>
                    <input
                        id="file-input"
                        type="file"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        ref={fileRef}
                        disabled={loading || attachments.length >= 3}
                        data-testid="file-upload"
                    />
                    <Tooltip
                        title="Attach"
                        classes={{ tooltip: classes.iconTooltip, arrow: classes.arrow }}
                        arrow
                    >
                        <IconButton
                            className={classes.iconButton}
                            component="span"
                            onClick={() => fileRef.current?.click()}
                            disabled={loading || attachments.length >= 3}
                        >
                            <AttachFileIcon className={classes.rotatedAttachIcon} />
                        </IconButton>
                    </Tooltip>
                </div>
                {!addingReply ? (
                    <Tooltip
                        title="Post"
                        classes={{ tooltip: classes.iconTooltip, arrow: classes.arrow }}
                        arrow
                    >
                        <IconButton
                            className={classes.sendButton}
                            onClick={uploadReply}
                            disabled={addingReply}
                        >
                            <SendIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <IconButton className={classes.sendButton} disabled={true}>
                        <CircularProgress center size={30} />
                    </IconButton>
                )}
            </div>
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

export default ReplyAdd;
