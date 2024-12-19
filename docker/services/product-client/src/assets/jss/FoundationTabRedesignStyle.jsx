const FoundationTabRedesignStyle = (theme) => ({
    overviewText: {
        fontSize: theme.title.h1.fontSize,
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: 500,
        color: theme.palette.text.default,
        marginTop: theme.layoutSpacing(12),
        marginBottom: theme.layoutSpacing(12),
        marginLeft: theme.layoutSpacing(25)
    },
    separtor: {
        backgroundColor: theme.palette.separator.grey,
        height: '100%',
        width: '1px'
    },
    intiativeSection1: {
        display: 'flex'
    },
    intiativeSection: {
        display: 'flex',
        paddingTop: theme.layoutSpacing(12),
        paddingBottom: theme.layoutSpacing(12),
        justifyContent: 'space-between',
        height: theme.layoutSpacing(137),
        minWidth: '12.05%'
    },
    intiativeSectionLarge: {
        display: 'flex',
        paddingTop: theme.layoutSpacing(12),
        paddingBottom: theme.layoutSpacing(12),
        justifyContent: 'space-between',
        flexGrow: 1,
        height: theme.layoutSpacing(137)
    },
    driverSection: {
        height: '100%',
        display: 'flex'
    },
    foundationTab: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
    solutions: {
        width: '50%'
    },
    insightsSection: {
        width: '44.5%'
    },
    toolsSection: {
        width: '55.5%'
    },
    solutionSection: {
        display: 'flex',
        borderBottom: `1px solid ${theme.palette.separator.grey}`
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
    driverProcessContainer: {
        height: '100%',
        width: '100%',
        padding: '1rem',
        display: 'flex',
        paddingTop: '2rem',
        paddingBottom: 0
    },
    processHolder: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(24),
        marginTop: '5.5rem',
        width: theme.layoutSpacing(250),
        marginLeft: '1rem'
    },
    processHighlight: {
        color: theme.palette.text.default,
        fontFamily: theme.title.h2.fontFamily,
        fontSize: theme.title.h3.fontSize,
        fontWeight: theme.title.h6.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing,
        textTransform: theme.title.h5.textTransform,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
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
        width: 'auto',
        marginLeft: '2rem',
        flexGrow: 1,
        display: 'flex',
        marginRight: '2rem',
        padding: '4rem 2rem'
    },
    verticalContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        padding: '1rem',
        width: 'auto',
        borderLeft: `1px solid ${theme.palette.text.default}30`,
        borderRight: `1px solid ${theme.palette.text.default}30`,
        height: '50%',
        paddingLeft: '3rem',
        paddingRight: '3rem',
        paddingTop: '0rem'
    },
    verticalSubContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
        width: '20rem',
        height: '100%',
        justifyContent: 'center',
        marginRight: '4rem'
    },
    horizontalContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        width: 'max-content'
    },
    graphHorizontal: {
        height: '50%',
        width: 'auto',
        justifyContent: 'space-around',
        position: 'relative',
        marginLeft: '2rem'
    },
    bottomContainer: {
        paddingTop: '3rem'
    },
    verticalFlex: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        height: '100%'
    },
    separator: {
        width: 'auto',
        height: '1px',
        background: `${theme.palette.text.default}30`,
        marginLeft: '1rem',
        marginRight: '1rem'
    },
    separatorBottom: {
        width: 'inherit',
        height: '1px',
        display: 'block',
        background: `${theme.palette.text.default}30`,
        marginTop: 'auto'
    },
    separatorVertical: {
        width: '1px',
        marginTop: '0.75rem',
        marginBottom: '0.75rem',
        height: 'auto',
        background: `${theme.palette.text.default}30`
    },
    cardHeading: {
        color: theme.palette.text.default,
        fontFamily: theme.title.h2.fontFamily,
        fontSize: theme.title.h2.fontSize,
        fontWeight: theme.title.h1.fontWeight,
        letterSpacing: theme.title.h3.letterSpacing,
        textTransform: theme.title.h1.textTransform,
        width: 'max-content'
    },
    subHeading: {
        fontSize: '1.4rem'
    },
    monthHeading: {
        letterSpacing: theme.title.h1.letterSpacing,
        fontSize: '2rem'
    },
    dateHeading: {
        fontWeight: theme.body.B4.fontWeight
    },
    indicatorText: {
        fontSize: theme.body.B5.fontSize,
        color: theme.palette.text.indicatorGreenText,
        fontWeight: theme.title.h6.fontWeight,
        fontFamily: theme.body.B1.fontFamily,
        borderRadius: '2px',
        background: `${theme.palette.text.indicatorGreenText}20`,
        paddingLeft: '2.5rem',
        paddingRight: '2.5rem',
        marginLeft: '0.5rem',
        display: 'flex',
        alignItems: 'center'
    },
    indicatorIconText: {
        paddingLeft: '1rem',
        paddingRight: '1.5rem',
        gap: '0.25rem'
    },
    calenderIcon: {
        width: '1.75rem',
        height: '1.75rem',
        marginRight: '1rem'
    },
    arrowUpIcon: {
        width: '2rem',
        height: '2rem',
        marginTop: '0.5rem',
        color: theme.palette.text.indicatorGreenText
    },
    plotlyHolder: {
        width: '30%',
        height: '100%',
        marginLeft: '1rem'
    },
    plotlyHalfHolder: {
        width: '15rem',
        marginLeft: '3rem',
        paddingRight: '0rem',
        height: '100%',
        marginRight: '5rem'
    },
    graphLabel: {
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: theme.body.B4.fontWeight,
        fontSize: theme.spacing(1.4),
        textAlign: 'left',
        letterSpacing: theme.title.h3.letterSpacing,
        paddingLeft: '1rem',
        width: '12rem'
    },
    legend: {
        display: 'flex',
        gap: theme.layoutSpacing(5),
        alignItems: 'center',
        position: 'absolute',
        left: '2%',
        bottom: '4rem'
    },
    legend2: {
        display: 'flex',
        gap: theme.layoutSpacing(5),
        alignItems: 'center',
        position: 'absolute',
        left: '2%',
        bottom: '1rem'
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
        width: 'auto'
    },
    valueText: {
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(14),
        fontFamily: theme.title.h1.fontFamily
    },
    centerText: {
        fontSize: '2rem',
        position: 'absolute',
        right: '76.5%',
        top: '62%',
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: theme.title.h1.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing
    }
});

export default FoundationTabRedesignStyle;
