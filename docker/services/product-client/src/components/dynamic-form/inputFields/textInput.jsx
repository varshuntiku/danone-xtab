import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, IconButton } from '@material-ui/core';
import { alpha, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';

export const textCompTheme = (theme) =>
    createTheme({
        ...theme,
        overrides: {
            ...theme.overrides,
            MuiInputBase: {
                root: {
                    color: theme.palette.text.revamp,
                    fontSize: theme.layoutSpacing(15),
                    fontFamily: theme.title.h1.fontFamily,
                    letterSpacing: theme.layoutSpacing(0.5)
                }
            },
            MuiFormLabel: {
                root: {
                    color: theme.palette.text.revamp,
                    fontSize: theme.layoutSpacing(15),
                    fontFamily: theme.title.h1.fontFamily,
                    letterSpacing: theme.layoutSpacing(0.35),
                    '&$focused': {
                        color: theme.palette.text.revamp,
                        fontWeight: 'bold'
                        // letterSpacing: theme.layoutSpacing(0.5),
                        // fontSize: theme.layoutSpacing(17)
                    },
                    '&.Mui-disabled': {
                        color: theme.palette.text.titleText
                    },
                    '&.MuiInputLabel-shrink': {
                        transform: `translate(${theme.layoutSpacing(12)}, ${theme.layoutSpacing(
                            8
                        )}) scale(1)`,
                        fontWeight: '500',
                        fontSize: theme.layoutSpacing(14)
                    }
                }
            },
            MuiOutlinedInput: {
                root: {
                    maxWidth: theme.layoutSpacing(640),
                    height: theme.layoutSpacing(40),
                    borderRadius: '2px',
                    '& fieldset': {
                        borderColor: theme.palette.border.grey,
                        '&:hover': {
                            borderColor: theme.palette.text.revamp
                        }
                    },
                    '& legend': {
                        fontSize: '0.8em'
                    },
                    '&$focused $notchedOutline': {
                        borderColor: theme.palette.border.inputOnFoucs,
                        borderWidth: '1px'
                    },
                    '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                        borderColor: alpha(theme.palette.text.titleText, 0.5)
                        // borderWidth: 1.5,
                    },
                    '&.Mui-disabled': {
                        '& fieldset$notchedOutline': {
                            borderColor: alpha(theme.palette.text.revamp, 0.4)
                        }
                    }
                },
                input: {
                    padding: `${theme.layoutSpacing(10)} ${theme.layoutSpacing(12)}`,
                    height: theme.layoutSpacing(40)
                },
                multiline: {
                    height: 'auto',
                    padding: `${theme.layoutSpacing(10)} ${theme.layoutSpacing(12)}`
                }
            },
            MuiInput: {
                underline: {
                    '&:before': {
                        borderBottom: `1px solid ${alpha(theme.palette.text.default, 0.4)}`
                    },
                    '&:after': {
                        borderBottom: `2px solid ${theme.palette.text.default}`
                    }
                }
            },
            MuiInputLabel: {
                outlined: {
                    transform: ' translate(14px, 12px) scale(1)',
                    willChange: 'transform',
                    fontSize: theme.layoutSpacing(15),
                    fontFamily: theme.body.B1.fontFamily,
                    letterSpacing: 0,
                    '&.MuiInputLabel-shrink': {
                        transform: `translate(${theme.layoutSpacing(12)}, ${theme.layoutSpacing(
                            -6
                        )}) scale(1)`,
                        fontWeight: '500',
                        fontSize: theme.layoutSpacing(13)
                    }
                }
            },
            MuiFormHelperText: {
                root: {
                    fontSize: theme.layoutSpacing(13),
                    '&.Mui-error': {
                        margin: `${theme.layoutSpacing(2)} 0 0`,
                        color: theme.palette.text.error
                    }
                }
            }
        }
    });

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '100%'
        }
    },
    text: {
        '& input': {
            color: theme.palette.text.revamp,
            fontSize: theme.layoutSpacing(15),
            fontFamily: theme.body.B1.fontFamily,
            letterSpacing: theme.layoutSpacing(0.5)
        }
    },
    deleteBtnStyle: {
        position: 'absolute',
        top: '2px',
        right: '0px',
        background: 'red',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        height: '0.4rem',
        width: '0.12rem'
    },
    font2: {
        fontSize: '1.6rem',
        zIndex: '20'
    }
}));

export default function TextInput({ onChange, onBlur, onPaste, fieldInfo, handleDeleteField }) {
    const classes = useStyles();
    const [value, setValue] = useState(fieldInfo.value);

    const isFieldDeletable = fieldInfo?.isColDeletable || false;
    const handleChange = (event) => {
        setValue(event.target.value);
        onChange(event.target.value);
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
                defaultValue={value}
                value={value}
                fullWidth={fieldInfo.fullWidth}
                placeholder={fieldInfo.placeholder}
                variant={fieldInfo.variant}
                margin={fieldInfo.margin}
                inputProps={fieldInfo.inputprops}
                onChange={handleChange}
                InputLabelProps={fieldInfo.InputLabelProps}
                className={classes.text}
                onBlur={onBlur}
                autoFocus={fieldInfo.autoFocus}
                disabled={fieldInfo.disabled}
                size={fieldInfo.size}
                onPaste={onPaste}
                maxRows={fieldInfo.maxRows}
                minRows={fieldInfo.minRows}
            />
            {isFieldDeletable ? (
                <IconButton
                    onClick={() => handleDeleteField(fieldInfo)}
                    title={'delete column'}
                    aria-label="Del col"
                    className={classes.deleteBtnStyle}
                >
                    <DeleteIcon className={classes.font2} />
                </IconButton>
            ) : null}
        </ThemeProvider>
    );
}
