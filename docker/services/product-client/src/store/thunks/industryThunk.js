import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosClient } from 'services/httpClient';

export const getIndustries = createAsyncThunk(
    'industry/getIndustries',
    async (params, { rejectWithValue }) => {
        try {
            if (import.meta.env['REACT_APP_COPILOT_ADMIN_CLIENT']) {
                console.error('industry unused');
                return new Promise.resolve({ data: [] });
            }
            return await axiosClient.get('/industry', {});
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
