import React from "react";
import { Route, Switch } from "react-router-dom";
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { getRoute } from "utils.js";

import { withStyles } from "@material-ui/core";
import Extension from "@material-ui/icons/Extension";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import SweetAlert from "react-bootstrap-sweetalert";

import CodexCRUD from "views/CRUD/CodexCRUD.jsx";
import AppPublish from "views/Publish/AppPublish.jsx";
import AppDeploy from "views/Publish/AppDeploy.jsx";

// import CodexDataProvider, { CODEX_API_ACTION } from "views/CRUD/CodexDataProvider.jsx";

import breadcrumbStyle from "assets/jss/breadcrumbStyle.jsx";
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";
import buttonStyle from "assets/jss/material-dashboard-pro-react/components/buttonStyle.jsx";

// import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

class AppConfigs extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            deployDialog: false,
            deploySuccessfulDialog: false,
            deploying: false,
            deploying_item_id: false,
            deploying_notebook_id: false,
            deploying_item_data: false
        };
    }

    extra_actions = (crud, action_key, item_id, item_data) => {
        if (action_key === 'deploy') {
            this.setState({
                deployDialog: true,
                deploying: false,
                deploying_item_id: item_id,
                deploying_notebook_id: item_data['notebook_id'],
                deploying_item_data: item_data
            });
        } else if (action_key === 'app') {
            if (item_data['app_id']) {
                window.open(process.env['REACT_APP_PRODUCT_URL'].replace('<app_id>', item_data['app_id']), '_blank');
            }
        }
    };

    deployApp = (overwrite) => {
        this.setState({
            deployDialog: false,
            deploying: true,
            deploy_overwrite: overwrite
        });
    };

    // deployApp = (overwrite) => {
    //   CodexDataProvider(
    //     CODEX_API_ACTION,
    //     {
    //       resource: "app-configs/" + this.state.deploying_notebook_id + "/" + this.state.deploying_item_id,
    //       action: "deploy",
    //       callback: "onResponseDeploy",
    //       request_data: {
    //         overwrite: overwrite
    //       }
    //     },
    //     this,
    //     false
    //   );

    //   this.setState({
    //     deployDialog: false,
    //     deploying: true,
    //     deploying_notebook_id: false
    //   });
    // }

    // onResponseDeploy = (crud, response_data) => {
    //   this.setState({
    //     deploySuccessfulDialog: true,
    //     deploying: false,
    //     deploying_item_id: false
    //   });
    // }

    hideDeployDialog = () => {
        this.setState({
            deployDialog: false,
            deploying: false,
            deploying_item_id: false
        });
    };

    hideDeploySuccessfulDialog = () => {
        this.setState({
            deploySuccessfulDialog: false
        });
    };

    render() {
        const { classes, match } = this.props;

        var project_id = false;
        var case_study_id = false;
        var notebook_id = false;

        if (match.params.project_id) {
            project_id = match.params.project_id;
        }

        if (match.params.case_study_id) {
            case_study_id = match.params.case_study_id;
        }

        if (match.params.notebook_id) {
            notebook_id = match.params.notebook_id;
        }

        var main_path = "";
        var main_route_path = "";
        if (project_id) {
            main_path = "projects/" + project_id;
            main_route_path = "projects/:project_id";
            if (case_study_id) {
                main_path = "projects/" + project_id + "/case-studies/" + case_study_id;
                main_route_path = "projects/:project_id/case-studies/:case_study_id";
            }
        }

        var breadcrumb_main_path = main_path + "/notebooks/" + notebook_id;
        main_route_path = main_route_path + "/notebooks/:notebook_id";

        var user_info = JSON.parse(sessionStorage.getItem('user_info'));

        var object_name = 'Application Configuration';
        var object_plural_name = 'Application Configurations';

        const app_config_params = {
            link_prefix: breadcrumb_main_path,
            route_prefix: main_route_path,
            table_key: 'app-configs',
            list: {
                name: object_plural_name,
                name_singular: object_name,
                headers: [],
                url_slug: "app-configs/" + notebook_id
            },
            add: {
                name: "Add " + object_name
            },
            edit: {
                name: "Edit " + object_name
            },
            custom_form: AppPublish,
            fields: {
                list: [
                    {
                        Header: "Name",
                        accessor: "name",
                        sortable: true,
                        filterable: true,
                        type: "text"
                    },
                    {
                        Header: "Environment",
                        accessor: "environment",
                        sortable: true,
                        filterable: true,
                        type: "text"
                    },
                    {
                        Header: "Created by",
                        accessor: "created_by",
                        hide_add: true,
                        hide_edit: true,
                        is_required: false,
                        sortable: true,
                        filterable: true,
                        type: "text",
                    },
                    {
                        Header: "Updated by",
                        accessor: "updated_by",
                        hide_add: true,
                        hide_edit: true,
                        is_required: false,
                        sortable: true,
                        filterable: true,
                        type: "text",
                    },
                    {
                        Header: "Last deployed by",
                        accessor: "last_deployed_by",
                        hide_add: true,
                        hide_edit: true,
                        is_required: false,
                        sortable: true,
                        filterable: true,
                        type: "text",
                    },
                    {
                        Header: "Last deployed at",
                        accessor: "last_deployed_at",
                        hide_add: true,
                        hide_edit: true,
                        is_required: false,
                        sortable: true,
                        filterable: true,
                        type: "text",
                    },
                    {
                        Header: "Actions",
                        accessor: "actions",
                        sortable: false,
                        filterable: false
                    }
                ]
            },
            icon: Extension,
            actions: {
                add: user_info.feature_access['app_publish'],
                edit: user_info.feature_access['app_publish'],
                delete: user_info.feature_access['app_publish'],
                list: true,
                extra: [
                    {
                        title: "Deploy",
                        icon_color: "#220047",
                        customIcon: "fas fa-rocket",
                        extra_key: "deploy",
                        function_call: true
                    },
                    {
                        title: "App",
                        icon_color: "#220047",
                        customIcon: "fas fa-chart-line",
                        extra_key: "app",
                        function_call: true
                    }
                ]
            }
        };

        return (
            <div>
                <BreadcrumbsItem to={getRoute(breadcrumb_main_path + "/app-configs")}>
                    <span className={classes.breadcrumbItemIconContainer}>
                        <Icon className={classes.breadcrumbIcon}>apps</Icon>
                        {'Application Configurations'}
                    </span>
                </BreadcrumbsItem>
                { this.state.deploying ? (
                    // <OrangeLinearProgress className={classes.breadcrumbIcon}/>
                    <AppDeploy
                        app_config={this.state.deploying_item_data}
                        overwrite={this.state.deploy_overwrite}
                        parent_obj={this}
                        deploying_notebook_id={this.state.deploying_notebook_id}
                        deploying_item_id={this.state.deploying_item_id}
                    />
                ) : (
                    ''
                )}
                {this.state.deploySuccessfulDialog ? (
                    <SweetAlert
                        success
                        customClass={classes.higherAlert}
                        title="Deployed!"
                        onConfirm={() => this.hideDeploySuccessfulDialog()}
                        onCancel={() => this.hideDeploySuccessfulDialog()}
                        confirmBtnCssClass={classes.button + " " + classes.codxDark}
                    >
                        Your application configuration has been deployed.
                    </SweetAlert>
                ) : (
                    <Switch>
                        <Route path={getRoute(main_route_path + "/app-configs")} component={() =>
                            <CodexCRUD resource={this} params={app_config_params} />
                        } />
                    </Switch>
                )}
                {this.state.deployDialog ? (
                    <SweetAlert
                        warning
                        customClass={classes.higherAlert}
                        title="Overwrite application?"
                        showConfirm={false}
                        onConfirm={() => { return false; }}
                        onCancel={() => this.hideDeployDialog()}
                    >
                        <span>This will overwrite the previous deployed application.</span>
                        <br />
                        <br />
                        <br />
                        <br />
                        <Button className={classes.button + " " + classes.info} onClick={() => this.deployApp(false)}>No, create new app.</Button>
                        <Button className={classes.button + " " + classes.codxDark} onClick={() => this.deployApp(true)}>Yes, overwrite it.</Button>
                        <br />
                        <Button className={classes.button + " " + classes.danger} onClick={this.hideDeployDialog}>Cancel</Button>
                    </SweetAlert>
                ) : (
                    ''
                )}
            </div>
        );
    }
}

export default withStyles({
    ...breadcrumbStyle,
    ...buttonStyle,
    ...sweetAlertStyle
})(AppConfigs);
