const connectedSystemIntelligenceTabStyle = (theme) => ({
    solutionsFooter: {
        width: '100%',
        border: '1.5px solid',
        display: 'flex',
        justifyContent: 'space-between',
        borderImageSlice: 1,
        borderImageSource:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? `linear-gradient(to bottom, ${theme.palette.primary.light}, transparent)`
                : 'linear-gradient(to bottom, #4560D780, transparent)',
        borderColor: localStorage.getItem('codx-products-theme') === 'dark' ? 'none' : '#4560D766'
    },
    businessProcessHolder: {
        width: '50%',
        height: '72%',
        marginTop: '1.7rem'
    },
    worflowChild: {
        width: '180px',
        height: '32px',
        textAlign: 'center'
    },
    flexContainers: {
        display: 'flex',
        width: '99%',
        height: '17rem'
    },
    verticalKpiHolder: {
        width: '45%',
        height: '97%',
        display: 'flex',
        flexDirection: 'column',
        gap: '.7rem',
        marginRight: '0.5rem',
        padding: '0.6rem',
        '@media (min-width: 1550px)': {
            marginBottom: '0.4rem'
        }
    },
    midKpiFirstSection: {
        border: `1px solid ${
            localStorage.getItem('codx-products-theme') === 'dark' ? '#02E0FE66' : '#091F3A22'
        }`,
        borderRadius: '0.8rem',
        width: '99%',
        marginLeft: '1rem'
    },
    midKpiCards: {
        marginTop: '0.25rem',
        paddingLeft: '1rem'
    },
    connSystemGoals: {
        width: '30%',
        paddingRight: theme.spacing(2),
        height: '100%',
        background:
            localStorage.getItem('codx-products-theme') !== 'dark'
                ? 'linear-gradient(131deg, rgba(255, 255, 255, 0.60) 0%, rgba(255, 255, 255, 0.00) 100%)'
                : 'linear-gradient(123deg, #020E1B 0%, rgba(11, 18, 27, 0.00) 100%)'
    },
    goalData: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        flexWrap: 1,
        height: '100%',
        gap: '0.5rem'
    },
    appDataHolder: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        width: '100%',
        height: '100%'
    },
    dataHolder: {
        width: '51.1%',
        marginLeft: '0%',
        padding: '0.3rem 0 0.5rem',
        height: '75%',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '0.25rem',
        '@media (min-width: 1550px)': {
            width: '51.75%'
        },
        '@media (max-width: 1300px)': {
            height: '63.5%',
            marginTop: '0.7rem'
        }
    },
    modelsWrapper: {
        width: 'inherit',
        height: '74%',
        padding: '0 3rem',
        position: 'absolute',
        zIndex: 100,
        background: theme.palette.background.modelsViewDark,
        borderLeft: '1px solid #008BB7',
        marginLeft: '0.8rem',
        '@media (min-width: 1550px)': {
            height: '75.4%',
            marginLeft: '0.8rem'
        },
        '@media (max-width: 1300px)': {
            height: '64%',
            marginLeft: '0.8rem'
        }
    },
    drawerIconStyle: {
        top: '13px!important',
        background: 'linear-gradient(131deg, #EAEDF3 0%, rgba(234, 237, 243, 0.00) 100%)',
        boxShadow: '0px 4px 41px 4px rgba(0, 0, 0, 0.10)',
        '@media (max-width: 1300px)': {
            width: '3rem !important',
            top: '10px!important'
        }
    },
    dialogIcon: {
        position: 'absolute',
        top: '1rem',
        right: '0'
    },
    kpiDiv: {
        margin: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dialogContent: {
        overflow: 'hidden',
        padding: 0,
        margin: 0,
        paddingTop: '0 !important'
    },
    KpiCardTitle: {
        fontSize: '2rem',
        color: 'white'
    },
    descTitleText: {
        fontSize: '2rem',
        color: 'white'
    },
    mainText: {
        fontSize: '4rem',
        color: 'white'
    },
    kpiCardPlotlyWrapperStyle: {
        display: 'flex',
        alignItems: 'center'
    },
    plotlyStyle: {
        display: 'flex!important',
        alignItems: 'flex-end',
        paddingBottom: '1rem'
    },
    midSectionGraph: {
        width: '55%'
    },
    svgStyle: {
        position: 'absolute'
    },
    topSectionHeight: {
        maxHeight: '20%'
    },
    bottomSection: {
        position: 'fixed',
        bottom: '3rem',
        width: '98vw',
        display: 'flex',
        gap: '0.8rem',
        flex: '0.9',
        zIndex: 1000
    },
    lightStyleEdge: {
        '& path': {
            stroke: '#5AC6A0'
        }
    },
    workFlowEdgeStyles: {
        '& div.react-flow__handle-left': {
            background: '#5AC6A0',
            border: 'none',
            width: '0.8rem',
            height: '0.8rem'
        },
        '& div.react-flow__handle-right': {
            opacity: 0
        }
    },
    connSystem_minervaChatbot: {
        position: 'absolute',
        top: '-5.5rem'
    },
    drawerDiv: {
        display: 'flex',
        justifyContent: 'flex-end',
        height: '10rem'
    }
});

export default connectedSystemIntelligenceTabStyle;
