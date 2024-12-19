import { alpha } from '@material-ui/core';

const connectedSystemRedesignModelsStyle = (theme) => ({
    inner: {
        width: '104%',
        marginLeft: '-2%',
        marginTop: '0.5rem',
        borderLeft: `1px solid ${theme.palette.separator.grey}`,
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        marginBottom: '0.5rem'
    },
    inner2: {
        width: '100.5%',
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        marginTop: '0.5rem',
        marginBottom: '0.5rem'
    },
    inner3: {
        width: '100.5%',
        borderRight: `1px solid ${theme.palette.separator.grey}`,
        height: '96%',
        marginTop: '0.5rem'
    },
    outerBottom: {
        borderBottom: `1px solid ${theme.palette.separator.grey}`
        // height:'98%'
    },

    outer: {
        borderTop: `1px solid ${theme.palette.separator.grey}`
        // borderBottom:`1px solid ${theme.palette.separator.grey}`
    },
    tableStyle: {
        '&.MuiTableContainer-root': {
            overflowX: 'inherit'
        }
    },
    tableStyle1: {
        '&.MuiTableContainer-root': {
            overflowX: 'inherit'
        },
        width: '30%'
        // borderTop:`1px solid ${theme.palette.separator.grey}`
    },
    tableStyle2: {
        '&.MuiTableContainer-root': {
            overflowX: 'inherit'
        },
        borderBottom: `1px solid ${theme.palette.separator.grey}`
    },
    tableHeadCell: {
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(15),
        fontWeight: '500',
        letterSpacing: '0.11rem',
        border: 'none',
        marginBottom: '3rem',
        minHeight: '4rem',
        paddingTop: '1.5rem',
        paddingBottom: '1.5rem',
        width: '14rem',
        lineHeight: theme.layoutSpacing(18),
        fontFamily: theme.title.h1.fontFamily
    },
    tableContentCell: {
        color: theme.palette.text.default,
        fontSize: '1.42rem',
        fontWeight: 400,
        border: 'none',
        textAlign: 'center',
        paddingTop: '1.5rem',
        paddingBottom: '1.5rem',
        '& svg': {
            fill: theme.palette.text.default
        },
        width: '14rem'
    },
    centerAlign: {
        textAlign: 'center'
    },
    tableContentCellLeft: {
        color: theme.palette.text.default,
        fontSize: '1.42rem',
        fontWeight: 400,
        border: 'none',
        textAlign: 'center',
        paddingTop: '1.5rem',
        paddingBottom: '1.5rem',
        '& svg': {
            fill: theme.palette.text.default,
            width: theme.layoutSpacing(18),
            height: theme.layoutSpacing(18)
        },
        width: 'fit-content'
    },
    modelNameStyle: {
        fontSize: theme.layoutSpacing(15),
        color: theme.palette.text.default,
        textDecorationLine: 'underline',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.6rem',
        textAlign: 'left',
        fontWeight: 400,
        fontFamily: theme.body.B1.fontFamily,
        lineHeight: theme.layoutSpacing(21),
        letterSpacing: theme.layoutSpacing(1)
    },
    tableHeadRow: {
        borderRadius: '3px 3px 0px 0px',
        height: '9rem'
    },
    tableContentRow: {
        background: theme.palette.background.modelsViewHighLight
    },
    metadataStyle: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'left',
        fontSize: theme.layoutSpacing(15),
        fontWeight: 300,
        letterSpacing: theme.layoutSpacing(0.5),
        lineHeight: theme.layoutSpacing(21),
        fontFamily: theme.body.B1.fontFamily
    },
    infoIconStyle: {
        marginLeft: '0.45rem',
        cursor: 'pointer',
        fill: theme.palette.text.connHighlight,
        width: theme.layoutSpacing(18),
        height: theme.layoutSpacing(18)
    },
    fillerRowStyle: {
        height: '30px'
    },
    rowLightStyle: {},
    titleStyle: {
        fontSize: '1.9rem',
        fontWeight: '500',
        color: theme.palette.text.default,
        padding: '1.5rem 0 1.5rem 0.5rem',
        marginLeft: '2%'
    },
    metadataDialogContentStyle: {
        overflow: 'hidden',
        paddingTop: '4rem',
        paddingBottom: '7rem',
        width: 'inherit',
        display: 'flex',
        alignSelf: 'center'
    },
    dialogTitle: {
        padding: '8px 32px'
    },
    dialogIcon: {
        position: 'absolute',
        top: '0',
        right: '0'
    },
    modelDetailsStyle: {
        textAlign: 'left',
        fontFamily: theme.body.B1.fontFamily,
        fontWeight: 300,
        fontSize: theme.layoutSpacing(15),
        lineHeight: theme.layoutSpacing(21),
        letterSpacing: theme.layoutSpacing(0.5)
    },
    firstColCustomStyle: {
        width: '175px'
    },
    secondColCustomStyle: {
        width: '106px'
    },
    dialogCloseIcon: {
        position: 'absolute',
        top: '0',
        right: '0'
    },
    kpiDiv: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '2.5rem',
        padding: '2rem'
    },
    kpiDialogContentStyle: {
        overflow: 'hidden',
        padding: 0,
        margin: 0,
        paddingTop: '0px !important'
    },
    tableContainer: { display: 'flex', marginLeft: '2%', gap: '1.1rem' },
    bodyHeight: {
        height: '100%'
    },
    tableHolder: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    }
    // service:{
    //     whiteSpace:'nowrap'
    // }
});

export default connectedSystemRedesignModelsStyle;
