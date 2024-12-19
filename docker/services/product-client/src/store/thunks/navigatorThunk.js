import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosClient } from 'services/httpClient';

export const getObjectives = createAsyncThunk(
    'navigator/getObjectivesList',
    async (params, { rejectWithValue }) => {
        try {
            return await axiosClient.get('/app/' + params.app_id + '/objectives', {});
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getObjectivesSteps = createAsyncThunk(
    'navigator/getObjectivesSteps',
    async (params, { rejectWithValue }) => {
        try {
            return await axiosClient.get('/objectives/' + params.objective_id + '/steps', {});
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
