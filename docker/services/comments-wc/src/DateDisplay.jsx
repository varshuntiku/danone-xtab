import React from 'react';

const formatDate = (dateString) => {
    const date = new Date(dateString);

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; 

    const formattedTime = `${hours}.${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

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

    const formattedDate = `${day} ${month} ${year}`;

    return { formattedTime, formattedDate };
};

const DateDisplay = ({ createdAt }) => {
    const { formattedTime, formattedDate } = formatDate(createdAt);

    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        color: '#220047',
        fontSize:'10px',
        marginLeft:'1em',
        fontFamily: 'Graphik, Graphik Compact, Arial, sans-serif',
        fontWeight:'400'
    };

    const separatorStyle = {
        margin: '0 0.5em',
    };

    return (
        <div style={containerStyle}>
            {formattedTime}
            <span style={separatorStyle}>|</span>
            {formattedDate}
        </div>
    );
};

export default DateDisplay;
