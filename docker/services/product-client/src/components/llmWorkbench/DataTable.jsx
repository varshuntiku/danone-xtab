import {
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
    Typography,
    Box,
    IconButton,
    Link as MuiLink,
    useTheme
} from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { ArrowDropDown, ArrowDropUp, SearchOutlined, Cancel, Visibility } from '@material-ui/icons';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import t from 'config/textContent/llmWorkbench.json';
// import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
// import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
// import QueryBuilderOutlinedIcon from '@material-ui/icons/QueryBuilderOutlined';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as SuccessIcon } from 'assets/img/llm-workbench/success-indicator.svg';
import { ReactComponent as FailIcon } from 'assets/img/llm-workbench/fail-indicator.svg';
import { ReactComponent as InProgressIcon } from 'assets/img/llm-workbench/in-progress-indicator.svg';

const useStyles = makeStyles((theme) => ({
    ...theme.overrides.MuiCssBaseline,
    container: {
        padding: theme.spacing(3),
        boxSizing: 'border-box',
        maxHeight: '80%'
    },
    noData: {
        color: theme.palette.text.default,
        transform: 'translate(-50%, -50%)'
    },
    tableContainer: {
        borderRadius: '5px',
        maxHeight: '100%',
        position: 'relative'
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
        bottom: '-1px',
        left: 0,
        zIndex: 1
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
    cookbookLink: {
        color: theme.palette.text.default,
        textDecoration: 'underline'
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
            width: theme.spacing(3)
        },
        '& img': {
            width: theme.spacing(3),
            height: theme.spacing(3)
        },
        '& svg path': {
            fill: theme.palette.primary.contrastText + ' !important'
        },
        '& svg g': {
            fill: theme.palette.primary.contrastText + ' !important'
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
    EtcTime: {
        fontSize: theme.spacing(1.6),
        color: 'rgba(84, 201, 251, 1)',
        letterSpacing: '0.3px'
    },
    link: {
        color: theme.palette.primary.contrastText,
        textDecoration: 'none',
        fontWeight: '500'
    }
}));

export const StyledTableCell = withStyles((theme) => ({
    root: {
        textAlign: 'justify',
        color: theme.palette.text.default,
        fontSize: theme.spacing(2),
        border: 'none',
        padding: theme.spacing(2) + ' ' + theme.spacing(4),
        letterSpacing: '0.5px'
    },
    head: {
        background: theme.palette.primary.light,
        padding: theme.spacing(3.5) + ' ' + theme.spacing(4),
        lineHeight: theme.spacing(3),
        borderBottom: '1px solid ' + alpha(theme.palette.border.dashboard, 0.4),
        '& span:hover': {
            color: theme.palette.primary.contrastText
        }
    }
}))(TableCell);

export const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(even)': {
            backgroundColor: alpha(theme.palette.primary.light, 0.25)
        }
    }
}))(TableRow);

const getLink = (row, type = 'deploy') => {
    let link = `/llmworkbench/job/${type}/${encodeURIComponent(row.id)}`;
    return link;
};

const getStyle = (id) => {
    let style = {
        minWidth: '250px'
    };
    if (id === 'models_name') {
        style = { ...style, width: '200px' };
    } else if (id === 'description') {
        style = {
            width: '300px',
            maxWidth: '350px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        };
    } else if (id === 'type' || id === 'cost' || id === 'job_id' || id === 'gpu') {
        style = {
            minWidth: '150px'
        };
    } else if (
        id === 'status' ||
        id === 'training_config' ||
        id === 'created_at' ||
        id === 'base_model'
    ) {
        style = {
            minWidth: '180px'
        };
    }
    return style;
};

const DataTable = ({ type = 'deploy', showCookbook, ...props }) => {
    const theme = useTheme();
    const classes = useStyles();
    const [state, setState] = useState({
        order: 'asc',
        orderBy: '',
        timer: null,
        searchId: props.searchId,
        searchValue: props.searchValue,
        debounceDuration: props.debounceDuration ? props.debounceDuration : 2000
    });
    const [mounted, setMounted] = useState(false);

    const { page, rowsPerPage, totalCount } = props.paginationInfo;

    useEffect(() => {
        onHandleChange();
    }, [state.searchId, state.searchValue]);

    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            searchValue: props.searchValue
        }));
    }, [props.searchValue]);

    useLayoutEffect(() => {
        setMounted(true);
        return () => {
            setMounted(false);
        };
    }, []);

    const handleChangePage = (event, newPage) => {
        props.setStateInfo((prevState) => ({
            ...prevState,
            page: newPage
        }));
    };

    const handleChangeRowsPerPage = (event) => {
        props.setStateInfo((prevState) => ({
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
            props.setStateInfo((prevState) => ({
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

    return (
        <div className={`${classes.container} ${props.className}`}>
            <TableContainer component={Paper} className={classes.tableContainer}>
                {props.loader && (
                    <div class={classes.loaderContainer}>
                        <CodxCircularLoader size={60} />
                    </div>
                )}
                <Table stickyHeader>
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
                                            {headCell.label}
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
                                        {headCell.label}
                                    </StyledTableCell>
                                )
                            )}
                        </TableRow>
                        <TableRow className={classes.searchRow}>
                            {props?.tableHeaderCells?.map((headCell) =>
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
                                            inputProps={{ 'aria-label': `${headCell.id}` }}
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
                                                        style={{ minWidth: '100px' }}
                                                        component="td"
                                                        scope="row"
                                                    >
                                                        {props.tableActions(row)}
                                                    </StyledTableCell>
                                                );
                                            case 'job_id':
                                                return (
                                                    <StyledTableCell
                                                        style={getStyle(tableHeaderCell.id)}
                                                        component="td"
                                                        scope="row"
                                                    >
                                                        {row[tableHeaderCell.id] ? (
                                                            <Link
                                                                className={classes.link}
                                                                to={getLink(row, type)}
                                                            >
                                                                <IconButton title="View job">
                                                                    <Visibility fontSize="large" />
                                                                </IconButton>
                                                            </Link>
                                                        ) : (
                                                            '-'
                                                        )}
                                                    </StyledTableCell>
                                                );
                                            case 'status':
                                                return (
                                                    <StyledTableCell
                                                        style={{
                                                            ...getStyle(tableHeaderCell.id),
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            padding: '3rem 3.2rem'
                                                        }}
                                                        component="td"
                                                        scope="row"
                                                    >
                                                        {row[tableHeaderCell.id]?.toLowerCase() ===
                                                            'completed' && (
                                                            <SvgIcon
                                                                style={{
                                                                    marginRight: '0.5rem',
                                                                    fontSize: '1.8rem'
                                                                }}
                                                            >
                                                                <SuccessIcon />
                                                            </SvgIcon>
                                                        )}
                                                        {row[tableHeaderCell.id]?.toLowerCase() ===
                                                            'failed' && (
                                                            <SvgIcon
                                                                style={{
                                                                    marginRight: '0.5rem',
                                                                    fontSize: '1.8rem'
                                                                }}
                                                            >
                                                                <FailIcon />
                                                            </SvgIcon>
                                                        )}
                                                        {row[tableHeaderCell.id]?.toLowerCase() !==
                                                            'completed' &&
                                                            row[
                                                                tableHeaderCell.id
                                                            ]?.toLowerCase() !== 'failed' && (
                                                                <SvgIcon
                                                                    style={{
                                                                        marginRight: '0.5rem',
                                                                        fontSize: '1.8rem'
                                                                    }}
                                                                >
                                                                    <InProgressIcon />
                                                                </SvgIcon>
                                                            )}
                                                        {row[tableHeaderCell.id] || '-'}
                                                    </StyledTableCell>
                                                );

                                            case 'description':
                                                return (
                                                    <StyledTableCell
                                                        style={getStyle(tableHeaderCell.id)}
                                                        component="td"
                                                        scope="row"
                                                    >
                                                        <Tooltip
                                                            title={
                                                                <Typography variant="h5">
                                                                    {row[tableHeaderCell.id]}
                                                                </Typography>
                                                            }
                                                            placement="FollowCursor"
                                                        >
                                                            <span>{row[tableHeaderCell.id]}</span>
                                                        </Tooltip>
                                                    </StyledTableCell>
                                                );
                                            case 'training_config':
                                                return (
                                                    <StyledTableCell
                                                        style={getStyle(tableHeaderCell.id)}
                                                        component="td"
                                                        scope="row"
                                                    >
                                                        <u
                                                            onClick={() => {
                                                                props?.onClickconfigDetails(row);
                                                            }}
                                                            style={{
                                                                textTransform: 'underlined',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            Config details
                                                        </u>
                                                    </StyledTableCell>
                                                );
                                            case 'endpoint':
                                                return (
                                                    <StyledTableCell
                                                        style={getStyle(tableHeaderCell.id)}
                                                        component="td"
                                                        scope="row"
                                                    >
                                                        <a
                                                            href={row[tableHeaderCell.id]}
                                                            style={{
                                                                color: theme.palette.text.default,
                                                                cursor: 'pointer',
                                                                textDecoration: 'underline'
                                                            }}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            {row[tableHeaderCell.id]}
                                                        </a>
                                                    </StyledTableCell>
                                                );
                                            case 'gpu':
                                                return (
                                                    <StyledTableCell
                                                        style={getStyle(tableHeaderCell.id)}
                                                        component="td"
                                                        scope="row"
                                                    >
                                                        A100
                                                    </StyledTableCell>
                                                );
                                            default:
                                                return (
                                                    <StyledTableCell
                                                        style={getStyle(tableHeaderCell.id)}
                                                        component="td"
                                                        scope="row"
                                                    >
                                                        {row[tableHeaderCell.id] || '-'}
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
                    {mounted && !props.loader && processedData && !processedData?.length && (
                        <TableBody className={classes.loaderTableBody}>
                            <Box
                                position="absolute"
                                left="50%"
                                top="50%"
                                className={classes.noData}
                            >
                                <Typography variant="h4">No Data</Typography>
                            </Box>
                        </TableBody>
                    )}
                </Table>
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
                    component={Bottom(showCookbook)}
                    count={totalCount ? totalCount : 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </div>
    );
};

const Bottom = (showCookbook) => {
    const Pagination = ({ children, className }) => {
        const classes = useStyles();
        return (
            <Box className={className} display="flex">
                <Box flex="1" display="flex" padding="3.2rem" alignItems="center">
                    {showCookbook && (
                        <Typography variant="h4">
                            {t.datatable.cookbook}{' '}
                            <MuiLink
                                target="_blank"
                                className={classes.cookbookLink}
                                href={import.meta.env?.['REACT_APP_GENAI_COOKBOOK_URL'] || ''}
                            >
                                {t.datatable.cookbookLink}
                            </MuiLink>
                        </Typography>
                    )}
                </Box>
                {children}
            </Box>
        );
    };
    Pagination.displayName = 'CustomTablePagination';
    return Pagination;
};

export default DataTable;
