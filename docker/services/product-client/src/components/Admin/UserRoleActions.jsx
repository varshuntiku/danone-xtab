import React from 'react';
import {
    Button,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography
} from '@material-ui/core';
import CustomSnackbar from '../CustomSnackbar';
import { withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import CustomTextField from 'components/Forms/CustomTextField.jsx';
// import Checkbox from '@material-ui/core/Checkbox';
import CloseIcon from '../../assets/Icons/CloseBtn';
import { createUserRole, updateUserRole } from 'services/admin_users.js';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

import * as _ from 'underscore';

class UserRoleActions extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            open: false,
            snackbar: {
                open: false
            },
            details: {
                name: props.user_role?.name ? props.user_role.name : '',
                app_id: props.user_role?.app_id
                    ? props.user_role.app_id
                    : props.app_id
                    ? props.app_id
                    : '',
                permissions: props.user_role?.permissions ? props.user_role.permissions : []
            },
            app_user_role_id: props.user_role?.id ? props.user_role.id : false,
            inProgress: false
        };
    }

    setOpen = (value) => {
        this.setState({
            open: value
        });
    };

    submit = async () => {
        try {
            this.setState({ inProgress: true });
            if (this.props.createNewUserRole) {
                await createUserRole({
                    payload: this.state.details,
                    callback: this.onResponseCreateUserRole
                });
            } else {
                await updateUserRole({
                    payload: this.state.details,
                    app_user_role_id: this.state.app_user_role_id,
                    callback: this.onResponseCreateUserRole
                });
            }
        } catch (error) {
            this.handleUpdateResponse(error.response?.data?.error || error.message, 'error');
        } finally {
            setTimeout(() => this.setState({ inProgress: false }), 200);
        }
    };

    onResponseCreateUserRole = () => {
        const props = this.props;

        this.handleUpdateResponse(
            props.createNewUserRole ? 'Created Successfully' : 'Updated Successfully'
        );
        this.setOpen(false);

        this.setState({
            details: {
                name: props.user_role?.name ? props.user_role.name : '',
                app_id: props.user_role?.app_id
                    ? props.user_role.app_id
                    : props.app_id
                    ? props.app_id
                    : '',
                permissions: props.user_role?.permissions ? props.user_role.permissions : []
            },
            app_user_role_id: props.user_role?.id ? props.user_role.id : false
        });

        _.delay(
            () => {
                this.props.refreshData();
            },
            2000,
            ''
        );
    };

    handleUpdateResponse = (message, severity = 'success') => {
        this.setState((prevState) => ({
            snackbar: {
                ...prevState.snackbar,
                open: true,
                message: message,
                severity: severity
            }
        }));
    };

    onHandleFieldChange = (field_id, field_value) => {
        var details = this.state.details;

        details[field_id] = field_value;

        this.setState({
            details: details
        });
    };

    render() {
        const { classes /*, app_id*/, app_modules, createNewUserRole } = this.props;
        const { name, permissions } = this.state.details;
        const requiredFilledUp = name && permissions?.length;
        const inProgress = this.state.inProgress;
        return [
            !createNewUserRole && (
                <IconButton
                    key={1}
                    title="Manage User Role"
                    onClick={() => {
                        this.setOpen(true);
                    }}
                    aria-label="Edit"
                >
                    <EditOutlinedIcon fontSize="large" />
                </IconButton>
            ),
            createNewUserRole && (
                <Button
                    key={2}
                    variant="outlined"
                    className={classes.createNewButton}
                    onClick={() => {
                        this.setOpen(true);
                    }}
                    startIcon={<AddCircleOutlineOutlinedIcon />}
                    aria-label="Create new"
                >
                    Create New
                </Button>
            ),
            <Dialog
                key={3}
                open={this.state.open}
                fullWidth
                classes={{
                    paper: classes.dialogPaper
                }}
                maxWidth="sm"
                onClose={() => {
                    this.setOpen(false);
                }}
                aria-labelledby={createNewUserRole ? 'Create New User Role' : 'Edit User Role'}
                aria-describedby="user-role-content"
            >
                <DialogTitle
                    className={classes.dialogTitle}
                    disableTypography
                    id={createNewUserRole ? 'Create New User Role' : 'Edit User Role'}
                >
                    <Typography variant="h4" className={classes.heading}>
                        {createNewUserRole ? 'Create New User Role' : 'Edit User Role'}
                    </Typography>
                    <IconButton
                        title="Close"
                        onClick={() => {
                            this.setOpen(false);
                        }}
                        style={{ position: 'absolute', top: '4px', right: 0 }}
                        className={classes.actionIcon}
                        aria-label="Close"
                    >
                        <CloseIcon fontSize="large" />
                    </IconButton>
                </DialogTitle>
                <hr className={classes.sepratorLine} />
                <DialogContent id="user-role-content" className={classes.dailogContent}>
                    <Grid key="form-body" container spacing={2}>
                        <Grid item xs>
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Role Name',
                                    id: 'name',
                                    fullWidth: true,
                                    value: this.state.details.name
                                }}
                            />
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Permissions / Access to screens',
                                    id: 'permissions',
                                    fullWidth: true,
                                    is_select: true,
                                    options: _.map(app_modules, function (app_module) {
                                        return {
                                            value: 'app_screen_' + app_module.id,
                                            label: app_module.screen_name
                                        };
                                    }),
                                    selectProps: {
                                        multiple: true,
                                        value: this.state.details.permissions
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                    ,
                </DialogContent>
                <DialogActions className={classes.dialogAction}>
                    <Button
                        className={classes.btn}
                        variant="outlined"
                        onClick={() => {
                            this.setOpen(false);
                        }}
                        aria-label="Cancel"
                    >
                        Cancel
                    </Button>
                    <Button
                        className={classes.btn}
                        variant="contained"
                        onClick={this.submit}
                        disabled={!requiredFilledUp || inProgress}
                        aria-label="Save"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>,
            <CustomSnackbar
                key={4}
                open={this.state.snackbar.open}
                message={this.state.snackbar.message}
                autoHideDuration={2000}
                onClose={() => {
                    this.setState({
                        snackbar: {
                            open: false
                        }
                    });
                }}
                severity={this.state.snackbar.severity}
            />
        ];
    }
}

const styles = (theme) => ({
    paper: {
        background: theme.palette.primary.main
    },

    createNewButton: {
        float: 'right',
        margin: theme.spacing(2, 2),
        '& svg': {
            fill: theme.palette.primary.contrastText + ' !important'
        }
    },
    heading: {
        color: theme.palette.text.titleText,
        fontSize: '2.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8
    }
});

export default withStyles(
    (theme) => ({
        ...styles(theme),
        ...customFormStyle(theme)
    }),
    { withTheme: true }
)(UserRoleActions);
