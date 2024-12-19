import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    Controls,
    reconnectEdge,
    addEdge,
    Background,
    MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from '@dagrejs/dagre';
import { Typography, IconButton, Button } from '@material-ui/core';

import DynamicCustomNodeComponent from './DynamicCustomNodeComponent';
import { useDispatch, useSelector } from 'react-redux';
import {
    onAddNode,
    setSelectedNode,
    setBpState,
    onChangeResetBtnFlag,
    onNewNodeFieldChange,
    setShowFolderDetails
} from 'store';
import CloseIcon from 'assets/Icons/CloseBtn';
import CustomTextField from 'components/Forms/CustomTextField.jsx';
import { getParsedData } from 'components/dsWorkbench/solutionBluePrint/utils';

const nodeHeight = 70;
const minNodeWidth = 200;

const calculateTextWidth = (text, font = '16px sans-serif, Arial') => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    return context.measureText(text).width;
};

const getLayoutedElements = (nodes, edges) => {
    const isHorizontal = false;
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setGraph({ rankdir: 'TB' });
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    let connectedNodesIds = [];

    edges.forEach((item) => {
        connectedNodesIds.push(+item.source);
        connectedNodesIds.push(+item.target);
    });
    connectedNodesIds = [...new Set(connectedNodesIds)];

    nodes.forEach((node) => {
        const text = node?.data[0]?.value || '';
        const textWidth = calculateTextWidth(text);
        const nodeWidth = Math.max(minNodeWidth, textWidth + 30);
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        function checkPosition(node) {
            return node?.position?.x == 100 && node?.position?.y == 100;
        }

        return {
            ...node,
            targetPosition: isHorizontal ? 'left' : 'top',
            sourcePosition: isHorizontal ? 'right' : 'bottom',
            position:
                connectedNodesIds.indexOf(+node.id) !== -1
                    ? node.oldPosition
                    : !checkPosition(node)
                    ? node.position
                    : {
                          x: nodeWithPosition.x - nodeWithPosition.width / 2,
                          y: nodeWithPosition.y - nodeWithPosition.height / 2
                      },
            style: {
                width: nodeWithPosition.width,
                height: nodeHeight
            }
        };
    });

    return { nodes: newNodes, edges };
};

function ReactFlowRenderer({ classes }) {
    const edgeReconnectSuccessful = useRef(true);
    const solutionBluePrintData = useSelector((state) => state.solutionBluePrint);
    const dispatch = useDispatch();
    const {
        new_node_name,
        current_bp_State,
        node_deleted,
        resetBtnClcked,
        show_folder_details,
        last_node_id,
        is_download,
        last_node_position
    } = solutionBluePrintData;
    const { react_flow_data } = current_bp_State;
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        getParsedData(react_flow_data.initial_nodes),
        getParsedData(react_flow_data.initial_edges)
    );
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

    if (resetBtnClcked) {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            getParsedData(react_flow_data.initial_nodes),
            getParsedData(react_flow_data.initial_edges)
        );
        setEdges(layoutedEdges);
        setNodes(layoutedNodes);
        dispatch(onChangeResetBtnFlag(false));
    }
    if (node_deleted) {
        const { nodes: layoutedNodes } = getLayoutedElements(
            getParsedData(react_flow_data.available_nodes),
            getParsedData(react_flow_data.available_edges)
        );
        setNodes(layoutedNodes);
        dispatch(onChangeResetBtnFlag(false));
    }

    const close = () => {
        dispatch(setShowFolderDetails(false));
    };

    const onConnect = useCallback(
        (params) => {
            params.type = 'step';
            params.markerEnd = {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20
            };
            const newEdge = {
                ...params,
                id: `${params.source}-${params.target}`,
                source: params.source,
                target: params.target,
                type: params.type,
                markerEnd: params.markerEnd
            };
            dispatch(
                setBpState({
                    type: 'addEdge',
                    initial_edges: edges,
                    new_edges: newEdge
                })
            );
            setEdges((eds) => addEdge(params, eds));
        },
        [dispatch, setEdges]
    );

    const nodeTypes = useMemo(
        () => ({ DynamicCustomNodeComponent: DynamicCustomNodeComponent }),
        []
    );

    const onCustomNodeChanges = (changes) => {
        onNodesChange(changes);
        const updatedNodes = [...nodes];
        dispatch(
            setBpState({
                type: 'updateNode',
                available_nodes: getParsedData(updatedNodes)
            })
        );
    };

    const onReconnectStart = useCallback(() => {
        edgeReconnectSuccessful.current = false;
    }, []);

    const onReconnect = useCallback((oldEdge, newConnection) => {
        edgeReconnectSuccessful.current = true;
        setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    }, []);

    const onReconnectEnd = useCallback((_, edge) => {
        if (!edgeReconnectSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }

        edgeReconnectSuccessful.current = true;
    }, []);

    const onSelectionChange = useCallback((elements) => {
        const selectedNodes = elements.nodes;
        dispatch(setSelectedNode(getParsedData(selectedNodes)));
    }, []);

    useEffect(() => {
        if (edges.length > 0) {
            dispatch(
                onAddNode({
                    edges
                })
            );
        }
        const updatedEdges = [...getParsedData(edges)];
        dispatch(
            setBpState({
                type: 'updateEdge',
                new_edges: getParsedData(updatedEdges)
            })
        );
    }, [edges]);

    useEffect(() => {
        if (is_download) {
            let initial_nodes = getParsedData(react_flow_data.available_nodes).map((obj) => {
                let newObj = { ...obj };
                delete newObj.measured;
                return newObj;
            });
            const { nodes: layoutedNodes } = getLayoutedElements(
                initial_nodes,
                getParsedData(react_flow_data.available_edges)
            );
            setNodes(layoutedNodes);
        } else {
            const { nodes: layoutedNodes } = getLayoutedElements(
                getParsedData(react_flow_data.initial_nodes),
                getParsedData(react_flow_data.available_edges)
            );
            setNodes(layoutedNodes);
        }
    }, [react_flow_data.initial_nodes]);

    const onNodeClick = () => {
        close();
    };

    const onAddNodeBtnClick = () => {
        let newNodes = [].concat(nodes);
        const newNode = {
            id: last_node_id.toString(),
            position: { x: last_node_position.x + 100, y: last_node_position.y + 100 },
            sourcePosition: 'right',
            targetPosition: 'left',
            type: 'DynamicCustomNodeComponent',
            deletable: true,
            selectable: true,
            data: [
                {
                    value: new_node_name,
                    treeNode: [],
                    id: last_node_id.toString(),
                    isNewNode: true,
                    handles: [
                        {
                            type: 'target',
                            position: 'Left'
                        },
                        {
                            type: 'source',
                            position: 'Right'
                        }
                    ]
                }
            ]
        };
        newNodes.push(newNode);
        const { nodes: layoutedNodes } = getLayoutedElements(
            newNodes,
            getParsedData(react_flow_data.available_edges)
        );
        setNodes(layoutedNodes);
        dispatch(
            setBpState({
                type: 'addNode',
                last_node_id: last_node_id + 1,
                new_nodes: newNode,
                available_nodes: getParsedData([...nodes, ...newNodes])
            })
        );
    };

    return (
        <div className={classes.reactFlowMainContainer}>
            <div className={classes.react_flow_container}>
                <ReactFlow
                    key="mainReactFlow"
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onCustomNodeChanges}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    className={classes.sbReactFlow}
                    onReconnect={onReconnect}
                    onReconnectStart={onReconnectStart}
                    onReconnectEnd={onReconnectEnd}
                    onSelectionChange={onSelectionChange}
                    onNodeClick={onNodeClick}
                    fitView
                    proOptions={{ hideAttribution: true, account: 'paid-pro' }}
                    colorMode={localStorage.getItem('codx-products-theme')}
                >
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>
            {show_folder_details && (
                <div className={classes.folderDetailsContainer}>
                    <div className="topBar">
                        <Typography variant="h4" className={classes.heading}>
                            {'Folder Details'}
                        </Typography>
                        <IconButton
                            title="Close"
                            onClick={close}
                            className={'closeIcon'}
                            aria-label="Close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <hr className={classes.sepratorline} />
                    <div className="detailsContainer">
                        <CustomTextField
                            key="name"
                            field_info={{
                                label: 'Name',
                                id: 'folderName',
                                fullWidth: true,
                                required: true,
                                value: new_node_name,
                                onChange: (value) => {
                                    dispatch(onNewNodeFieldChange(value));
                                }
                            }}
                        />
                    </div>
                    <div className="saveBtnContiner">
                        <Button
                            key="save-exec-folder"
                            variant="contained"
                            onClick={onAddNodeBtnClick}
                            size="small"
                            disabled={!new_node_name.trim()}
                            aria-label="Add Folder"
                            title="Add Folder"
                        >
                            + Add
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReactFlowRenderer;
