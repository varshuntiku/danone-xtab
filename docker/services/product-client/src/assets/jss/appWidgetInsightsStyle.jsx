import LikeIcon from 'assets/img/likeIcon.svg';
import ShareIcon from 'assets/img/shareIcon.svg';
import CommentIcon from 'assets/img/commentIcon.svg';

const appWidgetInsightsStyle = (theme) => ({
    infoWidgetInsight: {
        borderLeft: `4px solid ${theme.palette.background.infoBgDark}`,
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16),
        padding: `${theme.layoutSpacing(11)} ${theme.layoutSpacing(16)} ${theme.layoutSpacing(
            10
        )} ${theme.layoutSpacing(5)} `,
        marginBottom: theme.spacing(1),
        overflow: 'auto',
        background: theme.palette.background.infoBgLight
    },
    successWidgetInsight: {
        borderLeft: `4px solid ${theme.palette.background.successDark}`,
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16),
        padding: `${theme.layoutSpacing(11)} ${theme.layoutSpacing(16)} ${theme.layoutSpacing(
            10
        )} ${theme.layoutSpacing(5)} `,
        marginBottom: theme.spacing(1),
        '& div > div': {
            color: theme.palette.success.main
        },
        overflow: 'auto',
        backgroundColor: theme.palette.background.sucessLight
    },
    warningWidgetInsight: {
        borderLeft: `4px solid ${theme.palette.background.warningDark}`,
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16),
        padding: `${theme.layoutSpacing(11)} ${theme.layoutSpacing(16)} ${theme.layoutSpacing(
            10
        )} ${theme.layoutSpacing(5)} `,
        marginBottom: theme.spacing(1),
        '& div > div': {
            color: theme.palette.warning.main
        },
        overflow: 'auto',
        backgroundColor: theme.palette.background.warningLight
    },
    insightHeader: {
        fontSize: '2rem',
        fontWeight: 400,
        padding: theme.spacing(1, 0),
        textDecoration: 'underline',
        color: theme.palette.text.default
    },
    insightExtraValue: {
        float: 'right',
        fontSize: '1.75rem',
        fontWeight: 700,
        marginTop: theme.spacing(1),
        color: theme.palette.text.default
    },
    arrowGreenIcon: {
        float: 'right',
        color: '#4caf50',
        marginLeft: '0.4rem',
        marginTop: '0.4rem'
    },
    arrowRedIcon: {
        float: 'right',
        color: 'red',
        marginLeft: '0.4rem',
        marginTop: '0.4rem'
    },
    insightHeading: {
        color: theme.palette.text.default,
        fontFamily: theme.body.B1.fontFamily,
        fontSize: theme.layoutSpacing(16),
        fontWeight: theme.title.h6.fontWeight,
        letterSpacing: theme.layoutSpacing(0.5),
        whiteSpace: 'initial'
    },
    customInsightHeading: {
        color: theme.palette.text.default,
        fontFamily: theme.body.B1.fontFamily,
        fontSize: theme.title.h2.fontSize,
        fontWeight: theme.title.h1.fontWeight,
        letterSpacing: theme.title.h3.letterSpacing,
        whiteSpace: 'initial',
        marginTop: '1.2rem'
    },
    insightLabelContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        float: 'left',
        textAlign: 'left',
        textWrap: 'wrap',
        height: 'auto'
    },
    customInsightLabelContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '1rem',
        float: 'left',
        textAlign: 'left',
        textWrap: 'wrap',
        height: 'auto',
        width: '100%'
    },
    insightContainer: {
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16),
        '& div > div': {
            color: theme.palette.success.main
        },
        backgroundColor: 'transparent',
        border: `1px solid ${theme.palette.background.insightBorder}`,
        padding: '1rem',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '@media (max-height: 560px)': {
            padding: '0.8rem'
        }
    },
    insightValue: {
        float: 'right',
        textAlign: 'right',
        textWrap: 'wrap',
        color: theme.palette.text.default,
        fontFamily: theme.body.B1.fontFamily,
        fontSize: theme.layoutSpacing(16),
        fontWeight: '400',
        letterSpacing: theme.layoutSpacing(0.5)
    },
    bulbHolderSuccess: {
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.body.B7.fontSize,
        fontWeight: theme.body.B4.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing,
        display: 'flex',
        alignItems: 'center',
        background: theme.palette.background.insightSuccess
    },
    bulbHolderFailure: {
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.body.B7.fontSize,
        fontWeight: theme.body.B4.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing,
        display: 'flex',
        alignItems: 'center',
        background: theme.palette.background.insightFailure
    },
    bulbHolderNeutral: {
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.body.B7.fontSize,
        fontWeight: theme.body.B4.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing,
        display: 'flex',
        alignItems: 'center'
    },
    bulbIcon: {
        minHeight: '1.6rem',
        minWidth: '1.6rem',
        padding: '0.5rem',
        marginTop: '-0.25rem',
        color: theme.palette.text.default
    },
    bulbIconSuccess: {
        background: theme.palette.background.insightSuccess,
        minHeight: '3rem',
        minWidth: '3rem',
        color: theme.palette.text.default
    },
    bulbIconFailure: {
        background: theme.palette.background.insightFailure,
        minHeight: '3rem',
        minWidth: '3rem',
        color: theme.palette.text.default
    },
    bulbIconNeutral: {
        background: theme.palette.background.insightNeutral,
        minHeight: '3rem',
        minWidth: '3rem',
        color: theme.palette.text.default
    },
    customInsightContainer: {
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16),
        '& div > div': {
            color: theme.palette.success.main
        },
        backgroundColor: 'transparent',
        border: '1px solid #00000040',
        padding: '2rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    customIconsHolder: {
        display: 'flex',
        width: '100%',
        marginTop: '2rem'
    },
    likeIcon: {
        marginLeft: '1rem',
        maskSize: '100%',
        webkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        minWidth: '3rem',
        minHeight: '3rem',
        maskImage: `url(${LikeIcon})`,
        background: theme.palette.text.secondaryText
    },
    dislikeIcon: {
        transform: 'rotate(180deg)',
        maskSize: '100%',
        webkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        minWidth: '3rem',
        minHeight: '3rem',
        maskImage: `url(${LikeIcon})`,
        background: theme.palette.text.secondaryText
    },
    commentIcon: {
        marginLeft: '1rem',
        maskSize: '100%',
        webkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        minWidth: '3rem',
        minHeight: '3rem',
        maskImage: `url(${CommentIcon})`,
        background: theme.palette.text.secondaryText
    },
    shareIcon: {
        minWidth: '2rem',
        minHeight: '2rem',
        marginLeft: 'auto'
    },
    customIconText: {
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.text.default,
        fontFamily: theme.body.B1.fontFamily,
        fontSize: theme.title.h2.fontSize,
        fontWeight: theme.title.h1.fontWeight,
        letterSpacing: theme.title.h3.letterSpacing,
        gap: '0.5rem'
    },
    minWidth: {
        minWidth: '1em'
    },
    maskShareIcon: {
        maskSize: '100%',
        webkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        minWidth: '3rem',
        minHeight: '3rem',
        maskImage: `url(${ShareIcon})`,
        background: theme.palette.text.secondaryText,
        marginLeft: 'auto'
    },
    labelListValue:{
      marginLeft:'5rem'
    }
});

export default appWidgetInsightsStyle;
