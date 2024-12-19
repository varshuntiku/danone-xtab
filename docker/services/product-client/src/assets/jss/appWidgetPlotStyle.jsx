import { darken, lighten } from '@material-ui/core';

const appWidgetPlotStyle = (theme) => ({
    graphPlot: {
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'block !important'
    },
    popoverPaper: {
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: 'max-content',
        overflow: 'visible',
        background: theme.palette.background.dialogBody,
        backdropFilter: 'blur(2rem)',
        minWidth: '20rem',
        minHeight: '12rem'
    },
    closeButton: {
        position: 'absolute',
        top: '0.5rem',
        right: '0',
        '& svg': {
            color: theme.palette.text.default
        }
    },
    arrow: {
        width: 0,
        height: 0,
        borderLeft: '7px solid transparent',
        borderRight: `7px solid transparent`,
        borderBottom: `7px solid ${
            theme.props.mode == 'dark'
                ? lighten(theme.palette.primary.light, 0.1)
                : darken(theme.palette.primary.light, 0.1)
        }`,
        backdropFilter: 'blur(2rem)',
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: `translate(-50%, -7px)`
    },
    dropdownWrapper: {
        position: 'absolute',
        top: 0,
        right: 0,
        minWidth: '20rem'
    },
    dialogClose: {
        position: 'absolute',
        top: 0,
        right: 0
    }
});

export default appWidgetPlotStyle;
