import React, { useState } from 'react';
import {
    alpha,
    ThemeProvider,
    createTheme,
    Box,
    InputLabel,
    Select,
    ListItemText,
    MenuItem,
    Checkbox
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const selectCompTheme = (theme) =>
    createTheme({
        ...theme,
        overrides: {
            ...theme.overrides,
            MuiInputBase: {
                root: {
                    color: theme.palette.text.titleText,
                    fontSize: '1.5rem',
                    '&.Mui-disabled': {
                        color: theme.palette.text.titleText
                    }
                }
            },
            MuiFormLabel: {
                root: {
                    color: theme.palette.text.titleText,
                    fontSize: '1.3rem',
                    fontWeight: 500,
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
                    '& fieldset': {
                        borderColor: alpha(theme.palette.primary.contrastText, 0.5)
                    },
                    '&$focused $notchedOutline': {
                        borderColor: alpha(theme.palette.primary.contrastText, 0.5)
                    },
                    '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                        borderColor: alpha(theme.palette.primary.contrastText, 0.5)
                    },
                    '&.Mui-disabled': {
                        '& fieldset$notchedOutline': {
                            borderColor: alpha(theme.palette.primary.contrastText, 0.5)
                        }
                    },
                    '& svg': {
                        fontSize: '3rem' + '!important',
                        paddingRight: '0.2rem'
                    }
                },
                input: {
                    paddingTop: '6px',
                    paddingBottom: '6px'
                }
            },

            MuiSvgIcon: {
                root: {
                    fontSize: '1rem',
                    color: theme.palette.primary.contrastText + '!important',
                    top: '0' + '!important'
                }
            },
            MuiTypography: {
                body1: {
                    fontSize: '1.5rem',
                    color: theme.palette.text.titleText
                },
                body2: {
                    fontSize: '1.5rem'
                },
                caption: {
                    fontSize: '0.6rem',
                    color: theme.palette.text.titleText
                }
            },
            MuiPickersCalendarHeader: {
                dayLabel: {
                    fontSize: '1.25rem',
                    color: theme.palette.text.titleText
                }
            },
            MuiPickersDay: {
                day: {
                    color: theme.palette.text.titleText
                }
            },
            MuiButton: {
                textPrimary: {
                    color: theme.palette.text.titleText,
                    fontSize: theme.spacing(2.5)
                }
            },
            MuiInputLabel: {
                root: {
                    marginBottom: '0.5rem'
                },
                outlined: {
                    transform: ' translate(14px, 12px) scale(1)'
                }
            },
            MuiFormHelperText: {
                root: {
                    fontSize: '1.2rem',
                    color: theme.palette.text.titleText
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
            }
        }
    });

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 1;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            variant: 'menu'
        }
    },
    getContentAnchorEl: null
};
export default function MultiSelectDropdown({ elementProps, onChange }) {
    const [value, setValue] = useState(elementProps?.defaultValue);
    const [options] = useState(elementProps.options);
    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(typeof newValue === 'string' ? newValue.split(',') : newValue);
        onChange(elementProps.id, newValue);
    };
    return (
        <ThemeProvider theme={selectCompTheme}>
            <Box width={elementProps?.width} margin={elementProps?.margin}>
                <InputLabel id={elementProps.label + '-label'}>Select KPI</InputLabel>
                <Select
                    labelId={elementProps.label + '-label'}
                    id={elementProps.label + '-checkbox'}
                    variant="outlined"
                    multiple
                    value={value}
                    onChange={handleChange}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                    fullWidth
                    IconComponent={ExpandMoreIcon}
                >
                    {options.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={value.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </Box>
        </ThemeProvider>
    );
}
