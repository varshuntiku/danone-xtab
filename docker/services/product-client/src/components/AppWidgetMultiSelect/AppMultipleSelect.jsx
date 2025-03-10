import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import {
    FormControl,
    FormControlLabel,
    FormGroup,
    RadioGroup,
    /* ThemeProvider, TextField, InputAdornment, */ Typography,
    Toolbar
} from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import TablePagination from '@material-ui/core/TablePagination';
import SearchBar from '../CustomSearchComponent/SearchComponent';
import CustomLegends from '../custom/CustomLegends';
import DescriptionAlerts from '../custom/DescriptionAlerts';
import SimpleSelect from '../dynamic-form/inputFields/select';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(2, 0, 2, 1),
        color: theme.palette.text.default,
        width: '90%'
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    chip: {
        margin: 2
    },
    input: {
        color: theme.palette.text.default + ' !important',
        fontSize: '15px',
        fontWeight: 400,
        '&:before': {
            borderBottom: '1px solid ' + theme.palette.text.default
        },
        '&:after': {
            borderBottom: `2px solid ${theme.palette.text.default}`
        },
        '&:hover:not($disabled):not($focused):not($error):before': {
            borderBottom: `2px solid ${theme.palette.text.default}`
        },
        '& svg': {
            fontSize: '4rem',
            color: theme.palette.text.default
        }
    },
    menuItem: {
        fontSize: '1.5rem',
        margin: theme.spacing(1),
        padding: theme.spacing(1)
    },
    checkbox: {
        '& svg': {
            width: theme.layoutSpacing(20),
            height: theme.layoutSpacing(20),
            color: `var(--label-color, ${theme.palette.text.default})`
        }
    },
    radio: {
        '& svg': {
            width: theme.layoutSpacing(18),
            height: theme.layoutSpacing(18),
            color: `var(--label-color, ${theme.palette.text.default})`
        }
    },
    label: {
        color: `var(--label-color, ${theme.palette.text.default})`,
        fontSize: '1.5rem',
        padding: '1rem 1rem'
    },
    checkedLabel: {
        color: `var(--label-color, ${theme.palette.text.default})`,
        fontSize: '1.5rem',
        fontWeight: '500',
        padding: '1rem 1rem'
    },
    searchField: {
        padding: '1.5rem 1rem'
    },
    searchFieldUnderline: {
        '&::before': {
            borderColor: 'transparent'
        },
        '&::after': {
            borderColor: 'transparent'
        },
        '&:hover': {
            '&::before': {
                borderColor: 'transparent'
            }
        }
    },
    highlight: {
        fontWeight: 'bold',
        color: theme.palette.text.default
    },
    paginationSection: {
        position: 'absolute',
        bottom: theme.layoutSpacing(22),
        left: theme.layoutSpacing(24),
        width: '96.7%',
        height: theme.layoutSpacing(52),
        padding: `${theme.layoutSpacing(24)} 0 0 ${theme.layoutSpacing(16)}`,
        '& .MuiToolbar-regular': {
            minHeight: 0,
            padding: 0,
            width: '100%',
            height: '100%'
        }
    },
    paginationOptionsLabel: {
        color: theme.palette.text.default,
        borderRadius: '1px',
        background: `${theme.palette.icons.indicatorGreen}99`,
        height: theme.layoutSpacing(27),
        padding: `${theme.layoutSpacing(4)} ${theme.layoutSpacing(16)}`,
        fontWeight: 500,
        fontSize: theme.layoutSpacing(14),
        fontFamily: theme.body.B1.fontFamily,
        lineHeight: 'normal',
        letterSpacing: theme.layoutSpacing(0.5)
    },
    tablePagination: {
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(14),
        '& .MuiTablePagination-toolbar': {
            '& .MuiTablePagination-caption': {
                fontSize: theme.layoutSpacing(14),
                marginRight: theme.layoutSpacing(8)
            },
            '& .MuiTablePagination-selectRoot': {
                margin: `0 ${theme.layoutSpacing(24)} 0 0`,
                borderRadius: '4px',
                border: `1px solid ${theme.palette.text.table}40`,
                padding: `${theme.layoutSpacing(4)} ${theme.layoutSpacing(8)}`,
                '& .MuiSelect-select': {
                    padding: 0,
                    marginRight: theme.layoutSpacing(8),
                    textAlignLast: 'left'
                },
                '& .MuiSelect-icon': {
                    color: 'inherit',
                    top: 'auto'
                }
            },
            '& .MuiTablePagination-actions': {
                marginLeft: theme.layoutSpacing(16)
            }
        },
        '&.MuiTableCell-root': {
            borderBottom: 'none'
        }
    },
    tableActionsCustomStyles: {
        display: 'flex',
        gap: theme.layoutSpacing(8),
        marginLeft: theme.layoutSpacing(16),
        '& button': {
            margin: 0,
            padding: 0,
            color: theme.palette.text.table
        },
        '& .Mui-disabled svg': {
            color: `${theme.palette.text.table}66`
        }
    },
    checkedcheckbox: {
        '& svg': {
            width: theme.layoutSpacing(20),
            height: theme.layoutSpacing(20),
            color: `var(--label-color, ${theme.palette.text.default})`
        }
    },
    labelFrom: {
        color: `var(--label-color, ${theme.palette.text.contrastText})`,
        fontSize: '1.5rem'
    },
    labelItemWrapper: {
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(15),
        letterSpacing: theme.layoutSpacing(0.3),
        color: theme.palette.background.infoBgDark,
        margin: 0,
        display: 'flex',
        alignItems: 'start',
        flexDirection: 'row',
        width: theme.layoutSpacing(212),
        '& .MuiFormControlLabel-label': {
            padding: 0,
            marginLeft: theme.layoutSpacing(8),
            lineHeight: 'normal',
            wordBreak: 'break-word'
        },
        '& .MuiCheckbox-root, & .MuiRadio-root': {
            padding: 0,
            margin: 0,
            width: theme.layoutSpacing(16),
            height: theme.layoutSpacing(16),
            paddingTop: theme.layoutSpacing(3)
        }
    },
    formGroupCustomStyles: {
        height: '100%',
        overflowX: 'auto',
        // overflowY: 'scroll',
        gap: `${theme.layoutSpacing(32)} ${theme.layoutSpacing(28)}`,
        marginRight: theme.layoutSpacing(-35),
        // flexDirection: 'row',
        alignItems: 'start',
        alignContent: 'flex-start',
        paddingLeft: '10px'
    },
    flexCol: {
        flexDirection: 'column'
    },
    contentWrapper: {
        height: 'inherit',
        width: '100%',
        '& #customSearchSelector': {
            width: theme.layoutSpacing(320),
            padding: `${theme.layoutSpacing(12)} 0 ${theme.layoutSpacing(32)}`,
            flexGrow: 0,
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: `${theme.palette.text.table}33`
            },
            '& .MuiOutlinedInput-adornedEnd': {
                height: theme.layoutSpacing(36)
            }
        },
        '& > .MuiOutlinedInput-root': {
            width: theme.layoutSpacing(320)
        },
        '&.MuiFormControl-root': {
            position: 'unset'
        },
        '& input': {
            fontSize: theme.layoutSpacing(15)
        }
    },
    formControlRadioWrapper: {
        height: 'inherit',
        width: '100%',
        '& #customSearchSelector': {
            width: theme.layoutSpacing(320),
            padding: `${theme.layoutSpacing(12)} 0 ${theme.layoutSpacing(32)}`,
            flexGrow: 0,
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: `${theme.palette.text.table}33`
            },
            '& .MuiOutlinedInput-adornedEnd': {
                height: theme.layoutSpacing(36)
            }
        },
        '& > .MuiOutlinedInput-root': {
            width: theme.layoutSpacing(320)
        },
        '&.MuiFormControl-root': {
            position: 'unset'
        },
        '& input': {
            fontSize: theme.layoutSpacing(15)
        }
    },
    filterErrorMessage: {
        fontSize: theme.layoutSpacing(12),
        fontWeight: '400',
        letterSpacing: theme.layoutSpacing(0.3),
        color: theme.palette.text.filtersError,
        lineHeight: theme.layoutSpacing(16),
        border: `1px solid ${theme.palette.text.filtersError}`,
        padding: `${theme.layoutSpacing(12)} ${theme.layoutSpacing(20)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.layoutSpacing(28),
        '& > svg#filterErrorIcon': {
            color: theme.palette.text.filtersError,
            marginRight: theme.layoutSpacing(12),
            fontSize: theme.layoutSpacing(24),
            width: theme.layoutSpacing(24),
            height: theme.layoutSpacing(24)
        }
    },
    customFilterErrorStyle: {
        marginBottom: theme.layoutSpacing(12)
    }
}));

function TablePaginationActions(props) {
    const classes = useStyles();
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.tableActionsCustomStyles}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

export default function AppMultipleSelect({
    item,
    data,
    selectedValue,
    onChangeFilter,
    params,
    filterErrorFound = null,
    is_default_value_dict,
    optionsBodyHeight
}) {
    const classes = useStyles();
    const [value, setValue] = React.useState(
        is_default_value_dict ? selectedValue[item]['items'] : selectedValue[item]
    );
    const [selectAll, setSelectAll] = React.useState(() => value?.includes('All'));
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(
        params?.pagination
            ? params?.pagination_options_per_page?.[0] || 50
            : data['widget_tag_value']?.length || 0
    );
    const [searchText, setSearchText] = React.useState('');
    let filteredOptions;
    let paginationRenderOptionsCount;
    const [fromSelect, setFromSelect] = React.useState(
        selectedValue[item] && selectedValue[item].length > 0
            ? selectedValue[item][0].value
                ? selectedValue[item][0].value
                : selectedValue[item][0]
            : ''
    );
    const [toSelect, setToSelect] = React.useState(
        selectedValue[item] && selectedValue[item].length > 0
            ? selectedValue[item][0].value
                ? selectedValue[item][selectedValue[item].length - 1].value
                : selectedValue[item][selectedValue[item].length - 1]
            : ''
    );
    const [fieldInfoTo, setFieldInfoTo] = React.useState({
        options: data['widget_tag_value'],
        value: toSelect
    });
    const [fieldInfoFrom, setFieldInfoFrom] = React.useState({
        options: data['widget_tag_value'],
        value: fromSelect
    });
    const [widgetGroup, setWidgetGroup] = React.useState(
        data['widget_group'] ? data['widget_group'] : []
    );
    React.useEffect(() => {
        setPage(0);
    }, [searchText]);

    function findIndexFunction(value, indexValue) {
        return value.value ? value.value == indexValue : value == indexValue;
    }

    React.useEffect(() => {
        if (data.widget_tag_input_type == 'Element Range Selector') {
            if (toSelect !== '') {
                const initFieldInfoTo = { options: data['widget_tag_value'], value: '' };
                let position = initFieldInfoTo.options.findIndex(function (item) {
                    return findIndexFunction(item, fromSelect);
                });
                let toOpt = initFieldInfoTo.options.slice(position);
                setFieldInfoTo({ options: toOpt, value: toSelect });
            }
            if (fromSelect !== '') {
                const initFieldInfoFrom = { options: data['widget_tag_value'], value: '' };
                let position = initFieldInfoFrom.options.findIndex(function (item) {
                    return findIndexFunction(item, toSelect);
                });
                let fromOpt = initFieldInfoFrom.options.slice(0, position + 1);
                setFieldInfoFrom({ options: fromOpt, value: fromSelect });
            }
        }
    }, []);

    const quaterly = (params) => {
        let arr = [].concat(
            ...[0, 1, 2, 3, 4].map((i) =>
                [1, 2, 3, 4].map((j) => (new Date().getFullYear() + i + `, Q` + j).toString())
            )
        );
        if (params) {
            let start = arr.indexOf(params);
            let subar = [1, 2, 3, 4].map((i) => arr[start + i]);
            return subar;
        }
        return arr;
    };

    const yearly = (params) => {
        let arr = [];
        for (let i = 0; i < 5; i++) {
            arr.push((new Date().getFullYear() + i).toString());
        }
        if (params) {
            let start = arr.indexOf(params);
            let subar = [1, 2, 3, 4].map((i) => arr[start + i]);
            return subar;
        }
        return arr;
    };

    const getFilterFunction = (ch, params) => {
        switch (ch) {
            case 'quaterly':
                return quaterly(params);
            case 'yearly':
                return yearly(params);
            default:
                return null;
        }
    };
    const renderMenuItems = () => {
        if (data['widget_filter_hierarchy_key']) {
            let key = data['widget_filter_hierarchy_key'];
            let hierarchy_selected_value = selectedValue[key];
            if (!data['widget_filter_function']) {
                if (Array.isArray(hierarchy_selected_value)) {
                    let widget_tag_value = [];
                    hierarchy_selected_value.map((element) => {
                        if (data['widget_tag_value'][element])
                            widget_tag_value = [
                                ...new Set(
                                    widget_tag_value.concat(data['widget_tag_value'][element])
                                )
                            ];
                        return element;
                    });
                    return widget_tag_value;
                } else {
                    return data['widget_tag_value'][hierarchy_selected_value];
                }
            } else {
                if (data['widget_filter_function_parameter']) {
                    let params = data['widget_filter_function_parameter'];
                    return getFilterFunction(
                        data['widget_tag_value'][hierarchy_selected_value],
                        selectedValue[params]
                    );
                } else {
                    return getFilterFunction(
                        data['widget_tag_value'][hierarchy_selected_value],
                        false
                    );
                }
            }
        }
        return data['widget_tag_value'];
    };

    const options = renderMenuItems();
    const handleChange = (response_value) => {
        let selectedCount = response_value.length;
        let optionsCount = options.length;
        const modifiedOptions = options.map((option) =>
            typeof option === 'object' ? option.value : option
        );
        if (response_value.includes('All')) {
            if (selectedCount === 1 || !selectAll) {
                onChangeFilter(modifiedOptions);
                setValue(modifiedOptions);
                setSelectAll(true);
            } else if (optionsCount + 1 !== selectedCount) {
                let indexOfAll = response_value.indexOf('All');
                response_value.splice(indexOfAll, 1);
                let newData = [
                    ...new Set(modifiedOptions.filter((x) => response_value.includes(x)))
                ];
                onChangeFilter(newData);
                setValue(newData);
                setSelectAll(false);
            }
        } else if (selectedCount === optionsCount) {
            onChangeFilter(modifiedOptions);
            setValue(modifiedOptions);
            setSelectAll(false);
        } else {
            if (selectAll) {
                onChangeFilter([]);
                setValue([]);
                setSelectAll(false);
            } else if (selectedCount === optionsCount - 1 && modifiedOptions.includes('All')) {
                onChangeFilter(modifiedOptions);
                setValue(modifiedOptions);
                setSelectAll(true);
            } else {
                onChangeFilter(response_value);
                setValue(response_value);
            }
        }
    };

    const handleSingleChange = (event) => {
        onChangeFilter(event.target.value);
        setValue(event.target.value);
    };

    const onChangeCheckbox = (event) => {
        const response_value = value ? JSON.parse(JSON.stringify(value)) : [];
        // const value_index = response_value.indexOf(event.target.value);
        const value_index = response_value.findIndex((el) => el === event.target.value);
        if (value_index > -1) {
            response_value.splice(value_index, 1);
        } else {
            response_value.push(event.target.value);
        }
        handleChange(response_value);
    };

    const handleSearch = (searchKey) => {
        setSearchText(searchKey);
    };

    const StringHighLighter = ({ text, highlight, highlightedItemClass }) => {
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

        return (
            <>
                {parts.map((part, i) => {
                    const highlightStyle =
                        part.toLowerCase() === highlight.toLowerCase() ? highlightedItemClass : '';
                    return (
                        <span key={i} className={highlightStyle}>
                            {part}
                        </span>
                    );
                })}
            </>
        );
    };

    const displayOptions = (options) => {
        //.map(String)
        let renderOptions;
        filteredOptions = options.filter((name) => {
            if (typeof name === 'object') {
                const label = String(name.label || name.value);
                if (searchText.length > 0) {
                    return label.toLowerCase().includes(searchText.toLowerCase());
                } else {
                    return true;
                }
            } else {
                const label = String(name);
                if (searchText.length > 0) {
                    return label.toLowerCase().includes(searchText.toLowerCase());
                } else {
                    return true;
                }
            }
        });
        if (filteredOptions.length === 0) {
            renderOptions = (
                <Typography className={classes.label} style={{ fontSize: '1.7rem' }}>
                    No result found
                </Typography>
            );
        } else {
            if (widgetGroup.length > 0) {
                const withGroupLabel = [], withoutGroupLabel = []
                filteredOptions.map(element => {
                    if (element.groupLabel) {
                        withGroupLabel.push(element)
                    } else
                        withoutGroupLabel.push(element)
                })
                return (
                    <div style={{display: "contents"}}>
                        <div style={{display: "contents"}}>
                            {

                                renderOptions = (rowsPerPage > 0
                                    ? withoutGroupLabel.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : withoutGroupLabel).map(elem => {
                                        const color = elem?.color || '';
                                        const optionTitle = elem?.title || '';
                                        const label = elem?.label || elem?.value || elem;
                                        const optionValue = elem?.value || elem;
                                        const checked = value && (value.includes(optionValue));
                                        const key = optionValue + ''
                                        const disabled = elem?.disabled || false
                                        return (
                                            <div>
                                                <FormControlLabel classes={{ label: checked ? classes.checkedLabel : classes.label }}
                                                    key={key}
                                                    value={optionValue}
                                                    title={optionTitle}
                                                    control={
                                                        <Checkbox className={classes.checkbox}
                                                            checked={checked}
                                                            disabled={(params?.max_len ? (value && value.includes(elem) ? false : value.length >= params.max_len) : false) ||
                                                                (disabled)}
                                                            onChange={onChangeCheckbox} />
                                                    } label={
                                                        data?.widget_filter_search ? <StringHighLighter
                                                            text={label}
                                                            highlight={searchText}
                                                            highlightedItemClass={classes.highlight}
                                                        /> : label
                                                    }
                                                    style={{ "--label-color": color }}
                                                />
                                            </div>
                                        )
                                    })
                            }
                        </div>
                        <div style={{display: "contents"}}>
                            {
                                widgetGroup.map(elem =>
                                    <div>
                                        <Accordion>
                                            <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                            style={{ display: "inline-flex" }}>
                                                {elem}
                                            </AccordionSummary>
                                            {
                                                renderOptions = (rowsPerPage > 0
                                                    ? withGroupLabel.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    : withGroupLabel).map(name => {
                                                    const color = name?.color || '';
                                                    const optionTitle = name?.title || '';
                                                    const groupLabel = name?.groupLabel || '';
                                                    const label = name?.label || name?.value || name;
                                                    const optionValue = name?.value || name;
                                                    const checked = value && (value.includes(optionValue));
                                                    const key = optionValue + ''
                                                    const disabled = name?.disabled || false
                                                    return (
                                                        <AccordionDetails style={{ display: "grid" }}>
                                                            {
                                                                name.groupLabel === elem ?
                                                                    <div>
                                                                        <FormControlLabel classes={{ label: checked ? classes.checkedLabel : classes.label }}
                                                                            key={key}
                                                                            value={optionValue}
                                                                            title={optionTitle}
                                                                            control={
                                                                                <Checkbox className={classes.checkbox}
                                                                                    checked={checked}
                                                                                    disabled={(params?.max_len ? (value && value.includes(name) ? false : value.length >= params.max_len) : false) ||
                                                                                        (disabled)}
                                                                                    onChange={onChangeCheckbox} />
                                                                            } label={
                                                                                data?.widget_filter_search ? <StringHighLighter
                                                                                    text={label}
                                                                                    highlight={searchText}
                                                                                    highlightedItemClass={classes.highlight}
                                                                                /> : label
                                                                            }
                                                                            style={{ "--label-color": color }}
                                                                        />
                                                                    </div>
                                                                    : <></>
                                                            }
                                                        </AccordionDetails>
                                                    )
                                                })
                                            }
                                        </Accordion>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                )
            }
            else {
                renderOptions = (
                    rowsPerPage > 0
                        ? filteredOptions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : filteredOptions
                ).map((name) => {
                    const label = name?.label || name?.value || name;
                    const optionValue = name?.value || name;
                    const groupLabel = name?.groupLabel || '';
                    const checked = value && value.includes(optionValue);
                    const key = optionValue + '';
                    const disabled = name?.disabled || false;
                    const color = checked
                        ? data?.widget_filter_params?.selected_element_color || name?.color || ''
                        : name?.color || '';
                    return (
                        <FormControlLabel
                            classes={{ label: checked ? classes.checkedLabel : classes.label }}
                            key={key}
                            value={optionValue}
                            control={
                                data.widget_tag_input_type == 'Element Range Selector' ? (
                                    <label
                                        className={checked ? classes.checkedcheckbox : classes.checkbox}
                                        // checked={checked}
                                        disabled={
                                            (params?.max_len
                                                ? value && value.includes(name)
                                                    ? false
                                                    : value.length >= params.max_len
                                                : false) || disabled
                                        }
                                        onChange={onChangeCheckbox}
                                    />
                                ) : (
                                    <Checkbox
                                        className={checked ? classes.checkedcheckbox : classes.checkbox}
                                        checked={checked}
                                        disabled={
                                            (params?.max_len
                                                ? value && value.includes(name)
                                                    ? false
                                                    : value.length >= params.max_len
                                                : false) || disabled
                                        }
                                        onChange={onChangeCheckbox}
                                    />
                                )
                            }
                            label={
                                data?.widget_filter_search ? (
                                    <StringHighLighter
                                        text={label}
                                        highlight={searchText}
                                        highlightedItemClass={classes.highlight}
                                    />
                                ) : (
                                    label
                                )
                            }
                            style={{ '--label-color': color }}
                            className={classes.labelItemWrapper}
                        />
                    );
                });
            }
        }
        paginationRenderOptionsCount = renderOptions.length;
        return renderOptions;
    };

    const displayRadioOptions = (options) => {
        //.map(String)
        let renderOptions;
        filteredOptions = options.filter((name) => {
            if (typeof name === 'object') {
                const label = String(name.label || name.value);
                if (searchText.length > 0) {
                    return label.toLowerCase().includes(searchText.toLowerCase());
                } else {
                    return true;
                }
            } else {
                const label = String(name);
                if (searchText.length > 0) {
                    return label.toLowerCase().includes(searchText.toLowerCase());
                } else {
                    return true;
                }
            }
        });
        if (filteredOptions.length === 0) {
            renderOptions = (
                <Typography className={classes.label} style={{ fontSize: '1.7rem' }}>
                    No result found
                </Typography>
            );
        } else {
            renderOptions = (
                rowsPerPage > 0
                    ? filteredOptions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : filteredOptions
            ).map((name) => {
                const color = name?.color || '';
                const label = name?.label || name?.value || name;
                const optionValue = name?.value || name;
                const checked = value && value.includes(optionValue);
                const key = optionValue + '';
                const disabled = name?.disabled || false;
                return (
                    <FormControlLabel
                        classes={{ label: checked ? classes.checkedLabel : classes.label }}
                        key={key}
                        value={optionValue}
                        control={<Radio className={classes.radio} disabled={disabled} />}
                        label={
                            data?.widget_filter_search ? (
                                <StringHighLighter
                                    text={label}
                                    highlight={searchText}
                                    highlightedItemClass={classes.highlight}
                                />
                            ) : (
                                label
                            )
                        }
                        style={{ '--label-color': color }}
                        className={classes.labelItemWrapper}
                    />
                );
            });
        }
        return renderOptions;
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginationLabelDisplay = ({ from, to, count }) => {
        return `${from}-${to} of ${count !== -1 ? count : ''}`;
    };

    const renderPagination = (totalOptionsLength = 0) => {
        if (!params?.pagination) {
            return null;
        }
        return (
            <div className={classes.paginationSection}
                style={{
                    marginTop: optionsBodyHeight
                    ? paginationRenderOptionsCount == 7
                        ? '-5.8rem'
                        : paginationRenderOptionsCount < 8
                        ? '-9.5rem'
                        : null
                    : null
                }}
            >
                <Toolbar>
                    <Typography className={classes.paginationOptionsLabel}>
                        {data.widget_filter_multiselect
                            ? `${value?.length} ${
                                  value.length > 1 ? `Options` : `Option`
                              } Selected (Max ${totalOptionsLength})`
                            : value?.length > 0
                            ? '1 Option Selected '
                            : '0 Option Selected'}
                    </Typography>
                    <div style={{ flex: '1 1 10%' }}></div>
                    <TablePagination
                        colSpan={12}
                        count={filteredOptions.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={params?.pagination_options_per_page || [50, 70, 100]}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Options per page"
                        labelDisplayedRows={paginationLabelDisplay}
                        style={{ overflow: 'hidden' }}
                        className={classes.tablePagination}
                        ActionsComponent={TablePaginationActions}
                    />
                </Toolbar>
            </div>
        );
    };

    const handleSelectChange = (e) => {
        const initFieldInfoFrom = { options: data['widget_tag_value'], value: '' };
        setFromSelect(e);
        function myFunction(value) {
            return value.value ? value.value == e.value : value == e;
        }
        let position = initFieldInfoFrom.options.findIndex(myFunction);
        let toopt = initFieldInfoFrom.options.slice(position);
        setFieldInfoTo({ options: toopt, value: toSelect });
        function myFunctionF(value) {
            return value.value ? value.value == e.value : value == e;
        }
        let positionF = initFieldInfoFrom.options.findIndex(myFunctionF);
        function myFunctionT(value) {
            return value.value
                ? value.value
                : value == (toSelect.value ? toSelect.value : toSelect);
        }
        let tofinalOpt = [];
        function myFunctionT1(item) {
            tofinalOpt.push(item.value ? item.value : item);
        }
        initFieldInfoFrom.options.forEach(myFunctionT1);
        let positionT = tofinalOpt.findIndex(myFunctionT);
        positionT = positionT == -1 ? positionF : positionT;
        let toopF = initFieldInfoFrom.options.slice(positionF, positionT + 1);
        let finalOpt = [];
        toopF.forEach(myFunction1);
        function myFunction1(item) {
            finalOpt.push(item.value ? item.value : item);
        }
        setValue(finalOpt);
        if (toSelect || toSelect.value) {
            onChangeFilter(finalOpt);
        }
    };
    const handleSelectChangeTo = (e) => {
        const initFieldInfoFrom = { options: data['widget_tag_value'], value: '' };
        function myFunction(value) {
            //return value == e;
            return value.value ? value.value == e.value : value == e;
        }
        let position = initFieldInfoFrom.options.findIndex(myFunction);
        let toopt = initFieldInfoFrom.options.slice(0, position + 1);
        setFieldInfoFrom({ options: toopt, value: fromSelect });
        setToSelect(e);
        function myFunctionT(value) {
            return value.value
                ? value.value
                : value == (fromSelect.value ? fromSelect.value : fromSelect);
        }
        let tofinalOpt = [];
        function myFunctionT1(item) {
            tofinalOpt.push(item.value ? item.value : item);
        }
        initFieldInfoFrom.options.forEach(myFunctionT1);
        let positionT = tofinalOpt.findIndex(myFunctionT);
        positionT = positionT == -1 ? position : positionT;
        let toopt1 = initFieldInfoFrom.options.slice(positionT, position + 1);
        let finalOpt = [];
        toopt1.forEach(myFunction1);
        function myFunction1(item) {
            finalOpt.push(item.value ? item.value : item);
        }
        setValue(finalOpt);
        if (fromSelect || fromSelect.value) {
            onChangeFilter(finalOpt);
        }
    };

    return data.widget_filter_multiselect ? (
        <FormControl
            component="fieldset"
            className={classes.contentWrapper}
            style={{ height: optionsBodyHeight ? optionsBodyHeight : 'inherit' }}
        >
            {filterErrorFound && (
                <Typography
                    key="error"
                    className={`${classes.filterErrorMessage} ${
                        data?.widget_filter_search && classes.customFilterErrorStyle
                    }`}
                >
                    <ErrorIcon fontSize="large" id="filterErrorIcon" />
                    Please fix errors to enable apply, hover on error icon for more details.
                </Typography>
            )}
            {data?.widget_filter_search ? (
                <SearchBar
                    value={searchText}
                    onChangeWithDebounce={handleSearch}
                    placeholder="Search"
                    suggestions={data?.searchSuggestions}
                    suggestionParams={data?.suggestionProps}
                />
            ) : null}
            {data.widget_tag_input_type === 'Element Range Selector' ? (
                <table>
                    <tr align="left">
                        <th
                            width="60px"
                            valign="bottom"
                            className={classes.labelFrom}
                            style={{ fontSize: '1.7rem' }}
                        >
                            From :
                        </th>
                        <th width="150px" valign="top" align="left">
                            <SimpleSelect
                                onChange={handleSelectChange}
                                fieldInfo={fieldInfoFrom}
                                searchReq={true}
                            />
                        </th>
                        <th
                            width="50px"
                            valign="bottom"
                            align="left"
                            className={classes.labelFrom}
                            style={{ fontSize: '1.7rem' }}
                        >
                            To :
                        </th>
                        <td width="120px" align="left">
                            <SimpleSelect
                                onChange={handleSelectChangeTo}
                                searchReq={true}
                                fieldInfo={fieldInfoTo}
                            />
                        </td>
                        <th valign="bottom">
                            <CustomLegends
                                alignRight
                                legends={data?.widget_filter_params?.legends}
                            />
                        </th>
                    </tr>
                </table>
            ) : (
                ''
            )}
            {data.widget_tag_input_type === 'Element Range Selector' ? null : (
                <CustomLegends alignRight legends={data?.widget_filter_params?.legends} />
            )}
            <DescriptionAlerts
                alignRight
                alertInfo={data?.widget_filter_params?.widget_filter_alertInfo}
            />
            <FormGroup className={`${classes.formGroupCustomStyles} ${widgetGroup.length > 0 && classes.flexCol}`}>
                {displayOptions(options)}
            </FormGroup>
            {renderPagination(options?.length)}
        </FormControl>
    ) : (
        <FormControl component="fieldset" className={classes.formControlRadioWrapper}>
            {filterErrorFound && (
                <Typography
                    key="error"
                    className={`${classes.filterErrorMessage} ${
                        data?.widget_filter_search && classes.customFilterErrorStyle
                    }`}
                >
                    <ErrorIcon fontSize="large" id="filterErrorIcon" />
                    Please fix errors to enable apply, hover on error icon for more details.
                </Typography>
            )}
            {data?.widget_filter_search ? (
                <SearchBar
                    value={searchText}
                    onChangeWithDebounce={handleSearch}
                    placeholder="Search"
                />
            ) : null}
            <CustomLegends alignRight legends={data?.widget_filter_params?.legends} />
            <RadioGroup
                className={classes.formGroupCustomStyles}
                aria-label="radio filter"
                name="radio-filter"
                value={value + ''}
                onChange={handleSingleChange}
            >
                {displayRadioOptions(options)}
            </RadioGroup>
            {renderPagination()}
        </FormControl>
    );
}