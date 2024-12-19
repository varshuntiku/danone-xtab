import { alpha } from '@material-ui/core';

const supportedModelsStyle = (theme) => ({
    container: {
        background: theme.palette.primary.dark,
        padding: theme.spacing(2),
        position: 'relative',
        marginRight: theme.spacing(1.3),
        '& + div': {
            paddingTop: 0,
            overflow: 'scroll'
            // maxHeight: '100%'
        },
        '&:after': {
            content: '" "',
            position: 'absolute',
            height: 0,
            width: 'calc(100% - 0.5rem)',
            right: 0,
            bottom: 0,
            borderBottom: '1px solid ' + theme.palette.separator.grey
        }
    },
    tabContainer: {
        background: theme.palette.primary.dark,
        borderRadius: theme.spacing(1),
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
            // background: alpha(theme.palette.primary.light, 0.5),
            borderBottom: `2px solid ${theme.palette.primary.contrastText}`,
            color: theme.palette.primary.contrastText
            // fontWeight: '500',
        }
    },
    activeTab: {
        borderBottom: `2px solid ${theme.palette.primary.contrastText}`,
        // background: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
        fontWeight: '500'
    }
});

export default supportedModelsStyle;
