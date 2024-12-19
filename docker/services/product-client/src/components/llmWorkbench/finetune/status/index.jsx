import React, { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import {
    Box,
    Divider,
    IconButton,
    alpha,
    makeStyles,
    useTheme,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    withStyles,
    TableContainer
} from '@material-ui/core';
import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ListAltIcon from '@material-ui/icons/ListAlt';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { Link } from 'react-router-dom';

import Footer from 'components/Footer';
import Typography from 'components/elements/typography/typography';
import BlockLoader from 'components/shared/block-loader';
import { ReactComponent as FactCheck } from 'assets/img/fact_check.svg';
import { ReactComponent as QueryStats } from 'assets/img/query_stats.svg';
import { ReactComponent as DeployIcon } from 'assets/img/llm-deployment.svg';
import TrainingLogs from './TrainingLogs';
import TrainingResults from './TrainingResults';
import useEventSource from 'hooks/useEventSource';
import {
    getExperimentDetailById,
    getExperimentStatusById,
    getCheckpointEvaluationStatus,
    startCheckpointEvaluation,
    interruptTraining,
    getExperimentResultById
} from 'services/llmWorkbench/llm-workbench';
import PageNotFound from 'components/PageNotFound';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

let timer;
let timerInterval;
let timeout;
let checkpointTimer;
const formatter = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
});
const formatter1 = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
});
// const timeFormatter = new Intl.DateTimeFormat('en-US', {
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit',
//     hour12: true
// });

const useStyles = makeStyles((theme) => ({
    text: {
        textTransform: 'none!important',
        fontWeight: '500!important',
        color: theme.palette.primary.contrastText,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1)
    },
    title: {
        fontWeight: '400!important',
        fontFamily: 'Graphik',
        fontSize: '1.8rem',
        letterSpacing: '0.5px'
    },
    info: {
        fontWeight: '500!important',
        fontFamily: 'Graphik',
        fontSize: '1.6rem',
        letterSpacing: '0.5px'
    },
    value: {
        fontWeight: '400!important',
        fontFamily: 'Graphik',
        fontSize: '1.6rem',
        letterSpacing: '0.5px'
    },
    divider: {
        backgroundColor: theme.palette.separator.grey
    },
    actionButton: {
        minWidth: 0,
        padding: theme.spacing(0.2),
        borderRadius: '50%',
        '&.Mui-disabled': {
            opacity: '0.32',
            cursor: 'not-allowed',
            pointerEvents: 'auto',
            '& svg': {
                cursor: 'not-allowed',
                pointerEvents: 'auto'
            }
        },
        '& svg': {
            '& path': {
                fill: theme.palette.primary.contrastText
            }
        }
    },
    stopButton: {
        border: `2px solid ${theme.palette.error.main}`,
        '& svg': {
            '& path': {
                fill: theme.palette.error.main
            }
        }
    },
    resumeButton: {
        border: `2px solid ${theme.palette.background.successDark}`,
        marginLeft: theme.spacing(1),
        '& svg': {
            '& path': {
                fill: theme.palette.background.successDark
            }
        }
    },
    logButton: {
        marginLeft: theme.spacing(1),
        padding: theme.spacing(0.2)
    },
    back: {
        cursor: 'pointer',
        fontSize: theme.spacing(2),
        color: theme.palette.text.contrastText,
        textTransform: 'unset',
        textDecoration: 'none',
        display: 'flex',
        gap: theme.spacing(0.5),
        alignItems: 'center',
        fontWeight: 'bold!important',
        '&:hover': {
            textDecoration: 'underline'
        },
        '& svg': {
            width: '18px !important',
            height: '20px !important'
        }
    },
    checkpointContainer: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gridGap: theme.spacing(3),
        overflowY: 'scroll',
        animation: '$fadeIn 0.8s ease-in-out'
    },
    '@keyframes fadeIn': {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 }
    },
    toggleBtnLabel: {
        fontFamily: 'Graphick',
        fontSize: '1.8rem',
        letterSpacing: '0.5px',
        color: theme.palette.primary.contrastText,
        textTransform: 'None',
        fontWeight: '400',
        border: `1px solid ${theme.palette.separator.grey}`,
        // '& .MuiToggleButton - root.Mui - disabled': {
        //     color: alpha(theme.palette.primary.contrastText, 0.1),
        //     border: `1px solid ${alpha(theme.palette.separator.grey,0.1)}`,
        //     cursor: 'not-allowed',
        //     opacity:'0.1'
        //     }
        '&.Mui-disabled': {
            opacity: '0.32',
            cursor: 'not-allowed',
            pointerEvents: 'auto',
            color: theme.palette.primary.contrastText,
            '& svg': {
                cursor: 'not-allowed',
                pointerEvents: 'auto'
            },
            '> .MuiToggleButton-label': {
                color: theme.palette.primary.contrastText,
                opacity: '0.3'
            }
        }
    },
    disabledToggle: {
        opacity: '0.1',
        color: alpha(theme.palette.primary.contrastText, 0.1),
        border: `1px solid ${alpha(theme.palette.separator.grey, 0.1)}`,
        cursor: 'not-allowed'
    }
}));

const StyledTableCell = withStyles((theme) => ({
    root: {
        textAlign: 'center',
        color: theme.palette.text.default,
        fontSize: theme.spacing(2),
        padding: theme.spacing(2),
        wordBreak: 'break-word',
        borderBottom: '1px solid ' + alpha(theme.palette.border.dashboard, 0.4)
    },
    head: {
        background: theme.palette.primary.light,
        backgroundColor: theme.palette.background.tableHeader,
        padding: theme.spacing(1) + ' ' + theme.spacing(2),
        lineHeight: theme.spacing(3),
        borderBottom: '1px solid ' + alpha(theme.palette.border.dashboard, 0.4),
        '& span:hover': {
            color: theme.palette.primary.contrastText
        }
    }
}))(TableCell);

const trimFloatValue = (value) => {
    return parseFloat(value).toFixed(4);
};

const RealTimeProgress = ({
    openTrainingLog,
    expDetails,
    elapsedTime,
    handleInterruptTraining,
    stopLoader,
    getProgress
}) => {
    const [lastUpdated, setLastUpdated] = useState(new Date(Date.now()));
    const classes = useStyles();
    const theme = useTheme();
    const status = expDetails?.status?.toLowerCase();
    const disabled = stopLoader || status !== 'in-progress';
    useEffect(() => {
        const now = Date.now();
        const date = new Date(now);
        setLastUpdated(date);
    }, [expDetails]);

    return (
        <Box
            flex={1}
            paddingX={theme.spacing(4)}
            display="flex"
            flexDirection="column"
            gridGap={theme.spacing(4)}
        >
            <Typography className={clsx(classes.text, classes.title)}>
                Realtime Training Progress
            </Typography>
            <Box display="flex" flexDirection="column" gridGap={theme.spacing(2)}>
                <Box
                    display="flex"
                    border={`1px solid ${alpha(theme.palette.border.dashboard, 0.2)}`}
                    padding={`${theme.spacing(1.5)} ${theme.spacing(2)}`}
                >
                    <Box flex={1}>
                        <Typography className={clsx(classes.text, classes.info)}>
                            Experiment Name
                        </Typography>
                    </Box>
                    <Box flex={1}>
                        <Typography className={clsx(classes.text, classes.value)}>
                            {expDetails?.name}
                        </Typography>
                    </Box>
                </Box>
                <Box
                    display="flex"
                    border={`1px solid ${alpha(theme.palette.border.dashboard, 0.2)}`}
                    padding={`${theme.spacing(1.5)} ${theme.spacing(2)}`}
                >
                    <Box flex={1}>
                        <Typography className={clsx(classes.text, classes.info)}>
                            Base Model
                        </Typography>
                    </Box>
                    <Box flex={1}>
                        <Typography className={clsx(classes.text, classes.value)}>
                            {expDetails?.base_model?.name || expDetails?.base_model}
                        </Typography>
                    </Box>
                </Box>
                <Box
                    display="flex"
                    border={`1px solid ${alpha(theme.palette.border.dashboard, 0.2)}`}
                    padding={`${theme.spacing(1.5)} ${theme.spacing(2)}`}
                >
                    <Box flex={1}>
                        <Typography className={clsx(classes.text, classes.info)}>
                            Progress
                        </Typography>
                    </Box>
                    <Box flex={1} display="flex" gridGap={theme.spacing(1)}>
                        <BlockLoader progress={getProgress(expDetails?.percentage || 0)} />
                        <IconButton
                            disabled
                            title="Resume Training"
                            className={clsx(classes.actionButton, classes.resumeButton)}
                        >
                            <PlayArrowIcon />
                        </IconButton>
                        <ConfirmPopup
                            onConfirm={handleInterruptTraining}
                            subTitle="Are you sure to stop this training?"
                            title="Confirm"
                            cancelText={'Cancel'}
                            confirmText={'Proceed'}
                            enableCloseButton
                        >
                            {(triggerConfirm) => (
                                <IconButton
                                    aria-label="Interrupt training"
                                    title="Interrupt training"
                                    className={clsx(classes.actionButton, classes.stopButton)}
                                    onClick={triggerConfirm}
                                    disabled={disabled}
                                >
                                    <StopIcon />
                                </IconButton>
                            )}
                        </ConfirmPopup>
                    </Box>
                </Box>
                <Box
                    display="flex"
                    border={`1px solid ${alpha(theme.palette.border.dashboard, 0.2)}`}
                    padding={`${theme.spacing(1.5)} ${theme.spacing(2)}`}
                >
                    <Box flex={1}>
                        <Typography className={clsx(classes.text, classes.info)}>Status</Typography>
                    </Box>
                    <Box flex={1}>
                        <Typography className={clsx(classes.text, classes.value)}>
                            {stopLoader
                                ? 'Terminating...'
                                : expDetails?.status?.replaceAll('-', ' ')}
                        </Typography>
                    </Box>
                </Box>
                <Box
                    display="flex"
                    border={`1px solid ${alpha(theme.palette.border.dashboard, 0.2)}`}
                    padding={`${theme.spacing(1.5)} ${theme.spacing(2)}`}
                >
                    <Box flex={1}>
                        <Typography className={clsx(classes.text, classes.info)}>
                            Start Time
                        </Typography>
                    </Box>
                    <Box flex={1}>
                        <Typography className={clsx(classes.text, classes.value)}>
                            {(expDetails?.created_at &&
                                formatter.format(new Date(expDetails.created_at))) ||
                                '-'}
                        </Typography>
                    </Box>
                </Box>
                <Box
                    display="flex"
                    border={`1px solid ${alpha(theme.palette.border.dashboard, 0.2)}`}
                    padding={`${theme.spacing(1.5)} ${theme.spacing(2)}`}
                >
                    <Box flex={1}>
                        <Typography className={clsx(classes.text, classes.info)}>
                            Elapsed Time
                        </Typography>
                    </Box>
                    <Box flex={1}>
                        <Typography className={clsx(classes.text, classes.value)}>
                            {elapsedTime
                                ? elapsedTime
                                : expDetails?.status?.toLowerCase() === 'failed' ||
                                  expDetails?.status?.toLowerCase() === 'terminated'
                                ? '00:00:00'
                                : 'Calculating...'}
                        </Typography>
                    </Box>
                </Box>
                <Box
                    display="flex"
                    border={`1px solid ${alpha(theme.palette.border.dashboard, 0.2)}`}
                    padding={`${theme.spacing(1.5)} ${theme.spacing(2)}`}
                >
                    <Box flex={1}>
                        <Typography className={clsx(classes.text, classes.info)}>
                            Remaining Time
                        </Typography>
                    </Box>
                    <Box flex={1}>
                        <Typography className={clsx(classes.text, classes.value)}>
                            {status === 'terminated'
                                ? 'Not available'
                                : expDetails?.remaining_time
                                ? expDetails?.remaining_time == '0:00:00'
                                    ? expDetails?.remaining_time
                                    : expDetails?.remaining_time + ' (approx)'
                                : status === 'failed' || status === 'completed'
                                ? '00:00:00'
                                : 'Calculating...'}
                        </Typography>
                    </Box>
                </Box>
                <Box
                    display="flex"
                    border={`1px solid ${alpha(theme.palette.border.dashboard, 0.2)}`}
                    padding={`${theme.spacing(1.5)} ${theme.spacing(2)}`}
                >
                    <Box flex={1}>
                        <Typography className={clsx(classes.text, classes.info)}>Cost</Typography>
                    </Box>
                    <Box flex={1}>
                        <Typography className={clsx(classes.text, classes.value)}>
                            ${expDetails?.compute?.estimated_cost}/hr
                        </Typography>
                    </Box>
                </Box>
                <Box
                    display="flex"
                    border={`1px solid ${alpha(theme.palette.border.dashboard, 0.2)}`}
                    padding={`${theme.spacing(1.5)} ${theme.spacing(2)}`}
                >
                    <Box flex={1}>
                        <Typography className={clsx(classes.text, classes.info)}>Logs</Typography>
                    </Box>
                    <Box flex={1} display="flex">
                        <Typography className={clsx(classes.text, classes.value)}>
                            View training logs
                        </Typography>
                        <IconButton
                            onClick={openTrainingLog}
                            title="View training logs"
                            className={clsx(classes.actionButton, classes.logButton)}
                        >
                            <ListAltIcon fontSize="large" />
                        </IconButton>
                    </Box>
                </Box>
                <Box>
                    {expDetails?.status?.toLowerCase() !== 'completed' &&
                        expDetails?.status?.toLowerCase() !== 'failed' &&
                        status?.status?.toLowerCase() !== 'completed' &&
                        status?.status?.toLowerCase() !== 'failed' && (
                            <Typography className={clsx(classes.text, classes.info)}>
                                Last Updated on {formatter1.format(lastUpdated)}
                            </Typography>
                        )}
                </Box>
            </Box>
        </Box>
    );
};

const CheckpointRow = ({
    expDetails,
    specification,
    onTrainingResult,
    startEvaluation,
    index,
    isLoading,
    ...props
}) => {
    const classes = useStyles();
    const theme = useTheme();

    const evaluateButton = useMemo(() => {
        const status = specification.status.toLowerCase();
        if (isLoading) {
            return (
                <IconButton title="Loading" className={classes.actionButton}>
                    <CodxCircularLoader size={20} />
                </IconButton>
            );
        }
        if (status === 'not initialized' || status === 'unavailable') {
            return (
                <IconButton
                    title="Evaluate on test set"
                    className={classes.actionButton}
                    disabled={
                        !expDetails.is_checkpoint_evaluation_enabled || status === 'unavailable'
                    }
                    onClick={() => startEvaluation(specification.name)}
                >
                    <QueryStats />
                </IconButton>
            );
        } else if (status === 'completed') {
            return (
                <IconButton
                    title="Test set results"
                    className={classes.actionButton}
                    onClick={() =>
                        props.history.push(
                            `/llmworkbench/finetunedmodels/${expDetails.expDetails.id}/checkpoints/${specification.name}/results`,
                            {
                                model: expDetails
                            }
                        )
                    }
                >
                    <FactCheck />
                </IconButton>
            );
        } else {
            return (
                <IconButton title="Evaluating..." className={classes.actionButton}>
                    <CodxCircularLoader size={20} />
                </IconButton>
            );
        }
    }, [
        props.history,
        classes,
        expDetails,
        startEvaluation,
        specification.name,
        specification.status,
        isLoading
    ]);

    return (
        <TableRow>
            <StyledTableCell>{index + 1}</StyledTableCell>
            <StyledTableCell>{specification.current_steps}</StyledTableCell>
            <StyledTableCell>{specification.loss}</StyledTableCell>
            <StyledTableCell>{trimFloatValue(specification.eval_loss) || '-'}</StyledTableCell>
            <StyledTableCell>
                <IconButton
                    disabled={!specification?.is_result_generated}
                    onClick={() => onTrainingResult(specification.current_steps)}
                    title={
                        specification?.is_result_generated
                            ? 'Click to view results'
                            : 'result have not generated yet'
                    }
                    className={classes.actionButton}
                >
                    <VisibilityOutlinedIcon fontSize="large" />
                </IconButton>
            </StyledTableCell>
            <StyledTableCell>
                {evaluateButton}
                <IconButton
                    title="Deploy checkpoint"
                    className={classes.actionButton}
                    style={{ marginLeft: theme.spacing(2) }}
                    disabled={!specification?.is_result_generated}
                    onClick={() =>
                        props.history.push(
                            `/llmworkbench/models/${expDetails.expDetails.base_model_id}/experiments/${expDetails.expDetails.id}/checkpoints/${specification.name}/deploy`,
                            {
                                model: expDetails
                            }
                        )
                    }
                >
                    <DeployIcon />
                </IconButton>
            </StyledTableCell>
        </TableRow>
    );
};

const FinalResult = ({ onTrainingResult, expDetails, finalResult, ...props }) => {
    const classes = useStyles();
    const theme = useTheme();
    const handleDeploy = async ({ id, base_model_id }) => {
        props.history.push(`/llmworkbench/models/${base_model_id}/experiments/${id}/deploy`);
    };
    return (
        <TableRow>
            <StyledTableCell>{expDetails?.expDetails?.name}</StyledTableCell>
            <StyledTableCell>{finalResult?.current_steps}</StyledTableCell>
            <StyledTableCell>{finalResult?.loss || '-'}</StyledTableCell>
            <StyledTableCell>{trimFloatValue(finalResult?.eval_loss) || '-'}</StyledTableCell>
            <StyledTableCell>
                <IconButton
                    onClick={() => {
                        onTrainingResult(0, true);
                    }}
                    title={'Click to view training results'}
                    className={classes.actionButton}
                >
                    <VisibilityOutlinedIcon fontSize="large" />
                </IconButton>
            </StyledTableCell>
            <StyledTableCell>
                <IconButton
                    title="Test set results"
                    className={classes.actionButton}
                    onClick={() =>
                        props.history.push(
                            `/llmworkbench/finetunedmodels/${expDetails?.expDetails.id}/results`
                        )
                    }
                >
                    <FactCheck />
                </IconButton>
                <IconButton
                    onClick={() => handleDeploy(expDetails?.expDetails)}
                    title="Deploy checkpoint"
                    className={classes.actionButton}
                    style={{ marginLeft: theme.spacing(2) }}
                >
                    <DeployIcon />
                </IconButton>
            </StyledTableCell>
        </TableRow>
    );
};

const Checkpoints = ({ onTrainingResult, expDetails, message, finalResult, ...props }) => {
    const [checkpoints, setCheckpoints] = useState([]);
    const [isLoadingStatus, setIsLoadingStatus] = useState(false);
    const [toggle, setToggle] = useState('Checkpoints');
    const theme = useTheme();
    const classes = useStyles();
    const { connect, disconnect } = useEventSource();
    useEffect(() => {
        const loadAndFormatData = async () => {
            if (!expDetails?.checkpoints?.length) return;
            let statuses = [];
            try {
                if (
                    expDetails.status.toLowerCase() === 'completed' &&
                    expDetails.is_checkpoint_evaluation_enabled
                ) {
                    setIsLoadingStatus(true);
                    const { data } = await getCheckpointEvaluationStatus(expDetails.expDetails.id);
                    statuses = data;
                }
            } catch (error) {
                statuses = [];
            } finally {
                setIsLoadingStatus(false);
            }
            const evaluationObj = {};
            let isStreamingRequired = false;
            statuses.map((ev) => {
                if (
                    ev.status.toLowerCase() !== 'completed' &&
                    ev.status.toLowerCase() !== 'not initialized' &&
                    ev.status.toLowerCase() !== 'unavailable'
                ) {
                    isStreamingRequired = true;
                }
                evaluationObj[ev.name] = ev.status;
            });
            const checkpoints = expDetails.checkpoints.map((checkpoint) => {
                const status = evaluationObj[checkpoint.name] || 'unavailable';
                return {
                    ...checkpoint,
                    status
                };
            });
            setCheckpoints(checkpoints);
            if (isStreamingRequired) {
                startCheckpointStream();
            }
        };
        loadAndFormatData();
        return () => {
            disconnect();
            if (checkpointTimer) clearInterval(checkpointTimer);
            setIsLoadingStatus(false);
        };
    }, [expDetails]);

    const startCheckpointStream = useCallback(() => {
        disconnect();
        if (!expDetails?.expDetails?.id) return;
        connect(
            `${import.meta.env['REACT_APP_GENAI']}/services/llm-workbench/experiments/${
                expDetails?.expDetails?.id
            }/stream-evaluation-status`,
            {
                onMessage: onCheckpointMessage,
                onFreeze: fallbackHandler,
                interval: 300000 //5 minutes
            }
        );
    }, [expDetails]);

    const fallbackHandler = useCallback(async () => {
        let statuses = [];
        try {
            const { data } = await getCheckpointEvaluationStatus(expDetails.expDetails.id);
            statuses = data;
        } catch (error) {
            statuses = [];
        }
        const evaluationObj = {};
        statuses.map((ev) => {
            evaluationObj[ev.name] = ev.status;
        });
        let stopInterval = true;
        const checkpoints = expDetails.checkpoints.map((checkpoint) => {
            const status = evaluationObj[checkpoint.name] || 'unavailable';
            if (
                status.toLowerCase() !== 'not initialized' &&
                status.toLowerCase() !== 'completed' &&
                status.toLowerCase() !== 'unavailable'
            ) {
                stopInterval = false;
            }
            return {
                ...checkpoint,
                status
            };
        });
        if (checkpointTimer && stopInterval) {
            clearInterval(checkpointTimer);
        }
        setCheckpoints(checkpoints);
    }, [expDetails]);

    const onCheckpointMessage = (e) => {
        if (!e.data) return;
        const { checkpoints: streamedCheckpoints } = JSON.parse(e.data);
        if (!streamedCheckpoints?.length) {
            disconnect();
            checkpointTimer = setInterval(fallbackHandler, 10000);
            return;
        }
        const evaluationObj = {};
        let stopStream = true;
        streamedCheckpoints.map((ev) => {
            evaluationObj[ev.name] = ev.checkpoint_evaluation_status;
            if (
                ev.checkpoint_evaluation_status.toLowerCase() !== 'completed' &&
                ev.checkpoint_evaluation_status.toLowerCase() !== 'not initialized' &&
                ev.checkpoint_evaluation_status.toLowerCase() !== 'unavailable'
            ) {
                stopStream = false;
            }
        });
        if (stopStream) {
            disconnect();
        }
        setCheckpoints((checkpoints) =>
            checkpoints.map((checkpoint) => {
                return {
                    ...checkpoint,
                    status: evaluationObj[checkpoint.name] || 'unavailable'
                };
            })
        );
    };

    const startEvaluation = useCallback(
        async (checkpoint_name) => {
            if (!expDetails?.expDetails?.id || !checkpoint_name) {
                return;
            }
            setCheckpoints((checkpoints) =>
                checkpoints.map((checkpoint) => {
                    if (checkpoint.name === checkpoint_name) {
                        return {
                            ...checkpoint,
                            status: 'loading'
                        };
                    }
                    return checkpoint;
                })
            );
            try {
                await startCheckpointEvaluation(expDetails.expDetails.id, checkpoint_name);
                startCheckpointStream();
            } catch (error) {
                console.error(error);
                setCheckpoints((checkpoints) =>
                    checkpoints.map((checkpoint) => {
                        if (checkpoint.name === checkpoint_name) {
                            return {
                                ...checkpoint,
                                status: 'unavailable'
                            };
                        }
                        return checkpoint;
                    })
                );
            }
        },
        [expDetails?.expDetails?.id]
    );

    const onToggleChange = (_, changedValue) => {
        setToggle(changedValue);
    };

    return (
        <Box
            flex={1}
            paddingX={theme.spacing(4)}
            display="flex"
            flexDirection="column"
            gridGap={theme.spacing(1)}
            height="80vh"
            paddingBottom={theme.spacing(3)}
        >
            <Typography className={clsx(classes.text, classes.title)}>
                {toggle === 'Checkpoints' ? 'Checkpoints Summary' : 'Performance Summary'}
            </Typography>

            <Box className={classes.checkpointContainer}>
                <ToggleButtonGroup
                    color="primary"
                    exclusive
                    style={{ alignSelf: 'flex-end' }}
                    size="small"
                    onChange={onToggleChange}
                >
                    <ToggleButton
                        value={'Checkpoints'}
                        className={classes.toggleBtnLabel}
                        style={{
                            border:
                                toggle === 'Checkpoints'
                                    ? `2px solid ${theme.palette.primary.contrastText}`
                                    : ''
                        }}
                    >
                        Checkpoints
                    </ToggleButton>
                    <ToggleButton
                        value={'Final'}
                        className={classes.toggleBtnLabel}
                        style={{
                            border:
                                toggle === 'Final'
                                    ? `2px solid ${theme.palette.primary.contrastText}`
                                    : ''
                        }}
                        disabled={expDetails?.status?.toLowerCase() !== 'completed'}
                    >
                        Final
                    </ToggleButton>
                </ToggleButtonGroup>
                {toggle === 'Checkpoints' ? (
                    checkpoints.length > 0 ? (
                        <TableContainer>
                            <Table stickyHeader>
                                <TableHead style={{ zIndex: 100 }}>
                                    <TableRow>
                                        <StyledTableCell>Checkpoint</StyledTableCell>
                                        <StyledTableCell>Steps</StyledTableCell>
                                        <StyledTableCell>Training Loss</StyledTableCell>
                                        <StyledTableCell>Validation Loss</StyledTableCell>
                                        <StyledTableCell>Training Results</StyledTableCell>
                                        <StyledTableCell>Actions</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {checkpoints.map((specification, index) => (
                                        <CheckpointRow
                                            expDetails={expDetails}
                                            specification={specification}
                                            onTrainingResult={onTrainingResult}
                                            key={specification.name}
                                            startEvaluation={startEvaluation}
                                            index={index}
                                            isLoading={isLoadingStatus}
                                            {...props}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Box
                            display={'flex'}
                            flexDirection={'column'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            height={'100%'}
                        >
                            <Typography className={classes.text} style={{ fontSize: '1.5rem' }}>
                                {message || 'No checkpoints created yet'}
                            </Typography>
                        </Box>
                    )
                ) : finalResult ? (
                    <TableContainer>
                        <Table stickyHeader>
                            <TableHead style={{ zIndex: 100 }}>
                                <TableRow>
                                    <StyledTableCell>Model</StyledTableCell>
                                    <StyledTableCell>Steps</StyledTableCell>
                                    <StyledTableCell>Training Loss</StyledTableCell>
                                    <StyledTableCell>Validation Loss</StyledTableCell>
                                    <StyledTableCell>Training Results</StyledTableCell>
                                    <StyledTableCell>Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <FinalResult
                                    expDetails={expDetails}
                                    onTrainingResult={onTrainingResult}
                                    finalResult={finalResult}
                                    {...props}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        height={'100%'}
                    >
                        <Typography className={classes.text} style={{ fontSize: '1.5rem' }}>
                            {'Result have not generated yet'}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

const FinetuneStatus = (props) => {
    const [isTrainingLogOpen, setIsTrainingLogOpen] = useState(false);
    const [isTrainingResultOpen, setIsTrainingResultOpen] = useState(false);
    const [status, setStatus] = useState({});
    const [logs, setLogs] = useState([]);
    const classes = useStyles();
    const theme = useTheme();
    const { connect, disconnect } = useEventSource();
    const modelId = props.match.params.modelId;
    const [expDetails, setExpDetails] = useState();
    const [elapsedTime, setElapsedTime] = useState();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeCheckpointId, setActiveCheckpointId] = useState(null);
    const [checkpointMsg, setCheckpointMsg] = useState('');
    const [stopLoader, setStopLoader] = useState(false);
    const [finalResult, setFinalResult] = useState();
    const [expTraining, setExpTraining] = useState(false);

    useEffect(() => {
        const fetchExpDetails = async () => {
            try {
                setLoading(true);
                const response = await getExperimentDetailById(modelId);
                setExpDetails(response);
                setError(false);
                setLoading(false);
                if (response?.status?.toLowerCase() === 'completed')
                    setCheckpointMsg('Loading checkpoints...');
                await getCurrentData();
                if (
                    response?.status?.toLowerCase() !== 'completed' &&
                    response?.status?.toLowerCase() !== 'failed' &&
                    response?.status?.toLowerCase() !== 'terminated'
                ) {
                    getElapsedTime(new Date(response?.created_at));
                    timeout = setTimeout(() => startConnection(), 10000);
                }
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchExpDetails();
        return () => {
            stopConnection();
            if (timeout) clearTimeout(timeout);
        };
    }, [modelId]);

    useEffect(() => {
        if (
            expDetails?.status?.toLowerCase() === 'completed' ||
            (status &&
                (status?.status?.toLowerCase() === 'completed' ||
                    status?.status?.toLowerCase() === 'failed' ||
                    status?.status?.toLowerCase() === 'terminated'))
        ) {
            clearInterval(timerInterval);
            return;
        }
        if (timerInterval) clearInterval(timerInterval);

        if (
            expDetails &&
            expDetails?.status?.toLowerCase() !== 'completed' &&
            expDetails?.status?.toLowerCase() !== 'failed' &&
            expDetails?.status?.toLowerCase() !== 'terminated'
        ) {
            timerInterval = setInterval(() => {
                getElapsedTime(new Date(expDetails?.created_at));
            }, 1000);
        }
        return () => {
            clearInterval(timerInterval);
            // stopConnection();
        };
    }, [expDetails, status?.status]);

    let interval;

    useEffect(() => {
        const loadAndFormatData = async () => {
            const response = await getExperimentResultById(modelId);
            const length = response.data?.train_loss?.length;
            if (response.data?.train_loss[length - 1].loss !== null)
                setFinalResult(response.data?.train_loss[length - 1]);
            else setFinalResult(response.data?.train_loss[length - 2]);
        };
        if (status?.status?.toLowerCase() === 'completed') {
            interval = setTimeout(() => {
                loadAndFormatData();
            }, 2000);
        }
        return () => {
            clearInterval(interval);
        };
    }, [status?.status, modelId]);
    const getCurrentData = useCallback(async () => {
        const ststResponse = await getExperimentStatusById(modelId);
        let data = ststResponse?.data;
        if (data?.logs) {
            let updatedData = data?.logs[data?.logs?.length - 1];
            setElapsedTime(updatedData?.elapsed_time);
            setExpDetails((details) => ({ ...details, ...updatedData }));
            setLogs(() => data?.logs?.map((log) => JSON.stringify(log)));
        }
        setStatus(data);
    }, [modelId]);

    const getElapsedTime = (createdTime, currentTime = new Date().getTime()) => {
        // Calculate the difference in milliseconds
        let differenceMs = Math.abs(currentTime - createdTime);
        // Convert milliseconds to seconds, minutes, and hours
        let seconds = Math.floor(differenceMs / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        // Calculate remaining minutes and seconds
        seconds %= 60;
        minutes %= 60;
        let result = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
        if (result === 'NaN:NaN:NaN') result = 'Calculating...';
        setElapsedTime(result);
    };
    function formatTime(number) {
        return (number < 10 ? '0' : '') + number;
    }

    const getProgress = useCallback(
        (percentage) => {
            let isResultGenerated = status?.checkpoints?.some(
                (exp) => exp.is_result_generated === false
            );
            if (status?.status?.toLowerCase() === 'completed') {
                percentage = 100;
            } else if (percentage === 100)
                if (status?.status?.toLowerCase() === 'in-progress' && isResultGenerated) {
                    if (status?.logs?.[status?.logs?.length - 2]?.percentage) {
                        percentage = Math.floor(
                            (status?.logs?.[status?.logs?.length - 2]?.percentage + 100) / 2
                        );
                        return percentage;
                    }
                }
            return percentage;
        },
        [status?.logs]
    );

    const startConnection = useCallback(() => {
        stopConnection();
        connect(
            `${
                import.meta.env['REACT_APP_GENAI']
            }/services/llm-workbench/experiments/${modelId}/stream-status`,
            {
                onMessage: handleUpdate,
                onFreeze: fallbackHandler,
                interval: 300000 //5 minutes
            }
        );
    }, [modelId]);
    const stopConnection = useCallback(() => {
        if (timer) {
            clearInterval(timer);
        }
        disconnect();
    }, [modelId]);
    const fallbackHandler = useCallback(async () => {
        // stopConnection()
        disconnect();
        const expStatus = await getExperimentStatusById(modelId);
        handleUpdate(expStatus, false);
    }, [modelId]);

    const handleInterruptTraining = async () => {
        try {
            setStopLoader(true);
            await interruptTraining(modelId);
            setStopLoader(false);
        } catch (error) {
            //TODO : Handle failed case
            console.log('Error', error);
            setStopLoader(false);
        }
    };

    const handleUpdate = useCallback(
        (e, parse = true) => {
            if (e.data) {
                console.log(e.data);
                let data = parse ? JSON.parse(e.data) : e.data;
                const status = data.status.toLowerCase();
                if (data?.logs) {
                    let updatedData = data?.logs[data?.logs?.length - 1];
                    setExpDetails((details) => ({ ...details, ...updatedData }));
                    setLogs(() => data?.logs?.map((log) => JSON.stringify(log)));
                }
                switch (status) {
                    case 'eoc':
                        stopConnection();
                        timer = setInterval(fallbackHandler, 10000);
                        break;
                    case 'completed':
                        stopConnection();
                        setStatus(data);
                        break;
                    case 'failed':
                        stopConnection();
                        setStatus(data);
                        break;
                    case 'terminated':
                        stopConnection();
                        setStatus(data);
                        break;
                    default: {
                        setStatus(data);
                        break;
                    }
                }
            }
        },
        [modelId]
    );

    const openTrainingDialog = (checkpointId = null, training = false) => {
        setIsTrainingResultOpen(true);
        if (!training) setActiveCheckpointId(checkpointId);
        setExpTraining(training);
    };

    const closeTrainingDialog = () => {
        setIsTrainingResultOpen(false);
        setActiveCheckpointId(null);
    };
    if (loading) {
        return <CodxCircularLoader size={60} center />;
    }
    if (error) {
        return <PageNotFound message="Experiment status not found or does not exist" />;
    }
    return (
        <Box display="flex" flexDirection="column" flex={1} gridGap={theme.spacing(2)}>
            <TrainingLogs logs={logs} open={isTrainingLogOpen} setOpen={setIsTrainingLogOpen} />
            <TrainingResults
                open={isTrainingResultOpen}
                checkpointId={activeCheckpointId}
                modelId={modelId}
                closeDialog={closeTrainingDialog}
                expTraining={expTraining}
            />
            <Box
                display="flex"
                flexDirection="column"
                flex={1}
                marginLeft={theme.spacing(1.2)}
                borderLeft={`1px solid ${theme.palette.separator.grey}`}
                borderRight={`1px solid ${theme.palette.separator.grey}`}
            >
                <Box>
                    <Box
                        paddingRight={theme.spacing(4)}
                        paddingLeft={theme.spacing(2)}
                        paddingTop={theme.spacing(1)}
                        paddingBottom={theme.spacing(2)}
                        display="flex"
                        alignItems="center"
                    >
                        <Link className={classes.back} to="/llmworkbench/finetunedmodels">
                            <ChevronLeftIcon fontSize="large" /> Back to finetuned experiments
                        </Link>
                    </Box>
                    <Box marginX={theme.spacing(1)}>
                        <Divider className={classes.divider} />
                    </Box>
                </Box>
                <Box flex={1} display="flex" paddingTop={theme.spacing(2)}>
                    <RealTimeProgress
                        openTrainingLog={() => setIsTrainingLogOpen(true)}
                        expDetails={{ ...expDetails, ...status }}
                        elapsedTime={elapsedTime}
                        handleInterruptTraining={handleInterruptTraining}
                        stopLoader={stopLoader}
                        getProgress={getProgress}
                    />
                    <Divider orientation="vertical" className={classes.divider} />
                    <Checkpoints
                        onTrainingResult={openTrainingDialog}
                        expDetails={{ expDetails, ...status }}
                        message={checkpointMsg}
                        finalResult={finalResult}
                        {...props}
                    />
                </Box>
            </Box>
            <Divider
                style={{
                    backgroundColor: theme.palette.separator.grey,
                    marginLeft: theme.spacing(2),
                    marginRight: theme.spacing(1)
                }}
            />
            <Box height={'5%'}>
                <Footer fluid />
            </Box>
        </Box>
    );
};

export default FinetuneStatus;
