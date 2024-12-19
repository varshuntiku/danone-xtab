import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';

import * as Sentry from '@sentry/react';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import AuthNavbar from "components/Navbars/AuthNavbar.jsx";
// import Footer from "components/Footer/Footer.jsx";

import Hierarchy from "views/Pages/Hierarchy.jsx";
import ProblemDashboard from "views/Pages/ProblemDashboard.jsx";
import Projects from "views/Projects/Projects.jsx";

import ExtensionIcon from "@material-ui/icons/Extension";

import pagesStyle from "assets/jss/material-dashboard-pro-react/layouts/mainStyle.jsx";
import breadcrumbStyle from "assets/jss/breadcrumbStyle.jsx";
import CodxCircularLoader from "../components/CodxCircularLoader/CodxCircularLoader";

import CodexDataProvider, {
  CODEX_API_GET
} from "views/CRUD/CodexDataProvider.jsx";

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user_info: false,
      projects: false
    };
  }

  componentDidMount() {
    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_GET,
      {
        resource: "user",
        action: "get-info",
        callback: "setUserInfo"
      },
      this
    );
  }

  setUserInfo = (crud, user_info) => {
    sessionStorage.setItem('user_info', JSON.stringify(user_info.data));
    Sentry.configureScope(function(scope) {
      scope.setUser({
        email: user_info.data.username
      });
    });
    this.setState({ loading: false, user_info: user_info.data });
  };

  showProjects = () => {
    this.setState({
      projects: true
    });
  }

  closeProjects = () => {
    this.setState({
      projects: false
    });
  }

  render() {
    const { classes, ...rest } = this.props;

    return (
      <div>
        <AuthNavbar parent_obj={this} user_info={this.state.user_info ? this.state.user_info : {}} {...rest} />
        <div className={classes.wrapper} ref="wrapper">
          <div
            className={classes.fullPage}
          >
            {this.state.user_info ? (
              <Switch>
                <Route path="/projects" component={(props) =>
                  <div style={{ padding: '0 16px', height: '100%' }}>
                    <BreadcrumbsItem
                      className={classes.breadcrumItemIconContainer}
                      to={"/projects"}
                    >
                      <span className={classes.breadcrumbItemIconContainer}>
                        <ExtensionIcon className={classes.breadcrumbIcon}/>
                        {"Problems"}
                      </span>
                    </BreadcrumbsItem>
                    <Projects {...props}/>
                  </div>
                }/>
                <Route exact path="/problem/:industry/:problem" component={ProblemDashboard}/>
                <Route path="/dashboard" component={() =>
                  <Hierarchy is_main={true}/>
                }/>
              </Switch>
            ) : <CodxCircularLoader />}
          </div>
        </div>
      </div>
    );
  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(theme => ({
  ...pagesStyle(theme),
  ...breadcrumbStyle
}))(Main);
