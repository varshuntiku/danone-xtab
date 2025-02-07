import React, {
    useCallback,
    useState,
    useMemo,
    useEffect,
    Fragment,
    useImperativeHandle,
    useContext
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { LockOutlined } from '@material-ui/icons';
import {
    alpha,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    LinearProgress,
    Menu,
    MenuItem,
    Switch,
    TablePagination,
    TableSortLabel,
    Toolbar,
    Typography
} from '@material-ui/core';
import clsx from 'clsx';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import CustomSnackbar from 'components/CustomSnackbar';
import StarOutlinedIcon from '@material-ui/icons/StarOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import TextInput from '../dynamic-form/inputFields/textInput';
import NumberInput from '../dynamic-form/inputFields/numberInput';
import DatePicker from '../dynamic-form/inputFields/datepicker';
import SimpleSelect from '../dynamic-form/inputFields/select';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import DateTimePicker from '../dynamic-form/inputFields/datetimepicker';
import SearchBar from '../CustomSearchComponent/SearchComponent';
import { getDeepValue, Pipeline, setDeepValue } from '../../util';
import IconRenderer from './cell-renderer/iconRenderer';
import DateRenderer from './cell-renderer/dateRenderer';
import CodexProgressLoader from '../POCProgressLoader/CodxProgressLoader';
import { red } from '@material-ui/core/colors';
import { TextList } from '../screenActionsComponent/actionComponents/TextList';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import CustomCheckbox from '../dynamic-form/inputFields/checkbox';
import moment from 'moment';
import StackElements from './cell-renderer/StackedElements';
import TextEditor2 from '../porblemDefinitionFramework/create/content-editor/TextEditor2';
import { useRef } from 'react';
import { useDebouncedCallback } from '../../hooks/useDebounceCallback';
import { useDebouncedEffect } from '../../hooks/useDebounceEffect';
import CloseIcon from '@material-ui/icons/Close';
import Widget from '../Widget';
import CodxCircularLoader from '../CodxCircularLoader';
import AppScreenNavigate from './cell-renderer/AppScreenNavigate';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TableChartIcon from '@material-ui/icons/TableChart';
import ColumnEditor from './ColumnEditor';
import CustomRadio from '../dynamic-form/inputFields/radio';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { DownloadLink } from '../screenActionsComponent/actionComponents/DownloadLink';
import DownloadWorkBook from '../workbook/downloadWorkBook';
import { reverseMapValue } from '../dynamic-form/dynamic-form';
import DynamicFormModal from '../dynamic-form/inputFields/DynamicFormModal';
import ActionButtons from '../dynamic-form/inputFields/ActionButtons';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import CommentPopUp from '../CommentPopUp';
import FileUploadCell from './cell-renderer/fileUploadCell';
import MultiSelectPopupMenu from '../MultiSelectPopupMenu';
import IconEditor from './IconEditor.jsx';
import AppWidgetPlot from '../AppWidgetPlot';
import TagsRenderer from './cell-renderer/tagsRenderer';
import LibraryAddOutlinedIcon from '@material-ui/icons/LibraryAddOutlined';
import CodxToggleButtonSwitch from '../custom/CodxToggleButtonSwitch';

import { ReactComponent as SortIcon } from '../../assets/Icons/Sort.svg';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%'
    },
    paper: {
        width: '100%'
    },
    freezingRoot: {
        height: '100%'
    },
    FreezingPaper: {
        height: '100%',
        overflow: 'auto'
    },
    stickyLeft: {
        position: 'sticky',
        left: 0,
        right: 'unset'
    },
    freezingsticky: {
        position: 'sticky',

        backgroundColor: theme.palette.background.freezeCol
    },
    stickyRight: {
        position: 'sticky',
        right: 0,
        left: 'unset'
    },
    z1: {
        zIndex: 1
    },
    table: {
        height: '100%',
        '& .MuiTableCell-root': {
            borderColor: alpha(theme.palette.border.grey, 0.2)
        }
    },
    backgroundLight: {
        background: theme.palette.background.tableHeader
    },
    defaultColor: {
        color: theme.palette.text.default
    },
    grayColor: {
        color: theme.palette.grey[500]
    },
    font1: {
        fontSize: '1.5rem'
    },
    font2: {
        fontSize: '1.6rem',
        zIndex: '20'
    },
    tableBackground: {
        backgroundColor: theme.palette.primary.dark,
        maxHeight: '85%'
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
        background: theme.palette.background.tableHeader,
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
        padding: `${theme.layoutSpacing(12)} ${theme.layoutSpacing(16)}`,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(16),
        fontWeight: '500',
        borderBottom: `1px solid ${alpha(theme.palette.border.grey, 0.2)}`,
        '& .MuiTableSortLabel-active': {
            color: theme.palette.text.default
        },
        '& .MuiTableSortLabel-root.MuiTableSortLabel-active.MuiTableSortLabel-root.MuiTableSortLabel-active .MuiTableSortLabel-icon':
            {
                color: theme.palette.text.default
            }
    },
    headerNameStyle: {
        fontFamily: theme.body.B1.fontFamily
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
    zoomButtons: {
        '& svg': {
            color: theme.palette.primary.contrastText
        }
    },
    checkboxAlignment: {
        marginTop: '0.8rem'
    },
    bookmarkIcon: {
        height: '3rem',
        width: '3rem',
        cursor: 'pointer'
    },
    cellfont: {
        fontSize: (params) =>
            params.gridOptions?.cellFontSize ? `${params.gridOptions.cellFontSize}rem` : '1.5rem',
        fontStyle: (params) =>
            params.gridOptions?.cellFontStyle ? params.gridOptions.cellFontStyle : 'normal'
    },
    bodyCellValue: {
        fontFamily: theme.body.B5.fontFamily,
        fontSize: theme.layoutSpacing(14),
        fontWeight: '400'
    },
    leftRowActionIcon: {
        paddingLeft: theme.layoutSpacing(10),
        paddingRight: theme.layoutSpacing(12)
    },
    leftActionCell: {
        padding: 0,
        zIndex: 3,
        width: theme.layoutSpacing(44)
    },
    cellContentWrapper: {
        paddingBottom: theme.layoutSpacing(0.5),
        borderBottom: `1px solid ${theme.palette.text.default}`,
        width: 'max-content'
    },

    colExpansionThumbHoveredHeader: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '3px',
        minWidth: '3px',
        cursor: 'col-resize',
        height: '90%',
        backgroundColor: 'transparent',
        '&:after': {
            content: '""',
            position: 'absolute',
            top: '10%',
            right: 0,
            width: '1px',
            minWidth: '1px',
            height: '90%',
            backgroundColor: theme.palette.border.tableDivider
        }
    },
    colExpansionThumbHovered: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '1px',
        minWidth: '1px',
        cursor: 'col-resize',
        height: '100%',
        backgroundColor: theme.palette.border.tableDivider
    },

    rowExpansionHandle: {
        height: '1px',
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: theme.palette.border.tableDivider
        }
    },
    stickyHeader: {
        position: 'sticky',
        top: 0, // Ensures the header stays at the top
        zIndex: 2 // Set a higher z-index to make sure it's above other content
    },
    toggleButtonLabel: {
        fontSize: '1.2rem'
    },
    toggleButton: {
        '& .MuiToggleButtonGroup-grouped': {
            fontSize: '1rem'
        }
    }
}));

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

const GridTableContext = React.createContext({
    isBlocked: (/*rowIndex, colIndex*/) => {},
    setCellSpan: (/*rowIndex, colIndex, colSpan, rowSpan*/) => {}
});

function GridTableContextProvider({ children, page, pageCount }) {
    // Added pages to store cell span properties to distingush between pages
    // Changed stucture to { 0 -> (pagenumber): [cell data], 1: []}
    const generatePagesForCells = () => {
        if (isFinite(pageCount) && pageCount > 0) {
            let pages = {};
            for (let index = 0; index < pageCount; index++) {
                pages = { ...pages, [index]: [] };
            }
            return pages;
        }
        return { 0: [] };
    };
    const [cells, setCells] = useState(() => generatePagesForCells());
    const isBlocked = useCallback(
        (rowIndex, colIndex) => {
            const row = cells[page] && cells[page][rowIndex];
            return row && row[colIndex];
        },
        [cells]
    );
    const setCellSpan = useCallback(
        (rowIndex, colIndex, colSpan, rowSpan) => {
            const getCells = (cells) => {
                const row = cells && cells[rowIndex];
                const blocked = row && row[colIndex];
                if (!blocked) {
                    if (rowSpan || colSpan) {
                        rowSpan = rowSpan || 1;
                        colSpan = colSpan || 1;
                        let blockedCell = false;
                        for (let i = rowIndex; i < rowIndex + rowSpan; i++) {
                            for (let j = colIndex; j < colIndex + colSpan; j++) {
                                if (cells[i]) {
                                    cells[i][j] = blockedCell;
                                } else {
                                    cells[i] = [];
                                    cells[i][j] = blockedCell;
                                }
                                blockedCell = true;
                            }
                        }
                    }
                }
                return [...cells];
            };
            setCells((prev) => ({ ...prev, [page]: getCells(cells[page] || []) }));
        },
        [page]
    );

    const value = {
        isBlocked,
        setCellSpan
    };
    return <GridTableContext.Provider value={value}>{children}</GridTableContext.Provider>;
}

/**
 * Provides a dynamic table with various functionalities
 * @summary Creates a dynamic table with custom tableheader, custom row, functionalities to add, delete, rearrange, order, sort or search row and handle duplicate rows.
 * JSON Structure-
 *  const params = {
 *    "coldef": [
 *        {
 *            "headerName": <Header>,
 *            "field": <field-value>,
 *            "value": <value>,
 *            "cellEditor":  <could be react component>
 *            "cellRenderer": <could be react component>
 *            "validator": <resource_selection>,
 *            "asterisk": <boolean>,
 *            "draggableCell": <boolean>,
 *            "dragableCellParams" : {
 *               "swap" : true
 *            },
 *            "sortable": <boolean>,
 *            "cellEditorParams": {
 *                "variant": <variant>,
 *                "options": <options>,
 *                "fullWidth": <boolean>
 *                 "singleSelect" : <boolean> only for checkbox to enable singleRowSelection of table,
 *                "suppressUTC":<boolean>, (only for cellEditor Type - date)
 *                "allowInvalid":<boolean>, (only for cellEditor Type - date)
 *                "allowInput":<boolean> (only for cellEditor Type - date)
 *            },
 *            "cellRendererParams": {},
 *            "comparator": <sorting comparator function>
 *            "editable": <boolean>,
 *            "cellParamsField": <cell parameters>,
 *            "align": <alignment>,
 *            "valueAlign: "",
 *            "asterisk": <boolean>,
 *            "width": <width-size>,
 *            "validator": <for inline change validation through server>,
 *            "rowExpandable": <boolean>,
 *            "headerBgColor": <color code>,
 *            "headerColor": <color code>,
 *            "bgColor": <color code>,
 *            "color": <color code>,
 *            "bold": true,
 *            "textDecoration": <css props>,
 *            "tooltip": <string>,
 *            "enableCellInsights": boolean,
 *            "sticky": boolean,
 *............"suppressRowRearrangeImpact":boolean
 *        }
 *    ],
 *    "gridOptions": {
 *        "tableSize": <tablesize>,
 *        "editorMode": <boolean>,
 *        "tableMaxHeight": <tableheight>,
 *        "quickSearch": <boolean>,
 *        "quickSearchLabel": <str>
 *        "outerActions": [
 *            null,
 *            {
 *            "text": <text>,
 *            "name": <action name>,
 *            "variant": <variant>
 *            }
 *        ],
 *        "rowParamsField": <row parameters>,
 *        "editedRowDefaultValue": {
 *            "edited": <boolean>
 *        },
 *        "enableHoverRow": <boolean>
 *        "enableAddRow": <boolean>,
 *        "addRowTooltip": string,
 *        "enableInRowDelete": <boolean>,
 *        "enableInRowDuplicate": <boolean>,
 *        "enableRearrange": <boolean>,
 *        "multiSelectRows": <boolean>,
 *        "enablePagination": <boolean>,
 *        "singleSelectRows": <boolean>,
 *        "newRowDefaultValue": {
 *            "Resource": null,
 *            "Remarks": <remarks>,
 *            "Constraint": <constraint>,
 *            "End CHT Time": <end time>,
 *            "Next Usage": <next usage>,
 *            "Clean_End_Time": <clean end time>,
 *            "End DHT Time": <end dht time>,
 *            "Usage_Start": <Start date-time>,
 *            "Usage_End": <end date-time>,
 *            "Clean_Start_Time": null,
 *            "Group": null,
 *            "cip_params": <cip parameter>,
 *            "clean_start_params": <clean start parameter>,
 *            "Recleaning": <boolean>,
 *            "resource_params": <resource parameter>
 *        },
 *        "suppressFlash": <boolean>,
 *        "duplicateRowOrder": <above | top | bottom | bellow>
 *        "enablePagination": true,
 *        "paginationSettings": {
 *            "rowsPerPage": <number of rowsperpage>,
 *            "rowsPerPageOptions": [5, 10, 25, { label: 'All', value: -1 }],
 *        },
 *        "suppressToolBar": <boolean>,
 *        "tableTitle": <title>,
 *        "tableTitleStyle": <title style>,
 *        "enableDuplicateRow": <boolean>,
 *        "addRowToTop": <boolean>,
 *        "duplicateRowDefaultValue": <> number of duplicate rows,
 *        "validator": <common-validato>,
 *        "tableHeight": <table-height>,
 *        "tableMaxHeight": <table-maxheight>,
 *        "caption": <caption>,
 *        "enableGroupHeaderBorder": <boolean>,
 *        "suppressRowBorder": <boolean  >,
 *        "enableColumnEditor": true,
 *        "columnEditorParams": {
 *            "newColdefDefaultProps": {
 *              "cellEditorParams": {
 *                "fullWidth": true,
 *                "variant": "outlined"
 *              },
 *              "editable":  true
 *            },
 *            "columnEditorOptions": ["text"],
 *            "singleSelect": true
 *        },
 *       "fullBorder": boolean,
 *        "inRowActions": {
 *            "addRowAbove": true,
 *            "addRowBellow": true,
 *            "duplicateRowAbove": true,
 *            "duplicateRowBellow": true,
 *            "deleteRow": true
 *        } // else set inRowActions as true to enable all the options
 *       "editModeSwitch": -1/0/1, by default off / feature disabled /  by default on
 *       "filterDropdownSwitch": -1/0/1,by default off / feature disabled /  by default on
 *       "filterColumnData": [<field_name>, <field_name>] / Add field names
 *       "inRowEditModeSwitch": -1/0/1,
 *       "lazyRow": true,
 *       "enableZoom": <boolean> if set true brings up the zoom +/- icons on ui,
 *       "defaultZoom":1.0 (default) float value upto 2 decimal places is to setup default zoom percentage,
 *       "stepValZoom":0.1 (default) float value upto 2 decimal places for increment/decrement steps,
 *       "minZoomVal":0.5 (default) float value upto 2 decimal places for exterme zoomOut value,
 *       "maxZoomVal":2.0 (default) float value upto 2 decimal places for exterme zoomIn Value,
 *    },
 *    "groupHeader": [[{<coldef>}]] list rows for the group header
 *    "rowData": [
 *        {
 *            "rowParmas": {
 *                "suppressDuplicateRow": <boolean>,
 *                "suppressDelete": <boolean>,
 *                "hide": <boolean>,
 *                "selected": <boolean>,
 *                "error": <boolean>,
 *                "highlight": <boolean>,
 *                "highlightBgColor": null,
 *                "flashEnabled": <boolean>,
 *                "tooltip": <string>,
 *                "childrenRowData": [], list of child rows, opens up on expansion
 *                "suppressInRowActions": {
 *                   "addRowAbove": true,
 *                   "addRowBellow": true,
 *                   "duplicateRowAbove": true,
 *                   "duplicateRowBellow": true,
 *                   "deleteRow": true
 *               } // else set suppressInRowActions as true to remove all the options
 *            },
 *            "resource": <resource option>,
 *            "resource_params": {
 *                "coldef": {},
 *                "coldefOverride": {},
 *                "error": <boolean>,
 *                "helperText": <helper text>,
 *                "highlight": <boolean>,
 *                "highlightBgColor": <background color>,
 *                "colSpan": number,
 *                "rowSpan": number,
 *                "bgColor": <colorCode>,
 *                "textDecoration": <css props>
 *                "color": <color code>
 *                "insights": {
 *                   "title": "",
 *                   "type": "",
 *                   "disabled": true,
 *                   "data": {},
 *                },
 *            }
 *        }
 *    ]
 *  }
 * @param params: {coldef, rowData, gridOptions, onValueChange, onRowDataChange, onOuterAction, validateValueChange, onRowChange}
 */
const GridTable = React.forwardRef(
    (
        {
            params: defaultParams,
            onValueChange,
            onRowDataChange,
            onColdefChange,
            onOuterAction,
            validateValueChange,
            onRowChange,
            cellInsightsGetter,
            dynamicPayload,
            ...props
        },
        ref
    ) => {
        const toggleGridTable = defaultParams?.enableToggleButton;
        const gridTableToggleData = defaultParams?.toggleOptions;
        const [params, setParams] = useState(
            toggleGridTable ? gridTableToggleData[toggleGridTable?.defaultValue] : defaultParams
        );
        const progress_info = props.progressInfo;
        const config = props.config;
        const classes = useStyles(params);
        const { gridOptions } = params;
        const [columns, setColumns] = useState(createColumns(params.coldef));
        const [selectedColumns, setSelectedColumns] = useState(columns);
        const [copyError, setCopyError] = useState(false);
        const [groupHeaders, setGroupHeaders] = useState(() => {
            let groupHeaders = [];
            if (params.groupHeaders?.length) {
                groupHeaders = params.groupHeaders.map((cols) => createColumns(cols));
            }
            return groupHeaders;
        });
        const [rows, setRows] = useState(createRows(params.rowData, gridOptions?.rowParamsField));
        const [selectedRows] = useState(rows);
        const [pseudoSelectRows, setPseudoSelectRows] = useState({
            rowData: rows,
            fieldMapping: {}
        });
        const [page, setPage] = React.useState(0);
        const [rowsPerPage, setRowsPerPage] = React.useState(
            gridOptions?.enablePagination ? gridOptions?.paginationSettings?.rowsPerPage || 5 : 0
        );
        const [count, setCount] = useState(0);
        const [search, setSearch] = useState('');
        const [isIndeterminate, setIsIndeterminate] = useState(false);
        const [allSelected, setAllSelected] = useState(false);
        const [order, setOrder] = React.useState();
        const [orderBy, setOrderBy] = React.useState();
        const [processing, setProcessing] = React.useState(false);
        const [colSearch, setColSearch] = React.useState({});
        const inRowActionsEnabled =
            gridOptions?.enableInRowDelete ||
            gridOptions?.enableInRowDuplicate ||
            gridOptions?.inRowActions ||
            gridOptions?.inRowEditModeSwitch ||
            gridOptions?.enableRowCopy;
        const rowsleftActionsEnabled =
            gridOptions?.multiSelectRows ||
            gridOptions?.singleSelectRows ||
            gridOptions?.enableRearrange ||
            gridOptions.bookmark;
        const serverSideDataSourceRef = useRef(gridOptions?.serverSideDataSource);
        const [cellInsights, setCellInsights] = useState();
        const [cellInsightsOpen, setCellInsightsOpen] = useState(false);
        const [cellInsightsLoading, setCellInsightsLoading] = useState();
        const [openColEdit, setOpenColEditor] = useState(false);
        const [stickyColData, setStickyColData] = useState({});
        const [editModeSwitchEnabled, setEditModeSwitchEnabled] = useState(
            gridOptions?.editModeSwitch ? gridOptions?.editModeSwitch > 0 : false
        );
        const colCount =
            columns.length + (rowsleftActionsEnabled ? 1 : 0) + (inRowActionsEnabled ? 1 : 0);
        const [zoomLevel, setZoomLevel] = React.useState(gridOptions?.defaultZoom || 1.0);
        const minZoomVal = gridOptions?.minZoomVal || 0.5;
        const maxZoomVal = gridOptions?.maxZoomVal || 2.0;
        const stepValZoom = gridOptions?.stepValZoom || 0.1;
        const [allowRearrange, setAllowRearrange] = useState(gridOptions?.enableRearrange || false);
        const [colAddCount, setColAddCount] = useState(1);
        const [columnWidths, setColumnWidths] = useState([]);
        const filterOptionsGenerator = (field, rowSet) => {
            const fieldValues = rowSet?.map((row) => row?.data[field]);
            //?.filter((option) => option?.length);
            const uniqueOptions = [...new Set(fieldValues)]?.map((option) => ({
                key: option?.length ? option : '(BLANKS)',
                fieldName: field
            }));
            return uniqueOptions;
        };
        const filterOptionsPreset = () => {
            const mapped = gridOptions?.filterColumnData?.map((col) => {
                const data = {};
                data[col] = {
                    value: filterOptionsGenerator(col, selectedRows),
                    focused: false,
                    deSelected: []
                };
                return data;
            });
            const actual = Object.assign({}, ...mapped);
            return actual;
        };
        const [options, setOptions] = useState(
            gridOptions?.filterColumnData?.length
                ? { source: filterOptionsPreset(), pseudo: filterOptionsPreset() }
                : {}
        );

        const [hoveredRowIndex, setHoveredRowIndex] = useState(null);

        const handleStickyColData = useCallback((data) => {
            setStickyColData((s) => ({ ...s, ...data }));
        }, []);
        const handleLockClick = (rowIndex) => {
            setFrozenRows((prevFrozenRows) =>
                prevFrozenRows.includes(rowIndex)
                    ? prevFrozenRows.filter((i) => i !== rowIndex)
                    : [...prevFrozenRows, rowIndex]
            );
        };

        const calculateStickyPosition = (columnIndex, columnWidths) => {
            let leftOffset = 0;

            for (let i = 0; i < columnIndex; i++) {
                if (frozenColumns.includes(i)) {
                    leftOffset += columnWidths[i];
                }
            }

            return leftOffset;
        };

        const calculateRightStickyPosition = (columnIndex, columnWidths) => {
            let rightOffset = 0;

            const totalColumns = columnWidths.length / 2;

            for (let i = totalColumns - 1; i > columnIndex; i--) {
                if (frozenColumns.includes(i)) {
                    rightOffset += columnWidths[i];
                }
            }

            return rightOffset;
        };

        useEffect(() => {
            setZoomLevel(gridOptions?.defaultZoom || 1.0);
            setRows(createRows(params.rowData, gridOptions?.rowParamsField));
            setColumns(createColumns(params.coldef));
        }, [defaultParams]);

        useEffect(() => {
            const columns = createColumns(params.coldef);
            setColumns(columns);
            setGroupHeaders(() => {
                let groupHeaders = [];
                if (params.groupHeaders?.length) {
                    groupHeaders = params.groupHeaders.map((cols) => createColumns(cols));
                }
                return groupHeaders;
            });
            setRows(createRows(params.rowData, gridOptions?.rowParamsField));
            setRowsPerPage(
                gridOptions?.enablePagination
                    ? gridOptions?.paginationSettings?.rowsPerPage || 5
                    : 0
            );
            setZoomLevel(gridOptions?.defaultZoom || 1.0);
        }, [params]);

        useEffect(() => {
            const serverSideDataSource = gridOptions?.serverSideDataSource;
            serverSideDataSourceRef.current = serverSideDataSource;
        }, [gridOptions]);

        useEffect(() => {
            setOrder(null);
            setOrderBy(null);
            setColSearch({});
            setSelectedColumns(columns);
        }, [columns]);

        const orderedColKey = orderBy?.key;
        const fetchServerSideRowData = useCallback(async () => {
            const serverSideDataSource = serverSideDataSourceRef.current;
            if (serverSideDataSource?.getRowData) {
                try {
                    setProcessing(true);
                    const res = await serverSideDataSource.getRowData({
                        search,
                        order,
                        orderedColKey,
                        colSearch,
                        page,
                        rowsPerPage
                    });
                    setRows(createRows(res.rowData, gridOptions?.rowParamsField));
                    setCount(res.count);
                    res.page !== page && setPage(res.page);
                } catch (err) {
                    // TODO
                } finally {
                    setProcessing(false);
                }
            }
        }, [search, order, orderedColKey, colSearch, page, rowsPerPage, gridOptions]);

        useDebouncedEffect(
            () => {
                fetchServerSideRowData();
            },
            [fetchServerSideRowData],
            300
        );

        useEffect(() => {
            if (rows?.length) {
                const intial = rows[0].selected;
                setIsIndeterminate(rows.some((el) => el.selected !== intial));
                setAllSelected(rows.every((el) => el.selected));
            } else {
                setIsIndeterminate(false);
                setAllSelected(false);
            }
        }, [rows]);

        const handleSetRows = useCallback(
            (rows) => {
                setRows(rows);
                onRowDataChange && onRowDataChange(rows.map((el) => el.data));
            },
            [onRowDataChange]
        );

        useEffect(() => {
            let newRows = Object.assign([], rows);
            let keyColumn = null;
            let targetColumn = null;
            for (let i in columns) {
                if (columns[i].coldef?.cellRenderer === 'progressloader') {
                    keyColumn = columns[i].coldef?.cellRendererParams?.id_field;
                    targetColumn = columns[i].coldef?.field;
                    break;
                }
            }

            for (let i in newRows) {
                if (newRows[i]?.data[targetColumn]) {
                    if (
                        (newRows[i].data[targetColumn]?.currentProgress || 0) <
                            progress_info?.progress_info?.[newRows[i].data[keyColumn]]
                                ?.currentProgress ||
                        0
                    ) {
                        newRows[i].data[targetColumn] = {
                            ...newRows[i].data[targetColumn],
                            ...(progress_info?.progress_info?.[newRows[i].data[keyColumn]] || {})
                        };
                        newRows[i].data[targetColumn].last_updated_time = new Date();
                    }
                } else {
                    break;
                }
            }
            handleSetRows([...newRows]);
        }, [progress_info]);

        const handleRequestSort = useCallback(
            (col) => {
                if (gridOptions.bookmark && col.id === 0) {
                    setOrder(null);
                    setOrderBy(null);
                    let newData = [
                        ...rows.filter((el) => el.data.bookmarked),
                        ...rows.filter((el) => !el.data.bookmarked)
                    ];
                    if (JSON.stringify(rows) !== JSON.stringify(newData)) {
                        handleSetRows([...newData]);
                    } else {
                        handleSetRows(createRows(params.rowData, gridOptions?.rowParamsField));
                    }
                } else {
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
                }
            },
            [orderBy, order, rows]
        );

        const handleAddRow = useCallback(() => {
            const data = Object.assign(
                {},
                ...columns.map((el) => ({ [el?.coldef?.field]: el?.coldef?.value })),
                gridOptions?.newRowDefaultValue
            );
            const newRows = createRows([data], gridOptions?.rowParamsField);
            if (gridOptions?.addRowToTop) {
                handleSetRows([...newRows, ...(rows || [])]);
            } else {
                handleSetRows([...(rows || []), ...newRows]);
            }
            if (!gridOptions.suppressFlash) {
                newRows.forEach((el) => el.flash());
            }
        }, [gridOptions, columns, rows, handleSetRows]);

        const handleInlineAddRow = useCallback(
            (row, offset) => {
                const index = rows.indexOf(row);
                const data = Object.assign(
                    {},
                    ...columns.map((el) => ({ [el?.coldef?.field]: el?.coldef?.value })),
                    gridOptions?.newRowDefaultValue
                );
                const createdRows = createRows([data], gridOptions?.rowParamsField);
                let newRows = rows;
                if (offset === -1) {
                    // add above mian row
                    const brekFrom = index;
                    newRows = [
                        ...rows.slice(0, brekFrom),
                        ...createdRows,
                        ...rows.slice(brekFrom, rows.length)
                    ];
                } else {
                    // add bellow the main row"
                    const brekFrom = index + 1;
                    newRows = [
                        ...rows.slice(0, brekFrom),
                        ...createdRows,
                        ...rows.slice(brekFrom, rows.length)
                    ];
                }
                if (!gridOptions.suppressFlash) {
                    createdRows.forEach((el) => el.flash());
                }
                handleSetRows([...newRows]);
            },
            [gridOptions, columns, rows, handleSetRows]
        );

        const handleColumnEdit = useCallback(() => {
            setOpenColEditor(true);
        }, []);

        const handleColumnUpdate = (coldefs) => {
            const columns = createColumns(coldefs);
            setColumns(columns);
            setOpenColEditor(false);
            if (onColdefChange) {
                onColdefChange(coldefs);
            }
        };

        const handleRowSelect = useCallback(
            (row, selected) => {
                if (gridOptions?.singleSelectRows) {
                    if (selected) {
                        rows.forEach((el) => {
                            el.selected = false;
                            if (gridOptions.rowParamsField) {
                                setDeepValue(
                                    el.data,
                                    gridOptions.rowParamsField + '.selected',
                                    false
                                );
                            } else {
                                el.data.selcted = false;
                            }
                        });
                    }
                    row.selected = selected;
                } else {
                    row.selected = selected;
                }
                if (gridOptions.rowParamsField) {
                    setDeepValue(row.data, gridOptions.rowParamsField + '.selected', selected);
                } else {
                    row.data.selected = selected;
                }
                handleSetRows([...rows]);
            },
            [rows, gridOptions, handleSetRows]
        );
        const handleBookMark = (row) => {
            if (gridOptions.freezeBookMark) return;
            if (row.data?.bookmarked) {
                row.data.bookmarked = false;
            } else {
                row.data.bookmarked = true;
            }
            handleSetRows([...rows]);
        };
        const handleSelectAllRows = useCallback(
            (selected) => {
                rows.forEach((el) => {
                    el.selected = selected;
                    if (gridOptions.rowParamsField) {
                        setDeepValue(el.data, gridOptions.rowParamsField + '.selected', selected);
                    } else {
                        el.data.selected = selected;
                    }
                });
                handleSetRows([...rows]);
            },
            [handleSetRows, rows]
        );

        const handleFilteredRows = useCallback((selections, columns) => {
            const columnList = columns.map((col) => col.key);
            selections = selections.filter((field) => columnList.includes(field));
            const deSelectedOption = columns
                .map((col) => col.key)
                .filter((col) => !selections.includes(col));
            const { rowData, fieldMapping } = { ...pseudoSelectRows };
            const fieldName = columns[0].fieldName;
            const { source, pseudo } = options;
            setOptions({ source, pseudo });
            if (!selections.length) {
                setRows([]);
            } else {
                if (selections.length == columns.length) {
                    pseudo[fieldName].deSelected = [];
                } else {
                    pseudo[fieldName].deSelected = [
                        ...new Set([...pseudo[fieldName].deSelected, ...deSelectedOption])
                    ].filter((option) => deSelectedOption.includes(option));
                }
                //To be checked
                fieldMapping[fieldName] = { selections, columns };
                setPseudoSelectRows({ rowData, fieldMapping });
                if (
                    Object.keys(fieldMapping)?.every(
                        (prop) =>
                            fieldMapping[prop]?.selections?.length ===
                            fieldMapping[prop]?.columns?.length
                    )
                ) {
                    setRows(rowData);
                } else {
                    const updatedRows = rowData.filter((row) =>
                        Object.keys(fieldMapping)?.every((prop) =>
                            fieldMapping[prop].selections.includes(row?.data[prop])
                        )
                    );
                    setRows(updatedRows);
                }
            }
            const rowsFiltered = selectedRows.filter(({ data }) =>
                Object.keys(pseudo)?.every(
                    (filter) => !pseudo[filter].deSelected.includes(data[filter])
                )
            );
            Object.keys(pseudo).map(
                (field) =>
                    (pseudo[field].value = [
                        ...filterOptionsGenerator(field, rowsFiltered),
                        ...pseudo[field].deSelected.map((col) =>
                            source[field].value.find((column) => column.key == col)
                        )
                    ])
            );
            setOptions({ source, pseudo });
            setRows(rowsFiltered);
            if (!selections.length) {
                Object.keys(pseudo)
                    .filter((name) => !(name == columns[0]?.fieldName))
                    .map((filter) => (pseudo[filter].value = []));
                setOptions({ source, pseudo });
                setRows([]);
            } else {
                setRows(rowsFiltered);
            }
            if (
                Object.keys(source)?.every(
                    (filter) => source[filter]?.value?.length == pseudo[filter]?.value?.length
                )
            ) {
                setAllowRearrange(true);
            } else {
                setAllowRearrange(false);
            }
        }, []);

        const handleDeleteRow = useCallback(
            (row) => {
                if (row && !row.suppressDelete) {
                    const newRows = rows.filter((r) => r !== row);
                    handleSetRows([...newRows]);
                }
            },
            [rows, handleSetRows]
        );

        const handleCopyRow = useCallback(
            async (row) => {
                try {
                    const str = JSON.stringify(row?.data, null, 2);
                    await navigator.clipboard.writeText(str);
                } catch (err) {
                    setCopyError(true);
                }
            },
            [rows]
        );

        const handleDeleteSelectedRows = useCallback(() => {
            const newRows = rows.filter((el) => !el.selected || el.suppressDelete);
            handleSetRows([...newRows]);
        }, [rows, handleSetRows]);

        const handleFilteredColumns = useCallback((selectedColumnsFromMenu, columns) => {
            const matches = selectedColumns.filter((item) => {
                return selectedColumnsFromMenu.indexOf(item.key) > -1;
            });
            setSelectedColumns(matches.length ? matches : columns);
        }, []);

        const handleDuplicateRow = useCallback(
            (row, offset) => {
                const index = rows.indexOf(row);
                const data = Object.assign({}, row.data, gridOptions?.duplicateRowDefaultValue);
                const duplicateRows = createRows([data], gridOptions?.rowParamsField);
                let newRows = rows;
                const duplicateRowOrder = offset
                    ? offset === -1
                        ? 'above'
                        : 'bellow'
                    : gridOptions.duplicateRowOrder;
                if (duplicateRowOrder === 'above') {
                    // add above mian row
                    const brekFrom = index;
                    newRows = [
                        ...rows.slice(0, brekFrom),
                        ...duplicateRows,
                        ...rows.slice(brekFrom, rows.length)
                    ];
                } else if (duplicateRowOrder === 'top') {
                    // add at the top of the table
                    newRows = [...duplicateRows, ...rows];
                } else if (duplicateRowOrder === 'bottom') {
                    // add at the bottom of the table
                    newRows = [...rows, ...duplicateRows];
                } else {
                    // add bellow the main row"
                    const brekFrom = index + 1;
                    newRows = [
                        ...rows.slice(0, brekFrom),
                        ...duplicateRows,
                        ...rows.slice(brekFrom, rows.length)
                    ];
                }
                if (!gridOptions.suppressFlash) {
                    duplicateRows.forEach((el) => el.flash());
                }
                handleSetRows([...newRows]);
            },
            [gridOptions, rows, handleSetRows]
        );

        const handleDuplicateSelectedRows = useCallback(() => {
            const mainRows = rows.filter((r) => r.selected && !r.suppressDuplicateRow);
            const fIndex = rows.indexOf(mainRows[0]);
            const lIndex = rows.indexOf(mainRows[mainRows.length - 1]);
            const duplicateRowData = mainRows.map((el) =>
                Object.assign({}, el.data, gridOptions?.duplicateRowDefaultValue)
            );
            const duplicateRows = createRows(duplicateRowData, gridOptions?.rowParamsField);

            let newRows = rows;
            if (gridOptions.duplicateRowOrder === 'above') {
                // add above mian row
                const brekFrom = fIndex;
                newRows = [
                    ...rows.slice(0, brekFrom),
                    ...duplicateRows,
                    ...rows.slice(brekFrom, rows.length)
                ];
            } else if (gridOptions.duplicateRowOrder === 'top') {
                // add at the top of the table
                newRows = [...duplicateRows, ...rows];
            } else if (gridOptions.duplicateRowOrder === 'bottom') {
                // add at the bottom of the table
                newRows = [...rows, ...duplicateRows];
            } else {
                // add bellow the main row"
                const brekFrom = lIndex + 1;
                newRows = [
                    ...rows.slice(0, brekFrom),
                    ...duplicateRows,
                    ...rows.slice(brekFrom, rows.length)
                ];
            }
            if (!gridOptions.suppressFlash) {
                duplicateRows.forEach((el) => el.flash());
            }
            handleSetRows([...newRows]);
        }, [gridOptions, rows, handleSetRows]);

        const handleChangePage = (event, newPage) => {
            setPage(newPage);
        };

        const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
        };

        const handleValueChange = useCallback(
            async (row, col, value, params, action) => {
                try {
                    const validator = col?.coldef?.validator || gridOptions?.validator;
                    if (validator && validateValueChange) {
                        setProcessing(true);
                        const res = await validateValueChange({
                            row,
                            col: col?.coldef,
                            value,
                            validator: validator,
                            actionName: action
                        });
                        if (res && Object.keys(res).length) {
                            if (res.row) {
                                row.data = res.row;
                                Object.assign(
                                    row,
                                    createRows([res.row], gridOptions?.rowParamsField)[0]
                                );
                                Object.assign(row.data, gridOptions?.editedRowDefaultValue);
                                handleSetRows([...rows]);
                                onRowChange && onRowChange(row);
                                return;
                            } else if (res.value) {
                                value = res.value;
                            }
                        }
                    }

                    if (col?.coldef?.cellEditor === 'action-buttons') {
                        return;
                    }

                    let newRows = rows;
                    Object.assign(row.data, gridOptions?.editedRowDefaultValue);
                    if (col?.coldef?.cellEditor === 'rowEditorPopup') {
                        setDeepValue(row.data, '', value);
                        newRows = createRows(
                            newRows.map((el) => el.data),
                            gridOptions?.rowParamsField
                        );
                    } else {
                        setDeepValue(row.data, col?.coldef?.field, value);
                    }

                    if (
                        (col?.coldef?.cellEditor === 'checkbox' && params?.singleSelect) ||
                        col?.coldef?.cellEditor === 'radio'
                    ) {
                        rows.forEach((el) => {
                            if (row !== el) {
                                setDeepValue(el.data, col?.coldef?.field, false);
                            }
                        });
                        newRows = createRows(
                            newRows.map((el) => el.data),
                            gridOptions?.rowParamsField
                        );
                    }
                    handleSetRows([...newRows]);
                    onValueChange && onValueChange(row, col, value);
                } catch (error) {
                    console.log('err', error);
                } finally {
                    setProcessing(false);
                }
            },
            [rows, onValueChange, gridOptions, validateValueChange, onRowChange, handleSetRows]
        );

        const handleOuterActionClick = useCallback(
            (name) => {
                onOuterAction &&
                    onOuterAction({
                        actionName: name,
                        tableProps: {
                            rowData: rows.map((el) => el.data),
                            coldef: columns.map((el) => el.coldef),
                            gridOptions: gridOptions
                        }
                    });
            },
            [onOuterAction, rows, selectedColumns, gridOptions]
        );

        const handleCellRearrange = useCallback(
            (dropAreaRow, col, e) => {
                const dropAreaIndex = rows.indexOf(dropAreaRow);
                const draggedCellRowId = e.dataTransfer.getData('draggedRowId');
                const draggedIndex = rows.findIndex((r) => r.id === draggedCellRowId);
                const draggedValue = getDeepValue(rows[draggedIndex].data, col.coldef.field);
                const dropValue = getDeepValue(rows[dropAreaIndex].data, col.coldef.field);
                const swap = col?.coldef?.dragableCellParams?.swap;
                if (swap) {
                    setDeepValue(rows[draggedIndex].data, col.coldef.field, dropValue);
                    setDeepValue(rows[dropAreaIndex].data, col.coldef.field, draggedValue);
                } else {
                    const downwardMove = draggedIndex < dropAreaIndex;

                    if (downwardMove) {
                        for (let i = draggedIndex; i < dropAreaIndex; i++) {
                            const valueToCopy = getDeepValue(rows[i + 1].data, col.coldef.field);
                            setDeepValue(rows[i].data, col.coldef.field, valueToCopy);
                        }
                        setDeepValue(rows[dropAreaIndex].data, col.coldef.field, draggedValue);
                    } else {
                        for (let i = draggedIndex; i > dropAreaIndex; i--) {
                            const valueToCopy = getDeepValue(rows[i - 1].data, col.coldef.field);
                            setDeepValue(rows[i].data, col.coldef.field, valueToCopy);
                        }
                        setDeepValue(rows[dropAreaIndex].data, col.coldef.field, draggedValue);
                    }
                }

                const rowData = rows.map((el) => el.data);
                const newRows = createRows(rowData, gridOptions.rowParamsField);
                handleSetRows(newRows);
            },
            [rows, handleSetRows, gridOptions]
        );

        const handleRearrange = useCallback(
            (dropAreaRow, e) => {
                const dropAreaIndex = rows.indexOf(dropAreaRow);
                const draggedId = e.dataTransfer.getData('draggedId');
                const draggedIndex = rows.findIndex((r) => r.id === draggedId);
                const colValueMapper = columns
                    .filter((el) => el.coldef.suppressRowRearrangeImpact === true)
                    .map((col) => ({
                        col: col,
                        data: rows.map((el) => getDeepValue(el.data, col.coldef.field))
                    }));
                const pickedRows = rows.splice(draggedIndex, 1);
                const res = [
                    ...rows.slice(0, dropAreaIndex),
                    ...pickedRows,
                    ...rows.slice(dropAreaIndex)
                ];
                colValueMapper.forEach((el) => {
                    res.forEach((row, rowindex) => {
                        setDeepValue(row.data, el.col.coldef.field, el.data[rowindex]);
                    });
                });
                if (colValueMapper.length) {
                    setColumns((s) =>
                        s.map((el) => {
                            if (colValueMapper.some((m) => m.col.id === el.id)) {
                                el.id = ++nextColId;
                            }
                            return el;
                        })
                    );
                }
                handleSetRows([...res]);
            },
            [rows, handleSetRows, selectedColumns]
        );

        const applyPagination = (rows) => {
            if (gridOptions.serverSideDataSource) {
                return rows;
            }
            return rowsPerPage > 0
                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : rows;
        };

        const searchValue = (col, row) => {
            const coldef = col.coldef;
            const val = row.data[coldef.field];
            let res = val;
            if (coldef.searchValueGetter) {
                res = coldef.searchValueGetter(val, col, row);
            } else {
                if (Array.isArray(val) && val.every((item) => typeof item === 'object')) {
                    const result = val.flatMap((obj) => Object.values(obj));
                    res = result.join(' ');
                }
                if (val instanceof Array && !val.every((item) => typeof item === 'object')) {
                    res = val.join(' ');
                }
                if (
                    (coldef.cellEditor === 'date' || coldef.cellEditor === 'dateTime') &&
                    coldef.cellEditorParams
                ) {
                    res += ' ' + moment(new Date(val)).format(coldef.cellEditorParams.format);
                }
                if (
                    (coldef.cellRenderer === 'date' || coldef.cellRenderer === 'dateTime') &&
                    coldef.cellRendererParams
                ) {
                    res += ' ' + moment(new Date(val)).format(coldef.cellRendererParams.format);
                }
            }
            return res;
        };

        const applyQuickSearch = (rows) => {
            if (gridOptions.serverSideDataSource) {
                return rows;
            }
            if (gridOptions.quickSearch) {
                if (search) {
                    const s = search.toLowerCase();
                    return rows.filter((row) => {
                        const value = columns
                            .filter((el) => !el.hide)
                            .map((el) => searchValue(el, row))
                            .join(' ')
                            .toLowerCase();
                        return value.includes(s);
                    });
                } else {
                    return rows;
                }
            } else {
                return rows;
            }
        };

        const applyColSearch = (rows) => {
            if (gridOptions.serverSideDataSource) {
                return rows;
            }
            const searchableCols = columns.filter(
                (el) => el.coldef.search && !el.hide && colSearch[el.key]
            );
            if (!searchableCols.length) {
                return rows;
            }
            return rows.filter((row) => {
                return searchableCols.every((el) => {
                    const val = searchValue(el, row) + '';
                    const search = colSearch[el.key].toLowerCase();
                    return val.toLowerCase().includes(search);
                });
            });
        };

        const applySorting = (rows) => {
            if (gridOptions.serverSideDataSource) {
                return rows;
            }
            if (orderBy) {
                const field = orderBy.coldef.field;
                const orderFactor = order === 'asc' ? 1 : -1;
                const comparator = orderBy?.coldef?.comparator || ((a, b) => (a > b ? 1 : -1));
                return [...rows].sort(
                    (a, b) => comparator(a.data[field], b.data[field]) * orderFactor
                );
            } else {
                return rows;
            }
        };

        useImperativeHandle(
            ref,
            () => ({
                fetchServerSideRowData,
                updateColDefs: (coldefs) => setColumns(createColumns(coldefs)),
                updateRowData: (rowData) =>
                    setRows(createRows(rowData, gridOptions?.rowParamsField))
            }),
            [fetchServerSideRowData, gridOptions]
        );

        const handleShowInsights = async (event, { row, column, coldef, cellParam }) => {
            const insights = cellParam?.insights;
            if (insights?.disabled) {
                return;
            }
            let cellInsights;
            if (
                coldef.cellInsightsParams?.serverSideData &&
                !insights?.disabled &&
                cellInsightsGetter
            ) {
                // fetch data
                // set to cellInsights to state
                try {
                    setCellInsightsLoading(true);
                    cellInsights = await cellInsightsGetter({
                        row: row.data,
                        coldef: column.coldef,
                        actionType: coldef.cellInsightsParams.serveSideData
                    });
                } catch (err) {
                    console.error(err);
                } finally {
                    setCellInsightsLoading(false);
                }
            } else if (insights?.data && !insights?.disabled) {
                // set to cellInsights to staterbale
                cellInsights = insights;
            }

            if (cellInsights && !cellInsights?.disabled) {
                setCellInsights(cellInsights);
                setCellInsightsOpen(true);
            }
        };
        const [hoveredColumn, setHoveredColumn] = useState(null);

        const handleMouseEnter = (columnId) => {
            setHoveredColumn(columnId);
        };

        const handleMouseLeave = () => {
            setHoveredColumn(null);
        };

        const [frozenColumns, setFrozenColumns] = useState([]);
        const hoveredRow = [];
        const [frozenRows, setFrozenRows] = useState([]); // Array of frozen row indices
        const [topFrozenRows, setTopFrozenRows] = useState(new Set());
        const [bottomFrozenRows, setBottomFrozenRows] = useState(new Set());

        const toggleFreezeTopRow = (rowIndex) => {
            setTopFrozenRows((prevTopFrozenRows) => {
                const newSet = new Set(prevTopFrozenRows);
                if (newSet.has(rowIndex)) {
                    newSet.delete(rowIndex);
                } else {
                    newSet.add(rowIndex);
                }
                return newSet;
            });
        };

        const toggleFreezeBottomRow = (rowIndex) => {
            setBottomFrozenRows((prevBottomFrozenRows) => {
                const newSet = new Set(prevBottomFrozenRows);
                if (newSet.has(rowIndex)) {
                    newSet.delete(rowIndex);
                } else {
                    newSet.add(rowIndex);
                }
                return newSet;
            });
        };

        const handleFreezeColumn = (columnId) => {
            setFrozenColumns((prevFrozenColumns) => {
                if (prevFrozenColumns.includes(columnId)) {
                    return prevFrozenColumns.filter((col) => col !== columnId);
                } else {
                    return [...prevFrozenColumns, columnId];
                }
            });
        };
        const handleExpansion = (row, expanded) => {
            const index = rows.indexOf(row);
            row.expanded = expanded;
            if (expanded) {
                const childrenRows = createRows(
                    row.childrenRowData,
                    gridOptions?.rowParamsField,
                    row
                );
                const newRows = [...rows];
                newRows.splice(index + 1, 0, ...childrenRows);
                handleSetRows(newRows);
            } else {
                const removedParentRowIds = [row.id];
                const newRows = [];
                rows.forEach((r) => {
                    if (removedParentRowIds.includes(r.parentRowId)) {
                        if (r.childrenRowData?.length) {
                            removedParentRowIds.push(r.id);
                        }
                    } else {
                        newRows.push(r);
                    }
                });
                handleSetRows(newRows);
            }
        };

        // const handleDropDownValues = (field, gridOptions) => {
        //     const fieldValues = selectedRows?.map((row) => row?.data[field]);
        //     //?.filter((option) => option?.length);
        //     const uniqueOptions = [...new Set(fieldValues)]?.map((option) => ({
        //         key: option.length ? option : '(BLANKS)',
        //         fieldName: field,
        //         filterSet: gridOptions
        //     }));
        //     return uniqueOptions;
        // };

        const handleZoom = (val) => {
            const newVal = parseFloat((zoomLevel + stepValZoom * val).toFixed(2));
            if (newVal >= minZoomVal && newVal <= maxZoomVal) {
                setZoomLevel(newVal);
            } else if (Math.abs(minZoomVal - newVal) < Math.abs(newVal - maxZoomVal)) {
                setZoomLevel(minZoomVal);
            } else {
                setZoomLevel(maxZoomVal);
            }
        };

        //columns resize handling
        const [columnResizeObjects, setColumnResizeObjects] = useState([]);
        const [columnExpansionHovered, setColumnExpansionHovered] = useState(false);

        const columnWidthResizeHandler = useCallback((id, width) => {
            const objectsCopy = JSON.parse(JSON.stringify(columnResizeObjects));
            const index = objectsCopy?.findIndex((el) => el.id === id);

            if (index !== -1) {
                objectsCopy[index].width = width;
                setColumnResizeObjects(() => objectsCopy);
            } else {
                if (!width) {
                    return;
                }

                const resizeObject = { id, width };
                objectsCopy?.push(resizeObject);
                setColumnResizeObjects(() => objectsCopy);
            }
        });
        const onSetExpansionHover = (bool) => {
            setColumnExpansionHovered(bool);
        };
        //row resize handling
        const [rowResizeObjects, setRowResizeObjects] = useState([]);

        const [rowHovered, setRowHovered] = useState(false);
        const heightResizeHandler = (id, height) => {
            const objectsCopy = JSON.parse(JSON.stringify(rowResizeObjects));
            const index = objectsCopy?.findIndex((el) => el.id === id);

            if (index !== -1) {
                objectsCopy[index].height = height;
                setRowResizeObjects(() => objectsCopy);
            } else {
                const resizeObject = { id, height };
                objectsCopy?.push(resizeObject);
                setRowResizeObjects(() => objectsCopy);
            }
        };

        const handleSetCols = (cols) => {
            setColumns(cols);
        };

        const handleAddCol = () => {
            // let columnName = `Column ${columns.length - params.coldef.length + 1}`;
            let columnName = `Column ${colAddCount}`;
            const newColumn = {
                cellEditor: 'text',
                cellEditorParams: {
                    variant: 'outlined',
                    align: 'left',
                    fullWidth: true
                },
                cellParamsField: 'new_col_params',
                editable: true,
                field: columnName,
                headerName: columnName,
                isCustomCol: true,
                isColHeaderEditable: true,
                isColDeletable: true
            };

            let coldefList = columns.map((col) => col.coldef);
            coldefList = [...coldefList, newColumn];
            setColumns(createColumns(coldefList));

            // setting the column field in row
            const updatedRows = rows.map((r) => {
                r.data[columnName] = '';
                return r;
            });

            handleSetRows(updatedRows);
            setColAddCount((c) => c + 1);
        };

        const handleColumnHeaderValueChange = (e, updatedCol) => {
            let columnList = columns.map((col) => {
                if (col.key === updatedCol.key) {
                    col = { ...col, coldef: { ...col?.coldef, field: e, headerName: e } };
                }
                return col;
            });
            setColumns(columnList);
        };

        const updateRowsOnColChange = (newColName, updatedCol) => {
            // updating the field name for every row
            const updatedRows = rows.map((r) => {
                delete r.data[updatedCol.key];
                r.data[newColName] = '';
                return r;
            });
            handleSetRows(updatedRows);
        };

        const handleDeleteColumn = (delCol) => {
            const newColumns = columns.filter((col) => col.id !== delCol.cellId);
            handleSetCols(newColumns);

            // removing the deleted column field from row
            const updatedRows = rows.map((r) => {
                delete r.data[delCol.value];
                return r;
            });
            handleSetRows(updatedRows);
        };

        const handleDeleteField = (field) => {
            // column field delete
            if (field?.isColDeletable) {
                handleDeleteColumn(field);
            }
        };

        const handleToggleButtonChange = (fieldId, value) => {
            setParams(gridTableToggleData[value]);
        };

        return (
            <GridTableContextProvider
                rows={rows}
                column={selectedColumns}
                page={page}
                pageCount={Math.ceil(count || rows?.length / rowsPerPage)}
            >
                <div
                    className={`${classes.root} ${
                        gridOptions?.freezing ? classes.freezingRoot : ''
                    }`}
                >
                    <Paper
                        className={`${classes.paper} ${
                            gridOptions?.freezing ? classes.FreezingPaper : ''
                        }`}
                    >
                        <TableToolBar
                            gridOptions={gridOptions}
                            onAddRow={handleAddRow}
                            onDeleteRow={handleDeleteSelectedRows}
                            onDuplicateRow={handleDuplicateSelectedRows}
                            onSearchChange={setSearch}
                            onColumnEdit={handleColumnEdit}
                            classes={classes}
                            onEditModeSwithchEnabled={setEditModeSwitchEnabled}
                            editModeSwitchEnabled={editModeSwitchEnabled}
                            zoomLevel={zoomLevel}
                            onClickZoom={handleZoom}
                            maxZoomVal={maxZoomVal}
                            minZoomVal={minZoomVal}
                            columns={columns}
                            onChangeFilterMenu={handleFilteredColumns}
                            isReArrangable={allowRearrange}
                            search={search}
                            onAddCol={handleAddCol}
                            onClickToggleButton={handleToggleButtonChange}
                            toggleButtonConfig={toggleGridTable}
                        />

                        <div
                            style={{ width: '100%', height: '4px' }}
                            className={classes.backgroundLight}
                        >
                            {processing && (
                                <LinearProgress className={classes.progressBar} variant="query" />
                            )}
                        </div>

                        <TableContainer
                            className={classes.tableBackground}
                            style={{
                                height: gridOptions?.tableHeight
                                    ? `calc(${gridOptions?.tableHeight} / ${zoomLevel})`
                                    : undefined,
                                maxHeight: gridOptions?.tableMaxHeight
                                    ? `calc(${gridOptions?.tableMaxHeight} / ${zoomLevel})`
                                    : gridOptions?.freezing
                                    ? '90%'
                                    : 'auto',
                                zoom: zoomLevel
                            }}
                        >
                            <Table
                                className={clsx(classes.table, {
                                    [classes.fullBorder]: gridOptions.fullBorder
                                })}
                                aria-label="simple table"
                                size={gridOptions?.tableSize}
                                stickyHeader={true}
                            >
                                {gridOptions?.caption ? (
                                    <caption>
                                        {typeof gridOptions?.caption === 'object' ? (
                                            <TextList params={gridOptions?.caption} />
                                        ) : (
                                            <Typography
                                                variant="h5"
                                                className={classes.defaultColor}
                                            >
                                                {gridOptions?.caption}
                                            </Typography>
                                        )}
                                    </caption>
                                ) : null}

                                <TableHead
                                    className={`${classes.backgroundLight} ${classes.stickyHeader}`}
                                    onMouseEnter={() => {
                                        onSetExpansionHover(true);
                                    }}
                                    onMouseLeave={() => {
                                        onSetExpansionHover(false);
                                    }}
                                >
                                    {groupHeaders?.length
                                        ? groupHeaders.map((columns, i) => (
                                              <TableRow
                                                  key={'tableRow' + i}
                                                  className={classes.stickyHeader}
                                              >
                                                  {columns.map((el) => (
                                                      <CustomTableHeaderCell
                                                          key={el.id}
                                                          column={el}
                                                          classes={classes}
                                                          value={el?.coldef?.headerName}
                                                          suppressBorder={
                                                              !gridOptions?.enableGroupHeaderBorder
                                                          }
                                                          setColumnWidths={setColumnWidths}
                                                      />
                                                  ))}
                                              </TableRow>
                                          ))
                                        : null}
                                    <TableRow className={classes.stickyHeader}>
                                        {rowsleftActionsEnabled ? (
                                            <CustomTableHeaderCell
                                                classes={classes}
                                                extraClassName={clsx(
                                                    classes.stickyLeft,
                                                    classes.leftActionCell,
                                                    'sticky-left-col'
                                                )}
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
                                                        {gridOptions?.singleSelectRows ? (
                                                            <CustomTableHeaderCell
                                                                classes={classes}
                                                                extraClassName={classes.stickyLeft}
                                                                style={{ padding: '0' }}
                                                                value={''}
                                                                setColumnWidths={setColumnWidths}
                                                            />
                                                        ) : gridOptions?.multiSelectRows ? (
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
                                                                    classes.selectRowCheckbox,
                                                                    classes.checkboxAlignment
                                                                )}
                                                                indeterminate={isIndeterminate}
                                                            />
                                                        ) : null}
                                                    </div>
                                                }
                                                setColumnWidths={setColumnWidths}
                                            />
                                        ) : null}

                                        {selectedColumns
                                            ?.filter((el) => !el.hide)
                                            .map((el, i) => {
                                                return el?.coldef?.isColHeaderEditable ? (
                                                    <CustomTableCell
                                                        key={el.id}
                                                        value={
                                                            getDeepValue(
                                                                undefined,
                                                                el?.coldef?.field
                                                            ) || el?.coldef?.field
                                                        }
                                                        cellParam={getDeepValue(
                                                            undefined,
                                                            el?.coldef?.cellParamsField
                                                        )}
                                                        calculateStickyPosition={
                                                            calculateStickyPosition
                                                        }
                                                        calculateRightStickyPosition={
                                                            calculateRightStickyPosition
                                                        }
                                                        frozenRows={frozenRows}
                                                        onValueChange={(e) =>
                                                            handleColumnHeaderValueChange(e, el)
                                                        }
                                                        className={clsx(
                                                            classes.defaultColor,
                                                            classes.cellfont
                                                        )}
                                                        sticky={el?.coldef?.sticky}
                                                        stickyColData={stickyColData}
                                                        classes={classes}
                                                        gridOptions={gridOptions}
                                                        column={el}
                                                        isFrozen={frozenColumns.includes(i)}
                                                        onCellRearrange={undefined}
                                                        row={undefined}
                                                        slNo={undefined}
                                                        onShowInsights={undefined}
                                                        rowIndex={undefined}
                                                        colIndex={i}
                                                        onExpansion={undefined}
                                                        editModeSwitchEnabled={false}
                                                        inRowEditModeSwitchEnabled={true}
                                                        search={search}
                                                        dynamicPayload={dynamicPayload}
                                                        zoomLevel={zoomLevel}
                                                        config={config}
                                                        setSearch={setSearch}
                                                        onProgress={props.onProgress}
                                                        app_details={props.app_details}
                                                        columnExpansionHovered={
                                                            columnExpansionHovered
                                                        }
                                                        columnExpansionEnabled={
                                                            gridOptions?.expandableColumns
                                                        }
                                                        hoveredRowIndex={hoveredRowIndex}
                                                        onLockClick={handleLockClick}
                                                        isColDeletable={el?.coldef?.isColDeletable}
                                                        handleDeleteField={handleDeleteField}
                                                        cellId={el.id}
                                                        updateRowsOnColChange={
                                                            updateRowsOnColChange
                                                        }
                                                    />
                                                ) : (
                                                    <CustomTableHeaderCell
                                                        key={el.id}
                                                        column={el}
                                                        classes={classes}
                                                        onResize={columnWidthResizeHandler}
                                                        columnResizeObjects={columnResizeObjects}
                                                        columnExpansionEnabled={
                                                            gridOptions?.expandableColumns
                                                        }
                                                        setColumnWidths={setColumnWidths}
                                                        calculateStickyPosition={
                                                            calculateStickyPosition
                                                        }
                                                        calculateRightStickyPosition={
                                                            calculateRightStickyPosition
                                                        }
                                                        columnWidths={columnWidths}
                                                        colIndex={i}
                                                        frozenColumns={frozenColumns}
                                                        isFrozen={frozenColumns.includes(i)}
                                                        columnExpansionHovered={
                                                            columnExpansionHovered
                                                        }
                                                        value={
                                                            <div
                                                                className="prop-grid-container"
                                                                style={{
                                                                    display: 'grid',
                                                                    alignItems: 'center'
                                                                }}
                                                                onMouseEnter={() =>
                                                                    handleMouseEnter(el.id)
                                                                }
                                                                onMouseLeave={handleMouseLeave}
                                                            >
                                                                <div
                                                                    style={{
                                                                        display: 'flex',
                                                                        gap: '2px'
                                                                    }}
                                                                >
                                                                    <div>
                                                                        {(hoveredColumn === el.id &&
                                                                            gridOptions?.freezing) ||
                                                                        frozenColumns.includes(
                                                                            i
                                                                        ) ? (
                                                                            <LockOutlined
                                                                                className={
                                                                                    classes.lockIconStyle
                                                                                }
                                                                                onClick={() =>
                                                                                    handleFreezeColumn(
                                                                                        i
                                                                                    )
                                                                                }
                                                                                style={{
                                                                                    width: '10',
                                                                                    height: '10'
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            ''
                                                                        )}
                                                                    </div>
                                                                    <div
                                                                        className={
                                                                            classes.headerNameStyle
                                                                        }
                                                                    >
                                                                        {el?.coldef?.headerName}
                                                                    </div>
                                                                </div>

                                                                {gridOptions?.filterColumnData?.includes(
                                                                    el?.coldef?.field
                                                                ) && (
                                                                    <div
                                                                        style={{
                                                                            display: 'flex',
                                                                            flexWrap: 'nowrap',
                                                                            justifyContent:
                                                                                'flex-end',
                                                                            alignItems: 'center'
                                                                        }}
                                                                    >
                                                                        <MultiSelectPopupMenu
                                                                            columns={
                                                                                options?.pseudo[
                                                                                    el?.coldef
                                                                                        ?.field
                                                                                ].value
                                                                            }
                                                                            onChangeFilterMenu={
                                                                                handleFilteredRows
                                                                            }
                                                                            type={'grid'}
                                                                            menuHeight={
                                                                                gridOptions?.menuHeight
                                                                                    ? gridOptions.menuHeight
                                                                                    : 48
                                                                            }
                                                                            iconColor={
                                                                                el?.coldef
                                                                                    ?.headerColor
                                                                            }
                                                                            isFilter={true}
                                                                            zoomLevel={zoomLevel}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        }
                                                        order={order}
                                                        orderBy={orderBy}
                                                        onRequestSort={handleRequestSort.bind(
                                                            null,
                                                            el
                                                        )}
                                                        onSearch={(v) =>
                                                            setColSearch((s) => ({
                                                                ...s,
                                                                [el.key]: v
                                                            }))
                                                        }
                                                        onAddStickyColData={handleStickyColData}
                                                    />
                                                );
                                            })}
                                        {inRowActionsEnabled ? (
                                            <CustomTableHeaderCell
                                                classes={classes}
                                                extraClassName={clsx(
                                                    classes.stickyRight,
                                                    classes.backgroundLight
                                                )}
                                                value={'Actions'}
                                                style={{ padding: 16, zIndex: 3 }}
                                                setColumnWidths={setColumnWidths}
                                            />
                                        ) : null}
                                    </TableRow>
                                </TableHead>
                                {rows && (
                                    <TableBody
                                        onMouseEnter={() => setRowHovered(true)}
                                        onMouseLeave={() => setRowHovered(false)}
                                    >
                                        {rows
                                            ? Pipeline(rows)
                                                  .call(applySorting)
                                                  .call(applyQuickSearch)
                                                  .call(applyColSearch)
                                                  .call(applyPagination)
                                                  .data.map((row, i) => {
                                                      const isTopHalf =
                                                          i < Math.floor(rows.length / 2);

                                                      // Check if the row is frozen in the top or bottom set
                                                      const isFrozenRow = isTopHalf
                                                          ? topFrozenRows.has(i) // Replace with the state variable you manage in the component
                                                          : bottomFrozenRows.has(i);
                                                      return (
                                                          <CustomTableRow
                                                              length={rows.length}
                                                              isTopHalf={isTopHalf}
                                                              key={row.id}
                                                              gridOptions={gridOptions}
                                                              columns={selectedColumns}
                                                              rowHovered={rowHovered}
                                                              onHover={setRowHovered}
                                                              heightResizeHandler={
                                                                  heightResizeHandler
                                                              }
                                                              rowResizeObjects={rowResizeObjects}
                                                              rowExpansionEnabled={
                                                                  gridOptions?.expandableRows
                                                              }
                                                              calculateStickyPosition={
                                                                  calculateStickyPosition
                                                              }
                                                              calculateRightStickyPosition={
                                                                  calculateRightStickyPosition
                                                              }
                                                              bottomFrozenRows={bottomFrozenRows}
                                                              topFrozenRows={topFrozenRows}
                                                              isFrozen={isFrozenRow}
                                                              hoveredRowIndex={hoveredRowIndex}
                                                              setHoveredRowIndex={
                                                                  setHoveredRowIndex
                                                              }
                                                              frozenRows={frozenRows}
                                                              onLockClick={handleLockClick}
                                                              columnExpansionEnabled={
                                                                  gridOptions?.expandableColumns
                                                              }
                                                              columnExpansionHovered={
                                                                  columnExpansionHovered
                                                              }
                                                              toggleFreezeBottomRow={
                                                                  toggleFreezeBottomRow
                                                              }
                                                              toggleFreezeTopRow={
                                                                  toggleFreezeTopRow
                                                              }
                                                              frozenColumns={frozenColumns}
                                                              row={row}
                                                              classes={classes}
                                                              error={row.error}
                                                              index={i}
                                                              slNo={rows.indexOf(row)}
                                                              inRowActionsEnabled={
                                                                  inRowActionsEnabled
                                                              }
                                                              rowsleftActionsEnabled={
                                                                  rowsleftActionsEnabled
                                                              }
                                                              onRowSelect={handleRowSelect.bind(
                                                                  null,
                                                                  row
                                                              )}
                                                              onValueChange={handleValueChange.bind(
                                                                  null,
                                                                  row
                                                              )}
                                                              onAddRow={handleInlineAddRow.bind(
                                                                  null,
                                                                  row
                                                              )}
                                                              onDeleteRow={handleDeleteRow.bind(
                                                                  null,
                                                                  row
                                                              )}
                                                              onCopyRow={handleCopyRow.bind(
                                                                  null,
                                                                  row
                                                              )}
                                                              onRearrange={handleRearrange.bind(
                                                                  null,
                                                                  row
                                                              )}
                                                              onCellRearrange={handleCellRearrange.bind(
                                                                  null,
                                                                  row
                                                              )}
                                                              onDuplicateRow={handleDuplicateRow.bind(
                                                                  null,
                                                                  row
                                                              )}
                                                              onShowInsights={handleShowInsights}
                                                              onExpansion={handleExpansion.bind(
                                                                  null,
                                                                  row
                                                              )}
                                                              stickyColData={stickyColData}
                                                              editModeSwitchEnabled={
                                                                  editModeSwitchEnabled
                                                              }
                                                              hoveredRow={hoveredRow}
                                                              colCount={colCount}
                                                              search={search}
                                                              dynamicPayload={dynamicPayload}
                                                              isReArrangable={allowRearrange}
                                                              zoomLevel={zoomLevel}
                                                              config={config}
                                                              onProgress={props.onProgress}
                                                              app_details={props.app_details}
                                                              onBookMark={handleBookMark.bind(
                                                                  null,
                                                                  row
                                                              )}
                                                              columnWidths={columnWidths}
                                                              setSearch={setSearch}
                                                          ></CustomTableRow>
                                                      );
                                                  })
                                            : null}
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                        {!rows?.length ? (
                            <Typography
                                variant="h2"
                                className={clsx(classes.defaultColor, classes.font1)}
                                align="center"
                                style={{ padding: '1rem 0' }}
                            >
                                No rows
                            </Typography>
                        ) : null}
                        {gridOptions.enablePagination ? (
                            <TablePagination
                                component="div"
                                rowsPerPageOptions={
                                    gridOptions?.paginationSettings?.rowsPerPageOptions || [
                                        5,
                                        10,
                                        25,
                                        { label: 'All', value: -1 }
                                    ]
                                }
                                count={count || rows?.length || 0}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                onPageChange={handleChangePage}
                                classes={{
                                    caption: clsx(classes.font1, classes.defaultColor),
                                    selectRoot: clsx(classes.iconSize, classes.selectRoot),
                                    select: clsx(
                                        classes.font1,
                                        classes.defaultColor,
                                        classes.paginationSelect
                                    ),
                                    root: classes.paginationRoot
                                }}
                            />
                        ) : null}
                        {gridOptions.outerActions ? (
                            <Box
                                width="100%"
                                display="flex"
                                flexWrap="wrap"
                                gridGap="1rem"
                                padding="1.5rem 0"
                            >
                                {gridOptions.outerActions.map((el, i) => {
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
                                                onClick={handleOuterActionClick.bind(null, name)}
                                                aria-label={text || name}
                                            >
                                                {text || name}
                                            </Button>
                                        );
                                    } else {
                                        return (
                                            <div key={'outerActions' + i} style={{ flex: 1 }}>
                                                {' '}
                                            </div>
                                        );
                                    }
                                })}
                            </Box>
                        ) : null}
                    </Paper>
                    {gridOptions?.enableColumnEditor ? (
                        <ColumnEditor
                            open={openColEdit}
                            columns={selectedColumns}
                            gridOptions={gridOptions}
                            onUpdate={handleColumnUpdate}
                            onClose={() => setOpenColEditor(false)}
                        />
                    ) : null}
                    <CellInsights
                        open={cellInsightsOpen}
                        insights={cellInsights}
                        loading={cellInsightsLoading}
                        classes={classes}
                        onClose={() => setCellInsightsOpen(false)}
                    />
                    <CustomSnackbar
                        open={copyError}
                        message={'Error while copying row data'}
                        autoHideDuration={2000}
                        onClose={() => setCopyError((err) => !err)}
                        severity="warning"
                    />
                </div>
            </GridTableContextProvider>
        );
    }
);

function CustomTableHeaderCell({
    value,
    column,
    classes,
    extraClassName,
    orderBy,
    order,
    style,
    setColumnWidths,
    suppressBorder,
    onAddStickyColData,
    onSearch,
    columnWidths,
    onRequestSort,
    onResize,
    colIndex,
    columnResizeObjects,
    columnExpansionEnabled,
    columnExpansionHovered,
    isFrozen,
    calculateStickyPosition,
    calculateRightStickyPosition,
    ...props
}) {
    const cellRef = useRef();
    const sticky = column?.coldef?.sticky;
    const [stickyStyle, setStickyStyle] = useState({});
    const [currentWidth, setCurrenWidth] = useState(null);
    const setHovered = [false];
    const handleSearch = useDebouncedCallback(
        (s) => {
            onSearch(s);
        },
        [],
        500
    );

    const colId = column?.id;
    const CheckResize = (columnId, objects) => {
        if (objects?.length == 0) return undefined;
        let width;
        objects?.forEach((el) => {
            if (el.id == columnId) {
                width = el.width;
            }
        });
        if (width) return width;
        return undefined;
    };
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

        if (columnExpansionEnabled) {
            const columnElement = document.getElementById(`col${column.id}`);
            if (columnElement?.offsetWidth && !CheckResize(column?.id, columnResizeObjects)) {
                const value = columnElement?.offsetWidth;
                setCurrenWidth(value);
            } else if (
                columnResizeObjects?.length > 0 &&
                CheckResize(column?.id, columnResizeObjects) !== undefined
            ) {
                setCurrenWidth(CheckResize(column?.id, columnResizeObjects));
            }
        }
    }, [onAddStickyColData, sticky, colId, columnResizeObjects]);

    useEffect(() => {
        const columnElement = document.getElementById(`col${colId}`);

        setColumnWidths((prev) => {
            const newWidths = [...prev];

            if (newWidths.length <= colId) {
                newWidths.push(columnElement.offsetWidth);
            } else {
                newWidths[colId] = columnElement.offsetWidth;
            }

            return newWidths;
        });
    }, []);

    const handleMouseDown = (event) => {
        if (!currentWidth) {
            return;
        }

        const startX = event?.pageX;
        const curr = currentWidth;

        function handleMouseMove(moveEvent) {
            const curWidth = curr + (moveEvent?.pageX - startX);
            const newWidth = Math.max(curWidth, 50);
            onResize(colId, newWidth);
        }

        function handleMouseUp() {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        try {
            event.preventDefault();
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <TableCell
            className={clsx(
                classes.defaultColor,
                classes.font1,
                classes.backgroundLight,
                extraClassName,
                column?.coldef?.headerClassName,
                suppressBorder ? classes.noBorder : '',
                sticky && 'sticky-left-col',
                // isFrozen && classes.stickyLeft,
                classes.stickyHeader
            )}
            align={column?.coldef?.type === 'number' ? 'right' : 'left'}
            sortDirection={orderBy?.id === column?.id ? order : false}
            classes={{
                root: classes.headerCellRoot
            }}
            ref={cellRef}
            id={`col${column?.id}`}
            colSpan={column?.coldef?.colSpan}
            rowSpan={column?.coldef?.rowSpan}
            style={{
                ...style,
                minWidth: currentWidth
                    ? currentWidth
                    : style?.width
                    ? style.width
                    : column?.coldef?.width,
                width: currentWidth
                    ? currentWidth
                    : style?.width
                    ? style.width
                    : column?.coldef?.width,
                [column?.coldef?.headerBgColor ? 'background' : undefined]:
                    column?.coldef?.headerBgColor,
                [column?.coldef?.headerColor ? 'color' : undefined]: column?.coldef?.headerColor,
                top: cellRef.current?.parentElement?.offsetTop,
                position: isFrozen ? 'sticky' : 'static', // Set position to sticky if column is frozen

                left: isFrozen ? `${calculateStickyPosition(colIndex, columnWidths)}px` : 'unset',
                right: isFrozen
                    ? `${calculateRightStickyPosition(colIndex, columnWidths)}px`
                    : 'unset',
                zIndex: isFrozen ? 3 : 'auto',
                ...stickyStyle
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            {...props}
        >
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative'
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
                            IconComponent={() => <SortIcon style={{ width: 10, height: 10 }} />}
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

                {/* <div style={{ flex: 1 }}></div> */}

                {column?.coldef?.search ? (
                    <TextInput
                        type="text"
                        placeholder="search"
                        fieldInfo={{ placeholder: 'Search' }}
                        onChange={handleSearch}
                    />
                ) : null}
            </div>
            {columnExpansionHovered && columnExpansionEnabled && (
                <div
                    className={classes.colExpansionThumbHoveredHeader}
                    onMouseDown={handleMouseDown}
                ></div>
            )}
        </TableCell>
    );
}

function CustomTableRow({
    gridOptions,
    columns,
    classes,
    row,
    frozenColumns,
    frozenRows,
    slNo,
    error,
    index,
    inRowActionsEnabled,
    colCount,
    onCellRearrange,
    rowsleftActionsEnabled,
    stickyColData,
    editModeSwitchEnabled,
    onRowSelect,
    onCopyRow,
    onValueChange,
    onAddRow,
    onDeleteRow,
    onDuplicateRow,
    onRearrange,
    onShowInsights,
    onExpansion,
    search,
    dynamicPayload,
    isReArrangable,
    zoomLevel,
    config,
    onBookMark,
    setSearch,
    rowResizeObjects,
    heightResizeHandler,
    rowExpansionEnabled,
    columnExpansionEnabled,
    columnExpansionHovered,
    rowHovered,
    onLockClick,
    hoveredRowIndex,
    setHoveredRowIndex,
    isFrozen,
    isTopHalf,
    topFrozenRows,
    bottomFrozenRows,
    toggleFreezeBottomRow,
    calculateRightStickyPosition,
    calculateStickyPosition,
    toggleFreezeTopRow,
    columnWidths,
    isFrozenRow,
    ...props
}) {
    const [draggable, setDraggable] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [currentHeight, setCurrentHeight] = useState(null);
    const handleDragStart = useCallback(
        (e) => {
            e.dataTransfer.setData('draggedId', row.id);
            setDragging(true);
        },
        [row]
    );
    const [inRowActionsOpen, setInRowActionsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [inRowEditModeSwitchEnabled, setInRowEditModeSwitchEnabled] = useState(
        gridOptions?.inRowEditModeSwitch ? gridOptions?.inRowEditModeSwitch > 0 : false
    );
    const MENU_ITEM_HEIGHT = 48;
    const [visible, setVisible] = useState(gridOptions?.lazyRow ? index === 0 : true);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    const hanldeDrop = (e) => {
        e.preventDefault();
        onRearrange(e);
    };

    const handleDragEnd = useCallback(() => {
        setDraggable(false);
        setDragging(false);
    }, []);

    const hanldeDragMouseDown = useCallback(() => {
        setDraggable(true);
    }, []);
    const handleDragMouseUp = useCallback(() => {
        setDraggable(false);
    }, []);
    const handleInActionMenuOpen = useCallback((e) => {
        setInRowActionsOpen(true);
        setAnchorEl(e.currentTarget);
    }, []);

    const observer = useRef();
    const handleRef = (node) => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            setVisible(entries[0].isIntersecting);
        });

        if (node) observer.current.observe(node);
    };

    let rowId = row?.id;

    useEffect(() => {
        if (rowExpansionEnabled) {
            //fetching the defult height of the row and setting it to a state
            const rowElement = document.getElementById(`row${row?.id}`);
            if (rowElement?.offsetHeight && !checkResize(row?.id, rowResizeObjects)) {
                setCurrentHeight(rowElement?.offsetHeight);
            }

            //if height was changed by dragging, changing the height state
            else if (rowResizeObjects?.length > 0 && checkResize(row?.id, rowResizeObjects)) {
                setCurrentHeight(checkResize(row?.id, rowResizeObjects));
            }
        }
    }, [rowResizeObjects]);

    // height expansion handling HOF
    const mouseMovehandler = (event) => {
        if (!currentHeight) {
            return;
        }
        const startY = event?.clientY;
        const curr = currentHeight;

        function handleMouseMove(moveEvent) {
            const curHeight = curr + (moveEvent?.clientY - startY);
            const newHeight = Math.max(curHeight, 30);
            heightResizeHandler(rowId, newHeight);
        }

        function handleMouseUp() {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        try {
            event.preventDefault();
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } catch (err) {
            console.error(err);
        }
    };
    const checkResize = (id, objects) => {
        if (objects?.length == 0) return undefined;
        let height;
        objects?.forEach((el) => {
            if (el.id == id) {
                height = el.height;
            }
        });
        if (height) return height;
        return undefined;
    };

    const calculateTopOffset = (rowIndex, frozenRowsSet) => {
        const frozenRowsArray = Array.from(frozenRowsSet);
        const frozenRowIndex = frozenRowsArray.indexOf(rowIndex);

        return frozenRowIndex >= 0 ? 25 + frozenRowIndex * 25 : 0;
    };

    const calculateBottomOffset = (rowIndex, frozenRowsSet) => {
        const frozenRowsArray = Array.from(frozenRowsSet);

        const frozenRowIndex = frozenRowsArray.indexOf(rowIndex);
        return frozenRowIndex >= 0 ? frozenRowIndex * 25 : 0;
    };

    const topOffset = isFrozen && isTopHalf ? calculateTopOffset(index, topFrozenRows) : 0;

    const bottomOffset =
        isFrozen && !isTopHalf ? calculateBottomOffset(index, bottomFrozenRows) : undefined;

    return (
        <Fragment>
            <TableRow
                onMouseEnter={() => setHoveredRowIndex(index)}
                onMouseLeave={() => setHoveredRowIndex(null)}
                draggable={draggable}
                onDragStart={handleDragStart}
                onDragOver={isReArrangable ? handleDragOver : () => {}}
                onDrop={isReArrangable ? hanldeDrop : () => {}}
                onDragEnd={handleDragEnd}
                key={row.id}
                ref={gridOptions?.lazyRow ? handleRef : null}
                style={{
                    [row.highlight && row.highlightBgColor ? 'background' : null]:
                        row.highlightBgColor,
                    '--row-level': row.level,
                    height: currentHeight ? currentHeight : undefined,

                    position: isFrozen ? 'sticky' : 'relative',
                    top: isFrozen && isTopHalf ? `${topOffset}px` : '0px',
                    bottom: isFrozen && !isTopHalf ? `${bottomOffset}px` : 'unset',
                    zIndex: isFrozen
                        ? 110 +
                          (isTopHalf
                              ? Array.from(topFrozenRows).indexOf(rowId)
                              : Array.from(bottomFrozenRows).indexOf(rowId))
                        : 0
                }}
                id={`row${row?.id}`}
                className={clsx(classes.tableRow, isFrozen && classes.freezingsticky, {
                    [classes.hoverRow]: gridOptions.enableHoverRow,
                    [classes.selectedRow]: row.selected,
                    [classes.errorRow]: error,
                    [classes.draggedEle]: dragging,
                    [classes.highlightRow]: row.highlight,
                    [classes.flash]: row.flashEnabled,
                    [classes.stripeTableRow]: gridOptions.stripeRow,
                    [classes.childRowOdd]: row.level % 2 === 1,
                    [classes.childEvenRow]: row.level ? row.level % 2 === 0 : false,
                    [classes.noBorderRow]: gridOptions?.suppressRowBorder,
                    [classes.rootParentRow]: row.level === 0
                })}
            >
                {/* {hoveredRowIndex==index && gridOptions.freezing &&(
                <TableCell style={{width:'2px', position:'relative'}}>

                                      <LockOutlined
                                      style={{
                                          cursor: 'pointer',
                                          position:'relative',
                                          top:'2px'

                                      }}
                                      onClick={() => handleDoubleClick(index)} />

                </TableCell>
                )} */}

                {visible ? (
                    <>
                        {rowsleftActionsEnabled ? (
                            <TableCell
                                style={{ width: 0, padding: 0 }}
                                className={clsx(classes.stickyLeft, classes.z1, {
                                    [classes.flash]: row.flashEnabled
                                })}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'nowrap',
                                        alignItems: 'center'
                                    }}
                                >
                                    {isReArrangable ? (
                                        <IconButton
                                            onMouseDown={hanldeDragMouseDown}
                                            onMouseUp={handleDragMouseUp}
                                            title="drag row"
                                            style={{ marginRight: 0 }}
                                            size="small"
                                            aria-label="Drag"
                                        >
                                            <span className={classes.leftRowActionIcon}>
                                                <DragIndicatorIcon className={classes.font2} />
                                            </span>
                                        </IconButton>
                                    ) : null}
                                    {gridOptions?.singleSelectRows ? (
                                        <Radio
                                            checked={row.selected}
                                            onChange={(e) => onRowSelect(e.target.checked)}
                                            inputProps={{ 'aria-label': 'select row' }}
                                            className={clsx(
                                                classes.iconSize,
                                                classes.selectRowCheckbox
                                            )}
                                        />
                                    ) : gridOptions.multiSelectRows ? (
                                        <Checkbox
                                            checked={row.selected}
                                            onChange={(e) => onRowSelect(e.target.checked)}
                                            inputProps={{ 'aria-label': 'select row' }}
                                            className={clsx(
                                                classes.iconSize,
                                                classes.selectRowCheckbox
                                            )}
                                        />
                                    ) : null}
                                    {gridOptions.bookmark ? (
                                        <StarOutlinedIcon
                                            onClick={() => onBookMark()}
                                            className={classes.bookmarkIcon}
                                            style={{
                                                fill: row.data.bookmarked
                                                    ? '#FFC700'
                                                    : 'transparent',
                                                stroke: '#FFC700'
                                            }}
                                        />
                                    ) : null}
                                </div>
                                {columnExpansionHovered && columnExpansionEnabled && (
                                    <div className={classes.colExpansionThumbHovered}></div>
                                )}
                            </TableCell>
                        ) : null}

                        {columns
                            ?.filter((el) => !el.hide)
                            .map((col, i) => (
                                <CustomTableCell
                                    key={row.id + ' ' + col.id}
                                    value={getDeepValue(row?.data, col?.coldef?.field)}
                                    cellParam={getDeepValue(
                                        row?.data,
                                        col?.coldef?.cellParamsField
                                    )}
                                    columnWidths={columnWidths}
                                    colid={col.id}
                                    frozenRows={frozenRows}
                                    onValueChange={onValueChange.bind(null, col)}
                                    className={clsx(classes.defaultColor, classes.cellfont)}
                                    sticky={col?.coldef?.sticky}
                                    stickyColData={stickyColData}
                                    classes={classes}
                                    gridOptions={gridOptions}
                                    column={col}
                                    isFrozenRow={isFrozenRow}
                                    isFrozencol={frozenColumns.includes(i)}
                                    onCellRearrange={onCellRearrange.bind(null, col)}
                                    row={row}
                                    slNo={slNo}
                                    onShowInsights={onShowInsights}
                                    rowIndex={index}
                                    colIndex={i}
                                    onExpansion={onExpansion}
                                    editModeSwitchEnabled={editModeSwitchEnabled}
                                    inRowEditModeSwitchEnabled={inRowEditModeSwitchEnabled}
                                    search={search}
                                    dynamicPayload={dynamicPayload}
                                    zoomLevel={zoomLevel}
                                    config={config}
                                    setSearch={setSearch}
                                    onProgress={props.onProgress}
                                    app_details={props.app_details}
                                    columnExpansionHovered={columnExpansionHovered}
                                    columnExpansionEnabled={columnExpansionEnabled}
                                    hoveredRowIndex={hoveredRowIndex} // Pass hovered row index for hover functionality
                                    onLockClick={onLockClick}
                                    calculateStickyPosition={calculateStickyPosition}
                                    calculateRightStickyPosition={calculateRightStickyPosition}
                                    toggleFreezeBottomRow={toggleFreezeBottomRow}
                                    toggleFreezeTopRow={toggleFreezeTopRow}
                                    isTopHalf={isTopHalf}
                                    topFrozenRows={topFrozenRows}
                                    bottomFrozenRows={bottomFrozenRows}
                                />
                            ))}

                        {inRowActionsEnabled ? (
                            <TableCell
                                style={{ width: 0, padding: 16 }}
                                className={clsx(classes.stickyRight, classes.z1, {
                                    [classes.flash]: row.flashEnabled
                                })}
                            >
                                <Box display="flex" flexWrap="no-wrap">
                                    {gridOptions?.enableInRowDuplicate &&
                                    !row.suppressDuplicateRow ? (
                                        <IconButton
                                            onClick={onDuplicateRow}
                                            title="duplicate row"
                                            style={{ marginRight: 0 }}
                                            size="small"
                                            aria-label="Duplicate row"
                                        >
                                            <FileCopyIcon className={classes.font2} />
                                        </IconButton>
                                    ) : null}

                                    {gridOptions?.enableInRowDelete && !row.suppressDelete ? (
                                        <IconButton
                                            onClick={onDeleteRow}
                                            title="delete row"
                                            style={{ marginRight: 0 }}
                                            size="small"
                                            aria-label="Delete"
                                        >
                                            <DeleteIcon className={classes.font2} />
                                        </IconButton>
                                    ) : null}

                                    {gridOptions?.inRowEditModeSwitch ? (
                                        <Switch
                                            size="small"
                                            title={
                                                inRowEditModeSwitchEnabled ? 'Stop Edit' : 'Edit'
                                            }
                                            checked={inRowEditModeSwitchEnabled}
                                            onChange={(e, checked) =>
                                                setInRowEditModeSwitchEnabled(checked)
                                            }
                                        />
                                    ) : null}

                                    {gridOptions?.enableRowCopy ? (
                                        <IconButton
                                            aria-label="Copy"
                                            size="small"
                                            onClick={onCopyRow}
                                        >
                                            <FileCopyIcon className={classes.font2} />
                                        </IconButton>
                                    ) : null}

                                    {gridOptions?.inRowActions &&
                                    !(row.suppressInRowActions === true) ? (
                                        <>
                                            <IconButton
                                                aria-label="more"
                                                aria-controls="long-menu"
                                                aria-haspopup="true"
                                                size="small"
                                                onClick={handleInActionMenuOpen}
                                                title="more actions"
                                                focusRipple={inRowActionsOpen}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                            <Menu
                                                id="long-menu"
                                                anchorEl={anchorEl}
                                                open={inRowActionsOpen}
                                                onClose={setInRowActionsOpen.bind(null, false)}
                                                PaperProps={{
                                                    style: {
                                                        maxHeight: MENU_ITEM_HEIGHT * 4.5
                                                    }
                                                }}
                                                getContentAnchorEl={null}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right'
                                                }}
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right'
                                                }}
                                            >
                                                {(gridOptions?.inRowActions === true ||
                                                    gridOptions?.inRowActions?.addRowAbove) &&
                                                !row.suppressInRowActions?.addRowAbove ? (
                                                    <MenuItem
                                                        onClick={() => {
                                                            onAddRow(-1);
                                                            setInRowActionsOpen(false);
                                                        }}
                                                    >
                                                        Add Row Above
                                                    </MenuItem>
                                                ) : null}
                                                {(gridOptions?.inRowActions === true ||
                                                    gridOptions?.inRowActions?.addRowBellow) &&
                                                !row.suppressInRowActions?.addRowBellow ? (
                                                    <MenuItem
                                                        onClick={() => {
                                                            onAddRow(+1);
                                                            setInRowActionsOpen(false);
                                                        }}
                                                    >
                                                        Add Row Bellow
                                                    </MenuItem>
                                                ) : null}
                                                {(gridOptions?.inRowActions === true ||
                                                    gridOptions?.inRowActions?.duplicateRowAbove) &&
                                                !row.suppressInRowActions?.duplicateRowAbove ? (
                                                    <MenuItem
                                                        onClick={() => {
                                                            onDuplicateRow(-1);
                                                            setInRowActionsOpen(false);
                                                        }}
                                                    >
                                                        Duplicate Row Above
                                                    </MenuItem>
                                                ) : null}
                                                {(gridOptions?.inRowActions === true ||
                                                    gridOptions?.inRowActions
                                                        ?.duplicateRowBellow) &&
                                                !row.suppressInRowActions?.duplicateRowBellow ? (
                                                    <MenuItem
                                                        onClick={() => {
                                                            onDuplicateRow(+1);
                                                            setInRowActionsOpen(false);
                                                        }}
                                                    >
                                                        Duplicate Row Bellow
                                                    </MenuItem>
                                                ) : null}
                                                {(gridOptions?.inRowActions === true ||
                                                    gridOptions?.inRowActions?.deleteRow) &&
                                                !row.suppressInRowActions?.deleteRow ? (
                                                    <MenuItem onClick={onDeleteRow}>
                                                        Delete Row
                                                    </MenuItem>
                                                ) : null}
                                            </Menu>
                                        </>
                                    ) : null}
                                </Box>
                                {columnExpansionHovered && columnExpansionEnabled && (
                                    <div className={classes.colExpansionThumbHovered}></div>
                                )}
                            </TableCell>
                        ) : null}
                    </>
                ) : (
                    <TableCell
                        className={clsx(
                            classes.grayColor,
                            classes.font1,
                            classes.stickyLeft,
                            classes.z1
                        )}
                        colSpan={colCount}
                    >
                        Loading...
                    </TableCell>
                )}
            </TableRow>
            {/* This row acts as a draggable handle for resizing the row height*/}

            {rowExpansionEnabled && rowHovered && (
                <TableRow style={{ height: '5px' }}>
                    {columns?.filter((el) => !el.hide) && (
                        <TableCell
                            style={{ cursor: 'ns-resize', padding: 0, border: 'none' }}
                            colSpan={columns?.filter((el) => !el.hide)?.length + 1}
                            onMouseDown={mouseMovehandler}
                        >
                            <div className={classes.rowExpansionHandle} />
                        </TableCell>
                    )}
                </TableRow>
            )}
        </Fragment>
    );
}

function TableToolBar({
    gridOptions,
    editModeSwitchEnabled,
    onAddRow,
    onDeleteRow,
    onSearchChange,
    onClickZoom,
    zoomLevel,
    minZoomVal,
    maxZoomVal,
    onDuplicateRow,
    onColumnEdit,
    onEditModeSwithchEnabled,
    classes,
    columns,
    onChangeFilterMenu,
    search,
    onAddCol,
    onClickToggleButton,
    toggleButtonConfig
}) {
    if (gridOptions?.suppressToolBar) {
        return null;
    }
    return (
        <Toolbar className={classes.toolBar}>
            {gridOptions?.tableTitle ? (
                <Typography
                    className={classes.defaultColor}
                    variant="h4"
                    style={{ ...gridOptions?.tableTitleStyle }}
                >
                    {gridOptions?.tableTitle}
                </Typography>
            ) : null}

            {toggleButtonConfig ? (
                <CodxToggleButtonSwitch
                    classes={{
                        toolBarText: classes.toggleButtonLabel,
                        toggleButton: classes.toggleButton
                    }}
                    elementProps={toggleButtonConfig}
                    onChange={onClickToggleButton}
                />
            ) : null}

            {gridOptions?.editModeSwitch ? (
                <FormControlLabel
                    control={
                        <Switch
                            size="small"
                            checked={editModeSwitchEnabled}
                            onChange={(e, checked) => onEditModeSwithchEnabled(checked)}
                        />
                    }
                    label="Edit"
                />
            ) : null}

            {gridOptions?.filterDropdownSwitch ? (
                <>
                    <MultiSelectPopupMenu
                        columns={columns}
                        onChangeFilterMenu={onChangeFilterMenu}
                        type={'grid'}
                    />
                </>
            ) : null}

            {gridOptions?.enableDeleteRow ? (
                <IconButton
                    onClick={() => onDeleteRow()}
                    title="delete row"
                    aria-label="Delete row"
                >
                    <DeleteIcon className={classes.font2} />
                </IconButton>
            ) : null}

            {gridOptions?.enableDuplicateRow ? (
                <IconButton
                    onClick={() => onDuplicateRow()}
                    title="duplicate row"
                    aria-label="Duplicate row"
                >
                    <FileCopyIcon className={classes.font2} />
                </IconButton>
            ) : null}

            {gridOptions?.enableColumnEditor ? (
                <IconButton onClick={onColumnEdit} title="edit column" aria-label="Edit column">
                    <TableChartIcon className={classes.font2} />
                </IconButton>
            ) : null}

            {gridOptions?.enableAddRow ? (
                <IconButton
                    onClick={onAddRow}
                    title={gridOptions?.addRowTooltip || 'add row'}
                    aria-label="Add row"
                >
                    <PlaylistAddIcon className={classes.font2} />
                </IconButton>
            ) : null}
            {gridOptions?.enableAddCol ? (
                <IconButton
                    onClick={onAddCol}
                    title={gridOptions?.addColTooltip || 'add column'}
                    aria-label="Add col"
                >
                    <LibraryAddOutlinedIcon className={classes.font2} />
                </IconButton>
            ) : null}

            {gridOptions?.enableZoom ? (
                <ButtonGroup
                    size="small"
                    variant="text"
                    aria-label="text primary button group"
                    className={classes.zoomButtons}
                >
                    <Button
                        onClick={() => onClickZoom(-1)}
                        title="zoom out"
                        disabled={zoomLevel <= minZoomVal ? true : false}
                        aria-label="Zoom out"
                    >
                        <ZoomOutIcon fontSize="large" />
                    </Button>
                    <Typography
                        variant="h5"
                        style={{ padding: '1rem' }}
                        className={classes.defaultColor}
                    >
                        {Math.round(zoomLevel * 100)} %
                    </Typography>
                    <Button
                        onClick={() => onClickZoom(1)}
                        title="zoom in"
                        disabled={zoomLevel >= maxZoomVal ? true : false}
                        aria-label="Zoom in"
                    >
                        <ZoomInIcon fontSize="large" />
                    </Button>
                </ButtonGroup>
            ) : null}

            <Box flex={1} />

            {gridOptions?.quickSearch ? (
                <div style={{ width: gridOptions?.searchSuggestions ? '100%' : '50rem' }}>
                    <SearchBar
                        onChangeWithDebounce={onSearchChange}
                        placeholder={gridOptions?.quickSearchLabel || 'Quick search...'}
                        suggestions={gridOptions?.searchSuggestions}
                        suggestionParams={gridOptions?.suggestionProps}
                        value={search}
                    />
                </div>
            ) : null}
        </Toolbar>
    );
}

function mergeColdef(column, cellParam) {
    if (column?.coldef && cellParam) {
        const coldef = { ...column?.coldef };
        Object.assign(coldef, cellParam.coldef);
        const coldefOverride = cellParam.coldefOverride;
        if (coldefOverride) {
            Object.keys(coldefOverride).forEach((key) => {
                if (typeof coldef[key] === 'object') {
                    coldef[key] = Object.assign({}, coldef[key], coldefOverride[key]);
                } else {
                    coldef[key] = coldefOverride[key];
                }
            });
        }
        return coldef;
    }
    return column?.coldef;
}

function CustomTableCell({
    value,
    cellParam,
    frozenRows,
    column,
    stickyColData,
    editModeSwitchEnabled,
    onCellRearrange,
    inRowEditModeSwitchEnabled,
    onValueChange,
    gridOptions,
    slNo,
    isFrozenRow,
    sticky,
    row,
    isFrozencol,
    className,
    classes,
    onShowInsights,
    rowIndex,
    colIndex,
    onExpansion,
    search,
    hoveredRowIndex,
    dynamicPayload,
    zoomLevel,
    config,
    setSearch,
    columnExpansionHovered,
    columnExpansionEnabled,
    isColDeletable,
    handleDeleteField,
    cellId,
    updateRowsOnColChange,
    toggleFreezeBottomRow,
    toggleFreezeTopRow,
    isTopHalf,
    calculateStickyPosition,
    columnWidths,
    calculateRightStickyPosition,

    ...props
}) {
    const [_value, setValue] = useState(value);
    const [active, setActive] = useState(false);

    const handleValueChange = useCallback(
        (v, params) => {
            setValue(v);
            onValueChange(v, params);
        },
        [onValueChange]
    );
    const [coldef, setColdef] = useState(mergeColdef(column, cellParam));
    const { isBlocked, setCellSpan } = useContext(GridTableContext);

    coldef?.cellEditor == 'select' &&
        coldef?.cellEditorParams?.preSelected &&
        coldef?.cellEditorParams?.preSelected == _value &&
        setColdef({
            headerName: coldef?.headerName,
            headerBgColor: coldef?.headerBgColor,
            field: coldef?.field,
            headerColor: coldef?.headerColor
        });

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const hanldeDrop = (e) => {
        e.preventDefault();
        onCellRearrange(e);
    };

    const handleDragStart = useCallback(
        (e) => {
            e.dataTransfer.setData('draggedRowId', row.id);
        },
        [row]
    );

    useEffect(() => {
        setCellSpan(
            rowIndex,
            colIndex,
            search ? 1 : cellParam?.colSpan,
            search ? 1 : cellParam?.rowSpan
        );
    }, [setCellSpan, rowIndex, colIndex, cellParam]);

    useEffect(() => {
        setColdef(mergeColdef(column, cellParam));
    }, [column, cellParam]);

    const handleActiveEdit = useCallback(
        (active) => {
            if (coldef?.editable) {
                setActive(active);
            }
            if (coldef?.isCustomCol && coldef?.isColHeaderEditable && updateRowsOnColChange) {
                updateRowsOnColChange(_value, column);
            }
        },
        [coldef]
    );

    const handleFormChange = useCallback(
        (data, params, action) => {
            onValueChange(data, params, action);
        },
        [onValueChange]
    );

    const handleActionButtonClick = useCallback(
        (el, params) => {
            const action = typeof el === 'string' ? el : el.name;
            onValueChange(el, params, action);
        },
        [onValueChange]
    );

    const editor = useMemo(() => {
        const params = {
            ...coldef?.cellEditorParams,
            error: cellParam?.error,
            data: row.data,
            helperText: cellParam?.helperText,
            value: _value === undefined ? coldef?.cellEditorParams?.value : _value,
            isColDeletable,
            cellId
        };
        if (coldef?.actionParams) {
            params['actionParams'] = coldef.actionParams;
        }

        const handleTags = (val) => {
            setSearch(val);
        };
        const CellEditor = coldef?.cellEditor;
        if (['select', 'date', 'dateTime'].includes(CellEditor)) {
            params.zoomLevel = zoomLevel;
        }
        let obj = { style: { marginTop: 0, padding: 0 }, ...params };
        if (coldef?.editable) {
            setActive(true);
        }
        switch (CellEditor) {
            case 'number':
                return (
                    <NumberInput
                        onChange={handleValueChange}
                        fieldInfo={params}
                        onBlur={handleActiveEdit.bind(null, false)}
                    />
                );
            case 'text':
                return (
                    <TextInput
                        onChange={handleValueChange}
                        fieldInfo={params}
                        onBlur={handleActiveEdit.bind(null, false)}
                        handleDeleteField={handleDeleteField}
                    />
                );
            case 'select':
                return (
                    <SimpleSelect
                        onChange={handleValueChange}
                        fieldInfo={obj}
                        onBlur={handleActiveEdit.bind(null, false)}
                    />
                );
            case 'date':
                return (
                    <DatePicker
                        onChange={handleValueChange}
                        fieldInfo={params}
                        onBlur={handleActiveEdit.bind(null, false)}
                    />
                );
            case 'dateTime':
                return (
                    <DateTimePicker
                        onChange={handleValueChange}
                        fieldInfo={params}
                        onBlur={handleActiveEdit.bind(null, false)}
                    />
                );
            case 'checkbox':
                return (
                    <CustomCheckbox
                        onChange={(v) => handleValueChange(v, params)}
                        params={params}
                        onBlur={handleActiveEdit.bind(null, false)}
                    />
                );
            case 'radio':
                return (
                    <CustomRadio
                        onChange={(v) => handleValueChange(v, params)}
                        params={params}
                        onBlur={handleActiveEdit.bind(null, false)}
                    />
                );
            case 'rich-text':
                return (
                    <TextEditor2 onChange={handleValueChange} content={params.value} {...params} />
                );
            case 'actionButtons':
                return (
                    <ActionButtons
                        params={params.value}
                        align={coldef?.valueAlign || coldef?.align}
                        confirm={params.confirm}
                        onClick={(el) => handleActionButtonClick(el, params)}
                    />
                );
            case 'upload':
                return (
                    <FileUploadCell
                        onChange={handleValueChange}
                        params={params.options}
                        coldef={coldef}
                        column={column}
                        row={row}
                    />
                );
            case 'rowEditorPopup': {
                const form_config = JSON.parse(
                    JSON.stringify({
                        ...params.form_config,
                        fields: reverseMapValue(params.form_config.fields, row.data)
                    })
                );
                return (
                    <DynamicFormModal
                        params={{
                            ...params,
                            dialog: { ...params.dialog, title: _value },
                            trigger_button: { ...params.trigger_button, text: _value },
                            form_config: form_config
                        }}
                        onAction={(action, data) => handleFormChange(data, params, action)}
                    />
                );
            }
            case 'comment':
                return (
                    <CommentPopUp
                        onChange={handleValueChange}
                        content={params}
                        enableRestriction={column?.coldef?.enableRestriction}
                        dynamicPayload={dynamicPayload}
                    />
                );
            case 'icon':
                return (
                    <IconEditor
                        params={params}
                        handleValueChange={handleValueChange}
                        handleActiveEdit={handleActiveEdit.bind(null, false)}
                    />
                );
            case 'tag':
                // eslint-disable-next-line no-case-declarations
                const tagData = Array.isArray(row.data[coldef?.field])
                    ? row.data[coldef?.field]
                    : [];
                return (
                    <TagsRenderer
                        onChange={handleValueChange}
                        params={params.options}
                        tagData={tagData}
                        handleTags={handleTags}
                    />
                );
            default:
                if (React.isValidElement(CellEditor) || typeof CellEditor === 'function') {
                    return (
                        <CellEditor
                            params={{ ...params, row, column: { ...column, coldef: coldef } }}
                            onChange={handleValueChange}
                            onBlur={handleActiveEdit.bind(null, false)}
                        />
                    );
                } else return null;
        }
    }, [
        column,
        coldef,
        handleValueChange,
        _value,
        row,
        handleActiveEdit,
        cellParam,
        handleFormChange,
        handleActionButtonClick
    ]);

    const renderer = useMemo(() => {
        const params = {
            ...coldef?.cellRendererParams,
            value: _value === undefined ? coldef?.cellRendererParams?.value : _value
        };
        const CellRenderer = coldef?.cellRenderer;
        const comp = (() => {
            switch (CellRenderer) {
                case 'icon':
                    return <IconRenderer params={params} row={row} column={column} />;
                case 'date':
                    return <DateRenderer params={params} row={row} column={column} />;
                case 'checkbox':
                    return (
                        <CustomCheckbox
                            params={{ ...params, disabled: true }}
                            row={row}
                            column={column}
                        />
                    );
                case 'radio':
                    return (
                        <CustomRadio
                            params={{ ...params, disabled: true }}
                            row={row}
                            column={column}
                        />
                    );
                case 'stackedElemets':
                    return <StackElements params={params} row={row} column={column} />;
                case 'appScreenNavigate':
                    return <AppScreenNavigate params={params} row={row} column={column} />;
                case 'localNumber':
                    return params.value ? params.value.toLocaleString() : params.value;
                case 'slNo':
                    return slNo + (params.slNoOffset || 0);
                case 'downloadLink':
                    return <DownloadLink params={{ ...params, url: params?.value }} />;
                case 'downloadWorkbook':
                    return (
                        <DownloadWorkBook
                            {...params}
                            tableData={params?.value}
                            filename={params?.filename}
                        />
                    );
                case 'progressloader':
                    return (
                        <CodexProgressLoader
                            hasbuffer={false}
                            coldef={coldef}
                            progress_info={row.data}
                            onProgress={props.onProgress}
                            app_details={props.app_details}
                        />
                    );
                case 'plotly':
                    return (
                        <AppWidgetPlot
                            params={row.data[coldef?.field]}
                            size_nooverride={config.size_nooverride}
                            color_nooverride={config.color_nooverride}
                            trace_config={config.traces}
                            showDialog={true}
                        />
                    );

                case 'link':
                    if (typeof params?.value == 'string') {
                        return (
                            <a href={params?.value?.trim()} target="new">
                                {params?.value?.trim()}
                            </a>
                        );
                    }
                    break;
                default:
                    if (React.isValidElement(CellRenderer) || typeof CellRenderer === 'function') {
                        return <CellRenderer params={params} row={row} column={column} />;
                    } else return params.value;
            }
        })();

        return comp;
    }, [column, coldef, _value, row, slNo, value]);

    // need to implement logic:
    // display renderer by default.
    // and, once double clicked open editor
    // once editing in completed render the renderer again
    const clickEditRenderer = useMemo(() => {
        return (
            <Fragment>
                <div
                    onDoubleClick={handleActiveEdit.bind(null, true)}
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        cursor: 'pointer'
                    }}
                ></div>
                <span className={classes.bodyCellValue}>{active ? editor : renderer}</span>
            </Fragment>
        );
    }, [renderer, handleActiveEdit, active, editor]);

    let cellContent;
    if (gridOptions.editorMode) {
        if (gridOptions?.inRowEditModeSwitch) {
            if (inRowEditModeSwitchEnabled) {
                if (coldef?.editable && !row?.notEditable) {
                    cellContent = editor;
                } else {
                    cellContent = renderer;
                }
            } else {
                cellContent = renderer;
            }
        } else if (gridOptions?.editModeSwitch) {
            if (editModeSwitchEnabled) {
                if (coldef?.editable && !row?.notEditable) {
                    cellContent = editor;
                } else {
                    cellContent = renderer;
                }
            } else {
                cellContent = renderer;
            }
        } else {
            if (coldef?.editable && !row?.notEditable) {
                cellContent = editor;
            } else {
                cellContent = renderer;
            }
        }
    } else if (coldef?.cellRenderer) {
        // if none of the above checks pass
        // this cell has no edit requirements
        // we can use a wildcard cellRenderer property to render different properties
        cellContent = renderer;
    } else {
        cellContent = clickEditRenderer;
    }
    const handleClick = (e) => {
        if (coldef.enableCellInsights) {
            if (onShowInsights) {
                onShowInsights(e, { row, column, coldef, cellParam });
            }
        }
    };
    if (search) {
        if (!search && isBlocked(rowIndex, colIndex)) {
            return null;
        }
    } else {
        if (isBlocked(rowIndex, colIndex)) {
            return null;
        }
    }

    const Expansion = () => {
        if (coldef.rowExpandable && row.childrenRowData?.length) {
            return (
                <IconButton
                    size="small"
                    onClick={() => {
                        onExpansion(!row.expanded);
                    }}
                    aria-label="Expand"
                >
                    {row.expanded ? (
                        <ExpandLessIcon fontSize="large" />
                    ) : (
                        <ExpandMoreIcon fontSize="large" />
                    )}
                </IconButton>
            );
        } else {
            return null;
        }
    };

    let stickyStyle;
    if (sticky) {
        stickyStyle = {
            position: 'sticky',
            left: stickyColData[column.id],
            zIndex: 1
        };
    }
    return (
        <TableCell
            align={typeof value === 'number' ? 'right' : 'left'}
            onClick={handleClick}
            id={row?.id + ' ' + column?.id}
            colSpan={search ? 1 : cellParam?.colSpan}
            rowSpan={search ? 1 : cellParam?.rowSpan}
            {...props}
            title={cellParam?.tooltip || coldef?.tooltip}
            style={{
                width: column?.coldef?.width,

                [coldef?.bgColor ? 'background' : null]: coldef?.bgColor,
                [cellParam?.bgColor ? 'background' : null]: cellParam?.bgColor,
                [cellParam?.highlight && cellParam?.highlightBgColor ? 'background' : null]:
                    cellParam?.highlightBgColor,

                [coldef?.color ? 'color' : undefined]: coldef?.color,
                [cellParam?.color ? 'color' : undefined]: cellParam?.color,
                [cellParam?.textDecoration ? 'textDecoration' : undefined]:
                    cellParam?.textDecoration,
                fontWeight: coldef?.bold || cellParam?.bold ? 500 : '',
                [!gridOptions?.cellFontSize && cellParam?.fontSize
                    ? 'font-size'
                    : null]: `${cellParam?.fontSize}rem`,
                [!gridOptions?.cellFontSize && row?.data?.fontSize && !cellParam?.fontSize
                    ? 'font-size'
                    : null]: `${row?.data?.fontSize}rem`,
                [!gridOptions?.cellFontSize && !row?.data?.fontSize
                    ? coldef?.fontSize && !cellParam?.fontSize
                        ? 'font-size'
                        : null
                    : null]: `${coldef?.fontSize}rem`,
                [!gridOptions?.cellFontStyle && cellParam?.fontStyle ? 'font-style' : null]:
                    cellParam?.fontStyle,
                [!gridOptions?.cellFontStyle && row?.data?.fontStyle && !cellParam?.fontStyle
                    ? 'font-style'
                    : null]: row?.data?.fontStyle,
                [!gridOptions?.cellFontStyle && !row?.data?.fontStyle
                    ? coldef?.fontStyle && !cellParam?.fontStyle
                        ? 'font-style'
                        : null
                    : null]: coldef?.fontStyle,
                position: isFrozencol ? 'sticky' : 'relative', // Set position to sticky if column is frozen

                left: isFrozencol
                    ? `${calculateStickyPosition(colIndex, columnWidths)}px`
                    : 'unset',
                right: isFrozencol
                    ? `${calculateRightStickyPosition(colIndex, columnWidths)}px`
                    : 'unset',
                zIndex: isFrozencol ? 3 : 'auto',
                ...stickyStyle
            }}
            className={clsx(
                isFrozencol && classes.freezingsticky,

                {
                    [className]: true,
                    [classes.highlightCell]: cellParam?.highlight,
                    [classes.errorCell]: cellParam?.error,
                    [classes.clickable]: coldef.enableCellInsights
                },
                coldef.cellClassName
            )}
        >
            {coldef?.draggableCell ? (
                <div
                    style={{ display: 'flex', alignItems: 'center' }}
                    draggable={true}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={hanldeDrop}
                >
                    <IconButton
                        title="drag cell"
                        style={{ marginRight: '0.5rem' }}
                        size="small"
                        aria-label="Drag cell"
                    >
                        <DragIndicatorIcon className={classes.font2} />
                    </IconButton>
                    {cellContent}
                </div>
            ) : coldef?.textDecoration === 'underline' &&
              !(gridOptions.freezing || frozenRows.includes(rowIndex)) ? (
                <div className={classes.cellContentWrapper}>{cellContent}</div>
            ) : (
                ''
            )}
            {gridOptions.freezing || frozenRows.includes(rowIndex) ? (
                <div
                    style={{ display: 'flex', gap: '3px', top: '-3px', padding: '0px' }}
                    onClick={() =>
                        isTopHalf ? toggleFreezeTopRow(rowIndex) : toggleFreezeBottomRow(rowIndex)
                    }
                >
                    <div>
                        {colIndex === 0 && (hoveredRowIndex === rowIndex || isFrozenRow) && (
                            <LockOutlined
                                style={{
                                    cursor: 'pointer',
                                    padding: '0px',
                                    width: '10',
                                    height: '10'
                                }}
                                fontSize="10px"
                            />
                        )}
                    </div>
                    {coldef?.textDecoration === 'underline' ? (
                        <div className={classes.cellContentWrapper}>{cellContent}</div>
                    ) : (
                        <div>{cellContent}</div>
                    )}
                </div>
            ) : (
                coldef?.textDecoration !== 'underline' && cellContent
            )}

            <Expansion />
            {columnExpansionHovered && columnExpansionEnabled && (
                <div className={classes.colExpansionThumbHovered}></div>
            )}
        </TableCell>
    );
}

function CellInsights({ open, insights, loading, classes, onClose }) {
    let content = null;
    if (!insights?.type || insights?.type === 'widget') {
        content = <Widget data={insights?.data} />;
    }

    return (
        <Dialog
            fullWidth={true}
            maxWidth={'md'}
            open={open}
            onClose={onClose}
            aria-labelledby="customized-dialog-title"
            aria-describedby="customized-dialog-content"
        >
            <DialogTitle id="customized-dialog-title" onClose={onClose}>
                <Typography
                    className={classes.defaultColor}
                    variant="h4"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {insights?.title || ''}
                    <div style={{ flex: 1 }}></div>
                    <IconButton aria-label="close" onClick={onClose} aria-labelledby="Close">
                        <CloseIcon />
                    </IconButton>
                </Typography>
            </DialogTitle>
            <DialogContent id="customized-dialog-content">
                {loading ? (
                    <CodxCircularLoader center size={50} />
                ) : insights?.data ? (
                    content
                ) : (
                    'No Data'
                )}
            </DialogContent>
            <DialogActions></DialogActions>
        </Dialog>
    );
}
// const rndbool = () => Math.random() < 0.5;

GridTable.displayName = 'GridTable';

export default GridTable;
