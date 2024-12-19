import { axiosClient } from 'services/httpClient.js';

// saving decison flow
export async function saveDecisionFlow(params) {
    const meta_data = {
        dashboard: params.dashboard,
        process: params.process,
        problem: params.problem,
        question: params.question
    };
    const nodeData = { ...params.payload };
    try {
        const response = await axiosClient.put(`/dashboard/decision-flows`, {
            meta_data,
            nodeData
        });
        params.callback(response.data);
        return true;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            params.callback({ status: 'error', message: error.response.data.error });
        } else {
            params.callback({ status: 'error', message: error });
        }
    }
}

// get request for decision flow
export async function getDecisionFlow(params) {
    try {
        const response = await axiosClient.get(
            `/dashboard/decision-flows?dashboard=${params.dashboard}&process=${params.process}&problem=${params.problem}&question=${params.question}`,
            { ...params.payload }
        );
        params.callback(response.data);
        return true;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            params.callback({ status: 'error', message: error.response.data.error });
        } else {
            params.callback({ status: 'error', message: error });
        }
    }
}
