import { alpha } from '@material-ui/core';

const taskStyle = (theme) => ({
    container: {
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(5),
        minHeight: '100vh'
    },
    top: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: theme.spacing(5)
    },
    searchIcon: {
        fontSize: theme.spacing(4),
        color: theme.palette.primary.contrastText
    },
    inputText: {
        fontSize: theme.spacing(2),
        color: theme.palette.text.default
    },
    input: {
        border: '1px solid ' + theme.palette.primary.light,
        '& .MuiOutlinedInput-input': {
            padding: theme.spacing(2.5, 1.3)
        },
        '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
            border: '1px solid ' + theme.palette.primary.contrastText
        }
    },
    text: {
        color: theme.palette.text.default,
        fontFamily: 'Graphik Compact',
        fontWeight: 400,
        fontSize: theme.spacing(2.4),
        letterSpacing: '1px',
        lineHeight: 'normal'
    },
    bottom: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2)
    },
    list: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(3)
    },
    eachTask: {
        fontSize: theme.spacing(2),
        maxWidth: 'fit-content',
        color: theme.palette.primary.contrastText,
        background: theme.palette.background.modelsViewLight,
        padding: theme.spacing(1.5, 2.5),
        margin: theme.spacing(0.5, 0),
        borderRadius: theme.spacing(0.5),
        border: '1.2px solid transparent',
        fontWeight: 410,
        cursor: 'pointer',
        fontFamily: 'Graphik compact',
        letterSpacing: '0.5px'
    },
    focus: {
        background: 'transparent',
        border: '1.2px solid ' + theme.palette.primary.contrastText
    },
    blur: {
        color: alpha(theme.palette.primary.contrastText, 0.4)
    }
});

export default taskStyle;
