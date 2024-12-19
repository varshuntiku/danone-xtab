import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Container, TextField, Tooltip, withStyles } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import configureModelStyle from 'assets/jss/llmWorkbench/configureModelStyle';
import ModelConfigForm from 'components/llmWorkbench/ModelConfigForm';
import Typography from 'components/elements/typography/typography';
import { setActiveDeployedModel } from 'store';

const REGEX = /^[a-z0-9]*(-[a-z0-9]*)*[a-z0-9]$/;
const REGEX_INPUT = /^[a-z0-9-]+$/;

const ConfigureModel = ({ action, classes, isDeployed = false, ...props }) => {
    const { id, experiment_id, checkpoint_name } = props.match.params;
    const dispatch = useDispatch();
    const {
        deployedLLM: { activeModel }
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

    const next = async () => {
        if (!isDeployed) {
            setError(() => ({}));
            setLoading(() => true);
            const payload = {};
            const _error = {};
            const _name = name.trim();
            const _description = description.trim();
            if (!_name) {
                _error.name = 'Model name required for the deployment.';
            } else if (!REGEX.test(_name)) {
                _error.name = 'Invalid model name.';
            } else {
                try {
                    // await checkIfUniqueDeploymentName({ name: _name });
                } catch (error) {
                    if (error?.response?.status === 409) {
                        _error.name = error.response.data.split(' : ').pop();
                    } else {
                        _error.name = 'Error validating model name. Please try again later';
                    }
                }
            }

            if (Object.keys(_error).length) {
                setError(_error);
                setLoading(() => false);
                return;
            }

            payload.base_model_id = id;
            payload.name = _name;
            payload.description = _description;
            payload.deployment_type = 'basemodel';
            if (experiment_id) {
                payload.experiment_id = experiment_id;
                payload.deployment_type = 'experiment';
            }
            if (checkpoint_name) {
                payload.checkpoint_name = checkpoint_name;
                payload.deployment_type = 'checkpoint';
            }

            dispatch(setActiveDeployedModel(payload));
            setLoading(() => false);
        }
        action.next();
    };

    return (
        <Container maxWidth="100%" className={classes.container}>
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
                                    <Typography variant="h4" style={{ textTransform: 'None' }}>
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
                            inputProps={{
                                'data-testid': 'model-name'
                            }}
                            value={name}
                            onChange={({ target: { value } }) => {
                                if (REGEX_INPUT.test(value) || value === '') {
                                    setName(value);
                                }
                            }}
                            placeholder="Eg: my-model"
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
                            inputProps={{
                                'data-testid': 'model-description'
                            }}
                            multiline
                            minRows={4}
                            value={description}
                            disabled={isDeployed}
                            onChange={({ target: { value } }) => setDescription(value)}
                        />
                    </Box>
                </ModelConfigForm.FormConfig>
                <ModelConfigForm.FormAction>
                    <Button variant="outlined" onClick={action.previous} size="small">
                        Back
                    </Button>
                    <Button variant="contained" onClick={next} size="small" disabled={loading}>
                        Next
                    </Button>
                </ModelConfigForm.FormAction>
            </ModelConfigForm>
        </Container>
    );
};

export default withStyles(configureModelStyle, { withTheme: true })(ConfigureModel);
