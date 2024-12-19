import React from 'react';
import { Switch, Typography, ThemeProvider, createTheme, Box, makeStyles } from '@material-ui/core';

const pxToRem = (px, oneRemPx = 16) => `${px / oneRemPx}rem`;

const switchTheme = (th) =>
    createTheme({
        overrides: {
            MuiSwitch: {
                root: {
                    width: '3.8rem',
                    height: '1.7rem',
                    padding: 0,
                    margin: th.spacing(1)
                },
                switchBase: {
                    top: '0.08rem',
                    left: '0.4rem',
                    padding: '0rem',
                    color: '#E5E5E5',
                    '&$checked': {
                        top: '0.1rem',
                        left: '-0.1rem',
                        right: '19px'
                    }
                },
                track: {
                    backgroundColor: th.palette.primary.dark,
                    borderRadius: pxToRem(40 / 2),
                    border: `1px solid #E5E5E5`,
                    opacity: 1,
                    transition: th.transitions.create(['background-color', 'border']),
                    '$checked$checked + &': {
                        opacity: 1,
                        backgroundColor: th.palette.primary.contrastText,
                        border: `1px solid ${th.palette.primary.contrastText}`
                    }
                },
                thumb: {
                    width: `1.45rem`,
                    height: `1.45rem`,
                    boxSizing: 'border-box'
                }
            },
            MuiTypography: {
                body1: {
                    fontSize: '1.1rem',
                    color: th.palette.primary.contrastText + ' !important',
                    backgroundColor: th.palette.primary.main
                }
            },
            MuiInputAdornment: {
                positionStart: {
                    marginRight: th.spacing(0)
                }
            }
        }
    });

export default function ToggleSwitch({
    elementProps,
    classes,
    onChange,
    'data-testid': dataTestId
}) {
    const colorProps = classes?.toggleClasses;
    const useStyles = makeStyles((th) => {
        return {
            root: {
                width: '3.8rem',
                height: '1.7rem',
                padding: 0,
                margin: th.spacing(1)
            },
            switchBase: {
                top: '0.08rem',
                left: '0.4rem',
                padding: '0rem',
                color: colorProps?.baseColor || '#E5E5E5',
                '&$checked': {
                    color: colorProps?.checkedBaseColor || th.palette.primary.dark + ' !important',
                    top: '0.1rem',
                    left: '-0.1rem',
                    right: '19px'
                }
            },
            track: {
                backgroundColor: colorProps?.trackColor || th.palette.primary.dark,
                borderRadius: pxToRem(40 / 2),
                border: colorProps?.border || `1px solid #E5E5E5`,
                opacity: 1,
                transition: th.transitions.create(['background-color', 'border']),
                '$checked$checked + &': {
                    opacity: 1,
                    backgroundColor:
                        colorProps?.checkedTrackColor || th.palette.primary.contrastText,
                    border:
                        colorProps?.checkedBorder || `1px solid ${th.palette.primary.contrastText}`
                }
            },
            thumb: {
                width: `1.45rem`,
                height: `1.45rem`,
                boxSizing: 'border-box'
            },
            checked: {}
        };
    });
    const styleClass = useStyles();
    const [checked, setChecked] = React.useState(elementProps?.defaultValue ? true : false);
    const handleChange = (value) => {
        setChecked(value);
        const optionName = value ? elementProps?.labelRight : elementProps?.labelLeft;
        onChange(elementProps.id, value, optionName);
    };
    return (
        <ThemeProvider theme={switchTheme}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: elementProps?.margin
                }}
            >
                {elementProps?.labelLeft ? (
                    <Typography
                        style={classes.leftLabelStyle}
                        className={classes.toolBarText}
                        variant="caption"
                    >
                        {elementProps.labelLeft}
                    </Typography>
                ) : null}

                <Switch
                    checked={checked}
                    onChange={() => {
                        handleChange(!checked);
                    }}
                    classes={{
                        switchBase: styleClass.switchBase,
                        root: styleClass.root,
                        checked: styleClass.checked,
                        thumb: styleClass.thumb,
                        track: styleClass.track
                    }}
                    data-testid={dataTestId}
                />

                {elementProps?.labelRight ? (
                    <Typography
                        style={classes.rightLabelStyle}
                        className={classes.toolBarText}
                        variant="caption"
                    >
                        {elementProps.labelRight}
                    </Typography>
                ) : null}
            </Box>
        </ThemeProvider>
    );
}
