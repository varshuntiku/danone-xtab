import React from 'react';
import PropTypes from "prop-types";

// @material-ui/core components
import { withStyles } from "@material-ui/core";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import InputAdornment from "@material-ui/core/InputAdornment";

import {  ArrowDropUp, ArrowDropDown } from "@material-ui/icons";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import WebIcon from "@material-ui/icons/Web";
import DescriptionIcon from "@material-ui/icons/Description";
import DeleteIcon from "@material-ui/icons/Delete";

import screenHierarchyStyle from "assets/jss/screenHierarchyStyle.jsx";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";

let _ = require("underscore");

class ObjectiveGroupConfig extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;
    this.state = {
      open_index: false,
      objective_group: this.props.objective_group,
      results: this.props.results
    };
  }

  onReorderScreen = (index, order_down) => {
    let objective_group = this.state.objective_group;
    let screen_item = objective_group[index];

    if (order_down && index !== (objective_group.length - 1)) {
      objective_group.splice(index, 1);
      objective_group.splice((index + 1), 0, screen_item);
    } else if (!order_down && index !== 0) {
      objective_group.splice(index, 1);
      objective_group.splice((index - 1), 0, screen_item);
    }

    this.sendState(objective_group);

    this.setState({
      objective_group: objective_group
    });
  }

  onDeleteScreen(screen_index) {
    let objective_group = this.state.objective_group;
    objective_group.splice(screen_index, 1);

    this.sendState(objective_group);

    this.setState({
      objective_group: objective_group
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

  sendState = (objective_group) => {
    const { parent_obj } = this.props;

    parent_obj.saveObjectiveGroup(objective_group);
  }

  renderSelectedLayout = () => {
    const { classes } = this.props;

    if (this.state.open_index !== false) {
    //   let selected_layout = false;
      let screen_config = this.state.objective_group[this.state.open_index];
      //commenting out unused code
    //   if ('no_labels' in screen_config && 'no_graphs' in screen_config) {
    //     selected_layout = {
    //       no_labels: screen_config['no_labels'],
    //       no_graphs: screen_config['no_graphs'],
    //       graph_type: screen_config['graph_type'],
    //       horizontal: screen_config['horizontal'],
    //       settings: screen_config['settings'],
    //     }
    //   }
      return (
        <GridItem xs={8}>

          <CustomInput
            labelText="Group Name"
            id={"screen_" + this.state.open_index + "_name"}
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              disabled: false,
              value: screen_config['name'] ? screen_config['name'] : '',
              onChange: event => this.onChangeGroupName(event.target.value, this.state.open_index),

            }}
          />
          <br />
          <br />

          <CustomInput
            success={screen_config['descriptionState'] === "success"}
            error={screen_config['descriptionState'] === "error"}
            id={"screen_" + this.state.open_index + "_desc"}
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              value: screen_config['description'] ? screen_config['description'] : '',
              placeholder: 'Group description..',
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
              rows: 4
            }}
          />
          <br />

        </GridItem>
      );
    } else {
      return '';
    }
  }

  onChangeTitle(name_value, screen_index) {
    let objective_group = this.state.objective_group;
    objective_group[screen_index]['title'] = name_value;

    this.sendState(objective_group);

    this.setState({
      objective_group: objective_group
    });
  }

  onChangeScreenDescription(desc_value, screen_index) {
    let objective_group = this.state.objective_group;
    objective_group[screen_index]['description'] = desc_value;

    this.sendState(objective_group);

    this.setState({
      objective_group: objective_group
    });
  }

  onChangeGroupName(name_value, screen_index) {
    let objective_group = this.state.objective_group;
    objective_group[screen_index]['name'] = name_value;

    this.sendState(objective_group);

    this.setState({
      objective_group: objective_group
    });
  }

  render() {
    const { classes } = this.props;

    let screen_id_first = 0;
    let screen_id_second = 0;
    let screen_id_third = 0;

    return (
      <GridContainer>
        <GridItem xs={4}>
          {
            _.map(this.state.objective_group, function (screen_config, index) {
              let screen_layout_class = classes.screenHierarchyItem;

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

              let screen_id = screen_id_first + '.' + screen_id_second + '.' + screen_id_third;
              let screen_layout_number = 2;
              let screen_layout_name_number = 6;
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
                          value: screen_config['title'] ? screen_config['title'] : 'Group ' + (index + 1),
                          onChange: event => this.onChangeTitle(event.target.value, index),
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
                        <ArrowDropDown disabled={index === (this.state.objective_group.length - 1) ? true : false} className={classes.screenConfigIcon} color={index === (this.state.objective_group.length - 1) ? "disabled" : "primary"} onClick={() => this.onReorderScreen(index, true)} />
                        <DeleteIcon color="secondary" onClick={() => this.onDeleteScreen(index)} />
                        {this.state.open_index === index ? (
                          <CheckBoxIcon color="primary" onClick={() => this.onExpand(false)} />
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

ObjectiveGroupConfig.propTypes = {
  classes: PropTypes.object.isRequired,
  objective_group: PropTypes.array.isRequired,
  results: PropTypes.object.isRequired,
  parent_obj: PropTypes.object.isRequired
}

export default withStyles({
  ...screenHierarchyStyle,
  ...customSelectStyle
})(ObjectiveGroupConfig);