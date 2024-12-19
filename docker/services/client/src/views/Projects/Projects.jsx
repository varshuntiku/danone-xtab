import React from "react";
import { Route, Switch } from "react-router-dom";
import { getRoute } from "utils.js";

import Extension from "@material-ui/icons/Extension";

import CodexCRUD from "views/CRUD/CodexCRUD.jsx";

import Design from "views/Blueprints/Design.jsx";
import ProjectNotebooks from "views/Blueprints/ProjectNotebooks.jsx";
import CaseStudies from "views/Blueprints/CaseStudies.jsx";

export default function Projects() {
  var user_info = JSON.parse(sessionStorage.getItem('user_info'));

  var object_name = 'Project';
  var object_plural_name = 'Projects';

  const project_params = {
    table_key: object_plural_name.toLowerCase().replace(' ', '_'),
    list: {
      name: object_plural_name,
      name_singular: object_name,
      headers: [],
      url_resource: "projects",
      url_action: "list",
      url_slug: "projects",
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
          sortable: true,
          filterable: true,
          type: "text"
        },
        {
          Header: "Industry",
          accessor: "industry",
          sortable: true,
          filterable: true,
          type: "select",
          options_data: [
            { id: 'Airlines', label: 'Airlines' },
            { id: 'Automotive', label: 'Automotive' },
            { id: 'Banking', label: 'Banking' },
            { id: 'CPG', label: 'CPG' },
            { id: 'Entertainment', label: 'Entertainment' },
            { id: 'E Commerce', label: 'E Commerce' },
            { id: 'Insurance', label: 'Insurance' },
            { id: 'Pharmaceuticals', label: 'Pharmaceuticals' },
            { id: 'Retail', label: 'Retail' },
            { id: 'Technology', label: 'Technology' },
            { id: 'Telecom', label: 'Telecom' }
          ],
          key_column: "id",
          value_column: "label"
        },
        {
          Header: "Function",
          accessor: "function",
          hide_add: true,
          hide_edit: true,
          is_required: false,
          sortable: false,
          filterable: false,
          type: "text",
        },
        {
          Header: "Problem Area",
          accessor: "problem_area",
          hide_add: true,
          hide_edit: true,
          is_required: false,
          sortable: false,
          filterable: false,
          type: "text",
        },
        {
          Header: "Status",
          accessor: "project_status",
          sortable: true,
          filterable: false,
          is_required: true,
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
          sortable: false,
          filterable: true,
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
          filterable: true,
          is_required: true,
          type: "ajax_select",
          slug: "reviewers",
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
          filterable: true,
          type: "text",
        },
        {
          Header: "Updated by",
          accessor: "updated_by",
          hide_add: true,
          hide_edit: true,
          is_required: false,
          sortable: false,
          filterable: true,
          type: "text",
        },
        {
          Header: "# of Case Studies",
          accessor: "casestudy_count",
          hide_add: true,
          hide_edit: true,
          is_required: false,
          sortable: false,
          filterable: false,
          type: "text",
        },
        {
          Header: "Actions",
          accessor: "actions",
          sortable: false,
          filterable: false
        }
      ]
    },
    icon: Extension,
    actions: {
      add: user_info.feature_access['all_projects'],
      edit: data => data.user_access.edit,
      delete: data => data.user_access.delete,
      list: true,
      extra: [
        {
          title: "Design",
          icon_color: "#220047",
          icon: "account_tree",
          extra_key: "design",
          hide: data => !data.user_access.edit,
        }
      ]
    },
    ajaxData: true
  };

  return (
    <Switch>
      <Route exact path={getRoute("projects/:project_id/design")} component={Design} />
      <Route path={getRoute("projects/:project_id/case-studies")} component={CaseStudies} />
      <Route path={getRoute("projects/:project_id/notebooks")} component={ProjectNotebooks} />
      <Route path={getRoute("projects")} component={() =>
        <CodexCRUD params={project_params} />
      }/>
    </Switch>
  );
}
