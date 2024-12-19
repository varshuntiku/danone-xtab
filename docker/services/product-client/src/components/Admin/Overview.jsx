import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import { Typography, Grid, Button, Paper } from '@material-ui/core';
import CustomSnackbar from '../../components/CustomSnackbar.jsx';

import CustomTextField from 'components/Forms/CustomTextField.jsx';
import ImageUpload from 'components/dynamic-form/inputFields/imageUpload.jsx';
import AppAdminExecutionEnvironments from 'components/Admin/ExecutionEnvironments.jsx';

import { saveAppOverview, applyApplicationTheme } from 'services/admin_overview.js';
import { getFunctionsList } from 'services/dashboard.js';
import CloneApplication from '../Utils/CloneApplication';
import ExportApp from '../Utils/ExportApp';
import InfoPopper from 'components/porblemDefinitionFramework/create/InfoPopper.jsx';
import { UserInfoContext } from 'context/userInfoContent.js';
import { connect } from 'react-redux';
import { getIndustries } from 'store/index';
import { decodeHtmlEntities } from 'util/decodeHtmlEntities.js';

import appScreenAdminStyle from 'assets/jss/appScreenAdminStyle.jsx';
import ColorThemeSelector from './ColorThemeSelector.jsx';
import WizardComponent from '../WizardComponent.jsx';
import sanitizeHtml from 'sanitize-html-react';
import clsx from 'clsx';

import * as _ from 'underscore';
import { axiosClient } from '../../services/httpClient.js';
import OverViewCollab from './OverViewCollab.jsx';
import PlacementRadio from './PlacementRadio.jsx';

const ClonePopoverInfo = `### Clone Application:
This will create an application in preview mode which can be modified to be published to production.

###Export Application:
Application data will be exported which can be used to create another application in other NucliOS environment.
###Note: The overview details, module settings, linked blueprint and application variables (if any) will not be carried forward to the exported application.
`;
class AppAdminOverview extends React.Component {
    static contextType = UserInfoContext;
    constructor(props) {
        super(props);

        this.props = props;
        this.state = {
            details: {
                app_name: props.app_info?.name ? props.app_info.name : '',
                industry: props.app_info?.industry ? props.app_info.industry : '',
                function: props.app_info?.function ? props.app_info.function : '',
                contact_email: props.app_info?.contact_email ? props.app_info.contact_email : '',
                logo_blob_name: props.app_info?.logo_blob_name ? props.app_info.logo_blob_name : '',
                small_logo_blob_name: props.app_info?.small_logo_blob_name
                    ? props.app_info.small_logo_blob_name
                    : '',
                industries: [],
                functions: [],
                description: props.app_info?.description
                    ? decodeHtmlEntities(sanitizeHtml(props.app_info.description))
                    : '',
                problem_area: props.app_info?.problem_area ? props.app_info.problem_area : '',
                industry_id: props.app_info?.industry_id ? props.app_info?.industry_id : '',
                function_id: props.app_info?.function_id ? props.app_info?.function_id : '',
                nac_collaboration: props.app_info?.modules?.nac_collaboration
                    ? props.app_info?.modules?.nac_collaboration
                    : false,
                leftNav: !props.app_info?.modules?.top_navbar ? true : false,
                topNav: props.app_info?.modules?.top_navbar ? true : false,
                top_navbar: props.app_info?.modules?.top_navbar ? true : false
            },
            logo_files_to_delete: [],
            emailErrorState: '',
            snackbar: {
                message: '',
                severity: 'info',
                open: false
            },
            logo_file_details: props.app_info?.logo_blob_name
                ? [{ filename: props.app_info.logo_blob_name, path: props.app_info.logo_url }]
                : false,
            small_logo_file_details: props.app_info?.small_logo_blob_name
                ? [
                      {
                          filename: props.app_info.small_logo_blob_name,
                          path: props.app_info.small_logo_url
                      }
                  ]
                : false,
            activeStep: 0,
            errors: {
                functions_error: false
            }
        };
    }

    async componentDidMount() {
        try {
            await getFunctionsList({
                callback: this.onResponseGetFunctionsList
            });
        } catch (error) {
            this.setState({
                errors: {
                    functions_error: true
                }
            });
        }

        if (this.props.industryData.length === 0) {
            this.props.getIndustries({});
        }
        if (this.props.industryData.length) {
            this.prepareIndustriesList();
        }
    }

    componentDidUpdate = (prevProps) => {
        if (
            this.props.industryData.length !== 0 &&
            this.props.industryData.length !== prevProps.industryData.length
        ) {
            this.prepareIndustriesList();
        }
    };

    prepareIndustriesList = () => {
        let industrylist = _.map(this.props.industryData, function (industryVal) {
            const industry_name = industryVal.industry_name;
            const industry_id = industryVal.id;
            return {
                label: `${industry_name.toLocaleLowerCase()} - ${industry_id}`,
                value: `${industry_name} - ${industry_id}`
            };
        });
        this.setState({
            industries: industrylist
        });
    };

    ValidateEmail = (input) => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input);
    };

    onResponseGetFunctionsList = (response_data) => {
        ReactDOM.flushSync(() => {
            this.setState({
                functions_list: response_data
            });
        });
        this.prepareFunctionsList();
    };

    prepareFunctionsList = () => {
        let functionsList = _.compact(
            _.map(this.state.functions_list, (item) => {
                if (item.industry_name === this.state.details.industry) {
                    const function_name = item.function_name;
                    const function_id = item.function_id;
                    return {
                        label: `${function_name.toLocaleLowerCase()} - ${function_id}`,
                        value: `${function_name} - ${function_id}`
                    };
                }
            })
        );
        this.setState({
            functions: functionsList
        });
    };

    onHandleFieldChange = (field_id, field_value) => {
        let details = this.state.details;
        const [value, id] = field_value.split(' - ').map((v) => v.trim());

        details[field_id] = value;
        details[`${field_id}_id`] = parseInt(id);

        this.setState({
            details: details
        });

        if (field_id === 'industry') {
            this.setState({
                ...this.state,
                details: { ...this.state.details, function: '', function_id: '' }
            });
            this.prepareFunctionsList();
        }
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
        if (logo_type === 'logo_blobname') {
            this.setState({
                ...this.state,
                logo_files_to_delete: [...this.state.logo_files_to_delete, file],
                logo_file_details: file_value
            });
        } else if (logo_type === 'small_logo_blobname') {
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
        const { app_info } = this.props;
        if (this.ValidateEmail(this.state.details.contact_email)) {
            this.setState({
                emailErrorState: ''
            });
            try {
                await saveAppOverview({
                    app_id: app_info.id,
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
        } else {
            this.setState({
                emailErrorState: 'Please Enter a Valid Email.'
            });
        }
    };

    onClickOverviewNext = () => {
        this.props.history.push('modules');
    };

    onResponseOverviewSave = async (response_data) => {
        const snackbarValues = {
            message:
                response_data?.status === 'success'
                    ? 'Saved Successfully'
                    : 'There was an error in Saving. Please try after some time',
            severity: response_data?.status || 'error',
            open: true
        };
        await this.removeFilesOnSave();
        this.handleSnackbarState(snackbarValues);
        this.props.parent_obj.refreshAppSilent();
    };

    onChangeFileUpload = (file_value) => {
        let details = this.state.details;

        details['logo_blob_name'] = file_value.length ? file_value[0].filename : '';
        this.setState({
            logo_file_details: file_value,
            details: details
        });
    };

    onChangeCollab = (bool) => {
        let details = this.state.details;
        details['nac_collaboration'] = bool;
        this.setState({ details: details });
    };
    onChangeNavPlacement = (bool, from) => {
        let details = this.state.details;
        if (from === 'left') {
            details['leftNav'] = bool;
            details['topNav'] = !bool;
            if (bool) details['top_navbar'] = !bool;
        } else {
            details['topNav'] = bool;
            details['leftNav'] = !bool;
            if (bool) details['top_navbar'] = bool;
        }
        this.setState({ details: details });
    };

    onChangeSmallFileUpload = (file_value) => {
        let details = this.state.details;

        details['small_logo_blob_name'] = file_value.length ? file_value[0].filename : '';
        this.setState({
            small_logo_file_details: file_value,
            details: details
        });
    };
    navigateToModules = () => {
        if (this.props.isDsWorkbench) {
            this.props.history.push(
                `/ds-workbench/project/${this.props.parent_obj.state.project_id}/deploy/applications/app/${this.props.app_info.id}/admin/modules`
            );
        } else {
            this.props.history.push('/app/' + this.props.app_info.id + '/admin/modules');
        }
    };

    handleStepClick = (step_index) => {
        this.setState({
            activeStep: step_index
        });
    };

    handleApplyTheme = async (themeId) => {
        try {
            await applyApplicationTheme({
                app_id: this.props.app_info.id,
                payload: { theme_id: themeId }
            });
            const snackbarValues = {
                message: 'Saved Successfully!',
                severity: 'success',
                open: true
            };
            this.handleSnackbarState(snackbarValues);
            this.props.parent_obj.refreshAppSilent();
        } catch (err) {
            const snackbarValues = {
                message: 'Failed to apply theme!',
                severity: 'error',
                open: true
            };
            this.handleSnackbarState(snackbarValues);
        }
    };

    render() {
        const { classes } = this.props;
        // let industry_value =
        //     this.state.details?.industry && this.state.details?.industry_id
        //         ? `${this.state.details.industry} - ${this.state.details.industry_id}`
        //         : '';
        // let function_value =
        //     this.state.details?.function && this.state.details?.function_id
        //         ? `${this.state.details.function} - ${this.state.details.function_id}`
        //         : '';
        let errors = {
            error_in_industry: this.state.details['industry_id'] === '',
            error_in_function:
                this.state.details['function_id'] === '' || this.state.errors['functions_error']
        };

        let edit_production_app = this.context.nac_roles[0]?.permissions.find(
            (permission) => permission.name === 'EDIT_PRODUCTION_APP'
        );
        let edit_preview_app = this.context.nac_roles[0]?.permissions.find(
            (permission) => permission.name === 'CREATE_PREVIEW_APP'
        );
        const editDisabled =
            this.props.app_info?.environment === 'prod' ? !edit_production_app : !edit_preview_app;

        const { error_in_industry, error_in_function } = errors;

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    marginLeft: '-1rem'
                }}
            >
                <div style={{ flexShrink: 0 }}>
                    <WizardComponent
                        selected={this.state.activeStep}
                        wizardItems={
                            // commenting this as we are re enabling color theme in uat and prod
                            // import.meta.env['REACT_APP_ENV'] === 'uat' ||
                            // import.meta.env['REACT_APP_ENV'] === 'prod'
                            //     ? [{ value: 0, title: 'Metadata', label: 'Metadata' }]
                            //     :
                            [
                                { value: 0, title: 'Metadata', label: 'Metadata' },
                                {
                                    value: 1,
                                    title: 'Color Theme',
                                    label: 'Color Theme'
                                }
                            ]
                        }
                        onSelect={(e, v) => this.handleStepClick(v)}
                    />
                </div>

                {this.state.activeStep == 0 ? (
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
                                                label: 'Application Name',
                                                id: 'app_name',
                                                disabled: editDisabled,
                                                fullWidth: true,
                                                value:
                                                    this.state.details &&
                                                    this.state.details['app_name']
                                                        ? this.state.details['app_name']
                                                        : ''
                                            }}
                                        />

                                        <OverViewCollab
                                            params={{
                                                value: this.state.details['nac_collaboration'],
                                                size: 'small'
                                            }}
                                            onChange={this.onChangeCollab}
                                        />

                                        <PlacementRadio
                                            params={{
                                                left: this.state.details['leftNav'],
                                                top: this.state.details['topNav']
                                            }}
                                            onChange={this.onChangeNavPlacement}
                                        />

                                        <CustomTextField
                                            parent_obj={this}
                                            field_info={{
                                                label: 'Description',
                                                id: 'description',
                                                disabled: editDisabled,
                                                fullWidth: true,
                                                value:
                                                    this.state.details &&
                                                    this.state.details['description']
                                                        ? this.state.details['description']
                                                        : ''
                                            }}
                                        />
                                        <CustomTextField
                                            parent_obj={this}
                                            field_info={{
                                                label: 'Problem Area',
                                                id: 'problem_area',
                                                disabled: editDisabled,
                                                fullWidth: true,
                                                value:
                                                    this.state.details &&
                                                    this.state.details['problem_area']
                                                        ? this.state.details['problem_area']
                                                        : ''
                                            }}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <div className={classes.fieldsWrapper}>
                                        <div className={classes.uploadContianer}>
                                            <Typography
                                                key="form-overview-text"
                                                className={`${classes.customFormSectionHeader} ${classes.uploadHeaderStyle}`}
                                                variant="h4"
                                            >
                                                Upload Login Screen Logo
                                            </Typography>
                                            <ImageUpload
                                                fieldInfo={{
                                                    id: 'logo_blobname',
                                                    name: 'Logo',
                                                    type: 'upload',
                                                    disableButton: editDisabled,
                                                    value: this.state.logo_file_details
                                                        ? this.state.logo_file_details
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
                                                editDisabled={editDisabled}
                                                // addFilesToRemove={this.addFilesToRemove}
                                                onChange={this.onChangeFileUpload}
                                            />
                                        </div>
                                        <div>
                                            <Typography
                                                key="form-overview-text"
                                                className={`${classes.customFormSectionHeader} ${classes.uploadHeaderStyle}`}
                                                variant="h4"
                                            >
                                                Upload Application Logo
                                            </Typography>
                                            <ImageUpload
                                                fieldInfo={{
                                                    id: 'small_logo_blobname',
                                                    name: 'Small Logo',
                                                    type: 'upload',
                                                    disableButton: editDisabled,
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
                                                editDisabled={editDisabled}
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
                                            disabled={
                                                error_in_industry ||
                                                error_in_function ||
                                                editDisabled
                                            }
                                            aria-label="Save overview"
                                        >
                                            Save Overview
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="outlined"
                                            className={classes.actionNextButton}
                                            onClick={() => this.setState({ activeStep: 1 })}
                                            size="small"
                                            aria-label="Next"
                                        >
                                            Next
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                        <Grid container spacing={2}>
                            <Grid item xs={6} md={6}>
                                <AppAdminExecutionEnvironments
                                    app_info={this.props.app_info}
                                    editDisabled={editDisabled}
                                    {...this.props}
                                />
                            </Grid>
                            {this.context.nac_roles[0]?.permissions.find(
                                (permission) => permission.name === 'CLONING_OF_APPLICATION'
                            ) && (
                                <Grid item xs={6} md={6}>
                                    <Paper className={classes.cloneApplication}>
                                        <InfoPopper
                                            classes={{
                                                root: classes.infoIcon
                                            }}
                                            size="large"
                                            popOverInfo={ClonePopoverInfo}
                                        />
                                        <CloneApplication appId={this.props.app_info?.id} />
                                        <ExportApp
                                            appId={this.props.app_info?.id}
                                            appName={this.props.app_info?.name}
                                        />
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>
                    </div>
                ) : null}
                {this.state.activeStep == 1 ? (
                    <div style={{ flex: 1 }}>
                        <ColorThemeSelector
                            appliedThemeId={this.props.app_info.theme_id}
                            onNext={this.navigateToModules}
                            onApplyTheme={this.handleApplyTheme}
                        />
                    </div>
                ) : null}

                <CustomSnackbar
                    key="app-admin-overview-notification"
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

AppAdminOverview.propTypes = {
    classes: PropTypes.object.isRequired,
    app_info: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        industryData: state.industryData.list
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getIndustries: (payload) => dispatch(getIndustries(payload))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    withStyles((theme) => ({ ...appScreenAdminStyle(theme), ...customFormStyle(theme) }))(
        AppAdminOverview
    )
);
