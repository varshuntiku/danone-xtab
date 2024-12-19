import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import UtilsNavigation from 'components/shared/platform-utils-nav-header/platform-utils-nav-header';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import {
    StyledTableCell,
    StyledTableRow
} from 'components/ExecutionEnvironment/Styles/ExecutionEnvStyles';
import TablePagination from '@material-ui/core/TablePagination';
import { withStyles, alpha, IconButton, Box } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as SuccessIcon } from 'assets/img/llm-workbench/success-indicator.svg';
import { ReactComponent as FailIcon } from 'assets/img/llm-workbench/fail-indicator.svg';
import { ReactComponent as InProgressIcon } from 'assets/img/llm-workbench/in-progress-indicator.svg';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { CheckCircleOutline, NotInterested } from '@material-ui/icons';
import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';
import CustomLoadMask from 'components/CustomLoadMask';
import CustomSnackbar from 'components/CustomSnackbar';
import {
    getAllDynamicExecEnvs,
    postApprovalsOrReject
} from 'services/execution_environments_utils.js';

const statusText = {
    pending: 'Pending',
    rejected: 'Rejected',
    approved: 'Approved'
};

const approvalsOptions = ['Pending', 'Rejected', 'Approved', 'All'];

function ExecutionEnvironmentsApprovals({ classes, user_permissions }) {
    const [approve, setApprove] = useState(false);
    const [approvalsStatus, setApprovalsStatus] = React.useState('pending');
    const [open, setOpen] = useState(false);
    const [statusData, setStatusData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approvalStatusData, setApprovalStatusData] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [snackbar, setSnackbar] = useState({
        open: false
    });

    const statusIcons = {
        pending: (
            <SvgIcon style={{ marginRight: '0.5rem', fontSize: '1.8rem' }}>
                <InProgressIcon />
            </SvgIcon>
        ),
        rejected: (
            <SvgIcon style={{ marginRight: '0.5rem', fontSize: '1.8rem' }}>
                <FailIcon />
            </SvgIcon>
        ),
        approved: (
            <SvgIcon style={{ marginRight: '0.5rem', fontSize: '1.8rem' }}>
                <SuccessIcon />
            </SvgIcon>
        )
    };

    useEffect(() => {
        getAllDynamicExecEnvs({
            callback: onResponseGetDynamicExecEnvs
        });
    }, []);

    useEffect(() => {
        if (user_permissions && user_permissions.environments) {
            setApprove(user_permissions.environments);
        } else {
            setApprove(false);
        }
    }, [user_permissions]);

    useEffect(() => {
        if (approvalsStatus === 'all') {
            setStatusData(approvalStatusData);
        } else {
            setStatusData(getFilteredData(approvalStatusData));
        }
    }, [approvalStatusData, approvalsStatus, loading]);

    const getFilteredData = (data) => {
        const resData = data.filter((row) => {
            return row.status.toLowerCase() === approvalsStatus.toLowerCase(); // Matching case exactly
        });
        return resData;
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleChange = (event) => {
        setApprovalsStatus(event.target.value);
    };

    const onApprove = (row) => {
        setLoading(true);
        postApprovalsOrReject({
            id: row.id,
            payload: {
                action_type: 'approved'
            },
            callback: onResponsePostApprovalsOrReject
        });
    };

    const onReject = (row) => {
        setLoading(true);
        postApprovalsOrReject({
            id: row.id,
            payload: {
                action_type: 'rejected'
            },
            callback: onResponsePostApprovalsOrReject
        });
    };

    const getTableBody = () => {
        return (
            statusData && (
                <TableBody>
                    {statusData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                            <StyledTableRow key={row.name}>
                                <StyledTableCell>{row.name}</StyledTableCell>
                                <StyledTableCell
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '3.5rem 2rem'
                                    }}
                                >
                                    {statusIcons[row.status.toLowerCase()]}
                                    {statusText[row.status.toLowerCase()]}
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Box display="flex" className={classes.actionsBox}>
                                        <ConfirmPopup
                                            title={<span>Approve </span>}
                                            subTitle={
                                                <>
                                                    Are you sure you want to Approve{' '}
                                                    <b>{row.name}</b> ?
                                                </>
                                            }
                                            cancelText="No"
                                            confirmText="Yes"
                                            onConfirm={(e) => {
                                                e.stopPropagation();
                                                onApprove(row);
                                            }}
                                        >
                                            {(triggerConfirm) => (
                                                <IconButton
                                                    title="Approve"
                                                    className={`approve ${
                                                        !approve
                                                            ? 'disabled'
                                                            : row.is_disable
                                                            ? 'disabled'
                                                            : ''
                                                    }`}
                                                    onClick={triggerConfirm}
                                                    disabled={!approve ? true : row.is_disable}
                                                >
                                                    <CheckCircleOutline fontSize="large" />
                                                </IconButton>
                                            )}
                                        </ConfirmPopup>
                                        <ConfirmPopup
                                            title={<span>Reject </span>}
                                            subTitle={
                                                <>
                                                    Are you sure you want to Reject{' '}
                                                    <b>{row.name}</b> ?
                                                </>
                                            }
                                            cancelText="No"
                                            confirmText="Yes"
                                            onConfirm={(e) => {
                                                e.stopPropagation();
                                                onReject(row);
                                            }}
                                        >
                                            {(triggerConfirm) => (
                                                <IconButton
                                                    title="Reject"
                                                    className={`reject ${
                                                        !approve
                                                            ? 'disabled'
                                                            : row.is_disable
                                                            ? 'disabled'
                                                            : ''
                                                    }`}
                                                    onClick={triggerConfirm}
                                                    disabled={!approve ? true : row.is_disable}
                                                >
                                                    <NotInterested fontSize="large" />
                                                </IconButton>
                                            )}
                                        </ConfirmPopup>
                                    </Box>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                </TableBody>
            )
        );
    };

    const ApprovalStatusMenu = () => {
        return (
            <>
                <div className={classes.approvalsStatusContainer}>
                    <FormControl className={classes.formControl}>
                        <InputLabel className="inputLabel" id="approvals-status-select-label">
                            Approvals Status :
                        </InputLabel>
                        <Select
                            labelId="approvals-status-select-label"
                            id="approvals-status-select"
                            open={open}
                            onClose={handleClose}
                            onOpen={handleOpen}
                            value={approvalsStatus}
                            onChange={handleChange}
                            className="select"
                        >
                            {approvalsOptions.map((item, index) => {
                                return (
                                    <MenuItem key={index} value={item.toLowerCase()}>
                                        {item}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </div>
            </>
        );
    };

    const setSnackbarStatus = (message, severity = 'success') => {
        setSnackbar({
            open: true,
            message: message,
            severity: severity
        });
    };

    const onResponseGetDynamicExecEnvs = (response_data, status = 'success') => {
        setLoading(false);
        if (status === 'error') {
            setSnackbarStatus('Failed to load Environments', 'error');
        } else {
            let dynamicExecEnvsList = response_data.map((item) => {
                let is_disable = true;
                if (item?.compute_type === 'dedicated' && item?.approval_status === 'pending') {
                    is_disable = false;
                }
                return {
                    id: item.id,
                    name: item.name || '',
                    status: item.approval_status || '',
                    compute_type: item.compute_type || '',
                    is_disable
                };
            });
            setStatusData(getFilteredData(dynamicExecEnvsList));
            setApprovalStatusData(dynamicExecEnvsList);
        }
    };

    const onResponsePostApprovalsOrReject = (status = 'success') => {
        setLoading(false);
        if (status === 'error') {
            setSnackbarStatus('Failed to load Environments', 'error');
        } else {
            setLoading(true);
            getAllDynamicExecEnvs({
                callback: onResponseGetDynamicExecEnvs
            });
        }
    };

    return (
        <>
            <UtilsNavigation
                path="/platform-utils"
                backTo="Platform Utils"
                title="Execution Environment Approval Status"
            />
            {loading ? (
                <CustomLoadMask loadMaskMsg={'Loading...'} />
            ) : (
                <>
                    <ApprovalStatusMenu />
                    <div className={classes.main}>
                        <TableContainer component={Paper} className={classes.tableContainer}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Environment Name</StyledTableCell>
                                        <StyledTableCell>Status</StyledTableCell>
                                        <StyledTableCell>Actions </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                {getTableBody()}
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
                            component="div"
                            rowsPerPageOptions={[5, 10, 25]}
                            count={statusData.length || 1}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>
                </>
            )}
            <CustomSnackbar
                open={snackbar.open}
                message={snackbar.message}
                autoHideDuration={5000}
                onClose={() => {
                    setSnackbar({
                        open: false
                    });
                }}
                severity={snackbar.severity}
            />
        </>
    );
}

const styles = (theme) => ({
    main: {
        padding: '.5rem 4rem'
    },
    approvalsStatusContainer: {
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'center',
        height: '7rem',
        paddingTop: '2.5rem',
        paddingRight: '4rem',
        '& span': {
            color: theme.palette.text.default,
            fontSize: '2rem'
        }
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        '& .inputLabel': {
            fontSize: '1.5rem',
            color: theme.palette.text.default
        },
        '& #approvals-status-select': {
            fontSize: '2rem',
            color: theme.palette.text.default
        },
        '& svg': {
            fontSize: '3rem',
            color: theme.palette.text.default
        }
    },
    list: {
        '& span': {
            fontSize: '2rem'
        },
        '& p': {
            fontSize: '2rem'
        }
    },
    actionsBox: {
        '& .approve svg': {
            color: 'green',
            fontSize: '2.5rem'
        },
        '& .reject svg': {
            color: 'red',
            fontSize: '2.5rem'
        },
        '& .disabled svg': {
            opacity: 0.4
        }
    },
    tableContainer: {
        marginTop: theme.spacing(3),
        borderRadius: '5px',
        maxHeight: `calc(100vh - ${theme.layoutSpacing(360)})`,
        position: 'relative',
        border: `0.5px solid ${theme.palette.separator.tableContent}`
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
});

ExecutionEnvironmentsApprovals.propTypes = {
    classes: PropTypes.object
};

export default withStyles(styles)(ExecutionEnvironmentsApprovals);
