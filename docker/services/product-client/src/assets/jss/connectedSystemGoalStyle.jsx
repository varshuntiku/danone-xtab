const connectedSystemGoalStyle = (theme) => ({
    goalContainer: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    cardLayout: {
        height: '94%',
        width: '100%',
        position: 'relative',
        borderRadius: '0.5rem',
        border: '1px solid ' + theme.ConnectedSystemDashboard.goal.cardBorder,
        background: theme.palette.background.linearBackground
    },
    cardLayoutFit: {
        height: '100%',
        width: '100%',
        position: 'relative',
        borderRadius: '0.5rem',
        border: '2px solid ' + theme.ConnectedSystemDashboard.goal.cardBorder,
        background: theme.palette.background.linearBackground
    },
    cardContentWrapper: {
        width: '98%',
        backdropFilter: 'blur(1px)',
        borderRadius: '0.5rem'
    },
    cardTitle: {
        color: theme.palette.text.default,
        fontSize: theme.spacing(3.8),
        fontWeight: '400',
        letterSpacing: '0.0625rem',
        margin: '0rem 2rem 1rem 2rem',
        paddingTop: '2rem',
        opacity: '0.8',
        '@media (max-width: 1560px)': {
            fontSize: theme.spacing(3)
        },
        '@media (max-width:950px)': {
            fontSize: theme.spacing(2.5)
        }
    },
    innerLayout: {
        display: 'flex',
        flexDirection: 'row',
        justiFyContent: 'space-between',
        margin: '1rem 1rem 1rem 2rem'
    },
    subTitle: {
        fontSize: theme.spacing(2),
        color: theme.palette.text.default,
        fontWeight: '400',
        opacity: '0.8',
        lineHeight: 'normal',
        marginBottom: '0.5rem',
        '@media (max-width: 1500px)': {
            fontSize: theme.spacing(1.8)
        },
        '@media (max-width:1150px)': {
            fontSize: theme.spacing(1.5)
        },
        '@media (min-width:1280px) and (max-width: 2000px)': {
            width: '8rem'
        }
    },
    descriptiveBox: {
        '@media (min-width:1350px) and (max-width: 2000px)': {
            marginRight: '2.5rem'
        }
    },
    value: {
        fontSize: theme.spacing(4),
        color: theme.palette.text.default,
        opacity: '0.8',
        fontWeight: '100',
        '@media (max-width: 1500px)': {
            fontSize: theme.spacing(3)
        },
        '@media (max-width:1150px)': {
            fontSize: theme.spacing(1.6)
        }
    },
    header: {
        color: theme.ConnectedSystemDashboard.goal.cardBorder,
        marginLeft: '2rem',
        fontWeight: '400',
        fontSize: '1.7rem'
    },
    cardLayoutWrapper: {
        flex: 1
    },
    sideTag: {
        width: theme.spacing(1.4),
        height: '50%',
        borderRadius: '16.25rem',
        backgroundImage: theme.ConnectedSystemDashboard.goal.sideTag,
        opacity: '0.8',
        marginLeft: '-10px',
        position: 'absolute',
        left: theme.spacing(0.85),
        top: theme.spacing(2)
    }
});
export default connectedSystemGoalStyle;
