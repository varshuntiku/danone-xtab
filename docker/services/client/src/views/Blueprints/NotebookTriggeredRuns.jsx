import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { getRoute } from "utils.js";

import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/icons/List";

import CodexCRUD from "views/CRUD/CodexCRUD.jsx";
import breadcrumbStyle from "assets/jss/breadcrumbStyle.jsx";

import Icon from "@material-ui/core/Icon";
import ErrorIcon from "@material-ui/icons/Error";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

class NotebookTriggeredRuns extends React.Component {
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

    var notebook_id = false;
    if (props.match.params.notebook_id) {
      notebook_id = props.match.params.notebook_id;
    }

    this.state = {
      project_id: project_id,
      parent_project_id: parent_project_id,
      notebook_id: notebook_id,
      loading: false,
      no_logs_found: false
    };
  }

  extra_actions = (crud, extra_key, item_id, item_data) => {
    if (extra_key === 'logs') {
      if (item_data && item_data.trigger_run_url) {
        window.open(item_data.trigger_run_url, '_new');
      } else {
        this.setState({
          no_logs_found: true
        });
      }
    }
  }



  render() {
    const { classes, project_name } = this.props;

    var projectnotebooktriggeredruns_params = {};
    if (this.state.project_id && project_name && this.state.notebook_id) {
      var object_name = 'Project Notebook Triggered Runs for ' + project_name;
      var object_plural_name = 'Project Notebook Triggered Runs for ' + project_name;

      var link_prefix = 'projects/' + this.state.project_id + '/notebooks/' + this.state.notebook_id;
      var route_prefix = 'projects/:project_id/notebooks/:notebook_id';

      if (this.state.parent_project_id) {
        link_prefix = 'projects/' + this.state.parent_project_id + '/case-studies/' + this.state.project_id + '/notebooks/' + this.state.notebook_id;
        route_prefix = 'projects/:project_id/case-studies/:case_study_id/notebooks/:notebook_id';
      }

      var fields_list = [
        {
          Header: "Id",
          accessor: "id",
          sortable: true,
          filterable: false,
          type: "text"
        },
        {
          Header: "Status",
          accessor: "trigger_status",
          sortable: true,
          filterable: false,
          type: "text"
        }
      ];

      fields_list.push({
        Header: "Created at",
        accessor: "created_at",
        sortable: true,
        filterable: false,
        type: "text"
      });

      fields_list.push({
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        filterable: false
      });

      projectnotebooktriggeredruns_params = {
        link_prefix: link_prefix,
        route_prefix: route_prefix,
        table_key: 'triggered-runs',
        // selectable: true,
        list: {
          name: object_plural_name,
          name_singular: object_name,
          headers: [],
          url_slug: "project-notebooks/" + this.state.notebook_id + "/triggered-runs"
        },
        add: {
          name: "Add " + object_name
        },
        edit: {
          name: "Edit " + object_name
        },
        fields: {
          list: fields_list
        },
        icon: List,
        actions: {
          add: false,
          edit: false,
          delete: true,
          list: true,
          extra: [
            {
              title: "Logs",
              icon_color: "primary",
              icon: "assignment",
              extra_key: "logs",
              function_call: true
            }
          ]
        },
        auto_refresh_list: true
      };
    }

    var main_path = "projects/" + this.state.project_id + "/notebooks/" + this.state.notebook_id;
    if (this.state.parent_project_id) {
      main_path = "projects/" + this.state.parent_project_id + "/case-studies/" + this.state.project_id + "/notebooks/" + this.state.notebook_id;
    }

    var route_main_path = "projects/:project_id/notebooks/:notebook_id";
    if (this.state.parent_project_id) {
      route_main_path = "projects/:project_id/case-studies/:case_study_id/notebooks/:notebook_id";
    }

    return this.state.loading ? (
      <OrangeLinearProgress />
    ) : (
      <div>
        <BreadcrumbsItem to={getRoute(main_path  + "/triggered-runs")}>
          <span className={classes.breadcrumbItemIconContainer}>
            <Icon className={classes.breadcrumbIcon}>low_priority</Icon>
            Triggered Runs
          </span>
        </BreadcrumbsItem>
        <Switch>
          <Route path={getRoute(route_main_path + "/triggered-runs")} component={() =>
            <CodexCRUD resource={this} params={projectnotebooktriggeredruns_params} />
          }/>
        </Switch>
        {this.state.alert}
        <Snackbar
          place="bc"
          color="danger"
          icon={ErrorIcon}
          message={"No logs found !"}
          open={this.state.no_logs_found}
          closeNotification={() =>
            this.setState({ no_logs_found: false })
          }
          close
        />
      </div>
    );
  }
}

NotebookTriggeredRuns.propTypes = {
  classes: PropTypes.object.isRequired,
  project_name: PropTypes.string.isRequired
};

export default withStyles(breadcrumbStyle)(NotebookTriggeredRuns);
