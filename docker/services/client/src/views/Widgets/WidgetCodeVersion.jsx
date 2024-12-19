import React from "react";
import PropTypes from "prop-types";

import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import Tooltip from '@material-ui/core/Tooltip';
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import { CardActionArea, CardContent } from '@material-ui/core';

import CodexDataProvider, { CODEX_API_GET, CODEX_API_ACTION } from "views/CRUD/CodexDataProvider.jsx";
import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import MonacoEditor from 'react-monaco-editor';

import nl2br from "react-newline-to-break";

let _ = require("underscore");

class WidgetCodeVersion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading_preview: false,
      loading_save: false,
      repo: '',
      branch: '',
      path: '',
      tag: '',
      preview_code: false,
      code_metadata: false,
      code_demo: false,
      show_saved_notification: false
    };
  }

  componentWillMount() {
    const { widget_id, type } = this.props;

    this.setState({
      loading_save: true
    });

    CodexDataProvider(
      CODEX_API_GET,
      {
        resource: "widgets/get-code-details/" + widget_id,
        action: type,
        callback: "onResponseGetDetails"
      },
      this,
      false
    );
  }

  onResponseGetDetails = (crud, response_data) => {
    response_data['data']['loading_save'] = false;
    response_data['data']['show_saved_notification'] = false;

    this.setState(response_data['data']);

    if (response_data['data']['repo'] && response_data['data']['path']) {
      this.previewCode();
    }
  }

  onChangeTextField = (event, code_version_field) => {
    var current_state = this.state;
    current_state[code_version_field] = event.target.value;

    this.setState(current_state);
  }

  renderTextField = (textbox_id, textbox_label) => {
    const { type } = this.props;

    return (
      <div>
        <CustomInput
          key={"widget_code_version_" + type + "_" + textbox_id}
          labelText={textbox_label}
          id={"widget_code_version_" + type + "_" + textbox_id}
          formControlProps={{
            fullWidth: true
          }}
          inputProps={{
            onChange: event => this.onChangeTextField(event, textbox_id),
            type: "text",
            value: this.state[textbox_id]
          }}
        />
        <br/>
      </div>
    );
  }

  saveDetails = () => {
    const { widget_id, type } = this.props;

    this.setState({
      loading_save: true
    });

    CodexDataProvider(
      CODEX_API_ACTION,
      {
        resource: "widgets/save-code-details/" + widget_id,
        action: type,
        callback: "onResponseSaveDetails",
        request_data: {
          repo: this.state.repo,
          branch: this.state.branch,
          path: this.state.path,
          tag: this.state.tag
        }
      },
      this,
      false
    );
  }

  onResponseSaveDetails = (crud, response_data) => {
    this.setState({
      loading_save: false,
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

  previewCode = () => {
    const { widget_id } = this.props;

    this.setState({
      loading_preview: true
    });

    CodexDataProvider(
      CODEX_API_ACTION,
      {
        resource: "widgets/preview-code",
        action: widget_id,
        callback: "onResponsePreviewCode",
        request_data: {
          repo: this.state.repo,
          branch: this.state.branch,
          path: this.state.path,
          tag: this.state.tag
        }
      },
      this,
      false
    );
  }

  onResponsePreviewCode = (crud, response_data) => {
    this.setState({
      loading_preview: false,
      preview_code: response_data['data']['code'],
      code_metadata: response_data['data']['metadata'],
      code_demo: response_data['data']['code_demo']
    });
  }

  codeDemo = () => {
    var demo_url = process.env["REACT_APP_JUPYTER_DEMO_URL"];
    demo_url += this.state.path
      .replace('codex_widget_factory/', '')
      .replace('.py', '.ipynb').replace('/', '_');

    if (process.env["REACT_APP_JUPYTER_DEMO_TOKEN"] !== '') {
      demo_url += '?token=' + process.env["REACT_APP_JUPYTER_DEMO_TOKEN"]
    }

    window.open(demo_url, '_new');
  }

  render() {
    const { type } = this.props;

    const preview_code = this.state.preview_code;
    const options = {
      selectOnLineNumbers: true
    };

    return (
      <div>
        <GridContainer spacing={8}>
          <GridItem xs={3}>
            <div style={{ float: 'left' }}>
              <h3 style={{ marginTop: '0px' }}>{type} code details</h3>
            </div>
            <Button
              color="primary"
              onClick={this.saveDetails}
              style={{ textAlign: 'left' }}
            >
              <Icon>save</Icon><span style={{ paddingLeft: '2px' }}>Save</span>
            </Button>
            {this.state.loading_save ? (
              <OrangeLinearProgress />
            ) : (
              ''
            )}
            <br clear="all"/>
            {this.renderTextField('repo', 'GIT repository')}
            {this.renderTextField('branch', 'GIT branch')}
            {this.renderTextField('path', 'File path')}
            {this.renderTextField('tag', 'Release tag (if any)')}
          </GridItem>
          <GridItem xs={3}>
            <div style={{ float: 'left' }}>
              <h3 style={{ marginTop: '0px', marginRight: '8px' }}>{type} code components</h3>
            </div>
            {this.state.code_demo ? (
              <Button
                color="primary"
                onClick={this.codeDemo}
                style={{ textAlign: 'left' }}
              >
                <Icon>ondemand_video</Icon><span style={{ paddingLeft: '2px' }}>Demo</span>
              </Button>
            ) : (
              ''
            )}
            <br clear="all"/>
            <GridContainer spacing={8}>
              {_.map(this.state.code_metadata, function(metadata_item) {
                return (
                  <GridItem xs={6} style={{ marginBottom: '10px' }}>
                    <Tooltip
                      id="tooltip-top"
                      title={nl2br(metadata_item.doc_string)}
                      placement="top"
                      // classes={{ tooltip: classes.tooltip }}
                    >
                      <Card style={{ margin: 0, height: "100%" }}>
                        <CardActionArea style={{ height: '100%' }}>
                          <CardContent style={{ height: '100%' }}>
                            <div style={{ float: 'left', fontSize: '12px', fontWeight: 'bold' }}>{metadata_item['name']}</div>
                            <div style={{ float: 'right' }}>
                              {metadata_item.return_type === 'MODEL' ? (
                                <Icon color="primary">build</Icon>
                              ) : metadata_item.return_type === 'VISUALS' ? (
                                <Icon color="primary">assessment</Icon>
                              ) : metadata_item.return_type === 'PREDICTIONS' ? (
                                <Icon color="primary">trending_up</Icon>
                              ) : metadata_item.return_type === 'METADATA' ? (
                                <Icon color="primary">dashboard</Icon>
                              ) : metadata_item.return_type === 'DATA' ? (
                                <Icon color="primary">list</Icon>
                              ) : (
                                ''
                              )}
                            </div>
                            <br clear="all"/>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Tooltip>
                  </GridItem>
                );
              })}
            </GridContainer>
            <br clear="all"/>
          </GridItem>
          <GridItem xs={6}>
            <div style={{ float: 'left' }}>
              <h3 style={{ marginTop: '0px', marginRight: '8px'  }}>{type} code preview</h3>
            </div>
            <Button
              color="primary"
              onClick={this.previewCode}
              style={{ textAlign: 'left' }}
            >
              <Icon>refresh</Icon><span style={{ paddingLeft: '2px' }}>Refresh</span>
            </Button>
            {this.state.loading_save ? (
              <OrangeLinearProgress />
            ) : (
              ''
            )}
            <br clear="all"/>
            {this.state.preview_code === false ? (
              'Please check the details, code not found.'
            ) : (
              <div style={{ height: '450px', border: '2px solid #eeeeee', borderRadius: '5px' }}>
                <MonacoEditor
                  width="100%"
                  height="100%"
                  language="python"
                  theme="vs"
                  value={preview_code}
                  options={options}
                />
              </div>
            )}
          </GridItem>
        </GridContainer>
        <Snackbar
          place="bc"
          color="primary"
          icon={AddAlert}
          message={type + " code saved successfully !"}
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

WidgetCodeVersion.propTypes = {
  widget_id: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired
};

export default WidgetCodeVersion;

