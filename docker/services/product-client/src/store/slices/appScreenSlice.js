import { createSlice } from '@reduxjs/toolkit';
import { getScreenWidgets, getGraphData } from 'store/index';

const initialState = {
    widgetData: undefined,
    graphData: undefined,
    widget_action: {
        action_origin: '',
        widget_data: null
    },
    loading: false,
    screenId: null,
    activeScreenWidgets: null,
    activeScreenDetails: null,
    appScreens: [],
    progressBarDetails: null,
    inProgressScreenId: null,
    updatedWidgetsIds: null,
    hightlightScreenId: null,
    filtersUpdateStatus: false,
    currentFilters: null
};

const appScreenSlice = createSlice({
    name: 'appScreen',
    initialState: initialState,
    reducers: {
        setWidgetData: (state, action) => {
            state.widgetData = action.payload;
        },
        setgraphData: (state, action) => {
            state.graphData = action.payload;
        },
        setWidgetEventData: (state, action) => {
            state.widget_action = action.payload;
        },
        setActiveScreenId: (state, action) => {
            state.activeScreenId = action.payload;
        },
        setActiveScreenWidgets: (state, action) => {
            state.activeScreenWidgets = action.payload;
        },
        setActiveScreenDetails: (state, action) => {
            state.activeScreenDetails = action.payload;
        },
        setActiveScreenWidgetsDetails: (state, action) => {
            state[action.payload?.widget_id] = action.payload?.data;
        },
        removeActiveScreenWidgetsDetails: (state, action) => {
            const newState = JSON.parse(JSON.stringify(state));
            delete newState[action.payload];
            return newState;
        },
        setAppScreens: (state, action) => {
            state.appScreens = action.payload;
        },
        setProgressBarDetails: (state, action) => {
            state.progressBarDetails = action.payload;
        },
        setInProgressScreenId: (state, action) => {
            state.inProgressScreenId = action.payload;
        },
        setUpdatedWidgetsIds: (state, action) => {
            state.updatedWidgetsIds = action.payload;
        },
        setHightlightScreenId: (state, action) => {
            state.hightlightScreenId = action.payload;
        },
        setFiltersUpdateStatus: (state, action) => {
            state.filtersUpdateStatus = action.payload;
        },
        setCurrentFilters: (state, action) => {
            state.currentFilters = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getScreenWidgets.pending, (state) => {
                state.loading = true;
            })
            .addCase(getScreenWidgets.fulfilled, (state) => {
                state.loading = false;
                // State update logic to be implemented when required
            })
            .addCase(getScreenWidgets.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getGraphData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGraphData.fulfilled, (state) => {
                state.loading = false;
                // State update logic to be implemented when required
            })
            .addCase(getGraphData.rejected, (state) => {
                state.loading = false;
            });
    }
});

export const {
    setWidgetData,
    setgraphData,
    setWidgetEventData,
    setActiveScreenId,
    setActiveScreenWidgets,
    setActiveScreenDetails,
    setActiveScreenWidgetsDetails,
    removeActiveScreenWidgetsDetails,
    setAppScreens,
    setProgressBarDetails,
    setInProgressScreenId,
    setUpdatedWidgetsIds,
    setHightlightScreenId,
    setFiltersUpdateStatus,
    setCurrentFilters
} = appScreenSlice.actions;

export default appScreenSlice.reducer;
