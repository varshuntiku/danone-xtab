import { axiosClient } from 'services/httpClient.js';

export async function addComment(params) {
    try {
        await axiosClient.post(`/comments/app/screen/comment`, { ...params.payload });
    } catch (error) {
        throw new Error(error);
    }
}
export async function addFilter(payload) {
    try {
        const resp = await axiosClient.post(`/comments/filters`, { ...payload });
        return resp['data']?.['id'];
    } catch (error) {
        throw new Error(error);
    }
}

export async function addReply(params) {
    try {
        await axiosClient.post(`/comments/app/screen/reply`, { ...params.payload });
    } catch (error) {
        throw new Error(error);
    }
}
export async function getFiltersById(filter_id) {
    try {
        const filters = await axiosClient.get(`/comments/filters/${filter_id}`);
        if (filters['data']['filters']) return filters['data']['filters'];
        else throw new Error('Filters cannot be applied');
    } catch (err) {
        throw new Error(err);
    }
}

export async function getComments(params) {
    try {
        const {
            app_id,
            app_screen_id,
            include_deleted,
            bookmarked,
            resolved,
            unresolved,
            widget_id
        } = params.payload;

        const response = await axiosClient.get(`/comments/app/${app_id}/screen/${app_screen_id}`, {
            params: {
                widget_id,
                include_deleted,
                bookmarked,
                resolved,
                unresolved
            }
        });

        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

export async function commentDeleteStateChange(commentId, type) {
    try {
        const response = await axiosClient.delete(`/comments/app/comments/${commentId}/${type}`);

        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}

export async function status(params) {
    try {
        const response = await axiosClient.put(`/comments/app/comments/status`, {
            ...params.payload
        });
        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}
export async function bookmark(params) {
    try {
        const response = await axiosClient.put(`/comments/app/comments/bookmark`, {
            ...params.payload
        });
        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}

export async function enableScreenComment(params) {
    try {
        const { app_id, screen_id } = params.payload;
        const response = await axiosClient.post(
            `/app-admin/app/${app_id}/screen/${screen_id}/comment-state`,
            { ...params.payload }
        );
        return response['data'];
    } catch (error) {
        throw new Error(error);
    }
}

export async function saveThreadLevelSetting(params) {
    try {
        const response = await axiosClient.post(`subscription/app/screen/thread/subscripiton`, {
            ...params
        });
        params.callback('success', response['data']);
    } catch (error) {
        params.callback('error');
        throw new Error(error);
    }
}
export async function editApprovalStatus(params) {
    try {
        await axiosClient.post(`/comments/approval/edit/`, { ...params.payload });
    } catch (error) {
        throw new Error(error);
    }
}
