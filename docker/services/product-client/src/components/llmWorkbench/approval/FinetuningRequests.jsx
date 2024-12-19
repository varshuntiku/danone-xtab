import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Table,
    TableCell,
    TableRow,
    withStyles
} from '@material-ui/core';
import { CheckCircleOutline, NotInterested, Visibility } from '@material-ui/icons';
import Typography from 'components/elements/typography/typography';
import DataTable from 'components/llmWorkbench/DataTable';
import deployedLLMStyle from 'assets/jss/llmWorkbench/deployedLLMStyle';
import {
    updateLLMModel,
    debouncedGetTableHeader,
    executeFinetuneModel
} from 'services/llmWorkbench/llm-workbench';
import CustomSnackbar from 'components/CustomSnackbar';
import { getFinetuningApprovalRequests, setApproveModelHeaders, resetApprovalList } from 'store';

const tableActions = (action) => {
    const Action = (llm) => {
        return (
            <Box display="flex" aria-label={`action-llm-${llm.id}`}>
                <IconButton
                    title="View configurations"
                    onClick={action.onConfig.bind(null, llm)}
                    data-testid="approval-visibilty"
                >
                    <Visibility fontSize="large" />
                </IconButton>
                <IconButton
                    title="Accept"
                    onClick={action.onApprove.bind(null, llm)}
                    data-testid="approval-approve"
                >
                    <CheckCircleOutline fontSize="large" />
                </IconButton>
                <IconButton
                    title="Reject"
                    onClick={action.onReject.bind(null, llm)}
                    data-testid="approval-reject"
                >
                    <NotInterested className="delete-icon" fontSize="large" />
                </IconButton>
            </Box>
        );
    };
    Action.displayname = 'TableActions';
    return Action;
};

const ActionDialog = ({ open, classes, isReject, onAccept, onCancel }) => {
    const title = isReject ? 'Reject' : 'Accept';
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>{title} request?</DialogTitle>
            <DialogContent>
                <Typography variant="h4" className={classes.titleText}>
                    Are you sure you want to {title.toLowerCase()} the model finetuning request
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={onCancel} color="contrastText">
                    Cancel
                </Button>
                <Button onClick={onAccept} color="contrastText" autoFocus>
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const StyledTableCell = withStyles((theme) => ({
    root: {
        textAlign: 'justify',
        color: theme.palette.text.default,
        fontSize: theme.spacing(2),
        border: 'none',
        padding: theme.spacing(2) + ' ' + theme.spacing(4),
        wordBreak: 'break-word',
        width: '50%'
    }
}))(TableCell);

const ConfigDialog = ({ open, data, onClose }) => {
    if (!data) {
        return null;
    }
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Configurations</DialogTitle>
            <DialogContent>
                <Box>
                    <Table>
                        <TableRow>
                            <StyledTableCell>Job Id</StyledTableCell>
                            <StyledTableCell>{data.job_id}</StyledTableCell>
                        </TableRow>
                        <TableRow>
                            <StyledTableCell>Parent model</StyledTableCell>
                            <StyledTableCell>{data.parent_model_name}</StyledTableCell>
                        </TableRow>
                    </Table>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="contrastText">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const FinetuningRequests = ({ classes }) => {
    const dispatch = useDispatch();
    const {
        loading,
        approveModel: { data, total, headers }
    } = useSelector((state) => state.llmWorkbench);

    const [searchInfo, setSearchInfo] = useState({ searchId: '', searchValue: '' });
    const [paginationInfo, setPaginationInfo] = useState({
        page: 0,
        rowsPerPage: 5
    });
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [activeModel, setActiveModel] = useState(null);
    const [snackbarState, setSnackbarState] = useState({ open: false, message: '', severity: '' });
    const [open, setOpen] = useState(false);
    const [openConfig, setOpenConfig] = useState(false);
    const [configData, setConfigData] = useState('');
    const [isReject, setIsReject] = useState(false);
    const loadData = useCallback(async () => {
        try {
            if (!headers) {
                const _headers = await debouncedGetTableHeader('deployed-model-request');
                dispatch(setApproveModelHeaders(_headers));
            }
            dispatch(
                getFinetuningApprovalRequests({
                    size: paginationInfo?.rowsPerPage,
                    page: paginationInfo?.page,
                    search: searchInfo?.searchValue
                })
            );
        } catch (error) {
            setSnackbarState({
                open: true,
                message: error?.message || 'Failed to load Deployed models! Please try again',
                severity: 'error'
            });
        }
    }, [paginationInfo, searchInfo?.searchValue]);

    useEffect(() => {
        loadData();
        return () => {
            dispatch(resetApprovalList());
        };
    }, [paginationInfo?.page, paginationInfo?.rowsPerPage, searchInfo?.searchValue]);

    const onHandleSearch = (searchId, searchValue) => {
        setSearchInfo((prevState) => ({
            ...prevState,
            searchId,
            searchValue
        }));
    };

    const onStatusChange = async (row, { target: { checked } }) => {
        await updateLLMModel({
            ...row,
            status: checked ? 'active' : 'inactive'
        });
        dispatch(
            getFinetuningApprovalRequests({
                size: paginationInfo?.rowsPerPage,
                page: paginationInfo?.page,
                search: searchInfo?.searchValue
            })
        );
    };

    const onApprove = useCallback(
        (row) => {
            if (isActionLoading) return;
            setIsReject(() => false);
            setActiveModel(() => row);
            setOpen(true);
        },
        [isActionLoading]
    );

    const onReject = useCallback(
        (row) => {
            if (isActionLoading) return;
            setIsReject(() => true);
            setActiveModel(() => row);
            setOpen(true);
        },
        [isActionLoading]
    );

    const onAcceptDialog = useCallback(async () => {
        setIsActionLoading(() => true);
        setOpen(false);
        try {
            await executeFinetuneModel({
                ...activeModel,
                execution_type: isReject ? 'rejected' : 'approved'
            });
            dispatch(
                getFinetuningApprovalRequests({
                    size: paginationInfo?.rowsPerPage,
                    page: paginationInfo?.page,
                    search: searchInfo?.searchValue
                })
            );
        } catch (error) {
            // console.error(error);
        }
        setIsActionLoading(() => false);
    }, [activeModel]);

    const onConfig = useCallback((row) => {
        setOpenConfig(true);
        setConfigData(row);
    }, []);

    return (
        <>
            <ActionDialog
                open={open}
                onCancel={() => setOpen(false)}
                isReject={isReject}
                onAccept={onAcceptDialog}
                classes={classes}
            />
            <ConfigDialog
                open={openConfig}
                onClose={() => setOpenConfig(false)}
                data={configData}
                classes={classes}
            />
            <DataTable
                tableHeaderCells={headers}
                tableData={data}
                tableActions={tableActions({ onApprove, onReject, onConfig })}
                page="finetuningRequests"
                paginationInfo={{
                    page: paginationInfo.page,
                    rowsPerPage: paginationInfo.rowsPerPage,
                    totalCount: total
                }}
                searchId={searchInfo.searchId}
                searchValue={searchInfo.searchValue}
                setStateInfo={setPaginationInfo}
                onHandleSearch={onHandleSearch}
                loader={loading}
                debounceDuration={1000}
                className={`${classes.Padding} ${classes.noTopPadding}`}
                onStatusChange={onStatusChange}
            />
            <CustomSnackbar
                open={snackbarState.open}
                autoHideDuration={3000}
                onClose={setSnackbarState.bind(null, { open: false, message: '', severity: '' })}
                severity={snackbarState.severity || 'success'}
                message={snackbarState.message}
            />
        </>
    );
};

export default withStyles(deployedLLMStyle, { withTheme: true })(FinetuningRequests);
