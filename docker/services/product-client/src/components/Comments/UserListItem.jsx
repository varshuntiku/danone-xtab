import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

// Simple hashing function to generate unique colors
const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str?.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 60%)`;
    return color;
};

const useStyles = makeStyles((theme) => ({
    userListItem: {
        display: 'flex',
        alignItems: 'center',
        height: '4rem',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        maxWidth: '30rem',
        textOverflow: 'ellipsis',
        backgroundColor: '#FFFFF',
        color: theme.palette.text.contrastText,
        '&:hover': {
            color: theme.palette.text.contrastText,
            backgroundColor: theme.palette.background.navLinkBackground
        }
    },
    avatar: {
        width: '3rem',
        height: '3rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        marginRight: '1rem'
    },
    userName: {
        fontSize: '1.4rem'
    }
}));

const UserListItem = ({ user }) => {
    const classes = useStyles();

    if (!user.name?.trim()?.length || user.email?.trim?.length) return;
    return (
        <div className={classes.userListItem}>
            <div
                className={classes.avatar}
                style={{
                    backgroundColor:
                        stringToColor(user?.name?.trim()?.split(' ')[0]?.toLowerCase()) ?? ' '
                }}
            >
                {user?.name?.trim()?.split(' ')[0]?.[0]?.toUpperCase() || 'N'}
            </div>
            <div className={classes.userName}>{user?.name ? user?.name?.trim() : 'Nuclios'}</div>
        </div>
    );
};

export default UserListItem;
