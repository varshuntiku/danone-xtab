import { alpha } from '@material-ui/core';

const forgotPasswordFormStyle = (theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.primary.dark
    },
    formHeader: {
        background: theme.palette.primary.dark,
        borderBottom: `1px solid ${theme.palette.primary.contrastText}`,
        color: theme.palette.text.default,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        paddingRight: theme.spacing(3),
        paddingLeft: theme.spacing(3)
    },
    formBody: {
        color: theme.palette.text.default,
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        paddingRight: theme.spacing(3),
        paddingLeft: theme.spacing(3)
    },
    message: {
        marginBottom: theme.spacing(4),
        color: alpha(theme.palette.text.default, 0.6)
    },
    errorText: {
        color: theme.palette.error.main,
        fontSize: '1.25rem'
    },
    actionButton: {
        marginTop: theme.spacing(2),
        borderRadius: theme.spacing(0.5),
        fontSize: theme.spacing(2.5),
        fontWeight: 500
    },
    underline: {
        '&:before': {
            borderBottom: `1px solid ${alpha(theme.palette.textColor, 0.4)}`
        },
        '&:after': {
            borderBottom: `2px solid ${theme.palette.textColor}`
        }
    },
    input: {
        fontSize: '1.7rem',
        color: alpha(theme.palette.text.default, 0.6),
        background: theme.palette.background.input && theme.palette.background.input,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1)
    },
    center: {
        textAlign: 'center'
    },
    otpContainer: {
        display: 'flex',
        gap: theme.spacing(1)
    },
    link: {
        color: theme.palette.primary.contrastText,
        cursor: 'pointer'
    },
    disabledLink: {
        pointerEvents: 'none',
        cursor: 'not-allowed',
        color: alpha(theme.palette.text.default, 0.6)
    },
    attemptContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    }
});

export default forgotPasswordFormStyle;
