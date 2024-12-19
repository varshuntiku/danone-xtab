import { alpha, colors } from '@material-ui/core';
import zIndex from '@material-ui/core/styles/zIndex';
import codxNewLogo from 'assets/img/codxNewLogo.svg';

const sidebarStyle = (theme) => ({
    drawer: {
        width: '101.5%',
        flexShrink: 0,
        height: '100%',
        transition: 'all 500ms smooth',
        borderTopRightRadius: '1.5rem',
        position: 'relative',
        top: 1,
        marginLeft: '-0.5%',
        //instead of the psuedo after element on the drawerPaper
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        zIndex: 0
    },
    topnav_drawer: {
        marginLeft: 0
    },
    drawerHidden: {
        width: '100%',
        flexShrink: 0,
        height: '100%',
        transition: 'all 500ms smooth'
    },
    drawerHidden1: {
        width: '100%',
        flexShrink: 0,
        height: '100%',
        transition: 'all 500ms smooth',
        '&:hover': {
            width: 'calc(100% * 5)',
            transition: 'width 600ms ease'
        }
    },
    drawerPaper: {
        width: '100%',
        position: 'relative ',
        height: '100%',
        transition: 'all 500ms smooth',
        overflow: 'hidden',
        '&:hover': {
            '& $drawerIcon': {
                visibility: 'visible'
            }
        },
        // '&:after': {
        //     position: 'absolute',
        //     top: 'calc(100% - 99%)',
        //     left: '98.5%',
        //     content: '""',
        //     width: '1px',
        //     height: '99%',
        //     backgroundColor: theme.palette.separator.grey
        // },
        '&.MuiDrawer-paperAnchorDockedLeft': {
            borderRight: 'none'
        }
    },
    drawerPaperHidden: {
        width: '100%',
        position: 'relative',
        height: '100%',
        transition: 'all 500ms smooth',
        overflow: 'hidden',
        '& $drawerIconHidden': {
            visibility: 'visible'
        },
        '&:after': {
            position: 'absolute',
            top: 'calc(100% - 99%)',
            left: '97%',
            content: '""',
            width: '1px',
            height: '99%',
            backgroundColor: theme.palette.separator.grey
        },
        '&.MuiDrawer-paperAnchorDockedLeft': {
            borderRight: 'none'
        }
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 3),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
        color: theme.palette.primary.contrastText,
        margin: '0 auto'
    },
    codxLogo: {
        height: theme.spacing(4),
        margin: theme.spacing(1, 0),
        fill: theme.palette.primary.contrastText + ' !important'
    },
    advancedFeatureLogo: {
        width: '2.4rem',
        height: '2.4rem',
        fill: theme.palette.primary.contrastText + ' !important',
        stroke: theme.palette.primary.contrastText + ' !important'
    },

    advancedIconRoot: {
        minWidth: '0',
        '& svg': {
            fill: theme.palette.text.default,
            stroke: theme.palette.text.default
        }
    },
    advancedOutlinedIconRoot: {
        minWidth: '0'
    },
    advancedIconRootSelected: {
        minWidth: '6rem',
        '& svg': {
            fill: theme.palette.primary.contrastText,
            stroke: theme.palette.primary.contrastText
        }
    },
   
    customerLogo: {
        position: 'absolute',
        bottom: theme.spacing(10),
        left: theme.spacing(2.5),
        width: theme.spacing(25),
        borderRadius: '25%'
    },
    codxCustomerLogo: {
        height: theme.spacing(6),
        fill: theme.palette.primary.contrastText + ' !important',
        borderRadius: '2%'
    },
    siderbarDivider: {
        backgroundColor: theme.palette.separator.grey,
        margin: theme.spacing(0, 2),
        marginTop: '1.25rem'
    },
    sidebarLinksContainer: {
        height: '100%',
        width: '100%',
        transition: 'all 500ms',
        display: 'flex',
        flexDirection: 'column',
        gap:'2rem',
        padding: 0
    },
    sidebarLinksContainerHidden: {
        transition: 'all 500ms',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
        padding: 0
    },

    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        marginLeft: '-' + theme.spacing(30) + 'px',
        height: '100%',
        transition: 'all 1000ms'
    },
    contentShift: {
        transition: 'all 500ms',
        marginLeft: 0
    },
    selectedNavLink: {
        marginLeft: '1.5rem',
        color: theme.palette.primary.contrastText + ' !important',
        backgroundColor: theme.palette.background.navLinkBackground,
        '&:hover': {
            backgroundColor: theme.palette.background.navLinkBackground,
            '& $hoverStyle': {
                visibility: 'visible'
            }
        },
        '& input': {
            fontSize: theme.layoutSpacing(15)
        },
        letterSpacing: '0.05rem',
        borderRadius: '0.5rem',
        width: 'calc(100% - ' + theme.spacing(4) + ')',
        transition: 'all 500ms',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        padding: 0,
        paddingLeft: '1.2rem',
        paddingRight: '0.5rem',
        marginTop: '1.2rem',
        marginBottom: '1.2rem'
    },
    navLink: {
        margin: 0,
        padding: 0,
        color: theme.palette.text.default + ' !important',
        '&:hover': {
            backgroundColor: theme.palette.background.navLinkBackground,
            '& $hoverStyle': {
                visibility: 'visible'
            }
        },
        '& input': {
            fontSize: theme.layoutSpacing(15)
        },
        letterSpacing: '0.05rem',
        width: 'calc(100% - ' + theme.spacing(4) + ')',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        marginLeft: '1.5rem',
        paddingLeft: '1.2rem',
        marginTop: '1.2rem',
        paddingRight: '0.5rem',
        minHeight: theme.layoutSpacing(40)
    },
    selectedNavLinkLevelTwo: {
        color: theme.palette.text.default + ' !important',
        letterSpacing: '0.05rem',
        borderRadius: theme.spacing(0.5),
        width: 'calc(100% - ' + theme.spacing(4) + ')',
        margin: 0,
        padding: 0,
        marginLeft: '1.5rem',
        paddingLeft: '1.2rem',
        minHeight: theme.layoutSpacing(40),
        '&:hover': {
            backgroundColor: theme.palette.background.navLinkBackground
        }
    },
    selectedNavLinkLevelTwo1: {
        color: theme.palette.text.sidebarSelected + ' !important',
        letterSpacing: '0.05rem',
        width: 'calc(100% - ' + theme.spacing(4) + ')',
        margin: 0,
        padding: 0,
        minHeight: theme.layoutSpacing(40),
        '&:before': {
            position: 'absolute',
            top: '0',
            left: '-0.15rem',
            content: '""',
            width: '0.24rem',
            height: '100%',
            backgroundColor: theme.palette.text.sidebarSelected
        }
    },
    navLinkLevelTwo: {
        color: theme.palette.text.default + ' !important',
        '&:hover': {
            backgroundColor: theme.palette.background.navLinkBackground
        },
        letterSpacing: '0.05rem',
        width: 'calc(100% - ' + theme.spacing(4) + ')',
        padding: 0,
        margin: 0,
        marginLeft: '1.5rem',
        paddingLeft: '1.2rem',
        minHeight: theme.layoutSpacing(40)
    },
    navLinkLevelTwo1: {
        color: theme.palette.text.default + ' !important',
        '&:hover': {
            backgroundColor: theme.palette.background.navLinkBackground
        },
        letterSpacing: '0.05rem',
        width: 'calc(100% - ' + theme.spacing(4) + ')',
        padding: 0,
        margin: 0
    },
    applicationCategory: {
        marginTop: '2.32rem',
        marginLeft: '2.7rem',
        marginBottom: '0.5rem',
        fontSize: theme.title.h6.fontSize,
        lineHeight: 'normal',
        color: theme.palette.text.default,
        fontWeight: theme.title.h6.fontWeight,
        fontFamily: theme.title.h6.fontFamily,
        opacity: theme.title.h6.opacity,
        letterSpacing: theme.title.h6.letterSpacing
    },
    applicationCategoryHidden: {
        marginTop: '2.16rem',
        marginBottom: '1rem',
        marginLeft: '1rem',
        fontSize: theme.body.B1.fontSize,
        lineHeight: 2,
        color: theme.palette.text.default,
        fontWeight: theme.body.B1.fontWeight,
        fontFamily: theme.body.B1.fontFamily
    },
    advancedFeaturesCategory: {
        marginTop: '3rem',
        marginLeft: '3.2rem',
      
        fontSize: theme.title.h2.fontSize,
        lineHeight: 2,
        color: theme.palette.text.default,
        fontWeight: theme.title.h6.fontWeight,
        fontFamily: theme.title.h6.fontFamily,
        opacity: theme.title.h6.opacity,
       
    },

    adminNavLink: {
        color: theme.palette.text.default + ' !important',
        '&:hover': {
            backgroundColor: theme.palette.background.hover
        },
        letterSpacing: '0.05rem',
        borderRadius: theme.spacing(0.5),
        width: 'calc(100% - ' + theme.spacing(4) + ')',
        display: 'flex',
        gap: '1rem',
        marginLeft: '1rem'
    },
    ratingReviewLink: {
        color: theme.palette.text.default + ' !important',
        '&:hover': {
            backgroundColor: theme.palette.background.hover
        },
        letterSpacing: '0.05rem',
        borderRadius: theme.spacing(0.5),
        width: 'calc(100% - ' + theme.spacing(4) + ')',
        display: 'flex',
        gap: '1rem',
        marginLeft: '1rem'
    },
    dashboardLinkIconSelected: {
        color: theme.palette.primary.contrastText + ' !important',
        '&:hover': {
            opacity: '0.5'
        }
    },
    dashboardLinkIcon: {
        color: theme.palette.text.default + ' !important',
        '&:hover': {
            opacity: '0.5'
        }
    },
    adminLinkIconSelected: {
        color: theme.palette.primary.contrastText + ' !important',
        '&:hover': {
            opacity: '0.5'
        }
    },
    adminLinkIcon: {
        height: '2.8rem',
        width: '2.8rem',
        color: theme.palette.text.default + ' !important',
        '&:hover': {
            opacity: '0.5'
        }
    },
    sidebarLinkTextSelected: {
        color: theme.palette.text.sidebarSelected,
        fontWeight: theme.body.B3.fontWeight,
        fontSize: theme.layoutSpacing(15),
        lineHeight: '3rem',
        letterSpacing: theme.body.B3.letterSpacing,
        fontFamily: theme.body.B3.fontFamily,
        position: 'relative',
        opacity: theme.body.B3.opacity,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        '& svg': {
            fill: theme.palette.text.sidebarSelected
        }
    },
    sidebarLinkTextSelectedHidden1: {
        visibility: 'hidden'
    },
    sidebarLinkText: {
        color: theme.palette.text.default,
        fontWeight: theme.body.B2.fontWeight,
        fontSize: theme.layoutSpacing(15),
        lineHeight: '3rem',
        letterSpacing: theme.body.B2.letterSpacing,
        position: 'relative',
        width: '100%',
        opacity: 1,
        fontFamily: theme.body.B2.fontFamily,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sidebarLinkTextHide: {
        visibility: 'hidden'
    },
    sidebarLinkTextSecondSelected: {
        fontWeight: theme.body.B5.fontWeight,
        fontSize: theme.layoutSpacing(15),
        fontFamily: theme.body.B1.fontFamily,
        lineHeight: '3rem',
        position: 'relative',
        color: theme.palette.text.sidebarSelected,
        '& svg': {
            position: 'absolute',
            top: theme.spacing(0.5),
            left: '-' + theme.spacing(2)
        },
        letterSpacing: theme.body.B5.letterSpacing
    },
    sidebarLinkTextSecond: {
        color: theme.palette.text.default,
        opacity: theme.body.B3.opacity,
        fontWeight: theme.body.B3.fontWeight,
        fontSize: theme.body.B3.fontSize,
        lineHeight: '3rem',
        position: 'relative',
        '& svg': {
            position: 'absolute',
            top: theme.spacing(0.5),
            left: '-' + theme.spacing(2)
        },
        letterSpacing: '0.1rem'
    },
    sidebarLinkTextSecondSelectedHorizontalLine: {
        width: 2,
        height: '2.32rem',
        background: theme.palette.text.default,
        borderRadius: 2,
        marginRight: '0.8rem'
    },
    drawerExitAdminButton: {
        margin: theme.spacing(1, 2),
        padding: theme.spacing(0.5, 2.5),
        color: theme.palette.primary.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.background.plainBtnBg,
            color: theme.palette.icons.closeIcon,
            opacity: 1,
            '& svg': {
                color: `${theme.palette.icons.closeIcon} !important`
            }
        },
        '&:focus': {
            '&:after': {
                border: `0.5px solid ${theme.palette.background.plainBtnBg} !important`
            },
            backgroundColor: theme.palette.background.plainBtnBg
        }
    },
    drawerExitAdminButtonIcon: {
        marginRight: theme.spacing(1)
    },
    minervaPopup: {
        width: '100%',
        margin: 'auto'
    },
    alertIcon: {
        width: '3rem',
        height: '3rem',
        '& #alertSVGPath': {
            stroke: theme.palette.text.default
        },
        '& #alertSVGCircle': {
            stroke: theme.palette.text.default
        }
    },
   
    toggleIcon: {
        zIndex: '20',
        '&:hover': {
            backgroundColor: 'rgba(34, 0, 71, 1)',
            '& $drawerLeftIcon': {
                fill: 'rgba(255, 164, 151, 1)'
            },
            '& $drawerLeftIcon1': {
                fill: 'rgba(255, 164, 151, 1)'
            },
            '& $drawerRightIcon': {
                fill: 'rgba(255, 164, 151, 1)'
            },
            '& $drawerLeftIconHide': {
                fill: 'rgba(255, 164, 151, 1)'
            },
            '& $drawerLeftIconHide1': {
                fill: 'rgba(255, 164, 151, 1)'
            }
        },
        width: '100%',
        height: '100%'
    },
    footerContainer: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '86%',
        left: 0
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: `${theme.layoutSpacing(16)} ${theme.layoutSpacing(0)}`,
        paddingLeft: theme.layoutSpacing(16),
        paddingRight: theme.layoutSpacing(8),
        justifyContent: 'space-between'
    },
    footer_text: {
        color: theme.palette.text.default,
        fontFamily: theme.body.B3.fontFamily,
        fontSize: theme.layoutSpacing(18),
        fontWeight: '500',
        lineHeight: '2.1rem',
        letterSpacing: theme.body.B3.letterSpacing
    },
    footer_version: {
        textTransform: 'uppercase',
        color: theme.palette.text.footerVersion,
        fontFamily: theme.body.B3.fontFamily,
        fontSize: theme.layoutSpacing(16),
        fontWeight: theme.body.B3.fontWeight,
        lineHeight: '2.1rem',
        letterSpacing: theme.body.B3.letterSpacing,
        marginRight: '.5rem'
    },
    footer_logo: {
        width: '1.5rem',
        height: '1.5rem',
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
        minWidth: '2.4rem',
        minHeight: '2.4rem',
        maskImage: `url(${codxNewLogo})`,
        background: theme.palette.text.default
    },
    footer_first: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px'
    },
    copyRight: {
        fontSize: '1.3rem',
        color: theme.palette.text.default
    },
    homeSection: {
        display: 'flex',
        gap: '1.5rem',
        marginLeft: '2.7rem',
        width: 'fit-content',
        textDecoration: 'none',
        justifyContent: 'center',
        alignItems: 'center'
    },
    homeSectionText: {
        color: theme.palette.text.default,
        fontSize: theme.title.h3.fontSize,
        fontWeight: theme.body.B2.fontWeight,
        letterSpacing: theme.body.B1.letterSpacing,
        fontFamily: theme.body.B1.fontFamily,
        gap: '2rem',
        textAlign: 'center'
    },
    supportSectionDiv: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginLeft: '1.7rem',
        textDecoration: 'none'
    },
    supportGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
    },
    supportText: {
        fontSize: theme.title.h6.fontSize,
        lineHeight: 2,
        color: theme.palette.text.default,
        fontWeight: theme.title.h6.fontWeight,
        fontFamily: theme.body.B1.fontFamily,
        marginLeft: '1.7rem',
        opacity: theme.body.B1.opacity,
        letterSpacing: theme.title.h6.letterSpacing,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    supportSection: {
        marginLeft: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
    },
    supportSectionText: {
        fontSize: theme.body.B2.fontSize,
        fontFamily: theme.body.B2.fontFamily,
        fontWeight: theme.body.B2.fontWeight,
        color: theme.palette.text.default,
        opacity: theme.body.B2.opacity
    },
    icons: {
        width: '20'
    },
    drawerCollapseHidden: {
        display: 'none'
    },
    footerContainerdrawerCollapseHidden: {
        position: 'absolute',
        left: 0,
        top: '86%',
        width: '100%'
    },
    footerHidden: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: '2rem'
    },
    supportSectionDivHidden: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    supportSectionHidden: {
        marginTop: '3rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
    },
    navLinkHidden: {
        visibility: 'hidden'
    },
    adminNavLinkHidden: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectedNavLinkHidden: {
        visibility: 'hidden'
    },
    drawerScreenHidden: {
        display: 'none'
    },
    sidebarLinkTextSelectedHidden: {
        color: theme.palette.text.default,
        fontWeight: '500',
        fontSize: '1.5rem',
        lineHeight: '3rem',
        letterSpacing: '0.1rem',
        position: 'relative'
    },
    sidebarLinkTextHidden1: {
        color: theme.palette.text.default,
        fontWeight: 'normal',
        fontSize: '1.5rem',
        lineHeight: '3rem',
        letterSpacing: '0.1rem',
        position: 'relative'
    },
    drawerIcon: {
        width: '3.5rem',
        height: '3.5rem',
        visibility: 'visible',
        marginLeft: 'auto',
        marginRight: '2rem'
    },
    drawerIconHidden: {
        width: '3.4rem',
        height: '3.4rem',
        visibility: 'hidden'
    },
    minerva: {
        marginBottom: '2.6rem',
        marginLeft: theme.layoutSpacing(16)
    },
    minervaDrawerCollapseHidden: {
        marginBottom: '3.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    drawerLeftIcon: {
        fill: theme.palette.text.default,
        height: '2.5rem',
        width: '2.2rem',
        padding: 0
    },
    drawerLeftIconHide: {
        transform: 'rotate(180deg)',
        fill: theme.palette.text.default,
        height: '2.5rem',
        width: '2.2rem',
        padding: 0
    },
    drawerRightIcon: {
        fill: theme.palette.text.default,
        height: '2.5rem',
        width: '2.2rem',
        marginLeft: '-0.55rem'
    },
    homeSectionHidden: {
        display: 'flex',
        gap: '1rem',
        marginTop: '2.59rem'
    },
    ratingReviewLinkHidden: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sidebarLinkTextSecondSelectedHidden: {
        // paddingLeft: theme.spacing(1),
    },
    selectedNavLinkLevelTwoHidden: {
        marginLeft: 0,
        width: 'calc(100% - ' + theme.spacing(1) + ')',
        paddingLeft: '1.2rem',
        color: theme.palette.text.sidebarSelected,
        minHeight: theme.layoutSpacing(40),
        '&:hover': {
            backgroundColor: theme.palette.background.navLinkBackground
        }
    },
    sidebarLinkTextSecondSelectedHorizontalLineHidden: {
        width: 2
    },
    homeSectionSelected: {
        opacity: '1'
    },
    homeSectionNotSelected: {
        opacity: '0.8'
    },
    copyRightLogo: {
        width: '1.72rem',
        height: '1.78rem'
    },
    supportHidden: {
        visibility: 'hidden'
    },
    supportList: {
        '&.MuiListItem-gutters': {
            paddingLeft: '0'
        },
        '&.MuiListItem-button:hover': {
            backgroundColor: 'transparent'
        }
    },
    supportIcon: {
        marginRight: '0.75rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    drawerLeftIcon1: {
        fill: theme.palette.text.default,
        height: '2.5rem',
        width: '2.2rem',
        marginRight: '-1.2rem',
        padding: 0
    },
    drawerLeftIconHide1: {
        transform: 'rotate(180deg)',
        fill: theme.palette.text.default,
        height: '2.5rem',
        width: '2.2rem',
        marginRight: '-1.2rem',
        padding: 0
    },
    homeSectionDrawerHide: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column-reverse'
    },
    homeSectionDrawer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: '2.32rem'
    },
    drawerIconGroup: {
        display: 'flex'
    },
    screenLevel: {
        borderLeft: `1px solid ${theme.palette.separator.grey}`,
        marginLeft: '3rem',
        marginRight: '1.6rem'
    },
    applicationScreenContainer: {
        // maxHeight: '21rem',
        // overflowY: 'scroll',
        width: '97.2%',
        maxHeight: '60vh',
    overflowX: 'hidden',
    overflowY: 'auto'
        // '@media (max-width:1400px)': {
        //     maxHeight: '17rem'
        // }
    },
    appScreenContainerOnHover: {
        // overflowY: 'scroll',
        // maxHeight: '21rem',
        width: '95.8%'
        // '@media (max-width:1400px)': {
        //     maxHeight: '17rem'
        // }
    },
    collapseHidden: {
        transform: 'rotate(180deg)'
    },
    expandIcon: {
        pointerEvents: 'none',
        marginLeft: theme.layoutSpacing(4),
        fontSize: theme.layoutSpacing(18)
    },
    exitToggleWrapper: {
        display: 'flex',
        alignItems: 'center'
    },
    topbar_drawerPaper: {
        width: '100%',
        position: 'relative ',
        transition: 'all 500ms smooth',
        // overflow: 'auto',
        // overflowY: 'hidden',
        display: 'flex',
        '&.MuiDrawer-paperAnchorDockedLeft': {
            borderRight: 'none'
        }
    },
    topbar_applnScreenCont: {
        display: 'flex',
        padding: `${theme.layoutSpacing(10.5)} ${theme.layoutSpacing(13.9)}`,
        height: '100%',
        height: theme.layoutSpacing(52),
        position: 'relative'
    },
    topbar_sidebarLinksContainer: {
        height: '95%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'relative',
        borderTop: 'none',
        '&:after': {
            position: 'sticky',
            content: '""',
            bottom: '0%',
            left: theme.layoutSpacing(8),
            width: '99%',
            background: theme.palette.separator.grey,
            height: '1px',
            zIndex: '10000000',
            '@media (min-width: 2000px)': {
                height: '2px'
            }
        }
    },
    topbar_navLink: {
        margin: 0,
        padding: theme.layoutSpacing(7),
        color: theme.palette.text.default + ' !important',
        '&:hover': {
            backgroundColor: theme.palette.background.navLinkBackground
        },
        letterSpacing: '0.05rem',
        width: 'fit-content',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        marginRight: theme.layoutSpacing(20.9)
    },
    topbar_hover: {
        '&:hover': {
            cursor: 'default'
        }
    },
    topbar_sidebarLinkText: {
        color: theme.palette.text.default,
        fontWeight: theme.body.B2.fontWeight,
        fontSize: theme.layoutSpacing(15),
        lineHeight: '3rem',
        letterSpacing: theme.body.B2.letterSpacing,
        position: 'relative',
        width: 'fit-content', //theme.layoutSpacing(150),
        opacity: 1,
        fontFamily: theme.body.B2.fontFamily,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    topbarLinkText: {
        color: theme.palette.text.default,
        fontWeight: '500',
        fontSize: theme.layoutSpacing(15.7),
        lineHeight: theme.layoutSpacing(19),
        fontFamily: theme.body.B5.fontFamily,
        letterSpacing: theme.layoutSpacing(0.45),
        opacity: '80%',
        position: 'relative',
        width: 'fit-content', //theme.layoutSpacing(150),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        whiteSpace: 'noWrap'
    },
    selectedNavLink_top: {
        width: 'fit-content',
        color: theme.palette.primary.contrastText + ' !important',
        backgroundColor: theme.palette.background.navLinkBackground,
        '&:hover': {
            // backgroundColor: theme.palette.background.navLinkBackground
        },
        borderRadius: 0,
        display: 'flex',
        alignItems: 'center',
        padding: theme.layoutSpacing(7),
        marginRight: theme.layoutSpacing(13.9),
        marginLeft: theme.layoutSpacing(-7),
        marginTop: 0,
        marginBottom: 0,
        '&:first-child': {
            marginLeft: 0
        },
        '& .MuiListItemText-root': {
            maxWidth: 'fit-content',
            whiteSpace: 'noWrap',
            margin: 0
        }
    },
    topnav_sidebarLinkTextSelected: {
        color: theme.palette.text.default,
        fontWeight: '500',
        fontSize: theme.layoutSpacing(15.7),
        fontFamily: theme.body.B5.fontFamily,
        letterSpacing: theme.layoutSpacing(0.45),
        position: 'relative',
        width: 'fit-content', //theme.layoutSpacing(150),
        opacity: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& svg': {
            fill: theme.palette.text.sidebarSelected
        }
    },
    topnav_screenLevel: {
        padding: `${theme.layoutSpacing(14)} ${theme.layoutSpacing(0)}`,
        paddingRight: theme.layoutSpacing(0) + '!important',
        paddingLeft: theme.layoutSpacing(10.5),
        maxWidth: theme.layoutSpacing(350),
        '& .MuiListItemText-root': {
            maxWidth: 'fit-content',
            margin: 0
        }
    },
    top_navbarLinkTextSecond: {
        color: theme.palette.text.default,
        fontWeight: '400',
        fontSize: theme.layoutSpacing(16),
        lineHeight: theme.layoutSpacing(17),
        letterSpacing: theme.body.B5.letterSpacing,
        position: 'relative',
        width: 'fit-content',
        opacity: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    topnav_navLinkLevelTwo1: {
        paddingRight: theme.layoutSpacing(18),
        '&:before': {
            position: 'absolute',
            top: '0',
            left: '-0.15rem',
            content: '""',
            width: '0.1rem',
            height: '100%',
            backgroundColor: theme.palette.separator.grey
        }
    },
    topnav_sidebarLinkTextSecondSelected: {
        fontFamily: theme.body.B5.fontFamily,
        fontSize: theme.layoutSpacing(16),
        fontWeight: 500,
        lineHeight: theme.layoutSpacing(19.2),
        letterSpacing: theme.layoutSpacing(0.5),
        textAlign: 'left',
        paddingRight: theme.layoutSpacing(18)
    },
    topnav_selectedNavLinkLevelTwoHidden: {
        marginLeft: 0,
        width: '100%',
        padding: theme.layoutSpacing(7),
        paddingRight: theme.layoutSpacing(18) + ' !important',
        color: theme.palette.text.sidebarSelected,
        minHeight: theme.layoutSpacing(31.5)
        // backgroundColor: theme.palette.background.navLinkBackground
    },
    topnav_selectedNavLinkLevelTwo1: {
        color: theme.palette.text.sidebarSelected + ' !important',
        letterSpacing: '0.05rem',
        width: '100%',
        margin: 0,
        padding: theme.layoutSpacing(7),
        paddingRight: 0 + ' !important',
        minHeight: theme.layoutSpacing(31.5),
        backgroundColor: theme.palette.background.navLinkBackground,
        '&:before': {
            position: 'absolute',
            top: '0',
            left: '-0.15rem',
            content: '""',
            width: '0.24rem',
            height: '100%',
            backgroundColor: theme.palette.text.sidebarSelected
        },
        '&:hover': {
            backgroundColor: theme.palette.background.navLinkBackground
        }
    },
    rightBtn: {
        position: 'absolute',
        right: 0,
        top: 0,
        minWidth: '15px',
        backgroundColor: theme.palette.background.pureWhite,
        height: '100%',
        zIndex: '10000',
        '&:hover': {
            background: theme.palette.background.pureWhite
        },
        '& svg': {
            width: '18px',
            height: '18px',
            border: '1px solid' + theme.palette.icons.closeIcon,
            borderRadius: '50%'
        }
    },
    leftBtn: {
        position: 'absolute',
        left: 0,
        top: 0,
        minWidth: '15px',
        backgroundColor: theme.palette.background.pureWhite,
        height: '100%',
        zIndex: '10000',
        '&:hover': {
            background: theme.palette.background.pureWhite
        },
        '& svg': {
            width: '18px',
            height: '18px',
            border: '1px solid' + theme.palette.icons.closeIcon,
            borderRadius: '50%'
        }
    },
    topbar_applicationCategory: {
        marginTop: 0,
        marginBottom: 0
    },
    popover: {
        pointerEvents: 'none'
    },
    popoverContent: {
        pointerEvents: 'auto'
    },
    descriptionPopoverContent: {
        pointerEvents: 'auto',
        boxShadow: 'none'
    },
    descriptionContainer: {
        padding: theme.layoutSpacing(13),
        border: '.5px solid' + theme.palette.border.productBorder,
        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
        maxWidth: theme.layoutSpacing(350)
    },
    subScreenDescriptionContainer: {
        padding: theme.layoutSpacing(12),
        marginBottom: theme.layoutSpacing(5),
        maxWidth: theme.layoutSpacing(350),
        '&:after': {
            position: 'absolute',
            content: '""',
            height: '0.5px',
            width: '98%',
            left: 0,
            bottom: theme.layoutSpacing(3),
            opacity: '0.7',
            backgroundColor: theme.palette.border.loginGrid
        }
    },
    descriptionText: {
        fontSize: theme.layoutSpacing(13.9),
        fontFamily: theme.body.B5.fontFamily,
        color: theme.palette.text.default
    },
    menuItem: {
        '& .MuiMenu-list': {
            border: `1px ${theme.palette.border.productBorder} solid`
        }
    },
    noMargin: {
        margin: 0,
        padding: 0
    },
    hoverStyle: {
        visibility: 'hidden',
        '&:hover': {
            background: 'none'
        }
    },
    actionsWrapper: {
        display: 'flex',
        alignItems: 'center'
    },
    highlighterStyles: {
        animation: '$blink-animation 1.5s linear 5 forwards',
        // boxShadow: '0px 0px 1970.64px 0px #2B70C2, 0px 0px 1126.08px 0px #2B70C2, 0px 0px 656.88px 0px #2B70C2, 0px 0px 328.44px 0px #2B70C2, 0px 0px 93.84px 0px #2B70C2, 0px 0px 46.92px 0px #2B70C2'
        boxShadow: '0 0 10px 10px lightblue'
    },
    '@keyframes blink-animation': {
        to: {
            boxShadow: 'none'
        }
    },
    selectedTxt: {
        '&:before': {
            position: 'absolute',
            top: '0',
            left: '-0.15rem',
            content: '""',
            width: '0.24rem',
            height: '100%',
            backgroundColor: theme.palette.text.sidebarSelected
        }
    },
    dialogStyles: {
        width: theme.layoutSpacing(650)
    },
    confirmBtnStyles: {
        background: theme.palette.text.revamp,
        color: theme.palette.text.btnTextColor,
        '&:hover': {
            opacity: 0.7,
            background: theme.palette.text.revamp,
            color: theme.palette.text.btnTextColor
        }
    },
    advancedFeatures: {
        display: 'flex',
        alignItems: 'center',

        borderTop:'1px solid #BF99BD',
        padding: '0.5rem',
        paddingLeft:'2.6rem',
        cursor:'pointer',
        '& span': {
            fontFamily: 'Graphik',
            fontWeight: '500',
           
            fontSize: theme.layoutSpacing(18),
            lineHeight: theme.layoutSpacing(23.94),
            letterSpacing: theme.layoutSpacing(0.5),
            color: theme.palette.text.default,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: '70%',
            width: "calc(100% - 3.2rem)",
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
    advancedIconRoot: {
        minWidth: theme.layoutSpacing(35)
    },
    alertIcon: {
        stroke: theme.palette.text.default + '!important',
        width: '2.1rem',
        height: '2.1rem'
    },
    popoverForAdvancedFeatures: {
        position: 'relative', 
        display: 'flex',
        flexDirection: 'column',
        padding:'0rem',
        '&::before': {
            content: '""', 
            position: 'absolute', 
            left: 0, 
            top: '1.2rem',
            bottom: '2rem',
            width: '0.3rem', 
            backgroundColor: theme.palette.border.titleBorder,
            marginLeft:'2rem' 
          }
      },
      popoverContentForAdvancedFeatures: {
        pointerEvents: 'auto',
      },
      storiesSelection:{
        display: 'flex',
        flexDirection: 'column',
        padding:'0rem',
        fontSize:'1.7rem',
        color:theme.palette.text.default,
        marginLeft:'1rem',
        '&::before': {
          content: '""', 
          position: 'absolute',
          left: 0,
          top: '1.2rem',
          bottom: '0.2rem',
          width: '0.3rem',
          backgroundColor: theme.palette.text.default, 
          marginLeft:'2rem'
        }
      },
      storiesUnSelection:{
        display: 'flex',
        flexDirection: 'column',
        padding:'0rem',
        fontSize:'1.7rem',
        marginLeft:'1rem',
        '&::before': {
          content: '""', 
          position: 'absolute', 
          left: 0,
          top: '1.2rem',
          bottom: '0.2rem',
          width: '0.3rem',
          backgroundColor: theme.palette.border.titleBorder,
          marginLeft:'2rem'
        }
      },
      alertSelection:{
        display: 'flex',
        flexDirection: 'column',
        padding:'0rem',
        fontSize:'1.7rem',
        marginLeft:'1rem',
        color:theme.palette.text.default,
        '&::before': {
          content: '""',
          position: 'absolute', 
          left: 0,
          top: '0.3rem',
          bottom: '1rem',
          width: '0.3rem',
          backgroundColor: theme.palette.text.default, 
          marginLeft:'2rem'
        }
      },
      alertUnSelection:{
        display: 'flex',
        flexDirection: 'column',
        padding:'0rem',
        fontSize:'1.7rem',
        color:theme.palette.text.default,
        marginLeft:'1rem',
        '&::before': {
          content: '""', 
          position: 'absolute',
          left: 0,
          top: '0.3rem',
          bottom: '1rem',
          width: '0.3rem',
          backgroundColor: theme.palette.border.titleBorder,
          marginLeft:'2rem' 
        }
      },
      footerHolder:{
        marginTop:'auto'
      }
      
});

export default sidebarStyle;
