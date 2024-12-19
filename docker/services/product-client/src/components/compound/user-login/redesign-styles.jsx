const userLoginStyles = (theme) => ({
    container: {
        position: 'relative',
        background: 'transparent',
        padding: theme.spacing(5) + ' ' + theme.spacing(10),
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(40),
        justifyContent: 'center',
        '& svg': {
            fill: 'rgba(255, 138, 138, 1)',
            height: '2.9rem',
            display: 'flex',
            alignItems: 'center',
            width: '2rem'
        },
        '& img': {
            height: '40px',
            width: '135px',
            alignSelf: 'center'
        },
        '& .MuiButton-root': {
            width: theme.spacing(20),
            alignSelf: 'center',
            textTransform: 'capitalize',
            '& .MuiButton-label': {
                fontSize: theme.spacing(2),
                [theme.breakpoints.down('sm')]: {
                    fontSize: '1.8rem'
                },
                [theme.breakpoints.down('xs')]: {
                    fontSize: '2.2rem'
                }
            }
        },
        [theme.breakpoints.down('sm')]: {
            padding: '3rem 5rem'
        }
    },
    seperator: {
        color: theme.palette.text.default,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing(1),
        fontSize: theme.title.h2.fontSize,
        fontFamily: theme.body.B1.fontFamily,
        letterSpacing: theme.title.h3.letterSpacing,
        '&::before': {
            content: '""',
            flex: '1',
            borderBottom: `2px solid ${theme.palette.border.loginSeprator}`
        },
        '&::after': {
            content: '""',
            flex: '1',
            borderBottom: `2px solid ${theme.palette.border.loginSeprator}`
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '2.2rem'
        }
    },
    logo: {
        '& svg': {
            width: '100%'
        }
    },
    errortext: {
        color: 'white',
        background: '#FB5B66',
        fontSize: '1.25rem',
        marginBottom: '0.8rem',
        padding: '4px 8px',
        borderRadius: '2px',
        width: 'max-content',
        margin: 'auto'
    }
});

export default userLoginStyles;
