import React from 'react';
import textInputStyles from './styles';
import { TextField, withStyles } from '@material-ui/core';

const TextInput = ({
    value,
    label,
    placeholder = null,
    InputProps = {},
    inputProps = {},
    onChange,
    classes
}) => {
    return (
        <TextField
            label={label}
            value={value}
            onChange={onChange}
            className={classes.textField}
            InputProps={{
                classes: {
                    underline: classes.underline,
                    input: classes.input
                },
                ...InputProps
            }}
            inputProps={inputProps}
            placeholder={placeholder}
            id={label}
        />
    );
};

export default withStyles(textInputStyles, { withTheme: true })(TextInput);
