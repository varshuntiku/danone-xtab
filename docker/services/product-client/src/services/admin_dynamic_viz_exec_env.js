import httpClient from 'services/httpClient.js';

export async function getDynamicExecEnvs(params) {
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

export async function deleteDynamicExecEnv(params) {
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

export async function createDynamicExecEnv(params) {
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

export async function updateDynamicExecEnv(params) {
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

export async function startDynamicExecEnv(params) {
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
