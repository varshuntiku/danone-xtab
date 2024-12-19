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
    cloudProviders,
    envTypes,
    hostingTypes,
    infrastructures,
    runTimeVersions,
    runTimes,
    sku
} from 'constants/execution-workbench';
import {
    createDynamicExecEnv,
    updateDynamicExecEnv
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
            dependencyOpen: false,
            snackbar: {
                open: false
            },
            dependency: {
                name: '',
                version: ''
            },
            details: {
                id: props.dynamicExecEnv?.id || '',
                name: props.dynamicExecEnv?.name || '',
                cloud_provider_id: props.dynamicExecEnv?.cloud_provider_id || 1,
                infra_type: props.dynamicExecEnv?.infra_type || 'k8',
                hosting_type: props.dynamicExecEnv?.hosting_type || 'shared',
                compute_id: props.dynamicExecEnv?.compute_id || 1,
                env_type: props.dynamicExecEnv?.env_type || 'default',
                replica: props.dynamicExecEnv?.replica || 1,
                run_time: props.dynamicExecEnv?.run_time || null,
                run_time_version: props.dynamicExecEnv?.run_time_version || null,
                dependencies: []
            }
        };
    }

    setOpen = (value) => {
        this.setState({
            open: value
        });
    };

    setDependencyOpen = (value) => {
        this.setState({
            dependencyOpen: value,
            dependency: {
                name: '',
                version: ''
            }
        });
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

    addDependency = () => {
        const { name, version } = this.state.dependency;
        if (!name || !version) return;
        this.setState({
            dependency: { name: '', version: '' },
            details: {
                ...this.state.details,
                dependencies: [...this.state.details.dependencies, { name, version }]
            }
        });
    };

    cancel = () => {
        this.setOpen(false);
        this.handleUpdateResponse('Cancelled Successfully', 'warning');
    };

    cancelDependency = () => {
        this.setDependencyOpen(false);
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
                        cloud_provider_id: 1,
                        infra_type: 'k8',
                        hosting_type: 'shared',
                        compute_id: 1,
                        env_type: 'default',
                        replica: 1,
                        run_time: null,
                        run_time_version: null,
                        dependencies: []
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
                        cloud_provider_id: this.props.dynamicExecEnv.cloud_provider_id,
                        infra_type: this.props.dynamicExecEnv.infra_type,
                        hosting_type: this.props.dynamicExecEnv.hosting_type,
                        compute_id: this.props.dynamicExecEnv.compute_id,
                        env_type: this.props.dynamicExecEnv.env_type,
                        replica: this.props.dynamicExecEnv.replica,
                        run_time: this.props.dynamicExecEnv.run_time,
                        run_time_version: this.props.dynamicExecEnv.run_time_version,
                        dependencies: []
                    }
                }));
            }
        }
    };

    onHandleFieldChange = (field_id, field_value) => {
        let details = this.state.details;
        details[field_id] = field_value;
        // TODO: On cloud provider change load infra type
        if (field_id === 'env_type') {
            if (field_value === 'default') {
                details.run_time = null;
                details.run_time_version = null;
            } else {
                details.run_time = 'python';
                details.run_time_version = '3.10';
            }
        }
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

    render() {
        const { classes } = this.props;
        let errors = {
            error_in_name: !this.state.details['name'],
            error_in_replica:
                !this.state.details.replica ||
                this.state.details.replica < 1 ||
                this.state.details.replica > 10
        };
        const { error_in_name, error_in_replica } = errors;
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
                            Create Execution Environment
                        </Typography>
                    ) : (
                        <Typography variant="h4" className={classes.heading}>
                            Update Execution Environment
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
                                key="cloud_provider_id"
                                parent_obj={this}
                                field_info={{
                                    label: 'Cloud Provider',
                                    disabled: true,
                                    id: 'cloud_provider_id',
                                    fullWidth: true,
                                    required: true,
                                    value: this.state.details.cloud_provider_id,
                                    is_select: true,
                                    options: cloudProviders
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} direction="row">
                            <CustomTextField
                                key="infra_type"
                                parent_obj={this}
                                field_info={{
                                    label: 'Infrastructure Type',
                                    id: 'infra_type',
                                    disabled: true,
                                    fullWidth: true,
                                    required: true,
                                    value: this.state.details.infra_type,
                                    is_select: true,
                                    options: infrastructures
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} direction="row">
                            <CustomTextField
                                key="hosting_type"
                                parent_obj={this}
                                field_info={{
                                    label: 'Hosting Type',
                                    id: 'hosting_type',
                                    disabled: true,
                                    fullWidth: true,
                                    required: true,
                                    value: this.state.details.hosting_type,
                                    is_select: true,
                                    options: hostingTypes
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} direction="row">
                            <CustomTextField
                                key="compute_id"
                                parent_obj={this}
                                field_info={{
                                    label: 'Compute SKU',
                                    id: 'compute_id',
                                    fullWidth: true,
                                    required: true,
                                    value: this.state.details.compute_id,
                                    is_select: true,
                                    options: sku
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} direction="row">
                            <CustomTextField
                                key="env_type"
                                parent_obj={this}
                                field_info={{
                                    label: 'Environment Type',
                                    id: 'env_type',
                                    fullWidth: true,
                                    required: true,
                                    value: this.state.details.env_type,
                                    is_select: true,
                                    options: envTypes
                                }}
                            />
                        </Grid>
                        {this.state.details.env_type === 'custom' && (
                            <>
                                <Grid item xs={12} md={6} direction="row">
                                    <CustomTextField
                                        key="run_time"
                                        parent_obj={this}
                                        field_info={{
                                            label: 'Run Time',
                                            id: 'run_time',
                                            disabled: true,
                                            fullWidth: true,
                                            required: true,
                                            value: this.state.details.run_time,
                                            is_select: true,
                                            options: runTimes
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} direction="row">
                                    <CustomTextField
                                        key="run_time_version"
                                        parent_obj={this}
                                        field_info={{
                                            disabled: true,
                                            label: 'Run Time Version',
                                            id: 'run_time_version',
                                            fullWidth: true,
                                            required: true,
                                            value: this.state.details.run_time_version,
                                            is_select: true,
                                            options: runTimeVersions
                                        }}
                                    />
                                </Grid>
                            </>
                        )}
                        <Grid item xs={12} md={6} direction="row">
                            <CustomTextField
                                key="replica"
                                parent_obj={this}
                                field_info={{
                                    label: 'Replicas',
                                    id: 'replica',
                                    fullWidth: true,
                                    required: true,
                                    value: this.state.details.replica,
                                    error: error_in_replica,
                                    helper_text: error_in_replica
                                        ? 'No. of replica should be in the range 1 and 10'
                                        : '',
                                    inputProps: {
                                        type: 'number',
                                        min: 1,
                                        max: 10
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} direction="row" rowGap={5}>
                            <div className={classes.subTitle}>
                                <Typography variant="h4">Dependencies</Typography>
                                <Button onClick={() => this.setDependencyOpen(true)}>Add +</Button>
                            </div>
                            {this.state.details.dependencies.map((dependency) => (
                                <Typography variant="h3" key={dependency.name}>
                                    {dependency.name}: {dependency.version}
                                </Typography>
                            ))}
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
                        disabled={error_in_replica || error_in_name}
                        aria-label="Save"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>,
            <Dialog key={4} open={this.state.dependencyOpen}>
                <DialogTitle className={classes.title} disableTypography>
                    <Typography variant="h4" className={classes.heading}>
                        Add Dependency
                    </Typography>
                    <IconButton
                        title="Close"
                        onClick={() => {
                            this.setDependencyOpen(false);
                        }}
                        className={classes.closeIcon}
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <hr className={classes.sepratorline} />
                <DialogContent className={classes.dialogContent}>
                    <Grid key="form-body" container spacing={2}>
                        <Grid item xs={12} md={6} direction="row">
                            <CustomTextField
                                key="name"
                                parent_obj={this}
                                field_info={{
                                    label: 'Dependency Name',
                                    id: 'dependency_name',
                                    fullWidth: true,
                                    required: true,
                                    onChange: (value) =>
                                        this.setState({
                                            ...this.state,
                                            dependency: { ...this.state.dependency, name: value }
                                        }),
                                    value: this.state.dependency.name
                                }}
                            />
                            <CustomTextField
                                key="version"
                                parent_obj={this}
                                field_info={{
                                    label: 'Dependency Version',
                                    id: 'dependency_version',
                                    fullWidth: true,
                                    required: true,
                                    onChange: (value) =>
                                        this.setState({
                                            ...this.state,
                                            dependency: { ...this.state.dependency, version: value }
                                        }),
                                    value: this.state.dependency.version
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className={classes.dialogAction}>
                    <Button
                        className={classes.btn}
                        variant="outlined"
                        onClick={this.cancelDependency}
                        aria-label="Cancel"
                    >
                        Cancel
                    </Button>
                    <Button
                        className={classes.btn}
                        variant="contained"
                        onClick={this.addDependency}
                        disabled={!this.state.dependency.name || !this.state.dependency.version}
                        aria-label="Save"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>,
            <CustomSnackbar
                key={5}
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
    subTitle: {
        '& .MuiTypography-h4': {
            color: theme.palette.text.titleText,
            fontSize: '2.0rem',
            letterSpacing: '0.1em',
            opacity: 0.8,
            fontFamily: theme.title.h3.fontFamily
        },
        display: 'flex',
        gap: theme.spacing(2),
        marginBottom: theme.spacing(5),
        alignItems: 'center'
    },

    dialogContent: {
        paddingLeft: theme.layoutSpacing(44),
        paddingRight: theme.layoutSpacing(44),
        paddingTop: theme.layoutSpacing(10),
        overflowX: 'hidden',
        overflowY: 'auto'
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
