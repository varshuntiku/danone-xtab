import { alpha } from '@material-ui/core';

const appWidgetAssumptionsStyle = (theme) => ({
    assumptionsIcon: {
        cursor: 'pointer',
        zIndex: 2,
        height: theme.layoutSpacing(18),
        width: theme.layoutSpacing(18),
        color: `${theme.palette.text.revamp} !important`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: theme.layoutSpacing(-0.9)
    },
    iconContainer: {
        position: 'relative',
        width: theme.layoutSpacing(24.5),
        height: theme.layoutSpacing(24.5),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        '&:hover': {
            backgroundColor: theme.palette.background.plainBtnBg,
            cursor: 'pointer'
        }
    },
    paper: {
        overflowX: 'unset',
        overflowY: 'unset',
        marginTop: theme.layoutSpacing(9),
        border: theme.palette.border.popOverBorder,
        '&:before': {
            content: '""',
            position: 'absolute',
            marginRight: '-0.71em',
            top: theme.layoutSpacing(-15),
            right: `calc((100% - ${theme.layoutSpacing(20)}) / 2)`,
            height: theme.layoutSpacing(20),
            width: theme.layoutSpacing(20),
            backgroundColor: theme.palette.background.modelBackground,
            transform: 'translate(-50%, 50%) rotate(316deg)',
            border: theme.palette.border.popOverBorder,
            borderBottom: 'none',
            clipPath: 'polygon(-5px -5px, calc(100% + 5px) -5px, calc(100% + 5px) calc(100% + 5px))'
        }
    },
    lastElePaper: {
        overflowX: 'unset',
        overflowY: 'unset',
        marginTop: theme.layoutSpacing(9),
        border: theme.palette.border.popOverBorder,
        '&:before': {
            content: '""',
            position: 'absolute',
            marginRight: '-0.71em',
            top: theme.layoutSpacing(-15),
            right: theme.layoutSpacing(10),
            height: theme.layoutSpacing(20),
            width: theme.layoutSpacing(20),
            backgroundColor: theme.palette.background.modelBackground,
            transform: 'translate(-50%, 50%) rotate(316deg)',
            border: theme.palette.border.popOverBorder,
            borderBottom: 'none',
            clipPath: 'polygon(-5px -5px, calc(100% + 5px) -5px, calc(100% + 5px) calc(100% + 5px))'
        }
    },
    lastElePaperTWo: {
        overflowX: 'unset',
        overflowY: 'unset',
        marginTop: theme.layoutSpacing(9),
        border: theme.palette.border.popOverBorder,
        '&:before': {
            content: '""',
            position: 'absolute',
            marginRight: '-0.71em',
            top: theme.layoutSpacing(-15),
            right: theme.layoutSpacing(24),
            height: theme.layoutSpacing(20),
            width: theme.layoutSpacing(20),
            backgroundColor: theme.palette.background.modelBackground,
            transform: 'translate(-50%, 50%) rotate(316deg)',
            border: theme.palette.border.popOverBorder,
            borderBottom: 'none',
            clipPath: 'polygon(-5px -5px, calc(100% + 5px) -5px, calc(100% + 5px) calc(100% + 5px))'
        }
    },
    iconActive: {
        backgroundColor: theme.palette.background.plainBtnBg
    },
    assumptionsIconLargeContainer: {
        display: 'inline-flex'
    },
    assumptionsIconLarge: {
        cursor: 'pointer',
        marginLeft: 0,
        fill: theme.palette.text.default
    },
    customIcon: {
        width: '14px',
        height: '14px',
        fill: theme.palette.primary.contrastText
    },
    customIconLarge: {
        width: '20px',
        height: '20px',
        fill: theme.palette.primary.contrastText
    },
    closeButton: {
        position: 'absolute',
        top: theme.layoutSpacing(12),
        right: 0,
        '& svg': {
            fill: `${theme.palette.icons.closeIcon}!important`
        }
    },
    iconButton: {
        textTransform: 'none',
        background: alpha(theme.palette.text.white, 0.1),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconButtonIcon: {
        marginRight: '-1rem'
    },
    dialogPaper: {
        background: theme.palette.background.modelBackground,
        backdropFilter: 'blur(2rem)',
        minWidth: theme.layoutSpacing(1011),
        maxWidth: theme.layoutSpacing(1011)
    },
    assumptionDialogContent: {
        minWidth: theme.spacing(60),
        maxHeight: '35rem',
        overflow: 'auto',
        overflowX: 'hidden',
        position: 'relative',
        '& .MuiTableBody-root': {
            backgroundColor: `${theme.palette.background.modelBackground} !important`
        }
    },
    rightVariant: {
        justifyContent: 'flex-end',
        '& .MuiDialog-paper': {
            marginRight: 0
        }
    },
    leftVariant: {
        justifyContent: 'flex-start',
        '& .MuiDialog-paper': {
            marginLeft: 0
        }
    },
    DrawerVariant: {
        '& .MuiDialog-paper': {
            overflow: 'visible'
        },
        '& .MuiDialog-paperScrollPaper': {
            maxHeight: 'unset',
            height: 'calc(100% - 1rem)'
        },
        '& $closeButton': {
            position: 'absolute',
            top: '0rem',
            right: '0rem',
            background: theme.palette.primary.light,
            backdropFilter: 'blur(2rem)'
        },
        dialogContent: {
            marginBottom: 0
        },
        // closeIcon: {
        //     '&.MuiSvgIcon-root': {
        //         color: theme.palette.text.titleText
        //     }
        // },
        dialogActionSection: {
            '& .MuiButton-outlined': {
                color: theme.palette.border.buttonOutline + '!important',
                borderColor: theme.palette.border.buttonOutline + '!important'
            },
            '& .MuiButton-contained': {
                backgroundColor: theme.palette.border.buttonOutline
            }
        }
    },
    popOverContainer: {
        marginTop: '0.5rem'
    },
    popOver: {
        padding: theme.layoutSpacing(14),
        backgroundColor: theme.palette.background.modelBackground,
        maxWidth: theme.spacing(60)
    },
    popOverTitle: {
        display: 'flex',
        width: '100% !important',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '1.6rem',
        position: 'relative'
    },
    sepratorLine: {
        border: `1px solid ${theme.palette.border.loginGrid}`,
        borderBottom: 'none',
        padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(20)}`,
        width: 'calc(100% - 0px)'
    },
    popOverTitleText: {
        fontFamily: theme.body.B5.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontSize: theme.layoutSpacing(14),
        color: theme.palette.text.titleText
    },
    popOverContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden'
    },
    contentText: {
        paddingTop: '1.67rem',
        color: theme.palette.text.default,
        maxHeight: theme.spacing(29),
        lineHeight: theme.layoutSpacing(24),
        fontFamily: theme.body.B5.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontSize: theme.layoutSpacing(14),
        overflow: 'hidden',
        overflowWrap: 'break-word'
    },
    dialogContentText: {
        color: theme.palette.text.default,
        maxHeight: theme.spacing(29),
        lineHeight: theme.layoutSpacing(24),
        fontSize: '1.67rem',
        overflow: 'hidden',
        overflowWrap: 'break-word'
    },
    contentTextNoTitle: {
        color: theme.palette.text.default,
        maxHeight: theme.spacing(29),
        lineHeight: theme.layoutSpacing(24),
        fontSize: '1.67rem',
        overflow: 'hidden',
        overflowWrap: 'break-word'
    },
    closeIcon: {
        fontSize: '0.5rem !important',
        position: 'absolute',
        // maxWidth: theme.spacing(3),
        right: 0,
        marginRight: `-${theme.spacing(1)}`,
        '& svg': {
            fill: `${theme.palette.icons.closeIcon}!important`,
            padding: '2px'
        }
    },
    closeIconNoTitle: {
        fontSize: '0.5rem !important',
        alignSelf: 'start',
        '& svg': {
            fill: `${theme.palette.icons.closeIcon}!important`,
            padding: '2px'
            // margin:'0px !important'
        }
    }
});

export default appWidgetAssumptionsStyle;
