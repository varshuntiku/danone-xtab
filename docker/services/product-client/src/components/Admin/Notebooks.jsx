import React from 'react';

import { getNotebooks, deleteNotebook } from 'services/admin_execution.js';

import AdminTable from 'components/custom/AdminTable.jsx';
import NotebookActions from 'components/Admin/NotebookActions.jsx';

function AppAdminNotebooks(props) {
    const app_info = props.app_info;

    var columns = [
        {
            header: 'Name',
            type: 'String',
            key: 'name'
        },
        {
            header: 'Created by',
            type: 'String',
            key: 'created_by'
        },
        {
            header: 'Created at',
            type: 'String',
            key: 'created_at'
        },
        {
            header: 'Updated at',
            type: 'String',
            key: 'updated_at'
        }
    ];

    var blueprint_link = app_info.blueprint_link;
    var details = blueprint_link.split('/');

    var project_id = false;
    if (details.length === 4) {
        project_id = details[2];
    } else if (details.length === 6) {
        project_id = details[4];
    }

    return (
        <AdminTable
            parent_obj={this}
            table_params={{
                name: 'Notebook',
                plural_name: 'Notebook(s)',
                search: true,
                pagination: true,
                add_action: (refresh_data_fn) => {
                    return (
                        <NotebookActions
                            project_id={project_id}
                            createNotebook={true}
                            refreshData={refresh_data_fn}
                        />
                    );
                },
                edit_action: (row, refresh_data_fn) => {
                    return (
                        <NotebookActions
                            project_id={project_id}
                            execution={row}
                            refreshData={refresh_data_fn}
                        />
                    );
                },
                other_actions: [
                    (row, refresh_data_fn) => {
                        return (
                            <NotebookActions
                                project_id={project_id}
                                designNotebook={true}
                                execution={row}
                                refreshData={refresh_data_fn}
                            />
                        );
                    },
                    (row, refresh_data_fn) => {
                        return (
                            <NotebookActions
                                project_id={project_id}
                                iterationsNotebook={true}
                                execution={row}
                                refreshData={refresh_data_fn}
                            />
                        );
                    }
                ],
                columns: columns,
                data: {
                    api: getNotebooks,
                    delete_api: deleteNotebook,
                    params: {
                        app_id: app_info.id,
                        project_id: project_id
                    }
                }
            }}
        />
    );
}

export default AppAdminNotebooks;
