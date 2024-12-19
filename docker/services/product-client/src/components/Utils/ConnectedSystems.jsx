import React, { useCallback, useEffect, useState } from 'react';
import { getConnectedSystems } from 'services/connectedSystem_v2.js';
import ManageConnectedSystems from './ManageConnectedSystems.jsx';
import UtilsDataTable from './UtilsDataTable.jsx';
import UtilsNavigation from 'components/shared/platform-utils-nav-header/platform-utils-nav-header';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
    actionsContainer: {
        display: 'flex',
        gap: '0rem',
        marginLeft: '-2rem'
    },
    booleanCheckIcon: {
        color: theme.palette.success.main
    },
    booleanClearIcon: {
        color: theme.palette.error.main
    }
}));

const tableHeaderCells = [
    {
        id: 'id',
        label: 'Conn System Id',
        enableSorting: true,
        enableSearching: true
    },
    { id: 'name', label: 'Dashboard Name', enableSorting: true, enableSearching: true },
    { id: 'industry', label: 'Industry', enableSorting: true, enableSearching: false },
    { id: 'function', label: 'Function', enableSorting: true, enableSearching: false },
    { id: 'is_active', label: 'Is Active', enableSorting: false, enableSearching: false },
    { id: 'created_at', label: 'Created At', enableSorting: false, enableSearching: false },
    { id: 'created_by_user', label: 'Created By', enableSorting: false, enableSearching: false },
    { id: 'updated_at', label: 'Updated At', enableSorting: false, enableSearching: false },
    { id: 'actions', label: 'Actions', enableSorting: false, enableSearching: false }
];

function ConnectedSystems() {
    const [state, setState] = useState({
        rowsPerPage: 10,
        page: 0,
        connectedSystems: [],
        snackbar: {
            open: false
        },
        open: false,
        loading: false,
        searchId: '',
        seachValue: ''
    });

    useEffect(() => {
        fetchConnectedSystems();
    }, []);

    const fetchConnectedSystems = () => {
        setState((prevState) => ({
            ...prevState,
            dashboards: [],
            loading: true
        }));
        getConnectedSystems({
            callback: onResponseGetConnectedSystems
        });
    };

    const refreshData = () => {
        fetchConnectedSystems();
    };

    const onResponseGetConnectedSystems = (response_data) => {
        setState((prevState) => ({
            ...prevState,
            connectedSystems: response_data,
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

    const getSwitch = (row, flagName) => {
        return row[flagName] ? (
            <CheckCircleIcon fontSize="large" className={classes.booleanCheckIcon} />
        ) : (
            <CancelIcon fontSize="large" className={classes.booleanClearIcon} />
        );
    };
    // <Switch
    //     size="small"
    //     checked={!!row[flagName]}
    //     inputProps={{ 'aria-label': `switch-conn-system-${row.id != null ? row.id : 0}` }}
    //     onChange={(e) => handleToggle(e, row, flagName)}
    // />

    const classes = useStyles();

    const tableActions = (row) => {
        return (
            <div className={classes.actionsContainer}>
                <ManageConnectedSystems
                    createNewConnectedSystems={false}
                    connectedSystem={row}
                    refreshConnectedSystemList={refreshData}
                />
                <ManageConnectedSystems
                    createNewConnectedSystems={false}
                    delete={true}
                    connectedSystem={row}
                    refreshConnectedSystemList={refreshData}
                />
            </div>
        );
    };

    const filterData = useCallback(() => {
        let count = 0;
        const processedData = state.connectedSystems
            .filter((connectedSystem) => {
                if (state.searchId && state.searchValue) {
                    let found = connectedSystem[state.searchId]
                        ? connectedSystem[state.searchId]
                              .toString()
                              .toLowerCase()
                              .includes(state.searchValue.toLowerCase())
                        : false;
                    if (found) {
                        count++;
                    }
                    return found;
                } else {
                    return connectedSystem;
                }
            })
            .slice(state.page * state.rowsPerPage, (state.page + 1) * state.rowsPerPage);
        return { data: processedData, count: count };
    }, [state.searchId, state.searchValue, state.page, state.rowsPerPage, state.connectedSystems]);

    const filteredData = filterData();

    return (
        <>
            <UtilsNavigation
                path="/platform-utils"
                backTo="Platform Utils"
                title="ConnectedSystems"
                actionButtons={
                    <ManageConnectedSystems
                        createNewConnectedSystems={true}
                        refreshConnectedSystemList={refreshData}
                    />
                }
            />
            <UtilsDataTable
                tableHeaderCells={tableHeaderCells}
                tableData={filteredData.data}
                tableActions={tableActions}
                getSwitch={getSwitch}
                page="connected-systems"
                paginationInfo={{
                    page: state.page,
                    rowsPerPage: state.rowsPerPage,
                    totalCount:
                        state.searchId && state.searchValue
                            ? filteredData.count
                            : state.connectedSystems.length
                }}
                setStateInfo={setState}
                loader={state.loading}
                onHandleSearch={onHandleSearch}
                debounceDuration={100}
            />
        </>
    );
}

export default ConnectedSystems;
