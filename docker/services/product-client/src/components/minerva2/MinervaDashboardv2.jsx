import React from 'react';
import { Grid, Link, Typography, alpha, makeStyles } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { grey } from '@material-ui/core/colors';
import QueryInput from './QueryInput';
import QueryOutput from './QueryOutput';
import ConversationWindows from './ConversationWindows';

const useStyles = makeStyles((theme) => ({
    minervaDashboardRoot: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        '& *': {
            letterSpacing: '0.5px'
        }
    },
    headerPannel: {
        // display: 'flex',
        borderBottom: `1px solid ${alpha(grey[500], 0.2)}`,
        padding: '0.4rem 1.6rem 0.8rem',
        position: 'relative',
        '& a': {
            position: 'absolute',
            left: '2rem',
            top: '50%',
            transform: 'translate(0, -50%)',
            textDecoration: 'none',
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'start',
            color: alpha(theme.palette.text.default, 0.7),
            cursor: 'pointer'
        },

        '& svg': {
            fontSize: '2rem',
            color: theme.palette.text.default
        }
    },
    pageHeader: {
        flex: 1,
        fontSize: '3.5rem',
        color: theme.palette.text.default,
        fontWeight: '300',
        letterSpacing: '0.2rem'
    },
    main: {
        flex: 1,
        fontWeight: '300',
        paddingLeft: theme.props.mode === 'light' ? '' : '1.6rem'
    },
    chatSection: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        // borderRight: `1px solid ${alpha(grey[500], 0.2)}`,
        borderLeft: `1px solid ${alpha(grey[500], 0.2)}`,
        background: theme.props.mode === 'light' ? '#f7f4ef' : ''
    }
}));

const objReference = {
    id: 4,
    input: 'What is the competitive landscape of SparkleWave?', //Question
    output: {
        //Answer
        type: 'text',
        data: {
            title: 'Competitive landscape of SparkleWave', //Title on answer
            image: 'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q4.png', //Image of answer
            imageLight:
                'https://willbedeletedsoon.blob.core.windows.net/connected-system-copilot/q4w.png',
            height: '56rem',
            hintInfo: '' //Question Mark Icon
        },
        summary: {
            //Summary
            text: 'The landscape of Sparklewave is very competitive, with a number of large and well-established companies vying for market share. The values of market share indicate the market is still fragmented.'
        },
        relevantSuggestion: {
            title: 'title'
        }
    },
    suggestions: [
        //Suggestions
        {
            id: 1,
            text: 'Why is Fruitfusion gaining a larger consumer base?',
            query_id: 9 //Unique Query(Question-Answer) ID
        },
        {
            id: 2,
            text: 'What are the factors responsible for driving sales of Sparklewave?',
            query_id: 14
        },
        {
            id: 3,
            text: 'How can Sparklewave reach its target audience effectively?',
            query_id: 15
        },
        {
            id: 4,
            text: 'Are there additional competitor brands that might be of interest?',
            query_id: 16
        }
    ]
};

export default function MinervaDashboard2({ ...props }) {
    const classes = useStyles();

    const [totalQueries, setTotalQueries] = React.useState([]);
    const [query, setQuery] = React.useState({});
    const [selectedChatID, setSelectedChatID] = React.useState(undefined);

    const handleQuerySubmit = (question) => {
        let newObj = JSON.parse(JSON.stringify(objReference));
        newObj['input'] = question;
        (newObj['id'] = Math.random().toString(16).slice(2)), setQuery(newObj);
    };

    const handleTotalQueries = (newQueries) => {
        setTotalQueries(newQueries);
    };

    const handleSelectedChat = (id) => {
        setSelectedChatID(id);
    };

    const goBack = () => {
        props.history.push({
            pathname: '/app/' + props.app_info.id
        });
    };

    return (
        <div className={classes.minervaDashboardRoot}>
            <div className={classes.headerPannel}>
                <Grid container spacing={2} alignItems="center">
                    <Grid xs item>
                        <Link component={'button'} onClick={goBack}>
                            <ArrowBackIcon />
                        </Link>
                    </Grid>
                    <Grid xs={9} item>
                        <Typography variant="h1" className={classes.pageHeader} align="center">
                            Ask NucliOS
                        </Typography>
                    </Grid>
                </Grid>
            </div>
            <Grid container spacing={2} className={classes.main}>
                <Grid xs item>
                    <ConversationWindows
                        minervaAppId={props.app_info?.modules?.minerva?.tenant_id}
                        handleSelectedChat={handleSelectedChat}
                        totalQueries={totalQueries}
                    />
                </Grid>

                <Grid xs={9} item>
                    <div className={classes.chatSection}>
                        <div style={{ flex: 1, maxHeight: 'calc(100vh - 20rem)' }}>
                            <QueryOutput
                                appId={props.app_info?.id}
                                minervaAppId={props.app_info?.modules?.minerva?.tenant_id}
                                queriesFromParent={query}
                                handleTotalQueries={handleTotalQueries}
                                selectedChatID={selectedChatID}
                                showPeriod={true}
                                {...props}
                            />
                        </div>
                        <div style={{ padding: '0 10rem' }}>
                            <QueryInput
                                minervaAppId={props.app_info?.modules?.minerva?.tenant_id}
                                handleQuerySubmit={handleQuerySubmit}
                                {...props}
                            />
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}
