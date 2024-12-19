import { createSlice } from '@reduxjs/toolkit';
import { getFunctions } from 'store/index';

const initialState = {
    list: [],
    loading: false
};

const functionSlice = createSlice({
    name: 'function',
    initialState: initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getFunctions.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFunctions.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.data;
            })
            .addCase(getFunctions.rejected, (state) => {
                state.loading = false;
            });
    }
});

export default functionSlice.reducer;
