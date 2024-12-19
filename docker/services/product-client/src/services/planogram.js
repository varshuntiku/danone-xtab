import { axiosClient } from 'services/httpClient.js';

export async function getPlanogram(params) {
    try {
        const response = await axiosClient.get(
            '/app/' + params.app_id + '/' + params.widget_value_id + '/planogram',
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function savePlanogram(params) {
    try {
        const response = await axiosClient.post(
            '/app/' + params.app_id + '/' + params.widget_value_id + '/planogram',
            {
                widget_value_id: params.widget_value_id,
                planogram: params.planogram,
                skus: params.skus,
                user_name: sessionStorage.getItem('user_name'),
                approve: params.approve,
                publish: params.publish
            }
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function getActionInference(params) {
    try {
        const response = await axiosClient.post(
            '/app/' +
                params.app_id +
                '/' +
                params.widget_value_id +
                '/planogram/genai/action_indetifier',
            {
                widget_value_id: params.widget_value_id,
                planogram: params.planogram,
                skus: params.skus,
                user_name: sessionStorage.getItem('user_name'),
                action_command: params.action_command
            }
        );

        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}

export async function getAnalyticsRearrangement(params) {
    try {
        const response = await axiosClient.post(
            '/app/' + params.app_id + '/' + params.widget_value_id + '/planogram/genai/rearrange',
            {
                widget_value_id: params.widget_value_id,
                planogram: params.planogram,
                skus: params.skus,
                user_name: sessionStorage.getItem('user_name'),
                analytics_file: params.analytics_file,
                rearrangement_rules: params.rearrangement_rules,
                sku_affinities: params.sku_affinities
            }
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
    }
}
