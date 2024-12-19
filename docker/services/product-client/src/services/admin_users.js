import { axiosClient } from 'services/httpClient.js';

export async function getAppUsers(params) {
    try {
        const response = await axiosClient.get('/app-admin/app-users/' + params.app_id, {});
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw error;
    }
}

// export async function createPlatformUser(params) {
//   try {
//     const response = await httpClient.post(import.meta.env["REACT_APP_PLATFORM_BACKEND_API"] + "/users", params.payload);
//     params.callback(response['data']);
//     return true;
//   } catch (error) {
//     params.callback({ status: 'error', error: error.response.data.error, status_code: error.response.status });
//     // throw new Error(error);
//   }
// }

export async function updatePlatformUser(params) {
    try {
        const response = await axiosClient.post('/users/update', params.payload);
        params.callback(response['data']);
        return true;
    } catch (error) {
        params.callback({
            status: 'error',
            error: error.response.data.error,
            status_code: error.response.status
        });
        // throw new Error(error);
    }
}

export async function createAppUser(params) {
    try {
        const response = await axiosClient.post('/app-admin/app-users', params.payload);
        if (params.callback) {
            params.callback(response['data']);
        }
    } catch (error) {
        throw error;
    }
}

export async function updateAppUser(params) {
    try {
        const response = await axiosClient.post(
            '/app-admin/app-users/' + params.app_user_id,
            params.payload
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw error;
    }
}

export async function deleteAppUser(params) {
    try {
        const response = await axiosClient.delete('/app-admin/app-users/' + params.id, {});
        params.callback(response['data']);
    } catch (error) {
        throw error;
    }
}

export async function getAppUserRoles(params) {
    try {
        const response = await axiosClient.get('/app-admin/app-user-roles/' + params.app_id, {});
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw error;
    }
}

export async function createUserRole(params) {
    try {
        const response = await axiosClient.post('/app-admin/app-user-roles', params.payload);
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw error;
    }
}

export async function updateUserRole(params) {
    try {
        const response = await axiosClient.post(
            '/app-admin/app-user-roles/' + params.app_user_role_id,
            params.payload
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw error;
    }
}

export async function deleteUserRole(params) {
    try {
        const response = await axiosClient.delete('/app-admin/app-user-roles/' + params.id, {
            params: { confirm: params.confirm ? 'True' : '' }
        });
        params.callback(response['data']);
    } catch (error) {
        throw error;
    }
}

export async function updateAppUserResponsibilities(params) {
    try {
        const response = await axiosClient.put(
            '/app-admin/app-users/' + params.app_id,
            params.payload
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw error;
    }
}
