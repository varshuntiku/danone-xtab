import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    Divider,
    Grid,
    Link,
    MenuItem,
    Slider,
    TextField,
    Tooltip,
    makeStyles,
    useTheme
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';

import Typography from 'components/elements/typography/typography';
import { setActiveFinetunedModel } from 'store/slices/llmWorkbenchSlice';
import { advancedConfigConstants, baseConfigConstants } from 'constants/llm-wrokbench';
import {
    getProblemType,
    getErrorMetrics,
    getPeftMethod,
    getLrSchedulerType,
    getQuantization,
    getBaseModels,
    validateFinetuneData
} from 'services/llmWorkbench/llm-workbench';
import { createFineTuneStyle } from 'assets/jss/llmWorkbench/createFineTuneStyle';

const useStyles = makeStyles(createFineTuneStyle);

const defaultAdvancedConfig = {
    peft_method: 'lora',
    lr_scheduler_type: 'cosine',
    gradient_acc_steps: 4,
    logging_steps: 1,
    lora_alpha: 16,
    lora_rank: 8,
    save_steps: 2,
    quantization: false
};

const fieldActions = {
    getProblemType,
    getBaseModels,
    getErrorMetrics,
    getPeftMethod,
    getLrSchedulerType,
    getQuantization
};

const DynamicFormInput = ({ field, fieldData, setFieldData, formData, changeConfig, error }) => {
    const classes = useStyles();
    const theme = useTheme();
    const hidden = !!field?.hidden?.(formData);
    const disabled = !!field?.disabled?.(formData) || hidden;
    switch (field.type) {
        case 'text':
            return (
                <Grid item xs={field.xs} container style={{ rowGap: theme.spacing(1) }}>
                    <Grid item xs={12}>
                        <Box display={'flex'} gridGap={theme.spacing(2)}>
                            <Typography
                                className={classes.text}
                                style={{ opacity: disabled ? 0.5 : 1 }}
                            >
                                <span>
                                    {field.label}
                                    {field?.required && <b className={classes.required}>*</b>}
                                </span>
                                {field.info && (
                                    <Tooltip
                                        placement="FollowCursor"
                                        title={
                                            <Typography variant="h4" className={classes.tooltip}>
                                                {field.info}
                                            </Typography>
                                        }
                                    >
                                        <InfoIcon />
                                    </Tooltip>
                                )}
                            </Typography>
                            <Typography className={clsx(classes.text, classes.error)}>
                                {error?.[field.id]}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} container direction="column">
                        <TextField
                            disabled={disabled}
                            value={formData?.[field.id]}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (field.regex) {
                                    if (field.regex.test(value) || value === '') {
                                        changeConfig(field.id, value);
                                    }
                                } else {
                                    changeConfig(field.id, value);
                                }
                            }}
                            placeholder={field.placeholder}
                            variant="outlined"
                            size="small"
                            style={{ opacity: disabled ? 0.5 : 1 }}
                            className={classes.textField}
                            error={error?.[field.id]}
                            InputProps={{
                                disabled,
                                classes: {
                                    input: classes.input
                                }
                            }}
                        />
                    </Grid>
                </Grid>
            );
        case 'number':
            return (
                <Grid item xs={field.xs} container style={{ rowGap: theme.spacing(1) }}>
                    <Grid item xs={12}>
                        <Box display={'flex'} gridGap={theme.spacing(2)}>
                            <Typography
                                className={classes.text}
                                style={{ opacity: disabled ? 0.5 : 1 }}
                            >
                                <span>
                                    {field.label}
                                    {field?.required && <b className={classes.required}>*</b>}
                                </span>
                                {field.info && (
                                    <Tooltip
                                        placement="FollowCursor"
                                        title={
                                            <Typography variant="h4" className={classes.tooltip}>
                                                {field.info}
                                            </Typography>
                                        }
                                    >
                                        <InfoIcon />
                                    </Tooltip>
                                )}
                            </Typography>
                            <Typography variant="h5" className={clsx(classes.text, classes.error)}>
                                {error?.[field.id]}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} container direction="column">
                        <TextField
                            variant="outlined"
                            size="small"
                            type="number"
                            placeholder={field.placeholder}
                            className={classes.textField}
                            InputProps={{
                                classes: {
                                    input: classes.input
                                }
                            }}
                            value={formData?.[field.id]}
                            onChange={(e) => changeConfig(field.id, parseFloat(e.target.value))}
                        />
                    </Grid>
                </Grid>
            );
        case 'select': {
            if (!fieldData[field.fetchValues]) {
                let fetchData = fieldActions[field?.fetchAction];
                if (!fetchData) {
                    fetchData = async () => [];
                }
                if (!Object.keys(fieldData).includes(field?.fetchValues)) {
                    fetchData().then((data) => {
                        setFieldData((fieldData) => ({
                            ...fieldData,
                            [field.fetchValues]: data
                        }));
                    });
                }
            }
            const options = fieldData[field.fetchValues] || [];
            return (
                <Grid item xs={field.xs} container style={{ rowGap: theme.spacing(1) }}>
                    <Grid item xs={12}>
                        <Box display={'flex'} gridGap={theme.spacing(2)}>
                            <Typography
                                className={classes.text}
                                style={{ opacity: disabled ? 0.5 : 1 }}
                            >
                                <span>
                                    {field.label}
                                    {field?.required && <b className={classes.required}>*</b>}
                                </span>
                                {field.info && (
                                    <Tooltip
                                        placement="FollowCursor"
                                        title={
                                            <Typography variant="h4" className={classes.tooltip}>
                                                {field.info}
                                            </Typography>
                                        }
                                    >
                                        <InfoIcon />
                                    </Tooltip>
                                )}
                            </Typography>
                            <Typography variant="h5" className={clsx(classes.text, classes.error)}>
                                {error?.[field.id]}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} container direction="column">
                        <TextField
                            select
                            disabled={disabled}
                            value={formData?.[field.id]}
                            onChange={(e) => changeConfig(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            style={{ opacity: disabled ? 0.5 : 1 }}
                            InputProps={{
                                disabled,
                                classes: {
                                    input: classes.input
                                }
                            }}
                        >
                            {options.map((option) => (
                                <MenuItem
                                    className={classes.menuItem}
                                    value={option.id}
                                    key={option.id}
                                >
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            );
        }
        case 'slider': {
            return (
                <Grid item xs={field.xs} container style={{ rowGap: theme.spacing(1) }}>
                    <Grid item xs={12}>
                        <Box display={'flex'} gridGap={theme.spacing(2)}>
                            <Typography
                                className={classes.text}
                                style={{ opacity: disabled ? 0.5 : 1 }}
                            >
                                <span>
                                    {field.label}
                                    {field?.required && <b className={classes.required}>*</b>}
                                </span>
                                {field.info && (
                                    <Tooltip
                                        placement="FollowCursor"
                                        title={
                                            <Typography variant="h4" className={classes.tooltip}>
                                                {field.info}
                                            </Typography>
                                        }
                                    >
                                        <InfoIcon />
                                    </Tooltip>
                                )}
                            </Typography>
                            <Typography variant="h5" className={clsx(classes.text, classes.error)}>
                                {error?.[field.id]}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} container>
                        <Grid item xs={9} style={{ paddingRight: theme.spacing(1) }}>
                            <Slider
                                className={classes.simulatorSliderInput}
                                classes={{
                                    root: classes.sliderRoot,
                                    markLabel: classes.markLabel,
                                    thumb: classes.thumb
                                }}
                                valueLabelDisplay="auto"
                                step={field.step}
                                min={field?.min}
                                max={field?.max}
                                value={formData?.[field.id]}
                                onChange={(_, value) => changeConfig(field.id, value)}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={3}
                            container
                            direction="column"
                            style={{ paddingLeft: theme.spacing(1) }}
                        >
                            <TextField
                                type="number"
                                variant="outlined"
                                size="small"
                                className={classes.textField}
                                value={formData?.[field.id]}
                                onChange={(e) => changeConfig(field.id, parseFloat(e.target.value))}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            );
        }
        default:
            return null;
    }
};

const validateData = (field, formData) => {
    switch (field.type) {
        case 'text':
        case 'select':
            if (!formData[field.id]) {
                return `${field.label} is rerquired`;
            }
            if (field?.validateRegex && !field.validateRegex.test(formData.name)) {
                return 'Invalid experiment name';
            }
            break;
        case 'slider':
        case 'number':
            if (isNaN(formData[field.id])) {
                return `Should be a valid number`;
            } else if (isNaN(field.max)) {
                if (formData[field.id] < field.min) {
                    return `Should be greater than or equal to ${field.min}`;
                }
            } else if (formData[field.id] < field.min || formData[field.id] > field.max) {
                return `Should be in the range ${field.min}, ${field.max}`;
            }
            break;
    }
    return null;
};

const AdvancedConfigDialog = ({
    open,
    setOpen,
    settings,
    changeConfig: change,
    reset,
    fieldData,
    setFieldData
}) => {
    const formData = settings;
    const [error, setError] = useState({});
    const theme = useTheme();
    const classes = useStyles();
    useEffect(() => {
        change('quantization', settings.peft_method === 'qlora', true);
    }, [settings.peft_method]);
    const changeConfig = (name, value) => {
        setError((error) => ({ ...error, [name]: '' }));
        change(name, value, true);
    };
    const save = () => {
        const _error = {};
        advancedConfigConstants.forEach((field) => {
            if (field.required && field.id !== 'quantization') {
                const errorMessage = validateData(field, formData);
                if (errorMessage) {
                    _error[field.id] = errorMessage;
                }
            }
        });
        if (formData['peft_method'] === 'qlora' && !formData['quantization']) {
            _error['quantization'] = 'Quantization is required for PEFT method QLora';
        }
        setError(_error);
        if (Object.values(_error).length) {
            return;
        }
        setOpen(false);
    };
    const resetData = () => {
        setError({});
        reset();
    };
    return (
        <Dialog
            fullWidth
            style={{
                maxWidth: theme.spacing(150),
                margin: 'auto'
            }}
            classes={{ paper: classes.paper }}
            open={open}
        >
            <Box
                padding={theme.spacing(8)}
                display="flex"
                flexDirection="column"
                gridGap={theme.spacing(4)}
            >
                <Box display="flex" flexDirection="column" gridGap={theme.spacing(1)}>
                    <Typography className={clsx(classes.text, classes.secTitle)}>
                        Advance Configurations
                    </Typography>
                    <Typography className={clsx(classes.text, classes.secInfo)}>
                        In this section, you can modify the advanced parameters.
                    </Typography>
                    <Divider />
                </Box>
                <Grid container spacing={4}>
                    {advancedConfigConstants.map((field) => (
                        <DynamicFormInput
                            key={field.id}
                            field={field}
                            formData={formData}
                            changeConfig={changeConfig}
                            fieldData={fieldData}
                            setFieldData={setFieldData}
                            error={error}
                        />
                    ))}
                </Grid>
                <Box display="flex" gridGap={theme.spacing(2)} justifyContent="end">
                    <Button variant="outlined" onClick={resetData}>
                        Reset
                    </Button>
                    <Button variant="contained" onClick={save}>
                        Save
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

const ModelConfig = ({ action }) => {
    const dispatch = useDispatch();
    const {
        fineTunedModel: { activeModel }
    } = useSelector((state) => state.llmWorkbench);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        problem_type: 'mcqa',
        base_model_id: null,
        test_size: 0.2,
        batch_size: 1,
        epochs: 2,
        error_metric_type: 'exactness_match',
        learning_rate: 0.0005,
        max_tokens: 1024,
        settings: defaultAdvancedConfig
    });
    const [fieldData, setFieldData] = useState({});

    const classes = useStyles();
    const theme = useTheme();

    useEffect(() => {
        setFormData((formData) => ({ ...formData, ...activeModel }));
    }, [activeModel]);

    const changeConfig = (config, value, isAdvanced = false) => {
        setError((error) => ({ ...error, [config]: '' }));
        setFormData((formData) => {
            if (isAdvanced) {
                return {
                    ...formData,
                    settings: {
                        ...formData.settings,
                        [config]: value
                    }
                };
            }
            return {
                ...formData,
                [config]: value
            };
        });
    };

    const saveData = async () => {
        const _error = {};
        baseConfigConstants.forEach((baseConfig) => {
            baseConfig.fields.forEach((field) => {
                if (field.required) {
                    const errorMessage = validateData(field, formData);
                    if (errorMessage) {
                        _error[field.id] = errorMessage;
                    }
                }
            });
        });
        if (!_error.name && formData.base_model_id) {
            try {
                await validateFinetuneData(formData);
            } catch (error) {
                _error.name = 'Experiment name already taken.';
            }
        }
        setError(_error);
        if (Object.values(_error).length) {
            return;
        }
        dispatch(setActiveFinetunedModel({ ...activeModel, ...formData }));
        action.next();
    };

    return (
        <>
            <AdvancedConfigDialog
                open={open}
                setOpen={setOpen}
                settings={formData.settings}
                changeConfig={changeConfig}
                reset={() => changeConfig('settings', defaultAdvancedConfig)}
                fieldData={fieldData}
                setFieldData={setFieldData}
            />
            <Box
                maxHeight={'100%'}
                width={'100%'}
                paddingX={theme.spacing(6)}
                paddingBottom={theme.spacing(20)}
                display="flex"
                flexDirection="column"
                gridGap={theme.spacing(2)}
                position="relative"
            >
                <Typography className={clsx(classes.text, classes.stpperTitle)}>
                    Model Config
                </Typography>
                {baseConfigConstants.map((baseConfig) => (
                    <>
                        <Divider />
                        <Grid container spacing={4}>
                            <Grid item xs={2} container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography className={clsx(classes.text, classes.secTitle)}>
                                        {baseConfig.label}
                                    </Typography>
                                </Grid>
                                <Grid item container>
                                    <Grid xs={11}>
                                        <Typography className={clsx(classes.text, classes.secInfo)}>
                                            {baseConfig.description}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={10} container spacing={3} wrap>
                                {baseConfig.fields.map((field) => (
                                    <DynamicFormInput
                                        key={field.id}
                                        field={field}
                                        formData={formData}
                                        changeConfig={changeConfig}
                                        fieldData={fieldData}
                                        setFieldData={setFieldData}
                                        error={error}
                                    />
                                ))}
                            </Grid>
                        </Grid>
                    </>
                ))}
                <Divider />
                <Grid container spacing={4} style={{ marginBottom: theme.spacing(20) }}>
                    <Grid item xs={2} container direction="column" spacing={1}>
                        <Grid item>
                            <Typography className={clsx(classes.text, classes.secTitle)}>
                                Advance Configurations
                            </Typography>
                        </Grid>
                        <Grid item container>
                            <Grid xs={11}>
                                <Typography className={clsx(classes.text, classes.secInfo)}>
                                    In this section, you can modify the advanced parameters.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={10} container spacing={2} direction="column">
                        <Grid item container spacing={10}>
                            <Grid item xs={6} container spacing={1}>
                                <Grid item xs={12}>
                                    <Link
                                        className={classes.advanced}
                                        onClick={() => setOpen(true)}
                                    >
                                        <SettingsIcon /> Additional Settings
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Box
                    flex={1}
                    display="flex"
                    gridGap={theme.spacing(2)}
                    alignItems="end"
                    justifyContent="end"
                    position="fixed"
                    bottom={0}
                    padding={theme.spacing(3)}
                    width={`calc(82.5% - ${theme.spacing(8)})`}
                >
                    <Button variant="outlined" size="small" onClick={action.previous}>
                        Cancel
                    </Button>
                    <Button variant="contained" size="small" onClick={saveData}>
                        Save & Next
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default ModelConfig;
