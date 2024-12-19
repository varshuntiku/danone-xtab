import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, IconButton, LinearProgress, makeStyles } from '@material-ui/core';

import Typography from 'components/elements/typography/typography';
import CustomSnackbar from 'components/CustomSnackbar';
import CodxCircularLoader from 'components/CodxCircularLoader';
import TrainingReport from 'components/llmWorkbench/TrainingReport';
import { useDispatch, useSelector } from 'react-redux';
import { getJobDetailsByUuid, submitFineTunedModel } from 'services/llmWorkbench/llm-workbench';
import useEventSource from 'hooks/useEventSource';
import { updateFinetuningJobStatus } from 'store';
import CancelIcon from '@material-ui/icons/Cancel';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        background: theme.palette.primary.altDark
    },
    boxWrapper: {
        background: theme.palette.background.default,
        borderRadius: theme.spacing(0.625),
        border: `1px solid ${theme.palette.border.dashboard}`
    },
    disabled: {
        opacity: '0.5'
    },
    progressBar: {
        backgroundColor: theme.palette.primary.light,
        '& .MuiLinearProgress-barColorPrimary': {
            backgroundColor: theme.palette.primary.contrastText
        },
        '& .MuiLinearProgress-colorPrimary': {
            backgroundColor: 'red'
        }
    },
    exploreContainer: {
        marginTop: '3rem'
    },
    accessText: {
        padding: '1.5rem 1.5rem 0 1rem'
    },
    accessContainer: {
        border: '1px solid ' + theme.palette.primary.contrastText,
        borderRadius: '5px',
        marginTop: '1rem',
        width: '100rem',
        backgroundColor: theme.palette.background.tab
    },
    inProgresscontainer: {
        width: '100rem',
        height: '15rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

let timer;

const STEPS = {
    ACTION: 'ACTION',
    TUNING: 'TUNING',
    REPORT: 'REPORT',
    FAILED: 'FAILED',
    REJECTED: 'REJECTED',
    APPROVAL: 'APPROVAL'
};

const ActionScreen = ({ action = {} }) => {
    const classes = useStyles();
    return (
        <Box display="flex" flexDirection="column" gridGap="1rem" width="50rem">
            <Box
                display="flex"
                flexDirection="column"
                gridGap="2rem"
                paddingY="4rem"
                paddingX="2rem"
                className={classes.boxWrapper}
            >
                <Typography variant="k11">Fine Tune</Typography>
                <Typography variant="bu1">
                    Set up a fine tune opertaion to make API calls against a provided model. You
                    will be able to track the finetuning status in the Supported Models page under
                    Finetuned Models tab. Once the operation is successfully completed it will be
                    ready for use.
                </Typography>
            </Box>
            <Box display="flex" gridGap="1rem">
                <Button variant="outlined" size="small" onclick={action.previous}>
                    Cancel
                </Button>
                <Button variant="contained" size="small" onClick={action.handleDeploy}>
                    Save and Fine tune
                </Button>
            </Box>
        </Box>
    );
};

const TuningScreen = ({ data = { progress: 0 } }) => {
    const classes = useStyles();
    return (
        <Box display="flex" flexDirection="column" minWidth="100rem">
            <Box display="flex" justifyContent="center" alignItems="center" padding="4rem">
                <CodxCircularLoader size={60} />
            </Box>
            <Box display="flex" flexDirection="column" gridGap="1rem">
                <Typography variant="h4">LLM fine tuning in Progress...</Typography>
                <LinearProgress
                    className={classes.progressBar}
                    variant="determinate"
                    value={data.progress}
                />
            </Box>
            <Box minWidth={'100rem'} className={classes.exploreContainer}>
                <Typography variant="h5">
                    Finetuning will take some time. In the meanwhile, you can explore other models.
                </Typography>
                <Button variant="outlined" style={{ marginTop: '1rem' }}>
                    Explore
                </Button>
            </Box>
        </Box>
    );
};

const FinetuningFailed = () => {
    const classes = useStyles();
    return (
        <Box display="flex" flexDirection="column" alignItems="center" minWidth="100rem">
            <Box className={classes.inProgresscontainer}>
                <IconButton>
                    <CancelIcon style={{ color: 'red', fontSize: '8rem' }} />
                </IconButton>
            </Box>
            <Typography variant="k7">Finetuning Failed</Typography>
            <Typography variant="k5" className={classes.accessText}>
                Please contact support@nuclios.com to know more
            </Typography>
        </Box>
    );
};

const ApprovalRequired = () => {
    const classes = useStyles();
    return (
        <Box display="flex" flexDirection="column" alignItems="center" minWidth="100rem">
            <Box className={classes.inProgresscontainer}>
                <IconButton>
                    <SupervisorAccountIcon style={{ fontSize: '8rem' }} />
                </IconButton>
            </Box>
            <Typography variant="k7">Finetuning Set For Approval</Typography>
            <Typography variant="k5" className={classes.accessText}>
                Finetuning should be approved by admin for it to start
            </Typography>
        </Box>
    );
};

const DeploymentRejected = () => {
    const classes = useStyles();
    return (
        <Box display="flex" flexDirection="column" alignItems="center" minWidth="100rem">
            <Box className={classes.inProgresscontainer}>
                <IconButton>
                    <CancelIcon style={{ color: 'red', fontSize: '8rem' }} />
                </IconButton>
            </Box>
            <Typography variant="k7">Finetuning Rejected</Typography>
            <Typography variant="k5" className={classes.accessText}>
                Please contact the admins to know more
            </Typography>
        </Box>
    );
};

const Step = ({ step, ...props }) => {
    switch (step) {
        case STEPS.ACTION: {
            return <ActionScreen {...props} />;
        }
        case STEPS.TUNING: {
            return <TuningScreen {...props} />;
        }
        case STEPS.REPORT: {
            return (
                <TrainingReport
                    finish={props.action.finish}
                    reconfigure={props.action.reconfigure}
                />
            );
        }
        case STEPS.APPROVAL: {
            return <ApprovalRequired {...props} />;
        }
        case STEPS.FAILED: {
            return <FinetuningFailed {...props} />;
        }
        case STEPS.REJECTED: {
            return <DeploymentRejected {...props} />;
        }
        default: {
            return null;
        }
    }
};

const FineTuneScreen = ({ ...props }) => {
    let action = {},
        data = {};
    const dispatch = useDispatch();
    const {
        fineTunedModel: { activeModel }
    } = useSelector((state) => state.llmWorkbench);
    const [notification, setNotification] = useState();
    const [notificationOpen, setNotificationOpen] = useState();
    const [step, setStep] = useState(null);
    const [finetuningStatus, setFinetuningStatus] = useState(0);

    const { connect, disconnect } = useEventSource();

    useEffect(() => {
        return () => {
            stopConnection();
        };
    }, []);

    useEffect(() => {
        if (!props.isDeployed) {
            setStep(STEPS.ACTION);
        } else if (activeModel?.approval_status && activeModel.approval_status !== 'approved') {
            switch (activeModel.approval_status) {
                case 'rejected': {
                    setStep(STEPS.REJECTED);
                    break;
                }
                case 'pending':
                default: {
                    setStep(STEPS.APPROVAL);
                    break;
                }
            }
        } else if (activeModel?.job_status) {
            switch (activeModel.job_status) {
                case 'success': {
                    setStep(STEPS.REPORT);
                    break;
                }
                case 'failed': {
                    setStep(STEPS.FAILED);
                    break;
                }
                default: {
                    setFinetuningStatus(activeModel?.progress ?? 0);
                    setStep(STEPS.TUNING);
                    if (props.isDelayed) {
                        setTimeout(() => {
                            startConnection();
                        }, 10000);
                    } else {
                        startConnection();
                    }
                }
            }
        }
        return () => {
            stopConnection();
        };
    }, [activeModel]);

    const startConnection = useCallback(() => {
        const { job_id } = activeModel;
        stopConnection();
        connect(
            `${import.meta.env['REACT_APP_GENAI']}/services/ml-models/model-jobs/${job_id}/status`,
            {
                onMessage: handleUpdate,
                onFreeze: fallbackHandler,
                interval: 300000 //5 minutes
            }
        );
    }, [activeModel]);

    const stopConnection = useCallback(() => {
        if (timer) {
            clearInterval(timer);
        }
        disconnect();
    }, [activeModel]);

    const fallbackHandler = useCallback(async () => {
        const { job_id } = activeModel;
        const jobDetails = await getJobDetailsByUuid(job_id);
        handleUpdate(jobDetails, false);
    }, [activeModel]);

    const handleUpdate = (e, parse = true) => {
        if (e.data) {
            let data = parse ? JSON.parse(e.data) : e.data;
            switch (data.status) {
                case 'success':
                case 'failed': {
                    if (timer) {
                        clearInterval(timer);
                    }
                    dispatch(updateFinetuningJobStatus(data.status));
                    stopConnection();
                    break;
                }
                case 'eoc': {
                    stopConnection();
                    timer = setInterval(fallbackHandler, 10000);
                    break;
                }
                default: {
                    setFinetuningStatus(() => data.progress);
                }
            }
        }
    };

    const handleDeploy = async () => {
        try {
            await submitFineTunedModel(activeModel.id);
            setStep(STEPS.APPROVAL);
            setNotificationOpen(true);
            setNotification(() => ({
                message: 'Model set for approval',
                severity: 'success'
            }));
        } catch (error) {
            setNotificationOpen(true);
            setNotification(() => ({
                message: 'Failed to set finetuning',
                severity: 'error'
            }));
        }
    };

    const reconfigure = () => {
        props.action.reconfigure();
    };

    switch (step) {
        case STEPS.ACTION:
            action = {
                handleDeploy,
                previous: props.action.previous
            };
            break;
        case STEPS.TUNING:
            data = {
                message: 'Estimated time of completion: 20 mins',
                progress: finetuningStatus
            };
            break;
        case STEPS.REPORT:
            action = {
                finish: props.action.next,
                reconfigure
            };
            break;
        default:
            action = {};
            data = {};
    }

    const classes = useStyles();
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
            className={classes.wrapper}
        >
            <Step step={step} action={action} data={data} />
            <CustomSnackbar
                open={notificationOpen && notification?.message}
                autoHideDuration={3000}
                onClose={setNotificationOpen.bind(null, false)}
                severity={notification?.severity || 'success'}
                message={notification?.message}
            />
        </Box>
    );
};

export default FineTuneScreen;
