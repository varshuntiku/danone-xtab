import React from 'react';
import PropTypes from 'prop-types';

import { alpha, Grid, Paper, withStyles } from '@material-ui/core';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import appAdminStyle from 'assets/jss/appAdminStyle.jsx';

import CustomTextField from 'components/Forms/CustomTextField.jsx';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import AppVariables from './AppVariables';
import AppFunctions from './AppFunctions';

import { Typography, Button, Checkbox, FormControlLabel } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import RestoreIcon from '@material-ui/icons/Restore';

import { addApplication, replicateAppFromVersion, resetAppVersion } from 'services/app_admin.js';
import CustomSnackbar from '../CustomSnackbar';
import ConfirmPopup from '../confirmPopup/ConfirmPopup';
import { UserInfoContext } from 'context/userInfoContent';

import * as _ from 'underscore';

const createVersionStyles = (theme) => ({
    container: {
        paddingTop: '2rem'
    },
    paper: {
        padding: '2rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    header1Text: {
        color: theme.palette.text.default,
        fontSize: '1.6rem'
    },
    header2Text: {
        color: alpha(theme.palette.text.default, 0.7),
        fontSize: '1.4rem'
    },
    header3Text: {
        color: alpha(theme.palette.text.default, 0.7),
        fontSize: '1.2rem'
    },
    checkboxContainer: {
        marginLeft: 'auto'
    },
    checkboxLabel: {
        fontSize: '1.6em',
        color: theme.palette.primary.contrastText
    },
    checkboxSvg: {
        '& .MuiSvgIcon-root': {
            fontSize: '1.6em'
        }
    }
});

class AppAdminCreateVersion extends React.Component {
    static contextType = UserInfoContext;
    constructor(props) {
        super(props);
        this.props = props;
        this.version_options = _.map(this.props.app_info.env_apps, function (env_app) {
            // return [{ label: "Preview", value: "preview" }, { label: "Prod", value: "prod" }]
            return {
                label: env_app.environment.toUpperCase(),
                value: env_app.id
            };
        });
        this.state = {
            env_key: props.match && props.match.params.env_key ? props.match.params.env_key : false,
            selected_env_id:
                props.match && props.match.params.env_key ? props.match.params.env_key : false,
            // for Source Verison:
            sourceDropdownOptions: this.version_options,
            selectedSourceVersion: null,
            currentApplicationVersion: props.match?.params?.env_key
                ? props.match?.params?.env_key
                : this.props.app_info?.environment,
            currentApplicationId: props.match?.params?.env_key ? null : this.props.app_info.id,
            snackbar: {
                open: false
            },
            copy_app_vars_flag: props.match && props.match.params.env_key ? true : false,
            resetInProgress: false
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match?.path !== this.props.match?.path) {
            this.setState({
                ...this.state,
                env_key:
                    this.props.match && this.props.match.params.env_key
                        ? this.props.match.params.env_key
                        : false,
                selected_env_id:
                    this.props.match && this.props.match.params.env_key
                        ? this.props.match.params.env_key
                        : false,
                currentApplicationVersion: this.props.match?.params?.env_key
                    ? this.props.match?.params?.env_key
                    : this.props.app_info?.environment,
                currentApplicationId: this.props.match?.params?.env_key
                    ? null
                    : this.props.app_info.id,
                copy_app_vars_flag:
                    this.props.match && this.props.match.params.env_key ? true : false
            });
        }
    }

    onHandleFieldChange = (field_id, field_value) => {
        this.setState({
            [field_id]: field_value
        });
    };

    onClickAddEnv = () => {
        const { app_info } = this.props;

        this.setState({
            loading: true
        });

        addApplication({
            payload: {
                data: {
                    source_app_id: app_info.id,
                    env_key: this.state.env_key,
                    user_id: this.context.user_id
                }
            },
            callback: this.onResponseAddEnv
        });
    };

    onResponseAddEnv = (response_data) => {
        this.props.history.push({
            pathname: response_data.link
        });
    };

    onHandleSourceVersionChange = (field_id) => {
        this.setState({
            selectedSourceVersion: field_id
        });
    };

    /**
     * The payload is:
     * current_app_id : The app id into which selected source will be replicated into
     * source_version : The source version of app (a different app id). the sources' info will be copied/replicated into destination i.e. current_aap_id
     * current_version: The current version of the app. Cant be same as source_version.
     */
    handleReplicateAppFromSource = () => {
        // TODO: Uncomment later;
        const payload = {
            source_app_id: this.state.selectedSourceVersion,
            destination_app_env: this.state.env_key,
            destination_app_id: this.state.currentApplicationId,
            copy_app_vars_flag: this.state.copy_app_vars_flag,
            user_id: this.context.user_id
        };
        if (this.state.env_key) {
            payload.destination_app_env = this.state.env_key;
        } else {
            payload.destination_app_id = this.state.currentApplicationId;
        }
        replicateAppFromVersion({
            callback: this.onReplicationReponse,
            payload: payload
        });
    };

    onReplicationReponse = (response_data) => {
        if (response_data['new_app_id']) {
            this.props.parent_obj.refreshAppSilent();
            this.setSnackbarStatus('Version Replicated Successfully');
            setTimeout(() => {
                this.props.history.push(response_data?.link);
            }, 2000);
        } else {
            this.setSnackbarStatus(
                response_data.status ||
                    'We were unable to create the replica. Please Try again, Later.',
                'error'
            );
        }
    };

    onResetApplication = async () => {
        try {
            this.setState({
                resetInProgress: true
            });
            await resetAppVersion({
                app_id: this.props.app_info.id
            });
            this.setSnackbarStatus('Reset app successful');
            this.props.parent_obj.refreshAppSilent();
        } catch (err) {
            this.setSnackbarStatus('Failed to reset app.', 'error');
        } finally {
            this.setState({
                resetInProgress: false
            });
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
    handleSnackbarClose = () => {
        this.setState({
            snackbar: {
                open: false
            }
        });
    };

    getAppVariableWarningMessage = () => {
        if (!this.state.env_key && this.state.copy_app_vars_flag) {
            return 'Existing App Variables and its values will get overwritten!';
        } else if (!this.state.copy_app_vars_flag) {
            return 'Your copied application might have missing App Variables, kindly recreate them manually!';
        } else {
            return null;
        }
    };

    componentWillUnmount() {
        this.setState = () => {
            return;
        };
    }

    render() {
        const { classes } = this.props;

        let is_prod_app = this.props.app_info?.environment === 'prod';
        let reset_my_app =
            this.context.nac_roles[0]?.permissions.find(
                (permission) => permission.name === 'RESET_MY_APP'
            ) && this.context.user_id === this.props.app_info.user_id;

        let reset_all_app = this.context.nac_roles[0]?.permissions.find(
            (permission) => permission.name === 'RESET_ALL_APP'
        );
        let edit_production_app = this.context.nac_roles[0]?.permissions.find(
            (permission) => permission.name === 'EDIT_PRODUCTION_APP'
        );
        let edit_preview_app = this.context.nac_roles[0]?.permissions.find(
            (permission) => permission.name === 'CREATE_PREVIEW_APP'
        );
        const editDisabled =
            this.props.app_info?.environment === 'prod' ? !edit_production_app : !edit_preview_app;
        return (
            <div key="create-version-container" className={classes.createEnvContent}>
                {this.state.loading ? (
                    <CodxCircularLoader size={60} center />
                ) : (
                    <React.Fragment>
                        <Grid
                            container
                            spacing={4}
                            key="create-version-setup-container"
                            className={classes.container}
                        >
                            {this.state.env_key && (
                                <Grid item xs={12} md={12}>
                                    <Typography
                                        className={classes.header1Text}
                                        variant="h3"
                                        align="center"
                                        gutterBottom
                                    >
                                        This version of App is not yet created.{' '}
                                        {this.context.nac_roles[0]?.permissions.find(
                                            (permission) => permission.name === 'PROMOTE_APP'
                                        ) && 'Please use any of the below methods to create it.'}
                                    </Typography>
                                </Grid>
                            )}
                            {this.context.nac_roles[0]?.permissions.find(
                                (permission) => permission.name === 'PROMOTE_APP'
                            ) && (
                                <Grid item xs={12} md={6}>
                                    <Paper className={classes.paper}>
                                        <Typography
                                            className={classes.header1Text}
                                            variant="h5"
                                            gutterBottom
                                        >
                                            Select the source version from where you want to copy
                                            the application from
                                        </Typography>

                                        <CustomTextField
                                            parent_obj={this}
                                            key={'source_version_selctor'}
                                            field_info={{
                                                label: 'Select Environment to Copy From',
                                                id: 'source_env',
                                                is_select: true,
                                                fullWidth: true,
                                                required: true,
                                                disabled: editDisabled,
                                                options: this.state.sourceDropdownOptions.map(
                                                    (el) => {
                                                        const obj = { ...el };
                                                        obj.disabled =
                                                            el.value ===
                                                            this.state.currentApplicationId;
                                                        return obj;
                                                    }
                                                ),
                                                value: this.state.selectedSourceVersion,
                                                onChange: this.onHandleSourceVersionChange
                                            }}
                                        />
                                        <div style={{ flex: 1 }} />
                                        <div className={classes.checkboxContainer}>
                                            <FormControlLabel
                                                classes={{ label: classes.checkboxLabel }}
                                                labelPlacement="start"
                                                control={
                                                    <Checkbox
                                                        checked={this.state.copy_app_vars_flag}
                                                        className={classes.checkboxSvg}
                                                        onChange={(e) => {
                                                            this.onHandleFieldChange(
                                                                'copy_app_vars_flag',
                                                                e.target.checked
                                                            );
                                                        }}
                                                        disabled={editDisabled}
                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                    />
                                                }
                                                label="Copy App Variables"
                                            />
                                        </div>
                                        <div>
                                            {this.state.env_key && (
                                                <ConfirmPopup
                                                    onConfirm={this.handleReplicateAppFromSource}
                                                    title="Create Version?"
                                                    subTitle="Selected version of the application will be used to create new version."
                                                    warningMessage={this.getAppVariableWarningMessage()}
                                                    cautionCheck={{
                                                        textToMatch: this.props.app_info.name,
                                                        prompt: 'Enter exact name of the application to proceed:'
                                                    }}
                                                >
                                                    {(triggerConfirm) => (
                                                        <Button
                                                            key="create-app-from-source-version"
                                                            variant={
                                                                this.state
                                                                    .currentApplicationVersion ===
                                                                'prod'
                                                                    ? 'contained'
                                                                    : 'outlined'
                                                            }
                                                            disabled={
                                                                !this.state.selectedSourceVersion
                                                            }
                                                            onClick={triggerConfirm}
                                                            size="small"
                                                            startIcon={
                                                                <FileCopyIcon fontSize="large" />
                                                            }
                                                            aria-label="CREATE VERSION"
                                                        >
                                                            CREATE VERSION
                                                        </Button>
                                                    )}
                                                </ConfirmPopup>
                                            )}
                                            {!this.state.env_key && (
                                                <ConfirmPopup
                                                    onConfirm={this.handleReplicateAppFromSource}
                                                    title="Replicate Version?"
                                                    subTitle="Current version of the application will be replaced with your selected version. "
                                                    warningMessage={this.getAppVariableWarningMessage()}
                                                    cautionCheck={{
                                                        textToMatch: this.props.app_info.name,
                                                        prompt: 'Enter the exact name of the application to proceed:'
                                                    }}
                                                >
                                                    {(triggerConfirm) => (
                                                        <Button
                                                            key="replicate-app-from-source-version"
                                                            variant={
                                                                this.state
                                                                    .currentApplicationVersion ===
                                                                'prod'
                                                                    ? 'contained'
                                                                    : 'outlined'
                                                            }
                                                            disabled={
                                                                !this.state.selectedSourceVersion ||
                                                                editDisabled
                                                            }
                                                            onClick={triggerConfirm}
                                                            size="small"
                                                            startIcon={
                                                                <FileCopyIcon fontSize="large" />
                                                            }
                                                            aria-label="REPLICATE VERSION"
                                                        >
                                                            Replicate Version
                                                        </Button>
                                                    )}
                                                </ConfirmPopup>
                                            )}
                                        </div>
                                    </Paper>
                                </Grid>
                            )}
                            {!this.state.env_key && (
                                <Grid item xs={12} md={6}>
                                    <Paper className={classes.paper}>
                                        <Typography
                                            className={classes.header1Text}
                                            variant="h5"
                                            gutterBottom
                                        >
                                            Do you want to reset this version of application?
                                        </Typography>
                                        <Typography
                                            className={classes.header2Text}
                                            variant="h5"
                                            gutterBottom
                                        >
                                            Resetting the application will remove all modules,
                                            screens, configuration and uiacs. overview will not be
                                            impacted
                                        </Typography>
                                        <div style={{ flex: 1 }} />
                                        <div>
                                            <ConfirmPopup
                                                onConfirm={this.onResetApplication}
                                                title="Reset This Version?"
                                                subTitle="Current version of the application will be reset by clearing all screens and associated UIaCs."
                                                cautionCheck={{
                                                    textToMatch: this.props.app_info.name,
                                                    prompt: 'Enter the exact name of the application to proceed:'
                                                }}
                                            >
                                                {(triggerConfirm) => (
                                                    <Button
                                                        key="reset-app-version"
                                                        variant={
                                                            this.state.currentApplicationVersion ===
                                                            'prod'
                                                                ? 'contained'
                                                                : 'outlined'
                                                        }
                                                        onClick={triggerConfirm}
                                                        size="small"
                                                        startIcon={<RestoreIcon fontSize="large" />}
                                                        disabled={
                                                            editDisabled ||
                                                            is_prod_app ||
                                                            (!reset_my_app && !reset_all_app)
                                                        }
                                                        aria-label="RESET VERSION"
                                                    >
                                                        Reset Version
                                                    </Button>
                                                )}
                                            </ConfirmPopup>
                                        </div>
                                    </Paper>
                                </Grid>
                            )}
                            {this.state.env_key &&
                                this.context.nac_roles[0]?.permissions.find(
                                    (permission) => permission.name === 'PROMOTE_APP'
                                ) && (
                                    <Grid item xs={12} md={6}>
                                        <Paper className={classes.paper}>
                                            <Typography
                                                className={classes.header1Text}
                                                variant="h5"
                                                gutterBottom
                                            >
                                                Do you want to create a new version from scratch?
                                            </Typography>
                                            <Typography
                                                className={classes.header2Text}
                                                variant="h5"
                                                gutterBottom
                                            >
                                                Create a fresh version for this application.
                                            </Typography>
                                            <Typography
                                                className={classes.header3Text}
                                                variant="h5"
                                                gutterBottom
                                            >
                                                Note: a new app id will be generated which will have
                                                no information, other than overview
                                            </Typography>
                                            <div style={{ flex: 1 }} />
                                            <div>
                                                <ConfirmPopup
                                                    onConfirm={this.onClickAddEnv}
                                                    title="Create Fresh Version?"
                                                    subTitle="Do you want to create a fresh, new version?"
                                                    cautionCheck={{
                                                        textToMatch: this.props.app_info.name,
                                                        prompt: 'Enter the exact name of the application to proceed:'
                                                    }}
                                                >
                                                    {(triggerConfirm) => (
                                                        <Button
                                                            key="create-new-fresh-app-version"
                                                            variant={
                                                                this.state
                                                                    .currentApplicationVersion ===
                                                                'prod'
                                                                    ? 'contained'
                                                                    : 'outlined'
                                                            }
                                                            onClick={triggerConfirm}
                                                            size="small"
                                                            startIcon={<RestoreIcon size="small" />}
                                                            disabled={
                                                                this.state
                                                                    .currentApplicationVersion ===
                                                                'prod'
                                                            }
                                                            aria-label="CREATE FRESH VERSION"
                                                        >
                                                            CREATE FRESH VERSION
                                                        </Button>
                                                    )}
                                                </ConfirmPopup>
                                            </div>
                                        </Paper>
                                    </Grid>
                                )}

                            {!this.state.env_key ? (
                                <Grid item xs={12}>
                                    {!this.state.resetInProgress ? (
                                        <AppVariables
                                            key={String(this.state.reset_app_version_flag)}
                                            appId={this.props.app_info.id}
                                            editDisabled={editDisabled}
                                        ></AppVariables>
                                    ) : (
                                        <CodxCircularLoader center size={45} />
                                    )}
                                </Grid>
                            ) : null}
                            {!this.state.env_key ? (
                                <Grid item xs={12}>
                                    {!this.state.resetInProgress ? (
                                        <AppFunctions
                                            key={String(this.state.reset_app_version_flag)}
                                            appId={this.props.app_info.id}
                                            editDisabled={editDisabled}
                                        ></AppFunctions>
                                    ) : (
                                        <CodxCircularLoader center size={45} />
                                    )}
                                </Grid>
                            ) : null}
                        </Grid>
                    </React.Fragment>
                )}
                <CustomSnackbar
                    key={4}
                    open={this.state.snackbar.open}
                    message={this.state.snackbar.message}
                    autoHideDuration={3000}
                    onClose={this.handleSnackbarClose}
                    severity={this.state.snackbar.severity}
                />
            </div>
        );
    }
}

AppAdminCreateVersion.propTypes = {
    classes: PropTypes.object.isRequired,
    app_info: PropTypes.object.isRequired
};

export default withStyles(
    (theme) => ({
        ...appAdminStyle(theme),
        ...customFormStyle(theme),
        ...createVersionStyles(theme)
    }),
    { withTheme: true }
)(AppAdminCreateVersion);
