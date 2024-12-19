const appWidgetGanttTableStyle = (theme) => ({
    ganttTableHeader: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontSize: '1.5rem',
        border: '1px solid ' + theme.palette.primary.main,
        textAlign: 'left',
        paddingLeft: theme.spacing(1),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    ganttTableCell: {
        backgroundColor: 'transparent',
        color: theme.palette.text.default,
        border: '1px solid transparent',
        fontSize: '1.5rem',
        textAlign: 'left',
        paddingLeft: theme.spacing(1),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    ganttTableCellEmpty: {
        backgroundColor: 'transparent',
        color: 'transparent',
        border: '1px solid transparent',
        fontSize: '1.5rem',
        textAlign: 'left',
        paddingLeft: theme.spacing(1),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    ganttTableCellSelectable: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.light,
        border: '1px solid ' + theme.palette.primary.light,
        fontSize: '1.5rem',
        textAlign: 'left',
        paddingLeft: theme.spacing(1),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        cursor: 'pointer',
        '&:hover': {
            opacity: 0.5
        }
    },
    ganttTableCellBreak: {
        backgroundColor: '#d1d1d1',
        color: '#d1d1d1',
        border: '1px solid #d1d1d1',
        fontSize: '1.5rem',
        textAlign: 'left',
        paddingLeft: theme.spacing(1),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    ganttTableCellSelected: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.light,
        border: '1px solid ' + theme.palette.primary.contrastText,
        fontSize: '1.5rem',
        textAlign: 'left',
        paddingLeft: theme.spacing(1),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        cursor: 'pointer',
        '&:hover': {
            opacity: 0.5
        },
        borderRadius: theme.spacing(0.5)
    },
    ganttTableCellExtra0: {
        backgroundColor: '#b1b1b1',
        color: '#000',
        border: '1px solid #b1b1b1',
        fontSize: '1.5rem',
        textAlign: 'left',
        paddingLeft: theme.spacing(1),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        borderRadius: theme.spacing(0.5)
    },
    ganttTableCellExtra1: {
        backgroundColor: '#F5E07E',
        color: '#000000',
        border: '1px solid #F5E07E',
        fontSize: '1.5rem',
        textAlign: 'left',
        paddingLeft: theme.spacing(1),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        borderRadius: theme.spacing(0.5)
    },
    ganttTableCellMain0: {
        backgroundColor: '#42E4BC',
        color: '#000000',
        border: '1px solid #42E4BC',
        fontSize: '1.5rem',
        textAlign: 'left',
        paddingLeft: theme.spacing(1),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        borderRadius: theme.spacing(0.5)
    },
    ganttTableCellMain1: {
        backgroundColor: '#FFAD69',
        color: '#000000',
        border: '1px solid #FFAD69',
        fontSize: '1.5rem',
        textAlign: 'left',
        paddingLeft: theme.spacing(1),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        borderRadius: theme.spacing(0.5)
    },
    ganttTableCellMain2: {
        backgroundColor: '#FE6A9C',
        color: '#000000',
        border: '1px solid #FE6A9C',
        fontSize: '1.5rem',
        textAlign: 'left',
        paddingLeft: theme.spacing(1),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        borderRadius: theme.spacing(0.5)
    },
    ganttTableCellMain3: {
        backgroundColor: '#7ACFFF',
        color: '#000000',
        border: '1px solid #7ACFFF',
        fontSize: '1.5rem',
        textAlign: 'left',
        paddingLeft: theme.spacing(1),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        borderRadius: theme.spacing(0.5)
    },
    ganttTableCellMain4: {
        backgroundColor: '#AA7EF0',
        color: '#000000',
        border: '1px solid #AA7EF0',
        fontSize: '1.5rem',
        textAlign: 'left',
        paddingLeft: theme.spacing(1),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        borderRadius: theme.spacing(0.5)
    },
    actionOptionMenuItem: {
        fontSize: '1.5rem',
        color: theme.palette.primary.contrastText + ' !important',
        '&:hover': {
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.light
        }
    },
    actionOptionMenuItemSelected: {
        fontSize: '1.5rem',
        color: theme.palette.primary.main + ' !important',
        backgroundColor: theme.palette.primary.contrastText + ' !important'
    },
    graphOptionContainer: {
        float: 'right',
        position: 'relative',
        backgroundColor: theme.palette.primary.light,
        borderRadius: theme.spacing(0.5),
        width: '100%',
        zIndex: '100'
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
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.primary.contrastText,
            color: theme.palette.primary.dark,
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
    filterMenuContainer: {
        maxHeight: '30rem'
    }
});

export default appWidgetGanttTableStyle;
