import { axiosClient } from 'services/httpClient.js';

export async function saveAppOverview(params) {
    try {
        const response = await axiosClient.post('/app-admin/app/' + params.app_id + '/overview', {
            ...params.payload
        });
        params.callback(response['data']);
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function applyApplicationTheme(params) {
    try {
        const response = await axiosClient.post(
            '/app-admin/app/' + params.app_id + '/apply-theme',
            { ...params.payload }
        );
        return response['data'];
    } catch (error) {
        throw error;
    }
}
