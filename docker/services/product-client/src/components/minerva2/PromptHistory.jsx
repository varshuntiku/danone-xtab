import { ButtonBase, Typography, alpha, lighten, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
// import { useDispatch,
//     useSelector
// } from 'react-redux';
import LoadMore from './LoadMore';
// import { setScrollToResponseId } from 'store';
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
        background:
            theme.props.mode === 'light' ? '#fff' : lighten(theme.palette.primary.light, 0.1),
        opacity: '0.9',
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

const objReference = {
    id: 1,
    input: 'How has Fanta performed in respect to market?',
    output: {
        type: 'text',
        data: {
            title: 'Overall units is 8% lower than the taget set',
            graphData: '',
            image: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e'
        },
        summary: {
            text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aperiam placeat temporibus exercitationem ipsum voluptatem eum quae consequatur impedit perspiciatis repudiandae aspernatur accusantium laborum inventore sapiente, eius, tempore neque quaerat a. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aperiam placeat temporibus exercitationem ipsum voluptatem eum quae consequatur impedit perspiciatis repudiandae aspernatur accusantium laborum inventore sapiente, eius, tempore neque quaerat a. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aperiam placeat temporibus exercitationem ipsum voluptatem eum quae consequatur impedit perspiciatis repudiandae aspernatur accusantium laborum inventore sapiente, eius, tempore neque quaerat a. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aperiam placeat temporibus exercitationem ipsum voluptatem eum quae consequatur impedit perspiciatis repudiandae aspernatur accusantium laborum inventore sapiente, eius, tempore neque quaerat a. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aperiam placeat temporibus exercitationem ipsum voluptatem eum quae consequatur impedit perspiciatis repudiandae aspernatur accusantium laborum inventore sapiente, eius, tempore neque quaerat a.'
        },
        relevantSuggestion: {
            title: 'title'
        },
        recommendedSolutions: [
            {
                title: 'Integration Demand Planning',
                icon: 'assortment_planner',
                description: 'Push the Single serve variants of Fanta in off trade channels',
                value: 'Consumer prefernce to buy single serve packs have become higher in the last 7 weeks',
                app_id: 1
            },
            {
                title: 'Integration Demand Planning',
                icon: 'integration_demand',
                description: 'Push the Single serve variants of Fanta in off trade channels',
                value: 'Consumer prefernce to buy single serve packs have become higher in the last 7 weeks',
                app_id: 2
            },
            {
                title: 'Integration Demand Planning',
                icon: 'marketing_media',
                description: 'Push the Single serve variants of Fanta in off trade channels',
                value: 'Consumer prefernce to buy single serve packs have become higher in the last 7 weeks',
                app_id: 1
            }
        ]
    },
    suggestions: [
        {
            id: 1,
            text: 'question1',
            query_id: 3
        },
        {
            id: 2,
            text: 'question1',
            query_id: 4
        },
        {
            id: 3,
            text: 'question1',
            query_id: 3
        },
        {
            id: 4,
            text: 'question1',
            query_id: 4
        }
    ]
};

export default function PromptHistory({ minervaAppId, conversations, handleSelectedChat }) {
    const classes = useStyles();
    // const dispatch = useDispatch();
    // const { queries, total_count, loadingConversation } = useSelector((d) => d.minerva);

    const [queries, setQueries] = React.useState([
        {
            id: 1,
            input: 'Overall units is 8% lower than the taget set',
            output: objReference,
            window_id: 1,
            feedback: false
        }
    ]);
    const total_count = 1;
    const loadingConversation = false;
    const loadMore = queries.length < total_count;

    const handleClick = (id) => {
        // dispatch(setScrollToResponseId(id));
        handleSelectedChat(id);
    };

    useEffect(() => {
        const queries = conversations.map((elem) => ({
            id: elem.id,
            input: elem?.input,
            output: elem,
            window_id: 1,
            feedback: false
        }));
        setQueries(queries);
    }, [conversations]);

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
