const appDashboardStyle = (theme) => ({
    body: {
        margin: theme.spacing(2),
        position: 'relative',
        height: 'calc(100% - ' + theme.spacing(8) + ')'
    },
    // gridBody: {
    //   width: '100%',
    // },
    screen: {
        height: '100%',
        width: '100%',
        position: 'relative'
    },
    screenContainer: {
        padding: theme.spacing(1.25),
        width: '100%',
        textAlign: 'center'
    },
    screenLink: {
        margin: theme.spacing(2),
        fontSize: '2rem'
    },
    screenTitle: {
        color: theme.palette.text.default
    },
    screenDescription: {
        fontStyle: 'italic',
        margin: theme.spacing(2),
        color: theme.palette.text.default,
        minHeight: theme.spacing(8),
        maxHeight: theme.spacing(8)
    },
    screenImageContainer: {
        marginBottom: theme.spacing(2)
    },
    screenImage: {
        maxHeight: theme.spacing(25),
        fill: theme.palette.primary.contrastText + ' !important',
        opacity: '0.5',
        '& path': {
            fill: theme.palette.primary.contrastText + ' !important'
        },
        '& g': {
            fill: theme.palette.primary.contrastText + ' !important'
        }
    }
});

export default appDashboardStyle;
