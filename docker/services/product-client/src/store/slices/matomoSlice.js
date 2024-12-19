import { createSlice } from '@reduxjs/toolkit';
import { getMatomoPvid } from 'store/index';

const initialState = {
    pv_id: undefined
};

const matomoSlice = createSlice({
    name: 'matomoPvid',
    initialState: initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getMatomoPvid.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMatomoPvid.fulfilled, (state, action) => {
                state.pv_id = action.payload;
            })
            .addCase(getMatomoPvid.rejected, (state) => {
                state.loading = false;
            });
    }
});

export default matomoSlice.reducer;
