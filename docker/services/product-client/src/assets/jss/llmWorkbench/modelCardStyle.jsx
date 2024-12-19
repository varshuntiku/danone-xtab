import { alpha } from '@material-ui/core';

const modelCardStyle = (theme) => ({
    container: {
        position: 'relative'
    },
    name: {
        color: theme.palette.text.default,
        fontWeight: 500,
        fontSize: theme.spacing(2),
        fontFamily: 'Graphik Compact',
        letterSpacing: '1px'
    },
    text: {
        color: alpha(theme.palette.text.default, 0.4),
        fontSize: theme.spacing(2),
        maxWidth: 'fit-content',
        fontFamily: 'Graphik Compact',
        letterSpacing: '0.5px'
    },
    heading: {
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing(2),
        alignItems: 'center'
    },
    listStyle: {
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: theme.spacing(2),
        gap: theme.spacing(4)
    },
    logo: {
        width: '2rem',
        height: '2rem',
        borderRadius: '50%',
        background: 'white',
        color: theme.palette.primary.contrastText
    },

    box: {
        position: 'absolute',
        background: theme.palette.separator.grey
    },
    icon: {
        color: theme.palette.primary.contrastText,
        paddingRight: '2px'
    },
    top: {
        width: '96%',
        height: '0.5px',
        top: 0,
        left: '2%'
    },
    bottom: {
        width: '96%',
        height: '0.5px',
        bottom: 0,
        left: '2%'
    },
    left: {
        width: '0.5px',
        height: '88%',
        left: 0,
        top: '8%'
    },
    right: {
        width: '0.5px',
        height: '88%',
        right: 0,
        top: '8%'
    }
});

export default modelCardStyle;
