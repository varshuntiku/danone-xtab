import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    withStyles,
    IconButton,
    Menu,
    MenuItem,
    TextField,
    ClickAwayListener,
    Dialog,
    DialogContent,
    DialogActions,
    DialogContentText
} from '@material-ui/core';
import { Link, matchPath, withRouter } from 'react-router-dom';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import { ReactComponent as ProdEnvImage } from 'assets/img/env-prod.svg';
import { ReactComponent as PreviewEnvImage } from 'assets/img/env-preview.svg';
import sidebarStyle from 'assets/jss/sidebarStyle.jsx';
import breadcrumbStyle from 'assets/jss/breadcrumbStyle';
import AppConfigWrapper, { AppConfigOptions } from '../hoc/appConfigWrapper';
import { UserInfoContext } from 'context/userInfoContent';
// import MinervaChatbot from 'components/minerva/MinervaChatbot.jsx';
import Collapse from './Nuclios/assets/Collapse';
import clsx from 'clsx';
import * as _ from 'underscore';
import { renameScreen, deleteScreen } from 'services/screen';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { getUpdatedRoutes } from 'util/app.js';
import { create_slug } from 'services/app.js';
import { setActiveScreenId, setInProgressScreenId } from 'store/slices/appScreenSlice';
import { setAppScreens } from 'store/index';

const NavBarIconButton = withStyles((theme) => ({
    colorPrimary: {
        color: theme.palette.primary.contrastText
    }
}))(IconButton);

class SideBar extends React.Component {
    static contextType = UserInfoContext;
    constructor(props) {
        super(props);

        this.props = props;
        this.scrollRef = React.createRef();
        this.navLinkRef = React.createRef();
        this.popoverAnchor = React.createRef();
        this.sideBarButtonRef = React.createRef();
        this.state = {
            hideSideBar: false,
            currentDropdownId: null,
            supportOpen: false,
            hoverSideBar: false,
            collapse: false,
            collapseColor: false,
            popOver: false,
            anchorEl: null,
            showLeftScroll: false,
            showRightScroll: true,
            showMenu: false,
            selectedSubscreens: null,
            showDescription: false,
            descriptionEl: null,
            descriptionValue: null,
            showScreenControls: false,
            screenRenameInput: false,
            screenRenameValue: null,
            currentScreenId: null,
            showDeleteScreenPopup: false,
            deleteScreenId: null,
            openPopover: false
        };
    }
    renderAdvancedFeatureLinks = () => {
        const { classes, parent } = this.props;
        const app_id = this.props?.app_info?.id;
        const { app_info } = this.props;
        const is_stories = parent?.props?.location.pathname.includes('/app/' + app_id + '/stories');

        const is_alerts = parent?.props?.location.pathname.includes('/app/' + app_id + '/alerts');

        var advanced_feature_links = [];

        if (app_info.modules.data_story && this.props.app_info.story_count) {
            advanced_feature_links.push(
                <AppConfigWrapper key={'stories'} appConfig={AppConfigOptions.data_story}>
                    <ListItem
                        className={is_stories ? classes.selectedNavLinks : classes.navLinks}
                        button
                        component={Link}
                        to={'/app/' + app_id + '/stories/list'}
                    >
                        <ListItemText
                            primary={
                                <Typography
                                    variant="h5"
                                    className={
                                        is_stories
                                            ? classes.storiesSelection
                                            : classes.storiesUnSelection
                                    }
                                >
                                    {'Stories'}
                                </Typography>
                            }
                        />
                    </ListItem>
                </AppConfigWrapper>
            );
        }

        if (this.props.app_info.modules?.alerts) {
            advanced_feature_links.push(
                <ListItem
                    key="alert"
                    className={is_alerts ? classes.selectedNavLinks : classes.navLinks}
                    component={Link}
                    button
                    to={'/app/' + app_id + '/alerts/list'}
                >
                    <ListItemText
                        primary={
                            <Typography
                                variant="h5"
                                className={
                                    is_alerts ? classes.alertSelection : classes.alertUnSelection
                                }
                            >
                                {'Alerts'}
                            </Typography>
                        }
                    />
                </ListItem>
            );
        }
        return advanced_feature_links;
    };
    showAdvanceFeat = (e) => {
        this.setState({
            openPopover: !this.state.openPopover,
            anchorEl: e.currentTarget
        });
    };
    closeAdvanceFeat = () => {
        this.setState({
            openPopover: false
        });
    };
    componentDidUpdate(prevProps) {
        if (
            (this.props.inProgressScreenId &&
                this.props.activeScreenId &&
                this.props.inProgressScreenId !== this.props.activeScreenId) ||
            (this.props.app_info?.modules?.dashboard &&
                this.props?.location?.pathname.endsWith(
                    `/app/${this.props.app_info.id}/dashboard`
                ) &&
                this.props.inProgressScreenId)
        ) {
            const screenName = this.props.appScreens?.find(
                (appScreen) => appScreen.id === this.props.inProgressScreenId
            ).screen_name;
            this.props.setActiveScreenId(this.props.inProgressScreenId);
            this.props.setInProgressScreenId(null);
            this.props.history.push(`/app/${this.props.app_id}/${create_slug(screenName)}`);
        }
        if (
            !this.props.top_navbar &&
            (this.props.askNucliosOpen !== prevProps.askNucliosOpen ||
                this.props.commentsOpen !== prevProps.commentsOpen ||
                this.props.widgetComment !== prevProps.widgetComment)
        ) {
            if (this.props.askNucliosOpen || this.props.commentsOpen || this.props.widgetComment) {
                if (this.sideBarButtonRef) {
                    if (!this.state.hideSideBar) this.sideBarButtonRef.current.click();
                }
            } else {
                if (this.sideBarButtonRef) {
                    if (this.state.hideSideBar) this.sideBarButtonRef.current.click();
                }
            }
        }
    }

    componentDidMount() {
        const hide = this.props.hide;
        const top_navbar = this.props.top_navbar;
        this.props.routes.forEach((route) => {
            if (route.expandable && (route.expanded || route.selected)) {
                if (top_navbar) {
                    const screenName = route.href?.split('/')[3];
                    const subScreens = this.props.routes
                        .filter((el) => el?.href?.split('/')[3] === screenName)
                        .filter((el, i) => i > 0 && el.level === 1);
                    this.props.showItemOnHover(
                        [...subScreens.map((el) => el.screen_item.id)],
                        false
                    );
                }
                this.setState({
                    currentDropdownId: route?.screen_item?.id
                });
            }
        });
        if (hide) {
            this.props.drawerCon();
            this.setState(() => ({
                collapse: !hide,
                // hoverSideBar: !hide,
                hideSideBar: hide
            }));
        }
        this.setState({
            showRightScroll:
                this.scrollRef?.current?.scrollWidth > this.scrollRef?.current?.clientWidth
        });
    }

    screenDeleteHandler = (e, screenId) => {
        e.preventDefault();
        this.setState({ showDeleteScreenPopup: true, deleteScreenId: screenId });
    };

    screenDeleteConfirmationHandler = (e, screenId, self) => {
        deleteScreen({
            appId: self.props.app_id,
            screenId,
            callback: () => {
                const [updatedRoutes, updatedRawScreens, redirectUrl] = getUpdatedRoutes(
                    self.props.routes,
                    screenId,
                    null,
                    'delete',
                    self.props.rawScreens,
                    self.props.app_id
                );
                self.props.parent.updateRoutes(updatedRoutes.filter((r) => r !== null));
                self.props.setAppScreens(updatedRawScreens.filter((r) => r !== null));
                redirectUrl && self.props.history.push(redirectUrl);
            }
        });
        this.handleClose(e);
    };

    screenRenameHandler = (e, screenName) => {
        this.setState({
            screenRenameInput: true,
            screenRenameValue: screenName
        });
        this.handleClose(e);
    };

    handleClick = (event, index) => {
        this.setState({
            anchorEl: event.currentTarget,
            showScreenControls: true,
            currentScreenId: index
        });
    };

    handleClose = (e) => {
        e.preventDefault();
        this.setState({
            anchorEl: null,
            showScreenControls: false,
            showDeleteScreenPopup: false,
            deleteScreenId: null
        });
    };

    onChangeHandler = (value) => {
        this.setState({ screenRenameValue: value });
    };

    clickAwayHandler = (screenId) => {
        renameScreen({
            appId: this.props.app_id,
            screenId,
            payload: {
                screen_name: this.state.screenRenameValue
            }
        });
        const [updatedRoutes, updatedRawScreens] = getUpdatedRoutes(
            this.props.routes,
            screenId,
            this.state.screenRenameValue,
            'rename',
            this.props.rawScreens,
            this.props.app_id
        );
        this.props.parent.updateRoutes(updatedRoutes);
        this.props.setAppScreens(updatedRawScreens.filter((r) => r !== null));
        this.setState({ screenRenameInput: false, currentScreenId: null });
    };

    isStoriesSelected = () => {
        const { parent } = this.props;

        var url_slugs = [];
        if (
            parent.props.location.pathname.endsWith('/app/' + this.props.app_id + '/') ||
            parent.props.location.pathname.endsWith('/app/' + this.props.app_id)
        ) {
            url_slugs = [];
        } else {
            url_slugs = parent.props.location.pathname
                .replace('/app/' + this.props.app_id + '/', '||||')
                .split('||||')[1]
                .split('/');
        }

        if (url_slugs.length >= 0 && url_slugs[0] === 'stories') {
            return true;
        }
        return false;
    };

    itemClickHandler = (e) => {
        const dropdownId =
            this.state.currentDropdownId && this.state.currentDropdownId == e.target.id
                ? null
                : e.target.id;
        this.setState({
            currentDropdownId: dropdownId
        });
    };
    openPopOver = (e, href, item) => {
        const dropdownId = e.target.id;
        this.navLinkRef.current = e.target;
        this.navLinkRef.current.href = href;
        const descValue = item?.screen_item?.screen_description;
        const screenName = href?.split('/')[3];
        const subScreens = this.props.routes
            .filter((el) => el?.href?.split('/')[3] === screenName)
            .filter((el, i) => i > 0 && el.level === 1);
        if (this.state.selectedSubscreens) {
            this.props.showItemOnHover(
                [...this.state.selectedSubscreens.map((el) => el.screen_item.id)],
                false
            );
        }
        if (!this.state.showMenu) this.setState({ showMenu: true });
        this.setState(
            {
                popOver: true,
                anchorEl: e.target,
                currentDropdownId: dropdownId,
                selectedSubscreens: subScreens,
                descriptionValue: descValue
            },
            () => this.props.showItemOnHover([...subScreens.map((el) => el.screen_item.id)], true)
        );
        this.scrollRef.current.popover_width = e?.target?.clientWidth;
    };
    closePopover = () => {
        if (this.state.showMenu) this.setState({ showMenu: false });
        setTimeout(() => {
            if (this.state.showMenu) return;
            this.setState({ popOver: false, anchorEl: null, dropdownId: null }, () => {
                const screenName = this.navLinkRef?.current?.href?.split('/')[3];
                const subScreens = this.props.routes
                    .filter((el) => el.href.includes(screenName))
                    .filter((el, i) => i > 0 && el.level === 1);
                this.navLinkRef.current.href = null;
                this.props.showItemOnHover([...subScreens.map((el) => el.screen_item.id)], false);
            });
        }, 200);
    };
    handlePaperHover = () => {
        this.setState({ showMenu: true });
    };

    showDescription = (e, description) => {
        const descValue = description;
        this.setState({
            showDescription: true,
            descriptionValue: descValue,
            descriptionEl: e.target
        });
    };
    closeDescription = () => {
        this.setState({
            showDescription: false,
            descriptionEl: null,
            descriptionValue: null
        });
    };

    renderScreenDescription = () => {
        const { top_navbar, classes } = this.props;
        return top_navbar && this?.state?.descriptionValue ? (
            <Popover
                open={this?.state?.showDescription}
                anchorEl={this?.state?.descriptionEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                className={classes.popover}
                classes={{
                    paper: classes.descriptionPopoverContent
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                PaperProps={{
                    style: {
                        marginTop: '12px'
                    }
                }}
            >
                <div className={classes.descriptionContainer}>
                    <ListItemText
                        primary={
                            <Typography variant="h5" className={classes.descriptionText}>
                                {this.state.descriptionValue}
                            </Typography>
                        }
                    />
                </div>
            </Popover>
        ) : null;
    };

    renderApplicationLinks = (breadcrumbItems, self) => {
        const { classes, routes, top_navbar, app_info, app_id } = this.props;
        const is_dashboard = parent.props?.location?.pathname.endsWith(
            '/app/' + app_id + '/dashboard'
        );
        const hide = this.state.hideSideBar;
        const hoverHide = false;
        let levelTwo = [];
        let apps = routes.length;
        var application_links = [];
        let edit_production_app = this.context.nac_roles[0]?.permissions.find(
            (permission) => permission.name === 'EDIT_PRODUCTION_APP'
        );
        let create_preview_app = this.context.nac_roles[0]?.permissions.find(
            (permission) => permission.name === 'CREATE_PREVIEW_APP'
        );
        if (top_navbar && app_info['modules']['dashboard']) {
            application_links.push(
                <ListItem
                    to={'/app/' + app_id + '/dashboard'}
                    className={classes.topbar_navLink}
                    component={Link}
                >
                    <Typography
                        className={clsx(
                            !this.state.hideSideBar || this.state.hoverSideBar
                                ? classes.homeSectionText
                                : classes.drawerCollapseHidden,
                            !is_dashboard
                                ? classes.homeSectionNotSelected
                                : classes.homeSectionSelected
                        )}
                    >
                        Home
                    </Typography>
                </ListItem>
            );
        }
        _.each(routes, function (route_item) {
            apps -= 1;
            if (route_item.screen_item.hidden) {
                return;
            }
            if (route_item.href) {
                if (!route_item.level) {
                    if (levelTwo.length > 0) {
                        let levelTwoSection = top_navbar ? (
                            <Popover
                                open={self?.state?.popOver}
                                anchorEl={self?.state?.anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center'
                                }}
                                className={classes.popover}
                                classes={{
                                    paper: classes.popoverContent
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center'
                                }}
                                PaperProps={{
                                    style: {
                                        marginTop: '8px',
                                        minWidth: self?.scrollRef?.current?.popover_width
                                    },
                                    onMouseEnter: self.handlePaperHover,
                                    onMouseLeave: self.closePopover
                                }}
                                hideBackdrop={true}
                            >
                                <div className={classes.topnav_screenLevel}>
                                    {self.state?.descriptionValue ? (
                                        <ListItem className={classes.subScreenDescriptionContainer}>
                                            <ListItemText
                                                primary={
                                                    <Typography
                                                        variant="h5"
                                                        className={classes.descriptionText}
                                                    >
                                                        {self.state?.descriptionValue}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    ) : null}
                                    {levelTwo.map((el) => el)}
                                </div>
                            </Popover>
                        ) : (
                            <div className={classes.screenLevel}>{levelTwo.map((el) => el)}</div>
                        );
                        application_links.push(levelTwoSection);
                        levelTwo = [];
                    }
                    application_links.push(
                        <ListItem
                            className={`${route_item.selected || route_item.expanded
                                    ? !hide || hoverHide
                                        ? `${classes.selectedNavLink} ${top_navbar ? classes.selectedNavLink_top : ''
                                        } ${route_item.selectedClass ? classes.selectedTxt : ''}`
                                        : classes.selectedNavLinkHidden
                                    : !hide || hoverHide
                                        ? top_navbar
                                            ? `${classes.topbar_navLink} ${route_item.expandable ? classes.topbar_hover : ''
                                            }`
                                            : classes.navLink
                                        : classes.navLinkHidden
                                } ${self.props.hightlightScreenId &&
                                    self.props.hightlightScreenId === route_item?.screen_item?.id
                                    ? classes.highlighterStyles
                                    : ''
                                }`}
                            component={top_navbar ? (route_item.expandable ? null : Link) : Link}
                            key={route_item.screen_item.screen_name}
                            to={route_item.href}
                            id={`screen+${route_item?.screen_item?.id}`}
                            {...(route_item.expandable && top_navbar
                                ? {
                                    onMouseEnter: (e) =>
                                        self.openPopOver(e, route_item.href, route_item),
                                    onMouseLeave: self.closePopover
                                }
                                : {
                                    ...(route_item.expandable
                                        ? { onClick: self.itemClickHandler }
                                        : {
                                            ...(top_navbar
                                                ? {
                                                    onMouseEnter: (e) =>
                                                        self.showDescription(
                                                            e,
                                                            route_item?.screen_item
                                                                ?.screen_description
                                                        ),
                                                    onMouseLeave: self.closeDescription
                                                }
                                                : {})
                                        })
                                })}
                        >
                            <ListItemText
                                primary={
                                    <Typography
                                        variant="h5"
                                        className={
                                            route_item.selected || route_item.expanded
                                                ? !hide || hoverHide
                                                    ? !top_navbar
                                                        ? classes.sidebarLinkTextSelected
                                                        : classes.topnav_sidebarLinkTextSelected
                                                    : classes.sidebarLinkTextSelectedHidden1
                                                : !hide || hoverHide
                                                    ? !top_navbar
                                                        ? classes.sidebarLinkText
                                                        : classes.topbarLinkText
                                                    : classes.sidebarLinkTextHide
                                        }
                                        id={route_item?.screen_item?.id}
                                    >
                                        {self.state.screenRenameInput &&
                                            self.state.currentScreenId ===
                                            route_item?.screen_item?.id ? (
                                            <ClickAwayListener
                                                onClickAway={() =>
                                                    self.clickAwayHandler(
                                                        route_item?.screen_item?.id
                                                    )
                                                }
                                            >
                                                <TextField
                                                    id="screen-rename"
                                                    variant="outlined"
                                                    size="small"
                                                    value={self.state.screenRenameValue}
                                                    onChange={(e) => {
                                                        e.preventDefault();
                                                        self.onChangeHandler(e.target.value);
                                                    }}
                                                    onClick={(e) => e.preventDefault()}
                                                    classes={classes.screenRenameStyle}
                                                />
                                            </ClickAwayListener>
                                        ) : (
                                            `${route_item.screen_item.screen_name}`
                                        )}
                                        <div className={classes.actionsWrapper}>
                                            {route_item.expandable && !top_navbar ? (
                                                (route_item.selected || route_item.expanded) &&
                                                    self.state.currentDropdownId ==
                                                    route_item?.screen_item?.id ? (
                                                    <ExpandLessIcon
                                                        fontSize={'large'}
                                                        className={classes.expandIcon}
                                                    />
                                                ) : (
                                                    <ExpandMoreIcon
                                                        fontSize={'large'}
                                                        className={classes.expandIcon}
                                                    />
                                                )
                                            ) : route_item.expandable ? (
                                                self.state.popOver &&
                                                    self.state.currentDropdownId ==
                                                    `screen+${route_item?.screen_item?.id}` ? (
                                                    <ExpandLessIcon
                                                        fontSize={'large'}
                                                        className={classes.expandIcon}
                                                    />
                                                ) : (
                                                    <ExpandMoreIcon
                                                        fontSize={'large'}
                                                        className={classes.expandIcon}
                                                    />
                                                )
                                            ) : null}
                                            {((self.props.app_info.environment == 'preview' &&
                                                create_preview_app) ||
                                                (self.props.app_info.environment == 'prod' &&
                                                    edit_production_app)) && self.props.user_permissions?.app_publish &&
                                                route_item?.level === 0 ? (
                                                    <>
                                                        <IconButton
                                                    aria-label="more"
                                                    aria-controls="long-menu"
                                                    aria-haspopup="true"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        self.handleClick(
                                                            e,
                                                            route_item?.screen_item?.id
                                                        );
                                                    }}
                                                    size="medium"
                                                    title="more"
                                                    className={`${classes.noMargin} ${classes.hoverStyle}`}
                                                >
                                                    <MoreVertIcon fontSize="medium" />
                                                        </IconButton>
                                                        <Menu
                                                id="simple-menu"
                                                anchorEl={self.state.anchorEl}
                                                keepMounted
                                                open={
                                                    self.state.showScreenControls &&
                                                    self.state.currentScreenId ===
                                                    route_item?.screen_item?.id
                                                }
                                                onClose={self.handleClose}
                                                elevation={0}
                                                className={classes.menuItem}
                                            >
                                                <MenuItem
                                                    key="screen-rename"
                                                    onClick={(e) =>
                                                        self.screenRenameHandler(
                                                            e,
                                                            route_item.screen_item.screen_name
                                                        )
                                                    }
                                                >
                                                    Rename
                                                </MenuItem>
                                                <MenuItem
                                                    key="screen-delete"
                                                    onClick={(e) =>
                                                        self.screenDeleteHandler(
                                                            e,
                                                            route_item?.screen_item?.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </MenuItem>
                                            </Menu>
                                                    </>
                                            ) : null}
                                        </div>
                                    </Typography>
                                }
                            />
                            {self.renderScreenDescription(
                                route_item?.screen_item?.screen_description
                            )}
                        </ListItem>
                    );
                } else if (
                    route_item.level === 1 &&
                    route_item.show &&
                    self.state.currentDropdownId
                ) {
                    levelTwo.push(
                        <ListItem
                            className={
                                route_item.selected
                                    ? `${top_navbar
                                        ? classes.topnav_selectedNavLinkLevelTwo1
                                        : classes.selectedNavLinkLevelTwo1
                                    } ${!hide || hoverHide
                                        ? top_navbar
                                            ? classes.topnav_selectedNavLinkLevelTwoHidden
                                            : classes.selectedNavLinkLevelTwoHidden
                                        : null
                                    }`
                                    : `${classes.navLinkLevelTwo1} ${!hide || hoverHide
                                        ? top_navbar
                                            ? classes.topnav_selectedNavLinkLevelTwoHidden
                                            : classes.selectedNavLinkLevelTwoHidden
                                        : null
                                    } ${top_navbar ? classes.topnav_navLinkLevelTwo1 : ''}`
                            }
                            button
                            component={Link}
                            key={route_item.screen_item.screen_name}
                            to={route_item.href}
                        >
                            <ListItemText
                                primary={
                                    <Typography
                                        variant="h5"
                                        className={
                                            route_item.selected
                                                ? `${!top_navbar
                                                    ? classes.sidebarLinkTextSecondSelected
                                                    : classes.topnav_sidebarLinkTextSecondSelected
                                                } ${!hide || hoverHide
                                                    ? classes.sidebarLinkTextSecondSelectedHidden
                                                    : null
                                                }`
                                                : `${!top_navbar
                                                    ? classes.sidebarLinkTextSecond
                                                    : classes.top_navbarLinkTextSecond
                                                } ${!hide || hoverHide
                                                    ? classes.sidebarLinkTextSecondSelectedHidden
                                                    : null
                                                }`
                                        }
                                        id="truncate"
                                    >
                                        {route_item.screen_item.screen_name}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    );
                }
            }
        });
        if (apps == 0 && levelTwo.length > 0) {
            let levelTwoSection = top_navbar ? (
                <Popover
                    open={self?.state?.popOver}
                    anchorEl={self?.state?.anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    className={classes.popover}
                    classes={{
                        paper: classes.popoverContent
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                    PaperProps={{
                        style: {
                            marginTop: '8px',
                            minWidth: self?.scrollRef?.current?.popover_width
                        },
                        onMouseEnter: self.handlePaperHover,
                        onMouseLeave: self.closePopover
                    }}
                    hideBackdrop={true}
                >
                    {self?.state?.descriptionValue ? (
                        <ListItem className={classes.subScreenDescriptionContainer}>
                            <ListItemText
                                primary={
                                    <Typography variant="h5" className={classes.descriptionText}>
                                        {self?.state?.descriptionValue}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ) : null}
                    <div className={classes.topnav_screenLevel}>{levelTwo.map((el) => el)}</div>
                </Popover>
            ) : (
                <div className={classes.screenLevel}>{levelTwo.map((el) => el)}</div>
            );
            application_links.push(levelTwoSection);
            levelTwo = [];
        }
        return application_links;
    };

    renderEnvLinks = (env_name, env_key) => {
        const { app_id, app_info } = this.props;

        var env_details = _.find(app_info.env_apps, function (env_app) {
            return env_app.environment === env_key;
        });

        const match = matchPath(window.location.pathname, {
            path: '/app/:app_id/admin/create-version/:env_key'
        });

        var selected_env_id = env_details ? env_details.id : false;
        var admin_env_selected = false;
        var path_env_key = match?.params?.env_key ? match?.params?.env_key : false;

        if (path_env_key) {
            admin_env_selected = env_key === path_env_key;
        } else {
            if (env_details) {
                admin_env_selected = env_details.id === parseInt(app_id);
            }
        }

        if (env_details) {
            return this.renderExistingEnvLinks(
                env_name,
                env_key,
                admin_env_selected,
                selected_env_id
            );
        } else {
            return this.renderNewEnvLinks(env_name, env_key, admin_env_selected);
        }
    };

    renderNewEnvLinks = (env_name, env_key, admin_env_selected) => {
        const { classes, app_id } = this.props;

        return [
            <ListItem
                className={admin_env_selected ? classes.selectedNavLink : classes.navLink}
                component={Link}
                key={env_name}
                to={'/app/' + app_id + '/admin/create-version/' + env_key}
            >
                <ListItemIcon
                    className={
                        admin_env_selected
                            ? classes.advancedIconRootSelected
                            : classes.advancedIconRoot
                    }
                >
                    {env_key === 'prod' && <ProdEnvImage />}
                    {env_key === 'preview' && <PreviewEnvImage />}
                </ListItemIcon>
                <ListItemText
                    primary={
                        <Typography variant="h5" className={classes.sidebarLinkText}>
                            {env_name}
                            {admin_env_selected ? (
                                <ExpandLessIcon fontSize={'large'} />
                            ) : (
                                <ExpandMoreIcon fontSize={'large'} />
                            )}
                        </Typography>
                    }
                />
            </ListItem>,
            admin_env_selected &&
            this.context.nac_roles[0]?.permissions.find(
                (permission) => permission.name === 'PROMOTE_APP'
            ) && (
                <ListItem
                    className={classes.selectedNavLinkLevelTwo}
                    button
                    component={Link}
                    key={'create-version'}
                    to={'/app/' + app_id + '/admin/create-version/' + env_key}
                >
                    <div className={classes.sidebarLinkTextSecondSelectedHorizontalLine}></div>
                    <ListItemText
                        disableTypography
                        primary={
                            <Typography
                                variant="h5"
                                className={classes.sidebarLinkTextSecondSelected}
                            >
                                Create Version
                            </Typography>
                        }
                    />
                </ListItem>
            )
        ];
    };

    renderExistingEnvLinks = (env_name, env_key, admin_env_selected, selected_env_id) => {
        const { classes, parent } = this.props;

        var admin_route_selected = false;
        if (
            parent.props.location.pathname.includes('/app/' + selected_env_id + '/admin/overview')
        ) {
            admin_route_selected = 'overview';
        } else if (
            parent.props.location.pathname.includes('/app/' + selected_env_id + '/admin/modules')
        ) {
            admin_route_selected = 'modules';
        } else if (
            parent.props.location.pathname.includes('/app/' + selected_env_id + '/admin/screens')
        ) {
            admin_route_selected = 'screens';
        } else if (
            parent.props.location.pathname.includes('/app/' + selected_env_id + '/admin/blueprints')
        ) {
            admin_route_selected = 'blueprints';
        } else if (
            parent.props.location.pathname.includes('/app/' + selected_env_id + '/admin/Configure')
        ) {
            admin_route_selected = 'Configure';
        }

        return [
            <ListItem
                className={admin_env_selected ? classes.selectedNavLink : classes.navLink}
                component={Link}
                key={env_name}
                to={'/app/' + selected_env_id + '/admin/overview'}
            >
                <ListItemIcon
                    className={
                        admin_env_selected
                            ? classes.advancedIconRootSelected
                            : classes.advancedIconRoot
                    }
                >
                    {env_key === 'prod' && <ProdEnvImage />}
                    {env_key === 'preview' && <PreviewEnvImage />}
                </ListItemIcon>
                <ListItemText
                    primary={
                        <Typography variant="h5" className={classes.sidebarLinkText}>
                            {env_name}
                            {admin_env_selected ? (
                                <ExpandLessIcon fontSize={'large'} />
                            ) : (
                                <ExpandMoreIcon fontSize={'large'} />
                            )}
                        </Typography>
                    }
                />
            </ListItem>,
            admin_env_selected && (
                <ListItem
                    className={
                        admin_route_selected === 'overview'
                            ? classes.selectedNavLinkLevelTwo
                            : classes.navLinkLevelTwo
                    }
                    button
                    component={Link}
                    key={'basic information'}
                    to={'/app/' + selected_env_id + '/admin/overview'}
                >
                    {admin_route_selected === 'overview' ? (
                        <div className={classes.sidebarLinkTextSecondSelectedHorizontalLine}></div>
                    ) : (
                        ''
                    )}
                    <ListItemText
                        disableTypography
                        primary={
                            <Typography
                                variant="h5"
                                className={classes.sidebarLinkTextSecondSelected}
                            >
                                Overview
                            </Typography>
                        }
                    />
                </ListItem>
            ),
            admin_env_selected && (
                <ListItem
                    className={
                        admin_route_selected === 'modules'
                            ? classes.selectedNavLinkLevelTwo
                            : classes.navLinkLevelTwo
                    }
                    button
                    component={Link}
                    key={'select modules'}
                    to={'/app/' + selected_env_id + '/admin/modules'}
                >
                    {admin_route_selected === 'modules' ? (
                        <div className={classes.sidebarLinkTextSecondSelectedHorizontalLine}></div>
                    ) : (
                        ''
                    )}
                    <ListItemText
                        disableTypography
                        primary={
                            <Typography
                                variant="h5"
                                className={classes.sidebarLinkTextSecondSelected}
                            >
                                Modules
                            </Typography>
                        }
                    />
                </ListItem>
            ),
            admin_env_selected && (
                <ListItem
                    className={
                        admin_route_selected === 'screens'
                            ? classes.selectedNavLinkLevelTwo
                            : classes.navLinkLevelTwo
                    }
                    button
                    component={Link}
                    key={'configure_screens'}
                    to={'/app/' + selected_env_id + '/admin/screens'}
                >
                    {admin_route_selected === 'screens' ? (
                        <div className={classes.sidebarLinkTextSecondSelectedHorizontalLine}></div>
                    ) : (
                        ''
                    )}
                    <ListItemText
                        disableTypography
                        primary={
                            <Typography
                                variant="h5"
                                className={classes.sidebarLinkTextSecondSelected}
                            >
                                Screens
                            </Typography>
                        }
                    />
                </ListItem>
            ),
            admin_env_selected && (
                <ListItem
                    className={
                        admin_route_selected === 'blueprints'
                            ? classes.selectedNavLinkLevelTwo
                            : classes.navLinkLevelTwo
                    }
                    button
                    component={Link}
                    key={'blueprints'}
                    to={'/app/' + selected_env_id + '/admin/blueprints'}
                >
                    {admin_route_selected === 'blueprints' ? (
                        <div className={classes.sidebarLinkTextSecondSelectedHorizontalLine}></div>
                    ) : (
                        ''
                    )}
                    <ListItemText
                        disableTypography
                        primary={
                            <Typography
                                variant="h5"
                                className={classes.sidebarLinkTextSecondSelected}
                            >
                                Blueprints
                            </Typography>
                        }
                    />
                </ListItem>
            ),
            admin_env_selected && (
                <ListItem
                    className={
                        admin_route_selected === 'Configure'
                            ? classes.selectedNavLinkLevelTwo
                            : classes.navLinkLevelTwo
                    }
                    button
                    component={Link}
                    key={'Configure'}
                    to={'/app/' + selected_env_id + '/admin/Configure'}
                >
                    {admin_route_selected === 'Configure' ? (
                        <div className={classes.sidebarLinkTextSecondSelectedHorizontalLine}></div>
                    ) : (
                        ''
                    )}
                    <ListItemText
                        disableTypography
                        primary={
                            <Typography
                                variant="h5"
                                className={classes.sidebarLinkTextSecondSelected}
                            >
                                Configure
                            </Typography>
                        }
                    />
                </ListItem>
            )
        ];
    };

    renderAdminSidebarLinks = (toggleSideBar) => {
        const { classes, app_info } = this.props;
        // var prod_env_app = _.find(app_info.env_apps, function(env_app) {
        //   return env_app.environment === 'prod';
        // });

        // var preview_env_app = _.find(app_info.env_apps, function(env_app) {
        //   return env_app.environment === 'preview';
        // });

        return !this.state.hideSideBar || this.state.hoverSideBar
            ? [
                <div className={classes.exitToggleWrapper} key="exit-toogle-btn-wrapper">
                    <Button
                        key="back-to-app-button"
                        className={classes.drawerExitAdminButton}
                        component={Link}
                        to={'/app/' + app_info.id}
                        aria-label="EXIT ADMIN"
                        onClick={this.handleExit}
                    >
                        <ArrowBackIcon
                            className={classes.drawerExitAdminButtonIcon}
                            fontSize="large"
                        ></ArrowBackIcon>
                        Exit Admin
                    </Button>
                    {this.renderToggleIcon(toggleSideBar)}
                </div>,
                this.renderEnvLinks('PREVIEW', 'preview'),
                this.renderEnvLinks('PROD', 'prod')
            ]
            : [this.renderToggleIcon(toggleSideBar)];
    };

    handleSupport = () => {
        this.setState({
            supportOpen: !this.state.supportOpen
        });
    };

    handleHover = () => {
        this.setState({
            ...this.state
            // hoverSideBar: status
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
                        this.props.shouldScenarioFullMode(this.state.hideSideBar);
                    }}
                    className={classes.toggleIcon}
                    ref={this.sideBarButtonRef}
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
    handleScroll = (direction) => {
        this.scrollRef.current.prevScroll = this.scrollRef.current.scrollLeft;
        direction === 'left'
            ? (this.scrollRef.current.scrollLeft -= 200)
            : (this.scrollRef.current.scrollLeft += 200);
        if (this.scrollRef.current.scrollLeft > 0) {
            this.setState({ showLeftScroll: true });
        } else {
            this.setState({ showLeftScroll: false });
        }
        let difference = this.scrollRef.current.scrollLeft - this.scrollRef.current.prevScroll;
        if (difference < 198 && difference > -196 && this.scrollRef?.current?.scrollLeft != 0) {
            this.setState({ showRightScroll: false });
        } else {
            this.setState({ showRightScroll: true });
        }
    };
    handleExit = () => {
        const { top_navbar, drawerCondtion } = this.props;
        if (top_navbar) {
            drawerCondtion ? this.props.drawerCon() : null;
            this.setState({
                collapse: false,
                // hoverSideBar: false,
                hideSideBar: false
            });
        }
    };

    renderDeleteDialog = () => {
        return (
            <div>
                <Dialog
                    open={this.state.showDeleteScreenPopup}
                    onClose={this.handleClose}
                    aria-labelledby="screen-delete-alert-dialog-title"
                    aria-describedby="screen-delete-alert-dialog-description"
                    classes={{
                        paper: this.props.classes.dialogStyles
                    }}
                >
                    <DialogContent>
                        <DialogContentText id="screen-delete-alert-dialog-description">
                            {`Are you sure you want to delete this screen? You won't be able to undo this action.
                        Please note if it has subscreens, tabs or screen steppers under it, all of them
                        will be deleted as well.`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} size="small">
                            Cancel
                        </Button>
                        <Button
                            onClick={(e) =>
                                this.screenDeleteConfirmationHandler(
                                    e,
                                    this.state.deleteScreenId,
                                    this
                                )
                            }
                            autoFocus
                            size="small"
                            className={this.props.classes.confirmBtnStyles}
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    };

    render() {
        const { classes, app_info, app_id, parent, top_navbar, adminScreen, isDsWorkbench } =
            this.props;
        const is_dashboard = parent.props?.location?.pathname.endsWith(
            '/app/' + app_id + '/dashboard'
        );
        const is_admin = parent.props?.location?.pathname.includes('/app/' + app_id + '/admin');

        const is_diagnoseme = parent.props?.location?.pathname.endsWith('/diagnoseme');
        const advanceFeatures = this.renderAdvancedFeatureLinks();
        // const advancedNavList = this.renderAdvancedFeatureLinks();

        var breadcrumbItems = [];

        if (is_dashboard) {
            document.title += ' | Dashboard';
        }

        if (is_admin) {
            document.title += ' | Admin';
        }

        if (is_diagnoseme) {
            document.title += ' | Diagnoseme';
        }

        const toggleSideBar = (status) => {
            this.props.drawerCon();
            this.setState(() => ({
                collapse: !status,
                // hoverSideBar: status,
                hideSideBar: status
            }));
        };

        return (
            <>
                <Drawer
                    className={
                        this.state.hideSideBar
                            ? !this.state.collapse
                                ? classes.drawerHidden
                                : classes.drawerHidden1
                            : top_navbar && !adminScreen
                                ? classes.topnav_drawer
                                : classes.drawer
                    }
                    variant="persistent"
                    anchor="left"
                    open={true}
                    classes={{
                        paper: this.state.hideSideBar
                            ? classes.drawerPaperHidden
                            : top_navbar
                                ? classes.topbar_drawerPaper
                                : classes.drawerPaper
                    }}
                    // onMouseEnter={() => {
                    //     if (this.state.hideSideBar) {
                    //         this.setState({ collapse: true });
                    //         this.setState({ hoverSideBar: true });
                    //     }
                    // }}
                    // onMouseLeave={() => {
                    //     if (this.state.hideSideBar) {
                    //         this.setState({ hoverSideBar: false });
                    //     }
                    // }}
                    data-testid="sidebar-container"
                >
                    {top_navbar && this.state.showLeftScroll && !adminScreen ? (
                        <Button
                            onClick={() => this.handleScroll('left')}
                            className={classes.leftBtn}
                        >
                            <ChevronLeftRoundedIcon />
                        </Button>
                    ) : null}
                    <div
                        className={
                            !this.state.hideSideBar
                                ? !top_navbar
                                    ? classes.sidebarLinksContainer
                                    : classes.topbar_sidebarLinksContainer
                                : classes.sidebarLinksContainerHidden
                        }
                        ref={this.scrollRef}
                    >
                        <div>
                            <div>
                                {!top_navbar ? (
                                    <div
                                        className={
                                            !this.state.hideSideBar || this.state.hoverSideBar
                                                ? classes.homeSectionDrawer
                                                : classes.homeSectionDrawerHide
                                        }
                                    >
                                        {!is_admin && app_info['modules']['dashboard'] ? (
                                            <div
                                                className={
                                                    is_dashboard
                                                        ? classes.homeSectionBackground
                                                        : classes.homeSectionBackground1
                                                }
                                            >
                                                <Link
                                                    to={
                                                        isDsWorkbench
                                                            ? '/ds-workbench/project/' +
                                                            app_info.projectId +
                                                            '/deploy/applications'
                                                            : '/app/' + app_id + '/dashboard'
                                                    }
                                                    className={
                                                        !this.state.hideSideBar ||
                                                            this.state.hoverSideBar
                                                            ? classes.homeSection
                                                            : classes.homeSectionHidden
                                                    }
                                                >
                                                    <Typography
                                                        className={clsx(
                                                            !this.state.hideSideBar ||
                                                                this.state.hoverSideBar
                                                                ? classes.homeSectionText
                                                                : classes.drawerCollapseHidden,
                                                            !is_dashboard
                                                                ? classes.homeSectionNotSelected
                                                                : classes.homeSectionSelected
                                                        )}
                                                    >
                                                        {isDsWorkbench
                                                            ? 'Back To Applications'
                                                            : 'Home'}
                                                    </Typography>
                                                </Link>
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        {!is_admin && !top_navbar
                                            ? this.renderToggleIcon(toggleSideBar)
                                            : null}
                                    </div>
                                ) : null}

                                <div>
                                    {is_admin ? this.renderAdminSidebarLinks(toggleSideBar) : ''}
                                    <div
                                        className={
                                            !this.state.hideSideBar || this.state.hoverSideBar
                                                ? !top_navbar
                                                    ? classes.applicationCategory
                                                    : classes.topbar_applicationCategory
                                                : classes.applicationCategoryHidden
                                        }
                                    ></div>
                                    {!is_admin &&
                                        (!this.state.hideSideBar || this.state.hoverSideBar) ? (
                                        <div
                                            className={clsx(
                                                !this.state.hoverSideBar
                                                    ? !top_navbar
                                                        ? classes.applicationScreenContainer
                                                        : classes.topbar_applnScreenCont
                                                    : classes.appScreenContainerOnHover
                                            )}
                                        >
                                            {this.renderApplicationLinks(breadcrumbItems, this)}
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            {!is_admin && !this.props?.app_info?.modules?.top_navbar &&
                                advanceFeatures.length &&
                                (!this.state.hideSideBar || this.state.hoverSideBar) ? (
                                <div
                                    ref={this.popoverAnchor}
                                    className={clsx(
                                        classes.advancedFeatures,
                                        this.state.openPopover ? classes.hoverAdvanceFeat : ''
                                    )}
                                    onClick={(e) => this.showAdvanceFeat(e)}
                                >
                                    <span>
                                        Advanced Features{' '}
                                        {!this.state.openPopover ? (
                                            <KeyboardArrowDownIcon />
                                        ) : (
                                            <KeyboardArrowUpIcon />
                                        )}
                                    </span>
                                </div>
                            ) : null}
                            {!is_admin && !this.props?.app_info?.modules?.top_navbar &&
                                advanceFeatures.length &&
                                (!this.state.hideSideBar || this.state.hoverSideBar)
                                ? this.state.openPopover && (
                                    <ListItem
                                        anchorEl={this.popoverAnchor.current}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left'
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left'
                                        }}
                                        className={classes.popoverForAdvancedFeatures}
                                        classes={{
                                            paper: classes.popoverContentForAdvancedFeatures
                                        }}
                                        disableRestoreFocus
                                    >
                                        {advanceFeatures}
                                    </ListItem>
                                )
                                : null}
                        </div>
                        {!top_navbar ? (
                            <div className={classes.footerHolder}>
                                {/* <div
                                    className={
                                        !this.state.hideSideBar || this.state.hoverSideBar
                                            ? classes.minerva
                                            : classes.minervaDrawerCollapseHidden
                                    }
                                >
                                    {(app_info?.modules?.minerva?.enabled &&
                                        app_info?.modules?.minerva?.tenant_id) ||
                                    (app_info?.modules?.copilot?.enabled &&
                                        app_info?.modules?.copilot?.app_id) ? (
                                        !is_admin ? (
                                            <MinervaChatbot
                                                app_info={app_info}
                                                hideSideBar={
                                                    !this.state.hoverSideBar
                                                        ? this.state.hideSideBar
                                                        : !this.state.hoverSideBar
                                                }
                                                top_navbar={top_navbar}
                                                hover={this.handleHover}
                                                selectedScreen={this.state.selectedScreen}
                                            />
                                        ) : null
                                    ) : null}
                                </div> */}
                                {!isDsWorkbench && (
                                    <>
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
                                                {(!this.state.hideSideBar ||
                                                    this.state.hoverSideBar) && (
                                                        <Typography className={classes.footer_text}>
                                                            MathCo
                                                        </Typography>
                                                    )}
                                            </div>
                                            {(!this.state.hideSideBar ||
                                                this.state.hoverSideBar) && (
                                                    <Typography className={classes.footer_version}>
                                                        {import.meta.env['REACT_APP_VERSION']}
                                                    </Typography>
                                                )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : null}
                    </div>

                    {top_navbar && adminScreen ? (
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
                    ) : null}

                    {top_navbar && this.state.showRightScroll && !adminScreen ? (
                        <Button
                            onClick={() => this.handleScroll('right')}
                            className={classes.rightBtn}
                        >
                            <ChevronRightRoundedIcon />
                        </Button>
                    ) : null}
                </Drawer>
                {this.renderDeleteDialog()}
            </>
        );
    }
}

SideBar.propTypes = {
    classes: PropTypes.object.isRequired,
    app_info: PropTypes.object.isRequired,
    routes: PropTypes.array.isRequired,
    app_id: PropTypes.string.isRequired,
    parent: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        inProgressScreenId: state.appScreen.inProgressScreenId,
        activeScreenId: state.appScreen.activeScreenId,
        progressBarDetails: state.appScreen.progressBarDetails,
        hightlightScreenId: state.appScreen.hightlightScreenId
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setInProgressScreenId: (payload) => dispatch(setInProgressScreenId(payload)),
        setActiveScreenId: (payload) => dispatch(setActiveScreenId(payload)),
        setAppScreens: (payload) => dispatch(setAppScreens(payload))
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
    withStyles(
        (theme) => ({
            ...sidebarStyle(theme),
            ...breadcrumbStyle(theme)
        }),
        { withTheme: true }
    )(withRouter(SideBar))
);
