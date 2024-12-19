import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import { Typography, Grid, Button } from '@material-ui/core';
import { CustomDetailAppModule } from './ModuleComponents/customDetailAppModule';
import { editAppModules } from 'services/app.js';
import CustomSnackbar from '../CustomSnackbar';
import { UserInfoContext } from 'context/userInfoContent';
import { ManageResponsibility } from './ModuleComponents/ManageResponsibility';
import user_mgmt_form_data from './ModuleComponents/BackendModuleJsons/userManagmentModule.json';
import alerts_form_data from './ModuleComponents/BackendModuleJsons/alertModule.json';
import retain_flts_form_data from './ModuleComponents/BackendModuleJsons/retainFiltersModule.json';
import minerva_form_data from './ModuleComponents/BackendModuleJsons/minervaModule.json';
import copilot_form_data from './ModuleComponents/BackendModuleJsons/copilotModule.json';
import app_manual_form_data from './ModuleComponents/BackendModuleJsons/applicationManualModule.json';
import fullscreen_mode_form_data from './ModuleComponents/BackendModuleJsons/fullScreenModule.json';
import datastoy_form_data from './ModuleComponents/BackendModuleJsons/dataStoryModule.json';
import user_guide_form_data from './ModuleComponents/BackendModuleJsons/userGuideModule.json';
import slice_form_data from './ModuleComponents/BackendModuleJsons/sliceFilterModule.json';

class AppAdminModules extends React.Component {
    static contextType = UserInfoContext;
    constructor(props) {
        super(props);

        this.props = props;
        const module_props =
            props.app_info && props.app_info.modules ? props.app_info.modules : false;
        this.state = {
            loading: false,
            user_mgmt: {
                enabled: module_props && module_props.user_mgmt ? module_props.user_mgmt : false,
                app_screen_level: (module_props && module_props.user_mgmt_app_screen_level) || 0
            },
            dashboard: module_props && module_props.dashboard ? module_props.dashboard : false,
            fullscreen_mode:
                module_props && module_props.fullscreen_mode ? module_props.fullscreen_mode : false,
            alerts: module_props && module_props.alerts ? module_props.alerts : false,
            data_story: module_props && module_props.data_story ? module_props.data_story : false,
            retain_filters:
                module_props && module_props.retain_filters ? module_props.retain_filters : false,
            application_manual_url: {
                enabled:
                    module_props && module_props.application_manual_url
                        ? module_props.application_manual_url
                        : false,
                manual_url: module_props && module_props.manual_url ? module_props.manual_url : null
            },
            minerva: {
                enabled:
                    module_props && module_props.minerva && module_props.minerva.enabled
                        ? module_props.minerva.enabled
                        : false,
                tenant_id:
                    (module_props && module_props.minerva && module_props.minerva.tenant_id) || null
            },
            copilot: {
                enabled: module_props?.copilot?.enabled,
                app_id: module_props?.copilot?.app_id || null
            },
            user_guide: module_props && module_props.user_guide ? module_props.user_guide : false,
            slice: module_props && module_props.slice ? module_props.slice : false,
            snackbar: {
                message: '',
                severity: 'info',
                open: false
            },
            responsibilities: module_props?.responsibilities ? module_props.responsibilities : [],
            openResponsibilitiesModal: false
        };
        this.initial_state = { ...this.state };
    }

    handleChange = (name, detail) => (value) => {
        if (detail === 'app_screen_level' && this.state[name].enabled) {
            let module_state = { ...this.state[name] };
            module_state[detail] = Number(value);
            this.setState({ [name]: module_state });
        } else if (detail === 'manual_url' && this.state[name].enabled) {
            let module_state = { ...this.state[name] };
            module_state[detail] = value;
            this.setState({ [name]: module_state });
        } else if (detail === 'tenant_id' && this.state[name].enabled) {
            let module_state = { ...this.state[name] };
            module_state[detail] = value;
            this.setState({ [name]: module_state });
        } else if (name === 'copilot' && detail === 'app_id' && this.state[name].enabled) {
            let module_state = { ...this.state[name] };
            module_state[detail] = value;
            this.setState({ [name]: module_state });
        } else {
            if (
                name === 'user_mgmt' ||
                name === 'application_manual_url' ||
                name === 'minerva' ||
                name === 'copilot'
            ) {
                let module_state = { ...this.state[name] };
                module_state.enabled = !module_state.enabled;
                this.setState({ [name]: module_state }, () => {
                    if (!module_state.enabled) this.onClickModuleSave();
                });
                return;
            }
            if (
                [
                    'fullscreen_mode',
                    'data_story',
                    'retain_filters',
                    'slice',
                    'alerts',
                    'user_guide',
                    'dashboard'
                ].includes(name)
            ) {
                this.setState({ [name]: !this.state[name] }, () => this.onClickModuleSave());
                return;
            }
            this.setState({ [name]: !this.state[name] });
        }
    };
    onClickModuleReset = () => {
        this.setState(this.initial_state);
    };

    onClickModuleNext = () => {
        this.props.history.push('screens');
    };

    onClickModuleSave = (module) => {
        const app_modules = this.getAppModues();
        editAppModules({
            app_id: this.props.app_info.id,
            payload: app_modules,
            callback: (response_data) =>
                this.onResponseModuleSave(response_data, module, this.props.app_info.id)
        });
    };

    handleSnackbarState = (params, module) => {
        this.setState({
            snackbar: {
                message: params?.message || '',
                open: params?.open ? true : false,
                severity: params?.severity || 'info'
            }
        });
        setTimeout(() => {
            if (module === 'user_mgmt' && params?.severity === 'success') {
                if (this.props.isDsWorkbench) {
                    this.props.history.push(
                        `/ds-workbench/project/${this.props.parent_obj.state.project_id}/deploy/applications/app/${this.props.parent_obj.state.app_id}/user-mgmt/user-roles`
                    );
                } else {
                    this.props.history.push(`/app/${this.props.app_info.id}/user-mgmt/user-roles`);
                }
            }
        }, 1000);
    };
    onResponseModuleSave = (response_data, module, appId) => {
        const snackbarValues = {
            message:
                response_data?.status === 'success'
                    ? 'Saved Successfully'
                    : 'There was an error in Saving. Please try after some time',
            severity: response_data?.status || 'error',
            open: true
        };

        this.handleSnackbarState(snackbarValues, module);
        this.props.parent_obj.refreshAppSilent(appId);
    };

    getAppModues = () => {
        const modules = {
            ...this.props.app_info.modules,
            user_mgmt: this.state.user_mgmt.enabled,
            dashboard: this.state.dashboard,
            fullscreen_mode: this.state.fullscreen_mode,
            alerts: this.state.alerts,
            retain_filters: this.state.retain_filters,
            application_manual_url: this.state.application_manual_url.enabled,
            manual_url: this.state.application_manual_url.manual_url,
            user_mgmt_app_screen_level: this.state.user_mgmt.app_screen_level,
            data_story: this.state.data_story,
            minerva: this.state.minerva,
            user_guide: this.state.user_guide,
            slice: this.state.slice,
            copilot: this.state.copilot
        };
        const app_modules = {
            modules: modules
        };
        return app_modules;
    };

    render() {
        const { classes } = this.props;

        let edit_production_app = this.context.nac_roles[0]?.permissions.find(
            (permission) => permission.name === 'EDIT_PRODUCTION_APP'
        );
        let edit_preview_app = this.context.nac_roles[0]?.permissions.find(
            (permission) => permission.name === 'CREATE_PREVIEW_APP'
        );
        const editDisabled =
            this.props.app_info?.environment === 'prod' ? !edit_production_app : !edit_preview_app;

        return [
            <Typography
                key="modules-alert-text"
                className={classes.moduleSectionHeader}
                variant="h4"
            >
                Select Module Below
            </Typography>,
            <div key="modules-alert-body" className={classes.modulesContainer}>
                <Grid container spacing={2} xs={12} alignItems="stretch" justifyContent="start">
                    <Grid item className={classes.moduleItem} xs={2}>
                        <CustomDetailAppModule
                            module={this.state.user_mgmt}
                            detail={this.state.user_mgmt['app_screen_level']}
                            enabled={this.state.user_mgmt.enabled}
                            handleChange={this.handleChange('user_mgmt')}
                            handleDetailChange={this.handleChange('user_mgmt', 'app_screen_level')}
                            module_header="User Management"
                            module_backside_config={user_mgmt_form_data}
                            editDisabled={editDisabled}
                            onAddResponsibilities={() => {
                                this.setState({ openResponsibilitiesModal: true });
                            }}
                            buttonText={'Save and Configure'}
                            handleRoute={() => {
                                this.onClickModuleSave('user_mgmt');
                            }}
                        />
                    </Grid>
                    {import.meta.env['REACT_APP_ENABLE_MINERVA'] ? (
                        <Grid item className={classes.moduleItem} xs={2}>
                            <CustomDetailAppModule
                                module={this.state.minerva}
                                detail={this.state.minerva['tenant_id']}
                                enabled={this.state.minerva.enabled}
                                handleChange={this.handleChange('minerva')}
                                handleDetailChange={this.handleChange('minerva', 'tenant_id')}
                                module_header="Ask NucliOS"
                                module_backside_config={minerva_form_data}
                                editDisabled={editDisabled}
                                buttonText={'Save'}
                                handleRoute={() => this.onClickModuleSave()}
                            />
                        </Grid>
                    ) : null}

                    {import.meta.env['REACT_APP_ENABLE_COPILOT'] ? (
                        <Grid item className={classes.moduleItem} xs={2}>
                            <CustomDetailAppModule
                                module={this.state.copilot}
                                detail={this.state.copilot['app_id']}
                                enabled={this.state.copilot.enabled}
                                handleChange={this.handleChange('copilot')}
                                handleDetailChange={this.handleChange('copilot', 'app_id')}
                                module_header="Ask NucliOS - Copilot"
                                module_backside_config={copilot_form_data}
                                editDisabled={editDisabled}
                                buttonText={'Save'}
                                handleRoute={
                                    () => this.onClickModuleSave()
                                    // () =>
                                    // this.props.history.push('/platform-utils/copilot/')
                                }
                            />
                        </Grid>
                    ) : null}

                    <Grid item className={classes.moduleItem} xs={2}>
                        <CustomDetailAppModule
                            module={this.state.application_manual_url}
                            detail={this.state.application_manual_url['manual_url']}
                            enabled={this.state.application_manual_url.enabled}
                            handleChange={this.handleChange('application_manual_url')}
                            handleDetailChange={this.handleChange(
                                'application_manual_url',
                                'manual_url'
                            )}
                            module_header="Application Manual"
                            module_backside_config={app_manual_form_data}
                            editDisabled={editDisabled}
                            buttonText={'Save'}
                            handleRoute={() => {
                                this.onClickModuleSave();
                            }}
                        />
                    </Grid>
                    <Grid item className={classes.moduleItem} xs={2}>
                        <CustomDetailAppModule
                            module={this.state.alerts}
                            enabled={this.state.alerts}
                            handleChange={this.handleChange('alerts')}
                            module_header="Alerts And Notifications"
                            module_backside_config={alerts_form_data}
                            editDisabled={editDisabled}
                            buttonText={'Configure'}
                            handleRoute={() => {
                                if (this.props.isDsWorkbench) {
                                    this.props.history.push(
                                        `/ds-workbench/project/${this.props.parent_obj.state.project_id}/deploy/applications/app/${this.props.app_info.id}/admin/screens/${this.props.app_info.screens[0]?.id}`
                                    );
                                } else {
                                    this.props.history.push(
                                        `/app/${this.props.app_info.id}/admin/screens/${this.props.app_info.screens[0]?.id}`
                                    );
                                }
                            }}
                        />
                    </Grid>

                    <Grid item className={classes.moduleItem} xs={2}>
                        <CustomDetailAppModule
                            module={this.state.fullscreen_mode}
                            enabled={this.state.fullscreen_mode}
                            handleChange={this.handleChange('fullscreen_mode')}
                            module_header="Full Screen Mode"
                            module_backside_config={fullscreen_mode_form_data}
                            editDisabled={editDisabled}
                            buttonDisabled={true}
                        />
                    </Grid>

                    <Grid item className={classes.moduleItem} xs={2}>
                        <CustomDetailAppModule
                            module={this.state.data_story}
                            enabled={this.state.data_story}
                            handleChange={this.handleChange('data_story')}
                            module_header="Data Story"
                            module_backside_config={datastoy_form_data}
                            editDisabled={editDisabled}
                            buttonDisabled={true}
                        />
                    </Grid>

                    <Grid item className={classes.moduleItem} xs={2}>
                        <CustomDetailAppModule
                            module={this.state.retain_filters}
                            enabled={this.state.retain_filters}
                            handleChange={this.handleChange('retain_filters')}
                            module_header="Retain Filters"
                            module_backside_config={retain_flts_form_data}
                            editDisabled={editDisabled}
                            buttonDisabled={true}
                        />
                    </Grid>

                    <Grid item className={classes.moduleItem} xs={2}>
                        <CustomDetailAppModule
                            module={this.state.user_guide}
                            enabled={this.state.user_guide}
                            handleChange={this.handleChange('user_guide')}
                            module_header="User Guide"
                            module_backside_config={user_guide_form_data}
                            editDisabled={editDisabled}
                            buttonText={'Configure'}
                            handleRoute={() => {
                                if (this.props.isDsWorkbench) {
                                    this.props.history.push(
                                        `/ds-workbench/project/${this.props.parent_obj.state.project_id}/deploy/applications/app/${this.props.app_info.id}/admin/screens/${this.props.app_info.screens[0]?.id}`
                                    );
                                } else {
                                    this.props.history.push(
                                        `/app/${this.props.app_info.id}/admin/screens/${this.props.app_info.screens[0]?.id}`
                                    );
                                }
                            }}
                        />
                    </Grid>

                    <Grid item className={classes.moduleItem} xs={2}>
                        <CustomDetailAppModule
                            module={this.state.slice}
                            enabled={this.state.slice}
                            handleChange={this.handleChange('slice')}
                            module_header="Slicing Filters"
                            module_backside_config={slice_form_data}
                            editDisabled={editDisabled}
                            buttonDisabled={true}
                        />
                    </Grid>
                    <Grid item className={classes.moduleItem} xs={2}>
                        <CustomDetailAppModule
                            module={this.state.dashboard}
                            enabled={this.state.dashboard}
                            handleChange={this.handleChange('dashboard')}
                            module_header="Dashboard"
                            module_backside_config={fullscreen_mode_form_data}
                            editDisabled={editDisabled}
                            buttonDisabled={true}
                        />
                    </Grid>
                </Grid>

                {this.state.openResponsibilitiesModal && (
                    <ManageResponsibility
                        open={this.state.openResponsibilitiesModal}
                        app_id={this.props.app_info.id}
                        classes={classes}
                        responsibilities={this.state.responsibilities}
                        onDialogClose={(res) => {
                            this.setState({
                                openResponsibilitiesModal: false,
                                responsibilities: res
                            });
                            this.props.parent_obj.refreshAppSilent();
                        }}
                        handleRoute={() => this.props.history.push('/platform-utils/users')}
                    />
                )}

                {/* <ModuleFlipComponent modules_state={this.state} handleChange={this.handleChange} classes={classes}/> */}
                <div key="form-toolbar" className={classes.moduleActionBtns}>
                    <Grid
                        container
                        justifyContent="flex-start"
                        spacing={2}
                        className={classes.buttonsContainer}
                    >
                        <Grid item>
                            <Button
                                className={classes.resetActionNextButton}
                                onClick={this.onClickModuleReset}
                                variant="outlined"
                                title={'Reset all modules back to what they originally were!'}
                                disabled={editDisabled}
                                aria-label="RESET CHANGE"
                            >
                                Reset Change
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="outlined"
                                className={`${classes.actionNextButton} ${classes.customNextButtonStyle}`}
                                onClick={this.onClickModuleNext}
                                aria-label="NEXT"
                            >
                                Next
                            </Button>
                        </Grid>
                    </Grid>
                </div>
                <CustomSnackbar
                    key="app-admin-modules-notification"
                    message={this.state.snackbar.message}
                    open={this.state.snackbar.open}
                    autoHideDuration={5000}
                    onClose={() => {
                        this.handleSnackbarState({ open: false });
                    }}
                    severity={this.state.snackbar.severity}
                />
            </div>
        ];
    }
}

AppAdminModules.propTypes = {
    classes: PropTypes.object.isRequired,
    app_info: PropTypes.object.isRequired
};

export default withStyles((theme) => customFormStyle(theme), { withTheme: true })(AppAdminModules);
