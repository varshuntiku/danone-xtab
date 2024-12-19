const appWidgetFlowTableStyle = (theme) => ({
    appWidgetFlowTableContainer: {
        position: 'relative'
    },
    appWidgetFlowTableLabel: {
        color: theme.palette.text.default,
        paddingBottom: theme.spacing(1),
        width: '100%',
        textAlign: 'center',
        position: 'relative'
    },
    appWidgetFlowTableSubLabel: {
        paddingBottom: theme.spacing(10),
        width: '100%',
        textAlign: 'center',
        position: 'relative'
    },
    appWidgetFlowTableSubLabelRed: {
        width: '100%',
        textAlign: 'center',
        paddingBottom: theme.spacing(10),
        color: theme.palette.error.main,
        position: 'relative'
    },
    appWidgetFlowTableSubLabelGreen: {
        width: '100%',
        textAlign: 'center',
        paddingBottom: theme.spacing(10),
        color: theme.palette.success.main,
        position: 'relative'
    },
    appWidgetFlowTableGridItem: {
        position: 'relative'
    },
    appWidgetFlowTableItemHeaderContainer: {
        color: theme.palette.text.default,
        position: 'absolute',
        top: '-' + theme.spacing(5),
        width: '100%',
        textAlign: 'center'
    },
    appWidgetFlowTableItemHeader: {
        backgroundColor: theme.palette.primary.light,
        padding: theme.spacing(1)
    },
    appWidgetFlowTableItemIncomingContainer: {
        color: theme.palette.primary.contrastText,
        position: 'absolute',
        top: '-' + theme.spacing(3.5),
        right: '-' + theme.spacing(10),
        zIndex: 1000
    },
    appWidgetFlowTableItemIncoming: {},
    appWidgetFlowTableItemIncomingLeftIcon1: {
        fontSize: theme.spacing(6),
        position: 'absolute',
        left: '-' + theme.spacing(5),
        top: '-' + theme.spacing(1.75)
    },
    appWidgetFlowTableItemIncomingLeftIcon2: {
        fontSize: theme.spacing(6),
        position: 'absolute',
        left: '-' + theme.spacing(9),
        top: '-' + theme.spacing(1.75)
    },
    appWidgetFlowTableItemIncomingRightIcon1: {
        fontSize: theme.spacing(6),
        position: 'absolute',
        right: '-' + theme.spacing(5),
        top: '-' + theme.spacing(1.75)
    },
    appWidgetFlowTableItemIncomingRightIcon2: {
        fontSize: theme.spacing(6),
        position: 'absolute',
        right: '-' + theme.spacing(9),
        top: '-' + theme.spacing(1.75)
    },
    appWidgetFlowTableItemTable: {},
    appWidgetFlowTableHead: {
        height: '10rem'
    },
    appWidgetFlowTablecellValue: {},
    appWidgetFlowTablecellValueRed: {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.text.white
    },
    appWidgetFlowTablecellValueYellow: {
        backgroundColor: '#ffd330',
        color: theme.palette.text.black
    },
    appWidgetFlowTablecellValueGreen: {
        backgroundColor: '#007f00',
        color: theme.palette.text.white
    },
    appWidgetFlowTableIcon: {
        fontSize: '2rem',
        cursor: 'pointer',
        color: theme.palette.primary.contrastText
    },
    appWidgetFlowTableIconRed: {
        fontSize: '2rem',
        cursor: 'pointer',
        color: theme.palette.error.main + ' !important'
    },
    appWidgetFlowTableCalloutContainer: {
        paddingTop: theme.spacing(2)
    },
    appWidgetFlowTableCalloutText: {
        padding: theme.spacing(1),
        textAlign: 'center',
        backgroundColor: theme.palette.primary.contrastText
    }
});

export default appWidgetFlowTableStyle;
