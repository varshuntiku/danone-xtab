import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedScreens: [],
    screenId: undefined,
    commentEnabled: false,
    screenWidgetCountMax: {}, // { screenId: maxValidWidgetsCountPerScreen }
    usedWidgetValueIds: [], //to keep track of used widget value IDs as an array
    screenWidgetCountCurrent: {}, // to keep track of the current selected widgets count per screen
    usedValueIdsCurrent: [], // to keep track of currently used widgets
    checkFlag: false,
    widgetOpenId: null,
    screenLevelFilterState: {},
    widgetOpenName: null
};

const createStoriesSlice = createSlice({
    name: 'createStories',
    initialState: initialState,
    reducers: {
        setScreenId: (state, action) => {
            state.screenId = action.payload;
        },
        selectOrUnselectAllItems: (state, action) => {
            state.selectedScreens = action.payload;
            state.checkFlag = !state.checkFlag;
        },
        setCommentEanbled: (state, action) => {
            state.commentEnabled = action.payload.commentEnabled;
        },
        setWidgetOpenIdState: (state, action) => {
            state.widgetOpenId = action.payload.widget_id;
            state.widgetOpenName = action.payload.widget_name;
        },
        setScreenLevelFilterState: (state, action) => {
            state.screenLevelFilterState = action?.payload?.screenLevelFilterState;
        },

        //updates the max possible valid widgets per screen for data stories
        updateMaxScreenWidgetCount: (state, action) => {
            const { screenId, widget_value_id } = action.payload;
            const usedWidgetValueIdsSet = new Set(state.usedWidgetValueIds);
            if (!usedWidgetValueIdsSet.has(widget_value_id)) {
                usedWidgetValueIdsSet.add(widget_value_id);
                if (!state.screenWidgetCountMax[screenId]) {
                    state.screenWidgetCountMax[screenId] = 0;
                }
                state.screenWidgetCountMax[screenId]++;
            }
            state.usedWidgetValueIds = Array.from(usedWidgetValueIdsSet);
        },

        //updates the count of current widgets selection per screen
        updateCurrentSelectedWidgetCount: (state, action) => {
            const { screenId, widget_value_id } = action.payload;
            const usedWidgetValueIdsSet = new Set(state.usedValueIdsCurrent);
            if (!usedWidgetValueIdsSet.has(widget_value_id)) {
                usedWidgetValueIdsSet.add(widget_value_id);
                if (!state.screenWidgetCountCurrent[screenId]) {
                    state.screenWidgetCountCurrent[screenId] = 0;
                }
                state.screenWidgetCountCurrent[screenId]++;
            }
            state.usedValueIdsCurrent = Array.from(usedWidgetValueIdsSet);

            // //used to select the screenwide checkbox when count reduces reaches valid maximum
            if (
                state.screenWidgetCountCurrent[screenId] === state.screenWidgetCountMax[screenId] &&
                state.selectedScreens.length
            ) {
                const updatedScreens = state.selectedScreens?.map((screen) => {
                    if (screen.id === screenId) {
                        screen.selected = true;
                    }
                    return screen;
                });
                state.selectedScreens = updatedScreens;
            }
        },

        //removes the widget from usedids and reduces the current count by 1
        removeWidgetFromUsed: (state, action) => {
            const { screenId, widget_value_id } = action.payload;

            const index = state.usedValueIdsCurrent.indexOf(widget_value_id);
            if (index !== -1) {
                state.usedValueIdsCurrent.splice(index, 1);

                if (state.screenWidgetCountCurrent[screenId] > 0) {
                    state.screenWidgetCountCurrent[screenId]--;
                }
            }

            // Update the selectedScreens if necessary
            if (
                state.screenWidgetCountCurrent[screenId] < state.screenWidgetCountMax[screenId] &&
                state.selectedScreens.length
            ) {
                const updatedScreens = state.selectedScreens?.map((screen) => {
                    if (screen.id === screenId) {
                        screen.selected = false;
                    }
                    return screen;
                });
                state.selectedScreens = updatedScreens;
            }
        }
    }
});

export const {
    setScreenId,
    selectOrUnselectAllItems,
    updateMaxScreenWidgetCount,
    updateCurrentSelectedWidgetCount,
    removeWidgetFromUsed,
    setCommentEanbled,
    setWidgetOpenIdState,
    setScreenLevelFilterState
} = createStoriesSlice.actions;

export default createStoriesSlice.reducer;
