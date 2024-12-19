import React, { useRef } from 'react';
import { ThemeProvider, createTheme /*, Typography, Menu, MenuItem*/ } from '@material-ui/core';
import { alpha, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import * as _ from 'underscore';

const textCompTheme = (theme) =>
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
            MuiOutlinedInput: {
                root: {
                    '& fieldset': {
                        borderColor: alpha(theme.palette.text.titleText, 0.5)
                    },
                    '&$focused $notchedOutline': {
                        borderColor: alpha(theme.palette.text.titleText, 0.5)
                        // borderWidth: 1.5,
                    },
                    '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                        borderColor: alpha(theme.palette.text.titleText, 0.5)
                        // borderWidth: 1.5,
                    }
                },
                input: {
                    paddingTop: '10px',
                    paddingBottom: '10px'
                }
            },
            MuiInputLabel: {
                outlined: {
                    transform: ' translate(14px, 12px) scale(1)'
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
            fontSize: '1.6rem',
            color: theme.palette.text.default
        }
    },
    menu: {
        // position: 'absolute',
        color: theme.palette.text.default,
        backgroundColor: theme.palette.primary.light,
        maxHeight: theme.spacing(25),
        padding: theme.spacing(1, 2),
        overflow: 'auto',
        borderRadius: theme.spacing(0, 0, 2.5, 2.5)
        // top: theme.spacing(7.5) + ' !important',
    },
    menuFixed: {
        // position: 'absolute',
        color: theme.palette.text.default,
        backgroundColor: theme.palette.primary.light,
        height: theme.spacing(25),
        width: '100%',
        padding: theme.spacing(1, 2),
        overflow: 'auto',
        borderRadius: theme.spacing(0, 0, 2.5, 2.5)
        // top: theme.spacing(7.5) + ' !important',
    },
    menuItem: {
        cursor: 'pointer',
        '&:hover': {
            opacity: 0.5
        }
    }
}));

export default function AutoSuggest({ onBlur, fieldInfo }) {
    const classes = useStyles();
    // const [value,setValue] = React.useState(fieldInfo.value)
    const [valueLabel, setValueLabel] = React.useState(fieldInfo.valueLabel);
    // const [showMenu, setShowMenu] = React.useState(false)
    const [menuItems, setMenuItems] = React.useState([]);
    // const menuAnchor = useRef(null);
    const autoSuggestInput = useRef(null);

    // useEffect(() => {
    //   if (showMenu) {
    //     setTimeout(function() {
    //       autoSuggestInput.current.focus(); // This is be executed when the state changes
    //     }, 1000);
    //   }
    // }, [showMenu]);

    const getMenuItem = (event) => {
        if (fieldInfo.ajaxCallback) {
            fieldInfo.ajaxCallback({
                search_term: event.target.value,
                callback: onGetMenuItemCallback
            });
        }
    };

    const onGetMenuItemCallback = (response_data) => {
        setMenuItems(response_data['data']['data']);
        // setShowMenu(true);
    };

    const handleChange = (event) => {
        setValueLabel(event.target.value);
        getMenuItem(event);
    };

    // const handleClose = () => {
    //   setShowMenu(false);
    // }

    // const handleMenuItemSelect = (selected_value, selected_value_label) => {
    //   setValueLabel(selected_value_label);
    //   setValue(selected_value);
    //   if (onChange) {
    //     onChange(selected_value);
    //   }
    // setShowMenu(false);
    // }

    return (
        <ThemeProvider theme={textCompTheme}>
            <TextField
                error={fieldInfo.error}
                multiline={fieldInfo.multiple}
                required={fieldInfo.required}
                id={fieldInfo.id + fieldInfo.name}
                name={fieldInfo.name}
                label={fieldInfo.label}
                defaultValue={valueLabel}
                helperText={fieldInfo.helperText}
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
                inputRef={autoSuggestInput}
                role="menu"
                size={fieldInfo.size}
            />
            {menuItems.length > 0 ? (
                <div className={fieldInfo.menuFixed ? classes.menuFixed : classes.menu}>
                    {_.map(menuItems, function (menu_item) {
                        return (
                            <div className={classes.menuItem}>
                                <fieldInfo.menuItem params={menu_item} />
                            </div>
                        );
                    })}
                </div>
            ) : (
                ''
            )}
            {/* <Menu className={classes.menu}
          id="autosuggest-menu"
          anchorEl={menuAnchor.current}
          keepMounted
          open={showMenu}
          onClose={handleClose}
          variant={"menu"}
          disableAutoFocusItem={true}
          autoFocus={false}
        >
          {_.map(menuItems, function(menu_item) {
            return (
              <MenuItem>
                {<fieldInfo.menuItem params={menu_item} />}
              </MenuItem>
            );
          })}
        </Menu> */}
        </ThemeProvider>
    );
}
