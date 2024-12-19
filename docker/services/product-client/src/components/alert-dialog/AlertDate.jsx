import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    dateContainer: {
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.text.default,
        fontSize: '1.4rem',
        whiteSpace: 'nowrap',
        fontFamily: theme.body.B5.fontFamily,
        marginTop: 'auto',
        marginLeft: 'auto'
    },
    separator: {
        margin: '0 0.8rem'
    },
    invalidDate: {
        color: 'red'
    }
}));

const formatDate = (timestamp) => {
    const date = new Date(Math.floor(timestamp) * 1000);

    if (isNaN(date.getTime())) {
        return { formattedTime: 'Invalid Date', formattedDate: '' };
    }

    // Extract time components
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format time as 'hh:mm AM/PM'
    const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

    // Extract date components
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear().toString().slice(-2);

    // Format date as 'dd/MM/yy'
    const formattedDate = `${day < 10 ? '0' + day : day}/${
        month < 10 ? '0' + month : month
    }/${year}`;

    return { formattedTime, formattedDate };
};

const AlertDate = ({ createdAt }) => {
    const classes = useStyles();
    const { formattedTime, formattedDate } = formatDate(createdAt);

    if (formattedTime === 'Invalid Date') {
        return (
            <Typography className={classes.dateContainer}>
                <span className={classes.invalidDate}>Invalid Date</span>
            </Typography>
        );
    }

    return (
        <div className={classes.dateContainer}>
            <span>{formattedDate}</span>
            <span className={classes.separator}>|</span>
            <span>{formattedTime}</span>
        </div>
    );
};

export default AlertDate;
