import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, TextField, Tooltip, withStyles } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import configureModelStyle from 'assets/jss/llmWorkbench/configureModelStyle';
import ModelConfigForm from 'components/llmWorkbench/ModelConfigForm';
import { createFineTunedModel } from 'services/llmWorkbench/llm-workbench';
import { setActiveFinetunedModel } from 'store';
import CodxCircularLoader from 'components/CodxCircularLoader';
import Typography from 'components/elements/typography/typography';

const REGEX = /^[a-z][a-z0-9]*(-[a-z0-9]*)*[a-z]$/;
const REGEX_INPUT = /^[a-z0-9-]+$/;

const ConfigureModel = ({ action, isDeployed, classes, ...props }) => {
    const { id } = props.match.params;
    const dispatch = useDispatch();
    const {
        fineTunedModel: { activeModel }
    } = useSelector((state) => state.llmWorkbench);
    const [error, setError] = useState({});
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activeModel) {
            setName(activeModel.name);
            setDescription(activeModel.description);
        }
    }, [activeModel]);

    useEffect(() => {
        setError((error) => ({ ...error, name: null }));
    }, [name]);

    useEffect(() => {
        setError((error) => ({ ...error, description: null }));
    }, [description]);

    const next = async () => {
        if (!isDeployed) {
            setError(() => ({}));
            setLoading(() => true);
            const payload = {};
            const _error = {};
            const _name = name.trim();
            const _description = description.trim();
            if (!_name) {
                _error.name = 'Model name required';
            } else if (!REGEX.test(_name)) {
                _error.name = 'Invalid model name';
            } else {
                // try {
                //     await checkIfUniqueDeploymentName({ name: _name });
                // } catch (error) {
                //     if (error?.response?.status === 409) {
                //         _error.name = error.response.data.split(' : ').pop();
                //     } else {
                //         _error.name = 'Error validating model name. Please try again later';
                //     }
                // }
            }

            if (!_description) {
                _error.description = 'Description required';
            }

            if (Object.keys(_error).length) {
                setError(_error);
                setLoading(() => false);
                return;
            }

            payload.parent_model_id = id;
            payload.name = _name;
            payload.description = _description;

            const { data } = await createFineTunedModel(payload);
            dispatch(setActiveFinetunedModel(data));
            setLoading(() => false);
        }
        action.next();
    };

    return (
        <ModelConfigForm>
            <ModelConfigForm.FormHeader>Configure Model</ModelConfigForm.FormHeader>
            <ModelConfigForm.FormConfig>
                <Box display="flex" flexDirection="column" gridGap="0.5rem">
                    <Box display="flex" gridGap="0.5rem">
                        <Typography variant="h4" className={classes.label}>
                            Name*
                        </Typography>
                        <Tooltip
                            className="aaa"
                            title={
                                <Typography variant="h4">
                                    {
                                        "Should not contain upper case aphabets and special characters except '-', and should not end with numbers or '-'."
                                    }
                                </Typography>
                            }
                        >
                            <InfoIcon />
                        </Tooltip>
                    </Box>
                    <TextField
                        disabled={isDeployed}
                        variant="outlined"
                        size="small"
                        className={classes.textField}
                        required
                        InputProps={{
                            classes: {
                                underline: classes.underline,
                                input: classes.input
                            }
                        }}
                        value={name}
                        onChange={({ target: { value } }) => {
                            if (REGEX_INPUT.test(value) || value === '') {
                                setName(value);
                            }
                        }}
                    />
                    <span className={classes.error}>{error.name}</span>
                </Box>
                <Box display="flex" flexDirection="column" gridGap="0.5rem">
                    <Typography variant="h4" className={classes.label}>
                        Add Description
                    </Typography>
                    <TextField
                        variant="outlined"
                        size="small"
                        className={classes.textField}
                        InputProps={{
                            classes: {
                                input: classes.input
                            }
                        }}
                        multiline
                        minRows={4}
                        value={description}
                        disabled={isDeployed}
                        onChange={({ target: { value } }) => setDescription(value)}
                    />
                    <span className={classes.error}>{error.description}</span>
                </Box>
            </ModelConfigForm.FormConfig>
            <ModelConfigForm.FormAction>
                <Button
                    variant="outlined"
                    onClick={action.previous}
                    disabled={loading}
                    size="small"
                >
                    Back
                </Button>
                <Button variant="contained" onClick={next} size="small" disabled={loading}>
                    {loading ? <CodxCircularLoader size={24} /> : <>Next</>}
                </Button>
            </ModelConfigForm.FormAction>
        </ModelConfigForm>
    );
};

export default withStyles(configureModelStyle, { withTheme: true })(ConfigureModel);
