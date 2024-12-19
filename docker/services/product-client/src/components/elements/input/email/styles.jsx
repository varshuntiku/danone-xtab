const emailStyles = (theme) => ({
    underline: {
        '&:before': {
            borderBottom: `1px solid ${theme.palette.border.LoginInpBorder}30`
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
    icon: {
        marginRight: theme.layoutSpacing(10),
        marginBottom: theme.layoutSpacing(3.5)
    },
    toolTipStyle: {
        backgroundColor: '#FB5B66',
        position: 'relative',
        top: theme.layoutSpacing(8.7),
        left: theme.layoutSpacing(4.5),
        ZIndex: 10,
        color: '#ffffff',
        height: 'fit-content',
        textAlign: 'start',
        fontSize: theme.layoutSpacing(13),
        padding: `${theme.layoutSpacing(4)} ${theme.layoutSpacing(8)}`,
        fontFamily: theme.body.B5.fontFamily,
        border: '1px solid #FB5B66',
        borderRadius: theme.layoutSpacing(1)
    },
    arrowStyle: {
        '&:before': {
            backgroundColor: '#FB5B66'
        }
    }
});

export default emailStyles;
