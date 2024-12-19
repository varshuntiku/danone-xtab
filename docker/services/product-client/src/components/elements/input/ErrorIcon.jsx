import { makeStyles } from '@material-ui/styles';
import React from 'react';

const useStyles = makeStyles(() => ({
    iconContainer: {
        width: '20px',
        height: '20px',
        display: 'flex',
        justifyContent: 'end',
        cursor: 'pointer'
    }
}));

const ErrorIcon = () => {
    const classes = useStyles();
    return (
        <div className={classes.iconContainer}>
            <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
                    fill="#FB5B66"
                />
            </svg>
        </div>
    );
};

export default ErrorIcon;
