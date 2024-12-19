import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Paper, Link, Box, Button } from '@material-ui/core';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import StarOutlinedIcon from '@material-ui/icons/StarOutlined';
import appWidgetTableStyle from 'assets/jss/appWidgetTableStyle.jsx';

import GetAppIcon from '@material-ui/icons/GetApp';
import TagsRenderer from './gridTable/cell-renderer/tagsRenderer';
import { IconButton, Tooltip } from '@material-ui/core';
import { downloadFile } from 'common/utils';
import * as _ from 'underscore';
import { ReactComponent as GetApp } from 'assets/img/Download_Ic.svg';
import { ReactComponent as SortIcon } from '../assets/Icons/Sort.svg';
import { ReactComponent as SortupIcon } from '../assets/Icons/sort_up.svg';
import { ReactComponent as SortdownIcon } from '../assets/Icons/sort_down.svg';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.background.tableHeader,
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16),
        fontFamily: theme.typography.fonts.secondaryFont,
        lineHeight: theme.layoutSpacing(20),
        letterSpacing: theme.layoutSpacing(0.5),
        cursor: 'pointer',
        textAlign: 'left',
        padding: theme.layoutSpacing(12) + ' ' + theme.layoutSpacing(12)
    },
    body: {
        color: theme.palette.text.default,
        textAlign: 'left',
        fontSize: theme.layoutSpacing(14),
        lineHeight: theme.layoutSpacing(21),
        letterSpacing: theme.layoutSpacing(0.5),
        padding: theme.layoutSpacing(16)
    },
    root: {
        borderColor: theme.palette.separator.tableContent
    }
}))(TableCell);

const SortedTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.background.tableHeader,
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16),
        fontFamily: theme.typography.fonts.secondaryFont,
        lineHeight: theme.layoutSpacing(20),
        letterSpacing: theme.layoutSpacing(0.5),
        cursor: 'pointer'
    }
}))(TableCell);

const StyledTableRow = withStyles(() => ({
    root: {
        // backgroundColor: theme.palette.primary.light
    }
}))(TableRow);
/**
 * Renders a customized table with sort data and download table as CSV file functionality
 * It can be used wherever we want to show tabular data on screen with download function
 * JSON structure-
 * {
 *   table_headers: [<"Col1", "Col2">]
 *     "index": <Col1>
 *     "index": <Col2>
 *   widget_value_id: <widget id>
 *   table_data: [[list of row data]]
 *     "index": [row data]
 *     "index": [row data]
 * }
 * @extends ParentClassNameHereIfAny
 */
class AppWidgetTable extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            params: false,
            sort_by_params: [],
            headerWidths: [],
            headerRefs: [],
            rowHeights: [],
            frozenRows: new Set(),
            frozenColumns: new Set(),
            topFrozenRows: new Set(), // Stores indices of frozen rows in the top half
            bottomFrozenRows: new Set(),
            columnHeaderHovered: false,
            hoveredRowIndex: null,
            hoveredColumnIndex: null,
            hoveredColumn: null, // Tracks which column is currently hovered
            hoveredRow: null,
            scrollingUp: false
        };
        this.measureWidthAndHeigths = this.measureWidthAndHeigths.bind(this);
        this.columnMouseDownHandler = this.columnMouseDownHandler.bind(this);
        this.rowMouseDownHandler = this.rowMouseDownHandler.bind(this);
        this.findWidth = this.findWidth.bind(this);
        this.findHeight = this.findHeight.bind(this);
        this.highlighttext = this.highlighttext.bind(this);
    }

    componentDidMount() {
        this.setupTableData();
        const tableContainer = document.getElementById('table-container');
        if (tableContainer) {
            tableContainer.addEventListener('scroll', this.handleScroll);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevProps.params) !== JSON.stringify(this.props.params)) {
            this.setupTableData();
        }
        if (prevState.params !== this.state?.params) {
            // Ensuring measureHeaderWidths is called after the component updates the DOM
            window.requestAnimationFrame(() => {
                this.measureWidthAndHeigths();
            });
        }
    }
    toggleFreezeRow = (row_index) => {
        this.setState((prevState) => {
            const frozenRows = new Set(prevState.frozenRows);
            if (frozenRows.has(row_index)) {
                frozenRows.delete(row_index); // Unfreeze if already frozen
            } else {
                frozenRows.add(row_index); // Freeze if not already frozen
            }
            return { frozenRows };
        });
    };

    handleScroll = (event) => {
        const scrollTop = event.target.scrollTop;

        // Determine if scrolling from top to bottom or bottom to top
        const scrollingUp = scrollTop < this.previousScrollTop;
        this.setState({ scrollingUp });

        this.previousScrollTop = scrollTop;
    };

    toggleFreezeColumn = (columnIndex) => {
        const frozenColumns = new Set(this.state.frozenColumns);
        if (frozenColumns.has(columnIndex)) {
            frozenColumns.delete(columnIndex);
        } else {
            frozenColumns.add(columnIndex);
        }
        this.setState({ frozenColumns });
    };

    highlighttext = (text, search) => {
        if (!search) return text;
        const parts = String(text).split(new RegExp(`(${search})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === search.toLowerCase() ? (
                <span key={index} style={{ backgroundColor: 'yellow' }}>
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    onClickSort = (sort_table_index, sort_col_index) => {
        var sort_by_params = this.state.sort_by_params;
        while (sort_by_params.length <= sort_table_index) {
            sort_by_params.push({});
        }

        sort_by_params[sort_table_index] = {
            sort_col_index: sort_col_index,
            sort_col_desc: sort_by_params[sort_table_index].sort_col_desc === false ? true : false
        };

        this.setState({
            sort_by_params: sort_by_params
        });

        this.setupTableData();
    };
    bookmarkSort = () => {
        const defaultRows = this.props.params.table_data;
        const new_data = [
            ...defaultRows.filter((el) => el.includes('bookmarked')),
            ...defaultRows.filter((el) => !el.includes('bookmarked'))
        ];
        const defaultOrder =
            JSON.stringify(new_data) === JSON.stringify(this.state.params.table_data);
        this.setState({
            ...this.state,
            params: { ...this.state.params, table_data: !defaultOrder ? new_data : defaultRows }
        });
    };
    calculateStickyPosition = (columnIndex) => {
        let leftOffset = 0;
        for (let i = 0; i < columnIndex; i++) {
            if (this.state.frozenColumns.has(i)) {
                leftOffset += this.state.headerWidths?.[i]?.width || 100; // Use the column's width or a default value
            }
        }
        return leftOffset;
    };
    calculateRightStickyPosition = (columnIndex) => {
        let rightOffset = 0;
        const totalColumns = this.state.headerWidths?.length || 0;

        for (let i = totalColumns - 1; i > columnIndex; i--) {
            if (this.state.frozenColumns.has(i)) {
                rightOffset += this.state.headerWidths?.[i]?.width || 100;
            }
        }
        return rightOffset;
    };

    setupTableData = () => {
        const { params } = this.props;

        if (params?.multiple_tables) {
            _.each(
                params.table_headers,
                function (table_headers, table_index) {
                    var sort_col_index = false;
                    var sort_col_desc = false;

                    if (
                        this.state.sort_by_params.length > table_index &&
                        this.state.sort_by_params[table_index]['sort_col_index']
                    ) {
                        sort_col_index = this.state.sort_by_params[table_index]['sort_col_index'];
                        sort_col_desc = this.state.sort_by_params[table_index]['sort_col_desc'];
                    } else {
                        sort_col_index = 0;
                    }

                    var sorted_data = _.sortBy(
                        params.table_data[table_index],
                        function (data_item) {
                            if (data_item[sort_col_index] && data_item[sort_col_index].replace) {
                                var cleaned_data_item = parseFloat(
                                    data_item[sort_col_index].replace('$', '').replace(/,/g, '')
                                );
                                if (isNaN(cleaned_data_item)) {
                                    return data_item[sort_col_index];
                                } else {
                                    return cleaned_data_item;
                                }
                            } else {
                                return data_item[sort_col_index].value
                                    ? parseFloat(data_item[sort_col_index].value)
                                    : data_item[sort_col_index];
                            }
                        }
                    );

                    if (sort_col_desc) {
                        sorted_data = sorted_data.reverse();
                    }

                    params.table_data[table_index] = sorted_data;
                },
                this
            );
        } else {
            var sort_col_index = false;
            var sort_col_desc = false;

            if (
                this.state.sort_by_params.length > 0 &&
                (this.state.sort_by_params[0]['sort_col_index'] ||
                    this.state.sort_by_params[0]['sort_col_index'] === 0)
            ) {
                sort_col_index = this.state.sort_by_params[0]['sort_col_index'];
                sort_col_desc = this.state.sort_by_params[0]['sort_col_desc'];
            }

            if (sort_col_index !== false) {
                var sorted_data = _.sortBy(params.table_data, function (data_item) {
                    if (data_item[sort_col_index] && data_item[sort_col_index].replace) {
                        var cleaned_data_item = parseFloat(
                            data_item[sort_col_index].replace('$', '').replace(/,/g, '')
                        );
                        if (isNaN(cleaned_data_item)) {
                            return data_item[sort_col_index];
                        } else {
                            return cleaned_data_item;
                        }
                    } else {
                        return data_item[sort_col_index].value
                            ? parseFloat(data_item[sort_col_index].value)
                            : data_item[sort_col_index];
                    }
                });

                if (sort_col_desc) {
                    sorted_data = sorted_data.reverse();
                }

                params.table_data = sorted_data;
            }
        }

        this.setState(() => {
            const headerRefs = params?.table_headers?.map(() => React.createRef());
            const rowRefs = params?.table_data?.map(() => React.createRef());
            return { params, headerRefs, rowRefs };
        }, this.measureWidthAndHeigths);
    };

    measureWidthAndHeigths() {
        window.requestAnimationFrame(() => {
            const headerWidths = this.state?.headerRefs?.map((ref, index) => {
                return { id: index, width: ref.current?.offsetWidth };
            });
            const rowHeights = this.state?.rowRefs?.map((ref, index) => {
                return { id: index, height: ref.current?.offsetHeight };
            });
            this.setState({ headerWidths, rowHeights });
        });
    }
    toggleFreezeTopRow = (rowIndex) => {
        this.setState((prevState) => {
            const topFrozenRows = new Set(prevState.topFrozenRows);
            if (topFrozenRows.has(rowIndex)) {
                topFrozenRows.delete(rowIndex); // Unfreeze the row if already frozen
            } else {
                topFrozenRows.add(rowIndex); // Freeze the row
            }
            return { topFrozenRows };
        });
    };

    toggleFreezeBottomRow = (rowIndex) => {
        this.setState((prevState) => {
            const bottomFrozenRows = new Set(prevState.bottomFrozenRows);
            if (bottomFrozenRows.has(rowIndex)) {
                bottomFrozenRows.delete(rowIndex); // Unfreeze the row if already frozen
            } else {
                bottomFrozenRows.add(rowIndex); // Freeze the row
            }
            return { bottomFrozenRows };
        });
    };

    findWidth(index) {
        if (index !== -1) {
            const foundIndex = this.state?.headerWidths?.findIndex((el) => el.id == index);

            if (foundIndex !== -1) return foundIndex;
        }
        return undefined;
    }
    findHeight(index) {
        if (index !== -1) {
            const foundIndex = this.state?.rowHeights?.findIndex((el) => el.id == index);
            if (foundIndex !== -1) return foundIndex;
        }
        return undefined;
    }

    columnMouseDownHandler(event, index) {
        const startX = event.pageX;
        const foundIndex = this.findWidth(index);
        const curr = this.state?.headerWidths[foundIndex]['width'];
        const widthsCopy = structuredClone(this.state.headerWidths);

        const handleMouseMove = (moveEvent) => {
            const updatedWidth = curr + (moveEvent.pageX - startX);
            const newWidth = Math.max(updatedWidth, 50);
            widthsCopy[foundIndex]['width'] = newWidth;
            this.setState({ headerWidths: widthsCopy });
        };

        //cleanup
        function handleMouseUp() {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
        //appending listeners
        try {
            event.preventDefault();
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } catch (err) {
            console.error(err);
        }
    }

    rowMouseDownHandler(event, index) {
        const startY = event.clientY;
        const foundIndex = this.findHeight(index);
        const curr = this.state.rowHeights?.[foundIndex]?.['height'];
        const heightsCopy = structuredClone(this.state?.rowHeights);

        const handleMouseMove = (moveEvent) => {
            const updatedHeight = curr + (moveEvent?.clientY - startY);
            const newHeight = Math.max(updatedHeight, 50);
            heightsCopy[foundIndex]['height'] = newHeight;
            this.setState({ rowHeights: heightsCopy });
        };

        //cleanup
        function handleMouseUp() {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
        try {
            event.preventDefault();
            //appending listeners
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } catch (err) {
            console.error(err);
        }
    }
    handleBookMark = (row) => {
        const { params } = this.props;
        if (params?.tableOptions?.freezeBookmark) return;
        if (row.includes('bookmarked')) {
            const index = row.indexOf('bookmarked');
            row.splice(index, 1);
        } else {
            row.push('bookmarked');
        }
        this.setupTableData();
    };
    handleOuterActionClick = (name) => {
        this.props.onOuterAction &&
            this.props.onOuterAction(
                {
                    actionName: name,
                    tableProps: {
                        ...this.state.params
                    }
                },
                false
            );
    };
    columnhandleMouseEnter = (rowIndex) => {
        this.setState({ hoveredColumnIndex: rowIndex });
    };

    handleMouseEnter = (rowIndex) => {
        this.setState({ hoveredRowIndex: rowIndex });
    };

    handleMouseLeave = () => {
        this.setState({ hoveredRowIndex: null });
    };
    renderTableRow = (row_index, row_data, is_simple_table) => {
        const { classes } = this.props;
        const tableOptions = this.state?.params?.tableOptions;
        const handleTags = () => {
            this.setupTableData();
        };
        const getCellData = (cellItem) => {
            const { handleTagSearch } = this.props;

            const filterTags = (val) => {
                if (handleTagSearch) {
                    handleTagSearch(val);
                }
            };
            if (cellItem) {
                if (typeof cellItem === 'object') {
                    if (cellItem.url) {
                        return (
                            <Link href={cellItem.url} download style={{ color: 'inherit' }}>
                                {cellItem.value ? (
                                    cellItem.value
                                ) : (
                                    <GetAppIcon className={classes.icon} />
                                )}
                            </Link>
                        );
                    } else if (
                        Array.isArray(cellItem) &&
                        this.state.params.tableOptions.enableTags
                    ) {
                        return (
                            <TagsRenderer
                                tagData={cellItem}
                                onChange={handleTags}
                                params={this.state.params?.tableOptions?.tagOptions}
                                handleTags={filterTags}
                            />
                        );
                    } else if (cellItem.value) {
                        return cellItem.value;
                    } else {
                        return null;
                    }
                } else {
                    return cellItem;
                }
            } else {
                return cellItem;
            }
        };
        const hightLightText = (value) => {
            return this.props.search
                ? String(value).toLowerCase().includes(this.props.search.toLowerCase()) &&
                      this.props.search.length
                : false;
        };

        if (is_simple_table) {
            return (
                <>
                    <StyledTableRow
                        key={'row_' + row_index}
                        ref={
                            this.state.rowRefs?.[row_index] ? this.state.rowRefs?.[row_index] : null
                        }
                        style={{
                            height: this.state.rowHeights?.[row_index]?.['height']
                                ? this.state.rowHeights?.[row_index]?.['height']
                                : undefined
                        }}
                    >
                        {_.map(
                            row_data,
                            function (cell_item, cell_index) {
                                if (cell_index === 0) {
                                    return (
                                        <StyledTableCell
                                            style={{
                                                backgroundColor: cell_item.bgColor,
                                                textAlign:
                                                    typeof cell_item === 'number'
                                                        ? 'right'
                                                        : 'left',
                                                position: 'relative'
                                            }}
                                            key={
                                                'table-header-cell-' + row_index + '-' + cell_index
                                            }
                                            component="th"
                                            scope="row"
                                        >
                                            {getCellData(cell_item)}
                                            {tableOptions?.expandableColumns &&
                                                this.state?.columnHeaderHovered && (
                                                    <div
                                                        className={
                                                            classes.colExpansionThumbHoveredBody
                                                        }
                                                    ></div>
                                                )}
                                        </StyledTableCell>
                                    );
                                } else {
                                    return (
                                        <StyledTableCell
                                            style={{
                                                backgroundColor: cell_item.bgColor,
                                                textAlign:
                                                    typeof cell_item === 'number'
                                                        ? 'right'
                                                        : 'left',
                                                position: 'relative'
                                            }}
                                            key={
                                                'table-header-cell-' + row_index + '-' + cell_index
                                            }
                                        >
                                            {getCellData(cell_item)}
                                            {tableOptions?.expandableColumns &&
                                                this.state?.columnHeaderHovered && (
                                                    <div
                                                        className={
                                                            classes.colExpansionThumbHoveredBody
                                                        }
                                                    ></div>
                                                )}
                                        </StyledTableCell>
                                    );
                                }
                            },
                            this
                        )}
                    </StyledTableRow>
                    {tableOptions?.expandableRows && (
                        <TableCell
                            style={{ cursor: 'ns-resize', padding: 0, border: 'none' }}
                            colSpan={this.state.params?.table_data?.length + 1}
                            onMouseDown={(e) => {
                                this.rowMouseDownHandler(e, row_index);
                            }}
                        >
                            <div className={classes.rowExpansionHandle}></div>
                        </TableCell>
                    )}
                </>
            );
        } else {
            return (
                <>
                    <TableRow
                        key={'row_' + row_index}
                        ref={
                            this.state.rowRefs?.[row_index] ? this.state.rowRefs?.[row_index] : null
                        }
                        style={{
                            height: this.state.rowHeights?.[row_index]?.['height']
                                ? this.state.rowHeights?.[row_index]['height']
                                : undefined
                        }}
                    >
                        {tableOptions?.enableBookmark ? (
                            <StyledTableCell style={{ position: 'relative' }}>
                                <StarOutlinedIcon
                                    onClick={() => this.handleBookMark(row_data)}
                                    style={{
                                        fill: row_data.includes('bookmarked')
                                            ? '#FFC700'
                                            : 'transparent'
                                    }}
                                    className={classes.bookmarkIcon}
                                />
                                {tableOptions?.expandableColumns &&
                                    this.state?.columnHeaderHovered && (
                                        <div className={classes.colExpansionThumbHoveredBody}></div>
                                    )}
                            </StyledTableCell>
                        ) : null}
                        {_.map(
                            row_data,
                            function (cell_item, cell_index) {
                                if (cell_item === 'bookmarked') return;
                                if (cell_index === 0) {
                                    return (
                                        <StyledTableCell
                                            style={{
                                                backgroundColor: cell_item.bgColor,
                                                textAlign:
                                                    typeof cell_item === 'number'
                                                        ? 'right'
                                                        : 'left',
                                                position: 'relative'
                                            }}
                                            key={
                                                'table-header-cell-' + row_index + '-' + cell_index
                                            }
                                            component="th"
                                            scope="row"
                                        >
                                            <span
                                                className={
                                                    hightLightText(cell_item)
                                                        ? classes.highLightCell
                                                        : ''
                                                }
                                            >
                                                {getCellData(cell_item)}
                                            </span>
                                            {tableOptions?.expandableColumns &&
                                                this.state?.columnHeaderHovered && (
                                                    <div
                                                        className={
                                                            classes.colExpansionThumbHoveredBody
                                                        }
                                                    ></div>
                                                )}
                                        </StyledTableCell>
                                    );
                                } else {
                                    return (
                                        <StyledTableCell
                                            style={{
                                                backgroundColor: cell_item.bgColor,
                                                textAlign:
                                                    typeof cell_item === 'number'
                                                        ? 'right'
                                                        : 'left',
                                                position: 'relative'
                                            }}
                                            key={
                                                'table-header-cell-' + row_index + '-' + cell_index
                                            }
                                        >
                                            <span
                                                className={
                                                    hightLightText(cell_item)
                                                        ? classes.highLightCell
                                                        : ''
                                                }
                                            >
                                                {getCellData(cell_item)}
                                            </span>
                                            {tableOptions?.expandableColumns &&
                                                this.state?.columnHeaderHovered && (
                                                    <div
                                                        className={
                                                            classes.colExpansionThumbHoveredBody
                                                        }
                                                    ></div>
                                                )}
                                        </StyledTableCell>
                                    );
                                }
                            },
                            this
                        )}
                    </TableRow>
                    {
                        // meant for row expanders
                        tableOptions?.expandableRows && (
                            <TableCell
                                style={{
                                    cursor: 'ns-resize',
                                    padding: 0,
                                    border: 'none',
                                    position: 'relative'
                                }}
                                colSpan={this.state?.params?.table_data?.length + 1}
                                onMouseDown={(e) => {
                                    this.rowMouseDownHandler(e, row_index);
                                }}
                            >
                                <div className={classes.rowExpansionHandle}></div>
                            </TableCell>
                        )
                    }
                </>
            );
        }
    };
    calculateTopOffset(rowIndex, frozenRowsSet) {
        const frozenRowsArray = Array.from(frozenRowsSet);
        const frozenRowIndex = frozenRowsArray.indexOf(rowIndex);
        return frozenRowIndex >= 0 ? frozenRowIndex * 35 + 30 : 0;
    }

    calculateBottomOffset(rowIndex, frozenRowsSet) {
        const frozenRowsArray = Array.from(frozenRowsSet);
        const frozenRowIndex = frozenRowsArray.indexOf(rowIndex);
        return frozenRowIndex >= 0 ? frozenRowIndex * 35 : 0;
    }

    render() {
        let { classes, search } = this.props;
        const { hoveredRowIndex } = this.state;

        search = search || '';
        const searchValue = (val) => {
            if (!val) {
                return undefined;
            }

            if (typeof val === 'object' && !Array.isArray(val)) {
                return val.value;
            }

            if (Array.isArray(val)) {
                const result = val.flatMap((obj) => Object.values(obj));
                return result.join(' ');
            }

            return val;
        };
        const handleTags = () => {
            this.setupTableData();
        };
        const getCellData = (cellItem) => {
            const { handleTagSearch } = this.props;

            const filterTags = (val) => {
                if (handleTagSearch) {
                    handleTagSearch(val);
                }
            };
            if (cellItem) {
                if (typeof cellItem === 'object') {
                    if (cellItem.url) {
                        return (
                            <Link href={cellItem.url} download style={{ color: 'inherit' }}>
                                {cellItem.value ? (
                                    cellItem.value
                                ) : (
                                    <GetAppIcon className={classes.icon} />
                                )}
                            </Link>
                        );
                    } else if (
                        Array.isArray(cellItem) &&
                        this.state.params.tableOptions.enableTags
                    ) {
                        return (
                            <TagsRenderer
                                tagData={cellItem}
                                onChange={handleTags}
                                params={this.state.params?.tableOptions?.tagOptions}
                                handleTags={filterTags}
                            />
                        );
                    } else if (cellItem.value) {
                        return cellItem.value;
                    } else {
                        return null;
                    }
                } else {
                    return cellItem;
                }
            } else {
                return cellItem;
            }
        };
        const tableOptions = this.state?.params?.tableOptions;
        const table_data = this.state?.params?.table_data?.filter((row) =>
            row
                .map((el) => searchValue(el))
                .join(' ')
                .toLowerCase()
                .includes(search.toLowerCase())
        );
        return this.state.params ? (
            this.state.params.multiple_tables ? (
                _.map(
                    this.state.params.table_headers,
                    function (table_headers, table_index) {
                        return (
                            <div key={'table-container-' + table_index}>
                                <Typography className={classes.multiTableLabel}>
                                    {this.state.params.table_labels[table_index]}
                                    {!this.state.params?.suppress_download && (
                                        <Tooltip title={<h1>Download File</h1>}>
                                            <IconButton
                                                aria-label="download"
                                                onClick={() => downloadFile(this.state.data)}
                                                className={classes.downloadIcon}
                                                data-testid="downloading"
                                            >
                                                <GetApp fontSize="large" color="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Typography>
                                <TableContainer component={Paper}>
                                    <Table className={classes.table} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                {_.map(
                                                    table_headers,
                                                    function (table_header, table_header_index) {
                                                        if (
                                                            this.state.sort_by_params.length >
                                                                table_index &&
                                                            this.state.sort_by_params[table_index]
                                                                .sort_col_index ===
                                                                table_header_index
                                                        ) {
                                                            return (
                                                                <SortedTableCell
                                                                    onClick={() =>
                                                                        this.onClickSort(
                                                                            table_index,
                                                                            table_header_index
                                                                        )
                                                                    }
                                                                    style={{
                                                                        textAlign: table_data.length
                                                                            ? typeof table_data[0][
                                                                                  table_header_index
                                                                              ] === 'number'
                                                                                ? 'right'
                                                                                : 'left'
                                                                            : 'left'
                                                                    }}
                                                                    key={
                                                                        'table-header-cell-' +
                                                                        table_header_index
                                                                    }
                                                                >
                                                                    <span>
                                                                        {typeof table_header ===
                                                                        'object'
                                                                            ? table_header['value']
                                                                            : table_header}
                                                                    </span>
                                                                    {this.state.sort_by_params[
                                                                        table_index
                                                                    ].sort_col_desc ? (
                                                                        <SortdownIcon
                                                                            style={{
                                                                                width: '10',
                                                                                height: '10'
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <SortupIcon
                                                                            style={{
                                                                                width: '10',
                                                                                height: '10'
                                                                            }}
                                                                        />
                                                                    )}
                                                                </SortedTableCell>
                                                            );
                                                        } else {
                                                            return (
                                                                <StyledTableCell
                                                                    onClick={() =>
                                                                        this.onClickSort(
                                                                            table_index,
                                                                            table_header_index
                                                                        )
                                                                    }
                                                                    style={{
                                                                        textAlign: table_data.length
                                                                            ? typeof table_data[0][
                                                                                  table_header_index
                                                                              ] === 'number'
                                                                                ? 'right'
                                                                                : 'left'
                                                                            : 'left'
                                                                    }}
                                                                    key={
                                                                        'table-header-cell-' +
                                                                        table_header_index
                                                                    }
                                                                >
                                                                    {typeof table_header ===
                                                                    'object'
                                                                        ? table_header['value']
                                                                        : table_header}
                                                                </StyledTableCell>
                                                            );
                                                        }
                                                    },
                                                    this
                                                )}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {_.map(
                                                this.state.params.table_data[table_index],
                                                function (data_item, row_index) {
                                                    return this.renderTableRow(
                                                        row_index,
                                                        data_item,
                                                        this.state.params.is_simple_table,
                                                        this.state.params.table_headers
                                                    );
                                                },
                                                this
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        );
                    },
                    this
                )
            ) : (
                <React.Fragment>
                    <TableContainer
                        classes={{ root: classes.tableContainerRoot }}
                        component={Paper}
                        id="table-container"
                        ref={this.tableContainerRef}
                    >
                        <Table stickyHeader className={classes.table} aria-label="customized table">
                            <TableHead
                                onMouseEnter={() => {
                                    this.setState({ columnHeaderHovered: true });
                                }}
                                onMouseLeave={() => this.setState({ columnHeaderHovered: false })}
                            >
                                <TableRow>
                                    {tableOptions?.enableBookmark ? (
                                        <StyledTableCell
                                            onClick={() => this.bookmarkSort('bookmark')}
                                        >
                                            {tableOptions.bookmarkColumn || 'Bookmark'}
                                            {tableOptions?.expandableColumns &&
                                                this.state?.columnHeaderHovered && (
                                                    <div
                                                        className={classes.colExpansionThumbHovered}
                                                    ></div>
                                                )}
                                        </StyledTableCell>
                                    ) : null}
                                    {_.map(
                                        this.state.params.table_headers,
                                        function (table_header, table_header_index) {
                                            const isFrozenColumn =
                                                this.props.freezing &&
                                                this.state?.frozenColumns.has(table_header_index);
                                            const isFrozen =
                                                this.props.freezing &&
                                                this.state?.frozenColumns.has(table_header_index);
                                            if (
                                                this.state.sort_by_params.length > 0 &&
                                                this.state.sort_by_params[0].sort_col_index ===
                                                    table_header_index
                                            ) {
                                                return (
                                                    <StyledTableCell
                                                        style={{
                                                            textAlign: table_data.length
                                                                ? typeof table_data[0][
                                                                      table_header_index
                                                                  ] === 'number'
                                                                    ? 'right'
                                                                    : 'left'
                                                                : 'left',
                                                            width:
                                                                this.state.headerWidths?.[
                                                                    table_header_index
                                                                ]?.width || undefined,
                                                            position: isFrozen
                                                                ? 'sticky'
                                                                : 'sticky', // Style adjustments for frozen columns

                                                            zIndex: isFrozen ? 1000 : 1000,
                                                            userSelect: 'none' /* Standard */,
                                                            WebkitUserSelect: 'none' /* Safari */,
                                                            MozUserSelect: 'none' /* Firefox */,
                                                            msUserSelect: 'none',
                                                            left: isFrozen
                                                                ? `${this.calculateStickyPosition(
                                                                      table_header_index
                                                                  )}px`
                                                                : 'unset',
                                                            right: isFrozen
                                                                ? `${this.calculateRightStickyPosition(
                                                                      table_header_index
                                                                  )}px`
                                                                : 'unset'
                                                        }}
                                                        ref={
                                                            this.state.headerRefs?.[
                                                                table_header_index
                                                            ]
                                                                ? this.state.headerRefs?.[
                                                                      table_header_index
                                                                  ]
                                                                : null
                                                        }
                                                        id={`column${table_header_index}`}
                                                        key={'table_header_' + table_header_index}
                                                        onMouseEnter={() =>
                                                            this.setState({
                                                                hoveredColumn: table_header_index
                                                            })
                                                        }
                                                        onMouseLeave={() =>
                                                            this.setState({ hoveredColumn: null })
                                                        }
                                                    >
                                                        <div className={classes.iconplacement}>
                                                            {/* Show lock icon only if freezing is true and column is hovered */}
                                                            <div>
                                                                {' '}
                                                                {this.props.freezing &&
                                                                    (this.state?.hoveredColumn ===
                                                                        table_header_index ||
                                                                        isFrozenColumn) && (
                                                                        <LockOutlined
                                                                            onClick={() =>
                                                                                this.toggleFreezeColumn(
                                                                                    table_header_index
                                                                                )
                                                                            }
                                                                            style={{
                                                                                cursor: 'pointer',
                                                                                width: '11',
                                                                                height: '12'
                                                                                // Adjust positioning for visibility
                                                                            }}
                                                                            fontSize="medium"
                                                                        />
                                                                    )}
                                                            </div>
                                                            <div>
                                                                {typeof table_header === 'object'
                                                                    ? table_header['value']
                                                                    : table_header}
                                                            </div>
                                                            <div>
                                                                {this.state.sort_by_params[0]
                                                                    .sort_col_desc ? (
                                                                    <SortdownIcon
                                                                        onClick={() =>
                                                                            this.onClickSort(
                                                                                0,
                                                                                table_header_index
                                                                            )
                                                                        }
                                                                        style={{
                                                                            width: '17',
                                                                            height: '17'
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <SortupIcon
                                                                        onClick={() =>
                                                                            this.onClickSort(
                                                                                0,
                                                                                table_header_index
                                                                            )
                                                                        }
                                                                        style={{
                                                                            width: '17',
                                                                            height: '17'
                                                                        }}
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>

                                                        {tableOptions?.expandableColumns &&
                                                            this.state?.columnHeaderHovered && (
                                                                <div
                                                                    className={
                                                                        classes.colExpansionThumbHovered
                                                                    }
                                                                    onMouseDown={(e) =>
                                                                        this.columnMouseDownHandler(
                                                                            e,
                                                                            table_header_index
                                                                        )
                                                                    }
                                                                ></div>
                                                            )}
                                                    </StyledTableCell>
                                                );
                                            } else {
                                                return (
                                                    <StyledTableCell
                                                        style={{
                                                            textAlign: table_data.length
                                                                ? typeof table_data[0][
                                                                      table_header_index
                                                                  ] === 'number'
                                                                    ? 'right'
                                                                    : 'left'
                                                                : 'left',
                                                            width:
                                                                this.state.headerWidths?.[
                                                                    table_header_index
                                                                ]?.width || undefined,
                                                            position: isFrozen
                                                                ? 'sticky'
                                                                : 'sticky',

                                                            zIndex: isFrozen ? 1000 : 5,
                                                            left: isFrozen
                                                                ? `${this.calculateStickyPosition(
                                                                      table_header_index
                                                                  )}px`
                                                                : 'unset',
                                                            right: isFrozen
                                                                ? `${this.calculateRightStickyPosition(
                                                                      table_header_index
                                                                  )}px`
                                                                : 'unset'
                                                        }}
                                                        onMouseDown={(e) =>
                                                            this.columnMouseDownHandler(
                                                                e,
                                                                table_header_index
                                                            )
                                                        }
                                                        ref={
                                                            this.state?.headerRefs?.[
                                                                table_header_index
                                                            ]
                                                                ? this.state.headerRefs?.[
                                                                      table_header_index
                                                                  ]
                                                                : null
                                                        }
                                                        id={`column${table_header_index}`}
                                                        key={'table_header_' + table_header_index}
                                                        onMouseEnter={() =>
                                                            this.setState({
                                                                hoveredColumn: table_header_index
                                                            })
                                                        }
                                                        onMouseLeave={() =>
                                                            this.setState({ hoveredColumn: null })
                                                        }
                                                    >
                                                        <div className={classes.iconplacement}>
                                                            <div>
                                                                {' '}
                                                                {this.props.freezing &&
                                                                    (this.state?.hoveredColumn ===
                                                                        table_header_index ||
                                                                        isFrozenColumn) && (
                                                                        <LockOutlined
                                                                            onClick={() =>
                                                                                this.toggleFreezeColumn(
                                                                                    table_header_index
                                                                                )
                                                                            }
                                                                            style={{
                                                                                cursor: 'pointer',
                                                                                width: '11',
                                                                                height: '12'
                                                                            }}
                                                                        />
                                                                    )}
                                                            </div>
                                                            <div>
                                                                {typeof table_header === 'object'
                                                                    ? table_header['value']
                                                                    : table_header}
                                                            </div>
                                                            <div
                                                                onClick={() =>
                                                                    this.onClickSort(
                                                                        0,
                                                                        table_header_index
                                                                    )
                                                                }
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                {this.props.freezing &&
                                                                    this.state.hoveredColumn ===
                                                                        table_header_index && (
                                                                        <div>
                                                                            <SortIcon
                                                                                onClick={() =>
                                                                                    this.onClickSort(
                                                                                        0,
                                                                                        table_header_index
                                                                                    )
                                                                                }
                                                                                style={{
                                                                                    width: '10',
                                                                                    height: '10'
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        </div>

                                                        {tableOptions?.expandableColumns &&
                                                            this.state.columnHeaderHovered && (
                                                                <div
                                                                    className={
                                                                        classes.colExpansionThumbHovered
                                                                    }
                                                                    onMouseDown={(e) =>
                                                                        this.columnMouseDownHandler(
                                                                            e,
                                                                            table_header_index
                                                                        )
                                                                    }
                                                                ></div>
                                                            )}
                                                    </StyledTableCell>
                                                );
                                            }
                                        },
                                        this
                                    )}
                                </TableRow>
                            </TableHead>

                            <TableBody className={classes.tablebody}>
                                {table_data.map((data_item, row_index) => {
                                    const isTopHalf = row_index < Math.floor(table_data.length / 2);
                                    const isFrozenRow = isTopHalf
                                        ? this.state.topFrozenRows.has(row_index)
                                        : this.state.bottomFrozenRows.has(row_index);

                                    // Calculate the sticky top and bottom positions
                                    const topOffset =
                                        isFrozenRow && isTopHalf
                                            ? this.calculateTopOffset(
                                                  row_index,
                                                  this.state.topFrozenRows
                                              )
                                            : 0;

                                    const bottomOffset =
                                        isFrozenRow && !isTopHalf
                                            ? this.calculateBottomOffset(
                                                  row_index,
                                                  this.state.bottomFrozenRows
                                              )
                                            : undefined;

                                    return (
                                        <TableRow
                                            key={`row-${row_index}`}
                                            style={{
                                                height:
                                                    this.state.rowHeights?.[row_index]?.[
                                                        'height'
                                                    ] || undefined,
                                                position: isFrozenRow ? 'sticky' : 'relative',
                                                top:
                                                    isFrozenRow && isTopHalf
                                                        ? `${topOffset}px`
                                                        : '0px',
                                                bottom:
                                                    isFrozenRow && !isTopHalf
                                                        ? `${bottomOffset}px`
                                                        : 'unset',

                                                zIndex: isFrozenRow
                                                    ? 110 +
                                                      (isTopHalf
                                                          ? Array.from(
                                                                this.state.topFrozenRows
                                                            ).indexOf(row_index)
                                                          : Array.from(
                                                                this.state.bottomFrozenRows
                                                            ).indexOf(row_index))
                                                    : 0,
                                                userSelect: 'none'
                                            }}
                                            onMouseEnter={() => this.handleMouseEnter(row_index)}
                                            onMouseLeave={this.handleMouseLeave}
                                            className={isFrozenRow && classes.freezingsticky}
                                        >
                                            {this.state.params.table_headers.map((_, cellIndex) => {
                                                const cellData = data_item[cellIndex];
                                                const isFrozenColumn =
                                                    this.props.freezing &&
                                                    this.state.frozenColumns.has(cellIndex);
                                                return (
                                                    <StyledTableCell
                                                        key={`cell-${row_index}-${cellIndex}`}
                                                        style={{
                                                            cursor: 'pointer',
                                                            position:
                                                                isFrozenRow || isFrozenColumn
                                                                    ? 'sticky'
                                                                    : 'relative',
                                                            top:
                                                                isFrozenRow && isTopHalf
                                                                    ? `${topOffset}px`
                                                                    : 'inherit',
                                                            bottom:
                                                                isFrozenRow && !isTopHalf
                                                                    ? `${bottomOffset}px`
                                                                    : 'unset',

                                                            zIndex:
                                                                isFrozenRow || isFrozenColumn
                                                                    ? 110 +
                                                                      (isTopHalf
                                                                          ? Array.from(
                                                                                this.state
                                                                                    .topFrozenRows
                                                                            ).indexOf(row_index)
                                                                          : Array.from(
                                                                                this.state
                                                                                    .bottomFrozenRows
                                                                            ).indexOf(row_index))
                                                                    : 0,
                                                            textAlign:
                                                                typeof cellData === 'number'
                                                                    ? 'right'
                                                                    : 'left',
                                                            left:
                                                                isFrozenColumn || isFrozenRow
                                                                    ? `${this.calculateStickyPosition(
                                                                          cellIndex
                                                                      )}px`
                                                                    : 'unset',
                                                            right:
                                                                isFrozenColumn || isFrozenRow
                                                                    ? `${this.calculateRightStickyPosition(
                                                                          cellIndex
                                                                      )}px`
                                                                    : 'unset'
                                                        }}
                                                        className={
                                                            isFrozenColumn || isFrozenRow
                                                                ? classes.freezingsticky
                                                                : null
                                                        }
                                                    >
                                                        {cellIndex === 0 && this.props.freezing ? (
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'flex-start'
                                                                }}
                                                            >
                                                                {hoveredRowIndex === row_index && (
                                                                    <LockOutlined
                                                                        fontSize="10px"
                                                                        style={{
                                                                            marginRight: '8px',
                                                                            cursor: 'pointer',
                                                                            width: '11px',
                                                                            height: '12px'
                                                                        }}
                                                                        onClick={() =>
                                                                            isTopHalf
                                                                                ? this.toggleFreezeTopRow(
                                                                                      row_index
                                                                                  )
                                                                                : this.toggleFreezeBottomRow(
                                                                                      row_index
                                                                                  )
                                                                        }
                                                                    />
                                                                )}
                                                                <span>
                                                                    {this.highlighttext(
                                                                        getCellData(cellData),
                                                                        this.props.search
                                                                    )}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            this.highlighttext(
                                                                getCellData(cellData),
                                                                this.props.search
                                                            )
                                                        )}
                                                    </StyledTableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {tableOptions && tableOptions.outerActions ? (
                        <Box
                            width="100%"
                            display="flex"
                            flexWrap="wrap"
                            gridGap="1rem"
                            padding="1.5rem 0"
                        >
                            {tableOptions?.outerActions.map((el, index) => {
                                if (el) {
                                    const {
                                        text,
                                        name = el,
                                        ...props
                                    } = typeof el === 'string' ? {} : el;
                                    return (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            key={name}
                                            {...props}
                                            onClick={() => this.handleOuterActionClick(name)}
                                            aria-label={text || name}
                                        >
                                            {text || name}
                                        </Button>
                                    );
                                } else {
                                    return (
                                        <div key={'key' + index} style={{ flex: 1 }}>
                                            {' '}
                                        </div>
                                    );
                                }
                            })}
                        </Box>
                    ) : null}
                </React.Fragment>
            )
        ) : (
            ''
        );
    }
}

AppWidgetTable.propTypes = {
    classes: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    freezing: PropTypes.bool
};

export default withStyles(
    (theme) => ({
        ...appWidgetTableStyle(theme)
    }),
    { useTheme: true }
)(AppWidgetTable);
