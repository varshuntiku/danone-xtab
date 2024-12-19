import httpClient from 'services/httpClient.js';

export const getAllDeployedModels = async (params) => {
    try {
        return await httpClient.get(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/copilot/llm-models/list',
            {
                params
            }
        );
    } catch (error) {
        throw error;
    }
};
