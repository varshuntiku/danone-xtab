import httpClient from 'services/httpClient.js';

export const getCopilotAppContexts = async (copilotAppId) => {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] +
                '/copilot/app/' +
                copilotAppId +
                '/contexts',
            {}
        );
        return response['data'];
    } catch (error) {
        throw error;
    }
};

export const deleteCopilotAppContext = async (copilotAppId, contextId) => {
    try {
        const response = await httpClient.delete(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] +
                '/copilot/app/' +
                copilotAppId +
                '/context/' +
                contextId
        );
        return response['data'];
    } catch (error) {
        throw error;
    }
};

export const createCopilotAppContext = async (params) => {
    const formData = new FormData();
    const contextData = JSON.parse(JSON.stringify(params.payload));

    if (params.documents) {
        params.documents?.forEach((f) => {
            formData.append('new_documents', f);
        });
    }

    formData.append('payload', JSON.stringify(contextData));

    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] +
                '/copilot/app/' +
                params.copilotAppId +
                '/context',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        params.callback(response['data'], 200);
        return true;
    } catch (error) {
        params.callback(error?.response?.data?.detail || null, 'error');
        // throw new Error(error);
    }
};

export const updateCopilotAppContext = async (params) => {
    const formData = new FormData();
    const context_data = JSON.parse(JSON.stringify(params.payload));

    if (params.documents) {
        params.documents?.forEach((f) => {
            formData.append('new_documents', f);
        });
    }
    if (context_data.context_documents?.length) {
        const existing_documents = [];
        const deleted_documents = [];
        context_data.context_documents.forEach((el) => {
            if (el.deleted) {
                deleted_documents.push(el);
            } else {
                existing_documents.push(el);
            }
            if (el.disableRestore) {
                delete el.disableRestore;
            }
        });
        formData.append('existing_documents', JSON.stringify(existing_documents));
        formData.append('deleted_documents', JSON.stringify(deleted_documents));
    }
    delete context_data.docs;
    formData.append('payload', JSON.stringify(context_data));

    try {
        const response = await httpClient.put(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] +
                '/copilot/app/' +
                params.copilotAppId +
                '/context/' +
                params.contextId,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        params.callback(response['data'], response['status']);
        return true;
    } catch (error) {
        params.callback(error?.response?.data?.detail || null, 'error');
        // throw new Error(error);
    }
};

export const getContextDetails = async (params) => {
    try {
        let url = '/copilot/app/' + params.copilotAppId + '/context-datasources';
        if (params.contextId) {
            url += `?context_id=${params.contextId}`;
        }
        const response = await httpClient.get(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + url,
            {}
        );
        return response['data'];
    } catch (error) {
        throw error;
    }
};
