import httpClient, { axiosClient } from 'services/httpClient.js';
import { isDEEWorking, modifyDEEStatus } from 'services/deeService.js';

export async function getDynamicExecEnvs(params) {
    try {
        if (isDEEWorking() && import.meta.env['REACT_APP_DEE_ENV_ENABLED']) {
            let url =
                import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] +
                '/dynamic-execution-environment/execution-environments?env_category=' +
                params.env_category;
            const response = await httpClient.get(url, {});
            let responseData = response['data'];
            params.callback(responseData);
        } else {
            const response = await axiosClient.get('/dynamic-execution-environments', {});
            params.callback(response['data']);
        }
        return true;
    } catch (error) {
        if (error?.response?.status || error?.message === 'Network Error') {
            modifyDEEStatus(error?.response?.status || 404);
        }
        params.callback(null, 'error');
    }
}

export async function getDefaultDynamicExecEnvs(params) {
    try {
        const response = await axiosClient.get('/dynamic-execution-environments/default', {});
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
        // throw new Error(error);
    }
}

export async function deleteDynamicExecEnv(params) {
    try {
        await axiosClient.delete('/dynamic-execution-environments/' + params.id, {});
        params.callback();
        return true;
    } catch (error) {
        params.callback('error');
    }
}

export async function createDynamicExecEnv(params) {
    try {
        await axiosClient.post('/dynamic-execution-environments', params.payload);
        params.callback();
        return true;
    } catch (error) {
        params.callback('error');
    }
}

export async function updateDynamicExecEnv(params) {
    try {
        await axiosClient.post(
            '/dynamic-execution-environments/' + params.payload.id,
            params.payload
        );
        params.callback();
        return true;
    } catch (error) {
        params.callback('error');
    }
}

export async function startDynamicExecEnv(params) {
    try {
        await axiosClient.get('/dynamic-execution-environments/' + params.id + '/start', {});
        params.callback();
        return true;
    } catch (error) {
        params.callback('error');
    }
}

export async function updateDynamicExecEnvAppMapping(params) {
    try {
        if (isDEEWorking() && import.meta.env['REACT_APP_DEE_ENV_ENABLED']) {
            let url =
                import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] +
                '/dynamic-execution-environment/execution-environments/custom/link';
            let payload = {
                app_id: params.payload.app_id,
                env_id: params.payload.exec_env_id
            };
            const response = await httpClient.post(url, payload);
            let responseData = response['data'];
            responseData.dynamic_env_id = responseData.env_id;
            params.callback(responseData);
        } else {
            const response = await axiosClient.put(
                '/dynamic-execution-environments/app',
                params.payload
            );
            params.callback(response['data']);
        }
        return true;
    } catch (error) {
        if (error?.response?.status || error?.message === 'Network Error') {
            modifyDEEStatus(error?.response?.status || 404);
        }
        params.callback(null, 'error');
    }
}

export async function getDynamicExecEnvAppMapping(params) {
    try {
        if (isDEEWorking() && import.meta.env['REACT_APP_DEE_ENV_ENABLED']) {
            let url =
                import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] +
                '/dynamic-execution-environment/execution-environments/custom/link/app/' +
                params.appId;
            if (params?.queryParams) url += '?' + params.queryParams;
            const response = await httpClient.get(url, {});
            let responseData = response['data'];
            responseData.dynamic_env_id = responseData.env_id;
            params.callback(responseData);
        } else {
            const response = await axiosClient.get(
                '/dynamic-execution-environments/app/' + params.appId,
                {}
            );
            params.callback(response['data']);
        }
        return true;
    } catch (error) {
        if (error?.response?.status || error?.message === 'Network Error') {
            modifyDEEStatus(error?.response?.status || 404);
        }
        params.callback(null, 'error');
    }
}

export async function getExecEnvs(params) {
    let url = params.projectId
        ? import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] +
          `/dynamic-execution-environment/execution-environments?env_category=${params.env_category}&project_id=${params.projectId}`
        : import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] +
          `/dynamic-execution-environment/execution-environments?env_category=${params.env_category}`;

    try {
        const response = await httpClient.get(url, {});
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
    }
}

export async function createExecEnv(params) {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] +
                '/dynamic-execution-environment/execution-environments',
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback(error, 'error');
        // throw new Error(error);
    }
}

export async function updateExecEnv(params) {
    try {
        const response = await httpClient.patch(
            import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] +
                '/dynamic-execution-environment/execution-environments/' +
                params.execEnvUpdateId,
            params.payload
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback(error, 'error');
    }
}

export async function deleteExecEnv(params) {
    try {
        const response = await httpClient.delete(
            import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] +
                '/dynamic-execution-environment/execution-environments/' +
                params.execEnvDeleteId,
            {}
        );
        params.callback(response);
        return true;
    } catch (error) {
        params.callback('error', error);
    }
}

export async function getExecPackages(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] +
                `/envs/packages/list?env_category=${params.env_category}&tag_core_packages=false&exclude_core_packages=true`,
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
    }
}

export const getExecEnvsStatusById = async (id) => {
    return httpClient.get(
        `${
            import.meta.env['REACT_APP_DEE_ENV_BASE_URL']
        }/dynamic-execution-environment/execution-environments/${id}`
    );
};

export const getExecEnvsCurrentStatusById = async (params) => {
    try {
        const response = await httpClient.get(
            `${
                import.meta.env['REACT_APP_DEE_ENV_BASE_URL']
            }/dynamic-execution-environment/execution-environments/${params.envId}`
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
    }
};

export async function getSkuDropdownList(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] +
                '/dynamic-execution-environment/compute/configurations',
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
    }
}

export async function getVerifyPackages(params) {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] +
                '/dynamic-execution-environment/execution-environments/validate/packages',
            params.payload
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(error, 'error', params.packageLists);
    }
}

export async function getExecEnvStatusStream(params) {
    try {
        await httpClient.get(
            `${
                import.meta.env['REACT_APP_DEE_ENV_BASE_URL']
            }/dynamic-execution-environment/execution-environments/${params.id}/stream-status`,
            {
                headers: {
                    Accept: 'text/event-stream'
                },
                onDownloadProgress: (evt) => {
                    let data = evt?.target?.responseText;
                    const dataSplit = data?.split('\n').filter((item) => item !== '');
                    const recentData = dataSplit?.[dataSplit?.length - 1];
                    data = JSON.parse(recentData?.substring(5));
                    params.callback({ data: data }, false);
                }
                // we can try below after axios v1.6.8
                // responseType: 'stream',
                // adapter: 'fetch',
            }
        );
        return true;
    } catch (error) {
        params.callback('error', error);
    }
}

export async function getAllDynamicExecEnvs(params) {
    try {
        let url =
            import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] +
            '/dynamic-execution-environment/execution-environments';
        const response = await httpClient.get(url, {});
        let responseData = response['data'];
        params.callback(responseData);
        return true;
    } catch (error) {
        params.callback(null, 'error');
    }
}

export async function postApprovalsOrReject(params) {
    try {
        let url =
            import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] +
            `/dynamic-execution-environment/execution-environments/${params.id}/action`;
        await httpClient.post(url, params.payload);
        params.callback();
        return true;
    } catch (error) {
        params.callback(error, 'error');
    }
}
