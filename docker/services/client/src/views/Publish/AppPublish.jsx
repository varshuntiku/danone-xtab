import React from "react";
import PropTypes from "prop-types";
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { getRoute } from "utils.js";

import withStyles from "@material-ui/core/styles/withStyles";
import breadcrumbStyle from "assets/jss/breadcrumbStyle.jsx";

import Wizard from "components/Wizard/Wizard.jsx";
import Icon from "@material-ui/core/Icon";
import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

import BasicInformation from "views/Publish/BasicInformation.jsx";
import Modules from "views/Publish/Modules.jsx";
import ScreenConfig from "views/Publish/ScreenConfig.jsx";
import BackendConfig from "views/Publish/BackendConfig.jsx";
import NavigatorConfig from "views/Publish/NavigatorConfig.jsx";

import CodexDataProvider, { CODEX_GET_ONE, CODEX_UPDATE, CODEX_CREATE } from "views/CRUD/CodexDataProvider.jsx";

class AppPublish extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;

    var notebook_id = false;
    if (props.match.params.notebook_id) {
      notebook_id = props.match.params.notebook_id;
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

    var item_id = false;
    if (props.match.params.item_id) {
      item_id = props.match.params.item_id;
    }

    this.state = {
      loading: false,
      notebook_id: notebook_id,
      project_id: project_id,
      parent_project_id: parent_project_id,
      item_id: item_id,
      item_data: false,
      currentStep: 0,
    };
  }

  componentWillMount() {
    const { params, crud } = this.props;

    if (this.state.item_id) {
      this.setState({
        loading: true
      });

      const get_one_params = {
        list: {
          url_slug: params.list.url_slug
        }
      };

      CodexDataProvider(CODEX_GET_ONE, get_one_params, this, crud);
    }
  }

  getDataResponse = (response_data) => {
    this.setState({
      loading: false,
      item_data: response_data['data']
    });
  }

  submitApplicationConfig = (response) => {
    const { params, crud } = this.props;

    const submit_params = {
      list: {
        url_slug: params.list.url_slug
      },
      request_data: {
        name: response.basic_info.appname,
        environment_id: response.basic_info.environment,
        contact_email: response.basic_info.email,
        config: {
          modules: response.modules,
          screens: response.screens.screens, //purposefully screens.screens
          theme: response.basic_info.theme,
          objective_group: response.objective_config.objective_group,
          objectives: response.objective_config.objectives,
          responsibilities: response.screens.responsibilities,
        }
      }
    };

    if (this.state.item_id) {
      CodexDataProvider(CODEX_UPDATE, submit_params, this, crud);
    } else {
      CodexDataProvider(CODEX_CREATE, submit_params, this, crud);
    }
  }

  render() {
    const { classes, type } = this.props;

    var main_path = "projects/" + this.state.project_id;
    if (this.state.parent_project_id) {
      main_path = "projects/" + this.state.parent_project_id + "/case-studies/" + this.state.project_id;
    }

    main_path += "/notebooks/" + this.state.notebook_id + "/app-configs"

    var steps = [{
      stepName: 'Setup basic information',
      stepId: 'basic_info',
      stepComponent: BasicInformation,
      params: {
        item_data: this.state.item_data
      }
    },
    {
      stepName: 'Select modules',
      stepId: 'modules',
      stepComponent: Modules,
      params: {
        notebook_id: this.state.notebook_id,
        item_id: this.state.item_id,
        item_data: this.state.item_data
      }
    },
    {
      stepName: 'Configure screens',
      stepId: 'screens',
      stepComponent: ScreenConfig,
      params: {
        notebook_id: this.state.notebook_id,
        item_id: this.state.item_id,
        item_data: this.state.item_data
      }
    },
    {
      stepName: 'Configure Objectives',
      stepId: 'objective_config',
      stepComponent: NavigatorConfig,
      params: {
        notebook_id: this.state.notebook_id,
        item_id: this.state.item_id,
        item_data: this.state.item_data
      }
    },
    {
      stepName: 'Behind the scenes',
      stepId: 'backend',
      stepComponent: BackendConfig,
      params: {
        notebook_id: this.state.notebook_id,
        item_id: this.state.item_id,
        item_data: this.state.item_data
      }
    }];

    return this.state.loading ? (
          <OrangeLinearProgress />
        ) : (
          <div>
            { type === 'edit' ? (
              <BreadcrumbsItem to={getRoute(main_path + "/" + this.state.item_id + "/edit")}>
                <span className={classes.breadcrumbItemIconContainer}>
                  <Icon className={classes.breadcrumbIcon}>create</Icon>
                  {this.state.item_data.name}
                </span>
              </BreadcrumbsItem>
            ) : (
              <BreadcrumbsItem to={getRoute(main_path + "/add")}>
                <span className={classes.breadcrumbItemIconContainer}>
                  <Icon className={classes.breadcrumbIcon}>add</Icon>
                  {'Create'}
                </span>
              </BreadcrumbsItem>
            )}
            { (type === 'edit' && this.state.item_data) || type === 'add' ? (
              <Wizard
                title={""}
                subtitle={""}
                color="codxDark"
                steps={steps}
                validate={true}
                finishButtonClick={e => this.submitApplicationConfig(e)}
              />
            ) : (
              ''
            )}
          </div>
        );
  }
}

AppPublish.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles({
  ...breadcrumbStyle,
})(AppPublish);