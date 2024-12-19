import React from 'react';

export const PDFrameworkContext = React.createContext({
    uneditable: false,
    actionButtonPosition: '',
    finishButtonText: '',
    nextButtonText: '',
    hideFinishButton: false
});

export const PDFrameworkContextProvider = ({
    uneditable,
    actionButtonPosition,
    finishButtonText,
    suppressBackground,
    nextButtonText,
    hideFinishButton,
    children
}) => {
    return (
        <PDFrameworkContext.Provider
            value={{
                uneditable,
                actionButtonPosition,
                finishButtonText,
                suppressBackground,
                nextButtonText,
                hideFinishButton
            }}
        >
            {children}
        </PDFrameworkContext.Provider>
    );
};
