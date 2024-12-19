const passwordStyles = (theme) => ({
    icon: {
        padding: 0,
        '&:hover, &.Mui-focusVisible': {
            backgroundColor: 'transparent !important'
        },
        '& .MuiIconButton-label svg': {
            fill: theme.palette.text.titleText + ' !important'
        }
    },
    underline: {
        '&:before': {
            borderBottom: `2px solid ${theme.palette.border.LoginInpBorder}30`
        },
        '&:after': {
            borderBottom: `2px solid ${theme.palette.border.LoginInpBorder}30`
        },
        '&:hover:not(.Mui-disabled):before': {
            borderBottom: `2px solid ${theme.palette.border.LoginInpBorder}`
        }
    },
    input: {
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: '0.35px',
        fontSize: theme.title.h3.fontSize,
        color: theme.palette.text.default,
        padding: theme.spacing(1),
        [theme.breakpoints.down('sm')]: {
            fontSize: '2rem'
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '2.5rem'
        },
        '&:-webkit-autofill': {
            '-webkit-text-fill-color': theme.palette.text.default + ' !important',
            '-webkit-background-clip': 'text !important',
            backgroundClip: 'text !important'
        },
        '&,&::placeholder': {
            opacity: '1'
        }
    },
    label: {
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: '0.35px',
        fontSize: theme.title.h3.fontSize,
        color: theme.palette.text.default,
        marginLeft: theme.layoutSpacing(4.4)
    },
    errorUnderline: {
        '&:before': {
            borderBottom: `2px solid #FB5B66`
        },
        '&:after': {
            borderBottom: `2px solid #FB5B66`
        },
        '&:hover:not(.Mui-disabled):before': {
            borderBottom: `2px solid #FB5B66`
        }
    },
    toolTipStyle: {
        backgroundColor: '#FB5B66',
        position: 'relative',
        top: '10px',
        left: '5px',
        fontSize: theme.layoutSpacing(12),
        padding: theme.layoutSpacing(6),
        fontFamily: theme.body.B5.fontFamily
    },
    arrowStyle: {
        '&:before': {
            backgroundColor: '#FB5B66'
        }
    }
});

export default passwordStyles;
