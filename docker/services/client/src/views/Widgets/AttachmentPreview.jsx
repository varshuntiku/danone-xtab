import React from "react";
import PropTypes from "prop-types";

import Icon from "@material-ui/core/Icon";
import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

import ArtifactTypes from "views/Blueprints/ArtifactTypes.js";

import CodexDataProvider, { CODEX_API_ACTION } from "views/CRUD/CodexDataProvider.jsx";

let _ = require("underscore");

class AttachmentPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      tiny_url: false,
      attachment_id: false
    };
  }

  componentWillMount() {
    const { file_data } = this.props;

    if (file_data.data) {
      this.saveAttachment();
    } else if(file_data.tiny_url) {
      this.setState({
        loading: false,
        tiny_url: file_data.tiny_url,
        attachment_id: file_data.attachment_id
      });
    }
  }

  saveAttachment() {
    const { file_data, widget_id } = this.props;

    this.setState({
      loading: true
    });

    var resource_url = "widgets/save-artifact";
    var url_action = widget_id;
    var url_request_data = file_data;

    CodexDataProvider(
      CODEX_API_ACTION,
      {
        resource: resource_url,
        action: url_action,
        callback: "onResponseSaveAttachment",
        request_data: url_request_data
      },
      this,
      false
    );
  }

  onResponseSaveAttachment = (crud, response_data) => {
    const { parent_obj } = this.props;

    this.setState({
      loading: false,
      tiny_url: response_data['data']['tiny_url'],
      attachment_id: response_data['data']['attachment_id']
    });

    parent_obj.onResponseSaveArtifacts();
  }

  getFileType = () => {
    const { file_data } = this.props;

    return (
      <div style={{ float: 'left', padding: '5px 0 0 15px' }}>
        {
          _.find(ArtifactTypes, function(artifact_type) {
            return file_data.header.startsWith(artifact_type.compare_type) || file_data.header.startsWith(artifact_type.compare_type.replace('data:', ''));
          }).type
        }
      </div>
    );
  }

  onClickExpandFile = () => {
    const { file_data } = this.props;

    if (this.state.tiny_url) {
      if (file_data.header.startsWith('data:image') || file_data.header.startsWith('image')) {
        window.open(this.state.tiny_url, '_new');
      } else if (file_data.header.startsWith('data:text') || file_data.header.startsWith('text') || file_data.header.startsWith('data:application/pdf') || file_data.header.startsWith('application/pdf')) {
        window.open(this.state.tiny_url, '_new');
      } else {
        var office_view_url = "https://view.officeapps.live.com/op/view.aspx?src=" + encodeURIComponent(this.state.tiny_url);
        window.open(office_view_url, '_new');
      }
    }
  }

  onClickDeleteFile = () => {
    const { parent_obj } = this.props;

    parent_obj.onClickDeleteFile(this.state.attachment_id);
  }

  render() {
    const { file_data, readonly } = this.props;

    return (
      <div style={{ position: 'relative', width: '100%' }}>
        {this.getFileType()}
        <br clear="all"/>
        {this.state.loading ? (
          <div style={{ width: '150px', height: '150px', padding: '50px 0', border: '1px solid #eee' }}>
            <OrangeLinearProgress is_preview_loader={true} />
          </div>
        ) : (
          this.state.tiny_url ? (
            <div>
              <div>
                <a href={this.state.tiny_url} download={'Downloaded attachment'}><Icon color="primary" style={{ cursor: 'pointer', position: 'absolute', top: '2px', right: '53px'}}>get_app</Icon></a>
                <Icon color="primary" style={{ cursor: 'pointer', position: 'absolute', top: '2px', right: '26px'}} onClick={() => this.onClickExpandFile()}>zoom_out_map</Icon>
                {readonly ? (
                  ''
                ) : (
                  <Icon color="primary" style={{ cursor: 'pointer', position: 'absolute', top: '2px', right: '2px'}} onClick={() => this.onClickDeleteFile()}>cancel</Icon>
                )}
              </div>
              {file_data.header.startsWith('data:image') || file_data.header.startsWith('image') ? (
                <img alt="result" style={{ width: '150px', height: '150px' }}  src={this.state.tiny_url} />
              ) : (
                file_data.header.startsWith('data:text') || file_data.header.startsWith('text') || file_data.header.startsWith('data:application/pdf') || file_data.header.startsWith('application/pdf') ? (
                  <iframe title="Attachment preview" style={{ width: '150px', height: '150px' }} src={this.state.tiny_url} />
                ) : (
                  <iframe title="Attachment preview" style={{ width: '150px', height: '150px' }} src={"https://view.officeapps.live.com/op/view.aspx?src=" + encodeURIComponent(this.state.tiny_url)} />
                )
              )}
              <div style={{ width: '150px' }} >
                {file_data.name ? file_data.name : "--"}
              </div>
            </div>
          ) : (
            <div style={{ width: '150px', height: '150px', padding: '60px 0', border: '1px solid #eee' }}>
              <Icon color="primary">warning</Icon><br/>
              <span>Preview not available.</span>
            </div>
          )
        )}
      </div>
    );
  }
}

AttachmentPreview.propTypes = {
  parent_obj: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  file_data: PropTypes.object.isRequired,
  widget_id: PropTypes.number.isRequired
};

export default AttachmentPreview;