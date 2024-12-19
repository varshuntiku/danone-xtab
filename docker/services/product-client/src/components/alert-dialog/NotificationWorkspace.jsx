import React, { Fragment, useEffect, useState } from 'react';
import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableFooter,
    TablePagination,
    Select,
    Switch,
    Tooltip
    /*, Icon*/
} from '@material-ui/core';
import {
    Paper,
    IconButton,
    withWidth,
    Button,
    Chip,
    AppBar,
    Toolbar,
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@material-ui/core';
import CloseIcon from '../../assets/Icons/CloseBtn';
import { Typography, MenuItem, ThemeProvider, Grid, FormControl, Menu } from '@material-ui/core';
import PropTypes from 'prop-types';
import {
    KeyboardArrowLeft,
    KeyboardArrowRight /*, ReportProblemOutlined*/,
    ArrowBackIos,
    KeyboardArrowDown,
    InfoOutlined
} from '@material-ui/icons';
import {
    updateNotificationRead,
    markAllNotificationRead,
    getFilteredNotifications,
    deleteNotifications,
    addSubscription
} from '../../services/alerts';
import { connect } from 'react-redux';
import { getNotifications, setNotifications } from 'store/index';
import RedCircleIcon from '../../assets/img/RedCircleIcon';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { Checkbox } from '@material-ui/core';
import ScreenFilterIcon from '../../assets/Icons/ScreenFilterIcon';
// import DatePicker from '../dynamic-form/inputFields/datepicker';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';
import { selectCompTheme } from '../dynamic-form/inputFields/select';
import DateRangeSelect from '../AppWidgetMultiSelect/DateRangeSelect';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import CodxPopupDialog from 'components/custom/CodxPoupDialog';
import CustomSnackbar from 'components/CustomSnackbar';
import CodxCircularLoader from 'components/CodxCircularLoader';

/* styles for table cell and row */
const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.background.tableHeader,
        color: theme.palette.text.titleText,
        fontSize: '1.5rem',
        letterSpacing: '0.5px',
        fontWeight: '500',
        padding: '2rem',
        fontFamily: theme.body.B5.fontFamily
    },
    body: {
        color: theme.palette.text.titleText,
        fontSize: '1.5rem',
        width: 'auto',
        padding: '0.8rem 0.8rem',
        fontFamily: theme.body.B5.fontFamily
    }
}))(TableCell);

const StyledTableRow = withStyles(() => ({
    root: {
        borderBottom: '1px solid rgba(151, 151, 151, 0.4)'
    }
}))(TableRow);

/* style for table pagination */
const paginationStyles = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
        '& .MuiSvgIcon-root': {
            color: theme.palette.text.titleText
        }
    }
}));

const workspaceStyles = makeStyles((theme) => ({
    table: {
        '& .MuiTableCell-root': {
            borderBottom: 'none !important'
        },
        border: 'none !important',
        borderRadius: '0 !important',
        padding: '1rem'
    },
    random: {
        '& .MuiTablePagination-selectRoot': {
            display: 'none'
        },
        '& .MuiTablePagination-caption': {
            fontSize: '1.5rem',
            color: theme.palette.text.titleText
        }
    },
    tableHeader: {
        height: '5.5rem',
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        padding: '1rem 3rem',
        position: 'relative',
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`,
        color: theme.palette.text.titleText,
        fontWeight: 400,
        fontFamily: theme.title.h1.fontFamily,
        alignItems: 'center',
        fontSize: '2.1rem'
    },
    alertsType: {
        textTransform: 'capitalize'
    },
    conformBoxDialogRoot: {
        margin: 0,
        padding: theme.spacing(2),
        '& .MuiTypography-caption': {
            fontSize: '1.75rem'
        },
        background: theme.palette.background.paper
    },
    conformBoxDialogTitle: {
        fontSize: theme.layoutSpacing(22),
        letterSpacing: '1.5px',
        fontWeight: '400',
        color: '#C7202B',
        fontFamily: theme.title.h1.fontFamily,
        opacity: '0.8'
    },
    conformBoxDialogContent: {
        color: theme.palette.text.titleText,
        fontSize: '1.75rem'
    },
    alertIcon: {
        '&.MuiSvgIcon-root': {
            color: '#FE6A9C',
            fontSize: '2.5rem'
        }
    },
    tableColHeading: {
        '& .MuiTableCell-body': {
            fontSize: '2rem',
            padding: '1.5rem 1rem 1.5rem 1rem'
        }
    },
    doneButton: {
        border: 'none',
        '&:hover': {
            border: 'none',
            opacity: 1
        }
    },
    doneIcon: {
        color: theme.palette.text.titleText,
        opacity: '0.8'
    },
    searchField: {
        padding: '1.5rem 1rem'
    },
    searchFieldUnderline: {
        background: 'transparent',
        '&::before': {
            borderColor: theme.palette.border.light
        }
    },
    read: {
        '& .MuiSvgIcon-root': {
            color: theme.palette.text.titleText,
            opacity: '0.4'
        }
    },
    unread: {
        '& .MuiSvgIcon-root': {
            color: theme.palette.border.buttonOutline
        }
    },
    appBar: {
        backgroundColor: theme.palette.primary.dark,
        minHeight: '3rem !important',
        boxShadow: 'none !important',
        '& .MuiToolbar-regular': {
            minHeight: '3rem !important'
        }
    },
    filterButton: {
        padding: '0.2rem 0.7rem',
        borderRadius: '2px',
        '&.MuiSvgIcon-root': {
            fontSize: '1.6rem',
            marginRight: '0.5rem',
            marginTop: '0.5rem',
            color: theme.palette.border.buttonOutline
        },
        '& svg': {
            width: '1.5rem',
            height: '1.8rem'
        },
        '& .MuiIconButton-label': {
            marginTop: '0.5rem',
            '& svg': {
                width: '2.5rem'
            }
        },
        '& .MuiButton-startIcon': {
            marginLeft: '0.5rem'
        }
    },
    title: {
        marginRight: '0.5rem',
        fontSize: '1.5rem',
        letterSpacing: '0.19rem'
    },
    statusSection: {
        '& .MuiFormLabel-root': {
            fontSize: '2rem',
            color: theme.palette.text.default
        },
        '& .MuiFormLabel-root.Mui-focused': {
            color: theme.palette.text.default
        },
        '& .MuiFormGroup-root .MuiFormControlLabel-root .MuiFormControlLabel-label': {
            fontSize: '1.5rem'
        }
    },
    tableFilterRow: {
        borderBottom: 'none !important',
        '& .MuiTableCell-root': {
            padding: 0,
            borderBottom: 'none !important'
        }
    },
    dateSection: {
        '& .MuiFormLabel-root': {
            fontSize: '2rem',
            color: theme.palette.text.default
        },
        '& .MuiFormControl-root .MuiInputBase-root .MuiInputBase-input': {
            fontSize: '1.5rem',
            color: theme.palette.text.default
        }
    },
    filterSection: {
        '& .MuiButtonBase-root': {
            marginRight: '2rem',
            marginTop: '1rem'
        }
    },
    chip: {
        backgroundColor: theme.palette.primary.light,
        fontSize: '1.8rem',
        color: theme.palette.text.default,
        marginRight: '1rem',
        '& span': {
            lineHeight: '3rem'
        },
        '& svg': {
            fill: theme.palette.text.default,
            background: 'transparent',
            borderRadius: '50%',
            padding: '3px'
        }
    },
    shared: {
        fontSize: '1.5rem',
        textTransform: 'capitalize'
    },
    backBtn: {
        position: 'absolute',
        left: 0,
        marginLeft: '2rem'
    },
    menu: {
        '& .MuiList-padding': {
            padding: 0
        },
        '& .MuiMenuItem-root': {
            width: '26rem',
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.6rem',
            color: theme.palette.text.default,
            padding: '1rem !important',
            height: '4.5rem',
            minHeight: '4.5rem',
            fontFamily: theme.body.B5.fontFamily,
            '&:hover': {
                backgroundColor: theme.palette.background.selected
            }
        }
    },
    notificationsBar: {
        position: 'relative',
        padding: '0.5rem 2.4rem',
        marginTop: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    SubnotificationsBar: {
        justifyContent: 'space-between'
    },
    tabs: {
        display: 'flex',
        gap: theme.layoutSpacing(18),
        fontWeight: '500',
        '& div': {
            fontSize: theme.layoutSpacing(20),
            fontFamily: theme.title.h1.fontFamily
        }
    },
    actionsBar: {
        position: 'relative',
        padding: '0.5rem 2.4rem',
        marginTop: '0.5rem',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    standingPip: {
        position: 'relative',
        width: 0,
        height: '3rem',
        '&::before': {
            content: '""',
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)',
            width: '1px',
            height: '100%',
            backgroundColor: theme.palette.border.loginGrid
        }
    },
    deleteButton: {
        '& .MuiSvgIcon-root': {
            width: '1.7rem',
            height: '2rem'
        },
        '& .MuiButton-label': {
            fontSize: '1.6rem !important'
        }
    },
    markButton: {
        '& .MuiButton-label': {
            fontSize: '1.6rem !important'
        }
    },
    headerCell: {
        padding: '1rem 0.8rem'
    },
    headerCellRestricted: {
        padding: '1rem 0.8rem',
        width: '8rem',
        maxWidth: '100%'
    },
    moremenu: {
        padding: '0.8rem',
        margin: '0rem !important',
        '& .MuiIconButton-root': {
            marginRight: '0rem !important'
        },
        '& .MuiSvgIcon-root': {
            width: '2rem',
            height: '2rem',
            marginRight: '0rem !important'
        }
    },
    dropdownMenu: {
        padding: 0,
        margin: 0,
        fontFamily: theme.body.B5.fontFamily,
        '& .MuiList-padding': {
            padding: 0
        }
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '1.3rem',
        color: theme.palette.text.default,
        padding: '1rem !important',
        height: '4.5rem',
        minHeight: '4.5rem',
        fontFamily: theme.body.B5.fontFamily,
        '&:hover': {
            background: 'none'
        }
    },
    checkbox: {
        margin: '0px',

        padding: '6px'
    },
    menudrop: {
        margin: '0px'
    },
    menuItemSelected: {
        backgroundColor: '#EDEDED'
    },
    subscriptionContainer: {
        maxHeight: '70rem',
        overflowY: 'scroll'
    },
    LoadingContainer: {
        minHeight: '70rem',
        overflowY: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerHeader: {
        width: '95%',
        padding: theme.layoutSpacing(15),
        paddingTop: theme.layoutSpacing(16),
        minHeight: theme.layoutSpacing(72),
        backgroundColor: theme.palette.background.tableHeader,
        fontSize: theme.layoutSpacing(17),
        fontFamily: theme.body.B5.fontFamily,
        fontWeight: '500',
        display: 'flex',
        marginLeft: theme.layoutSpacing(20),
        color: theme.palette.text.default,
        justifyContent: 'space-between',
        alignItems: 'center',
        '& div': {
            display: 'flex',
            alignItems: 'center'
        }
    },
    tableHeaderSection: {
        width: '95%',
        minHeight: theme.layoutSpacing(40),
        marginLeft: theme.layoutSpacing(20),
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        '& div': {
            '&:first-child': {
                justifyContent: 'start',
                paddingLeft: theme.layoutSpacing(15)
            },
            fontSize: theme.layoutSpacing(17),
            fontFamily: theme.body.B5.fontFamily,
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    },
    infoIcon: {
        fontSize: theme.layoutSpacing(20),
        marginLeft: theme.layoutSpacing(13),
        cursor: 'pointer'
    },
    settingIcon: {
        fontSize: theme.layoutSpacing(20),
        marginRight: theme.layoutSpacing(12)
    },
    closeIcon: {
        '& svg': {
            fontSize: theme.layoutSpacing(10),
            marginRight: theme.layoutSpacing(15),
            fill: theme.palette.icons.closeIcon
        }
    },
    accordionSummary: {
        minHeight: `${theme.layoutSpacing(48.5)} !important`,
        width: '100%',
        '& .MuiAccordionSummary-content': {
            margin: '0px 0 !important',
            minHeight: `${theme.layoutSpacing(48.5)} !important`,
            backgroundColor: 'transparent !important'
        }
    },
    childAccordionSummary: {
        marginLeft: '0px'
    },
    mainScreen: {
        borderBottom: `2px solid ${theme.palette.separator.tableContent}`,
        width: '95%',
        marginLeft: `${theme.layoutSpacing(20)} !important`,
        backgroundColor: `${theme.palette.background.pureWhite} !important`,
        '&:before': {
            display: 'none',
            backgroundColor: 'transparent !important',
            opacity: '1 !important'
        },
        '&:hover': {
            opacity: '1 !important'
        }
    },
    commentDisbaled: {
        opacity: '0.5'
    },
    subScreenContainer: {
        width: '100%',
        border: '1px solid #00000024',
        marginBottom: theme.layoutSpacing(10),
        '& .MuiAccordion-root:hover': {
            opacity: '1 !important'
        }
    },
    subScreenMain: {
        borderBottom: `2px solid ${theme.palette.separator.tableContent}`,
        width: '100%',
        backgroundColor: `${theme.palette.background.pureWhite} !important`,
        '&:before': {
            display: 'none'
        }
    },
    selectedMainScreen: {
        borderBottom: 'none'
    },
    subScreenName: {
        fontSize: theme.layoutSpacing(18),
        marginLeft: theme.layoutSpacing(20),
        '& svg': {
            fontSize: theme.layoutSpacing(14),
            marginRight: theme.layoutSpacing(12)
        }
    },
    hideIcon: {
        '& svg': {
            visibility: 'hidden'
        }
    },
    mainScreenContainer: {
        width: '100%',
        display: 'grid',
        alignItems: 'center',
        gridTemplateColumns: 'repeat(5,1fr)',
        '& div': {
            fontSize: theme.layoutSpacing(17),
            fontFamily: theme.body.B5.fontFamily,
            fontWeight: '500',
            display: 'flex',
            justifyContent: 'center',
            paddingLeft: theme.layoutSpacing(15)
        }
    },
    subScreenHeader: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5,1fr)', //'30% auto auto auto auto',
        width: '100%',
        backgroundColor: theme.palette.background.tableHeader,
        minHeight: '30px',
        padding: '10px',
        borderBottom: 'none',
        '& .MuiTypography-body1': {
            fontSize: '14px',
            marginLeft: '5px',
            fontWeight: '500'
        },
        '&:before': {
            display: 'none'
        }
    },
    column: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '18px'
    },
    columnTwo: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '13px'
    },
    screenName: {
        fontSize: `${theme.layoutSpacing(16)}`,
        '& svg': {
            fontSize: theme.layoutSpacing(16),
            marginRight: theme.layoutSpacing(6)
        }
    },
    expandedScreenName: {
        '& svg': {
            fontSize: theme.layoutSpacing(16),
            marginRight: theme.layoutSpacing(6),
            transform: 'rotate(90deg)'
        }
    },
    formControl: {
        margin: theme.layoutSpacing(6),
        minWidth: 180,
        borderBottom: `2px solid ${theme.palette.separator.tableContent}`
    },
    tabName: {
        fontSize: theme.layoutSpacing(18),
        marginLeft: theme.layoutSpacing(40),
        '& svg': {
            fontSize: theme.layoutSpacing(14),
            marginRight: theme.layoutSpacing(12)
        }
    },
    tabContainer: {
        minHeight: `${theme.layoutSpacing(48.5)} !important`,
        padding: `0rem 1.6rem`
    },
    actionButtons: {
        width: '95%',
        marginLeft: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: theme.layoutSpacing(10)
    },
    // switch element styles
    root: {
        width: theme.layoutSpacing(50),
        height: theme.layoutSpacing(24),
        padding: '0px !important',
        margin: theme.layoutSpacing(1)
    },
    switchBase: {
        left: theme.layoutSpacing(4),
        top: theme.layoutSpacing(4),
        padding: '0px !important',
        '&$checked': {
            transform: `translateX(${theme.layoutSpacing(28)})`,
            color: theme.palette.common.white,
            '& + $track': {
                backgroundColor: 'red',
                opacity: 1
            }
        }
    },
    customText: {
        color: '#2B70C2'
    },
    thumb: {
        width: theme.layoutSpacing(15),
        height: theme.layoutSpacing(15)
    },
    track: {
        borderRadius: theme.layoutSpacing(12),
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border'])
    },
    checked: {},
    focusVisible: {},
    toolTipStyle: {
        backgroundColor: theme.palette.background.tooltipBackground,
        position: 'relative',
        top: '-2rem',
        ZIndex: 10,
        height: 'fit-content',
        textAlign: 'start',
        fontSize: theme.layoutSpacing(17),
        padding: theme.layoutSpacing(15),
        borderRadius: '0.5rem',
        color: theme.palette.text.tooltipTextColor,
        fontWeight: '400',
        letterSpacing: '0.35%',
        lineHeight: '15.23px',
        maxWidth: theme.layoutSpacing(450),
        fontFamily: theme.body.B5.fontFamily
    },
    tooltipText: {
        fontSize: theme.layoutSpacing(17),
        fontFamily: theme.body.B5.fontFamily,
        '& span': {
            fontSize: theme.layoutSpacing(15.5)
        }
    },
    dialogPaper: {
        width: '25%',
        backdropFilter: 'blur(2rem)',
        borderRadius: 'unset'
    },
    dialogRoot: {
        margin: theme.spacing(2),
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        paddingLeft: 0,
        paddingRight: 0,
        display: 'flex',
        justifyContent: 'space-between',
        '& .MuiTypography-caption': {
            fontSize: '2rem'
        },
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`
    },
    dialogTitle: {
        fontSize: '2.6rem',
        width: '60%',
        letterSpacing: '1.5px',
        color: '#C7202B',
        display: 'flex',
        fontFamily: 'Graphik Compact',
        alignItems: 'center',
        gap: '1rem',
        '& svg': {
            width: '2.6rem',
            height: '2.6rem',
            fill: theme.palette.text.contrastText
        }
    },
    closeButton: {
        width: '4rem',
        height: '4rem',
        padding: '0',
        marginRight: '-0.4rem',
        '& svg': {
            fill: theme.palette.text.contrastText,
            width: '2rem',
            height: '2rem'
        }
    },
    dialogContent: {
        color: theme.palette.text.titleText,
        fontSize: '1.67rem'
    },
    content: {
        fontSize: '1.67rem',
        fontWeight: '400',
        lineHeight: '2rem',
        letterSpacing: '0.5px'
    },
    proceed: {
        marginBottom: '2.4rem',
        marginRight: '1.6rem'
    },
    cancel: {
        marginBottom: '2.4rem'
    }
}));

/* table pagination functionality */
function TablePaginationActions(props) {
    const classes = paginationStyles();
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };
    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowRight fontSize="large" />
                ) : (
                    <KeyboardArrowLeft fontSize="large" />
                )}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowLeft fontSize="large" />
                ) : (
                    <KeyboardArrowRight fontSize="large" />
                )}
            </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired
};

/* set number of rows for table according to screenresoultion */
const numOfRows = {
    lg: 7,
    md: 6,
    sm: 4
};

function NotificationFilters(props) {
    const classes = workspaceStyles();
    const { filterOptions, setFilterOptions } = props;
    const [showFilters, setShowFilters] = useState(false);
    const [filtersChip, setFiltersChip] = useState({
        status: '',
        type: '',
        dateRange: ''
    });

    const onOpenFilterHandler = () => {
        setShowFilters(true);
    };

    const handleStatusChange = (event) => {
        event.preventDefault();
        setFilterOptions({
            ...filterOptions,
            [event.target.name]: event.target.value
        });
    };

    const handleDateChangeSelect = (data) => {
        setFilterOptions({
            ...filterOptions,
            startDate: data.start_date,
            endDate: data.end_date
        });
    };

    const hideFilterOptions = (e) => {
        e.preventDefault();
        const initialFilter = JSON.parse(
            props.app_info
                ? sessionStorage.getItem('notification_filter')
                : sessionStorage.getItem('platform_notification_filter')
        );
        if (initialFilter !== null) {
            setFilterOptions({
                ...initialFilter
            });
        } else {
            setFilterOptions({
                status: '',
                startDate: '',
                endDate: ''
            });
        }
        setShowFilters(false);
    };

    const handleApplyFilters = (e) => {
        e.preventDefault();
        let chipStatus, chipDateRange;

        if (filterOptions.status.length > 0) {
            chipStatus = filterOptions.status;
        }

        if (filterOptions.startDate.length > 0 && filterOptions.endDate.length > 0) {
            chipDateRange = `${new Date(filterOptions.startDate).toLocaleDateString(
                'en-GB'
            )} to ${new Date(filterOptions.endDate).toLocaleDateString('en-GB')} `;
        }
        setFiltersChip({
            status: chipStatus,
            type: filterOptions?.type,
            dateRange: chipDateRange
        });
        setShowFilters(false);
        props.applyFilter();
    };

    const handleClearFilters = () => {
        if (props.app_info) {
            sessionStorage.setItem(
                'notification_filter',
                JSON.stringify({ status: '', startDate: '', endDate: '' })
            );
        } else {
            sessionStorage.setItem(
                'platform_notification_filter',
                JSON.stringify({ status: '', startDate: '', endDate: '' })
            );
        }
        setFilterOptions({
            status: '',
            startDate: '',
            endDate: ''
        });
        setFiltersChip({
            status: '',
            type: '',
            dateRange: ''
        });
        setShowFilters(false);
        props.clearFilter();
    };

    return (
        <AppBar position="static" className={classes.appBar}>
            <Toolbar>
                {!showFilters && (
                    <>
                        <Button
                            variant="outlined"
                            className={clsx(classes.filterButton, classes.title)}
                            startIcon={<ScreenFilterIcon />}
                            onClick={onOpenFilterHandler}
                            aria-label="Filters"
                        >
                            Filters
                        </Button>
                        <div style={{ flexGrow: 1, display: 'flex' }}>
                            {Object.keys(filtersChip).map((filter, index) => {
                                return (
                                    filtersChip[filter] && (
                                        <Chip
                                            key={index}
                                            label={filtersChip[filter]}
                                            classes={{ root: classes.chip }}
                                        />
                                    )
                                );
                            })}
                        </div>
                    </>
                )}
                {showFilters && (
                    <div
                        style={{ margin: '1rem 0rem 1rem 0rem', width: '100%', padding: '1.5rem' }}
                        className={classes.filterSection}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <ThemeProvider theme={selectCompTheme}>
                                    <FormControl fullWidth>
                                        <TextField
                                            // label={'Status'}
                                            inputProps={{ 'data-testid': 'status' }}
                                            value={filterOptions.status}
                                            name="status"
                                            onChange={handleStatusChange}
                                            variant="outlined"
                                            select
                                            fullWidth
                                            size="small"
                                            id="status"
                                        >
                                            <MenuItem value={'Read'}>Read</MenuItem>
                                            <MenuItem value={'Unread'}>Unread</MenuItem>
                                        </TextField>
                                    </FormControl>
                                </ThemeProvider>
                            </Grid>
                            <Grid item xs={2}>
                                <ThemeProvider theme={selectCompTheme}>
                                    <FormControl fullWidth>
                                        <TextField
                                            // label={'Status'}
                                            inputProps={{ 'data-testid': 'type' }}
                                            value={filterOptions.type}
                                            name="type"
                                            onChange={handleStatusChange}
                                            variant="outlined"
                                            select
                                            fullWidth
                                            size="small"
                                            id="status"
                                        >
                                            <MenuItem value={'All'}>All</MenuItem>
                                            <MenuItem value={'Mentions'}>@Mentions</MenuItem>
                                            <MenuItem value={'Alerts'}>Alerts</MenuItem>
                                            <MenuItem value={'Comments'}>Comments</MenuItem>
                                            <MenuItem value={'Others'}>Others</MenuItem>
                                        </TextField>
                                    </FormControl>
                                </ThemeProvider>
                            </Grid>
                            <Grid item xs={8}>
                                <DateRangeSelect
                                    onChangeFilter={handleDateChangeSelect}
                                    value={{
                                        start_date: filterOptions.startDate,
                                        end_date: filterOptions.endDate
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            variant="contained"
                            disabled={
                                filterOptions.status === '' &&
                                filterOptions.startDate === '' &&
                                filterOptions.endDate === ''
                            }
                            onClick={handleApplyFilters}
                            aria-label="Apply"
                        >
                            Apply
                        </Button>
                        <Button
                            variant="outlined"
                            disabled={
                                filterOptions.status === '' &&
                                filterOptions.startDate === '' &&
                                filterOptions.endDate === ''
                            }
                            onClick={handleClearFilters}
                            aria-label="Clear Filter"
                        >
                            Clear Filter
                        </Button>

                        <Button variant="outlined" onClick={hideFilterOptions} aria-label="Cancel">
                            Cancel
                        </Button>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    );
}
function NotificationWorkspace(props) {
    const classes = workspaceStyles();
    const { width } = props;
    const [selectedScreen, setSelectedScreen] = useState(false);
    const [selectedSubChild, setselectedSubChild] = useState(false);
    const subscription_open = props?.history?.location?.state === 'subscription_open';
    const [openSubscription, setOpenSubscription] = useState(subscription_open);
    const screens = props?.app_info?.screens;
    const rowsPerPage = numOfRows[width] || 9;
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState(false);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        status: 'Read',
        type: 'All',
        startDate: '',
        endDate: ''
    });
    const [searchText, setSearchText] = useState('');
    const [key, setKey] = useState(0);
    const curNotificationsData = {
        notifications: props.app_info
            ? props.notificationData?.notifications
            : props.notificationData?.platformNotifications,
        count: props.app_info
            ? props.notificationData?.count
            : props.notificationData?.platformCount
    };
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [selectedPages, setSelectedPages] = useState([]);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedMenuItem, setSelectedMenuItem] = useState([]);
    const [screen_data, setScreenData] = useState([]);
    const [initalScreenData, setInitialScreenData] = useState([]);
    const [app_setting, setAppSetting] = useState(props.app_info.subscription_type || '@mentions');
    const [savedChanges, setSavedChanges] = useState([]);
    const [dialogOpen, setOpen] = React.useState(false);
    const [closeBtnClicked, setCloseBtnClicked] = useState(false);
    const [appLevelSetting, setAppLevelSetting] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    // const [loading] =useState(props.loadingOnSubscription)

    useEffect(() => {
        if (props.location?.notification?.id) {
            const notificationId = props.location?.notification?.id;
            const notificationItem = curNotificationsData?.notifications.find(
                (item) => item.id === notificationId && item.is_read === false
            );
            if (notificationItem) {
                const updatedNotification = {
                    is_read: true
                };

                updateNotificationRead({
                    notificationId: props.location?.notification?.id,
                    payload: updatedNotification,
                    callback: onResponseUpdateNotification
                });
            }
        }
        if (props.app_info) {
            sessionStorage.setItem('notification_filter', JSON.stringify(filterOptions));
        } else {
            sessionStorage.setItem('platform_notification_filter', JSON.stringify(filterOptions));
        }
        setScreenData(createScreenData());
        setInitialScreenData(structuredClone(createScreenData()));
    }, []);

    useEffect(() => {
        setPage(0);
    }, [searchText]);

    const onResponseUpdateNotification = () => {
        const notificationId = props.location?.notification?.id;
        const notificationItem = curNotificationsData?.notifications?.map((item) => {
            return item.id === notificationId ? { ...item, is_read: true } : item;
        });
        const updatedNotificationData = {};
        if (props.app_info) {
            updatedNotificationData['count'] = curNotificationsData?.count - 1;
            updatedNotificationData['notifications'] = [...notificationItem];
        } else {
            updatedNotificationData['count'] = curNotificationsData?.count - 1;
            updatedNotificationData['notifications'] = [...notificationItem];
            updatedNotificationData['type'] = 'platform_notification';
        }
        props.setNotifications(updatedNotificationData);
    };

    /* page change handler */
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    /* table pagination text */
    const paginationLabelDisplay = ({ from, to, count }) => {
        return `${from}-${to} of ${count !== -1 ? count : ''} notifications`;
    };

    const applyFilterHandler = () => {
        setSearchText('');
        setKey(key + 1);
        const payload = {
            app_id: props.app_info?.id,
            selected_filter: {
                ...(filterOptions.status.length > 0 && {
                    is_read: filterOptions.status === 'Read' ? true : false
                }),
                ...(filterOptions.startDate.length > 0 && {
                    start_date: new Date(filterOptions.startDate).toLocaleDateString('fr-CA')
                }),
                ...(filterOptions.endDate.length > 0 && {
                    end_date: new Date(filterOptions.endDate).toLocaleDateString('fr-CA')
                }),
                ...(filterOptions.type &&
                    filterOptions.type !== 'All' && {
                        type: filterOptions.type // Add the type filter if it's not 'All'
                    })
            }
        };
        getFilteredNotifications({
            payload: payload,
            callback: onResponseGetFilteredNotifications
        });
    };

    const clearFilterHandler = () => {
        if (filter) {
            setFilter(false);
        }
        setSearchText('');
        setKey(key + 1);
    };

    const onResponseGetFilteredNotifications = (data) => {
        if (props.app_info) {
            sessionStorage.setItem('notification_filter', JSON.stringify(filterOptions));
        } else {
            sessionStorage.setItem('platform_notification_filter', JSON.stringify(filterOptions));
        }
        if (!filter) setFilter(true);
        setFilteredNotifications(data);
        setPage(0);
    };

    const markAsReadHandler = () => {
        markAllNotificationRead({
            payload: { notifications: selectedNotifications },
            callback: onResponseMarkNotificationsRead
        });
    };

    const onResponseMarkNotificationsRead = () => {
        let count = 0;
        const tempNotifications = structuredClone(curNotificationsData);
        const notificationItem = tempNotifications?.notifications?.map((item) => {
            if (selectedNotifications?.includes(item.id)) {
                if (!item?.is_read) {
                    item.is_read = true;
                    count += 1;
                }
            }
            return item;
        });
        const updatedNotificationData = {};
        if (props.app_info) {
            updatedNotificationData['count'] = tempNotifications?.count - count;
            updatedNotificationData['notifications'] = [...notificationItem];
        } else {
            updatedNotificationData['count'] = tempNotifications?.count - count;
            updatedNotificationData['notifications'] = [...notificationItem];
            updatedNotificationData['type'] = 'platform_notification';
        }
        props.setNotifications(updatedNotificationData);
        setSelectedNotifications(() => []);
        setSelectedPages(() => []);
        if (filter === true) {
            applyFilterHandler();
        }
    };

    const modifiedNotificationslist = (notificationsList) => {
        return notificationsList?.filter((row) => {
            return (
                row?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
                row?.message?.toLowerCase().includes(searchText.toLowerCase())
            );
            // ||
            // row?.widget_name?.toLowerCase().includes(v.toLowerCase()) ||
            // row?.shared_by?.split('@')[0].split('.').join(' ').includes(v.toLowerCase())  ;
        });
    };
    const handleSelectNotification = (id) => {
        setSelectedNotifications((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((notificationId) => notificationId !== id)
                : [...prevSelected, id]
        );
    };
    const isSelected = (id) => selectedNotifications.includes(id);

    const handlePageSelect = (e, page) => {
        let selectedN = selectedNotifications;
        let selectedP = selectedPages;
        try {
            const isChecked = e.target.checked;

            setSelectedPages((prevSelected) =>
                isChecked
                    ? [...prevSelected, page]
                    : prevSelected.filter((selectedPage) => selectedPage !== page)
            );

            const currentPageNotifications = modifiedNotificationslist(
                filter ? filteredNotifications : curNotificationsData.notifications
            )?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

            setSelectedNotifications((prevSelected) => {
                if (isChecked) {
                    // Add notifications from the current page
                    const newSelected = new Set(prevSelected);
                    currentPageNotifications.forEach((notification) => {
                        newSelected.add(notification.id);
                    });

                    return Array.from(newSelected);
                } else {
                    // Remove notifications from the current page
                    return prevSelected.filter(
                        (notificationId) =>
                            !currentPageNotifications.some(
                                (notification) => notification.id === notificationId
                            )
                    );
                }
            });
            if (isChecked) {
                setSelectedMenuItem('selectPage');
            } else {
                setSelectedMenuItem(null);
            }
        } catch (error) {
            setSelectedNotifications(selectedN);
            setSelectedPages(selectedP);
            console.error('Error selecting page: ', error);
        }
    };

    const deleteHandler = () => {
        deleteNotifications({
            payload: { notifications: selectedNotifications },
            callback: onResponseDeleteNotifications
        });
    };

    const onResponseDeleteNotifications = () => {
        let count = 0;
        const tempNotifications = structuredClone(curNotificationsData);
        const notificationItem = tempNotifications?.notifications?.map((item) => {
            if (selectedNotifications?.includes(item?.id)) {
                if (!item?.is_read) {
                    count += 1;
                }
                return;
            }
            return item;
        });
        const updatedNotificationData = {};
        if (props.app_info) {
            updatedNotificationData['count'] = tempNotifications?.count - count;
            updatedNotificationData['notifications'] = [...notificationItem];
        } else {
            updatedNotificationData['count'] = tempNotifications?.count - count;
            updatedNotificationData['notifications'] = [...notificationItem];
            updatedNotificationData['type'] = 'platform_notification';
        }
        setSelectedNotifications(() => []);
        setSelectedPages(() => []);
        props.setNotifications(updatedNotificationData);

        if (filter === true) {
            applyFilterHandler();
        }
    };
    const handleMenuOpen = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };
    const handleDeselectAllNotifications = () => {
        setSelectedNotifications([]);
        handleMenuClose();
    };
    const handleSelectNotificationsOnPage = () => {
        const currentPageNotifications = modifiedNotificationslist(
            filter ? filteredNotifications : curNotificationsData.notifications
        )?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        setSelectedNotifications(() => {
            const newSelected = new Set(currentPageNotifications.map((n) => n.id));
            return Array.from(newSelected);
        });

        handleMenuClose();
    };
    const handleMenuItemClick = (action) => {
        switch (action) {
            case 'selectPage':
                handleSelectNotificationsOnPage();
                break;
            case 'selectAll':
                handleSelectAllNotifications();
                break;
            case 'deselectAll':
                handleDeselectAllNotifications();
                break;
            default:
                break;
        }
        setSelectedMenuItem(action);
        handleMenuClose();
    };

    // Function to handle selecting all notifications
    const handleSelectAllNotifications = () => {
        const allNotifications = modifiedNotificationslist(
            filter ? filteredNotifications : curNotificationsData.notifications
        );

        setSelectedNotifications(allNotifications.map((notification) => notification.id));
        handleMenuClose();
    };
    const isCurrentPageSelected = () => {
        const currentPageNotifications = modifiedNotificationslist(
            filter ? filteredNotifications : curNotificationsData.notifications
        )?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        return currentPageNotifications.every((notification) =>
            selectedNotifications.includes(notification.id)
        );
    };

    const createScreenData = () => {
        const result = [];
        let subChilds = [];
        screens.forEach((el, index) => {
            const formattedEl = {
                id: el.id,
                level: el.level,
                screen_name: el.screen_name,
                comment_enabled: el.comment_enabled,
                subscription_settings:
                    app_setting === 'custom'
                        ? el?.subscription_setting || '@mentions'
                        : app_setting,
                widget_comment_enabled: el.widget_comment_enabled,
                hidden: el.hidden
            };
            if (el.level === null) {
                subChilds = [];
                result.push(formattedEl);
            }
            if (el.level === 1) {
                subChilds = [];
                const nearestParent = result
                    .filter((elm, i) => i < index && elm.level == null)
                    .at(-1);
                nearestParent.childs = Array.from(
                    new Set([...(nearestParent.childs || []), formattedEl])
                );
                if (el.comment_enabled || el.widget_comment_enabled)
                    nearestParent.comment_enabled = true;
            }
            if (el.level === 2) {
                const rootParent = result.filter((elm, i) => i < index && elm.level == null).at(-1);
                const nearestParent = rootParent?.childs?.at(-1);
                if (rootParent?.childs && nearestParent.level !== 2) {
                    subChilds.push(formattedEl);
                    if (nearestParent) nearestParent.subchilds = [...subChilds];
                    if (el.comment_enabled || el.widget_comment_enabled)
                        nearestParent.comment_enabled = true;
                } else {
                    subChilds.push(formattedEl);
                    rootParent.childs = [...subChilds];
                    if (el.comment_enabled || el.widget_comment_enabled)
                        rootParent.comment_enabled = true;
                }
            }
        });
        return result;
    };
    const handleAppLevelSettings = (value) => {
        setAppSetting(value);
        if (value !== 'custom') {
            setAppLevelSetting({ app_id: props?.app_info?.id, subscription_setting: value });
            screen_data.forEach((item) => {
                item.subscription_settings = value;
                item.childs?.forEach((child) => {
                    child.subscription_settings = value;
                    child.subchilds?.forEach(
                        (subChild) => (subChild.subscription_settings = value)
                    );
                });
            });
        }
        if (value === 'custom') setAppLevelSetting(null);
        setScreenData([...screen_data]);
    };
    const handleResetValues = () => {
        setScreenData(structuredClone(initalScreenData));
        setSavedChanges([]);
        setAppSetting(props?.app_info?.subscription_type);
        setAppLevelSetting(null);
    };

    const saveScreenSettings = () => {
        if (appLevelSetting) {
            addSubscription({
                appLevelSetting: [appLevelSetting],
                callback: onRespSaveSubscription
            });
        } else {
            addSubscription({ savedChanges, callback: onRespSaveSubscription });
        }
    };

    const onRespSaveSubscription = (message = '', severity = '') => {
        setSnackbar({ open: true, message: message, severity: severity });
        setSavedChanges([]);
        props.history.location.state = 'subscription_open';
        setTimeout(() => {
            if (severity === 'success') {
                props.handleLoading();
                props.refreshAppSilent();
            }
        }, 1000);
    };

    const handleMainScreenClick = (id) => {
        setSelectedScreen(selectedScreen === id ? false : id);
    };
    const handleSubScreenClick = (id) => {
        setselectedSubChild(selectedSubChild === id ? false : id);
    };
    const createSavedScreenList = (screen, mainScreen, subScreen) => {
        const savedList = [];
        const addScreenDetails = (screen) => {
            savedList.push({
                app_id: props?.app_info?.id,
                screen_id: screen.id,
                subscription_setting: screen.subscription_settings
            });
        };
        if (screen.level === null) {
            addScreenDetails(screen);
            screen.childs?.forEach((subScreen) => {
                addScreenDetails(subScreen);
                subScreen?.subchilds?.forEach((tab) => addScreenDetails(tab));
            });
        } else if (screen.level === 1) {
            addScreenDetails(mainScreen);
            addScreenDetails(screen);
            screen.subchilds?.forEach((tab) => {
                addScreenDetails(tab);
            });
        } else {
            addScreenDetails(mainScreen);
            addScreenDetails(subScreen);
            addScreenDetails(screen);
        }
        setSavedChanges((prevItems) => {
            const updatedItems = [...prevItems];
            savedList.forEach((newItem) => {
                const exist = updatedItems.find(
                    (listItem) => listItem.screen_id === newItem.screen_id
                );
                if (exist) {
                    exist['subscription_setting'] = newItem.subscription_setting;
                } else {
                    updatedItems.push(newItem);
                }
            });
            return updatedItems;
        });
    };
    const handleToggleChange = (screen, setting, mainScreen, subscreen) => {
        if (screen.level === null) {
            screen?.childs?.forEach((child) => {
                child.subscription_settings = setting;
                child?.subchilds?.forEach((el) => (el.subscription_settings = setting));
            });
        } else if (screen.level === 1) {
            const allChildScreensHaveSameSetting = mainScreen?.childs
                ?.filter((el) => el.id !== screen.id)
                .every((arr) => arr.subscription_settings === setting);

            if (allChildScreensHaveSameSetting) {
                mainScreen.subscription_settings = setting;
                subscreen.subscription_settings = setting;
            } else {
                mainScreen.subscription_settings = 'custom';
                subscreen.subscription_settings = 'custom';
            }
            screen?.subchilds?.forEach((el) => (el.subscription_settings = setting));
        } else {
            const allChildScreensHaveSameSetting = subscreen?.subchilds
                ?.filter((el) => el.id !== screen.id)
                .every((arr) => arr.subscription_settings === setting);
            const allSubScreensHaveSameSetting = mainScreen.childs
                .filter((el) => el.id !== subscreen.id)
                .every((arr) => arr.subscription_settings === setting);
            if (allChildScreensHaveSameSetting) {
                subscreen.subscription_settings = setting;
            } else {
                subscreen.subscription_settings =
                    allChildScreensHaveSameSetting !== undefined ? 'custom' : setting;
            }
            mainScreen.subscription_settings =
                allSubScreensHaveSameSetting && subscreen.subscription_settings !== 'custom'
                    ? setting
                    : 'custom';
        }
        screen.subscription_settings = setting;
        createSavedScreenList(screen, mainScreen, subscreen);
        setScreenData([...screen_data]);
    };

    const renderDropDown = () => {
        return (
            <ThemeProvider theme={selectCompTheme}>
                <FormControl className={classes.formControl}>
                    <Select
                        value={app_setting}
                        fullWidth
                        onChange={(e) => handleAppLevelSettings(e.target.value)}
                    >
                        <MenuItem value={'off'}>Off</MenuItem>
                        <MenuItem value={'all comments'}>Notify for all comments</MenuItem>
                        <MenuItem value={'@mentions'}>Notify for @mentions</MenuItem>
                        <MenuItem value={'custom'}>Custom</MenuItem>
                    </Select>
                </FormControl>
            </ThemeProvider>
        );
    };
    const renderToggle = (screen, setting, mainScreen, subscreen) => {
        return (
            <div className={classes.themeButton}>
                <Switch
                    focusVisibleClassName={classes.focusVisible}
                    disableRipple
                    disabled={
                        app_setting !== 'custom' ||
                        (!screen.comment_enabled && !screen.widget_comment_enabled)
                    }
                    checked={screen?.['subscription_settings'] === setting}
                    onChange={() => handleToggleChange(screen, setting, mainScreen, subscreen)}
                    classes={{
                        root: classes.root,
                        switchBase: classes.switchBase,
                        thumb: classes.thumb,
                        track: classes.track,
                        checked: classes.checked
                    }}
                />
            </div>
        );
    };

    let dialogContent = (
        <span className={classes.content}>
            <span>Your changes have not been saved. Click save to update all the Changes</span>
            <br></br>
            <br></br>
            <span>Do you want to proceed anyways ?</span>
        </span>
    );

    let dialogTitle = <span className={classes.conformBoxDialogTitle}>ERROR</span>;
    const alertDialogActions = (
        <Fragment>
            <Button
                variant="outlined"
                onClick={() => setOpen(false)}
                className={classes.cancel}
                aria-label="Cancel"
            >
                Cancel
            </Button>
            <Button
                aria-label="Create Alert"
                variant="contained"
                className={classes.proceed}
                onClick={() => {
                    confirmHandler();
                }}
            >
                yes
            </Button>
        </Fragment>
    );

    const NavigateBack = () => {
        if (openSubscription) {
            if (savedChanges.length) {
                setOpen(true);
            } else {
                props.history?.goBack();
            }
        } else {
            props.history?.goBack();
        }
    };
    const confirmHandler = () => {
        setOpen(false);
        setOpenSubscription(false);
        handleResetValues();
        if (closeBtnClicked) {
            setCloseBtnClicked(false);
            setOpenSubscription(false);
        } else {
            props.history?.goBack();
        }
    };

    const closeSubscription = () => {
        if (savedChanges.length) {
            setOpen(true);
            setCloseBtnClicked(true);
        } else {
            props.history.location.state = null;
            setOpenSubscription(false);
        }
    };

    return (
        <Fragment>
            <div>
                <Typography className={classes.tableHeader} variant="h3">
                    {props.app_info ? (
                        <IconButton
                            aria-label="ArrowBackIos"
                            className={classes.backBtn}
                            onClick={() => {
                                NavigateBack();
                            }}
                        >
                            <ArrowBackIos className={classes.backIcon} />
                        </IconButton>
                    ) : null}
                    All Notifications
                </Typography>
            </div>
            <div
                className={`${classes.notificationsBar} ${
                    openSubscription ? classes.SubnotificationsBar : ''
                }`}
            >
                {!openSubscription ? (
                    <div>
                        <NotificationFilters
                            applyFilter={applyFilterHandler}
                            clearFilter={clearFilterHandler}
                            filterOptions={filterOptions}
                            setFilterOptions={setFilterOptions}
                            app_info={props.app_info}
                        />
                    </div>
                ) : null}
                {openSubscription ? (
                    <div className={classes.tabs}>
                        <div>Notification settings at screen level</div>
                    </div>
                ) : null}
                {!openSubscription ? (
                    <Button onClick={() => setOpenSubscription(true)}>
                        <SettingsOutlinedIcon className={classes.settingIcon} />
                        Settings
                    </Button>
                ) : (
                    <Button className={classes.closeIcon} onClick={() => closeSubscription()}>
                        <CloseIcon /> Close{' '}
                    </Button>
                )}
            </div>

            <div className={classes.actionsBar}>
                {/* <Filters
                filterOptions={filterOptions}
                setFilterOptions={setFilterOptions}
                applyFilterHandler={applyFilterHandler}
                /> */}

                {!openSubscription ? (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Button
                            className={classes.deleteButton}
                            onClick={deleteHandler}
                            title="delete"
                            variant="text"
                            endIcon={<DeleteIcon />}
                            disabled={!selectedNotifications.length}
                        >
                            {selectedNotifications.length
                                ? `${selectedNotifications.length}  Row${
                                      selectedNotifications.length > 1 ? 's' : ''
                                  } selected`
                                : ''}
                        </Button>

                        <div className={classes.standingPip} />
                        <Button
                            variant="text"
                            className={classes.markButton}
                            disabled={!selectedNotifications.length}
                            onClick={markAsReadHandler}
                        >
                            Mark as read
                        </Button>
                    </div>
                ) : null}
            </div>

            {!openSubscription ? (
                <div style={{ padding: '0rem 2.4000000000000004rem' }}>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="custom pagination table">
                            <TableHead>
                                <StyledTableRow className={classes.tableFilterRow}>
                                    <StyledTableCell colSpan={12}></StyledTableCell>
                                </StyledTableRow>

                                <StyledTableRow>
                                    <StyledTableCell
                                        align="left"
                                        className={classes.headerCell}
                                    ></StyledTableCell>
                                    <StyledTableCell
                                        align="left"
                                        className={classes.headerCellRestricted}
                                    >
                                        {' '}
                                        <Checkbox
                                            checked={isCurrentPageSelected()}
                                            onChange={(e) => handlePageSelect(e, page)}
                                            disabled={
                                                !modifiedNotificationslist(
                                                    filter
                                                        ? filteredNotifications
                                                        : curNotificationsData?.notifications
                                                )?.slice(
                                                    page * rowsPerPage,
                                                    page * rowsPerPage + rowsPerPage
                                                )?.length
                                            }
                                            className={classes.checkbox}
                                            inputProps={{ 'aria-label': 'select notification' }}
                                        />
                                        <IconButton
                                            aria-label="more options"
                                            onClick={handleMenuOpen}
                                            aria-haspopup="true"
                                            className={classes.dropdownMenu}
                                            aria-controls="more-menu"
                                            aria-expanded={menuAnchorEl ? 'true' : undefined}
                                        >
                                            <KeyboardArrowDown
                                                fontSize="large"
                                                className={classes.menudrop}
                                            />
                                        </IconButton>
                                        <Menu
                                            id="more-menu"
                                            anchorEl={menuAnchorEl}
                                            open={menuAnchorEl}
                                            className={classes.menu}
                                            onClose={handleMenuClose}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right'
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left'
                                            }}
                                            PaperProps={{
                                                style: {
                                                    marginTop: '24px',
                                                    marginLeft: '0px'
                                                }
                                            }}
                                        >
                                            <MenuItem
                                                onClick={() => handleMenuItemClick('selectPage')}
                                                className={
                                                    selectedMenuItem === 'selectPage'
                                                        ? classes.menuItemSelected
                                                        : classes.menuItem
                                                }
                                            >
                                                Select notifications on this page
                                            </MenuItem>
                                            <MenuItem
                                                className={
                                                    selectedMenuItem === 'selectAll'
                                                        ? classes.menuItemSelected
                                                        : classes.menuItem
                                                }
                                                onClick={() => handleMenuItemClick('selectAll')}
                                            >
                                                Select all notifications
                                            </MenuItem>
                                            <MenuItem
                                                className={classes.menuItem}
                                                onClick={() => handleMenuItemClick('deselectAll')}
                                            >
                                                Deselect all notifications
                                            </MenuItem>
                                        </Menu>
                                    </StyledTableCell>
                                    <StyledTableCell align="left" className={classes.headerCell}>
                                        Title
                                    </StyledTableCell>
                                    <StyledTableCell align="left" className={classes.headerCell}>
                                        Visual Component/Screen
                                    </StyledTableCell>
                                    <StyledTableCell align="left" className={classes.headerCell}>
                                        Shared By
                                    </StyledTableCell>
                                    <StyledTableCell align="left" className={classes.headerCell}>
                                        TimeStamp
                                    </StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {modifiedNotificationslist(
                                    filter
                                        ? filteredNotifications
                                        : curNotificationsData.notifications
                                )?.length === 0 && (
                                    <StyledTableRow>
                                        <StyledTableCell align="center" colSpan={12}>
                                            <Typography
                                                variant="h4"
                                                style={{ letterSpacing: '0.1rem' }}
                                            >
                                                No Notifications Found
                                            </Typography>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )}
                                {(rowsPerPage > 0
                                    ? modifiedNotificationslist(
                                          filter
                                              ? filteredNotifications
                                              : curNotificationsData.notifications
                                      )?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : filter
                                    ? filteredNotifications
                                    : curNotificationsData?.notifications
                                )?.map((row) => {
                                    const shared_by = row?.shared_by
                                        ?.split('@')[0]
                                        .split('.')
                                        .join(' ');
                                    const fontWeight = row?.is_read ? '400' : '500';
                                    return (
                                        <StyledTableRow
                                            key={row?.id}
                                            className={!row?.is_read ? classes.unReadRow : ''}
                                        >
                                            <StyledTableCell align="center" style={{ fontWeight }}>
                                                {row?.is_read ? null : <RedCircleIcon />}
                                            </StyledTableCell>
                                            <StyledTableCell align="left" style={{ fontWeight }}>
                                                <Checkbox
                                                    checked={isSelected(row?.id)}
                                                    onChange={() =>
                                                        handleSelectNotification(row?.id)
                                                    }
                                                    inputProps={{
                                                        'aria-label': 'select notification'
                                                    }}
                                                    className={classes.checkbox}
                                                />
                                            </StyledTableCell>
                                            <StyledTableCell
                                                style={{ cursor: 'pointer' }}
                                                component="th"
                                                scope="row"
                                                onClick={() => {
                                                    if (row?.link)
                                                        window.open(`${row?.link}`, '_blank');
                                                }}
                                            >
                                                <Typography
                                                    variant="h4"
                                                    style={{
                                                        textTransform: 'capitalize',
                                                        fontWeight
                                                    }}
                                                >
                                                    {row?.title?.replace(/_/g, ' ')}
                                                </Typography>
                                                <Typography variant="h5" style={{ fontWeight }}>
                                                    {row?.message}
                                                </Typography>
                                            </StyledTableCell>
                                            <StyledTableCell
                                                align="left"
                                                className={classes.alertsType}
                                                style={{
                                                    paddingLeft: row?.widget_name ? '-' : '5rem',
                                                    fontWeight
                                                }}
                                            >
                                                {row?.widget_name ? row?.widget_name : '-'}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                align="left"
                                                className={classes.shared}
                                                style={{ fontWeight }}
                                            >
                                                {row?.shared_by ? shared_by : 'System'}
                                            </StyledTableCell>
                                            <StyledTableCell align="left" style={{ fontWeight }}>
                                                {`${new Date(
                                                    filter
                                                        ? row?.triggered_at
                                                        : row?.triggered_at * 1000
                                                ).toLocaleDateString('default', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                                | ${new Date(
                                                    filter
                                                        ? row?.triggered_at
                                                        : row?.triggered_at * 1000
                                                ).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}`}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    );
                                })}
                            </TableBody>
                            <TableFooter className={classes.random}>
                                <TableRow>
                                    <TablePagination
                                        colSpan={12}
                                        count={
                                            modifiedNotificationslist(
                                                filter
                                                    ? filteredNotifications
                                                    : curNotificationsData.notifications
                                            )?.length
                                        }
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        ActionsComponent={TablePaginationActions}
                                        labelRowsPerPage=""
                                        labelDisplayedRows={paginationLabelDisplay}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </div>
            ) : null}
            {/* **************************** subscription list *********************** */}
            {openSubscription ? (
                <>
                    <div className={classes.subscriptionContainer}>
                        <div className={classes.containerHeader}>
                            <div>
                                {props?.app_info?.name}
                                <Tooltip
                                    classes={{ tooltip: classes.toolTipStyle }}
                                    title={
                                        <Typography className={classes.tooltipText}>
                                            Any settings selected at Main screen level will be
                                            applied to all the Sub-screens and tabs inside{' '}
                                            {props?.app_info?.name} <br />
                                            <span>
                                                Note: Thread level notification will become
                                                effective only after App/Screen level notifications
                                                have been disabled
                                            </span>
                                        </Typography>
                                    }
                                >
                                    <InfoOutlined className={classes.infoIcon} />
                                </Tooltip>
                            </div>
                            <div>{renderDropDown()}</div>
                        </div>
                        <div className={classes.tableHeaderSection}>
                            <div>Screens</div>
                            <div>Notify for all comments</div>
                            <div>Notify for @mentions</div>
                            <div>Disable All Notifications</div>
                            <div>Setting Type</div>
                        </div>
                        {!props.loadingOnSubscription ? (
                            screen_data
                                .filter((item) => !item.hidden)
                                ?.map((item) => (
                                    <Accordion
                                        key={item.id}
                                        expanded={
                                            item.id === selectedScreen && app_setting === 'custom'
                                        }
                                        className={`${classes.mainScreen}`}
                                    >
                                        <AccordionSummary className={classes.accordionSummary}>
                                            <div
                                                className={`${classes.mainScreenContainer} ${
                                                    !item.comment_enabled &&
                                                    !item.widget_comment_enabled
                                                        ? classes.commentDisbaled
                                                        : ''
                                                }`}
                                            >
                                                <Typography
                                                    onClick={() => handleMainScreenClick(item.id)}
                                                    className={`${classes.screenName} ${
                                                        item.id === selectedScreen &&
                                                        app_setting === 'custom'
                                                            ? classes.expandedScreenName
                                                            : ''
                                                    } ${!item.childs ? classes.hideIcon : ''}`}
                                                >
                                                    {<ArrowForwardIosIcon />}
                                                    {item.screen_name}
                                                </Typography>
                                                <div>
                                                    {renderToggle(item, 'all comments', item)}
                                                </div>
                                                <div>{renderToggle(item, '@mentions', item)}</div>
                                                <div>{renderToggle(item, 'off', item)}</div>
                                                <div
                                                    className={
                                                        item.subscription_settings === 'custom'
                                                            ? classes.customText
                                                            : ''
                                                    }
                                                >
                                                    {item.childs
                                                        ? item.subscription_settings === 'custom'
                                                            ? 'Custom'
                                                            : 'Uniform'
                                                        : null}
                                                </div>
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails style={{ padding: 0 }}>
                                            {item.childs ? (
                                                <div className={classes.subScreenContainer}>
                                                    {item.childs
                                                        .filter((item) => !item.hidden)
                                                        ?.map((child) => (
                                                            <Accordion
                                                                key={child.id}
                                                                expanded={
                                                                    child.id === selectedSubChild
                                                                }
                                                                className={`${classes.subScreenMain}`}
                                                            >
                                                                <AccordionSummary
                                                                    className={`${classes.accordionSummary} ${classes.childAccordionSummary}`}
                                                                >
                                                                    <div
                                                                        className={`${
                                                                            classes.mainScreenContainer
                                                                        }
                                                                        ${
                                                                            !child.comment_enabled &&
                                                                            !child.widget_comment_enabled
                                                                                ? classes.commentDisbaled
                                                                                : ''
                                                                        }`}
                                                                    >
                                                                        <Typography
                                                                            onClick={() =>
                                                                                handleSubScreenClick(
                                                                                    child.id
                                                                                )
                                                                            }
                                                                            className={`${
                                                                                classes.subScreenName
                                                                            } ${
                                                                                child.id ===
                                                                                selectedSubChild
                                                                                    ? classes.expandedScreenName
                                                                                    : ''
                                                                            } ${
                                                                                !child.subchilds
                                                                                    ? classes.hideIcon
                                                                                    : ''
                                                                            }`}
                                                                        >
                                                                            {
                                                                                <ArrowForwardIosIcon />
                                                                            }
                                                                            {child.screen_name}
                                                                        </Typography>
                                                                        <div>
                                                                            {renderToggle(
                                                                                child,
                                                                                'all comments',
                                                                                item,
                                                                                child
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                            {renderToggle(
                                                                                child,
                                                                                '@mentions',
                                                                                item,
                                                                                child
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                            {renderToggle(
                                                                                child,
                                                                                'off',
                                                                                item,
                                                                                child
                                                                            )}
                                                                        </div>
                                                                        <div
                                                                            className={
                                                                                child.subscription_settings ===
                                                                                'custom'
                                                                                    ? classes.customText
                                                                                    : ''
                                                                            }
                                                                        >
                                                                            {child.subchilds
                                                                                ? child.subscription_settings ===
                                                                                  'custom'
                                                                                    ? 'Custom'
                                                                                    : 'Uniform'
                                                                                : null}
                                                                        </div>
                                                                    </div>
                                                                </AccordionSummary>
                                                                <AccordionDetails
                                                                    style={{
                                                                        padding: 0,
                                                                        display: 'block'
                                                                    }}
                                                                >
                                                                    {child.subchilds
                                                                        ? child.subchilds
                                                                              .filter(
                                                                                  (item) =>
                                                                                      !item.hidden
                                                                              )
                                                                              ?.map((subchild) => (
                                                                                  <div
                                                                                      key={
                                                                                          subchild.id
                                                                                      }
                                                                                      className={`${
                                                                                          classes.mainScreenContainer
                                                                                      } ${
                                                                                          classes.tabContainer
                                                                                      } ${
                                                                                          !subchild.comment_enabled &&
                                                                                          !subchild.widget_comment_enabled
                                                                                              ? classes.commentDisbaled
                                                                                              : ''
                                                                                      }`}
                                                                                  >
                                                                                      <Typography
                                                                                          key={
                                                                                              subchild.id
                                                                                          }
                                                                                          className={
                                                                                              classes.tabName
                                                                                          }
                                                                                      >
                                                                                          {
                                                                                              subchild.screen_name
                                                                                          }
                                                                                      </Typography>
                                                                                      <div>
                                                                                          {renderToggle(
                                                                                              subchild,
                                                                                              'all comments',
                                                                                              item,
                                                                                              child
                                                                                          )}
                                                                                      </div>
                                                                                      <div>
                                                                                          {renderToggle(
                                                                                              subchild,
                                                                                              '@mentions',
                                                                                              item,
                                                                                              child
                                                                                          )}
                                                                                      </div>
                                                                                      <div>
                                                                                          {renderToggle(
                                                                                              subchild,
                                                                                              'off',
                                                                                              item,
                                                                                              child
                                                                                          )}
                                                                                      </div>
                                                                                  </div>
                                                                              ))
                                                                        : null}
                                                                </AccordionDetails>
                                                            </Accordion>
                                                        ))}
                                                </div>
                                            ) : null}
                                        </AccordionDetails>
                                    </Accordion>
                                ))
                        ) : (
                            <div className={classes.LoadingContainer}>
                                <CodxCircularLoader center size={80} />
                            </div>
                        )}
                    </div>
                    <div className={classes.actionButtons}>
                        <Button onClick={handleResetValues}>Reset</Button>
                        <Button
                            onClick={saveScreenSettings}
                            variant="contained"
                            disabled={!(appLevelSetting || savedChanges.length)}
                        >
                            Save Changes
                        </Button>
                    </div>

                    <CodxPopupDialog
                        open={dialogOpen}
                        setOpen={setOpen}
                        onClose={() => setOpen(false)}
                        dialogTitle={dialogTitle}
                        dialogContent={dialogContent}
                        dialogActions={alertDialogActions}
                        maxWidth="xs"
                        dialogClasses={classes}
                    />
                    <CustomSnackbar
                        key={4}
                        open={snackbar.open}
                        message={snackbar.message}
                        autoHideDuration={2000}
                        onClose={() => {
                            setSnackbar({ open: false });
                        }}
                        severity={snackbar.severity}
                    />
                </>
            ) : null}
        </Fragment>
    );
}

NotificationWorkspace.propTypes = {
    width: PropTypes.oneOf(['lg', 'md', 'sm', 'xl', 'xs']).isRequired
};

const mapStateToProps = (state) => {
    return {
        notificationData: state.notificationData
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getNotifications: (payload) => dispatch(getNotifications(payload)),
        setNotifications: (payload) => dispatch(setNotifications(payload))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(NotificationWorkspace));
