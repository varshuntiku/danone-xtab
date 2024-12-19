import { createSlice } from '@reduxjs/toolkit';
import { getIndustries } from 'store/index';

const initialState = {
    list: [],
    loading: false
};

const industrySlice = createSlice({
    name: 'industry',
    initialState: initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getIndustries.pending, (state) => {
                state.loading = true;
            })
            .addCase(getIndustries.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.data;
            })
            .addCase(getIndustries.rejected, (state) => {
                state.loading = false;
            });
    }
});

export default industrySlice.reducer;
