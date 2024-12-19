import React from "react";
import PropTypes from "prop-types";

import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import Tooltip from '@material-ui/core/Tooltip';
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import { CardActionArea, CardContent } from '@material-ui/core';

import CodexDataProvider, { CODEX_API_ACTION } from "views/CRUD/CodexDataProvider.jsx";

import nl2br from "react-newline-to-break";

let _ = require("underscore");

class WidgetComponents extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      widget_id: props.widget_id,
      loading: false,
      code_metadata: false,
      code_demo: false,
      repo: false,
      path: false
    };
  }

  refreshMetadata = () => {
    const { widget_id } = this.props;

    if (widget_id && widget_id !== '') {
      this.setState({
        loading: true
      });

      CodexDataProvider(
        CODEX_API_ACTION,
        {
          resource: "projects",
          action: "get-widget-components",
          callback: "onResponseGetComponents",
          request_data: {
            widget_id: widget_id
          }
        },
        this,
        false
      );
    }
  }

  componentWillMount() {
    this.refreshMetadata();
  }

  componentDidUpdate() {
    const { widget_id } = this.props;

    if (widget_id !== this.state.widget_id) {
      this.setState({
        widget_id: widget_id
      });

      this.refreshMetadata();
    }
  }

  onResponseGetComponents(crud, response_data) {
    this.setState({
      code_metadata: response_data['data']['metadata'],
      code_demo: response_data['data']['code_demo'],
      repo: response_data['data']['code_details']['repo'],
      path: response_data['data']['code_details']['path']
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
    return this.state.code_metadata ? (
        <div>
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
                <GridItem key={"grid-item-" + metadata_item['name']} xs={6} style={{ marginBottom: '10px' }}>
                  <Tooltip
                    id="tooltip-top"
                    title={nl2br(metadata_item.doc_string)}
                    placement="top"
                    // classes={{ tooltip: classes.tooltip }}
                  >
                    <Card style={{ margin: 0, height: "100%" }}>
                      <CardActionArea style={{ height: '100%' }}>
                        <CardContent style={{ height: '100%' }}>
                          <div style={{ float: 'left', width: '65%', fontSize: '10px', fontWeight: 'bold' }}>{metadata_item['name']}</div>
                          <div style={{ float: 'right', width: '25%' }}>
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
      </div>
    ) : '';
  }
}

WidgetComponents.propTypes = {
  widget_id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

export default WidgetComponents;