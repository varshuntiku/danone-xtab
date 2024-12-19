import React from 'react';
import PropTypes from "prop-types";

// @material-ui/core components
import { withStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Select from "components/CustomSelect/CustomSelect.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";


import screenHierarchyStyle from "assets/jss/screenHierarchyStyle.jsx";
import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import StepsConfig from "views/Publish/StepsConfig.jsx";


import Accordion from "components/Accordion/Accordion.jsx";


let _ = require("underscore");

class ObjectivesConfig extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;
    this.state = {
      open_index: false,
      objectives: this.props.objectives,
      objective_group: this.props.objective_group,
      results: this.props.results
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ objectives: nextProps.objectives });
  }

  // componentDidMount() {

  //   if ( this.props.objectives.length ) {
  //     var objective_content = this.state.objective_content;

  //     _.map(this.state.objectives, function (objective, index) {

  //       let obj = {
  //         title: 'Objective '+ (index+1),
  //         content: <span>Test</span>,
  //         expanded: true
  //       }
  //       objective_content.push(obj);

  //     }, this);

  //     this.setState({
  //       objective_content: objective_content,
  //       open_index: false
  //     });
  //   }
  // }

  onAddObjective() {

    var objectives = [...this.state.objectives] ? [...this.state.objectives] : [];

    let obj = {
      title: 'Objective ' + (objectives.length + 1),
      expanded: true,
      screens: [{}]
    }
    objectives.push(obj);

    this.setState({
      objectives: objectives,
    }, ()=> {
      // this.invokeRender()
    });

  }

  invokeRender() {

    let objectives = [...this.state.objectives]
    let obj = objectives[objectives.length - 1];

    obj['content'] = this.renderSelectedLayout(objectives.length - 1);
    objectives.splice(objectives.length - 1, 1, obj);
    this.setState({
      objectives: objectives
    })
  }

  getAccordionDetails = () => {

    const { objectives } = this.state;
    let config;

    config = _.map(objectives, (objectives, index)=> {
      return this.renderSelectedLayout(index)
    });

    return _.map(config, function (data, index) {
      return { title: objectives[index].title, content: data };
    });

  }

  onAddScreenConfig(index) {

    var objectives = [...this.state.objectives]

    objectives[index].screens.push({});

    this.setState({ objectives: objectives })

  }

  onReorderScreen = (index, order_down) => {
    var objectives = this.state.objectives;
    var screen_item = objectives[index];

    if (order_down && index !== (objectives.length - 1)) {
      objectives.splice(index, 1);
      objectives.splice((index + 1), 0, screen_item);
    } else if (!order_down && index !== 0) {
      objectives.splice(index, 1);
      objectives.splice((index - 1), 0, screen_item);
    }

    this.sendState(objectives);

    this.setState({
      objectives: objectives
    });
  }

  onDeleteScreen(screen_index) {
    var objectives = this.state.objectives;
    objectives.splice(screen_index, 1);

    this.sendState(objectives);

    this.setState({
      objectives: objectives
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

  sendState = (objectives) => {
    const { parent_obj } = this.props;

    parent_obj.saveObjective(objectives);
  }

  saveScreens(screens, obj_index) {

    var objectives = this.state.objectives;

    objectives[obj_index].screens = screens;


    this.sendState(objectives);

  }

  onChangeTitle(name_value, screen_index) {
    var objectives = this.state.objectives;
    objectives[screen_index]['title'] = name_value;

    this.sendState(objectives);

    this.setState({
      objectives: objectives
    });
  }

  onChangeScreenDescription(desc_value, screen_index) {
    var objectives = this.state.objectives;
    objectives[screen_index]['description'] = desc_value;

    this.sendState(objectives);

    this.setState({
      objectives: objectives
    });
  }

  onChangeObjectiveName(name_value, screen_index) {
    var objectives = this.state.objectives;
    objectives[screen_index]['name'] = name_value;

    this.sendState(objectives);

    this.setState({
      objectives: objectives
    });
  }

  onChangeObjectiveGroup(name_value, screen_index) {
    var objectives = this.state.objectives;
    objectives[screen_index]['group_name'] = name_value;

    this.sendState(objectives);

    this.setState({
      objectives: objectives
    });
  }

  renderSelectedLayout = (index) => {
    const { classes } = this.props;

    var objective_data = this.state.objectives[index] ? this.state.objectives[index] : {};

    return (
       <GridItem xs={12}>
          <CustomInput
            labelText="Objective Name"
            id={"screen_" + index + "_name"}
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              disabled: false,
              value: objective_data['name'] ? objective_data['name'] : '',
              onChange: event => this.onChangeObjectiveName(event.target.value, index),

            }}
          />
          <br />
          <Select
            title={"Choose Objective Group "}
            key={"Choose Objective Group" + this.state.open_index}
            options={_.map(this.state.objective_group, function (item_option) {
              if (item_option.name) {
                return {
                  value: item_option.name,
                  label: item_option.name
                };
              }
            })}
            inputProps={{
              value: objective_data['group_name'] ? objective_data['group_name'] : false,
              onChange: event => this.onChangeObjectiveGroup(event.target.value, index)
            }}
          />
          <br />

          <Button color="primary" onClick={(event) => this.onAddScreenConfig(index)}>
            <AddIcon className={classes.icons} />
            <span style={{ paddingLeft: '2px' }}>Create Screen</span>
          </Button>

        <StepsConfig screens={this.state.objectives[index].screens} index={index} results={this.props.results} parent_obj={this} />

        </GridItem>
    )
  }


  render() {
    const { classes } = this.props;

    return (
      <GridContainer>
        <GridItem xs={12}>
          <Button color="primary" onClick={(event) => this.onAddObjective()}>
            <AddIcon className={classes.icons} />
            <span style={{ paddingLeft: '2px' }}>Create Objectives</span>
          </Button>
          <Accordion
            collapses={this.getAccordionDetails()}
          />
        </GridItem>
      </GridContainer>
    )
  }
}

ObjectivesConfig.propTypes = {
  classes: PropTypes.object.isRequired,
  objectives: PropTypes.array.isRequired,
  results: PropTypes.object.isRequired,
  parent_obj: PropTypes.object.isRequired
}

export default withStyles({
  ...screenHierarchyStyle,
  ...customSelectStyle
})(ObjectivesConfig);