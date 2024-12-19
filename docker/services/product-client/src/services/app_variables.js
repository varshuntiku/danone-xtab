import { axiosClient } from 'services/httpClient.js';

export async function getAllAppVariables(params) {
    try {
        const response = await axiosClient.get(
            '/app-admin/app/' + params.appId + '/app-variable/keys',
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
    }
}

export async function getAppVariable(params) {
    try {
        const response = await axiosClient.get(
            '/app-admin/app/' + params.appId + '/app-variable/value/' + params.key,
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
        // throw new Error(error);
    }
}

export async function createAppVariable(params) {
    try {
        const response = await axiosClient.post(
            '/app-admin/app/' + params.appId + '/app-variable/value/' + params.key,
            params.payload
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback('error');
    }
}

export async function updateAppVariable(params) {
    try {
        const response = await axiosClient.put(
            '/app-admin/app/' + params.appId + '/app-variable/value/' + params.key,
            params.payload
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback('error');
    }
}

export async function deleteAppVariable(params) {
    try {
        const response = await axiosClient.delete(
            '/app-admin/app/' + params.appId + '/app-variable/value/' + params.key,
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback('error');
    }
}
