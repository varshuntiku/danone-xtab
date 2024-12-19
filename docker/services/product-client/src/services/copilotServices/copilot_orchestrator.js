import httpClient from 'services/httpClient.js';

export const getCopilotOrchestrators = async () => {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/copilot/orchestrator/list',
            {}
        );
        return response['data'];
    } catch (error) {
        throw error;
        // throw new Error(error);
    }
};
