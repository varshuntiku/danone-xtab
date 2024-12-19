import { alpha } from '@material-ui/core';
const connSystemFoundationTabstyle = (
    theme,
    themeMode = localStorage.getItem('codx-products-theme')
) => ({
    foundation_solutionsFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        border: '1.5px solid',
        borderImageSlice: 1,
        borderImageSource: `linear-gradient(to bottom, ${
            localStorage.getItem('codx-products-theme') == 'dark' ? '#043E73' : '#4560D780'
        }, transparent)`
    },
    foundation_buttonGroup: {
        float: 'right',
        marginTop: '-4rem',
        marginRight: '1.3rem',
        backgroundColor: 'transparent',
        height: '3.2rem',
        '& .MuiButton-contained': {
            color:
                localStorage.getItem('codx-products-theme') == 'dark'
                    ? theme.ConnectedSystemDashboard.buttonContained.textColor
                    : theme.palette.text.peachText,
            backgroundColor:
                localStorage.getItem('codx-products-theme') == 'dark'
                    ? theme.ConnectedSystemDashboard.buttonContained.background
                    : theme.palette.text.default,
            borderColor:
                localStorage.getItem('codx-products-theme') == 'dark'
                    ? theme.ConnectedSystemDashboard.buttonContained.background
                    : theme.palette.text.peachText
        },
        '& .MuiButton-outlined': {
            color: theme.palette.text.default,
            backgroundColor: 'transparent',
            borderColor: theme.palette.text.default
        }
    },
    foundation_connSystemGridBottom: {
        flex: 0.9,
        display: 'flex',
        gap: theme.spacing(1),
        position: 'relative',
        paddingBottom: '1rem',
        width: '98vw',
        zIndex: 1000
    },
    foundation_connSystemBusinessGridBottom: {
        flex: 0.9,
        display: 'flex',
        gap: theme.spacing(1),
        position: 'fixed',
        bottom: '3rem',
        width: '98.35vw',
        zIndex: 1000
    },
    business_businessProcessHolder: {
        width: '55vw',
        marginTop: '3rem'
    },
    business_dataHolder: {
        width: '45vw',
        marginLeft: '0%',
        padding: '1rem 0.25rem 1rem 0rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '3.5rem',
        marginRight: '0rem'
    },
    business_foundationDataSideDrawer: {
        position: 'absolute',
        top: 0,
        transform: 'translateX(calc(200% - 2rem))',
        backgroundColor:
            localStorage.getItem('codx-products-theme') === 'dark' ? '#051729' : '#F1F3F4',
        width: '100%',
        height: '105%',
        zIndex: 100
    },
    business_infoIconHolder: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: '0.5rem',
        paddingTop: '0rem'
    },
    business_infoIcon: {
        width: '2.2rem',
        height: '2.2rem',
        cursor: 'pointer',
        color: theme.palette.text.default
    },
    business_flexContainers: {
        display: 'flex',
        width: '100%',
        background: theme.palette.background.connectedSysBusinessUserLinearBackground,
        borderRadius: '4px',
        boxShadow:
            localStorage.getItem('codx-products-theme') !== 'dark'
                ? 'none'
                : '0px 0px 11px 0px rgba(0, 0, 0, 0.40)'
    },
    business_flexContainersBottom: {
        display: 'flex',
        width: '100%',
        marginTop: '0.5rem'
    },
    business_drawerRight: {
        border: '1px solid ' + theme.palette.text.default,
        borderRadius: '50%',
        cursor: 'pointer',
        width: '3rem',
        height: '3rem',
        color: theme.palette.text.default,
        '&:hover': {
            backgroundColor:
                localStorage.getItem('codx-products-theme') === 'dark' ? '#091F3A' : '#F1F3F4',
            opacity: '1'
        },
        opacity: '0.8',
        background:
            localStorage.getItem('codx-products-theme') !== 'dark'
                ? 'linear-gradient(131deg, #EAEDF3 0%, rgba(234, 237, 243, 0.00) 100%)'
                : 'none',
        boxShadow: '0px 4px 41px 4px rgba(0, 0, 0, 0.10)',
        backdropFilter: 'blur(1.5px)'
    },
    business_connSystemGoals: {
        width: '22%',
        paddingRight: theme.spacing(2),
        background:
            localStorage.getItem('codx-products-theme') !== 'dark'
                ? 'linear-gradient(131deg, rgba(255, 255, 255, 0.60) 0%, rgba(255, 255, 255, 0.00) 100%)'
                : 'none'
    },
    business_appDataHolder: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        width: '100%',
        height: '100%'
    },
    business_foundationTabLeftIcon: {
        position: 'absolute',
        top: '1rem',
        width: 'fit-content',
        zIndex: 101,
        transform: 'translateX(' + theme.spacing(2.5) + ')',
        backdropFilter: 'blur(1px)'
    },
    business_foundationApp: {
        width: 'fit-content',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        marginTop: '-2rem'
    },
    business_verticalKpiHolder: {
        width: '40%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginRight: '1.5rem',
        marginBottom: '0.75rem',
        marginTop: '0.75rem'
    },
    business_kpiBoxHolder: {
        width: '51%',
        display: 'flex',
        border:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? '1px solid #02E0FE60'
                : '1px solid #091F3A22',
        marginRight: '1rem',
        background: theme.palette.background.connectedSysBusinessUserLinearBackground,
        borderRadius: '4px',
        boxShadow:
            localStorage.getItem('codx-products-theme') !== 'dark'
                ? 'none'
                : '0px 0px 11px 0px rgba(0, 0, 0, 0.40)'
    },
    business_kpiBoxHolder2: {
        width: '51%',
        display: 'flex',
        border:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? '1px solid #02E0FE60'
                : '1px solid #091F3A22',
        background: theme.palette.background.connectedSysBusinessUserLinearBackground,
        borderRadius: '4px',
        boxShadow:
            localStorage.getItem('codx-products-theme') !== 'dark'
                ? 'none'
                : '0px 0px 11px 0px rgba(0, 0, 0, 0.40)'
    },
    business_leftContainer: {
        width: '40%',
        paddingTop: '2px',
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            top: '5%',
            right: 0,
            backgroundColor:
                localStorage.getItem('codx-products-theme') === 'dark' ? '#02E0FE60' : '#3468CA30',
            width: '1px',
            height: '90%'
        }
    },
    business_rightContainer: {
        width: '60%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1px',
        paddingRight: '1rem',
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '5%',
            backgroundColor:
                localStorage.getItem('codx-products-theme') === 'dark' ? '#02E0FE60' : '#3468CA30',
            width: '90%',
            height: '1px'
        }
    },
    business_dataGraphHolder: {
        width: '40%',
        paddingTop: '2px',
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            top: '5%',
            right: 0,
            backgroundColor:
                localStorage.getItem('codx-products-theme') === 'dark' ? '#02E0FE60' : '#3468CA30',
            width: '1px',
            height: '90%'
        }
    },
    business_bottomKpiHolder: {
        width: '60%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1px',
        paddingRight: '1rem',
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '5%',
            backgroundColor:
                localStorage.getItem('codx-products-theme') === 'dark' ? '#02E0FE60' : '#3468CA30',
            width: '90%',
            height: '1px'
        }
    },
    business_dialogIcon: {
        position: 'absolute',
        top: '0',
        right: '0',
        '& svg': {
            color: theme.palette.text.default
        }
    },
    business_kpiDiv: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '6rem',
        paddingBottom: '2rem',
        marginRight: '2rem'
    },
    business_kpiHolder: {
        flexBasis: 0
    },
    business_dialogContent: {
        borderRadius: '8px',
        background:
            localStorage.getItem('codx-products-theme') == 'dark'
                ? 'linear-gradient(134deg, rgba(56, 98, 141, 0.80) 0 %, rgba(56, 98, 141, 0.15) 100 %)'
                : 'linear-gradient(134deg, #EAEDF3 0%, rgba(234, 237, 243, 0.40) 100%)',
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(25px)',
        overflow: 'hidden',
        borderColor:
            localStorage.getItem('codx-products-theme') == 'dark' ? '#3468CA60' : '#3468CA60'
    },
    business_kpiDialog: {
        '&.MuiDialog-paperWidthSm': {
            maxWidth: '100rem'
        }
    },
    business_appDataPlotlyHolder: {
        width: '60%'
    },
    business_appDataContainer: {
        border:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? '1px solid #02E0FE60'
                : '1px solid #091F3A22',
        marginTop: '0.25rem'
    },
    business_appDataContainerBottom: {
        marginTop: '2rem',
        padding: '1.75rem'
    },
    business_box: {
        width: '100%',
        backgroundColor: theme.ConnectedSystemDashboard.popUp.headingBackground,
        height: '6rem',
        position: 'absolute',
        top: '0',
        left: '0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    business_popUpHeading: {
        color: theme.palette.text.titleText,
        fontSize: '2rem',
        marginLeft: '5.2rem'
    },
    svgHolder: {
        position: 'absolute'
    },
    data_arrow: {
        clipPath: 'polygon(10% 45%,60% 45%,60% 20%,80% 50%,60% 80%,60% 55%,10% 55%)',
        width: '100px',
        height: '40px',
        background: '#737373',
        marginTop: '16rem',
        opacity: 0,
        transform: 'translateX(-15px)',
        transition: 'opacity 1s ease, transform 1s ease',
        pointerEvents: 'none'
    },
    data_sourceImage: {
        borderRadius: '50%',
        border: '2px solid #C804CC',
        padding: '10px 6px 10px 6px',
        marginTop: '4rem',
        width: `var(--width, 40px)`,
        height: `var(--height, 40px)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    data_googleImage: {
        width: '14px',
        height: '14px',
        margin: '0.2rem'
    },
    data_sourceText: {
        color: localStorage.getItem('codx-products-theme') == 'dark' ? '#FFFFFF90' : '#091F3A',
        fontSize: '1.5rem',
        textAlign: 'center',
        marginTop: '0.5rem'
    },
    data_sourceTextHighlighted: {
        color: theme.palette.text.contrastText,
        fontSize: '1.5rem',
        textAlign: 'center',
        marginTop: '0.5rem',
        textDecoration: 'underline'
    },
    data_sourceTextUnderlined: {
        color: alpha(theme.palette.text.contrastText, 0.42),
        fontSize: '1.5rem',
        textAlign: 'center',
        marginTop: '0.5rem',
        textDecoration: 'underline'
    },
    data_titleText: {
        color: localStorage.getItem('codx-products-theme') == 'dark' ? '#FFFFFF80' : '#4560D7',
        fontSize: theme.spacing(2),
        backgroundColor:
            localStorage.getItem('codx-products-theme') == 'dark' ? '#042C56' : '#EDF0FB',
        borderRadius: '4px',
        padding: '4px 8px 4px 8px',
        width: '14rem',
        textAlign: 'center'
    },
    // data_titleTextHighlighted: {
    //     color: theme.palette.text.contrastText,
    //     fontSize: theme.spacing(2),
    //     backgroundColor:
    //         localStorage.getItem('codx-products-theme') == 'dark' ? '#042C56' : '#EDF0FB',
    //     borderRadius: '4px',
    //     padding: '4px 8px 4px 8px',
    //     width: '14rem',
    //     textAlign: 'center'
    // },
    data_appText: {
        color: localStorage.getItem('codx-products-theme') == 'dark' ? '#FFFFFF90' : '#042C56',
        backgroundColor: theme.palette.background.connectedSysBusinessUserLinearBackground,
        padding: '4px 8px 4px 8px',
        fontSize: theme.spacing(2),
        marginTop: '13.5rem',
        border: '0.5px solid rgba(2, 224, 254, 0.4)',
        borderRadius: '4px',
        boxShadow:
            localStorage.getItem('codx-products-theme') == 'dark'
                ? '0px 4px 40px 5px rgba(0, 0, 0, 0.30)'
                : 'none',
        backdropFilter: 'blur(3.5px)'
    },
    data_qualityText: {
        color: theme.palette.text.default,
        fontSize: theme.spacing(2),
        marginLeft: '1rem',
        fontWeight: 400
    },
    data_sourceContainer: {
        display: 'flex',
        flexDirection: 'column',
        opacity: 0,
        transform: 'translateX(-15px)',
        transition: 'opacity 1s ease, transform 1s ease',
        alignItems: 'center',
        pointerEvents: 'none'
    },
    data_visible: {
        pointerEvents: 'all',
        opacity: 1,
        transform: 'translateX(0)'
    },
    goalDataContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '78%',
        flexWrap: 1
    },
    data_midGrid: {
        display: 'flex'
    },
    data_kpiHolder: {
        marginLeft: '4%',
        width: '45%',
        height: '100%',
        paddingTop: '0.8rem',
        paddingRight: '0.5rem',
        paddingBottom: '0.8rem'
    },
    data_processHolder: {
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
    },
    data_stepsHolder: {
        display: 'flex',
        flexDirection: 'row'
    },
    data_headingHolder: {
        display: 'flex',
        flexDirection: 'row',
        gap: '1.5rem',
        marginTop: '1.8rem'
    },
    data_mainHeading: {
        fontSize: '2rem',
        color: theme.palette.text.default,
        textTransform: 'uppercase'
    },
    data_dropdownHolder: {
        display: 'flex',
        flexDirection: 'row',
        color: theme.palette.text.default,
        borderRadius: '0.5rem',
        alignItems: 'center'
    },
    data_dataMart: {
        width: `var(--width, 7rem)`,
        height: `var(--height, 5rem)`,
        marginTop: '2rem',
        cursor: 'pointer'
    },
    data_dataWarehouse: {
        width: `var(--width, 10rem)`,
        height: `var(--height, 10rem)`,
        marginTop: '3rem',
        cursor: 'pointer'
    },
    data_dataLake: {
        width: `var(--width, 10rem)`,
        height: `var(--height, 8rem)`,
        marginTop: '12rem',
        cursor: 'pointer'
    },
    data_dropdownLabel: {
        color: theme.palette.text.titleText
    },
    data_dropdownMain: {
        color: '#6DF0C2'
    },
    supplyText: {
        color: theme.palette.text.contrastText,
        fontSize: '1.5rem'
    },
    businessFunction: {
        fontSize: '1.5rem'
    },
    business_middleGrid: {
        top: '1%'
    },
    connSystem_minervaChatbot: {
        position: 'absolute',
        top: '-5.5rem'
    },
    legendElementsContainer: {
        display: 'flex',
        position: 'absolute',
        bottom: '0.3rem',
        zIndex: 10,
        justifyContent: 'space-around',
        width: '100%'
    },
    legendBox: {
        width: '1rem',
        height: '1rem',
        borderRadius: '1.5px',
        background: '#6883F7',
        display: 'flex'
    },
    legendBox_one: {
        width: '1rem',
        height: '1rem',
        borderRadius: '1.5px',
        background: '#42E4BC',
        display: 'flex'
    },
    legendtext: {
        color: theme.palette.text.default,
        display: 'flex',
        gap: '1rem',
        fontSize: '1.35rem',
        alignItems: 'center'
    },
    overAllConsumptionData: {
        color: theme.palette.text.default,
        position: 'absolute',
        zIndex: '10',
        fontSize: '1.2rem'
    },
    businessFunctionDropdown: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',

        boxShadow:
            themeMode !== 'dark'
                ? 'none'
                : '0.2px 0.2px 0.2px 0px ' + alpha(theme.palette.primary.contrastText, 0.8),
        borderRadius: '0.5rem',
        paddingLeft: '0.5rem',
        '& p': {
            padding: '0px',
            margin: '0px',
            fontSize: '1.5rem',
            lineHeight: '1.5',
            letterSpacing: '0.00938em'
        }
    },
    businessFunctionDropdownBorder: {
        border: '1px ' + theme.palette.primary.contrastText + ' solid'
    },
    businessFunctionSelectedValue: {
        marginLeft: '1rem !important',
        color: theme.palette.text.default
    },
    businessFunctionMenu: {
        marginTop: '1rem',
        borderRadius: '2px',
        '& ul': {
            minWidth: '26rem',
            padding: '0px',
            backgroundColor:
                themeMode === 'dark' ? '#091F3A' : alpha(theme.palette.primary.light, 0.5),
            '& li': {
                height: '3.5rem'
            }
        }
    },
    expandLessIcon: {
        color: theme.palette.primary.contrastText,
        paddingLeft: '1rem',
        fontSize: '3rem'
    },
    expandMoreIcon: {
        color: theme.palette.text.default,
        paddingLeft: '1rem',
        fontSize: '3rem'
    },
    businessFunctionMenuItem: {
        margin: '0px 1rem',
        borderBottom: '0.5px ' + alpha(theme.palette.text.default, 0.2) + ' solid',
        color: theme.palette.text.default,
        '&:hover': {
            backgroundColor: theme.palette.primary.contrastText,
            '& p': {
                color: alpha(theme.palette.primary.dark, 1)
            }
        },
        '& p': {
            margin: '0px',
            padding: '0px',
            color: theme.palette.text.default
        }
    },
    data_datawarehouse_titletext: {
        width: '18rem'
    }
});

export default connSystemFoundationTabstyle;
