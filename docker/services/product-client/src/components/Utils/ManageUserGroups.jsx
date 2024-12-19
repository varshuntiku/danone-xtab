import React, { useState } from 'react';
import {
    Button,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    ThemeProvider,
    TextField,
    Switch
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import customFormStyle from 'assets/jss/customFormStyle.jsx';
import { createUserGroups, updateUserGroups, deleteUserGroups } from 'services/user_groups.js';
import CloseIcon from '../../assets/Icons/CloseBtn';
import { textCompTheme } from '../dynamic-form/inputFields/textInput';
import clsx from 'clsx';

import * as _ from 'underscore';

const styles = (theme) => ({
    paper: {
        background: theme.palette.background.modelBackground,
        backdropFilter: 'blur(2rem)',
        borderRadius: 0,
        border: 'none'
    },
    deletePaper: {
        background: theme.palette.background.modelBackground,
        width: '25%'
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
    },
    formFontStyle: {
        alignSelf: 'center'
    },
    fontSize4: {
        fontSize: '1.75rem',
        letterSpacing: '0.07rem'
    },
    fontColor: {
        color: theme.palette.text.default
    },
    title: {
        background: theme.palette.background.modelBackground,
        padding: theme.layoutSpacing(20),
        '& .MuiTypography-caption': {
            fontSize: '1.75rem'
        },
        display: 'flex',
        justifyContent: 'space-between',
        height: theme.layoutSpacing(76),
        alignItems: 'center',
        width: '100%'
    },
    dialogAction: {
        paddingBottom: theme.layoutSpacing(28),
        paddingTop: theme.layoutSpacing(48),
        paddingRight: theme.layoutSpacing(44)
    },
    sepratorline: {
        border: `1px solid ${theme.palette.border.loginGrid}`,
        borderBottom: 'none',
        width: 'calc(100% - 32px)'
    },
    closeIcon: {
        position: 'absolute',
        top: theme.layoutSpacing(12),
        right: 0,
        '& svg': {
            fill: `${theme.palette.icons.closeIcon}!important`
        }
    }
});

const ManageUserGroups = (props) => {
    const {
        userGroupData,
        manageMode,
        refreshUserGroupList,
        handleModalClose,
        open,
        classes,
        setSnackbar
    } = props;

    const initialiseUserGroup = () => {
        return {
            id: userGroupData?.id ? userGroupData?.id : null,
            name: userGroupData?.name ? userGroupData?.name : '',
            app: userGroupData?.app ? userGroupData?.app : false,
            case_studies: userGroupData?.case_studies ? userGroupData?.case_studies : false,
            my_projects_only: userGroupData?.my_projects_only
                ? userGroupData?.my_projects_only
                : false,
            my_projects: userGroupData?.my_projects ? userGroupData?.my_projects : false,
            all_projects: userGroupData?.all_projects ? userGroupData?.all_projects : false,
            widget_factory: userGroupData?.widget_factory ? userGroupData?.widget_factory : false,
            environments: userGroupData?.environments ? userGroupData?.environments : false,
            app_publish: userGroupData?.app_publish ? userGroupData?.app_publish : false,
            rbac: userGroupData?.rbac ? userGroupData?.rbac : false,
            user_group_type: userGroupData?.user_group_type ? userGroupData?.user_group_type : ''
        };
    };

    const [userGroup, setUserGroup] = useState(initialiseUserGroup);
    const [isChangeActive, setIsChangeActive] = useState({
        name: false
    });

    const error_in_name = isChangeActive.name && userGroup['name'] === '';

    const cancel = () => {
        handleModalClose();
        handleUpdateResponse('Cancelled Successfully', 'warning');
        setIsChangeActive({ name: false });
    };

    const submit = async () => {
        try {
            if (manageMode === 'create') {
                await createUserGroups({
                    payload: userGroup,
                    callback: onResponseCreateGroup
                });
            } else if (manageMode === 'edit') {
                await updateUserGroups({
                    payload: userGroup,
                    callback: onResponseCreateGroup
                });
            } else if (manageMode === 'delete') {
                await deleteUserGroups({
                    payload: userGroup,
                    callback: onResponseCreateGroup
                });
            }
        } catch (error) {
            handleModalClose();
            handleUpdateResponse(error.message, 'error');
        }
    };

    const onResponseCreateGroup = (response_data) => {
        if (response_data.status && response_data.status === 'error') {
            handleModalClose();
            handleUpdateResponse(response_data.message, 'error');
        } else {
            if (manageMode === 'create') {
                handleUpdateResponse('Created Successfully');
                handleModalClose();
                _.delay(
                    () => {
                        refreshUserGroupList();
                    },
                    2000,
                    ''
                );
            } else if (manageMode === 'edit') {
                handleUpdateResponse('Updated Successfully');
                handleModalClose();
                _.delay(
                    () => {
                        refreshUserGroupList();
                    },
                    2000,
                    ''
                );
            } else if (manageMode === 'delete') {
                handleUpdateResponse('Deleted Successfully');
                handleModalClose();
                _.delay(
                    () => {
                        refreshUserGroupList();
                    },
                    2000,
                    ''
                );
            }
        }
    };

    const handleUpdateResponse = (message, severity = 'success') => {
        if (severity === 'error') {
            setSnackbar((prevState) => ({
                ...prevState,
                snackbar: {
                    ...prevState.snackbar,
                    open: true,
                    message: message,
                    severity: severity
                }
            }));
        } else {
            setSnackbar((prevState) => ({
                ...prevState,
                snackbar: {
                    ...prevState.snackbar,
                    open: true,
                    message: message,
                    severity: severity
                }
            }));
            setUserGroup(initialiseUserGroup);
        }
    };

    const onHandleFieldChange = (e) => {
        const { name, value } = e.target;
        setUserGroup((prevState) => ({
            ...prevState,
            [name]: value
        }));
        setIsChangeActive({
            ...isChangeActive,
            [name]: true
        });
    };

    const handleToggleChange = (event) => {
        setUserGroup((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.checked
        }));
    };

    return (
        <>
            <Dialog
                open={open}
                fullWidth
                classes={{ paper: manageMode === 'delete' ? classes.deletePaper : classes.paper }}
                maxWidth="md"
                aria-labelledby="manage-user-group"
                aria-describedby="user-group-form"
            >
                <DialogTitle className={classes.title} disableTypography id="manage-user-group">
                    {manageMode === 'create' && (
                        <Typography variant="h4" className={classes.heading}>
                            Create New User Group
                        </Typography>
                    )}
                    {manageMode === 'edit' && (
                        <Typography variant="h4" className={classes.heading}>
                            Update User Group
                        </Typography>
                    )}
                    {manageMode === 'delete' && (
                        <Typography variant="h4" className={classes.heading}>
                            Delete User Group?
                        </Typography>
                    )}
                    <IconButton
                        title="Close"
                        onClick={() => {
                            handleModalClose();
                        }}
                        className={classes.closeIcon}
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <hr className={classes.sepratorline} />
                {manageMode !== 'delete' && (
                    <DialogContent id="user-group-form">
                        <Grid key="form-body" container spacing={2}>
                            <Grid item xs={2} className={classes.formFontStyle}>
                                <Typography
                                    variant="subtitle2"
                                    className={clsx(classes.fontSize4, classes.fontColor)}
                                >
                                    Enter Name:
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <ThemeProvider theme={textCompTheme}>
                                    <TextField
                                        label="Enter name"
                                        name="name"
                                        variant="filled"
                                        fullWidth
                                        color="primary"
                                        required
                                        error={error_in_name}
                                        helperText={error_in_name ? 'Name is Mandatory' : ''}
                                        className={clsx(classes.textField)}
                                        value={userGroup?.name}
                                        onChange={onHandleFieldChange}
                                        id="name"
                                    />
                                </ThemeProvider>
                            </Grid>
                            <Grid item xs={2} className={classes.formFontStyle}>
                                <Typography
                                    variant="subtitle2"
                                    className={clsx(classes.fontSize4, classes.fontColor)}
                                >
                                    App:
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Switch
                                    name="app"
                                    size="small"
                                    checked={userGroup?.app}
                                    onChange={handleToggleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </Grid>
                            <Grid item xs={2} className={classes.formFontStyle}>
                                <Typography
                                    variant="subtitle2"
                                    className={clsx(classes.fontSize4, classes.fontColor)}
                                >
                                    Case Studies:
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Switch
                                    name="case_studies"
                                    size="small"
                                    checked={userGroup?.case_studies}
                                    onChange={handleToggleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </Grid>
                            <Grid item xs={2} className={classes.formFontStyle}>
                                <Typography
                                    variant="subtitle2"
                                    className={clsx(classes.fontSize4, classes.fontColor)}
                                >
                                    My Projects Only:
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Switch
                                    name="my_projects_only"
                                    size="small"
                                    checked={userGroup?.my_projects_only}
                                    onChange={handleToggleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </Grid>
                            <Grid item xs={2} className={classes.formFontStyle}>
                                <Typography
                                    variant="subtitle2"
                                    className={clsx(classes.fontSize4, classes.fontColor)}
                                >
                                    My Projects:
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Switch
                                    name="my_projects"
                                    size="small"
                                    checked={userGroup?.my_projects}
                                    onChange={handleToggleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </Grid>
                            <Grid item xs={2} className={classes.formFontStyle}>
                                <Typography
                                    variant="subtitle2"
                                    className={clsx(classes.fontSize4, classes.fontColor)}
                                >
                                    All Projects:
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Switch
                                    name="all_projects"
                                    size="small"
                                    checked={userGroup?.all_projects}
                                    onChange={handleToggleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </Grid>
                            <Grid item xs={2} className={classes.formFontStyle}>
                                <Typography
                                    variant="subtitle2"
                                    className={clsx(classes.fontSize4, classes.fontColor)}
                                >
                                    Widget Factory:
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Switch
                                    name="widget_factory"
                                    size="small"
                                    checked={userGroup?.widget_factory}
                                    onChange={handleToggleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </Grid>
                            <Grid item xs={2} className={classes.formFontStyle}>
                                <Typography
                                    variant="subtitle2"
                                    className={clsx(classes.fontSize4, classes.fontColor)}
                                >
                                    Environments:
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Switch
                                    name="environments"
                                    size="small"
                                    checked={userGroup?.environments}
                                    onChange={handleToggleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </Grid>
                            <Grid item xs={2} className={classes.formFontStyle}>
                                <Typography
                                    variant="subtitle2"
                                    className={clsx(classes.fontSize4, classes.fontColor)}
                                >
                                    Publish:
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Switch
                                    name="app_publish"
                                    size="small"
                                    checked={userGroup?.app_publish}
                                    onChange={handleToggleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </Grid>
                            <Grid item xs={2} className={classes.formFontStyle}>
                                <Typography
                                    variant="subtitle2"
                                    className={clsx(classes.fontSize4, classes.fontColor)}
                                >
                                    Access:
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Switch
                                    name="rbac"
                                    size="small"
                                    Clone
                                    Application
                                    checked={userGroup?.rbac}
                                    onChange={handleToggleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                )}
                <DialogActions className={classes.dialogAction}>
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
                        disabled={error_in_name || userGroup?.name.trim().length === 0}
                        aria-label={manageMode === 'delete' ? 'Delete' : 'Save'}
                    >
                        {manageMode === 'delete' ? 'Delete' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default withStyles(
    (theme) => ({
        ...styles(theme),
        ...customFormStyle(theme)
    }),
    { withTheme: true }
)(ManageUserGroups);
