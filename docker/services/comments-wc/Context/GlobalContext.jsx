
import React, { createContext, useState } from 'react';
import globalState from '../store/GlobalState'; 

export const GlobalContext = createContext();

export const GlobalProvider = ({ children, initialState = {} }) => {
  const [globalStateInContext, setGlobalStateInContext] = useState(initialState);

  const setGlobalState = (newState) => {
    setGlobalStateInContext(newState); 
    globalState.setState(newState); 
  };

  const value = {
    globalState: globalStateInContext,
    setGlobalState,
  };

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};
