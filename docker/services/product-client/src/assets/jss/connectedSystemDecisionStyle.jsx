const connectedSystemDecisionStyle = (theme) => ({
    decisionsFlowWrapper: {
        height: '100%'
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
        fill: theme.palette.text.default
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
        padding: 0,
        transition: 'border 0.6s linear, background 0.6s linear'
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
    }
});

export default connectedSystemDecisionStyle;
