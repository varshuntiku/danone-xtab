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
    createExecEnv,
    updateExecEnv,
    startExecEnv,
    stopExecEnv
} from 'services/admin_execution.js';

import { Close, CheckBox, CheckBoxOutlineBlank } from '@material-ui/icons';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import StopIcon from '@material-ui/icons/Stop';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

import * as _ from 'underscore';

class ExecutionEnvironmentActions extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            open: false,
            snackbar: {
                open: false
            },
            details: {
                name: props.execution_environment?.name ? props.execution_environment.name : '',
                requirements: props.execution_environment?.requirements
                    ? props.execution_environment.requirements
                    : '',
                config: props.execution_environment?.config
                    ? props.execution_environment.config
                    : {
                          codex_widget_factory: false,
                          cats: false
                      },
                py_version: props.execution_environment?.py_version
                    ? props.execution_environment.py_version
                    : '3.7.12',
                env_type: props.execution_environment?.env_type
                    ? props.execution_environment.env_type
                    : 'Azure Databricks',
                status: props.execution_environment?.status
                    ? props.execution_environment.status
                    : false
            },
            execution_environment_id: props.execution_environment?.id
                ? props.execution_environment.id
                : false
        };
    }

    setOpen = (value) => {
        this.setState({
            open: value
        });
    };

    submit = () => {
        try {
            if (this.props.createNewExecEnv) {
                createExecEnv({
                    payload: this.state.details,
                    callback: this.onResponseCreateExecutionEnvironment
                });
            } else {
                updateExecEnv({
                    payload: this.state.details,
                    execution_environment_id: this.state.execution_environment_id,
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
                name: props.execution_environment?.name ? props.execution_environment.name : '',
                requirements: props.execution_environment?.requirements
                    ? props.execution_environment.requirements
                    : '',
                config: props.execution_environment?.config
                    ? props.execution_environment.config
                    : {
                          codex_widget_factory: false,
                          cats: false
                      },
                env_type: props.execution_environment?.env_type
                    ? props.execution_environment.env_type
                    : 'Azure Databricks',
                py_version: props.execution_environment?.py_version
                    ? props.execution_environment.py_version
                    : '3.7.12'
            },
            execution_environment_id: props.execution_environment?.id
                ? props.execution_environment.id
                : false
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

    statusAction = () => {
        if (this.state.details.status) {
            if (this.state.details.status === 'RUNNING') {
                this.stopExecEnv();
            }
        } else {
            this.startExecEnv();
        }
    };

    stopExecEnv = () => {
        stopExecEnv({
            execution_environment_id: this.state.execution_environment_id,
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
            execution_environment_id: this.state.execution_environment_id,
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

    onClickLibraryCheckbox = (checkbox_id, checkbox_value) => {
        var details = this.state.details;
        details['config'][checkbox_id] = checkbox_value;

        this.setState({
            details: details
        });
    };

    render() {
        const { classes, createNewExecEnv, statusExecEnv } = this.props;

        return [
            statusExecEnv && (
                <IconButton
                    key={1}
                    title={this.state.details.status ? 'Stop' : 'Start'}
                    onClick={() => {
                        this.statusAction();
                    }}
                    aria-label={this.state.details.status ? 'Stop' : 'Start'}
                >
                    {this.state.details.status ? (
                        this.state.details.status === 'TERMINATED' ? (
                            <PlayCircleFilledIcon fontSize="large" />
                        ) : this.state.details.status === 'RUNNING' ? (
                            <StopIcon fontSize="large" />
                        ) : (
                            ''
                        )
                    ) : (
                        <PlayCircleFilledIcon fontSize="large" />
                    )}
                </IconButton>
            ),
            !createNewExecEnv && !statusExecEnv && (
                <IconButton
                    key={1}
                    title="Edit"
                    onClick={() => {
                        this.setOpen(true);
                    }}
                    aria-label="Edit"
                >
                    <EditOutlinedIcon fontSize="large" />
                </IconButton>
            ),
            createNewExecEnv && (
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
                aria-labelledby="create-new-execution-env"
                aria-describedby="execution-env-content"
            >
                <DialogTitle
                    className={classes.title}
                    disableTypography
                    id="create-new-execution-env"
                >
                    <Typography variant="h4" className={classes.heading}>
                        Create New Execution Env
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
                <DialogContent id="execution-env-content">
                    <Grid key="form-body" container spacing={2}>
                        <Grid item xs>
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Environment Name',
                                    id: 'name',
                                    fullWidth: true,
                                    value: this.state.details.name
                                }}
                            />
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'PY Version',
                                    id: 'py_version',
                                    fullWidth: true,
                                    value: this.state.details.py_version,
                                    options: [
                                        { label: '3.7.12', value: '3.7.12' },
                                        { label: '3.7.10', value: '3.7.10' }
                                    ],
                                    is_select: true
                                }}
                            />
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Environment Type',
                                    id: 'env_type',
                                    fullWidth: true,
                                    value: this.state.details.env_type,
                                    options: [
                                        { label: 'Azure Databricks', value: 'Databricks' },
                                        { label: 'Dynamic Viz', value: 'Dynamic Viz' }
                                    ],
                                    is_select: true
                                }}
                            />
                            {this.state.details.env_type !== 'Dynamic Viz'
                                ? ((
                                      <Typography variant="h4" className={classes.sectionHeading}>
                                          Select libraries to install:
                                      </Typography>
                                  ),
                                  (
                                      <Grid
                                          container
                                          className={classes.checkboxContainer}
                                          spacing={2}
                                      >
                                          <Grid item xs={1}>
                                              {this.state.details.config.codex_widget_factory ? (
                                                  <CheckBox
                                                      className={classes.checkboxIcon}
                                                      fontSize="large"
                                                      onClick={() =>
                                                          this.onClickLibraryCheckbox(
                                                              'codex_widget_factory',
                                                              false
                                                          )
                                                      }
                                                  />
                                              ) : (
                                                  <CheckBoxOutlineBlank
                                                      className={classes.checkboxIcon}
                                                      fontSize="large"
                                                      onClick={() =>
                                                          this.onClickLibraryCheckbox(
                                                              'codex_widget_factory',
                                                              true
                                                          )
                                                      }
                                                  />
                                              )}
                                          </Grid>
                                          <Grid item xs={5}>
                                              <Typography
                                                  variant="h4"
                                                  className={classes.checkboxLabel}
                                              >
                                                  codex-widget-factory
                                              </Typography>
                                          </Grid>
                                          <Grid item xs={1}>
                                              {this.state.details.config.cats ? (
                                                  <CheckBox
                                                      className={classes.checkboxIcon}
                                                      fontSize="large"
                                                      onClick={() =>
                                                          this.onClickLibraryCheckbox('cats', false)
                                                      }
                                                  />
                                              ) : (
                                                  <CheckBoxOutlineBlank
                                                      className={classes.checkboxIcon}
                                                      fontSize="large"
                                                      onClick={() =>
                                                          this.onClickLibraryCheckbox('cats', true)
                                                      }
                                                  />
                                              )}
                                          </Grid>
                                          <Grid item xs={5}>
                                              <Typography
                                                  variant="h4"
                                                  className={classes.checkboxLabel}
                                              >
                                                  cats
                                              </Typography>
                                          </Grid>
                                      </Grid>
                                  ))
                                : ((
                                      <CustomTextField
                                          parent_obj={this}
                                          field_info={{
                                              label: 'PY Version',
                                              id: 'py_version'
                                          }}
                                      />
                                  ),
                                  (
                                      <CustomTextField
                                          parent_obj={this}
                                          field_info={{
                                              label: 'Custom Python Requirements',
                                              id: 'requirements',
                                              fullWidth: true,
                                              inputProps: {
                                                  multiline: true,
                                                  rows: 10,
                                                  value: this.state.details.requirements
                                              }
                                          }}
                                      />
                                  ))}
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
    },
    sectionHeading: {
        color: theme.palette.text.titleText,
        fontSize: '2.25rem',
        letterSpacing: '0.1em',
        opacity: 0.8,
        paddingBottom: theme.spacing(1)
    },
    checkboxContainer: {
        padding: theme.spacing(1, 0)
    },
    checkboxLabel: {
        color: theme.palette.text.titleText,
        fontSize: '2rem',
        opacity: 0.8
    },
    checkboxIcon: {
        cursor: 'pointer'
    }
});

export default withStyles(
    (theme) => ({
        ...styles(theme),
        ...customFormStyle(theme)
    }),
    { withTheme: true }
)(ExecutionEnvironmentActions);
