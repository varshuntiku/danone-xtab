import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosClient } from 'services/httpClient';

export const getFunctions = createAsyncThunk(
    'function/getFunctions',
    async (params, { rejectWithValue }) => {
        try {
            return await axiosClient.get('/function', {});
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
