import React, { useEffect, useRef } from 'react';
import { createStyles, withStyles, makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import { deepOrange } from '@material-ui/core/colors';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import DescriptionIcon from '@material-ui/icons/Description';
import UndoIcon from '@material-ui/icons/Undo';
import CheckIcon from '@material-ui/icons/Check';
import { triggerWidgetActionHandler } from 'services/widget.js';
import Skeleton from '@material-ui/lab/Skeleton';
import CodxCircularLoader from './CodxCircularLoader.jsx';
import CustomSnackbar from './CustomSnackbar';
// Global variable to import moment-timezone dynamically
let momentTimezone = null;
const styles = (Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: Theme.spacing(2)
        },
        closeButton: {
            position: 'absolute',
            right: Theme.spacing(1),
            top: Theme.spacing(1),
            color: Theme.palette.grey[500],
            '& svg': {
                fontSize: 20
            }
        }
    });

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            fontSize: '1.8rem'
        },
        defaultIconSize: {
            '& svg': {
                fontSize: 16
            },
            padding: '12px'
        },
        defaultColor: {
            color: theme.palette.text.default
        },
        textInput: {
            color: theme.palette.text.default,
            fontSize: '2rem'
        },
        contrastColor: {
            borderColor: theme.palette.primary.contrastText
        },
        paper: {
            width: '80vw',
            height: '80vh',
            maxWidth: '500px',
            maxHeight: '700px',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            position: 'relative'
        },
        aper2: {
            width: '80vw',
            maxWidth: '500px',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            position: 'relative'
        },
        container: {
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        messagesBody: {
            width: 'calc( 100% - 20px )',
            margin: 10,
            overflowY: 'scroll',
            height: 'calc( 100% - 80px )'
        },
        messageRow: {
            display: 'flex',
            paddingBottom: '5px'
        },
        messageLeft: {
            position: 'relative',
            marginLeft: '13px',
            marginBottom: '10px',
            width: '90%',
            textAlign: 'justify',
            font: "400 .9em 'Open Sans', sans-serif",
            borderRadius: '10px'
        },
        titleSpan: {
            marginLeft: '13px'
        },
        messageContent: {
            padding: 0,
            margin: 0
        },
        messageContainer: {
            margin: '5px 20px'
        },
        orange: {
            marginTop: '12px',
            color: theme.palette.getContrastText(deepOrange[500]),
            backgroundColor: deepOrange[500],
            width: theme.spacing(6),
            height: theme.spacing(6)
        },
        avatarNothing: {
            color: 'transparent',
            backgroundColor: 'transparent',
            width: theme.spacing(9),
            height: theme.spacing(9)
        },
        displayName: {
            marginLeft: '13px',
            fontWeight: '500'
        },
        titleHeaders: {
            fontSize: '1.5rem'
        },
        boxModal: {
            fontSize: '2rem'
        },
        wrapForm: {
            display: 'flex',
            justifyContent: 'center',
            width: '95%',
            margin: `${theme.spacing(2)} auto`
        },
        inlineTextEdit: {
            width: '300px',
            '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.contrastText
                }
            },
            '& .MuiOutlinedInput-root:hover': {
                '& > fieldset': {
                    borderColor: theme.palette.primary.contrastText
                }
            }
        },
        wrapText: {
            width: '100%',
            '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.contrastText
                }
            },
            '& .MuiOutlinedInput-root:hover': {
                '& > fieldset': {
                    borderColor: theme.palette.primary.contrastText
                }
            }
        },
        button: {
            '& svg': {
                fontSize: 16
            },
            marginLeft: '1.3rem'
        },
        titleContainer: {
            display: 'flex'
        }
    })
);

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <div>{children}</div>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2)
    }
}))(MuiDialogContent);

const saveNotes = async (
    payload,
    handleLoaderChange,
    setNotificationOpen,
    setNotification,
    toastMessage,
    handleRollback
) => {
    try {
        await triggerWidgetActionHandler({
            ...payload,
            callback: (d) => {
                setNotificationOpen(true);
                const notification = {
                    message: toastMessage?.length ? `Note ${toastMessage} successfully !` : ''
                };
                if (d?.error) {
                    handleRollback();
                    setNotification({
                        message: 'Error saving you note. Try again !',
                        severity: 'error'
                    });
                } else {
                    setNotification({ ...notification, severity: 'success' });
                }
                handleLoaderChange(false);
            }
        });
    } catch (err) {
        handleLoaderChange(false);
    }
};

const TextInput = ({
    handleCommentAdd,
    isEdit,
    handleCommentEdit,
    preFill,
    handleLoaderChange
}) => {
    const classes = useStyles();
    const formRef = useRef();
    const [input, setInput] = React.useState(!isEdit ? '' : preFill);

    const handleInputChange = (e) => {
        e.preventDefault();
        setInput(e.target.value);
    };

    const handleButtonClick = () => {
        let toastMessage = '';
        if (input?.length) {
            if (isEdit) {
                handleLoaderChange(true);
                toastMessage = 'edited';
                handleCommentEdit(input, toastMessage);
            } else {
                formRef.current.reset();
                handleLoaderChange(true);
                toastMessage = 'added';
                handleCommentAdd(input, toastMessage);
            }
            setInput('');
        }
    };

    return (
        <div>
            <form
                ref={formRef}
                className={classes.wrapForm}
                noValidate
                autoComplete="off"
                onSubmit={(e) => e.preventDefault()}
            >
                <TextField
                    data-testid="outlined-basic"
                    className={!isEdit ? classes.wrapText : classes.inlineTextEdit}
                    inputProps={{ className: classes.textInput }}
                    InputLabelProps={{ style: { fontSize: '2rem' } }}
                    variant="outlined"
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                        e.key === 'Enter' && handleButtonClick();
                    }}
                    defaultValue={preFill}
                    InputProps={{
                        classes: {
                            root: classes.contrastColor,
                            notchedOutline: classes.contrastColor
                        }
                    }}
                    id="comment"
                />
                <Button
                    variant="contained"
                    color="default"
                    className={classes.button}
                    onClick={handleButtonClick}
                    disabled={!input?.length}
                    title="sendbutton"
                    aria-label="sendbutton"
                >
                    {!isEdit ? <SendIcon /> : <CheckIcon />}
                </Button>
            </form>
        </div>
    );
};

function MessageLeft({
    id,
    message,
    timestamp,
    photoURL,
    displayName,
    email,
    onEdit,
    onDelete,
    userEmail,
    enableRestriction,
    handleLoaderChange,
    dynamicPayload
}) {
    const [editComment, setEditComment] = React.useState(false);
    const classes = useStyles();
    message = message || 'no message';
    timestamp = timestamp || '';
    photoURL = photoURL || 'dummy.js';
    displayName = displayName || 'display name';

    const handleCommentEdit = (value, toastMessage = '') => {
        setEditComment(!editComment);
        onEdit(id, value, toastMessage);
    };

    const handleCommentDelete = () => {
        handleLoaderChange(true);
        onDelete(id);
    };

    return (
        <div className={classes.messageRow} key={id}>
            <Avatar
                alt={displayName}
                className={classes.orange}
                src={photoURL}
                classes={{ root: classes.root }}
            ></Avatar>
            <div className={classes.defaultColor}>
                <div className={classes.titleContainer}>
                    <div className={classes.displayName}>{`${displayName} - ${
                        momentTimezone &&
                        momentTimezone
                            .utc(timestamp)
                            .tz('America/Chicago')
                            .format('MM/DD/YYYY HH:mm')
                    }`}</div>
                    {!enableRestriction && email == userEmail && (
                        <div>
                            <IconButton
                                className={classes.defaultIconSize}
                                aria-label="edit"
                                onClick={handleCommentEdit}
                            >
                                {!editComment ? <EditIcon /> : <UndoIcon />}
                            </IconButton>
                            <IconButton
                                className={classes.defaultIconSize}
                                aria-label="delete"
                                onClick={handleCommentDelete}
                            >
                                <DeleteOutlinedIcon />
                            </IconButton>
                        </div>
                    )}
                </div>
                <div className={classes.messageLeft}>
                    <div>
                        {!editComment ? (
                            <p className={classes.messageContent}>{message}</p>
                        ) : (
                            <TextInput
                                isEdit={editComment}
                                handleCommentEdit={handleCommentEdit}
                                preFill={message}
                                handleLoaderChange={handleLoaderChange}
                                dynamicPayload={dynamicPayload}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const commentContent = (
    content,
    classes,
    handleCommentEdit,
    handleCommentDelete,
    userEmail,
    enableRestriction,
    handleLoaderChange,
    dynamicPayload
) => {
    const comments =
        content?.comments?.length &&
        // eslint-disable-next-line no-unsafe-optional-chaining
        [...content?.comments]
            .sort((a, b) => b?.id - a?.id)
            ?.map((comment, i) => (
                <MessageLeft
                    key={'messageLeft' + i}
                    id={comment?.id}
                    message={comment?.message}
                    timestamp={comment?.timestamp}
                    displayName={comment?.userName}
                    email={comment?.userEmail}
                    onEdit={handleCommentEdit}
                    onDelete={handleCommentDelete}
                    userEmail={userEmail}
                    enableRestriction={enableRestriction}
                    handleLoaderChange={handleLoaderChange}
                    dynamicPayload={dynamicPayload}
                />
            ));

    return content?.comments?.length ? (
        comments
    ) : (
        <Paper id="style-1" className={classes.messagesBody} />
    );
};

export default function CommentPopUp({ onChange, content, enableRestriction, dynamicPayload }) {
    dynamicPayload.payload.action_type = content.actionParams.name;
    const userName = sessionStorage.getItem('user_name');
    const userEmail = sessionStorage.getItem('user_email');
    const [open, setOpen] = React.useState(false);
    const [contentObj, setContentObj] = React.useState(content?.value);
    const [api, setApi] = React.useState(false);
    const [loader, setLoader] = React.useState(false);

    const classes = useStyles();
    const [toastMessage, setToastMessage] = React.useState('');
    const [notificationOpen, setNotificationOpen] = React.useState(false);
    const [notification, setNotification] = React.useState({ message: '', severity: 'success' });

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleLoaderChange = (loaderValue) => {
        setLoader(loaderValue);
    };

    const handleCommentAdd = (value, toastMessage) => {
        const contents = { ...contentObj };
        if (!contentObj?.comments) {
            contents['comments'] = [];
        }
        let id = (contentObj?.comments?.sort((a, b) => b?.id - a?.id)[0]?.id || 0) + 1;
        const comment = {
            id,
            userName,
            userEmail: userEmail,
            message: value,
            timestamp: momentTimezone?.utc().toISOString()
        };
        contents.comments.push(comment);
        setContentObj(contents);
        setToastMessage(toastMessage);
        setApi(true);
    };

    const handleCommentEdit = (commentId, value, toastMessage) => {
        if (value?.length) {
            const contents = { ...contentObj };
            const index = contents.comments.findIndex((comment) => comment.id == commentId);
            if (typeof value == 'string') {
                contents.comments[index].message = value;
            }
            setContentObj(contents);
            setToastMessage(toastMessage);
            setApi(true);
        }
    };

    const handleCommentDelete = (commentId) => {
        const contents = { ...contentObj };
        contents.comments = contents.comments.filter((comment) => !(comment.id == commentId));
        setContentObj(contents);
        setToastMessage('deleted');
        setApi(true);
    };

    const handleRollback = () => {
        const contents = { ...contentObj };
        contents?.comments?.length > 1
            ? contents.comments.sort((a, b) => b?.id - a?.id).shift()
            : (contents.comments = []);
        setContentObj(contents);
    };

    const handleSaveNotes = () => {
        saveNotes(
            dynamicPayload,
            handleLoaderChange,
            setNotificationOpen,
            setNotification,
            toastMessage,
            handleRollback
        );
        setApi(false);
    };

    useEffect(() => {
        onChange(contentObj);
    }, [contentObj]);

    useEffect(() => {
        if (api) {
            handleSaveNotes();
        }
    }, [api]);
    useEffect(() => {
        //dynamic rendering of moment-timezone
        const loadMomentTimezone = async () => {
            const packageModule = await import('moment-timezone');
            momentTimezone = packageModule.default;
        };
        loadMomentTimezone();
    }, []);

    return (
        <div className="comment-modal-popup">
            <div>
                <IconButton
                    className={classes.defaultIconSize}
                    title="Notes"
                    aria-describedby={'20-open'}
                    variant="contained"
                    onClick={handleClickOpen}
                    aria-label="Notes"
                >
                    {<DescriptionIcon />}
                </IconButton>
            </div>
            <Dialog
                aria-labelledby="customized-dialog-title"
                open={open}
                className={classes.boxModal}
                maxWidth="md"
                aria-describedby="comment popup dialog content"
            >
                <CustomSnackbar
                    open={notificationOpen && notification?.message}
                    autoHideDuration={
                        notification?.autoHideDuration === undefined
                            ? 2000
                            : notification?.autoHideDuration
                    }
                    onClose={() => setNotificationOpen(false)}
                    severity={notification?.severity || 'success'}
                    message={notification?.message}
                />
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    <div className={classes.defaultColor}>
                        {contentObj?.titleHeaders &&
                            Object.keys(contentObj?.titleHeaders).map((title, i) => (
                                <div key={'titleSpan' + i} className={classes.titleSpan}>
                                    <div className={classes.titleHeaders}>
                                        {title} - {contentObj?.titleHeaders[title]}
                                    </div>
                                </div>
                            ))}
                        <div className={classes.titleSpan}>
                            <div className={classes.titleHeaders}> {userEmail} </div>
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent
                    dividers
                    style={{ height: 400, minWidth: 650 }}
                    id="comment popup dialog content"
                >
                    {loader ? (
                        <div className={classes.graphLoader}>
                            <Skeleton
                                variant="rect"
                                animation="wave"
                                component="div"
                                width="100%"
                                height="100%"
                                className={classes.skeletonWave}
                            />
                            <CodxCircularLoader size={60} center />
                        </div>
                    ) : (
                        <div className={classes.messageContainer}>
                            {commentContent(
                                contentObj,
                                classes,
                                handleCommentEdit,
                                handleCommentDelete,
                                userEmail,
                                enableRestriction,
                                handleLoaderChange,
                                dynamicPayload
                            )}
                        </div>
                    )}
                </DialogContent>
                {!loader && !enableRestriction && (
                    <TextInput
                        handleCommentAdd={handleCommentAdd}
                        handleLoaderChange={handleLoaderChange}
                        dynamicPayload={dynamicPayload}
                        title="sendbutton"
                    />
                )}
            </Dialog>
        </div>
    );
}
