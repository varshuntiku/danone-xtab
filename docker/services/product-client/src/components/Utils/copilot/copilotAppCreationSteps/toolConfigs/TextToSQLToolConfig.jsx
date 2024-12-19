import {
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    Link,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Tooltip,
    Typography,
    makeStyles
} from '@material-ui/core';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { listTables } from 'services/minerva_utils';
import copilotConfiguratorStyle from '../../styles/copilotConfiguratorStyle';
import clsx from 'clsx';
import { getContextLabel, requiredField } from '../../util';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import JSONEditor from '../JsonEditor';
import AddIcon from '@material-ui/icons/Add';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import CopilotToolConfiguratorContext from '../../context/CopilotToolConfiguratorContextProvider';
import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';
import { getContextDetails } from 'services/copilotServices/copilot_context';
import { ReactComponent as DataMetaDataIcon } from 'assets/img/data-metadata-icon.svg';
import { ReactComponent as MetricsKPIIcon } from 'assets/img/metrics-kpi-icon.svg';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    toolConfigContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(20.74),
        padding: theme.layoutSpacing(16, 16, 28)
        // backgroundColor: alpha(theme.palette.text.white, 0.04)
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

export default function TextToSQLToolConfig({
    toolData,
    appDatasources,
    llmModels,
    onToolDataChange,
    toolDatasourceList,
    onToolDatasourceChange,
    onInputParamsChange,
    orchestrator,
    disabled,
    linkedContextList,
    onLinkedContextChange,
    appData
}) {
    const toolConfig = toolData?.config;
    const classes = useStyles();
    const configClasses = copilotConfiguratorStyle();

    const [additionalSettingOpen, setAdditionalSettingOpen] = useState(false);
    const [tables, setTables] = useState([]);
    const [contextsList, setContextsList] = useState([]);
    // const datSource = toolConfig.datasource;
    const [toolDatasource, setToolDatasource] = useState({});
    const { handlePrev } = useContext(CopilotToolConfiguratorContext);

    useEffect(() => {
        const fetchDatasourceTable = async () => {
            setTables([]);
            try {
                const datasource = appDatasources.find(
                    (el) => el.id == toolDatasource?.datasource_id
                );
                const data = await listTables({
                    connectionString: datasource.config.context_db_connection_uri,
                    schema: datasource.config.context_db_connection_schema
                });
                setTables(data);
            } catch {
                /** */
            }
        };
        fetchDatasourceTable();
    }, [toolDatasource?.datasource_id]);

    // fetch available contexts on initial load to show in link context dropdown
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

    useEffect(() => {
        if (toolDatasourceList?.length > 0) {
            setToolDatasource({ ...toolDatasourceList[0] });
        }
    }, [toolDatasourceList]);

    const handleToolConfigChange = async (e) => {
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

    const renderSelectedDatasourceName = (datasourceId) => {
        const selectedDatasource = appDatasources.find((item) => item.id === datasourceId);
        return selectedDatasource?.name;
    };

    const renderSelectedSQLTableName = (value) => {
        const table = value.map((val) => {
            return tables?.table_config?.find((item) => item.name === val)?.alias;
        });
        return table.join(', ');
    };

    const handleDatasourceChange = async (e) => {
        if (e.target.name === 'datasource_id') {
            onToolDatasourceChange([
                {
                    [e.target.name]: e.target.value,
                    config: {
                        datasource_type: 'sql'
                    }
                }
            ]);
        } else if (e.target.name === 'datasource_table') {
            onToolDatasourceChange([
                {
                    ...toolDatasource,
                    config: {
                        ...toolDatasource?.config,
                        [e.target.name]: e.target.value
                    }
                }
            ]);
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
                        item={3}
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
                <Fragment>
                    <div className={classes.dataSourceSection}>
                        {/* <FormControl component="fieldset">
                            <FormLabel component="legend" id="datasource_type" className={configClasses.title2}>
                                Select Data Source Type
                            </FormLabel>
                            <RadioGroup
                                aria-label="datasource_type"
                                name="datasource_type"
                                value={toolConfig['datasource_type'] || 'sql'}
                                onChange={handleToolConfigChange}
                            >
                                <FormControlLabel className={configClasses.formControlLabel} value="sql" control={<Radio />} label="SQL" /> */}
                        {/* <FormControlLabel value="csv" control={<Radio />} label=".CSV" /> */}
                        {/* </RadioGroup>
                        </FormControl> */}

                        <div>
                            <InputLabel
                                id="datasource"
                                className={
                                    disabled
                                        ? clsx(
                                              configClasses.inputLabel,
                                              configClasses.fontOpacity60
                                          )
                                        : configClasses.inputLabel
                                }
                            >
                                Select SQL Data Source{requiredField}
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
                                    value={toolDatasource?.datasource_id || null}
                                    name="datasource_id"
                                    onChange={handleDatasourceChange}
                                    // label="Select Datasource"
                                    fullWidth
                                    MenuProps={{
                                        MenuListProps: {
                                            classes: {
                                                root: configClasses.inputDropdownSelect
                                            }
                                        }
                                    }}
                                    displayEmpty={true}
                                    renderValue={(value) =>
                                        value
                                            ? renderSelectedDatasourceName(value)
                                            : 'Select Datasource'
                                    }
                                    disabled={disabled}
                                >
                                    {appDatasources
                                        .filter((el) => el.type === 'sql')
                                        ?.map((el) => (
                                            <MenuItem key={el.id} value={el.id}>
                                                {el.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <InputLabel
                                id="datasource_table"
                                className={
                                    disabled
                                        ? clsx(
                                              configClasses.inputLabel,
                                              configClasses.fontOpacity60
                                          )
                                        : configClasses.inputLabel
                                }
                            >
                                Select SQL Tables{requiredField}
                            </InputLabel>
                            <FormControl
                                size="small"
                                variant="outlined"
                                className={configClasses.formControl}
                                fullWidth
                                disabled={!toolDatasource?.datasource_id}
                            >
                                <Select
                                    size="small"
                                    labelId="datasource_table"
                                    value={toolDatasource?.config?.datasource_table || []}
                                    name="datasource_table"
                                    onChange={(e) => handleDatasourceChange(e)}
                                    // label="Data Table"
                                    multiple
                                    fullWidth
                                    MenuProps={{
                                        MenuListProps: {
                                            classes: {
                                                root: configClasses.inputDropdownSelect
                                            }
                                        },
                                        disableAutoFocusItem: true,
                                        // autoFocus: false,
                                        variant: 'menu'
                                    }}
                                    displayEmpty={true}
                                    renderValue={(value) =>
                                        value.length !== 0
                                            ? renderSelectedSQLTableName(value)
                                            : 'Select Table'
                                    }
                                    disabled={disabled}
                                >
                                    {tables.table_config?.map((el) => (
                                        <MenuItem key={el.id} value={el.name}>
                                            <Checkbox
                                                checked={
                                                    toolDatasource?.config?.datasource_table?.indexOf(
                                                        el.name
                                                    ) > -1
                                                }
                                            />
                                            {el.alias}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        {toolData?.tool_version_config?.enable_context ? (
                            <div>
                                <InputLabel
                                    id="context"
                                    className={
                                        disabled
                                            ? clsx(
                                                  configClasses.inputLabel,
                                                  configClasses.fontOpacity60
                                              )
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
                                            linkedContextList?.map(
                                                (el) => el?.context_datasource_id
                                            ) || []
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
                                                                title={getContextLabel(
                                                                    el?.context_type
                                                                )}
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
                                                                    {
                                                                        contextTypeIcons[
                                                                            el?.context_type
                                                                        ]
                                                                    }
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
                                                <a
                                                    className={classes.contextLink}
                                                    onClick={triggerConfirm}
                                                >
                                                    &quot;Onboard Context&quot;
                                                </a>{' '}
                                                to view or add context
                                            </Typography>
                                        </div>
                                    )}
                                </ConfirmPopup>
                            </div>
                        ) : null}
                        {toolData?.tool_version_config?.enable_context &&
                        linkedContextList.length > 0
                            ? renderLinkedContextChips()
                            : null}
                    </div>
                </Fragment>
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

                        <FormControlLabel
                            className={configClasses.formControlLabel}
                            control={
                                <Checkbox
                                    checked={!!toolConfig.output_summary}
                                    onChange={handleToolConfigChange}
                                    name="output_summary"
                                    size="large"
                                    disabled={disabled}
                                />
                            }
                            label="Enable Data Summary"
                        />

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

// TextToSQLToolConfig.propTypes = {
//     tool: PropTypes.object.isRequired
// };
