import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { getRoute } from "utils.js";

import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/icons/List";

import NotebookResults from "views/Blueprints/NotebookResults.jsx";
import IterationParams from "views/Blueprints/IterationParams.jsx";

import CodexCRUD from "views/CRUD/CodexCRUD.jsx";
import breadcrumbStyle from "assets/jss/breadcrumbStyle.jsx";

import Icon from "@material-ui/core/Icon";
import NotificationsActive from "@material-ui/icons/NotificationsActive";
import NotificationImportant from "@material-ui/icons/NotificationImportant";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

import CodexDataProvider, { CODEX_API_GET } from "views/CRUD/CodexDataProvider.jsx";

let _ = require("underscore");

class NotebookIterations extends React.Component {
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
      project_name: false,
      notebook_id: notebook_id,
      loading: true,
      tags: []
    };
  }

  get_project_details = () => {
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
      project_id: project_details['id'],
      project_name: project_details['name']
    });

    this.getTagNames();
  }

  getTagNames = () => {
    CodexDataProvider(
      CODEX_API_GET,
      {
        resource: "project-notebooks/get-tags",
        action: this.state.notebook_id,
        callback: "onResponseTags"
      },
      this,
      false
    );
  }

  onResponseTags = (crud, response_data) => {
    this.setState({
      loading: false,
      tags: response_data['data']
    });
  }

  componentWillMount() {
    this.get_project_details();
  }

  extra_actions = (crud, extra_key, item_id) => {
    // if (extra_key === 'trigger') {
    //   this.setState({
    //     trigger: true,
    //     trigger_iteration_id: item_id
    //   });
    // }
  }

  render() {
    const { classes } = this.props;

    var projectnotebookiterations_params = {};
    if (this.state.project_id && this.state.project_name && this.state.notebook_id && !this.state.loading) {
      var object_name = 'Project Notebook Iteration for ' + this.state.project_name;
      var object_plural_name = 'Project Notebook Iterations for ' + this.state.project_name;

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
          Header: "Technique",
          accessor: "technique",
          sortable: true,
          filterable: true,
          type: "text"
        },
        {
          Header: "Dep Var",
          accessor: "dep_var",
          sortable: false,
          filterable: true,
          type: "text",
          style: {
            "wordBreak": "break-word"
          }
        },
        {
          Header: "Exog",
          accessor: "exog",
          sortable: false,
          filterable: true,
          type: "text",
          multiple: true,
          double_spacing: true,
          style: {
            "wordBreak": "break-word"
          }
        },
        {
          Header: "Params",
          accessor: "params",
          sortable: false,
          filterable: true,
          type: "text",
          double_spacing: true,
          multiple: true,
          style: {
            "wordBreak": "break-word"
          }
        },
        {
          Header: "Accuracy",
          accessor: "accuracy",
          sortable: true,
          filterable: false,
          type: "text"
        }
      ];

      var unique_tags = this.state.tags;
      // var unique_tags = _.unique(_.map(this.state.tags, function(tag_item) {
      //   return tag_item['tag_key'];
      // }));

      _.each(unique_tags, function(unique_tag_category) {
        fields_list.push({
          Header: unique_tag_category,
          accessor: unique_tag_category.toLowerCase(),
          sortable: false,
          filterable: true,
          type: "text"
        });
      });

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
      })

      projectnotebookiterations_params = {
        link_prefix: link_prefix,
        route_prefix: route_prefix,
        table_key: 'iterations',
        selectable: true,
        list: {
          name: object_plural_name,
          name_singular: object_name,
          headers: [],
          url_resource: "project-notebooks/" + this.state.notebook_id,
          url_action: "get-iterations",
          url_slug: "project-notebooks/" + this.state.notebook_id + "/iterations"
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
              title: "Results",
              icon_color: "primary",
              icon: "assessment",
              extra_key: "results"
            },
            {
              title: "Trigger",
              icon_color: "primary",
              icon: "flash_on",
              extra_key: "trigger"
            },
          ]
        },
        ajaxData: true
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

    return this.state.loading || this.state.trigger_loading ? (
      <div>
        <OrangeLinearProgress />
        <Snackbar
          place="bc"
          color="warning"
          icon={NotificationsActive}
          message={"Queuing iteration trigger..."}
          open={this.state.trigger_loading}
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
    ) : (
      <div>
        <BreadcrumbsItem to={getRoute(main_path  + "/iterations")}>
          <span className={classes.breadcrumbItemIconContainer}>
            <Icon className={classes.breadcrumbIcon}>low_priority</Icon>
            Iterations
          </span>
        </BreadcrumbsItem>
        <Switch>
          <Route path={getRoute(route_main_path + "/iterations/:iteration_id/results")} component={NotebookResults} />
          <Route path={getRoute(route_main_path + "/iterations/:iteration_id/trigger")} component={IterationParams} />
          <Route path={getRoute(route_main_path + "/iterations")} component={() =>
            <CodexCRUD resource={this} params={projectnotebookiterations_params} />
          }/>
        </Switch>
      </div>
    );
  }
}

NotebookIterations.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(breadcrumbStyle)(NotebookIterations);
