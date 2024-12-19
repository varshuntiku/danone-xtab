import { createSlice } from '@reduxjs/toolkit';
import { getStories } from 'store/index';

const initialState = {
    stories: undefined,
    loading: false
};

const dataStoriesSlice = createSlice({
    name: 'dataStories',
    initialState: initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getStories.pending, (state) => {
                state.loading = true;
            })
            .addCase(getStories.fulfilled, (state, action) => {
                state.loading = false;
                state.stories = action.payload.data;
            })
            .addCase(getStories.rejected, (state) => {
                state.loading = false;
            });
    }
});

export default dataStoriesSlice.reducer;
