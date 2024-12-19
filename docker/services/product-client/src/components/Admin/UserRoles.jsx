import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core';
import { getAppUserRoles, deleteUserRole } from 'services/admin_users.js';
import { getScreens } from 'services/screen.js';

import AdminTable from 'components/custom/AdminTable.jsx';
import AppAdminModuleUsers from 'components/Admin/Users.jsx';
import UserRoleActions from 'components/Admin/UserRoleActions.jsx';
import FullScreenMessage from './FullScreenMessage';
import CodxCircularLoader from '../CodxCircularLoader';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tab,
    Tabs,
    Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CustomSnackbar from '../CustomSnackbar';

import * as _ from 'underscore';
const userRoleStyle = (theme) => ({
    heading: {
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(22),
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: '36px',
        letterSpacing: '1px',
        padding: '0rem 4.5rem'
    },
    tabContainer: {
        paddingLeft: '4rem',
        '& .MuiTab-root': {
            borderRadius: theme.spacing(1, 1, 0, 0),
            padding: theme.layoutSpacing(12),
            fontFamily: theme.title.h1.fontFamily,
            fontSize: theme.layoutSpacing(18),
            textTransform: 'none',
            paddingBottom: 0,
            fontWeight: '400',
            lineHeight: 'normal',
            letterSpacing: '1px',
            borderBottom: `2px solid ${theme.palette.border.grey}`,
            '&:hover': {
                backgroundColor: 'transparent'
            }
        },
        '& .MuiTabs-indicator': {
            backgroundColor: 'transparent'
        }
    },
    selectedTab: {
        borderBottom: `3px solid ${theme.palette.text.default} !important`
    },

    backBtn: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(18),
        fontWeight: '500',
        width: theme.layoutSpacing(170),
        paddingBottom: theme.layoutSpacing(20),
        cursor: 'pointer',
        '& svg': {
            height: '3rem',
            fontWeight: '500'
        }
    }
});

class AppAdminModuleUserRoles extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.actionRef = React.createRef();
        this.state = {
            loading: false,
            screens: null,
            snackbar: {
                open: false
            },
            confirmDelete: null,
            selectedTab: 0
        };
        this.adminTableRef = React.createRef();
    }

    async componentDidMount() {
        const { app_info } = this.props;
        try {
            this.setState({ loading: true });
            const screens = await getScreens({
                app_id: app_info.id
            });
            this.setState({ screens });
        } catch (err) {
            // console.error(err);
        } finally {
            this.setState({ loading: false });
        }
    }

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

    deleteUserRole = async (row, confirm) => {
        try {
            this.setState({ confirmDelete: null });
            var params = {
                id: row.id,
                confirm: confirm,
                callback: () => {
                    setTimeout(this.adminTableRef.current.refreshData, 1000);
                }
            };
            await deleteUserRole(params);
            this.handleUpdateResponse('Deleted Successfully');
        } catch (error) {
            this.handleUpdateResponse(error.response?.data?.error || error.message, 'error');
            if (error.response.status === 409) {
                this.setState({ confirmDelete: { role: row } });
            }
        }
    };

    render() {
        const { app_info, classes } = this.props;

        if (this.state.loading) {
            return <CodxCircularLoader size={60} center data-testid="loader" />;
        } else if (!this.state.screens?.length) {
            return <FullScreenMessage text={'No Screens Available'} />;
        }

        var app_modules = _.filter(this.state.screens, function (screen) {
            return screen.level === (app_info.modules.user_mgmt_app_screen_level || null);
        });

        var columns = [
            {
                header: 'Role name',
                type: 'String',
                key: 'name'
            }
        ];

        _.each(app_modules, function (app_module) {
            columns.push({
                header: app_module.screen_name,
                type: 'Boolean',
                key_fn: (row) => {
                    var permissions = row.permissions;

                    var found_permission = _.find(permissions, function (permission_item) {
                        return (
                            permission_item.replace('app_screen_', '') === app_module.id.toString()
                        );
                    });

                    if (found_permission) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
        });

        columns.push({
            header: 'User Mgmt',
            type: 'Boolean',
            key_fn: (row) => {
                var permissions = row.permissions;

                var found_permission = _.find(permissions, function (permission_item) {
                    return permission_item.replace('app_screen_', '') === 'user_mgmt';
                });

                if (found_permission) {
                    return true;
                } else {
                    return false;
                }
            }
        });

        const handleChange = (event, newValue) => {
            this.setState({
                selectedTab: newValue
            });
        };
        const handleNavigate = () => {
            this.props.history.goBack();
        };
        return (
            <Fragment>
                <div className={classes.backBtn} onClick={handleNavigate}>
                    {' '}
                    <ArrowBackIcon fontSize="large" className={classes.icon} />
                    Back to Modules
                </div>
                <Typography className={classes.heading}>User Management</Typography>
                <Tabs
                    value={this.state.selectedTab}
                    onChange={handleChange}
                    className={classes.tabContainer}
                >
                    <Tab
                        label="User Roles"
                        className={this.state.selectedTab == 0 ? classes.selectedTab : ''}
                    />
                    <Tab
                        label="Users"
                        className={this.state.selectedTab == 1 ? classes.selectedTab : ''}
                    />
                </Tabs>

                {this.state.selectedTab === 0 ? (
                    <AdminTable
                        ref={this.adminTableRef}
                        parent_obj={this}
                        deleteHandler={this.deleteUserRole}
                        table_params={{
                            name: 'User role',
                            plural_name: 'User roles',
                            search: true,
                            pagination: true,
                            add_action: (refresh_data_fn) => {
                                return (
                                    <UserRoleActions
                                        createNewUserRole={true}
                                        app_modules={app_modules}
                                        app_id={app_info.id}
                                        refreshData={refresh_data_fn}
                                    />
                                );
                            },
                            edit_action: (row, refresh_data_fn) => {
                                return (
                                    <UserRoleActions
                                        createNewUserRole={false}
                                        app_modules={app_modules}
                                        app_id={app_info.id}
                                        user_role={row}
                                        refreshData={refresh_data_fn}
                                    />
                                );
                            },
                            columns: columns,
                            data: {
                                api: getAppUserRoles,
                                delete_api: deleteUserRole,
                                params: {
                                    app_id: app_info.id
                                }
                            }
                        }}
                    />
                ) : null}
                {this.state.selectedTab === 1 ? (
                    <AppAdminModuleUsers
                        key={this.props.location.key}
                        app_info={app_info}
                        config={this.props.config}
                        {...this.props}
                    />
                ) : null}
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

                <ConfirmDelete
                    open={!!this.state.confirmDelete}
                    role={this.state.confirmDelete?.role}
                    onCancel={() => this.setState({ confirmDelete: null })}
                    onConfirm={() => this.deleteUserRole(this.state.confirmDelete.role, true)}
                />
            </Fragment>
        );
    }
}

AppAdminModuleUserRoles.propTypes = {
    app_info: PropTypes.object.isRequired,
    config: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.bool.isRequired])
};

export default withStyles(
    (theme) => ({
        ...userRoleStyle(theme)
    }),
    { useTheme: true }
)(AppAdminModuleUserRoles);

const useStyles = makeStyles((theme) => ({
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
    color: {
        color: theme.palette.text.titleText
    }
}));

function ConfirmDelete({ open, onConfirm, onCancel, role }) {
    const classes = useStyles();

    return (
        <Dialog
            key={3}
            open={open}
            fullWidth
            maxWidth="sm"
            onClose={() => {
                this.setOpen(false);
            }}
            aria-label="delete-user-role"
            aria-describedby="user-role-content"
        >
            <DialogTitle className={classes.title} disableTypography id="delete-user-role">
                <Typography variant="h4" className={classes.color}>
                    Delete {role?.name}:
                </Typography>
            </DialogTitle>
            <DialogContent id="user-role-content">
                <Typography variant="h5" className={classes.color}>
                    &apos;{role?.name}&apos; is associated with one or more users.
                </Typography>
            </DialogContent>
            <DialogActions style={{ padding: '8px 24px 24px' }}>
                <Button
                    className={classes.btn}
                    variant="outlined"
                    onClick={onConfirm}
                    aria-label="Confirm"
                >
                    Confirm
                </Button>
                <Button
                    className={classes.btn}
                    variant="contained"
                    onClick={onCancel}
                    aria-label="Cancel"
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}
