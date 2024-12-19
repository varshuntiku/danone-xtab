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
import { updatePlatformUser, createAppUser, updateAppUser } from 'services/admin_users.js';

import { Close } from '@material-ui/icons';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

import * as _ from 'underscore';

class UserActions extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            open: false,
            snackbar: {
                open: false
            },
            details: {
                first_name: props.user?.first_name ? props.user.first_name : '',
                last_name: props.user?.last_name ? props.user.last_name : '',
                email_address: props.user?.email_address ? props.user.email_address : '',
                user_roles: props.user?.user_roles
                    ? _.map(props.user.user_roles, function (user_role) {
                          return user_role.id;
                      })
                    : [],
                responsibilities: props.user?.responsibilities ? props.user.responsibilities : [],
                app_id: props.user?.app_id ? props.user.app_id : props.app_id ? props.app_id : '',
                is_restricted_user: true,
                password: ''
            },
            app_user_id: props.user?.id ? props.user.id : false,
            inProgress: false
        };
        this.formRef = React.createRef();
    }

    setOpen = (value) => {
        this.setState({
            open: value
        });
    };

    submit = async () => {
        try {
            this.setState({ inProgress: true });
            if (this.props.createNewUser) {
                await updatePlatformUser({
                    payload: { ...this.state.details, createNewUser: this.props.createNewUser },
                    callback: this.onResponseCreatePlatformUser
                });
            } else {
                await updatePlatformUser({
                    payload: this.state.details,
                    callback: this.onResponseUpdatePlatformUser
                });
            }
        } catch (error) {
            this.handleUpdateResponse('Failed to complete action. Please try again.', 'error');
            setTimeout(() => this.setState({ inProgress: false }), 200);
        }
    };

    onResponseCreatePlatformUser = async (response_data) => {
        if (response_data.status === 'error') {
            if (response_data.status_code === 409) {
                try {
                    this.setState({ inProgress: true });
                    await createAppUser({
                        payload: this.state.details,
                        callback: this.onResponseCreateUser
                    });
                } catch (err) {
                    this.handleUpdateResponse(err.response?.data?.error || err.message, 'error');
                } finally {
                    setTimeout(() => this.setState({ inProgress: false }), 200);
                }
            } else {
                //TODO
            }
        } else {
            try {
                this.setState({ inProgress: true });
                await createAppUser({
                    payload: this.state.details,
                    callback: this.onResponseCreateUser
                });
            } catch (err) {
                this.handleUpdateResponse(err.response?.data?.error || err.message, 'error');
            } finally {
                setTimeout(() => this.setState({ inProgress: false }), 200);
            }
        }
    };

    onResponseUpdatePlatformUser = async (response_data) => {
        try {
            this.setState({ inProgress: true });
            if (response_data.status === 'error') {
                if (response_data.status_code === 409) {
                    await updateAppUser({
                        payload: this.state.details,
                        app_user_id: this.state.app_user_id,
                        callback: this.onResponseCreateUser
                    });
                } else {
                    //TODO
                }
            } else {
                await updateAppUser({
                    payload: this.state.details,
                    app_user_id: this.state.app_user_id,
                    callback: this.onResponseCreateUser
                });
            }
        } catch (err) {
            this.handleUpdateResponse(err.response?.data?.error || err.message, 'error');
        } finally {
            setTimeout(() => this.setState({ inProgress: false }), 200);
        }
    };

    onResponseCreateUser = () => {
        const props = this.props;

        this.handleUpdateResponse(
            props.createNewUser ? 'Created Successfully' : 'Updated Successfully'
        );
        this.setOpen(false);

        this.setState({
            details: {
                first_name: props.user?.first_name ? props.user.first_name : '',
                last_name: props.user?.last_name ? props.user.last_name : '',
                email_address: props.user?.email_address ? props.user.email_address : '',
                password: '',
                user_roles: props.user?.user_roles ? props.user.user_roles : [],
                responsibilities: props.user?.responsibilities ? props.user.responsibilities : [],
                app_id: props.user?.app_id ? props.user.app_id : props.app_id ? props.app_id : ''
            },
            app_user_id: props.user?.id ? props.user.id : false
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
        const { classes, user_roles, responsibilities, createNewUser } = this.props;
        const {
            first_name,
            last_name,
            email_address,
            user_roles: entered_user_roles
        } = this.state.details;
        const inProgress = this.state.inProgress;
        let validEmailInput = true;
        if (email_address && this.formRef.current) {
            validEmailInput = this.formRef.current.email.validity.valid;
        }
        const requiredFilledUp =
            first_name &&
            last_name &&
            email_address &&
            entered_user_roles?.length &&
            validEmailInput;

        return [
            !createNewUser && (
                <IconButton
                    key={1}
                    title="Manage User"
                    onClick={() => {
                        this.setOpen(true);
                    }}
                    aria-label="Edit"
                >
                    <EditOutlinedIcon fontSize="large" />
                </IconButton>
            ),
            createNewUser && (
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
                maxWidth="md"
                onClose={() => {
                    this.setOpen(false);
                }}
                aria-labelledby={createNewUser ? 'Create New User' : 'Edit User'}
            >
                <DialogTitle
                    className={classes.title}
                    disableTypography
                    id={createNewUser ? 'Create New User' : 'Edit User'}
                >
                    <Typography variant="h4" className={classes.heading}>
                        {createNewUser ? 'Create New User' : 'Edit User'}
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
                        <Close fontSize="large" />
                    </IconButton>
                </DialogTitle>
                <Typography className={classes.adminTableSectionHeader} variant="h4">
                    User info
                </Typography>
                <DialogContent>
                    <form ref={this.formRef}>
                        <Grid key="form-body" container spacing={2}>
                            <Grid item xs>
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'First Name *',
                                        id: 'first_name',
                                        fullWidth: true,
                                        value: this.state.details.first_name
                                    }}
                                />
                            </Grid>
                            <Grid item xs>
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Last Name *',
                                        id: 'last_name',
                                        fullWidth: true,
                                        value: this.state.details.last_name
                                    }}
                                />
                            </Grid>
                            <Grid item xs>
                                <CustomTextField
                                    parent_obj={this}
                                    field_info={{
                                        label: 'Email ID *',
                                        id: 'email_address',
                                        fullWidth: true,
                                        value: this.state.details.email_address,
                                        error: !validEmailInput,
                                        inputProps: {
                                            type: 'email',
                                            name: 'email'
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <Typography className={classes.adminTableSectionHeader} variant="h4">
                    Roles & Responsibilities
                </Typography>
                <DialogContent>
                    <Grid key="form-body" container spacing={2}>
                        <Grid item xs>
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Roles *',
                                    id: 'user_roles',
                                    fullWidth: true,
                                    value: this.state.details.user_roles,
                                    is_select: true,
                                    options: user_roles,
                                    selectProps: {
                                        multiple: true,
                                        value: this.state.details.user_roles
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs>
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Responsibilities',
                                    id: 'responsibilities',
                                    fullWidth: true,
                                    value: this.state.details.responsibilities,
                                    is_select: true,
                                    options: responsibilities,
                                    selectProps: {
                                        multiple: true,
                                        value: this.state.details.responsibilities
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <Typography className={classes.adminTableSectionHeader} variant="h4">
                    Authentication
                </Typography>
                <DialogContent>
                    <Grid key="form-body" container spacing={2}>
                        <Grid item xs>
                            <CustomTextField
                                parent_obj={this}
                                field_info={{
                                    label: 'Password',
                                    id: 'password',
                                    fullWidth: true,
                                    value: this.state.details.password,
                                    helper_text: createNewUser
                                        ? 'Note: 1) If this field is left empty, password will not be set for this account. 2) If this user already exists with other access on Codx, their password will not be updated with this form. To update their password use the Edit User form after adding them to this application.'
                                        : 'Note: If this field is left empty, password will not be updated for this account. '
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions style={{ padding: '8px 24px 24px' }}>
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
)(UserActions);
