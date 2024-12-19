import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper
} from '@material-ui/core';

const SavedScenarioAppWidgetTable = ({ classes, params, isRevampedTableSim }) => {
    const { table_headers, table_data } = params;

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page
    };

    // Slice table_data for pagination
    const paginatedData = table_data.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // Calculate row spans for the paginated data
    const getRowSpanData = (data) => {
        const rowSpans = [];
        let lastHeader = null;
        let span = 0;

        for (let i = 0; i < data.length; i++) {
            const currentHeader = data[i][0];

            if (currentHeader !== lastHeader) {
                if (span > 0) {
                    rowSpans.push({ start: i - span, span });
                }
                span = 1;
                lastHeader = currentHeader;
            } else {
                span++;
            }
        }
        if (span > 0) {
            rowSpans.push({ start: data.length - span, span });
        }

        return rowSpans;
    };

    const rowSpans = getRowSpanData(paginatedData);

    return (
        <Paper>
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {table_headers.map((header, headerIndex) => (
                                <TableCell key={headerIndex} className={classes.tableHeaderCell}>
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row, rowIndex) => {
                            const spanData = rowSpans.find((rs) => rs.start === rowIndex);

                            return (
                                <TableRow key={rowIndex} className={classes.tableRow}>
                                    {row.map((cell, cellIndex) => {
                                        if (cellIndex === 0) {
                                            if (spanData) {
                                                return (
                                                    <TableCell
                                                        key={cellIndex}
                                                        className={classes.tableCell}
                                                        rowSpan={spanData.span}
                                                    >
                                                        {cell}
                                                    </TableCell>
                                                );
                                            } else {
                                                return null;
                                            }
                                        } else {
                                        const diffCol = table_headers[cellIndex]
                                        const span = (diffCol.startsWith('Difference') && isRevampedTableSim) ? 2 : 1
                                        return (
                                                <TableCell
                                                    key={cellIndex}
                                                    className={`${classes.tableCell} ${(diffCol.startsWith('Difference') && isRevampedTableSim) ? classes.differenceCell : ''}`}
                                                    rowSpan={span}
                                                >
                                                    {cell}
                                                </TableCell>
                                            );
                                        }
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={table_data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                className={classes.paginationWrapper}
            />
        </Paper>
    );
};

SavedScenarioAppWidgetTable.propTypes = {
    classes: PropTypes.object.isRequired,
    params: PropTypes.shape({
        table_headers: PropTypes.arrayOf(PropTypes.string).isRequired,
        table_data: PropTypes.arrayOf(PropTypes.array).isRequired
    }).isRequired
};

export default withStyles(
    (theme) => ({
        tableContainer: {
            maxHeight: 'calc(100% - ' + theme.spacing(2) + ')',
            position: 'relative',
            borderColor: theme.palette.separator.tableContent,
            boxShadow: 'none',
            lineHeight: theme.layoutSpacing(21),
            letterSpacing: theme.layoutSpacing(0.5)
        },
        table: {
            color: theme.palette.text.default,
            textAlign: 'left',
            fontSize: theme.layoutSpacing(14),
            lineHeight: theme.layoutSpacing(21),
            letterSpacing: theme.layoutSpacing(0.5),
            padding: theme.layoutSpacing(16),
            '&:hover': {
                backgroundColor: theme.palette.background.tableHover
            }
        },
        tableHeaderCell: {
            backgroundColor: theme.palette.background.tableHeader,
            color: theme.palette.text.default,
            fontSize: theme.layoutSpacing(16),
            fontFamily: theme.typography.fonts.secondaryFont,
            cursor: 'pointer',
            textAlign: 'left',
            padding: theme.layoutSpacing(16),
            lineHeight: theme.layoutSpacing(21),
            letterSpacing: theme.layoutSpacing(0.5)
        },
        tableCell: {
            padding: theme.layoutSpacing(16),
            textAlign: 'left',
            borderBottom: '1px solid #EDEBF0',
            color: theme.palette.text.default,
            fontSize: theme.layoutSpacing(12)
        },
        differenceCell: {
            textAlign: 'center'
        },
        tablePagination: {
            color: theme.palette.text.default,
            fontSize: '1.5rem',
            '& .MuiTablePagination-toolbar': {
                '& .MuiTablePagination-caption': {
                    fontSize: '1.5rem'
                },
                '& .MuiTablePagination-selectRoot': {
                    margin: '0rem 1rem 0rem 0rem',
                    '& .MuiSelect-icon': {
                        color: 'inherit',
                        top: 'auto'
                    }
                },
                '& .MuiTablePagination-actions': {
                    marginLeft: 0
                }
            },
            '&.MuiTableCell-root': {
                borderBottom: 'none'
            }
        },
        paginationWrapper: {
            '& .MuiToolbar-root': {
                color: theme.palette.primary.contrastText,
                fontSize: theme.spacing(1.7)
            },
            '& .MuiTablePagination-caption': {
                color: theme.palette.primary.contrastText,
                fontSize: theme.spacing(1.7)
            },
            '& .MuiTablePagination-selectIcon': {
                color: theme.palette.primary.contrastText,
                fontSize: theme.spacing(1.7)
            }
        },
    }),
    { useTheme: true }
)(SavedScenarioAppWidgetTable);
