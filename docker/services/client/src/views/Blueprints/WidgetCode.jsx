import React from 'react';
import PropTypes from "prop-types";

import Dialog from '@material-ui/core/Dialog';
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import NavPills from "components/NavPills/NavPills.jsx";
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "components/Snackbar/Snackbar.jsx";

import CodexDataProvider, { CODEX_API_ACTION } from "views/CRUD/CodexDataProvider.jsx";
import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

import MonacoEditor from 'react-monaco-editor';

import SampleWidgetCode from 'views/Blueprints/SampleWidgetCode.js';

class WidgetCode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      selected_type: 'blueprint',
      code: '',
      base_code: '',
      show_saved_notification: false
    };
  }

  componentWillMount() {
    const { project_id, widget_id, base_widget_id } = this.props;

    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_ACTION,
      {
        resource: "projects/get-code",
        action: project_id,
        callback: "onResponseGetCode",
        request_data: {
          widget_id: widget_id,
          base_widget_id: base_widget_id
        }
      },
      this,
      false
    );
  }

  onResponseGetCode = (crud, response_data) => {
    this.setState({
      code: response_data['data']['data'],
      base_code: response_data['data']['base_data'],
      loading: false
    });
  }

  closeDialog = () => {
    const { parent_obj } = this.props;

    parent_obj.closeCodeDialog();
  }

  saveCode = () => {
    const { project_id, widget_id } = this.props;

    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_ACTION,
      {
        resource: "projects/save-code",
        action: project_id,
        callback: "onResponseSaveCode",
        request_data: {
          widget_id: widget_id,
          code_text: this.state.code
        }
      },
      this,
      false
    );
  }

  onChangeCode = (code_text) => {
    this.setState({
        code: code_text
    });
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

  onChangeType = (event) => {
    console.log(event);
  }

  render() {
    const code = this.state.code;
    const base_code = this.state.base_code;
    const editable_options = {
      selectOnLineNumbers: true
    };
    // const readonly_editable_options = {
    //   selectOnLineNumbers: true,
    //   readOnly: true
    // };

    return (
      <Dialog fullScreen open={true} onClose={this.closeResultsDialog}>
        <Button
          color="primary"
          onClick={this.closeDialog}
          style={{ textAlign: 'left' }}
        >
          <Icon>keyboard_backspace</Icon><span style={{ paddingLeft: '2px' }}>Back to Design</span>
        </Button>
        <Button
          color="primary"
          onClick={this.saveCode}
          style={{ textAlign: 'left' }}
        >
          <Icon>save</Icon><span style={{ paddingLeft: '2px' }}>Save code</span>
        </Button>
        <NavPills
          color="primary"
          horizontal={{
            tabsGrid: {
              xs: 2
            },
            contentGrid: {
              xs: 9
            }
          }}
          tabs={[
            {
              tabButton: "Widget Factory Code",
              tabContent: (
                <div style={{ margin: '0 10px 10px 10px', border: '2px solid #eeeeee', borderRadius: '5px', width: "100%", height: "600px" }}>
                  <MonacoEditor
                    key={'base_code_editor'}
                    width="100%"
                    height="100%"
                    language="python"
                    theme="vs"
                    value={base_code && base_code !== '' ? base_code : SampleWidgetCode.code}
                    options={editable_options}
                    onChange={this.onChangeCode}
                  />
                  <br clear="all" />
                </div>
              )
            },
            {
              tabButton: "Blueprint Code",
              tabContent: (
                <div style={{ margin: '0 10px 10px 10px', border: '2px solid #eeeeee', borderRadius: '5px', width: "100%", height: "600px" }}>
                  <MonacoEditor
                    key={'blueprint_code_editor'}
                    width="100%"
                    height="100%"
                    language="python"
                    theme="vs"
                    value={code && code !== '' ? code : SampleWidgetCode.code}
                    options={editable_options}
                    onChange={this.onChangeCode}
                  />
                  <br clear="all" />
                </div>
              )
            },

          ]}
        />
        <br clear="all" />
        {this.state.loading ? (
          <OrangeLinearProgress />
        ) : (
          ''
        )}
        <Snackbar
            place="bc"
            color="primary"
            icon={AddAlert}
            message={"Widget code saved successfully !"}
            open={this.state.show_saved_notification}
            closeNotification={() =>
                this.setState({ show_saved_notification: false })
            }
            close
        />
      </Dialog>
    );
  }
}

WidgetCode.propTypes = {
  parent_obj: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  project_id: PropTypes.number.isRequired,
  widget_id: PropTypes.string.isRequired
};

export default WidgetCode;


