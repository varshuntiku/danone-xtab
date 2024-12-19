import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import {
    alpha,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography
} from '@material-ui/core';

import ActionButtons from '../dynamic-form/inputFields/ActionButtons';
import { red } from '@material-ui/core/colors';
import TextInput from '../dynamic-form/inputFields/textInput';
import CodxAccordion from '../custom/CodxAccordion.jsx';
import { getDeepValue } from '../../util';
import clsx from 'clsx';

import { triggerWidgetActionHandler } from 'services/widget.js';
import { TextList } from '../screenActionsComponent/actionComponents/TextList';
import { useDebouncedCallback } from '../../hooks/useDebounceCallback';
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& .MuiAccordion-root': {
            '&:hover': {
                opacity: 1,
                backgroundColor: 'none'
            }
        }
    },
    rootSection: {
        marginBottom: '2rem',
        '&:before': {
            height: 0
        }
    },
    rootSectionSummary: {
        background: theme.palette.primary.light,
        border: `1px solid ${alpha(theme.palette.text.default, 0.4)}`,
        color: theme.palette.text.default,
        position: 'sticky',
        top: 0,
        zIndex: 3
    },
    rootSectionDetails: {
        paddingTop: '1rem',
        paddingBottom: '1rem',
        paddingRight: '1rem',
        marginBottom: '2rem',
        border: `1px solid ${alpha(theme.palette.text.default, 0.2)}`,
        borderTop: 0,
        flexDirection: 'column'
    },
    accordionHeaderName: {
        color: theme.palette.text.default,
        fontWeight: 500
    },
    accordionRoot: {
        '&:before': {
            height: 0
        }
    },
    accordionSummary: {
        borderTop: `1px solid ${alpha(theme.palette.text.default, 0.4)}`,
        background: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.background.hover
        }
    },
    accordionDetails: {
        paddingTop: '1rem',
        paddingBottom: '1rem'
    },
    confirmationError: {
        top: '-12px',
        position: 'relative',
        width: '100%',
        fontSize: '1.4rem',
        color: red[500]
    },
    defaultColor: {
        color: theme.palette.text.default
    },
    actionsStyle: {
        postion: 'relative',
        overflow: 'hidden',
        paddingLeft: '24px !important',
        paddingRight: '24px !important'
    },
    paper: {
        width: '100%'
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
    z1: {
        zIndex: 1
    },
    leftActionCol: {
        // boxShadow: `-1px 0px 1px 0px ${alpha("#fff", 0.4)} inset`,
        // backgroundColor: alpha(theme.palette.primary.dark, 1),
        backdropFilter: 'blur(30px)'
    },
    rightActionCol: {
        // boxShadow: `1px 0px 1px 0px ${alpha("#fff", 0.4)} inset`,
        // backgroundColor: alpha(theme.palette.primary.dark, 1)
        backdropFilter: 'blur(30px)'
    },
    table: {
        height: '100%',
        '& .MuiTableCell-root': {
            borderColor: alpha(theme.palette.text.titleText, 0.4)
        }
    },
    backgroundLight: {
        background: theme.palette.primary.light
    },
    grayColor: {
        color: theme.palette.grey[500]
    },
    font1: {
        fontSize: '1.5rem'
    },
    font2: {
        fontSize: '2rem'
    },
    tableBackground: {
        backgroundColor: theme.palette.primary.dark
    },
    iconSize: {
        '& svg': {
            width: '2rem',
            height: '2rem'
        }
    },
    tableRow: {},
    rootParentRow: {},
    childRowOdd: {
        background: theme.palette.primary.main
    },
    childEvenRow: {},
    stripeTableRow: {
        '&$rootParentRow:nth-of-type(even)': {
            background: theme.palette.primary.main
        },
        '& .MuiTableCell-root': {
            borderBottom: 'none'
        }
    },
    selectRowCheckbox: {
        marginRight: 0
    },
    selectedRow: {
        '&.MuiTableRow-root': {
            background: theme.palette.action.selected
        }
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
    paginationRoot: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
        ' & .Mui-disabled svg': {
            color: theme.palette.grey[500]
        }
    },
    paginationSelect: {
        paddingTop: '33%'
    },
    selectRoot: {
        '& svg': {
            color: theme.palette.primary.contrastText
        }
    },
    headerCellRoot: {
        verticalAlign: 'top',
        fontSize: '1.6rem',
        '& .MuiTableSortLabel-active': {
            color: theme.palette.text.default
        },
        '& .MuiTableSortLabel-root.MuiTableSortLabel-active.MuiTableSortLabel-root.MuiTableSortLabel-active .MuiTableSortLabel-icon':
            {
                color: theme.palette.text.default
            }
    },
    highlightCell: {
        background: alpha(theme.palette.primary.contrastText, 0.5)
    },
    errorCell: {
        background: alpha(red[500], 0.2)
    },
    hoverRow: {
        '&.MuiTableRow-root:hover': {
            background: `${theme.palette.action.hover} !important`,
            '& .MuiTableCell-body': {
                background: `${theme.palette.action.hover} !important`
            }
        }
    },
    highlightRow: {
        '&.MuiTableRow-root': {
            background: alpha(theme.palette.primary.contrastText, 0.2)
        }
    },
    errorRow: {
        background: alpha(red[500], 0.2),
        boxShadow: `0px 0px 0px 2px ${alpha(red[500], 0.7)} inset`
    },
    noBorderRow: {
        '& .MuiTableCell-root': {
            border: 0
        }
    },
    errorTextColor: {
        color: red[500]
    },
    draggedEle: {
        filter: 'blur(1px)'
    },
    progressBar: {
        backgroundColor: theme.palette.primary.contrastText
    },
    flash: {
        animation: '$flash 1s ease'
    },
    '@keyframes flash': {
        '50%': {
            backgroundColor: alpha(theme.palette.primary.light, 0.7)
        },
        '100%': {
            backgroundColor: 'unset'
        }
    },
    fullBorder: {
        '& .MuiTableCell-root': {
            border: `1px solid ${alpha(theme.palette.text.titleText, 0.1)}`
        }
    },
    clickable: {
        cursor: 'pointer'
    },
    noBorder: {
        border: 0
    },
    stickyCol: {
        backdropFilter: 'blur(30px)'
    },
    zoomButtons: {
        '& svg': {
            color: theme.palette.primary.contrastText
        }
    }
}));

function CustomTableHeaderCell({
    value,
    column,
    classes,
    extraClassName,
    orderBy,
    order,
    style,
    suppressBorder,
    onAddStickyColData,
    onSearch,
    onRequestSort,
    ...props
}) {
    const cellRef = useRef();
    const sticky = column?.coldef?.sticky;
    const [stickyStyle, setStickyStyle] = useState({});

    const handleSearch = useDebouncedCallback(
        (s) => {
            onSearch(s);
        },
        [],
        500
    );

    const colId = column?.id;
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
    }, [onAddStickyColData, sticky, colId]);

    return (
        <TableCell
            className={clsx(
                classes.defaultColor,
                classes.font1,
                classes.backgroundLight,
                extraClassName,
                column?.coldef?.headerClassName,
                suppressBorder ? classes.noBorder : '',
                sticky && 'sticky-left-col'
            )}
            align={column?.coldef?.align}
            sortDirection={orderBy?.id === column?.id ? order : false}
            classes={{
                root: classes.headerCellRoot
            }}
            ref={cellRef}
            colSpan={column?.coldef?.colSpan}
            rowSpan={column?.coldef?.rowSpan}
            style={{
                ...style,
                minWidth: column?.coldef?.width,
                width: column?.coldef?.width,
                [column?.coldef?.headerBgColor ? 'background' : undefined]:
                    column?.coldef?.headerBgColor,
                [column?.coldef?.headerColor ? 'color' : undefined]: column?.coldef?.headerColor,
                top: cellRef.current?.parentElement?.offsetTop,
                ...stickyStyle
            }}
            {...props}
        >
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div>
                    {column?.coldef?.sortable ? (
                        <TableSortLabel
                            active={orderBy && orderBy.id === column?.id}
                            direction={orderBy?.id === column?.id ? order : 'asc'}
                            onClick={onRequestSort}
                            classes={{
                                active: classes.defaultColor
                            }}
                        >
                            {value || column?.coldef?.headerName}
                            {column?.coldef?.asterisk ? (
                                <span
                                    style={{ color: red[500], fontWeight: 600, fontSize: '1.05em' }}
                                >
                                    &nbsp;*
                                </span>
                            ) : null}
                        </TableSortLabel>
                    ) : (
                        <Fragment>
                            {value || column?.coldef?.headerName}
                            {column?.coldef?.asterisk ? (
                                <span style={{ color: red[500] }}>&nbsp;*</span>
                            ) : null}
                        </Fragment>
                    )}
                </div>
                <div style={{ flex: 1 }}></div>

                {column?.coldef?.search ? (
                    <TextInput
                        type="text"
                        placeholder="search"
                        fieldInfo={{ placeholder: 'Search' }}
                        onChange={handleSearch}
                    />
                ) : null}
            </div>
        </TableCell>
    );
}

let nextColId = 0;
function createColumns(coldefs) {
    const len = coldefs?.length;
    return coldefs?.map((el, i) => ({
        hide: false,
        key: el?.key || el?.field,
        coldef: el,
        id: nextColId++,
        first: i === 0,
        last: i === len - 1
    }));
}

let nextRowId = 0;
function createRows(rowData, rowParamsField, parentRow = null) {
    return rowData?.map((el) => ({
        hide: false,
        selected: false,
        suppressDelete: false,
        error: false,
        highlight: false,
        highlightBgColor: null,
        suppressDuplicateRow: false,
        flashEnabled: false,
        childrenRowData: [],
        expanded: false,
        ...getDeepValue(el, rowParamsField),
        parentRowId: parentRow?.id,
        data: el,
        id: nextRowId++,
        level: parentRow ? parentRow.level + 1 : 0,
        flash: function () {
            this.flashEnabled = true;
            setTimeout(() => {
                this.flashEnabled = false;
            }, 1200);
        }
    }));
}

export default function AccordionGridTable({
    params,
    onRowDataChange,
    onAction,
    onTriggerNotification,
    ...props
}) {
    const classes = useStyles();
    const [data, setData] = useState(params);
    const { tableOptions } = params;
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [defaultScenarioName, setDefaultScenarioName] = useState(
        params.actions.find((el) => el.customAction === 'saveScenarioName').scenarioName
    );
    const [groupHeaders] = useState(() => {
        let groupHeaders = [];
        if (params.groupHeaders?.length) {
            groupHeaders = params.groupHeaders.map((cols) => createColumns(cols));
        }
        return groupHeaders;
    });
    const [rows, setRows] = useState(createRows(params.rowData, tableOptions?.rowParamsField));
    const inRowActionsEnabled =
        tableOptions?.enableInRowDelete ||
        tableOptions?.enableInRowDuplicate ||
        tableOptions?.inRowActions ||
        tableOptions?.inRowEditModeSwitch;

    const handleAction = async (e) => {
        if (e.customAction === 'saveScenarioName') {
            setOpenConfirmation(true);
            setDefaultScenarioName(e.scenarioName);
        } else {
            onTriggerNotification({
                notification: {
                    message: 'Data Reset To Default',
                    severity: 'info'
                }
            });
            try {
                const resp = await onAction({ actionType: e.name, data });
                if (resp.message) {
                    onTriggerNotification({
                        notification: {
                            message: resp.message,
                            severity: resp?.error ? 'error' : 'success'
                        }
                    });
                }
                setData((s) => ({ ...s, ...resp }));
            } catch (err) {
                /* empty */
            }
        }
    };

    const handleConfirmation = async (e) => {
        try {
            onTriggerNotification({
                notification: {
                    message: 'Request Is Being Processed',
                    severity: 'info'
                }
            });
            const resp = await onAction({
                actionType: data.actions.find((el) => el.customAction === 'saveScenarioName').name,
                data: { ...data, ...e }
            });
            if (resp.message) {
                onTriggerNotification({
                    notification: {
                        message: resp.message,
                        severity: resp?.error ? 'error' : 'success'
                    }
                });
            }
            setData((s) => ({ ...s, ...resp }));
            return resp;
        } catch (err) {
            /* empty */
        }
    };

    const [columns] = useState(createColumns(params.coldef));
    const [isIndeterminate] = useState(false);
    const [allSelected] = useState(false);
    const [order, setOrder] = React.useState();
    const [orderBy, setOrderBy] = React.useState();
    const rowsleftActionsEnabled =
        tableOptions?.multiSelectRows ||
        tableOptions?.singleSelectRows ||
        tableOptions?.enableRearrange;
    // const [setStickyColData] = useState({});

    // const handleStickyColData = useCallback((data) => {
    //     setStickyColData(s => ({ ...s, ...data }))
    // }, [])

    const handleSetRows = useCallback(
        (rows) => {
            setRows(rows);
            onRowDataChange && onRowDataChange(rows.map((el) => el.data));
        },
        [onRowDataChange]
    );

    const handleSelectAllRows = useCallback(
        (selected) => {
            rows.forEach((el) => (el.selected = selected));
            handleSetRows([...rows]);
        },
        [handleSetRows, rows]
    );

    const handleRequestSort = useCallback(
        (col) => {
            if (orderBy?.id === col?.id) {
                if (order === 'asc') {
                    setOrder('desc');
                    setOrderBy(col);
                } else {
                    setOrder(null);
                    setOrderBy(null);
                }
            } else {
                setOrder('asc');
                setOrderBy(col);
            }
        },
        [orderBy, order]
    );

    const handleAccordionTableSimulatorFetchTableData = async (params) => {
        return triggerWidgetActionHandler({
            screen_id: props.screen_id,
            app_id: props.app_id,
            payload: {
                widget_value_id: params.widget_value_id,
                action_type: params.actionType,
                data: params,
                filters: JSON.parse(
                    sessionStorage.getItem(
                        'app_screen_filter_info_' + props.app_id + '_' + props.screen_id
                    )
                )
            }
        });
    };

    return (
        <div className={classes.root}>
            <div style={{ maxHeight: data.extraParams?.maxHeight, overflow: 'auto' }}>
                <TableContainer>
                    <Table>
                        {tableOptions?.caption ? (
                            <caption>
                                {typeof tableOptions?.caption === 'object' ? (
                                    <TextList params={tableOptions?.caption} />
                                ) : (
                                    <Typography variant="h5" className={classes.defaultColor}>
                                        {tableOptions?.caption}
                                    </Typography>
                                )}
                            </caption>
                        ) : null}
                        <TableHead>
                            <TableHead className={classes.backgroundLight}>
                                {groupHeaders?.length
                                    ? groupHeaders.map((columns) => (
                                          <TableRow key={columns.id}>
                                              {columns.map((el) => (
                                                  <CustomTableHeaderCell
                                                      key={el.id}
                                                      column={el}
                                                      classes={classes}
                                                      value={el?.coldef?.headerName}
                                                      suppressBorder={
                                                          !tableOptions?.enableGroupHeaderBorder
                                                      }
                                                  />
                                              ))}
                                          </TableRow>
                                      ))
                                    : null}
                                <TableRow>
                                    {rowsleftActionsEnabled ? (
                                        <CustomTableHeaderCell
                                            classes={classes}
                                            extraClassName={clsx(
                                                classes.stickyLeft,
                                                'sticky-left-col'
                                            )}
                                            style={{ padding: '0', zIndex: 3 }}
                                            align="right"
                                            value={
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexWrap: 'nowrap',
                                                        justifyContent: 'flex-end',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    {tableOptions?.singleSelectRows ? (
                                                        <CustomTableHeaderCell
                                                            classes={classes}
                                                            extraClassName={classes.stickyLeft}
                                                            style={{ padding: '0' }}
                                                            value={''}
                                                        />
                                                    ) : tableOptions?.multiSelectRows ? (
                                                        <Checkbox
                                                            checked={allSelected}
                                                            onChange={(e) =>
                                                                handleSelectAllRows(
                                                                    e.target.checked
                                                                )
                                                            }
                                                            inputProps={{
                                                                'aria-label': 'select all row'
                                                            }}
                                                            className={clsx(
                                                                classes.iconSize,
                                                                classes.selectRowCheckbox
                                                            )}
                                                            indeterminate={isIndeterminate}
                                                        />
                                                    ) : null}
                                                </div>
                                            }
                                        />
                                    ) : null}

                                    {columns
                                        ?.filter((el) => !el.hide)
                                        .map((el) => (
                                            <CustomTableHeaderCell
                                                key={el.id}
                                                column={el}
                                                classes={classes}
                                                value={el?.coldef?.headerName}
                                                order={order}
                                                orderBy={orderBy}
                                                onRequestSort={handleRequestSort.bind(null, el)}
                                                onAddStickyColData={() => {}}
                                            />
                                        ))}
                                    {inRowActionsEnabled ? (
                                        <CustomTableHeaderCell
                                            classes={classes}
                                            extraClassName={clsx(
                                                classes.stickyRight,
                                                classes.backgroundLight
                                            )}
                                            value={''}
                                            style={{ padding: 0, zIndex: 3 }}
                                        />
                                    ) : null}
                                </TableRow>
                            </TableHead>
                        </TableHead>
                        <TableBody>
                            <CodxAccordion
                                params={data}
                                onFetchTableData={handleAccordionTableSimulatorFetchTableData}
                            />
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div style={{ padding: '1rem' }}>
                <ActionButtons params={data?.actions} onClick={handleAction} />
            </div>
            <SaveScenarioConfirmation
                open={openConfirmation}
                classes={classes}
                onClose={() => setOpenConfirmation(false)}
                onAction={handleConfirmation}
                defaultScenarioName={defaultScenarioName}
            />
        </div>
    );
}

function SaveScenarioConfirmation({ open, classes, onClose, onAction, defaultScenarioName }) {
    const [scenarioName, setScenarioName] = useState();
    const [error, setError] = useState('');
    const [defaultName, setDefaultName] = useState(defaultScenarioName);
    const handleAction = async (e) => {
        if (e.name === 'Cancel') {
            onClose();
            setScenarioName();
            setError('');
            setDefaultName(defaultScenarioName);
        } else {
            try {
                if (!(scenarioName || defaultName)) {
                    setError('Please Enter Scenario Name');
                } else {
                    onClose();
                    setScenarioName();
                    setError('');
                    await onAction({ scenarioName: scenarioName || defaultName });
                    setDefaultName(defaultScenarioName);
                }
            } catch (err) {
                /* empty */
            }
        }
    };

    const onChangeScenarioName = (v) => {
        setError('');
        setScenarioName(v);
        setDefaultName(v);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            aria-labelledby="save-scenario"
            aria-describedby="save-scenario-content"
        >
            <DialogTitle id="save-scenario">
                <Typography variant="h4" className={classes.defaultColor}>
                    Save Scenario
                </Typography>
            </DialogTitle>
            <DialogContent id="save-scenario-content">
                <TextInput
                    fieldInfo={{
                        name: 'scenarioName',
                        label: 'Scenario name',
                        required: true,
                        variant: 'outlined',
                        fullWidth: true,
                        value: defaultScenarioName
                    }}
                    onChange={onChangeScenarioName}
                />
            </DialogContent>
            <DialogActions className={classes.actionsStyle} disableSpacing={true}>
                <Typography className={classes.confirmationError}>{error}</Typography>
                <ActionButtons
                    params={[{ name: 'Cancel' }, { name: 'Save', variant: 'contained' }]}
                    onClick={handleAction}
                />
            </DialogActions>
        </Dialog>
    );
}
