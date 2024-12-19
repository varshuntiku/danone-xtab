import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import { Typography, Grid, Button, Checkbox, FormControlLabel } from '@material-ui/core';
import CustomSnackbar from 'components/CustomSnackbar.jsx';

import CustomTextField from 'components/Forms/CustomTextField.jsx';
import ImageUpload from 'components/dynamic-form/inputFields/imageUpload.jsx';

import { getConnectedSystem, updateConnectedSystem } from 'services/connectedSystem_v2.js';
import { decodeHtmlEntities } from 'util/decodeHtmlEntities.js';

import appScreenAdminStyle from 'assets/jss/appScreenAdminStyle.jsx';
import sanitizeHtml from 'sanitize-html-react';
import clsx from 'clsx';

// import * as _ from 'underscore';
import { axiosClient } from 'services/httpClient.js';

class Overview extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.state = {
            details: {},
            loading: true,
            logo_files_to_delete: [],
            snackbar: {
                message: '',
                severity: 'info',
                open: false
            },
            small_logo_file_details: props.conn_system_info?.small_logo_blob_name
                ? [
                      {
                          filename: props.conn_system_info.small_logo_blob_name,
                          path: props.conn_system_info.small_logo_url
                      }
                  ]
                : false
        };
    }

    componentDidMount() {
        const { connSystemDashboardId } = this.props;

        getConnectedSystem({
            connSystemDashboardId: connSystemDashboardId,
            callback: this.onResponseDashboardData
        });
    }

    onResponseDashboardData = (response_data) => {
        this.setState({
            loading: false,
            details: {
                name: response_data?.name ? response_data.name : '',
                industry: response_data?.industry ? response_data.industry : '',
                function: response_data?.function ? response_data.function : '',
                is_active: response_data?.is_active ? response_data.is_active : false,
                small_logo_blob_name: response_data?.small_logo_blob_name
                    ? response_data.small_logo_blob_name
                    : '',
                description: response_data?.description
                    ? decodeHtmlEntities(sanitizeHtml(response_data.description))
                    : ''
            },
            small_logo_file_details: response_data?.small_logo_blob_name
                ? [
                      {
                          filename: response_data.small_logo_blob_name,
                          path: response_data.small_logo_url
                      }
                  ]
                : false
        });
    };

    onHandleFieldChange = (field_id, field_value) => {
        let details = this.state.details;

        details[field_id] = field_value;

        this.setState({
            details: details
        });
    };

    handleSnackbarState = (params) => {
        this.setState({
            snackbar: {
                message: params?.message || '',
                open: params?.open ? true : false,
                severity: params?.severity || 'info'
            }
        });
    };

    addFilesToRemove = (file, file_value, logo_type) => {
        if (logo_type === 'small_logo_blobname') {
            this.setState({
                ...this.state,
                logo_files_to_delete: [...this.state.logo_files_to_delete, file],
                small_logo_file_details: file_value
            });
        }
    };

    removeFilesOnSave = async () => {
        for (let i = 0; i < this.state.logo_files_to_delete.length; i++) {
            const body = { file: this.state.logo_files_to_delete[i] };
            await axiosClient
                .post('/file/delete', body)
                .then(() => {
                    //TODO
                })
                .catch(() => {});
        }
    };

    onClickOverviewSave = async () => {
        const { connSystemDashboardId } = this.props;

        try {
            await updateConnectedSystem({
                connSystemDashboardId: connSystemDashboardId,
                payload: {
                    ...this.state.details,
                    description: this.state.details.description
                        ? sanitizeHtml(this.state.details.description)
                        : ''
                },
                callback: this.onResponseOverviewSave
            });
        } catch (error) {
            this.setState({
                snackbar: {
                    message: error?.response?.data?.error || 'Failed to save. Try again',
                    open: true,
                    severity: 'error'
                }
            });
        }
    };

    onResponseOverviewSave = async (response_data) => {
        const snackbarValues = {
            message:
                response_data?.status === 200
                    ? 'Saved Successfully'
                    : 'There was an error in Saving. Please try after some time',
            severity: response_data?.status === 200 ? 'success' : 'error',
            open: true
        };
        await this.removeFilesOnSave();
        this.handleSnackbarState(snackbarValues);
        // this.props.parent_obj.refreshAppSilent();
    };

    onChangeSmallFileUpload = (file_value) => {
        let details = this.state.details;

        details['small_logo_blob_name'] = file_value.length ? file_value[0].filename : '';
        this.setState({
            small_logo_file_details: file_value,
            details: details
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    marginLeft: '-1rem'
                }}
            >
                <div className={classes.overviewContent}>
                    <div className={classes.overviewForm}>
                        <Grid key="form-body" container spacing={2}>
                            <Grid item xs={6} md={6} className={classes.overviewFormFields}>
                                <Typography
                                    key="form-overview-text"
                                    className={clsx(
                                        classes.customFormSectionHeader,
                                        classes.AdminOverviewFormHeader
                                    )}
                                    variant="h4"
                                >
                                    All fields are required
                                </Typography>
                                <div className={classes.fieldsWrapper}>
                                    <CustomTextField
                                        parent_obj={this}
                                        field_info={{
                                            label: 'Name',
                                            id: 'name',
                                            fullWidth: true,
                                            value:
                                                this.state.details && this.state.details['name']
                                                    ? this.state.details['name']
                                                    : ''
                                        }}
                                    />
                                    <CustomTextField
                                        parent_obj={this}
                                        field_info={{
                                            label: 'Industry',
                                            id: 'industry',
                                            fullWidth: true,
                                            value:
                                                this.state.details && this.state.details['industry']
                                                    ? this.state.details['industry']
                                                    : ''
                                        }}
                                    />
                                    <CustomTextField
                                        parent_obj={this}
                                        field_info={{
                                            label: 'Function',
                                            id: 'function',
                                            fullWidth: true,
                                            value:
                                                this.state.details && this.state.details['function']
                                                    ? this.state.details['function']
                                                    : ''
                                        }}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={
                                                    this.state.details.is_active ? true : false
                                                }
                                                onChange={(e, v) =>
                                                    this.onHandleFieldChange('is_active', v)
                                                }
                                                name="is_active"
                                                color="primary"
                                            />
                                        }
                                        className={`${classes.inputCheckbox} ${classes.customInputCheckbox}`}
                                        label="Is Active"
                                    />
                                    <CustomTextField
                                        parent_obj={this}
                                        field_info={{
                                            label: 'Description',
                                            id: 'description',
                                            fullWidth: true,
                                            value:
                                                this.state.details &&
                                                this.state.details['description']
                                                    ? this.state.details['description']
                                                    : ''
                                        }}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={6} md={6}>
                                <div className={classes.fieldsWrapper}>
                                    <div>
                                        <Typography
                                            key="form-overview-text"
                                            className={`${classes.customFormSectionHeader} ${classes.uploadHeaderStyle}`}
                                            variant="h4"
                                        >
                                            Upload Brand Logo
                                        </Typography>
                                        <ImageUpload
                                            fieldInfo={{
                                                id: 'small_logo_blobname',
                                                name: 'Small Logo',
                                                type: 'upload',
                                                value: this.state.small_logo_file_details
                                                    ? this.state.small_logo_file_details
                                                    : '',
                                                variant: 'outlined',
                                                margin: 'none',
                                                inputprops: {
                                                    type: 'file',
                                                    error: 'false',
                                                    multiple: false,
                                                    accept: '.png, .jpg, .jpeg'
                                                },
                                                InputLabelProps: {
                                                    disableAnimation: true,
                                                    shrink: true
                                                },
                                                placeholder: 'Upload logo image',
                                                grid: 12,
                                                textTransform: 'none',
                                                admin: true
                                            }}
                                            // addFilesToRemove={this.addFilesToRemove}
                                            onChange={this.onChangeSmallFileUpload}
                                        />
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                        <div key="form-toolbar" className={classes.actionToolbar}>
                            <Grid container justifyContent="flex-start" spacing={2}>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        className={classes.actionNextButton}
                                        onClick={this.onClickOverviewSave}
                                        size="small"
                                        aria-label="Save overview"
                                    >
                                        Save Overview
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>

                <CustomSnackbar
                    key="conn-system-admin-overview-notification"
                    message={this.state.snackbar.message}
                    open={this.state.snackbar.open}
                    autoHideDuration={5000}
                    onClose={() => {
                        this.handleSnackbarState({ open: false });
                    }}
                    severity={this.state.snackbar.severity}
                />
            </div>
        );
    }
}

Overview.propTypes = {
    classes: PropTypes.object.isRequired,
    connSystemDashboardId: PropTypes.string.isRequired
};

export default withStyles((theme) => ({
    ...appScreenAdminStyle(theme),
    ...customFormStyle(theme)
}))(Overview);
