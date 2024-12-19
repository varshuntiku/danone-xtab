const appWidgetTestLearnStyle = (theme) => ({
    sectionHeader: {
        color: theme.palette.text.default,
        textDecoration: 'none',
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.layoutSpacing(16),
        letterSpacing: theme.layoutSpacing(0.5),
        textAlign: 'left',
        padding: theme.spacing(1, 0)
    },
    graphFilterMenuItem: {
        fontSize: '1.5rem',
        color: theme.palette.text.default + ' !important',
        fontFamily: theme.body.B5.fontFamily,
        '&:hover': {
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.background.menuItemHover
        }
    },
    graphFilterMenuItemSelected: {
        fontSize: '1.5rem',
        color: theme.palette.primary.main + ' !important'
    },
    testLearnContainer: {
        padding: theme.spacing(1, 0),
        minHeight: '4.5rem'
    },
    graphOptionContainer: {
        position: 'relative',
        backgroundColor: theme.palette.primary.light,
        borderRadius: theme.spacing(0.5),
        float: 'left'
    },
    graphOptionLabel: {
        float: 'left',
        position: 'relative',
        padding: theme.spacing(0.5, 0),
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(1.5),
        color: theme.palette.text.default,
        fontWeight: 500
    },
    graphOptionValue: {
        float: 'left',
        position: 'relative',
        padding: theme.spacing(0.5, 0),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(4),
        color: theme.palette.primary.contrastText,
        fontFamily: theme.title.h1.fontFamily,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'transparent',
            color: theme.palette.text.default,
            borderRadius: theme.spacing(0.5)
        }
    },
    graphOptionValueType: {
        fontWeight: 700
    },
    graphOptionIcon: {
        position: 'absolute',
        right: theme.spacing(0.5),
        top: theme.spacing(0.5),
        // color: theme.palette.text.default,
        fontWeight: 700
    },
    graphOptionMenu: {
        position: 'absolute'
    },
    graphActions: {
        position: 'relative',
        float: 'right',
        padding: theme.spacing(1, 2, 0, 0)
    },
    simulatorButtons: {
        marginRight: theme.spacing(2)
    },
    itemContianer: {
        borderRight: `1px solid ${theme.palette.text.default}26`,
        padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(24)}`,
        '&:nth-child(3)': {
            borderRight: 'none'
        },
        '&:last-child': {
            borderRight: 'none'
        }
    },
    selectedItem: {
        backgroundColor: theme.palette.background.menuItemFocus
    }
});

export default appWidgetTestLearnStyle;
