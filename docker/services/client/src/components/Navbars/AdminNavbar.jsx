import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { NavLink } from "react-router-dom";
import { Breadcrumbs, BreadcrumbsItem } from 'react-breadcrumbs-dynamic';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";
import Icon from "@material-ui/core/Icon";

// material-ui icons
import Menu from "@material-ui/icons/Menu";

// core components
import AdminNavbarLinks from "./AdminNavbarLinks";
import Button from "components/CustomButtons/Button.jsx";

import adminNavbarStyle from "assets/jss/material-dashboard-pro-react/components/adminNavbarStyle.jsx";
import breadcrumbStyle from "assets/jss/breadcrumbStyle.jsx";

function AdminNavbar({ ...props }) {
  const { classes, color, rtlActive, brandText } = props;
  const appBarClasses = cx({
    [" " + classes[color]]: color
  });
  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          <Breadcrumbs
            separator={(
              <span className={classes.breadcrumbSeparatorIconContainer}>
                <Icon className={classes.breadcrumbSeparatorIcon}>arrow_forward_ios_icon</Icon>
              </span>
            )}
            item={NavLink}
            compare={(a,b)=>a.to.split('//').length-b.to.split('//').length}
          />
          <BreadcrumbsItem
            className={classes.breadcrumItemIconContainer}
            to={brandText.path}
          >
            <span className={classes.breadcrumbItemIconContainer}>
              <brandText.icon className={classes.breadcrumbIcon} />
              {brandText.name}
            </span>
          </BreadcrumbsItem>
        </div>
        <Hidden smDown implementation="css">
          <AdminNavbarLinks rtlActive={rtlActive} />
        </Hidden>
        <Hidden mdUp implementation="css">
          <Button
            className={classes.appResponsive}
            color="transparent"
            justIcon
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <Menu />
          </Button>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

AdminNavbar.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  rtlActive: PropTypes.bool,
  brandText: PropTypes.object
};

export default withStyles(
  (theme) => ({
    ...adminNavbarStyle(theme),
    ...breadcrumbStyle,
  }),
  { withTheme: true }
)(AdminNavbar);
