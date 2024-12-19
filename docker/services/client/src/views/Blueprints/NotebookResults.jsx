import React from "react";
import createPlotlyComponent from "react-plotly.js/factory";
import { withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { getRoute } from "utils.js";

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import NavPills from "components/NavPills/NavPills.jsx";
import Icon from "@material-ui/core/Icon";

import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

import breadcrumbStyle from "assets/jss/breadcrumbStyle.jsx";

import CodexDataProvider, { CODEX_API_GET } from "views/CRUD/CodexDataProvider.jsx";

// const Plotly = window.Plotly;
const Plot = createPlotlyComponent(window.Plotly);

let _ = require("underscore");

class NotebookResults extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;

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
      tags_spinner: false,
      results_spinner: false,
      tags: false,
      selected_tags: false,
      result_groups: false,
      results_data: false,
      graph_types_checked: false
    };
  }

  componentDidMount() {
    this.setState({
      results_spinner: true
    });

    CodexDataProvider(
      CODEX_API_GET,
      {
        resource: "project-notebooks/get-results",
        action: this.state.iteration_id,
        callback: "onResponseResults"
      },
      this,
      false
    );
  }

  onResponseResults = (crud, chart_data) => {
    var results_data = chart_data["data"];

    if (results_data) {
      var filtered_results = _.map(_.filter(results_data, function(result_item) {
        return result_item['visual_results'];
      }), function(filtered_result_item) {
        if ('data' in filtered_result_item['visual_results'] && 'layout' in filtered_result_item['visual_results']) {
          return filtered_result_item;
        } else if (filtered_result_item['visual_results'].constructor === Object) {
          filtered_result_item['result_keys'] = _.keys(filtered_result_item['visual_results']);
        } else {
          return filtered_result_item;
        }

        return filtered_result_item;
      });
      var result_groups = _.unique(_.map(filtered_results, function(result_item) {
        return result_item['type'];
      }));

      var graph_types_checked = [];
      _.each(_.filter(results_data, function(result_group_item) {
        if (result_group_item['visual_results'] && 'data' in result_group_item['visual_results'] && 'layout' in result_group_item['visual_results']) {
          return false;
        } else if (result_group_item['visual_results'] && _.keys(result_group_item['visual_results']).length > 0 && result_group_item['visual_results'].constructor === Object) {
          return true;
        }

        return false;
      }), function(filtered_result_item) {
        var graph_type_checked = {};

        var graph_type_counter = 0;
        _.each(filtered_result_item['visual_results'], function(graph_data, graph_type_index) {
          if (graph_type_counter === 0) {
            graph_type_checked[graph_type_index] = true;
          }

          graph_type_counter++;
        });
        graph_types_checked.push(graph_type_checked);
      });

      this.setState({
        result_groups: result_groups,
        results_data: results_data,
        results_spinner: false,
        graph_types_checked: graph_types_checked
      });
    } else {
      this.setState({
        result_groups: false,
        results_data: false,
        results_spinner: false,
        graph_types_checked: false
      });
    }
  }

  onGraphTypeChange = (graph_type, event) => {
    var graph_types = this.state.graph_types_checked;

    graph_types[event.target.id.replace('notebook_results_switch_', '')][graph_type] = event.target.checked;

    this.setState({
      graph_types_checked: graph_types
    });
  }

  getTabs = () => {
    const { classes } = this.props;

    var type_counter = 0;
    var item_counter = 0;
    var nested_item_counter = 0;
    var plot_counter = 0;
    return _.map(this.state.result_groups, function(result_group_item){
      type_counter++;

      var filtered_results = _.filter(this.state.results_data, function(results_data_item) {
        if (results_data_item['type'] === result_group_item && results_data_item['visual_results']) {
          if ('data' in results_data_item['visual_results'] && 'layout' in results_data_item['visual_results']) {
            return true;
          } else if(_.keys(results_data_item['visual_results']).length > 0) {
            return true;
          } else if(results_data_item['visual_results'].length > 0) {
            return true;
          }
        }

        return false;
      });

      // var graph_types = _.unique(_.flatten(_.map(filtered_results, function(filtered_result_item) {
      //   return filtered_result_item['result_keys'];
      // })));

      // if (graph_types.length === 1 && !graph_types[0]) {
      //   graph_types = []
      // }

      return {
        tabButton: result_group_item,
        tabContent: (
          <div>
            <GridContainer key={'grid_container_' + type_counter}>
              {_.map(filtered_results, function(filtered_result_item) {
                if ('data' in filtered_result_item['visual_results'] && 'layout' in filtered_result_item['visual_results']) {
                  item_counter++;
                  plot_counter++;
                  return (
                    <GridItem key={'grid_item_' + item_counter} xs={6}>
                      <Card>
                        <CardHeader color="mathcoLight">
                          <h4 className={classes.cardTitle}>
                            {filtered_result_item['name']}
                          </h4>
                        </CardHeader>
                        <CardBody>
                          <div style={{overflow: "auto"}}>
                            {filtered_result_item['visual_results'].constructor === Object ? (
                              <Plot divId={'plot_' + item_counter + '_' + plot_counter} data={filtered_result_item['visual_results']['data']} layout={filtered_result_item['visual_results']["layout"]} frames={filtered_result_item['visual_results']["frames"]} />
                            ) : (
                              <object aria-label={'plot_' + item_counter + '_' + plot_counter} key={'plot_' + item_counter + '_' + plot_counter} style={{ minHeight: "500px", width: "100%" }}  data={'data:text/html,' + encodeURIComponent(filtered_result_item['visual_results'])}></object>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    </GridItem>
                  );
                } else {
                  if (filtered_result_item['visual_results'].constructor === Object) {
                    item_counter++;
                    nested_item_counter++;
                    return (
                      <GridItem key={'grid_item_' + item_counter} xs={6}>
                        <Card>
                          <CardHeader color="mathcoLight">
                            <h4 className={classes.cardTitle}>
                              {filtered_result_item['name']}
                            </h4>
                          </CardHeader>
                          <CardBody>
                            <div style={{overflow: "auto"}}>
                              <div>
                                {_.map(filtered_result_item['visual_results'], function(graph_data, graph_type_index) {
                                  return (
                                    <FormControlLabel
                                      key={"form_control_label_" + graph_type_index}
                                      control={
                                        <Switch
                                          checked={this.state.graph_types_checked[nested_item_counter-1][graph_type_index]}
                                          onChange={event => this.onGraphTypeChange(graph_type_index, event)}
                                          id={'notebook_results_switch_' + (nested_item_counter - 1)}
                                          value={graph_type_index}
                                          classes={{
                                            switchBase: classes.switchBase,
                                            checked: classes.switchChecked,
                                            thumb: classes.switchIcon,
                                            track: classes.switchBar
                                          }}
                                        />
                                      }
                                      classes={{
                                        label: classes.label
                                      }}
                                      label={graph_type_index}
                                    />
                                  )
                                }, this)}
                              </div>
                              { _.map(filtered_result_item['visual_results'], function(result_item, result_index) {
                                if (this.state.graph_types_checked[nested_item_counter-1][result_index]) {
                                  plot_counter++;
                                  if (result_item.constructor === Object) {
                                    return <Plot key={'plot_' + item_counter + '_' + plot_counter} divId={'plot_' + item_counter + '_' + plot_counter} data={result_item['data']} layout={result_item["layout"]} frames={result_item["frames"]} />
                                  } else {
                                    return (
                                      <object aria-label={'plot_' + item_counter + '_' + plot_counter} key={'plot_' + item_counter + '_' + plot_counter} style={{ minHeight: "500px", width: "100%" }}  data={'data:text/html,' + encodeURIComponent(result_item)}></object>
                                    );
                                  }
                                } else {
                                  return '';
                                }
                              }, this)}
                            </div>
                          </CardBody>
                        </Card>
                      </GridItem>
                    )
                  }

                  return '';
                }
              }, this)}
            </GridContainer>
          </div>
        )
      };
    }, this);
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

    var results_path = main_path  + "/notebooks/" + this.state.notebook_id + "/iterations/" + this.state.iteration_id + "/results";

    return (
      <div>
        <BreadcrumbsItem to={getRoute(results_path)}>
          <span className={classes.breadcrumbItemIconContainer}>
            <Icon className={classes.breadcrumbIcon}>assessment</Icon>
            Results
          </span>
        </BreadcrumbsItem>
        <div>
          { this.state.results_spinner ? (
            <OrangeLinearProgress/>
          ) : this.state.result_groups ? (
              <NavPills
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
            ) : 'No results found'
          }
        </div>
      </div>
    );
  }
}

NotebookResults.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(breadcrumbStyle)(NotebookResults);