import { alpha } from '@material-ui/core';

const textFieldStyle = (theme) => ({
    label: {
        color: theme.palette.text.revamp,
        fontSize: theme.layoutSpacing(15),
        fontFamily: theme.body.B1.fontFamily,
        transform: `translateY(${theme.layoutSpacing(18)}) translateX(${theme.layoutSpacing(14)})`,
        letterSpacing: 0,
        lineHeight: 'normal',
        '&.MuiInputLabel-shrink': {
            transform: `translate(${theme.layoutSpacing(12)}, ${theme.layoutSpacing(4)}) scale(1)`,
            fontWeight: '500',
            fontSize: theme.layoutSpacing(13)
        },
        '&.Mui-error': {
            color: theme.palette.text.error
        },
        '&.Mui-disabled': {
            color: alpha(theme.palette.text.revamp, 0.6)
        }
    },
    root: {
        height: theme.layoutSpacing(56),
        margin: `${theme.layoutSpacing(4)} 0 ${theme.layoutSpacing(20)}`,
        '& label.Mui-focused': {
            color: theme.palette.background.infoBgDark
        },
        '& label.Mui-disabled': {
            color: alpha(theme.palette.text.revamp, 0.6)
        },
        '& svg': {
            color: theme.palette.border.inputOnFoucs,
            width: theme.layoutSpacing(24),
            height: theme.layoutSpacing(24)
        },
        '& .MuiFormHelperText-root': {
            fontSize: theme.layoutSpacing(13),
            color: theme.palette.text.error
        },
        '& .MuiFilledInput-multiline': {
            height: theme.layoutSpacing(116),
            padding: `${theme.layoutSpacing(29)} ${theme.layoutSpacing(2)} ${theme.layoutSpacing(
                8
            )} ${theme.layoutSpacing(12)}`,
            '& textarea': {
                padding: 0,
                fontSize: theme.layoutSpacing(15),
                fontFamily: theme.body.B5.fontFamily,
                color: theme.palette.text.revamp,
                lineHeight: theme.layoutSpacing(19.95),
                letterSpacing: theme.layoutSpacing(0.5)
            }
        },
        '& .MuiFilledInput-underline.Mui-focused:after': {
            borderBottomColor: theme.palette.border.inputOnFoucs,
            borderWidth: '1px'
        },
        '& .MuiFilledInput-underline.Mui-focused svg': {
            color: theme.palette.border.inputOnFoucs
        }
    },
    input: {
        fontSize: theme.layoutSpacing(16),
        fontFamily: theme.body.B5.fontFamily,
        color: theme.palette.text.revamp,
        padding: `${theme.layoutSpacing(25)} ${theme.layoutSpacing(12)} ${theme.layoutSpacing(8)}`,
        letterSpacing: theme.layoutSpacing(0.5)
    },
    formControl: {
        height: theme.layoutSpacing(56),
        marginTop: 0,
        '&.Mui-disabled': {
            background: theme.palette.background.tableSelcted,
            '&:hover': {
                background: theme.palette.background.tableSelcted
            },
            '&:before': {
                borderBottom: `1px solid ${alpha(theme.palette.text.revamp, 0.4)}`
            }
        },
        '&:before': {
            borderBottomColor: theme.palette.border.grey
        },
        background: `${theme.palette.background.tableSelcted}!important`,
        '&:hover': {
            background: theme.palette.background.tableSelcted,
            '&:before': {
                borderBottomColor: theme.palette.text.revamp
            }
        },
        '&:focus': {
            background: theme.palette.background.tableSelcted,
            '&:after': {
                borderBottomColor: theme.palette.background.infoBgDark
            }
        },
        '&.Mui-error:after': {
            borderBottomColor: theme.palette.text.error,
            borderWidth: '1px'
        },
        '&.Mui-error': {
            background: theme.palette.background.tableSelcted
        },
        '& .MuiSelect-select': {
            padding: `${theme.layoutSpacing(25)} ${theme.layoutSpacing(12)} ${theme.layoutSpacing(
                4
            )}`,
            '&:focus': {
                // background: theme.palette.background.tableSelcted
            }
        }
    },
    menu: {
        '& .MuiMenu-paper': {
            borderRadius: '2px'
        },
        '& ul': {
            padding: 0
        },
        '& li': {
            minHeight: theme.layoutSpacing(40),
            padding: `${theme.layoutSpacing(10)} ${theme.layoutSpacing(16)}`,
            margin: 0,
            fontSize: theme.layoutSpacing(15),
            color: theme.palette.text.revamp,
            letterSpacing: theme.layoutSpacing(0.5),
            '&:hover': {
                background: theme.palette.background.menuItemHover
            }
        },
        '& * .Mui-selected': {
            backgroundColor: alpha(theme.palette.background.menuItemFocus, 0.6)
        },
        ...theme.overrides.MuiCssBaseline
    },
    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1)
    },
    logoAvatar: {
        background: 'none',
        '& svg': {
            width: theme.spacing(3)
        },
        '& img': {
            width: theme.spacing(3),
            height: theme.spacing(3)
        },
        '& svg path': {
            fill: theme.palette.primary.contrastText + ' !important'
        },
        '& svg g': {
            fill: theme.palette.primary.contrastText + ' !important'
        }
    },
    customLeftLabel: {
        paddingRight: theme.layoutSpacing(24),
        display: 'flex',
        alignItems: 'center'
    },
    functionsColumnWrapper: {
        '& > div': {
            margin: 'unset',
            width: '100%'
        }
    },
    logoAvatarIndustry: {
        background: 'none',
        '& svg': {
            width: theme.spacing(3)
        },
        '& img': {
            width: theme.spacing(3),
            height: theme.spacing(3)
        }
    }
});

export default textFieldStyle;
