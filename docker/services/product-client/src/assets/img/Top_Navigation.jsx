import React, { useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';

const TopNav = ({ selected }) => {
    const [value, setValue] = useState(null);

    const theme = useTheme();

    useEffect(() => {
        setValue(theme.palette.border.navSelectionBorder);
    }, [selected]);

    return (
        <svg width="228" viewBox="0 0 228 132" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4.5" y="4.5" width="219" height="123" rx="1.5" />
            <path d="M8 16L220 16" />
            <path d="M8 32L220 32" />
            <path d="M8 116L220 116" />
            <rect x="12" y="20" width="28" height="8" fill={value} fillOpacity="0.3" />
            <rect x="44" y="20" width="28" height="8" fill={value} fillOpacity="0.3" />
            <rect x="76" y="20" width="28" height="8" fill={value} fillOpacity="0.3" />
            <rect x="108" y="20" width="28" height="8" fill={value} fillOpacity="0.3" />
            <rect x="140" y="20" width="28" height="8" fill={value} fillOpacity="0.3" />
            <rect x="172" y="20" width="28" height="8" fill={value} fillOpacity="0.3" />
            <rect
                x="0.5"
                y="0.5"
                width="227"
                height="131"
                rx={selected ? '4' : '1.5'}
                stroke={selected ? value : undefined}
                strokeWidth={selected ? '3' : '1'}
            />
        </svg>
    );
};

export default TopNav;
