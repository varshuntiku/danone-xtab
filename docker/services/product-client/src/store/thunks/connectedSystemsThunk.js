import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosClient } from 'services/httpClient';

export const getConnectedSystems = createAsyncThunk(
    'connectedSystem/getConnectedSystems',
    async (params, { rejectWithValue }) => {
        try {
            return await axiosClient.get('/connected-system/dashboard/active', {});
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
