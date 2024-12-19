import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    Collapse,
    IconButton,
    Input,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    Toolbar,
    Typography,
    Box,
    InputAdornment
} from '@material-ui/core';
import { alpha, makeStyles } from '@material-ui/core/styles';
import {
    KeyboardArrowDown,
    KeyboardArrowUp,
    AddBox,
    IndeterminateCheckBox
} from '@material-ui/icons';
import MultiSelectPopupMenu from 'components/MultiSelectPopupMenu';
import clsx from 'clsx';
import ToggleButtonSwitch from 'components/custom/CodxToggleButtonSwitch';
import InfoPopper from 'components/porblemDefinitionFramework/create/InfoPopper';

// const _ = require('underscore');
const deepClone = (d) => d && JSON.parse(JSON.stringify(d));

const useStyles = makeStyles((theme) => ({
    paper: {
        width: '100%'
    },
    tableContainer: (props) => ({
        '&::-webkit-scrollbar': {
            height: props?.scrollbarHeight,
            width: props?.scrollbarWidth
        }
    }),
    table: {
        borderSpacing: 0,
        borderCollapse: 'collapse',
        '& .MuiTableCell-root': {
            borderBottom: `none !important`,
            padding: '10px',
            '&:last-child': {
                borderBottom: `1px solid ${alpha(theme.palette.text.titleText, 0.1)} !important`
            }
        }
    },
    fullBorder: {
        '& .MuiTableCell-root': {
            border: `1px solid ${alpha(theme.palette.text.titleText, 0.1)}`
        }
    },
    tableCell: {
        fontSize: '1.3rem',
        color: theme.palette.text.titleText,
        [theme.breakpoints.down('sm')]: {
            minHeight: '18px',
            minWidth: '32px'
        },
        border: `1px solid ${alpha(theme.palette.text.titleText, 0.1)}`
    },
    collapsibleRows: {
        '& .MuiCollapse-wrapperInner': {}
    },
    iconButton: {
        display: 'inline-block',
        marginLeft: '10px',
        '& .MuiIconButton-label': {
            '&:hover': {
                cursor: 'pointer'
            }
        }
    },
    inputBox: {
        '&&&:before': {
            borderBottom: 'none'
        },
        '& input': {
            backgroundColor: theme.palette.background.paper,
            textAlign: 'center',
            fontSize: '1.3rem',
            cursor: 'pointer',
            border: 'none'
        },
        '&.MuiInput-root': {
            margin: '0.1rem'
        },
        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0
        },
        '&.MuiInputBase-root': {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.primary.contrastText,
            textAlign: 'center',
            fontSize: '1.6rem',
            border: 'none'
        }
    },
    adornments: (props) => ({
        '&.MuiInputAdornment-positionEnd': {
            position: 'absolute',
            right: props?.positionRight,
            textAlign: 'center'
        },
        '& .MuiTypography-root': {
            fontSize: props?.fontSize,
            color: props?.color,
            backgroundColor: props?.backgroundColor,
            fontStyle: props?.fontStyle,
            fontWeight: props?.fontWeight
        },
        '&.MuiInputAdornment-positionStart': {
            position: 'absolute',
            left: props.positionLeft,
            textAlign: 'center'
        }
    }),
    valueContainer: {
        display: 'flex',
        alignItems: 'center',
        '& .MuiIconButton-label': {
            '&:hover': {
                cursor: 'pointer'
            }
        }
    },
    stickyLeft: {
        position: 'sticky',
        left: 0,
        right: 'unset'
    },
    stickyRight: {
        position: 'sticky',
        right: 0,
        left: 'unset'
    },
    stickyCol: {
        backdropFilter: 'blur(30px)'
    },
    toolBar: {
        background: theme.palette.primary.light,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        flex: 1,
        borderRadius: '4px 4px 0 0',
        minHeight: 0,
        padding: theme.spacing(1, 1, 0.5, 2)
    },
    toggleButtonLabel: {
        fontSize: '1.2rem'
    },
    toggleButton: {
        '& .MuiToggleButtonGroup-grouped': {
            fontSize: '1rem'
        }
    },
    infoIconPaper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    helperInfoIcon: (props) => ({
        color: props?.color + ' !important',
        fontSize: props?.fontSize + ' !important'
    })
}));

function initializeVariables(toolBarOptions, columns) {
    let excludeColumnsInFilter = [];
    let defaultSelectedColsOnExpand = [];

    if (toolBarOptions?.filterDropdownSwitch?.excludeColumnsInFilter) {
        excludeColumnsInFilter = toolBarOptions?.filterDropdownSwitch?.excludeColumnsInFilter;
    }

    if (toolBarOptions?.filterDropdownSwitch?.defaultSelectedColsOnExpand) {
        defaultSelectedColsOnExpand =
            toolBarOptions?.filterDropdownSwitch?.defaultSelectedColsOnExpand;
    }

    let initialColList = [...columns].reduce(
        (acc, curr) =>
            curr?.group
                ? curr?.groupOptions?.allowGroupCollapsing && !curr?.groupOptions?.expanded
                    ? [
                          ...acc,
                          {
                              ...curr,
                              group: curr.group.filter(
                                  (el) => el?.groupOptions?.hidden !== 'parentcollapsed'
                              )
                          }
                      ]
                    : [...acc, curr]
                : [...acc, curr],
        []
    );

    let initialColGrps = [...columns].reduce(
        (acc, curr) =>
            curr?.group
                ? curr?.groupOptions?.allowGroupCollapsing && !curr?.groupOptions?.expanded
                    ? [
                          ...acc,
                          ...curr.group.filter(
                              (el) => el?.groupOptions?.hidden !== 'parentcollapsed'
                          )
                      ]
                    : [...acc, ...curr.group]
                : [...acc, curr],
        []
    );

    return [excludeColumnsInFilter, defaultSelectedColsOnExpand, initialColList, initialColGrps];
}

function TableToolBar({
    toolBarOptions,
    classes,
    columns,
    onChangeFilterMenu,
    columnGroup,
    onClickToggleButton,
    defaultSelectedColsOnExpand,
    selectedColumns,
    excludeColumnsInFilter
}) {
    if (toolBarOptions?.suppressToolBar) {
        return null;
    }
    return (
        <Toolbar className={classes.toolBar}>
            {toolBarOptions?.tableTitle ? (
                <Typography
                    className={classes.defaultColor}
                    variant="h4"
                    style={{ ...toolBarOptions?.tableTitleStyle }}
                >
                    {toolBarOptions?.tableTitle}
                </Typography>
            ) : null}
            <Box flex={1} />

            {toolBarOptions?.toggleButtonOptions ? (
                <>
                    <ToggleButtonSwitch
                        classes={{
                            toolBarText: classes.toggleButtonLabel,
                            toggleButton: classes.toggleButton
                        }}
                        elementProps={toolBarOptions?.toggleButtonOptions}
                        onChange={onClickToggleButton}
                    />
                </>
            ) : null}

            {toolBarOptions?.filterDropdownSwitch ? (
                <>
                    <MultiSelectPopupMenu
                        columns={columns}
                        onChangeFilterMenu={onChangeFilterMenu}
                        defaultSelectedColsOnExpand={defaultSelectedColsOnExpand}
                        selectedColumns={selectedColumns}
                        type={'collapsible-table'}
                        excludeColumnsInFilter={excludeColumnsInFilter}
                        menuMaxWidth={
                            toolBarOptions.filterDropdownSwitch?.menuMaxWidth
                                ? toolBarOptions.filterDropdownSwitch.menuMaxWidth
                                : toolBarOptions.filterDropdownSwitch?.menuModel
                                ? '200ch'
                                : '35ch'
                        }
                        menuModel={
                            toolBarOptions.filterDropdownSwitch?.menuModel
                                ? toolBarOptions.filterDropdownSwitch.menuModel
                                : 'defaultMenu'
                        }
                        menuHeight={
                            toolBarOptions.filterDropdownSwitch?.menuHeight
                                ? toolBarOptions.filterDropdownSwitch.menuHeight
                                : 48
                        }
                        columnGroup={columnGroup}
                    />
                </>
            ) : null}
        </Toolbar>
    );
}

const EnhancedColumnCell = ({
    data,
    classes,
    handleColumnCollapse,
    onAddStickyColData,
    columnList,
    extraParams,
    ...props
}) => {
    const cellRef = useRef();
    const triggerIconStyles = useStyles({
        color: data.infoPopper?.color,
        fontSize: data.infoPopper?.fontSize
    });
    const sticky = data?.sticky;
    const [stickyStyle, setStickyStyle] = useState({});
    const colId = data?.key;
    const stickyVertical = extraParams?.stickyHeader;

    useEffect(() => {
        if (sticky && cellRef.current) {
            let found = false;
            const stickycols = [
                ...cellRef.current.parentElement.querySelectorAll('.sticky-left-col')
            ];
            let offset = stickycols.reduce((len, el) => {
                if (found || el === cellRef.current) {
                    found = true;
                    return len;
                } else {
                    // console.log(el.getBoundingClientRect()['width'], rightToSticky.getBoundingClientRect())
                    return len + el.offsetWidth;
                }
            }, 0);
            onAddStickyColData && onAddStickyColData({ [colId]: offset });
            const stickyStyle = {
                position: 'sticky',
                left: offset,
                zIndex: 3
            };
            setStickyStyle(stickyStyle);
        }
    }, [onAddStickyColData, sticky, colId, columnList]);
    return (
        <TableCell
            className={clsx(
                classes.tableCell,
                sticky && 'sticky-left-col',
                sticky && classes.stickyCol
            )}
            colSpan={props?.colSpan}
            align={data?.align || 'center'}
            ref={cellRef}
            style={{
                backgroundColor: data && data?.BgColor,
                minWidth: data?.width,
                width: data?.width,
                color: data && data?.color,
                fontSize: data && data?.fontSize,
                top: stickyVertical ? cellRef.current?.parentElement?.offsetTop : {},
                ...stickyStyle
            }}
        >
            {data?.label}
            {data?.infoPopper ? (
                <IconButton
                    color="inherit"
                    aria-label="info icon"
                    edge="end"
                    size={data.infoPopper?.size || 'small'}
                    disableRipple={true}
                    disableFocusRipple={true}
                    style={{
                        marginLeft: data.infoPopper?.marginLeft,
                        marginRight: data.infoPopper?.marginLeft
                    }}
                >
                    <InfoPopper
                        title={data.infoPopper?.title}
                        desc={data.infoPopper?.desc}
                        minHeight={data.infoPopper?.minHeight}
                        classes={{
                            paper: classes.infoIconPaper,
                            triggerIcon: triggerIconStyles.helperInfoIcon
                        }}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    />
                </IconButton>
            ) : null}
            {data?.groupOptions?.allowGroupCollapsing ? (
                <IconButton
                    color="inherit"
                    aria-label="expand collapse columns"
                    edge="end"
                    size="medium"
                    disableRipple
                    className={classes.iconButton}
                    onClick={() => {
                        handleColumnCollapse(data, data?.groupOptions?.expanded);
                    }}
                >
                    {data?.groupOptions?.expanded ? (
                        <IndeterminateCheckBox
                            color="inherit"
                            style={{ color: data?.groupOptions?.iconColor }}
                        />
                    ) : (
                        <AddBox color="inherit" style={{ color: data?.groupOptions?.iconColor }} />
                    )}
                </IconButton>
            ) : (
                ''
            )}
        </TableCell>
    );
};

const EnhancedTableCell = ({
    item,
    row,
    type,
    classes,
    index,
    onExpand,
    currentLevel,
    levels,
    openRow,
    onValueChange,
    rowKey,
    rowIndex,
    sticky,
    stickyColData,
    topDownIndex
}) => {
    const adornmentStyle = useStyles(row[`${item.key}Params`]?.adornment);
    const [value, setValue] = useState(row[item.key]);

    const handleValueChange = useCallback(
        (e) => {
            if (item.valueType == 'percentage') {
                //updating respective cols with calculated value
                let priceValue = (row[item.UpdateColNames[0]] * (1 + e.target.value / 100)).toFixed(
                    2
                );
                row[item.UpdateColNames[1]] = parseFloat(priceValue);
            }

            if (item.valueType == 'AbsolutePrice') {
                //updating respective cols with calculated value
                let percentageValue =
                    ((e.target.value - row[item.UpdateColNames[0]]) / row[item.UpdateColNames[0]]) *
                    100;
                row[item.UpdateColNames[1]] = Math.round(percentageValue);
            }
            setValue(e.target.value);
        },
        [onValueChange]
    );
    let stickyStyle;
    if (sticky) {
        stickyStyle = {
            position: 'sticky',
            left: stickyColData[item.key],
            zIndex: 1
        };
    }

    switch (type) {
        case 'input':
            return (
                <TableCell
                    className={clsx(classes.tableCell, sticky && classes.stickyCol)}
                    align={row[`${item.key}Params`]?.align}
                    width={item?.width}
                    style={{
                        position: 'relative',
                        backgroundColor: item && row[`${item.key}Params`]?.BgColor,
                        minWidth: sticky && item?.width,
                        color: item && row[`${item.key}Params`]?.color,
                        overflow: 'hidden',
                        padding: (item && row[`${item.key}Params`]?.padding) || 0,
                        margin: (item && row[`${item.key}Params`]?.margin) || 0,
                        textDecoration: item && row[`${item.key}Params`]?.textDecoration,
                        ...stickyStyle
                    }}
                    key={row[item.key] + index + 'co'}
                >
                    <Input
                        className={classes.inputBox}
                        inputProps={{
                            style: {
                                backgroundColor: item && row[`${item.key}Params`]?.BgColor,
                                fontSize: (item && row[`${item.key}Params`]?.fontSize) || '1.2rem',
                                color: item && row[`${item.key}Params`]?.color,
                                width: item && row[`${item.key}Params`]?.inputWidth,
                                borderBottom: item && row[`${item.key}Params`]?.borderBottom,
                                fontStyle: item && row[`${item.key}Params`]?.fontStyle,
                                fontWeight: item && row[`${item.key}Params`]?.fontWeight
                            }
                        }}
                        endAdornment={
                            item && row[`${item.key}Params`]?.adornment?.position === 'end' ? (
                                <InputAdornment
                                    position="end"
                                    className={adornmentStyle.adornments}
                                >
                                    {row[`${item.key}Params`]?.adornment?.icon}
                                </InputAdornment>
                            ) : null
                        }
                        startAdornment={
                            item && row[`${item.key}Params`]?.adornment?.position === 'start' ? (
                                <InputAdornment
                                    position="start"
                                    className={adornmentStyle.adornments}
                                >
                                    {row[`${item.key}Params`]?.adornment?.icon}
                                </InputAdornment>
                            ) : null
                        }
                        defaultValue={row[item.key]}
                        value={value}
                        onChange={(e) => handleValueChange(e, rowKey)}
                        onBlur={(e) => {
                            onValueChange(
                                e.target.value,
                                rowKey,
                                item,
                                rowIndex,
                                row,
                                topDownIndex
                            );
                        }}
                        disableUnderline={true}
                        disabled={item && row[`${item.key}Params`]?.disabled}
                        type={(item && row[`${item.key}Params`]?.inputType) || 'text'}
                    />
                </TableCell>
            );

        default:
            return (
                <TableCell
                    className={clsx(classes.tableCell, sticky && classes.stickyCol)}
                    width={item?.width}
                    align={row[`${item.key}Params`]?.align}
                    style={{
                        position: 'relative',
                        backgroundColor: item && row[`${item.key}Params`]?.BgColor,
                        minWidth: item?.width,
                        color: item && row[`${item.key}Params`]?.color,
                        fontSize: item && row[`${item.key}Params`]?.fontSize,
                        textDecoration: item && row[`${item.key}Params`]?.textDecoration,
                        fontStyle: item && row[`${item.key}Params`]?.fontStyle,
                        fontWeight: item && row[`${item.key}Params`]?.fontWeight,
                        ...stickyStyle
                    }}
                    key={row[item.key] + index + 'co'}
                >
                    <div
                        className={classes.valueContainer}
                        style={{
                            gap: row[`${item.key}Params`]?.gap,
                            justifyContent:
                                row[`${item.key}Params`]?.align === 'right'
                                    ? 'flex-end'
                                    : row[`${item.key}Params`]?.align === 'center'
                                    ? 'center'
                                    : 'flex-start'
                        }}
                    >
                        {item?.dataType == 'expand' && currentLevel != levels ? (
                            <IconButton
                                color="inherit"
                                aria-label="expand row"
                                size="small"
                                onClick={onExpand}
                            >
                                {openRow ? (
                                    <KeyboardArrowUp
                                        color="inherit"
                                        style={{ color: row[`${item.key}Params`]?.iconColor }}
                                    />
                                ) : (
                                    <KeyboardArrowDown
                                        color="inherit"
                                        style={{ color: row[`${item.key}Params`]?.iconColor }}
                                    />
                                )}
                            </IconButton>
                        ) : (
                            ''
                        )}
                        {row[`${item.key}Params`]?.startSymbol ? (
                            <div>{row[`${item.key}Params`]?.startSymbol}</div>
                        ) : null}
                        <div>{row[item.key]}</div>
                        {row[`${item.key}Params`]?.endSymbol ? (
                            <div>{row[`${item.key}Params`]?.endSymbol}</div>
                        ) : null}
                    </div>
                </TableCell>
            );
    }
};

const CollapsibleRows = ({
    row,
    rows,
    columns,
    classes,
    levels,
    currentLevel,
    currIndex,
    onValueChange,
    rowKey,
    rowIndex,
    stickyColData,
    onRowDataChange,
    rowMapping,
    topDownIndex
}) => {
    const colList = columns.reduce(
        (acc, curr) => (curr?.group ? [...acc, ...curr.group] : [...acc, curr]),
        []
    );
    const [openRow, setOpenRow] = useState(row?.isExpanded);

    const handleRowExpand = useCallback(() => {
        row['isExpanded'] = !openRow;
        rows[rowKey][topDownIndex] = row;
        setOpenRow(!openRow);
        onRowDataChange(rows);
    }, [rowKey, topDownIndex, openRow]);

    return (
        <React.Fragment>
            <TableRow>
                {colList.map((colEle, index) => (
                    <EnhancedTableCell
                        key={`tableCell-${index}-${row[colEle.key]}`}
                        item={colEle}
                        row={row}
                        type={colEle?.dataType}
                        classes={classes}
                        index={index}
                        currentLevel={currentLevel}
                        levels={levels}
                        onExpand={handleRowExpand}
                        openRow={openRow}
                        onValueChange={onValueChange}
                        rowKey={rowKey}
                        rowIndex={rowIndex}
                        sticky={colEle?.sticky}
                        stickyColData={stickyColData}
                        topDownIndex={topDownIndex}
                    />
                ))}
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}
                    colSpan={colList.length}
                >
                    <Collapse
                        in={openRow}
                        timeout="auto"
                        unmountOnExit
                        className={classes.collapsibleRows}
                    >
                        <Table className={classes.table} aria-label="inner collapsible table">
                            {currentLevel != levels ? (
                                <TableBody>
                                    {rows[
                                        `level${currentLevel + 1}-${currIndex ? currIndex : 0}`
                                    ].map((rowEle, rowIndex) => (
                                        <CollapsibleRows
                                            key={`Collapse row ${currentLevel}${currIndex}${rowIndex}`}
                                            row={rowEle}
                                            rows={rows}
                                            columns={columns}
                                            levels={levels}
                                            currentLevel={currentLevel + 1}
                                            currIndex={rowEle?.childIndex || rowIndex}
                                            classes={classes}
                                            rowKey={`level${currentLevel + 1}-${
                                                currIndex ? currIndex : 0
                                            }`}
                                            rowIndex={rowEle?.childIndex || rowIndex}
                                            onValueChange={onValueChange}
                                            stickyColData={stickyColData}
                                            onRowDataChange={onRowDataChange}
                                            rowMapping={rowMapping}
                                            topDownIndex={rowIndex}
                                        />
                                    ))}
                                </TableBody>
                            ) : null}
                        </Table>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};

export default function CollapsibleTable({
    params: defaultParams,
    onRowDataChange,
    onValueChange,
    onToggleButtonClick
}) {
    const toggleButtonConfig = defaultParams?.toolBarOptions?.toggleButtonOptions;
    const { toolBarOptions, toggleOptions } = defaultParams;
    const {
        columns: defaultColParams,
        levels: defaultLevelParams,
        rows: defaultRowParams,
        extraParams
    } = toggleButtonConfig && toggleOptions
        ? toggleOptions[toggleButtonConfig.defaultValue]
        : defaultParams;

    const classes = useStyles({
        scrollbarWidth: extraParams?.scrollbarWidth,
        scrollbarHeight: extraParams?.scrollbarHeight
    });
    const [columns, setColumns] = useState([...defaultColParams]);
    const [rows, setRows] = useState({ ...defaultRowParams });
    const [levels, setLevels] = useState(defaultLevelParams);
    const [defaultColList, setDefaultColList] = useState(deepClone([...defaultColParams]));
    const [rowData, setRowData] = useState(deepClone({ ...defaultRowParams }));
    const [stickyColData, setStickyColData] = useState({});

    useEffect(() => {
        setRows({ ...defaultRowParams });
    }, [defaultRowParams]);

    let [excludeColumnsInFilter, defaultSelectedColsOnExpand, initialColList, initialColGrps] =
        initializeVariables(toolBarOptions, columns);

    const [colList, setColList] = useState(() => {
        if (defaultSelectedColsOnExpand.length > 0) {
            return [...initialColList].map((el) =>
                el.groupOptions?.allowGroupCollapsing && el.groupOptions?.expanded
                    ? {
                          ...el,
                          group: el.group.filter((el) =>
                              el.groupOptions?.hidden === 'parentcollapsed'
                                  ? defaultSelectedColsOnExpand.includes(el.headerText)
                                  : true
                          )
                      }
                    : { ...el }
            );
        }
        return [...initialColList];
    });

    const [colsExpanded, setColsExpanded] = useState(() => {
        if (defaultSelectedColsOnExpand.length > 0) {
            return [...initialColGrps].filter((el) =>
                el.groupOptions?.hidden === 'parentcollapsed'
                    ? defaultSelectedColsOnExpand.includes(el.headerText)
                    : true
            );
        }
        return [...initialColGrps];
    });

    const [defaultCols, setDefaultCols] = useState(
        excludeColumnsInFilter.length > 0
            ? initialColList.map((col) => {
                  return {
                      ...col,
                      group: col.group.filter((el) => excludeColumnsInFilter.indexOf(el.key) < 0)
                  };
              })
            : [...initialColList]
    );

    const [defaultExpandedCols, setDefaultExpandedCols] = useState(
        excludeColumnsInFilter.length > 0
            ? initialColGrps.filter((col) => excludeColumnsInFilter.indexOf(col.key) < 0)
            : [...initialColGrps]
    );

    const [deselectedFilterColumns, setDeselectedFilterColumns] = useState([]);

    const handleToggleButtonClick = (eventId, toggledValue) => {
        if (toolBarOptions.toggleButtonOptions?.withoutApiCall) {
            const { columns, levels, rows } = toggleOptions[toggledValue];
            [excludeColumnsInFilter, defaultSelectedColsOnExpand, initialColList, initialColGrps] =
                initializeVariables(toolBarOptions, columns);

            setColumns([...columns]);
            setRows({ ...rows });
            setRowData({ ...rows });
            setLevels(levels);
            setDefaultColList([...columns]);

            setColList(() => {
                if (defaultSelectedColsOnExpand.length > 0) {
                    return [...initialColList].map((el) =>
                        el.groupOptions?.allowGroupCollapsing && el.groupOptions?.expanded
                            ? {
                                  ...el,
                                  group: el.group.filter((el) =>
                                      el.groupOptions?.hidden === 'parentcollapsed'
                                          ? defaultSelectedColsOnExpand.includes(el.headerText)
                                          : true
                                  )
                              }
                            : { ...el }
                    );
                }
                return [...initialColList];
            });
            setColsExpanded(() => {
                if (defaultSelectedColsOnExpand.length > 0) {
                    return [...initialColGrps].filter((el) =>
                        el.groupOptions?.hidden === 'parentcollapsed'
                            ? defaultSelectedColsOnExpand.includes(el.headerText)
                            : true
                    );
                }
                return [...initialColGrps];
            });
            setDefaultCols(
                excludeColumnsInFilter.length > 0
                    ? initialColList.map((col) => {
                          return {
                              ...col,
                              group: col.group.filter(
                                  (el) => excludeColumnsInFilter.indexOf(el.key) < 0
                              )
                          };
                      })
                    : [...initialColList]
            );
            setDefaultExpandedCols(
                excludeColumnsInFilter.length > 0
                    ? initialColGrps.filter((col) => excludeColumnsInFilter.indexOf(col.key) < 0)
                    : [...initialColGrps]
            );

            setDeselectedFilterColumns([]);
            setStickyColData({});
        } else {
            onToggleButtonClick({
                actionType: toggleButtonConfig?.toggleActionType,
                data: { toggledValue, collapsibleTable: rowData }
            });
        }
    };

    const handleColumnCollapse = (data, expand) => {
        const changedCol = defaultColList.find((el) => el.key === data.key);
        const changedCols = changedCol.group.filter(
            (el) => el?.groupOptions?.hidden === 'parentcollapsed'
        );
        changedCol.groupOptions.expanded = !expand;

        setDeselectedFilterColumns((prevDeselectedCols) => {
            changedCols.forEach((col) => {
                let index = prevDeselectedCols.indexOf(col.headerText);
                if (index >= 0) {
                    prevDeselectedCols.splice(index, 1);
                }
            });
            return [...prevDeselectedCols];
        });
        let newColList = [...colList];
        let colGrp = changedCol.group.filter(
            (colEle) =>
                colEle?.groupOptions?.hidden !== 'parentcollapsed' &&
                deselectedFilterColumns.indexOf(colEle.headerText) === -1
        );

        if (colGrp.length === 0) {
            newColList = newColList.filter((el) => el.key !== data.key);
        } else {
            newColList = newColList.map((el) =>
                el.key === data.key
                    ? expand
                        ? {
                              ...el,
                              group: colGrp,
                              groupOptions: {
                                  ...el.groupOptions,
                                  expanded: !expand
                              }
                          }
                        : {
                              ...changedCol,
                              group: changedCol.group.filter(
                                  (colEle) =>
                                      deselectedFilterColumns.indexOf(colEle.headerText) === -1
                              )
                          }
                    : el
            );
        }
        const newColsExpanded = [...newColList].reduce(
            (acc, curr) =>
                curr?.group
                    ? curr?.groupOptions?.allowGroupCollapsing && !curr?.groupOptions?.expanded
                        ? [
                              ...acc,
                              ...curr.group.filter(
                                  (el) => el?.groupOptions?.hidden !== 'parentcollapsed'
                              )
                          ]
                        : [...acc, ...curr.group]
                    : [...acc, curr],
            []
        );

        setColList(
            defaultSelectedColsOnExpand.length > 0
                ? [...newColList].map((el) =>
                      el.key === changedCol.key
                          ? {
                                ...el,
                                group: el.group.filter((col) =>
                                    changedCols.find((s) => s.headerText === col.headerText)
                                        ? defaultSelectedColsOnExpand.includes(col.headerText)
                                        : true
                                )
                            }
                          : { ...el }
                  )
                : [...newColList]
        );

        setColsExpanded(
            defaultSelectedColsOnExpand.length > 0
                ? [...newColsExpanded].filter((el) =>
                      changedCols.find((col) => col.headerText === el.headerText)
                          ? defaultSelectedColsOnExpand.includes(el.headerText)
                          : true
                  )
                : [...newColsExpanded]
        );

        if (defaultSelectedColsOnExpand.length > 0) {
            setDeselectedFilterColumns((prevDeselectedCols) => [
                ...prevDeselectedCols,
                ...changedCols.reduce(
                    (acc, curr) =>
                        defaultSelectedColsOnExpand.includes(curr.headerText)
                            ? [...acc]
                            : [...acc, curr.headerText],
                    []
                )
            ]);
        }

        // if expand -> get list of columns to be added else list of columns to be removed
        if (toolBarOptions?.filterDropdownSwitch) {
            if (changedCol.groupOptions.expanded) {
                let allColsIndex = 0;
                let newDefaultExpandedList;
                for (
                    let newSelectedIndex = 0;
                    newSelectedIndex < defaultExpandedCols.length;
                    newSelectedIndex++
                ) {
                    while (excludeColumnsInFilter.indexOf(newColsExpanded[allColsIndex].key) > -1) {
                        allColsIndex++;
                    }
                    if (
                        deselectedFilterColumns.indexOf(
                            defaultExpandedCols[newSelectedIndex].headerText
                        ) > -1
                    ) {
                        continue;
                    }
                    if (
                        newColsExpanded[allColsIndex].key ===
                        defaultExpandedCols[newSelectedIndex].key
                    ) {
                        allColsIndex++;
                    } else if (
                        defaultExpandedCols[newSelectedIndex].key !==
                            newColsExpanded[allColsIndex].key &&
                        changedCols.find((el) => el.key === newColsExpanded[allColsIndex].key)
                    ) {
                        newDefaultExpandedList = defaultExpandedCols
                            .slice(0, newSelectedIndex)
                            .concat(changedCols, defaultExpandedCols.slice(newSelectedIndex));
                        break;
                    }
                }
                newDefaultExpandedList && setDefaultExpandedCols([...newDefaultExpandedList]);
            } else {
                setDefaultExpandedCols((prevExpandedCols) =>
                    [...prevExpandedCols].filter(
                        (el) => !changedCols.find((col) => col.key === el.key)
                    )
                );
            }
            setDefaultColList([...defaultColList]);
            setDefaultCols(
                excludeColumnsInFilter.length > 0
                    ? newColList.map((col) => {
                          return {
                              ...col,
                              group: col.group.filter(
                                  (el) => excludeColumnsInFilter.indexOf(el.key) < 0
                              )
                          };
                      })
                    : [...newColList]
            );
        }
    };

    const handleSetRows = useCallback(
        (rows) => {
            setRowData(rows);
            onRowDataChange && onRowDataChange(rows);
        },
        [onRowDataChange]
    );

    const handleStickyColData = useCallback((data) => {
        setStickyColData((s) => ({ ...s, ...data }));
    }, []);

    const handleFilteredColumns = useCallback(
        (selectedColumnsFromMenu, columns) => {
            let newColsExpanded = [];
            let newColsList = [...defaultColList];

            for (let index = 0; index < defaultColList.length; index++) {
                for (let colGrp of defaultColList[index].group) {
                    if (excludeColumnsInFilter.indexOf(colGrp.key) > -1) {
                        newColsExpanded.push(colGrp);
                        selectedColumnsFromMenu.push(colGrp.headerText);
                    } else {
                        let selectedCol = columns.filter((el) => el.key == colGrp.key);
                        if (selectedCol.length > 0) {
                            newColsExpanded.push(...selectedCol);
                        }
                    }
                }
            }

            const matches = newColsExpanded.filter((item) => {
                return selectedColumnsFromMenu.indexOf(item.headerText) > -1;
            });

            if (matches.length >= excludeColumnsInFilter.length && matches.length > 0) {
                newColsList = newColsList.reduce((acc, curr) => {
                    if (curr.group) {
                        const groupCols = curr.group.filter(
                            (el) => selectedColumnsFromMenu.indexOf(el.headerText) > -1
                        );
                        if (groupCols.length) return [...acc, { ...curr, group: groupCols }];
                        return acc;
                    }
                    return selectedColumnsFromMenu.indexOf(curr.headerText) > -1
                        ? [...acc, curr]
                        : acc;
                }, []);
                const deselctedCols = columns.reduce(
                    (acc, curr) =>
                        selectedColumnsFromMenu.indexOf(curr.headerText) === -1
                            ? [curr.headerText, ...acc]
                            : acc,
                    []
                );
                setDeselectedFilterColumns([...deselctedCols]);
                setColList([...newColsList]);
                setColsExpanded([...matches]);
            } else {
                setDeselectedFilterColumns([]);
                setColList(
                    [...newColsList].reduce(
                        (acc, curr) =>
                            curr.group
                                ? curr.groupOptions?.allowGroupCollapsing &&
                                  !curr.groupOptions?.expanded
                                    ? [
                                          ...acc,
                                          {
                                              ...curr,
                                              group: curr.group.filter(
                                                  (el) =>
                                                      el.groupOptions?.hidden !== 'parentcollapsed'
                                              )
                                          }
                                      ]
                                    : [...acc, curr]
                                : [...acc, curr],
                        []
                    )
                );
                setColsExpanded([...newColsExpanded]);
            }

            selectedColumnsFromMenu.splice(
                selectedColumnsFromMenu.length - excludeColumnsInFilter.length,
                excludeColumnsInFilter.length
            );
        },
        [columns]
    );

    // const handleFilteredColumns = ()=>{

    // }

    const handleValueChange = useCallback(
        async (value, rowKey, colData, rowIndex, row, topDownIndex) => {
            let valueToUpdate = value;
            row[colData.key] = value;
            let newRows = { ...rowData };
            const rowMapping = defaultParams.rowMapping;
            newRows[rowKey][topDownIndex] = row;
            if (colData?.syncUpdate) {
                if (colData?.valueType == 'AbsolutePrice') {
                    //updating respective cols with calculated percentage value
                    // getting the percentage from absolute and updating that in lower cols
                    let percentageValue =
                        ((value - row[colData.UpdateColNames[0]]) /
                            row[colData.UpdateColNames[0]]) *
                        100;
                    valueToUpdate = Math.round(percentageValue);
                    row[colData.UpdateColNames[1]] = valueToUpdate;
                    colData = colData?.syncPercentageForAbsolute;
                    newRows[rowKey][topDownIndex] = row;
                }

                // function to update all rows inside a level
                let updateTopDownRowData = function (key) {
                    for (let val of newRows[key]) {
                        if (val && !val[`${colData.key}Params`]?.disabled) {
                            val[colData.key] = valueToUpdate;
                            //updating respective cols with calculated value
                            let priceValue = (
                                val[colData.UpdateColNames[0]] *
                                (1 + valueToUpdate / 100)
                            ).toFixed(2);
                            val[colData.UpdateColNames[1]] = parseFloat(priceValue);
                        }
                    }
                };

                // function to iterate over all levels and child levels inside them
                let iterall = function (index) {
                    if (!rowMapping[index]) {
                        return;
                    }
                    if (newRows[index]) updateTopDownRowData(index);
                    for (let key of rowMapping[index]) {
                        updateTopDownRowData(key);
                        iterall(key);
                    }
                    return;
                };
                const level = Number(rowKey.split(/level|-/)[1]) + 1;
                const inputRowKey = `level${level}-${rowIndex}`;
                if (level === 4) {
                    updateTopDownRowData(inputRowKey);
                } else {
                    iterall(inputRowKey);
                }
            }
            handleSetRows({ ...newRows });
            onValueChange && onValueChange(newRows);
        },
        [rowData, onValueChange, handleSetRows]
    );

    return (
        <Paper className={classes.paper}>
            <TableToolBar
                classes={classes}
                columns={defaultExpandedCols}
                columnGroup={defaultCols}
                selectedColumns={colsExpanded}
                excludeColumnsInFilter={excludeColumnsInFilter}
                defaultSelectedColsOnExpand={defaultSelectedColsOnExpand}
                toolBarOptions={toolBarOptions}
                onChangeFilterMenu={handleFilteredColumns}
                onClickToggleButton={handleToggleButtonClick}
            />
            <TableContainer
                className={classes.tableContainer}
                style={{
                    maxHeight: extraParams?.maxHeight,
                    overflow: 'auto',
                    scrollbarWidth: '2rem'
                }}
            >
                <Table className={clsx(classes.table)} stickyHeader={extraParams?.stickyHeader}>
                    <TableHead>
                        <TableRow>
                            {!extraParams?.noGroupHeaders
                                ? colList.map((col, colIndex) =>
                                      col?.group ? (
                                          <EnhancedColumnCell
                                              key={`tableColumCell-group-${col.headerText}-${col.key}-${colIndex}`}
                                              data={{ ...col, label: col.headerText, ...col }}
                                              classes={classes}
                                              colSpan={col.group.length}
                                              handleColumnCollapse={handleColumnCollapse}
                                              columnList={colList}
                                              onAddStickyColData={handleStickyColData}
                                              extraParams={extraParams}
                                          />
                                      ) : (
                                          <EnhancedColumnCell
                                              key={`tableColumCell-${col.headerText}-${col.key}-${colIndex}`}
                                              data={{ ...col, label: '' }}
                                              classes={classes}
                                              columnList={colList}
                                              onAddStickyColData={handleStickyColData}
                                              extraParams={extraParams}
                                          />
                                      )
                                  )
                                : null}
                        </TableRow>
                        <TableRow>
                            {colList.map((col, colIndex) =>
                                col?.group ? (
                                    col.group.map((el, innerColIdx) =>
                                        col.groupOptions?.allowGroupCollapsing &&
                                        !col?.groupOptions?.expanded &&
                                        el?.groupOptions?.hidden === 'parentcollapsed' ? null : (
                                            <EnhancedColumnCell
                                                data={{ ...el, label: el.headerText }}
                                                classes={classes}
                                                key={`group-col-${colIndex}-${innerColIdx}-${el.headerText}`}
                                                onAddStickyColData={handleStickyColData}
                                                extraParams={extraParams}
                                            />
                                        )
                                    )
                                ) : (
                                    <EnhancedColumnCell
                                        data={{ ...col, label: col.headerText }}
                                        classes={classes}
                                        key={`col-${colIndex}-${col.headerText}`}
                                        onAddStickyColData={handleStickyColData}
                                        extraParams={extraParams}
                                    />
                                )
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {levels &&
                            rows['level1']?.map((parentRow, parentRowIndex) => (
                                <CollapsibleRows
                                    key={parentRowIndex + 'toplevelRow'}
                                    row={parentRow}
                                    rows={rows}
                                    columns={colsExpanded}
                                    classes={classes}
                                    levels={levels}
                                    currentLevel={1}
                                    rowMapping={defaultParams?.rowMapping}
                                    currIndex={parentRowIndex}
                                    onRowDataChange={handleSetRows}
                                    onValueChange={handleValueChange}
                                    rowKey={'level1'}
                                    rowIndex={parentRowIndex}
                                    stickyColData={stickyColData}
                                    topDownIndex={parentRowIndex}
                                />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
