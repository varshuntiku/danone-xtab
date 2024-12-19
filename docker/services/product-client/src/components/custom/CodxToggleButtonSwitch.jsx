import React, { useState } from 'react';
import { makeStyles, Box, alpha } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    toolBarText: {
        color: theme.palette.text.default,
        fontWeight: 500,
        fontSize: '1.5rem'
    },
    toggleButton: {
        '& .Mui-selected': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText + '!important'
        },
        '& .MuiToggleButtonGroup-grouped': {
            border: '1px solid',
            borderColor: alpha(theme.palette.primary.contrastText, 0.5),
            color: theme.palette.text.default,
            minWidth: '8rem',
            padding: '7px',
            fontSize: '1.1rem'
        },
        '&:hover': {
            cursor: 'pointer'
        }
    }
}));

export default function ToggleButtonSwitch({ elementProps, onChange, ...props }) {
    const [state, setState] = useState(elementProps.defaultValue || '');
    const classes = useStyles(props);
    const [options] = useState(elementProps?.options);
    const handleChange = (event, newState) => {
        if (newState !== null) {
            setState(newState);
            onChange(elementProps.id, newState);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: elementProps?.margin
            }}
        >
            {elementProps?.label ? (
                <label
                    htmlFor="codxToggleButton"
                    className={classes.toolBarText}
                    style={{
                        textAlign: 'center',
                        padding: '0 1rem',
                        fontSize: elementProps?.labelFontSize
                    }}
                >
                    {elementProps.label}
                </label>
            ) : null}
            <ToggleButtonGroup
                color="primary"
                value={state}
                exclusive
                onChange={handleChange}
                aria-label="toggleButton"
                className={classes.toggleButton}
                id="codxToggleButton"
            >
                {options.map((el) => {
                    return (
                        <ToggleButton
                            key={el.value}
                            value={el.value}
                            style={{
                                padding: elementProps?.buttonPadding,
                                fontSize: elementProps?.buttonLabelFontSize
                            }}
                        >
                            {el.label}
                        </ToggleButton>
                    );
                })}
            </ToggleButtonGroup>
        </Box>
    );
}
