import React from 'react';
import PropTypes from "prop-types";

import Dialog from '@material-ui/core/Dialog';
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

import CodexDataProvider, { CODEX_API_ACTION } from "views/CRUD/CodexDataProvider.jsx";

class WidgetArtifactsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      loading: false,
      current_index: 0
    };
  }

  componentWillMount() {
    const { project_id, widget_id } = this.props;

    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_ACTION,
      {
        resource: "projects/get-project-artifacts",
        action: project_id,
        callback: "onResponseGetArtifacts",
        request_data: {
          widget_id: widget_id
        }
      },
      this,
      false
    );
  }

  onResponseGetArtifacts = (crud, response_data) => {
    // console.log(response_data['data']['data']);
    this.setState({
      loading: false,
      files: response_data['data']['data']
    });
  }

  previousArtifact = () => {
    var prev_index = this.state.current_index - 1;

    this.setState({
      current_index: prev_index
    });
  }

  nextArtifact = () => {
    var next_index = this.state.current_index + 1;

    this.setState({
      current_index: next_index
    });
  }

  closeDialog = () => {
    const { parent_obj } = this.props;

    parent_obj.closeResultsDialog();
  }

  getFileHtml = (file_data) => {
    // console.log(file_data);
    if (file_data.header.startsWith('data:image') || file_data.header.startsWith('image')) {
      return <img alt="result" style={{ width: '100%', height: '80%' }} src={file_data.tiny_url} />
    } else if (file_data.header.startsWith('data:text') || file_data.header.startsWith('text') || file_data.header.startsWith('data:application/pdf') || file_data.header.startsWith('application/pdf')) {
      return <iframe style={{ width: '100%', height: '80%', position: 'absolute' }} title="Attachment preview" src={file_data.tiny_url} />
    } else {
      return <iframe style={{ width: '100%', height: '80%', position: 'absolute' }} title="Attachment preview" src={"https://view.officeapps.live.com/op/view.aspx?src=" + encodeURIComponent(file_data.tiny_url)} />
    }
  }

  render() {
    return (
      <Dialog fullScreen open={true} onClose={this.closeResultsDialog}>
        {this.state.loading ? (
          <OrangeLinearProgress />
        ) : (
          <div>
            <Button
              color="primary"
              onClick={this.closeDialog}
              style={{ textAlign: 'left' }}
            >
              <Icon>keyboard_backspace</Icon><span style={{ paddingLeft: '2px' }}>Back to Design</span>
            </Button>
            {this.state.current_index === this.state.files.length - 1 ? (
              ''
            ) : (
              <div style={{ float: 'right' }}>
                <Button
                  color="primary"
                  onClick={this.nextArtifact}
                >
                  <Icon>chevron_right</Icon><span style={{ paddingLeft: '2px' }}>Next</span>
                </Button>
              </div>
            )}
            {this.state.current_index === 0 ? (
              ''
            ) : (
              <div style={{ float: 'right' }}>
                <Button
                  color="primary"
                  onClick={this.previousArtifact}
                >
                  <Icon>chevron_left</Icon><span style={{ paddingLeft: '2px' }}>Previous</span>
                </Button>
              </div>
            )}
            <br clear="all" />
            <div style={{ float: 'left'}}>
              {this.getFileHtml(this.state.files[this.state.current_index])}
            </div>
            <br clear="all" />
          </div>
        )}
      </Dialog>
    );
  }
}

WidgetArtifactsView.propTypes = {
  parent_obj: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  project_id: PropTypes.number.isRequired,
  widget_id: PropTypes.string.isRequired
};

export default WidgetArtifactsView;

