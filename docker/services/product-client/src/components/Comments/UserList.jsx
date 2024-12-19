import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

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
    userListContainer: {
        zIndex: 2000,
        background: theme.palette.background.paper,
        width: '30rem',
        maxHeight: '16rem',
        overflowY: 'auto',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
    },
    userListItem: {
        display: 'flex',
        alignItems: 'center',
        height: '4rem',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.action.hover
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

const UserList = ({ users, onSelect, filter }) => {
    const classes = useStyles();

    const filteredUsers = users.filter((user) =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className={classes.userListContainer}>
            {filteredUsers.map((user, index) => (
                <div key={index} className={classes.userListItem} onClick={() => onSelect(user)}>
                    <div
                        className={classes.avatar}
                        style={{ backgroundColor: stringToColor(user.first_name + user.last_name) }}
                    >
                        {user.first_name[0].toUpperCase()}
                    </div>
                    <div className={classes.userName}>
                        {user.first_name} {user.last_name}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserList;
