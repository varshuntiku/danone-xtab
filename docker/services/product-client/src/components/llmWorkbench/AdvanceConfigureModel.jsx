import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, MenuItem, TableCell, TextField, withStyles } from '@material-ui/core';
import Typography from 'components/elements/typography/typography';
import ModelConfigForm, { AdvancedField } from 'components/llmWorkbench/ModelConfigForm';
import configureModelStyle from 'assets/jss/llmWorkbench/configureModelStyle';
import {
    getAdvancedModelConfig,
    updateFineTunedModelAdvanvcedConfig
} from 'services/llmWorkbench/llm-workbench';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveFinetunedModel } from 'store';

export const StyledTableCell = withStyles((theme) => ({
    root: {
        textAlign: 'justify',
        color: theme.palette.text.default,
        fontSize: theme.spacing(1.5),
        border: 'none',
        padding: theme.spacing(2) + ' ' + theme.spacing(4),
        wordBreak: 'break-word',
        width: '50%'
    }
}))(TableCell);

const ConfigureModel = ({ action, classes }) => {
    const dispatch = useDispatch();
    const {
        fineTunedModel: { activeModel }
    } = useSelector((state) => state.llmWorkbench);
    const [error, setError] = useState({});
    const [trainingMethod, setTrainingMethod] = useState('');
    const [vm, setVm] = useState('');
    const [modelConfig, setModelConfig] = useState({
        advancedOptions: [],
        trainingMethods: [],
        commonOptions: []
    });
    const [commonConfig, setCommonConfig] = useState({});
    const [advancedOptions, setAdvancedOptions] = useState({});
    const [isConfigLoaded, setIsConfigLoaded] = useState(false);

    useEffect(() => {
        setIsConfigLoaded(() => false);
        loadModelConfig();
    }, []);

    const loadModelConfig = useCallback(async () => {
        const { data } = await getAdvancedModelConfig();
        setModelConfig({
            trainingMethods: data.training_methods,
            advancedOptions: data.training_methods[0].configuration,
            commonOptions: data.common,
            vmOptions: data.virtual_machine.options
        });

        const advancedOptions = {};
        const commonConfig = {};
        data.training_methods[0].configuration.map((option) => {
            if (option.defaultValue !== undefined) {
                advancedOptions[option.id] = option.defaultValue;
            }
        });

        data.common.map((option) => {
            if (option.defaultValue !== undefined) {
                commonConfig[option.id] = option.defaultValue;
            }
        });

        setAdvancedOptions(advancedOptions);
        setCommonConfig(commonConfig);

        setTrainingMethod(data.training_methods[0].id);
        setVm(data.virtual_machine.options[0].id);
        setError({});
        setIsConfigLoaded(() => true);
    }, []);

    const selectTrainingMethod = useCallback(
        (trainingMethod) => {
            setTrainingMethod(trainingMethod);
            const selectedTrainingMethod = modelConfig.trainingMethods.find(
                (method) => method.id === trainingMethod
            );
            selectedTrainingMethod?.configuration?.map((option) => {
                setError((error) => {
                    delete error?.[option.id];
                    return error;
                });
                if (option.defaultValue !== undefined) {
                    advancedOptions[option.id] = option.defaultValue;
                }
            });
            setModelConfig((modelConfig) => ({
                ...modelConfig,
                advancedOptions: selectedTrainingMethod?.configuration || []
            }));
        },
        [modelConfig]
    );

    const onCommonConfigChange = (id, value) => {
        setError((error) => {
            delete error?.[id];
            return error;
        });
        setCommonConfig((options) => ({
            ...options,
            [id]: value
        }));
    };

    const onAdvancedConfigChange = (id, value) => {
        setError((error) => {
            delete error?.[id];
            return error;
        });
        setAdvancedOptions((options) => ({
            ...options,
            [id]: value
        }));
    };

    const onVmChange = (value) => {
        setVm(value);
    };

    const next = async () => {
        const payload = {};
        const _error = {};
        setError(() => {});

        modelConfig.advancedOptions.map((option) => {
            if (advancedOptions[option.id]) {
                payload[option.id] = advancedOptions[option.id];
            } else if (option.type === 'toggle') {
                payload[option.id] = false;
            } else if (option.required) {
                _error[option.id] = `${option.label} is required`;
            } else {
                payload[option.id] = null;
            }
        });

        modelConfig.commonOptions.map((option) => {
            if (commonConfig[option.id]) {
                payload[option.id] = commonConfig[option.id];
            } else if (option.type === 'toggle') {
                payload[option.id] = false;
            } else if (option.required) {
                _error[option.id] = `${option.label} is required`;
            } else {
                payload[option.id] = null;
            }
        });

        if (Object.keys(_error).length) {
            setError(_error);
            return;
        }

        payload['vm_config'] = `${vm}`;
        payload['train_method'] = trainingMethod;

        await updateFineTunedModelAdvanvcedConfig({
            finetuned_model_id: activeModel.id,
            ...payload
        });

        dispatch(
            setActiveFinetunedModel({
                ...activeModel,
                advancedConfig: payload
            })
        );

        action.next();
    };

    return (
        <ModelConfigForm isLoading={!isConfigLoaded}>
            <ModelConfigForm.FormHeader>Advanced Configuration</ModelConfigForm.FormHeader>
            <ModelConfigForm.FormConfig>
                <Box display="flex" flexDirection="column" gridGap="0.5rem">
                    <Typography variant="h4">Training Method *</Typography>
                    <TextField
                        select
                        id="text"
                        variant="outlined"
                        size="small"
                        className={classes.textField}
                        InputProps={{
                            classes: {
                                input: classes.input
                            }
                        }}
                        value={trainingMethod}
                        onChange={({ target: { value } }) => selectTrainingMethod(value)}
                    >
                        {modelConfig.trainingMethods.map((method) => (
                            <MenuItem key={method.id} value={method.id}>
                                {method.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                <Box display="flex" flexDirection="column" gridGap="2rem">
                    {modelConfig.commonOptions.map((option) => (
                        <AdvancedField
                            key={option.label}
                            onChange={onCommonConfigChange}
                            disabled={false}
                            value={commonConfig?.[option.id]}
                            error={error}
                            {...option}
                        />
                    ))}
                </Box>
            </ModelConfigForm.FormConfig>
            <ModelConfigForm.FormAdvancedConfig
                onChange={onAdvancedConfigChange}
                options={modelConfig?.advancedOptions}
                values={advancedOptions}
                show={!!modelConfig?.advancedOptions?.length}
                error={error}
            />
            <ModelConfigForm.FormVMConfig
                options={modelConfig?.vmOptions}
                onChange={onVmChange}
                show={true}
                value={vm}
            />
            <ModelConfigForm.FormAction>
                <Button variant="outlined" onClick={action.previous} size="small">
                    Back
                </Button>
                <Button variant="contained" onClick={next} size="small">
                    Next
                </Button>
            </ModelConfigForm.FormAction>
        </ModelConfigForm>
    );
};

export default withStyles(configureModelStyle, { withTheme: true })(ConfigureModel);
