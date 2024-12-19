const connSystemDashboardAdminStyle = (theme) => ({
    connSystemDashboardContainer: {
        background: theme.palette.primary.dark,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        paddingBottom: theme.spacing(2),
        boxSizing: 'border-box',
        '& *': {
            boxSizing: 'border-box'
        },
        '@media (max-width: 1400px)': {
            overflow: 'auto'
        }
    },
    connSystemDashboardBody: {
        height: '100%',
        position: 'relative',
        '@media (max-height: 600px)': {
            height: 'calc(100% - 6rem)'
        },
        '@media (max-height: 560px)': {
            height: 'calc(100% - 12rem)'
        }
    },
    wrapper: {
        display: 'flex',
        height: 'calc(100% - 5.4rem)',
        width: '100%',
        paddingRight: theme.layoutSpacing(16),
        paddingBottom: theme.layoutSpacing(8),
        background: theme.palette.background.paper
    },
    bodyContent: {
        height: 'auto',
        width: '100%',
        overflow: 'auto',
        background: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        marginTop: theme.layoutSpacing(8)
    },
    appAdminContainer: {
        padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(24)}`,
        height: 'calc(100%)',
        overflowY: 'auto'
    },
    drawer: {
        width: 'calc(100% - 82.5%)'
    },
    drawerClose: {
        width: '3.025%',
        transition: 'width 300ms ease'
    },
    footer_first: {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        gap: theme.layoutSpacing(8),
        paddingLeft: theme.layoutSpacing(28)
    },
    footer_version: {
        textTransform: 'uppercase',
        color: theme.palette.border.dashboard,
        fontFamily: theme.body.B3.fontFamily,
        fontSize: theme.body.B3.fontSize,
        fontWeight: theme.body.B3.fontWeight,
        lineHeight: '2.1rem',
        letterSpacing: theme.body.B3.letterSpacing
    }
});

export default connSystemDashboardAdminStyle;
