import { alpha } from '@material-ui/core';

const deployedLLMStyle = (theme) => ({
    container: {
        color: theme.palette.text.default,
        height: '100%',
        width: '100%',
        overflowY: 'scroll',
        '& .delete-icon': { color: '#E13655' },
        '& .archive-icon': { color: theme.palette.text.default }
    },
    Padding: {
        padding: '2.5rem'
    },
    noTopPadding: {
        paddingTop: 0
    },
    titleText: {
        fontWeight: 500,
        paddingLeft: '2.32rem',
        paddingTop: '2.32rem',
        color: theme.palette.text.titleText,
        fontSize: '2.2rem',
        letterSpacing: theme.title.h1.letterSpacing,
        lineHeight: theme.spacing(4),
        fontFamily: theme.title.h1.fontFamily,
        textTransform: 'none !important'
    },
    tabContainer: {
        background: theme.palette.primary.dark,
        borderRadius: theme.spacing(1),
        marginTop: theme.spacing(4),
        paddingLeft: theme.spacing(3),
        boxSizing: 'border-box',
        display: 'flex',
        color: theme.palette.text.default
    },
    tab: {
        borderRadius: theme.spacing(1) + ' ' + theme.spacing(1) + ' 0 0',
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(4),
        fontSize: theme.spacing(2.4),
        paddingBottom: theme.spacing(1),
        fontFamily: 'Graphik Compact',
        cursor: 'pointer',
        transition: '0.5s',
        borderBottom: `1px solid ${theme.palette.text.default}`,
        '&:hover': {
            background: alpha(theme.palette.primary.light, 0.5),
            borderBottom: `2px solid ${theme.palette.primary.contrastText}`,
            color: theme.palette.primary.contrastText
        }
    },
    activeTab: {
        borderBottom: `2px solid ${theme.palette.primary.contrastText}`,
        // background: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
        fontWeight: '500'
    }
});

export default deployedLLMStyle;
