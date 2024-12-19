import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {IconButton, LinearProgress, CircularProgress, Tooltip, Avatar } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendIcon from '@material-ui/icons/Send';
import CancelIcon from '@material-ui/icons/Cancel';
import DescriptionIcon from '@material-ui/icons/Description';
import { MentionsInput, Mention } from 'react-mentions';
import { upload_file } from '../../common/utils';
import { addComment } from '../../services/comments';
import CustomSnackbar from '../../components/CustomSnackbar.jsx';
import UserListItem from './UserListItem';
import GetAppIcon from '@material-ui/icons/GetApp';
import { useSelector } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import { KeyboardArrowDown } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    commentBox: {
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
        '& .mentions__suggestions__list': {
            position: 'absolute',
            marginTop: '20px !important',
            zIndex: 1000,
            maxHeight: '50rem',
            overflowY: 'scroll'
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
            width: '2.6rem',
            height: '2.6rem'
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
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '50%'
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
    },
    avatar: {
        width: '2.6rem',
        height: '2.6rem',
        borderRadius: '50%',
        backgroundColor: '#ddd',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.5rem',
        color: 'white'
    },

    container: {
        marginTop: '10px',
        marginLeft: '1rem'
    },
    actionsLabel: {
        fontSize: '1.4rem',
        color: theme.palette.border.grey
    },
    approversContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginTop: '10px'
    },
    approverItem: {
        width: 'auto',
        display: 'flex',
        alignItems: 'center',
        marginRight: '10px',
        padding: '0.3rem',
        gap: '8px',
        borderRadius: '2rem',
        background: '#E9F2FB',
        fontSize: '1.4rem'
    },
    closeIcon:{'&:hover':{background: 'transparent'}},
    dropdown: {
        fontSize:'1.5rem',
        padding:'0.5rem',
        marginLeft:'-6rem',
        color:theme.palette.text.default,
        '&:hover':{
            background:'#F2F5F5',
            cursor:'pointer'
        }

    },
    approverDropdown: {
        color: theme.palette.text.default,
        border: 'none',
        fontWeight: '500',
        fontSize: '1.5rem',
        cursor: 'pointer',
        width: '20rem',
        height: '3rem',
    },

    dropdownWindow:{marginTop: '0.2rem',
        maxHeight: '15rem',
        overflowY: 'scroll',
        width: '42rem',
        border: '1px solid rgba(233, 238, 238, 1)',
        boxShadow: '0px 2px 2px 0px rgba(71, 139, 219, 0.1)',
        zIndex:'1',
        position:'fixed',
        background: 'rgba(255, 255, 255, 1)'

    },


    selectIcon: { fontSize: '3rem', color: theme.palette.text.default },
    menuItem: {
        height: '0.2rem',
        fontSize: '1.2rem'
    },

    scenarioName: {
        color: 'grey'
    },
    scenarioList: {
        color: theme.palette.text.default,
        fontWeight: '500',
        fontFamily: 'Graphik'
    },
    dropdownContainer: {
        margin: "2.8rem 0.1rem",
        position: "relative",
        border:'none'
    },
    relativeContainer: {
        position: "relative",
    },
    floatingLabel: {
        position: "absolute",
        backgroundColor: "#fff",
        padding: "0 5px",
        fontSize: "1.5rem",
        color: "rgba(71, 139, 219, 1)",
        top:'-1.6rem'

    },
    dropdownInputContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "5px",
        borderBottom: "1px solid #ccc",
        padding:'0.5rem 0.1rem',
        borderRadius: "4px",
        boxSizing: "border-box",
        cursor: "pointer",
        marginLeft:'-0.6rem',
    },
    approverTile: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: "4px",
        padding: "4px 8px",
        gap: "5px",
    },
    dropdownInput: {
        border: "none",
        outline: "none",
        fontSize:"1.7rem",
        width:'15rem',
        fontFamily:'Graphik',
        color:theme.palette.text.default
    },
    downArrow:{fontSize:'3rem',
        '& path': {
            fill: theme.palette.border.widgetFilterIcon
        }
    },

    dropdownOptions: {
        listStyleType: "none",
        padding: 0,
        margin: "5px 0 0 0",
        maxHeight: "150px",
        overflowY: "auto",
        border: "1px solid #ccc",
        borderRadius: "4px",
        backgroundColor: "#fff",
        position: "absolute",
        width: "100%",
        zIndex: 1000,
    },
    dropdownOptionItem: {
        padding: "8px",
        cursor: "pointer",
    },
    dropdownOptionEmail: {
        fontSize: "small",
        color: "#555",
    },
    dropdownNoOptions: {
        padding: "8px",
        color: "#888",
    },
    approverAvatar: {
        borderRadius: "50%",
    },
    customButton:{
        border:'1px solid rgba(0, 0, 0, 0.1)',
        padding:'0.3rem',
        fontFamily:'Graphik',
        fontWeight:'400',
        width:'12rem',
        marginTop:'1.5rem',
        color:theme.palette.text.default,
        fontSize:'14px'
    }
}));

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

const AttachmentCard = ({ attachment, onDelete, isUploading, uploadProgress }) => {
    const classes = useStyles();
    const trimmedFileName =
        attachment?.name?.length > 25
            ? attachment?.name.substring(0, 25) + '...'
            : attachment?.name;

    return (
        <div className={classes.attachmentCard}>
            <DescriptionIcon className={classes.fileIcon} />
            <span className={classes.fileName}>{trimmedFileName}</span>
            <span className={classes.fileName}>{attachment?.size}</span>
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
                    <IconButton size="small" onClick={onDelete}>
                        <CancelIcon className={classes.cancelIcon} />
                    </IconButton>
                </>
            )}
        </div>
    );
};

const CommentAdd = ({ mode = 'conversation', ...props }) => {
    const classes = useStyles();
    const [isFocused, setIsFocused] = useState(mode === 'conversation');
    const [attachments, setAttachments] = useState([]);
    const [taggedUsers, setTaggedUsers] = useState(['Meghana', 'NucliOS']);
    const [uploadingAttachment, setUploadingAttachment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [addingComment, setAdding] = useState(false);
    const [comment, setComment] = useState('');
    const [notificationOpen, setNotification] = useState({});
    const selectedScenario = props.selectedScenarios;
    const screenLevelFilterState = useSelector(
        (state) => state.createStories.screenLevelFilterState
    );
    const fileRef = useRef(null);
    const [search, setSearch] = useState("");
    const [selectedOption, setSelectedOption] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSelectOption = option => {
        const { id: user_id, display: name, ...rest } = option;
        if (!selectedOption.find((approver) => approver.user_id === user_id)) {
            setSelectedOption([...selectedOption, { user_id, name, ...rest }]);
        }
        setSearch("");
    };
    useEffect(() => {
        if (mode === 'task') {
            setIsFocused(true);
        }
    }, [mode]);

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

    useEffect(() => {
        const handleClickOutside = event => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
        setComment(newValue);
        const newTaggedUsers = mentions.map((mention) => Number(mention.id));
        setTaggedUsers(newTaggedUsers);
    };

    const copyCommentLink = () => {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        url.search = '';
        return url.href;
    };

    const generateFiltersId = () => {
        const filters = {};
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);

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

    const handleKeyDown = (event) => {
        if (event.ctrlKey && event.key === 'Enter') {
            uploadComment();
        }
    };

    const uploadComment = async () => {
        if (mode==='task' && (!selectedOption || selectedOption.length === 0)) {
            setNotification({
                message: 'Approver required',
                severity: 'warning',
            });
            return;}
        if (comment?.trim().length === 0) return;
        try {
            setAdding(true);
            let commentParams = {
                payload: {
                    app_id: props.appId,
                    app_screen_id: props.screenId,
                    widget_id: props.widget_id,
                    comment_text: comment,
                    bookmarked: false,
                    attachments: attachments?.map((item) => JSON.stringify(item)),
                    tagged_users: taggedUsers,
                    link: copyCommentLink(),
                    filters: generateFiltersId(),
                    screen_name: props?.screenName,
                    widget_name: props?.widget_name,
                    approvals: selectedOption,
                    mode: mode,
                    scenario_list: props?.selectedScenarios || []
                }
            };
            await addComment(commentParams);
            setComment('');
            setAttachments([]);
            setTaggedUsers([]);
            setSelectedOption([]);
            setAdding(false);
            setIsFocused('conversation');
            setNotification({
                severity: 'success',
                message: 'Comment added successfully'
            });
            props?.refreshComments('add');
        } catch (err) {
            console.error(err);
        }
    };

    const handleRemoveApprover = (userId) => {
        setSelectedOption((prev) => prev.filter((approver) => approver.user_id !== userId));
    };

    const renderScenarios = () => {
        if (selectedScenario && selectedScenario.length > 0) {
            return (
                <div>
                    <span className={classes.scenarioName}>Scenarios:</span>{' '}
                    <span className={classes.scenarioList}>
                        {props.selectedScenarios.join(', ')}
                    </span>
                </div>
            );
        }
        return null;
    };
    const filteredOptions = props.users.filter(
        option =>
            option.name.toLowerCase().includes(search.toLowerCase()) &&
            !selectedOption.some(selected => selected.id === option.id)
    );
    return (
        <div
            className={`${classes.commentBox} ${isFocused ? 'focused' : ''}`}
            onFocus={() => setIsFocused(true)}
        >
            <div className={classes.textFieldWrapper}>
                <MentionsInput
                    value={comment}
                    onChange={handleMentionChange}
                    className={classes.mentionInput}
                    placeholder="Add a comment"
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
                        renderSuggestion={(entry, highlightedDisplay, focused) => (
                            <UserListItem
                                key={entry.id}
                                user={entry}
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
                {renderScenarios()}
            </div>
            {mode === 'task' && (
                <div className={classes.container}>
                    <label className={classes.actionsLabel}>ACTIONS:</label>
                    <div ref={dropdownRef} className={classes.dropdownContainer}>
                        <div className={classes.relativeContainer}>
                            {isDropdownOpen && selectedOption.length >= 0 && (
                                <label className={classes.floatingLabel}>Select Approvers</label>
                            )}
                            <div
                                className={classes.dropdownInputContainer}
                                style={{
                                    borderBottom: isDropdownOpen ? "1px solid #ccc" : "none",
                                }}
                                onClick={() => setIsDropdownOpen(true)}
                            >
                                {isDropdownOpen &&
                                    selectedOption.map((approver) => (
                                        <div key={approver.id} className={classes.approverItem}>
                                        <Avatar className={classes.avatar}
                                         style={{
                                            backgroundColor: stringToColor(
                                                approver.name?.trim()?.length ? approver.name : 'System'
                                            )
                                        }}
                                        >
                                            {approver.name?.charAt(0)?.toUpperCase() || "A"}
                                        </Avatar>
                                        <span>{approver.name}</span>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveApprover(approver.user_id)}
                                            className={classes.closeIcon}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </div>
                                    ))}
                                <input
                                    type="text"
                                    placeholder={isDropdownOpen ? "" : "Add Approvers"}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className={classes.dropdownInput}
                                />
                                {!isDropdownOpen && <KeyboardArrowDown className={classes.downArrow}/>}
                            </div>
                        </div>
                        {isDropdownOpen && (
                            <ul className={classes.dropdownWindow}>
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map((option) => (
                                        <li
                                            key={option.id}
                                            onClick={() => handleSelectOption(option)}
                                            className={classes.dropdown}
                                            type="none"
                                        >
                                                {option.name}
                                        </li>
                                    ))
                                ) : (
                                    <li className={classes.dropdownNoOptions}>No options found</li>
                                )}
                            </ul>
                        )}
                        {!isDropdownOpen && selectedOption.length > 0 && (
                            <div className={classes.approversContainer}>
                                {selectedOption.map((approver) => (
                                    <div key={approver.id} className={classes.approverItem}>
                                        <Avatar className={classes.avatar}
                                         style={{
                                            backgroundColor: stringToColor(
                                                approver.name?.trim()?.length ? approver.name : 'System'
                                            )
                                        }}
                                        >
                                            {approver.name?.charAt(0)?.toUpperCase() || "A"}
                                        </Avatar>
                                        <span>{approver.name}</span>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveApprover(approver.user_id)}
                                            className={classes.closeIcon}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* <Button
                        className={classes.customButton}
                        >+ Custom</Button> */}
                    </div>
                </div>
            )
            }
            <div className={`${classes.divider} ${isFocused ? classes.dividerFocused : ''}`} />
            <div
                className={`${classes.actionButtons} ${isFocused ? classes.actionButtonsFocused : ''
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
                {!addingComment ? (
                    <Tooltip
                        title="Post"
                        classes={{ tooltip: classes.iconTooltip, arrow: classes.arrow }}
                        arrow
                    >
                        <IconButton
                            className={classes.sendButton}
                            onClick={uploadComment}
                            disabled={addingComment}
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
        </div >
    );
};

export default CommentAdd;
