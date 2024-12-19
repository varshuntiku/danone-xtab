import httpClient from 'services/httpClient.js';
import * as _ from 'underscore';

export async function getExecEnvs(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] + '/execution-environments',
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function deleteExecEnv(params) {
    try {
        const response = await httpClient.delete(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/execution-environments/' +
                params.id,
            {}
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function createExecEnv(params) {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] + '/execution-environments',
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function updateExecEnv(params) {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/execution-environments/' +
                params.execution_environment_id,
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function startExecEnv(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/execution-environments/' +
                params.execution_environment_id +
                '/start',
            {}
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function stopExecEnv(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/execution-environments/' +
                params.execution_environment_id +
                '/stop',
            {}
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function getNotebooks(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/project-notebooks/' +
                params.project_id,
            {}
        );
        const response_data = _.filter(response['data'], function (data_item) {
            return data_item.name;
        });

        params.callback(response_data);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function deleteNotebook(params) {
    try {
        const response = await httpClient.delete(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] + '/project-notebooks/' + params.id,
            {}
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function createNotebook(params) {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/project-notebooks/' +
                params.payload.project_id,
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function updateNotebook(params) {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/project-notebooks/' +
                params.payload.project_id +
                '/' +
                params.notebook_id,
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function getNotebookDesign(params) {
    try {
        var response = false;
        if (params.iteration_id) {
            response = await httpClient.get(
                import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                    '/projects-notebooks/' +
                    params.notebook_id +
                    '/iterations/' +
                    params.iteration_id +
                    '/blueprint',
                {}
            );
        } else {
            response = await httpClient.get(
                import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                    '/projects-notebooks/' +
                    params.notebook_id +
                    '/blueprint',
                {}
            );
        }
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function saveNotebookDesign(params) {
    try {
        var response = false;
        if (params.iteration_id) {
            response = await httpClient.post(
                import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                    '/projects-notebooks/' +
                    params.notebook_id +
                    '/iterations/' +
                    params.iteration_id +
                    '/blueprint',
                {
                    blueprint: params.blueprint
                }
            );
        } else {
            response = await httpClient.post(
                import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                    '/projects-notebooks/' +
                    params.notebook_id +
                    '/blueprint',
                {
                    blueprint: params.blueprint
                }
            );
        }
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function executeBlueprintWidget(params) {
    try {
        var response = false;
        if (params.iteration_id) {
            response = await httpClient.get(
                import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                    '/projects-notebooks/' +
                    params.notebook_id +
                    '/iterations/' +
                    params.iteration_id +
                    '/widget/' +
                    params.widget_id +
                    '/execute',
                {}
            );
        } else {
            response = await httpClient.get(
                import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                    '/projects-notebooks/' +
                    params.notebook_id +
                    '/widget/' +
                    params.widget_id +
                    '/execute',
                {}
            );
        }
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function getBlueprintWidgetOutputs(params) {
    try {
        var response = false;
        if (params.iteration_id) {
            response = await httpClient.get(
                import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                    '/projects-notebooks/' +
                    params.notebook_id +
                    '/iterations/' +
                    params.iteration_id +
                    '/widget/' +
                    params.widget_id +
                    '/outputs',
                {}
            );
        } else {
            response = await httpClient.get(
                import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                    '/projects-notebooks/' +
                    params.notebook_id +
                    '/widget/' +
                    params.widget_id +
                    '/outputs',
                {}
            );
        }

        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function getBlueprintWidgetInputs(params) {
    try {
        var response = false;
        if (params.iteration_id) {
            response = await httpClient.post(
                import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                    '/projects-notebooks/' +
                    params.notebook_id +
                    '/iterations/' +
                    params.iteration_id +
                    '/widget/get-inputs',
                params.payload
            );
        } else {
            response = await httpClient.post(
                import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                    '/projects-notebooks/' +
                    params.notebook_id +
                    '/widget/get-inputs',
                params.payload
            );
        }
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function getBlueprintWidgetOutput(params) {
    try {
        var response = false;
        if (params.iteration_id) {
            response = await httpClient.post(
                import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                    '/projects-notebooks/' +
                    params.notebook_id +
                    '/iterations/' +
                    params.iteration_id +
                    '/widget/' +
                    params.widget_id +
                    '/outputs',
                params.payload
            );
        } else {
            response = await httpClient.post(
                import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                    '/projects-notebooks/' +
                    params.notebook_id +
                    '/widget/' +
                    params.widget_id +
                    '/outputs',
                params.payload
            );
        }
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function getWidgetDefaultCode(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/project-notebooks/' +
                params.widget_id +
                '/get-default-code',
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function getBlueprintExecutionStatus(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/project-notebooks/' +
                params.widget_id +
                '/get-default-code',
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function executeBlueprint(params) {
    try {
        var response = false;
        if (params.iteration_id) {
            response = await httpClient.post(
                import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                    '/project-notebooks/' +
                    params.notebook_id +
                    '/iterations/' +
                    params.iteration_id +
                    '/execute',
                {}
            );
        } else {
            response = await httpClient.post(
                import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                    '/project-notebooks/' +
                    params.notebook_id +
                    '/execute',
                {}
            );
        }
        params.callback(response['data']);
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function getNotebookIterations(params) {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/project-notebooks/' +
                params.notebook_id +
                '/get-iterations',
            {}
        );
        params.callback(response['data']['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function createNotebookIteration(params) {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/project-notebooks/' +
                params.notebook_id +
                '/iterations',
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function updateNotebookIteration(params) {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/project-notebooks/' +
                params.notebook_id +
                '/iterations/' +
                params.iteration_id,
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function deleteNotebookIteration(params) {
    try {
        const response = await httpClient.delete(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] +
                '/project-notebooks/' +
                params.params.notebook_id +
                '/iterations/' +
                params.id,
            {}
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}
