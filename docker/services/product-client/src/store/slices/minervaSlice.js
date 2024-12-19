import { createSlice } from '@reduxjs/toolkit';
import {
    makeQuery,
    loadConversationWindowList,
    loadConversations,
    updateConversationWindow,
    deleteConversationWindow
} from 'store/index';
// import sampleMinervaQuery from './sampleMinervaQuery.json';

const initialState = {
    queries: [],
    conversationWindowsLoaded: false,
    conversationWindows: [],
    selectedWindowId: 0,
    next_offset: 0,
    total_count: 0,
    loadingConversation: false,
    scrollToResponseId: null
};

const minervaSlice = createSlice({
    name: 'minerva',
    initialState: initialState,
    reducers: {
        clearMinervaSession: (state) => {
            state.queries = [];
            state.conversationWindows = [];
            state.conversationWindowsLoaded = false;
            state.selectedWindowId = 0;
            state.next_offset = 0;
            state.total_count = 0;
            state.loadingConversation = false;
            state.scrollToResponseId = null;
        },
        createNewConversation: (state) => {
            state.queries = [];
            state.selectedWindowId = 0;
            state.next_offset = 0;
            state.total_count = 0;
            state.loadingConversation = false;
            state.scrollToResponseId = null;
        },
        setStoreOnWindowChange: (state, action) => {
            state.selectedWindowId = action.payload;
            state.queries = [];
            state.next_offset = 0;
            state.total_count = 0;
            state.loadingConversation = true;
            state.scrollToResponseId = null;
        },
        setScrollToResponseId: (state, action) => {
            state.scrollToResponseId = action.payload;
        },
        setQueryProcessStatus: (state, action) => {
            const { query_trace_id, window_id, progress_message, output } = action.payload;
            if (state.selectedWindowId === window_id) {
                const q = state.queries.find((el) => el.requestId === query_trace_id);
                if (q) {
                    q.progress_message = progress_message;
                    if (output) {
                        q.output = { ...q.output, ...output };
                    }
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(makeQuery.pending, (state, action) => {
                state.queries = [
                    ...state.queries,
                    {
                        requestId: action.meta.requestId,
                        input: action.meta.arg.input,
                        status: 'pending'
                    }
                ];
                // state.scrollToResponseId = action.meta.requestId;
            })
            .addCase(makeQuery.fulfilled, (state, action) => {
                const q = state.queries.find((el) => el.requestId === action.meta.requestId);
                Object.assign(q, action.payload);
                q.status = 'resolved';
                state.selectedWindowId = action.payload.window_id;
            })
            .addCase(makeQuery.rejected, (state, action) => {
                const q = state.queries.find((el) => el.requestId === action.meta.requestId);
                q.status = 'rejected';
            })
            .addCase(loadConversationWindowList.fulfilled, (state, action) => {
                state.conversationWindows = action.payload;
                state.conversationWindowsLoaded = true;
            })
            .addCase(loadConversationWindowList.rejected, (state) => {
                state.conversationWindowsLoaded = false;
            })
            .addCase(loadConversations.pending, (state) => {
                state.loadingConversation = true;
            })
            .addCase(loadConversations.fulfilled, (state, action) => {
                state.queries = [...action.payload.list, ...state.queries];
                state.next_offset = action.payload.next_offset;
                state.total_count = action.payload.total_count;
                state.loadingConversation = false;
                state.scrollToResponseId = action.payload.list.at(-1)?.id;
            })
            .addCase(loadConversations.rejected, (state) => {
                state.loadingConversation = false;
            })
            .addCase(updateConversationWindow.fulfilled, (state, action) => {
                const windows = state.conversationWindows;
                const window_obj = windows.find((el) => el.id === action.payload.id);
                Object.assign(window_obj, action.payload);
                state.conversationWindows = windows;
            })
            .addCase(deleteConversationWindow.pending, (state, action) => {
                if (state.selectedWindowId == action.meta.arg) {
                    state.queries = [];
                    state.selectedWindowId = 0;
                    state.next_offset = 0;
                    state.total_count = 0;
                    state.loadingConversation = false;
                    state.scrollToResponseId = null;
                }
                state.conversationWindows = state.conversationWindows.filter(
                    (el) => el.id != action.meta.arg
                );
            });
    }
});

export const {
    clearMinervaSession,
    createNewConversation,
    setStoreOnWindowChange,
    setScrollToResponseId,
    setQueryProcessStatus
} = minervaSlice.actions;

export default minervaSlice.reducer;
