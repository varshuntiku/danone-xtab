import React, { useCallback, useEffect, useState } from 'react';
import ManageIndustry from './ManageIndustry.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getIndustries } from 'store/index';
import UtilsDataTable from './UtilsDataTable.jsx';
import UtilsNavigation from 'components/shared/platform-utils-nav-header/platform-utils-nav-header';

const tableHeaderCells = [
    { id: 'industry_name', label: 'Industry Name', enableSorting: true, enableSearching: true },
    {
        id: 'parent_industry_name',
        label: 'Parent Industry Name',
        enableSorting: true,
        enableSearching: true
    },
    { id: 'logo_name', label: 'Logo Name', enableSorting: true, enableSearching: true },
    { id: 'order', label: 'Order', enableSorting: false, enableSearching: false },
    { id: 'horizon', label: 'Horizon', enableSorting: true, enableSearching: false },
    { id: 'actions', label: 'Actions', enableSorting: false, enableSearching: false }
];

function Industry() {
    const [state, setState] = useState({
        rowsPerPage: 10,
        page: 0,
        snackbar: {
            open: false
        },
        open: false,
        searchId: '',
        searchValue: '',
        loading: false
    });

    const { list: industryData, loading } = useSelector((st) => st.industryData);
    const disptach = useDispatch();

    useEffect(() => {
        if (industryData.length === 0) {
            disptach(getIndustries());
        }
    }, []);

    const getMaxValueOfOrder = () => {
        const industriesData = industryData ? industryData : 0;
        let orderValues = [];
        for (let i = 0; i < industriesData.length; i++) {
            orderValues.push(
                parseInt(industriesData[i].order != null ? industriesData[i].order : 0)
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
        disptach(getIndustries({}));
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
                <ManageIndustry
                    createNewIndustry={false}
                    industry={row}
                    refreshIndustryList={refreshData}
                    orderValue={maxOrderValue1}
                    industriesData={industryData}
                    key={row.id}
                />
                {/* <IconButton
                    key={2}
                    title="delete industry"
                    onClick={() => openDialog(row.id)}
                >
                    <DeleteOutline fontSize="large" style={{ color: 'red' }} />
                </IconButton> */}
            </>
        );
    };

    const filterData = useCallback(() => {
        let count = 0;
        const processedData = industryData
            .filter((industry) => {
                if (state.searchId && state.searchValue) {
                    let found = industry[state.searchId]
                        ? industry[state.searchId]
                              .toString()
                              .toLowerCase()
                              .includes(state.searchValue.toLowerCase())
                        : false;
                    if (found) {
                        count++;
                    }
                    return found;
                } else {
                    return industry;
                }
            })
            .slice(state.page * state.rowsPerPage, (state.page + 1) * state.rowsPerPage);
        return { data: processedData, count: count };
    }, [state.searchId, state.searchValue, state.page, state.rowsPerPage, industryData]);

    const filteredData = filterData();
    const maxOrderValue = getMaxValueOfOrder();

    return (
        <>
            <UtilsNavigation
                path="/platform-utils"
                backTo="Platform Utils"
                title="Industries"
                actionButtons={
                    <ManageIndustry
                        createNewIndustry={true}
                        refreshIndustryList={refreshData}
                        orderValue={maxOrderValue}
                        industriesData={industryData}
                    />
                }
            />
            <UtilsDataTable
                tableHeaderCells={tableHeaderCells}
                tableData={filteredData.data}
                tableActions={tableActions}
                page="industries"
                paginationInfo={{
                    page: state.page,
                    rowsPerPage: state.rowsPerPage,
                    totalCount:
                        state.searchId && state.searchValue
                            ? filteredData.count
                            : industryData.length
                }}
                setStateInfo={setState}
                loader={loading}
                onHandleSearch={onHandleSearch}
                debounceDuration={100}
            />
        </>
    );
}

export default Industry;
