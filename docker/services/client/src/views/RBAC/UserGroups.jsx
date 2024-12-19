import React from "react";
import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";

import CodexCRUD from "views/CRUD/CodexCRUD.jsx";
import buttonStyle from "assets/jss/material-dashboard-pro-react/components/buttonStyle.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import statusIconStyle from "assets/jss/statusIconStyle.jsx";

class UserGroups extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      alert: null
    };
  }

  render() {
    const { classes } = this.props;

    const user_group_params = {
      table_key: "user-groups",
      list: {
        name: "User Groups",
        name_singular: "User Group",
        headers: [],
        url_slug: "user-groups"
      },
      add: {
        name: "Add User Group"
      },
      edit: {
        name: "Edit User Group"
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
            Header: "Type",
            accessor: "user_group_type",
            hide_add: true,
            hide_edit: true,
            sortable: false,
            filterable: false,
            type: "select",
            options_data: [
              { id: 1, label: "SYSTEM" },
              { id: 2, label: "USER CREATED" }
            ],
            key_column: "id",
            value_column: "name"
          },
          {
            Header: "App",
            accessor: "app",
            type: "boolean",
            labels: {
              value_true: (
                <Tooltip title="Granted" aria-label="Granted">
                  <Icon className={classes.green_icon}>check_circle</Icon>
                </Tooltip>
              ),
              value_false: (
                <Tooltip title="Revoked" aria-label="Revoked">
                  <Icon className={classes.red_icon}>error</Icon>
                </Tooltip>
              )
            },
            is_required: false,
            sortable: false,
            filterable: false
          },
          {
            Header: "Case Studies",
            accessor: "case_studies",
            type: "boolean",
            labels: {
              value_true: (
                <Tooltip title="Granted" aria-label="Granted">
                  <Icon className={classes.green_icon}>check_circle</Icon>
                </Tooltip>
              ),
              value_false: (
                <Tooltip title="Revoked" aria-label="Revoked">
                  <Icon className={classes.red_icon}>error</Icon>
                </Tooltip>
              )
            },
            is_required: false,
            sortable: false,
            filterable: false
          },
          {
            Header: "My Projects Only",
            accessor: "my_projects_only",
            type: "boolean",
            labels: {
              value_true: (
                <Tooltip title="Granted" aria-label="Granted">
                  <Icon className={classes.green_icon}>check_circle</Icon>
                </Tooltip>
              ),
              value_false: (
                <Tooltip title="Revoked" aria-label="Revoked">
                  <Icon className={classes.red_icon}>error</Icon>
                </Tooltip>
              )
            },
            is_required: false,
            sortable: false,
            filterable: false
          },
          {
            Header: "My Projects",
            accessor: "my_projects",
            type: "boolean",
            labels: {
              value_true: (
                <Tooltip title="Granted" aria-label="Granted">
                  <Icon className={classes.green_icon}>check_circle</Icon>
                </Tooltip>
              ),
              value_false: (
                <Tooltip title="Revoked" aria-label="Revoked">
                  <Icon className={classes.red_icon}>error</Icon>
                </Tooltip>
              )
            },
            is_required: false,
            sortable: false,
            filterable: false
          },
          {
            Header: "All Projects",
            accessor: "all_projects",
            type: "boolean",
            labels: {
              value_true: (
                <Tooltip title="Granted" aria-label="Granted">
                  <Icon className={classes.green_icon}>check_circle</Icon>
                </Tooltip>
              ),
              value_false: (
                <Tooltip title="Revoked" aria-label="Revoked">
                  <Icon className={classes.red_icon}>error</Icon>
                </Tooltip>
              )
            },
            is_required: false,
            sortable: false,
            filterable: false
          },
          {
            Header: "Widget Factory",
            accessor: "widget_factory",
            type: "boolean",
            labels: {
              value_true: (
                <Tooltip title="Granted" aria-label="Granted">
                  <Icon className={classes.green_icon}>check_circle</Icon>
                </Tooltip>
              ),
              value_false: (
                <Tooltip title="Revoked" aria-label="Revoked">
                  <Icon className={classes.red_icon}>error</Icon>
                </Tooltip>
              )
            },
            is_required: false,
            sortable: false,
            filterable: false
          },
          {
            Header: "Environments",
            accessor: "environments",
            type: "boolean",
            labels: {
              value_true: (
                <Tooltip title="Granted" aria-label="Granted">
                  <Icon className={classes.green_icon}>check_circle</Icon>
                </Tooltip>
              ),
              value_false: (
                <Tooltip title="Revoked" aria-label="Revoked">
                  <Icon className={classes.red_icon}>error</Icon>
                </Tooltip>
              )
            },
            is_required: false,
            sortable: false,
            filterable: false
          },
          {
            Header: "Publish",
            accessor: "app_publish",
            type: "boolean",
            labels: {
              value_true: (
                <Tooltip title="Granted" aria-label="Granted">
                  <Icon className={classes.green_icon}>check_circle</Icon>
                </Tooltip>
              ),
              value_false: (
                <Tooltip title="Revoked" aria-label="Revoked">
                  <Icon className={classes.red_icon}>error</Icon>
                </Tooltip>
              )
            },
            is_required: false,
            sortable: false,
            filterable: false
          },
          {
            Header: "Prod Publish",
            accessor: "prod_app_publish",
            type: "boolean",
            labels: {
              value_true: (
                <Tooltip title="Granted" aria-label="Granted">
                  <Icon className={classes.green_icon}>check_circle</Icon>
                </Tooltip>
              ),
              value_false: (
                <Tooltip title="Revoked" aria-label="Revoked">
                  <Icon className={classes.red_icon}>error</Icon>
                </Tooltip>
              )
            },
            is_required: false,
            sortable: false,
            filterable: false
          },
          {
            Header: "Access",
            accessor: "rbac",
            type: "boolean",
            labels: {
              value_true: (
                <Tooltip title="Granted" aria-label="Granted">
                  <Icon className={classes.green_icon}>check_circle</Icon>
                </Tooltip>
              ),
              value_false: (
                <Tooltip title="Revoked" aria-label="Revoked">
                  <Icon className={classes.red_icon}>error</Icon>
                </Tooltip>
              )
            },
            is_required: false,
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
      icon: SupervisorAccountIcon,
      actions: {
        add: true,
        edit: true,
        delete: true,
        list: true,
        extra: []
      }
    };

    return (
      <div>
        <CodexCRUD resource={this} params={user_group_params} />
        {this.state.alert}
      </div>
    );
  }
}

UserGroups.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles({
  ...buttonStyle,
  ...regularFormsStyle,
  ...statusIconStyle,
})(UserGroups);
