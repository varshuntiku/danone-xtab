import React, { useState } from 'react';
import { Box } from '@material-ui/core';

export default function FadedButton({ elementProps, classes, onChange }) {
    const [state, setState] = useState(false);
    return (
        <Box margin={elementProps?.margin}>
            <button
                className={classes.button}
                onClick={() => {
                    setState(!state);
                    onChange(elementProps.id, state);
                }}
            >
                {elementProps.label}
            </button>
        </Box>
    );
}
