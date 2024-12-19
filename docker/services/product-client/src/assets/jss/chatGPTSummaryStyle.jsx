import backImg from 'assets/img/Bulb_Insight_BG.svg';
import darkBackground from 'assets/img/dark_login_bg.png';
const chatGPTSummaryStyle = (theme) => ({
    chatGPTResponseContainer: {
        position: 'absolute',
        top: '6rem',
        right: '3rem',
        backgroundColor: theme.palette.primary.dark,
        maxWidth: 'none',
        width: theme.spacing(75),
        zIndex: 1000,
        border:
            localStorage.getItem('codx-products-theme') === 'light' ? '1px solid #CFB3CD' : 'none',
        boxShadow:
            localStorage.getItem('codx-products-theme') === 'light'
                ? '0px 2px 4px 0px #CFB3CD'
                : '-2px 2px 10px 0px #BF99BD4D',
        background: 'transparent',
        height: 'auto',
        maxHeight: '93vh',
        overflow: 'hidden',
        minHeight: '63rem',
        '&::before': {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            content: '""',
            backroundRepeat: 'no-repeat',
            backgroundImage: `url(${
                localStorage.getItem('codx-products-theme') === 'light' ? backImg : darkBackground
            })`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -1,
            position: 'absolute',
            transform:
                localStorage.getItem('codx-products-theme') === 'light'
                    ? 'rotate(0deg)'
                    : 'rotate(270deg) scaleX(1.6)'
        }
    },
    chatGPTErrorContainer: {
        borderColor: '#ff655a'
    },
    chatGPTResponseTitle: {
        color: theme.palette.text.default,
        cursor: 'move',
        fontSize: theme.title.h2.fontSize,
        fontWeight: theme.title.h6.fontWeight,
        letterSpacing: '1.5px',
        fontFamily: theme.body.B5.fontFamily,
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    chatGPTResponseBody: {
        padding: '1rem 1.8rem 1rem 1.8rem',
        fontSize: '1.5rem',
        color: theme.palette.text.revamp,
        margin: '1.6rem',
        maxHeight: '75vh',
        height: 'auto',
        overflowY: 'auto',
        background: theme.palette.background.pureWhite,
        '& span': {
            fontFamily: theme.body.B5.fontFamily
        }
    },
    chatGptResponseIconHolder: {
        float: 'right',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    chatGPTResponseClose: {
        cursor: 'pointer',
        height: '2.5rem',
        width: '2.5rem',
        fill: theme.palette.icons.closeIcon,
        '&:hover': {
            opacity: '0.75'
        }
    },
    chatGPTResponseExpand: {
        cursor: 'pointer',
        height: '2rem',
        width: '2rem',
        '&:hover': {
            opacity: '0.75'
        },
        stroke: `${theme.palette.icons.closeIcon} !important`,
        fill: `${theme.palette.icons.closeIcon} !important`
    },
    chatGPTResponseVerify: {
        position: 'absolute',
        top: theme.spacing(0.5),
        right: theme.spacing(6),
        cursor: 'pointer',
        color: theme.Toggle.DarkIconBg,
        '&:hover': {
            opacity: '0.75'
        }
    },
    chatGPTResponseRefresh: {
        position: 'absolute',
        top: theme.spacing(0.5),
        right: theme.spacing(3),
        cursor: 'pointer',
        color: theme.Toggle.DarkIconBg,
        '&:hover': {
            opacity: '0.75'
        }
    },
    chatGPTResponseVerified: {
        float: 'left',
        color: theme.palette.success.main,
        marginLeft: theme.spacing(2)
    },
    chatGPTResponseVerifiedLabel: {
        float: 'left',
        fontSize: '1.25rem',
        margin: theme.spacing(0.5),
        color: theme.palette.text.titleText
    },
    chatGPTResponseRatingContainer: {
        float: 'right',
        color: theme.palette.text.titleText,
        margin: theme.spacing(0, 2),
        width: theme.spacing(15)
    },
    chatGPTResponseNoRatingLabel: {
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: theme.palette.text.titleText,
        '&:hover': {
            opacity: '0.5'
        }
    },
    chatGPTResponseRatingBody: {},
    chatGPTRatingIcon: {
        float: 'left',
        color: theme.palette.icons.ratingColor
    },
    chatGPTRatingIconBorder: {
        float: 'left',
        color: theme.palette.text.default
    },
    chatGPTResponseRegenerate: {
        position: 'absolute',
        top: theme.spacing(0.5),
        right: theme.spacing(6),
        cursor: 'pointer',
        color: theme.Toggle.DarkIconBg,
        '&:hover': {
            opacity: '0.75'
        }
    },
    chatGPTIcon: {
        cursor: 'pointer',
        color: theme.Toggle.DarkIconBg,
        width: '2.8rem',
        height: '2.8rem',
        fill: `${theme.palette.text.default}!important`
    },
    chatGPTResponseRatingDetails: {
        position: 'absolute',
        top: theme.spacing(12),
        right: theme.spacing(2),
        height: theme.spacing(45),
        width: theme.spacing(30),
        border: '1px solid',
        borderColor: theme.Toggle.DarkIconBg,
        borderRadius: theme.spacing(0.5),
        backgroundColor: theme.palette.primary.dark
    },
    chatGPTResponseRatingDetailsHeader: {
        margin: theme.spacing(2),
        fontSize: '1.5rem',
        color: theme.palette.text.titleText
    },
    chatGPTResponseRatingDetailsItem: {},
    chatGPTResponseRatingDetailsCheckbox: {
        float: 'left',
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(2),
        cursor: 'pointer',
        '&:hover': {
            opacity: '0.5'
        },
        '& svg': {
            cursor: 'pointer'
        }
    },
    chatGPTResponseRatingDetailsItemLabel: {
        float: 'left',
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(1)
    },
    chatGPTResponseRatingDetailsItemCount: {
        float: 'right',
        marginRight: theme.spacing(2),
        marginTop: theme.spacing(1),
        fontSize: '1.5rem',
        color: theme.palette.text.titleText
    },
    chatGPTResponseRatingDetailsUserRating: {
        margin: theme.spacing(2)
    },
    chatGPTResponseRatingDetailsUserRatingButton: {
        marginLeft: theme.spacing(1)
    },
    chatGPTConfigureTitle: {
        color: theme.palette.text.default,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`,
        cursor: 'move',
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontWeight: theme.title.h6.fontWeight,
        fontSize: '2.2rem'
    },
    aiInsightsContainer: {
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        '&:hover': {
            backgroundColor: `${theme.palette.background.menuItemFocus}99`,
            borderRadius: '100%'
        }
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem',
        margin: '1.6rem'
    },
    formTitle: {
        fontWeight: theme.title.h6.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.title.h2.fontSize,
        color: theme.palette.text.default,
        margin: 0
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        fontWeight: theme.title.h6.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.button.BU1.fontSize,
        color: theme.palette.text.default,
        margin: 0,
        '& p': {
            margin: 0
        }
    },
    radio: {
        '& svg': {
            fontSize: '1.4rem'
        }
    },
    radioText: {
        fontSize: '1.4rem'
    },
    textField: {
        background: theme.palette.background.white,
        fontSize: theme.title.h2.fontSize,
        fontWeight: theme.title.h1.fontWeight,
        letterSpacing: '0.5px',
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.default,
        '&  .MuiOutlinedInput-multiline': {
            padding: 0
        },
        '& .MuiInputBase-input': {
            height: '2.8rem',
            padding: '1rem',
            fontSize: theme.title.h3.fontSize,
            lineHeight: 'normal'
        },
        '& ::placeholder': {
            fontSize: theme.title.h3.fontSize,
            fontWeight: theme.title.h1.fontWeight,
            letterSpacing: '0.5px',
            fontFamily: theme.title.h1.fontFamily,
            color: '#989C9C'
        }
    },
    emptyStateHolder2: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        marginTop: '4rem',
        marginBottom: '2rem'
    },
    '@keyframes glow': {
        '0%': {
            opacity: 1
        },
        '25%': {
            opacity: 0.75
        },
        '50%': {
            opacity: 0.5
        },
        '75%': {
            opacity: 0.6
        },
        '100%': {
            opacity: 0.75
        }
    },
    '@keyframes loading`': {
        '100%': {
            transform: ' translateX(100%)'
        }
    },
    emptyStateHolder: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    loading: {
        position: 'relative',
        background: 'red',
        '&::after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            transform: 'translateX(-100px)',
            background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.05), transparent)',
            animation: '$loading 1s infinite'
        }
    },
    emptyState1: {
        width: '100%',
        height: '2.4rem',
        background: theme.palette.background.pureWhite
    },
    emptyState2: {
        width: '75%',
        height: '2.4rem',
        background: theme.palette.background.pureWhite
    },
    emptyState3: {
        width: '50%',
        height: '2.4rem',
        background: theme.palette.background.pureWhite
    },
    loadingContainer: {
        background: 'transparent',
        padding: '1rem 1.8rem 1rem 0rem',
        fontSize: '1.5rem',
        color: theme.palette.text.titleText,
        margin: '1.6rem',
        marginBottom: '0rem',
        maxHeight: 'auto',
        overflowY: 'auto'
    },
    verifyContainer: {
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        color: theme.palette.text.default,
        cursor: 'pointer',
        fontSize: theme.title.h3.fontSize,
        fontWeight: theme.title.h1.fontWeight,
        letterSpacing: '1.5px',
        fontFamily: theme.title.h1.fontFamily
    },
    chatGPTResponseVerifyIcon: {
        cursor: 'pointer',
        color: theme.Toggle.DarkIconBg,
        height: '2rem',
        width: '2rem',
        '&:hover': {
            opacity: '0.75'
        }
    },
    chatGPTResponseVerifiedIcon: {
        cursor: 'pointer',
        color: 'green',
        height: '2rem',
        width: '2rem',
        '&:hover': {
            opacity: '0.75'
        }
    },
    iconTooltip: {
        fontSize: '1.6rem',
        padding: '0.4rem 1rem',
        position: 'relative',
        top: '-2rem',
        left: '0.5rem',
        backgroundColor:
            localStorage.getItem('codx-products-theme') === 'light'
                ? theme.Toggle.DarkIconBg
                : theme.palette.background.default,
        '@media(max-width:1500px)': {
            top: '-3rem'
        }
    },
    arrow: {
        '&:before': {
            backgroundColor:
                localStorage.getItem('codx-products-theme') === 'light'
                    ? theme.Toggle.DarkIconBg
                    : theme.palette.background.default
        }
    },
    chatGPTResponseBodyMinimize: {
        padding: '1rem 1.8rem 1rem 1.8rem',
        fontSize: '1.5rem',
        color: theme.palette.text.titleText,
        margin: '1.6rem',
        maxHeight: '60rem',
        overflowY: 'auto',
        background: theme.palette.background.pureWhite
    },
    generateInsightsButton: {
        float: 'right',
        marginTop: '3rem'
    },
    chatGPTResponseRatingContainerRedesign: {
        color: theme.palette.text.titleText,
        margin: theme.spacing(1, 2),
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: 0
    },
    ratingContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    ratingHeading: {
        color: theme.palette.text.default,
        fontSize: theme.title.h3.fontSize,
        fontWeight: theme.title.h1.fontWeight,
        letterSpacing: '1.5px',
        fontFamily: theme.title.h1.fontFamily,
        marginRight: '1rem'
    },
    shareIcon: {
        height: '2rem',
        width: '2rem',
        color: theme.palette.text.default,
        pointerEvents: 'none'
    },
    ratingDivider: {
        height: '1.6rem',
        width: '1px',
        background: theme.IndustryDashboard.border.light,
        marginRight: '1rem',
        marginLeft: '1rem',
        pointerEvents: 'none'
    },
    copyIcon: {
        height: '2rem',
        width: '2rem',
        stroke: theme.palette.text.default,
        marginLeft: '1rem',
        pointer: 'cursor'
    },
    responseOverlay: {
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1300,
        backgroundColor: theme.palette.background.aiInsightOverlay
    }
});

export default chatGPTSummaryStyle;
