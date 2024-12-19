import React from 'react';
import PropTypes from "prop-types";
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { getRoute } from "utils.js";

import withStyles from "@material-ui/core/styles/withStyles";
import Accordion from "components/Accordion/Accordion.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Button from "@material-ui/core/Button";
import SweetAlert from "react-bootstrap-sweetalert";

import Autosuggest from 'react-autosuggest';

import AddIcon from "@material-ui/icons/Add";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";
import RestoreIcon from "@material-ui/icons/Restore";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import DescriptionIcon from "@material-ui/icons/Description";
import DeleteIcon from "@material-ui/icons/Delete";
import CodeIcon from "@material-ui/icons/Code";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import ListIcon from "@material-ui/icons/List";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import CommentIcon from "@material-ui/icons/Comment";
import CallToActionIcon from "@material-ui/icons/CallToAction";
import GetAppIcon from "@material-ui/icons/GetApp";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ListSubHeader from "@material-ui/core/ListSubheader";
import AddAlert from "@material-ui/icons/AddAlert";
import NotificationsActive from "@material-ui/icons/NotificationsActive";
import NotificationImportant from "@material-ui/icons/NotificationImportant";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import Icon from "@material-ui/core/Icon";

import * as SRD from "storm-react-diagrams";

// import the custom models
import { DesignNodeModel } from "components/DesignWidget/DesignNodeModel.js";
import { DesignNodeFactory } from "components/DesignWidget/DesignNodeFactory.jsx";

//Codex components
import CodexDataProvider, { CODEX_API_GET, CODEX_API_ACTION } from "views/CRUD/CodexDataProvider.jsx";
import ProjectNotebooks from "views/Blueprints/ProjectNotebooks.jsx";
import DraggableItemTypes from "views/Blueprints/DraggableItemTypes.js";
import DraggableChip from "views/Blueprints/DraggableChip.jsx";
import DesignDroppable from "views/Blueprints/DesignDroppable.jsx";
import DesignModules from "views/Blueprints/DesignModules.jsx";
import WidgetComponents from "views/Blueprints/WidgetComponents.jsx";
import Attachments from "views/Blueprints/Attachments.jsx";
import WidgetAttachments from "views/Widgets/Attachments.jsx";
import ProjectComments from "views/Blueprints/ProjectComments.jsx";
import WidgetArtifactsView from "views/Blueprints/WidgetArtifactsView.jsx";
import WidgetCode from "views/Blueprints/WidgetCode.jsx";
import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

import buttonStyle from "assets/jss/material-dashboard-pro-react/components/buttonStyle.jsx";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import autosuggestStyle from "assets/jss/autosuggest-react.jsx";
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";
import projectStyle from "assets/jss/projectStyle.jsx";
import statusIconStyle from "assets/jss/statusIconStyle.jsx";
import breadcrumbStyle from "assets/jss/breadcrumbStyle.jsx";

require("storm-react-diagrams/dist/style.min.css");

let _ = require("underscore");

class Design extends React.Component {
  constructor(props) {
    super(props);

    this.user_info = JSON.parse(sessionStorage.getItem('user_info'));

    this.engine = new SRD.DiagramEngine({
      registerDefaultDeleteItemsAction: false
    });
    this.engine.installDefaultFactories();

    // register some other factories as well
    this.engine.registerNodeFactory(new DesignNodeFactory());

    this.model = new SRD.DiagramModel();
    this.model.setGridSize(25);
    this.setupListeners();
    this.engine.setDiagramModel(this.model);

    var project_id = false;
    var parent_project_id = false;
    if (props.match.params.project_id) {
      if (props.match.params.case_study_id) {
        project_id = props.match.params.case_study_id;
        parent_project_id = props.match.params.project_id;
      } else {
        project_id = props.match.params.project_id;
      }
    }

    this.state = {
      project_id: project_id,
      parent_project_id: parent_project_id,
      project_name: false,
      assignees: false,
      reviewer: false,
      is_instance: false,
      loading: false,
      loading_blueprint: false,
      loading_artifacts: false,
      loading_widgets: false,
      item_selected: false,
      show_widgets: false,
      show_saved_notification: false,
      show_download_notification: false,
      show_download_error_notification: false,
      show_unsaved_changes: false,
      saving: false,
      design_metadata: false,
      item_in_edit: false,
      item_comment_count: 0,
      artifact_data: {},
      casestudy_count: 0,
      comment_count: 0,
      item_in_results: false,
      notebooks: false,
      attachments: false,
      comments_data: [],
      clone_enabled: false,
      //Widget autocomplete
      widget_autocomplete_value: '',
      widget_autocomplete_options: []
    };
  }

  get_project_details = () => {
    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_GET,
      {
        resource: "projects",
        action: this.state.project_id,
        callback: "onResponseGetDetails"
      },
      this,
      false
    );
  }

  onResponseGetDetails = (crud, response_data) => {
    var project_details = response_data['data'];
    this.setState({
      loading: false,
      project_id: project_details['id'],
      project_name: project_details['name'],
      assignees: project_details['assignees'],
      reviewer: project_details['reviewer'],
      is_instance: project_details['is_instance']
    });

    this.refresh_data();
  }

  refresh_data = () => {
    this.setState({
      loading_blueprint: true,
      loading_widgets: true
    });

    CodexDataProvider(
      CODEX_API_GET,
      {
        resource: "projects/get-project-blueprint",
        action: this.state.project_id,
        callback: "onResponseGetDesign"
      },
      this,
      false
    );

    this.refresh_artifact_summary();

    CodexDataProvider(
      CODEX_API_GET,
      {
        resource: "projects",
        action: "widgets",
        callback: "onResponseGetWidgets"
      },
      this,
      false
    );
  }

  refresh_artifact_summary = () => {
    this.setState({
      loading_artifacts: true
    });


    CodexDataProvider(
      CODEX_API_GET,
      {
        resource: "projects/get-project-artifacts",
        action: this.state.project_id,
        callback: "onResponseGetArtifacts"
      },
      this,
      false
    );
  }

  componentWillMount() {
    this.get_project_details();
  }

  /**
   * React Diagrams Model listeners
   */
  diagramNodesUpdated = (node_details) => {
    // console.log('CODEX | Design | Diagram Nodes updated: ');
    // console.log(node_details);
    this.setState({
      show_unsaved_changes: true
    });
  }

  diagramLinksUpdated = (node_details) => {
    // console.log('CODEX | Design | Diagram Links updated: ');
    // console.log(node_details);
    this.setState({
      show_unsaved_changes: true
    });
  }

  diagramOffsetUpdated = (node_details) => {
    // console.log('CODEX | Design | Diagram Offset updated: ');
    // console.log(node_details);
    this.setState({
      show_unsaved_changes: true
    });
  }

  diagramZoomUpdated = (node_details) => {
    // console.log('CODEX | Design | Diagram Zoom updated: ');
    // console.log(node_details);
    this.setState({
      show_unsaved_changes: true
    });
  }

  diagramGridUpdated = (node_details) => {
    // console.log('CODEX | Design | Diagram Grid updated: ');
    // console.log(node_details);
    this.setState({
      show_unsaved_changes: true
    });
  }

  diagramSelectionChanged = (node_details) => {
    // console.log('CODEX | Design | Diagram Selection changed: ');
    // console.log(node_details);
  }

  diagramEntityRemoved = (node_details) => {
    // console.log('CODEX | Design | Diagram Entity removed: ');
    // console.log(node_details);
    this.setState({
      show_unsaved_changes: true
    });
  }

  nodeSelectionChanged = (node_details) => {
    // console.log('CODEX | Design | Node Selection changed: ');
    // console.log(node_details);

    var selected_items = this.model.getSelectedItems();

    var selected_nodes = _.filter(selected_items, function(selected_item) {
      return selected_item instanceof DesignNodeModel;
    });

    if (selected_nodes.length === 1 && node_details.isSelected) {
      this.setState({
        item_selected: {
          id: selected_nodes[0].id,
          name: selected_nodes[0].name,
          extras: selected_nodes[0].extras
        },
        clone_enabled: false
      });
    } else if(selected_items.length > 0) {
      this.setState({
        item_selected: false,
        item_comment_count: 0,
        clone_enabled: true
      });
    } else {
      this.setState({
        item_selected: false,
        item_comment_count: 0,
        clone_enabled: false
      });
    }
  }

  nodeEntityRemoved = (node_details) => {
    // console.log('CODEX | Design | Node Entity removed: ');
    // console.log(node_details);
    this.setState({
      show_unsaved_changes: true,
      item_selected: false
    });
  }

  nodeNameChange = (node_id, node_name) => {
    var selected_item = _.find(this.model.nodes, function(node_item) {
      return node_item.id === node_id;
    });

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
  }

  nodeBaseWidgetChange = (node_id, dropdown_id) => {
    var details = dropdown_id.split('_');
    var base_widget_group_id = details[0];
    var base_widget_id = details[1];

    var selected_item = _.find(this.model.nodes, function(node_item) {
      return node_item.id === node_id;
    });

    var selected_base_widget = _.find(this.state.widgets, function(widget) {
      return widget.id === parseInt(base_widget_id);
    });

    var selected_widget_group = _.find(this.state.widget_groups, function(widget_type) {
      return widget_type.id === parseInt(base_widget_group_id);
    });

    if (selected_item) {
      var node_extras = {
        widget_type: base_widget_group_id,
        widget_name: selected_base_widget.name,
        widget_id: base_widget_id
      };

      selected_item.extras = node_extras;
      selected_item.light_color = selected_widget_group.light_color;
      selected_item.dark_color = selected_widget_group.dark_color;

      var item_selected_state = this.state.item_selected;
      item_selected_state.extras = node_extras;

      this.setState({
        item_selected: item_selected_state,
        show_unsaved_changes: true
      });
    }
  }

  nodeWidthChange = (node_id, node_width) => {
    var selected_item = _.find(this.model.getSelectedItems(), function(node_item) {
      return node_item.id === node_id;
    });

    if (selected_item) {
      selected_item.node_width = node_width;
      var item_selected_state = this.state.item_selected;
      item_selected_state.extras.node_width = node_width;
      this.setState({
        item_selected: item_selected_state,
        show_unsaved_changes: true
      });

      this.engine.repaintCanvas();
    }
  }

  nodeHeightChange = (node_id, node_height) => {
    var selected_item = _.find(this.model.getSelectedItems(), function(node_item) {
      return node_item.id === node_id;
    });

    if (selected_item) {
      selected_item.node_height = node_height;
      var item_selected_state = this.state.item_selected;
      item_selected_state.extras.node_height = node_height;
      this.setState({
        item_selected: item_selected_state,
        show_unsaved_changes: true
      });

      this.engine.repaintCanvas();
    }
  }

  nodeColorChange = (node_id, node_color) => {
    var selected_item = _.find(this.model.getSelectedItems(), function(node_item) {
      return node_item.id === node_id;
    });

    if (selected_item) {
      selected_item.node_color = node_color;
      var item_selected_state = this.state.item_selected;
      item_selected_state.extras.node_color = node_color;
      this.setState({
        item_selected: item_selected_state,
        show_unsaved_changes: true
      });

      this.engine.repaintCanvas();
    }
  }

  nodeFontColorChange = (node_id, title_color) => {
    var selected_item = _.find(this.model.getSelectedItems(), function(node_item) {
      return node_item.id === node_id;
    });

    if (selected_item) {
      selected_item.title_color = title_color;
      var item_selected_state = this.state.item_selected;
      item_selected_state.extras.title_color = title_color;
      this.setState({
        item_selected: item_selected_state,
        show_unsaved_changes: true
      });

      this.engine.repaintCanvas();
    }
  }

  deleteNode = () => {
    var selected_item = _.find(this.model.nodes, function(node_item) {
      return node_item.id === this.state.item_selected['id'];
    }, this);

    if (selected_item) {
      this.model.clearSelection();
      selected_item.remove();
      this.engine.repaintCanvas();
    }
  }

  closeNodeDetails = () => {
    this.model.clearSelection();
    this.setState({
      item_in_edit: false
    });
  }

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

    _.each(this.model.getNodes(), function(diagram_node) {
      diagram_node.addListener({
        selectionChanged: this.nodeSelectionChanged,
        entityRemoved: this.nodeEntityRemoved,
      });

      if (this.state.comments_data) {
        var count_data = _.countBy(this.state.comments_data, function(comment) {
          return comment['widget_id'] === diagram_node.id;
        });

        diagram_node.comments_count = count_data[true];
      } else {
        diagram_node.comments_count = 0;
      }

      if(this.state.artifact_data) {
        diagram_node.attachments_count = this.state.artifact_data[diagram_node.id] ? this.state.artifact_data[diagram_node.id] : 0;
      }

      _.each(diagram_node.ports, function(diagram_port) {
        diagram_port.label = '';
      });
    }, this);
  }

  executeWidgets = () => {
    _.each(this.model.getNodes(), function(diagram_node) {
      var in_port = _.find(diagram_node.ports, function(diagram_port) {
        return diagram_port.in;
      });

      var out_port = _.find(diagram_node.ports, function(diagram_port) {
        return !diagram_port.in;
      });

      if (in_port || out_port) {
        if (in_port) {
          if (_.keys(in_port.links).length === 0 && !diagram_node.execution_processing && !diagram_node.execution_success) {
            diagram_node.execution_processing = true;
          } else if (!diagram_node.execution_success) {
            var found_unfinished_upstream = _.find(in_port.links, function(in_link) {
              return !in_link.sourcePort.parent.execution_success;
            });

            if (!found_unfinished_upstream) {
              diagram_node.execution_processing = true;
              this.engine.repaintCanvas();
              setTimeout(
                function() {
                  this.parentObj.updateNodeStatus(this.widget_id);
                }.bind({ parentObj: this, widget_id: diagram_node.id }),
                ((Math.random())*5000)
              );
            }
          }
        } else if(!diagram_node.execution_processing && !diagram_node.execution_success && !in_port) {
          diagram_node.execution_processing = true;
          this.engine.repaintCanvas();
          setTimeout(
            function() {
              this.parentObj.updateNodeStatus(this.widget_id);
            }.bind({ parentObj: this, widget_id: diagram_node.id }),
            ((Math.random())*5000)
          );
        }
      }
    }, this);
  }

  updateNodeStatus = (widget_id) => {
    var found_node = _.find(this.model.getNodes(), function(diagram_node) {
      return diagram_node.id === widget_id;
    });

    if (found_node && found_node.execution_processing) {
      found_node.execution_processing = false;
      found_node.execution_success = true;

      this.engine.repaintCanvas();
      this.executeWidgets();
    }
  }

  onResponseGetWidgets = (crud, response_data) => {
    this.setState({
      widget_groups: response_data['data']['widget_groups'],
      widgets: response_data['data']['widgets'],
      loading_widgets: false
    });
  }

  onResponseGetDesign = (crud, response_data) => {
    var design_data = response_data['data']['data'];

    this.setState({
      casestudy_count: response_data['data']['casestudy_count'],
      comment_count: response_data['data']['comment_count'],
      comments_data: response_data['data']['comments']
    });

    if (design_data) {
      var temp_model = new SRD.DiagramModel();
      temp_model.deSerializeDiagram(design_data, this.engine);

      this.model = temp_model;
      this.model.setGridSize(25);
      this.model.clearListeners();
      this.setupListeners();
      this.engine.setDiagramModel(this.model);
      this.engine.repaintCanvas();
    } else {
      this.setState({
        show_widgets: this.hasEditAccess()
      });
    }

    this.setState({
      loading_blueprint: false
    });
  }

  onResponseGetArtifacts = (crud, response_data) => {
    var artifact_data = response_data['data']['data'];

    this.setState({
      artifact_data: artifact_data,
      loading_artifacts: false
    });

    this.setupListeners();
    this.engine.repaintCanvas();
  }

  updateWidgetArtifacts = () => {
    this.refresh_artifact_summary();
  }

  onDropWidget = (item_details, drop_event) => {
    this.addNode(item_details, this.engine.getRelativeMousePoint(drop_event));
  }

  addNode = (item_details, coords) => {
    var found_widget_type = _.find(this.state.widget_groups, function(widget_type) {
      return item_details.widget_type === widget_type.id || item_details.widget_type === widget_type.code;
    });

    if (!found_widget_type && item_details.widget_type === "CUSTOM") {
      found_widget_type = { label: 'Custom', type: 'CUSTOM', light_color: '#efefef', dark_color: '#b1b1b1' };
    }

    var node = new DesignNodeModel(item_details.label, found_widget_type.dark_color, found_widget_type.light_color);

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
      entityRemoved: this.nodeEntityRemoved,
    });
    node.extras = {
      widget_type: item_details.widget_type,
      widget_name: item_details.label,
      widget_id: item_details.widget_id ? item_details.widget_id : false
    };
    node.comments_count = 0;
    node.attachments_count = 0;

    node.selected = true;
    this.model.clearSelection();
    this.model.addNode(node);

    if (item_details.widget_type === 'CUSTOM' && item_details.widget_id === 'CONTAINER') {
      var new_node_list = {};
      new_node_list[node.id] = node;

      _.each(this.model.nodes, function(node_details, widget_id) {
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
  }

  downloadBlueprint = () => {
    this.setState({
      loading_blueprint: true
    });

    CodexDataProvider(
      CODEX_API_GET,
      {
        resource: "projects/download-code",
        action: this.state.project_id,
        callback: "onResponseDownloadCode"
      },
      this,
      false
    );
  }

  onResponseDownloadCode = (crud, response_data) => {
    if (response_data['data']['url']) {
      this.setState({
        loading_blueprint: false,
        show_download_notification: true
      });

      setTimeout(
        function() {
          this.parentObj.setState({
            show_download_notification: false
          });
        }.bind({ parentObj: this }),
        6000
      );

      window.open(response_data['data']['url'], "_blank");
    } else {
      this.setState({
        loading_blueprint: false,
        show_download_error_notification: true
      });

      setTimeout(
        function() {
          this.parentObj.setState({
            show_download_error_notification: false
          });
        }.bind({ parentObj: this }),
        6000
      );
    }
  }

  saveProjectDesign = () => {
    this.setState({
      saving: true
    });

    CodexDataProvider(
      CODEX_API_ACTION,
      {
        resource: "projects/save-project-blueprint",
        action: this.state.project_id,
        callback: "onResponseSaveDesign",
        request_data: {
          blueprint: this.model.serializeDiagram()
        }
      },
      this,
      false
    );
  }

  onResponseSaveDesign = (crud, response_data) => {
    if (response_data.data.status === 'success') {
      this.setState({
        show_saved_notification: true,
        show_unsaved_changes: false
      });

      setTimeout(
        function() {
          this.parentObj.setState({
            show_saved_notification: false
          });
        }.bind({ parentObj: this }),
        6000
      );
    }

    this.setState({
      saving: false
    });
  }

  getDesignBody = () => {
    const { classes } = this.props;

    return <SRD.DiagramWidget className={classes.projectDesignBody} diagramEngine={this.engine} deleteKeys={[192]} allowCanvasZoom={false} />;
  }

  onEditNode = () => {
    var table_args = false;
    // if (this.state.item_selected.extras && this.state.item_selected.extras.widget_name === 'FACTOR MAP') {
    //   table_args = {
    //     cols: ['Factor', 'Hypothesis']
    //   }
    // }

    this.setState({
      item_in_edit: true,
      item_edit_table_args: table_args
    });
  }

  onShowResults = () => {
    this.setState({
      item_in_results: true
    });
  }

  closeResultsDialog = () => {
    this.setState({
      item_in_results: false
    });
  }

  onCodeNode = () => {
    this.setState({
      item_in_code: true
    });
  }

  closeCodeDialog = () => {
    this.setState({
      item_in_code: false
    });
  }

  showWidgets = () => {
    this.model.clearSelection();

    this.setState({
      show_widgets: true,
      item_selected: false
    });
  }

  closeWidgets = () => {
    this.setState({
      show_widgets: false
    });
  }

  hasEditAccess = () => {
    var my_projects_check = (this.state.assignees.includes(this.user_info.user_id) || this.state.reviewer === this.user_info.user_id);

    if (this.state.is_instance) {
      return this.user_info.feature_access['all_projects'] ? true : (((this.user_info.feature_access['my_projects'] || this.user_info.feature_access['my_projects_only']) && my_projects_check) || this.user_info.feature_access['case_studies']);
    } else {
      return this.user_info.feature_access['all_projects'] ? true : ((this.user_info.feature_access['my_projects'] || this.user_info.feature_access['my_projects_only']) && my_projects_check);
    }
  }

  clearChanges = () => {
    this.refresh_data();
    this.setState({
      show_unsaved_changes: false
    });
  }

  zoomToFit = () => {
    this.engine.zoomToFit();
  }

  zoomOut = () => {
    this.model.setZoomLevel(this.model.getZoomLevel() - 10);
    this.engine.repaintCanvas();
  }

  zoomIn = () => {
    this.model.setZoomLevel(this.model.getZoomLevel() + 10);
    this.engine.repaintCanvas();
  }

  onCopyNode = () => {
    var selected_item = _.find(this.model.nodes, function(node_item) {
      return node_item.id === this.state.item_selected.id;
    }, this);

    if (selected_item) {
      this.addNode(
        {
          widget_type: selected_item.extras.widget_type,
          label: selected_item.extras.widget_name + ' - Copy',
          widget_id: selected_item.extras.widget_id ? selected_item.extras.widget_id : false,
        },
        {
          x: selected_item.x + 20,
          y: selected_item.y + 20,
        });
    }
  }

  showNotebooks = () => {
    this.setState({
      notebooks: true
    });
  }

  closeNotebooks = () => {
    this.setState({
      notebooks: false
    });
  }

  showAttachments = () => {
    this.setState({
      attachments: true
    });
  }

  hideAttachments = () => {
    this.setState({
      attachments: false
    });
  }

  showComments = () => {
    this.setState({
      comments: true
    });
  }

  hideComments = () => {
    this.setState({
      comments: false
    });
  }

  cloneSelected = () => {
    var selected_items = this.model.getSelectedItems();

    // var selected_nodes = _.filter(selected_items, function(selected_item) {
    //   return selected_item instanceof DesignNodeModel;
    // });

    // var selected_links = _.filter(selected_items, function(selected_item) {
    //   return selected_item instanceof SRD.LinkModel;
    // });

    var item_map = {};
    _.each(selected_items, function(selected_item) {
      var new_item = selected_item.clone(item_map);

			// offset the nodes slightly
			if (new_item instanceof DesignNodeModel) {
        new_item.setPosition(new_item.x + 100, new_item.y + 100);
        new_item.attachment_count = 0;
        new_item.comment_count = 0;
        new_item.addListener({
          selectionChanged: this.nodeSelectionChanged,
          entityRemoved: this.nodeEntityRemoved,
        });
				this.model.addNode(new_item);
			} else if (new_item instanceof SRD.LinkModel) {
				// offset the link points
				new_item.getPoints().forEach(p => {
					p.updateLocation({ x: p.getX() + 100, y: p.getY() + 100 });
				});
				this.model.addLink(new_item);
			}
      new_item.selected = true;
      selected_item.selected = false;
    }, this);

    this.engine.repaintCanvas();
  }

  updateSelectedItemCommentCount = (count) => {
    this.setState({
      item_comment_count: count
    });
  }

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
  }

  onAddWidgetFromAutoComplete = (widget_id) => {
    var widget_details = _.find(this.state.widgets, function(widget) {
      return widget.id === widget_id;
    });

    var widget_group_details = _.find(this.state.widget_groups, function(widget_group) {
      return widget_group.id === widget_details.group_id;
    });

    this.addNode({
      label: widget_details.name,
      widget_type: widget_group_details.id,
      widget_id: widget_details.id,
      type: DraggableItemTypes.WIDGET
    }, {
      x: 100 + this.model.getOffsetX(),
      y: 100 + this.model.getOffsetY()
    });
  }

  getWidgetOptions = ({ value }) => {
    value = value.trim();
    var autocomplete_options = _.map(this.state.widget_groups, function(widget_group) {
      var filtered_widgets = _.filter(this.state.widgets, function(widget) {
        return widget_group.id === widget.group_id &&
          (widget.name.toLowerCase().startsWith(value.toLowerCase()) || widget.name.toLowerCase().includes(' ' + value.toLowerCase()));
      });

      return {
        id: widget_group.id,
        name: widget_group.name,
        widgets: _.map(filtered_widgets, function(filtered_widget) {
          return {
            id: filtered_widget.id,
            name: filtered_widget.name
          };
        })
      };
    }, this);

    this.setState({
      widget_autocomplete_options: _.filter(autocomplete_options, function(autocomplete_option) {
        return autocomplete_option.widgets.length > 0;
      })
    });
  }

  clearWidgetOptions = () => {
    this.setState({
      widget_autocomplete_options: []
    });
  }

  getWidgetOptionValue = (option) => {
    return option.id;
  }

  renderWidgetOption = (option) => {
    return option.name;
  }

  renderWidgetOptionTitle = (option) => {
    return option.name;
  }

  getWidgetGroupOptions = (widget_group) => {
    return widget_group.widgets;
  }

  renderProjectHeader = () => {
    const { classes } = this.props;

    var casestudy_count = this.state.casestudy_count === 0 ? '' : ' (' + this.state.casestudy_count + ')';
    var comment_count = this.state.comment_count === 0 ? '' : ' (' + this.state.comment_count + ')';
    var attachment_count = this.state.artifact_data && this.state.artifact_data['main'] ? ' (' + this.state.artifact_data['main'] + ')' : '';

    var notebooks_path = "projects/" + this.state.project_id + "/notebooks";
    if (this.state.parent_project_id) {
      notebooks_path = "projects/" + this.state.parent_project_id + "/case-studies/" + this.state.project_id + "/notebooks";
    }

    return (
      <div>
        <div className={classes.floatLeft}>
          <h3 style={{ marginTop: '0px' }}>{this.state.project_name}</h3>
        </div>
        {this.state.is_instance ? (
          ''
        ) : (
          <Button color="primary" href={getRoute("projects/" + this.state.project_id + "/case-studies")}>
            <ListIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Case Studies{casestudy_count}</span>
          </Button>
        )}
        {this.state.is_instance ? (
          ''
        ) : (
          this.hasEditAccess() ? (
            <Button color="primary" href={getRoute("projects/" + this.state.project_id + "/case-studies/add")}>
              <AddIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Create Case Study</span>
            </Button>
          ) : (
            ''
          )
        )}
        <Button color="primary" onClick={() => this.showAttachments()}>
          <AttachFileIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Attachments{attachment_count}</span>
        </Button>
        <Button color="primary" onClick={() => this.showComments()}>
          <CommentIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Comments{comment_count}</span>
        </Button>
        <Button color="primary" href={getRoute(notebooks_path)}>
          <DescriptionIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Notebooks</span>
        </Button>
        <br clear="all"/>
      </div>
    );
  }

  renderBlueprintHeader = () => {
    const { classes } = this.props;

    return (
      <div style={{ marginBottom: '8px'}}>
        {this.hasEditAccess() ? (
          <Button color="primary" onClick={() => this.showWidgets()}>
            <AddIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Add Widgets</span>
          </Button>
        ) : ''}
        <Button color="primary" onClick={() => this.zoomToFit()}>
          <ZoomOutMapIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Zoom to FIT</span>
        </Button>
        <Button color="primary" onClick={() => this.zoomOut()}>
          <ZoomOutIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Zoom OUT</span>
        </Button>
        <Button color="primary" onClick={() => this.zoomIn()}>
          <ZoomInIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Zoom IN</span>
        </Button>
        {this.state.clone_enabled ? (
          <Button color="primary" onClick={() => this.cloneSelected()}>
            <FileCopyIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Clone</span>
          </Button>
        ) : (
          ''
        )}
        <Button color="primary" onClick={() => this.clearChanges()}>
          <RestoreIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Clear changes</span>
        </Button>
        {this.hasEditAccess() ? (
          <Button className={this.state.show_unsaved_changes ? classes.warning : ''} color="primary" onClick={() => this.saveProjectDesign()}>
            <SaveIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>{this.state.show_unsaved_changes ? 'Save unsaved changes' : 'Save'}</span>
          </Button>
        ) : ''}
        <Button color="primary" onClick={() => this.executeWidgets()}>
          <CallToActionIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Execute</span>
        </Button>
        <Button color="primary" onClick={() => this.downloadBlueprint()}>
          <GetAppIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Download</span>
        </Button>
        <br clear="all"/>
      </div>
    );
  }

  renderAddWidgetSearch = () => {
    const inputProps = {
      placeholder: "Type to search",
      value: this.state.widget_autocomplete_value,
      onChange: this.onChangeWidgetAutocomplete
    };

    return (
      <Autosuggest
        multiSection={true}
        suggestions={this.state.widget_autocomplete_options}
        onSuggestionsFetchRequested={this.getWidgetOptions}
        onSuggestionsClearRequested={this.clearWidgetOptions}
        getSuggestionValue={this.getWidgetOptionValue}
        renderSuggestion={this.renderWidgetOption}
        renderSectionTitle={this.renderWidgetOptionTitle}
        getSectionSuggestions={this.getWidgetGroupOptions}
        inputProps={inputProps} />
    )
  }

  renderAddWidgetSections = () => {
    var widget_types = _.map(this.state.widget_groups, function(widget_type) {
      var widgets = _.filter(this.state.widgets, function(widget) {
        return widget.group_id === widget_type.id;
      });

      var widget_type_options = _.map(widgets, function(widget_type_option) {
        return <DraggableChip
                key={"draggable_widget_" + widget_type_option.id}
                parent_obj={this}
                color={widget_type.dark_color}
                widget_type={widget_type.id}
                widget_id={widget_type_option.id}
                label={widget_type_option.name}
                />
      }, this);

      return {
        title: widget_type.name,
        content: (
          <div style={{ width: '100%', paddingRight: '25px', maxHeight: '250px', overflowY: 'auto' }}>
            {widget_type_options}
            <br clear="all" />
          </div>
        )
      }
    }, this);

    widget_types.push({
      title: "Custom",
      content: (
        <div style={{ width: '100%', paddingRight: '25px' }}>
          <DraggableChip
            key={"draggable_widget_container"}
            parent_obj={this}
            color={"#b1b1b1"}
            widget_type={"CUSTOM"}
            widget_id={"CONTAINER"}
            label={"Container"}
          />
          <DraggableChip
            key={"draggable_widget_placeholder"}
            parent_obj={this}
            color={"#b1b1b1"}
            widget_type={"CUSTOM"}
            widget_id={"PLACEHOLDER"}
            label={"Placeholder"}
          />
          <br clear="all" />
        </div>
      )
    });

    return widget_types;
  }

  renderNodeDetails = () => {
    const { classes } = this.props;

    return (
      <div style={{ float: 'right', width: '325px', marginLeft: '8px' }}>
        <Card className={classes.card} style={{ height: '100%' }}>
          <CardBody>
            <div>
              {this.state.artifact_data[this.state.item_selected.id] && this.state.artifact_data[this.state.item_selected.id] > 0 ? (
                <Button color="primary" onClick={() => this.onShowResults()}>
                  <EqualizerIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Results</span>
                </Button>
              ) : (
                ""
              )}
              <Button color="primary" onClick={() => this.onCodeNode()}>
                <CodeIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Code</span>
              </Button>
              <Button color="primary" onClick={() => this.onCopyNode()}>
                <FileCopyIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Clone</span>
              </Button>
              <br clear="all"/>
              {this.hasEditAccess() ? (
                <Button color="secondary" onClick={() => this.deleteNode()}>
                  <DeleteIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Delete Node</span>
                </Button>
              ) : ''}
              <Button color="secondary" onClick={() => this.closeNodeDetails()}>
                <CancelIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Close</span>
              </Button>
              <br clear="all"/>
              <Accordion
                active={0}
                collapses={[
                  {
                    title: 'Details',
                    content: this.getNodeDetailsAccordion(),
                    expanded: true
                  },
                  {
                    title: 'Attachments' + (this.state.artifact_data[this.state.item_selected.id] && this.state.artifact_data[this.state.item_selected.id] > 0 ? ' (' + this.state.artifact_data[this.state.item_selected.id] + ')' : ''),
                    content: <Attachments
                      key={'attachments_' + this.state.item_selected.id}
                      parent_obj={this} classes={classes}
                      widget_id={this.state.item_selected.id} project_id={this.state.project_id}
                      readonly={!this.hasEditAccess()}
                    />
                  },
                  {
                    title: 'Comments' + (this.state.item_comment_count > 0 ? ' (' + this.state.item_comment_count + ')' : ''),
                    content: <ProjectComments
                      key={'project_comments'} parent_obj={this} classes={classes}
                      project_id={this.state.project_id} widget_id={this.state.item_selected.id}
                    />
                  },
                  {
                    title: 'Components',
                    content: <WidgetComponents widget_id={this.state.item_selected.extras.widget_id} />
                  },
                  {
                    title: 'Base Attachments',
                    content: <WidgetAttachments
                      key={'widget_attachments_' + this.state.item_selected.id}
                      parent_obj={this} classes={classes}
                      widget_id={this.state.item_selected.extras.widget_id}
                      readonly={true}
                    />
                  },
                ]}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  getNodeDetailsAccordion = () => {
    const { classes } = this.props;

    var node_widget_column_options = [];
    _.each(this.state.widget_groups, function(widget_type) {
      var widgets = _.map(
        _.filter(this.state.widgets, function(widget) {
          return widget.group_id === widget_type.id;
        }), function(filtered_widget) {
          return (
            <MenuItem
              key={"node_widget_type_" + filtered_widget.id}
              value={widget_type.id + '_' + filtered_widget.id}
              classes={{
                root: classes.selectMenuItem
              }}
            >
              {filtered_widget.name}
            </MenuItem>
          );
        });

      node_widget_column_options.push((
        <ListSubHeader key={widget_type.name}>{widget_type.name}</ListSubHeader>
      ));
      node_widget_column_options.push(widgets);
    }, this);

    return (
      <div>
        {this.hasEditAccess() ? (
          <div>
            <CustomInput
              key={'node_' + this.state.item_selected['id']}
              labelText={'Name *'}
              id={'node_' + this.state.item_selected['id']}
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                onChange: event => this.nodeNameChange(this.state.item_selected['id'], event.target.value),
                type: 'text',
                value: this.state.item_selected['name']
              }}
            />
            {this.state.item_selected.extras.widget_type === 'CUSTOM' ? (
              ''
            ) : (
              <FormControl
                fullWidth
                className={classes.selectFormControl}
              >
                <InputLabel
                  htmlFor={'node_widget_type_' + this.state.item_selected['id']}
                  className={classes.selectLabel}
                >
                  {"Base Widget"}
                </InputLabel>
                <Select
                  MenuProps={{
                    className: classes.selectMenu
                  }}
                  classes={{
                    select: classes.select
                  }}
                  value={this.state.item_selected.extras['widget_type'] + '_' + this.state.item_selected.extras['widget_id']}
                  onChange={event => this.nodeBaseWidgetChange(this.state.item_selected['id'], event.target.value)}
                  inputProps={{
                    name: 'node_widget_type_' + this.state.item_selected['id'],
                    id: 'node_widget_type_' + this.state.item_selected['id']
                  }}
                  autoWidth={true}
                >
                  <MenuItem
                    key={"node_widget_type-disabled"}
                    disabled
                    value=""
                    classes={{
                      root: classes.selectMenuItem
                    }}
                  >
                    Widget Name
                  </MenuItem>
                  {node_widget_column_options}
                </Select>
              </FormControl>
            )}
            <br clear="all" />
          </div>
        ) : ''}
        {this.hasEditAccess() && this.state.item_selected.extras.widget_type === 'CUSTOM' && this.state.item_selected.extras.widget_id === 'CONTAINER' ? (
          <div>
            <CustomInput
              key={'node_width_' + this.state.item_selected['id']}
              labelText={'Width'}
              id={'node_width_' + this.state.item_selected['id']}
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                onChange: event => this.nodeWidthChange(this.state.item_selected['id'], event.target.value),
                type: 'text',
                value: this.state.item_selected.extras['node_width']
              }}
            />
            <CustomInput
              key={'node_height_' + this.state.item_selected['id']}
              labelText={'Height'}
              id={'node_height_' + this.state.item_selected['id']}
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                onChange: event => this.nodeHeightChange(this.state.item_selected['id'], event.target.value),
                type: 'text',
                value: this.state.item_selected.extras['node_height']
              }}
            />
            <CustomInput
              key={'node_color_' + this.state.item_selected['id']}
              labelText={'Color - HEX'}
              id={'node_color_' + this.state.item_selected['id']}
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                onChange: event => this.nodeColorChange(this.state.item_selected['id'], event.target.value),
                type: 'text',
                value: this.state.item_selected.extras['node_color']
              }}
            />
            <CustomInput
              key={'title_color_' + this.state.item_selected['id']}
              labelText={'Title Color - HEX'}
              id={'title_color_' + this.state.item_selected['id']}
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                onChange: event => this.nodeFontColorChange(this.state.item_selected['id'], event.target.value),
                type: 'text',
                value: this.state.item_selected.extras['title_color']
              }}
            />
            <br clear="all" />
          </div>
        ) : ''}
      </div>
    )
  }

  renderAddWidgets = () => {
    const { classes } = this.props;

    return (
      <div style={{ float: 'right', width: '325px', marginLeft: '8px' }}>
        <Card className={classes.card} style={{ height: '100%' }}>
          <CardBody>
            <div>
              <h3 className={classes.floatLeft}>Widget options</h3>
              <div className={classes.floatRight} style={{ marginTop: '20px' }}>
                <Button color="secondary" onClick={() => this.closeWidgets()}>
                  <CancelIcon className={classes.icons} /><span style={{ paddingLeft: '2px' }}>Close</span>
                </Button>
              </div>
              <br clear="all"/>
              {this.state.loading_widgets ? (
                <OrangeLinearProgress />
              ) : (
                <div>
                  {this.renderAddWidgetSearch()}
                  <Accordion
                    collapses={this.renderAddWidgetSections()}
                  />
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  renderBlueprintBody = () => {
    const { classes } = this.props;

    return (
      <div style={{ width: 'auto', overflow: 'hidden' }}>
        <Card className={classes.card} style={{ height: '100%' }}>
          <CardBody style={{ marginBottom: '35px' }}>
            <DesignDroppable widgets={this.getDesignBody()} parent_obj={this} />
          </CardBody>
        </Card>
      </div>
    );
  }

  render() {
    const { classes } = this.props;

    var design_path = "projects/" + this.state.project_id + "/design";
    if (this.state.parent_project_id) {
      design_path = "projects/" + this.state.parent_project_id + "/case-studies/" + this.state.project_id + "/design";
    }

    return this.state.loading ? (
        <OrangeLinearProgress />
      ) : (this.state.notebooks ? <ProjectNotebooks project_id={this.state.project_id} project_name={this.state.project_name} parent_obj={this} /> : (
          <div>
            <BreadcrumbsItem to={getRoute(design_path)}>
              <span className={classes.breadcrumbItemIconContainer}>
                <Icon className={classes.breadcrumbIcon}>account_tree</Icon>
                {this.state.project_name}
              </span>
            </BreadcrumbsItem>
            {this.renderProjectHeader()}

            <DesignModules parent_obj={this} project_id={this.state.project_id} hasEditAccess={this.hasEditAccess()} />

            <div style={{ position: 'relative' }}>
              {this.renderBlueprintHeader()}

              {this.state.loading_blueprint || this.state.loading_artifacts || this.state.saving ? (
                <OrangeLinearProgress />
              ) : (
                ''
              )}

              <div>
                {this.state.item_selected ?
                  this.renderNodeDetails() :
                  this.state.show_widgets ? this.renderAddWidgets() : ''}

                {this.renderBlueprintBody()}
              </div>
            </div>

            {this.state.item_selected && this.state.item_in_results ? (
              <WidgetArtifactsView parent_obj={this} classes={classes} widget_id={this.state.item_selected.id} project_id={this.state.project_id} />
            ) : (
              ''
            )}

            {this.state.item_selected && this.state.item_in_code ? (
              <WidgetCode parent_obj={this} classes={classes} widget_id={this.state.item_selected.id} project_id={this.state.project_id} base_widget_id={this.state.item_selected.extras.widget_id} />
            ) : (
              ''
            )}

            <Snackbar
              place="bc"
              color="success"
              icon={AddAlert}
              message={"Design blueprint saved successfully !"}
              open={this.state.show_saved_notification}
              closeNotification={() =>
                this.setState({ show_saved_notification: false })
              }
              close
            />

            <Snackbar
              place="bc"
              color="success"
              icon={NotificationsActive}
              message={"Blueprint downloaded successfully !"}
              open={this.state.show_download_notification}
              closeNotification={() =>
                this.setState({ show_download_notification: false })
              }
              close
            />

            <Snackbar
              place="bc"
              color="danger"
              icon={NotificationImportant}
              message={"Blueprint download error !"}
              open={this.state.show_download_error_notification}
              closeNotification={() =>
                this.setState({ show_download_error_notification: false })
              }
              close
            />

            {this.state.attachments ? (
              <SweetAlert
                // success
                customClass={classes.higherAlert}
                title="Attachments"
                showConfirm={false}
                onConfirm={() => { return false; }}
                onCancel={() => this.hideAttachments()}
                confirmBtnCssClass={classes.button + " " + classes.codxDark}
              >
                <Attachments key={'project_attachments'} parent_obj={this} classes={classes} project_id={this.state.project_id} />
              </SweetAlert>
            ) : ''}

            {this.state.comments ? (
              <SweetAlert
                // success
                customClass={classes.higherAlert}
                title="Comments"
                showConfirm={false}
                onConfirm={() => { return false; }}
                onCancel={() => this.hideComments()}
              >
                <ProjectComments key={'project_comments'} parent_obj={this} classes={classes} project_id={this.state.project_id} widget_id={false} />
              </SweetAlert>
            ) : ''}
          </div>
        ));
  }
}

Design.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles({
  ...projectStyle,
  ...buttonStyle,
  ...customSelectStyle,
  ...sweetAlertStyle,
  ...autosuggestStyle,
  ...statusIconStyle,
  ...breadcrumbStyle
})(Design);

