import React, { useState, useEffect, useCallback } from 'react';
import UtilsDataTable from './UtilsDataTable';
import { deleteInactiveUsers, getUsers } from 'services/dashboard';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { Button, Typography, makeStyles, Box } from '@material-ui/core';
import CodxPopupDialog from '../custom/CodxPoupDialog';
import CustomSnackbar from '../../components/CustomSnackbar.jsx';
import { alpha } from '@material-ui/core';

const dialogStyles = makeStyles((theme) => ({
    dialogContent: {
        border: 'none',
        marginTop: theme.spacing(5)
    },
    dialogRoot: {
        background: theme.palette.background.dialogTitle,
        display: 'flex',
        justifyContent: 'space-between'
    }
}));

const useStyles = makeStyles((theme) => ({
    uploadButton: {
        color: theme.palette.primary.dark,
        height: '4rem',
        fontSize: '0.75rem',
        width: 'auto'
    },
    iconColor: {
        color: theme.palette.primary.contrastText
    },
    font: {
        fontSize: theme.spacing(2)
    },
    dbClrMsg: {
        marginLeft: '3.2rem',
        marginRight: '3.2rem',
        height: '60%',
        // width:'100%',
        borderRadius: '0.8rem',
        background: theme.palette.primary.dark,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: theme.spacing(3),
        color: alpha(theme.palette.text.default, 0.3)
    }
}));

const ControlUsers = ({ setActionButtons, ...props }) => {
    const classes = useStyles();
    const dialogClasses = dialogStyles();
    const [inactiveUsers, setInactiveUsers] = useState([]);
    const [selectedUsers, setSlectedUsers] = useState([]);
    const [popupDialog, setPopupDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false });
    const [loading, setLoading] = useState(false);
    const superUserAccess = props?.userPermissions?.rbac || false;
    const [search, setSearch] = useState();
    const tableHeaderCells = [
        { id: 'first_name', label: 'First Name', enableSorting: false, enableSearching: true },
        { id: 'last_name', label: 'Last Name', enableSorting: false, enableSearching: false },
        {
            id: 'email_address',
            label: 'Email Address',
            enableSorting: false,
            enableSearching: false
        },
        { id: 'last_login', label: 'Last Login', enableSorting: false, enableSearching: false },
        { id: 'last_logout', label: 'Last Logout', enableSorting: false, enableSearching: false },
        { id: 'created_at', label: 'Created at', enableSorting: false, enableSearching: false }
    ];
    const fetchInactiveUsers = async () => {
        setLoading(true);
        const response = await getUsers({ user_type: 'inactive' });
        const users = response.data?.map((res) => ({
            ...res,
            last_login: res.last_login ? new Date(res.last_login).toLocaleDateString() : '--',
            last_logout: res.last_logout ? new Date(res.last_logout).toLocaleDateString() : '--',
            created_at: res.created_at ? new Date(res.created_at).toLocaleDateString() : '--'
        }));
        setLoading(false);
        setInactiveUsers(users);
    };
    const handleSelect = (id) => {
        setSlectedUsers((prevCheckedIds) =>
            prevCheckedIds?.includes(id)
                ? prevCheckedIds.filter((checkedId) => checkedId !== id)
                : [...prevCheckedIds, id]
        );
    };
    const deleteDisbable = selectedUsers.length === 0 || inactiveUsers.length === 0;
    const actionButtons = superUserAccess ? (
        <>
            <Button
                variant="contained"
                component="label"
                className={classes.uploadButton}
                startIcon={<DeleteOutlinedIcon className={classes.iconColor} />}
                onClick={() => setPopupDialog(true)}
                aria-label="Delete user(s)"
                disabled={deleteDisbable}
                selectedUsers={selectedUsers}
            >
                Delete User(s)
            </Button>
        </>
    ) : (
        <></>
    );

    const handleDelete = async () => {
        setPopupDialog(false);
        try {
            await deleteInactiveUsers({ user_ids: selectedUsers });
            setSlectedUsers([]);
            setSnackbar({
                message: 'User(s) deleted successfully!',
                open: true,
                severity: 'success'
            });
            fetchInactiveUsers();
        } catch (error) {
            setSnackbar({
                message: error.Error || 'Error deleting user(s). Try again!',
                open: true,
                severity: 'error'
            });
        }
    };
    const dialogContent = (
        <>
            <Typography className={classes.font}>
                Are you sure to delete all the selected users?
            </Typography>
        </>
    );
    const dialogActions = (
        <>
            <Button
                variant="outlined"
                onClick={() => setPopupDialog(false)}
                aria-label="Cancel Save"
            >
                No
            </Button>
            <Button variant="contained" onClick={() => handleDelete()} aria-label="Confirm Save">
                Yes
            </Button>
        </>
    );

    const processedData = useCallback(() => {
        const filteredUsers = inactiveUsers?.filter((user) => {
            if (search) {
                const ans = user?.first_name.toLowerCase().includes(search.toLowerCase());
                return ans;
            }
            return user;
        });
        return filteredUsers;
    }, [inactiveUsers, search]);

    const onHandleSearch = (_, value) => {
        setSearch(value);
    };
    const filteredData = processedData();
    useEffect(() => {
        fetchInactiveUsers();
    }, []);

    useEffect(() => {
        setActionButtons(actionButtons);
    }, [deleteDisbable]);

    if (!superUserAccess)
        return (
            <Box className={classes.dbClrMsg}>
                <Typography className={classes.text}>
                    You don not have access to this page
                </Typography>
            </Box>
        );
    else if (superUserAccess && inactiveUsers?.length === 0 && loading === false) {
        return (
            <Box className={classes.dbClrMsg}>
                <Typography className={classes.text}>
                    Your database is clear and only have active users
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <UtilsDataTable
                tableHeaderCells={tableHeaderCells}
                tableData={filteredData}
                hidePagination={true}
                page="Control users"
                paginationInfo={{
                    page: 0,
                    rowsPerPage: 5,
                    totalCount: 0
                }}
                loader={loading}
                selectedUsers={selectedUsers}
                onHandleSearch={onHandleSearch}
                onHandleSelect={handleSelect}
                caption={
                    !loading &&
                    'Note : These are list of users, who have not logged in once/for past 6 months.'
                }
            />
            <CodxPopupDialog
                open={popupDialog}
                setOpen={setPopupDialog}
                dialogTitle="Delete user(s)"
                dialogContent={dialogContent}
                dialogActions={dialogActions}
                maxWidth="xs"
                dialogClasses={dialogClasses}
                onClose={() => setPopupDialog(false)}
            />
            <CustomSnackbar
                message={snackbar.message}
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={() => {
                    setSnackbar({
                        open: false
                    });
                }}
                severity={snackbar.severity}
            />
        </>
    );
};

export default ControlUsers;
