import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    updatedStorageUrl: '',
    counter: 0
};

const directorySlice = createSlice({
    name: 'directoryUpload',
    initialState: initialState,
    reducers: {
        setDirectoryData: (state, action) => {
            state.updatedStorageUrl = action.payload.updatedStorageUrl;
            state.counter += 1;
        }
    }
});

export const { setDirectoryData } = directorySlice.actions;

export default directorySlice.reducer;
