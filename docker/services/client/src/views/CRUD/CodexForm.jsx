import React from "react";
import PropTypes from "prop-types";
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { getRoute } from "utils.js";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "@material-ui/core/Button";

import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Switch from "@material-ui/core/Switch";
import Icon from "@material-ui/core/Icon";
import Check from "@material-ui/icons/Check";

import AddIcon from "@material-ui/icons/Add";
import CreateIcon from "@material-ui/icons/Create";
import CancelIcon from "@material-ui/icons/Cancel";

//field components
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

//Codex components
import CodexDataProvider from "views/CRUD/CodexDataProvider.jsx";
import {
  CODEX_CREATE,
  CODEX_GET_ONE,
  CODEX_UPDATE,
  CODEX_GET_FOREIGN_KEY_VALUES
} from "views/CRUD/CodexDataProvider.jsx";

let _ = require("underscore");

class CodexForm extends React.Component {
  constructor(props) {
    super(props);

    var default_state = {};

    this.user_info = JSON.parse(sessionStorage.getItem('user_info'));

    this.getForeignkeyValuesResponse = this.getForeignkeyValuesResponse.bind(
      this
    );
    this.change = this.change.bind(this);
    this.selectChange = this.selectChange.bind(this);
    this.renderFields = this.renderFields.bind(this);
    this.renderCheckboxField = this.renderCheckboxField.bind(this);
    this.renderToggleField = this.renderToggleField.bind(this);
    this.renderSelectField = this.renderSelectField.bind(this);
    this.renderTextField = this.renderTextField.bind(this);
    this.evaluateFieldShow = this.evaluateFieldShow.bind(this);

    if (props.type === "add") {
      this.addClick = this.addClick.bind(this);

      _.each(props.params.fields.list, function(field) {
        if (field.accessor !== "actions" && !field.hide_add) {
          if(field["multiple"]) {
            default_state[field["accessor"]] = [];
            default_state[field["accessor"] + "State"] = "";
          } else if(field["type"] === "hidden") {
            default_state[field["accessor"]] = field["hidden_value"];
            default_state[field["accessor"] + "State"] = "success";
          } else {
            default_state[field["accessor"]] = "";
            default_state[field["accessor"] + "State"] = "";
          }
        }
      });
    } else if (props.type === "edit") {
      this.getDataResponse = this.getDataResponse.bind(this);
      this.updateClick = this.updateClick.bind(this);

      default_state = {
        data_loaded: false,
        item_id: false
      };

      if (props.match.params.item_id) {
        default_state['item_id'] = props.match.params.item_id;
      }

      _.each(props.params.fields.list, function(field) {
        if (field.accessor !== "actions" && !field.hide_edit) {
          if(field["multiple"]) {
            default_state[field["accessor"]] = [];
            default_state[field["accessor"] + "State"] = "";
          } else if(field["type"] === "hidden") {
            default_state[field["accessor"]] = field["hidden_value"];
            default_state[field["accessor"] + "State"] = "success";
          } else {
            default_state[field["accessor"]] = "";
            default_state[field["accessor"] + "State"] = "";
          }
        }
      });
    }

    this.state = default_state;
  }

  //add click handler
  addClick() {
    const { params, crud } = this.props;
    var all_success = true;

    _.each(
      params.fields.list,
      function(field) {
        if (field.accessor !== "actions" && !field.hide_add) {
          if (this.state[field["accessor"] + "State"] !== "success") {
            if (field.is_required) {
              all_success = false;
              this.setState({
                [field["accessor"] + "State"]: "error"
              });
            } else {
              this.setState({
                [field["accessor"] + "State"]: "success"
              });
            }
          }
        }
      },
      this
    );

    if (all_success) {
      this.setState({
        data_loaded: false
      });

      CodexDataProvider(CODEX_CREATE, params, this, crud);
    }
  }

  componentDidMount() {
    const { type, params, crud } = this.props;

    this.setState({
      loading_text: "Loading..."
    });

    _.each(
      params.fields.list,
      function(field) {
        if (field.type === "ajax_select") {
          if (field.get_data_fn) {
            crud.props.resource[field.get_data_fn](this, crud);
          } else if (field.slug) {
            CodexDataProvider(
              CODEX_GET_FOREIGN_KEY_VALUES,
              params,
              this,
              crud,
              {
                slug: field.slug,
                parent_slug: params.list.url_slug,
                key_column: field.key_column,
                value_column: field.value_column
              }
            );
          }
        }
      },
      this
    );

    if (type === "edit") {
      CodexDataProvider(CODEX_GET_ONE, params, this, crud);
    } else if (type === "add") {
      this.formdata_ready();
    }
  }

  formdata_ready() {
    const { type, params } = this.props;

    var data_loaded = true;

    if (type === "edit") {
      data_loaded = data_loaded && this.state.item_data_loaded;
    }

    _.each(
      params.fields.list,
      function(field) {
        if (field.type === "ajax_select") {
          data_loaded = data_loaded && this.state[field.slug + "-dataloaded"];
          this.setState({
            loading_text: "Loading...\n" + field.slug + " - done"
          });
        }
      },
      this
    );

    this.setState({
      data_loaded: data_loaded
    });
  }

  getCallbackFnForeignKeyResponse(crud, response, slug) {
    this.getForeignkeyValuesResponse(slug, response.data);
  }

  getForeignkeyValuesResponse(slug, items) {
    var foreignkey_values_state = {};
    foreignkey_values_state[slug] = items;
    foreignkey_values_state[slug + "-dataloaded"] = true;

    this.setState(foreignkey_values_state);
    this.formdata_ready();
  }

  getDataResponse(response) {
    const { params, crud } = this.props;
    var default_state = {
      item_data_loaded: true,
      item_id: this.state.item_id
    };

    _.each(params.fields.list, function(field) {
      if (field.accessor !== "actions" && !field.hide_edit) {
        if (response.data[field["accessor"]] === null) {
          if(field["multiple"]) {
            default_state[field["accessor"]] = [];
          } else {
            default_state[field["accessor"]] = "";
          }
          default_state[field["accessor"] + "State"] = "error";
        } else {
          default_state[field["accessor"]] = response.data[field["accessor"]];
          default_state[field["accessor"] + "State"] = "success";
        }

        if(field.onchange_callback_fn) {
          crud.props.resource[field.onchange_callback_fn](this, crud, false, false, response.data);
        }
      }
    }, this);

    this.setState(default_state);
    this.formdata_ready();
  }

  //update click handler
  updateClick() {
    const { params, crud } = this.props;
    var all_success = true;

    _.each(
      params.fields.list,
      function(field) {
        if (field.accessor !== "actions" && !field.hide_edit) {
          if (this.state[field["accessor"] + "State"] !== "success") {
            if (field.is_required) {
              all_success = false;
              this.setState({
                [field["accessor"] + "State"]: "error"
              });
            } else {
              this.setState({
                [field["accessor"] + "State"]: "success"
              });
            }
          }
        }
      },
      this
    );

    if (all_success) {
      this.setState({
        data_loaded: false
      });

      CodexDataProvider(CODEX_UPDATE, params, this, crud);
    }
  }

  // function that returns true if value is email, false otherwise
  verifyEmail(value) {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  }

  // function that verifies if a string has a given length or not
  verifyLength(value, length) {
    if (value.length >= length) {
      return true;
    }
    return false;
  }

  // function that verifies if two strings are equal
  compare(string1, string2) {
    if (string1 === string2) {
      return true;
    }
    return false;
  }

  // function that verifies if value contains only numbers
  verifyNumber(value) {
    var numberRex = new RegExp("^[0-9]+$");
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  }

  // verifies if value is a valid URL
  verifyUrl(value) {
    try {
      new URL(value);
      return true;
    } catch (_) {
      return false;
    }
  }

  change(event, stateName, type, stateNameEqualTo, maxValue) {
    const { crud, params } = this.props;

    switch (type) {
      case "email":
        if (this.verifyEmail(event.target.value)) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        break;
      case "password":
        if (this.verifyLength(event.target.value, 1)) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        break;
      case "equalTo":
        if (this.compare(event.target.value, this.state[stateNameEqualTo])) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        break;
      case "checkbox":
        if (event.target.checked) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        break;
      case "boolean":
        if (event.target.checked) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        break;
      case "number":
        if (this.verifyNumber(event.target.value)) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        break;
      case "length":
        if (this.verifyLength(event.target.value, stateNameEqualTo)) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        break;
      case "max-length":
        if (!this.verifyLength(event.target.value, stateNameEqualTo + 1)) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        break;
      case "url":
        if (this.verifyUrl(event.target.value)) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        break;
      case "min-value":
        if (
          this.verifyNumber(event.target.value) &&
          event.target.value >= stateNameEqualTo
        ) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        break;
      case "max-value":
        if (
          this.verifyNumber(event.target.value) &&
          event.target.value <= stateNameEqualTo
        ) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        break;
      case "range":
        if (
          this.verifyNumber(event.target.value) &&
          event.target.value >= stateNameEqualTo &&
          event.target.value <= maxValue
        ) {
          this.setState({ [stateName + "State"]: "success" });
        } else {
          this.setState({ [stateName + "State"]: "error" });
        }
        break;
      case "select":
        this.setState({ [stateName + "State"]: "success" });
        break;
      default:
        this.setState({ [stateName + "State"]: "success" });
        break;
    }
    switch (type) {
      case "checkbox":
        this.setState({ [stateName]: event.target.checked });
        break;
      case "boolean":
        this.setState({ [stateName]: event.target.checked });
        break;
      default:
        this.setState({ [stateName]: event.target.value });
        break;
    }

    _.each(params.fields.list, function(field_item) {
      if(field_item.accessor === stateName && field_item.onchange_callback_fn) {
        crud.props.resource[field_item.onchange_callback_fn](this, crud, stateName, event.target.value);
      }
    }, this);
  }

  selectChange(event) {
    const { crud, params } = this.props;

    _.each(params.fields.list, function(field_item) {
      if(field_item.accessor === event.target.name.replace("Select", "") && field_item.onchange_callback_fn) {
        crud.props.resource[field_item.onchange_callback_fn](this, crud, event.target.name.replace("Select", ""), event.target.value);
      }
    }, this);

    this.setState({
      [event.target.name.replace("Select", "") + "State"]: "success"
    });

    if(event.target.multiple) {
      var value = [];
      _.each(event.target.options, function(option) {
        if (option.selected) {
          value.push(option.value);
        }
      });
      this.setState({
        [event.target.name.replace("Select", "")]: value
      });
    } else {
      this.setState({
        [event.target.name.replace("Select", "")]: event.target.value
      });
    }
  }

  selectImageChange = (field_name, field_value) => (event) => {
    this.setState({
      [field_name]: field_value,
      [field_name + "State"]: "success"
    });
  }

  evaluateFieldShow(field) {
    const { type } = this.props;

    if (field.type === "hidden") {
      return false;
    }

    //Evaluate show_conditions
    var add_field = true;
    if (
      (field.hide_add && type === "add") ||
      (field.hide_edit && type === "edit")
    ) {
      add_field = false;
    }

    if (field.show_condition) {
      if (
        parseInt(this.state[field.show_condition["key"]]) !==
        parseInt(field.show_condition["value"])
      ) {
        add_field = false;
      }
    }

    return add_field;
  }

  renderTextField(field) {
    var input_props = {
      onChange: event =>
        field.is_required
          ? this.change(event, field["accessor"], "length", 1)
          : this.change(event, field["accessor"]),
      type: "text",
      value: this.state[field["accessor"]]
    };

    if (field.type === "text_area") {
      input_props["multiline"] = true;
      input_props["rows"] = 10;
    }

    return (
      <CustomInput
        key={field["accessor"]}
        success={this.state[field["accessor"] + "State"] === "success"}
        error={this.state[field["accessor"] + "State"] === "error"}
        labelText={field["Header"] + (field["is_required"] ? " *" : "")}
        id={field["accessor"]}
        formControlProps={{
          fullWidth: true
        }}
        inputProps={input_props}
        helpText={field["help_text"]}
      />
    );
  }

  renderToggleField(field) {
    const { classes } = this.props;

    return (
      <FormControlLabel
        key={field["accessor"] + "-formcontrollabel"}
        control={
          <Switch
            key={field["accessor"]}
            checked={this.state[field["accessor"]]}
            onChange={(event) => this.change(event, field["accessor"], "boolean")}
            value={field["accessor"]}
            classes={{
              switchBase: classes.switchBase,
              checked: classes.switchChecked,
              icon: classes.switchIcon,
              iconChecked: classes.switchIconChecked,
              bar: classes.switchBar
            }}
          />
        }
        classes={{
          label: classes.label
        }}
        label={field["Header"]}
      />
    );
  }

  renderCheckboxField(field) {
    const { classes } = this.props;

    const checkbox_value = this.state[field["accessor"]] ? "1" : "0";

    return (
      <FormControlLabel
        key={field["accessor"] + "-formcontrollabel"}
        control={
          <Checkbox
            key={field["accessor"]}
            id={field["accessor"]}
            onChange={(event) => this.change(event, field["accessor"])}
            checkedIcon={<Check className={classes.checkedIcon} />}
            icon={<Check className={classes.uncheckedIcon} />}
            classes={{
              checked: classes.checked,
              root: classes.checkRoot
            }}
            value={checkbox_value}
          />
        }
        classes={{
          label: classes.label
        }}
        label={field["Header"]}
      />
    );
  }

  renderSelectField(field) {
    const { classes } = this.props;

    var menu_items = [];
    if (process.env["REACT_APP_DROPDOWN_TEST"]) {
      if (field.type === "ajax_select") {
        _.each(this.state[field.slug], function(slug_item) {
          menu_items.push(
            <option key={field["accessor"] + "_option_" + slug_item.value} value={slug_item.value}>{slug_item.label}</option>
          );
        });
      } else if (field.type === "select") {
        _.each(field.options_data, function(option_item) {
          menu_items.push(
            <option key={field["accessor"] + option_item.id} value={option_item.id}>{option_item.label}</option>
          );
        });
      } else if (field.type === "select_image") {
        _.each(field.options_data, function(option_item) {
          menu_items.push(
            <option key={field["accessor"] + option_item.code} value={option_item.code}><img src="{option_item.image}" alt={option_item.code} /></option>
          );
        });
      }

      return (
        <FormControl
          key={field["accessor"]}
          fullWidth
          className={classes.selectFormControl}
        >
          <InputLabel
            htmlFor={field["accessor"] + "-select"}
            className={classes.selectLabel}
          >
            {field["Header"] + (field["is_required"] ? " *" : "")}
          </InputLabel>
          <Select
            native={true}
            multiple={field["multiple"] ? true : false}
            MenuProps={{
              className: classes.selectMenu
            }}
            classes={{
              select: classes.select
            }}
            value={this.state[field["accessor"]]}
            onChange={this.selectChange}
            inputProps={{
              name: field["accessor"] + "Select",
              id: field["accessor"] + "-select",
              'aria-label':field["accessor"] + "Select"
            }}
          >
            <option disabled value="">Choose {field["Header"]}</option>
            {menu_items}
          </Select>
        </FormControl>
      );
    } else {
      var menu_item_classes = {
        root: classes.selectMenuItem
      };

      if (field.multiple) {
        menu_item_classes = {
          root: classes.selectMenuItem,
          selected: classes.selectMenuItemSelectedMultiple
        }
      }

      if (field.type === "ajax_select") {
        _.each(this.state[field.slug], function(slug_item) {
          menu_items.push(
            <MenuItem
              key={field["accessor"] + "_option_" + slug_item.value}
              value={slug_item.value}
              classes={menu_item_classes}
            >
              {slug_item.label}
            </MenuItem>
          );
        });
      } else if (field.type === "select") {
        _.each(field.options_data, function(option_item) {
          menu_items.push(
            <MenuItem
              key={field["accessor"] + option_item.id}
              value={option_item.id}
              classes={menu_item_classes}
            >
              {option_item.label}
            </MenuItem>
          );
        });
      } else if (field.type === "select_image") {
        _.each(field.options_data, function(option_item) {
          menu_items.push(
            <MenuItem
              key={field["accessor"] + option_item.code}
              value={option_item.code}
              classes={menu_item_classes}
            >
              <img height="45px" src={option_item.image} alt={option_item.code}/>
            </MenuItem>
          );
        });
      }

      return (
        <FormControl
          key={field["accessor"]}
          fullWidth
          className={classes.selectFormControl}
        >
          <InputLabel
            htmlFor={field["accessor"] + "-select"}
            className={classes.selectLabel}
          >
            {field["Header"] + (field["is_required"] ? " *" : "")}
          </InputLabel>
          <Select
            MenuProps={{
              className: classes.selectMenu
            }}
            classes={{
              select: classes.select
            }}
            value={this.state[field["accessor"]]}
            onChange={this.selectChange}
            inputProps={{
              name: field["accessor"] + "Select",
              id: field["accessor"] + "-select"
            }}
            multiple={field["multiple"] ? true : false}
          >
            <MenuItem
              disabled
              value=""
              classes={{
                root: classes.selectMenuItem
              }}
            >
              Choose {field['Header']}
            </MenuItem>
            {menu_items}
          </Select>
        </FormControl>
      );
    }
  }

  renderSelectImageField(field) {
    const { classes } = this.props;

    var menu_items = [];
    _.each(field.options_data, function(option_item) {
      if (this.state[field.check_column] === option_item.type) {
        var menu_item_class = classes.codexFormSelectImageItem;

        if (this.state[field["accessor"]] === option_item.code) {
          menu_item_class = classes.codexFormSelectImageItemSelected;
        }

        menu_items.push(
          <div
            key={field["accessor"] + option_item.code}
            value={option_item.code}
            className={menu_item_class}
            onClick={this.selectImageChange(field["accessor"], option_item.code)}
          >
            <div className={classes.codexFormSelectImageItemTitle}>{option_item.name}</div>
            <img className={classes.codexFormSelectImageItemImage} src={option_item.image} alt={option_item.name}/>
          </div>
        );
      }
    }, this);

    if (this.state[field.check_column] === "") {
      return "";
    } else {
      return (
        <FormControl
          key={field["accessor"]}
          fullWidth
          className={classes.selectFormControl}
        >
          <InputLabel
            htmlFor={field["accessor"] + "-select"}
            className={classes.selectLabel}
          >
            {field["Header"]}
          </InputLabel>
          <input
            type="hidden"
            name={field["accessor"] + "Select"}
            id={field["accessor"] + "-select"}
            value={this.state[field["accessor"]]}
          />
          <div className={classes.codexFormSelectImageItemContainer}>
            {menu_items}
            <br clear="all"/>
          </div>
        </FormControl>
      );
    }
  }

  renderFields() {
    const { params } = this.props;

    var fields = [];
    _.each(
      params.fields.list,
      function(param_item) {
        if (param_item.accessor !== "actions") {
          var show_field = this.evaluateFieldShow(param_item);

          if (show_field) {
            if (param_item.type === "text" || param_item.type === "text_area") {
              fields.push(this.renderTextField(param_item));
            } else if (param_item.type === "ajax_select" || param_item.type === "select") {
              fields.push(this.renderSelectField(param_item));
            } else if (param_item.type === "select_image") {
              fields.push(this.renderSelectImageField(param_item));
            } else if (param_item.type === "boolean") {
              fields.push(this.renderToggleField(param_item));
            }
          }
        }
      },
      this
    );

    return fields;
  }

  render() {
    const { type, classes, params, hide_container } = this.props;

    var fields = this.renderFields();
    var main_path = "";
    if (params.link_prefix) {
      main_path += params.link_prefix + "/";
    }

    main_path += params.table_key;

    var form_body = (
      <div>
        {this.state.data_loaded ? (
          <form>
            {fields}
            <br clear="all" />
            <div className={classes.formCategory}>
              <small>*</small> Required fields
            </div>
            <br clear="all" />
            {type === "add" ? (
              <Button color="primary" onClick={this.addClick}>
                <AddIcon className={classes.icons} />
                <span style={{ paddingLeft: '2px' }}>Create</span>
              </Button>
            ) : (
              (
                (
                  params['table_key'] === 'projects' &&
                  (this.user_info.feature_access['my_projects'] || this.user_info.feature_access['my_projects_only']) &&
                  (
                    this.state['reviewer'] === this.user_info.user_id ||
                    this.state['assignees'].includes(this.user_info.user_id)
                  )
                ) ||
                (
                  params['table_key'] === 'projects' &&
                  this.user_info.feature_access['all_projects']
                ) ||
                (
                  params['table_key'] !== 'projects'
                )
              ) ?
              (
                <Button color="primary" onClick={this.updateClick}>
                  <CreateIcon className={classes.icons} />
                  <span style={{ paddingLeft: '2px' }}>Update</span>
                </Button>
              ) : ''
            )}
            <Button color="secondary" href={getRoute(main_path + "/list")}>
              <CancelIcon className={classes.icons} />
              <span style={{ paddingLeft: '2px' }}>Cancel</span>
            </Button>
            <br clear="all" />
          </form>
        ) : (
          <OrangeLinearProgress />
        )}
      </div>
    );

    if (hide_container) {
      return form_body;
    } else {
      return (
        <div>
          {type === 'edit' && this.state.name ? (
            <BreadcrumbsItem to={getRoute(main_path + "/" + this.state.item_id + "/edit")}>
              <span className={classes.breadcrumbItemIconContainer}>
                <Icon className={classes.breadcrumbIcon}>create</Icon>
                {this.state.name}
              </span>
            </BreadcrumbsItem>
          ) : type === 'add' ? (
              <BreadcrumbsItem to={getRoute(main_path + "/add")}>
                <span className={classes.breadcrumbItemIconContainer}>
                  <Icon className={classes.breadcrumbIcon}>add</Icon>
                  {'Create'}
                </span>
              </BreadcrumbsItem>
            ) : (
              ''
          )}
          <GridContainer>
            <GridItem xs={12}>
              {form_body}
            </GridItem>
          </GridContainer>
        </div>
      );
    }
  }
}

CodexForm.propTypes = {
  type: PropTypes.oneOf(["add", "edit"]).isRequired,
  classes: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  crud: PropTypes.object.isRequired
};

export default CodexForm;
