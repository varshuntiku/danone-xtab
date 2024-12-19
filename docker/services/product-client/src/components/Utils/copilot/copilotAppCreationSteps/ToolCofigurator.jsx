import {
    Button,
    Chip,
    IconButton,
    List,
    ListItem,
    Tab,
    Typography,
    alpha,
    makeStyles
} from '@material-ui/core';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import TextToSQLToolConfig from './toolConfigs/TextToSQLToolConfig';
import DocumentQueryToolConfig from './toolConfigs/DocumentQueryToolConfig';
import CustomQueryToolConfig from './toolConfigs/CustomQueryToolConfig';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import {
    getCopilotAppTool,
    removeCopilotAppTool,
    saveCopilotAppTool,
    updateCopilotAppTool
} from '../../../../services/copilot';
import {
    createCopilotAppDatasource,
    updateCopilotAppDatasource,
    deleteCopilotAppDatasource
} from 'services/copilotServices/copilot_datasource';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CustomSnackbar from '../../../CustomSnackbar';
import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';
import copilotConfiguratorStyle from '../styles/copilotConfiguratorStyle';
import { ReactComponent as AddSkillSetIcon } from 'assets/img/add-skillset-icon.svg';
import AddIcon from '@material-ui/icons/Add';
import CopilotToolMarketPlace from './CopilotToolMarketPlace';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CodxCircularLoader from 'components/CodxCircularLoader';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Orchestrator from './Orchestrator';
import { ReactComponent as WarningIcon } from 'assets/img/warningIcon.svg';
import TextToCSVToolConfig from './toolConfigs/TextToCSVToolConfig';
import StoryBoardQueryToolConfig from './toolConfigs/StoryBoardQueryToolConfig';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        position: 'relative',
        maxWidth: theme.layoutSpacing(784),

        display: 'grid',
        gridTemplateRows: 'auto auto 1fr',
        overflow: 'auto'
    },
    rootOnlyOrchestrator: {
        gridTemplateRows: '1fr'
    },
    tabList: {
        '& span.MuiTab-wrapper': {
            color: theme.palette.text.contrastText,
            fontWeight: 500,
            fontSize: theme.layoutSpacing(16.6)
        },
        '& .MuiTab-root': {
            '&:hover': {
                borderRadius: theme.layoutSpacing(5.2)
            }
        }
    },
    toolTitle: {
        margin: theme.layoutSpacing(20.74, 0)
    },
    toolSection: {
        width: '100%',
        overflow: 'hidden'
    },
    toolsContainer: {
        position: 'relative'
    },
    toolCardContainer: {
        display: 'flex',
        gap: theme.layoutSpacing(20.74),
        transition: 'transform 0.3s ease-in-out',
        overflow: 'auto',
        paddingBottom: theme.layoutSpacing(4)
    },
    tool: {
        boxSizing: 'border-box',
        padding: theme.layoutSpacing(10.34, 20.74),
        border: '1px solid #ddd',
        marginRight: theme.layoutSpacing(25.92),
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.layoutSpacing(5.2),
        display: 'flex',
        cursor: 'pointer',
        gap: theme.layoutSpacing(10.37),
        minWidth: theme.layoutSpacing(250),
        minHeight: theme.layoutSpacing(80),
        '&:hover': {
            backgroundColor: theme.palette.background.default
        }
    },
    selectedTool: {
        backgroundColor: theme.palette.background.info,
        '&:hover': {
            backgroundColor: theme.palette.background.info
        }
    },
    toolName: {
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16),
        lineHeight: theme.layoutSpacing(20)
    },
    addToolRoot: {
        height: '100%'
    },
    createToolWrapper: {
        // height: `calc(100vh - ${theme.layoutSpacing(515)})`,
        overflow: 'auto',
        flex: 1,
        background: alpha(theme.palette.text.white, 0.04),
        padding: theme.layoutSpacing(16)
    },
    actionPanel: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: theme.layoutSpacing(8),
        gap: theme.layoutSpacing(10.37),
        width: '100%'
    },
    actionPanelCreate: {
        background: alpha(theme.palette.text.white, 0.04)
    },
    disabledTool: {
        opacity: 0.7,
        pointerEvents: 'none'
    },
    toolsList: {
        // maxHeight: `calc(100vh - ${theme.layoutSpacing(435)})`,
        overflow: 'auto',
        // margin: theme.layoutSpacing(0, -20.74),
        // padding: theme.layoutSpacing(0, 20.74, 10.37),
        display: 'flex',
        gap: theme.layoutSpacing(20.74),
        flexDirection: 'column'
    },
    toolListItem: {
        borderRadius: theme.layoutSpacing(5.2),
        display: 'flex',
        flexDirection: 'column',
        padding: theme.layoutSpacing(0, 12),
        border: '1px solid',
        borderColor: alpha(theme.palette.border.loginGrid, 0.4)
    },
    warningListItem: {
        borderColor: '#CC9025 !important'
    },
    toolListItemWarningMessage: {
        marginTop: theme.layoutSpacing(8),
        fontWeight: 400,
        fontSize: theme.layoutSpacing(15),
        lineHeight: theme.layoutSpacing(20),
        letterSpacing: theme.layoutSpacing(0.5),
        color: '#CC9025',
        '& svg': {
            fill: '#CC9025',
            verticalAlign: 'middle',
            width: theme.layoutSpacing(24),
            height: theme.layoutSpacing(24)
        }
    },
    toolListItemExpanded: {
        borderBottom: '1px solid ' + alpha(theme.palette.border.loginGrid, 0.3)
    },
    toolListItemHeader: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.layoutSpacing(4),
        flexWrap: 'wrap'
    },
    listItemDetail: {
        width: '100%',
        // overflow: 'auto',
        position: 'relative',
        minHeight: theme.layoutSpacing(70)
    },
    toolIconPlaceholder: {
        backgroundColor: `var(--background-color, rgba(217, 217, 217, 1))`,
        width: theme.layoutSpacing(83),
        padding: `var(--no-padding, ${theme.layoutSpacing(31.104, 0)})`
    },
    toolItemInfo: {
        color: theme.palette.text.revamp,
        fontWeight: 500,
        fontSize: theme.layoutSpacing(16),
        lineHeight: theme.layoutSpacing(19.2)
    },
    iconBtn: {
        '& .MuiIconButton-label svg': {
            color: theme.palette.text.contrastText
        }
    },
    listItemAction: {
        display: 'flex',
        gap: theme.layoutSpacing(10.37)
    },
    iconContainer: {
        padding: theme.layoutSpacing(10.37),
        alignSelf: 'center'
    },
    selectedToolSection: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    selectedToolDetails: {
        padding: theme.layoutSpacing(12),
        border: '1px solid',
        borderColor: alpha(theme.palette.border.loginGrid, 0.4),
        borderRadius: theme.layoutSpacing(2)
    },
    detailHeader: {
        display: 'flex',
        alignItems: 'center'
    },
    selectedToolTag: {
        padding: theme.layoutSpacing(8, 0, 0, 0),
        '& .MuiChip-root': {
            padding: theme.layoutSpacing(4, 8),

            '& .MuiChip-label': {
                padding: 0
            }
        }
    },
    toolItemTags: {
        paddingBottom: theme.layoutSpacing(12),
        '& .MuiChip-root': {
            padding: theme.layoutSpacing(4, 8)
        }
    },
    emptyToolCreation: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.layoutSpacing(12),
        // backgroundColor: alpha(theme.palette.text.white, 0.04),
        paddingBottom: theme.layoutSpacing(20),
        width: '100%',
        height: '100%',

        // position: 'absolute',
        // top: '50%',
        // left: '50%',
        // transform: 'translate(-50%, -50%)',

        '& .MuiTypography-h3': {
            fontWeight: 400,
            lineHeight: theme.layoutSpacing(27),
            color: theme.palette.text.revamp
        },

        '& .MuiButton-text': {
            fontFamily: 'Graphik Compact',
            fontSize: theme.layoutSpacing(15),
            fontWeight: 500,
            lineHeight: theme.layoutSpacing(20),
            '& .MuiButton-label': {
                '& .MuiButton-startIcon': {
                    borderRadius: '50%',
                    border: '1px solid',
                    borderColor: theme.palette.text.contrastText,
                    backgroundColor: theme.palette.text.contrastText,

                    '& .MuiSvgIcon-root': {
                        fill: theme.palette.text.btnTextColor
                    }
                }
            },

            '&:hover': {
                backgroundColor: theme.props.mode === 'light' ? '#EDE9F0' : 'transparent',
                color: theme.palette.text.contrastText,
                opacity: 1
            }
        }
    },
    changeSkillBtn: {
        fontFamily: 'Graphik Compact',
        fontSize: theme.layoutSpacing(15),
        fontWeight: 500,
        lineHeight: theme.layoutSpacing(20),
        letterSpacing: theme.layoutSpacing(1.5),
        textDecoration: 'underline',
        alignSelf: 'center',
        cursor: 'pointer',
        color: theme.palette.text.contrastText
    },
    selectedSkillInfoBtn: {
        padding: theme.layoutSpacing(8),
        '& .MuiIconButton-label': {
            '& svg': {
                color: theme.palette.text.chooseFileText,
                width: theme.layoutSpacing(16),
                height: theme.layoutSpacing(16)
            }
        }
    },
    toolListItemSection: {
        width: '100%',
        paddingRight: theme.layoutSpacing(10.368)
    },
    emptyStateContainer: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: theme.layoutSpacing(28),

        '& svg': {
            opacity: '70%'
        },

        '& .MuiTypography-h3': {
            fontWeight: 400,
            lineHeight: theme.layoutSpacing(27),
            color: theme.palette.text.revamp
        }
    },
    emptyStateIcon: {
        '& path': {
            stroke: alpha(theme.palette.text.contrastText, 0.8)
        }
    },
    listItemInfo: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    orchestratorWrapper: {
        height: '100%',
        display: 'grid',
        alignItems: 'center'
    },
    orchestratorWrapperEditFlow: {
        height: 'auto'
    },
    tabPanel1: {
        display: 'flex',
        flexDirection: 'column',

        maxHeight: '100%',
        padding: theme.layoutSpacing(16, 0)
    },
    tabPanel2: {
        padding: theme.layoutSpacing(16, 0),
        maxHeight: '100%'
    },
    deletedToolItem: {
        borderColor: theme.palette.icons.indicatorRed + '!important'
    }
}));

const DefaultToolData = {
    config: {}
};

export default function ToolCofigurator({
    appData,
    mappedTools,
    loadMappedTools,
    appDatasources,
    llmModels,
    embeddingModels,
    orchestrators,
    onSaveOrchestrator,
    fetchDataSources
}) {
    const classes = useStyles();
    const configClasses = copilotConfiguratorStyle();
    const [activeTab, setActiveTab] = React.useState('add');
    const [toolData, setToolData] = useState({ ...DefaultToolData });
    const [saveInProgress, setSaveInProgress] = useState(false);
    const [dataModified, setDataModified] = useState(false);
    const [hasOrchestratorChange, setHasOrchestratorChange] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [toolDatasourceList, setToolDatasourceList] = useState([]);
    const prevOrchestratorId = useRef(appData.orchestrator_id);
    const [isOrchestratorEditMode, setIsOrchestratorEditMode] = useState(false);
    const [toolDatasource, setToolDatasource] = useState(null);
    const [linkedContextList, setLinkedContextList] = useState([]);
    const orchestrator_id = appData.orchestrator_id;
    useEffect(() => {
        setDataModified(false);
        setToolData({ ...DefaultToolData });
    }, [orchestrator_id]);

    const handleChange = (event, activeTabIndex) => {
        if (activeTabIndex === 'add' && activeTab === 'view' && hasOrchestratorChange) {
            setHasOrchestratorChange(false);
        }
        setToolData({ ...DefaultToolData });
        setActiveTab(activeTabIndex);
        setDataModified(false);
        setToolDatasourceList([]);
        setLinkedContextList([]);
    };

    const handleToolDataChange = (_toolData) => {
        setToolData(_toolData);
        setDataModified(true);
    };

    const handleToolDatasourceChange = (data) => {
        setToolDatasourceList(data);
        setDataModified(true);
    };

    const handleSQLDataSourceChange = (data) => {
        setToolDatasourceList(data);
        if (data[0]?.config?.datasource_table?.length > 0 && data[0]?.datasource_id) {
            setDataModified(true);
        } else {
            setDataModified(false);
        }
    };

    const handleLinkedContextChange = (data) => {
        setLinkedContextList(data);
        setDataModified(true);
    };

    const prepareToolDatasourcePayload = (tool_id) => {
        let toolDatasourcePayload = toolDatasourceList.map((item) => {
            return {
                ...item,
                app_published_tool_id: tool_id
            };
        });

        return toolDatasourcePayload;
    };

    const handleSnackbarActionClick = (e) => {
        handleChange(e, 'view');
        setSnackbar({
            open: false
        });
    };

    const handleCreate = async () => {
        try {
            setSaveInProgress(true);
            setIsLoading(true);
            let selectedToolDatasource = [...toolDatasourceList];
            if (toolDatasource !== null) {
                const datasource = await createCopilotAppDatasource({
                    payload: {
                        name: toolDatasource.name,
                        type: toolDatasource.type,
                        config: toolDatasource.config
                    },
                    documents: toolDatasource.documents,
                    copilotAppId: appData.id
                });
                selectedToolDatasource = [
                    ...selectedToolDatasource,
                    { datasource_id: datasource.id }
                ];
                await fetchDataSources();
            }
            await saveCopilotAppTool(toolData.is_test, appData.id, {
                tool_version_registry_mapping_id: toolData.tool_version_registry_mapping_id,
                name: toolData.name,
                desc: toolData.desc,
                config: toolData.config,
                input_params: toolData.input_params,
                selected_datasources: selectedToolDatasource,
                selected_context_datasources: linkedContextList
            });
            setToolData({ ...DefaultToolData });
            setToolDatasourceList([]);
            setLinkedContextList([]);
            setToolDatasource(null);
            setSnackbar({
                open: true,
                message: 'Skill set created successfully!',
                severity: 'success',
                autoHideDuration: 5000,
                actionText: 'View Configured Skill Set',
                onActionClick: handleSnackbarActionClick
            });
            await loadMappedTools();
            // setActiveTab('view');
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Failed to create Skill set!',
                severity: 'error'
            });
        } finally {
            setSaveInProgress(false);
            setIsLoading(false);
            setDataModified(false);
        }
    };

    const isSaveButtonDisabled = () => {
        let isDisabled = false;
        if (toolData.name?.toLowerCase().startsWith('text to sql')) {
            isDisabled =
                !toolDatasourceList?.[0]?.datasource_id ||
                !toolDatasourceList?.[0]?.config?.datasource_table;
        } else if (toolData.name?.toLowerCase().startsWith('document query')) {
            isDisabled = !toolDatasourceList?.[0]?.datasource_id;
        }

        isDisabled = isDisabled || !toolData.desc;

        return !!isDisabled;
    };

    const handleExpandToolItem = async (id, open) => {
        try {
            setDataModified(false);
            setIsLoading(true);
            setToolData({});
            setToolDatasourceList([]);
            setLinkedContextList([]);
            setToolDatasource(null);
            if (open) {
                const data = await getCopilotAppTool(id);
                setToolData({
                    ...data,
                    config: {
                        ...data.config
                    }
                });
                setToolDatasourceList(data.selected_datasources || []);
                setLinkedContextList(data.selected_context_datasources || []);
            }
        } catch (err) {
            //
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        const data = toolData;
        try {
            setSaveInProgress(true);
            let selectedToolDatasource = prepareToolDatasourcePayload(data?.id);
            const isValidToolDatasourceDoc =
                toolDatasource?.datasource_documents?.some(
                    (obj) =>
                        !Object.prototype.hasOwnProperty.call(obj, 'deleted') ||
                        obj.deleted === false
                ) || toolDatasource?.documents?.length > 0;
            if (toolDatasource !== null) {
                if (toolDatasourceList.length === 0) {
                    const datasource = await createCopilotAppDatasource({
                        payload: {
                            name: toolDatasource.name,
                            type: toolDatasource.type,
                            config: toolDatasource.config
                        },
                        documents: toolDatasource.documents,
                        copilotAppId: appData.id
                    });
                    selectedToolDatasource = [
                        ...selectedToolDatasource,
                        {
                            datasource_id: datasource.id,
                            config: datasource.config,
                            app_published_tool_id: data?.id
                        }
                    ];
                    setToolDatasource({ ...datasource });
                } else {
                    if (isValidToolDatasourceDoc) {
                        const datasource = await updateCopilotAppDatasource({
                            payload: {
                                name: toolDatasource.name,
                                type: toolDatasource.type,
                                config: toolDatasource.config,
                                datasource_documents: toolDatasource.datasource_documents
                            },
                            documents: toolDatasource.documents,
                            copilotAppId: appData.id,
                            datasourceId: toolDatasource.id
                        });
                        setToolDatasource({ ...datasource });
                    } else {
                        selectedToolDatasource = [];
                    }
                }
            }
            const updatedTool = await updateCopilotAppTool(data.is_test, data.id, {
                name: data.name,
                desc: data.desc,
                config: data.config,
                input_params: data.input_params,
                selected_datasources: selectedToolDatasource,
                selected_context_datasources: linkedContextList
            });
            setToolDatasourceList(updatedTool.selected_datasources || []);
            if (!isValidToolDatasourceDoc && toolDatasource !== null) {
                await deleteCopilotAppDatasource(appData.id, toolDatasource.id);
                setToolDatasource(null);
            }
            setSnackbar({
                open: true,
                message: 'Skill set updated successfully!',
                severity: 'success'
            });
            loadMappedTools();
            await fetchDataSources();
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Failed to update Skill set!',
                severity: 'error'
            });
        } finally {
            setSaveInProgress(false);
            setDataModified(false);
        }
    };

    const handleRemoveToolMapping = async (id) => {
        try {
            await removeCopilotAppTool(id);
            setSnackbar({
                open: true,
                message: 'Skillset removed successfully!',
                severity: 'success'
            });
            loadMappedTools();
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Failed to remove Skillset!',
                severity: 'error'
            });
        }
    };

    const handleRemoveMultipleTools = async (ids) => {
        await Promise.allSettled(ids?.map(async (id) => await removeCopilotAppTool(id)));
        loadMappedTools();
    };

    const isSaveDisabled = isSaveButtonDisabled();
    const orchestrator = orchestrators?.find((el) => el.id === appData.orchestrator_id);

    useEffect(() => {
        if (prevOrchestratorId.current !== null) {
            if (prevOrchestratorId.current !== appData?.orchestrator_id) {
                setHasOrchestratorChange(true);
            }
        }
        prevOrchestratorId.current = appData?.orchestrator_id;
    }, [appData.orchestrator_id, activeTab]);

    const handleSaveOrchestratorChange = async (data) => {
        try {
            setHasOrchestratorChange(false);
            await onSaveOrchestrator(data);
            setHasOrchestratorChange(true);
        } catch (e) {
            //
        }
    };

    const handleOrchestratorEditModeChange = async (editOpen) => {
        setIsOrchestratorEditMode(editOpen);
    };

    const handleToolDataSourceModification = (data, id = null) => {
        setToolDatasource({
            ...data,
            ...(id !== null && { id: id })
        });
        setDataModified(true);
    };

    return (
        <div
            className={clsx(
                classes.root,
                appData?.orchestrator_id ? '' : classes.rootOnlyOrchestrator
            )}
        >
            <div
                className={clsx(
                    classes.orchestratorWrapper,
                    appData?.orchestrator_id ? classes.orchestratorWrapperEditFlow : ''
                )}
            >
                <Orchestrator
                    appData={appData}
                    orchestrators={orchestrators}
                    onSaveOrchestrator={handleSaveOrchestratorChange}
                    llmModels={llmModels}
                    editFlow={appData?.orchestrator_id}
                    mappedTools={mappedTools}
                    onRemoveTools={handleRemoveMultipleTools}
                    onEditModeChange={handleOrchestratorEditModeChange}
                />
            </div>
            {appData?.orchestrator_id && !isOrchestratorEditMode ? (
                <TabContext value={activeTab}>
                    <ConfirmPopup
                        onConfirm={handleChange}
                        title="You have unsaved changes"
                        subTitle="It looks like you've made some changes on this tab. If you switch tabs, your changes will be lost. Are you sure you want to proceed?"
                        classes={{
                            dialogPaper: configClasses.confirmDialog
                        }}
                        confirmText={
                            activeTab === 'view'
                                ? 'Switch to Add New Skill Set'
                                : 'Switch to View Configured Skill Set'
                        }
                        cancelText={
                            activeTab === 'view'
                                ? 'Stay on View Configured Skill Set'
                                : 'Stay on Add New Skill Set'
                        }
                    >
                        {(triggerConfirm) => (
                            <TabList
                                onChange={(e, value) => {
                                    if (dataModified) {
                                        triggerConfirm(value);
                                    } else {
                                        handleChange(e, value);
                                    }
                                }}
                                className={configClasses.tabs}
                            >
                                <Tab label="Add New Skill Set" value={'add'} />
                                <Tab label="View Configured Skill Set" value={'view'} />
                            </TabList>
                        )}
                    </ConfirmPopup>
                    <TabPanel
                        value={'add'}
                        className={clsx(
                            configClasses.tabPanel,
                            activeTab == 'add' ? classes.tabPanel1 : ''
                        )}
                    >
                        <div className={classes.createToolWrapper}>
                            <CopilotCreateTool
                                appData={appData}
                                classes={classes}
                                configClasses={configClasses}
                                toolData={toolData}
                                saveInProgress={saveInProgress}
                                onToolDataChange={handleToolDataChange}
                                appDatasources={appDatasources}
                                llmModels={llmModels}
                                embeddingModels={embeddingModels}
                                metaData={toolData}
                                toolDatasourceList={toolDatasourceList}
                                onToolDatasourceChange={handleToolDatasourceChange}
                                orchestrator={orchestrator}
                                onSQLDataSourceChange={handleSQLDataSourceChange}
                                onToolDataSourceModified={handleToolDataSourceModification}
                                toolDatasource={toolDatasource}
                                linkedContextList={linkedContextList}
                                onLinkedContextChange={handleLinkedContextChange}
                            />
                        </div>
                        <div className={clsx(classes.actionPanel, classes.actionPanelCreate)}>
                            {toolData.name ? (
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={handleCreate}
                                    disabled={!dataModified || isSaveDisabled || saveInProgress}
                                    className={configClasses.button}
                                >
                                    Save
                                </Button>
                            ) : null}
                        </div>
                    </TabPanel>
                    <TabPanel
                        value={'view'}
                        className={clsx(
                            configClasses.tabPanel,
                            activeTab == 'view' ? classes.tabPanel2 : ''
                        )}
                    >
                        {mappedTools.length === 0 ? (
                            <div className={classes.emptyStateContainer}>
                                <AddSkillSetIcon className={classes.emptyStateIcon} />
                                <Typography variant="h3" className={configClasses.fontStyle2}>
                                    Please add a skill set to view here
                                </Typography>
                            </div>
                        ) : (
                            <ToolsListView
                                classes={classes}
                                configClasses={configClasses}
                                appData={appData}
                                mappedTools={mappedTools}
                                loadMappedTools={loadMappedTools}
                                appDatasources={appDatasources}
                                llmModels={llmModels}
                                embeddingModels={embeddingModels}
                                saveInProgress={saveInProgress}
                                onExpandToolItem={handleExpandToolItem}
                                toolData={toolData}
                                onToolDataChange={handleToolDataChange}
                                onUpdate={handleUpdate}
                                isLoading={isLoading}
                                isSaveDisabled={isSaveDisabled}
                                dataModified={dataModified}
                                toolDatasourceList={toolDatasourceList}
                                onToolDatasourceChange={handleToolDatasourceChange}
                                orchestrator={orchestrator}
                                onRemoveToolMapping={handleRemoveToolMapping}
                                onSQLDataSourceChange={handleSQLDataSourceChange}
                                hasOrchestratorChange={hasOrchestratorChange}
                                onToolDataSourceModified={handleToolDataSourceModification}
                                toolDatasource={toolDatasource}
                                linkedContextList={linkedContextList}
                                onLinkedContextChange={handleLinkedContextChange}
                            />
                        )}
                    </TabPanel>
                </TabContext>
            ) : null}
            <CustomSnackbar
                key="skillset-snackbar"
                autoHideDuration={2000}
                {...snackbar}
                onClose={() => {
                    setSnackbar({ ...snackbar, open: false });
                }}
            />
        </div>
    );
}

function CopilotCreateTool({
    appData,
    classes,
    configClasses,
    toolData,
    appDatasources,
    llmModels,
    // eslint-disable-next-line no-unused-vars
    embeddingModels,
    metaData,
    onToolDataChange,
    saveInProgress,
    toolDatasourceList,
    toolDatasource,
    onToolDatasourceChange,
    orchestrator,
    onSQLDataSourceChange,
    onToolDataSourceModified,
    linkedContextList,
    onLinkedContextChange
}) {
    const [openMarketPlace, setOpenMarketPlace] = useState(false);
    const [showToolInfo, setShowToolInfo] = useState(false);

    const handleToolSelect = (item) => {
        const defaultLLMModelIndex = llmModels?.findIndex(
            (model) => model.id === item?.tool_version_config?.suggested_lang_model
        );

        const defaultEmbeddingModelIndex = embeddingModels?.findIndex(
            (model) => model.id === item?.tool_version_config?.suggested_embedding_model
        );

        onToolDataChange({
            ...toolData,
            tool_version_registry_mapping_id: item.id,
            input_params: item.input_params,
            name: `${item.tool_name} - V${item.version}`,
            tool_version_config: item.tool_version_config,
            config: {
                ...toolData.config,
                llm_model:
                    defaultLLMModelIndex !== -1
                        ? llmModels[defaultLLMModelIndex].id
                        : llmModels[0]?.id,
                embedding_model:
                    defaultEmbeddingModelIndex !== -1
                        ? embeddingModels[defaultEmbeddingModelIndex].id
                        : embeddingModels[0]?.id,
                additional_config: item.tool_version_config?.default_additional_config || null,
                output_summary: true
            },
            desc: item.tool_version_config?.default_description || '',
            is_test: item.is_test
        });
        handleMarketPlaceOpenState();
    };

    const handleToolDataChange = (newToolData) => {
        onToolDataChange({
            ...toolData,
            ...newToolData
        });
    };

    const handleMarketPlaceOpenState = () => {
        setOpenMarketPlace(false);
        if (showToolInfo) {
            setShowToolInfo(false);
        }
    };

    const handleShowToolInfo = () => {
        setShowToolInfo(true);
        setOpenMarketPlace(true);
    };

    const handleInputParamsChange = (input_params) => {
        onToolDataChange({
            ...toolData,
            input_params: input_params
        });
    };

    return (
        <div className={classes.addToolRoot}>
            {!toolData?.tool_version_registry_mapping_id && !metaData?.tool_version_deprecated ? (
                <div className={classes.emptyToolCreation}>
                    <AddSkillSetIcon className={classes.emptyStateIcon} />
                    <Typography variant="h3" className={configClasses.fontStyle2}>
                        Please add a skill set to your Assistant
                    </Typography>
                    <Button
                        startIcon={<AddIcon />}
                        onClick={() => setOpenMarketPlace(true)}
                        className={configClasses.button}
                    >
                        Add Skill Set
                    </Button>
                </div>
            ) : null}
            {toolData.tool_version_registry_mapping_id && !toolData?.status ? (
                <Fragment>
                    <div className={classes.selectedToolSection}>
                        <Typography
                            variant="h4"
                            className={clsx(configClasses.title1, classes.toolTitle)}
                        >
                            Selected Skill Set
                        </Typography>
                        <a
                            onClick={() => setOpenMarketPlace(true)}
                            className={classes.changeSkillBtn}
                        >
                            Change Skill Set
                        </a>
                    </div>
                    <div className={classes.selectedToolDetails}>
                        <div className={classes.detailHeader}>
                            <Typography
                                variant="h4"
                                className={clsx(configClasses.title1, classes.toolName)}
                            >
                                {toolData?.name}
                            </Typography>
                            <IconButton
                                className={classes.selectedSkillInfoBtn}
                                onClick={handleShowToolInfo}
                            >
                                <InfoOutlinedIcon fontSize="large" />
                            </IconButton>
                        </div>
                        <div className={clsx(classes.selectedToolTag, configClasses.chips)}>
                            {toolData?.tool_version_config?.tags?.map((tag) => {
                                return <Chip key={tag} label={tag} />;
                            })}
                        </div>
                    </div>
                </Fragment>
            ) : null}
            <div className={classes.toolConfigSection}>
                {toolData?.name?.toLowerCase().startsWith('text to sql') ||
                toolData?.tool_version_config?.configurator_type?.toLowerCase() ===
                    'text-to-sql' ? (
                    <TextToSQLToolConfig
                        toolData={toolData}
                        onToolDataChange={handleToolDataChange}
                        appDatasources={appDatasources}
                        llmModels={llmModels}
                        toolId={toolData.id}
                        toolDatasourceList={toolDatasourceList}
                        onToolDatasourceChange={onSQLDataSourceChange}
                        onInputParamsChange={handleInputParamsChange}
                        orchestrator={orchestrator}
                        disabled={metaData?.tool_version_deprecated}
                        appData={appData}
                        linkedContextList={linkedContextList}
                        onLinkedContextChange={onLinkedContextChange}
                    />
                ) : null}
                {toolData?.name?.toLowerCase().startsWith('document query') ||
                toolData?.tool_version_config?.configurator_type?.toLowerCase() === 'doc-query' ? (
                    <DocumentQueryToolConfig
                        toolData={toolData}
                        onToolDataChange={handleToolDataChange}
                        appDatasources={appDatasources}
                        llmModels={llmModels}
                        embeddingModels={embeddingModels}
                        toolId={toolData.id}
                        toolDatasourceList={toolDatasourceList}
                        onToolDatasourceChange={onToolDatasourceChange}
                        onInputParamsChange={handleInputParamsChange}
                        orchestrator={orchestrator}
                        disabled={metaData?.tool_version_deprecated}
                        appData={appData}
                        linkedContextList={linkedContextList}
                        onLinkedContextChange={onLinkedContextChange}
                    />
                ) : null}
                {toolData?.name?.toLowerCase().startsWith('text to csv') ||
                toolData?.tool_version_config?.configurator_type?.toLowerCase() ===
                    'text-to-csv' ? (
                    <TextToCSVToolConfig
                        toolData={toolData}
                        onToolDataChange={handleToolDataChange}
                        appDatasources={appDatasources}
                        llmModels={llmModels}
                        toolId={toolData.id}
                        toolDatasourceList={toolDatasourceList}
                        onToolDatasourceChange={onToolDatasourceChange}
                        onInputParamsChange={handleInputParamsChange}
                        orchestrator={orchestrator}
                        disabled={metaData?.tool_version_deprecated}
                        appData={appData}
                        linkedContextList={linkedContextList}
                        onLinkedContextChange={onLinkedContextChange}
                    />
                ) : null}
                {toolData?.tool_version_config?.configurator_type?.toLowerCase() ===
                'storyboarding' ? (
                    <StoryBoardQueryToolConfig
                        toolData={toolData}
                        onToolDataChange={handleToolDataChange}
                        llmModels={llmModels}
                        embeddingModels={embeddingModels}
                        toolId={toolData.id}
                        onInputParamsChange={handleInputParamsChange}
                        orchestrator={orchestrator}
                        onToolDataSourceModified={onToolDataSourceModified}
                        toolDatasourceList={toolDatasourceList}
                        toolDatasource={toolDatasource}
                        saveInProgress={saveInProgress}
                        appData={appData}
                        linkedContextList={linkedContextList}
                        onLinkedContextChange={onLinkedContextChange}
                    />
                ) : null}

                {toolData?.tool_version_registry_mapping_id ? (
                    !toolData?.name?.toLowerCase().startsWith('document query') &&
                    !toolData?.name?.toLowerCase().startsWith('text to sql') &&
                    !toolData?.name?.toLowerCase().startsWith('text to csv') &&
                    !['storyboarding', 'text-to-sql', 'doc-query', 'text-to-csv'].includes(
                        toolData?.tool_version_config?.configurator_type?.toLowerCase()
                    ) ? (
                        <CustomQueryToolConfig
                            toolData={toolData}
                            onToolDataChange={handleToolDataChange}
                            appDatasources={appDatasources}
                            llmModels={llmModels}
                            embeddingModels={embeddingModels}
                            toolId={toolData.id}
                            toolDatasourceList={toolDatasourceList}
                            onToolDatasourceChange={onToolDatasourceChange}
                            onInputParamsChange={handleInputParamsChange}
                            orchestrator={orchestrator}
                            linkedContextList={linkedContextList}
                            onLinkedContextChange={onLinkedContextChange}
                            appData={appData}
                        />
                    ) : null
                ) : metaData?.tool_version_deprecated ? (
                    !toolData?.name?.toLowerCase().startsWith('document query') &&
                    !toolData?.name?.toLowerCase().startsWith('text to sql') &&
                    !toolData?.name?.toLowerCase().startsWith('text to csv') ? (
                        <CustomQueryToolConfig
                            toolData={toolData}
                            onToolDataChange={handleToolDataChange}
                            appDatasources={appDatasources}
                            llmModels={llmModels}
                            embeddingModels={embeddingModels}
                            toolId={toolData.id}
                            toolDatasourceList={toolDatasourceList}
                            onToolDatasourceChange={onToolDatasourceChange}
                            onInputParamsChange={handleInputParamsChange}
                            orchestrator={orchestrator}
                            disabled={metaData?.tool_version_deprecated}
                            linkedContextList={linkedContextList}
                            onLinkedContextChange={onLinkedContextChange}
                            appData={appData}
                        />
                    ) : null
                ) : null}
            </div>
            {openMarketPlace && (
                <CopilotToolMarketPlace
                    orchestrator={orchestrator}
                    openMarketplace={openMarketPlace}
                    toolName={toolData?.name}
                    tool_version_registry_mapping_id={toolData?.tool_version_registry_mapping_id}
                    tool_version_config={toolData?.tool_version_config}
                    showInfo={showToolInfo}
                    onAddSkill={(tool) => handleToolSelect(tool)}
                    onCloseMarketPlace={handleMarketPlaceOpenState}
                    is_test={appData.is_test}
                />
            )}
            {saveInProgress ? <CodxCircularLoader center /> : null}
        </div>
    );
}

const ToolsListView = ({
    appData,
    mappedTools,
    classes,
    configClasses,
    appDatasources,
    llmModels,
    embeddingModels,
    loadMappedTools,
    toolData,
    saveInProgress,
    isSaveDisabled,
    isLoading,
    dataModified,
    onExpandToolItem,
    onToolDataChange,
    onUpdate,
    toolDatasourceList,
    onToolDatasourceChange,
    orchestrator,
    onRemoveToolMapping,
    onSQLDataSourceChange,
    hasOrchestratorChange,
    onToolDataSourceModified,
    toolDatasource,
    linkedContextList,
    onLinkedContextChange
}) => {
    const [expandedItem, setExpandedItem] = useState('');

    const orchestrator_id = orchestrator?.id;
    useEffect(() => {
        setExpandedItem('');
    }, [orchestrator_id]);

    const handleExpandIconClick = (value) => {
        const open = expandedItem === value.id ? '' : value.id;
        onExpandToolItem(value.id, !!open);
        setExpandedItem(open);
    };
    return (
        <List className={classes.toolsList}>
            {mappedTools?.map((item) => (
                <ToolListItem
                    key={item.id}
                    appData={appData}
                    mappedTools={mappedTools}
                    configClasses={configClasses}
                    data={toolData}
                    onUpdate={onUpdate}
                    metaData={item}
                    classes={classes}
                    expanded={item.id === expandedItem}
                    onExpand={() => handleExpandIconClick(item)}
                    loadMappedTools={loadMappedTools}
                    appDatasources={appDatasources}
                    llmModels={llmModels}
                    embeddingModels={embeddingModels}
                    isLoading={isLoading}
                    onRemove={() => onRemoveToolMapping(item.id)}
                    onToolDataChange={onToolDataChange}
                    saveInProgress={saveInProgress}
                    isSaveDisabled={isSaveDisabled}
                    dataModified={dataModified}
                    toolDatasourceList={toolDatasourceList}
                    onToolDatasourceChange={onToolDatasourceChange}
                    orchestrator={orchestrator}
                    onSQLDataSourceChange={onSQLDataSourceChange}
                    hasOrchestratorChange={hasOrchestratorChange}
                    onToolDataSourceModified={onToolDataSourceModified}
                    toolDatasource={toolDatasource}
                    linkedContextList={linkedContextList}
                    onLinkedContextChange={onLinkedContextChange}
                />
            ))}
        </List>
    );
};

const ToolListItem = ({
    appData,
    classes,
    configClasses,
    expanded,
    metaData,
    data,
    appDatasources,
    llmModels,
    embeddingModels,
    saveInProgress,
    isLoading,
    isSaveDisabled,
    dataModified,
    onExpand,
    onToolDataChange,
    onUpdate,
    onRemove,
    toolDatasourceList,
    onToolDatasourceChange,
    orchestrator,
    onSQLDataSourceChange,
    hasOrchestratorChange,
    onToolDataSourceModified,
    toolDatasource,
    linkedContextList,
    onLinkedContextChange
}) => {
    const [openMarketPlace, setOpenMarketPlace] = useState(false);
    const [showToolInfo, setShowToolInfo] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        setShowWarning(hasOrchestratorChange);
    }, [hasOrchestratorChange]);

    const tool_version_registry_mapping_id = metaData?.tool_version_registry_mapping_id;
    // const isToolMappingValid = !!publishedTools.find(
    //     (el) => el.id === tool_version_registry_mapping_id
    // );

    const handleShowToolInfo = () => {
        setShowToolInfo(true);
        setOpenMarketPlace(true);
    };

    const handleMarketPlaceOpenState = () => {
        setOpenMarketPlace(false);
        if (showToolInfo) {
            setShowToolInfo(false);
        }
    };

    return (
        <div>
            <ListItem
                className={clsx(
                    classes.toolListItem,
                    showWarning ? classes.warningListItem : '',
                    metaData?.tool_version_deprecated ? classes.warningListItem : ''
                )}
            >
                <div
                    className={clsx(
                        classes.toolListItemSection,
                        expanded ? classes.toolListItemExpanded : ''
                    )}
                >
                    <div className={classes.toolListItemHeader}>
                        <Typography variant="h5" className={classes.toolItemInfo}>
                            {metaData.name}
                        </Typography>
                        <IconButton
                            edge="end"
                            size="medium"
                            className={classes.selectedSkillInfoBtn}
                            onClick={handleShowToolInfo}
                        >
                            <InfoOutlinedIcon fontSize="large" />
                        </IconButton>
                        <div style={{ flex: 1 }}></div>
                        <div className={classes.listItemAction}>
                            <ConfirmPopup
                                onConfirm={() => onExpand()}
                                title="Unsaved Changes"
                                subTitle="You have unsaved changes. You want to continue?"
                                classes={{
                                    dialogPaper: configClasses.confirmDialog
                                }}
                                enableCloseButton
                            >
                                {(triggerConfirm) => (
                                    <IconButton
                                        edge="end"
                                        size="medium"
                                        title={expanded ? 'close' : 'open'}
                                        aria-label="expand"
                                        onClick={() => {
                                            if (dataModified) {
                                                triggerConfirm();
                                            } else {
                                                setShowWarning(false);
                                                onExpand();
                                            }
                                        }}
                                        className={classes.iconBtn}
                                    >
                                        {expanded ? (
                                            <ExpandLessIcon fontSize="large" />
                                        ) : (
                                            <ExpandMoreIcon fontSize="large" />
                                        )}
                                    </IconButton>
                                )}
                            </ConfirmPopup>

                            <ConfirmPopup
                                onConfirm={onRemove}
                                classes={{
                                    dialogPaper: configClasses.confirmDialog
                                }}
                                title="Delete Selected Skill Set"
                                subTitle="Are you sure you want to delete this selected skill set?"
                                confirmText="Delete"
                                cancelText="Cancel"
                                enableCloseButton
                            >
                                {(triggerConfirm) => (
                                    <IconButton
                                        edge="end"
                                        size="medium"
                                        title="delete"
                                        aria-label="delete"
                                        onClick={triggerConfirm}
                                        className={configClasses.deleteButton}
                                    >
                                        <DeleteOutlineOutlinedIcon fontSize="large" />
                                    </IconButton>
                                )}
                            </ConfirmPopup>
                        </div>
                    </div>
                    <div className={clsx(classes.toolItemTags, configClasses.chips)}>
                        {metaData?.tool_version_config?.tags?.map((tag) => {
                            return <Chip key={tag} label={tag} />;
                        })}
                    </div>
                    {openMarketPlace && (
                        <CopilotToolMarketPlace
                            openMarketplace={openMarketPlace}
                            toolName={metaData?.name}
                            tool_version_registry_mapping_id={
                                metaData?.tool_version_registry_mapping_id
                            }
                            tool_version_config={metaData?.tool_version_config}
                            showInfo={showToolInfo}
                            onCloseMarketPlace={handleMarketPlaceOpenState}
                            is_test={metaData.is_test}
                        />
                    )}
                </div>
                {expanded ? (
                    <>
                        <div className={classes.listItemDetail}>
                            {isLoading ? (
                                <CodxCircularLoader center />
                            ) : (
                                <CopilotCreateTool
                                    appData={appData}
                                    classes={classes}
                                    configClasses={configClasses}
                                    toolData={data}
                                    saveInProgress={saveInProgress}
                                    onToolDataChange={onToolDataChange}
                                    appDatasources={appDatasources}
                                    llmModels={llmModels}
                                    embeddingModels={embeddingModels}
                                    metaData={metaData}
                                    toolDatasourceList={toolDatasourceList}
                                    onToolDatasourceChange={onToolDatasourceChange}
                                    orchestrator={orchestrator}
                                    onSQLDataSourceChange={onSQLDataSourceChange}
                                    onToolDataSourceModified={onToolDataSourceModified}
                                    toolDatasource={toolDatasource}
                                    linkedContextList={linkedContextList}
                                    onLinkedContextChange={onLinkedContextChange}
                                />
                            )}
                        </div>
                        {tool_version_registry_mapping_id ? (
                            <div
                                className={classes.actionPanel}
                                style={{ paddingLeft: 0, paddingRight: 0 }}
                            >
                                <Button
                                    className={configClasses.button}
                                    variant="contained"
                                    size="small"
                                    onClick={onUpdate}
                                    disabled={!dataModified || isSaveDisabled || saveInProgress}
                                    title="update"
                                >
                                    Update
                                </Button>
                            </div>
                        ) : null}
                    </>
                ) : null}
            </ListItem>
            {showWarning ? (
                <Typography variant="body1" className={classes.toolListItemWarningMessage}>
                    <WarningIcon /> Configure the additional settings input fields.
                </Typography>
            ) : null}
            {metaData?.tool_version_deprecated ? (
                <Typography variant="body1" className={classes.toolListItemWarningMessage}>
                    <WarningIcon /> The skill set has been deprecated from the backend, to make any
                    configurational changes, it is recommended to use an updated version or an
                    alternate skill set.
                </Typography>
            ) : null}
        </div>
    );
};
