import React from 'react';

import AdminTable from 'components/custom/AdminTable.jsx';
import GoalsActions from 'components/connectedSystemRedesign/Admin/GoalsActions.jsx';
import { getGoals, deleteGoal } from '../../../services/connectedSystem_v2';

function Goals(props) {
    const connSystemDashboardId = props.connSystemDashboardId;

    var columns = [
        {
            header: 'Name',
            type: 'String',
            key: 'name'
        },
        {
            header: 'Is Active',
            type: 'Boolean',
            key: 'is_active'
        },
        {
            header: 'Order',
            type: 'Number',
            key: 'order_by'
        },
        {
            header: 'Created by',
            type: 'String',
            key: 'created_by_user'
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

    return (
        <AdminTable
            parent_obj={this}
            table_params={{
                name: 'Goal',
                plural_name: 'Goal(s)',
                search: true,
                pagination: true,
                add_action: (refresh_data_fn) => {
                    return (
                        <GoalsActions
                            connSystemDashboardId={connSystemDashboardId}
                            createGoal={true}
                            refreshData={refresh_data_fn}
                        />
                    );
                },
                edit_action: (row, refresh_data_fn) => {
                    return (
                        <GoalsActions
                            connSystemDashboardId={connSystemDashboardId}
                            goal={row}
                            refreshData={refresh_data_fn}
                        />
                    );
                },
                columns: columns,
                data: {
                    api: getGoals,
                    delete_api: deleteGoal,
                    params: {
                        connSystemDashboardId: connSystemDashboardId
                    }
                }
            }}
        />
    );
}

export default Goals;
