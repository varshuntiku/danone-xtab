import React, { useEffect, useState } from 'react';
import {} from '@material-ui/core';
import { Typography, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { ReactComponent as BulbIcon } from 'assets/img/bulbIcon.svg';
import { ReactComponent as DisLikeIcon } from 'assets/img/likeIcon.svg';
import { ReactComponent as LikeIcon } from 'assets/img/likeIconGreen.svg';
import { ReactComponent as CommentIcon } from 'assets/img/commentIcon.svg';
import { ReactComponent as ShareIcon } from 'assets/img/shareIcon.svg';

const useStyles = makeStyles((theme) => ({
    progress: {
        // height:'100px',
        transform: 'rotate(-270deg)',
        background: 'green',
        width: '3.2rem',
        borderRadius: '4px'
    },
    heading: {
        fontSize: theme.title.h3.fontSize,
        width: 'fit-content',
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: theme.body.B4.fontWeight,
        color: theme.palette.text.default
    },
    recordText: {
        fontSize: theme.kpi.k4.fontSize,
        color: theme.palette.text.default,
        fontWeight: theme.body.B4.fontWeight,
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.layoutSpacing(32)
    },
    recordSection: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '0.8rem'
    },
    record: {
        display: 'flex',
        alignSelf: 'end',
        alignItems: 'center'
    },
    progressSection: {
        display: 'flex',
        alignItems: 'center'
    },
    section: {
        // paddingRight:'2.5rem',
        // padding:'1rem'
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '1rem'
    },
    insightText: {
        fontSize: theme.title.h3.fontSize,
        width: theme.layoutSpacing(300),
        height: '100%',
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: theme.title.h1.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing,
        color: theme.palette.text.default
    },
    insightStatus: {
        fontSize: theme.body.B9.fontSize,
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItem: 'center',
        background: 'red'
    },
    arrowUp: {
        fontSize: '3rem',
        '&.MuiSvgIcon-root': {
            fill: '#00A582'
        }
    },
    recordDataText: {
        color: '#00A582',
        fontFamily: theme.body.B1.fontFamily,
        fontSize: theme.body.B7.fontSize,
        lineHeight: theme.body.B7.fontSize
    },
    targetText: {
        fontFamily: theme.body.B1.fontFamily,
        fontWeight: theme.title.h1.fontWeight,
        fontSize: theme.body.B9.fontSize,
        color: theme.palette.text.default,
        letterSpacing: theme.title.h1.letterSpacing,
        lineHeight: theme.layoutSpacing(16)
    },
    insightStatusPos: {
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.body.B7.fontSize,
        fontWeight: theme.body.B4.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing,
        display: 'flex',
        alignItems: 'center',
        background: theme.palette.background.insightSuccess,
        width: '8rem',
        padding: '0.1rem',
        marginTop: 'auto'
    },
    insightStatusNeg: {
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.body.B7.fontSize,
        fontWeight: theme.body.B4.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing,
        display: 'flex',
        alignItems: 'center',
        background: theme.palette.background.insightFailure,
        width: '8rem',
        padding: '0.1rem',
        marginTop: 'auto'
    },
    bulbIcon: {
        minHeight: '2rem',
        minWidth: '2rem',
        padding: '0.25rem',
        marginTop: '-0.2rem'
    },
    insightContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '17rem',
        paddingBottom: '1rem'
    },
    likeIcon: {
        minWidth: '2rem',
        minHeight: '2rem',
        transform: 'rotate(180deg) scaleX(-1)',
        opacity: 0.5,
        cursor: 'pointer'
    },
    dislikeIcon: {
        minWidth: '2rem',
        minHeight: '2rem',
        transform: 'scaleX(-1)',
        opacity: 0.5,
        cursor: 'pointer'
    },
    commentIcon: {
        minWidth: '2rem',
        minHeight: '2rem',
        opacity: 0.5
    },
    shareIcon: {
        minWidth: '1rem',
        minHeight: '1rem',
        marginLeft: '1rem',
        padding: '0.2rem',
        opacity: 0.5
    },
    customIconsHolder: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-end'
    },
    customIconText: {
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.text.default,
        fontFamily: theme.body.B1.fontFamily,
        fontSize: theme.title.h2.fontSize,
        fontWeight: theme.title.h1.fontWeight,
        letterSpacing: theme.title.h3.letterSpacing,
        gap: '0.25rem'
    },
    chatNotification: {
        height: '1.25rem',
        width: '1.25rem',
        background: 'red',
        color: 'white',
        position: 'absolute',
        left: '55%',
        borderRadius: '50%',
        top: '2%',
        display: 'flex',
        justifyContent: 'center',
        fontSize: '0.75rem'
    },
    commentContainer: {
        position: 'relative',
        cursor: 'pointer',
        display: 'flex'
    },
    heading2: {
        fontSize: '2rem',
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: theme.title.h6.fontWeight,
        letterSpacing: theme.layoutSpacing(1),
        lineHeight: theme.layoutSpacing(35),
        color: theme.palette.text.default,
        whiteSpace: 'nowrap'
    },
    recordContainer: {
        display: 'flex',
        gap: '2rem',
        marginTop: '1.5rem'
    },
    learnMore: {
        fontSize: theme.title.h2.fontSize,
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: theme.title.h6.fontWeight,
        letterSpacing: theme.layoutSpacing(1),
        color: theme.palette.text.default,
        textDecoration: 'underline',
        marginTop: '1rem',
        display: 'flex',
        alignItems: 'center'
    },
    arrowForward: {
        width: '3rem',
        height: '2rem',
        marginLeft: '1rem',
        opacity: 0.5
    }
}));

function IntiativeValue({ el, data, openChat, setOpenChat, index }) {
    const classes = useStyles(data);
    const [viewdChat, setViwedChat] = useState(false);
    useEffect(() => {
        if (openChat) setViwedChat(true);
    }, [openChat]);
    return (
        <div className={classes.section}>
            {data === 'initiatives' && (
                <React.Fragment>
                    <Typography className={classes.heading}>{el.name}</Typography>
                    <div className={classes.recordSection}>
                        <Typography className={classes.recordText}>{el.record}</Typography>
                        <div className={classes.record}>
                            <ArrowDropUpIcon className={classes.arrowUp} />

                            <Typography className={classes.recordDataText}>
                                {el.recordData}
                            </Typography>
                        </div>
                        {el.target && (
                            <div className={classes.progressSection}>
                                <LinearProgress
                                    value={50}
                                    variant="determinate"
                                    className={classes.progress}
                                    color="primary"
                                />
                                <div>
                                    <Typography className={classes.targetText}>Target</Typography>
                                    <Typography className={classes.targetText}>
                                        {el.target}
                                    </Typography>
                                </div>
                            </div>
                        )}
                    </div>
                </React.Fragment>
            )}
            {data === 'insights' && (
                <div className={classes.insightContainer}>
                    <Typography className={classes.insightText}>{el.record}</Typography>
                    <div className={classes.customIconsHolder}>
                        <Typography
                            className={
                                el.status === 'Positive'
                                    ? classes.insightStatusPos
                                    : classes.insightStatusNeg
                            }
                        >
                            <BulbIcon className={classes.bulbIcon} /> {el.status}
                        </Typography>
                        <Typography className={classes.customIconText}>
                            {' '}
                            <LikeIcon className={classes.likeIcon} />
                            {4}
                        </Typography>
                        <Typography className={classes.customIconText}>
                            {' '}
                            <DisLikeIcon className={classes.dislikeIcon} />
                            {0}
                        </Typography>
                        <Typography className={classes.customIconText}>
                            {' '}
                            <span
                                className={classes.commentContainer}
                                onClick={() => setOpenChat(true)}
                            >
                                <CommentIcon className={classes.commentIcon} />{' '}
                                {index == 0 && viewdChat == false ? (
                                    <span className={classes.chatNotification}>3</span>
                                ) : null}
                            </span>
                            {3}
                        </Typography>
                        <ShareIcon className={classes.shareIcon} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default IntiativeValue;
