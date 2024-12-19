import React from "react";
import { Route, Switch } from "react-router-dom";
import { getRoute } from "utils.js";

import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import Extension from "@material-ui/icons/Extension";

import CodexCRUD from "views/CRUD/CodexCRUD.jsx";
import EnvDetails from "views/Environments/EnvDetails.jsx";

import statusIconStyle from "assets/jss/statusIconStyle.jsx";
import breadcrumbStyle from "assets/jss/breadcrumbStyle.jsx";

class Environments extends React.Component {
  render() {
    const { classes } = this.props;

    var object_name = 'Environment';
    var object_plural_name = 'Environments';

    const environment_params = {
      table_key: object_plural_name.toLowerCase().replace(' ', '_'),
      list: {
        name: object_plural_name,
        name_singular: object_name,
        headers: [],
        url_slug: "environments"
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
            Header: "Created by",
            accessor: "created_by",
            hide_add: true,
            hide_edit: true,
            is_required: false,
            sortable: true,
            filterable: true,
            type: "text",
          },
          {
            Header: "Updated by",
            accessor: "updated_by",
            hide_add: true,
            hide_edit: true,
            is_required: false,
            sortable: true,
            filterable: true,
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
        add: true,
        edit: true,
        delete: true,
        list: true,
        extra: [
          {
            title: "Settings",
            icon_color: "primary",
            icon: "settings",
            extra_key: "settings"
          }
        ]
      }
    };

    return (
      <Switch>
        <Route exact path={getRoute("environments/:environment_id/settings")} component={(props) =>
          <EnvDetails classes={classes} {...props} />
        } />
        <Route path={getRoute("environments")} component={() =>
          <CodexCRUD params={environment_params} />
        }/>
      </Switch>
    );
  }
}

Environments.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles({
  ...statusIconStyle,
  ...breadcrumbStyle
})(Environments);

