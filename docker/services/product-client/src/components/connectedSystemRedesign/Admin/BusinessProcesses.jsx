import React from 'react';

import AdminTable from 'components/custom/AdminTable.jsx';
import BusinessProcessesActions from 'components/connectedSystemRedesign/Admin/BusinessProcessesActions.jsx';
import { getBusinessProcesses, deleteBusinessProcess } from 'services/connectedSystem_v2';

function BusinessProcesses(props) {
    const connSystemDashboardId = props.connSystemDashboardId;

    var columns = [
        {
            header: 'Name',
            type: 'String',
            key: 'name'
        },
        {
            header: 'Driver',
            type: 'String',
            key: 'driver'
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
                name: 'Business Process',
                plural_name: 'Business Process(s)',
                search: true,
                pagination: true,
                add_action: (refresh_data_fn) => {
                    return (
                        <BusinessProcessesActions
                            connSystemDashboardId={connSystemDashboardId}
                            createBusinessProcess={true}
                            refreshData={refresh_data_fn}
                        />
                    );
                },
                edit_action: (row, refresh_data_fn) => {
                    return (
                        <BusinessProcessesActions
                            connSystemDashboardId={connSystemDashboardId}
                            business_process={row}
                            refreshData={refresh_data_fn}
                        />
                    );
                },
                columns: columns,
                data: {
                    api: getBusinessProcesses,
                    delete_api: deleteBusinessProcess,
                    params: {
                        connSystemDashboardId: connSystemDashboardId
                    }
                }
            }}
        />
    );
}

export default BusinessProcesses;
