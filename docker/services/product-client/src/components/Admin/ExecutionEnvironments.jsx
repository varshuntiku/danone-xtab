import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Button, withStyles, Paper, alpha } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
// import PlayCircleIcon from '@material-ui/icons/PlayCircleFilled';
// import RestoreOutlined from '@material-ui/icons/RestoreOutlined';
import CustomSnackbar from '../CustomSnackbar';
import CustomTextField from 'components/Forms/CustomTextField.jsx';
import {
    getDynamicExecEnvs,
    startDynamicExecEnv,
    updateDynamicExecEnvAppMapping,
    getDynamicExecEnvAppMapping
} from 'services/execution_environments_utils.js';

import * as _ from 'underscore';

const execEnvStyles = (theme) => ({
    topContainer: {
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'center',
        margin: `${theme.layoutSpacing(24)} 0 ${theme.layoutSpacing(38)}`,
        height: '100%'
    },
    root: {
        marginTop: '2rem'
    },
    container: {
        padding: '3rem'
    },
    paper: {
        border: `1px solid ${alpha(theme.palette.text.revamp, 0.1)}`,
        padding: theme.layoutSpacing(24),
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        justifyItems: 'center',
        borderRadius: 0,
        boxShadow: 'none',
        height: '80%'
    },
    header2Text: {
        color: theme.palette.text.default,
        fontSize: '1.6rem'
    },
    buttonContainer: {
        display: 'flex',
        gap: '1.6rem'
    },
    button: {
        textTransform: 'capitalize',
        fontFamily: theme.body.B1.fontFamily,
        fontSize: theme.layoutSpacing(16),
        fontWeight: 500,
        letterSpacing: theme.layoutSpacing(0.5)
    }
});

class AppAdminExecutionEnvironments extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.actionRef = React.createRef();
        this.state = {
            snackbar: {
                open: false
            },
            envDropdownOptions: [{ label: 'Loading...', value: 'No exec env' }],
            exec_env_id: null,
            selected_exec_env_id: null,
            dynamicExecEnvs: [],
            default_env_id: false
            // for Source Verison:
            // sourceDropdownOptions: [{label: "Preview", value: "preview"},{label: "Prod", value:"prod"}],
            // selectedSourceVersion: null,
            // currentApplicationVersion : this.props.app_info?.environment,
        };
    }

    componentDidMount() {
        this.fetchDynamicExecEnvList();
        this.fetchAppExecEnvMapping();
    }

    fetchAppExecEnvMapping = () => {
        getDynamicExecEnvAppMapping({
            appId: this.props.app_info.id,
            callback: this.onResponseFetchAppExecEnvMapping
        });
    };

    onResponseFetchAppExecEnvMapping = (response_data, status = 'success') => {
        if (status === 'error') {
            this.setSnackbarStatus('Failed to load execution environments', 'error');
        } else if (response_data?.dynamic_env_id) {
            this.setState({
                exec_env_id: response_data.dynamic_env_id,
                selected_exec_env_id: response_data.dynamic_env_id
            });
        }
    };

    fetchDynamicExecEnvList = () => {
        getDynamicExecEnvs({
            callback: this.onResponseGetDynamicExecEnvs,
            env_category: 'uiac_executor'
        });
    };

    onResponseGetDynamicExecEnvs = (response_data, status = 'success') => {
        try {
            if (status === 'error') {
                this.setSnackbarStatus('Failed to load execution environments', 'error');
                this.setState({
                    dynamicExecEnvs: [],
                    envDropdownOptions: []
                });
            } else {
                let dynamicExecEnvsList = [];
                let tempItems = [];
                let env_id = this.state.exec_env_id;
                let defaultEnvId = null;
                _.forEach(response_data, function (item) {
                    if (
                        item.env_type === 'default' &&
                        (item.status === 'Running' || item.status === 'running')
                    ) {
                        defaultEnvId = item.id;
                        if (!env_id) {
                            env_id = item.id;
                        }
                    }
                    dynamicExecEnvsList.push({
                        id: item.id,
                        name: item.name,
                        requirements: JSON.stringify(item.requirements, null, '\t'),
                        py_version: item.py_version
                    });
                    if (item.status === 'Running' || item.status === 'running') {
                        tempItems.push({
                            label: item.name,
                            value: item.id
                        });
                    }
                });

                if (!import.meta.env['REACT_APP_DEE_ENV_ENABLED']) {
                    tempItems.push({ label: 'Default - Product Server', value: 'No exec env' });
                }

                this.setState({
                    dynamicExecEnvs: dynamicExecEnvsList,
                    envDropdownOptions: tempItems
                });
                if (env_id !== this.state.exec_env_id) {
                    this.setState({
                        exec_env_id: env_id,
                        selected_exec_env_id: env_id
                    });
                }
                if (defaultEnvId !== this.state.default_env_id) {
                    this.setState({
                        default_env_id: defaultEnvId
                    });
                }
            }
        } catch (error) {
            this.setSnackbarStatus('Failed to load execution environments', 'error');
            this.setState({
                dynamicExecEnvs: [],
                envDropdownOptions: []
            });
        }
    };

    startDynamicExecEnvAction = () => {
        startDynamicExecEnv({
            id: this.state.exec_env_id,
            callback: this.onResponseStartDynamicExecEnv
        });
    };

    onResponseStartDynamicExecEnv = (status = 'success') => {
        if (status === 'error') {
            this.setSnackbarStatus('Failed to load execution environments', 'error');
        } else {
            this.setSnackbarStatus('Environment activated successfully');
        }
    };

    updateAppExecEnvMappingAction = (env_id = null) => {
        updateDynamicExecEnvAppMapping({
            callback: this.onResponseUpdateAppExecEnvMapping,
            payload: {
                exec_env_id:
                    env_id ||
                    (this.state.selected_exec_env_id !== 'No exec env'
                        ? this.state.selected_exec_env_id
                        : null),
                app_id: this.props.app_info.id
            }
        });
    };

    onResponseUpdateAppExecEnvMapping = (response_data, status = 'success') => {
        if (status === 'error') {
            this.setSnackbarStatus('Failed to update execution environments', 'error');
        } else {
            let envId =
                response_data.dynamic_env_id && response_data.dynamic_env_id > -1
                    ? response_data.dynamic_env_id
                    : this.state.default_env_id;
            this.setState({
                exec_env_id: envId,
                selected_exec_env_id: envId
            });
            this.setSnackbarStatus('Execution Environment updated');
        }
    };

    setSnackbarStatus = (message, severity = 'success') => {
        this.setState((prevState) => ({
            snackbar: {
                ...prevState.snackbar,
                open: true,
                message: message,
                severity: severity
            }
        }));
    };

    onHandleEnvChange = (field_id) => {
        this.setState({
            selected_exec_env_id: field_id
        });
    };

    onHandleSourceVersionChange = (field_id) => {
        this.setState({
            selectedSourceVersion: field_id
        });
    };

    render() {
        const { classes } = this.props;

        // var columns = [
        //   {
        //     header: 'Env name',
        //     type: 'String',
        //     key: 'name'
        //   },
        //   {
        //     header: 'Type',
        //     type: 'String',
        //     key: 'env_type'
        //   },
        //   {
        //     header: 'PY Version',
        //     type: 'String',
        //     key: 'py_version'
        //   },
        //   {
        //     header: 'Status',
        //     type: 'String',
        //     key: 'status'
        //   }
        // ];

        return (
            <div className={classes.topContainer}>
                <Paper className={classes.paper}>
                    <Typography className={classes.header2Text} variant="h4" gutterBottom>
                        Select an environment to run your application on
                    </Typography>

                    <CustomTextField
                        parent_obj={this}
                        key={this.state.selected_exec_env_id}
                        field_info={{
                            label: 'Select Execution Environment',
                            id: 'exec_env',
                            is_select: true,
                            fullWidth: true,
                            required: true,
                            disabled: this.props.editDisabled,
                            options: this.state.envDropdownOptions,
                            value:
                                this.state.selected_exec_env_id !== null
                                    ? this.state.selected_exec_env_id
                                    : 'No exec env',
                            onChange: this.onHandleEnvChange
                        }}
                    />

                    <div className={classes.buttonContainer}>
                        <Button
                            key="save-exec-env"
                            variant="contained"
                            className={classes.button}
                            disabled={
                                this.state.selected_exec_env_id === this.state.exec_env_id ||
                                this.props.editDisabled
                            }
                            onClick={() => this.updateAppExecEnvMappingAction()}
                            size="small"
                            startIcon={<SaveIcon fontSize="large" />}
                            aria-label="Save Enivronment"
                        >
                            Save Environment
                        </Button>
                        <Button
                            key="run-exec-env"
                            variant="contained"
                            className={classes.button}
                            disabled={
                                // this.state.selected_exec_env_id !== this.state.exec_env_id ||
                                // this.state.selected_exec_env_id === null ||
                                this.state.exec_env_id === this.state.default_env_id ||
                                this.props.editDisabled
                            }
                            // onClick={() => this.startDynamicExecEnvAction()}
                            onClick={() => this.updateAppExecEnvMappingAction(-1)}
                            size="small"
                            // startIcon={<RestoreOutlined fontSize="large" />}
                            aria-label="Start"
                        >
                            Reset to Default
                        </Button>
                    </div>
                </Paper>

                <CustomSnackbar
                    key={4}
                    open={this.state.snackbar.open}
                    message={this.state.snackbar.message}
                    autoHideDuration={2000}
                    onClose={() => {
                        this.setState({
                            snackbar: {
                                open: false
                            }
                        });
                    }}
                    severity={this.state.snackbar.severity}
                    data-testid="env-update-snackbar"
                />
            </div>
        );
    }
}

AppAdminExecutionEnvironments.propTypes = {
    app_info: PropTypes.object.isRequired,
    config: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.bool.isRequired])
};

export default withStyles(
    (theme) => ({
        ...execEnvStyles(theme)
    }),
    { withTheme: true }
)(AppAdminExecutionEnvironments);
