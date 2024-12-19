import { alpha } from '@material-ui/core';

const appNavBarStyle = (theme) => ({
    grow: {
        flexGrow: 1
    },
    customerCodxLogo: {
        height: theme.spacing(6),
        fill: theme.palette.primary.contrastText + ' !important',
        borderRadius: '2%'
    },
    codxLogo: {
        height: theme.spacing(4),
        fill: theme.palette.primary.contrastText + ' !important'
    },
    appNavBarTitle: {
        color: theme.palette.text.titleText,
        fontSize: theme.title.h1.fontSize,
        fontWeight: theme.title.h1.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing,
        lineHeight: theme.layoutSpacing(36),
        fontFamily: theme.title.h1.fontFamily,
        textTransform: theme.title.h1.textTransform
    },
    appNavBarScreenName: {
        fontSize: theme.layoutSpacing(20),
        fontWeight: 200,
        borderLeft: '1px solid ' + theme.palette.text.titleText,
        marginLeft: '5px',
        paddingLeft: '5px'
    },
    appBarContainer: {
        backgroundColor: theme.palette.primary.dark
    },
    applicationTitle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        marginLeft: '2.32rem',
        marginRight: '1.95rem',
        position: 'relative',
        '&:before': {
            position: 'absolute',
            content: '""',
            width: 'calc(100%)',
            height: '1px',
            backgroundColor: theme.palette.separator.grey,
            bottom: '1px',
            left: '-0.9rem'
        }
    },
    applicationTitle1: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginLeft: '2.32rem',
        marginRight: '1.95rem',
        position: 'relative',
        '&:before': {
            position: 'absolute',
            content: '""',
            width: 'calc(100%)',
            height: '1px',
            backgroundColor: theme.palette.separator.grey,
            bottom: 0,
            left: '-0.6rem',
            '@media (min-width: 2000px)': {
                height: '2px'
            }
        }
    },
    appBar: {
        width: 'calc(100% - ' + theme.spacing(34) + ')',
        marginLeft: theme.spacing(32),
        marginRight: theme.spacing(2),
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        borderBottom: '1px solid ' + alpha(theme.palette.border.dashboard, 0.4),
        boxShadow: 'none',
        backgroundColor: theme.palette.primary.dark
    },
    appBarNoSideNav: {
        width: '100%',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        // borderBottom: '1px solid rgba(151, 151, 151, 0.4)',
        boxShadow: 'none',
        backgroundColor: theme.palette.primary.dark,
        height: '5.4rem',
        '& .MuiToolbar-root': {
            minHeight: '5.4rem'
        }
    },
    pageTitle: {
        padding: theme.spacing(0, 0, 0, 1)
    },
    appNavBarCodxLogo: {
        '&:hover': {
            opacity: '0.75'
        }
    },
    appNavBarExitConfigureButton: {
        marginLeft: theme.spacing(2)
    },
    appNavBarExitConfigureButtonLabel: {
        fontSize: '1rem !important'
    },
    appNavBarTitleBreadcrumbIcon: {
        margin: theme.spacing(0, 1)
    },
    customerLogoWrapper: {
        width: '24rem',
        display: 'flex',
        alignItems: 'center'
    },
    customerLogoImg: {
        height: '7rem',
        borderRadius: '2%'
    },
    envBanner: {
        fontSize: '1.6rem',
        color: theme.palette.primary.dark,
        backgroundColor: theme.palette.background.envLabel,
        borderColor: theme.palette.primary.light,
        fontWeight: '600',
        textAlign: 'center',
        textTransform: 'uppercase',
        '& svg': {
            color: theme.palette.primary.dark,
            transform: 'scale(1.5)',
            marginRight: theme.spacing(1)
        },
        borderRadius: theme.spacing(0.5),
        marginRight: theme.spacing(2),
        padding: theme.spacing(0.2, 4),
        minWidth: 'fit-content',
        marginLeft: '1rem'
    },
    envBannerProd: {
        backgroundColor: theme.palette.background.prodEnvLabel
    },
    dataScoutHolder: {
        display: 'flex',
        gap: '1.5rem',
        marginRight: '2rem'
    },
    dataScoutButtonHolder: {
        display: 'flex',
        gap: '0.25rem',
        alignItems: 'center',
        fontSize: '2rem',
        fontWeight: 500,
        color: theme.palette.text.contrastText,
        cursor: 'pointer'
    },
    dataScoutIcon: {
        height: '2.5rem',
        width: '2.5rem',
        fill: theme.palette.text.contrastText
    },
    configurations: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.layoutSpacing(13)
    },
    toolBar: {
        display: 'flex',
        '&.MuiToolbar-root': {
            alignItems: 'normal'
        },
        '&.MuiToolbar-gutters': {
            paddingLeft: '0',
            paddingRight: '0'
        }
    },
    toolbarSection: {
        width: '24rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: `1.5px solid ${theme.palette.text.default}30`
    },
    mainLogo: {
        width: '17.5%',
        maxWidth: '17.84%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        '& path': {
            fill: theme.palette.primary.contrastText
        },
        '&:after': {
            position: 'absolute',
            top: 'calc(100% - 115%)',
            content: '""',
            width: '1px',
            height: '100%',
            backgroundColor: theme.palette.separator.grey,
            right: '-1px'
        },
        '&:before': {
            position: 'absolute',
            content: '""',
            width: 'calc(100% - 9%)',
            height: '1px',
            backgroundColor: theme.palette.separator.grey,
            bottom: 0,
            marginLeft: '1.7rem',
            right: '1.27rem'
        }
    },
    mainLogoCollapsed: {
        width: '13.125% !important'
    },
    mainLogo1Collapsed: {
        width: 'auto !important',
        paddingRight: theme.layoutSpacing(20)
    },
    mainLogo1: {
        width: '17.5%',
        maxWidth: '17.84%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        '&:after': {
            position: 'absolute',
            top: 'calc(100% - 115%)',
            content: '""',
            width: '1px',
            height: '100%',
            backgroundColor: theme.palette.separator.grey,
            right: '-1px'
        },
        '&:before': {
            position: 'absolute',
            content: '""',
            width: '100%',
            height: '1px',
            backgroundColor: theme.palette.separator.grey,
            bottom: 0,
            marginLeft: '1.7rem'
        }
    },
    mainLogo2: {
        width: '17.5%',
        maxWidth: '17.84%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        '&:before': {
            position: 'absolute',
            content: '""',
            width: '100%',
            height: '1px',
            backgroundColor: theme.palette.separator.grey,
            bottom: 0,
            marginLeft: '1.7rem'
        }
    },
    configurationSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5045rem'
    },
    appName: {
        marginLeft: '0rem'
    },
    profileIcon: {
        width: theme.layoutSpacing(30),
        height: theme.layoutSpacing(30),
        padding: 0,
        background: 'transparent',
        '& circle': {
            stroke: theme.palette.text.default
        },
        '& path': {
            stroke: theme.palette.text.default
        }
    },
    iconButton: {
        padding: 0,
        margin: 0,
        background: 'transparent',
        marginRight: '0.5rem',
        '&:hover': {
            background: 'transparent'
        }
    },
    configureIcon: {
        width: '2rem',
        height: '2rem',
        fill: theme.palette.text.default
    },
    searchIcon: {
        width: '2rem',
        height: '2rem',
        color: theme.palette.text.default
    },
    mainLogoLink: {
        marginLeft: '3.09rem'
    },
    hover: {
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        '&:hover': {
            backgroundColor: theme.palette.background.menuItemHover,
            borderRadius: '100%'
        }
    },
    separtor: {
        width: '1px',
        height: '3.25rem',
        minHeight: '3.25rem',
        backgroundColor: theme.palette.separator.grey
    },
    box: {
        margin: 0
    },
    navBarIcon: {
        width: '4.5rem',
        height: '4.5rem',
        padding: '1rem',
        color: theme.palette.text.default,
        fill: theme.palette.text.default,
        opacity: 0.6
    },
    iconTooltip: {
        fontSize: '1.6rem',
        padding: '0.4rem 1rem',
        position: 'relative',
        top: '-2rem',
        left: '0.5rem',
        backgroundColor: theme.Toggle.DarkIconBg,
        '@media(max-width:1500px)': {
            top: '-3rem'
        }
    },
    arrow: {
        '&:before': {
            backgroundColor: theme.Toggle.DarkIconBg
        }
    },
    hoverChatGpt: {
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    advancedFeatures: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.layoutSpacing(8),
        '& span': {
            fontFamily: 'Graphik',
            fontWeight: '500',
            fontSize: theme.layoutSpacing(18),
            lineHeight: theme.layoutSpacing(23.94),
            letterSpacing: theme.layoutSpacing(0.5),
            color: theme.palette.text.default,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: '70%',
            '& svg': {
                width: theme.layoutSpacing(22),
                height: theme.layoutSpacing(22),
                fill: theme.palette.text.default,
                fontWeight: '500',
                paddingLeft: theme.layoutSpacing(4)
            }
        }
    },
    hoverAdvanceFeat: {
        cursor: 'pointer',
        backgroundColor: `${theme.palette.background.menuItemFocus}99`
    },
    navLink: {
        maxHeight: theme.layoutSpacing(44),
        padding: `${theme.layoutSpacing(10.5)} ${theme.layoutSpacing(13.9)}`,
        '&:last-child': {
            paddingTop: theme.layoutSpacing(7)
        }
    },
    sidebarLinkText: {
        fontFamily: theme.body.B5.fontFamily,
        fontSize: theme.layoutSpacing(13.1),
        lineHeight: theme.layoutSpacing(18),
        lineHeight: theme.layoutSpacing(16),
        fontWeight: '400',
        color: theme.palette.text.default
    },
    advancedIconRoot: {
        minWidth: theme.layoutSpacing(35)
    },
    alertIcon: {
        stroke: theme.palette.text.default + '!important',
        width: '2.1rem',
        height: '2.1rem'
    },
    popover: {
        pointerEvents: 'none'
    },
    popoverContent: {
        pointerEvents: 'auto'
    },
    moreIcon: {
        width: theme.layoutSpacing(22),
        height: theme.layoutSpacing(22),
        '&:hover': {
            backgroundColor: theme.palette.background.menuItemHover
        }
    },
    toolIcon: {
        width: theme.layoutSpacing(18),
        height: theme.layoutSpacing(18),
        '&:hover': {
            backgroundColor: theme.palette.background.menuItemHover
        }
    },
    menuItemLink: {
        padding: `${theme.layoutSpacing(10.5)} ${theme.layoutSpacing(13.9)}`,
        '&:hover': {
            backgroundColor: theme.palette.background.menuItemHover
        },
        '&:last-child': {
            paddingTop: theme.layoutSpacing(7)
        }
    },
    selectedMoreMenu: {
        borderRadius: '50%',
        backgroundColor: theme.palette.background.menuItemFocus
    },
    selected: {
        backgroundColor: theme.palette.background.menuItemFocus
    },
    separtorLine: {
        border: `1px solid ${theme.palette.border.loginGrid}`,
        borderBottom: 'none',
        width: 'calc(100% - 16px)',
        marginTop: 0,
        marginBottom: 0
    },
    topnav_mainLogo: {
        '&:before': {
            position: 'absolute',
            content: '""',
            width: 'calc(100% - 1%)',
            height: '1px',
            backgroundColor: theme.palette.separator.grey,
            bottom: '1px',
            marginLeft: '1.7rem',
            right: theme.layoutSpacing(-15)
        }
    },
    noWidgetsMsgWrapper: {
        padding: theme.layoutSpacing(12, 24, 12, 24),
        fontSize: theme.layoutSpacing(16),
        fontWeight: 500,
        lineHeight: theme.layoutSpacing(19),
        fontFamily: theme.body.B1.fontFamily,
        letterSpacing: theme.layoutSpacing(0.5)
    },
    snackbarPosition: {
        right: theme.layoutSpacing(530),
        top: theme.layoutSpacing(70)
    }
});

export default appNavBarStyle;
