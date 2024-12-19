import React from "react";
import PropTypes from "prop-types";
import { withStyles, Switch } from "@material-ui/core";

import { List, ListItem, ListItemText, ListItemSecondaryAction } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import publishModuleFilterSettingsStyle from "assets/jss/publishModuleFilterSettingsStyle.jsx";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";

let _ = require("underscore");

class FilterSettings extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;

    this.setState = {

    };
  }

  getDefaultFilterSettings = () => {
    const { settings, categories } = this.props;

    var default_filter_settings = {};
    _.each(categories, function(filter_option) {
      default_filter_settings[filter_option] = {
        enabled: true,
        label: filter_option.replace('_', ' ').replace(/\w\S*/g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}),
        include: '',
        exclude: [],
        parent: ''
      };

      if (settings && settings[filter_option]) {
        default_filter_settings[filter_option] = settings[filter_option];
      }
    });

    return default_filter_settings;
  }

  handleFilterToggle = (category) => {
    const { parent_obj } = this.props;

    var default_filter_settings = this.getDefaultFilterSettings();

    default_filter_settings[category]['enabled'] = !default_filter_settings[category]['enabled']

    parent_obj.onChangeFilterSetting(default_filter_settings);
  }

  onSelectChange = (event, prop_name, category, is_multiple) => {
    const { parent_obj } = this.props;

    var default_filter_settings = this.getDefaultFilterSettings();

    default_filter_settings[category][prop_name] = event.target.value;

    parent_obj.onChangeFilterSetting(default_filter_settings);
  }

  renderSelect = (prop_name, category, is_multiple, options, filter_settings) => {
    const { classes } = this.props;

    options.splice(0, 0, false);

    return (
      <FormControl
        key={prop_name + "-" + category}
        fullWidth
        className={classes.selectFormControl}
      >
        <InputLabel
          htmlFor={prop_name + "-" + category + "-select"}
          className={classes.selectLabel}
        >
          {prop_name.toUpperCase()}
        </InputLabel>
        <Select
          MenuProps={{
            className: classes.selectMenu
          }}
          classes={{
            select: classes.select
          }}
          value={filter_settings[category][prop_name]}
          onChange={(event) => this.onSelectChange(event, prop_name, category, is_multiple)}
          inputProps={{
            name: prop_name + "-" + category + "Select",
            id: prop_name + "-" + category + "-select"
          }}
          multiple={is_multiple}
        >
          {_.map(options, function(option_item) {
            return (
              <MenuItem
                key={prop_name + "-" + category + option_item}
                value={option_item}
                classes={{
                  root: classes.selectMenuItem,
                  selected: classes.selectMenuItemSelectedMultiple
                }}
              >
                {option_item}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  }

  render() {
    const { classes, categories, category_values } = this.props;

    var default_filter_settings = this.getDefaultFilterSettings();

    return (
      <List>
        {_.map(categories, function(category) {
          if (default_filter_settings[category]) {
            var dropdown_values = _.filter(category_values[category], function(category_value_item) {
              return category_value_item;
            });

            return (
              <ListItem key={"switch-list-item-" + category}>
                <ListItemText
                  id={"switch-list-label-" + category}

                  primary={default_filter_settings[category]['label']}
                  secondary={
                    <React.Fragment>
                      {!default_filter_settings[category]['enabled'] ? (
                        <div className={classes.filterSettingSelect}>
                          {this.renderSelect('include', category, false, dropdown_values, default_filter_settings)}
                        </div>
                      ) : (
                        ''
                      )}
                      {default_filter_settings[category]['enabled'] ? (
                        <div className={classes.filterSettingSelect}>
                          {this.renderSelect('exclude', category, true, dropdown_values, default_filter_settings)}
                        </div>
                      ) : (
                        ''
                      )}
                      <div className={classes.filterSettingSelect}>
                        {this.renderSelect('parent', category, false, _.filter(categories, function(category_item) {
                          return category_item !== category
                        }), default_filter_settings)}
                      </div>
                      <div className={classes.filterSettingSelect}>
                        {this.renderSelect('default', category, false, dropdown_values, default_filter_settings)}
                      </div>
                      <br clear="all" />
                    </React.Fragment>
                  }
                  secondaryTypographyProps={{
                    component: "div"
                  }}
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    onChange={() => this.handleFilterToggle(category)}
                    checked={default_filter_settings[category]['enabled']}
                    inputProps={{ 'aria-labelledby': 'switch-list-label-' + category }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          } else {
            return '';
          }
        }, this)}
      </List>
    );
  }
};

FilterSettings.propTypes = {
  classes: PropTypes.object.isRequired,
  parent_obj: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired
};

export default withStyles({
  ...publishModuleFilterSettingsStyle,
  ...customSelectStyle
})(FilterSettings);