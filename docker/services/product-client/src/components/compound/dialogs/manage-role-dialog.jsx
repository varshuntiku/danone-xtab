import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    Checkbox
} from '@material-ui/core';
import CloseIcon from '../../../assets/Icons/CloseBtn';
import { withStyles } from '@material-ui/core/styles';
import CustomSnackbar from 'components/CustomSnackbar';
import { getRoleById, createRole, updateRole, deleteRole } from 'services/role';
import manageRoleDialogStyles from './styles';
import TextInput from 'components/elements/input/text/text-input';
import ConfirmPopup from '../../confirmPopup/ConfirmPopup';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';

const ManageRoleDialog = ({
    isEdit,
    roleId,
    showDialog,
    setShowDialog,
    reloadData,
    permissions,
    classes
}) => {
    const [permissionRoleMap, setPermissionRoleMap] = useState({});
    const [role, setRole] = useState(null);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [severity, setSeverity] = useState('success');

    useEffect(() => {
        if (!showDialog) {
            setRole({
                name: '',
                permissions: []
            });
            setPermissionRoleMap({});
        }
    }, [showDialog]);

    useEffect(() => {
        loadRoleData();
    }, [roleId]);

    const loadRoleData = async () => {
        setPermissionRoleMap({});
        setLoading(true);
        if (isEdit && roleId) {
            let _permissionRoleMap = {};
            try {
                const { data } = await getRoleById(roleId);
                data?.permissions.forEach((permission) => {
                    _permissionRoleMap[permission] = true;
                });
                setRole(data);
                setPermissionRoleMap(_permissionRoleMap);
            } catch (error) {
                setSnackbarMessage(error.response?.data?.error || 'Failed to load data.Try again!');
                setSeverity('error');
                setShowSnackbar(true);
            }
        } else {
            setRole({
                name: '',
                permissions: []
            });
        }
        setLoading(false);
    };

    const submit = async () => {
        const permissionMap = {};
        const _permissions = [];
        permissions.map((permission) => {
            permissionMap[permission.name] = permission;
        });
        Object.keys(permissionRoleMap).forEach((permissionRole) => {
            if (permissionRoleMap[permissionRole]) {
                _permissions.push(permissionMap[permissionRole].id);
            }
        });
        const payload = { permissions: _permissions, name: role.name };
        try {
            if (isEdit) {
                await updateRole(roleId, payload);
                setSnackbarMessage('Role updated successfully');
            } else {
                await createRole(payload);
                setSnackbarMessage('Role created successfully');
            }
            setSeverity('success');
            setShowSnackbar(true);
        } catch (error) {
            setSnackbarMessage(error.response?.data?.error || 'Opertaion failed!');
            setSeverity('error');
            setShowSnackbar(true);
            return;
        }
        setShowDialog((prevState) => ({
            ...prevState,
            showDialog: false
        }));
        reloadData();
    };
    const cancel = () => {
        setShowDialog((prevState) => ({
            ...prevState,
            showDialog: false
        }));
    };

    const deleteRoleAction = async () => {
        if (!isEdit) return;
        try {
            await deleteRole(roleId);
            setSnackbarMessage('Role deleted successfully');
            setSeverity('success');
            setShowSnackbar(true);
        } catch (error) {
            setSnackbarMessage('Opertaion failed!');
            setSeverity('error');
            setShowSnackbar(true);
            return;
        }
        setShowDialog((prevState) => ({
            ...prevState,
            showDialog: false
        }));
        reloadData();
    };

    const updatePermission = ({ target }) => {
        const tag = target.getAttribute('data-tag-name');
        if (tag === 'permission-checkbox') {
            const permission = target.getAttribute('data-permission-name');
            const { checked } = target;
            setPermissionRoleMap({
                ...permissionRoleMap,
                [permission]: checked
            });
        }
    };

    return [
        <Dialog
            key={1}
            open={showDialog}
            fullWidth
            maxWidth="md"
            classes={{ paper: classes.paper }}
            aria-labelledby={isEdit ? 'manage-role' : 'create-role'}
            aria-describedby="role-content"
        >
            <DialogTitle
                className={classes.title}
                disableTypography
                id={isEdit ? 'manage-role' : 'create-role'}
            >
                {isEdit ? (
                    <Typography variant="h4" className={classes.heading}>
                        Manage Role
                    </Typography>
                ) : (
                    <Typography variant="h4" className={classes.heading}>
                        Create New Role
                    </Typography>
                )}
                <IconButton
                    title="Close"
                    onClick={() => {
                        setShowDialog((prevState) => ({
                            ...prevState,
                            showDialog: false
                        }));
                    }}
                    className={classes.closeIcon}
                    aria-label="Close"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <hr className={classes.sepratorLine} />
            <DialogContent id="role-content" className={classes.dialogContent}>
                {loading ? (
                    <div className={classes.loaderContainer}>
                        <CodxCircularLoader size={60} center />
                    </div>
                ) : (
                    <React.Fragment>
                        <div className={classes.textField}>
                            <TextInput
                                value={role.name}
                                onChange={(e) => setRole({ ...role, name: e.target.value })}
                                inputProps={{
                                    'aria-label': 'role-name'
                                }}
                                label="Role Name"
                            />
                        </div>
                        <Typography className={classes.subHeading} variant="h5">
                            Permissions
                        </Typography>
                        <div onClick={updatePermission}>
                            {permissions.map((permission) => (
                                <span key={permission.name} className={classes.listItem}>
                                    <Checkbox
                                        checked={permissionRoleMap[permission.name]}
                                        disabled={role?.user_role_type === 'SYSTEM'}
                                        className={classes.checkBox}
                                        inputProps={{
                                            'data-tag-name': 'permission-checkbox',
                                            'data-permission-name': permission.name,
                                            'aria-label': `permission-${permission.name.toLowerCase()}`
                                        }}
                                    />{' '}
                                    <Typography variant="h5" className={classes.permissionLabel}>
                                        {permission.name.replace(/_/g, ' ').toLowerCase()}
                                    </Typography>
                                </span>
                            ))}
                        </div>
                    </React.Fragment>
                )}
            </DialogContent>
            <DialogActions className={classes.dialogAction}>
                {isEdit && (
                    <ConfirmPopup
                        onConfirm={deleteRoleAction}
                        title="Delete User Role"
                        subTitle="Are you sure you want to delete the user role?"
                        warningMessage="This role will no longer be available for use"
                        cancelText="Cancel"
                        confirmText="Delete"
                    >
                        {(triggerConfirm) => (
                            <Button
                                className={classes.btn}
                                variant="contained"
                                onClick={triggerConfirm}
                                disabled={loading}
                                color="secondary"
                                aria-label="Delete"
                            >
                                Delete
                            </Button>
                        )}
                    </ConfirmPopup>
                )}
                <Button
                    className={classes.btn}
                    variant="outlined"
                    onClick={cancel}
                    aria-label="Cancel"
                >
                    Cancel
                </Button>
                <Button
                    className={classes.btn}
                    variant="contained"
                    onClick={submit}
                    disabled={loading || !role?.name}
                    aria-label="Save"
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>,
        <CustomSnackbar
            key={2}
            open={showSnackbar}
            message={snackbarMessage}
            autoHideDuration={2000}
            onClose={() => {
                setShowSnackbar(false);
            }}
            severity={severity}
        />
    ];
};

export default withStyles(manageRoleDialogStyles, { withTheme: true })(ManageRoleDialog);
