import React from "react";

// @material-ui/icons
import Title from "@material-ui/icons/Title";
import Palette from "@material-ui/icons/Palette";
import Email from "@material-ui/icons/Email";
import AcUnit from "@material-ui/icons/AcUnit";
import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import PictureUpload from "components/CustomUpload/PictureUpload.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Select from "components/CustomSelect/CustomSelect.jsx";

import CodexDataProvider, { CODEX_API_GET } from "views/CRUD/CodexDataProvider.jsx";

import applicationPublishStyle from "assets/jss/applicationPublishStyle.jsx";

class BasicInformation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      appname: props.params.item_data && props.params.item_data.name ? props.params.item_data.name : "",
      appnameState: props.params.item_data && props.params.item_data.name ? "success" : "",
      theme: props.params.item_data && props.params.item_data.config && props.params.item_data.config.theme ? props.params.item_data.config.theme : "",
      themeState: props.params.item_data && props.params.item_data.config && props.params.item_data.config.theme ? "success" : "",
      environment: props.params.item_data && props.params.item_data.environment_id ? props.params.item_data.environment_id : "",
      environmentState: props.params.item_data && props.params.item_data.environment_id ? "success" : "",
      email: props.params.item_data && props.params.item_data.contact_email ? props.params.item_data.contact_email : "",
      emailState: props.params.item_data && props.params.item_data.contact_email ? "success" : "",
      environments: false
    };
  }
  componentWillMount() {
    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_GET,
      {
        resource: "app-configs",
        action: "environments",
        callback: "onResponseGetEnvs"
      },
      this,
      false
    );
  }
  onResponseGetEnvs(crud, response_data) {
    this.setState({
      loading: false,
      environments: response_data['data']
    });
  }
  sendState() {
    return this.state;
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
  // function that verifies if a number is greater than zero
  verifyNumber(value) {
    if (!isNaN(value) && value > 0) {
      return true;
    }
    return false;
  }
  change(event, stateName, type, stateNameEqualTo) {
    switch (type) {
      case "email":
        if (this.verifyEmail(event.target.value)) {
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
      default:
        break;
    }
    this.setState({ [stateName]: event.target.value });
  }
  isValidated() {
    if (
      this.state.appnameState === "success" &&
      this.state.themeState === "success" &&
      this.state.environmentState === "success" &&
      this.state.emailState === "success"
    ) {
      return true;
    } else {
      if (this.state.appnameState !== "success") {
        this.setState({ appnameState: "error" });
      }
      if (this.state.themeState !== "success") {
        this.setState({ themeState: "error" });
      }
      if (this.state.environmentState !== "success") {
        this.setState({ environmentState: "error" });
      }
      if (this.state.emailState !== "success") {
        this.setState({ emailState: "error" });
      }
    }
    return false;
    // return true;
  }
  render() {
    const { classes } = this.props;
    return this.state.loading ? (
      <OrangeLinearProgress />
    ) : (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12}>
          <h4 className={classes.infoText}>
            Let's start with the basic information
          </h4>
        </GridItem>
        <GridItem xs={12} sm={4}>
          <PictureUpload />
        </GridItem>
        <GridItem xs={12} sm={6}>
          <CustomInput
            success={this.state.appnameState === "success"}
            error={this.state.appnameState === "error"}
            labelText={
              <span>
                Application Name <small>(required)</small>
              </span>
            }
            id="appname"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              value: this.state.appname,
              onChange: event => this.change(event, "appname", "length", 3),
              endAdornment: (
                <InputAdornment
                  position="end"
                  className={classes.inputAdornment}
                >
                  <Title className={classes.inputAdornmentIcon} />
                </InputAdornment>
              )
            }}
          />
          <Select
            success={this.state.themeState === "success"}
            error={this.state.themeState === "error"}
            title="Theme"
            is_required={true}
            options={[
              { value: 'blue', label: 'Blue'},
              { value: 'green', label: 'Green'},
              { value: 'teal', label: 'Teal'},
              { value: 'mars', label: 'MARS'}
            ]}
            inputProps={{
              value: this.state.theme,
              onChange: event => this.change(event, "theme", "length", 4),
              icon: Palette
            }}
          />
          <Select
            success={this.state.environmentState === "success"}
            error={this.state.environmentState === "error"}
            title="Environment"
            is_required={true}
            options={this.state.environments}
            inputProps={{
              value: this.state.environment,
              onChange: event => this.change(event, "environment", "number"),
              icon: AcUnit
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={12} lg={10}>
          <CustomInput
            success={this.state.emailState === "success"}
            error={this.state.emailState === "error"}
            labelText={
              <span>
                Contact Email <small>(required)</small>
              </span>
            }
            id="email"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              value: this.state.email,
              onChange: event => this.change(event, "email", "email"),
              endAdornment: (
                <InputAdornment
                  position="end"
                  className={classes.inputAdornment}
                >
                  <Email className={classes.inputAdornmentIcon} />
                </InputAdornment>
              )
            }}
          />
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles({
  ...applicationPublishStyle,
  // ...customSelectStyle
})(BasicInformation);
