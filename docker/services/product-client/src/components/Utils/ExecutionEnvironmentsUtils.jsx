import React, { useEffect, useState, useCallback, useContext } from 'react';
import { withStyles, alpha } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import {
    getExecEnvs,
    deleteExecEnv,
    // getExecEnvsStatusById,
    getExecEnvsCurrentStatusById,
    getExecEnvStatusStream
} from 'services/execution_environments_utils.js';
import { DeleteOutline, VisibilityOutlined } from '@material-ui/icons';
import { IconButton, Typography, Grid, Button } from '@material-ui/core';
import CustomSnackbar from '../CustomSnackbar';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
// import { UserInfoContext } from 'context/userInfoContent';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import CreateEnv from 'components/ExecutionEnvironment/ManageExecEnvironment/CreateEnv';
import UpdateEnv from 'components/ExecutionEnvironment/ManageExecEnvironment/UpdateEnv';
import {
    StyledTableCell,
    StyledTableRow
} from 'components/ExecutionEnvironment/Styles/ExecutionEnvStyles';
import CustomLoadMask from '../CustomLoadMask';
import SvgIcon from '@material-ui/core/SvgIcon';
import { ReactComponent as SuccessIcon } from 'assets/img/llm-workbench/success-indicator.svg';
import { ReactComponent as FailIcon } from 'assets/img/llm-workbench/fail-indicator.svg';
import { ReactComponent as InProgressIcon } from 'assets/img/llm-workbench/in-progress-indicator.svg';
import ExecutionEnvironmentStatus from 'components/ExecutionEnvironment/Status/ExecutionEnvironmentStatus';
// import useEventSource from 'hooks/useEventSource';
import {
    proressStatusPercentage,
    progressStatusText,
    statusText
} from 'constants/execution-workbench';

import * as _ from 'underscore';
import { execEnvTitle } from 'constants/execution-workbench';
import ExecutionEnvironmentContext from 'components/ExecutionEnvironment/context/ExecutionEnvironmentContext';
import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';

function ExecEnv(props) {
    const execEnvContext = useContext(ExecutionEnvironmentContext);
    const execEnvContextData = execEnvContext.data;
    const { createNewEnv, browseEnv } = execEnvContextData;
    const { envTypes } = createNewEnv;
    // const { connect, disconnect } = useEventSource();
    const { classes, showExecEnvListOnly, allowEnvCreation, disableBackIcon, projectId } = props;
    const [state, setState] = useState({
        rowsPerPage: 10,
        page: 0,
        statusWinOpen: false,
        snackbar: {
            open: false
        },
        open: false,
        showCreateNewEnv: false,
        currentExecEnvStatus: 'Initialized',
        currentExecEnvStatusPercentage: 10,
        showSuccessIcon: false,
        isRefreshDisabled: false
    });

    const statusIcons = {
        'creating environment': (
            <SvgIcon style={{ marginRight: '0.5rem', fontSize: '1.8rem' }}>
                <InProgressIcon />
            </SvgIcon>
        ),
        initialized: (
            <SvgIcon style={{ marginRight: '0.5rem', fontSize: '1.8rem' }}>
                <InProgressIcon />
            </SvgIcon>
        ),
        initializing: (
            <SvgIcon style={{ marginRight: '0.5rem', fontSize: '1.8rem' }}>
                <InProgressIcon />
            </SvgIcon>
        ),
        'initialized update': (
            <SvgIcon style={{ marginRight: '0.5rem', fontSize: '1.8rem' }}>
                <InProgressIcon />
            </SvgIcon>
        ),
        'generating artifact': (
            <SvgIcon style={{ marginRight: '0.5rem', fontSize: '1.8rem' }}>
                <InProgressIcon />
            </SvgIcon>
        ),
        inprogress: (
            <SvgIcon style={{ marginRight: '0.5rem', fontSize: '1.8rem' }}>
                <InProgressIcon />
            </SvgIcon>
        ),

        failed: (
            <SvgIcon style={{ marginRight: '0.5rem', fontSize: '1.8rem' }}>
                <FailIcon />
            </SvgIcon>
        ),

        running: (
            <SvgIcon style={{ marginRight: '0.5rem', fontSize: '1.8rem' }}>
                <SuccessIcon />
            </SvgIcon>
        )
    };

    useEffect(() => {
        fetchDynamicExecEnvList();
    }, []);

    const fetchDynamicExecEnvList = () => {
        getExecEnvs({
            callback: onResponseGetDynamicExecEnvs,
            env_category: allowEnvCreation === true ? 'ds_workbench' : 'uiac_executor',
            projectId
        });
    };

    const onResponseGetDynamicExecEnvs = (response_data, status = 'success') => {
        if (status === 'error') {
            setSnackbarStatus('Failed to load execution environments', 'error');
        } else {
            let packageLists = [];
            let uniquePackages = new Set();
            let dynamicExecEnvsList = _.map(response_data, function (item) {
                item.packages.map((pkg, index) => {
                    if (!uniquePackages.has(pkg.name)) {
                        uniquePackages.add(pkg.name);
                        pkg.id = index + 1;
                        packageLists.push(pkg);
                        return pkg;
                    } else {
                        pkg.id = item.packages.length + 1;
                    }
                });

                return {
                    id: item.id,
                    name: item.name,
                    requirements: item.requirements,
                    py_version: item.run_time_version,
                    runTime: item.run_time,
                    runTimeVersion: item.run_time_version,
                    packages: item.packages,
                    status: item.status || '',
                    replicas: 1,
                    env_category: item.env_category,
                    compute_type: item.compute_type,
                    env_type: item.env_type,
                    indexUrl: item.index_url
                };
            });
            let disableCreateNewBtnFlg = false;

            if (allowEnvCreation === true && dynamicExecEnvsList.length > 0) {
                disableCreateNewBtnFlg = true;
            }

            execEnvContext.updateContext({
                mainExecEnvLoading: false,
                packageLists,
                dynamicExecEnvs: dynamicExecEnvsList,
                currentEnvScreen: allowEnvCreation === true ? 'ds_workbench' : 'uiac_executor',
                ds_project_id: allowEnvCreation === true ? projectId : null,
                allowEnvCreationFromDS: allowEnvCreation === true,
                disableCreateNewBtn: disableCreateNewBtnFlg,
                browseEnv: {
                    ...browseEnv,
                    defaultEnv: dynamicExecEnvsList[0]
                }
            });
        }
    };

    const deleteExecEnvAction = (execEnvId) => {
        deleteExecEnv({
            execEnvDeleteId: execEnvId,
            callback: onResponseDeleteExecEnv
        });
    };

    const onResponseDeleteExecEnv = (status = 'success', responseData) => {
        if (status === 'error') {
            const errorMsg =
                responseData.response?.data?.error || 'Failed to Delete Execution Environment';
            setSnackbarStatus(errorMsg, 'error');
        } else {
            setSnackbarStatus('Deleted environment successfully');
            _.delay(
                () => {
                    refreshData();
                },
                1000,
                ''
            );
        }
    };

    const setSnackbarStatus = (message, severity = 'success') => {
        execEnvContext.updateContext({
            mainExecEnvLoading: false,
            snackbar: {
                open: true,
                message: message,
                severity: severity
            }
        });
    };

    const refreshData = () => {
        setState((prevState) => ({
            ...prevState,
            functions: false
        }));
        fetchDynamicExecEnvList();
    };

    const handleChangePage = (event, newPage) => {
        setState((prevState) => ({
            ...prevState,
            page: newPage
        }));
    };

    const handleChangeRowsPerPage = (event) => {
        setState((prevState) => ({
            ...prevState,
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0
        }));
    };

    const viewStatus = (value, row) => {
        setState((prevState) => ({
            ...prevState,
            statusWinOpen: value,
            currentExecEnvStatus: row.status,
            showSuccessIcon: false,
            currentSelectedRow: row,
            currentExecEnvStatusPercentage: proressStatusPercentage[row.status.toLowerCase()] || 40
        }));
    };
    const viewStatusHandler = (value, row) => {
        startConnection(row.id);
        viewStatus(value, row);
    };
    const stopConnection = useCallback(() => {
        // disconnect();
    }, []);

    const startConnection = useCallback((eventId) => {
        getExecEnvStatusStream({
            id: eventId,
            callback: handleUpdate
        });

        // if (eventId) {
        //     stopConnection();
        //     connect(
        //         `${
        //             import.meta.env['REACT_APP_DEE_ENV_BASE_URL']
        //         }/dynamic-execution-environment/execution-environments/${eventId}/stream-status`,
        //         {
        //             onMessage: handleUpdate,
        //             onFreeze: () => {
        //                 fallbackHandler(eventId);
        //             },
        //             interval: 5000
        //         }
        //     );
        // }
    }, []);

    // const fallbackHandler = useCallback(async (eventId) => {
    //     const envDetails = await getExecEnvsStatusById(eventId);
    //     handleUpdate(envDetails, false);
    // }, []);

    const reFreshStatus = (eventId) => {
        setState((prevState) => ({
            ...prevState,
            isRefreshDisabled: true
        }));
        getExecEnvsCurrentStatusById({
            callback: (response_data, status = 'success') => {
                if (status === 'error') {
                    setState((prevState) => ({
                        ...prevState,
                        isRefreshDisabled: false
                    }));
                } else {
                    const resStatus = response_data.status;
                    const resStatusLower = response_data.status.toLowerCase();
                    let showStatusWin = true;
                    if (
                        resStatusLower === 'completed' ||
                        resStatusLower == 'failed' ||
                        resStatusLower === 'running'
                    ) {
                        showStatusWin = false;
                        _.delay(
                            () => {
                                refreshData();
                            },
                            1000,
                            ''
                        );
                    }
                    setState((prevState) => ({
                        ...prevState,
                        currentExecEnvStatus: resStatus,
                        isRefreshDisabled: false,
                        statusWinOpen: showStatusWin,
                        currentExecEnvStatusPercentage:
                            proressStatusPercentage[resStatus.toLowerCase()] || 40
                    }));
                }
            },
            envId: eventId
        });
    };

    const handleUpdate = (e, parse = true) => {
        if (e.data) {
            let data = parse ? JSON.parse(e.data) : e.data;
            let status = data.status.toLowerCase();
            if (status !== 'eoc') {
                status = statusText[status].toLowerCase();
            }
            switch (status) {
                case 'completed':
                case 'running':
                case 'failed': {
                    setState((prevState) => ({
                        ...prevState,
                        currentExecEnvStatus: data.status,
                        showSuccessIcon: true,
                        currentExecEnvStatusPercentage:
                            proressStatusPercentage[data.status.toLowerCase()] || 40
                    }));
                    stopConnection();
                    _.delay(
                        () => {
                            setState((prevState) => ({
                                ...prevState,
                                statusWinOpen: false
                            }));
                            refreshData();
                        },
                        1000,
                        ''
                    );
                    break;
                }
                case 'eoc': {
                    stopConnection();
                    break;
                }
                default: {
                    setState((prevState) => ({
                        ...prevState,
                        currentExecEnvStatus: data.status,
                        currentExecEnvStatusPercentage:
                            proressStatusPercentage[data.status.toLowerCase()] || 40
                    }));
                }
            }
        }
    };

    const createNewEnvBtnClick = () => {
        execEnvContext.updateContext({
            loadMaskMsg: 'Fetching package List...',
            showCreateNewEnv: true,
            execEnvName: '',
            error_in_name: true,
            isListLoading: true,
            execEnvWinMessage: '',
            disableCreateExecEnvBtn: true,
            allowEnvCreationFromDS: allowEnvCreation === true,
            packageError: false,
            ds_project_id: allowEnvCreation === true ? projectId : null,
            createNewEnv: {
                ...createNewEnv,
                execEnvWinMessage: '',
                envTypes: {
                    ...envTypes,
                    currentEnv: 'shared_env',
                    // allowEnvCreation === true ? 'dedicated_env' : 'shared_env',
                    [envTypes.currentEnv]: {
                        ...envTypes[envTypes.currentEnv],
                        envName: '',
                        indexUrl: '',
                        disableCreateEnvBtn: true,
                        execEnvWinMessage: ''
                    }
                }
            },
            details: {
                ...execEnvContextData.details,
                name: ''
            },
            browseEnv: {
                ...execEnvContextData.browseEnv,
                envTypes: {
                    ...execEnvContextData.browseEnv.envTypes,
                    [envTypes.currentEnv]: {
                        ...envTypes[envTypes.currentEnv],
                        cloneConfig: false
                    }
                }
            }
        });
    };

    const getTableBody = () => {
        const dynamicExecEnvs = execEnvContextData.dynamicExecEnvs;

        return (
            dynamicExecEnvs && (
                <TableBody>
                    {dynamicExecEnvs
                        .slice(
                            state.page * state.rowsPerPage,
                            state.page * state.rowsPerPage + state.rowsPerPage
                        )
                        .map((row) => (
                            <StyledTableRow key={row.name}>
                                <StyledTableCell>{row.name}</StyledTableCell>
                                <StyledTableCell>{row.py_version}</StyledTableCell>
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
                                    <IconButton
                                        aria-label="View Status"
                                        title="View Status"
                                        onClick={() => viewStatusHandler(true, row)}
                                        className={
                                            showExecEnvListOnly === true ||
                                            row.env_type === 'default'
                                                ? classes.disabledIcon
                                                : !progressStatusText.includes(
                                                      row.status.toLowerCase()
                                                  )
                                                ? clsx(classes.iconBtn, classes.disabledIcon)
                                                : classes.iconBtn
                                        }
                                        disabled={
                                            showExecEnvListOnly === true ||
                                            row.env_type === 'default'
                                                ? true
                                                : !progressStatusText.includes(
                                                      row.status.toLowerCase()
                                                  )
                                        }
                                    >
                                        <VisibilityOutlined fontSize="large" />
                                    </IconButton>
                                    <UpdateEnv
                                        createNewDynamicExecEnv={false}
                                        dynamicExecEnv={row}
                                        refreshExecEnvList={refreshData}
                                        parentCmp={{ state, setState }}
                                        fetchDynamicExecEnvList={fetchDynamicExecEnvList}
                                        disabled={
                                            showExecEnvListOnly === true ||
                                            row.env_type === 'default'
                                                ? true
                                                : progressStatusText.includes(
                                                      row.status.toLowerCase()
                                                  )
                                        }
                                    />
                                    <ConfirmPopup
                                        title={<span>Delete Environment</span>}
                                        subTitle={
                                            <>
                                                Are you sure you want to Delete <b>{row.name}</b> ?
                                            </>
                                        }
                                        cancelText="No"
                                        confirmText="Yes"
                                        onConfirm={(e) => {
                                            e.stopPropagation();
                                            deleteExecEnvAction(row.id);
                                        }}
                                    >
                                        {(triggerConfirm) => (
                                            <IconButton
                                                key={'Delete Execution Environment'}
                                                title="Delete Execution Environment"
                                                onClick={triggerConfirm}
                                                aria-label="delete_execution_environment"
                                                className={
                                                    showExecEnvListOnly === true ||
                                                    row.env_type === 'default'
                                                        ? classes.disabledIcon
                                                        : progressStatusText.includes(
                                                              row.status.toLowerCase()
                                                          )
                                                        ? clsx(
                                                              classes.iconBtn,
                                                              classes.disabledIcon
                                                          )
                                                        : classes.iconBtn
                                                }
                                                disabled={
                                                    showExecEnvListOnly === true ||
                                                    row.env_type === 'default'
                                                        ? true
                                                        : progressStatusText.includes(
                                                              row.status.toLowerCase()
                                                          )
                                                }
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
                        ))}
                </TableBody>
            )
        );
    };

    return (
        <React.Fragment>
            {execEnvContextData.mainExecEnvLoading ? (
                <CustomLoadMask loadMaskMsg={execEnvContextData.mainExecEnvLoadMask} />
            ) : (
                <React.Fragment>
                    {execEnvContextData.showCreateNewEnv ? (
                        <CreateEnv
                            isSetOpen={true}
                            createNewDynamicExecEnv={true}
                            parentCmp={{ state, setState }}
                            fetchDynamicExecEnvList={fetchDynamicExecEnvList}
                            dynamicExecEnv={state}
                        />
                    ) : (
                        <div className={classes.main} key={1}>
                            <Grid
                                item
                                sx={12}
                                md={12}
                                style={{
                                    paddingLeft: '2.5rem',
                                    paddingRight: '2.5rem',
                                    marginBottom: '2rem'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div
                                        id="go-back-link-container"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: 'white'
                                        }}
                                    >
                                        {!disableBackIcon && (
                                            <Link
                                                to={'/platform-utils'}
                                                aria-label="platform-utils"
                                            >
                                                <ArrowBackIosRoundedIcon
                                                    fontSize="large"
                                                    className={classes.backIcon}
                                                />
                                            </Link>
                                        )}
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
                                                className={clsx(
                                                    classes.fontSize2,
                                                    classes.fontColor
                                                )}
                                            >
                                                {execEnvTitle}
                                            </Typography>
                                        </div>
                                    </div>

                                    <div id="cta-buttons">
                                        {!execEnvContextData.disableCreateNewBtn && (
                                            <Button
                                                key={2}
                                                variant="outlined"
                                                className={classes.createNewButton}
                                                onClick={createNewEnvBtnClick}
                                                disabled={showExecEnvListOnly}
                                                startIcon={
                                                    <AddCircleOutlineOutlinedIcon
                                                        className={
                                                            showExecEnvListOnly
                                                                ? classes.disabledIcon
                                                                : ''
                                                        }
                                                        disabled={showExecEnvListOnly}
                                                    />
                                                }
                                                aria-label="Create New Environment"
                                            >
                                                Create New Environment
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Grid>
                            <TableContainer component={Paper} className={classes.tableContainer}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Environment Name</StyledTableCell>
                                            <StyledTableCell>Python version</StyledTableCell>
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
                                count={
                                    execEnvContextData.dynamicExecEnvs.length
                                        ? execEnvContextData.dynamicExecEnvs.length
                                        : 1
                                }
                                rowsPerPage={state.rowsPerPage}
                                page={state.page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </div>
                    )}
                </React.Fragment>
            )}
            <CustomSnackbar
                open={execEnvContextData.snackbar.open}
                message={execEnvContextData.snackbar.message}
                autoHideDuration={5000}
                onClose={() => {
                    execEnvContext.updateContext({
                        snackbar: {
                            open: false
                        }
                    });
                }}
                severity={execEnvContextData.snackbar.severity}
            />
            <ExecutionEnvironmentStatus
                viewStatus={viewStatus}
                open={state.statusWinOpen}
                classes={classes}
                currentExecEnvStatus={state.currentExecEnvStatus}
                refreshData={refreshData}
                statusPercentage={state.currentExecEnvStatusPercentage}
                showSuccessIcon={state.showSuccessIcon}
                parentCmpState={state}
                reFreshStatus={reFreshStatus}
                isRefreshDisabled={state.isRefreshDisabled}
            />
        </React.Fragment>
    );
}

const styles = (theme) => ({
    main: {
        padding: '4rem'
    },
    createNew: {
        float: 'right',
        marginBottom: '2rem'
    },
    heading: {
        color: theme.palette.primary.contrastText
    },
    dialogHeading: {
        color: theme.palette.text.titleText,
        fontSize: '2.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8
    },
    tableContainer: {
        marginTop: theme.spacing(3),
        borderRadius: '5px',
        maxHeight: `calc(100vh - ${theme.layoutSpacing(360)})`,
        position: 'relative',
        border: `0.5px solid ${theme.palette.separator.tableContent}`
    },
    createNewButton: {
        float: 'right',
        '& svg': {
            fill: theme.palette.primary.contrastText + ' !important'
        }
    },
    circularProgress: {
        position: 'relative',
        display: 'inline-flex'
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
    disabledIcon: {
        opacity: '0.32'
    },
    dialogContentText: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem'
    },
    dialogContent: {
        paddingLeft: theme.layoutSpacing(44),
        paddingRight: theme.layoutSpacing(44),
        paddingTop: theme.layoutSpacing(10),
        overflowX: 'hidden',
        overflowY: 'auto'
    },
    dialogTitle: {
        fontSize: theme.spacing(2.5),
        letterSpacing: '0.094rem',
        color: theme.palette.primary.contrastText,
        opacity: '0.8'
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
    formBodyHeading: {
        marginBottom: '1.5rem'
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
    loadingMask: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '48.5%',
        left: '38%',
        zIndex: '1'
    },
    statusWindowDialog: {
        background: theme.palette.background.modelBackground,
        minHeight: '30vh',
        minWidth: '50vw'
    },
    closeIcon: {
        position: 'absolute',
        top: theme.layoutSpacing(12),
        right: 0,
        '& svg': {
            fill: `${theme.palette.icons.closeIcon}!important`
        }
    },
    progressBar: {
        borderRadius: '4px',
        '& .MuiLinearProgress-bar': {
            boxShadow: '0px 0px 1px 0px black inset',
            backgroundColor: theme.props?.mode === 'dark' ? '#FFB547' : '#6883F7'
        }
    },
    sepratorline: {
        border: `1px solid ${theme.palette.border.loginGrid}`,
        borderBottom: 'none',
        width: 'calc(100% - 32px)'
    },
    title: {
        margin: 0,
        background: theme.palette.background.modelBackground,
        padding: theme.layoutSpacing(20),
        '& .MuiTypography-h4': {
            color: theme.palette.text.titleText,
            fontSize: '2.5rem',
            letterSpacing: '0.1em',
            opacity: 0.8,
            fontFamily: theme.title.h1.fontFamily
        },
        display: 'flex',
        justifyContent: 'space-between'
    },
    execEnvSuccessIcon: {
        marginLeft: '9.5vw',
        width: '10rem',
        height: '10rem'
    },
    currentStatusTxt: {
        position: 'relative'
    },
    refreshIcon: {
        color: theme.palette.icons.closeIcon,
        fontSize: '3rem',
        position: 'absolute',
        marginLeft: '2rem',
        marginTop: '0.2rem',
        cursor: 'pointer'
    },
    refreshIconBtn: {
        '&:hover': {
            backgroundColor: 'transparent'
        }
    }
});

export default withStyles(styles)(ExecEnv);
