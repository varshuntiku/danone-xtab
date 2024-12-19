import { Typography } from '@material-ui/core';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';

const getColor = (category, opacity = 0.8) => {
    switch (category) {
        case 'Green':
            return `rgba(164, 204, 4, ${opacity})`;
        case 'Blue':
            return `rgba(23, 106, 231, ${opacity})`;
        case 'Violet':
            return `rgba(126, 19, 191, ${opacity})`;
        default:
            return `rgba(2, 224, 254, ${opacity})`;
    }
};
const getBorder = (category = '') => {
    let opacity = 1;
    if (localStorage.getItem('codx-products-theme') === 'dark') {
        opacity = 0.4;
    }
    let borderWidth = '1px';
    if (localStorage.getItem('codx-products-theme') === 'dark') {
        borderWidth = '0.5px';
    }
    switch (category) {
        case 'Green':
            return borderWidth + ` solid rgba(164, 204, 4, ${opacity})`;
        case 'Blue':
            return borderWidth + ` solid rgba(23, 106, 231, ${opacity}`;
        case 'Violet':
            return borderWidth + ` solid rgba(126, 19, 191, ${opacity})`;
        default:
            return borderWidth + ` solid rgba(2, 224, 254, ${opacity})`;
    }
};
const getBgColor = (category = '') => {
    switch (category) {
        case 'Green':
            return 'rgba(164, 204, 4, 0.4)';
        case 'Blue':
            return 'rgba(23, 106, 231, 0.4)';
        case 'Violet':
            return 'rgba(126, 19, 191, 0.4)';
        default:
            return 'rgba(2, 224, 254, 0.4)';
    }
};

const InitiativesCard = (props) => {
    const { initiative_item, classes } = props;
    const theme = localStorage.getItem('codx-products-theme');
    const prevTheme = useRef(theme);
    const [cls, setCls] = useState('');

    useLayoutEffect(() => {
        setCls('');
        if (!initiative_item || initiative_item.is_active) return;
        if (prevTheme.current !== theme && props) {
            setCls(classes.cardContainerRemove);
            prevTheme.current = theme;
            return;
        }
    }, [initiative_item.is_active, theme]);

    useEffect(() => {
        // setCls('');
        if (!initiative_item || initiative_item.is_active || (prevTheme.current !== theme && props))
            return;
        let timeout = setTimeout(() => {
            setCls(classes.cardContainerRemove);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [initiative_item.is_active, theme]);

    return (
        <div
            key={'initiative-container-' + initiative_item.name}
            className={`
                    ${classes.initiativesCardItem}
                    ${initiative_item.is_active ? '' : clsx(classes.initiativesCardItemHidden, cls)}
                    ${
                        !initiative_item.is_active
                            ? classes.hiddenCardContainerGap
                            : classes.visibleCardContainerGap
                    }
             `}
            style={{
                border: `${getBorder(initiative_item.tags && initiative_item.tags[0]?.category)}`
            }}
        >
            <div
                className={classes.pointer}
                style={{
                    background: `${getColor(
                        initiative_item.tags && initiative_item.tags[0]?.category
                    )}`
                }}
            ></div>
            <Typography className={classes.initiativesCardItemHeader}>
                {initiative_item.name}
            </Typography>
            <div className={classes.initiativesCardItemTagWrapper}>
                {initiative_item.tags &&
                    initiative_item.tags?.map((tag, index) => (
                        <Typography
                            key={`${tag} ${index}`}
                            className={classes.initiativesCardItemTag}
                            style={{
                                background: `${getBgColor(tag.category)}`
                            }}
                        >
                            {tag.name}
                        </Typography>
                    ))}
            </div>
        </div>
    );
};

export default InitiativesCard;
