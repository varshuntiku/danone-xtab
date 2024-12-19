import httpClient, { axiosClient } from 'services/httpClient.js';

export async function getStories(params) {
    try {
        if (params.app_id) {
            const response = await axiosClient.get('/app/' + params.app_id + '/stories', {});
            params.callback(response['data']);
        } else {
            const response = await axiosClient.get('/stories', {});
            params.callback(response['data']);
        }

        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getStory(params) {
    try {
        const response = await axiosClient.get('/stories/' + params.story_id, {});
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function createStory(params) {
    try {
        const response = await axiosClient.post('/stories', {
            ...params.payload
        });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function updateStory(params) {
    try {
        let query_param = params.payload.story_id;
        if (Array.isArray(params.payload.story_id)) {
            query_param = params.payload.story_id.join(',');
        }
        const response = await axiosClient.put('/stories/' + query_param, { ...params.payload });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function deleteReport(params) {
    try {
        const response = await axiosClient.delete('/stories/' + params.story_id, {
            params: params.payload
        });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function scheduleStory(params) {
    try {
        const response = await axiosClient.post('/stories/schedule', { ...params.payload });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getSharedList(params) {
    try {
        const response = await axiosClient.get('/stories/' + params.story_id + '/shared', {
            ...params.payload
        });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function shareReport(params) {
    try {
        const response = await axiosClient.post('/stories/share', { ...params.payload });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getShareableUsers(params) {
    try {
        const response = await axiosClient.get('/stories/' + params.story_id + '/users', {
            ...params.payload
        });
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getPublishedStory(params) {
    try {
        const response = await axiosClient.get('/stories/published' + params.search, {});
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getDownloadStatus(params) {
    try {
        const response = await httpClient.get(
            import.meta.env['REACT_APP_PLATFORM_BACKEND_API'] + '/stories/download-jobs/status',
            { params: params.payload }
        );
        params.callback(response['data']);
        return true;
    } catch (error) {
        throw new Error(error);
    }
}
