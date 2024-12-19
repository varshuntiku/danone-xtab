import React from "react";
import PropTypes from "prop-types";
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { getRoute } from "utils.js";

import CodeIcon from "@material-ui/icons/Code";
import AttachFileIcon from "@material-ui/icons/AttachFile";

import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import AddAlert from "@material-ui/icons/AddAlert";
import CustomTabs from "components/CustomTabs/CustomTabs.jsx";
import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";

import WidgetCodeVersion from "views/Widgets/WidgetCodeVersion.jsx";
import Attachments from "views/Widgets/Attachments.jsx";

import CodexDataProvider, { CODEX_API_GET, CODEX_API_ACTION } from "views/CRUD/CodexDataProvider.jsx";

import MonacoEditor from 'react-monaco-editor';

class WidgetDetails extends React.Component {
  constructor(props) {
    super(props);

    var widget_id = false;
    if (props.match.params.widget_id) {
      widget_id = props.match.params.widget_id;
    }

    this.state = {
      loading: false,
      item_id: widget_id,
      widget_name: false,
      contributor_code: '',
      show_saved_notification: false
    };
  }

  componentWillMount() {
    this.getWidgetDetails();
  }

  getWidgetDetails = () => {
    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_GET,
      {
        resource: "widgets",
        action: this.state.item_id,
        callback: "onResponseGetDetails"
      },
      this,
      false
    );
  }

  onResponseGetDetails = (crud, response_data) => {
    var widget_details = response_data['data'];
    this.setState({
      loading: false,
      widget_name: widget_details['name']
    });

    this.getContributorCode();
  }

  getContributorCode() {
    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_GET,
      {
        resource: "widgets/get-contributor-code",
        action: this.state.item_id,
        callback: "onResponseGetContributorCode"
      },
      this,
      false
    );
  }

  onResponseGetContributorCode = (crud, response_data) => {
    this.setState({
      loading: false,
      contributor_code: response_data['data']['data']
    });
  }

  onChangeContributorCode = (code_text) => {
    this.setState({
      contributor_code: code_text
    });
  }

  saveCode = () => {
    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_ACTION,
      {
        resource: "widgets/save-contributor-code",
        action: this.state.item_id,
        callback: "onResponseSaveCode",
        request_data: {
          code_text: this.state.contributor_code
        }
      },
      this,
      false
    );
  }

  onResponseSaveCode = (crud, response_data) => {
    this.setState({
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

    this.setState({
        loading: false
    });
  }

  render() {
    const { classes } = this.props;

    const contributor_code = this.state.contributor_code;
    const options = {
      selectOnLineNumbers: true
    };

    return (
      <div>
        <BreadcrumbsItem to={getRoute("widgets/" + this.state.item_id + "/settings")}>
          <span className={classes.breadcrumbItemIconContainer}>
            <Icon className={classes.breadcrumbIcon}>settings</Icon>
            {this.state.widget_name}
          </span>
        </BreadcrumbsItem>
        <CustomTabs
          headerColor="codxDark"
          tabs={[
            {
              tabName: "Contributor",
              tabIcon: CodeIcon,
              tabContent: this.state.loading ? (
                  <OrangeLinearProgress />
                ) : (
                  <div>
                    <div className={classes.floatLeft}>
                      <h3 style={{ marginTop: '0px' }}>Contributor Code</h3>
                    </div>
                    <Button
                      color="primary"
                      onClick={this.saveCode}
                      style={{ textAlign: 'left' }}
                    >
                      <Icon>save</Icon><span style={{ paddingLeft: '2px' }}>Save</span>
                    </Button>
                    <br clear="all"/>
                    <div style={{ margin: '0 10px 10px 10px', width: '100%', height: '450px', border: '2px solid #eeeeee', borderRadius: '5px' }}>
                      <MonacoEditor
                        width="100%"
                        height="100%"
                        language="javascript"
                        theme="vs"
                        value={contributor_code}
                        options={options}
                        onChange={this.onChangeContributorCode}
                      />
                      <br clear="all" />
                    </div>
                    <br clear="all" />
                    <Snackbar
                      place="bc"
                      color="primary"
                      icon={AddAlert}
                      message={"Contributor code saved successfully !"}
                      open={this.state.show_saved_notification}
                      closeNotification={() =>
                          this.setState({ show_saved_notification: false })
                      }
                      close
                    />
                  </div>
                )
            },
            {
              tabName: "Test",
              tabIcon: CodeIcon,
              tabContent: <WidgetCodeVersion widget_id={this.state.item_id} type={"TEST"} />
            },
            {
              tabName: "Prod",
              tabIcon: CodeIcon,
              tabContent: <WidgetCodeVersion widget_id={this.state.item_id} type={"PROD"} />
            },
            {
              tabName: "Attachments",
              tabIcon: AttachFileIcon,
              tabContent: <Attachments parent_obj={this} classes={classes} widget_id={this.state.item_id} />
            }
          ]}
        />
      </div>
    );
  }
}

WidgetDetails.propTypes = {
  classes: PropTypes.object.isRequired
};

export default WidgetDetails;