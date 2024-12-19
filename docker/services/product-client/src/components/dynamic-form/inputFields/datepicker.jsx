import React, { useState } from 'react';
import DateFnsUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { createTheme, ThemeProvider } from '@material-ui/core';
import { dateToString, parseDate } from '../../../util';

const popOverProps = {
    anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right'
    },
    transformOrigin: {
        vertical: 'top',
        horizontal: 'right'
    },
    style: {
        marginTop: '0.2rem',
        marginLeft: '7rem'
    }
};

const getHours = (setHours, date) => {
    if (setHours === undefined) {
        const selectedDate = parseDate(date);
        if (selectedDate && !isNaN(selectedDate.getTime())) {
            return [
                selectedDate.getHours(),
                selectedDate.getMinutes(),
                selectedDate.getSeconds(),
                selectedDate.getMilliseconds()
            ];
        } else {
            return [0, 0, 0, 0];
        }
    } else {
        return setHours;
    }
};

export default function DatePicker({ onChange, onBlur = () => {}, fieldInfo, validateChange }) {
    const { suppressUTC, allowInvalid } = fieldInfo;
    const [isOpen, setOpen] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState(parseDate(fieldInfo.value));
    const [setHours] = useState(getHours(fieldInfo.setHours, fieldInfo.value));

    // defining theme inside the component defintion to allow for conditional property setting
    const datePickerTheme = React.useCallback(
        (theme) =>
            createTheme({
                ...theme,
                overrides: {
                    ...theme.overrides,
                    MuiPaper: {
                        root: {
                            backgroundColor: `${theme.palette.background.datePickerBg}!important`,
                            marginTop: theme.layoutSpacing(2)
                        }
                    },
                    MuiInputBase: {
                        root: {
                            color: theme.palette.text.titleText,
                            fontSize: '1.6rem',
                            maxWidth: theme.layoutSpacing(640)
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
                                borderColor: isOpen
                                    ? theme.palette.border.inputOnFoucs
                                    : theme.palette.border.grey
                            },
                            '&$focused $notchedOutline': {
                                borderWidth: '0.7px',
                                borderColor: theme.palette.border.inputOnFoucs
                            },
                            '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                                borderColor: theme.palette.border.inputOnHover
                            },
                            borderRadius: '2px'
                        },
                        input: {
                            padding: `${theme.layoutSpacing(10)} ${theme.layoutSpacing(12)}`,
                            lineHeight: theme.layoutSpacing(20),
                            fontSize: theme.layoutSpacing(15),
                            letterSpacing: '0.35px'
                        },
                        adornedEnd: {
                            paddingRight: 0
                        }
                    },
                    MuiSvgIcon: {
                        root: {
                            fontSize: '2rem',
                            color: isOpen
                                ? theme.palette.icons.closeIcon
                                : theme.palette.icons.closeIcon + 'cc',
                            width: theme.layoutSpacing(24),
                            height: theme.layoutSpacing(24)
                        }
                    },
                    MuiTypography: {
                        body1: {
                            fontSize: '2rem',
                            color: theme.palette.text.titleText
                        },
                        body2: {
                            fontSize: '1.5rem'
                        },
                        caption: {
                            fontSize: '1rem',
                            color: theme.palette.text.titleText
                        }
                    },
                    MuiPickersCalendarHeader: {
                        switchHeader: {
                            paddingLeft: theme.layoutSpacing(30),
                            paddingRight: theme.layoutSpacing(30 - 12)
                        },
                        dayLabel: {
                            fontSize: '1.25rem',
                            color: theme.palette.text.titleText
                        },
                        iconButton: {
                            order: 2,
                            backgroundColor: 'transparent',
                            width: theme.layoutSpacing(24),
                            height: theme.layoutSpacing(24),
                            padding: theme.layoutSpacing(20),
                            '& svg': {
                                color: theme.palette.text.titleText
                            }
                        },
                        transitionContainer: {
                            height: theme.layoutSpacing(24),
                            order: 1,
                            '& p': {
                                fontFamily: theme.title.h1.fontFamily,
                                fontSize: theme.layoutSpacing(15.5),
                                fontWeight: 500,
                                lineHeight: theme.layoutSpacing(24),
                                textAlign: 'left'
                            }
                        }
                    },
                    MuiPickersDay: {
                        day: {
                            color: theme.palette.text.titleText
                        },
                        current: {
                            color: theme.palette.text.default,
                            border: `1px solid ${theme.palette.background.dateSelected}`,
                            backgroundColor: 'transparent'
                        },
                        daySelected: {
                            color: theme.palette.text.purpleText,
                            backgroundColor: theme.palette.background.dateSelected,
                            '&:hover': {
                                backgroundColor: theme.palette.background.dateSelected
                            }
                        },
                        currentDaySelected: {
                            color: theme.palette.text.purpleText,
                            backgroundColor: theme.palette.background.dateSelected,
                            border: `1px solid ${theme.palette.primary.main}`,
                            '&:hover': {
                                backgroundColor: theme.palette.background.dateSelected
                            }
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
                    MuiIconButton: {
                        root: {
                            marginRight: 0,
                            padding: `${theme.layoutSpacing(8)} ${theme.layoutSpacing(12)}`,
                            '&:hover': {
                                backgroundColor: theme.palette.background.tableSelcted
                            }
                        }
                    },
                    MuiFormHelperText: {
                        root: {
                            fontSize: '1.2rem',
                            color: theme.palette.text.titleText
                        }
                    },
                    MuiPickersDatePickerRoot: {
                        toolbar: {
                            height: theme.layoutSpacing(80),
                            background: theme.palette.background.datePickerBg,
                            '& h6': {
                                fontFamily: theme.title.h1.fontFamily,
                                fontSize: theme.layoutSpacing(13),
                                letterSpacing: theme.layoutSpacing(0.5)
                            },
                            '& h4': {
                                fontFamily: theme.title.h1.fontFamily,
                                fontSize: theme.layoutSpacing(15),
                                letterSpacing: theme.layoutSpacing(0.5)
                            }
                        }
                    },
                    MuiFormControl: {
                        root: {
                            width: '100%'
                        }
                    }
                }
            }),
        [isOpen]
    );

    const handleDateChange = (d) => {
        const date = new Date(d?.toDate());
        if (setHours?.length) {
            date.setHours(...setHours);
        }
        if (validateChange) {
            if (!validateChange(dateToString(date, suppressUTC, allowInvalid))) {
                return;
            }
        }
        setSelectedDate(date);
        onChange(dateToString(date, suppressUTC, allowInvalid));
    };

    const handleOpenClose = () => {
        setOpen(() => !isOpen);
    };

    return (
        <ThemeProvider theme={datePickerTheme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    // disableToolbar={true}
                    error={fieldInfo.error}
                    helperText={fieldInfo.helperText}
                    fullWidth={fieldInfo.fullWidth}
                    inputVariant={fieldInfo.variant}
                    variant="inline"
                    {...fieldInfo.inputprops}
                    margin={fieldInfo.margin}
                    id={fieldInfo.id + 'date-picker-inline'}
                    label={fieldInfo.label}
                    value={selectedDate}
                    PopoverProps={popOverProps}
                    onOpen={handleOpenClose}
                    onClose={handleOpenClose}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date'
                    }}
                    InputLabelProps={{
                        shrink: selectedDate ? true : undefined
                    }}
                    onBlur={onBlur}
                    autoFocus={fieldInfo.autoFocus}
                    size={fieldInfo.size}
                    format="DD/MM/YYYY"
                />
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    );
}
