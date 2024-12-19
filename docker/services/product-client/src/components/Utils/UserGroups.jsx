import React, { useState, useEffect, useCallback } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { getUserGroupsList } from '../../services/user_groups.js';
import { IconButton } from '@material-ui/core';
import CustomSnackbar from '../CustomSnackbar';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import {
    CheckCircleOutlined,
    EditOutlined,
    AddCircleOutlineOutlined,
    BlockOutlined,
    DeleteOutline
} from '@material-ui/icons';
import ManageUserGroups from './ManageUserGroups';
import { green, red } from '@material-ui/core/colors';
import UtilsDataTable from './UtilsDataTable';

const useStyles = makeStyles((theme) => ({
    fontSize5: {
        fontSize: '1.5rem',
        letterSpacing: '0.07rem'
    },
    disabledIconStyle: {
        opacity: '40%'
    },
    iconEditBtn: {
        padding: '12px 6px',
        '& .MuiSvgIcon-root': {
            color: `${theme.palette.icons.closeIcon} !important`
        }
    }
}));

const tableHeaderCells = [
    { id: 'name', label: 'Name', enableSorting: true, enableSearching: true },
    { id: 'user_group_type', label: 'Type', enableSorting: true, enableSearching: false },
    { id: 'app', label: 'App', enableSorting: false, enableSearching: false },
    { id: 'case_studies', label: 'Case Studies', enableSorting: false, enableSearching: false },
    {
        id: 'my_projects_only',
        label: 'My Projects Only',
        enableSorting: false,
        enableSearching: false
    },
    { id: 'my_projects', label: 'My Projects', enableSorting: false, enableSearching: false },
    { id: 'all_projects', label: 'All Projects', enableSorting: false, enableSearching: false },
    { id: 'widget_factory', label: 'Widget Factory', enableSorting: false, enableSearching: false },
    { id: 'environments', label: 'Environments', enableSorting: false, enableSearching: false },
    { id: 'app_publish', label: 'Publish', enableSorting: false, enableSearching: false },
    { id: 'rbac', label: 'Access', enableSorting: false, enableSearching: false },
    { id: 'actions', label: 'Actions', enableSorting: false, enableSearching: false }
];

const UserGroups = (props) => {
    const classes = useStyles();
    const superUserAccess = props?.userPermissions?.rbac || false;
    const [state, setState] = useState({
        userGroups: [],
        snackbar: {
            open: false
        },
        loader: false,
        groupCount: 0,
        rowsPerPage: 10,
        page: 0,
        searchValue: '',
        searchId: '',
        userModal: { show: false }
    });

    const fetchUserGroups = async () => {
        setState((prevState) => ({
            ...prevState,
            loader: true
        }));
        getUserGroupsList()
            .then((res) => {
                setState((prevState) => ({
                    ...prevState,
                    userGroups: res,
                    groupCount: res.length,
                    loader: false
                }));
            })
            .catch(() => {
                setState((prevState) => ({
                    ...prevState,
                    loader: false,
                    snackbar: {
                        ...prevState.snackbar,
                        open: true,
                        message: `Error Fetching user Group!Please try again`,
                        severity: 'error'
                    }
                }));
            });
    };

    const handleModalClose = () => {
        setState((prevState) => ({ ...prevState, userModal: { show: false } }));
    };

    useEffect(() => {
        const actionButtons = superUserAccess ? (
            <Tooltip
                title={
                    <Typography
                        variant="subtitle2"
                        className={clsx(classes.fontSize5, classes.fontColor)}
                    >
                        Create New User
                    </Typography>
                }
            >
                <Button
                    variant="contained"
                    component="label"
                    className={classes.createNewButton}
                    startIcon={<AddCircleOutlineOutlined className={classes.iconColor} />}
                    onClick={() => {
                        setState((prevState) => ({
                            ...prevState,
                            userModal: { show: true, data: null, mode: 'create' }
                        }));
                    }}
                    disabled={!superUserAccess}
                    aria-label="Create new user group"
                    data-testid="create-new-button"
                >
                    Create New
                </Button>
            </Tooltip>
        ) : (
            <></>
        );
        props.setActionButtons(actionButtons);
        fetchUserGroups();
    }, []);

    const refreshData = () => {
        setState((prevState) => ({
            ...prevState,
            userGroups: []
        }));
        fetchUserGroups();
    };

    const onHandleSearch = (searchId, searchValue) => {
        setState((prevState) => ({
            ...prevState,
            searchId,
            searchValue
        }));
    };

    const renderBooleanIcons = (val) => {
        if (val) {
            return <CheckCircleOutlined fontSize="large" style={{ color: green[500] }} />;
        } else {
            return <BlockOutlined fontSize="large" style={{ color: red[500] }} />;
        }
    };

    const tableActions = (row) => (
        <div>
            <IconButton
                title={superUserAccess ? 'Edit' : 'Disabled'}
                disabled={!superUserAccess}
                classes={{
                    disabled: classes.disabledIconStyle
                }}
                onClick={() => {
                    setState((prevState) => ({
                        ...prevState,
                        userModal: { show: true, data: row, mode: 'edit' }
                    }));
                }}
                className={classes.iconEditBtn}
                data-testid="edit-icon"
                aria-label={superUserAccess ? 'Delete User Group' : 'Disabled'}
            >
                <EditOutlined fontSize="large" data-testid="edit-icon" />
            </IconButton>
            <IconButton
                title={superUserAccess ? 'Delete User Group' : 'Disabled'}
                disabled={!superUserAccess}
                classes={{
                    disabled: classes.disabledIconStyle
                }}
                onClick={() => {
                    setState((prevState) => ({
                        ...prevState,
                        userModal: { show: true, data: row, mode: 'delete' }
                    }));
                }}
                aria-label={superUserAccess ? 'Delete User Group' : 'Disabled'}
            >
                <DeleteOutline fontSize="large" style={{ color: 'red' }} />
            </IconButton>
        </div>
    );

    const filterData = useCallback(() => {
        let count = 0;
        const processedData = state.userGroups
            .filter((userGroup) => {
                if (state.searchId && state.searchValue) {
                    let found = userGroup[state.searchId]
                        ? userGroup[state.searchId]
                              .toString()
                              .toLowerCase()
                              .includes(state.searchValue.toLowerCase())
                        : false;
                    if (found) {
                        count++;
                    }
                    return found;
                } else {
                    return userGroup;
                }
            })
            .slice(state.page * state.rowsPerPage, (state.page + 1) * state.rowsPerPage);
        return { data: processedData, count: count };
    }, [state.searchId, state.searchValue, state.page, state.rowsPerPage, state.userGroups]);

    const filteredData = filterData();

    return (
        <>
            <UtilsDataTable
                tableHeaderCells={tableHeaderCells}
                tableData={filteredData.data}
                tableActions={tableActions}
                renderBooleanIcons={renderBooleanIcons}
                page="userGroups"
                paginationInfo={{
                    page: state.page,
                    rowsPerPage: state.rowsPerPage,
                    totalCount:
                        state.searchId && state.searchValue ? filteredData.count : state.groupCount
                }}
                setStateInfo={setState}
                loader={state.loader}
                onHandleSearch={onHandleSearch}
            />
            {state.userModal.show && (
                <ManageUserGroups
                    open={state.userModal.show}
                    userGroupData={state?.userModal.data}
                    refreshUserGroupList={refreshData}
                    manageMode={state?.userModal.mode}
                    handleModalClose={handleModalClose}
                    setSnackbar={setState}
                />
            )}
            <CustomSnackbar
                open={state.snackbar.open}
                message={state.snackbar.message}
                autoHideDuration={2000}
                onClose={() =>
                    setState((prevState) => ({ ...prevState, snackbar: { open: false } }))
                }
                severity={state.snackbar.severity}
            />
        </>
    );
};

export default UserGroups;
