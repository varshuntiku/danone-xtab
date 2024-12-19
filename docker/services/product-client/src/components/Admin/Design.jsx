import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
// import { getRoute } from "utils.js";

import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, Card, CardContent, Typography, Box } from '@material-ui/core';
import { Accordion, AccordionSummary, AccordionDetails, LinearProgress } from '@material-ui/core';
import { Popover, MenuItem, Snackbar } from '@material-ui/core';
// import Accordion from "components/Accordion/Accordion.jsx";
// import Card from "components/Card/Card.jsx";
// import CardBody from "components/Card/CardBody.jsx";
// import Button from "@material-ui/core/Button";
// import SweetAlert from "react-bootstrap-sweetalert";

import Autosuggest from 'react-autosuggest';

import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '../../assets/Icons/CloseBtn';
import RefreshIcon from '@material-ui/icons/Refresh';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
// import SettingsIcon from '@material-ui/icons/Settings';
// import DescriptionIcon from "@material-ui/icons/Description";
// import DeleteIcon from '@material-ui/icons/Delete';
import DeleteIcon from '../../assets/Icons/DeleteIcon';
import CloneIcon from '../../assets/Icons/CloneIcon';
import CodeIcon from '@material-ui/icons/Code';
// import EqualizerIcon from "@material-ui/icons/Equalizer";
// import ListIcon from "@material-ui/icons/List";
// import AttachFileIcon from "@material-ui/icons/AttachFile";
// import CommentIcon from "@material-ui/icons/Comment";
// import GetAppIcon from "@material-ui/icons/GetApp";

// import FormControl from "@material-ui/core/FormControl";
// import InputLabel from "@material-ui/core/InputLabel";
import CustomTextField from 'components/Forms/CustomTextField.jsx';
import clsx from 'clsx';
// import CustomInput from "components/CustomInput/CustomInput.jsx";
// import Select from "@material-ui/core/Select";
// import MenuItem from "@material-ui/core/MenuItem";
// import ListSubHeader from "@material-ui/core/ListSubheader";
// import AddAlert from "@material-ui/icons/AddAlert";
import {
    MoreHoriz,
    ExpandMore,
    NotificationsActive,
    NotificationImportant,
    CheckBox,
    CheckBoxOutlineBlank,
    SearchOutlined
} from '@material-ui/icons';
import { ZoomIn, ZoomOut, ZoomOutMap, CallToAction } from '@material-ui/icons';
// import Icon from "@material-ui/core/Icon";

import * as SRD from 'storm-react-diagrams';
import Editor from '@monaco-editor/react';

// import the custom models
import { DesignNodeModel } from 'components/DesignWidget/DesignNodeModel.js';
import { DesignNodeFactory } from 'components/DesignWidget/DesignNodeFactory.jsx';

//Codex components
// import CodexDataProvider, { CODEX_API_GET, CODEX_API_ACTION } from "views/CRUD/CodexDataProvider.jsx";
// import ProjectNotebooks from "views/Blueprints/ProjectNotebooks.jsx";
// import PopupForm from 'components/screenActionsComponent/actionComponents/PopupForm.jsx';
// import DesignProjectMenuItem from 'components/Admin/DesignProjectMenuItem.jsx';
import DraggableItemTypes from 'components/DesignWidget/DraggableItemTypes.js';
import DraggableChip from 'components/DesignWidget/DraggableChip.jsx';
import DesignDroppable from 'components/DesignWidget/DesignDroppable.jsx';
import DesignModules from 'components/DesignWidget/DesignModules.jsx';
import WidgetComponents from 'components/DesignWidget/WidgetComponents.jsx';
import BlueprintWidgetOutputs from 'components/Admin/BlueprintWidgetOutputs.jsx';
import BlueprintWidgetInputs from 'components/Admin/BlueprintWidgetInputs.jsx';
// import Attachments from "views/Blueprints/Attachments.jsx";
// import WidgetAttachments from "views/Widgets/Attachments.jsx";
// import ProjectComments from "views/Blueprints/ProjectComments.jsx";
// import WidgetArtifactsView from "views/Blueprints/WidgetArtifactsView.jsx";
import WidgetCode from 'components/DesignWidget/WidgetCode.jsx';
// import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

// import buttonStyle from "assets/jss/material-dashboard-pro-react/components/buttonStyle.jsx";
// import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import autosuggestReactStyle from 'assets/jss/autosuggestReactStyle.jsx';
// import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";
// import projectStyle from "assets/jss/projectStyle.jsx";
// import statusIconStyle from "assets/jss/statusIconStyle.jsx";
// import breadcrumbStyle from "assets/jss/breadcrumbStyle.jsx";

import designStyle from 'assets/jss/designStyle.jsx';

import { fetch_socket_connection } from 'util/initiate_socket';

import {
    /*getAjaxProjects,*/
    getDesignData,
    getWidgetData,
    getArtifactsData,
    downloadBlueprintCode,
    createProject,
    saveProjectBlueprint
} from 'services/admin.js';
import {
    /*getWidgetDefaultCode, */ getNotebookDesign,
    saveNotebookDesign,
    executeBlueprint,
    executeBlueprintWidget,
    getBlueprintExecutionStatus
} from 'services/admin_execution.js';
import { connect } from 'react-redux';
import { getMatomoPvid } from 'store/index';
import { logMatomoEvent } from '../../services/matomo';

import 'storm-react-diagrams/dist/style.min.css';

import * as _ from 'underscore';

class Design extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        // this.user_info = JSON.parse(sessionStorage.getItem('user_info'));

        this.engine = new SRD.DiagramEngine({
            registerDefaultDeleteItemsAction: false
        });
        this.engine.installDefaultFactories();

        // register some other factories as well
        this.engine.registerNodeFactory(
            new DesignNodeFactory({
                notebook_id:
                    props.match && props.match.params.notebook_id
                        ? props.match.params.notebook_id
                        : false,
                iteration_id:
                    props.match && props.match.params.iteration_id
                        ? props.match.params.iteration_id
                        : false,
                design_obj: this
            })
        );

        this.model = new SRD.DiagramModel();
        this.model.setGridSize(25);
        this.setupListeners();
        this.engine.setDiagramModel(this.model);

        // var project_id = false;
        // var parent_project_id = false;
        // if (props.match.params.project_id) {
        //   if (props.match.params.case_study_id) {
        //     project_id = props.match.params.case_study_id;
        //     parent_project_id = props.match.params.project_id;
        //   } else {
        //     project_id = props.match.params.project_id;
        //   }
        // }

        var project_id = false;

        if (props.app_info && props.app_info.blueprint_link) {
            if (props.app_info.blueprint_link.indexOf('case-studies') === -1) {
                project_id = props.app_info.blueprint_link
                    .replace('/projects/', '')
                    .replace('/design', '');
            } else {
                var details = props.app_info.blueprint_link.split('/case-studies/');
                project_id = details[1].replace('/design', '');
            }
        }

        this.state = {
            show_setup: !project_id,
            project_id: project_id,
            notebook_id:
                props.match && props.match.params.notebook_id
                    ? props.match.params.notebook_id
                    : false,
            iteration_id:
                props.match && props.match.params.iteration_id
                    ? props.match.params.iteration_id
                    : false,
            // parent_project_id: parent_project_id,
            // project_name: false,
            // assignees: false,
            // reviewer: false,
            // is_instance: false,
            loading: false,
            loading_blueprint: false,
            loading_artifacts: false,
            loading_widgets: false,
            loading_nodecode: false,
            item_selected: false,
            show_outputs: false,
            show_inputs: false,
            blueprint_actions_menu_anchorEl: false,
            blueprint_actions_menu_open: false,
            show_design_modules: false,
            show_widgets: false,
            show_saved_notification: false,
            show_download_notification: false,
            show_download_error_notification: false,
            show_unsaved_changes: false,
            // saving: false,
            // design_metadata: false,
            // item_in_edit: false,
            // item_comment_count: 0,
            artifact_data: {},
            casestudy_count: 0,
            comment_count: 0,
            // item_in_results: false,
            // notebooks: false,
            // attachments: false,
            comments_data: [],
            // clone_enabled: false,
            // //Widget autocomplete
            widget_groups: false,
            widgets: false,
            widget_autocomplete_value: '',
            widget_autocomplete_options: [],
            status_data: false
        };
        this.socket = fetch_socket_connection();
    }

    componentDidMount() {
        if (this.state.project_id) {
            this.refreshData();
        }
        logMatomoEvent({
            action_name: 'Blueprint',
            url: window.location.href,
            urlref: window.location.href,
            pv_id: this.props.matomo.pv_id
        });
    }

    //Loading Helpers
    refreshData = () => {
        this.setState({
            loading: true
        });

        this.getWidgetDetails();
        this.getBlueprintDetails();
        this.getArtifactDetails();
    };

    finishLoading = () => {
        const { from_notebook, from_iteration } = this.props;

        if (
            !this.state.loading_widgets &&
            !this.state.loading_blueprint &&
            !this.state.loading_artifacts
        ) {
            this.setState({
                loading: false
            });

            if (from_notebook) {
                if (!this.socket['socket_platform']?.hasListeners('notebook_widget_status')) {
                    this.socket['socket_platform']?.on(
                        'notebook_widget_status',
                        this.onRefreshExecutionStatus
                    );
                }
            } else if (from_iteration) {
                if (!this.socket['socket_platform']?.hasListeners('iteration_widget_status')) {
                    this.socket['socket_platform']?.on(
                        'iteration_widget_status',
                        this.onRefreshExecutionStatus
                    );
                }
            }
        }
    };

    getBlueprintDetails = () => {
        const { from_notebook, from_iteration } = this.props;

        this.setState({
            loading_blueprint: true
        });

        if (from_notebook || from_iteration) {
            getNotebookDesign({
                iteration_id: this.state.iteration_id,
                notebook_id: this.state.notebook_id,
                callback: this.onResponseGetBlueprint
            });
        } else {
            getDesignData({
                project_id: this.state.project_id,
                callback: this.onResponseGetBlueprint
            });
        }
    };

    getWidgetDetails = () => {
        getWidgetData({
            callback: this.onResponseGetWidgets
        });
    };

    getArtifactDetails = () => {
        this.setState({
            loading_artifacts: true
        });

        getArtifactsData({
            project_id: this.state.project_id,
            callback: this.onResponseGetArtifacts
        });
    };

    errorLoading = () => {
        this.setState({
            error: true
        });
    };

    //Loading response helpers
    onResponseGetBlueprint = (response_data) => {
        if (response_data['status'] === 'error') {
            this.setState({
                loading_blueprint: false
            });

            this.errorLoading();

            return;
        }

        var design_data = response_data['data']['data'];

        this.setState({
            casestudy_count: response_data['data']['casestudy_count'],
            comment_count: response_data['data']['comment_count'],
            comments_data: response_data['data']['comments'],
            status_data: response_data['data']['logs']
        });

        if (design_data) {
            var temp_model = new SRD.DiagramModel();
            temp_model.deSerializeDiagram(design_data, this.engine);

            this.model = temp_model;
            this.model.setGridSize(25);
            this.model.clearListeners();
            this.setupListeners();
            this.setupExecutionStatus(response_data['data']['logs']);
            this.engine.setDiagramModel(this.model);
            this.engine.repaintCanvas();
        } else {
            this.setState({
                show_widgets: this.hasEditAccess()
            });
        }

        ReactDOM.flushSync(() => {
            this.setState({
                loading_blueprint: false
            });
        });

        this.finishLoading();
    };

    setupExecutionStatus = (logs) => {
        _.each(this.model.getNodes(), function (diagram_node) {
            if (logs && logs[diagram_node.id]) {
                diagram_node.execution_status = logs[diagram_node.id]['status'];
                diagram_node.execution_updated_at = logs[diagram_node.id]['updated_at'];
                diagram_node.execution_logs = logs[diagram_node.id]['logs'];
                diagram_node.execution_timetaken = logs[diagram_node.id]['timetaken'];
            } else {
                diagram_node.execution_status = false;
                diagram_node.execution_updated_at = false;
                diagram_node.execution_logs = false;
                diagram_node.execution_timetaken = false;
            }
        });
    };

    updateWidgetExecutionStatus = (logs) => {
        _.each(this.model.getNodes(), function (diagram_node) {
            if (logs && logs['widget_id'] === diagram_node.id) {
                diagram_node.execution_status = logs['status'];
                diagram_node.execution_updated_at = logs['updated_at'];
                diagram_node.execution_logs = logs['logs'];
                diagram_node.execution_timetaken = logs['timetaken'];
            }
        });
    };

    refreshExecutionStatus = (widget_id) => {
        getBlueprintExecutionStatus({
            widget_id: widget_id,
            notebook_id: this.state.notebook_id,
            callback: 'onRefreshExecutionStatus'
        });
    };

    onRefreshExecutionStatus = (response_data) => {
        var logs = this.state.status_data;
        logs[response_data['widget_id']] = {
            status: response_data['status'],
            updated_at: response_data['updated_at'],
            logs: response_data['logs'],
            timetaken: response_data['timetaken']
        };

        this.setState({
            status_data: logs
        });

        this.updateWidgetExecutionStatus(response_data);
        this.engine.repaintCanvas();
    };

    onResponseGetWidgets = (response_data) => {
        ReactDOM.flushSync(() => {
            this.setState({
                widget_groups: response_data['widget_groups'],
                widgets: response_data['widgets'],
                loading_widgets: false
            });
        });

        this.finishLoading();
    };

    onResponseGetArtifacts = (response_data) => {
        var artifact_data = response_data['data'];

        ReactDOM.flushSync(() => {
            this.setState({
                artifact_data: artifact_data,
                loading_artifacts: false
            });
        });

        this.setupListeners();
        this.engine.repaintCanvas();

        this.finishLoading();
    };

    hasEditAccess = () => {
        // var my_projects_check = (this.state.assignees.includes(this.user_info.user_id) || this.state.reviewer === this.user_info.user_id);

        // if (this.state.is_instance) {
        //   return this.user_info.feature_access['all_projects'] ? true : (((this.user_info.feature_access['my_projects'] || this.user_info.feature_access['my_projects_only']) && my_projects_check) || this.user_info.feature_access['case_studies']);
        // } else {
        //   return this.user_info.feature_access['all_projects'] ? true : ((this.user_info.feature_access['my_projects'] || this.user_info.feature_access['my_projects_only']) && my_projects_check);
        // }

        return true;
    };

    //Setting SRD connectors
    setupListeners = () => {
        this.model.addListener({
            nodesUpdated: this.diagramNodesUpdated,
            linksUpdated: this.diagramLinksUpdated,
            offsetUpdated: this.diagramOffsetUpdated,
            zoomUpdated: this.diagramZoomUpdated,
            gridUpdated: this.diagramGridUpdated,
            selectionChanged: this.diagramSelectionChanged,
            entityRemoved: this.diagramEntityRemoved
        });

        _.each(
            this.model.getNodes(),
            function (diagram_node) {
                diagram_node.addListener({
                    selectionChanged: this.nodeSelectionChanged,
                    entityRemoved: this.nodeEntityRemoved
                });

                if (this.state.comments_data) {
                    var count_data = _.countBy(this.state.comments_data, function (comment) {
                        return comment['widget_id'] === diagram_node.id;
                    });

                    diagram_node.comments_count = count_data[true];
                } else {
                    diagram_node.comments_count = 0;
                }

                if (this.state.artifact_data) {
                    diagram_node.attachments_count = this.state.artifact_data[diagram_node.id]
                        ? this.state.artifact_data[diagram_node.id]
                        : 0;
                }

                _.each(diagram_node.ports, function (diagram_port) {
                    diagram_port.label = '';
                });
            },
            this
        );
    };

    // get_project_details = () => {
    //   this.setState({
    //     loading: true
    //   });

    //   CodexDataProvider(
    //     CODEX_API_GET,
    //     {
    //       resource: "projects",
    //       action: this.state.project_id,
    //       callback: "onResponseGetDetails"
    //     },
    //     this,
    //     false
    //   );
    // }

    // onResponseGetDetails = (crud, response_data) => {
    //   var project_details = response_data['data'];
    //   this.setState({
    //     loading: false,
    //     project_id: project_details['id'],
    //     project_name: project_details['name'],
    //     assignees: project_details['assignees'],
    //     reviewer: project_details['reviewer'],
    //     is_instance: project_details['is_instance']
    //   });

    //   this.refresh_data();
    // }

    /**
     * React Diagrams Model listeners
     */
    diagramNodesUpdated = () => {
        this.setState({
            show_unsaved_changes: true
        });
    };

    diagramLinksUpdated = () => {
        this.setState({
            show_unsaved_changes: true
        });
    };

    diagramOffsetUpdated = () => {
        this.setState({
            show_unsaved_changes: true
        });
    };

    diagramZoomUpdated = () => {
        this.setState({
            show_unsaved_changes: true
        });
    };

    diagramGridUpdated = () => {
        this.setState({
            show_unsaved_changes: true
        });
    };

    diagramSelectionChanged = () => {
        // TODO
    };

    diagramEntityRemoved = () => {
        this.setState({
            show_unsaved_changes: true
        });
    };

    nodeSelectionChanged = (node_details) => {
        const { from_notebook, from_iteration } = this.props;
        var selected_items = this.model.getSelectedItems();

        var selected_nodes = _.filter(selected_items, function (selected_item) {
            return selected_item instanceof DesignNodeModel;
        });

        if (selected_nodes.length === 1 && node_details.isSelected) {
            if (from_notebook || from_iteration) {
                _.each(this.model.getNodes(), function (diagram_node) {
                    if (diagram_node.id === node_details.entity.id) {
                        diagram_node.show_toolbar = true;
                    } else {
                        diagram_node.show_toolbar = false;
                    }
                });

                this.engine.repaintCanvas();
            } else {
                this.setState({
                    item_selected: {
                        id: selected_nodes[0].id,
                        name: selected_nodes[0].name,
                        extras: selected_nodes[0].extras
                    },
                    clone_enabled: false,
                    loading_nodecode: false
                });
            }

            //   var loading_nodecode = true;
            //   if (from_notebook && !selected_nodes[0].extras.widget_code) {
            //     if (selected_nodes[0].extras.widget_type === 'CUSTOM') {
            //       if (selected_nodes[0].extras.widget_id === 'PLACEHOLDER') {
            //         selected_nodes[0].extras.widget_code = '# Please write your custom python code here...';
            //       }

            //       loading_nodecode = false;
            //     }
            //   } else {
            //     loading_nodecode = false;
            //   }

            //   if (loading_nodecode) {
            //     getWidgetDefaultCode({
            //       widget_id: selected_nodes[0].extras.widget_id,
            //       callback: this.onResponseGetDefaultCode
            //     });
            //   }
        } else if (selected_items.length > 0) {
            this.setState({
                item_selected: false,
                item_comment_count: 0,
                clone_enabled: true
            });

            _.each(this.model.getNodes(), function (diagram_node) {
                diagram_node.show_toolbar = false;
            });

            this.engine.repaintCanvas();
        } else {
            this.setState({
                item_selected: false,
                item_comment_count: 0,
                clone_enabled: false
            });

            _.each(this.model.getNodes(), function (diagram_node) {
                diagram_node.show_toolbar = false;
            });

            this.engine.repaintCanvas();
        }
    };

    setSelectedNodeForEdit = (props) => {
        this.setState(props);
    };

    onResponseGetDefaultCode = (response_data) => {
        var item_selected = this.state.item_selected;
        item_selected.extras.widget_code = response_data['details']['sourcecode'];
        item_selected.extras.doc_strings = response_data['details']['docstrings'];

        this.setDefaultCode({
            item_selected: item_selected,
            loading_nodecode: false
        });
    };

    setDefaultCode = (props) => {
        this.setState(props);
    };

    nodeEntityRemoved = () => {
        this.setState({
            show_unsaved_changes: true,
            item_selected: false
        });
    };

    nodeNameChange = (node_name) => {
        var selected_item = _.find(
            this.model.nodes,
            function (node_item) {
                return node_item.id === this.state.item_selected['id'];
            },
            this
        );

        if (selected_item) {
            selected_item.name = node_name;
            this.engine.recalculatePortsVisually();
            var item_selected_state = this.state.item_selected;
            item_selected_state.name = node_name;

            this.setState({
                item_selected: item_selected_state,
                show_unsaved_changes: true
            });
        }
    };

    // nodeBaseWidgetChange = (node_id, dropdown_id) => {
    //   var details = dropdown_id.split('_');
    //   var base_widget_group_id = details[0];
    //   var base_widget_id = details[1];

    //   var selected_item = _.find(this.model.nodes, function(node_item) {
    //     return node_item.id === node_id;
    //   });

    //   var selected_base_widget = _.find(this.state.widgets, function(widget) {
    //     return widget.id === parseInt(base_widget_id);
    //   });

    //   var selected_widget_group = _.find(this.state.widget_groups, function(widget_type) {
    //     return widget_type.id === parseInt(base_widget_group_id);
    //   });

    //   if (selected_item) {
    //     var node_extras = {
    //       widget_type: base_widget_group_id,
    //       widget_name: selected_base_widget.name,
    //       widget_id: base_widget_id
    //     };

    //     selected_item.extras = node_extras;
    //     selected_item.light_color = selected_widget_group.light_color;
    //     selected_item.dark_color = selected_widget_group.dark_color;

    //     var item_selected_state = this.state.item_selected;
    //     item_selected_state.extras = node_extras;

    //     this.setState({
    //       item_selected: item_selected_state,
    //       show_unsaved_changes: true
    //     });
    //   }
    // }

    // nodeWidthChange = (node_id, node_width) => {
    //   var selected_item = _.find(this.model.getSelectedItems(), function(node_item) {
    //     return node_item.id === node_id;
    //   });

    //   if (selected_item) {
    //     selected_item.node_width = node_width;
    //     var item_selected_state = this.state.item_selected;
    //     item_selected_state.extras.node_width = node_width;
    //     this.setState({
    //       item_selected: item_selected_state,
    //       show_unsaved_changes: true
    //     });

    //     this.engine.repaintCanvas();
    //   }
    // }

    // nodeHeightChange = (node_id, node_height) => {
    //   var selected_item = _.find(this.model.getSelectedItems(), function(node_item) {
    //     return node_item.id === node_id;
    //   });

    //   if (selected_item) {
    //     selected_item.node_height = node_height;
    //     var item_selected_state = this.state.item_selected;
    //     item_selected_state.extras.node_height = node_height;
    //     this.setState({
    //       item_selected: item_selected_state,
    //       show_unsaved_changes: true
    //     });

    //     this.engine.repaintCanvas();
    //   }
    // }

    // nodeColorChange = (node_id, node_color) => {
    //   var selected_item = _.find(this.model.getSelectedItems(), function(node_item) {
    //     return node_item.id === node_id;
    //   });

    //   if (selected_item) {
    //     selected_item.node_color = node_color;
    //     var item_selected_state = this.state.item_selected;
    //     item_selected_state.extras.node_color = node_color;
    //     this.setState({
    //       item_selected: item_selected_state,
    //       show_unsaved_changes: true
    //     });

    //     this.engine.repaintCanvas();
    //   }
    // }

    // nodeFontColorChange = (node_id, title_color) => {
    //   var selected_item = _.find(this.model.getSelectedItems(), function(node_item) {
    //     return node_item.id === node_id;
    //   });

    //   if (selected_item) {
    //     selected_item.title_color = title_color;
    //     var item_selected_state = this.state.item_selected;
    //     item_selected_state.extras.title_color = title_color;
    //     this.setState({
    //       item_selected: item_selected_state,
    //       show_unsaved_changes: true
    //     });

    //     this.engine.repaintCanvas();
    //   }
    // }

    deleteNode = () => {
        var selected_item = _.find(
            this.model.nodes,
            function (node_item) {
                return node_item.id === this.state.item_selected['id'];
            },
            this
        );

        if (selected_item) {
            this.model.clearSelection();
            selected_item.remove();
            this.engine.repaintCanvas();
        }
    };

    closeNodeDetails = () => {
        this.model.clearSelection();
        this.setState({
            item_in_edit: false
        });
    };

    executeWidgets = () => {
        this.setState({
            blueprint_actions_menu_anchorEl: false,
            blueprint_actions_menu_open: false
        });

        _.each(
            this.model.getNodes(),
            function (diagram_node) {
                var in_port = _.find(diagram_node.ports, function (diagram_port) {
                    return diagram_port.in;
                });

                var out_port = _.find(diagram_node.ports, function (diagram_port) {
                    return !diagram_port.in;
                });

                if (in_port || out_port) {
                    if (in_port) {
                        if (
                            _.keys(in_port.links).length === 0 &&
                            !diagram_node.execution_processing &&
                            !diagram_node.execution_success
                        ) {
                            diagram_node.execution_processing = true;
                        } else if (!diagram_node.execution_success) {
                            var found_unfinished_upstream = _.find(
                                in_port.links,
                                function (in_link) {
                                    return !in_link.sourcePort.parent.execution_success;
                                }
                            );

                            if (!found_unfinished_upstream) {
                                diagram_node.execution_processing = true;
                                this.engine.repaintCanvas();
                                setTimeout(
                                    function () {
                                        this.parentObj.updateNodeStatus(this.widget_id);
                                    }.bind({ parentObj: this, widget_id: diagram_node.id }),
                                    Math.random() * 5000
                                );
                            }
                        }
                    } else if (
                        !diagram_node.execution_processing &&
                        !diagram_node.execution_success &&
                        !in_port
                    ) {
                        diagram_node.execution_processing = true;
                        this.engine.repaintCanvas();
                        setTimeout(
                            function () {
                                this.parentObj.updateNodeStatus(this.widget_id);
                            }.bind({ parentObj: this, widget_id: diagram_node.id }),
                            Math.random() * 5000
                        );
                    }
                }
            },
            this
        );
    };

    executeNotebookWidgets = () => {
        executeBlueprint({
            iteration_id: this.state.iteration_id,
            notebook_id: this.state.notebook_id,
            callback: this.onExecuteNotebookWidgets
        });
    };

    onExecuteNotebookWidgets = () => {
        this.clearChanges();
    };

    updateNodeStatus = (widget_id) => {
        var found_node = _.find(this.model.getNodes(), function (diagram_node) {
            return diagram_node.id === widget_id;
        });

        if (found_node && found_node.execution_processing) {
            found_node.execution_processing = false;
            found_node.execution_success = true;

            this.engine.repaintCanvas();
            this.executeWidgets();
        }
    };

    // updateWidgetArtifacts = () => {
    //   this.refresh_artifact_summary();
    // }

    onDropWidget = (item_details, drop_event) => {
        this.addNode(item_details, this.engine.getRelativeMousePoint(drop_event));
    };

    addNode = (item_details, coords) => {
        var found_widget_type = _.find(this.state.widget_groups, function (widget_type) {
            return (
                item_details.widget_type === widget_type.id ||
                item_details.widget_type === widget_type.code
            );
        });

        if (!found_widget_type && item_details.widget_type === 'CUSTOM') {
            found_widget_type = {
                label: 'Custom',
                type: 'CUSTOM',
                light_color: '#efefef',
                dark_color: '#b1b1b1'
            };
        }

        var node = new DesignNodeModel(
            item_details.label,
            found_widget_type.dark_color,
            found_widget_type.light_color
        );

        if (found_widget_type.out_port) {
            node.addOutPort('OUT');
        }

        if (found_widget_type.in_port) {
            node.addInPort('IN');
        }

        if (item_details.widget_type === 'CUSTOM' && item_details.widget_id === 'PLACEHOLDER') {
            node.addOutPort('OUT');
            node.addInPort('IN');
        }

        node.setPosition(coords.x, coords.y);

        node.addListener({
            selectionChanged: this.nodeSelectionChanged,
            entityRemoved: this.nodeEntityRemoved
        });
        node.extras = {
            widget_type: item_details.widget_type,
            widget_name: item_details.label,
            widget_id: item_details.widget_id ? item_details.widget_id : false
        };

        // if (item_details.widget_type === 'CUSTOM' && item_details.widget_id === 'PLACEHOLDER') {
        //   node.extras['widget_code'] = '# Please enter your custom python code here...'
        // }

        node.comments_count = 0;
        node.attachments_count = 0;

        node.selected = true;
        this.model.clearSelection();
        this.model.addNode(node);

        if (item_details.widget_type === 'CUSTOM' && item_details.widget_id === 'CONTAINER') {
            var new_node_list = {};
            new_node_list[node.id] = node;

            _.each(this.model.nodes, function (node_details, widget_id) {
                if (widget_id !== node.id) {
                    new_node_list[widget_id] = node_details;
                }
            });

            this.model.nodes = new_node_list;
        }

        this.engine.repaintCanvas();
        this.nodeSelectionChanged({
            isSelected: true,
            entity: {
                id: node.id,
                name: node.extras.widget_name,
                extras: node.extras
            }
        });
    };

    downloadBlueprint = () => {
        this.setState({
            loading_blueprint: true,
            blueprint_actions_menu_anchorEl: false,
            blueprint_actions_menu_open: false
        });

        downloadBlueprintCode({
            project_id: this.state.project_id,
            callback: this.onResponseDownloadCode
        });
    };

    onResponseDownloadCode = (response_data) => {
        if (response_data['url']) {
            this.setState({
                loading_blueprint: false,
                show_download_notification: true
            });

            setTimeout(
                function () {
                    this.parentObj.setState({
                        show_download_notification: false
                    });
                }.bind({ parentObj: this }),
                6000
            );

            window.open(response_data['url'], '_blank');
        } else {
            this.setState({
                loading_blueprint: false,
                show_download_error_notification: true
            });

            setTimeout(
                function () {
                    this.parentObj.setState({
                        show_download_error_notification: false
                    });
                }.bind({ parentObj: this }),
                6000
            );
        }
    };

    saveProjectDesign = () => {
        const { from_notebook, from_iteration } = this.props;

        this.setState({
            loading_blueprint: true
        });

        if (from_notebook || from_iteration) {
            saveNotebookDesign({
                notebook_id: this.state.notebook_id,
                blueprint: this.model.serializeDiagram(),
                callback: this.onResponseGetBlueprint
            });
        } else {
            saveProjectBlueprint({
                project_id: this.state.project_id,
                blueprint: this.model.serializeDiagram(),
                callback: this.onResponseSaveDesign
            });
        }
    };

    onResponseSaveDesign = (response_data) => {
        if (response_data.data.status === 'success') {
            this.setState({
                show_saved_notification: true,
                show_unsaved_changes: false
            });

            setTimeout(
                function () {
                    this.parentObj.setState({
                        show_saved_notification: false
                    });
                }.bind({ parentObj: this }),
                6000
            );
        }

        this.setState({
            loading_blueprint: false
        });
    };

    getDesignBody = () => {
        const { classes } = this.props;

        return (
            <SRD.DiagramWidget
                className={classes.blueprintDesignBody}
                diagramEngine={this.engine}
                deleteKeys={[192]}
                allowCanvasZoom={false}
            />
        );
    };

    // onEditNode = () => {
    //   var table_args = false;
    //   // if (this.state.item_selected.extras && this.state.item_selected.extras.widget_name === 'FACTOR MAP') {
    //   //   table_args = {
    //   //     cols: ['Factor', 'Hypothesis']
    //   //   }
    //   // }

    //   this.setState({
    //     item_in_edit: true,
    //     item_edit_table_args: table_args
    //   });
    // }

    // onShowResults = () => {
    //   this.setState({
    //     item_in_results: true
    //   });
    // }

    // closeResultsDialog = () => {
    //   this.setState({
    //     item_in_results: false
    //   });
    // }

    onCodeNode = () => {
        this.setState({
            item_in_code: true
        });
    };

    closeCodeDialog = () => {
        this.setState({
            item_in_code: false
        });
    };

    showWidgets = () => {
        this.model.clearSelection();

        this.setState({
            show_widgets: true,
            item_selected: false
        });
    };

    closeWidgets = () => {
        this.setState({
            show_widgets: false
        });
    };

    clearChanges = () => {
        this.refreshData();
        this.setState({
            show_unsaved_changes: false
        });
    };

    zoomToFit = () => {
        this.engine.zoomToFit();
    };

    zoomOut = () => {
        this.model.setZoomLevel(this.model.getZoomLevel() - 10);
        this.engine.repaintCanvas();
    };

    zoomIn = () => {
        this.model.setZoomLevel(this.model.getZoomLevel() + 10);
        this.engine.repaintCanvas();
    };

    // onCopyNode = () => {
    //   var selected_item = _.find(this.model.nodes, function(node_item) {
    //     return node_item.id === this.state.item_selected.id;
    //   }, this);

    //   if (selected_item) {
    //     this.addNode(
    //       {
    //         widget_type: selected_item.extras.widget_type,
    //         label: selected_item.extras.widget_name + ' - Copy',
    //         widget_id: selected_item.extras.widget_id ? selected_item.extras.widget_id : false,
    //       },
    //       {
    //         x: selected_item.x + 20,
    //         y: selected_item.y + 20,
    //       });
    //   }
    // }

    // showNotebooks = () => {
    //   this.setState({
    //     notebooks: true
    //   });
    // }

    // closeNotebooks = () => {
    //   this.setState({
    //     notebooks: false
    //   });
    // }

    // showAttachments = () => {
    //   this.setState({
    //     attachments: true
    //   });
    // }

    // hideAttachments = () => {
    //   this.setState({
    //     attachments: false
    //   });
    // }

    // showComments = () => {
    //   this.setState({
    //     comments: true
    //   });
    // }

    // hideComments = () => {
    //   this.setState({
    //     comments: false
    //   });
    // }

    // cloneSelected = () => {
    //   var selected_items = this.model.getSelectedItems();

    //   // var selected_nodes = _.filter(selected_items, function(selected_item) {
    //   //   return selected_item instanceof DesignNodeModel;
    //   // });

    //   // var selected_links = _.filter(selected_items, function(selected_item) {
    //   //   return selected_item instanceof SRD.LinkModel;
    //   // });

    //   var item_map = {};
    //   _.each(selected_items, function(selected_item) {
    //     var new_item = selected_item.clone(item_map);

    // 		// offset the nodes slightly
    // 		if (new_item instanceof DesignNodeModel) {
    //       new_item.setPosition(new_item.x + 100, new_item.y + 100);
    //       new_item.attachment_count = 0;
    //       new_item.comment_count = 0;
    //       new_item.addListener({
    //         selectionChanged: this.nodeSelectionChanged,
    //         entityRemoved: this.nodeEntityRemoved,
    //       });
    // 			this.model.addNode(new_item);
    // 		} else if (new_item instanceof SRD.LinkModel) {
    // 			// offset the link points
    // 			new_item.getPoints().forEach(p => {
    // 				p.updateLocation({ x: p.getX() + 100, y: p.getY() + 100 });
    // 			});
    // 			this.model.addLink(new_item);
    // 		}
    //     new_item.selected = true;
    //     selected_item.selected = false;
    //   }, this);

    //   this.engine.repaintCanvas();
    // }

    // updateSelectedItemCommentCount = (count) => {
    //   this.setState({
    //     item_comment_count: count
    //   });
    // }

    onChangeWidgetAutocomplete = (event, { newValue, method }) => {
        if (method === 'type') {
            this.setState({
                widget_autocomplete_value: newValue
            });
        } else if (method === 'click') {
            this.onAddWidgetFromAutoComplete(newValue);
            this.setState({
                widget_autocomplete_value: ''
            });
        }
    };

    onAddWidgetFromAutoComplete = (widget_id) => {
        var widget_details = _.find(this.state.widgets, function (widget) {
            return widget.id === widget_id;
        });

        var widget_group_details = _.find(this.state.widget_groups, function (widget_group) {
            return widget_group.id === widget_details.group_id;
        });

        this.addNode(
            {
                label: widget_details.name,
                widget_type: widget_group_details.id,
                widget_id: widget_details.id,
                type: DraggableItemTypes.WIDGET
            },
            {
                x: 100 + this.model.getOffsetX(),
                y: 100 + this.model.getOffsetY()
            }
        );
    };

    getWidgetOptions = ({ value }) => {
        value = value.trim();
        var autocomplete_options = _.map(
            this.state.widget_groups,
            function (widget_group) {
                var filtered_widgets = _.filter(this.state.widgets, function (widget) {
                    return (
                        widget_group.id === widget.group_id &&
                        (widget.name.toLowerCase().startsWith(value.toLowerCase()) ||
                            widget.name.toLowerCase().includes(' ' + value.toLowerCase()))
                    );
                });

                return {
                    id: widget_group.id,
                    name: widget_group.name,
                    widgets: _.map(filtered_widgets, function (filtered_widget) {
                        return {
                            id: filtered_widget.id,
                            name: filtered_widget.name
                        };
                    })
                };
            },
            this
        );

        this.setState({
            widget_autocomplete_options: _.filter(
                autocomplete_options,
                function (autocomplete_option) {
                    return autocomplete_option.widgets.length > 0;
                }
            )
        });
    };

    clearWidgetOptions = () => {
        this.setState({
            widget_autocomplete_options: []
        });
    };

    getWidgetOptionValue = (option) => {
        return option.id;
    };

    renderWidgetOption = (option) => {
        return option.name;
    };

    renderWidgetOptionTitle = (option) => {
        return option.name;
    };

    getWidgetGroupOptions = (widget_group) => {
        return widget_group.widgets;
    };

    // renderProjectHeader = () => {
    //   const { classes } = this.props;

    //   var casestudy_count = this.state.casestudy_count === 0 ? '' : ' (' + this.state.casestudy_count + ')';
    //   var comment_count = this.state.comment_count === 0 ? '' : ' (' + this.state.comment_count + ')';
    //   var attachment_count = this.state.artifact_data && this.state.artifact_data['main'] ? ' (' + this.state.artifact_data['main'] + ')' : '';

    //   var notebooks_path = "projects/" + this.state.project_id + "/notebooks";
    //   if (this.state.parent_project_id) {
    //     notebooks_path = "projects/" + this.state.parent_project_id + "/case-studies/" + this.state.project_id + "/notebooks";
    //   }

    //   return (
    //     <div>
    //       <div className={classes.floatLeft}>
    //         <h3 style={{ marginTop: '0px' }}>{this.state.project_name}</h3>
    //       </div>
    //       {this.state.is_instance ? (
    //         ''
    //       ) : (
    //         <Button color="primary" href={getRoute("projects/" + this.state.project_id + "/case-studies")}>
    //           <ListIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Case Studies{casestudy_count}</span>
    //         </Button>
    //       )}
    //       {this.state.is_instance ? (
    //         ''
    //       ) : (
    //         this.hasEditAccess() ? (
    //           <Button color="primary" href={getRoute("projects/" + this.state.project_id + "/case-studies/add")}>
    //             <AddIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Create Case Study</span>
    //           </Button>
    //         ) : (
    //           ''
    //         )
    //       )}
    //       <Button color="primary" onClick={() => this.showAttachments()}>
    //         <AttachFileIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Attachments{attachment_count}</span>
    //       </Button>
    //       <Button color="primary" onClick={() => this.showComments()}>
    //         <CommentIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Comments{comment_count}</span>
    //       </Button>
    //       <Button color="primary" href={getRoute(notebooks_path)}>
    //         <DescriptionIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Notebooks</span>
    //       </Button>
    //       <br clear="all"/>
    //     </div>
    //   );
    // }

    toggleDesignModules = () => {
        this.setState({
            show_design_modules: !this.state.show_design_modules
        });
    };

    showBlueprintsActionsMenu = (event) => {
        this.setState({
            blueprint_actions_menu_open: true,
            blueprint_actions_menu_anchorEl: event.currentTarget
        });
    };

    closeBlueprintActionsMenu = () => {
        this.setState({
            blueprint_actions_menu_open: false,
            blueprint_actions_menu_anchorEl: false
        });
    };

    renderBlueprintHeader = () => {
        const { classes, from_notebook, from_iteration } = this.props;

        return this.state.loading ? (
            ''
        ) : (
            <div key="blueprint-toolbar-container" className={classes.blueprintContentToolbar}>
                <div
                    key="blueprint-toolbar-left-container"
                    className={classes.blueprintToolbarLeft}
                >
                    {this.hasEditAccess() ? (
                        <Button
                            className={classes.blueprintAddWidgetButton}
                            onClick={() => this.showWidgets()}
                            aria-label="Add widget"
                            variant="contained"
                        >
                            <span
                                className={classes.blueprintAddWidgetButtonLabel}
                                data-testid="add widget"
                            >
                                Add Widget
                            </span>
                        </Button>
                    ) : null}
                    {/* {this.state.clone_enabled ? (
            <Button color="primary" onClick={() => this.cloneSelected()}>
              <FileCopy className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Clone</span>
            </Button>
          ) : (
            ''
          )} */}

                    {from_notebook || from_iteration ? (
                        <Button
                            color="primary"
                            onClick={() => this.executeNotebookWidgets()}
                            aria-label="Execute"
                        >
                            <CallToAction className={classes.icons} />
                            <span style={{ paddingLeft: '2px' }}>Execute</span>
                        </Button>
                    ) : null}
                    {/* <Button color="primary" onClick={() => this.downloadBlueprint()}>
            <GetAppIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Download</span>
          </Button> */}
                </div>
                <div
                    key="blueprint-toolbar-right-container"
                    className={classes.blueprintToolbarRight}
                >
                    <Box
                        title="Clear changes"
                        onClick={() => this.clearChanges()}
                        aria-label="Clear changes"
                        className={classes.reset}
                    >
                        <RefreshIcon className={classes.refreshIcon} fontSize="large" />
                        <span>Reset</span>
                    </Box>
                    {this.hasEditAccess() && this.state.show_unsaved_changes
                        ? [
                              <Button
                                  key={'saveProjectDesignButton'}
                                  title="Save changes"
                                  onClick={() => this.saveProjectDesign()}
                                  aria-label="Save"
                                  variant="outlined"
                                  className={classes.saveBtn}
                              >
                                  Save
                              </Button>
                          ]
                        : ''}
                    <div className={classes.seprator}></div>
                    {!from_notebook || from_iteration ? (
                        <Box
                            title="Toggle design information"
                            onClick={() => this.toggleDesignModules()}
                            aria-label="Info"
                            className={classes.defaultIconInfo}
                        >
                            <InfoOutlinedIcon />
                        </Box>
                    ) : null}
                    <Box
                        title="Zoom in"
                        onClick={() => this.zoomIn()}
                        aria-label="Zoom in"
                        className={classes.defaultIcon}
                    >
                        <ZoomIn fontSize="large" />
                    </Box>
                    <Box
                        title="Zoom out"
                        onClick={() => this.zoomOut()}
                        aria-label="Zoom out"
                        className={classes.defaultIcon}
                    >
                        <ZoomOut fontSize="large" />
                    </Box>
                    <Box
                        title="Zoom to fit"
                        onClick={() => this.zoomToFit()}
                        aria-label="Zoom to fit"
                        className={classes.defaultIconZoomMap}
                    >
                        <ZoomOutMap fontSize="large" />
                    </Box>
                    {!from_notebook || from_iteration ? (
                        <Box
                            title="Actions"
                            onClick={(event) => this.showBlueprintsActionsMenu(event)}
                            aria-label="Actions"
                            className={classes.defaultIcon}
                        >
                            <MoreHoriz fontSize="large" />
                        </Box>
                    ) : null}
                    <Popover
                        keepMounted
                        anchorEl={this.state.blueprint_actions_menu_anchorEl}
                        open={this.state.blueprint_actions_menu_open}
                        onClose={this.closeBlueprintActionsMenu}
                    >
                        <div className={classes.blueprintActionsMenuContainer}>
                            <MenuItem
                                key={'blueprint_action_download'}
                                value={'download'}
                                classes={{
                                    root: classes.blueprintActionsMenuItem,
                                    selected: classes.blueprintActionsMenuItemSelected
                                }}
                                onClick={this.downloadBlueprint}
                            >
                                {'Download'}
                            </MenuItem>
                            <MenuItem
                                key={'blueprint_action_execute'}
                                value={'execute'}
                                classes={{
                                    root: classes.blueprintActionsMenuItem,
                                    selected: classes.blueprintActionsMenuItemSelected
                                }}
                                onClick={this.executeWidgets}
                            >
                                {'Execute'}
                            </MenuItem>
                        </div>
                    </Popover>
                </div>
            </div>
        );
    };

    renderAddWidgetSearch = () => {
        const { classes } = this.props;
        return (
            <div className={classes.searchContainer}>
                <SearchOutlined className={classes.search} />
                <Autosuggest
                    multiSection={true}
                    suggestions={this.state.widget_autocomplete_options}
                    onSuggestionsFetchRequested={this.getWidgetOptions}
                    onSuggestionsClearRequested={this.clearWidgetOptions}
                    getSuggestionValue={this.getWidgetOptionValue}
                    renderSuggestion={this.renderWidgetOption}
                    renderSectionTitle={this.renderWidgetOptionTitle}
                    getSectionSuggestions={this.getWidgetGroupOptions}
                    theme={classes}
                    inputProps={{
                        placeholder: 'Search',
                        value: this.state.widget_autocomplete_value,
                        onChange: this.onChangeWidgetAutocomplete
                    }}
                />
            </div>
        );
    };

    renderAddWidgetSections = () => {
        const { classes } = this.props;

        var widget_types = _.map(
            this.state.widget_groups,
            function (widget_type, index) {
                var widgets = _.filter(this.state.widgets, function (widget) {
                    return widget.group_id === widget_type.id;
                });

                var widget_type_options = _.map(
                    widgets,
                    function (widget_type_option) {
                        return (
                            <DraggableChip
                                classes={classes}
                                key={'draggable_widget_' + widget_type_option.id}
                                parent_obj={this}
                                color={widget_type.dark_color}
                                widget_type={widget_type.id}
                                widget_id={widget_type_option.id}
                                label={widget_type_option.name}
                            />
                        );
                    },
                    this
                );

                return (
                    <Accordion
                        key={'widget-group-accordion-' + widget_type.name}
                        className={index == 0 ? classes.firstAccordion : classes.accordion}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMore className={classes.expandIcon} />}
                        >
                            <Typography variant="h5" className={classes.widgetTypeName}>
                                {widget_type.name}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className={classes.blueprintAddWidgetGroupBody}>
                                {widget_type_options}
                                <br />
                            </div>
                        </AccordionDetails>
                    </Accordion>
                );
            },
            this
        );

        widget_types.push(
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h5">Custom</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={classes.blueprintAddWidgetGroupCustomBody}>
                        <DraggableChip
                            classes={classes}
                            key={'draggable_widget_container'}
                            parent_obj={this}
                            color={'#b1b1b1'}
                            widget_type={'CUSTOM'}
                            widget_id={'CONTAINER'}
                            label={'Container'}
                        />
                        <DraggableChip
                            classes={classes}
                            key={'draggable_widget_placeholder'}
                            parent_obj={this}
                            color={'#b1b1b1'}
                            widget_type={'CUSTOM'}
                            widget_id={'PLACEHOLDER'}
                            label={'Placeholder'}
                        />
                        <br />
                    </div>
                </AccordionDetails>
            </Accordion>
        );

        return widget_types;
    };

    renderNodeDetails = () => {
        const { classes } = this.props;

        return (
            <Card style={{ height: '100%' }} className={classes.cardContianer}>
                <CardContent>
                    <div>
                        {/* {this.state.artifact_data[this.state.item_selected.id] && this.state.artifact_data[this.state.item_selected.id] > 0 ? (
              <Button className={classes.blueprintNodeDetailsButton} onClick={() => this.onShowResults()}>
                <EqualizerIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Results</span>
              </Button>
            ) : (
              ""
            )} */}
                        <div className={clsx(classes.buttonContianer, classes.cardHeader)}>
                            <span className={classes.title}>Widget Details</span>
                            <div
                                className={classes.closeIcon}
                                onClick={() => this.closeNodeDetails()}
                            >
                                <CloseIcon />
                            </div>
                        </div>
                        <hr className={classes.sepratorLine} />
                        <div className={classes.buttonContianer}>
                            <div
                                className={classes.blueprintNodeDetails}
                                onClick={() => this.onCodeNode()}
                                aria-label="Code"
                            >
                                <CodeIcon className={classes.icons} />
                                <span>Code</span>
                            </div>
                            <div
                                className={classes.blueprintNodeDetails}
                                onClick={() => this.onCopyNode()}
                                aria-label="Clone"
                            >
                                <CloneIcon
                                    color={this.props.theme.palette.text.default}
                                    className={classes.icons}
                                />
                                <span>Clone</span>
                            </div>
                        </div>
                        <div className={classes.buttonContianer}>
                            {this.hasEditAccess() ? (
                                <div
                                    className={classes.blueprintNodeDetails}
                                    onClick={() => this.deleteNode()}
                                    aria-label="Delete"
                                >
                                    <DeleteIcon className={classes.icons} />
                                    <span>Delete Node</span>
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                        <Typography className={classes.blueprintNodeDetailsHeader} variant="h5">
                            Details
                        </Typography>
                        {this.getNodeDetailsAccordion()}
                        <br />
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                className={classes.summary}
                            >
                                <Typography variant="h5" className={classes.accordionHeader}>
                                    Components
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <WidgetComponents
                                    classes={classes}
                                    widget_id={this.state.item_selected.extras.widget_id}
                                />
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </CardContent>
            </Card>
        );
    };

    onChangeCode = (code_text) => {
        var selected_item = _.find(
            this.model.nodes,
            function (node_item) {
                return node_item.id === this.state.item_selected['id'];
            },
            this
        );

        if (selected_item) {
            selected_item.extras.widget_code = code_text;
            var item_selected_state = this.state.item_selected;
            item_selected_state.extras.widget_code = code_text;

            this.setState({
                item_selected: item_selected_state,
                show_unsaved_changes: true
            });
        }
    };

    onChangeOutputVars = (output_vars) => {
        var selected_item = _.find(
            this.model.nodes,
            function (node_item) {
                return node_item.id === this.state.item_selected['id'];
            },
            this
        );

        if (selected_item) {
            selected_item.extras.widget_output_vars = output_vars;
            var item_selected_state = this.state.item_selected;
            item_selected_state.extras.widget_output_vars = output_vars;

            this.setState({
                item_selected: item_selected_state,
                show_unsaved_changes: true
            });
        }
    };

    onClickExecuteWidget = () => {
        executeBlueprintWidget({
            iteration_id: this.state.iteration_id,
            notebook_id: this.state.notebook_id,
            widget_id: this.state.item_selected.id,
            callback: this.onResponseExecuteWidget
        });
    };

    onClickOutputsWidget = () => {
        this.setState({
            show_outputs: true
        });
    };

    onClickInputsWidget = (input_widgets) => {
        this.setState({
            show_inputs: input_widgets
        });
    };

    onResponseExecuteWidget = () => {
        // TODO
    };

    editorDidMount = (editor, monaco) => {
        const { classes } = this.props;

        this.editor = editor;
        this.editor.deltaDecorations(
            [],
            _.map(this.state.item_selected?.extras?.doc_strings, function (docstring_item) {
                return {
                    range: new monaco.Range(docstring_item.lineno, 1, docstring_item.lineno, 1),
                    options: {
                        isWholeLine: true,
                        linesDecorationsClassName: classes.myLineDecoration,
                        hoverMessage: {
                            value: docstring_item.docstring
                                .replace(new RegExp('\\r?\\n', 'g'), '\n\n')
                                .replace(new RegExp('\\n----', 'g'), '----'),
                            isTrusted: true
                        }
                    }
                };
            })
        );
    };

    onClickAddNotebookOutput = (notebook_output_selected) => {
        var selected_item = _.find(
            this.model.nodes,
            function (node_item) {
                return node_item.id === this.state.item_selected['id'];
            },
            this
        );

        if (selected_item) {
            selected_item.extras.notebook_output = notebook_output_selected;
            var item_selected_state = this.state.item_selected;
            item_selected_state.extras.notebook_output = notebook_output_selected;

            this.setState({
                item_selected: item_selected_state,
                show_unsaved_changes: true
            });
        }
    };

    renderNodeCodeDetails = () => {
        const { classes } = this.props;

        var selected_items = this.model.getSelectedItems();
        var selected_item = _.find(
            selected_items,
            function (item) {
                return item.id === this.state.item_selected.id;
            },
            this
        );

        var in_port = _.find(selected_item.ports, function (port) {
            return port.in;
        });

        var input_widgets = [];

        if (in_port && in_port.links) {
            input_widgets = _.map(in_port.links, function (link) {
                return {
                    id: link.sourcePort.parent.id,
                    name: link.sourcePort.parent.name
                };
            });
        }

        return (
            <Card style={{ height: '100%' }}>
                <CardContent>
                    <Button
                        className={classes.blueprintNodeDetailsButton}
                        onClick={this.onClickExecuteWidget}
                        aria-label="Execute"
                    >
                        <CodeIcon className={classes.icons} />
                        <span style={{ paddingLeft: '2px' }}>Execute</span>
                    </Button>
                    {input_widgets.length > 0 ? (
                        <Button
                            className={classes.blueprintNodeDetailsButton}
                            onClick={() => this.onClickInputsWidget(input_widgets)}
                            aria-label="Inputs"
                        >
                            <CodeIcon className={classes.icons} />
                            <span style={{ paddingLeft: '2px' }}>Inputs</span>
                        </Button>
                    ) : (
                        ''
                    )}
                    <Button
                        className={classes.blueprintNodeDetailsButton}
                        onClick={this.onClickOutputsWidget}
                        aria-label="Outputs"
                    >
                        <CodeIcon className={classes.icons} />
                        <span style={{ paddingLeft: '2px' }}>Outputs</span>
                    </Button>
                    <Button
                        className={classes.blueprintNodeDetailsCancelButton}
                        onClick={() => this.closeNodeDetails()}
                        aria-label="Close"
                    >
                        <CloseIcon className={classes.icons} />
                        <span style={{ paddingLeft: '2px' }}>Close</span>
                    </Button>
                    {this.getNodeDetailsAccordion()}
                    {this.state.loading_nodecode ? (
                        <LinearProgress />
                    ) : (
                        [
                            <Accordion key={'accordionContainer'}>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography variant="h5">Code</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div className={classes.blueprintSmallEditorBody}>
                                        <Editor
                                            key={'base_code_editor'}
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
                                                this.state.item_selected?.extras?.widget_code
                                                    ? this.state.item_selected.extras.widget_code
                                                    : ''
                                            }
                                            options={{ selectOnLineNumbers: true }}
                                            onChange={this.onChangeCode}
                                            onMount={this.editorDidMount}
                                        />
                                        <br />
                                    </div>
                                </AccordionDetails>
                            </Accordion>,
                            <Accordion key={'accordionContainer2'}>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography variant="h5">Output</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div>
                                        <CustomTextField
                                            parent_obj={this}
                                            field_info={{
                                                label: 'Output variables',
                                                id:
                                                    'node_output_vars_' +
                                                    this.state.item_selected['id'],
                                                fullWidth: true,
                                                value: this.state.item_selected?.extras
                                                    ?.widget_output_vars
                                                    ? this.state.item_selected.extras
                                                          .widget_output_vars
                                                    : '',
                                                onChange: 'onChangeOutputVars',
                                                helperText:
                                                    'Please enter the output variables you wish to persist upon execution. Use commas to separate multiple variable names'
                                            }}
                                        />
                                        <Typography variant="h5">
                                            {'Add to notebook outputs'}
                                        </Typography>
                                        {this.state.item_selected?.extras?.notebook_output ? (
                                            <CheckBox
                                                className={classes.blueprintOutputsCheckbox}
                                                fontSize="large"
                                                onClick={() => this.onClickAddNotebookOutput(false)}
                                            />
                                        ) : (
                                            <CheckBoxOutlineBlank
                                                className={classes.blueprintOutputsCheckbox}
                                                fontSize="large"
                                                onClick={() => this.onClickAddNotebookOutput(true)}
                                            />
                                        )}
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        ]
                    )}
                </CardContent>
            </Card>
        );
    };

    getNodeDetailsAccordion = () => {
        const { classes } = this.props;

        var node_widget_column_options = [];
        _.each(
            this.state.widget_groups,
            function (widget_type) {
                var widgets = _.map(
                    _.filter(this.state.widgets, function (widget) {
                        return widget.group_id === widget_type.id;
                    }),
                    function (filtered_widget) {
                        return {
                            value: widget_type.id + '_' + filtered_widget.id,
                            label: filtered_widget.name
                        };
                        // return (
                        //   <MenuItem
                        //     key={"node_widget_type_" + filtered_widget.id}
                        //     value={widget_type.id + '_' + filtered_widget.id}
                        //     classes={{
                        //       root: classes.selectMenuItem
                        //     }}
                        //   >
                        //     {filtered_widget.name}
                        //   </MenuItem>
                        // );
                    },
                    this
                );

                node_widget_column_options.push({
                    is_group_label: true,
                    value: widget_type.name,
                    label: widget_type.name
                });

                node_widget_column_options = node_widget_column_options.concat(widgets);
            },
            this
        );

        return (
            <div>
                {this.hasEditAccess() ? (
                    <div>
                        <CustomTextField
                            parent_obj={this}
                            field_info={{
                                label: 'Name *',
                                id: 'node_' + this.state.item_selected['id'],
                                fullWidth: true,
                                value: this.state.item_selected['name'],
                                onChange: 'nodeNameChange',
                                customLabel: classes.customLabel
                            }}
                        />
                        {this.state.item_selected.extras.widget_type === 'CUSTOM' ? (
                            ''
                        ) : (
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Base Widget',
                                    id: 'node_widget_type_' + this.state.item_selected['id'],
                                    fullWidth: true,
                                    is_select: true,
                                    options: node_widget_column_options,
                                    value:
                                        this.state.item_selected.extras['widget_type'] +
                                        '_' +
                                        this.state.item_selected.extras['widget_id'],
                                    onChange: 'nodeBaseWidgetChange',
                                    customLabel: classes.customLabel
                                }}
                            />
                        )}
                        <br />
                    </div>
                ) : (
                    ''
                )}
                {this.hasEditAccess() &&
                this.state.item_selected.extras.widget_type === 'CUSTOM' &&
                this.state.item_selected.extras.widget_id === 'CONTAINER' ? (
                    <div>
                        <CustomTextField
                            parent_obj={this}
                            field_info={{
                                label: 'Width',
                                id: 'node_width_' + this.state.item_selected['id'],
                                fullWidth: true,
                                onChange: 'nodeWidthChange',
                                value: this.state.item_selected.extras['node_width']
                            }}
                        />
                        <CustomTextField
                            parent_obj={this}
                            field_info={{
                                label: 'Height',
                                id: 'node_height_' + this.state.item_selected['id'],
                                fullWidth: true,
                                onChange: 'nodeHeightChange',
                                value: this.state.item_selected.extras['node_height']
                            }}
                        />
                        <CustomTextField
                            parent_obj={this}
                            field_info={{
                                label: 'Color - HEX',
                                id: 'node_color_' + this.state.item_selected['id'],
                                fullWidth: true,
                                onChange: 'nodeColorChange',
                                value: this.state.item_selected.extras['node_color']
                            }}
                        />
                        <CustomTextField
                            parent_obj={this}
                            field_info={{
                                label: 'Title Color - HEX',
                                id: 'title_color_' + this.state.item_selected['id'],
                                fullWidth: true,
                                onChange: 'nodeFontColorChange',
                                value: this.state.item_selected.extras['title_color']
                            }}
                        />
                        <br />
                    </div>
                ) : (
                    ''
                )}
            </div>
        );
    };

    renderAddWidgets = () => {
        const { classes } = this.props;

        return (
            <Card className={classes.card} style={{ margin: 0, height: '100%' }}>
                <CardContent>
                    <div>
                        <div className={classes.addWidgetHeaderContainer}>
                            <Typography variant="h5" className={classes.blueprintAddWidgetHeader}>
                                Add Widget
                            </Typography>
                            <div className={classes.blueprintAddWidgetClose}>
                                <div
                                    className={classes.blueprintAddWidgetCloseButton}
                                    color="secondary"
                                    onClick={() => this.closeWidgets()}
                                    aria-label="Close"
                                >
                                    <CloseIcon fontSize="inherit" />
                                </div>
                            </div>
                        </div>
                        <br />
                        {this.state.loading_widgets ? (
                            ''
                        ) : (
                            <div>
                                {this.renderAddWidgetSearch()}
                                <br />
                                {this.renderAddWidgetSections()}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    onSetupBlueprint = () => {};

    onCreateBlueprint = () => {
        this.setState({
            loading: true
        });

        createProject({
            name: this.props.app_info.name + ' - Project',
            app_id: this.props.app_info.id,
            callback: this.createProject
        });
    };

    onResponseCreateBlueprint = () => {
        window.location.reload();
    };

    closeOutputs = () => {
        this.setState({
            show_outputs: false
        });
    };

    closeInputs = () => {
        this.setState({
            show_inputs: false
        });
    };

    render() {
        const { classes, from_notebook, from_iteration } = this.props;

        // var popup_form_params = {
        //     trigger_button: {
        //         text: 'Setup Blueprint',
        //         start_icon: <SettingsIcon />
        //     },
        //     dialog: {
        //         title: 'Setup blueprint'
        //     },
        //     dialog_actions: [
        //         {
        //             name: 'setup',
        //             text: 'Setup',
        //             variant: 'contained',
        //             callback: 'onSetupBlueprint',
        //             parent_obj: this
        //         },
        //         { is_cancel: true, text: 'Cancel' }
        //     ],
        //     notifications: {
        //         time: 3000
        //     },
        //     form_config: {
        //         fields: [
        //             {
        //                 id: 'project_details_label',
        //                 name: 'project_details_label',
        //                 type: 'label',
        //                 value: 'Project Details',
        //                 fullWidth: true,
        //                 InputLabelProps: {
        //                     variant: 'h4'
        //                 },
        //                 underline: false,
        //                 grid: 12
        //             },
        //             {
        //                 id: 'project_id',
        //                 name: 'project_id',
        //                 label: 'Project',
        //                 type: 'autosuggest',
        //                 inputprops: {
        //                     autocomplete: 'off'
        //                 },
        //                 ajaxCallback: getAjaxProjects,
        //                 menuItem: DesignProjectMenuItem,
        //                 menuFixed: true,
        //                 placeholder: 'Enter text to search through projects',
        //                 grid: 12,
        //                 fullWidth: true,
        //                 variant: 'outlined',
        //                 required: true,
        //                 value: '',
        //                 valueLabel: ''
        //             },
        //             {
        //                 id: 'casestudy_id',
        //                 name: 'casestudy_id',
        //                 label: 'Case Study',
        //                 type: 'autosuggest',
        //                 grid: 12,
        //                 fullWidth: true,
        //                 variant: 'outlined',
        //                 required: true,
        //                 value: '',
        //                 valueLabel: ''
        //             }
        //         ]
        //     }
        // };

        return (
            <div key="blueprint-container" className={classes.blueprintContent}>
                {this.state.show_setup ? (
                    <Typography variant="h4">
                        Please connect to a blueprint using the Platform Utils.
                    </Typography>
                ) : // <div key="blueprint-setup-container">
                //     <Typography variant="h4">{'Option 1: '}</Typography>
                //     <Typography variant="h5">
                //         {
                //             'Create a new blueprint from scratch using available widgets across Data Ingestion, Transformation, Modelling and Visualization.'
                //         }
                //     </Typography>
                //     <br />
                //     <Button
                //         variant="outlined"
                //         startIcon={<AddIcon />}
                //         onClick={this.onCreateBlueprint}
                //     >
                //         {'Create blueprint'}
                //     </Button>
                //     <br />
                //     <br />
                //     <Typography variant="h4">{'OR'}</Typography>
                //     <br />
                //     <br />
                //     <Typography variant="h4">{'Option 2: '}</Typography>
                //     <Typography variant="h5">
                //         {
                //             'Create a new blueprint from scratch using available widgets across Data Ingestion, Transformation, Modelling and Visualization.'
                //         }
                //     </Typography>
                //     <br />
                //     <PopupForm key={'setup_blueprint_form'} params={popup_form_params} />
                // </div>
                this.state.error ? (
                    <ErrorIcon fontSize="large" titleAccess="Failed to load Notebook!" />
                ) : (
                    [
                        this.state.show_design_modules ? (
                            <DesignModules
                                parent_obj={this}
                                project_id={this.state.project_id}
                                hasEditAccess={this.hasEditAccess()}
                            />
                        ) : (
                            ''
                        ),
                        this.state.item_selected && this.state.item_in_code ? (
                            <WidgetCode
                                parent_obj={this}
                                classes={classes}
                                widget_id={this.state.item_selected.id}
                                project_id={this.state.project_id}
                                base_widget_id={this.state.item_selected.extras.widget_id}
                            />
                        ) : (
                            [
                                this.renderBlueprintHeader(),
                                <Grid
                                    key="blueprint-grid-content"
                                    container
                                    spacing={2}
                                    className={classes.blueprintContentGridContainer}
                                >
                                    {this.state.show_widgets ? (
                                        <Grid item xs={2}>
                                            {this.renderAddWidgets()}
                                        </Grid>
                                    ) : (
                                        ''
                                    )}
                                    <Grid item xs className={classes.blueprintContentGridItem}>
                                        {this.state.loading || this.state.loading_blueprint ? (
                                            <LinearProgress />
                                        ) : (
                                            ''
                                        )}
                                        <DesignDroppable
                                            widgets={this.getDesignBody()}
                                            parent_obj={this}
                                            classes={classes}
                                        />
                                    </Grid>
                                    {this.state.item_selected ? (
                                        from_notebook || from_iteration ? (
                                            <Grid item xs={10}>
                                                {this.renderNodeCodeDetails()}
                                            </Grid>
                                        ) : (
                                            <Grid item xs={2}>
                                                {this.renderNodeDetails()}
                                            </Grid>
                                        )
                                    ) : (
                                        ''
                                    )}
                                </Grid>
                            ]
                        ),
                        <Snackbar
                            key="download-success-alert"
                            place="bc"
                            open={this.state.show_download_notification}
                            closeNotification={() =>
                                this.setState({ show_download_notification: false })
                            }
                            classes={{
                                root: classes.blueprintAlertSuccess
                            }}
                            close
                        >
                            <div key="download-success-alert-container">
                                <NotificationsActive className={classes.blueprintAlertIcon} />
                                <span className={classes.blueprintAlertMessage}>
                                    {'Blueprint downloaded successfully !'}
                                </span>
                            </div>
                        </Snackbar>,
                        <Snackbar
                            key="download-error-alert"
                            place="bc"
                            open={this.state.show_download_error_notification}
                            closeNotification={() =>
                                this.setState({ show_download_error_notification: false })
                            }
                            classes={{
                                root: classes.blueprintAlertError
                            }}
                            close
                        >
                            <div key="download-error-alert-container">
                                <NotificationImportant className={classes.blueprintAlertIcon} />
                                <span className={classes.blueprintAlertMessage}>
                                    {'Blueprint download error !'}
                                </span>
                            </div>
                        </Snackbar>,
                        <Snackbar
                            key="blueprint-save-success-alert"
                            place="bc"
                            classes={{
                                root: classes.blueprintAlertSuccess
                            }}
                            message={'Design blueprint saved successfully !'}
                            open={this.state.show_saved_notification}
                            closeNotification={() =>
                                this.setState({ show_saved_notification: false })
                            }
                            close
                        >
                            <div key="blueprint-save-alert-container">
                                <NotificationImportant className={classes.blueprintAlertIcon} />
                                <span className={classes.blueprintAlertMessage}>
                                    {'Blueprint saved successfully !'}
                                </span>
                            </div>
                        </Snackbar>,
                        this.state.show_outputs ? (
                            <BlueprintWidgetOutputs
                                parent_obj={this}
                                notebook_id={this.state.notebook_id}
                                iteration_id={this.state.iteration_id}
                                widget_id={this.state.item_selected.id}
                            />
                        ) : (
                            ''
                        ),
                        this.state.show_inputs ? (
                            <BlueprintWidgetInputs
                                parent_obj={this}
                                notebook_id={this.state.notebook_id}
                                iteration_id={this.state.iteration_id}
                                input_widgets={this.state.show_inputs}
                            />
                        ) : (
                            ''
                        )
                    ]
                )}
            </div>
        );

        // var design_path = "projects/" + this.state.project_id + "/design";
        // if (this.state.parent_project_id) {
        //   design_path = "projects/" + this.state.parent_project_id + "/case-studies/" + this.state.project_id + "/design";
        // }

        // return this.state.loading ? (
        //     <OrangeLinearProgress />
        //   ) : (this.state.notebooks ? <ProjectNotebooks project_id={this.state.project_id} project_name={this.state.project_name} parent_obj={this} /> : (
        //       <div>
        //         <BreadcrumbsItem to={getRoute(design_path)}>
        //           <span className={classes.breadcrumbItemIconContainer}>
        //             <Icon className={classes.breadcrumbIcon}>account_tree</Icon>
        //             {this.state.project_name}
        //           </span>
        //         </BreadcrumbsItem>
        //         {this.renderProjectHeader()}
        //           {this.state.loading_blueprint || this.state.loading_artifacts || this.state.saving ? (
        //             <OrangeLinearProgress />
        //           ) : (
        //             ''
        //           )}

        //           <div>
        //             {this.state.item_selected ?
        //               this.renderNodeDetails() :
        //               this.state.show_widgets ? this.renderAddWidgets() : ''}

        //             {this.renderBlueprintBody()}
        //           </div>
        //         </div>

        //         {this.state.item_selected && this.state.item_in_results ? (
        //           <WidgetArtifactsView parent_obj={this} classes={classes} widget_id={this.state.item_selected.id} project_id={this.state.project_id} />
        //         ) : (
        //           ''
        //         )}

        //         {this.state.item_selected && this.state.item_in_code ? (
        //           <WidgetCode parent_obj={this} classes={classes} widget_id={this.state.item_selected.id} project_id={this.state.project_id} base_widget_id={this.state.item_selected.extras.widget_id} />
        //         ) : (
        //           ''
        //         )}
        //         {this.state.attachments ? (
        //           <SweetAlert
        //             // success
        //             customClass={classes.higherAlert}
        //             title="Attachments"
        //             showConfirm={false}
        //             onConfirm={() => { return false; }}
        //             onCancel={() => this.hideAttachments()}
        //             confirmBtnCssClass={classes.button + " " + classes.codxDark}
        //           >
        //             <Attachments key={'project_attachments'} parent_obj={this} classes={classes} project_id={this.state.project_id} />
        //           </SweetAlert>
        //         ) : ''}

        //         {this.state.comments ? (
        //           <SweetAlert
        //             // success
        //             customClass={classes.higherAlert}
        //             title="Comments"
        //             showConfirm={false}
        //             onConfirm={() => { return false; }}
        //             onCancel={() => this.hideComments()}
        //           >
        //             <ProjectComments key={'project_comments'} parent_obj={this} classes={classes} project_id={this.state.project_id} widget_id={false} />
        //           </SweetAlert>
        //         ) : ''}
        //       </div>
        //     ));
    }
}

Design.propTypes = {
    classes: PropTypes.object.isRequired
};

// export default withStyles(
//   theme => ({
//     ...designStyle(theme),
//     ...autosuggestReactStyle(theme)
//   }),
//   { withTheme: true }
// )(Design);

const mapStateToProps = (state) => {
    return {
        matomo: state.matomo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getMatomoPvid: (pageType) => dispatch(getMatomoPvid(pageType))
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
    withStyles(
        (theme) => ({
            ...designStyle(theme),
            ...autosuggestReactStyle(theme)
        }),
        { withTheme: true }
    )(Design)
);
