import React from 'react';

import { getDashboardTabs, deleteDashboardTab } from 'services/connectedSystem_v2.js';

import AdminTable from 'components/custom/AdminTable.jsx';
import TabsActions from 'components/connectedSystemRedesign/Admin/TabsActions.jsx';

function Tabs(props) {
    const connSystemDashboardId = props.connSystemDashboardId;

    var columns = [
        {
            header: 'Name',
            type: 'String',
            key: 'name'
        },
        {
            header: 'Type',
            type: 'String',
            key: 'tab_type'
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
                name: 'Dashboard Tab',
                plural_name: 'Dashboard Tab(s)',
                search: true,
                pagination: true,
                add_action: (refresh_data_fn) => {
                    return (
                        <TabsActions
                            connSystemDashboardId={connSystemDashboardId}
                            createDashboardTab={true}
                            refreshData={refresh_data_fn}
                        />
                    );
                },
                edit_action: (row, refresh_data_fn) => {
                    return (
                        <TabsActions
                            connSystemDashboardId={connSystemDashboardId}
                            dashboard_tab={row}
                            refreshData={refresh_data_fn}
                        />
                    );
                },
                columns: columns,
                data: {
                    api: getDashboardTabs,
                    delete_api: deleteDashboardTab,
                    params: {
                        connSystemDashboardId: connSystemDashboardId
                    }
                }
            }}
        />
    );
}

export default Tabs;
