import { configureStore } from "@reduxjs/toolkit";

import authSlice from "src/store/slices/authSlice";

const store = configureStore({
  reducer: {
    authData: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
