import { createAsyncThunk } from '@reduxjs/toolkit';
import httpClient from 'services/httpClient';
import { setStoreOnWindowChange } from '../index';

export const makeQuery = createAsyncThunk(
    'minerva/makeQuery',
    async (params, { dispatch, requestId }) => {
        const response = await httpClient.get(
            `${import.meta.env['REACT_APP_MINERVA_BACKEND_URL']}/services/query/${
                params.minervaAppId
            }`,
            {
                params: {
                    user_query: params.input,
                    window_id: params.window_id,
                    query_trace_id: requestId
                }
            }
        );
        dispatch(loadConversationWindowList({ minervaAppId: params.minervaAppId }));
        return response.data;
    }
);

export const loadConversationWindowList = createAsyncThunk(
    'minerva/loadConversationWindowList',
    async (params) => {
        const response = await httpClient.get(
            `${import.meta.env['REACT_APP_MINERVA_BACKEND_URL']}/services/conversation-window/${
                params.minervaAppId
            }`
        );
        return response.data;
    }
);

export const createConversationWindow = createAsyncThunk(
    'minerva/createConversationWindow',
    async (params) => {
        const response = await httpClient.post(
            `${import.meta.env['REACT_APP_MINERVA_BACKEND_URL']}/services/conversation-window/${
                params.minervaAppId
            }`,
            {}
        );
        return response.data;
    }
);

export const loadConversations = createAsyncThunk('minerva/loadConversations', async (params) => {
    const response = await httpClient.get(
        `${import.meta.env['REACT_APP_MINERVA_BACKEND_URL']}/services/conversations/${
            params.minervaAppId
        }`,
        {
            params: {
                window_id: params.windowId,
                query_limit: params.query_limit,
                query_offset: params.query_offset
            }
        }
    );
    return response.data;
});

export const changeChatWindow = createAsyncThunk(
    'minerva/changeChatWindow',
    async (params, { dispatch }) => {
        dispatch(setStoreOnWindowChange(params.windowId));
        dispatch(setStoreOnWindowChange(params.windowId));
        dispatch(
            loadConversations({
                minervaAppId: params.minervaAppId,
                windowId: params.windowId,
                query_limit: 10,
                query_offset: 0
            })
        );
    }
);

export const updateConversationWindow = createAsyncThunk(
    'minerva/updateConversationWindow',
    async (params) => {
        const response = await httpClient.put(
            `${import.meta.env['REACT_APP_MINERVA_BACKEND_URL']}/services/conversation-window/${
                params.payload.id
            }`,
            {
                ...params.payload,
                id: undefined
            }
        );
        return response.data;
    }
);

export const deleteConversationWindow = createAsyncThunk(
    'minerva/deleteConversationWindow',
    async (id) => {
        const res = await httpClient.delete(
            `${import.meta.env['REACT_APP_MINERVA_BACKEND_URL']}/services/conversation-window/${id}`
        );
        return res.data;
    }
);
