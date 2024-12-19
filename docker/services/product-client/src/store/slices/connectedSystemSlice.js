import { createSlice } from '@reduxjs/toolkit';
import { getConnectedSystems } from 'store/index';

const initialState = {
    list: [],
    loading: false
};

const connectedSystemSlice = createSlice({
    name: 'connectedSystem',
    initialState: initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getConnectedSystems.pending, (state) => {
                state.loading = true;
            })
            .addCase(getConnectedSystems.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.data;
            })
            .addCase(getConnectedSystems.rejected, (state) => {
                state.loading = false;
            });
    }
});

export default connectedSystemSlice.reducer;
