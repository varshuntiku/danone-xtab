import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip,
    Typography,
    alpha,
    makeStyles
} from '@material-ui/core';
import { requiredField } from '../util';
import copilotConfiguratorStyle from '../styles/copilotConfiguratorStyle';
import { Fragment, useEffect, useState } from 'react';
import clsx from 'clsx';
import { ReactComponent as WarningIcon } from 'assets/img/warningIcon.svg';
import { ReactComponent as TipsIcon } from 'assets/img/tipsIcon.svg';
import AddIcon from '@material-ui/icons/Add';

import EditIcon from '@material-ui/icons/Edit';
import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(16),
        margin: theme.layoutSpacing(28, 0, 8),
        background: alpha(theme.palette.text.white, 0.04),
        padding: theme.layoutSpacing(24)
    },
    editFlowRoot: {
        padding: theme.layoutSpacing(0)
    },
    editOnRoot: {
        padding: theme.layoutSpacing(24)
    },
    actions: {
        display: 'flex',
        gap: theme.layoutSpacing(8),
        marginTop: theme.layoutSpacing(16)
    },
    orchestratorListItem: {
        display: 'block',
        width: 0,
        minWidth: 'inherit'
    },
    orchestratorSelectMenuPaper: {
        '& .MuiList-root': {
            minWidth: 'inherit',
            '& .MuiTypography-subtitle1': {
                fontWeight: 500,
                fontSize: theme.layoutSpacing(15),
                lineHeight: theme.layoutSpacing(20),
                color: theme.palette.text.default
            },
            '& .MuiTypography-subtitle2': {
                textWrap: 'wrap',
                fontWeight: 400,
                fontSize: theme.layoutSpacing(13),
                lineHeight: theme.layoutSpacing(16),
                color: theme.palette.text.default
            }
        }
    },
    header: {
        marginBottom: theme.layoutSpacing(24),
        '& .MuiTypography-h3': {
            fontWeight: 500,
            fontSize: theme.layoutSpacing(24),
            lineHeight: theme.layoutSpacing(28.8),
            fontFamily: theme.title.h1.fontFamily,
            color: theme.palette.text.default
        },
        '& .MuiTypography-body1': {
            textWrap: 'wrap',
            fontWeight: 400,
            fontSize: theme.layoutSpacing(18),
            lineHeight: theme.layoutSpacing(24),
            color: theme.palette.text.default
        }
    },
    warningMessage: {
        background: theme.palette.background.warningBg,
        padding: theme.layoutSpacing(16),
        borderRadius: theme.layoutSpacing(2),
        '& .MuiTypography-body1': {
            textWrap: 'wrap',
            fontWeight: 400,
            fontSize: theme.layoutSpacing(16),
            lineHeight: theme.layoutSpacing(24),
            color: theme.palette.text.purpleText
        },
        '& svg': {
            fill: theme.palette.text.purpleText,
            verticalAlign: 'text-bottom',
            marginRight: theme.layoutSpacing(8),
            width: theme.layoutSpacing(20),
            height: theme.layoutSpacing(20)
        }
    },
    editPreview: {
        padding: theme.layoutSpacing(12, 16),
        background: theme.palette.background.orchestratorBg,
        borderRadius: theme.layoutSpacing(2),
        '& .MuiTypography-body1': {
            textWrap: 'wrap',
            fontWeight: 500,
            fontSize: theme.layoutSpacing(16),
            lineHeight: theme.layoutSpacing(19.2),
            color: theme.palette.text.default
        },
        '& .MuiTypography-subtitle1': {
            textWrap: 'wrap',
            fontWeight: 400,
            fontSize: theme.layoutSpacing(13),
            lineHeight: theme.layoutSpacing(16),
            color: theme.palette.text.default
        }
    },
    editPreviewRow1: {
        display: 'flex',
        alignItems: 'center',
        '& .MuiButtonBase-root': {
            padding: theme.layoutSpacing(8)
        }
    },
    suggestion: {
        background: theme.palette.background.infoBg,
        padding: theme.layoutSpacing(16),
        borderRadius: theme.layoutSpacing(2),
        '& svg': {
            fill: theme.palette.text.default,
            verticalAlign: 'bottom',
            marginRight: theme.layoutSpacing(8),
            width: theme.layoutSpacing(24),
            height: theme.layoutSpacing(24)
        },
        '& .MuiTypography-body1': {
            textWrap: 'wrap',
            fontWeight: 500,
            fontSize: theme.layoutSpacing(14),
            lineHeight: theme.layoutSpacing(20),
            color: theme.palette.text.default
        }
    },
    warningTitle: {
        color: '#CC9025'
    },
    warningSubTitle: {
        '& .MuiTypography-body1': {
            fontWeight: 400,
            fontSize: theme.layoutSpacing(15),
            lineHeight: theme.layoutSpacing(20),
            letterSpacing: theme.layoutSpacing(0.35),
            color: theme.palette.text.default
        }
    },
    warningDialogPaper: {
        maxWidth: theme.layoutSpacing(514),
        '& .MuiDialogContent-root': {
            padding: theme.layoutSpacing(16)
        },
        '& .MuiDialogActions-root': {
            padding: theme.layoutSpacing(16)
        }
    },
    systemMessage: {
        display: 'flex',
        flexDirection: 'column'
    },
    systemMessageDesc: {
        fontWeight: 400,
        fontSize: theme.layoutSpacing(13),
        lineHeight: theme.layoutSpacing(15.6),
        letterSpacing: theme.layoutSpacing(0.5),
        color: theme.palette.text.default,
        paddingTop: theme.layoutSpacing(4)
    }
}));

export default function Orchestrator({
    orchestrators,
    onSaveOrchestrator,
    appData,
    llmModels,
    editFlow,
    mappedTools,
    onRemoveTools,
    onEditModeChange
}) {
    const classes = useStyles();
    const configClasses = copilotConfiguratorStyle();
    const [orchestratorObj, setOrchestratorObj] = useState({
        orchestrator_id: null,
        orchestrator_config: null
    });
    const [editOn, setEditOn] = useState(false);
    const [incompatibleTools, setIncompatibleTools] = useState([]);
    const [defaultSystemMessage, setDefaultSystemMessage] = useState('');

    useEffect(() => {
        setOrchestratorObj({
            orchestrator_id: appData.orchestrator_id,
            orchestrator_config: appData.orchestrator_config
        });
    }, [orchestrators, appData]);

    const suggested_lang_model = orchestrators.find(
        (el) => el.id == orchestratorObj.orchestrator_id
    )?.config?.suggested_lang_model;

    const suggestedLangModelName = llmModels.find((el) => el.id === suggested_lang_model)?.name;

    useEffect(() => {
        const incompatibleTools = mappedTools.filter((el) => {
            return !el.orchestrators?.includes(orchestratorObj.orchestrator_id);
        });
        setIncompatibleTools(incompatibleTools);
    }, [orchestratorObj.orchestrator_id]);

    useEffect(() => {
        setDefaultSystemMessage(
            orchestrators.find((el) => el.id === orchestratorObj.orchestrator_id)?.config
                ?.system_message
        );
    }, [orchestratorObj, orchestrators]);

    useEffect(() => {
        if (editFlow) {
            onEditModeChange(editOn);
        }
    }, [editFlow, editOn]);

    const handleOrchestratorChange = (id) => {
        const suggested_llm = orchestrators.find((el) => el.id == id)?.config?.suggested_lang_model;
        setOrchestratorObj((s) => ({
            ...s,
            orchestrator_id: id,
            orchestrator_config: {
                ...s.orchestrator_config,
                lang_model: suggested_llm || s.orchestrator_config?.lang_model || llmModels[0]?.id
            }
        }));
        // update convo_memory_enabled
        if (appData.orchestrator_id === id) {
            handleOrchestratorConfigChange(
                'convo_memory_enabled',
                appData.orchestrator_config?.convo_memory_enabled
            );
        } else {
            handleOrchestratorConfigChange('convo_memory_enabled', true);
        }
        // update system_message
        if (appData.orchestrator_id === id && appData.orchestrator_config?.system_message) {
            handleOrchestratorConfigChange(
                'system_message',
                appData.orchestrator_config?.system_message
            );
        } else {
            handleOrchestratorConfigChange('system_message', null);
        }
    };

    const handleOrchestratorConfigChange = (key, value) => {
        setOrchestratorObj((s) => ({
            ...s,
            orchestrator_config: {
                ...s.orchestrator_config,
                [key]: value
            }
        }));
    };

    const renderSelectedItem = (datasourceId) => {
        const orchestrator = orchestrators.find((item) => item.id === datasourceId);
        return orchestrator?.name;
    };
    const selectedOrchestrator = orchestrators.find(
        (el) => orchestratorObj.orchestrator_id == el.id
    );

    const handleSave = async () => {
        if (orchestratorObj.orchestrator_config?.system_message == null) {
            handleOrchestratorConfigChange('system_message', defaultSystemMessage);
        }
        try {
            onRemoveTools(incompatibleTools.map((el) => el.id));
            await onSaveOrchestrator(orchestratorObj);
            setEditOn(false);
        } catch {
            //** */
        }
    };

    const handleSaveButtonClick = (triggerConfirm) => {
        if (incompatibleTools.length) {
            triggerConfirm();
        } else {
            handleSave();
        }
    };

    const handleCancel = () => {
        setEditOn(false);
        setOrchestratorObj({
            orchestrator_id: appData.orchestrator_id,
            orchestrator_config: appData.orchestrator_config
        });
    };

    return (
        <div
            className={clsx(
                classes.root,
                editFlow ? classes.editFlowRoot : '',
                editOn ? classes.editOnRoot : ''
            )}
        >
            {!editFlow ? (
                <div className={classes.header}>
                    <Typography variant="h3" gutterBottom>
                        Select Orchestrator
                    </Typography>
                    <Typography variant="body1">
                        Your choice of orchestrator will shape the way your copilot operates. Select
                        the orchestrator that best aligns with your needs. This will help you to
                        select tools to complement your copilot setup.
                    </Typography>
                </div>
            ) : null}
            {editFlow && !editOn ? (
                <div className={classes.editPreview}>
                    <div className={classes.editPreviewRow1}>
                        <Typography variant="body1">{selectedOrchestrator?.name}</Typography>
                        <div style={{ flex: 1 }} />
                        <IconButton
                            onClick={() => {
                                setEditOn(true);
                            }}
                            size="medium"
                            title="Edit"
                        >
                            <EditIcon fontSize="large" />
                        </IconButton>
                    </div>
                    <div className={classes.editPreviewRow2}>
                        <Typography variant="subtitle1">{selectedOrchestrator?.desc}</Typography>
                    </div>
                </div>
            ) : null}
            {editFlow && editOn ? (
                <div className={classes.warningMessage}>
                    <Typography variant="body1">
                        <WarningIcon /> Changing the Orchestrator will impact the skill sets.
                    </Typography>
                </div>
            ) : null}
            {!editFlow || (editFlow && editOn) ? (
                <div>
                    <InputLabel className={configClasses.inputLabel}>
                        Orchestrator Type{requiredField}
                    </InputLabel>
                    <FormControl
                        size="small"
                        variant="outlined"
                        className={configClasses.formControl}
                        fullWidth
                    >
                        <Select
                            size="small"
                            value={orchestratorObj?.orchestrator_id || null}
                            name="orchestrator_id"
                            onChange={(e) => handleOrchestratorChange(e.target.value)}
                            fullWidth
                            MenuProps={{
                                MenuListProps: {
                                    classes: {
                                        root: clsx(configClasses.inputDropdownSelect)
                                    },
                                    autoFocus: false
                                },
                                classes: {
                                    paper: clsx(
                                        classes.orchestratorSelectMenuPaper,
                                        configClasses.selectMenuPaper
                                    )
                                },
                                anchorOrigin: {
                                    vertical: 'bottom',
                                    horizontal: 'left'
                                },
                                transformOrigin: {
                                    vertical: 'top',
                                    horizontal: 'left'
                                },
                                getContentAnchorEl: null
                            }}
                            displayEmpty={true}
                            renderValue={(value) =>
                                value ? renderSelectedItem(value) : 'Select Orchestrator'
                            }
                        >
                            {orchestrators?.map((el) => (
                                <MenuItem
                                    key={el.id}
                                    value={el.id}
                                    className={classes.orchestratorListItem}
                                >
                                    <Typography variant="subtitle1" gutterBottom>
                                        {el.name}
                                    </Typography>
                                    <Typography variant="subtitle2" noWrap={false}>
                                        {el.desc}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            ) : null}
            {(!editFlow || (editFlow && editOn)) && orchestratorObj.orchestrator_id ? (
                <div className={classes.systemMessage}>
                    <InputLabel id="system_message" className={configClasses.inputLabel}>
                        Message
                    </InputLabel>
                    <TextField
                        classes={{ root: configClasses.formControl }}
                        name="system_message"
                        variant="outlined"
                        multiline
                        minRows={2}
                        maxRows={2}
                        defaultValue={defaultSystemMessage}
                        value={
                            orchestratorObj?.orchestrator_config?.system_message == undefined
                                ? defaultSystemMessage
                                : orchestratorObj?.orchestrator_config?.system_message
                        }
                        onChange={(e) =>
                            handleOrchestratorConfigChange('system_message', e.target.value)
                        }
                        fullWidth
                        size="small"
                    />
                    <label className={classes.systemMessageDesc}>
                        We will help you get started, please feel free to make this your own
                    </label>
                </div>
            ) : null}
            {(!editFlow || (editFlow && editOn)) &&
            orchestratorObj.orchestrator_id &&
            suggestedLangModelName ? (
                <div className={classes.suggestion}>
                    <Typography variant="body1">
                        <TipsIcon /> We recommend <b>{suggestedLangModelName}</b> for the selected
                        orchestrator.
                    </Typography>
                </div>
            ) : null}
            {(!editFlow || (editFlow && editOn)) && orchestratorObj.orchestrator_id ? (
                <Fragment>
                    <div className={classes.llmModel}>
                        <InputLabel id="lang_model" className={configClasses.inputLabel}>
                            Model Type
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
                                    labelId="lang_model"
                                    value={orchestratorObj.orchestrator_config?.lang_model || null}
                                    name="lang_model"
                                    onChange={(e) =>
                                        handleOrchestratorConfigChange('lang_model', e.target.value)
                                    }
                                    // label="Select LLM"
                                    fullWidth
                                    placeholder="Select LLM"
                                    MenuProps={{
                                        MenuListProps: {
                                            classes: {
                                                root: configClasses.inputDropdownSelect
                                            }
                                        },
                                        anchorOrigin: {
                                            vertical: 'bottom',
                                            horizontal: 'left'
                                        },
                                        transformOrigin: {
                                            vertical: 'top',
                                            horizontal: 'left'
                                        },
                                        getContentAnchorEl: null
                                    }}
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
                                >
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                    <FormControlLabel
                        className={configClasses.formControlLabel}
                        control={
                            <Checkbox
                                checked={orchestratorObj.orchestrator_config?.convo_memory_enabled}
                                onChange={(e) =>
                                    handleOrchestratorConfigChange(
                                        'convo_memory_enabled',
                                        e.target.checked
                                    )
                                }
                                name="convo_memory_enabled"
                                size="large"
                            />
                        }
                        label="Save Conversational Memory"
                    />
                </Fragment>
            ) : null}
            {(!editFlow || (editFlow && editOn)) && orchestratorObj.orchestrator_id ? (
                <div className={classes.actions}>
                    <div style={{ flex: 1 }} />
                    {editFlow ? (
                        <Button
                            variant="text"
                            size="small"
                            onClick={handleCancel}
                            className={configClasses.button}
                        >
                            Cancel
                        </Button>
                    ) : null}
                    <ConfirmPopup
                        onConfirm={handleSave}
                        title="Warning"
                        classes={{
                            title: classes.warningTitle,
                            dialogPaper: classes.warningDialogPaper
                        }}
                        confirmText="Yes, Proceed"
                        cancelText="Cancel"
                        subTitle={
                            <div className={classes.warningSubTitle}>
                                <Typography variant="body1">
                                    Changing the orchestrator will remove the following configured
                                    skill sets that are not supported by OpenAI Function Based
                                    Orchestrator.
                                </Typography>
                                <ul>
                                    {incompatibleTools?.map((el) => (
                                        <li key={el.id}>
                                            <Typography variant="body1">{el.name}</Typography>
                                        </li>
                                    ))}
                                </ul>
                                <Typography variant="body1">
                                    Are you sure you want to proceed?
                                </Typography>
                            </div>
                        }
                        enableCloseButton
                    >
                        {(triggerConfirm) => (
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => {
                                    handleSaveButtonClick(triggerConfirm);
                                }}
                                className={configClasses.button}
                            >
                                Save Orchestrator
                            </Button>
                        )}
                    </ConfirmPopup>
                </div>
            ) : null}
        </div>
    );
}
