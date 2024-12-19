import { axiosClient } from 'services/httpClient.js';

export async function saveScrenario(params) {
    try {
        const response = await axiosClient.post('/scenario/save', params.payload);
        params.callback(response['data']);
        return true;
    } catch (error) {
        return error;
    }
}

export async function getScrenarios(params) {
    try {
        const response = await axiosClient.put('/scenario/list', {
            app_id: Number(params['app_id']),
            screen_id: params['screen_id'],
            widget_id: params['widget_id'],
            filters: params['filters']
        });
        return response;
    } catch (error) {
        return error;
    }
}

export async function deleteScenarios(params) {
    try {
        const response = await axiosClient.delete(
            '/app/' + Number(params['app_id']) + '/scenario/' + Number(params['scenario_id']),
            {}
        );
        //params.callback(response);
        return response;
    } catch (error) {
        return error;
    }
}

export async function validScenarioName(params) {
    try {
        const response = await axiosClient.get(
            '/app/' +
                Number(params['app_id']) +
                '/' +
                Number(params['widget_id']) +
                '/' +
                Number(params['app_screen_id']) +
                '/scenario/validation/' +
                params['name'],
            {}
        );
        //params.callback(response);
        return response;
    } catch (error) {
        return error;
    }
}
