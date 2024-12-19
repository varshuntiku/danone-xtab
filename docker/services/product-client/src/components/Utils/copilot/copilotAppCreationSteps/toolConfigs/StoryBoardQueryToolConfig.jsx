import {
    FormControl,
    IconButton,
    InputLabel,
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Tooltip,
    Typography,
    alpha,
    makeStyles,
    Grid,
    Checkbox
} from '@material-ui/core';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import copilotConfiguratorStyle from '../../styles/copilotConfiguratorStyle';
import clsx from 'clsx';
import { getContextLabel, requiredField } from '../../util';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import JSONEditor from '../JsonEditor';
import AddIcon from '@material-ui/icons/Add';
import CopilotFileUpload from '../CopilotFileUpload';
import { getCopilotAppDatasource } from 'services/copilotServices/copilot_datasource';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import RestorePageIcon from '@material-ui/icons/RestorePage';
import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import CopilotToolConfiguratorContext from '../../context/CopilotToolConfiguratorContextProvider';
import { getContextDetails } from 'services/copilotServices/copilot_context';
import { ReactComponent as DataMetaDataIcon } from 'assets/img/data-metadata-icon.svg';
import { ReactComponent as MetricsKPIIcon } from 'assets/img/metrics-kpi-icon.svg';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    toolConfigContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(20.74),
        padding: theme.layoutSpacing(28, 16)
    },
    title: {
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16.6),
        fontWeight: '500'
    },
    additionalSettingsTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.layoutSpacing(10.37),
        cursor: 'pointer',
        '& $title': {
            textDecoration: 'underline'
        },
        '& svg': {
            fontSize: theme.layoutSpacing(31.104)
        },
        padding: theme.layoutSpacing(10.368)
    },
    titleMarginSpacing: {
        marginTop: theme.layoutSpacing(20.74),
        marginBottom: theme.layoutSpacing(12)
    },
    uploadedFileSectionLabel: {
        paddingTop: theme.layoutSpacing(23)
    },
    documentList: {
        maxHeight: theme.layoutSpacing(311.04),
        overflow: 'auto',
        gap: theme.layoutSpacing(16),
        display: 'flex',
        flexDirection: 'column',
        '& .MuiTypography-root': {
            fontSize: theme.layoutSpacing(16.6),
            color: alpha(theme.palette.text.default, 0.7)
        },
        '& .MuiListItemText-secondary': {
            fontSize: theme.layoutSpacing(12.442),
            opacity: '0.7'
        },
        '& .MuiListItem-root:hover': {
            background: theme.palette.background.hover
        },
        '& .MuiListItem-container .MuiListItem-root .MuiListItemIcon-root': {
            color: theme.palette.text.contrastText,
            padding: theme.layoutSpacing(0, 12)
        },
        '& .MuiListItem-root': {
            border: '1px solid',
            borderColor: alpha(theme.palette.border.loginGrid, 0.4),
            padding: theme.layoutSpacing(15, 12)
        }
    },
    iconBtn: {
        '& .MuiIconButton-label svg': {
            color: theme.palette.text.contrastText
        },
        '&:disabled svg': {
            opacity: 0.4,
            cursor: 'not-allowed'
        },
        '&.Mui-disabled': {
            cursor: 'not-allowed',
            pointerEvents: 'auto'
        }
    },
    jsonEditor: {
        height: theme.layoutSpacing(140),
        border: '1px solid ' + alpha(theme.palette.primary.contrastText, 0.2),
        borderRadius: theme.layoutSpacing(4),
        '& .monaco-scrollable-element>.invisible.fade': {
            width: theme.layoutSpacing(8) + '!important'
        },
        '& .monaco-scrollable-element > .scrollbar > .slider': {
            width: theme.layoutSpacing(8) + '!important',
            border: `1px solid ${theme.palette.primary.contrastText} !important`,
            borderRadius: theme.layoutSpacing(4),
            background: 'transparent !important'
        },
        '& .monaco-editor .vertical': {
            width: theme.layoutSpacing(8) + '!important'
        }
    },
    contextMsgContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.layoutSpacing(8),
        marginTop: theme.layoutSpacing(8)
    },
    contextMsg: {
        letterSpacing: '0.5px',
        color: theme.palette.text.contrastText
    },
    contextLink: {
        color: theme.palette.text.chooseFileText,
        fontWeight: 500,
        cursor: 'pointer'
    },
    contextOption: {
        display: 'flex',
        gap: theme.layoutSpacing(12),
        '& svg': {
            width: theme.layoutSpacing(19),
            height: theme.layoutSpacing(20),
            '& path': {
                stroke: theme.palette.text.contrastText
            },
            '& path:nth-of-type(6)': {
                fill: theme.palette.primary.main
            }
        }
    },
    selectedContextSection: {
        rowGap: theme.layoutSpacing(10.368),
        columnGap: theme.layoutSpacing(12),
        marginTop: theme.layoutSpacing(8)
    },
    addedContextItem: {
        backgroundColor: theme.palette.background.chipRevampBg,
        display: 'flex',
        alignItems: 'center',
        height: theme.layoutSpacing(32),
        fontSize: theme.layoutSpacing(14),
        color: 'white',
        borderRadius: theme.layoutSpacing(20.74),
        minWidth: theme.layoutSpacing(103.68),
        maxWidth: theme.layoutSpacing(228.1),
        justifyContent: 'space-between',
        cursor: 'default',
        gap: theme.layoutSpacing(8)
    },
    contextLabel: {
        color: theme.palette.text.revamp,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        flex: 1
    },
    closeIcon: {
        cursor: 'pointer',
        marginRight: theme.layoutSpacing(10.37),
        color: theme.palette.text.revamp
    },
    contextIcon: {
        flex: '0.2',
        display: 'flex',
        '& svg': {
            width: theme.layoutSpacing(15),
            height: theme.layoutSpacing(15),
            marginLeft: theme.layoutSpacing(10.37),
            '& path': {
                stroke: theme.palette.text.contrastText
            },
            '& path:nth-of-type(6)': {
                fill: theme.palette.primary.main
            }
        }
    }
}));

const contextTypeIcons = {
    data_metadata: <DataMetaDataIcon />,
    metrics_kpi: <MetricsKPIIcon />
};

export default function StoryBoardQueryToolConfig({
    toolData,
    llmModels,
    onToolDataChange,
    onInputParamsChange,
    orchestrator,
    disabled,
    onToolDataSourceModified,
    toolDatasourceList,
    toolDatasource,
    saveInProgress,
    linkedContextList,
    onLinkedContextChange,
    appData
}) {
    const toolConfig = toolData?.config;
    const classes = useStyles();
    const configClasses = copilotConfiguratorStyle();
    const [additionalSettingOpen, setAdditionalSettingOpen] = useState(false);
    const [storyBoardFiles, setStoryBoardFiles] = useState([]);
    const [storyBoardDocuments, setStoryBoardDocuments] = useState([]);
    let toolDatasourceInfo = toolDatasourceList.length > 0 ? { ...toolDatasourceList[0] } : null;
    const [contextsList, setContextsList] = useState([]);
    const { handlePrev } = useContext(CopilotToolConfiguratorContext);

    useEffect(() => {
        (async function () {
            try {
                if (toolDatasourceList.length > 0 && toolData?.copilot_app_id) {
                    const datasourceId = toolDatasourceList[0].datasource_id;
                    const datasourceData = await getCopilotAppDatasource({
                        copilotAppId: toolData?.copilot_app_id,
                        datasourceId: datasourceId
                    });
                    setStoryBoardDocuments(datasourceData.datasource_documents);
                }
            } catch (e) {
                /* empty */
            } finally {
                /* empty */
            }
        })();
    }, [toolDatasourceList]);

    useEffect(() => {
        if (saveInProgress) {
            setStoryBoardFiles([]);
        }
    }, [saveInProgress]);

    useEffect(() => {
        (async function () {
            if (toolData?.id && toolDatasource !== null) {
                if (!('datasource_documents' in toolDatasource)) {
                    const datasourceId = toolDatasource.id;
                    const datasourceData = await getCopilotAppDatasource({
                        copilotAppId: toolData?.copilot_app_id,
                        datasourceId: datasourceId
                    });
                    setStoryBoardDocuments(datasourceData.datasource_documents);
                } else {
                    if (!('documents' in toolDatasource)) {
                        setStoryBoardDocuments([...toolDatasource.datasource_documents]);
                    }
                }
            } else {
                setStoryBoardDocuments([]);
            }
        })();
    }, [toolDatasource]);

    useEffect(() => {
        const fetchAllContext = async () => {
            setContextsList([]);
            try {
                const contexts = await getContextDetails({ copilotAppId: appData?.id });
                setContextsList(contexts);
            } catch (error) {
                //
            }
        };
        fetchAllContext();
    }, []);

    const handleToolConfigChange = (e) => {
        if (e.target.name === 'desc') {
            onToolDataChange({
                ...toolData,
                [e.target.name]: e.target.value
            });
        } else {
            onToolDataChange({
                ...toolData,
                config: {
                    ...toolConfig,
                    [e.target.name]: e.target.value
                }
            });
        }
    };

    const handleAdditionalConfigChange = (v) => {
        onToolDataChange({
            ...toolData,
            config: {
                ...toolConfig,
                additional_config: v
            }
        });
    };

    const onStoryBoardDocumentChange = (docs) => {
        setStoryBoardFiles(docs);
        if (docs.length === 1 && storyBoardDocuments?.length > 0) {
            const updatedStoryBoardDocs = [...storyBoardDocuments];
            updatedStoryBoardDocs.map((el) => {
                el['disableRestore'] = true;
                el['deleted'] = true;
            });
            setStoryBoardDocuments([...updatedStoryBoardDocs]);
        } else if (docs.length === 0 && storyBoardDocuments?.length > 0) {
            const updatedStoryBoardDocs = [...storyBoardDocuments];
            updatedStoryBoardDocs.map((el) => {
                el['disableRestore'] = false;
                el['deleted'] = false;
            });
            setStoryBoardDocuments([...updatedStoryBoardDocs]);
        }
        onToolDataSourceModified(
            {
                name: docs[0].name,
                type: 'storyboard_slidemaster',
                config: {},
                documents: docs,
                datasource_documents: storyBoardDocuments
            },
            toolDatasourceInfo?.datasource_id
        );
    };

    const handleFileDelete = (e, i) => {
        const updatedStoryBoardDocs = [...storyBoardDocuments];
        updatedStoryBoardDocs[i].deleted = true;
        setStoryBoardDocuments(updatedStoryBoardDocs);
        onToolDataSourceModified(
            {
                name: updatedStoryBoardDocs[0].name,
                type: 'storyboard_slidemaster',
                config: {},
                datasource_documents: updatedStoryBoardDocs
            },
            toolDatasourceInfo?.datasource_id
        );
    };

    const handleFileRestore = (index) => {
        const updatedStoryBoardDocs = [...storyBoardDocuments];
        updatedStoryBoardDocs[index].deleted = false;
        onToolDataSourceModified(
            {
                name: updatedStoryBoardDocs[0].name,
                type: 'storyboard_slidemaster',
                config: {},
                datasource_documents: updatedStoryBoardDocs
            },
            toolDatasourceInfo?.datasource_id
        );
        setStoryBoardDocuments(updatedStoryBoardDocs);
    };

    const handleContextChange = (e) => {
        onLinkedContextChange(e.target.value?.map((el) => ({ context_datasource_id: el })));
    };

    const handleRemoveLinkedContext = (id) => {
        const updatedContextList = linkedContextList?.filter(
            (item) => item.context_datasource_id !== id
        );
        onLinkedContextChange(updatedContextList);
    };

    const renderLinkedContextChips = () => {
        const contextDetails = linkedContextList?.map((val) => {
            const contextItem = contextsList?.find((item) => item.id === val.context_datasource_id);
            return {
                context_type: contextItem?.context_type,
                context_name: contextItem?.context_name,
                id: contextItem?.id,
                name: contextItem?.name || null
            };
        });

        return (
            <Grid container className={classes.selectedContextSection} wrap="wrap">
                {contextDetails?.map((item, index) => (
                    <Grid
                        item
                        sm={3}
                        key={item.name + index}
                        className={classes.addedContextItem}
                        title={`${item?.context_name}${item?.name ? ' | ' + item?.name : ''}`}
                    >
                        <div className={classes.contextIcon}>
                            {contextTypeIcons[item?.context_type]}
                        </div>
                        <span className={classes.contextLabel}>{`${item?.context_name}${
                            item?.name ? ' | ' + item?.name : ''
                        }`}</span>
                        <CloseIcon
                            titleAccess="remove"
                            className={classes.closeIcon}
                            onClick={() => {
                                handleRemoveLinkedContext(item?.id);
                            }}
                        ></CloseIcon>
                    </Grid>
                ))}
            </Grid>
        );
    };

    return (
        <Fragment>
            <Typography
                variant="h4"
                className={clsx(configClasses.title1, classes.titleMarginSpacing)}
            >
                Configuration Settings/Fields
            </Typography>
            <div className={classes.toolConfigContainer}>
                <div className={classes.descriptionSection}>
                    <InputLabel
                        id="tool-desc"
                        className={
                            disabled
                                ? clsx(configClasses.inputLabel, configClasses.fontOpacity60)
                                : configClasses.inputLabel
                        }
                    >
                        Describe Business Objective of Skill Set{requiredField}
                    </InputLabel>
                    <TextField
                        classes={{ root: configClasses.formControl }}
                        name="desc"
                        variant="outlined"
                        multiline
                        minRows={2}
                        maxRows={5}
                        value={toolData?.desc || ''}
                        onChange={handleToolConfigChange}
                        fullWidth
                        size="small"
                        placeholder="Enter Skill Description"
                        disabled={disabled}
                    />
                </div>

                {toolData?.tool_version_config?.enable_context ? (
                    <div>
                        <InputLabel
                            id="context"
                            className={
                                disabled
                                    ? clsx(configClasses.inputLabel, configClasses.fontOpacity60)
                                    : configClasses.inputLabel
                            }
                        >
                            Link Context
                        </InputLabel>
                        <FormControl
                            size="small"
                            variant="outlined"
                            className={configClasses.formControl}
                            fullWidth
                        >
                            <Select
                                size="small"
                                labelId="context"
                                value={
                                    linkedContextList?.map((el) => el?.context_datasource_id) || []
                                }
                                name="context_datasource_id"
                                onChange={handleContextChange}
                                multiple
                                fullWidth
                                MenuProps={{
                                    MenuListProps: {
                                        classes: {
                                            root: configClasses.inputDropdownSelect
                                        }
                                    },
                                    disableAutoFocusItem: true,
                                    variant: 'menu'
                                }}
                                displayEmpty={true}
                                renderValue={() => 'Select Context'}
                                disabled={disabled}
                            >
                                {contextsList?.map((el) => (
                                    <MenuItem key={el.id} value={el.id}>
                                        <Checkbox
                                            checked={
                                                linkedContextList
                                                    ?.map((el) => el.context_datasource_id)
                                                    ?.indexOf(el.id) > -1
                                            }
                                        />
                                        <ListItemText
                                            primary={
                                                <span className={classes.contextOption}>
                                                    <Tooltip
                                                        title={getContextLabel(el?.context_type)}
                                                        classes={{
                                                            tooltip: clsx(
                                                                configClasses.iconTooltip,
                                                                configClasses.iconTooltipSmall
                                                            ),
                                                            arrow: configClasses.arrow
                                                        }}
                                                        arrow
                                                    >
                                                        <span>
                                                            {contextTypeIcons[el?.context_type]}
                                                        </span>
                                                    </Tooltip>
                                                    <Typography variant="h4">
                                                        {`${el?.context_name}${
                                                            el?.name ? ' | ' + el?.name : ''
                                                        }`}
                                                    </Typography>
                                                </span>
                                            }
                                        />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <ConfirmPopup
                            onConfirm={() => {
                                handlePrev();
                            }}
                            subTitle="The unsaved changes (if any) will be lost. Are you sure to exit the page?"
                            classes={{
                                dialogPaper: configClasses.confirmDialog
                            }}
                        >
                            {(triggerConfirm) => (
                                <div className={classes.contextMsgContainer}>
                                    <InfoOutlined fontSize="large" />
                                    <Typography
                                        variant="h4"
                                        className={clsx(
                                            configClasses.formControlLabel,
                                            classes.contextMsg
                                        )}
                                    >
                                        Can&apos;t find context? Go to{' '}
                                        <a className={classes.contextLink} onClick={triggerConfirm}>
                                            &quot;Onboard Context&quot;
                                        </a>{' '}
                                        to view or add context
                                    </Typography>
                                </div>
                            )}
                        </ConfirmPopup>
                    </div>
                ) : null}
                {toolData?.tool_version_config?.enable_context && linkedContextList.length > 0
                    ? renderLinkedContextChips()
                    : null}
            </div>

            <Fragment>
                <div
                    className={classes.additionalSettingsTitle}
                    onClick={() => setAdditionalSettingOpen((s) => !s)}
                >
                    {additionalSettingOpen ? (
                        <KeyboardArrowDownIcon fontSize="large" />
                    ) : (
                        <ChevronRightIcon fontSize="large" />
                    )}
                    <Link>
                        <Typography variant="h4" className={configClasses.linkActionButton}>
                            Additional Settings
                        </Typography>
                    </Link>
                </div>
                {additionalSettingOpen ? (
                    <div className={classes.toolConfigContainer}>
                        <div>
                            <CopilotFileUpload
                                acceptedFileExtensions={['.pptx', '.ppt']}
                                addedDocuments={storyBoardDocuments}
                                selectedFiles={storyBoardFiles}
                                required={false}
                                multiple={false}
                                onFileChange={onStoryBoardDocumentChange}
                                primaryLabel="Upload PPT Layout"
                                secondaryLabel="Added PPT Layout"
                            />
                            {storyBoardDocuments?.length > 0 && (
                                <Fragment>
                                    <Typography
                                        variant="h6"
                                        className={clsx(
                                            configClasses.inputLabel,
                                            classes.uploadedFileSectionLabel
                                        )}
                                    >
                                        Existing PPT Layout
                                    </Typography>
                                    <List className={classes.documentList}>
                                        {storyBoardDocuments?.map((item, i) => (
                                            <ListItem
                                                key={i}
                                                className={item.deleted ? classes.deletedDoc : ''}
                                            >
                                                <ListItemIcon>
                                                    <DescriptionOutlinedIcon fontSize="large" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={item.name}
                                                    secondary={item.deleted ? 'Deleted' : ''}
                                                />
                                                <ConfirmPopup
                                                    onConfirm={handleFileDelete}
                                                    title="Confirm Layout Deletion"
                                                    subTitle="If you delete this layout, the default PowerPoint layout will be used instead. Are you sure you want to proceed?"
                                                    confirmText="Proceed"
                                                    cancelText="Cancel"
                                                    classes={{
                                                        dialogPaper: configClasses.confirmDialog
                                                    }}
                                                    enableCloseButton
                                                >
                                                    {(triggerConfirm) => (
                                                        <ListItemSecondaryAction>
                                                            {item.deleted ? (
                                                                <IconButton
                                                                    edge="end"
                                                                    size="medium"
                                                                    title={
                                                                        item.disableRestore
                                                                            ? "can't be restored"
                                                                            : 'restore'
                                                                    }
                                                                    aria-label="restore"
                                                                    onClick={() =>
                                                                        handleFileRestore(i)
                                                                    }
                                                                    className={classes.iconBtn}
                                                                    disabled={
                                                                        item.disableRestore
                                                                            ? item.disableRestore
                                                                            : false
                                                                    }
                                                                >
                                                                    <RestorePageIcon fontSize="large" />
                                                                </IconButton>
                                                            ) : (
                                                                <IconButton
                                                                    edge="end"
                                                                    size="medium"
                                                                    title="delete"
                                                                    aria-label="delete"
                                                                    onClick={(e) => {
                                                                        if (storyBoardFiles === 0) {
                                                                            handleFileDelete(e, i);
                                                                        } else {
                                                                            triggerConfirm(i);
                                                                        }
                                                                    }}
                                                                    className={
                                                                        configClasses.deleteButton
                                                                    }
                                                                >
                                                                    <DeleteOutlineOutlinedIcon fontSize="large" />
                                                                </IconButton>
                                                            )}
                                                        </ListItemSecondaryAction>
                                                    )}
                                                </ConfirmPopup>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Fragment>
                            )}
                        </div>
                        <div className={classes.llmModel}>
                            <InputLabel
                                id="llm-config"
                                className={
                                    disabled
                                        ? clsx(
                                              configClasses.inputLabel,
                                              configClasses.fontOpacity60
                                          )
                                        : configClasses.inputLabel
                                }
                            >
                                Configure Language Model
                            </InputLabel>
                            <div className={configClasses.model}>
                                <FormControl
                                    size="small"
                                    variant="outlined"
                                    className={configClasses.formControl}
                                    fullWidth
                                >
                                    <Select
                                        size="small"
                                        labelId="llm_model"
                                        value={toolConfig?.llm_model || ''}
                                        name="llm_model"
                                        onChange={handleToolConfigChange}
                                        fullWidth
                                        placeholder="Select LLM"
                                        MenuProps={{
                                            MenuListProps: {
                                                classes: {
                                                    root: configClasses.inputDropdownSelect
                                                }
                                            }
                                        }}
                                        disabled={disabled}
                                    >
                                        {llmModels.map((el) => (
                                            <MenuItem key={el.id} value={el.id}>
                                                {el.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Tooltip
                                    title={'Create LLM'}
                                    classes={{
                                        tooltip: configClasses.iconTooltip,
                                        arrow: configClasses.arrow
                                    }}
                                    arrow
                                >
                                    <IconButton
                                        className={configClasses.addIconBtn}
                                        onClick={() => window.open('/llmworkbench', '_blank')}
                                        disabled={disabled}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>

                        {orchestrator?.config?.input_params_enabled ? (
                            <div className={classes.descriptionSection}>
                                <InputLabel
                                    id="input_params"
                                    className={
                                        disabled
                                            ? clsx(
                                                  configClasses.inputLabel,
                                                  configClasses.fontOpacity60
                                              )
                                            : configClasses.inputLabel
                                    }
                                >
                                    Set Input Params (JSON Data)
                                </InputLabel>
                                <JSONEditor
                                    classes={{ root: configClasses.formControl }}
                                    value={toolData?.input_params}
                                    onChange={onInputParamsChange}
                                    disabled={disabled}
                                />
                            </div>
                        ) : null}

                        <div className={classes.descriptionSection}>
                            <InputLabel
                                id="additional_config"
                                className={
                                    disabled
                                        ? clsx(
                                              configClasses.inputLabel,
                                              configClasses.fontOpacity60
                                          )
                                        : configClasses.inputLabel
                                }
                            >
                                Set Additional Configuration (JSON Data)
                            </InputLabel>
                            <JSONEditor
                                classes={{ root: configClasses.formControl }}
                                value={toolConfig?.additional_config}
                                onChange={handleAdditionalConfigChange}
                                disabled={disabled}
                            />
                        </div>
                    </div>
                ) : null}
            </Fragment>
        </Fragment>
    );
}

// StoryBoardQueryToolConfig.propTypes = {
//     tool: PropTypes.object.isRequired
// };
