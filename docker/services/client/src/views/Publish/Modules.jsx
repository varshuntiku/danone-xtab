import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Checkbox from "@material-ui/core/Checkbox";
import DashboardIcon from "@material-ui/icons/Dashboard";
import FilterListIcon from "@material-ui/icons/FilterList";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Tooltip from '@material-ui/core/Tooltip';
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";

import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import applicationPublishStyle from "assets/jss/applicationPublishStyle.jsx";
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";

import CodexDataProvider, { CODEX_API_GET } from "views/CRUD/CodexDataProvider.jsx";

import FilterSettings from "views/Publish/FilterSettings.jsx";
import DescriptionIcon from '@material-ui/icons/Description'
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import { TextField } from "@material-ui/core";

class Modules extends React.Component {
  constructor(props) {
    super(props);

    const module_props = props.params.item_data && props.params.item_data.config && props.params.item_data.config.modules ? props.params.item_data.config.modules : false;
    this.state = {
      loading: false,
      user_mgmt: module_props && module_props.user_mgmt,
      dashboard: module_props && module_props.dashboard,
      filters: module_props && module_props.filters,
      fullscreen_mode: module_props && module_props.fullscreen_mode,
      filter_options: false,
      filter_option_values: false,
      filter_settings: module_props && module_props.filter_settings,
      edit_filters: false,
      alerts: module_props && module_props.alerts,
      retain_filters: module_props && module_props.retain_filters,
      application_manual_url: module_props && module_props.application_manual_url,
      product_manual_link: module_props && module_props.product_manual_link,
      manual_url_required: false,
      user_mgmt_app_screen_level: (module_props && module_props.user_mgmt_app_screen_level) || 0
    };
  }

  componentDidMount() {
    const { params } = this.props;

    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_GET,
      {
        resource: "project-notebooks/get-filter-categories",
        action: params.notebook_id,
        callback: "onResponseGetFilterCategories"
      },
      this,
      false
    );
  }

  onResponseGetFilterCategories = (crud, response_data) => {
    this.setState({
      loading: false,
      filter_options: response_data['data']['categories'],
      filter_option_values: response_data['data']['category_values']
    });
  }

  sendState() {
    return {
      user_mgmt: this.state.user_mgmt,
      dashboard: this.state.dashboard,
      filters: this.state.filters,
      fullscreen_mode: this.state.fullscreen_mode,
      filter_settings: this.state.filter_settings,
      data_story: this.state.data_story,
      alerts: this.state.alerts,
      retain_filters: this.state.retain_filters,
      application_manual_url: this.state.application_manual_url,
      product_manual_link: this.state.application_manual_url ? this.state.product_manual_link : null,
      user_mgmt_app_screen_level: this.state.user_mgmt_app_screen_level
    };
  }

  handleChange = name => event => {
    if(name === 'user_mgmt_app_screen_level') {
      this.setState({ [name]: Number(event.target.value) })
    } else if (name === 'product_manual_link') {
      if (event.target.value.length) {
        this.setState({ manual_url_required: false })
      }
      this.setState({ [name]: event.target.value })
    }
    else {
      if (name === 'application_manual_url' && event.target.checked === false) {
        this.setState({ manual_url_required: false })
      }
      this.setState({ [name]: event.target.checked });
    }
  }

  isValidated() {
    if (this.state.application_manual_url) {
      if (!this.state.product_manual_link?.length) {
        this.setState({ manual_url_required: true })
        return false
      }
    }
    return true;
  }

  editFilterSetting = () => {
    this.setState({
      edit_filters: true
    });
  }

  closeFilterSetting = () => {
    this.setState({
      edit_filters: false
    });
  }

  onChangeFilterSetting = (settings) => {
    this.setState({
      filter_settings: settings
    });
  }

  render() {
    const { classes } = this.props;
    return this.state.loading ? (
      <OrangeLinearProgress />
    ) : (
      <div>
        <h4 className={classes.infoText}>Select a module to enable it.</h4>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} lg={10}>
            <GridContainer>
              <GridItem xs={12} sm={4}>
                <div className={classes.choice}>
                  <h6 align="center">User Management</h6>
                  <Checkbox
                    tabIndex={-1}
                    onClick={this.handleChange("user_mgmt")}
                    checkedIcon={
                      <i className={"fas fa-users-cog " + classes.iconCheckboxIcon} />
                    }
                    icon={
                      <i className={"fas fa-users-cog " + classes.iconCheckboxIcon} />
                    }
                    classes={{
                      checked: classes.iconCheckboxChecked,
                      root: classes.iconCheckbox
                    }}
                    value={this.state.user_mgmt ? "1" : "0"}
                    checked={this.state.user_mgmt}
                  />
                </div>
                {this.state.user_mgmt ?
                  <TextField
                    placeholder="Screen level for role association"
                    fullWidth
                    //className={clsx(classes.fontSize2, classes.fontColor)}
                    value={this.state.user_mgmt_app_screen_level}
                    type="number"
                    //name="app_manual_url"
                    onChange={this.handleChange('user_mgmt_app_screen_level')}
                    id="screen level for role association"
                  />
                  : null}
              </GridItem>
              <GridItem xs={12} sm={4}>
                <div className={classes.choice}>
                  <h6>Dashboard</h6>
                  <Checkbox
                    tabIndex={-1}
                    onClick={this.handleChange("dashboard")}
                    checkedIcon={
                      <i className={classes.iconCheckboxIcon} >
                        <DashboardIcon fontSize={"inherit"} />
                      </i>
                    }
                    icon={
                      <i className={classes.iconCheckboxIcon} >
                        <DashboardIcon fontSize={"inherit"} />
                      </i>
                    }
                    classes={{
                      checked: classes.iconCheckboxChecked,
                      root: classes.iconCheckbox
                    }}
                    value={this.state.dashboard ? "1" : "0"}
                    checked={this.state.dashboard}
                  />
                </div>
              </GridItem>
              <GridItem xs={12} sm={4}>
                <div className={classes.choice}>
                  <h6 align="center">Filters</h6>
                  <Checkbox
                    tabIndex={-1}
                    onClick={this.handleChange("filters")}
                    checkedIcon={
                      <i className={classes.iconCheckboxIcon} >
                        <FilterListIcon fontSize={"inherit"} />
                      </i>
                    }
                    icon={
                      <i className={classes.iconCheckboxIcon} >
                        <FilterListIcon fontSize={"inherit"} />
                      </i>
                    }
                    classes={{
                      checked: classes.iconCheckboxChecked,
                      root: classes.iconCheckbox
                    }}
                    value={this.state.filters ? "1" : "0"}
                    checked={this.state.filters}
                  />
                  <br clear="all" />
                  {this.state.filters ? this.state.edit_filters ? (
                    <Tooltip title="Close">
                      <IconButton
                        aria-label="Close"
                        data-testid={"close_filters"}
                        onClick={this.closeFilterSetting}
                      >
                        <Icon color="primary">cancel</Icon>
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Edit">
                      <IconButton
                        aria-label="Edit"
                        data-testid={"edit_filters"}
                        onClick={this.editFilterSetting}
                      >
                        <Icon color="primary">create</Icon>
                      </IconButton>
                    </Tooltip>
                  ) : (
                    ''
                  )}
                  {this.state.edit_filters ? (
                    <FilterSettings
                      parent_obj={this}
                      categories={this.state.filter_options}
                      category_values={this.state.filter_option_values}
                      settings={this.state.filter_settings}
                    />
                  ) : (
                    ''
                  )}
                </div>
              </GridItem>
              <GridItem xs={12} sm={4}>
                <div className={classes.choice}>
                  <h6 align="center">Full-Screen Mode</h6>
                  <Checkbox
                    tabIndex={-1}
                    onClick={this.handleChange("fullscreen_mode")}
                    checkedIcon={
                      <i className={classes.iconCheckboxIcon} >
                        <FullscreenIcon fontSize={"inherit"} />
                      </i>
                    }
                    icon={
                      <i className={classes.iconCheckboxIcon} >
                        <FullscreenIcon fontSize={"inherit"} />
                      </i>
                    }
                    classes={{
                      checked: classes.iconCheckboxChecked,
                      root: classes.iconCheckbox
                    }}
                    value={this.state.fullscreen_mode ? "1" : "0"}
                    checked={this.state.fullscreen_mode}
                  />
                  <br clear="all" />
                </div>
              </GridItem>
              <GridItem xs={12} sm={4}>
                <div className={classes.choice}>
                  <h6 align="center">Data Story</h6>
                  <Checkbox
                    tabIndex={-1}
                    onClick={this.handleChange("data_story")}
                    checkedIcon={
                      <i className={classes.iconCheckboxIcon} >
                        <DescriptionIcon fontSize={"inherit"} />
                      </i>
                    }
                    icon={
                      <i className={classes.iconCheckboxIcon} >
                        <DescriptionIcon fontSize={"inherit"} />
                      </i>
                    }
                    classes={{
                      checked: classes.iconCheckboxChecked,
                      root: classes.iconCheckbox
                    }}
                    value={this.state.data_story ? "1" : "0"}
                    checked={this.state.data_story}
                  />
                  <br clear="all" />
                </div>
              </GridItem>
              <GridItem xs={12} sm={4}>
                <div className={classes.choice}>
                  <h6>Alerts and Notification</h6>
                  <Checkbox
                    tabIndex={-1}
                    onClick={this.handleChange("alerts")}
                    checkedIcon={
                      <i className={classes.iconCheckboxIcon} >
                        <NotificationImportantIcon fontSize={"inherit"} />
                      </i>
                    }
                    icon={
                      <i className={classes.iconCheckboxIcon} >
                        <NotificationImportantIcon fontSize={"inherit"} />
                      </i>
                    }
                    classes={{
                      checked: classes.iconCheckboxChecked,
                      root: classes.iconCheckbox
                    }}
                    value={this.state.alerts ? "1" : "0"}
                    checked={this.state.alerts}
                  />
                </div>
              </GridItem>
              <GridItem xs={12} sm={4}>
                <div className={classes.choice}>
                  <h6>Retain Filters</h6>
                  <Checkbox
                    tabIndex={-1}
                    onClick={this.handleChange("retain_filters")}
                    checkedIcon={
                      <i className={classes.iconCheckboxIcon} >
                        <FilterListIcon fontSize={"inherit"} />
                      </i>
                    }
                    icon={
                      <i className={classes.iconCheckboxIcon} >
                        <FilterListIcon fontSize={"inherit"} />
                      </i>
                    }
                    classes={{
                      checked: classes.iconCheckboxChecked,
                      root: classes.iconCheckbox
                    }}
                    value={this.state.retain_filters ? "1" : "0"}
                    checked={this.state.retain_filters}
                  />
                </div>
              </GridItem>
              <GridItem xs={12} sm={4}>
                <div className={classes.choice}>
                  <h6>Application Manual URL</h6>
                  <Checkbox
                    tabIndex={-1}
                    onClick={this.handleChange("application_manual_url")}
                    checkedIcon={
                      <i className={classes.iconCheckboxIcon} >
                        <ImportContactsIcon fontSize={"inherit"} />
                      </i>
                    }
                    icon={
                      <i className={classes.iconCheckboxIcon} >
                        <ImportContactsIcon fontSize={"inherit"} />
                      </i>
                    }
                    classes={{
                      checked: classes.iconCheckboxChecked,
                      root: classes.iconCheckbox
                    }}
                    value={this.state.application_manual_url ? "1" : "0"}
                    checked={this.state.application_manual_url}
                  />
                </div>
                {this.state.application_manual_url ?
                  <TextField
                    error={this.state.manual_url_required}
                    placeholder="Application manual url"
                    fullWidth
                    //className={clsx(classes.fontSize2, classes.fontColor)}
                      value={this.state.product_manual_link}
                    helperText={this.state.manual_url_required ? 'Application manual url is required' : ''}
                    //name="app_manual_url"
                      onChange={this.handleChange('product_manual_link')}
                      id="application manual"
                  />
                  : null}
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles({
  ...applicationPublishStyle,
  ...customCheckboxRadioSwitch,
  ...sweetAlertStyle
})(Modules);
