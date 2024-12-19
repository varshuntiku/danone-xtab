import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authenticated: false,
  refreshTokenExpired: "refreshed",
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialState,
  reducers: {
    resetAuthentication: (state, action) => {
      state.authenticated = action.payload;
    },
    setRefreshTokenExpired: (state, action) => {
      state.refreshTokenExpired = action.payload;
    },
  },
});

export const { resetAuthentication, setRefreshTokenExpired } =
  authSlice.actions;

export default authSlice.reducer;
