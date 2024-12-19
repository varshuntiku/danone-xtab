import httpClient, { axiosClient } from 'services/httpClient.js';

export async function getApp(params) {
    try {
        const response = await axiosClient.get('/app/' + params.app_id, {});
        response['data']['goto_app'] = params.goto_app;
        if (params.callback) {
            params.callback(response['data']);
        }
        return response.data;
    } catch (error) {
        params.callback({
            status: 'error',
            ...(error?.response?.data?.error && { message: error?.response?.data?.error })
        });
        // throw new Error(error);
    }
}
export async function getAppsByName(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_BACKEND_API'] + '/app/get-app-by-name/' + params.app_name,
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function editAppdetails(params) {
    try {
        const response = await axiosClient.put('/app/' + params.app_id, { ...params.payload });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw error;
    }
}

export function create_slug(screen_name) {
    if (!screen_name) {
        return false;
    }

    return encodeURIComponent(
        screen_name
            .trim()
            .replace('&', '')
            .replace('/', '')
            .replace('\\', '')
            .replace(/ {2}/g, ' ')
            .replace(/ /g, '-')
            .toLowerCase()
    );
}

export async function getKpis(params) {
    try {
        const response = await axiosClient.get('/app/' + params.app_id + '/kpis', {
            headers: { 'Codx-App-Id': params.app_id }
        });
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function editAppModules(params) {
    try {
        const response = await axiosClient.patch('/app-admin/app/' + params.app_id + '/modules', {
            ...params.payload
        });
        params.callback(response['data']);

        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function cloneApplication(params) {
    try {
        const response = await axiosClient.post('/app/clone', {
            ...params.payload.data,
            user_id: params.payload.user_id
        });
        response['data']['message'] = 'Application cloned successfully.';
        response['data']['link'] = '/app/' + response['data']['app_id'] + '/admin/overview';
        if (params?.callback) {
            params.callback(response['data']);
        }
        // return true;
        return response['data'];
    } catch (error) {
        // params.callback({ status: error.response?.data?.error || 'error' });
        throw {
            message: error.response?.data?.error || 'error',
            statusCode: error.response?.status || 500
        };
    }
}

export async function exportApp(params) {
    try {
        const response = await axiosClient.get('/app/' + params.app_id + '/export');
        if (params.callback) {
            params.callback(response['data']);
        }
        return response['data'];
    } catch (error) {
        throw {
            message: error.response?.data?.error || 'error',
            statusCode: error.response?.status || 500
        };
    }
}

export async function getAppLogo(params) {
    try {
        const response = await axiosClient.get('/app/' + params.app_id + '/get-logo', {});
        if (params.callback) {
            params.callback(response['data']);
        }
        return response.data;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function getProgressBar(params) {
    try {
        const response = await axiosClient.get(
            `/app/${params.app_id}/screen/${params.screen_id}/progress-bar`,
            {}
        );
        if (params.callback) {
            params.callback(response['data']);
        }
        return response.data;
    } catch (error) {
        return { status: 'error' };
    }
}

export async function deleteApp(params) {
    try {
        const response = await axiosClient.delete(
            import.meta.env['REACT_APP_NUCLIOS_BACKEND_API'] + '/app/' + params.appId,
            {}
        );
        params.callback(response['data']);
    } catch (error) {
        params.callback('error');
    }
}
