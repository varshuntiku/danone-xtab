import { axiosClient } from 'services/httpClient.js';

export async function addApplication(params) {
    try {
        let response;
        if (params.payload.data.source_file?.length) {
            const formData = new FormData();
            formData.append('app_data', JSON.stringify(params.payload.data));
            formData.append('source_file', params.payload.data.source_file[0]);
            response = await axiosClient.post('/app/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } else {
            response = await axiosClient.post('/app-admin/app', { ...params.payload.data });
        }
        response['data']['message'] = 'Application added successfully.';
        response['data']['link'] = '/app/' + response['data']['app_id'] + '/admin/overview';
        if (params?.callback) {
            params.callback(response['data']);
        }
        // return true;
        return response['data'];
    } catch (error) {
        if (params.callback) {
            params.callback({ status: error.response?.data?.error || 'error' });
        }
        throw error;
    }
}

export async function getScreenConfig(params) {
    try {
        const response = await axiosClient.get('/app-admin/app/' + params.app_id + '/screens', {});
        if (params.callback) {
            params.callback(response['data']);
        }
        return response.data;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function saveScreenConfig(params) {
    try {
        const response = await axiosClient.post(
            '/app-admin/app/' + params.app_id + '/screens',
            params.payload
        );
        if (params.callback) {
            params.callback(response['data']);
        }
        return response.callback;
    } catch (error) {
        throw error;
    }
}

export async function fetchFilterUIAC(params) {
    try {
        const response = await axiosClient.get(
            '/app/' + params.app_id + '/screen/' + params.screen_id + '/filter/uiac'
        );
        if (params.callback) {
            params.callback(response.data);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function fetchActionSettingsUIAC(params) {
    try {
        const response = await axiosClient.get(
            '/app/' + params.app_id + '/screen/' + params.screen_id + '/action/uiac'
        );
        if (params.callback) {
            params.callback(response.data);
        }
    } catch (error) {
        throw error;
    }
}

export async function fetchWidgetUIAC(params) {
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
        if (params.callback) {
            params.callback(response.data);
        }
    } catch (error) {
        throw error;
    }
}
export async function replicateAppFromVersion(params) {
    try {
        const response = await axiosClient.post('/app/replicate', params.payload);
        response['data']['link'] = '/app/' + response['data']['new_app_id'] + '/admin/overview';
        params.callback(response['data']);
    } catch (error) {
        params.callback({ status: error.response?.data?.error || '' });
        // throw new Error(error);
    }
}

export async function resetAppVersion(params) {
    try {
        const response = await axiosClient.post('/app/' + params.app_id + '/reset', params.payload);
        if (params.callback) {
            params.callback(response['data']);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getUiacArchives(params) {
    try {
        let response;
        if (params.archiveType === 'visual') {
            response = await axiosClient.get(
                '/app-admin/app/' + params.app_id + '/archived-uiac/list'
            );
        } else if (params.archiveType === 'filter') {
            response = await axiosClient.get(
                '/app-admin/app/' + params.app_id + '/archived-filter-uiac/list'
            );
        }
        return response.data;
    } catch (error) {
        throw error;
    }
}
