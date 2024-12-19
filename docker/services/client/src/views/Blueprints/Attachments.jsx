import React from 'react';
import PropTypes from "prop-types";

import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";
import ArtifactTypes from "views/Blueprints/ArtifactTypes.js";
import AttachmentPreview from "views/Blueprints/AttachmentPreview.jsx";

import CodexDataProvider, { CODEX_API_ACTION, CODEX_API_DELETE } from "views/CRUD/CodexDataProvider.jsx";

let _ = require("underscore");

class Attachments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      loading: false
    };
  }

  componentWillMount() {
    this.refreshData();
  }

  refreshData = () => {
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
    this.setState({
      files: response_data['data']['data'],
      loading: false
    });
  }

  handleFileChange = ({ target }) => {
    if (target.files && target.files[0]) {
      const fileReader = new FileReader();
      const name = 'files';

      fileReader.readAsDataURL(target.files[0]);
      fileReader.onload = (e) => {
        var file_data_items = e.target.result.split(";");
        var file_data = {
          header: file_data_items[0],
          data: e.target.result,
          name: target.files[0]['name']
        };

        target.value = null;

        this.setState((prevState) => ({
          [name]: [...prevState[name], file_data]
        }));
      };
    }
  }

  onResponseSaveArtifacts = () => {
    const { parent_obj } = this.props;

    parent_obj.updateWidgetArtifacts();
  }

  getFilePreview = (file_data) => {
    const { classes, project_id, widget_id } = this.props;

    return <AttachmentPreview parent_obj={this} classes={classes} project_id={project_id} widget_id={widget_id} file_data={file_data} />
  }

  onClickDeleteFile = (attachment_id) => {
    var resource_url = "projects/delete-project-artifact";
    var url_action = attachment_id;

    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_DELETE,
      {
        resource: resource_url,
        action: url_action,
        callback: "onResponseDeleteAttachment"
      },
      this,
      false
    );
  }

  onResponseDeleteAttachment = (crud, response_data) => {
    this.setState({
      loading: false
    });

    this.refreshData();
    this.onResponseSaveArtifacts();;
  }

  render() {
    const { classes } = this.props;


    return (
      <div style={{ padding: '5px', position: 'relative' }}>
        <input
          accept={
            _.map(ArtifactTypes, function(artifact_type) {
              return artifact_type.mime_type;
            }).join(',')
          }
          className={classes.input}
          id="icon-button-photo"
          onChange={this.handleFileChange}
          type="file"
          style={{ float: 'left', padding: '15px', border: '1px solid #bbbbbb', borderRadius: '5px' }}
        />
        <br clear="all" />
        <br />
        <div>
          {_.map(this.state.files, function(file_data, file_index) {
            return (
              <div key={"project_widget_artifact_preview_" + file_index} style={{ float: 'left', marginRight: '5px', position: 'relative' }}>
                {this.getFilePreview(file_data)}
                <br />
              </div>
            );
          }, this)}
          <br clear="all"/>
        </div>
        {this.state.loading ? (
          <OrangeLinearProgress is_container={true} />
        ) : (
          ''
        )}
      </div>
    );
  }
}

Attachments.propTypes = {
  parent_obj: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  project_id: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired
  ])
};

export default Attachments;

