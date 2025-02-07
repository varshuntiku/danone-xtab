import React, { forwardRef } from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
// import Input from '@material-ui/core/Input';
import { createTheme, Input, ThemeProvider } from '@material-ui/core';
import { useEffect } from 'react';
import { isArray } from 'underscore';

const useStyles = makeStyles((theme) => ({
    selectEmpty: {
        marginTop: theme.spacing(0)
    },
    dropdownIcon: {
        width: '2.5rem',
        height: '2.5rem',
        borderRadius: '50%'
    },
    IconText: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexDirection: (fieldInfo) => (fieldInfo.iconPosition === 'right' ? 'row-reverse' : null),
        width: '100%'
    },
    text: {
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    }
}));

export const selectCompTheme = (theme) =>
    createTheme({
        ...theme,
        overrides: {
            ...theme.overrides,
            MuiSelect: {
                root: {
                    display: 'flex'
                },
                icon: {
                    position: 'static',
                    color: alpha(theme.palette.text.revamp, 0.8)
                },
                outlined: {
                    '&:focus': {
                        background: theme.palette.background.pureWhite
                    }
                }
            },
            MuiInputBase: {
                root: {
                    color: theme.palette.text.titleText,
                    maxWidth: theme.layoutSpacing(640),
                    fontSize: '1.6rem',
                    '&.Mui-disabled': {
                        color: theme.palette.text.titleText
                    },
                    [theme.breakpoints.down('xs')]: {
                        fontSize: '2.5rem'
                    },
                    [theme.breakpoints.down('sm')]: {
                        fontSize: '2rem'
                    }
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
                    },
                    [theme.breakpoints.up('xs')]: {
                        fontSize: '2.5rem'
                    },
                    [theme.breakpoints.up('sm')]: {
                        fontSize: '2rem'
                    },
                    [theme.breakpoints.up('md')]: {
                        fontSize: '1.6rem'
                    }
                }
            },
            MuiOutlinedInput: {
                root: {
                    padding: `${theme.layoutSpacing(10)} ${theme.layoutSpacing(12)}`,
                    height: theme.layoutSpacing(40),
                    borderRadius: '2px',
                    '& fieldset': {
                        borderColor: theme.palette.border.grey,
                        '&:hover': {
                            borderColor: theme.palette.text.revamp
                        }
                    },
                    '&$focused $notchedOutline': {
                        borderColor: theme.palette.border.inputOnFoucs,
                        borderWidth: '1px'
                    },
                    '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                        borderColor: alpha(theme.palette.text.titleText, 0.5)
                    },
                    '&.Mui-disabled': {
                        '& fieldset$notchedOutline': {
                            borderColor: alpha(theme.palette.text.revamp, 0.4)
                        },
                        '& svg': {
                            color: alpha(theme.palette.text.revamp, 0.4)
                        }
                    },
                    '& svg': {
                        color: theme.palette.icons.closeIcon
                    },
                    '&$focused': {
                        '& svg': {
                            color: theme.palette.border.inputOnFoucs
                        }
                    }
                },
                input: {
                    padding: 0,
                    fontSize: theme.layoutSpacing(16),
                    letterSpacing: theme.layoutSpacing(0.5),
                    fontFamily: theme.body.B1.fontFamily,
                    color: theme.palette.text.revamp
                }
            },
            MuiSvgIcon: {
                root: {
                    fontSize: theme.layoutSpacing(24)
                }
            },
            MuiTypography: {
                body1: {
                    fontSize: '1.6rem',
                    color: theme.palette.text.titleText,
                    [theme.breakpoints.down('xs')]: {
                        fontSize: '2.6rem'
                    },
                    [theme.breakpoints.down('sm')]: {
                        fontSize: '2rem'
                    }
                },
                body2: {
                    fontSize: '1.25rem',
                    [theme.breakpoints.down('xs')]: {
                        fontSize: '2.25rem'
                    },
                    [theme.breakpoints.down('sm')]: {
                        fontSize: '2rem'
                    }
                },
                caption: {
                    fontSize: '1rem',
                    color: theme.palette.text.titleText,
                    [theme.breakpoints.down('xs')]: {
                        fontSize: '2rem'
                    },
                    [theme.breakpoints.down('sm')]: {
                        fontSize: '1.5rem'
                    }
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
            label: {
                transform: ' translate(14px, 10px) scale(1)',
                color: theme.palette.text.revamp,
                fontSize: theme.layoutSpacing(15),
                fontFamily: theme.body.B1.fontFamily,
                letterSpacing: 0,
                lineHeight: 'normal',
                '&.MuiInputLabel-shrink': {
                    transform: `translate(${theme.layoutSpacing(12)}, ${theme.layoutSpacing(
                        4
                    )}) scale(1)`,
                    fontWeight: '500',
                    fontSize: theme.layoutSpacing(13)
                }
            },
            MuiInputLabel: {
                outlined: {
                    transform: ' translate(14px, 12px) scale(1)',
                    color: theme.palette.text.revamp,
                    fontSize: theme.layoutSpacing(15),
                    fontFamily: theme.body.B1.fontFamily,
                    letterSpacing: 0,
                    '&.MuiInputLabel-shrink': {
                        transform: `translate(${theme.layoutSpacing(12)}, ${theme.layoutSpacing(
                            8
                        )}) scale(1)`,
                        fontWeight: '500',
                        fontSize: theme.layoutSpacing(13)
                    }
                },

                '&.Mui-error': {
                    color: theme.palette.text.error
                },
                '&.Mui-disabled': {
                    color: alpha(theme.palette.text.revamp, 0.6)
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
                    borderBottom: 'none',
                    '&:before': {
                        borderBottom: 'none'
                    },
                    '&:after': {
                        borderBottom: 'none'
                    },
                    '&:hover:not($disabled):before': {
                        borderBottom: 'none'
                    },
                    '&$focused': { backgroundColor: 'transparent' },
                    '&$focused svg': {
                        color: theme.palette.background.infoBgDark
                    }
                }
            },
            MuiMenu: {
                list: {
                    padding: 0,
                    borderRadius: '2px',
                    '& li': {
                        minHeight: theme.layoutSpacing(40),
                        padding: `${theme.layoutSpacing(10)} ${theme.layoutSpacing(16)}`,
                        '&:hover': {
                            background: theme.palette.background.menuItemHover
                        },
                        '&:focus': {
                            background: alpha(theme.palette.background.menuItemFocus, 0.6)
                        }
                    }
                },
                paper: {
                    borderRadius: '2px',
                    marginTop: theme.layoutSpacing(32)
                }
            },
            MuiListItem: {
                root: {
                    height: theme.layoutSpacing(40),
                    padding: `${theme.layoutSpacing(10)} ${theme.layoutSpacing(16)}`
                }
            },
            MuiMenuItem: {
                root: {
                    height: theme.layoutSpacing(40),
                    padding: `${theme.layoutSpacing(10)} ${theme.layoutSpacing(16)}`
                }
            },
            MuiListItemText: {
                root: {
                    fontSize: theme.layoutSpacing(15),
                    color: theme.palette.text.revamp,
                    letterSpacing: theme.layoutSpacing(0.5)
                }
            }
        }
    });

const secondTheme = (theme) =>
    createTheme({
        ...theme,
        overrides: {
            ...theme.overrides,
            MuiSelect: {
                root: {
                    display: 'flex'
                }
            },
            MuiInputBase: {
                root: {
                    color: theme.palette.text.black,
                    fontSize: '1.6rem',
                    '&.Mui-disabled': {
                        color: theme.palette.text.black
                    },
                    [theme.breakpoints.down('xs')]: {
                        fontSize: '2.5rem'
                    },
                    [theme.breakpoints.down('sm')]: {
                        fontSize: '2rem'
                    }
                }
            },
            MuiFormLabel: {
                root: {
                    color: theme.palette.text.black,
                    fontSize: '1.6rem',
                    '&$focused': {
                        color: theme.palette.text.black,
                        fontWeight: 'bold'
                    },
                    '&.Mui-disabled': {
                        color: theme.palette.text.black
                    },
                    [theme.breakpoints.up('xs')]: {
                        fontSize: '2.5rem'
                    },
                    [theme.breakpoints.up('sm')]: {
                        fontSize: '2rem'
                    },
                    [theme.breakpoints.up('md')]: {
                        fontSize: '1.6rem'
                    }
                }
            },
            MuiOutlinedInput: {
                root: {
                    '& fieldset': {
                        borderColor: '#00000070'
                    },
                    '&$focused $notchedOutline': {
                        borderColor: '#00000070'
                    },
                    '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                        borderColor: '#00000070'
                    },
                    '&.Mui-disabled': {
                        '& fieldset$notchedOutline': {
                            borderColor: '#00000070'
                        }
                    }
                },
                input: {
                    paddingTop: '10px',
                    paddingBottom: '10px'
                }
            },

            MuiSvgIcon: {
                root: {
                    fontSize: '2rem',
                    color: `${theme.palette.text.black} !important`
                }
            },
            MuiTypography: {
                body1: {
                    fontSize: '1.6rem',
                    color: theme.palette.text.titleText,
                    [theme.breakpoints.down('xs')]: {
                        fontSize: '2.6rem'
                    },
                    [theme.breakpoints.down('sm')]: {
                        fontSize: '2rem'
                    }
                },
                body2: {
                    fontSize: '1.25rem',
                    [theme.breakpoints.down('xs')]: {
                        fontSize: '2.25rem'
                    },
                    [theme.breakpoints.down('sm')]: {
                        fontSize: '2rem'
                    }
                },
                caption: {
                    fontSize: '1rem',
                    color: theme.palette.text.titleText,
                    [theme.breakpoints.down('xs')]: {
                        fontSize: '2rem'
                    },
                    [theme.breakpoints.down('sm')]: {
                        fontSize: '1.5rem'
                    }
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
                outlined: {
                    transform: ' translate(14px, 12px) scale(1)',
                    color: theme.palette.text.revamp,
                    fontSize: theme.layoutSpacing(15),
                    fontFamily: theme.body.B1.fontFamily,
                    letterSpacing: 0,
                    '.MuiInputLabel-shrink': {
                        transform: `translate(${theme.layoutSpacing(12)}, ${theme.layoutSpacing(
                            8
                        )}) scale(1)`,
                        fontWeight: '500',
                        fontSize: theme.layoutSpacing(13)
                    }
                },

                '&.Mui-error': {
                    color: theme.palette.text.error
                },
                '&.Mui-disabled': {
                    color: alpha(theme.palette.text.revamp, 0.6)
                }
            },
            outlined: {
                transform: ' translate(14px, 12px) scale(1)',
                color: theme.palette.text.revamp,
                fontSize: theme.layoutSpacing(15),
                fontFamily: theme.body.B1.fontFamily,
                letterSpacing: 0,
                '&.MuiInputLabel-shrink': {
                    transform: `translate(${theme.layoutSpacing(12)}, ${theme.layoutSpacing(
                        8
                    )}) scale(1)`,
                    fontWeight: '500',
                    fontSize: theme.layoutSpacing(13)
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
            },
            MuiMenuItem: {
                root: {
                    [theme.breakpoints.down('sm')]: {
                        minHeight: '2.5rem'
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
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
            //width: 250,
        }
    },
    getContentAnchorEl: null
};

const getMapping = (fieldInfo) => {
    if (fieldInfo?.optionLabelKey && fieldInfo?.optionValueKey) {
        const res = {};

        const valueKey = fieldInfo.optionValueKey;
        const labelKey = fieldInfo.optionLabelKey;
        isArray(fieldInfo.options) &&
            fieldInfo.options?.forEach((el) => {
                res[el[valueKey]] = el[labelKey];
            });
        return res;
    }
    return null;
};

export default function SimpleSelect({ onChange, onBlur, fieldInfo }) {
    const classes = useStyles(fieldInfo);
    const [value, setValue] = React.useState(
        fieldInfo?.multiple ? fieldInfo.value || [] : fieldInfo.value
    );
    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    const [mapping, setMapping] = React.useState(getMapping(fieldInfo));
    const [search, setSearch] = React.useState('');

    useEffect(() => {
        setMapping(getMapping(fieldInfo));
        setValue(fieldInfo?.multiple ? fieldInfo.value || [] : fieldInfo.value);
    }, [fieldInfo]);

    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    const handleChange = (event) => {
        setValue(event.target.value);
        onChange(event.target.value);
    };
    const valueKey = fieldInfo.optionValueKey;
    const labelKey = fieldInfo.optionLabelKey;
    const getLabel = (v) => {
        if (typeof v === 'number') {
            let icon = fieldInfo?.options.filter((el) => el.id === v)[0]?.icon;
            return (
                <div className={classes.IconText}>
                    {icon && fieldInfo?.showIcons && (
                        <img src={icon} className={classes.dropdownIcon} alt="image-dropdown" />
                    )}
                    <span>{mapping?.[v?.value ? v.value : v]}</span>
                </div>
            );
        } else {
            let icon = v?.icon;
            return (
                <div className={classes.IconText}>
                    {icon && fieldInfo?.showIcons && (
                        <img src={icon} className={classes.dropdownIcon} alt="image-dropdown" />
                    )}
                    <span className={classes.text}>
                        {' '}
                        {v?.value ? v.value : mapping?.[v] ? mapping[v] : v}
                    </span>
                </div>
            );
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value.toLowerCase());
    };

    return (
        <ThemeProvider theme={fieldInfo?.state === 'flow' ? secondTheme : selectCompTheme}>
            <FormControl
                variant={fieldInfo.variant}
                fullWidth={fieldInfo.fullWidth}
                className={classes.selectEmpty}
                required={fieldInfo.required}
                error={fieldInfo.error}
            >
                <InputLabel
                    ref={inputLabel}
                    id={fieldInfo.id + 'demo-simple-select-outlined-label'}
                    style={{
                        fontSize: fieldInfo?.labelFontSize ? fieldInfo.labelFontSize : '1.6rem'
                    }}
                >
                    {fieldInfo.label}
                </InputLabel>
                <Select
                    error={fieldInfo.error}
                    labelId={fieldInfo.id + 'demo-simple-select-outlined-label'}
                    id={fieldInfo.id + 'demo-simple-select-outlined'}
                    name={fieldInfo.name}
                    value={value}
                    multiple={fieldInfo.multiple}
                    onChange={handleChange}
                    renderValue={
                        fieldInfo.multiple
                            ? (selected) => {
                                  let selectedItems = selected.map(getLabel);
                                  return selectedItems.map((el, index) => (
                                      <div style={{ display: 'flex' }} key={index}>
                                          {el}
                                          {!(selectedItems.length - 1 === index) && (
                                              <span style={{ marginTop: '0.4rem' }}>,&nbsp;</span>
                                          )}
                                      </div>
                                  ));
                              }
                            : (selected) => getLabel(selected)
                    }
                    margin={fieldInfo.margin}
                    defaultValue={fieldInfo.defaultValue}
                    inputProps={fieldInfo.inputprops}
                    placeholder={fieldInfo.placeholder}
                    labelWidth={labelWidth}
                    MenuProps={MenuProps}
                    onBlur={onBlur}
                    autoFocus={fieldInfo.autoFocus}
                    disabled={fieldInfo.disabled}
                    size={fieldInfo.size}
                    fullWidth={fieldInfo.fullWidth}
                    onClose={() => window.requestAnimationFrame(() => setSearch(''))}
                    style={{ display: 'flex', ...fieldInfo.style }}
                >
                    {fieldInfo.search ? (
                        <SearchWrapper>
                            <div style={{ padding: '0 1rem' }}>
                                <Input
                                    placeholder="Search..."
                                    fullWidth
                                    onChange={handleSearchChange}
                                    onKeyDown={(e) => e.stopPropagation()}
                                ></Input>
                            </div>
                        </SearchWrapper>
                    ) : null}
                    {isArray(fieldInfo.options) &&
                        fieldInfo.options
                            ?.filter((el) => {
                                const value = labelKey ? el[labelKey] : el;
                                if (search) {
                                    return (value?.value ? value?.value : value)
                                        ?.toLowerCase()
                                        .includes(search);
                                } else {
                                    return true;
                                }
                            })
                            .map((element) => (
                                <MenuItem
                                    key={valueKey ? element[valueKey] : element}
                                    value={valueKey ? element[valueKey] : element}
                                >
                                    {fieldInfo.multiple ? (
                                        <Checkbox
                                            checked={value?.includes(
                                                valueKey ? element[valueKey] : element
                                            )}
                                        />
                                    ) : (
                                        ''
                                    )}
                                    <div className={classes.IconText}>
                                        {element?.icon && fieldInfo?.showIcons && (
                                            <img
                                                src={element.icon}
                                                alt="image-dropdown"
                                                className={classes.dropdownIcon}
                                            />
                                        )}
                                        <ListItemText
                                            primary={
                                                labelKey
                                                    ? element[labelKey]
                                                    : element?.value
                                                    ? element.value
                                                    : element
                                            }
                                            // style={{fontSize: '2.5rem'}}
                                        />
                                    </div>
                                </MenuItem>
                            ))}
                </Select>
                <FormHelperText style={{ ...fieldInfo?.style }}>
                    {fieldInfo.helperText}
                </FormHelperText>
            </FormControl>
        </ThemeProvider>
    );
}

const SearchWrapper = forwardRef(({ children }, ref) => {
    return <div ref={ref}>{children}</div>;
});

SearchWrapper.displayName = 'SearchWrapper';
