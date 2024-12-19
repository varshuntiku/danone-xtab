import React from 'react';
import { makeStyles } from '@material-ui/core';
import NoCommentIcon from '../../assets/img/NoCommentIcon.jsx';

const useStyles = makeStyles((theme) => ({
    main: {
        //   position: 'relative',
        marginTop: 'auto',
        marginBottom: '70%',
        width: 'full',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2rem',
        color: theme.palette.text.default
    },
    message: {
        fontSize: '1.6rem',
        lineHeight: '2.1rem',
        letterSpacing: '0.5px',
        fontWeight: 500
    },

    blankIcon: {
        '& svg': {
            fill: theme.palette.background.paper
        }
    }
}));

const NoComments = ({ filtersApplied }) => {
    const classes = useStyles();
    return (
        <div className={classes.main}>
            <span className={classes.blankIcon}>
                <NoCommentIcon />
            </span>
            <span className={classes.message}>{`${
                !filtersApplied ? 'No Comments Added' : 'No comments for the applied filters '
            }`}</span>
        </div>
    );
};

export default NoComments;
