import zIndex from '@material-ui/core/styles/zIndex';
import codxNewLogo from 'assets/img/codxNewLogo.svg';

const appStyle = (theme) => ({
    domContainer: {
        height: '100%',
        position: 'relative',
        background: theme.palette.background.pureWhite
    },
    bodyContainer: {
        height: '100%',
        position: 'relative',
        '@media (max-height: 600px)': {
            height: 'calc(100% - 6rem)'
        },
        '@media (max-height: 560px)': {
            height: 'calc(100% - 12rem)'
        }
    },
    body: {
        height: 'calc(100% - ' + theme.spacing(13) + ')',
        marginBottom: theme.spacing(5),
        marginLeft: theme.spacing(30),
        overflowY: 'auto',
        position: 'relative',
        transition: 'all 500ms'
    },
    fullScreenBody: {
        height: 'calc(100% - ' + theme.spacing(13) + ')',
        marginBottom: theme.spacing(5),
        marginLeft: theme.spacing(7),
        overflowY: 'auto',
        position: 'relative',
        transition: 'all 500ms'
    },
    wrapper: {
        display: 'flex',
        height: 'calc(100% - 5.4rem)',
        width: '100%',
        paddingRight: theme.layoutSpacing(16),
        paddingBottom: theme.layoutSpacing(8),
        background: theme.palette.background.paper
    },
    wrapperOne: {
        display: 'flex',
        // flexDirection: 'column',
        height: 'calc(100% - 5.4rem)',
        paddingRight: theme.layoutSpacing(13.9),
        paddingLeft: theme.layoutSpacing(13.9),
        paddingBottom: theme.layoutSpacing(8),
        width: '100%',
        position: 'relative',
        '&:before': {
            position: 'absolute',
            content: '""',
            top: '1%',
            left: theme.layoutSpacing(14),
            height: '97%',
            background: theme.palette.separator.grey,
            width: '1px',
            zIndex: '10000000'
        },
        '&:after': {
            position: 'absolute',
            content: '""',
            top: '1%',
            right: theme.layoutSpacing(14),
            height: '97%',
            background: theme.palette.separator.grey,
            width: '1px',
            zIndex: '10000000'
        }
    },
    topnav_container: {
        width: '100% !important',
        maxHeight: theme.layoutSpacing(45.5)
    },
    bodyContent: {
        height: '100%',
        flex: 1,
        overflow: 'auto',
        background: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        marginTop: theme.layoutSpacing(7),
        marginLeft:'3px'
    },
    topnav_bodyContent: {
        borderRight: 'none'
    },
    codxLogo: {
        height: theme.spacing(4),
        margin: theme.spacing(1, 0),
        fill: theme.palette.primary.contrastText + ' !important'
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start'
    },
    appMainLoader: {
        marginTop: theme.spacing(2)
    },
    storiesActionItems: {
        display: 'flex',
        alignItems: 'center'
    },
    selectedItems: {
        fontWeight: 500,
        fontSize: theme.spacing(2.5),
        color: theme.palette.text.titleText,
        marginRight: theme.spacing(2)
    },
    createReport: {
        marginRight: theme.spacing(2),
        cursor: 'pointer',
        '& circle': {
            fill: theme.palette.background.selected + ' !important',
            stroke: theme.palette.primary.contrastText + ' !important'
        },
        '& path': {
            fill: theme.palette.primary.contrastText + ' !important'
        }
    },
    downloadReport: {
        marginRight: theme.spacing(2),
        '& circle': {
            fill: theme.palette.primary.contrastText + ' !important'
        }
    },
    selectAllButton: {
        transform: 'scale(1.6)',
        padding: 'unset',
        marginRight: theme.spacing(2)
    },
    drawer: {
        width: 'calc(100% - 82.5%)'
    },
    drawerClose: {
        width: '3.025%',
        transition: 'width 300ms ease',
        zIndex: 0
    },
    subScreenBreadCrumb: {
        marginTop: theme.layoutSpacing(7),
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.layoutSpacing(2)
    },
    screen: {
        fontFamily: theme.body.B5.fontFamily,
        fontSize: theme.layoutSpacing(13.1),
        fontWeight: '400',
        lineHeight: theme.layoutSpacing(15.7),
        letterSpacing: theme.layoutSpacing(0.45),
        marginLeft: theme.layoutSpacing(13.9),
        color: theme.palette.text.breadcrumbScreen
    },
    subscreen: {
        fontFamily: theme.body.B5.fontFamily,
        fontSize: theme.layoutSpacing(15.7),
        fontWeight: '500',
        lineHeight: theme.layoutSpacing(15.7),
        letterSpacing: theme.layoutSpacing(0.45),
        color: theme.palette.text.default
    },
    rightIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: theme.layoutSpacing(3.5),
        paddingRight: theme.layoutSpacing(3.5),
        marginTop: theme.layoutSpacing(1),
        '& svg': {
            fontSize: theme.layoutSpacing(14),
            fill: theme.palette.text.default
        }
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(0)}`,
        paddingLeft: theme.layoutSpacing(16),
        paddingRight: theme.layoutSpacing(8),
        justifyContent: 'space-between',
        position: 'absolute',
        left: theme.layoutSpacing(16),
        backgroundColor: theme.palette.background.pureWhite,
        width: '100%',
        bottom: theme.layoutSpacing(4)
    },
    footer_text: {
        color: theme.palette.text.default,
        fontFamily: theme.body.B3.fontFamily,
        fontSize: theme.layoutSpacing(16),
        fontWeight: '500',
        lineHeight: '2.1rem',
        letterSpacing: theme.body.B3.letterSpacing
    },
    footer_version: {
        textTransform: 'uppercase',
        color: theme.palette.text.footerVersion,
        fontFamily: theme.body.B3.fontFamily,
        fontSize: theme.layoutSpacing(14),
        fontWeight: theme.body.B3.fontWeight,
        lineHeight: '2.1rem',
        letterSpacing: theme.body.B3.letterSpacing,
        marginLeft: theme.layoutSpacing(90)
    },
    footer_logo: {
        width: '1.3rem',
        height: '1.3rem',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    maskIcon: {
        maskSize: '100%',
        webkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        minWidth: '1.8rem',
        minHeight: '1.8rem',
        maskImage: `url(${codxNewLogo})`,
        background: theme.palette.text.default
    },
    footer_first: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px'
    },
    topnav_minerva: {
        position: 'absolute',
        left: theme.layoutSpacing(-17),
        bottom: theme.layoutSpacing(50),
        borderRadius: '50%',
        height: theme.layoutSpacing(33),
        width: theme.layoutSpacing(33),
        zIndex: '1000000000',
        backgroundColor: theme.palette.icons.darkTheme,
        display: 'flex',
        justifyContent: 'end',
        paddingRight: theme.layoutSpacing(0.4),
        paddingTop: theme.layoutSpacing(4)
    },
    removeIcon: {
        background: theme.palette.icons.minusIcon,
        width: '15px',
        height: '15px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: theme.layoutSpacing(0),
        top: theme.layoutSpacing(-6),
        cursor: 'pointer',
        '& svg': {
            fill: theme.palette.icons.darkTheme
        }
    },
    topnav_minerva_inView: {
        position: 'absolute',
        left: theme.layoutSpacing(0),
        bottom: theme.layoutSpacing(61),
        zIndex: '1000000000',
        backgroundColor: theme.palette.background.pureWhite
    },
    icon: {
        position: 'absolute',
        left: theme.layoutSpacing(15),
        top: theme.layoutSpacing(7),
        width: '1.75rem',
        height: '2rem',
        '& svg': {
            width: theme.layoutSpacing(16),
            height: theme.layoutSpacing(16)
        }
    },
    topnav_minervaFloat: {
        borderRadius: '50%',
        border: `2px solid ${theme.palette.text.default}`,
        height: theme.layoutSpacing(41.7),
        width: theme.layoutSpacing(41.7),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    flexWrapper: {
        flexDirection: 'row'
    },
    askNucliosContainer: {
        zIndex: 1000,
        margin: 0,
        height: '100%',
        width: '25%'
        // borderLeft: '1px solid #CFB3CD'
    },
    askNucliosFullScreen: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 100000000,
        margin: 0
    },
    appContainerAskNuclios: {
        height: '100%',
        width: '100%',
        // flex: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    // appContainerCol: { height: '100%', width: '100%', display: 'flex', flexDirection: 'column' },
    appContainerRow: { height: '100%', width: '100%', display: 'flex', flexDirection: 'row' },
    appContainerSmall: {
        width: '75% !important'
    },
    appContainerCommentRow: { height: '100%', width: '100%', display: 'flex'},
    appContainerCommentSmall: {
        width: '75% !important'
    },
    commentsTab: {
        color: theme.palette.text.contrastText,
        display: 'flex',
        position: 'absolute',
        right: '1rem',
        // top: "6rem", //
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        fontSize: '2rem',
        fontWeight: '500',
        // marginRight: "1rem",
        padding: '1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        '& svg': {
            width: '2rem',
            height: '2rem',
            stroke: `${theme.palette.text.contrastText} !important`,
            fill: theme.palette.text.constratText
        },
        '&:hover': {
            background: theme.palette.background.selected
        }
    },
    commentsTabOnSelected: {
        color: theme.palette.text.contrastText,
        display: 'flex',
        right: '1rem',
        alignItems: 'center',
        background: '#C9DEF4', 
        position: 'absolute',
        justifyContent: 'center',
        gap: '1rem',
        fontSize: '2rem',
        fontWeight: '500',
        padding: '1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        '& svg': {
            width: '2rem',
            height: '2rem',
            stroke: `${theme.palette.text.contrastText} !important`,
            fill: theme.palette.text.constratText
        },
        '&:hover': {
          background: theme.palette.background.menuItemFocus
      }
    },
    commentAndStoriesPane: {
        width: '100%',
        display: 'flex',
        height: '5rem',
        position: 'relative',
        alignItems: 'center'
    }
});

export default appStyle;
