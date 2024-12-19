const loginLayoutStyles = (theme) => ({
    layoutContainer: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        color: '#fff',
        gap: theme.spacing(10)
    },
    headerContainer: {
        width: theme.spacing(75),
        display: 'flex',
        justifyContent: 'center',
        alighItems: 'center'
    },
    formContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '50%',
        [theme.breakpoints.down(768)]: {
            width: 'calc(100% - 8rem)'
        }
    },
    codxLogo: {
        position: 'absolute',
        height: theme.spacing(4),
        left: '3rem',
        top: '50%',
        transform: 'translateY(-45%)',
        fill: theme.palette.primary.contrastText,
        minWidth: '16rem',
        marginBottom: '-0.9rem'
    },
    redesignLayoutContainer: {
        margin: '0rem 4.8rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%'
    },
    topSection: {
        width: 'auto',
        height: '10%'
    },
    midSection: {
        width: 'auto',
        height: '70%'
    },
    bottomSection: {
        width: 'auto',
        height: '10%'
    },
    leftContainer: {
        borderRight: `1px solid ${theme.palette.separator.loginSeprator}`,
        borderLeft: `1px solid ${theme.palette.separator.loginSeprator}`,
        marginTop: '0.5rem',
        marginBottom: '0.5rem'
    },
    rightContainer: {
        borderRight: `1px solid ${theme.palette.separator.loginSeprator}`,
        marginTop: '0.5rem',
        marginBottom: '0.5rem'
    },
    borderTopContainer: {
        marginLeft: '0.5rem',
        marginRight: '0.5rem',
        height: '100%',
        width: 'auto',
        borderTop: `1px solid ${theme.palette.separator.loginSeprator}`,
        marginTop: '-0.5rem'
    },
    borderBottomContainer: {
        borderBottom: `1px solid ${theme.palette.separator.loginSeprator}`,
        height: '108%'
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    loginTitle: {
        opacity: 0.9,
        fontSize: '6.8rem',
        fontWeight: theme.body.B4.fontWeight,
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        color: theme.palette.text.default,
        lineHeight: 'normal'
    },
    titleContainer: {
        display: 'flex',
        gap: '1rem',
        flexDirection: 'column'
    },
    textHolder: {
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        paddingLeft: '3.6rem',
        gap: '10rem',
        flexDirection: 'column',
        marginTop: '4.8rem'
    },
    loginSubTitle: {
        position: 'relative',
        top: '4.4rem',
        fontSize: theme.title.h1.fontSize,
        fontWeight: theme.title.h1.fontWeight,
        fontFamily: theme.body.B1.fontFamily,
        letterSpacing: theme.title.h3.letterSpacing,
        color: theme.palette.text.default,
        lineHeight: '4rem'
    },
    redesignFormContainer: {
        justifyContent: 'center',
        height: '100%'
    },
    helpContainer: {
        display: 'flex',
        gap: '0rem',
        alignItems: 'center'
    },
    helpIcon: {
        width: '2.7rem',
        height: '2.7em',
        color: theme.palette.text.default
    },
    helpText: {
        letterSpacing: '1.5px',
        fontWeight: theme.title.h6.fontWeight,
        fontSize: theme.title.h2.fontSize,
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.default
    },
    separatorContainer: {
        display: 'flex',
        justifyContent: 'space-evenly',
        width: '100%',
        height: '100%',
        marginTop: '1rem',
        position: 'relative'
    },
    separatorVertical: {
        height: 'auto',
        width: '1px',
        background: theme.palette.border.loginGrid,
        marginBottom: '0.2rem',
        opacity: 0.3
    },
    separatorVerticalTransparent: {
        height: 'auto',
        width: '1px',
        background: 'transparent',
        marginBottom: '0.2rem',
        opacity: 0.3
    },
    separatorContainerRight: {
        display: 'flex',
        justifyContent: 'space-evenly',
        width: '100%',
        height: '100%',
        marginTop: '0.5rem'
    },
    separatorVerticalBottom: {
        height: 'auto',
        width: '1px',
        background: theme.palette.border.loginGrid,
        marginBottom: '1rem',
        opacity: 0.3
    },
    separatorContainerBottom: {
        display: 'flex',
        justifyContent: 'space-evenly',
        width: '100%',
        height: '100%',
        marginTop: '1rem',
        position: 'relative'
    },
    separatorContainerMidSection: {
        display: 'flex',
        justifyContent: 'space-evenly',
        width: '100%',
        height: '100%',
        alighItems: 'flex-end',
        marginBottom: '0.5rem'
    },
    gridsContainer: {
        width: 'auto',
        height: '15%',
        marginTop: '0.5rem',
        position: 'relative'
    },
    leftGridsTop: {
        width: theme.spacing(19),
        height: '1px',
        display: 'flex',
        background: theme.palette.border.loginGrid,
        marginLeft: '-115px',
        opacity: 0.3,
        position: 'absolute',
        top: '105%'
    },
    leftGrids: {
        width: theme.spacing(19),
        height: '1px',
        display: 'flex',
        background: theme.palette.border.loginGrid,
        marginLeft: '-115px',
        opacity: 0.3,
        marginBottom: 'var(--marginBottom,0)'
    },
    gridsContainerBottom: {
        width: 'auto',
        height: '15%',
        marginTop: 'auto',
        marginBottom: '-0.25rem'
    },
    separatorHorizontal: {
        height: '1px',
        width: '100%',
        background: theme.palette.border.loginGrid,
        marginRight: '1rem',
        marginLeft: '1rem',
        opacity: 0.3
    },
    separatorHorizontalContainer: {
        display: 'flex',
        justifyContent: 'space-evenly',
        width: 'auto',
        height: 'auto',
        marginLeft: '0rem'
    },
    helpIconHolder: {
        minWidth: '15.1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        cursor: 'pointer',
        position: 'absolute',
        left: '3.6rem',
        top: '50%',
        transform: 'translateY(-60%)'
    },
    separatorContainerMidSectionBottom: {
        display: 'flex',
        justifyContent: 'space-evenly',
        width: '100%',
        height: '96%',
        alighItems: 'flex-end',
        marginTop: '0.5rem'
    },
    gapProvider: {
        height: '2.8rem',
        display: 'block'
    }
});

export default loginLayoutStyles;
