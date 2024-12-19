import httpClient, { axiosClient } from 'services/httpClient.js';
import { isDEEWorking, modifyDEEStatus } from 'services/deeService.js';

export async function getFilters(params) {
    try {
        const response = await axiosClient.get(
            '/app/' + params.app_id + '/screens/' + params.screen_id + '/filters',
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getDynamicfilters(params) {
    try {
        let url = '/app/' + params.app_id + '/screens/' + params.screen_id + '/dynamic-filters';
        let payload = { ...params.payload };
        if (isDEEWorking() && import.meta.env['REACT_APP_DEE_ENV_ENABLED']) {
            url = import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] + '/execute/filter/render';
            payload.app_id = params.app_id;
            payload.screen_id = params.screen_id;
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
        // throw new Error(error);
    }
}

export async function getWidgetfilters(params) {
    try {
        let url =
            '/app/' +
            params.app_id +
            '/screens/' +
            params.screen_id +
            '/widgets/' +
            params.widget_id +
            '/dynamic-widget-filters';
        let payload = { ...params.payload };
        if (isDEEWorking() && import.meta.env['REACT_APP_DEE_ENV_ENABLED']) {
            url = import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] + '/execute/widget_filter/render';
            payload.app_id = params.app_id;
            payload.screen_id = params.screen_id;
            payload.widget_id = params.widget_id;
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
        // throw new Error(error);
    }
}

export async function testFilters(params) {
    try {
        let url = '/app-admin/app/' + params.app_id + '/test-filters';
        let payload = { ...params.payload };
        if (isDEEWorking() && import.meta.env['REACT_APP_DEE_ENV_ENABLED']) {
            url = import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] + '/execute/filter/test';
            payload.app_id = params.app_id;
            payload.screen_id = params.screen_id;
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

export async function previewFilters(params) {
    try {
        let url = '/app-admin/app/' + params.app_id + '/preview-filters';
        let payload = { ...params.payload };
        if (isDEEWorking() && import.meta.env['REACT_APP_DEE_ENV_ENABLED']) {
            url = import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] + '/execute/filter/render';
            payload.app_id = params.app_id;
            payload.screen_id = params.screen_id;
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

export async function previewActions(params) {
    try {
        let url = '/app-admin/app/' + params.app_id + '/preview-actions';
        let payload = { ...params.payload };
        if (isDEEWorking() && import.meta.env['REACT_APP_DEE_ENV_ENABLED']) {
            url = import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] + '/execute/action/render';
            payload.app_id = params.app_id;
            payload.screen_id = params.screen_id;
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

export async function saveScreenOverview(params) {
    try {
        const response = await axiosClient.post(
            '/app-admin/app/' + params.app_id + '/screen/' + params.screen_id + '/save-overview',
            { ...params.payload }
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function saveScreenFilterSettings(params) {
    try {
        const response = await axiosClient.post(
            '/app-admin/app/' + params.app_id + '/screen/' + params.screen_id + '/save-filters',
            { ...params.payload }
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function previewVisualization(params) {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_BACKEND_API'] +
                '/app-admin/app/' +
                params.app_id +
                '/preview-visualization',
            { ...params.payload }
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function testVisualization(params) {
    try {
        let url = '/app-admin/app/' + params.app_id + '/test-visualization';
        let payload = { ...params.payload };
        if (isDEEWorking() && import.meta.env['REACT_APP_DEE_ENV_ENABLED']) {
            url = import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] + '/execute/uiac/test';
            payload.app_id = params.app_id;
            // payload.filters = params.filters;
            // payload.data_state_key = params.data_state_key;
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
