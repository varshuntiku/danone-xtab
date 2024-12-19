import { alpha } from '@material-ui/core';

const connectedSystemSideDrawerStyle = (theme) => ({
    connSystemCardSubMainBigDrawer: {
        height: '100%',
        borderLeft: `0.5px solid ${theme.ConnectedSystemDashboard.borderSecondary}`,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(0.75),
        padding: theme.spacing(2),
        background: theme.palette.background.modelsViewDark
    },
    connSystemCardSubMainBigDrawerItem: {
        flex: 1
    },
    connSystemCardMainHeader: {
        fontSize: theme.spacing(2),
        fontWeight: '500',
        color: theme.ConnectedSystemDashboard.text,
        marginLeft: theme.spacing(2)
    },
    connSystemCardGridContainer: {
        height: '100%'
    },
    connSystemCardItemContainer: {
        position: 'relative',
        height: '100%'
    },
    connSystemCardItemBanner: {
        height: theme.spacing(6),
        width: theme.spacing(1.2),
        position: 'absolute',
        top: theme.spacing(3),
        left: theme.spacing(0.5),
        borderRadius: theme.spacing(0.5),
        '&.yellow': {
            backgroundColor: theme.ConnectedSystemDashboard.banner.yellow
        },
        '&.blue': {
            backgroundColor: theme.ConnectedSystemDashboard.banner.blue
        },
        '&.green': {
            backgroundColor: theme.ConnectedSystemDashboard.banner.green
        }
    },
    connSystemCardItem: {
        margin: theme.spacing(1),
        border: '0.5px solid ' + alpha(theme.palette.primary.contrastText, 0.3),
        borderRadius: theme.spacing(1),
        height: '100%',
        position: 'relative',
        background:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? 'linear-gradient(110.43deg, #0B121B -66.83%, rgba(11, 18, 27, 0) 103.2%)'
                : alpha(theme.palette.primary.dark, 0.4),
        backdropFilter: 'blur(5px)',
        display: 'flex',
        flexWrap: 'wrap',
        padding: theme.spacing(0, 2)
    },
    connSystemCardItemNumber: {
        fontSize: theme.spacing(4.5),
        lineHeight: theme.spacing(4),
        marginBottom: theme.spacing(4),
        padding: 0,
        color: theme.ConnectedSystemDashboard.text,
        fontWeight: 100
    },
    connSystemCardItemNumberSmall: {
        fontSize: theme.spacing(5),
        color: theme.ConnectedSystemDashboard.text,
        width: '100%',
        fontWeight: 100,
        padding: theme.spacing(1, 0, 1, 0)
    },
    connSystemCardItemMetricContainer: {
        margin: theme.spacing(2, 0, 0.5, 0)
    },
    connSystemCardItemMetricLabel: {
        fontSize: theme.spacing(2),
        color: theme.ConnectedSystemDashboard.text
    },
    connSystemCardItemMetricValue: {
        fontSize: theme.spacing(3.5),
        color: theme.ConnectedSystemDashboard.text,
        fontWeight: 100
    },
    connSystemCardPlotHeader: {
        fontSize: '1.5rem',
        color: theme.ConnectedSystemDashboard.text,
        fontWeight: '100',
        textAlign: 'center'
    },
    connSystemCardPlot: {
        height: theme.spacing(6),
        width: theme.spacing(20),
        bottom: theme.spacing(1),
        '& .js-fill': {
            fill: 'url(#graph-gradient) !important'
        }
    },
    connSystemCardItemWrapper: {
        display: 'flex',
        flexDirection: 'column'
    },
    connSystemCardItemHeader: {
        fontSize: theme.spacing(1.8),
        paddingTop: theme.spacing(1),
        color: theme.ConnectedSystemDashboard.text,
        textTransform: 'uppercase',
        position: 'relative'
    },
    connSystemCardItemGraph: {
        alignSelf: 'flex-end'
    },
    drawerReactflowContainer: {
        marginLeft: '1%',
        marginTop: '2%',
        '& div.react-flow__handle.connectable': {
            backgroundColor: 'transparent',
            borderColor: theme.ConnectedSystemDashboard.reactflow.handleConnectable,
            backdropFilter: 'blur(5px)'
        },
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    heading: {
        color: theme.palette.text.default,
        fontSize: '1.3rem'
    },
    icon: {
        width: '2rem',
        height: '2rem',
        stroke: theme.palette.text.default
    },
    Fileicon: {
        width: '2rem',
        height: '2rem',
        color: theme.palette.primary.contrastText,
        fill: theme.ConnectedSystemDashboard.reactflow.edgeOne
    },
    titleContent: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '1rem'
    },
    renderElement: {
        width: 'fit-content',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 1rem 2rem 1rem',
        minWidth: '13rem'
    },
    description: {
        color: theme.ConnectedSystemDashboard.text,
        textAlign: 'left'
    },
    sideDrawerFlow: {
        width: '52vw',
        height: '42vh',
        backgroundColor: 'transparent'
    },
    dataText: {
        color: theme.ConnectedSystemDashboard.text,
        fontSize: '1.6rem',
        font: 'Roboto',
        fontWeight: '400'
    },
    intelligenceCard: {
        cursor: 'pointer'
    }
});

export default connectedSystemSideDrawerStyle;
