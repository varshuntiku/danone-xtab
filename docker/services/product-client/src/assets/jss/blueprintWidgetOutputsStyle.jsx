const blueprintWidgetOutputsStyle = (theme) => ({
    paper: {
        background: theme.palette.primary.main
    },

    createNewButton: {
        float: 'right',
        margin: theme.spacing(2, 2),
        '& svg': {
            fill: theme.palette.primary.contrastText + ' !important'
        }
    },
    heading: {
        color: theme.palette.text.titleText,
        fontSize: '2.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8
    },
    actionIcon: {
        position: 'absolute',
        top: '4px',
        right: 0
    },
    widgetOutputBody: {
        height: theme.spacing(75)
    },
    tabContainer: {
        padding: theme.spacing(0.5)
    },
    tabOutputText: {
        color: theme.palette.text.default
    },
    subHeading: {
        color: theme.palette.text.titleText,
        fontSize: '1.75rem',
        letterSpacing: '0.1em',
        opacity: 0.8
    }
});

export default blueprintWidgetOutputsStyle;
