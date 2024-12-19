import React from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import modelCardStyle from '../../assets/jss/llmWorkbench/modelCardStyle';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import { Box, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(modelCardStyle);

const ModelCard = ({ model }) => {
    const classes = useStyles();

    const formatDate = (dateString) => {
        const currentDate = new Date();
        const inputDate = new Date(dateString);

        const timeDifference = currentDate - inputDate;
        const secondsDifference = timeDifference / 1000;
        const minutesDifference = secondsDifference / 60;
        const hoursDifference = minutesDifference / 60;
        const daysDifference = hoursDifference / 24;

        if (daysDifference >= 30) {
            // If the date is 30 days or more ago, show the date
            let options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(inputDate).toLocaleDateString('en-US', options);
        } else if (hoursDifference >= 24) {
            // If the date is more than 24 hours ago, show in days ago format
            const daysAgo = Math.floor(daysDifference);
            return `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`;
        } else if (minutesDifference >= 60) {
            // If the date is more than 1 hour ago, show in hours ago format
            const hoursAgo = Math.floor(hoursDifference);
            return `about ${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
        } else {
            // If the date is less than 1 hour ago, show in minutes ago format
            const minutesAgo = Math.floor(minutesDifference);
            if (minutesAgo !== 0)
                return `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`;
            else return `less than a minute ago`;
        }
    };

    const getReadableTag = (pipeline_tag) => {
        const formated = pipeline_tag
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        return formated;
    };

    const getFormatedData = (number) => {
        if (number >= 1e9) {
            return (number / 1e9).toFixed(1).toString().replace(/\.0$/, '') + 'B';
        } else if (number >= 1e6) {
            return (number / 1e6).toFixed(1).toString().replace(/\.0$/, '') + 'M';
        } else if (number >= 1e3) {
            return (number / 1e3).toFixed(1).toString().replace(/\.0$/, '') + 'k';
        } else {
            return number.toString();
        }
    };

    return (
        <Box className={classes.container}>
            <div className={`${classes.top} ${classes.box}`}></div>
            <div class={`${classes.right} ${classes.box}`}></div>
            <div class={`${classes.bottom} ${classes.box}`}></div>
            <div class={`${classes.left} ${classes.box}`}></div>
            <Box style={{ padding: '8px' }}>
                <Box className={classes.heading}>
                    {model?.avatarUrl && (
                        <Box className={''}>
                            <img src={model?.avatarUrl} className={classes.logo} alt=""></img>
                        </Box>
                    )}
                    <Typography variant="h5" className={classes.name}>
                        {' '}
                        {model?.id}
                    </Typography>
                </Box>
                <ul className={classes.listStyle}>
                    {model?.pipeline_tag && (
                        <li className={classes.text}>{getReadableTag(model?.pipeline_tag)}</li>
                    )}
                    <li className={classes.text}>{'Updated ' + formatDate(model?.lastModified)}</li>
                    <li className={classes.text}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <GetAppIcon className={classes.icon} />
                            {getFormatedData(model?.downloads)}
                        </span>
                    </li>
                    <li className={classes.text}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <FavoriteBorderRoundedIcon className={classes.icon} />
                            {getFormatedData(model?.likes)}
                        </span>
                    </li>
                </ul>
            </Box>
        </Box>
    );
};

export default ModelCard;
