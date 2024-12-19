import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, TextField, MenuItem, ListSubheader, Avatar } from '@material-ui/core';

import textFieldStyle from 'assets/jss/textFieldStyle.jsx';
import { IndustrySpecs } from 'assets/data/indusrySpecs';
import FunctionSpecs from 'assets/data/functionSpecs.jsx';

import * as _ from 'underscore';

class CustomTextField extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            value: props.field_info && props.field_info.value ? props.field_info.value : false
        };

        this.timer = null;
    }

    onHandleChange = (value) => {
        const { parent_obj, field_info } = this.props;
        if (!parent_obj && field_info.onChange) {
            field_info.onChange(value);
        } else if (field_info?.onChange) {
            field_info?.onChange(value);
        } else if (field_info.debounceDuration) {
            this.onHandleChangeWithDebounce(
                parent_obj.onHandleFieldChange.bind(null, field_info.id, value, field_info.params),
                field_info.debounceDuration
            );
        } else {
            parent_obj.onHandleFieldChange(field_info.id, value, field_info.params);
        }
        this.setState({
            value: value
        });
    };

    onHandleBlur = (value) => {
        const { parent_obj, field_info } = this.props;
        if (parent_obj?.onHandleFocusChange) {
            parent_obj.onHandleFocusChange(field_info.id, value);
        }
    };

    onHandleChangeWithDebounce = (func, debounceDuration) => {
        clearTimeout(this.timer);

        this.timer = setTimeout(func, debounceDuration);
    };

    componentDidUpdate(prevProps) {
        if (prevProps.field_info?.value !== this.props.field_info?.value) {
            this.setState({
                value: this.props.field_info?.value
            });
        }
    }

    render() {
        const { classes, field_info } = this.props;
        const defaultValue = field_info?.selectProps?.multiple ? [] : '';

        return (
            <TextField
                variant={field_info.variant || 'filled'}
                name={this.props.name}
                label={field_info.label}
                classes={{
                    root: classes.root,
                    ...field_info.classes
                }}
                InputLabelProps={{
                    classes: {
                        root: !field_info.customLabel ? classes.label : field_info.customLabel
                    }
                }}
                InputProps={{
                    classes: {
                        input: classes.input,
                        formControl: classes.formControl
                    },
                    ...field_info.inputProps
                }}
                autoComplete={field_info.autoComplete}
                id={field_info.id}
                value={this.state.value ? this.state.value : defaultValue}
                onChange={(event) => this.onHandleChange(event.target.value)}
                fullWidth={field_info.fullWidth}
                select={field_info.is_select}
                helperText={field_info.helper_text}
                error={field_info.error}
                required={field_info.required}
                placeholder={field_info.placeholder}
                disabled={field_info.disabled}
                multiline={field_info.multiline ? field_info.multiline : false}
                minRows={field_info.rows ? field_info.rows : 4}
                onBlur={(event) => this.onHandleBlur(event.target.value)}
                SelectProps={{
                    classes: {
                        select: classes.select
                    },
                    MenuProps: { className: classes.menu },
                    ...field_info.selectProps
                }}
            >
                {field_info.is_select && field_info.options
                    ? _.map(
                          field_info.options,
                          function (option_item) {
                              if (option_item.is_group_label) {
                                  return (
                                      <ListSubheader key={option_item.value}>
                                          {option_item.label}
                                      </ListSubheader>
                                  );
                              } else {
                                  return (
                                      <MenuItem
                                          key={option_item.value}
                                          value={option_item.value}
                                          disabled={option_item.disabled}
                                      >
                                          {option_item.em ? (
                                              <em>{option_item.label}</em>
                                          ) : this.props.field_info.id === 'logo_name' ? (
                                              <div className={classes.iconContainer}>
                                                  {this.props.field_info.page === 'industries' ? (
                                                      <Avatar
                                                          className={classes.logoAvatarIndustry}
                                                          src={
                                                              IndustrySpecs[option_item.value] ? (
                                                                  IndustrySpecs[option_item.value]
                                                              ) : (
                                                                  <></>
                                                              )
                                                          }
                                                      >
                                                          {IndustrySpecs[option_item.value] ? (
                                                              IndustrySpecs[option_item.value]
                                                          ) : (
                                                              <></>
                                                          )}
                                                      </Avatar>
                                                  ) : (
                                                      <Avatar
                                                          className={classes.logoAvatar}
                                                          src={
                                                              FunctionSpecs[option_item.value] ? (
                                                                  FunctionSpecs[option_item.value]
                                                                      .icon
                                                              ) : (
                                                                  <></>
                                                              )
                                                          }
                                                      >
                                                          {FunctionSpecs[option_item.value] ? (
                                                              FunctionSpecs[option_item.value].icon
                                                          ) : (
                                                              <></>
                                                          )}
                                                      </Avatar>
                                                  )}
                                                  {option_item.label}
                                              </div>
                                          ) : (
                                              option_item.label
                                          )}
                                      </MenuItem>
                                  );
                              }
                          },
                          this
                      )
                    : ''}
            </TextField>
        );
    }
}

CustomTextField.propTypes = {
    classes: PropTypes.object.isRequired,
    field_info: PropTypes.object.isRequired
};

export default withStyles(
    (theme) => ({
        ...textFieldStyle(theme)
    }),
    { withTheme: true }
)(CustomTextField);
