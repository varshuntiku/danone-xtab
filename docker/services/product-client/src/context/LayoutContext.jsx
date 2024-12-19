import React, { createContext, useState } from 'react';

const LayoutContext = createContext();

const MyProvider = ({ children }) => {
    const [widthPattern, setWidthPattern] = useState({});
    const [heightPattern, setHeightPattern] = useState({});

    const updateLayoutState = (key, value, index = 0) => {
        switch (key) {
            case 'widthPattern':
                switch (true) {
                    case index < 1:
                        setWidthPattern(value);
                        break;
                    default:
                        setWidthPattern((widthPattern) => ({
                            ...widthPattern,
                            [index]: value[index]
                        }));
                }
                break;
            case 'heightPattern':
                setHeightPattern(value);
                break;
            default:
                break;
        }
    };

    return (
        <LayoutContext.Provider value={{ widthPattern, heightPattern, updateLayoutState }}>
            {children}
        </LayoutContext.Provider>
    );
};

export { LayoutContext, MyProvider };
