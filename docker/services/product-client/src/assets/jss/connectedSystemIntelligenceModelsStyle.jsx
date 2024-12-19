import { alpha } from '@material-ui/core';

const connectedSystemIntelligenceModelsStyle = (theme) => ({
    tableStyle: {
        borderRadius: '4px',
        border: theme.ConnectedSystemDashboard.intellegence.border,
        background: theme.palette.background.modelsView,
        padding: '0.5rem',
        boxShadow: '0px 4px 4px 0px ' + alpha(theme.ConnectedSystemDashboard.shadow, 0.15)
    },
    tableHeadCell: {
        color: theme.palette.text.default,
        fontSize: '1.42rem',
        fontWeight: '600',
        letterSpacing: '0.11rem',
        border: 'none',
        marginBottom: '3rem',
        height: '4rem',
        paddingTop: '1.5rem',
        paddingBottom: '1.5rem'
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
        }
    },
    modelNameStyle: {
        fontSize: '1.42rem',
        color: theme.palette.text.default + 'E5',
        textDecorationLine: 'underline',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.6rem',
        textAlign: 'left'
    },
    tableHeadRow: {
        borderRadius: '3px 3px 0px 0px',
        background: theme.palette.background.modelsViewLight
    },
    tableContentRow: {
        background: theme.palette.background.modelsViewHighLight
    },
    metadataStyle: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'left'
    },
    infoIconStyle: {
        marginLeft: '0.45rem',
        cursor: 'pointer',
        fill: theme.palette.text.inlineCode
    },
    fillerRowStyle: {
        height: '30px',
        '@media (max-width: 1300px)': {
            height: 0
        }
    },
    rowLightStyle: {
        borderBottom: '0.5px solid ' + theme.ConnectedSystemDashboard.intellegence.rowLightBorder,
        background: theme.ConnectedSystemDashboard.intellegence.rowLightBackground
    },
    titleStyle: {
        fontSize: '1.8rem',
        fontWeight: '400',
        color: theme.palette.text.default,
        padding: '1.5rem 0 1.5rem 0.5rem'
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
        textAlign: 'left'
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
    }
});

export default connectedSystemIntelligenceModelsStyle;
