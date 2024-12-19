const mobileAppScreenWidgetStyle = (theme) => ({
    mWidgetContent: {
        width: '100%',
        height: '100%',
        borderRadius: theme.spacing(1),
        position: 'relative',
        background: 'transparent'
    },
    skeletonWave: {
        background: '#C4C4C4 ',
        opacity: '10%',
        borderRadius: theme.spacing(1),
        '&:after': {
            animation: 'MuiSkeleton-keyframes-wave 0.6s linear 0s infinite'
        },
        height: '5vh'
    },
    mGraphBody: {
        padding: '1rem 0.8rem',
        height: '100%',
        position: 'relative',
        '& :hover': {
            '& $storyCheckbox': {
                visibility: 'visible !important'
            }
        }
    },
    mGraphWrapper: {
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
    },
    mGraphLabel: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'flex-start',
        color: theme.palette.text.default,
        '& h5': {
            fontSize: '2rem'
        },
        '& h6': {
            fontSize: '1.5rem'
        },
        position: 'relative',
        animation: 'move-text 0.5s forwards',
        bottom: '-1em',
        opacity: 0,
        animationDelay: '0.60s',
        animationTimingFunction: 'ease-out',
        textTransform: 'uppercase'
    },
    mGraphLoader: {
        height: '100%',
        width: '100%'
    },
    mGraphContainer: {
        overflowY: 'auto',
        position: 'relative',
        animation: 'graph-view-animateIn 0.75s forwards',
        bottom: '-1em',
        opacity: 0,
        animationDelay: '0.400s',
        animationTimingFunction: 'ease-in-out',
        flex: 1
    },
    mWidgetTitle: {
        fontSize: theme.spacing(3.5),
        fontWeight: 300,
        lineHeight: '3.2rem',
        letterSpacing: '0.1rem'
    }
});

export default mobileAppScreenWidgetStyle;
