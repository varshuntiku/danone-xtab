import {
    Button,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    alpha,
    makeStyles
} from '@material-ui/core';
import React, { useCallback, useRef, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    loadConversationWindowList,
    createNewConversation,
    changeChatWindow,
    updateConversationWindow,
    deleteConversationWindow
} from '../../store';
import DoneIcon from '@material-ui/icons/Done';
import moment from 'moment';
import { grey } from '@material-ui/core/colors';
import clsx from 'clsx';
import AddIcon from '@material-ui/icons/Add';
// import StarBorderIcon from '@material-ui/icons/StarBorder';
// import StarIcon from '@material-ui/icons/Star';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PromptHistory from './PromptHistory';
import { ReactComponent as MsgFilledIcon } from 'assets/Icons/msg_filled.svg';
import { ReactComponent as MsgOutliedIcon } from 'assets/Icons/msg_outlined.svg';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        width: '100%',
        padding: theme.spacing(2, 0),
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2)
    },
    searchInput: {
        padding: theme.spacing(1 / 2, 1),
        borderRadius: theme.spacing(1 / 2),
        background: alpha(theme.palette.primary.light, 0.5),
        '& .MuiInputBase-root': {
            fontSize: '1.6rem',
            fontWeight: '300',
            color: theme.palette.text.default,
            '&:before': {
                display: 'none'
            },
            '&:after': {
                display: 'none'
            },
            '& svg': {
                color: alpha(theme.palette.text.default, 0.7)
            }
        }
    },
    convoWindowName: {
        flex: 1,
        '& .MuiInputBase-root': {
            fontSize: '1.6rem',
            fontWeight: '300',
            color: theme.palette.text.default,
            '&:before': {
                display: 'none',
                borderColor: theme.palette.text.default
            },
            '&:after': {
                borderColor: theme.palette.text.default
            },
            '&:hover:before': {
                display: 'unset',
                borderColor: theme.palette.text.default
            },
            '&.Mui-disabled': {
                '&:before': {
                    display: 'none'
                }
            },
            '& svg': {
                color: theme.palette.text.default
            }
        }
    },
    chatWindowItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(1 / 2),
        padding: theme.spacing(2, 1),
        borderRadius: theme.spacing(1),
        position: 'relative',
        opacity: '0.7',
        cursor: 'pointer',
        transitionDuration: '300ms',
        '&:hover': {
            background: theme.palette.background.hover,
            opacity: '1',
            '& $starIcon': {
                visibility: 'visible'
            },
            '& $deleteIcon': {
                visibility: 'visible'
            }
        },
        '&:focus-within': {
            opacity: '1'
        },
        '&::after': {
            content: `''`,
            position: 'absolute',
            bottom: 0,
            width: 'calc(100% - 1rem)',
            transform: 'translate(-50%, 0)',
            left: '50%',
            borderBottom: `1px solid ${alpha(grey[500], 0.2)}`
        }
    },
    chatWindowItemSeclted: {
        background: theme.palette.primary.light + ' !important',
        opacity: 1,
        '& $chatIcon': {
            color: theme.palette.primary.contrastText,
            fill: theme.palette.primary.contrastText
        },
        '&:hover': {
            '& $deleteIcon': {
                visibility: 'visible'
            }
        }
    },
    row1: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1)
    },
    row2: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        paddingLeft: '3rem'
    },
    text1: {
        fontSize: '1.6rem',
        color: theme.palette.text.default
    },
    subText1: {
        fontSize: '1.2rem',
        color: alpha(theme.palette.text.default, 0.7)
    },
    chatIcon: {
        color: theme.palette.text.default,
        fill: theme.palette.text.default,
        width: '2rem',
        height: '2rem'
    },
    starIcon: {
        color: alpha(theme.palette.text.default, 0.7),
        visibility: 'hidden'
    },
    windowListContainer: {
        maxHeight: '75rem',
        overflow: 'auto'
    },
    pinnedIcon: {
        visibility: 'visible'
    },
    expandBtn: {
        '& svg': {
            transition: 'transform 500ms',
            fontSize: '3.5rem',
            color: alpha(theme.palette.text.default, 0.7)
        }
    },
    expandedBtn: {
        '& svg': {
            transform: 'rotate(180deg)'
        }
    },
    row3: {
        height: 0,
        minHeight: 0,
        overflow: 'hidden',
        transition: 'all 500ms'
    },
    expandedRow: {
        height: 'auto',
        minHeight: '10rem'
    },
    deleteIcon: {
        visibility: 'hidden',
        opacity: '0.4',
        '& svg': {
            color: theme.palette.text.default
        },
        '&:hover': {
            opacity: 1
        }
    }
}));

export default function ConversationWindows({ minervaAppId }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const {
        conversationWindowsLoaded,
        conversationWindows,
        selectedWindowId,
        loadingConversation
    } = useSelector((d) => d.minerva);
    useEffect(() => {
        if (!conversationWindowsLoaded) {
            dispatch(loadConversationWindowList({ minervaAppId }));
        }
    }, []);

    const handleCreateNewChat = useCallback(() => {
        dispatch(createNewConversation());
    }, []);

    const handleWindowChange = (window) => {
        if (selectedWindowId !== window.id && !loadingConversation) {
            dispatch(
                changeChatWindow({
                    minervaAppId: minervaAppId,
                    windowId: window.id
                })
            );
        }
    };

    return (
        <div className={classes.root}>
            <div>
                <Button
                    startIcon={<AddIcon />}
                    size="small"
                    variant="outlined"
                    onClick={handleCreateNewChat}
                    aria-label="New chat"
                >
                    New Chat
                </Button>
            </div>
            <div>
                <div>
                    <TextField
                        className={classes.searchInput}
                        fullWidth
                        style={{ flex: 1 }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="large" />
                                </InputAdornment>
                            ),
                            endAdornment: search ? (
                                <InputAdornment position="end">
                                    <IconButton
                                        title="clear"
                                        onClick={() => setSearch('')}
                                        size="small"
                                        aria-label="Cleae"
                                    >
                                        <ClearIcon fontSize="large" />
                                    </IconButton>
                                </InputAdornment>
                            ) : null
                        }}
                        id="search"
                    />
                </div>
            </div>
            <div className={classes.windowListContainer}>
                {conversationWindows
                    .filter((el) => {
                        if (search) {
                            return el.title.toLowerCase().includes(search.toLowerCase());
                        } else return true;
                    })
                    .map((el) => (
                        <ChatWindowItem
                            key={el.id}
                            data={el}
                            classes={classes}
                            selected={el.id === selectedWindowId}
                            onSelect={() => handleWindowChange(el)}
                            minervaAppId={minervaAppId}
                        />
                    ))}
            </div>
        </div>
    );
}

function ChatWindowItem({ data, selected, minervaAppId, classes, onSelect }) {
    const [editOn, setEditOn] = useState(false);
    const inputRef = useRef();
    const [title, setTilte] = useState(data.title);
    // const [pinned, setPinned] = useState(data.pinned);
    const [expanded, setExpanded] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!selected) {
            setExpanded(false);
        }
    }, [selected]);

    const handleComplete = () => {
        setEditOn(false);
        dispatch(
            updateConversationWindow({
                payload: {
                    ...data,
                    title
                }
            })
        );
    };

    const handleStartEdit = () => {
        setEditOn(true);
        setTimeout(() => {
            inputRef.current.focus();
        }, 500);
    };

    // const handlePin = () => {
    //     setPinned(!pinned);
    //     dispatch(
    //         updateConversationWindow({
    //             payload: {
    //                 ...data,
    //                 pinned: !pinned
    //             }
    //         })
    //     );
    // };

    const handleExpand = () => {
        setExpanded((s) => !s);
    };

    const handleDelete = () => {
        dispatch(deleteConversationWindow(data.id));
    };

    return (
        <div
            className={clsx(classes.chatWindowItem, selected && classes.chatWindowItemSeclted)}
            onClick={onSelect}
        >
            <div className={classes.row1}>
                {selected ? (
                    // <ChatIcon fontSize="large" className={classes.chatIcon} />
                    <MsgFilledIcon className={classes.chatIcon} />
                ) : (
                    <MsgOutliedIcon className={classes.chatIcon} />
                )}
                <TextField
                    title={editOn ? null : 'double click to edit'}
                    className={classes.convoWindowName}
                    style={{ flex: 1 }}
                    value={title}
                    onChange={(e) => setTilte(e.target.value)}
                    inputRef={inputRef}
                    disabled={!selected || !editOn}
                    onDoubleClick={handleStartEdit}
                    InputProps={{
                        endAdornment: selected ? (
                            <InputAdornment position="end">
                                {editOn ? (
                                    <IconButton
                                        title="send"
                                        onClick={handleComplete}
                                        size="small"
                                        aria-label="Edit done"
                                    >
                                        <DoneIcon fontSize="large" />
                                    </IconButton>
                                ) : null}
                            </InputAdornment>
                        ) : null
                    }}
                    id={title}
                />
                <div onClick={(e) => e.stopPropagation()}>
                    <ConfirmPopup
                        onConfirm={handleDelete}
                        title={title.toUpperCase()}
                        subTitle="Delete conversation history. Are you sure?"
                    >
                        {(triggerConfirm) => (
                            <IconButton
                                className={classes.deleteIcon}
                                size="small"
                                onClick={triggerConfirm}
                                aria-label="Outline"
                            >
                                <DeleteOutlineIcon fontSize="large" />
                            </IconButton>
                        )}
                    </ConfirmPopup>
                </div>
            </div>
            <div className={classes.row2}>
                {/* {pinned ? (
                    <StarIcon
                        fontSize="large"
                        className={clsx(classes.starIcon, classes.pinnedIcon)}
                        onClick={handlePin}
                    />
                ) : (
                    <StarBorderIcon
                        fontSize="large"
                        className={classes.starIcon}
                        onClick={handlePin}
                    />
                )} */}
                <Typography variant="h4" className={classes.subText1}>
                    {moment(data.created_at).calendar()}
                </Typography>
                <div style={{ flex: 1 }}></div>
                {selected ? (
                    <IconButton
                        size="small"
                        className={clsx(classes.expandBtn, expanded && classes.expandedBtn)}
                        onClick={handleExpand}
                        aria-label="Expand more"
                    >
                        <ExpandMoreIcon fontSize="large" />
                    </IconButton>
                ) : null}
            </div>
            <div className={clsx(classes.row3, expanded && classes.expandedRow)}>
                {selected ? <PromptHistory minervaAppId={minervaAppId} /> : null}
            </div>
        </div>
    );
}
