import {
    alpha,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Tab,
    Typography
} from '@material-ui/core';
import copilotConfiguratorStyle from '../styles/copilotConfiguratorStyle';
import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { useState } from 'react';
import clsx from 'clsx';
import {
    createCopilotAppContext,
    deleteCopilotAppContext,
    getContextDetails,
    updateCopilotAppContext
} from '../../../../services/copilotServices/copilot_context';
import { ContextOnboardTypeJSON, getContextLabel, getContextListItemIcon } from '../util';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import DataMetaDataContext from './contexts/DataMetaDataContext';
import CodxCircularLoader from 'components/CodxCircularLoader';
import CustomSnackbar from 'components/CustomSnackbar';
import { ReactComponent as EmptyDatasourceListIcon } from 'assets/img/empty-datasource-list-icon.svg';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%'
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(8)
    },
    createTabPanel: {
        '& $formContainer': {
            paddingRight: theme.layoutSpacing(10.368)
        }
    },
    contextsList: {
        gap: theme.layoutSpacing(20.74),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column'
    },
    contextListItem: {
        display: 'flex',
        padding: '0',
        borderRadius: theme.layoutSpacing(5.2),
        flexDirection: 'column'
    },
    contextItemHeader: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: theme.layoutSpacing(10, 24),

        '& .MuiListItemIcon-root': {
            justifyContent: 'center',
            padding: theme.layoutSpacing(8, 36, 8, 2),
            borderRight: '1px solid ' + alpha(theme.palette.border.loginGrid, 0.3),

            '& svg': {
                width: theme.layoutSpacing(48),
                height: theme.layoutSpacing(52)
            }
        }
    },
    contextListItemExpanded: {
        borderBottom: '1px solid ' + alpha(theme.palette.border.loginGrid, 0.3)
    },
    contextListItemIcon: {
        '& svg': {
            '& path': {
                stroke: theme.palette.text.contrastText
            },
            '& path:nth-of-type(6)': {
                fill: theme.palette.primary.main
            }
        }
    },
    contextInfo: {
        paddingLeft: theme.layoutSpacing(24),
        '& .MuiListItemText-primary': {
            color: theme.palette.text.revamp,
            fontSize: theme.layoutSpacing(13),
            fontWeight: 400,
            lineHeight: theme.layoutSpacing(15.6)
        },
        '& .MuiListItemText-secondary': {
            color: theme.palette.text.revamp,
            fontWeight: 500,
            fontSize: theme.layoutSpacing(15),
            lineHeight: theme.layoutSpacing(24),
            letterSpacing: theme.layoutSpacing(0.5)
        }
    },
    listItemAction: {
        display: 'flex',
        gap: theme.layoutSpacing(10.37)
    },
    iconBtn: {
        '& .MuiIconButton-label svg': {
            color: theme.palette.text.contrastText
        }
    },
    contextIconContainer: {
        width: '100%',
        display: 'flex',
        gap: theme.layoutSpacing(38.6),
        flexWrap: 'wrap'
    },
    contextIcon: {
        padding: theme.layoutSpacing(8.6),
        borderRadius: theme.layoutSpacing(4),
        border: '1px solid',
        // borderColor: alpha(theme.palette.text.black, 0.2),
        borderColor: alpha(theme.palette.border.loginGrid, 0.4),
        '& svg': {
            width: theme.layoutSpacing(35.84),
            height: theme.layoutSpacing(35.84),
            '& path': {
                stroke: theme.palette.text.contrastText
            },
            '& path:nth-of-type(6)': {
                fill: theme.palette.primary.main
            }
        }
    },
    disbabledContextIcon: {
        '& svg': {
            fill: alpha(theme.palette.text.contrastText, 0.4),
            '& path': {
                stroke: alpha(theme.palette.text.contrastText, 0.4)
            }
        }
    },
    contextOption: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: '2px',
        cursor: 'pointer',
        flexDirection: 'column',
        gap: theme.layoutSpacing(8.3),

        '&:hover': {
            '& $contextIcon': {
                backgroundColor:
                    theme.props.mode === 'light'
                        ? theme.palette.background.cardItemHover
                        : theme.palette.background.menuItemHover
            }
        }
    },
    contextOptionDisabled: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: '2px',
        cursor: 'not-allowed',
        flexDirection: 'column',
        gap: theme.layoutSpacing(8.3)
    },
    contextIconLabel: {
        fontWeight: 500,
        color: theme.palette.text.revamp
    },
    contextLabel: {
        fontWeight: 400
    },
    disabledLabel: {
        color: alpha(theme.palette.text.revamp, 0.4)
    },
    contextTypeSelected: {
        backgroundColor:
            theme.props.mode === 'light'
                ? theme.palette.background.cardItemHover
                : theme.palette.background.menuItemHover,
        borderColor: theme.palette.border.LoginInpBorder
    },
    contextItemDetail: {
        width: '100%',
        padding: theme.layoutSpacing(20.74),
        // overflow: 'auto',
        position: 'relative',
        minHeight: theme.layoutSpacing(70)
    },
    dataConfigWrapper: {
        width: '100%',
        borderRadius: theme.layoutSpacing(6),
        border: '1px solid',
        borderColor: alpha(theme.palette.border.loginGrid, 0.4),
        padding: theme.layoutSpacing(16),
        paddingRight: theme.layoutSpacing(40),
        marginTop: theme.layoutSpacing(6)
    },
    viewTabWrapper: {
        width: '100%',
        border: 'none',
        padding: 0
    },
    emptyStateContainer: {
        height: 'calc(100vh - 42rem)',
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
            fill: alpha(theme.palette.text.contrastText, 0.8)
        }
    }
}));

const CreateContext = ({
    classes,
    configClasses,
    context,
    onContextChange,
    contextDocs,
    onContextDocChange,
    contextConfig,
    onSaveUploadContext,
    isLoading,
    activeTab = 'add',
    onUpdateContextDocs,
    onUpdateUploadContext,
    isUpdateDisabled,
    onContextConfigChange,
    contextSourceType,
    isTabInputModified
}) => {
    const handleContextChange = (val, key) => {
        onContextChange(val, key);
    };
    return (
        <div className={classes.formContainer}>
            {activeTab === 'add' ? (
                <div className={classes.contextIconContainer}>
                    {ContextOnboardTypeJSON.map((el, i) => (
                        <ConfirmPopup
                            key={i}
                            onConfirm={(e) => {
                                e.stopPropagation();
                                handleContextChange(el.value, 'type');
                            }}
                            title="Save Context"
                            subTitle="Your changes will be lost. Are you sure to move?"
                            classes={{
                                dialogPaper: configClasses.confirmDialog
                            }}
                            confirmText="Yes"
                            cancelText="No"
                            enableCloseButton
                        >
                            {(triggerConfirm) => (
                                <div
                                    className={
                                        el.disabled
                                            ? classes.contextOptionDisabled
                                            : classes.contextOption
                                    }
                                    key={el.name}
                                    onClick={() => {
                                        if (!el.disabled && el.value !== context?.type) {
                                            if (isTabInputModified) {
                                                triggerConfirm();
                                            } else {
                                                handleContextChange(el.value, 'type');
                                            }
                                        }
                                    }}
                                >
                                    <div
                                        className={clsx(
                                            classes.contextIcon,
                                            el.value === context?.type
                                                ? classes.contextTypeSelected
                                                : '',
                                            el.disabled ? classes.disbabledContextIcon : ''
                                        )}
                                    >
                                        {el.icon}
                                    </div>
                                    <div
                                        className={clsx(
                                            classes.contextIconLabel,
                                            configClasses.fontStyle1,
                                            el.value !== context?.type ? classes.contextLabel : '',
                                            el.disabled ? classes.disabledLabel : ''
                                        )}
                                    >
                                        {el.label}
                                    </div>
                                </div>
                            )}
                        </ConfirmPopup>
                    ))}
                </div>
            ) : null}
            <div
                className={`${
                    activeTab === 'view' ? classes.viewTabWrapper : classes.dataConfigWrapper
                }`}
            >
                {/* Using same component */}
                {context['type'] === 'data_metadata' || context['type'] === 'metrics_kpi' ? (
                    <DataMetaDataContext
                        context={context}
                        onContextChange={onContextChange}
                        contextDocs={contextDocs}
                        onContextDocChange={onContextDocChange}
                        onSaveUploadContext={onSaveUploadContext}
                        onUpdateExistingDocument={onUpdateContextDocs}
                        onUpdateUploadContext={onUpdateUploadContext}
                        isUpdateDisabled={isUpdateDisabled}
                        config={contextConfig}
                        onConfigChange={onContextConfigChange}
                        isLoading={isLoading}
                        contextSourceType={contextSourceType}
                    />
                ) : null}
            </div>
            {isLoading ? <CodxCircularLoader center /> : null}
        </div>
    );
};

const ContextListView = ({
    classes,
    configClasses,
    contextList,
    onEditContext,
    loading,
    isUpdateDisabled,
    onRemoveContext,
    expandedContext,
    contextDocs,
    saveInProgress,
    onContextDocChange,
    onContextChange,
    onUpdateContextDocs,
    onContextUpdate,
    expandedContextConfig,
    onContextConfigChange,
    contextSourceType
}) => {
    const [expandedItem, setExpandedItem] = useState('');

    const handleExpandIconClick = (value) => {
        onEditContext(value, expandedItem !== value);
        setExpandedItem(expandedItem === value ? '' : value);
    };

    return (
        <List className={classes.contextsList}>
            {contextList?.map((item) => (
                <ListItem key={item.id} className={classes.contextListItem}>
                    <div
                        className={clsx(
                            classes.contextItemHeader,
                            expandedItem == item.id ? classes.contextListItemExpanded : ''
                        )}
                    >
                        <ListItemIcon style={{ justifyContent: 'center' }}>
                            {item.type === 'data_metadata' || item.type === 'metrics_kpi' ? (
                                <div className={classes.contextListItemIcon}>
                                    {getContextListItemIcon(item)}
                                </div>
                            ) : (
                                <div className={classes.datasourceIcon}></div>
                            )}
                        </ListItemIcon>
                        <ListItemText
                            primary={getContextLabel(item.type)}
                            primaryTypographyProps={{
                                variant: 'h5'
                            }}
                            secondary={item.name}
                            secondaryTypographyProps={{
                                variant: 'h4'
                            }}
                            className={classes.contextInfo}
                        />
                        <div style={{ flex: 1 }}></div>
                        <div className={classes.listItemAction}>
                            <ConfirmPopup
                                onConfirm={() => handleExpandIconClick(item.id)}
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
                                        title={expandedItem === item.id ? 'close' : 'open'}
                                        aria-label="expand"
                                        onClick={() => {
                                            if (isUpdateDisabled) {
                                                handleExpandIconClick(item.id);
                                            } else {
                                                triggerConfirm();
                                            }
                                        }}
                                        className={classes.iconBtn}
                                        disabled={loading}
                                    >
                                        {expandedItem === item.id ? (
                                            <ExpandLessIcon fontSize="large" />
                                        ) : (
                                            <ExpandMoreIcon fontSize="large" />
                                        )}
                                    </IconButton>
                                )}
                            </ConfirmPopup>

                            <ConfirmPopup
                                onConfirm={() => onRemoveContext(item.id)}
                                title="Delete Selected Context"
                                subTitle="Are you sure you want to delete this selected context?"
                                classes={{
                                    dialogPaper: configClasses.confirmDialog
                                }}
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
                    {expandedItem === item.id && expandedContext ? (
                        <>
                            <div className={classes.contextItemDetail}>
                                {loading ? (
                                    <CodxCircularLoader center />
                                ) : (
                                    <CreateContext
                                        classes={classes}
                                        configClasses={configClasses}
                                        context={expandedContext}
                                        contextConfig={expandedContextConfig}
                                        contextDocs={contextDocs}
                                        isLoading={saveInProgress}
                                        onContextChange={onContextChange}
                                        onContextConfigChange={onContextConfigChange}
                                        onContextDocChange={onContextDocChange}
                                        onUpdateContextDocs={onUpdateContextDocs}
                                        onUpdateUploadContext={onContextUpdate}
                                        isUpdateDisabled={
                                            isUpdateDisabled || expandedContext.name === ''
                                        }
                                        activeTab="view"
                                        contextSourceType={contextSourceType}
                                    />
                                )}
                            </div>
                        </>
                    ) : null}
                </ListItem>
            ))}
        </List>
    );
};

export default function OnboardContext({ copilotAppId, appContexts, fetchAppContexts }) {
    const classes = useStyles();
    const configClasses = copilotConfiguratorStyle();

    const [activeTab, setActiveTab] = useState('add');
    const [isTabInputModified, setIsTabInputModified] = useState(false);
    const [viewLoader, setViewLoader] = useState(false);
    const [isUpdateDisabled, setIsUpdateDisabled] = useState(true);
    const [contextDocs, setContextDocs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [context, setContext] = useState({
        type: 'data_metadata',
        name: ''
    });
    const [contextSourceType, setContextSourceType] = useState('');
    const [contextConfig, setContextConfig] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });

    const handleContextConfigChange = (val, key) => {
        if (key === 'source_type') {
            setContextSourceType(val);
            setContextDocs([]);
        } else {
            setContextConfig({ ...contextConfig, [key]: val });
            setIsTabInputModified(true);
        }
        setIsUpdateDisabled(false);
        // setIsTabInputModified(true);
    };

    const handleChangeTab = (event, activeTabIndex) => {
        if (activeTabIndex === 'add') {
            setContext({
                type: 'data_metadata',
                name: ''
            });
        }
        setActiveTab(activeTabIndex);
        setIsTabInputModified(false);
        setIsUpdateDisabled(true);
    };

    const handleContextChange = (val, key) => {
        if (key === 'type') {
            setContext({
                type: val,
                name: ''
            });
            setIsTabInputModified(false);
        } else {
            setContext({ ...context, [key]: val });
            setIsTabInputModified(true);
        }
        setIsUpdateDisabled(false);
    };

    const handlecontextDocChange = (docs) => {
        setContextDocs(docs);
        setIsTabInputModified(true);
        if (context.id) {
            setIsUpdateDisabled(false);
        }
    };

    const handleEditContext = async (id, fetchContext = true) => {
        try {
            setIsTabInputModified(false);
            setViewLoader(true);
            setIsUpdateDisabled(true);
            if (fetchContext) {
                const contextData = await getContextDetails({
                    copilotAppId: copilotAppId,
                    contextId: id
                });
                console.log('contextData', contextData);
                setContext({
                    type: contextData?.[0]?.context_type,
                    name: contextData?.[0]?.context_name,
                    id: contextData?.[0]?.context_id,
                    context_documents: contextData
                });
                setContextSourceType(contextData[0]?.context_source_type);
                setContextConfig({ ...contextData?.config });
            }
        } catch (err) {
            //
        } finally {
            setViewLoader(false);
        }
    };

    const handleContextSave = async () => {
        setIsLoading(true);
        await createCopilotAppContext({
            payload: {
                ...context,
                source_type: contextSourceType,
                config: {
                    ...contextConfig
                }
            },
            documents: contextDocs,
            copilotAppId: copilotAppId,
            callback: onResponseCreateContext
        });
    };

    const handleSnackbarActionClick = (e) => {
        handleChangeTab(e, 'view');
        setSnackbar({
            open: false
        });
    };

    const handleContextUpdate = async () => {
        setIsUpdateDisabled(true);
        setIsLoading(true);
        await updateCopilotAppContext({
            payload: {
                ...context,
                source_type: contextSourceType,
                config: {
                    ...contextConfig
                }
            },
            documents: contextDocs,
            copilotAppId: copilotAppId,
            contextId: context.id,
            callback: onResponseUpdateContext
        });
    };

    const onResponseUpdateContext = async (response_data, response_status) => {
        if (response_status === 200) {
            setContextDocs([]);
            setContext({
                type: response_data?.[0]?.context_type,
                name: response_data?.[0]?.context_name,
                id: response_data?.[0]?.context_id,
                context_documents: response_data
            });
            setContextSourceType(response_data[0]?.context_source_type);
            setContextConfig({ ...response_data?.config });
            setSnackbar({
                open: true,
                message: 'Datasource updated successfully',
                severity: 'success',
                autoHideDuration: 3000
            });
            setIsLoading(false);
            setIsTabInputModified(false);
            await fetchAppContexts();
        }

        if (response_status === 'error') {
            setSnackbar({
                open: true,
                message: response_data,
                severity: 'error',
                autoHideDuration: 2000
            });
        }
        setIsLoading(false);
    };

    const onResponseCreateContext = async (response_data, response_status) => {
        if (response_status === 200) {
            await fetchAppContexts();
            setSnackbar({
                open: true,
                message: 'Context saved successfully',
                severity: 'success',
                autoHideDuration: 5000,
                actionText: 'View Added Context',
                onActionClick: handleSnackbarActionClick
            });
            setContext({
                name: '',
                type: context.type
            });
            setContextDocs([]);
            setIsUpdateDisabled(true);
            setIsTabInputModified(false);
        }

        if (response_status === 'error') {
            setSnackbar({
                open: true,
                message: response_data,
                severity: 'error',
                autoHideDuration: 2000
            });
        }
        setIsLoading(false);
    };

    const handleUpdateContextDocs = (updatedContext) => {
        setContext({
            ...updatedContext
        });
        setIsTabInputModified(true);
        if (context.id) {
            setIsUpdateDisabled(false);
        }
    };

    const handleRemoveContext = async (contextId) => {
        try {
            await deleteCopilotAppContext(copilotAppId, contextId);
            setSnackbar({
                open: true,
                message: 'Context removed successfully!',
                severity: 'success'
            });
            await fetchAppContexts();
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Failed to remove Conext!',
                severity: 'error'
            });
        }
    };

    return (
        <div className={classes.root}>
            <TabContext value={activeTab}>
                <ConfirmPopup
                    onConfirm={handleChangeTab}
                    title="You have unsaved changes"
                    subTitle="It looks like you've made some changes on this tab. If you switch tabs, your changes will be lost. Are you sure you want to proceed?"
                    classes={{
                        dialogPaper: configClasses.confirmDialog
                    }}
                    confirmText={
                        activeTab === 'view'
                            ? 'Switch to Onboard Context'
                            : 'Switch to View Context'
                    }
                    cancelText={
                        activeTab === 'view' ? 'Stay on View Context' : 'Stay on Onboard Context'
                    }
                >
                    {(triggerConfirm) => (
                        <TabList
                            onChange={(e, value) => {
                                if (isTabInputModified) {
                                    triggerConfirm(value);
                                } else {
                                    handleChangeTab(e, value);
                                }
                            }}
                            className={configClasses.tabs}
                        >
                            <Tab key="Onboard Context" label="Onboard Context" value="add" />
                            <Tab key="View Context" label="View Context" value="view" />
                        </TabList>
                    )}
                </ConfirmPopup>
                <TabPanel
                    value="add"
                    className={clsx(configClasses.tabPanel, classes.createTabPanel)}
                >
                    <CreateContext
                        classes={classes}
                        configClasses={configClasses}
                        context={context}
                        contextConfig={contextConfig}
                        contextSourceType={contextSourceType}
                        onContextConfigChange={handleContextConfigChange}
                        onContextChange={handleContextChange}
                        contextDocs={contextDocs}
                        onContextDocChange={handlecontextDocChange}
                        onSaveUploadContext={handleContextSave}
                        isLoading={isLoading}
                        isTabInputModified={isTabInputModified}
                    />
                </TabPanel>
                <TabPanel value="view" className={configClasses.tabPanel}>
                    {appContexts.length === 0 ? (
                        <div className={classes.emptyStateContainer}>
                            <EmptyDatasourceListIcon className={classes.emptyStateIcon} />
                            <Typography variant="h3" className={configClasses.fontStyle2}>
                                Please add contexts to view here
                            </Typography>
                        </div>
                    ) : (
                        <ContextListView
                            classes={classes}
                            configClasses={configClasses}
                            contextList={appContexts}
                            onEditContext={handleEditContext}
                            expandedContextConfig={contextConfig}
                            loading={viewLoader}
                            onRemoveContext={handleRemoveContext}
                            isUpdateDisabled={isUpdateDisabled}
                            expandedContext={context}
                            contextDocs={contextDocs}
                            saveInProgress={isLoading}
                            onContextDocChange={handlecontextDocChange}
                            onContextChange={handleContextChange}
                            onUpdateContextDocs={handleUpdateContextDocs}
                            onContextUpdate={handleContextUpdate}
                            onContextConfigChange={handleContextConfigChange}
                            contextSourceType={contextSourceType}
                        />
                    )}
                </TabPanel>
            </TabContext>
            <CustomSnackbar
                key={`context-snackbar-${snackbar.message}`}
                {...snackbar}
                onClose={() => {
                    setSnackbar({ open: false });
                }}
            />
        </div>
    );
}
