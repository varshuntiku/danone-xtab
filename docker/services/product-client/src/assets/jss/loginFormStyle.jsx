import { alpha } from '@material-ui/core';

const loginFormStyle = (theme) => ({
    container: {
        paddingTop: theme.spacing(3),
        position: 'relative',
        height: '100%'
    },
    loginButtonSSO: {
        marginTop: theme.spacing(2),
        borderRadius: 25,
        fontSize: theme.spacing(2.5),
        fontWeight: 500
    },
    loginButtonEmail: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(2),
        borderRadius: 25,
        fontSize: theme.spacing(2.5),
        fontWeight: 500
    },
    margin: {
        margin: theme.spacing(1)
    },
    textField: {
        flexBasis: 200,
        marginBottom: theme.spacing(2.5)
    },
    mailtext: {
        color: alpha(theme.palette.text.default, 0.8),
        fontSize: '1.7rem'
    },
    contrast: {
        color: theme.palette.text.default
    },
    forgotText: {
        float: 'right',
        color: theme.palette.primary.contrastText,
        paddingTop: theme.spacing(0.5),
        paddingRight: theme.spacing(1)
    },
    errortext: {
        color: theme.palette.error.main,
        fontSize: '1.25rem'
    },
    underline: {
        '&:before': {
            borderBottom: `1px solid ${alpha(theme.palette.primary.contrastText, 0.4)}`
        },
        '&:after': {
            borderBottom: `2px solid ${theme.palette.primary.contrastText}`
        }
    },
    input: {
        fontSize: '1.7rem',
        color: alpha(theme.palette.text.default, 0.6)
    }
});

export default loginFormStyle;
