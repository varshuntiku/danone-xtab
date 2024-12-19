import React from 'react';

import { getNotebookIterations, deleteNotebookIteration } from 'services/admin_execution.js';

import AdminTable from 'components/custom/AdminTable.jsx';
import NotebookIterationActions from 'components/Admin/NotebookIterationActions.jsx';

function AppAdminNotebookIterations(props) {
    const app_info = props.app_info;
    const notebook_id =
        props.match && props.match.params.notebook_id ? props.match.params.notebook_id : false;

    if (!notebook_id) {
        return '';
    }

    var columns = [
        {
            header: 'Name',
            type: 'String',
            key: 'name'
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
                name: 'Iteration',
                plural_name: 'Iteration(s)',
                search: true,
                pagination: true,
                add_action: (refresh_data_fn) => {
                    return (
                        <NotebookIterationActions
                            notebook_id={notebook_id}
                            createNotebookIteration={true}
                            refreshData={refresh_data_fn}
                        />
                    );
                },
                edit_action: (row, refresh_data_fn) => {
                    return (
                        <NotebookIterationActions
                            notebook_id={notebook_id}
                            iteration={row}
                            refreshData={refresh_data_fn}
                        />
                    );
                },
                other_actions: [
                    (row, refresh_data_fn) => {
                        return (
                            <NotebookIterationActions
                                notebook_id={notebook_id}
                                designNotebookIteration={true}
                                iteration={row}
                                refreshData={refresh_data_fn}
                            />
                        );
                    }
                ],
                columns: columns,
                data: {
                    api: getNotebookIterations,
                    delete_api: deleteNotebookIteration,
                    params: {
                        app_id: app_info.id,
                        project_id: project_id,
                        notebook_id: notebook_id
                    }
                }
            }}
        />
    );
}

export default AppAdminNotebookIterations;
