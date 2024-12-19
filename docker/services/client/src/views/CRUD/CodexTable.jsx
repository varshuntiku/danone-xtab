import React from "react";
import PropTypes from "prop-types";
import { getRoute } from "utils.js";

// react component for creating dynamic tables
import ReactTable from "react-table";

// react component used to create sweet alerts
import SweetAlert from "react-bootstrap-sweetalert";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Tooltip from '@material-ui/core/Tooltip';
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

import AddIcon from "@material-ui/icons/Add";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";

import CodexDataProvider from "views/CRUD/CodexDataProvider.jsx";
import { CODEX_GET_LIST, CODEX_DELETE, CODEX_API_ACTION } from "views/CRUD/CodexDataProvider.jsx";

import nl2br from "react-newline-to-break";
import OrangeLinearProgress from "components/CustomLinearProgress/OrangeLinearProgress.jsx";

let _ = require("underscore");

class CodexTable extends React.Component {
  constructor(props) {
    super(props);

    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onLogsClick = this.onLogsClick.bind(this);
    this.onReportClick = this.onReportClick.bind(this);
    this.onArtifactsClick = this.onArtifactsClick.bind(this);
    this.getListResponse = this.getListResponse.bind(this);
    this.hideAlert = this.hideAlert.bind(this);

    this.state = {
      loading: false,
      data: [],
      selected_rowids: [],
      alert: null,
      select_all: false
    };
  }

  refreshList = () => {
    const { params, crud } = this.props;

    this.setState({
      loading: true
    });

    CodexDataProvider(CODEX_GET_LIST, params, this, crud);
  }

  componentDidMount() {
    const { params, crud } = this.props;

    if (!params.ajaxData) {
      this.setState({
        loading: true
      });

      if (params.auto_refresh_list) {
        this.interval = setInterval(() => this.refreshList(), 10000);
      }
      CodexDataProvider(CODEX_GET_LIST, params, this, crud);
    }
  }

  ajaxFetchList = (table_state) => {
    const { params, crud } = this.props;

    this.setState({
      loading: true,
      select_all: false,
      selected_rowids: false,
    });

    CodexDataProvider(
      CODEX_API_ACTION,
      {
        resource: params.list.url_resource,
        action: params.list.url_action,
        request_data: {
          'page': table_state['page'],
          'pageSize': table_state['pageSize'],
          'sorted': table_state['sorted'],
          'filtered': table_state['filtered']
        },
        callback: 'onAjaxFetchList'
      },
      this,
      crud
    );
  }

  onAjaxFetchList = (crud, response_data) => {
    this.getListResponse(response_data['data']);
    this.setState({
      page: response_data['data']['page'],
      pages: response_data['data']['pages']
    });
  }

  onReportClick(item_id, run_uuid, item_data, crud) {
    const { params } = this.props;

    crud.props.resource[params.actions.report_callback](item_id, run_uuid, item_data, crud);
  }

  onDataTableClick = (item_id, run_uuid, item_data, crud) => {
    const { params } = this.props;

    crud.props.resource[params.actions.data_table_callback](item_id, run_uuid, item_data, crud);
  }

  onArtifactsClick(item_id, run_uuid, item_data) {
    const { params, crud } = this.props;

    crud.props.resource[params.actions.artifacts_callback](item_id, run_uuid, item_data);
  }

  onLogsClick(logs) {
    const { classes } = this.props;

    this.setState({
      alert: (
        <SweetAlert
          success
          customClass={classes.higherAlert}
          title="Logs"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={classes.button + " " + classes.codxDark}
        >
          <div className={classes.scrollableContent}>
            {nl2br(logs)}
          </div>
        </SweetAlert>
      )
    });
  }

  onDeleteClick(item_id) {
    const { classes, params } = this.props;
    this.setState({
      alert: (
        <SweetAlert
          warning
          customClass={classes.higherAlert}
          title="Are you sure?"
          onConfirm={() => this.onConfirmDelete(item_id)}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={classes.button + " " + classes.codxDark}
          cancelBtnCssClass={classes.button + " " + classes.danger}
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
        >
          You will not be able to recover this {params.list.name_singular} !
        </SweetAlert>
      )
    });
  }

  onConfirmDelete = (item_id) => {
    const { params, crud } = this.props;
    params["item_id"] = item_id;
    CodexDataProvider(CODEX_DELETE, params, this, crud);
  }

  onConfirmMultiDelete = () => {
    const { params, crud } = this.props;

    CodexDataProvider(
      CODEX_API_ACTION,
      {
        resource: params.list.url_slug,
        action: 'delete-selected',
        callback: "onResponseMultiDelete",
        request_data: {
          selected_rowids: this.state.selected_rowids
        }
      },
      this,
      crud
    );
  }

  onResponseMultiDelete = (crud, response_data) => {
    crud.showDeleteNotification();
  }

  getListResponse(response) {
    const { params, crud, resource } = this.props;

    var main_path = "";
    if (params.link_prefix) {
      main_path += params.link_prefix + "/";
    }

    main_path += params.table_key;

    this.setState({
      loading: false,
      data: response.data.map((prop, key) => {
        const editbale = params.actions.edit instanceof Function? params.actions.edit(prop) : params.actions.edit
        const deleteable = params.actions.delete instanceof Function? params.actions.delete(prop) : params.actions.delete
        var data_item = {
          id: key,
          actions: (
            <div className="actions-right">
              {editbale ? (
                <Tooltip title="Edit">
                  <IconButton
                    aria-label="Edit"
                    data-testid={"edit_button_" + prop["id"]}
                    href={getRoute(main_path + "/" + prop["id"] + "/edit")}
                    className="actions-anchor"
                  >
                    <Icon className="action-icons">create</Icon>
                  </IconButton>
                </Tooltip>
              ) : (
                ""
              )}
              {params.actions.extra && params.actions.extra.length > 0
                ? params.actions.extra.map(function(extra_action) {
                  if (extra_action.hide instanceof Function) {
                    if (extra_action.hide(prop)) {
                      return null
                    }
                  } else if (extra_action.hide) {
                    return null
                  }
                    var icon_button_props = {
                      onClick: () => resource.extra_actions(
                        crud,
                        extra_action.extra_key,
                        prop["id"],
                        prop
                      )
                    };

                    if (!extra_action.function_call) {
                      icon_button_props = {
                        href: getRoute(main_path + "/" + prop["id"] + "/" + extra_action.extra_key)
                      };
                    }
                    return (
                      <Tooltip
                        key={"extra_action_" + extra_action.extra_key}
                        title={extra_action.title}
                      >
                        <IconButton
                          aria-label={extra_action.title}
                          data-testid={extra_action.extra_key + "_button_" + prop["id"]}
                          {...icon_button_props}
                          className="actions-anchor"
                        >
                          {extra_action.customIcon ? (
                            <i className={extra_action.customIcon} style={{ color: extra_action.icon_color}} />
                          ) : (
                            <Icon className="action-icons">
                              {extra_action.icon}
                            </Icon>
                          )}
                        </IconButton>
                      </Tooltip>
                    );
                  })
                : ""}
              {params.actions.report ? (
                <Tooltip title="Report">
                  <IconButton
                    aria-label="Report"
                    data-testid={"report_button_" + prop["id"]}
                    onClick={() =>
                      this.onReportClick(prop["id"], prop["mlflow_run_uuid"], prop, crud)
                    }
                    className="actions-anchor"
                  >
                    <Icon className="action-icons">bar_chart</Icon>
                  </IconButton>
                </Tooltip>
              ) : (
                ""
              )}
              {params.actions.data_table ? (
                <Tooltip title="Data Table">
                  <IconButton
                    aria-label="Data Table"
                    data-testid={"data_table_button_" + prop["id"]}
                    onClick={() =>
                      this.onDataTableClick(prop["id"], prop["mlflow_run_uuid"], prop, crud)
                    }
                    className="actions-anchor"
                  >
                    <Icon className="action-icons">table_chart</Icon>
                  </IconButton>
                </Tooltip>
              ) : (
                ""
              )}
              {params.actions.artifacts ? (
                <Tooltip title="Artifacts">
                  <IconButton
                    aria-label="Artifacts"
                    data-testid={"artifacts_button_" + prop["id"]}
                    onClick={() =>
                      this.onArtifactsClick(prop["id"], prop["mlflow_run_uuid"], prop)
                    }
                    className="actions-anchor"
                  >
                    <Icon className="action-icons">folder</Icon>
                  </IconButton>
                </Tooltip>
              ) : (
                ""
              )}
              {params.actions.logs ? (
                <Tooltip title="Logs">
                  <IconButton
                    aria-label="Logs"
                    data-testid={"logs_button_" + prop["id"]}
                    onClick={() => this.onLogsClick(prop["logs"])}
                    className="actions-anchor"
                  >
                    <Icon className="action-icons">notes</Icon>
                  </IconButton>
                </Tooltip>
              ) : (
                ""
              )}
              {deleteable ? (
                <Tooltip title="Delete">
                  <IconButton
                    aria-label="Delete"
                    data-testid={"delete_button_" + prop["id"]}
                    onClick={() => this.onDeleteClick(prop["id"])}
                    className="actions-anchor"
                  >
                    <Icon className="action-icons-delete">delete</Icon>
                  </IconButton>
                </Tooltip>
              ) : (
                ""
              )}
            </div>
          )
        };

        _.each(params.fields.list, function(field) {
          if (field["accessor"] !== "actions" && !field.hide_table) {
            if (field.type === "boolean") {
              if (prop[field["accessor"]]) {
                data_item[field["accessor"]] = field.labels["value_true"];
              } else {
                data_item[field["accessor"]] = field.labels["value_false"];
              }
            } else {
              if (field["multiple"] && prop[field["accessor"]] && prop[field["accessor"]] instanceof Array) {
                if (field["double_spacing"]) {
                  data_item[field["accessor"]] = nl2br(prop[field["accessor"]].join("\n\n"));
                } else {
                  data_item[field["accessor"]] = nl2br(prop[field["accessor"]].join("\n"));
                }
              } else {
                data_item[field["accessor"]] = prop[field["accessor"]];
              }
            }
          }
        });

        return data_item;
      })
    });

    if (params.show_delete_notification) {
      setTimeout(
        function() {
          this.parentObj.setState({ show_delete_notification: false });
        }.bind({ parentObj: this }),
        6000
      );
    }
  }

  hideAlert() {
    this.setState({
      alert: null
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onMultiDeleteClick = () => {
    const { classes } = this.props;

    this.setState({
      alert: (
        <SweetAlert
          warning
          customClass={classes.higherAlert}
          title="Are you sure?"
          onConfirm={() => this.onConfirmMultiDelete()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={classes.button + " " + classes.codxDark}
          cancelBtnCssClass={classes.button + " " + classes.danger}
          confirmBtnText="Yes, delete the selected rows!"
          cancelBtnText="Cancel"
          showCancel
        >
          You will not be able to recover the selected rows !
        </SweetAlert>
      )
    });
  }

  isSelected = (row_info) => {
    if ( _.indexOf(this.state.selected_rowids, row_info.row.id) !== -1) {
      return true;
    } else {
      return false;
    }
  }

  selectRow = (row_info) => {
    var selected_rowids = this.state.selected_rowids;

    if (_.indexOf(selected_rowids, row_info.row.id) === -1) {
      var final_selected_rowids = [row_info.row.id];
      if (selected_rowids.length > 0) {
        final_selected_rowids = [...selected_rowids, row_info.row.id];
      }

      if (this.state.data.length === final_selected_rowids.length) {
        this.setState({
          selected_rowids: final_selected_rowids,
          select_all: true
        });
      } else {
        this.setState({
          selected_rowids: final_selected_rowids,
          select_all: false
        });
      }
    }
  }

  deselectRow = (row_info) => {
    var selected_rowids = this.state.selected_rowids;
    var index_of_item = _.indexOf(selected_rowids, row_info.row.id);

    if (index_of_item !== -1) {
      selected_rowids.splice(index_of_item, 1)
      this.setState({
        selected_rowids: selected_rowids,
        select_all: false
      });
    }
  }

  deselectAll = () => {
    this.setState({
      selected_rowids: [],
      select_all: false
    });
  }

  selectAll = () => {
    this.setState({
      selected_rowids: _.map(this.state.data, function(data_item) {
        return data_item.id;
      }),
      select_all: true
    });
  }

  render() {
    const { classes, params } = this.props;
    var table_columns = _.filter(params.fields.list, function(field_list) {
      return !field_list.hide_table;
    });

    if (params.selectable) {
      table_columns.splice(0,0,
        {
          Header: this.state.select_all ? (
            <CheckBoxIcon  className={classes.tableCheckbox} onClick={() => this.deselectAll()}/>
          ) : (
            <CheckBoxOutlineBlankIcon  className={classes.tableCheckbox} onClick={() => this.selectAll()}/>
          ),
          accessor: "checkbox",
          sortable: false,
          filterable: false,
          Cell: row => this.isSelected(row) ? (
            <CheckBoxIcon  className={classes.tableCheckbox} onClick={() => this.deselectRow(row)}/>
          ) : (
            <CheckBoxOutlineBlankIcon  className={classes.tableCheckbox} onClick={() => this.selectRow(row)}/>
          )
        }
      );
    }

    var main_path = "";
    if (params.link_prefix) {
      main_path += params.link_prefix + "/";
    }

    main_path += params.table_key;

    return (
      <div>
        {this.state.alert}
        <GridContainer>
          <GridItem xs={12}>
            {params.actions.add ? (
              <Button className="action-icons" href={getRoute(main_path + "/add")}>
                <AddIcon className={classes.icons} />
                <span style={{ paddingLeft: '2px' }}>Create</span>
              </Button>
            ) : (
              ""
            )}
            {this.state.selected_rowids.length > 0 && params.actions.delete ? (
              <Button className="action-icons" onClick={() => this.onMultiDeleteClick()}>
                <Icon className={classes.icons} color="secondary">delete</Icon>
                <span style={{ paddingLeft: '2px' }}>Delete selected</span>
              </Button>
            ) : (
              ''
            )}
            <br clear="all" />
            <div>
              {params.ajaxData ? (
                <ReactTable
                  loading={this.state.loading}
                  loadingComponent={this.state.loading ? OrangeLinearProgress : 'div'}
                  data={this.state.data}
                  page={this.state.page}
                  pages={this.state.pages}
                  filterable
                  columns={table_columns}
                  // sorted={params.sorted}
                  defaultPageSize={10}
                  showPaginationTop
                  showPaginationBottom={false}
                  className="-striped -highlight"
                  onFetchData={params.ajaxData ? (state, instance) => {
                    this.ajaxFetchList(state);
                  } : false}
                  //Set the manual prop when enabling server-side data
                  manual

                  //Keep the component state in sync with the table's controlled props
                  onPageChange={pageIndex => {
                      this.setState({ page: pageIndex });
                  }}
                  onPageSizeChange={(pageSize, pageIndex) => {
                      this.setState({ page: pageIndex, pageSize: pageSize });
                  }}
                />
              ) : (
                <ReactTable
                  loading={this.state.loading}
                  loadingComponent={this.state.loading ? OrangeLinearProgress : 'div'}
                  data={this.state.data}
                  filterable
                  columns={table_columns}
                  sorted={params.sorted}
                  defaultPageSize={10}
                  showPaginationTop
                  showPaginationBottom={false}
                  className="-striped -highlight"
                />
              )}
            </div>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

CodexTable.propTypes = {
  classes: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  crud: PropTypes.object.isRequired
};

export default CodexTable;
