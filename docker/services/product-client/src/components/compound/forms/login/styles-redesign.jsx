const loginFormStyle = (theme) => ({
    container: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        gap: theme.spacing(5)
    },
    linkContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    forgotText: {
        float: 'right',
        color: theme.palette.text.default,
        fontSize: theme.button.BU1.fontSize,
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontWeight: theme.title.h6.fontWeight,
        paddingTop: theme.spacing(0.5),
        [theme.breakpoints.down('sm')]: {
            fontSize: '1.8rem'
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '2.2rem'
        }
    },
    rememberLabel: {
        '& .MuiFormControlLabel-label': {
            float: 'right',
            color: theme.palette.text.default,
            fontSize: theme.button.BU1.fontSize,
            fontFamily: theme.title.h1.fontFamily,
            letterSpacing: theme.title.h1.letterSpacing,
            fontWeight: theme.title.h6.fontWeight,
            paddingTop: theme.spacing(0.5),
            opacity: 0.8,
            [theme.breakpoints.down('sm')]: {
                fontSize: '1.8rem'
            },
            [theme.breakpoints.down('xs')]: {
                fontSize: '2.2rem'
            }
        }
    },
    rememberTextContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    ssoButton: {
        fontSize: theme.title.h2.fontSize,
        fontWeight: theme.title.h6.fontWeight,
        width: '100% !important',
        letterSpacing: '1.5px',
        borderRadius: '2px',
        border: `2px solid ${theme.palette.border.ssoBtnBorder}`,
        background:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? 'linear-gradient(90deg, rgba(255, 240, 238, 0.36) -92.44%, rgba(255, 240, 238, 0.00) 120.58%)'
                : 'linear-gradient(90deg, #FFF -92.44%, rgba(255, 255, 255, 0.00) 120.58%)',
        boxShadow:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? 'none'
                : `1px 1px 4px 0px ${theme.palette.shadow.ssoButton}`,
        backdropFilter: 'blur(2px)',
        color: theme.palette.text.revamp,
        '&:hover': {
            background:
                localStorage.getItem('codx-products-theme') === 'dark'
                    ? 'linear-gradient(90deg, rgba(255, 240, 238, 0.36) -92.44%, rgba(255, 240, 238, 0.00) 120.58%)'
                    : theme.palette.background.pureWhite,
            color: theme.palette.text.revamp
        },
        '& .MuiButton-label': {
            fontSize: '1.5rem',
            [theme.breakpoints.down('sm')]: {
                fontSize: '1.8rem'
            },
            [theme.breakpoints.down('xs')]: {
                fontSize: '2.2rem'
            }
        }
    },
    checkboxIcon: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingRight: 0,
        fill: `${theme.palette.text.default} !important`,
        '& svg': {
            fill: `${theme.palette.text.default} !important`,
            height: '2rem'
        }
    }
});

export default loginFormStyle;
