const mobileAppScreenStyle = (theme) => ({
    mGridGraphBody: {
        minHeight: '50%',
        // height: '100%',
        position: 'relative'
    },
    gridGraphHalfContainer: {
        height: '49%',
        position: 'relative'
    },
    noTitleBody: {
        height: 'calc(100% - 1rem)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
    },
    mGridContainer: {
        padding: theme.spacing(1, 2, 0, 2),
        height: '93%',
        flexGrow: 1,
        position: 'relative'
    },
    mGridBody: {
        height: '100%',
        position: 'relative'
    },
    mWidgetContent: {
        width: '100%',
        height: '100%',
        borderRadius: theme.spacing(1),
        position: 'relative',
        background: 'transparent'
    },
    mGridGraphContainer: {
        paddingBottom: theme.spacing(0.5),
        position: 'relative'
    }
});

export default mobileAppScreenStyle;
