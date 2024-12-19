import React from "react";
import { Route, Switch } from "react-router-dom";
import { getRoute } from "utils.js";

import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import Apps from "@material-ui/icons/Apps";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";

import CodexCRUD from "views/CRUD/CodexCRUD.jsx";
import WidgetDetails from "views/Widgets/WidgetDetails.jsx";

import statusIconStyle from "assets/jss/statusIconStyle.jsx";
import breadcrumbStyle from "assets/jss/breadcrumbStyle.jsx";

class Widgets extends React.Component {
  render() {
    const { classes } = this.props;

    const widget_params = {
      table_key: "widgets",
      list: {
        name: "Widgets",
        name_singular: "Widget",
        headers: [],
        url_slug: "widgets"
      },
      add: {
        name: "Add Widget"
      },
      edit: {
        name: "Edit Widget"
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
            Header: "Widget Group",
            accessor: "widget_group",
            hide_add: true,
            hide_edit: true,
            sortable: true,
            filterable: true,
            type: "text"
          },
          {
            Header: "Widget Group",
            accessor: "group_id",
            hide_table: true,
            is_required: true,
            sortable: false,
            filterable: false,
            type: "ajax_select",
            slug: "widget-groups",
            key_column: "id",
            value_column: "name"
          },
          {
            Header: "Contributor Code",
            accessor: "contributor_code",
            type: "boolean",
            labels: {
              value_true: (
                <Tooltip title="Available" aria-label="Available">
                  <Icon className={classes.green_icon}>check_circle</Icon>
                </Tooltip>
              ),
              value_false: (
                <Tooltip title="Unavailable" aria-label="Unavailable">
                  <Icon className={classes.red_icon}>error</Icon>
                </Tooltip>
              )
            },
            hide_edit: true,
            hide_add: true,
            is_required: false,
            sortable: true,
            filterable: false,
          },
          {
            Header: "TEST Code",
            accessor: "test_code",
            type: "boolean",
            labels: {
              value_true: (
                <Tooltip title="Available" aria-label="Available">
                  <Icon className={classes.green_icon}>check_circle</Icon>
                </Tooltip>
              ),
              value_false: (
                <Tooltip title="Unavailable" aria-label="Unavailable">
                  <Icon className={classes.red_icon}>error</Icon>
                </Tooltip>
              )
            },
            hide_edit: true,
            hide_add: true,
            is_required: false,
            sortable: true,
            filterable: false,
          },
          {
            Header: "PROD Code",
            accessor: "prod_code",
            type: "boolean",
            labels: {
              value_true: (
                <Tooltip title="Available" aria-label="Available">
                  <Icon className={classes.green_icon}>check_circle</Icon>
                </Tooltip>
              ),
              value_false: (
                <Tooltip title="Unavailable" aria-label="Unavailable">
                  <Icon className={classes.red_icon}>error</Icon>
                </Tooltip>
              )
            },
            hide_edit: true,
            hide_add: true,
            is_required: false,
            sortable: true,
            filterable: false,
          },
          {
            Header: "Attachment Count",
            accessor: "attachment_count",
            hide_add: true,
            hide_edit: true,
            sortable: true,
            filterable: false,
            type: "text"
          },
          {
            Header: "Created at",
            accessor: "created_at",
            hide_add: true,
            hide_edit: true,
            sortable: true,
            filterable: false,
            type: "text"
          },
          {
            Header: "Created by",
            accessor: "created_by",
            hide_add: true,
            hide_edit: true,
            sortable: true,
            filterable: true,
            type: "text"
          },
          {
            Header: "Updated at",
            accessor: "updated_at",
            hide_add: true,
            hide_edit: true,
            sortable: true,
            filterable: false,
            type: "text"
          },
          {
            Header: "Updated by",
            accessor: "updated_by",
            hide_add: true,
            hide_edit: true,
            sortable: true,
            filterable: true,
            type: "text"
          },
          {
            Header: "Actions",
            accessor: "actions",
            sortable: false,
            filterable: false
          }
        ]
      },
      icon: Apps,
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
        <Route exact path={getRoute("widgets/:widget_id/settings")} component={(props) =>
          <WidgetDetails classes={classes} {...props} />
        } />
        <Route path={getRoute("widgets")} component={() =>
          <CodexCRUD params={widget_params} />
        }/>
      </Switch>
    );
  }
}

Widgets.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles({
  ...statusIconStyle,
  ...breadcrumbStyle
})(Widgets);
