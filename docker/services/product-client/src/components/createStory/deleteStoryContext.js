import React from 'react';

export const DeleteStoryContext = React.createContext({
    onDeleteStoryDone: () => {},
    onDeleteStoryFail: () => {}
});
