import { alpha } from '@material-ui/core';

const configureModelStyle = (theme) => ({
    container: {
        height: '100%',
        padding: theme.spacing(3),
        paddingTop: theme.spacing(1.5)
    },
    wrapper: {
        background: theme.palette.primary.altDark,
        borderRadius: theme.spacing(0.625)
    },
    configure: {
        background: theme.palette.primary.light,
        borderRadius: '2px',
        border: `0.75px solid ${theme.palette.text.default}`
    },
    advancedConfig: {
        borderLeft: `1px solid ${theme.palette.text.default}`,
        paddingLeft: '2rem'
    },
    textField: {
        border: `1px solid ${theme.palette.text.default}`,
        '& fieldset': {
            display: 'none'
        },
        '& .MuiSelect-icon': {
            color: theme.palette.text.default,
            fontSize: theme.spacing(3),
            top: 'auto'
        }
    },
    thumb: {
        transition: 'scale 0.2s ease 0s;',
        '&.MuiSlider-thumb:hover': {
            scale: 1.25
        },
        '& .MuiSlider-valueLabel': {
            top: '-2rem',
            transition: 'all 0.2s ease 0s;',
            '& *': {
                transition: 'all 0.2s ease 0s;',
                background: 'transparent',
                color: theme.palette.text.default,
                fontSize: '1.2rem',
                fontWeight: '600'
            }
        },
        '&:hover': {
            '& .MuiSlider-valueLabel': {
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
            backgroundColor: theme.palette.background.simulatorRail
        }
    },
    input: {
        fontSize: theme.spacing(2),
        lineHeight: theme.spacing(2),
        color: theme.palette.text.default
    },
    error: {
        color: theme.palette.error.main,
        fontSize: theme.spacing(1.6)
    },
    formHeader: {
        color: theme.palette.text.contrastText,
        fontSize: theme.title.h1.fontSize,
        fontWeight: theme.title.h1.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing,
        lineHeight: theme.spacing(4),
        fontFamily: theme.title.h1.fontFamily,
        textTransform: theme.title.h1.textTransform
    },
    label: {
        fontFamily: 'Graphik Compact',
        color: theme.palette.text.default
    }
});

export default configureModelStyle;
