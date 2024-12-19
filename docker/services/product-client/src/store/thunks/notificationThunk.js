import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosClient } from 'services/httpClient';

export const getNotifications = createAsyncThunk(
    'notification/getNotifications',
    async (params, { rejectWithValue }) => {
        try {
            if (params.app_id) {
                return await axiosClient.get('/notification', {
                    params: params
                });
            } else {
                return await axiosClient.get('/notification', {});
            }
        } catch (err) {
            return rejectWithValue(err.response.data.error);
        }
    }
);
