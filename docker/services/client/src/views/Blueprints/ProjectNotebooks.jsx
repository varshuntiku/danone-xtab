import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { getRoute } from "utils.js";

import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/icons/List";

import NotebookIterations from "views/Blueprints/NotebookIterations.jsx";
import NotebookTriggeredRuns from "views/Blueprints/NotebookTriggeredRuns.jsx";
import AppConfigs from "views/Publish/AppConfigs.jsx";

import CodexCRUD from "views/CRUD/CodexCRUD.jsx";
import breadcrumbStyle from "assets/jss/breadcrumbStyle.jsx";

import Icon from "@material-ui/core/Icon";
import NotificationsActive from "@material-ui/icons/NotificationsActive";
import NotificationImportant from "@material-ui/icons/NotificationImportant";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

import CodexDataProvider, {
  CODEX_API_GET
} from "views/CRUD/CodexDataProvider.jsx";

class ProjectNotebooks extends React.Component {
  constructor(props) {
    super(props);

    this.user_info = JSON.parse(sessionStorage.getItem('user_info'));

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
      loading: true,
      project_nb_id: false,
      results: false,
      show_download_notification: false,
      show_download_error_notification: false
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
      project_name: project_details['name']
    });
  }

  componentWillMount() {
    this.get_project_details();
  }

  extra_actions = (crud, extra_key, project_nb_id) => {
    if (extra_key === "download") {
      this.setState({
        loading: true
      });

      this.downloadJupyterNotebook(project_nb_id);
    }
  }

  downloadJupyterNotebook = (project_nb_id) => {
    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_GET,
      {
        resource: "project-notebooks/download-jupyter-config",
        action: project_nb_id,
        callback: "onDownloadJupyterNotebook"
      },
      this
    );
  }

  onDownloadJupyterNotebook = (crud, response_data) => {
    if (response_data['data']['url']) {
      this.setState({
        loading: false,
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
        loading: false,
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

  back = () => {
    this.setState({
      project_nb_id: false,
      results: false
    });
  }

  render() {
    const { classes } = this.props;

    var projectnotebooks_params = {};
    if (this.state.project_id && this.state.project_name) {
      var object_name = 'Project Notebook for ' + this.state.project_name;
      var object_plural_name = 'Project Notebooks for ' + this.state.project_name;

      projectnotebooks_params = {
        link_prefix: this.state.parent_project_id ? 'projects/' + this.state.parent_project_id + '/case-studies/' + this.state.project_id : 'projects/' + this.state.project_id,
        route_prefix: this.state.parent_project_id ? 'projects/:project_id/case-studies/:case_study_id' : 'projects/:project_id',
        table_key: 'notebooks',
        list: {
          name: object_plural_name,
          name_singular: object_name,
          headers: [],
          url_slug: "project-notebooks/" + this.state.project_id
        },
        add: {
          name: "Add " + object_name
        },
        edit: {
          name: "Edit " + object_name
        },
        fields: {
          list: [
            {
              Header: "Created by",
              accessor: "created_by",
              hide_add: true,
              hide_edit: true,
              is_required: false,
              sortable: false,
              filterable: false,
              type: "text",
            },
            {
              Header: "Created at",
              accessor: "created_at",
              hide_add: true,
              sortable: false,
              filterable: false
            },
            {
              Header: "Last submission at",
              accessor: "latest_config_submitted_at",
              hide_add: true,
              sortable: false,
              filterable: false
            },
            {
              Header: "Actions",
              accessor: "actions",
              sortable: false,
              filterable: false
            }
          ]
        },
        sorted: [
          { id: "latest_config_submitted_at", desc: true },
          { id: "created_at", desc: true }
        ],
        icon: List,
        actions: {
          add: false,
          edit: false,
          delete: false,
          list: true,
          extra: [
            {
              title: "Download",
              icon_color: "primary",
              icon: "get_app",
              extra_key: "download",
              function_call: true
            },
            {
              title: "Iterations",
              icon_color: "primary",
              icon: "low_priority",
              extra_key: "iterations"
            },
            {
              title: "Triggered Runs",
              icon_color: "primary",
              icon: "queue_play_next",
              extra_key: "triggered-runs"
            },
            {
              title: "Applications",
              icon_color: "primary",
              icon: "apps",
              extra_key: "app-configs"
            }
          ]
        }
      };
    }

    var main_path = "projects/" + this.state.project_id;
    if (this.state.parent_project_id) {
      main_path = "projects/" + this.state.parent_project_id + "/case-studies/" + this.state.project_id;
    }

    var route_main_path = "projects/:project_id";
    if (this.state.parent_project_id) {
      route_main_path = "projects/:project_id/case-studies/:case_study_id";
    }

    return this.state.loading ? (
      <OrangeLinearProgress />
    ) : (
      <div>
        <BreadcrumbsItem to={getRoute(main_path  + "/design")}>
          <span className={classes.breadcrumbItemIconContainer}>
            <Icon className={classes.breadcrumbIcon}>account_tree</Icon>
            {this.state.project_name}
          </span>
        </BreadcrumbsItem>
        <BreadcrumbsItem to={getRoute(main_path  + "/notebooks")}>
          <span className={classes.breadcrumbItemIconContainer}>
            <Icon className={classes.breadcrumbIcon}>description</Icon>
            Notebooks
          </span>
        </BreadcrumbsItem>
        <Switch>
          <Route path={getRoute(route_main_path + "/notebooks/:notebook_id/app-configs")} component={AppConfigs} />
          <Route path={getRoute(route_main_path + "/notebooks/:notebook_id/iterations")} component={NotebookIterations} />
          <Route path={getRoute(route_main_path + "/notebooks/:notebook_id/triggered-runs")} component={(props) =>
            <NotebookTriggeredRuns project_name={this.state.project_name} {...props}/>
          } />
          <Route path={getRoute(route_main_path + "/notebooks")} component={() =>
            <CodexCRUD resource={this} params={projectnotebooks_params} />
          }/>
        </Switch>
        {this.state.alert}
        <Snackbar
          place="bc"
          color="warning"
          icon={NotificationsActive}
          message={"Jupyter downloading..."}
          open={this.state.loading}
        />
        <Snackbar
          place="bc"
          color="success"
          icon={NotificationsActive}
          message={"Jupyter downloaded successfully !"}
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
          message={"Jupyter download error !"}
          open={this.state.show_download_error_notification}
          closeNotification={() =>
            this.setState({ show_download_error_notification: false })
          }
          close
        />
      </div>
    );
  }
}

ProjectNotebooks.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(breadcrumbStyle)(ProjectNotebooks);
