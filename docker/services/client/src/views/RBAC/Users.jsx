import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { Icon, Tooltip } from "@material-ui/core";

import statusIconStyle from "assets/jss/statusIconStyle.jsx";

import CodexCRUD from "views/CRUD/CodexCRUD.jsx";

class Users extends React.Component {
  render() {
    const { classes } = this.props;

    const user_params = {
      table_key: "users",
      list: {
        name: "Users",
        name_singular: "User",
        headers: [],
        url_resource: "users",
        url_action: "list",
        url_slug: "users"
      },
      add: {
        name: "Add User"
      },
      edit: {
        name: "Edit User"
      },
      fields: {
        list: [
          {
            Header: "First Name",
            accessor: "first_name",
            is_required: true,
            sortable: true,
            filterable: true,
            type: "text",
            disabled: true
          },
          {
            Header: "Last Name",
            accessor: "last_name",
            is_required: true,
            sortable: true,
            filterable: true,
            type: "text",
            disabled: true
          },
          {
            Header: "Email Address",
            accessor: "email_address",
            is_required: true,
            sortable: true,
            filterable: true,
            type: "text",
            disabled: true
          },
          {
            Header: "Password",
            accessor: "password",
            hide_table: true,
            is_required: false,
            type: "text"
          },
          {
            Header: "Is restricted user",
            accessor: "restricted_user",
            sortable: true,
            filterable: true,
            is_required: false,
            type: "boolean",
            labels: {
              value_true: (
                <Tooltip title="Yes" aria-label="Yes">
                  <Icon className={classes.green_icon}>check_circle</Icon>
                </Tooltip>
              ),
              value_false: (
                <Tooltip title="No" aria-label="No">
                  <Icon className={classes.red_icon}>cancel</Icon>
                </Tooltip>
              )
            }
          },
          {
            Header: "User Groups",
            accessor: "user_groups_label",
            hide_add: true,
            hide_edit: true,
            sortable: true,
            filterable: false,
            multiple: true,
            type: 'text'
          },
          {
            Header: "User Groups",
            accessor: "user_groups",
            hide_table: true,
            is_required: true,
            sortable: false,
            filterable: false,
            multiple: true,
            type: "ajax_select",
            slug: "user-groups",
            key_column: "id",
            value_column: "name"
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
      },
      ajaxData: true
    };

    return <CodexCRUD params={user_params} />;
  }
}

Users.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles({
  ...statusIconStyle
})(Users);