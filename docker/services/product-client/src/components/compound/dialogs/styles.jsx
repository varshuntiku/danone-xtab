import { alpha } from '@material-ui/core';

const manageRoleDialogStyles = (theme) => ({
    paper: {
        background: theme.palette.background.modelBackground,
        backdropFilter: 'blur(2rem)',
        borderRadius: 0,
        border: 'none'
    },
    heading: {
        color: theme.palette.text.titleText,
        fontSize: '2.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8
    },
    checkBox: {
        '& .MuiSvgIcon-root': {
            fontSize: '1.6em'
        }
    },
    listItem: {
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.text.default
    },
    textField: {
        maxWidth: '50%',
        marginBottom: theme.spacing(2.5),
        marginTop: theme.spacing(2.5)
    },
    subHeading: {
        color: alpha(theme.palette.text.default, 0.8),
        fontSize: '2.4rem',
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(2)
    },
    margin: {
        margin: theme.spacing(1)
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
    },
    title: {
        margin: 0,
        background: theme.palette.background.modelBackground,
        padding: theme.layoutSpacing(20),
        '& .MuiTypography-h4': {
            color: theme.palette.text.titleText,
            fontSize: '2.5rem',
            letterSpacing: '0.1em',
            opacity: 0.8,
            fontFamily: theme.title.h1.fontFamily
        },
        display: 'flex',
        justifyContent: 'space-between'
    },
    dialogContent: {
        paddingLeft: theme.layoutSpacing(44),
        paddingRight: theme.layoutSpacing(44),
        paddingTop: theme.layoutSpacing(40),
        overflow: 'hidden'
    },
    dialogAction: {
        paddingBottom: theme.layoutSpacing(28),
        paddingTop: theme.layoutSpacing(48),
        paddingRight: theme.layoutSpacing(44)
    },
    sepratorLine: {
        border: `1px solid ${theme.palette.border.loginGrid}`,
        borderBottom: 'none',
        width: 'calc(100% - 32px)'
    },
    closeIcon: {
        position: 'absolute',
        top: theme.layoutSpacing(12),
        right: 0,
        '& svg': {
            fill: `${theme.palette.icons.closeIcon}!important`
        }
    },
    permissionLabel: {
        textTransform: 'capitalize'
    },
    loaderContainer: {
        padding: theme.spacing(20)
    }
});

export default manageRoleDialogStyles;
