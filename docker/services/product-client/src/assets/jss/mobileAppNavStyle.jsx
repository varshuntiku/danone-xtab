import { alpha } from '@material-ui/core';

const mobileAppNavStyle = (theme) => ({
    appNavBar: {
        boxShadow: 'none',
        borderBottom: '1px solid ' + alpha(theme.palette.border.dashboard, 0.4),
        backgroundColor: theme.palette.primary.dark,
        '& .MuiToolbar-root': {
            justifyContent: 'flex-start'
        },
        gridGap: '1.5rem'
    },
    appNavBarTitle: {
        color: theme.palette.text.titleText,
        fontWeight: 300,
        letterSpacing: '0.1rem',
        paddingLeft: '1rem',
        [theme.breakpoints.up('xs')]: {
            fontSize: '4rem',
            lineHeight: theme.spacing(6.25)
        },
        [theme.breakpoints.up('sm')]: {
            fontSize: '3rem',
            lineHeight: theme.spacing(6.25)
        },
        [theme.breakpoints.up('md')]: {
            fontSize: '2.8rem',
            lineHeight: theme.spacing(6.25)
        }
    },
    codxLogo: {
        width: '12.5rem',
        height: 'auto',
        margin: theme.spacing(1, 0),
        fill: theme.palette.primary.contrastText + ' !important'
    }
});

export default mobileAppNavStyle;
