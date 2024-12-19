import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// import Select from "@material-ui/core/Select";
// import MenuItem from "@material-ui/core/MenuItem";
// import InputLabel from "@material-ui/core/InputLabel";
// import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";

import AddIcon from "@material-ui/icons/Add";
import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import ScreenHierarchy from "views/Publish/ScreenHierarchy.jsx";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import applicationPublishStyle from "assets/jss/applicationPublishStyle.jsx";

import CodexDataProvider, { CODEX_API_GET } from "views/CRUD/CodexDataProvider.jsx";

class ScreenConfig extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;

    this.state = {
      loading: false,
      results_data: false,
      screens: props.params.item_data && props.params.item_data.config && props.params.item_data.config.screens ? props.params.item_data.config.screens : [],
      responsibilities: props.params.item_data && props.params.item_data.config && props.params.item_data.config.responsibilities ? props.params.item_data.config.responsibilities : []
    };
  }
  componentWillMount() {
    const { params } = this.props;

    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_GET,
      {
        resource: "project-notebooks/get-result-options",
        action: params.notebook_id,
        callback: "onResponseGetoptions"
      },
      this,
      false
    );
  }
  onResponseGetoptions(crud, response_data) {
    this.setState({
      loading: false,
      results_data: response_data['data'],
      responsibilities: response_data['data']['responsibilities']
    });
  }
  onAddScreenConfig() {
    var screens = this.state.screens;

    screens.push({});

    this.setState({
      screens: screens,
      open_index: false
    });
  }
  saveScreens(screens) {
    this.setState({
      screens: screens
    });
  }
  sendState() {
    return {
      screens: this.state.screens,
      responsibilities: this.state.responsibilities
    };
  }
  isValidated() {
    return true;
  }
  render() {
    const { classes } = this.props;
    return this.state.loading ? (
      <OrangeLinearProgress />
    ) : (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12}>
          <h4 className={classes.infoText}>Please add/update/delete screen configurations below.</h4>
        </GridItem>
        <GridItem xs={12} sm={12}>
          <Button color="primary" onClick={(event) => this.onAddScreenConfig()}>
            <AddIcon className={classes.icons} />
            <span style={{ paddingLeft: '2px' }}>Create</span>
          </Button>
          <ScreenHierarchy screens={this.state.screens} results={this.state.results_data} parent_obj={this} />
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles({
  ...applicationPublishStyle,
  ...customSelectStyle
})(ScreenConfig);
