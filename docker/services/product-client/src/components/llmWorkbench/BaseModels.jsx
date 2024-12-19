import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'components/llmWorkbench/DataTable';
import { Box, IconButton, SvgIcon, makeStyles } from '@material-ui/core';
import { debouncedGetTableHeader } from 'services/llmWorkbench/llm-workbench';
import CustomSnackbar from 'components/CustomSnackbar';
import { getBaseModels, setBaseModelsHeaders, resetBaseModelList } from 'store';
import { ReactComponent as DeployIcon } from 'assets/img/llm-deployment.svg';

const useStyles = makeStyles((theme) => ({
    tableActions: {
        padding: '1.5rem',
        color: theme.palette.primary.contrastText,
        '&.Mui-disabled': {
            cursor: 'not-allowed',
            pointerEvents: 'auto',
            '& svg': {
                cursor: 'not-allowed',
                pointerEvents: 'auto',
                color: theme.palette.border.dashboard,
                fontSize: '3rem'
            }
        }
    }
}));

export default function BaseModels({ ...props }) {
    const dispatch = useDispatch();
    const {
        loading,
        baseModel: { data, total, headers }
    } = useSelector((state) => state.llmWorkbench);
    const [searchInfo, setSearchInfo] = useState({ searchId: '', searchValue: '' });
    const [notification, setNotification] = useState();
    const [notificationOpen, setNotificationOpen] = useState();
    const [paginationInfo, setPaginationInfo] = useState({
        page: 0,
        rowsPerPage: 10
    });

    const fetchAndSetBaseModels = useCallback(async () => {
        try {
            if (!headers) {
                const _headers = await debouncedGetTableHeader('base');
                dispatch(setBaseModelsHeaders(_headers));
            }
            dispatch(
                getBaseModels({
                    size: paginationInfo?.rowsPerPage,
                    page: paginationInfo?.page,
                    search: searchInfo?.searchValue
                })
            );
        } catch (error) {
            setNotificationOpen(true);
            setNotification(() => ({
                message: error?.message || 'Failed to load base models! Please try again',
                severity: 'error'
            }));
        }
    }, [paginationInfo, searchInfo?.searchValue]);

    useEffect(() => {
        fetchAndSetBaseModels();
    }, [paginationInfo.rowsPerPage, paginationInfo.page, searchInfo?.searchValue]);

    useEffect(() => {
        return () => {
            dispatch(resetBaseModelList());
        };
    }, []);

    const classes = useStyles();
    const handleDeploy = useCallback((name) => {
        const encodedName = encodeURIComponent(name);
        if (encodedName) props.history.push(`/llmworkbench/models/${encodedName}/deploy`);
    }, []);

    const tableActions = (r) => (
        <Box display="flex">
            <IconButton
                aria-label="deploy model"
                title="Deploy model"
                className={classes.tableActions}
                onClick={() => handleDeploy(r.id)}
            >
                <SvgIcon fontSize="large">
                    <DeployIcon />
                </SvgIcon>
            </IconButton>
        </Box>
    );

    const onHandleSearch = (searchId, searchValue) => {
        setSearchInfo((prevState) => ({
            ...prevState,
            searchId,
            searchValue
        }));
    };

    return (
        <>
            <DataTable
                tableHeaderCells={headers}
                tableData={data}
                tableActions={tableActions}
                searchId={searchInfo.searchId}
                searchValue={searchInfo.searchValue}
                setStateInfo={setPaginationInfo}
                onHandleSearch={onHandleSearch}
                page="llmworkbench"
                paginationInfo={{
                    page: paginationInfo.page,
                    rowsPerPage: paginationInfo.rowsPerPage,
                    totalCount: total
                }}
                loader={loading}
            />
            <CustomSnackbar
                open={notificationOpen && notification?.message}
                autoHideDuration={3000}
                onClose={setNotificationOpen.bind(null, false)}
                severity={notification?.severity || 'success'}
                message={notification?.message}
            />
        </>
    );
}
