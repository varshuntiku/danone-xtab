import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import appAdminStyle from 'assets/jss/appAdminStyle.jsx';
import AppAdminOverview from 'components/Admin/Overview.jsx';
import AppAdminModules from 'components/Admin/Modules.jsx';
import AppAdminScreens from './Admin/AppAdminScreens';
import AppAdminPipelines from 'components/Admin/Pipelines.jsx';
import AppAdminBlueprint from 'components/Admin/Design.jsx';
import AppAdminIterations from 'components/Admin/Iterations.jsx';
import AppAdminNotebooks from 'components/Admin/Notebooks.jsx';
import AppAdminNotebookIterations from 'components/Admin/NotebookIterations.jsx';
import AppAdminCreateVersion from 'components/Admin/CreateVersion.jsx';

// import { getAdminDetails, getAdminDetailsFromId } from "services/admin.js";
const useStyles = makeStyles(appAdminStyle);

function AppAdmin({ parent_obj, ...props }) {
    const { app_info, logged_in_user_info, user_permissions } = props;
    const classes = useStyles();

    // TODO: The code below was removed in the MERGE and needs to be reviewed.
    // constructor(props) {
    //   super(props);

    //   this.state = {
    //     admin_details: false
    //   };
    // }

    // componentWillMount() {
    //   const { app_info } = this.props;

    //   if (app_info.config_link) {
    //     var config_link_details = app_info.config_link.split('/');
    //     getAdminDetailsFromId({
    //       app_id: config_link_details[config_link_details.length - 2],
    //       callback: this.onResponseAdminDetails
    //     });
    //   } else {
    //     getAdminDetails({
    //       deployed_app_id: app_info.id,
    //       callback: this.onResponseAdminDetails
    //     });
    //   }
    // }

    // onResponseAdminDetails = (response_data) => {

    //   this.setState({
    //     admin_details: response_data
    //   });
    // };

    return (
        <div className={classes.appAdminContainer}>
            <Switch>
                <Route
                    path="/app/:app_id/admin/overview"
                    render={(props) => (
                        <AppAdminOverview app_info={app_info} parent_obj={parent_obj} {...props} />
                    )}
                />
                <Route
                    path="/app/:app_id/admin/modules"
                    render={(props) => (
                        <AppAdminModules app_info={app_info} parent_obj={parent_obj} {...props} />
                    )}
                />
                <Route
                    path="/app/:app_id/admin/pipelines"
                    component={(props) => <AppAdminPipelines app_info={app_info} {...props} />}
                />
                <Route
                    exact
                    path="/app/:app_id/admin/screens/:screen_id"
                    render={(props) => (
                        <AppAdminScreens
                            app_info={app_info}
                            user_permissions={user_permissions}
                            parent_obj={parent_obj}
                            logged_in_user_info={logged_in_user_info}
                            setGPTinfo={props.setGPTinfo && this.props.setGPTinfo}
                            {...props}
                        />
                    )}
                />
                <Route
                    path="/app/:app_id/admin/screens"
                    render={(props) => (
                        <AppAdminScreens
                            app_info={app_info}
                            user_permissions={user_permissions}
                            parent_obj={parent_obj}
                            logged_in_user_info={logged_in_user_info}
                            setGPTinfo={props.setGPTinfo && this.props.setGPTinfo}
                            {...props}
                        />
                    )}
                />
                <Route
                    path="/app/:app_id/admin/Configure"
                    render={(props) => (
                        <AppAdminCreateVersion
                            app_info={app_info}
                            user_permissions={user_permissions}
                            parent_obj={parent_obj}
                            {...props}
                        />
                    )}
                />
                <Route
                    path="/app/:app_id/admin/blueprints"
                    component={(props) => <AppAdminBlueprint app_info={app_info} {...props} />}
                />
                <Route
                    path="/app/:app_id/admin/iterations"
                    component={(props) => <AppAdminIterations app_info={app_info} {...props} />}
                />
                <Route
                    path="/app/:app_id/admin/noteboooks/:notebook_id/iterations/:iteration_id/design"
                    component={(props) => (
                        <AppAdminBlueprint
                            app_info={app_info}
                            from_iteration={true}
                            from_notebook={false}
                            {...props}
                        />
                    )}
                />
                <Route
                    path="/app/:app_id/admin/noteboooks/:notebook_id/iterations"
                    component={(props) => (
                        <AppAdminNotebookIterations app_info={app_info} {...props} />
                    )}
                />
                <Route
                    path="/app/:app_id/admin/noteboooks/:notebook_id/design"
                    component={(props) => (
                        <AppAdminBlueprint
                            app_info={app_info}
                            from_iteration={false}
                            from_notebook={true}
                            {...props}
                        />
                    )}
                />
                <Route
                    path="/app/:app_id/admin/noteboooks"
                    component={(props) => <AppAdminNotebooks app_info={app_info} {...props} />}
                />
                <Route
                    path="/app/:app_id/admin/create-version/:env_key"
                    render={(props) => (
                        <AppAdminCreateVersion
                            app_info={app_info}
                            user_permissions={user_permissions}
                            parent_obj={parent_obj}
                            {...props}
                        />
                    )}
                />
                <Redirect to={'/app/' + app_info['id'] + '/admin/overview'} />
            </Switch>
        </div>
    );
}

export default AppAdmin;
