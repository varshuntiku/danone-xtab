import {
    Avatar,
    Input,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    alpha,
    makeStyles,
    withStyles,
    Checkbox,
    FormGroup,
    FormControlLabel,
    useTheme,
    Typography
} from '@material-ui/core';
import {
    ArrowDropDown,
    ArrowDropUp,
    SearchOutlined,
    Cancel,
    Done,
    Close
} from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import { IndustrySpecs } from 'assets/data/indusrySpecs';
import FunctionSpecs from 'assets/data/functionSpecs.jsx';

const useStyles = makeStyles((theme) => ({
    ...theme.overrides.MuiCssBaseline,
    container: {
        padding: theme.spacing(4),
        boxSizing: 'border-box'
        // maxHeight: '80%',
        // minHeight: '78vh'
    },
    tableContainer: {
        borderRadius: '5px',
        // maxHeight: 'calc(100vh - 200px)',   //calc(100vh - 24rem)
        maxHeight: `calc(100vh - ${theme.layoutSpacing(260)})`,
        position: 'relative',
        border: `0.5px solid ${theme.palette.separator.tableContent}`
        // '@media (max-height: 600px)': {
        //     maxHeight: '75vh'
        // }
    },
    tableBody: {
        border: '1px solid ' + alpha(theme.palette.border.dashboard, 0.4)
    },
    pagination: {
        background: theme.palette.primary.dark,
        borderTop: '1px solid ' + alpha(theme.palette.border.dashboard, 0.4),
        borderRadius: '0 0 5px 5px',
        color: theme.palette.text.default,
        fontSize: theme.spacing(2),
        position: 'sticky',
        bottom: theme.layoutSpacing(-1),
        left: 0
    },
    paginationActions: {
        padding: theme.spacing(1),
        '& svg': {
            color: theme.palette.text.default,
            fontSize: theme.spacing(3)
        }
    },
    paginationCaptions: {
        color: theme.palette.text.default,
        fontSize: theme.spacing(2)
    },
    paginationSelectRoot: {
        background: theme.palette.primary.light,
        borderRadius: '5px',
        '& .MuiSelect-select.MuiSelect-select': {
            paddingRight: theme.spacing(4)
        }
    },
    paginationSelect: {
        padding: theme.spacing(1) + ' ' + theme.spacing(2)
    },
    paginationSelectIcon: {
        position: 'absolute',
        pointerEvents: 'none',
        color: theme.palette.text.default,
        fontSize: theme.spacing(3),
        top: '50%',
        transform: 'translateY(-50%)'
    },
    paginationMenu: {
        width: '100%'
    },
    paginationToolBar: {
        padding: theme.spacing(1)
    },
    sortUpDown: {
        position: 'absolute',
        fontSize: theme.spacing(2)
    },
    sortBlock: {
        position: 'relative',
        right: -4
    },
    sortingActive: {
        color: `${theme.palette.primary.contrastText} !important`
    },
    activeHeader: {
        color: `${theme.palette.primary.contrastText} !important`,
        fontSize: theme.spacing(3)
    },
    searchRow: {
        position: 'sticky',
        top: `calc(${theme.spacing(3.5 * 2)} + ${theme.spacing(3)} + 1px)`,
        '& th': { background: theme.palette.primary.dark },
        zIndex: 10
    },
    searchContainer: {
        padding: theme.spacing(1) + ' ' + theme.spacing(4) + ' !important',
        height: theme.spacing(3)
    },
    searchBox: {
        transition: '0.5s',
        padding: `${theme.spacing(1)} 0`,
        borderLeft: '2px solid transparent',
        color: theme.palette.text.default,
        fontSize: theme.spacing(2),
        '&:hover': {
            background: theme.palette.primary.light,
            padding: theme.spacing(1),
            borderLeft: '2px solid' + theme.palette.primary.contrastText,
            borderRadius: '0 5px 5px 0'
        },
        '&::before': {
            display: 'none'
        },
        '& svg': {
            fontSize: theme.spacing(3),
            color: theme.palette.primary.contrastText
        }
    },
    searchFocused: {
        background: theme.palette.primary.light,
        padding: theme.spacing(1),
        borderLeft: '2px solid' + theme.palette.primary.contrastText,
        borderRadius: '0 5px 5px 0',
        '&::before, &::after': {
            display: 'none'
        }
    },
    searchCancel: {
        '& svg': {
            color: theme.palette.text.default,
            fontSize: theme.spacing(2),
            cursor: 'pointer'
        }
    },
    appLink: {
        color: theme.palette.text.default
    },
    loaderContainer: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        zIndex: 11,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& img': {
            width: '200px'
        }
    },
    loaderTableBody: {
        height: '300px'
    },
    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1)
    },
    logoAvatar: {
        background: 'none',
        '& svg': {
            width: theme.spacing(3),
            stroke: theme.palette.text.revamp
        },
        '& img': {
            width: theme.spacing(3),
            height: theme.spacing(3)
        }
    },
    label: {
        '& .MuiTypography-body1': {
            fontSize: '1.6rem'
        }
    },
    checkbox: {
        '& .MuiSvgIcon-root': {
            fontSize: '2.5rem'
        }
    },
    progressContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    progressBar: {
        backgroundColor: theme.palette.primary.main,
        width: '6rem',
        borderRadius: '10px',
        height: '1rem',
        border: '1px solid ' + theme.palette.text.default,
        marginTop: theme.spacing(2.2),
        '& .MuiLinearProgress-barColorPrimary': {
            backgroundColor: 'rgba(252, 178, 35, 1)'
        }
    },
    progressBarStatus: {
        fontSize: theme.spacing(1.7),
        marginTop: theme.spacing(0.8)
    },
    caption: {
        fontSize: theme.spacing(1.7),
        color: alpha(theme.palette.text.default, 0.3)
    },
    headLabel: {
        background: theme.palette.background.tableHeader,
        // padding: theme.spacing(3.5) + ' ' + theme.spacing(3),
        fontSize: theme.layoutSpacing(16),
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.spacing(3),
        // borderBottom: `1px solid ${theme.palette.separator.grey}`,
        '& span:hover': {
            color: theme.palette.primary.contrastText
        }
    },
    actionCell: {
        minWidth: '100px',
        display: 'flex'
    }
}));

export const StyledTableCell = withStyles((theme) => ({
    root: {
        textAlign: 'left',
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(14),
        border: 'none',
        padding: theme.spacing(2) + ' ' + theme.spacing(4),
        fontFamily: theme.body.B5.fontFamily
    },
    head: {
        background: theme.palette.background.tableHeader,
        padding: theme.spacing(3.5) + ' ' + theme.spacing(3),
        fontSize: theme.layoutSpacing(16),
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.spacing(3),
        borderBottom: `1px solid ${theme.palette.separator.grey}`,
        '& span:hover': {
            color: theme.palette.primary.contrastText
        }
    }
}))(TableCell);

export const StyledTableRow = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.dark
    }
}))(TableRow);

const UtilsDataTable = (props) => {
    const classes = useStyles();
    const [state, setState] = useState({
        order: 'asc',
        orderBy: '',
        timer: null,
        searchId: props.searchId,
        searchValue: props.searchValue,
        debounceDuration: props.debounceDuration ? props.debounceDuration : 2000
    });
    // eslint-disable-next-line no-unsafe-optional-chaining
    const { page, rowsPerPage, totalCount } = props?.paginationInfo;

    useEffect(() => {
        onHandleChange();
    }, [state?.searchId, state?.searchValue]);

    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            searchValue: props.searchValue
        }));
    }, [props.searchValue]);

    const handleChangePage = (event, newPage) => {
        props?.setStateInfo((prevState) => ({
            ...prevState,
            page: newPage
        }));
    };

    const handleChangeRowsPerPage = (event) => {
        props?.setStateInfo((prevState) => ({
            ...prevState,
            rowsPerPage: +event.target.value,
            page: 0
        }));
    };

    const handleRequestSort = (event, property) => {
        const isAsc = state.orderBy === property && state.order === 'asc';
        setState((prevState) => ({
            ...prevState,
            order: isAsc ? 'desc' : 'asc',
            orderBy: property
        }));
    };

    const isNumeric = (x) => {
        let value = !isNaN(x) ? x : parseFloat(x.replace(/[\$,]/g, ''));
        return { isNum: !isNaN(value), value };
    };

    const sortColumnData = (data, orderDirection, valueToOrderBy) => {
        // Filter the nulls and empty string in an array and the rest in another
        let nullAndEmptyData = data?.filter(
            (item) => item[valueToOrderBy] == null || item[valueToOrderBy] === ''
        );
        let toSort = data?.filter((item) => item[valueToOrderBy]);

        // Sort the non-null values
        let sorted = toSort?.sort((element1, element2) => {
            // Check if both values are numeric
            let isNumericElement1 = isNumeric(element1[valueToOrderBy]);
            let isNumericElement2 = isNumeric(element2[valueToOrderBy]);

            // If numerics
            if (isNumericElement1.isNum && isNumericElement2.isNum) {
                return isNumericElement1.value - isNumericElement2.value;
            }

            // If strings
            return element1[valueToOrderBy].toLowerCase() > element2[valueToOrderBy].toLowerCase()
                ? 1
                : -1;
        });

        // The sorting direction
        if (orderDirection === 'desc') {
            sorted.reverse();
        }

        //  Add the nulls and empty string at the end of the returned array
        return sorted?.concat(nullAndEmptyData);
    };

    const onHandleChange = () => {
        clearTimeout(state.timer);

        const delayedFunction = () => {
            if (props?.setStateInfo)
                props?.setStateInfo((prevState) => ({
                    ...prevState,
                    page: 0
                }));
            props.onHandleSearch(state.searchId, state.searchValue);
        };

        setState((prevState) => ({
            ...prevState,
            timer: setTimeout(delayedFunction, state.debounceDuration)
        }));
    };

    const processedData = props.apiSortingImplemented
        ? props.tableData
        : sortColumnData(props.tableData, state.order, state.orderBy);

    const theme = useTheme();
    return (
        <div className={`${classes.container} ${props.className}`}>
            <TableContainer component={Paper} className={classes.tableContainer}>
                {props.loader && (
                    <div class={classes.loaderContainer}>
                        <CodxCircularLoader size={60} />
                    </div>
                )}
                <Table stickyHeader>
                    {props?.caption && (
                        <caption
                            style={{
                                color: alpha(theme.palette.text.default, 0.4),
                                fontSize: theme.spacing(2)
                            }}
                        >
                            {props.caption}
                        </caption>
                    )}
                    <TableHead>
                        <TableRow>
                            {props?.tableHeaderCells?.map((headCell) =>
                                headCell.enableSorting ? (
                                    <StyledTableCell
                                        key={headCell.id}
                                        sortDirection={
                                            state.orderBy === headCell.id ? state.order : false
                                        }
                                    >
                                        <TableSortLabel
                                            active={state.orderBy === headCell.id}
                                            direction={
                                                state.orderBy === headCell.id ? state.order : 'asc'
                                            }
                                            onClick={(event) =>
                                                handleRequestSort(event, headCell.id)
                                            }
                                            hideSortIcon={true}
                                            IconComponent={ArrowDropDown}
                                            classes={{
                                                active: classes.sortingActive,
                                                icon: classes.activeHeader
                                            }}
                                        >
                                            <Typography className={classes.headLabel}>
                                                {headCell.label}
                                            </Typography>
                                            {state.orderBy !== headCell.id ? (
                                                <span className={classes.sortBlock}>
                                                    <ArrowDropDown
                                                        className={classes.sortUpDown}
                                                        style={{ top: -4 }}
                                                    />
                                                    <ArrowDropUp
                                                        className={classes.sortUpDown}
                                                        style={{ bottom: -4 }}
                                                    />
                                                </span>
                                            ) : null}
                                        </TableSortLabel>
                                    </StyledTableCell>
                                ) : (
                                    <StyledTableCell key={headCell.id}>
                                        <Typography className={classes.headLabel}>
                                            {headCell.label}
                                        </Typography>
                                    </StyledTableCell>
                                )
                            )}
                        </TableRow>
                        <TableRow className={classes.searchRow}>
                            {props?.tableHeaderCells?.map((headCell, index) =>
                                headCell.enableSearching ? (
                                    <StyledTableCell
                                        key={headCell.id + 'search'}
                                        className={classes.searchContainer}
                                    >
                                        <Input
                                            classes={{
                                                root: classes.searchBox,
                                                focused: classes.searchFocused
                                            }}
                                            value={
                                                state.searchId === headCell.id
                                                    ? state.searchValue
                                                    : ''
                                            }
                                            id={headCell.id}
                                            inputProps={{ 'aria-label': `Search Param ${index}` }}
                                            onChange={(event) => {
                                                const id = event.target.id;
                                                const value = event.target.value;
                                                setState((prevState) => ({
                                                    ...prevState,
                                                    searchId: id,
                                                    searchValue: value
                                                }));
                                            }}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <SearchOutlined />
                                                </InputAdornment>
                                            }
                                            endAdornment={
                                                state.searchId === headCell.id &&
                                                state.searchValue && (
                                                    <InputAdornment
                                                        className={classes.searchCancel}
                                                        position="start"
                                                        onClick={() => {
                                                            setState((prevState) => ({
                                                                ...prevState,
                                                                searchId: null,
                                                                searchValue: null
                                                            }));
                                                        }}
                                                    >
                                                        <Cancel />
                                                    </InputAdornment>
                                                )
                                            }
                                        />
                                    </StyledTableCell>
                                ) : (
                                    <StyledTableCell
                                        key={headCell.id + 'search'}
                                        className={classes.searchContainer}
                                    ></StyledTableCell>
                                )
                            )}
                        </TableRow>
                    </TableHead>
                    {!props.loader && (
                        <TableBody className={classes.tableBody}>
                            {processedData?.map((row, index) => (
                                <StyledTableRow key={index}>
                                    {props?.tableHeaderCells?.map((tableHeaderCell) => {
                                        switch (tableHeaderCell.id) {
                                            case 'actions':
                                                return (
                                                    <StyledTableCell
                                                        className={classes.actionCell}
                                                        component="td"
                                                        scope="row"
                                                    >
                                                        {props.tableActions(row)}
                                                    </StyledTableCell>
                                                );
                                            case 'nac_collaboration':
                                                return (
                                                    <StyledTableCell component="td" scope="row">
                                                        {props.getSwitch(row, 'nac_collaboration')}
                                                    </StyledTableCell>
                                                );
                                            case 'industry_id':
                                                return (
                                                    <StyledTableCell component="td" scope="row">
                                                        {
                                                            props.getIndustryById(
                                                                row[tableHeaderCell.id]
                                                            )['industry_name']
                                                        }
                                                    </StyledTableCell>
                                                );
                                            case 'logo_name':
                                                return (
                                                    <StyledTableCell
                                                        className={classes.iconContainer}
                                                        component="td"
                                                        scope="row"
                                                    >
                                                        <Avatar
                                                            className={classes.logoAvatar}
                                                            src={
                                                                props.page === 'industries'
                                                                    ? IndustrySpecs[
                                                                          row[tableHeaderCell.id]
                                                                      ]
                                                                    : FunctionSpecs[
                                                                          row[tableHeaderCell.id]
                                                                      ]?.icon
                                                            }
                                                        >
                                                            {props.page === 'industries'
                                                                ? IndustrySpecs[
                                                                      row[tableHeaderCell.id]
                                                                  ]
                                                                : FunctionSpecs[
                                                                      row[tableHeaderCell.id]
                                                                  ]?.icon}
                                                        </Avatar>
                                                        {row[tableHeaderCell.id]}
                                                    </StyledTableCell>
                                                );
                                            case 'function_id':
                                                return (
                                                    <StyledTableCell component="td" scope="row">
                                                        {
                                                            props.getFunctionById(
                                                                row[tableHeaderCell.id]
                                                            )['function_name']
                                                        }
                                                    </StyledTableCell>
                                                );
                                            case 'environment':
                                                return (
                                                    <StyledTableCell component="td" scope="row">
                                                        {row[tableHeaderCell.id].toUpperCase()}
                                                    </StyledTableCell>
                                                );
                                            case 'name': {
                                                if (props.page === 'applications')
                                                    return (
                                                        <StyledTableCell component="td" scope="row">
                                                            <Link
                                                                className={classes.appLink}
                                                                to={'/app/' + row['id']}
                                                            >
                                                                {row[tableHeaderCell.id]}
                                                            </Link>
                                                        </StyledTableCell>
                                                    );
                                                else
                                                    return (
                                                        <StyledTableCell component="td" scope="row">
                                                            {row[tableHeaderCell.id]}
                                                        </StyledTableCell>
                                                    );
                                            }
                                            case 'is_connected_systems_app':
                                                return (
                                                    <StyledTableCell component="td" scope="row">
                                                        {props.getSwitch(
                                                            row,
                                                            'is_connected_systems_app'
                                                        )}
                                                    </StyledTableCell>
                                                );
                                            case 'is_active':
                                                return (
                                                    <StyledTableCell component="td" scope="row">
                                                        {props.getSwitch(row, 'is_active')}
                                                    </StyledTableCell>
                                                );
                                            case 'first_name':
                                                if (props.page === 'Control users')
                                                    return (
                                                        <StyledTableCell component="td" scope="row">
                                                            <FormGroup>
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            key={row.id}
                                                                            checked={props?.selectedUsers?.includes(
                                                                                row.id
                                                                            )}
                                                                            onChange={() => {
                                                                                props?.onHandleSelect(
                                                                                    row.id
                                                                                );
                                                                            }}
                                                                            color="primary"
                                                                            className={
                                                                                classes.checkbox
                                                                            }
                                                                        />
                                                                    }
                                                                    label={row[tableHeaderCell.id]}
                                                                    className={classes.label}
                                                                />
                                                            </FormGroup>
                                                        </StyledTableCell>
                                                    );
                                                else
                                                    return (
                                                        <StyledTableCell component="td" scope="row">
                                                            {row[tableHeaderCell.id]}
                                                        </StyledTableCell>
                                                    );
                                            case 'imported_by':
                                                if (row[tableHeaderCell.id] === 'System')
                                                    return (
                                                        <StyledTableCell
                                                            component="td"
                                                            scope="row"
                                                            style={{ color: '#FF8515' }}
                                                        >
                                                            {row[tableHeaderCell.id]}
                                                        </StyledTableCell>
                                                    );
                                                else
                                                    return (
                                                        <StyledTableCell component="td" scope="row">
                                                            {row[tableHeaderCell.id]}
                                                        </StyledTableCell>
                                                    );

                                            default:
                                                if (
                                                    props.page === 'userGroups' &&
                                                    tableHeaderCell.id !== 'name' &&
                                                    tableHeaderCell.id !== 'user_group_type'
                                                ) {
                                                    return (
                                                        <StyledTableCell component="td" scope="row">
                                                            {props.renderBooleanIcons(
                                                                row[tableHeaderCell.id]
                                                            )}
                                                        </StyledTableCell>
                                                    );
                                                } else if (
                                                    props.page === 'users' &&
                                                    (tableHeaderCell.id === 'user_group' ||
                                                        tableHeaderCell.id === 'nac_user_roles')
                                                ) {
                                                    return (
                                                        <StyledTableCell component="td" scope="row">
                                                            {row[tableHeaderCell.id].join(', ')}
                                                        </StyledTableCell>
                                                    );
                                                } else if (
                                                    props.page === 'roles' &&
                                                    tableHeaderCell.id !== 'roles'
                                                ) {
                                                    return (
                                                        <StyledTableCell
                                                            className={classes.tableCell}
                                                        >
                                                            {row.permissions.includes(
                                                                tableHeaderCell.id.toUpperCase()
                                                            ) ? (
                                                                <Done fontSize="large" />
                                                            ) : (
                                                                <Close fontSize="large" />
                                                            )}
                                                        </StyledTableCell>
                                                    );
                                                } else if (
                                                    props.page === 'dashboards' &&
                                                    tableHeaderCell.id === 'template'
                                                ) {
                                                    return (
                                                        <StyledTableCell
                                                            className={classes.tableCell}
                                                        >
                                                            {props.getTemplateById(
                                                                row[tableHeaderCell.id]
                                                            )}
                                                        </StyledTableCell>
                                                    );
                                                } else
                                                    return (
                                                        <StyledTableCell
                                                            style={{
                                                                maxWidth:
                                                                    tableHeaderCell.id ===
                                                                    'description'
                                                                        ? '200px'
                                                                        : ''
                                                            }}
                                                            component="td"
                                                            scope="row"
                                                        >
                                                            {row[tableHeaderCell.id]}
                                                        </StyledTableCell>
                                                    );
                                        }
                                    })}
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    )}
                    {props.loader && (
                        <TableBody className={classes.loaderTableBody}>
                            <TableRow></TableRow>
                        </TableBody>
                    )}
                </Table>
                {props?.hidePagination ? (
                    <></>
                ) : (
                    <TablePagination
                        className={classes.pagination}
                        classes={{
                            actions: classes.paginationActions,
                            caption: classes.paginationCaptions,
                            select: classes.paginationSelect,
                            selectIcon: classes.paginationSelectIcon,
                            selectRoot: classes.paginationSelectRoot,
                            menuItem: classes.paginationMenu,
                            toolbar: classes.paginationToolBar
                        }}
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalCount ? totalCount : 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                )}
            </TableContainer>
        </div>
    );
};

export default UtilsDataTable;
