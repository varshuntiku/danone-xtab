import React from 'react';
import DateFnsUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';
import { createTheme, alpha, ThemeProvider } from '@material-ui/core';
import { dateToString, parseDate } from '../../../util';

const datePickerTheme = (theme) =>
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
                    }
                }
            },
            MuiInputLabel: {
                outlined: {
                    transform: ' translate(14px, 12px) scale(1)'
                }
            },
            MuiOutlinedInput: {
                root: {
                    '& fieldset': {
                        borderColor: alpha(theme.palette.text.titleText, 0.5)
                    },
                    '&$focused $notchedOutline': {
                        borderColor: alpha(theme.palette.text.titleText, 0.5)
                    },
                    '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                        borderColor: alpha(theme.palette.text.titleText, 0.5)
                    }
                },
                input: {
                    paddingTop: '10px',
                    paddingBottom: '10px'
                },
                adornedEnd: {
                    paddingRight: 0
                }
            },

            MuiSvgIcon: {
                root: {
                    fontSize: '2rem',
                    color: theme.palette.text.titleText
                }
            },
            MuiTypography: {
                body1: {
                    fontSize: '2rem',
                    color: theme.palette.text.titleText
                },
                body2: {
                    fontSize: '1.25rem'
                },
                caption: {
                    fontSize: '1rem',
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
                },
                current: {
                    color: theme.palette.primary.contrastText
                }
            },
            MuiPickersYear: {
                root: {
                    color: theme.palette.text.titleText
                }
            },
            MuiPickersClockNumber: {
                clockNumber: {
                    color: theme.palette.text.titleText
                }
            },
            PrivateTabIndicator: {
                colorSecondary: {
                    backgroundColor: theme.palette.primary.contrastText
                }
            },
            MuiButton: {
                textPrimary: {
                    color: theme.palette.text.titleText,
                    fontSize: theme.spacing(2.5)
                }
            },
            MuiFormHelperText: {
                root: {
                    fontSize: '1.2rem',
                    color: theme.palette.text.titleText
                }
            }
        }
    });

const getSeconds = (setSeconds, date) => {
    if (setSeconds === undefined) {
        const selectedDate = parseDate(date);
        if (selectedDate && !isNaN(selectedDate.getTime())) {
            return [selectedDate.getSeconds(), selectedDate.getMilliseconds()];
        } else {
            return [0, 0];
        }
    } else {
        return setSeconds;
    }
};

export default function DateTimePicker({ onChange, onBlur, fieldInfo, validateChange }) {
    const { suppressUTC, allowInvalid } = fieldInfo;
    const [selectedDate, setSelectedDate] = React.useState(parseDate(fieldInfo.value));

    const [setSeconds] = React.useState(getSeconds(fieldInfo.setSeconds, fieldInfo.value));

    const handleDateChange = (d) => {
        const date = new Date(d?.toDate());

        if (setSeconds?.length) {
            date.setSeconds(...setSeconds);
        }
        if (validateChange) {
            if (!validateChange(dateToString(date, suppressUTC, allowInvalid))) {
                return;
            }
        }
        setSelectedDate(date);
        onChange(dateToString(date, suppressUTC, allowInvalid));
    };

    return (
        <ThemeProvider theme={datePickerTheme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                    error={fieldInfo.error}
                    helperText={fieldInfo.helperText}
                    inputVariant={fieldInfo.variant}
                    variant="inline"
                    {...fieldInfo.inputprops}
                    margin={fieldInfo.margin}
                    id={fieldInfo.id + 'date-picker-inline'}
                    label={fieldInfo.label}
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date'
                    }}
                    onBlur={onBlur}
                    autoFocus={fieldInfo.autoFocus}
                    size={fieldInfo.size}
                />
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    );
}
