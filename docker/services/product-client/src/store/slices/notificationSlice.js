import { createSlice } from '@reduxjs/toolkit';
import { getNotifications } from 'store/index';

const initialState = {
    notifications: [],
    count: 0,
    platformNotifications: [],
    platformCount: 0,
    loading: false
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState: initialState,
    reducers: {
        setNotifications: (state, action) => {
            const notificationData = action.payload;
            if (!notificationData.type || notificationData?.type !== 'platform') {
                if (!notificationData.count && notificationData.count !== 0 && notificationData) {
                    state.count = state.count + 1;
                    state.notifications = [notificationData, ...state.notifications];
                } else {
                    return { ...state, ...notificationData };
                }
            } else {
                if (!notificationData.count && notificationData.count !== 0 && notificationData) {
                    state.platformCount = state.platformCount + 1;
                    state.platformNotifications = [
                        notificationData,
                        ...state.platformNotifications
                    ];
                } else {
                    (state.platformCount = notificationData.count),
                        (state.platformNotifications = notificationData.notifications);
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                const { data } = action.payload;
                if (data.type) {
                    return {
                        platformCount: data.count,
                        platformNotifications: data.notifications,
                        loading: false
                    };
                } else {
                    return {
                        ...data,
                        loading: false
                    };
                }
            })
            .addCase(getNotifications.rejected, (state) => {
                state.loading = false;
            });
    }
});

export const { setNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
