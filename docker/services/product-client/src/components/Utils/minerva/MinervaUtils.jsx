import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles, alpha } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import { getApplications, deleteApplication } from '../../../services/minerva_utils';
import ManageMinervaApps from './ManageMinervaApplication';
import { DeleteOutline } from '@material-ui/icons';
import { IconButton, Typography, Grid } from '@material-ui/core';
import CustomSnackbar from '../../CustomSnackbar';
import clsx from 'clsx';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import { Link } from 'react-router-dom';
import ConfirmPopup from '../../confirmPopup/ConfirmPopup';
// import { fetch_socket_connection } from 'util/initiate_socket';
import SearchBar from 'components/CustomSearchComponent/SearchComponent';
import CodxCircularLoader from 'components/CodxCircularLoader';

import * as _ from 'underscore';

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
        padding: theme.spacing(2) + ' ' + theme.spacing(4),
        fontFamily: theme.body.B5.fontFamily,
        fontSize: theme.layoutSpacing(14)
    }
}))(TableCell);

export const StyledTableRow = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.dark
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
            color: theme.palette.primary.contrastText
        }
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
    backIcon: {
        marginRight: '1rem',
        fill: theme.palette.text.revamp
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
    },
    tableContainer: {
        maxHeight: '65vh'
    }
}));

const applicationSourceType = {
    document_query: 'Document',
    index_file: 'Index File',
    sql: 'SQL Database',
    sql_with_context: 'SQL with context',
    q_and_a: 'Q and A',
    csv_file: 'CSV File'
};

export default function MinervaUtils() {
    const classes = useStyles();
    const appsSourceType = applicationSourceType;
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [minervaApps, setMinervaApps] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false });
    // const socket = fetch_socket_connection();
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getMinervaApplications();
    }, []);

    useEffect(() => {
        setPage(0);
    }, [search]);

    // useEffect(() => {
    //     createSocketListeners();
    //     return () => {
    //         socket['minerva_socket']?.removeListener('job_status_update');
    //     };
    // }, [minervaApps]);

    const getMinervaApplications = () => {
        setIsLoading(true);
        getApplications({
            callback: onResponseGetMinervaApplications
        });
    };

    const onResponseGetMinervaApplications = (response_data, status = 'success') => {
        setIsLoading(false);
        if (status === 'error') {
            setSnackbarStatus('Failed to load Ask NucliOS Applications', 'error');
        } else {
            setMinervaApps(response_data.minerva_apps);
        }
    };

    const deleteMinervaApplication = (appId) => {
        deleteApplication({
            appId: appId,
            callback: onResponseDeleteMinervaApplication
        });
    };

    const onResponseDeleteMinervaApplication = (status = 'success') => {
        if (status === 'error') {
            setSnackbarStatus('Failed to delete Ask NucliOS Application', 'error');
        } else {
            setSnackbarStatus('Ask NucliOS Application deleted successfully');
            _.delay(
                () => {
                    getMinervaApplications();
                },
                1000,
                ''
            );
        }
    };

    const setSnackbarStatus = (message, severity = 'success') => {
        setSnackbar({
            open: true,
            message: message,
            severity: severity
        });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // const createSocketListeners = () => {
    //     if (!socket['minerva_socket']?.hasListeners('job_status_update')) {
    //         socket['minerva_socket']?.on('job_status_update', (data) => {
    //             updateAppData(data, 'appStatus');
    //         });
    //     }
    // };

    const updateAppData = (data, update = 'config') => {
        const updatedMinervaApps = minervaApps.slice();
        const appIndex = updatedMinervaApps.findIndex((app) => app.id == data.id);
        let appMetaData = {};
        for (const key in updatedMinervaApps[appIndex]) {
            if (data[key]) {
                appMetaData[key] = data[key];
            }
        }
        updatedMinervaApps[appIndex] = {
            ...minervaApps[appIndex],
            ...appMetaData
        };
        setMinervaApps(updatedMinervaApps);
        if (
            update === 'appStatus' &&
            (data['status'] === 'Completed' || data['status'] === 'Failed')
        ) {
            // socket['minerva_socket']?.emit('exit::minerva_app_status', {
            //     room_id: 'minerva_job_app_' + data.id
            // });
        }
    };

    // return <div></div>

    const handleApplicationSearch = (val) => {
        setSearch(val);
    };

    const rowsData =
        rowsPerPage > 0
            ? minervaApps
                  .filter((item) => {
                      return item.name?.toLowerCase().includes(search?.toLowerCase());
                  })
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : minervaApps.filter((item) => {
                  return item.name?.toLowerCase().includes(search?.toLowerCase());
              });

    const getTableCount = () => {
        if (search) {
            return minervaApps.filter((item) => {
                return item.name?.toLowerCase().includes(search?.toLowerCase());
            }).length;
        } else {
            return minervaApps.length;
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
                            <Link to={'/platform-utils'} aria-label="platform-utils">
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
                                    {'Ask NucliOS Applications'}
                                </Typography>
                            </div>
                        </div>

                        <div id="cta-buttons" className={classes.actionToolbar}>
                            <SearchBar
                                placeholder={'Search Here!'}
                                onChangeWithDebounce={handleApplicationSearch}
                                value={search}
                            />
                            <ManageMinervaApps
                                createNewApp={true}
                                appId={null}
                                getMinervaApplications={getMinervaApplications}
                                updateAppData={updateAppData}
                            />
                        </div>
                    </div>
                </Grid>
                <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Application Name</StyledTableCell>
                                <StyledTableCell>Application Description</StyledTableCell>
                                <StyledTableCell>Application Source Type</StyledTableCell>
                                <StyledTableCell>Application Status</StyledTableCell>
                                <StyledTableCell align="right" style={{ paddingRight: '5rem' }}>
                                    Actions{' '}
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        {minervaApps && !isLoading && (
                            <TableBody>
                                {rowsData.length === 0 ? (
                                    <StyledTableRow>
                                        <StyledTableCell align="center" colSpan={12}>
                                            <Typography
                                                variant="h4"
                                                style={{ letterSpacing: '0.1rem' }}
                                            >
                                                No Application Found
                                            </Typography>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ) : (
                                    rowsData.map((row, index) => (
                                        <StyledTableRow key={'minerva-table-row' + index}>
                                            <StyledTableCell
                                                key={'minerva-table-cell' + index + row.name}
                                            >
                                                {row.name}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                key={'minerva-table-cell-desc' + index + row.name}
                                            >
                                                {row.description}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                key={'minerva-table-cell-source' + index + row.name}
                                            >
                                                {appsSourceType[row.source_type]}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                key={'minerva-table-cell-status' + index + row.name}
                                            >
                                                {row.status}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <ManageMinervaApps
                                                    createNewApp={false}
                                                    appId={row.id}
                                                    getMinervaApplications={getMinervaApplications}
                                                    updateAppData={updateAppData}
                                                />
                                                <ConfirmPopup
                                                    onConfirm={(e) => {
                                                        e.stopPropagation();
                                                        deleteMinervaApplication(row.id);
                                                    }}
                                                    title="Delete Application"
                                                    subTitle="Are you sure you want to delete the application ?"
                                                    cancelText="Cancel"
                                                    confirmText="Delete"
                                                >
                                                    {(triggerConfirm) => (
                                                        <IconButton
                                                            key={2}
                                                            title="Delete Ask NucliOS Application"
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
