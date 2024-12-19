import httpClient from 'services/httpClient.js';

export const createCopilotApplication = async (params) => {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/copilot/app',
            { ...params.payload }
        );
        params.callback(response['data'], response['status']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
        // throw new Error(error);
    }
};

export const updateCopilotApplication = async (copilotAppId, payload) => {
    try {
        const response = await httpClient.put(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/copilot/app/' + copilotAppId,
            { ...payload }
        );
        return response['data'];
    } catch (error) {
        throw error;
    }
};

export const getCopilotApplication = async (copilotAppId) => {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/copilot/app/' + copilotAppId,
            {}
        );
        return response['data'];
    } catch (error) {
        throw error;
        // throw new Error(error);
    }
};

export const getCopilotApplications = async (params) => {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/copilot/apps',
            {}
        );
        if (params?.callback) {
            params.callback(response['data']);
        }
        return response.data;
    } catch (error) {
        if (params?.callback) {
            params.callback(null, 'error');
        } else {
            throw new Error(error);
        }
    }
};

export const deleteCopilotApplication = async (copilotAppId) => {
    try {
        const response = await httpClient.delete(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/copilot/app/' + copilotAppId
        );
        return response['data'];
    } catch (error) {
        throw error;
        // throw new Error(error);
    }
};
