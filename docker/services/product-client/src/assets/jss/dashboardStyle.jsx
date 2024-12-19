import { alpha } from '@material-ui/core';
import background from 'assets/img/login_bg.svg';
import darkBackground from 'assets/img/dark_login_bg.png';
const dashboardStyle = (theme) => ({
    bodyContainer: {
        height: '100%',
        position: 'relative',
        background:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? `url(${darkBackground})`
                : theme.IndustryDashboard.background.color,
        backgroundSize: 'cover'
    },
    functionBodyContainer: {
        height: '100%',
        position: 'relative',
        background:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? `url(${darkBackground})`
                : `url(${background})`,
        backgroundSize: 'cover',
        '@media (max-height: 600px)': {
            paddingBottom: '3rem'
        }
    },
    body: {
        height: 'calc(100% - ' + theme.spacing(12.4) + ')',
        marginBottom: theme.spacing(6.25),
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
    },
    customerCodxLogo: {
        height: theme.spacing(6),
        fill: theme.palette.primary.contrastText + ' !important',
        borderRadius: '2%'
    },
    nucliosLogoWrapper: {
        minWidth: theme.layoutSpacing(234)
    },
    codxLogo: {
        height: theme.spacing(4),
        margin: theme.spacing(1, 0),
        fill: theme.palette.primary.contrastText + ' !important'
    },
    toolbarIcons: {
        height: theme.spacing(2.5),
        fill: theme.palette.icons.color + ' !important'
    },
    grow: {
        flexGrow: 1
    },
    industryTitle: {
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(2)
    },
    gridBody: {
        padding: theme.spacing(2),
        height: '100%'
    },
    industryCard: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.text.titleText,
        border: '1px solid ' + theme.palette.primary.contrastText,
        '&:hover': {
            boxShadow: '4px 6px 12px 6px ' + theme.palette.shadow.dark,
            border: '1px solid' + theme.palette.border.color,
            transform: 'scale(1.02)'
        }
    },
    industryAvatar: {
        backgroundColor: theme.palette.primary.dark,
        '& svg path': {
            fill: theme.palette.primary.contrastText + ' !important'
        },
        '& svg g': {
            fill: theme.palette.primary.contrastText + ' !important'
        }
    },
    industryAppBar: {
        boxShadow: 'none',
        position: 'relative',
        background: 'transparent',
        '& .MuiToolbar-root': {
            minHeight: '6.4rem',
            padding: `0 ${theme.layoutSpacing(32)} 0 ${theme.layoutSpacing(32)}`
        }
    },
    functionCard: {
        height: '100%',
        backgroundColor: theme.palette.primary.light
    },
    speedDial: {
        position: 'absolute',
        '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
            bottom: theme.spacing(2),
            right: theme.spacing(2)
        },
        '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
            top: theme.spacing(2),
            left: theme.spacing(2)
        }
    },
    functionCardHeader: {},
    functionCardHeaderIcon: {
        float: 'right',
        color: theme.palette.primary.contrastText,
        textAlign: 'center',
        opacity: '0.75',
        '& img': {
            height: theme.spacing(6),
            fill: 'white'
        },
        '& i': {
            fontSize: theme.spacing(8)
        },
        padding: theme.spacing(2, 2, 0, 0)
    },
    functionCardHeaderLabel: {
        float: 'left',
        width: '70%',
        fontSize: '2rem',
        fontStyle: 'italic',
        color: theme.palette.primary.contrastText,
        padding: theme.spacing(2, 0, 0, 2),
        minHeight: theme.spacing(6)
    },
    functionCardContent: {
        opacity: '0.85',
        margin: theme.spacing(2),
        color: theme.palette.text.default
    },
    textColor: {
        color: theme.palette.text.default
    },
    iconButton: {
        color: theme.palette.text.default,
        '&:hover': {
            backgroundColor: 'unset'
        }
    },
    appSettingsIcon: {
        marginLeft: 'auto'
    },
    product: {
        height: theme.spacing(20),
        position: 'relative'
    },
    productContainer: {
        padding: theme.spacing(1.25)
    },
    productLogoContainer: {
        float: 'left'
    },
    productLogo: {
        width: theme.spacing(9.375),
        height: theme.spacing(9.375),
        backgroundColor: theme.palette.primary.main,
        border: '4px solid ' + theme.palette.primary.main,
        borderRadius: '50%',
        margin: theme.spacing(0.625) + ' auto',
        overflow: 'hidden',
        transition: 'all 0.2s',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.logo.hover,
            border: '4px solid ' + theme.palette.logo.hover
        }
    },
    productActionContainer: {
        float: 'right'
    },
    productLink: {
        marginBottom: theme.spacing(0.625)
    },
    productContactButton: {},
    toolbarInput: {
        width: theme.spacing(40),
        height: theme.spacing(3.5),
        background: theme.palette.primary.dark,
        borderRadius: theme.spacing(3.5),
        padding: theme.spacing(1, 2),
        color: theme.palette.text.default,
        fontSize: '1.5rem'
    },
    toolbarInputlight: {
        width: theme.spacing(40),
        height: theme.spacing(3.5),
        background: theme.palette.primary.light,
        borderRadius: theme.spacing(3.5),
        padding: theme.spacing(1, 2),
        color: theme.palette.text.default,
        fontSize: '1.5rem'
    },
    toolbarSearch: {
        position: 'relative',
        margin: theme.spacing(0, 2)
    },
    toolbarSearchIcon: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1.5)
    },
    toolbarCloseSearchIcon: {
        position: 'absolute',
        right: theme.spacing(7),
        top: theme.spacing(1.5),
        cursor: 'pointer',
        color: theme.palette.text.default,
        '&:hover': {
            color: theme.palette.primary.contrastText
        }
    },
    toolbarSearchOptionsContainer: {
        position: 'absolute',
        width: theme.spacing(44),
        maxHeight: theme.spacing(40),
        overflow: 'auto',
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.text.default,
        padding: theme.spacing(2),
        borderRadius: theme.spacing(1),
        zIndex: 1000,
        boxShadow: theme.shadows[2]
    },
    toolbarSearchOption: {
        position: 'relative',
        borderBottom: '1px solid ' + theme.palette.border.dashboard,
        paddingBottom: theme.spacing(2),
        marginBottom: theme.spacing(2),
        cursor: 'pointer',
        '&:hover': {
            color: theme.palette.primary.contrastText
        }
    },
    toolbarSearchOptionIcon: {
        position: 'absolute',
        bottom: '50%',
        right: theme.spacing(1)
    },
    toolbarSearchOptionLast: {
        position: 'relative',
        paddingBottom: theme.spacing(2),
        cursor: 'pointer',
        '&:hover': {
            color: theme.palette.primary.contrastText
        }
    },
    toolbarSearchOptionApp: {
        fontSize: '1.8rem',
        paddingBottom: theme.spacing(2)
    },
    toolbarSearchOptionFunction: {
        backgroundColor: alpha(theme.palette.background.dashboard, 0.07),
        fontSize: '1.5rem',
        padding: theme.spacing(1),
        border: '1px solid' + alpha(theme.palette.border.toolBar, 0.53),
        borderRadius: theme.spacing(0.5),
        float: 'left'
    },
    themeIcons: {
        marginLeft: theme.spacing(7.5),
        '& .MuiButtonGroup-root': {
            borderRadius: theme.spacing(22.5),
            height: theme.spacing(4.25),
            border: '1px solid ' + theme.palette.border.colorWithOpacity
        },
        '& .MuiButtonBase-root': {
            padding: theme.spacing(1)
        },
        '& .MuiButtonGroup-groupedHorizontal:not(:last-child)': {
            borderTopLeftRadius: theme.spacing(22.5),
            borderBottomLeftRadius: theme.spacing(22.5)
        },
        '& .MuiButtonGroup-groupedHorizontal:not(:first-child)': {
            borderTopRightRadius: theme.spacing(22.5),
            borderBottomRightRadius: theme.spacing(22.5)
        },
        '& .MuiButton-contained': {
            borderRadius: theme.spacing(22.5),
            border: '2px solid' + theme.palette.border.color,
            backgroundColor: 'unset'
        },
        '& .MuiButton-outlined': {
            border: 'unset'
        }
    },
    animateAppBar: {
        visibility: 'hidden',
        animation: 'textAnimation 0s 7s forwards'
    },

    codxLogoAnimation: {
        zIndex: '9998 !important',
        visibility: 'hidden',
        height: theme.spacing(4),
        fill: theme.palette.primary.contrastText + ' !important',
        position: 'absolute',
        top: '50%',
        left: ' 50%',
        transform: 'translate(-50%, -50%)',
        animationName: 'codxLogoZoomIn',
        animationDuration: '3s',
        animationDelay: '4s'
    },
    triggerNavButton: {
        padding: theme.spacing(0.1, 2),
        backgroundColor:
            localStorage.getItem('codx-products-theme') !== 'dark'
                ? theme.palette.text.default
                : theme.palette.primary.contrastText,
        color:
            localStorage.getItem('codx-products-theme') !== 'dark'
                ? theme.palette.text.peachText
                : theme.palette.icons.darkTheme,
        marginLeft: theme.spacing(2),
        '& svg': {
            color:
                localStorage.getItem('codx-products-theme') !== 'dark'
                    ? theme.palette.text.peachText
                    : theme.palette.icons.darkTheme
        },
        lineHeight: '3rem'
    },
    advancedFeatureLogo: {
        width: '2.4rem',
        height: '2.4rem',
        fill: theme.palette.primary.contrastText + ' !important',
        stroke: theme.palette.primary.contrastText + ' !important'
    },
    envBadge: {
        color: theme.palette.primary.dark,
        background: theme.palette.background.envLabel,
        verticalAlign: 'middle',
        padding: '0.2rem 1rem',
        borderRadius: '0.4rem',
        fontSize: '1.2rem',
        textTransform: 'uppercase',
        fontWeight: '600',
        margin: '0 1em'
    },
    prodBadge: {
        background: theme.palette.background.prodEnvLabel
    },
    profileIcon: {
        width: theme.layoutSpacing(30),
        height: theme.layoutSpacing(30),
        padding: 0,
        background: 'transparent',
        '& circle': {
            stroke: theme.palette.text.revamp
        },
        '& path': {
            stroke: theme.palette.text.revamp
        }
    },
    dashboardContainer: {
        height: '100%',
        position: 'relative',
        '@media (max-height: 600px)': {
            height: 'calc(100% - 7rem)'
        },
        '@media (max-height: 560px)': {
            height: 'calc(100% - 13rem)'
        }
    },
    titleWrapper: {
        position: 'relative',
        paddingLeft: theme.layoutSpacing(24),
        '&:before': {
            position: 'absolute',
            content: '""',
            width: '1px',
            height: '100%',
            backgroundColor: theme.palette.separator.grey,
            bottom: 0,
            left: '0'
        }
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
    gridView: {
        position: 'relative',
        '&:before': {
            position: 'absolute',
            content: '""',
            width: theme.layoutSpacing(247),
            height: '1px',
            backgroundColor: theme.palette.separator.grey,
            bottom: 0,
            left: theme.layoutSpacing(8)
        },
        '&:after': {
            position: 'absolute',
            content: '""',
            width: `calc(100% - ${theme.layoutSpacing(289)})`,
            height: '1px',
            backgroundColor: theme.palette.separator.grey,
            bottom: 0,
            left: theme.layoutSpacing(277)
        }
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
    navBarIcon: {
        width: '4.5rem',
        height: '4.5rem',
        padding: '1rem',
        color: theme.palette.text.default,
        fill: theme.palette.text.default,
        opacity: 0.6
    },
    hover: {
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        marginRight: '1rem',
        marginLeft: '.5rem',
        '&:hover': {
            backgroundColor: `${theme.palette.text.default}10`,
            borderRadius: '100%'
        }
    },
    storyIcon: {
        marginRight: '1rem',
        marginLeft: '2.5rem',
        cursor: 'pointer'
    },
    separtor: {
        width: '1px',
        height: '3.25rem',
        minHeight: '3.25rem',
        backgroundColor: theme.palette.separator.grey
    },
    projectBtn: {
        backgroundColor: 'transparent',
        color: theme.palette.text.default,
        border: `1px solid ${theme.palette.text.default}`,
        boxShadow: 'none'
    }
});

export default dashboardStyle;
