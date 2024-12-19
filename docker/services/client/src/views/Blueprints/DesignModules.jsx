import React from 'react';
import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import SweetAlert from "react-bootstrap-sweetalert";
import Card from "components/Card/Card.jsx";
import { CardActionArea, CardContent } from '@material-ui/core';
import CustomInput from "components/CustomInput/CustomInput.jsx";

import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

import buttonStyle from "assets/jss/material-dashboard-pro-react/components/buttonStyle.jsx";
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";
import designModulesStyle from "assets/jss/designModulesStyle.jsx";

import CodexDataProvider, { CODEX_API_GET, CODEX_API_ACTION } from "views/CRUD/CodexDataProvider.jsx";

import nl2br from "react-newline-to-break";

class DesignModules extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      alert: false,
      loading: false,
      show_saved_notification: false,
      module_selected: false,
      metadata: false
    };
  }

  componentWillMount() {
    const { project_id } = this.props;

    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_GET,
      {
        resource: "projects/get-project-metadata",
        action: project_id,
        callback: "onResponseGetMetadata"
      },
      this,
      false
    );
  }

  onResponseGetMetadata = (crud, response_data) => {
    var metadata = response_data['data']['data'];

    this.setState({
      loading: false,
      metadata: metadata
    });
  }

  saveMetadata = () => {
    const { project_id } = this.props;

    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_ACTION,
      {
        resource: "projects/save-project-metadata",
        action: project_id,
        callback: "onResponseSaveMetadata",
        request_data: {
          metadata: this.state.metadata
        }
      },
      this,
      false
    );
  }

  onResponseSaveMetadata = (crud, response_data) => {
    if (response_data.data.status === 'success') {
      this.setState({
        loading: false,
        show_saved_notification: true
      });

      setTimeout(
        function() {
          this.parentObj.setState({
            show_saved_notification: false
          });
        }.bind({ parentObj: this }),
        6000
      );
    }
  }

  closeNodeDetails = () => {
    this.setState({
      module_selected: false
    });

    this.saveMetadata();
  }

  designModuleChangeDescription = (module_type, small_desc) => {
    var metadata = {};
    if (this.state.metadata) {
      metadata = this.state.metadata;
    }

    metadata[module_type] = small_desc;

    this.setState({
      metadata: metadata
    });

  }

  onClickModule = (module_type) => {
    const { hasEditAccess } = this.props;

    if (hasEditAccess) {
      this.setState({
        module_selected: module_type
      });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div style={{ position: 'relative' }}>
        {this.state.loading ? <OrangeLinearProgress /> : ''}
        <GridContainer spacing={8}>
          <GridItem xs={3}>
            <Card className={classes.designCard}>
              <CardActionArea style={{ height: '100%' }}>
                <CardContent style={{ height: '100%' }} onClick={() => this.onClickModule('business_opportunity')}>
                  <div className={classes.designWidgetHeader}>BUSINESS OPPORTUNITY</div>
                  <div className={classes.designWidgetBody}>{this.state.metadata && this.state.metadata['business_opportunity'] ? nl2br(this.state.metadata['business_opportunity']) : '--'}</div>
                </CardContent>
              </CardActionArea>
            </Card>
          </GridItem>
          <GridItem xs={3}>
            <Card className={classes.designCard}>
              <CardActionArea style={{ height: '100%' }}>
                <CardContent style={{ height: '100%' }} onClick={() => this.onClickModule('analytics_problem')}>
                  <div className={classes.designWidgetHeader}>ANALYTICS PROBLEM</div>
                  <div className={classes.designWidgetBody}>{this.state.metadata && this.state.metadata['analytics_problem'] ? nl2br(this.state.metadata['analytics_problem']) : '--'}</div>
                </CardContent>
              </CardActionArea>
            </Card>
          </GridItem>
          <GridItem xs={3}>
            <Card className={classes.designCard}>
              <CardActionArea style={{ height: '100%' }}>
                <CardContent style={{ height: '100%' }} onClick={() => this.onClickModule('analytics_outcome')}>
                  <div className={classes.designWidgetHeader}>ANALYTICS OUTCOME</div>
                  <div className={classes.designWidgetBody}>{this.state.metadata && this.state.metadata['analytics_outcome'] ? nl2br(this.state.metadata['analytics_outcome']) : '--'}</div>
                </CardContent>
              </CardActionArea>
            </Card>
          </GridItem>
          <GridItem xs={3}>
            <Card className={classes.designCard}>
              <CardActionArea style={{ height: '100%' }}>
                <CardContent style={{ height: '100%' }} onClick={() => this.onClickModule('business_outcome')}>
                  <div className={classes.designWidgetHeader}>BUSINESS OUTCOME</div>
                  <div className={classes.designWidgetBody}>{this.state.metadata && this.state.metadata['business_outcome'] ? nl2br(this.state.metadata['business_outcome']) : '--'}</div>
                </CardContent>
              </CardActionArea>
            </Card>
          </GridItem>
        </GridContainer>
        <br/>
        {this.state.module_selected ? (
          <SweetAlert
            customClass={classes.higherAlert}
            title={this.state.module_selected.replace('_', ' ').toUpperCase()}
            onConfirm={() => this.closeNodeDetails()}
            onCancel={() => this.closeNodeDetails()}
            confirmBtnCssClass={
              this.props.classes.button + " " + this.props.classes.success
            }
          >
            <CustomInput
              key={'design_' + this.state.module_selected}
              labelText={'Small Description *'}
              id={'design_' + this.state.module_selected}
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                onChange: event => this.designModuleChangeDescription(this.state.module_selected, event.target.value),
                type: 'text',
                value: this.state.metadata && this.state.metadata[this.state.module_selected] ? this.state.metadata[this.state.module_selected] : '',
                multiline: true,
                rows: 10
              }}
              // helpText={field["help_text"]}
            />
          </SweetAlert>
        ) : ''}
        <Snackbar
          place="bc"
          color="primary"
          icon={AddAlert}
          message={"Design metadata saved successfully !"}
          open={this.state.show_saved_notification}
          closeNotification={() =>
            this.setState({ show_saved_notification: false })
          }
          close
        />
      </div>
    );
  }
}

DesignModules.propTypes = {
  parent_obj: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  project_id: PropTypes.number.isRequired
}

export default withStyles({
  ...buttonStyle,
  ...sweetAlertStyle,
  ...designModulesStyle
})(DesignModules);