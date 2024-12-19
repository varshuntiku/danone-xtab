import { alpha } from '@material-ui/core';
import background from 'assets/img/login_bg.svg';

const llmHomeStyle = (theme) => ({
    bodyContainer: {
        height: '100%',
        position: 'relative',
        '&:before': {
            backgroundImage: `url(${background})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            content: '" "',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: -1,
            animation: '$backgroundAnimate 5400ms ease infinite',
            animationDelay: '5400ms'
        }
    },
    body: {
        height: 'calc(100vh - ' + theme.spacing(12.4) + ')',
        marginBottom: theme.spacing(6.25),
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
    },
    gridBody: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    heading: {
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
            fontSize: theme.layoutSpacing(36),
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
            cursor: 'pointer'
        }
    },
    wrapper: {
        height: '90%'
    },
    container: {
        height: '95%',
        rowGap: '3px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        width: theme.layoutSpacing(456),
        height: theme.layoutSpacing(400),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        boxShadow: 'none'
    },
    actionArea: {
        pointerEvents: 'none'
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
    logoWrapper: {
        width: theme.spacing(11),
        height: theme.spacing(11),
        margin: '0 auto',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& svg': {
            width: '50%',
            fill: theme.palette.text.titleText + ' !important'
        }
    },
    cardContainer: {
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
            '& $logoWrapper': {
                backgroundColor: theme.palette.text.default,
                borderRadius: '50%',
                '& svg': {
                    stroke: theme.palette.background.pureWhite
                }
            },
            '& $textContent': {
                fontWeight: '400'
            }
        }
    }
});

export default llmHomeStyle;
