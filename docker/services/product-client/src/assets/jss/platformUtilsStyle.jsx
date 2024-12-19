const platformUtilsStyle = (theme) => ({
    container: {
        minHeight: '100%',
        padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(16)}`,
        background: theme.palette.background.utilsBackground
    },
    platformUtilBody: {
        '@media (max-height: 600px)': {
            maxHeight: `calc(100vh - ${theme.layoutSpacing(60)})`,
            overflowY: 'auto'
        },
        height: '100%'
    },
    utils: {
        padding: theme.layoutSpacing(44),
        // marginLeft: 0,
        // marginRight: 0,
        // marginTop: 0,
        margin: 0,
        maxHeight: 'calc(100vh - ' + theme.layoutSpacing(175) + ')',
        overflowY: 'scroll'
    },
    utilCardWrapper: {
        '&:hover': {
            background: theme.IndustryDashboard.background.cardHover,
            border: '2px solid' + theme.IndustryDashboard.border.light,
            position: 'absolute',
            left: `-${theme.layoutSpacing(1.5)}`,
            top: `-${theme.layoutSpacing(1.5)}`,
            '& div': {
                border: 'none'
            }
        }
    },
    utilCard: {
        background: theme.palette.background.utilsBackground,
        maxHeight: theme.layoutSpacing(219),
        minHeight: theme.layoutSpacing(219),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: theme.spacing(2.5),
        letterSpacing: '1px',
        textAlign: 'center',
        color: theme.palette.text.revamp,
        textDecoration: 'none',
        '&:hover': {
            background: theme.IndustryDashboard.background.cardHover,
            '& $iconWrapper': {
                background: theme.ApplicationDashboard.background.iconHover
            },
            '& $icons': {
                '& path:not(.noStroke), circle:not(.noStroke)': {
                    stroke: theme.palette.icons.iconHoverColor
                },
                '& path:not(.noFill), circle:not(.noFill)': {
                    fill: theme.palette.icons.iconHoverColor
                }
            },
            '& $nucliosIconWrapper': {
                fill: theme.palette.icons.iconHoverColor
            }
        }
    },
    utilCardVisible: {
        minHeight: theme.layoutSpacing(219),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: theme.spacing(2.5),
        letterSpacing: '1px',
        textAlign: 'center',
        color: theme.palette.text.revamp,
        textDecoration: 'none'
    },
    utilCardLocked: {
        minHeight: theme.layoutSpacing(219),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: theme.spacing(2.5),
        letterSpacing: '1px',
        textAlign: 'center',
        color: theme.palette.text.revamp,
        textDecoration: 'none',
        opacity: '0.1'
    },
    utilCardLockedInfo: {
        maxWidth: theme.spacing(40),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.6rem !important',
        fontStyle: 'Graphik',
        letterSpacing: '0.5px',
        textAlign: 'center',
        color: theme.palette.text.revamp,
        fontWeight: 400
    },
    lockButton: {
        marginBottom: theme.spacing(2),
        '& svg': {
            fill: `${theme.palette.text.contrastText} !important`,
            stroke: `${theme.palette.text.contrastText} !important`
        }
    },
    blankUtilCard: {
        '&:hover': {
            '& $iconWrapper': {
                visibility: 'hidden'
            },
            '& $icons': {
                '& path:not(.noStroke), circle:not(.noStroke)': {
                    visibility: 'hidden'
                },
                '& path:not(.noFill), circle:not(.noFill)': {
                    visibility: 'hidden'
                }
            },
            '& $nucliosIconWrapper': {
                visibility: 'hidden'
            }
        }
    },
    iconWrapper: {
        background: 'transparent',
        padding: theme.layoutSpacing(13),
        width: theme.layoutSpacing(72),
        height: theme.layoutSpacing(72),
        borderRadius: '50%'
    },
    icons: {
        width: '100%',
        height: '100%',
        '& path:not(.noStroke), circle:not(.noStroke)': {
            stroke: theme.palette.text.revamp
        },
        '& path:not(.noFill), circle:not(.noFill)': {
            fill: theme.palette.text.revamp
        }
    },
    nucliosIconWrapper: {
        width: '100%',
        height: '100%',
        fill: theme.palette.text.revamp
    },
    gridItem: {
        padding: '0 !important',
        position: 'relative'
    },
    utilName: {
        color: theme.palette.text.revamp,
        fontFamily: theme.body.B5.fontFamily,
        fontSize: theme.layoutSpacing(18),
        marginTop: theme.layoutSpacing(8),
        fontWeight: '400',
        lineHeight: 'normal',
        letterSpacing: '1px'
    },
    footerHolder: {
        position: 'relative',
        top: '-4px'
        // '@media (max-height: 600px)': {
        //     position: 'absolute',
        //     bottom: '8rem'
        // },
        // '@media (max-height: 560px)': {
        //     position: 'absolute',
        //     bottom: '14rem'
        // }
        // marginTop: "1rem"
    },
    footerContainer: {
        left: 'initial',
        bottom: 'initial'
    },
    nucliosBox: {
        height: 'calc(100vh - ' + theme.layoutSpacing(90) + ')'
    }
});

export default platformUtilsStyle;
