import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from "react-table";
import { getRoute } from "utils.js";

import { withStyles } from '@material-ui/core';

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import { CardContent } from '@material-ui/core';

import Badge from "components/Badge/Badge.jsx";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import AppIcon from "components/CustomIcons/App.jsx";
import DeployIcon from "components/CustomIcons/Deploy.jsx";

import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

import CodexDataProvider, { CODEX_API_ACTION } from "views/CRUD/CodexDataProvider.jsx";

import problemDashboardStyle from "assets/jss/problemDashboardStyle.jsx";

let _ = require("underscore");

class ProblemDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;

    var industry = false;
    if (props.match.params.industry) {
      industry = props.match.params.industry;
    }

    var problem = false;
    if (props.match.params.problem) {
      problem = props.match.params.problem;
    }

    this.state = {
      loading: false,
      industry: industry,
      problem: problem
    };
  }

  componentDidMount() {
    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_ACTION,
      {
        resource: "projects",
        action: 'get-project',
        callback: "onResponseGetProject",
        request_data: {
          problem: decodeURIComponent(this.state.problem),
          industry: this.state.industry
        }
      },
      this,
      false
    );
  }

  onResponseGetProject = (crud, response_data) => {
    this.setState({
      loading: false,
      project_id: response_data['data']['data']['project_id'],
      project_name: response_data['data']['data']['project_name'],
      project_design_metadata: response_data['data']['data']['design_metadata'],
      app_id: response_data['data']['data']['deployed_app_id'],
      app_app_id: response_data['data']['data']['deployed_app_app_id'],
      app_notebook_id: response_data['data']['data']['deployed_app_notebook_id'],
      app_project_id: response_data['data']['data']['deployed_app_project_id'],
      app_parent_project_id: response_data['data']['data']['deployed_app_parent_project_id'],
      iterations: _.map(response_data['data']['data']['iterations'], function(iteration) {
        return {
          ...iteration,
          iteration_action: (
            <Icon style={{ cursor: 'pointer' }} color="primary" onClick={() => this.gotoIterations(iteration.notebook_id, iteration.project_id, iteration.parent_project_id)}>low_priority</Icon>
          )
        }
      }, this),
      techniques: response_data['data']['data']['techniques'],
      transformations: response_data['data']['data']['transformations'],
    });
  }

  goToProblemDesign = () => {
    window.open(getRoute('projects/' + this.state.project_id + '/design'), '_blank');
  }

  goToProblemApp = (screen_id) => {
    if (screen_id) {
      window.open(process.env['REACT_APP_PRODUCT_URL'].replace('<app_id>', this.state.app_id) + '/screen/' + screen_id, '_blank');
    } else {
      window.open(process.env['REACT_APP_PRODUCT_URL'].replace('<app_id>', this.state.app_id), '_blank');
    }
  }

  goToProblemEditAppConfig = () => {
    if (this.state.app_parent_project_id) {
      window.open(getRoute('projects/' + this.state.app_parent_project_id + '/case-studies/' + this.state.app_project_id + '/notebooks/' + this.state.app_notebook_id + '/app-configs/' + this.state.app_app_id + '/edit'), '_blank');
    } else {
      window.open(getRoute('projects/' + this.state.app_project_id + '/notebooks/' + this.state.app_notebook_id + '/app-configs/' + this.state.app_app_id + '/edit'), '_blank');
    }
  }

  gotoIterations = (notebook_id, project_id, parent_project_id) => {
    if (parent_project_id) {
      window.open(getRoute('projects/' + parent_project_id + '/case-studies/' + project_id + '/notebooks/' + notebook_id + '/iterations'), '_blank');
    } else {
      window.open(getRoute('projects/' + project_id + '/notebooks/' + notebook_id + '/iterations'), '_blank');
    }
  }

  render() {
    const { classes } = this.props;

    return this.state.loading ? (
      <div className={classes.container}>
        <OrangeLinearProgress />
      </div>
    ) : (
      <div className={classes.container}>
        <h3>{this.state.project_name}</h3>
        <p>{this.state.project_design_metadata ? this.state.project_design_metadata['business_opportunity'] : ''}</p>
        <GridContainer spacing={8}>
          <GridItem xs={12}>
            <Card>
              <CardContent>
                <p className={classes.problemDialogHeader}>Business Apps</p>
                <IconButton
                  className={classes.problemDialogIcon}
                  key="app"
                  aria-label="App"
                  color="primary"
                  disabled={this.state.app_id ? false : true}
                  onClick={this.goToProblemApp}
                >
                  <AppIcon />
                </IconButton>
                <IconButton
                  className={classes.problemDialogIcon}
                  key="deploy"
                  aria-label="Deploy"
                  color="primary"
                  disabled={this.state.app_id ? false : true}
                  // onClick={this.goToProblemApp}
                >
                  <DeployIcon />
                </IconButton>
                <IconButton
                  className={classes.problemDialogIcon}
                  key="edit"
                  aria-label="Edit"
                  color="primary"
                  onClick={this.goToProblemEditAppConfig}
                  disabled={this.state.app_id ? false : true}
                >
                  <Icon>create</Icon>
                </IconButton>
                {this.state.app_id ? <Icon color="success" className={classes.problemDialogStatus}>check_circle</Icon> : ''}
                <br clear="all" />
                {/* <GridContainer spacing={8}>
                  <GridItem xs={3}>
                    <Card>
                      <CardContent>
                        <p className={classes.problemDialogSubHeader}>Review Forecasts</p>
                        <IconButton
                          className={classes.problemDialogIcon}
                          key="app"
                          aria-label="App"
                          color="primary"
                          onClick={() => this.goToProblemApp(43)}
                        >
                          <AppIcon />
                        </IconButton>
                        <Icon color="success" className={classes.problemDialogStatus}>check_circle</Icon>
                        <br clear="all" />
                      </CardContent>
                    </Card>
                  </GridItem>
                  <GridItem xs={3}>
                    <Card>
                      <CardContent>
                        <p className={classes.problemDialogSubHeader}>Driver Analysis</p>
                        <IconButton
                          className={classes.problemDialogIcon}
                          key="app"
                          aria-label="App"
                          color="primary"
                          onClick={() => this.goToProblemApp(44)}
                        >
                          <AppIcon />
                        </IconButton>
                        <Icon color="success" className={classes.problemDialogStatus}>check_circle</Icon>
                        <br clear="all" />
                      </CardContent>
                    </Card>
                  </GridItem>
                  <GridItem xs={3}>
                    <Card>
                      <CardContent>
                        <p className={classes.problemDialogSubHeader}>Simulator</p>
                        <IconButton
                          className={classes.problemDialogIcon}
                          key="app"
                          aria-label="App"
                          color="primary"
                          disabled
                          // onClick={() => this.goToProblemApp(43)}
                        >
                          <AppIcon />
                        </IconButton>
                        <br clear="all" />
                      </CardContent>
                    </Card>
                  </GridItem>
                </GridContainer> */}
              </CardContent>
            </Card>
          </GridItem>
          {/* <GridItem xs={6}>
            <Card>
              <CardContent>
                <p className={classes.problemDialogHeader}>Data Sources</p>
                <IconButton
                  className={classes.problemDialogIcon}
                  key="blueprint"
                  aria-label="Blueprint"
                  color="primary"
                  onClick={this.goToProblemDesign}
                >
                  <Icon>account_tree</Icon>
                </IconButton>
                <br clear="all" />

                <GridContainer spacing={8}>
                  <GridItem xs={3}>
                    <Card>
                      <CardContent>
                        <p className={classes.problemDialogSubHeader}>Product attributes</p>
                        <Icon color="success" className={classes.problemDialogStatus}>check_circle</Icon>
                        <br clear="all" />
                      </CardContent>
                    </Card>
                  </GridItem><GridItem xs={3}>
                    <Card>
                      <CardContent>
                        <p className={classes.problemDialogSubHeader}>Promo Data</p>
                        <Icon color="success" className={classes.problemDialogStatus}>check_circle</Icon>
                        <br clear="all" />
                      </CardContent>
                    </Card>
                  </GridItem>
                  <GridItem xs={3}>
                    <Card>
                      <CardContent>
                        <p className={classes.problemDialogSubHeader}>POS Order data</p>
                        <Icon color="success" className={classes.problemDialogStatus}>check_circle</Icon>
                        <br clear="all" />
                      </CardContent>
                    </Card>
                  </GridItem>
                  <GridItem xs={3}>
                    <Card>
                      <CardContent>
                        <p className={classes.problemDialogSubHeader}>Macro-economic data</p>
                        <Icon color="success" className={classes.problemDialogStatus}>check_circle</Icon>
                        <br clear="all" />
                      </CardContent>
                    </Card>
                  </GridItem>
                </GridContainer>
              </CardContent>
            </Card>
          </GridItem> */}
        </GridContainer>
        <GridContainer spacing={8}>
          <GridItem xs={6}>
            <Card>
              <CardContent>
                <p className={classes.problemDialogHeader}>Blueprint</p>
                <IconButton
                  className={classes.problemDialogIcon}
                  key="blueprint"
                  aria-label="Blueprint"
                  color="primary"
                  onClick={this.goToProblemDesign}
                >
                  <Icon>account_tree</Icon>
                </IconButton>
                <br clear="all" />
                <GridContainer spacing={0}>
                  <GridItem xs={6}>
                    <p>Transformations</p>
                    {_.map(this.state.transformations, function(transformation) {
                      return (
                        <div className={classes.problemBadge}>
                          <Badge color="info">{transformation}</Badge>
                        </div>
                      );
                    })}
                  </GridItem>
                  <GridItem xs={6}>
                    <p>Techniques</p>
                    {_.map(this.state.techniques, function(technique) {
                      return (
                        <div className={classes.problemBadge}>
                          {technique === 'ucm' ? (
                            <Badge color="success">{technique}</Badge>
                          ) : (
                            <Badge color="primary">{technique}</Badge>
                          )}

                        </div>
                      );
                    })}
                  </GridItem>
                </GridContainer>
              </CardContent>
            </Card>
          </GridItem>
          {this.state.iterations && this.state.iterations.length > 0 ? (
            <GridItem xs={6}>
              <Card>
                <CardContent>
                  <p className={classes.problemDialogIconlessHeader}>Iterations</p>
                  <br clear="all"/>
                  <ReactTable
                    data={this.state.iterations}
                    sortable={false}
                    columns={[
                      { header: '', accessor: 'creator' },
                      { header: '', accessor: 'count' },
                      { header: '', accessor: 'last_submitted_at' },
                      { header: '', accessor: 'iteration_action' }
                    ]}
                    className="-striped -highlight"
                    minRows={0}
                    showPaginationBottom={false}
                  />
                  <br clear="all" />
                </CardContent>
              </Card>
            </GridItem>
          ) : (
            ''
          )}
        </GridContainer>
      </div>
    );
  }
};

ProblemDashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(problemDashboardStyle)(ProblemDashboard);