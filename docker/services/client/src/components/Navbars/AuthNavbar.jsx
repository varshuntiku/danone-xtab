import React from "react";

import cx from "classnames";
import PropTypes from "prop-types";

import { Breadcrumbs, BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { NavLink } from "react-router-dom";

import { getRoute } from "utils.js";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import { AppBar, Toolbar } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";

// core components
import Button from "components/CustomButtons/Button";

import authNavbarStyle from "assets/jss/material-dashboard-pro-react/components/authNavbarStyle.jsx";
import breadcrumbStyle from "assets/jss/breadcrumbStyle.jsx";
import Nuclios from "assets/jss/Nuclios"
// import {useTheme} from '@material-ui/core'

class AuthNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            projects: false
        };
    }
    handleDrawerToggle = () => {
        this.setState({ open: !this.state.open });
    };
    // verifies if routeName is the one active (in browser input)
    activeRoute(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? true : false;
    }
    componentDidUpdate(e) {
        if (e.history.location.pathname !== e.location.pathname) {
            this.setState({ open: false });
        }
    }
    showProjects = () => {
        const { parent_obj } = this.props;

        parent_obj.showProjects();
        this.setState({
            projects: true
        });
    }
    closeProjects = () => {
        const { parent_obj } = this.props;

        parent_obj.closeProjects();
        this.setState({
            projects: false
        });
    }
    // theme = useTheme()
    render() {
        const { classes, color, user_info } = this.props;
        const appBarClasses = cx({
            [" " + classes[color]]: color
        });

        return (
            <AppBar position="static" className={classes.appBar + appBarClasses}>
                <Toolbar className={classes.container}>
                    <div className={classes.flex}>
                        <Breadcrumbs
                            separator={(
                                <span className={classes.breadcrumbSeparatorIconContainer}>
                                    <Icon className={classes.breadcrumbLightSeparatorIcon}>arrow_forward_ios_icon</Icon>
                                </span>
                            )}
                            item={NavLink}
                            compare={(a, b) => a.to.split('//').length - b.to.split('//').length}
                        />
                        <BreadcrumbsItem
                            className={classes.breadcrumItemIconContainer}
                            to={"/"}
                        >
                            <span className={classes.breadcrumbItemLogoContainer}>
                                <Nuclios
                                    color={'rgba(255, 164, 151, 1)'}
                                    className={classes.breadcrumbLogo}
                                />
                            </span>
                        </BreadcrumbsItem>
                    </div>
                    <div style={{ float: 'right' }}>
                        {user_info && user_info.feature_access && user_info.feature_access['admin'] ? (
                            <Button color={'codxLight'} href="/admin/projects">
                                Admin
                            </Button>
                        ) : (
                            user_info && user_info.feature_access && user_info.feature_access['app'] ? (
                                window.location.href.indexOf('projects') !== -1 ? (
                                    ''
                                ) : (
                                    <Button color={'codxLight'} href={getRoute("projects")}>
                                        Problems
                                    </Button>
                                )
                            ) : (
                                ''
                            )
                        )}
                    </div>
                    <br clear="all" />
                </Toolbar>
            </AppBar>
        );
    }
}

AuthNavbar.propTypes = {
    classes: PropTypes.object.isRequired,
    parent_obj: PropTypes.object.isRequired,
    color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
    user_info: PropTypes.object.isRequired
};

export default withStyles(theme => ({
    ...authNavbarStyle(theme),
    ...breadcrumbStyle
}))(AuthNavbar);
