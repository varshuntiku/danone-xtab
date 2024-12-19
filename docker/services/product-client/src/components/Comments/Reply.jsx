import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
// import IconButton from '@material-ui/core/IconButton';
// import EditIcon from '@material-ui/icons/Edit';
import AttachmentCard from './AttachmentCard';
import CustomSnackbar from '../../components/CustomSnackbar.jsx';
import DateDisplay from './DateDisplay.jsx';
import sanitizeHtml from 'sanitize-html-react';

// Simple hashing function to generate unique colors
const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 60%)`;
    return color;
};

const useStyles = makeStyles((theme) => ({
    commentContainer: {
        width: '100%',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        marginBottom: theme.spacing(1),
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
        padding: '0.5rem',
        '& svg': {
            width: '2rem',
            height: '2rem'
        }
    },
    resolveIcon: {
        padding: '0.5rem',
        '& svg': {
            width: '2rem',
            height: '2rem'
        }
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
    iconBar: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 'auto'
    },
    menu: {
        '& .MuiList-padding': {
            padding: 0
        },
        '& .MuiListItem-button:hover': {
            background: theme.palette.background.selected
        }
    },
    menuItem: {
        height: '1rem !important'
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
        backgroundColor: theme.palette.background.selected,
        '& svg': {
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
        fontSize: '1.5rem'
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
    }
}));

const Reply = ({ reply }) => {
    const classes = useStyles({
        userName: reply.user_name?.trim()?.split(' ')?.[0]?.toLowerCase() || ' '
    });
    const [isEditing] = useState(false);
    const [sanitizedComment, setSanitizedComment] = useState('');
    const [userId, setUserId] = useState(null);
    const [notificationOpen, setNotification] = useState({});

    useEffect(() => {
        if (!reply || !reply.reply_text) {
            setSanitizedComment('');
            return;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(reply.reply_text, 'text/html');

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
    }, [reply.reply_text]);

    useEffect(() => {
        // Retrieve and parse the user_id from sessionStorage
        const storedUserId = sessionStorage.getItem('user_id');
        if (storedUserId) {
            setUserId(Number(storedUserId));
        }
    }, []);

    // const handleEditClick = () => {
    //     setIsEditing(true);
    // };

    return (
        <div
            className={`${classes.commentContainer} ${
                userId == reply.created_by ? classes.commentHovered : ''
            }`}
        >
            <div className={classes.header}>
                <span className={classes.avatarWrapper}>
                    {' '}
                    <Avatar className={classes.avatar}>
                        {reply?.user_name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                </span>
                <Typography className={classes.name}>{reply?.user_name}</Typography>
                <DateDisplay createdAt={reply?.created_at} />
                {/* <IconButton className={classes.editIcon} onClick={handleEditClick} style={{ marginLeft: 'auto' }} title='edit'>
        <EditIcon fontSize="small" />
      </IconButton> */}
            </div>
            {isEditing ? (
                <></>
            ) : (
                //   <CommentEdit
                //     commentText={""}
                //     onChange={(e) => setCommentText(e.target.value)}
                //     onSave={handleSaveClick}
                //     onCancel={handleCancelClick}
                //   />
                <>
                    <Typography
                        variant="body2"
                        className={classes.content}
                        dangerouslySetInnerHTML={{ __html: sanitizedComment }}
                    />
                    {reply.attachments && reply.attachments.length > 0 && (
                        <div className={classes.attachmentContainer}>
                            {reply.attachments
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

export default Reply;
