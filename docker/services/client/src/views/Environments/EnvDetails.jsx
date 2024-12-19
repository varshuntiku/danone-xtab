import React from "react";
import PropTypes from "prop-types";
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { getRoute } from "utils.js";

import Icon from "@material-ui/core/Icon";
import DatabaseIcon from "components/CustomIcons/Database.jsx";
import GlobeIcon from "components/CustomIcons/Globe.jsx";
import CogIcon from "components/CustomIcons/Cog.jsx";
import StreamIcon from "components/CustomIcons/Stream.jsx";
// import Button from "@material-ui/core/Button";
// import AddAlert from "@material-ui/icons/AddAlert";
import CustomTabs from "components/CustomTabs/CustomTabs.jsx";
// import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";
// import Snackbar from "components/Snackbar/Snackbar.jsx";

import CodexDataProvider, { CODEX_API_GET } from "views/CRUD/CodexDataProvider.jsx";

class EnvDetails extends React.Component {
  constructor(props) {
    super(props);

    var environment_id = false;
    if (props.match.params.environment_id) {
      environment_id = props.match.params.environment_id;
    }

    this.state = {
      loading: false,
      item_id: environment_id,
      widget_name: false,
      contributor_code: '',
      show_saved_notification: false
    };
  }

  componentWillMount() {
    this.getEnvDetails();
  }

  getEnvDetails = () => {
    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_GET,
      {
        resource: "environments",
        action: this.state.item_id,
        callback: "onResponseGetDetails"
      },
      this,
      false
    );
  }

  onResponseGetDetails = (crud, response_data) => {
    var env_details = response_data['data'];
    this.setState({
      loading: false,
      env_name: env_details['name']
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <BreadcrumbsItem to={getRoute("environments/" + this.state.item_id + "/settings")}>
          <span className={classes.breadcrumbItemIconContainer}>
            <Icon className={classes.breadcrumbIcon}>settings</Icon>
            {this.state.env_name}
          </span>
        </BreadcrumbsItem>
        <CustomTabs
          headerColor="codxDark"
          tabs={[
            {
              tabName: "Database",
              tabIcon: DatabaseIcon,
              tabContent: ''
            },
            {
              tabName: "API",
              tabIcon: CogIcon,
              tabContent: ''
            },
            {
              tabName: "Frontend",
              tabIcon: GlobeIcon,
              tabContent: ''
            },
            {
              tabName: "Pipelines",
              tabIcon: StreamIcon,
              tabContent: ''
            }
          ]}
        />
      </div>
    );
  }
}

EnvDetails.propTypes = {
  classes: PropTypes.object.isRequired
};

export default EnvDetails;