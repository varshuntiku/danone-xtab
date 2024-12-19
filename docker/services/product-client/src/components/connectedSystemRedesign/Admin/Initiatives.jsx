import React from 'react';

import AdminTable from 'components/custom/AdminTable.jsx';
import InitiativesActions from './InitiativesActions';
import { getInitiatives, deleteInitiative } from 'services/connectedSystem_v2';

function Initiatives(props) {
    const connSystemDashboardId = props.connSystemDashboardId;

    var columns = [
        {
            header: 'Name',
            type: 'String',
            key: 'name'
        },
        {
            header: 'Goal',
            type: 'String',
            key: 'goal'
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
                name: 'Initiative',
                plural_name: 'Initiative(s)',
                search: true,
                pagination: true,
                add_action: (refresh_data_fn) => {
                    return (
                        <InitiativesActions
                            connSystemDashboardId={connSystemDashboardId}
                            createInitiative={true}
                            refreshData={refresh_data_fn}
                        />
                    );
                },
                edit_action: (row, refresh_data_fn) => {
                    return (
                        <InitiativesActions
                            connSystemDashboardId={connSystemDashboardId}
                            initiative={row}
                            refreshData={refresh_data_fn}
                        />
                    );
                },
                columns: columns,
                data: {
                    api: getInitiatives,
                    delete_api: deleteInitiative,
                    params: {
                        connSystemDashboardId: connSystemDashboardId
                    }
                }
            }}
        />
    );
}

export default Initiatives;
