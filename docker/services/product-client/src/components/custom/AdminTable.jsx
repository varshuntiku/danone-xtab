import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import appAdminTableStyle from 'assets/jss/appAdminTableStyle.jsx';
// import { Typography, Grid } from "@material-ui/core";

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
// import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import RefreshIcon from '@material-ui/icons/Refresh';
import DeleteIcon from '@material-ui/icons/Delete';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import { Paper, Button, IconButton } from '@material-ui/core';

import StyledTableRow from 'components/custom/StyledTableRow.jsx';
import StyledTableCell from 'components/custom/StyledTableCell.jsx';
import CustomSnackbar from '../CustomSnackbar';
import { getMatomoPvid } from 'store/index';
import { connect } from 'react-redux';
import { logMatomoEvent } from '../../services/matomo';

import * as _ from 'underscore';
import { SearchOutlined } from '@material-ui/icons';

class AdminTable extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            rowsPerPage: 10,
            page: 0,
            items_list: false,
            items: false,
            snackbar: {
                open: false
            }
        };
    }

    fetchData = () => {
        const { table_params } = this.props;

        if (table_params?.data?.api) {
            table_params.data.params.callback = this.onResponseGetData;
            table_params.data.api(table_params.data.params);
        }
    };

    handleUpdateResponse = (message, severity = 'success') => {
        this.setState((prevState) => ({
            snackbar: {
                ...prevState.snackbar,
                open: true,
                message: message,
                severity: severity
            }
        }));
    };

    componentDidMount() {
        // this.props.getMatomoPvid('adminTable')
        this.fetchData();

        logMatomoEvent({
            action_name: 'AdminTable',
            url: window.location.href,
            urlref: window.location.href,
            pv_id: this.props.matomo.pv_id
        });
    }

    refreshData = () => {
        this.setState({
            items: false,
            search_value: ''
        });
        this.fetchData();
    };

    onResponseGetData = (response_data) => {
        const { table_params } = this.props;

        if (table_params?.data?.response_fn) {
            response_data = table_params?.data?.response_fn(response_data);
        }

        this.setState({
            items: response_data,
            items_list: response_data
        });
    };

    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage
        });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0
        });
    };

    onHandleFieldChange = (field_id, field_value) => {
        var search_value = this.state.search_value ? this.state.search_value : '';
        var table_data = this.state.items_list;

        if (field_id === 'search_value') {
            search_value = field_value;
        }
        if (search_value) {
            if (this.props.searchFn) {
                table_data = this.state?.items_list.filter((row) =>
                    this.props.searchFn(row, search_value)
                );
            } else {
                table_data = this.state?.items_list.filter((row) =>
                    row.name.toLowerCase().includes(search_value.toLowerCase())
                );
            }
        }
        this.setState({
            search_value: search_value,
            items: table_data,
            page: 0
        });
    };

    handleClickDelete = async (row) => {
        const { table_params } = this.props;

        if (this.props.deleteHandler) {
            this.props.deleteHandler(row);
            return;
        }

        if (table_params?.data?.delete_api) {
            try {
                var params = {
                    id: row.id,
                    callback: this.onResponseDeleteItem
                };
                await table_params.data.delete_api(params);
                this.handleUpdateResponse('Deleted Successfully');
            } catch (error) {
                this.handleUpdateResponse(error.response?.data?.error || error.message, 'error');
            }
        }
    };

    onResponseDeleteItem = () => {
        this.refreshData();
    };

    renderTableHeaders = () => {
        const { table_params } = this.props;
        return (
            <TableHead>
                <TableRow>
                    {_.map(table_params.columns, function (column) {
                        return <StyledTableCell>{column.header.toUpperCase()}</StyledTableCell>;
                    })}
                    <StyledTableCell></StyledTableCell>
                </TableRow>
            </TableHead>
        );
    };

    render() {
        const { classes, table_params } = this.props;
        return (
            <div className={classes.main}>
                {table_params.add_action ? table_params.add_action(this.refreshData) : ''}
                <Button
                    className={`${classes.resetBtn} ${classes.outlinedBtnStyle}`}
                    onClick={() => {
                        this.refreshData();
                    }}
                    aria-label="Reset"
                    variant="outlined"
                    size="large"
                    startIcon={<RefreshIcon />}
                >
                    Refresh
                </Button>
                {table_params.search && this.state.items ? (
                    <div className={classes.inputConatiner}>
                        <input
                            className={classes.input}
                            value={this.state.search_value}
                            placeholder="Search"
                            onChange={(e) =>
                                this.onHandleFieldChange('search_value', e.target.value)
                            }
                        />
                        <SearchOutlined className={classes.searchIcon} />
                    </div>
                ) : (
                    ''
                )}
                <TableContainer component={Paper}>
                    <Table>
                        {this.renderTableHeaders()}
                        {this.state.items && (
                            <TableBody>
                                {this.state.items
                                    .slice(
                                        this.state.page * this.state.rowsPerPage,
                                        this.state.page * this.state.rowsPerPage +
                                            this.state.rowsPerPage
                                    )
                                    .map((row, row_index) => (
                                        <StyledTableRow key={'row_' + row_index}>
                                            {_.map(table_params.columns, function (column) {
                                                if (column.key) {
                                                    if (column.type === 'Boolean') {
                                                        if (row[column.key]) {
                                                            return (
                                                                <StyledTableCell>
                                                                    <CheckCircleIcon
                                                                        fontSize="large"
                                                                        className={
                                                                            classes.booleanCheckIcon
                                                                        }
                                                                    />
                                                                </StyledTableCell>
                                                            );
                                                        } else {
                                                            return (
                                                                <StyledTableCell>
                                                                    <CancelIcon
                                                                        fontSize="large"
                                                                        className={
                                                                            classes.booleanClearIcon
                                                                        }
                                                                    />
                                                                </StyledTableCell>
                                                            );
                                                        }
                                                    } else {
                                                        return (
                                                            <StyledTableCell>
                                                                {row[column.key]}
                                                            </StyledTableCell>
                                                        );
                                                    }
                                                } else if (column.key_fn) {
                                                    if (column.type === 'Boolean') {
                                                        if (column.key_fn(row)) {
                                                            return (
                                                                <StyledTableCell>
                                                                    <CheckCircleIcon
                                                                        fontSize="large"
                                                                        className={
                                                                            classes.booleanCheckIcon
                                                                        }
                                                                    />
                                                                </StyledTableCell>
                                                            );
                                                        } else {
                                                            return (
                                                                <StyledTableCell>
                                                                    <CancelIcon
                                                                        fontSize="large"
                                                                        className={
                                                                            classes.booleanClearIcon
                                                                        }
                                                                    />
                                                                </StyledTableCell>
                                                            );
                                                        }
                                                    } else {
                                                        return (
                                                            <StyledTableCell>
                                                                {column.key_fn(row)}
                                                            </StyledTableCell>
                                                        );
                                                    }
                                                } else {
                                                    return <StyledTableCell>-</StyledTableCell>;
                                                }
                                            })}
                                            <StyledTableCell>
                                                {table_params.other_actions
                                                    ? _.map(
                                                          table_params.other_actions,
                                                          function (other_action) {
                                                              return other_action(
                                                                  row,
                                                                  this.refreshData
                                                              );
                                                          },
                                                          this
                                                      )
                                                    : ''}
                                                {table_params.edit_action
                                                    ? table_params.edit_action(
                                                          row,
                                                          this.refreshData
                                                      )
                                                    : ''}
                                                {table_params.data.delete_api ? (
                                                    <IconButton
                                                        aria-label="delete"
                                                        onClick={() => this.handleClickDelete(row)}
                                                    >
                                                        <DeleteIcon
                                                            fontSize="large"
                                                            className={classes.deleteIcon}
                                                        />
                                                    </IconButton>
                                                ) : (
                                                    ''
                                                )}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
                {table_params.pagination ? (
                    <TablePagination
                        className={classes.paginationWrapper}
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={this.state.items.length ? this.state.items.length : 1}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onPageChange={this.handleChangePage}
                        onRowsPerPageChange={this.handleChangeRowsPerPage}
                    />
                ) : (
                    ''
                )}

                <CustomSnackbar
                    key={4}
                    open={this.state.snackbar.open}
                    message={this.state.snackbar.message}
                    autoHideDuration={2000}
                    onClose={() => {
                        this.setState({
                            snackbar: {
                                open: false
                            }
                        });
                    }}
                    severity={this.state.snackbar.severity}
                />
            </div>
        );
    }
}

AdminTable.propTypes = {
    classes: PropTypes.object.isRequired,
    x: PropTypes.object.isRequired,
    config: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.bool.isRequired]),
    deleteHandler: PropTypes.func,
    searchFn: PropTypes.func
};

// export default withStyles(
//   theme => ({
//     ...customFormStyle(theme),
//     ...appAdminTableStyle(theme)
//   }),
//   { withTheme: true }
// )(AdminTable);

const mapStateToProps = (state) => {
    return {
        matomo: state.matomo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getMatomoPvid: (pageType) => dispatch(getMatomoPvid(pageType))
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
    withStyles(
        (theme) => ({
            ...customFormStyle(theme),
            ...appAdminTableStyle(theme)
        }),
        { withTheme: true }
    )(AdminTable)
);
