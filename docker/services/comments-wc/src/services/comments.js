
import { useHttpClient } from '../Login/HttpClient';

export const useApiServices = () => {
    const httpClient = useHttpClient();

    const addComment = async (params) => {
        try {
           const response= await httpClient.post(`/comments/app/screen/comment`, { ...params.payload });
           return response;
           
        } catch (error) {
            throw new Error(error);
        }
    };

    const addFilter = async (payload) => {
        try {
            const resp = await httpClient.post(`/comments/filters`, { ...payload });
            return resp['data']?.['id'];
        } catch (error) {
            throw new Error(error);
        }
    };

    const addReply = async (params) => {
        try {
            await httpClient.post(`/comments/app/screen/reply`, { ...params.payload });
        } catch (error) {
            throw new Error(error);
        }
    };

    const getFiltersById = async (filter_id) => {
        try {
            const filters = await httpClient.get(`/comments/filters/${filter_id}`);
            if (filters['data']['filters']) return filters['data']['filters'];
            else throw new Error('Filters cannot be applied');
        } catch (err) {
            throw new Error(err);
        }
    };
   const getUsers=  async () =>{
        try {
            const response = await httpClient.get('/users/details');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    

    const getComments = async (params) => {
        try {
            let {
                identifier,
                    include_deleted,
                    bookmarked,
                    resolved,
                    unresolved
            } = params.payload;

const index = identifier.indexOf('?');
 identifier = index !== -1 ? identifier.slice(0, index) : identifier;
            const response = await httpClient.get(`/comments/app`, {
                params: {
                    identifier,
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
    };

    const commentDeleteStateChange = async (commentId, type) => {
        try {
            const response = await httpClient.delete(`/comments/app/comments/${commentId}/${type}`);
            return response['data'];
        } catch (error) {
            throw new Error(error);
        }
    };

    const status = async (params) => {
        try {
            const response = await httpClient.put(`/comments/app/comments/status`, {
                ...params.payload
            });
            return response['data'];
        } catch (error) {
            throw new Error(error);
        }
    };

    const bookmark = async (params) => {
        try {
            const response = await httpClient.put(`/comments/app/comments/bookmark`, {
                ...params.payload
            });
            return response['data'];
        } catch (error) {
            throw new Error(error);
        }
    };

    const enableScreenComment = async (params) => {
        try {
            const { app_id, screen_id } = params.payload;
            const response = await httpClient.post(
                `/app-admin/app/${app_id}/screen/${screen_id}/comment-state`,
                { ...params.payload }
            );
            return response['data'];
        } catch (error) {
            throw new Error(error);
        }
    };

    return {
        addComment,
        addFilter,
        addReply,
        getFiltersById,
        getComments,
        commentDeleteStateChange,
        status,
        bookmark,
        enableScreenComment,
        getUsers
    };
};
