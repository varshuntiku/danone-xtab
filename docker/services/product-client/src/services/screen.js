import httpClient, { axiosClient } from 'services/httpClient.js';
import { isDEEWorking, modifyDEEStatus } from 'services/deeService.js';
import { decodeHtmlEntities } from '../util/decodeHtmlEntities';
export async function getWidgets(params) {
    try {
        const response = await axiosClient.get(
            '/app/' + params.app_id + '/screens/' + params.screen_id + '/widgets',
            {}
        );
        if (params.callback) {
            params.callback(response['data']);
        }
        return response['data'];
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function triggerActionHandler(params) {
    try {
        let url = '/app/' + params.app_id + '/screens/' + params.screen_id + '/action_handler';
        let payload = { ...params.payload };
        if (isDEEWorking() && import.meta.env['REACT_APP_DEE_ENV_ENABLED']) {
            url = import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] + '/execute/action/render';
            payload = {
                ...params.payload,
                screen_id: params.screen_id,
                app_id: params.app_id
            };
            const response = await httpClient.post(url, payload);
            if (params?.callback) {
                params.callback(decodeHtmlEntities(response['data']));
            }
            return decodeHtmlEntities(response['data']);
        } else {
            // const response = await httpClient.post(import.meta.env['REACT_APP_BACKEND_API'] + url, payload);
            const response = await axiosClient.post(url, payload);
            if (params?.callback) {
                params.callback(decodeHtmlEntities(response['data']));
            }
            return decodeHtmlEntities(response['data']);
        }
    } catch (error) {
        if (error?.response?.status || error?.message === 'Network Error') {
            modifyDEEStatus(error?.response?.status || 404);
        }
        throw new Error(error);
    }
}

export async function getScreens(params) {
    try {
        const response = await axiosClient.get('/app/' + params.app_id + '/screens', {});
        if (params?.callback) {
            params.callback(response['data']);
        }
        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}

export async function getScreenConfig(params) {
    try {
        const response = await axiosClient.get(
            '/app/' + params.app_id + '/screens/' + params.screen_id + '/overview',
            {}
        );
        if (params?.callback) {
            params.callback(response['data']);
        }

        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}

export async function getScreenFilterValues(params) {
    let app_filter = JSON.parse(sessionStorage.getItem('app_filter_info_' + params.app_id));
    let payload =
        params?.retain_filters && app_filter
            ? { selected: app_filter, current_filter: 'global_filters' }
            : {};
    try {
        let url = '/app/' + params.app_id + '/screens/' + params.screen_id + '/dynamic-filters';
        if (isDEEWorking() && import.meta.env['REACT_APP_DEE_ENV_ENABLED']) {
            url = import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] + '/execute/filter/render';
            payload = {
                ...params.payload,
                screen_id: params.screen_id,
                app_id: params.app_id
            };
            const response = await httpClient.post(url, payload);
            if (params?.callback) {
                params.callback(response['data']);
            }
            return response['data'];
        } else {
            const response = await axiosClient.post(url, payload);
            if (params?.callback) {
                params.callback(response['data']);
            }
            return response['data'];
        }
    } catch (error) {
        if (error?.response?.status || error?.message === 'Network Error') {
            modifyDEEStatus(error?.response?.status || 404);
        }
        throw new Error(error);
    }
}

export async function getScreenActionSettings(params) {
    try {
        let url = '/app/' + params.app_id + '/screens/' + params.screen_id + '/dynamic-actions';
        let payload = { filter_state: params.selected_filter };
        if (isDEEWorking() && import.meta.env['REACT_APP_DEE_ENV_ENABLED']) {
            url = import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] + '/execute/action/render';
            payload.app_id = params.app_id;
            payload.screen_id = params.screen_id;
            const response = await httpClient.post(url, payload);
            if (params?.callback) {
                params.callback(response['data']);
            }
            return response['data'];
        } else {
            const response = await axiosClient.post(url, payload);
            if (params?.callback) {
                params.callback(response['data']);
            }
            return response['data'];
        }
    } catch (error) {
        if (error?.response?.status || error?.message === 'Network Error') {
            modifyDEEStatus(error?.response?.status || 404);
        }
        throw new Error(error);
    }
}

export async function saveScreenWidgets(params) {
    try {
        const response = await axiosClient.post(
            '/app-admin/app/' +
                params.app_id +
                '/screen/' +
                params.screen_id +
                '/save-screen-widgets',
            { ...params.payload }
        );
        if (params.callback) {
            params.callback(response['data']);
        }
        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}

export async function saveScreenWidgetConfig(params) {
    try {
        const response = await axiosClient.post(
            '/app-admin/app/' +
                params.app_id +
                '/screen/' +
                params.screen_id +
                '/widget/' +
                params.widget_id +
                '/config',
            { ...params.payload }
        );
        if (params.callback) {
            params.callback(response['data']);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function saveScreenWidgetUIAC(params) {
    try {
        const response = await axiosClient.post(
            '/app-admin/app/' +
                params.app_id +
                '/screen/' +
                params.screen_id +
                '/widget/' +
                params.widget_id +
                '/uiac',
            { ...params.payload }
        );
        if (params.callback) {
            params.callback(response['data']);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getScreenWidget(params) {
    try {
        const response = await axiosClient.get(
            '/app-admin/app/' +
                params.app_id +
                '/screen/' +
                params.screen_id +
                '/widget/' +
                params.widget_id,
            {}
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
}

export async function getSystemWidgets(params) {
    try {
        const response = await axiosClient.post(
            '/app-admin/app/' + params.app_id + '/get-system-widgets',
            { ...params.payload }
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function getDsStoreArtifactsList(params) {
    try {
        if (isDEEWorking() && import.meta.env['REACT_APP_DEE_ENV_ENABLED']) {
            const response = await axiosClient.get(
                `${
                    import.meta.env['REACT_APP_DS_STORE_ENV_BASE_URL']
                }/services/dsstore/artifacts/list/${params.app_id}`,
                {}
            );
            params.callback(response['data']);
            return true;
        } else {
            params.callback({
                results: []
            });
            return true;
        }
    } catch (error) {
        if (error?.response?.status || error?.message === 'Network Error') {
            modifyDEEStatus(error?.response?.status || 404);
        }
        params.callback({ status: 'error' });
    }
}

export async function getDsStorePreviewArtifacts(params) {
    try {
        const response = await axiosClient.post(
            `${
                import.meta.env['REACT_APP_DS_STORE_ENV_BASE_URL']
            }/services/dsstore/artifacts/preview/${params.app_id}`,
            { ...params.payload }
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function getSystemWidgetDocumentation(params) {
    try {
        const response = await axiosClient.get(
            '/app-admin/get-system-widget-documentation/' + params.md_file_name,
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function testActionsGenerator(params) {
    try {
        let url = '/app-admin/app/' + params.app_id + '/test-actions-code';
        let payload = { ...params.payload };
        if (isDEEWorking() && import.meta.env['REACT_APP_DEE_ENV_ENABLED']) {
            url = import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] + '/execute/action/test';
            payload = {
                app_id: params.app_id,
                screen_id: params.screen_id,
                filter_state: params.selected_filter,
                ...payload
            };
            const response = await httpClient.post(url, payload);
            params.callback(response['data']);
        } else {
            const response = await axiosClient.post(url, payload);
            params.callback(response['data']);
        }
        return true;
    } catch (error) {
        if (error?.response?.status || error?.message === 'Network Error') {
            modifyDEEStatus(error?.response?.status || 404);
        }
        params.callback({ status: 'error' });
    }
}

export async function previewActionsHandler(params) {
    try {
        let url = '/app-admin/app/' + params.app_id + '/preview-actions-handler';
        let payload = { ...params.payload };
        if (isDEEWorking() && import.meta.env['REACT_APP_DEE_ENV_ENABLED']) {
            url = import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] + '/execute/action/test';
            payload = {
                ...params.payload,
                app_id: params.app_id
            };
            const response = await httpClient.post(url, payload);
            params.callback(response['data']);
            return true;
        } else {
            // const response = await httpClient.post(import.meta.env['REACT_APP_BACKEND_API'] + url, payload);
            const response = await axiosClient.post(url, payload);
            params.callback(response['data']);
            return true;
        }
    } catch (error) {
        if (error?.response?.status || error?.message === 'Network Error') {
            modifyDEEStatus(error?.response?.status || 404);
        }
        params.callback({ status: 'error' });
    }
}

export async function saveScreenActionSettings(params) {
    try {
        const response = await axiosClient.post(
            '/app-admin/app/' + params.app_id + '/screen/' + params.screen_id + '/save-actions',
            { ...params.payload }
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function getScreenFilter(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_BACKEND_API'] +
                '/app/' +
                params.app_id +
                '/screen/' +
                params.screen_id +
                '/filters'
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
}

export async function getScreenAction(params) {
    try {
        const response = await axiosClient.get(
            '/app/' + params.app_id + '/screen/' + params.screen_id + '/actions'
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
}

export async function getScreenWidgetUiaC(params) {
    try {
        const response = await axiosClient.get(
            '/app/' +
                params.app_id +
                '/screen/' +
                params.screen_id +
                '/widget/' +
                params.widget_id +
                '/uiac'
        );
        params.callback(response['data']);
    } catch (error) {
        throw new Error(error);
    }
}

export async function getScreenUserGuide(params) {
    try {
        const response = await axiosClient.get(
            '/app-admin/app/' + params.app_id + '/screen/' + params.screen_id + '/user-guide'
        );
        if (params.callback) {
            params.callback(response['data']);
        }
        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}

export async function saveScreenUserGuide(params) {
    try {
        const response = await axiosClient.post(
            '/app-admin/app/' + params.app_id + '/screen/' + params.screen_id + '/user-guide',
            { ...params.payload }
        );
        if (params.callback) {
            params.callback(response['data']);
        }
        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}

export async function updateScreenUserGuide(params) {
    try {
        const response = await axiosClient.put(
            '/app-admin/app/' + params.app_id + '/screen/' + params.screen_id + '/user-guide',
            { ...params.payload }
        );
        if (params.callback) {
            params.callback(response['data']);
        }
        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}

export async function deleteScreen(params) {
    try {
        const response = await axiosClient.delete(`/app/${params.appId}/screen/${params.screenId}`);
        if (params?.callback) {
            params.callback();
        }
        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}

export async function renameScreen(params) {
    try {
        const response = await axiosClient.put(`/app/${params.appId}/screen/${params.screenId}`, {
            ...params.payload
        });
        if (params.callback) {
            params.callback(response['data']);
        }
        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}

// export async function getConnSystemsData(params) {
//     try {
//         const response = await axiosClient.get(
//             '/app/' + params.app_id + '/screen/' + params.widget_id + '/connsystemsdata',
//             {}
//         );
//         if (params.callback) {
//             params.callback(response['data']);
//         }
//         return response['data'];
//     } catch (error) {
//         throw new Error(error);
//     }
// }

// export async function updateWidgetConnSystemsIdentifier(params) {
//     try {
//         const response = await axiosClient.put(
//             '/app/' + params.app_id + '/screen/' + params.widget_id,
//             { ...params.payload }
//         );
//         params.callback(response['data']);
//         return true;
//     } catch (error) {
//         throw error;
//     }
// }

// export async function deleteWidgetConnSystemsIdentifier(params) {
//     try {
//         const response = await axiosClient.delete(
//             '/app/delete/conn_systems_widget_identifier/' + params.payload.id,
//             {}
//         );
//         params.callback(response['data']);
//         return true;
//     } catch (error) {
//         throw error;
//     }
// }
