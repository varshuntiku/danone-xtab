import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import customFormStyle from 'assets/jss/customFormStyle.jsx';
import appScreenWidgetEditorStyle from 'assets/jss/appScreenWidgetEditorStyle.jsx';

import {
    Typography,
    Grid,
    FormControl,
    TextField,
    Button,
    Tabs,
    Tab,
    FormControlLabel,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputLabel,
    Select,
    MenuItem
} from '@material-ui/core';

import CustomSnackbar from 'components/CustomSnackbar.jsx';
import AppAdminCodeEditor from 'components/Admin/AppAdminCodeEditor.jsx';
import AppAdminPowerBIConfig from 'components/Admin/AppAdminPowerBIConfig.jsx';

import { previewFilters, testVisualization } from 'services/filters.js';
import {
    saveScreenWidgetConfig,
    saveScreenWidgetUIAC,
    getSystemWidgets
    // getConnSystemsData,
    // updateWidgetConnSystemsIdentifier,
    // deleteWidgetConnSystemsIdentifier
} from 'services/screen.js';
import CodxCircularLoader from '../CodxCircularLoader';
import CodxCollabWork from '../CodxCollabWork';
// import AddIcon from '@material-ui/icons/Add';
// import DeleteIcon from '@material-ui/icons/Delete';
import { decodeHtmlEntities } from '../../util/decodeHtmlEntities';
import AppAdminTableauConfig from './AppAdminTableauConfig';
import clsx from 'clsx';
import * as _ from 'underscore';
import { removeActiveScreenWidgetsDetails } from 'store/index';
import { connect } from 'react-redux';

class AppScreenWidgetEditor extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            widget_info: props.widget_info || {},
            widget_filter_code: {},
            preview_visualization: false,
            widget_preview_data: false,
            screen_filters_values: false,
            selected_filters: false,
            // show_edit_widget: false,
            loading: true,
            loading_system_widgets: false,
            system_widgets: false,
            activeStep: 0,
            loading_preview: false,
            loading_test: false,
            viz_response_timetaken: false,
            viz_response_size: false,
            viz_response_output: false,
            viz_response_logs: false,
            widget_filter_response_logs: false,
            widget_filter_response_timetaken: false,
            widget_filter_response_size: false,
            widget_filter_output: false,
            simulation_response_timetaken: false,
            simulation_response_size: false,
            simulation_response_output: false,
            simulation_response_logs: false,
            selected_visual_section: 'OUTPUT',
            selected_simulation_section: 'OUTPUT',
            current_users: [],
            conn_systems_data: [],
            selected_conn_systems_values: [],
            max_id: 0,
            editConnSystemsKpis: false,
            deleted_values: [],
            editOverview: false,
            overviewDetails: props.widget_info.config,
            download_enable: props.widget_info.config?.download_enable || false,
            is_powerbi: props.widget_info.config?.is_powerbi || false,
            is_tableau: props.widget_info.config?.is_tableau || false,
        };
        this.iconPositionsList = [
            { label: 'Top Left', value: 'top-left' },
            { label: 'Top Right', value: 'top-right' },
            { label: 'Top Center', value: 'top-center' },
            { label: 'Bottom Left', value: 'bottom-left' },
            { label: 'Bottom Right', value: 'bottom-right' },
            { label: 'Bottom Center', value: 'bottom-center' }
        ];
        this.debouncedOnChangeVisualizationCode = this.debounce(
            this.onChangeVisualizationCode,
            300
        );
        this.debouncedOnChangeFilterCode = this.debounce(this.onChangeFilterCode, 300);
        this.debounceUnSavedChanges = this.debounce((widget_id, field_value, field_params) => {
            this.props.setUnsavedValue('widget', {
                [widget_id]: field_value !== this.state.overviewDetails[field_params.field_id]
            });
        }, 300);
    }

    debounce = (func, delay) => {
        let timer;
        return (...args) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };
    componentDidMount() {
        const { app_info } = this.props;

        if (app_info) {
            this.setState({
                loading_system_widgets: true
            });

            getSystemWidgets({
                app_id: app_info.id,
                callback: this.onResponseSystemWidgets
            });

            // getConnSystemsData({
            //     app_id: this.props.app_info.id,
            //     widget_id: this.state.widget_info?.id,
            //     callback: this.onResponseConnSystemsData
            // });
        }
        if (this.props?.widget_info?.config?.download_enable == undefined) {
            this.onMountCheckDownloadEnable();
        }
    }

    componentWillUnmount() {
        // stop_codx_collab(this.getKey());
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.widget_id !== prevProps.widget_id) {
            this.setState({
                widget_info: this.props.widget_info || {},
                viz_response_timetaken: false,
                viz_response_size: false,
                viz_response_output: false,
                viz_response_logs: false
            });
        }
        if (this.state.activeStep !== prevState.activeStep && this.state.activeStep == 0) {
            if (this.props?.widget_info?.config?.download_enable == undefined) {
                this.onMountCheckDownloadEnable();
            }
        }
    }

    onResponseSystemWidgets = (response_data) => {
        this.setState({
            loading_system_widgets: false,
            system_widgets: response_data['data']['system_widgets'],
            app_variables: response_data['data']['app_variables'],
            app_functions: response_data['data']['app_functions']
        });
    };

    // getScreenWidgetData() {
    //   const { app_info, screen_id, widget_info } = this.props;

    //   getScreenWidget({
    //     app_id: app_info.id,
    //     screen_id: screen_id,
    //     widget_id: widget_info.id,
    //     callback: this.onResponseGetScreenWidget
    //   });
    // }

    getWidgetData = (selected_filters) => {
        this.setState({
            selected_filters: selected_filters
        });
    };

    // onResponseGetScreenWidget = (response_data) => {
    //   this.setState({
    //     loading: false,
    //     show_edit_widget: true,
    //     widget_info: {
    //       ...this.state.widget_info,
    //       title: response_data['data']['title'],
    //       sub_title: response_data['data']['sub_title'],
    //       metric_factor: response_data['data']['metric_factor'],
    //       prefix: response_data['data']['prefix'],
    //       color_nooverride: response_data['data']['color_nooverride'],
    //       size_nooverride: response_data['data']['size_nooverride'],
    //       code: response_data['data']['code']
    //     }
    //   });
    // }

    onHandleFieldChange = (field_id, field_value, field_params) => {
        var widget_info = this.state.widget_info;
        const { widget_id } = this.props;

        this.debounceUnSavedChanges(widget_id, field_value, field_params);
        if (

            field_params.field_id === 'workbookName'||
            field_params.field_id ==='viewName'||
            field_params.field_id==='sheetName' // Include 'url' if you want to track it as well
        ) {
            let tableau_config = widget_info.config.tableau_config;

            if (!tableau_config) {
                tableau_config = {
                    [field_params.field_id]: field_value
                };
            } else {
                tableau_config = {
                    ...tableau_config,
                    [field_params.field_id]: field_value
                };
            }

            widget_info.config = {
                ...widget_info.config,
                tableau_config: tableau_config
            };
        }

        if (
            field_params.field_id === 'workspaceId' ||
            field_params.field_id === 'reportId' ||
            field_params.field_id === 'pageName' ||
            field_params.field_id === 'visualName'
        ) {
            var powerbi_config = widget_info.config.powerbi_config;

            if (!powerbi_config) {
                powerbi_config = {
                    [field_params.field_id]: field_value
                };
            } else {
                powerbi_config = {
                    ...powerbi_config,
                    [field_params.field_id]: field_value
                };
            }
            for (let key in powerbi_config) {
                if (powerbi_config[key] === 'undefined') {
                    delete powerbi_config[key];
                }
            }
            widget_info.config = {
                ...widget_info.config,
                powerbi_config: powerbi_config
            };
        } else {
            widget_info.config = {
                ...widget_info.config,
                [field_params.field_id]: field_value
            };
        }

        this.setState({
            widget_info: widget_info,
            editOverview: field_value !== this.state.overviewDetails[field_params.field_id]
        });
        // emit_change_codx_collab(this.getKey(), {
        //   widget_info: widget_info,
        //   unsaved: true
        // })
        this.props.onWidgetInfoChange(widget_info);
        if (field_params?.field_id == 'download_enable') {
            this.setState({
                download_enable: !this.state.download_enable
            });
        }

        if (field_params?.field_id == 'is_powerbi') {
            this.setState({
                is_powerbi: !this.state.is_powerbi
            });
        }

        if (field_params?.field_id == 'is_tableau') {
            this.setState({
                is_tableau: !this.state.is_tableau
            });
        }
        if (
            field_params?.field_id == 'is_tableau' ||
            field_params.field_id === 'workbookName' ||
            field_params.field_id === 'viewName'||
            field_params.field_id==='sheetName'

         ){
                this.onChangeVisualizationCode(this.getTableauCode());
            }

        if (
            field_params?.field_id == 'is_powerbi' ||
            field_params.field_id === 'workspaceId' ||
            field_params.field_id === 'reportId' ||
            field_params.field_id === 'pageName' ||
            field_params.field_id === 'visualName'
        ) {
            this.onChangeVisualizationCode(this.getPowerBICode());
        }
    };
    getTableauCode = () => {
        // Assuming you have a URL state in your component
        const workbookName = this.state.widget_info.config?.tableau_config?.workbookName;
        const viewName = this.state.widget_info.config?.tableau_config?.viewName;
        const sheetName=this.state.widget_info.config?.tableau_config?.sheetName;
         // Get the URL from the state

        var code_string =
        '\
import json\n\n\
\n\
dynamic_outputs = json.dumps({\
"tableau_config": {\
    "workbookName": "' +
        workbookName +
        '",\
    "viewName": "' +
        viewName +
        '",\
    "sheetName": "' +
        sheetName +
        '",\
    \
}\
})';

    return code_string;
};


    getPowerBICode = () => {
        var workspaceId = this.state.widget_info.config?.powerbi_config?.workspaceId;
        var reportId = this.state.widget_info.config?.powerbi_config?.reportId;
        var pageName = this.state.widget_info.config?.powerbi_config?.pageName;
        var visualName = this.state.widget_info.config?.powerbi_config?.visualName;

        var code_string =
            '\
import json\n\n\
\n\
dynamic_outputs = json.dumps({\
    "powerbi_config": {\
        "workspaceId": "' +
            workspaceId +
            '",\
        "reportId": "' +
            reportId +
            '",\
        "pageName": "' +
            pageName +
            '",\
        "visualName": "' +
            visualName +
            '",\
    }\
})';

        return code_string;
    };

    onChangeVisualizationCode = (code_text) => {
        if (this.state.widget_info['code'] !== code_text) {
            var widget_info = this.state.widget_info;
            const { widget_id } = this.props;
            widget_info['code'] = code_text;
            this.props.setUnsavedValue('widget', { [widget_id]: true });
            this.setState({
                widget_info: widget_info
            });
            // emit_change_codx_collab(this.getKey(), {
            //   widget_info: widget_info,
            //   unsaved: true
            // })
            this.props.onWidgetInfoChange(widget_info);
        }
    };

    onChangeFilterCode = (code_text) => {
        if (this.state.widget_info['filter_code'] !== code_text) {
            var widget_info = this.state.widget_info;
            const { widget_id } = this.props;
            widget_info['filter_code'] = code_text;
            this.props.setUnsavedValue('widget', { [widget_id]: true });
            this.setState({
                widget_info: widget_info
            });
            // emit_change_codx_collab(this.getKey(), {
            //   widget_info: widget_info,
            //   unsaved: true
            // })
            this.props.onWidgetInfoChange(widget_info);
        }
    };

    onResponseFilterTestFilters = (response_data) => {
        this.setState({
            widget_filter_response_logs: response_data.logs,
            widget_filter_response_timetaken: response_data.timetaken,
            widget_filter_response_size: response_data.size,
            loading_test: false,
            widget_filter_output: response_data.output
        });
    };

    onClickFilterTest = () => {
        this.setState({
            loading_test: true
        });

        testVisualization({
            app_id: this.props.app_info.id,
            payload: {
                code: this.state.widget_info['filter_code']
            },
            callback: this.onResponseFilterTestFilters
        });
    };

    // onChangeSimulatorCode = (code_text) => {
    //   var widget_info = this.state.widget_info;
    //   widget_info['simulator_code'] = code_text;

    //   this.setState({
    //     widget_info: widget_info
    //   });
    // }

    // onChangeInformationCode = (code_text) => {
    //   var widget_info = this.state.widget_info;
    //   if (widget_info['assumptions']) {
    //     widget_info['assumptions']['information_code'] = code_text;
    //   } else {
    //     widget_info['assumptions'] = {
    //       information_code: code_text
    //     };
    //   }

    //   this.setState({
    //     widget_info: widget_info
    //   });
    // }

    onMountCheckDownloadEnable = () => {
        const { app_info, parent_obj } = this.props;

        const onResponseData = (response_data) => {
            if (
                response_data?.output?.table_data &&
                !response_data?.output?.is_grid_table &&
                !response_data?.output?.isExpandable &&
                this.state?.widget_info?.config?.download_enable == undefined
            ) {
                this.onHandleFieldChange(null, true, {
                    field_id: 'download_enable'
                });
                this.onClickSaveWidgetDownloadConfig();
            }
        };

        const onResponseTestFilters = (response_data) => {
            const { app_info } = this.props;

            testVisualization({
                app_id: app_info.id,
                payload: {
                    code: this.state.widget_info['code'],
                    filters: this.state.selected_filters
                        ? this.state.selected_filters
                        : response_data.defaultValues
                },
                callback: onResponseData
            });
        };
        previewFilters({
            app_id: app_info.id,
            payload: {
                code_string: parent_obj?.state?.filter_code
            },
            callback: onResponseTestFilters
        });
    };

    onClickVisualizationTest = () => {
        const { app_info, parent_obj } = this.props;

        ReactDOM.flushSync(() => {
            this.setState({
                loading_test: true
            });
        });

        previewFilters({
            app_id: app_info.id,
            payload: {
                code_string: parent_obj.state.filter_code
            },
            callback: this.onResponseTestFiltersViz
        });
    };

    onResponseTestFiltersViz = (response_data) => {
        const { app_info } = this.props;
        ReactDOM.flushSync(() => {
            this.setState({
                screen_filters_values: response_data
            });
        });

        testVisualization({
            app_id: app_info.id,
            payload: {
                code: this.state.widget_info['code'],
                filters: this.state.selected_filters
                    ? this.state.selected_filters
                    : this.state.screen_filters_values.defaultValues
            },
            callback: this.onResponseTestVisualization
        });
    };

    onResponseTestVisualization = (response_data) => {
        ReactDOM.flushSync(() => {
            this.setState({
                viz_response_timetaken: response_data.timetaken,
                viz_response_size: response_data.size,
                viz_response_output: response_data.output,
                viz_response_logs: response_data.logs,
                loading_test: false
            });
        });
    };

    onClickSaveWidgetDownloadConfig = async () => {
        const { app_info, screen_id, widget_id } = this.props;
        this.setState({
            overviewDetails: this.state.widget_info.config
        });

        try {
            await Promise.allSettled([
                saveScreenWidgetConfig({
                    app_id: app_info.id,
                    screen_id: screen_id,
                    widget_id: widget_id,
                    payload: {
                        config: this.state.widget_info.config
                    }
                })
            ]);
            this.props.setUnsavedValue('widget', { [widget_id]: false });
        } catch (err) {
            this.setState({
                notificationOpen: true,
                notification: {
                    message: 'Failed to save Widget data!',
                    severity: 'error'
                }
            });
        }
    };

    onClickSaveWidget = async () => {
        const { app_info, screen_id, widget_id, parent_obj } = this.props;
        this.setState({
            overviewDetails: this.state.widget_info.config
        });

        parent_obj.showLoadingSave();

        try {
            const widgetOverviewResp = await Promise.allSettled([
                saveScreenWidgetConfig({
                    app_id: app_info.id,
                    screen_id: screen_id,
                    widget_id: widget_id,
                    payload: {
                        config: this.state.widget_info.config
                    }
                }),
                saveScreenWidgetUIAC({
                    app_id: app_info.id,
                    screen_id: screen_id,
                    widget_id: widget_id,
                    payload: {
                        code: this.state.widget_info.code ? this.state.widget_info.code : '',
                        filter_code: this.state.widget_info.filter_code
                            ? this.state.widget_info.filter_code
                            : ''
                    }
                })
            ]);
            this.props.removeActiveScreenWidgetsDetails(widget_id);
            this.onResponseSaveScreenWidget(widgetOverviewResp);
        } catch (err) {
            this.setState({
                notificationOpen: true,
                notification: {
                    message: 'Failed to save Widget data!',
                    severity: 'error'
                }
            });
            parent_obj.hideLoadingSave();
        }
    };

    // onClickSaveWidgetConfig = () => {
    //   const { app_info, screen_id, widget_id, parent_obj } = this.props;

    //   parent_obj.showLoadingSave();

    //   saveScreenWidgetConfig({
    //     app_id: app_info.id,
    //     screen_id: screen_id,
    //     widget_id: widget_id,
    //     payload: {
    //       config: this.state.widget_info.config
    //     },
    //     callback: this.onResponseSaveScreenWidget
    //   });
    // }

    // onClickSaveWidgetUIAC = () => {
    //   const { app_info, screen_id, widget_id, parent_obj } = this.props;
    //   this.props.setUnsavedValue("widget_uiac", false)

    //   parent_obj.showLoadingSave();

    //   saveScreenWidgetUIAC({
    //     app_id: app_info.id,
    //     screen_id: screen_id,
    //     widget_id: widget_id,
    //     payload: {
    //       code: this.state.widget_info.code ? this.state.widget_info.code : ""
    //     },
    //     callback: this.onResponseSaveScreenWidget
    //   });
    // }

    onResponseSaveScreenWidget = (response_data) => {
        const { parent_obj, widget_id } = this.props;
        // uiac api response data
        const uiac_response = response_data[1];
        if (uiac_response.status == 'failed') {
            this.setState({
                dialogOpen: true,
                uiacError: uiac_response
            });
        } else if (uiac_response.status == 'rejected') {
            this.setState({
                notificationOpen: true,
                notification: {
                    message: 'Failed to save widget!',
                    severity: 'error'
                }
            });
        } else if (uiac_response.value?.status == 'failed') {
            this.setState({
                notificationOpen: true,
                notification: {
                    message: uiac_response.value?.errors[0].message || 'Failed to save widget',
                    severity: 'error'
                }
            });
        } else {
            this.props.setUnsavedValue('widget', { [widget_id]: false });
            // emit_change_codx_collab(this.getKey(), {
            //   widget_info: this.state.widget_info,
            //   unsaved: false
            // })
            this.setState({
                notificationOpen: true,
                notification: {
                    message: 'Widget settings saved successfully!'
                }
            });
        }
        parent_obj.hideLoadingSave();
    };

    handleStepClick = (active_step) => {
        const { parent_obj } = this.props;

        this.setState({
            activeStep: active_step
        });

        if (active_step === 1) {
            parent_obj.showScreenWidgetCodeComponents('VISUAL');
        } else if (active_step === 2) {
            parent_obj.showScreenWidgetCodeComponents('WIDGETS');
        } else {
            parent_obj.showScreenWidgetCodeComponents(false);
        }
    };

    onFieldChange = (field_id, field_value) => {
        this.setState({
            [field_id]: field_value
        });
    };

    // onResponseConnSystemsData = (response_data) => {
    //     this.setState({
    //         conn_systems_data: response_data,
    //         selected_conn_systems_values: response_data['widget_conn_system_identifiers'],
    //         max_id: response_data['max_id']
    //     });
    // };

    // onResponseConnSystemsSaveWidget = (response_data) => {
    //     const { widget_id } = this.props;
    //     if (response_data?.error) {
    //         this.setState({
    //             notificationOpen: true,
    //             notification: {
    //                 message: response_data.error,
    //                 severity: 'error'
    //             }
    //         });
    //     } else {
    //         this.setState({
    //             notificationOpen: true,
    //             notification: {
    //                 message: 'Widget settings saved successfully !'
    //             },
    //             editConnSystemsKpis: false
    //         });
    //         this.props.setUnsavedValue('widget', { [widget_id]: false });
    //     }
    //     this.props.parent_obj.hideLoadingSave();
    // };

    findLinkedIds = (obj, id, target) => {
        let result = [];
        for (let index in obj) {
            if (obj[index][id] == target) {
                result.push(obj[index]);
            }
        }
        return result;
    };

    onAddRow = () => {
        const { widget_id } = this.props;
        this.props.setUnsavedValue('widget', { [widget_id]: true });
        let conn_system_data = this.state.conn_systems_data;
        let selected_values = [...this.state.selected_conn_systems_values];
        let newRow = {};
        if (conn_system_data?.['dashboards'].length > 0) {
            newRow['dashboard_id'] = null;
            newRow['business_process_id'] = null;
            newRow['problem_definition_id'] = null;
            newRow['app_id'] = this.props.app_info.id;
            newRow['widget_id'] = this.state.widget_info?.id;
            newRow['id'] = this.state.max_id + 1;
        }
        selected_values.push(newRow);
        this.setState({
            selected_conn_systems_values: selected_values,
            max_id: this.state.max_id + 1
        });
    };

    getIdNames = (obj, val, type) => {
        switch (type) {
            case 'get_name':
                for (let index in obj) {
                    if (obj[index]['id'] == val) {
                        return obj[index].name;
                    }
                }
                break;
            case 'get_id':
                for (let index in obj) {
                    if (obj[index]['name'] == val) {
                        return obj[index].id;
                    }
                }
                break;
        }
    };

    // onHandleDropDownChange = (id, type, value) => {
    //     const { widget_id } = this.props;
    //     this.props.setUnsavedValue('widget', { [widget_id]: true });
    //     let selected_values = [...this.state.selected_conn_systems_values];
    //     const get_index = (obj, search_id) => {
    //         for (let index in obj) {
    //             if (obj[index]['id'] == search_id) {
    //                 return index;
    //             }
    //         }
    //     };
    //     let ind = get_index(selected_values, id);
    //     switch (type) {
    //         case 'dashboard':
    //             selected_values[ind].dashboard_id = this.getIdNames(
    //                 this.state.conn_systems_data['dashboards'],
    //                 value,
    //                 'get_id'
    //             );
    //             break;
    //         case 'process':
    //             selected_values[ind].business_process_id = this.getIdNames(
    //                 this.state.conn_systems_data['process'],
    //                 value,
    //                 'get_id'
    //             );
    //             break;
    //         case 'problem_definition':
    //             selected_values[ind].problem_definition_id = this.getIdNames(
    //                 this.state.conn_systems_data['problem_definitions'],
    //                 value,
    //                 'get_id'
    //             );
    //             break;
    //     }
    //     this.setState({
    //         selected_conn_systems_values: selected_values,
    //         editConnSystemsKpis: true
    //     });
    // };

    // onDeleteRow = (id) => {
    //     const { widget_id } = this.props;
    //     this.props.setUnsavedValue('widget', { [widget_id]: true });
    //     let selected_values = [...this.state.selected_conn_systems_values];
    //     this.setState({
    //         deleted_values: [...this.state.deleted_values, id],
    //         editConnSystemsKpis: true
    //     });
    //     for (let index in selected_values) {
    //         if (selected_values[index].id == id) {
    //             selected_values.splice(index, 1);
    //             this.setState({
    //                 selected_conn_systems_values: selected_values
    //             });
    //             return;
    //         }
    //     }
    // };

    // connSystemsSaveWidget = () => {
    //     this.props.parent_obj.showLoadingSave();
    //     if (this.state.deleted_values.length > 0) {
    //         this.state.deleted_values.forEach((id) => {
    //             deleteWidgetConnSystemsIdentifier({
    //                 payload: { id: id },
    //                 callback: this.onResponseConnSystemsSaveWidget
    //             });
    //         });
    //     }
    //     try {
    //         updateWidgetConnSystemsIdentifier({
    //             app_id: this.props.app_info.id,
    //             widget_id: this.state.widget_info?.id,
    //             payload: this.state.selected_conn_systems_values,
    //             callback: this.onResponseConnSystemsSaveWidget
    //         });
    //     } catch (error) {
    //         this.props.parent_obj.hideLoadingSave();
    //     }
    //     this.setState({
    //         deleted_values: []
    //     });
    // };

    renderOverviewForm = () => {
        const { classes } = this.props;

        return (
            <div className={classes.renderOverviewFormRoot}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <FormControl fullWidth className={classes.widgetConfigFormControl2}>
                            <TextField
                                variant="filled"
                                classes={{
                                    root: classes.widgetConfigRoot
                                }}
                                InputLabelProps={{
                                    classes: {
                                        root: classes.widgetConfigLabel2
                                    }
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.widgetConfigInput
                                    }
                                }}
                                disabled={this.props.editDisabled || !this.props.editMode}
                                size="small"
                                fullWidth={true}
                                key={'title_for_widget'}
                                label="Title"
                                id={'title_for_widget'}
                                value={this.state.widget_info.config?.title || ''}
                                onChange={(event) =>
                                    this.onHandleFieldChange(null, event.target.value, {
                                        field_id: 'title'
                                    })
                                }
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth className={classes.widgetConfigFormControl2}>
                            <TextField
                                variant="filled"
                                classes={{
                                    root: classes.widgetConfigRoot
                                }}
                                InputLabelProps={{
                                    classes: {
                                        root: classes.widgetConfigLabel2
                                    }
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.widgetConfigInput
                                    }
                                }}
                                disabled={this.props.editDisabled || !this.props.editMode}
                                fullWidth={true}
                                key={'mfactor_for_widget'}
                                label="Metric Factor"
                                id={'mfactor_for_widget'}
                                value={this.state.widget_info.config?.metric_factor || ''}
                                onChange={(event) =>
                                    this.onHandleFieldChange(null, event.target.value, {
                                        field_id: 'metric_factor'
                                    })
                                }
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth className={classes.widgetConfigFormControl2}>
                            <TextField
                                variant="filled"
                                classes={{
                                    root: classes.widgetConfigRoot
                                }}
                                InputLabelProps={{
                                    classes: {
                                        root: classes.widgetConfigLabel2
                                    }
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.widgetConfigInput
                                    }
                                }}
                                disabled={this.props.editDisabled || !this.props.editMode}
                                fullWidth={true}
                                key={'subtitle_for_widget'}
                                label="Sub Title"
                                id={'subtitle_for_widget'}
                                value={this.state.widget_info.config?.sub_title || ''}
                                onChange={(event) =>
                                    this.onHandleFieldChange(null, event.target.value, {
                                        field_id: 'sub_title'
                                    })
                                }
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth className={classes.widgetConfigFormControl2}>
                            <TextField
                                variant="filled"
                                classes={{
                                    root: classes.widgetConfigRoot
                                }}
                                InputLabelProps={{
                                    classes: {
                                        root: classes.widgetConfigLabel2
                                    }
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.widgetConfigInput
                                    }
                                }}
                                disabled={this.props.editDisabled || !this.props.editMode}
                                fullWidth={true}
                                key={'prefix_for_widget'}
                                label="Prefix"
                                id={'prefix_for_widget'}
                                value={this.state.widget_info.config?.prefix || ''}
                                onChange={(event) =>
                                    this.onHandleFieldChange(null, event.target.value, {
                                        field_id: 'prefix'
                                    })
                                }
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={8}>
                        <FormControl fullWidth className={classes.widgetConfigFormControl2}>
                            <TextField
                                variant="filled"
                                classes={{
                                    root: classes.widgetConfigRoot
                                }}
                                InputLabelProps={{
                                    classes: {
                                        root: classes.widgetConfigLabel2
                                    }
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.widgetConfigInput
                                    }
                                }}
                                disabled={this.props.editDisabled || !this.props.editMode}
                                fullWidth={true}
                                key={'icon_for_widget'}
                                label="Icon URL"
                                id={'icon_for_widget'}
                                value={this.state.widget_info.config?.icon || ''}
                                onChange={(event) =>
                                    this.onHandleFieldChange(null, event.target.value, {
                                        field_id: 'icon'
                                    })
                                }
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4} className={classes.iconPositionWrapper}>
                        <FormControl
                            fullWidth
                            className={clsx(
                                classes.widgetConfigFormControl2,
                                classes.widgetConfigSelect
                            )}
                            disabled={
                                this.props.editDisabled ||
                                !this.props.editMode ||
                                !this.state.widget_info.config?.icon
                            }
                        >
                            <InputLabel
                                id="icon-position"
                                className={classes.widgetConfigCheckboxLabel}
                            >
                                Icon Position
                            </InputLabel>
                            <Select
                                classes={{
                                    icon: classes.widgetConfigIcon,
                                    select: classes.widgetConfigInput
                                }}
                                labelId="icon-position"
                                id="icon-position"
                                value={
                                    this.state.widget_info.config?.iconPosition
                                        ? this.state.widget_info.config?.iconPosition
                                        : 'top-left'
                                }
                                label="Icon Position"
                                onChange={(event) =>
                                    this.onHandleFieldChange(null, event.target.value, {
                                        field_id: 'iconPosition'
                                    })
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
                                {this.iconPositionsList.length > 0 &&
                                    this.iconPositionsList.map((pos) => (
                                        <MenuItem key={pos.value} value={pos.value}>
                                            <Typography
                                                className={clsx(classes.f1, classes.defaultColor)}
                                                variant="h5"
                                            >
                                                {pos.label}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        {/* <Typography className={classes.widgetConfigCheckboxLabel} variant="h5">{"Donot override styles"}</Typography>
              {this.state.widget_info?.color_nooverride ? (
                <CheckBox className={classes.widgetConfigCheckbox} fontSize="large" onClick={() => this.onHandleFieldChange(null, false, {field_id: 'color_nooverride'})}/>
              ) : (
                <CheckBoxOutlineBlank className={classes.widgetConfigCheckbox} fontSize="large" onClick={() => this.onHandleFieldChange(null, true, {field_id: 'color_nooverride'})}/>
              )} */}

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!this.state.widget_info?.config?.color_nooverride}
                                    onChange={(e, v) =>
                                        this.onHandleFieldChange(null, v, {
                                            field_id: 'color_nooverride'
                                        })
                                    }
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            disabled={this.props.editDisabled || !this.props.editMode}
                            className={`${classes.inputCheckbox} ${classes.customInputCheckbox}`}
                            label="Donot override styles"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        {/* <Typography className={classes.widgetConfigCheckboxLabel} variant="h5">{"Donot override styles"}</Typography>
              {this.state.widget_info?.color_nooverride ? (
                <CheckBox className={classes.widgetConfigCheckbox} fontSize="large" onClick={() => this.onHandleFieldChange(null, false, {field_id: 'color_nooverride'})}/>
              ) : (
                <CheckBoxOutlineBlank className={classes.widgetConfigCheckbox} fontSize="large" onClick={() => this.onHandleFieldChange(null, true, {field_id: 'color_nooverride'})}/>
              )} */}

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.download_enable}
                                    onChange={(e, v) =>
                                        this.onHandleFieldChange(null, v, {
                                            field_id: 'download_enable'
                                        })
                                    }
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            disabled={this.props.editDisabled || !this.props.editMode}
                            className={`${classes.inputCheckbox} ${classes.customInputCheckbox}`}
                            label="Add download button for this widget"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!this.state.widget_info?.config?.size_nooverride}
                                    onChange={(e, v) =>
                                        this.onHandleFieldChange(null, v, {
                                            field_id: 'size_nooverride'
                                        })
                                    }
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            disabled={this.props.editDisabled || !this.props.editMode}
                            className={classes.inputCheckbox}
                            label="Donot override size"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!this.state.widget_info?.config?.title_caseNoOverride}
                                    onChange={(_, v) =>
                                        this.onHandleFieldChange(null, v, {
                                            field_id: 'title_caseNoOverride'
                                        })
                                    }
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            disabled={this.props.editDisabled || !this.props.editMode}
                            className={classes.inputCheckbox}
                            label="Donot override title casing"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.is_powerbi}
                                    onChange={(e, v) =>
                                        this.onHandleFieldChange(null, v, {
                                            field_id: 'is_powerbi'
                                        })
                                    }
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            disabled={this.props.editDisabled || !this.props.editMode}
                            className={classes.inputCheckbox}
                            label="Is PowerBI"
                        />
                    </Grid>
                    <Grid item xs={6}>
    {!(
        (import.meta.env['REACT_APP_ENV'] === 'uat' ||
         import.meta.env['REACT_APP_ENV'] === 'prod') &&
        location.pathname.startsWith('/projects')
    ) && (
        <FormControlLabel
            control={
                <Checkbox
                    checked={this.state.is_tableau}
                    onChange={(e, v) =>
                        this.onHandleFieldChange(null, v, {
                            field_id: 'is_tableau',
                        })
                    }
                    name="checkedB"
                    color="primary"
                />
            }
            disabled={this.props.editDisabled || !this.props.editMode}
            className={classes.inputCheckbox}
            label="Is Tableau"
        />
    )}
</Grid>

                    {this.state.widget_info?.is_label && (
                        <Grid item xs={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={
                                            !!this.state.widget_info?.config?.content_caseNoOverride
                                        }
                                        onChange={(_, v) =>
                                            this.onHandleFieldChange(null, v, {
                                                field_id: 'content_caseNoOverride'
                                            })
                                        }
                                        name="checkedB"
                                        color="primary"
                                    />
                                }
                                disabled={this.props.editDisabled || !this.props.editMode}
                                className={classes.inputCheckbox}
                                label="Donot override KPI content text casing"
                            />
                        </Grid>
                    )}
                    {/* <Grid item xs={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!this.state.widget_info?.config?.download_enable_all}
                                    onChange={(e, v) =>
                                        this.onHandleFieldChange(null, v, {
                                            field_id: 'download_enable_all'
                                        })
                                    }
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            disabled={this.props.editDisabled || !this.props.editMode}
                            className={classes.inputCheckbox}
                            label="Add download button for all widgets"
                        />
                    </Grid> */}
                </Grid>
            </div>
        );
    };

    render() {
        const { classes, widget_id, unsavedValues, nac_collaboration } = this.props;
        const unsaved = unsavedValues?.widget?.[widget_id];

        var tabs = [<Tab key="tabs" label="Overview" />];

        if (this.state.is_powerbi) {
            tabs.push(<Tab label="PowerBI Configuration" />);
        }
        else if (this.state.is_tableau) {
            tabs.push(<Tab label="Tableau Configuration" />);
        }

        else {
            tabs.push(<Tab label="Visualization UIaC" />);
        }

        if (!this.state.widget_info.is_label){
            tabs.push(<Tab key="widget-filters" label="Widget Filter" />);

        }


        // {import.meta.env['REACT_APP_ENV'] != 'prod' &&
        //     this.state.widget_info?.is_label &&
        //     this.props.app_info?.is_connected_systems_app && (
        //         <Tab label="Link KPI" />
        //     )}

        var tab_content = '';

        if (this.state.activeStep === 0) {
            tab_content = <div>{this.renderOverviewForm()}</div>;
        } else if (this.state.activeStep === 1) {
            if (this.state.is_powerbi) {
                tab_content = (
                    <div>
                        <AppAdminPowerBIConfig
                            classes={classes}
                            widget_info={this.state.widget_info}
                            editMode={this.props.editMode}
                            editDisabled={this.props.editDisabled}
                            onHandleFieldChange={this.onHandleFieldChange}
                        />
                    </div>
                );
            }
            else if(this.state.is_tableau){
                tab_content = (
                    <div>
                        <AppAdminTableauConfig
                            classes={classes}
                            widget_info={this.state.widget_info}
                            editMode={this.props.editMode}
                            editDisabled={this.props.editDisabled}
                            onHandleFieldChange={this.onHandleFieldChange}
                        />
                    </div>
                );
            }
            else {
                tab_content = (
                    <div>
                        <AppAdminCodeEditor
                            code={
                                this.state.widget_info && this.state.widget_info['code']
                                    ? this.state.widget_info['code']
                                    : ''
                            }
                            onChangeCodeCallback={this.debouncedOnChangeVisualizationCode}
                            output={decodeHtmlEntities(this.state.viz_response_output)}
                            timetaken={this.state.viz_response_timetaken}
                            size={this.state.viz_response_size}
                            logs={this.state.viz_response_logs}
                            readOnly={this.props.editDisabled || !this.props.editMode}
                            extraClasses={{
                                editorSection: classes.editorSectionShort,
                                outputSection: classes.outputSection
                            }}
                        />
                    </div>
                );
            }
        } else if (this.state.activeStep === 2) {
            tab_content = (
                <div>
                    <AppAdminCodeEditor
                        code={
                            this.state.widget_info['filter_code']
                                ? this.state.widget_info['filter_code']
                                : ''
                        }
                        onChangeCodeCallback={this.debouncedOnChangeFilterCode}
                        output={decodeHtmlEntities(this.state.widget_filter_output)}
                        timetaken={this.state.widget_filter_response_timetaken}
                        size={this.state.widget_filter_response_size}
                        logs={this.state.widget_filter_response_logs}
                        readOnly={this.state.editDisabled || !this.props.editMode}
                        extraClasses={{
                            editorSection: classes.editorSectionShort,
                            outputSection: classes.outputSection
                        }}
                    />
                </div>
            );
        }
        // tab_content = <div>
        //     <Button
        //         key="screens-toolbar"
        //         size="small"
        //         variant="outlined"
        //         style={{ marginTop: '2rem' }}
        //         onClick={() => this.onAddRow()}
        //         aria-label="Add Row"
        //     >
        //         <AddIcon className={classes.icons} />
        //         <span style={{ paddingLeft: '1rem' }}>Add Row</span>
        //     </Button>
        //     {this.state.selected_conn_systems_values.map((value, key) => (
        //         <Grid
        //             container
        //             key={key}
        //             direction="row"
        //             spacing={2}
        //             className={clsx(classes.linkKpiStyle)}
        //         >
        //             <Grid item xs={3}>
        //                 <FormControl
        //                     fullWidth
        //                     className={clsx(
        //                         classes.widgetConfigFormControl,
        //                         classes.widgetConfigSelect
        //                     )}
        //                 >
        //                     <InputLabel
        //                         id="dashboard"
        //                         className={classes.widgetConfigCheckboxLabel}
        //                     >
        //                         Dashboard
        //                     </InputLabel>
        //                     <Select
        //                         classes={{
        //                             icon: classes.widgetConfigIcon
        //                         }}
        //                         labelId="dashboard"
        //                         id="dashboard"
        //                         value={
        //                             value['dashboard_id']
        //                                 ? this.getIdNames(
        //                                     this.state.conn_systems_data[
        //                                         'dashboards'
        //                                     ],
        //                                     value['dashboard_id'],
        //                                     'get_name'
        //                                 )
        //                                 : ''
        //                         }
        //                         onChange={(event) =>
        //                             this.onHandleDropDownChange(
        //                                 value.id,
        //                                 'dashboard',
        //                                 event.target.value
        //                             )
        //                         }
        //                     >
        //                         {this.state.conn_systems_data?.dashboards &&
        //                             this.state.conn_systems_data['dashboards'].map(
        //                                 (val, key) => (
        //                                     <MenuItem key={key} value={val.name}>
        //                                         {' '}
        //                                         <Typography
        //                                             className={clsx(
        //                                                 classes.f1,
        //                                                 classes.defaultColor
        //                                             )}
        //                                             variant="h5"
        //                                         >
        //                                             {val.name}
        //                                         </Typography>
        //                                     </MenuItem>
        //                                 )
        //                             )}
        //                     </Select>
        //                 </FormControl>
        //             </Grid>
        //             <Grid item xs={4}>
        //                 <FormControl
        //                     fullWidth
        //                     className={clsx(
        //                         classes.widgetConfigFormControl,
        //                         classes.widgetConfigSelect
        //                     )}
        //                 >
        //                     <InputLabel
        //                         id="process"
        //                         className={classes.widgetConfigCheckboxLabel}
        //                     >
        //                         Process
        //                     </InputLabel>
        //                     <Select
        //                         classes={{
        //                             icon: classes.widgetConfigIcon
        //                         }}
        //                         labelId="process"
        //                         id="process"
        //                         value={
        //                             value['business_process_id']
        //                                 ? this.getIdNames(
        //                                     this.state.conn_systems_data[
        //                                         'process'
        //                                     ],
        //                                     value['business_process_id'],
        //                                     'get_name'
        //                                 )
        //                                 : ''
        //                         }
        //                         label="Select process"
        //                         onChange={(event) =>
        //                             this.onHandleDropDownChange(
        //                                 value.id,
        //                                 'process',
        //                                 event.target.value
        //                             )
        //                         }
        //                     >
        //                         {this.state.conn_systems_data?.process &&
        //                             this.findLinkedIds(
        //                                 this.state.conn_systems_data['process'],
        //                                 'dashboard_id',
        //                                 value['dashboard_id']
        //                             ).map((val, key) => (
        //                                 <MenuItem key={key} value={val.name}>
        //                                     <Typography
        //                                         className={clsx(
        //                                             classes.f1,
        //                                             classes.defaultColor
        //                                         )}
        //                                         variant="h5"
        //                                     >
        //                                         {val.name}
        //                                     </Typography>
        //                                 </MenuItem>
        //                             ))}
        //                     </Select>
        //                 </FormControl>
        //             </Grid>
        //             <Grid item xs={4}>
        //                 <FormControl
        //                     fullWidth
        //                     className={clsx(
        //                         classes.widgetConfigFormControl,
        //                         classes.widgetConfigSelect
        //                     )}
        //                 >
        //                     <InputLabel
        //                         id="problem_definition"
        //                         className={classes.widgetConfigCheckboxLabel}
        //                     >
        //                         Problem Definition
        //                     </InputLabel>
        //                     <Select
        //                         classes={{
        //                             icon: classes.widgetConfigIcon
        //                         }}
        //                         labelId="problem_definition"
        //                         id="problem_definition"
        //                         value={
        //                             value['problem_definition_id']
        //                                 ? this.getIdNames(
        //                                     this.state.conn_systems_data[
        //                                         'problem_definitions'
        //                                     ],
        //                                     value['problem_definition_id'],
        //                                     'get_name'
        //                                 )
        //                                 : ''
        //                         }
        //                         label="Select problem"
        //                         onChange={(event) =>
        //                             this.onHandleDropDownChange(
        //                                 value.id,
        //                                 'problem_definition',
        //                                 event.target.value
        //                             )
        //                         }
        //                     >
        //                         {this.state.conn_systems_data?.process &&
        //                             this.findLinkedIds(
        //                                 this.state.conn_systems_data[
        //                                     'problem_definitions'
        //                                 ],
        //                                 'business_process_id',
        //                                 value['business_process_id']
        //                             ).map((val, key) => (
        //                                 <MenuItem key={key} value={val.name}>
        //                                     <Typography
        //                                         className={clsx(
        //                                             classes.f1,
        //                                             classes.defaultColor
        //                                         )}
        //                                         variant="h5"
        //                                     >
        //                                         {val.name}
        //                                     </Typography>
        //                                 </MenuItem>
        //                             ))}
        //                     </Select>
        //                 </FormControl>
        //             </Grid>
        //             <Grid item xs={1}>
        //                 {' '}
        //                 <DeleteIcon
        //                     onClick={() => this.onDeleteRow(value.id)}
        //                     style={{
        //                         fontSize: '4.5rem',
        //                         cursor: 'pointer',
        //                         paddingTop: '1.5rem',
        //                         opacity: 0.75
        //                     }}
        //                 />
        //             </Grid>
        //         </Grid>
        //     ))}
        // </div>;
        else if (this.state.activeStep === 3) {
            tab_content = '';
        }

        return (
            <div>
                <CodxCollabWork
                    room={`${this.props.app_info.id}#nac_widget_info#${this.props.screen_id}#${this.props.widget_id}`}
                    state={{ widget_info: this.state.widget_info ,download_enable:this.state.download_enable,is_powerbi:this.state.is_powerbi}}
                    onStateChange={(state) => this.setState(state)}
                    currentUserAvatarProps={{
                        max: 1,
                        orientation: 'top-right',
                        enableTeamsCollaboration: true,
                        teamsTopicName: `NAC: ${this.props.app_info.name} | Screen: ${
                            this.props.screen_name
                        } | Tab: Widget | ${this.state.widget_info?.config?.title || ''}`,
                        teamsMessage: 'Hi!'
                    }}
                    disabled={!this.props.editMode || !nac_collaboration}
                />
                <Typography variant="h4" className={classes.sectionEditorHeading}>
                    Setup Widget
                </Typography>
                <div>
                    <Tabs
                        value={this.state.activeStep}
                        onChange={(e, v) => this.handleStepClick(v)}
                        aria-label="ant example"
                        className={classes.subSectionsTabs}
                    >
                        {tabs}
                    </Tabs>
                    {tab_content}
                    <div className={classes.layoutQuestionToolbar}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={
                                this.state.activeStep == 3
                                    ? this.connSystemsSaveWidget
                                    : this.onClickSaveWidget
                            }
                            disabled={
                                this.props.editDisabled || this.state.activeStep == 3
                                    ? this.state.editConnSystemsKpis
                                        ? false
                                        : true
                                    : !unsaved ||
                                      this.props.loading_save ||
                                      !this.props.editMode ||
                                      (this.state.activeStep === 0
                                          ? this.state.editOverview
                                              ? false
                                              : true
                                          : this.state.widget_info.code
                                          ? false
                                          : true)
                            }
                            aria-label="SAVE WIDGET"
                        >
                            Save Widget
                        </Button>
                        {this.state.activeStep == 1 && !this.state.is_powerbi && !this.state.is_tableau && (
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={this.onClickVisualizationTest}
                                disabled={
                                    this.state.widget_info.code ? this.state.loading_test : true
                                }
                                startIcon={
                                    this.state.loading_test ? (
                                        <div style={{ position: 'relative', width: '2rem' }}>
                                            <CodxCircularLoader size={30} center />
                                        </div>
                                    ) : null
                                }
                                aria-label="TEST WIDGET"
                            >
                                Test Widget
                            </Button>
                        )}
                        {/* {this.state.activeStep == 1 && !this.state.is_tableau && (
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={this.onClickVisualizationTest}
                                disabled={
                                    this.state.widget_info.code ? this.state.loading_test : true
                                }
                                startIcon={
                                    this.state.loading_test ? (
                                        <div style={{ position: 'relative', width: '2rem' }}>
                                            <CodxCircularLoader size={30} center />
                                        </div>
                                    ) : null
                                }
                                aria-label="TEST WIDGET"
                            >
                                Test Widget
                            </Button>
                        )} */}
                        {this.state.activeStep == 2 && (
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={this.onClickFilterTest}
                                disabled={
                                    this.state.widget_info.code ? this.state.loading_test : true
                                }
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
                        )}
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

                {this.state.uiacError && (
                    <Dialog
                        open={this.state.dialogOpen}
                        fullWidth
                        maxWidth={'md'}
                        aria-labelledby="validation failed"
                        aria-describedby="error content"
                    >
                        <DialogTitle id="validation failed">{'Validation Failed'}</DialogTitle>

                        <DialogContent className={classes.dialogContent} id="error content">
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
            </div>
        );
    }
}

AppScreenWidgetEditor.propTypes = {
    classes: PropTypes.object.isRequired,
    app_info: PropTypes.object.isRequired,
    widget_info: PropTypes.object.isRequired
};

const mapStateToProps = () => {};

const mapDispatchToProps = (dispatch) => {
    return {
        removeActiveScreenWidgetsDetails: (widgetId) =>
            dispatch(removeActiveScreenWidgetsDetails(widgetId))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    withStyles(
        (theme) => ({
            ...customFormStyle(theme),
            ...appScreenWidgetEditorStyle(theme)
        }),
        { withTheme: true }
    )(AppScreenWidgetEditor)
);
