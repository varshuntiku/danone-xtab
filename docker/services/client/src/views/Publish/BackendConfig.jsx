import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import { green } from '@material-ui/core/colors';
// import Select from "@material-ui/core/Select";
// import MenuItem from "@material-ui/core/MenuItem";
// import InputLabel from "@material-ui/core/InputLabel";
// import CustomInput from "components/CustomInput/CustomInput.jsx";
// import InputAdornment from "@material-ui/core/InputAdornment";
// import FormControl from "@material-ui/core/FormControl";
// import Button from "@material-ui/core/Button";
import ReactTable from "react-table";

import Icon from "@material-ui/core/Icon";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// import ExpandLessIcon from "@material-ui/icons/ExpandLess";
// import WebIcon from "@material-ui/icons/Web";
// import VisibilityIcon from "@material-ui/icons/Visibility";
// import DeleteIcon from "@material-ui/icons/Delete";
// import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

// core components
// import GridContainer from "components/Grid/GridContainer.jsx";
// import GridItem from "components/Grid/GridItem.jsx";

// import LayoutSelector from "views/Publish/LayoutSelector.jsx";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";
import applicationPublishStyle from "assets/jss/applicationPublishStyle.jsx";

import CodexDataProvider, { CODEX_API_GET } from "views/CRUD/CodexDataProvider.jsx";

let _ = require("underscore");

class BackendConfig extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;

    // console.log(props.params.item_data);

    this.state = {
      loading: false,
      results_data: false,
      pipelines: []
    };
  }

  componentWillMount() {
    const { params } = this.props;

    this.setState({
      loading: true
    });

    CodexDataProvider(
      CODEX_API_GET,
      {
        resource: "project-notebooks/get-pipeline-options",
        action: params.notebook_id,
        callback: "onResponseGetoptions"
      },
      this,
      false
    );
  }
  onResponseGetoptions(crud, response_data) {
    this.setState({
      loading: false,
      pipelines: response_data['data']['pipelines']
    });
  }

  sendState() {
    return {};
  }

  render() {
    // const { classes } = this.props;
    return this.state.loading ? (
      ''
      ) : (
        <ReactTable
          data={_.map(this.state.pipelines, function(value, index) {
            return {
              name: index,
              steps: value['count'],
              schedule: <Icon style={{ 'cursor': 'pointer'}} color="primary">access_time</Icon>,
              trigger: <Icon style={{ 'cursor': 'pointer'}} color="primary">keyboard_return</Icon>,
              status: <div><Icon style={{ 'cursor': 'pointer', color: green[500] }}>done_all</Icon><div>{" - 17th Oct"}</div></div>,
              api: <Icon style={{ 'cursor': 'pointer'}} color="primary">import_export</Icon>
            }
          })}
          sortable={false}
          columns={[
            { Header: 'Name', accessor: 'name' },
            { Header: '# of Steps', accessor: 'steps' },
            { Header: 'Schedule', accessor: 'schedule' },
            { Header: 'Trigger', accessor: 'trigger' },
            { Header: 'Status', accessor: 'status' },
            { Header: 'API', accessor: 'api' },
          ]}
          className="-striped -highlight"
          minRows={0}
          showPaginationBottom={false}
        />
    );
  }
}

export default withStyles({
  ...applicationPublishStyle,
  ...customSelectStyle
})(BackendConfig);
