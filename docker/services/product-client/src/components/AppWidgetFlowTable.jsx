import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Grid /*, Menu, MenuItem, Button*/ } from '@material-ui/core';
import {
    Table,
    TableBody,
    TableCell,
    /*TableContainer, */ TableHead,
    TableRow,
    IconButton
} from '@material-ui/core';

import {
    Assignment,
    Refresh,
    Stop,
    VerifiedUser,
    /*ExpandMore, ExpandLess, */ ArrowLeft
} from '@material-ui/icons';

import appWidgetFlowTableStyle from 'assets/jss/appWidgetFlowTableStyle.jsx';

import * as _ from 'underscore';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontSize: '1.5rem'
    },
    body: {
        color: theme.palette.text.default,
        fontSize: '1.5rem'
    },
    root: {
        borderColor: theme.palette.text.default
    }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(even)': {
            backgroundColor: theme.palette.primary.main
        },
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.primary.light
        }
    }
}))(TableRow);
/**
 * It is a customized flow type table to represent data in tabular format
 * JSON Structure-
 * flow_table: {data: [{name: <table_name>, show_actions: <boolean>, show_status: <boolean>,…}], name: <table name>}
 *   data: [{name: <table_name>, show_actions: <boolean>, show_status: <boolean>,…}]
 *     <index>: {name: <table_name>, show_actions: false, show_status: false,…}
 *       name: <table_name>
 *       show_actions: <boolean>
 *       show_status: <boolean>
 *       table_data: [{cols: [row data], rowspan: <no of rows>}, {cols: [row data], rowspan: <no of rows>}]
 *         <index>: {cols: [row data], rowspan: <no of rows>}
 *           cols: [row data]
 *           <index>: row data
 *          rowspan: <no of rows>
 * @extends ParentClassNameHereIfAny
 */
class AppWidgetFlowTable extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            test_learn_menu_open: false,
            test_learn_menu_anchorEl: false,
            selected_options: []
        };
    }

    render() {
        const { classes, params } = this.props;

        return (
            <div className={classes.appWidgetFlowTableContainer}>
                <Typography className={classes.appWidgetFlowTableLabel} variant="h4">
                    {params.flow_table.name}
                </Typography>
                {params.flow_table.sub_title && params.flow_table.sub_title !== '' ? (
                    <Typography
                        className={
                            params.flow_table.sub_title_direction
                                ? params.flow_table.sub_title_direction === 'up'
                                    ? classes.appWidgetFlowTableSubLabelGreen
                                    : classes.appWidgetFlowTableSubLabelRed
                                : classes.appWidgetFlowTableSubLabel
                        }
                        variant="h4"
                    >
                        {params.flow_table.sub_title}
                    </Typography>
                ) : (
                    <Typography
                        className={
                            params.flow_table.sub_title_direction
                                ? params.flow_table.sub_title_direction === 'up'
                                    ? classes.appWidgetFlowTableSubLabelGreen
                                    : classes.appWidgetFlowTableSubLabelRed
                                : classes.appWidgetFlowTableSubLabel
                        }
                        variant="h4"
                    ></Typography>
                )}
                <Grid container spacing={2}>
                    {_.map(params.flow_table.data, function (data_item, data_item_index) {
                        return (
                            <Grid item xs className={classes.appWidgetFlowTableGridItem}>
                                <div className={classes.appWidgetFlowTableItemHeaderContainer}>
                                    <Typography
                                        className={classes.appWidgetFlowTableItemHeader}
                                        variant="h4"
                                    >
                                        {data_item.name}
                                    </Typography>
                                </div>
                                {data_item.incoming_text ? (
                                    <div
                                        className={classes.appWidgetFlowTableItemIncomingContainer}
                                    >
                                        <ArrowLeft
                                            fontSize="large"
                                            className={
                                                classes.appWidgetFlowTableItemIncomingLeftIcon1
                                            }
                                        />
                                        <ArrowLeft
                                            fontSize="large"
                                            className={
                                                classes.appWidgetFlowTableItemIncomingLeftIcon2
                                            }
                                        />
                                        <ArrowLeft
                                            fontSize="large"
                                            className={
                                                classes.appWidgetFlowTableItemIncomingRightIcon1
                                            }
                                        />
                                        <ArrowLeft
                                            fontSize="large"
                                            className={
                                                classes.appWidgetFlowTableItemIncomingRightIcon2
                                            }
                                        />
                                        <Typography variant="h5">
                                            {data_item.incoming_text}
                                        </Typography>
                                    </div>
                                ) : (
                                    ''
                                )}
                                <Table className={classes.appWidgetFlowTableItemTable}>
                                    {data_item.table_headers ? (
                                        <TableHead>
                                            <TableRow className={classes.appWidgetFlowTableHead}>
                                                {_.map(
                                                    data_item.table_headers,
                                                    function (table_header, table_header_index) {
                                                        if (table_header_index === 0) {
                                                            return (
                                                                <StyledTableCell
                                                                    key={
                                                                        'table_header_' +
                                                                        data_item_index +
                                                                        '_' +
                                                                        table_header_index
                                                                    }
                                                                >
                                                                    {table_header}
                                                                </StyledTableCell>
                                                            );
                                                        } else {
                                                            return (
                                                                <StyledTableCell
                                                                    key={
                                                                        'table_header_' +
                                                                        data_item_index +
                                                                        '_' +
                                                                        table_header_index
                                                                    }
                                                                    align="right"
                                                                >
                                                                    {table_header}
                                                                </StyledTableCell>
                                                            );
                                                        }
                                                    }
                                                )}
                                            </TableRow>
                                        </TableHead>
                                    ) : (
                                        ''
                                    )}
                                    <TableBody>
                                        {_.map(
                                            data_item.table_data,
                                            function (table_data_item, row_index) {
                                                return (
                                                    <StyledTableRow
                                                        key={'row_' + row_index}
                                                        style={{
                                                            height:
                                                                table_data_item.rowspan * 8 + 'rem'
                                                        }}
                                                    >
                                                        {_.map(
                                                            table_data_item.cols,
                                                            function (cell_item, cell_index) {
                                                                if (cell_index === 0) {
                                                                    return (
                                                                        <StyledTableCell
                                                                            key={
                                                                                'table_cell_' +
                                                                                row_index +
                                                                                '_' +
                                                                                cell_index
                                                                            }
                                                                            className={
                                                                                table_data_item.alerts &&
                                                                                table_data_item
                                                                                    .alerts.length >
                                                                                    0 &&
                                                                                table_data_item
                                                                                    .alerts[
                                                                                    cell_index
                                                                                ]
                                                                                    ? table_data_item
                                                                                          .alerts[
                                                                                          cell_index
                                                                                      ] === 'red'
                                                                                        ? classes.appWidgetFlowTablecellValueRed
                                                                                        : classes.appWidgetFlowTablecellValueYellow
                                                                                    : classes.appWidgetFlowTablecellValue
                                                                            }
                                                                            component="th"
                                                                            scope="row"
                                                                        >
                                                                            {cell_item}
                                                                        </StyledTableCell>
                                                                    );
                                                                } else {
                                                                    return (
                                                                        <StyledTableCell
                                                                            key={
                                                                                'table_cell_' +
                                                                                row_index +
                                                                                '_' +
                                                                                cell_index
                                                                            }
                                                                            className={
                                                                                table_data_item.alerts &&
                                                                                table_data_item
                                                                                    .alerts.length >
                                                                                    0 &&
                                                                                table_data_item
                                                                                    .alerts[
                                                                                    cell_index
                                                                                ]
                                                                                    ? table_data_item
                                                                                          .alerts[
                                                                                          cell_index
                                                                                      ] === 'red'
                                                                                        ? classes.appWidgetFlowTablecellValueRed
                                                                                        : classes.appWidgetFlowTablecellValueYellow
                                                                                    : classes.appWidgetFlowTablecellValue
                                                                            }
                                                                            align="right"
                                                                        >
                                                                            {cell_item}
                                                                        </StyledTableCell>
                                                                    );
                                                                }
                                                            }
                                                        )}
                                                        {data_item.show_actions ? (
                                                            <StyledTableCell
                                                                key={
                                                                    'table_cell_' +
                                                                    row_index +
                                                                    '_' +
                                                                    table_data_item.cols.length
                                                                }
                                                                className={
                                                                    classes.appWidgetFlowTablecellValue
                                                                }
                                                                align="right"
                                                            >
                                                                {table_data_item.test_link ? (
                                                                    <IconButton
                                                                        aria-label="Validations"
                                                                        onClick={() =>
                                                                            window.open(
                                                                                table_data_item.test_link,
                                                                                '_blank'
                                                                            )
                                                                        }
                                                                    >
                                                                        <VerifiedUser
                                                                            size="large"
                                                                            className={
                                                                                classes.appWidgetFlowTableIcon
                                                                            }
                                                                        />
                                                                    </IconButton>
                                                                ) : (
                                                                    ''
                                                                )}
                                                                {table_data_item.log_link ? (
                                                                    <IconButton
                                                                        aria-label="Logs"
                                                                        onClick={() =>
                                                                            window.open(
                                                                                table_data_item.test_link,
                                                                                '_blank'
                                                                            )
                                                                        }
                                                                    >
                                                                        <Assignment
                                                                            size="large"
                                                                            className={
                                                                                classes.appWidgetFlowTableIcon
                                                                            }
                                                                        />
                                                                    </IconButton>
                                                                ) : (
                                                                    ''
                                                                )}
                                                                {table_data_item.status &&
                                                                table_data_item.status ===
                                                                    'IN-PROGRESS' ? (
                                                                    <IconButton aria-label="Stop">
                                                                        <Stop
                                                                            size="large"
                                                                            className={
                                                                                classes.appWidgetFlowTableIconRed
                                                                            }
                                                                        />
                                                                    </IconButton>
                                                                ) : table_data_item.trigger_link ? (
                                                                    <IconButton
                                                                        aria-label="Trigger"
                                                                        onClick={() =>
                                                                            window.open(
                                                                                table_data_item.trigger_link,
                                                                                '_blank'
                                                                            )
                                                                        }
                                                                    >
                                                                        <Refresh
                                                                            size="large"
                                                                            className={
                                                                                classes.appWidgetFlowTableIcon
                                                                            }
                                                                        />
                                                                    </IconButton>
                                                                ) : (
                                                                    <IconButton aria-label="Trigger">
                                                                        <Refresh
                                                                            size="large"
                                                                            className={
                                                                                classes.appWidgetFlowTableIcon
                                                                            }
                                                                        />
                                                                    </IconButton>
                                                                )}
                                                            </StyledTableCell>
                                                        ) : (
                                                            ''
                                                        )}
                                                        {data_item.show_status ? (
                                                            <StyledTableCell
                                                                key={
                                                                    'table_cell_' +
                                                                    row_index +
                                                                    '_' +
                                                                    (table_data_item.cols.length +
                                                                        1)
                                                                }
                                                                className={
                                                                    table_data_item.status ===
                                                                    'FAILURE'
                                                                        ? classes.appWidgetFlowTablecellValueRed
                                                                        : table_data_item.status ===
                                                                          'IN-PROGRESS'
                                                                        ? classes.appWidgetFlowTablecellValueYellow
                                                                        : table_data_item.status ===
                                                                          'SUCCESS'
                                                                        ? classes.appWidgetFlowTablecellValueGreen
                                                                        : classes.appWidgetFlowTablecellValue
                                                                }
                                                                align="right"
                                                            ></StyledTableCell>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </StyledTableRow>
                                                );
                                            }
                                        )}
                                    </TableBody>
                                </Table>
                            </Grid>
                        );
                    })}
                </Grid>
                <br />
                {params.flow_table.callouts && params.flow_table.callouts.length > 0 ? (
                    <div className={classes.appWidgetFlowTableCalloutContainer}>
                        <Grid container spacing={2}>
                            {_.map(params.flow_table.callouts, function (callout_item) {
                                return (
                                    <Grid item xs>
                                        <Typography
                                            className={classes.appWidgetFlowTableCalloutText}
                                            variant="h4"
                                        >
                                            {callout_item.label} : {callout_item.value}
                                        </Typography>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </div>
                ) : (
                    ''
                )}
            </div>
        );
    }
}

AppWidgetFlowTable.propTypes = {
    classes: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    parent_obj: PropTypes.object.isRequired
};

export default withStyles((theme) => appWidgetFlowTableStyle(theme), { useTheme: true })(
    AppWidgetFlowTable
);
