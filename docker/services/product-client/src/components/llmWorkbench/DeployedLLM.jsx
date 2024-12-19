import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Breadcrumbs,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Link,
    useTheme,
    withStyles
} from '@material-ui/core';
import { VisibilityOutlined } from '@material-ui/icons';
import DataTable from 'components/llmWorkbench/DataTable';
import deployedLLMStyle from 'assets/jss/llmWorkbench/deployedLLMStyle';
import {
    updateLLMModel,
    debouncedGetTableHeader,
    deleteDeployedLLMModel
} from 'services/llmWorkbench/llm-workbench';
import Typography from 'components/elements/typography/typography';
import CustomSnackbar from 'components/CustomSnackbar';
import {
    getDeployedLLMs,
    setDeployedLLMHeaders,
    resetDeployedLLMList,
    updateSingleDeployedLLMInList
} from 'store';
import t from 'config/textContent/llmWorkbench.json';

const tableActions = (actions) => {
    const Actions = (llm) =>
        llm['job_status'] === 'in-progress' ? (
            '-'
        ) : (
            <Box display="flex" aria-label={`action-llm-${llm.id}`}>
                <IconButton
                    title="View deployment"
                    onClick={actions.loadDeployment.bind(null, llm)}
                >
                    <VisibilityOutlined fontSize="large" />
                </IconButton>
            </Box>
        );
    Actions.displayName = 'DeployedLLMTableActions';
    return Actions;
};

const ActionDialog = ({ open, classes, onAccept, onCancel }) => {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>Delete the deployment?</DialogTitle>
            <DialogContent>
                <Typography variant="h4" className={classes.titleText}>
                    Are you sure you want to delete the deployed model.
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

const DeployedLLM = ({ classes, ...props }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const {
        loading,
        deployedLLM: { data, total, headers }
    } = useSelector((state) => state.llmWorkbench);

    const [searchInfo, setSearchInfo] = useState({ searchId: '', searchValue: '' });
    const [paginationInfo, setPaginationInfo] = useState({
        page: 0,
        rowsPerPage: 5
    });
    const [snackbarState, setSnackbarState] = useState({ open: false, message: '', severity: '' });
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [activeModel] = useState(null);
    const [open, setOpen] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState({});
    const loadData = useCallback(async () => {
        try {
            if (!headers) {
                const _headers = await debouncedGetTableHeader('deployed');
                dispatch(setDeployedLLMHeaders(_headers));
            }
            dispatch(
                getDeployedLLMs({
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
            dispatch(resetDeployedLLMList());
        };
    }, [paginationInfo.rowsPerPage, paginationInfo.page, searchInfo?.searchValue]);

    const onHandleSearch = (searchId, searchValue) => {
        setSearchInfo((prevState) => ({
            ...prevState,
            searchId,
            searchValue
        }));
    };

    const onStatusChange = async (row, { target: { checked } }) => {
        setLoadingStatus((loadingStatus) => ({ ...loadingStatus, [row.id]: true }));
        const { data } = await updateLLMModel({
            ...row,
            status: checked ? 'active' : 'inactive'
        });
        setLoadingStatus((loadingStatus) => ({ ...loadingStatus, [row.id]: false }));
        dispatch(updateSingleDeployedLLMInList(data));
    };

    const loadDeployment = useCallback(
        async (row) => {
            props.history.push(`/llmworkbench/deployments/${row.id}`);
        },
        [isActionLoading]
    );

    const onAcceptDialog = useCallback(async () => {
        setIsActionLoading(() => true);
        setOpen(false);
        try {
            await deleteDeployedLLMModel(activeModel.id);
            setLoadingStatus((status) => ({ ...status, [activeModel.id]: false }));
            dispatch(
                getDeployedLLMs({
                    size: paginationInfo?.rowsPerPage,
                    page: paginationInfo?.page,
                    search: searchInfo?.searchValue
                })
            );
            setSnackbarState({
                open: true,
                message: 'Deployed model deleted successfully',
                severity: 'success'
            });
        } catch (error) {
            setLoadingStatus((status) => ({ ...status, [activeModel.id]: false }));
            setSnackbarState({
                open: true,
                message:
                    error?.message || 'Failed to delete the Deployed model! Please try again later',
                severity: 'error'
            });
        }
        setIsActionLoading(() => false);
    }, [activeModel]);

    const onCancelDialog = useCallback(async () => {
        setOpen(false);
        setLoadingStatus((status) => ({ ...status, [activeModel.id]: false }));
    }, [activeModel]);

    return (
        <Box display="flex" flexDirection="column" className={classes.container}>
            <ActionDialog
                open={open}
                onCancel={onCancelDialog}
                onAccept={onAcceptDialog}
                classes={classes}
            />
            <Breadcrumbs
                aria-label="breadcrumb"
                style={{
                    color: theme.palette.text.titleText,
                    paddingLeft: theme.spacing(3),
                    paddingTop: theme.spacing(0.5),
                    fontSize: '1.4rem'
                }}
            >
                <Link color="inherit" href="/llmworkbench">
                    LLM Workbench
                </Link>
                <Typography
                    color="textPrimary"
                    style={{
                        fontWeight: 'bold',
                        color: theme.palette.text.contrastText,
                        fontSize: '1.4rem'
                    }}
                >
                    View deployed models
                </Typography>
            </Breadcrumbs>
            <Typography className={classes.titleText}>{t.deployed_models.table.title}</Typography>
            <Typography
                className={classes.titleText}
                variant="k8"
                style={{ textTransform: 'none' }}
            >
                {t.deployed_models.table.information}
            </Typography>
            <DataTable
                tableHeaderCells={headers}
                tableData={data}
                tableActions={tableActions({ loadDeployment })}
                page="deployedLLMs"
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
                className={classes.Padding}
                onStatusChange={onStatusChange}
                loadingStatus={loadingStatus}
            />
            <CustomSnackbar
                open={snackbarState.open}
                autoHideDuration={3000}
                onClose={setSnackbarState.bind(null, { open: false, message: '', severity: '' })}
                severity={snackbarState.severity || 'success'}
                message={snackbarState.message}
            />
        </Box>
    );
};

export default withStyles(deployedLLMStyle, { withTheme: true })(DeployedLLM);
