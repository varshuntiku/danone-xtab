import React, { useState } from 'react';
import { Typography, Box } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import clsx from 'clsx';

const MapIcons = ({ type, classes }) => {
    switch (type) {
        case 'edit':
            return <EditIcon className={classes.toolBarIcon} />;
        default:
            return null;
    }
};

export default function IconButton({ elementProps, classes, onChange }) {
    const [state, setState] = useState(false);
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: elementProps?.margin
            }}
        >
            <button
                className={classes.button}
                onClick={() => {
                    setState(!state);
                    onChange(elementProps.id, !state);
                }}
            >
                {elementProps?.labelLeft || elementProps.onClickLabelLeft ? (
                    <Typography
                        className={clsx(classes.toolBarText, classes.toolBarIcon)}
                        variant="caption"
                    >
                        {' '}
                        {state ? elementProps?.onClickLabelLeft : elementProps.labelLeft}
                    </Typography>
                ) : null}
                {elementProps?.iconName ? (
                    state ? (
                        <MapIcons type={elementProps?.iconOnClick} classes={classes} />
                    ) : (
                        <MapIcons type={elementProps.iconName} classes={classes} />
                    )
                ) : null}
                {elementProps?.labelRight || elementProps.onClickLabelRight ? (
                    <Typography
                        className={clsx(classes.toolBarText, classes.toolBarIcon)}
                        variant="caption"
                    >
                        {state ? elementProps?.onClickLabelRight : elementProps.labelRight}
                    </Typography>
                ) : null}
            </button>
        </Box>
    );
}
