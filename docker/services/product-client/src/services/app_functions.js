import httpClient, { axiosClient } from 'services/httpClient.js';
import { isDEEWorking, modifyDEEStatus } from 'services/deeService.js';

export async function getAllAppFunctions(params) {
    try {
        const response = await axiosClient.get(
            '/app-admin/app/' + params.appId + '/app-function/list',
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
    }
}

export async function getAppFunction(params) {
    try {
        const response = await axiosClient.get(
            '/app-admin/app/' + params.appId + '/app-function/value/' + params.key,
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
        // throw new Error(error);
    }
}

export async function createAppFunction(params) {
    try {
        const response = await axiosClient.post(
            '/app-admin/app/' + params.appId + '/app-function/value/' + params.key,
            params.payload
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback('error');
    }
}

export async function updateAppFunction(params) {
    try {
        const response = await axiosClient.put(
            '/app-admin/app/' + params.appId + '/app-function/value/' + params.key,
            params.payload
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback('error');
    }
}

export async function testAppFunction(params) {
    try {
        let url = '/app-admin/app/' + params.appId + '/app-function/test/' + params.key;
        let payload = params.payload;
        if (isDEEWorking() && import.meta.env['REACT_APP_DEE_ENV_ENABLED']) {
            url = import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] + '/execute/app-function/test';
            payload = {
                ...params.payload,
                app_id: params.appId,
                function_name: params.key,
                function_value: params.payload.value,
                code_string: params.payload.test
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
        params.callback('error');
    }
}

export async function deleteAppFunction(params) {
    try {
        const response = await axiosClient.delete(
            '/app-admin/app/' + params.appId + '/app-function/value/' + params.key,
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback('error');
    }
}
