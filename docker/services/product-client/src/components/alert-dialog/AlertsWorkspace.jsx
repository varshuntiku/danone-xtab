import React, { Fragment, useEffect, useState } from 'react';
import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { Switch, Button } from '@material-ui/core';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import withWidth from '@material-ui/core/withWidth';
import { getAlerts, deleteAlert, updateAlertNotification } from '../../services/alerts';
import CodxPopupDialog from '../custom/CodxPoupDialog';
import { Typography } from '@material-ui/core';
import CodxCircularLoader from '../CodxCircularLoader';
import CustomSnackbar from '../CustomSnackbar';

/* styles for table cell and row */
const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.background.tableHeader,
        color: theme.palette.text.titleText,
        fontSize: '1.5rem',
        fontWeight: '500'
    },
    body: {
        color: theme.palette.text.titleText,
        fontSize: '1.4rem',
        width: 0,
        padding: '2rem 3rem',
        opacity: 1
    }
}))(TableCell);

const StyledTableRow = withStyles(() => ({
    root: {
        borderBottom: '1px solid rgba(151, 151, 151, 0.4)'
    }
}))(TableRow);
/* style for notification toggle */
const NotificationSwitch = withStyles((theme) => ({
    root: {
        width: '4.35rem',
        height: '2rem',
        padding: 0,
        display: 'flex'
    },
    switchBase: {
        padding: '0.1rem',
        color: '#FFFFFF',
        top: '0.1rem',
        left: '0.1rem',
        '&$checked': {
            transform: 'translateX(2.6rem)',
            color: theme.palette.border.buttonOutline,
            '& + $track': {
                opacity: 1,
                backgroundColor: theme.palette.border.buttonOutline + '!important',
                borderColor: theme.palette.border.buttonOutline
            },
            '& .MuiIconButton-label .MuiSwitch-thumb': {
                color: theme.palette.primary.dark
            }
        }
    },
    thumb: {
        color: theme.palette.border.buttonOutline,
        width: '1.5rem',
        height: '1.5rem',
        boxShadow: 'none'
    },
    checked: {}
}))(Switch);
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

const workspaceStyles = makeStyles((theme) => ({
    table: {
        '& .MuiTableCell-root': {
            borderBottom: 'none !important'
        },
        border: 'none'
    },
    tableFooter: {
        '& .MuiTablePagination-selectRoot': {
            display: 'none'
        },
        '& .MuiTablePagination-caption': {
            fontSize: '1.5rem',
            color: theme.palette.text.titleText
        },
        '& .MuiTableRow-footer': {
            borderTop: '1px solid rgba(151, 151, 151, 0.4)'
        }
    },
    tableHeaderRow: {
        borderBottom: '1px solid rgba(151, 151, 151, 0.4)',
        backgroundColor: theme.palette.background.wizardBackground
    },
    tableHeader: {
        height: '5.5rem',
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        padding: '1rem 3rem',
        position: 'relative',
        borderBottom: '1px solid rgba(151, 151, 151, 0.4)',
        color: theme.palette.text.titleText,
        fontWeight: 100,
        letterSpacing: '0.2rem'
    },
    alertsType: {
        color: theme.palette.text.contrastText,
        textTransform: 'capitalize'
    },
    dialogRoot: {
        margin: 0,
        padding: theme.spacing(2),
        '& .MuiTypography-caption': {
            fontSize: '1.75rem'
        }
    },
    dialogTitle: {
        fontSize: theme.spacing(2.5),
        padding: `${theme.layoutSpacing(15)} ${theme.layoutSpacing(2)}`,
        letterSpacing: '1.5px',
        color: theme.palette.text.titleText,
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`,
        opacity: '0.8'
    },
    dialogContent: {
        color: theme.palette.text.titleText,
        fontSize: '1.75rem'
    },
    deleteIcon: {
        padding: 0,
        float: 'left',
        '& .MuiIconButton-label .MuiSvgIcon-root': {
            color: theme.palette.icons.indicatorRed,
            fontSize: '2.2rem'
        }
    },
    dialogPaper: {
        //  applied to the delete dialog
        background: theme.palette.background.modelBackground,
        borderRadius: '0px !important',
        border: '0px !important',
        width: '30%'
    },
    dialogPaperTable: {
        // applied to the table dialog
        borderRadius: '0px !important'
    },
    dialogContentSection: {
        padding: '1.6rem'
    }
}));

/* set number of rows for table according to screenresoultion */
const numOfRows = {
    lg: 8,
    md: 7,
    sm: 4
};

function AlertsWorkspace(props) {
    const classes = workspaceStyles();
    // const classes1 = editDialogStyles();
    const { width } = props;
    const rowsPerPage = numOfRows[width] || 9;
    const [page, setPage] = useState(0);
    const [rowsData, setRowsData] = useState([]);
    const [open, setOpen] = useState({
        edit: false,
        delete: false,
        confirm: false
    });
    const [alertId, setAlertId] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [snackMessage, setSnackMessage] = useState({
        open: false,
        message: ''
    });
    /* get all alerts created by user */
    useEffect(() => {
        getAlerts({
            payload: { app_id: props.app_info.id },
            callback: initiate
        });
    }, [props]);

    const initiate = (data) => {
        setIsLoading(false);
        setRowsData([...data]);
    };

    /* page change handler */
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    /* notification toggle change handler */
    const handleChange = (alertId, notification) => {
        const updatedNotification = {
            receive_notification: !notification
        };

        updateAlertNotification({
            alertId: alertId,
            payload: updatedNotification,
            callback: onResponseUpdateNotification
        });
    };

    const onResponseUpdateNotification = () => {
        setIsLoading(true);
        getAlerts({
            payload: { app_id: props.app_info.id },
            callback: initiate
        });
    };

    const removeAlertHandler = (alertId) => {
        deleteAlert({
            alertId: alertId,
            callback: onResponseDeleteAlert
        });
    };
    const onResponseDeleteAlert = () => {
        setSnackMessage({
            open: true,
            message: 'Successfully deleted the alert'
        });
        getAlerts({
            payload: { app_id: props.app_info.id },
            callback: initiate
        });
        deleteCloseHandler();
    };
    const deleteConfirmationHandler = (id) => {
        setOpen({
            ...open,
            delete: true
        });
        setAlertId(id);
    };
    const deleteCloseHandler = () => {
        setOpen({
            ...open,
            delete: false
        });
        setAlertId();
    };
    const closeSnackbarHandler = () => {
        setSnackMessage({
            open: false,
            message: ''
        });
    };
    /* table pagination text */
    const paginationLabelDisplay = ({ from, to, count }) => {
        return `${from}-${to} of ${count !== -1 ? count : ''} alerts`;
    };
    /* delete dialog action buttons */
    const deleteDialogActions = (
        <Fragment>
            <Button aria-label="delete-cancel" variant="outlined" onClick={deleteCloseHandler}>
                Cancel
            </Button>
            <Button
                aria-label="delete-confirm"
                variant="contained"
                onClick={() => removeAlertHandler(alertId)}
            >
                Delete
            </Button>
        </Fragment>
    );
    return (
        <Fragment>
            <div>
                <Typography className={classes.tableHeader} variant="h3">
                    Alerts
                </Typography>
            </div>
            <div style={{ padding: '0rem 2.4000000000000004rem' }}>
                <TableContainer component={Paper} className={classes.dialogPaperTable}>
                    <Table className={classes.table} aria-label="custom pagination table">
                        <TableHead className={classes.tableHeaderRow}>
                            <TableRow>
                                <StyledTableCell>Name</StyledTableCell>
                                {/* <StyledTableCell align="left">Type</StyledTableCell> */}
                                <StyledTableCell align="left">Source</StyledTableCell>
                                <StyledTableCell align="left">Alerting Rule</StyledTableCell>
                                <StyledTableCell align="left">Receive Notification</StyledTableCell>
                                {/* <StyledTableCell align="left">Alerts For</StyledTableCell> */}
                                <StyledTableCell align="left">Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? rowsData.slice(
                                      page * rowsPerPage,
                                      page * rowsPerPage + rowsPerPage
                                  )
                                : rowsData
                            ).map((row) => (
                                <StyledTableRow key={row.id}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.title}
                                    </StyledTableCell>
                                    {/* <StyledTableCell align="left" className={classes.alertsType}>{row.alert_widget_type}</StyledTableCell> */}
                                    <StyledTableCell align="left">
                                        {row.alert_source_type}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {row.condition} {row.threshold}
                                    </StyledTableCell>
                                    <StyledTableCell align="left" id="receive-notification">
                                        <NotificationSwitch
                                            inputProps={{ 'data-testid': 'notification-toggle' }}
                                            checked={row.receive_notification}
                                            onChange={() =>
                                                handleChange(row.id, row.receive_notification)
                                            }
                                        />
                                    </StyledTableCell>
                                    {/* <StyledTableCell align="left" >{row.alert_For ? row.alert_For : '-'}</StyledTableCell> */}
                                    <StyledTableCell
                                        align="left"
                                        scope="row"
                                        style={{
                                            paddingLeft: '1.1%',
                                            paddingRight: '1.1%',
                                            width: '10%'
                                        }}
                                    >
                                        {/* <IconButton aria-label='Edit alert' style={{padding: 0, float: 'left'}} onClick={() => updateAlertHandler(row)}>
                                            <EditOutlinedIcon fontSize="large" />
                                        </IconButton> */}
                                        <IconButton
                                            aria-label="Delete Alert"
                                            className={classes.deleteIcon}
                                            onClick={() => deleteConfirmationHandler(row.id)}
                                        >
                                            <DeleteOutlinedIcon />
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                        <TableFooter className={classes.tableFooter}>
                            <TableRow>
                                <TablePagination
                                    colSpan={12}
                                    count={rowsData.length}
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
                {isLoading && <CodxCircularLoader size={60} center />}
                <CodxPopupDialog
                    open={open.delete}
                    setOpen={setOpen}
                    property="delete"
                    dialogTitle="Delete Alert"
                    dialogContent="Are you sure you want to delete the alert?"
                    dialogActions={deleteDialogActions}
                    maxWidth="xs"
                    dialogClasses={classes}
                />
                <CustomSnackbar
                    open={snackMessage.open}
                    message={snackMessage.message}
                    onClose={closeSnackbarHandler}
                    autoHideDuration={2000}
                    severity="success"
                />
            </div>
        </Fragment>
    );
}

AlertsWorkspace.propTypes = {
    width: PropTypes.oneOf(['lg', 'md', 'sm', 'xl', 'xs']).isRequired
};

export default withWidth()(AlertsWorkspace);
