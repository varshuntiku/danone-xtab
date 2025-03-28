import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.jsx";
import Footer from "components/Footer/Footer.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";

import routes from "testnlearn_routes.js";

import appStyle from "assets/jss/material-dashboard-pro-react/layouts/adminStyle.jsx";

import logo from "assets/img/test-n-learn.png";

import CodexDataProvider, {
  CODEX_API_GET
} from "views/CRUD/CodexDataProvider.jsx";

let _ = require("underscore");

var ps;

class TestnLearn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      miniActive: false,
      color: "orange",
      bgColor: "black",
      hasImage: true,
      fixedClasses: "dropdown"
    };
    this.resizeFunction = this.resizeFunction.bind(this);
  }
  componentDidMount() {
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
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
    window.removeEventListener("resize", this.resizeFunction);
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }
  setUserInfo = (crud, user_info) => {
    this.setState({ user_info: user_info.data });
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.mainPanel, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", this.resizeFunction);
  };
  handleImageClick = image => {
    this.setState({ image: image });
  };
  handleColorClick = color => {
    this.setState({ color: color });
  };
  handleBgColorClick = bgColor => {
    this.setState({ bgColor: bgColor });
  };
  handleFixedClick = () => {
    if (this.state.fixedClasses === "dropdown") {
      this.setState({ fixedClasses: "dropdown show" });
    } else {
      this.setState({ fixedClasses: "dropdown" });
    }
  };
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  getRoute() {
    return this.props.location.pathname !== "/admin/full-screen-maps";
  }
  getActiveRoute = routes => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = this.getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === "/test-n-learn") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  getRBACroutes = routes => {
    var response_routes = [];

    if (!this.state || !this.state.user_info) {
      return response_routes;
    }

    _.each(routes, function(route) {
      var response_route = route;
      if (route.collapse) {
        var views = _.filter(route.views, function(view) {
          if(view.access === "all") {
            return true;
          } else if (view.access !== null && this.state.user_info.feature_access[view.access]) {
            return true;
          } else {
            return false;
          }
        }, this);

        response_route.views = views;
      }
      response_routes.push(response_route);
    }, this);

    return _.filter(response_routes, function(response_route) {
      if(response_route.access === "all") {
        return true;
      } else if (response_route.access !== null && this.state.user_info && this.state.user_info.feature_access[response_route.access]) {
        return true;
      } else {
        return false;
      }
    }, this);
  };
  sidebarMinimize() {
    this.setState({ miniActive: !this.state.miniActive });
  }
  resizeFunction() {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  }
  render() {
    const { classes, ...rest } = this.props;
    const mainPanel =
      classes.mainPanel +
      " " +
      cx({
        [classes.mainPanelSidebarMini]: this.state.miniActive,
        [classes.mainPanelWithPerfectScrollbar]:
          navigator.platform.indexOf("Win") > -1
      });
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={this.getRBACroutes(routes)}
          logoText={"Test and Learn"}
          logo={logo}
          image={this.state.image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color={this.state.color}
          bgColor={this.state.bgColor}
          miniActive={this.state.miniActive}
          {...rest}
        />
        <div className={mainPanel} ref="mainPanel">
          <AdminNavbar
            sidebarMinimize={this.sidebarMinimize.bind(this)}
            miniActive={this.state.miniActive}
            brandText={this.getActiveRoute(routes)}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />
          {/* On the /maps/full-screen-maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          {this.getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>
                <Switch>{this.getRoutes(this.getRBACroutes(routes))}</Switch>
              </div>
            </div>
          ) : (
            <div className={classes.map}>
              <Switch>{this.getRoutes(this.getRBACroutes(routes))}</Switch>
            </div>
          )}
          {this.getRoute() ? <Footer fluid /> : null}
          {/* <FixedPlugin
            handleImageClick={this.handleImageClick}
            handleColorClick={this.handleColorClick}
            handleBgColorClick={this.handleBgColorClick}
            handleHasImage={this.handleHasImage}
            color={this.state["color"]}
            bgColor={this.state["bgColor"]}
            bgImage={this.state["image"]}
            handleFixedClick={this.handleFixedClick}
            fixedClasses={this.state.fixedClasses}
            sidebarMinimize={this.sidebarMinimize.bind(this)}
            miniActive={this.state.miniActive}
          /> */}
        </div>
      </div>
    );
  }
}

TestnLearn.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(appStyle)(TestnLearn);
