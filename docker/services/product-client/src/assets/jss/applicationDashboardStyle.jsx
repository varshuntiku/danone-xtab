const applicationDashboardStyle = (theme) => ({
    root: {},
    appContainer: {
        color: theme.palette.text.default,
        fontSize: '2.2rem'
    },
    appHeaderInnerBox: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    inputConatiner: {
        width: theme.layoutSpacing(472),
        margin: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(48)}`,
        position: 'relative'
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
    },
    appContainerHeader: {
        padding: `${theme.layoutSpacing(28)} ${theme.layoutSpacing(0)}`,
        fontSize: theme.layoutSpacing(44),
        fontFamily: theme.title.h1.fontFamily,
        display: 'flex',
        fontWieght: '300',
        alignItems: 'center'
    },
    backIcon: {
        color: `${theme.palette.text.revamp} !important`,
        fontSize: theme.spacing(4)
    },
    iconBtn: {
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    headSection: {
        marginLeft: theme.layoutSpacing(16),
        width: `calc(100% - ${theme.layoutSpacing(32)})!important`
    },
    appCard: {
        margin: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(16)}`,
        position: 'relative'
    },
    appEnvContainer: {
        paddingLeft: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        display: 'flex',
        gap: '0.5rem'
    },
    appEnvTagPreview: {
        fontSize: '1.5rem',
        borderRadius: theme.spacing(0.5),
        backgroundColor: theme.palette.background.envLabel,
        fontColor: theme.palette.primary.dark,
        padding: '0.2rem 0.4rem'
    },
    appEnvTagProd: {
        float: 'left',
        fontSize: '1.5rem',
        borderRadius: theme.spacing(0.5),
        backgroundColor: theme.palette.background.prodEnvLabel,
        fontColor: theme.palette.primary.dark,
        padding: '0.2rem 0.4rem'
    }
});

export default applicationDashboardStyle;
