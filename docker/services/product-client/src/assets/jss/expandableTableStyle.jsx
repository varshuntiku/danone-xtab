const expandableTableStyle = (theme) => ({
    table: {
        marginBottom: '0',
        width: '100%',
        maxWidth: '100%',
        backgroundColor: 'transparent',
        borderSpacing: '0',
        borderCollapse: 'collapse',
        overflow: 'auto'
    },
    table1: {
        borderLeft: `1px solid ${theme.palette.text.default}20`,
        marginBottom: '0',
        width: '100%',
        maxWidth: '100%',
        backgroundColor: 'transparent',
        borderSpacing: '0',
        borderCollapse: 'collapse',
        overflow: 'auto'
    },
    tableHeadFontSize: {
        fontSize: '1.5rem'
    },
    fontColorContrast: {
        color: theme.palette.text.titleText
    },
    tableCell: {
        fontSize: '1.5rem',
        color: theme.palette.text.default,
        [theme.breakpoints.down('sm')]: {
            minHeight: '24px',
            minWidth: '32px'
        },
        borderbottom: '1px solid ' + theme.palette.text.titleText,
        fontWeight: '400',
        fontFamily: theme.body.B1.fontFamily
    },
    tableHeadCell: {
        backgroundColor: theme.palette.background.tableHeader,
        borderbottom: '1px solid ' + theme.palette.text.titleText,
        color: theme.palette.text.default,
        fontWeight: '500',
        fontFamily: theme.title.h1.fontFamily
    },
    tableRowHover: {
        '&:hover': {
            backgroundColor: theme.palette.primary.light
        }
    },
    container: {
        maxHeight: '90%',
        overflowY: 'auto'
    },
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
    tableCellContentMEDIUMSEAGREEN: {
        backgroundColor: '#3CB371',
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
    bookmarkIcon: {
        height: '3rem',
        width: '3rem',
        cursor: 'pointer',
        stroke: 'orange',
        marginLeft: '1rem'
    },
    actionButton: {
        backgroundColor: theme.palette.primary.contrastText,
        fontSize: '1.5rem',
        padding: '1rem',
        color: theme.palette.primary.dark
    },
    downIcon: {
        fill: theme.HealthCareDashboard.edgelineLight
    },
    tableInner: {
        height: theme.layoutSpacing(40)
    },
    tableOuter: {
        height: theme.layoutSpacing(53)
    },
    outer: {
        backgroundColor: theme.palette.background.tableSelcted
    },
    tableCellSelected: {
        fontWeight: '500'
    },
    innerTableRow: {
        paddingBottom: 0,
        paddingTop: 0,
        paddingLeft: theme.layoutSpacing(8),
        paddingRight: 0
    }
});

export default expandableTableStyle;
