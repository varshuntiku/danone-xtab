import codxLoginBkgd from '../img/login-bg.png';

const loginStyle = (theme) => ({
    bodyContainer: {
        height: '100%',
        position: 'relative'
    },
    body: {
        height: '100%',
        backgroundImage: `url(${codxLoginBkgd})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed'
    },
    emptyCustomerLogo: {
        width: theme.spacing(20)
    },
    logo: {
        width: theme.spacing(20)
    },
    customerLogoBig: {
        width: theme.spacing(50)
    },
    container: {
        padding: theme.spacing(8, 8, 0, 8),
        marginBottom: theme.spacing(5),
        height: 'calc(100% - ' + theme.spacing(5) + ')',
        minWidth: '100%',
        minHeight: '100%'
    },
    text: {
        color: theme.palette.text.white,
        fontStyle: 'normal',
        fontWeight: '700',
        paddingTop: theme.spacing(12),
        fontSize: '4.5rem',
        position: 'relative',
        display: 'flex'
    },

    serviceName: {
        color: 'orange',
        margin: '0',
        paddingLeft: theme.spacing(1.25),
        listStyleType: 'none',
        animation: 'animate 10s infinite'
    },
    animationWrapper: {
        height: theme.spacing(6.5),
        overflow: 'hidden'
    },
    loginBody: {
        border: '1px solid ' + theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.dark,
        borderRadius: theme.spacing(1),
        padding: theme.spacing(5),
        height: 'calc(100% - ' + theme.spacing(5) + ')',
        '& svg': {
            fill: theme.palette.primary.contrastText,
            height: theme.spacing(4)
        }
    },
    authLoadingText: {
        padding: theme.spacing(2),
        color: theme.palette.text.default,
        fontSize: '1.5rem'
    }
});

export default loginStyle;
