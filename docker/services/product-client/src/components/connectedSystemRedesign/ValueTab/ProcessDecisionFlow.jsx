import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
    Controls,
    // addEdge,
    // applyEdgeChanges,
    applyNodeChanges,
    ReactFlowProvider,
    useReactFlow
} from 'reactflow';
import CustomNode from './CustomNode';
import ConnSystemChatbot from 'components/minerva/ConnSystemChatbot.jsx';
// import { useDebouncedEffect } from 'hooks/useDebounceEffect';
import { Dialog, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import 'reactflow/dist/style.css';

const useStyles = makeStyles((theme) => ({
    dialog: {
        '& .MuiDialog-paperFullWidth': {
            width: '80%',
            height: '80%'
        }
    },
    reactFlowContainer: {
        marginLeft: '2rem',
        width: 'auto',
        height: '32rem',
        zIndex: 1000,
        '& .react-flow__pane': {
            top: '-10px'
        },
        '@media (min-height: 950px)': {
            height: '27rem'
        },
        '@media (min-height: 1100px)': {
            height: '29rem'
        }
    },
    iFrameContainer: {
        height: theme.layoutSpacing(1000),
        border: 'none'
    },
    iFrameClose: {
        position: 'absolute',
        top: '1%',
        right: 0
    }
}));

const Flow = ({ initialNodes, initialEdges, nodeTypes, showControls, onNodesChange }) => {
    const classes = useStyles();
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    // const reactFlowInstance = useReactFlow();
    const { setViewport } = useReactFlow();
    const getParams = () => {
        switch (true) {
            case window.innerWidth >= 1900:
                return 0.75;
            case window.innerWidth >= 1500:
                return 0.8;
            case window.innerWidth >= 1270:
                return 0.65;
            case window.innerWidth <= 1024:
                return 0.6;
            case window.innerWidth <= 1160:
                return 0.6;
            default:
                return 0.8;
        }
    };

    useEffect(() => {
        setNodes(initialNodes);
    }, [initialNodes]);

    useEffect(() => {
        setEdges(initialEdges);
    }, [initialEdges]);

    setViewport({ x: 0, y: 20, zoom: getParams() }, { duration: 800 });

    // useDebouncedEffect(
    //     () => {
    //         reactFlowInstance.fitView();
    //         setViewport({ x: 0, y: 20, zoom: getParams() }, { duration: 800 });
    //     },
    //     [window.innerWidth],
    //     2000
    // );

    const onNodeChanges = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    // const onEdgeChanges = useCallback(
    //     (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    //     [setEdges]
    // );
    // const onConnect = useCallback(
    //     (connection) => setEdges((eds) => addEdge(connection, eds)),
    //     [setEdges]
    // );

    useEffect(() => {
        if (onNodesChange) {
            onNodesChange(nodes);
        }
    }, [nodes]);

    return (
        <div className={classes.reactFlowContainer}>
            <ReactFlow
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                preventScrolling={false}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodeChanges}
                // onEdgesChange={onEdgeChanges}
                nodeTypes={nodeTypes}
                // onConnect={onConnect}
                fitView
                proOptions={{ hideAttribution: true, account: 'paid-pro' }}
            >
                {showControls && <Controls />}
            </ReactFlow>
        </div>
    );
};

export default function ProcessDecisionFlow({
    actions,
    setActions,
    selectedProcessConfig,
    setSelectedNode,
    onNodesChange,
    showControls
}) {
    const classes = useStyles();
    const [initialNodes, setNodes] = useState(selectedProcessConfig?.nodes || []);
    initialNodes.map((node) => {
        node.data['setActions'] = setActions;
        node.data['setSelectedNode'] = setSelectedNode;
    });
    const [initialEdges, setEdges] = useState(selectedProcessConfig?.edges || []);
    const nodeTypes = {
        customNode: CustomNode
    };

    const handleClickFlow = (e) => {
        console.log(e);
    };

    const getCopilotAppinfo = (copilot_config) => {
        var app_info = false;
        if (copilot_config['app_id']) {
            var app_id = parseInt(copilot_config['app_id']);

            app_info = {
                modules: {}
            };

            if (copilot_config['is_copilot']) {
                app_info.modules['copilot'] = {
                    enabled: true,
                    app_id: app_id,
                    server_url: copilot_config['server_url']
                };
            } else {
                app_info.modules['minerva'] = {
                    enabled: true,
                    tenant_id: app_id,
                    server_url: copilot_config['server_url']
                };
            }

            return app_info;
        } else {
            return false;
        }
    };

    useEffect(() => {
        setNodes(selectedProcessConfig?.nodes || []);
        setEdges(selectedProcessConfig?.edges || []);
    }, [selectedProcessConfig]);

    console.log(actions);

    return (
        <React.Fragment>
            <ReactFlowProvider>
                <Flow
                    onClick={handleClickFlow}
                    initialEdges={initialEdges}
                    initialNodes={initialNodes}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    showControls={showControls}
                />
            </ReactFlowProvider>
            {actions?.action?.app_id && (
                <Dialog open={true} fullWidth maxWidth="md" className={classes.dialog}>
                    <IconButton
                        title="Close"
                        onClick={() => {
                            setActions((prevstate) => ({ ...prevstate, action: { app_id: null } }));
                        }}
                        className={classes.iFrameClose}
                    >
                        <Close fontSize="large" />
                    </IconButton>
                    <iframe
                        scrolling="no"
                        src={`${window.location.origin}/app/26`}
                        className={classes.iFrameContainer}
                    ></iframe>
                </Dialog>
            )}
            {actions?.action?.app_link && (
                <Dialog open={true} fullWidth maxWidth="md" className={classes.dialog}>
                    <IconButton
                        title="Close"
                        onClick={() => {
                            setActions((prevstate) => ({
                                ...prevstate,
                                action: { app_link: null }
                            }));
                        }}
                        className={classes.iFrameClose}
                    >
                        <Close fontSize="large" />
                    </IconButton>
                    <iframe
                        scrolling="no"
                        src={`${actions.action.app_link}`}
                        className={classes.iFrameContainer}
                    ></iframe>
                </Dialog>
            )}
            {actions?.action?.ask && (
                <ConnSystemChatbot
                    app_info={getCopilotAppinfo(actions.action.copilot)}
                    open={true}
                    closePopup={() => {
                        setActions((prevstate) => ({
                            ...prevstate,
                            action: { ask: null }
                        }));
                    }}
                />
            )}
        </React.Fragment>
    );
}
