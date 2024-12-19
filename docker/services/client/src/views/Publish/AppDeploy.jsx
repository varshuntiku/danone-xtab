import React from "react";

import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";
import { Icon, Button } from "@material-ui/core";

import SweetAlert from "react-bootstrap-sweetalert";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import CodexDataProvider, { CODEX_API_ACTION } from "views/CRUD/CodexDataProvider.jsx";

import appDeployStyle from "assets/jss/appDeployStyle.jsx";
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";

let _ = require("underscore");

class AppDeploy extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            status: {
                app: 'NOT_STARTED',
                app_timetaken: false,
                screens: [],
                value: 'NOT_STARTED',
                deployed_app_id: false
            }
        };
    }

    startDeploy = () => {
        const { app_config } = this.props;

        // console.log('Deploy can start now...');

        this.setState({
            status: {
                app: 'NOT_STARTED',
                screens: [],
                value: 'IN_PROGRESS'
            }
        });

        this.deployStep('app');

        _.each(app_config.config.screens, function (screen_info, screen_index) {
            this.deployStep('screen', screen_index, screen_info.name);
        }, this);

        this.nextDeployStep(this.state.status);
    };

    deployStep = (deploy_type, deploy_index, deploy_name) => {
        var deploy_status = this.state.status;

        if (deploy_type === 'app') {
            deploy_status.app = 'IN_PROGRESS';
            deploy_status.value = 'IN_PROGRESS';
        } else if (deploy_type === 'screen') {
            deploy_status.screens.push({
                index: deploy_index,
                name: deploy_name,
                status: 'IN_PROGRESS',
                timetaken: false
            });
            deploy_status.app = 'IN_PROGRESS';
            deploy_status.value = 'IN_PROGRESS';
        }

        this.setState({
            status: deploy_status
        });
    };

    nextDeployStep = (deploy_status) => {
        const { deploying_notebook_id, deploying_item_id, overwrite } = this.props;

        if (deploy_status.app === 'SUCCESS') {
            var next_step = _.find(deploy_status.screens, function (screen_info) {
                return screen_info.status === 'IN_PROGRESS';
            });

            if (next_step && this.state.deployed_app_id) {
                CodexDataProvider(
                    CODEX_API_ACTION,
                    {
                        resource: "app-configs/" + deploying_notebook_id + "/" + deploying_item_id,
                        action: "deploy",
                        callback: "onDeployCompleteStep",
                        request_data: {
                            overwrite: overwrite,
                            type: 'screen',
                            index: next_step.index,
                            name: next_step.name,
                            app_id: this.state.deployed_app_id
                        }
                    },
                    this,
                    false
                );
            } else {
                var failed_screen = _.find(deploy_status.screens, function (screen_info) {
                    return screen_info.status === 'FAILURE';
                });

                if (!failed_screen) {
                    deploy_status.value = 'SUCCESS';
                    this.setState({
                        status: deploy_status
                    });
                } else {
                    deploy_status.value = 'FAILURE';
                    this.setState({
                        status: deploy_status
                    });
                }
            }
        } else if (deploy_status.app === 'IN_PROGRESS') {
            CodexDataProvider(
                CODEX_API_ACTION,
                {
                    resource: "app-configs/" + deploying_notebook_id + "/" + deploying_item_id,
                    action: "deploy",
                    callback: "onDeployCompleteStep",
                    request_data: {
                        overwrite: overwrite,
                        type: 'app',
                        index: false,
                        name: false,
                        app_id: false
                    }
                },
                this,
                false
            );
        } else {

        }
    };

    onDeployCompleteStep = (crud, response_data) => {
        response_data = response_data.data;
        // console.log(response_data);
        var deploy_status = this.state.status;
        var app_id = false;

        if (response_data.status && response_data.status === 'success') {
            if (response_data.params.type === 'app') {
                deploy_status.app = 'SUCCESS';
                deploy_status.app_timetaken = response_data.timetaken;
                app_id = response_data.data.app_id;
            } else if (response_data.params.type === 'screen') {
                deploy_status.screens[response_data.params.index].status = 'SUCCESS';
                deploy_status.screens[response_data.params.index].timetaken = response_data.timetaken;
                app_id = this.state.deployed_app_id;
            }
        } else if (response_data.status && response_data.status === 'failure') {
            if (response_data.params.type === 'app') {
                deploy_status.app = 'FAILURE';
                if (response_data.error) {
                    deploy_status.app_error = response_data.error;
                    deploy_status.app_timetaken = response_data.timetaken;
                }
            } else if (response_data.params.type === 'screen') {
                deploy_status.screens[response_data.params.index].status = 'FAILURE';
                if (response_data.error) {
                    deploy_status.screens[response_data.params.index].error = response_data.error;
                    deploy_status.screens[response_data.params.index].timetaken = response_data.timetaken;
                }
            }
        } else {
            if (response_data.params.type === 'app') {
                deploy_status.app = 'FAILURE';
            } else if (response_data.params.type === 'screen') {
                deploy_status.screens[response_data.params.index].status = 'FAILURE';
            }
        }

        this.setState({
            status: deploy_status,
            deployed_app_id: app_id
        });

        this.nextDeployStep(deploy_status);
    };

    cancelDeploy = () => {
        const { parent_obj } = this.props;

        parent_obj.hideDeployDialog();
    };

    renderDeployStepStatus = (status_value, status_error, status_timetaken) => {
        const { classes } = this.props;

        if (status_value === 'NOT_STARTED') {
            return <Icon color="secondary">stop</Icon>;
        } else if (status_value === 'IN_PROGRESS') {
            return (
                <GridContainer>
                    <GridItem xs={4}>
                        {' '}
                    </GridItem>
                    <GridItem xs={4}>
                        <Icon className={classes.orange_icon}>autorenew</Icon>
                    </GridItem>
                    <GridItem xs={4}>
                        {''}
                    </GridItem>
                </GridContainer>
            );
        } else if (status_value === 'SUCCESS') {
            return (
                <GridContainer>
                    <GridItem xs={4}>
                        {status_timetaken && (Math.round(status_timetaken * 10) / 10) !== 0 ? (Math.round(status_timetaken * 10) / 10) : ' '}
                    </GridItem>
                    <GridItem xs={4}>
                        <Icon className={classes.green_icon}>check_circle</Icon>
                    </GridItem>
                    <GridItem xs={4}>
                        {''}
                    </GridItem>
                </GridContainer>
            );
        } else if (status_value === 'FAILURE') {
            return (
                <GridContainer>
                    <GridItem xs={4}>
                        {status_timetaken && (Math.round(status_timetaken * 10) / 10) !== 0 ? (Math.round(status_timetaken * 10) / 10) : ' '}
                    </GridItem>
                    <GridItem xs={4}>
                        <Icon color="secondary" title={status_error ? status_error : ''}>error_outline</Icon>
                    </GridItem>
                    <GridItem xs={4}>
                        {''}
                    </GridItem>
                </GridContainer>
            );
        }
    };

    render() {
        const { classes, app_config, overwrite } = this.props;

        return (
            <SweetAlert
                type={this.state.deployed ? 'success' : 'info'}
                success={this.state.deployed ? true : false}
                customClass={classes.higherAlert}
                title={app_config.name + ' ... '}
                showConfirm={false}
                // showCancel={true}
                onConfirm={() => { return false; }}
            // onCancel={() => this.cancelDeploy()}
            // confirmBtnCssClass={classes.button + " " + classes.codxDark}
            // confirmBtnText='DEPLOY'
            >
                <div className={classes.deployHeader}>
                    <div className={classes.deployStepContainer}>
                        <div className={classes.deployStepLabel}>Deploying app</div>
                        <div className={classes.deployStepStatus}>{this.renderDeployStepStatus(this.state.status.value)}</div>
                        <br clear="all" />
                    </div>
                </div>
                <div className={classes.deployStepContainer}>
                    <div className={classes.deployStepLabel}><Icon className={classes.deployStepIcon}>keyboard_return</Icon> App settings & metadata</div>
                    <div className={classes.deployStepStatus}>{this.renderDeployStepStatus(this.state.status.app, this.state.status.app_error, this.state.status.app_timetaken)}</div>
                    <br clear="all" />
                </div>
                <div className={classes.deployStepsContainer}>
                    <div className={classes.deployScreensLabel}>Screens</div>
                    {_.map(app_config.config.screens, function (screen_info, screen_index) {
                        return (
                            <div key={'screen_deploy_step_' + screen_index} className={classes.deployStepContainer}>
                                <div className={screen_info.level ? (screen_info.level === 1 ? classes.deployStepLabelLevel1 : classes.deployStepLabelLevel2) : classes.deployStepLabel}><Icon className={classes.deployStepIcon}>keyboard_return</Icon> {screen_info.name}</div>
                                <div className={classes.deployStepStatus}>
                                    {
                                        this.state.status.screens[screen_index] && this.state.status.screens[screen_index].status ?
                                            this.renderDeployStepStatus(this.state.status.screens[screen_index].status, this.state.status.screens[screen_index].error, this.state.status.screens[screen_index].timetaken) :
                                            this.renderDeployStepStatus('NOT_STARTED')
                                    }
                                </div>
                                <br clear="all" />
                            </div>
                        );
                    }, this)}
                </div>
                {this.state.status.value === 'NOT_STARTED' ? (
                    <div className={classes.deployToolbar}>
                        <Button className={classes.button + " " + classes.codxDark} onClick={() => this.startDeploy(overwrite)}>Deploy</Button>
                        <Button className={classes.button + " " + classes.danger} onClick={this.cancelDeploy}>Cancel</Button>
                    </div>
                ) : (
                    <div className={classes.deployToolbar}>
                        <Button className={classes.button + " " + classes.danger} onClick={this.cancelDeploy}>Close</Button>
                    </div>
                )}
            </SweetAlert>
        );
    }
}

AppDeploy.propTypes = {
    parent_obj: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    app_config: PropTypes.object.isRequired,
    overwrite: PropTypes.bool.isRequired,
    deploying_notebook_id: PropTypes.number.isRequired,
    deploying_item_id: PropTypes.number.isRequired
};

export default withStyles({
    ...sweetAlertStyle,
    ...appDeployStyle,
})(AppDeploy);