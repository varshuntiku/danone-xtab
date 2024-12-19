import httpClient from 'services/httpClient.js';

export const getPublishedTools = async (registry_id = 1) => {
    const response = await httpClient.get(
        import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/copilot_tool/published-tool/list',
        {
            params: {
                registry_id: registry_id
            }
        }
    );
    return response.data;
};

export const saveCopilotAppTool = async (is_test, appId, payload) => {
    const api = is_test
        ? import.meta.env['REACT_APP_COPILOT_TEST_API']
        : import.meta.env['REACT_APP_MINERVA_BACKEND_URL'];
    const response = await httpClient.post(api + `/copilot/app/${appId}/tool`, payload);
    return response.data;
};

export const updateCopilotAppTool = async (is_test, mappingId, payload) => {
    const api = is_test
        ? import.meta.env['REACT_APP_COPILOT_TEST_API'] ||
          import.meta.env['REACT_APP_MINERVA_BACKEND_URL']
        : import.meta.env['REACT_APP_MINERVA_BACKEND_URL'];
    const response = await httpClient.put(api + `/copilot/app-tool/${mappingId}`, payload);
    return response.data;
};

export const fetchMappedTools = async (appId) => {
    const response = await httpClient.get(
        import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + `/copilot/app/${appId}/tool/list`,
        {}
    );
    return response.data;
};

export const removeCopilotAppTool = async (id) => {
    const response = await httpClient.delete(
        import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + `/copilot/app-tool/${id}`
    );
    return response.data;
};

export const deployApplication = async (id) => {
    const response = await httpClient.post(
        import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + `/copilot/app/${id}/deploy`
    );
    return response.data;
};

export const uploadCopilotAvatar = async (copilot_app_id, file) => {
    try {
        const formData = new FormData();
        formData.append('avatar', file);
        const response = await httpClient.post(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] +
                '/copilot/app/' +
                copilot_app_id +
                '/avatar',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};

export const getPublishedToolsDocs = async (tool_id, is_test) => {
    const api = is_test
        ? import.meta.env['REACT_APP_COPILOT_TEST_API'] ||
          import.meta.env['REACT_APP_MINERVA_BACKEND_URL']
        : import.meta.env['REACT_APP_MINERVA_BACKEND_URL'];
    const response = await httpClient.get(api + '/copilot_tool/published-tool/' + tool_id + '/doc');
    return response.data;
};

export const getCopilotToolRegistryList = async () => {
    const response = await httpClient.get(
        import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/copilot/tool-registry/list'
    );
    return response.data;
};

export const getCopilotAppTool = async (mappingId) => {
    const response = await httpClient.get(
        import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + `/copilot/app-tool/${mappingId}`
    );
    return response.data;
};
