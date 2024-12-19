const impactCardStyle = (theme) => ({
    impactCardContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        margin: theme.spacing(2, 0, 6.5, 0),
        position: 'relative'
    },
    impactHighlights: {
        background:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? 'linear-gradient(110.43deg, #0B121B -66.83%, rgba(11, 18, 27, 0) 103.2%)'
                : 'rgba(255, 255, 255, 0.5)',
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(5px)',
        padding: theme.spacing(1),
        border: '0.25px solid rgba(2, 224, 254, 0.3)',
        borderRadius: theme.spacing(0.8),
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    impactHighlightCard: {
        padding: theme.spacing(0.5),
        width: 'calc(50% - ' + theme.spacing(1) + ')',
        blur: '5px'
    },
    impactHighlightCardTitle: {
        color: localStorage.getItem('codx-products-theme') === 'dark' ? '#6DF0C2' : '#4560D7',
        textTransform: 'uppercase',
        textAlign: 'left',
        fontSize: theme.spacing(1.7)
    },
    impactHighlightCardValue: {
        color: localStorage.getItem('codx-products-theme') === 'dark' ? '#FFFFFF' : '#091F3A',
        textTransform: 'uppercase',
        textAlign: 'left',
        fontSize: theme.spacing(2),
        fontWeight: 100
    },
    impactMiniCardContainer: {
        padding: 0,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: theme.spacing(1),
        marginTop: theme.spacing(1)
    },
    impactMiniCard: {
        padding: theme.spacing(0.5, 1),
        border: '0.1px solid rgba(2, 224, 254, 0.3)',
        borderRadius: theme.spacing(0.8),
        width: 'calc(50% - ' + theme.spacing(0.5) + ')',
        background:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? 'linear-gradient(110.43deg, #0B121B -66.83%, rgba(11, 18, 27, 0) 103.2%)'
                : 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(5px)',
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)'
    },
    impactMiniContactCard: {
        borderColor: 'rgba(26, 117, 255, 0.3)'
    },
    impactMiniStatusCard: {
        borderColor: 'rgba(2, 254, 103, 0.3)'
    },
    impactMiniStageCard: {
        borderColor:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? 'rgba(254, 168, 2, 0.3)'
                : 'rgba(69, 96, 215, 0.3)'
    },
    impactMiniCardTitle: {
        color: localStorage.getItem('codx-products-theme') === 'dark' ? '#6DF0C2' : '#4560D7',
        textAlign: 'left',
        fontSize: theme.spacing(1.5),
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(0.5)
    },
    impactMiniCardTitleIcon: {
        color: theme.palette.primary.contrastText
    },
    impactMiniCardValue: {
        color: localStorage.getItem('codx-products-theme') === 'dark' ? '#FFFFFF' : '#091F3A',
        textAlign: 'left',
        fontSize: theme.spacing(1.5),
        fontWeight: 100,
        marginTop: theme.spacing(0.5)
    },
    cardBanner: {
        height: theme.spacing(5.5),
        width: theme.spacing(1),
        position: 'absolute',
        top: theme.spacing(1.5),
        left: theme.spacing(-0.5),
        borderRadius: theme.spacing(0.5),
        background: localStorage.getItem('codx-products-theme') === 'dark' ? '#6DF0C2' : '#4560D7'
    }
});

export default impactCardStyle;
