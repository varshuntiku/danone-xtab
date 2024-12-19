import httpClient, { axiosClient } from 'services/httpClient.js';

export async function getDesignData(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/projects/get-project-blueprint/' +
                params.project_id,
            {}
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function getAjaxProjects(params) {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] + '/projects/list',
            {
                pageSize: params.pageSize || 5,
                page: params.page || 0,
                filtered: [{ id: 'name', value: params.search_term }]
            }
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function saveProjectBlueprint(params) {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/projects/save-project-blueprint/' +
                params.project_id,
            {
                blueprint: params.blueprint
            }
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function createProject(params) {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] + '/projects',
            {
                name: params.name,
                industry: '',
                project_status: 1,
                assignees: [],
                reviewer: null
            }
        );

        const app_response = await axiosClient.post('/app-admin/' + params.app_id + '/setup-app', {
            project_id: response['data'].id
        });

        params.callback(app_response);
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function getIterationTags(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/project-notebooks/get-tags/' +
                params.notebook_id,
            {}
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function getIterations(params) {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/project-notebooks/' +
                params.notebook_id +
                '/get-iterations',
            {
                pageSize: params.pageSize || 10,
                page: params.page || 0
            }
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function getIterationResults(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/project-notebooks/get-results/' +
                params.iteration_id,
            {}
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function getWidgetData(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] + '/projects/widgets',
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getArtifactsData(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/projects/get-project-artifacts/' +
                params.project_id,
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function getDesignModulesData(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/projects/get-project-metadata/' +
                params.project_id,
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getAdminDetails(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/app-configs/get-app-details/' +
                params.deployed_app_id,
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function getAdminDetailsFromId(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/app-configs/get-app-details-fromid/' +
                params.app_id,
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function getIterationResultOptionsFromNotebookId(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/app-configs/get-result-options-from-nb-id/' +
                params.notebook_id,
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getIterationResultOptionsFromDeployedAppId(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/app-configs/get-result-options-from-deployed-app-id/' +
                params.deployed_app_id,
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function downloadBlueprintCode(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/projects/download-code/' +
                params.project_id,
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getWidgetComponents(params) {
    try {
        if (typeof params.widget_id === 'number') {
            const response = await httpClient.get(
                import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                    '/projects/get-widget-components/' +
                    params.widget_id,
                {}
            );
            params.callback(response['data']);
        } else {
            params.callback({
                status: 'success',
                metadata: false,
                code_demo: false,
                code_details: false
            });
        }

        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getWidgetCode(params) {
    try {
        const response = await httpClient.put(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/projects/get-code/' +
                params.project_id,
            {
                widget_id: params['widget_id'],
                base_widget_id: params['base_widget_id']
            }
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function fileDownloadRequest(params) {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] + '/app-configs/gen-file',
            params
        );
        return response;
    } catch (error) {
        throw new Error(error);
    }
}
