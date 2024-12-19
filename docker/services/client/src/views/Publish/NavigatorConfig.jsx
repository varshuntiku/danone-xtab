import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import ObjectiveGroupConfig from "views/Publish/ObjectiveGroupConfig.jsx";
import ObjectivesConfig from "views/Publish/ObjectivesConfig.jsx";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import applicationPublishStyle from "assets/jss/applicationPublishStyle.jsx";
import CodexDataProvider, { CODEX_API_GET } from "views/CRUD/CodexDataProvider.jsx";

class NavigatorConfig extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;

    this.state = {
      loading: false,
      results_data: false,
      screens: props.params.item_data && props.params.item_data.config && props.params.item_data.config.screens ? props.params.item_data.config.screens : [],
      objective_group: props.params.item_data && props.params.item_data.config && props.params.item_data.config.objective_group ? props.params.item_data.config.objective_group : [],
      objectives: props.params.item_data && props.params.item_data.config && props.params.item_data.config.objectives ? props.params.item_data.config.objectives : []
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
      results_data: response_data['data']
    });
  }

  onAddObjectiveGroup() {
    var objective_group = this.state.objective_group;

    objective_group.push({});

    this.setState({
      objective_group: objective_group,
      open_index: false
    });
  }

  saveObjectiveGroup(objective_group) {
    this.setState({
      objective_group: objective_group
    });
  }

  saveObjective(objectives) {
    this.setState({
      objectives: objectives
    });
  }

  saveScreens(screens) {
    this.setState({
      screens: screens
    });
  }

  sendState() {
    return {
      objective_group: this.state.objective_group,
      objectives: this.state.objectives
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
          <h4 className={classes.infoText}>Please add/update/delete objectives configurations below.</h4>
        </GridItem>
        <GridItem xs={12} sm={12}>
          <Button color="primary" onClick={(event) => this.onAddObjectiveGroup()}>
            <AddIcon className={classes.icons} />
            <span style={{ paddingLeft: '2px' }}>Create Group</span>
          </Button>
          <ObjectiveGroupConfig objective_group={this.state.objective_group} results={this.state.results_data} parent_obj={this} />
        </GridItem>


        {this.state.objective_group.length > 0 && <GridItem xs={12} sm={12}>
          <ObjectivesConfig objective_group={this.state.objective_group} objectives={this.state.objectives} results={this.state.results_data} parent_obj={this} />
        </GridItem>
        }

      </GridContainer>
    );
  }

}

export default withStyles({
  ...applicationPublishStyle,
  ...customSelectStyle
})(NavigatorConfig);
