import { Button, Step, StepLabel, Stepper, Typography, alpha, makeStyles } from '@material-ui/core';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import CopilotBusinessInfo from './copilotAppCreationSteps/CopilotBusinessInfo';
import DataConfiguration from './copilotAppCreationSteps/DataConfiguration';
import OnboardContext from './copilotAppCreationSteps/OnboardContext';
import ToolCofigurator from './copilotAppCreationSteps/ToolCofigurator';
import CreateAssistant from './copilotAppCreationSteps/CreateAssistant';
import LinearProgress from '@material-ui/core/LinearProgress';
import {
    createCopilotApplication,
    getCopilotApplication,
    updateCopilotApplication
} from 'services/copilotServices/copilot_app';
import {
    getPublishedTools,
    fetchMappedTools,
    uploadCopilotAvatar,
    getCopilotToolRegistryList
} from '../../../services/copilot';
import { withRouter } from 'react-router-dom';
import { getCopilotAppDatasources } from 'services/copilotServices/copilot_datasource';
import { getCopilotOrchestrators } from 'services/copilotServices/copilot_orchestrator';
import { getCopilotAppContexts } from 'services/copilotServices/copilot_context';
import clsx from 'clsx';
import BusinessInfoBackground from 'assets/img/copilot_business_info_bg.png';
import DatasourceBackground from 'assets/img/copilot_datasource_bg.png';
import ToolConfigBackground from 'assets/img/copilot_tool_bg.png';
import copilotConfiguratorStyle from './styles/copilotConfiguratorStyle';
import { connect } from 'react-redux';
import { getIndustries } from 'store/index';
import BusinessInfoIcon from 'assets/img/copilot_business_info_icon.png';
import DatasourceIcon from 'assets/img/copilot_datasource_icon.png';
import ContextIcon from 'assets/img/copilot_context_icon.png';
import ToolConfigIcon from 'assets/img/copilot_skillset_icon.png';
import AssistantIcon from 'assets/img/copilot_assistant_icon.png';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CodxCircularLoader from 'components/CodxCircularLoader';
import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';
import CustomSnackbar from '../../CustomSnackbar';
import { getAllDeployedModels } from 'services/copilotServices/llm_deployed_models';
import { CopilotToolConfiguratorContextProvider } from './context/CopilotToolConfiguratorContextProvider';
import sanitizeHtml from 'sanitize-html-react';

const useStyles = makeStyles((theme) => ({
    root: {
        height: `calc(100vh - ${theme.layoutSpacing(120)})`, //calc(100vh - 10rem)
        background: theme.palette.primary.dark,
        overflow: 'hidden',
        paddingBottom: theme.layoutSpacing(1)
        // padding: theme.layoutSpacing(0, 16)
    },
    actionBar: {
        // boxShadow: '0px -4px 8px -4px rgba(0, 0, 0, 0.40)',
        display: 'flex',
        padding: theme.layoutSpacing(16.6, 16.6, 0),
        gap: theme.layoutSpacing(16.6)
    },
    stepper: {
        padding: 0,
        height: 'max-content',
        '& .MuiStepLabel-label': {
            fontSize: theme.layoutSpacing(16),
            lineHeight: theme.layoutSpacing(26)
        },
        '& .MuiStepIcon-root': {
            width: theme.layoutSpacing(41.5),
            height: theme.layoutSpacing(41.5)
        },
        '& .MuiStepConnector-root': {
            display: 'none'
        }
    },
    stepContent: {
        padding: theme.layoutSpacing(0, 24.9),
        width: '100%',
        height: '100%',
        position: 'relative'
    },
    step: {
        width: '100%',
        '& .MuiTypography-root': {
            color: theme.palette.text.default
        },
        '& .Mui-disabled .MuiTypography-root': {
            color: alpha(theme.palette.text.default, 0.4)
        }
    },
    stepperInfo: {
        gridArea: 'info',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: theme.layoutSpacing(40),
        padding: theme.layoutSpacing(8.5, 119, 8.5, 147)
        // height: '100%'
    },
    stepNumberContainer: {
        padding: theme.layoutSpacing(9.5),
        // width: theme.layoutSpacing(93.5),
        // height: theme.layoutSpacing(93.5),
        width: theme.layoutSpacing(117),
        height: theme.layoutSpacing(117),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: theme.layoutSpacing(5.5),
        borderRadius: theme.layoutSpacing(20),
        backgroundSize: '100%'
    },
    stepDescription: {
        color: theme.palette.text.default,
        maxWidth: theme.layoutSpacing(700)
    },
    stepperInputSection: {
        gridArea: 'form',
        display: 'flex',
        alignItems: 'flex-start',
        height: '100%'
    },
    stepperLabel: {
        '&.MuiStepLabel-root': {
            flexDirection: 'column-reverse'
        },
        '& span': {
            width: '100%',
            '&.MuiStepLabel-labelContainer': {
                paddingLeft: theme.layoutSpacing(4)
            }
        },
        '& .MuiStepLabel-label': {
            textAlign: 'left',
            color: alpha(theme.palette.text.contrastText, 0.8),
            fontWeight: 500,
            '&.MuiStepLabel-active': {
                color: theme.palette.text.contrastText
            },
            paddingBottom: theme.layoutSpacing(8)
        },
        '&.Mui-disabled': {
            '& .MuiStepLabel-label': {
                color: alpha(theme.palette.text.revamp, 0.4)
            }
        }
    },
    stepperProgressBar: {
        width: '100%',
        height: theme.layoutSpacing(8),
        '& .MuiLinearProgress-bar.MuiLinearProgress-barColorPrimary.MuiLinearProgress-bar1Determinate':
            {
                backgroundColor: theme.palette.background.table
            },
        '&.MuiLinearProgress-colorPrimary': {
            backgroundColor: theme.palette.background.progressBarBg
        }
    },
    actionBarRoot: {
        gridArea: 'action',
        backgroundColor: theme.palette.background.pureWhite,
        zIndex: 1
    },
    overviewScreenInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',

        gap: theme.layoutSpacing(24),
        alignItems: 'flex-start',
        maxWidth: theme.layoutSpacing(587),
        margin: '0 auto',
        height: '100%'
    },
    startBtn: {
        letterSpacing: theme.layoutSpacing(1.5),
        borderRadius: theme.layoutSpacing(4.1472),
        fontFamily: 'Graphik Compact'
    },
    stepsOverview: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxHeight: '85%',
        overflowY: 'auto',

        '& > div:not(:last-child)': {
            borderBottom: `1px solid ${alpha(theme.palette.text.default, 0.2)}`,
            paddingBottom: theme.layoutSpacing(24)
        },

        '& > div:not(:first-child)': {
            paddingTop: theme.layoutSpacing(24)
        }
    },
    stepOverviewContainer: {
        display: 'flex',
        flex: '25%',
        gap: theme.layoutSpacing(16),
        paddingRight: theme.layoutSpacing(24),
        paddingLeft: theme.layoutSpacing(24)
    },
    stepOverviewInfo: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(16),
        marginRight: theme.layoutSpacing(72),
        paddingLeft: theme.layoutSpacing(16),
        width: theme.layoutSpacing(670)
    },
    stepOverviewGradient: {
        width: theme.layoutSpacing(70),
        height: theme.layoutSpacing(70),
        borderRadius: theme.layoutSpacing(4),
        backgroundSize: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',

        '& img': {
            width: theme.layoutSpacing(64),
            height: theme.layoutSpacing(64)
        }
    },
    gridContainer: {
        // paddingLeft: theme.layoutSpacing(8),
        // paddingRight: theme.layoutSpacing(8),
        height: '100%',
        display: 'grid',
        gridTemplateAreas: `
'info form'\n
'stepper stepper'\n
'action action'\n
        `,
        gridTemplateRows: `calc(100% - ${theme.layoutSpacing(104)}) auto auto`,
        gridTemplateColumns: '1fr 1fr'
    },
    gridContainerV2: {
        // paddingLeft: theme.layoutSpacing(8),
        // paddingRight: theme.layoutSpacing(8),
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr'
    },
    backButton: {
        position: 'absolute',
        top: theme.layoutSpacing(72),
        left: theme.layoutSpacing(32),
        '& .MuiButton-label': {
            fontSize: theme.layoutSpacing(18),
            letterSpacing: theme.layoutSpacing(0.5),
            lineHeight: theme.layoutSpacing(21.6)
        }
    },
    stepDetailContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(16)
    },
    stepperSection: {
        gridArea: 'stepper',
        // paddingTop: theme.layoutSpacing(28),
        zIndex: 1,
        backgroundColor: theme.palette.background.pureWhite
    },
    overviewScreenTitle: {
        lineHeight: theme.layoutSpacing(62)
    },
    activeStepNumber: {
        color: theme.palette.text.purpleText
    },
    overviewContainer: {
        display: 'grid',
        gridTemplateColumns: '5fr 7fr',
        height: '100%',
        alignItems: 'center'
    },
    stepTitle: {
        '&.MuiTypography-h3': {
            fontSize: theme.layoutSpacing(28)
        }
    },
    stepDetails: {
        '&.MuiTypography-h4': {
            fontSize: theme.layoutSpacing(18),
            lineHeight: theme.layoutSpacing(27)
        }
    }
}));

const DefaultConfiguratorSteps = [
    {
        label: 'Add Business Information',
        value: 100,
        title: 'Share Your Assistant Details',
        description:
            'Share essential details about your Ask NucliOS Assistant to customize responses. This includes objectives, business functions, and more.',
        bgGradient: BusinessInfoBackground,
        logo: BusinessInfoIcon
    },
    {
        overview: {
            title: 'Add Datasource',
            desc: 'Innovation to be launched by October to achieve targets for Q3 in category 2'
        },
        label: 'Data Configuration',
        value: -1,
        title: 'Integrate Data Sources',
        description:
            'Incorporate and set up your enterprise data sources to enhance the capabilities of your Assistant. Ensure seamless connectivity with relevant data.',
        bgGradient: DatasourceBackground,
        logo: DatasourceIcon
    },
    {
        overview: {
            title: 'Onboard Context',
            desc: 'Innovation to be launched by October to achieve targets for Q3 in category 2'
        },
        label: 'Data Configuration',
        value: -1,
        title: 'Onboard Context',
        description:
            'Enhance your Assistant’s precision by integrating diverse contexts to improve data accuracy and insights.',
        bgGradient: ToolConfigBackground,
        logo: ContextIcon
    },
    {
        label: 'Tool Configurator',
        value: -1,
        title: 'Empower your Assistant',
        description:
            "Boost your Assistant's intelligence by adding predefined skills. Tailor and configure these skills to align with your Assistant's capabilities & datasources.",
        bgGradient: BusinessInfoBackground,
        logo: ToolConfigIcon
    },
    {
        label: 'Create Your Assistant',
        value: -1,
        title: 'Create your Assistant',
        description:
            'Assign the Assistant an avatar and name, configure the orchestration module, and activate any additional modules as needed.',
        bgGradient: DatasourceBackground,
        logo: AssistantIcon
    }
];

const cachedPublishedTools = {};

function CreateCopilotApplication({ history, match, industryData, getIndustries }) {
    const classes = useStyles();
    const configClasses = copilotConfiguratorStyle();
    const { location } = history;
    const copilotAppId = match.params.copilot_app_id || null;
    const getCurrentStep = useCallback(() => {
        const searchParams = new URLSearchParams(location.search);
        const isValidStep = searchParams.has('step')
            ? searchParams.get('step') >= 1 && searchParams.get('step') <= 5
            : false;
        if (isValidStep) {
            return parseInt(searchParams.get('step')) - 1;
        } else {
            if (location.pathname.includes('edit')) {
                history.replace(`/platform-utils/copilot/edit/${copilotAppId}?step=1`);
            }
            return 0;
        }
    }, [location.search]);

    const [activeStep, setActiveStep] = useState(getCurrentStep);
    const [appData, setAppData] = useState({
        name: '',
        desc: '',
        config: {
            industry: '',
            org_name: ''
        }
    });
    const [steps, setSteps] = useState(JSON.parse(JSON.stringify(DefaultConfiguratorSteps)));
    // const [appDatasource] = useState({});
    const [mappedTools, setMappedTools] = useState([]);
    const [showCopilotConfigurator, setShowCopilotConfigurator] = useState(
        copilotAppId ? true : false
    );
    const [appDatasources, setAppDatasources] = useState([]);
    const [appContexts, setAppContexts] = useState([]);
    const [llmModels, setLlmModels] = useState([]);
    const [textToSpeechModels, setTextToSpeechModels] = useState([]);
    const [embeddingModels, setEmbeddingModels] = useState([]);
    const [newAvatar, setNewAvatar] = useState();
    const [activeRegistryId, setActiveRegistryId] = useState(0);
    const [registryList, setRegistryList] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPublishedTools, setIsLoadingPublishedTools] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });
    const [isAppMetaDataChange, setIsAppMetaDataChange] = useState(false);
    const [orchestrators, setOrchestrators] = useState([]);
    const [publishedTools, setPublishedTools] = useState([]);

    const fetchDataSources = async () => {
        const appId = copilotAppId || appData.id;
        if (appId) {
            try {
                const data = await getCopilotAppDatasources(appId);
                setAppDatasources(data);
                return data;
            } catch (err) {
                /** */
            }
        }
    };

    const fetchAppContexts = async () => {
        const appId = copilotAppId || appData.id;
        if (appId) {
            try {
                const data = await getCopilotAppContexts(appId);
                setAppContexts(data);
                return data;
            } catch (err) {
                /** */
            }
        }
    };

    const fetchModels = async () => {
        try {
            const response = await getAllDeployedModels({
                approval_status: 'approved',
                page: null,
                size: null,
                search: ''
            });
            const llmModels = [];
            const embeddingModels = [];
            const textToSpeechModels = [];
            response.data?.forEach((el) => {
                if (el.model_type === 'embedding') {
                    embeddingModels.push(el);
                } else if (el.model_type === 'llm' || el.model_type === 'text') {
                    llmModels.push(el);
                } else if (el.model_type === 'text-to-speech') {
                    textToSpeechModels.push(el);
                }
            });
            setLlmModels(llmModels);
            setEmbeddingModels(embeddingModels);
            setTextToSpeechModels(textToSpeechModels);
            return response.data;
        } catch (err) {
            /** */
        }
    };

    const fetchOrchestrators = async () => {
        try {
            const orchestrators = await getCopilotOrchestrators();
            setOrchestrators(orchestrators);
        } catch (err) {
            //** */
        }
    };

    useEffect(() => {
        if (location?.state?.models) {
            setLlmModels(location?.state?.models?.llmModels);
            setEmbeddingModels(location?.state?.models?.embeddingModels);
            return;
        }
        fetchModels();
    }, []);

    useEffect(() => {
        if (location?.state?.appDatasources) {
            setAppDatasources(location?.state?.appDatasources);
            return;
        }
        fetchDataSources();
    }, []);

    useState(() => {
        fetchAppContexts();
    }, []);

    useEffect(() => {
        if (location?.state?.orchestrators) {
            setOrchestrators(location?.state?.orchestrators);
            return;
        }
        fetchOrchestrators();
    }, []);

    useEffect(() => {
        if (copilotAppId) {
            (async function () {
                try {
                    if (location?.state?.copilotAppData) {
                        setAppData({
                            ...location?.state?.copilotAppData
                        });
                        return;
                    }
                    setIsLoading(true);
                    const response_data = await getCopilotApplication(copilotAppId);
                    setAppData({
                        ...response_data
                    });
                } catch (e) {
                    /* empty */
                } finally {
                    setIsLoading(false);
                }
            })();
        }
    }, [copilotAppId]);

    const fetchCopilotToolRegistry = async () => {
        try {
            if (!registryList) {
                const registryList = await getCopilotToolRegistryList();
                setRegistryList(registryList);
                const _activeRegistryId = appData.is_test
                    ? registryList.find((el) => el.is_test)?.id || 1
                    : 1;
                setActiveRegistryId(_activeRegistryId);
            }
        } catch (e) {
            /* empty */
        }
    };

    useEffect(() => {
        (async function () {
            try {
                if (location?.state?.publishedTools) {
                    setPublishedTools(location?.state?.publishedTools);
                    return;
                }
                if (activeRegistryId) {
                    setIsLoadingPublishedTools(true);
                    if (!cachedPublishedTools?.[activeRegistryId]) {
                        const tools = await getPublishedTools(activeRegistryId);
                        cachedPublishedTools[activeRegistryId] = tools;
                        setPublishedTools(tools);
                    } else {
                        setPublishedTools(cachedPublishedTools[activeRegistryId]);
                    }
                }
            } catch (e) {
                /* empty */
            } finally {
                setIsLoadingPublishedTools(false);
            }
        })();
    }, [activeRegistryId]);

    useEffect(() => {
        if (industryData.length === 0) {
            getIndustries({});
        }
    }, []);

    const loadMappedTools = async () => {
        try {
            const appId = copilotAppId || appData.id;
            if (appId) {
                const sanitizedAppId = sanitizeHtml(appId);
                const tools = await fetchMappedTools(sanitizedAppId);
                setMappedTools(tools);
            }
        } catch (e) {
            /* empty */
        }
    };

    useEffect(() => {
        if (location?.state?.mappedTools) {
            setMappedTools(location?.state?.mappedTools);
            return;
        }
        loadMappedTools();
    }, []);

    useEffect(() => {
        if (location.pathname.includes('edit')) {
            setActiveStep(getCurrentStep);
        }
    }, [location.search]);

    useEffect(() => {
        updateStepper();
    }, [history, activeStep]);

    const updateStepper = () => {
        let updatedSteps = [...steps];
        updatedSteps = updatedSteps.map((val, i) => {
            if (i <= activeStep) return { ...val, value: 100 };
            else return { ...val, value: -1 };
        });
        setSteps(updatedSteps);
    };

    const handleActiveStepChange = (e) => {
        setActiveStep(e.target.value);
    };

    const handleAppDataChange = (data) => {
        setAppData({ ...data });
        if (copilotAppId) {
            setIsAppMetaDataChange(true);
        }
    };

    const changePath = (appId = appData?.id) => {
        const params = new URLSearchParams(location.search);
        params.set('step', activeStep + 2);
        const sanitizedAppId = sanitizeHtml(appId);
        const sanitizedParams = sanitizeHtml(params.toString());
        history.replace(`/platform-utils/copilot/edit/${sanitizedAppId}?${sanitizedParams}`);
    };

    const handleNext = async () => {
        switch (activeStep) {
            case 0:
                if (!appData.id) {
                    createCopilotApplication({
                        payload: appData,
                        callback: onResponseCreateCopilot
                    });
                } else {
                    changePath();
                }
                break;
            case 1:
                changePath();
                break;
            case 2:
                changePath();
                break;
            case 3:
                changePath();
                break;
            case 4:
                try {
                    if (!copilotAppId || (copilotAppId && isAppMetaDataChange)) {
                        await updateCopilotApplication(appData.id, {
                            ...appData,
                            id: undefined
                        });
                    }
                    if (newAvatar) {
                        await uploadCopilotAvatar(appData.id, newAvatar);
                    }
                    history.push('/platform-utils/copilot/preview/' + appData.id);
                } catch (err) {
                    /** */
                }
                break;
            default:
                null;
        }
    };

    const onResponseCreateCopilot = (response_data, response_status) => {
        setAppData({
            ...response_data
        });

        if (response_status === 200) {
            setSnackbar({
                open: true,
                message:
                    'Ask NucliOS Application has been created successfully. You can continue to configure the details now or update it later',
                severity: 'success',
                autoHideDuration: 5000
            });
            setTimeout(() => {
                history.replace(
                    `/platform-utils/copilot/edit/${response_data?.id}?step=${activeStep + 2}`,
                    {
                        orchestrators: orchestrators,
                        appDatasources: appDatasources,
                        publishedTools: publishedTools,
                        mappedTools: mappedTools,
                        copilotAppData: response_data,
                        models: {
                            llmModels: llmModels,
                            embeddingModels: embeddingModels
                        }
                    }
                );
            }, 3000);
        }
    };

    const handlePrev = () => {
        const params = new URLSearchParams(location.search);
        params.set('step', activeStep);
        history.replace(`/platform-utils/copilot/edit/${appData?.id}?${params.toString()}`);
    };

    const isNextDisabled = () => {
        let isDisabled = true;

        //TODO: Add check for other steps

        if (activeStep === 0) {
            isDisabled = !appData?.name;
        } else {
            isDisabled = false;
        }

        return isDisabled;
    };

    const handleAvatarChange = (file) => {
        setNewAvatar(file);
        if (!file) {
            setAppData({
                ...appData,
                config: {
                    ...appData.config,
                    avatar_url: null
                }
            });
        }
        if (copilotAppId) {
            setIsAppMetaDataChange(true);
        }
    };

    const handleSaveOrchestrator = async (data) => {
        const payload = {
            ...appData,
            ...data
        };
        try {
            const result = await updateCopilotApplication(appData.id, {
                ...payload,
                id: undefined
            });
            setAppData(result);
            setSnackbar({
                open: true,
                message: 'Orchestrator setting is saved successfully.',
                severity: 'success',
                autoHideDuration: 7000
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Failed to set orchestrator. Please try again.',
                severity: 'error',
                autoHideDuration: 7000
            });
            throw err;
        }
    };

    return (
        <CopilotToolConfiguratorContextProvider
            value={{
                activeRegistryId,
                setActiveRegistryId,
                registryList,
                fetchCopilotToolRegistry,
                isLoadingPublishedTools,
                publishedTools,
                handlePrev
            }}
        >
            {!showCopilotConfigurator && (
                <div className={classes.root}>
                    <div className={classes.overviewContainer}>
                        <div>
                            <Button
                                variant="text"
                                className={clsx(classes.backButton, configClasses.button)}
                                onClick={() => {
                                    history.push('/platform-utils/copilot');
                                }}
                            >
                                <ArrowBackIosIcon /> Go to Ask NucliOS Applications
                            </Button>
                            <div className={classes.overviewScreenInfo}>
                                <Typography
                                    variant="h2"
                                    className={clsx(
                                        configClasses.typography,
                                        classes.overviewScreenTitle
                                    )}
                                >
                                    It&apos;s Easy to Get Started on Ask NucliOS
                                </Typography>
                                <Button
                                    variant="contained"
                                    // className={clsx(configClasses.button, classes.startBtn)}
                                    className={clsx(classes.startBtn, configClasses.button)}
                                    onClick={() => setShowCopilotConfigurator(true)}
                                >
                                    Let&apos;s get started
                                </Button>
                            </div>
                        </div>
                        <div className={classes.stepsOverview}>
                            {steps.map((step, index) => (
                                <div className={classes.stepOverviewContainer} key={step?.title}>
                                    <Typography
                                        variant="h3"
                                        className={clsx(
                                            configClasses.typography,
                                            configClasses.fontOpacity80,
                                            classes.stepTitle
                                        )}
                                    >
                                        {index + 1}.
                                    </Typography>
                                    <div className={classes.stepOverviewInfo}>
                                        <Typography
                                            variant="h3"
                                            className={clsx(
                                                configClasses.typography,
                                                configClasses.fontOpacity80,
                                                classes.stepTitle
                                            )}
                                        >
                                            {step?.title}
                                        </Typography>
                                        <Typography
                                            variant="h4"
                                            className={clsx(
                                                configClasses.typography,
                                                configClasses.fontOpacity60,
                                                classes.stepDetails
                                            )}
                                        >
                                            {step?.description}
                                        </Typography>
                                    </div>
                                    <div
                                        className={classes.stepOverviewGradient}
                                        style={{ backgroundImage: `url(${step?.bgGradient})` }}
                                    >
                                        <img src={step?.logo} alt={step?.title} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {showCopilotConfigurator && (
                <div className={classes.root}>
                    <div className={clsx(classes.gridContainer)}>
                        <div className={classes.stepperInfo}>
                            <ConfirmPopup
                                onConfirm={() => {
                                    history.push('/platform-utils/copilot');
                                }}
                                subTitle="The unsaved changes (if any) will be lost. Are you sure to exit the page?"
                                classes={{
                                    dialogPaper: configClasses.confirmDialog
                                }}
                            >
                                {(triggerConfirm) => (
                                    <Button
                                        variant="text"
                                        className={clsx(classes.backButton, configClasses.button)}
                                        onClick={triggerConfirm}
                                    >
                                        <ArrowBackIosIcon /> Go to Ask NucliOS Applications
                                    </Button>
                                )}
                            </ConfirmPopup>
                            <div
                                className={classes.stepNumberContainer}
                                style={{ backgroundImage: `url(${steps[activeStep]?.bgGradient})` }}
                            >
                                <Typography
                                    variant="h2"
                                    className={clsx(
                                        configClasses.typography,
                                        classes.activeStepNumber
                                    )}
                                >
                                    {activeStep + 1}
                                </Typography>
                            </div>
                            <div className={classes.stepDetailContainer}>
                                <Typography variant="h2" className={clsx(configClasses.typography)}>
                                    {steps[activeStep]?.title || ''}
                                </Typography>
                                <Typography variant="h4" className={clsx(configClasses.typography)}>
                                    {steps[activeStep]?.description || ''}
                                </Typography>
                            </div>
                        </div>
                        <div className={clsx(classes.stepperInputSection)}>
                            <div className={classes.stepContent}>
                                {activeStep === 0 ? (
                                    <Fragment>
                                        {isLoading ? (
                                            <CodxCircularLoader center />
                                        ) : location.pathname.includes('create') ? (
                                            <CopilotBusinessInfo
                                                appData={appData}
                                                industryList={industryData}
                                                onChange={handleAppDataChange}
                                            />
                                        ) : appData?.id ? (
                                            <CopilotBusinessInfo
                                                appData={appData}
                                                industryList={industryData}
                                                onChange={handleAppDataChange}
                                            />
                                        ) : null}
                                    </Fragment>
                                ) : null}
                                {activeStep === 1 ? (
                                    <DataConfiguration
                                        copilotAppId={appData.id}
                                        appDatasources={appDatasources}
                                        fetchDataSources={fetchDataSources}
                                    />
                                ) : null}
                                {activeStep === 2 ? (
                                    <OnboardContext
                                        copilotAppId={appData.id}
                                        appContexts={appContexts}
                                        fetchAppContexts={fetchAppContexts}
                                    />
                                ) : null}
                                {activeStep === 3 ? (
                                    <Fragment>
                                        {isLoading ? (
                                            <CodxCircularLoader center />
                                        ) : appData?.id ? (
                                            <ToolCofigurator
                                                appData={appData}
                                                loadMappedTools={loadMappedTools}
                                                mappedTools={mappedTools}
                                                appDatasources={appDatasources}
                                                llmModels={llmModels}
                                                embeddingModels={embeddingModels}
                                                orchestrators={orchestrators}
                                                onSaveOrchestrator={handleSaveOrchestrator}
                                                fetchDataSources={fetchDataSources}
                                            />
                                        ) : null}
                                    </Fragment>
                                ) : null}
                                {activeStep === 4 ? (
                                    <CreateAssistant
                                        appData={appData}
                                        onChange={handleAppDataChange}
                                        llmModels={llmModels}
                                        textToSpeechModels={textToSpeechModels}
                                        onAvatarChange={handleAvatarChange}
                                    />
                                ) : null}
                            </div>
                        </div>
                        <div className={classes.stepperSection}>
                            <Stepper
                                activeStep={activeStep}
                                onChange={handleActiveStepChange}
                                className={classes.stepper}
                            >
                                {steps.map((item) => (
                                    <Step key={item.label} className={classes.step}>
                                        <StepLabel
                                            StepIconComponent={LinearProgress}
                                            StepIconProps={{
                                                value: item.value,
                                                variant: 'determinate',
                                                className: classes.stepperProgressBar
                                            }}
                                            className={clsx(
                                                classes.stepperLabel,
                                                configClasses.fontStyle4
                                            )}
                                        >
                                            {item.title}
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </div>
                        <div className={classes.actionBarRoot}>
                            <div className={classes.actionBar}>
                                <div style={{ flex: 1 }}></div>
                                {activeStep !== 0 ? (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={handlePrev}
                                        disabled={activeStep === 0}
                                        className={configClasses.button}
                                    >
                                        <ArrowBackIosIcon /> Back
                                    </Button>
                                ) : null}
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={handleNext}
                                    disabled={isNextDisabled()}
                                    className={configClasses.button}
                                >
                                    {activeStep === 4 ? 'Finish' : 'Next'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <CustomSnackbar
                key="copilot-create"
                open={snackbar.open}
                message={snackbar.message}
                autoHideDuration={snackbar.autoHideDuration}
                onClose={() => {
                    setSnackbar({ open: false });
                }}
                severity={snackbar.severity}
            />
        </CopilotToolConfiguratorContextProvider>
    );
}

const mapStateToProps = (state) => {
    return {
        industryData: state.industryData.list
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getIndustries: (payload) => dispatch(getIndustries(payload))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateCopilotApplication));
