import { alpha } from '@material-ui/core';

const updatePasswordFormStyle = (theme) => ({
    formContainer: {
        height: '100%',
        '& svg': {
            // fill: theme.palette.primary.contrastText,
            height: theme.spacing(4)
        },
        overflow: 'hidden',
        backgroundColor: theme.palette.primary.dark
    },
    formTitle: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.textColor,
        width: '100%',
        padding: theme.spacing(2) + ' ' + theme.spacing(4),
        fontWeight: 300,
        borderBottom: `1px solid ${theme.palette.primary.contrastText}`
    },
    formBody: {
        padding: theme.spacing(4) + ' ' + theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
    },
    bodyTitle: {
        color: theme.palette.textColor
    },
    hideIcon: {
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    message: {
        color: alpha(theme.palette.text.default, 0.6)
    },
    input: {
        color: theme.palette.textColor,
        background: theme.palette.background.input && theme.palette.background.input,
        padding: theme.spacing(2),
        fontSize: '16px',
        borderRadius: '4px 4px 0px 0px'
    },
    underline: {
        '&:before': {
            borderBottom: `1px solid ${theme.palette.textColor}`
        },
        '&:after': {
            borderBottom: `2px solid ${theme.palette.textColor}`
        }
    },
    actionButton: {
        marginTop: theme.spacing(2),
        borderRadius: theme.spacing(0.5),
        fontSize: theme.spacing(2.5),
        fontWeight: 500
    }
});

export default updatePasswordFormStyle;
