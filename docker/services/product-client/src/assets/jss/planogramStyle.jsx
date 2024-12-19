import { alpha } from '@material-ui/core';

const planogramStyle = (theme, themeMode = localStorage.getItem('codx-products-theme')) => ({
    planogramBody: {
        // height: 'calc(100% - ' + theme.spacing(2) + ')',
        height: '100%'
    },
    planogramGenAIContainer: {
        height: '5vh',
        marginLeft: '3.5rem',
        color: theme.palette.text.default,
        borderBottom: '1px solid ' + alpha(theme.palette.text.default, 0.6),
        display: 'flex'
    },
    planogramHeader: {},
    planogramUploadButton: {
        height: '3.5vh',
        backgroundColor: theme.palette.primary.contrastText,
        marginLeft: 'auto',
        color: theme.palette.primary.dark,
        borderRadius: '0px',
        '& svg': {
            color: theme.palette.primary.dark
        },
        '& .MuiButton-text:hover': {
            color: theme.palette.primary.dark,
            backgroundColor: theme.palette.primary.contrastText
        }
    },
    planogramShelfContainer: {
        float: 'left',
        width: '75%',
        // height: 'calc(100% - ' + theme.spacing(2) + ')',
        height: '65vh',
        marginTop: '1vh',
        overflowY: 'scroll'
    },
    planogramShelfContainerLarge: {
        float: 'left',
        width: '75%',
        // height: 'calc(100% - ' + theme.spacing(2) + ')',
        height: '74vh',
        marginTop: '1vh',
        overflowY: 'scroll'
    },
    planogramShelf: {
        width: '90%',
        height: '100%',
        marginLeft: '3.5rem'
    },
    planogramShelfLarge: {
        width: '95%',
        height: '100%',
        marginLeft: '3.5rem'
    },
    planogramMetricsContainer: {
        float: 'left',
        width: '25%',
        height: '65vh',
        marginTop: '1vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themeMode === 'dark' ? '#091F3A' : theme.palette.primary.dark,
        overflowY: 'scroll'
    },
    planogramMetricsContainerLarge: {
        float: 'left',
        width: '25%',
        height: '74vh',
        marginTop: '1vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themeMode === 'dark' ? '#091F3A' : theme.palette.primary.dark,
        overflowY: 'scroll'
    },
    planogramBottomContainer: {
        height: '5vh',
        width: '100%',
        paddingTop: '1vh',
        display: 'flex',
        flexDirection: 'row-reverse'
    },
    planogramChatIcon: {
        height: '6rem',
        width: '6rem',
        color: theme.palette.primary.contrastText,
        marginRight: '5rem',
        cursor: 'pointer'
    },
    uploadAnalyticsIcon: {
        height: '3rem',
        width: '3rem',
        color: theme.palette.primary.contrastText,
        cursor: 'pointer'
    },
    planogramMetrics: {
        height: '95%',
        width: '95%'
    },
    planogramShelfRowWithBorder: {
        borderBottom: theme.spacing(2) + ' solid ' + theme.palette.text.default + '3',
        height: '20%',
        width: '100%'
    },
    planogramShelfRowWithoutBorder: {
        borderBottom: theme.spacing(2) + ' solid ' + theme.palette.text.default + '0',
        height: '20%',
        width: '100%'
    },
    planogramShelfUnit: {
        float: 'left',
        border: theme.spacing(0.35) + ' solid ' + theme.palette.text.default + '3',
        height: '100%',
        margin: theme.spacing(0.5, 0.2)
    },
    planogramShelfUnitDropEnter: {
        float: 'left',
        border: theme.spacing(0.5) + ' solid ' + theme.palette.success.main,
        height: theme.spacing(17),
        margin: theme.spacing(0.5, 0.2),
        backgroundColor: theme.palette.success.main
    },
    planogramShelfUnitDraggable: {
        cursor: 'move',
        height: '100%',
        width: '100%'
    },
    planogramShelfUnitSKU: {
        float: 'left',
        height: '100%',
        position: 'relative'
    },
    planogramShelfUnitSKUImage: {
        maxHeight: '90%',
        position: 'absolute',
        bottom: 0,
        width: '100%'
    },
    planogramShelfUnitEmpty: {
        position: 'relative',
        width: '100%',
        height: '100%'
    },
    planogramShelfUnitAddIcon: {
        position: 'absolute',
        top: '45%',
        left: '45%',
        color: theme.palette.success.main,
        cursor: 'pointer'
    },
    planogramMetricContainer: {
        height: '15%',
        backgroundColor: theme.palette.primary.light,
        padding: theme.spacing(1, 2),
        borderRadius: theme.spacing(0.5)
        // margin: theme.spacing(0, 2)
    },
    planogramMetricStatus: {
        height: '50%',
        display: 'flex'
    },
    planogramMetricLabel: {
        fontSize: '2rem',
        color: theme.palette.text.default,
        fontWeight: '500'
    },
    planogramMetricValue: {
        marginLeft: 'auto',
        fontSize: '2rem',
        color: theme.palette.primary.contrastText,
        marginRight: theme.spacing(2)
    },
    planogramMetricValueWaiting: {
        marginLeft: 'auto',
        fontSize: '2rem',
        color: theme.palette.error.main,
        marginRight: theme.spacing(2)
    },
    planogramMetricValueDate: {
        fontSize: '1.5rem',
        color: theme.palette.text.default
        // fontStyle: 'italic',
        // marginRight: theme.spacing(2)
    },
    planogramActionButton: {
        float: 'right',
        margin: theme.spacing(2)
    },
    planogramSkuListHeader: {
        color: theme.palette.text.default,
        fontSize: theme.spacing(2),
        paddingTop: theme.spacing(2.5),
        paddingBottom: theme.spacing(1)
    },
    planogramSkuListTypes: {
        width: '100%',
        height: '6%',
        border: '1px solid ' + theme.palette.primary.contrastText,
        borderRadius: '0px'
    },
    planogramSkuList: {
        maxHeight: '75%',
        overflowY: 'auto',
        paddingTop: theme.spacing(2.5)
    },
    planogramSkuItem: {
        borderRadius: theme.spacing(0.5),
        cursor: 'move',
        border: theme.spacing(0.25) + ' dashed ' + theme.palette.primary.light,
        backgroundColor: theme.palette.primary.light,
        position: 'relative',
        height: theme.spacing(7.5),
        marginBottom: theme.spacing(1)
    },
    planogramSkuItemLabel: {
        float: 'left',
        paddingRight: theme.spacing(5),
        paddingLeft: theme.spacing(2),
        color: theme.palette.primary.contrastText,
        fontWeight: '400',
        fontSize: '1.5rem',
        height: theme.spacing(6)
    },
    planogramSkuItemImageContainer: {
        right: theme.spacing(4),
        top: 0,
        height: theme.spacing(6),
        width: theme.spacing(4),
        position: 'absolute'
    },
    planogramSkuItemImage: {
        objectFit: 'contain',
        position: 'absolute',
        bottom: 0,
        width: '100%'
    },
    planogramSkuItemInfo: {
        position: 'absolute',
        top: theme.spacing(0.5),
        right: theme.spacing(1),
        cursor: 'pointer'
    },
    planogramSkuListSearch: {},
    actionsButton: {
        position: 'absolute',
        right: theme.spacing(3),
        top: theme.spacing(2),
        cursor: 'pointer',
        '&:hover': {
            color: theme.palette.primary.contrastText
        }
    },
    actionsMenuLoaderContainer: {
        width: theme.spacing(4),
        height: '100%',
        position: 'relative'
    },
    buttonLoaderContainer: {
        width: theme.spacing(4),
        height: '100%',
        position: 'relative'
    },
    buttonLoader: {
        position: 'absolute',
        top: '-' + theme.spacing(5),
        left: '-' + theme.spacing(2.5),
        width: theme.spacing(10)
    },
    actionsMenuIcon: {
        marginRight: theme.spacing(1),
        '&:hover': {
            color: theme.palette.primary.contrastText
        }
    },
    buttonGroupActive: {
        borderRadius: '0px',
        borderColor: theme.palette.primary.contrastText + ' !important',
        width: '25%',
        '& .MuiButton-label': {
            fontSize: '1.3rem'
        }
    },
    buttonGroup: {
        backgroundColor: theme.palette.primary.light,
        color: alpha(theme.palette.text.default, 0.6),
        borderRadius: '0px',
        borderColor: theme.palette.primary.contrastText + ' !important',
        width: '25%',
        '& .MuiButton-label': {
            fontSize: '1.3rem',
            color: theme.palette.text.default
        }
    },
    skuItemTooltip: {
        fontSize: '1rem',
        whiteSpace: 'pre-line'
    },
    searchInputContainer: {
        margin: '0rem 1.6rem',
        marginTop: '2rem'
    },
    searchInput: {
        width: '100%',
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        '& .MuiOutlinedInput-root': {
            color: theme.palette.text.default,
            fontSize: '1.6rem',
            padding: '2rem 1.5rem'
        },
        '& .MuiButtonBase-root': {
            margin: '0px'
        },
        '& input': {
            color: 'red',
            fontSize: '1.6rem',
            padding: '2rem 1.5rem'
        },
        '& button': {
            // padding: '1.3rem'
        },
        '& button svg': {
            color: alpha(theme.palette.text.default, 0.7)
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.text.default, 0.3)
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.text.default, 0.4)
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.contrastText,
            borderWidth: 2
        }
    }
});

export default planogramStyle;
