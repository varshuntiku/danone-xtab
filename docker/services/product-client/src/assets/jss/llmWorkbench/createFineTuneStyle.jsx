import { alpha } from '@material-ui/core';

export const createFineTuneStyle = (theme) => ({
    text: {
        textTransform: 'none!important',
        // fontWeight: '400!important',
        color: theme.palette.primary.contrastText,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        fontSize: '1.5rem'
    },
    title: {
        fontWeight: '600!important'
    },
    info: {
        fontWeight: '400!important'
    },
    textField: {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: theme.palette.border.grey
            },
            '&:hover fieldset': {
                borderColor: theme.palette.text.revamp
            },
            '&.Mui-focused fieldset': {
                border: `1px solid ${theme.palette.border.inputOnFoucs}`
            },
            '&.Mui-disabled fieldset': {
                borderColor: alpha(theme.palette.text.revamp, 0.4)
            },
            '&.Mui-error fieldset': {
                borderColor: theme.palette.text.error,
                opacity: '1 !important'
            }
        },
        '& .MuiSelect-icon': {
            color: theme.palette.primary.contrastText,
            fontSize: theme.spacing(3),
            top: 'auto'
        },
        '& input': {
            color: theme.palette.text.default,
            fontSize: '1.6rem',
            padding: theme.spacing(1.5),
            [theme.breakpoints.down(theme.breakpoints.values.desktop_sm)]: {
                fontSize: '1.3rem'
            }
        }
    },
    thumb: {
        transition: 'scale 0.2s ease 0s;',
        '&.MuiSlider-thumb:hover': {
            scale: 1.25
        },
        '& .MuiSlider-valueLabel': {
            display: 'none',
            top: '-2rem',
            transition: 'all 0.2s ease 0s;',
            '& *': {
                transition: 'all 0.2s ease 0s;',
                background: 'transparent',
                color: theme.palette.primary.contrastText,
                fontSize: '1.2rem',
                fontWeight: '600'
            }
        },
        '&:hover': {
            '& .MuiSlider-valueLabel': {
                display: 'none',
                top: '-34px',
                scale: 0.8,
                '& *': {
                    background: theme.palette.text.default,
                    color: theme.palette.primary.dark,
                    fontSize: '1.2rem',
                    fontWeight: '600'
                }
            }
        }
    },
    markLabel: {
        fontSize: '1.2rem',
        color: theme.palette.text.default
    },
    simulatorSliderInput: {
        margin: theme.spacing(0.35, 0),
        color: theme.palette.text.default,
        '& .MuiSlider-rail': {
            backgroundColor: theme.palette.border.dashboard
        }
    },
    input: {
        color: theme.palette.primary.contrastText,
        lineHeight: theme.spacing(2),
        border: '1px soild #0000',
        fontSize: '1.6rem',
        padding: theme.spacing(1.5),
        [theme.breakpoints.down(theme.breakpoints.values.desktop_sm)]: {
            fontSize: '1.3rem'
        },
        '& .time': {
            display: 'none'
        }
    },
    error: {
        opacity: '1 !important',
        color: theme.palette.text.error,
        fontSize: theme.spacing(1.6)
    },
    paper: { background: theme.palette.background.paper },
    advanced: {
        cursor: 'pointer',
        fontSize: theme.spacing(2),
        color: theme.palette.text.contrastText,
        textTransform: 'unset',
        display: 'flex',
        gap: theme.spacing(1.5),
        alignItems: 'center',
        fontWeight: 'bold!important',
        '& svg': {
            width: '18px !important',
            height: '20px !important'
        }
    },
    tooltip: {
        textTransform: 'none!important'
    },
    required: {
        color: theme.palette.text.error
    },
    radioGroup: {
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing(2)
    },
    code: {
        border: `1px dashed ${theme.palette.border.dashboard}`,
        padding: theme.spacing(2),
        fontSize: theme.spacing(1.8),
        lineHeight: theme.spacing(3),
        color: theme.palette.primary.contrastText,
        maxHeight: '54vh',
        overflow: 'scroll'
    },
    indent: {
        paddingLeft: theme.spacing(3)
    },
    menuItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: theme.spacing(1.5),
        minHeight: 'auto',
        '& .time': {
            color: alpha(theme.palette.border.dashboard, 0.8)
        }
    },
    container: {
        '& div': {
            boxShadow: 'none'
        }
    },
    gputext: {
        gap: theme.spacing(1),
        display: 'flex',
        alignItems: 'center'
    },
    secTitle: {
        fontSize: '1.5rem',
        letterSpacing: '0.35px',
        fontWeight: 500
    },
    secInfo: {
        fontSize: '1.4rem',
        letterSpacing: '0.28px',
        fontWeight: 400
    },
    stpperTitle: {
        fontWeight: 500,
        fontSize: '1.8rem'
    }
});
