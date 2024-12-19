import { alpha } from '@material-ui/core';
import BG from '../img/BG.svg';
import BG_light from '../img/BG_light.svg';

const connSystemDashboardStyle = (theme) => ({
    connSystemDashboardContainer: {
        background: theme.palette.primary.dark,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        paddingBottom: theme.spacing(2),
        boxSizing: 'border-box',
        '& *': {
            boxSizing: 'border-box'
        }
    },
    connSystemDashboardBody: {
        margin: theme.spacing(0, 2),
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `url(${
            localStorage.getItem('codx-products-theme') == 'dark' ? BG : BG_light
        })`
    },
    connSystemDashboardTabContainer: {
        margin: theme.spacing(0.7, 0)
    },
    connSystemDashboardTabLabel: {
        textAlign: 'center',
        minWidth: theme.spacing(20),
        padding: '1rem',
        fontSize: '1.8rem',
        fontWeight: '500',
        color: localStorage.getItem('codx-products-theme') == 'dark' ? '#FFFFFF' : '#091F3A',
        borderBottom: '1px solid ' + theme.palette.text.default,
        float: 'left',
        cursor: 'pointer',
        '&:hover': {
            opacity: '0.5'
        }
    },
    connSystemDashboardTabLabelSelected: {
        textAlign: 'center',
        minWidth: theme.spacing(20),
        fontSize: '1.8rem',
        fontWeight: '500',
        color:
            localStorage.getItem('codx-products-theme') == 'dark'
                ? theme.palette.text.default
                : theme.palette.text.peachText,
        float: 'left',
        backgroundColor:
            localStorage.getItem('codx-products-theme') == 'dark'
                ? '#009DF522'
                : theme.palette.text.default,
        borderBottom: `2px solid ${
            localStorage.getItem('codx-products-theme') == 'dark' ? '#6DF0C2' : '#4560D7'
        }`,
        borderBottomStyle: 'inset'
    },
    connSystemGridContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: theme.spacing(2),
        boxSizing: 'border-box'
    },
    connSystemGridTop: {
        flex: 1,
        display: 'flex',
        height: 'fit-content'
    },
    connSystemGridTopBusinessProcess: {
        flex: 0.8,
        display: 'flex',
        height: '20vh',
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            bottom: '-2%',
            backgroundColor: theme.palette.text.default,
            opacity: 0.25,
            width: '100%',
            height: '1px'
        }
    },
    connSystemGridMiddle: {
        flex: 2.5,
        display: 'flex',
        position: 'relative',
        gap: theme.spacing(1)
    },
    connSystemGridBottom: {
        flex: 0.9,
        display: 'flex',
        gap: theme.spacing(1)
    },
    connSystemGoals: {
        width: '22%',
        paddingRight: theme.spacing(2),
        height: '20vh'
    },
    connSystemInitiatives: {
        width: '78%',
        height: '20vh'
    },
    connSystemSolutions: {
        width: '100%'
    },
    connSystemBusinessProcess: {
        width: `var(--section-width, 60rem)`
    },
    connSystemDecisionFlow: {
        width: '50%'
    },
    connSystemSideDrawer: {
        width: '50%',
        height: '100%',
        position: 'absolute',
        transform: 'translateX(calc(200% - 2rem))',
        background: theme.palette.primary.dark,
        zIndex: 100
    },
    connSystemSideDrawerToggle: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: theme.spacing(5),
        aspectRatio: 1,
        border: '1px solid ' + theme.palette.text.default,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        opacity: 0.8,
        background: alpha(theme.palette.primary.dark, 0.6),
        backdropFilter: 'blur(1px)',
        transform: 'translateX(' + theme.spacing(2.5) + ')',
        zIndex: 101,
        marginRight: '1rem',

        '&:hover': {
            opacity: '1'
        },
        '& svg': {
            color: theme.palette.text.default,
            fontSize: theme.spacing(3)
        }
    },
    connSystemCardMain: {
        height: '75%',
        position: 'relative'
    },
    connSystemCardSubMain: {
        height: '100%',
        border: '1px solid ' + theme.palette.primary.contrastTextLight
    },
    connSystemCardSubMainSmallContainer: {
        height: '25%'
    },
    connSystemCardSubMainSmallEnd: {
        padding: theme.spacing(1),
        height: '100%'
    },
    connSystemCardSubMainBigContainer: {
        height: '75%'
    },
    connSystemCardSubMainBig: {
        padding: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    businessProcessHeader: {
        fontSize: theme.spacing(2),
        fontWeight: '400',
        color: theme.palette.text.default,
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(0.5),
        position: 'absolute'
    },
    connSystemCardFlowContainer: {
        position: 'relative',
        flex: 1
    },
    connSystemBusinessProcessContainer: {
        height: '1000px',
        position: 'absolute',
        '& div.functionLabel': {
            border: `1px solid ${theme.palette.text.default}`,
            color: theme.palette.text.default,
            padding: theme.spacing(1.25),
            borderRadius: '100px'
        },
        '& div.workflowLabel': {
            color: theme.palette.text.default
        },
        '& div.workflowchildLabel': {
            color: theme.palette.text.default,
            width: 'fit-content'
        },
        '& div.foundationAppLabel': {
            color: theme.palette.text.default,
            padding: '1rem',
            border:
                localStorage.getItem('codx-products-theme') === 'dark'
                    ? '0.5px solid #02E0FE70'
                    : '0.5px solid #32ACBD80',
            borderRadius: '3px',
            cursor: 'pointer',
            paddingLeft: '3rem',
            paddingRight: '3rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: theme.palette.background.linearBackground
        },
        '& div.foundationAppLabelSelected': {
            color: localStorage.getItem('codx-products-theme') == 'dark' ? '#FFFFFF' : '#091F3A',
            padding: '1rem',
            border: '0.5px solid #02E0FE70',
            borderRadius: '3px',
            cursor: 'pointer',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            opacity: '0.5'
        },
        '& div.react-flow__node-input': {
            paddingRight: '4px'
        }
    },
    fnNode: {
        border: '1px solid #02E0FECC',
        boxShadow: '0px 0px 50px 1px #FFFFFF0A',
        borderRadius: theme.spacing(4),
        visibility: 'unset',
        height: 'auto',
        width: theme.spacing(30) + '! important',
        fontSize: '1.5rem',
        fontWeight: '400',
        padding: theme.spacing(1),
        background: 'transparent',
        color: theme.palette.text.default,
        cursor: 'pointer !important',
        '&:hover': {
            opacity: '0.75'
        },
        '& div.react-flow__handle': {
            visibility: 'hidden'
        }
    },
    fnNodeSelected: {
        boxShadow: '4px 4px 50px -5px #000B14',
        border: '1px solid #6DF0C2CC',
        borderRadius: theme.spacing(4),
        visibility: 'unset',
        height: 'auto',
        width: theme.spacing(30) + '! important',
        fontSize: '1.5rem',
        fontWeight: '400',
        padding: theme.spacing(1),
        background: theme.palette.primary.contrastText,
        color: theme.palette.primary.dark,
        cursor: 'pointer !important',
        '& div.react-flow__handle': {
            width: theme.spacing(1),
            height: theme.spacing(1),
            background: 'transparent',
            borderColor: '#0C8DB9'
        },
        '& div.functionLabel': {
            color:
                localStorage.getItem('codx-products-theme') === 'dark'
                    ? theme.palette.primary.dark
                    : theme.palette.text.peachText,
            background:
                localStorage.getItem('codx-products-theme') === 'dark'
                    ? '#6DF0C2'
                    : theme.palette.text.default
        }
    },
    workflowNode: {
        border: 'none',
        background: 'transparent',
        visibility: 'unset',
        fontSize: '1.5rem',
        fontWeight: '400',
        padding: theme.spacing(1),
        color: theme.palette.text.default,
        cursor: 'pointer !important',
        width: theme.spacing(25),
        textAlign: 'left !important',
        '&:hover': {
            opacity: '0.75'
        },
        '& div.react-flow__handle': {
            width: theme.spacing(1),
            height: theme.spacing(1),
            background: 'transparent',
            borderColor: '#0C8DB9'
        },
        '& div.react-flow__handle-right': {
            visibility: 'hidden'
        }
    },
    workflowNodeNotSelected: {
        border: 'none',
        background: 'transparent',
        visibility: 'unset',
        fontSize: '1.5rem',
        fontWeight: '400',
        padding: theme.spacing(1),
        color: theme.palette.text.default,
        cursor: 'pointer !important',
        width: theme.spacing(25),
        opacity: '0.25',
        textAlign: 'left !important',
        '& div.react-flow__handle': {
            width: theme.spacing(1),
            height: theme.spacing(1),
            borderColor: '#0C8DB9'
        },
        '& div.react-flow__handle-right': {
            visibility: 'hidden'
        }
    },
    workflowNodeSelected: {
        border: 'none',
        background: 'transparent',
        borderRadius: theme.spacing(1),
        visibility: 'unset',
        fontSize: '1.5rem',
        fontWeight: '400',
        padding: theme.spacing(1),
        textAlign: 'left !important',
        color: theme.palette.text.default,
        width: theme.spacing(25),
        cursor: 'pointer !important',
        '& div.react-flow__handle': {
            width: theme.spacing(1),
            height: theme.spacing(1),
            background: '#0C8DB9',
            borderColor: '#0C8DB9'
        },
        '& div.react-flow__handle-right': {
            background: 'transparent',
            borderColor: theme.palette.primary.contrastText
        },
        '& div.workflowLabel': {
            fontWeight: 700
        }
    },
    workflowNoMetricsNodeSelected: {
        '& div.react-flow__handle-right': {
            visibility: 'hidden'
        }
    },
    overviewNode: {
        boxShadow: 'none !important',
        '& div.react-flow__handle': {
            width: theme.spacing(1),
            height: theme.spacing(1),
            background: theme.palette.primary.contrastText,
            borderColor: theme.palette.primary.contrastText
        },
        '&:hover': {
            boxShadow: 'none !important'
        }
    },
    edge: {
        '& path': {
            stroke: '#0C8DB9'
        }
    },
    edgeNotSelected: {
        '& path': {
            stroke: '#0C8DB9',
            opacity: '0.25'
        }
    },
    overviewEdge: {
        '& path': {
            stroke: theme.palette.primary.contrastText
        }
    },
    businessuserInfo: {
        fontSize: '2rem',
        cursor: 'pointer',
        color: theme.palette.primary.contrastText
    },
    foundationDataSideDrawer: {
        width: '50%',
        height: '97%',
        position: 'absolute',
        transform: 'translateX(calc(200% - 2rem))',
        background: theme.palette.primary.dark,
        zIndex: 1000
    },
    foundationTabLeftIcon: {
        position: 'absolute',
        top: '0',
        width: 'fit-content',
        zIndex: 101,
        transform: 'translateX(' + theme.spacing(2.5) + ')',
        backdropFilter: 'blur(1px)'
    },
    foundationTabInfoIcon: {
        width: '2.2rem',
        height: '2.2rem',
        cursor: 'pointer',
        color: theme.palette.primary.contrastText
    },
    workFlowDatabase: {
        '& div.react-flow__handle-left': {
            background: '#5AC6A0',
            border: 'none',
            top: '12.2%',
            width: '0.8rem',
            height: '0.9rem'
        },
        '& div.react-flow__handle-right': {
            opacity: 0
        }
    },
    workflowNodeNotSelectedData: {
        border: 'none',
        background: 'transparent',
        borderRadius: theme.spacing(1),
        visibility: 'unset',
        fontSize: '1.5rem !important',
        fontWeight: '400',
        padding: theme.spacing(1),
        textAlign: 'left !important',
        color: theme.palette.text.default,
        width: theme.spacing(25),
        cursor: 'pointer !important',
        overflowWrap: 'break-word',
        hyphens: 'auto',
        '& div.react-flow__handle': {
            width: theme.spacing(1),
            height: theme.spacing(1),
            background: '#0C8DB9',
            borderColor: '#0C8DB9'
        },
        '& div.react-flow__handle-right': {
            background: 'transparent',
            borderColor: '#0C8DB9'
        },
        '& div.workflowLabel': {
            fontWeight: 400
        }
    },
    databaseEdge: {
        '& path': {
            stroke: '#5AC6A0'
        }
    },
    connectedSystemFooter: {
        position: 'absolute',
        bottom: 0
    }
});

export default connSystemDashboardStyle;
