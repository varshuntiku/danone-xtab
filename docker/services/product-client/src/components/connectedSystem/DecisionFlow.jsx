import { Typography, makeStyles } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, MarkerType } from 'reactflow';
import { getDecisionFlow } from 'services/connectedSystem';
import { ReactComponent as Tick } from 'assets/img/tick.svg';
import { ReactComponent as DecisonFLow } from 'assets/img/decisionFlowIcon.svg';

import connectedSystemDecisionStyle from 'assets/jss/connectedSystemDecisionStyle.jsx';

const useStyles = makeStyles((theme) => ({
    ...connectedSystemDecisionStyle(theme)
}));

const DecisionFlow = (props) => {
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const [decisionState, setDecisionState] = useState({});
    const [selectedNode, setSelectedNode] = useState(null);

    const classes = useStyles();

    useEffect(() => {
        if (!nodes.length) {
            getDecisionFlow({ callback: setNodesAndEdges });
        } else {
            setNodesAndEdges(decisionState);
        }
    }, [props.theme.palette.background.flowNode]);

    useEffect(() => {
        setSelectedNode(null);
    }, [props.selected_workflow]);

    useEffect(() => {
        if (nodes.length) {
            setNodesAndEdges(decisionState);
        }
    }, [selectedNode]);

    const setNodesAndEdges = (data = {}) => {
        setDecisionState(data);
        setNodes(transformNodes(data.decisions?.nodes));
        setEdges(transformEdges(data.decisions?.edges));
    };

    const transformNodes = (nodes = []) => {
        if (nodes.length) {
            return nodes.map((node, i) => {
                const isActiveNode = node.id === `${selectedNode}`;
                const borderColor = isActiveNode
                    ? 'rgba(122, 207, 255)'
                    : props.theme.palette.border.nodeBorder;
                const borderWidth = isActiveNode ? '3px' : '1.5px';
                const xIncIndex = Math.floor(i / 4);
                const yIncIndex = i % 4;
                return {
                    ...node,
                    position: { x: xIncIndex * 235, y: yIncIndex * 100 },
                    data: {
                        label: renderNode(node)
                    },
                    style: {
                        background: isActiveNode
                            ? 'rgba(122, 207, 255, 0.15)'
                            : props.theme.palette.background.flowNode,
                        borderRadius: '4px',
                        border: 'solid',
                        borderWidth: node.isSelected ? '1.5px' : borderWidth,
                        borderColor: node.isSelected ? '#7DC98B' : borderColor,
                        width: '208px',
                        height: '76px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    },
                    className: classes.nodeStyle
                };
            });
        }
    };

    const renderNode = (node) => {
        return (
            <>
                <div className={classes.node} data-id={node.id}>
                    {node.text}
                </div>
                {node.isSelected ? <Tick className={classes.tick} /> : null}
            </>
        );
    };

    const transformEdges = (edges = []) => {
        if (edges.length) {
            const edgeColor = props.theme.palette.border.flowEdge;
            return edges.map((edge) => ({
                ...edge,
                className: classes.edgeStyle,
                style: { stroke: edgeColor },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: edgeColor
                }
            }));
        }
    };

    const selectNode = (e) => {
        let nodeId = e.target.getAttribute('data-id');
        if (nodeId) {
            const node = nodes.find((node) => node.id === nodeId);
            nodeId = parseInt(nodeId);
            const { solution_id } = node;
            const selectedSolution = nodeId === selectedNode ? [] : solution_id;
            const selectedNodeId = nodeId === selectedNode ? null : nodeId;
            props.selectSolution(selectedSolution);
            setSelectedNode(selectedNodeId);
        }
    };

    return (
        <div className={classes.decisionsFlowWrapper} onClick={selectNode}>
            <Typography className={classes.decisionsFlowHead}>
                Decision Flow <DecisonFLow className={classes.decisionsFlowIcon} />
            </Typography>
            <ReactFlow
                fitView
                zoomOnScroll={false}
                zoomOnDoubleClick={false}
                preventScrolling={true}
                nodes={nodes}
                edges={edges}
                proOptions={{ hideAttribution: true, account: 'paid-pro' }}
            />
        </div>
    );
};

export default withTheme(DecisionFlow);
