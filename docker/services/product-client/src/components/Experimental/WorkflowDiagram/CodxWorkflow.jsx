import { makeStyles } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import React, { useState, useCallback, useRef, Fragment } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    Controls,
    useNodesState,
    useEdgesState,
    MarkerType,
    ConnectionMode,
    useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import DesignIcon from '../../../assets/Icons/Design';
import PersonaIcon from '../../../assets/Icons/Persona';
import PlanIcon from '../../../assets/Icons/Plan';
import ImplementIcon from '../../../assets/Icons/Implement';
import CustomTextField from '../../Forms/CustomTextField.jsx';
import ShapeNode from './ShapeNode';
import Sidebar from './SideBarMenu';
import { DnDProvider, useDnD } from './DnDContext';

import ActionButtons from '../../dynamic-form/inputFields/ActionButtons';
import { triggerWidgetActionHandler } from 'services/widget.js';
import CustomSnackbar from 'components/CustomSnackbar.jsx';

const onInit = () => {};

const nodeTypes = {
    shape: ShapeNode
};

const mainBoxStyle = (backgroundColor, borderColor) => ({
    width: '206px',
    height: '65px',
    fontWeight: 400,
    color: '#ffffff',
    background: backgroundColor ? backgroundColor : '#011E3C',
    border: `0.5px solid ${borderColor ? borderColor : '#7ACFFF'}`
});

const customSubheadStyle = (subtype, subtextBackgroundColor, borderColor) => {
    const subtextBgColorDefault = subtype === 'insights' ? '#8FBDD3' : '#BCE29E';
    return {
        width: '184px',
        height: '83px',
        padding: '0',
        color: '#0B2744',
        background: subtextBackgroundColor || subtextBgColorDefault,
        verticalAlign: 'middle',
        border: `0.3px solid ${borderColor || '#FFFFFF'}`
    };
};

const edgeStyle = (text = '', animated = false, bgcolor = '', edgeColor = '', theme = 'dark') => {
    return {
        type: 'smoothstep',
        // Edit the offset for edges if edges are not appearing properly and are intersecting with each other. Try different values to see what works in you case.
        pathOptions: { offset: 5, borderRadius: 5 },
        style: { stroke: edgeColor ? edgeColor : theme === 'light' ? '#6883F7' : '#7ACFFF' },
        label: text,
        animated: animated,
        labelStyle: { fill: '#000', fontWeight: 'bold', fontSize: '12px' },
        labelBgPadding: [8, 4],
        labelBgBorderRadius: 4,
        labelBgStyle: { fill: bgcolor || '#ee7d31' }
    };
};

const useStyles = makeStyles((theme) => ({
    hoverStyle: {
        '&:hover': {
            opacity: 0.7
        }
    },
    personasStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'end',
        position: 'fixed',
        top: '6px',
        right: 0,
        width: '40px',
        '& > svg': {
            marginRight: '5px'
        }
    },
    legendWrapper: {
        width: '220px',
        border: '0.4px solid #ffffff44',
        borderRadius: '5px',
        padding: '10px 14px 10px',
        background: '#0E1F38',
        marginBottom: '9px'
    },
    legendItemWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        verticalAlign: 'middle',
        alignItems: 'center',
        marginBottom: '2px'
    },
    legendItemText: {
        fontSize: '12px',
        fontWeight: 300,
        color: '#ffffffaa',
        marginLeft: '12px',
        lineHeight: '13px'
    },
    approvalLetter: {
        borderRadius: '3px',
        width: '32px',
        height: '22px',
        fontSize: '14px',
        fontWeight: 500,
        color: '#000',
        textAlign: 'center',
        marginTop: '2px'
    },
    legendPresonaWrapper: {
        padding: '10px 15px 0 15px'
    },
    legendPersonaItemWrapper: {
        marginBottom: '10px'
    },
    legendPersonaText: {
        paddingTop: '3px'
    },
    appColHead: {
        display: 'flex',
        justifyContent: 'space-around',
        textAlign: 'center',
        width: '85%',
        alignItems: 'center'
    },
    colHeadContent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px'
    },
    iconSize: {
        height: '30px'
    },
    headText: {
        color: theme.palette.text.default,
        fontWeight: '500',
        fontSize: '14px',
        lineHeight: '25px',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        opacity: 0.8,
        marginTop: '8px'
    },
    bottomRight: {
        position: 'fixed',
        bottom: 0,
        right: 15
    },
    topRight: {
        position: 'fixed',
        top: 0,
        right: 0
    },
    hideLegends: {
        display: 'flex'
    },
    showLegends: {
        display: 'none'
    },
    categoryDropdown: {
        position: 'fixed',
        top: '-22px',
        right: 15,
        width: '150px'
    },
    wholefoodPersonas: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'end',
        position: 'fixed',
        top: '-9px',
        right: '-14px',
        '& > svg': {
            marginLeft: '-5px',
            background: '#091F3A',
            borderRadius: '50%'
        }
    },
    dndflow: {
        flexDirection: 'row',
        display: 'flex',
        flexGrow: 1,
        height: '100%',
        '& aside': {
            borderRight: '1px solid #eee',
            padding: '15px 10px',
            fontSize: '12px',
            background: '#fcfcfc',
            // theme === 'light'
            //                         ? '#6883F7'
            //                         : '#7ACFFF'
            width: '20%',
            maxWidth: '250px'
        },
        '& aside .description': {
            marginBottom: '10px'
        },
        '& .dndnode': {
            height: '20px',
            padding: '4px',
            border: '1px solid #1a192b',
            borderRadius: '2px',
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'grab'
        },
        '& .dndnode.input': {
            borderColor: '#0041d0'
        },
        '& .dndnode.output': {
            borderColor: '#ff0072'
        },
        '& .reactflowWrapper': {
            flexGrow: 1,
            height: '100%'
        },
        '& .selectall': {
            marginTop: '10px'
        }
    }
}));

const renderPersona = (color, tooltipText = '') => {
    return (
        <Tooltip id="tooltip-top" title={tooltipText} placement="top">
            <PersonaIcon color={color} />
        </Tooltip>
    );
};

const renderBox = (
    classes,
    id,
    heading,
    legendPersonas,
    subtext = [],
    navUrl = '',
    personas = [],
    node_info,
    style,
    textColor,
    backgroundColor,
    subtextColor,
    enableWholefoods,
    shape,
    type,
    theme
) => {
    const legendPersonasIdColorMapping = {};
    const isRectArrow = shape?.type === 'arrow-rect';

    // commenting out this, as it will be violation of hook call rule.
    // const theme = useTheme();

    legendPersonas?.forEach((legendPersona) => {
        legendPersonasIdColorMapping[legendPersona.id] = [legendPersona.color, legendPersona.text];
    });

    return (
        <React.Fragment>
            {node_info && (
                <div
                    id={id + '_head_info'}
                    style={{
                        fontWeight: subtext.length ? 300 : 400,
                        background: '#011E3C',
                        color: '#FFFFFF',
                        paddingBottom: '0.3rem'
                    }}
                >
                    {node_info}
                </div>
            )}
            <a
                target="_blank"
                style={{ textDecoration: 'none' }}
                href={enableWholefoods ? navUrl : 'javascript:void(0)'}
                className={navUrl ? classes.hoverStyle : ''}
                rel="noreferrer"
            >
                <div
                    id={id + '_head'}
                    style={{
                        fontWeight: subtext.length ? 300 : 400,
                        background: backgroundColor || '#011E3C',
                        color: textColor || theme.palette.text.default,
                        padding: '7px 0 7px 0',
                        ...(enableWholefoods
                            ? {
                                  letterSpacing: '1px',
                                  width: '100%',
                                  textAlign: 'center',
                                  fontSize: '13px',
                                  fontWeight: 300,
                                  lineHeight: '19px',
                                  padding: type === 'shape' ? '12px 12px 17px 14px' : '3px 0',
                                  background: 'none'
                              }
                            : null)
                    }}
                >
                    {heading}
                    {personas.length ? (
                        <div
                            className={
                                enableWholefoods ? classes.wholefoodPersonas : classes.personasStyle
                            }
                            style={isRectArrow ? { right: '6px' } : {}}
                        >
                            {personas.map((personaId) =>
                                renderPersona(
                                    legendPersonasIdColorMapping[personaId][0],
                                    legendPersonasIdColorMapping[personaId][1]
                                )
                            )}
                        </div>
                    ) : null}
                </div>
                {subtext.length ? (
                    <ul
                        style={{
                            textAlign: 'left',
                            paddingTop: '5px',
                            paddingLeft: '20px',
                            marginTop: 0,
                            marginBottom: 0,
                            fontSize: '10px',
                            color: subtextColor ? subtextColor : '#0B2744'
                        }}
                    >
                        {subtext.map((point, i) => (
                            <li key={'subText' + i}>{point}</li>
                        ))}
                    </ul>
                ) : null}
            </a>
        </React.Fragment>
    );
};

const renderWorkflowNodes = (
    elements,
    legendPersonas,
    classes,
    enableWholefoods,
    theme,
    onDeleteNode
) => {
    return elements.map(
        ({
            id,
            headingText,
            subtext,
            position,
            type,
            style,
            url,
            targetPosition,
            sourcePosition,
            personas = [],
            node_info,
            textColor,
            backgroundColor,
            subtextColor,
            borderColor,
            shape,
            isNodeDeletable
        }) => {
            let shapeData;
            if (type === 'shape') {
                shapeData = {
                    shape: shape.type,
                    width: shape.width,
                    height: shape.height,
                    color: backgroundColor,
                    strokeColor: borderColor,
                    selected: true
                };
            }
            return {
                id,
                type,
                data: {
                    label: renderBox(
                        classes,
                        id,
                        headingText,
                        legendPersonas,
                        subtext,
                        url,
                        personas,
                        node_info,
                        style,
                        textColor,
                        backgroundColor,
                        subtextColor,
                        enableWholefoods,
                        shape,
                        type,
                        theme
                    ),
                    ...shapeData,
                    isNodeDeletable,
                    onDelete: () => onDeleteNode(id)
                },
                position,
                style,
                targetPosition,
                sourcePosition,
                key: id
            };
        }
    );
};

const renderWorkflowEdges = (edges, theme) => {
    return edges.map(
        ({
            id,
            source,
            target,
            text,
            animated,
            bgcolor,
            edgeColor,
            sourceHandle,
            targetHandle
        }) => {
            return {
                id,
                source,
                target,
                sourceHandle,
                targetHandle,
                ...(text
                    ? {
                          markerEnd: {
                              type: MarkerType.ArrowClosed,
                              color: edgeColor
                                  ? edgeColor
                                  : theme === 'light'
                                  ? '#6883F7'
                                  : '#7ACFFF'
                          }
                      }
                    : null),
                ...edgeStyle(text, animated, bgcolor, edgeColor, theme)
            };
        }
    );
};

const renderLegend = (type, classes, data = []) => {
    switch (type) {
        case 'approvals':
            return (
                <div className={classes.legendWrapper}>
                    {data.map((approval) => (
                        <div key={approval.id} className={classes.legendItemWrapper}>
                            <div
                                className={classes.approvalLetter}
                                style={{ background: approval.color }}
                            >
                                {approval.text}
                            </div>
                            <div className={classes.legendItemText}>{approval.description}</div>
                        </div>
                    ))}
                </div>
            );
        case 'personas':
            return (
                <div className={`${classes.legendWrapper} ${classes.legendPresonaWrapper}`}>
                    {data.map((persona) => (
                        <div
                            key={persona.id}
                            className={`${classes.legendItemWrapper} ${classes.legendPersonaItemWrapper}`}
                        >
                            {renderPersona(persona.color)}
                            <div
                                className={`${classes.legendItemText} ${classes.legendPersonaText}`}
                            >
                                {persona.text}
                            </div>
                        </div>
                    ))}
                </div>
            );
    }
};

// Note: This can't be generalised. The required svgs for workflow component would need to be added manually
const getHeadSvg = (icon, color) => {
    switch (icon) {
        case 'DESIGN':
            return <DesignIcon color={color} />;
        case 'PLAN':
            return <PlanIcon color={color} />;
        case 'IMPLEMENT':
            return <ImplementIcon color={color} />;
        default:
            return null;
    }
};

const getImage = (img) => {
    return <img alt="Screen Icons" src={img} />;
};

const renderTopBar = (
    columnHeads,
    categoryDropdown,
    disableCategory,
    currentCategory,
    onChange,
    classes
) => {
    return (
        <div>
            <div className={classes.appColHead}>
                {columnHeads.map((head, index) => {
                    const icon = head?.icon && head.icon.toUpperCase();
                    return (
                        <Fragment key={`${head.text}-${index}`}>
                            <div className={classes.colHeadContent}>
                                {icon && (
                                    <div className={classes.iconSize}>
                                        {head?.iconOverride
                                            ? getImage(head.iconOverride)
                                            : getHeadSvg(icon, head.color)}
                                    </div>
                                )}
                                <div className={classes.headText}>{head.text}</div>
                            </div>
                        </Fragment>
                        // <div key={head.text}>
                        //     {getHeadSvg(icon, head.color)}
                        //     <div className={classes.headText}>{head.text}</div>
                        // </div>
                    );
                })}
            </div>
            {!disableCategory && (
                <div className={classes.categoryDropdown}>
                    <CustomTextField
                        field_info={{
                            is_select: true,
                            id: categoryDropdown.name,
                            fullWidth: true,
                            options: categoryDropdown.options,
                            value: currentCategory,
                            onChange,
                            label: categoryDropdown.name
                        }}
                    />
                </div>
            )}
        </div>
    );
};

const proOptions = { account: 'paid-pro', hideAttribution: true };

function Flow({ params, app_details }) {
    const theme = useTheme();
    const classes = useStyles();
    const reactFlowWrapper = useRef(null);
    const { project } = useReactFlow();
    const [type] = useDnD();

    const [elements] = useState(() => {
        params.elements.nodes.forEach((node) => {
            if (node.type !== 'shape' && node.styleVariant === 'mainBox') {
                node.style = mainBoxStyle(node?.backgroundColor, node?.borderColor);
            } else if (node.styleVariant.startsWith('subheadBox')) {
                const subheadType = node.styleVariant.split('-')[1];
                node.style = customSubheadStyle(
                    subheadType,
                    node.subtextBackgroundColor,
                    node.borderColor
                );
            }
        });
        return params.elements;
    });

    const [category, setCategory] = useState(null);
    const getInitialEdges = (theme) => renderWorkflowEdges(elements.edges, theme);

    const onDeleteNode = (nodeId) => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));

        setRawNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setRawEdges((eds) =>
            eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
        );
    };

    // eslint-disable-next-line no-unused-vars
    const [nodes, setNodes, onNodesChange] = useNodesState(
        renderWorkflowNodes(
            elements.nodes,
            elements['legend_personas'],
            classes,
            elements.enableWholefoods,
            theme,
            onDeleteNode
        )
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState(getInitialEdges(theme.props.mode));

    // separate state to manage the data in api payload for save action
    const [rawNodes, setRawNodes] = useState(elements.nodes);
    const [rawEdges, setRawEdges] = useState(elements.edges);

    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notification, setNotification] = useState(null);

    let [edgeIdx, nodeIdx] = [0, 0];

    const onConnect = useCallback(
        (params) => {
            params = {
                ...params,
                id: `${params.source}_${params.target}_${edgeIdx++}`,
                animated: true,
                bgcolor: '#377e22',
                edgeColor: '#3CBEEC'
            };

            const newEdge = renderWorkflowEdges([params], theme.props.mode);
            setEdges((existingEdges) => addEdge(newEdge[0], existingEdges));
            setRawEdges((existingEdges) => existingEdges.concat(params));
        },
        [setEdges]
    );

    const onChange = (value) => {
        setCategory(value);
    };

    const getId = (nodeId) => `${nodeId}-node-${++nodeIdx}`;

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            // check if the dropped element is valid
            if (!type) {
                return;
            }
            // project was renamed to screenToFlowPosition
            // and you don't need to subtract the reactFlowBounds.left/top anymore
            // details: https://reactflow.dev/whats-new/2023-11-10

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

            const position = project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top
            });

            const newNode = {
                id: getId(type.id),
                headingText: type.headingText,
                subtext: type.subtext,
                position,
                type: type.type,
                shape: type.shape,
                styleVariant: type.styleVariant,
                backgroundColor: type.backgroundColor,
                borderColor: type.borderColor,
                textColor: type.textColor,
                isNodeDeletable: true
            };

            const newNodeList = renderWorkflowNodes(
                [newNode],
                elements['legend_personas'],
                classes,
                elements.enableWholefoods,
                theme,
                onDeleteNode
            );

            if (newNodeList?.length) {
                setNodes((nds) => nds.concat(newNodeList[0]));
                setRawNodes((nds) => nds.concat(newNode));
            }
        },
        [project, type]
    );

    const handleSaveBtnClick = async (action_type, isSaveAction) => {
        if (rawNodes && rawNodes?.length) {
            try {
                const result = await triggerWidgetActionHandler({
                    screen_id: app_details?.screen_id,
                    app_id: app_details?.app_id,
                    payload: {
                        widget_value_id: app_details?.widget_value_id,
                        action_type: action_type,
                        data: {
                            nodes: rawNodes,
                            edges: rawEdges,
                            isSaveAction: isSaveAction
                        },
                        filters: JSON.parse(
                            sessionStorage.getItem(
                                'app_screen_filter_info_' +
                                    app_details?.app_id +
                                    '_' +
                                    app_details?.screen_id
                            )
                        )
                    },
                    callback: () => {
                        setNotificationOpen(true);
                        setNotification({
                            severity: 'success',
                            message: elements?.notificationConfig?.successMsg,
                            autoHideDuration: elements?.notificationConfig?.autoHideDuration
                        });
                    }
                });
                return result;
            } catch (err) {
                setNotificationOpen(true);
                setNotification({
                    severity: 'error',
                    message: elements?.notificationConfig?.failureMsg,
                    autoHideDuration: elements?.notificationConfig?.autoHideDuration
                });
            }
        } else {
            setNotificationOpen(true);
            setNotification({
                severity: 'warning',
                message: elements?.notificationConfig?.validationMsg,
                autoHideDuration: elements?.notificationConfig?.autoHideDuration
            });
        }
    };

    return (
        <Fragment>
            <CustomSnackbar
                open={notificationOpen && notification?.message}
                autoHideDuration={
                    notification?.autoHideDuration === undefined
                        ? 3000
                        : notification?.autoHideDuration
                }
                onClose={() => {
                    setNotificationOpen(false);
                    setNotification(null);
                }}
                severity={notification?.severity || 'success'}
                message={notification?.message}
            />
            <div className={classes.dndflow}>
                {elements.isDnd ? <Sidebar params={elements.sideMenuData} /> : null}
                <div className="reactflowWrapper" ref={reactFlowWrapper}>
                    {elements.enableWholefoods
                        ? renderTopBar(
                              elements.columnHeads,
                              elements.categoryDropdown,
                              elements?.disableCategory,
                              category,
                              onChange,
                              classes
                          )
                        : null}
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        proOptions={proOptions}
                        nodeTypes={nodeTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={onInit}
                        fitView
                        connectionMode={ConnectionMode.Loose}
                        style={{ width: '100%', height: '100%' }}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                    >
                        {/* if controlBarPosition is undefined, it's position will be default i.e. "bottom-left" */}
                        <Controls position={elements.controlBarPosition} />
                    </ReactFlow>
                    {elements.enableWholefoods ? (
                        <div
                            className={
                                elements.hideLegends
                                    ? classes.hideLegends
                                    : elements.enableWholefoods
                                    ? classes.bottomRight
                                    : classes.topRight
                            }
                        >
                            {elements['legend_approvals']
                                ? renderLegend('approvals', classes, elements['legend_approvals'])
                                : null}
                            {elements['legend_personas']
                                ? renderLegend('personas', classes, elements['legend_personas'])
                                : null}
                        </div>
                    ) : null}
                </div>
                {elements?.isSaveAction && elements?.saveActionConfig ? (
                    <div className={classes.bottomRight}>
                        <ActionButtons
                            params={
                                elements?.saveActionConfig?.value || [
                                    { name: 'save', variant: 'contained', action_type: 'save' }
                                ]
                            }
                            onClick={() =>
                                handleSaveBtnClick(
                                    elements?.saveActionConfig?.value[0]?.name,
                                    elements?.isSaveAction
                                )
                            }
                        />
                    </div>
                ) : null}
            </div>
        </Fragment>
    );
}

function OverviewFlow({ params, ...props }) {
    return (
        <ReactFlowProvider>
            <DnDProvider>
                <Flow params={params} {...props} />
            </DnDProvider>
        </ReactFlowProvider>
    );
}

export default OverviewFlow;
