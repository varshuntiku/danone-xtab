import React from 'react';
import PropTypes from 'prop-types';

// import { Grid } from "@material-ui/core";

import { getAppUsers, deleteAppUser, getAppUserRoles } from 'services/admin_users.js';

import AdminTable from 'components/custom/AdminTable.jsx';
import UserActions from 'components/Admin/UserActions.jsx';

import * as _ from 'underscore';

class AppAdminModuleUsers extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.state = {
            user_roles: [],
            responsibilities: props.app_info?.modules?.responsibilities
                ? _.map(props.app_info.modules.responsibilities, function (resp) {
                      return {
                          value: resp,
                          label: resp
                      };
                  })
                : []
        };
    }

    componentDidMount() {
        this.refreshRolesPermissions();
    }

    refreshRolesPermissions = () => {
        const { app_info } = this.props;

        getAppUserRoles({
            app_id: app_info.id,
            callback: this.onResponseUserRolesPermissions
        });
    };

    onResponseUserRolesPermissions = (response_data) => {
        this.setState({
            user_roles: _.map(response_data, function (role_item) {
                return {
                    value: role_item.id,
                    label: role_item.name
                };
            })
        });
    };

    searchFn(row, search) {
        return [row.email_address, row.first_name, row.last_name]
            .join(' ')
            .toLowerCase()
            .includes(search.toLowerCase());
    }

    render() {
        const { app_info } = this.props;

        return (
            <AdminTable
                searchFn={this.searchFn}
                table_params={{
                    name: 'User',
                    plural_name: 'Users',
                    search: true,
                    pagination: true,
                    add_action: (refresh_data_fn) => {
                        return (
                            <UserActions
                                createNewUser={true}
                                app_id={app_info.id}
                                user_roles={this.state.user_roles}
                                responsibilities={this.state.responsibilities}
                                refreshData={refresh_data_fn}
                            />
                        );
                    },
                    edit_action: (row, refresh_data_fn) => {
                        return (
                            <UserActions
                                createNewUser={false}
                                app_id={app_info.id}
                                user_roles={this.state.user_roles}
                                responsibilities={this.state.responsibilities}
                                user={row}
                                refreshData={refresh_data_fn}
                            />
                        );
                    },
                    columns: [
                        {
                            header: 'First name',
                            type: 'String',
                            key: 'first_name'
                        },
                        {
                            header: 'Last name',
                            type: 'String',
                            key: 'last_name'
                        },
                        {
                            header: 'E-Mail ID',
                            type: 'String',
                            key: 'email_address'
                        },
                        {
                            header: 'Role(s)',
                            type: 'JSON',
                            key_fn: (row) => {
                                return row.user_roles
                                    ? _.map(row.user_roles, function (user_role) {
                                          return <div>{user_role.name}</div>;
                                      })
                                    : '-';
                            }
                        },
                        {
                            header: 'Responsibility(s)',
                            type: 'JSON',
                            key_fn: (row) => {
                                return row.responsibilities
                                    ? _.map(row.responsibilities, function (responsibility) {
                                          return <div>{responsibility}</div>;
                                      })
                                    : '-';
                            }
                        }
                    ],
                    data: {
                        api: getAppUsers,
                        delete_api: deleteAppUser,
                        params: {
                            app_id: app_info.id
                        }
                    }
                }}
            />
        );
    }
}

AppAdminModuleUsers.propTypes = {
    app_info: PropTypes.object.isRequired,
    config: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.bool.isRequired])
};

export default AppAdminModuleUsers;
