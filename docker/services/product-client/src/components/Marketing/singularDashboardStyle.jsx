const singularDashboardStyle = (theme) => ({
    main: {
        height: '100%',
        position: 'relative'
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
        animationDelay: '2s',
        animationFillMode: 'forwards'
    },
    toggleButton: {
        position: 'absolute',
        right: theme.spacing(2.5),
        top: theme.spacing(2),
        visibility: 'hidden',
        animation: 'textAnimation 0s 6s forwards',

        '&  img': {
            width: theme.spacing(2)
        },
        '& .Mui-selected': {
            border: '1px solid #67F1C1'
        }
    },
    contentWrapper: {
        height: '100%'
    },

    listViewHeader: {
        width: '85%',
        margin: '0 auto',
        paddingTop: '75px',
        borderBottom: '.5px solid' + theme.palette.primary.contrastText
    },
    listViewBody: {
        width: '85%',
        margin: '0 auto',
        animation: 'app-table-animateIn 0.75s forwards',
        animationDelay: '0.400s',
        animationTimingFunction: 'ease-in-out',
        visibility: 'hidden',
        '& > :last-child': {
            border: 'unset !important'
        }
    },

    content: {
        position: 'relative',
        top: ' 50%',
        transform: 'translateY(-50%)'
    },

    positionTop: {
        position: 'absolute',
        bottom: '40%',
        left: '50%',
        transform: 'translateX(-50%)',
        animationName: 'topToBottom',
        animationDuration: '2s',
        animationFillMode: 'forwards',
        '&:hover': {
            bottom: '45% !important'
        }
    },
    positionTopClicked: {
        bottom: '45% !important',
        '& $functionText': {
            display: 'none'
        }
    },
    positionLeft: {
        position: 'absolute',
        top: '26%',
        right: '50%',
        display: 'flex',
        alignItems: 'center',
        animationName: 'leftToRight',
        animationDuration: '2s',
        animationFillMode: 'forwards',
        '&:hover': {
            right: '53% !important'
        },
        '& $functionText': {
            margin: '0 20px !important'
        }
    },
    positionLeftClicked: {
        right: '53% !important',
        '& $functionText': {
            display: 'none'
        }
    },
    positionRight: {
        position: 'absolute',
        top: '26%',
        left: '50%',
        display: 'flex',
        alignItems: 'center',
        animationName: 'rightToLeft',
        animationDuration: '2s',
        animationFillMode: 'forwards',
        '&:hover': {
            left: '53% !important'
        },
        '& $functionText': {
            margin: '0 20px !important'
        }
    },

    positionRightClicked: {
        left: '53% !important',
        '& $functionText': {
            display: 'none'
        }
    },
    positionBottom: {
        position: 'absolute',
        top: '42%',
        left: '50%',
        transform: 'translateX(-50%)',
        animationName: 'bottomToTop',
        animationDuration: '2s',
        animationFillMode: 'forwards',
        '&:hover': {
            top: '47% !important'
        }
    },

    positionBottomClicked: {
        top: '47% !important',
        '& $functionText': {
            display: 'none'
        }
    },

    functionText: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: '1.8rem',
        color: theme.palette.text.titleText,
        maxWidth: '14rem',
        margin: '20px',
        animation: 'textAnimation 0s 0.25s forwards',
        visibility: 'hidden'
    },

    delayAnimation: {
        animation: 'textAnimation 0s 6s forwards'
    },

    functionName: {
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '18px',
        color: theme.palette.text.titleText,
        margin: '20px'
    },

    puzzleBlock: {
        position: 'relative',
        height: '200px',
        width: 'auto'
    },

    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },

    applicationCard: {
        width: '50rem',
        position: 'relative',
        borderRadius: '20px',

        '& .MuiCardHeader-root': {
            backgroundColor: '#F17574'
        },
        '& .MuiCardContent-root': {
            padding: '1.6rem !important'
        },
        '& .MuiCardHeader-title': {
            fontSize: '1.8rem',
            fontWeight: 500,
            color: '#0D2744'
        },
        '& .MuiCardHeader-subheader': {
            fontSize: '1.6rem',
            color: '#0D2744'
        }
    },

    applicationList: {
        boxShadow: 'unset',
        backgroundColor: 'unset',
        borderBottom: '.5px solid' + theme.palette.primary.contrastText,

        '& .MuiCardHeader-title': {
            fontSize: '14px',
            lineHeight: '17px',
            fontWeight: 500,
            textAlign: 'center',
            color: theme.palette.primary.contrastText,
            margin: '20px'
        },
        '& .MuiCardHeader-subheader': {
            fontSize: '13px',
            lineHeight: '17px',
            textAlign: 'center',
            color: theme.palette.text.titleText,
            margin: '20px'
        }
    },

    closeIcon: {
        width: '3rem',
        position: 'absolute',
        right: '-5px',
        top: '-10px',
        cursor: 'pointer',
        zIndex: 1
    },

    appList: {
        listStyleType: 'none',
        // columns: 2,
        // listStylePosition: 'inside',
        fontSize: '1.4rem',
        color: theme.palette.text.titleText,
        padding: 'unset',
        margin: 'unset'
    },

    list: {
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        width: '50%',
        '& svg': {
            width: '4rem',
            minWidth: '4rem'
        }
    },

    cardWrapper: {
        position: 'absolute'
    },
    cardLeft: {
        right: 0,
        '& .MuiCardHeader-root': {
            backgroundColor: '#3CBEEC'
        },
        '& svg path': {
            fill: '#3CBEEC !important'
        }
    },
    cardBottom: {
        position: 'absolute',
        left: ' 50%',
        transform: 'translateX(-50%)',
        '& .MuiCardHeader-root': {
            backgroundColor: '#FED300'
        },
        '& svg path': {
            fill: '#FED300 !important'
        }
    },
    cardTop: {
        position: 'absolute',
        bottom: '100%',
        left: ' 50%',
        transform: 'translateX(-50%)',
        '& .MuiCardHeader-root': {
            backgroundColor: '#00B085'
        },
        '& svg path': {
            fill: '#00B085 !important'
        }
    },
    listTile: {
        padding: '10px'
    },

    alignContent: {
        top: theme.spacing(75)
    },
    gridBorder: {
        borderRight: '.5px solid ' + theme.palette.primary.contrastText
    },

    puzzleIcon: {
        minWidth: '115px'
    },

    '@media screen and (min-width: 1367px)': {
        cardTop: {
            bottom: '125%'
        },
        cardBottom: {
            top: '125%'
        }
    }
});

export default singularDashboardStyle;
