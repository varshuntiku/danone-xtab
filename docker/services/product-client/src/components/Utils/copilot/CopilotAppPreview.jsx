import {
    Button,
    // Chip,
    Divider,
    Switch,
    Tooltip,
    Typography,
    alpha,
    makeStyles,
    withStyles
} from '@material-ui/core';
import CodxCircularLoader from 'components/CodxCircularLoader';
import React, { useEffect, useState, useContext, useRef, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { fetchMappedTools } from 'services/copilot';
import {
    getCopilotApplication,
    updateCopilotApplication
} from 'services/copilotServices/copilot_app';
import { getCopilotAppDatasources } from 'services/copilotServices/copilot_datasource';
import { getListItemIcon, getDatasourceLabel } from './util';
import { grey } from '@material-ui/core/colors';
// import { deployApplication } from '../../../services/copilot';
import CustomSnackbar from '../../CustomSnackbar';
import copilotConfiguratorStyle from './styles/copilotConfiguratorStyle';
import clsx from 'clsx';
import { AuthContext } from 'auth/AuthContext';
import EmptyStateConfigurator from './EmptyStateConfigurator';

import { ReactComponent as MinervaAvatarIcon } from 'assets/img/MinervaAvatarIcon.svg';
import { CustomThemeContext } from 'themes/customThemeContext';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import darkBackground from 'assets/img/minerva-dark-bg.png';
import backImg from 'assets/img/Nuclios_Background.svg';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { getContextDetails } from 'services/copilotServices/copilot_context';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { ReactComponent as DataMetaDataIcon } from 'assets/img/data-metadata-icon.svg';
import { ReactComponent as MetricsKPIIcon } from 'assets/img/metrics-kpi-icon.svg';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        height: `calc(100vh - ${theme.layoutSpacing(120)})`, //calc(100vh - 10rem)
        // height: `calc(100vh - ${theme.layoutSpacing(85)})`,
        background: theme.palette.primary.dark,
        overflow: 'hidden',
        padding: theme.layoutSpacing(0, 20.74)
        // margin: theme.layoutSpacing(2, 16, 56)
    },
    header: {
        display: 'flex',
        justifyContent: 'center',
        padding: theme.layoutSpacing(16.6, 8.3),
        position: 'relative',
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`
    },
    headerAction: {
        position: 'absolute',
        right: '0',
        display: 'flex',
        gap: theme.layoutSpacing(10.37),
        top: '50%',
        transform: 'translateY(-50%)'
    },
    content: {
        display: 'flex',
        gap: theme.layoutSpacing(51.84)
    },
    title1: {
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(24),
        fontWeight: 500,
        color: theme.palette.text.revamp,
        lineHeight: theme.layoutSpacing(32)
    },
    desc: {
        fontSize: theme.layoutSpacing(16),
        fontWeight: 400,
        lineHeight: theme.layoutSpacing(24),
        letterSpacing: theme.layoutSpacing(1),
        color: theme.palette.text.revamp
    },
    copilotPreview: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: theme.layoutSpacing(51.84),
        paddingLeft: theme.layoutSpacing(31.104),
        gap: theme.layoutSpacing(20),

        '& > .MuiTypography-h3': {
            paddingTop: theme.layoutSpacing(24)
        }
    },
    metadata: {
        flex: 1,
        paddingRight: theme.layoutSpacing(103.7),

        '& > .MuiTypography-h3': {
            paddingTop: theme.layoutSpacing(30)
        }
    },
    chatWrapper: {
        boxShadow: `0 0px 2px 1px ${alpha(theme.palette.icons.nofile, 0.2)}`,
        borderRadius: theme.layoutSpacing(8.3),
        overflow: 'hidden',
        flex: 1,
        fontSize: theme.layoutSpacing(16),
        display: 'flex',
        flexDirection: 'column',
        // padding: theme.layoutSpacing(10.37),
        '& minerva-wc': {
            fontSize: theme.layoutSpacing(16)
        },
        '& .MinervaFont-2': {
            fontFamily: 'Graphik Compact'
        },
        '& .MinervaWC .MinervaFullScreen': {
            background: 'transparent'
        },
        '& .MinervaWC .MinervaFullScreen-header': {
            display: 'none'
        },
        '& .MinervaWC .MinervaFullScreen-sideworkspace-triggers': {
            display: 'none !important'
        },
        '& .MinervaWC .MinervaFullScreen-conversation-section': {
            display: 'none'
        },
        // '& .MinervaWC .MinervaQueryOutput-emptystate': {
        //     visibility: 'hidden'
        // },
        '& .MinervaWC .MinervaFullScreen-header-action-left': {
            display: 'none !important'
        },
        '& .MinervaWC .MinervaFullScreen-mini .MinervaFullScreen-header': {
            padding: theme.layoutSpacing(10.37)
        },
        '& .MinervaWC .MinervaFullScreen-header h3': {
            fontWeight: '500',
            color: theme.palette.text.contrastText
        },
        '& .MinervaWC .MinervaQueryInput form': {
            border: 0,
            boxShadow: '0 0px 4px 2px rgba(0,0,0,0.2)'
        },
        '& .MinervaWC .MinervaQueryOutputItem': {
            '& .MinervaQueryOutputItem-action-panel': {
                display: 'none'
            },

            '& .MinervaQueryOutputItem-query-container div.MinervaPinButton': {
                display: 'none'
            }
        },
        '& .MinervaWC .MinervaQueryInput .MinervaQueryInput-shortcuts': {
            display: 'none'
        },
        '& .MinervaWC .MinervaSuggestedQuery .MinervaSuggestedQuery-list': {
            gridTemplateColumns: '1fr 1fr 1fr'
        },
        '& .MinervaWC .MinervaFullScreen-chat-section': {
            backgroundImage: `url(${
                theme.props.mode === 'light' ? backImg : darkBackground
            }) !important`,
            backgroundSize: 'cover !important',
            backgroundPosition: 'center !important',
            backgroundRepeat: 'no-repeat !important'
        },
        '& .MinervaWC .MinervaQueryOutput .MinervaQueryOutput-emptystate p': {
            fontSize: theme.layoutSpacing(20)
        },
        '& .MinervaWC .MinervaQueryOutput .MinervaQueryOutput-emptystate .MinervaQueryOutput-emptystate-avatar':
            {
                width: theme.layoutSpacing(60),
                height: theme.layoutSpacing(60)
            },
        '& .MinervaWC .MinervaQueryOutput .MinervaQueryOutput-emptystate .MinervaQueryOutput-emptystate-avatar .MinervaSkeleton':
            {
                width: theme.layoutSpacing(60),
                height: theme.layoutSpacing(60)
            },
        '& .MinervaWC .MinervaQueryOutput .MinervaQueryOutput-emptystate .MinervaQueryOutput-emptystate-greet span':
            {
                fontSize: theme.layoutSpacing(40)
            },
        '& .MinervaWC .MinervaQueryOutput .MinervaQueryOutput-emptystate': {
            maxWidth: theme.layoutSpacing(700)
        }
    },
    metadataContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(41.5),
        paddingTop: theme.layoutSpacing(60)
    },
    row1: {
        display: 'flex',
        gap: theme.layoutSpacing(32),
        alignItems: 'flex-start'
    },
    iconContainer: {
        background: '#cdddf3',
        // padding: theme.layoutSpacing(36.3),
        width: theme.layoutSpacing(64),
        height: theme.layoutSpacing(64),
        borderRadius: theme.layoutSpacing(8.3),
        marginTop: theme.layoutSpacing(4.15),
        // padding: theme.layoutSpacing(4),
        '& img, svg': {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            fill: theme.palette.primary.contrastText
        }
    },
    personaContainer: {
        display: 'flex',
        gap: theme.layoutSpacing(20.74),
        flexWrap: 'wrap',
        marginTop: theme.layoutSpacing(12)
    },

    toolsContainer: {
        // display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridAutoRows: 'max-content',
        // gap: theme.layoutSpacing(20.74),
        flexWrap: 'wrap',
        marginTop: theme.layoutSpacing(12),
        height: `calc(100vh - ${theme.layoutSpacing(530)})`,
        overflowY: 'scroll',
        display: 'flex',
        alignItems: 'flex-start'
    },
    toolsContainerColumn: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.layoutSpacing(8),
        maxWidth: '33%',
        padding: '0 1rem'
    },
    toolItem: {
        border: '1px solid',
        borderColor: alpha(theme.palette.text.default, 0.1),
        borderRadius: theme.layoutSpacing(8.3),
        padding: theme.layoutSpacing(10.37),
        paddingBottom: 0,
        width: theme.layoutSpacing(285),
        minHeight: theme.layoutSpacing(124.42),
        overflow: 'hidden',
        '& hr': {
            margin: theme.layoutSpacing(16.6, 0),
            backgroundColor: alpha(theme.palette.icons.nofile, 0.1)
        },
        display: 'flex',
        flexDirection: 'column',
        // height: '100%',
        height: 'fit-content'
    },
    toolName: {},
    datasource: {
        display: 'flex',
        gap: theme.layoutSpacing(10.37),
        alignItems: 'flex-start',
        flex: '1'
    },
    emptydatsource: {
        minHeight: theme.layoutSpacing(17)
    },
    datasourceIcon: {
        // marginTop: theme.layoutSpacing(8.3)
        '& svg': {
            width: theme.layoutSpacing(33),
            height: theme.layoutSpacing(33.85)
        }
    },
    datasourceIconPlaceholder: {
        backgroundColor: grey[500],
        padding: theme.layoutSpacing(20.74),
        width: theme.layoutSpacing(33),
        height: theme.layoutSpacing(33.85)
    },
    chatHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.layoutSpacing(16, 30),
        '& .MuiTypography-root': {
            fontWeight: 500,
            fontFamily: theme.title.h1.fontFamily,
            fontSize: theme.layoutSpacing(20)
        }
    },
    switchBtn: {},
    appDetailSection: {
        maxWidth: theme.layoutSpacing(640),
        gap: theme.layoutSpacing(10),
        display: 'flex',
        flexDirection: 'column'
    },
    appTitle: {
        fontFamily: 'Graphik Compact',
        fontSize: theme.layoutSpacing(28),
        fontWeight: 400,
        lineHeight: theme.layoutSpacing(32),
        letterSpacing: theme.layoutSpacing(0),
        color: theme.palette.text.revamp
    },
    personaSection: {
        marginTop: theme.layoutSpacing(-25.5)
    },
    toolStatusSection: {
        display: 'flex',
        height: theme.layoutSpacing(28),
        margin: theme.layoutSpacing(0, -10.37, 0, -10.37),
        padding: theme.layoutSpacing(8, 12),
        alignItems: 'center',

        '& > .MuiTypography-subtitle1': {
            fontSize: theme.layoutSpacing(14),
            fontWeight: 400,
            lineHeight: theme.layoutSpacing(14),
            letterSpacing: theme.layoutSpacing(0),
            color: theme.palette.text.revamp
        },

        '& svg': {
            marginRight: theme.layoutSpacing(4),
            width: theme.layoutSpacing(16),
            height: theme.layoutSpacing(16)
        }
    },
    datasourceDetail: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(3),
        maxWidth: '80%'
    },
    datasourceLabel: {
        fontSize: theme.layoutSpacing(12),
        fontWeight: 300,
        lineHeight: theme.layoutSpacing(16),
        letterSpacing: theme.layoutSpacing(0),
        color: theme.palette.text.revamp
    },
    toolItemInfoSection: {
        minHeight: theme.layoutSpacing(53.03)
    },
    backButton: {
        position: 'absolute',
        left: theme.layoutSpacing(10.368),
        '& .MuiButton-label': {
            fontSize: theme.layoutSpacing(18),
            letterSpacing: theme.layoutSpacing(0.5),
            lineHeight: theme.layoutSpacing(21.6)
        }
    },

    successStatus: {
        backgroundColor: alpha(
            theme.palette.background.infoSuccess,
            theme.props.mode === 'light' ? 0.3 : 1
        ),

        '& svg': {
            fill: theme.palette.icons.successIconFill
        }
    },
    failedStatus: {
        backgroundColor: alpha(theme.palette.background.infoError, 0.3),

        '& svg': {
            fill: theme.palette.icons.errorIconFill
        }
    },
    inprogressStatus: {
        backgroundColor: alpha(theme.palette.text.connHighlight, 0.3),

        '& svg': {
            fill: theme.palette.text.connHighlight
        }
    },
    datasourceListItemIcon: {
        '& svg': {
            '& path': {
                fill: theme.palette.text.contrastText
            }
        }
    },
    chatWrapperActionSection: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.layoutSpacing(16)
    },
    previewButton: {
        padding: theme.layoutSpacing(0, 0, 0, 16),
        borderLeft: '1px solid',
        borderLeftColor: alpha(theme.palette.border.loginGrid, 0.4),
        borderRadius: 0,

        '& .MuiButton-label': {
            fontFamily: theme.title.h1.fontFamily,
            fontSize: theme.layoutSpacing(20),
            fontWeight: 500,
            lineHeight: theme.layoutSpacing(24),
            letterSpacing: theme.layoutSpacing(1)
        },

        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    notAvailableContextSection: {
        display: 'flex',
        height: theme.layoutSpacing(38),
        margin: theme.layoutSpacing(0, -10.37, 0, -10.37),
        padding: theme.layoutSpacing(8, 12),
        alignItems: 'center',
        background: alpha(theme.palette.background.chipRevampBg, 0.4)
    },
    contextLabel: {
        fontWeight: 400,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(15),
        color: theme.palette.text.default,
        padding: theme.layoutSpacing(4),
        letterSpacing: '1px',
        textDecoration: 'underline'
    },
    notAvailableContextLabel: {
        color: alpha(theme.palette.text.revamp, 0.5),
        textDecoration: 'none'
    },
    contextSection: {
        display: 'flex',
        margin: theme.layoutSpacing(0, -10.37, 0, -10.37),
        padding: theme.layoutSpacing(8, 12),
        alignItems: 'center',
        background: theme.palette.background.chipRevampBg,
        cursor: 'pointer',
        flexDirection: 'column',
        gap: theme.layoutSpacing(8)
    },
    contextLabelWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    expandIcon: {
        fontSize: theme.layoutSpacing(24)
    },
    contextWrapper: {
        display: 'flex',
        gap: theme.layoutSpacing(12),
        width: '100%'
    },
    contextIcon: {
        '& svg': {
            width: theme.layoutSpacing(15),
            height: theme.layoutSpacing(14.3),
            '& path': {
                stroke: theme.palette.text.contrastText
            },
            '& path:nth-of-type(6)': {
                fill: theme.palette.primary.main
            }
        }
    },
    contextDetail: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: theme.palette.text.default
    }
}));

const AntSwitch = withStyles((theme) => ({
    root: {
        width: theme.layoutSpacing(50),
        height: theme.layoutSpacing(24),
        padding: 0,
        display: 'flex'
    },
    switchBase: {
        padding: theme.layoutSpacing(2),
        top: theme.layoutSpacing(0.5),
        color: theme.palette.grey[500],
        backgroundColor: 'transparent',
        '&$checked': {
            transform: `translateX(${theme.layoutSpacing(26)})`,
            color: theme.palette.common.white,
            '& + $track': {
                opacity: 1,
                backgroundColor: theme.palette.primary.main,
                borderColor: theme.palette.primary.main
            }
        }
    },
    thumb: {
        width: theme.layoutSpacing(18),
        height: theme.layoutSpacing(18),
        boxShadow: 'none'
    },
    track: {
        border: `1px solid ${theme.palette.grey[500]}`,
        borderRadius: theme.layoutSpacing(16),
        opacity: 1,
        backgroundColor: theme.palette.common.white
    },
    checked: {}
}))(Switch);

const contextTypeIcons = {
    data_metadata: <DataMetaDataIcon />,
    metrics_kpi: <MetricsKPIIcon />
};

function CopilotAppPreview({ match, history }) {
    const classes = useStyles();
    const configClasses = copilotConfiguratorStyle();

    const [appData, setAppData] = useState();
    const [loading, setLoading] = useState(true);
    const { getToken } = useContext(AuthContext);
    const copilotAppId = match.params.copilot_app_id;
    const [mappedTools, setMappedTools] = useState([]);
    const [appDatasources, setAppDatasources] = useState([]);
    const [appContextDatasources, setAppContextDatasources] = useState([]);
    // const [deployInProgress, setDeployInProgress] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });
    const minervaRef = useRef();
    const [previewSwitch, setPreviewSwitch] = useState(false);
    const userName = sessionStorage.getItem('user_name');
    const greet_message = `Hey ${userName}`;
    const { theme, plotTheme } = useContext(CustomThemeContext);
    const theme_values = JSON.stringify({
        bgMain: theme.palette.primary.dark,
        bgSecondaryBlue: theme.palette.background.menuItemFocus,
        bgSecondaryLightBlue: theme.palette.background.navLinkBackground,
        borderBlue: theme.palette.border.inputOnFoucs,
        textColor: theme.palette.text.default,
        contrastColor: theme.palette.primary?.contrastText,
        fontFamily: theme.typography?.fontFamily,
        chartColors: plotTheme?.chartDefaultColors?.['range-10'],
        mode: theme.props?.mode
    });
    const [pendingApiCount, setPendingApiCount] = useState(0);
    const [expandedContext, setExpandedContext] = useState('');

    useEffect(() => {
        const isApiCallPending = pendingApiCount > 0;
        setLoading(isApiCallPending);
    }, [pendingApiCount]);

    const auth_token_getter = async () => {
        let token = localStorage.getItem('local.access.token.key');
        if (token) {
            return token;
        } else {
            return await getToken();
        }
    };

    const setMinervaRef = (ref) => {
        if (ref && minervaRef.current !== ref) {
            minervaRef.current = ref;
            minervaRef.current.auth_token_getter = auth_token_getter;
        }
    };

    const fetchDataSources = async () => {
        if (copilotAppId) {
            try {
                setPendingApiCount(pendingApiCount + 1);
                const data = await getCopilotAppDatasources(copilotAppId);
                setAppDatasources(data);
                return data;
            } catch (err) {
                /** */
            } finally {
                setPendingApiCount(pendingApiCount - 1);
            }
        }
    };

    const fetchContextDatasources = async () => {
        if (copilotAppId) {
            try {
                setPendingApiCount(pendingApiCount + 1);
                const data = await getContextDetails({ copilotAppId });
                setAppContextDatasources(data);
            } catch (err) {
                //
            } finally {
                setPendingApiCount(pendingApiCount - 1);
            }
        }
    };

    useEffect(() => {
        fetchDataSources();
        fetchContextDatasources();
    }, []);

    useEffect(() => {
        if (copilotAppId) {
            (async function () {
                try {
                    setPendingApiCount(pendingApiCount + 1);
                    const response_data = await getCopilotApplication(copilotAppId);
                    setAppData({
                        ...response_data
                    });
                } catch (e) {
                    /* empty */
                } finally {
                    setPendingApiCount(pendingApiCount - 1);
                }
            })();
        }
    }, [copilotAppId]);

    useEffect(() => {
        loadMappedTools();
    }, []);

    const loadMappedTools = async () => {
        try {
            setPendingApiCount(pendingApiCount + 1);
            const tools = await fetchMappedTools(copilotAppId);
            setMappedTools(tools);
        } catch (e) {
            /* empty */
        } finally {
            setPendingApiCount(pendingApiCount - 1);
        }
    };

    const onModify = () => {
        history.push(`/platform-utils/copilot/edit/${copilotAppId}?step=1`);
    };

    const getDatasourceView = (id) => {
        const datasource = appDatasources.find((el2) => el2.id == id);
        if (!datasource) {
            return null;
        }
        return (
            <div className={classes.datasource}>
                <div
                    className={clsx(
                        classes.datasourceIcon,
                        datasource.type === 'upload' ? classes.datasourceListItemIcon : ''
                    )}
                >
                    {datasource.type == 'sql' ||
                    datasource.type === 'upload' ||
                    datasource.type === 'file_storage' ||
                    datasource.type === 'csv' ||
                    datasource.type === 'storyboard_slidemaster' ? (
                        getListItemIcon(datasource)
                    ) : (
                        <div className={classes.datasourceIconPlaceholder}></div>
                    )}
                </div>
                <div className={classes.datasourceDetail}>
                    <Typography
                        variant="subtitle1"
                        className={configClasses.typography}
                        title={datasource.name}
                    >
                        {datasource.name}
                    </Typography>
                    <Typography variant="subtitle2" className={classes.datasourceLabel}>
                        {getDatasourceLabel(datasource)}
                    </Typography>
                </div>
            </div>
        );
    };

    const getContextDatasourceView = (id) => {
        const contextDatasource = appContextDatasources.find((el) => el.id == id);
        if (!contextDatasource) {
            return null;
        }
        return (
            <Fragment>
                {expandedContext ? (
                    <div
                        className={classes.contextWrapper}
                        title={`${contextDatasource?.context_name}-${contextDatasource?.name}`}
                    >
                        <div className={classes.contextIcon}>
                            {contextTypeIcons[contextDatasource?.context_type]}
                        </div>
                        <Typography variant="h4" className={classes.contextDetail}>
                            {contextDatasource?.context_name} - {contextDatasource?.name}
                        </Typography>
                    </div>
                ) : null}
            </Fragment>
        );
    };

    // const handleDeploy = async () => {
    //     try {
    //         setDeployInProgress(true);
    //         await deployApplication(appData.id);
    //         setSnackbar({
    //             open: true,
    //             message: 'Copilot app deployed successfully!',
    //             severity: 'info'
    //         });
    //     } catch {
    //         setSnackbar({
    //             open: true,
    //             message: 'Failed to deploy Copilot app!',
    //             severity: 'error'
    //         });
    //     } finally {
    //         setDeployInProgress(false);
    //     }
    // };

    const handleChangeSampleQuestions = async (d) => {
        appData.config.suggested_queries = d;
        setAppData({ ...appData });
        try {
            await updateCopilotApplication(appData.id, {
                ...appData,
                id: undefined
            });
        } catch (err) {
            /** */
        }
    };

    const handleChangeGreetMsg = async (d) => {
        if (appData?.config.empty_state_message_desc !== d) {
            appData.config.empty_state_message_desc = d;
            setAppData({ ...appData });
            try {
                await updateCopilotApplication(appData.id, {
                    ...appData,
                    id: undefined
                });
            } catch (err) {
                /** */
            }
        }
    };

    if (loading) {
        return <CodxCircularLoader center />;
    }

    const getStatusBgColor = (status) => {
        switch (status) {
            case 'completed':
                return classes.successStatus;
            case 'failed':
            case 'error':
                return classes.failedStatus;
            case 'started':
            case 'inprogress':
            case 'triggered':
                return classes.inprogressStatus;
            default:
                return '';
        }
    };

    const handleExpandViewContext = (value) => {
        setExpandedContext(expandedContext === value ? '' : value);
    };

    return (
        <div className={clsx(classes.root)}>
            <div className={classes.header}>
                <Button
                    variant="text"
                    className={clsx(classes.backButton, configClasses.button)}
                    onClick={() => {
                        history.push('/platform-utils/copilot');
                    }}
                >
                    <ArrowBackIosIcon /> Go to Ask NucliOS Applications
                </Button>

                <Typography variant="h3" className={classes.title1}>
                    Preview
                </Typography>
                <div className={classes.headerAction}>
                    <Button
                        variant="outlined"
                        size="small"
                        className={configClasses.button}
                        onClick={onModify}
                    >
                        Modify
                    </Button>
                    {/* <Button
                        variant="contained"
                        size="small"
                        disabled={deployInProgress}
                        // className={classes.button}
                        onClick={handleDeploy}
                    >
                        Deploy
                    </Button> */}
                </div>
            </div>
            <div className={classes.content}>
                <div className={classes.copilotPreview}>
                    <Typography variant="h3" className={classes.title1}>
                        Ask NucliOS Preview
                    </Typography>
                    <div className={classes.chatWrapper}>
                        <div className={classes.chatHeader}>
                            <Typography variant="h3" className={configClasses.label2}>
                                {previewSwitch
                                    ? appData?.config.identity || 'Ask NucliOS'
                                    : 'Customize your Homepage'}
                            </Typography>
                            <div style={{ flex: 1 }} />
                            <div className={classes.chatWrapperActionSection}>
                                <Tooltip
                                    classes={{ tooltip: configClasses.tooltip }}
                                    arrow
                                    title={
                                        previewSwitch
                                            ? 'Customize your Homepage'
                                            : 'Switch to Preview Mode'
                                    }
                                >
                                    <AntSwitch
                                        onChange={(e) => setPreviewSwitch(e.target.checked)}
                                        checked={previewSwitch}
                                        params={{
                                            value: previewSwitch,
                                            customSelector: classes.switchBtn
                                        }}
                                    />
                                </Tooltip>
                                <Button
                                    variant="text"
                                    className={classes.previewButton}
                                    size="large"
                                    startIcon={<OpenInNewIcon fontSize="large" />}
                                    onClick={() =>
                                        history.push(`/platform-utils/copilot/${copilotAppId}`)
                                    }
                                >
                                    Preview
                                </Button>
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            {previewSwitch ? (
                                <minerva-wc
                                    variant="fullscreen"
                                    minerva_alias="Chat"
                                    copilot_app_id={copilotAppId}
                                    server_url={import.meta.env['REACT_APP_MINERVA_BACKEND_URL']}
                                    ref={setMinervaRef}
                                    empty_state_message_greet={greet_message}
                                    init_with_new_window={true}
                                    theme_values={theme_values}
                                    skip_conversation_window={true}
                                    hide_sideworkspace={true}
                                ></minerva-wc>
                            ) : (
                                <EmptyStateConfigurator
                                    appData={appData}
                                    onChangeSampleQuestions={handleChangeSampleQuestions}
                                    onChangeGreetMsg={handleChangeGreetMsg}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className={classes.metadata}>
                    <Typography variant="h3" className={classes.title1}>
                        Ask NucliOS configuration
                    </Typography>
                    <div className={classes.metadataContent}>
                        <div className={classes.row1}>
                            <div className={classes.iconContainer}>
                                {appData?.config.avatar_url ? (
                                    <img src={appData.config.avatar_url} alt="avatar url" />
                                ) : (
                                    <MinervaAvatarIcon alt="Nuclios-logo" />
                                )}
                            </div>
                            <div className={classes.appDetailSection}>
                                <Typography variant="subtitle1" className={classes.appTitle}>
                                    {appData?.name}
                                </Typography>
                                <Typography variant="body" className={classes.desc}>
                                    {appData?.desc}
                                </Typography>
                            </div>
                        </div>
                        {/* {appData?.config?.persona ? (
                            <div className={classes.personaSection}>
                                <Typography variant="subtitle1" className={configClasses.label2}>
                                    Persona:
                                </Typography>

                                <div className={clsx(classes.personaContainer, configClasses.chips)}>

                                    <Chip
                                        className={clsx(classes.chip, configClasses.chips)}
                                        label={appData?.config?.persona}
                                    />
                                </div>
                            </div>
                        ) : null} */}
                        <div className={classes.row}>
                            <Typography variant="subtitle1" className={configClasses.label2}>
                                Skill Set Enabled:
                            </Typography>

                            <div className={classes.toolsContainer}>
                                {mappedTools
                                    ?.reduce((columns, item, i) => {
                                        const columnIndex = i % 3;
                                        const column = columns[columnIndex] || [];
                                        column.push(item);
                                        columns[columnIndex] = column;
                                        return columns;
                                    }, [])
                                    ?.map((column, i) => (
                                        <div key={i} className={classes.toolsContainerColumn}>
                                            {column.map((tool) => (
                                                <div key={tool.id} className={classes.toolItem}>
                                                    <div className={classes.toolItemInfoSection}>
                                                        <Typography
                                                            variant="subtitle1"
                                                            className={configClasses.label2}
                                                        >
                                                            {tool.name}
                                                        </Typography>
                                                        <div
                                                            className={
                                                                configClasses.toolTagsContainer
                                                            }
                                                        >
                                                            {tool?.tool_version_config?.tags?.map(
                                                                (item) => (
                                                                    <Typography
                                                                        key={item}
                                                                        variant="subtitle2"
                                                                        className={clsx(
                                                                            configClasses.typography,
                                                                            configClasses.toolTag
                                                                        )}
                                                                    >
                                                                        {item}
                                                                    </Typography>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Divider />
                                                    {tool.selected_datasources.length > 0 ? (
                                                        tool.selected_datasources?.map((item) => {
                                                            return getDatasourceView(
                                                                item.datasource_id
                                                            );
                                                        })
                                                    ) : (
                                                        <div className={classes.emptydatsource} />
                                                    )}
                                                    <Divider
                                                        style={{
                                                            marginBottom: 0,
                                                            backgroundColor: 'transparent'
                                                        }}
                                                    />
                                                    <div
                                                        className={`${
                                                            tool.selected_context_datasources
                                                                .length > 0
                                                                ? classes.contextSection
                                                                : classes.notAvailableContextSection
                                                        } `}
                                                    >
                                                        {tool?.selected_context_datasources
                                                            ?.length > 0 ? (
                                                            <Fragment>
                                                                <div
                                                                    className={
                                                                        classes.contextLabelWrapper
                                                                    }
                                                                    onClick={() =>
                                                                        handleExpandViewContext(
                                                                            tool?.id
                                                                        )
                                                                    }
                                                                >
                                                                    <Typography
                                                                        variant="h3"
                                                                        className={
                                                                            classes.contextLabel
                                                                        }
                                                                    >
                                                                        View Context{' '}
                                                                        {tool
                                                                            ?.selected_context_datasources
                                                                            ?.length > 0
                                                                            ? `(${tool?.selected_context_datasources?.length})`
                                                                            : ''}
                                                                    </Typography>
                                                                    {expandedContext ===
                                                                    tool?.id ? (
                                                                        <ExpandLessIcon
                                                                            className={
                                                                                classes.expandIcon
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <ExpandMoreIcon
                                                                            className={
                                                                                classes.expandIcon
                                                                            }
                                                                        />
                                                                    )}
                                                                </div>
                                                                {expandedContext === tool?.id &&
                                                                    tool?.selected_context_datasources?.map(
                                                                        (item) =>
                                                                            getContextDatasourceView(
                                                                                item?.context_datasource_id
                                                                            )
                                                                    )}
                                                            </Fragment>
                                                        ) : (
                                                            <Typography
                                                                variant="h4"
                                                                className={clsx(
                                                                    classes.contextLabel,
                                                                    classes.notAvailableContextLabel
                                                                )}
                                                            >
                                                                Context not Available
                                                            </Typography>
                                                        )}
                                                    </div>

                                                    {tool.status ? (
                                                        <Fragment>
                                                            <div
                                                                className={clsx(
                                                                    classes.toolStatusSection,
                                                                    getStatusBgColor(
                                                                        tool.status.toLowerCase()
                                                                    )
                                                                )}
                                                            >
                                                                {
                                                                    ToolDeploymentStatus[
                                                                        tool.status.toLowerCase()
                                                                    ]?.icon
                                                                }
                                                                <Typography variant="subtitle1">
                                                                    {
                                                                        ToolDeploymentStatus[
                                                                            tool.status.toLowerCase()
                                                                        ]?.message
                                                                    }
                                                                </Typography>
                                                            </div>
                                                        </Fragment>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CustomSnackbar
                key="app-preview-snackbar"
                open={snackbar?.open}
                message={snackbar?.message}
                autoHideDuration={2000}
                onClose={() => {
                    setSnackbar({ open: false, message: '' });
                }}
                severity={snackbar?.severity}
            />
        </div>
    );
}

export default withRouter(CopilotAppPreview);

const ToolDeploymentStatus = {
    failed: {
        icon: <ErrorIcon />,
        message: 'Deployment Error Found'
    },
    error: {
        icon: <ErrorIcon />,
        message: 'Deployment Error Found'
    },
    started: {
        icon: <InfoOutlinedIcon />,
        message: 'Deployment Started'
    },
    completed: {
        icon: <CheckCircleOutlineIcon />,
        message: 'Deployed Successfully'
    },
    triggered: {
        icon: <InfoOutlinedIcon />,
        message: 'Deployment Triggered'
    },
    inprogress: {
        icon: <InfoOutlinedIcon />,
        message: 'Deployment In Progress'
    }
};
