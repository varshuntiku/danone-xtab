import React from "react";
import PropTypes from "prop-types";
import { getRoute } from "utils.js";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import { CardActionArea, CardContent } from '@material-ui/core';

import CodexDataProvider, { CODEX_API_GET } from "views/CRUD/CodexDataProvider.jsx";

import buttonStyle from "assets/jss/material-dashboard-pro-react/components/buttonStyle.jsx";
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";
import badgeStyle from "assets/jss/material-dashboard-pro-react/components/badgeStyle.jsx";
import hierarchyStyle from "assets/jss/hierarchyStyle.jsx";

import Footer from "components/Footer/Footer.jsx";
import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

import no_data_img from "assets/img/no_data.png";
import airlines_logo from "assets/img/Airlines.svg";
import cpg_logo from "assets/img/CPG.svg";
import retail_logo from "assets/img/Retail.svg";
import auto_logo from "assets/img/Auto.svg";
import pharma_logo from "assets/img/Pharma.svg";
import telecom_logo from "assets/img/telecom.svg";
import banking_logo from "assets/img/Banking.svg";
import insurance_logo from "assets/img/Insurance.svg";
import technology_logo from "assets/img/Technology.svg";

let _ = require("underscore");

class Hierarchy extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      industries: false,
      problems: false,
      selected_industry: false,
      selected_function: false,
      selected_problem_area: false,
      selected_problem: false,
      loading_project: false,
      alert: ''
    };
  }

  componentDidMount() {
    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_GET,
      {
        resource: "hierarchy",
        action: "get-info",
        callback: "onResponseHierarchy"
      },
      this,
      false
    );
  }

  onResponseHierarchy(crud, response_data) {
    this.setState({
      loading: false,
      industries: response_data['data']['industries'],
      problems: response_data['data']['problems']
    });
  }

  onClickIndustry = (selected_industry) => {
    if (selected_industry === this.state.selected_industry) {
      this.setState({
        selected_industry: false,
        selected_function: false,
        selected_problem_area: false,
        selected_problem: false
      });
    } else {
      this.setState({
        selected_industry: selected_industry,
        selected_function: false,
        selected_problem_area: false,
        selected_problem: false
      });
    }
  }

  onClickFunction = (selected_function) => {
    if (selected_function === this.state.selected_function) {
      this.setState({
        selected_function: false,
        selected_problem_area: false,
        selected_problem: false
      });
    } else {
      this.setState({
        selected_function: selected_function,
        selected_problem_area: false,
        selected_problem: false
      });
    }
  }

  onClickProblemArea = (selected_problem_area) => {
    if (selected_problem_area === this.state.selected_problem_area) {
      this.setState({
        selected_problem_area: false,
        selected_problem: false
      });
    } else {
      this.setState({
        selected_problem_area: selected_problem_area,
        selected_problem: false
      });
    }
  }

  onClickProblem = (selected_problem) => {
    window.open(getRoute('problem/' + this.state.selected_industry + '/' + encodeURIComponent(selected_problem)), '_blank');
  }

  getEmptyMessage = () => {
    if (this.state.selected_industry) {
      if (!this.state.selected_function) {
        return 'please select a function to display';
      } else if (!this.state.selected_problem_area) {
        return 'please select a problem area to display';
      } else {
        return '';
      }
    } else {
      return 'please select an industry to display';
    }
  }

  getSelectedIndustryColor = () => {
    var self = this;
    var selected_industry = _.find(this.state.industries, function(industry) {
      return industry['name'] === self.state.selected_industry;
    });

    if (selected_industry) {
      return selected_industry['color'];
    } else {
      return '';
    }
  }

  getIndustryIcon = (industry_name, is_small) => {
    switch(industry_name) {
      case 'Airlines':
        return airlines_logo;
      case 'CPG':
        return cpg_logo;
      case 'Automotive':
        return auto_logo;
      case 'Telecom':
        return telecom_logo;
      case 'Retail':
        return retail_logo;
      case 'Pharmaceuticals':
        return pharma_logo;
      case 'Banking':
        return banking_logo;
      case 'Insurance':
        return insurance_logo;
      case 'Technology':
        return technology_logo;
      default:
        return false;
    }
  }

  sortList = (list, sort_index) => {
    return _.sortBy(list, function(list_item) {
      return list_item[sort_index];
    });
  }

  getTitleClass = (no_of_industries) => {
    const { classes } = this.props;

    if (no_of_industries > 8) {
      return classes.stageItemTitle4;
    } else if (no_of_industries > 6) {
      return classes.stageItemTitle3;
    } else if (no_of_industries > 4) {
      return classes.stageItemTitle2;
    } else if (no_of_industries > 2) {
      return classes.stageItemTitle1;
    } else {
      return classes.stageItemTitle;
    }
  }

  getIndustryMappingContainerClass = (no_of_industries) => {
    const { classes } = this.props;

    if (no_of_industries > 8) {
      return classes.stageItemCircleContainer6;
    } else if (no_of_industries > 6) {
      return classes.stageItemCircleContainer5;
    } else if (no_of_industries > 4) {
      return classes.stageItemCircleContainer4;
    } else if (no_of_industries > 2) {
      return classes.stageItemCircleContainer3;
    } else if (no_of_industries > 1) {
      return classes.stageItemCircleContainer2;
    } else {
      return classes.stageItemCircleContainer1;
    }
  }

  getWidgetClass = (type, widget_option) => {
    const { classes } = this.props;

    switch(type) {
      case 'industry':
        if (this.state.selected_industry) {
          if (this.state.selected_industry === widget_option) {
            return classes.stageItemIndustrySelected;
          } else {
            return classes.stageItemIndustryNotSelected;
          }
        } else {
          return classes.stageItemIndustry;
        }
      case 'function':
        if (this.state.selected_function) {
          if (this.state.selected_function === widget_option) {
            return classes.stageItemSelected;
          } else {
            return classes.stageItemNotSelected;
          }
        } else {
          return classes.stageItem;
        }
      case 'problem_area':
        if (this.state.selected_problem_area) {
          if (this.state.selected_problem_area === widget_option) {
            return classes.stageItemSelected;
          } else {
            return classes.stageItemNotSelected;
          }
        } else {
          return classes.stageItem;
        }
      default:
        return false;
    }
  }

  render() {
    const { classes, is_main } = this.props;

    return this.state.loading ? (
      <OrangeLinearProgress />
    ) : (
      <div>
        <GridContainer spacing={8} className={classes.container}>
          <GridItem className={classes.containerItem} xs={3}>
            <div className={classes.stageTitle}>Industry</div>
            <div className={classes.stageBody}>
              {
                _.map(this.sortList(this.state.industries, 'name'), function(industry) {
                  return (
                    <Card key={'industry_' + industry['name']} style={{ borderLeftColor: industry['color'], boxShadow: (this.state.selected_industry === industry['name'] ? '0 0 1px 1px ' + this.getSelectedIndustryColor() : '0 0 1px 1px #eeeeee') }} className={this.getWidgetClass('industry', industry['name'])}>
                      <CardActionArea>
                        <CardContent onClick={() => this.onClickIndustry(industry['name'])}>
                          <div className={classes.stageItemTitle}>
                            {industry['name']}
                            <div className={classes.stageItemCircleContainerIndustry}>
                              <img src={this.getIndustryIcon(industry['name'], false)} alt={industry['name']} />
                            </div>
                          </div>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  );
                }, this)
              }
            </div>
          </GridItem>
          <GridItem className={classes.containerItem} xs={3}>
            <div className={classes.stageTitle}>Function</div>
            <div className={classes.stageBody}>
              {
                _.map(_.unique(_.map(_.filter(this.sortList(this.state.problems, 'function'), function(problem) {
                  return this.state.selected_industry ? (this.state.selected_industry === problem['industry']) : true;
                }, this), function(filtered_problem) {
                  return filtered_problem['function'];
                })), function(unique_function) {

                  var unique_industries = _.unique(_.map(_.filter(_.map(this.state.problems, function(problem) {
                    return { industry: problem['industry'], function: problem['function'] }
                  }), function(mapped_function) {
                    return mapped_function['function'] === unique_function
                  }), function(filtered_industry) {
                    return filtered_industry['industry'];
                  }));

                  return (
                    <Card key={'function_' + unique_function} style={{ boxShadow: (this.state.selected_function === unique_function ? '0 0 1px 1px ' + this.getSelectedIndustryColor() : '0 0 1px 1px #eeeeee') }} className={this.getWidgetClass('function', unique_function)}>
                      <CardActionArea>
                        <CardContent onClick={() => this.onClickFunction(unique_function)}>
                          <div className={this.getTitleClass(unique_industries.length)}>
                            {unique_function}
                            <div className={this.getIndustryMappingContainerClass(unique_industries.length)}>
                              {
                                _.map(unique_industries, function(connected_industry) {
                                  var found_industry = _.find(this.state.industries, function(industry) {
                                    return industry['name'] === connected_industry;
                                  });

                                  return (
                                    <img key={'function_' + unique_function + found_industry['name']} src={this.getIndustryIcon(found_industry['name'], true)} alt={found_industry['name']} className={classes.stageItemCircle} />
                                    // <div style={{backgroundColor: found_industry['color']}} title={found_industry['name']} className={classes.stageItemCircle}></div>
                                  );
                                }, this)
                              }
                            </div>
                          </div>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  );
                }, this)
              }
            </div>
          </GridItem>
          <GridItem className={classes.containerItem} xs={3}>
            <div className={classes.stageTitle}>Problem Area</div>
              {
                this.state.selected_industry && this.state.selected_function ? (
                  <div className={classes.stageBody}>
                    {
                      _.map(_.unique(_.map(_.filter(this.sortList(this.state.problems, 'problem_area'), function(problem) {
                        var industry_satisfied = this.state.selected_industry ? (this.state.selected_industry === problem['industry']) : true;
                        var function_satisfied = this.state.selected_function ? (this.state.selected_function === problem['function']) : true;

                        return industry_satisfied && function_satisfied;
                      }, this), function(filtered_problem) {
                        return filtered_problem['problem_area'];
                      })), function(unique_problem_area) {

                        var unique_industries = _.unique(_.map(_.filter(_.map(this.state.problems, function(problem) {
                          return { industry: problem['industry'], problem_area: problem['problem_area'] }
                        }), function(mapped_function) {
                          return mapped_function['problem_area'] === unique_problem_area
                        }), function(filtered_industry) {
                          return filtered_industry['industry'];
                        }));

                        return (
                          <Card key={'problem_area_' + unique_problem_area} style={{ boxShadow: (this.state.selected_problem_area === unique_problem_area ? '0 0 1px 1px ' + this.getSelectedIndustryColor() : '0 0 1px 1px #eeeeee') }} className={this.getWidgetClass('problem_area', unique_problem_area)}>
                            <CardActionArea>
                              <CardContent onClick={() => this.onClickProblemArea(unique_problem_area)}>
                                <div className={this.getTitleClass(unique_industries.length)}>
                                  {unique_problem_area}
                                  <div className={this.getIndustryMappingContainerClass(unique_industries.length)}>
                                    {
                                      _.map(unique_industries, function(connected_industry) {
                                        var found_industry = _.find(this.state.industries, function(industry) {
                                          return industry['name'] === connected_industry;
                                        });

                                        return (
                                          <img key={'problem_area_' + unique_problem_area + found_industry['name']} src={this.getIndustryIcon(found_industry['name'], true)} alt={found_industry['name']} className={classes.stageItemCircle} />
                                          // <div style={{backgroundColor: found_industry['color']}} title={found_industry['name']} className={classes.stageItemCircle}></div>
                                        );
                                      }, this)
                                    }
                                  </div>
                                </div>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        );
                      }, this)
                    }
                  </div>
                ) : (
                  <div className={classes.stageBodyEmpty}>
                    <div style={{ float: 'left', width: '100%', fontColor: '#6F7786', fontSize: '15px' }}>
                      <img src={no_data_img} alt="No data" />
                      <br/>
                      {this.getEmptyMessage() + ' problem areas.'}
                    </div>
                    <br clear="all"/>
                  </div>
                )
              }
          </GridItem>
          <GridItem xs={3}>
            <div className={classes.stageTitle}>Problem</div>
            {this.state.selected_industry && this.state.selected_function && this.state.selected_problem_area ? (
              <div className={classes.stageBody}>
                {
                  _.map(_.unique(_.map(_.filter(this.sortList(this.state.problems, 'problem'), function(problem) {
                    var industry_satisfied = this.state.selected_industry ? (this.state.selected_industry === problem['industry']) : true;
                    var function_satisfied = this.state.selected_function ? (this.state.selected_function === problem['function']) : true;
                    var problem_area_satisfied = this.state.selected_problem_area ? (this.state.selected_problem_area === problem['problem_area']) : true;

                    return industry_satisfied && function_satisfied && problem_area_satisfied;
                  }, this), function(filtered_problem) {
                    return filtered_problem['problem'];
                  })), function(unique_problem) {

                    var unique_industries = _.unique(_.map(_.filter(_.map(this.state.problems, function(problem) {
                      return { industry: problem['industry'], problem: problem['problem'] }
                    }), function(mapped_function) {
                      return mapped_function['problem'] === unique_problem
                    }), function(filtered_industry) {
                      return filtered_industry['industry'];
                    }));

                    return (
                      <div key={'problem_container_' + unique_problem} style={{ position: 'relative' }} >
                        { this.state.selected_problem === unique_problem && this.state.loading_project ? (
                          <OrangeLinearProgress is_problem_loader={true} />
                        ) : (
                          ''
                        )}
                        <Card key={'problem_' + unique_problem} className={classes.stageItem}>
                          <CardActionArea>
                            <CardContent onClick={() => this.onClickProblem(unique_problem)}>
                              <div className={this.getTitleClass(unique_industries.length)}>
                                {unique_problem}
                                <div className={this.getIndustryMappingContainerClass(unique_industries.length)}>
                                  {
                                    _.map(unique_industries, function(connected_industry) {
                                      var found_industry = _.find(this.state.industries, function(industry) {
                                        return industry['name'] === connected_industry;
                                      });

                                      return (
                                        <img key={'problem_' + unique_problem + found_industry['name']} src={this.getIndustryIcon(found_industry['name'], true)} alt={found_industry['name']} className={classes.stageItemCircle} />
                                        // <div style={{backgroundColor: found_industry['color']}} title={found_industry['name']} className={classes.stageItemCircle}></div>
                                      );
                                    }, this)
                                  }
                                </div>
                              </div>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </div>
                    );
                  }, this)
                }
              </div>
            ) : (
              <div className={classes.stageBodyEmpty}>
                <div style={{ float: 'left', width: '100%', fontColor: '#6F7786', fontSize: '15px' }}>
                    <img src={no_data_img} alt="No data" />
                    <br/>
                    {this.getEmptyMessage() + ' problems.'}
                </div>
                <br clear="all"/>
              </div>
            )}
          </GridItem>
        </GridContainer>
        {is_main ? (
          <Footer fluid black />
        ) : (
          ""
        )}
      </div>
    );
  }
}

Hierarchy.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles({
  ...hierarchyStyle,
  ...buttonStyle,
  ...sweetAlertStyle,
  ...badgeStyle
})(Hierarchy);
