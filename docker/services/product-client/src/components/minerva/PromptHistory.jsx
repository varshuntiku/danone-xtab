import { ButtonBase, Typography, alpha, lighten, makeStyles } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadMore from './LoadMore';
import { setScrollToResponseId } from 'store';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

const useStyles = makeStyles((theme) => ({
    root: {
        maxHeight: '35rem',
        overflow: 'auto',
        '& .MuiTimelineItem-missingOppositeContent:before': {
            display: 'none'
        },
        '& .MuiTimelineSeparator-root': {
            transform: 'translate(0, 2rem)'
        },
        '& .MuiTimelineItem-root': {
            minHeight: '6.5rem'
        },
        '& .MuiTimelineDot-root': {
            marginBottom: 0,
            marginTop: 0,
            backgroundColor: alpha(theme.palette.text.default, 0.3)
        },
        '& .MuiTimelineConnector-root': {
            backgroundColor: alpha(theme.palette.text.default, 0.3)
        }
    },
    promptItem: {
        borderRadius: theme.spacing(1),
        padding: theme.spacing(1, 2),
        background: lighten(theme.palette.primary.light, 0.1),
        opacity: '0.7',
        transitionDuration: '300ms',
        textAlign: 'start',
        justifyContent: 'flex-start',
        width: '100%',
        boxShadow: `0px 2px 2px 0px rgba(0, 0, 0, 0.25)`,
        '&:hover': {
            opacity: 1
        }
    },
    promptText: {
        fontSize: '1.4rem',
        color: alpha(theme.palette.text.default, 0.7)
    }
}));

export default function PromptHistory({ minervaAppId }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { queries, total_count, loadingConversation } = useSelector((d) => d.minerva);
    const loadMore = queries.length < total_count;

    const handleClick = (id) => {
        dispatch(setScrollToResponseId(id));
    };

    if (!queries.length) {
        return null;
    }
    return (
        <div className={classes.root}>
            {/* <Typography variant="h4" className={classes.title} gutterBottom>
                Query History
            </Typography> */}
            <Timeline>
                {[...queries]?.reverse()?.map((query, i) => (
                    <TimelineItem key={query.id || query.requestId}>
                        <TimelineSeparator>
                            <TimelineDot />
                            {!loadMore && i === queries.length - 1 ? null : <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                            <ButtonBase
                                className={classes.promptItem}
                                onClick={() => handleClick(query.id)}
                                aria-label={query.input}
                            >
                                <Typography variant="body1" className={classes.promptText}>
                                    {query.input}
                                </Typography>
                            </ButtonBase>
                        </TimelineContent>
                    </TimelineItem>
                ))}

                {/* <div style={{ margin: '0 auto' }}>
                    <LoadMore minervaAppId={minervaAppId} />
                </div> */}
                {loadMore || loadingConversation ? (
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot />
                        </TimelineSeparator>
                        <TimelineContent>
                            <LoadMore minervaAppId={minervaAppId} />
                        </TimelineContent>
                    </TimelineItem>
                ) : null}
            </Timeline>
        </div>
    );
}
