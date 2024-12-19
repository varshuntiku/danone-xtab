const connectedSystemInitiativesStyle = (theme) => ({
    container: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    initiativesContainer: {
        flex: 1,
        marginBottom: '0.2rem'
    },
    initiativesCardItemHeader: {
        fontSize: '1.6rem',
        padding: theme.spacing(1.5, 2, 2, 4.2),
        color: theme.palette.text.default,
        opacity: '0.8',
        position: 'relative',
        letterSpacing: '0.0525rem'
    },
    pointer: {
        position: 'absolute',
        top: theme.spacing(2.5),
        left: theme.spacing(2),
        width: theme.spacing(1.5),
        height: theme.spacing(0.6),
        borderRadius: theme.spacing(4)
    },
    initiativesCardItemTag: {
        borderRadius: theme.spacing(0.4),
        color: theme.palette.text.default,
        fontSize: '1.3rem',
        fontWeight: '400',
        padding: theme.spacing(0.5, 1),
        width: 'fit-content'
    },
    subTag: {
        bottom: theme.spacing(6),
        marginBottom: '1rem'
    },
    initiativesHeader: {
        color: theme.ConnectedSystemDashboard.initiative.header,
        marginLeft: '2rem',
        fontWeight: '400',
        fontSize: '1.7rem'
    },
    initiativesCardItem: {
        backdropFilter: 'blur(3.5px)',
        background: theme.palette.background.linearBackground,
        borderRadius: theme.spacing(0.6),
        height: '95%',
        width: theme.spacing(22),
        position: 'relative',
        display: 'inline-block',
        verticalAlign: 'top',
        whiteSpace: 'normal'
    },
    initiativesCardItemHidden: {
        background: theme.palette.background.linearBackground,
        borderRadius: theme.spacing(0.5),
        height: '95%',
        width: '0px',
        position: 'relative',
        display: 'inline-block',
        verticalAlign: 'top',
        whiteSpace: 'normal',
        opacity: 0,
        transition: 'width 1s ease 0s, opacity 1s ease 0s'
    },
    cardContainerRemove: {
        display: 'none'
    },
    visibleCardContainerGap: {
        marginRight: theme.spacing(1)
    },
    hiddenCardContainerGap: {
        marginRight: '0px'
    },
    initiativesCardItemTagWrapper: {
        position: 'absolute',
        bottom: theme.spacing(2),
        left: theme.spacing(2),
        display: 'flex',
        gap: '0.85rem',
        flexDirection: 'column',
        maxWidth: theme.spacing(20)
    }
});
export default connectedSystemInitiativesStyle;
