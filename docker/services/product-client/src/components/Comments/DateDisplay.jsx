import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    dateContainer: {
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.text.default,
        letterSpacing: '0.5px',
        fontSize: '1.6rem',
        marginLeft: '1rem'
    },
    separator: {
        margin: '0 0.8rem'
    }
}));

const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Extract time components
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format time as 'h.mm am/pm'
    const formattedTime = `${hours}.${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

    // Extract date components
    const day = date.getDate();
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);

    // Format date as 'd MMM yy'
    const formattedDate = `${day} ${month} ${year}`;

    return { formattedTime, formattedDate };
};

const DateDisplay = ({ createdAt }) => {
    const classes = useStyles();
    const { formattedTime, formattedDate } = formatDate(createdAt);

    return (
        <Typography className={classes.dateContainer}>
            {formattedTime}
            <span className={classes.separator}>|</span>
            {formattedDate}
        </Typography>
    );
};

export default DateDisplay;
