import React from 'react';
import PropTypes from "prop-types";

import { withStyles, Icon, Button, Typography } from "@material-ui/core";
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { getRoute } from "utils.js";

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import NavPills from "components/NavPills/NavPills.jsx";

import MonacoEditor from 'react-monaco-editor';

import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

import breadcrumbStyle from "assets/jss/breadcrumbStyle.jsx";

import CodexDataProvider, { CODEX_API_ACTION } from "views/CRUD/CodexDataProvider.jsx";

let _ = require("underscore");

class IterationParams extends React.Component {
  constructor(props) {
    super(props);

    var notebook_id = false;
    if (props.match.params.notebook_id) {
      notebook_id = props.match.params.notebook_id;
    }

    var iteration_id = false;
    if (props.match.params.iteration_id) {
      iteration_id = props.match.params.iteration_id;
    }

    var project_id = false;
    var parent_project_id = false;
    if (props.match.params.project_id) {
      if (props.match.params.case_study_id) {
        project_id = props.match.params.case_study_id;
        parent_project_id = props.match.params.project_id;
      } else {
        project_id = props.match.params.project_id;
      }
    }

    this.state = {
      iteration_id: iteration_id,
      notebook_id: notebook_id,
      project_id: project_id,
      parent_project_id: parent_project_id,
      loading: true,
      params: false,
      results: false
    };
  }

  componentDidMount() {
    CodexDataProvider(
      CODEX_API_ACTION,
      {
        resource: "project-notebooks/get-trigger-data",
        action: this.state.iteration_id,
        callback: "onResponseGetParams"
      },
      this,
      false
    );
  }

  onResponseGetParams = (crud, response_data) => {
    this.setState({
      loading: false,
      params: response_data.data.params,
      results: response_data.data.results
    });
  }

  renderTagsContent = () => {
    var tags_content = [];

    if (this.state.params.tags) {
      var tag_index = -1;
      tags_content = _.map(this.state.params.tags, function(tag_value, tag_key) {
        tag_index++;
        return (
          <GridContainer key={"tag_container_" + tag_index} spacing={0}>
            <GridItem xs={3}>{this.renderSettingText('tag_key_' + tag_index, 'Key', tag_key)}</GridItem>
            <GridItem xs={3}>{this.renderSettingText('tag_value_' + tag_index, 'Value', tag_value)}</GridItem>
          </GridContainer>
        );
      }, this);
    }

    return (
      <div style={{ width: '75%'}}>
        {tags_content}
      </div>
    );
  }

  renderWidgetsContent = () => {
    var widgets_content = [];

    if (this.state.params.widgets) {
      widgets_content = _.map(this.state.params.widgets, function(widget_item, widget_index) {
        var widget_code = false;
        if (widget_item.code) {
          if (widget_item.group === 'custom') {
            widget_code = widget_item.code;

            if (!widget_code.startsWith('#BEGIN CUSTOM CODE BELOW...')) {
              widget_code = '#BEGIN CUSTOM CODE BELOW...\n\n' + widget_code + '#END CUSTOM CODE\n\n';
            }
          } else {
            widget_code = widget_item.code;

            if (!widget_code.startsWith('#BEGIN WIDGET CODE BELOW...')) {
              widget_code = '#BEGIN WIDGET CODE BELOW...\n\n' + widget_code + '#END WIDGET CODE\n\n';
            }
          }
        }

        return widget_item.output_var ? (
          <GridContainer key={"widget_container_" + widget_index} spacing={0}>
            {widget_code ? (
              [
                <GridItem key={"widget_type_" + widget_index} xs={3}>{widget_item.group.toUpperCase()}</GridItem>,
                <GridItem key={"widget_spacing_1_" + widget_index} xs={1}>{' '}</GridItem>,
                <GridItem key={"widget_code_" + widget_index} xs={8}>{this.renderSettingTextarea('code_' + widget_index, 'Code for widget: ' + (widget_index+1), widget_code)}</GridItem>,
                // <GridItem key={"widget_spacing_2_" + widget_index} xs={1}>{' '}</GridItem>,
                // <GridItem key={"widget_results_" + widget_index} xs={2}><Switch key={'results_radio_' + widget_index} checked={this.isWidgetForOutput(widget_item)} /></GridItem>
              ]
            ) : (
              ''
            )}
          </GridContainer>
        ) : '';
      }, this);
    }

    return (
      <div style={{ width: '75%' }}>
        <GridContainer spacing={0} style={{ fontWeight: 'bold', marginBottom: '16px' }}>
          <GridItem xs={3}>{'Widget Type'}</GridItem>
          <GridItem xs={1}>{' '}</GridItem>
          <GridItem xs={8}>{'Parameters'}</GridItem>
          {/* <GridItem xs={1}>{' '}</GridItem>
          <GridItem xs={2}>{'Include Results ?'}</GridItem> */}
        </GridContainer>
        {widgets_content}
      </div>
    );
  }

  isWidgetForOutput = (widget_data) => {
    return (this.state.results && _.find(this.state.results, function(result_item) {
      var component_regexp = new RegExp('component.*' + result_item.component, 'g');
      var type_regexp = new RegExp('type.*' + result_item.type, 'g');
      var name_regexp = new RegExp('name.*' + result_item.name, 'g');
      return (
        result_item.component && widget_data.code.match(component_regexp) &&
        result_item.type && widget_data.code.match(type_regexp) &&
        result_item.name && widget_data.code.match(name_regexp)
      );
    })) ? true : false;
  }

  renderSettingText = (item_key, item_label, item_value) => {
    return (
      <CustomInput
        labelText={item_label}
        id={item_key}
        formControlProps={{
          fullWidth: true
        }}
        inputProps={{
          onChange: event => this.onSettingChange(item_key, event.target.value),
          type: "text",
          value: item_value,
        }}
        // helpText={help_text}
      />
    );
  }

  renderSettingTextarea = (item_key, item_label, item_value) => {
    return [
      <Typography>{item_label}</Typography>,
      <div style={{ margin: '0 10px 10px 10px', border: '2px solid #eeeeee', borderRadius: '5px', width: "100%", height: "250px" }}>
        <MonacoEditor
          key={item_key}
          width="100%"
          height="100%"
          language="python"
          theme="vs"
          value={item_value}
          options={{
            selectOnLineNumbers: true
          }}
          onChange={new_text => this.onSettingChange(item_key, new_text)}
        />
      </div>
    ];

    // return (
    //   <CustomInput
    //     labelText={item_label}
    //     id={item_key}
    //     formControlProps={{
    //       fullWidth: true
    //     }}
    //     inputProps={{
    //       onChange: event => this.onSettingChange(item_key, event.target.value),
    //       type: "text",
    //       value: item_value,
    //       multiline: true,
    //       rows: 10
    //     }}
    //     // helpText={help_text}
    //   />
    // );
  }

  onSettingChange = (item_key, item_value) => {
    var response_params = this.state.params;
    var response_tags = {};
    var response_tag_index = 0;

    if (item_key.startsWith('tag_key_') || item_key.startsWith('tag_value_')) {
      var tag_index = false;
      var widget_index = false;

      if (item_key.startsWith('tag_key_')) {
        tag_index = item_key.replace('tag_key_', '');

        _.each(response_params.tags, function(response_tag_value, response_tag_key) {
          if (response_tag_index.toString() === tag_index) {
            response_tags[item_value] = response_tag_value;
          } else {
            response_tags[response_tag_key] = response_tag_value;
          }
          response_tag_index++;
        });
        response_params.tags = response_tags;
      } else {
        tag_index = item_key.replace('tag_value_', '');

        _.each(response_params.tags, function(response_tag_value, response_tag_key) {
          if (response_tag_index.toString() === tag_index) {
            response_tags[response_tag_key] = item_value;
          } else {
            response_tags[response_tag_key] = response_tag_value;
          }
          response_tag_index++;
        });
        response_params.tags = response_tags;
      }
    } else if (item_key.startsWith('code_')) {
      widget_index = item_key.replace('code_', '');
      response_params.widgets = _.map(response_params.widgets, function(widget_item, widget_item_index) {
        if (widget_item_index.toString() === widget_index) {
          widget_item.code = item_value;
        }

        return widget_item;
      });
    }

    this.setState({
      params: response_params
    });
  }

  getTabs = () => {
    return [
      { tabButton: 'Tags', tabContent: this.renderTagsContent() },
      { tabButton: 'Widgets', tabContent: this.renderWidgetsContent() }
    ];
  }

  triggerClick = () => {
    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_ACTION,
      {
        resource: "project-notebooks/trigger",
        action: this.state.iteration_id,
        callback: "onResponseTrigger",
        request_data: {
          params: this.state.params
        }
      },
      this,
      false
    );
  }

  onResponseTrigger = (crud, response_data) => {
    var main_path = {};
    if (this.state.project_id) {
      main_path = "projects/" + this.state.project_id;
      if (this.state.parent_project_id) {
        main_path = "projects/" + this.state.parent_project_id + "/case-studies/" + this.state.project_id;
      }
    }

    var triggered_runs_path = main_path  + "/notebooks/" + this.state.notebook_id + "/triggered-runs";

    window.open(getRoute(triggered_runs_path), '_self');
  }

  render() {
    const { classes } = this.props;

    var main_path = {};
    if (this.state.project_id) {
      main_path = "projects/" + this.state.project_id;
      if (this.state.parent_project_id) {
        main_path = "projects/" + this.state.parent_project_id + "/case-studies/" + this.state.project_id;
      }
    }

    var trigger_path = main_path  + "/notebooks/" + this.state.notebook_id + "/iterations/" + this.state.iteration_id + "/trigger";

    return (
      <div>
        <BreadcrumbsItem to={getRoute(trigger_path)}>
          <span className={classes.breadcrumbItemIconContainer}>
            <Icon className={classes.breadcrumbIcon}>flash_on</Icon>
            Trigger
          </span>
        </BreadcrumbsItem>
        {this.state.loading ? (
          <OrangeLinearProgress />
        ) : (this.state.params ? (
          [
            <Button key="trigger_button" color="primary" onClick={this.triggerClick}>
              <Icon className={classes.icons}>flash_on</Icon>
              <span style={{ paddingLeft: '2px' }}>Trigger</span>
            </Button>,
            <NavPills
              key="iteration_tabs"
              color="mathcoLight"
              horizontal={{
                tabsGrid: {
                  xs: 1
                },
                contentGrid: {
                  xs: 10
                }
              }}
              tabs={this.getTabs()}
            />
          ]
        ) : 'No params found')}
      </div>
    );
  }
}

IterationParams.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(breadcrumbStyle)(IterationParams);