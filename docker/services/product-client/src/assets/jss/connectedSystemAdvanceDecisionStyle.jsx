const connectedSystemDecisionStyle = (theme) => ({
    decisionsFlowWrapper: {
        height: '100%',
        '& div.react-flow__handle': {
            display: 'none!important'
        }
    },
    decisionsFlowHead: {
        fontSize: theme.spacing(2.5),
        fontWeight: '300',
        color: theme.palette.text.default,
        marginLeft: theme.spacing(3),
        position: 'relative',
        top: '.8rem',
        paddingLeft: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    decisionsFlowIcon: {
        fill: theme.ConnectedSystemDashboard.reactflow.edgeOne,
        cursor: 'pointer'
    },
    node: {
        background: 'transparent',
        color: theme.palette.text.default,
        fontSize: '12.7px',
        fontWeight: 500,
        letterSpacing: '1px',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    nodeStyle: {
        background: theme.palette.background.flowNode,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0
    },
    edgeStyle: {
        stroke: theme.palette.border.flowEdge
    },
    tick: {
        position: 'absolute',
        top: '-7px',
        right: '-7px',
        background: theme.palette.background.flowNode,
        borderRadius: '50%'
    },
    customNodeStyle: {
        background: 'transparent',
        fontSize: 'inherit',
        fontWeight: '500',
        letterSpacing: '1px',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'flex-start',
        paddingBottom: '3px',
        position: 'relative',
        '& > react-flow__handle': {
            display: 'none!important'
        }
    },
    customArrowNodeStyle: {
        width: '95%'
    },
    rightArrowIcon: {
        position: 'absolute',
        top: '40%',
        right: '4%',
        stroke: theme.ConnectedSystemDashboard.decisionFlow.arrowRight.stroke.default
    },
    selectedRightArrow: {
        stroke: theme.ConnectedSystemDashboard.decisionFlow.arrowRight.stroke.selected
    },
    iconStyle: {
        marginRight: '1.3rem',
        marginLeft: '0.5rem',
        display: 'flex',
        gap: '0rem'
    },
    highlightedNodeStyle: {
        background:
            theme.ConnectedSystemDashboard.decisionFlow.node.background.highlight + '!important',
        borderRadius: '2px!important',
        padding: '0.5rem 1rem!important'
    },
    selectedNodeStyle: {
        background:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? theme.ConnectedSystemDashboard.decisionFlow.node.background.selected +
                  ' !important'
                : theme.palette.text.default + ' !important',
        borderRadius: '2px!important',
        padding: '0.5rem 1rem!important',
        color:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? 'white!important'
                : theme.palette.text.peachText,
        border: 'none!important'
    },
    headNodeStyle: {
        alignItems: 'flex-end',
        fontWeight: '400',
        padding: '10px',
        textAlign: 'center'
    },
    decisionsHeadNodeStyle: {
        position: 'absolute',
        top: '72%',
        fontSize: '2.32rem!important'
    },
    customHeadStyle: {
        color: theme.palette.text.peachText,
        background: theme.palette.text.default,
        borderRadius: '2px',
        fontSize: '2.42rem',
        lineeight: '21px',
        letterSpacing: '1px'
    },
    'div.react-flow__handle.react-flow__handle-bottom': {
        display: 'none'
    },
    overlayStyle: {
        width: '370px',
        position: 'absolute',
        top: '200px',
        left: 0
    },
    yAxisTextStyle: {
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        transform: 'rotate(180deg)',
        fontSize: '13px',
        position: 'relative',
        left: '10px',
        fontWeight: '600'
    },
    reactFlow__node: {
        '&.selected': {
            border: 'none'
        }
    },
    '.react-flow__handle': {
        display: 'none'
    },
    reactFlow: {
        background: 'red'
    },
    headNodeHeading: {
        gap: '5px',
        fontSize: '2.8rem',
        color: theme.palette.text.peachText,
        paddingBottom: '12px',
        alignItems: 'flex-end',
        letterSpacing: '1px',
        '& path': {
            fill: `${theme.palette.text.peachText} !important`
        }
    },
    summarySubquestion: {
        width: '100%',
        height: '35%',
        background: theme.ConnectedSystemDashboard.decisionFlow.subQuestion,
        position: 'fixed',
        bottom: 0,
        left: 0,
        opacity: 0.2
    },
    currentMarkerStyle: {
        position: 'absolute',
        top: '-19px',
        right: '2px',
        color: theme.ConnectedSystemDashboard.decisionFlow.currentMarker,
        fontWeight: '500',
        letterSpacing: '0.5px'
    },
    completedMarkerStyle: {
        position: 'absolute',
        top: '-6.23px',
        right: '-5.55px'
    },
    stakeHolderIcon: {
        height: '2.5rem',
        width: '2.5rem',
        background: `var(--background, black)`,
        marginLeft: '-1rem'
    },
    excessStakeholders: {
        borderRadius: '50%',
        border: '1px solid ' + theme.ConnectedSystemDashboard.decisionFlow.excessStakeholder,
        height: '2.5rem',
        width: '2.5rem',
        background: theme.palette.background.flowNode,
        marginLeft: '-1rem',
        zIndex: 1,
        fontWeight: 500,
        lineHeight: '13px',
        letterSpacing: '0.5px',
        fontSize: '1.39rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.text.default
    }
});

export default connectedSystemDecisionStyle;
