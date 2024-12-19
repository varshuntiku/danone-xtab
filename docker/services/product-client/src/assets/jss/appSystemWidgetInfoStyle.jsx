const appSystemWidgetInfoStyle = (theme) => ({
    widgetInfoPaper: {
        background: theme.palette.background.pureWhite,
        height: theme.spacing(120),
        width: '60%'
    },
    widgetInfoHeading: {
        background: theme.palette.background.pureWhite,
        color: theme.palette.text.default,
        fontSize: '2.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8,
        fontWeight: 'bold'
    },
    widgetPreviewContainer: {
        paddingBottom: '2rem',
        paddingTop: '2rem'
    },
    widgetPreviewTxt: {
        fontSize: '2rem !important',
        marginBottom: '2rem !important',
        textAlign: 'center !important'
    },
    widgetInfoTitle: {
        background: theme.palette.background.pureWhite
    },
    widgetInfoActionIcon: {
        position: 'absolute',
        top: '4px',
        right: 0
    },
    widgetInfoContainer: {
        height: '100%',
        width: '100%',
        position: 'relative',
        padding: theme.spacing(0, 4),
        overflowY: 'auto'
    },
    widgetInfoContainerGrid: {},
    dsStoreWidgetWinContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    dsStoreWidgetWinFormCont: {
        display: 'flex',
        alignItems: 'center',
        width: '50%'
    },
    widgetInfoSubHeading: {
        color: theme.palette.text.titleText,
        fontSize: '1.75rem',
        letterSpacing: '0.1em',
        opacity: 0.8
    },
    widgetInfoText: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8
    },
    markdownWrapper: {
        background: theme.palette.background.dialogBody,
        height: '100%',
        width: '100%',
        overflowY: 'auto'
    }
});

export default appSystemWidgetInfoStyle;
