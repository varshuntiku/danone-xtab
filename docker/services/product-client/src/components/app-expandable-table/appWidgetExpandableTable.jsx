import React, { useEffect } from 'react';
import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import StarOutlinedIcon from '@material-ui/icons/StarOutlined';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import AppCustomizedProgressBars from './appCustomProgressBar';
import expandableTableStyle from '../../assets/jss/expandableTableStyle';
import TextInput from '../dynamic-form/inputFields/textInput';
import NumberInput from '../dynamic-form/inputFields/numberInput';
import EnhancedTableHead from './enhancedTableHeader';
import TagsRenderer from 'components/gridTable/cell-renderer/tagsRenderer';
import CodexProgressLoader from 'components/POCProgressLoader/CodxProgressLoader';
import { Button } from '@material-ui/core';

const useRowStyles = makeStyles(() => ({
    root: {
        '& > *': {
            borderBottom: 'unset'
        }
    }
}));

const theme = (t) =>
    createTheme({
        ...t,
        overrides: {
            MuiIconButton: {
                label: t.palette.text.titleText
            },
            MuiTableSortLabel: {
                active: {
                    color: t.palette.primary.contrastText + ' !important'
                },
                root: {
                    '&:hover': {
                        opacity: '0.95',
                        color: t.palette.text.default
                    }
                }
            }
        }
    });

/**
* Table with expandable and collapsible row function to show data
* @summary It expands and collapses the table rows, on-click it toggles to collapsible content target to show the child properties or records of the clicked row to the user
* Can be used with large tables or tables where rows have child properties to display
* JSON structure-
* {
*   "columns": [
*     {
*       "id": <index_values>,
*       "label": <index values>

*     },
*     {
*       "id": <label>,
*       "label": <Label>,
*       "cellEditor":  <str: 'text' | 'number' >,
*       "editable":<boolean>, # True if cell is editable,
*     },
*     {
*       "id": <target_attainment>,
*       "label": <Target Attainment>
*     },
*     {
*       "id": <volume>,
*       "label": <Volume>
*     }
*   ],
*   "rows": [
*     {
*       "collapse": <boolean>,
*       "data": {
*         "collapse": <boolean>,
*         "title": <Sub Category>,
*         "columns": [
*           {
*             "id": <column_id>,
*             "label": <column label>
*             "cellEditor": <str: 'text' | 'number' >,
*             "editable": <boolean>, # True if cell is editable
*           },
*         ],
*         "rows": [
*         ]
*       }
*   ]
*   "isExpandable": <boolean>,
*   "editorMode": <boolean>
* }
* @param {object} props- params
*/
function CollapseRows(props) {
    const {
        row,
        columns,
        editMode = false,
        stableSort,
        getComparator,
        nestedLevel,
        outerIndex,
        innerIndex,
        setData,
        data
    } = props;

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('');
    const [openRow, setOpenRow] = React.useState(false);
    const classes1 = useRowStyles();
    const classes = makeStyles(expandableTableStyle)();
    const textColorArray = Object.keys(row).map((iterator) => {
        if (row.textcolor && iterator in row.textcolor) {
            return row.textcolor[iterator];
        } else return false;
    });
    let rowColor = false;
    const textColor = textColorArray;
    for (let val of textColorArray) {
        rowColor = rowColor || val;
    }
    const editor = (type = 'text', key, value) => {
        let params = {
            value: value,
            id: `${key} ${value}`
        };
        const handleValueChange = (val) => {
            let newRows = [];
            if (nestedLevel === 'outer') {
                newRows = data.rows.map((obj, index) => {
                    if (index === outerIndex) {
                        return { ...obj, [key]: val };
                    }
                    return obj;
                });
            } else {
                newRows = data.rows.map((obj, index) => {
                    if (index === outerIndex && obj?.data?.rows?.length > 0) {
                        let nestedRow = obj?.data?.rows?.map((innerObj, i) => {
                            if (i === innerIndex) {
                                return { ...innerObj, [key]: val };
                            }
                            return innerObj;
                        });
                        return { ...obj, data: { ...obj.data, rows: nestedRow } };
                    }
                    return obj;
                });
            }
            setData(newRows);
        };
        switch (type) {
            case 'number':
                return <NumberInput onChange={handleValueChange} fieldInfo={params} />;
            case 'text':
                return <TextInput onChange={handleValueChange} fieldInfo={params} />;
            case 'tags':
                return (
                    <TagsRenderer
                        tagData={value}
                        params={data?.tableOptions?.tagOptions}
                        onChange={handleValueChange}
                    />
                );
            default:
                return null;
        }
    };

    const dataRenderer = (row, item) => {
        if (item.cellEditor === 'progress') {
            return (
                <CodexProgressLoader
                    hasbuffer={false}
                    coldef={{ field: item.id }}
                    progress_info={row}
                />
            );
        }

        if (
            Array.isArray(row[item.id]) &&
            row[item.id].every((image) => RegExp('(.jpg|.jpeg|.png$)').test(image?.url))
        ) {
            return row[item.id].map((image, i) => {
                if (image?.url) {
                    return (
                        <img
                            key={`img-${i}`}
                            src={image.url}
                            alt={`img-${i}`}
                            width={image?.width}
                            height={image?.height}
                            style={{ padding: '2rem' }}
                        />
                    );
                }
                return null;
            });
        } else if (
            Array.isArray(row[item.id]) &&
            row[item.id].some((url) => /\.(jpg|jpeg|png)$/.test(url))
        ) {
            return (
                <div>
                    {row[item.id].map((url, index) => (
                        <img key={index} src={url} alt={`Image ${index + 1}`} />
                    ))}
                </div>
            );
        }

        if (
            editMode &&
            item.editable &&
            Array.isArray(row[item.id]) &&
            data?.tableOptions?.enableTags
        ) {
            return editor(item.cellEditor, item.id, row[item.id]);
        }

        if (typeof row[item.id] === 'object') {
            let obj = row[item.id];
            if (obj['value'] && obj['severity']) {
                return <AppCustomizedProgressBars data={obj} />;
            }
        }

        if (typeof row[item.id] === 'object' && row[item.id].value != null) {
            if (editMode && item.editable) {
                return editor(item.cellEditor, item.id, row[item.id].value);
            } else {
                return row[item.id].value;
            }
        }

        if (Array.isArray(row[item.id])) {
            return row[item.id].map((ele, i) => {
                return (
                    <Tooltip key={'tooltip' + i} title={ele.title} placement="top" arrow>
                        <a href={ele.link} style={{ padding: '8px' }}>
                            <img src={ele.img} alt={ele.title} />
                        </a>
                    </Tooltip>
                );
            });
        }

        if (editMode && item.editable) {
            return editor(item.cellEditor, item.id, row[item.id]);
        } else {
            return row[item.id];
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleBookmark = (row) => {
        if (data?.tableOptions?.freezeBookmark) return;
        row.bookmarked = row.bookmarked ? false : true;
        setData(data.rows);
    };
    const handleFont = (row, item, style) => {
        if (style === 'fontSize') {
            let fontsize;
            if (data?.tableOptions?.cellFontSize) {
                fontsize = data.tableOptions.cellFontSize;
                return fontsize ? `${fontsize}rem` : null;
            }
            if (row.fontSize) {
                if (typeof row.fontSize !== 'object') {
                    fontsize = row.fontSize;
                } else if (typeof row.fontSize === 'object') {
                    fontsize = row.fontSize[item.id];
                } else {
                    fontsize = null;
                }
                return fontsize ? `${fontsize}rem` : null;
            }
            if (item?.fontSize) {
                typeof item.fontSize !== 'object' ? (fontsize = item.fontSize) : (fontsize = null);
                return fontsize ? `${fontsize}rem` : null;
            }
        }
        if (style === 'fontStyle') {
            let fontstyle;
            if (data?.tableOptions?.cellFontStyle) {
                fontstyle = data.tableOptions.cellFontStyle;
                return fontstyle ? `${fontstyle}` : null;
            }
            if (row.fontStyle) {
                if (typeof row.fontStyle !== 'object') {
                    fontstyle = row.fontStyle;
                } else if (typeof row.fontStyle === 'object') {
                    fontstyle = row.fontStyle[item.id];
                } else {
                    fontstyle = null;
                }
                return fontstyle ? `${fontstyle}` : null;
            }
            if (item?.fontStyle) {
                typeof item.fontStyle !== 'object'
                    ? (fontstyle = item.fontStyle)
                    : (fontstyle = null);
                return fontstyle ? `${fontstyle}` : null;
            }
        }
    };
    return (
        <React.Fragment>
            <TableRow
                className={clsx(
                    classes1.root,
                    classes.tableRowHover,
                    nestedLevel === 'inner' ? classes.tableInner : classes.tableOuter,
                    openRow && nestedLevel === 'outer' ? classes.outer : ''
                )}
            >
                {columns.map((item, index) =>
                    item && row[item.id] !== undefined ? (
                        <TableCell
                            style={{
                                backgroundColor:
                                    item && row[item.id]['color'] != null
                                        ? row[item.id]['color']
                                        : 'none',
                                color: rowColor
                                    ? columns[0].id
                                        ? textColor[index]
                                        : textColor[index - 1]
                                    : null,
                                fontSize: handleFont(row, item, 'fontSize'),
                                fontStyle: handleFont(row, item, 'fontStyle')
                            }}
                            className={[
                                clsx(classes.tableCell, openRow ? classes.tableCellSelected : ''),
                                item &&
                                typeof row[item.id] === 'object' &&
                                row[item.id]['color'] != null
                                    ? classes[
                                          'tableCellContent' + row[item.id]['color'].toUpperCase()
                                      ]
                                    : null
                            ].join(' ')}
                            key={`${outerIndex} ${index} co`}
                        >
                            {dataRenderer(row, item)}
                        </TableCell>
                    ) : (
                        <TableCell
                            className={classes.tableCell}
                            key={`${outerIndex} ${index} codex`}
                        >
                            {row['collapse'] ? (
                                <IconButton
                                    color="inherit"
                                    aria-label="expand row"
                                    size="small"
                                    onClick={() => setOpenRow(!openRow)}
                                >
                                    {openRow ? (
                                        <KeyboardArrowDownIcon
                                            color="inherit"
                                            className={classes.downIcon}
                                        />
                                    ) : (
                                        <ChevronRightIcon color="inherit" />
                                    )}
                                </IconButton>
                            ) : (
                                ''
                            )}
                            {index === 0 && data?.tableOptions?.enableBookmark ? (
                                <StarOutlinedIcon
                                    onClick={() => handleBookmark(row)}
                                    className={classes.bookmarkIcon}
                                    style={{ fill: row['bookmarked'] ? '#FFC700' : 'transparent' }}
                                />
                            ) : null}
                        </TableCell>
                    )
                )}
            </TableRow>

            <TableRow>
                <TableCell className={classes.innerTableRow} colSpan={columns.length}>
                    <Collapse in={openRow} timeout="auto" unmountOnExit>
                        <Box component="span" m={1}>
                            {row.data && row.data.title ? (
                                <Typography
                                    variant="h5"
                                    gutterBottom
                                    component="div"
                                    className={classes.fontColorContrast}
                                >
                                    {row.data.title}
                                </Typography>
                            ) : (
                                ''
                            )}
                            <Table
                                className={clsx(classes.table, classes.table1)}
                                size="small"
                                aria-label="purchases"
                            >
                                {row.data && row.data.columns ? (
                                    <EnhancedTableHead
                                        order={order}
                                        orderBy={orderBy}
                                        onRequestSort={handleRequestSort}
                                        columns={row.data.columns}
                                    />
                                ) : (
                                    ''
                                )}
                                {row.data && row.data.rows.length > 0 ? (
                                    <TableBody>
                                        {stableSort(
                                            row.data.rows,
                                            getComparator(order, orderBy)
                                        ).map((item, index) => (
                                            <CollapseRows
                                                key={row.data.columns[1]['id'] + index + 'title'}
                                                row={item}
                                                columns={row.data.columns}
                                                editMode={editMode}
                                                nestedLevel={'inner'}
                                                innerIndex={index}
                                                outerIndex={outerIndex}
                                                setData={setData}
                                                stableSort={stableSort}
                                                getComparator={getComparator}
                                                data={data}
                                            />
                                        ))}
                                    </TableBody>
                                ) : (
                                    ''
                                )}
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

function AppWidgetExpandableTable({ params, ...props }) {
    const classes = makeStyles(expandableTableStyle)();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('');
    // eslint-disable-next-line no-unused-vars
    const [trigger, setTrigger] = React.useState({});
    const [toggle, setToggle] = React.useState(false);

    const data = React.useRef(params);

    useEffect(() => {
        data.current = params;
        setToggle(!toggle);
    }, [params]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const setData = (newRows) => {
        data.current.rows = newRows;
        setTrigger({});
    };

    function descendingComparator(a, b, orderBy) {
        let aValue = a[orderBy];
        let bValue = b[orderBy];
        if (!isNaN(parseFloat(a[orderBy])) && typeof a[orderBy] !== 'number') {
            aValue = parseFloat(a[orderBy].replace(/,/g, ''));
        }
        if (!isNaN(parseFloat(b[orderBy])) && typeof b[orderBy] !== 'number') {
            bValue = parseFloat(b[orderBy].replace(/,/g, ''));
        }
        if (typeof aValue === 'object' && aValue.value != null) {
            if (aValue.replace) {
                aValue = parseFloat(aValue['value'].replace(/[^\d.-]/g, ''));
            } else {
                if (!isNaN(parseFloat(aValue.value))) {
                    aValue = parseFloat(aValue.value);
                } else {
                    aValue = aValue.value;
                }
            }
        }
        if (typeof bValue === 'object' && bValue.value != null) {
            if (bValue.replace) {
                bValue = parseFloat(bValue['value'].replace(/[^\d.-]/g, ''));
            } else {
                if (!isNaN(parseFloat(bValue.value))) {
                    bValue = parseFloat(bValue.value);
                } else {
                    bValue = bValue.value;
                }
            }
        }
        if (bValue < aValue) {
            return -1;
        }
        if (bValue > aValue) {
            return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }
    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }
    function handleOuterActionClick(name) {
        props.onOuterAction &&
            props.onOuterAction(
                {
                    actionName: name,
                    tableProps: {
                        ...data.current
                    }
                },
                false
            );
    }

    return (
        <ThemeProvider theme={theme}>
            <TableContainer className={classes.container}>
                <Table
                    aria-label="collapsible table"
                    stickyHeader
                    className={classes.table}
                    size="small"
                >
                    <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        columns={data.current?.columns}
                    />
                    <TableBody>
                        {stableSort(data.current?.rows, getComparator(order, orderBy)).map(
                            (row, index) => (
                                <CollapseRows
                                    key={data.current?.columns[1]['id'] + index + 'collapseRows'}
                                    row={row}
                                    columns={data.current?.columns}
                                    editMode={data.current?.editorMode}
                                    stableSort={stableSort}
                                    getComparator={getComparator}
                                    nestedLevel={'outer'}
                                    outerIndex={index}
                                    setData={setData}
                                    data={data.current}
                                    toggle={toggle}
                                />
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box width="100%" display="flex" flexWrap="wrap" gridGap="1rem" padding="1.5rem 0">
                {data.current.tableOptions?.outerActions?.map((el, index) => {
                    if (el) {
                        const { text, name = el, ...props } = typeof el === 'string' ? {} : el;
                        return (
                            <Button
                                size="small"
                                variant="outlined"
                                key={name}
                                {...props}
                                className={classes.actionButton}
                                onClick={() => handleOuterActionClick(name)}
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
        </ThemeProvider>
    );
}

AppWidgetExpandableTable.propTypes = {
    params: PropTypes.object.isRequired
};

export default AppWidgetExpandableTable;
