const StrategyRedesignStyle = (theme) => ({
    topSection: {
        height: theme.layoutSpacing(64),
        display: 'flex',
        alignItems: 'center'
    },
    goalSection: {
        paddingLeft: theme.layoutSpacing(24),
        width: theme.layoutSpacing(412),
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    goalText: {
        fontSize: theme.layoutSpacing(24),
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: 500,
        lineHeight: theme.layoutSpacing(28),
        letterSpacing: theme.layoutSpacing(1)
    },
    circle: {
        border: `1px solid ${theme.palette.text.default}`,
        width: theme.layoutSpacing(15),
        height: theme.layoutSpacing(15),
        borderRadius: '50%',
        padding: '1px'
    },
    circleInner: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        backgroundColor: theme.palette.text.default
    },
    year: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        gap: theme.layoutSpacing(5)
    },
    yearText: {
        fontSize: theme.layoutSpacing(15),
        fontWeight: 500,
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.layoutSpacing(18)
    },
    yearSection: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '1rem',
        gap: theme.layoutSpacing(10)
    },
    heading: {
        fontSize: theme.layoutSpacing(24),
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: 500,
        lineHeight: theme.layoutSpacing(28),
        letterSpacing: theme.layoutSpacing(1)
    },
    headingSection: {
        display: 'flex',
        paddingLeft: theme.layoutSpacing(24),
        alignItems: 'center',
        height: '100%',
        flex: 1
    },
    intiativeSection: {
        height: theme.layoutSpacing(188),
        display: 'flex'
    },
    targetSection: {
        width: theme.layoutSpacing(412),
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        cursor: 'pointer'
    },
    intiative: {
        height: '100%',
        width: '25%',
        display: 'flex',
        justifyContent: 'space-between'
    },
    intiativeBox: {
        paddingLeft: theme.layoutSpacing(24),
        paddingRight: theme.layoutSpacing(16),
        paddingTop: theme.layoutSpacing(24),
        paddingBottom: theme.layoutSpacing(21),
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(83),
        width: '100%'
    },
    rowSpace2: {
        display: 'flex',
        alignItems: 'base-line'
    },
    projectionText: {
        color: theme.palette.text.connProjectionText,
        fontSize: theme.layoutSpacing(12),
        fontWeight: 400,
        fontFamily: theme.body.B1.fontFamily,
        backgroundColor: `${theme.palette.text.connProjectionText}30`,
        paddingTop: theme.layoutSpacing(4),
        paddingBottom: theme.layoutSpacing(4),
        paddingLeft: theme.layoutSpacing(8),
        paddingRight: theme.layoutSpacing(8),
        borderRadius: theme.layoutSpacing(12)
    },
    intiativeName: {
        fontSize: theme.layoutSpacing(18),
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.default,
        lineHeight: theme.layoutSpacing(21.6),
        letterSpacing: theme.layoutSpacing(0.5)
    },
    recordText: {
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(32),
        fontWeight: 400,
        lineHeight: theme.layoutSpacing(36),
        letterSpacing: theme.layoutSpacing(1)
    },
    arrowUp: {
        fontSize: '3rem',
        '&.MuiSvgIcon-root': {
            fill: theme.palette.text.connProjectionText
        }
    },
    progressText: {
        fontSize: theme.layoutSpacing(12),
        fontWeight: 500,
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.connProjectionText,
        lineHeight: theme.layoutSpacing(21),
        letterSpacing: theme.layoutSpacing(1),
        marginTop: '0.75rem'
    },
    targetHeading: {
        fontSize: theme.layoutSpacing(30),
        color: theme.palette.text.default,
        fontWeight: 500,
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.layoutSpacing(32),
        letterSpacing: theme.layoutSpacing(1)
    },
    targetBox: {
        paddingLeft: theme.layoutSpacing(24),
        paddingRight: theme.layoutSpacing(16),
        display: 'flex',
        flexDirection: 'column',
        paddingTop: theme.layoutSpacing(24),
        paddingBottom: theme.layoutSpacing(21),
        justifyContent: 'space-between',

        '&:hover': {
            backgroundColor: `${theme.palette.text.connHighlight}30`
        }
    },
    progresSection: {
        paddingLeft: theme.layoutSpacing(4),
        paddingRight: theme.layoutSpacing(4),
        display: 'flex',
        alignItems: 'center',
        backgroundColor: `${theme.palette.icons.indicatorGreen}20`,
        gap: '0.5rem',
        marginBottom: '-0.5rem'
    },
    targetText: {
        fontSize: theme.layoutSpacing(14),
        color: theme.palette.text.default,
        fontWeight: 400,
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.layoutSpacing(16.8),
        letterSpacing: theme.layoutSpacing(2),
        width: 'fit-content'
    },
    targetRecord: {
        fontSize: theme.layoutSpacing(30),
        color: theme.palette.text.default,
        fontWeight: 300,
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.layoutSpacing(32),
        letterSpacing: theme.layoutSpacing(1)
    },
    outer: {
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'end',
        marginBottom: '-1%'
    },
    processSection: {
        display: 'flex',
        flexDirection: 'column',
        width: theme.layoutSpacing(1600)
    },
    recommendData: {
        width: '25%',
        borderTop: `1px solid ${theme.palette.separator.grey}`
    },

    moment: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.layoutSpacing(24),
        paddingRight: theme.layoutSpacing(24),
        height: theme.layoutSpacing(55),
        width: '100%',
        marginTop: theme.layoutSpacing(5),
        justifyContent: 'space-between'
    },
    momentHeading: {
        fontSize: theme.layoutSpacing(24),
        color: theme.palette.text.default,
        fontWeight: 500,
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.layoutSpacing(28.8),
        letterSpacing: theme.layoutSpacing(1)
    },
    selectText: {
        fontSize: theme.layoutSpacing(15),
        color: theme.palette.text.default,
        fontWeight: 400,
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.layoutSpacing(18),
        letterSpacing: theme.layoutSpacing(1)
    },
    tabs: {
        height: theme.layoutSpacing(44),
        paddingTop: theme.layoutSpacing(10),
        width: '100%'
    },
    tabSection: {
        display: 'flex',
        gap: '4rem',
        paddingLeft: theme.layoutSpacing(24),
        height: '100%'
    },
    tabItem: {
        height: '100%',
        fontSize: theme.layoutSpacing(16),
        color: theme.palette.text.default,
        fontWeight: 400,
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.layoutSpacing(16),
        paddingTop: theme.layoutSpacing(4),
        paddingBottom: theme.layoutSpacing(4),
        paddingLeft: theme.layoutSpacing(8),
        paddingRight: theme.layoutSpacing(8),
        cursor: 'pointer',
        width: theme.layoutSpacing(104),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    progressTop: {
        color: theme.palette.text.connProjectionText
    },
    inner: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(16)
    },
    tabItemColor: {
        backgroundColor: theme.palette.background.connTabBack,
        borderBottom: `1px solid ${theme.palette.text.connHighlight}`
    },
    quarterHeading: {
        fontSize: theme.layoutSpacing(18),
        color: theme.palette.text.default,
        fontWeight: 500,
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.layoutSpacing(21.6),
        letterSpacing: theme.layoutSpacing(1),
        display: 'flex',
        alignItems: 'center'
    },
    quarterSection: {
        height: theme.layoutSpacing(56),
        paddingLeft: theme.layoutSpacing(24),
        display: 'flex',
        alignItems: 'center'
    },
    processSectionGraph: {
        height: theme.layoutSpacing(318)
    },
    recommends: {
        height: theme.layoutSpacing(183),
        paddingTop: '0.6rem',
        paddingBottom: '0.6rem'
    },
    recommendsTop: {
        width: '100%',
        height: '100%',
        backgroundColor: '#EAE3D730',
        paddingLeft: theme.layoutSpacing(24),
        display: 'flex',
        flexDirection: 'column'
    },
    recommendsHeading: {
        height: theme.layoutSpacing(48),
        display: 'flex',
        alignItems: 'center',
        fontSize: theme.layoutSpacing(24),
        color: theme.palette.text.default,
        fontWeight: 500,
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.layoutSpacing(28.8),
        letterSpacing: theme.layoutSpacing(1)
    },
    recommedsWrapper: {
        height: '100%',
        paddingRight: theme.layoutSpacing(8),
        paddingLeft: theme.layoutSpacing(8)
    },
    recommedData: {
        width: '25%'
    },
    recommendContent: {
        paddingLeft: theme.layoutSpacing(24),
        paddingRight: theme.layoutSpacing(24),
        paddingTop: theme.layoutSpacing(12),
        paddingBottom: theme.layoutSpacing(12),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
    },
    dataText: {
        fontSize: theme.layoutSpacing(14),
        color: theme.palette.text.default,
        fontWeight: 400,
        fontFamily: theme.body.B1.fontFamily,
        lineHeight: theme.layoutSpacing(20),
        letterSpacing: theme.layoutSpacing(1),
        minHeight: theme.layoutSpacing(56)
    },
    takeActionText: {
        fontSize: theme.layoutSpacing(13),
        color: theme.palette.text.default,
        fontWeight: 500,
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.layoutSpacing(17.29),
        letterSpacing: theme.layoutSpacing(1),
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    takeActionText2: {
        fontSize: theme.layoutSpacing(13),
        color: theme.palette.text.default,
        fontWeight: 500,
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.layoutSpacing(17.29),
        letterSpacing: theme.layoutSpacing(1),
        textDecoration: 'underline',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    rightSectionTop: {},
    actionIcon: {
        transform: 'rotate(30deg)',
        '&.MuiSvgIcon-root': {
            fill: theme.palette.text.default
        }
    },
    actionSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        cursor: 'pointer'
    },
    intiativesSection: {
        marginTop: theme.layoutSpacing(5),
        flex: 1
    },
    intiativeSectionInner: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
    intiativeHeadingSection: {
        height: theme.layoutSpacing(55),
        width: '100%',
        paddingLeft: theme.layoutSpacing(24),
        display: 'flex',
        alignItems: 'center'
    },
    intiativeHeading: {
        fontSize: theme.layoutSpacing(24),
        color: theme.palette.text.default,
        fontWeight: 500,
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.layoutSpacing(28.8),
        letterSpacing: theme.layoutSpacing(1)
    },
    intiativeContent: {
        padding: theme.layoutSpacing(8),
        minHeight: theme.layoutSpacing(233),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    intiativeContentInner: {
        paddingTop: theme.layoutSpacing(16),
        paddingLeft: theme.layoutSpacing(26),
        paddingBottom: theme.layoutSpacing(16),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: `${theme.palette.text.connHighlight}30`
        }
    },
    intiativeContextName: {
        fontSize: theme.layoutSpacing(24),
        color: theme.palette.text.default,
        fontWeight: 500,
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.layoutSpacing(26),
        letterSpacing: theme.layoutSpacing(1)
    },
    redirectToValue: {
        fontSize: theme.layoutSpacing(15),
        fontWeight: 500,
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.layoutSpacing(18),
        letterSpacing: theme.layoutSpacing(1),
        textDecoration: 'underline',
        color: theme.palette.text.default
    },
    hoverRedirectToValue: {
        fontSize: theme.layoutSpacing(15),
        fontWeight: 500,
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.layoutSpacing(18),
        letterSpacing: theme.layoutSpacing(1),
        textDecoration: 'underline',
        color: theme.palette.text.connHighlight
    },
    valueIcon: {
        transform: 'rotate(90deg)',
        '&.MuiSvgIcon-root': {
            fill: theme.palette.text.default
        }
    },
    hoverValueIcon: {
        transform: 'rotate(90deg)',
        '&.MuiSvgIcon-root': {
            fill: theme.palette.text.connHighlight
        }
    },
    redirectSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer'
    },
    dataName: {
        fontSize: theme.layoutSpacing(16),
        color: theme.palette.text.default,
        fontWeight: 300,
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.layoutSpacing(19.2),
        letterSpacing: theme.layoutSpacing(1)
    },
    dataRecord: {
        fontSize: theme.layoutSpacing(36),
        color: theme.palette.text.default,
        fontWeight: 300,
        fontFamily: theme.title.h1.fontFamily,
        lineHeight: theme.layoutSpacing(32),
        letterSpacing: theme.layoutSpacing(1)
    },
    intiativeData: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(19),
        paddingRight: '3rem'
    },
    separtor: {
        width: '1px',
        height: '100%',
        backgroundColor: theme.palette.separator.grey
    },
    progressBar: {
        width: '5rem',
        transform: 'rotate(270deg)',
        marginTop: theme.layoutSpacing(-17)
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        '& .MuiLinearProgress-bar': {
            backgroundColor: theme.palette.background.connProgressBar,
            borderRadius: '2px'
        },
        '&.MuiLinearProgress-colorPrimary': {
            backgroundColor: theme.ConnectedSystemDashboard.decisionFlow.subQuestion,
            borderRadius: '2px'
        }
    },
    targetHeading1: {
        fontSize: theme.layoutSpacing(10),
        color: theme.palette.text.default,
        fontWeight: 400,
        fontFamily: theme.body.B1.fontFamily,
        lineHeight: theme.layoutSpacing(14),
        letterSpacing: theme.layoutSpacing(1)
    },
    row: {
        display: 'flex'
    },
    column: {
        display: 'flex',
        flexDirection: 'column'
    },
    intiativePart: {
        display: 'flex',
        flex: 1
    },
    rowSpace: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    rowHeight: {
        display: 'flex',
        height: '100%',
        gap: '0.8rem',
        marginTop: '0.5rem'
    },
    rowGap: {
        display: 'flex',
        gap: '3rem'
    },
    graphSection: {
        width: '50%',
        display: 'flex',
        height: '100%',
        gap: '4rem',
        paddingTop: '1rem',
        cursor: 'pointer'
    },
    graphContainer: {
        display: 'flex',
        height: '100%',
        '&:hover': {
            backgroundColor: `${theme.palette.text.connHighlight}30`
        },
        marginLeft: theme.layoutSpacing(8),
        marginRight: theme.layoutSpacing(8)
    },
    separatorVertical: {
        width: '1px',
        marginTop: '0.75rem',
        marginBottom: '0.75rem',
        height: 'auto',
        background: `${theme.palette.text.default}30`
    },
    graphTitle: {
        fontSize: theme.title.h2.fontSize,
        fontWeight: theme.title.h1.fontWeight,
        fontFamily: theme.title.h1.fontFamily,
        marginLeft: '32%'
    },
    titleLeft: {
        marginLeft: 'var(--marginLeft,0%)'
    },
    legendContainer: {
        display: 'flex',
        gap: '0rem',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: '27%',
        marginTop: '-2rem'
    },
    legend: {
        display: 'flex',
        gap: theme.layoutSpacing(5),
        alignItems: 'center',
        marginLeft: '1rem'
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
    initiativeTargetHolder: {
        marginLeft: '-3.5rem'
    },
    targetDataHolder: {
        display: 'flex',
        alignItems: 'center',
        gap: '2rem'
    },
    separtorLine: {
        height: '90%',
        width: '1px',
        backgroundColor: `${theme.palette.separator.grey}`,
        marginTop: '1rem'
    },
    skeletonWave: {
        background: '#C4C4C4 ',
        opacity: '10%',
        borderRadius: theme.spacing(1),
        '&:after': {
            animation: 'MuiSkeleton-keyframes-wave 0.6s linear 0s infinite'
        }
    },
    skeletonContainer: {
        display: 'flex',
        height: '100%',
        width: '100%',
        background: '#c4c4c421',
        borderRadius: theme.spacing(1),
        '&:after': {
            animation: 'MuiSkeleton-keyframes-wave 0.6s linear 0s infinite'
        }
    },
    skeletonErrorTxt: {
        fontSize: '12px',
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        color: '#c73841',
        alignItems: 'center',
        display: 'flex',
        fontWeight: '300'
    },
    skeletonErrorIcon: {
        marginRight: '0.5rem',
        marginTop: '0.2rem',
        color: '#c73841'
    }
});

export default StrategyRedesignStyle;
