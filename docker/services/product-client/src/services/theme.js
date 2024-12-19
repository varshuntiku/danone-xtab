import { axiosClient } from 'services/httpClient.js';

export async function getAllAppThemes() {
    try {
        if (import.meta.env['REACT_APP_COPILOT_ADMIN_CLIENT']) {
            throw Error('App Theme unused!');
        }
        const response = await axiosClient.get('/theme');
        return response['data'];
    } catch (error) {
        throw error;
    }
}

export async function updateAppTheme(themeData) {
    try {
        const response = await axiosClient.put('/theme/' + themeData.id, themeData);
        return response['data'];
    } catch (error) {
        throw error;
    }
}

export async function deleteTheme(id) {
    try {
        const response = await axiosClient.delete('/theme/' + id, { id });
        return response['data'];
    } catch (error) {
        throw error;
    }
}

//gets the list of all apps which are affiliated to the provided id
export async function getAppsUnderThemeId(themeId) {
    try {
        const timeOutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), 3000)
        );
        const apiCallPromise = axiosClient.get('/apps-by-theme/' + themeId);
        const response = await Promise.race([apiCallPromise, timeOutPromise]);
        return response['data'];
    } catch (error) {
        throw error;
    }
}

export async function createAppTheme(themeData) {
    try {
        const response = await axiosClient.post('/theme', themeData);
        return response['data'];
    } catch (error) {
        throw error;
    }
}
