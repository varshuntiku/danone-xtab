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
    createDynamicExecEnv,
    updateDynamicExecEnv,
    getDefaultDynamicExecEnvs
} from 'services/execution_environments_utils.js';
import CloseIcon from '../../assets/Icons/CloseBtn';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

import * as _ from 'underscore';

class ManageExecEnvs extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            open: false,
            py_version_list: [],
            snackbar: {
                open: false
            },
            details: {
                id: props.dynamicExecEnv?.id ? props.dynamicExecEnv.id : '',
                name: props.dynamicExecEnv?.name ? props.dynamicExecEnv.name : '',
                py_version: props.dynamicExecEnv?.py_version ? props.dynamicExecEnv.py_version : '',
                requirements: props.dynamicExecEnv?.requirements
                    ? props.dynamicExecEnv.requirements
                    : ''
            }
        };
    }

    setOpen = (value) => {
        this.setState({
            open: value
        });
        // check if pop is open, load default values if not loaded already
        if (value === true && this.state.py_version_list.length === 0) {
            getDefaultDynamicExecEnvs({
                callback: this.onResponseGetDefaultDynamicExecEnvs
            });
        }
    };

    onResponseGetDefaultDynamicExecEnvs = (response_data, status = 'success') => {
        if (status === 'error') {
            this.setState((prevState) => ({
                snackbar: {
                    ...prevState.snackbar,
                    open: true,
                    message: 'Failed to load default execution environment values',
                    severity: 'error'
                }
            }));
        } else {
            this.setState({
                py_version_list: response_data
            });
        }
    };

    submit = () => {
        try {
            let tempDetails = { ...this.state.details };
            if (this.props.createNewDynamicExecEnv) {
                createDynamicExecEnv({
                    payload: tempDetails,
                    callback: this.onResponseCreateDynamicExecEnv
                });
            } else {
                updateDynamicExecEnv({
                    payload: tempDetails,
                    callback: this.onResponseCreateDynamicExecEnv
                });
            }
        } catch (error) {
            this.handleUpdateResponse(error, 'error');
        }
    };

    cancel = () => {
        this.setOpen(false);
        this.handleUpdateResponse('Cancelled Successfully', 'warning');
    };

    onResponseCreateDynamicExecEnv = (status = 'success') => {
        if (status === 'error') {
            this.handleUpdateResponse('Error creating/updating execution environment', 'error');
        } else if (this.props.createNewDynamicExecEnv) {
            this.handleUpdateResponse('Created Successfully');
            this.setOpen(false);

            _.delay(
                () => {
                    this.props.refreshExecEnvList();
                },
                2000,
                ''
            );
        } else {
            this.handleUpdateResponse('Updated Successfully');
            this.setOpen(false);

            _.delay(
                () => {
                    this.props.refreshExecEnvList();
                },
                2000,
                ''
            );
        }
    };

    handleUpdateResponse = (message, severity = 'success') => {
        if (severity === 'error') {
            this.setState((prevState) => ({
                snackbar: {
                    ...prevState.snackbar,
                    open: true,
                    message: message,
                    severity: severity
                }
            }));
        } else {
            if (this.props.createNewDynamicExecEnv) {
                this.setState((prevState) => ({
                    snackbar: {
                        ...prevState.snackbar,
                        open: true,
                        message: message,
                        severity: severity
                    },
                    details: {
                        ...prevState.details,
                        id: '',
                        name: '',
                        py_version: '',
                        requirements: ''
                    }
                }));
            } else {
                this.setState((prevState) => ({
                    snackbar: {
                        ...prevState.snackbar,
                        open: true,
                        message: message,
                        severity: severity
                    },
                    details: {
                        ...prevState.details,
                        id: this.props.dynamicExecEnv.id,
                        name: this.props.dynamicExecEnv.name,
                        py_version: this.props.dynamicExecEnv.py_version,
                        requirements: this.props.dynamicExecEnv.requirements
                    }
                }));
            }
        }
    };

    onHandleFieldChange = (field_id, field_value) => {
        let details = this.state.details;
        details[field_id] = field_value;
        this.setState({
            details: details
        });
    };

    checkInvalidJson = (stringVal) => {
        try {
            JSON.parse(stringVal);
        } catch (e) {
            return true;
        }
        return false;
    };

    onChangePyVersion = (value) => {
        let details = { ...this.state.details };
        details.py_version = value;
        if (this.props.createNewDynamicExecEnv) {
            details.requirements = this.state.py_version_list.find(
                (o) => o.py_version === value
            ).requirements;
        }
        this.setState({
            details: details
        });
    };

    render() {
        const { classes } = this.props;
        let errors = {
            error_in_name: this.state.details['name'] === '',
            error_in_pyVersion: this.state.details['py_version'] === ''
        };
        const { error_in_name, error_in_pyVersion } = errors;
        return [
            !this.props.createNewDynamicExecEnv && (
                <IconButton
                    key={1}
                    title="Manage Execution Environments"
                    onClick={() => {
                        this.setOpen(true);
                    }}
                >
                    <EditOutlinedIcon fontSize="large" />
                </IconButton>
            ),
            this.props.createNewDynamicExecEnv && (
                <Button
                    key={2}
                    variant="outlined"
                    className={classes.createNewButton}
                    onClick={() => {
                        this.setOpen(true);
                    }}
                    startIcon={<AddCircleOutlineOutlinedIcon />}
                    aria-label="Create New"
                >
                    Create New
                </Button>
            ),
            <Dialog
                key={3}
                open={this.state.open}
                fullWidth
                classes={{ paper: classes.paper }}
                maxWidth="md"
                aria-labelledby="visualization-execution-env"
                aria-describedby="environment-content"
            >
                <DialogTitle
                    className={classes.title}
                    disableTypography
                    id="visualization-execution-env"
                >
                    {this.props.createNewDynamicExecEnv ? (
                        <Typography variant="h4" className={classes.heading}>
                            Create New Dynamic Visualization Execution Environment
                        </Typography>
                    ) : (
                        <Typography variant="h4" className={classes.heading}>
                            Update Dynamic Visualization Execution Environment
                        </Typography>
                    )}
                    <IconButton
                        title="Close"
                        onClick={() => {
                            this.setOpen(false);
                        }}
                        className={classes.closeIcon}
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <hr className={classes.sepratorline} />
                <DialogContent id="environment-content" className={classes.dialogContent}>
                    <Grid key="form-body" container spacing={2}>
                        <Grid item xs={12} md={6} direction="row">
                            <CustomTextField
                                key="name"
                                parent_obj={this}
                                field_info={{
                                    label: 'Environment Name',
                                    id: 'name',
                                    fullWidth: true,
                                    required: true,
                                    error: error_in_name,
                                    helper_text: error_in_name ? 'Name is Mandatory' : '',
                                    value: this.state.details.name
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} direction="row">
                            <CustomTextField
                                key="py_version"
                                parent_obj={this}
                                field_info={{
                                    label: 'Python Version',
                                    id: 'py_version',
                                    is_select: true,
                                    fullWidth: true,
                                    required: true,
                                    error: error_in_pyVersion,
                                    onChange: 'onChangePyVersion',
                                    helper_text: error_in_pyVersion
                                        ? 'Python version is Mandatory'
                                        : '',
                                    options: this.state.py_version_list.map((o) => {
                                        return { label: o.py_version, value: o.py_version };
                                    }),
                                    value: this.state.details.py_version
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CustomTextField
                                key="requirements"
                                parent_obj={this}
                                field_info={{
                                    label: 'Libraries Required',
                                    id: 'requirements',
                                    // required: true,
                                    fullWidth: true,
                                    required: false,
                                    inputProps: {
                                        value: this.state.details.requirements,
                                        multiline: true
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                    ,
                </DialogContent>
                <DialogActions className={classes.dialogAction}>
                    <Button
                        className={classes.btn}
                        variant="outlined"
                        onClick={this.cancel}
                        aria-label="Cancel"
                    >
                        Cancel
                    </Button>
                    <Button
                        className={classes.btn}
                        variant="contained"
                        onClick={this.submit}
                        disabled={error_in_pyVersion || error_in_name}
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
        background: theme.palette.background.modelBackground,
        backdropFilter: 'blur(2rem)',
        borderRadius: 0,
        border: 'none'
    },
    createNewButton: {
        float: 'right',
        margin: theme.spacing(2, 2),
        '& svg': {
            fill: theme.palette.primary.contrastText + ' !important'
        }
    },
    heading: {
        color: theme.palette.text.titleText,
        fontSize: '2.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8
    },
    title: {
        margin: 0,
        background: theme.palette.background.modelBackground,
        padding: theme.layoutSpacing(20),
        '& .MuiTypography-h4': {
            color: theme.palette.text.titleText,
            fontSize: '2.5rem',
            letterSpacing: '0.1em',
            opacity: 0.8,
            fontFamily: theme.title.h1.fontFamily
        },
        display: 'flex',
        justifyContent: 'space-between'
    },
    dialogContent: {
        paddingLeft: theme.layoutSpacing(44),
        paddingRight: theme.layoutSpacing(44),
        paddingTop: theme.layoutSpacing(40),
        overflow: 'hidden'
    },
    dialogAction: {
        paddingBottom: theme.layoutSpacing(28),
        paddingTop: theme.layoutSpacing(48),
        paddingRight: theme.layoutSpacing(44)
    },
    sepratorline: {
        border: `1px solid ${theme.palette.border.loginGrid}`,
        borderBottom: 'none',
        width: 'calc(100% - 32px)'
    },
    closeIcon: {
        position: 'absolute',
        top: theme.layoutSpacing(12),
        right: 0,
        '& svg': {
            fill: `${theme.palette.icons.closeIcon}!important`
        }
    }
});

export default withStyles(
    (theme) => ({
        ...styles(theme),
        ...customFormStyle(theme)
    }),
    { withTheme: true }
)(ManageExecEnvs);
