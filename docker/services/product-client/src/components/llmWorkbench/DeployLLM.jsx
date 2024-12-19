import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Typography,
    makeStyles
} from '@material-ui/core';
import CustomSnackbar from 'components/CustomSnackbar';
import {
    deployModel,
    deployLLMModel,
    getDeploymentStatusById
} from 'services/llmWorkbench/llm-workbench';
import deployLLMStyle from 'assets/jss/llmWorkbench/deployLLMStyle';
import CodxCircularLoader from '../CodxCircularLoader';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import MarkdownRenderer from '../MarkdownRenderer';
import t from 'config/textContent/llmWorkbench.json';
import { addDeployedModelIdAndJobId, updateDeploymentJobStatus } from 'store';
import useEventSource from 'hooks/useEventSource';

let timer;

const SCREENS = {
    ACTION: 'ACTION',
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    PENDING: 'PENDING',
    REJECTED: 'REJECTED'
};

const useStyles = makeStyles(deployLLMStyle);

const SettingsScreen = ({ action, handleDeploy }) => {
    const classes = useStyles();
    return (
        <Box className={classes.innerBox}>
            <Typography variant="h4" className={`${classes.heading} ${classes.deployHeading}`}>
                {t.deploy_llm.action_modal.title}
            </Typography>
            <Typography variant="h5" className={classes.heading} align="justify">
                {t.deploy_llm.action_modal.description}
            </Typography>
            <div className={classes.buttonContainer}>
                <Button variant="outlined" onClick={action.previous}>
                    {t.deploy_llm.action_modal.button.back}
                </Button>
                <Button variant="contained" onClick={handleDeploy}>
                    {t.deploy_llm.action_modal.button.next}
                </Button>
            </div>
        </Box>
    );
};

const SuccessScreen = ({ activeModel, action }) => {
    return (
        <>
            <DeploySuccessful activeModel={activeModel} />
            <ScreenFooter
                action={action}
                isCenter={activeModel?.status.toLowerCase() === 'completed'}
                isDeployed
            />
        </>
    );
};

const LoadingScreen = ({ deploymentStatus, action }) => {
    return (
        <>
            <DeploymentInProgress deploymentStatus={deploymentStatus} />
            <ScreenFooter action={action} isDeployed={false} />
        </>
    );
};

const ScreenFooter = ({ action, isCenter, isDeployed = false }) => {
    const classes = useStyles();

    const handleExplore = useCallback(() => {
        action.next();
    }, []);

    return (
        <Box
            className={classes.progressBarContainer}
            style={{ textAlign: isCenter ? 'center' : 'left' }}
        >
            {isDeployed ? (
                <Typography variant="h4">Explore Deployed models.</Typography>
            ) : (
                <Typography variant="h4">
                    This deployment will take sometime. In the meanwhile, you can explore other
                    models.
                </Typography>
            )}
            <Button
                variant="outlined"
                className={classes.customButton}
                style={{ marginTop: '1rem' }}
                onClick={handleExplore}
            >
                Go to Deployed models
            </Button>
        </Box>
    );
};

const DeploymentInProgress = ({ deploymentStatus }) => {
    const classes = useStyles();

    return (
        <>
            <Box className={classes.inProgresscontainer}>
                <CodxCircularLoader size={60} />
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                gridGap="1rem"
                className={classes.progressBarContainer}
            >
                <Typography variant="h4">LLM Deployment in Progress...</Typography>
                <LinearProgress
                    className={classes.progressBar}
                    variant="determinate"
                    value={deploymentStatus}
                />
            </Box>
        </>
    );
};

const DeploySuccessful = ({ activeModel }) => {
    const classes = useStyles();
    const [markdownData, setMarkdownData] = useState({ noteBookMarkDown: '', packageMarkDown: '' });
    useEffect(() => {
        loadMarkdownData();
    }, [activeModel]);

    const loadMarkdownData = useCallback(async () => {
        const response = await deployModel({ id: activeModel.id });
        setMarkdownData({
            noteBookMarkDown: response?.data?.notebook,
            packageMarkDown: response?.data?.package
        });
    }, [activeModel]);

    return (
        <>
            <Box className={classes.inProgresscontainer}>
                <IconButton title="Deployment success">
                    <CheckCircleIcon style={{ color: 'green', fontSize: '4em' }} />
                </IconButton>
            </Box>
            <Typography variant="h3">Deployment Successful</Typography>
            <Box className={classes.accessContainer}>
                <Typography variant="h4" className={classes.accessText}>
                    Ways to access this model:
                </Typography>
                <List component={'ol'}>
                    <ListItem component={'li'} style={{ paddingTop: 0 }}>
                        <ListItemText
                            primary={
                                <Typography variant="h5">
                                    1. Use the playground(not yet developed)
                                </Typography>
                            }
                        />
                    </ListItem>
                    <ListItem component={'li'} style={{ paddingTop: 0 }}>
                        <ListItemText
                            primary={
                                <>
                                    <Typography variant="h5">
                                        2. Use the workbench package
                                    </Typography>
                                    <MarkDownContent markdownData={markdownData} />
                                </>
                            }
                        ></ListItemText>
                    </ListItem>
                </List>
            </Box>
        </>
    );
};

const DeploymentFailed = () => {
    const classes = useStyles();
    return (
        <>
            <Box className={classes.inProgresscontainer}>
                <IconButton title="Deployment failed">
                    <CancelIcon style={{ color: 'red', fontSize: '4em' }} />
                </IconButton>
            </Box>
            <Typography variant="h3">Deployment Failed</Typography>
            <Typography variant="h4" className={classes.accessText}>
                Please contact support@nuclios.com to know more
            </Typography>
        </>
    );
};

const ApprovalRequired = () => {
    const classes = useStyles();
    return (
        <>
            <Box className={classes.inProgresscontainer}>
                <IconButton title="Deployment pending">
                    <SupervisorAccountIcon style={{ fontSize: '4em' }} />
                </IconButton>
            </Box>
            <Typography variant="h3">Deployment Set For Approval</Typography>
            <Typography variant="h4" className={classes.accessText}>
                Deployment should be approved by admin for it to start
            </Typography>
        </>
    );
};

const DeploymentRejected = () => {
    const classes = useStyles();
    return (
        <>
            <Box className={classes.inProgresscontainer}>
                <IconButton title="Deployment Rejcted">
                    <CancelIcon style={{ color: 'red', fontSize: '4em' }} />
                </IconButton>
            </Box>
            <Typography variant="h3">Deployment Rejected</Typography>
            <Typography variant="h4" className={classes.accessText}>
                Please contact the admins to know more
            </Typography>
        </>
    );
};

const MarkDownContent = ({ markdownData }) => {
    const { noteBookMarkDown, packageMarkDown } = markdownData;
    return (
        <Box>
            <MarkdownRenderer markdownContent={packageMarkDown}></MarkdownRenderer>
            <Typography variant="h5">In a notebook:</Typography>
            <MarkdownRenderer markdownContent={noteBookMarkDown}></MarkdownRenderer>
        </Box>
    );
};

export default function DeployLLM({ action, ...props }) {
    const dispatch = useDispatch();
    const {
        deployedLLM: { activeModel }
    } = useSelector((state) => state.llmWorkbench);
    const [notification, setNotification] = useState();
    const [notificationOpen, setNotificationOpen] = useState();
    const [deploymentStatus, setDeploymentStatus] = useState(0);
    const [activeScreen, setActiveScreen] = useState(null);

    const { connect, disconnect } = useEventSource();

    useEffect(() => {
        return () => {
            stopConnection();
        };
    }, []);

    useEffect(() => {
        if (activeModel?.approval_status && activeModel.approval_status !== 'approved') {
            switch (activeModel.approval_status) {
                case 'rejected': {
                    setActiveScreen(SCREENS.REJECTED);
                    break;
                }
                case 'pending':
                default: {
                    setActiveScreen(SCREENS.PENDING);
                    break;
                }
            }
        } else if (activeModel?.status) {
            switch (activeModel.status.toLowerCase()) {
                case 'completed': {
                    setActiveScreen(SCREENS.SUCCESS);
                    break;
                }
                case 'failed': {
                    setActiveScreen(SCREENS.FAILED);
                    break;
                }
                default: {
                    setDeploymentStatus(activeModel?.progress ?? 0);
                    setActiveScreen(SCREENS.LOADING);
                    timer = setInterval(fallbackHandler, 10000);
                    if (props.isDelayed) {
                        setTimeout(() => {
                            startConnection();
                        }, 10000);
                    } else {
                        startConnection();
                    }
                }
            }
        } else if (!props.isDeployed) {
            setActiveScreen(SCREENS.ACTION);
        }
        return () => {
            stopConnection();
        };
    }, [activeModel]);

    const startConnection = useCallback(() => {
        const { id } = activeModel;
        stopConnection();
        connect(
            `${
                import.meta.env['REACT_APP_GENAI']
            }/services/llm-workbench/deployments/${id}/stream-status`,
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
        const { id } = activeModel;
        const jobDetails = await getDeploymentStatusById(id);
        handleUpdate(jobDetails, false);
    }, [activeModel]);

    const handleUpdate = (e, parse = true) => {
        if (e.data) {
            let data = parse ? JSON.parse(e.data) : e.data;
            switch (data.status.toLowerCase()) {
                case 'completed':
                case 'failed': {
                    if (timer) {
                        clearInterval(timer);
                    }
                    dispatch(updateDeploymentJobStatus(data.status));
                    stopConnection();
                    break;
                }
                case 'eoc': {
                    stopConnection();
                    timer = setInterval(fallbackHandler, 10000);
                    break;
                }
                default: {
                    setDeploymentStatus(() => data.progress);
                }
            }
        }
    };

    const handleDeploy = async () => {
        try {
            setActiveScreen(SCREENS.PENDING);
            const { data } = await deployLLMModel(activeModel);
            const { job_id, deployed_model_id, message } = data;
            dispatch(
                addDeployedModelIdAndJobId({
                    id: deployed_model_id,
                    job_id,
                    job_status: 'created',
                    approval_status: 'pending'
                })
            );
            setNotificationOpen(true);
            setNotification(() => ({
                message,
                severity: 'success'
            }));
        } catch (error) {
            setActiveScreen(SCREENS.FAILED);
            setNotificationOpen(true);
            setNotification(() => ({
                message: error?.message || 'Failed to Deploy',
                severity: 'error'
            }));
        }
    };

    const classes = useStyles();

    let activeComponent = [];

    switch (activeScreen) {
        case SCREENS.LOADING: {
            activeComponent = [
                <LoadingScreen key="loading" deploymentStatus={deploymentStatus} action={action} />
            ];
            break;
        }
        case SCREENS.ACTION: {
            activeComponent = [
                <SettingsScreen key="settings" action={action} handleDeploy={handleDeploy} />
            ];
            break;
        }
        case SCREENS.SUCCESS: {
            activeComponent = [
                <SuccessScreen key="success" action={action} activeModel={activeModel} />
            ];
            break;
        }
        case SCREENS.FAILED: {
            activeComponent = [<DeploymentFailed key="failed" />];
            break;
        }
        case SCREENS.PENDING: {
            activeComponent = [<ApprovalRequired key="pending" />];
            break;
        }
        case SCREENS.REJECTED: {
            activeComponent = [<DeploymentRejected key="rejected" />];
            break;
        }
        default:
            activeComponent = [];
    }

    return (
        <Box className={classes.container}>
            {activeComponent}
            <CustomSnackbar
                open={notificationOpen && notification?.message}
                autoHideDuration={3000}
                onClose={setNotificationOpen.bind(null, false)}
                severity={notification?.severity || 'success'}
                message={notification?.message}
            />
        </Box>
    );
}
