import React, { useEffect, useMemo } from 'react';
import { ReactFlow, useNodesState, useEdgesState, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from '@dagrejs/dagre';
import VisualGraphCustomNode from './VisualGraphCustomNode';
import { useSelector } from 'react-redux';

const nodeHeight = 70;
const minNodeWidth = 200;

const calculateTextWidth = (text, font = '16px sans-serif, Arial') => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    return context.measureText(text).width;
};

const getLayoutedElements = (nodes, edges) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setGraph({ rankdir: 'LR' });
    dagreGraph.setDefaultEdgeLabel(() => ({}));
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
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - nodeWithPosition.width / 2,
                y: nodeWithPosition.y - nodeWithPosition.height / 2
            }
        };
    });

    return { nodes: newNodes, edges };
};

function BrowseBlueprintVisualGraphRenderer({ classes, onClickPreview }) {
    const solutionBluePrintData = useSelector((state) => state.solutionBluePrint);
    const { treeviewNodes } = solutionBluePrintData;
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);

    const nodeTypes = useMemo(() => ({ VisualGraphCustomNode: VisualGraphCustomNode }), []);

    const flattenTree = (nodes, flatList = [], edges = []) => {
        nodes.forEach((node) => {
            const { child, ...nodeData } = node;
            flatList.push({ ...nodeData, child: child || [] });
            if (child && child.length > 0) {
                child.forEach((childNode) => {
                    edges.push({
                        source: String(node.nodeId),
                        target: String(childNode.nodeId),
                        type: 'step',
                        markerEnd: {
                            type: 'arrowclosed',
                            width: 20,
                            height: 20
                        },
                        id: `xy-edge__${node.nodeId}-${childNode.nodeId}`
                    });
                });
                flattenTree(child, flatList, edges);
            }
        });
        return { flatList, edges };
    };

    const buildReactFlowNodes = (nodes) => {
        const outputArr = [];
        nodes.forEach((nodeItem) => {
            outputArr.push({
                id: nodeItem?.nodeId?.toString(),
                type: 'VisualGraphCustomNode',
                position: { x: 100, y: 100 },
                data: [
                    {
                        onClickPreviewFn: onClickPreview,
                        value: nodeItem.name,
                        treeNode: nodeItem.child || [],
                        id: nodeItem?.nodeId?.toString(),
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
            });
        });

        return outputArr;
    };

    useEffect(() => {
        const { flatList: output, edges: outputEdges } = flattenTree(treeviewNodes);
        const reactFlowNodes = buildReactFlowNodes(output);
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            reactFlowNodes,
            outputEdges
        );
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
    }, [treeviewNodes]);

    const onCustomNodeChanges = (changes) => {
        onNodesChange(changes);
    };

    return (
        <div className={classes.reactFlowMainContainer}>
            <div className={classes.browseBlueprintReactFlowContainer}>
                <ReactFlow
                    nodes={nodes}
                    key="browseBpReactFlow"
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onCustomNodeChanges}
                    className={classes.browseBpReactFlow}
                    fitView
                    proOptions={{ hideAttribution: true, account: 'paid-pro' }}
                    colorMode={localStorage.getItem('codx-products-theme')}
                >
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>
        </div>
    );
}

export default BrowseBlueprintVisualGraphRenderer;
