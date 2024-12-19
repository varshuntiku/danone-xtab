import { alpha } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

const appAdminStyle = (theme) => ({
    appAdminContainer: {
        padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(24)}`,
        height: 'calc(100%)',
        overflowY: 'auto'
    },
    createEnvContent: {
        flexGrow: 1,
        position: 'relative',
        height: '100%',
        color: theme.palette.text.default
    },
    createEnvCopyDropdown: {
        width: theme.spacing(30)
    },
    screensGridContainer: {
        height: 'calc(100% - ' + theme.spacing(1) + ')'
    },
    screensContainer: {
        height: '100%',
        transitionDuration: '300ms',
        overflowX: 'hidden',
        width: '25%',
        position: 'relative',
        overflowY: 'hidden'
    },
    customFormSectionHeaderLeft: {
        color: theme.palette.text.default
    },
    hideScreenContainer: {
        width: '0',
        opacity: 0
    },
    screensContentContainer: {
        height: '100%',
        position: 'relative',
        borderLeft: '1px solid ' + theme.palette.separator.grey
    },
    dswAppScreensContentContainer: {
        height: 'auto !important',
        position: 'relative',
        borderLeft: '1px solid ' + theme.palette.separator.grey
    },
    drawerHandle: {
        position: 'absolute',
        top: '2rem',
        left: 0,
        transform: 'translate(-50%, 0)',
        zIndex: 1,
        border: `1px solid ${alpha(theme.palette.text.contrastText, 0.4)}`,
        boxShadow: `0px 0px 2px 1px ${alpha(theme.palette.text.black, 0.2)}`,
        backdropFilter: 'blur(10rem)'
    },
    flash: {
        animation: '$flash 1s ease',
        animationDelay: '300ms'
    },
    '@keyframes flash': {
        '50%': {
            backgroundColor: alpha(theme.palette.primary.light, 0.7)
        },
        '100%': {
            backgroundColor: 'unset'
        }
    },
    emptyStateContainer: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyItem: 'center'
    },
    emptyStateIcon: {
        color: alpha(theme.palette.text.default, 0.4),
        fontSize: '10rem'
    },
    emptyStateH1: {
        color: alpha(theme.palette.text.default, 0.7),
        fontSize: '2.4rem'
    },
    emptyStateH2: {
        color: alpha(theme.palette.text.default, 0.5),
        fontSize: '1.5rem'
    }
});

export default appAdminStyle;
