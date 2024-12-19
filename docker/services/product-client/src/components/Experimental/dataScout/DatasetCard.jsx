import React from 'react';
import { Typography, makeStyles, Grid, Tooltip } from '@material-ui/core';
import LockOutlined from '@material-ui/icons/LockOutlined';
import BookMarkOutlined from '@material-ui/icons/BookmarkBorderOutlined';
import Bookmark from '@material-ui/icons/Bookmark';
import { Star, StarBorder, StarHalf } from '@material-ui/icons';
import { ReactComponent as OwnerImage } from '../../../assets/img/user-image.svg';
import DownloadIcon from '@material-ui/icons/GetApp';

const darkTheme = localStorage.getItem('codx-products-theme') == 'dark';
const useStyles = makeStyles((theme) => ({
    cardHeaderContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cardHeader: {
        color: darkTheme ? '#fff' : '#102437',
        fontSize: '2rem',
        fontWeight: 500,
        lineHeight: '27px',
        letterSpacing: '1px',
        textTransform: 'capitalize'
    },
    cardHeadingIcon: {
        height: '2.25rem',
        width: '2.25rem',
        fill: darkTheme ? theme.palette.text.contrastText : 'rgba(78, 79, 99, 1)',
        marginRight: '0.5rem',
        cursor: 'pointer'
    },
    approvedIcon: {
        height: '2rem',
        width: '2rem',
        borderRadius: '50%',
        border: '3.5px solid rgba(225, 255, 231, 1)',
        background: 'rgba(47, 141, 65, 1)',
        marginRight: '1rem',
        display: 'inline-block',
        marginTop: '-0.25rem'
    },
    pendingIcon: {
        height: '2rem',
        width: '2rem',
        borderRadius: '50%',
        border: '3.5px solid rgba(255, 235, 218, 1)',
        background: 'rgba(252, 153, 71, 1)',
        marginRight: '1rem',
        display: 'inline-block',
        marginTop: '-0.25rem'
    },
    cardDescription: {
        color: darkTheme ? '#BFBFBF' : '#4E4F63',
        fontSize: '1.75rem',
        lineHeight: '18px',
        paddingRight: '0.5rem',
        marginTop: '1rem'
    },
    redTag: {
        color: '#F34F03',
        textAlign: 'center',
        fontSize: '1.25rem',
        lineHeight: '1.3',
        letterSpacing: '1px',
        textTransform: 'capitalize',
        borderRadius: '2px',
        background: '#FFEBDA',
        marginTop: '2rem',
        margiRight: '1rem',
        height: 'fit-content',
        width: 'fit-content'
    },
    greenTag: {
        color: '#018786',
        textAlign: 'center',
        fontSize: '1.25rem',
        lineHeight: '1.3',
        letterSpacing: '1px',
        textTransform: 'capitalize',
        borderRadius: '2px',
        background: darkTheme ? '#E8FAFA' : 'rgba(144, 236, 235, 0.20)',
        marginTop: '2rem',
        marginRight: '1rem',
        height: 'fit-content',
        width: 'fit-content'
    },
    moreTags: {
        marginTop: '1rem',
        color: theme.palette.text.contrastText,
        fontSize: '1.75rem',
        fontStyle: 'normal',
        fontWeight: 400,
        letterSpacing: '0.5px',
        textDecorationLine: 'underline'
    },
    regionContainer: {
        display: 'flex',
        gap: '2rem',
        color: darkTheme ? 'rgba(255, 255, 255, 0.80)' : '#4E4F63',
        marginTop: '2rem'
    },
    regionHeading: {
        fontSize: '1.5rem',
        fontWeight: 500,
        lineHeight: '1.6rem'
    },
    regionText: {
        fontSize: '1.5rem',
        fontWeight: 400,
        lineHeight: '1.6rem',
        letterSpacing: '1px',
        textTransform: 'capitalize'
    },
    lastUpdatedContainer: {
        color: darkTheme ? 'rgba(255, 255, 255, 0.80)' : '#8490B3',
        fontSize: '1.4rem',
        lineHeight: '1.5rem',
        marginTop: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    ratingsContainer: {
        display: 'flex',
        gap: '0.25rem',
        marginTop: '1rem'
    },
    ratingIcon: {
        height: '1.75rem',
        width: '1.75rem',
        fill: 'rgba(238, 180, 61, 1)'
    },
    ownerImage: {
        marginBottom: '1rem'
    },
    requestText: {
        fontSize: '2rem'
    }
}));
const DataSetCard = (props) => {
    const data = props.data;
    const classes = useStyles();
    const bookMarkClickHandle = (e) => {
        e.stopPropagation();
        let newVal = [...props.obj.allData];
        newVal[`${props.index}`]['bookmark'] = data?.bookmark ? !data.bookmark : true;
        let newObj = { ...props.obj };
        newObj.allData = newVal;
        props.setData(newObj);
    };

    const downloadClickHandle = (e) => {
        e.stopPropagation();
        let newVal = [...props.obj.allData];
        newVal[`${props.index}`]['download'] = true;
        let newObj = { ...props.obj };
        newObj.allData = newVal;
        props.setData(newObj);
    };

    const RequestIcons = (val) => {
        switch (val) {
            case 'Pending':
                return <Typography className={classes.pendingIcon}></Typography>;
            case 'Approved':
                return <Typography className={classes.approvedIcon}></Typography>;
            default:
                return <Typography className={classes.approvedIcon}></Typography>;
        }
    };

    return (
        <React.Fragment>
            <div className={classes.cardHeaderContainer}>
                <Typography className={classes.cardHeader}>{data.heading}</Typography>
                <span>
                    {data?.access == 'Pending' && (
                        <Tooltip
                            title={
                                <Typography className={classes.requestText}>
                                    Pending Request
                                </Typography>
                            }
                            arrow
                            placement="top-start"
                        >
                            {RequestIcons('Pending')}
                        </Tooltip>
                    )}
                    {data?.access == 'Approved' && (
                        <Tooltip
                            title={
                                <Typography className={classes.requestText}>
                                    Approved Request
                                </Typography>
                            }
                            arrow
                            placement="top-start"
                        >
                            {RequestIcons('Approved')}
                        </Tooltip>
                    )}
                    {data?.access == 'Approved' ? (
                        <DownloadIcon
                            className={classes.cardHeadingIcon}
                            onClick={(e) => downloadClickHandle(e)}
                        />
                    ) : (
                        <LockOutlined className={classes.cardHeadingIcon} />
                    )}
                    {data?.bookmark ? (
                        <Bookmark
                            className={classes.cardHeadingIcon}
                            onClick={(e) => bookMarkClickHandle(e)}
                        />
                    ) : (
                        <BookMarkOutlined
                            onClick={(e) => bookMarkClickHandle(e)}
                            className={classes.cardHeadingIcon}
                        />
                    )}
                </span>
            </div>
            <div className={classes.ratingsContainer}>
                <Star className={classes.ratingIcon} />
                <Star className={classes.ratingIcon} />
                <Star className={classes.ratingIcon} />
                <StarHalf className={classes.ratingIcon} />
                <StarBorder className={classes.ratingIcon} />
            </div>
            <div className={classes.cardDescription}>{data.description}</div>
            <Grid container spacing={1}>
                {data.tags.slice(0, 2).map((val, key) => (
                    <Grid
                        item
                        xs={3}
                        key={`${data.heading}tag${key}`}
                        className={val.type == 'green' ? classes.greenTag : classes.redTag}
                    >
                        {val.tag}
                    </Grid>
                ))}

                <Grid item xs={3} className={classes.moreTags}>
                    +{Number(data.tags.length) - Number(2)} More
                </Grid>
            </Grid>
            <div className={classes.regionContainer}>
                <Typography className={classes.regionHeading}>REGION : </Typography>
                <Typography className={classes.regionText}>{data.region}</Typography>
            </div>
            {data?.lastUpdated && (
                <Typography className={classes.lastUpdatedContainer}>
                    Last Updated : {data.lastUpdated}
                    <OwnerImage className={classes.ownerImage} />
                </Typography>
            )}
        </React.Fragment>
    );
};

export default DataSetCard;
