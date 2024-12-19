const breadcrumbStyle = (theme) => ({
    hide: {
        display: 'none'
    },
    breadcrumbTabsContainer: {
        position: 'relative',
        backgroundColor: theme.palette.primary.dark
    },
    selectAllItems: {
        position: 'relative',
        display: 'flex',
        backgroundColor: theme.palette.primary.dark,
        paddingTop: '0.5rem'
    },
    breadcrumbTabsContainerEmpty: {
        position: 'relative'
    },
    breadcrumbTabItemContainer: {
        position: 'relative',
        float: 'left',
        fontSize: theme.layoutSpacing(18),
        lineHeight: 'normal',
        fontWeight: 'normal',
        letterSpacing: 0,
        color: theme.palette.text.default,
        padding: `${theme.layoutSpacing(8)} ${theme.layoutSpacing(4)}`,
        borderBottom: theme.spacing(0.3) + ' solid transparent',
        textDecoration: 'none',
        '&:hover': {
            backgroundColor: theme.palette.separator.tableContent,
            borderRadius: theme.spacing(0.5)
        },
        textTransform: theme.title.h1.textTransform,
        fontFamily: theme.body.B1.fontFamily
    },
    breadcrumbTabItemContainerSelected: {
        position: 'relative',
        float: 'left',
        fontSize: theme.layoutSpacing(18),
        lineHeight: 'normal',
        fontWeight: 500,
        letterSpacing: 0,
        color: theme.palette.text.sidebarSelected,
        borderBottom: theme.spacing(0.3) + ' solid ' + theme.palette.text.sidebarSelected,
        textDecoration: 'none',
        borderRadius: theme.spacing(0.5, 0.5, 0, 0),
        textTransform: 'capitalize',
        fontFamily: theme.body.B1.fontFamily,
        padding: `${theme.layoutSpacing(8)} ${theme.layoutSpacing(4)}`
    },
    breadcrumbItemContainer: {
        position: 'relative',
        fontSize: '1.5rem',
        lineHeight: '1.6rem',
        fontWeight: 500,
        letterSpacing: '0.05rem',
        color: theme.palette.primary.main,
        padding: theme.spacing(3, 2, 2, 0),
        textDecoration: 'none'
    }
});

export default breadcrumbStyle;
