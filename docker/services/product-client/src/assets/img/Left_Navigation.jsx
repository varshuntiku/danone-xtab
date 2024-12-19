import React, { useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core';
import { select } from 'underscore';

const LeftNav = ({ selected }) => {
    const [value, setValue] = useState(null);

    const theme = useTheme();
    let totalSelected;

    useEffect(() => {
        setValue(theme.palette.border.navSelectionBorder);
    }, [selected]);

    //selected will be null by default.. if it is set to false,
    //only then we shall consider it as left navigation selected, topnavigation will be mapped to true
    totalSelected = selected === false;

    return (
        <svg width="228" viewBox="0 0 228 132" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4.5" y="4.5" width="219" height="123" rx="1.5" />
            <path d="M8 16L220 16" />
            <path d="M8 116L52 116" />
            <path d="M56 20.3701L56 123.33" />
            <rect x="12" y="28.7188" width="36" height="8" fill={value} fillOpacity="0.3" />
            <rect x="12" y="39.7412" width="36" height="8" fill={value} fillOpacity="0.3" />
            <rect x="12" y="50.7637" width="36" height="8" fill={value} fillOpacity="0.3" />
            <rect x="12" y="61.7852" width="36" height="8" fill={value} fillOpacity="0.3" />
            <rect x="12" y="72.8076" width="36" height="8" fill={value} fillOpacity="0.3" />
            <rect x="12" y="83.8301" width="36" height="8" fill={value} fillOpacity="0.3" />
            <rect
                x="0.5"
                y="0.5"
                width="227"
                height="131"
                rx={totalSelected ? '4' : '1.5'}
                stroke={totalSelected ? value : undefined}
                strokeWidth={totalSelected ? '3' : '1'}
            />
        </svg>
    );
};

export default LeftNav;
