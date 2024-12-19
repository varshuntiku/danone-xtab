import httpClient, { axiosClient } from 'services/httpClient.js';
import { isDEEWorking, modifyDEEStatus } from 'services/deeService.js';
// var tabledata = require("./sampleWidgetJson/dynamicSimulator.json")

export async function getWidget(params) {
    // for testing purposes go to widet specific sample json file in ./sampleWidgetJson/yourwidgetdata.json
    // setTimeout(params.callback.bind(null, tabledata), 1000);
    // return;
    try {
        const response = await axiosClient.put(
            '/app/' + params.app_id + '/screens/' + params.screen_id + '/widget',
            {
                widget: params['details'],
                filters: params['filters']
            }
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            params.callback({ status: 'error', message: error.response.data.error });
        } else {
            params.callback({ status: 'error' });
        }
        // throw new Error(error);
    }
}

export async function getMultiWidget(params) {
    // setTimeout(params.callback.bind(null, tabledata), 1000);
    // return;
    try {
        let url = '/app/' + params.app_id + '/screens/' + params.screen_id + '/multi-widget';
        let payload = {
            widget: params['details'],
            filters: params['filters'],
            widget_event: params['widget_event'],
            crossWidgetFilterData: params['crossWidgetFilterData'],
            prev_screen_data: params['prev_screen_data'],
            data_state_key: params.data_state_key
        };
        if (isDEEWorking() && import.meta.env['REACT_APP_DEE_ENV_ENABLED']) {
            url = import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] + '/execute/uiac/render';
            payload.app_id = params.app_id;
            payload.widget_id = params['details']['id'];
            const response = await httpClient.post(url, payload);
            params.callback(response['data']);
        } else {
            const response = await axiosClient.put(url, payload);
            params.callback(response['data']);
        }
        return true;
    } catch (error) {
        if (error?.response?.status || error?.message === 'Network Error') {
            modifyDEEStatus(error?.response?.status || 404);
        }
        if (error.response && error.response.data && error.response.data.error) {
            params.callback({ status: 'error', message: error.response.data.error });
        } else {
            getMultiWidget(params);
        }
        // throw new Error(error);
    }
}

export async function executeCode(params) {
    try {
        const response = await axiosClient.put('/app/' + params.app_id + '/execute-code', {
            inputs: params['inputs'],
            code: params['code'],
            selected_filters: params['selected_filters']
        });
        params.callback(response['data']);
        return true;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            params.callback({ status: 'error', message: error.response.data.error });
        } else {
            params.callback({ status: 'error' });
        }
        // throw new Error(error);
    }
}

export async function triggerWidgetActionHandler(params) {
    // setTimeout(params.callback.bind(null, WidgetData2), 500);
    // return;
    let response = {};
    try {
        if (isDEEWorking() && import.meta.env['REACT_APP_DEE_ENV_ENABLED']) {
            let url = import.meta.env['REACT_APP_DEE_ENV_BASE_URL'] + '/execute/uiac/render';
            let payload = { ...params.payload };
            payload.app_id = params.app_id;
            payload.widget_id = payload?.widget_value_id || params?.details?.id;
            response = await httpClient.post(url, payload);
            response['data'] = response?.data?.data?.value;
            if (params.callback) params.callback(response['data']);
        } else {
            response = await axiosClient.post(
                '/app/' +
                    params.app_id +
                    '/screens/' +
                    params.screen_id +
                    '/execute-dynamic-action',
                {
                    ...params.payload
                }
            );
            if (params.callback) {
                params.callback(response['data']);
            }
        }
        return response['data'];
    } catch (error) {
        if (error?.response?.status || error?.message === 'Network Error') {
            modifyDEEStatus(error?.response?.status || 404);
        }
        throw error;
    }
}

export async function rearrangeWidgets(params) {
    try {
        const response = await axiosClient.put(
            `/app/${params.appId}/screen/${params.screenId}/rearrange-widgets`,
            { ...params.payload }
        );
        if (params.callback) {
            params.callback(response['data']);
        }
        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}
