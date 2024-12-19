import React, { createContext, useState } from 'react';

const SelectedIndexContext = createContext();

const SelectedIndexProvider = ({ children }) => {
    const [selectedCheckColumn, setSelectedCheckColumn] = useState(new Set());

    const toggleCheckedColumn = (columnIndex) => {
        setSelectedCheckColumn((prevColumns) => {
            const newSelectedColumns = new Set(prevColumns);
            const isCurrentlyChecked = newSelectedColumns.has(columnIndex);

            if (isCurrentlyChecked) {
                newSelectedColumns.delete(columnIndex);
            } else {
                newSelectedColumns.add(columnIndex);
            }
            return newSelectedColumns;
        });
    };

    return (
        <SelectedIndexContext.Provider
            value={{ selectedCheckColumn, toggleCheckedColumn, setSelectedCheckColumn }}
        >
            {children}
        </SelectedIndexContext.Provider>
    );
};

export { SelectedIndexContext, SelectedIndexProvider };
