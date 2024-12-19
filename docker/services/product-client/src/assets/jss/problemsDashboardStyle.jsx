import { alpha } from '@material-ui/core';

const problemsDashboardStyle = (theme) => ({
    container: {
        height: '80%'
    },
    gridBody: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    functionContainer: {
        height: '95%',
        paddingTop: theme.layoutSpacing(15),
        rowGap: '3px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    functionContainerLoader: {
        background: `linear-gradient(130deg, ${theme.ApplicationDashboard.background.bgColor}, transparent)`,
        animation: '$backgroundAnimate 2500ms ease infinite',
        backgroundSize: '200% 200%',
        backgroundPosition: '0% 0%',
        '&:hover': {
            border: `none`,
            background: `linear-gradient(130deg, ${theme.ApplicationDashboard.background.bgColor}, transparent)`,
            boxShadow: 'none'
        }
    },
    '@keyframes backgroundAnimate': {
        '0%': {
            backgroundPosition: '0% 0%'
        },
        '50%': {
            backgroundPosition: '91% 100%'
        },
        '100%': {
            backgroundPosition: '0% 0%'
        }
    },
    functionCard: {
        width: theme.layoutSpacing(400),
        height: theme.layoutSpacing(340),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        position: 'relative'
    },
    functionCardContainer: {
        flexBasis: 0,
        cursor: 'pointer',
        maxWidth: '100%',
        '& .MuiCardActionArea-focusHighlight': {
            background: 'transparent'
        },
        '& .Mui-focusVisible': {
            background: 'transparent',
            PointerEvents: 'none'
        },
        '& .MuiCardActionArea-root': {
            PointerEvents: 'none'
        },
        '&:hover': {
            background: theme.FunctionDashboard.background.cardHover,
            boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.16)',
            '& $functionLogoWrapper': {
                background: theme.FunctionDashboard.background.logoWrapperColor,
                borderRadius: '50%',
                '& svg': {
                    stroke: `${theme.palette.icons.iconHoverColor}!important`,
                    fill: `${theme.palette.icons.iconHoverColor}!important`
                }
            },
            '& $textContent': {
                fontWeight: '400'
            },
            border: '1px solid' + theme.IndustryDashboard.border.light,
            position: 'relative',
            left: `-${theme.layoutSpacing(1.2)}`,
            top: `-${theme.layoutSpacing(4)}`,
            '& div': {
                border: 'none'
            }
        }
    },
    actionArea: {
        pointerEvents: 'none'
    },
    functionDetails: {
        border: '0.5px solid',
        borderColor: theme.palette.border.color,
        borderRadius: '3px',
        background: theme.palette.primary.dark
    },

    functionDetailsCard: {
        height: '100%',
        borderRight: '0.5px solid',
        borderRightColor: theme.palette.border.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        '& .MuiCard-root': {
            boxShadow: 'none'
        },
        '& .MuiAvatar-root': {
            position: 'absolute',
            top: theme.spacing(2.5)
        },
        '& .MuiCardContent-root': {
            width: '100%'
        }
    },

    applicationList: {
        display: 'flex',
        borderBottom: '1px solid',
        borderBottomColor: theme.palette.border.color,
        borderRadius: '0',
        '& img': {
            width: theme.spacing(3)
        },
        '& .MuiIconButton-root:hover': {
            backgroundColor: 'unset'
        }
    },

    title: {
        fontSize: theme.spacing(2),
        lineHeight: theme.spacing(2),
        color: theme.palette.primary.contrastText,
        cursor: 'pointer'
    },
    subHeader: {
        fontSize: theme.spacing(1.5),
        lineHeight: theme.spacing(1.5),
        color: alpha(theme.palette.text.default, 0.7),
        marginTop: theme.spacing(0.75)
    },

    nextButtonWrapper: {
        borderLeft: '0.5px solid',
        borderLeftColor: theme.palette.border.color,
        position: 'relative'
    },
    nextButton: {
        position: 'absolute',
        margin: '0',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: 'none'
    },

    functionLogoWrapper: {
        width: theme.spacing(11),
        height: theme.spacing(11),
        margin: '0 auto',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        '& svg': {
            width: '50%',
            fill: theme.palette.text.titleText + ' !important'
        }
    },

    functionLogo: {
        position: 'absolute',
        width: '50%',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto'
    },
    industryAvatar: {
        backgroundColor: theme.palette.primary.main
    },
    favouriteIcon: {
        opacity: '0.4',
        margin: '0.4rem',
        position: 'absolute',
        top: '0',
        left: '0',
        '&:hover': {
            opacity: '0.6'
        },
        '& svg': {
            fill: theme.palette.text.titleText + '! important'
        }
    },
    favIconHover: {
        '& svg': {
            fill: 'black !important'
        }
    },

    nextIcon: {
        color: theme.palette.primary.contrastText
    },

    textContent: {
        fontWeight: '300',
        textAlign: 'center',
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(30),
        marginTop: theme.spacing(2.5),
        marginBottom: theme.spacing(0.75)
    },

    applicationCount: {
        fontWeight: '300',
        textAlign: 'center',
        color: theme.palette.text.contrastText,
        marginBottom: theme.spacing(2.5)
    },

    functionName: {
        fontWeight: '300',
        textAlign: 'center',
        color: theme.palette.text.titleText,
        marginTop: theme.spacing(2)
    },

    toolsRoot: {
        position: 'absolute',
        right: theme.spacing(2.5),
        top: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        '&  img': {
            width: theme.spacing(2)
        },
        '& .Mui-selected': {
            border: '1px solid ' + theme.palette.text.green
        }
    },
    minervaBtn: {
        position: 'absolute',
        right: theme.spacing(132),
        top: '4px',
        marginBottom: '4px',
        color: '#e1ad01',
        left: '50%',
        height: '70px',
        transform: 'translateX(-50%)',
        '&:hover': {
            color: '#e1ad01',
            backgroundColor: alpha('#e1ad01', 0.05),
            border: '2px solid #6df0c2',
            opacity: 1
        }
    },
    previewOptionsContainer: {
        position: 'absolute',
        top: 0,
        right: theme.spacing(20),
        width: theme.spacing(20)
    },
    appEnvContainer: {
        paddingLeft: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        display: 'flex',
        gap: '0.5rem'
    },
    appEnvTagPreview: {
        padding: '0.2rem 0.4rem',
        fontSize: '1.5rem',
        borderRadius: theme.spacing(0.5),
        backgroundColor: theme.palette.background.envLabel,
        fontColor: theme.palette.primary.dark
    },
    appEnvTagProd: {
        padding: '0.2rem 0.4rem',
        fontSize: '1.5rem',
        borderRadius: theme.spacing(0.5),
        backgroundColor: theme.palette.background.prodEnvLabel,
        fontColor: theme.palette.primary.dark
    },
    appGroupCardRoot: {
        borderBottom: `1px solid ${alpha(theme.palette.text.contrastText, 0.7)}`
    },
    tabsRoot: {
        borderBottom: `2px solid ${alpha(theme.palette.text.default, 0.1)}`,
        minHeight: 0,
        padding: '0.5rem 2rem 0'
    },
    tab: {
        minHeight: 0,
        minWidth: '5rem',
        borderRadius: '4px 4px 0 0',
        '&.Mui-selected': {
            color: `${theme.palette.primary.contrastText} !important`,
            background: alpha(theme.palette.primary.contrastText, 0.1),
            position: 'relative',
            '&:after': {
                content: '""',
                position: 'absolute',
                height: '4px',
                borderRadius: '4px',
                background: theme.palette.primary.contrastText,
                bottom: 0,
                left: 0,
                width: '100%'
            }
        }
    },
    tabIndicator: {
        display: 'none'
    },
    functionHeading: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        width: '98%',
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
        padding: `${theme.layoutSpacing(16)} ${theme.layoutSpacing(0)}`,
        borderTop: `1px solid ${theme.IndustryDashboard.border.light}`,
        borderBottom: `1px solid ${theme.IndustryDashboard.border.light}33`,
        '& span': {
            minHeight: theme.layoutSpacing(36),
            fontSize: theme.layoutSpacing(36),
            lineHeight: theme.layoutSpacing(36),
            fontFamily: theme.title.h1.fontFamily,
            color: theme.palette.text.default
        }
    },
    backIcon: {
        position: 'absolute',
        left: 30,
        '& svg': {
            width: theme.layoutSpacing(48),
            height: theme.layoutSpacing(40),
            cursor: 'pointer',
            color: `${theme.palette.text.revamp} !important`
        }
    },
    notFound: {
        fontSize: theme.layoutSpacing(32),
        color: `${theme.palette.text.revamp} !important`,
        fontFamily: theme.title.h1.fontFamily,
        paddingLeft: theme.layoutSpacing(16),
        textAlign: 'center',
        width: '95%'
    },
    problemDashboardContainer: {
        minHeight: '100%',
        overflowY: 'scroll',
        paddingBottom: theme.layoutSpacing(15)
    },
    inputConatiner: {
        width: theme.layoutSpacing(430),
        position: 'absolute',
        right: 20
    },
    searchInput: {
        fontSize: theme.layoutSpacing(16),
        backgroundColor: theme.ApplicationDashboard.background.searchInputBg,
        color: theme.palette.text.default,
        border: 'none',
        borderBottom: `1px solid ${theme.palette.border.grey}`,
        outline: 'none',
        padding: '1rem',
        paddingLeft: '6rem',
        width: '100%',
        fontFamily: theme.body.B5.fontFamily
    },
    searchIcon: {
        position: 'absolute',
        top: '.5rem',
        left: '1rem',
        fontSize: '3rem',
        opacity: '0.5',
        backgroundColor: 'tranparent',
        color: theme.palette.text.default
    }
});

export default problemsDashboardStyle;
