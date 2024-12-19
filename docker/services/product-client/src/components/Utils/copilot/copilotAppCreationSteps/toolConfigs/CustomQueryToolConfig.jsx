import {
    Checkbox,
    FormControl,
    IconButton,
    InputLabel,
    Link,
    MenuItem,
    Select,
    TextField,
    Tooltip,
    Typography,
    alpha,
    makeStyles,
    ListItemText,
    Grid
} from '@material-ui/core';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import copilotConfiguratorStyle from '../../styles/copilotConfiguratorStyle';
import clsx from 'clsx';
import { getContextLabel, requiredField } from '../../util';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import JSONEditor from '../JsonEditor';
import AddIcon from '@material-ui/icons/Add';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';
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
        // backgroundColor: alpha(theme.palette.text.white, 0.04)
    },
    title: {
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16.6),
        fontWeight: '500'
    },
    dataSourceSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(10.37)
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
    jsonEditor: {
        height: theme.layoutSpacing(140),
        border: '1px solid ' + alpha(theme.palette.primary.contrastText, 0.2),
        borderRadius: theme.layoutSpacing(4),
        // "& .decorationsOverviewRuler": {
        //     width: theme.layoutSpacing(8)
        // },
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

export default function CustomQueryToolConfig({
    toolData,
    llmModels,
    embeddingModels,
    onToolDataChange,
    onInputParamsChange,
    orchestrator,
    toolDatasourceList,
    onToolDatasourceChange,
    appDatasources,
    disabled,
    linkedContextList,
    onLinkedContextChange,
    appData
}) {
    const toolConfig = toolData?.config;
    const classes = useStyles();
    const configClasses = copilotConfiguratorStyle();
    const [additionalSettingOpen, setAdditionalSettingOpen] = useState(false);
    const [toolDatasources, setToolDatasources] = useState([]);
    const [contextsList, setContextsList] = useState([]);
    const { handlePrev } = useContext(CopilotToolConfiguratorContext);

    useEffect(() => {
        setToolDatasources([...toolDatasourceList]);
    }, [toolDatasourceList]);

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
        } else if (e.target.name !== 'output_summary') {
            onToolDataChange({
                ...toolData,
                config: {
                    ...toolConfig,
                    [e.target.name]: e.target.value
                }
            });
        } else {
            onToolDataChange({
                ...toolData,
                config: {
                    ...toolConfig,
                    [e.target.name]: e.target.checked
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

    const renderSelectedDatasourceName = (datasourceIds) => {
        return datasourceIds
            .map((datasourceId) => {
                const selectedDatasource = appDatasources.find((item) => item.id === datasourceId);
                return selectedDatasource?.name;
            })
            .join(', ');
    };

    const handleDatasourceChange = async (e) => {
        if (e.target.name === 'datasource_id') {
            onToolDatasourceChange(e.target.value.map((el) => ({ datasource_id: el })));
        }
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
                <div className={classes.dataSourceSection}>
                    <div>
                        <InputLabel
                            id="datasource"
                            className={
                                disabled
                                    ? clsx(configClasses.inputLabel, configClasses.fontOpacity60)
                                    : configClasses.inputLabel
                            }
                        >
                            Select Data Source
                        </InputLabel>
                        <FormControl
                            size="small"
                            variant="outlined"
                            className={configClasses.formControl}
                            fullWidth
                        >
                            <Select
                                size="small"
                                labelId="datasource"
                                value={toolDatasources?.map((el) => el?.datasource_id) || []}
                                name="datasource_id"
                                onChange={handleDatasourceChange}
                                // label="Select Datasource"
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
                                renderValue={(value) =>
                                    value
                                        ? renderSelectedDatasourceName(value)
                                        : 'Select Datasource'
                                }
                                disabled={disabled}
                            >
                                {appDatasources?.map((el) =>
                                    el.type !== 'storyboard_slidemaster' ? (
                                        <MenuItem key={el.id} value={el.id}>
                                            <Checkbox
                                                checked={
                                                    toolDatasources
                                                        ?.map((el) => el?.datasource_id)
                                                        ?.indexOf(el.id) > -1
                                                }
                                            />
                                            {el.name}
                                        </MenuItem>
                                    ) : null
                                )}
                            </Select>
                        </FormControl>
                    </div>
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
                                    {/* <InputLabel id="llm_model">Select LLM</InputLabel> */}
                                    <Select
                                        size="small"
                                        labelId="llm_model"
                                        value={toolConfig?.llm_model || ''}
                                        name="llm_model"
                                        onChange={handleToolConfigChange}
                                        // label="Select LLM"
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
                        <div className={classes.llmModel}>
                            <InputLabel
                                id="llm-config-2"
                                className={
                                    disabled
                                        ? clsx(
                                              configClasses.inputLabel,
                                              configClasses.fontOpacity60
                                          )
                                        : configClasses.inputLabel
                                }
                            >
                                Configure Embedding Model
                            </InputLabel>
                            <FormControl
                                size="small"
                                variant="outlined"
                                className={configClasses.formControl}
                                fullWidth
                            >
                                {/* <InputLabel id="llm_model">Select LLM</InputLabel> */}
                                <Select
                                    size="small"
                                    labelId="embedding_model"
                                    value={toolConfig?.embedding_model || ''}
                                    name="embedding_model"
                                    onChange={handleToolConfigChange}
                                    // label="Select LLM"
                                    fullWidth
                                    placeholder="Select Embedding Model"
                                    MenuProps={{
                                        MenuListProps: {
                                            classes: {
                                                root: configClasses.inputDropdownSelect
                                            }
                                        }
                                    }}
                                    disabled={disabled}
                                >
                                    {embeddingModels.map((el) => (
                                        <MenuItem key={el.id} value={el.id}>
                                            {el.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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

                        <div className={classes.descriptionSection}>
                            <InputLabel
                                id="llm_rule"
                                className={
                                    disabled
                                        ? clsx(
                                              configClasses.inputLabel,
                                              configClasses.fontOpacity60
                                          )
                                        : configClasses.inputLabel
                                }
                            >
                                Additional Schema Information and Context
                            </InputLabel>
                            <TextField
                                classes={{ root: configClasses.formControl }}
                                name="llm_rule"
                                variant="outlined"
                                multiline
                                minRows={2}
                                maxRows={5}
                                value={toolConfig?.llm_rule || ''}
                                onChange={handleToolConfigChange}
                                fullWidth
                                disabled={disabled}
                            />
                        </div>
                    </div>
                ) : null}
            </Fragment>
        </Fragment>
    );
}

// CustomQueryToolConfig.propTypes = {
//     tool: PropTypes.object.isRequired
// };
