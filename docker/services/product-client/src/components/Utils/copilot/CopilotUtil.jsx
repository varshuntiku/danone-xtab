import React, { Fragment, useCallback, useEffect, useState } from 'react';
import UtilsDataTable from '../UtilsDataTable.jsx';
import UtilsNavigation from 'components/shared/platform-utils-nav-header/platform-utils-nav-header';
import { ManageCopilotApplication } from './EditCopilotApplication.jsx';
import {
    deleteCopilotApplication,
    getCopilotApplications
} from 'services/copilotServices/copilot_app.js';
import CustomSnackbar from 'components/CustomSnackbar.jsx';

const tableHeaderCells = [
    {
        id: 'name',
        label: 'Ask NucliOS Application Name',
        enableSorting: true,
        enableSearching: true
    },
    { id: 'desc', label: 'Application Description', enableSorting: false, enableSearching: false },
    { id: 'actions', label: 'Actions', enableSorting: false, enableSearching: false }
];

export default function CopilotUtil(props) {
    const [state, setState] = useState({
        rowsPerPage: 10,
        page: 0,
        open: false,
        searchId: '',
        searchValue: '',
        loading: false
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });

    const [copilotApps, setCopilotApps] = useState([]);

    useEffect(() => {
        fetchCopilotApps();
    }, []);

    const fetchCopilotApps = () => {
        getCopilotApplications({
            callback: onResponseGetApps
        });
    };

    const onResponseGetApps = (response_data) => {
        setCopilotApps([...response_data]);
    };

    const onHandleSearch = (searchId, searchValue) => {
        setState((prevState) => ({
            ...prevState,
            searchId,
            searchValue
        }));
    };

    const onDeleteCopilotApplication = async (id) => {
        try {
            await deleteCopilotApplication(id);
            setSnackbar({
                open: true,
                message: 'Application removed successfully!',
                severity: 'success'
            });
            fetchCopilotApps();
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Failed to remove Application!',
                severity: 'error'
            });
        }
    };

    const tableActions = (row) => {
        return (
            <Fragment>
                <ManageCopilotApplication
                    copilotAppId={row.id}
                    copilotAppName={row.name}
                    onDeleteCopilotApplication={onDeleteCopilotApplication}
                    {...props}
                />
            </Fragment>
        );
    };

    const filterData = useCallback(() => {
        let count = 0;
        const processedData = copilotApps
            .filter((app) => {
                if (state.searchId && state.searchValue) {
                    let found = app[state.searchId]
                        ? app[state.searchId]
                              .toString()
                              .toLowerCase()
                              .includes(state.searchValue.toLowerCase())
                        : false;
                    if (found) {
                        count++;
                    }
                    return found;
                } else {
                    return app;
                }
            })
            .slice(state.page * state.rowsPerPage, (state.page + 1) * state.rowsPerPage);
        return { data: processedData, count: count };
    }, [state.searchId, state.searchValue, state.page, state.rowsPerPage, copilotApps]);

    const filteredData = filterData();

    return (
        <>
            <UtilsNavigation
                path="/platform-utils"
                backTo="Platform Utils"
                title="Ask NucliOS Applications"
                actionButtons={<ManageCopilotApplication history={props.history} />}
            />
            <UtilsDataTable
                tableHeaderCells={tableHeaderCells}
                tableData={filteredData.data}
                tableActions={tableActions}
                page="copilot"
                paginationInfo={{
                    page: state.page,
                    rowsPerPage: state.rowsPerPage,
                    totalCount:
                        state.searchId && state.searchValue
                            ? filteredData.count
                            : copilotApps.length
                }}
                setStateInfo={setState}
                loader={state.loading}
                onHandleSearch={onHandleSearch}
                debounceDuration={100}
            />
            <CustomSnackbar
                key="application-snackbar"
                open={snackbar.open}
                message={snackbar.message}
                onClose={() => {
                    setSnackbar({ open: false });
                }}
                severity={snackbar.severity}
            />
        </>
    );
}
