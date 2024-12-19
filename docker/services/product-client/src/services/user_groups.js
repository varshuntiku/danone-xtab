import { axiosClient } from 'services/httpClient.js';

export async function getUserGroupsList() {
    try {
        const response = await axiosClient.get('/user-groups', {});
        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}

export async function createUserGroups(params) {
    try {
        const response = await axiosClient.post('/user-groups', { ...params.payload });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function updateUserGroups(params) {
    try {
        const response = await axiosClient.put(`/user-groups/${params?.payload?.id}`, {
            ...params.payload
        });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function deleteUserGroups(params) {
    try {
        const response = await axiosClient.delete(`/user-groups/${params?.payload?.id}`, {
            ...params.payload
        });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw {
            message: error.response?.data?.error || 'error',
            statusCode: error.response.status
        };
    }
}
