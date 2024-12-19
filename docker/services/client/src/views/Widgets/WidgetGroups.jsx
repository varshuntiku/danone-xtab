import React from "react";

import Apps from "@material-ui/icons/Apps";

import CodexCRUD from "views/CRUD/CodexCRUD.jsx";

export default function WidgetGroups() {
  const user_group_params = {
    table_key: "widget-groups",
    list: {
      name: "Widget Groups",
      name_singular: "Widget Group",
      headers: [],
      url_slug: "widget-groups"
    },
    add: {
      name: "Add Widget Group"
    },
    edit: {
      name: "Edit Widget Group"
    },
    fields: {
      list: [
        {
          Header: "Name",
          accessor: "name",
          is_required: true,
          sortable: false,
          filterable: false,
          type: "text"
        },
        {
          Header: "Light Color",
          accessor: "light_color",
          hide_table: true,
          is_required: true,
          sortable: false,
          filterable: false,
          type: "text"
        },
        {
          Header: "Dark Color",
          accessor: "dark_color",
          hide_table: true,
          is_required: true,
          sortable: false,
          filterable: false,
          type: "text"
        },
        {
          Header: "Has IN port ?",
          accessor: "in_port",
          hide_table: true,
          is_required: false,
          sortable: false,
          filterable: false,
          type: "boolean"
        },
        {
          Header: "Has OUT port ?",
          accessor: "out_port",
          hide_table: true,
          is_required: false,
          sortable: false,
          filterable: false,
          type: "boolean"
        },
        {
          Header: "Code",
          accessor: "code",
          hide_table: true,
          is_required: true,
          sortable: false,
          filterable: false,
          type: "text"
        },
        {
          Header: "# of widgets",
          accessor: "widget_count",
          hide_add: true,
          hide_edit: true,
          sortable: true,
          filterable: false,
          type: "text"
        },
        {
          Header: "Created at",
          accessor: "created_at",
          hide_add: true,
          hide_edit: true,
          sortable: false,
          filterable: false,
          type: "text"
        },
        {
          Header: "Created by",
          accessor: "created_by",
          hide_add: true,
          hide_edit: true,
          sortable: false,
          filterable: false,
          type: "text"
        },
        {
          Header: "Updated at",
          accessor: "updated_at",
          hide_add: true,
          hide_edit: true,
          sortable: false,
          filterable: false,
          type: "text"
        },
        {
          Header: "Updated by",
          accessor: "updated_by",
          hide_add: true,
          hide_edit: true,
          sortable: false,
          filterable: false,
          type: "text"
        },
        {
          Header: "Actions",
          accessor: "actions",
          sortable: false,
          filterable: false
        }
      ]
    },
    icon: Apps,
    actions: {
      add: true,
      edit: true,
      delete: true,
      list: true,
      extra: []
    }
  };

  return <CodexCRUD params={user_group_params} />;
}
