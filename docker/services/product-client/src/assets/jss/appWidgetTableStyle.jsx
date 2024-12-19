import zIndex from '@material-ui/core/styles/zIndex';

const appWidgetTableStyle = (theme) => ({
    '@global': {
        '*::-webkit-scrollbar-track': {
            marginTop: theme.layoutSpacing(44),
            marginLeft: theme.layoutSpacing(16)
        }
    },
    multiTableLabel: {
        fontSize: '1.75rem',
        color: theme.palette.text.default,
        fontWeight: 300,
        padding: theme.spacing(1, 0),
        textDecoration: 'underline',
        position: 'relative'
    },
    tableContainerRoot: {
        maxHeight: 'calc(100% - ' + theme.spacing(2) + ')',
        position: 'relative',
        overflowY: 'auto' //keeping this as absolute distorts the table in assumption pop-ups
    },
    downloadButton: {
        backgroundColor: 'transparent',
        border: '1px solid ' + theme.palette.primary.contrastText,
        color: theme.palette.primary.contrastText,
        borderRadius: theme.spacing(0.5),
        cursor: 'pointer',
        position: 'absolute',
        top: theme.spacing(2),
        right: 0,
        '&:hover': {
            opacity: '0.75',
            backgroundColor: theme.palette.primary.light,
            border: '1px solid ' + theme.palette.primary.contrastText,
            color: theme.palette.primary.contrastText
        }
    },
    tableCellContent: {},
    tableCellContentGREEN: {
        backgroundColor: theme.palette.success.main,
        color: theme.palette.text.default
    },
    tableCellContentYELLOW: {
        backgroundColor: theme.palette.warning.main,
        color: theme.palette.text.default
    },
    tableCellContentRED: {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.text.default
    },
    tableCellContentGRADIENT1: {
        backgroundColor: '#BFBFFF',
        color: theme.palette.text.black
    },
    tableCellContentGRADIENT2: {
        backgroundColor: '#A3A3FF',
        color: theme.palette.text.black
    },
    tableCellContentGRADIENT3: {
        backgroundColor: '#7879FF',
        color: theme.palette.text.black
    },
    tableCellContentGRADIENT4: {
        backgroundColor: '#4949FF',
        color: theme.palette.text.white
    },
    icon: {
        fontSize: '2rem'
    },
    bookmarkIcon: {
        height: '3rem',
        width: '3rem',
        cursor: 'pointer',
        stroke: '#FFC700'
    },
    highLightCell: {
        backgroundColor: theme.palette.background.highlightText,
        color: theme.palette.text.default
    },
    downloadIcon: {
        marginRight: '1rem',
        padding: '1rem',
        float: 'right',
        '& svg': {
            fill: theme.palette.text.default
        }
    },
    colExpansionThumbHovered: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '3px',
        minWidth: '3px',
        cursor: 'col-resize',
        height: '90%',
        backgroundColor: 'transparent',
        '&:after': {
            content: '""',
            position: 'absolute',
            right: 0,
            top: '10%',
            width: '1px',
            minWidth: '1px',
            height: '90%',
            backgroundColor: theme.palette.border.tableDivider
        }
    },
    colExpansionThumbHoveredBody: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '1px',
        minWidth: '1px',
        cursor: 'col-resize',
        height: '100%',
        backgroundColor: theme.palette.border.tableDivider
    },

    rowExpansionHandle: {
        height: '1px',
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: theme.palette.border.tableDivider
        }
    },
    frozenRow: {
        backgroundColor: '#e0f7fa !important' /* Light background for frozen rows */,
        zIndex: '1000 !important' /* Ensure frozen rows are on top */,
        position: 'sticky !important' /* To keep the row in a fixed position */
    },
    noTextSelect: {
        userSelect: 'none' /* Standard */,
        WebkitUserSelect: 'none' /* Safari */,
        MozUserSelect: 'none' /* Firefox */,
        msUserSelect: 'none' /* Internet Explorer/Edge */
    },
    lockIconStyle: {
        position: 'absolute',
        left: '0',
        marginRight: '8px',
        cursor: 'pointer',
        visibility: 'hidden' /* Default visibility */
    },

    lockIconVisibleStyle: {
        visibility: 'visible'
    },
    iconplacement: {
        display: 'flex',
        gap: '4px'
    },
    lockoutlinedicon: {
        '& svg': {
            fill: theme.palette.text.default,

            cursor: 'pointer',
            fontSize: '18px !important'
        }
    },
    sorticon: {
        '& svg': {
            fill: theme.palette.text.default,

            width: '10!important',
            height: '10 !important'
        }
    },
    freezingsticky: {
        position: 'sticky',

        backgroundColor: theme.palette.background.freezeCol
    },

    tableBody: {}
});

export default appWidgetTableStyle;
