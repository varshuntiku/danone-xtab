import { alpha } from '@material-ui/core';

const newDashboardStyle = (theme) => ({
    parentContainer: {
        width: '100%',
        height: '100%'
    },
    parent: {
        height: '100%',
        overflowY: 'hidden'
    },
    tabs: {
        position: 'relative',
        paddingLeft: theme.layoutSpacing(20),
        top: theme.layoutSpacing(8),
        '& span': {
            fontFamily: theme.title.h1.fontFamily,
            fontSize: theme.layoutSpacing(20),
            fontWeight: '400',
            color: alpha(theme.palette.text.revamp, 0.8),
            lineHeight: 'normal',
            letterSpacing: theme.layoutSpacing(1),
            textTransform: 'capitalize'
        },
        '& .Mui-selected span': {
            fontWeight: '500',
            color: theme.palette.text.revamp
        },
        '& button': {
            padding: `0 ${theme.layoutSpacing(20)}`,
            '&:hover': {
                background: 'transparent'
            }
        }
    },
    content: {
        height: '91%',
        '@media (max-width: 1600px)': {
            height: '89%'
        }
    },
    cardParent: {
        position: 'relative'
    },
    contentWrapper: {
        padding: `${theme.layoutSpacing(28)} ${theme.layoutSpacing(28)} ${theme.layoutSpacing(20)}`,
        overflowY: 'scroll',
        height: '100%'
    },
    contentHead: {
        display: 'flex',
        justifyContent: 'space-between',
        height: theme.layoutSpacing(304)
    },
    headText: {
        padding: `${theme.layoutSpacing(64)} 0 ${theme.layoutSpacing(32)} ${theme.layoutSpacing(
            48
        )}`,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(68),
        color: theme.palette.text.revamp,
        fontWeight: '300',
        lineHeight: 'normal',
        letterSpacing: theme.layoutSpacing(1),
        '& div': {
            marginBottom: theme.layoutSpacing(8)
        }
    },
    industryDashboardImgContainer: {
        borderLeft: `1px solid ${theme.IndustryDashboard.border.light}`,
        paddingLeft: theme.layoutSpacing(8),
        width: 'calc(25% - 3px)'
    },
    industryDashboardImg: {
        borderRadius: theme.layoutSpacing(20),
        height: '100%',
        width: '100%',
        objectFit: 'fill'
    },
    cardWrapper: {
        display: 'flex',
        alignItems: 'center',
        height: theme.layoutSpacing(70),
        paddingLeft: theme.layoutSpacing(72),
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(20),
        color: theme.palette.text.revamp,
        lineHeight: 'normal',
        letterSpacing: theme.layoutSpacing(0.5),
        '& svg': {
            marginRight: theme.layoutSpacing(72),
            height: theme.layoutSpacing(36),
            width: theme.layoutSpacing(36),
            padding: theme.layoutSpacing(4),
            cursor: 'pointer',
            ...(localStorage.getItem('codx-products-theme') === 'dark'
                ? { fill: `${theme.palette.text.revamp}!important` }
                : {}),
            '& g': {
                fill: theme.palette.text.revamp,
                '& path': {
                    fill: `${theme.palette.text.revamp}!important` // this will be removed once the icons are replaced
                }
            }
        }
    },
    iconsWrapper: {
        display: 'block',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        '& svg': {
            transition: 'transform 0.5s ease-out',
            ...(localStorage.getItem('codx-products-theme') === 'dark'
                ? { stroke: `${theme.palette.text.revamp} !important` }
                : {})
        },
        '& svg:last-child': {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            transform: 'translateY(100%)'
        }
    },
    skeletonLoaderWrapper: {
        display: 'flex',
        gap: theme.layoutSpacing(72),
        alignItems: 'center',
        width: '100%'
    },
    skeletonLoaderText: {
        minWidth: theme.layoutSpacing(100),
        maxWidth: theme.layoutSpacing(250),
        width: '50%',
        height: theme.layoutSpacing(25),
        background: `${theme.IndustryDashboard.border.light}`
    },
    skeletonLoaderCircle: {
        minWidth: theme.layoutSpacing(25),
        width: '10%',
        aspectRatio: 1,
        height: 'auto',
        background: `${theme.IndustryDashboard.border.light}`
    },
    card: {
        '&:hover': {
            background: theme.IndustryDashboard.background.cardHover,
            border: `2px solid ${theme.IndustryDashboard.border.light}`,
            cursor: 'pointer',
            position: 'absolute',
            left: `-${theme.layoutSpacing(1.5)}`,
            top: `-${theme.layoutSpacing(1)}`,
            '& div': {
                border: 'none'
            },
            '& svg:first-child': {
                transform: 'translateY(-100%)'
            },
            '& svg:last-child': {
                transform: 'none'
            }
        }
    },
    notFound: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.layoutSpacing(48)} 0`,
        '& div': {
            paddingTop: theme.layoutSpacing(24),
            fontFamily: theme.body.B1.fontFamily,
            fontSize: theme.layoutSpacing(24),
            color: theme.palette.text.revamp,
            lineHeight: 'normal',
            fontWeight: '500',
            letterSpacing: theme.layoutSpacing(0.35)
        }
    },
    topbarWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingRight: theme.layoutSpacing(40)
    },
    searchWrapper: {
        padding: `${theme.layoutSpacing(12)} ${theme.layoutSpacing(0)} ${theme.layoutSpacing(
            12
        )} 0`,
        width: '25%',
        '& .MuiFilledInput-root': {
            height: theme.layoutSpacing(40),
            borderRadius: 0,
            background: alpha(theme.palette.text.revamp, 0.08),
            padding: theme.layoutSpacing(8),
            '&::before': {
                borderBottom: `1px solid ${theme.palette.border.dashboard}`
            },
            '&::after': {
                borderBottom: `0.5px solid ${theme.palette.text.revamp}`
            },
            '& svg': {
                width: theme.layoutSpacing(24),
                height: theme.layoutSpacing(24),
                color: theme.palette.text.revamp
            },
            '&.Mui-focused svg': {
                color: theme.palette.primary.purpleLight
            }
        },
        '& .MuiInputAdornment-filled.MuiInputAdornment-positionStart:not(.MuiInputAdornment-hiddenLabel)':
            {
                margin: 0,
                paddingRight: theme.layoutSpacing(8)
            },
        '& input': {
            padding: 0,
            fontSize: theme.layoutSpacing(15),
            color: theme.palette.primary.purpleLight,
            lineHeight: 'normal',
            fontWeight: '400',
            letterSpacing: theme.layoutSpacing(0.5),
            '&:focus': {
                backgroundColor: 'transparent'
            }
        },
        '& .MuiFilledInput-underline:hover:before': {
            borderBottomColor: theme.palette.border.dashboard
        }
    }
});

export default newDashboardStyle;
