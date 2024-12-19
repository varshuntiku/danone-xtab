import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles, alpha } from '@material-ui/core/styles';
import {
    Typography,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper
} from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { deleteMinervaConsumer, getMinervaConsumers } from '../../../../services/minerva_utils';
import { getCopilotApplications } from '../../../../services/copilotServices/copilot_app';
import ManageMinervaConsumer from './ManageMinervaConsumer';
import CustomSnackbar from '../../../CustomSnackbar';
import ConfirmPopup from '../../../confirmPopup/ConfirmPopup';
import SearchBar from 'components/CustomSearchComponent/SearchComponent';
import CodxCircularLoader from 'components/CodxCircularLoader';

export const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.background.tableHeader,
        color: theme.palette.text.titleText,
        fontSize: theme.layoutSpacing(16),
        borderBottom: `1px solid ${theme.palette.separator.grey}`,
        fontFamily: theme.title.h1.fontFamily,
        height: theme.spacing(7.5),
        border: 'none',
        padding: theme.spacing(0.5, 2)
    },
    body: {
        border: 'none',
        color: theme.palette.text.titleText,
        padding: theme.spacing(0.5, 2),
        fontFamily: theme.body.B5.fontFamily,
        fontSize: theme.layoutSpacing(14)
    }
}))(TableCell);

export const StyledTableRow = withStyles(() => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: 'rgb(216,216,216 , 0.05)'
        }
    }
}))(TableRow);

const useStyles = makeStyles((theme) => ({
    main: {
        padding: '4rem'
    },
    heading: {
        color: theme.palette.primary.contrastText
    },
    paginationWrapper: {
        '& .MuiToolbar-root': {
            color: theme.palette.primary.contrastText,
            fontSize: theme.spacing(1.7)
        },
        '& .MuiTablePagination-caption': {
            color: theme.palette.primary.contrastText,
            fontSize: theme.spacing(1.7)
        },
        '& .MuiTablePagination-selectIcon': {
            color: theme.palette.primary.contrastText,
            fontSize: theme.spacing(1.7)
        }
    },
    cursorPointer: {
        '&:hover': {
            cursor: 'pointer'
        }
    },
    iconBtn: {
        '& svg': {
            color: theme.palette.error.main
        }
    },
    backIcon: {
        marginRight: '1rem',
        fill: theme.palette.text.revamp
    },
    fontSize1: {
        fontSize: '2rem',
        marginBottom: '1%'
    },
    fontSize2: {
        fontSize: '2rem'
    },
    fontColor: {
        color: theme.palette.text.default
    },
    actionToolbar: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
        // '& input#standard-adornment-amount': {
        //     width: '25rem'
        // }
    },
    pagination: {
        background: theme.palette.primary.dark,
        borderTop: '1px solid ' + alpha(theme.palette.border.dashboard, 0.4),
        borderRadius: '0 0 5px 5px',
        color: theme.palette.text.default,
        fontSize: theme.spacing(2),
        position: 'sticky',
        bottom: 0,
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
    }
}));

export default function MinervaConsumerUtils() {
    const classes = useStyles();
    const [consumers, setConsumers] = useState([]);
    const [apps, setApps] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false });
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getConsumers();
        getCopilotApps();
    }, []);

    useEffect(() => {
        setPage(0);
    }, [search]);

    const getConsumers = () => {
        setIsLoading(true);
        getMinervaConsumers({
            callback: onResponseGetMinervaConsumers
        });
    };

    const onResponseGetMinervaConsumers = (response_data, status = 'success') => {
        setIsLoading(false);
        if (status === 'error') {
            setSnackbarStatus('Failed to fetch ask nuclios consumers', 'error');
        } else {
            setConsumers(response_data);
        }
    };

    const getCopilotApps = () => {
        getCopilotApplications({
            callback: onResponseGetCopilotApplications
        });
    };

    const onResponseGetCopilotApplications = (response_data) => {
        setApps(response_data);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRemoveConsumer = (id) => {
        deleteMinervaConsumer({
            consumerId: id,
            callback: onResponseDeleteMinervaConsumer
        });
    };

    const onResponseDeleteMinervaConsumer = (response_data) => {
        setSnackbarStatus(response_data.msg);
        getConsumers();
    };

    const setSnackbarStatus = (message, severity = 'success') => {
        setSnackbar({
            open: true,
            message: message,
            severity: severity
        });
    };

    const handleConsumerSearch = (val) => {
        setSearch(val);
    };

    const rowsData =
        rowsPerPage > 0
            ? consumers
                  .filter((item) => {
                      return item.name?.toLowerCase().includes(search?.toLowerCase());
                  })
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : consumers.filter((item) => {
                  return item.name?.toLowerCase().includes(search?.toLowerCase());
              });

    const getTableCount = () => {
        if (search) {
            return consumers.filter((item) => {
                return item.name?.toLowerCase().includes(search?.toLowerCase());
            }).length;
        } else {
            return consumers.length;
        }
    };

    return (
        <div className={classes.main} key={1}>
            {isLoading ? <CodxCircularLoader center /> : null}
            <React.Fragment>
                <Grid item sx={12} md={12} style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div
                            id="go-back-link-container"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: 'white'
                            }}
                        >
                            <Link to={'/platform-utils'}>
                                <ArrowBackIosRoundedIcon
                                    fontSize="large"
                                    className={classes.backIcon}
                                />
                            </Link>
                            <div
                                id="page-header-container"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: 'white'
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    className={clsx(classes.fontSize2, classes.fontColor)}
                                >
                                    {'Ask NucliOS Consumers'}
                                </Typography>
                            </div>
                        </div>

                        <div id="cta-buttons" className={classes.actionToolbar}>
                            <SearchBar
                                placeholder={'Search Here!'}
                                onChangeWithDebounce={handleConsumerSearch}
                                value={search}
                            />
                            <ManageMinervaConsumer
                                createNewConsumer={true}
                                consumerId={null}
                                copilotApps={apps}
                                fetchMinervaConsumers={getConsumers}
                            />
                        </div>
                    </div>
                </Grid>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell>Description</StyledTableCell>
                                <StyledTableCell align="right" style={{ paddingRight: '5rem' }}>
                                    Actions
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {consumers && !isLoading && (
                            <TableBody>
                                {rowsData.length === 0 ? (
                                    <StyledTableRow>
                                        <StyledTableCell align="center" colSpan={12}>
                                            <Typography
                                                variant="h4"
                                                style={{ letterSpacing: '0.1rem' }}
                                            >
                                                No Consumer Found
                                            </Typography>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ) : (
                                    rowsData.map((row) => (
                                        <StyledTableRow key={'minerva-table-row' + row.id}>
                                            <StyledTableCell
                                                key={'minerva-table-cell' + row.id + row.name}
                                            >
                                                {row.name}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                key={'minerva-table-cell-desc' + row.id + row.name}
                                            >
                                                {row.desc}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <ManageMinervaConsumer
                                                    createNewConsumer={false}
                                                    consumerId={row.id}
                                                    copilotApps={apps}
                                                    fetchMinervaConsumers={getConsumers}
                                                    access_key={row.access_key}
                                                />
                                                <ConfirmPopup
                                                    onConfirm={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveConsumer(row.id);
                                                    }}
                                                    title="Delete Consumer"
                                                    subTitle="Are you sure you want to delete the consumer ?"
                                                    cancelText="Cancel"
                                                    confirmText="Delete"
                                                >
                                                    {(triggerConfirm) => (
                                                        <IconButton
                                                            key={2}
                                                            title="Delete Ask NucliOS Consumer"
                                                            onClick={triggerConfirm}
                                                            className={classes.iconBtn}
                                                        >
                                                            <DeleteOutline
                                                                fontSize="large"
                                                                style={{ color: 'red' }}
                                                            />
                                                        </IconButton>
                                                    )}
                                                </ConfirmPopup>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                )}
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
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
                    count={getTableCount()}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </React.Fragment>
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
        </div>
    );
}
