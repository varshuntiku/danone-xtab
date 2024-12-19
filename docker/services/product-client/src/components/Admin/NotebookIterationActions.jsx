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
import { Tabs, Tab } from '@material-ui/core';
import { createNotebookIteration, updateNotebookIteration } from 'services/admin_execution.js';

import FileUpload from 'components/dynamic-form/inputFields/fileUpload.jsx';
import Editor from '@monaco-editor/react';

import { Close } from '@material-ui/icons';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

import * as _ from 'underscore';

class NotebookIterationActions extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            open: false,
            snackbar: {
                open: false
            },
            details: {
                notebook_id: props.iteration?.notebook_id
                    ? props.iteration?.notebook_id
                    : props.notebook_id,
                name: props.iteration?.name ? props.iteration.name : '',
                config_params: props.iteration?.config_params
                    ? props.iteration.config_params
                    : false,
                config_df: props.iteration?.config_df ? props.iteration.config_df : false,
                config_code: props.iteration?.config_code ? props.iteration.config_code : false
            },
            iteration_id: props.iteration?.id ? props.iteration.id : false,
            params_selected_tab: false
        };
    }

    setOpen = (value) => {
        this.setState({
            open: value
        });
    };

    submit = () => {
        try {
            if (this.props.createNotebookIteration) {
                createNotebookIteration({
                    notebook_id: this.state.details.notebook_id,
                    payload: this.state.details,
                    callback: this.onResponseCreateNotebookIteration
                });
            } else {
                updateNotebookIteration({
                    notebook_id: this.state.details.notebook_id,
                    payload: this.state.details,
                    iteration_id: this.state.iteration_id,
                    callback: this.onResponseCreateNotebookIteration
                });
            }
        } catch (error) {
            this.handleUpdateResponse('Failed to complete action. Please try again.', 'error');
        }
    };

    onResponseCreateNotebookIteration = () => {
        const props = this.props;

        this.handleUpdateResponse('Updated Successfully');
        this.setOpen(false);

        this.setState({
            details: {
                notebook_id: props.iteration?.notebook_id
                    ? props.iteration.notebook_id
                    : props.notebook_id,
                name: props.iteration?.name ? props.iteration.name : '',
                config_params: props.iteration?.config_params ? props.iteration.config_params : ''
            },
            iteration_id: props.iteration?.id ? props.iteration.id : false
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

    onChangeParamsTab = (evt, selected_tabindex) => {
        this.setState({
            params_selected_tab: selected_tabindex
        });
    };

    onChangeConfigParams = (new_config_params) => {
        var details = this.state.details;

        details['config_params'] = new_config_params;
        this.setState({
            details: details
        });
    };

    onChangeConfigCode = (new_config_code) => {
        var details = this.state.details;

        details['config_code'] = new_config_code;
        this.setState({
            details: details
        });
    };

    onChangeFileUpload = (file_value) => {
        var details = this.state.details;

        details['config_df'] = file_value;
        this.setState({
            details: details
        });
    };

    render() {
        const { classes, createNotebookIteration, designNotebookIteration } = this.props;

        return [
            designNotebookIteration && (
                <IconButton
                    key={1}
                    title={'Design'}
                    href={'iterations/' + this.state.iteration_id + '/design'}
                    aria-label="Design"
                >
                    <AccountTreeIcon fontSize="large" />
                </IconButton>
            ),
            !createNotebookIteration && !designNotebookIteration && (
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
            createNotebookIteration && (
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
                aria-labelledby="create-new-iteration"
                aria-describedby="iteration-content"
            >
                <DialogTitle className={classes.title} disableTypography id="create-new-iteration">
                    <Typography variant="h4" className={classes.heading}>
                        Create New Iteration
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
                <DialogContent id="iteration-content">
                    <Grid key="form-body" container spacing={2}>
                        <Grid item xs>
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Iteration Name',
                                    id: 'name',
                                    fullWidth: true,
                                    value: this.state.details.name
                                }}
                            />
                            <Typography className={classes.adminFormSectionHeader} variant="h5">
                                {'Config Params'}
                            </Typography>
                            <Tabs
                                value={this.state.params_selected_tab}
                                onChange={this.onChangeParamsTab}
                                classes={{}}
                                aria-label="Config params"
                            >
                                <Tab label={'Excel'} />
                                <Tab label={'JSON'} />
                                <Tab label={'Code'} />
                            </Tabs>
                            <div className={classes.adminFormSectionTabBody}>
                                {this.state.params_selected_tab === 0 ? (
                                    <div className={classes.adminFormSectionFileUpload}>
                                        <FileUpload
                                            fieldInfo={{
                                                id: 'params_file_input',
                                                name: 'Configuration excel',
                                                label: 'Configuration excel',
                                                type: 'upload',
                                                value: this.state.details?.config_df
                                                    ? this.state.details?.config_df
                                                    : '',
                                                variant: 'outlined',
                                                margin: 'none',
                                                inputprops: {
                                                    type: 'file',
                                                    error: 'false',
                                                    multiple: false
                                                    // "accept": "/*"
                                                },
                                                InputLabelProps: {
                                                    disableAnimation: true,
                                                    shrink: true
                                                },
                                                placeholder: 'Upload configuration file',
                                                grid: 12
                                            }}
                                            onChange={this.onChangeFileUpload}
                                        />
                                    </div>
                                ) : this.state.params_selected_tab === 1 ? (
                                    <div className={classes.adminFormSectionCodeEditor}>
                                        <Typography
                                            className={classes.adminFormSectionHeader}
                                            variant="h6"
                                        >
                                            {
                                                'These JSON params are available under the variable name "config_params" and can be accessed from any where within the notebook.'
                                            }
                                        </Typography>
                                        <Editor
                                            key={'config_params_editor'}
                                            width="100%"
                                            height="100%"
                                            language="json"
                                            theme={
                                                localStorage.getItem(
                                                    'codx-products-theme',
                                                    'dark'
                                                ) === 'dark'
                                                    ? 'vs-dark'
                                                    : 'vs'
                                            }
                                            value={
                                                this.state.details?.config_params
                                                    ? this.state.details.config_params
                                                    : false
                                            }
                                            options={{ selectOnLineNumbers: true }}
                                            onChange={this.onChangeConfigParams}
                                        />
                                        <br />
                                    </div>
                                ) : this.state.params_selected_tab === 2 ? (
                                    <div className={classes.adminFormSectionCodeEditor}>
                                        <Typography
                                            className={classes.adminFormSectionHeader}
                                            variant="h6"
                                        >
                                            {
                                                'This code will be executed before any notebook execution and all the variables created in this code are available within the notebook.'
                                            }
                                        </Typography>
                                        <Editor
                                            key={'config_code_editor'}
                                            width="100%"
                                            height="100%"
                                            language="python"
                                            theme={
                                                localStorage.getItem(
                                                    'codx-products-theme',
                                                    'dark'
                                                ) === 'dark'
                                                    ? 'vs-dark'
                                                    : 'vs'
                                            }
                                            value={
                                                this.state.details?.config_code
                                                    ? this.state.details.config_code
                                                    : false
                                            }
                                            options={{ selectOnLineNumbers: true }}
                                            onChange={this.onChangeConfigCode}
                                        />
                                        <br />
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                            {/* <CustomTextField parent_obj={this} field_info={{
                                label: 'Config Params',
                                id: 'config_params',
                                fullWidth: true,
                                inputProps: {
                                    multiline: true,
                                    rows: 10
                                },
                                value: this.state.details.config_params
                            }} /> */}
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
)(NotebookIterationActions);
