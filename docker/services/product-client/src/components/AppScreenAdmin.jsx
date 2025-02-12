import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import appScreenAdminStyle from 'assets/jss/appScreenAdminStyle.jsx';
import customFormStyle from 'assets/jss/customFormStyle.jsx';

import { ReactComponent as ReviewImage } from 'assets/img/Review.svg';
import { ReactComponent as AnalyzeImage } from 'assets/img/Analyse.svg';
import { ReactComponent as SimulateImage } from 'assets/img/Simulate.svg';
import { ReactComponent as WikiImage } from 'assets/img/wiki.svg';
import { ReactComponent as GuideImage } from 'assets/img/user_guide.svg';
import {
    getLayoutOptions,
    updateLayoutOptions,
    insertLayoutOptions,
    getScreenOverViewImages
} from 'services/dashboard.js';
import noLayout from 'assets/img/NoCustomLayout.svg';
import customLayout_widgetOrientation from '../assets/img/customLayout_widgetOrientation.png';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import {
    Typography,
    Grid,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
    Link,
    IconButton,
    ButtonBase,
    Tab,
    Tabs
} from '@material-ui/core';
import { FormControl, TextField, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Close } from '@material-ui/icons';

import { getWidgets } from 'services/screen.js';
import { getDynamicExecEnvAppMapping } from 'services/execution_environments_utils.js';

import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import AppScreenLayoutSelector from 'components/AppScreenLayoutSelector.jsx';
import AppScreen from 'components/AppScreen.jsx';
import CustomSnackbar from 'components/CustomSnackbar.jsx';
import AppSystemWidgetInfo from 'components/AppSystemWidgetInfo.jsx';
import AppScreenWidgetEditor from 'components/Admin/AppScreenWidgetEditor.jsx';
import AppScreenActionEditor from 'components/Admin/AppScreenActionEditor.jsx';
import AppAdminCodeEditor from 'components/Admin/AppAdminCodeEditor.jsx';

import { testFilters, saveScreenOverview, saveScreenFilterSettings } from 'services/filters.js';
import {
    getScreenConfig,
    getSystemWidgets,
    saveScreenWidgets,
    getDsStoreArtifactsList
} from 'services/screen.js';
import clsx from 'clsx';
import ConfirmPopup from './confirmPopup/ConfirmPopup';
import { fetchActionSettingsUIAC, fetchFilterUIAC, fetchWidgetUIAC } from '../services/app_admin';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import AppScreenLayout from './AppScreenLayout';
import ArchivedUIaC from './ArchivedUIaC';
import AppScreenPackageDetails from './AppScreenPackageDetails';
import CodxCollabWork from './CodxCollabWork';
import ScreenLevelBreadcrumb from './Admin/ScreenLevelBreadcrumb';
import { emit_change_codx_collab } from '../util/collab_work';
import UserGuideDialog from './UserGuideDialog';
import sanitizeHtml from 'sanitize-html-react';
import { decodeHtmlEntities } from '../util/decodeHtmlEntities';
import InfoPopup from './custom/InfoPopup.jsx';
import * as _ from 'underscore';
import ModalComponent from './connectedSystem/Intelligence/ModalComponent.jsx';
import FileUpload from './dynamic-form/inputFields/fileUpload.jsx';
import CustomLayout from 'components/CustomLayout/CustomLayout.jsx';
import { MyProvider } from 'context/LayoutContext';
import { ReactComponent as CloseIcon } from 'assets/img/Ic_Close.svg';
import DSStoreArtifacts from 'components/dsWorkbench/DSStoreArtifacts';

class AppScreenAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        var screen_id = props.screen_id;
        var screen_index = false;
        var filter_code = '';
        var filter_ingest_code = '';
        var action_settings = '';
        var screen_description = '';
        var rating_url = '';
        var screen_name = '';
        var selected_layout = false;
        var screen_auto_refresh = false;
        var screen_image = 'default';
        var screen_filters_open = false;

        this.state = {
            app_id: props.app_info.id,
            screen_id: screen_id,
            screen_index: screen_index,
            screen_name: screen_name,
            widgets: false,
            system_widgets: true,
            selected_filters: props.app_info.modules.filters ? false : {},
            loading: true,
            loading_config: true,
            loading_test: false,
            layout_question: '',
            selected_widget_type: false,
            selected_widget_index: false,
            selected_widget_info: {},
            selected_widget_id: false,
            result_options: false,
            admin_details: false,
            screen_filters_values: {
                defaultValues: {},
                dataValues: {}
            },
            actions: false,
            filter_ingest_code: filter_ingest_code,
            selected_filter_ingest_component: false,
            filter_code: filter_code,
            selected_filter_component: false,
            filter_response_logs: false,
            filter_response_timetaken: false,
            filter_response_size: false,
            screen_description: screen_description ? sanitizeHtml(screen_description) : '',
            rating_url: rating_url,
            screen_auto_refresh: screen_auto_refresh,
            screen_image: screen_image,
            screen_filters_open: screen_filters_open,
            selected_layout: selected_layout,
            activeStep: 0,
            activeStepLayout: 0,
            selected_filter_section: 'OUTPUT',
            layout_metrics: false,
            layout_visuals: false,
            show_visual_code_component: false,
            show_information_code_component: false,
            show_widget_filter_options: false,
            action_settings: action_settings,
            confirmationDialogOpen: false,
            loading_save: false,
            manageGuideOpenAdmin: false,
            editDisabled: props.editDisabled,
            packageList: [],
            customLayout: false,
            custom_kpi: 0,
            custom_graph: 0,
            custom_graphType: '',
            custom_orientation: false,
            custom_graphWidth: '',
            custom_graphHeight: '',
            layout_options: [],
            custom_error: false,
            openIconDialog: false,
            screen_icon_urls: [],
            currentIndex: 0,
            itemsPerPage: 4,
            custom_layout_options: [],
            comment_enabled: null,
            templateStep: 0,
            showDsStoreArtifacts: false,
            ds_store_artifacts_value: '',
            selected_ds_store_artifact: null,
            ds_store_artifacts: [],
            selected_screen_widget_filters: ''
        };
    }
    selected_screen_widget_filters = {};

    getLayoutOptionsCallBack = (response) => {
        if (response.length == 0) {
            insertLayoutOptions({
                payload: {
                    app_id: this.props?.app_info?.id
                },
                callback: this.updateLayoutOptionsCallBack
            });
        }
        let response_options = response.length > 0 ? response[0]?.layout_options : [];
        const filteredArray = response_options.filter((item) => item?.custom_layout === true);
        const predefinedArray = response_options.slice(
            0,
            response_options.length - filteredArray.length
        );
        this.setState({
            layout_options: predefinedArray || [],
            custom_layout_options: filteredArray || []
        });
    };

    getScreenOverViewIcons = (response) => {
        this.setState({
            screen_icon_urls: response,
            openIconDialog: false
        });
    };

    updateLayoutOptionsCallBack = () => {
        getLayoutOptions({
            payload: {
                app_id: this.props?.app_info?.id
            },
            callback: this.getLayoutOptionsCallBack
        });
    };

    async componentDidMount() {
        getLayoutOptions({
            payload: {
                app_id: this.props?.app_info?.id
            },
            callback: this.getLayoutOptionsCallBack
        });
        // await getScreenOverViewImages({
        //     callback: this.getScreenOverViewIcons
        // });
        if (this.state.screen_id) {
            try {
                await getScreenConfig({
                    app_id: this.state.app_id,
                    screen_id: this.state.screen_id,
                    callback: this.onResponseScreenConfig
                });
            } catch (err) {
                this.setState({
                    loading: false,
                    loading_config: false,
                    notificationOpen: true,
                    notification: {
                        message: err?.message || 'Failed to fetch screen config.Try again!',
                        severity: 'error'
                    }
                });
            }
            await getWidgets({
                app_id: this.state.app_id,
                screen_id: this.state.screen_id,
                callback: this.onResponseGetWidgets
            });

            if (import.meta.env['REACT_APP_DEE_ENV_ENABLED']) {
                getDynamicExecEnvAppMapping({
                    appId: this.state.app_id,
                    queryParams: 'default_env=true&fetch_execution_environment_details=true',
                    callback: (d) => {
                        let packages = d?.packages?.map((el, ind) => ({
                            title: el.name,
                            version: el.version,
                            id: ind + 1
                        }));
                        this.setState({
                            packageList: packages
                        });
                    }
                });
            }

            try {
                await fetchFilterUIAC({
                    app_id: this.state.app_id,
                    screen_id: this.state.screen_id,
                    callback: (d) => {
                        this.setState({
                            filter_code: d.code
                        });
                    }
                });
            } catch (err) {
                this.setState({
                    notificationOpen: true,
                    notification: {
                        message: 'Failed to fetch filtered UIAC data.Try again!',
                        severity: 'error'
                    }
                });
            }

            try {
                await fetchActionSettingsUIAC({
                    app_id: this.state.app_id,
                    screen_id: this.state.screen_id,
                    callback: (d) => {
                        this.setState({
                            action_settings: d
                        });
                    }
                });
            } catch (err) {
                this.setState({
                    notificationOpen: true,
                    notification: {
                        message: 'Failed to fetch action setting UIAC data. Try again!',
                        severity: 'error'
                    }
                });
            }
        }

        getSystemWidgets({
            app_id: this.state.app_id,
            callback: this.onResponseSystemWidgets
        });

        getDsStoreArtifactsList({
            app_id: this.state.app_id,
            callback: this.onResponseGetDsStoreArtifactsList
        });
    }

    componentDidUpdate(preProps) {
        if (preProps.editMode !== this.props.editMode && this.props.editMode === true) {
            getWidgets({
                app_id: this.state.app_id,
                screen_id: this.state.screen_id,
                callback: this.onResponseGetWidgets
            });
        }
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = () => {
            return;
        };
    }

    onResponseScreenConfig = (response_data) => {
        var screen_image = this.state.screen_image;
        this.setState({
            loading_config: false,
            selected_layout: {
                ...this.state.selected_layout,
                graph_type: response_data.graph_type ? response_data.graph_type : false,
                horizontal: response_data.horizontal ? response_data.horizontal : false,
                graph_width: response_data.graph_width ? response_data.graph_width : false,
                graph_height: response_data.graph_height ? response_data.graph_height : false
            },
            screen_description: response_data.screen_description
                ? response_data.screen_description
                : false,
            rating_url: response_data.rating_url ? response_data.rating_url : false,
            screen_image:
                response_data.screen_image === 'false' || response_data.screen_image === null
                    ? screen_image
                    : response_data.screen_image,
            screen_name: response_data?.screen_name,
            packageList: response_data?.available_packages,
            comment_enabled: response_data?.comment_enabled
        });
    };

    onResponseSystemWidgets = (response_data) => {
        if (response_data.status === 'error') {
            this.setState({
                loading_system_widgets: false,
                notificationOpen: true,
                notification: {
                    message: 'Failed to fetch system widgets. Try again!',
                    severity: 'error'
                }
            });
            return;
        }
        this.setState({
            loading_system_widgets: false,
            system_widgets: response_data['data']['system_widgets'],
            app_variables: response_data['data']['app_variables'],
            app_functions: response_data['data']['app_functions']
        });
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

    onResponseGetWidgets = (response_data) => {
        if (response_data.status === 'error') {
            this.setState({
                loading: false,
                notificationOpen: true,
                notification: {
                    message: 'Failed to fetch widgets. Try again!',
                    severity: 'error'
                }
            });
            return;
        }
        this.setState({
            loading: false,
            widgets: response_data,
            selected_widget_id: null,
            show_visual_code_component: false,
            selected_layout: {
                ...this.state.selected_layout,
                no_labels: _.filter(response_data, function (widget_item) {
                    return widget_item.is_label;
                }).length,
                no_graphs: _.filter(response_data, function (widget_item) {
                    return !widget_item.is_label;
                }).length
            }
        });

        response_data?.forEach((el) => {
            try {
                fetchWidgetUIAC({
                    app_id: this.state.app_id,
                    screen_id: this.state.screen_id,
                    widget_id: el.id,
                    callback: (d) => {
                        this.setState({
                            widgets: response_data.map((w) => {
                                if (w.id === el.id) {
                                    w.code = d.code;
                                    w.filter_code = d?.filter_code;
                                }
                                return w;
                            })
                        });
                    }
                });
            } catch (err) {
                this.setState({
                    notificationOpen: true,
                    notification: {
                        message: 'Failed to fetch UIAC widget.Try again!',
                        severity: 'error'
                    }
                });
            }
        });
    };

    getWidgetData = () => {};

    layoutQuestionToggle = (event) => {
        this.setState({
            layout_question: event.target.value
        });
    };

    colseModal = () => {
        this.setState({
            openIconDialog: false
        });
    };

    onClickLayoutWidget = (widget_id, is_label) => {
        var widgetDetails = this.state.widgets?.find((widget) => widget.id === widget_id);
        this.setState({
            selected_widget_index: widgetDetails.widget_index,
            selected_widget_type: is_label ? 'METRIC' : 'GRAPH',
            selected_widget_info: widgetDetails,
            selected_widget_id: widget_id,
            visual_component: null,
            show_visual_code_component: false,
            show_information_code_component: false
        });
    };

    onHandleFieldChange = (field_id, field_value, field_params) => {
        var selected_widget_info = this.state.selected_widget_info;

        selected_widget_info[field_params.field_id] = field_value;

        var widgets = this.state.widgets;
        widgets[this.state.selected_widget_index]['config'] = selected_widget_info;

        this.setState({
            selected_widget_info: selected_widget_info,
            widgets: widgets
        });
    };

    onFieldChange = (field_id, field_value, valueChagedKey) => {
        if (valueChagedKey) {
            this.props.setUnsavedValue(valueChagedKey, true);
        }

        this.setState({
            [field_id]: field_value
        });
    };

    onClickSaveLayout = async () => {
        const { app_info } = this.props;
        this.showLoadingSave();
        try {
            const response = await saveScreenWidgets({
                app_id: app_info.id,
                screen_id: this.state.screen_id,
                payload: {
                    widgets: this.findWidgets(this.state.selected_layout),
                    selected_layout: this.state.selected_layout
                }
            });
            emit_change_codx_collab(
                `${this.props.app_info.id}#nac_screen_notification#${this.props.screen_id}`,
                { layoutUpdated: true, data: response }
            );
            this.onResponseSaveScreenLayout(response);
        } catch (err) {
            this.setState({
                notificationOpen: true,
                notification: {
                    message: 'Screen layout save failed!',
                    severity: 'error'
                }
            });
            this.hideLoadingSave();
        }
    };

    onClickSaveCustomLayout = async () => {
        const { app_info } = this.props;
        this.showLoadingSave();
        let custom_layout = {
            no_labels: this.state.custom_kpi,
            no_graphs: this.state.custom_graph,
            graph_type: this.state.custom_graphType,
            graph_width: this.state.custom_graphWidth || false,
            graph_height: this.state.custom_graphHeight || false,
            horizontal: !this.state.custom_orientation,
            custom_layout: true
        };
        this.setState({
            selected_layout: custom_layout,
            customLayout: false
        });
        try {
            const response = await saveScreenWidgets({
                app_id: app_info.id,
                screen_id: this.state.screen_id,
                payload: {
                    widgets: this.findWidgets(custom_layout),
                    selected_layout: custom_layout
                }
            });
            emit_change_codx_collab(
                `${this.props.app_info.id}#nac_screen_notification#${this.props.screen_id}`,
                { layoutUpdated: true, data: response }
            );
            this.onResponseSaveScreenLayout(response);
        } catch (err) {
            this.setState({
                notificationOpen: true,
                notification: {
                    message: 'Screen layout save failed!',
                    severity: 'error'
                }
            });
            this.hideLoadingSave();
        }
        if (custom_layout) {
            let itemExists = false;
            this.state.layout_options.map((item) => {
                if (
                    item.no_labels == custom_layout.no_labels &&
                    item.no_graphs == custom_layout.no_graphs &&
                    item.graph_type == custom_layout.graph_type &&
                    item?.horizontal == !custom_layout.custom_orientation &&
                    item?.graph_width == custom_layout.graph_width &&
                    item?.graph_height == custom_layout.graph_height
                ) {
                    itemExists = true;
                }
            });
            this.state.custom_layout_options.map((item) => {
                if (
                    item.no_labels == custom_layout.no_labels &&
                    item.no_graphs == custom_layout.no_graphs &&
                    item.graph_type == custom_layout.graph_type &&
                    item?.horizontal == !custom_layout.custom_orientation &&
                    item?.graph_width == custom_layout.graph_width &&
                    item?.graph_height == custom_layout.graph_height
                ) {
                    itemExists = true;
                }
            });
            if (!itemExists) {
                updateLayoutOptions({
                    payload: {
                        app_id: this.props?.app_info?.id,
                        layout_options: custom_layout
                    },
                    callback: this.updateLayoutOptionsCallBack
                });
            }
        }
    };

    onResponseSaveScreenLayout = async (response_data) => {
        this.props.setUnsavedValue('layout', false);
        this.props.setUnsavedValue('widget', null);
        this.setState({
            widgets: response_data['widgets'],
            selected_widget_id: null,
            notificationOpen: true,
            notification: {
                message: 'Screen layout saved successfully!'
            }
        });
        emit_change_codx_collab(`${this.props.app_info.id}#nac_nitification`, {
            screenLayoutUpdated: true
        });
        await this.props.parent_obj.refreshAppSilent();
        this.hideLoadingSave();
    };

    handleLayoutChange = (layout_option) => {
        this.props.setUnsavedValue('layout', true);
        this.setState({
            selected_layout: layout_option
        });
    };

    handleKpiCountChange = (kpiCount) => {
        this.setState({
            custom_kpi: kpiCount
        });
    };

    handleGraphTypeChange = (graphType, graphCount) => {
        this.setState({
            custom_graphType: graphType,
            custom_graph: graphCount
        });
    };

    handleGraphWHPatternChange = (type, val) => {
        switch (type) {
            case 'width':
                this.setState({
                    custom_graphWidth: val
                });
                break;
            case 'height':
                this.setState({
                    custom_graphHeight: val
                });
                break;
            default:
                break;
        }
    };

    findWidgets(layout_option) {
        let widget_item_index = -1;

        const labels = _.times(layout_option['no_labels'], function () {
            widget_item_index++;
            return {
                id: 'new_' + widget_item_index,
                is_label: true,
                widget_index: widget_item_index,
                config: {
                    title: '',
                    sub_title: '',
                    prefix: '',
                    metric_factor: '',
                    code: ''
                }
            };
        });

        const graphs = _.times(layout_option['no_graphs'], function () {
            widget_item_index++;
            return {
                id: 'new_' + widget_item_index,
                is_label: false,
                widget_index: widget_item_index,
                config: {
                    title: '',
                    sub_title: '',
                    prefix: '',
                    metric_factor: '',
                    code: ''
                }
            };
        });

        return _.union(labels, graphs);
    }

    onChangeIngestCode = (code_text) => {
        this.setState({
            filter_ingest_code: code_text
        });
    };

    onChangeCode = (code_text) => {
        if (this.state.filter_code !== code_text) {
            this.props.setUnsavedValue('filter', true);

            this.setState({
                filter_code: code_text
            });
        }
    };

    onChangeActionCode = (action_field_id, code_text) => {
        this.setState({
            [action_field_id]: code_text
        });
    };

    onChangeOutputVar = (output_var) => {
        this.setState({
            filter_output_var: output_var
        });
    };

    showLoadingSave = () => {
        this.setState({
            loading_save: true
        });
    };

    hideLoadingSave = () => {
        this.setState({
            loading_save: false
        });
    };

    onClickOverviewSave = () => {
        this.showLoadingSave();
        saveScreenOverview({
            app_id: this.state.app_id,
            screen_id: this.state.screen_id,
            payload: {
                screen_description: this.state.screen_description
                    ? sanitizeHtml(this.state.screen_description)
                    : '',
                rating_url: this.state.rating_url || null,
                screen_image: this.state.screen_image,
                screen_auto_refresh: this.state.screen_auto_refresh
            },
            callback: this.onResponseOverviewSave
        });
    };

    handleGuideClose = () => {
        this.setState({ manageGuideOpenAdmin: false });
    };

    onClickFilterSave = () => {
        this.showLoadingSave();

        saveScreenFilterSettings({
            app_id: this.state.app_id,
            screen_id: this.state.screen_id,
            payload: {
                code_string: this.state.filter_code,
                screen_filters_open: this.state.screen_filters_open
            },
            callback: this.onResponseFilterSave
        });
    };

    onClickFilterTest = () => {
        this.setState({
            loading_test: true
        });

        testFilters({
            app_id: this.state.app_id,
            payload: {
                code_string: this.state.filter_code,
                screen_filters_open: this.state.screen_filters_open
            },
            callback: this.onResponseTestFilters
        });
    };

    onResponseOverviewSave = () => {
        this.props.setUnsavedValue('overview', false);
        emit_change_codx_collab(`${this.props.app_info.id}#nac_nitification`, {
            screenOverviewUpdated: true
        });
        this.props.parent_obj.refreshAppSilent();
        this.setState({
            notificationOpen: true,
            notification: {
                message: 'Overview saved successfully !'
            }
        });

        this.hideLoadingSave();
    };

    onResponseFilterSave = async (response_data) => {
        if (response_data.status == 'failed') {
            this.setState({
                dialogOpen: true,
                uiacError: response_data
            });
        } else {
            this.props.setUnsavedValue('filter', false);
            emit_change_codx_collab(`${this.props.app_info.id}#nac_nitification`, {
                screenFilterUpdated: true
            });
            await this.props.parent_obj.refreshAppSilent();
            this.setState({
                notificationOpen: true,
                notification: {
                    message: 'Filter settings saved successfully !'
                }
            });
        }
        this.hideLoadingSave();
    };

    onClickFilterPreview = () => {
        this.setState({
            preview_filters: true
        });
    };

    renderInputComponentSelect = () => {
        return (
            <InfoPopup>
                <Typography>
                    By default, widgets are arranged horizontally, but if you choose the vertical
                    orientation, they&apos;ll be arranged vertically instead.
                </Typography>
                <br></br>
                <Typography>
                    Example below showcases vertical arrangement with &quot;1-3&quot; widget type
                    setting, allowing for one widget in the first column and three widgets in the
                    second column with a total of fou widgets{' '}
                </Typography>
                <br></br>
                <img src={customLayout_widgetOrientation} alt="widget-orientation"></img>
            </InfoPopup>
        );
    };

    onResponseTestFilters = (response_data) => {
        this.setState({
            filter_response_logs: response_data.logs,
            filter_response_timetaken: response_data.timetaken,
            filter_response_size: response_data.size,
            loading_test: false,
            filter_output: response_data.output
        });
    };

    showActions = () => {
        this.setState({
            show_preview_actions: true
        });
    };

    hidePreviewFilters = () => {
        this.setState({
            preview_filters: false
        });
    };

    hidePreviewActions = () => {
        this.setState({
            preview_actions: false,
            show_preview_actions: false
        });
    };

    onChangeDefaultFilters = (selected_filters_json) => {
        this.setState({
            default_selected_filters: selected_filters_json
        });
    };

    onClickFilterInfoComponent = () => {
        this.setState({
            show_filter_component_info: true
        });
    };

    onClickWidgetFilterInfoComponent = () => {
        this.setState({
            show_filter_component_info: true
        });
    };

    onCloseFilterInfoComponent = () => {
        this.setState({
            show_filter_component_info: false
        });
    };

    onClickFilterIngestInfoComponent = () => {
        this.setState({
            show_filter_ingest_component_info: true
        });
    };

    onCloseFilterIngestInfoComponent = () => {
        this.setState({
            show_filter_ingest_component_info: false
        });
    };

    onClickFilterSection = (selected_filter_section) => {
        this.setState({
            selected_filter_section: selected_filter_section
        });
    };

    onClickAppVariable = () => {
        navigator.clipboard.writeText("_codx_app_vars_['" + this.state.app_variable + "']");
    };

    onClickAppFunction = () => {
        navigator.clipboard.writeText(
            this.state.app_functions.find((el) => el.key === this.state.app_function).test
        );
    };

    renderFilterEditor = () => {
        const { classes, nac_collaboration } = this.props;

        var selected_filter_ingest_widget_info = false;
        if (this.state.filter_ingest_component) {
            selected_filter_ingest_widget_info = _.find(
                this.state.system_widgets,
                function (system_widget) {
                    return system_widget.name === this.state.filter_ingest_component;
                },
                this
            );
        }

        var selected_filter_widget_info = false;
        if (this.state.filter_component) {
            selected_filter_widget_info = _.find(
                this.state.system_widgets,
                function (system_widget) {
                    return system_widget.name === this.state.filter_component;
                },
                this
            );
        }

        return (
            <div className={classes.filterAccordionContainer}>
                <CodxCollabWork
                    room={`${this.props.app_info.id}#nac_screen_level_filter#${this.props.screen_id}`}
                    state={{
                        filter_code: this.state.filter_code
                    }}
                    onStateChange={(state) => this.setState(state)}
                    hideCurrentUsersAvatars
                    disabled={!this.props.editMode || !nac_collaboration}
                />
                <Grid container spacing={2}>
                    <Grid item xs={9}>
                        <Typography variant="h4" className={classes.sectionEditorHeading}>
                            Setup Filter
                        </Typography>
                        <AppAdminCodeEditor
                            code={this.state.filter_code ? this.state.filter_code : ''}
                            onChangeCodeCallback={this.onChangeCode}
                            output={decodeHtmlEntities(this.state.filter_output)}
                            timetaken={this.state.filter_response_timetaken}
                            size={this.state.filter_response_size}
                            logs={this.state.filter_response_logs}
                            readOnly={this.state.editDisabled || !this.props.editMode}
                            extraClasses={{
                                editorSection: classes.editorSectionLong,
                                outputSection: classes.outputSection
                            }}
                        />
                    </Grid>
                    <Grid item xs={3} style={{ paddingTop: '1rem' }}>
                        <div>
                            <Typography variant="h5" className={classes.defaultColor}>
                                Code Templates
                            </Typography>
                            {this.state.loading_system_widgets ? (
                                <CodxCircularLoader size={60} center />
                            ) : (
                                <Grid container spacing={0}>
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
                                                Application Variables
                                            </InputLabel>
                                            <Select
                                                variant="filled"
                                                classes={{
                                                    icon: classes.widgetConfigIcon
                                                }}
                                                labelId="screen-overview-image"
                                                id="Application_Variables"
                                                value={
                                                    this.state.app_variable
                                                        ? this.state.app_variable
                                                        : ''
                                                }
                                                label="Application Variables"
                                                onChange={(event) =>
                                                    this.onFieldChange(
                                                        'app_variable',
                                                        event.target.value
                                                    )
                                                }
                                                MenuProps={{ className: classes.menu }}
                                                inputProps={{
                                                    classes: {
                                                        input: classes.input,
                                                        formControl: classes.formControl
                                                    }
                                                }}
                                            >
                                                {this.state.app_variables &&
                                                    !this.state.loading_system_widgets &&
                                                    _.map(
                                                        this.state.app_variables,
                                                        function (app_variable) {
                                                            return (
                                                                <MenuItem
                                                                    key={
                                                                        'app-variable-' +
                                                                        app_variable
                                                                    }
                                                                    value={app_variable}
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
                                                        }
                                                    )}
                                            </Select>
                                        </FormControl>
                                        {this.state.app_variable && (
                                            <Link
                                                component="button"
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
                                                labelId="screen-overview-image"
                                                id="Application_Functions"
                                                value={
                                                    this.state.app_function
                                                        ? this.state.app_function
                                                        : ''
                                                }
                                                label="Application Functions"
                                                onChange={(event) =>
                                                    this.onFieldChange(
                                                        'app_function',
                                                        event.target.value
                                                    )
                                                }
                                                variant="filled"
                                                MenuProps={{ className: classes.menu }}
                                                inputProps={{
                                                    classes: {
                                                        input: classes.input,
                                                        formControl: classes.formControl
                                                    }
                                                }}
                                            >
                                                {this.state.app_functions &&
                                                    !this.state.loading_system_widgets &&
                                                    _.map(
                                                        this.state.app_functions,
                                                        function (app_function) {
                                                            return (
                                                                <MenuItem
                                                                    key={
                                                                        'filter-system-widget-' +
                                                                        app_function.key
                                                                    }
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
                                                        }
                                                    )}
                                            </Select>
                                        </FormControl>
                                        {this.state.app_function ? (
                                            this.state.app_functions.find(
                                                (el) => el.key === this.state.app_function
                                            ).test ? (
                                                <Link
                                                    component="button"
                                                    aria-disabled
                                                    className={classes.viewDocs}
                                                    onClick={() => this.onClickAppFunction()}
                                                >
                                                    Copy Code
                                                </Link>
                                            ) : (
                                                <Typography
                                                    variant="h5"
                                                    className={clsx(
                                                        classes.defaultColor,
                                                        classes.fontSize3
                                                    )}
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
                                            setState={this.setState}
                                            parent_obj={this}
                                            ds_store_artifacts={this.state.ds_store_artifacts}
                                        />
                                    )}
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
                                                Ingest Components
                                            </InputLabel>
                                            <Select
                                                variant="filled"
                                                classes={{
                                                    icon: classes.widgetConfigIcon
                                                }}
                                                labelId="screen-overview-image"
                                                id="Ingest_Components"
                                                value={
                                                    this.state.filter_ingest_component
                                                        ? this.state.filter_ingest_component
                                                        : ''
                                                }
                                                label="Filter Ingest Components"
                                                onChange={(event) =>
                                                    this.onFieldChange(
                                                        'filter_ingest_component',
                                                        event.target.value
                                                    )
                                                }
                                                MenuProps={{ className: classes.menu }}
                                                inputProps={{
                                                    classes: {
                                                        input: classes.input,
                                                        formControl: classes.formControl
                                                    }
                                                }}
                                            >
                                                {this.state.system_widgets &&
                                                    !this.state.loading_system_widgets &&
                                                    _.map(
                                                        _.filter(
                                                            this.state.system_widgets,
                                                            function (system_widget) {
                                                                return system_widget.types.includes(
                                                                    'INGEST'
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
                                                                    value={
                                                                        filtered_system_widget.name
                                                                    }
                                                                >
                                                                    <Typography
                                                                        className={clsx(
                                                                            classes.f1,
                                                                            classes.defaultColor
                                                                        )}
                                                                        variant="h5"
                                                                    >
                                                                        {
                                                                            filtered_system_widget.name
                                                                        }
                                                                    </Typography>
                                                                </MenuItem>
                                                            );
                                                        }
                                                    )}
                                            </Select>
                                        </FormControl>
                                        {this.state.filter_ingest_component && (
                                            <Link
                                                component="button"
                                                className={classes.viewDocs}
                                                onClick={() =>
                                                    this.onClickFilterIngestInfoComponent()
                                                }
                                            >
                                                View Docs
                                            </Link>
                                        )}
                                        {this.state.show_filter_ingest_component_info &&
                                            this.state.filter_ingest_component && (
                                                <AppSystemWidgetInfo
                                                    parent_obj={this}
                                                    widget_info={selected_filter_ingest_widget_info}
                                                    closeCallback={
                                                        'onCloseFilterIngestInfoComponent'
                                                    }
                                                />
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
                                                System Components
                                            </InputLabel>
                                            <Select
                                                variant="filled"
                                                classes={{
                                                    icon: classes.widgetConfigIcon
                                                }}
                                                labelId="screen-overview-image"
                                                id="System_Components"
                                                value={
                                                    this.state.filter_component
                                                        ? this.state.filter_component
                                                        : ''
                                                }
                                                label="Filter Components"
                                                onChange={(event) =>
                                                    this.onFieldChange(
                                                        'filter_component',
                                                        event.target.value
                                                    )
                                                }
                                                MenuProps={{ className: classes.menu }}
                                                inputProps={{
                                                    classes: {
                                                        input: classes.input,
                                                        formControl: classes.formControl
                                                    }
                                                }}
                                            >
                                                {this.state.system_widgets &&
                                                    !this.state.loading_system_widgets &&
                                                    _.map(
                                                        _.filter(
                                                            this.state.system_widgets,
                                                            function (system_widget) {
                                                                return system_widget.types.includes(
                                                                    'FILTER'
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
                                                                    value={
                                                                        filtered_system_widget.name
                                                                    }
                                                                >
                                                                    <Typography
                                                                        className={clsx(
                                                                            classes.f1,
                                                                            classes.defaultColor
                                                                        )}
                                                                        variant="h5"
                                                                    >
                                                                        {
                                                                            filtered_system_widget.name
                                                                        }
                                                                    </Typography>
                                                                </MenuItem>
                                                            );
                                                        }
                                                    )}
                                            </Select>
                                        </FormControl>
                                        {this.state.filter_component && (
                                            <Link
                                                component="button"
                                                className={classes.viewDocs}
                                                onClick={() => this.onClickFilterInfoComponent()}
                                            >
                                                View Docs
                                            </Link>
                                        )}
                                        {this.state.show_filter_component_info &&
                                            this.state.filter_component && (
                                                <AppSystemWidgetInfo
                                                    parent_obj={this}
                                                    widget_info={selected_filter_widget_info}
                                                    closeCallback={'onCloseFilterInfoComponent'}
                                                />
                                            )}
                                    </Grid>
                                </Grid>
                            )}

                            <Grid container spacing={0}>
                                <AppScreenPackageDetails packages={this.state.packageList} />
                            </Grid>
                            <Grid container spacing={0}>
                                <ArchivedUIaC
                                    app_id={this.state.app_id}
                                    screen_id={this.state.screen_id}
                                    screen_name={this.state.screen_name}
                                    archiveType="filter"
                                />
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
                <div>
                    <div key="form_toolbar" className={classes.layoutQuestionToolbar}>
                        <Button
                            variant="contained"
                            size="small"
                            disabled={
                                this.state.editDisabled ||
                                !this.props.unsavedValues?.filter ||
                                this.state.loading_save ||
                                !this.props.editMode ||
                                (this.state.filter_code ? false : true)
                            }
                            onClick={this.onClickFilterSave}
                            aria-label="SAVE FILTERS"
                        >
                            Save Filters
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={this.onClickFilterTest}
                            disabled={this.state.filter_code ? this.state.loading_test : true}
                            startIcon={
                                this.state.loading_test ? (
                                    <div style={{ position: 'relative', width: '2rem' }}>
                                        <CodxCircularLoader size={30} center />
                                    </div>
                                ) : null
                            }
                            aria-label="TEST FILTERS"
                        >
                            Test Filters
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    handleActionChange = (action_settings) => {
        this.props.setUnsavedValue('screen_actions', true);
        this.setState({
            action_settings
        });
    };

    renderActionsEditor = () => {
        const { app_info, nac_collaboration } = this.props;
        return !this.state.loading &&
            !this.state.loading_system_widgets &&
            !this.state.loading_config ? (
            <>
                <CodxCollabWork
                    room={`${this.props.app_info.id}#nac_screen_level_screen_actions#${this.props.screen_id}`}
                    state={{
                        action_settings: this.state.action_settings
                    }}
                    onStateChange={(state) => this.setState(state)}
                    hideCurrentUsersAvatars={true}
                    disabled={!this.props.editMode || !nac_collaboration}
                />
                <AppScreenActionEditor
                    unsavedValues={this.props.unsavedValues}
                    setUnsavedValue={this.props.setUnsavedValue}
                    key={'screen_action_editor'}
                    parent_obj={this}
                    refreshAppSilent={this.props.parent_obj.refreshAppSilent}
                    app_info={app_info}
                    screen_id={this.state.screen_id}
                    action_settings={this.state.action_settings}
                    system_widgets={this.state.system_widgets}
                    app_variables={this.state.app_variables}
                    app_functions={this.state.app_functions}
                    editDisabled={this.state.editDisabled}
                    editMode={this.props.editMode}
                    loading_save={this.state.loading_save}
                    onChange={this.handleActionChange}
                    packageList={this.state.packageList}
                    comment_enabled={this.state.comment_enabled}
                    app_id={this.state.app_id}
                />
            </>
        ) : (
            <CodxCircularLoader size={60} center />
        );
    };
    prevSlide = () => {
        const prevIndex = this.state.currentIndex - this.state.itemsPerPage;
        if (prevIndex >= 0) {
            this.setState({ currentIndex: prevIndex });
        }
    };
    nextSilde = () => {
        const nextIndex = this.state.currentIndex + this.state.itemsPerPage;
        if (nextIndex < this.renderDefaultImg().length) {
            this.setState({ currentIndex: nextIndex });
        }
    };
    renderDefaultImg = () => {
        const { classes } = this.props;
        return [
            {
                type: 'default',
                icon: () => <ReviewImage className={classes.screenImage} />,
                name: 'Review'
            },
            {
                type: 'default',
                icon: () => <AnalyzeImage className={classes.screenImage} />,
                name: 'Analyze'
            },
            {
                type: 'default',
                icon: () => <SimulateImage className={classes.screenImage} />,
                name: 'Simulate'
            },
            {
                type: 'default',
                icon: () => <WikiImage className={classes.screenImage} />,
                name: 'Wiki'
            },
            ...this.renderCustomIcons()
        ];
    };
    renderCustomIcons = () => {
        if (this.state.screen_icon_urls.length)
            return this.state.screen_icon_urls.map((el) => ({ type: 'custom', iconUrl: el.url }));
        else {
            return [];
        }
    };
    renderScreenImages = (icon) => {
        const { classes } = this.props;
        return (
            <Grid item xs>
                <Paper
                    elevation={2}
                    className={clsx(
                        classes.screenImageItem,
                        (
                            icon.type == 'default'
                                ? this.state.screen_image === icon.name
                                : this.state.screen_image === icon.iconUrl
                        )
                            ? classes.selectedScreenImageItem
                            : null
                    )}
                    onClick={() =>
                        this.onFieldChange(
                            'screen_image',
                            icon.name ? icon.name : icon.iconUrl,
                            'overview'
                        )
                    }
                    disabled={this.state.editDisabled || !this.props.editMode}
                >
                    {icon.type == 'default' ? (
                        icon.icon()
                    ) : (
                        <img src={icon.iconUrl} className={classes.screenImage} alt="screenicon" />
                    )}
                    <Typography variant="h5">{icon.name || ''}</Typography>
                </Paper>
            </Grid>
        );
    };
    renderOverviewEditor = () => {
        const { classes, nac_collaboration } = this.props;
        const renderNextBtn = this.renderDefaultImg().length - this.state.currentIndex > 4;
        return (
            <div>
                <CodxCollabWork
                    room={`${this.props.app_info.id}#nac_screen_level_overview#${this.props.screen_id}`}
                    state={{
                        screen_description: this.state.screen_description,
                        rating_url: this.state.rating_url,
                        screen_image: this.state.screen_image
                    }}
                    onStateChange={(state) => this.setState(state)}
                    hideCurrentUsersAvatars={true}
                    disabled={!this.props.editMode || !nac_collaboration}
                />
                <div className={classes.overviewContainer}>
                    <div>
                        <Typography variant="h4" className={classes.sectionEditorHeading}>
                            Add Overview
                        </Typography>
                        <FormControl fullWidth className={classes.widgetConfigFormControl}>
                            <TextField
                                classes={{
                                    root: classes.widgetConfigRoot
                                }}
                                InputLabelProps={{
                                    classes: {
                                        root: classes.widgetConfigLabel
                                    },
                                    shrink: true
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.widgetConfigInput
                                    },
                                    fullWidth: true,
                                    multiline: true,
                                    rows: 16
                                    // readOnly: this.state.editDisabled
                                }}
                                disabled={this.state.editDisabled || !this.props.editMode}
                                key={'screen_description'}
                                label="Description"
                                id={'screen_description'}
                                value={
                                    this.state.screen_description
                                        ? decodeHtmlEntities(this.state.screen_description)
                                        : ''
                                }
                                onChange={(event) =>
                                    this.onFieldChange(
                                        'screen_description',
                                        event.target.value,
                                        'overview'
                                    )
                                }
                            />
                        </FormControl>

                        <FormControl fullWidth className={classes.widgetConfigFormControl}>
                            <TextField
                                classes={{
                                    root: classes.widgetConfigRoot
                                }}
                                InputLabelProps={{
                                    classes: {
                                        root: classes.widgetConfigLabel
                                    },
                                    shrink: true
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.widgetConfigInput
                                    },
                                    fullWidth: true
                                }}
                                disabled={this.state.editDisabled || !this.props.editMode}
                                key={'rating_url'}
                                label="Add Screen rating URL/feedback URL"
                                id={'rating_url'}
                                value={this.state.rating_url ? this.state.rating_url : ''}
                                onChange={(event) =>
                                    this.onFieldChange('rating_url', event.target.value, 'overview')
                                }
                            />
                        </FormControl>

                        {/* <div className={classes.screenImageContianer}>
                            <Typography variant="h4" className={classes.sectionEditorHeading}>
                                Select Screen Image
                            </Typography>
                            <Grid
                                container
                                spacing={4}
                                wrap="wrap"
                                className={classes.iconsContainer}
                            >
                                <IconButton
                                    onClick={this.prevSlide}
                                    size="small"
                                    className={classes.prevBtn}
                                >
                                    {this.state.currentIndex == 0 ? null : (
                                        <NavigateBeforeIcon onClick={this.prevSlide} />
                                    )}
                                </IconButton>
                                {this.renderDefaultImg()
                                    .slice(
                                        this.state.currentIndex,
                                        this.state.currentIndex + this.state.itemsPerPage
                                    )
                                    .map((el) => this.renderScreenImages(el))}
                                <IconButton
                                    onClick={this.nextSilde}
                                    size="small"
                                    className={classes.nextBtn}
                                >
                                    {renderNextBtn ? <NavigateNextIcon /> : null}
                                </IconButton>
                            </Grid>
                        </div> */}
                        {this.props.app_info.modules.user_guide && (
                            <div className={classes.UserGuideContainer} style={{ marginTop: '5%' }}>
                                <Typography variant="h4" className={classes.sectionEditorHeading}>
                                    Manage User Guide
                                </Typography>
                                <Paper
                                    elevation={2}
                                    className={clsx(classes.screenImageItem)}
                                    onClick={() => this.setState({ manageGuideOpenAdmin: true })}
                                >
                                    <GuideImage className={classes.screenImage} />
                                    <Typography variant="h5">User Guide</Typography>
                                </Paper>
                                {this.state.manageGuideOpenAdmin && (
                                    <UserGuideDialog
                                        app_id={this.state.app_id}
                                        screen_id={this.props.screen_id}
                                        screen_name={this.state.screen_name}
                                        onCloseGuide={this.handleGuideClose}
                                    />
                                )}
                            </div>
                        )}
                        {/* <Button
                            variant="contained"
                            onClick={() => this.setState({ openIconDialog: true })}
                            className={classes.uploadIcon}
                        >
                            upload icon
                        </Button>
                        <ModalComponent
                            openDialogue={this.state.openIconDialog}
                            setOpenDialogue={this.colseModal}
                            maxWidth={false}
                            fullScreen={false}
                            title={'Upload Screen Icons'}
                            dialogContentClassName={classes.modalDailogContent}
                            dialogTitleClassName={classes.modalDialogTitle}
                            dialogCloseButtonClassName={classes.closeIcon}
                            sepratorClassName={classes.sepratorLine}
                        >
                            <FileUpload
                                fieldInfo={{
                                    name: 'Upload Screen Icon',
                                    label: 'Upload Screen Icons',
                                    type: 'upload',
                                    value: '',
                                    variant: 'outlined',
                                    margin: 'none',
                                    inputprops: {
                                        type: 'file',
                                        error: 'false',
                                        multiple: false
                                    },
                                    InputLabelProps: {
                                        disableAnimation: true,
                                        shrink: true
                                    },
                                    location: 'screenOverview'
                                }}
                                onChange={() => {
                                    getScreenOverViewImages({
                                        callback: this.getScreenOverViewIcons
                                    });
                                }}
                            />
                        </ModalComponent> */}
                    </div>
                </div>
                <div>
                    <div key="form_toolbar" className={classes.layoutQuestionToolbar}>
                        <Button
                            variant="contained"
                            size="small"
                            disabled={
                                this.state.editDisabled ||
                                !this.props.unsavedValues?.overview ||
                                this.state.loading_save ||
                                !this.props.editMode
                            }
                            onClick={this.onClickOverviewSave}
                            aria-label="SAVE OVERVIEW"
                        >
                            Save Overview
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    verifyLayoutSelection = (selectedLayout) => selectedLayout == false;

    debounce = (cb, delay) => {
        let timer;
        return (...args) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                cb.apply(this, args);
            }, delay);
        };
    };
    handleInputValidation = this.debounce(
        (inputValue, type) => this.validateInputPattern(inputValue, type),
        1500
    );

    validateInputPattern = (inputValue, type) => {
        const showError = (val, msg = null) => {
            let message = 'Pattern is not valid!';
            if (msg) {
                message = msg;
            } else {
                switch (val) {
                    case 'widget_width':
                        message = 'Widget width pattern is not valid!';
                        break;
                    case 'widget_height':
                        message = 'Widget height pattern is not valid!';
                        break;
                    case 'widget_type':
                        message = 'Widget type pattern is not valid!';
                        break;
                    case 'kpi_count':
                        message = 'Kpi count pattern is not valid!';
                        break;
                    case 'widget_count':
                        message = 'Widget count pattern is not valid!';
                        break;
                    default:
                        break;
                }
            }
            this.setState({
                notificationOpen: true,
                notification: {
                    message: message,
                    severity: 'error'
                }
            });
            this.setState({
                custom_error: val
            });
        };
        let regexPattern = /^\d{0,10}$/;
        let widthCheck = false;
        let heightCheck = false;
        const total = inputValue
            .split('-')
            .map((e) => parseInt(e))
            .reduce((acc, curr) => acc + curr, 0);
        switch (type) {
            case 'kpis':
                regexPattern = /^\d{0,10}$/;
                if (regexPattern.test(inputValue)) {
                    if (this.state.custom_error == 'kpi_count') {
                        this.setState({
                            custom_error: false
                        });
                    }
                    return this.setState({ custom_kpi: inputValue });
                } else {
                    showError('kpi_count');
                }
                break;
            case 'widgets':
                regexPattern = /^\d{0,10}$/;
                if (regexPattern.test(inputValue)) {
                    if (this.state.custom_error == 'widget_count') {
                        this.setState({
                            custom_error: false
                        });
                    }
                    return this.setState({ custom_graph: inputValue });
                } else {
                    showError('widget_count');
                }
                break;
            case 'widget_width':
                regexPattern = this.state.custom_orientation
                    ? /^\d+(-\d(\d+(-\d)*){0,1})*$/
                    : /^\d+([,-]\d([,-]\d+([,-]\d)*){0,1})*$/;
                if (!this.state.custom_orientation) {
                    const totalWidth = inputValue.split(',').map((arr) =>
                        arr
                            .split('-')
                            .map((e) => parseInt(e))
                            .reduce((acc, curr) => acc + curr, 0)
                    );
                    totalWidth.map((width_total) => {
                        if (width_total !== 12) {
                            widthCheck = true;
                        }
                    });
                } else {
                    const totalWidth = inputValue
                        .split('-')
                        .map((e) => parseInt(e))
                        .reduce((acc, curr) => acc + curr, 0);
                    if (totalWidth != 12) {
                        widthCheck = true;
                    }
                }
                if (regexPattern.test(inputValue) && !widthCheck) {
                    if (this.state.custom_error == 'widget_width') {
                        this.setState({
                            custom_error: false
                        });
                    }
                    return this.setState({ custom_graphWidth: inputValue });
                } else {
                    widthCheck
                        ? showError(
                              'widget_width',
                              'Invalid width !! Each row pattern total should be = 12'
                          )
                        : showError('widget_width');
                }
                break;
            case 'widget_height':
                regexPattern = this.state.custom_orientation
                    ? /^\d+([,-]\d([,-]\d+([,-]\d)*){0,1})*$/
                    : /^\d+(-\d(\d+(-\d)*){0,1})*$/;
                if (this.state.custom_orientation) {
                    const totalHeight = inputValue.split(',').map((arr) =>
                        arr
                            .split('-')
                            .map((e) => parseInt(e))
                            .reduce((acc, curr) => acc + curr, 0)
                    );
                    totalHeight.map((height_total) => {
                        if (height_total < 10) {
                            heightCheck = true;
                        }
                    });
                } else {
                    const totalHeight = inputValue
                        .split('-')
                        .map((e) => parseInt(e))
                        .reduce((acc, curr) => acc + curr, 0);
                    if (totalHeight < 10) {
                        heightCheck = true;
                    }
                }
                if (regexPattern.test(inputValue) && !heightCheck) {
                    if (this.state.custom_error == 'widget_height') {
                        this.setState({
                            custom_error: false
                        });
                    }
                    return this.setState({ custom_graphHeight: inputValue });
                } else {
                    heightCheck
                        ? showError(
                              'widget_height',
                              'Invalid width !! Pattern total should be >= 10'
                          )
                        : showError('widget_height');
                }
                break;
            case 'widget_type':
                regexPattern = /^\d+(-\d(,\d+(-\d)*){0,1})*$/;
                if (regexPattern.test(inputValue) && total == this.state.custom_graph) {
                    if (this.state.custom_error == 'widget_type') {
                        this.setState({
                            custom_error: false
                        });
                    }
                    return this.setState({ custom_graphType: inputValue });
                } else {
                    showError('widget_type');
                }
                break;
            default:
                return;
        }
    };

    handleOrientationChange = (event) => {
        this.setState({
            custom_orientation: event,
            custom_graphHeight: '',
            custom_graphWidth: ''
        });
    };

    renderLayoutSelection = () => {
        // debugger
        const { classes, app_info, nac_collaboration } = this.props;

        return (
            <div>
                <CodxCollabWork
                    room={`${this.props.app_info.id}#nac_screen_level_layout#${this.props.screen_id}`}
                    state={{
                        selected_layout: this.state.selected_layout
                    }}
                    onStateChange={(state) => this.setState(state)}
                    hideCurrentUsersAvatars={true}
                    disabled={!this.props.editMode || !nac_collaboration}
                />
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography className={classes.sectionEditorHeading} variant="h4">
                            Choose Layout
                        </Typography>
                        <Typography className={classes.sectionEditorSubHeading} variant="h5">
                            You can select a layout for the screen from the existing layouts. Unable
                            to find the layout you are looking for? Now create your own layout with
                            the help of custom layouts.
                        </Typography>
                    </Grid>
                    <Grid item xs="auto" className={classes.filterContainer}>
                        <Tabs
                            value={this.state.activeStepLayout}
                            onChange={(e, v) => this.handleStepClickLayout(v)}
                            aria-label="ant example"
                            className={classes.subSectionsTabsLayout}
                        >
                            <Tab label="Predefined Layouts" className={classes.layoutTab} />
                            <Tab label="Custom Layouts" className={classes.layoutTab} />
                        </Tabs>
                        <div className={classes.filterSubContainer}>
                            {this.state.activeStepLayout ? (
                                <Button
                                    size="small"
                                    variant="contained"
                                    style={{
                                        display: 'block',
                                        float: 'right',
                                        marginTop: '1.75rem',
                                        marginRight: '1rem'
                                    }}
                                    disabled={false}
                                    onClick={() =>
                                        this.setState({ customLayout: !this.state.customLayout })
                                    }
                                    aria-label="Custom Layout"
                                >
                                    {this.state.customLayout ? 'Back' : 'Create New Layout'}
                                </Button>
                            ) : (
                                <>
                                    <FormControl
                                        className={clsx(
                                            classes.widgetLayoutConfigFormControl,
                                            classes.widgetConfigSelect
                                        )}
                                    >
                                        <InputLabel
                                            id="screen-layout-metrics"
                                            className={classes.widgetConfigCheckboxLabel}
                                        >
                                            # of Screen KPIs
                                        </InputLabel>
                                        <Select
                                            variant="filled"
                                            classes={{
                                                icon: classes.widgetConfigIcon
                                            }}
                                            labelId="screen-layout-metrics"
                                            id="screen_layout_metrics"
                                            value={
                                                this.state.layout_metrics === false
                                                    ? ''
                                                    : this.state.layout_metrics
                                            }
                                            label="# of Screen KPIs"
                                            onChange={(event) =>
                                                this.onFieldChange(
                                                    'layout_metrics',
                                                    event.target.value
                                                )
                                            }
                                            MenuProps={{ className: classes.menu }}
                                            inputProps={{
                                                classes: {
                                                    input: classes.input,
                                                    formControl: classes.formControl
                                                }
                                            }}
                                        >
                                            <MenuItem value={false}>
                                                <Typography
                                                    className={classes.screenLayoutLabel}
                                                    variant="h5"
                                                >
                                                    <em>None</em>
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem value={0}>
                                                <Typography
                                                    className={classes.screenLayoutLabel}
                                                    variant="h5"
                                                >
                                                    0 KPIs
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem value={1}>
                                                <Typography
                                                    className={classes.screenLayoutLabel}
                                                    variant="h5"
                                                >
                                                    1 KPI
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem value={2}>
                                                <Typography
                                                    className={classes.screenLayoutLabel}
                                                    variant="h5"
                                                >
                                                    2 KPIs
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem value={3}>
                                                <Typography
                                                    className={classes.screenLayoutLabel}
                                                    variant="h5"
                                                >
                                                    3 KPIs
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem value={4}>
                                                <Typography
                                                    className={classes.screenLayoutLabel}
                                                    variant="h5"
                                                >
                                                    4 KPIs
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem value={5}>
                                                <Typography
                                                    className={classes.screenLayoutLabel}
                                                    variant="h5"
                                                >
                                                    5 KPIs
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem value={6}>
                                                <Typography
                                                    className={classes.screenLayoutLabel}
                                                    variant="h5"
                                                >
                                                    6 KPIs
                                                </Typography>
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl
                                        className={clsx(
                                            classes.widgetLayoutConfigFormControl,
                                            classes.widgetConfigSelect
                                        )}
                                    >
                                        <InputLabel
                                            id="screen-layout-visuals"
                                            className={classes.widgetConfigCheckboxLabel}
                                        >
                                            # of Screen Visuals
                                        </InputLabel>
                                        <Select
                                            variant="filled"
                                            classes={{
                                                icon: classes.widgetConfigIcon
                                            }}
                                            labelId="screen-layout-visuals"
                                            id="screen_layout_visuals"
                                            value={
                                                this.state.layout_visuals === false
                                                    ? ''
                                                    : this.state.layout_visuals
                                            }
                                            label="# of Screen Visuals"
                                            onChange={(event) =>
                                                this.onFieldChange(
                                                    'layout_visuals',
                                                    event.target.value
                                                )
                                            }
                                            MenuProps={{ className: classes.menu }}
                                            inputProps={{
                                                classes: {
                                                    input: classes.input,
                                                    formControl: classes.formControl
                                                }
                                            }}
                                        >
                                            <MenuItem value={false}>
                                                <Typography
                                                    className={classes.screenLayoutLabel}
                                                    variant="h5"
                                                >
                                                    <em>None</em>
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem value={1}>
                                                <Typography
                                                    className={classes.screenLayoutLabel}
                                                    variant="h5"
                                                >
                                                    1 Visual
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem value={2}>
                                                <Typography
                                                    className={classes.screenLayoutLabel}
                                                    variant="h5"
                                                >
                                                    2 Visuals
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem value={3}>
                                                <Typography
                                                    className={classes.screenLayoutLabel}
                                                    variant="h5"
                                                >
                                                    3 Visuals
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem value={4}>
                                                <Typography
                                                    className={classes.screenLayoutLabel}
                                                    variant="h5"
                                                >
                                                    4 Visuals
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem value={5}>
                                                <Typography
                                                    className={classes.screenLayoutLabel}
                                                    variant="h5"
                                                >
                                                    5 Visuals
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem value={6}>
                                                <Typography
                                                    className={classes.screenLayoutLabel}
                                                    variant="h5"
                                                >
                                                    6 Visuals
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem value={8}>
                                                <Typography
                                                    className={classes.screenLayoutLabel}
                                                    variant="h5"
                                                >
                                                    8 Visuals
                                                </Typography>
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </>
                            )}
                        </div>
                    </Grid>
                    {!this.state.customLayout ? (
                        <Grid item xs="12">
                            {this.state.activeStepLayout ? (
                                this.state.custom_layout_options.length > 0 ? (
                                    <AppScreenLayoutSelector
                                        app_info={app_info}
                                        selected_layout={this.state.selected_layout}
                                        layout_metrics={this.state.layout_metrics}
                                        layout_visuals={this.state.layout_visuals}
                                        editDisabled={this.state.editDisabled}
                                        onChange={this.handleLayoutChange}
                                        editMode={this.props.editMode}
                                        layout_options={this.state.custom_layout_options}
                                    />
                                ) : (
                                    <div className={classes.noLayoutContainer}>
                                        <img
                                            className={classes.noLayoutImage}
                                            src={noLayout}
                                            alt="Widget-type"
                                        ></img>
                                        <Typography className={classes.customLayoutInfo}>
                                            There are no custom layouts created yet
                                        </Typography>
                                    </div>
                                )
                            ) : (
                                <AppScreenLayoutSelector
                                    app_info={app_info}
                                    selected_layout={this.state.selected_layout}
                                    layout_metrics={this.state.layout_metrics}
                                    layout_visuals={this.state.layout_visuals}
                                    editDisabled={this.state.editDisabled}
                                    onChange={this.handleLayoutChange}
                                    editMode={this.props.editMode}
                                    layout_options={this.state.layout_options}
                                />
                            )}
                        </Grid>
                    ) : null}
                </Grid>

                <div className={classes.layoutQuestionToolbar}>
                    {this.state.selected_layout.no_labels !== false ? (
                        <ConfirmPopup
                            title={
                                this.props.unsavedValues.widget
                                    ? 'Unsaved changes present at widget level'
                                    : 'Are you sure?'
                            }
                            subTitle={
                                this.props.unsavedValues.widget
                                    ? 'Please save the changes in Visual UIaC tab to update the layout.'
                                    : 'Please note, all Visual UIaC configuration (if configured) will be lost. Do you want to continue?'
                            }
                            disabled={!this.state.widgets?.length}
                            onConfirm={
                                this.props.unsavedValues.widget ? () => {} : this.onClickSaveLayout
                            }
                            confirmText={this.props.unsavedValues.widget ? 'Ok' : 'Save Layout'}
                            cancelText="Cancel"
                            hideCancelButton={this.props.unsavedValues.widget}
                        >
                            {(triggerConfirm) =>
                                !this.state.customLayout && (
                                    <Button
                                        size="small"
                                        variant="contained"
                                        className={classes.layoutQuestionNextButton}
                                        onClick={
                                            !this.state.widgets?.length
                                                ? this.onClickSaveLayout
                                                : triggerConfirm
                                        }
                                        disabled={
                                            this.state.editDisabled ||
                                            !this.props.unsavedValues?.layout ||
                                            this.state.loading_save ||
                                            !this.props.editMode
                                        }
                                        aria-label="Save Layout"
                                    >
                                        Save Layout
                                    </Button>
                                )
                            }
                        </ConfirmPopup>
                    ) : (
                        ''
                    )}
                    <br />
                </div>
            </div>
        );
    };

    handleWidgetInfoChange = (widget_info) => {
        const widgetDetails = this.state.widgets?.find((widget) => widget.id === widget_info.id);
        Object.assign(widgetDetails, widget_info);
    };

    renderWidgetEditor = (screen_name) => {
        const { classes, app_info, nac_collaboration } = this.props;

        var selected_visual_ingest_widget_info = false;
        if (this.state.visual_ingest_component) {
            selected_visual_ingest_widget_info = _.find(
                this.state.system_widgets,
                function (system_widget) {
                    return system_widget.name === this.state.visual_ingest_component;
                },
                this
            );
        }

        var selected_visual_widget_info = false;
        if (this.state.visual_component) {
            selected_visual_widget_info = _.find(
                this.state.system_widgets,
                function (system_widget) {
                    return system_widget.name === this.state.visual_component;
                },
                this
            );
        }

        const screen_id = this.state.screen_id;
        const foundScreen = _.find(this.props.app_info.screens, function (screen) {
            return screen.id === parseInt(screen_id);
        });
        return (
            <Grid container spacing={2} style={{ height: '100%' }}>
                <Grid item xs={9} style={{ height: '100%' }}>
                    {!this.state.selected_widget_id ? (
                        <Typography className={classes.sectionEditorHeading} variant="h4">
                            Select a widget to setup
                        </Typography>
                    ) : (
                        <AppScreenWidgetEditor
                            screen_name={screen_name}
                            nac_collaboration={nac_collaboration}
                            onWidgetInfoChange={this.handleWidgetInfoChange}
                            key={'screen_widget_editor' + this.state.selected_widget_id}
                            unsavedValues={this.props.unsavedValues}
                            setUnsavedValue={this.props.setUnsavedValue}
                            parent_obj={this}
                            app_info={app_info}
                            screen_id={this.state.screen_id}
                            widget_id={this.state.selected_widget_id}
                            widget_info={this.state.selected_widget_info}
                            editDisabled={this.state.editDisabled}
                            editMode={this.props.editMode}
                            previewCallback={this.props.previewCallback}
                            loading_save={this.state.loading_save}
                        />
                    )}
                </Grid>
                <Grid item xs={3} style={{ paddingTop: '7rem' }}>
                    <div className={classes.layoutContent}>
                        <AppScreenLayout
                            key={
                                this.state.widgets.map((el) => el.id).join('#') +
                                '#' +
                                foundScreen?.graph_type +
                                '#' +
                                foundScreen?.horizontal
                            }
                            widthResponsive
                            onSelectWidget={(w) => this.onClickLayoutWidget(w.id, w.is_label)}
                            selectedWidgetId={this.state.selected_widget_id}
                            layout_option={{
                                graph_type: foundScreen?.graph_type,
                                horizontal: foundScreen?.horizontal,
                                graph_width: this.state.selected_layout?.graph_width || undefined,
                                graph_height: this.state.selected_layout?.graph_height || undefined
                            }}
                            widgets={this.state.widgets}
                            unsavedWidgets={this.props.unsavedValues?.widget}
                        />

                        {this.state.loading_system_widgets ? (
                            <CodxCircularLoader size={60} center />
                        ) : (
                            this.state.show_visual_code_component && (
                                <>
                                    <Typography
                                        variant="h5"
                                        className={classes.defaultColor}
                                        style={{ marginTop: '1rem' }}
                                    >
                                        Code Templates
                                    </Typography>
                                    <Tabs
                                        value={this.state.templateStep}
                                        onChange={(e, v) => this.handleTemplateStepClick(v)}
                                        aria-label="ant example"
                                        className={classes.subSectionsTabsLayout}
                                    >
                                        <Tab label="Visual" className={classes.layoutTab} />
                                        <Tab label="Simulator" className={classes.layoutTab} />
                                    </Tabs>
                                    {!this.state.templateStep && (
                                        <>
                                            <Grid container spacing={0}>
                                                <Grid
                                                    item
                                                    xs={12}
                                                    className={classes.codeTemplateItem}
                                                >
                                                    <FormControl
                                                        fullWidth
                                                        className={clsx(
                                                            classes.widgetConfigFormControl,
                                                            classes.widgetConfigSelect
                                                        )}
                                                    >
                                                        <InputLabel
                                                            id="screen-overview-image"
                                                            className={
                                                                classes.widgetConfigCheckboxLabel
                                                            }
                                                        >
                                                            Application Variables
                                                        </InputLabel>
                                                        <Select
                                                            variant="filled"
                                                            classes={{
                                                                icon: classes.widgetConfigIcon
                                                            }}
                                                            labelId="screen-overview-image"
                                                            id="screen_overview_image"
                                                            value={
                                                                this.state.app_variable
                                                                    ? this.state.app_variable
                                                                    : ''
                                                            }
                                                            label="Application Variables"
                                                            onChange={(event) =>
                                                                this.onFieldChange(
                                                                    'app_variable',
                                                                    event.target.value
                                                                )
                                                            }
                                                            MenuProps={{ className: classes.menu }}
                                                            inputProps={{
                                                                classes: {
                                                                    input: classes.input,
                                                                    formControl: classes.formControl
                                                                }
                                                            }}
                                                        >
                                                            {this.state.app_variables &&
                                                                !this.state
                                                                    .loading_system_widgets &&
                                                                _.map(
                                                                    this.state.app_variables,
                                                                    function (app_variable) {
                                                                        return (
                                                                            <MenuItem
                                                                                key={
                                                                                    'app-variable-' +
                                                                                    app_variable
                                                                                }
                                                                                value={app_variable}
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
                                                                    }
                                                                )}
                                                        </Select>
                                                    </FormControl>
                                                    {this.state.app_variable && (
                                                        <Link
                                                            component="button"
                                                            className={classes.viewDocs}
                                                            onClick={() =>
                                                                this.onClickAppVariable()
                                                            }
                                                        >
                                                            Copy variable
                                                        </Link>
                                                    )}
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={12}
                                                    className={classes.codeTemplateItem}
                                                >
                                                    <FormControl
                                                        fullWidth
                                                        className={clsx(
                                                            classes.widgetConfigFormControl,
                                                            classes.widgetConfigSelect
                                                        )}
                                                    >
                                                        <InputLabel
                                                            id="screen-overview-image"
                                                            className={
                                                                classes.widgetConfigCheckboxLabel
                                                            }
                                                        >
                                                            Application Functions
                                                        </InputLabel>
                                                        <Select
                                                            variant="filled"
                                                            classes={{
                                                                icon: classes.widgetConfigIcon
                                                            }}
                                                            labelId="screen-overview-image"
                                                            id="screen_overview_image"
                                                            value={
                                                                this.state.app_function
                                                                    ? this.state.app_function
                                                                    : ''
                                                            }
                                                            label="Application Functions"
                                                            onChange={(event) =>
                                                                this.onFieldChange(
                                                                    'app_function',
                                                                    event.target.value
                                                                )
                                                            }
                                                            MenuProps={{ className: classes.menu }}
                                                            inputProps={{
                                                                classes: {
                                                                    input: classes.input,
                                                                    formControl: classes.formControl
                                                                }
                                                            }}
                                                        >
                                                            {this.state.app_functions &&
                                                                !this.state
                                                                    .loading_system_widgets &&
                                                                _.map(
                                                                    this.state.app_functions,
                                                                    function (app_function) {
                                                                        return (
                                                                            <MenuItem
                                                                                key={
                                                                                    'filter-system-widget-' +
                                                                                    app_function.key
                                                                                }
                                                                                value={
                                                                                    app_function.key
                                                                                }
                                                                                title={
                                                                                    app_function.desc
                                                                                }
                                                                            >
                                                                                <Typography
                                                                                    className={clsx(
                                                                                        classes.f1,
                                                                                        classes.defaultColor
                                                                                    )}
                                                                                    variant="h5"
                                                                                >
                                                                                    {
                                                                                        app_function.key
                                                                                    }
                                                                                </Typography>
                                                                            </MenuItem>
                                                                        );
                                                                    }
                                                                )}
                                                        </Select>
                                                    </FormControl>
                                                    {this.state.app_function ? (
                                                        this.state.app_functions.find(
                                                            (el) =>
                                                                el.key === this.state.app_function
                                                        ).test ? (
                                                            <Link
                                                                component="button"
                                                                aria-disabled
                                                                className={classes.viewDocs}
                                                                onClick={() =>
                                                                    this.onClickAppFunction()
                                                                }
                                                            >
                                                                Copy Code
                                                            </Link>
                                                        ) : (
                                                            <Typography
                                                                variant="h5"
                                                                className={clsx(
                                                                    classes.defaultColor,
                                                                    classes.fontSize3
                                                                )}
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
                                                        ds_store_artifacts={
                                                            this.state.ds_store_artifacts
                                                        }
                                                    />
                                                )}
                                                <Grid
                                                    item
                                                    xs={12}
                                                    className={classes.codeTemplateItem}
                                                >
                                                    <FormControl
                                                        fullWidth
                                                        className={clsx(
                                                            classes.widgetConfigFormControl,
                                                            classes.widgetConfigSelect
                                                        )}
                                                    >
                                                        <InputLabel
                                                            id="screen-overview-image"
                                                            className={
                                                                classes.widgetConfigCheckboxLabel
                                                            }
                                                        >
                                                            Ingest Components
                                                        </InputLabel>
                                                        <Select
                                                            variant="filled"
                                                            classes={{
                                                                icon: classes.widgetConfigIcon
                                                            }}
                                                            labelId="screen-overview-image"
                                                            id="screen_overview_image"
                                                            value={
                                                                this.state.visual_ingest_component
                                                                    ? this.state
                                                                          .visual_ingest_component
                                                                    : ''
                                                            }
                                                            label="Visual Ingest Components"
                                                            onChange={(event) =>
                                                                this.onFieldChange(
                                                                    'visual_ingest_component',
                                                                    event.target.value
                                                                )
                                                            }
                                                            MenuProps={{ className: classes.menu }}
                                                            inputProps={{
                                                                classes: {
                                                                    input: classes.input,
                                                                    formControl: classes.formControl
                                                                }
                                                            }}
                                                        >
                                                            {this.state.system_widgets &&
                                                                !this.state
                                                                    .loading_system_widgets &&
                                                                _.map(
                                                                    _.filter(
                                                                        this.state.system_widgets,
                                                                        function (system_widget) {
                                                                            return system_widget.types.includes(
                                                                                'INGEST'
                                                                            );
                                                                        }
                                                                    ),
                                                                    function (
                                                                        filtered_system_widget
                                                                    ) {
                                                                        return (
                                                                            <MenuItem
                                                                                key={
                                                                                    'visual_ingest_system_widget_' +
                                                                                    filtered_system_widget.name
                                                                                }
                                                                                value={
                                                                                    filtered_system_widget.name
                                                                                }
                                                                            >
                                                                                <Typography
                                                                                    className={clsx(
                                                                                        classes.f1,
                                                                                        classes.defaultColor
                                                                                    )}
                                                                                    variant="h5"
                                                                                >
                                                                                    {
                                                                                        filtered_system_widget.name
                                                                                    }
                                                                                </Typography>
                                                                            </MenuItem>
                                                                        );
                                                                    }
                                                                )}
                                                        </Select>
                                                    </FormControl>
                                                    {this.state.visual_ingest_component && (
                                                        <Link
                                                            component="button"
                                                            className={classes.viewDocs}
                                                            onClick={() =>
                                                                this.onClickVisualIngestInfoComponent()
                                                            }
                                                        >
                                                            View Docs
                                                        </Link>
                                                    )}
                                                    {this.state.show_visual_ingest_component_info &&
                                                        this.state.visual_ingest_component && (
                                                            <AppSystemWidgetInfo
                                                                parent_obj={this}
                                                                widget_info={
                                                                    selected_visual_ingest_widget_info
                                                                }
                                                                closeCallback={
                                                                    'onCloseVisualIngestInfoComponent'
                                                                }
                                                            />
                                                        )}
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={12}
                                                    className={classes.codeTemplateItem}
                                                >
                                                    <FormControl
                                                        fullWidth
                                                        className={clsx(
                                                            classes.widgetConfigFormControl,
                                                            classes.widgetConfigSelect
                                                        )}
                                                    >
                                                        <InputLabel
                                                            id="screen-overview-image"
                                                            className={
                                                                classes.widgetConfigCheckboxLabel
                                                            }
                                                        >
                                                            Visual Components
                                                        </InputLabel>
                                                        <Select
                                                            variant="filled"
                                                            classes={{
                                                                icon: classes.widgetConfigIcon
                                                            }}
                                                            labelId="screen-overview-image"
                                                            id="screen_overview_image"
                                                            value={
                                                                this.state.visual_component
                                                                    ? this.state.visual_component
                                                                    : ''
                                                            }
                                                            label="Visual Components"
                                                            onChange={(event) =>
                                                                this.onFieldChange(
                                                                    'visual_component',
                                                                    event.target.value
                                                                )
                                                            }
                                                            MenuProps={{ className: classes.menu }}
                                                            inputProps={{
                                                                classes: {
                                                                    input: classes.input,
                                                                    formControl: classes.formControl
                                                                }
                                                            }}
                                                        >
                                                            {this.state.system_widgets &&
                                                                !this.state
                                                                    .loading_system_widgets &&
                                                                _.map(
                                                                    _.filter(
                                                                        this.state.system_widgets,
                                                                        (system_widget) => {
                                                                            if (
                                                                                this.state
                                                                                    .selected_widget_type ===
                                                                                'METRIC'
                                                                            ) {
                                                                                return (
                                                                                    system_widget.types.includes(
                                                                                        'VISUAL'
                                                                                    ) &&
                                                                                    system_widget.name ===
                                                                                        'Metric'
                                                                                );
                                                                            } else {
                                                                                return (
                                                                                    system_widget.types.includes(
                                                                                        'VISUAL'
                                                                                    ) &&
                                                                                    system_widget.name !==
                                                                                        'Metric'
                                                                                );
                                                                            }
                                                                        }
                                                                    ),
                                                                    function (
                                                                        filtered_system_widget
                                                                    ) {
                                                                        return (
                                                                            <MenuItem
                                                                                key={
                                                                                    'visual_system_widget_' +
                                                                                    filtered_system_widget.name
                                                                                }
                                                                                value={
                                                                                    filtered_system_widget.name
                                                                                }
                                                                            >
                                                                                <Typography
                                                                                    className={clsx(
                                                                                        classes.f1,
                                                                                        classes.defaultColor
                                                                                    )}
                                                                                    variant="h5"
                                                                                >
                                                                                    {
                                                                                        filtered_system_widget.name
                                                                                    }
                                                                                </Typography>
                                                                            </MenuItem>
                                                                        );
                                                                    }
                                                                )}
                                                        </Select>
                                                    </FormControl>
                                                    {this.state.visual_component && (
                                                        <Link
                                                            component={'button'}
                                                            className={classes.viewDocs}
                                                            onClick={() =>
                                                                this.onClickVisualInfoComponent()
                                                            }
                                                        >
                                                            View Docs
                                                        </Link>
                                                    )}
                                                    {this.state.show_visual_component_info &&
                                                        this.state.visual_component && (
                                                            <AppSystemWidgetInfo
                                                                parent_obj={this}
                                                                widget_info={
                                                                    selected_visual_widget_info
                                                                }
                                                                closeCallback={
                                                                    'onCloseVisualInfoComponent'
                                                                }
                                                            />
                                                        )}
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={0}>
                                                <AppScreenPackageDetails
                                                    packages={this.state.packageList}
                                                />
                                            </Grid>
                                            <Grid container spacing={0}>
                                                <ArchivedUIaC
                                                    app_id={this.state.app_id}
                                                    screen_id={this.state.screen_id}
                                                    screen_name={screen_name}
                                                    archiveType="visual"
                                                />
                                            </Grid>
                                        </>
                                    )}
                                    {this.state.templateStep && (
                                        <>
                                            <Grid container spacing={0}>
                                                <Grid
                                                    item
                                                    xs={12}
                                                    className={classes.codeTemplateItem}
                                                >
                                                    <FormControl
                                                        fullWidth
                                                        className={clsx(
                                                            classes.widgetConfigFormControl,
                                                            classes.widgetConfigSelect
                                                        )}
                                                    >
                                                        <InputLabel
                                                            id="screen-overview-image"
                                                            className={
                                                                classes.widgetConfigCheckboxLabel
                                                            }
                                                        >
                                                            Application Variables
                                                        </InputLabel>
                                                        <Select
                                                            variant="filled"
                                                            classes={{
                                                                icon: classes.widgetConfigIcon
                                                            }}
                                                            labelId="screen-overview-image"
                                                            id="screen_overview_image"
                                                            value={
                                                                this.state.app_variable
                                                                    ? this.state.app_variable
                                                                    : ''
                                                            }
                                                            label="Application Variables"
                                                            onChange={(event) =>
                                                                this.onFieldChange(
                                                                    'app_variable',
                                                                    event.target.value
                                                                )
                                                            }
                                                            MenuProps={{ className: classes.menu }}
                                                            inputProps={{
                                                                classes: {
                                                                    input: classes.input,
                                                                    formControl: classes.formControl
                                                                }
                                                            }}
                                                        >
                                                            {this.state.app_variables &&
                                                                !this.state
                                                                    .loading_system_widgets &&
                                                                _.map(
                                                                    this.state.app_variables,
                                                                    function (app_variable) {
                                                                        return (
                                                                            <MenuItem
                                                                                key={
                                                                                    'app-variable-' +
                                                                                    app_variable
                                                                                }
                                                                                value={app_variable}
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
                                                                    }
                                                                )}
                                                        </Select>
                                                    </FormControl>
                                                    {this.state.app_variable && (
                                                        <Link
                                                            component="button"
                                                            className={classes.viewDocs}
                                                            onClick={() =>
                                                                this.onClickAppVariable()
                                                            }
                                                        >
                                                            Copy variable
                                                        </Link>
                                                    )}
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={12}
                                                    className={classes.codeTemplateItem}
                                                >
                                                    <FormControl
                                                        fullWidth
                                                        className={clsx(
                                                            classes.widgetConfigFormControl,
                                                            classes.widgetConfigSelect
                                                        )}
                                                    >
                                                        <InputLabel
                                                            id="screen-overview-image"
                                                            className={
                                                                classes.widgetConfigCheckboxLabel
                                                            }
                                                        >
                                                            Application Functions
                                                        </InputLabel>
                                                        <Select
                                                            variant="filled"
                                                            classes={{
                                                                icon: classes.widgetConfigIcon
                                                            }}
                                                            labelId="screen-overview-image"
                                                            id="screen_overview_image"
                                                            value={
                                                                this.state.app_function
                                                                    ? this.state.app_function
                                                                    : ''
                                                            }
                                                            label="Application Functions"
                                                            onChange={(event) =>
                                                                this.onFieldChange(
                                                                    'app_function',
                                                                    event.target.value
                                                                )
                                                            }
                                                            MenuProps={{ className: classes.menu }}
                                                            inputProps={{
                                                                classes: {
                                                                    input: classes.input,
                                                                    formControl: classes.formControl
                                                                }
                                                            }}
                                                        >
                                                            {this.state.app_functions &&
                                                                !this.state
                                                                    .loading_system_widgets &&
                                                                _.map(
                                                                    this.state.app_functions,
                                                                    function (app_function) {
                                                                        return (
                                                                            <MenuItem
                                                                                key={
                                                                                    'filter-system-widget-' +
                                                                                    app_function.key
                                                                                }
                                                                                value={
                                                                                    app_function.key
                                                                                }
                                                                                title={
                                                                                    app_function.desc
                                                                                }
                                                                            >
                                                                                <Typography
                                                                                    className={clsx(
                                                                                        classes.f1,
                                                                                        classes.defaultColor
                                                                                    )}
                                                                                    variant="h5"
                                                                                >
                                                                                    {
                                                                                        app_function.key
                                                                                    }
                                                                                </Typography>
                                                                            </MenuItem>
                                                                        );
                                                                    }
                                                                )}
                                                        </Select>
                                                    </FormControl>
                                                    {this.state.app_function ? (
                                                        this.state.app_functions.find(
                                                            (el) =>
                                                                el.key === this.state.app_function
                                                        ).test ? (
                                                            <Link
                                                                component="button"
                                                                aria-disabled
                                                                className={classes.viewDocs}
                                                                onClick={() =>
                                                                    this.onClickAppFunction()
                                                                }
                                                            >
                                                                Copy Code
                                                            </Link>
                                                        ) : (
                                                            <Typography
                                                                variant="h5"
                                                                className={clsx(
                                                                    classes.defaultColor,
                                                                    classes.fontSize3
                                                                )}
                                                            >
                                                                No Code Available
                                                            </Typography>
                                                        )
                                                    ) : null}
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={12}
                                                    className={classes.codeTemplateItem}
                                                >
                                                    <FormControl
                                                        fullWidth
                                                        className={clsx(
                                                            classes.widgetConfigFormControl,
                                                            classes.widgetConfigSelect
                                                        )}
                                                    >
                                                        <InputLabel
                                                            id="screen-overview-image"
                                                            className={
                                                                classes.widgetConfigCheckboxLabel
                                                            }
                                                        >
                                                            Scenario Creator
                                                        </InputLabel>
                                                        <Select
                                                            variant="filled"
                                                            classes={{
                                                                icon: classes.widgetConfigIcon
                                                            }}
                                                            labelId="screen-overview-image"
                                                            id="screen_overview_image"
                                                            value={
                                                                this.state.visual_component
                                                                    ? this.state.visual_component
                                                                    : ''
                                                            }
                                                            label="Visual Components"
                                                            onChange={(event) =>
                                                                this.onFieldChange(
                                                                    'visual_component',
                                                                    event.target.value
                                                                )
                                                            }
                                                            MenuProps={{ className: classes.menu }}
                                                            inputProps={{
                                                                classes: {
                                                                    input: classes.input,
                                                                    formControl: classes.formControl
                                                                }
                                                            }}
                                                        >
                                                            <MenuItem
                                                                key="visual_system_widget_inputs"
                                                                value="Simulator Input"
                                                            >
                                                                <Typography
                                                                    className={clsx(
                                                                        classes.f1,
                                                                        classes.defaultColor
                                                                    )}
                                                                    variant="h5"
                                                                >
                                                                    Simulator Input
                                                                </Typography>
                                                            </MenuItem>

                                                            <MenuItem
                                                                key="visual_system_widget_Analyze"
                                                                value="Analyze"
                                                            >
                                                                <Typography
                                                                    className={clsx(
                                                                        classes.f1,
                                                                        classes.defaultColor
                                                                    )}
                                                                    variant="h5"
                                                                >
                                                                    Analyze
                                                                </Typography>
                                                            </MenuItem>
                                                            <MenuItem
                                                                key="visual_system_widget_Compare"
                                                                value="Compare"
                                                            >
                                                                <Typography
                                                                    className={clsx(
                                                                        classes.f1,
                                                                        classes.defaultColor
                                                                    )}
                                                                    variant="h5"
                                                                >
                                                                    Compare
                                                                </Typography>
                                                            </MenuItem>
                                                            <MenuItem
                                                                key="visual_system_widget_Compare"
                                                                value="Compare Table"
                                                            >
                                                                <Typography
                                                                    className={clsx(
                                                                        classes.f1,
                                                                        classes.defaultColor
                                                                    )}
                                                                    variant="h5"
                                                                >
                                                                    Compare Table
                                                                </Typography>
                                                            </MenuItem>
                                                            <MenuItem
                                                                key="visual_system_widget_Compare"
                                                                value="Tabular simulator"
                                                            >
                                                                <Typography
                                                                    className={clsx(
                                                                        classes.f1,
                                                                        classes.defaultColor
                                                                    )}
                                                                    variant="h5"
                                                                >
                                                                    Tabular simulator
                                                                </Typography>
                                                            </MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                    {this.state.visual_component && (
                                                        <Link
                                                            component={'button'}
                                                            className={classes.viewDocs}
                                                            onClick={() =>
                                                                this.onClickVisualInfoComponent()
                                                            }
                                                        >
                                                            View Docs
                                                        </Link>
                                                    )}
                                                    {this.state.show_visual_component_info &&
                                                        this.state.visual_component && (
                                                            <AppSystemWidgetInfo
                                                                parent_obj={this}
                                                                widget_info={
                                                                    selected_visual_widget_info
                                                                }
                                                                closeCallback={
                                                                    'onCloseVisualInfoComponent'
                                                                }
                                                                simulator={true}
                                                            />
                                                        )}
                                                </Grid>
                                            </Grid>
                                        </>
                                    )}
                                </>
                            )
                        )}
                        {this.state.show_widget_filter_options && (
                            <>
                                <FormControl
                                    fullWidth
                                    className={clsx(
                                        classes.widgetConfigFormControl,
                                        classes.widgetConfigSelect
                                    )}
                                >
                                    <InputLabel
                                        id="app-variable"
                                        className={classes.widgetConfigCheckboxLabel}
                                    >
                                        Application Variables
                                    </InputLabel>
                                    <Select
                                        variant="filled"
                                        labelId="app-variable"
                                        id="app_variable"
                                        value={this.state.app_variable || ''}
                                        label="Application Variables"
                                        onChange={(event) =>
                                            this.onFieldChange('app_variable', event.target.value)
                                        }
                                        MenuProps={{ className: classes.menu }}
                                        inputProps={{
                                            classes: {
                                                input: classes.input,
                                                formControl: classes.formControl
                                            }
                                        }}
                                    >
                                        {this.state.app_variables &&
                                            _.map(this.state.app_variables, (app_variable) => (
                                                <MenuItem
                                                    key={'app-variable-' + app_variable}
                                                    value={app_variable}
                                                >
                                                    <Typography variant="h5">
                                                        {app_variable}
                                                    </Typography>
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>

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
                                            labelId="screen-overview-image"
                                            id="Application_Functions"
                                            value={
                                                this.state.app_function
                                                    ? this.state.app_function
                                                    : ''
                                            }
                                            label="Application Functions"
                                            onChange={(event) =>
                                                this.onFieldChange(
                                                    'app_function',
                                                    event.target.value
                                                )
                                            }
                                            variant="filled"
                                            MenuProps={{ className: classes.menu }}
                                            inputProps={{
                                                classes: {
                                                    input: classes.input,
                                                    formControl: classes.formControl
                                                }
                                            }}
                                        >
                                            {this.state.app_functions &&
                                                !this.state.loading_system_widgets &&
                                                _.map(
                                                    this.state.app_functions,
                                                    function (app_function) {
                                                        return (
                                                            <MenuItem
                                                                key={
                                                                    'filter-system-widget-' +
                                                                    app_function.key
                                                                }
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
                                                    }
                                                )}
                                        </Select>
                                    </FormControl>
                                    {this.state.app_function ? (
                                        this.state.app_functions.find(
                                            (el) => el.key === this.state.app_function
                                        ).test ? (
                                            <Link
                                                component="button"
                                                aria-disabled
                                                className={classes.viewDocs}
                                                onClick={() => this.onClickAppFunction()}
                                            >
                                                Copy Code
                                            </Link>
                                        ) : (
                                            <Typography
                                                variant="h5"
                                                className={clsx(
                                                    classes.defaultColor,
                                                    classes.fontSize3
                                                )}
                                            >
                                                No Code Available
                                            </Typography>
                                        )
                                    ) : null}
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
                                            Ingest Components
                                        </InputLabel>
                                        <Select
                                            classes={{
                                                icon: classes.widgetConfigIcon
                                            }}
                                            labelId="screen-overview-image"
                                            id="Application_Functions"
                                            value={
                                                this.state.app_function
                                                    ? this.state.app_function
                                                    : ''
                                            }
                                            label="Application Functions"
                                            onChange={(event) =>
                                                this.onFieldChange(
                                                    'app_function',
                                                    event.target.value
                                                )
                                            }
                                            variant="filled"
                                            MenuProps={{ className: classes.menu }}
                                            inputProps={{
                                                classes: {
                                                    input: classes.input,
                                                    formControl: classes.formControl
                                                }
                                            }}
                                        >
                                            {this.state.app_functions &&
                                                !this.state.loading_system_widgets &&
                                                _.map(
                                                    this.state.app_functions,
                                                    function (app_function) {
                                                        return (
                                                            <MenuItem
                                                                key={
                                                                    'filter-system-widget-' +
                                                                    app_function.key
                                                                }
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
                                                    }
                                                )}
                                        </Select>
                                    </FormControl>
                                    {this.state.app_function ? (
                                        this.state.app_functions.find(
                                            (el) => el.key === this.state.app_function
                                        ).test ? (
                                            <Link
                                                component="button"
                                                aria-disabled
                                                className={classes.viewDocs}
                                                onClick={() => this.onClickAppFunction()}
                                            >
                                                Copy Code
                                            </Link>
                                        ) : (
                                            <Typography
                                                variant="h5"
                                                className={clsx(
                                                    classes.defaultColor,
                                                    classes.fontSize3
                                                )}
                                            >
                                                No Code Available
                                            </Typography>
                                        )
                                    ) : null}
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
                                            System Components
                                        </InputLabel>
                                        <Select
                                            variant="filled"
                                            classes={{
                                                icon: classes.widgetConfigIcon
                                            }}
                                            labelId="screen-overview-image"
                                            id="System_Components"
                                            value={
                                                this.state.visual_component
                                                    ? this.state.visual_component
                                                    : ''
                                            }
                                            label="Visual Components"
                                            onChange={(event) =>
                                                this.onFieldChange(
                                                    'visual_component',
                                                    event.target.value
                                                )
                                            }
                                            MenuProps={{ className: classes.menu }}
                                            inputProps={{
                                                classes: {
                                                    input: classes.input,
                                                    formControl: classes.formControl
                                                }
                                            }}
                                        >
                                            <MenuItem key="widget_filter" value="Widget Filter">
                                                <Typography
                                                    className={clsx(
                                                        classes.f1,
                                                        classes.defaultColor
                                                    )}
                                                    variant="h5"
                                                >
                                                    Widget Filter
                                                </Typography>
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                    {this.state.visual_component && (
                                        <Link
                                            component="button"
                                            className={classes.viewDocs}
                                            onClick={() => this.onClickVisualInfoComponent()}
                                        >
                                            View Docs
                                        </Link>
                                    )}
                                    {this.state.show_visual_component_info &&
                                        this.state.visual_component && (
                                            <AppSystemWidgetInfo
                                                parent_obj={this}
                                                widget_info={selected_visual_widget_info}
                                                closeCallback={'onCloseVisualInfoComponent'}
                                            />
                                        )}
                                </Grid>
                            </>
                        )}
                    </div>
                </Grid>
            </Grid>
        );
    };

    handleStepClick = (step_index) => {
        this.setState({
            activeStep: step_index
        });
        if (step_index === 1) {
            // TODO: load filter UIAC
        } else if (step_index === 2) {
            // TODO: load actions UIAC
        }
    };

    handleStepClickLayout = (step_index) => {
        this.setState({
            activeStepLayout: step_index
        });
    };

    handleTemplateStepClick = (step_index) => {
        this.setState({
            templateStep: step_index
        });
    };

    onClickVisualInfoComponent = () => {
        this.setState({
            show_visual_component_info: true
        });
    };

    onCloseVisualInfoComponent = () => {
        this.setState({
            show_visual_component_info: false
        });
    };

    onClickVisualIngestInfoComponent = () => {
        this.setState({
            show_visual_ingest_component_info: true
        });
    };

    onCloseVisualIngestInfoComponent = () => {
        this.setState({
            show_visual_ingest_component_info: false
        });
    };

    showScreenWidgetCodeComponents = (type) => {
        if (type === 'VISUAL') {
            this.setState({
                show_visual_code_component: true,
                show_information_code_component: true,
                show_widget_filter_options: false
            });
        } else if (type === 'WIDGETS') {
            this.setState({
                show_visual_code_component: false,
                show_information_code_component: false,
                show_widget_filter_options: true
            });
        } else {
            this.setState({
                show_visual_code_component: false,
                show_information_code_component: false
            });
        }
    };

    handleNotifications = (data) => {
        if (data?.layoutUpdated) {
            this.setState({
                widgets: data.data.widgets,
                selected_widget_id: null,
                show_visual_code_component: false,
                notificationOpen: true,
                notification: {
                    message: 'Screen layout has been updated.',
                    severity: 'warning',
                    autoHideDuration: null
                }
            });
        }

        if (data?.screenRemoved) {
            this.setState({
                notificationOpen: true,
                notification: {
                    message:
                        'Current screen has been removed. Please save your screen level changes.',
                    severity: 'warning',
                    autoHideDuration: null
                }
            });
        }
    };

    render() {
        const { classes, unsavedValues, app_info, nac_collaboration } = this.props;
        const screen = app_info.screens.find((el) => el.id == this.props.screen_id);
        const screen_name = screen?.screen_name || this.state.screen_name;
        return (
            <div className={classes.noTitleBody}>
                <div className={classes.screenBreadcrumbContainer}>
                    <ScreenLevelBreadcrumb
                        screens={this.props.screens}
                        screenId={this.props.screen_id}
                    />
                    <div style={{ flex: 1 }}></div>
                    <Link
                        variant="button"
                        style={{ marginLeft: 'auto' }}
                        className={classes.previewBtn}
                        onClick={this.onClickFilterPreview}
                    >
                        Preview Screen
                    </Link>
                </div>
                {this.state.preview_filters && (
                    <Dialog
                        open={this.state.preview_filters}
                        fullWidth
                        classes={{ paper: classes.previewFilterPaper }}
                        maxWidth="xl"
                        onClose={() => {
                            this.hidePreviewFilters();
                        }}
                        aria-labelledby="admin preview screen"
                    >
                        <DialogTitle
                            disableTypography
                            id="admin preview-screen"
                            className={classes.dialogTitle}
                        >
                            <Typography variant="h4" className={classes.previewFilterHeading}>
                                {'Preview Screen'}
                            </Typography>
                            <IconButton
                                title="Close"
                                onClick={() => {
                                    this.hidePreviewFilters();
                                }}
                                className={classes.previewFilterActionIcon}
                                aria-label="Close"
                            >
                                <Close fontSize="large" />
                            </IconButton>
                        </DialogTitle>
                        <div className={classes.previewFilterContainer}>
                            <AppScreen
                                onDownloadPDF={this.props.onDownloadPDF}
                                onDownloadPNG={this.props.onDownloadPNG}
                                key="app_screen_preview"
                                app_info={this.props.app_info}
                                logged_in_user_info={this.props.logged_in_user_info}
                                preview_screen_id={this.props.screen_id}
                                handleStoriesCount={() => {
                                    return true;
                                }}
                                previewCallback={this.props.previewCallback}
                                setGPTinfo={this.props.setGPTinfo && this.props.setGPTinfo}
                                setProgressBarConfDetails={() => {}}
                                setScreenProgressData={() => {}}
                                screen_id={this.state.screen_id}
                                // a dummy function passed so that downstream components don't throw an error
                                // stories cannot be created from preview
                            />
                        </div>
                    </Dialog>
                )}
                {this.state.customLayout && (
                    <Dialog
                        open={this.state.customLayout}
                        fullWidth
                        classes={{ paper: classes.previewFilterPaper }}
                        maxWidth="xl"
                        onClose={() => {
                            this.hidePreviewFilters();
                        }}
                        aria-labelledby="admin preview screen"
                    >
                        <DialogTitle
                            disableTypography
                            id="admin preview-screen"
                            className={classes.dialogTitleCustomLayout}
                        >
                            <Typography className={classes.layoutPopUpHeading}>
                                {'Create Custom Layouts'}
                            </Typography>
                            <IconButton
                                title="Close"
                                onClick={() => {
                                    this.setState({ customLayout: false });
                                }}
                                className={classes.previewFilterActionIcon}
                                aria-label="Close"
                            >
                                <CloseIcon className={classes.closeIconStyle} fontSize="large" />
                            </IconButton>
                        </DialogTitle>
                        <div className={classes.previewFilterContainer}>
                            <MyProvider>
                                <CustomLayout
                                    kpiCount={this.state.custom_kpi}
                                    setKpiCount={(e) => this.handleKpiCountChange(e)}
                                    handleOrientationChange={(e) => this.handleOrientationChange(e)}
                                    handleGraphTypeChange={(graphType, graphCount) =>
                                        this.handleGraphTypeChange(graphType, graphCount)
                                    }
                                    handleGraphWHPatternChange={this.handleGraphWHPatternChange}
                                    disabled={
                                        this.state.custom_graph !== 0 &&
                                        this.state.custom_graph !== '' &&
                                        this.state.custom_graphType !== '' &&
                                        this.state.custom_error === false
                                            ? false
                                            : true
                                    }
                                    onSaveClick={this.onClickSaveCustomLayout}
                                    onCancel={() =>
                                        this.setState({ customLayout: !this.state.customLayout })
                                    }
                                />
                            </MyProvider>
                        </div>
                    </Dialog>
                )}

                {this.state.uiacError && (
                    <Dialog
                        open={this.state.dialogOpen}
                        fullWidth
                        maxWidth={'md'}
                        aria-labelledby="uiac validation error"
                        aria-describedby="uiac error content"
                    >
                        <DialogTitle id="uiac validation error">{'Validation Failed'}</DialogTitle>

                        <DialogContent className={classes.dialogContent} id="uiac error content">
                            {this.state.uiacError ? (
                                <DialogContentText>
                                    {_.map(this.state.uiacError.errors, function (item) {
                                        return (
                                            <div className={classes.errorWidgetInsight}>
                                                <div className={classes.errorHeading}>
                                                    {item.type}
                                                </div>
                                                <div>{item.message}</div>
                                            </div>
                                        );
                                    })}

                                    {_.map(this.state.uiacError.warnings, function (item) {
                                        return (
                                            <div className={classes.warningWidgetInsight}>
                                                <div className={classes.errorHeading}>
                                                    {item.type}
                                                </div>
                                                <div>{item.message}</div>
                                            </div>
                                        );
                                    })}
                                </DialogContentText>
                            ) : null}
                        </DialogContent>

                        <DialogActions>
                            <Button
                                variant={'outlined'}
                                onClick={() => this.setState({ dialogOpen: false })}
                                aria-label="Close"
                            >
                                {'close'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}

                <div className={classes.screenBodyContainer}>
                    {this.state.loading_save && (
                        <div className={classes.screenBodyLoader}>
                            <CodxCircularLoader size={60} center />
                        </div>
                    )}
                    {this.state.loading || this.state.loading_config ? (
                        <CodxCircularLoader size={60} center />
                    ) : (
                        [
                            <div
                                key="app-admin-screen-tab-header-container"
                                className={classes.wizardContainer}
                            >
                                <ButtonBase
                                    centerRipple
                                    className={clsx(
                                        classes.wizardItem,
                                        this.state.activeStep === 0
                                            ? classes.selectedWizardItem
                                            : null
                                    )}
                                    onClick={() => this.handleStepClick(0)}
                                    title={
                                        unsavedValues?.overview
                                            ? 'Unsaved changes'
                                            : 'Configure details of the screen'
                                    }
                                >
                                    <Typography className={classes.screenTabHeader}>
                                        Overview
                                        {unsavedValues?.overview ? (
                                            <FiberManualRecordIcon
                                                fontSize="small"
                                                className={classes.unsavedIndicator}
                                                color="inherit"
                                            />
                                        ) : null}
                                    </Typography>
                                </ButtonBase>
                                <ButtonBase
                                    centerRipple
                                    className={clsx(
                                        classes.wizardItem,
                                        this.state.activeStep === 1
                                            ? classes.selectedWizardItem
                                            : null
                                    )}
                                    onClick={() => this.handleStepClick(1)}
                                    title={
                                        unsavedValues?.filter
                                            ? 'Unsaved changes'
                                            : 'Configure how the filters will work for this screen'
                                    }
                                >
                                    <Typography className={classes.screenTabHeader}>
                                        Filter UIaC
                                        {unsavedValues?.filter ? (
                                            <FiberManualRecordIcon
                                                fontSize="small"
                                                className={classes.unsavedIndicator}
                                                color="inherit"
                                            />
                                        ) : null}
                                    </Typography>
                                </ButtonBase>
                                <ButtonBase
                                    centerRipple
                                    className={clsx(
                                        classes.wizardItem,
                                        this.state.activeStep === 2
                                            ? classes.selectedWizardItem
                                            : null
                                    )}
                                    onClick={() => this.handleStepClick(2)}
                                    title={
                                        unsavedValues?.screen_actions
                                            ? 'Unsaved changes'
                                            : 'Configure how the actions will work for this screen'
                                    }
                                >
                                    <Typography className={classes.screenTabHeader}>
                                        Screen-level Actions
                                        {unsavedValues?.screen_actions ? (
                                            <FiberManualRecordIcon
                                                fontSize="small"
                                                className={classes.unsavedIndicator}
                                                color="inherit"
                                            />
                                        ) : null}
                                    </Typography>
                                </ButtonBase>
                                <ButtonBase
                                    centerRipple
                                    className={clsx(
                                        classes.wizardItem,
                                        this.state.activeStep === 3
                                            ? classes.selectedWizardItem
                                            : null
                                    )}
                                    onClick={() => this.handleStepClick(3)}
                                    title={
                                        unsavedValues?.layout
                                            ? 'Unsaved changes'
                                            : 'Choose the layout of the screen'
                                    }
                                >
                                    <Typography className={classes.screenTabHeader}>
                                        Layout Selection
                                        {unsavedValues?.layout ? (
                                            <FiberManualRecordIcon
                                                fontSize="small"
                                                className={classes.unsavedIndicator}
                                                color="inherit"
                                            />
                                        ) : null}
                                    </Typography>
                                </ButtonBase>
                                <ButtonBase
                                    centerRipple
                                    className={clsx(
                                        classes.wizardItem,
                                        this.state.activeStep === 4
                                            ? classes.selectedWizardItem
                                            : null
                                    )}
                                    onClick={() => this.handleStepClick(4)}
                                    disabled={!this.state.widgets.length}
                                    title={
                                        unsavedValues?.widget
                                            ? 'Unsaved changes'
                                            : 'Configure the Visuals in your selected layout'
                                    }
                                >
                                    <Typography className={classes.screenTabHeader}>
                                        Visual UIaC
                                        {unsavedValues?.widget ? (
                                            <FiberManualRecordIcon
                                                fontSize="small"
                                                className={classes.unsavedIndicator}
                                                color="inherit"
                                            />
                                        ) : null}
                                    </Typography>
                                </ButtonBase>
                                <div style={{ position: 'absolute', right: 0, zIndex: 2 }}>
                                    <CodxCollabWork
                                        room={`${this.props.app_info.id}#nac_tabs_ack#${this.props.screen_id}#${this.state.activeStep}`}
                                        currentUserAvatarProps={{
                                            max: 1,
                                            enableTeamsCollaboration: true,
                                            teamsTopicName: `NAC: ${
                                                this.props.app_info.name
                                            } | Screen: ${screen_name} | Tab: ${
                                                [
                                                    'Overview',
                                                    'Filter',
                                                    'Screen Actions',
                                                    'Layout',
                                                    'Widget'
                                                ][this.state.activeStep]
                                            }`,
                                            teamsMessage: 'Hi!'
                                        }}
                                        disabled={!this.props.editMode || !nac_collaboration}
                                    />
                                    <CodxCollabWork
                                        room={`${this.props.app_info.id}#nac_screen_level_changes#${this.props.screen_id}`}
                                        state={{ unsavedValues: this.props.unsavedValues }}
                                        onStateChange={(state) =>
                                            this.props.setCompleteUnsavedState(state.unsavedValues)
                                        }
                                        hideCurrentUsersAvatars={true}
                                        disabled={!this.props.editMode || !nac_collaboration}
                                    />
                                    <CodxCollabWork
                                        room={`${this.props.app_info.id}#nac_screen_notification#${this.props.screen_id}`}
                                        onStateChange={(data) => this.handleNotifications(data)}
                                        hideCurrentUsersAvatars={true}
                                        disabled={!this.props.editMode || !nac_collaboration}
                                    />
                                </div>
                            </div>,
                            <div
                                key="app-admin-screen-tab-grid-container"
                                className={classes.gridContainer}
                            >
                                {this.state.activeStep === 0 && this.renderOverviewEditor()}
                                {this.state.activeStep === 1 && this.renderFilterEditor()}
                                {this.state.activeStep === 2 && this.renderActionsEditor()}
                                {this.state.activeStep === 3 && this.renderLayoutSelection()}
                                {this.state.activeStep === 4 &&
                                    this.renderWidgetEditor(screen_name)}
                            </div>,
                            <CustomSnackbar
                                key="app-admin-screen-notification-container"
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
                        ]
                    )}
                </div>
            </div>
        );
    }
}

AppScreenAdmin.propTypes = {
    classes: PropTypes.object.isRequired,
    app_info: PropTypes.object.isRequired
};

export default withStyles(
    (theme) => ({
        ...appScreenAdminStyle(theme),
        ...customFormStyle(theme)
    }),
    { withTheme: true }
)(AppScreenAdmin);
