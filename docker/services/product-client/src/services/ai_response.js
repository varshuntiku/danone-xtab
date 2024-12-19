import { axiosClient } from 'services/httpClient.js';

export async function getScreenAIResponse(params) {
    try {
        const response = await axiosClient.get(
            '/app/' + params.app_id + '/screens/' + params.screen_id + '/ai-response',
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function saveScreenAIResponse(params) {
    try {
        const response = await axiosClient.post(
            '/app/' + params.app_id + '/screens/' + params.screen_id + '/save-ai-response',
            { ...params.payload }
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function rateScreenAIResponse(params) {
    try {
        const response = await axiosClient.post(
            '/app/' + params.app_id + '/screens/' + params.screen_id + '/rate-ai-response',
            { ...params.payload }
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}

export async function getScreenAIResponseRatings(params) {
    try {
        const response = await axiosClient.get(
            '/app/' + params.app_id + '/screens/' + params.screen_id + '/get-ai-response-ratings',
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({ status: 'error' });
        // throw new Error(error);
    }
}
