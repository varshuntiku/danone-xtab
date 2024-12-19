const loginFormStyle = (theme) => ({
    container: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        gap: theme.spacing(5)
    },
    linkContainer: {
        width: '100%'
    },
    forgotText: {
        float: 'right',
        color: theme.palette.text.titleText,
        paddingTop: theme.spacing(0.5),
        [theme.breakpoints.down('sm')]: {
            fontSize: '1.8rem'
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '2.2rem'
        }
    },
    errortext: {
        color: theme.palette.error.main,
        fontSize: '1.25rem',
        marginBottom: theme.spacing(1)
    },
    ssoButton: {
        borderRadius: 0,
        fontSize: theme.spacing(2.5),
        fontWeight: 900,
        width: '100% !important',
        background: (props) => (props.isDark ? '#292536' : theme.palette.grey[300]),
        color: theme.palette.primary.contrastText,
        '&:hover': {
            background: (props) => (props.isDark ? '#292536' : theme.palette.grey[300]),
            color: theme.palette.primary.contrastText
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
    }
});

export default loginFormStyle;
