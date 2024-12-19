import React from "react";
import PropTypes from "prop-types";
import { Route, Switch, Redirect } from "react-router-dom";
import { getRoute } from "utils.js";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import AddAlert from "@material-ui/icons/AddAlert";

// core components
import Snackbar from "components/Snackbar/Snackbar.jsx";

import buttonStyle from "assets/jss/material-dashboard-pro-react/components/buttonStyle.jsx";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";
import codexCRUDStyle from "assets/jss/codexCRUDStyle.jsx";
import breadcrumbStyle from "assets/jss/breadcrumbStyle.jsx";

import CodexTable from "views/CRUD/CodexTable.jsx";
import CodexForm from "views/CRUD/CodexForm.jsx";

class CodexCRUD extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show_added_notification: false,
      show_delete_notification: false,
      show_update_notification: false,
      show_action_notification: false,
      show_exist_notification:false,
    };
  }

  showParent = () => {
    const { resource } = this.props;
    resource.showParent();
  }

  showAddedNotification = () => {
    this.setState({
      show_added_notification: true
    });

    setTimeout(
      function() {
        this.parentObj.setState({ show_added_notification: false });
      }.bind({ parentObj: this }),
      6000
    );
  }

  showExistNotification = () => {
    this.setState({
      show_exist_notification: true
    });

    setTimeout(
      function() {
        this.parentObj.setState({ show_exist_notification: false });
      }.bind({ parentObj: this }),
      6000
    );
  }

  showDeleteNotification = () => {
    this.setState({
      show_delete_notification: true
    });

    setTimeout(
      function() {
        this.parentObj.setState({ show_delete_notification: false });
      }.bind({ parentObj: this }),
      6000
    );
  }

  showUpdateNotification = () => {
    this.setState({
      show_update_notification: true
    });

    setTimeout(
      function() {
        this.parentObj.setState({ show_update_notification: false });
      }.bind({ parentObj: this }),
      6000
    );
  }

  showActionNotification = () => {
    this.setState({
      show_action_notification: true
    });

    setTimeout(
      function() {
        this.parentObj.setState({ show_action_notification: false });
      }.bind({ parentObj: this }),
      6000
    );
  }

  showExtraActionResults = () => {
  }

  render() {
    const { classes, params, resource } = this.props;

    var main_path = "";
    if (params.route_prefix) {
      main_path += params.route_prefix + "/";
    }

    main_path += params.table_key;

    var list_path = main_path + "/list";
    var edit_path = main_path + "/:item_id/edit";
    var add_path = main_path + "/add";

    return (
      <div>
        <Switch>
          <Route exact path={getRoute(list_path)} component={() =>
            <CodexTable
              classes={classes}
              params={params}
              crud={this}
              resource={resource}
              />
          }/>
          {params.custom_form ? (
            <Route exact path={getRoute(edit_path)} component={(props) =>
              <params.custom_form
                type={"edit"}
                params={params}
                crud={this}
                {...props}
              />
            } />
          ) : (
            <Route exact path={getRoute(edit_path)} component={(props) =>
              <CodexForm
                type={"edit"}
                classes={classes}
                params={params}
                crud={this}
                {...props}
              />
            }/>
          )}
          {params.custom_form ? (
            <Route exact path={getRoute(add_path)} component={(props) =>
              <params.custom_form
                type={"add"}
                params={params}
                crud={this}
                {...props}
              />
            } />
          ) : (
            <Route exact path={getRoute(add_path)} component={() =>
              <CodexForm
                type={"add"}
                classes={classes}
                params={params}
                crud={this}
              />
            } />
          )}
          <Redirect exact from={getRoute(main_path)} to={getRoute(list_path)} />
        </Switch>
        <Snackbar
          place="bc"
          color="primary"
          icon={AddAlert}
          message="Added successfully !"
          open={this.state.show_added_notification}
          closeNotification={() =>
            this.setState({ show_added_notification: false })
          }
          close
        />
        <Snackbar
          place="bc"
          color="danger"
          icon={AddAlert}
          message="Action could not be completed because of a conflict. This row might already exist."
          open={this.state.show_exist_notification}
          closeNotification={() =>
            this.setState({ show_exist_notification: false })
          }
          close
        />
        <Snackbar
          place="bc"
          color="primary"
          icon={AddAlert}
          message="Deleted successfully !"
          open={this.state.show_delete_notification}
          closeNotification={() =>
            this.setState({ show_delete_notification: false })
          }
          close
        />
        <Snackbar
          place="bc"
          color="primary"
          icon={AddAlert}
          message="Updated successfully !"
          open={this.state.show_update_notification}
          closeNotification={() =>
            this.setState({ show_update_notification: false })
          }
          close
        />
        <Snackbar
          place="bc"
          color="primary"
          icon={AddAlert}
          message="Table refreshed after action !"
          open={this.state.show_action_notification}
          closeNotification={() =>
            this.setState({ show_action_notification: false })
          }
          close
        />
      </div>
    );
  }
}

CodexCRUD.propTypes = {
  classes: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired
};

export default withStyles({
  ...codexCRUDStyle,
  ...buttonStyle,
  ...customSelectStyle,
  ...sweetAlertStyle,
  ...breadcrumbStyle
})(CodexCRUD);
