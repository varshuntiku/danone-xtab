import React, { useContext, useEffect, useState } from 'react';
import { getAllApps } from 'services/dashboard.js';
import ManageApplications from './ManageApplications';
import CloneApplication from './CloneApplication';
import { UserInfoContext } from 'context/userInfoContent';
import { editAppdetails } from 'services/app.js';
import CustomSnackbar from 'components/CustomSnackbar';
import { useDispatch, useSelector } from 'react-redux';
import { getIndustries, getFunctions } from 'store/index';
import UtilsDataTable from './UtilsDataTable';
import UtilsNavigation from 'components/shared/platform-utils-nav-header/platform-utils-nav-header';
import { Switch } from '@material-ui/core';
import ManageDsApplications from 'components/dsWorkbench/Applications/ManageDsApplications';
import DeleteApplications from 'components/dsWorkbench/Applications/DeleteApplications';
import AddAppPopup from 'components/screenActionsComponent/actionComponents/AddAppPopup';
import { getProject } from 'services/project';

const tableHeaderCells = [
    { id: 'orderby', label: 'Order', enableSorting: false, enableSearching: false },
    { id: 'id', label: 'App Id', enableSorting: true, enableSearching: false },
    { id: 'name', label: 'Application Name', enableSorting: true, enableSearching: true },
    { id: 'environment', label: 'Version', enableSorting: true, enableSearching: true },
    { id: 'industry_id', label: 'Industry', enableSorting: false, enableSearching: false },
    { id: 'function_id', label: 'Function', enableSorting: false, enableSearching: false },
    { id: 'description', label: 'Description', enableSorting: false, enableSearching: true },
    {
        id: 'nac_collaboration',
        label: 'Collaboration',
        enableSorting: false,
        enableSearching: false
    },
    {
        id: 'is_connected_systems_app',
        label: 'Connected Systems',
        enableSorting: false,
        enableSearching: false
    },
    { id: 'actions', label: 'Actions', enableSorting: false, enableSearching: false }
];

function Applications(props) {
    const {
        isDsWorkbench,
        dsAppConfig,
        projectId,
        user_permissions,
        classes,
        setProjectDetailsState,
        setNotification,
        setNotificationOpen
    } = props;
    const [state, setState] = useState({
        apps: [],
        snackbar: {
            open: false
        },
        loader: false,
        appsCount: 0,
        rowsPerPage: 10,
        page: 0,
        searchValue: '',
        searchId: '',
        curentProjectId: null
    });

    const industryData = useSelector((st) => st.industryData.list);
    const functionsData = useSelector((st) => st.functionData.list);
    const dispatch = useDispatch();
    const [dswTableHeaderCells, setDswTableHeaderCells] = useState(tableHeaderCells);

    const userInfoContext = useContext(UserInfoContext);

    useEffect(() => {
        fetchIndustriesList();
        fetchFunctionsList();
    }, []);

    useEffect(() => {
        if (!isDsWorkbench) {
            fetchApplicationsList();
        } else {
            if (isDsWorkbench && !user_permissions?.app_publish) {
                setDswTableHeaderCells((prevState) =>
                    prevState.filter((item) => item.id !== 'actions')
                );
            }
            if (projectId) {
                setState((prevState) => ({
                    ...prevState,
                    curentProjectId: projectId
                }));
                loadProjectData(projectId);
            }
        }
    }, [state.rowsPerPage, state.page, state.searchValue, state.searchId]);

    const loadProjectData = async (projectId) => {
        setState((prevState) => ({
            ...prevState,
            loader: true
        }));
        try {
            const projectData = await getProject(projectId);
            setProjectDetailsState((prevState) => ({
                ...prevState,
                projectData
            }));
            const projectConfig = {
                project_id: projectData.id
            };
            fetchApplicationsList(projectConfig);
        } catch (err) {
            setNotification({
                message: err.response?.data?.error || 'Failed to load project. Try again.',
                severity: 'error'
            });
            setNotificationOpen(true);
        }
    };

    const fetchApplicationsList = async (projectConfig) => {
        try {
            setState((prevState) => ({
                ...prevState,
                loader: true
            }));
            const payloadData = {
                pageSize: state.rowsPerPage,
                page: state.page,
                ...(state.searchValue
                    ? {
                          filtered: {
                              id: state.searchId,
                              value: state.searchValue
                          }
                      }
                    : { filtered: {} })
            };
            const payload = {
                page: payloadData.page,
                pageSize: payloadData.pageSize,
                filtered: Object.keys(payloadData.filtered).length
                    ? JSON.stringify(payloadData.filtered)
                    : null
            };
            if (projectConfig) {
                payload['project_id'] = projectConfig.project_id;
            }
            await getAllApps({
                industry: decodeURIComponent('CPG'),
                payload: payload,
                callback: onResponseGetApps
            });
        } catch (error) {
            setState((prevState) => ({
                ...prevState,
                loader: false,
                snackbar: {
                    ...prevState.snackbar,
                    message: error?.message || 'Failed to fetch Applications. Try again',
                    severity: 'error',
                    open: true
                }
            }));
        }
    };

    const fetchFunctionsList = () => {
        if (functionsData.length === 0) {
            dispatch(getFunctions({}));
        }
    };

    const fetchIndustriesList = () => {
        if (industryData.length === 0) {
            dispatch(getIndustries({}));
        }
    };

    const refreshData = () => {
        setState((prevState) => ({
            ...prevState,
            apps: [],
            searchValue: '',
            loader: true
        }));
        if (state.curentProjectId) {
            fetchApplicationsList({ project_id: state.curentProjectId });
        } else {
            fetchApplicationsList();
        }
    };

    const onResponseGetApps = (response_data) => {
        setState((prevState) => ({
            ...prevState,
            apps: response_data.data,
            appsCount: response_data.count,
            loader: false
        }));
    };

    const onHandleSearch = (searchId, searchValue) => {
        setState((prevState) => ({
            ...prevState,
            searchId,
            searchValue
        }));
    };

    const handleToggle = (e, application, flagName) => {
        try {
            const messageHead =
                flagName === 'nac_collaboration' ? 'Collaboration' : 'Connected Systems link';
            editAppdetails({
                app_id: application.id,
                payload: {
                    ...application,
                    [flagName]: e.target.checked
                },
                callback: () => {
                    setState((prevState) => ({
                        ...prevState,
                        snackbar: {
                            ...prevState.snackbar,
                            message: `${messageHead} updated for ${application.name}`,
                            severity: 'success',
                            open: true
                        }
                    }));
                    if (state.curentProjectId) {
                        fetchApplicationsList({ project_id: state.curentProjectId });
                    } else {
                        fetchApplicationsList();
                    }
                }
            });
        } catch (error) {
            this.setState((prevState) => ({
                ...prevState,
                snackbar: {
                    ...prevState.snackbar,
                    message: error,
                    severity: 'error',
                    open: true
                },
                loader: false
            }));
        }
    };

    const getIndustryById = (id) => {
        const industry = industryData.filter((industry) => industry.id === id)[0];
        return industry ? industry : {};
    };

    const getFunctionById = (id) => {
        const func = functionsData?.filter((func) => func.function_id === id)[0];
        return func ? func : {};
    };

    const tableActions = (row) => (
        <>
            {isDsWorkbench ? (
                <>
                    {user_permissions?.app_publish && (
                        <>
                            {' '}
                            <ManageDsApplications
                                dsAppConfig={dsAppConfig}
                                projectId={projectId}
                                row={row}
                            />
                            <DeleteApplications
                                dsAppConfig={dsAppConfig}
                                projectId={projectId}
                                row={row}
                                setNotification={setNotification}
                                setNotificationOpen={setNotificationOpen}
                                fetchApplicationsList={fetchApplicationsList}
                            />
                        </>
                    )}
                </>
            ) : (
                <>
                    {' '}
                    {userInfoContext?.nac_roles?.length > 0
                        ? userInfoContext?.nac_roles[0].permissions.find(
                              (permission) => permission.name === 'CLONING_OF_APPLICATION'
                          ) &&
                          functionsData.length && (
                              <CloneApplication
                                  appId={row.id}
                                  iconOnly
                                  functionList={functionsData}
                              />
                          )
                        : null}
                    <ManageApplications
                        changeApplicationData={true}
                        application={row}
                        refreshApplicationsList={refreshData}
                        functionsData={functionsData}
                        industriesData={industryData}
                    />
                </>
            )}
        </>
    );

    const getSwitch = (row, flagName) => (
        <Switch
            size="small"
            checked={!!row[flagName]}
            inputProps={{ 'aria-label': `switch-app-${row.id != null ? row.id : 0}` }}
            onChange={(e) => handleToggle(e, row, flagName)}
        />
    );

    return (
        <>
            <UtilsNavigation
                path="/platform-utils"
                backTo="Platform Utils"
                title="Applications"
                actionButtons={
                    isDsWorkbench ? (
                        <>
                            {user_permissions?.app_publish && (
                                <AddAppPopup
                                    classes={classes}
                                    user_permissions={user_permissions}
                                    isDsWorkbench={isDsWorkbench}
                                    dsAppConfig={dsAppConfig}
                                ></AddAppPopup>
                            )}
                        </>
                    ) : (
                        <></>
                    )
                }
                isDsWorkbench={isDsWorkbench}
            />
            <UtilsDataTable
                tableHeaderCells={isDsWorkbench ? dswTableHeaderCells : tableHeaderCells}
                tableData={state.apps}
                tableActions={tableActions}
                getSwitch={getSwitch}
                getFunctionById={getFunctionById}
                getIndustryById={getIndustryById}
                page="applications"
                paginationInfo={{
                    page: state.page,
                    rowsPerPage: state.rowsPerPage,
                    totalCount: state.appsCount
                }}
                searchId={state.searchId}
                searchValue={state.searchValue}
                setStateInfo={setState}
                loader={state.loader}
                onHandleSearch={onHandleSearch}
                isDsWorkbench={isDsWorkbench}
                dsAppConfig={dsAppConfig}
            />
            <CustomSnackbar
                open={state.snackbar.open}
                autoHideDuration={2000}
                onClose={() =>
                    setState((prevState) => ({
                        ...prevState,
                        snackbar: { ...prevState.snackbar, open: false }
                    }))
                }
                severity={state.snackbar?.severity || 'success'}
                message={state.snackbar?.message}
            />
        </>
    );
}

export default Applications;
