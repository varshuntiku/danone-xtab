import React, { useState } from 'react';
import {
    Avatar,
    Button,
    Fade,
    IconButton,
    LinearProgress,
    Typography,
    alpha,
    makeStyles
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import WidgetOutput from './WidgetOutput';
import { ReactComponent as MinervaLogo } from 'assets/img/minerva_logo.svg';
import PersonIcon from '@material-ui/icons/Person';
import LaunchIcon from '@material-ui/icons/Launch';
import InfoPopper from '../porblemDefinitionFramework/create/InfoPopper';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const useStyles = makeStyles((theme) => ({
    resultCardRoot: {
        flex: 'none',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        animation: `$fadeIn 0.75s step-end infinite`,
        margin: '2rem 0'
    },
    queryInput: {
        color: alpha(theme.palette.text.default, 0.7),
        fontSize: '1.6rem',
        padding: '1rem',
        borderRadius: '0.7rem',
        flex: 1
    },
    visualResultRoot: {
        padding: '1rem',
        flex: 1,
        overflow: 'hidden',
        minHeight: '20rem'
    },
    textResult: {
        color: alpha(theme.palette.text.default, 0.7),
        fontSize: '1.6rem',
        padding: '1rem',
        whiteSpace: 'pre-wrap'
    },
    queryContainer: {
        display: 'flex',
        gap: '1rem',
        padding: '0 2rem'
    },
    responseContainer: {
        display: 'flex',
        gap: '1rem',
        background: theme.palette.primary.dark,
        padding: '2rem',
        paddingRight: '4rem',
        borderRadius: '1rem',
        '& $msgAvatar': {
            backgroundColor: theme.palette.primary.contrastText,
            '& svg': {
                width: '2rem',
                fill: theme.palette.primary.dark
            }
        }
    },
    responseContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        overflow: 'hidden'
    },
    msgAvatar: {
        backgroundColor: theme.palette.primary.light,
        fontSize: '2.4rem',
        height: theme.spacing(5.5),
        width: theme.spacing(5.5),
        // borderRadius: '1rem',
        '& svg': {
            fill: alpha(theme.palette.text.default, 0.7),
            fontSize: '2.6rem'
        }
    },
    openVisualResult: {
        padding: '0 1rem',
        '& button': {
            backgroundColor: alpha(theme.palette.primary.light, 0.7) + ' !important',
            color: alpha(theme.palette.text.default, 0.7) + ' !important',
            fontWeight: 300,
            padding: theme.spacing(1, 2),
            '& svg': {
                color: theme.palette.primary.contrastText + ' !important'
            },
            '&:hover': {
                opacity: '0.7'
            }
        }
    },
    outputToolbar: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem 0',
        gap: '0.4rem'
    },
    outputToolbarItem: {
        '&:hover': {
            '& svg': {
                opacity: 0.7
            }
        },
        '& svg': {
            fill: alpha(theme.palette.text.default, 0.7)
        }
    },
    sqlPopperContent: {
        minWidth: '70rem'
    },
    sqlTitle: {
        color: theme.palette.text.default,
        fontSize: '1.6rem',
        marginBottom: 0,
        textTransform: 'uppercase'
    },
    sqlDesc: {
        color: alpha(theme.palette.text.default, 0.7),
        fontSize: '1.6rem',
        margin: 0,
        '& code': {
            whiteSpace: 'break-spaces !important'
        }
    },
    actionPanel: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        padding: '1rem 0'
    },
    feedback: {
        '& svg': {
            color: alpha(theme.palette.text.default, 0.4)
        }
    },
    active: {
        '& svg': {
            color: theme.palette.primary.contrastText
        }
    },
    statusMessage: {
        color: alpha(theme.palette.text.default, 0.7),
        fontSize: '1.4rem'
    }
}));

export default function QueryOutputItem({ appId, chatPopperView, query, history }) {
    const classes = useStyles();

    return (
        <div
            id={(query.id || query.requestId) + '_minerva_result_output'}
            className={classes.resultCardRoot}
        >
            <div className={classes.queryContainer}>
                <Avatar className={classes.msgAvatar} variant="circle">
                    <PersonIcon />
                </Avatar>
                <Typography variant="body1" className={classes.queryInput}>
                    {query.input}
                </Typography>
            </div>
            <div className={classes.responseContainer}>
                <div>
                    <Avatar className={classes.msgAvatar} variant="circle">
                        <MinervaLogo />
                    </Avatar>
                    <div className={classes.outputToolbar}></div>
                </div>
                <div className={classes.responseContent}>
                    {query.output?.response?.widgets ? (
                        chatPopperView ? (
                            <div className={classes.openVisualResult}>
                                <Button
                                    variant="text"
                                    onClick={() => {
                                        if (history) {
                                            history.push('/app/' + appId + '/ask-nuclios');
                                        }
                                    }}
                                    startIcon={<LaunchIcon fontSize="large" />}
                                >
                                    Open visual result
                                </Button>
                            </div>
                        ) : (
                            <Fade in timeout={1000}>
                                <div className={classes.visualResultRoot}>
                                    <WidgetOutput data={query.output.response} appId={appId} />
                                </div>
                            </Fade>
                        )
                    ) : (
                        <ReasultLoadingSkeleton query={query} />
                    )}
                    {query.output?.response?.text ? (
                        <div className={classes.textResultRoot}>
                            <Typography
                                variant="body1"
                                className={classes.textResult}
                                component="pre"
                            >
                                {query.output.response.text}
                            </Typography>
                        </div>
                    ) : (
                        <ReasultLoadingSkeleton query={query} textVarient />
                    )}

                    {query.status === 'rejected' ? (
                        <div className={classes.textResultRoot}>
                            <Typography variant="body1" className={classes.textResult}>
                                Unable to resolve your query!
                            </Typography>
                        </div>
                    ) : null}

                    {(!query.status || query.status === 'resolved') && !chatPopperView ? (
                        <div className={classes.actionPanel}>
                            <Feedback classes={classes} />
                            <div style={{ flex: 1 }} />
                            {query.output?.response?.sql_query ? (
                                <OutputHintPopper
                                    popoverInfo={query.output?.response?.sql_query}
                                    classes={classes}
                                />
                            ) : null}
                        </div>
                    ) : null}

                    {query.progress_message && query.status == 'pending' ? (
                        <div style={{ padding: '0 1rem' }}>
                            <Typography variant="h3" className={classes.statusMessage} gutterBottom>
                                <LinearProgress size={40} />
                                {query.progress_message}
                            </Typography>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function OutputHintPopper({ popoverInfo, classes }) {
    return (
        <InfoPopper
            Img={() => <HelpOutlineIcon fontSize="large" />}
            popOverInfo={popoverInfo}
            classes={{
                popperContent: classes.sqlPopperContent,
                title: classes.sqlTitle,
                desc: classes.sqlDesc,
                triggerButton: classes.outputToolbarItem
            }}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'center'
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
        />
    );
}

function ReasultLoadingSkeleton({
    query,
    textVarient = false,
    typographyProps = {},
    skeletonProps = {}
}) {
    if (query?.status !== 'pending') {
        return null;
    }
    return (
        <div style={{ padding: '0 1rem' }}>
            {textVarient ? (
                <Typography variant="h3" {...typographyProps}>
                    <Skeleton variant="text" {...skeletonProps} />
                </Typography>
            ) : (
                <Skeleton
                    style={{ borderRadius: '1rem' }}
                    variant="rect"
                    height="20rem"
                    width="100%"
                    {...skeletonProps}
                />
            )}
        </div>
    );
}

function Feedback({ classes }) {
    const [feedback, setFeedback] = useState(0);
    const handleFeedback = (like) => {
        setFeedback(feedback === like ? 0 : like);
    };
    return (
        <div className={classes.feedback}>
            <IconButton
                size="small"
                title="like"
                className={feedback === 1 ? classes.active : null}
                onClick={() => {
                    handleFeedback(1);
                }}
            >
                <ThumbUpIcon fontSize="large" />
            </IconButton>
            <IconButton
                size="small"
                title="dislike"
                className={feedback === -1 ? classes.active : null}
                onClick={() => {
                    handleFeedback(-1);
                }}
            >
                <ThumbDownIcon fontSize="large" />
            </IconButton>
        </div>
    );
}
