import React, { useCallback, useEffect, useState } from 'react';
import { getDashboardsList, getTemplatesList } from 'services/dashboard.js';
import ManageDashboards from './ManageDashboards.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getIndustries } from 'store/index';
import UtilsDataTable from './UtilsDataTable.jsx';
import UtilsNavigation from 'components/shared/platform-utils-nav-header/platform-utils-nav-header';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    actionsContainer: {
        display: 'flex',
        gap: '0rem',
        marginLeft: '-2rem'
    }
}));

const tableHeaderCells = [
    { id: 'order', label: 'Order', enableSorting: false, enableSearching: false },
    {
        id: 'id',
        label: 'Dashboard Id',
        enableSorting: true,
        enableSearching: true
    },
    { id: 'name', label: 'Dashboard Name', enableSorting: true, enableSearching: true },
    { id: 'url', label: 'Dashboard Url', enableSorting: true, enableSearching: false },
    { id: 'template', label: 'Template', enableSorting: false, enableSearching: false },
    { id: 'icon', label: 'Icon', enableSorting: false, enableSearching: false },
    { id: 'root', label: 'Root Industry', enableSorting: true, enableSearching: false },
    { id: 'actions', label: 'Actions', enableSorting: false, enableSearching: false }
];

function Dashboards() {
    const [state, setState] = useState({
        rowsPerPage: 10,
        page: 0,
        dashboards: [],
        industries: [],
        snackbar: {
            open: false
        },
        open: false,
        templates: [],
        templatesIdNameMapping: {},
        loading: false,
        searchId: '',
        seachValue: ''
    });

    const industryData = useSelector((st) => st.industryData.list);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchDashboardsList();
        fetchTemplatesList();
        if (industryData.length === 0) {
            dispatch(getIndustries({}));
        }
    }, []);

    const fetchDashboardsList = () => {
        setState((prevState) => ({
            ...prevState,
            dashboards: [],
            loading: true
        }));
        getDashboardsList({
            callback: onResponseGetDashboardsList
        });
    };

    const fetchTemplatesList = () => {
        setState((prevState) => ({
            ...prevState,
            templates: [],
            templatesIdNameMapping: {},
            loading: true
        }));
        getTemplatesList({
            callback: onResponseGetTemplatesList
        });
    };

    const getTemplateById = (id) => {
        return state.templatesIdNameMapping[id];
    };

    const getMaxValueOfOrder = () => {
        const dashboardsData = state.dashboards ? state.dashboards : 0;
        let orderValues = [];
        for (var i = 0; i < dashboardsData.length; i++) {
            orderValues.push(
                parseInt(dashboardsData[i].order != null ? dashboardsData[i].order : 0)
            );
        }
        orderValues.sort((a, b) => {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        });
        return orderValues[orderValues.length - 1];
    };

    const refreshData = () => {
        fetchDashboardsList();
    };

    const onResponseGetDashboardsList = (response_data) => {
        setState((prevState) => ({
            ...prevState,
            dashboards: response_data,
            loading: false
        }));
    };

    const onResponseGetTemplatesList = (response_data) => {
        const templatesIdNameMapping = {};

        response_data.forEach(({ id, name }) => {
            templatesIdNameMapping[id] = name;
        });

        setState((prevState) => ({
            ...prevState,
            templates: response_data,
            templatesIdNameMapping,
            loading: false
        }));
    };

    const onHandleSearch = (searchId, searchValue) => {
        setState((prevState) => ({
            ...prevState,
            searchId,
            searchValue
        }));
    };

    const classes = useStyles();

    const tableActions = (row) => {
        const maxOrderValue1 = getMaxValueOfOrder();
        return (
            <div className={classes.actionsContainer}>
                <ManageDashboards
                    createNewDashboards={false}
                    dashboard={row}
                    refreshDashboardList={refreshData}
                    orderValue={maxOrderValue1}
                    industriesData={industryData}
                    templatesData={state.templates}
                />
                <ManageDashboards
                    createNewDashboards={false}
                    delete={true}
                    dashboard={row}
                    refreshDashboardList={refreshData}
                    orderValue={maxOrderValue1}
                    industriesData={industryData}
                    templatesData={state.templates}
                />
            </div>
        );
    };

    const filterData = useCallback(() => {
        let count = 0;
        const processedData = state.dashboards
            .filter((dashboard) => {
                if (state.searchId && state.searchValue) {
                    let found = dashboard[state.searchId]
                        ? dashboard[state.searchId]
                              .toString()
                              .toLowerCase()
                              .includes(state.searchValue.toLowerCase())
                        : false;
                    if (found) {
                        count++;
                    }
                    return found;
                } else {
                    return dashboard;
                }
            })
            .slice(state.page * state.rowsPerPage, (state.page + 1) * state.rowsPerPage);
        return { data: processedData, count: count };
    }, [state.searchId, state.searchValue, state.page, state.rowsPerPage, state.dashboards]);

    const filteredData = filterData();
    const maxOrderValue = getMaxValueOfOrder();

    return (
        <>
            <UtilsNavigation
                path="/platform-utils"
                backTo="Platform Utils"
                title="Dashboards"
                actionButtons={
                    <ManageDashboards
                        createNewDashboards={true}
                        refreshDashboardList={refreshData}
                        orderValue={maxOrderValue}
                        industriesData={industryData}
                        templatesData={state.templates}
                    />
                }
            />
            <UtilsDataTable
                tableHeaderCells={tableHeaderCells}
                tableData={filteredData.data}
                getTemplateById={getTemplateById}
                tableActions={tableActions}
                page="dashboards"
                paginationInfo={{
                    page: state.page,
                    rowsPerPage: state.rowsPerPage,
                    totalCount:
                        state.searchId && state.searchValue
                            ? filteredData.count
                            : state.dashboards.length
                }}
                setStateInfo={setState}
                loader={state.loading}
                onHandleSearch={onHandleSearch}
                debounceDuration={100}
            />
        </>
    );
}

export default Dashboards;
