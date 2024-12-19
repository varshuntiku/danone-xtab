import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core';
import clsx from 'clsx';

import {
    Grid,
    Paper,
    Button,
    AppBar,
    Toolbar,
    CircularProgress,
    Typography,
    TextField,
    ThemeProvider,
    RadioGroup,
    FormControlLabel,
    Radio,
    useTheme,
    Tooltip
} from '@material-ui/core';

import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import AppMultipleSelect from './AppMultipleSelect';
import DateRangeSelect from './DateRangeSelect';
import { getDynamicfilters, previewFilters } from '../../services/filters';
import { useDebouncedCallback } from '../../hooks/useDebounceCallback';
import moment from 'moment';
import PivotFilter from './PivotFilter';
import { yellow } from '@material-ui/core/colors';
import InfoPopper from '../porblemDefinitionFramework/create/InfoPopper';
import SettingsIcon from '@material-ui/icons/Settings';
import RefreshIcon from '@material-ui/icons/Refresh';
import CodxCircularLoader from '../CodxCircularLoader';
import NumberRangeSelect from './NumberRangeSelect';
import { textCompTheme } from '../dynamic-form/inputFields/textInput';
import CodxPopupDialog from '../custom/CodxPoupDialog';
import CustomSnackbar from 'components/CustomSnackbar.jsx';
import ScreenFilterIcon from 'assets/Icons/ScreenFilterIcon';

import * as _ from 'underscore';

const filterHeight = '500px';

const useStyles = makeStyles((theme) => ({
    filterContainer: {
        zIndex: '2'
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        backgroundColor: theme.palette.background.paper,
        boxShadow: 'none',
        zIndex: 0
    },
    filterToolbar: {
        height: 'fit-content',
        padding: '0rem 2rem 0rem 2rem',
        minHeight: '2.4rem !important',

        '& .MuiButton-outlined': {
            borderColor: theme.palette.text.default,
            color: theme.palette.text.default,
            borderRadius: '0.3rem'
        },
        '& .MuiButton-outlined:hover': {
            borderColor: theme.palette.text.default,
            color: theme.palette.text.default
        }
    },

    filterButton: {
        height: theme.layoutSpacing(32),
        minWidth: theme.layoutSpacing(94),
        color: `${theme.palette.text.contrastText} !important`,
        borderColor: `${theme.palette.primary.contrastText} !important`,
        outlineColor: `${theme.palette.primary.contrastText} !important`,
        textTransform: 'none',
        padding: `0 ${theme.layoutSpacing(8)}`,
        '& .MuiButton-label': {
            paddingLeft: theme.layoutSpacing(8),
            paddingRight: theme.layoutSpacing(8)
        },
        '& span': {
            fontSize: theme.layoutSpacing(16),
            fontFamily: theme.body.B1.fontFamily,
            fontWeight: 500,
            letterSpacing: theme.layoutSpacing(0.5)
        }
    },
    filterButtonText: {
        marginRight: theme.spacing(2),
        fontSize: '1.5rem',
        lineHeight: '1.8rem',
        fontWeight: 500,
        letterSpacing: '0.035rem',
        color: theme.palette.text.default
    },
    filterAppliedList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.layoutSpacing(6),
        maxHeight: theme.layoutSpacing(60),
        overflowY: 'hidden'
    },
    width: {
        width: '91.4%'
    },
    filterOptionContainer: {
        float: 'left',
        cursor: 'pointer',
        padding: `${theme.layoutSpacing(4)} ${theme.layoutSpacing(10)}`,
        '&:hover': {
            borderRadius: '1px',
            background: theme.palette.background.tableHover
        }
    },
    highlightFilters: {
        animation: '$blink-animation 2s linear 5 forwards',
        border: '2px solid transparent'
    },
    '@keyframes blink-animation': {
        '0%': {
            borderTop: '2px solid #2B70C2'
        },
        '25%': {
            borderLeft: '2px solid #2B70C2'
        },
        '50%': {
            borderBottom: '2px solid #2B70C2'
        },
        '75%': {
            borderRight: '2px solid #2B70C2'
        },
        '100%': {
            border: '2px solid transparent'
        }
    },
    verticalLine: {
        height: theme.layoutSpacing(16),
        width: theme.layoutSpacing(2),
        backgroundColor: `${theme.palette.text.table}40`
    },
    filterOption: {
        margin: '0rem 0rem 0rem 0rem',
        cursor: 'pointer'
    },
    filterOptionHeader: {
        color: theme.palette.text.default,
        padding: '0.5rem 0rem 0.5rem 0rem',
        fontSize: theme.layoutSpacing(16),
        lineHeight: 'normal',
        fontWeight: 500,
        pointerEvents: 'none',
        fontFamily: theme.body.B1.fontFamily
    },
    filterOptionValue: {
        padding: '0.5rem 0rem 0.5rem 1rem',
        fontSize: theme.layoutSpacing(16),
        lineHeight: 'normal',
        fontWeight: 500,
        color: theme.palette.text.hightlightFilter,
        fontFamily: theme.body.B3.fontFamily
    },
    hide: {
        display: 'none'
    },
    iconButtonProgress: {
        color: theme.palette.text.default
    },
    filtersGridBody: {
        position: 'absolute',
        zIndex: 2,
        height: theme.layoutSpacing(482),
        width: 'unset',
        background: theme.palette.background.pureWhite,
        boxShadow: `0px 4px 4px 1px ${theme.palette.icons.nofile}0F`,
        '& > div': {
            height: '100%'
        }
    },
    filterCategoryBody: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: '0',
        borderTop: `1px solid ${theme.palette.text.table}26`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    filterCategoryLabelBody: {
        maxHeight: filterHeight,
        height: '100%'
    },
    filterCategoryOptionsBody: {
        padding: 0,
        height: '100%',
        width: '100%',
        maxHeight: filterHeight,
        '& .MuiFormControlLabel-label': {
            color: theme.palette.text.default,
            fontFamily: theme.body.B3.fontFamily,
            fontSize: theme.layoutSpacing(15),
            display: 'flex',
            flexWrap: 'wrap'
        },
        '& svg': {
            width: theme.layoutSpacing(16),
            height: theme.layoutSpacing(16),
            color: theme.palette.text.default
        },
        '& .makeStyles-checkedLabel': {
            fontWeight: '500'
        },
        '& .MuiSlider-valueLabel': {
            fontSize: '1.5rem',
            fontWeight: '500'
        }
    },
    filterCategoryLabelButton: {
        position: 'relative',
        color: theme.palette.text.default,
        margin: theme.spacing(1),
        padding: theme.spacing(2, 2.5),
        cursor: 'pointer',
        '&:hover': {
            position: 'relative',
            fontWeight: 500,
            borderRadius: theme.spacing(0.5),
            color: theme.palette.text.default,
            backgroundColor: theme.palette.background.filterCategorySelected
        }
    },
    filterCategoryLabelButtonSelected: {
        position: 'relative',
        color: theme.palette.icons.closeIcon,
        backgroundColor: theme.palette.background.filterCategorySelected,
        margin: theme.spacing(1),
        padding: theme.spacing(2, 2.5),
        borderRadius: theme.spacing(0.5),
        fontWeight: 500,
        '& svg': {
            fill: theme.palette.icons.closeIcon,
            fontSize: theme.layoutSpacing(22)
        }
    },
    filterCategoryLabel: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '1.6rem'
    },
    filterCategoryLabelButtonIcon: {
        fontSize: theme.layoutSpacing(16)
    },
    filterCategoryLabelButtonIconSelected: {
        fontSize: theme.layoutSpacing(16),
        color: theme.palette.text.default
    },
    filterCategoryLabelButtonErrorIcon: {
        fontSize: theme.layoutSpacing(16),
        color: alpha(theme.palette.text.filtersError, 0.8)
    },
    filterCategoryLabelButtonErrorIconSelected: {
        fontSize: theme.layoutSpacing(16),
        color: alpha(theme.palette.text.filtersError, 0.8)
    },
    filterButtonToolbar: {
        position: 'relative',
        '& .MuiButton-outlined:hover': {
            color: theme.palette.text.default
        },
        padding: '0',
        width: '100%',
        marginRight: theme.layoutSpacing(10),
        marginLeft: theme.layoutSpacing(10)
    },
    filterToolbarButtonCancel: {
        color: theme.palette.text.sidebarSelected,
        borderColor: theme.palette.text.sidebarSelected,
        textTransform: 'capitalize',
        fontFamily: theme.body.B1.fontFamily,
        fontSize: theme.layoutSpacing(16),
        fontWeight: 500,
        letterSpacing: theme.layoutSpacing(0.5),
        '&:hover': {
            borderColor: theme.palette.text.default,
            backgroundColor: 'transparent'
        },
        minWidth: theme.layoutSpacing(99),
        height: theme.layoutSpacing(36),
        padding: `${theme.layoutSpacing(8)} ${theme.layoutSpacing(24)}`
    },
    filterToolbarButtonApply: {
        color: theme.button.applyButton.color,
        borderColor: theme.palette.text.sidebarSelected,
        backgroundColor: theme.palette.text.sidebarSelected,
        textTransform: 'capitalize',
        fontFamily: theme.body.B1.fontFamily,
        fontSize: theme.layoutSpacing(16),
        fontWeight: 500,
        letterSpacing: theme.layoutSpacing(0.5),
        '&:hover': {
            borderColor: theme.palette.text.sidebarSelected,
            backgroundColor: theme.palette.text.sidebarSelected
        },
        minWidth: theme.layoutSpacing(90),
        height: theme.layoutSpacing(36),
        padding: `${theme.layoutSpacing(8)} ${theme.layoutSpacing(24)}`
    },
    btn: {
        margin: theme.spacing(0, 0, 1, 0)
    },
    hidden: {
        display: 'none'
    },
    pivotSelection: {
        borderBottom: `2px solid ${yellow[500]}`
    },
    triggerIcon: {
        color: theme.palette.text.default
    },
    triggerIconSelected: {
        color: theme.palette.primary.dark
    },
    resetFilter: {
        height: theme.layoutSpacing(36),
        borderColor: 'transparent',
        color: theme.palette.text.sidebarSelected,
        textTransform: 'capitalize',
        fontFamily: theme.body.B1.fontFamily,
        fontSize: theme.layoutSpacing(16),
        fontWeight: 500,
        letterSpacing: theme.layoutSpacing(0.5),
        '&:hover': {
            borderColor: 'transparent',
            backgroundColor: 'transparent'
        },
        '&.MuiButton-outlined.Mui-disabled': {
            borderColor: 'transparent',
            color: theme.palette.border.buttonOutline,
            opacity: 0.5
        },
        '&.MuiButton-outlined': {
            borderColor: 'transparent'
        },
        '& .MuiSvgIcon-root': {
            color: 'inherit'
        },
        padding: '0'
    },
    sliceManagement: {
        borderTop: `1px solid ${theme.palette.text.table}26`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    sliceManagementLabel: {
        textAlign: 'center',
        fontSize: '1.7rem',
        marginTop: theme.spacing(2),
        color: theme.palette.text.default
    },
    sliceArrowIcon: {
        position: 'absolute',
        right: theme.spacing(2.5)
    },
    sliceArrowIconSelected: {
        position: 'absolute',
        right: theme.spacing(2.5),
        color: theme.palette.text.default
    },
    saveSliceLabel: {
        fontSize: '1.7rem',
        letterSpacing: '0.07rem',
        fontWeight: '400',
        marginLeft: theme.spacing(15),
        marginTop: theme.spacing(3),
        color: theme.palette.text.default
    },
    saveSliceButton: {
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(3.75)
    },
    loadSliceButton: {
        marginLeft: theme.spacing(1.5),
        marginTop: theme.spacing(1.5)
    },
    radioLabel: {
        fontSize: '1.5rem',
        width: '100%',
        color: theme.palette.text.default
    },
    iconSize: {
        '& svg': {
            width: '2rem',
            height: '2rem',
            color: theme.palette.text.default
        },
        paddingLeft: '2rem'
    },
    dialogFont: {
        fontSize: '1.7rem',
        letterSpacing: '0.07rem',
        fontWeight: '400',
        marginTop: '2%',
        marginLeft: '5%',
        color: theme.palette.text.default
    },
    formInput: {
        padding: theme.spacing(1.5, 1),
        background: theme.palette.background.dialogInput
    },
    overlay: {
        height: '100vh',
        width: '100%',
        background: `${theme.palette.background.overlay}A3`,
        backdropFilter: 'blur(1px)',
        position: 'absolute'
    },
    filterDataWrapper: {
        height: '100%',
        flexDirection: 'column'
    },
    categoriesWrapper: {
        width: theme.layoutSpacing(392),
        height: '100%',
        background: theme.palette.background.filterCategories,
        boxShadow: `0px 4px 4px 1px ${theme.palette.icons.nofile}0F`,
        borderRight: `1px solid ${theme.palette.border.categoriesRight}`,
        padding: `0 ${theme.layoutSpacing(4)} ${theme.layoutSpacing(20)} ${theme.layoutSpacing(16)}`
    },
    categories: {
        overflowY: 'scroll',
        overflowX: 'hidden',
        height: '87%',
        paddingRight: theme.layoutSpacing(12)
    },
    categoriesDataWrapper: {
        maxWidth: '79%',
        height: '100%',
        padding: `${theme.layoutSpacing(16)} ${theme.layoutSpacing(24)} ${theme.layoutSpacing(24)}`,
        position: 'relative',
        background: theme.palette.background.filterCategories
    },
    selectedFiltersCountWrapper: {
        height: theme.layoutSpacing(52),
        display: 'flex',
        alignItems: 'center',
        borderTop: `1px solid ${theme.palette.text.table}33`,
        paddingTop: theme.layoutSpacing(24)
    },
    categoriesData: {
        padding: `0 ${theme.layoutSpacing(16)}`,
        height: '88%'
    },
    actionButtonsWrapper: {
        height: theme.layoutSpacing(56),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: `1px solid ${theme.palette.text.table}33`,
        paddingTop: theme.layoutSpacing(20),
        marginRight: theme.layoutSpacing(12)
    },
    tooltip: {
        backgroundColor: theme.palette.background.filterToolTip,
        fontSize: theme.layoutSpacing(15),
        position: 'absolute',
        left: '8rem',
        top: '-3rem',
        maxWidth: 'none',
        padding: `${theme.layoutSpacing(4)} ${theme.layoutSpacing(8)}`
    },
    tooltipHide: {
        display: 'none'
    },
    filterSection: {
        display: 'flex',
        paddingTop: theme.layoutSpacing(10),
        paddingBottom: theme.layoutSpacing(7),
        gap: theme.layoutSpacing(6)
    },
    viewMore: {
        alignSelf: 'end',
        whiteSpace: 'nowrap',
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16),
        fontWeight: '500',
        fontFamily: theme.title.h1.fontFamily,
        cursor: 'pointer',
        position: 'absolute',
        right: theme.layoutSpacing(12)
    },
    filterCategoryLabel2: {
        display: 'flex',
        alignItems: 'center',
        fontSize: theme.layoutSpacing(15),
        width: '100%',
        marginLeft: 0,
        marginRight: 0,
        height: '42px',
        fontFamily: theme.body.B1.fontFamily,
        letterSpacing: theme.layoutSpacing(0.75)
    },
    filterShowSection: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.separator.grey}`,
        '&:last-child': {
            borderBottom: 'none'
        }
    },
    filterActionSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    filterActionSection2: {
        display: 'flex',
        gap: theme.layoutSpacing(12),
        alignItems: 'center'
    },
    filterCombination: {
        display: 'flex',
        gap: theme.layoutSpacing(2),
        alignItems: 'center'
    },
    tooltipText: {
        fontFamily: theme.body.B3.fontFamily,
        fontSize: theme.layoutSpacing(15),
        width: 'max-content'
    }
}));

const dialogStyles = makeStyles({
    dialogContent: {
        border: 'none'
    }
});

const PivotInfo = [
    'Define the structure of the table you wish to consult by dragging and dropping the variables from the list of choices here under to “Filters” “Rows” and “Columns” on the right',
    'You can access drop down options for each chosen variable by clicking on the left handside on name of this variable'
];

/**
 * Functionality to select and apply multiple filters on a widget
 * @summary This component lets you select and apply multiple filters to fetch specific data.
 * It can be used where we need to give user multiple filter options.
 * JSON Structure-
 * {"dataValues": [
 *    {
 *        "widget_filter_index": <index id>,
 *        "widget_filter_function": <boolean>,
 *        "widget_filter_function_parameter": <boolean>,
 *        "widget_filter_hierarchy_key": <boolean>,
 *        "widget_filter_isall": <boolean>,
 *        "widget_filter_multiselect": <boolean>,
 *        "widget_tag_input_type": <input type>,
 *        "widget_tag_key": <tag key>,
 *        "widget_tag_label": <tag label>,
 *        "widget_tag_value": <tag value>
 *    },
 *    }
 * @param {object} props - parent_obj, app_info, screen_id
 */

export default function AppWidgetMultiSelectFilters({
    parent_obj,
    app_info,
    screen_id,
    newFilters
}) {
    const classes = useStyles();
    const theme = useTheme();
    const itemRef = useRef();
    const ref = useRef();
    const dialogClasses = dialogStyles();
    const [selected, setSelected] = React.useState(
        parent_obj.state?.comment_filters
            ? parent_obj.state?.comment_filters
            : parent_obj.state.screen_filters_values.defaultValues
    );
    const [filterData, setFilterData] = React.useState(
        parent_obj.state.screen_filters_values.dataValues
    );
    const [expanded, setExpanded] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [filterError, setFilterError] = React.useState({});

    const [pivotInfo, setPivotInfo] = React.useState(
        parent_obj.state.screen_filters_values.pivot_info
    );
    const dynamicPivot = parent_obj.state.screen_filters_values.dynamic_pivot;
    const hasPivot = !!(pivotInfo && pivotInfo.length);
    const [selectedFilterIndex, setSelectedFilterIndex] = React.useState(-1);
    const [resetCounter, setResetCounter] = React.useState(0);
    const [sliceName, setSliceName] = React.useState('');
    const [errorTextField, setErrorTextField] = React.useState('');
    const [openApplyFiltersDialog, setOpenApplyFiltersDialog] = React.useState(false);
    const [notification, setNotification] = React.useState('');
    const [notificationOpen, setNotificationOpen] = React.useState(false);
    const [existingSlices, setExistingSlices] = React.useState(false);
    const [radioSelected, setRadioSelected] = React.useState('');
    const filterSlice = parent_obj.state.screen_filters_values.filterSlice;
    const saveSlice = filterSlice?.save_slice ? filterSlice.save_slice : false;
    const loadSlice = filterSlice?.load_slice ? filterSlice.load_slice : false;
    React.useEffect(() => {
        getDynamicfilters({
            app_id: app_info.id,
            screen_id,
            payload: { selected: selected },
            callback: (resp) => {
                setExistingSlices(resp.filterSlice?.existingSlices);
            }
        });
    }, []);

    React.useEffect(() => {
        const updatedFilterError = {};
        filterData &&
            filterData.forEach((filterOption) => {
                if (hasPivot) {
                    const pivotItem = pivotInfo.find(
                        (el) => el.key === filterOption.widget_tag_key
                    );
                    if (pivotItem && !pivotItem.type) {
                        updatedFilterError[filterOption.widget_tag_key] = false;
                        return;
                    }
                }
                if (!filterOption.suppress_validation) {
                    if (
                        filterOption.widget_filter_type &&
                        filterOption.widget_filter_type === 'date_range'
                    ) {
                        //TODO: update error message for date range filter type
                    } else if (
                        filterOption.widget_filter_type &&
                        filterOption.widget_filter_type === 'range_select'
                    ) {
                        //TODO: update error message for range select filter type
                    } else {
                        const filterOptionValue = selected[filterOption.widget_tag_key] || [];
                        updatedFilterError[filterOption.widget_tag_key] =
                            filterOptionValue?.length === 0
                                ? 'Please select atleast one option to enable apply'
                                : false;
                    }
                }
            });
        setFilterError((prevState) => ({
            ...prevState,
            ...updatedFilterError
        }));
    }, [selected, hasPivot, pivotInfo, filterData]);

    const fetchDynamicData = useDebouncedCallback(
        (newState, name) => {
            setLoading((s) => s + 1);
            try {
                if (!screen_id) {
                    previewFilters({
                        app_id: app_info.id,
                        payload: {
                            code_string: parent_obj.state.filter_code,
                            selected_filters: newState
                        },
                        callback: (resp) => {
                            setSelected(resp.defaultValues);
                            setFilterData(resp.dataValues);
                            setLoading((s) => s - 1);
                        }
                    });
                } else {
                    getDynamicfilters({
                        app_id: app_info.id,
                        screen_id,
                        payload: { selected: newState, current_filter: name },
                        callback: (resp) => {
                            setSelected(resp.defaultValues);
                            setFilterData(resp.dataValues);
                            setLoading((s) => s - 1);
                        }
                    });
                }
            } catch (err) {
                // console.error(err);
                setLoading((s) => s - 1);
            }
        },
        [],
        1000
    );

    const onChangeFilter = (filter, name, value) => {
        const newState = { ...selected, [name]: value };
        setSelected({ ...newState });
        if (hasPivot) {
            newState['__pivot_info__'] = pivotInfo;
        }
        if (filter.widget_filter_dynamic) {
            fetchDynamicData(newState, name);
        }
    };

    const handleError = (name, param) => {
        setFilterError((prevState) => ({
            ...prevState,
            [name]: param?.message
        }));
    };

    const onToggleFilter = () => {
        // filterData[selectedFilterIndex].widget_filter_type = "date_range" // tobe removed
        setExpanded((prevState) => !prevState);
        setSelectedFilterIndex(-1);
    };

    const onCancel = () => {
        const savedSelected = JSON.parse(
            sessionStorage.getItem('app_screen_filter_info_' + app_info.id + '_' + screen_id) ||
                null
        );
        if (savedSelected) {
            setSelected({
                ...savedSelected
            });

            if (hasPivot && savedSelected['__pivot_info__']) {
                setPivotInfo(savedSelected['__pivot_info__']);
            }
        }
        onToggleFilter();
        setErrorTextField('');
        setSliceName('');
    };

    const apply = () => {
        parent_obj.getWidgetData(selected, pivotInfo);
        onToggleFilter();
        setSelectedFilterIndex(0);
    };

    const onSaveSlice = () => {
        let canSave = false;
        if (sliceName.length === 0) {
            setErrorTextField('Name cannot be empty!');
        } else if (!existingSlices) {
            canSave = true;
        } else {
            const existingSliceNames = existingSlices.map((item) => item.name);
            existingSliceNames.includes(sliceName)
                ? setErrorTextField('Slice Name already exists!')
                : (canSave = true);
        }
        if (canSave) {
            setErrorTextField('');
            getDynamicfilters({
                app_id: app_info.id,
                screen_id,
                payload: {
                    action_flag_type: 'save_slice',
                    slice_name: sliceName,
                    selected: selected,
                    dataValues: filterData
                },
                callback: (resp) => {
                    setSliceName('');
                    if (!('statusMessage' in resp)) {
                        setNotification({ message: 'Filter Slice saved successfully!' });
                        setNotificationOpen(true);
                        setExistingSlices(resp.filterSlice?.existingSlices);
                    } else if (resp['statusMessage'] === 'error') {
                        setNotification({
                            message: 'Slice could not be saved!',
                            severity: 'error'
                        });
                        setNotificationOpen(true);
                    } else {
                        setExistingSlices(resp.filterSlice?.existingSlices);
                        setOpenApplyFiltersDialog(true);
                    }
                }
            });
        }
    };

    const onLoadSlice = () => {
        if (radioSelected) {
            const existingSliceNames = existingSlices.map((item) => item.name);
            const selectedIndex = existingSliceNames.indexOf(radioSelected);
            const sliceID = existingSlices[selectedIndex].id;
            getDynamicfilters({
                app_id: app_info.id,
                screen_id,
                payload: {
                    action_flag_type: 'load_slice',
                    slice_name: radioSelected,
                    slice_id: sliceID,
                    selected: selected
                },
                callback: (resp) => {
                    if (resp.defaultValues && resp.dataValues) {
                        setNotification({ message: 'Slice Loaded Successfully!' });
                        setNotificationOpen(true);
                        setSelected(resp.defaultValues);
                        setFilterData(resp.dataValues);
                    } else {
                        setNotification({
                            message: 'Slice could not be Loaded!',
                            severity: 'error'
                        });
                    }
                }
            });
        }
    };

    const handleNameChange = (event) => {
        setSliceName(event.target.value);
    };

    const handleRadioChange = (event) => {
        setRadioSelected(event.target.value);
    };

    const closePopup = () => {
        setOpenApplyFiltersDialog(false);
    };

    const handleClickCloseNotification = () => {
        setNotificationOpen(false);
    };

    const filterErrorFound = _.find(filterError, function (error_item) {
        return error_item;
    });

    const handlePivotInfoChange = (e) => {
        setPivotInfo([...e]);
        if (dynamicPivot) {
            const newState = { ...selected, __pivot_info__: e };
            fetchDynamicData(newState, '__pivot_info__');
        }
    };

    const isPivot = (filterOption) => {
        if (hasPivot) {
            const item = pivotInfo.find((el) => el.key === filterOption.widget_tag_key);
            return !!item?.type;
        } else {
            return true;
        }
    };

    const onReset = () => {
        const savedSelected = JSON.parse(
            sessionStorage.getItem(
                'app_screen_initial_filter_info_' + app_info.id + '_' + screen_id
            ) || null
        );
        const dataValue = JSON.parse(
            sessionStorage.getItem(
                'app_screen_initial_filter_info_datavalue' + app_info.id + '_' + screen_id
            ) || null
        );
        if (savedSelected) {
            setFilterError({});
            setSelected({
                ...savedSelected
            });
            setFilterData(dataValue);
            if (hasPivot && savedSelected['__pivot_info__']) {
                setPivotInfo(savedSelected['__pivot_info__']);
                setSelectedFilterIndex(-1);
            }
        }
        setResetCounter((s) => s + 1);
    };

    const onFilterChange = (index) => {
        setSelectedFilterIndex(index);
    };

    const onFilterShortcutClick = (index) => {
        setExpanded(true);
        setSelectedFilterIndex(index);
    };

    const getFiltersWidth = (data) => {
        if (!data) {
            return '100%';
        }
        let countMd = 16;
        let countLg = 32;
        let width;
        if (data['widget_filter_search'] || filterErrorFound) {
            countMd = 12;
            countLg = 24;
        }
        if (data['widget_filter_search'] && filterErrorFound) {
            countMd = 10;
            countLg = 20;
        }
        width =
            data['widget_tag_value']?.length <= countMd
                ? 505
                : data['widget_tag_value']?.length <= countLg
                ? 985
                : 0;
        return width ? theme.layoutSpacing(width) : '100%';
    };

    return (
        <div key="app-screen-dynamic-filter-container" className={classes.filterContainer}>
            <AppBar position="relative" color="default" className={classes.appBar}>
                <Toolbar className={classes.filterToolbar}>
                    <div className={classes.filterSection}>
                        <Button
                            variant="outlined"
                            className={classes.filterButton}
                            onClick={onToggleFilter}
                            startIcon={
                                loading && !expanded ? (
                                    <CircularProgress
                                        size={10}
                                        className={classes.iconButtonProgress}
                                    />
                                ) : (
                                    <ScreenFilterIcon
                                        height={'14'}
                                        width={'16'}
                                        color={theme.palette.primary.contrastText}
                                    />
                                )
                            }
                            aria-label={hasPivot ? 'Pivot / Filters' : 'Filters'}
                        >
                            {hasPivot ? 'Pivot / Filters' : 'Filters'}
                        </Button>
                        <div
                            className={`${classes.filterAppliedList} ${
                                ref?.current?.scrollHeight > ref?.current?.clientHeight * 1.5
                                    ? classes.width
                                    : ''
                            }`}
                            ref={ref}
                        >
                            {_.map(filterData, function (filter_option, index) {
                                if (
                                    typeof selected[filter_option['widget_tag_key']] === 'undefined'
                                ) {
                                    return null;
                                }
                                if (selected[filter_option['widget_tag_key']] === null) {
                                    return null;
                                }
                                if (
                                    typeof selected[filter_option['widget_tag_key']] == 'object' &&
                                    !Object.keys(selected[filter_option['widget_tag_key']]).length
                                ) {
                                    return null;
                                }
                                if (
                                    typeof selected[filter_option['widget_tag_key']] == 'string' &&
                                    !selected[filter_option['widget_tag_key']].length
                                ) {
                                    return null;
                                }
                                if (filter_option['disabled']) {
                                    return null;
                                }
                                let prefix = '';
                                let suffix = '';
                                if (filter_option.widget_filter_type === 'range_select') {
                                    prefix = filter_option.widget_filter_params?.prefix || '';
                                    suffix = filter_option.widget_filter_params?.suffix || '';
                                }
                                let truncateString = (str, arr) => {
                                    let x = str
                                        .slice(0, 25)
                                        .split(',')
                                        .filter((el) => el.trim() !== '');
                                    if (str.length > 25) {
                                        return arr.length - x.length === 0
                                            ? `${str.slice(0, 25)}...`
                                            : `${str.slice(0, 25)}...+${arr.length - x.length}`;
                                    }
                                    return str;
                                };
                                return (
                                    <React.Fragment>
                                        <div className={classes.filterCombination} ref={itemRef}>
                                            <div
                                                className={`${classes.filterOptionContainer} ${
                                                    newFilters?.includes(
                                                        filter_option.widget_tag_key
                                                    )
                                                        ? classes.highlightFilters
                                                        : ''
                                                }`}
                                            >
                                                <div
                                                    onClick={() => onFilterShortcutClick(index)}
                                                    key={
                                                        'selected_filter_' +
                                                        filter_option['widget_tag_label']
                                                    }
                                                    className={classes.filterOption}
                                                    aria-label={filter_option['widget_tag_label']}
                                                >
                                                    <span className={classes.filterOptionHeader}>
                                                        <Typography variant="inherit" noWrap>
                                                            {filter_option['widget_tag_label'] &&
                                                            filter_option['widget_tag_label']
                                                                .length <= 3
                                                                ? `${filter_option[
                                                                      'widget_tag_label'
                                                                  ].toUpperCase()} :`
                                                                : `${filter_option['widget_tag_label']} :`}
                                                        </Typography>
                                                    </span>
                                                    <Tooltip
                                                        title={
                                                            <div>
                                                                {selected[
                                                                    filter_option['widget_tag_key']
                                                                ] instanceof Array &&
                                                                    selected[
                                                                        filter_option[
                                                                            'widget_tag_key'
                                                                        ]
                                                                    ].join(',').length > 25 &&
                                                                    !selected[
                                                                        filter_option[
                                                                            'widget_tag_key'
                                                                        ]
                                                                    ].includes('All') &&
                                                                    selected[
                                                                        filter_option[
                                                                            'widget_tag_key'
                                                                        ]
                                                                    ]?.map((el, i) => (
                                                                        <Typography
                                                                            className={
                                                                                classes.tooltipText
                                                                            }
                                                                            key={`${el}_${i}`}
                                                                        >
                                                                            {el}
                                                                        </Typography>
                                                                    ))}
                                                            </div>
                                                        }
                                                        classes={{
                                                            tooltip:
                                                                selected[
                                                                    filter_option['widget_tag_key']
                                                                ] instanceof Array &&
                                                                selected[
                                                                    filter_option['widget_tag_key']
                                                                ].join(',').length > 25 &&
                                                                !selected[
                                                                    filter_option['widget_tag_key']
                                                                ].includes('All')
                                                                    ? classes.tooltip
                                                                    : classes.tooltipHide
                                                        }}
                                                    >
                                                        <span className={classes.filterOptionValue}>
                                                            <Typography variant="inherit" noWrap>
                                                                {filter_option[
                                                                    'widget_filter_type'
                                                                ] ? (
                                                                    <>
                                                                        {filter_option[
                                                                            'widget_filter_type'
                                                                        ] === 'date_range' &&
                                                                            moment(
                                                                                new Date(
                                                                                    selected[
                                                                                        filter_option[
                                                                                            'widget_tag_key'
                                                                                        ]
                                                                                    ].start_date
                                                                                )
                                                                            ).format(
                                                                                filter_option[
                                                                                    'widget_filter_params'
                                                                                ]?.start_date
                                                                                    ?.format ||
                                                                                    'DD/MM/yyyy'
                                                                            ) +
                                                                                ' - ' +
                                                                                moment(
                                                                                    new Date(
                                                                                        selected[
                                                                                            filter_option[
                                                                                                'widget_tag_key'
                                                                                            ]
                                                                                        ].end_date
                                                                                    )
                                                                                ).format(
                                                                                    filter_option[
                                                                                        'widget_filter_params'
                                                                                    ]?.end_date
                                                                                        ?.format ||
                                                                                        'DD/MM/yyyy'
                                                                                )}
                                                                        {filter_option[
                                                                            'widget_filter_type'
                                                                        ] === 'range_select' &&
                                                                            (Array.isArray(
                                                                                selected[
                                                                                    filter_option[
                                                                                        'widget_tag_key'
                                                                                    ]
                                                                                ]
                                                                            )
                                                                                ? selected[
                                                                                      filter_option[
                                                                                          'widget_tag_key'
                                                                                      ]
                                                                                  ]
                                                                                      .map((el) => {
                                                                                          return (
                                                                                              prefix +
                                                                                              el +
                                                                                              suffix
                                                                                          );
                                                                                      })
                                                                                      .join(' - ')
                                                                                : prefix +
                                                                                  selected[
                                                                                      filter_option[
                                                                                          'widget_tag_key'
                                                                                      ]
                                                                                  ] +
                                                                                  suffix)}
                                                                    </>
                                                                ) : selected[
                                                                      filter_option[
                                                                          'widget_tag_key'
                                                                      ]
                                                                  ] instanceof Array &&
                                                                  selected[
                                                                      filter_option[
                                                                          'widget_tag_key'
                                                                      ]
                                                                  ].length > 1 ? (
                                                                    selected[
                                                                        filter_option[
                                                                            'widget_tag_key'
                                                                        ]
                                                                    ].indexOf('All') > -1 ? (
                                                                        'All'
                                                                    ) : (
                                                                        truncateString(
                                                                            selected[
                                                                                filter_option[
                                                                                    'widget_tag_key'
                                                                                ]
                                                                            ].join(' , '),
                                                                            selected[
                                                                                filter_option[
                                                                                    'widget_tag_key'
                                                                                ]
                                                                            ]
                                                                        )
                                                                    )
                                                                ) : (
                                                                    truncateString(
                                                                        typeof selected[
                                                                            filter_option
                                                                                .widget_tag_key
                                                                        ] === 'string'
                                                                            ? selected[
                                                                                  filter_option
                                                                                      .widget_tag_key
                                                                              ]
                                                                            : selected[
                                                                                  filter_option
                                                                                      .widget_tag_key
                                                                              ][0],
                                                                        selected[
                                                                            filter_option
                                                                                .widget_tag_key
                                                                        ]
                                                                    )
                                                                )}
                                                            </Typography>
                                                        </span>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            <div className={classes.verticalLine}></div>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                            <br />
                        </div>
                        {ref?.current?.scrollHeight > ref?.current?.clientHeight * 1.5 && (
                            <div className={classes.viewMore} onClick={onToggleFilter}>
                                View more
                            </div>
                        )}
                    </div>
                </Toolbar>
            </AppBar>
            <Grid
                container
                className={clsx(classes.filtersGridBody, !expanded && classes.hide)}
                spacing={0}
                aria-label="filter_menu"
            >
                <Grid item xs={12}>
                    <Paper className={classes.filterCategoryBody}>
                        <Grid container className={classes.filterDataWrapper}>
                            <Grid
                                container
                                spacing={0}
                                alignContent="space-between"
                                className={classes.categoriesWrapper}
                            >
                                <Grid item xs={12} className={classes.categories}>
                                    {hasPivot ? (
                                        <div className={classes.pivotSelection}>
                                            <div
                                                name={'selections'}
                                                key={'selections+1'}
                                                className={clsx(
                                                    classes.filterCategoryLabel,
                                                    selectedFilterIndex === -1
                                                        ? classes.filterCategoryLabelButtonSelected
                                                        : classes.filterCategoryLabelButton
                                                )}
                                                onClick={() => setSelectedFilterIndex(-1)}
                                            >
                                                <span>Selections &nbsp;</span>
                                                <InfoPopper
                                                    size="large"
                                                    desc={PivotInfo}
                                                    classes={{
                                                        triggerIcon:
                                                            selectedFilterIndex === -1
                                                                ? classes.triggerIconSelected
                                                                : classes.triggerIcon
                                                    }}
                                                />
                                                <div style={{ flex: 1 }}></div>

                                                <SettingsIcon
                                                    fontSize="large"
                                                    className={
                                                        selectedFilterIndex === -1
                                                            ? classes.triggerIconSelected
                                                            : classes.triggerIcon
                                                    }
                                                />
                                                <ChevronRightIcon
                                                    fontSize="large"
                                                    className={
                                                        selectedFilterIndex === -1
                                                            ? classes.filterCategoryLabelButtonIconSelected
                                                            : classes.filterCategoryLabelButtonIcon
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                    <div className={classes.filterCategoryLabelBody}>
                                        {_.map(filterData, function (filter_option, index) {
                                            const selectedOptionsCount =
                                                filter_option?.widget_filter_multiselect
                                                    ? selected[filter_option?.widget_tag_key]
                                                          ?.length
                                                    : 1;
                                            return (
                                                <div className={classes.filterShowSection}>
                                                    <div
                                                        key={
                                                            'widget_container_' +
                                                            filter_option['widget_tag_key']
                                                        }
                                                        name={filter_option['widget_tag_key']}
                                                        className={clsx(
                                                            classes.filterCategoryLabel2,
                                                            selectedFilterIndex === index
                                                                ? classes.filterCategoryLabelButtonSelected
                                                                : classes.filterCategoryLabelButton,
                                                            isPivot(filter_option)
                                                                ? ''
                                                                : classes.hidden
                                                        )}
                                                        onClick={() => onFilterChange(index)}
                                                    >
                                                        <span>{`${filter_option['widget_tag_label']} (${selectedOptionsCount}/${filter_option?.widget_tag_value?.length})`}</span>
                                                        <div style={{ flex: 1 }}></div>
                                                        {filterError &&
                                                        filterError[
                                                            filter_option['widget_tag_key']
                                                        ] ? (
                                                            <ErrorOutlineIcon
                                                                fontSize="large"
                                                                role="img"
                                                                titleAccess={
                                                                    filterError[
                                                                        filter_option[
                                                                            'widget_tag_key'
                                                                        ]
                                                                    ]
                                                                }
                                                                className={
                                                                    selectedFilterIndex === index
                                                                        ? classes.filterCategoryLabelButtonErrorIconSelected
                                                                        : classes.filterCategoryLabelButtonErrorIcon
                                                                }
                                                            />
                                                        ) : (
                                                            ''
                                                        )}
                                                        {selectedFilterIndex === index && (
                                                            <ChevronRightIcon
                                                                fontSize="large"
                                                                className={
                                                                    selectedFilterIndex === index
                                                                        ? classes.filterCategoryLabelButtonIconSelected
                                                                        : classes.filterCategoryLabelButtonIcon
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {app_info.modules?.slice && (loadSlice || saveSlice) && (
                                            <div
                                                key="slice management"
                                                className={classes.sliceManagement}
                                            >
                                                <span className={classes.sliceManagementLabel}>
                                                    Slice Management
                                                </span>
                                                <div style={{ flex: 1 }}></div>
                                                {saveSlice && (
                                                    <div
                                                        key="Save Slice"
                                                        data-testid="save slice"
                                                        className={clsx(
                                                            classes.filterCategoryLabel,
                                                            selectedFilterIndex === -2
                                                                ? classes.filterCategoryLabelButtonSelected
                                                                : classes.filterCategoryLabelButton
                                                        )}
                                                        onClick={() => onFilterChange(-2)}
                                                    >
                                                        <span>Save Slice</span>
                                                        <ChevronRightIcon
                                                            fontSize="large"
                                                            className={
                                                                selectedFilterIndex === -2
                                                                    ? classes.sliceArrowIconSelected
                                                                    : classes.sliceArrowIcon
                                                            }
                                                        />
                                                    </div>
                                                )}
                                                {loadSlice && existingSlices && (
                                                    <div
                                                        key="Load Slice"
                                                        data-testid="load slice"
                                                        className={clsx(
                                                            classes.filterCategoryLabel,
                                                            selectedFilterIndex === -3
                                                                ? classes.filterCategoryLabelButtonSelected
                                                                : classes.filterCategoryLabelButton
                                                        )}
                                                        onClick={() => onFilterChange(-3)}
                                                    >
                                                        <span>Load Slice</span>
                                                        <ChevronRightIcon
                                                            fontSize="large"
                                                            className={
                                                                selectedFilterIndex === -3
                                                                    ? classes.sliceArrowIconSelected
                                                                    : classes.sliceArrowIcon
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Grid>
                                <Grid item xs={12} className={classes.actionButtonsWrapper}>
                                    <Toolbar className={classes.filterButtonToolbar}>
                                        {loading ? (
                                            <CodxCircularLoader
                                                size={40}
                                                style={{ position: 'absolute' }}
                                            />
                                        ) : (
                                            <div className={classes.filterActionSection}>
                                                <Button
                                                    variant="outlined"
                                                    onClick={onReset}
                                                    className={classes.resetFilter}
                                                    startIcon={<RefreshIcon color="inherit" />}
                                                    disabled={loading}
                                                    key="reset"
                                                    aria-label="Reset"
                                                >
                                                    Reset
                                                </Button>
                                                <div className={classes.filterActionSection2}>
                                                    <Button
                                                        aria-label="close filter"
                                                        variant="outlined"
                                                        onClick={onCancel}
                                                        className={
                                                            classes.filterToolbarButtonCancel
                                                        }
                                                        key="cancel"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <CodxPopupDialog
                                                        key="apply-filter-popup"
                                                        open={openApplyFiltersDialog}
                                                        setOpen={setOpenApplyFiltersDialog}
                                                        dialogTitle="Apply Filter Slice"
                                                        dialogContent="Saved Successfully! Do you want to apply the saved filter slice?"
                                                        dialogActions={
                                                            <>
                                                                <Button
                                                                    variant="outlined"
                                                                    onClick={closePopup}
                                                                    aria-label="Cancel Apply Filter"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    onClick={() => {
                                                                        closePopup();
                                                                        apply();
                                                                    }}
                                                                    aria-label="Confirm Apply Filter"
                                                                >
                                                                    Confirm
                                                                </Button>
                                                            </>
                                                        }
                                                        maxWidth="xs"
                                                        dialogClasses={dialogClasses}
                                                    />
                                                    <CustomSnackbar
                                                        key="filter-slice-save-notification-container"
                                                        open={
                                                            notificationOpen &&
                                                            notification?.message
                                                                ? true
                                                                : false
                                                        }
                                                        autoHideDuration={
                                                            notification?.autoHideDuration ===
                                                            undefined
                                                                ? 3000
                                                                : notification?.autoHideDuration
                                                        }
                                                        onClose={handleClickCloseNotification}
                                                        severity={
                                                            notification?.severity || 'success'
                                                        }
                                                        message={notification?.message}
                                                    />
                                                    <Button
                                                        key={'apply_filter'}
                                                        aria-label="apply filter"
                                                        variant="contained"
                                                        onClick={apply}
                                                        edge="end"
                                                        className={classes.filterToolbarButtonApply}
                                                        disabled={!!filterErrorFound}
                                                    >
                                                        Apply
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </Toolbar>
                                </Grid>
                            </Grid>
                            {selectedFilterIndex !== -1 && (
                                <Grid
                                    container
                                    spacing={0}
                                    alignContent="space-between"
                                    className={classes.categoriesDataWrapper}
                                    style={{
                                        width: getFiltersWidth(filterData[selectedFilterIndex])
                                    }}
                                >
                                    <Grid item xs={12} className={classes.categoriesData}>
                                        {selectedFilterIndex === -1 ||
                                        selectedFilterIndex === -2 ||
                                        selectedFilterIndex === -3 ? (
                                            selectedFilterIndex === -1 && hasPivot ? (
                                                <PivotFilter
                                                    key={expanded + ' ' + resetCounter}
                                                    pivotInfo={pivotInfo}
                                                    onChange={handlePivotInfoChange}
                                                />
                                            ) : selectedFilterIndex === -2 ? (
                                                <div className={classes.filterCategoryOptionsBody}>
                                                    <Typography
                                                        variant="subtitle1"
                                                        className={classes.saveSliceLabel}
                                                    >
                                                        Slice Name
                                                    </Typography>
                                                    <ThemeProvider theme={textCompTheme}>
                                                        <TextField
                                                            variant="filled"
                                                            className={classes.dialogFont}
                                                            value={sliceName}
                                                            onChange={handleNameChange}
                                                            InputProps={{
                                                                classes: {
                                                                    input: classes.formInput
                                                                }
                                                            }}
                                                            error={!!errorTextField}
                                                            helperText={errorTextField}
                                                            id={sliceName || 'name'}
                                                        />
                                                    </ThemeProvider>
                                                    <Button
                                                        aria-label="save slice"
                                                        variant="contained"
                                                        onClick={onSaveSlice}
                                                        className={classes.saveSliceButton}
                                                        key="saveSlice"
                                                    >
                                                        Save Slice
                                                    </Button>
                                                </div>
                                            ) : selectedFilterIndex === -3 ? (
                                                <div className={classes.filterCategoryOptionsBody}>
                                                    <RadioGroup
                                                        name="load slice selector"
                                                        onChange={handleRadioChange}
                                                    >
                                                        {existingSlices.map((option) => (
                                                            <FormControlLabel
                                                                key={option.id}
                                                                value={option.name}
                                                                className={classes.iconSize}
                                                                label={
                                                                    <Typography
                                                                        variant="subtitle1"
                                                                        className={
                                                                            classes.radioLabel
                                                                        }
                                                                    >
                                                                        {option.name}
                                                                    </Typography>
                                                                }
                                                                control={<Radio size="large" />}
                                                            />
                                                        ))}
                                                    </RadioGroup>
                                                    <Button
                                                        aria-label="load slice"
                                                        variant="contained"
                                                        onClick={onLoadSlice}
                                                        className={classes.loadSliceButton}
                                                        key="loadSlice"
                                                        disabled={!radioSelected}
                                                    >
                                                        Load Slice
                                                    </Button>
                                                </div>
                                            ) : null
                                        ) : (
                                            <div
                                                key={resetCounter}
                                                className={classes.filterCategoryOptionsBody}
                                            >
                                                {expanded &&
                                                    (filterData[selectedFilterIndex]
                                                        .widget_filter_type ? (
                                                        <>
                                                            {filterData[selectedFilterIndex]
                                                                .widget_filter_type ===
                                                                'date_range' && (
                                                                <DateRangeSelect
                                                                    key={
                                                                        filterData[
                                                                            selectedFilterIndex
                                                                        ].widget_tag_key
                                                                    }
                                                                    value={
                                                                        selected[
                                                                            filterData[
                                                                                selectedFilterIndex
                                                                            ].widget_tag_key
                                                                        ]
                                                                    }
                                                                    params={
                                                                        filterData[
                                                                            selectedFilterIndex
                                                                        ].widget_filter_params
                                                                    }
                                                                    onChangeFilter={onChangeFilter.bind(
                                                                        null,
                                                                        filterData[
                                                                            selectedFilterIndex
                                                                        ],
                                                                        filterData[
                                                                            selectedFilterIndex
                                                                        ]['widget_tag_key']
                                                                    )}
                                                                    onError={handleError.bind(
                                                                        null,
                                                                        filterData[
                                                                            selectedFilterIndex
                                                                        ].widget_tag_key
                                                                    )}
                                                                />
                                                            )}
                                                            {filterData[selectedFilterIndex]
                                                                .widget_filter_type ===
                                                                'range_select' && (
                                                                <NumberRangeSelect
                                                                    key={
                                                                        filterData[
                                                                            selectedFilterIndex
                                                                        ].widget_tag_key
                                                                    }
                                                                    value={
                                                                        selected[
                                                                            filterData[
                                                                                selectedFilterIndex
                                                                            ].widget_tag_key
                                                                        ]
                                                                    }
                                                                    params={
                                                                        filterData[
                                                                            selectedFilterIndex
                                                                        ].widget_filter_params
                                                                    }
                                                                    onChange={onChangeFilter.bind(
                                                                        null,
                                                                        filterData[
                                                                            selectedFilterIndex
                                                                        ],
                                                                        filterData[
                                                                            selectedFilterIndex
                                                                        ]['widget_tag_key']
                                                                    )}
                                                                    onError={handleError.bind(
                                                                        null,
                                                                        filterData[
                                                                            selectedFilterIndex
                                                                        ].widget_tag_key
                                                                    )}
                                                                />
                                                            )}
                                                        </>
                                                    ) : (
                                                        <AppMultipleSelect
                                                            key={
                                                                filterData[selectedFilterIndex]
                                                                    .widget_tag_key
                                                            }
                                                            item={
                                                                filterData[selectedFilterIndex]
                                                                    .widget_tag_key
                                                            }
                                                            selectedValue={selected}
                                                            data={filterData[selectedFilterIndex]}
                                                            params={
                                                                filterData[selectedFilterIndex]
                                                                    .widget_filter_params
                                                            }
                                                            onChangeFilter={onChangeFilter.bind(
                                                                null,
                                                                filterData[selectedFilterIndex],
                                                                filterData[selectedFilterIndex][
                                                                    'widget_tag_key'
                                                                ]
                                                            )}
                                                            filterErrorFound={filterErrorFound}
                                                        />
                                                    ))}
                                            </div>
                                        )}
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        className={classes.selectedFiltersCountWrapper}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            {expanded && <div className={classes.overlay} />}
        </div>
    );
}
