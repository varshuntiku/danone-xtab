import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import customFormStyle from 'assets/jss/customFormStyle.jsx';
import appScreenWidgetEditorStyle from 'assets/jss/appScreenWidgetEditorStyle.jsx';
import AppScreenPackageDetails from '../AppScreenPackageDetails';
import { enableScreenComment } from '../../services/comments';
import DSStoreArtifacts from 'components/dsWorkbench/DSStoreArtifacts';

import {
    Typography,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Link,
    Tabs,
    Tab
} from '@material-ui/core';

import AppAdminCodeEditor from 'components/Admin/AppAdminCodeEditor.jsx';
import CustomSnackbar from 'components/CustomSnackbar.jsx';

import {
    testActionsGenerator,
    previewActionsHandler,
    saveScreenActionSettings,
    getDsStoreArtifactsList
} from 'services/screen.js';
import { decodeHtmlEntities } from '../../util/decodeHtmlEntities';

import clsx from 'clsx';
import AppSystemWidgetInfo from '../AppSystemWidgetInfo';
import CodxCircularLoader from '../CodxCircularLoader';
import { emit_change_codx_collab } from '../../util/collab_work';
import * as _ from 'underscore';
import { Checkbox } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
class AppScreenActionEditor extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.state = {
            screen_id: props.screen_id,
            app_id: props.app_id,
            activeStep: 0,
            loading_test: false,
            action_generator_response_timetaken: false,
            action_generator_response_size: false,
            action_generator_response_logs: false,
            action_generator_response_output: false,
            action_handler_response_timetaken: false,
            action_handler_response_size: false,
            action_handler_response_logs: false,
            action_handler_response_output: false,
            selected_action_generator_section: 'OUTPUT',
            selected_action_handler_section: 'OUTPUT',
            show_action_generator_component_info: null,
            show_action_handler_component_info: null,
            action_generator_component: null,
            action_handler_component: null,
            comment_enabled: this.props?.comment_enabled,
            customNotification: {},
            loading: false,
            showDsStoreArtifacts: false,
            ds_store_artifacts_value: '',
            selected_ds_store_artifact: null,
            ds_store_artifacts: []
        };
    }

    componentDidMount = () => {
        getDsStoreArtifactsList({
            app_id: this.state.app_id,
            callback: this.onResponseGetDsStoreArtifactsList
        });
    };

    onChangeActionGeneratorCode = (code_text) => {
        if (this.props.action_settings?.action_generator !== code_text) {
            this.props.onChange({
                action_generator: code_text,
                action_handler: this.props.action_settings?.action_handler
            });
        }
    };

    onChangeActionHandlerCode = (code_text) => {
        if (this.props.action_settings?.action_handler !== code_text) {
            this.props.onChange({
                action_generator: this.props.action_settings?.action_generator,
                action_handler: code_text
            });
        }
    };

    onResponseGetDsStoreArtifactsList = (response_data) => {
        if (response_data.status === 'error') {
            this.setState({
                showDsStoreArtifacts: false,
                notificationOpen: true,
                notification: {
                    message: 'Failed to fetch Ds Store Artifacts',
                    severity: 'error'
                }
            });
            return;
        }
        this.setState({
            showDsStoreArtifacts: response_data['results'].length !== 0,
            ds_store_artifacts: response_data['results']
        });
    };

    onClickActionGeneratorTest = () => {
        const { app_info, action_settings } = this.props;

        this.setState({
            loading_test: true
        });

        testActionsGenerator({
            app_id: app_info.id,
            payload: {
                code_string: action_settings?.action_generator
            },
            callback: this.onResponseTestActionGenerator
        });
    };
    handleEnableComment = async () => {
        const previousState = this.state.comment_enabled;
        this.setState({ comment_enabled: !previousState });

        const params = {
            payload: {
                state: !previousState,
                app_id: this.props.app_info.id,
                screen_id: this.props.screen_id
            }
        };

        try {
            this.setState({ loading: true });
            await enableScreenComment(params);
            this.setState({
                comment_enabled: !previousState,
                customNotification: {
                    severity: 'success',
                    message: `Comments ${previousState ? 'Disabled' : 'Enabled'}`
                },
                loading: false
            });
        } catch (error) {
            this.setState({
                comment_enabled: !previousState,
                customNotification: {
                    severity: 'error',
                    message: `Error while ${
                        previousState ? 'Disabling comments' : 'Enabling comments'
                    }`
                },
                loading: false
            });
            this.setState({ comment_enabled: previousState });
        }
        await this.props.refreshAppSilent();
    };

    onClickActionHandlerTest = () => {
        const { app_info, action_settings } = this.props;

        this.setState({
            loading_test: true
        });

        previewActionsHandler({
            app_id: app_info.id,
            payload: {
                code_string: action_settings?.action_handler
            },
            callback: this.onResponseTestActionHandler
        });
    };

    onResponseTestActionGenerator = (response_data) => {
        this.setState({
            loading_test: false,
            action_generator_response_timetaken: response_data.timetaken,
            action_generator_response_size: response_data.size,
            action_generator_response_output: response_data.output,
            action_generator_response_logs: response_data.logs
        });
    };

    onResponseTestActionHandler = (response_data) => {
        this.setState({
            loading_test: false,
            action_handler_response_timetaken: response_data.timetaken,
            action_handler_response_size: response_data.size,
            action_handler_response_output: response_data.output,
            action_handler_response_logs: response_data.logs
        });
    };

    handleStepClick = (active_step) => {
        this.setState({
            activeStep: active_step
        });
    };
    
    onClickSaveActionSettings = () => {
            const { app_info, screen_id, parent_obj, action_settings } = this.props;
    
            parent_obj.showLoadingSave();
    
            saveScreenActionSettings({
                app_id: app_info.id,
                screen_id: screen_id,
                payload: {
                    action_settings: {
                        action_generator: action_settings?.action_generator || '',
                        action_handler: action_settings?.action_handler || '',
                        default: null
                    }
                },
                callback: this.onResponseActionSave
            });
        };

    onResponseActionSave = async () => {
        const { parent_obj } = this.props;
        this.props.setUnsavedValue('screen_actions', false);
        emit_change_codx_collab(`${this.props.app_info.id}#nac_nitification`, {
            screenActionsUpdated: true
        });
        await this.props.refreshAppSilent();

        this.setState({
            notificationOpen: true,
            notification: {
                message: 'Action settings saved successfully !'
            }
        });

        parent_obj.hideLoadingSave();
    };

    onClickActionGeneratorInfoComponent = () => {
        this.setState({
            show_action_generator_component_info: true
        });
    };

    onClickActionHandlerInfoComponent = () => {
        this.setState({
            show_action_handler_component_info: true
        });
    };

    onCloseActionGeneratorInfoComponent = () => {
        this.setState({
            show_action_generator_component_info: false
        });
    };

    onCloseActionHandlerInfoComponent = () => {
        this.setState({
            show_action_handler_component_info: false
        });
    };

    onFieldChange = (field_id, field_value) => {
        this.setState({
            [field_id]: field_value
        });
    };

    onClickAppVariable = () => {
        navigator.clipboard.writeText("_codx_app_vars_['" + this.state.app_variable + "']");
    };

    onClickAppFunction = () => {
        navigator.clipboard.writeText(
            this.props.app_functions.find((el) => el.key === this.state.app_function).test
        );
    };

    render() {
        const { classes, system_widgets, app_variables, app_functions, action_settings } =
            this.props;
        let selected_action_generator_info = false;
        if (this.state.action_generator_component) {
            selected_action_generator_info = _.find(
                system_widgets,
                function (system_widget) {
                    return system_widget.name === this.state.action_generator_component;
                },
                this
            );
        }
        let selected_action_handler_info = false;
        if (this.state.action_handler_component) {
            selected_action_handler_info = _.find(
                system_widgets,
                function (system_widget) {
                    return system_widget.name === this.state.action_handler_component;
                },
                this
            );
        }

        return (
            <Grid container spacing={2} style={{ height: '100%' }}>
                <Grid item xs={9} style={{ height: '100%' }}>
                    <div>
                        <Typography variant="h4" className={classes.sectionEditorHeading}>
                            Setup Actions
                        </Typography>
                        <div>
                            <Tabs
                                value={this.state.activeStep}
                                onChange={(e, v) => this.handleStepClick(v)}
                                aria-label="ant example"
                                className={classes.subSectionsTabs}
                                data-testid="tabs"
                            >
                                <Tab label="Action Generator" />
                                <Tab label="Action Handler" />
                            </Tabs>
                            {this.state.activeStep === 0 && (
                                <AppAdminCodeEditor
                                    code={action_settings?.action_generator || ''}
                                    onChangeCodeCallback={this.onChangeActionGeneratorCode}
                                    output={decodeHtmlEntities(
                                        this.state.action_generator_response_output
                                    )}
                                    timetaken={this.state.action_generator_response_timetaken}
                                    size={this.state.action_generator_response_size}
                                    logs={this.state.action_generator_response_logs}
                                    readOnly={this.props.editDisabled || !this.props.editMode}
                                    extraClasses={{
                                        editorSection: classes.editorSectionShort,
                                        outputSection: classes.outputSection
                                    }}
                                    data-testid="code-editor-action-generator"
                                />
                            )}
                            {this.state.activeStep === 1 && (
                                <AppAdminCodeEditor
                                    code={action_settings?.action_handler || ''}
                                    onChangeCodeCallback={this.onChangeActionHandlerCode}
                                    output={decodeHtmlEntities(
                                        this.state.action_handler_response_output
                                    )}
                                    timetaken={this.state.action_handler_response_timetaken}
                                    size={this.state.action_handler_response_size}
                                    logs={this.state.action_handler_response_logs}
                                    readOnly={this.props.editDisabled || !this.props.editMode}
                                    extraClasses={{
                                        editorSection: classes.editorSectionShort,
                                        outputSection: classes.outputSection
                                    }}
                                    data-testid="code-editor-action-handler"
                                />
                            )}
                            <div className={classes.layoutQuestionToolbar}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={this.onClickSaveActionSettings}
                                    disabled={
                                        this.props.editDisabled ||
                                        !this.props.unsavedValues?.screen_actions ||
                                        this.props.loading_save ||
                                        !this.props.editMode
                                    }
                                    aria-label="Save Actions"
                                    data-testid="save-actions-button"
                                >
                                    Save Actions
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={
                                        this.state.activeStep === 0
                                            ? this.onClickActionGeneratorTest
                                            : this.onClickActionHandlerTest
                                    }
                                    disabled={
                                        action_settings?.action_generator ||
                                        action_settings?.action_handler
                                            ? this.state.loading_test
                                            : true
                                    }
                                    startIcon={
                                        this.state.loading_test ? (
                                            <div style={{ position: 'relative', width: '2rem' }}>
                                                <CodxCircularLoader
                                                    size={30}
                                                    center
                                                    data-testid="loader"
                                                />
                                            </div>
                                        ) : null
                                    }
                                    aria-label="Test actions"
                                    data-testid="test-actions-button"
                                >
                                    Test Actions
                                </Button>
                            </div>
                        </div>
                        <CustomSnackbar
                            open={
                                this.state.notificationOpen && this.state.notification?.message
                                    ? true
                                    : false
                            }
                            autoHideDuration={
                                this.state.notification?.autoHideDuration === undefined
                                    ? 3000
                                    : this.state.notification?.autoHideDuration
                            }
                            onClose={() => this.setState({ notificationOpen: false })}
                            severity={this.state.notification?.severity || 'success'}
                            message={this.state.notification?.message}
                        />
                    </div>
                </Grid>
                <Grid item xs={3} style={{ paddingTop: '6rem' }}>
                    <Typography variant="h5" className={classes.defaultColor}>
                        Code Templates
                    </Typography>
                    <Grid container spacing={0}>
                        <Grid item xs={12} className={classes.codeTemplateItem}>
                            <FormControl
                                fullWidth
                                className={clsx(
                                    classes.widgetConfigFormControl,
                                    classes.widgetConfigSelect
                                )}
                                data-testid="form-control-application-variables"
                            >
                                <InputLabel
                                    id="screen-overview-image"
                                    className={classes.widgetConfigCheckboxLabel}
                                    data-testid="input-label-application-variables"
                                >
                                    Application Variables
                                </InputLabel>
                                <Select
                                    classes={{
                                        icon: classes.widgetConfigIcon
                                    }}
                                    variant="filled"
                                    labelId="screen-overview-image"
                                    id="screen_overview_image"
                                    value={this.state.app_variable ? this.state.app_variable : ''}
                                    label="Application Variables"
                                    MenuProps={{ className: classes.menu }}
                                    onChange={(event) =>
                                        this.onFieldChange('app_variable', event.target.value)
                                    }
                                    data-testid="app-variables-select"
                                >
                                    {app_variables &&
                                        !this.state.loading_system_widgets &&
                                        _.map(app_variables, function (app_variable) {
                                            return (
                                                <MenuItem
                                                    key={'app-variable-' + app_variable}
                                                    value={app_variable}
                                                    data-testid={`menu-item-application-variable-${app_variable}`}
                                                >
                                                    <Typography
                                                        className={clsx(
                                                            classes.f1,
                                                            classes.defaultColor
                                                        )}
                                                        variant="h5"
                                                    >
                                                        {app_variable}
                                                    </Typography>
                                                </MenuItem>
                                            );
                                        })}
                                </Select>
                            </FormControl>
                            {this.state.app_variable && (
                                <Link
                                    component={'button'}
                                    className={classes.viewDocs}
                                    onClick={() => this.onClickAppVariable()}
                                >
                                    Copy variable
                                </Link>
                            )}
                        </Grid>
                        <Grid item xs={12} className={classes.codeTemplateItem}>
                            <FormControl
                                fullWidth
                                className={clsx(
                                    classes.widgetConfigFormControl,
                                    classes.widgetConfigSelect
                                )}
                            >
                                <InputLabel
                                    id="screen-overview-image"
                                    className={classes.widgetConfigCheckboxLabel}
                                >
                                    Application Functions
                                </InputLabel>
                                <Select
                                    classes={{
                                        icon: classes.widgetConfigIcon
                                    }}
                                    variant="filled"
                                    labelId="screen-overview-image"
                                    id="screen_overview_image"
                                    value={this.state.app_function ? this.state.app_function : ''}
                                    label="Application Functions"
                                    MenuProps={{ className: classes.menu }}
                                    onChange={(event) =>
                                        this.onFieldChange('app_function', event.target.value)
                                    }
                                    data-testid="app-functions-select"
                                    aria-label="Application Functions"
                                >
                                    {app_functions &&
                                        !this.state.loading_system_widgets &&
                                        _.map(app_functions, function (app_function) {
                                            return (
                                                <MenuItem
                                                    key={'filter-system-widget-' + app_function.key}
                                                    value={app_function.key}
                                                    title={app_function.desc}
                                                >
                                                    <Typography
                                                        className={clsx(
                                                            classes.f1,
                                                            classes.defaultColor
                                                        )}
                                                        variant="h5"
                                                    >
                                                        {app_function.key}
                                                    </Typography>
                                                </MenuItem>
                                            );
                                        })}
                                </Select>
                            </FormControl>
                            {this.state.app_function ? (
                                this.props.app_functions.find(
                                    (el) => el.key === this.state.app_function
                                ).test ? (
                                    <Link
                                        component={'button'}
                                        aria-disabled
                                        className={classes.viewDocs}
                                        onClick={() => this.onClickAppFunction()}
                                    >
                                        Copy Code
                                    </Link>
                                ) : (
                                    <Typography
                                        variant="h5"
                                        className={clsx(classes.defaultColor, classes.fontSize3)}
                                    >
                                        No Code Available
                                    </Typography>
                                )
                            ) : null}
                        </Grid>
                        {this.state.showDsStoreArtifacts && (
                            <DSStoreArtifacts
                                classes={classes}
                                state={this.state}
                                parent_obj={this}
                                ds_store_artifacts={this.state.ds_store_artifacts}
                            />
                        )}
                        {this.state.activeStep === 0 ? (
                            <Grid item xs={12} className={classes.codeTemplateItem}>
                                <FormControl
                                    fullWidth
                                    variant="filled"
                                    className={clsx(
                                        classes.widgetConfigFormControl,
                                        classes.widgetConfigSelect
                                    )}
                                >
                                    <InputLabel
                                        id="screen-overview-image"
                                        className={classes.widgetConfigCheckboxLabel}
                                    >
                                        Action Generator Component
                                    </InputLabel>
                                    <Select
                                        classes={{
                                            icon: classes.widgetConfigIcon
                                        }}
                                        labelId="screen-overview-image"
                                        id="screen_overview_image"
                                        value={
                                            this.state.action_generator_component
                                                ? this.state.action_generator_component
                                                : ''
                                        }
                                        label="Action Generator Component"
                                        MenuProps={{ className: classes.menu }}
                                        onChange={(event) =>
                                            this.onFieldChange(
                                                'action_generator_component',
                                                event.target.value
                                            )
                                        }
                                    >
                                        {this.props.system_widgets &&
                                            !this.state.loading_system_widgets &&
                                            _.map(
                                                _.filter(
                                                    this.props.system_widgets,
                                                    function (system_widget) {
                                                        return system_widget.types.includes(
                                                            'SCREEN_ACTION_GENERATOR'
                                                        );
                                                    }
                                                ),
                                                function (filtered_system_widget) {
                                                    return (
                                                        <MenuItem
                                                            key={
                                                                'ingest-system-widget-' +
                                                                filtered_system_widget.name
                                                            }
                                                            value={filtered_system_widget.name}
                                                        >
                                                            <Typography
                                                                className={clsx(
                                                                    classes.f1,
                                                                    classes.defaultColor
                                                                )}
                                                                variant="h5"
                                                            >
                                                                {filtered_system_widget.name}
                                                            </Typography>
                                                        </MenuItem>
                                                    );
                                                }
                                            )}
                                    </Select>
                                </FormControl>
                                {this.state.action_generator_component && (
                                    <Link
                                        component={'button'}
                                        className={classes.viewDocs}
                                        onClick={() => this.onClickActionGeneratorInfoComponent()}
                                    >
                                        View Docs
                                    </Link>
                                )}
                                {this.state.show_action_generator_component_info &&
                                    this.state.action_generator_component && (
                                        <AppSystemWidgetInfo
                                            parent_obj={this}
                                            widget_info={selected_action_generator_info}
                                            closeCallback={'onCloseActionGeneratorInfoComponent'}
                                            data-testid="app-system-widget-info"
                                        />
                                    )}
                            </Grid>
                        ) : null}
                        {this.state.activeStep === 1 ? (
                            <Grid item xs={12} className={classes.codeTemplateItem}>
                                <FormControl
                                    fullWidth
                                    className={clsx(
                                        classes.widgetConfigFormControl,
                                        classes.widgetConfigSelect
                                    )}
                                >
                                    <InputLabel
                                        id="screen-overview-image"
                                        className={classes.widgetConfigCheckboxLabel}
                                    >
                                        Action Handler Component
                                    </InputLabel>
                                    <Select
                                        classes={{
                                            icon: classes.widgetConfigIcon
                                        }}
                                        variant="filled"
                                        labelId="screen-overview-image"
                                        id="screen_overview_image"
                                        value={
                                            this.state.action_handler_component
                                                ? this.state.action_handler_component
                                                : ''
                                        }
                                        label="Action Handler Component"
                                        MenuProps={{ className: classes.menu }}
                                        onChange={(event) =>
                                            this.onFieldChange(
                                                'action_handler_component',
                                                event.target.value
                                            )
                                        }
                                    >
                                        {this.props.system_widgets &&
                                            !this.state.loading_system_widgets &&
                                            _.map(
                                                _.filter(
                                                    this.props.system_widgets,
                                                    function (system_widget) {
                                                        return system_widget.types.includes(
                                                            'SCREEN_ACTION_HANDLER'
                                                        );
                                                    }
                                                ),
                                                function (filtered_system_widget) {
                                                    return (
                                                        <MenuItem
                                                            key={
                                                                'filter-system-widget-' +
                                                                filtered_system_widget.name
                                                            }
                                                            value={filtered_system_widget.name}
                                                        >
                                                            <Typography
                                                                className={clsx(
                                                                    classes.f1,
                                                                    classes.defaultColor
                                                                )}
                                                                variant="h5"
                                                            >
                                                                {filtered_system_widget.name}
                                                            </Typography>
                                                        </MenuItem>
                                                    );
                                                }
                                            )}
                                    </Select>
                                </FormControl>
                                {this.state.action_handler_component && (
                                    <Link
                                        component={'button'}
                                        aria-disabled
                                        className={classes.viewDocs}
                                        onClick={() => this.onClickActionHandlerInfoComponent()}
                                    >
                                        View Docs
                                    </Link>
                                )}
                                {this.state.show_action_handler_component_info &&
                                    this.state.action_handler_component && (
                                        <AppSystemWidgetInfo
                                            parent_obj={this}
                                            widget_info={selected_action_handler_info}
                                            closeCallback={'onCloseActionHandlerInfoComponent'}
                                        />
                                    )}
                            </Grid>
                        ) : null}
                    </Grid>
                    <Grid container spacing={0} data-testid="package-list-container">
                        <AppScreenPackageDetails packages={this.props.packageList} />
                    </Grid>
                    <Grid container spacing={0}>
                        <span className={classes.commentSelector}>
                            {!this.state.loading ? (
                                <Checkbox
                                    checked={this.state.comment_enabled}
                                    onChange={() => this.handleEnableComment()}
                                    className={classes.checkBox}
                                    data-testid="commennt-checkbox"
                                />
                            ) : (
                                <CircularProgress
                                    center
                                    size={30}
                                    className={classes.loader}
                                    data-testid="loader"
                                />
                            )}
                            Enable Collaboration
                        </span>
                    </Grid>
                    <CustomSnackbar
                        open={this.state.customNotification?.message}
                        autoHideDuration={2000}
                        onClose={() => this.setState({ customNotification: {} })}
                        severity={this.state.customNotification?.severity}
                        message={this.state.customNotification?.message}
                        data-testid="custom-snackbar"
                    />
                </Grid>
            </Grid>
        );
    }
}

AppScreenActionEditor.propTypes = {
    classes: PropTypes.object.isRequired,
    app_info: PropTypes.object.isRequired
};

export default withStyles(
    (theme) => ({
        ...customFormStyle(theme),
        ...appScreenWidgetEditorStyle(theme)
    }),
    { withTheme: true }
)(AppScreenActionEditor);
