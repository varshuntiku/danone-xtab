import { combineReducers, configureStore } from '@reduxjs/toolkit';
import connectedSystemSlice from 'store/slices/connectedSystemSlice';
import industrySlice from 'store/slices/industrySlice';
import functionSlice from 'store/slices/functionSlice';
import notificationSlice from 'store/slices/notificationSlice';
import dataStoriesSlice from 'store/slices/dataStoriesSlice';
import appScreenSlice from 'store/slices/appScreenSlice';
import navigatorSlice from 'store/slices/navigatorSlice';
import createStoriesSlice from 'store/slices/createStoriesSlice';
import matomoSlice from 'store/slices/matomoSlice';
import minervaSlice from 'store/slices/minervaSlice';
import authSlice from './slices/authSlice';
import directorySlice from './slices/directoryWidgetSlice';
import llmWorkbenchSlice from './slices/llmWorkbenchSlice';
import diagnosisFormDataSlice from 'components/Diagnoseme/store/slices/diagnosisFormDataSlice';
import solutionBluePrintSlice from './slices/solutionBluePrintSlice';

const reducers = combineReducers({
    authData: authSlice,
    connectedSystemData: connectedSystemSlice,
    industryData: industrySlice,
    functionData: functionSlice,
    notificationData: notificationSlice,
    dataStories: dataStoriesSlice,
    appScreen: appScreenSlice,
    navigator: navigatorSlice,
    createStories: createStoriesSlice,
    matomo: matomoSlice,
    minerva: minervaSlice,
    directoryData: directorySlice,
    llmWorkbench: llmWorkbenchSlice,
    diagnosisFormData: diagnosisFormDataSlice,
    solutionBluePrint: solutionBluePrintSlice
});

const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});

export default store;
