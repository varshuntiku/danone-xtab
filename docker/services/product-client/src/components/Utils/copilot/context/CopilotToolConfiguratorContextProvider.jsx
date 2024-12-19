import React, { createContext } from 'react';

const CopilotToolConfiguratorContext = createContext({
    activeRegistryId: 0,
    setActiveRegistryId: () => {},
    registryList: null,
    fetchCopilotToolRegistry: () => {},
    isLoadingPublishedTools: Boolean,
    publishedTools: []
});

export const CopilotToolConfiguratorContextProvider = ({ children, value }) => {
    return (
        <CopilotToolConfiguratorContext.Provider value={value}>
            {children}
        </CopilotToolConfiguratorContext.Provider>
    );
};

export default CopilotToolConfiguratorContext;
