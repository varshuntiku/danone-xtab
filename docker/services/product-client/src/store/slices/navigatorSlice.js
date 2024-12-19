import { createSlice } from '@reduxjs/toolkit';
import { getObjectives, getObjectivesSteps } from 'store/index';

const initialState = {
    objectives: undefined,
    loading: false
};

const navigatorSlice = createSlice({
    name: 'navigator',
    initialState: initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getObjectives.pending, (state) => {
                state.loading = true;
            })
            .addCase(getObjectives.fulfilled, (state, action) => {
                state.loading = false;
                state.objectives = action.payload.data;
            })
            .addCase(getObjectives.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getObjectivesSteps.pending, (state) => {
                state.loading = true;
            })
            .addCase(getObjectivesSteps.fulfilled, (state, action) => {
                state.loading = false;
                action.meta.arg.callback(action.payload.data);
                state.objectives = action.payload.data;
            })
            .addCase(getObjectivesSteps.rejected, (state) => {
                state.loading = false;
            });
    }
});

export default navigatorSlice.reducer;
