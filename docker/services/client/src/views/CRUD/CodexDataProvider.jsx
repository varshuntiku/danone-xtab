import jsonServerProvider from "ra-data-json-server";
import httpClient from "views/CRUD/HttpClient.jsx";
import { GET_LIST, CREATE, UPDATE, DELETE, GET_ONE } from "ra-core";
import { authContext } from "adalConfig";

let _ = require("underscore");

export const CODEX_GET_ONE = 1;
export const CODEX_GET_LIST = 2;
export const CODEX_CREATE = 3;
export const CODEX_UPDATE = 4;
export const CODEX_DELETE = 5;
export const CODEX_GET_FOREIGN_KEY_VALUES = 6;
export const CODEX_API_GET = 7;
export const CODEX_API_ACTION = 8;
export const CODEX_API_CREATE = 9;
export const CODEX_API_GET_ONE = 10;
export const CODEX_API_DELETE = 11;

export default (
  type,
  params,
  parent,
  crud = false,
  foreign_key_params = false,
  url_params = false
) => {
  authContext.acquireToken(authContext.config.clientId, function (error, token) {
    if (error || !token) {
      console.log('Error getting token //TODO setup reauth popup.');
      return;
    } else {
      const DataProvider = jsonServerProvider(
        process.env["REACT_APP_BACKEND_API"],
        httpClient
      );

      switch (type) {
        case CODEX_API_GET:
          return DataProvider(GET_ONE, params.resource, {
            id: params.action
          }).then(
            response => {
              parent[params.callback](crud, response);
            },
            error => {
              console.log(error);
            }
          );
        case CODEX_API_ACTION:
          return DataProvider(UPDATE, params.resource, {
            id: params.action,
            data: params.request_data ? params.request_data : {}
          }).then(
            response => {
              parent[params.callback](crud, response, params.action);
            },
            error => {
              console.log(error);
            }
          );
        case CODEX_API_CREATE:
          return DataProvider(CREATE, params.resource, {
            data: params.request_data ? params.request_data : {}
          }).then(response => {
            parent[params.callback](crud, response);
          });
        case CODEX_API_DELETE:
          return DataProvider(DELETE, params.resource, {
            id: params.action
          }).then(
            response => {
              parent[params.callback](crud, response);
            },
            error => {
              console.log(error);
            }
          );
        case CODEX_GET_ONE:
          return DataProvider(GET_ONE, params.list.url_slug, {
            id: parent.state.item_id
          }).then(response => {
            parent.getDataResponse(response);
          });
        case CODEX_GET_LIST:
          return DataProvider(GET_LIST, params.list.url_slug, {
            pagination: { page: 1, perPage: params.list.default_rows_per_page ? params.list.default_rows_per_page : 10 },
            sort: { field: "id", order: "DESC" }
          }).then(response => {
            parent.getListResponse(response);
          });
        case CODEX_CREATE:
          var request_data = {};
          if (params.fields) {
            _.each(params.fields.list, function(field) {
              if (field["accessor"] !== "actions" && !field["hide_add"]) {
                //Evaluate show conditions
                var add_field = true;

                if (field.show_condition) {
                  if (
                    parseInt(parent.state[field.show_condition["key"]]) !==
                    parseInt(field.show_condition["value"])
                  ) {
                    add_field = false;
                  }
                }

                if (add_field) {
                  request_data[field["accessor"]] = parent.state[field["accessor"]];
                }
              }
            });
          } else {
            request_data = params.request_data
          }

          return DataProvider(CREATE, params.list.url_slug, {
            data: request_data
          }).then(response => {
            crud.showAddedNotification();
          }).catch(error =>{
              if(error.status === 409){
                crud.showExistNotification();
              }
          });
        case CODEX_UPDATE:
          request_data = { id: parent.state.item_id };
          if (params.fields) {
            _.each(params.fields.list, function(field) {
              if (field["accessor"] !== "actions" && !field.hide_edit) {
                //Evaluate show conditions
                var add_field = true;

                if (field.show_condition) {
                  if (
                    parseInt(parent.state[field.show_condition["key"]]) !==
                    parseInt(field.show_condition["value"])
                  ) {
                    add_field = false;
                  }
                }

                if (add_field) {
                  request_data[field["accessor"]] = parent.state[field["accessor"]];
                }
              }
            });
          } else {
            request_data = params.request_data
          }

          return DataProvider(UPDATE, params.list.url_slug, {
            id: parent.state.item_id,
            data: request_data
          }).then(response => {
            crud.showUpdateNotification();
          });
        case CODEX_DELETE:
          return DataProvider(DELETE, params.list.url_slug, {
            id: params["item_id"]
          }).then(response => {
            crud.showDeleteNotification();
          });
        case CODEX_GET_FOREIGN_KEY_VALUES:
          return DataProvider(GET_LIST, foreign_key_params.parent_slug ? foreign_key_params.parent_slug + "/" + foreign_key_params.slug : foreign_key_params.slug, {
            pagination: { page: 1, perPage: 10 },
            sort: { field: "name", order: "ASC" }
          }).then(response => {
            var items = response.data.map((prop, key) => {
              return {
                id: prop["id"],
                label: prop["name"],
                value: prop["id"]
              };
            });

            parent.getForeignkeyValuesResponse(foreign_key_params.slug, items);
          });
        default:
          return false;
      }
    }
  });
};
