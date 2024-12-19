import { axiosClient } from 'services/httpClient';

export const NAC_USER_ROLE_URL = `/nac-user-roles`;
export const NAC_ROLE_PERMISSION_URL = `${
    import.meta.env['REACT_APP_BACKEND_API']
}/nac-role-permissions`;

export const getAllPermissions = async () => {
    try {
        let response = await axiosClient.get('/nac-role-permissions');
        return response;
    } catch (error) {
        throw error;
    }
};

export const getAllRoles = async () => {
    try {
        let response = await axiosClient.get(NAC_USER_ROLE_URL);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getRoleById = async (roleId) => {
    try {
        let response = await axiosClient.get(`${NAC_USER_ROLE_URL}/${roleId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const createRole = async ({ permissions, name }) => {
    try {
        let response = await axiosClient.post(NAC_USER_ROLE_URL, {
            name,
            role_permissions: permissions
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateRole = async (roleId, { permissions, name }) => {
    try {
        let response = await axiosClient.put(`${NAC_USER_ROLE_URL}/${roleId}`, {
            name,
            permissions
        });
        return response;
    } catch (error) {
        throw error;
    }
};
export const deleteRole = async (roleId) => {
    try {
        let response = await axiosClient.delete(`${NAC_USER_ROLE_URL}/${roleId}`, []);
        return response;
    } catch (error) {
        throw error;
    }
};
