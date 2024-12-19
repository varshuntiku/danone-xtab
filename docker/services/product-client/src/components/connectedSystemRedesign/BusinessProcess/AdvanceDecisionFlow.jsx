import { makeStyles } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import ReactFlow, {
    useNodesState,
    useEdgesState,
    MarkerType,
    useReactFlow,
    ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ReactComponent as Tick } from 'assets/img/tick.svg';
import { ReactComponent as NodeIcon } from 'assets/img/nodeIcon.svg';
import { ReactComponent as MessagePopupIcon } from 'assets/img/messagePopup.svg';
import { ReactComponent as StrategySvg } from 'assets/img/strategyInsights.svg';
import { ReactComponent as FinanceSvg } from 'assets/img/finance.svg';
import { ReactComponent as CommercialSvg } from 'assets/img/commercial.svg';
import { ReactComponent as RightArrowSvg } from 'assets/img/right-arrow.svg';
import CustomNode from '../CustomNode';
import CustomEdge from '../BusinessProcess/CustomEdge';
import { Avatar } from '@material-ui/core';

import connectedSystemDecisionStyle from 'assets/jss/connectedSystemAdvanceDecisionStyle.jsx';
import { useDebouncedEffect } from 'hooks/useDebounceEffect';

const useStyles = makeStyles((theme) => ({
    ...connectedSystemDecisionStyle(theme)
}));

const nodeTypes = {
    custom: CustomNode
};

const edgeTypes = {
    positionaledge: CustomEdge
};

const Flow = (props) => {
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const [decisionState, setDecisionState] = useState({});
    const [selectedNode, setSelectedNode] = useState(props.selectedNodeId || null);
    const [linkedProblemDefinitions, setLinkedProblemDefinitions] = useState([]);
    const [activeStakeholders, setActiveStakeholders] = useState([]);
    const classes = useStyles();
    const reactFlowInstance = useReactFlow();
    useEffect(() => {
        if (nodes?.length) {
            setNodesAndEdges(decisionState);
        } else {
            setNodesAndEdges(props.data);
        }
        props.setUnactiveStakeholders &&
            props.setUnactiveStakeholders({
                ...props.unactiveStakeholders,
                [props.linkedProblemDefinitionId]: getUnactiveStakeholders(activeStakeholders)
            });
    }, [
        props.theme?.palette?.background?.flowNode,
        props?.parentFnId,
        props?.linkedProblemDefinitionId,
        props.data,
        props.selectedStakeHolder?.id,
        activeStakeholders
    ]);

    useEffect(() => {
        if (nodes?.length) {
            setNodesAndEdges(decisionState);
        }
        if (props?.setSelectedStakeHolder) {
            props.setSelectedStakeHolder(null);
        }
    }, [selectedNode]);

    const getUnactiveStakeholders = (activeStakeholders) => {
        const unactiveStakeholders = [];
        props.stakeholders.forEach((stakeholder) => {
            if (!activeStakeholders.includes(stakeholder.id))
                unactiveStakeholders.push(stakeholder.id);
        });
        return [...new Set(unactiveStakeholders)];
    };

    useDebouncedEffect(
        () => {
            reactFlowInstance.fitView();
        },
        [window.innerWidth],
        2000
    );

    const getCollectedNodes = (node, outputNodesList, inputNodesList, totalDownstreamNodes) => {
        if (!node || !Object.keys(node).length) return outputNodesList;
        const nodesToAdd = inputNodesList.filter((n) => {
            const isDownstream =
                node?.downstreamNodes?.includes(n.id) && !totalDownstreamNodes.includes(n.id);
            if (isDownstream) totalDownstreamNodes.push(n.id);
            return isDownstream;
        });
        outputNodesList.push(...nodesToAdd);
        nodesToAdd.forEach((node) =>
            getCollectedNodes(node, outputNodesList, inputNodesList, totalDownstreamNodes)
        );
        return outputNodesList;
    };

    const tabsMap = {
        wf_node_4: ['wf_node_5'],
        wf_node_5: ['wf_node_4', 'wf_node_6'],
        wf_node_6: ['wf_node_5'],
        wf_node_7: ['wf_node_8'],
        wf_node_8: ['wf_node_7', 'wf_node_9'],
        wf_node_9: ['wf_node_8'],
        wf_node_10: ['wf_node_11'],
        wf_node_11: ['wf_node_10', 'wf_node_12'],
        wf_node_12: ['wf_node_11'],
        wf_node_13: ['wf_node_14'],
        wf_node_14: ['wf_node_13', 'wf_node_15'],
        wf_node_15: ['wf_node_14', 'wf_node_16'],
        wf_node_16: ['wf_node_15'],
        wf_node_17: ['wf_node_18'],
        wf_node_18: ['wf_node_17', 'wf_node_19'],
        wf_node_19: ['wf_node_18']
    };

    const getFilteredNodes = (data) => {
        if (props.screen === 'decisions') {
            return data.decisions?.nodes.filter(
                (node) =>
                    (node.tab && tabsMap[props.linkedProblemDefinitionId].includes(node.tabId)) ||
                    (node.parentFnId === props.parentFnId &&
                        node.linkedProblemDefinitionId === props.linkedProblemDefinitionId &&
                        !node.decisionCategory)
            );
        }
        if (props.screen === 'summary') {
            if (selectedNode === '11') return props.customData?.tradeDiscountNodes;
            const totalDownstreamNodes = [selectedNode];
            const selectedNodeDetails = data.decisions?.nodes.find(
                (node) => node.id === selectedNode
            );
            const filteredBaseNodes = data.decisions?.nodes.filter(
                (node) =>
                    node.id === selectedNode ||
                    node.subhead ||
                    (node.linkedParentNodeIds && node.linkedParentNodeIds.includes(selectedNode))
            );
            getCollectedNodes(
                selectedNodeDetails,
                filteredBaseNodes,
                data.decisions?.nodes,
                totalDownstreamNodes
            );
            return filteredBaseNodes;
        }
        return data.decisions?.nodes.filter((node) => !node.tab);
    };

    const getFilteredEdges = (data) => {
        if (props.screen === 'decisions') {
            return data.decisions?.edges.filter((edge) => {
                return edge?.screens?.includes('decisions');
            });
        }
        if (props.screen === 'summary' && selectedNode === '9')
            return props.customData?.redefineSummaryEdges;
        if (props.screen === 'summary' && selectedNode === '11')
            return props.customData?.tradeDiscountEdges;
        return data.decisions?.edges.filter((edge) => {
            if (props.screen === 'summary') {
                return true;
            } else {
                return (
                    (edge.show || edge.nodeIds?.includes(selectedNode)) &&
                    edge?.screens?.includes('detailed')
                );
            }
        });
    };

    const updateFilteredNodes = (filteredNodes) => {
        if (props.screen === 'summary') {
            const decisionCategoriesStatus = {
                22: false,
                23: false,
                24: false
            };
            filteredNodes.forEach((node) => {
                if (node.decisionCategory && !node.subhead)
                    decisionCategoriesStatus[node.decisionCategory] = true;
            });
            return filteredNodes.filter(
                (node) => !node.decisionCategory || decisionCategoriesStatus[node.decisionCategory]
            );
        }
        return filteredNodes;
    };

    const setNodesAndEdges = (data = {}) => {
        const filteredNodes = getFilteredNodes(data);
        const filteredEdges = getFilteredEdges(data);
        const updatedFilteredNodes = updateFilteredNodes(filteredNodes);
        setDecisionState(data);
        setNodes(transformNodes(updatedFilteredNodes));
        setEdges(transformEdges(filteredEdges));
        setLinkedProblemDefinitions(data.linkedProblemDefinitions);
    };

    const transformNodes = (nodes = []) => {
        if (nodes.length) {
            let xIncIndex = props.x || -0.95;
            let yIncIndex = props.y || -1;
            let decisionsYIndex = 0;
            const currentActiveStakeholders = [];
            const transformedNodes = nodes.map((node, index) => {
                node.stakeholders && currentActiveStakeholders.push(...node.stakeholders);
                yIncIndex += 1;
                if ((index > 0 || props.screen !== 'decisions') && node.head) {
                    xIncIndex += 1;
                    yIncIndex = props.yIncIndexForHead || 0;
                }

                const linkedSubquestionNode =
                    node.linkedParentNodeIds && node.linkedParentNodeIds.includes(selectedNode);

                const getFillColor = () => {
                    if (props.screen === 'summary' || props.screen === 'decisions')
                        return node.color;
                    return !node.decisionCategory || linkedSubquestionNode ? node.color : '#B6B9BF';
                };
                const getBgColor = () => {
                    if (props.screen === 'decisions') {
                        return node?.stakeholders
                            ? node.stakeholders.includes(props.selectedStakeHolder?.id)
                                ? props.selectedStakeHolder.nodeColor
                                : node.status === 'completed'
                                ? node.bgColor
                                : props.theme?.palette?.background?.flowNode
                            : node.status === 'completed'
                            ? node.bgColor
                            : props.theme?.palette?.background?.flowNode;
                    }
                    if (node.subhead) return 'transparent';
                    if (props.screen === 'summary')
                        return node.id === selectedNode ? '#3A75F6' : node.bgColor;
                    else if (node.decisionCategory && !linkedSubquestionNode) return '#fff';
                    return node.bgColor;
                };
                const getTabPositionsStyle = (node) => {
                    switch (node.tabId) {
                        case 'wf_node_4':
                        case 'wf_node_10':
                        case 'wf_node_7':
                        case 'wf_node_13':
                        case 'wf_node_17':
                            return {
                                transform: `translate(${
                                    window.innerWidth < 1800 ? '0px' : '15px'
                                }, 201px) rotate(-90deg)`
                            };
                        case 'wf_node_8':
                        case 'wf_node_18':
                        case 'wf_node_11':
                        case 'wf_node_14':
                        case 'wf_node_15':
                        case 'wf_node_5':
                            if (
                                props.linkedProblemDefinitionId === 'wf_node_7' ||
                                props.linkedProblemDefinitionId === 'wf_node_10' ||
                                props.linkedProblemDefinitionId === 'wf_node_17' ||
                                props.linkedProblemDefinitionId === 'wf_node_13' ||
                                props.linkedProblemDefinitionId === 'wf_node_14' ||
                                props.linkedProblemDefinitionId === 'wf_node_4'
                            ) {
                                return { transform: 'translate(915px, 16px) rotate(90deg)' };
                            }
                            if (
                                props.linkedProblemDefinitionId === 'wf_node_9' ||
                                props.linkedProblemDefinitionId === 'wf_node_12' ||
                                props.linkedProblemDefinitionId === 'wf_node_19' ||
                                props.linkedProblemDefinitionId === 'wf_node_15' ||
                                props.linkedProblemDefinitionId === 'wf_node_16' ||
                                props.linkedProblemDefinitionId === 'wf_node_6'
                            ) {
                                return { transform: 'translate(40px, 201px) rotate(-90deg)' };
                            }
                            break;
                        case 'wf_node_9':
                        case 'wf_node_19':
                        case 'wf_node_12':
                        case 'wf_node_6':
                            return {
                                transform: `translate(${
                                    window.innerWidth < 1800 ? '950px' : '935px'
                                }, 16px) rotate(90deg)`
                            };
                        case 'wf_node_16':
                            return {
                                transform: `translate(${
                                    window.innerWidth < 1800 ? '990px' : '975px'
                                }, 16px) rotate(90deg)`
                            };
                        default:
                            return { transform: 'translate(15px, 201px) rotate(-90deg)' };
                    }
                };
                const getPositionX = (linkedProblemDefinitionId, xIndex) => {
                    switch (linkedProblemDefinitionId) {
                        case 'wf_node_8':
                        case 'wf_node_18':
                        case 'wf_node_11':
                        case 'wf_node_5':
                            return xIndex * 280 + 70;
                        case 'wf_node_9':
                        case 'wf_node_19':
                        case 'wf_node_12':
                        case 'wf_node_16':
                        case 'wf_node_6':
                            return xIndex * 280 + 105;
                        case 'wf_node_14':
                            return xIndex * 280 + 45;
                        case 'wf_node_15':
                            return xIndex * 280 + 110;
                        default:
                            return xIndex * 280 + 40;
                    }
                };
                const getPosition = (node, index) => {
                    if (props.screen === 'decisions') {
                        let xIndex = index % 3;
                        let yIndex = decisionsYIndex;
                        if (index && index % 3 === 0) {
                            decisionsYIndex += 1;
                            yIndex = decisionsYIndex;
                        }
                        return {
                            x: getPositionX(node.linkedProblemDefinitionId, xIndex),
                            y: yIndex * 110 + 17
                        };
                    }
                    if (props.screen === 'summary') {
                        return (
                            node.position || {
                                x: xIncIndex * 360 + 40,
                                y: yIncIndex * (props.yInc || 85)
                            }
                        );
                    }
                    return { x: xIncIndex * 360 + 40, y: yIncIndex * (props.yInc || 100) };
                };
                const getBorder = () => {
                    if (props.screen === 'decisions') {
                        if (node.tab) return '1px solid #3A75F6';
                        return node.status === 'pending'
                            ? `1px solid ${
                                  node?.stakeholders
                                      ? node.stakeholders.includes(props.selectedStakeHolder?.id)
                                          ? props.selectedStakeHolder.profileColor
                                          : '#624D4D'
                                      : '#624D4D'
                              }`
                            : `1px solid ${
                                  node?.stakeholders
                                      ? node.stakeholders.includes(props.selectedStakeHolder?.id)
                                          ? props.selectedStakeHolder.profileColor
                                          : node.color
                                      : node.color
                              }`;
                    }
                    return 'none';
                };
                const getBoxShadow = () => {
                    if (props.screen === 'decisions') {
                        if (node.tab)
                            return `2px 2px 2px 2px ${
                                node?.stakeholders
                                    ? node.stakeholders.includes(props.selectedStakeHolder?.id)
                                        ? props.selectedStakeHolder.nodeColor
                                        : 'rgba(58, 117, 246, 0.10'
                                    : 'rgba(58, 117, 246, 0.10'
                            }`;
                        return node.status === 'current'
                            ? `0px 4px 4px 4px ${
                                  node?.stakeholders
                                      ? node.stakeholders.includes(props.selectedStakeHolder?.id)
                                          ? props.selectedStakeHolder.nodeColor
                                          : `${node.color}26`
                                      : `${node.color}26`
                              }`
                            : 'none';
                    }
                    return 'none';
                };
                const getWidth = () => {
                    if (props.screen === 'decisions') {
                        if (node.tab) return '185px';
                        return '250px';
                    }
                    return node.id === selectedNode && props.screen === 'summary'
                        ? '500px'
                        : node.subhead
                        ? '400px'
                        : '305px';
                };
                const getHeight = () => {
                    if (props.screen === 'decisions') {
                        return node.tab ? '40px' : '73px';
                    }
                    return '60px';
                };
                return {
                    ...node,
                    position: getPosition(node, index),
                    draggable: true,
                    data: {
                        label: renderNode(
                            node,
                            node.id === selectedNode && props.screen === 'summary'
                                ? 'head-node'
                                : 'custom',
                            linkedSubquestionNode
                        )
                    },
                    style: {
                        background: getBgColor(),
                        color: (getBgColor() === '#fff' || getBgColor() === '#E8F1CE') && '#000',
                        border: getBorder(),
                        borderRadius: '2px',
                        boxShadow: getBoxShadow(),
                        width: getWidth(),
                        minHeight: getHeight(),
                        textAlign: 'left',
                        fill: getFillColor(),
                        display: 'flex',
                        alignItems: props.screen === 'decisions' ? 'flex-start' : 'center',
                        fontSize: props.screen === 'decisions' ? '12px' : '12px',
                        ...(node.tab && { justifyContent: 'center' }),
                        ...(node.tab && getTabPositionsStyle(node))
                    },
                    className: `${linkedSubquestionNode && classes.highlightedNodeStyle} ${
                        node.id === selectedNode && classes.selectedNodeStyle
                    }`
                };
            });
            setActiveStakeholders([...new Set(currentActiveStakeholders)]);
            return transformedNodes;
        }
    };

    const icons = {
        pricing: <MessagePopupIcon fill={'white'} />,
        strategy: <StrategySvg fill={'inherit'} />,
        finance: <FinanceSvg fill={'inherit'} />,
        commercial: <CommercialSvg fill={'inherit'} />
    };

    const renderMarker = (screen, nodeStatus) => {
        if (screen !== 'decisions') return null;
        switch (nodeStatus) {
            case 'completed':
                return (
                    <div className={classes.completedMarkerStyle}>
                        <Tick />
                    </div>
                );
            case 'current':
                return <div className={classes.currentMarkerStyle}>Current Step</div>;
            default:
                return null;
        }
    };

    const nodeClickHandler = (e, node) => {
        if (props.screen !== 'decisions' && props.openPopupHandler) {
            return props.openPopupHandler(node.id);
        }
        if (node.tab && props.onTabClick) {
            const problemDefinition = props.problemDefinitions.find(
                (problemDefinition) => problemDefinition.id === node.tabId
            );
            return props.onTabClick(e, problemDefinition);
        }
        return null;
    };

    const getProfileColor = (id) => {
        let iconColor = '#98B1ED';
        for (let stakeholder of props.stakeholders) {
            if (id == stakeholder.id) {
                iconColor = stakeholder.profileColor;
                break;
            }
        }
        return iconColor;
    };

    const renderStakeholdersAvatars = (stakeholders) => {
        const stakeholdersRender = [];
        stakeholders.forEach((val, index) => {
            if (index === 0 || index === 1) {
                stakeholdersRender.push(
                    <Avatar
                        className={classes.stakeHolderIcon}
                        style={{
                            '--background': getProfileColor(val)
                        }}
                        key={`stakeholder${index}`}
                    />
                );
            }
        });
        if (stakeholders.length > 2) {
            stakeholdersRender.push(
                <div className={classes.excessStakeholders}>{`+${stakeholders.length - 2}`}</div>
            );
        }
        return stakeholdersRender;
    };

    const renderNode = (node, type) => {
        const showArrow = props.screen === 'detailed' && !node.decisionCategory && !node.head;
        switch (type) {
            case 'custom':
                return (
                    <div data-id={node.id} onClick={(e) => nodeClickHandler(e, node)}>
                        <div
                            data-id={node.id}
                            style={{
                                ...(node?.styles?.fontSize && { fontSize: node.styles.fontSize }),
                                ...(node?.styles?.fontWeight && {
                                    fontWeight: node.styles.fontWeight
                                })
                            }}
                            className={`${classes.customNodeStyle}
                            ${node.head && classes.headNodeStyle}
                            ${
                                node.head &&
                                props.screen === 'decisions' &&
                                classes.decisionsHeadNodeStyle
                            }
                            ${showArrow && classes.customArrowNodeStyle}
                        `}
                        >
                            {!node.tab && (
                                <div data-id={node.id} className={classes.iconStyle}>
                                    {props.screen === 'decisions'
                                        ? icons[node.icon] ||
                                          (node.stakeholders &&
                                              renderStakeholdersAvatars(node.stakeholders))
                                        : icons[node.icon] || <NodeIcon fill={'inherit'} />}
                                </div>
                            )}
                            <div data-id={node.id}>{node.text}</div>
                        </div>
                        {renderMarker(props.screen, node.status)}
                        {showArrow && (
                            <RightArrowSvg
                                data-id={node.id}
                                className={`
                        ${classes.rightArrowIcon}
                        ${node.id === selectedNode && classes.selectedRightArrow}
                    `}
                            />
                        )}
                    </div>
                );
            case 'head-node':
                return (
                    <div
                        data-id={node.id}
                        className={`${classes.headNodeStyle} ${classes.customHeadStyle}`}
                    >
                        <div className={`${classes.node} ${classes.headNodeHeading}`}>
                            {icons['pricing']}
                            {'Pricing'}
                        </div>
                        <div>{node.text}</div>
                    </div>
                );
            case 'default':
                return (
                    <>
                        <div className={classes.node} data-id={node.id} onClick={selectNode}>
                            {node.text}
                        </div>
                        {node.isSelected ? <Tick className={classes.tick} /> : null}
                    </>
                );
        }
    };

    const getEdgeColor = (edge) => {
        const edgeColor = '#B6B9BF';
        const color = edge.color || edgeColor;
        if (props.screen === 'decisions') {
            if (edge.stakeholders?.includes(props.selectedStakeHolder?.id))
                return props.selectedStakeHolder?.profileColor;
            if (edge.status === 'completed') return color;
        }
        if (edge.nodeIds?.includes(selectedNode)) return color;
        if (props.screen === 'summary') return color;
        return edgeColor;
    };

    const transformEdges = (edges = []) => {
        if (edges.length) {
            return edges.map((edge, index) => {
                return {
                    id: `${edge.id}-${index}`,
                    source: edge.source,
                    target: edge.target,
                    type: edge.type || 'smoothstep',
                    // Edit the offset for edges if edges are not appearing properly and are intersecting with each other. Try different values to see what works in you case.
                    pathOptions: { offset: 5, borderRadius: 5 },
                    animated: true,
                    sourceHandle: edge?.sourceHandle,
                    targetHandle: edge?.targetHandle,
                    className: classes.edgeStyle,
                    style: {
                        stroke: getEdgeColor(edge),
                        strokeWidth: '1.5px',
                        padding: '3rem'
                    },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: getEdgeColor(edge)
                    },
                    data: { spacing: edge.spacing }
                };
            });
        }
    };

    const selectNode = (e) => {
        let nodeId = e.target.getAttribute('data-id');
        if (nodeId && selectedNode !== nodeId) {
            const node = nodes.find((node) => node.id === nodeId);
            if (!node.decisionCategory) {
                setSelectedNode(nodeId);
                props.selectedNodeIdHandler && props.selectedNodeIdHandler(nodeId);
            }
        } else if (selectedNode === nodeId) {
            setSelectedNode(null);
            props.selectedNodeIdHandler && props.selectedNodeIdHandler(null);
        }
    };

    const getHeight = () => {
        switch (true) {
            case window.screen.availHeight > 1600:
                return '35rem';
            default:
                return '80rem';
        }
    };

    getHeight();

    const getParams = () => {
        switch (true) {
            case window.innerWidth >= 1900:
                return 1.225;
            case window.innerWidth >= 1500:
                return 1;
            case window.innerWidth <= 1024:
                return 0.6;
            case window.innerWidth <= 1160:
                return 0.7;
            default:
                return 0.8;
        }
    };

    const getZoom = () => {
        switch (true) {
            case window.innerWidth >= 2200:
                return { maxZoom: 1.4 };
            case window.innerWidth >= 1900:
                return { maxZoom: 1.2 };
            case window.innerWidth >= 1700:
                return { maxZoom: 1 };
            case window.innerWidth >= 1500:
                return { maxZoom: 0.9 };
            case window.innerWidth <= 1024:
                return { maxZoom: 0.55 };
            case window.innerWidth <= 1160:
                return { maxZoom: 0.6 };
            case window.innerWidth <= 1400:
                return { maxZoom: 0.7 };
            default:
                return { maxZoom: 0.75 };
        }
    };

    return (
        <div
            style={{ width: props?.width || '96vw', height: props?.height || getHeight() }}
            {...(!props.openPopupHandler && props.screen !== 'summary' && { onClick: selectNode })}
        >
            {props.showAxisHeaders && (
                <div className={classes.overlayStyle}>
                    {linkedProblemDefinitions.map((problemDef, i) => {
                        if (problemDef.height) {
                            return (
                                <div
                                    key={`${problemDef.id}-${i}`}
                                    style={{
                                        height: problemDef.height,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div className={classes.yAxisTextStyle}>{problemDef.name}</div>
                                </div>
                            );
                        }
                    })}
                </div>
            )}
            {props.activeProblemDefId === props.linkedProblemDefinitionId && (
                <ReactFlow
                    zoomOnScroll={false}
                    zoomOnPinch={false}
                    zoomOnDoubleClick={false}
                    preventScrolling={false}
                    nodes={nodes}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    edges={edges}
                    proOptions={{ hideAttribution: true, account: 'paid-pro' }}
                    {...(props.screen === 'summary' && { minZoom: 0.6 })}
                    {...(props.screen === 'detailed' && { minZoom: getParams() })}
                    {...(props.screen === 'decisions' && getZoom())}
                    fitView
                />
            )}
            {/* {
                props.screen === 'summary' && <div className={classes.summarySubquestion} style={selectedNode === '11' ? { height: '28%' } : {}} />
            } */}
        </div>
    );
};

const AdvanceDecisionFlow = (props) => {
    return (
        <ReactFlowProvider>
            <Flow {...props} />
        </ReactFlowProvider>
    );
};

export default withTheme(AdvanceDecisionFlow);
