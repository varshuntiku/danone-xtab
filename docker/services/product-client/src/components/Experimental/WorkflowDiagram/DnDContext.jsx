import { createContext, useContext, useState } from 'react';

const DnDContext = createContext([null, () => {}]);

export const DnDProvider = ({ children }) => {
    const [type, setType] = useState(null);

    return <DnDContext.Provider value={[type, setType]}>{children}</DnDContext.Provider>;
};

export default DnDContext;

export const useDnD = () => {
    return useContext(DnDContext);
};
