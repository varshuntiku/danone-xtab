import { alpha, Avatar, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { green, grey } from '@material-ui/core/colors';
import { AvatarGroup } from '@material-ui/lab';
import React from 'react';
import clsx from 'clsx';
import ChatIcon from '@material-ui/icons/Chat';
import PersonIcon from '@material-ui/icons/Person';

const useStyles = makeStyles((theme) => ({
    currentUserContainer: {
        position: 'relative',
        cursor: 'pointer',
        '& .MuiAvatar-root': {
            border: '4px solid ' + green[500],
            fontWeight: 'bold',
            lineHeight: 'normal',
            color: grey[800],
            width: '4rem',
            height: '4rem',
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: '$ripple 1.2s infinite ease-in-out',
                border: '2px solid ' + grey[500],
                content: '""'
            }
        }
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0
        }
    },
    topRight: {
        position: 'absolute',
        top: '0.75rem',
        right: '0'
    },
    tooltip: {
        fontSize: '1.2rem',
        fontWeight: '400',
        maxWidth: 'unset',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        padding: '1rem',
        background: theme.palette.background.dialogBody,
        backdropFilter: 'blur(2rem)',
        boxShadow: '4px 6px 12px 6px ' + theme.palette.shadow.dark,
        '& .MuiTooltip-arrow': {
            color: theme.palette.primary.light
        }
    },
    link: {
        textDecoration: 'none',
        color: alpha(theme.palette.text.default, 0.7),
        display: 'flex',
        gap: '0.5rem'
    },
    chatIcon: {}
}));
export default function CurrentUsersAvatars({
    users = [],
    currentUser,
    orientation,
    max,
    enableTeamsCollaboration,
    teamsTopicName,
    teamsMessage
}) {
    const classes = useStyles();
    const participants = Object.values(
        (currentUser ? [...users, currentUser] : users).reduce((acc, b) => {
            b.avatarName = ((b.first_name?.[0] || '') + (b.last_name?.[0] || '') + b.email)
                .substr(0, 2)
                .toUpperCase();
            b.displayName = (
                b.first_name || b.last_name ? b.first_name + ' ' + b.last_name : b.email
            ).toUpperCase();
            acc[b.email] = b;
            return acc;
        }, {})
    );

    const groupChatLink = `https://teams.microsoft.com/l/chat/0/0?users=${participants
        .map((el) => el.email)
        .join(',')}&topicName=${teamsTopicName}&message=${teamsMessage}`;
    return (
        <Tooltip
            title={
                <>
                    {enableTeamsCollaboration ? (
                        <>
                            {participants.map((el) => {
                                const self = currentUser?.email === el.email;
                                return (
                                    <a
                                        key={el.email}
                                        href={
                                            self
                                                ? 'javascript:void(0)'
                                                : `https://teams.microsoft.com/l/chat/0/0?users=${el.email}&topicName=${teamsTopicName}&message=${teamsMessage}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={classes.link}
                                    >
                                        <div style={{ display: 'contents' }} title={el.email}>
                                            <PersonIcon />
                                        </div>
                                        <Typography
                                            variant="body"
                                            title={self ? '' : 'Chat in Teams'}
                                        >
                                            {el.displayName}
                                        </Typography>
                                        {self ? null : (
                                            <div
                                                style={{ display: 'contents' }}
                                                title={self ? '' : 'Chat in Teams'}
                                            >
                                                <ChatIcon className={classes.chatIcon} />
                                            </div>
                                        )}
                                    </a>
                                );
                            })}
                            {participants.length >= 3 ? (
                                <a
                                    href={groupChatLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={classes.link}
                                    style={{ marginTop: '1rem', alignItems: 'center' }}
                                >
                                    <Typography variant="h5" title="Chat in Teams">
                                        Chat with all...
                                    </Typography>
                                    <div style={{ display: 'contents' }} title="Chat in Teams">
                                        <ChatIcon className={classes.chatIcon} />
                                    </div>
                                </a>
                            ) : null}
                        </>
                    ) : (
                        participants.map((el) => (
                            <div key={el.email} className={classes.link}>
                                <div style={{ display: 'contents' }} title={el.email}>
                                    <PersonIcon />
                                </div>
                                <Typography variant="body" key={el.email} title={el.email}>
                                    {el.displayName}
                                </Typography>
                            </div>
                        ))
                    )}
                </>
            }
            classes={{ tooltip: classes.tooltip }}
            interactive
            arrow
            data-testid="tooltip"
        >
            <AvatarGroup
                max={max}
                className={clsx(
                    classes.currentUserContainer,
                    orientation === 'top-right' ? classes.topRight : ''
                )}
            >
                {participants.map((el) => (
                    <Avatar key={el.email}>{el.avatarName}</Avatar>
                ))}
            </AvatarGroup>
        </Tooltip>
    );
}
