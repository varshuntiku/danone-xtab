import httpClient from 'services/httpClient.js';

export const createCopilotAppDatasource = async (params) => {
    const formData = new FormData();
    const datasourceData = JSON.parse(JSON.stringify(params.payload));

    if (params.documents) {
        params.documents?.forEach((f) => {
            formData.append('new_documents', f);
        });
    }

    formData.append('payload', JSON.stringify(datasourceData));

    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] +
                '/copilot/app/' +
                params.copilotAppId +
                '/datasource',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        if (params?.callback) {
            params.callback(response['data'], response['status']);
        }
        return response['data'];
    } catch (error) {
        params.callback(error?.response?.data?.detail || null, 'error');
        // throw new Error(error);
    }
};

export const updateCopilotAppDatasource = async (params) => {
    const formData = new FormData();
    const datasource_data = JSON.parse(JSON.stringify(params.payload));

    if (params.documents) {
        params.documents?.forEach((f) => {
            formData.append('new_documents', f);
        });
    }
    if (datasource_data.datasource_documents?.length) {
        const existing_documents = [];
        const deleted_documents = [];
        datasource_data.datasource_documents.forEach((el) => {
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
    delete datasource_data.docs;
    formData.append('payload', JSON.stringify(datasource_data));

    try {
        const response = await httpClient.put(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] +
                '/copilot/app/' +
                params.copilotAppId +
                '/datasource/' +
                params.datasourceId,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        if (params?.callback) {
            params.callback(response['data'], response['status']);
        }
        return response['data'];
    } catch (error) {
        if (params?.callback) {
            params.callback(error?.response?.data?.detail || null, 'error');
        } else {
            throw new Error(error);
        }
        // throw new Error(error);
    }
};

export const getCopilotAppDatasource = async (params) => {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] +
                '/copilot/app/' +
                params.copilotAppId +
                '/datasource/' +
                params.datasourceId,
            {}
        );
        return response['data'];
    } catch (error) {
        throw error;
        // throw new Error(error);
    }
};

export const getCopilotAppDatasources = async (copilotAppId) => {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] +
                '/copilot/app/' +
                copilotAppId +
                '/datasources',
            {}
        );
        return response['data'];
    } catch (error) {
        throw error;
    }
};

export const deleteCopilotAppDatasource = async (copilotAppId, datasourceId) => {
    try {
        const response = await httpClient.delete(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] +
                '/copilot/app/' +
                copilotAppId +
                '/datasource/' +
                datasourceId
        );
        return response['data'];
    } catch (error) {
        throw error;
    }
};

export const validateCopilotDatasourceConfiguration = async (datasourceType, params) => {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] +
                '/copilot/datasource/' +
                datasourceType +
                '/validate',
            { ...params.payload }
        );
        return response['data'];
    } catch (error) {
        throw error;
    }
};

export const fetchBlobContainers = async (params) => {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/copilot/list/blob/containers',
            { params: { ...params.payload.config } }
        );
        return response['data'];
    } catch (error) {
        throw error;
    }
};

export const fetchS3Buckets = async (params) => {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/copilot/list/s3/buckets',
            { params: { ...params.payload.config } }
        );
        return response['data'];
    } catch (error) {
        throw error;
    }
};
