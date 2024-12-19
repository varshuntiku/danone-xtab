import {
    Button,
    FormControl,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    Tab,
    TextField,
    // alpha,
    makeStyles,
    Typography,
    alpha
} from '@material-ui/core';
import React, { Fragment, useState } from 'react';
import clsx from 'clsx';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import CopilotUploadDatasource from './CopilotUploadDatasource';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import CustomSnackbar from 'components/CustomSnackbar';
import {
    createCopilotAppDatasource,
    fetchBlobContainers,
    fetchS3Buckets,
    getCopilotAppDatasource,
    updateCopilotAppDatasource,
    validateCopilotDatasourceConfiguration
} from 'services/copilotServices/copilot_datasource';
import { DataSourceTypeJSON, getListItemIcon, getDatasourceLabel, requiredField } from '../util';
import copilotConfiguratorStyle from '../styles/copilotConfiguratorStyle';
import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';
import { deleteCopilotAppDatasource } from '../../../../services/copilotServices/copilot_datasource';
import CodxCircularLoader from 'components/CodxCircularLoader';
import { ReactComponent as EmptyDatasourceListIcon } from 'assets/img/empty-datasource-list-icon.svg';
import CopilotFileStorageDatasource from './datasources/CopilotFileStorageDatasource';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%'
    },
    sqldbRoot: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(16.6)
    },
    sqldbOptionGroup: {
        width: '100%',
        display: 'flex',
        gap: theme.layoutSpacing(16.6),
        flexWrap: 'wrap'
    },
    sqldbOption: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: '2px',
        cursor: 'pointer',
        flexDirection: 'column',
        gap: theme.layoutSpacing(8.3),

        '&:hover': {
            '& $dbIcon': {
                backgroundColor:
                    theme.props.mode === 'light'
                        ? theme.palette.background.cardItemHover
                        : theme.palette.background.menuItemHover
            }
        }
    },
    dbIcon: {
        padding: theme.layoutSpacing(16.6),
        // background: "#DADEE6",
        borderRadius: theme.layoutSpacing(4),
        border: '1px solid',
        borderColor: alpha(theme.palette.text.black, 0.2),
        '& svg': {
            width: theme.layoutSpacing(51.84),
            height: theme.layoutSpacing(51.84)
        }
    },
    dbLabel: {
        fontWeight: 500,
        color: theme.palette.text.revamp
    },
    sqldbOptionSelected: {
        // outline: `1px solid #220047`,
        // boxShadow: theme.shadows[2],
        '&$dbIcon': {
            backgroundColor: alpha(theme.palette.background.cardItemFocus, 0.1),
            borderColor: theme.palette.border.LoginInpBorder
        }
    },
    dataSourcesConfigContainer: {},
    dataSourceConfigItem: {
        padding: theme.layoutSpacing(16.6),
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(16.6),
        // border: `1px solid ${alpha(theme.palette.text.default, 0.2)}`,
        alignItems: 'flex-start',
        // maxWidth: theme.layoutSpacing(725.76),
        backgroundColor:
            theme.props.mode === 'light' ? '#FBF9F7' : alpha(theme.palette.text.white, 0.04)
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
    datasourcesList: {
        gap: theme.layoutSpacing(20.74),
        // margin: theme.layoutSpacing(0, -20.74),
        display: 'flex',
        // padding: theme.layoutSpacing(0, 20.74, 10.37),
        overflow: 'auto',
        // maxHeight: `calc(100vh - ${theme.layoutSpacing(420)})`,
        flexDirection: 'column'
    },
    datasourceListItem: {
        display: 'flex',
        padding: '0',
        borderRadius: theme.layoutSpacing(5.2),
        flexDirection: 'column'
    },
    datasourceListItemExpanded: {
        borderBottom: '1px solid ' + alpha(theme.palette.border.loginGrid, 0.3)
    },
    datasourceItemHeader: {
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
    datasourceInfo: {
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
    iconBtn: {
        '& .MuiIconButton-label svg': {
            color: theme.palette.text.contrastText
        }
    },
    datasourceIcon: {
        backgroundColor: `var(--background-color, rgba(217, 217, 217, 1))`,
        width: theme.layoutSpacing(83),
        padding: `var(--no-padding, ${theme.layoutSpacing(31.104, 0)})`
    },
    datasourceItemDetail: {
        width: '100%',
        padding: theme.layoutSpacing(20.74),
        // overflow: 'auto',
        position: 'relative',
        minHeight: theme.layoutSpacing(70)
    },
    actionPanel: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: theme.layoutSpacing(20.74),
        gap: theme.layoutSpacing(10.37),
        width: '100%'
    },
    dbOptionDisabled: {
        pointerEvents: 'none'
    },
    listItemAction: {
        display: 'flex',
        gap: theme.layoutSpacing(10.37)
    },
    sqlDatasourceAction: {
        display: 'flex',
        width: '100%',
        gap: theme.layoutSpacing(9.4)
    },
    datasourceLabel: {
        color: theme.palette.text.contrastText,
        marginTop: theme.layoutSpacing(8)
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        // marginTop: theme.layoutSpacing(10),
        gap: theme.layoutSpacing(8)
    },
    dataConfigWrapper: {
        width: '100%',
        marginTop: theme.layoutSpacing(24)
    },
    dbInputLabel: {
        color: theme.palette.text.revamp
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
    },
    datasourceListItemIcon: {
        '& svg': {
            '& path': {
                fill: theme.palette.text.contrastText
            }
        }
    },
    createTabPanel: {
        '& $formContainer': {
            // height: `calc(100vh - ${theme.layoutSpacing(425)})`,
            // overflowY: 'auto',
            paddingRight: theme.layoutSpacing(10.368)
        }
    },
    halfWidth: {
        maxWidth: theme.layoutSpacing(400)
    }
}));

const CreateDataSource = ({
    classes,
    configClasses,
    datasource,
    datasourceConfig,
    datasourceDocs,
    isLoading,
    onDatasourceChange,
    onDatasourceConfigChange,
    onDatasourceDocChange,
    onSaveSqlDatasource,
    onSaveUploadDatasource,
    onUpdateUploadDatasource,
    onUpdateDatasourceDocs,
    onValidateDatasourceConfig,
    onSaveDatasource,
    isUpdateDisabled
}) => {
    return (
        <div className={classes.formContainer}>
            {/* <Typography variant='h5' className={configClasses.title1}>Data Type</Typography> */}
            <div className={classes.halfWidth}>
                <InputLabel id="datasource-name" className={configClasses.inputLabel}>
                    Enter Datasource Name{requiredField}
                </InputLabel>
                <TextField
                    classes={{ root: configClasses.formControl }}
                    size="small"
                    fullWidth
                    value={datasource['name']}
                    variant="outlined"
                    onChange={(e) => onDatasourceChange(e.target.value, 'name')}
                    required
                    placeholder="Enter Name"
                />
            </div>
            {!datasource.id && (
                <div className={classes.halfWidth}>
                    <InputLabel id="datasource-type" className={configClasses.inputLabel}>
                        Select Your Datasource<sup></sup>
                    </InputLabel>
                    <FormControl
                        size="small"
                        variant="outlined"
                        className={configClasses.formControl}
                        fullWidth
                    >
                        <Select
                            size="small"
                            labelId="datasource-type"
                            value={datasource['type']}
                            onChange={(e) => onDatasourceChange(e.target.value, 'type')}
                            fullWidth
                            disabled={datasource?.id ? true : false}
                            MenuProps={{
                                MenuListProps: {
                                    classes: {
                                        root: configClasses.inputDropdownSelect
                                    }
                                },
                                disableAutoFocusItem: true
                            }}
                        >
                            {DataSourceTypeJSON.map((item) =>
                                item.value !== 'storyboard_slidemaster' ? (
                                    <MenuItem key={item.label} value={item.value}>
                                        {item.label}
                                    </MenuItem>
                                ) : null
                            )}
                        </Select>
                    </FormControl>
                </div>
            )}
            <div className={classes.dataConfigWrapper} style={{ width: '100%' }}>
                {datasource['type'] === 'upload' ? (
                    <CopilotUploadDatasource
                        datasource={datasource}
                        datasourceDocs={datasourceDocs}
                        config={datasourceConfig}
                        onChange={onDatasourceConfigChange}
                        onFileChange={onDatasourceDocChange}
                        onSaveUploadDatasource={onSaveUploadDatasource}
                        onUpdateUploadDatasource={onUpdateUploadDatasource}
                        onUpdateExistingDocument={onUpdateDatasourceDocs}
                        acceptedFileExtensions={['.pdf', '.pptx', '.ppt', '.docx', '.doc', '.txt']}
                        multiple={true}
                        isUpdateDisabled={isUpdateDisabled}
                        isLoading={isLoading}
                    />
                ) : null}
                {datasource['type'] === 'sql' ? (
                    <SQLDatabaseConfigurator
                        classes={classes}
                        configClasses={configClasses}
                        config={datasourceConfig}
                        datasource={datasource}
                        onChange={onDatasourceConfigChange}
                        onValidateAndSaveDatasource={onSaveSqlDatasource}
                        // onCancel={handleCancelClick}
                    />
                ) : null}
                {datasource['type'] === 'file_storage' ? (
                    <CopilotFileStorageDatasource
                        datasource={datasource}
                        config={datasourceConfig}
                        onChange={onDatasourceConfigChange}
                        onValidateDatasourceConfig={onValidateDatasourceConfig}
                        onSaveDatasource={onSaveDatasource}
                    />
                ) : null}
                {datasource['type'] === 'csv' ? (
                    <CopilotUploadDatasource
                        datasource={datasource}
                        datasourceDocs={datasourceDocs}
                        config={datasourceConfig}
                        onChange={onDatasourceConfigChange}
                        onFileChange={onDatasourceDocChange}
                        onSaveUploadDatasource={onSaveUploadDatasource}
                        onUpdateUploadDatasource={onUpdateUploadDatasource}
                        onUpdateExistingDocument={onUpdateDatasourceDocs}
                        acceptedFileExtensions={['.csv', '.xlsx']}
                        isUpdateDisabled={isUpdateDisabled}
                        multiple={false}
                        isLoading={isLoading}
                    />
                ) : null}
            </div>
            {isLoading ? <CodxCircularLoader center /> : null}
        </div>
    );
};

const DatasourceListView = ({
    classes,
    configClasses,
    datasourceList,
    expandedDatasource,
    expandedDatasourceConfig,
    datasourceDocs,
    loading,
    isUpdateDisabled,
    saveInProgress,
    onExpandDatasource,
    onDatasourceChange,
    onDatasourceConfigChange,
    onDatasourceDocChange,
    onDatasourceUpdate,
    onUpdateDatasourceDocs,
    onRemoveDatasource,
    onValidateDatasourceConfig
}) => {
    const [expandedItem, setExpandedItem] = useState('');

    const handleExpandIconClick = (value) => {
        onExpandDatasource(value, expandedItem !== value);
        setExpandedItem(expandedItem === value ? '' : value);
    };

    return (
        <List className={classes.datasourcesList}>
            {datasourceList.map((item) => {
                if (item.type === 'storyboard_slidemaster') {
                    return null;
                } else {
                    return (
                        <ListItem key={item.id} className={classes.datasourceListItem}>
                            <div
                                className={clsx(
                                    classes.datasourceItemHeader,
                                    expandedItem == item.id
                                        ? classes.datasourceListItemExpanded
                                        : ''
                                )}
                            >
                                <ListItemIcon style={{ justifyContent: 'center' }}>
                                    {item.type === 'sql' ||
                                    item.type === 'upload' ||
                                    item.type === 'file_storage' ||
                                    item.type === 'csv' ? (
                                        <div
                                            className={
                                                item.type === 'upload'
                                                    ? classes.datasourceListItemIcon
                                                    : ''
                                            }
                                        >
                                            {getListItemIcon(item)}
                                        </div>
                                    ) : (
                                        <div className={classes.datasourceIcon}></div>
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    primary={getDatasourceLabel(item)}
                                    primaryTypographyProps={{
                                        variant: 'h5'
                                    }}
                                    secondary={item.name}
                                    secondaryTypographyProps={{
                                        variant: 'h4'
                                    }}
                                    className={classes.datasourceInfo}
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
                                        onConfirm={() => onRemoveDatasource(item.id)}
                                        title="Delete Selected Datasource"
                                        subTitle="Are you sure you want to delete this selected datasource?"
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
                            {expandedItem === item.id && expandedDatasource ? (
                                <>
                                    <div className={classes.datasourceItemDetail}>
                                        {loading ? (
                                            <CodxCircularLoader center />
                                        ) : (
                                            <CreateDataSource
                                                classes={classes}
                                                configClasses={configClasses}
                                                datasource={expandedDatasource}
                                                datasourceConfig={expandedDatasourceConfig}
                                                datasourceDocs={datasourceDocs}
                                                isLoading={saveInProgress}
                                                onDatasourceChange={onDatasourceChange}
                                                onDatasourceConfigChange={onDatasourceConfigChange}
                                                onDatasourceDocChange={onDatasourceDocChange}
                                                onUpdateUploadDatasource={onDatasourceUpdate}
                                                onUpdateDatasourceDocs={onUpdateDatasourceDocs}
                                                onValidateDatasourceConfig={
                                                    onValidateDatasourceConfig
                                                }
                                                isUpdateDisabled={
                                                    isUpdateDisabled ||
                                                    expandedDatasource.name === ''
                                                }
                                            />
                                        )}
                                    </div>
                                    {item.type !== 'upload' && item.type !== 'csv' && (
                                        <div className={classes.actionPanel}>
                                            <Button
                                                className={configClasses.button}
                                                variant="contained"
                                                size="small"
                                                onClick={onDatasourceUpdate}
                                                disabled={
                                                    isUpdateDisabled ||
                                                    expandedDatasource.name === ''
                                                }
                                                title="update"
                                            >
                                                Update
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : null}
                        </ListItem>
                    );
                }
            })}
        </List>
    );
};

// eslint-disable-next-line no-unused-vars
export default function DataConfiguration({ appDatasources, fetchDataSources, copilotAppId }) {
    const classes = useStyles();
    const configClasses = copilotConfiguratorStyle();

    // const [appDatasources, setAppDatasources] = useState([]);
    const [dataSource, setDataSource] = useState({
        name: '',
        type: 'upload'
    });
    const [dataSourceConfig, setDataSourceConfig] = useState({});
    const [datasourceDocs, setDatasourceDocs] = useState([]);
    const [activeTab, setActiveTab] = React.useState('add');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [viewLoader, setViewLoader] = useState(false);
    const [isUpdateDisabled, setIsUpdateDisabled] = useState(true);
    const [isTabInputModified, setIsTabInputModified] = useState(false);

    const handleChangeTab = (event, activeTabIndex) => {
        if (activeTabIndex === 'add') {
            setDataSource({
                name: '',
                type: 'upload'
            });
            setDataSourceConfig({});
            setDatasourceDocs([]);
        }
        setActiveTab(activeTabIndex);
        setIsTabInputModified(false);
        setIsUpdateDisabled(true);
    };

    const handleDataSourceChange = (val, key) => {
        setDataSource({
            ...dataSource,
            [key]: val
        });
        setIsUpdateDisabled(false);
        setIsTabInputModified(true);
        if (key === 'type') {
            setDataSourceConfig({});
            setDatasourceDocs([]);
        }
    };

    const handleDataSourceConfigChange = (config) => {
        setDataSourceConfig(config);
        setIsUpdateDisabled(false);
        setIsTabInputModified(true);
    };

    const handleDatasourceDocChange = (docs) => {
        setDatasourceDocs(docs);
        setIsTabInputModified(true);
        if (dataSource.id) {
            setIsUpdateDisabled(false);
        }
    };

    const handleExpandDatasource = async (id, fetchDatasource = true) => {
        try {
            setIsTabInputModified(false);
            setIsUpdateDisabled(true);
            setViewLoader(true);
            if (fetchDatasource) {
                const datasourceData = await getCopilotAppDatasource({
                    copilotAppId: copilotAppId,
                    datasourceId: id
                });
                setDataSource({
                    ...datasourceData
                });
                setDataSourceConfig({
                    ...datasourceData.config
                });
            }
        } catch (err) {
            //
        } finally {
            setViewLoader(false);
        }
    };

    const handleDatasourceSave = () => {
        setIsLoading(true);
        createCopilotAppDatasource({
            payload: {
                ...dataSource,
                config: {
                    ...dataSourceConfig
                }
            },
            documents: datasourceDocs,
            copilotAppId: copilotAppId,
            callback: onResponseCreateDatasource
        });
    };

    const handleSnackbarActionClick = (e) => {
        handleChangeTab(e, 'view');
        setSnackbar({
            open: false
        });
    };

    const onResponseCreateDatasource = async (response_data, response_status) => {
        if (response_status === 200) {
            await fetchDataSources();
            setSnackbar({
                open: true,
                message: 'Datasource saved successfully',
                severity: 'success',
                autoHideDuration: 5000,
                actionText: 'View Added Datasource',
                onActionClick: handleSnackbarActionClick
            });
            // setActiveTab('view');
            setDataSource({
                name: '',
                type: 'upload'
            });
            setDataSourceConfig({});
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

    const handleDatasourceUpdate = () => {
        setIsUpdateDisabled(true);
        setIsLoading(true);
        updateCopilotAppDatasource({
            payload: {
                ...dataSource,
                config: {
                    ...dataSourceConfig
                }
            },
            documents: datasourceDocs,
            copilotAppId: copilotAppId,
            datasourceId: dataSource.id,
            callback: onResponseUpdateDatasource
        });
    };

    const onResponseUpdateDatasource = async (response_data, response_status) => {
        if (response_status === 200) {
            setDataSource({
                ...response_data
            });
            setDataSourceConfig({
                ...response_data.config
            });
            setDatasourceDocs([]);
            setSnackbar({
                open: true,
                message: 'Datasource updated successfully',
                severity: 'success',
                autoHideDuration: 3000
            });
            setIsLoading(false);
            setIsTabInputModified(false);
            await fetchDataSources();
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

    const handleUpdateDatasourceDocs = (updatedDatasource) => {
        setDataSource({
            ...updatedDatasource
        });
        setIsTabInputModified(true);
        if (dataSource.id) {
            setIsUpdateDisabled(false);
        }
    };
    const handleRemoveDatasource = async (datasourceId) => {
        try {
            await deleteCopilotAppDatasource(copilotAppId, datasourceId);
            setSnackbar({
                open: true,
                message: 'Datasource removed successfully!',
                severity: 'success'
            });
            await fetchDataSources();
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Failed to remove Datasource!',
                severity: 'error'
            });
        }
    };

    const handleDatasourceValidate = async () => {
        try {
            const payloadObj = {
                config: dataSourceConfig
            };
            let datasourceInputConfig = {};
            setSnackbar({
                open: true,
                message: 'Validating Configuration',
                severity: 'info',
                autoHideDuration: null
            });
            await validateCopilotDatasourceConfiguration(dataSource.type, { payload: payloadObj });
            if (dataSource.type === 'file_storage') {
                const key = 'file_storage_type';
                switch (dataSourceConfig[key]) {
                    case 'azure_blob_storage':
                        datasourceInputConfig = await fetchBlobContainers({ payload: payloadObj });
                        break;
                    case 'amazon_s3':
                        datasourceInputConfig = await fetchS3Buckets({ payload: payloadObj });
                        break;
                    default:
                    //no match
                }
            }
            setSnackbar({
                open: true,
                message: 'Validated Successfully',
                severity: 'success',
                autoHideDuration: 3000
            });
            return datasourceInputConfig;
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Error Validating Datasource Configuration',
                severity: 'error',
                autoHideDuration: 3000
            });
            throw err;
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
                            ? 'Switch to Add New Datasource'
                            : 'Switch to View Datasource'
                    }
                    cancelText={
                        activeTab === 'view'
                            ? 'Stay on View Datasource'
                            : 'Stay on Add New Datasource'
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
                            <Tab key="Add New Datasource" label="Add New Datasource" value="add" />
                            <Tab key="View Datasource" label="View Datasource" value="view" />
                        </TabList>
                    )}
                </ConfirmPopup>
                <TabPanel
                    value="add"
                    className={clsx(configClasses.tabPanel, classes.createTabPanel)}
                >
                    {/* <Typography variant="h5" className={clsx(configClasses.fontStyle2, classes.datasourceLabel)}>Datasource Type</Typography> */}
                    <CreateDataSource
                        classes={classes}
                        configClasses={configClasses}
                        datasource={dataSource}
                        datasourceConfig={dataSourceConfig}
                        datasourceDocs={datasourceDocs}
                        isLoading={isLoading}
                        onDatasourceChange={handleDataSourceChange}
                        onDatasourceConfigChange={handleDataSourceConfigChange}
                        onDatasourceDocChange={handleDatasourceDocChange}
                        onSaveSqlDatasource={handleDatasourceSave}
                        onSaveUploadDatasource={handleDatasourceSave}
                        onValidateDatasourceConfig={handleDatasourceValidate}
                        onSaveDatasource={handleDatasourceSave}
                    />
                </TabPanel>
                <TabPanel value="view" className={configClasses.tabPanel}>
                    {appDatasources.length === 0 ? (
                        <div className={classes.emptyStateContainer}>
                            <EmptyDatasourceListIcon className={classes.emptyStateIcon} />
                            <Typography variant="h3" className={configClasses.fontStyle2}>
                                Please add a data source to view here
                            </Typography>
                        </div>
                    ) : (
                        <DatasourceListView
                            classes={classes}
                            configClasses={configClasses}
                            datasourceList={appDatasources}
                            expandedDatasource={dataSource}
                            expandedDatasourceConfig={dataSourceConfig}
                            datasourceDocs={datasourceDocs}
                            loading={viewLoader}
                            isUpdateDisabled={isUpdateDisabled}
                            saveInProgress={isLoading}
                            onExpandDatasource={handleExpandDatasource}
                            onDatasourceChange={handleDataSourceChange}
                            onDatasourceConfigChange={handleDataSourceConfigChange}
                            onDatasourceDocChange={handleDatasourceDocChange}
                            onDatasourceUpdate={handleDatasourceUpdate}
                            onUpdateDatasourceDocs={handleUpdateDatasourceDocs}
                            onRemoveDatasource={handleRemoveDatasource}
                            onValidateDatasourceConfig={handleDatasourceValidate}
                        />
                    )}
                </TabPanel>
            </TabContext>

            <CustomSnackbar
                key={`datasource-snackbar-${snackbar.message}`}
                {...snackbar}
                onClose={() => {
                    setSnackbar({ open: false });
                }}
            />
        </div>
    );
}

function SQLDatabaseConfigurator({
    datasource,
    config,
    onChange,
    classes,
    configClasses,
    ...props
}) {
    const dbOptions = DataSourceTypeJSON.find((obj) => obj.value === 'sql')?.['options'];

    const handleDBChange = (type) => {
        config.database_type = type;
        onChange({ ...config });
    };
    const handleConfigChange = (value, key) => {
        config[key] = value;
        onChange({ ...config });
    };

    const handleSqlDatasourceSave = () => {
        props.onValidateAndSaveDatasource();
    };

    const dbType = config.database_type;
    const dbConnStr = config.context_db_connection_uri;
    const dbSchema = config.context_db_connection_schema;
    // const dataSourceName = config.dataSourceName || 'PostgreSQL Database 1';
    return (
        <div className={classes.sqldbRoot}>
            {!datasource.id && (
                <Fragment>
                    <Typography
                        variant="h5"
                        className={clsx(configClasses.fontStyle2, classes.dbInputLabel)}
                    >
                        Select Database
                    </Typography>
                    <div className={classes.sqldbOptionGroup}>
                        {dbOptions.map((el) => (
                            <div
                                className={
                                    datasource.id
                                        ? clsx(classes.sqldbOption, classes.dbOptionDisabled)
                                        : classes.sqldbOption
                                }
                                key={el.name}
                                onClick={() => handleDBChange(el.value)}
                            >
                                <div
                                    className={clsx(
                                        classes.dbIcon,
                                        el.value === dbType ? classes.sqldbOptionSelected : ''
                                    )}
                                >
                                    {el.icon}
                                </div>
                                <div
                                    className={clsx(
                                        classes.dbLabel,
                                        configClasses.fontStyle1,
                                        el.value === dbType ? classes.sqldbOptionSelected : ''
                                    )}
                                >
                                    {el.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </Fragment>
            )}
            <div className={classes.dataSourcesConfigContainer}>
                {dbType === 'postgresql' ? (
                    <div className={classes.dataSourceConfigItem}>
                        <div style={{ width: '100%' }}>
                            <InputLabel
                                id="datasource-connection-string"
                                className={configClasses.inputLabel}
                            >
                                Connection String{requiredField}
                            </InputLabel>
                            <TextField
                                classes={{ root: configClasses.formControl }}
                                size="small"
                                fullWidth
                                value={dbConnStr}
                                variant="outlined"
                                onChange={(e) =>
                                    handleConfigChange(e.target.value, 'context_db_connection_uri')
                                }
                                disabled={datasource?.id ? true : false}
                                placeholder="Add Connection String"
                            />
                        </div>
                        <div style={{ width: '100%' }}>
                            <InputLabel
                                id="datasource-connection-string"
                                className={configClasses.inputLabel}
                            >
                                Schema Name{requiredField}
                            </InputLabel>
                            <TextField
                                classes={{ root: configClasses.formControl }}
                                size="small"
                                fullWidth
                                value={dbSchema}
                                variant="outlined"
                                onChange={(e) =>
                                    handleConfigChange(
                                        e.target.value,
                                        'context_db_connection_schema'
                                    )
                                }
                                disabled={datasource?.id ? true : false}
                                placeholder="Add Schema"
                            />
                        </div>

                        <div className={classes.sqlDatasourceAction}>
                            <div style={{ flex: 1 }} />
                            {!datasource.id ? (
                                <Button
                                    variant="contained"
                                    className={configClasses.button}
                                    onClick={handleSqlDatasourceSave}
                                    disabled={!(dbConnStr && dbSchema && datasource.name)}
                                >
                                    Validate & Save
                                </Button>
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
