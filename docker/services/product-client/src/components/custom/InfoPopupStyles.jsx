const infPopupStyles = (theme) => ({
    assumptionsIcon: {
        cursor: 'pointer',
        zIndex: 2,
        height: '2rem !important',
        width: '2rem !important',
        '& svg': {
            fill: `${theme.palette.primary.contrastText} !important`
        }
    },
    iconContainer: {
        position: 'relative',
        width: theme.layoutSpacing(30),
        height: theme.layoutSpacing(30),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        marginLeft: '1rem',
        marginTop: '-1rem',
        '&:hover': {
            backgroundColor: theme.palette.background.plainBtnBg,
            cursor: 'pointer'
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
        textTransform: 'none'
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
    popOverTitle: {
        display: 'flex',
        width: '100% !important',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '1.6rem',
        position: 'relative',
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`
    },

    popOverTitleText: {
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontSize: '1.67rem',
        color: theme.palette.text.titleText
    },
    contentText: {
        paddingTop: '1.67rem',
        color: theme.palette.text.default,
        maxHeight: theme.spacing(29),
        lineHeight: theme.layoutSpacing(24),
        fontSize: '1.67rem',
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
        backgroundColor: theme.palette.background.modelBackground,
        padding: 0,
        margin: 0,
        color: theme.palette.text.default,
        maxHeight: theme.spacing(29),
        lineHeight: theme.layoutSpacing(24),
        fontSize: '1.67rem',
        overflow: 'hidden',
        overflowWrap: 'break-word'
    },
    toolTip: {
        position: 'relative',
        backgroundColor: theme.palette.background.modelBackground,
        border: `1px solid ${theme.palette.border.loginGrid}`,
        color: `${theme.palette.text.default} !important`,
        maxWidth: theme.spacing(60),
        overflowY: 'scroll',
        fontSize: '1.67rem',
        overflowWrap: 'break-word',
        padding: '1.6rem',
        opacity: '1 !important',
        borderRadius: '0 !important',

        '& img': {
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '1rem',
            maxWidth: '100%',
            height: 'auto',
            objectFit: 'contain'
        },
        '& .MuiTypography-root': {
            fontSize: '1.67rem'
        }
    }
});

export default infPopupStyles;
