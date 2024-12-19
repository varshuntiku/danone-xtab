import { alpha } from '@material-ui/core';

const sideDrawerStyle = (theme) => ({
    sideDrawer: {
        width: theme.spacing(30),
        flexShrink: 0,
        boxSizing: 'border-box'
    },
    sideDrawerPaper: {
        width: theme.spacing(30),
        boxSizing: 'border-box',
        borderRight: '1px solid ' + alpha(theme.palette.border.dashboard, 0.4)
        // borderRight: '1px solid ' + alpha(theme.palette.border.dashboard, 0.4)
    },
    codxLogo: {
        height: theme.spacing(4),
        fill: theme.palette.primary.contrastText + ' !important'
    },
    logoContainer: {
        position: 'relative',
        minHeight: '6.4rem',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        '&:after': {
            content: '" "',
            position: 'absolute',
            width: 'calc(100% - 0.5rem)',
            height: 0,
            bottom: 0,
            left: 0,
            borderBottom: '1px solid ' + alpha(theme.palette.border.dashboard, 0.4)
        }
    },
    listLink: {
        maxWidth: '100%',
        padding: theme.spacing(4.5, 0.625),
        paddingBottom: theme.spacing(0),
        '& a': {
            color: theme.palette.text.default,
            padding: theme.spacing(1.5, 2.5),
            margin: theme.spacing(0.5, 0),
            borderRadius: theme.spacing(0.5),
            '&.active': {
                color: theme.palette.primary.contrastText,
                background: theme.palette.background.modelsViewLight
            }
        }
    },
    sideDrawerText: {
        fontSize: theme.spacing(2),
        lineHeight: '3rem',
        position: 'relative',
        color: theme.palette.text.default,
        letterSpacing: theme.body.B5.letterSpacing
    }
});

export default sideDrawerStyle;
