import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';

import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import sidebarStyle from 'assets/jss/sidebarStyle.jsx';
import breadcrumbStyle from 'assets/jss/breadcrumbStyle';
import { UserInfoContext } from 'context/userInfoContent';
import Collapse from 'components/Nuclios/assets/Collapse';
// import * as _ from 'underscore';

const NavBarIconButton = withStyles((theme) => ({
    colorPrimary: {
        color: theme.palette.primary.contrastText
    }
}))(IconButton);

class Sidebar extends React.Component {
    static contextType = UserInfoContext;
    constructor(props) {
        super(props);

        this.props = props;
        this.state = {
            hideSideBar: false,
            currentDropdownId: null,
            supportOpen: false,
            hoverSideBar: false,
            collapse: false,
            collapseColor: false
        };
    }

    itemClickHandler = (e) => {
        const dropdownId =
            this.state.currentDropdownId && this.state.currentDropdownId == e.target.id
                ? null
                : e.target.id;
        this.setState({
            currentDropdownId: dropdownId
        });
        // const el = document.getElementById(e.target.id);
    };

    renderLinks = () => {
        const { classes, dashboardId } = this.props;

        var admin_route_selected = false;
        if (
            window.location.pathname.includes(
                '/connected-system/' + dashboardId + '/admin/overview'
            )
        ) {
            admin_route_selected = 'overview';
        } else if (
            window.location.pathname.includes('/connected-system/' + dashboardId + '/admin/tabs')
        ) {
            admin_route_selected = 'tabs';
        } else if (
            window.location.pathname.includes('/connected-system/' + dashboardId + '/admin/goals')
        ) {
            admin_route_selected = 'goals';
        } else if (
            window.location.pathname.includes(
                '/connected-system/' + dashboardId + '/admin/initiatives'
            )
        ) {
            admin_route_selected = 'initiatives';
        } else if (
            window.location.pathname.includes('/connected-system/' + dashboardId + '/admin/drivers')
        ) {
            admin_route_selected = 'drivers';
        } else if (
            window.location.pathname.includes(
                '/connected-system/' + dashboardId + '/admin/business-processes'
            )
        ) {
            admin_route_selected = 'business-processes';
        } else if (
            window.location.pathname.includes(
                '/connected-system/' + dashboardId + '/admin/business-process-templates'
            )
        ) {
            admin_route_selected = 'business-process-templates';
        }

        return [
            <ListItem
                className={
                    admin_route_selected === 'overview'
                        ? classes.selectedNavLinkLevelTwo
                        : classes.navLinkLevelTwo
                }
                button
                component={Link}
                key={'basic information'}
                to={'/connected-system/' + dashboardId + '/admin/overview'}
            >
                {admin_route_selected === 'overview' && (
                    <div className={classes.sidebarLinkTextSecondSelectedHorizontalLine}></div>
                )}
                <ListItemText
                    disableTypography
                    primary={
                        <Typography variant="h5" className={classes.sidebarLinkTextSecondSelected}>
                            Overview
                        </Typography>
                    }
                />
            </ListItem>,
            <ListItem
                className={
                    admin_route_selected === 'tabs'
                        ? classes.selectedNavLinkLevelTwo
                        : classes.navLinkLevelTwo
                }
                button
                component={Link}
                key={'dashboard tabs'}
                to={'/connected-system/' + dashboardId + '/admin/tabs'}
            >
                {admin_route_selected === 'tabs' && (
                    <div className={classes.sidebarLinkTextSecondSelectedHorizontalLine}></div>
                )}
                <ListItemText
                    disableTypography
                    primary={
                        <Typography variant="h5" className={classes.sidebarLinkTextSecondSelected}>
                            Tabs
                        </Typography>
                    }
                />
            </ListItem>,
            <ListItem
                className={
                    admin_route_selected === 'goals'
                        ? classes.selectedNavLinkLevelTwo
                        : classes.navLinkLevelTwo
                }
                button
                component={Link}
                key={'goals'}
                to={'/connected-system/' + dashboardId + '/admin/goals'}
            >
                {admin_route_selected === 'goals' && (
                    <div className={classes.sidebarLinkTextSecondSelectedHorizontalLine}></div>
                )}
                <ListItemText
                    disableTypography
                    primary={
                        <Typography variant="h5" className={classes.sidebarLinkTextSecondSelected}>
                            Goals
                        </Typography>
                    }
                />
            </ListItem>,
            <ListItem
                className={
                    admin_route_selected === 'initiatives'
                        ? classes.selectedNavLinkLevelTwo
                        : classes.navLinkLevelTwo
                }
                button
                component={Link}
                key={'initiatives'}
                to={'/connected-system/' + dashboardId + '/admin/initiatives'}
            >
                {admin_route_selected === 'initiatives' && (
                    <div className={classes.sidebarLinkTextSecondSelectedHorizontalLine}></div>
                )}
                <ListItemText
                    disableTypography
                    primary={
                        <Typography variant="h5" className={classes.sidebarLinkTextSecondSelected}>
                            Initiatives
                        </Typography>
                    }
                />
            </ListItem>,
            <ListItem
                className={
                    admin_route_selected === 'drivers'
                        ? classes.selectedNavLinkLevelTwo
                        : classes.navLinkLevelTwo
                }
                button
                component={Link}
                key={'drivers'}
                to={'/connected-system/' + dashboardId + '/admin/drivers'}
            >
                {admin_route_selected === 'drivers' && (
                    <div className={classes.sidebarLinkTextSecondSelectedHorizontalLine}></div>
                )}
                <ListItemText
                    disableTypography
                    primary={
                        <Typography variant="h5" className={classes.sidebarLinkTextSecondSelected}>
                            Drivers
                        </Typography>
                    }
                />
            </ListItem>,
            <ListItem
                className={
                    admin_route_selected === 'business-processes'
                        ? classes.selectedNavLinkLevelTwo
                        : classes.navLinkLevelTwo
                }
                button
                component={Link}
                key={'business processes'}
                to={'/connected-system/' + dashboardId + '/admin/business-processes'}
            >
                {admin_route_selected === 'business-processes' && (
                    <div className={classes.sidebarLinkTextSecondSelectedHorizontalLine}></div>
                )}
                <ListItemText
                    disableTypography
                    primary={
                        <Typography variant="h5" className={classes.sidebarLinkTextSecondSelected}>
                            Business Processes
                        </Typography>
                    }
                />
            </ListItem>,
            <ListItem
                className={
                    admin_route_selected === 'business-process-templates'
                        ? classes.selectedNavLinkLevelTwo
                        : classes.navLinkLevelTwo
                }
                button
                component={Link}
                key={'business process templates'}
                to={'/connected-system/' + dashboardId + '/admin/business-process-templates'}
            >
                {admin_route_selected === 'business-process-templates' && (
                    <div className={classes.sidebarLinkTextSecondSelectedHorizontalLine}></div>
                )}
                <ListItemText
                    disableTypography
                    primary={
                        <Typography variant="h5" className={classes.sidebarLinkTextSecondSelected}>
                            Process Templates
                        </Typography>
                    }
                />
            </ListItem>
        ];
    };

    renderAdminSidebarLinks = (toggleSideBar) => {
        const { classes, dashboardId } = this.props;
        return !this.state.hideSideBar || this.state.hoverSideBar
            ? [
                  <div className={classes.exitToggleWrapper} key="exit-toogle-btn-wrapper">
                      <Button
                          key="back-to-app-button"
                          className={classes.drawerExitAdminButton}
                          component={Link}
                          to={'/connected-system/' + dashboardId}
                          aria-label="EXIT ADMIN"
                      >
                          <ArrowBackIcon
                              className={classes.drawerExitAdminButtonIcon}
                              fontSize="large"
                          ></ArrowBackIcon>
                          Exit Admin
                      </Button>
                      {this.renderToggleIcon(toggleSideBar)}
                  </div>,
                  this.renderLinks()
              ]
            : [this.renderToggleIcon(toggleSideBar)];
    };

    handleHover = (status) => {
        this.setState({
            ...this.state,
            hoverSideBar: status
        });
    };

    renderToggleIcon = (toggleSideBar) => {
        const { classes } = this.props;
        return (
            <div
                id="drawerButton"
                className={
                    !this.state.hideSideBar || this.state.hoverSideBar
                        ? classes.drawerIcon
                        : classes.drawerIconHidden
                }
            >
                <NavBarIconButton
                    edge="end"
                    title={this.state.hideSideBar ? 'Open Sidebar' : 'Collapse Menu'}
                    onClick={() => {
                        this.state.hideSideBar ? toggleSideBar(false) : toggleSideBar(true);
                    }}
                    className={classes.toggleIcon}
                    onMouseEnter={() => {
                        this.setState({
                            collapseColor: true
                        });
                    }}
                    onMouseLeave={() => {
                        this.setState({
                            collapseColor: false
                        });
                    }}
                >
                    <div className={classes.drawerIconGroup}>
                        <div className={this.state.hideSideBar ? classes.collapseHidden : ''}>
                            <Collapse
                                color={
                                    this.state.collapseColor
                                        ? this.props.theme.Toggle.DarkIconColor
                                        : this.props.theme.palette.text.revamp
                                }
                            />
                        </div>
                    </div>
                </NavBarIconButton>
            </div>
        );
    };

    render() {
        const { classes } = this.props;
        if (!document.title.endsWith(' | Admin')) {
            document.title += ' | Admin';
        }

        const toggleSideBar = (status) => {
            this.props.drawerCon();
            this.setState(() => ({
                collapse: !status,
                hoverSideBar: status,
                hideSideBar: status
            }));
        };
        return (
            <Drawer
                className={
                    this.state.hideSideBar
                        ? !this.state.collapse
                            ? classes.drawerHidden
                            : classes.drawerHidden1
                        : classes.drawer
                }
                variant="persistent"
                anchor="left"
                open={true}
                classes={{
                    paper: this.state.hideSideBar ? classes.drawerPaperHidden : classes.drawerPaper
                }}
                onMouseEnter={() => {
                    if (this.state.hideSideBar) {
                        this.setState({ collapse: true });
                        this.setState({ hoverSideBar: true });
                    }
                }}
                onMouseLeave={() => {
                    if (this.state.hideSideBar) {
                        this.setState({ hoverSideBar: false });
                    }
                }}
            >
                <div
                    className={
                        !this.state.hideSideBar
                            ? classes.sidebarLinksContainer
                            : classes.sidebarLinksContainerHidden
                    }
                >
                    <div>
                        <div>
                            <div>
                                {this.renderAdminSidebarLinks(toggleSideBar)}
                                {!this.state.hideSideBar && (
                                    <Divider className={classes.siderbarDivider} />
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <Divider className={classes.siderbarDivider} />
                        <div
                            className={
                                !this.state.hideSideBar || this.state.hoverSideBar
                                    ? classes.footer
                                    : classes.footerHidden
                            }
                        >
                            <div className={classes.footer_first}>
                                <div className={classes.footer_logo}>
                                    <div className={classes.maskIcon}></div>
                                </div>
                                {(!this.state.hideSideBar || this.state.hoverSideBar) && (
                                    <Typography className={classes.footer_text}>MathCo</Typography>
                                )}
                            </div>
                            {(!this.state.hideSideBar || this.state.hoverSideBar) && (
                                <Typography className={classes.footer_version}>
                                    {import.meta.env['REACT_APP_VERSION']}
                                </Typography>
                            )}
                        </div>
                    </div>
                </div>
            </Drawer>
        );
    }
}

Sidebar.propTypes = {
    classes: PropTypes.object.isRequired,
    dashboardId: PropTypes.string.isRequired
};

export default withStyles(
    (theme) => ({
        ...sidebarStyle(theme),
        ...breadcrumbStyle(theme)
    }),
    { withTheme: true }
)(Sidebar);
