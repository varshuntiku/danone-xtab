import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import { configureStore} from "@reduxjs/toolkit";
import authSlice from "src/store/slices/authSlice";
import solutionBluePrintSlice from "src/store/slices/solutionBluePrintSlice";

const reducers = combineReducers({
  authData: authSlice,
  solutionBluePrint: solutionBluePrintSlice,
});

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// const store = configureStore({
//   reducer: {
//     solutionBluePrint: solutionBluePrintSlice,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({ serializableCheck: false }),
// });

export default store;
