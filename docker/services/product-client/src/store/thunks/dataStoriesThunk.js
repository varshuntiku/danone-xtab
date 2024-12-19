import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosClient } from 'services/httpClient';

export const getStories = createAsyncThunk(
    'dataStories/getStories',
    async (params, { rejectWithValue }) => {
        try {
            if (params.app_id) {
                return await axiosClient.get('/app/' + params.app_id + '/stories', {});
            } else {
                return await axiosClient.get('/stories', {});
            }
        } catch (err) {
            return rejectWithValue(err.response.data.error);
        }
    }
);
