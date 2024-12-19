import React, { useCallback, useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, IconButton } from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import { getAllRoles, getAllPermissions } from 'services/role';
import ManageRoleDialog from 'components/compound/dialogs/manage-role-dialog';
import { UserInfoContext } from 'context/userInfoContent';
import UtilsDataTable from '../../../components/Utils/UtilsDataTable';
import UtilsNavigation from 'components/shared/platform-utils-nav-header/platform-utils-nav-header';
import CustomSnackbar from 'components/CustomSnackbar';

let tableHeaderCells = [
    {
        id: 'name',
        label: 'Role',
        enableSorting: true,
        enableSearching: true
    }
];

const useStyles = makeStyles((theme) => ({
    createNewButton: {},
    IconButton: {
        '&.Mui-disabled': {
            pointerEvents: 'initial',
            cursor: 'not-allowed',
            '& svg': {
                cursor: 'not-allowed',
                color: theme.palette.text.light
            }
        }
    }
}));

const RoleManagementPage = () => {
    const [state, setState] = useState({
        rowsPerPage: 10,
        page: 0,
        roles: [],
        permissions: [],
        snackbar: {},
        loading: false,
        searchId: '',
        searchValue: '',
        selectedRole: null,
        isEdit: false,
        showDialog: false,
        notificationOpen: false
    });
    const userInfoContext = useContext(UserInfoContext);

    const classes = useStyles();

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (!state.showDialog) {
            setState((prevState) => ({
                ...prevState,
                selectedRole: null
            }));
        }
    }, [state.showDialog]);

    const loadData = async () => {
        setState((prevState) => ({
            ...prevState,
            roles: [],
            permissions: [],
            loading: true
        }));
        try {
            const { data } = await getAllRoles();
            const { data: permissionData } = await getAllPermissions();

            tableHeaderCells = [
                {
                    id: 'name',
                    label: 'Role',
                    enableSorting: true,
                    enableSearching: true
                },
                ...permissionData.map((permission) => {
                    return {
                        id: permission.name,
                        label: permission.name.split('_').join(' ').toUpperCase(),
                        enableSorting: false,
                        enableSearching: false
                    };
                }),
                {
                    id: 'actions',
                    label: 'Actions',
                    enableSorting: false,
                    enableSearching: false
                }
            ];

            setState((prevState) => ({
                ...prevState,
                roles: data,
                permissions: permissionData,
                loading: false
            }));
        } catch (error) {
            setState((prevState) => ({
                ...prevState,
                notificationOpen: true,
                snackbar: {
                    message: error.response?.data?.error || 'Failed to load data. Please try again',
                    severity: 'error'
                },
                loading: false
            }));
        }
    };

    const showRoleDialog = ({ isEdit = false, role = null }) => {
        setState((prevState) => ({
            ...prevState,
            isEdit: isEdit,
            selectedRole: role,
            showDialog: true
        }));
    };

    const reloadData = async () => {
        setState((prevState) => ({
            ...prevState,
            roles: [],
            loading: true
        }));
        try {
            const { data } = await getAllRoles();

            setState((prevState) => ({
                ...prevState,
                roles: data,
                loading: false
            }));
        } catch (error) {
            setState((prevState) => ({
                ...prevState,
                notificationOpen: true,
                snackbar: {
                    message: 'Failed to load data.Try again!',
                    severity: 'error'
                }
            }));
        }
    };

    const onHandleSearch = (searchId, searchValue) => {
        setState((prevState) => ({
            ...prevState,
            searchId,
            searchValue
        }));
    };

    const tableActions = (row) => {
        return (
            <>
                <IconButton
                    title="Manage Role"
                    onClick={() => {
                        showRoleDialog({
                            isEdit: true,
                            role: row.id
                        });
                    }}
                    disabled={
                        !userInfoContext?.feature_access?.admin && row.user_role_type === 'SYSTEM'
                    }
                    className={classes.IconButton}
                    aria-label="Manage role"
                >
                    <EditOutlinedIcon fontSize="large" />
                </IconButton>
            </>
        );
    };

    const filterData = useCallback(() => {
        let count = 0;
        const processedData = state.roles
            .filter((role) => {
                if (state.searchId && state.searchValue) {
                    let found = role[state.searchId]
                        ? role[state.searchId]
                              .toString()
                              .toLowerCase()
                              .includes(state.searchValue.toLowerCase())
                        : false;
                    if (found) {
                        count++;
                    }
                    return found;
                } else {
                    return role;
                }
            })
            .slice(state.page * state.rowsPerPage, (state.page + 1) * state.rowsPerPage);
        return { data: processedData, count: count };
    }, [state.searchId, state.searchValue, state.page, state.rowsPerPage, state.roles]);

    const filteredData = filterData();

    return (
        <>
            <UtilsNavigation
                path="/platform-utils"
                backTo="Platform Utils"
                title="Solution Workbench Roles"
                actionButtons={
                    <Button
                        variant="contained"
                        className={classes.createNewButton}
                        onClick={showRoleDialog}
                        startIcon={<AddCircleOutlineOutlinedIcon />}
                        disabled={state.loading}
                        aria-label="Add Role"
                    >
                        Add Role
                    </Button>
                }
            />
            <UtilsDataTable
                tableHeaderCells={tableHeaderCells}
                tableData={filteredData.data}
                tableActions={tableActions}
                page="roles"
                paginationInfo={{
                    page: state.page,
                    rowsPerPage: state.rowsPerPage,
                    totalCount:
                        state.searchId && state.searchValue
                            ? filteredData.count
                            : state.roles.length
                }}
                setStateInfo={setState}
                loader={state.loading}
                onHandleSearch={onHandleSearch}
                debounceDuration={100}
            />
            <ManageRoleDialog
                isEdit={state.isEdit}
                roleId={state.selectedRole}
                showDialog={state.showDialog}
                setShowDialog={setState}
                reloadData={reloadData}
                permissions={state.permissions}
            />
            <CustomSnackbar
                open={state.notificationOpen && state.snackbar?.message}
                autoHideDuration={2000}
                onClose={() =>
                    setState((prevState) => ({
                        ...prevState,
                        notificationOpen: false
                    }))
                }
                severity={state.snackbar?.severity || 'success'}
                message={state.snackbar?.message}
            />
        </>
    );
};

export default RoleManagementPage;
