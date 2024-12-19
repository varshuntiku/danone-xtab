import React from "react";
import { Route, Switch } from "react-router-dom";
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { getRoute } from "utils.js";

import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/icons/List";
import Icon from "@material-ui/core/Icon";

import Design from "views/Blueprints/Design.jsx";
import ProjectNotebooks from "views/Blueprints/ProjectNotebooks.jsx";

import CodexDataProvider, { CODEX_API_GET } from "views/CRUD/CodexDataProvider.jsx";
import CodexCRUD from "views/CRUD/CodexCRUD.jsx";
import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

import breadcrumbStyle from "../../assets/jss/breadcrumbStyle";

class CaseStudies extends React.Component {
  constructor(props) {
    super(props);

    this.user_info = JSON.parse(sessionStorage.getItem('user_info'));

    var project_id = false;
    if (props.match.params.project_id) {
      project_id = props.match.params.project_id;
    }

    this.state = {
      project_id: project_id,
      loading: true,
      project_name: null
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

  render() {
    const { classes } = this.props;

    var casestudies_params = {};
    if (this.state.project_id && this.state.project_name) {
      var object_name = 'Case Study for ' + this.state.project_name;
      var object_plural_name = 'Case Studies for ' + this.state.project_name;

      casestudies_params = {
        link_prefix: 'projects/' + this.state.project_id,
        route_prefix: 'projects/:project_id',
        table_key: 'case-studies',
        list: {
          name: object_plural_name,
          name_singular: object_name,
          headers: [],
          url_slug: "casestudies/" + this.state.project_id
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
              Header: "Name",
              accessor: "name",
              is_required: true,
              sortable: false,
              filterable: false,
              type: "text"
            },
            {
              Header: "Status",
              accessor: "project_status",
              sortable: false,
              filterable: false,
              is_required: false,
              type: "select",
              options_data: [
                { id: 1, label: "NOT STARTED" },
                { id: 2, label: "IN PROGRESS" },
                { id: 3, label: "READY FOR REVIEW" },
                { id: 4, label: "REVIEWED" },
                { id: 5, label: "DEPLOYED TO PROD" }
              ],
              key_column: "id",
              value_column: "label"
            },
            {
              Header: "Assigned to",
              accessor: "assignees_label",
              hide_add: true,
              hide_edit: true,
              sortable: true,
              filterable: false,
              multiple: true,
              type: 'text'
            },
            {
              Header: "Assigned to",
              accessor: "assignees",
              hide_table: true,
              is_required: true,
              sortable: false,
              filterable: false,
              multiple: true,
              type: "ajax_select",
              slug: "users",
              key_column: "id",
              value_column: "name"
            },
            {
              Header: "Reviewer",
              accessor: "reviewer",
              sortable: false,
              filterable: false,
              is_required: false,
              type: "ajax_select",
              slug: "users",
              key_column: "id",
              value_column: "name"
            },
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
              Header: "Updated by",
              accessor: "updated_by",
              hide_add: true,
              hide_edit: true,
              is_required: false,
              sortable: false,
              filterable: false,
              type: "text",
            },
            {
              Header: "Copy attachments",
              accessor: "copy_attachments",
              hide_table: true,
              hide_edit: true,
              is_required: false,
              sortable: false,
              filterable: false,
              type: "boolean"
            },
            {
              Header: "Copy code",
              accessor: "copy_code",
              hide_table: true,
              hide_edit: true,
              is_required: false,
              sortable: false,
              filterable: false,
              type: "boolean"
            },
            {
              Header: "Copy comments",
              accessor: "copy_comments",
              hide_table: true,
              hide_edit: true,
              is_required: false,
              sortable: false,
              filterable: false,
              type: "boolean"
            },
            {
              Header: "Actions",
              accessor: "actions",
              sortable: false,
              filterable: false
            }
          ]
        },
        icon: List,
        actions: {
          add: this.user_info.feature_access['case_studies'] || this.user_info.feature_access['my_projects'] || this.user_info.feature_access['my_projects_only'] || this.user_info.feature_access['all_projects'],
          edit: this.user_info.feature_access['case_studies'] || this.user_info.feature_access['my_projects'] || this.user_info.feature_access['my_projects_only'] || this.user_info.feature_access['all_projects'],
          delete: this.user_info.feature_access['case_studies'] || this.user_info.feature_access['my_projects'] || this.user_info.feature_access['my_projects_only'] || this.user_info.feature_access['all_projects'],
          list: true,
          extra: [
            {
              title: "Design",
              icon_color: "primary",
              icon: "account_tree",
              extra_key: "design"
            }
          ]
        }
      };
    }

    return this.state.loading ? (
      <OrangeLinearProgress />
    ) : (
      <div>
        <BreadcrumbsItem to={getRoute("projects/" + this.state.project_id  + "/design")}>
          <span className={classes.breadcrumbItemIconContainer}>
            <Icon className={classes.breadcrumbIcon}>account_tree</Icon>
            {this.state.project_name}
          </span>
        </BreadcrumbsItem>
        <BreadcrumbsItem to={getRoute("projects/" + this.state.project_id  + "/case-studies")}>
          <span className={classes.breadcrumbItemIconContainer}>
            <Icon className={classes.breadcrumbIcon}>list</Icon>
            {'Case studies'}
          </span>
        </BreadcrumbsItem>
        <Switch>
          <Route exact path={getRoute("projects/:project_id/case-studies/:case_study_id/design")} component={Design} />
          <Route path={getRoute("projects/:project_id/case-studies/:case_study_id/notebooks")} component={ProjectNotebooks} />
          <Route path={getRoute("projects/:project_id/case-studies")} component={() =>
            <CodexCRUD resource={this} params={casestudies_params} />
          }/>
        </Switch>
      </div>
    );
  }
};

export default withStyles({
  ...breadcrumbStyle
})(CaseStudies);