import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@material-ui/core';
import { alpha, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

export const textCompTheme = (theme) =>
    createTheme({
        ...theme,
        overrides: {
            ...theme.overrides,
            MuiInputBase: {
                root: {
                    color: theme.palette.text.titleText,
                    fontSize: '1.6rem'
                }
            },
            MuiFormLabel: {
                root: {
                    color: theme.palette.text.titleText,
                    fontSize: '1.6rem',
                    '&$focused': {
                        color: theme.palette.text.titleText,
                        fontWeight: 'bold'
                    },
                    '&.Mui-disabled': {
                        color: theme.palette.text.titleText
                    }
                }
            },
            MuiOutlinedInput: {
                root: {
                    maxWidth: theme.layoutSpacing(640),
                    '& fieldset': {
                        border: '#A8AFB8 1px solid'
                    },
                    '&$focused $notchedOutline': {
                        borderColor: theme.palette.border.inputFocus
                    },
                    '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                        borderColor: alpha(theme.palette.text.titleText, 0.5)
                    },
                    '&.Mui-disabled': {
                        '& fieldset$notchedOutline': {
                            borderColor: alpha(theme.palette.text.titleText, 0.5),
                            backgroundColor:'#F7F7F7 !important',
                            opacity:'0.6'
                        }
                    }
                },

                input: {
                    // paddingTop: '10px',
                    // paddingBottom: '10px'
                    padding: '4px 10px'
                }
            },
            MuiInput: {
                underline: {
                    '&:before': {
                        borderBottom: `1px solid ${alpha(theme.palette.text.default, 0.4)}`
                    },
                    '&:after': {
                        borderBottom: `2px solid ${theme.palette.text.default}`
                    },
                    '&$focused:after': {
                        borderBottom: `2px solid ${theme.palette.border.inputFocus} !important`
                    }
                }
            },
            MuiInputLabel: {
                outlined: {
                    transform: ' translate(14px, 12px) scale(1)',
                    willChange: 'transform'
                }
            },
            MuiFormHelperText: {
                root: {
                    fontSize: '1.5rem',
                    color: theme.palette.text.titleText
                },
                contained:{
                    marginLeft:theme.layoutSpacing(1)
                }
            }
        }
    });

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch'
        }
    },
    text: {
        '& input': {
            fontSize: '1.8rem',
            color: theme.palette.text.default,
            height: `var(--height)`,
            '&::-webkit-inner-spin-button': {
                display: 'none' // Hide default spinner button
            },
            '&::-webkit-outer-spin-button': {
                display: 'none' // Hide default spinner button
            }
        }
    },
    errorStyles: {
        '& input': {
            backgroundColor: '#FAEFF0',
        }
    }
}));

export default function NumberInput({ onChange, onBlur, fieldInfo }) {
    const classes = useStyles();
    const [value, setValue] = useState(fieldInfo.value);

    const handleChange = (event) => {
        const val = event.target.value === null ? null : Number(event.target.value);
        setValue(val);
        onChange(val);
    };
    const handleBlur = (e) => {
        if (value < fieldInfo?.inputprops?.min) {
            setValue(fieldInfo.inputprops.min);
            onChange(fieldInfo.inputprops.min);
        } else if (value > fieldInfo?.inputprops?.max) {
            setValue(fieldInfo.inputprops.max);
            onChange(fieldInfo.inputprops.max);
        }
        if (onBlur) {
            onBlur(e);
        }
    };

    useEffect(() => {
        setValue(fieldInfo?.value);
    }, [fieldInfo?.value]);

    return (
        <ThemeProvider theme={textCompTheme}>
            <TextField
                error={fieldInfo.error}
                helperText={fieldInfo.helperText}
                multiline={fieldInfo.multiline}
                required={fieldInfo.required}
                id={fieldInfo.id + fieldInfo.name}
                name={fieldInfo.name}
                label={fieldInfo.label}
                value={value}
                defaultValue={value}
                fullWidth={fieldInfo.fullWidth}
                placeholder={fieldInfo.placeholder}
                variant={fieldInfo.variant}
                margin={fieldInfo.margin}
                inputProps={{ type: 'number', ...fieldInfo.inputprops }}
                onChange={handleChange}
                InputLabelProps={fieldInfo.InputLabelProps}
                className={`${classes.text} ${fieldInfo.error && fieldInfo.errorStyles ? classes.errorStyles : ''}`}
                onBlur={handleBlur}
                autoFocus={fieldInfo.autoFocus}
                disabled={fieldInfo.disabled}
                style={{ '--height': `${fieldInfo.height / 10.5}rem` }}
            />
        </ThemeProvider>
    );
}
