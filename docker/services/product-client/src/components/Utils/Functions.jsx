import React, { useCallback, useEffect, useState } from 'react';
import ManageFunctions from './ManageFunctions';
import { useDispatch, useSelector } from 'react-redux';
import { getIndustries, getFunctions } from 'store/index';
import UtilsDataTable from './UtilsDataTable';
import UtilsNavigation from 'components/shared/platform-utils-nav-header/platform-utils-nav-header';

const tableHeaderCells = [
    { id: 'order', label: 'Order', enableSorting: false, enableSearching: false },
    { id: 'function_name', label: 'Function Name', enableSorting: true, enableSearching: true },
    {
        id: 'parent_function_name',
        label: 'Parent Function Name',
        enableSorting: true,
        enableSearching: true
    },
    {
        id: 'industry_name',
        label: 'Associated Industry',
        enableSorting: true,
        enableSearching: true
    },
    { id: 'logo_name', label: 'Logo Name', enableSorting: true, enableSearching: true },
    { id: 'description', label: 'Description', enableSorting: true, enableSearching: true },
    { id: 'actions', label: 'Actions', enableSorting: false, enableSearching: false }
];

function Functions() {
    const [state, setState] = useState({
        rowsPerPage: 10,
        page: 0,
        snackbar: {
            open: false
        },
        loading: false,
        searchId: '',
        searchValue: ''
    });

    const industryData = useSelector((st) => st.industryData.list);
    const functions = useSelector((st) => st.functionData.list);
    const disptach = useDispatch();

    useEffect(() => {
        if (industryData.length === 0) {
            disptach(getIndustries({}));
        }
        if (functions.length === 0) {
            disptach(getFunctions({}));
        }
    }, []);

    const getMaxValueOfOrder = () => {
        const functionsData = functions ? functions : 0;
        let orderValues = [];
        for (let i = 0; i < functionsData.length; i++) {
            orderValues.push(parseInt(functionsData[i].order != null ? functionsData[i].order : 0));
        }
        orderValues.sort((a, b) => {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        });
        return orderValues[orderValues.length - 1];
    };

    const onHandleSearch = (searchId, searchValue) => {
        setState((prevState) => ({
            ...prevState,
            searchId,
            searchValue
        }));
    };

    const tableActions = (row) => {
        const maxOrderValue1 = getMaxValueOfOrder();
        return (
            <>
                <ManageFunctions
                    createNewFunction={false}
                    function={row}
                    orderValue={maxOrderValue1}
                    functionsData={functions}
                    industriesData={industryData}
                    key={row.function_id}
                />
                {/* <IconButton key={2} title="delete function" onClick={() => this.openDialog(row.function_id)}><DeleteOutline fontSize="large" style={{ "color": "red" }} /></IconButton> */}
            </>
        );
    };

    const filterData = useCallback(() => {
        let count = 0;
        const processedData = functions
            .filter((func) => {
                if (state.searchId && state.searchValue) {
                    let found = func[state.searchId]
                        ? func[state.searchId]
                              .toString()
                              .toLowerCase()
                              .includes(state.searchValue.toLowerCase())
                        : false;
                    if (found) {
                        count++;
                    }
                    return found;
                } else {
                    return func;
                }
            })
            .slice(state.page * state.rowsPerPage, (state.page + 1) * state.rowsPerPage);
        return { data: processedData, count: count };
    }, [state.searchId, state.searchValue, state.page, state.rowsPerPage, functions, industryData]);

    const maxOrderValue = getMaxValueOfOrder();
    const filteredData = filterData();

    return (
        <>
            <UtilsNavigation
                path="/platform-utils"
                backTo="Platform Utils"
                title="Functions"
                actionButtons={
                    <ManageFunctions
                        createNewFunction={true}
                        orderValue={maxOrderValue}
                        functionsData={functions}
                        industriesData={industryData}
                    />
                }
            />
            <UtilsDataTable
                tableHeaderCells={tableHeaderCells}
                tableData={filteredData.data}
                tableActions={tableActions}
                page="functions"
                paginationInfo={{
                    page: state.page,
                    rowsPerPage: state.rowsPerPage,
                    totalCount:
                        state.searchId && state.searchValue ? filteredData.count : functions.length
                }}
                setStateInfo={setState}
                loader={state.loading}
                onHandleSearch={onHandleSearch}
                debounceDuration={100}
            />
        </>
    );
}

export default Functions;
