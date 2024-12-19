const IntelligenceRedesignTabStyle = (theme) => ({
    intelligenceTab: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
    overviewText: {
        fontSize: theme.title.h1.fontSize,
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: 500,
        color: theme.palette.text.default,
        marginTop: theme.layoutSpacing(12),
        marginBottom: theme.layoutSpacing(12),
        marginLeft: theme.layoutSpacing(25)
    },
    contentSection: {
        paddingLeft: '2rem',
        paddingRight: '2rem',
        paddingBottom: theme.layoutSpacing(14)
    },
    contentName: {
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(20)
    },
    topSection: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: theme.layoutSpacing(50)
    },
    record: {
        fontSize: theme.layoutSpacing(36),
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily
    },
    arrowUp: {
        fontSize: '3rem',
        '&.MuiSvgIcon-root': {
            fill: theme.palette.text.indicatorGreenText
        }
    },
    leftSection: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'end',
        marginBottom: '1rem',
        gap: theme.layoutSpacing(2),
        backgroundColor: `${theme.palette.icons.indicatorGreen}20`,
        padding: theme.layoutSpacing(0.5)
    },
    progressText: {
        color: theme.palette.text.indicatorGreenText,
        fontSize: theme.layoutSpacing(12),
        fontFamily: theme.body.B1.fontFamily,
        fontWeight: 500,
        lineHeight: theme.layoutSpacing(14.4),
        letterSpacing: theme.layoutSpacing(1)
    },
    bottomSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(4)
    },
    dataName: {
        fontSize: theme.layoutSpacing(15),
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: 400,
        letterSpacing: theme.layoutSpacing(1),
        lineHeight: theme.layoutSpacing(20)
    },
    dataValue: {
        fontSize: theme.layoutSpacing(15),
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: 400,
        letterSpacing: theme.layoutSpacing(1),
        lineHeight: theme.layoutSpacing(20)
    },
    intiativeSection: {
        display: 'flex',
        height: 'fit-content'
    },
    topContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem'
    },
    bottomContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    driverSection: {
        height: '100%',
        display: 'flex'
    },
    solutionsInsight: {
        width: '45%'
    },
    solutionsTools: {
        width: '55%'
    },
    solutionSection: {
        display: 'flex',
        borderBottom: `1px solid ${theme.palette.separator.grey}`
    },
    driverProcessContainer: {
        height: '100%',
        width: '100%',
        display: 'flex',
        paddingBottom: 0
    },
    processHolder: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(24),
        paddingTop: '5rem',
        width: '14.75%',
        paddingLeft: '1rem'
    },
    processHighlight: {
        color: theme.palette.text.default,
        fontFamily: theme.title.h2.fontFamily,
        fontSize: theme.title.h3.fontSize,
        fontWeight: theme.title.h6.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        textTransform: theme.title.h5.textTransform
    },
    processUnHighlight: {
        opacity: 0.3
    },
    arrowRight: {
        width: '3rem',
        height: '3rem'
    },
    logo: {
        width: '2rem',
        height: '2rem'
    },
    processSelectedHighlight: {
        color: theme.palette.text.indicatorGreenText,
        marginLeft: '0rem',
        justifyContent: 'flex-start',
        gap: '2rem',
        textTransform: 'capitalize'
    },
    processSelectedUnHighlight: {
        color: theme.palette.text.indicatorGreenText,
        marginLeft: '4rem',
        opacity: 0.3
    },
    subprocessText: {
        fontWeight: theme.title.h1.fontWeight,
        color: theme.palette.text.indicatorGreenText,
        marginLeft: '4rem',
        textTransform: theme.title.h1.textTransform
    },
    graphDataContainer: {
        background: theme.ConnectedSystemDashboard.selectedProcessBackground,
        width: 'min-content',
        flexGrow: 1,
        display: 'flex',
        padding: '2rem 2rem',
        position: 'relative',
        height: 'auto',
        margin: '1rem 4rem 1rem 1rem'
    },
    separatorBottom: {
        width: 'inherit',
        height: '1px',
        display: 'block',
        background: `${theme.palette.text.default}30`,
        marginTop: 'auto',
        marginRight: '1px'
    },
    separatorVertical: {
        width: '1px',
        marginTop: '0.75rem',
        marginBottom: '0.75rem',
        height: 'auto',
        background: `${theme.palette.text.default}30`
    },
    tabsContainer: {
        display: 'flex',
        gap: '2rem',
        height: '4rem',
        borderBottom: `1px solid ${theme.palette.separator.grey}`
    },
    tabHeading: {
        fontSize: theme.title.h2.fontSize,
        color: `${theme.palette.text.default}95`,
        fontWeight: theme.title.h1.fontWeight,
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        cursor: 'pointer'
    },
    selectedTab: {
        borderBottom: `2px solid ${theme.palette.text.default}`,
        fontWeight: theme.title.h6.fontWeight,
        paddingLeft: '1rem',
        paddingRight: '1rem'
    },
    initialData: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%',
        height: '100%'
    },
    textHeading: {
        fontSize: theme.title.h1.fontSize
    },
    drawerIcon: {
        width: '2rem',
        height: '2rem',
        borderRadius: '30%',
        border: `1px solid ${theme.palette.text.default}`,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    swingIcon: {
        position: 'absolute',
        left: '1',
        top: '9%'
    },
    swingIconLeft: {
        transform: 'rotate(180deg)',
        position: 'absolute',
        right: '-3rem'
    },
    processSectionContainer: {
        width: '100%',
        height: '100%'
    },
    tabDataContainer: {
        width: '100%',
        height: '44%',
        margin: 0
    },
    tabDataContainer2: {
        width: '100%',
        height: '44%',
        margin: 0
    },
    topHalfContainer: {
        height: '100%',
        position: 'relative',
        '&.MuiGrid-item ': {
            padding: '0.5rem 0'
        }
    },
    sideBarValueContainer: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        top: '33%',
        right: '20%'
    },
    sideBarAxisContainer: {
        left: '7.75rem',
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        width: 'fit-content',
        top: '15%',
        paddingRight: '2rem'
    },
    topHalfContainer2: {
        height: '100%',
        display: 'flex'
    },
    bottomHalfContainer: {
        height: '100%',
        display: 'flex',
        gap: '12rem',
        '&.MuiGrid-item ': {
            padding: '0.5rem 0'
        }
    },
    overViewbottomHalfContainer: {
        display: 'flex',
        paddingLeft: '0 !important',
        paddingRight: '0 !important',
        width: '50%',
        gap: '0.75rem'
    },
    bottomHalfContainer2: {
        height: '100%',
        display: 'flex',
        '&.MuiGrid-item ': {
            padding: '0.5rem 0'
        }
    },
    overViewBottomHalfContainer2: {
        display: 'flex',
        paddingLeft: '0 !important',
        flexGrow: 1,
        gap: '0.75rem'
    },
    cardHeading: {
        fontSize: theme.title.h2.fontSize,
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: theme.title.h6.fontWeight,
        letterSpacing: theme.title.h3.letterSpacing,
        marginLeft: '2rem'
    },
    consumptionSubHeading: {
        fontSize: theme.button.BU1.fontSize,
        fontWeight: theme.title.h1.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing,
        marginLeft: '2rem',
        display: 'flex',
        alignItems: 'center'
    },
    anomalySubHeading: {
        fontSize: theme.button.BU1.fontSize,
        fontWeight: theme.title.h1.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing,
        marginLeft: '2rem',
        display: 'flex',
        alignItems: 'center',
        width: '50%'
    },
    numberHeading: {
        fontSize: theme.title.h1.fontSize,
        fontWeight: theme.body.B4.fontWeight,
        marginLeft: '2rem'
    },
    analyticsNumberHeading: {
        fontSize: '2rem',
        letterSpacing: theme.title.h1.letterSpacing,
        fontWeight: theme.title.h1.fontWeight,
        marginLeft: '2rem'
    },
    graphLabel: {
        color: theme.palette.text.default,
        fontFamily: theme.kpi.k1.fontFamily,
        fontWeight: theme.title.h1.fontWeight,
        fontSize: theme.body.B7.fontSize,
        letterSpacing: theme.title.h3.letterSpacing,
        paddingLeft: '1rem',
        width: '12rem',
        textAlign: 'center',
        marginTop: '-3%'
    },
    graphLabelVertical: {
        transform: 'rotate(-90deg)',
        textAlign: 'center',
        position: 'absolute',
        top: '100%',
        left: '-5rem'
    },
    legend: {
        display: 'flex',
        gap: theme.layoutSpacing(5),
        alignItems: 'center',
        marginLeft: '2rem'
    },
    overviewProgressLegend: {
        display: 'flex',
        gap: theme.layoutSpacing(5),
        alignItems: 'center',
        marginLeft: '2rem'
    },
    legendBox: {
        width: '1.5rem',
        height: '1.5rem',
        borderRadius: '3px'
    },
    legendText: {
        color: theme.palette.text.default,
        fontSize: '1.42rem',
        fontStyle: 'normal',
        fontWeight: '300',
        width: 'max-content'
    },
    valueText: {
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(14),
        fontFamily: theme.title.h1.fontFamily
    },
    costDetailsHolder: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.1rem',
        justifyContent: 'center'
    },
    costDetailsSubHeading: {
        fontWeight: theme.title.h1.fontWeight,
        fontSize: '2rem'
    },
    fillContainer: {
        height: '100%',
        width: '70%'
    },
    costFillContainer: {
        height: '100%',
        width: '50%',
        marginLeft: '3rem'
    },
    fillContainer3: {
        height: '100%',
        width: '100%'
    },
    appLoginDetailsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        marginBottom: '2rem'
    },
    analyticsBottomGraphDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        marginBottom: '2rem',
        width: '-webkit-fill-available'
    },
    analyticsBottomGraphHolder: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        marginBottom: '2rem',
        width: '60%'
    },
    analyticsBottomGraphDetailsTop: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    analyticsBottomGraphDetailsBottom: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    overviewProgressContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: '100%',
        marginBottom: '1rem'
    },
    appLoginContainer: {
        width: '50%',
        borderTop: `1px solid ${theme.palette.separator.grey}`
    },
    progressHolder: {
        display: 'flex',
        gap: '0.25rem',
        marginLeft: '2rem',
        width: '90%'
    },
    progressBlock: {
        height: theme.layoutSpacing(20),
        width: theme.layoutSpacing(10),
        background: `var(--color,${theme.palette.background.successDark})`
    },
    progressBlockUnfill: {
        height: theme.layoutSpacing(20),
        width: theme.layoutSpacing(10),
        background: theme.ConnectedSystemDashboard.progressBlockUnfill
    },
    legendVerticalFlex: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        justifyContent: 'flex-end'
    },
    legendHorizontalFlex: {
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        position: 'absolute',
        right: '7%',
        top: '28%',
        width: '28rem',
        marginTop: '0.5rem',
        paddingBottom: '2rem'
    },
    verticalFlex: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    detectionVerticalFlex: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        justifyContent: 'flex-end',
        marginTop: '4rem',
        marginBottom: '1rem'
    },
    rateFlex: {
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    anomalyVerticalFlex: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '50%'
    },
    anomalyRateFlex: {
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
    },
    indicatorText: {
        fontSize: theme.body.B7.fontSize,
        color: theme.palette.text.indicatorGreenText,
        fontWeight: theme.title.h6.fontWeight,
        fontFamily: theme.body.B1.fontFamily,
        borderRadius: '2px',
        background: `${theme.palette.text.indicatorGreenText}20`,
        paddingLeft: '0.5rem',
        paddingRight: '1rem',
        marginLeft: '0.5rem',
        display: 'flex',
        alignItems: 'center'
    },
    indicatorIconText: {
        paddingRight: '1.5rem',
        height: '2rem',
        width: '8rem'
    },
    arrowUpIcon: {
        width: '3rem',
        height: '6rem',
        color: theme.palette.text.indicatorGreenText
    },
    calenderIcon: {
        width: '1.75rem',
        height: '1.75rem',
        marginRight: '1rem'
    },
    analyticsTopDriftContainers: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        paddingBottom: '1rem'
    },
    infoIcon: {
        color: theme.palette.background.infoBgDark,
        width: '2rem',
        height: '2rem'
    },
    infoHolder: {
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
    },
    consumptionDetailsLeftContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '50%',
        borderTop: `1px solid ${theme.palette.separator.grey}`
    },
    consumptionDetailsRightContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '50%',
        paddingLeft: '2rem',
        borderTop: `1px solid ${theme.palette.separator.grey}`
    },
    dataContainersLevel: {
        width: '100%',
        height: '100%'
    },
    anomalyValue: {
        marginLeft: '2rem',
        fontSize: '2rem',
        fontWeight: theme.title.h1.fontWeight
    },
    driftBorderContainer: {
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        paddingLeft: '0rem'
    },
    customSeparator: {
        width: 'var(--width,100%)',
        height: '1px',
        borderBottom: `1px solid ${theme.palette.separator.grey}`
    },
    dataContainers: {
        width: '100%',
        height: '100%',
        borderRight: `1px solid ${theme.palette.separator.grey}`
    },
    separatorHolder: {
        width: '100%',
        display: 'flex',
        gap: '1rem'
    },
    accuracyRateFlex: {
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
    },
    overViewHeading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    dateText: {
        fontSize: theme.layoutSpacing(14),
        color: theme.palette.text.default,
        fontWeight: 400,
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.layoutSpacing(36),
        letterSpacing: theme.layoutSpacing(1)
    },
    calenderSection: {
        display: 'flex',
        alignItems: 'center',
        marginRight: '2rem',
        gap: '1rem'
    },
    accuracyHeaderContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    accuracyTotal: {
        color: theme.palette.text.default,
        fontSize: theme.title.h3.fontSize,
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontWeight: theme.kpi.k1.fontWeight,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginRight: '2rem'
    },
    accuracyTotalValue: {
        fontSize: theme.title.h1.fontSize
    },
    tabDataContainerLevel: {
        width: '100%',
        height: '44%',
        margin: 0,
        display: 'flex'
    },
    topHalfContainerLevel: {
        height: '100%',
        position: 'relative',
        '&.MuiGrid-item ': {
            padding: '0.5rem 0'
        },
        width: '50%',
        marginRight: '0.75rem'
    },
    topHalfContainer2Level: {
        height: '100%',
        display: 'flex',
        flex: 1
    },
    separtorLine: {
        width: '1px',
        height: 'auto',
        backgroundColor: `${theme.palette.separator.grey}`,
        marginTop: '0.75rem',
        marginBottom: 'var(--marginBottom,0.75rem)'
    },
    inner: {
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        marginTop: '0.5rem',
        width: '101.5%',
        height: '100%'
    },
    innerEmpty: {
        marginTop: '0.5rem',
        display: 'flex',
        flexDirection: 'column'
    },
    tabDataContainer2Level: {
        width: '100%',
        height: '44%',
        margin: 0,
        display: 'flex',
        gap: '0.75rem'
    }
});

export default IntelligenceRedesignTabStyle;
