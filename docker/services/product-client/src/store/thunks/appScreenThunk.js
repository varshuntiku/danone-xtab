import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosClient } from 'services/httpClient';

export const getScreenWidgets = createAsyncThunk(
    'appScreen/getScreenWidgets',
    async (params, { rejectWithValue }) => {
        try {
            return await axiosClient.get(
                '/app/' + params.app_id + '/screens/' + params.screen_id + '/widgets',
                {}
            );
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getGraphData = createAsyncThunk(
    'appScreen/getGraphData',
    async (params, { rejectWithValue }) => {
        try {
            return await axiosClient.put(
                '/app/' + params.app_id + '/screens/' + params.screen_id + '/widget',
                {
                    widget: params['details'],
                    filters: params['filters']
                }
            );
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
