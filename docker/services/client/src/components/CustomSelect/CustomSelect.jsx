import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";

let _ = require("underscore");

function CustomSelect({ ...props }) {
  const { title, is_required, options, classes, inputProps, error, success } = props;
  const title_key = title.toLowerCase();
  var label_classname = classes.selectLabel;
  var formcontrol_classname = classes.selectFormControl;
  if (error) {
    label_classname += " " + classes.selectLabelError;
    formcontrol_classname += " " + classes.selectFormControlError;
  } else if (success) {
    label_classname += " " + classes.selectLabelSuccess;
    formcontrol_classname += " " + classes.selectFormControlSuccess;
  }

  return (
    <FormControl
      key={"formcontrol_" + title_key}
      fullWidth
      className={formcontrol_classname}
    >
      <InputLabel
        htmlFor={title_key + "-select"}
        className={label_classname}
      >
        {title} {is_required ? <small>(required)</small> : ''}
      </InputLabel>
      <Select
        MenuProps={{
          className: classes.selectMenu
        }}
        classes={{
          select: classes.select
        }}
        IconComponent={inputProps.icon ? inputProps.icon : ArrowDropDownIcon}
        value={inputProps.value}
        onChange={inputProps.onChange}
        inputProps={{
          name: title_key + "Select",
          id: title_key + "-select"
        }}
      >
        { _.map(options, function(option) {
          return (
            <MenuItem
              key={title_key + "_" + option.label.toLowerCase()}
              value={option.value}
              classes={{
                root: classes.selectMenuItem
              }}
            >
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

CustomSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  inputProps: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.number.isRequired,
      ]),
      label: PropTypes.string.isRequired
    })
  ),
  is_required: PropTypes.bool
};

export default withStyles(customSelectStyle)(CustomSelect);