import React from 'react';
import {
    Button,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography
} from '@material-ui/core';
import CustomSnackbar from '../CustomSnackbar';
import { withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import CustomTextField from 'components/Forms/CustomTextField.jsx';
import {
    getExecEnvs,
    createNotebook,
    updateExecEnv,
    startExecEnv,
    stopExecEnv
} from 'services/admin_execution.js';

import { Close } from '@material-ui/icons';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import LowPriorityIcon from '@material-ui/icons/LowPriority';

import * as _ from 'underscore';

class NotebookActions extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            open: false,
            snackbar: {
                open: false
            },
            details: {
                project_id: props.execution?.project_id
                    ? props.execution?.project_id
                    : props.project_id,
                name: props.execution?.name ? props.execution.name : '',
                exec_env_id: props.execution?.exec_env_id ? props.execution.exec_env_id : false
            },
            notebook_id: props.execution?.id ? props.execution.id : false,
            exec_envs: []
        };
    }

    componentDidMount() {
        getExecEnvs({
            callback: this.onResponseExecEnvs
        });
    }

    onResponseExecEnvs = (response_data) => {
        this.setState({
            exec_envs: _.map(response_data, function (data_item) {
                return {
                    value: data_item.id,
                    label: data_item.name
                };
            })
        });
    };

    setOpen = (value) => {
        this.setState({
            open: value
        });
    };

    submit = () => {
        try {
            if (this.props.createNotebook) {
                createNotebook({
                    payload: this.state.details,
                    callback: this.onResponseCreateExecutionEnvironment
                });
            } else {
                updateExecEnv({
                    payload: this.state.details,
                    execution_environment_id: this.state.notebook_id,
                    callback: this.onResponseCreateExecutionEnvironment
                });
            }
        } catch (error) {
            this.handleUpdateResponse('Failed to complete action. Please try again.', 'error');
        }
    };

    onResponseCreateExecutionEnvironment = () => {
        const props = this.props;

        this.handleUpdateResponse('Updated Successfully');
        this.setOpen(false);

        this.setState({
            details: {
                name: props.execution?.name ? props.execution.name : '',
                requirements: props.execution?.requirements ? props.execution.requirements : ''
            },
            execution_environment_id: props.execution?.id ? props.execution.id : false
        });

        _.delay(
            () => {
                this.props.refreshData();
            },
            2000,
            ''
        );
    };

    handleUpdateResponse = (message, severity = 'success') => {
        this.setState((prevState) => ({
            snackbar: {
                ...prevState.snackbar,
                open: true,
                message: message,
                severity: severity
            }
        }));
    };

    onHandleFieldChange = (field_id, field_value) => {
        var details = this.state.details;

        details[field_id] = field_value;

        this.setState({
            details: details
        });
    };

    designAction = () => {
        return true;
    };

    stopExecEnv = () => {
        stopExecEnv({
            execution_environment_id: this.state.notebook_id,
            callback: this.onStopExecEnvResponse
        });
    };

    onStopExecEnvResponse = () => {
        _.delay(
            () => {
                this.props.refreshData();
            },
            200,
            ''
        );
    };

    startExecEnv = () => {
        startExecEnv({
            notebook_id: this.state.notebook_id,
            callback: this.onStartExecEnvResponse
        });
    };

    onStartExecEnvResponse = () => {
        _.delay(
            () => {
                this.props.refreshData();
            },
            200,
            ''
        );
    };

    render() {
        const { classes, createNotebook, designNotebook, iterationsNotebook } = this.props;

        return [
            designNotebook && (
                <IconButton
                    key={1}
                    title={'Design'}
                    href={'noteboooks/' + this.state.notebook_id + '/design'}
                    aria-label="Design"
                >
                    <AccountTreeIcon fontSize="large" />
                </IconButton>
            ),
            iterationsNotebook && (
                <IconButton
                    key={1}
                    title={'Iterations'}
                    href={'noteboooks/' + this.state.notebook_id + '/iterations'}
                    aria-label="Iterations"
                >
                    <LowPriorityIcon fontSize="large" />
                </IconButton>
            ),
            !createNotebook && !designNotebook && !iterationsNotebook && (
                <IconButton
                    key={1}
                    title="Manage User Role"
                    onClick={() => {
                        this.setOpen(true);
                    }}
                    aria-label="Manage"
                >
                    <EditOutlinedIcon fontSize="large" />
                </IconButton>
            ),
            createNotebook && (
                <Button
                    key={2}
                    variant="outlined"
                    className={classes.createNewButton}
                    onClick={() => {
                        this.setOpen(true);
                    }}
                    startIcon={<AddCircleOutlineOutlinedIcon />}
                    aria-label="Create new"
                >
                    Create New
                </Button>
            ),
            <Dialog
                key={3}
                open={this.state.open}
                fullWidth
                maxWidth="sm"
                onClose={() => {
                    this.setOpen(false);
                }}
                aria-labelledby="create-new-notebook"
                aria-describedby="notebook-content"
            >
                <DialogTitle className={classes.title} disableTypography id="create-new-notebook">
                    <Typography variant="h4" className={classes.heading}>
                        Create New Notebook
                    </Typography>
                    <IconButton
                        title="Close"
                        onClick={() => {
                            this.setOpen(false);
                        }}
                        style={{ position: 'absolute', top: '4px', right: 0 }}
                        className={classes.actionIcon}
                        aria-label="Close"
                    >
                        <Close fontSize="large" />
                    </IconButton>
                </DialogTitle>
                <DialogContent id="notebook-content">
                    <Grid key="form-body" container spacing={2}>
                        <Grid item xs>
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Notebook Name',
                                    id: 'name',
                                    fullWidth: true,
                                    value: this.state.details.name
                                }}
                            />
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Execution Environment',
                                    id: 'exec_env_id',
                                    fullWidth: true,
                                    is_select: true,
                                    options: this.state.exec_envs,
                                    selectProps: {
                                        value: this.state.details.exec_env_id
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                    ,
                </DialogContent>
                <DialogActions style={{ padding: '8px 24px 24px' }}>
                    <Button
                        className={classes.btn}
                        variant="outlined"
                        onClick={() => {
                            this.setOpen(false);
                        }}
                        aria-label="Cancel"
                    >
                        Cancel
                    </Button>
                    <Button
                        className={classes.btn}
                        variant="contained"
                        onClick={this.submit}
                        aria-label="Save"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>,
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
            />
        ];
    }
}

const styles = (theme) => ({
    paper: {
        background: theme.palette.primary.main
    },
    heading: {
        color: theme.palette.text.titleText,
        fontSize: '2.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8
    }
});

export default withStyles(
    (theme) => ({
        ...styles(theme),
        ...customFormStyle(theme)
    }),
    { withTheme: true }
)(NotebookActions);
