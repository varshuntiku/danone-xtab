import React from 'react';
import PropTypes from "prop-types";

import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

import CodexDataProvider, { CODEX_API_ACTION } from "views/CRUD/CodexDataProvider.jsx";

import nl2br from "react-newline-to-break";

let _ = require("underscore");

class ProjectComments extends React.Component {
  constructor(props) {
    super(props);

    this.user_info = JSON.parse(sessionStorage.getItem('user_info'));

    this.state = {
      comments: [],
      comment_text: '',
      loading: false
    };
  }

  refreshComments = () => {
    const { project_id, widget_id } = this.props;

    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_ACTION,
      {
        resource: "projects/get-comments",
        action: project_id,
        callback: "onResponseGetComments",
        request_data: {
          widget_id: widget_id
        }
      },
      this,
      false
    );
  }

  componentWillMount() {
    this.refreshComments();
  }

  onResponseGetComments = (crud, response_data) => {
    const { parent_obj } = this.props;

    this.setState({
      comments: response_data['data']['data'],
      loading: false
    });

    parent_obj.updateSelectedItemCommentCount(response_data['data']['data'].length);
  }

  addComment = () => {
    const { project_id, widget_id } = this.props;

    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_ACTION,
      {
        resource: "projects/add-comment",
        action: project_id,
        callback: "onResponseAddComment",
        request_data: {
          comment_text: this.state.comment_text,
          widget_id: widget_id
        }
      },
      this,
      false
    );
  }

  onResponseAddComment = (crud, response_data) => {
    this.refreshComments();
    this.setState({
      comment_text: ''
    });
  }

  onClickDeleteComment = (comment_id) => {
    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_ACTION,
      {
        resource: "projects/delete-comment",
        action: comment_id,
        callback: "onResponseDeleteComment",
        request_data: {}
      },
      this,
      false
    );
  }

  onResponseDeleteComment = (crud, response_data) => {
    this.refreshComments();
  }

  change = (event) => {
    this.setState({
      comment_text: event.target.value
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div style={{ padding: '15px', position: 'relative' }}>
        {this.state.loading ? <OrangeLinearProgress /> : ''}
        <CustomInput
          key={'comment_text'}
          labelText={'Add Comment'}
          id={'comment_text'}
          formControlProps={{
            fullWidth: true
          }}
          inputProps={{
            onChange: event => this.change(event),
            type: "text",
            value: this.state['comment_text'],
            multiline: true,
            rows: 2
          }}
        />
        { this.state.comment_text === '' ? (
          ''
        ) : (
          <Button
            color="primary"
            onClick={this.addComment}
            className={classes.floatRight}
          >
            <Icon>comment</Icon><span style={{ paddingLeft: '2px' }}>Add Comment</span>
          </Button>
        )}
        <Button
          color="primary"
          onClick={this.refreshComments}
          className={classes.floatRight}
        >
          <Icon>refresh</Icon><span style={{ paddingLeft: '2px' }}>Refresh comments</span>
        </Button>
        <br clear="all"/>
        <br/>
        <div className={classes.scrollableContent}>
          <div>
            {_.map(this.state.comments, function(comment_data) {
              return (
                <div key={'comment_container_' + comment_data.id} style={{ borderRadius: '5px', border: '1px solid #eeeeee', marginBottom: '5px' }}>
                  <div style={{ padding: '5px', backgroundColor: '#eeeeee' }}>
                    <div className={classes.floatLeft}>
                      <Icon color="primary" fontSize="small">comment</Icon>
                    </div>
                    <div className={classes.floatLeft}>
                      {comment_data.created_by_user}
                    </div>
                    <div className={classes.floatRight}>
                      {comment_data.created_at}
                    </div>
                    <br clear="all" />
                  </div>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <div style={{ float: 'left', padding: '5px 25px 0 5px' }}>{nl2br(comment_data.comment_text)}</div>
                    <br clear="all"/>
                    {comment_data.created_by === this.user_info.user_id ? (
                      <Icon color="secondary" fontSize="small" style={{ cursor: 'pointer', position: 'absolute', top: '2px', right: '2px'}} onClick={() => this.onClickDeleteComment(comment_data.id)}>delete</Icon>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              );
            }, this)}
            <br clear="all"/>
          </div>
        </div>
      </div>
    );
  }
}

ProjectComments.propTypes = {
  parent_obj: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  project_id: PropTypes.number.isRequired
};

export default ProjectComments;

