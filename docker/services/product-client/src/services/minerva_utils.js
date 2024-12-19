import httpClient from 'services/httpClient.js';

export const getApplications = async (params) => {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/admin/apps',
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
        // throw new Error(error);
    }
};

export const updateApplicationConfig = async (params) => {
    const formData = new FormData();
    const app_data = JSON.parse(JSON.stringify(params.appData));

    if (params.documents) {
        params.documents?.forEach((f) => {
            formData.append('new_documents', f);
        });
    }
    if (app_data.documents?.length) {
        const existing_documents = [];
        const deleted_documents = [];
        app_data.documents.forEach((el) => {
            if (el.deleted) {
                deleted_documents.push(el);
            } else {
                existing_documents.push(el);
            }
        });
        formData.append('existing_documents', JSON.stringify(existing_documents));
        formData.append('deleted_documents', JSON.stringify(deleted_documents));
    }
    delete app_data.documents;
    formData.append('app_data', JSON.stringify(app_data));
    // formData.append('documents', params.documents);

    try {
        const response = await httpClient.put(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/admin/app/' + params.appId,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        params.callback(response['data'], params.closeOnResponse);
        return true;
    } catch (error) {
        params.callback(error?.response?.data?.detail || null, params.closeOnResponse, 'error');
        // throw new Error(error);
    }
};

export const createApplication = async (params) => {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/admin/app',
            { ...params.appData }
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
        // throw new Error(error);
    }
};

export const getApplicationConfig = async (params) => {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/admin/app/' + params.appId
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
        // throw new Error(error);
    }
};

export const deleteApplication = async (params) => {
    try {
        const response = await httpClient.delete(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/admin/app/' + params.appId
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
        // throw new Error(error);
    }
};

export const validateConnectionString = async (params) => {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/admin/validateConnection',
            { params: { connection_string: params.connectionString } }
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
        // throw new Error(error);
    }
};

export const listTables = async (params) => {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/admin/listConnectionTables',
            {
                params: {
                    connection_string: params.connectionString,
                    schema: params.schema
                }
            }
        );
        if (params.callback) {
            params.callback(response['data']);
        }
        return response['data'];
    } catch (error) {
        if (params.callback) {
            params.callback(null, 'error');
        } else {
            throw error;
        }
        // throw new Error(error);
    }
};

export const listStorageFiles = async (params) => {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/admin/listStorageFiles'
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
        // throw new Error(error);
    }
};

export const listModels = async (params) => {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/admin/models'
        );
        if (params?.callback) {
            params.callback(response['data']);
        }
        return response.data;
    } catch (error) {
        if (params?.callback) {
            params.callback(null, 'error');
        } else {
            throw error;
        }
    }
};

export const getMinervaConsumers = async (params) => {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/admin/consumers',
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
        // throw new Error(error);
    }
};

export const createMinervaConsumer = async (params) => {
    try {
        const response = await httpClient.post(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] + '/admin/consumer',
            { ...params.consumerData }
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
        // throw new Error(error);
    }
};

export const getConsumerById = async (params) => {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] +
                '/admin/consumer/' +
                params.consumerId,
            {}
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
        // throw new Error(error);
    }
};

export const deleteMinervaConsumer = async (params) => {
    try {
        const response = await httpClient.delete(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] +
                '/admin/consumer/' +
                params.consumerId
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(null, 'error');
        // throw new Error(error);
    }
};

export const updateMinervaConsumer = async (params) => {
    try {
        const response = await httpClient.put(
            import.meta.env['REACT_APP_MINERVA_BACKEND_URL'] +
                '/admin/consumer/' +
                params.consumerId,
            { ...params.consumerData, access_key: undefined, id: undefined }
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback(error?.response?.data?.detail || null, 'error');
        // throw new Error(error);
    }
};
