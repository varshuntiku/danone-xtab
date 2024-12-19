import React from 'react';
import PropTypes from "prop-types";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Input from "@material-ui/core/Input";

import Icon from "@material-ui/core/Icon";

let _ = require("underscore");

class WidgetInfoTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      table_data: props.params && props.params.data ? props.params.data : []
    };
  }

  onClickAddRow = () => {
    const { params } = this.props;

    var table_data = this.state.table_data;

    var table_row = _.map(params.cols, function(col) {
      return '';
    });

    table_data.push(table_row);

    this.setState({
      table_data: table_data
    });
  }

  onEditWidgetInfoTableCell = (row_index, cell_index, str_value) => {
    var table_data = this.state.table_data;

    table_data[row_index][cell_index] = str_value;

    this.setState({
      table_data: table_data
    });
  }

  render() {
    const { params } = this.props;

    return (
      <div style={{ maxHeight: '400px', overflow: 'auto' }}>
        <Table style={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              { _.map(params.cols, function(col) {
                return <TableCell>{col}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            { _.map(this.state.table_data, function(data_item, row_index) {
              return (
                <TableRow>
                  { _.map(data_item, function(date_item_cell, cell_index) {
                    return (
                      <TableCell>
                        <Input
                          style={{ padding: '0px', margin: '0px', fontSize: '12px' }}
                          key={'widget_info_table_cell_input_' + row_index + '_' + cell_index}
                          id={'widget_info_table_cell_input_' + row_index + '_' + cell_index}
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            onChange: event => this.onEditWidgetInfoTableCell(row_index, cell_index, event.target.value),
                            type: 'text',
                            value: date_item_cell
                          }}
                          // helpText={field["help_text"]}
                        />
                      </TableCell>
                    );
                  }, this)}
                </TableRow>
              )
            }, this)}
            <TableRow style={{ '&hover': { opacity: '0.5' }, cursor: 'pointer' }} onClick={() => this.onClickAddRow()}>
              <Icon style={{ paddingTop: '4px' }}>add</Icon> Add New Row
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }
}

WidgetInfoTable.propTypes = {
  parent_obj: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired
};

export default WidgetInfoTable;