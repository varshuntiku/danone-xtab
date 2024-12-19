import React from 'react';
import PropTypes from "prop-types";

// @material-ui/core components
import { withStyles, Switch, FormControlLabel } from "@material-ui/core";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Select from "components/CustomSelect/CustomSelect.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import InputAdornment from "@material-ui/core/InputAdornment";

import { ArrowLeft, ArrowRight, ArrowDropUp, ArrowDropDown } from "@material-ui/icons";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import WebIcon from "@material-ui/icons/Web";
import DescriptionIcon from "@material-ui/icons/Description";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import DeleteIcon from "@material-ui/icons/Delete";

import LayoutSelector from "views/Publish/LayoutSelector.jsx";

import screenHierarchyStyle from "assets/jss/screenHierarchyStyle.jsx";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";

let _ = require("underscore");

class ScreenHierarchy extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;
    this.state = {
      open_index: false,
      screens: this.props.screens,
      results: this.props.results
    };
  }

  onIndentScreen = (index, add) => {
    var screens = this.state.screens;

    if (add) {
      if (!screens[index]['level']) {
        screens[index]['level'] = 1;
      } else {
        screens[index]['level']++;
      }
    } else {
      if (screens[index]['level']) {
        screens[index]['level']--;
      }
    }

    this.sendState(screens);

    this.setState({
      screens: screens
    });
  }

  onReorderScreen = (index, order_down) => {
    var screens = this.state.screens;
    var screen_item = screens[index];

    if (order_down && index !== (screens.length - 1)) {
      screens.splice(index, 1);
      screens.splice((index + 1), 0, screen_item);
    } else if (!order_down && index !== 0) {
      screens.splice(index, 1);
      screens.splice((index - 1), 0, screen_item);
    }

    this.sendState(screens);

    this.setState({
      screens: screens
    });
  }

  onDeleteScreen(screen_index) {
    var screens = this.state.screens;
    screens.splice(screen_index, 1);

    this.sendState(screens);

    this.setState({
      screens: screens
    });
  }

  onExpand(screen_index) {
    this.setState({
      open_index: false
    });

    setTimeout(() => this.setState({
      open_index: screen_index
    }), 200);
  }

  sendState = (screens) => {
    const { parent_obj } = this.props;

    parent_obj.saveScreens(screens);
  }

  onSettingChange = (item_key, item_value, is_actions) => {
    if (this.state.open_index !== false) {
      var screen_config = this.state.screens[this.state.open_index];
      var found_selected_setting = screen_config['filter_settings'];
      if (is_actions) {
        found_selected_setting = screen_config['action_settings'];
      }

      if (!found_selected_setting) {
        found_selected_setting = {
          type: false,
          name: false,
          component: false,
          item: false
        }
      }

      if (item_key === 'type') {
        found_selected_setting = {
          ...found_selected_setting,
          type: item_value,
          name: false,
          component: false,
          item: false
        };
      } else if (item_key === 'name') {
        found_selected_setting = {
          ...found_selected_setting,
          name: item_value,
          component: false,
          item: false
        };
      } else if (item_key === 'component') {
        found_selected_setting = {
          ...found_selected_setting,
          component: item_value,
          item: false
        };
      } else if (item_key === 'item') {
        found_selected_setting = {
          ...found_selected_setting,
          item: item_value
        };
      }

      var response_screens = this.state.screens;
      if (is_actions) {
        response_screens[this.state.open_index]['action_settings'] = found_selected_setting;
      } else {
        response_screens[this.state.open_index]['filter_settings'] = found_selected_setting;
      }

      this.setState({
        screens: response_screens
      });
    }
  }

  renderSettingSelect = (item_key, is_actions) => {
    if (this.state.open_index !== false) {
      var screen_config = this.state.screens[this.state.open_index];
      var main_options;
      if (is_actions && this.state.results && this.state.results['actions']) {
        main_options = this.state.results['actions'];
      } else if (!is_actions && this.state.results && this.state.results['filters']) {
        main_options = this.state.results['filters'];

      } else {
        return '';
      }
    } else {
      return '';
    }


    var screen_filter_settings = screen_config['filter_settings'];
    if (is_actions) {
      screen_filter_settings = screen_config['action_settings'];
    }

    if (!screen_filter_settings) {
      screen_filter_settings = {
        type: false,
        name: false,
        component: false,
        item: false
      };
    }

    if (item_key === 'type' || item_key === 'component' || item_key === 'name' || item_key === 'item') {
      if (!screen_filter_settings['type']) {
        if (item_key !== 'type') {
          return '';
        }
      } else if (!screen_filter_settings['name']) {
        if (item_key === 'component' || item_key === 'item') {
          return '';
        }
      } else if (!screen_filter_settings['component']) {
        if (item_key === 'item') {
          return '';
        }
      }
    }

    var options = _.keys(main_options);
    if (item_key === 'name') {
      options = _.keys(main_options[screen_filter_settings['type']]);
      if (options.length === 0) {
        return '';
      }
    } else if (item_key === 'component') {
      options = _.keys(main_options[screen_filter_settings['type']][screen_filter_settings['name']]);
      if (options.length === 0) {
        return '';
      }
    } else if (item_key === 'item') {
      if (main_options[screen_filter_settings['type']][screen_filter_settings['name']][screen_filter_settings['component']] === true) {
        return '';
      }
      options = main_options[screen_filter_settings['type']][screen_filter_settings['name']][screen_filter_settings['component']];
      if (!options || options.length === 0) {
        return '';
      }
    }

    return (
      <GridItem xs={3}>
        <Select
          title={is_actions ? "Choose actions widget " + item_key : "Choose filters widget " + item_key}
          options={_.map(options, function(item_option) {
            return {
              value: item_option,
              label: item_option
            };
          })}
          inputProps={{
            value: screen_filter_settings[item_key] ? screen_filter_settings[item_key] : false,
            onChange: event => this.onSettingChange(item_key, event.target.value, is_actions)
          }}
        />
      </GridItem>
    );
  }

  setSelectedLayout(screen_index, layout_option, selected_settings) {
    var screens = this.state.screens;
    screens[screen_index]['no_labels'] = layout_option['no_labels'];
    screens[screen_index]['no_graphs'] = layout_option['no_graphs'];
    screens[screen_index]['graph_type'] = layout_option['graph_type'];
    screens[screen_index]['horizontal'] = layout_option['horizontal'];
    screens[screen_index]['settings'] = selected_settings;

    this.sendState(screens);

    this.setState({
      screens: screens
    });
  }

  renderSelectedLayout = () => {
    const { classes } = this.props;

    if (this.state.open_index !== false) {
      var selected_layout = false;
      var screen_config = this.state.screens[this.state.open_index];
      if ('no_labels' in screen_config && 'no_graphs' in screen_config) {
        selected_layout = {
          no_labels: screen_config['no_labels'],
          no_graphs: screen_config['no_graphs'],
          graph_type: screen_config['graph_type'],
          horizontal: screen_config['horizontal'],
          settings: screen_config['settings'],
        }
      }
      return (
        <GridItem xs={8}>
          <CustomInput
            success={screen_config['descriptionState'] === "success"}
            error={screen_config['descriptionState'] === "error"}
            id={"screen_" + this.state.open_index + "_desc"}
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              value: screen_config['description'] ? screen_config['description'] : '',
              placeholder: 'Screen description blurb goes here..',
              onChange: event => this.onChangeScreenDescription(event.target.value, this.state.open_index),
              endAdornment: (
                <InputAdornment
                  position="end"
                  className={classes.inputAdornment}
                >
                  <DescriptionIcon className={classes.inputAdornmentIcon} />
                </InputAdornment>
              ),
              multiline: true,
              rows: 5
            }}
          />
          <Select
            title={"Choose screen image"}
            key={"Choose screen image " + this.state.open_index}
            options={[
              { value: 'review', label: 'Review' },
              { value: 'analyze', label: 'Analyze' },
              { value: 'simulate', label: 'Simulate' },
              { value: 'default', label: 'Default' }
            ]}
            inputProps={{
              value: screen_config['image'] ? screen_config['image'] : false,
              onChange: event => this.onChangeScreenImage(event.target.value, this.state.open_index)
            }}
          />
          <CustomInput
            // success={screen_config['descriptionState'] === "success"}
            // error={screen_config['descriptionState'] === "error"}
            id={"screen_" + this.state.open_index + "_rating_url"}
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              value: screen_config['screen_rating_url'] ? screen_config['screen_rating_url'] : '',
              placeholder: 'Screen rating URL/feedback URL',
              onChange: event => this.onChangeScreenRatingURL(event.target.value, this.state.open_index),
            }}
          />
          <br />
          <GridContainer>
            {"Select filters only if you have any screen level filters submitted"}
          </GridContainer>
          <GridContainer>
            {this.renderSettingSelect('type')}
            {this.renderSettingSelect('name')}
            {this.renderSettingSelect('component')}
            {this.renderSettingSelect('item')}
          </GridContainer>
          <br />
          <GridContainer>
            {"Select actions only if you have any screen level actions submitted"}
          </GridContainer>
          <GridContainer>
            {this.renderSettingSelect('type', true)}
            {this.renderSettingSelect('name', true)}
            {this.renderSettingSelect('component', true)}
            {this.renderSettingSelect('item', true)}
          </GridContainer>
          <FormControlLabel
            control={
              <Switch
                onChange={event => this.onChangeScreenFiltersOpen(event.target.value, this.state.open_index)}
                checked={screen_config['filters_open'] ? screen_config['filters_open'] : false}
                value={screen_config['filters_open'] ? 'filters_open' : ''}
                // inputProps={{ 'aria-labelledby': 'switch-list-label-' + category }}
              />
            }
            label={"Keep filters open"}
          />
          <FormControlLabel
            control={
              <Switch
                onChange={event => this.onChangeScreenAutoRefresh(event.target.value, this.state.open_index)}
                checked={screen_config['auto_refresh'] ? screen_config['auto_refresh'] : false}
                value={screen_config['auto_refresh'] ? 'auto_refresh' : ''}
                // inputProps={{ 'aria-labelledby': 'switch-list-label-' + category }}
              />
            }
            label={"Is real-time screen ?"}
          />
          <LayoutSelector parent_obj={this} screen_index={this.state.open_index} layout_option={selected_layout} result_options={this.state.results} />
        </GridItem>
      );
    } else {
      return '';
    }
  }

  onChangeScreenName(name_value, screen_index) {
    var screens = this.state.screens;
    screens[screen_index]['name'] = name_value;

    this.sendState(screens);

    this.setState({
      screens: screens
    });
  }

  onChangeScreenVisibility(visible, screen_index) {
    var screens = this.state.screens;
    screens[screen_index]['hidden'] = !visible;
    this.sendState(screens);
    this.setState({
      screens: screens
    });
  }

  onChangeScreenDescription(desc_value, screen_index) {
    var screens = this.state.screens;
    screens[screen_index]['description'] = desc_value;

    this.sendState(screens);

    this.setState({
      screens: screens
    });
  }

  onChangeScreenImage(image_value, screen_index) {
    var screens = this.state.screens;
    screens[screen_index]['image'] = image_value;

    this.sendState(screens);

    this.setState({
      screens: screens
    });
  }

  onChangeScreenRatingURL(rating_url, screen_index) {
    var screens = this.state.screens;
    screens[screen_index]['screen_rating_url'] = rating_url;

    this.sendState(screens);

    this.setState({
      screens: screens
    });
  }

  onChangeScreenFiltersOpen(filters_open_value, screen_index) {
    var screens = this.state.screens;
    screens[screen_index]['filters_open'] = !(filters_open_value === 'filters_open');

    this.sendState(screens);

    this.setState({
      screens: screens
    });
  }

  onChangeScreenAutoRefresh(auto_refresh_value, screen_index) {
    var screens = this.state.screens;
    screens[screen_index]['auto_refresh'] = !(auto_refresh_value === 'auto_refresh');

    this.sendState(screens);

    this.setState({
      screens: screens
    });
  }

  render() {
    const { classes } = this.props;

    var screen_id_first = 0;
    var screen_id_second = 0;
    var screen_id_third = 0;

    return (
      <GridContainer>
        <GridItem xs={4}>
          {
            _.map(this.state.screens, function(screen_config, index) {
              var screen_layout_class = classes.screenHierarchyItem;

              if (!screen_config['level']) {
                screen_id_first++;
                screen_id_second = 0;
                screen_id_third = 0;
              } else if (screen_config['level'] === 1) {
                screen_id_second++;
                screen_id_third = 0;
              } else if (screen_config['level'] === 2) {
                screen_id_third++;
              }

              var screen_id = screen_id_first + '.' + screen_id_second + '.' + screen_id_third;
              var screen_layout_number = 2;
              var screen_layout_name_number = 6;
              if (screen_config['level'] === 1) {
                screen_layout_number = 3;
                screen_layout_name_number = 5;
                screen_layout_class = classes.screenHierarchyItemSecond;
              } else if (screen_config['level'] === 2) {
                screen_layout_number = 4;
                screen_layout_name_number = 4;
                screen_layout_class = classes.screenHierarchyItemThird;
              }
              return (
                <div key={"screen_layout_config_" + index} className={screen_layout_class}>
                  <GridContainer>
                    <GridItem xs={screen_layout_number}>
                      <h4 className={classes.screenConfigIdLabel}>{screen_id}</h4>
                    </GridItem>
                    <GridItem xs={screen_layout_name_number}>
                      <CustomInput
                        success={screen_config['nameState'] === "success"}
                        error={screen_config['nameState'] === "error"}
                        id={"screen_" + index + "_title"}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          value: screen_config['name'] ? screen_config['name'] : 'Screen ' + (index+1),
                          onChange: event => this.onChangeScreenName(event.target.value, index),
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              className={classes.inputAdornment}
                            >
                              <WebIcon className={classes.inputAdornmentIcon} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </GridItem>
                    <GridItem xs={4}>
                      <div className={classes.screenConfigIconContainer}>
                        <ArrowDropUp disabled={index === 0 ? true : false} className={classes.screenConfigIcon} color={index === 0 ? "disabled" : "primary"} onClick={() => this.onReorderScreen(index, false)} />
                        <ArrowDropDown disabled={index === (this.state.screens.length - 1) ? true : false} className={classes.screenConfigIcon} color={index === (this.state.screens.length - 1) ? "disabled" : "primary"}  onClick={() => this.onReorderScreen(index, true)} />
                        <ArrowLeft disabled={!screen_config['level'] ? true : false} className={classes.screenConfigIcon} color={!screen_config['level'] ? "disabled" : "primary"}  onClick={() => this.onIndentScreen(index, false)} />
                        <ArrowRight disabled={screen_config['level'] === 2 ? true : false} className={classes.screenConfigIcon} color={screen_config['level'] === 2 ? "disabled" : "primary"}  onClick={() => this.onIndentScreen(index, true)} />
                        {screen_config.hidden ? <VisibilityOffIcon title="visibility off" className={classes.screenConfigIcon} color="primary" onClick={() => this.onChangeScreenVisibility(true, index)} />
                        : <VisibilityIcon title="visibility on" className={classes.screenConfigIcon} color="primary" onClick={() => this.onChangeScreenVisibility(false, index)} />}
                        <DeleteIcon color="secondary" onClick={() => this.onDeleteScreen(index)} />
                        { this.state.open_index === index ? (
                          <CheckBoxIcon color="primary" onClick={() => this.onExpand(false)}/>
                        ) : (
                          <CheckBoxOutlineBlankIcon color="primary" onClick={() => this.onExpand(index, false)} />
                        )}
                      </div>
                    </GridItem>
                  </GridContainer>
                </div>
              );
            }, this)
          }
        </GridItem>
        {this.renderSelectedLayout()}
      </GridContainer>
    )
  }
}

ScreenHierarchy.propTypes = {
  classes: PropTypes.object.isRequired,
  screens: PropTypes.array.isRequired,
  results: PropTypes.object.isRequired,
  parent_obj: PropTypes.object.isRequired
}

export default withStyles({
  ...screenHierarchyStyle,
  ...customSelectStyle
})(ScreenHierarchy);