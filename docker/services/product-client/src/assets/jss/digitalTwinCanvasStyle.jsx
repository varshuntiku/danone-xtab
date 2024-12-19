import { getThemeProps } from '@material-ui/styles';

const digitalTwinCanvasStyle = (theme) => ({
    digitalTwinOptionContainer: {
        height: '100%',
        width: '100%',
        zIndex: '2',
        position: 'absolute'
    },
    digitalTwinOptionLabel: {},
    digitalTwinVideoContainer: {
        height: '100%',
        width: 'auto',
        position: 'relative'
    },
    digitalTwinVideo: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        objectFit: 'fill'
    },
    digitalTwinCanvasContainer: {
        height: '100%',
        width: '100%',
        position: 'absolute'
    },
    digitalTwinPopup: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: '3',
        backgroundColor: theme.palette.primary.light,
        border: '1px solid ' + theme.palette.primary.dark,
        height: '100%',
        overflowY: 'auto',
        padding: theme.spacing(2, 3),
        boxShadow: '-9px 10px 16px 3px ' + theme.palette.background.selected,
        transition: 'all 1s'
    },
    digitalTwinPopupHidden: {
        display: 'none',
        transition: 'all 1s'
    },
    digitalTwinPopupDropdown: {
        float: 'left',
        marginLeft: theme.spacing(2),
        '& > .MuiInput-root > .MuiSelect-root > .MuiListItemText-root': {
            paddingLeft: theme.spacing(1),
            textTransform: 'uppercase',
            color: theme.palette.text.default
        },
        '& > .MuiInput-root > .MuiSelect-root > .MuiListItemText-root > .MuiTypography-root': {
            fontSize: '1.25rem',
            color: theme.palette.text.default
        },
        '& > .MuiFormControl-root > .MuiFormLabel-root': {
            paddingLeft: theme.spacing(1),
            fontSize: '1.25rem',
            textTransform: 'uppercase',
            color: theme.palette.text.default
        },
        '& > .MuiInput-root': {
            margin: theme.spacing(1),
            color: theme.palette.text.default
        },
        '& > .MuiInput-underline:after, & > .MuiInput-underline:before': {
            borderColor: theme.palette.text.default + ' !important'
        },
        '& svg': {
            color: theme.palette.text.default
        }
    },
    digitalTwinPopupDropdownMultiple: {
        float: 'left',
        marginLeft: theme.spacing(2),
        '& > .MuiFormControl-root > .MuiFormLabel-root': {
            paddingLeft: theme.spacing(1),
            fontSize: '1.25rem',
            textTransform: 'uppercase',
            color: theme.palette.text.default
        },
        '& > .MuiInput-root': {
            paddingLeft: theme.spacing(1),
            textTransform: 'uppercase',
            fontSize: '1.25rem',
            margin: theme.spacing(2, 1),
            color: theme.palette.text.default
        },
        '& > .MuiInput-underline:after, & > .MuiInput-underline:before': {
            borderColor: theme.palette.text.default + ' !important'
        },
        '& svg': {
            color: theme.palette.text.default
        },
        '& label.Mui-focused': {
            color: theme.palette.text.default,
            fontSize: '1.8rem'
        },
        '& label': {
            fontSize: '1.5rem',
            color: theme.palette.text.default
        },
        '& .MuiSvgIcon-root': {
            fontSize: '25px',
            color: theme.palette.text.titleText
        }
    },
    digitalTwinPopupDropdownMenuItem: {
        '& > .MuiListItemText-root > .MuiTypography-root': {
            fontSize: '1.25rem',
            color: theme.palette.text.default
        },
        '&.Mui-selected > .MuiListItemText-root > .MuiTypography-root': {
            color: theme.palette.primary.contrastText
        }
    },
    digitalTwinDetailsDrawer: {
        width: theme.spacing(150)
    },
    digitalTwinDetailsSimulate: {
        width: theme.spacing(175)
    },
    digitalTwinMetricAction: {
        zIndex: '5',
        width: theme.spacing(150)
    },
    drawerDropdown: {
        float: 'none',
        width: theme.spacing(20),
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(0)
    },
    actionFiltersContainer: {
        height: 'calc(100% - ' + theme.spacing(2) + ')',
        marginBottom: theme.spacing(1),
        '& > .MuiInput-root > .MuiSelect-root > .MuiListItemText-root': {
            // color: theme.palette.primary.light,
            // backgroundColor: theme.palette.text.default
            paddingLeft: theme.spacing(1),
            textTransform: 'uppercase',
            color: theme.palette.text.default
        },
        '& > .MuiInput-root > .MuiSelect-root > .MuiListItemText-root > .MuiTypography-root': {
            fontSize: '1.25rem',
            color: theme.palette.text.default
        },
        '& > .MuiFormControl-root > .MuiFormLabel-root': {
            paddingLeft: theme.spacing(1),
            fontSize: '1.25rem',
            textTransform: 'uppercase',
            color: theme.palette.text.default
        },
        '& > .MuiFormControl-root > .MuiInput-root > .MuiSelect-root > .MuiListItemText-root': {
            // color: theme.palette.primary.light,
            // backgroundColor: theme.palette.text.default
            paddingLeft: theme.spacing(1),
            textTransform: 'uppercase',
            color: theme.palette.text.default
        },
        '& > .MuiFormControl-root > .MuiInput-root > .MuiSelect-root > .MuiListItemText-root > .MuiTypography-root':
            {
                fontSize: '1.25rem',
                color: theme.palette.text.default
            }
    },
    actionFiltersDropdownMenuItem: {
        '& > .MuiListItemText-root > .MuiTypography-root': {
            fontSize: '1.25rem',
            color: theme.palette.text.default
        },
        '&.Mui-selected > .MuiListItemText-root > .MuiTypography-root': {
            color: theme.palette.primary.contrastText
        }
    },
    digitalTwinDetailsDrawerFilterHeader: {
        fontWeight: 'bold',
        fontSize: '1.5rem',
        color: theme.palette.text.default
    },
    digitalTwinActionFilterHeader: {
        fontWeight: 'bold',
        fontSize: '1.5rem',
        float: 'left',
        marginTop: theme.spacing(2),
        color: theme.palette.text.default
    },
    digitalTwinHistoricFilterDropdowm: {
        float: 'left',
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(1),
        borderRadius: theme.spacing(0.5),
        backgroundColor: '#FFF',
        '& > .MuiInput-root > .MuiSelect-root > .MuiListItemText-root': {
            paddingLeft: theme.spacing(1),
            textTransform: 'uppercase'
        },
        '& > .MuiInput-root > .MuiSelect-root > .MuiListItemText-root > .MuiTypography-root': {
            fontSize: '1.25rem'
        },
        '& > .MuiInput-root': {
            margin: theme.spacing(1)
        },
        '& > .MuiInputLabel-root': {
            fontSize: '1.5rem',
            marginLeft: theme.spacing(1)
        },
        '& > .MuiFormLabel-root': {
            paddingLeft: theme.spacing(1),
            fontSize: '1.25rem',
            textTransform: 'uppercase',
            color: theme.palette.text.default
        }
    },
    digitalTwinHistoricFilterDropdowmMultiple: {
        float: 'left',
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(1),
        borderRadius: theme.spacing(0.5),
        backgroundColor: '#FFF',
        '& > .MuiInput-root > .MuiSelect-root': {
            paddingLeft: theme.spacing(1),
            textTransform: 'uppercase',
            fontSize: '1.25rem'
        },
        '& > .MuiInput-root': {
            margin: theme.spacing(1.75, 1)
        },
        '& > .MuiInputLabel-root': {
            fontSize: '1.5rem',
            marginLeft: theme.spacing(1)
        },
        '& > .MuiFormLabel-root': {
            paddingLeft: theme.spacing(1),
            fontSize: '1.25rem',
            textTransform: 'uppercase',
            color: '#000'
        }
    },
    digitalTwinActionFilterDropdowm: {
        float: 'left',
        marginLeft: theme.spacing(2)
    },
    digitalTwinActionFilterValueLabel: {
        fontSize: '1.5rem',
        marginTop: theme.spacing(3.5),
        color: theme.palette.text.default,
        marginRight: '1.5rem'
    },
    digitalTwinActionContainer: {
        width: '100%',
        height: 'calc(100% - ' + theme.spacing(5) + ')'
    },
    digitalTwinActionLoadingBody: {
        margin: 'auto auto'
    },
    digitalTwinActionBody: {
        width: '100%',
        height: '100%'
    },
    digitalTwinDetailsDrawerSectionHeader: {
        fontWeight: 'bold',
        fontSize: '1.5rem',
        color: theme.palette.text.default
    },
    digitalTwinDetailsDrawerSectionDivider: {
        margin: theme.spacing(1, 0),
        borderBottom: '1px solid ' + theme.palette.text.default
    },
    drawerSectionOptionsContainer: {},
    drawerSectionOptionsBody: {
        float: 'right'
    },
    digitalTwinDrawerSectionLegendItem: {},
    digitalTwinDrawerSectionLegendItemIcon: {
        float: 'left',
        borderRadius: theme.spacing(8),
        width: theme.spacing(1),
        height: theme.spacing(1),
        marginTop: theme.spacing(0.6),
        marginRight: theme.spacing(1)
    },
    digitalTwinDrawerSectionLegendItemBorder: {
        float: 'left',
        borderRight: '2px solid #FFF',
        width: theme.spacing(1),
        height: theme.spacing(2),
        marginRight: theme.spacing(1)
    },
    digitalTwinDrawerSectionLegendItemLabel: {
        float: 'left',
        marginRight: theme.spacing(4),
        color: theme.palette.text.default
    },
    digitalTwinDetailsDrawerSectionContent: {
        backgroundColor: theme.palette.primary.dark,
        padding: theme.spacing(1, 0),
        margin: theme.spacing(1, 0)
    },
    digitalTwinDetailsDrawerInsightContent: {
        backgroundColor: theme.palette.primary.dark,
        padding: theme.spacing(1),
        margin: theme.spacing(1)
    },
    digitalTwinDetailsDrawerSectionContentHidden: {
        display: 'none'
    },
    digitalTwinDetailsDrawerSectionMarker: {},
    digitalTwinDetailsDrawerSubSectionHeader: {
        fontSize: '1.5rem',
        margin: theme.spacing(1, 2),
        color: theme.palette.text.default
    },
    digitalTwinDetailsDrawerSubSectionSubHeader: {
        margin: theme.spacing(0, 2),
        color: theme.palette.text.default
    },
    digitalTwinDrawerGraphHalf: {
        width: theme.spacing(32.5),
        height: theme.spacing(20)
    },
    digitalTwinDrawerGraphFull: {
        width: theme.spacing(65),
        height: theme.spacing(20),
        marginLeft: theme.spacing(2)
    },
    digitalTwinSimulateGraphFull: {
        width: 'calc(100% - ' + theme.spacing(2) + ')',
        height: theme.spacing(20),
        marginLeft: theme.spacing(2)
    },
    digitalTwinCanvasOpenDrawer: {
        position: 'absolute',
        top: theme.spacing(5),
        right: theme.spacing(5),
        zIndex: '4',
        backgroundColor: theme.palette.primary.contrastText,
        '& svg': {
            fill: theme.palette.primary.dark + ' !important'
        },
        '&:hover svg': {
            fill: theme.palette.primary.contrastText + ' !important'
        }
    },
    digitalTwinCanvasCloseDrawer: {
        position: 'absolute',
        top: theme.spacing(5),
        right: theme.spacing(147),
        zIndex: '4',
        backgroundColor: theme.palette.primary.contrastText,
        '& svg': {
            fill: theme.palette.primary.dark + ' !important'
        },
        '&:hover svg': {
            fill: theme.palette.primary.contrastText + ' !important'
        }
    },
    digitalTwinCanvasOpenSimulate: {
        position: 'absolute',
        top: theme.spacing(5),
        right: theme.spacing(5),
        zIndex: '4',
        backgroundColor: theme.palette.primary.contrastText,
        '& svg': {
            fill: theme.palette.primary.dark + ' !important'
        },
        '&:hover svg': {
            fill: theme.palette.primary.contrastText + ' !important'
        },
        '&:focus': {
            position: 'absolute'
        }
    },
    digitalTwinCanvasCloseSimulate: {
        position: 'absolute',
        top: theme.spacing(45),
        right: theme.spacing(171),
        zIndex: '4',
        backgroundColor: theme.palette.primary.contrastText,
        '& svg': {
            fill: theme.palette.primary.dark + ' !important'
        },
        '&:hover svg': {
            fill: theme.palette.primary.contrastText + ' !important'
        }
    },
    digitalTwinCanvasCloseAction: {
        position: 'absolute',
        top: theme.spacing(50),
        right: theme.spacing(147),
        zIndex: '6',
        backgroundColor: theme.palette.primary.contrastText,
        '& svg': {
            fill: theme.palette.primary.dark + ' !important'
        },
        '&:hover svg': {
            fill: theme.palette.primary.contrastText + ' !important'
        }
    },
    digitalTwinCanvasZoneContainer: {
        position: 'absolute',
        zIndex: '4',
        width: theme.spacing(50),
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderRadius: theme.spacing(0.5),
        backgroundImage:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? 'linear-gradient(111.81deg, rgba(56, 98, 141, 0.7) 2.32%, rgba(56, 98, 141, 1) 100.61%)'
                : 'linear-gradient(111.81deg, #EAEDF3 2.32%, rgba(234, 237, 243, 0.4) 100.61%)',
        backdropFilter: 'blur(25px)',
        padding: '1.4rem 1.4rem 1.4rem 1.4rem'
    },
    digitalTwinCanvasZoneClose: {
        cursor: 'pointer',
        position: 'absolute',
        top: theme.spacing(1),
        right: theme.spacing(1),
        width: theme.spacing(2),
        height: theme.spacing(2),
        color: theme.palette.text.default,
        '&:hover': {
            opacity: '0.5'
        }
    },
    digitalTwinCanvasZoneDetails: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(1),
        borderBottom: theme.spacing(0.5) + ' solid ' + theme.palette.text.default
    },
    digitalTwinCanvasZoneGroup: {
        fontSize: '2.25rem',
        textTransform: 'uppercase',
        marginBottom: theme.spacing(1),
        color: theme.palette.text.default
    },
    digitalTwinCanvasZoneName: {
        marginBottom: theme.spacing(1),
        color: theme.palette.text.default
    },
    digitalTwinCanvasZoneMetricName: {
        marginBottom: theme.spacing(1),
        color: theme.palette.text.default
    },
    digitalTwinCanvasZoneMetricValue: {
        float: 'left',
        fontWeight: 'bold',
        fontSize: '2rem'
    },
    digitalTwinCanvasZoneMetricUnit: {
        float: 'left',
        marginTop: theme.spacing(0.5),
        marginLeft: theme.spacing(1),
        fontSize: '1.5rem',
        color: theme.palette.text.default
    },
    digitalTwinCanvasZoneActions: {
        padding: theme.spacing(2)
    },
    digitalTwinCanvasZoneMetricActionLink: {
        fontWeight: 'bold',
        color: localStorage.getItem('codx-products-theme') === 'dark' ? '#07CB07' : '#3277B3',
        //needs to be refactored - to generalise
        textAlign: 'center',
        marginBottom: theme.spacing(1),
        cursor: 'pointer',
        '&:hover': { opacity: '0.5' },
        border:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? '1px solid #07CB07'
                : '1px solid #3277B3',
        //needs to be refactored - to generalise
        borderRadius: '5px',
        padding: '1rem'
    },
    digitalTwinCanvasMetricContainerExpanded: {
        position: 'absolute',
        zIndex: '3',
        width: theme.spacing(20),
        height: theme.spacing(12),
        cursor: 'pointer',
        padding: theme.spacing(2),
        backgroundColor: '#EFF0F1',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
        // borderRadius: theme.spacing(0.5)
    },
    digitalTwinCanvasMetricZoneNameExpanded: {},
    digitalTwinCanvasMetricGroupExpanded: {
        fontSize: '1.25rem',
        textTransform: 'uppercase'
    },
    digitalTwinCanvasMetricValueExpanded: {
        float: 'left',
        fontWeight: 'bold',
        fontSize: '2rem'
    },
    digitalTwinCanvasMetricUnitExpanded: {
        float: 'left',
        marginTop: theme.spacing(0.75),
        marginLeft: theme.spacing(1),
        fontSize: '1.25rem'
    },
    digitalTwinCanvasMetricContainer: {
        position: 'absolute',
        zIndex: '2',
        width: theme.spacing(9),
        height: theme.spacing(9),
        cursor: 'pointer',
        padding: theme.spacing(2),
        backgroundColor: '#EFF0F1',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderRadius: theme.spacing(0.5)
    },
    digitalTwinCanvasMetricContainerVisual: {
        backgroundColor: 'transparent',
        position: 'absolute',
        content: ' ',
        width: theme.spacing(3.5),
        height: theme.spacing(3.5),
        borderRadius: theme.spacing(0.5)
    },
    digitalTwinCanvasMetricContainerVisualBorderTOPLEFT: {
        top: '-' + theme.spacing(0.5),
        left: '-' + theme.spacing(0.5),
        borderLeft: theme.spacing(1.25) + ' solid #6C6',
        borderTop: theme.spacing(1.25) + ' solid #6C6'
    },
    digitalTwinCanvasMetricContainerVisualBorderTOPRIGHT: {
        top: '-' + theme.spacing(0.5),
        right: '-' + theme.spacing(0.5),
        borderRight: theme.spacing(1.25) + ' solid #6C6',
        borderTop: theme.spacing(1.25) + ' solid #6C6'
    },
    digitalTwinCanvasMetricContainerVisualBorderBOTTOMRIGHT: {
        bottom: '-' + theme.spacing(0.5),
        right: '-' + theme.spacing(0.5),
        borderRight: theme.spacing(1.25) + ' solid #6C6',
        borderBottom: theme.spacing(1.25) + ' solid #6C6'
    },
    digitalTwinCanvasMetricContainerVisualBorderBOTTOMLEFT: {
        bottom: '-' + theme.spacing(0.5),
        left: '-' + theme.spacing(0.5),
        borderLeft: theme.spacing(1.25) + ' solid #6C6',
        borderBottom: theme.spacing(1.25) + ' solid #6C6'
    },
    digitalTwinCanvasMetricZoneName: {},
    digitalTwinCanvasMetricZoneIcon: {
        position: 'absolute',
        top: theme.spacing(0.5),
        right: theme.spacing(0.5),
        height: theme.spacing(3),
        width: theme.spacing(3)
    },
    digitalTwinCanvasMetricName: {
        fontSize: '1.25rem'
    },
    digitalTwinCanvasMetricValue: {
        fontWeight: 'bold',
        fontSize: '2rem'
    },
    digitalTwinCanvasMetricUnit: {
        fontSize: '1.25rem',
        textAlign: 'center'
    },
    digitalTwinRadioGroup: {
        float: 'left',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '30%',
        margin: theme.spacing(1)
    },
    digitalTwinRadioLabel: {
        borderRadius: theme.spacing(2),
        backgroundColor: theme.palette.primary.light,
        borderColor: theme.palette.text.default,
        color: theme.palette.text.default
    },
    digitalTwinReportButton: {
        position: 'absolute',
        bottom: theme.spacing(1),
        right: theme.spacing(1),
        zIndex: '2',
        borderRadius: theme.spacing(2),
        backgroundColor: theme.palette.primary.light,
        borderColor: theme.palette.text.default,
        color: theme.palette.text.default
    },
    digitalTwinRadioLabelSelected: {
        borderRadius: theme.spacing(2),
        borderColor: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.contrastText,
        color: theme.palette.primary.dark
    },
    digitalTwinRadioGroupLabel: {
        float: 'left',
        fontWeight: 'bold',
        fontSize: '1.5rem',
        margin: theme.spacing(1.5, 0),
        fontColor: theme.palette.text.titleText
    },
    digitalTwinRadioGroupTooltip: {
        fontSize: '1.5rem',
        color: theme.palette.text.titleText
    },
    simulateContainer: {
        // padding: theme.spacing(0)
    },
    simulateHeader: {
        float: 'left',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        padding: theme.spacing(1),
        cursor: 'pointer',
        '&:hover': {
            opacity: '0.5'
        },
        color: theme.palette.text.default
    },
    simulateHeaderSelected: {
        float: 'left',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        padding: theme.spacing(1),
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.dark
    },
    simulateBody: {
        width: '100%'
        // height: theme.spacing(10)
    },
    simulateBodySegment: {
        float: 'left',
        textAlign: 'center',
        width: '33%',
        height: '100%'
    },
    simulateBodyDetailsLeft: {
        paddingRight: theme.spacing(2),
        borderRight: theme.spacing(0.2) + ' solid ' + theme.palette.primary.main,
        height: '100%'
    },
    simulateBodyDetails: {
        height: '100%'
    },
    simulateSectionHeader: {
        fontSize: '1.25rem',
        color: theme.palette.text.default,
        backgroundColor: theme.palette.primary.dark,
        padding: theme.spacing(1, 0),
        margin: theme.spacing(1)
    },
    simulateBodyDetailsHeader: {
        fontSize: '1.25rem',
        color: theme.palette.text.default,
        margin: theme.spacing(1, 2),
        textAlign: 'left',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    simulateBodyToolbar: {},
    simulateBodyToolbarButton: {
        float: 'right',
        marginLeft: theme.spacing(2)
    },
    digitalTwinSimulateInputResults: {
        width: '100%'
    },
    digitalTwinSimulateInputResultsSection: {
        backgroundColor: theme.palette.primary.dark,
        margin: theme.spacing(0, 1, 1, 0),
        float: 'left',
        width: '49%',
        height: theme.spacing(40)
    },
    digitalTwinSimulateInputResultsSectionTall: {
        backgroundColor: theme.palette.primary.dark,
        margin: theme.spacing(0, 1, 1, 0),
        float: 'left',
        width: '49%',
        height: theme.spacing(50)
    },
    digitalTwinSimulateInputResultsLabel: {
        fontSize: '1.5rem',
        color: theme.palette.text.default,
        margin: theme.spacing(1, 0),
        textAlign: 'left',
        fontWeight: 'bold'
    },
    digitalTwinSimulateInputResultsTitle: {
        fontSize: '1.5rem',
        color: theme.palette.text.default,
        margin: theme.spacing(1, 0),
        textAlign: 'center'
    },
    digitalTwinSimulateInputResultsGraphLabel: {
        fontSize: '1.5rem',
        color: theme.palette.text.default,
        margin: theme.spacing(1, 0),
        textAlign: 'center'
    },
    digitalTwinSimulateInputSectionLegendItem: {
        margin: theme.spacing(1, 0, 1, 1)
    },
    digitalTwinChatGPTResponse: {
        fontSize: '1.25rem'
    },
    tooltip: {
        border: '1px solid',
        borderColor: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.dark,
        maxWidth: 'none',
        width: '45rem',
        padding: '1rem 1.8rem 1rem 1.8rem',
        fontSize: '1.5rem',
        color: theme.palette.text.titleText,
        marginBottom: '1rem'
    },
    simulateBodyTable: {
        marginLeft: theme.spacing(1)
    },
    simulateBodyTableHeaderContainer: {},
    simulateBodyTableHeader: {
        float: 'left',
        textAlign: 'left',
        width: '45%',
        backgroundColor: theme.palette.primary.light,
        fontSize: '1.5rem',
        color: theme.palette.text.default,
        margin: theme.spacing(1, 0)
    },
    simulateBodyTableHeaderSmall: {
        float: 'left',
        width: '20%',
        backgroundColor: theme.palette.primary.light,
        fontSize: '1.5rem',
        color: theme.palette.text.default,
        margin: theme.spacing(1, 0)
    },
    simulateBodyTableCellContainer: {},
    simulateBodyTableCellRow: {
        margin: theme.spacing(0, 1),
        paddingLeft: theme.spacing(1)
    },
    simulateBodyTableCellRowHighlighted: {
        margin: theme.spacing(0, 1),
        paddingLeft: theme.spacing(1),
        backgroundColor: theme.palette.primary.light
    },
    simulateBodyTableCell: {
        textAlign: 'left',
        float: 'left',
        width: '45%',
        fontSize: '1.5rem',
        color: theme.palette.text.default,
        margin: theme.spacing(2, 4, 2, 0)
    },
    simulateBodyTableCellTabbed: {
        textAlign: 'left',
        float: 'left',
        width: '45%',
        fontSize: '1.5rem',
        color: theme.palette.text.default,
        margin: theme.spacing(2)
    },
    simulateBodyTableCellSmall: {
        float: 'left',
        width: '20%',
        fontSize: '1.5rem',
        color: theme.palette.text.default,
        margin: theme.spacing(1, 0),
        textAlign: 'right'
    },
    simulateBodyTableCellInput: {
        marginLeft: theme.spacing(2),
        '&&&:before': {
            borderBottom: 'none'
        },
        '& input': {
            // padding: theme.spacing(1),
            float: 'right',
            backgroundColor: theme.palette.primary.dark,
            border: '2px solid ' + theme.palette.primary.dark,
            color: theme.palette.primary.contrastText,
            textAlign: 'right',
            padding: theme.spacing(0.5, 1),
            margin: theme.spacing(0.6, 0),
            fontSize: '1.5rem',
            borderRadius: '5px'
        }
    },
    labelOutputSimulate: {
        marginTop: '-1rem'
    },
    digitalTwinCanvasZoneRecommendations: {
        marginBottom: theme.spacing(1),
        color: theme.palette.text.default,
        fontSize: '1.5rem'
    },

    digitalTwinCanvasZoneRecommendationHeading: {
        marginTop: theme.spacing(1),
        color: theme.palette.text.default,
        fontWeight: 'bold'
    },

    digitalTwinCanvasZoneRecommendationListStyles: {
        marginTop: '0rem',
        paddingLeft: '1rem',
        color: theme.palette.text.default
    },
    multipleDropdown: {
        width: '16rem',
        marginLeft: '1rem',
        '& label.Mui-focused': {
            color: theme.palette.text.default,
            fontSize: '2rem'
        },
        '& label': {
            fontSize: '1.5rem',
            color: theme.palette.text.default
        },
        '& .MuiSvgIcon-root': {
            fontSize: '25px',
            color: theme.palette.text.titleText
        },
        marginBottom: '1rem'
    },
    digitalTwinDetailsDrawerisStagged: {
        width: theme.spacing(74)
    },
    digitalTwinCanvasCloseDrawerisStagged: {
        backgroundColor: theme.palette.primary.contrastText,
        '& svg': {
            fill: theme.palette.primary.dark + ' !important'
        },
        '&:hover svg': {
            fill: theme.palette.primary.contrastText + ' !important'
        }
    },
    tabView: {
        float: 'left',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        padding: theme.spacing(1),
        cursor: 'pointer',
        '&:hover': {
            opacity: '0.5'
        },
        color: theme.palette.text.default
    },
    tabViewSelected: {
        float: 'left',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        padding: theme.spacing(1),
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.dark
    },
    simulateLabel: {
        fontSize: '1.8rem',
        color: theme.palette.text.default,
        position: 'absolute',
        left: '1.5rem',
        top: '-2.8rem',
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    simulateFilterDropDown: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    },
    simulateExtraFilters: {
        display: 'flex',
        gap: '2rem'
    },
    dropdownLabel: {
        fontSize: '1.25rem',
        color: theme.palette.text.default,
        textTransform: 'uppercase',
        paddingLeft: '0.8rem'
    }
});

export default digitalTwinCanvasStyle;
