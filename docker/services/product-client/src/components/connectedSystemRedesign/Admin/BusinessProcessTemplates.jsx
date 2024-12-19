import React from 'react';

import AdminTable from 'components/custom/AdminTable.jsx';
import BusinessProcessTemplatesActions from 'components/connectedSystemRedesign/Admin/BusinessProcessTemplatesActions.jsx';
import {
    getBusinessProcessTemplates,
    deleteBusinessProcessTemplate
} from 'services/connectedSystem_v2';

function BusinessProcessTemplates(props) {
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
                name: 'Process Template',
                plural_name: 'Process Template(s)',
                search: true,
                pagination: true,
                add_action: (refresh_data_fn) => {
                    return (
                        <BusinessProcessTemplatesActions
                            connSystemDashboardId={connSystemDashboardId}
                            createBusinessProcessTemplate={true}
                            refreshData={refresh_data_fn}
                        />
                    );
                },
                edit_action: (row, refresh_data_fn) => {
                    return (
                        <BusinessProcessTemplatesActions
                            connSystemDashboardId={connSystemDashboardId}
                            business_process_template={row}
                            refreshData={refresh_data_fn}
                        />
                    );
                },
                columns: columns,
                data: {
                    api: getBusinessProcessTemplates,
                    delete_api: deleteBusinessProcessTemplate,
                    params: {
                        connSystemDashboardId: connSystemDashboardId
                    }
                }
            }}
        />
    );
}

export default BusinessProcessTemplates;
